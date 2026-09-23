#!/usr/bin/env node
/**
 * oracle-enclenchement.test.mjs — recette à DOUBLE SENS du juge d'enclenchement (TF-1319).
 *
 * Le juge rend VERT quand chaque oracle découvert d'une forge mobilisée a son verdict au ledger du
 * run ; ses fixtures rouges prouvent qu'il sait REFUSER, par la règle nommée (EN1), une promesse
 * non servie — y compris quand elle est citée dans une entrée composite ou consignée sans verdict.
 * Le sens vert porte autant : un juge qui accuserait un SKIP consigné, ou un verdict servi sans
 * promesse, serait contourné dans la semaine — l'étude du 19/08 le nomme comme le risque propre
 * d'un juge des juges.
 *
 * TOUT SE JOUE SUR UN PARC JETABLE : de fausses forges, chacune avec sa découverte au contrat
 * `digit-ai/decouverte-oracles@1`, qui lit son propre dossier. Le mécanisme de confrontation, lui,
 * n'est PAS simulé : c'est le vrai `forge_tests/confrontation.py`, COPIÉ depuis le parc du poste —
 * un mécanisme factice ne prouverait que lui-même. Sans forge-tests clonée ni Python, la recette ne
 * peut rien prouver ici : elle le dit en une ligne sans compte, et le harnais la nomme au lieu de
 * la compter.
 *
 * Joué par `oracles\self-tests.mjs` (I1 via la table partagée, I2 comme tout `*.test.mjs`).
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { juger, nomNormalise, forgeCanonique, interpretePython, MECANISME, NON_JUGE } from "./oracle-enclenchement.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PARC_REEL = process.env.FORGE_ROOT ? resolve(process.env.FORGE_ROOT) : resolve(ICI, "..", "..");
const MECANISME_REEL = join(PARC_REEL, MECANISME);

if (!existsSync(MECANISME_REEL) || !interpretePython()) {
  console.log(`oracle-enclenchement : SANS OBJET sur ce poste — ${existsSync(MECANISME_REEL)
    ? "aucun interpréteur Python"
    : `forge-tests absente (${MECANISME_REEL})`} : le mécanisme de confrontation réel n'est pas joignable, aucun cas n'est joué et aucun n'est compté`);
  process.exit(0);
}

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

// ---- le parc jetable ------------------------------------------------------------------------------
// La fausse découverte LIT SON DOSSIER, comme les vraies : aucune liste de noms dans cette recette.
const FAUSSE_DECOUVERTE = [
  'import { existsSync, readdirSync } from "node:fs";',
  'import { basename, dirname, join } from "node:path";',
  'import { fileURLToPath } from "node:url";',
  'const racine = join(dirname(fileURLToPath(import.meta.url)), "..");',
  'const d = join(racine, "oracles");',
  'const oracles = existsSync(d) ? readdirSync(d).filter((f) => /^oracle-[a-z0-9-]+[.]mjs$/.test(f)).sort()',
  '  .map((f) => ({ nom: f.slice(0, -4), chemin: "oracles/" + f })) : [];',
  'console.log(JSON.stringify({ contrat: "digit-ai/decouverte-oracles@1", forge: basename(racine), racine, regle: "fixture", oracles, non_juge: [] }));',
].join("\n");

const T = mkdtempSync(join(tmpdir(), "enclenchement-"));
let n = 0;
const poser = (p, contenu = "// fixture\n") => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, contenu, "utf8"); };

/** Un parc : `forges` = { nom: [oracles] | "sans-entree" | "casse" }, plus forge-tests et son mécanisme réel. */
function parc(forges, { avecMecanisme = true } = {}) {
  const racine = join(T, `parc${++n}`);
  mkdirSync(racine, { recursive: true });
  if (avecMecanisme) {
    const dest = join(racine, MECANISME);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(MECANISME_REEL, dest);
  }
  for (const [nom, def] of Object.entries(forges)) {
    const depot = join(racine, nom);
    mkdirSync(depot, { recursive: true });
    if (def === "sans-entree") { poser(join(depot, "README.md"), "# forge sans oracle\n"); continue; }
    if (def === "casse") { poser(join(depot, "oracles", "decouvrir-oracles.mjs"), 'console.log("ceci n est pas du JSON");\n'); continue; }
    poser(join(depot, "oracles", "decouvrir-oracles.mjs"), FAUSSE_DECOUVERTE);
    for (const o of def) poser(join(depot, "oracles", `${o}.mjs`));
  }
  return racine;
}

/** Un ledger : seq et ts calculés ; le premier élément est le run_open. */
function ledger(racine, entrees) {
  const p = join(racine, `ledger-${++n}.jsonl`);
  const lignes = entrees.map((e, i) => JSON.stringify({ seq: i + 1, ts: `2026-09-23T10:${String(i).padStart(2, "0")}:00Z`, ...e }));
  writeFileSync(p, lignes.join("\n") + "\n", "utf8");
  return p;
}
const ouvrir = (extra = {}) => ({ type: "run_open", run: "r1", schema_ledger: "1.0", ...extra });

/**
 * Une forge VERSIONNÉE : un premier état avec oracle-h1, un second qui ajoute oracle-h2. C'est la
 * seule façon de rejouer le défaut mesuré le 23/09 sur un ledger réel — un run réclamé d'un oracle
 * né APRÈS lui — et c'est la version consignée au `run_open` qui doit le trancher, pas le disque.
 */
function forgeVersionnee(racine) {
  const depot = join(racine, "digit-ai-forge-histoire");
  const git = (...a) => {
    const r = spawnSync("git", ["-C", depot, ...a], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(`git ${a.join(" ")} : ${r.stderr || r.error}`);
    return r.stdout.trim();
  };
  poser(join(depot, "oracles", "decouvrir-oracles.mjs"), FAUSSE_DECOUVERTE);
  poser(join(depot, "oracles", "oracle-h1.mjs"));
  git("init", "-q");
  git("config", "user.email", "recette@local");
  git("config", "user.name", "recette");
  git("add", "-A");
  git("commit", "-q", "-m", "avant");
  const avant = git("rev-parse", "--short", "HEAD");
  poser(join(depot, "oracles", "oracle-h2.mjs"));
  git("add", "-A");
  git("commit", "-q", "-m", "apres");
  return { avant, apres: git("rev-parse", "--short", "HEAD") };
}
const v = (oracle, verdict = "PASS") => ({ type: "oracles_verdict", oracle, verdict, cible: "x" });
const clore = { type: "run_close", resume: "fin" };
const en1 = (r, forge) => r.findings.find((f) => f.regle === "EN1" && f.forge === forge);
const cli = (args) => {
  const r = spawnSync(process.execPath, [join(ICI, "oracle-enclenchement.mjs"), ...args], { encoding: "utf8" });
  let j = null;
  try { j = JSON.parse(r.stdout); } catch { /* illisible : les cas le disent */ }
  return { code: r.status, j };
};

// Le parc de référence : deux forges jugeables, une sans entrée, une cassée, une sans oracle, le pilot.
const P = parc({
  "digit-ai-forge-alpha": ["oracle-a1", "oracle-a2"],
  "digit-ai-forge-beta": ["oracle-b1"],
  "digit-ai-forge-gamma": "sans-entree",
  "digit-ai-forge-casse": "casse",
  "digit-ai-forge-vide": [],
  "digit-ai-forge-jumelle": ["oracle-a1"],
  "digit-ai-factory": ["oracle-p1"],
});
const MOB = { forges_mobilisees: ["alpha", "beta (delta, --rendu)"] };

try {
  // ---- EN1, sens vert -----------------------------------------------------------------------------
  check("VERT — chaque oracle découvert des forges mobilisées a son verdict : PASS, exit 0 (CLI, --racine)", () => {
    const l = ledger(P, [ouvrir(MOB), v("oracle-a1"), v("oracle-a2", "FAIL"), v("oracle-b1"), clore]);
    const r = cli([l, "--racine", P]);
    if (r.code !== 0 || r.j?.verdict !== "PASS") throw new Error(`exit ${r.code}, verdict ${r.j?.verdict} — ${r.j?.motif || ""}`);
    if (!["oracle", "verdict", "findings", "non_juge"].every((k) => k in r.j)) throw new Error("contrat de sortie incomplet");
    if (r.j.oracle !== "oracle-enclenchement" || !r.j.non_juge.length) throw new Error("nom d'oracle ou non_juge absent");
    for (const f of ["digit-ai-forge-alpha", "digit-ai-forge-beta"]) if (en1(r.j, f)?.statut !== "PASS") throw new Error(`EN1 ${f} ${en1(r.j, f)?.statut}`);
  });

  check("VERT — un verdict SKIP ou NA SERT la promesse : « a tourné sans pouvoir juger » n'est pas « n'a pas tourné »", () => {
    const r = juger({ ledger: ledger(P, [ouvrir(MOB), v("oracle-a1", "SKIP"), v("oracle-a2", "NA"), v("oracle-b1", "PARTIEL"), clore]), racine: P });
    if (r.verdict !== "PASS") throw new Error(`${r.verdict} — un non-jugement déclaré est accusé comme une absence`);
  });

  check("VERT — le nom se lit sans chemin, sans extension, sans casse, sans ses arguments", () => {
    if (nomNormalise("oracles/oracle-a1.mjs --json") !== "oracle-a1") throw new Error(nomNormalise("oracles/oracle-a1.mjs --json"));
    if (nomNormalise("C:\\x\\ORACLE-A2.MJS") !== "oracle-a2") throw new Error(nomNormalise("C:\\x\\ORACLE-A2.MJS"));
    if (nomNormalise("oracle-conformite-projet (audit complet)") !== "oracle-conformite-projet") throw new Error("annotation non retirée");
    const r = juger({ ledger: ledger(P, [ouvrir(MOB), v("oracles/oracle-a1.mjs --json"), v("ORACLE-A2.MJS"), v("oracle-b1 (relevé)"), clore]), racine: P });
    if (r.verdict !== "PASS") throw new Error(r.verdict);
  });

  // ---- EN1, sens rouge ----------------------------------------------------------------------------
  check("ROUGE EN1 — une promesse non servie est un FAIL qui la NOMME, forge par forge, exit 1 (CLI)", () => {
    const l = ledger(P, [ouvrir(MOB), v("oracle-a1"), v("oracle-b1"), clore]);
    const r = cli([l, "--racine", P]);
    if (r.code !== 1 || r.j?.verdict !== "FAIL") throw new Error(`exit ${r.code}, verdict ${r.j?.verdict}`);
    const f = en1(r.j, "digit-ai-forge-alpha");
    if (f?.statut !== "FAIL" || JSON.stringify(f.manquants) !== JSON.stringify(["oracle-a2"])) throw new Error(JSON.stringify(f));
    if (en1(r.j, "digit-ai-forge-beta")?.statut !== "PASS") throw new Error("la forge servie est accusée avec l'autre");
  });

  check("ROUGE EN1 — un run qui n'a rien consigné n'a servi aucune promesse : toutes sont nommées", () => {
    const r = juger({ ledger: ledger(P, [ouvrir({ forges_mobilisees: ["alpha"] }), clore]), racine: P });
    if (r.verdict !== "FAIL" || JSON.stringify(en1(r, "digit-ai-forge-alpha").manquants) !== JSON.stringify(["oracle-a1", "oracle-a2"])) throw new Error(`${r.verdict} ${JSON.stringify(en1(r, "digit-ai-forge-alpha"))}`);
  });

  check("ROUGE EN1 — une entrée COMPOSITE ne sert que son premier nom, et le constat dit où l'autre est cité", () => {
    const r = juger({ ledger: ledger(P, [ouvrir(MOB), v("oracle-a1 + oracle-a2 (lot)"), v("oracle-b1"), clore]), racine: P });
    const f = en1(r, "digit-ai-forge-alpha");
    if (r.verdict !== "FAIL" || JSON.stringify(f.manquants) !== JSON.stringify(["oracle-a2"])) throw new Error(`${r.verdict} ${JSON.stringify(f?.manquants)}`);
    if (!/seq 2/.test(f.message) || !f.cites_sans_etre_servis?.["oracle-a2"]) throw new Error("la citation n'est pas nommée : le lecteur ne voit pas la cause");
  });

  check("ROUGE EN1 — une entrée SANS verdict n'est pas créditée, et elle est dite (non canonique)", () => {
    const r = juger({ ledger: ledger(P, [ouvrir(MOB), v("oracle-a1"), { type: "oracles_verdict", oracle: "oracle-a2" }, v("oracle-b1"), clore]), racine: P });
    if (r.verdict !== "FAIL" || !/sans verdict/.test(en1(r, "digit-ai-forge-alpha").message)) throw new Error(`${r.verdict} — ${en1(r, "digit-ai-forge-alpha")?.message}`);
    if (!r.non_juge.some((x) => /sans `oracle` ou sans `verdict`/.test(x) && /seq 3/.test(x))) throw new Error("l'entrée non canonique est tue");
  });

  check("ROUGE EN1 — le dernier run d'un ledger de version est jugé par défaut, `--run` en choisit un autre", () => {
    const l = ledger(P, [ouvrir({ ...MOB, run: "v1" }), v("oracle-a1"), v("oracle-a2"), v("oracle-b1"), clore,
      ouvrir({ ...MOB, run: "v2" }), v("oracle-a1"), v("oracle-b1"), clore]);
    const dernier = juger({ ledger: l, racine: P });
    if (dernier.verdict !== "FAIL" || dernier.run !== "v2") throw new Error(`${dernier.verdict} sur ${dernier.run}`);
    if (!dernier.non_juge.some((x) => /v1/.test(x) && /--run/.test(x))) throw new Error("l'autre run du ledger n'est pas dit");
    const premier = cli([l, "--racine", P, "--run", "v1"]);
    if (premier.code !== 0 || premier.j?.run !== "v1") throw new Error(`--run v1 : exit ${premier.code}, run ${premier.j?.run}`);
  });

  // ---- la promesse se lit à la VERSION que le run a consignée (versions_forges, R-19) ------------
  const H = forgeVersionnee(P);
  const HIST = { forges_mobilisees: ["histoire"] };

  check("VERT — un oracle NÉ APRÈS le run (absent de la version consignée) est SUSPENDU, jamais réclamé", () => {
    const r = juger({ ledger: ledger(P, [ouvrir({ ...HIST, versions_forges: { "digit-ai-forge-histoire": `v1.0.0-1-g${H.avant}` } }), v("oracle-h1"), clore]), racine: P });
    const f = en1(r, "digit-ai-forge-histoire");
    if (r.verdict !== "PASS") throw new Error(`${r.verdict} — ${f?.message}`);
    if (!/absent de digit-ai-forge-histoire@/.test(f.suspendus?.["oracle-h2"] || "")) throw new Error(`suspension non dite : ${JSON.stringify(f.suspendus)}`);
  });

  check("ROUGE EN1 — le même oracle, PRÉSENT à la version consignée, est réclamé", () => {
    const r = juger({ ledger: ledger(P, [ouvrir({ ...HIST, versions_forges: { "digit-ai-forge-histoire": H.apres } }), v("oracle-h1"), clore]), racine: P });
    if (r.verdict !== "FAIL" || JSON.stringify(en1(r, "digit-ai-forge-histoire").manquants) !== JSON.stringify(["oracle-h2"])) throw new Error(`${r.verdict}`);
  });

  check("ROUGE EN1 — une version consignée INCONNUE du clone, ou aucune version : la promesse est celle d'aujourd'hui, et le risque est DIT", () => {
    const inconnue = juger({ ledger: ledger(P, [ouvrir({ ...HIST, versions_forges: { "digit-ai-forge-histoire": "0000000" } }), v("oracle-h1"), clore]), racine: P });
    if (inconnue.verdict !== "FAIL" || !inconnue.non_juge.some((x) => /inconnue du clone/.test(x))) throw new Error(`${inconnue.verdict} — risque tu`);
    const aucune = juger({ ledger: ledger(P, [ouvrir(HIST), v("oracle-h1"), clore]), racine: P });
    if (aucune.verdict !== "FAIL" || !aucune.non_juge.some((x) => /aucune version consignée/.test(x))) throw new Error(`${aucune.verdict} — risque tu`);
  });

  // ---- EN2 : servi sans promesse, signalé jamais accusé -------------------------------------------
  check("VERT EN2 — un verdict servi sans promesse ne fait JAMAIS échouer : hors mobilisation et inconnu sont SIGNALÉS", () => {
    const r = juger({ ledger: ledger(P, [ouvrir({ forges_mobilisees: ["alpha"] }), v("oracle-a1"), v("oracle-a2"), v("oracle-b1"), v("oracle-p1"), v("pytest"), clore]), racine: P });
    if (r.verdict !== "PASS") throw new Error(`${r.verdict} — l'asymétrie est rompue`);
    const f = r.findings.find((x) => x.regle === "EN2");
    if (f?.statut !== "AVERTISSEMENT") throw new Error(`EN2 ${f?.statut}`);
    const hors = Object.fromEntries(f.hors_mobilisation.map((x) => [x.nom, x.depots.join("/")]));
    if (hors["oracle-b1"] !== "digit-ai-forge-beta" || hors["oracle-p1"] !== "digit-ai-factory") throw new Error(JSON.stringify(hors));
    if (JSON.stringify(f.inconnus.map((x) => x.nom)) !== JSON.stringify(["pytest"])) throw new Error(JSON.stringify(f.inconnus));
    if (!r.non_juge.some((x) => /digit-ai-forge-gamma/.test(x) && /inconnu/.test(x))) throw new Error("les dépôts sans découverte ne sont pas dits");
  });

  check("VERT — un nom découvert par deux forges mobilisées sert les deux, et l'ambiguïté est DITE", () => {
    const r = juger({ ledger: ledger(P, [ouvrir({ forges_mobilisees: ["alpha", "jumelle"] }), v("oracle-a1"), v("oracle-a2"), clore]), racine: P });
    if (r.verdict !== "PASS") throw new Error(r.verdict);
    if (!r.non_juge.some((x) => /oracle-a1/.test(x) && /jumelle/.test(x) && /plusieurs forges/.test(x))) throw new Error("ambiguïté tue");
  });

  // ---- ce qui ne se juge pas : SKIP motivé, jamais PASS ----------------------------------------------
  check("SKIP — un run sans `schema_ledger` précède le schéma : rien n'est jugé, exit 2 (CLI)", () => {
    const l = ledger(P, [{ type: "run_open", run: "ancien", ...MOB }, v("oracle-a1"), clore]);
    const r = cli([l, "--racine", P]);
    if (r.code !== 2 || r.j?.verdict !== "SKIP" || !/schema_ledger/.test(r.j.motif)) throw new Error(`exit ${r.code} ${r.j?.verdict} ${r.j?.motif}`);
  });

  check("SKIP — forges mobilisées inconnues : ce juge ne devine pas, et `--forges` lève le doute", () => {
    const l = ledger(P, [ouvrir(), v("oracle-a1"), v("oracle-a2"), clore]);
    const r = juger({ ledger: l, racine: P });
    if (r.verdict !== "SKIP" || !/forges mobilisées inconnues/.test(r.motif)) throw new Error(`${r.verdict} ${r.motif}`);
    const avec = cli([l, "--racine", P, "--forges", "digit-ai-forge-alpha"]);
    if (avec.code !== 0 || avec.j?.forges_mobilisees?.source !== "--forges") throw new Error(`--forges : exit ${avec.code}`);
  });

  check("SKIP — `--forges` l'emporte sur le run_open, et une annotation après le nom est ignorée", () => {
    if (forgeCanonique("beta (delta, --rendu)") !== "digit-ai-forge-beta" || forgeCanonique("forge-ops") !== "digit-ai-forge-ops") throw new Error("nom canonique faux");
    const r = juger({ ledger: ledger(P, [ouvrir({ forges_mobilisees: ["beta"] }), v("oracle-a1"), v("oracle-a2"), clore]), forges: "alpha", racine: P });
    if (r.verdict !== "PASS" || r.forges_mobilisees.forges.join() !== "digit-ai-forge-alpha") throw new Error(`${r.verdict} ${r.forges_mobilisees?.forges}`);
  });

  check("SKIP — une forge non clonée sort en SKIP motivé, les autres sont jugées ; toutes absentes = SKIP global", () => {
    const r = juger({ ledger: ledger(P, [ouvrir({ forges_mobilisees: ["alpha", "absente"] }), v("oracle-a1"), v("oracle-a2"), clore]), racine: P });
    if (r.verdict !== "PASS") throw new Error(r.verdict);
    const f = en1(r, "digit-ai-forge-absente");
    if (f?.statut !== "SKIP" || !/pas clonée/.test(f.message)) throw new Error(JSON.stringify(f));
    if (!r.non_juge.some((x) => /digit-ai-forge-absente/.test(x))) throw new Error("la forge non jugée n'est pas au non_juge");
    const seule = juger({ ledger: ledger(P, [ouvrir({ forges_mobilisees: ["absente"] }), v("oracle-a1"), clore]), racine: P });
    if (seule.verdict !== "SKIP" || !/aucune forge mobilisée n'a pu être jugée/.test(seule.motif)) throw new Error(`${seule.verdict} ${seule.motif}`);
  });

  check("SKIP — forge sans entrée de découverte, découverte cassée, forge sans oracle : jamais un PASS", () => {
    for (const [forge, attendu] of [["gamma", /n'expose pas d'entrée de découverte/], ["casse", /illisible/], ["vide", /AUCUN élément comparable/]]) {
      const r = juger({ ledger: ledger(P, [ouvrir({ forges_mobilisees: [forge] }), v("oracle-a1"), clore]), racine: P });
      const f = en1(r, `digit-ai-forge-${forge}`);
      if (r.verdict !== "SKIP" || f?.statut !== "SKIP" || !attendu.test(f.message)) throw new Error(`${forge} : ${r.verdict} ${f?.statut} ${f?.message}`);
    }
  });

  check("SKIP — un service ILLISIBLE (aucune entrée canonique) n'est pas un service vide : pas d'accusation", () => {
    const r = juger({ ledger: ledger(P, [ouvrir({ forges_mobilisees: ["alpha"] }), { type: "oracles_verdict", oracles: ["oracle-a1", "oracle-a2"] }, clore]), racine: P });
    if (r.verdict !== "SKIP" || !/ILLISIBLE/.test(en1(r, "digit-ai-forge-alpha")?.message || "")) throw new Error(`${r.verdict} ${en1(r, "digit-ai-forge-alpha")?.message}`);
  });

  check("SKIP — sans le mécanisme de forge-tests, le juge ne confronte rien et le DIT, exit 2", () => {
    const sans = parc({ "digit-ai-forge-alpha": ["oracle-a1"] }, { avecMecanisme: false });
    const r = cli([ledger(sans, [ouvrir({ forges_mobilisees: ["alpha"] }), v("oracle-a1"), clore]), "--racine", sans]);
    if (r.code !== 2 || !/mécanisme de confrontation introuvable/.test(r.j?.motif || "")) throw new Error(`exit ${r.code} ${r.j?.motif}`);
  });

  check("SKIP — un ledger absent est un SKIP motivé, pas une exception", () => {
    const r = juger({ ledger: join(T, "absent.jsonl"), racine: P });
    if (r.verdict !== "SKIP" || !/introuvable/.test(r.motif)) throw new Error(`${r.verdict} ${r.motif}`);
  });

  check("le run non clos est DIT au non_juge ; le run clos ne l'est pas", () => {
    const ouvert = juger({ ledger: ledger(P, [ouvrir(MOB), v("oracle-a1"), v("oracle-a2"), v("oracle-b1")]), racine: P });
    if (!ouvert.non_juge.some((x) => /pas clos/.test(x))) throw new Error("run ouvert non signalé");
    const clos = juger({ ledger: ledger(P, [ouvrir(MOB), v("oracle-a1"), v("oracle-a2"), v("oracle-b1"), clore]), racine: P });
    if (clos.non_juge.some((x) => /pas clos/.test(x))) throw new Error("run clos signalé ouvert");
  });

  check("le verdict PUBLIE ce qu'il ne juge pas : qualité des verdicts, applicabilité fine, forme du ledger", () => {
    if (!Array.isArray(NON_JUGE) || NON_JUGE.length < 3) throw new Error("non_juge squelettique");
    if (!NON_JUGE.some((x) => /QUALITÉ/.test(x)) || !NON_JUGE.some((x) => /applicabilité FINE/.test(x))) throw new Error("une borne de l'étude n'est pas déclarée");
  });
} finally {
  rmSync(T, { recursive: true, force: true });
}

console.log(`\noracle-enclenchement : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
