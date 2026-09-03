#!/usr/bin/env node
/**
 * hook-lexique.test.mjs — le hook joue son self-test ET se comporte en hook (stdin JSON → stdout).
 * Joué par `oracles\self-tests.mjs` (I2). Deux sens : un message d'appel produit une ligne de
 * contexte nommant le skill ; un message ordinaire ne produit RIEN (stdout vide, exit 0).
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-lexique.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const jouer = (prompt) => spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ prompt }) });

check("self-test du hook : 7 cas verts", () => {
  const r = spawnSync(process.execPath, [HOOK, "--self-test"], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${r.stdout}`);
  if (!/7 PASS, 0 FAIL/.test(r.stdout)) throw new Error(`compte inattendu : ${r.stdout.split("\n").pop()}`);
});
check("hook — « Améliore ce prompt : … » sur stdin → contexte nommant prompt-analyzer-l99, exit 0", () => {
  const r = jouer("Améliore ce prompt : conçois un système");
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (!/prompt-analyzer-l99/.test(r.stdout)) throw new Error(`skill absent du contexte : ${r.stdout}`);
});
check("hook — message ordinaire → stdout VIDE, exit 0 (le hook se tait)", () => {
  const r = jouer("Corrige la barre de menu qui déborde sur mobile");
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (r.stdout.trim() !== "") throw new Error(`stdout non vide : ${r.stdout}`);
});
check("hook — stdin illisible (pas du JSON) → exit 0, jamais un blocage du message", () => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: "pas du json" });
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
});
console.log(`\nhook-lexique.test : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
