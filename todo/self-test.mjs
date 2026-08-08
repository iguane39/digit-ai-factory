#!/usr/bin/env node
/**
 * self-test.mjs — recette à double sens du registre TODO-FORGE.
 * Une fixture VERTE (cycle de vie complet légal) PASSE ; des fixtures ROUGES à défauts plantés
 * ÉCHOUENT chacune pour la règle attendue. La vue est générée 2× → identique (déterminisme).
 * Fixtures en dossier temporaire — rien n'est écrit dans le dépôt.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ICI = dirname(fileURLToPath(import.meta.url));
const oracle = join(ICI, "oracle-todo.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const lance = (actifs, archive) => {
  try { execFileSync("node", [oracle, actifs, archive ?? join(dirname(actifs), "vide.jsonl")], { encoding: "utf8" }); return 0; }
  catch (e) { return { code: e.status, sortie: String(e.stdout || "") }; }
};
const item = (sur) => JSON.stringify({
  ev: "creation", ts: "2026-08-08T10:00:00Z", id: "TF-9001", titre: "t", contenu: "c",
  demandeur: "d", source: "s", date_demande: "2026-08-08", statut: "candidat",
  forges_cibles_initiales: ["tests"], score: { gain: 3, preuve: 1, effort: 1, valeur: 3 }, ...sur,
});
const maj = (sur) => JSON.stringify({ ev: "maj", ts: "2026-08-08T11:00:00Z", id: "TF-9001", ...sur });
const T = mkdtempSync(join(tmpdir(), "todo-selftest-"));

// VERTE : cycle complet légal
const verte = join(T, "verte.jsonl");
writeFileSync(verte, [item({}),
  maj({ statut: "decide", decideur: "humain", date_decision: "2026-08-08" }),
  maj({ ts: "2026-08-08T12:00:00Z", statut: "en_cours" }),
  maj({ ts: "2026-08-08T13:00:00Z", statut: "corrige", gains_constates: "g", corrections_realisees: "sha", date_correction: "2026-08-08" }),
].join("\n") + "\n");
check("verte : cycle candidat→decide→en_cours→corrige légal → PASS", () => {
  const r = lance(verte);
  if (r !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 200)}`);
});

// ROUGES : un défaut planté par règle
const rouges = [
  ["R2 : double creation même id", [item({}), item({})]],
  ["R5 : transition illégale candidat→corrige", [item({}), maj({ statut: "corrige", gains_constates: "g", corrections_realisees: "x", date_correction: "2026-08-08" })]],
  ["R6 : decide sans decideur", [item({}), maj({ statut: "decide" })]],
  ["R7 : corrige sans gains_constates", [item({}), maj({ statut: "decide", decideur: "h", date_decision: "2026-08-08" }), maj({ ts: "2026-08-08T12:00:00Z", statut: "corrige", corrections_realisees: "x", date_correction: "2026-08-08" })]],
  ["R4 : creation hors statut candidat", [item({ statut: "decide" })]],
];
for (const [nom, lignes] of rouges) {
  const f = join(T, nom.slice(0, 2) + ".jsonl");
  writeFileSync(f, lignes.join("\n") + "\n");
  check(`rouge ${nom} → FAIL exit 1, règle nommée`, () => {
    const r = lance(f);
    if (r === 0) throw new Error("aurait dû échouer");
    if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
    const regle = nom.slice(0, 2);
    if (!r.sortie.includes(`"${regle}"`)) throw new Error(`règle ${regle} absente des findings`);
  });
}

// Déterminisme de la vue sur le registre RÉEL
check("vue : 2 générations identiques (sha256) sur le registre réel", () => {
  execFileSync("node", [join(ICI, "generer-vue.mjs")], { encoding: "utf8" });
  const a = createHash("sha256").update(readFileSync(join(ICI, "TODO.md"))).digest("hex");
  execFileSync("node", [join(ICI, "generer-vue.mjs")], { encoding: "utf8" });
  const b = createHash("sha256").update(readFileSync(join(ICI, "TODO.md"))).digest("hex");
  if (a !== b) throw new Error("vue non déterministe");
});

rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
console.log(`\nSelf-test TODO-FORGE : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
