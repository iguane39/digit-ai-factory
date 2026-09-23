#!/usr/bin/env node
/**
 * oracle-enclenchement.mjs — LES ORACLES QUI DEVAIENT TOURNER SUR UN RUN ONT-ILS TOURNÉ ?
 * (TF-1319, décision humaine D-13 (a) du 23/09/2026 : temps 3 du verdict O3 de l'étude
 * `output/03-etudes/20260819-etude-opportunite-meta-oracle-enclenchement.md`.)
 *
 * ============================================================================================
 * LA QUESTION, ET POURQUOI IL A FALLU TROIS TEMPS POUR Y RÉPONDRE
 * ============================================================================================
 *
 * Le 19/08/2026, l'humain a demandé s'il existait un oracle qui vérifie que les oracles qui
 * auraient dû s'enclencher se sont enclenchés. La réponse était non, et le trou n'était pas où on
 * le cherchait : le juge manquait moins que son ENTRÉE. Huit entrées `oracles_verdict` d'un même
 * ledger portaient six formes de champs — la liste de ce qui avait tourné n'était pas calculable.
 * D'où l'ordre, déclaré bloquant par l'étude :
 *   1. le schéma de l'événement et son contrôle au ledger (TF-0385, clos le 19/08) : ce qui A
 *      tourné devient calculable ;
 *   2. la découverte, dépôt par dépôt (`oracles/decouvrir-oracles.mjs`, contrat
 *      `digit-ai/decouverte-oracles@1`, CONTRAT-INTERFACE.md §3) : ce qui AURAIT DÛ tourner se lit
 *      sur le disque, jamais dans une liste écrite à la main ;
 *   3. ce juge, qui confronte l'un à l'autre.
 *
 * ============================================================================================
 * LA CONFRONTATION N'EST PAS RÉÉCRITE ICI
 * ============================================================================================
 *
 * forge-tests porte depuis le 18/08 le mécanisme générique « un terme PROMIS, un terme SERVI, trois
 * issues, l'asymétrie inscrite une fois » (`forge_tests/confrontation.py`, TF-0371). Ce juge en est
 * une INSTANCE : la promesse est la liste découverte d'une forge mobilisée, le service la liste des
 * oracles nommés par les entrées `oracles_verdict` du run. Il APPELLE le mécanisme, chargé par son
 * chemin — il ne le recopie pas : une seconde copie divergerait au premier amendement, et c'est le
 * défaut même que ce juge existe pour voir, un cran plus haut. Sans forge-tests clonée sous la
 * racine du parc, ou sans interpréteur Python, il rend SKIP motivé : il ne sait pas confronter, il
 * ne fait pas semblant.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ
 * ============================================================================================
 *
 *   EN1 · chaque oracle DÉCOUVERT dans une forge MOBILISÉE par le run porte au moins une entrée
 *         `oracles_verdict` canonique (`oracle` et `verdict` renseignés) sur ce run. Un verdict
 *         SKIP ou NA COMPTE : « a tourné sans pouvoir juger » n'est pas « n'a pas tourné ». FAIL
 *         nomme chaque promesse non servie, forge par forge — un total anonyme ne se répare pas.
 *   EN2 · un verdict consigné pour un oracle qu'aucune forge mobilisée ne découvre est SIGNALÉ,
 *         jamais accusé — l'asymétrie du mécanisme : « hors mobilisation » s'il appartient à un
 *         autre dépôt du parc (la liste des forges mobilisées est peut-être incomplète),
 *         « inconnu » sinon (un nom libre, un contrôle ad hoc, une commande).
 *
 * LA PROMESSE SE LIT À LA VERSION QUE LE RUN A CONSIGNÉE. La découverte lit le disque d'aujourd'hui ;
 * un oracle absent de la version de la forge que le run a inscrite dans `versions_forges` (R-19)
 * n'a pas pu y tourner : son jugement est SUSPENDU, motif dit (le mécanisme porte cette issue). Sans
 * version consignée, ou avec une version inconnue du clone local, la promesse reste celle
 * d'aujourd'hui et le risque d'accuser à tort est écrit au non_juge. Le fait qui l'impose, mesuré
 * au premier passage sur un ledger réel, est en tête de `fichiersALaVersion`.
 *
 * LE NOM D'UN ORACLE SERVI est le premier mot du champ `oracle`, sans chemin ni extension :
 * « oracle-conformite-projet (audit complet) » sert `oracle-conformite-projet`. Une entrée qui en
 * nomme plusieurs (« check_html + render_page ») ne sert que le premier — le contrat d'interface
 * §3 exige une entrée par oracle — et EN1 dit, pour chaque promesse manquante, l'entrée qui la CITE
 * sans la servir : le lecteur voit la cause, pas seulement le trou.
 *
 * ============================================================================================
 * CE QUI N'EST PAS JUGÉ — SKIP MOTIVÉ, JAMAIS PASS PAR DÉFAUT
 * ============================================================================================
 *
 *   · un run dont le `run_open` ne déclare pas `schema_ledger` PRÉCÈDE le schéma : ses entrées ont
 *     six formes possibles, aucun calcul n'y est honnête (antériorité déclarée, sur le modèle de
 *     `ledger.mjs verify` — on ne juge que ce qui s'est déclaré jugeable) ;
 *   · des forges mobilisées inconnues : ni `--forges`, ni `forges_mobilisees` au `run_open` — ce
 *     juge ne devine pas ce qu'un run a mobilisé, et `versions_forges` porte le PARC, pas la
 *     mobilisation (mesuré le 23/09 : les deux ledgers du parc qui déclarent le schéma y inscrivent
 *     14 et 15 dépôts, tout le parc, quand l'un d'eux déclare en `forges_mobilisees` 7 forges) ;
 *   · une forge non clonée sous la racine du parc, sans entrée de découverte, ou dont la
 *     découverte est illisible : ELLE sort en SKIP avec son motif, les autres sont jugées ;
 *   · la QUALITÉ d'un verdict : ce juge constate qu'un oracle a rendu un verdict, jamais que ce
 *     verdict est juste — un ledger complet n'est pas un produit conforme ;
 *   · l'applicabilité FINE : la granularité est la forge, pas l'artefact (étude, §5). Un oracle
 *     qui ne s'applique pas se consigne en SKIP ou NA ; son absence reste une absence.
 *
 * Recette à double sens : `oracles\oracle-enclenchement.test.mjs`.
 *
 * Usage : node oracles\oracle-enclenchement.mjs <ledger.jsonl> [--forges a,b] [--run <id>]
 *           [--racine <racine-du-parc>]
 *   --forges : noms complets (`digit-ai-forge-design`) ou courts (`design`), séparés par des
 *              virgules ; sans lui, le champ `forges_mobilisees` du `run_open` du run jugé, dont
 *              l'annotation qui suit le nom (« ops (MEP) ») est ignorée.
 *   --run    : le run à juger quand le ledger en porte plusieurs (run de version) ; par défaut, le
 *              DERNIER `run_open` et ce qui le suit.
 *   --racine : où les dépôts du parc sont clonés ; sinon `$FORGE_ROOT`, sinon le parent du pilot.
 * Sortie : JSON `{oracle, verdict, findings[], non_juge[]}` sur stdout, toujours.
 * Exit : 0 PASS · 1 FAIL · 2 SKIP — « je ne peux pas juger » a son code à lui (TF-0648). Ce juge
 * n'écrit rien : ni à côté du ledger lu, ni dans aucun dépôt dont il appelle la découverte.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

export const ORACLE = "oracle-enclenchement";
export const VERSION = "1.0.0";
export const CONTRAT_DECOUVERTE = "digit-ai/decouverte-oracles@1";
export const SCHEMA_COURANT = "1.0";
//: L'entrée de découverte d'un dépôt : un CHEMIN convenu, le même partout. C'est ce qui dispense ce
//: juge de tenir une table des forges — la table serait la liste écrite à la main à supprimer.
export const ENTREE_DECOUVERTE = join("oracles", "decouvrir-oracles.mjs");
//: Le mécanisme de confrontation, chez son propriétaire. Appelé, jamais recopié.
export const MECANISME = join("digit-ai-forge-tests", "forge_tests", "confrontation.py");
//: Les dépôts du parc au sens de ce juge : les forges et le pilot, sous leur nom complet (R-19).
//: Un produit n'y entre jamais — ce juge n'exécute rien chez un produit, il n'y lit qu'un ledger.
export const RE_DEPOT_DU_PARC = /^digit-ai-(?:forge-[a-z0-9-]+|factory)$/;

export const NON_JUGE = [
  "la QUALITÉ des verdicts consignés : ce juge constate qu'un oracle a rendu un verdict, jamais que ce verdict est juste — un ledger complet n'est pas un produit conforme",
  "l'applicabilité FINE : la granularité est la forge mobilisée, pas l'artefact (étude du 19/08, §5) — un oracle qui ne s'applique pas se consigne en SKIP ou NA, son absence reste une absence",
  "la FORME et l'INTÉGRITÉ du ledger (seq, horodatages, champs dus) : c'est le contrat de `ledger.mjs verify` de forge-agents, que ce juge ne rejoue pas",
];

const nonVide = (v) => typeof v === "string" ? v.trim() !== "" : v !== undefined && v !== null;

/** Le nom d'oracle porté par un champ `oracle` : premier mot, sans chemin ni extension, en minuscules. */
export function nomNormalise(texte) {
  const premier = String(texte ?? "").trim().split(/[\s(]/)[0] || "";
  const base = premier.split(/[\\/]/).pop() || "";
  return base.replace(/\.(?:mjs|cjs|js|py)$/i, "").toLowerCase();
}

/** Le nom de dépôt complet d'une forge écrite en long, en court, ou suivie d'une annotation. */
export function forgeCanonique(libelle) {
  const m = /^\s*([A-Za-z0-9][\w-]*)/.exec(String(libelle ?? ""));
  if (!m) return null;
  const nu = m[1].toLowerCase();
  if (nu.startsWith("digit-ai-")) return nu;
  if (nu.startsWith("forge-")) return `digit-ai-${nu}`;
  return `digit-ai-forge-${nu}`;
}

/** Les entrées du ledger, et les numéros des lignes illisibles — jamais un arrêt sur la première. */
export function lireLedger(chemin) {
  const entrees = [];
  const illisibles = [];
  readFileSync(chemin, "utf8").split(/\r?\n/).forEach((l, i) => {
    if (!l.trim()) return;
    try { entrees.push(JSON.parse(l)); } catch { illisibles.push(i + 1); }
  });
  return { entrees, illisibles };
}

/** Un run = un `run_open` et tout ce qui le suit jusqu'au `run_open` suivant (run de version). */
export function segmentsDeRun(entrees) {
  const segments = [];
  for (const e of entrees) {
    if (e && e.type === "run_open") segments.push({ run_open: e, entrees: [e] });
    else if (segments.length) segments[segments.length - 1].entrees.push(e);
  }
  return segments;
}

const idDeRun = (runOpen) => (nonVide(runOpen.run) ? String(runOpen.run) : `seq ${runOpen.seq}`);

/** Les forges mobilisées : l'option d'abord, le `run_open` ensuite, jamais une devinette. */
export function forgesMobilisees(runOpen, option) {
  let brut = null;
  let source = null;
  if (nonVide(option)) { brut = String(option).split(","); source = "--forges"; }
  else if (Array.isArray(runOpen.forges_mobilisees)) { brut = runOpen.forges_mobilisees; source = "run_open.forges_mobilisees"; }
  else if (nonVide(runOpen.forges_mobilisees)) { brut = String(runOpen.forges_mobilisees).split(","); source = "run_open.forges_mobilisees"; }
  if (!brut) return null;
  const forges = [...new Set(brut.map(forgeCanonique).filter(Boolean))];
  return { source, brut, forges };
}

/** Les dépôts du parc clonés sous la racine — lus sur le disque. */
export function depotsDuParc(racine) {
  try {
    return readdirSync(racine, { withFileTypes: true })
      .filter((e) => e.isDirectory() && RE_DEPOT_DU_PARC.test(e.name)).map((e) => e.name).sort();
  } catch { return []; }
}

/** Appelle l'entrée de découverte d'un dépôt et contrôle ce qu'elle rend. */
export function decouvrir(racine, depot) {
  const dossier = join(racine, depot);
  let clone = false;
  try { clone = statSync(dossier).isDirectory(); } catch { clone = false; }
  if (!clone) return { statut: "absente", motif: `${depot} n'est pas clonée sous ${racine} (ou son nom est erroné) : sa promesse n'est pas lisible` };
  const entree = join(dossier, ENTREE_DECOUVERTE);
  if (!existsSync(entree)) {
    return { statut: "sans_entree", entree, motif: `${depot} n'expose pas d'entrée de découverte (${ENTREE_DECOUVERTE.split("\\").join("/")} absent) : la forge n'a pas d'oracle, ou ne sert pas encore le contrat ${CONTRAT_DECOUVERTE} — sa promesse n'est pas lisible` };
  }
  const r = spawnSync(process.execPath, [entree], { encoding: "utf8", timeout: 60000 });
  const echec = (pourquoi) => ({ statut: "illisible", entree, motif: `découverte de ${depot} illisible : ${pourquoi}` });
  if (r.error) return echec(r.error.message);
  let j;
  try { j = JSON.parse(r.stdout); } catch { return echec(`sortie non JSON (exit ${r.status}) ${String(r.stderr || "").trim().split(/\r?\n/).pop() || ""}`.trim()); }
  if (r.status !== 0) return echec(`exit ${r.status}${j && j.motif ? ` — ${j.motif}` : ""}`);
  if (!j || j.contrat !== CONTRAT_DECOUVERTE) return echec(`contrat « ${j && j.contrat} » au lieu de « ${CONTRAT_DECOUVERTE} »`);
  if (!Array.isArray(j.oracles) || j.oracles.some((o) => !o || !nonVide(o.nom) || !nonVide(o.chemin))) {
    return echec("`oracles` n'est pas une liste de { nom, chemin } renseignés");
  }
  return { statut: "ok", entree, forge: j.forge, regle: j.regle, oracles: j.oracles, non_juge: Array.isArray(j.non_juge) ? j.non_juge : [] };
}

/**
 * Les fichiers suivis d'un dépôt à la version qu'un run a consignée (`versions_forges`, R-19) —
 * `null` quand la version est inconnue du clone local ou que git manque.
 *
 * POURQUOI, ET LE FAIT A ÉTÉ MESURÉ EN ÉCRIVANT CE JUGE (23/09/2026). La découverte lit le disque
 * d'AUJOURD'HUI ; un run a tourné sur la forge d'HIER. Premier passage sur un ledger réel : le run
 * du 05/09 d'un produit était accusé de n'avoir pas servi `oracle-exigences-md`, né le 06/09 et
 * absent de `be41b25`, la version de forge-conception que ce run avait consignée — et deux oracles
 * de forge-design dans le même cas. Réclamer à un run un oracle qui n'existait pas est exactement
 * l'accusation à tort qui fait contourner un juge des juges. La version se lit en « describe »
 * (`v1.17.2-10-gbe41b25` : le sha suit `-g`) ou en sha court ; un tag nu est passé tel quel à git.
 */
export function fichiersALaVersion(depot, version) {
  const m = /-g([0-9a-f]{7,40})$/.exec(String(version).trim());
  const rev = m ? m[1] : String(version).trim();
  if (!rev || rev.startsWith("-")) return null;
  const connue = spawnSync("git", ["-C", depot, "rev-parse", "--verify", "--quiet", `${rev}^{commit}`], { encoding: "utf8" });
  if (connue.error || connue.status !== 0) return null;
  const ls = spawnSync("git", ["-C", depot, "ls-tree", "-r", "--name-only", rev], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (ls.error || ls.status !== 0) return null;
  return { rev, fichiers: new Set(ls.stdout.split(/\r?\n/).filter(Boolean)) };
}

/** L'interpréteur Python : la variable d'abord, puis les noms usuels du PATH — échec DIT sinon. */
export function interpretePython() {
  for (const bin of [process.env.PYTHON, "python", "python3", "py"].filter(nonVide)) {
    const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
    if (!r.error && r.status === 0) return bin;
  }
  return null;
}

//: Le pont vers le mécanisme : il le charge PAR SON CHEMIN (importlib), sans importer le paquet
//: forge_tests entier, construit les deux termes et rend les issues telles que `confronter` les
//: écrit. Sortie en JSON ASCII : aucune page de code de console ne peut l'altérer.
const PONT = [
  "import json, sys, importlib.util as u",
  "s = u.spec_from_file_location('confrontation_forge_tests', sys.argv[1])",
  "m = u.module_from_spec(s); sys.modules[s.name] = m; s.loader.exec_module(m)",
  "T = lambda t: m.Terme(t['nom'], set(t.get('elements', [])), t.get('motif_absence', ''), list(t.get('sources', [])))",
  "d = json.load(sys.stdin)",
  "r = [m.confronter(x['domaine'], T(x['promesse']), T(x['service']), suspendus=x.get('suspendus') or None) for x in d]",
  "sys.stdout.write(json.dumps({'resultats': r, 'non_juge': list(getattr(m, 'NON_JUGE', []))}))",
].join("\n");

const jsonAscii = (valeur) => JSON.stringify(valeur)
  .replace(/[\u007f-\uffff]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);

/** Confronte chaque promesse au service par le mécanisme de forge-tests. */
export function confronterParLeMecanisme(racine, confrontations) {
  const mecanisme = join(racine, MECANISME);
  if (!existsSync(mecanisme)) {
    return { ok: false, motif: `mécanisme de confrontation introuvable (${mecanisme}) : forge-tests n'est pas clonée sous la racine du parc — ce juge ne recopie pas le mécanisme, il ne confronte donc rien` };
  }
  const python = interpretePython();
  if (!python) {
    return { ok: false, motif: "aucun interpréteur Python (variable PYTHON, puis python, python3, py) : le mécanisme de confrontation de forge-tests ne peut pas être appelé" };
  }
  const r = spawnSync(python, ["-X", "utf8", "-c", PONT, mecanisme], { input: jsonAscii(confrontations), encoding: "utf8", timeout: 120000 });
  if (r.error || r.status !== 0) {
    const cause = r.error ? r.error.message : `exit ${r.status} — ${String(r.stderr || "").trim().split(/\r?\n/).pop()}`;
    return { ok: false, motif: `le mécanisme de confrontation a échoué (${cause}) : aucune issue n'est rendue` };
  }
  try {
    const j = JSON.parse(r.stdout);
    return { ok: true, mecanisme, python, resultats: j.resultats, non_juge: j.non_juge || [] };
  } catch {
    return { ok: false, motif: "sortie illisible du mécanisme de confrontation : aucune issue n'est rendue" };
  }
}

/** Les entrées qui CITENT un nom d'oracle sans le servir : cité hors du premier mot, ou sans verdict. */
function citations(verdicts, nom) {
  const echappe = nom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const motif = new RegExp(`(^|[^\\w-])${echappe}([^\\w-]|$)`, "i");
  return verdicts
    .filter((e) => typeof e.oracle === "string" && motif.test(e.oracle))
    .filter((e) => !(nonVide(e.verdict) && nomNormalise(e.oracle) === nom))
    .map((e) => `seq ${e.seq} (« ${String(e.oracle).slice(0, 80)} »${nonVide(e.verdict) ? "" : ", sans verdict"})`);
}

export function racineParDefaut() {
  return process.env.FORGE_ROOT ? resolve(process.env.FORGE_ROOT) : resolve(ICI, "..", "..");
}

/**
 * Le jugement. Rend `{ verdict, motif?, findings, non_juge, … }` — jamais d'exception pour un
 * ledger ou un parc incomplet : ce qui ne se lit pas devient un SKIP motivé ou une ligne de non_juge.
 */
export function juger({ ledger, forges = null, run = null, racine = racineParDefaut() } = {}) {
  const nonJuge = [...NON_JUGE];
  const tete = { cible: ledger || null, racine };
  const skip = (motif, extra = {}) => ({ ...tete, verdict: "SKIP", motif, findings: [], non_juge: nonJuge, ...extra });

  if (!nonVide(ledger) || !existsSync(ledger)) return skip(`ledger introuvable : ${ledger || "(aucun chemin donné)"} — rien n'est jugé`);
  let lu;
  try { lu = lireLedger(ledger); } catch (e) { return skip(`ledger illisible : ${e.message}`); }
  if (lu.illisibles.length) {
    nonJuge.push(`${lu.illisibles.length} ligne(s) du ledger en JSON invalide (lignes ${lu.illisibles.slice(0, 12).join(", ")}${lu.illisibles.length > 12 ? "…" : ""}) : ni jugées ni créditées`);
  }
  const segments = segmentsDeRun(lu.entrees);
  if (!segments.length) return skip("aucun `run_open` dans le ledger : aucun run à juger");
  const segment = nonVide(run) ? segments.find((s) => idDeRun(s.run_open) === String(run)) : segments[segments.length - 1];
  if (!segment) return skip(`aucun run « ${run} » dans ce ledger (runs présents : ${segments.map((s) => idDeRun(s.run_open)).join(", ")})`);
  const runId = idDeRun(segment.run_open);
  const autres = segments.filter((s) => s !== segment).map((s) => idDeRun(s.run_open));
  if (autres.length) nonJuge.push(`${autres.length} autre(s) run(s) du même ledger non jugé(s) ici (${autres.join(", ")}) : \`--run <id>\` pour en juger un`);
  const schema = segment.run_open.schema_ledger;
  if (!nonVide(schema)) {
    return skip(`le run ${runId} ne déclare pas \`schema_ledger\` à son \`run_open\` : il PRÉCÈDE le schéma de l'événement oracles_verdict (TF-0385), ses entrées ont plusieurs formes possibles et aucun calcul de ce qui a tourné n'y est honnête — la déclaration vaut pour le PROCHAIN run, l'histoire ne se réécrit pas`, { run: runId });
  }
  if (String(schema) !== SCHEMA_COURANT) nonJuge.push(`\`schema_ledger: ${schema}\` déclaré, ${SCHEMA_COURANT} courant : le run est lu sous la forme ${SCHEMA_COURANT}`);
  if (!segment.entrees.some((e) => e && e.type === "run_close")) {
    nonJuge.push(`le run ${runId} n'est pas clos (aucun \`run_close\`) : le verdict vaut à l'instant de la lecture, un oracle attendu peut encore tourner`);
  }
  const mob = forgesMobilisees(segment.run_open, forges);
  if (!mob || !mob.forges.length) {
    return skip(`forges mobilisées inconnues pour le run ${runId} : ni \`--forges\`, ni \`forges_mobilisees\` au \`run_open\` — ce juge ne devine pas ce qu'un run a mobilisé, et \`versions_forges\` porte le parc, pas la mobilisation`, { run: runId });
  }

  // ---- le SERVICE : ce que le run a consigné ------------------------------------------------
  const verdicts = segment.entrees.filter((e) => e && e.type === "oracles_verdict");
  const canoniques = verdicts.filter((e) => nonVide(e.oracle) && nonVide(e.verdict));
  const nonCanoniques = verdicts.filter((e) => !canoniques.includes(e));
  if (nonCanoniques.length) {
    nonJuge.push(`${nonCanoniques.length} entrée(s) oracles_verdict sans \`oracle\` ou sans \`verdict\` (seq ${nonCanoniques.map((e) => e.seq).join(", ")}) : illisibles pour ce juge, jamais créditées — \`ledger.mjs verify\` les refuse sous le schéma`);
  }
  const servis = new Map();
  for (const e of canoniques) {
    const nom = nomNormalise(e.oracle);
    if (nom) servis.set(nom, [...(servis.get(nom) || []), e.seq]);
  }
  const service = {
    nom: `verdicts consignés au run ${runId}`,
    elements: [...servis.keys()],
    motif_absence: verdicts.length && !canoniques.length
      ? `${verdicts.length} entrée(s) oracles_verdict, aucune ne porte à la fois \`oracle\` et \`verdict\``
      : "",
    sources: [ledger],
  };

  // ---- la PROMESSE : ce que chaque forge mobilisée découvre sur son disque ------------------
  const decouvertes = new Map(mob.forges.map((f) => [f, decouvrir(racine, f)]));
  // …lue à la VERSION que le run a consignée : un oracle absent de cette version n'a pas pu y
  // tourner. Son jugement est SUSPENDU, avec son motif — jamais tu, jamais accusé.
  const versions = segment.run_open.versions_forges && typeof segment.run_open.versions_forges === "object"
    ? segment.run_open.versions_forges : {};
  const suspendusPar = new Map();
  for (const [f, d] of decouvertes) {
    if (d.statut !== "ok" || !d.oracles.length) continue;
    const version = versions[f];
    if (!nonVide(version)) {
      nonJuge.push(`${f} : aucune version consignée au run (\`versions_forges\`, R-19) — sa promesse est lue sur le disque d'AUJOURD'HUI, et un oracle né après le run peut y être réclamé à tort`);
      continue;
    }
    const alors = fichiersALaVersion(join(racine, f), version);
    if (!alors) {
      nonJuge.push(`${f}@${version} : version consignée par le run inconnue du clone local, ou git absent — promesse lue sur le disque d'AUJOURD'HUI, un oracle né après le run peut y être réclamé à tort`);
      continue;
    }
    const suspendus = {};
    for (const o of d.oracles) {
      if (!alors.fichiers.has(o.chemin)) suspendus[nomNormalise(o.nom)] = `absent de ${f}@${alors.rev}, la version que le run a consignée : né après le run, il ne pouvait pas y tourner`;
    }
    if (Object.keys(suspendus).length) suspendusPar.set(f, suspendus);
  }
  const confrontations = mob.forges.map((f) => {
    const d = decouvertes.get(f);
    return {
      domaine: f,
      promesse: {
        nom: `oracles découverts de ${f}`,
        elements: d.statut === "ok" ? [...new Set(d.oracles.map((o) => nomNormalise(o.nom)))] : [],
        motif_absence: d.statut === "ok" ? "" : d.motif,
        sources: [d.entree || join(racine, f)],
      },
      service,
      ...(suspendusPar.has(f) ? { suspendus: suspendusPar.get(f) } : {}),
    };
  });
  const conf = confronterParLeMecanisme(racine, confrontations);
  if (!conf.ok) return skip(conf.motif, { run: runId, forges_mobilisees: mob });
  nonJuge.push(...conf.non_juge.map((n) => `mécanisme de forge-tests — ${n}`));

  // ---- EN1 : une issue par forge, telle que le mécanisme la rend -----------------------------
  const findings = conf.resultats.map((r) => {
    const f = { regle: "EN1", statut: r.verdict, forge: r.domaine, message: r.motif, comparees: r.comparees };
    if (r.suspendus && Object.keys(r.suspendus).length) f.suspendus = r.suspendus;
    if (r.verdict === "FAIL") {
      f.manquants = r.manquantes;
      const cites = r.manquantes.map((nom) => [nom, citations(verdicts, nom)]).filter(([, c]) => c.length);
      if (cites.length) {
        f.cites_sans_etre_servis = Object.fromEntries(cites);
        f.message += ` — cité(s) sans être servi(s) : ${cites.map(([nom, c]) => `« ${nom} » par ${c.join(", ")}`).join(" ; ")}. Une entrée oracles_verdict PAR oracle, verdict SKIP ou NA compris quand il ne s'applique pas (CONTRAT-INTERFACE §3)`;
      } else {
        f.message += " — une entrée oracles_verdict PAR oracle est due, verdict SKIP ou NA compris quand il ne s'applique pas (CONTRAT-INTERFACE §3)";
      }
    }
    return f;
  });

  // Un même nom découvert par deux forges mobilisées : une entrée qui le nomme sert les deux.
  const porteurs = new Map();
  for (const [f, d] of decouvertes) if (d.statut === "ok") for (const o of d.oracles) {
    const nom = nomNormalise(o.nom);
    porteurs.set(nom, [...new Set([...(porteurs.get(nom) || []), f])]);
  }
  const ambigus = [...porteurs.entries()].filter(([nom, fs]) => fs.length > 1 && servis.has(nom));
  if (ambigus.length) {
    nonJuge.push(`nom(s) découvert(s) par plusieurs forges mobilisées (${ambigus.map(([nom, fs]) => `${nom} : ${fs.join(", ")}`).join(" ; ")}) : une entrée qui le nomme sert chacune de ces promesses — le ledger ne dit pas laquelle a tourné`);
  }

  // ---- EN2 : servi sans promesse — signalé, jamais accusé ------------------------------------
  const horsPromesse = [...servis.keys()].filter((nom) => !porteurs.has(nom));
  if (horsPromesse.length) {
    const ailleurs = new Map();
    const sansDecouverte = [];
    for (const depot of depotsDuParc(racine).filter((d) => !mob.forges.includes(d))) {
      const d = decouvrir(racine, depot);
      if (d.statut !== "ok") { sansDecouverte.push(depot); continue; }
      for (const o of d.oracles) {
        const nom = nomNormalise(o.nom);
        ailleurs.set(nom, [...new Set([...(ailleurs.get(nom) || []), depot])]);
      }
    }
    const horsMobilisation = horsPromesse.filter((nom) => ailleurs.has(nom))
      .map((nom) => ({ nom, depots: ailleurs.get(nom), seqs: servis.get(nom) }));
    const inconnus = horsPromesse.filter((nom) => !ailleurs.has(nom)).map((nom) => ({ nom, seqs: servis.get(nom) }));
    findings.push({
      regle: "EN2",
      statut: "AVERTISSEMENT",
      message: `${horsPromesse.length} nom(s) servi(s) au run ${runId} sans être promis par une forge mobilisée — signalé(s), jamais accusé(s) : `
        + [
          horsMobilisation.length ? `${horsMobilisation.length} hors mobilisation (${horsMobilisation.map((x) => `${x.nom} ← ${x.depots.join("/")}`).join(", ")}) — la liste des forges mobilisées est peut-être incomplète` : "",
          inconnus.length ? `${inconnus.length} inconnu(s) du parc (${inconnus.map((x) => x.nom).join(", ")}) — nom libre, contrôle ad hoc ou commande` : "",
        ].filter(Boolean).join(" ; "),
      hors_mobilisation: horsMobilisation,
      inconnus,
    });
    if (sansDecouverte.length) {
      nonJuge.push(`le classement « inconnu » ne connaît que les dépôts qui servent la découverte : ${sansDecouverte.join(", ")} n'en servent pas — un nom classé inconnu peut leur appartenir`);
    }
  }

  const en1 = findings.filter((f) => f.regle === "EN1");
  const verdict = en1.some((f) => f.statut === "FAIL") ? "FAIL" : en1.some((f) => f.statut === "PASS") ? "PASS" : "SKIP";
  for (const f of en1.filter((x) => x.statut === "SKIP")) nonJuge.push(`${f.forge} : promesse non jugée — ${f.message}`);
  return {
    ...tete,
    run: runId,
    schema_ledger: String(schema),
    forges_mobilisees: mob,
    mecanisme: { chemin: conf.mecanisme, python: conf.python },
    mesures: {
      entrees_oracles_verdict: verdicts.length,
      canoniques: canoniques.length,
      noms_servis: servis.size,
      promesses: Object.fromEntries([...decouvertes].map(([f, d]) => [f, d.statut === "ok" ? d.oracles.length : null])),
    },
    verdict,
    ...(verdict === "SKIP" ? { motif: `aucune forge mobilisée n'a pu être jugée : ${en1.map((f) => `${f.forge} — ${f.message}`).join(" ; ")}` } : {}),
    findings,
    non_juge: nonJuge,
  };
}

// ---- CLI ---------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().split("\\").join("/")
     === resolve(process.argv[1]).toLowerCase().split("\\").join("/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const AVEC_VALEUR = ["--forges", "--run", "--racine"];
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : null; };
  const ledger = args.find((a, i) => !a.startsWith("--") && !AVEC_VALEUR.includes(args[i - 1])) || null;
  const r = juger({
    ledger: ledger ? resolve(ledger) : null,
    forges: valeur("--forges"),
    run: valeur("--run"),
    racine: valeur("--racine") ? resolve(valeur("--racine")) : racineParDefaut(),
  });
  console.log(JSON.stringify({ oracle: ORACLE, version: VERSION, ...r }, null, 1));
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SKIP" ? 2 : 0);
}
