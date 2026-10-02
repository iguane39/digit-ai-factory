#!/usr/bin/env node
/**
 * detecter-demandes-recues.test.mjs — recette de TF-1522 (02/10/2026).
 *
 * Un produit jetable (`--racine`), avec sa boîte `input\00-travaux\` et son `forge\ledger.jsonl`
 * fabriqués : une demande déposée et enregistrée passe, une demande déposée et JAMAIS enregistrée
 * échoue et se nomme, un lot `pilot - TRAVAUX - …` dans la même boîte n'est jamais confondu avec
 * une demande. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { verifier } from "./detecter-demandes-recues.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

function produitJetable({ aLedger = true, aBoite = true } = {}) {
  const d = mkdtempSync(join(tmpdir(), "detect-demandes-"));
  if (aBoite) mkdirSync(join(d, "input", "00-travaux"), { recursive: true });
  if (aLedger) { mkdirSync(join(d, "forge"), { recursive: true }); writeFileSync(join(d, "forge", "ledger.jsonl"), "", "utf8"); }
  return d;
}
const ecrireLedger = (d, lignes) => writeFileSync(join(d, "forge", "ledger.jsonl"), lignes.map((l) => JSON.stringify(l)).join("\n") + "\n", "utf8");
const deposer = (d, nom) => writeFileSync(join(d, "input", "00-travaux", nom), "# demande\n", "utf8");

check("SANS_OBJET — pas de input\\00-travaux\\ : aucune demande possible", () => {
  const d = produitJetable({ aBoite: false });
  const r = verifier(d);
  rmSync(d, { recursive: true, force: true });
  att(r.verdict === "SANS_OBJET", `verdict ${r.verdict}`);
});

check("SANS_OBJET — pas de forge\\ledger.jsonl\\ : produit non instancié, R-19 le mesure déjà", () => {
  const d = produitJetable({ aLedger: false });
  const r = verifier(d);
  rmSync(d, { recursive: true, force: true });
  att(r.verdict === "SANS_OBJET", `verdict ${r.verdict}`);
});

check("PASS — boîte vide", () => {
  const d = produitJetable();
  const r = verifier(d);
  rmSync(d, { recursive: true, force: true });
  att(r.verdict === "PASS", `verdict ${r.verdict}`);
});

check("rouge → vert — une demande déposée et JAMAIS enregistrée échoue, nommée avec sa date", () => {
  const d = produitJetable();
  deposer(d, "produit-demandeur - DEMANDE - 20260928a.md");
  const r1 = verifier(d);
  att(r1.verdict === "FAIL", `verdict ${r1.verdict} attendu FAIL`);
  att(r1.constats.some((c) => c.statut === "FAIL" && /produit-demandeur - DEMANDE - 20260928a\.md/.test(c.message) && /2026-09-28/.test(c.message)),
    `la demande non enregistrée n'est pas nommée avec sa date : ${JSON.stringify(r1.constats)}`);
  ecrireLedger(d, [{ type: "demande_recue", demandeur: "produit-demandeur", fichier: "produit-demandeur - DEMANDE - 20260928a.md", decision: "retenue" }]);
  const r2 = verifier(d);
  rmSync(d, { recursive: true, force: true });
  att(r2.verdict === "PASS", `verdict ${r2.verdict} attendu PASS après enregistrement — ${JSON.stringify(r2.constats)}`);
});

check("borne — un lot « pilot - TRAVAUX - … » dans la même boîte n'est JAMAIS confondu avec une demande", () => {
  const d = produitJetable();
  deposer(d, "pilot - TRAVAUX - 20260928a.md"); // jamais enregistré comme demande_recue, et ça ne doit rien faire échouer
  const r = verifier(d);
  rmSync(d, { recursive: true, force: true });
  att(r.verdict === "PASS", `un lot du pilot fait échouer le relevé des demandes : ${JSON.stringify(r.constats)}`);
});

check("deux demandes, une seule enregistrée — seule la non enregistrée est nommée", () => {
  const d = produitJetable();
  deposer(d, "produit-a - DEMANDE - 20260901a.md");
  deposer(d, "produit-b - DEMANDE - 20260902a.md");
  ecrireLedger(d, [{ type: "demande_recue", fichier: "produit-a - DEMANDE - 20260901a.md", decision: "ecartee", motif: "hors périmètre" }]);
  const r = verifier(d);
  rmSync(d, { recursive: true, force: true });
  att(r.verdict === "FAIL", `verdict ${r.verdict}`);
  att(r.constats.some((c) => /produit-b/.test(c.message)), "la demande b non enregistrée n'est pas nommée");
  att(!r.constats.some((c) => c.statut === "FAIL" && /produit-a/.test(c.message)), "la demande a, pourtant enregistrée, est quand même accusée");
});

console.log(`\ndetecter-demandes-recues (TF-1522) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
