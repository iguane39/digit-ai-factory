#!/usr/bin/env node
/**
 * oracle-modeles-tiers.test.mjs — recette à DOUBLE SENS de son oracle (TF-2109).
 *
 * L'oracle croise le calendrier des modèles tiers avec les identifiants écrits dans les dépôts.
 * Un croisement qui ne sait pas échouer est un vert de façade : le parc réel le met à l'épreuve
 * (deux MT1 et un MT2 attendus le 03/11/2026), mais il changera ; ces fixtures, elles, ne bougent
 * pas. Elles vivent sous `oracles/fixtures/modeles-tiers/` : deux référentiels (vert, rouge) et
 * deux parcs jetables (vert, rouge) décrits en JSON, bâtis ici en dépôts git (`git add`, sans
 * commit) sous le dossier temporaire du poste. Identifiants fictifs, aucun nom réel.
 *
 * Le sens vert compte autant que le rouge : un oracle qui accuserait `alpha-4o-mini` parce qu'il
 * contient `alpha-4o`, ou qui punirait le remplaçant que son message recommande, ferait fermer la
 * seule voie qu'il ouvre.
 *
 * Joué par `oracles\self-tests.mjs` (I1 via la table partagée, I2 comme tout `*.test.mjs`).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { executer, juger, lireReferentiel, classerFichier, motifIdentifiant, racineGit, trouverDepots, joursEntre, NON_JUGE, REF_DEFAUT } from "./oracle-modeles-tiers.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const FIX = join(ICI, "fixtures", "modeles-tiers");
const ORACLE = join(ICI, "oracle-modeles-tiers.mjs");
const lire = (nom) => JSON.parse(readFileSync(join(FIX, nom), "utf8"));
const REF_VERT = join(FIX, "referentiel-vert.json");
const REF_ROUGE = join(FIX, "referentiel-rouge.json");
const JOUR = "2026-11-03";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const ok = (cond, msg) => { if (!cond) throw new Error(msg); };

const T = mkdtempSync(join(tmpdir(), "mt-"));
let n = 0;
const git = (cwd, ...args) => spawnSync("git", ["-c", "core.longpaths=true", ...args], { cwd, encoding: "utf8" });

/** Bâtit un parc jetable depuis un manifeste { dépôt: { chemin: contenu } } ; `modifier(depot, chemin, contenu)` peut réécrire. */
function batirParc(manifeste, modifier = (d, c, t) => t) {
  const racine = join(T, `parc${++n}`);
  mkdirSync(racine, { recursive: true });
  for (const [depot, fichiers] of Object.entries(manifeste)) {
    if (depot.startsWith("_")) continue;
    const d = join(racine, ...depot.split("/"));
    mkdirSync(d, { recursive: true });
    ok(git(d, "init", "-q").status === 0, "git init a échoué");
    for (const [chemin, contenu] of Object.entries(fichiers)) {
      const f = join(d, ...chemin.split("/"));
      mkdirSync(dirname(f), { recursive: true });
      writeFileSync(f, modifier(depot, chemin, contenu), "utf8");
    }
    ok(git(d, "add", "-f", "-A").status === 0, "git add a échoué");
  }
  return racine;
}
const lancer = (racine, referentiel, extra = []) => executer(["--racine", racine, "--referentiel", referentiel, "--date", JOUR, ...extra]);
const touvent = (r, regle) => r.rapport.findings.filter((f) => f.regle === regle && f.id);
const ids = (r, regle) => touvent(r, regle).map((f) => f.id).sort();

const PARC_ROUGE = batirParc(lire("parc-rouge.json"));
const PARC_VERT = batirParc(lire("parc-vert.json"));
const rouge = lancer(PARC_ROUGE, REF_VERT);
const vert = lancer(PARC_VERT, REF_VERT);

// -- MT1 : bloquant -------------------------------------------------------------------------------
check("ROUGE — un identifiant arrêté cité en code ou en configuration est un FAIL (exit 1), un par identifiant", () => {
  ok(rouge.code === 1 && rouge.rapport.verdict === "FAIL", `verdict ${rouge.rapport.verdict}, exit ${rouge.code}`);
  const attendus = ["/v0/ancien-point", "modele-a-arrete", "modele-h-aujourdhui", "orbe3"];
  ok(JSON.stringify(ids(rouge, "MT1")) === JSON.stringify(attendus), `MT1 sur ${JSON.stringify(ids(rouge, "MT1"))}`);
  ok(touvent(rouge, "MT1").every((f) => f.statut === "FAIL"), "un MT1 n'est pas bloquant");
});

check("ROUGE — le constat donne dépôt, fichier et LIGNE, la date d'arrêt et le remplaçant", () => {
  const f = touvent(rouge, "MT1").find((x) => x.id === "modele-a-arrete");
  ok(/depot-a\/scripts\/generer\.mjs:1/.test(f.message), `emplacement absent : ${f.message}`);
  ok(/2026-06-25/.test(f.message) && /modele-a-nouveau/.test(f.message), "ni date d'arrêt ni remplaçant");
});

check("ROUGE — un mot isolé (orbe3) n'est retenu qu'entre guillemets ; un littéral d'API est cherché tel quel", () => {
  ok(ids(rouge, "MT1").includes("orbe3") && ids(rouge, "MT1").includes("/v0/ancien-point"), "orbe3 ou le littéral d'API manque");
  ok(!JSON.stringify(rouge.rapport).includes("voisins.mjs"), "la fixture verte déborde sur le rouge");
});

check("ROUGE — un dépôt à 4 niveaux est lu, un dépôt à 5 niveaux ne l'est pas", () => {
  const f = touvent(rouge, "MT1").find((x) => x.id === "modele-a-arrete");
  ok(/n1\/n2\/n3\/depot-limite\/limite\.mjs:1/.test(f.ou), "le dépôt du 4e niveau n'est pas lu");
  ok(!/depot-trop-profond/.test(f.ou), "le dépôt du 5e niveau est lu");
});

check("ROUGE — un fichier d'environnement réel (.env) n'est pas lu, .env.example l'est", () => {
  ok(!JSON.stringify(rouge.rapport.findings).includes("depot-a/.env:"), ".env a été lu");
  const f = touvent(rouge, "MT3").find((x) => x.id === "modele-c-sans-date");
  ok(f && /depot-a\/\.env\.example:1/.test(f.ou), ".env.example n'est pas lu");
});

check("ROUGE — les fixtures et les tests sont comptés à part, jamais en MT1 ; le documentaire aussi", () => {
  ok(rouge.rapport.compte.tests_fixtures.occurrences === 2 && rouge.rapport.compte.tests_fixtures.fichiers === 2, `tests : ${JSON.stringify(rouge.rapport.compte.tests_fixtures)}`);
  ok(rouge.rapport.compte.documentaire.occurrences === 1, `documentaire : ${JSON.stringify(rouge.rapport.compte.documentaire)}`);
  const f = touvent(rouge, "MT1").find((x) => x.id === "modele-a-arrete");
  ok(!/cas\.test|donnees\.json|NOTE\.md/.test(f.ou), "un test ou une note est lu comme du code");
});

// -- MT2 : avertissant ----------------------------------------------------------------------------
check("ROUGE — un arrêt à moins de 90 jours est un AVERT (jamais un échec) avec les jours restants ; 89 jours oui, 90 non", () => {
  const attendus = ["alpha-4o", "alpha-5", "modele-b-bientot", "modele-g-89j"];
  ok(JSON.stringify(ids(rouge, "MT2")) === JSON.stringify(attendus), `MT2 sur ${JSON.stringify(ids(rouge, "MT2"))}`);
  ok(touvent(rouge, "MT2").every((f) => f.statut === "AVERT"), "un MT2 n'est pas avertissant");
  ok(touvent(rouge, "MT2").find((f) => f.id === "modele-g-89j").jours_restants === 89, "89 jours mal comptés");
  ok(rouge.rapport.hors_fenetre.some((h) => h.id === "modele-f-90j" && h.jours_restants === 90), "90 jours n'est pas hors fenêtre");
});

check("ROUGE — un déprécié à arrêt lointain est compté et listé, jamais tu", () => {
  ok(rouge.rapport.compte.deprecies_arret_lointain === 2, `compte ${rouge.rapport.compte.deprecies_arret_lointain}`);
  ok(rouge.rapport.hors_fenetre.some((h) => h.id === "modele-d-lointain"), "modele-d-lointain absent de hors_fenetre");
  ok(/arrêt au-delà de 90 jours/.test(rouge.sortie), "le texte ne dit pas le compte");
});

// -- MT3 : informatif -----------------------------------------------------------------------------
check("ROUGE — un déprécié sans date d'arrêt est un INFO, jamais un échec", () => {
  ok(JSON.stringify(ids(rouge, "MT3")) === JSON.stringify(["modele-c-sans-date"]), `MT3 sur ${JSON.stringify(ids(rouge, "MT3"))}`);
  ok(touvent(rouge, "MT3").every((f) => f.statut === "INFO"), "un MT3 n'est pas informatif");
});

// -- les frontières d'identifiant, le sens vert ---------------------------------------------------
check("VERT — alpha-4o-mini ne se lit pas comme alpha-4o, alpha-5.6 ni alpha-5-turbo comme alpha-5, xalpha-5 non plus", () => {
  const f = touvent(rouge, "MT2").find((x) => x.id === "alpha-5");
  ok(/depot-b\/app\.js:1\b/.test(f.ou) && !/app\.js:[23]/.test(f.ou), `alpha-5 lu hors de la ligne 1 : ${f.ou}`);
  ok(vert.code === 0 && vert.rapport.verdict === "PASS", `parc vert : ${vert.rapport.verdict}\n${vert.sortie}`);
  ok(vert.rapport.compte.mt1 === 0 && vert.rapport.compte.mt2 === 0 && vert.rapport.compte.mt3 === 0, JSON.stringify(vert.rapport.compte));
});

check("VERT — modele-a-arrete-bis, un mot isolé sans guillemets et un test qui cite un arrêté ne déclenchent rien", () => {
  ok(vert.rapport.findings.filter((f) => ["MT1", "MT2", "MT3"].includes(f.regle)).every((f) => f.statut === "PASS"), vert.sortie);
  ok(vert.rapport.findings.filter((f) => f.statut === "AVERT").every((f) => f.regle === "MT0" && /modele-h-aujourdhui/.test(f.message)), "un AVERT inattendu hors du MT0 de l'état périmé");
  ok(vert.rapport.compte.tests_fixtures.occurrences === 2 && vert.rapport.compte.documentaire.occurrences === 1, JSON.stringify(vert.rapport.compte));
});

check("REMÈDE — remplacer l'identifiant arrêté par le remplaçant que le message recommande fait passer MT1", () => {
  const corrige = batirParc(lire("parc-rouge.json"), (d, c, t) => t.replaceAll("modele-a-arrete", "modele-a-nouveau").replaceAll("orbe3", "alpha-6").replaceAll("/v0/ancien-point", "/v1/nouveau-point").replaceAll("modele-h-aujourdhui", "modele-a-nouveau"));
  const r = lancer(corrige, REF_VERT);
  ok(r.code === 0 && r.rapport.compte.mt1 === 0, `MT1 reste : ${JSON.stringify(ids(r, "MT1"))}`);
});

// -- MT0 : le référentiel -------------------------------------------------------------------------
check("ROUGE — un référentiel mal formé est un FAIL MT0 qui nomme chaque défaut, et ne cherche rien", () => {
  const r = lancer(PARC_ROUGE, REF_ROUGE);
  const mt0 = r.rapport.findings.find((f) => f.regle === "MT0" && f.statut === "FAIL");
  ok(r.code === 1 && mt0, "un référentiel mal formé ne rend pas FAIL");
  for (const attendu of [/date absente ou hors/, /« arrété » hors de/, /« 14\/01\/2027 » hors de la forme/, /citation de la page absente/, /arrêté sans date d'arrêt/, /postérieure au 2026-11-03/, /en double/]) ok(attendu.test(mt0.message), `défaut non nommé : ${attendu} dans ${mt0.message}`);
  ok(r.rapport.findings.every((f) => !["MT1", "MT2", "MT3"].includes(f.regle) || f.statut === "PASS"), "des constats de croisement sortent d'un référentiel illisible");
});

check("ROUGE — un référentiel absent est un FAIL MT0 (exit 1), jamais un vert", () => {
  const r = lancer(PARC_VERT, join(T, "absent.json"));
  ok(r.code === 1 && r.rapport.verdict === "FAIL" && /illisible/.test(r.rapport.findings[0].message), r.sortie);
});

check("AVERT — un déprécié dont la date d'arrêt est atteinte est lu comme arrêté et signalé (MT0)", () => {
  const lu = lireReferentiel(lire("referentiel-vert.json"), JOUR);
  ok(lu.defauts.length === 0, `défauts : ${lu.defauts}`);
  ok(lu.avertissements.some((a) => /modele-h-aujourdhui/.test(a) && /lu comme arrêté/.test(a)), "l'état périmé n'est pas signalé");
  ok(lu.entrees.find((e) => e.id === "modele-h-aujourdhui").etat === "arrete", "pas lu comme arrêté");
});

check("VERT — le référentiel RÉEL est bien formé, daté, sourcé, et porte les deux constats attendus", () => {
  const ref = JSON.parse(readFileSync(REF_DEFAUT, "utf8"));
  const lu = lireReferentiel(ref, JOUR);
  ok(lu.defauts.length === 0, `défauts : ${lu.defauts.slice(0, 3)}`);
  for (const [nom, f] of Object.entries(ref.fournisseurs)) ok(f.modeles.length > 10 && f.modeles.every((m) => m.citation), `${nom} : modèles ou citations manquants`);
  const e = (id) => lu.entrees.find((x) => x.id === id);
  ok(e("gemini-3.1-flash-image-preview")?.etat === "arrete" && e("gemini-3.1-flash-image-preview").arret === "2026-06-25", "gemini-3.1-flash-image-preview");
  ok(e("gemini-3-pro-image-preview")?.etat === "arrete", "gemini-3-pro-image-preview");
  ok(e("gpt-4o-mini-2024-07-18")?.etat === "deprecie" && e("gpt-4o-mini-2024-07-18").arret === "2027-01-14", "gpt-4o-mini-2024-07-18");
});

// -- MT4 : l'âge du calendrier --------------------------------------------------------------------
check("ROUGE — un référentiel de plus de 30 jours est un AVERT MT4 (jamais un échec) ; 30 jours pile passe", () => {
  const vieux = lancer(PARC_VERT, REF_VERT, ["--date", "2026-12-04"]);
  ok(vieux.code === 0 && vieux.rapport.findings.filter((f) => f.regle === "MT4" && f.statut === "AVERT").length === 2, vieux.sortie);
  const pile = lancer(PARC_VERT, REF_VERT, ["--date", "2026-12-03"]);
  ok(pile.rapport.findings.filter((f) => f.regle === "MT4").every((f) => f.statut === "PASS"), "30 jours pile est signalé");
  ok(joursEntre("2026-11-03", "2026-12-03") === 30, "mauvais compte de jours");
});

check("REMÈDE — relire la page et redater le référentiel fait passer MT4", () => {
  const f = join(T, "redate.json");
  const r = lire("referentiel-vert.json");
  r.date = "2026-12-04"; r.fournisseurs["fournisseur-a"].lu_le = "2026-12-04";
  writeFileSync(f, JSON.stringify(r), "utf8");
  const apres = lancer(PARC_VERT, f, ["--date", "2026-12-04"]);
  ok(apres.rapport.findings.filter((x) => x.regle === "MT4").every((x) => x.statut === "PASS"), apres.sortie);
});

// -- contrat --------------------------------------------------------------------------------------
check("SKIP — une racine sans aucun dépôt git est déclarée hors portée (exit 2), jamais accusée", () => {
  const vide = join(T, "vide");
  mkdirSync(vide, { recursive: true });
  const r = lancer(vide, REF_VERT);
  ok(r.code === 2 && r.rapport.verdict === "SKIP", `${r.rapport.verdict} / exit ${r.code}`);
});

check("USAGE — une option inconnue ou une date mal formée rend exit 2", () => {
  ok(executer(["--inconnue"]).code === 2 && executer(["--date", "03/11/2026"]).code === 2, "exit attendu 2");
});

check("le verdict PUBLIE ce qu'il n'a pas jugé, dont l'identifiant exact et ce qui se construit à l'exécution", () => {
  ok(Array.isArray(NON_JUGE) && NON_JUGE.length >= 6, "non_juge squelettique");
  ok(NON_JUGE.some((x) => /identifiant exact/.test(x)) && NON_JUGE.some((x) => /construits à l'exécution/.test(x)), "bornes principales non déclarées");
  ok(rouge.rapport.non_juge.length === NON_JUGE.length && /non jugé/.test(rouge.sortie), "non_juge absent de la sortie");
});

check("le contenu des lignes n'est JAMAIS rendu : ni le texte d'un fichier, ni un .env", () => {
  const flux = JSON.stringify(rouge.rapport) + rouge.sortie;
  ok(!/REPLIS|MODELE_SECRET|MODELE_PAR_DEFAUT|fetch\(|export const/.test(flux), "du contenu de fichier est rendu");
});

check("la borne d'affichage se DIT : au-delà de 12 emplacements, le total est écrit", () => {
  const ref = lire("referentiel-vert.json");
  const occ = Array.from({ length: 15 }, (_, i) => ({ id: "modele-a-arrete", depot: "d", fichier: `src/f${i}.mjs`, ligne: 1 }));
  const r = juger({ ref, occurrences: occ, date: JOUR });
  const f = r.findings.find((x) => x.regle === "MT1" && x.id);
  ok(/\+3 autres, 15 au total/.test(f.message), f.message);
});

check("unités — classement des fichiers, frontières d'identifiant, racines de recherche", () => {
  const cl = classerFichier;
  ok(cl("scripts/generer.mjs") === "code" && cl("config/f.json") === "code" && cl(".env.example") === "code" && cl("src/a.py") === "code", "code");
  ok(cl("tests/a.mjs") === "tests" && cl("src/a.test.mjs") === "tests" && cl("oracles/fixtures/x.json") === "tests" && cl("outillage-tests-e2e/a.js") === "tests" && cl("src/self-test.mjs") === "tests", "tests");
  ok(cl("docs/a.md") === "doc" && cl("todo/TODO.jsonl") === "doc" && cl("output/p.html") === "doc" && cl("README.txt") === "doc", "doc");
  ok(cl("src/latest.mjs") === "code" && cl("src/contest.py") === "code", "un mot qui contient « test » n'est pas un test");
  ok(motifIdentifiant("alpha-4o").test("m = 'alpha-4o'") && !motifIdentifiant("alpha-4o").test("m = 'alpha-4o-mini'"), "alpha-4o / alpha-4o-mini");
  ok(!motifIdentifiant("alpha-5").test("alpha-5.6") && motifIdentifiant("alpha-5").test("alpha-5.") && motifIdentifiant("alpha-5").test("models/alpha-5"), "alpha-5.6 / fin de phrase / chemin");
  ok(motifIdentifiant("o3").test('"o3"') && !motifIdentifiant("o3").test("var o3 = 1") && !motifIdentifiant("ada").test("metadata"), "mots isolés");
  ok(racineGit("alpha-4o-mini") === "alpha-" && racineGit("o3-pro") === "o3-pro" && racineGit("/v0/x") === "/v0/x" && racineGit("ft-o4") === "ft-o4", "racines");
  ok(trouverDepots(PARC_ROUGE).length === 3 && trouverDepots(PARC_ROUGE, 3).length === 2, `${trouverDepots(PARC_ROUGE).length} dépôts à 4 niveaux, ${trouverDepots(PARC_ROUGE, 3).length} à 3`);
});

check("de bout en bout : la ligne de commande rend le rouge (exit 1, JSON) puis le vert (exit 0)", () => {
  const cli = (racine) => spawnSync(process.execPath, [ORACLE, "--racine", racine, "--referentiel", REF_VERT, "--date", JOUR, "--json"], { encoding: "utf8" });
  const r = cli(PARC_ROUGE);
  const j = JSON.parse(r.stdout);
  ok(r.status === 1 && j.verdict === "FAIL" && j.compte.mt1 === 4 && j.oracle === "oracle-modeles-tiers", `rouge : exit ${r.status}`);
  const v = cli(PARC_VERT);
  ok(v.status === 0 && JSON.parse(v.stdout).verdict === "PASS", `vert : exit ${v.status}`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\noracle-modeles-tiers : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
