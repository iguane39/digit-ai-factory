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
import { comparerAffiche, controlerGeste, syntheseDuTour } from "./hook-restitution.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "hook-restitution.mjs");
const ORACLE = join(ICI, "oracle-synthese.mjs");
const base = mkdtempSync(join(tmpdir(), "hook-rest-"));
const echecs = [];

const MAUVAIS = "J'ai corrigé le script et commité. Tout s'est bien passé, dis-moi si tu veux autre chose.";
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
  if (r2.decision !== null) echecs.push("2 : stop_hook_active → attendu laisser passer (anti-boucle)");

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

  const d15 = lancerFichier(join(FIXTURES, "geste-rouge.jsonl"));
  if (d15?.decision !== "block")
    echecs.push(`15 bis : « 11a » reçu, restitution rejouée mot pour mot → attendu block, obtenu ${JSON.stringify(d15).slice(0, 200)}`);
  else {
    if (!/GESTE — décision D-11 \(a\) reçue, geste absent : le message de fin de tour est identique au précédent/.test(d15.reason))
      echecs.push(`15 ter : le refus ne nomme pas le message identique au précédent — ${String(d15.reason).slice(0, 220)}`);
    if (!/la même D-11 est reposée au bloc 3/.test(d15.reason))
      echecs.push("15 quater : le refus ne nomme pas la décision reposée au bloc 3");
    if (!/PREUVE du geste au bloc 4/.test(d15.reason))
      echecs.push("15 quinquies : le refus ne porte pas le rappel court");
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
} catch (e) { echecs.push(`harnais : ${String(e).slice(0, 200)}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

if (echecs.length) { console.error("hook-restitution : FAIL\n  - " + echecs.join("\n  - ")); process.exit(1); }
console.log("hook-restitution : 34/34 — le SCEAU d une synthese se pose sans geste humain sur le fichier ECRIT dans le tour, le redepot juge le met a jour (53 couples (session, fichier) sur 238 au journal de ce depot, 22,3 %), une retouche faite APRES le dernier jugement reste un ecart J-1, et un tour qui ne fait que RELIRE ne rescelle rien (TF-1081) ; un fichier ÉCRIT dans le tour prime sur un fichier relu du disque, la relecture restant un repli (TF-1187) ; un fichier de synthèse RENOMMÉ hors outil d'écriture est retrouvé en relisant le dossier du chemin disparu, le plus récemment modifié l'emportant quand deux fichiers marqués coexistent, et un chemin écrit PRÉSENT n'ouvre aucune relecture (TF-1184) ; relais d'avancement dans ses TROIS sens (TF-1182) : trois lignes après une synthèse déjà affichée et RIEN d'écrit depuis NON jugées, le MÊME message précédé d'une seule écriture JUGÉ (le trou de TF-0978 reste fermé), et le MÊME message posant une D-7 JUGÉ (les trois absences de TF-0990 tiennent) ; marqueur lu en tête de ligne et jamais dans la prose : le gabarit qui le CITE n'est plus jugé à la place de la synthèse du tour (correction du 17 septembre 2026), hors format refusé (S1 nommé), anti-boucle, conforme accepté, lecture non jugée, défaut de détail averti SANS réécriture, phrase de transition qui ne masque plus la restitution, transcript sans texte final NON jugé (TF-0516), verdict sans écriture JUGÉ et accusé de réception / question exemptés (TF-0904), blocs 3 et 8 du fichier jugé retrouvés à l'écran — tableau d'options, sélecteurs A-N, acteurs du vocabulaire gelé (TF-0891), verdict du bloc 2 mesurant les mêmes faits des deux côtés — écran enrichi sans redépôt REFUSÉ, identifiants et dates non comptés (TF-0918), décision reçue et GESTE absent REFUSÉ — restitution rejouée mot pour mot et D-N reposée au bloc 3 —, geste exécuté accepté, message humain qui n'est pas un sélecteur hors contrôle, formes du sélecteur reconnues et prose épargnée (TF-1019), exemption « rien de neuf » dans ses DEUX sens — un accusé de trois lignes sans verdict ni D-N NON jugé, le même message posant une D-N JUGÉ (TF-0990)");
