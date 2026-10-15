#!/usr/bin/env node
/**
 * ouvrir-run.mjs — LE GESTE OUTILLÉ QUI POSE LE SOCLE D'OUVERTURE DE RUN APRÈS L'ADOPTION (TF-1697).
 *
 * LE FAIT (lot Produit-82 20261014a, RT-2). Après l'adoption, `docs\projet\` instancié, `README.md`,
 * `.env.example` et l'entrée `run_open` restaient à reconstituer à la main. La session a lu
 * `oracle-conformite-projet.mjs` (125 lignes) pour connaître les exigences, puis rejoué l'oracle trois
 * fois (3 FAIL, puis 4 FAIL, puis PASS). Aucun geste ne couvrait ce passage : l'adoption pose
 * l'héritage, l'ouverture de run attend un socle que personne ne pose.
 *
 * CE QU'IL FAIT, dans un projet DÉJÀ adopté (`forge\` présent) :
 *   1. `docs\projet\` : copie chaque fiche de `gabarits\docs-projet\` qui MANQUE (R-20) ;
 *   2. `README.md` : posé s'il manque (R-12), avec ses marqueurs à remplir ;
 *   3. `.env.example` : posé s'il manque (R-13), avec l'en-tête du socle et AUCUNE variable inventée
 *      — un projet documentaire déclaré n'en reçoit pas (TF-1439). Déclarer une variable que le
 *      projet ne lit pas pour faire passer R-13 est le défaut que TF-1439 a payé ;
 *   4. `run_open` : écrit au ledger par `ledger.mjs` de forge-agents (l'écrivain unique, jamais une
 *      copie), schéma 1.1, avec `forges_mobilisees` (donné par `--forges`) et `versions_forges`
 *      (mesurées sur les clones du parc). Sans `--run` ou `--forges`, il n'écrit RIEN au ledger et
 *      le dit : la liste des forges mobilisées se déclare, elle ne se devine pas ;
 *   5. joue `oracle-conformite-projet` et rend chaque FAIL restant comme un RESTE À FAIRE nommé —
 *      les marqueurs à remplir y figurent (R-20 ter), avec la règle qui les juge.
 *
 * PROPRIÉTÉS : NON DESTRUCTIF (aucun fichier existant n'est écrit), IDEMPOTENT (un second passage ne
 * pose rien), il n'écrit jamais un second `run_open` (un run de version suit `references\RUN-VERSION.md`).
 * GARDES : refuse le pilot, une forge du parc, un dossier sans `forge\` (l'adoption d'abord).
 *
 * Usage : node <PILOT_ROOT>\scripts\ouvrir-run.mjs [<projet>] [--run <id>] [--forges a,b] [--racine <parc>] [--essai] [--json]
 * Exit : 0 socle posé et conformité PASS · 1 socle posé, restes à faire · 2 usage ou refus.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { FORGES } from "./lib-parc.mjs";
import { typeProjetDeclare, TYPE_DOCUMENTAIRE } from "./adopter-projet-existant.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(ICI, "..");
const meme = (a, b) => (process.platform === "win32" ? resolve(a).toLowerCase() === resolve(b).toLowerCase() : resolve(a) === resolve(b));
export const GABARITS_DOCS = join(PILOT, "gabarits", "docs-projet");
/** Le chemin de l'écrivain du ledger, sous la racine du parc (CONTRAT-INTERFACE.md §3). */
export const LEDGER_MJS = join("digit-ai-forge-agents", ".claude", "skills", "forge-agents", "scripts", "ledger.mjs");

/** README minimal : ses marqueurs `<à …>` se remplissent, R-12 n'exige que sa présence. */
export function texteReadme(nom) {
  return [`# ${nom}`, "", "<à décrire : ce que fait ce projet, pour qui, en deux phrases>", "",
    "## Démarrer", "", "<à décrire : les commandes pour installer et lancer le projet en local>", "",
    "## Documentation", "", "Le socle documentaire vit sous `docs/projet/` (technos, paramétrage, commandes, accès de test).", ""].join("\n");
}
/** `.env.example` sans variable inventée : l'en-tête du socle et la consigne. */
export const TEXTE_ENV_EXEMPLE = ["# ne jamais renseigner de secret ici", "#",
  "# Déclarer ici TOUTES les variables que le projet lit (applicatives ET infra), une par ligne,",
  "# valeur sûre ou vide : NOM=valeur. Aucune n'est inventée par l'ouverture de run (R-13, TF-1439).", ""].join("\n");

/** Les versions des dépôts du parc clonés sous la racine : nom complet → commit court (R-19). */
export function versionsDuParc(racine) {
  const out = {};
  for (const nom of ["digit-ai-factory", ...FORGES.map((f) => f.nom)]) {
    const d = nom === "digit-ai-factory" && !existsSync(join(racine, nom)) ? PILOT : join(racine, nom);
    if (!existsSync(join(d, ".git"))) continue;
    const r = spawnSync("git", ["-C", d, "rev-parse", "--short", "HEAD"], { encoding: "utf8" });
    if (r.status === 0 && r.stdout.trim()) out[nom] = r.stdout.trim();
  }
  return out;
}

const lireLedger = (f) => existsSync(f)
  ? readFileSync(f, "utf8").split(/\r?\n/).filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { return null; } })
  : [];

export function ouvrirRun({ projet, run = null, forges = null, racine = process.env.FORGE_ROOT || dirname(PILOT), essai = false } = {}) {
  projet = resolve(projet);
  racine = resolve(racine);
  const refus = (motif) => ({ verdict: "REFUS", motif, faits: [], restes: [] });
  if (!existsSync(projet)) return refus(`dossier introuvable : ${projet}`);
  if (meme(projet, PILOT) || FORGES.some((f) => meme(projet, join(racine, f.nom)))) return refus("le pilot et les forges ne sont pas des produits : leur CLAUDE.md fait foi");
  if (!existsSync(join(projet, "forge"))) {
    return refus(`aucun forge\\ : ce projet n'est pas adopté — jouer d'abord node "${join(PILOT, "scripts", "adopter-projet-existant.mjs")}" "${projet}"`);
  }
  const faits = [], restes = [];
  const poser = (rel, contenu) => {
    const f = join(projet, ...rel.split("/"));
    if (existsSync(f)) { faits.push({ cible: rel, action: "laissé (déjà là)" }); return; }
    if (!essai) { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, contenu); }
    faits.push({ cible: rel, action: "posé" });
  };

  // 1. docs\projet\ (R-20) — les fiches du gabarit qui manquent, et elles seules.
  for (const n of readdirSync(GABARITS_DOCS).filter((x) => x.endsWith(".md")).sort()) {
    poser(`docs/projet/${n}`, readFileSync(join(GABARITS_DOCS, n)));
  }
  // 2. README.md (R-12).
  poser("README.md", texteReadme(basename(projet)));
  // 3. .env.example (R-13), sauf projet documentaire déclaré (TF-1439).
  const type = typeProjetDeclare(projet);
  if (type && type.type === TYPE_DOCUMENTAIRE) faits.push({ cible: ".env.example", action: "non posé : projet déclaré documentaire (TF-1439)" });
  else if (existsSync(join(projet, ".env.exemple"))) faits.push({ cible: ".env.exemple", action: "laissé (déjà là)" });
  else poser(".env.example", TEXTE_ENV_EXEMPLE);

  // 4. run_open, par l'écrivain unique du ledger.
  const ledger = join(projet, "forge", "ledger.jsonl");
  const ouverts = lireLedger(ledger).filter((e) => e && e.type === "run_open");
  const ecrivain = join(racine, LEDGER_MJS);
  const listeForges = String(forges || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (ouverts.length) faits.push({ cible: "forge/ledger.jsonl", action: `run_open DÉJÀ écrit (seq ${ouverts.map((e) => e.seq).join(", ")}) : rien ajouté — un run de version suit references\\RUN-VERSION.md` });
  else if (!run || !listeForges.length) restes.push({ regle: "run_open", ou: "forge/ledger.jsonl",
    message: "aucun run_open écrit : rejouer avec --run <id> et --forges <forges mobilisées> (schéma 1.1, CONTRAT-INTERFACE §3) — la liste se déclare, elle ne se devine pas" });
  else if (!existsSync(ecrivain)) restes.push({ regle: "run_open", ou: "forge/ledger.jsonl",
    message: `écrivain du ledger introuvable (${ecrivain}) : node bootstrap.mjs --pull dans le pilot, puis rejouer` });
  else {
    const payload = { type: "run_open", run, schema_ledger: "1.1", forges_mobilisees: listeForges, versions_forges: versionsDuParc(racine),
      ouvert_par: "scripts/ouvrir-run.mjs (TF-1697)" };
    if (essai) faits.push({ cible: "forge/ledger.jsonl", action: `run_open à écrire (essai) : ${JSON.stringify(payload)}` });
    else {
      const tmp = mkdtempSync(join(tmpdir(), "ouvrir-run-"));
      try {
        writeFileSync(join(tmp, "run_open.json"), JSON.stringify(payload), "utf8");
        const r = spawnSync(process.execPath, [ecrivain, "append", ledger, "--fichier", join(tmp, "run_open.json")], { encoding: "utf8" });
        if (r.status === 0) faits.push({ cible: "forge/ledger.jsonl", action: `run_open écrit par ledger.mjs (run ${run}, forges ${listeForges.join(", ")}, ${Object.keys(payload.versions_forges).length} version(s) de dépôts)` });
        else restes.push({ regle: "run_open", ou: "forge/ledger.jsonl", message: `ledger.mjs a refusé l'écriture (exit ${r.status}) : ${(r.stderr || r.stdout || "").trim().slice(0, 300)}` });
      } finally { rmSync(tmp, { recursive: true, force: true }); }
    }
  }

  // 5. ce qui reste à faire, dit par l'oracle de conformité lui-même (jamais une liste recopiée).
  let conformite = { verdict: "NON JOUÉ" };
  if (!essai) {
    const o = spawnSync(process.execPath, [join(PILOT, "oracles", "oracle-conformite-projet.mjs"), projet], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    try {
      const j = JSON.parse(o.stdout);
      conformite = { verdict: j.verdict };
      for (const f of (j.findings || []).filter((x) => x.statut === "FAIL")) restes.push({ regle: f.regle, ou: f.ou, message: f.message });
    } catch { conformite = { verdict: "ILLISIBLE", exit: o.status }; }
  }
  return { verdict: essai ? "ESSAI" : restes.length ? "RESTES" : "PRET", projet, faits, restes, conformite,
    poses: faits.filter((f) => f.action === "posé").length };
}

const lanceEnDirect = process.argv[1] && meme(process.argv[1], fileURLToPath(import.meta.url));
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const AVEC_VALEUR = ["--run", "--forges", "--racine"];
  const CONNUS = new Set([...AVEC_VALEUR, "--essai", "--json"]);
  const inconnus = args.filter((a, i) => a.startsWith("--") && !CONNUS.has(a));
  const valeur = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] ?? "" : null; };
  if (inconnus.length || AVEC_VALEUR.some((n) => valeur(n) === "")) {
    console.error("usage : node ouvrir-run.mjs [<projet>] [--run <id>] [--forges a,b] [--racine <parc>] [--essai] [--json]"
      + (inconnus.length ? ` — option inconnue : ${inconnus.join(" ")}` : " — une option attend sa valeur"));
    process.exit(2);
  }
  const projet = args.find((a, i) => !a.startsWith("--") && !AVEC_VALEUR.includes(args[i - 1])) || process.cwd();
  const r = ouvrirRun({ projet, run: valeur("--run"), forges: valeur("--forges"), essai: args.includes("--essai"),
    ...(valeur("--racine") ? { racine: valeur("--racine") } : {}) });
  if (args.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else if (r.verdict === "REFUS") console.error(`[REFUS] ${r.motif}`);
  else {
    console.log(`ouvrir-run — ${r.projet} · ${r.poses} élément(s) posé(s) · conformité ${r.conformite.verdict}`);
    for (const f of r.faits) console.log(`  [socle] ${f.cible} — ${f.action}`);
    if (r.restes.length) {
      console.log(`\nReste à faire avant d'ouvrir le run (${r.restes.length}) :`);
      for (const x of r.restes) console.log(`  ✗ ${x.regle} · ${x.ou} — ${x.message}`);
    }
  }
  process.exit(r.verdict === "REFUS" ? 2 : r.verdict === "RESTES" ? 1 : 0);
}
