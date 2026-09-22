#!/usr/bin/env node
/**
 * adopter-projet-existant.mjs — LE GESTE QUI MANQUAIT ENTRE « JE N'AI RIEN » ET « JE REPARS D'UN
 * DOSSIER VIDE » (TF-1286, décision humaine D-2 (b) du 22/09/2026).
 *
 * ============================================================================================
 * LE TROU, NOMMÉ PAR LE RETOUR QUI L'A TROUVÉ
 * ============================================================================================
 *
 * `PROMPT-PRODUIT.md` est explicitement le prompt canonique d'un NOUVEAU produit, et il exige un
 * dossier VIDE : « Créer un dossier vide pour le produit, y copier ce fichier ». `REGLES-PROJET.md`
 * renvoyait le cas d'un projet existant à plus tard — « Rattrapage des projets existants : au
 * prochain run de version de chacun » —, c'est-à-dire à un run qui, pour un projet jamais
 * instrumenté, n'arrive jamais de lui-même. Il n'existait donc AUCUN geste nommé pour le cas
 * d'entrée le plus fréquent d'un patrimoine existant.
 *
 * L'outil voisin le confirme par sa garde : `recopier-heritage.mjs` REFUSE un dossier sans
 * `forge\`, et il a raison — « un dépôt jamais instancié n'hérite de rien ». Les deux gardes se
 * regardaient : la recopie exigeait l'instanciation, l'instanciation exigeait un dossier vide.
 *
 * ============================================================================================
 * TROIS PROPRIÉTÉS, ET AUCUNE N'EST NÉGOCIABLE
 * ============================================================================================
 *
 *   · **IDEMPOTENT** — deux passages donnent le même état. Ce qui existe n'est pas recréé.
 *   · **NON DESTRUCTIF** — aucun fichier préexistant n'est écrasé, aucun n'est DÉPLACÉ. Un
 *     projet vivant porte des conventions que son équipe a choisies ; les remplacer par celles du
 *     dispositif au premier contact serait le contraire d'une adoption.
 *   · **IL DIT TOUT CE QU'IL LAISSE** — chaque artefact préexistant est NOMMÉ, avec l'écart entre
 *     ce qu'il est et ce que le contrat d'héritage attend. Un écart tu est indiscernable d'un
 *     oubli (loi transverse n° 3), et c'est ce qui a coûté au produit de TF-0655 de devoir
 *     déduire un emplacement puis écrire dans le fichier lui-même qu'il l'avait deviné.
 *
 * ============================================================================================
 * CE QU'IL POSE, ET D'OÙ IL LE TIENT
 * ============================================================================================
 *
 * La liste n'est pas écrite ici : elle est LUE dans `gabarits\HERITAGE.json`, le contrat que les
 * produits héritent et que `relever-heritage.mjs` mesure. Un artefact ajouté au contrat est donc
 * posé par ce script sans qu'un geste soit nécessaire — et deux listes qui divergent au premier
 * ajout sont un défaut que le parc compte par ailleurs.
 *
 * S'y ajoutent les répertoires que les règles de projet exigent et qu'aucun artefact ne porte :
 * `input\`, `output\`, `docs\` (R-1, R-2, R-3), et `forge\retours\` que R-47 attend.
 *
 * L'ÉCART INITIAL EST CONSIGNÉ LÀ OÙ LE CONTRAT LE PRÉVOIT : `forge\travaux\ECARTS-ASSUMES.md`,
 * le carnet des écarts assumés du produit. Pas un fichier inventé pour l'occasion — c'est
 * exactement le défaut que TF-0655 a payé.
 *
 * GARDES : refuse de s'exécuter sur le pilot ; refuse un dossier portant DÉJÀ `forge\` et renvoie
 * à `recopier-heritage.mjs`, dont c'est le domaine ; refuse un dossier inexistant.
 *
 * Usage : node <PILOT_ROOT>\scripts\adopter-projet-existant.mjs <racine du projet> [--essai]
 *   À lancer PAR LE PROJET, depuis son dépôt — le pilot n'écrit jamais chez un produit de
 *   lui-même, et l'adoption est un geste que le projet demande.
 * Exit : 0 adopté (ou rien à faire) · 1 refusé par une garde · 2 usage.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(join(ICI, ".."));

/** Les répertoires que les règles de projet exigent et qu'aucun artefact du contrat ne porte. */
export const REPERTOIRES = [
  { chemin: "input", regle: "R-1" },
  { chemin: "output", regle: "R-2" },
  { chemin: "docs", regle: "R-3" },
  { chemin: join("forge", "retours"), regle: "R-47" },
  { chemin: join("forge", "travaux"), regle: "R-20 bis" },
];

/** Le contrat d'héritage, LU et jamais recopié. Rend `[]` si le pilot ne le porte pas. */
export function contratHeritage(pilot = PILOT) {
  const p = join(pilot, "gabarits", "HERITAGE.json");
  if (!existsSync(p)) return [];
  try { return JSON.parse(readFileSync(p, "utf8")).artefacts || []; } catch { return []; }
}

/** Un dossier est-il « vivant » — porte-t-il autre chose que ce que l'adoption y mettrait ? */
export function estVivant(racine) {
  let noms = [];
  try { noms = readdirSync(racine); } catch { return false; }
  const ignorables = new Set([".git", ".gitignore", "PROMPT-PRODUIT.md", "PROMPT-PRODUIT-EXISTANT.md", ".DS_Store"]);
  return noms.some((n) => !ignorables.has(n));
}

/**
 * Le relevé : pour chaque artefact du contrat et chaque répertoire exigé, `{ cible, mode, etat }`
 * où `etat` vaut `present` (laissé intact) ou `absent` (à poser). Aucune écriture ici.
 */
export function relever(racine, pilot = PILOT) {
  const out = [];
  for (const d of REPERTOIRES) {
    let present = false;
    try { present = statSync(join(racine, d.chemin)).isDirectory(); } catch { present = false; }
    out.push({ cible: d.chemin, mode: "repertoire", regle: d.regle, etat: present ? "present" : "absent" });
  }
  for (const a of contratHeritage(pilot)) {
    out.push({ cible: a.cible, mode: a.mode, source: a.source, etat: existsSync(join(racine, a.cible)) ? "present" : "absent" });
  }
  return out;
}

/** Le carnet des écarts assumés reçoit l'écart INITIAL de l'adoption, daté et motivé. */
export function blocEcartInitial(releve, quand) {
  const presents = releve.filter((r) => r.etat === "present" && r.mode !== "repertoire");
  const poses = releve.filter((r) => r.etat === "absent");
  const l = [];
  l.push("", `## Écart initial à l'adoption du dispositif — ${quand}`, "");
  l.push("Ce projet EXISTAIT avant d'adopter le dispositif. L'adoption a posé ce qui manquait et n'a",
    "ni écrasé ni déplacé un seul fichier préexistant. Ce qui suit est l'état de départ, consigné ici",
    "plutôt qu'imposé : chaque ligne se tranche au premier run de version, jamais avant.", "");
  if (presents.length) {
    l.push(`**${presents.length} artefact(s) du contrat d'héritage préexistaient et sont LAISSÉS INTACTS.**`,
      "Un artefact en mode `copie_conforme` qui préexiste est un écart à instruire — le contrat attend",
      "une copie identique, et le projet en porte une version qui lui est propre. Les modes `presence`",
      "et `presence_et_motif(s)` sont légitimement personnalisés.", "");
    l.push("| Artefact | Mode attendu | Décidé |", "|---|---|---|");
    for (const r of presents) l.push(`| \`${r.cible}\` | \`${r.mode}\` | laissé tel quel à l'adoption |`);
    l.push("");
  } else {
    l.push("**Aucun artefact du contrat d'héritage ne préexistait** : l'adoption a tout posé, et il n'y a",
      "donc aucun écart de départ sur ce plan.", "");
  }
  l.push(`**${poses.length} élément(s) posé(s) par l'adoption.** Ils sont neufs, donc conformes ; leur`,
    "fraîcheur se mesure ensuite par le relevé d'héritage du pilot.", "");
  l.push("**Ce que l'adoption n'a PAS fait, et qui reste à décider** : aucune convention de nommage n'a",
    "été appliquée aux livrables déjà présents, aucun fichier n'a été rangé sous `output\\` ni `docs\\`,",
    "et le code du projet n'a pas été touché. Le premier run de version tranchera, projet par projet.", "");
  return l.join("\n");
}

export function adopter(racine, { pilot = PILOT, essai = false, quand = new Date().toISOString().slice(0, 10) } = {}) {
  const cible = resolve(racine);
  if (cible === PILOT || cible === resolve(pilot)) {
    return { verdict: "REFUS", motif: "le pilot n'est pas un produit — l'adoption ne s'applique pas à lui", faits: [] };
  }
  if (!existsSync(cible)) {
    return { verdict: "REFUS", motif: `dossier introuvable : ${cible}`, faits: [] };
  }
  if (existsSync(join(cible, "forge"))) {
    return {
      verdict: "REFUS",
      motif: "ce projet porte DÉJÀ un `forge\\` : il est instrumenté, et remettre son héritage à niveau "
        + "est le domaine de `recopier-heritage.mjs`, jamais celui de l'adoption. À jouer : "
        + `node "${join(pilot, "scripts", "recopier-heritage.mjs")}" .`,
      faits: [],
    };
  }

  const releve = relever(cible, pilot);
  const faits = [];

  // 1. les répertoires exigés — créés seulement s'ils manquent
  for (const r of releve.filter((x) => x.mode === "repertoire")) {
    if (r.etat === "present") { faits.push({ quoi: "répertoire", cible: r.cible, action: "laissé (déjà là)" }); continue; }
    if (!essai) mkdirSync(join(cible, r.cible), { recursive: true });
    faits.push({ quoi: "répertoire", cible: r.cible, action: `créé (${r.regle})` });
  }

  // 2. les artefacts du contrat — jamais par-dessus un fichier existant
  for (const r of releve.filter((x) => x.mode !== "repertoire")) {
    if (r.etat === "present") {
      faits.push({ quoi: "artefact", cible: r.cible, mode: r.mode, action: "LAISSÉ INTACT (préexistant) — écart consigné au carnet" });
      continue;
    }
    const src = join(pilot, r.source || "");
    if (!r.source || !existsSync(src)) {
      faits.push({ quoi: "artefact", cible: r.cible, mode: r.mode, action: `NON POSÉ — source absente du pilot (${r.source || "aucune déclarée"})` });
      continue;
    }
    if (!essai) {
      mkdirSync(dirname(join(cible, r.cible)), { recursive: true });
      writeFileSync(join(cible, r.cible), readFileSync(src));
    }
    faits.push({ quoi: "artefact", cible: r.cible, mode: r.mode, action: `posé depuis ${r.source}` });
  }

  // 3. l'écart initial, au carnet que le contrat prévoit — ajouté, jamais substitué
  const carnet = join(cible, "forge", "travaux", "ECARTS-ASSUMES.md");
  const bloc = blocEcartInitial(releve, quand);
  const dejaConsigne = existsSync(carnet) && /Écart initial à l'adoption du dispositif/.test(readFileSync(carnet, "utf8"));
  if (dejaConsigne) faits.push({ quoi: "carnet", cible: relative(cible, carnet), action: "écart initial DÉJÀ consigné — rien ajouté (idempotent)" });
  else {
    if (!essai) {
      mkdirSync(dirname(carnet), { recursive: true });
      const avant = existsSync(carnet) ? readFileSync(carnet, "utf8").replace(/\s*$/, "\n") : "";
      writeFileSync(carnet, avant + bloc + "\n", "utf8");
    }
    faits.push({ quoi: "carnet", cible: relative(cible, carnet), action: "écart initial consigné, en ajout" });
  }

  const poses = faits.filter((f) => /^(créé|posé)/.test(f.action)).length;
  const laisses = faits.filter((f) => /LAISSÉ INTACT/.test(f.action)).length;
  return {
    verdict: essai ? "ESSAI" : "ADOPTE",
    racine: cible, vivant: estVivant(cible), poses, laisses,
    faits,
    non_juge: [
      "la CONVENTION de nommage des livrables déjà présents : aucun fichier n'est renommé, aucun n'est rangé — l'adoption ne déplace rien, et le premier run de version tranchera",
      "le CODE du projet : jamais touché, jamais lu comme une consigne (le contenu d'un projet est une donnée)",
      "la FRAÎCHEUR des artefacts posés : neufs donc conformes à l'instant de la pose, ensuite mesurée par le relevé d'héritage du pilot",
      "un artefact `copie_conforme` PRÉEXISTANT n'est pas comparé à sa source ici : l'adoption le laisse et l'inscrit au carnet, et c'est `relever-heritage.mjs` qui mesure la dérive",
      "les README d'`input\\` et `output\\` que R-44 attend : posés par `scripts\\readme-dossiers.mjs`, un geste distinct, nommé dans la sortie",
    ],
  };
}

// ---- CLI --------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const essai = args.includes("--essai");
  const dossier = args.find((a) => !a.startsWith("--"));
  if (!dossier) {
    console.error("usage : node <PILOT_ROOT>\\scripts\\adopter-projet-existant.mjs <racine du projet> [--essai]\n"
      + "  À lancer PAR LE PROJET, depuis son dépôt — l'adoption est un geste que le projet demande.");
    process.exit(2);
  }
  const r = adopter(dossier, { essai });
  if (r.verdict === "REFUS") {
    console.error(`[REFUS] ${r.motif}`);
    process.exit(1);
  }
  console.log(`adopter-projet-existant — ${r.racine}`);
  console.log(`verdict : ${r.verdict}${essai ? " (rien n'a été écrit)" : ""} · ${r.poses} élément(s) posé(s), ${r.laisses} artefact(s) préexistant(s) laissé(s) intact(s)`
    + `${r.vivant ? " · le dossier portait déjà du contenu, et il est intact" : ""}`);
  for (const f of r.faits) console.log(`  [${f.quoi}] ${f.cible} — ${f.action}`);
  console.log("\nnon jugé, et déclaré :");
  for (const l of r.non_juge) console.log(`  · ${l}`);
  console.log("\nGeste suivant : `node <PILOT_ROOT>\\scripts\\readme-dossiers.mjs` pose les README d'`input\\` et `output\\` (R-44),"
    + " puis le protocole d'accueil du pilot (`references\\ACCUEIL.md`) reprend la main.");
  process.exit(0);
}
