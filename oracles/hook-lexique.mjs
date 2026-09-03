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
  { skill: "prompt-analyzer-l99", motif: /\bl99\b/iu, forme: "« l99 » dans le message", secondaire: true },
  { skill: "la-barre", motif: /^\s*\/?barre\b/iu, forme: "« barre… » en tête de message" },
  { skill: "ameliore-un-skill", motif: /^\s*(?:am[ée]liore[rz]?|audite[rz]?|durcis|fiabilise[rz]?|score[rz]?|r[ée]vise[rz]?|optimise[rz]?)\s+(?:ce|le|mon|ton|un|une|cette|la)?\s*skill\b/iu, forme: "« améliore/audite ce skill »" },
];

/** Rend les appels reconnus dans un message : [{skill, forme}], sans doublon de skill. */
export function reconnaitre(message) {
  const vus = new Set(); const appels = [];
  for (const r of LEXIQUE) {
    if (vus.has(r.skill) || !r.motif.test(String(message || ""))) continue;
    vus.add(r.skill); appels.push({ skill: r.skill, forme: r.forme });
  }
  return appels;
}

/** Le texte injecté dans le contexte — une ligne par appel, ou rien. */
export function contexte(message) {
  const appels = reconnaitre(message);
  if (!appels.length) return "";
  return appels.map((a) =>
    `[LEXIQUE RV-6 — hook-lexique] Ce message est un APPEL du skill \`${a.skill}\` (${a.forme}) : ` +
    `l'invoquer par l'outil Skill AVANT toute autre action ou réponse ; retirer le mot-clé, le reste du message est l'entrant. ` +
    `Ne pas l'invoquer est un défaut de classe « skill-non-invoque-lexique » (todo/CLASSES.json).`).join("\n");
}

if (process.argv.includes("--self-test")) {
  let pass = 0, fail = 0;
  const cas = [
    ["Améliore ce prompt : Concois et construis un système…", ["prompt-analyzer-l99"]],
    ["l99 sur ce texte : rédige un post LinkedIn", ["prompt-analyzer-l99"]],
    ["barre ce prompt : une console de données", ["la-barre"]],
    ["Améliore ce skill : quality-oracles déclenche mal", ["ameliore-un-skill"]],
    ["Le prompt réécrit est bon, on le garde tel quel", []],
    ["Améliore le design de la page d'accueil", []],
    ["Corrige la barre de menu qui déborde sur mobile", []],
  ];
  for (const [msg, attendu] of cas) {
    const obtenu = reconnaitre(msg).map((a) => a.skill);
    const ok = JSON.stringify(obtenu) === JSON.stringify(attendu);
    console.log(`  [${ok ? "PASS" : "FAIL"}] « ${msg.slice(0, 48)} » → ${JSON.stringify(obtenu)}${ok ? "" : ` (attendu ${JSON.stringify(attendu)})`}`);
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
  const texte = contexte(message);
  if (texte) process.stdout.write(texte + "\n");
  process.exit(0);
}
