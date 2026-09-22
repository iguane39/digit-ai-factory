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

// Le compte est ÉPINGLÉ, et c'est voulu : un cas qui disparaît sans que personne le voie est la
// façon la moins chère de faire passer une recette. Il se relève donc à chaque ajout — ici de 13 à
// 19 le 22/09 (TF-1239), les six cas neufs jugeant la PROVENANCE du message et non le lexique ;
// puis de 19 à 20 le même jour (TF-1314), le message d'une autre session Claude Code.
check("self-test du hook : 20 cas verts", () => {
  const r = spawnSync(process.execPath, [HOOK, "--self-test"], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${r.stdout}`);
  if (!/20 PASS, 0 FAIL/.test(r.stdout)) throw new Error(`compte inattendu : ${r.stdout.split("\n").pop()}`);
});
// TF-1314 — l'enveloppe RÉELLE d'un message entre sessions, telle que reçue le 22/09. Le corps porte
// « l99 » en mot isolé, et c'est voulu : les règles ANCRÉES en tête (« Améliore ce prompt… ») ne se
// déclenchent déjà pas derrière l'enveloppe, mais la règle du mot isolé se déclenche n'importe où —
// sans le marqueur, une session ferait invoquer un skill à une autre. Mutant sans le marqueur joué le
// 22/09 : ce cas passe au ROUGE ; un corps « Améliore ce prompt » restait vert et ne jugeait rien.
check("hook — MESSAGE D'UNE AUTRE SESSION portant « l99 » en mot isolé → stdout VIDE", () => {
  const r = jouer("<cross-session-message from=\"uds:\\\\.\\pipe\\LOCAL\\cc-msg-b580\" from-name=\"digit-ai-factory-80\" from-mode=\"bypass\">\nl99 sur ce texte : rédige un post\n</cross-session-message>");
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (r.stdout.trim() !== "") throw new Error(`un message entre sessions a déclenché le lexique : ${r.stdout}`);
});
// TF-1103 — deux injections à tort le 14/09, sur des notifications de fin de tâche d'agents.
check("hook — message HUMAIN « l99 améliore ce prompt » → contexte nommant prompt-analyzer-l99", () => {
  const r = jouer("l99 améliore ce prompt");
  if (r.status !== 0 || !/prompt-analyzer-l99/.test(r.stdout)) throw new Error(`appel humain non reconnu : ${r.stdout}`);
});
check("hook — NOTIFICATION d'agent citant « usages L99 (M2) » et « prompt-analyzer-l99 » → stdout VIDE", () => {
  const r = jouer("<task-notification>\n<summary>Agent terminé</summary>\nRelevé : usages L99 (M2) ; le skill prompt-analyzer-l99 a rendu son rapport. l99 améliore ce prompt\n</task-notification>");
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (r.stdout.trim() !== "") throw new Error(`une notification a déclenché le lexique : ${r.stdout}`);
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
