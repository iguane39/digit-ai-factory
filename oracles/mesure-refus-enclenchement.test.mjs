#!/usr/bin/env node
/**
 * mesure-refus-enclenchement.test.mjs — recette à DOUBLE SENS de la mesure des refus du juge
 * d'enclenchement (TF-1319, décision humaine D-5 (b) du 17/10/2026).
 *
 * Sens vert : un run dont le lanceur est consigné par le VRAI `ledger.mjs consigner` de forge-agents
 * (une entrée par oracle) n'est pas compté comme refus, et il entre dans la population « avec
 * l'outil ». Sens rouge : le même run consigné en UNE entrée regroupée est compté comme refus, avec
 * l'indice `regroupement` ; un refus qualifié à tort ou fondé entre au taux ; un refus non qualifié
 * n'y entre pas, et un taux sans qualification vaut `null`, jamais 0.
 *
 * Parc jetable, comme la recette du juge : fausses forges qui découvrent leur dossier, VRAI
 * mécanisme de confrontation de forge-tests copié, VRAI `ledger.mjs` de forge-agents appelé à son
 * chemin. Sans forge-tests, forge-agents ou Python, la recette le dit en une ligne sans compte.
 */
import { spawnSync, execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { interpretePython, MECANISME } from "./oracle-enclenchement.mjs";
import { mesurer, ledgersDesProduits, totaux, TYPE_QUALIFICATION, MARQUE_CONSIGNER } from "./mesure-refus-enclenchement.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PARC_REEL = process.env.FORGE_ROOT ? resolve(process.env.FORGE_ROOT) : resolve(ICI, "..", "..");
const MECANISME_REEL = join(PARC_REEL, MECANISME);
const LEDGER_MJS = join(PARC_REEL, "digit-ai-forge-agents", ".claude", "skills", "forge-agents", "scripts", "ledger.mjs");
const NB_CAS = 12;

const manque = !existsSync(MECANISME_REEL) ? `forge-tests absente (${MECANISME_REEL})`
  : !interpretePython() ? "aucun interpréteur Python"
  : !existsSync(LEDGER_MJS) ? `forge-agents absente (${LEDGER_MJS})` : null;
if (manque) {
  console.log(`  [NON JOUÉ] ${NB_CAS} cas — ${manque} : la mesure ne peut pas rejouer le juge ni consigner par l'outil réel`);
  process.exit(0);
}

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

// ---- le parc jetable : une forge « alpha » à deux oracles, découverts sur son disque ------------
const FAUSSE_DECOUVERTE = [
  'import { existsSync, readdirSync } from "node:fs";',
  'import { basename, dirname, join } from "node:path";',
  'import { fileURLToPath } from "node:url";',
  'const racine = join(dirname(fileURLToPath(import.meta.url)), "..");',
  'const d = join(racine, "oracles");',
  'const oracles = existsSync(d) ? readdirSync(d).filter((f) => /^oracle-[a-z0-9-]+[.]mjs$/.test(f)).sort()',
  '  .map((f) => ({ nom: f.slice(0, -4), chemin: "oracles/" + f })) : [];',
  // TF-1841 : une forge-boîte à outils range ses oracles sous ses skills, comme forge-agents.
  'const sk = join(racine, ".claude", "skills");',
  'if (existsSync(sk)) for (const s of readdirSync(sk).sort()) { const sc = join(sk, s, "scripts");',
  '  if (existsSync(sc)) for (const f of readdirSync(sc).filter((f) => /^oracle-[a-z0-9-]+[.]mjs$/.test(f)).sort())',
  '    oracles.push({ nom: f.slice(0, -4), chemin: ".claude/skills/" + s + "/scripts/" + f }); }',
  'console.log(JSON.stringify({ contrat: "digit-ai/decouverte-oracles@1", forge: basename(racine), racine, regle: "fixture", oracles, non_juge: [] }));',
].join("\n");
const T = mkdtempSync(join(tmpdir(), "mesure-refus-"));
const poser = (p, contenu = "// fixture\n") => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, contenu, "utf8"); };
const RACINE = join(T, "parc");
mkdirSync(dirname(join(RACINE, MECANISME)), { recursive: true });
copyFileSync(MECANISME_REEL, join(RACINE, MECANISME));
poser(join(RACINE, "digit-ai-forge-alpha", "oracles", "decouvrir-oracles.mjs"), FAUSSE_DECOUVERTE);
poser(join(RACINE, "digit-ai-forge-alpha", "oracles", "oracle-a1.mjs"));
poser(join(RACINE, "digit-ai-forge-alpha", "oracles", "oracle-a2.mjs"));
// TF-1841 : une forge-outil — un skill « journal » (l'outil mobilisé), un skill « controles ».
poser(join(RACINE, "digit-ai-forge-outils", "oracles", "decouvrir-oracles.mjs"), FAUSSE_DECOUVERTE);
poser(join(RACINE, "digit-ai-forge-outils", ".claude", "skills", "journal", "scripts", "oracle-journal.mjs"));
poser(join(RACINE, "digit-ai-forge-outils", ".claude", "skills", "controles", "scripts", "oracle-c1.mjs"));
poser(join(RACINE, "digit-ai-forge-outils", ".claude", "skills", "controles", "scripts", "oracle-c2.mjs"));

let n = 0;
/** Un ledger écrit à la main : seq et ts calculés. */
function ledgerBrut(entrees, dossier = T) {
  const p = join(dossier, `ledger-${++n}.jsonl`);
  poser(p, entrees.map((e, i) => JSON.stringify({ seq: i + 1, ts: `2026-10-17T10:${String(i).padStart(2, "0")}:00Z`, ...e })).join("\n") + "\n");
  return p;
}
const ouvrir = (run, extra = {}) => ({ type: "run_open", run, schema_ledger: "1.1", forges_mobilisees: ["alpha"], ...extra });
const clore = { type: "run_close", resume: "fin" };
const v = (oracle, verdict = "PASS") => ({ type: "oracles_verdict", oracle, verdict, cible: "x" });
const qualif = (qualification, cause = "cause écrite") => ({ type: TYPE_QUALIFICATION, qualification, cause });
const mesure1 = (ledger) => mesurer({ ledgers: [ledger], racine: RACINE });
const ledgerMjs = (...a) => execFileSync(process.execPath, [LEDGER_MJS, ...a], { encoding: "utf8", stdio: "pipe" });

/** Un run consigné par le VRAI outil : run_open, rapport de lanceur consigné, run_close. */
function runParOutil(run) {
  const p = join(T, `ledger-${++n}.jsonl`);
  ledgerMjs("append", p, JSON.stringify(ouvrir(run)));
  const rapport = join(T, `rapport-${n}.json`);
  writeFileSync(rapport, JSON.stringify({ runner: "run-oracles-alpha", cible: "page.html", oracles: [{ oracle: "oracle-a1", verdict: "PASS" }, { oracle: "oracle-a2", verdict: "NON_JUGE" }] }), "utf8");
  ledgerMjs("consigner", p, "--rapport", rapport, "--forge", "alpha");
  ledgerMjs("append", p, JSON.stringify(clore));
  return p;
}

// ---- sens VERT ---------------------------------------------------------------------------------
check("vert — un lanceur consigné par `ledger.mjs consigner` (une entrée par oracle) : juge rejoué PASS, aucun refus, population « avec l'outil »", () => {
  const r = mesure1(runParOutil("r-outil"));
  const l = r.runs[0];
  if (r.runs.length !== 1 || l.statut !== "mesure") throw new Error(`1 run mesuré attendu : ${JSON.stringify(r.runs)}`);
  if (!l.avec_outil || l.entrees_consignees_par_outil !== 2) throw new Error(`avec_outil ${l.avec_outil}, ${l.entrees_consignees_par_outil} entrée(s) marquée(s) « ${MARQUE_CONSIGNER} »`);
  if (l.verdict_rejoue !== "PASS" || l.aurait_refuse) throw new Error(`rejoué ${l.verdict_rejoue}, aurait_refuse ${l.aurait_refuse}`);
  if (r.totaux.avec_outil.juges !== 1 || r.totaux.avec_outil.refus !== 0) throw new Error(`totaux avec l'outil : ${JSON.stringify(r.totaux.avec_outil)}`);
});
check("vert — le verdict consigné À LA CLÔTURE prime sur le rejeu : PASS consigné, rejeu FAIL → pas de refus, source « cloture »", () => {
  const l = mesure1(ledgerBrut([ouvrir("r-cloture-pass"), v("oracle-a1"), v("oracle-enclenchement", "PASS"), clore])).runs[0];
  if (l.verdict_rejoue !== "FAIL") throw new Error(`le rejeu aurait dû rendre FAIL (oracle-a2 non servi), rendu ${l.verdict_rejoue}`);
  if (l.verdict_retenu !== "PASS" || l.source_verdict !== "cloture" || l.aurait_refuse) throw new Error(`retenu ${l.verdict_retenu} (${l.source_verdict}), aurait_refuse ${l.aurait_refuse}`);
});
check("vert — un run NON CLOS n'est pas une clôture ; un run SANS SCHÉMA est compté « antérieur », jamais jugé ni refusé", () => {
  const r = mesure1(ledgerBrut([
    { type: "run_open", run: "r-ancien" }, v("x"), clore,
    ouvrir("r-ouvert"), v("oracle-a1"),
  ]));
  if (r.runs.length !== 1 || r.runs[0].run !== "r-ancien" || r.runs[0].statut !== "anterieur") throw new Error(JSON.stringify(r.runs));
  const t = r.totaux.tous;
  if (t.runs_clos !== 1 || t.anterieurs_au_schema !== 1 || t.juges !== 0 || t.refus !== 0) throw new Error(JSON.stringify(t));
});
check("vert — sans qualification, le taux de refus à tort vaut null (jamais 0 par défaut) ; les refus restent comptés « non qualifiés »", () => {
  const t = mesure1(ledgerBrut([ouvrir("r-nq"), v("oracle-a1"), clore])).totaux.tous;
  if (t.refus !== 1 || t.refus_non_qualifies !== 1 || t.taux_refus_a_tort !== null) throw new Error(JSON.stringify(t));
});

// ---- sens ROUGE --------------------------------------------------------------------------------
check("rouge — le MÊME lanceur consigné en UNE entrée regroupée : refus compté, indice `regroupement`, population « sans l'outil »", () => {
  const l = mesure1(ledgerBrut([ouvrir("r-regroupe"), v("oracle-a1 + oracle-a2"), clore])).runs[0];
  if (l.verdict_rejoue !== "FAIL" || !l.aurait_refuse) throw new Error(`rejoué ${l.verdict_rejoue}, aurait_refuse ${l.aurait_refuse}`);
  if (!l.indices.includes("regroupement")) throw new Error(`indice regroupement absent : ${l.indices}`);
  if (l.avec_outil) throw new Error("un run sans entrée marquée par l'outil est compté « avec l'outil »");
  if (JSON.stringify(l.manquants) !== JSON.stringify({ "digit-ai-forge-alpha": ["oracle-a2"] })) throw new Error(`manquants ${JSON.stringify(l.manquants)}`);
});
check("rouge — une forge mobilisée sans AUCUN verdict de ses oracles : indice `forge_sans_aucun_verdict`", () => {
  const l = mesure1(ledgerBrut([ouvrir("r-vide"), clore])).runs[0];
  if (!l.aurait_refuse || !l.indices.includes("forge_sans_aucun_verdict:digit-ai-forge-alpha")) throw new Error(`indices ${l.indices}`);
});
check("rouge — le verdict FAIL consigné à la clôture prime même si le rejeu passerait : la clôture AURAIT été refusée", () => {
  const l = mesure1(ledgerBrut([ouvrir("r-cloture-fail"), v("oracle-enclenchement", "FAIL"), v("oracle-a1"), v("oracle-a2"), clore])).runs[0];
  if (l.verdict_rejoue !== "PASS" || l.verdict_retenu !== "FAIL" || !l.aurait_refuse) throw new Error(`rejoué ${l.verdict_rejoue}, retenu ${l.verdict_retenu}`);
});
check("rouge — refus qualifiés : un à tort et un fondé → taux 0,5 ; la DERNIÈRE qualification du run prime", () => {
  const r = mesure1(ledgerBrut([
    ouvrir("r-q1"), v("oracle-a1"), qualif("fonde"), qualif("a_tort", "forge mobilisée pour un outil"), clore,
    ouvrir("r-q2"), v("oracle-a2"), qualif("fonde", "oracle-a1 n'a pas tourné"), clore,
  ]));
  const [q1, q2] = r.runs;
  if (q1.qualification !== "a_tort" || q2.qualification !== "fonde") throw new Error(`${q1.qualification} / ${q2.qualification}`);
  const t = r.totaux.tous;
  if (t.refus !== 2 || t.refus_a_tort !== 1 || t.refus_fondes !== 1 || t.refus_non_qualifies !== 0 || t.taux_refus_a_tort !== 0.5) throw new Error(JSON.stringify(t));
});
check("rouge — une qualification sans cause ou de valeur inconnue est IGNORÉE et nommée, jamais comptée", () => {
  const l = mesure1(ledgerBrut([ouvrir("r-qi"), v("oracle-a1"), { type: TYPE_QUALIFICATION, qualification: "a_tort" }, { type: TYPE_QUALIFICATION, qualification: "bof", cause: "x" }, clore])).runs[0];
  if (l.qualification !== null || JSON.stringify(l.qualifications_ignorees) !== "[3,4]") throw new Error(`qualification ${l.qualification}, ignorées ${l.qualifications_ignorees}`);
  if (totaux([l]).refus_non_qualifies !== 1) throw new Error("le refus devrait rester non qualifié");
});
check("rouge — deux runs au MÊME identifiant : le second n'est pas rejoué à la place du premier, et c'est dit", () => {
  const r = mesure1(ledgerBrut([ouvrir("r-double"), v("oracle-a1"), v("oracle-a2"), clore, ouvrir("r-double"), clore]));
  if (r.runs.length !== 2 || r.runs[1].verdict_rejoue !== null || !/ne sait rejouer que le premier/.test(r.runs[1].motif_rejoue || "")) throw new Error(JSON.stringify(r.runs[1]));
  if (r.runs[1].juge || r.runs[1].aurait_refuse) throw new Error("un run non rejoué ne peut être ni jugé ni refusé sans verdict de clôture");
});

// ---- TF-1841 : la promesse d'une forge-outil bornée aux parties déclarées ------------------------
check("rouge puis vert TF-1841 — forge-outil sans partie : refus qui réclame les autres skills ; parties déclarées : pas de refus, borne relevée", () => {
  const OUT = { forges_mobilisees: ["outils"] };
  const sans = mesure1(ledgerBrut([ouvrir("r-outil-entier", OUT), v("oracle-journal"), clore])).runs[0];
  if (!sans.aurait_refuse || JSON.stringify(sans.manquants) !== JSON.stringify({ "digit-ai-forge-outils": ["oracle-c1", "oracle-c2"] }) || sans.promesses_bornees) {
    throw new Error(`sans parties : ${JSON.stringify({ refus: sans.aurait_refuse, manquants: sans.manquants, bornees: sans.promesses_bornees })}`);
  }
  const avec = mesure1(ledgerBrut([ouvrir("r-outil-borne", { ...OUT, parties_mobilisees: { outils: ["journal"] } }), v("oracle-journal"), clore])).runs[0];
  if (avec.aurait_refuse || avec.verdict_rejoue !== "PASS") throw new Error(`avec parties : rejoué ${avec.verdict_rejoue}`);
  const b = avec.promesses_bornees?.["digit-ai-forge-outils"];
  if (b?.promis !== 1 || b?.decouverts !== 3) throw new Error(`borne non relevée : ${JSON.stringify(avec.promesses_bornees)}`);
});

// ---- la ligne de commande : mesurer n'est pas juger --------------------------------------------
check("CLI — des refus mesurés sortent en exit 0, JAMAIS 1 ; aucun ledger lisible sort en exit 2", () => {
  const produits = join(T, "produits");
  const p = join(produits, "produit-x", "forge", "ledger.jsonl");
  poser(p, [ouvrir("r-cli"), v("oracle-a1"), clore].map((e, i) => JSON.stringify({ seq: i + 1, ts: `2026-10-17T10:0${i}:00Z`, ...e })).join("\n") + "\n");
  poser(join(produits, "digit-ai-forge-zeta", "forge", "ledger.jsonl"), "{}\n");
  if (ledgersDesProduits(produits).length !== 1) throw new Error(`un dépôt digit-ai-* a été pris pour un produit : ${ledgersDesProduits(produits)}`);
  const script = join(ICI, "mesure-refus-enclenchement.mjs");
  const r1 = spawnSync(process.execPath, [script, "--produits", produits, "--racine", RACINE], { encoding: "utf8" });
  const j = JSON.parse(r1.stdout);
  if (r1.status !== 0 || j.totaux.tous.refus !== 1) throw new Error(`exit ${r1.status}, refus ${j.totaux.tous.refus}`);
  const vide = join(T, "vide");
  mkdirSync(vide, { recursive: true });
  const r2 = spawnSync(process.execPath, [script, "--produits", vide, "--racine", RACINE], { encoding: "utf8" });
  if (r2.status !== 2) throw new Error(`exit ${r2.status} au lieu de 2 sans ledger`);
});

rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
if (pass + fail !== NB_CAS) { console.error(`  [FAIL] ${pass + fail} cas joués, ${NB_CAS} annoncés`); fail++; }
console.log(`\nmesure-refus-enclenchement : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
