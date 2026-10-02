#!/usr/bin/env node
/**
 * oracle-lot-retours.mjs — juge la FORME d'un lot de retours (R-45, R-46) AVANT sa remise.
 *
 * ============================================================================================
 * POURQUOI CE FICHIER EXISTE (TF-0597, 24/08/2026)
 * ============================================================================================
 *
 * En une seule journée, SIX lots ont dû être admis par DÉROGATION, tous pour la même faute de
 * forme : les sections « Remarques restées au produit » (R-45) et « Retours sur les documents
 * produits » (R-46) absentes. La cause a été cherchée jusqu'aux trois produits émetteurs, et
 * elle est TRIPLE sous un symptôme identique :
 *
 *   1. le produit n'a JAMAIS REÇU le gabarit — R-47 le dit déjà (héritage non tenu) ;
 *   2. le produit n'a JAMAIS ÉTÉ INSTANCIÉ — R-47 rend SANS_OBJET, c'est le sujet de TF-0514 ;
 *   3. le produit A LE GABARIT, À JOUR, et n'applique pas la forme — R-47 rend **PASS**.
 *
 * Le troisième cas est le plus fréquent (quatre lots sur six), et c'est le seul qu'AUCUNE copie
 * de fichier ne répare. Mesure qui l'établit : le gabarit du produit était identique à la source
 * du pilot (comparaison hors fins de ligne), recopié le 24/08 à 10:04, et portant en clair à sa
 * ligne 87 « SECTION OBLIGATOIRE depuis le 22/08/2026 ». Le lot a été écrit à 18:32 — HUIT HEURES
 * plus tard, avec la consigne sur place — sans la section.
 *
 * LE TROU EST MÉCANIQUE, PAS MORAL. Les contrôles R-45/R-46 vivaient dans `todo\ingerer-lot.mjs`,
 * c'est-à-dire À LA PORTE DU PILOT. Le produit qui rédige son lot n'avait AUCUN moyen de les
 * jouer chez lui : il découvrait le refus après coup — et sous dérogation, il ne le découvrait
 * même pas. Le gabarit prescrivait en PROSE ce que l'ingestion jugeait en CODE, et la loi n° 1
 * dit qu'une affordance non câblée n'existe pas.
 *
 * UN SEUL JEU DE RÈGLES, DEUX ENDROITS OÙ LE JOUER. Ce module est la SOURCE des deux : la porte
 * du pilot l'importe, et le produit en reçoit une copie conforme par l'héritage
 * (`gabarits\HERITAGE.json` → `forge\retours\oracle-lot.mjs`). Deux implémentations de la même
 * forme auraient donné deux vérités — le défaut que TF-0474 a nommé sur les empreintes, où cinq
 * mécanismes de scellement coexistaient sans format commun et où la même classe de défaut a été
 * redécouverte forge par forge.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ, ET CE QUI NE L'EST PAS
 * ============================================================================================
 *
 * Jugé : la PRÉSENCE des deux sections, et sous chacune la présence d'un verdict (R-45) ou d'un
 * rattachement à un gabarit (R-46) — ou de la phrase qui déclare qu'il n'y a rien à dire.
 *
 * NON jugé, et c'est délibéré : la JUSTESSE d'un verdict de généralisation. Un raisonnement
 * écrit peut être faux et se corrige ; un raisonnement absent est perdu pour tout le monde.
 *
 * R-49 (TF-0884, 08/09/2026) — UN LOT REMIS ET INGÉRÉ NE SE RÉÉCRIT JAMAIS. Le 06/09, un compte
 * rendu d'agent a pris l'indice « a » que son mandat nommait, déjà porté par un lot du même
 * produit remis et ingéré le matin même ; une écriture ordinaire l'a remplacé, et rien ne s'y est
 * opposé — ni le gabarit (qui écrit pourtant « un lot remis ne se modifie JAMAIS »), ni cet
 * oracle (PASS sur l'écrasement), ni la boîte d'entrée, qui ne le voit qu'à l'ouverture suivante.
 * La règle confronte l'empreinte du sidecar présent à celle consignée par l'événement d'ingestion
 * portant le même nom de fichier ; deux empreintes différentes pour un même chemin = le fichier a
 * été réécrit après sa remise, et le remède est l'INDICE SUIVANT, jamais une retouche. Hors du
 * pilot — la copie de ce module que chaque produit reçoit par l'héritage n'a pas le registre sous
 * la main — la règle rend SANS_OBJET et le DIT : un contrôle qui exige une donnée absente crie
 * partout sauf là où il sert.
 *
 * LOT-SAS (TF-1054, 14/09/2026) — UN LOT ARRIVE PAR LE SAS. Un lot posé à la racine SUIVIE de
 * `input\00-retours\` sous un nom réel n'est pas passé par `_arrivee\` : il est refusé, et le
 * remède nomme le sas. Hors de la boîte du pilot, et dans la copie héritée, SANS_OBJET dit.
 *
 * LOT-IDS (TF-1039, 14/09/2026) — UN IDENTIFIANT DE RETOUR N'EST JAMAIS REPRIS. Le gabarit écrit
 * « ids uniques par produit, numéro jamais réutilisé » ; personne ne le jugeait, et le 11/09 un
 * lot a repris RT-50 à RT-52, déjà définis par deux lots antérieurs du même produit, dans le même
 * dossier. La règle lit les lots VOISINS antérieurs du même produit (lecture de répertoire, pas
 * de registre) et refuse un identifiant qu'ils définissent déjà, en donnant le premier libre.
 * Bornée au 14/09 : un lot remis ne se modifie jamais, le passé ne se répare pas.
 *
 * ANTÉRIORITÉ DÉCLARÉE : R-45 ne juge que les lots datés du 21/08 ou après, R-46 du 22/08 ou
 * après. La date se lit dans le NOM du fichier (`… - AAAAMMJJ<lettre>.md`), jamais sur le
 * disque : une copie change la date de fichier, pas la date du lot.
 *
 * R-57 (24/09/2026, décision humaine) — UN DOCUMENT MÛR REMONTE À LA BIBLIOTHÈQUE, SA FORME JAMAIS
 * SA MATIÈRE. Deux constats. `R-57` : le lot porte la section « Documents mûrs », et sous elle un
 * verdict de remontée (« remonté » / « reste au produit, parce que… ») ou la déclaration qu'il n'y
 * a aucun document mûr — même forme que R-45 et R-46. `LOT-MURS` : chez le PRODUIT (lot posé sous
 * `<racine>\forge\retours\`), l'oracle balaie `<racine>\output\` et compte les versions datées de
 * chaque objet ; un objet d'au moins SEUIL_MUR versions est MÛR MESURÉ, et le lot qui ne le nomme
 * ni dans sa section ni dans celle d'un lot antérieur du même produit est refusé — la remontée
 * cesse de dépendre de la mémoire de celui qui écrit le lot. À la porte du pilot, le lot a été
 * pseudonymisé et l'`output\` réel n'est plus comparable : LOT-MURS y rend SANS_OBJET, et le dit.
 * Seuil mesuré le 24/09/2026 sur le produit qui fonde la règle : 31 objets HTML, 12 à 3 versions
 * ou plus, 8 à 5 ou plus, 6 à 8 ou plus — à 5, une déclaration unique de 8 documents, que
 * l'historique des lots couvre ensuite. Le compte est une BORNE BASSE assumée : il ne dit rien de
 * la qualité d'une forme, il empêche seulement qu'un document repris cinq fois reste invisible
 * (seuil confirmé par le porteur le 28/09/2026). En vigueur le 29/09 : la règle entre au main le
 * 28/09 (TF-1413), et les lots écrits jusque-là, sans elle, ne sont pas accusés (R-33 bis).
 *
 * Usage :
 *   node oracle-lot-retours.mjs <lot.md> [--json]
 *   node oracle-lot-retours.mjs --murs <racine-produit>   (liste les documents mûrs mesurés)
 * Exit : 0 = forme tenue (ou lot antérieur aux règles) · 1 = forme en défaut · 2 = lot illisible.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

export const VERSION = "1.4.1"; // 1.4.1 (28/09/2026) : le remède nomme le gabarit canonique, TF-1430 · 1.4.0 (28/09/2026) : règles R-57 et LOT-MURS, TF-1413 · 1.3.0 (26/09/2026) : règle LOT-DATE, TF-1358

/**
 * Le gabarit que le remède de R-45, R-46 et R-57 fait ouvrir, sous sa cible CANONIQUE chez le
 * produit (`gabarits\HERITAGE.json`, TF-0710). Le remède nommait encore l'alias de transition
 * `forge\retours\RETOURS-FORGES.md` : un produit qui porte les deux ouvrait la copie périmée, et
 * le lot qu'il en tirait arrivait sans classe et hors du sas (TF-1430, lot Produit-76 du 28/09).
 * Non exporté, à dessein : la porte du pilot importe ce module, et ses exports ne bougent pas.
 */
const GABARIT_LOT = "forge\\retours\\GABARIT-LOT-RETOURS.md";

// LOT-SAS (TF-1054) juge un NOM avec le MÊME juge que `todo\accueillir-lot.mjs` — deux juges des
// noms qui ne s'accordent pas donnent le pire des deux mondes (leçon de la casse, 01/09). Import
// DYNAMIQUE et toléré : la copie de ce module qu'un produit reçoit par l'héritage n'a pas le
// module d'anonymisation à côté d'elle, et elle doit rester jouable seule.
let anonymiserPilot = null;
try {
  ({ anonymiser: anonymiserPilot } = await import(new URL("../todo/anonymiser-entrant.mjs", import.meta.url).href));
} catch { /* copie héritée chez un produit : la règle y rend SANS_OBJET et le dit */ }

/** R-45 depuis le 21/08/2026, R-46 depuis le 22/08, R-57 depuis le 29/09 — antériorité déclarée,
 *  jamais devinée. R-57 est décidée le 24/09 et entre au main le 28/09 : les lots écrits jusque-là,
 *  sans la règle sous la main, ne sont pas accusés. */
export const SEUILS = { "R-45": "20260821", "R-46": "20260822", "R-57": "20260929" };

const SECTION_R45 = /^##\s+Remarques\s+rest[ée]es?\s+au\s+produit\s*$/im;
const SECTION_R46 = /^##\s+Retours\s+sur\s+les\s+documents\s+produits\s*$/im;
const SECTION_R57 = /^##\s+Documents\s+m[ûu]rs\b[^\n]*$/im;
//: Le verdict de remontée d'un document mûr, ou la déclaration qu'il n'y en a aucun. Pas de `\b`
//: APRÈS la lettre accentuée : sans drapeau Unicode, « remonté » suivi d'une espace n'a pas de
//: frontière de mot, et le verdict le plus naturel n'était pas reconnu (recette du 24/09/2026).
const VERDICT_R57 = /\bremont[ée]|\brest[ée]e?s?\s+au\s+produit\b/i;
const AUCUN_R57 = /aucun\s+document\s+m[ûu]r/i;
/** R-57 : un objet est MÛR MESURÉ à partir de ce nombre de versions datées (mesure du 24/09/2026). */
export const SEUIL_MUR = 5;
//: Le verdict de généralisation, ou la déclaration qu'il n'y a rien à généraliser.
const VERDICT_R45 = /g[ée]n[ée]ralisab/i;
const AUCUNE_R45 = /aucune\s+remarque\s+n['’]est\s+rest[ée]e?\s+au\s+produit/i;
//: Le rattachement à un gabarit (son id `gd-…` ou sa version), ou la déclaration d'absence.
const RATTACHEMENT_R46 = /gd-[a-z-]+|version[_ ]du[_ ]gabarit/i;
const AUCUN_R46 = /aucun\s+document\s+produit\s+depuis\s+un\s+gabarit/i;

/** La date portée par le NOM du lot — jamais celle du disque, qu'une copie suffit à changer. */
export function dateDuLot(chemin) {
  const nom = basename(String(chemin).split("\\").join("/"));
  const m = /(\d{8})[a-z]?\.(?:md|tf\.jsonl)$/i.exec(nom)
    || /(\d{8})[a-z]?\.normalise\.tf\.jsonl$/i.exec(nom);
  return m ? m[1] : null;
}

/** LOT-IDS (TF-1039) : entrée en vigueur — antériorité déclarée, un lot remis ne se modifie jamais. */
export const SEUIL_IDS = "20260914";
// Un identifiant est DÉFINI en tête d'une ligne de tableau qui porte sa GRAVITÉ dans l'une des deux
// cellules suivantes (`| RT-50 | majeur | …`, la forme du gabarit), ou en tête d'un titre
// (`### RT-50 — …`). Cité dans la prose (« déjà remontée en RT-6 ») ou dans un tableau de RAPPEL
// sans gravité, il ne l'est pas. Mesuré sur 247 lots réels le 14/09 : sans l'exigence de gravité,
// un tableau de rappel (« ce que ce retour ajoute aux lots du jour ») accusait huit reprises à tort.
const ID_EN_TETE_DE_LIGNE = /^\s*\|\s*\**\s*(R[A-Z])-0*(\d+)\b[^|\n]*\|(?:[^|\n]*\|)?\s*\**\s*(?:bloquant|majeur|mineur)\b/gim;
const ID_EN_TITRE = /^#{2,4}\s+\**\s*(R[A-Z])-0*(\d+)\b/gm;
const NOM_DE_LOT = /^(.*) - RETOURS - (\d{8}[a-z]?)\.md$/i;

/**
 * TF-1458 (28/09/2026) — LE PRÉFIXE DE COMPARAISON, PAS LE PRÉFIXE BRUT. Au sas d'arrivée
 * (`_arrivee\`), un lot porte encore le NOM RÉEL de son produit ; la boîte d'entrée (`00-retours\`
 * et son `old\`) ne porte que des pseudonymes. Comparer les préfixes TELS QUELS ne trouve donc
 * JAMAIS de voisin — les deux graphies ne concordent par construction pour AUCUN produit, et
 * LOT-IDS comme le cumul des « documents mûrs » (R-57) rendaient leur verdict sur un ensemble
 * vide. Le préfixe du lot JUGÉ se pseudonymise comme les autres avant la comparaison ; un lot déjà
 * pseudonymisé (hors sas) traverse `anonymiser()` sans y changer quoi que ce soit.
 */
function prefixeComparable(nom, prefixe) {
  if (!anonymiserPilot) return prefixe;
  try {
    const m = NOM_DE_LOT.exec(anonymiserPilot(nom).texte);
    return m ? m[1] : prefixe;
  } catch { return prefixe; }
}

/** Les identifiants qu'un lot DÉFINIT, numéros normalisés (`RT-050` = `RT-50`). */
export function idsDefinis(texte) {
  const ids = new Set();
  for (const re of [ID_EN_TETE_DE_LIGNE, ID_EN_TITRE]) for (const m of String(texte).matchAll(re)) ids.add(`${m[1].toUpperCase()}-${Number(m[2])}`);
  return ids;
}

/**
 * Les identifiants de ce lot déjà définis par un lot ANTÉRIEUR du même produit, dans le même
 * dossier (et son `old\`, où la boîte du pilot range ce qu'elle a ingéré). Rend `null` si le nom
 * n'est pas celui d'un lot. `premierLibre` : par famille en double, le numéro qui suit le plus
 * grand déjà défini par les voisins.
 */
export function idsEnDouble(cheminLot, texte) {
  const nom = basename(String(cheminLot).split("\\").join("/"));
  const m = NOM_DE_LOT.exec(nom);
  if (!m) return null;
  const [, prefixeBrut, cle] = m;
  const prefixe = prefixeComparable(nom, prefixeBrut);
  const dossier = dirname(resolve(String(cheminLot)));
  const dossiers = [dossier, join(dossier, "old")];
  if (/^_arrivee$/i.test(basename(dossier))) dossiers.push(join(dossier, ".."), join(dossier, "..", "old"));
  const porteurs = new Map(), max = {};
  let voisins = 0;
  for (const d of dossiers) {
    if (!existsSync(d)) continue;
    for (const n of readdirSync(d)) {
      const v = NOM_DE_LOT.exec(n);
      if (!v || n === nom || v[1].toLowerCase() !== prefixe.toLowerCase() || v[2] >= cle) continue;
      voisins++;
      let t = "";
      try { t = readFileSync(join(d, n), "utf8"); } catch { continue; }
      for (const id of idsDefinis(t)) {
        if (!porteurs.has(id)) porteurs.set(id, n);
        const [fam, num] = id.split("-");
        max[fam] = Math.max(max[fam] || 0, Number(num));
      }
    }
  }
  const doublons = [...idsDefinis(texte)].filter((id) => porteurs.has(id)).map((id) => ({ id, lot: porteurs.get(id) }));
  const premierLibre = {};
  for (const { id } of doublons) { const fam = id.split("-")[0]; premierLibre[fam] = `${fam}-${(max[fam] || 0) + 1}`; }
  return { doublons, premierLibre, voisins };
}

/** Le corps d'une section, jusqu'au prochain titre de niveau 2. */
const corpsDeSection = (texte, re) => (texte.split(re)[1] || "").split(/^## /m)[0] || "";

// ---- R-57 · les documents MÛRS d'un produit, mesurés sur son `output\` -------------------------
const LIVRABLE_DATE = /^(.+?) - (\d{8})([a-z]?)\.html?$/i;
/** Minuscules, sans accents ni blancs répétés : « Guide développeur » = « guide  developpeur ». */
export const normaliser = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/\s+/g, " ").trim();
/** L'objet d'un livrable sans sa MARQUE : ce qui suit le premier « - » (convention R-4). Un lot
 *  pseudonymisé à la porte du pilot garde ainsi l'objet qu'il nomme, même si la marque change. */
export const objetSansMarque = (objet) => objet.includes(" - ") ? objet.slice(objet.indexOf(" - ") + 3) : objet;

/**
 * Les objets de `<racine>\output\` qui comptent au moins `seuil` versions datées, quel que soit le
 * sous-dossier (famille, `old\`) où elles vivent. Rend [{ objet, versions, derniere }], triés par
 * nombre de versions décroissant. Lecture de répertoire seule — aucun fichier n'est ouvert.
 */
export function documentsMurs(racine, seuil = SEUIL_MUR) {
  const sortie = join(String(racine), "output");
  if (!existsSync(sortie)) return null;
  const parObjet = new Map();
  const parcourir = (d) => {
    let entrees = [];
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (e.isDirectory()) { if (!/^(node_modules|\.git|\.oracles)$/.test(e.name)) parcourir(join(d, e.name)); continue; }
      const m = LIVRABLE_DATE.exec(e.name);
      if (!m) continue;
      const cle = normaliser(m[1]);
      const v = parObjet.get(cle) || { objet: m[1].trim(), versions: 0, derniere: "" };
      v.versions++;
      if (`${m[2]}${m[3]}` > v.derniere) v.derniere = `${m[2]}${m[3]}`;
      parObjet.set(cle, v);
    }
  };
  parcourir(sortie);
  return [...parObjet.values()].filter((v) => v.versions >= seuil).sort((a, b) => b.versions - a.versions);
}

/** Le texte des sections « Documents mûrs » des lots ANTÉRIEURS du même produit, même dossier et `old\`. */
function murDesLotsAnterieurs(cheminLot) {
  const nom = basename(String(cheminLot).split("\\").join("/"));
  const m = NOM_DE_LOT.exec(nom);
  if (!m) return "";
  const [, prefixeBrut, cle] = m;
  const prefixe = prefixeComparable(nom, prefixeBrut);
  const dossier = dirname(resolve(String(cheminLot)));
  let cumul = "";
  for (const d of [dossier, join(dossier, "old")]) {
    if (!existsSync(d)) continue;
    for (const n of readdirSync(d)) {
      const v = NOM_DE_LOT.exec(n);
      if (!v || n === nom || v[1].toLowerCase() !== prefixe.toLowerCase() || v[2] >= cle) continue;
      try { cumul += "\n" + corpsDeSection(readFileSync(join(d, n), "utf8"), SECTION_R57); } catch { /* illisible : ignoré */ }
    }
  }
  return cumul;
}

/**
 * Juge un lot. Rend { verdict, date, constats[] } — chaque constat porte SON REMÈDE.
 *
 * Le remède n'est pas une politesse : un message qui prescrit la moitié du geste conduit tout
 * droit à une seconde violation (leçon TF-0552), et un contrôle dont on ne sait pas quoi faire
 * se contourne au lieu de se corriger (R-33 bis).
 */
/** Le jour LOCAL de l'horloge qui juge, au format du nom d'un lot (AAAAMMJJ). */
export function jourLocal(d = new Date()) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

export function verifier(cheminLot, texteFourni, { aujourdhui = jourLocal() } = {}) {
  const constats = [];
  const ajouter = (regle, statut, message, remede) => constats.push({ regle, statut, message, remede });
  const date = dateDuLot(cheminLot);

  let texte = texteFourni;
  if (texte === undefined) {
    if (!existsSync(cheminLot)) return { verdict: "SKIP", date, constats: [{ regle: "—", statut: "SKIP", message: `lot introuvable : ${cheminLot}`, remede: "vérifier le chemin" }] };
    texte = readFileSync(cheminLot, "utf8");
  }

  if (!date) {
    // Sans date dans le nom, l'antériorité est indécidable. On ne juge pas plutôt que de juger
    // au hasard — et on le DIT, parce qu'un contrôle qui se tait sans le dire est un contrôle
    // absent. Le nommage lui-même est tenu ailleurs (R-4).
    ajouter("—", "SANS_OBJET",
      `le nom « ${basename(String(cheminLot))} » ne porte pas de date AAAAMMJJ — l'antériorité des règles est indécidable, la forme n'est donc pas jugée`,
      "nommer le lot « <projet> - RETOURS - AAAAMMJJ<lettre>.md » (R-4)");
    return { verdict: "SANS_OBJET", date, constats };
  }

  // ---- LOT-DATE · UN LOT N'EST PAS DATÉ D'UN JOUR À VENIR (TF-1358, D-21 (b) du 26/09/2026) --------
  //
  // Le fait, mesuré le 24/09 : un lot nommé « … - RETOURS - 20260925a » avait été écrit le 24/09 à
  // 11:59 à l'horloge de son poste. Cet oracle a rendu « verdict : FAIL (lot du 20260925) » sur R-45 et
  // R-46 seulement : la date elle-même n'était jugée par aucune règle. Or la date du NOM gouverne
  // l'application de R-45, de R-46 et de la classe obligatoire, et l'indice ordonne les lots d'un même
  // jour (R-49, TF-0750) : un lot daté de demain passe devant ceux qu'on écrira demain. La date se
  // compare au jour LOCAL de l'horloge qui juge — celle du poste qui remet, et celle du pilot qui reçoit.
  if (date > aujourdhui) {
    ajouter("LOT-DATE", "FAIL",
      `lot nommé du ${date}, jour À VENIR à l'horloge qui le juge (${aujourdhui}) — la date du nom gouverne R-45, R-46 et la classe obligatoire, et son indice ordonne les lots d'un même jour : daté de demain, il passe devant des lots écrits après lui`,
      `renommer le lot et son sidecar à la date du jour d'écriture, « <projet> - RETOURS - ${aujourdhui}<indice>.md », en prenant le premier indice libre de ce jour`);
  } else ajouter("LOT-DATE", "PASS", `lot du ${date}, pas postérieur au jour qui le juge (${aujourdhui})`, null);

  // Une table NOMMÉE plutôt qu'un tableau positionnel, et le motif est une mesure et non un goût :
  // le premier jet destructurait huit positions dans le mauvais ordre, et le message affiché
  // annonçait une « section » dont le nom était en réalité la SUBSTANCE attendue. Un tableau
  // positionnel se lit juste tant que personne n'y touche, et se relit faux au premier ajout.
  const REGLES = [
    { regle: "R-45", seuil: SEUILS["R-45"], section: SECTION_R45,
      quoi: "Remarques restées au produit",
      present: VERDICT_R45, absent: AUCUNE_R45,
      substance: "verdict de généralisation (« généralisable : oui / non ») par remarque",
      pourquoi: "ce qu'un produit corrige chez lui sans le remonter emporte la CLASSE du défaut avec lui — largeur de lecture, tableaux illisibles au mobile, états vides absents ont tous commencé comme « un défaut de ce livrable-là »",
      rienADire: "aucune remarque n'est restée au produit" },
    { regle: "R-46", seuil: SEUILS["R-46"], section: SECTION_R46,
      quoi: "Retours sur les documents produits",
      present: RATTACHEMENT_R46, absent: AUCUN_R46,
      substance: "rattachement d'un retour à son gabarit (id `gd-…` ou version affichée en en-tête du document) — elle ne rattache aucun retour",
      pourquoi: "ce qu'un document a coûté au gabarit — section manquante, champ non prévu, ajout à la main — est le SEUL canal par lequel la bibliothèque s'améliore",
      rienADire: "aucun document produit depuis un gabarit" },
    { regle: "R-57", seuil: SEUILS["R-57"], section: SECTION_R57,
      quoi: "Documents mûrs",
      present: VERDICT_R57, absent: AUCUN_R57,
      substance: "verdict de remontée (« remonté » ou « reste au produit, parce que… ») par document mûr",
      pourquoi: "un document que son lecteur a jugé réussi, ou que le produit a repris cinq fois, reste sinon invisible aux autres projets — sa FORME monte à la bibliothèque (famille ou composants), jamais sa matière",
      rienADire: "aucun document mûr" },
  ];
  for (const { regle, seuil, section, quoi, present, absent, substance, pourquoi, rienADire } of REGLES) {
    if (date < seuil) {
      ajouter(regle, "SANS_OBJET",
        `lot du ${date}, antérieur à l'entrée en vigueur de ${regle} (${seuil}) — antériorité déclarée, jamais un défaut de produit`,
        null);
      continue;
    }
    if (!section.test(texte)) {
      ajouter(regle, "FAIL",
        `section « ${quoi} » absente — ${pourquoi}`,
        `ajouter la section « ## ${quoi} » au lot. Rien à y mettre ? L'écrire : « ${rienADire} ». La forme se déclare, elle ne se devine pas (loi n° 3). Gabarit : ${GABARIT_LOT}`);
      continue;
    }
    const suite = corpsDeSection(texte, section);
    if (!present.test(suite) && !absent.test(suite)) {
      ajouter(regle, "FAIL",
        `la section « ${quoi} » ne porte ni ${substance}, ni la déclaration qu'il n'y a rien à dire — une section vide se lit comme un oubli, et l'omission ne vaut pas décision`,
        `porter sous la section ${substance}, ou écrire « ${rienADire} »`);
      continue;
    }
    ajouter(regle, "PASS", `section « ${quoi} » présente et substantielle`, null);
  }

  // ---- LOT-MURS · UN DOCUMENT MÛR MESURÉ NE SE TAIT PAS (R-57, 24/09/2026) --------------------
  //
  // La section R-57 se juge partout ; la MESURE ne se joue que là où l'`output\` réel est à portée :
  // chez le produit, lot posé sous `<racine>\forge\retours\`. Un objet d'au moins SEUIL_MUR versions
  // datées doit être NOMMÉ — par son objet sans la marque — dans la section de ce lot ou d'un lot
  // antérieur du même produit : la déclaration se fait une fois, l'historique des lots la garde.
  if (date >= SEUILS["R-57"]) {
    const dossierLot = dirname(resolve(String(cheminLot)));
    const chezLeProduit = /^retours$/i.test(basename(dossierLot)) && /^forge$/i.test(basename(dirname(dossierLot)));
    const racine = chezLeProduit ? dirname(dirname(dossierLot)) : null;
    const murs = racine ? documentsMurs(racine) : null;
    if (!racine) {
      ajouter("LOT-MURS", "SANS_OBJET",
        "lot hors d'un produit (boîte du pilot, sas, copie) — la mesure des documents mûrs se joue chez le produit, AVANT la remise : la copie pseudonymisée ne se compare plus à son `output\\` réel", null);
    } else if (murs === null) {
      ajouter("LOT-MURS", "SANS_OBJET", `aucun dossier \`output\\\` sous ${racine} — rien à mesurer`, null);
    } else {
      const declare = normaliser(corpsDeSection(texte, SECTION_R57) + "\n" + murDesLotsAnterieurs(cheminLot));
      const tus = murs.filter((d) => !declare.includes(normaliser(objetSansMarque(d.objet))));
      if (tus.length) {
        ajouter("LOT-MURS", "FAIL",
          `${tus.length} document(s) MÛR(S) mesuré(s) (${SEUIL_MUR} versions datées ou plus) que ni ce lot ni un lot antérieur ne nomment : `
          + tus.slice(0, 6).map((d) => `« ${objetSansMarque(d.objet)} » (${d.versions} versions)`).join(", ")
          + (tus.length > 6 ? `, et ${tus.length - 6} autre(s)` : "") + " — un document repris autant de fois porte une forme que la bibliothèque n'a pas, ou une raison de la garder chez soi, et l'une comme l'autre s'écrit",
          "nommer chacun sous « ## Documents mûrs », avec son verdict : « remonté » (sa forme devient une famille de gabarits\\documents\\ ou des composants) ou « reste au produit, parce que… » — une fois suffit, les lots suivants héritent de la déclaration (R-57)");
      } else {
        ajouter("LOT-MURS", "PASS", `${murs.length} document(s) mûr(s) mesuré(s) sous output\\, tous déclarés par ce lot ou un lot antérieur`, null);
      }
    }
  } else {
    ajouter("LOT-MURS", "SANS_OBJET", `lot du ${date}, antérieur à l'entrée en vigueur de R-57 (${SEUILS["R-57"]}) — antériorité déclarée`, null);
  }

  // ---- R-49 · UN LOT REMIS ET INGÉRÉ NE SE RÉÉCRIT JAMAIS (TF-0884, 08/09/2026) --------------
  //
  // Le fait, arrivé le 06/09 et réparé par l'agent qui l'avait commis : un compte rendu a pris
  // l'indice « a » que son mandat nommait, déjà porté par un lot du MÊME produit remis et ingéré
  // le matin même (commit e3031e1). Une écriture ordinaire l'a remplacé, et RIEN ne s'y est
  // opposé — ni le gabarit (qui écrit pourtant « un lot remis ne se modifie JAMAIS »), ni cet
  // oracle (PASS sur l'écrasement), ni la boîte d'entrée, qui ne le voit qu'à l'ouverture
  // suivante. L'histoire du registre aurait divergé du fichier : le registre porte les
  // candidatures du lot d'origine, le disque porte un autre texte, et plus rien ne les rapproche.
  //
  // CE QUI EST JUGÉ : le CHEMIN du sidecar de ce lot figure-t-il déjà dans un événement
  // `ingestion` du registre, sous une empreinte DIFFÉRENTE de celle du sidecar présent ? Si oui,
  // le fichier a été réécrit après sa remise, et le remède est l'indice SUIVANT — jamais une
  // retouche. Empreinte normalisée en LF, comme à l'ingestion (idiome TF-0253/TF-0359) : sans
  // quoi un simple aller-retour git en CRLF passerait pour une réécriture.
  //
  // POURQUOI SANS_OBJET AILLEURS QU'AU PILOT, et ce n'est pas un adoucissement : ce module est
  // aussi la COPIE CONFORME que chaque produit reçoit par l'héritage, et un produit n'a pas le
  // registre du pilot sous la main. Un contrôle qui exigerait une donnée absente crierait chez
  // tout le monde sauf là où il sert. Le registre introuvable est DIT, jamais tu.
  const sidecar = String(cheminLot).replace(/\.md$/i, ".tf.jsonl");
  // `FORGE_REGISTRE` prime — recettes et registres jetables, même idiome que les tables du canal
  // confidentiel (`FORGE_NOMS_INTERDITS`). Sans lui, la recette ne pourrait éprouver cette règle
  // qu'en écrivant dans le registre RÉEL, ce qu'aucune recette n'a le droit de faire.
  const registre = process.env.FORGE_REGISTRE
    || join(dirname(fileURLToPath(import.meta.url)), "..", "todo", "TODO.jsonl");
  if (texteFourni !== undefined) {
    // Jugé sur un texte en mémoire : il n'y a pas de fichier à confronter au registre.
  } else if (!existsSync(registre)) {
    ajouter("R-49", "SANS_OBJET",
      "registre des ingestions hors de portée (copie du module chez un produit) — l'écrasement d'un lot déjà ingéré se juge à la porte du pilot",
      null);
  } else if (!existsSync(sidecar)) {
    ajouter("R-49", "SANS_OBJET", `sidecar « ${basename(sidecar)} » absent — aucune empreinte à confronter aux ingestions`, null);
  } else {
    const empreinteActuelle = createHash("sha256").update(readFileSync(sidecar, "utf8").split("\r\n").join("\n")).digest("hex");
    const cle = basename(sidecar).toLowerCase();
    const ingestions = readFileSync(registre, "utf8").split("\n").filter((l) => l.trim())
      .map((l) => { try { return JSON.parse(l); } catch { return null; } })
      .filter((e) => e && e.ev === "ingestion" && typeof e.fichier === "string"
        && basename(e.fichier.split("\\").join("/")).toLowerCase() === cle);
    if (!ingestions.length) {
      ajouter("R-49", "PASS", `« ${basename(String(cheminLot))} » n'a jamais été ingéré sous ce nom — la remise est une première`, null);
    } else if (ingestions.some((e) => e.lot_sha === empreinteActuelle
      || (e.reempreinte && e.reempreinte.lot_sha_avant === empreinteActuelle))) {
      ajouter("R-49", "PASS", `« ${basename(String(cheminLot))} » est ingéré, et son sidecar porte encore l'empreinte consignée — le lot n'a pas été réécrit`, null);
    } else {
      ajouter("R-49", "FAIL",
        `« ${basename(String(cheminLot))} » a DÉJÀ été ingéré (empreinte consignée ${String(ingestions[ingestions.length - 1].lot_sha).slice(0, 12)}, le ${String(ingestions[ingestions.length - 1].ts || "?").slice(0, 10)}) et son sidecar en porte une AUTRE (${empreinteActuelle.slice(0, 12)}) — `
        + "un lot remis ne se modifie JAMAIS : le registre porte les candidatures du texte d'origine, et son histoire vient de diverger du fichier",
        `restaurer le lot d'origine (\`git checkout HEAD -- "${cheminLot}" "${sidecar}"\`) et remettre le nouveau texte sous l'INDICE SUIVANT — \`node scripts\\allouer-indice.mjs\` le donne`);
    }
  }

  // ---- LOT-SAS · UN LOT NE SE DÉPOSE JAMAIS À LA RACINE DE LA BOÎTE SOUS UN NOM RÉEL (TF-1054) --
  //
  // Le fait, mesuré le 11/09 : le sas `input\00-retours\_arrivee\` (ignoré par git, TF-0981)
  // existait depuis trois jours, et DEUX lots portant un nom réel de client étaient posés à la
  // racine SUIVIE de la boîte — indexables, un `git add -A` les emportait. Le gabarit qui voyage
  // jusqu'au producteur nommait encore la racine comme destination.
  //
  // CE QUI EST JUGÉ : un lot posé DIRECTEMENT dans `00-retours\` dont le NOM change sous le juge
  // d'`accueillir-lot` — il n'a donc pas pu arriver par le sas, qui l'aurait pseudonymisé. Un lot
  // au nom déjà pseudonymisé à la racine est la sortie normale du sas, pas un défaut. Le contenu
  // n'est pas jugé ici : l'anonymiseur laisse à dessein en place une occurrence collée à un
  // identifiant (TF-0927), et refuser ces lots fermerait la porte à des lots accueillis.
  const dossierDuLot = basename(dirname(resolve(String(cheminLot))));
  const nomDuLot = basename(String(cheminLot).split("\\").join("/"));
  if (/^_arrivee$/i.test(dossierDuLot)) {
    ajouter("LOT-SAS", "PASS", "lot déposé au sas d'arrivée — `node todo\\accueillir-lot.mjs` le pseudonymise avant qu'il ne devienne indexable", null);
  } else if (!/^00-retours$/i.test(dossierDuLot)) {
    ajouter("LOT-SAS", "SANS_OBJET", "lot hors de la boîte d'entrée du pilot — sa destination se juge quand il y est copié", null);
  } else if (!anonymiserPilot) {
    ajouter("LOT-SAS", "SANS_OBJET", "juge des noms hors de portée (copie héritée du module) — la destination se juge à la porte du pilot", null);
  } else {
    let juge = null;
    try { juge = anonymiserPilot(nomDuLot); } catch (e) {
      ajouter("LOT-SAS", "SANS_OBJET", `tables de pseudonymisation introuvables — le nom n'est pas jugé, et c'est dit (${String(e.message).slice(0, 80)})`, null);
    }
    if (juge && juge.texte !== nomDuLot) {
      ajouter("LOT-SAS", "FAIL",
        `« ${nomDuLot} » est posé à la RACINE suivie de la boîte sous un nom réel — il n'est pas passé par le sas, et un \`git add -A\` l'emporte dans l'histoire`,
        "déplacer le lot ET son sidecar dans `input\\00-retours\\_arrivee\\` (ignoré par git), puis jouer `node todo\\accueillir-lot.mjs` : il pseudonymise le nom et le contenu et redépose le lot à la racine");
    } else if (juge) {
      ajouter("LOT-SAS", "PASS", `« ${nomDuLot} » porte un nom déjà pseudonymisé — sortie normale du sas`, null);
    }
  }

  // ---- LOT-IDS · UN IDENTIFIANT DE RETOUR N'EST JAMAIS REPRIS (TF-1039) ----------------------
  if (date < SEUIL_IDS) {
    ajouter("LOT-IDS", "SANS_OBJET", `lot du ${date}, antérieur à l'entrée en vigueur de LOT-IDS (${SEUIL_IDS}) — antériorité déclarée`, null);
  } else {
    const r = idsEnDouble(cheminLot, texte);
    if (!r) {
      ajouter("LOT-IDS", "SANS_OBJET", "le nom n'est pas celui d'un lot (« <projet> - RETOURS - AAAAMMJJ<lettre>.md ») — les voisins ne se trouvent pas", null);
    } else if (r.doublons.length) {
      ajouter("LOT-IDS", "FAIL",
        `${r.doublons.length} identifiant(s) déjà défini(s) par un lot antérieur du même produit : ${r.doublons.map((d) => `${d.id} (${d.lot})`).join(", ")} — deux retours différents porteraient la même référence au registre`,
        `renuméroter à partir du premier libre : ${Object.values(r.premierLibre).join(", ")} — un numéro n'est jamais réutilisé, la séquence continue celle des lots précédents`);
    } else {
      ajouter("LOT-IDS", "PASS", `aucun identifiant repris des ${r.voisins} lot(s) antérieur(s) du même produit`, null);
    }
  }

  return { verdict: constats.some((c) => c.statut === "FAIL") ? "FAIL" : "PASS", date, constats };
}

// ---- CLI : le geste qui précède la remise ----------------------------------------------------
// C'est CE geste que le gabarit de retours nomme. Il coûte une seconde au produit et lui évite
// un refus à la porte du pilot — ou, pire, une dérogation qui lui épargne le refus ET la leçon.
if (import.meta.url === `file://${process.argv[1]?.split("\\").join("/")}`
    || import.meta.url.endsWith(encodeURI(String(process.argv[1] || "").split("\\").join("/")))) {
  const args = process.argv.slice(2);
  const cible = args.find((a) => !a.startsWith("--"));
  const jsonSeul = args.includes("--json");
  if (args.includes("--murs")) {
    // R-57 : ce que le lot devra déclarer, mesuré AVANT de l'écrire.
    const racine = cible || ".";
    const murs = documentsMurs(racine);
    if (murs === null) { console.error(`aucun dossier output\\ sous ${racine}`); process.exit(2); }
    console.log(`documents mûrs mesurés sous ${racine}\\output\\ (${SEUIL_MUR} versions datées ou plus) : ${murs.length}`);
    for (const d of murs) console.log(`  ${String(d.versions).padStart(3)} versions · dernière ${d.derniere} · ${objetSansMarque(d.objet)}`);
    process.exit(0);
  }
  if (!cible) {
    console.error("usage : node oracle-lot-retours.mjs <lot.md> [--json]");
    process.exit(2);
  }
  const r = verifier(cible);
  if (jsonSeul) {
    process.stdout.write(JSON.stringify({ oracle: "oracle-lot-retours", version: VERSION, cible, ...r }, null, 1) + "\n");
  } else {
    console.log(`oracle-lot-retours ${VERSION} — ${cible}`);
    console.log(`verdict : ${r.verdict}${r.date ? ` (lot du ${r.date})` : ""}`);
    for (const c of r.constats) {
      console.log(`  [${c.statut}] ${c.regle} — ${c.message}`);
      if (c.remede) console.log(`      → ${c.remede}`);
    }
    if (r.verdict === "FAIL") console.log("\nCe lot serait REFUSÉ à l'ingestion. Le corriger ici coûte une minute ;\nle faire refuser à la porte coûte un aller-retour, et une dérogation coûte la leçon.");
  }
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}
