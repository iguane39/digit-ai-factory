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
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
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

// TF-1720 (15/10/2026) — le cas du 14/10 chez un produit : un document de projet marqué par son
// gabarit, écrit dans le tour, sans synthèse nommée. Il n'est plus retenu ; le repli hors de
// `docs\projet\` garde son rôle, et une synthèse nommée l'emporte toujours.
mkdirSync(join(T, "docs", "projet"), { recursive: true });
const composants = join(T, "docs", "projet", "COMPOSANTS-OPS.md");
writeFileSync(composants, MARQUE, "utf8");
check("rouge → vert (TF-1720) : un document de projet marqué par son gabarit n'est pas jugé à la place de la restitution", () => {
  const r = syntheseDuTour([note, composants]);
  if (r !== null) throw new Error(`fichier jugé : ${r}`);
});
check("TF-1720 : à côté d'un document de projet, une synthèse nommée reste retenue", () => {
  const r = syntheseDuTour([synthese, composants]);
  if (r !== synthese) throw new Error(`fichier jugé : ${r}`);
});
check("TF-1720 : le repli hors de docs\\projet\\ tient encore — l'analyse marquée reste retenue à côté du document de projet", () => {
  const r = syntheseDuTour([analyse, composants]);
  if (r !== analyse) throw new Error(`fichier jugé : ${r}`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\nhook-restitution (sélection de la synthèse jugée, TF-0767, TF-1720) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
