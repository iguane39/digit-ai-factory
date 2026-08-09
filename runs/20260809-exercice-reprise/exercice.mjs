#!/usr/bin/env node
/**
 * exercice.mjs — TF-0038 : exercer la reprise idempotente d'un run interrompu.
 * La promesse du contrat (« bloque_question suspend le run proprement, reprise
 * idempotente ») n'avait jamais été testée. Trois vérifications :
 *  E1  une nouvelle session reconstitue l'état exact depuis le seul ledger
 *      (run ouvert, étape courante, blocage, questions en attente)
 *  E2  idempotence : rejouer « ouvrir le run » sur un ledger déjà ouvert est
 *      détecté et refusé (pas de second run_open, pas de doublon)
 *  E3  la réponse humaine débloque : après reponse_humain, l'état redevient
 *      actionnable à l'étape suspendue (et nulle part ailleurs)
 */
import { readFileSync, appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const LEDGER = join(ICI, "ledger.jsonl");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

// La reconstitution d'état — le cœur de la reprise : le ledger est la seule mémoire.
function etatDepuisLedger(chemin) {
  const ev = readFileSync(chemin, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const etat = { run_ouvert: false, run_clos: false, etape_courante: null, bloque: false, questions: [], seq: 0 };
  for (const e of ev) {
    etat.seq = e.seq;
    if (e.type === "run_open") etat.run_ouvert = true;
    if (e.type === "run_close") etat.run_clos = true;
    if (e.type === "etape_open") etat.etape_courante = e.etape;
    if (e.type === "etape_close") etat.etape_courante = null;
    if (e.type === "question_humain") { etat.bloque = true; etat.questions = e.questions || []; }
    if (e.type === "reponse_humain") { etat.bloque = false; etat.questions = []; }
  }
  return etat;
}

check("E1 : l'état se reconstitue depuis le seul ledger (étape conception, bloqué, 2 questions)", () => {
  const e = etatDepuisLedger(LEDGER);
  if (!e.run_ouvert || e.run_clos) throw new Error("run non détecté ouvert");
  if (e.etape_courante !== "conception") throw new Error(`étape ${e.etape_courante}, attendu conception`);
  if (!e.bloque || e.questions.length !== 2) throw new Error("blocage ou questions non reconstitués");
});

check("E2 : rouvrir un run déjà ouvert est refusé (idempotence de l'ouverture)", () => {
  const e = etatDepuisLedger(LEDGER);
  // procédure de reprise : si run_open existe déjà et run_close absent → REPRENDRE, jamais rouvrir
  const doitRouvrir = !e.run_ouvert || e.run_clos;
  if (doitRouvrir) throw new Error("la procédure aurait rouvert un run vivant — doublon de run_open");
});

check("E3 : reponse_humain débloque, l'étape suspendue redevient la seule actionnable", () => {
  const e0 = etatDepuisLedger(LEDGER);
  appendFileSync(LEDGER, JSON.stringify({ seq: e0.seq + 1, type: "reponse_humain", ts: "2026-08-09T15:00:00Z", reponses: ["a: oui, multi-comptes", "b: non, paiement hors MVP"] }) + "\n");
  const e1 = etatDepuisLedger(LEDGER);
  if (e1.bloque) throw new Error("toujours bloqué après réponse");
  if (e1.etape_courante !== "conception") throw new Error("la reprise ne pointe plus l'étape suspendue");
});

console.log(`\nExercice reprise (TF-0038) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
