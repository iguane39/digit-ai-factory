#!/usr/bin/env node
/**
 * decouvrir-oracles.mjs — les oracles du PILOT, lus sur le disque, au contrat commun du parc
 * (TF-1319, 23/09/2026 : temps 2 du verdict O3 de l'étude
 * `output/03-etudes/20260819-etude-opportunite-meta-oracle-enclenchement.md`).
 *
 * ============================================================================================
 * LE CONTRAT, ET POURQUOI IL EST LE MÊME PARTOUT
 * ============================================================================================
 *
 * Chaque dépôt du parc qui porte des oracles expose UNE entrée, au même chemin :
 *
 *   node oracles/decouvrir-oracles.mjs [--racine <dossier>]
 *   stdout : { contrat: "digit-ai/decouverte-oracles@1", forge, racine, regle,
 *              oracles: [{ nom, chemin }], non_juge: [] }
 *   exit 0 : découverte faite — une liste vide est un résultat, et elle se lit comme telle ;
 *   exit 2 : racine illisible, motif dit. Jamais d'exit 1 : découvrir n'est pas juger.
 *
 * Le juge d'enclenchement (`oracles/oracle-enclenchement.mjs`) trouve cette entrée par son CHEMIN,
 * jamais par une table des forges : une table écrite à la main aurait été la liste que ce temps 2
 * existe pour supprimer. Chaque dépôt garde SA règle — un nom, un dossier, un point d'entrée — et
 * la dit dans `regle`. Contrat écrit : CONTRAT-INTERFACE.md §3.
 *
 * ============================================================================================
 * LA RÈGLE DU PILOT
 * ============================================================================================
 *
 * Tout fichier nommé `oracle-<nom>.mjs|.cjs|.js` ou `oracle[-_]<nom>.py`, où qu'il vive dans le
 * dépôt, hors des dossiers qui ne portent pas d'oracle EN SERVICE (dépendances, caches, archives,
 * `fixtures`, entrants `input`) et hors recettes `*.test.mjs`. Mesuré le 23/09/2026 : les oracles
 * du pilot vivent sous `oracles\`, mais aussi sous `gabarits\` (les deux qui partent chez les
 * produits avec l'héritage) et sous `todo\` (le juge du registre) — une règle limitée à `oracles\`
 * en aurait rendu trois invisibles.
 *
 * `self-tests.mjs` DÉCOUVRE déjà les oracles du dossier `oracles\` — pour leur RECETTE (I1). Cette
 * découverte-ci répond à une autre question : quels oracles le pilot porte-t-il, pour qu'un
 * verdict consigné au ledger d'un run sous l'un de ces noms soit reconnu, et non déclaré inconnu.
 *
 * Recette à double sens : `oracles\decouvrir-oracles.test.mjs`.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CONTRAT = "digit-ai/decouverte-oracles@1";
export const FORGE = "digit-ai-factory";
export const REGLE = "tout fichier `oracle-<nom>.(mjs|cjs|js)` ou `oracle[-_]<nom>.py` du dépôt, "
  + "hors dépendances, caches, `Old`/`old`, `fixtures` et `input`, recettes `*.test.mjs` exclues — "
  + "lu sur le disque à chaque appel";

//: Les dossiers où un fichier nommé comme un oracle n'est pas un oracle en service. Nommés un par
//: un : un motif large écarterait aussi ce qu'on cherche, et une exclusion qui ne se lit pas ne se
//: conteste pas.
export const ECARTES = new Set([".git", "node_modules", ".venv", "venv", "__pycache__",
  ".pytest_cache", ".ruff_cache", ".mypy_cache", ".oracles", "Old", "old", "fixtures", "vendor",
  "input"]);

//: Le nom EST la déclaration. Le motif s'arrête au premier point : `oracle-x.test.mjs` n'y entre pas.
export const EST_UN_ORACLE = (nom) => /^oracle-[\w-]+\.(?:mjs|cjs|js)$/.test(nom) || /^oracle[-_]\w[\w-]*\.py$/.test(nom);

const PROFONDEUR_MAX = 12;

function parcourir(dossier, trouves, profondeur) {
  if (profondeur > PROFONDEUR_MAX) return;
  let entrees;
  try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return; }
  for (const e of entrees) {
    const p = join(dossier, e.name);
    if (e.isDirectory()) { if (!ECARTES.has(e.name)) parcourir(p, trouves, profondeur + 1); }
    else if (e.isFile() && EST_UN_ORACLE(e.name)) trouves.push(p);
  }
}

/** La découverte au contrat commun, importable par une recette ou par le juge. */
export function decouvrirOracles(racine) {
  const base = { contrat: CONTRAT, forge: FORGE, racine, regle: REGLE, oracles: [] };
  let estDossier = false;
  try { estDossier = existsSync(racine) && statSync(racine).isDirectory(); } catch { estDossier = false; }
  if (!estDossier) {
    return { ...base, motif: `racine introuvable ou illisible : ${racine} — rien n'a été découvert`, non_juge: [] };
  }
  const trouves = [];
  parcourir(racine, trouves, 0);
  const oracles = trouves
    .map((p) => ({ nom: basename(p, extname(p)), chemin: relative(racine, p).split("\\").join("/") }))
    .sort((a, b) => (a.chemin < b.chemin ? -1 : a.chemin > b.chemin ? 1 : 0));
  const parNom = new Map();
  for (const o of oracles) parNom.set(o.nom, [...(parNom.get(o.nom) || []), o.chemin]);
  const doublons = [...parNom.entries()].filter(([, c]) => c.length > 1);
  return {
    ...base,
    oracles,
    non_juge: [
      "la règle lit le NOM du fichier : un contrôle exécutable nommé autrement (`self-tests.mjs`, `scripts\\verifier-*.mjs`, un hook) n'est pas découvert ici",
      "découvrir n'est pas lancer : cette liste ne dit ni qu'un oracle a tourné, ni sur quel artefact il s'applique (granularité retenue : le dépôt, étude du 19/08 §5)",
      ...doublons.map(([nom, chemins]) => `nom porté par ${chemins.length} fichiers (${chemins.join(", ")}) : un verdict qui le nomme ne dit pas lequel a tourné`),
    ],
  };
}

// ---- CLI -------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().split("\\").join("/")
     === resolve(process.argv[1]).toLowerCase().split("\\").join("/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--racine");
  const racine = resolve(i >= 0 && args[i + 1] ? args[i + 1] : join(dirname(fileURLToPath(import.meta.url)), ".."));
  const r = decouvrirOracles(racine);
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.motif ? 2 : 0);
}
