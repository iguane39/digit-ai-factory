#!/usr/bin/env node
/**
 * renommer-livrable.mjs — RENOMMER UN LIVRABLE SOUS output/, LE TRACER ET LAISSER UN RENVOI (TF-2737, D-236 (a) du 23/11/2026).
 *
 * Pourquoi il existe. `oracles\hook-renommage-livrable.mjs` refuse `mv`, `git mv`, `Move-Item` et `Rename-Item` sur un livrable sous `output/` : un renommage sans trace casse le lien
 * « Livré : » d'une restitution qui nomme l'ancien chemin (14/11/2026 : la revue de l'indice g renommée en k, la restitution suivante liait un chemin disparu). Ce script est la voie
 * qui reste : il renomme, trace, et le renvoi que la trace porte (ancien chemin → nouveau) est celui que `oracles\hook-restitution.mjs` suit (`oracles\lib-renommages-livrables.mjs`).
 *
 * Ce qu'il fait, dans cet ordre, et rien d'autre.
 *   1. Il juge : la source est un FICHIER sous `output/` (pas un README), la destination reste sous `output/` et n'existe pas, aucun compagnon ne trouverait sa place prise.
 *   2. Il déplace le livrable et ses compagnons : les fichiers du même dossier dont le nom prolonge le sien (`<nom>.jugement.json`, `<nom>.boucle.json`) et ses caches d'oracle
 *      `.oracles\<dossier>\<nom>.oracles*` (le sceau se lit à côté du livrable, il reste valide). `git mv` pour un fichier suivi, un renommage simple pour un fichier non suivi.
 *   3. Il TRACE. Au pilot : `references\RENOMMAGES-LIVRABLES.jsonl`, une ligne par fichier déplacé (le journal que `ranger-dossiers.mjs` écrit déjà). Chez un produit : une entrée
 *      `deplacement_effectue` (`ancien`, `nouveau`, `motif`, `compagnons`) au ledger, par SON écrivain : `forge\ledger.py` quand il y est, sinon `ledger.mjs` de forge-agents ; un produit
 *      sans ledger de run écrit `forge\renommages-livrables.jsonl` (repli dit à l'écran). Le type existe aux deux écrivains : R-7 bis l'utilise déjà pour le déplacement vers `old\`.
 *   4. Une trace qui échoue défait le déplacement : un fichier renommé sans trace est précisément le défaut que ce script corrige.
 *
 * Le renvoi n'est PAS un fichier laissé sous l'ancien nom : il rouvrirait deux versions du même livrable dans le dossier (R-4, R-7 bis) et rendrait le nom à nouveau indisponible.
 * `--suivre <ancien chemin>` lit le renvoi et rend le chemin courant.
 *
 * Usage : node scripts\renommer-livrable.mjs --de <chemin> --vers <chemin | dossier\> [--motif <texte>] [--racine <dossier>] [--sec]
 *         node scripts\renommer-livrable.mjs --suivre <ancien chemin> [--racine <dossier>]
 *   `--vers` terminé par une barre oblique, ou qui désigne un dossier existant : le livrable garde son nom (`--vers output\04-plans\old\` pour une version remplacée, R-7 bis).
 *   `--racine` : le dépôt du livrable ; sans elle, le dépôt git qui contient la source. `--sec` dit ce qui serait fait et ne touche à rien.
 * Exit : 0 fait (ou à blanc) · 1 refus ou erreur (rien n'est laissé à moitié : le déplacement est défait).
 *
 * NON JUGÉ, dit : le nom de destination n'est pas jugé contre R-4 (nommage daté) ni le plafond de chemin, c'est le rôle de `oracle-conformite-projet` ; un dossier entier ne se renomme pas ici ;
 * les restitutions déjà écrites qui citent l'ancien chemin ne sont pas réécrites (un livrable remis ne se réécrit pas), elles se suivent par le renvoi.
 */
import { existsSync, mkdirSync, readdirSync, renameSync, statSync, appendFileSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { homedir } from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { JOURNAL_PILOT, JOURNAL_PRODUIT, LEDGER_PRODUIT, estPilot, suivreRenommage } from "../oracles/lib-renommages-livrables.mjs";

const NOM_NON_LIVRABLE = /^(?:README|LISEZMOI)\.md$/i;
const versSlash = (p) => String(p || "").replace(/\\/g, "/");

function lireArguments(argv) {
  const sortie = { sec: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--sec") sortie.sec = true;
    else if (["--de", "--vers", "--motif", "--racine", "--suivre"].includes(a)) { sortie[a.slice(2)] = argv[++i]; if (sortie[a.slice(2)] === undefined) throw new Error(`${a} sans valeur`); }
    else throw new Error(`argument inconnu : ${a}`);
  }
  return sortie;
}

/**
 * La racine du dépôt d'un fichier : le dossier qui contient son premier segment `output` (un livrable est `<racine>/output/…`, dépôt git ou non), à défaut le dépôt git qui contient le
 * fichier, à défaut son dossier. `--racine` désigne la racine quand l'arbre porte un autre dossier `output` plus haut.
 */
function racineDe(complet) {
  const m = /^(.*?)[\\/]output[\\/]/i.exec(complet);
  if (m) return resolve(m[1]);
  const r = spawnSync("git", ["-C", dirname(complet), "rev-parse", "--show-toplevel"], { encoding: "utf8" });
  return r.status === 0 && r.stdout.trim() ? resolve(r.stdout.trim()) : resolve(dirname(complet));
}
const estFichier = (p) => { try { return statSync(p).isFile(); } catch { return false; } };
const estDossier = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };
const relatif = (racine, p) => versSlash(relative(racine, p));

/** Les compagnons d'un livrable : { de, vers } en chemins complets, pour une destination donnée. */
function compagnonsDe(racine, source, destination) {
  const paires = [];
  const dossier = dirname(source), nom = basename(source), nomNeuf = basename(destination);
  for (const n of readdirSync(dossier)) {
    if (n === nom || !n.startsWith(nom + ".")) continue;
    if (estFichier(join(dossier, n))) paires.push({ de: join(dossier, n), vers: join(dirname(destination), nomNeuf + n.slice(nom.length)) });
  }
  const cacheDe = join(racine, ".oracles", dirname(relatif(racine, source)));
  if (estDossier(cacheDe)) {
    const cacheVers = join(racine, ".oracles", dirname(relatif(racine, destination)));
    for (const n of readdirSync(cacheDe)) {
      if (n.startsWith(nom + ".oracles") && estFichier(join(cacheDe, n))) paires.push({ de: join(cacheDe, n), vers: join(cacheVers, nomNeuf + n.slice(nom.length)) });
    }
  }
  return paires;
}

const suivis = (racine, fichiers) => {
  const r = spawnSync("git", ["-C", racine, "ls-files", "-z", "--", ...fichiers.map((f) => relatif(racine, f))], { encoding: "utf8", maxBuffer: 1 << 24 });
  return r.status === 0 ? new Set(r.stdout.split("\0").filter(Boolean).map((p) => p.toLowerCase())) : new Set();
};

/** Le canal de trace, jugé AVANT le déplacement. */
function canalDeTrace(racine) {
  if (estPilot(racine)) return { type: "journal-pilot", fichier: join(racine, JOURNAL_PILOT), libelle: `journal du pilot ${JOURNAL_PILOT}` };
  const ledger = join(racine, LEDGER_PRODUIT);
  let rempli = false;
  try { rempli = existsSync(ledger) && readFileSync(ledger, "utf8").trim().length > 0; } catch { /* illisible : repli */ }
  if (rempli && existsSync(join(racine, "forge", "ledger.py"))) {
    const python = ["python", "py", "python3"].find((p) => spawnSync(p, ["--version"], { encoding: "utf8" }).status === 0);
    if (python) return { type: "ledger-py", python, ledger: join(racine, "forge", "ledger.py"), libelle: "ledger du produit, par forge/ledger.py" };
  }
  if (rempli) {
    const racines = [process.env.FORGE_ROOT, dirname(racine), "c:\\dev", join(homedir(), ".digit-ai-forge")].filter(Boolean);
    for (const r of racines) {
      const mjs = join(r, "digit-ai-forge-agents", ".claude", "skills", "forge-agents", "scripts", "ledger.mjs");
      if (existsSync(mjs)) return { type: "ledger-mjs", mjs, ledger, libelle: "ledger du produit, par ledger.mjs de forge-agents" };
    }
  }
  return { type: "journal-produit", fichier: join(racine, JOURNAL_PRODUIT), libelle: `repli ${JOURNAL_PRODUIT} (aucun ledger de run exploitable chez ce produit)` };
}

/** Écrit la trace ; lève en cas d'échec. `deplaces` : [{ ancien, nouveau }] relatifs, le livrable en premier. */
function tracer(canal, deplaces, motif) {
  const ts = new Date().toISOString();
  if (canal.type === "journal-pilot" || canal.type === "journal-produit") {
    mkdirSync(dirname(canal.fichier), { recursive: true });
    appendFileSync(canal.fichier, deplaces.map((d) => JSON.stringify({ ts, ancien: d.ancien, nouveau: d.nouveau, motif })).join("\n") + "\n", "utf8");
    return;
  }
  const [principal, ...compagnons] = deplaces;
  if (canal.type === "ledger-py") {
    const r = spawnSync(canal.python, [canal.ledger, "deplacement_effectue", "--ancien", principal.ancien, "--nouveau", principal.nouveau, "--motif", motif,
      "--compagnons", JSON.stringify(compagnons), "--par", "scripts/renommer-livrable.mjs"], { encoding: "utf8", env: { ...process.env, PYTHONUTF8: "1" } });
    if (r.status !== 0) throw new Error(`l'écrivain du ledger (forge/ledger.py) a refusé l'entrée (sortie ${r.status}) : ${(r.stderr || r.stdout || "").trim().slice(0, 300)}`);
    return;
  }
  const entree = JSON.stringify({ type: "deplacement_effectue", ancien: principal.ancien, nouveau: principal.nouveau, motif, compagnons, par: "scripts/renommer-livrable.mjs" });
  const r = spawnSync(process.execPath, [canal.mjs, "append", canal.ledger, entree], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`l'écrivain du ledger (ledger.mjs) a refusé l'entrée (sortie ${r.status}) : ${(r.stderr || r.stdout || "").trim().slice(0, 300)}`);
}

function suivre(args) {
  const complet = resolve(args.suivre);
  const racine = args.racine ? resolve(args.racine) : racineDe(complet);
  const rel = relatif(racine, complet);
  const r = suivreRenommage(racine, rel);
  if (!r) {
    const existe = estFichier(complet);
    console.log(existe ? `${rel} : aucun renvoi, le fichier est à son chemin.` : `${rel} : aucun renvoi connu (ni fichier à ce chemin) — ni ${JOURNAL_PILOT}, ni ${LEDGER_PRODUIT}, ni ${JOURNAL_PRODUIT} ne le nomment.`);
    return existe ? 0 : 1;
  }
  console.log(`${rel} → ${r.chemin} (${r.etapes} renommage${r.etapes > 1 ? "s" : ""})${estFichier(r.complet) ? "" : " — ATTENTION : le fichier n'est pas à ce chemin"}`);
  return estFichier(r.complet) ? 0 : 1;
}

function renommer(args) {
  if (!args.de || !args.vers) throw new Error("--de et --vers sont exigés (usage en tête du script)");
  const source = resolve(args.de);
  if (!estFichier(source)) throw new Error(`la source n'est pas un fichier existant : ${args.de} (un dossier entier ne se renomme pas ici)`);
  const racine = args.racine ? resolve(args.racine) : racineDe(source);
  const relSource = relatif(racine, source);
  if (relSource.startsWith("../") || !/^output\//i.test(relSource)) throw new Error(`la source n'est pas sous output/ de ${racine} : ${relSource} — ce script ne renomme que les livrables`);
  if (NOM_NON_LIVRABLE.test(basename(source))) throw new Error(`${basename(source)} est régénéré par hook, ce n'est pas un livrable`);
  const versBrut = args.vers;
  const vaDansDossier = /[\\/]$/.test(versBrut) || estDossier(resolve(versBrut));
  const destination = vaDansDossier ? join(resolve(versBrut), basename(source)) : resolve(versBrut);
  const relDestination = relatif(racine, destination);
  if (relDestination.startsWith("../") || !/^output\//i.test(relDestination)) throw new Error(`la destination n'est pas sous output/ de ${racine} : ${relDestination}`);
  if (resolve(destination).toLowerCase() === source.toLowerCase()) throw new Error("la destination est la source : rien à renommer");
  if (existsSync(destination)) throw new Error(`la destination existe déjà : ${relDestination} — un livrable n'en écrase jamais un autre`);
  const compagnons = compagnonsDe(racine, source, destination);
  const pris = compagnons.filter((c) => existsSync(c.vers));
  if (pris.length) throw new Error(`la place d'un compagnon est prise : ${pris.map((c) => relatif(racine, c.vers)).join(" ; ")} — rien n'est déplacé`);
  const motif = (args.motif || "").trim() || "renommage d'un livrable par scripts/renommer-livrable.mjs";
  const canal = canalDeTrace(racine);
  const paires = [{ de: source, vers: destination }, ...compagnons];
  const deplaces = paires.map((p) => ({ ancien: relatif(racine, p.de), nouveau: relatif(racine, p.vers) }));
  if (args.sec) {
    console.log(`À BLANC — ${deplaces.length} fichier(s) à déplacer, trace : ${canal.libelle}`);
    for (const d of deplaces) console.log(`  ${d.ancien} → ${d.nouveau}`);
    return 0;
  }
  const suivi = suivis(racine, paires.map((p) => p.de));
  const faits = [];
  const defaire = () => { for (const f of faits.reverse()) { try { if (f.git) execFileSync("git", ["-C", racine, "mv", "--", relatif(racine, f.vers), relatif(racine, f.de)], { stdio: "ignore" }); else renameSync(f.vers, f.de); } catch { /* défaire au mieux */ } } };
  try {
    for (const p of paires) {
      mkdirSync(dirname(p.vers), { recursive: true });
      const git = suivi.has(relatif(racine, p.de).toLowerCase());
      if (git) execFileSync("git", ["-C", racine, "mv", "--", relatif(racine, p.de), relatif(racine, p.vers)], { stdio: "pipe" });
      else renameSync(p.de, p.vers);
      faits.push({ ...p, git });
    }
    tracer(canal, deplaces, motif);
  } catch (e) {
    defaire();
    throw new Error(`${e.message} — le déplacement est défait, rien n'est renommé`);
  }
  console.log(`RENOMMÉ : ${deplaces[0].ancien} → ${deplaces[0].nouveau}${deplaces.length > 1 ? ` (+ ${deplaces.length - 1} compagnon${deplaces.length > 2 ? "s" : ""})` : ""}`);
  console.log(`TRACE : ${canal.libelle}`);
  console.log(`RENVOI : \`node ${versSlash(fileURLToPath(import.meta.url))} --suivre "${deplaces[0].ancien}"\` rend le chemin courant ; la ligne « Livré : » de la restitution lie le NOUVEAU chemin, le hook de restitution suit l'ancien.`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase()) {
  try {
    const args = lireArguments(process.argv.slice(2));
    process.exit(args.suivre ? suivre(args) : renommer(args));
  } catch (e) {
    console.error(`renommer-livrable : ${e.message}`);
    process.exit(1);
  }
}
