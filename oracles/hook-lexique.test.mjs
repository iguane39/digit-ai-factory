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
// `CLAUDE_PROJECT_DIR` (posée aux hooks par Claude Code) ne fuit pas dans la recette : un cas la pose lui-même (TF-1943).
const envSansProjet = () => { const e = { ...process.env }; delete e.CLAUDE_PROJECT_DIR; return e; };
const jouerDans = (prompt, cwd, projetDir = null) => spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ prompt, cwd }),
  env: projetDir ? { ...envSansProjet(), CLAUDE_PROJECT_DIR: projetDir } : envSansProjet() });
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
// TF-1943 (29/10/2026) — LES NIVEAUX SE JUGENT AU PROJET, PAS AU SOUS-DOSSIER OÙ LA SESSION S'EST DÉPLACÉE. Depuis que les hooks se déclenchent après un `cd`
// (commandes ancrées sur CLAUDE_PROJECT_DIR, TF-1903), l'entrée porte `cwd` = le sous-dossier, où ni `references/NIVEAUX.md` ni `forge/NIVEAUX.md` n'existent :
// le hook se taisait. ROUGE : le MÊME « vite : », `cwd` dans un sous-dossier du pilot, d'un produit, puis par CLAUDE_PROJECT_DIR.
check("rouge — « vite : » depuis un sous-dossier du pilot → ligne de niveau Simple (racine git)", () => {
  const r = jouerDans("vite : où est la liste des éléments ?", join(PILOT, "scripts"));
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (!/\[NIVEAU — hook-lexique\][^\n]*Simple/.test(r.stdout)) throw new Error(`le hook a lu le sous-dossier, niveau absent : « ${r.stdout} »`);
});
check("rouge — « vite : » depuis un sous-dossier d'un produit (dépôt portant forge/NIVEAUX.md) → ligne Simple", () => {
  const produit = mkdtempSync(join(tmpdir(), "produit-"));
  mkdirSync(join(produit, ".git")); mkdirSync(join(produit, "forge", "essai"), { recursive: true }); mkdirSync(join(produit, "src"));
  writeFileSync(join(produit, "forge", "NIVEAUX.md"), "# fixture\n");
  for (const sous of [join(produit, "src"), join(produit, "forge", "essai")]) {
    const r = jouerDans("vite : où est la liste des éléments ?", sous);
    if (r.status !== 0 || !/\[NIVEAU — hook-lexique\][^\n]*Simple/.test(r.stdout)) throw new Error(`depuis ${sous.slice(produit.length)} : niveau absent : « ${r.stdout} »`);
  }
});
check("rouge — CLAUDE_PROJECT_DIR prime sur cwd : « vite : » depuis un dossier sans rien → ligne Simple", () => {
  const r = jouerDans("vite : où est la liste des éléments ?", mkdtempSync(join(tmpdir(), "ailleurs-")), PILOT);
  if (r.status !== 0 || !/\[NIVEAU — hook-lexique\][^\n]*Simple/.test(r.stdout)) throw new Error(`la variable est ignorée : « ${r.stdout} »`);
});
check("hook — « complet : » dans une session du pilot → ligne de niveau Complexe", () => {
  const r = jouerDans("complet : où en est le parc ?", PILOT);
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
  if (!/\[NIVEAU — hook-lexique\][^\n]*Complexe/.test(r.stdout)) throw new Error(`niveau Complexe absent : ${r.stdout}`);
});
// TF-1958 (D-76 (c), 26/10/2026) — LA LETTRE D'UNE DÉCISION OUVERTE. Quatre fois en 7 jours, un message
// sans lettre (« exécute le prompt », « Fais 226 », « écris l'email ») a été pris pour le choix de
// l'option recommandée d'une décision encore ouverte. Le hook joue au point d'entrée réel, transcript
// à l'appui (champ `transcript_path`) : il rappelle les D-N ouvertes quand le message ne cite aucune
// lettre, et se tait quand il en cite une, quand c'est un sélecteur d'action (« A1 »), quand le
// transcript ne pose aucune décision ou qu'elle a été tranchée depuis. Il ne bloque jamais.
const assistant = (id, texte) => ({ type: "assistant", message: { id, role: "assistant", content: [{ type: "text", text: texte }] } });
const humain = (texte) => ({ type: "user", origin: { kind: "human" }, message: { role: "user", content: texte } });
const DECISION_99 = "## 3. Décisions\n\n> **D-99 — Publier la page maintenant ?**\n>\n> | Option | Effet |\n> | (a) oui | publie |\n> | (b) non | garde |\n>\n> Recommandation : (a).\n";
const transcrire = (records) => {
  const p = join(mkdtempSync(join(tmpdir(), "transcript-")), "session.jsonl");
  writeFileSync(p, records.map((r) => JSON.stringify(r)).join("\n") + "\n");
  return p;
};
const jouerAvec = (prompt, records) =>
  spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ prompt, transcript_path: transcrire(records), cwd: mkdtempSync(join(tmpdir(), "produit-")) }) });
const APRES_D99 = [humain("où en est la publication ?"), assistant("m1", DECISION_99)];
check("cas rouge — hook — « exécute le prompt » après une restitution posant D-99 → rappel citant D-99 et demandant la lettre", () => {
  const r = jouerAvec("exécute le prompt", APRES_D99);
  if (r.status !== 0) throw new Error(`exit ${r.status} : le hook ne doit jamais bloquer`);
  if (!/\[LETTRE — hook-lexique\][^\n]*D-99[^\n]*ce message ne cite aucune lettre : n'exécute aucune option de ces décisions, demande la lettre/.test(r.stdout))
    throw new Error(`rappel absent ou incomplet : ${JSON.stringify(r.stdout)}`);
});
check("hook — « Fais 226 » et « écris l'email » (les deux autres messages du constat) → rappel", () => {
  for (const m of ["Fais 226", "écris l'email"]) {
    const r = jouerAvec(m, APRES_D99);
    if (!/\[LETTRE — hook-lexique\][^\n]*D-99/.test(r.stdout)) throw new Error(`« ${m} » sans rappel : ${JSON.stringify(r.stdout)}`);
  }
});
check("hook — la lettre est citée (« 99a », « D-99 (a) », « 99 b », « 68a, 99a ») → AUCUN rappel", () => {
  for (const m of ["99a", "D-99 (a)", "99 b", "68a, 99a"]) {
    const r = jouerAvec(m, APRES_D99);
    if (r.status !== 0 || r.stdout.trim() !== "") throw new Error(`« ${m} » reçoit un rappel : ${JSON.stringify(r.stdout)}`);
  }
});
check("hook — un sélecteur d'action (« A1 », « A-2 ») n'est pas une décision et ne déclenche pas le rappel", () => {
  for (const m of ["A1", "A-2"]) {
    const r = jouerAvec(m, APRES_D99);
    if (r.status !== 0 || r.stdout.trim() !== "") throw new Error(`« ${m} » reçoit un rappel : ${JSON.stringify(r.stdout)}`);
  }
});
check("cas rouge (œil critique du 29/10) — « il y a 2 jours, fais-le » et « il a 3 options, vas-y » ne sont pas des sélecteurs d'action → rappel", () => {
  for (const m of ["il y a 2 jours, fais-le", "il a 3 options, vas-y"]) {
    const r = jouerAvec(m, APRES_D99);
    if (!/\[LETTRE — hook-lexique\][^\n]*D-99/.test(r.stdout)) throw new Error(`« ${m} » sans rappel : le verbe « a » est lu comme une action`);
  }
  for (const m of ["a1", "a-2"]) {
    const r = jouerAvec(m, APRES_D99);
    if (r.stdout.trim() !== "") throw new Error(`« ${m} » reçoit un rappel : le sélecteur en minuscules n'est plus reconnu`);
  }
});
check("hook — aucune décision ouverte dans le dernier message de l'assistant → rien", () => {
  const sansDecision = [humain("99a"), assistant("m2", "## 4. Exécution\n\nD-99 (a) exécutée : la page est publiée.\n\n> **D-98 — décision d'hier, déjà tranchée** : exécutée, sans question.\n")];
  const r = jouerAvec("exécute le prompt", sansDecision);
  if (r.status !== 0 || r.stdout.trim() !== "") throw new Error(`rappel sans décision ouverte : ${JSON.stringify(r.stdout)}`);
});
check("hook — la décision posée plus haut dans la conversation n'est pas celle du DERNIER message : rappel limité à la dernière", () => {
  const r = jouerAvec("exécute le prompt", [assistant("m0", "> **D-98 — Ancienne question ?**\n"), humain("98a"), assistant("m1", DECISION_99)]);
  if (!/D-99/.test(r.stdout) || /D-98/.test(r.stdout)) throw new Error(`rappel inattendu : ${JSON.stringify(r.stdout)}`);
});
check("hook — la décision est tranchée depuis (un message humain citant 99a la suit) → rien", () => {
  const r = jouerAvec("exécute le prompt", [humain("où en est la publication ?"), assistant("m1", DECISION_99), humain("99a")]);
  if (r.status !== 0 || r.stdout.trim() !== "") throw new Error(`rappel d'une décision tranchée : ${JSON.stringify(r.stdout)}`);
});
check("hook — un message qui n'est pas de l'humain (notification d'agent) ne reçoit pas le rappel", () => {
  const r = jouerAvec("<task-notification>\n<summary>Agent terminé</summary>\nrapport remis\n</task-notification>", APRES_D99);
  if (r.status !== 0 || r.stdout.trim() !== "") throw new Error(`notification avec rappel : ${JSON.stringify(r.stdout)}`);
});
check("cas rouge — hook — transcript absent, illisible ou sans champ → rien, exit 0, jamais un blocage", () => {
  for (const entree of [{ prompt: "exécute le prompt" }, { prompt: "exécute le prompt", transcript_path: join(tmpdir(), "n-existe-pas.jsonl") }]) {
    const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify(entree) });
    if (r.status !== 0 || r.stdout.trim() !== "") throw new Error(`sortie inattendue (exit ${r.status}) : ${JSON.stringify(r.stdout)}`);
  }
  const illisible = join(mkdtempSync(join(tmpdir(), "transcript-")), "x.jsonl");
  writeFileSync(illisible, "ceci n'est pas du JSON\n{ casse\n");
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ prompt: "exécute le prompt", transcript_path: illisible }) });
  if (r.status !== 0 || r.stdout.trim() !== "") throw new Error(`transcript illisible : exit ${r.status}, ${JSON.stringify(r.stdout)}`);
});
console.log(`\nhook-lexique.test : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
