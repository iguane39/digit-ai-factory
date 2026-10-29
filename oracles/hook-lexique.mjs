#!/usr/bin/env node
/**
 * hook-lexique.mjs — le lexique d'invocation (RV-6) devient un DÉTROMPEUR, pas une consigne.
 *
 * Hook `UserPromptSubmit` (pilot : `.claude/settings.json` ; produits : `forge/hooks/factory.mjs
 * lexique`, hérité). Il lit le message de l'humain sur stdin (JSON Claude Code, champ `prompt`),
 * reconnaît les mots-clés du lexique du noyau, et INJECTE dans le contexte l'appel du skill
 * attendu. Il ne bloque jamais (exit 0), il ne modifie pas le message, il ajoute une ligne.
 *
 * LE FAIT (mandat d'amélioration continue du 03/09/2026). Le lexique RV-6 existe au noyau
 * depuis TF-0177 (13/08) : « Améliore le prompt… » / « l99 » → prompt-analyzer-l99 · « barre… »
 * en tête → la-barre · « améliore/audite ce skill » → ameliore-un-skill. Le retour humain du
 * 03/09 dit, mot pour mot, « améliore le prompt plusieurs fois oublié ». Mesuré le même jour :
 * `.claude/settings.json` portait SessionStart, Stop et PostToolUse — AUCUN hook sur le message
 * humain. La règle tenait par discipline seule, c'est-à-dire qu'elle finissait par ne pas être
 * suivie (loi transverse n° 1 : une règle est câblée ou elle n'existe pas). Ce hook est le
 * mécanisme ; le texte du noyau reste la doctrine.
 *
 * Bornes, chacune voulue : « barre » ne déclenche qu'EN TÊTE de message (« la barre de menu »
 * au milieu d'une phrase n'est pas un appel) ; « prompt » seul ne déclenche rien (« le prompt
 * réécrit est bon » n'est pas une demande d'analyse) ; « améliore le design » ne déclenche
 * pas l'analyse de prompt. Un message qui matche plusieurs règles reçoit plusieurs lignes,
 * dans l'ordre du lexique — l'agent tranche, le hook ne choisit pas à sa place.
 *
 * Usage : stdin JSON → stdout (contexte ajouté) ; `--self-test` : 4 cas positifs, 3 négatifs.
 */
import { readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { racineDuProjet } from "./lib-racine-projet.mjs";

/** Le lexique, dans l'ordre du noyau. Chaque règle : motif sur le message ENTIER, skill, glose. */
export const LEXIQUE = [
  { skill: "prompt-analyzer-l99", motif: /^\s*(?:\/?l99\b|(?:am[ée]liore[rz]?|optimise[rz]?|analyse[rz]?|audite[rz]?)\s+(?:ce|le|mon|ton|ces|les|un|une|cette)?\s*prompts?\b)/iu, forme: "« Améliore le prompt… » / « l99 »" },
  // TF-1103 (14/09/2026) — « l99 » au milieu d'un message ne déclenche que comme MOT ISOLÉ, en
  // minuscules, hors code cité entre accents graves : collé à un identifiant (`prompt-analyzer-l99`),
  // pris dans un chemin, ou écrit « L99 » (une référence de règle, comme L4 ou L22 du socle), ce
  // n'est pas un appel. Le 14/09, deux notifications de fin de tâche l'ont déclenché ainsi.
  { skill: "prompt-analyzer-l99", motif: /(?<![\p{L}\p{N}_\-./\\])l99(?![\p{L}\p{N}_\-./\\])/u, forme: "« l99 » dans le message", secondaire: true, horsCode: true },
  { skill: "la-barre", motif: /^\s*\/?barre\b/iu, forme: "« barre… » en tête de message" },
  { skill: "ameliore-un-skill", motif: /^\s*(?:am[ée]liore[rz]?|audite[rz]?|durcis|fiabilise[rz]?|score[rz]?|r[ée]vise[rz]?|optimise[rz]?)\s+(?:ce|le|mon|ton|un|une|cette|la)?\s*skill\b/iu, forme: "« améliore/audite ce skill »" },
];

/**
 * LES CONSIGNES DE RÈGLE (R-57, décision humaine du 24/09/2026) — un message peut appeler une RÈGLE
 * et non un skill. Le fait : un lecteur juge la forme d'un document (« le format du guide […] et
 * l'usage des composants […] sont vraiment tops ») et demande qu'elle serve ailleurs. Sans détrompeur,
 * la remontée tenait à la mémoire de l'agent qui recevait le message — c'est-à-dire, un jour sur
 * deux, à rien. Deux formes reconnues : la DEMANDE (« en gabarit », « comme gabarit ») et le VERDICT
 * DE FORME (un mot de forme suivi, dans la même phrase, d'un adjectif d'éloge) — sauf si la phrase le
 * nie (« le format n'est pas top » ne déclare rien de mûr).
 */
const DEMANDE_GABARIT = /\b(?:en|comme)\s+(?:un\s+|une\s+)?gabarits?\b|\bgabarits?\s+(?:pour|à|a)\s+la\s+factory\b/iu;
const MOT_DE_FORME = /\b(?:format|forme|mise\s+en\s+(?:forme|page)|pr[ée]sentation|composants?|design)\b/giu;
const ELOGE = /\b(?:vraiment\s+|tr[èe]s\s+|super\s+|trop\s+|hyper\s+)?(?:tops?|parfaite?s?|excellente?s?|g[ée]niale?s?|superbes?|impeccables?|r[ée]ussie?s?|remarquables?)(?![\p{L}])/iu;
const NEGATION = /\b(?:pas|plus|jamais|gu[èe]re)\b|\bn['’]|\bne\s/iu;

/** Un verdict de forme : un mot de forme, puis un éloge dans la MÊME phrase, sans négation entre eux. */
export function verdictDeForme(message) {
  const texte = String(message || "");
  for (const m of texte.matchAll(MOT_DE_FORME)) {
    const suite = texte.slice(m.index, m.index + 200).split(/[.!?\n]/)[0];
    const e = ELOGE.exec(suite);
    if (e && !NEGATION.test(suite.slice(0, e.index + e[0].length))) return true;
  }
  return false;
}

/**
 * LA CONSIGNE DU PROCESSUS (décision humaine du 01/10/2026, réponse « 42a ») — un message humain qui
 * DÉCRIT ou CORRIGE un processus fixe ses étapes autant que ses acteurs. Le fait : chez un produit,
 * 7 retours humains en 4 heures, parce qu'une étape absente du processus avait été ajoutée 2 fois
 * (« Logiquement tu ne devrais rien demander à l'administrateur Entra avant que l'appli soit
 * déployée », puis « Non, cette étape doit être dans le pipeline »). Reconnu : dans une même
 * phrase, un mot d'ordre ou d'étape et une tournure de correction ou de prescription.
 */
const MOT_DE_PROCESSUS = /\b(?:processus|[ée]tapes?|pipeline|cha[îi]ne\s+de\s+(?:livraison|d[ée]ploiement))\b|\ben\s+amont\b|\bavant\s+(?:que|de|d['’])/iu;
const CORRECTION_DE_PROCESSUS = /(?:^|[\s:])non\s*,|\bne\s+(?:devrais|devrait|dois|doit|faut)\b|\bdoit\s+[êe]tre\b|\blogiquement\b|\bpas\s+de\s+\p{L}+[^.!?\n]*\ben\s+amont\b/iu;
export function correctionDeProcessus(message) {
  return String(message || "").split(/[.!?\n]/).some((p) => MOT_DE_PROCESSUS.test(p) && CORRECTION_DE_PROCESSUS.test(p));
}

/**
 * LA CONSIGNE DE L'AUDIT DU PRODUIT (TF-1735, décision humaine D-1 (a) du 15/10/2026) — « audit
 * complet » désigne forge-audit, et la demande de l'humain vaut mandat. Le fait : chez un produit,
 * « lance un audit complet du projet » a lancé forge_tests, la session citant la ligne « Audit complet
 * (verdict) » de son CLAUDE.md. La correction de TF-1206 (22/09) n'avait touché que le gabarit, et le
 * mot « audit » restait à forge-tests, qui nomme ainsi ses propres runs. Reconnu : dans une même
 * phrase, un mot d'audit et un objet qui est le produit entier. Épargné : l'audit SPÉCIALISÉ, quand le
 * mot qui suit l'audit nomme un autre objet (prompt, skill, SEO, sécurité, tests…) — ces demandes ont
 * leur skill ou leur forge. Limite assumée : « le rapport d'audit du projet est prêt » reçoit aussi la
 * ligne ; elle ne bloque rien et ne dit à la session que la route à suivre si audit il y a.
 */
const MOT_AUDIT = /\b(?:audit|audits|auditer|audite[rz]?)\b\s*(?:(?:des|du|de|d['’]|les|la|le|l['’]|cette|cet|ce|mon|ma|notre|son|sa)(?![\p{L}])\s*)*(\p{L}+)?/iu;
const AUDIT_SPECIALISE = /^(?:prompts?|skills?|seo|geo|s[ée]curit[ée]|websec|tests?|couverture|accessibilit[ée]|rgaa|traductions?|design|rendu|donn[ée]es|forge)$/iu;
const OBJET_PRODUIT = /\b(?:complet|compl[èe]te|global|globale|g[ée]n[ée]ral|projet|produit|appli|application|code|d[ée]p[ôo]t|repo|plateforme|site|gouvernance|maturit[ée]|poc[- ]to[- ]prod)\b/iu;
export function demandeAuditProduit(message) {
  return String(message || "").split(/[.!?\n]/).some((p) => {
    const a = MOT_AUDIT.exec(p);
    if (!a) return false;
    if (a[1] && AUDIT_SPECIALISE.test(a[1])) return false;
    return OBJET_PRODUIT.test(p);
  });
}

/**
 * LA QUESTION D'IMITATION (TF-1753, 15/10/2026, récidive de TF-1518 et TF-1542, classe
 * « processus-du-commanditaire-reattribue ») — « peut-on le faire comme X ? » demande si l'on peut
 * reproduire le procédé de X, pas s'il faut demander à X de le faire. Le fait : chez un produit,
 * l'humain demandait si le projet commun pouvait reproduire le tirage automatique que la factory
 * fait à l'ouverture de session ; la restitution a recommandé un lot de retours à la factory et
 * déclaré l'inscription directe « exclue ». Réponse : « Je n'ai pas dit de le demander à la
 * Factory ». Le geste tenait dans un hook d'ouverture et un script du projet commun. Reconnu : dans
 * une même phrase, un verbe de possibilité, le verbe faire et « comme X » (ou « à la manière de X »),
 * X n'étant ni « prévu », ni « d'habitude », ni « tu veux ».
 */
const POSSIBILITE = /\b(?:peu[tx]|peut-on|peux-tu|pourr(?:ait|ais|ions|iez|a|ons)|pourrait-on|pouvons|pouvez|possible)\b/iu;
const COMME_X = /\bfaire\b[^.!?\n]{0,80}?(?:\bcomme\s+(?!pr[ée]vu|d['’]habitude|tu\s+veux|vous\s+voulez|avant|[çc]a\b|cela|ceci|il\s+faut)\S+|(?<![\p{L}])[àa]\s+la\s+mani[èe]re\s+d[e'’])/iu;
export function questionDImitation(message) {
  return String(message || "").split(/[.!\n]/).some((p) => POSSIBILITE.test(p) && COMME_X.test(p));
}

export const CONSIGNES = [
  { regle: "audit", forme: "demande d'audit du produit",
    reconnait: demandeAuditProduit,
    texte: "Ce message demande un AUDIT DU PRODUIT : la route par défaut est forge-audit, et la demande de l'humain " +
      "vaut mandat (décision humaine D-1 (a) du 15/10/2026, TF-1735). Depuis `<FORGE_ROOT>\\digit-ai-forge-audit` : " +
      "`node tools/init-audit-workspace.mjs \"<racine du produit>\\forge\\audit\\<AAAAMMJJ>\"` crée l'espace du rapport ; " +
      "le `rapport-data.json` s'instruit contrôle par contrôle sur les dimensions de `core\\dimensions\\`, preuves " +
      "`fichier:ligne` ; `node tools/verifier-rapport.mjs <rapport-data.json>` est le gate bloquant avant diffusion, " +
      "`node tools/build-rapport.mjs` le rendu. forge_tests n'est PAS l'audit du produit : son rapport sert de preuve " +
      "à la dimension tests. Lancer forge_tests seul pour cette demande reproduit le défaut de TF-1206 et TF-1735." },

  { regle: "R-57", forme: "verdict de forme ou demande de gabarit",
    reconnait: (m) => DEMANDE_GABARIT.test(m) || verdictDeForme(m),
    texte: "Ce message porte un verdict humain sur la FORME d'un document, ou demande d'en faire un gabarit : " +
      "le document est MÛR DÉCLARÉ (REGLES-PROJET.md, R-57). Le remonter DANS CE TOUR : sa forme — une famille " +
      "de `gabarits\\documents\\` ou des composants —, jamais sa matière ; citer le verdict mot pour mot et daté " +
      "sous « ## Documents mûrs » du lot de retours. Ne pas le faire est un défaut de classe " +
      "« document-mur-non-remonte » (todo/CLASSES.json)." },
  { regle: "processus", forme: "processus décrit ou corrigé par l'humain",
    reconnait: correctionDeProcessus,
    texte: "Ce message décrit ou corrige un PROCESSUS — qui fait quoi, et dans quel ordre. Toute voie proposée " +
      "se relit contre lui ÉTAPE PAR ÉTAPE et ACTEUR PAR ACTEUR : une option qui ajoute une étape qu'il ne contient " +
      "pas, ou confie une étape à un autre acteur, est exclue. Si un fait technique semble l'exiger, mesurer d'abord " +
      "les voies automatiques (loi n° 5), puis poser UNE décision qui porte la voie tenant le processus tel quel et " +
      "son risque mesuré (gabarits\\RESTITUTION.md, bloc 3). Classe « processus-du-commanditaire-reattribue »." },
  { regle: "imitation", forme: "question « peut-on le faire comme X ? »",
    reconnait: questionDImitation,
    texte: "Ce message demande si l'on peut faire SOI-MÊME comme X : c'est une demande d'IMITATION, pas une délégation " +
      "à X. La réponse cherche d'abord la voie que porte celui qui pose la question (la session, le produit, le projet " +
      "commun : script, hook, étage de chaîne) en reprenant le procédé de X, et la mesure. Recommander de demander à X " +
      "de le faire (lot de retours, remontée, ticket) n'est admis que si cette voie propre est mesurée impossible, la " +
      "mesure citée (TF-1753). Classe « processus-du-commanditaire-reattribue »." },
];

/**
 * LE TEXTE DE L'HUMAIN, HORS CE QU'IL COLLE OU CITE (TF-1885, 19/10/2026). Le fait : « Améliore ce prompt : »
 * suivi d'un prompt collé qui parlait d'un audit complet du projet a reçu la route forge-audit au lieu de
 * prompt-analyzer-l99. Un prompt collé est la MATIÈRE de la demande, pas la demande : ses verbes d'audit, de
 * processus ou d'imitation ne sont pas ceux de l'humain. Sont retirés avant tout jugement de route : les blocs
 * balisés `<pasted_content>…</pasted_content>` (jusqu'à la fin si la balise n'est pas refermée), les blocs de
 * code clôturés (``` ou ~~~) et les lignes citées (`> …`). Limite assumée : un prompt collé SANS balise ni
 * citation, au milieu d'une phrase, n'est pas distingué du texte de l'humain.
 */
const BLOC_COLLE = /<pasted_content\b[^>]*>[\s\S]*?(?:<\/pasted_content>|$)/giu;
const BLOC_CLOTURE = /^[ \t]*(```|~~~)[^\n]*\n[\s\S]*?(?:\n[ \t]*\1[ \t]*(?=\n|$)|$)/gmu;
const LIGNE_CITEE = /^[ \t]*>[^\n]*/gmu;
export function texteDeLHumain(message) {
  return String(message || "").replace(BLOC_COLLE, " ").replace(BLOC_CLOTURE, " ").replace(LIGNE_CITEE, " ");
}

/**
 * Rend les consignes de règle reconnues dans un message (hors code cité, hors bloc collé ou cité) :
 * [{regle, forme, texte}]. TF-1885 : quand le message ouvre sur une FORMULE LITTÉRALE du lexique RV-6
 * (« Améliore ce prompt : », « barre… », « améliore ce skill »), la formule prime et le reste du message est
 * l'ENTRANT du skill (« retirer le mot-clé ; le reste = l'entrant », noyau, lexique RV-6) : aucune consigne de
 * règle n'est lue dans l'entrant, qui peut être n'importe quel texte, un prompt sur l'audit compris.
 */
export function reconnaitreConsignes(message) {
  if (reconnaitre(message).some((a) => a.primaire)) return [];
  const sansCode = texteDeLHumain(message).replace(/`[^`]*`/g, " ");
  return CONSIGNES.filter((c) => c.reconnait(sansCode));
}

/** Rend les appels reconnus dans un message : [{skill, forme, primaire}], sans doublon de skill. */
export function reconnaitre(message) {
  const vus = new Set(); const appels = [];
  const brut = texteDeLHumain(message);
  const sansCode = brut.replace(/`[^`]*`/g, " ");
  for (const r of LEXIQUE) {
    if (vus.has(r.skill) || !r.motif.test(r.horsCode ? sansCode : brut)) continue;
    vus.add(r.skill); appels.push({ skill: r.skill, forme: r.forme, primaire: !r.secondaire });
  }
  return appels;
}

/**
 * TF-1103 — le lexique ne parle qu'à un message HUMAIN. Une notification de fin de tâche d'agent,
 * un message inter-sessions ou un rappel système arrivent par le même canal (`UserPromptSubmit`)
 * et citent librement des noms de skills : ce ne sont pas des demandes.
 */
export function estMessageHumain(message) {
  return !MARQUEURS_NON_HUMAINS.test(String(message || ""));
}

/**
 * Les marqueurs qui disent « ceci ne vient pas de l'humain ».
 *
 * TF-1239 (19/09/2026) a ajouté le dernier, et c'est celui que l'entrée porte le plus souvent :
 * une notification de fin de sous-agent se DÉCLARE elle-même « NOT USER INPUT », en toutes
 * lettres, et cette déclaration-là n'était pas lue. Le 19/09, un rapport d'agent citant le
 * mot-clé du skill d'analyse de prompt a donc reçu « ce message est un APPEL du skill […] :
 * l'invoquer AVANT toute autre action », avec la menace d'une classe de défaut à la clé.
 * L'agent a refusé à bon droit ; un agent plus obéissant aurait lancé une analyse de prompt sur
 * le rapport d'un sous-agent. *Un détrompeur qui se déclenche sur autre chose que ce qu'il
 * détrompe apprend à passer outre, et c'est ainsi qu'on perd le détrompeur.*
 */
export const MARQUEURS_NON_HUMAINS =
  /<task-notification>|<cross-session-message|\[SYSTEM NOTIFICATION|<system-reminder>|NOT\s+USER\s+INPUT/i;

/** Le texte injecté dans le contexte — une ligne par appel de skill, puis par consigne de règle, ou rien. */
export function contexte(message) {
  const appels = reconnaitre(message).map((a) =>
    `[LEXIQUE RV-6 — hook-lexique] Ce message est un APPEL du skill \`${a.skill}\` (${a.forme}) : ` +
    `l'invoquer par l'outil Skill AVANT toute autre action ou réponse ; retirer le mot-clé, le reste du message est l'entrant. ` +
    `Ne pas l'invoquer est un défaut de classe « skill-non-invoque-lexique » (todo/CLASSES.json).`);
  const consignes = reconnaitreConsignes(message).map((c) => `[${c.regle} — hook-lexique] ${c.texte}`);
  return [...appels, ...consignes].join("\n");
}

/**
 * NIVEAUX D'INTERVENTION — étape 1 (TF-1418, décision humaine D-3 (a) du 25/09/2026 ; étude
 * `output/03-etudes/2026-09/20260925-etude-opportunite-niveaux-d-intervention.md`, verdict O3).
 *
 * LE FAIT. Mesuré sur 165 tours du pilot : une question courte attendait 6,3 minutes en médiane et
 * recevait 1 813 mots, parce qu'elle finissait presque toujours en restitution complète, alors que
 * l'exemption « réponse courte » existait. « vite : » en tête du message humain demande donc le
 * niveau Simple, la réponse directe de `references/NIVEAUX.md` ; « complet : » demande le niveau
 * Complexe ; « moyen : » demande le niveau Moyen, la réponse outillée en 4 pièces (étape 2, en
 * essai depuis le 01/10/2026 à la demande humaine). Mêmes bornes que le lexique : en tête seulement, message humain seulement.
 *
 * LA PORTÉE SUIT LE RÉFÉRENTIEL, et elle est tenue ici plutôt que promise. Ce hook est hérité par
 * les produits (lanceur `forge/hooks/factory.mjs lexique`). La ligne ne s'injecte que si le dossier
 * de la session porte le texte qu'elle cite : `references/NIVEAUX.md` au pilot, `forge/NIVEAUX.md`
 * chez un produit, copie conforme reçue par l'héritage (étape 3, décision humaine D-68 (a) du
 * 13/10/2026). Ailleurs, le mot-clé ne produit rien, et la ligne cite le chemin qui existe.
 */
export const NIVEAUX = [
  { niveau: "Simple", motif: /^\s*vite\s*:/iu, forme: "« vite : » en tête de message" },
  { niveau: "Moyen", motif: /^\s*moyen\s*:/iu, forme: "« moyen : » en tête de message" },
  { niveau: "Complexe", motif: /^\s*complet\s*:/iu, forme: "« complet : » en tête de message" },
];

/** Le niveau demandé par le message, ou null. Une seule demande : la première qui matche. */
export function reconnaitreNiveau(message) {
  const brut = String(message || "");
  const r = NIVEAUX.find((n) => n.motif.test(brut));
  return r ? { niveau: r.niveau, forme: r.forme } : null;
}

/** Le référentiel des niveaux que porte ce dossier : celui du pilot, celui hérité par un produit, ou null. */
export function referentielNiveaux(dossier) {
  for (const rel of [["references", "NIVEAUX.md"], ["forge", "NIVEAUX.md"]]) {
    try { if (dossier && existsSync(join(dossier, ...rel))) return rel.join("\\"); } catch { /* illisible : suivant */ }
  }
  return null;
}

/** La doctrine des niveaux est-elle en service dans ce dossier ? Là où son texte existe. */
export function niveauxEnService(dossier) {
  return referentielNiveaux(dossier) !== null;
}

/** Le texte injecté pour un niveau demandé — une ligne, ou rien. `ref` : le référentiel du dossier. */
export function contexteNiveau(message, ref = "references\\NIVEAUX.md") {
  const n = reconnaitreNiveau(message);
  if (!n) return "";
  if (n.niveau === "Simple") return `[NIVEAU — hook-lexique] L'humain demande le niveau Simple (${n.forme}) : ` +
    `retirer le mot-clé et répondre selon ${ref} — première ligne « Niveau : Simple », 150 mots au plus, ` +
    `lectures libres, 3 commandes au plus, aucune écriture, aucun mot de verdict ni décision ou action numérotée ; ` +
    `source citée, « Non vérifié » s'il le faut. Si la question dépasse ces bornes, le dire en une phrase et restituer ` +
    `en entier : le niveau ne descend jamais.`;
  if (n.niveau === "Moyen") return `[NIVEAU — hook-lexique] L'humain demande le niveau Moyen (${n.forme}) : ` +
    `retirer le mot-clé et répondre selon ${ref} — première ligne « Niveau : Moyen », puis 4 pièces dans ` +
    `cet ordre : **La réponse.** (150 mots au plus), **Preuves.** (une commande et sa sortie, ou un chemin et sa ligne), ` +
    `**Non vérifié.**, **Décision attendue.** (« Aucune. » ou une D-N complète) ; 400 mots au plus ; lectures et commandes ` +
    `de lecture libres, écriture seulement dans le dossier temporaire. Le premier effet (écriture du dépôt, commit, push, ` +
    `outil connecté qui écrit) fait monter le tour en Complexe : le dire en une phrase et restituer en entier.`;
  return `[NIVEAU — hook-lexique] L'humain demande le niveau Complexe (${n.forme}) : retirer le mot-clé ; ` +
    `process complet et restitution de gabarits\\RESTITUTION.md, quelle que soit la longueur de la question.`;
}

/**
 * LA LETTRE D'UNE DÉCISION OUVERTE (TF-1958, décision humaine D-76 (c) du 26/10/2026).
 *
 * LE FAIT. Quatre fois en 7 jours, un message humain sans lettre de décision (« exécute le prompt »,
 * « Fais 226 », « écris l'email ») a été pris pour le choix de l'option recommandée d'une décision
 * encore ouverte ; une fois, une conception a été dite « validée par vous » sans réponse. La préférence
 * est écrite (references/PREFERENCES-PORTEUR.md, 26/10) ; ce rappel la câble.
 *
 * LA RÈGLE. Quand le message humain ne cite AUCUNE lettre de décision (« 76c », « D-76 (c) », « 68a, 69a »,
 * reconnues par `numerosDeDecision` de scripts/relecture-intention.mjs, la fonction du dépôt) ET que le
 * DERNIER message de l'assistant, dans la transcription (`transcript_path`), posait au moins une décision
 * « > **D-N — … ?** » que nul message humain n'a tranchée depuis, le hook ajoute au contexte un rappel :
 * les D-N ouvertes, et la consigne de demander la lettre. Il ne bloque jamais.
 *
 * BORNES. Un sélecteur d'ACTION (« A1 », « A-2 ») n'est pas une décision, mais il est un choix explicite
 * de l'humain : il ne déclenche pas le rappel. Seule la forme « > **D-N — … ?** » pose une décision ; un
 * « D-99 (a) exécutée » ne la repose pas. Tout ce qui manque (transcription absente, illisible, import
 * impossible) rend le silence : un détrompeur qui échoue ne retient jamais le message.
 */
// Œil critique du 29/10/2026 : insensible à la casse, la forme lisait le verbe « a » suivi d'un nombre
// (« il y a 2 jours », « il a 3 options ») comme un sélecteur d'action, et taisait le rappel. Le « a »
// minuscule ne vaut sélecteur que collé au nombre (« a1 », « a-2 »).
const ACTION_CITEE = /(?<![\p{L}\p{N}_-])(?:A\s*-?\s*|a-?)\d{1,2}(?![\p{L}\p{N}])/u;
const DECISION_POSEE = /(?:^|\n)[ \t]*>[ \t]*\*{0,2}[ \t]*D[ \t]*-?[ \t]*(\d{1,3})[ \t]*\*{0,2}[ \t]*[—–-][^\n]*\?/g;
const QUEUE_DE_TRANSCRIPTION = 4 * 1024 * 1024;

/** Les enregistrements de la fin d'une transcription JSONL (les 4 derniers Mo au plus), ou []. */
export function enregistrementsFinaux(chemin) {
  try {
    const t = readFileSync(chemin);
    const coupe = t.length > QUEUE_DE_TRANSCRIPTION;
    const lignes = t.subarray(coupe ? t.length - QUEUE_DE_TRANSCRIPTION : 0).toString("utf8").split("\n");
    if (coupe) lignes.shift(); // la première ligne de la queue est tronquée
    return lignes.filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}

/**
 * Les décisions posées par le dernier message de l'assistant et non tranchées depuis : { numeros: ["99"], fin }.
 * `humain(rec)` rend le texte d'un enregistrement humain ou null ; `lettres(texte)` rend les numéros de décision cités.
 */
export function decisionsOuvertes(records, { humain, lettres }) {
  const texteDe = (r) => (r?.type === "assistant" && !r.isSidechain && Array.isArray(r.message?.content)
    ? r.message.content.filter((b) => b?.type === "text" && typeof b.text === "string").map((b) => b.text).join("\n") : "");
  let dernier = -1;
  for (let i = records.length - 1; i >= 0; i--) if (texteDe(records[i]).trim()) { dernier = i; break; }
  if (dernier < 0) return { numeros: [] };
  const id = records[dernier].message?.id;
  // Un même message peut courir sur plusieurs enregistrements (un par bloc) : on les réunit par identifiant.
  const rangs = records.map((r, i) => (i === dernier || (id && r?.message?.id === id && texteDe(r)) ? i : -1)).filter((i) => i >= 0);
  const texte = rangs.map((i) => texteDe(records[i])).join("\n");
  const posees = [...new Set([...texte.matchAll(DECISION_POSEE)].map((m) => String(Number(m[1]))))];
  const tranchees = new Set();
  for (const r of records.slice(Math.max(...rangs) + 1)) {
    const h = humain(r);
    if (h !== null) for (const n of lettres(h)) tranchees.add(String(Number(n)));
  }
  return { numeros: posees.filter((n) => !tranchees.has(n)) };
}

/** Le rappel injecté pour un message sans lettre devant des décisions ouvertes, ou "". Asynchrone : l'import du jugeur est paresseux. */
export async function contexteLettre(message, transcriptPath) {
  try {
    if (!transcriptPath) return "";
    const records = enregistrementsFinaux(transcriptPath);
    // Le coût d'un import (~100 ms) ne se paie que s'il y a une décision à protéger : le jugement du message vient après.
    const { numerosDeDecision, texteHumain } = await import("../scripts/relecture-intention.mjs");
    const { numeros } = decisionsOuvertes(records, { humain: texteHumain, lettres: numerosDeDecision });
    if (!numeros.length) return "";
    const brut = String(message || "");
    if (numerosDeDecision(brut).length || ACTION_CITEE.test(brut)) return "";
    const liste = numeros.map((n) => `D-${n}`).join(", ");
    return `[LETTRE — hook-lexique] Le dernier message de l'assistant posait ${numeros.length > 1 ? "des décisions" : "une décision"} encore ouverte${numeros.length > 1 ? "s" : ""} (${liste}) ` +
      `et ce message ne cite aucune lettre (« 76c ») : ce message ne cite aucune lettre : n'exécute aucune option de ces décisions, demande la lettre ` +
      `avant tout geste qui en dépend. Un message sans lettre n'est pas le choix de l'option recommandée (préférence du porteur du 26/10/2026, TF-1958).`;
  } catch { return ""; }
}

/**
 * LA GARDE DE RECETTE EST ANCRÉE SUR LE POINT D'ENTRÉE (TF-1291, décision humaine A-14 du
 * 22/09/2026).
 *
 * Elle lisait `process.argv` SEUL, au chargement du module. Conséquence mesurée le 22/09 : un
 * banc écrit pour un AUTRE contrôle, qui importe ce module, partait jouer la recette de
 * l'importé et affichait « hook-lexique : 13 PASS » — un vert qui n'était pas le sien, et pas un
 * seul cas du module testé n'était joué. Un banc neuf peut ainsi rendre le vert d'un autre, et
 * c'est la pire forme du faux vert : il est ACTIF, il compte, et il ne mesure rien.
 *
 * Le remède est l'idiome du dépôt : la recette ne part que si CE fichier est le point d'entrée.
 * Deux autres modules du dépôt l'importent, et ils sont donc protégés par la même ligne.
 */
const ESTLE_POINT_D_ENTREE = Boolean(process.argv[1]) && /hook-lexique\.mjs$/i.test(process.argv[1]);

if (ESTLE_POINT_D_ENTREE && process.argv.includes("--self-test")) {
  let pass = 0, fail = 0;
  const cas = [
    ["Améliore ce prompt : Concois et construis un système…", ["prompt-analyzer-l99"]],
    ["l99 sur ce texte : rédige un post LinkedIn", ["prompt-analyzer-l99"]],
    ["barre ce prompt : une console de données", ["la-barre"]],
    ["Améliore ce skill : quality-oracles déclenche mal", ["ameliore-un-skill"]],
    ["Le prompt réécrit est bon, on le garde tel quel", []],
    ["Améliore le design de la page d'accueil", []],
    ["Corrige la barre de menu qui déborde sur mobile", []],
    // TF-1103 : le mot isolé déclenche ; la référence de règle, l'identifiant, le code cité et le chemin non.
    ["l99 améliore ce prompt", ["prompt-analyzer-l99"]],
    ["puis passe-le au l99 avant envoi", ["prompt-analyzer-l99"]],
    ["Relevé : usages L99 (M2) dans le module", []],
    ["le skill `prompt-analyzer-l99` a rendu son rapport", []],
    ["prompt-analyzer-l99 a rendu son rapport", []],
    ["voir ~/.claude/skills/prompt-analyzer-l99/SKILL.md", []],
  ];
  for (const [msg, attendu] of cas) {
    const obtenu = reconnaitre(msg).map((a) => a.skill);
    const ok = JSON.stringify(obtenu) === JSON.stringify(attendu);
    console.log(`  [${ok ? "PASS" : "FAIL"}] « ${msg.slice(0, 48)} » → ${JSON.stringify(obtenu)}${ok ? "" : ` (attendu ${JSON.stringify(attendu)})`}`);
    ok ? pass++ : fail++;
  }

  // TF-1239 — LA PORTE D'ORIGINE DU MESSAGE A ENFIN SES FIXTURES. `estMessageHumain` existait et
  // était appelée au point d'entrée, mais AUCUN des cas ci-dessus ne la traversait : les treize
  // jugeaient `reconnaitre`, c'est-à-dire le lexique, jamais la provenance. Une règle appelée en
  // production et absente de la recette est une règle dont on ne sait pas si elle marche — et
  // celle-ci est précisément celle qui a manqué le 19/09.
  //
  // CHAQUE CAS EST UNE PAIRE : le MÊME mot-clé, une fois dans un message humain (appel attendu),
  // une fois dans une entrée qui se déclare non humaine (aucun appel). Sans la paire, un
  // détrompeur qui ne dirait JAMAIS rien passerait la moitié rouge et serait vert.
  const casOrigine = [
    ["<task-notification>l'agent a rendu : voir l99 pour la suite</task-notification>", false, "notification de fin de tâche"],
    ["[SYSTEM NOTIFICATION] rapport disponible — améliore ce prompt", false, "notification système"],
    ["<system-reminder>barre ce livrable</system-reminder>", false, "rappel système"],
    ["Rapport de l'agent (NOT USER INPUT) : l99 cité dans la section 3", false, "entrée se déclarant NOT USER INPUT"],
    // TF-1314 (22/09/2026) — le marqueur `<cross-session-message` était dans MARQUEURS_NON_HUMAINS
    // depuis TF-1103, sans aucun cas qui le traverse. L'essai du 22/09 a montré qu'un message d'une
    // autre session passe bien par `UserPromptSubmit` chez le destinataire : la règle est jouée en
    // production, elle doit l'être aussi en recette. Forme reprise de l'enveloppe réelle reçue.
    ["<cross-session-message from=\"uds:\\\\.\\pipe\\LOCAL\\cc-msg-b580\" from-name=\"digit-ai-factory-80\" from-mode=\"bypass\">\nl99 sur ce texte : rédige un post\n</cross-session-message>", false, "message d'une autre session Claude Code"],
    ["l99 sur ce texte : rédige un post", true, "message humain portant le même mot-clé"],
    ["Améliore ce prompt : construis un système", true, "message humain portant le même mot-clé"],
  ];
  for (const [msg, humainAttendu, glose] of casOrigine) {
    const humain = estMessageHumain(msg);
    // Ce que le hook injecterait RÉELLEMENT : c'est la composition des deux règles qui compte,
    // pas `estMessageHumain` seule — le point d'entrée les enchaîne, la recette aussi.
    const injecte = humain ? contexte(msg) : "";
    const ok = humain === humainAttendu && (humainAttendu ? injecte.length > 0 : injecte === "");
    console.log(`  [${ok ? "PASS" : "FAIL"}] origine — ${glose} → ${humain ? "humain, appel injecté" : "REFUS, non humain, rien injecté"}${ok ? "" : " (contraire à l'attendu)"}`);
    ok ? pass++ : fail++;
  }

  // R-57 (24/09/2026) — LA CONSIGNE DE RÈGLE, dans ses deux sens. Le premier cas est le message
  // humain qui a fondé la règle, mot pour mot ; les rouges sont les phrases voisines qu'un détrompeur
  // trop large prendrait pour un éloge — une négation, un gabarit qu'on corrige, un « top » de liste.
  const casConsignes = [
    ["Le format du guide du développeur et l'usage des composants utilisés, comme la recherche, les onglets, les menus sur le côté, la popup pour les fichiers MD, les chapitres, sous-chapitres sont vraiment tops. Enregistre ce document en gabarit pour la Factory", ["R-57"]],
    ["Enregistre ce rapport comme gabarit, on le réutilisera", ["R-57"]],
    ["La mise en page de ce rapport est excellente, garde-la", ["R-57"]],
    ["Les composants de ce tableau de bord sont parfaits", ["R-57"]],
    ["Le format n'est pas top, reprends les marges", []],
    ["Corrige le gabarit de restitution, il manque le bloc 3", []],
    ["Top 5 des corrections à faire avant l'envoi", []],
    ["Le prompt réécrit est bon, on le garde tel quel", []],
    ["le composant `format top` est cité dans le code", []],
    ["Logiquement tu ne devrais rien demander à l'administrateur Entra avant que l'appli soit déployée, que l'on arrive sur la page de l'application", ["processus"]],
    ["66 : Non, cette étape doit être dans le pipeline. Ajoute là au pipeline de prod", ["processus"]],
    ["Pas de demande d'inscription de l'appli en amont.", ["processus"]],
    ["Ajoute une étape de tests au run", []],
    ["Tu ne devrais pas utiliser ce mot dans le titre", []],
    ["Non, garde la version précédente", []],
    // TF-1735 (15/10/2026) — le premier cas est le message humain de la capture, mot pour mot ; les
    // rouges sont les audits spécialisés, qui ont leur skill ou leur forge, et le run de forge-tests.
    ["lance un audit complet du projet", ["audit"]],
    ["Audite le produit avant la mise en production", ["audit"]],
    ["Peux-tu auditer l'application ?", ["audit"]],
    ["Fais un audit de gouvernance du projet", ["audit"]],
    ["Relance les tests du projet", []],
    ["Audite ce skill : quality-oracles déclenche mal", []],
    ["Lance un audit SEO du site", []],
    ["Fais un audit de sécurité de l'application", []],
    ["Relance l'audit des tests du projet", []],
    ["l'audit forge-tests a rendu exit 3", []],
    // TF-1753 (15/10/2026, lot Produit-64 20261015a RT-69) — « peut-on le faire comme X ? » demande
    // une IMITATION, pas une délégation à X. Les verts reprennent la question de l'humain et ses
    // voisines ; les rouges sont les « comme » qui n'imitent personne, et la délégation explicite.
    ["Est-ce que le projet commun peut faire le tirage automatique comme la factory le fait à l'ouverture de session ?", ["imitation"]],
    ["Peut-on le faire comme la Factory ?", ["imitation"]],
    ["On pourrait faire comme le produit 12 pour la recette ?", ["imitation"]],
    ["Tu peux le faire à la manière de forge-ops ?", ["imitation"]],
    ["Fais comme tu veux pour les marges", []],
    ["Peut-on faire comme prévu demain ?", []],
    ["Demande à la Factory de le faire", []],
    ["Comme d'habitude, lance les tests", []],
  ];
  for (const [msg, attendu] of casConsignes) {
    const obtenu = reconnaitreConsignes(msg).map((c) => c.regle);
    const ok = JSON.stringify(obtenu) === JSON.stringify(attendu);
    console.log(`  [${ok ? "PASS" : "FAIL"}] consigne${attendu.length ? "" : " rouge"} « ${msg.slice(0, 48)} » → ${JSON.stringify(obtenu)}${ok ? "" : ` (attendu ${JSON.stringify(attendu)})`}`);
    ok ? pass++ : fail++;
  }
  // La porte d'origine vaut pour les consignes comme pour les skills : une notification qui cite un
  // éloge de forme n'est pas un verdict humain.
  {
    const note = "<task-notification>le format est vraiment top, en gabarit</task-notification>";
    const injecte = estMessageHumain(note) ? contexte(note) : "";
    const ok = injecte === "" && /R-57 — hook-lexique/.test(contexte(casConsignes[0][0]));
    console.log(`  [${ok ? "PASS" : "FAIL"}] consigne — une notification non humaine n'injecte rien, le message humain injecte R-57`);
    ok ? pass++ : fail++;
  }

  // TF-1885 (19/10/2026) — LA ROUTE SE JUGE SUR LE TEXTE DE L'HUMAIN, PAS SUR LE PROMPT QU'IL COLLE, ET LA
  // FORMULE LITTÉRALE DU LEXIQUE PRIME. Le fait : « Améliore ce prompt : » suivi d'un prompt collé qui parlait
  // d'un audit complet du projet a reçu la route forge-audit (consigne TF-1735) au lieu de prompt-analyzer-l99,
  // que le lexique RV-6 du noyau fait primer. Chaque rouge a son vert : le même texte HORS bloc collé garde sa route.
  const casCollage = [
    // [message, skills attendus, consignes attendues, glose]
    ["Améliore ce prompt :\n<pasted_content>Lance un audit complet du projet, puis corrige les écarts.</pasted_content>",
      ["prompt-analyzer-l99"], [], "le cas fondateur : prompt collé qui parle d'audit — l99 seul, pas forge-audit"],
    ["Améliore ce prompt : lance un audit complet du projet", ["prompt-analyzer-l99"], [],
      "même texte sans balise après la formule du lexique — la formule prime, le reste est l'entrant du skill"],
    ["Lance un audit complet du projet\n<pasted_content>Un prompt sans rapport.</pasted_content>", [], ["audit"],
      "VERT : la demande de l'humain, hors du bloc collé, garde sa route forge-audit"],
    ["Peux-tu auditer l'application ?\n> lance un audit SEO du site\n> et un test de charge", [], ["audit"],
      "VERT : la demande de l'humain avec une citation à côté garde sa route"],
    ["> lance un audit complet du projet\nmerci de me dire ce que tu en penses", [], [],
      "bloc cité : un audit cité n'est pas une demande d'audit"],
    ["Voici le prompt :\n```\nlance un audit complet du projet\n```\nmerci", [], [],
      "bloc de code : un audit dans un bloc de code n'est pas une demande"],
    ["Voici le rapport :\n<pasted_content>passe-le au l99 avant envoi</pasted_content>", [], [],
      "« l99 » dans un bloc collé n'appelle pas le skill"],
    ["Lance un audit complet du projet\n<pasted_content>Améliore ce prompt : sans rapport</pasted_content>", [], ["audit"],
      "une formule du lexique DANS un bloc collé n'appelle pas le skill et ne prime pas sur la demande d'audit de l'humain"],
  ];
  for (const [msg, skills, regles, glose] of casCollage) {
    const obtenuSkills = reconnaitre(msg).map((a) => a.skill);
    const obtenuRegles = reconnaitreConsignes(msg).map((c) => c.regle);
    const injecte = contexte(msg);
    const ok = JSON.stringify(obtenuSkills) === JSON.stringify(skills) && JSON.stringify(obtenuRegles) === JSON.stringify(regles)
      && (regles.includes("audit") === /AUDIT DU PRODUIT/.test(injecte));
    console.log(`  [${ok ? "PASS" : "FAIL"}] collage — ${glose} → skills ${JSON.stringify(obtenuSkills)}, consignes ${JSON.stringify(obtenuRegles)}${ok ? "" : ` (attendu ${JSON.stringify(skills)} et ${JSON.stringify(regles)})`}`);
    ok ? pass++ : fail++;
  }

  // TF-1418 — LES NIVEAUX. Chaque mot-clé a sa paire : le même mot en tête avec ses deux-points
  // (niveau reconnu), puis ailleurs dans la phrase ou sans ses deux-points (rien). Sans la moitié
  // négative, un motif qui matcherait « vite » partout serait vert.
  const casNiveau = [
    ["vite : où est la liste des éléments ?", "Simple"],
    ["Vite: le parc est-il à jour ?", "Simple"],
    ["moyen : pourquoi le hook a-t-il refusé ma synthèse ?", "Moyen"],
    ["un niveau moyen : à voir", null],
    ["complet : pourquoi le hook a-t-il refusé ma synthèse ?", "Complexe"],
    ["c'est vite fait : corrige la page d'accueil", null],
    ["vite, où est la liste ?", null],
    ["la liste au complet : 12 lignes", null],
  ];
  for (const [msg, attendu] of casNiveau) {
    const obtenu = reconnaitreNiveau(msg)?.niveau ?? null;
    const ok = obtenu === attendu;
    console.log(`  [${ok ? "PASS" : "FAIL"}] niveau${attendu === null ? " rouge" : ""} — « ${msg.slice(0, 44)} » → ${obtenu}${ok ? "" : ` (attendu ${attendu})`}`);
    ok ? pass++ : fail++;
  }

  // La PORTÉE : en service là où le référentiel existe, muette ailleurs. La paire joue le même
  // dossier temporaire, sans puis avec `references/NIVEAUX.md` — c'est la garde qui tient les
  // produits hors de l'étape 1.
  const dossier = mkdtempSync(join(tmpdir(), "niveaux-"));
  const horsService = niveauxEnService(dossier) === false;
  mkdirSync(join(dossier, "references"), { recursive: true });
  writeFileSync(join(dossier, "references", "NIVEAUX.md"), "# fixture\n");
  const enService = niveauxEnService(dossier) === true;
  for (const [ok, glose] of [[horsService, "dossier sans references/NIVEAUX.md → hors service"],
    [enService, "même dossier portant references/NIVEAUX.md → en service"]]) {
    console.log(`  [${ok ? "PASS" : "FAIL"}] portée — ${glose}`);
    ok ? pass++ : fail++;
  }
  // Étape 3 (D-68 (a), 13/10/2026) : un produit porte le texte hérité sous `forge/NIVEAUX.md`. Le
  // dossier qui ne porte que lui est en service, et la ligne injectée cite CE chemin, pas celui du pilot.
  {
    const produit = mkdtempSync(join(tmpdir(), "niveaux-produit-"));
    mkdirSync(join(produit, "forge"), { recursive: true });
    writeFileSync(join(produit, "forge", "NIVEAUX.md"), "# fixture\n");
    const ref = referentielNiveaux(produit);
    const ok = ref === "forge\\NIVEAUX.md" && /selon forge\\NIVEAUX\.md/.test(contexteNiveau("vite : où ?", ref));
    console.log(`  [${ok ? "PASS" : "FAIL"}] portée — dossier produit portant forge/NIVEAUX.md → en service, la ligne cite forge\\NIVEAUX.md`);
    ok ? pass++ : fail++;
  }

  // L'ORIGINE vaut aussi pour les niveaux : « vite : » dans une entrée qui se déclare non humaine ne
  // demande rien, alors que le même texte, humain, demanderait le niveau Simple.
  const notification = "<task-notification>vite : l'agent a fini</task-notification>";
  const okOrigine = !estMessageHumain(notification) && reconnaitreNiveau("vite : l'agent a fini")?.niveau === "Simple";
  console.log(`  [${okOrigine ? "PASS" : "FAIL"}] niveau — notification portant « vite : » → REFUS, non humaine, rien injecté`);
  okOrigine ? pass++ : fail++;

  console.log(`\nhook-lexique : ${pass} PASS, ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
}

if (process.argv[1] && /hook-lexique\.mjs$/.test(process.argv[1]) && !process.argv.includes("--self-test")) {
  let entree = "";
  try { entree = readFileSync(0, "utf8"); } catch { entree = ""; }
  let message = "", dossier = "", transcript = "";
  try {
    const j = JSON.parse(entree);
    message = typeof j.prompt === "string" ? j.prompt : String(j.user_prompt || j.message || "");
    dossier = typeof j.cwd === "string" ? j.cwd : "";
    transcript = typeof j.transcript_path === "string" ? j.transcript_path : "";
  } catch { message = entree; }
  // Le dossier de la session décide si les niveaux sont en service (TF-1418) ; à défaut du champ
  // `cwd`, celui où Claude Code lance le hook, qui est le même. TF-1943 : après un `cd` dans un sous-dossier, `cwd` est ce
  // sous-dossier ; les niveaux se jugent au PROJET (`CLAUDE_PROJECT_DIR`, à défaut la racine git de `cwd`).
  dossier = racineDuProjet(dossier || process.cwd());
  const lignes = [];
  const humain = estMessageHumain(message);
  if (humain) {
    const appels = contexte(message);
    if (appels) lignes.push(appels);
    const ref = referentielNiveaux(dossier);
    const niveau = ref ? contexteNiveau(message, ref) : "";
    if (niveau) lignes.push(niveau);
  }
  // TF-1958 : la lettre d'une décision ouverte, lue dans la transcription ; asynchrone (import paresseux).
  (humain ? contexteLettre(message, transcript) : Promise.resolve(""))
    .catch(() => "")
    .then((lettre) => {
      if (lettre) lignes.push(lettre);
      if (lignes.length) process.stdout.write(lignes.join("\n") + "\n");
      process.exit(0);
    });
}
