#!/usr/bin/env node
/**
 * journaliser.test.mjs — recette de `journaliser.mjs` (TF-0413).
 * Double sens sur les trois promesses de l'outil : il STAMPE, il REFUSE un `ts` fourni, il
 * ANNULE une écriture qui casserait le registre. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "journaliser.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "journaliser-"));
let nSerie = 0;
const lancer = (evenements, registre, extra = []) => {
  const f = join(T, `ev-${++nSerie}.json`);
  writeFileSync(f, JSON.stringify(evenements), "utf8");
  const r = spawnSync(process.execPath, [OUTIL, "--fichier", f, "--registre", registre, ...extra], { encoding: "utf8" });
  let corps = {};
  try { corps = JSON.parse(r.stdout || "{}"); } catch { /* laissé vide : le code de retour tranche */ }
  return { code: r.status, corps, brut: r.stdout || r.stderr || "" };
};

const creation = (sur = {}) => ({
  ev: "creation", id: "TF-9900", titre: "t", contenu: "c", demandeur: "humain — recette",
  source: "recette", date_demande: "2026-08-20", statut: "candidat",
  forges_cibles_initiales: ["digit-ai-factory"],
  score: { gain: 1, preuve: 1, effort: 1, valeur: 1 }, ...sur,
});

// ── 1. il stampe, et le ts stampé est du PASSÉ proche ───────────────────────
const r1 = join(T, "registre-1.jsonl");
writeFileSync(r1, "", "utf8");
check("stampe le ts — l'événement entre sans en porter un, il en ressort avec", () => {
  const avantAppel = Date.now();
  const r = lancer([creation()], r1);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.corps.message || r.brut.slice(0, 200)}`);
  const lignes = readFileSync(r1, "utf8").split("\n").filter(Boolean);
  if (lignes.length !== 1) throw new Error(`${lignes.length} ligne(s) écrite(s), 1 attendue`);
  const ts = Date.parse(JSON.parse(lignes[0]).ts);
  if (!Number.isFinite(ts)) throw new Error("ts absent ou illisible");
  if (ts < avantAppel - 1000 || ts > Date.now() + 1000)
    throw new Error(`ts hors de la fenêtre d'exécution — ${new Date(ts).toISOString()}`);
});

// ── 2. il refuse un ts fourni, SANS rien écrire ─────────────────────────────
const r2 = join(T, "registre-2.jsonl");
writeFileSync(r2, "", "utf8");
check("refuse un `ts` fourni — et n'écrit RIEN (le refus ne laisse pas de moitié)", () => {
  const r = lancer([creation(), creation({ id: "TF-9901", ts: "2026-08-20T23:00:00Z" })], r2);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/portent déjà un/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
  if (readFileSync(r2, "utf8").length !== 0) throw new Error("le registre a été touché malgré le refus");
});

// ── 3. horodatages strictement croissants au sein d'un lot ──────────────────
const r3 = join(T, "registre-3.jsonl");
writeFileSync(r3, "", "utf8");
check("un lot de 5 événements sort en horodatages STRICTEMENT croissants", () => {
  const lot = [creation(), creation({ id: "TF-9901" }), creation({ id: "TF-9902" }),
    creation({ id: "TF-9903" }), creation({ id: "TF-9904" })];
  const r = lancer(lot, r3);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.corps.message}`);
  const ts = readFileSync(r3, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l).ts);
  if (ts.length !== 5) throw new Error(`${ts.length} ligne(s), 5 attendues`);
  for (let i = 1; i < ts.length; i++)
    if (!(ts[i] > ts[i - 1])) throw new Error(`ts non croissant en position ${i} : ${ts[i - 1]} puis ${ts[i]}`);
});

// ── 4. une écriture qui casse le registre est ANNULÉE ───────────────────────
const r4 = join(T, "registre-4.jsonl");
writeFileSync(r4, "", "utf8");
check("écriture qui ferait échouer l'oracle → ANNULÉE, registre repris à l'octet près", () => {
  const bon = lancer([creation()], r4);
  if (bon.code !== 0) throw new Error(`la mise en place a échoué : ${bon.corps.message}`);
  const temoin = readFileSync(r4, "utf8");
  // seconde creation du MÊME id : R2 refuse, l'oracle passe de PASS à FAIL
  const r = lancer([creation()], r4);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/ANNULÉE/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
  if (readFileSync(r4, "utf8") !== temoin) throw new Error("le registre n'a PAS été repris à son état d'origine");
});

// ── 5. --essai n'écrit rien et montre ce qui serait écrit ───────────────────
const r5 = join(T, "registre-5.jsonl");
writeFileSync(r5, "", "utf8");
check("--essai montre le stampage et n'écrit rien", () => {
  const r = lancer([creation()], r5, ["--essai"]);
  if (r.code !== 0) throw new Error(`exit ${r.code}`);
  if (!Array.isArray(r.corps.ecrits) || r.corps.ecrits.length !== 1) throw new Error("l'essai ne montre pas ce qu'il écrirait");
  if (!/"ts":/.test(r.corps.ecrits[0])) throw new Error("l'essai ne montre pas de ts stampé");
  if (readFileSync(r5, "utf8").length !== 0) throw new Error("--essai a écrit dans le registre");
});

// ── 6. fichier d'événements absent → refus lisible, aucune écriture ─────────
check("fichier d'événements absent → exit 1 et message, jamais une trace muette", () => {
  const r = spawnSync(process.execPath, [OUTIL, "--fichier", join(T, "inexistant.json")], { encoding: "utf8" });
  if (r.status !== 1) throw new Error(`exit ${r.status} attendu 1`);
  if (!/introuvable/.test(r.stdout || "")) throw new Error("le refus ne dit pas ce qui manque");
});

console.log(`\njournaliser (TF-0413) : ${pass} PASS, ${fail} FAIL`);
if (!existsSync(OUTIL)) console.error("outil introuvable");
process.exit(fail ? 1 : 0);
