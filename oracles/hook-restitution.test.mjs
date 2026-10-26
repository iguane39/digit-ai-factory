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
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync, utimesSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { RESERVATION_BLOQUANTE_DES, RESERVATION_PILOT_BLOQUANTE_DES, analyserTranscript, comparerAffiche, controlerDetail, controlerReservation, controlerExplication, controlerGeste, controlerPossession, controlerProcedure, demandeProcedure, demandesDetail, syntheseDuTour } from "./hook-restitution.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "hook-restitution.mjs");
const ORACLE = join(ICI, "oracle-synthese.mjs");
const base = mkdtempSync(join(tmpdir(), "hook-rest-"));
const echecs = [];
// TF-1872 (18/10/2026) : le contrôle RÉSERVATION joue AUSSI au pilot, dont les sessions de cette recette portent le dossier de travail. Les cas qui n'ont
// rien à voir avec lui (3, 6, 16, 31 à 37…) posent D-1 et D-12 : ils les trouvent au registre d'ESSAI que cette recette fabrique (jamais celui du pilot, que
// l'environnement ci-dessous remplace) — le contrôle reste donc armé dans ces cas, et ne les accuse pas de ce qui n'est pas leur objet.
const REGISTRE_RECETTE = join(base, "registre-decisions-recette.jsonl");
writeFileSync(REGISTRE_RECETTE, [
  { type: "registre", version: 1, objet: "registre d'essai de la recette hook-restitution" },
  { type: "decision", n: 1, question: "Publier maintenant la version corrigée du démarrage, ou attendre demain matin ?", date: "2026-10-18", origine: "essai" },
  { type: "decision", n: 12, question: "Faut-il enchaîner sur la forge-ops ce soir, ou reprendre demain matin ?", date: "2026-10-18", origine: "essai" },
].map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
process.env.FORGE_REGISTRE_DECISIONS_PILOT = REGISTRE_RECETTE;
const ENV_SANS_SESSION = { ...process.env };
delete ENV_SANS_SESSION.CLAUDE_CODE_SESSION_ID;

const MAUVAIS = "J'ai corrigé le script et commité. Tout s'est bien passé, dis-moi si tu veux autre chose.";
// T2 (TF-1947, 26/10/2026, gabarit 2.50.0) : BON porte son bloc 9, toujours présent et exigé par S1 depuis. Il est placé AVANT le
// bloc 8 dans cette fixture seulement : des cas ajoutent une action à la FIN de BON, c'est-à-dire au bloc 8 (cas 37), et S1 juge
// la présence d'un bloc, jamais son ordre.
const BON = `La mise à jour demandée est en place et vérifiée : le poste repart sur les dernières versions des forges, et rien ne bloque la suite de votre journée. Ce que cela change : les prochaines sessions démarrent à jour sans geste de votre part. Ce qui est attendu de vous : une seule décision, ci-dessous, sur le moment de la publication.

## 1. En-tête
- quoi : campagne de mise à jour · sur quoi : la factory · quand : 2026-08-20 21:40 (Europe/Paris), durée 35 min · qui : pilot v1.17.19 · intention : que le poste reparte à jour sans geste de votre part, pas seulement que la recette passe. Test rétro : bootstrap et recette sont verts, l'intention est servie.

## 2. Verdict
- Recette du pilot 22/22 verte, bootstrap 7/7.

## 3. Décisions attendues
- **D-1 —** Publier maintenant la version corrigée du démarrage, ou attendre demain matin ? Le contrôle
  de \`bootstrap.mjs\` vient de passer en entier, donc la version est prête ; la seule question est
  de savoir si on la met à disposition des autres postes tout de suite, ou si on garde une nuit
  pour un dernier regard humain avant qu'elle ne circule.
  - (a) pousser maintenant — coût nul, exclut un dernier regard humain ; recommandé : le journal \`recette.md\` ne porte aucun défaut ouvert.
  - (b) pousser demain matin — coût : un poste périmé une nuit ; exclut la mise à disposition immédiate.
  - si rien n'est décidé : (a) s'applique.

## 4. Traité
- bootstrap v2 livré — preuve : bootstrap.test.mjs 7/7, recette 22/22.

## 5. Non traité
- la propagation sur les postes qui ne relancent jamais bootstrap — motif : hors de portée de ce correctif, couvert par la garde d'ouverture.

## 6. Écarts à la lettre
- aucun écart.

## 7. Risques
- un poste hors ligne ne vérifie pas sa fraîcheur — signal : avertissement « origin injoignable » au rapport ; parade : le défaut est dit, jamais masqué.

## 9. Traces
- \`bootstrap.test.mjs\` : la recette du démarrage, rejouée.

## 8. Prochaines actions
- **A-1** — auto_ia : TF-0001 rejouer la recette au prochain démarrage (d'abord, parce que gratuit).
  - motif de non-exécution : dependance_bloc_3 — attend la décision ci-dessus.
  - si rien n'est fait : la recette reste jouée sur l'état d'avant, donc son vert ne prouve rien.
- **A-2** — manuelle_utilisateur : TF-0002 décider (a)/(b) ci-dessus (ensuite, parce que tout le reste en dépend).
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
  // TF-1739 (lot du 25/08, RV-2) : la garde anti-boucle laissait passer la réécriture SANS la juger
  // visiblement — refusée sur S1/S3/S4/S6, réécrite, acceptée, puis rejouée à la main : S15 et S16 FAIL.
  // Désormais : pas de second refus (pas de boucle), mais la réécriture est REJUGÉE et son verdict
  // AFFICHÉ à l'humain par un systemMessage nommant les règles encore en défaut.
  if (r2.decision === null || r2.decision.decision === "block"
      || !/réécriture/.test(r2.decision.systemMessage || "") || !/S\d+/.test(r2.decision.systemMessage || ""))
    echecs.push(`2 : stop_hook_active → attendu pas de second refus ET verdict de la réécriture affiché (TF-1739), obtenu ${JSON.stringify(r2.decision)?.slice(0, 200)}`);

  const r3 = lancer("bon", BON, ["Write", "Edit"]);
  if (r3.decision !== null) echecs.push(`3 : travail + conforme → attendu laisser passer, obtenu ${JSON.stringify(r3.decision).slice(0, 200)}`);

  const r4 = lancer("lecture", MAUVAIS, ["Read", "Grep"]);
  if (r4.decision !== null) echecs.push("4 : tour de lecture → attendu non jugé");

  // 7 (TF-0904, 08/09) — UN VERDICT RENDU SANS ÉCRITURE EST UNE RESTITUTION. Le cas du 07/09 :
  // une question « la proposition a-t-elle été testée ? peut-on garantir… », une réponse en prose
  // portant un verdict, UNE commande, ZÉRO écriture. Hors critère « tour de travail » → jamais
  // jugée, alors que RESTITUTION.md régit « tout message de fin de traitement ».
  const VERDICT_LIBRE = "La proposition est conforme et je peux garantir qu'elle couvre le périmètre : "
    + "le mapping a été relu, les colonnes se correspondent, et rien ne manque à ma connaissance.";
  const r7 = lancer("verdict-sans-ecriture", VERDICT_LIBRE, ["Read"]);
  if (r7.decision?.decision !== "block")
    echecs.push(`7 : verdict rendu sans écriture → attendu block, obtenu ${JSON.stringify(r7.decision)}`);

  // 8 — SA CONTRE-ÉPREUVE, et sans elle la règle 7 désarmerait la conversation ordinaire : un
  // accusé de réception court, sans verdict, reste NON jugé (exemption écrite au §Portée).
  const r8 = lancer("accuse-reception", "C'est noté, je m'en occupe.", ["Read"]);
  if (r8.decision !== null)
    echecs.push(`8 : accusé de réception court → attendu non jugé, obtenu ${JSON.stringify(r8.decision).slice(0, 160)}`);

  // 9 — et une QUESTION rendue à l'humain (bloque_question) n'est pas une restitution non plus.
  const r9 = lancer("question", "Sur quel environnement dois-je mesurer, la recette ou la production ?", ["Read"]);
  if (r9.decision !== null)
    echecs.push(`9 : question rendue à l'humain → attendu non jugé, obtenu ${JSON.stringify(r9.decision).slice(0, 160)}`);

  // 21 et 22 (TF-0990, 16/09) — L'EXEMPTION « RIEN DE NEUF » ET SA BORNE, DANS LEURS DEUX SENS.
  // Le référentiel l'annonçait depuis la v2.18.0 et le juge l'ignorait : un accusé de trois phrases
  // rendu sur une notification de tâche échue — dépôt inchangé, aucun verdict déplacé — était refusé
  // sur quatre constats bloquants, et la restitution complète écrite à la place faisait
  // quatre-vingt-dix lignes pour dire qu'il ne s'était rien passé. Elle est nommée, et bornée par
  // les TROIS absences : un message court qui POSE une décision demande un geste, donc il est jugé.
  const RIEN_DE_NEUF = "La tâche de fond lancée hier s'est terminée à 06h12. Rien n'a changé dans le dépôt : "
    + "aucun fichier écrit, aucun contrôle rejoué. Rien n'est attendu de vous à ce stade.";
  const r21 = lancer("rien-de-neuf", RIEN_DE_NEUF, ["Read"]);
  if (r21.decision !== null)
    echecs.push("21 : accusé « rien de neuf » — trois lignes, aucun verdict, aucune D-N ni A-N — attendu NON jugé ; "
      + `l'exemption écrite au §Portée resterait absente de son juge, obtenu ${JSON.stringify(r21.decision).slice(0, 160)}`);

  const POSE_UNE_DECISION = "La tâche de fond s'est terminée à 06h12. Le dépôt est inchangé. "
    + "D-4 — faut-il publier la branche maintenant, ou attendre le prochain lot ? Dites-moi (a) ou (b).";
  const r22 = lancer("court-mais-decisif", POSE_UNE_DECISION, ["Read"]);
  if (r22.decision?.decision !== "block")
    echecs.push("22 : un message court qui POSE une décision D-N passerait pour un accusé de réception — "
      + "l'exemption « rien de neuf » perdrait sa borne et s'appliquerait à un message qui demande un geste, "
      + `obtenu ${JSON.stringify(r22.decision)}`);

  // 38 et 39 (01/10/2026) — CITER UNE DÉCISION N'EST PAS LA POSER. LE FAIT : une réponse « Niveau :
  // Simple » de 129 mots, qui rappelait « la décision de départ (D-39) » au milieu d'une phrase, a
  // été prise pour un message qui POSE une décision ; refusée après affichage, elle a été réécrite,
  // et l'humain a vu sa réponse deux fois (« le prompt de sortie s'est affiché 2 fois »). Poser,
  // c'est la forme d'une décision ou d'une action : l'identifiant suivi d'un séparateur (« D-4 — »,
  // « A-2 : », « | **A-1** | ») ou d'une option à choisir (« D-39 (a) », « D-39 a. »). Une mention
  // dans la prose reste une citation. Les cas 22 et 25 (« D-4 — … ? », « D-7 — … ? ») tiennent la
  // borne dans l'autre sens.
  const CITE_UNE_DECISION = "Niveau : Simple\n\nOui, il y a une étape humaine récurrente : chaque "
    + "proposition entre en candidature et attend votre décision. Les autres sont espacées : la décision "
    + "de départ (D-39), puis les revues du 2026-10-15 et du 2026-10-29.\n\nSource : l'étude, ligne 251.";
  const r38 = lancer("cite-une-decision", CITE_UNE_DECISION, ["Grep"]);
  if (r38.decision !== null)
    echecs.push("38 : une réponse courte qui CITE une décision (« la décision de départ (D-39) ») est jugée "
      + `comme si elle la posait — refusée après affichage, elle s'affiche deux fois, obtenu ${JSON.stringify(r38.decision).slice(0, 160)}`);
  const POSE_PAR_SELECTEUR = "Le lot est prêt et rien n'a changé dans le dépôt. Pour le publier, répondez D-39 (a).";
  const r39 = lancer("pose-par-selecteur", POSE_PAR_SELECTEUR, ["Read"]);
  if (r39.decision?.decision !== "block")
    echecs.push("39 : un message court qui demande un sélecteur « D-39 (a) » pose une décision et doit rester "
      + `jugé, obtenu ${JSON.stringify(r39.decision)}`);

  // 23 à 25 (TF-1182, 17/09) — LE RELAIS D'AVANCEMENT, ET LA BORNE QUI L'EMPÊCHE D'ÊTRE UN TROU.
  //
  // LE FAIT : une notification de tâche de fond — le rapport d'un agent de campagne — n'est pas un
  // message HUMAIN, donc le segment ne se referme pas. Le relais de trois lignes qui la répercute
  // se retrouve dans le même segment que les vingt écritures et la synthèse déposée une heure plus
  // tôt : il est jugé comme un tour de travail et refusé parce qu'il ne reprend pas la synthèse en
  // entier. Mesuré le 17/09 : quatre re-affichages complets d'une synthèse de 120 lignes en 45 min.
  //
  // Les trois transcripts ne diffèrent QUE par ce que la règle regarde : ce qui s'est passé entre
  // les deux affichages (rien / une écriture), et ce que le relais porte (rien / une D-N).
  {
    const deposee = join(base, "Synthese - Mandat - 20260917a.md");
    writeFileSync(deposee, "---\ndestinataire: humain\n---\n\n" + BON, "utf8");
    const RELAIS = "L'agent de campagne sur le juge de restitution vient d'émettre son avancement : "
      + "2 chantiers finis sur 5, le troisième en cours. Rien n'a changé dans le dépôt depuis mon dernier point.";
    const relaisTranscript = (nom, texteRelais, ecritureEntreDeux) => {
      const e = [
        { type: "user", message: { role: "user", content: "traite les todos et retours" } },
        { type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name: "Write", input: { file_path: deposee } }] } },
        { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
        { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: BON }] } },
      ];
      if (ecritureEntreDeux) {
        e.push({ type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name: "Edit", input: { file_path: join(base, "code.mjs") } }] } });
        e.push({ type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } });
      }
      e.push({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text: texteRelais }] } });
      const p = join(base, nom + ".jsonl");
      writeFileSync(p, e.map((x) => JSON.stringify(x)).join("\n") + "\n", "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8",
        input: JSON.stringify({ session_id: "test-relais", transcript_path: p, stop_hook_active: false }) });
      try { return JSON.parse(r.stdout || "null"); } catch { return null; }
    };
    const d23 = relaisTranscript("relais-sans-ecriture", RELAIS, false);
    if (d23 !== null)
      echecs.push("23 : un relais d'avancement de trois lignes, après une synthèse déjà affichée et RIEN d'écrit "
        + `depuis, doit passer — sinon chaque relais force le ré-affichage de la synthèse entière (TF-1182), obtenu ${JSON.stringify(d23).slice(0, 220)}`);

    // 24 — LE SENS QUI FERME LE TROU DE TF-0978 : une seule écriture entre les deux affichages, et
    // le même message de trois lignes redevient un rendu de fin de tour, donc jugé, donc refusé.
    const d24 = relaisTranscript("relais-apres-ecriture", RELAIS, true);
    if (d24?.decision !== "block")
      echecs.push("24 : une écriture s'est intercalée depuis le dernier affichage et le message de trois lignes passe — "
        + `l'exemption de relais rouvrirait le trou fermé par TF-0978 (un tour qui a écrit reste jugé), obtenu ${JSON.stringify(d24).slice(0, 220)}`);

    // 25 — LA SECONDE BORNE, celle de TF-0990 : un relais qui POSE une décision demande un geste à
    // l'humain. Rien n'a été écrit depuis le dernier affichage, et il est jugé quand même.
    const d25 = relaisTranscript("relais-qui-decide", RELAIS + " D-7 — faut-il publier la forge maintenant ?", false);
    if (d25?.decision !== "block")
      echecs.push("25 : un relais qui POSE une D-7 passerait pour un avancement — l'exemption perdrait les TROIS "
        + `absences qu'elle partage avec « rien de neuf » (aucun verdict, aucune D-N, aucune A-N), obtenu ${JSON.stringify(d25).slice(0, 220)}`);
  }

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

  // 10 à 12 (TF-0891, 08/09) — L'AFFICHÉ REPREND LES BLOCS 3 ET 8 DU FICHIER JUGÉ.
  // Le fait du 07/09 : un fichier PASS S1-S37 paraphrasé à l'écran — bloc 3 sans tableau
  // d'options, bloc 8 avec « vous » et « IA » à la place du vocabulaire gelé. La comparaison du
  // 30/08 ne regardait que les numéros de décision et les lignes de repli : elle n'a rien vu.
  // Les trois sens se jouent sur le MÊME fichier de référence, seule la paraphrase change.
  const FICHIER = BON.replace(
    "  - (a) pousser maintenant — coût nul, exclut un dernier regard humain ; recommandé : le journal `recette.md` ne porte aucun défaut ouvert.",
    "\n| Option | Coût | Exclusions |\n|---|---|---|\n| (a) pousser maintenant | nul | un dernier regard humain |\n| (b) pousser demain | un poste périmé une nuit | la mise à disposition immédiate |\n");
  if (comparerAffiche(FICHIER, FICHIER).length)
    echecs.push(`10 : le fichier comparé à LUI-MÊME rend un écart — la règle accuserait un affichage fidèle : ${comparerAffiche(FICHIER, FICHIER).join(" | ")}`);

  const SANS_TABLEAU = FICHIER.replace(/\n\| Option \|[\s\S]*?\n\n/, "\n(a) pousser maintenant, ou (b) pousser demain matin.\n\n");
  const e11 = comparerAffiche(SANS_TABLEAU, FICHIER);
  if (!e11.some((x) => /TABLEAU DES OPTIONS/.test(x)))
    echecs.push(`11 : le tableau d'options perdu à l'écran n'est pas vu — écarts rendus : ${e11.join(" | ") || "aucun"}`);

  const PARAPHRASE = FICHIER
    .replace(/\*\*A-1\*\* — auto_ia/, "l'IA")
    .replace(/\*\*A-2\*\* — manuelle_utilisateur/, "vous")
    .replace("- manuelle_dev : aucune.", "- rien côté développeur.");
  const e12 = comparerAffiche(PARAPHRASE, FICHIER);
  if (!e12.some((x) => /actions du fichier jugé/.test(x)))
    echecs.push(`12 : les sélecteurs A-N disparus de l'écran ne sont pas vus — écarts : ${e12.join(" | ") || "aucun"}`);
  if (!e12.some((x) => /vocabulaire gelé/.test(x)))
    echecs.push(`12 bis : les acteurs remplacés par « vous » et « IA » ne sont pas vus — écarts : ${e12.join(" | ") || "aucun"}`);

  // 13 et 14 (TF-0918, 08/09) — LE VERDICT AFFICHÉ MESURE CE QUE LA TRACE MESURE.
  // Le fait du 08/09 : au cours d'un mandat long, l'écran a été enrichi à chaque rapport d'agent
  // (« 3 rapports sur 7 » puis « 6 items clos ») sans que le fichier déposé soit redéposé — il
  // portait encore « 2 sur 7 ». Décisions, options, sélecteurs et acteurs identiques des deux
  // côtés : les cinq propriétés de TF-0891 rendaient PASS. Le sens est inversé (l'écran plus
  // riche que la trace) et l'effet est pire : c'est la pièce opposable qui ment, après coup.
  const AVEC_VERDICT = FICHIER.replace(/\n## 2\.[^\n]*\n/, "\n## 2. Verdict en une ligne\n\n2 rapports sur 7 reçus, 3 items clos, recette 22/22 verte.\n");
  if (comparerAffiche(AVEC_VERDICT, AVEC_VERDICT).length)
    echecs.push(`13 : verdict identique des deux côtés → écart rendu à tort : ${comparerAffiche(AVEC_VERDICT, AVEC_VERDICT).join(" | ")}`);
  const ECRAN_ENRICHI = AVEC_VERDICT.replace("2 rapports sur 7 reçus, 3 items clos", "6 rapports sur 7 reçus, 31 items clos");
  const e13 = comparerAffiche(ECRAN_ENRICHI, AVEC_VERDICT);
  if (!e13.some((x) => /VERDICT \(bloc 2\) affiché/.test(x)))
    echecs.push(`14 : l'écran avance des chiffres absents de la trace, non vu — écarts : ${e13.join(" | ") || "aucun"}`);
  if (!e13.some((x) => /31/.test(x)))
    echecs.push(`14 bis : l'écart ne nomme pas le chiffre en cause — écarts : ${e13.join(" | ") || "aucun"}`);
  // La borne : un identifiant, une empreinte, une version ou une date qui change de forme n'est
  // PAS un fait mesuré — sans quoi la règle crierait sur toute reformulation légitime.
  const REFORMULE = AVEC_VERDICT.replace(/\n## 2\.[^\n]*\n\n[^\n]*\n/, "\n## 2. Verdict en une ligne\n\n2 rapports sur 7 reçus, 3 items clos (TF-0844, TF-0845, TF-0886), recette 22/22 verte, publié en 6a33b3e le 2026-09-08 à 09:32, gabarit v2.18.0.\n");
  const e14 = comparerAffiche(REFORMULE, AVEC_VERDICT);
  if (e14.some((x) => /VERDICT \(bloc 2\) affiché/.test(x)))
    echecs.push(`14 ter : identifiants, empreinte, date et version comptés comme des faits mesurés — écarts : ${e14.join(" | ")}`);

  // 15 à 18 (TF-1019, 11/09) — UNE DÉCISION RENDUE RÉCLAME LA PREUVE DU GESTE.
  // Le fait, mesuré sur une transcription de ce poste : l'humain écrit « 11a » à 07:05:01Z puis de
  // nouveau « 11a » à 07:07:39Z ; les deux messages de fin de tour sont la synthèse de la VEILLE
  // REJOUÉE MOT POUR MOT — 3156 mots, même bloc 3 reposant D-11 — et le hook les a jugés PASS les
  // deux fois. `oracle-synthese` juge la FORME d'un message, jamais son rapport au message humain
  // qui le précède : une restitution conforme rejouée à l'identique est, par construction,
  // conforme. Le geste demandé (le push) n'est venu que deux heures plus tard.
  const FIXTURES = join(ICI, "fixtures");
  const lancerFichier = (p) => {
    const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8",
      input: JSON.stringify({ session_id: "test-geste", transcript_path: p, stop_hook_active: false }) });
    let d = null;
    try { d = JSON.parse(r.stdout || "null"); } catch { /* pas de JSON = laisse passer */ }
    return d;
  };
  // Les DEUX textes des fixtures sont PASS pour oracle-synthese lui-même : le rouge est donc rouge
  // par le GESTE seul, jamais par un défaut de forme qui masquerait ce qu'on prétend prouver.
  for (const f of ["geste-pose.md", "geste-fait.md"]) {
    const o = spawnSync(process.execPath, [ORACLE, join(FIXTURES, f)], { encoding: "utf8" });
    if (o.status !== 0)
      echecs.push(`15 : la fixture ${f} est refusée par oracle-synthese (${(o.stdout.match(/"regle": "(S\d+)",\s*"statut": "FAIL"/g) || []).join(" ")}) — le rouge ne prouverait pas le geste`);
  }

  // T2 (TF-1947, 26/10/2026) : GESTE AVERTIT, il ne refuse plus. Adapté : le cas attendait un refus ; il attend désormais
  // l'avertissement, sous la réponse, qui nomme les MÊMES deux formes du non-geste et le MÊME rappel — la détection est intacte.
  const d15 = lancerFichier(join(FIXTURES, "geste-rouge.jsonl"));
  if (d15?.decision === "block" || !d15?.systemMessage)
    echecs.push(`15 bis : « 11a » reçu, restitution rejouée mot pour mot → attendu l'avertissement GESTE sans refus (T2), obtenu ${JSON.stringify(d15).slice(0, 200)}`);
  else {
    if (!/GESTE — décision D-11 \(a\) reçue, geste absent : le message de fin de tour est identique au précédent/.test(d15.systemMessage))
      echecs.push(`15 ter : l'avertissement ne nomme pas le message identique au précédent — ${String(d15.systemMessage).slice(0, 220)}`);
    if (!/la même D-11 est reposée au bloc 3/.test(d15.systemMessage))
      echecs.push("15 quater : l'avertissement ne nomme pas la décision reposée au bloc 3");
    if (!/PREUVE du geste au bloc 4/.test(d15.systemMessage))
      echecs.push("15 quinquies : l'avertissement ne porte pas le rappel court");
  }

  // 16 — LE SENS VERT, sans lequel la règle ne prouverait rien : la même décision reçue, mais le
  // tour PRODUIT le geste — message final différent du précédent, D-11 n'est plus reposée (la
  // suite se joue sur D-12), et le bloc 4 porte la preuve exécutée du push.
  const d16 = lancerFichier(join(FIXTURES, "geste-vert.jsonl"));
  if (d16 !== null)
    echecs.push(`16 : « 11a » + geste exécuté → attendu laisser passer, obtenu ${JSON.stringify(d16).slice(0, 300)}`);

  // 17 — LA BORNE : le même transcript rouge, mais le dernier message humain n'est PAS un
  // sélecteur. Le contrôle ne s'applique pas — sans cette borne il crierait sur toute conversation
  // où une restitution ressemble à la précédente, et ce n'est pas ce qu'il existe pour attraper.
  {
    const lignes = readFileSync(join(FIXTURES, "geste-rouge.jsonl"), "utf8").trim().split("\n");
    for (let i = lignes.length - 1; i >= 0; i--) {
      const e = JSON.parse(lignes[i]);
      if (e.type === "user" && typeof e.message?.content === "string") {
        e.message.content = "Traite toutes les actions";
        lignes[i] = JSON.stringify(e);
        break;
      }
    }
    const p = join(base, "geste-non-selecteur.jsonl");
    writeFileSync(p, lignes.join("\n") + "\n", "utf8");
    const d17 = lancerFichier(p);
    if (d17 && /GESTE —/.test(String(d17.reason || "")))
      echecs.push(`17 : dernier message humain « Traite toutes les actions » → GESTE ne doit pas s'appliquer : ${String(d17.reason).slice(0, 200)}`);
  }

  // 18 — LES FORMES du sélecteur, reconnues et NON reconnues. La reconnaissance est ancrée sur le
  // message ENTIER : un message qui n'est QUE des sélecteurs est sans ambiguïté, alors qu'un
  // « 11a » noyé dans une phrase peut être une citation, une référence ou un chiffre.
  for (const [texte, attendu] of [
    ["11a", "D-11 (a)"], ["11 a", "D-11 (a)"], ["D-11 (a)", "D-11 (a)"], ["D-11 a", "D-11 (a)"],
    ["D11a", "D-11 (a)"], ["d-11 (A)", "D-11 (a)"], ["  11b  ", "D-11 (b)"], ["11c.", "D-11 (c)"],
    ["32b, 30a", "D-32 (b), D-30 (a)"], ["32b 30a", "D-32 (b), D-30 (a)"],
    ["D-32 (b), D-30 (a)", "D-32 (b), D-30 (a)"],
  ]) {
    const g = controlerGeste({ dernierHumain: texte, dernierTexte: "un message", textePrecedent: "un autre" });
    if (!g.applicable || g.decision !== attendu)
      echecs.push(`18 : « ${texte} » → attendu ${attendu}, obtenu ${g.applicable ? g.decision : "non reconnu"}`);
    else if (g.verdict !== "PASS")
      echecs.push(`18 : « ${texte} » → un tour qui produit un message neuf doit rendre PASS, obtenu ${g.verdict}`);
  }
  for (const texte of ["Traite toutes les actions", "", "fais le point sur 11a et dis-moi",
    "la règle 11 a été appliquée hier sur les onze livrables du mandat", "ok", "continue"]) {
    const g = controlerGeste({ dernierHumain: texte, dernierTexte: "x", textePrecedent: "y" });
    if (g.applicable)
      echecs.push(`18 bis : « ${texte.slice(0, 40)} » pris pour un sélecteur (${g.decision}) — la règle crierait sur une prose`);
  }

  // 40 et 41 (TF-1468, 28/09/2026) — LE MARQUEUR N'EST PAS LA FORME. Mesuré par l'agent « synthese » :
  // après la réponse « 6a », un rappel de D-6 en PUCE passait (non vu), la même ligne en CITATION
  // était refusée — alors que les deux posent à l'identique la question déjà tranchée. La forme qui
  // compte est COMPLÈTE : identifiant, tiret, question qui se termine par un point d'interrogation,
  // qu'elle vive sous `>` ou sous une puce ; le seul marqueur de tête de ligne ne suffit plus.
  const d40 = controlerGeste({
    dernierHumain: "6a",
    dernierTexte: "## 3. Décisions attendues\n\n- D-6 — Faut-il publier la branche maintenant, ou "
      + "attendre demain ?\n\nSuite du tour.",
    textePrecedent: "un message différent",
  });
  if (!d40.applicable || d40.verdict !== "FAIL" || !d40.ecarts.some((e) => /D-6.*reposée au bloc 3/.test(e)))
    echecs.push(`40 : un rappel de D-6 en PUCE (forme complète, question incluse) devrait être vu comme reposée — obtenu ${JSON.stringify(d40)}`);

  const d41 = controlerGeste({
    dernierHumain: "6a",
    dernierTexte: "## 4. Traité\n\n- D-6 — exécutée : la branche est publiée, 12 commits reçus.",
    textePrecedent: "un message différent",
  });
  if (!d41.applicable || d41.verdict !== "PASS")
    echecs.push(`41 : « D-6 — exécutée » (identifiant et tiret SEULS, sans question) n'est pas une décision reposée — obtenu ${JSON.stringify(d41)}`);

  // 19 — LE MARQUEUR SE LIT EN TÊTE DE LIGNE (17/09/2026). Le gabarit de restitution CITE le marqueur dans
  // sa prose et s'appelle « restitution » : édité dans le même tour que la synthèse, il a été jugé à sa
  // place. Les deux fichiers ne diffèrent que par la POSITION du marqueur : champ, ou mot dans une phrase.
  {
    const gabarit = join(base, "RESTITUTION.md");
    const synthese = join(base, "Marque - Synthese Mandat - Objet - 20260917a.md");
    writeFileSync(gabarit, "# Consigne de restitution\n\nLa synthèse naît avec `destinataire: humain` en frontmatter YAML.\n", "utf8");
    writeFileSync(synthese, "---\ndestinataire: humain\n---\n\n# Synthèse\n", "utf8");
    const choisi = syntheseDuTour([synthese, gabarit]);   // le gabarit est écrit EN DERNIER, comme le 17/09
    if (choisi !== synthese) echecs.push(`19 : le gabarit qui CITE le marqueur est jugé à la place de la synthèse (${choisi})`);
    if (syntheseDuTour([gabarit]) !== null) echecs.push("19 bis : un fichier qui ne porte le marqueur que dans sa prose est pris pour une synthèse");
    if (syntheseDuTour([synthese]) !== synthese) echecs.push("19 ter : la synthèse au marqueur en frontmatter n'est plus reconnue");
  }

  // 27 à 29 (TF-1184, 17/09) — UN FICHIER RENOMMÉ HORS OUTIL D'ÉCRITURE RESTE LA SYNTHÈSE DU TOUR.
  // Le fait rejoué le 17/09 : la synthèse déposée a été renommée par `mv` pour tenir le plafond de
  // longueur de chemin (S42). Le hook ne connaît que les chemins passés aux outils d'écriture ; ce
  // jour-là le repli a tenu parce qu'un seul fichier marqué existait, et rien ne le garantissait.
  {
    const d = join(base, "renomme");
    mkdirSync(d, { recursive: true });
    const ecrit = join(d, "Marque - Synthese Mandat - Un titre tres long qui depasse le plafond - 20260917a.md");
    const renomme = join(d, "Marque - Synthese Mandat - Court - 20260917a.md");
    writeFileSync(renomme, "---\ndestinataire: humain\n---\n\n# Synthèse renommée\n", "utf8");
    // `ecrit` n'existe PAS : c'est l'état laissé par un `mv` — le chemin de l'outil d'écriture a
    // disparu, le nouveau n'a jamais transité par un outil.
    if (syntheseDuTour([ecrit]) !== renomme)
      echecs.push("27 : un fichier de synthèse RENOMMÉ après son dépôt n'est pas retrouvé — le hook comparerait "
        + `l'écran à rien du tout, ou au mauvais document (TF-1184), obtenu ${syntheseDuTour([ecrit])}`);

    // 28 — LE CAS QUE LE 17/09 LAISSAIT OUVERT : deux fichiers marqués dans le même dossier. C'est
    // le PLUS RÉCEMMENT MODIFIÉ qui est la synthèse de ce tour, et rien d'autre ne les distingue.
    const vieux = join(d, "Marque - Synthese Mandat - De la veille - 20260916a.md");
    writeFileSync(vieux, "---\ndestinataire: humain\n---\n\n# Synthèse de la veille\n", "utf8");
    const jadis = new Date(Date.now() - 86400000);
    utimesSync(vieux, jadis, jadis);
    if (syntheseDuTour([ecrit]) !== renomme)
      echecs.push("28 : deux synthèses marquées coexistent et ce n'est pas la plus récemment modifiée qui est "
        + `retenue — le repli du 17/09 n'était garanti que par leur unicité, obtenu ${syntheseDuTour([ecrit])}`);

    // 29 — LA BORNE : un chemin écrit qui EXISTE n'ouvre aucune relecture. Sans elle, un tour qui a
    // écrit deux .md dans un dossier plein ferait juger un fichier qu'il n'a pas touché.
    const present = join(d, "Marque - Synthese Mandat - Presente - 20260917b.md");
    writeFileSync(present, "---\ndestinataire: humain\n---\n\n# Synthèse écrite par l'outil\n", "utf8");
    if (syntheseDuTour([present]) !== present)
      echecs.push(`29 : un chemin écrit et PRÉSENT n'est plus retenu — la relecture du disque déborde sur un fichier que le tour n'a pas touché, obtenu ${syntheseDuTour([present])}`);

    // 30 (TF-1187, 19/09) — UN FICHIER ÉCRIT DANS LE TOUR PRIME SUR UN FICHIER RELU DU DISQUE.
    // Le fait du 17/09 chez un produit : un chemin écrit avait disparu (renommé pour S42), ce qui a
    // ouvert la relecture du dossier ; la synthèse d'un tour ANTÉRIEUR, intacte sur le disque, a été
    // examinée AVANT la synthèse du tour, pourtant passée par l'outil d'écriture — et une
    // restitution PASS sur 51 règles a été refusée sur trois constats d'un texte étranger.
    // Le cas ne dépend pas des dates : la synthèse écrite est ici la plus ANCIENNE des deux, pour
    // qu'un simple tri par date de modification ne suffise pas à le rendre vert.
    const d30 = join(base, "ecrit-prime");
    mkdirSync(d30, { recursive: true });
    const disparu = join(d30, "Marque - Synthese Mandat - Un brouillon renomme depuis - 20260917r.md");
    const duTour = join(d30, "Marque - Synthese Mandat - Celle du tour - 20260917s.md");
    const anterieure = join(d30, "Marque - Synthese Mandat - Tour anterieur deja restitue - 20260917q.md");
    writeFileSync(duTour, "---\ndestinataire: humain\n---\n\n# Synthèse du tour\n", "utf8");
    writeFileSync(anterieure, "---\ndestinataire: humain\n---\n\n# Synthèse d'un tour antérieur\n", "utf8");
    const ilYATroisHeures = new Date(Date.now() - 3 * 3600000);
    utimesSync(duTour, ilYATroisHeures, ilYATroisHeures);
    if (syntheseDuTour([disparu, duTour]) !== duTour)
      echecs.push("30 : un fichier relu du disque est jugé à la place de la synthèse ÉCRITE dans le tour — "
        + `l'écran serait comparé à un texte étranger au message (TF-1187), obtenu ${syntheseDuTour([disparu, duTour])}`);
  }

  // 31 à 34 (TF-1081, 19/09) — LE SCEAU SE POSE SANS GESTE HUMAIN, ET IL RESTE OPPOSABLE.
  //
  // Les quatre cas se jouent sur UN SEUL fichier, dans l'ordre où la journée d'un mandat les
  // produit : dépôt, redépôt, retouche à la main, tour qui relit sans écrire. C'est cette suite
  // qui prouve l'invariant — le sceau porte l'état exact que l'oracle vient de juger, et il ne se
  // pose que sur le fichier écrit dans le tour.
  {
    const d31 = join(base, "sceau");
    mkdirSync(d31, { recursive: true });
    const JUGEUR = join(ICI, "..", "scripts", "verifier-jugement.mjs");
    const f31 = join(d31, "Marque - Synthese Mandat - Sceau pose sans geste - 20260919a.md");
    const corps = (reste) => `---\ndestinataire: humain\n---\n\n` + BON.replace(
      "- la propagation sur les postes qui ne relancent jamais bootstrap — motif : hors de portée de ce correctif, couvert par la garde d'ouverture.",
      `- ${reste} — motif : hors de portée de ce correctif, couvert par la garde d'ouverture.`);
    const tourEcrivant = (cible) => [
      { type: "user", message: { role: "user", content: "fais la mise à jour" } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name: "Write", input: { file_path: cible } }] } },
      { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: BON }] } },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n";
    const jouerHook = (nom, cible) => {
      const p = join(d31, nom + ".jsonl");
      writeFileSync(p, tourEcrivant(cible), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8",
        input: JSON.stringify({ session_id: "test-sceau", transcript_path: p, stop_hook_active: false }) });
      let d = null;
      try { d = JSON.parse(r.stdout || "null"); } catch { /* pas de JSON = laisse passer */ }
      return d;
    };
    const empreinteScellee = () => {
      try { return JSON.parse(readFileSync(f31 + ".jugement.json", "utf8")).empreinte; } catch { return null; }
    };
    const jugerDossier = () => spawnSync(process.execPath, [JUGEUR, d31], { encoding: "utf8" });

    // 31 — LE DÉPÔT. Le tour écrit la synthèse et rend PASS : le sceau naît de ce PASS, sans qu'un
    // humain ait rien tapé. C'est la moitié manquante de TF-0523 — la règle 5 était câblée en
    // DÉTECTION depuis le 23/08, et aucune synthèse n'était scellée, donc elle ne protégeait rien.
    writeFileSync(f31, corps("la propagation sur les postes qui ne relancent jamais bootstrap"), "utf8");
    const d31a = jouerHook("depot", f31);
    if (d31a !== null)
      echecs.push(`31 : un tour conforme déposant sa synthèse est refusé, obtenu ${JSON.stringify(d31a).slice(0, 200)}`);
    const sceau1 = empreinteScellee();
    if (!sceau1) echecs.push("31 : aucun sceau posé après le PASS sur la synthèse écrite dans le tour — le geste resterait "
      + "manuel, et la règle 5 continuerait de ne protéger aucune restitution (TF-1081)");

    // 32 — LE REDÉPÔT, ET C'EST LUI QUI ARBITRE LE CONFLIT AVEC J-1. La même synthèse, sous le même
    // indice, réécrite et rejugée dans la session : mesuré au journal de ce dépôt, 53 couples
    // (session, fichier) sur 238 sont dans ce cas — 22,3 %. Un sceau posé une fois pour toutes en
    // ferait autant d'écarts J-1 sur une pratique que le gabarit prescrit depuis la v2.25.0.
    writeFileSync(f31, corps("la propagation, et le poste hors ligne relevé au tour suivant"), "utf8");
    const d31b = jouerHook("redepot", f31);
    if (d31b !== null)
      echecs.push(`32 : le redépôt conforme de la même synthèse est refusé, obtenu ${JSON.stringify(d31b).slice(0, 200)}`);
    const sceau2 = empreinteScellee();
    if (!sceau2 || sceau2 === sceau1)
      echecs.push("32 : le sceau n'a pas suivi le redépôt jugé — la pratique licite du redépôt sous le même indice "
        + "(gabarit v2.25.0) deviendrait un écart J-1 sur un couple (session, fichier) sur cinq");
    if (jugerDossier().status !== 0)
      echecs.push(`32 : verifier-jugement accuse une synthèse redéposée ET rejugée : ${jugerDossier().stdout.slice(0, 220)}`);

    // 33 — LE SENS ROUGE. La synthèse est retouchée APRÈS son dernier jugement, sans repasser
    // devant l'oracle : c'est le défaut fondateur de TF-0523, le même nom pour deux contenus, et
    // il doit rester visible. Sans ce cas, l'automatisation du sceau serait indiscernable d'un
    // désarmement de J-1.
    writeFileSync(f31, corps("une ligne ajoutée à la main après la restitution"), "utf8");
    const r33 = jugerDossier();
    if (r33.status === 0 || !/J-1/.test(r33.stdout))
      echecs.push("33 : une synthèse modifiée APRÈS son dernier jugement passe — le sceau automatique aurait désarmé "
        + `J-1 au lieu de l'armer (TF-0523, TF-1081), obtenu ${r33.stdout.replace(/\s+/g, " ").slice(0, 200)}`);

    // 34 — LA BORNE, ET C'EST ELLE QUI FAIT TENIR LE 33. Un tour qui ne fait que RELIRE la
    // synthèse du disque — le repli de TF-1187, ouvert ici par un chemin écrit qui n'existe pas —
    // rend PASS sans rien avoir écrit. S'il rescellait, il blanchirait la retouche du cas 33 en
    // silence : le repli sert à choisir quoi COMPARER, il ne vaut pas jugement.
    const d31d = jouerHook("relu", join(d31, "Marque - Synthese Mandat - Chemin disparu - 20260919z.md"));
    if (d31d !== null)
      echecs.push(`34 : le tour relisant la synthèse du disque est refusé, obtenu ${JSON.stringify(d31d).slice(0, 200)}`);
    if (empreinteScellee() !== sceau2)
      echecs.push("34 : un tour qui n'a RIEN écrit a reposé le sceau — la retouche faite à la main serait blanchie par "
        + "une simple relecture, et J-1 ne verrait plus jamais rien (TF-1187, TF-1081)");
    const r34 = jugerDossier();
    if (r34.status === 0)
      echecs.push("34 : après le tour de relecture, verifier-jugement ne voit plus la retouche du cas 33");
  }

  // 35 — LA DEMANDE DE PROCÉDURE, RECONNUE SUR LA SOIRÉE RÉELLE (TF-1361). Les neuf messages de
  // l'annexe A du lot « Produit-02 - RETOURS - 20260922a », mot pour mot : les cinq demandes de
  // procédure sont reconnues, et aucun des quatre autres messages de la même soirée.
  for (const m of [
    "Détaille à partir de ma page Google Ads comment j'importe les campagnes pour les lancer.",
    "Fournis le descriptif pas à pas dans Google Ads sur le web pour poster les campagnes",
    "66a, 67 oublie le Google Ads local, on passe uniquement par le web, donne la procédure détaillée",
    "J'ai tout supprimé sur Google Ads local, est-ce que je peux maintenant avoir la procédure détaillée pour les campagnes sur le web ?",
    "Fournis les étapes pour la configuration de Google Ads sur le projet Google Cloud. Pourquoi est-ce que tu ne proposes pas d'office les étapes de configuration ?",
  ]) if (!demandeProcedure(m)) echecs.push(`35 : demande de procédure NON reconnue : « ${m.slice(0, 70)} »`);
  for (const m of [
    "Je ne comprends pas, il faut que je ferme Google Ads Web pour que tu puisses poster dessus ? C'est fermé.",
    "je n'ai pas de bouton prévisualiser, uniquement appliquer",
    "J'ai mis les modèles Google Ads et les retours d'erreurs dans le dossier. Adapte et corrige pour t'assurer que tout est ok au prochain import.",
    "ok, j'ai mis l'accès lecture, vérifie",
    "fais la mise à jour", "26a, 25a, 24b", "synchronise avec github",
  ]) if (demandeProcedure(m)) echecs.push(`35 bis : message pris à tort pour une demande de procédure : « ${m.slice(0, 70)} »`);

  // 36 — LE CONTRÔLE SEUL, DANS SES TROIS SENS : demande + S53 en échec → FAIL ; demande + S53
  // tenue → PASS ; aucune demande → hors contrôle, même avec S53 en échec (elle reste avertissante).
  {
    const demande = "Fournis le descriptif pas à pas dans Google Ads sur le web pour poster les campagnes";
    const s53 = [{ regle: "S53", statut: "FAIL", message: "1 action(s) manuelle_utilisateur visent l'interface de Google Ads" }];
    const a = controlerProcedure({ dernierHumain: demande, fails: s53 });
    if (a.verdict !== "FAIL") echecs.push(`36 : procédure demandée et guide absent → attendu FAIL, obtenu ${a.verdict}`);
    const b = controlerProcedure({ dernierHumain: demande, fails: [] });
    if (b.verdict !== "PASS") echecs.push(`36 bis : procédure demandée et guide servi → attendu PASS, obtenu ${b.verdict}`);
    const c = controlerProcedure({ dernierHumain: "fais la mise à jour", fails: s53 });
    if (c.applicable) echecs.push("36 ter : un message qui ne demande aucune procédure rend S53 bloquante");
  }

  // 37 — DE BOUT EN BOUT, PAR LE HOOK. Le message final est la restitution BON plus UNE action
  // d'import dans l'écran de Google Ads : sans guide, il est refusé quand le dernier message humain
  // demande la procédure (rouge) ; le MÊME message, avec sa source datée et un guide en tête, passe
  // (vert) ; le rouge, sous un message humain qui ne demande rien, n'est qu'averti (borne).
  {
    const ACTION_ADS = "- **A-3** — manuelle_utilisateur : neuve — importer les campagnes dans Google Ads : écran « Importations », "
      + "bouton « Aperçu » puis « Appliquer », sur `https://ads.google.com`.\n"
      + "  - pourquoi pas l'IA : acces — import TENTÉ le 22/09 par l'API de la plateforme avec l'identité de la session, `HTTP 403 PERMISSION_DENIED` ; seul le titulaire du compte y est connecté.\n"
      + "  - si rien n'est fait : les campagnes ne sont pas publiées.\n";
    const GUIDE = "## Guide — importer les campagnes dans Google Ads\n\n"
      + "Source : `support.google.com/google-ads`, lue le 27/09/2026.\n\n"
      + "1. Ouvrir l'écran des importations.\n"
      + "   - Ouvrez Outils.\n"
      + "   - Cliquez sur Actions groupées.\n"
      + "   - Cliquez sur Importations.\n"
      + "   - Résultat attendu : la liste des importations passées.\n"
      + "2. Lancer l'aperçu.\n"
      + "   - Déposez le fichier.\n"
      + "   - Cliquez sur « Aperçu ».\n"
      + "   - Résultat attendu : les modifications acceptées, et zéro erreur.\n"
      + "3. Appliquer.\n"
      + "   - Cliquez sur « Appliquer ».\n"
      + "   - Résultat attendu : l'importation marquée terminée.\n\n"
      + "## 0. Synthèse d'ouverture\n\n";
    const rougeTexte = BON + ACTION_ADS;
    const verteTexte = GUIDE + BON + ACTION_ADS + "  - source : `support.google.com/google-ads`, lue le 27/09/2026.\n";
    const tourAvec = (humain, texteFinal) => [
      { type: "user", message: { role: "user", content: humain } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name: "Write", input: {} }, { type: "tool_use", name: "Bash", input: {} }] } },
      { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: texteFinal }] } },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n";
    const jouer = (nom, humain, texteFinal) => {
      const p = join(base, nom + ".jsonl");
      writeFileSync(p, tourAvec(humain, texteFinal), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8",
        input: JSON.stringify({ session_id: "test-procedure", transcript_path: p, stop_hook_active: false }) });
      try { return JSON.parse(r.stdout || "null"); } catch { return null; }
    };
    // Le rouge n'est rouge que par S52 et S53 : sans cette garde, un autre défaut de forme ferait le
    // travail et la recette prouverait autre chose que ce qu'elle dit.
    const fr = join(base, "procedure-rouge.md"); writeFileSync(fr, rougeTexte, "utf8");
    const or = spawnSync(process.execPath, [ORACLE, fr], { encoding: "utf8" });
    const autres = (JSON.parse(or.stdout || "{}").findings || []).filter((f) => f.statut === "FAIL" && !["S52", "S53"].includes(f.regle));
    if (autres.length) echecs.push(`37 : le texte rouge échoue aussi sur ${autres.map((f) => f.regle).join(", ")} — le rouge ne prouverait pas la procédure`);
    const fv = join(base, "procedure-verte.md"); writeFileSync(fv, verteTexte, "utf8");
    const ov = spawnSync(process.execPath, [ORACLE, fv], { encoding: "utf8" });
    if (ov.status !== 0) echecs.push(`37 bis : le texte guidé et sourcé n'est pas PASS pour oracle-synthese : ${(ov.stdout.match(/"regle": "(S\d+)",\s*"statut": "FAIL"/g) || []).join(" ")}`);
    const demande = "Fournis le descriptif pas à pas dans Google Ads sur le web pour poster les campagnes";
    // T2 (TF-1947, 26/10/2026) : PROCÉDURE AVERTIT, il ne refuse plus. Adapté : le cas attendait un refus PROCÉDURE ; il attend
    // désormais l'avertissement PROCÉDURE sous la réponse, et le sens contraire (37 quinquies) qu'aucune PROCÉDURE ne soit dite.
    const d37 = jouer("procedure-rouge", demande, rougeTexte);
    if (d37?.decision === "block" || !/PROCÉDURE — procédure demandée/.test(String(d37?.systemMessage || "")))
      echecs.push(`37 ter : procédure demandée, gestes en lignes d'action sans guide → attendu l'avertissement PROCÉDURE sans refus (T2), obtenu ${JSON.stringify(d37).slice(0, 220)}`);
    const d37v = jouer("procedure-verte", demande, verteTexte);
    if (d37v !== null) echecs.push(`37 quater : procédure demandée et guide servi en tête → attendu laisser passer, obtenu ${JSON.stringify(d37v).slice(0, 220)}`);
    const d37b = jouer("procedure-borne", "fais la mise à jour", rougeTexte);
    if (d37b?.decision === "block" || /PROCÉDURE — /.test(String(d37b?.systemMessage || "")))
      echecs.push(`37 quinquies : aucune procédure demandée → ni refus ni avertissement PROCÉDURE (S53 seule, avertissante), obtenu : ${JSON.stringify(d37b).slice(0, 200)}`);
  }

  // ── TF-1228 : le RAPPEL ne doit JAMAIS citer une version du gabarit différente de la sienne ──
  // Le 14/09, deux commits ont fait passer gabarits\RESTITUTION.md de 2.21.0 à 2.23.0 sans que le
  // RAPPEL affiché par ce hook ne bouge : l'agent a lu une version périmée de la consigne au moment
  // précis où il devait se corriger (rattrapé en 92349b13, trois versions plus tard). Rien ne
  // comparait les deux numéros — ce cas le fait, sur les fichiers RÉELS du dépôt.
  {
    const gabaritTexte = readFileSync(join(ICI, "..", "gabarits", "RESTITUTION.md"), "utf8");
    const versionGabarit = (gabaritTexte.match(/\*\*version (\d+\.\d+\.\d+),/) || [])[1];
    const hookTexte = readFileSync(HOOK, "utf8");
    const versionRappel = (hookTexte.match(/gabarits\\+RESTITUTION\.md \(v(\d+\.\d+\.\d+)\)/) || [])[1];
    if (!versionGabarit) echecs.push("42 : le numéro de version en tête de gabarits\\RESTITUTION.md n'est plus reconnu — la recette ne peut plus comparer");
    if (!versionRappel) echecs.push("42 : le RAPPEL de hook-restitution.mjs ne cite plus de version entre parenthèses après gabarits\\RESTITUTION.md");
    if (versionGabarit && versionRappel && versionGabarit !== versionRappel)
      echecs.push(`42 : le RAPPEL cite la v${versionRappel}, le gabarit est en v${versionGabarit} — relire gabarits\\RESTITUTION.md en tête et mettre à jour la ligne RAPPEL de hook-restitution.mjs`);
  }
  // ── 43 : `--pre-vol`, l'option que references\NIVEAUX.md prescrit, est JOUÉE dans ses deux sens ──
  // Le 12/10/2026, oracle-chemin-prescrit (CP3) l'a trouvée prescrite et jouée par aucun cas : le
  // producteur était le premier à l'essayer. Simple court → exit 0 ; texte long sans restitution → exit 1 ;
  // forme Moyen tenue → exit 0 ; réponse Moyen au-delà de 150 mots → exit 1, l'écart nommé.
  {
    // TF-1947 (26/10/2026) : sans l'identifiant de la session qui joue la recette — le pré-vol relit désormais la transcription
    // de la session pour savoir si le tour a écrit, et celle de la recette n'est pas celle de ce cas (cas 57 pour ce volet).
    const preVol = (texte) => {
      const r = spawnSync(process.execPath, [HOOK, "--pre-vol"], { encoding: "utf8", input: texte, env: ENV_SANS_SESSION });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
      return { code: r.status, o };
    };
    const simple = preVol("Niveau : Simple\n\nOui, le fichier existe.\n\nSource : `README.md:1`.\n");
    if (simple.code !== 0 || simple.o?.rendable_sans_restitution !== true)
      echecs.push(`43 : réponse Simple courte → attendu exit 0 et rendable, obtenu ${simple.code} ${JSON.stringify(simple.o).slice(0, 160)}`);
    const long = preVol(Array.from({ length: 220 }, (_, i) => `mot${i}`).join(" ") + ".\n");
    if (long.code !== 1) echecs.push(`43 : texte de 220 mots sans restitution → attendu exit 1, obtenu ${long.code}`);
    const pieces = (reponse) => `Niveau : Moyen\n\n**La réponse.** ${reponse}\n\n**Preuves.**\n- \`git log -1\` rend le commit.\n- \`README.md:1\` porte le titre.\n- \`node -v\` rend la version.\n\n**Non vérifié.** Rien.\n\n**Décision attendue.** Aucune.\n`;
    const moyen = preVol(pieces("Oui, le dépôt est à jour."));
    if (moyen.code !== 0 || moyen.o?.niveau !== "Moyen")
      echecs.push(`43 : forme Moyen tenue → attendu exit 0, obtenu ${moyen.code} ${JSON.stringify(moyen.o).slice(0, 200)}`);
    const trop = preVol(pieces("Oui, " + Array.from({ length: 160 }, (_, i) => `mot${i}`).join(" ") + "."));
    if (trop.code !== 1 || !(trop.o?.ecarts || []).some((e) => /au-delà des 150/.test(e)))
      echecs.push(`43 : réponse Moyen de 161 mots → attendu exit 1 et l'écart des 150 mots, obtenu ${trop.code} ${JSON.stringify(trop.o).slice(0, 200)}`);
  }
  // 44 — TF-1514 : « SEUL L'HUMAIN LA DÉTIENT », LU CONTRE LA CONVERSATION, DANS SES QUATRE SENS. La
  // réponse du 01/10/2026 (« le jeton n'est qu'en votre possession ») sous un message humain qui portait
  // le jeton → FAIL, la valeur jamais recopiée ; la MÊME réponse sans aucune valeur de forme secrète dans
  // la conversation → PASS ; une réponse qui ne dit rien de tel → hors contrôle ; un chemin ou un sha
  // dans un message humain n'est pas une valeur secrète. Et le transcript rend bien TOUS les messages humains.
  {
    const JETON = "pk.eyJ1IjoiZXhlbXBsZSIsImEiOiJjbDAwMDAwMDAifQ.Zz9fake0000";
    const REPONSE = "A-4 — déposer le jeton dans la variable secrète du pipeline (manuelle_utilisateur) — le jeton n'est qu'en votre possession.";
    const a = controlerPossession({ textesHumains: ["voici le jeton : " + JETON, "dépose-le"], dernierTexte: REPONSE });
    if (a.verdict !== "FAIL" || a.ecarts.some((e) => e.includes(JETON)) || !a.ecarts.some((e) => /pk\.ey…/.test(e)))
      echecs.push(`44 : jeton fourni dans la conversation et « qu'en votre possession » → attendu FAIL sans la valeur, obtenu ${a.verdict} ${a.ecarts.join(" ").slice(0, 160)}`);
    const b = controlerPossession({ textesHumains: ["dépose le jeton mapbox dans le pipeline"], dernierTexte: REPONSE });
    if (b.verdict !== "PASS") echecs.push(`44 bis : aucune valeur dans la conversation → attendu PASS, obtenu ${b.verdict}`);
    const c = controlerPossession({ textesHumains: ["voici le jeton : " + JETON], dernierTexte: "Le jeton est déposé, `HTTP 200`." });
    if (c.applicable) echecs.push("44 ter : une réponse qui ne déclare aucune possession exclusive est contrôlée");
    const d = controlerPossession({ textesHumains: ["regarde output/04-plans/Digit-AI-Synthese-20261013a.md et le commit 0123456789abcdef0123456789abcdef01234567, C:\\dev\\digit-ai-factory\\todo\\TODO-20261013.jsonl"], dernierTexte: REPONSE });
    if (d.verdict !== "PASS") echecs.push(`44 quater : un chemin ou un sha pris pour une valeur secrète : ${d.ecarts.join(" ").slice(0, 200)}`);
    const tr = [
      { type: "user", message: { content: "premier message humain" } },
      { type: "assistant", message: { content: [{ type: "text", text: "réponse" }] } },
      { type: "user", message: { content: "second message humain" } },
    ].map((e) => JSON.stringify(e)).join("\n");
    const an = analyserTranscript(tr);
    if ((an.textesHumains || []).length !== 2) echecs.push(`44 quinquies : le transcript devait rendre 2 messages humains, obtenu ${(an.textesHumains || []).length}`);
  }
  // 45 — TF-1644 : S48 JUGÉE AU HOOK, CHEZ UN PRODUIT, DANS SES DEUX SENS. Le hook écrivait le message
  // dans un fichier temporaire, d'où S48 rendait SANS_OBJET à chaque tour : le FAIL du 12/10 n'a été vu
  // ni par la session ni par le porteur. Un tour de travail dans un produit (dossier courant portant
  // `forge\retours\`) dont la restitution conforme ne dit rien de sa remontée → BLOQUÉ, S48 nommée ; la
  // MÊME restitution portant « Remontée à la factory : rien à remonter. » → laissée passer.
  {
    const produit = join(base, "produit-45");
    mkdirSync(join(produit, "forge", "retours"), { recursive: true });
    // TF-1849 : la D-1 de BON est inscrite au registre de ce produit (entrée question_humain), comme la règle l'exige d'un produit
    // qui affiche une D-N nouvelle — sans quoi le hook l'avertit (RÉSERVATION) et « laisser passer » n'est plus silencieux.
    writeFileSync(join(produit, "forge", "ledger.jsonl"), [
      { seq: 1, ts: "2026-10-14T10:00:00Z", type: "run_open", run_id: "essai-45" },
      { seq: 2, ts: "2026-10-14T10:00:01Z", type: "question_humain", decision: "D-1", question: "Publier maintenant la version corrigée du démarrage, ou attendre demain matin ?" },
    ].map((x) => JSON.stringify(x)).join("\n") + "\n", "utf8");
    const jouer45 = (nom, texte) => {
      const p = join(base, nom + ".jsonl");
      writeFileSync(p, transcript(texte, ["Write", "Edit"]), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: produit,
        input: JSON.stringify({ session_id: "test", transcript_path: p, stop_hook_active: false, cwd: produit }) });
      let d = null; try { d = JSON.parse(r.stdout || "null"); } catch { /* laisse passer */ }
      return d;
    };
    // T2 (TF-1947, 26/10/2026) : S48 AVERTIT, elle ne refuse plus. Adapté : le cas attendait un refus nommant S48 ; il attend
    // désormais l'avertissement S48 sous la réponse — la règle reste JUGÉE au hook chez un produit (TF-1644), seule sa sévérité change.
    const muet = jouer45("s48-muet-produit", BON);
    if (muet?.decision === "block" || !/S48 — /.test(muet?.systemMessage || ""))
      echecs.push(`45 : chez un produit, une restitution muette sur sa remontée → attendu l'avertissement S48 sans refus (T2), obtenu ${JSON.stringify(muet).slice(0, 200)}`);
    const rien = jouer45("s48-rien-produit", BON + "\n- Remontée à la factory : rien à remonter.\n");
    if (rien !== null)
      echecs.push(`45 bis : la MÊME restitution qui déclare « rien à remonter » → attendu laisser passer, obtenu ${JSON.stringify(rien).slice(0, 200)}`);
  }
  // 46 — TF-1647 et TF-1666 : LE PRÉJUGEMENT, DANS SES QUATRE SENS. (a) `--prejuger` sur le texte que le
  // hook refuse (cas 1) rend exit 1 et nomme S1 ; sur le texte que le hook laisse passer (cas 3) exit 0 :
  // même verdict bloquant que le hook, avant l'affichage. (b) Un refus d'un tour SANS préjugement dit le
  // défaut distinct « PRÉJUGEMENT » ; le MÊME refus dans un tour qui a joué `--prejuger` ne le dit pas,
  // et le journal porte `prejuge` dans les deux sens.
  {
    const prejuger = (nom, texte) => {
      const f = join(base, nom + ".md"); writeFileSync(f, texte, "utf8");
      // Sans l'identifiant de la session qui joue la recette : depuis TF-1720, --prejuger relit le
      // transcript de la session courante, qui n'est pas celui de ce cas (cas 49 pour ce volet).
      const r = spawnSync(process.execPath, [HOOK, "--prejuger", f], { encoding: "utf8", env: ENV_SANS_SESSION });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
      return { code: r.status, o };
    };
    const pm = prejuger("brouillon-mauvais", MAUVAIS);
    if (pm.code !== 1 || pm.o?.affichable !== false || !(pm.o?.bloquants || []).some((b) => /^S1 /.test(b)))
      echecs.push(`46 : --prejuger sur un texte que le hook refuse → attendu exit 1 et S1 nommée, obtenu ${pm.code} ${JSON.stringify(pm.o).slice(0, 200)}`);
    const pb = prejuger("brouillon-bon", BON);
    if (pb.code !== 0 || pb.o?.affichable !== true)
      echecs.push(`46 bis : --prejuger sur un texte que le hook laisse passer → attendu exit 0, obtenu ${pb.code} ${JSON.stringify(pb.o).slice(0, 200)}`);
    const tourAvec = (commande) => [
      { type: "user", message: { role: "user", content: "fais la mise à jour" } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name: "Write", input: { file_path: "C:/tmp/x.txt" } },
        { type: "tool_use", name: "Bash", input: { command: commande } }] } },
      { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: MAUVAIS }] } },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n";
    const jouer46 = (nom, commande) => {
      const p = join(base, nom + ".jsonl"); writeFileSync(p, tourAvec(commande), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ session_id: "test-46", transcript_path: p, stop_hook_active: false }) });
      let d = null; try { d = JSON.parse(r.stdout || "null"); } catch { /* laisse passer */ }
      return d;
    };
    const sans = jouer46("sans-prejugement", "git status");
    if (sans?.decision !== "block" || !/PRÉJUGEMENT/.test(sans.reason || ""))
      echecs.push(`46 ter : refus d'un tour sans préjugement → attendu le défaut distinct PRÉJUGEMENT, obtenu ${JSON.stringify(sans).slice(0, 200)}`);
    const avec = jouer46("avec-prejugement", "node oracles/hook-restitution.mjs --prejuger C:/tmp/brouillon.md");
    if (avec?.decision !== "block" || /PRÉJUGEMENT/.test(avec.reason || ""))
      echecs.push(`46 quater : refus d'un tour qui a préjugé → attendu block SANS le défaut PRÉJUGEMENT, obtenu ${JSON.stringify(avec).slice(0, 200)}`);
    const an1 = analyserTranscript(tourAvec("git status")), an2 = analyserTranscript(tourAvec("node forge/hooks/factory.mjs restitution --prejuger b.md"));
    if (an1.prejuge !== false || an2.prejuge !== true)
      echecs.push(`46 quinquies : le champ prejuge du journal devait valoir false puis true, obtenu ${an1.prejuge} ${an2.prejuge}`);
  }
  // 47 — TF-1649 : LE MESSAGE D'ATTENTE D'UNE TÂCHE D'ARRIÈRE-PLAN, DANS SES QUATRE SENS. Un tour qui a
  // écrit, lancé une recette en arrière-plan non revenue, et rend 2 lignes d'attente → NON jugé ; le
  // MÊME texte sans tâche lancée → jugé (bloqué) ; la MÊME tâche dont la notification de fin est au
  // transcript → jugé ; la MÊME attente qui porte un verdict → jugé.
  {
    const ATTENTE_TXT = "La recette complète tourne en arrière-plan, environ 10 minutes.\nJe reprends la restitution dès son résultat.";
    const tour47 = (texte, { lancee = true, revenue = false } = {}) => [
      { type: "user", message: { role: "user", content: "corrige et rejoue la recette" } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", id: "t1", name: "Edit", input: { file_path: "C:/tmp/a.mjs" } },
        { type: "tool_use", id: "t2", name: "Bash", input: { command: "node oracles/self-tests.mjs", run_in_background: true } }] } },
      { type: "user", message: { role: "user", content: [{ type: "tool_result", tool_use_id: "t1", content: "ok" },
        { type: "tool_result", tool_use_id: "t2", content: lancee ? "Command running in background with ID: b47xyz. Output is being written to: C:/tmp/b47xyz.output" : "ok" }] } },
      ...(revenue ? [{ type: "queue-operation", operation: "enqueue", content: "<task-notification>\n<task-id>b47xyz</task-id>\n<status>completed</status>\n</task-notification>" }] : []),
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: texte }] } },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n";
    const jouer47 = (nom, texte, o) => {
      const p = join(base, nom + ".jsonl"); writeFileSync(p, tour47(texte, o), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ session_id: "test-47", transcript_path: p, stop_hook_active: false }) });
      let d = null; try { d = JSON.parse(r.stdout || "null"); } catch { /* laisse passer */ }
      return d;
    };
    const a = jouer47("attente-en-cours", ATTENTE_TXT);
    if (a !== null) echecs.push(`47 : message d'attente pendant une tâche d'arrière-plan non revenue → attendu non jugé, obtenu ${JSON.stringify(a).slice(0, 200)}`);
    const b = jouer47("attente-sans-tache", ATTENTE_TXT, { lancee: false });
    if (b?.decision !== "block") echecs.push(`47 bis : le MÊME texte sans tâche d'arrière-plan → attendu jugé et bloqué, obtenu ${JSON.stringify(b).slice(0, 160)}`);
    const c = jouer47("attente-tache-revenue", ATTENTE_TXT, { revenue: true });
    if (c?.decision !== "block") echecs.push(`47 ter : la tâche est REVENUE, l'attente n'a plus d'objet → attendu jugé et bloqué, obtenu ${JSON.stringify(c).slice(0, 160)}`);
    const d = jouer47("attente-verdict", "La recette tourne en arrière-plan ; le premier lot est PASS.\nJe reprends dès son résultat.");
    if (d?.decision !== "block") echecs.push(`47 quater : une attente qui porte un verdict → attendu jugée et bloquée, obtenu ${JSON.stringify(d).slice(0, 160)}`);
  }
  // 48 — TF-1641 : UNE EXPLICATION DEMANDÉE SE LIVRE DANS UNE FICHE, DANS SES QUATRE SENS. « Explique
  // les différentes pipelines » rendu en restitution complète sans fiche → FAIL (avertissement) ; le
  // MÊME tour qui écrit sa fiche → PASS ; la MÊME restitution qui cite sa fiche → PASS ; une demande de
  // travail (« fais la mise à jour ») → hors contrôle. Et le hook le dit sans bloquer.
  {
    const DEMANDE = "Explique les différentes pipelines et ce qui est encore utile";
    const FICHE = "output/Client-A - Fiche Pipelines constat et precos - 20261014a.md";
    const a = controlerExplication({ dernierHumain: DEMANDE, dernierTexte: BON, fichiersMd: [] });
    if (a.verdict !== "FAIL") echecs.push(`48 : explication demandée rendue sans fiche → attendu FAIL, obtenu ${a.verdict}`);
    const b = controlerExplication({ dernierHumain: DEMANDE, dernierTexte: BON, fichiersMd: ["C:/p/" + FICHE, "C:/p/output/Client-A - Note Synthese Run - 20261014a.md"] });
    if (b.verdict !== "PASS") echecs.push(`48 bis : la fiche écrite dans le tour → attendu PASS, obtenu ${b.verdict}`);
    const c = controlerExplication({ dernierHumain: DEMANDE, dernierTexte: BON.replace("## 4. Traité\n", `## 4. Traité\n- fiche livrée : \`${FICHE}\` — preuve : 612 mots.\n`), fichiersMd: [] });
    if (c.verdict !== "PASS") echecs.push(`48 ter : la restitution qui cite sa fiche → attendu PASS, obtenu ${c.verdict}`);
    const d = controlerExplication({ dernierHumain: "fais la mise à jour", dernierTexte: BON, fichiersMd: [] });
    if (d.applicable) echecs.push("48 quater : une demande de travail est lue comme une demande d'explication");
    const tour48 = [
      { type: "user", message: { role: "user", content: DEMANDE } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name: "Write", input: { file_path: "C:/tmp/notes.txt" } }] } },
      { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: BON }] } },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n";
    const p = join(base, "explication-sans-fiche.jsonl"); writeFileSync(p, tour48, "utf8");
    const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ session_id: "test-48", transcript_path: p, stop_hook_active: false }) });
    let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
    if (o?.decision === "block" || !/EXPLICATION/.test(o?.systemMessage || ""))
      echecs.push(`48 quinquies : le hook doit DIRE l'avertissement EXPLICATION sans bloquer, obtenu ${JSON.stringify(o).slice(0, 200)}`);
  }
  // 49 — TF-1720 : LE FICHIER JUGÉ ET LE PRÉJUGEMENT, DANS LEURS CINQ SENS. Le cas du 14/10 chez un
  // produit : le tour écrit un document de projet marqué par son gabarit (`docs\projet\COMPOSANTS-OPS.md`)
  // et aucune synthèse nommée ; le hook comparait l'écran à ce document et refusait une restitution
  // conforme (« options par défaut nommées : 0 dans le fichier jugé, 1 à l'écran »). (a) Le hook de fin
  // de tour laisse passer. (b) Une synthèse NOMMÉE déposée dans le tour reste comparée : l'écran qui
  // perd sa ligne de repli est refusé sur AFFICHAGE. (c) `--prejuger` sur le MÊME brouillon, avec le
  // transcript, rend le même refus avant l'affichage ; (d) le brouillon identique à la synthèse passe ;
  // (e) sans transcript retrouvé, la comparaison n'est pas jouée et la sortie le dit, sans refus.
  {
    const MARQUEE = (t) => "---\ndestinataire: humain\n---\n\n" + t;
    const DOC_PROJET = MARQUEE("# Composants d'exploitation\n\nLe service tourne sur deux réplicas.\n");
    const SANS_REPLI = BON.replace("  - si rien n'est décidé : (a) s'applique.\n", "");
    const dossier49 = join(base, "produit-49");
    mkdirSync(join(dossier49, "docs", "projet"), { recursive: true });
    mkdirSync(join(dossier49, "output"), { recursive: true });
    const composants49 = join(dossier49, "docs", "projet", "COMPOSANTS-OPS.md");
    const synthese49 = join(dossier49, "output", "Produit - Note Synthese Run - 20261015a.md");
    writeFileSync(composants49, DOC_PROJET, "utf8");
    writeFileSync(synthese49, MARQUEE(BON), "utf8");
    const tour49 = (ecrits, texteFinal) => [
      { type: "user", message: { role: "user", content: "rédige la fiche des composants et clos le run" } },
      { type: "assistant", message: { role: "assistant", content: ecrits.map((p) => ({ type: "tool_use", name: "Write", input: { file_path: p } })) } },
      { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: texteFinal }] } },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n";
    const hook49 = (nom, ecrits, texteFinal) => {
      const p = join(base, nom + ".jsonl"); writeFileSync(p, tour49(ecrits, texteFinal), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", env: ENV_SANS_SESSION,
        input: JSON.stringify({ session_id: "test-49", transcript_path: p, stop_hook_active: false }) });
      let d = null; try { d = JSON.parse(r.stdout || "null"); } catch { /* laisse passer */ }
      return { d, p };
    };
    const prejuger49 = (nom, texte, transcript) => {
      const f = join(base, nom + ".md"); writeFileSync(f, texte, "utf8");
      const args = [HOOK, "--prejuger", f, ...(transcript ? ["--transcript", transcript] : [])];
      const r = spawnSync(process.execPath, args, { encoding: "utf8", env: ENV_SANS_SESSION });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
      return { code: r.status, o };
    };
    const a = hook49("doc-projet-seul", [composants49], BON);
    if (a.d?.decision === "block")
      echecs.push(`49 : un document de projet marqué par son gabarit est jugé à la place de la restitution → attendu laisser passer, obtenu ${JSON.stringify(a.d).slice(0, 200)}`);
    const b = hook49("synthese-nommee", [composants49, synthese49], SANS_REPLI);
    if (b.d?.decision !== "block" || !/AFFICHAGE/.test(b.d.reason || ""))
      echecs.push(`49 bis : une synthèse nommée déposée et un écran qui perd sa ligne de repli → attendu block AFFICHAGE, obtenu ${JSON.stringify(b.d).slice(0, 200)}`);
    const c = prejuger49("brouillon-49-sans-repli", SANS_REPLI, b.p);
    if (c.code !== 1 || c.o?.synthese_deposee !== synthese49 || !(c.o?.bloquants || []).some((x) => /^AFFICHAGE/.test(x)))
      echecs.push(`49 ter : --prejuger avec le transcript doit rendre le refus AFFICHAGE du hook, avant l'affichage ; obtenu ${c.code} ${JSON.stringify(c.o).slice(0, 240)}`);
    const d = prejuger49("brouillon-49-identique", BON, b.p);
    if (d.code !== 0 || d.o?.affichage !== "PASS")
      echecs.push(`49 quater : le brouillon qui reprend la synthèse déposée → attendu exit 0 et affichage PASS, obtenu ${d.code} ${JSON.stringify(d.o).slice(0, 200)}`);
    const e = prejuger49("brouillon-49-sans-transcript", SANS_REPLI, null);
    if (e.code !== 0 || !/non joué/.test(e.o?.affichage || ""))
      echecs.push(`49 quinquies : sans transcript retrouvé, la comparaison n'est pas jouée et la sortie le dit → attendu exit 0 et « non joué », obtenu ${e.code} ${JSON.stringify(e.o).slice(0, 200)}`);
  }
  // 50 — TF-1847 (18/10/2026) : E-11 SUR LE MARKDOWN, S80 BLOQUANTE, dans ses quatre sens. (a) Une restitution
  // conforme dont le bloc 4 énumère « 1) … 2) … 3) » sur une ligne est REFUSÉE par `--prejuger` (exit 1) et par le
  // hook de fin de tour, S80 nommée ; c'est le retour du 17/10/2026, jugé affichable jusque-là. (b) La MÊME
  // information en liste (une ligne par élément) est affichable : le remède du message PASSE. (c) La forme montrée
  // entre guillemets français n'est pas commise. (d) Le guide en paragraphe n'est qu'AVERTI (S81), jamais refusé.
  {
    const EN_LIGNE = BON.replace("- bootstrap v2 livré — preuve : bootstrap.test.mjs 7/7, recette 22/22.",
      "- bootstrap v2 livré en trois temps : 1) écriture ; 2) recette ; 3) enregistrement — preuve : bootstrap.test.mjs 7/7, recette 22/22.");
    const EN_LISTE = BON.replace("- bootstrap v2 livré — preuve : bootstrap.test.mjs 7/7, recette 22/22.",
      "- bootstrap v2 livré en trois temps — preuve : bootstrap.test.mjs 7/7, recette 22/22.\n  1. Écriture.\n  2. Recette.\n  3. Enregistrement.");
    const CITEE = BON.replace("- bootstrap v2 livré — preuve : bootstrap.test.mjs 7/7, recette 22/22.",
      "- bootstrap v2 livré ; l'ancien gabarit écrivait « 1) écriture ; 2) recette ; 3) enregistrement » sur une ligne — preuve : bootstrap.test.mjs 7/7, recette 22/22.");
    const GUIDE_PARAGRAPHE = "## Guide — connecter le compte\n\nSource : `docs.exemple.org`, lue le 17/10/2026.\n\n"
      + "1. Ouvrez la console, choisissez le projet, cliquez sur « Activer ». Résultat attendu : l'API est active.\n\n## 0. Synthèse d'ouverture\n\n";
    const prejuger50 = (nom, texte) => {
      const fichier = join(base, nom + ".md"); writeFileSync(fichier, texte, "utf8");
      const r = spawnSync(process.execPath, [HOOK, "--prejuger", fichier], { encoding: "utf8", env: ENV_SANS_SESSION });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
      return { code: r.status, o };
    };
    const hook50 = (nom, texteFinal) => {
      const p = join(base, nom + ".jsonl");
      writeFileSync(p, [
        { type: "user", message: { role: "user", content: "corrige le script" } },
        { type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name: "Write", input: { file_path: "x.mjs" } }] } },
        { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
        { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: texteFinal }] } },
      ].map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", env: ENV_SANS_SESSION,
        input: JSON.stringify({ session_id: "test-50", transcript_path: p, stop_hook_active: false }) });
      let d = null; try { d = JSON.parse(r.stdout || "null"); } catch { /* laisse passer */ }
      return d;
    };
    if (EN_LIGNE === BON || EN_LISTE === BON || CITEE === BON) echecs.push("50 : une fixture n'a pas été modifiée — le cas ne prouve plus rien");
    // T2 (TF-1947, 26/10/2026) : S80 AVERTIT, elle ne refuse plus. Adapté : 50 et 50 bis attendaient un refus ; ils attendent
    // désormais l'avertissement S80 (préjugement affichable, S80 dite ; hook sans refus, S80 dite sous la réponse) ; 50 ter garde
    // le sens contraire : la MÊME information en liste n'est pas même avertie.
    const a = prejuger50("brouillon-50-en-ligne", EN_LIGNE);
    if (a.code !== 0 || (a.o?.bloquants || []).some((x) => /^S80\b/.test(x)) || !(a.o?.avertissements || []).includes("S80"))
      echecs.push(`50 : « 1) … 2) … 3) » sur une ligne du bloc 4 → attendu --prejuger exit 0 et S80 avertie (T2), obtenu ${a.code} ${JSON.stringify(a.o).slice(0, 240)}`);
    const h = hook50("tour-50-en-ligne", EN_LIGNE);
    if (h?.decision === "block" || !/S80 — /.test(h?.systemMessage || ""))
      echecs.push(`50 bis : le hook de fin de tour doit DIRE l'énumération en ligne en nommant S80, sans refus (T2), obtenu ${JSON.stringify(h).slice(0, 240)}`);
    const b = prejuger50("brouillon-50-en-liste", EN_LISTE);
    if (b.code !== 0 || b.o?.affichable !== true || (b.o?.avertissements || []).includes("S80"))
      echecs.push(`50 ter : la MÊME information en liste doit être affichable sans avertissement S80 (le remède du message), obtenu ${b.code} ${JSON.stringify(b.o).slice(0, 240)}`);
    const c = prejuger50("brouillon-50-citee", CITEE);
    if (c.code !== 0)
      echecs.push(`50 quater : la forme interdite montrée entre guillemets français ne doit pas être refusée, obtenu ${c.code} ${JSON.stringify(c.o).slice(0, 240)}`);
    const d = prejuger50("brouillon-50-guide-paragraphe", GUIDE_PARAGRAPHE + BON);
    if ((d.o?.bloquants || []).some((x) => /^S81\b/.test(x)) || !(d.o?.avertissements || []).includes("S81"))
      echecs.push(`50 quinquies : un guide dont l'étape enchaîne trois gestes doit être AVERTI par S81 sans être bloqué, obtenu ${d.code} ${JSON.stringify(d.o).slice(0, 240)}`);
  }
  // 51 — TF-1851 (18/10/2026) : UNE DEMANDE DE DÉTAIL L'EMPORTE SUR LE RAPPEL D'UNE LIGNE (S4), DANS SES SENS.
  // (a) La reconnaissance du message humain : « 51 détaille », « détaille D-51 », « détaille la 51 », « détaille la
  // décision 51 », « 51 et 52 détaillez », « le détail de la 51 » sont lus ; « détaille » sans numéro, « TF-1851
  // détaille », « étape 3 détaille », « un détail de 3 lignes », « ne détaille pas la 51 » et « merci » ne le sont pas.
  // (b) Le contrôle, sur le cas du 16/10 : D-51 posée au tour d'avant, le message « 51 détaille », puis la réponse
  // — rappel d'une ligne FAIL en le disant, décision absente FAIL, reposée sans options FAIL, reposée en entier PASS,
  // remplacée par des décisions détaillées qui la citent PASS ; D-51 inconnue de la conversation SANS_OBJET.
  // (c) De bout en bout par le hook de fin de tour : la restitution conforme qui rappelle D-51 en une ligne est
  // REFUSÉE (DÉTAIL nommé), la MÊME avec D-51 reposée en entier est acceptée, la MÊME sous un message qui ne demande
  // rien n'est pas refusée. (d) `--prejuger` avec le transcript rend le même refus avant l'affichage.
  {
    const demande = (m) => demandesDetail(m).join(",");
    for (const m of ["51 détaille", "détaille D-51", "détaille la 51", "Détaille la décision 51", "peux-tu détailler la D-51 ?", "détaille-moi la 51", "le détail de la 51", "D-51, détaille"])
      if (demande(m) !== "51") echecs.push(`51 : « ${m} » est une demande de détail de D-51 → attendu "51", obtenu "${demande(m)}"`);
    if (demande("51 et 52 détaillez") !== "51,52") echecs.push(`51 : « 51 et 52 détaillez » → attendu "51,52", obtenu "${demande("51 et 52 détaillez")}"`);
    for (const m of ["détaille", "TF-1851 détaille ce point", "dans l'étape 3 détaille le plan", "bloc 3 détaille", "A-3 détaille", "un détail de 3 lignes", "ne détaille pas la 51", "merci", "51 ok"])
      if (demande(m) !== "") echecs.push(`51 : « ${m} » n'est pas une demande de détail d'une décision → attendu aucun numéro, obtenu "${demande(m)}"`);

    const D51_ENTIERE = BON.replace("**D-1 —**", "**D-51 —**");
    const RAPPEL_UNE_LIGNE = BON.replace("## 3. Décisions attendues\n", "## 3. Décisions attendues\n- D-51 : publication de la version corrigée du démarrage, posée le 16/10 à 14:20, inchangée.\n");
    if (D51_ENTIERE === BON || RAPPEL_UNE_LIGNE === BON) echecs.push("51 : une fixture n'a pas été modifiée — le cas ne prouve plus rien");
    const DETAILLEES = "## 3. Décisions attendues\n\n"
      + "- **D-52 —** Publier la partie documentation de la version, détail de D-51 ? La documentation est prête et ne dépend d'aucune autre pièce.\n"
      + "  - (a) publier maintenant — recommandé : le journal `recette.md` ne porte aucun défaut ouvert ; coût nul ; exclut un dernier regard.\n"
      + "  - (b) attendre — coût : une nuit de retard ; exclut la mise à disposition immédiate.\n"
      + "  - si rien n'est décidé : (a) s'applique.\n"
      + "- **D-53 —** Publier la partie code de la version, détail de D-51 ? Le code attend la documentation pour sortir avec elle.\n"
      + "  - (a) publier avec la documentation — recommandé : une seule sortie ; coût nul ; exclut une sortie séparée.\n"
      + "  - (b) publier seul — coût : deux sorties ; exclut le regroupement.\n"
      + "  - si rien n'est décidé : (a) s'applique.\n\n";
    const REMPLACEE = BON.replace(/## 3\. Décisions attendues[\s\S]*?(?=## 4\.)/, DETAILLEES);
    const SANS_OPTIONS = BON.replace(/## 3\. Décisions attendues[\s\S]*?(?=## 4\.)/,
      "## 3. Décisions attendues\n\n- **D-51 —** Publier la version corrigée du démarrage ? Le contrôle de `bootstrap.mjs` vient de passer en entier, la version est prête à sortir.\n\n");
    const ABSENTE = BON.replace(/## 3\. Décisions attendues[\s\S]*?(?=## 4\.)/, "## 3. Décisions attendues\n\nRien n'attend de décision.\n\n");
    const cD = (humain, texte, precedent = D51_ENTIERE) => controlerDetail({ dernierHumain: humain, dernierTexte: texte, textePrecedent: precedent });
    const attendu51 = [
      ["rappel en une ligne", cD("51 détaille", RAPPEL_UNE_LIGNE), "FAIL", /rappelée qu'en une ligne/],
      ["décision absente", cD("51 détaille", ABSENTE), "FAIL", /absente de ta réponse/],
      ["reposée sans options", cD("51 détaille", SANS_OPTIONS), "FAIL", /sans ses options/],
      ["reposée en entier", cD("51 détaille", D51_ENTIERE), "PASS", null],
      ["remplacée par des décisions détaillées qui la citent", cD("détaille la 51", REMPLACEE), "PASS", null],
      ["D-51 inconnue de la conversation", cD("51 détaille", ABSENTE, "Rien à signaler."), "SANS_OBJET", null],
      ["message qui ne demande rien", cD("merci, c'est noté", RAPPEL_UNE_LIGNE), "SANS_OBJET", null],
    ];
    for (const [quoi, r, verdict, motif] of attendu51) {
      if (r.verdict !== verdict) echecs.push(`51 : ${quoi} → attendu ${verdict}, obtenu ${r.verdict} ${JSON.stringify(r.ecarts).slice(0, 200)}`);
      else if (motif && !motif.test((r.ecarts || []).join(" "))) echecs.push(`51 : ${quoi} → l'écart doit dire pourquoi (${motif}), obtenu ${JSON.stringify(r.ecarts).slice(0, 200)}`);
    }

    const tour51 = (humain, texteFinal) => [
      { type: "user", message: { role: "user", content: "où en est la publication ?" } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: D51_ENTIERE }] } },
      { type: "user", message: { role: "user", content: humain } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name: "Write", input: { file_path: "x.mjs" } }] } },
      { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: texteFinal }] } },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n";
    const hook51 = (nom, humain, texteFinal) => {
      const p = join(base, nom + ".jsonl"); writeFileSync(p, tour51(humain, texteFinal), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", env: ENV_SANS_SESSION,
        input: JSON.stringify({ session_id: "test-51", transcript_path: p, stop_hook_active: false }) });
      let d = null; try { d = JSON.parse(r.stdout || "null"); } catch { /* laisse passer */ }
      return { d, p };
    };
    const prejuger51 = (nom, texte, transcript) => {
      const f = join(base, nom + ".md"); writeFileSync(f, texte, "utf8");
      const r = spawnSync(process.execPath, [HOOK, "--prejuger", f, "--transcript", transcript], { encoding: "utf8", env: ENV_SANS_SESSION });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
      return { code: r.status, o };
    };
    // T2 (TF-1947, 26/10/2026) : DÉTAIL AVERTIT, il ne refuse plus. Adapté : 51 bis et 51 quinquies attendaient un refus DÉTAIL ;
    // ils attendent désormais l'avertissement DÉTAIL (sous la réponse au hook, parmi les avertissements au préjugement). 51 quater
    // garde le sens contraire : sans demande de détail, rien n'est dit pour DÉTAIL.
    const rouge = hook51("tour-51-rappel", "51 détaille", RAPPEL_UNE_LIGNE);
    if (rouge.d?.decision === "block" || !/DÉTAIL — détail demandé de D-51/.test(rouge.d?.systemMessage || ""))
      echecs.push(`51 bis : « 51 détaille » et un rappel de D-51 en une ligne → attendu l'avertissement DÉTAIL sans refus (T2), obtenu ${JSON.stringify(rouge.d).slice(0, 240)}`);
    const verte = hook51("tour-51-entiere", "51 détaille", D51_ENTIERE);
    if (verte.d?.decision === "block")
      echecs.push(`51 ter : « 51 détaille » et D-51 reposée en entier → attendu accepté, obtenu ${JSON.stringify(verte.d).slice(0, 240)}`);
    const neutre = hook51("tour-51-neutre", "ok, merci", RAPPEL_UNE_LIGNE);
    if (/DÉTAIL/.test(JSON.stringify(neutre.d || "")))
      echecs.push(`51 quater : le MÊME rappel sous un message qui ne demande aucun détail ne doit rien dire pour DÉTAIL, obtenu ${JSON.stringify(neutre.d).slice(0, 240)}`);
    const pr = prejuger51("brouillon-51-rappel", RAPPEL_UNE_LIGNE, rouge.p);
    if (pr.code !== 0 || (pr.o?.bloquants || []).some((x) => /^DÉTAIL/.test(x)) || !(pr.o?.avertissements || []).some((x) => /^DÉTAIL/.test(x)))
      echecs.push(`51 quinquies : --prejuger avec le transcript doit dire l'avertissement DÉTAIL avant l'affichage, sans refus (T2), obtenu ${pr.code} ${JSON.stringify(pr.o).slice(0, 240)}`);
    const pv = prejuger51("brouillon-51-entiere", D51_ENTIERE, rouge.p);
    if (pv.code !== 0 || pv.o?.detail !== "PASS")
      echecs.push(`51 sexies : --prejuger du brouillon qui repose D-51 en entier → attendu exit 0 et detail PASS, obtenu ${pv.code} ${JSON.stringify(pv.o).slice(0, 240)}`);
  }
  // 52 — TF-1849 (18/10/2026) : UNE D-N NOUVELLE AFFICHÉE EST INSCRITE AU REGISTRE DU PRODUIT AVANT L'AFFICHAGE, dans ses
  // sens. Le fait (retour Produit-79 RP-12) : D-37 affichée sans entrée `question_humain`, prise par une autre session 8 minutes plus
  // tard. Le registre est le `forge/ledger.jsonl` du produit ; chez le pilot il n'existe pas, le contrôle se tait et le dit. Avant
  // l'échéance (2026-11-01) la D-N non inscrite est un AVERTISSEMENT ; à l'échéance, un REFUS — la recette joue les deux états par
  // `FORGE_RESERVATION_BLOQUANTE_DES`. Le remède que le message recommande est JOUÉ (ledger.py du gabarit) et le refus tombe.
  {
    const PYTHON52 = ["python", "python3", "py"].find((bin) => { const r = spawnSync(bin, ["--version"], { encoding: "utf8" }); return !r.error && r.status === 0; });
    const LEDGER_GABARIT = readFileSync(join(ICI, "..", "gabarits", "ledger.py"), "utf8");
    let nProduit = 0;
    /** Un produit jetable : `forge/retours/` (il se reconnaît à lui), `forge/ledger.py` du gabarit, run ouvert. */
    const produit52 = () => {
      const d = join(base, `produit-52-${++nProduit}`);
      mkdirSync(join(d, "forge", "retours"), { recursive: true });
      writeFileSync(join(d, "forge", "ledger.py"), LEDGER_GABARIT, "utf8");
      if (PYTHON52) spawnSync(PYTHON52, [join(d, "forge", "ledger.py"), "run_open", "--run_id", "essai-52"], { encoding: "utf8" });
      else writeFileSync(join(d, "forge", "ledger.jsonl"), JSON.stringify({ seq: 1, ts: "2026-10-18T10:00:00Z", type: "run_open", run_id: "essai-52" }) + "\n", "utf8");
      return d;
    };
    const inscrire = (d, ligneJson, flags) => {
      if (PYTHON52 && flags) return spawnSync(PYTHON52, [join(d, "forge", "ledger.py"), ...flags], { encoding: "utf8" });
      const f = join(d, "forge", "ledger.jsonl");
      writeFileSync(f, readFileSync(f, "utf8") + ligneJson + "\n", "utf8");
      return { status: 0 };
    };
    const lignes52 = (d) => readFileSync(join(d, "forge", "ledger.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
    const D61 = BON.replace("**D-1 —**", "**D-61 —**") + "\n- Remontée à la factory : rien à remonter.\n";
    const D61_RAPPEL = BON.replace(/## 3\. Décisions attendues[\s\S]*?(?=## 4\.)/,
      "## 3. Décisions attendues\n\n- **D-61** : publication de la version corrigée du démarrage, posée le 18/10 à 10:00, inchangée.\n\n") + "\n- Remontée à la factory : rien à remonter.\n";
    if (D61 === BON || D61_RAPPEL === BON) echecs.push("52 : une fixture n'a pas été modifiée — le cas ne prouve plus rien");
    const JOUR = 86400000, echeance = new Date(RESERVATION_BLOQUANTE_DES).getTime();
    const avant = new Date(echeance - JOUR), apres = new Date(echeance + JOUR);
    const cR = (texte, d, extra = {}) => controlerReservation({ dernierTexte: texte, racine: d, maintenant: avant, ...extra });

    // (1) la fonction, dans ses sens
    const nu = produit52();
    const rouge = cR(D61, nu);
    if (rouge.verdict !== "FAIL" || rouge.bloquant !== false || !/D-61/.test((rouge.ecarts || []).join(" ")) || !/question_humain/.test((rouge.ecarts || []).join(" ")))
      echecs.push(`52 : D-61 affichée sans entrée au registre, avant l'échéance → attendu FAIL non bloquant nommant D-61 et question_humain, obtenu ${JSON.stringify(rouge).slice(0, 260)}`);
    const rougeBloque = cR(D61, nu, { maintenant: apres });
    if (rougeBloque.verdict !== "FAIL" || rougeBloque.bloquant !== true)
      echecs.push(`52 bis : la même D-61 à l'échéance → attendu FAIL bloquant, obtenu ${JSON.stringify(rougeBloque).slice(0, 200)}`);
    const rappel = cR(D61_RAPPEL, nu);
    if (rappel.verdict !== "PASS")
      echecs.push(`52 ter : un rappel d'une ligne (S4) n'est pas une D-N nouvelle → attendu PASS, obtenu ${JSON.stringify(rappel).slice(0, 200)}`);
    for (const [quoi, extra] of [["citée par le message précédent", { textePrecedent: "## 3\n- **D-61 —** Publier ? (a) oui (b) non" }],
      ["nommée par l'humain (« 61a »)", { dernierHumain: "61a" }], ["nommée par l'humain (« 61 détaille »)", { dernierHumain: "61 détaille" }]]) {
      const r = cR(D61, nu, extra);
      if (r.verdict !== "PASS") echecs.push(`52 quater : une D-N ${quoi} se REPOSE sans nouvelle réservation (TF-1851) → attendu PASS, obtenu ${r.verdict}`);
    }
    // (2) le remède recommandé est JOUÉ : l'entrée écrite par ledger.py lève le refus, et seule la bonne D-N le lève
    const remede = produit52();
    const autre = inscrire(remede, JSON.stringify({ seq: 2, ts: "2026-10-18T10:00:01Z", type: "question_humain", decision: "D-6", question: "autre sujet" }), ["question_humain", "--decision", "D-6", "--question", "autre sujet"]);
    const reponse = inscrire(remede, JSON.stringify({ seq: 3, ts: "2026-10-18T10:00:02Z", type: "reponse_humain", portee: "D-61" }), ["reponse_humain", "--portee", "D-61"]);
    if (autre.status !== 0 || reponse.status !== 0) echecs.push("52 quinquies : l'écriture des entrées de fixture a échoué");
    const horsSujet = cR(D61, remede);
    if (horsSujet.verdict !== "FAIL")
      echecs.push(`52 quinquies : D-6 inscrite et D-61 citée par une réponse seulement ne réservent PAS D-61 (un numéro n'en préfixe pas un autre, et seule une question_humain réserve) → attendu FAIL, obtenu ${horsSujet.verdict}`);
    const w = inscrire(remede, JSON.stringify({ seq: 4, ts: "2026-10-18T10:00:03Z", type: "question_humain", decision: "D-61", question: "Publier maintenant ?" }), ["question_humain", "--decision", "D-61", "--question", "Publier maintenant ?"]);
    if (w.status !== 0) echecs.push(`52 sexies : le remède recommandé (ledger.py question_humain --decision D-61 …) est refusé : ${(w.stderr || "").slice(0, 160)}`);
    const vert = cR(D61, remede, { maintenant: apres });
    if (vert.verdict !== "PASS")
      echecs.push(`52 sexies : après le remède recommandé, D-61 est inscrite → attendu PASS même à l'échéance, obtenu ${JSON.stringify(vert).slice(0, 200)}`);
    const seqs = lignes52(remede).map((x) => x.seq).join();
    if (seqs !== "1,2,3,4") echecs.push(`52 sexies : le registre écrit par le remède doit rester numéroté 1,2,3,4, obtenu ${seqs}`);
    // une forme du registre déjà employée chez un produit : objet `decisions_posees`
    const objet = produit52(); inscrire(objet, JSON.stringify({ seq: 2, ts: "2026-10-18T10:00:01Z", type: "question_humain", decisions_posees: { "D-61": "publication" } }), null);
    if (cR(D61, objet).verdict !== "PASS") echecs.push("52 septies : l'objet `decisions_posees` {\"D-61\": …} (forme d'un produit du parc) doit réserver D-61");
    // un ledger absent se dit, il ne s'invente pas
    const sansLedger = produit52(); rmSync(join(sansLedger, "forge", "ledger.jsonl"));
    const rSans = cR(D61, sansLedger);
    if (rSans.verdict !== "FAIL" || !/introuvable/.test((rSans.ecarts || []).join(" ")))
      echecs.push(`52 octies : sans forge/ledger.jsonl, la D-61 est non inscrite et le refus dit que le registre est introuvable, obtenu ${JSON.stringify(rSans).slice(0, 200)}`);
    // (3) hors produit ET hors pilot (une forge, un dossier quelconque) : SANS_OBJET, dit. Le pilot, lui, est jugé depuis TF-1872 (cas 53).
    const horsProduit = controlerReservation({ dernierTexte: D61, racine: join(base, "dossier-quelconque") });
    if (horsProduit.verdict !== "SANS_OBJET" || !/registre/.test(horsProduit.motif || ""))
      echecs.push(`52 nonies : un dossier sans forge/retours, hors du pilot → attendu SANS_OBJET qui dit ne pas avoir de registre, obtenu ${JSON.stringify(horsProduit).slice(0, 200)}`);

    // (4) le hook de fin de tour et --prejuger, chez un produit (cwd du produit), avant l'échéance puis à l'échéance
    const tour52 = (texteFinal) => transcript(texteFinal, ["Write", "Edit"]);
    const hook52 = (d, texte, env = {}) => {
      const p = join(base, `tour-52-${nProduit}-${Math.abs(texte.length)}.jsonl`); writeFileSync(p, tour52(texte), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: d, env: { ...ENV_SANS_SESSION, ...env },
        input: JSON.stringify({ session_id: "test-52", transcript_path: p, stop_hook_active: false, cwd: d }) });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* laisse passer */ }
      return o;
    };
    const prejuger52 = (d, texte, nom, env = {}) => {
      const f = join(base, nom + ".md"); writeFileSync(f, texte, "utf8");
      const r = spawnSync(process.execPath, [HOOK, "--prejuger", f], { encoding: "utf8", cwd: d, env: { ...ENV_SANS_SESSION, ...env } });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
      return { code: r.status, o };
    };
    const BLOQUE = { FORGE_RESERVATION_BLOQUANTE_DES: "2026-10-01" };
    const LOIN = { FORGE_RESERVATION_BLOQUANTE_DES: "2099-01-01" };
    const hAvertit = hook52(produit52(), D61, LOIN);
    if (hAvertit?.decision === "block" || !/RÉSERVATION/.test(hAvertit?.systemMessage || "") || !/2099-01-01/.test(hAvertit?.systemMessage || ""))
      echecs.push(`52 decies : avant l'échéance, le hook AVERTIT sans refuser et nomme la date → attendu systemMessage RÉSERVATION, obtenu ${JSON.stringify(hAvertit).slice(0, 260)}`);
    const dRefus = produit52();
    const hRefuse = hook52(dRefus, D61, BLOQUE);
    if (hRefuse?.decision !== "block" || !/RÉSERVATION/.test(hRefuse.reason || "") || !/question_humain/.test(hRefuse.reason || ""))
      echecs.push(`52 undecies : à l'échéance, le hook REFUSE la D-61 non inscrite et dit le remède → attendu block RÉSERVATION, obtenu ${JSON.stringify(hRefuse).slice(0, 260)}`);
    const pRefuse = prejuger52(dRefus, D61, "brouillon-52-refuse", BLOQUE);
    if (pRefuse.code !== 1 || !(pRefuse.o?.bloquants || []).some((x) => /^RÉSERVATION/.test(x)))
      echecs.push(`52 duodecies : --prejuger chez le produit, à l'échéance, refuse avant l'affichage → attendu exit 1 et RÉSERVATION, obtenu ${pRefuse.code} ${JSON.stringify(pRefuse.o).slice(0, 220)}`);
    const pAvertit = prejuger52(produit52(), D61, "brouillon-52-avertit", LOIN);
    if (pAvertit.code !== 0 || !(pAvertit.o?.avertissements || []).some((x) => /^RÉSERVATION/.test(x)))
      echecs.push(`52 terdecies : --prejuger avant l'échéance → attendu exit 0 et un avertissement RÉSERVATION, obtenu ${pAvertit.code} ${JSON.stringify(pAvertit.o).slice(0, 220)}`);
    inscrire(dRefus, JSON.stringify({ seq: 2, ts: "2026-10-18T10:00:01Z", type: "question_humain", decision: "D-61", question: "Publier ?" }), ["question_humain", "--decision", "D-61", "--question", "Publier ?"]);
    const hVert = hook52(dRefus, D61, BLOQUE);
    if (hVert !== null) echecs.push(`52 quaterdecies : après l'inscription de D-61, la MÊME restitution à l'échéance passe sans rien dire, obtenu ${JSON.stringify(hVert).slice(0, 240)}`);
    const pVert = prejuger52(dRefus, D61, "brouillon-52-vert", BLOQUE);
    if (pVert.code !== 0 || pVert.o?.affichable !== true) echecs.push(`52 quindecies : --prejuger après l'inscription → attendu affichable, obtenu ${pVert.code} ${JSON.stringify(pVert.o).slice(0, 220)}`);
    const hRappel = hook52(produit52(), D61_RAPPEL, BLOQUE);
    if (hRappel !== null) echecs.push(`52 sexdecies : un rappel d'une ligne (S4) d'une D-61 non inscrite passe, même à l'échéance, obtenu ${JSON.stringify(hRappel).slice(0, 240)}`);
    // hors produit et hors pilot (cwd d'un dossier quelconque) : aucun contrôle, aucun message
    const hHors = hook52(join(base, "dossier-quelconque"), D61, BLOQUE);
    if (hHors !== null && /RÉSERVATION/.test(JSON.stringify(hHors))) echecs.push(`52 septendecies : hors produit et hors pilot la réservation ne se joue pas (aucun registre des D-N), obtenu ${JSON.stringify(hHors).slice(0, 240)}`);
  }
  // 53 — TF-1872 (18/10/2026, D-32 (a), « valable tous produits ») : LA MÊME RÉSERVATION AU PILOT. Le fait : D-24, D-25 et D-26 posés deux fois le 18/10 pour des
  // questions différentes par deux sessions du pilot sur le même arbre (puis D-27 une quatrième fois). Le pilot a désormais `decisions/REGISTRE.jsonl` ; une D-N
  // NOUVELLE du bloc 3 qui n'y figure pas, ou qui y figure pour une AUTRE question, est refusée. Échéance choisie pour le pilot : 2026-10-25 (la plus longue session
  // du pilot mesurée dure 107 h, le 90e centile 31 h : au 25/10 toute session ouverte avant la règle a été rouverte). La recette joue les deux états par
  // `FORGE_RESERVATION_PILOT_BLOQUANTE_DES`, avec un registre d'ESSAI (`FORGE_REGISTRE_DECISIONS_PILOT`), jamais celui du pilot. Les remèdes que le refus recommande sont JOUÉS.
  {
    const regP = join(base, "registre-pilot-53.jsonl");
    const Q30 = "Faut-il suivre le verdict de l'étude, une procédure au référentiel sans skill, plutôt que le skill que vous avez choisi ?";
    const Q31 = "Faut-il construire la famille « tableau de bord de pilotage », puis sa règle de lecture, comme l'étude le conclut ?";
    const Q61 = "Publier maintenant la version corrigée du démarrage, ou attendre demain matin ?";
    const ecrireReg = () => writeFileSync(regP, [{ type: "registre", version: 1 }, { type: "decision", n: 30, question: Q30, date: "2026-10-18", origine: "amorce" },
      { type: "decision", n: 31, question: Q31, date: "2026-10-18", origine: "amorce" }].map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
    ecrireReg();
    const avant = process.env.FORGE_REGISTRE_DECISIONS_PILOT; process.env.FORGE_REGISTRE_DECISIONS_PILOT = regP;
    const PILOT_RACINE = join(ICI, "..");
    const OUTIL_RESERVER = join(ICI, "..", "scripts", "reserver-decision.mjs");
    const tete = (n, q) => `## 3. Décisions attendues\n\n> **D-${n} — ${q}**\n> - **Recommandation : (a)**\n\n`;
    const echeanceP = new Date(RESERVATION_PILOT_BLOQUANTE_DES).getTime();
    const avantEch = new Date(echeanceP - 86400000), apresEch = new Date(echeanceP + 86400000);
    const cP = (texte, extra = {}) => controlerReservation({ dernierTexte: texte, racine: PILOT_RACINE, maintenant: avantEch, ...extra });
    if (!process.env.FORGE_RESERVATION_PILOT_BLOQUANTE_DES && RESERVATION_PILOT_BLOQUANTE_DES !== "2026-10-25")
      echecs.push(`53 : l'échéance du pilot choisie et justifiée (107 h de session au plus) est 2026-10-25, obtenu ${RESERVATION_PILOT_BLOQUANTE_DES}`);
    // (1) absente du registre : avertie avant l'échéance, refusée à l'échéance
    const absente = cP(tete(34, Q61));
    if (absente.verdict !== "FAIL" || absente.bloquant !== false || !(absente.absentes || []).includes("D-34") || !/registre des décisions du pilot/.test((absente.ecarts || []).join(" ")))
      echecs.push(`53 : D-34 posée sans entrée au registre du pilot, avant l'échéance → attendu FAIL non bloquant nommant D-34, obtenu ${JSON.stringify(absente).slice(0, 260)}`);
    const absenteBloque = cP(tete(34, Q61), { maintenant: apresEch });
    if (absenteBloque.verdict !== "FAIL" || absenteBloque.bloquant !== true) echecs.push(`53 bis : la même D-34 à l'échéance → attendu FAIL bloquant, obtenu ${JSON.stringify(absenteBloque).slice(0, 200)}`);
    // (2) déjà prise pour une AUTRE question : c'est la collision du 18/10
    const prise = cP(tete(30, Q61));
    if (prise.verdict !== "FAIL" || !(prise.prises || []).includes("D-30") || !/DÉJÀ PRISE/.test((prise.ecarts || []).join(" ")) || !/suivre le verdict de l'étude/.test((prise.ecarts || []).join(" ")))
      echecs.push(`53 ter : D-30 reposée pour une autre question → attendu FAIL « déjà prise » qui cite la question déjà inscrite, obtenu ${JSON.stringify(prise).slice(0, 300)}`);
    // (3) la même question, mot pour mot ou à peine reformulée : PASS
    for (const [quoi, q] of [["mot pour mot", Q30], ["à quelques mots près", "Faut-il suivre le verdict de l'étude plutôt que le skill que vous avez choisi ?"]]) {
      const r = cP(tete(30, q)); if (r.verdict !== "PASS") echecs.push(`53 quater : D-30 inscrite et reposée ${quoi} → attendu PASS, obtenu ${JSON.stringify(r).slice(0, 220)}`);
    }
    // (4) le remède 1 JOUÉ : l'outil rend un numéro libre et l'inscrit ; la restitution qui porte CE numéro passe
    const rem = spawnSync(process.execPath, [OUTIL_RESERVER, "--registre-pilot", regP, "--question", Q61], { encoding: "utf8", cwd: PILOT_RACINE });
    let reserve = null; try { reserve = JSON.parse(rem.stdout); } catch { /* illisible */ }
    if (rem.status !== 0 || reserve?.reserve !== "D-32") echecs.push(`53 quinquies : l'outil de réservation doit rendre D-32 (le plus grand inscrit est D-31), obtenu ${rem.status} ${(rem.stdout || rem.stderr || "").slice(0, 200)}`);
    else {
      const vert = cP(tete(32, Q61));
      if (vert.verdict !== "PASS") echecs.push(`53 quinquies : D-32 réservée par l'outil puis affichée avec la même question → attendu PASS, obtenu ${JSON.stringify(vert).slice(0, 220)}`);
      const vertAutre = cP(tete(32, Q31));
      if (vertAutre.verdict !== "FAIL" || !(vertAutre.prises || []).includes("D-32")) echecs.push(`53 quinquies : D-32 réservée pour une question, affichée pour une autre → attendu FAIL « déjà prise », obtenu ${JSON.stringify(vertAutre).slice(0, 220)}`);
    }
    // (5) le remède 2 JOUÉ : la MÊME décision reposée au libellé réécrit (le cas du format B du 17/10) garde son numéro par --reformuler
    const REFORM = "Quel dispositif retenez-vous pour lire les tableaux de bord de pilotage ?";
    if (cP(tete(31, REFORM)).verdict !== "FAIL") echecs.push("53 sexies : la décision D-31 réécrite sans rapport de mots avec la question inscrite doit d'abord être refusée");
    const rf = spawnSync(process.execPath, [OUTIL_RESERVER, "--registre-pilot", regP, "--reformuler", "D-31", "--question", REFORM], { encoding: "utf8", cwd: PILOT_RACINE });
    if (rf.status !== 0) echecs.push(`53 sexies : --reformuler D-31 refusé : ${(rf.stdout || rf.stderr || "").slice(0, 200)}`);
    else if (cP(tete(31, REFORM)).verdict !== "PASS") echecs.push("53 sexies : après --reformuler, la décision réécrite doit passer sous son numéro");
    // (6) ce qui n'est pas NOUVEAU ne se réserve pas : nommée par l'humain, citée par le message précédent, rappel d'une ligne
    for (const [quoi, extra] of [["nommée par l'humain (« 40a »)", { dernierHumain: "40a" }], ["citée par le message précédent", { textePrecedent: "> **D-40 — Autre sujet ?**" }]]) {
      const r = cP(tete(40, Q61), extra); if (r.verdict !== "PASS") echecs.push(`53 septies : une D-N ${quoi} se REPOSE sans réservation → attendu PASS, obtenu ${r.verdict}`);
    }
    const rap = cP("## 3. Décisions attendues\n\n- **D-40** : publication de la version corrigée du démarrage, posée le 18/10 à 10:00, inchangée.\n\n");
    if (rap.verdict !== "PASS") echecs.push(`53 octies : un rappel d'une ligne (S4) n'est pas une D-N nouvelle → attendu PASS, obtenu ${rap.verdict}`);
    // (7) deux têtes, une seule absente : seule l'absente est nommée
    const deux = cP(tete(30, Q30) + tete(35, "Faut-il lancer la suite du chantier dès demain matin ?"));
    if (deux.verdict !== "FAIL" || deux.absentes.join() !== "D-35") echecs.push(`53 nonies : D-30 inscrite et D-35 absente → attendu FAIL nommant D-35 seule, obtenu ${JSON.stringify(deux).slice(0, 240)}`);
    // (8) registre introuvable : le contrôle le dit, il n'accuse pas (un clone antérieur au 18/10)
    process.env.FORGE_REGISTRE_DECISIONS_PILOT = join(base, "registre-inexistant.jsonl");
    const introuvable = controlerReservation({ dernierTexte: tete(34, Q61), racine: PILOT_RACINE, maintenant: apresEch });
    process.env.FORGE_REGISTRE_DECISIONS_PILOT = regP;
    if (introuvable.verdict !== "SANS_OBJET" || !/introuvable/.test(introuvable.motif || ""))
      echecs.push(`53 decies : un registre introuvable → attendu SANS_OBJET qui le dit, obtenu ${JSON.stringify(introuvable).slice(0, 200)}`);
    // (9) le hook de fin de tour et --prejuger, au pilot (cwd du pilot)
    ecrireReg();
    const D61P = BON.replace("**D-1 —**", "**D-61 —**") + "\n- Remontée à la factory : rien à remonter.\n";
    const hookP = (texte, env = {}) => {
      const p = join(base, `tour-53-${Math.abs(texte.length)}-${Object.values(env).join("")}.jsonl`); writeFileSync(p, transcript(texte, ["Write", "Edit"]), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: PILOT_RACINE, env: { ...ENV_SANS_SESSION, FORGE_REGISTRE_DECISIONS_PILOT: regP, ...env },
        input: JSON.stringify({ session_id: "test-53", transcript_path: p, stop_hook_active: false, cwd: PILOT_RACINE }) });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* laisse passer */ }
      return o;
    };
    const prejugerP = (texte, nom, env = {}) => {
      const f = join(base, nom + ".md"); writeFileSync(f, texte, "utf8");
      const r = spawnSync(process.execPath, [HOOK, "--prejuger", f], { encoding: "utf8", cwd: PILOT_RACINE, env: { ...ENV_SANS_SESSION, FORGE_REGISTRE_DECISIONS_PILOT: regP, ...env } });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* illisible */ }
      return { code: r.status, o };
    };
    const hAvertit = hookP(D61P, { FORGE_RESERVATION_PILOT_BLOQUANTE_DES: "2099-01-01" });
    if (hAvertit?.decision === "block" || !/RÉSERVATION/.test(hAvertit?.systemMessage || "") || !/2099-01-01/.test(hAvertit?.systemMessage || "") || !/reserver-decision\.mjs/.test(hAvertit?.systemMessage || ""))
      echecs.push(`53 undecies : au pilot, avant l'échéance, le hook AVERTIT sans refuser, nomme la date et l'outil → attendu systemMessage RÉSERVATION, obtenu ${JSON.stringify(hAvertit).slice(0, 300)}`);
    const hRefuse = hookP(D61P, { FORGE_RESERVATION_PILOT_BLOQUANTE_DES: "2026-10-01" });
    if (hRefuse?.decision !== "block" || !/RÉSERVATION/.test(hRefuse.reason || "") || !/reserver-decision\.mjs --question/.test(hRefuse.reason || "") || !/--reformuler/.test(hRefuse.reason || ""))
      echecs.push(`53 duodecies : au pilot, à l'échéance, le hook REFUSE la D-61 absente du registre et recommande l'outil de réservation ET --reformuler → attendu block RÉSERVATION, obtenu ${JSON.stringify(hRefuse).slice(0, 300)}`);
    const pRefuse = prejugerP(D61P, "brouillon-53-refuse", { FORGE_RESERVATION_PILOT_BLOQUANTE_DES: "2026-10-01" });
    if (pRefuse.code !== 1 || !(pRefuse.o?.bloquants || []).some((x) => /^RÉSERVATION/.test(x)) || pRefuse.o?.reservation?.cible !== "pilot")
      echecs.push(`53 terdecies : --prejuger au pilot, à l'échéance → attendu exit 1, RÉSERVATION et cible pilot, obtenu ${pRefuse.code} ${JSON.stringify(pRefuse.o).slice(0, 240)}`);
    // le remède joué sur le hook : l'outil réserve le numéro suivant pour la question de BON, la restitution qui le porte passe en silence
    const rem2 = spawnSync(process.execPath, [OUTIL_RESERVER, "--registre-pilot", regP, "--question", Q61], { encoding: "utf8", cwd: PILOT_RACINE });
    const num2 = (() => { try { return JSON.parse(rem2.stdout).n; } catch { return null; } })();
    const D_RESERVEE = BON.replace("**D-1 —**", `**D-${num2} —**`) + "\n- Remontée à la factory : rien à remonter.\n";
    const hVert = hookP(D_RESERVEE, { FORGE_RESERVATION_PILOT_BLOQUANTE_DES: "2026-10-01" });
    if (!num2 || hVert !== null) echecs.push(`53 quaterdecies : après la réservation par l'outil (D-${num2}), la restitution qui porte ce numéro passe en silence, même à l'échéance, obtenu ${JSON.stringify(hVert).slice(0, 240)}`);
    const pVert = prejugerP(D_RESERVEE, "brouillon-53-vert", { FORGE_RESERVATION_PILOT_BLOQUANTE_DES: "2026-10-01" });
    if (pVert.code !== 0 || pVert.o?.affichable !== true) echecs.push(`53 quindecies : --prejuger après la réservation → attendu affichable, obtenu ${pVert.code} ${JSON.stringify(pVert.o).slice(0, 220)}`);
    process.env.FORGE_REGISTRE_DECISIONS_PILOT = avant;
  }

  // 54 — TF-1866 (18/10/2026, D-29 (a)) : UNE AFFIRMATION D'EXHAUSTIVITÉ PORTE SA LIGNE « Mesuré sur », et UN « OUI » À UNE QUESTION DE COMPLÉTUDE AUSSI. Le fait (RT-126) :
  // à « Est-ce que le reste du site a été mis à jour ? », « Oui, tout le site en ligne est à jour » rendu PASS sur 273 pages cherchées avec la liste de l'auteur.
  // Deux juges se complètent : S82 d'oracle-synthese juge le TEXTE (cas 54 a), le contrôle COMPLÉTUDE du hook lit le dernier message humain (54 b, c) — seul à savoir qu'un
  // « oui » répond à une question de complétude. Les deux sont BLOQUANTS. Les remèdes sont JOUÉS.
  {
    const QCOMPLETUDE = "Est-ce que le reste du site a été mis à jour ?";
    const MESURE = "Mesuré sur : conditions générales du 15/10 du produit amont (docs/cgv-20261015d.md), relue à 14:32, périmètre 273 pages";
    const AFF = "Oui, tout le site en ligne est à jour : 273 pages relues. ";
    // BON est daté d'août : la règle ne juge que les restitutions du 18/10/2026 ou après ; la ligne « Relecture d'intention » (S79) est celle de cette date.
    const base54 = BON.replace("2026-08-20 21:40", "2026-10-18 00:05").replace("- bootstrap v2 livré", "- Relecture d'intention : sert — la demande est tenue à la lettre.\n- bootstrap v2 livré");
    if (base54 === BON) echecs.push("54 : la fixture n'a pas été datée — le cas ne prouve plus rien");
    const avecAff = AFF + base54;
    const avecLigne = (t) => t.replace("- Recette du pilot 22/22 verte, bootstrap 7/7.", "- Recette du pilot 22/22 verte, bootstrap 7/7.\n- " + MESURE);
    if (avecLigne(avecAff) === avecAff) echecs.push("54 : la ligne « Mesuré sur » n'a pas été insérée — le cas ne prouve plus rien");
    const tour54 = (humain, texteFinal) => [
      { type: "user", message: { role: "user", content: humain } },
      { type: "assistant", message: { role: "assistant", content: ["Write", "Edit"].map((n) => ({ type: "tool_use", name: n, input: {} })) } },
      { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } },
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: texteFinal }] } },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n";
    const dossierHors = join(base, "dossier-quelconque");
    mkdirSync(dossierHors, { recursive: true });
    const hook54 = (humain, texte, nom) => {
      const p = join(base, `tour-54-${nom}.jsonl`); writeFileSync(p, tour54(humain, texte), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: dossierHors, env: ENV_SANS_SESSION,
        input: JSON.stringify({ session_id: "test-54", transcript_path: p, stop_hook_active: false, cwd: dossierHors }) });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* laisse passer */ }
      return o;
    };
    // (a) le texte, S82 bloquante : l'affirmation sans ligne est refusée, avec la ligne elle passe, sans affirmation elle passe
    const sain = hook54("fais la mise à jour", base54, "sain");
    if (sain !== null) echecs.push(`54 : la fixture sans affirmation doit passer en silence (sinon la recette ne prouve rien), obtenu ${JSON.stringify(sain).slice(0, 300)}`);
    const a1 = hook54("fais la mise à jour", avecAff, "affirmation-sans-ligne");
    if (a1?.decision !== "block" || !/S82/.test(a1.reason || "") || !/Mesuré sur/.test(a1.reason || ""))
      echecs.push(`54 a : une affirmation d'exhaustivité sans « Mesuré sur » est REFUSÉE par le hook (S82 bloquante) et le refus nomme la ligne attendue, obtenu ${JSON.stringify(a1).slice(0, 300)}`);
    if (a1?.decision === "block" && /COMPLÉTUDE — /.test(a1.reason || "")) echecs.push("54 a : sans question de complétude au dernier message humain, le contrôle COMPLÉTUDE ne se déclenche pas");
    const a2 = hook54("fais la mise à jour", avecLigne(avecAff), "affirmation-avec-ligne");
    if (a2 !== null) echecs.push(`54 a bis : la MÊME affirmation avec la ligne « Mesuré sur » (le remède du message) passe en silence, obtenu ${JSON.stringify(a2).slice(0, 300)}`);
    // (b) le « oui » à la question du 15/10 : refusé sans la ligne, accepté avec, et seul le hook le sait (le texte n'a ici aucun mot de totalité)
    const ouiSansTotalite = AFF.replace("Oui, tout le site en ligne est à jour", "Oui, le site est à jour") + base54;
    const b0 = hook54("fais la mise à jour", ouiSansTotalite, "oui-sans-totalite");
    if (b0 !== null) echecs.push(`54 b : « Oui, le site est à jour » à un message qui n'est PAS une question de complétude n'est pas jugé (aucun mot de totalité), obtenu ${JSON.stringify(b0).slice(0, 300)}`);
    const b1 = hook54(QCOMPLETUDE, ouiSansTotalite, "oui-question-completude");
    if (b1?.decision !== "block" || !/COMPLÉTUDE — /.test(b1.reason || "") || !/Mesuré sur/.test(b1.reason || "") || !/RT-126/.test(b1.reason || ""))
      echecs.push(`54 b bis : « Oui » à « Est-ce que le reste du site a été mis à jour ? » sans « Mesuré sur » est REFUSÉ par le contrôle COMPLÉTUDE (S82 ne le voit pas), obtenu ${JSON.stringify(b1).slice(0, 300)}`);
    const b2 = hook54(QCOMPLETUDE, avecLigne(ouiSansTotalite), "oui-avec-ligne");
    if (b2 !== null) echecs.push(`54 b ter : le MÊME « oui » avec la ligne « Mesuré sur : <source amont>, relue à 14:32, périmètre 273 pages » passe en silence, obtenu ${JSON.stringify(b2).slice(0, 300)}`);
    const b3 = hook54(QCOMPLETUDE, avecLigne(ouiSansTotalite).replace("Mesuré sur : conditions générales du 15/10 du produit amont (docs/cgv-20261015d.md)", "Mesuré sur : mes marqueurs d'ancienne formulation"), "oui-liste-de-l-auteur");
    if (b3?.decision !== "block") echecs.push(`54 b quater : un « oui » fondé sur « mes marqueurs » (la liste de l'auteur, le cas du 15/10) reste REFUSÉ, obtenu ${JSON.stringify(b3).slice(0, 300)}`);
    const b4 = hook54(QCOMPLETUDE, avecLigne(ouiSansTotalite).replace("Mesuré sur :", "Mesuré contre :"), "oui-mesure-contre");
    if (b4?.decision !== "block" || !/pas « Mesuré contre »/.test(b4.reason || "")) echecs.push(`54 b quinquies : la formule « Mesuré contre », refusée par l'humain (D-29 (a)), reste REFUSÉE et le refus dit la formule, obtenu ${JSON.stringify(b4).slice(0, 300)}`);
    const b5 = hook54(QCOMPLETUDE, "## 0. Synthèse d'ouverture\n\nNon : 12 pages restent à mettre à jour.\n\n" + base54, "non-a-la-question");
    if (b5?.decision === "block" && /COMPLÉTUDE — /.test(b5.reason || "")) echecs.push("54 b sexies : un « non » à la question de complétude n'est pas l'affirmation");
    // (c) --prejuger joue le contrôle COMPLÉTUDE dès que le transcript donne le dernier message humain
    const ftr = join(base, "tour-54-prejuger.jsonl"); writeFileSync(ftr, tour54(QCOMPLETUDE, ouiSansTotalite), "utf8");
    const fbr = join(base, "brouillon-54.md"); writeFileSync(fbr, ouiSansTotalite, "utf8");
    const pr = spawnSync(process.execPath, [HOOK, "--prejuger", fbr, "--transcript", ftr], { encoding: "utf8", cwd: dossierHors, env: ENV_SANS_SESSION });
    let po = null; try { po = JSON.parse(pr.stdout || "null"); } catch { /* illisible */ }
    if (pr.status !== 1 || !(po?.bloquants || []).some((x) => /^COMPLÉTUDE/.test(x)) || po?.completude !== "FAIL")
      echecs.push(`54 c : --prejuger refuse avant l'affichage le « oui » sans ligne → attendu exit 1 et COMPLÉTUDE, obtenu ${pr.status} ${JSON.stringify(po).slice(0, 260)}`);
    const fbr2 = join(base, "brouillon-54-vert.md"); writeFileSync(fbr2, avecLigne(ouiSansTotalite), "utf8");
    const pr2 = spawnSync(process.execPath, [HOOK, "--prejuger", fbr2, "--transcript", ftr], { encoding: "utf8", cwd: dossierHors, env: ENV_SANS_SESSION });
    let po2 = null; try { po2 = JSON.parse(pr2.stdout || "null"); } catch { /* illisible */ }
    if (pr2.status !== 0 || po2?.affichable !== true) echecs.push(`54 c bis : --prejuger du brouillon qui porte la ligne → attendu affichable, obtenu ${pr2.status} ${JSON.stringify(po2).slice(0, 260)}`);
  }

  // 55 — TF-1936 (21/10/2026, RP-22) : S83, UNE DEMANDE D'AVIS PORTE LE LIEN DU CONTENU, au hook de fin de tour, dans ses QUATRE sens.
  // ROUGE : le cas réel du 19/10 — l'action A-11 « relire la semaine 2 et répondre « ok semaine 2 » », « guide de mon message de 21:45 »,
  // sans lien — est DITE en avertissement avec son échéance avant le 2026-10-28, et REFUSÉE à l'échéance (FORGE_S83_BLOQUANTE_DES passée).
  // VERTES : la MÊME action portant le chemin des textes et des photos (le remède du constat) passe en silence, avant comme après l'échéance.
  {
    const cwd55 = mkdtempSync(join(base, "hors-55-"));
    const A11 = (ou) => BON.replace("- manuelle_dev : aucune.", `- **A-3** — manuelle_utilisateur : TF-0003 relire la semaine 2 et répondre « ok semaine 2 » (enfin, parce que rien ne part sans votre relecture).
  - pourquoi pas l'IA : decision — D-94 (a) prévoit votre relecture avant chaque semaine.
  - où : ${ou}.
  - si rien n'est fait : rien ne part lundi 26/10.
- manuelle_dev : aucune.`);
    const ROUGE55 = A11("guide de mon message de 21:45"), VERTE55 = A11("`forge/publications/semaine-2/` (les 7 textes et leurs photos)");
    const hook55 = (nom, texte, env = {}) => {
      const p = join(base, `tour-55-${nom}.jsonl`); writeFileSync(p, transcript(texte, ["Write"]), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: cwd55, env: { ...ENV_SANS_SESSION, ...env }, input: JSON.stringify({ session_id: "t55", transcript_path: p, stop_hook_active: false, cwd: cwd55 }) });
      try { return JSON.parse(r.stdout || "null"); } catch { return null; }
    };
    // T2 (TF-1947, 26/10/2026) : S83 reste AVERTISSANTE, son échéance du 28/10/2026 est levée (`BLOQUANTES_DATEES` vide). Adapté :
    // 55 attendait l'avertissement avec la date d'échéance, 55 bis le refus à l'échéance ; tous deux attendent désormais
    // l'avertissement S83 sans date ni refus, même quand l'ancienne variable d'échéance est passée, avec le renvoi et le remède nommés.
    const avant = hook55("rouge-avant", ROUGE55, { FORGE_S83_BLOQUANTE_DES: "2099-01-01" });
    if (avant?.decision === "block" || !/S83 — /.test(avant?.systemMessage || "") || /S83 \(bloquante/.test(avant?.systemMessage || "")
      || !/message précédent n'en tient pas lieu/.test(avant?.systemMessage || ""))
      echecs.push(`55 : le cas réel du 19/10 (« guide de mon message de 21:45 ») doit être DIT en avertissement, sans échéance (T2), le renvoi nommé, obtenu ${JSON.stringify(avant).slice(0, 300)}`);
    const apres = hook55("rouge-apres", ROUGE55, { FORGE_S83_BLOQUANTE_DES: "2026-01-01" });
    if (apres?.decision === "block" || !/S83 — /.test(apres?.systemMessage || "") || !/chemin du fichier/.test(apres?.systemMessage || ""))
      echecs.push(`55 bis : même avec l'ancienne échéance passée, le MÊME cas réel reste AVERTI sur S83 (T2), le remède dit, obtenu ${JSON.stringify(apres).slice(0, 300)}`);
    for (const [env, quoi] of [[{ FORGE_S83_BLOQUANTE_DES: "2099-01-01" }, "avant"], [{ FORGE_S83_BLOQUANTE_DES: "2026-01-01" }, "après"]]) {
      const v = hook55(`vert-${quoi}`, VERTE55, env);
      if (v !== null) echecs.push(`55 ter : la MÊME action avec le chemin des textes (le remède) doit passer en silence ${quoi} l'échéance, obtenu ${JSON.stringify(v).slice(0, 300)}`);
    }
  }

  // 56 — TF-1938 (21/10/2026, RP-24, récidive de TF-1646) : S84, L'HEURE DU BLOC 1 SE RELÈVE DANS LE TOUR, sur transcriptions HORODATÉES.
  // ROUGE : le cas réel du 20/10 — « Quand : 20/10/2026 19:52 heure de Paris, durée 4 min », aucune sortie d'horloge dans le tour —
  // DIT avant l'échéance, REFUSÉ à l'échéance, heure ET durée nommées ; `--prejuger` avec la transcription le joue et le dit.
  // VERTES : le tour qui a joué `date` deux fois et dont l'en-tête recopie l'heure lue et l'écart des deux relevés passe en silence, même à
  // l'échéance ; un transcript SANS horodatage ne se mesure pas (SANS_OBJET, aucune accusation) ; `--prejuger` sans transcription dit ce
  // que la règle ne peut pas juger.
  {
    const cwd56 = mkdtempSync(join(base, "hors-56-"));
    const T0 = Date.parse("2026-10-20T18:00:30.000Z"), T1 = Date.parse("2026-10-20T18:30:38.000Z");
    const local = (ms) => { const d = new Date(ms); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
    const jour = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
    const QUAND = "quand : 2026-08-20 21:40 (Europe/Paris), durée 35 min";
    if (!BON.includes(QUAND)) echecs.push("56 : la fixture BON ne porte plus son en-tête d'origine — les cas de S84 ne prouvent plus rien");
    // Datée du 20/10, la restitution porte la ligne « Relecture d'intention » que S79 exige depuis le 18/10 : seule S84 est en jeu.
    const B56 = BON.replace("recette 22/22.\n", "recette 22/22.\n- Relecture d'intention : sert — la demande citée est tenue à la lettre comme à l'intention.\n");
    const ROUGE56 = B56.replace(QUAND, "Quand : 20/10/2026 19:52 heure de Paris, durée 4 min");
    const VERTE56 = B56.replace(QUAND, `quand : ${jour(T1)} ${local(T1)} (heure du poste), durée 30 min`);
    const iso = (ms) => new Date(ms).toISOString();
    const tour56 = (texte, sorties) => [
      { type: "user", timestamp: iso(T0 - 60000), message: { role: "user", content: "fais la mise à jour" } },
      ...sorties.flatMap((s, i) => [
        { type: "assistant", timestamp: iso(s.t - 2000), message: { role: "assistant", content: [{ type: "tool_use", id: `b${i}`, name: "Bash", input: { command: s.commande } }] } },
        { type: "user", timestamp: iso(s.t), message: { role: "user", content: [{ type: "tool_result", tool_use_id: `b${i}`, content: s.sortie }] } },
      ]),
      { type: "assistant", timestamp: iso(T1 + 5000), message: { role: "assistant", content: [{ type: "tool_use", id: "w", name: "Write", input: { file_path: join(cwd56, "x.txt") } }] } },
      { type: "user", timestamp: iso(T1 + 6000), message: { role: "user", content: [{ type: "tool_result", tool_use_id: "w", content: "ok" }] } },
      { type: "assistant", timestamp: iso(T1 + 30000), message: { role: "assistant", content: [{ type: "text", text: texte }] } },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n";
    const SANS_HORLOGE = [{ t: T0, commande: "git status", sortie: "rien à valider" }, { t: T1, commande: "node oracles/oracle-synthese.mjs x.md", sortie: "PASS" }];
    const AVEC_HORLOGE = [{ t: T0, commande: "date", sortie: `${jour(T0)} ${local(T0)}:30` }, { t: T1, commande: "date +%H:%M", sortie: local(T1) }];
    const hook56 = (nom, texte, sorties, env = {}) => {
      const p = join(base, `tour-56-${nom}.jsonl`); writeFileSync(p, sorties ? tour56(texte, sorties) : transcript(texte, ["Write"]), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: cwd56, env: { ...ENV_SANS_SESSION, ...env }, input: JSON.stringify({ session_id: "t56", transcript_path: p, stop_hook_active: false, cwd: cwd56 }) });
      try { return { o: JSON.parse(r.stdout || "null"), p }; } catch { return { o: null, p }; }
    };
    // T2 (TF-1947, 26/10/2026) : S84 reste AVERTISSANTE, son échéance du 28/10/2026 est levée (`BLOQUANTES_DATEES` vide). Adapté :
    // 56 attendait l'avertissement avec la date d'échéance, 56 bis le refus à l'échéance, 56 quinquies l'échéance au préjugement ;
    // tous attendent désormais l'avertissement S84 sans date ni refus, l'heure, la durée et le remède nommés.
    const avant = hook56("rouge-avant", ROUGE56, SANS_HORLOGE, { FORGE_S84_BLOQUANTE_DES: "2099-01-01" }).o;
    if (avant?.decision === "block" || !/S84 — /.test(avant?.systemMessage || "") || /S84 \(bloquante/.test(avant?.systemMessage || "")
      || !/19:52/.test(avant?.systemMessage || "") || !/durée 4 min/.test(avant?.systemMessage || ""))
      echecs.push(`56 : le cas réel du 20/10 (19:52, durée 4 min, aucun relevé) doit être DIT sans échéance (T2), l'heure et la durée nommées, obtenu ${JSON.stringify(avant).slice(0, 320)}`);
    const { o: apres, p: pRouge } = hook56("rouge-apres", ROUGE56, SANS_HORLOGE, { FORGE_S84_BLOQUANTE_DES: "2026-01-01" });
    if (apres?.decision === "block" || !/S84 — /.test(apres?.systemMessage || "") || !/se RELÈVE dans le tour/.test(apres?.systemMessage || ""))
      echecs.push(`56 bis : même avec l'ancienne échéance passée, le MÊME en-tête composé reste AVERTI sur S84 (T2), le remède dit, obtenu ${JSON.stringify(apres).slice(0, 320)}`);
    const vert = hook56("vert-apres", VERTE56, AVEC_HORLOGE, { FORGE_S84_BLOQUANTE_DES: "2026-01-01" }).o;
    if (vert !== null) echecs.push(`56 ter : un en-tête qui recopie l'heure lue par \`date\` et l'écart des deux relevés (30 min) doit passer en silence, obtenu ${JSON.stringify(vert).slice(0, 320)}`);
    const sansTs = hook56("sans-horodatage", ROUGE56, null, { FORGE_S84_BLOQUANTE_DES: "2026-01-01" }).o;
    if (sansTs !== null && /S84/.test(JSON.stringify(sansTs))) echecs.push(`56 quater : un transcript sans horodatage ne se mesure pas — S84 ne doit rien accuser, obtenu ${JSON.stringify(sansTs).slice(0, 300)}`);
    // `--prejuger` : avec la transcription, S84 est jouée et dite ; sans elle, la sortie dit ce que la règle ne peut pas juger.
    const fb56 = join(base, "brouillon-56.md"); writeFileSync(fb56, ROUGE56, "utf8");
    const pj = spawnSync(process.execPath, [HOOK, "--prejuger", fb56, "--transcript", pRouge], { encoding: "utf8", cwd: cwd56, env: { ...ENV_SANS_SESSION, FORGE_S84_BLOQUANTE_DES: "2099-01-01" } });
    let pjo = null; try { pjo = JSON.parse(pj.stdout || "null"); } catch { /* illisible */ }
    if (!/S84 jouée sur 0 relevé/.test(pjo?.horloge || "") || !(pjo?.avertissements || []).includes("S84"))
      echecs.push(`56 quinquies : --prejuger avec la transcription doit jouer S84 et la dire en avertissement, sans échéance (T2), obtenu ${JSON.stringify(pjo).slice(0, 320)}`);
    const pn = spawnSync(process.execPath, [HOOK, "--prejuger", fb56], { encoding: "utf8", cwd: cwd56, env: ENV_SANS_SESSION });
    let pno = null; try { pno = JSON.parse(pn.stdout || "null"); } catch { /* illisible */ }
    if (!/S84 non jouée : transcription introuvable/.test(pno?.horloge || "") || !/seule S69 juge l'heure/.test(pno?.horloge || ""))
      echecs.push(`56 sexies : --prejuger sans transcription doit dire que S84 n'est pas jouée et ce qui juge l'heure à sa place, obtenu ${JSON.stringify(pno).slice(0, 320)}`);
  }

  // 57 — TF-1947 (26/10/2026, D-75 (c)) : LA RÉPONSE COURTE VAUT POUR TOUT TOUR QUI N'A RIEN ÉCRIT, quel que soit le nombre de commandes
  // de lecture. ROUGE DEVENU VERT : une question, cinq commandes de lecture (dont le `--pre-vol` de la réponse par heredoc, que
  // NIVEAUX.md prescrit, et dont le corps porte une citation « > … git push … »), puis une réponse courte : jugée tour de travail
  // jusqu'au 26/10 (5 commandes, seuil 4) et refusée sur S1, S3, S4 et S6 ; laissée passer depuis. TOUJOURS JUGÉS : la MÊME réponse
  // dans un tour qui a écrit un fichier, et dans un tour de 2 commandes dont l'une commite par `git -C … commit` (exempté jusque-là,
  // moins de 4 commandes) ; une redirection vers un fichier du dépôt est une écriture, vers le dossier temporaire non. Et une réponse
  // courte qui dit « oui » à une question de complétude sans « Mesuré sur » est refusée sur COMPLÉTUDE SANS exiger de restitution,
  // le remède (la ligne « Mesuré sur ») passe. Le pré-vol relit la transcription et le dit avant l'affichage, dans les deux sens.
  {
    const cwd57 = mkdtempSync(join(base, "hors-57-"));
    const QUESTION = "est-ce que le rappel de revue part sans session ouverte ?";
    const COURTE = "Niveau : Simple\n\nNon, le rappel vient seulement à l'ouverture d'une session.\n- Après 7 jours sans revue, elle affiche « revue DUE ».\n"
      + "- Sans session ouverte, rien ne se passe.\n\nSource : `oracles/hook-ouverture.mjs:448`.";
    const PREVOL = "node oracles/hook-restitution.mjs --pre-vol <<'EOF'\n" + COURTE + "\n> citation : git push origin main\nEOF";
    const LECTURES = ["git log --oneline -5", "grep -n revue oracles/hook-ouverture.mjs", "cat references/NIVEAUX.md | head -40",
      "node --check oracles/hook-ouverture.mjs", PREVOL];
    const bash = (command) => ({ name: "Bash", input: { command } });
    const tour57 = (humain, outils, final) => [
      { type: "user", message: { role: "user", content: humain } },
      ...outils.flatMap((o, i) => [
        { type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", id: `t57-${i}`, name: o.name, input: o.input }] } },
        { type: "user", message: { role: "user", content: [{ type: "tool_result", tool_use_id: `t57-${i}`, content: "ok" }] } },
      ]),
      { type: "assistant", message: { role: "assistant", content: [{ type: "text", text: final }] } },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n";
    const jouer57 = (nom, humain, outils, final) => {
      const p = join(base, `tour-57-${nom}.jsonl`); writeFileSync(p, tour57(humain, outils, final), "utf8");
      const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: cwd57, env: ENV_SANS_SESSION,
        input: JSON.stringify({ session_id: "test-57", transcript_path: p, stop_hook_active: false, cwd: cwd57 }) });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { o = { brut: r.stdout }; }
      return { o, p };
    };
    const lecture = jouer57("lecture-cinq", QUESTION, LECTURES.map(bash), COURTE);
    if (lecture.o !== null)
      echecs.push(`57 : une question, 5 commandes de lecture et une réponse courte → attendu NON jugée (D-75 (c)), obtenu ${JSON.stringify(lecture.o).slice(0, 300)}`);
    const an57 = analyserTranscript(readFileSync(lecture.p, "utf8"));
    if (an57.travail || an57.ecrituresDuTour.length || an57.commandes !== 5)
      echecs.push(`57 bis : 5 commandes de lecture, heredoc compris, ne sont pas une écriture — obtenu travail=${an57.travail}, `
        + `commandes=${an57.commandes}, écrit : ${an57.ecrituresDuTour.join(" ; ")}`);
    const ecrit = jouer57("lecture-et-ecriture", QUESTION, [...LECTURES.map(bash), { name: "Write", input: { file_path: join(cwd57, "note.md") } }], COURTE);
    if (ecrit.o?.decision !== "block" || !/S1 —/.test(ecrit.o.reason || "") || !/Jugé parce que : tour de travail[^\n]*écrit : Write de /.test(ecrit.o.reason || ""))
      echecs.push(`57 ter : la MÊME réponse dans un tour qui a écrit un fichier → attendu jugée et refusée (S1), l'écriture nommée, obtenu ${JSON.stringify(ecrit.o).slice(0, 300)}`);
    const commit = jouer57("deux-commandes-commit", QUESTION, [bash("git status"), bash(`git -C "${cwd57.replace(/\\/g, "/")}" commit -m correctif`)], COURTE);
    if (commit.o?.decision !== "block" || !/git commit/.test(commit.o.reason || ""))
      echecs.push(`57 quater : un tour de 2 commandes dont un \`git -C … commit\` → attendu jugé (ni commit ni push), obtenu ${JSON.stringify(commit.o).slice(0, 300)}`);
    const redir = analyserTranscript(tour57(QUESTION, [bash("git log -1 > rapport.txt")], COURTE));
    if (!redir.travail || !redir.ecrituresDuTour.some((x) => /rapport\.txt/.test(x)))
      echecs.push(`57 quinquies : \`git log -1 > rapport.txt\` est une écriture par commande, obtenu ${redir.ecrituresDuTour.join(" ; ") || "aucune"}`);
    const temp = analyserTranscript(tour57(QUESTION, [bash(`git log -1 > ${join(tmpdir(), "rapport.txt").replace(/\\/g, "/")}`)], COURTE));
    if (temp.travail) echecs.push(`57 sexies : une redirection vers le dossier temporaire n'est pas une écriture du tour (NIVEAUX.md 1.3.0), obtenu ${temp.ecrituresDuTour.join(" ; ")}`);
    const COMPLETUDE57 = "Est-ce que le reste du site a été mis à jour ?";
    const oui = jouer57("oui-completude", COMPLETUDE57, LECTURES.slice(0, 4).map(bash), "Oui, tout le site est à jour.");
    if (oui.o?.decision !== "block" || !/réponse courte/.test(oui.o.reason || "") || !/COMPLÉTUDE — /.test(oui.o.reason || "") || /S1 —/.test(oui.o.reason || ""))
      echecs.push(`57 septies : un « oui » court à une question de complétude sans « Mesuré sur » → attendu refusé sur COMPLÉTUDE sans restitution exigée, obtenu ${JSON.stringify(oui.o).slice(0, 300)}`);
    const ouiMesure = jouer57("oui-completude-mesure", COMPLETUDE57, LECTURES.slice(0, 4).map(bash),
      "Oui, tout le site est à jour.\n\nMesuré sur : sitemap.xml du site en ligne, relue à 16:40, périmètre 273 pages");
    if (ouiMesure.o !== null)
      echecs.push(`57 octies : le MÊME « oui » avec sa ligne « Mesuré sur » (le remède) → attendu laissé passer, obtenu ${JSON.stringify(ouiMesure.o).slice(0, 300)}`);
    const pv57 = (p) => {
      const r = spawnSync(process.execPath, [HOOK, "--pre-vol", "--transcript", p], { encoding: "utf8", cwd: cwd57, env: ENV_SANS_SESSION, input: COURTE });
      let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* illisible */ }
      return { code: r.status, o };
    };
    const pvL = pv57(lecture.p), pvE = pv57(ecrit.p);
    if (pvL.code !== 0 || pvL.o?.rendable_sans_restitution !== true || !Array.isArray(pvL.o?.ecritures_du_tour) || pvL.o.ecritures_du_tour.length)
      echecs.push(`57 nonies : --pre-vol sur le tour de lecture → attendu rendable, aucune écriture relevée, obtenu ${pvL.code} ${JSON.stringify(pvL.o).slice(0, 260)}`);
    if (pvE.code !== 1 || pvE.o?.rendable_sans_restitution !== false || !(pvE.o?.ecritures_du_tour || []).some((x) => /^Write de /.test(x)))
      echecs.push(`57 decies : --pre-vol sur le tour qui a écrit → attendu non rendable, l'écriture nommée, obtenu ${pvE.code} ${JSON.stringify(pvE.o).slice(0, 260)}`);
    if (pvL.o?.lecture_par_commande !== "relecture-intention")
      echecs.push(`57 undecies : la lecture des écritures par commande doit être celle de la relecture d'intention, obtenu ${pvL.o?.lecture_par_commande}`);
  }

  // 58 — T2 (TF-1947, 26/10/2026, D-68 (a) et D-75 (c)) : LE COMPTE RENDU COMPLET ALLÉGÉ AU HOOK DE FIN DE TOUR, DANS SES SIX SENS.
  // VERTS : BON privé de ses blocs 2, 6 et 7 passe sans refus ; une décision au format B AVEC son tableau d'options passe sans refus ;
  // des actions sans ordre justifié (S6) ne sont plus qu'averties. ROUGES : BON privé de son bloc 9 est refusé sur S1, le bloc nommé ; la MÊME
  // décision au format B SANS son tableau est refusée sur S4, le tableau nommé ; un verdict sans fait mesuré reste refusé (S3,
  // exception qui protège un fait).
  {
    const retirer58 = (texte, n) => texte.replace(new RegExp(`## ${n}\\.[^\\n]*\\n[\\s\\S]*?(?=## \\d\\.|$)`), "");
    const ALLEGEE = [2, 6, 7].reduce(retirer58, BON);
    const SANS9 = retirer58(BON, 9);
    const TETE_B = "> **D-1 — Publier maintenant la version corrigée du démarrage, ou attendre demain matin ?**\n>\n"
      + "> - **De quoi s'agit-il** : la version corrigée du démarrage, prête depuis la recette verte du pilot.\n"
      + "> - **Le problème** : 22 contrôles verts, et une nuit de plus sans dernier regard humain avant qu'elle circule.\n"
      + "> - **Pourquoi vous** : publier hors du poste est un geste humain.\n"
      + "> - **Recommandation : (a)** — le journal `recette.md` ne porte aucun défaut ouvert. Source consultée : `recette.md`.\n\n";
    const TABLEAU = "| Option | Ce qui se passe | Coût | Retour arrière |\n|---|---|---|---|\n"
      + "| (a) pousser maintenant | la version circule ce soir | nul | revenir au commit précédent |\n"
      + "| (b) pousser demain matin | un poste périmé une nuit | une nuit | sans objet |\n\n";
    const PUCES = "- (a) pousser maintenant — coût nul.\n- (b) pousser demain matin — une nuit de retard.\n\n";
    const bloc3 = (corps) => BON.replace(/## 3\. Décisions attendues[\s\S]*?(?=## 4\.)/, `## 3. Décisions attendues\n\n${TETE_B}${corps}> **Sans réponse** : (b), rien ne part ce soir.\n\n`);
    const AVEC_TABLEAU = bloc3(TABLEAU), SANS_TABLEAU = bloc3(PUCES);
    const SANS_ORDRE = BON.replace(" (d'abord, parce que gratuit)", "").replace(" (ensuite, parce que tout le reste en dépend)", "");
    const VERDICT_NU = BON.replace("- Recette du pilot 22/22 verte, bootstrap 7/7.", "- Tout s'est bien passé.");
    if ([ALLEGEE, SANS9, AVEC_TABLEAU, SANS_TABLEAU, SANS_ORDRE, VERDICT_NU].some((t) => t === BON) || AVEC_TABLEAU === SANS_TABLEAU)
      echecs.push("58 : une fixture n'a pas été modifiée — le cas ne prouve plus rien");
    const r58 = (nom, texte) => lancer(nom, texte, ["Write", "Edit"]).decision;
    const a = r58("t2-allegee", ALLEGEE);
    if (a?.decision === "block") echecs.push(`58 : BON sans ses blocs 2, 6 et 7 → attendu sans refus (leur absence n'est plus un défaut), obtenu ${String(a.reason).slice(0, 260)}`);
    const b = r58("t2-sans-9", SANS9);
    if (b?.decision !== "block" || !/S1 — bloc\(s\) toujours présent\(s\) absent\(s\) : 9\. Traces/.test(b.reason || ""))
      echecs.push(`58 bis : BON sans son bloc 9 → attendu refusé sur S1, le bloc 9 nommé, obtenu ${JSON.stringify(b).slice(0, 260)}`);
    const c = r58("t2-format-b-tableau", AVEC_TABLEAU);
    if (c?.decision === "block") echecs.push(`58 ter : une décision au format B avec son tableau d'options → attendu sans refus, obtenu ${String(c.reason).slice(0, 260)}`);
    const d = r58("t2-format-b-sans-tableau", SANS_TABLEAU);
    if (d?.decision !== "block" || !/S4 — D-1 posée\(s\) au format B sans son TABLEAU d'options/.test(d.reason || ""))
      echecs.push(`58 quater : la MÊME décision au format B sans son tableau → attendu refusée sur S4, le tableau nommé, obtenu ${JSON.stringify(d).slice(0, 260)}`);
    const e = r58("t2-sans-ordre", SANS_ORDRE);
    if (e?.decision === "block" || !/S6 — prochaines actions sans justification d'ordre/.test(e?.systemMessage || ""))
      echecs.push(`58 quinquies : des actions sans ordre justifié (S6) → attendu l'avertissement S6 sans refus (T2), obtenu ${JSON.stringify(e).slice(0, 260)}`);
    const f = r58("t2-verdict-nu", VERDICT_NU);
    if (f?.decision !== "block" || !/S3 — verdict sans fait mesurable/.test(f.reason || ""))
      echecs.push(`58 sexies : un verdict sans fait mesuré → attendu refusé sur S3 (exception qui protège un fait), obtenu ${JSON.stringify(f).slice(0, 260)}`);
  }
} catch (e) { echecs.push(`harnais : ${String(e).slice(0, 200)}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

if (echecs.length) { console.error("hook-restitution : FAIL\n  - " + echecs.join("\n  - ")); process.exit(1); }
console.log("hook-restitution : 58/58 — LE COMPTE RENDU COMPLET ALLÉGÉ (cas 58, T2, TF-1947, 26/10/2026 : sans les blocs 2, 6 et 7 sans refus ; sans le bloc 9 refusé sur S1 ; une décision au format B sans son tableau refusée sur S4, avec lui sans refus ; un verdict sans fait mesuré refusé sur S3 ; des actions sans ordre justifié averties sur S6 ; et, adaptés, GESTE (15), PROCÉDURE (37), S48 (45), S80 (50), DÉTAIL (51), S83 (55) et S84 (56) avertis au lieu de refusés, la détection inchangée) ; LA RÉPONSE COURTE VAUT POUR TOUT TOUR QUI N A RIEN ÉCRIT (cas 57, TF-1947, D-75 (c), 26/10/2026 : une question, 5 commandes de lecture dont le pré-vol par heredoc et une réponse courte, refusée jusque-là, passe ; la même dans un tour qui écrit un fichier, ou de 2 commandes dont un `git -C … commit`, reste jugée ; une redirection vers le dépôt est une écriture, vers le dossier temporaire non ; un « oui » court à une question de complétude sans « Mesuré sur » est refusé sans restitution exigée et son remède passe ; le pré-vol relit la transcription dans les deux sens) ; UNE DEMANDE D AVIS PORTE LE LIEN DU CONTENU (S83, TF-1936 : le cas réel « guide de mon message de 21:45 » dit avant le 28/10 et refusé à l échéance, le remède joué en silence) et L HEURE DU BLOC 1 SE RELÈVE DANS LE TOUR (S84, TF-1938 : « 19:52, durée 4 min » sans relevé dit puis refusé, l en-tête recopié de deux `date` en silence, un transcript sans horodatage non accusé, --prejuger avec et sans transcription) ; UNE AFFIRMATION D EXHAUSTIVITE PORTE SA LIGNE « Mesuré sur » (S82, bloquante) et UN « OUI » A UNE QUESTION DE COMPLETUDE AUSSI (contrôle COMPLÉTUDE, bloquant, seul à lire le dernier message humain) : le « oui » du 15/10 (RT-126) sans ligne est refusé par le hook de fin de tour et par --prejuger, avec la ligne « Mesuré sur : <source amont>, relue à HH:MM, périmètre <n> » il passe, la liste de l auteur (« mes marqueurs ») et la formule « Mesuré contre » restent refusées, un « non » n est pas l affirmation (cas 54, TF-1866, D-29 (a), 18/10/2026) ; LA MÊME RÉSERVATION AU PILOT (cas 53, TF-1872, D-32 (a), 18/10/2026) : une D-N nouvelle absente du registre decisions/REGISTRE.jsonl est AVERTIE jusqu au 2026-10-25 puis REFUSÉE, une D-N déjà prise pour une AUTRE question est nommée avec la question inscrite, les remèdes sont joués (scripts/reserver-decision.mjs --question rend et inscrit le numéro suivant, --reformuler garde le numéro d une décision réécrite), une D-N nommée par l humain, citée par le message précédent ou rappelée en une ligne n est pas nouvelle, un registre introuvable est dit sans accuser ; une D-N NOUVELLE du bloc 3 est inscrite au registre du produit est inscrite au registre du produit (une entrée question_humain de forge/ledger.jsonl qui la nomme) AVANT l affichage : non inscrite, elle est AVERTIE jusqu à l échéance du 2026-11-01 puis REFUSÉE par le hook de fin de tour et par --prejuger, le remède recommandé (ledger.py question_humain --decision D-N) est joué et lève le refus, un rappel d une ligne (S4), une D-N déjà à l écran ou nommée par l humain (61a, 61 détaille) ne sont pas jugés, et une forge ou un dossier hors pilot et hors produit n a pas de registre (cas 52, TF-1849, 18/10/2026) ; une demande de détail l emporte sur le rappel d une ligne (S4) : « 51 détaille », « détaille la 51 » reconnus et « étape 3 détaille », « TF-1851 détaille » épargnés, la décision rappelée en une ligne, absente ou reposée sans options REFUSÉE par le hook de fin de tour et par --prejuger, la décision reposée en entier ou remplacée par des décisions détaillées qui la citent acceptée (cas 51, TF-1851, 18/10/2026) ; S80 (E-11 sur le Markdown, TF-1847, 18/10/2026) est BLOQUANTE : une énumération « 1) … 2) … 3) » sur une ligne du bloc 4 est refusée par --prejuger et par le hook de fin de tour, la MÊME information en liste est affichable, la forme montrée entre guillemets français n est pas refusée, et le guide en paragraphe n est qu averti par S81 (cas 50) ; un document de projet marqué par son gabarit n est plus jugé à la place de la restitution, une synthèse nommée reste comparée, et --prejuger rend le même refus AFFICHAGE avant l affichage en relisant le transcript, la comparaison non jouée étant dite (cas 49, TF-1720, 15/10/2026) ; une explication demandée rendue en restitution sans fiche est dite en avertissement EXPLICATION, et la fiche écrite ou citée la lève (cas 48, TF-1641, 14/10/2026) ; un message d attente de 3 lignes au plus n est pas jugé tant qu une tâche d arrière-plan du tour n est pas revenue, et il redevient jugé sans tâche, tâche revenue ou verdict porté (cas 47, TF-1649, 14/10/2026) ; --prejuger rend le verdict bloquant du hook avant affichage, et un refus sans préjugement le dit comme un défaut distinct (cas 46, TF-1647, TF-1666, 14/10/2026) ; S48 est jugée au hook chez un produit, bloquante, et « rien à remonter » passe (cas 45, TF-1644, 14/10/2026) ; « seul l humain la détient » est lu contre les messages humains de la session, avertissement dans ses quatre sens sans jamais recopier la valeur (cas 44, TF-1514, 13/10/2026) ; l option --pre-vol que NIVEAUX.md prescrit est jouée dans ses deux sens, Simple et Moyen (cas 43, CP3, 12/10/2026) ; le RAPPEL ne peut plus citer une version du gabarit différente de la sienne (cas 42, TF-1228, 02/10/2026) ; un rappel de D-N en PUCE, forme complète question comprise, est vu comme une décision reposée, et l identifiant seul suivi d un tiret sans question ne l est plus (cas 40 et 41, TF-1468, 28/09/2026) ; une décision CITÉE dans la prose n est plus prise pour une décision posée, une décision posée par sélecteur reste jugée (cas 38 et 39, 01/10/2026) ; une PROCÉDURE demandée reçoit le guide en tête (TF-1361) : les cinq demandes de la soirée du 22/09 reconnues et les quatre autres messages épargnés, le contrôle dans ses trois sens, et de bout en bout un message aux gestes en lignes d'action REFUSÉ sous une demande de procédure, le même guidé et sourcé accepté, le même sous un message qui ne demande rien seulement averti ; le SCEAU d une synthese se pose sans geste humain sur le fichier ECRIT dans le tour, le redepot juge le met a jour (53 couples (session, fichier) sur 238 au journal de ce depot, 22,3 %), une retouche faite APRES le dernier jugement reste un ecart J-1, et un tour qui ne fait que RELIRE ne rescelle rien (TF-1081) ; un fichier ÉCRIT dans le tour prime sur un fichier relu du disque, la relecture restant un repli (TF-1187) ; un fichier de synthèse RENOMMÉ hors outil d'écriture est retrouvé en relisant le dossier du chemin disparu, le plus récemment modifié l'emportant quand deux fichiers marqués coexistent, et un chemin écrit PRÉSENT n'ouvre aucune relecture (TF-1184) ; relais d'avancement dans ses TROIS sens (TF-1182) : trois lignes après une synthèse déjà affichée et RIEN d'écrit depuis NON jugées, le MÊME message précédé d'une seule écriture JUGÉ (le trou de TF-0978 reste fermé), et le MÊME message posant une D-7 JUGÉ (les trois absences de TF-0990 tiennent) ; marqueur lu en tête de ligne et jamais dans la prose : le gabarit qui le CITE n'est plus jugé à la place de la synthèse du tour (correction du 17 septembre 2026), hors format refusé (S1 nommé), anti-boucle, conforme accepté, lecture non jugée, défaut de détail averti SANS réécriture, phrase de transition qui ne masque plus la restitution, transcript sans texte final NON jugé (TF-0516), verdict sans écriture JUGÉ et accusé de réception / question exemptés (TF-0904), blocs 3 et 8 du fichier jugé retrouvés à l'écran — tableau d'options, sélecteurs A-N, acteurs du vocabulaire gelé (TF-0891), verdict du bloc 2 mesurant les mêmes faits des deux côtés — écran enrichi sans redépôt REFUSÉ, identifiants et dates non comptés (TF-0918), décision reçue et GESTE absent REFUSÉ — restitution rejouée mot pour mot et D-N reposée au bloc 3 —, geste exécuté accepté, message humain qui n'est pas un sélecteur hors contrôle, formes du sélecteur reconnues et prose épargnée (TF-1019), exemption « rien de neuf » dans ses DEUX sens — un accusé de trois lignes sans verdict ni D-N NON jugé, le même message posant une D-N JUGÉ (TF-0990)");
