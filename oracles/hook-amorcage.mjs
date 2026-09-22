#!/usr/bin/env node
/**
 * hook-amorcage.mjs — L'ENTRÉE DU DISPOSITIF VIT DU BON CÔTÉ DE LA PORTE
 * (TF-1285, décision humaine D-2 (b) du 22/09/2026).
 *
 * ============================================================================================
 * LE FAIT PAYÉ, ET LA CIRCULARITÉ QUI LE CAUSE
 * ============================================================================================
 *
 * Le 22/09/2026 à 10:16, un projet neuf est ouvert dans un dossier vide. Son premier message cite
 * NOMMÉMENT le dépôt du dispositif. Rien ne s'enclenche : pas de phase d'ouverture, pas de
 * `input\`, `output\`, `forge\`, pas de journal de run, aucun contrôle exécuté, et le livrable
 * sort à la racine du projet sous un nom choisi par la session. Le dispositif était pourtant
 * installé dans le dossier PARENT, deuxième candidat de l'ordre de résolution qu'`AGENTS.md`
 * prescrit — rien ne l'a cherché.
 *
 * LA CAUSE EST UNE CIRCULARITÉ : le hameçon `UserPromptSubmit` qui reconnaît un mot-clé et injecte
 * l'appel du skill attendu n'existe qu'en portée PRODUIT, posé par `gabarits\settings-produit.json`
 * À L'OUVERTURE DU RUN. *Le déclencheur est installé par le geste qu'il est censé déclencher.* Le
 * seul canal ambiant qui fonctionne — la propagation de skills — ne transportait pas l'entrée ;
 * le seul mécanisme de la bonne FORME vivait du mauvais côté de la porte.
 *
 * Mesure du poste ce jour-là : 30 skills propagés, AUCUN d'accueil ; aucun `settings.json` au
 * poste, donc aucun hameçon de portée poste. `oracle-amorcage-poste.mjs`, écrit le même jour pour
 * que la classe de ce défaut nomme un contrôle existant, rendait FAIL sur ses règles AP1 et AP2.
 *
 * ============================================================================================
 * CE QUE CE HAMEÇON FAIT, ET DANS QUEL ORDRE
 * ============================================================================================
 *
 * Il est de portée POSTE : `bootstrap.mjs` le pose dans `~/.claude/settings.json` par fusion non
 * destructive, avec le chemin absolu de ce fichier. Il s'exécute donc AVANT que le projet courant
 * ait décidé quoi que ce soit — c'est tout l'objet.
 *
 *   1. **Si le répertoire de session est DÉJÀ instrumenté** — un `forge\` présent, ou un
 *      `.claude\settings.json` qui déclare un hameçon `UserPromptSubmit` — il sort en 0 SANS RIEN
 *      ÉCRIRE. Le hameçon du projet fait le travail, et deux injections du même appel feraient
 *      lire deux fois la même ligne à la session. Le pilot lui-même tombe dans ce cas.
 *   2. **Sinon, il joue le lexique d'invocation RV-6** (`hook-lexique.mjs`, importé — jamais
 *      réimplémenté). Aujourd'hui ce lexique ne s'exécute QUE dans un projet instrumenté : il
 *      n'a donc jamais parlé au premier message d'un projet neuf, c'est-à-dire précisément au
 *      moment où personne ne connaît encore les mots-clés.
 *   3. **Et il joue l'AMORÇAGE** : si le message NOMME le dispositif, il injecte l'appel du skill
 *      d'accueil et le chemin du pilot qu'il a résolu, de sorte que la session n'ait plus à
 *      chercher.
 *
 * Il ne bloque JAMAIS et sort toujours en 0. Pilot introuvable : il le DIT en une ligne et sort en
 * 0 — un hameçon de portée poste qui ferait échouer une session sans rapport avec le dispositif
 * serait retiré dans la journée, et on aurait perdu les deux.
 *
 * ============================================================================================
 * POURQUOI LE MOTIF EXIGE LA MARQUE, ET PAS « factory » NI « forge » SEULS
 * ============================================================================================
 *
 * Un hameçon de portée poste voit TOUS les messages de TOUTES les sessions de la machine. Le mot
 * « factory » est un terme courant du métier — *factory pattern*, `AbstractFactory`,
 * `createUserFactory` — et « forge » est un mot ordinaire du français. Les reconnaître ferait
 * injecter l'appel d'un skill d'accueil au milieu d'une discussion de conception logicielle, sur
 * une machine où le dispositif n'a rien à voir avec le sujet. *Un hameçon bruyant est un hameçon
 * désactivé, et la leçon N4 du noyau dit ce qui arrive ensuite.*
 *
 * Le motif exige donc le JETON DE MARQUE — `digit-ai` sous l'une de ses formes : le nom du pilot,
 * celui d'une forge, l'adresse du dépôt, ou la marque écrite à côté du mot « factory » ou
 * « forge ». C'est ce que portait le message fondateur, qui citait l'URL du dépôt.
 *
 * NON JUGÉ, ET DÉCLARÉ : un premier message qui n'écrit NI la marque NI un mot-clé du lexique
 * n'est pas reconnu, même dans un dossier de projet sans `forge\`. Déclencher sur le seul état du
 * dossier ferait injecter la même ligne à chaque message de chaque dossier non instrumenté de la
 * machine. Ce cas-là est porté par la DESCRIPTION du skill d'accueil, que le modèle lit et peut
 * invoquer de lui-même ; le hameçon, lui, ne parle que sur un signal écrit.
 *
 * Usage : stdin JSON (`{"prompt": "…"}`) → stdout. Le banc vit dans `hook-amorcage.test.mjs`,
 * fichier DÉDIÉ et non `--self-test` interne : `hook-lexique.mjs`, que ce module importe, lit
 * `process.argv` À SON CHARGEMENT pour décider de jouer son propre banc — un `--self-test` passé
 * ici partait donc jouer le banc de l'importé, puis sortait, et le banc de ce module ne tournait
 * jamais. Mesuré le 22/09/2026 au premier essai ; le défaut de l'importé est remonté au registre.
 * Exit : 0 toujours — ce hameçon informe, il ne décide jamais de la poursuite d'un tour.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { contexte as contexteLexique, estMessageHumain } from "./hook-lexique.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));

/** Le nom du skill d'accueil, propagé par la forge d'outils. Il porte « accueil » dans son nom. */
export const SKILL_ACCUEIL = "accueil-factory";

/**
 * LE JETON DE MARQUE, et rien de plus large — voir l'en-tête. Les formes reconnues : le nom d'un
 * dépôt du parc (`digit-ai-factory`, `digit-ai-forge-tests`…), l'adresse du dépôt, ou la marque
 * écrite à côté du mot « factory » ou « forge ».
 */
export const RE_DISPOSITIF = /digit[-\s]?ai[-\s]?(?:factory|forge|queue)|github\.com\/iguane39\/digit-ai|\bdigit[-\s]?ai\b[^.\n]{0,40}\b(?:factory|forge)\b|\b(?:factory|forge)\b[^.\n]{0,40}\bdigit[-\s]?ai\b/i;

/** Le message NOMME-t-il le dispositif ? */
export const nommeLeDispositif = (message) => RE_DISPOSITIF.test(String(message || ""));

/**
 * Le répertoire de session est-il DÉJÀ instrumenté ? Deux marques, et une seule suffit : le
 * dossier `forge\` du socle produit, ou un `settings.json` de projet qui déclare un hameçon sur le
 * message humain. La seconde couvre le pilot, qui n'a pas de `forge\` et porte le hameçon lexique.
 */
export function dejaInstrumente(cwd = process.cwd()) {
  try { if (statSync(join(cwd, "forge")).isDirectory()) return true; } catch { /* absent */ }
  for (const nom of ["settings.json", "settings.local.json"]) {
    const p = join(cwd, ".claude", nom);
    if (!existsSync(p)) continue;
    try {
      const j = JSON.parse(readFileSync(p, "utf8"));
      if (j && j.hooks && Array.isArray(j.hooks.UserPromptSubmit) && j.hooks.UserPromptSubmit.length) return true;
    } catch { /* illisible : ne prouve rien, on continue */ }
  }
  return false;
}

/**
 * La racine du pilot, dans l'ordre que la doctrine des chemins écrit : `FORGE_ROOT` d'abord, puis
 * le dépôt qui porte CE fichier — car ce hameçon vit dans le pilot, et le poste le pointe par son
 * chemin absolu. Rend `null` plutôt que de deviner.
 */
export function racineDuPilot() {
  const candidats = [];
  if (process.env.FORGE_ROOT) candidats.push(join(resolve(process.env.FORGE_ROOT), "digit-ai-factory"));
  candidats.push(resolve(ICI, ".."));
  for (const c of candidats) if (existsSync(join(c, "CLAUDE.md")) && existsSync(join(c, "bootstrap.mjs"))) return c;
  return null;
}

/** Le texte injecté — une ou plusieurs lignes, ou rien. */
export function contexte(message, { cwd = process.cwd() } = {}) {
  if (!estMessageHumain(message)) return "";
  if (dejaInstrumente(cwd)) return "";
  const lignes = [];
  const duLexique = contexteLexique(message);
  if (duLexique) lignes.push(duLexique);
  if (nommeLeDispositif(message)) {
    const pilot = racineDuPilot();
    lignes.push(pilot
      ? `[AMORÇAGE — hook-amorcage] Ce message NOMME la forge Digit-AI, et ce répertoire n'est pas `
        + `instrumenté : aucun \`forge\\\`, aucun hameçon de projet. Invoquer le skill \`${SKILL_ACCUEIL}\` `
        + `par l'outil Skill AVANT toute autre action ou réponse — il porte le protocole d'accueil, la `
        + `phase 0 et les deux voies d'entrée (produit neuf, projet déjà existant). Le pilot est résolu : `
        + `${pilot}. Ne pas l'invoquer et produire un livrable ici est un défaut de classe `
        + `« amorcage-factory-sans-declencheur-au-poste » (todo/CLASSES.json).`
      : `[AMORÇAGE — hook-amorcage] Ce message NOMME la forge Digit-AI, et ce répertoire n'est pas `
        + `instrumenté. Le pilot n'a PAS été trouvé depuis ce poste — ni par FORGE_ROOT, ni à côté de `
        + `ce hameçon. Le dire est la bonne réponse : ne rien supposer installé, et demander où il vit `
        + `avant d'ouvrir un run.`);
  }
  return lignes.join("\n");
}

// ---- exécution en hameçon ---------------------------------------------------------------------
if (process.argv[1] && /hook-amorcage\.mjs$/.test(process.argv[1])) {
  let entree = "";
  try { entree = readFileSync(0, "utf8"); } catch { entree = ""; }
  let message = "";
  try { const j = JSON.parse(entree); message = typeof j.prompt === "string" ? j.prompt : String(j.user_prompt || j.message || ""); }
  catch { message = entree; }
  let texte = "";
  try { texte = contexte(message); } catch { texte = ""; }  // un hameçon de poste ne casse aucune session
  if (texte) process.stdout.write(texte + "\n");
  process.exit(0);
}
