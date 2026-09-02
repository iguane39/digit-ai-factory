#!/usr/bin/env node
/**
 * hook-restitution-selection.test.mjs — LE FICHIER JUGÉ EST LA SYNTHÈSE, PAS N'IMPORTE QUEL
 * FICHIER DESTINÉ À L'HUMAIN (TF-0767, 02/09/2026).
 *
 * Le fait : un produit a écrit dans le même tour une ANALYSE L99 (destinataire: humain, à bon
 * droit) puis sa restitution. Le hook a jugé l'analyse — le dernier fichier marqué — et refusé une
 * restitution conforme : « options par défaut nommées : 0 dans le fichier jugé, 2 à l'écran ». Il a
 * fallu retirer le marqueur de l'analyse pour passer. Cette recette fige les deux sens : parmi
 * plusieurs fichiers marqués, celui dont le NOM dit synthèse ou restitution l'emporte, quel que
 * soit son rang ; sans nom qui tranche, le marqueur seul garde son rôle de repli.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { syntheseDuTour } from "./hook-restitution.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const T = mkdtempSync(join(tmpdir(), "hook-sel-"));
const MARQUE = "---\ndestinataire: humain\n---\n\n# x\n";
const analyse = join(T, "ANALYSE-L99-PROMPT-CONSOLE-20260902.md");
const synthese = join(T, "Produit - Synthese Mandat - Console - 20260902a.md");
const restitution = join(T, "RESTITUTION-20260902.md");
const note = join(T, "note.md");
for (const f of [analyse, synthese, restitution]) writeFileSync(f, MARQUE, "utf8");
writeFileSync(note, "# sans marqueur\n", "utf8");

check("rouge → vert : l'analyse marquée écrite APRÈS la synthèse ne prend pas sa place", () => {
  const r = syntheseDuTour([synthese, analyse]);
  if (r !== synthese) throw new Error(`fichier jugé : ${r}`);
});
check("un fichier RESTITUTION-*.md marqué est reconnu par son nom, même écrit avant une analyse", () => {
  const r = syntheseDuTour([note, restitution, analyse]);
  if (r !== restitution) throw new Error(`fichier jugé : ${r}`);
});
check("repli — aucun nom ne tranche : le dernier fichier marqué reste jugé (comportement d'avant)", () => {
  const r = syntheseDuTour([note, analyse]);
  if (r !== analyse) throw new Error(`fichier jugé : ${r}`);
});
check("aucun fichier marqué → null (la règle ne réclame pas un fichier)", () => {
  if (syntheseDuTour([note]) !== null) throw new Error("un fichier non marqué a été retenu");
});

rmSync(T, { recursive: true, force: true });
console.log(`\nhook-restitution (sélection de la synthèse jugée, TF-0767) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
