#!/usr/bin/env node
/**
 * oracle-amorcage-poste.mjs — LE POINT D'ENTRÉE D'UN DISPOSITIF NE PEUT PAS ÊTRE INSTALLÉ PAR LE
 * GESTE QU'IL EST CENSÉ DÉCLENCHER (classe `amorcage-factory-sans-declencheur-au-poste`, TF-1285,
 * TF-1286, lot Produit-67 - RETOURS - 20260922a).
 *
 * ============================================================================================
 * LE FAIT PAYÉ, ET SA MESURE
 * ============================================================================================
 *
 * Mesuré sur ce poste le 22/09/2026 à 10:16, à l'occasion du premier prompt d'un projet neuf qui
 * citait NOMMÉMENT le dépôt de la factory :
 *
 *   · `bootstrap.mjs` avait propagé 30 skills vers `~/.claude/skills` et `~/.claude-b/skills`,
 *     tenus identiques — la propagation FONCTIONNE ; AUCUN de ces 30 skills ne portait le
 *     protocole d'accueil (ni `accueil`, ni `amorcage`, ni `demarrer-un-run`) ;
 *   · AUCUN `settings.json` au poste — donc aucun hook `UserPromptSubmit`. Le hook `lexique`
 *     (`gabarits\hooks-factory.mjs`), qui reconnaît le mot-clé et injecte l'appel du skill,
 *     n'existe qu'en portée PRODUIT, posé par `gabarits\settings-produit.json` À L'OUVERTURE
 *     DU RUN ;
 *   · la factory était pourtant installée dans le dossier PARENT du projet, deuxième candidat de
 *     l'ordre de résolution que prescrit `AGENTS.md`. Rien ne l'a cherchée.
 *
 * LA CIRCULARITÉ EST LE DÉFAUT : le déclencheur est installé par le geste qu'il est censé
 * déclencher. Le seul canal ambiant qui marche déjà — la propagation de skills — ne transporte pas
 * l'entrée ; le seul mécanisme qui a la bonne FORME — un hook `UserPromptSubmit` — vit du mauvais
 * côté de la porte. `AGENTS.md` prescrit correctement la séquence, mais il vit dans un dépôt qu'un
 * agent doit d'abord DÉCIDER de lire, et une consigne que rien ne présente n'est jamais lue.
 *
 * COÛT MESURÉ sur ce seul cas : un premier prompt de projet entièrement produit hors factory —
 * sans phase 0, sans `input\`, `output\` ni `forge\`, sans ledger, sans oracle exécuté, livrable
 * écrit à la racine du projet. La loi n° 1 s'applique ici à la factory elle-même : *toute
 * affordance est câblée ou n'existe pas.*
 *
 * ============================================================================================
 * CE QUI EST JUGÉ, ET POURQUOI SUR LE POSTE ET NON DANS LE DÉPÔT
 * ============================================================================================
 *
 * L'objet jugé est le POSTE, jamais le dépôt : un dépôt peut porter le skill d'accueil le mieux
 * écrit du monde sans qu'aucune session hors produit ne le rencontre. La question est « qu'est-ce
 * qu'une session trouve devant elle avant d'avoir rien décidé », et la réponse vit dans
 * `~/.claude\` — répertoire de portée POSTE, lu par le harnais à chaque session, quel que soit le
 * dossier de travail.
 *
 *   AP1 · le poste porte un SKILL D'ACCUEIL propagé — un skill dont le nom ou les déclencheurs
 *         couvrent l'amorçage (« accueil », « amorcage », « demarrer-un-run », la factory, l'URL
 *         de son dépôt). Trente skills propagés dont aucun d'accueil, c'est un canal qui marche
 *         et qui ne transporte pas l'entrée.
 *   AP2 · le poste déclare un hook `UserPromptSubmit` — le seul mécanisme de la bonne FORME : il
 *         voit le prompt avant le travail. Un hook de portée PRODUIT ne compte pas : il est posé
 *         par l'ouverture du run, c'est-à-dire par le geste qu'il devrait déclencher.
 *   AP3 · la commande de chaque hook déclaré au poste RÉSOUT sur le disque. Un hook dont le
 *         script est absent est un hook qui ne tourne pas, et il rassure au lieu d'agir — même
 *         famille que le contrôle sans chemin d'échec (TF-0795).
 *
 * Le verdict est un CONSTAT, jamais un blocage : il se lit au relevé d'ouverture
 * (`oracles\hook-ouverture.mjs`), là où sa sortie est VUE. Un contrôle câblé à un hook qui
 * n'affiche qu'en cas de blocage rend un échec que personne ne lit — classe
 * `constat-non-bloquant-jamais-lu`, mesurée le 14/09/2026.
 *
 * ============================================================================================
 * NON JUGÉ, ET DÉCLARÉ
 * ============================================================================================
 *
 *   · si le skill d'accueil, une fois trouvé, fait BIEN son travail : cet oracle mesure sa
 *     PRÉSENCE devant la session, jamais la qualité de son protocole ;
 *   · les postes autres que celui qui exécute : la mesure est locale par construction ;
 *   · un déclencheur porté par un canal que cet oracle ne connaît pas (variable d'environnement
 *     du système, extension d'éditeur, image de conteneur). La liste des canaux est ÉCRITE plutôt
 *     que devinée : un canal deviné classerait mal, et un classement faux sur un constat
 *     d'amorçage ferait accuser un poste conforme ;
 *   · le CONTENU du prompt d'une session : savoir si elle a vraiment nommé la factory est hors
 *     de portée d'un oracle de disque.
 *
 * Usage : node oracles\oracle-amorcage-poste.mjs [--poste <dir>]… [--json]
 * Exit : 0 = PASS · 1 = FAIL · 2 = SANS OBJET (aucun répertoire de poste à juger).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

/**
 * Les répertoires de POSTE. Écrits, jamais devinés : `~/.claude` est celui du harnais, `~/.claude-b`
 * est le second profil que `bootstrap.mjs` tient identique au premier (il propage vers les deux).
 * `--poste` les remplace — c'est par là que la recette fabrique ses postes rouges et verts.
 */
export const POSTES_PAR_DEFAUT = [join(homedir(), ".claude"), join(homedir(), ".claude-b")];

function postesDemandes(argv) {
  const out = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === "--poste" && argv[i + 1]) out.push(resolve(argv[++i]));
  return out;
}

/**
 * Les mots qui font d'un NOM de skill un nom d'amorçage. Fermés et écrits (loi n° 4).
 *
 * POURQUOI LE NOM D'ABORD, ET LA DESCRIPTION SOUS CONDITION. Le premier jet cherchait ces mots
 * dans les 4000 premiers octets du `SKILL.md`, et il a rendu AP1 vert sur ce poste au premier
 * passage : `enumere-la-surface` écrit « Écran d'accueil » dans une cellule de tableau, ligne 56.
 * Un oracle d'amorçage qui se laisse convaincre par une cellule de tableau accuse un poste
 * conforme ou absout un poste nu — les deux sont pires que pas de mesure. La lecture est donc
 * bornée à l'EN-TÊTE YAML, et la description ne compte que si elle nomme À LA FOIS le geste
 * d'ouverture et le dispositif.
 */
export const MOTS_D_ACCUEIL = [
  "accueil", "amorcage", "amorçage", "demarrer-un-run", "démarrer-un-run",
  "ouvrir-un-run", "demarrer-un-projet", "adopter-la-factory",
];

/**
 * LA DESCRIPTION N'EST PAS UN CRITÈRE, ET LES TROIS ESSAIS QUI L'ONT ÉTABLI SONT ÉCRITS ICI —
 * sans quoi rien n'empêche de les refaire.
 *
 *   1. chercher les mots d'amorçage dans les 4000 premiers octets du `SKILL.md` : AP1 vert sur
 *      `enumere-la-surface`, qui écrit « Écran d'accueil » dans une cellule de tableau (l. 56) ;
 *   2. exiger un geste d'ouverture ET le dispositif n'importe où dans la description : vert sur
 *      `la-barre`, dont la description fait dix lignes et nomme les deux sans rapport ;
 *   3. exiger les deux à moins de quarante caractères l'un de l'autre : vert sur
 *      `write-an-expert`.
 *
 * Trois calibrages, trois faux positifs, sur un corpus de trente skills où la bonne réponse est
 * ZÉRO. Une description de skill est écrite pour être reconnue par un modèle, pas pour être
 * classée par un motif : elle nomme large, cite ses voisins et ses exclusions. La règle retenue
 * est donc COURTE ET ÉCRITE — le NOM du skill — exactement comme le cliquet R15 refuse de deviner
 * ses porteurs par heuristique : un classement faux sur un constat d'amorçage absout un poste nu
 * ou accuse un poste conforme, et les deux valent moins que pas de mesure. La limite est déclarée
 * au `non_juge`, pas comblée par un motif de plus.
 *
 * Ce n'est pas une facilité : c'est le pilot qui NOMME les skills qu'il propage. Un protocole
 * d'accueil qui ne se voit pas dans son nom est un défaut de nommage, et il a son juge ailleurs.
 */

/** Le hook de la bonne FORME : il voit le prompt avant le travail. */
export const HOOK_ATTENDU = "UserPromptSubmit";

const lireJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };

/**
 * L'en-tête YAML d'un `SKILL.md` : `{ name, description }`. Seul l'en-tête est lu — le corps du
 * skill est hors de portée, pour le motif écrit au-dessus de MOTS_D_ACCUEIL. Un fichier sans
 * en-tête rend des champs vides plutôt qu'une exception : un skill mal formé est le sujet
 * d'`oracle-skills`, pas d'ici, et deux vérités sur le même objet valent moins qu'une.
 */
export function enTeteSkill(texte) {
  const m = String(texte).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { name: "", description: "" };
  const bloc = m[1];
  const champ = (cle) => {
    const re = new RegExp(`^${cle}:[ \\t]*(.*(?:\\r?\\n[ \\t]+.*)*)`, "im");
    const t = bloc.match(re);
    return t ? t[1].replace(/\s+/g, " ").trim() : "";
  };
  return { name: champ("name"), description: champ("description") };
}

/** Les skills présents au poste, avec leur en-tête déclaré. */
export function skillsDuPoste(poste) {
  const racine = join(poste, "skills");
  if (!existsSync(racine)) return [];
  let noms = [];
  try { noms = readdirSync(racine); } catch { return []; }
  const out = [];
  for (const nom of noms) {
    const d = join(racine, nom);
    try { if (!statSync(d).isDirectory()) continue; } catch { continue; }
    const fiche = join(d, "SKILL.md");
    let brut = "";
    if (existsSync(fiche)) { try { brut = readFileSync(fiche, "utf8"); } catch { brut = ""; } }
    out.push({ nom, ...enTeteSkill(brut) });
  }
  return out;
}

/** Un skill porte-t-il l'amorçage ? Son NOM le dit — répertoire ou champ `name`, et rien d'autre. */
export function porteLAmorcage({ nom, name = "" }) {
  return [String(nom), String(name)]
    .some((n) => MOTS_D_ACCUEIL.some((m) => n.toLowerCase().includes(m.toLowerCase())));
}

/** Les hooks déclarés par les `settings*.json` d'un poste : `{ evenement, commande, fichier }`. */
export function hooksDuPoste(poste) {
  const out = [];
  for (const nom of ["settings.json", "settings.local.json"]) {
    const p = join(poste, nom);
    if (!existsSync(p)) continue;
    const j = lireJson(p);
    if (!j || typeof j.hooks !== "object" || !j.hooks) continue;
    for (const [evenement, entrees] of Object.entries(j.hooks)) {
      for (const e of Array.isArray(entrees) ? entrees : []) {
        for (const h of Array.isArray(e && e.hooks) ? e.hooks : []) {
          out.push({ evenement, commande: String((h && h.command) || ""), fichier: nom });
        }
      }
    }
  }
  return out;
}

/**
 * Le chemin de script que cite une commande de hook, s'il en cite un. On ne cherche PAS à exécuter
 * la commande — un oracle qui lance ce qu'il juge peut casser ce qu'il mesure. On lit le premier
 * argument qui ressemble à un fichier de script, et on regarde s'il existe.
 */
export function scriptCite(commande) {
  const m = String(commande).match(/(?:^|[\s"'])((?:[A-Za-z]:)?[^\s"']*[\\/][^\s"']*\.(?:mjs|cjs|js|py|ps1|sh|cmd|bat))/);
  return m ? m[1] : null;
}

export function juger({ postes = POSTES_PAR_DEFAUT } = {}) {
  const F = [];
  const ok = (regle, message, ou = "-") => F.push({ regle, statut: "PASS", ou, message });
  const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });

  const vivants = postes.filter((p) => existsSync(p));
  if (!vivants.length) {
    return {
      verdict: "SANS_OBJET", findings: [{
        regle: "AP0", statut: "SANS_OBJET", ou: postes.join(", "),
        message: "aucun répertoire de poste sous les chemins nommés — il n'y a pas de poste à juger, "
          + "ce n'est pas un poste conforme. Sur un clone frais ou un conteneur sans profil de harnais, "
          + "c'est l'état normal (critère « parc absent », TF-1133)",
      }], postes: [],
    };
  }

  // ── AP1 — un skill d'accueil devant la session ──────────────────────────────────────────────
  const sansAccueil = [];
  let totalSkills = 0;
  for (const p of vivants) {
    const skills = skillsDuPoste(p);
    totalSkills += skills.length;
    if (!skills.some(porteLAmorcage)) sansAccueil.push({ poste: p, propages: skills.length });
  }
  if (!sansAccueil.length) {
    ok("AP1", `chaque poste porte un skill d'accueil propagé (${totalSkills} skill(s) relevé(s) au total)`);
  } else {
    ko("AP1", sansAccueil.map((s) => s.poste).join(", "),
      `${sansAccueil.length} poste(s) sur ${vivants.length} portent des skills propagés et AUCUN skill d'accueil : `
      + sansAccueil.map((s) => `${s.poste} (${s.propages} skill(s))`).join(" ; ")
      + `. Le canal ambiant qui fonctionne — la propagation de skills — ne transporte pas l'entrée du dispositif. `
      + `Mots d'amorçage cherchés dans le NOM de chaque skill (répertoire et champ \`name\`, jamais la description — trois calibrages, trois faux positifs) : ${MOTS_D_ACCUEIL.join(", ")}. `
      + `Remède : que \`bootstrap.mjs\` propage un skill d'accueil au même titre que les autres (TF-1285)`);
  }

  // ── AP2 — un hook UserPromptSubmit de portée POSTE ──────────────────────────────────────────
  const sansHook = [];
  for (const p of vivants) {
    const hooks = hooksDuPoste(p);
    if (!hooks.some((h) => h.evenement === HOOK_ATTENDU)) sansHook.push({ poste: p, evenements: [...new Set(hooks.map((h) => h.evenement))] });
  }
  if (!sansHook.length) {
    ok("AP2", `chaque poste déclare un hook ${HOOK_ATTENDU} — le prompt est vu avant le travail`);
  } else {
    ko("AP2", sansHook.map((s) => s.poste).join(", "),
      `${sansHook.length} poste(s) sur ${vivants.length} SANS hook ${HOOK_ATTENDU} : `
      + sansHook.map((s) => `${s.poste} (événements déclarés : ${s.evenements.length ? s.evenements.join(", ") : "aucun"})`).join(" ; ")
      + `. Le hook \`lexique\` de \`gabarits\\hooks-factory.mjs\` a la bonne forme et vit en portée PRODUIT, `
      + `posé par l'ouverture du run — c'est-à-dire par le geste qu'il devrait déclencher. Remède : que `
      + `\`bootstrap.mjs\` l'installe au poste en fusion NON DESTRUCTIVE sur \`settings.json\` ; il résout `
      + `déjà le pilot seul et sort en 0 en le DISANT s'il ne le trouve pas, donc il est sûr hors projet factory (TF-1285)`);
  }

  // ── AP3 — un hook déclaré dont le script est absent ne tourne pas ───────────────────────────
  const absents = [];
  for (const p of vivants) {
    for (const h of hooksDuPoste(p)) {
      const s = scriptCite(h.commande);
      if (!s) continue; // une commande sans chemin de script (un binaire du système) n'est pas jugée ici
      const abs = isAbsolute(s) ? s : join(p, s);
      if (!existsSync(abs) && !existsSync(s)) absents.push({ poste: p, evenement: h.evenement, script: s, fichier: h.fichier });
    }
  }
  if (!absents.length) {
    ok("AP3", "la commande de chaque hook déclaré au poste résout sur le disque");
  } else {
    ko("AP3", absents.map((a) => `${a.poste}/${a.fichier}`).join(", "),
      `${absents.length} hook(s) déclaré(s) dont le script est ABSENT du disque : `
      + absents.map((a) => `${a.evenement} → ${a.script} (${a.fichier})`).join(" ; ")
      + ". Un hook dont le script n'existe pas ne tourne pas, et il rassure au lieu d'agir — même famille "
      + "que le contrôle sans chemin d'échec (TF-0795)");
  }

  return { verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F, postes: vivants };
}

export const NON_JUGE = [
  "si le skill d'accueil, une fois trouvé, fait BIEN son travail : cet oracle mesure sa PRÉSENCE devant la session, jamais la qualité de son protocole",
  "les postes autres que celui qui exécute — la mesure est locale par construction, et un oracle qui prétendrait juger un parc de postes inventerait sa matière",
  "un déclencheur porté par un canal que cet oracle ne connaît pas (variable d'environnement du système, extension d'éditeur, image de conteneur) : la liste des canaux est ÉCRITE plutôt que devinée, parce qu'un classement faux sur un constat d'amorçage ferait accuser un poste conforme",
  "AP1 ne lit que le NOM d'un skill (répertoire et champ `name`), jamais sa description ni son corps. Un skill qui porterait le protocole d'accueil sous un nom qui ne le dit pas échappe donc à la mesure. C'est assumé et mesuré : trois calibrages sur la description ont rendu trois faux positifs sur un corpus de trente skills où la bonne réponse est zéro (`enumere-la-surface`, `la-barre`, `write-an-expert`) — une description de skill nomme large par destination, et la classer par motif absout un poste nu",
  "AP3 ne juge que la PRÉSENCE du script cité, jamais qu'il fasse quoi que ce soit d'utile, ni qu'une commande sans chemin de script (un binaire du système) soit joignable",
  "le CONTENU du prompt d'une session : savoir si elle a nommé la factory est hors de portée d'un oracle de disque",
  "TF-1286 (aucun geste nommé pour un projet DÉJÀ existant qui adopte le dispositif) porte la même classe et n'est PAS jugé ici : son objet est un document du dépôt, pas l'état du poste. Il reste en candidat, et cet oracle ne prétend pas le couvrir",
];

// ---- CLI --------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const demandes = postesDemandes(args);
  const r = juger({ postes: demandes.length ? demandes : POSTES_PAR_DEFAUT });
  if (args.includes("--json")) {
    console.log(JSON.stringify({
      oracle: "oracle-amorcage-poste", version: "1.0.0",
      cible: (demandes.length ? demandes : POSTES_PAR_DEFAUT).join(", "),
      ...r, non_juge: NON_JUGE,
    }, null, 1));
  } else {
    console.log(`oracle-amorcage-poste — ${r.postes.length} poste(s) jugé(s)`);
    console.log(`verdict : ${r.verdict}`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
}
