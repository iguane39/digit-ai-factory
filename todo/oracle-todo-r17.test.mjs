#!/usr/bin/env node
/**
 * oracle-todo-r17.test.mjs — recette de R17 (TF-1946, T1 de l'œil critique, D-68 (a) du 26/10/2026) :
 * une récidive ne se clôt pas en corrige sans barrière nommée.
 *
 * Trois cas, sur un registre jetable : la récidive close sans `barriere` (rouge), close avec une
 * barrière de type et chemin valides (vert), close avant le seuil (non jugée, comptée).
 * Usage : node todo/oracle-todo-r17.test.mjs
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const ORACLE = join(ICI, "oracle-todo.mjs");
let pass = 0, fail = 0;
const verifier = (nom, cond, detail) => { if (cond) { pass++; console.log(`  [PASS] ${nom}`); } else { fail++; console.log(`  [FAIL] ${nom} — ${detail}`); } };

function registre(tsCloture, barriere) {
  const creation = { ev: "creation", id: "TF-9001", titre: "récidive de recette", contenu: "cas de recette R17", source: "recette", demandeur: "humain, recette", date_demande: "2026-10-26", forges_cibles_initiales: ["digit-ai-factory"], score: { gain: 1, preuve: 1, effort: 1, valeur: 1 }, cout_paye_en_run_reel: "non", statut: "candidat", recidive_de: ["TF-9000"], ts: "2026-10-26T10:00:00.000Z" };
  const decide = { ev: "maj", id: "TF-9001", statut: "decide", decideur: "humain, recette", date_decision: "2026-10-26", ts: "2026-10-26T10:00:01.000Z" };
  const cours = { ev: "maj", id: "TF-9001", statut: "en_cours", attente: "session", ts: "2026-10-26T10:00:02.000Z" };
  const clos = { ev: "maj", id: "TF-9001", statut: "corrige", attente: null, date_correction: "2026-10-26", corrections_realisees: "cas de recette", gains_constates: "cas de recette", descente: { oracle: "todo/oracle-todo.mjs, règle R17" }, ...(barriere ? { barriere } : {}), ts: tsCloture };
  return [creation, decide, cours, clos].map((e) => JSON.stringify(e)).join("\n") + "\n";
}

function jouer(contenu) {
  const dir = mkdtempSync(join(tmpdir(), "r17-"));
  try {
    const actifs = join(dir, "TODO.jsonl"), archive = join(dir, "TODO-ARCHIVE.jsonl");
    writeFileSync(actifs, contenu, "utf8"); writeFileSync(archive, "", "utf8");
    const r = spawnSync(process.execPath, [ORACLE, actifs, archive], { encoding: "utf8", env: { ...process.env, TODO_SEUIL_R17: "2026-10-26T09:00:00Z" } });
    return JSON.parse(r.stdout);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
const r17 = (j) => j.findings.filter((f) => f.regle === "R17");

const rouge = jouer(registre("2026-10-26T10:00:03.000Z", null));
verifier("rouge — récidive close sans barrière refusée", r17(rouge).some((f) => f.statut === "FAIL" && f.ou === "TF-9001"), JSON.stringify(r17(rouge)));

const vert = jouer(registre("2026-10-26T10:00:03.000Z", { type: "oracle", chemin: "todo/oracle-todo.mjs" }));
verifier("vert — récidive close avec barrière acceptée", !r17(vert).some((f) => f.statut === "FAIL"), JSON.stringify(r17(vert)));

const texte = jouer(registre("2026-10-26T10:00:03.000Z", { type: "regle", chemin: "references/REGLE.md" }));
verifier("rouge — une règle reformulée n'est pas une barrière", r17(texte).some((f) => f.statut === "FAIL"), JSON.stringify(r17(texte)));

const chaine = jouer(registre("2026-10-26T10:00:03.000Z", null).replace("\"recidive_de\":[\"TF-9000\"]", "\"recidive_de\":\"TF-9000\""));
verifier("rouge — une récidive saisie en chaîne est jugée comme un tableau", r17(chaine).some((f) => f.statut === "FAIL" && f.ou === "TF-9001"), JSON.stringify(r17(chaine)));

const avant = spawnSync(process.execPath, [ORACLE], { encoding: "utf8" });
verifier("registre réel — R17 rend PASS", JSON.parse(avant.stdout).findings.some((f) => f.regle === "R17" && f.statut === "PASS"), avant.stdout.slice(0, 200));

console.log(`\noracle-todo R17 (TF-1946) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
