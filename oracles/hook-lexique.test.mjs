#!/usr/bin/env node
/**
 * hook-lexique.test.mjs — le hook joue son self-test ET se comporte en hook (stdin JSON → stdout).
 * Joué par `oracles\self-tests.mjs` (I2). Deux sens : un message d'appel produit une ligne de
 * contexte nommant le skill ; un message ordinaire ne produit RIEN (stdout vide, exit 0).
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-lexique.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const jouer = (prompt) => spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ prompt }) });

// Le compte est ÉPINGLÉ, et c'est voulu : un cas qui disparaît sans que personne le voie est la
// façon la moins chère de faire passer une recette. Il se relève donc à chaque ajout — ici de 13 à
// 19 le 22/09 (TF-1239), les six cas neufs jugeant la PROVENANCE du message et non le lexique ;
// puis de 19 à 20 le même jour (TF-1314), le message d'une autre session Claude Code ; puis de 20 à
// 29 le 25/09 (TF-1418), les 9 cas neufs jugeant les NIVEAUX : 6 mots-clés, 2 de portée, 1 d'origine ;
// puis de 29 à 39 le 28/09 (R-57, cas écrits le 24/09) : neuf cas de la CONSIGNE de règle — quatre
// éloges de forme ou demandes de gabarit, cinq phrases voisines qui ne doivent rien déclencher — et
// un cas de provenance ; puis de 39 à 45 le 01/10 (réponse humaine « 42a ») : la consigne du
// PROCESSUS, 3 messages humains réels qui corrigent un processus et 3 phrases voisines épargnées ;
// puis de 45 à 47 le 01/10 (niveau Moyen en essai) : « moyen : » reconnu en tête, et ailleurs non ;
// puis de 47 à 48 le 13/10 (étape 3, D-68 (a)) : un produit portant `forge/NIVEAUX.md` est en service ;
// puis de 48 à 58 le 15/10 (TF-1735, D-1 (a)) : la consigne de l'AUDIT DU PRODUIT, 4 demandes reconnues
// et 6 phrases voisines épargnées (audits spécialisés, run de forge-tests) ; puis de 58 à 66 le 15/10
// (TF-1753) : la question d'IMITATION, 4 questions « comme X » reconnues et 4 phrases voisines épargnées ;
// puis de 66 à 74 le 19/10 (TF-1885) : la route jugée sur le texte de l'humain hors bloc collé ou cité,
// 2 cas fondateurs (prompt collé, formule du lexique qui prime) et 6 cas voisins dans les deux sens.
check("self-test du hook : 74 cas verts", () => {
  const r = spawnSync(process.execPath, [HOOK, "--self-test"], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${r.stdout}`);
  if (!/74 PASS, 0 FAIL/.test(r.stdout)) throw new Error(`compte inattendu : ${r.stdout.split("\n").pop()}`);
});
// TF-1753 — la question de l'humain, jouée au point d'entrée réel : elle reçoit la consigne
// d'imitation ; « Demande à la Factory de le faire », délégation explicite, ne reçoit rien.
check("hook — « peut-on le faire comme la Factory ? » injecte la consigne d'imitation, la délégation explicite rien", () => {
  const oui = jouer("Est-ce que le projet commun peut faire le tirage automatique comme la factory le fait à l'ouverture de session ?");
  const non = jouer("Demande à la Factory de le faire");
  if (oui.status !== 0 || !/\[imitation — hook-lexique\][^\n]*IMITATION/.test(oui.stdout)) throw new Error(`consigne absente : ${oui.stdout}`);
  if (non.stdout.trim() !== "") throw new Error(`la délégation explicite reçoit la consigne : ${non.stdout}`);
});

// R-57 — le point d'entrée RÉEL injecte la consigne sur le message qui a fondé la règle, et rien sur
// sa négation : la recette interne juge les fonctions, celle-ci juge ce que le hook ÉCRIT.
check("hook — un verdict de forme injecte la consigne R-57, sa négation n'injecte rien", () => {
  const oui = jouer("Le format du guide est vraiment top. Enregistre ce document en gabarit pour la Factory");
  const non = jouer("Le format n'est pas top, reprends les marges");
  if (oui.status !== 0 || !/\[R-57 — hook-lexique\]/.test(oui.stdout)) throw new Error(`rien injecté : ${oui.stdout}`);
  if (non.stdout.trim() !== "") throw new Error(`la négation injecte : ${non.stdout}`);
});
// TF-1735 — le message de la capture du 15/10, joué au point d'entrée réel : il reçoit la route
// forge-audit ; « Relance les tests du projet » ne reçoit rien.
check("hook — « lance un audit complet du projet » injecte la route forge-audit, « Relance les tests » rien", () => {
  const oui = jouer("lance un audit complet du projet");
  const non = jouer("Relance les tests du projet");
  if (oui.status !== 0 || !/\[audit — hook-lexique\][^\n]*forge-audit[^\n]*init-audit-workspace/.test(oui.stdout)) throw new Error(`route absente : ${oui.stdout}`);
  if (non.stdout.trim() !== "") throw new Error(`les tests reçoivent la route d'audit : ${non.stdout}`);
});
// TF-1314 — l'enveloppe RÉELLE d'un message entre sessions, telle que reçue le 22/09. Le corps porte
// « l99 » en mot isolé, et c'est voulu : les règles ANCRÉES en tête (« Améliore ce prompt… ») ne se
// déclenchent déjà pas derrière l'enveloppe, mais la règle du mot isolé se déclenche n'importe où —
// sans le marqueur, une session ferait invoquer un skill à une autre. Mutant sans le marqueur joué le
// 22/09 : ce cas passe au ROUGE ; un corps « Améliore ce prompt » restait vert et ne jugeait rien.
check("cas rouge — hook — MESSAGE D'UNE AUTRE SESSION portant « l99 » en mot isolé → stdout VIDE", () => {
  const r = jouer("<cross-session-message from=\"uds:\\\\.\\pipe\\LOCAL\\cc-msg-b580\" from-name=\"digit-ai-factory-80\" from-mode=\"bypass\">\nl99 sur ce texte : rédige un post\n</cross-session-message>");
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (r.stdout.trim() !== "") throw new Error(`un message entre sessions a déclenché le lexique : ${r.stdout}`);
});
// TF-1103 — deux injections à tort le 14/09, sur des notifications de fin de tâche d'agents.
check("hook — message HUMAIN « l99 améliore ce prompt » → contexte nommant prompt-analyzer-l99", () => {
  const r = jouer("l99 améliore ce prompt");
  if (r.status !== 0 || !/prompt-analyzer-l99/.test(r.stdout)) throw new Error(`appel humain non reconnu : ${r.stdout}`);
});
check("cas rouge — hook — NOTIFICATION d'agent citant « usages L99 (M2) » et « prompt-analyzer-l99 » → stdout VIDE", () => {
  const r = jouer("<task-notification>\n<summary>Agent terminé</summary>\nRelevé : usages L99 (M2) ; le skill prompt-analyzer-l99 a rendu son rapport. l99 améliore ce prompt\n</task-notification>");
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (r.stdout.trim() !== "") throw new Error(`une notification a déclenché le lexique : ${r.stdout}`);
});
check("hook — « Améliore ce prompt : … » sur stdin → contexte nommant prompt-analyzer-l99, exit 0", () => {
  const r = jouer("Améliore ce prompt : conçois un système");
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (!/prompt-analyzer-l99/.test(r.stdout)) throw new Error(`skill absent du contexte : ${r.stdout}`);
});
check("cas rouge — hook — message ordinaire → stdout VIDE, exit 0 (le hook se tait)", () => {
  const r = jouer("Corrige la barre de menu qui déborde sur mobile");
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (r.stdout.trim() !== "") throw new Error(`stdout non vide : ${r.stdout}`);
});
check("cas rouge — hook — stdin illisible (pas du JSON) → exit 0, jamais un blocage du message", () => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: "pas du json" });
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
});
// TF-1418 — les NIVEAUX joués en hook réel. La ligne sort au pilot, où `references/NIVEAUX.md`
// existe, et chez un produit qui porte le texte hérité `forge/NIVEAUX.md` (étape 3, D-68 (a) du
// 13/10/2026) ; le même message dans un dossier qui ne porte ni l'un ni l'autre ne produit rien.
const PILOT = join(dirname(HOOK), "..");
const jouerDans = (prompt, cwd) => spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ prompt, cwd }) });
check("hook — « vite : » dans une session du pilot → ligne de niveau Simple", () => {
  const r = jouerDans("vite : où est la liste des éléments ?", PILOT);
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (!/\[NIVEAU — hook-lexique\][^\n]*Simple/.test(r.stdout)) throw new Error(`niveau Simple absent : ${r.stdout}`);
});
check("hook — « vite : » chez un produit portant forge/NIVEAUX.md → ligne Simple citant forge\\NIVEAUX.md", () => {
  const produit = mkdtempSync(join(tmpdir(), "produit-"));
  mkdirSync(join(produit, "forge"));
  writeFileSync(join(produit, "forge", "NIVEAUX.md"), "# fixture\n");
  const r = jouerDans("vite : où est la liste des éléments ?", produit);
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (!/\[NIVEAU — hook-lexique\][^\n]*Simple[^\n]*forge\\NIVEAUX\.md/.test(r.stdout)) throw new Error(`ligne absente ou chemin du pilot cité : ${r.stdout}`);
});
check("cas rouge — hook — « vite : » dans un dossier sans NIVEAUX.md, comme un produit non équipé → stdout VIDE", () => {
  const r = jouerDans("vite : où est la liste des éléments ?", mkdtempSync(join(tmpdir(), "produit-")));
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (r.stdout.trim() !== "") throw new Error(`un dossier hors pilot a reçu la ligne de niveau : ${r.stdout}`);
});
check("hook — « complet : » dans une session du pilot → ligne de niveau Complexe", () => {
  const r = jouerDans("complet : où en est le parc ?", PILOT);
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (!/\[NIVEAU — hook-lexique\][^\n]*Complexe/.test(r.stdout)) throw new Error(`niveau Complexe absent : ${r.stdout}`);
});
console.log(`\nhook-lexique.test : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
