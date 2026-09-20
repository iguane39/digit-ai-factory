#!/usr/bin/env node
/**
 * simuler-recette-hebergee.mjs — rejoue EN LOCAL l'exécution hébergée du circuit
 * `ci/hebergee/recette-pilot.yml`, pour que son verdict soit prononcé AVANT le geste d'activation
 * (TF-1133, 15/09/2026).
 *
 * LE FAIT QUI L'A FAIT NAÎTRE. Le circuit a été construit pour D-12 (a) et jugé par son banc
 * (`scripts/recette-pilot-hebergee.test.mjs`), qui lit le fichier YAML et jamais son exécution.
 * Rejoué à la main sur un clone frais, sans ce poste, le harnais rendait 7 recettes en défaut sur
 * 115, contre 115/115 ici : trois recettes ne passaient que sur l'arbre de leur auteur, et quatre
 * contrôles du parc réel jugeaient un parc absent. Le circuit aurait été rouge à sa première
 * exécution. Un banc qui juge un fichier dit que le fichier est bien écrit ; il ne dit pas ce que
 * le runner rendra.
 *
 * CE QUE CE SCRIPT REJOUE, ET D'OÙ IL LE TIENT. Il lit le circuit DANS LE CLONE, pas une copie
 * écrite ici : ce qu'il simule ne peut pas dériver de ce qui s'exécutera.
 *   · le pilot est cloné depuis son HEAD local (ce que le geste d'activation publierait), à la
 *     profondeur que le circuit demande (`fetch-depth`, 1 par défaut comme `actions/checkout`) ;
 *   · chaque dépôt frère déclaré par un `repository:` est cloné depuis son adresse PUBLIQUE, sans
 *     aucun assistant d'identification : un dépôt privé échoue ici comme il échouerait sur le
 *     runner, qui n'a aucun secret. `--freres-locaux` les prend sur ce poste (hors ligne), et le dit ;
 *   · l'environnement est celui d'un runner, pas de ce poste : aucune variable `FORGE_*` ni
 *     `CLAUDE*` héritée, un répertoire personnel VIDE (donc ni `~/.claude`, ni configuration git
 *     globale), `CI=true`, et `FORGE_ROOT` seulement si le circuit le pose ;
 *   · chaque `run:` du circuit est joué, dans son `working-directory`.
 *
 * CE QU'IL NE REJOUE PAS (déclaré plutôt que promis). La chaîne d'outils est celle de ce poste :
 * Node, Python et leurs paquets (playwright compris) ne sont pas ceux d'`ubuntu-latest`. Le
 * système de fichiers est Windows, insensible à la casse, là où le runner est Linux. Le runner
 * s'arrête au premier pas en échec ; la simulation les joue tous, pour tout nommer d'un coup.
 *
 * Usage : node scripts/simuler-recette-hebergee.mjs [--racine <dossier court et vide>]
 *                                                    [--freres-locaux] [--garder] [--delai-min 25]
 * Exit : 0 VERT (verdict prononçable) · 1 ROUGE (défauts nommés) · 2 NON JOUABLE (clone impossible,
 *        circuit illisible, racine occupée).
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(ICI, "..");
export const CHEMIN_CIRCUIT = join("ci", "hebergee", "recette-pilot.yml");

/**
 * Ce que le circuit demande, lu ligne à ligne (aucun parseur YAML dans ce dépôt, même limite que le
 * banc du circuit) : les pas `uses: actions/checkout`, avec leur `repository`, `path` et
 * `fetch-depth` ; les pas `run`, avec leur `working-directory` ; et le bloc `env:` du travail.
 */
export function lireCircuit(texte) {
  const lignes = String(texte).split(/\r?\n/);
  const pas = [];
  const env = {};
  let courant = null, dansEnv = false, indentEnv = 0;
  for (const brute of lignes) {
    const ligne = brute.replace(/\s+#.*$/, "");
    if (!ligne.trim() || /^\s*#/.test(brute)) continue;
    const indent = ligne.match(/^ */)[0].length;
    const debutPas = /^\s*-\s+(name|uses|run):/.test(ligne);
    if (debutPas) { courant = { indent }; pas.push(courant); dansEnv = false; }
    if (/^\s*env:\s*$/.test(ligne) && !courant) { dansEnv = true; indentEnv = indent; continue; }
    if (dansEnv) {
      if (indent <= indentEnv) dansEnv = false;
      else { const m = ligne.match(/^\s*([A-Z_][A-Z0-9_]*):\s*"?([^"]*)"?\s*$/); if (m) env[m[1]] = m[2]; continue; }
    }
    if (/^\s*steps:\s*$/.test(ligne)) { courant = null; continue; }
    if (!courant) continue;
    const m = ligne.match(/^\s*-?\s*(uses|run|repository|path|fetch-depth|working-directory|name):\s*"?([^"]*?)"?\s*$/);
    if (m) courant[m[1]] = m[2];
  }
  const checkouts = pas.filter((p) => /^actions\/checkout@/.test(p.uses || ""));
  const principal = checkouts.find((p) => !p.repository) || null;
  return {
    env,
    principal: principal ? { path: principal.path || "", profondeur: Number(principal["fetch-depth"] ?? 1) } : null,
    freres: checkouts.filter((p) => p.repository).map((p) => ({
      repository: p.repository, nom: p.repository.split("/").pop(),
      path: p.path || p.repository.split("/").pop(), profondeur: Number(p["fetch-depth"] ?? 1),
    })),
    commandes: pas.filter((p) => p.run).map((p) => ({ nom: p.name || p.run, run: p.run, dossier: p["working-directory"] || "" })),
  };
}

/**
 * Les défauts qu'une sortie de pas nomme : lignes d'échec du harnais (`[ECHEC ]`, `[MANQUE]`,
 * `[CAS PERDUS]`, `[RECETTE DISPARUE]`) et d'une recette à cas (`[FAIL]`). Un pas en échec qui
 * n'en nomme aucun rend quand même un défaut : un code de sortie non nul ne se tait pas.
 */
export function defautsDeSortie(texte, code) {
  const defauts = String(texte).split(/\r?\n/)
    .filter((l) => /^\s*\[(ECHEC |MANQUE|CAS PERDUS|RECETTE DISPARUE|FAIL)\]/.test(l))
    .map((l) => l.trim().slice(0, 240));
  if (code !== 0 && !defauts.length) defauts.push(`pas en échec (code ${code}) sans ligne de défaut lisible`);
  return defauts;
}

/** Le verdict de l'ensemble : VERT seulement si chaque pas est sorti à 0. */
export function verdictDesPas(pas) {
  const rouges = pas.filter((p) => p.code !== 0);
  return { verdict: rouges.length ? "ROUGE" : "VERT", defauts: rouges.flatMap((p) => p.defauts.map((d) => `${p.nom} · ${d}`)) };
}

const git = (args, opts = {}) => spawnSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts });
const horloge = () => new Date().toISOString().slice(11, 19);
const dire = (m) => console.log(`[simulation ${horloge()}] ${m}`);

/** L'adresse publique d'un frère : le propriétaire du pilot, comme `github.repository_owner`. */
function adressePublique(repository) {
  const origine = git(["-C", PILOT, "remote", "get-url", "origin"]).stdout.trim();
  const m = origine.match(/github\.com[/:]([^/]+)\//);
  const proprietaire = m ? m[1] : null;
  const cible = repository.replace(/\$\{\{\s*github\.repository_owner\s*\}\}/, proprietaire || "?");
  if (cible.includes("?")) return null;
  return `https://github.com/${cible}.git`;
}

function jouer(commande, cwd, env, delaiMs, fichierSortie) {
  return new Promise((ok) => {
    const enfant = spawn(commande, { cwd, env, shell: true });
    let sortie = "";
    const recevoir = (flux) => (bloc) => { const t = bloc.toString("utf8"); sortie += t; flux.write(t); };
    enfant.stdout.on("data", recevoir(process.stdout));
    enfant.stderr.on("data", recevoir(process.stderr));
    const minuteur = setTimeout(() => { sortie += `\n[DÉLAI DÉPASSÉ] ${delaiMs / 60000} min\n`; enfant.kill(); }, delaiMs);
    enfant.on("close", (code) => {
      clearTimeout(minuteur);
      writeFileSync(fichierSortie, sortie, "utf8");
      ok({ code: code ?? 1, sortie });
    });
  });
}

async function principal() {
  const args = process.argv.slice(2);
  const lire = (nom, defaut) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : defaut; };
  const freresLocaux = args.includes("--freres-locaux");
  const delaiMs = Number(lire("--delai-min", "25")) * 60000;
  const nonJouable = (motif) => { console.log(JSON.stringify({ outil: "simuler-recette-hebergee", verdict: "NON JOUABLE", motif }, null, 1)); process.exit(2); };

  const racine = resolve(lire("--racine", "") || mkdtempSync(join(tmpdir(), "rph-")));
  if (existsSync(racine) && readdirSync(racine).length) nonJouable(`la racine ${racine} n'est pas vide — une simulation se joue sur une racine neuve, sans rien de ce poste`);
  mkdirSync(racine, { recursive: true });
  const head = git(["-C", PILOT, "rev-parse", "--short", "HEAD"]).stdout.trim();
  dire(`racine ${racine} · pilot ${basename(PILOT)} à ${head} (HEAD local : ce que l'activation publierait)`);

  const texteCircuit = git(["-C", PILOT, "show", `HEAD:${CHEMIN_CIRCUIT.split("\\").join("/")}`]);
  if (texteCircuit.status !== 0) nonJouable(`circuit ${CHEMIN_CIRCUIT} illisible à HEAD`);
  const circuit = lireCircuit(texteCircuit.stdout);
  if (!circuit.principal) nonJouable("le circuit ne récupère pas le dépôt (aucun pas actions/checkout sans `repository`)");
  if (!circuit.commandes.length) nonJouable("le circuit ne joue aucune commande (`run:`)");

  // Git sans ce poste : aucun assistant d'identification, aucune invite — un dépôt privé échoue.
  const envGit = { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never" };
  const cloner = (source, cible, profondeur, locale) => {
    const a = ["-c", "core.longpaths=true", "-c", "credential.helper=", "clone", "--quiet"];
    if (locale) a.push("--no-local");
    if (profondeur > 0) a.push("--depth", String(profondeur));
    a.push(source, cible);
    return git(a, { env: envGit });
  };
  // Sans `path:`, actions/checkout pose le dépôt À LA RACINE de l'espace de travail : les pas s'y
  // jouent. Avec `path:`, l'espace de travail est le parent commun du pilot et de ses frères.
  const cheminPilot = join(racine, circuit.principal.path || basename(PILOT));
  const espace = circuit.principal.path ? racine : cheminPilot;
  dire(`clone du pilot, profondeur ${circuit.principal.profondeur === 0 ? "complète (fetch-depth: 0)" : circuit.principal.profondeur}`);
  const cp = cloner(PILOT, cheminPilot, circuit.principal.profondeur, true);
  if (cp.status !== 0) nonJouable(`clone du pilot impossible : ${cp.stderr.trim().slice(0, 300)}`);
  if (!circuit.freres.length) dire("aucun dépôt frère déclaré par le circuit : le runner n'aura que le pilot");
  for (const f of circuit.freres) {
    const source = freresLocaux ? join(dirname(PILOT), f.nom) : adressePublique(f.repository);
    if (!source) nonJouable(`adresse du frère ${f.repository} indéductible de l'origine du pilot`);
    dire(`clone du frère ${f.nom} depuis ${freresLocaux ? "ce poste (--freres-locaux : pas l'état publié)" : source}`);
    const cf = cloner(source, join(espace, f.path), f.profondeur, freresLocaux);
    if (cf.status !== 0) nonJouable(`frère ${f.repository} impossible à cloner sans identifiant — le runner, qui n'a aucun secret, échouera de même : ${cf.stderr.trim().slice(0, 300)}`);
  }

  // L'environnement d'un runner : rien de ce poste.
  const maison = join(racine, "_maison");
  mkdirSync(maison, { recursive: true });
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(FORGE_|CLAUDE)/i.test(k)));
  Object.assign(env, { HOME: maison, USERPROFILE: maison, CI: "true", GITHUB_ACTIONS: "true", GITHUB_WORKSPACE: espace });
  for (const [k, v] of Object.entries(circuit.env)) env[k] = v.replace(/\$\{\{\s*github\.workspace\s*\}\}/, espace);
  dire(`environnement : HOME vide, CI=true${env.FORGE_ROOT ? `, FORGE_ROOT=${env.FORGE_ROOT}` : ", FORGE_ROOT non posé (le circuit ne le pose pas)"}`);

  const pas = [];
  for (const [i, c] of circuit.commandes.entries()) {
    const cwd = join(espace, c.dossier);
    dire(`pas ${i + 1}/${circuit.commandes.length} — ${c.nom} (\`${c.run}\` dans ${c.dossier || "l'espace de travail"}), délai ${delaiMs / 60000} min`);
    const r = await jouer(c.run, cwd, env, delaiMs, join(racine, `sortie-pas-${i + 1}.txt`));
    pas.push({ nom: c.nom, run: c.run, code: r.code, defauts: defautsDeSortie(r.sortie, r.code) });
    dire(`pas ${i + 1} : code ${r.code}`);
  }
  // Ce que les recettes ont écrit dans le clone : un constat, pas un verdict.
  const ecrits = git(["-C", cheminPilot, "status", "--short"]).stdout.split(/\r?\n/).filter(Boolean);
  const { verdict, defauts } = verdictDesPas(pas);
  const rapport = {
    outil: "simuler-recette-hebergee", verdict, pilot: head, racine,
    freres: circuit.freres.map((f) => `${f.nom} (${freresLocaux ? "ce poste" : "adresse publique"})`),
    profondeur_pilot: circuit.principal.profondeur,
    pas: pas.map((p) => ({ nom: p.nom, code: p.code, defauts: p.defauts.length })),
    defauts,
    ecrits_par_les_recettes_dans_le_clone: ecrits,
    non_rejoue: [
      "la chaîne d'outils : Node, Python et leurs paquets sont ceux de ce poste, pas ceux d'ubuntu-latest",
      "le système de fichiers : Windows, insensible à la casse, là où le runner est Linux",
      "l'arrêt au premier pas en échec : le runner s'arrête, la simulation joue tous les pas pour tout nommer",
    ],
  };
  writeFileSync(join(racine, "verdict.json"), JSON.stringify(rapport, null, 1), "utf8");
  if (!args.includes("--garder")) {
    for (const d of [cheminPilot, maison, ...circuit.freres.map((f) => join(espace, f.path))])
      rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
  console.log(JSON.stringify(rapport, null, 1));
  dire(`verdict ${verdict}${defauts.length ? ` — ${defauts.length} défaut(s)` : ""} · sorties et verdict.json sous ${racine}`);
  process.exit(verdict === "VERT" ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await principal();
