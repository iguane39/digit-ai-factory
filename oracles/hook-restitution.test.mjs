#!/usr/bin/env node
/**
 * hook-restitution.test.mjs — recette du hook Stop (R-44) sur transcripts ÉPHÉMÈRES.
 *   1. tour de TRAVAIL + message final hors format → {"decision":"block"} avec règles nommées ;
 *   2. même transcript, `stop_hook_active` vrai (déjà refusé une fois) → laisse passer ;
 *   3. tour de TRAVAIL + message final conforme (oracle-synthese PASS) → laisse passer ;
 *   4. tour de LECTURE (Read/Grep seulement) + message libre → laisse passer, non jugé ;
 *   6. (TF-0516) tour portant une phrase de transition, les outils, puis la restitution conforme →
 *      laisse passer : le hook juge le texte le PLUS LONG du tour, pas le dernier. Sans ce
 *      remède, quatre échecs bloquants tombaient sur un message portant ses neuf titres.
 *   5. (22/08) message STRUCTURELLEMENT conforme mais portant un défaut de DÉTAIL (S8 : une
 *      puce « fait » sans preuve) → NE BLOQUE PAS, dit l'avertissement sous la réponse. C'est
 *      le retour humain du 22/08 : un hook `Stop` juge après l'affichage, donc chaque refus
 *      laisse la version rejetée à l'écran et fait relire huit blocs pour une puce. Sans ce
 *      cas, la proportionnalité du gate ne serait tenue par rien.
 * La conformité du message « bon » est établie par oracle-synthese lui-même (pas par le test).
 * Joué par oracles/self-tests.mjs (I2).
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "hook-restitution.mjs");
const ORACLE = join(ICI, "oracle-synthese.mjs");
const base = mkdtempSync(join(tmpdir(), "hook-rest-"));
const echecs = [];

const MAUVAIS = "J'ai corrigé le script et commité. Tout s'est bien passé, dis-moi si tu veux autre chose.";
const BON = `La mise à jour demandée est en place et vérifiée : le poste repart sur les dernières versions des forges, et rien ne bloque la suite de votre journée. Ce que cela change : les prochaines sessions démarrent à jour sans geste de votre part. Ce qui est attendu de vous : une seule décision, ci-dessous, sur le moment de la publication.

## 1. En-tête
- quoi : campagne de mise à jour · sur quoi : la factory · quand : 2026-08-20 21:40 (Europe/Paris), durée 35 min · qui : pilot v1.17.19.

## 2. Verdict
- Recette du pilot 22/22 verte, bootstrap 7/7.

## 3. Décisions attendues
- Publier maintenant la version corrigée du démarrage, ou attendre demain matin ? Le contrôle
  vient de passer en entier, donc la version est prête ; la seule question est de savoir si on
  la met à disposition des autres postes tout de suite, ou si on garde une nuit pour un dernier
  regard humain avant qu'elle ne circule.
  - (a) pousser maintenant — coût nul, exclut un dernier regard humain ; recommandé : le journal \`recette.md\` ne porte aucun défaut ouvert.
  - (b) pousser demain matin — coût : un poste périmé une nuit. Défaut si rien n'est décidé : (a).

## 4. Traité
- bootstrap v2 livré — preuve : bootstrap.test.mjs 7/7, recette 22/22.

## 5. Non traité
- la propagation sur les postes qui ne relancent jamais bootstrap — motif : hors de portée de ce correctif, couvert par la garde d'ouverture.

## 6. Écarts à la lettre
- aucun écart.

## 7. Risques
- un poste hors ligne ne vérifie pas sa fraîcheur — signal : avertissement « origin injoignable » au rapport ; parade : le défaut est dit, jamais masqué.

## 8. Prochaines actions
- auto_ia : 1. TF-0001 rejouer la recette au prochain démarrage (d'abord, parce que gratuit).
  - motif de non-exécution : dependance_bloc_3 — attend la décision ci-dessus.
  - si rien n'est fait : la recette reste jouée sur l'état d'avant, donc son vert ne prouve rien.
- manuelle_utilisateur : 2. TF-0002 décider (a)/(b) ci-dessus (ensuite, parce que tout le reste en dépend).
  - pourquoi pas l'IA : decision — arbitrage humain, R-29.
  - où : répondre \`(a)\` ou \`(b)\` au bloc 3 de ce message.
  - si rien n'est fait : le poste reste sur la version d'hier et toutes les suites attendent.
- manuelle_dev : aucune.
`;

const transcript = (texteFinal, outils) => [
  { type: "user", message: { role: "user", content: "fais la mise à jour" } },
  { type: "assistant", message: { role: "assistant", content: outils.map((n) => ({ type: "tool_use", name: n, input: {} })) } },
  { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
  { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: texteFinal }] } },
].map((e) => JSON.stringify(e)).join("\n") + "\n";

// TF-0516 (22/08) — un tour de travail porte souvent DEUX textes : une phrase de préambule, puis
// la restitution. Le hook retenait le DERNIER et jugeait donc le préambule, ce qui rendait quatre
// échecs bloquants sur un message conforme. Ce transcript reproduit la forme exacte.
// Deux formes de tour, et c'est leur DIFFÉRENCE qui prouve la règle (TF-0516, 3e état).
//   · `tourComplet` : phrase de transition, PUIS les outils, PUIS la restitution. C'est la forme
//     réelle d'un tour de travail — le hook doit juger la RESTITUTION.
//   · `tourTronque` : les mêmes phrases de transition, les outils, et RIEN d'autre. C'est le
//     transcript pas encore écrit : la restitution existe à l'écran mais pas dans le fichier. Le
//     hook ne doit RIEN juger — accuser l'auteur d'un défaut qui n'est pas le sien coûte huit
//     blocs relus pour rien.
const tourComplet = (phrase, texteFinal, outils) => [
  { type: "user", message: { role: "user", content: "fais la mise à jour" } },
  { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: phrase }] } },
  { type: "assistant", message: { role: "assistant", content: outils.map((n) => ({ type: "tool_use", name: n, input: {} })) } },
  { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
  { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: texteFinal }] } },
].map((e) => JSON.stringify(e)).join("\n") + "\n";

const tourTronque = (phrase, outils) => [
  { type: "user", message: { role: "user", content: "fais la mise à jour" } },
  { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: phrase }] } },
  { type: "assistant", message: { role: "assistant", content: outils.map((n) => ({ type: "tool_use", name: n, input: {} })) } },
  { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
].map((e) => JSON.stringify(e)).join("\n") + "\n";

const lancer = (nom, texte, outils, actif = false) => {
  const p = join(base, nom + ".jsonl");
  writeFileSync(p, transcript(texte, outils), "utf8");
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ session_id: "test", transcript_path: p, stop_hook_active: actif }) });
  let decision = null;
  try { decision = JSON.parse(r.stdout || "null"); } catch { /* pas de JSON = laisse passer */ }
  return { code: r.status, decision, stderr: r.stderr };
};

try {
  // Le message « bon » doit d'abord être bon pour l'oracle lui-même — sinon la recette ment.
  const fb = join(base, "bon.md"); writeFileSync(fb, BON, "utf8");
  const ob = spawnSync(process.execPath, [ORACLE, fb], { encoding: "utf8" });
  if (ob.status !== 0) echecs.push(`fixture BON refusée par oracle-synthese : ${(ob.stdout.match(/"regle": "(S\d+)",\s*"statut": "FAIL"/g) || []).join(" ")}`);

  const r1 = lancer("mauvais", MAUVAIS, ["Write", "Bash"]);
  if (r1.decision?.decision !== "block") echecs.push(`1 : travail + hors format → attendu block, obtenu ${JSON.stringify(r1.decision)} ${r1.stderr.slice(0, 120)}`);
  else if (!/S1/.test(r1.decision.reason)) echecs.push("1 : le refus ne nomme pas la règle S1 (blocs absents)");

  // 6 (TF-0516) — forme RÉELLE d'un tour de travail : une phrase de transition, les outils, puis
  // la restitution. Le hook doit juger la RESTITUTION, pas la phrase.
  {
    const q = join(base, "tour-complet.jsonl");
    writeFileSync(q, tourComplet(
      "14 restent. Je passe au lot suivant.", BON, ["Write", "Edit"]), "utf8");
    const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8",
      input: JSON.stringify({ session_id: "test", transcript_path: q, stop_hook_active: false }) });
    let d = null;
    try { d = JSON.parse(r.stdout || "null"); } catch { /* pas de JSON = laisse passer */ }
    if (d !== null) echecs.push(`6 : phrase + outils + restitution conforme → attendu laisser passer, obtenu ${JSON.stringify(d).slice(0, 200)}`);
  }

  // 6 bis (TF-0516, 3e état) — LE CAS QUI DISCRIMINE. Le transcript ne porte pas encore la
  // restitution : son dernier texte est une phrase de transition, SUIVIE d'appels d'outils. Il n'y
  // a donc aucun texte FINAL, et rien à juger. Avec la lecture « le plus long texte du tour », ce
  // cas rendait quatre échecs bloquants sur un message qui portait ses neuf titres — mesuré le
  // 23/08 sur un tour réel de 24 écritures, 90 commandes et VINGT textes de transition.
  {
    const q = join(base, "tour-tronque.jsonl");
    writeFileSync(q, tourTronque("14 restent. Je passe au lot suivant.", ["Write", "Edit"]), "utf8");
    const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8",
      input: JSON.stringify({ session_id: "test", transcript_path: q, stop_hook_active: false }) });
    let d = null;
    try { d = JSON.parse(r.stdout || "null"); } catch { /* pas de JSON = laisse passer */ }
    if (d !== null) echecs.push(`6 bis : transcript sans texte final → attendu ne RIEN juger, obtenu ${JSON.stringify(d).slice(0, 200)}`);
  }

  const r2 = lancer("mauvais-actif", MAUVAIS, ["Write"], true);
  if (r2.decision !== null) echecs.push("2 : stop_hook_active → attendu laisser passer (anti-boucle)");

  const r3 = lancer("bon", BON, ["Write", "Edit"]);
  if (r3.decision !== null) echecs.push(`3 : travail + conforme → attendu laisser passer, obtenu ${JSON.stringify(r3.decision).slice(0, 200)}`);

  const r4 = lancer("lecture", MAUVAIS, ["Read", "Grep"]);
  if (r4.decision !== null) echecs.push("4 : tour de lecture → attendu non jugé");

  // 5 — défaut de DÉTAIL seul : la structure tient, une puce du bloc 4 perd sa preuve.
  // S8 cherche un mot d'achèvement (« fait », « terminé », « clos », ✓) dans une puce SANS
  // preuve : on retire la preuve de la seule puce du bloc 4 et on garde le mot.
  const DETAIL = BON.replace(
    "- bootstrap v2 livré — preuve : bootstrap.test.mjs 7/7, recette 22/22.",
    "- la mise à jour du poste est terminée.");
  const r5 = lancer("detail", DETAIL, ["Write", "Edit"]);
  if (r5.decision?.decision === "block")
    echecs.push(`5 : défaut de détail → bloqué à tort (le lecteur relirait tout pour une puce) : ${String(r5.decision.reason).slice(0, 120)}`);
  else if (!r5.decision?.systemMessage)
    echecs.push("5 : défaut de détail → ni blocage ni avertissement : le verdict serait muet");
  else if (!/S8/.test(r5.decision.systemMessage))
    echecs.push("5 : l'avertissement ne nomme pas la règle en cause");
} catch (e) { echecs.push(`harnais : ${String(e).slice(0, 200)}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

if (echecs.length) { console.error("hook-restitution : FAIL\n  - " + echecs.join("\n  - ")); process.exit(1); }
console.log("hook-restitution : 7/7 — hors format refusé (S1 nommé), anti-boucle, conforme accepté, lecture non jugée, défaut de détail averti SANS réécriture, phrase de transition qui ne masque plus la restitution, transcript sans texte final NON jugé (TF-0516)");
