#!/usr/bin/env node
/**
 * oracle-insatisfactions.mjs — juge le registre des insatisfactions (TF-0287) ET publie
 * sa mesure : réouvertures et délai dépôt → clôture. « Satisfaction dès la première
 * demande » n'est pas une intention, c'est le compteur de réouvertures à zéro.
 *
 * Pourquoi ce registre existe séparément de TODO-FORGE : un item TF est une amélioration
 * (candidat → décidé → corrigé → archivé) ; une insatisfaction a un cycle de vie qui n'y
 * entre pas — elle se ROUVRE (« ça ne va toujours pas »), elle porte un délai
 * dépôt→release, et son instruction est un dossier à six blocs. Forcer l'un dans l'autre
 * aurait déformé les deux (étude d'opportunité 20260815d, option O3 écartée).
 *
 * Événements (une ligne JSON chacun) :
 *   depot        {ts, id, produit, dossier, resume}         — l'humain a déposé, une phrase suffit
 *   reouverture  {ts, id, motif}                            — « toujours pas » : JAMAIS un nouvel id
 *   instruction  {ts, id, dossier, blocs{a..f}}             — les six blocs, chacun non vide
 *   cloture      {ts, id, verdict, release?}                — corrige | non_reproduit | preference
 *
 * Règles (chacune binaire) :
 *   I1  id au format INS-\d{4}, exactement UN depot par id, séquence sans trou ;
 *   I2  tout événement autre que depot référence un id déposé, et son ts ne recule pas —
 *       une réouverture qui créerait un nouveau dossier est le défaut que la règle vise ;
 *   I3  une instruction porte ses SIX blocs (a_reproduction, b_cause_racine,
 *       c_gates_en_defaut, d_solutions, e_correctif_release, f_retours), chacun non vide —
 *       le bloc manquant est NOMMÉ, jamais un « dossier incomplet » anonyme ;
 *   I4  la mesure est calculable : ts partout, et toute cloture a son depot daté antérieur
 *       (sans quoi le délai dépôt→clôture ne se calcule pas).
 *
 * Ce qu'il ne juge PAS : la justesse d'une cause racine, la pertinence d'une solution, la
 * sincérité d'un verdict. Il tient la forme opposable et la mesure — comme oracle-todo.
 *
 * Usage : node oracle-insatisfactions.mjs [<REGISTRE.jsonl>]   → verdict JSON, exit 0/1/2
 *         node oracle-insatisfactions.mjs --self-test          → fixtures double sens
 */
import { readFileSync, existsSync, writeFileSync, mkdtempSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const RE_ID = /^INS-\d{4}$/;
const BLOCS = ["a_reproduction", "b_cause_racine", "c_gates_en_defaut",
  "d_solutions", "e_correctif_release", "f_retours"];

const NON_JUGE = [
  "la justesse d'une cause racine et la pertinence d'une solution — jugement humain",
  "la sincérité d'un verdict de clôture (corrige / non_reproduit / preference)",
  "l'existence sur disque du dossier d'instruction — le registre porte le chemin, pas le contenu",
];

function juger(fichier) {
  const findings = [];
  const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", ou: "-", message });

  if (!existsSync(fichier)) {
    return { verdict: "SKIP", findings, mesure: null,
      motif: `registre absent : ${fichier} — le circuit n'a pas encore reçu de dépôt` };
  }

  const evts = readFileSync(fichier, "utf8").split("\n").filter((l) => l.trim())
    .map((l, i) => {
      try { return { ligne: i + 1, ...JSON.parse(l) }; }
      catch { ko("I1", `ligne ${i + 1}`, "ligne non-JSON"); return null; }
    }).filter(Boolean);

  // ── I1 · identité ────────────────────────────────────────────────────────────────
  const depots = new Map();
  for (const e of evts.filter((x) => x.ev === "depot")) {
    if (!RE_ID.test(String(e.id || ""))) { ko("I1", `ligne ${e.ligne}`, `id hors format INS-\\d{4} : « ${e.id} »`); continue; }
    if (depots.has(e.id)) { ko("I1", `ligne ${e.ligne}`, `second depot pour le même id — ${e.id}`); continue; }
    depots.set(e.id, e);
  }
  const numeros = [...depots.keys()].map((i) => Number(i.slice(4))).sort((a, b) => a - b);
  const trous = numeros.filter((n, i) => i > 0 && n !== numeros[i - 1] + 1);
  if (trous.length) ko("I1", "séquence", `identifiant(s) sauté(s) avant : ${trous.map((n) => "INS-" + String(n).padStart(4, "0")).join(", ")}`);
  else if (depots.size) ok("I1", `${depots.size} dossier(s), identité et séquence tenues`);

  // ── I2 · rattachement et chronologie ─────────────────────────────────────────────
  const dernierTs = new Map();
  for (const e of evts) {
    if (e.ev === "depot") { dernierTs.set(e.id, e.ts || ""); continue; }
    if (!depots.has(e.id)) {
      ko("I2", `ligne ${e.ligne}`, `« ${e.ev} » sur un id jamais déposé — ${e.id} ; un « toujours pas » ROUVRE un dossier, il n'en crée pas un nouveau`);
      continue;
    }
    if ((e.ts || "") < (dernierTs.get(e.id) || "")) ko("I2", `ligne ${e.ligne}`, `ts en recul sur ${e.id}`);
    else dernierTs.set(e.id, e.ts || dernierTs.get(e.id));
  }
  if (!findings.some((f) => f.regle === "I2" && f.statut === "FAIL")) ok("I2", "tout événement se rattache à son dépôt, chronologie tenue");

  // ── I3 · six blocs, le manquant est nommé ────────────────────────────────────────
  for (const e of evts.filter((x) => x.ev === "instruction")) {
    const blocs = e.blocs || {};
    const absents = BLOCS.filter((b) => !String(blocs[b] || "").trim());
    if (absents.length) ko("I3", `ligne ${e.ligne}`, `instruction de ${e.id} incomplète — bloc(s) manquant(s) : ${absents.join(", ")}`);
  }
  const instructions = evts.filter((x) => x.ev === "instruction").length;
  if (instructions && !findings.some((f) => f.regle === "I3")) ok("I3", `${instructions} instruction(s), six blocs tenus`);

  // ── I4 · mesure calculable ───────────────────────────────────────────────────────
  for (const e of evts) if (!e.ts) ko("I4", `ligne ${e.ligne}`, `événement « ${e.ev} » sans ts — la mesure ne se calcule plus`);
  for (const e of evts.filter((x) => x.ev === "cloture")) {
    const d = depots.get(e.id);
    if (d && e.ts && d.ts && e.ts < d.ts) ko("I4", `ligne ${e.ligne}`, `cloture antérieure au dépôt sur ${e.id}`);
  }
  if (!findings.some((f) => f.regle === "I4")) ok("I4", "ts partout, délais calculables");

  // ── la mesure, publiée (c'est l'objet du circuit) ────────────────────────────────
  const reouvertures = evts.filter((e) => e.ev === "reouverture");
  const parDossier = {};
  for (const r of reouvertures) parDossier[r.id] = (parDossier[r.id] || 0) + 1;
  const delais = evts.filter((e) => e.ev === "cloture" && depots.has(e.id) && e.ts && depots.get(e.id).ts)
    .map((e) => Math.round((Date.parse(e.ts) - Date.parse(depots.get(e.id).ts)) / 36e5));
  const mesure = {
    dossiers: depots.size,
    reouvertures_total: reouvertures.length,
    reouvertures_par_dossier: parDossier,
    dossiers_sans_reouverture: depots.size - Object.keys(parDossier).length,
    delai_depot_cloture_heures: delais.length
      ? { n: delais.length, median: delais.sort((a, b) => a - b)[Math.floor(delais.length / 2)] }
      : null,
  };

  const fail = findings.some((f) => f.statut === "FAIL");
  return { verdict: fail ? "FAIL" : "PASS", findings, mesure };
}

// ── self-test : fixtures double sens ───────────────────────────────────────────────
function selfTest() {
  const base = mkdtempSync(join(tmpdir(), "ins-"));
  const ecrire = (nom, lignes) => {
    const f = join(base, nom);
    writeFileSync(f, lignes.map((l) => JSON.stringify(l)).join("\n") + "\n");
    return f;
  };
  const depot = { ev: "depot", ts: "2026-08-15T10:00:00Z", id: "INS-0001", produit: "site", dossier: "d/", resume: "le menu est compressé" };
  const blocsPleins = Object.fromEntries(BLOCS.map((b) => [b, "instruit"]));
  const cas = [];

  const vert = juger(ecrire("vert.jsonl", [
    depot,
    { ev: "instruction", ts: "2026-08-15T11:00:00Z", id: "INS-0001", dossier: "d/", blocs: blocsPleins },
    { ev: "cloture", ts: "2026-08-15T14:00:00Z", id: "INS-0001", verdict: "corrige", release: "1.2.0" },
  ]));
  cas.push(["vert  — dossier complet, six blocs, clos", vert.verdict === "PASS", vert.verdict]);
  cas.push(["vert  — mesure publiée (0 réouverture, délai 4 h)",
    vert.mesure?.reouvertures_total === 0 && vert.mesure?.delai_depot_cloture_heures?.median === 4, vert.verdict]);

  // I1 : deux dépôts pour le même id.
  let r = juger(ecrire("i1.jsonl", [depot, { ...depot, ts: "2026-08-15T12:00:00Z" }]));
  cas.push(["I1    — second dépôt pour le même id", r.findings.some((f) => f.regle === "I1" && f.statut === "FAIL"), r.verdict]);

  // I2 : le défaut que le circuit vise — un « toujours pas » déposé comme dossier neuf.
  r = juger(ecrire("i2.jsonl", [depot, { ev: "reouverture", ts: "2026-08-15T12:00:00Z", id: "INS-0002", motif: "ça ne va toujours pas" }]));
  cas.push(["I2    — réouverture sur un id jamais déposé", r.findings.some((f) => f.regle === "I2" && f.statut === "FAIL"), r.verdict]);

  // I3 : instruction à cinq blocs — le manquant doit être NOMMÉ.
  const cinq = { ...blocsPleins }; delete cinq.c_gates_en_defaut;
  r = juger(ecrire("i3.jsonl", [depot, { ev: "instruction", ts: "2026-08-15T11:00:00Z", id: "INS-0001", dossier: "d/", blocs: cinq }]));
  cas.push(["I3    — bloc manquant nommé (c_gates_en_defaut)",
    r.findings.some((f) => f.regle === "I3" && f.statut === "FAIL" && f.message.includes("c_gates_en_defaut")), r.verdict]);

  // I4 : sans ts, la mesure meurt.
  r = juger(ecrire("i4.jsonl", [depot, { ev: "cloture", id: "INS-0001", verdict: "corrige" }]));
  cas.push(["I4    — événement sans ts", r.findings.some((f) => f.regle === "I4" && f.statut === "FAIL"), r.verdict]);

  // Contre-épreuve : une VRAIE réouverture (même id) est verte et se compte.
  r = juger(ecrire("reouv.jsonl", [depot, { ev: "reouverture", ts: "2026-08-15T12:00:00Z", id: "INS-0001", motif: "toujours pas" }]));
  cas.push(["vert  — réouverture du BON dossier, comptée",
    r.verdict === "PASS" && r.mesure.reouvertures_par_dossier["INS-0001"] === 1, r.verdict]);

  let ok = 0;
  for (const [nom, tenu, verdict] of cas) {
    console.log(`  [${tenu ? "OK    " : "ECHEC "}] ${nom} (verdict ${verdict})`);
    if (tenu) ok += 1;
  }
  console.log(`self-test insatisfactions : ${ok}/${cas.length}`);
  return ok === cas.length ? 0 : 1;
}

// ── entrée ─────────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.includes("--self-test")) process.exit(selfTest());

const cible = args.find((a) => !a.startsWith("--")) || join(ICI, "..", "insatisfactions", "REGISTRE.jsonl");
const res = juger(cible);
process.stdout.write(JSON.stringify({
  oracle: "oracle-insatisfactions", version: "1.0.0", cible,
  verdict: res.verdict, findings: res.findings, mesure: res.mesure,
  ...(res.motif ? { motif: res.motif } : {}), non_juge: NON_JUGE,
}, null, 2) + "\n");
process.exit(res.verdict === "PASS" ? 0 : res.verdict === "SKIP" ? 2 : 1);
