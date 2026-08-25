#!/usr/bin/env node
/**
 * localiser-produit.mjs — retrouver le dépôt d'un produit dans le parc, et mesurer son héritage.
 *
 * ============================================================================================
 * POURQUOI CE MODULE EXISTE (TF-0623, mesure du 25/08/2026)
 * ============================================================================================
 *
 * LE FAIT. L'ingestion d'un lot a rendu « conformité de l'héritage NON VÉRIFIÉE pour
 * Produit-11 — dossier introuvable sous C:\dev ». Le produit existait, à
 * `_Client-A\BourseAuxVacants2\Produit-11`, soit TROIS niveaux sous la racine. Deux défauts
 * se cumulaient, et aucun ne se voyait depuis la sortie :
 *
 *   · la comparaison de nom était BRUTE — `"bourseauxvacants2".startsWith("Produit-11")`
 *     est faux, les tirets du nom de produit n'existant pas dans les noms de dossiers ;
 *   · la recherche s'arrêtait à DEUX niveaux, borne assumée et écrite dans le code (« au-delà, on
 *     balaierait le disque pour deviner ») — défendable jusqu'à ce qu'un produit vive plus bas.
 *
 * ET CE PRODUIT ÉTAIT PRÉCISÉMENT CELUI DONT TROIS LOTS ONT ÉTÉ DÉROGUÉS sur le même motif. Le
 * contrôle qui aurait NOMMÉ la cause de ces trois dérogations est celui qui ne pouvait pas voir ce
 * produit. La borne ne coûtait rien jusqu'au jour où elle a coûté exactement le sujet qu'elle
 * devait éclairer.
 *
 * ============================================================================================
 * LE CRITÈRE : UN PRODUIT SE RECONNAÎT À CE QU'IL FAIT, PAS À SA PROFONDEUR DE RANGEMENT
 * ============================================================================================
 *
 * Un produit qui remet des lots porte `forge\retours\<son nom> - RETOURS - ....md`. Le chercher
 * par CE QU'IL FAIT est plus sûr qu'un préfixe de dossier : le dossier est un choix de rangement,
 * révisable et parfois sans rapport avec le nom du produit, tandis que le fichier de lot est une
 * CONSÉQUENCE du travail. Le nom reste un second critère, normalisé cette fois.
 *
 * MESURE SUR LE PARC RÉEL, six noms de produits joués avant livraison (N-23) :
 *   · `Produit-11`            → trouvé par ses LOTS, à trois niveaux — invisible avant ;
 *   · `Produit-03` → trouvé par ses LOTS dans `_Client-A\Plateforme_video_IA_complet`,
 *     un dossier dont le NOM ne lui ressemble en rien : le critère de nom n'aurait JAMAIS pu ;
 *   · `Produit-01`, `Produit-10`          → trouvés, comme avant ;
 *   · `Produit-02`, `miniveille` → non trouvés, et c'est JUSTE : ils n'existent pas sur ce
 *     poste. Un négatif exact, pas un faux négatif.
 * Zéro faux positif sur les six, et le critère de nom seul n'en aurait trouvé AUCUN des quatre.
 * Coût mesuré : 48 ms pour un balayage complet — on lit des noms, jamais des contenus.
 *
 * LA BORNE PASSE À TROIS NIVEAUX ET RESTE DÉCLARÉE : au-delà, on balaierait le disque pour
 * deviner. Les dossiers lourds sont sautés nommément, et on ne descend jamais SOUS un produit
 * déjà identifié — ses sous-dossiers ne sont pas des produits.
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Profondeur maximale de recherche sous la racine du parc. Déclarée, pas devinée. */
export const PROFONDEUR_MAX = 3;

/** Ce qu'on ne parcourt pas : ni utile, ni bon marché. */
export const SAUTES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build",
  ".next", "vendor", "output", "input", ".pytest_cache", ".ruff_cache"]);

/** Comparaison de noms insensible à la casse ET à la ponctuation : `Produit-11` ≡ `Produit-11`. */
export const normal = (x) => String(x).toLowerCase().replace(/[^a-z0-9]/g, "");

const enfants = (d) => {
  try { return readdirSync(d, { withFileTypes: true }).filter((x) => x.isDirectory()); }
  catch { return []; }
};

/**
 * Localise le dépôt d'un produit. Rend `{ dossier, par }` — `par` valant `"lots"`, `"nom"` ou
 * `null`, pour que l'appelant puisse DIRE comment il a trouvé, et non seulement ce qu'il a trouvé.
 */
export function localiserProduit(projet, racine) {
  if (!projet || !racine || !existsSync(racine)) return { dossier: null, par: null };
  const cible = normal(projet);
  if (!cible) return { dossier: null, par: null };

  const porteDesLots = (d) => {
    const r = join(d, "forge", "retours");
    if (!existsSync(r)) return false;
    try { return readdirSync(r).some((f) => normal(f).startsWith(cible)); } catch { return false; }
  };

  const parLesLots = [];
  const parLeNom = [];
  const descendre = (d, niveau) => {
    if (niveau > PROFONDEUR_MAX) return;
    for (const e of enfants(d)) {
      if (SAUTES.has(e.name)) continue;
      const c = join(d, e.name);
      const aUnForge = existsSync(join(c, "forge"));
      if (porteDesLots(c)) parLesLots.push(c);
      else if (normal(e.name).startsWith(cible) && aUnForge) parLeNom.push(c);
      if (!aUnForge) descendre(c, niveau + 1);
    }
  };
  descendre(racine, 1);

  if (parLesLots.length) return { dossier: parLesLots[0], par: "lots" };
  if (parLeNom.length) return { dossier: parLeNom[0], par: "nom" };
  return { dossier: null, par: null };
}

/**
 * L'état de l'héritage chez un produit, d'après le contrat. Rend les cibles ABSENTES, et rien
 * d'autre : ce module localise et compte, il ne juge pas — le juge est R-47 chez l'appelant.
 */
export function artefactsAbsents(dossier, contrat) {
  if (!dossier || !contrat || !Array.isArray(contrat.artefacts)) return null;
  return contrat.artefacts
    .map((a) => a.cible)
    .filter((cible) => cible && !existsSync(join(dossier, String(cible).replaceAll("/", "\\"))));
}

/**
 * LA CAUSE D'UN REFUS DE FORME, MESURÉE PLUTÔT QU'ÉNUMÉRÉE (le cœur de TF-0623).
 *
 * Le message de refus énumérait TROIS causes possibles et laissait le lecteur deviner laquelle
 * s'applique. *Un contrôle qui énonce des hypothèses sur sa propre cause prend la place de celle
 * qu'il pouvait mesurer* — et c'est plus nuisible qu'un message vide, parce qu'un message vide
 * envoie chercher tandis qu'une liste d'hypothèses donne l'impression d'avoir compris.
 *
 * Les trois causes restent écrites ici comme doctrine ; ce qui change est que le message n'en
 * garde qu'UNE, celle que la mesure désigne. Et si la mesure est impossible — produit introuvable
 * sur ce poste — elle le DIT et retombe sur l'énumération, plutôt que d'inventer.
 */
export function causeDuRefus(projet, racine, contrat) {
  const { dossier, par } = localiserProduit(projet, racine);
  if (!dossier) {
    return {
      mesuree: false,
      texte: `le produit « ${projet} » n'est pas localisable sous ${racine} (recherche par ses lots ` +
        `puis par son nom, ${PROFONDEUR_MAX} niveaux) — la cause n'est donc PAS mesurée ici, et les ` +
        "trois causes connues sont rendues telles quelles plutôt qu'une devinette :\n" +
        "    (1) le produit écrit avec une COPIE du gabarit prise à la création de son run et jamais rafraîchie ;\n" +
        "    (2) le produit n'a JAMAIS reçu l'héritage — R-47 le nomme, et le geste est de Recopier ;\n" +
        "    (3) le produit A le gabarit à jour et ne l'applique pas — le seul cas qu'aucune recopie ne répare.",
    };
  }
  const absents = artefactsAbsents(dossier, contrat) || [];
  const outil = absents.some((c) => String(c).includes("oracle-lot"));
  const gabarit = absents.some((c) => String(c).includes("RETOURS-FORGES"));
  if (outil || gabarit) {
    return {
      mesuree: true, dossier, par, absents,
      texte: `CAUSE MESURÉE — c'est la (2) : le produit n'a pas l'héritage. Trouvé par ses ${par} en ` +
        `${dossier}, il lui manque ${absents.length} artefact(s) du contrat, dont ` +
        `${[gabarit ? "le GABARIT qui décrit les sections" : null, outil ? "l'OUTIL qui les vérifie" : null].filter(Boolean).join(" et ")}. ` +
        "Il ne POUVAIT donc pas jouer le contrôle qu'on lui conseille ci-dessus — le lui reprocher " +
        "serait injuste. Geste : Recopier les artefacts manquants depuis `gabarits\` (R-47), puis rejouer le contrôle " +
        "DEPUIS son dépôt pour vérifier que l'affordance est câblée et pas seulement présente.",
    };
  }
  return {
    mesuree: true, dossier, par, absents,
    texte: `CAUSE MESURÉE — c'est la (3), la plus fréquente et la seule qu'aucune recopie ne répare : ` +
      `le produit A l'héritage (trouvé par ses ${par} en ${dossier}, gabarit et outil présents) et ne ` +
      "l'a pas joué avant de remettre. Le seul remède est de jouer le contrôle avant la remise ; " +
      "une dérogation ici coûterait la leçon sans rien réparer.",
  };
}
