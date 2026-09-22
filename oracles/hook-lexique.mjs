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
import { readFileSync } from "node:fs";

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

/** Rend les appels reconnus dans un message : [{skill, forme}], sans doublon de skill. */
export function reconnaitre(message) {
  const vus = new Set(); const appels = [];
  const brut = String(message || "");
  const sansCode = brut.replace(/`[^`]*`/g, " ");
  for (const r of LEXIQUE) {
    if (vus.has(r.skill) || !r.motif.test(r.horsCode ? sansCode : brut)) continue;
    vus.add(r.skill); appels.push({ skill: r.skill, forme: r.forme });
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

/** Le texte injecté dans le contexte — une ligne par appel, ou rien. */
export function contexte(message) {
  const appels = reconnaitre(message);
  if (!appels.length) return "";
  return appels.map((a) =>
    `[LEXIQUE RV-6 — hook-lexique] Ce message est un APPEL du skill \`${a.skill}\` (${a.forme}) : ` +
    `l'invoquer par l'outil Skill AVANT toute autre action ou réponse ; retirer le mot-clé, le reste du message est l'entrant. ` +
    `Ne pas l'invoquer est un défaut de classe « skill-non-invoque-lexique » (todo/CLASSES.json).`).join("\n");
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
    console.log(`  [${ok ? "PASS" : "FAIL"}] origine — ${glose} → ${humain ? "humain, appel injecté" : "non humain, rien injecté"}${ok ? "" : " (contraire à l'attendu)"}`);
    ok ? pass++ : fail++;
  }

  console.log(`\nhook-lexique : ${pass} PASS, ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
}

if (process.argv[1] && /hook-lexique\.mjs$/.test(process.argv[1]) && !process.argv.includes("--self-test")) {
  let entree = "";
  try { entree = readFileSync(0, "utf8"); } catch { entree = ""; }
  let message = "";
  try { const j = JSON.parse(entree); message = typeof j.prompt === "string" ? j.prompt : String(j.user_prompt || j.message || ""); }
  catch { message = entree; }
  const texte = estMessageHumain(message) ? contexte(message) : "";
  if (texte) process.stdout.write(texte + "\n");
  process.exit(0);
}
