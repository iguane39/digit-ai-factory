#!/usr/bin/env node
/**
 * rapprocher.mjs — un item entrant RESSEMBLE-T-IL à quelque chose que le registre a déjà clos ?
 *
 * ============================================================================================
 * POURQUOI (TF-0618, constat du pilot du 25/08/2026)
 * ============================================================================================
 *
 * LE FAIT. Le lot `Produit-11 - RETOURS - 20260825a` a signalé qu'une redirection vers le
 * puits de sortie, jouée sous un shell Windows, ÉCRIT un fichier nommé `null` à la racine du parc.
 * Le constat est exact et l'analyse est juste. Mais il était DÉJÀ au registre sous TF-0598 : créé
 * le 24/08 à 16h40, décidé à 17h35, CORRIGÉ à 18h48 — le balayage vivait dans `bootstrap.mjs`
 * depuis la veille du signalement, avec sa recette à double sens. Le lot a donc produit TF-0614,
 * un doublon strict, qui a consommé une lecture, un rangement et une DÉCISION HUMAINE pour un
 * travail déjà livré.
 *
 * LA CAUSE N'EST PAS L'INATTENTION DU PRODUIT, et c'est ce qui rend la classe générique : il n'a
 * AUCUN MOYEN de savoir ce que le registre du pilot contient. `TODO-PRODUIT.md` porte les items qui
 * LE concernent, pas ceux que le pilot a corrigés chez lui. Un produit a donc raison de remonter ce
 * qu'il observe ; c'est le pilot qui ne relisait pas un lot entrant contre son propre registre.
 *
 * ============================================================================================
 * CE QU'IL FAIT, ET SURTOUT CE QU'IL NE FAIT PAS
 * ============================================================================================
 *
 * IL SIGNALE, IL NE BLOQUE JAMAIS. Un rapprochement lexical se trompe ; le faire bloquer ferait
 * refuser un lot légitime, et un contrôle qui refuse à tort se fait désactiver (R-33 bis). Le juge
 * reste humain : il lit « cet item ressemble à TF-0598, corrigé le 24/08 » AVANT de décider, au
 * lieu de le découvrir après.
 *
 * LE SEUIL VIENT DE LA MESURE, PAS DE L'INTUITION (N-23). Un registre de 155 items partage
 * énormément de vocabulaire avec lui-même : « oracle », « contrôle », « recette », « double sens »,
 * « mesure » reviennent partout. Un rapprochement naïf sur les mots pleins rapproche donc tout de
 * tout. Deux décisions en découlent, et les deux sortent du corpus réel :
 *
 *   1. LES TERMES TROP FRÉQUENTS SONT ÉCARTÉS AUTOMATIQUEMENT, par leur fréquence documentaire
 *      mesurée sur le registre lui-même — pas par une liste d'arrêt écrite à la main, qui se périme
 *      et qui oblige à devenir l'auteur de ce qu'on refuse de voir. Un terme présent dans plus
 *      d'un item sur cinq ne discrimine rien : il est ignoré.
 *   2. DEUX CONDITIONS CUMULÉES, jamais une seule : un score de recouvrement ET un nombre absolu
 *      de termes rares partagés. Le score seul rapproche deux items COURTS qui partagent deux mots ;
 *      le compte seul rapproche deux items LONGS partageant du vocabulaire de métier. La seconde ne
 *      mord pas sur le corpus actuel — tous les items y sont longs — et c'est DÉCLARÉ à sa constante
 *      plutôt que caché, avec la fixture qui la prouve vivante.
 *
 * CE QUI N'EST PAS JUGÉ. La ressemblance lexicale n'est pas l'identité : deux items peuvent parler
 * du même défaut avec d'autres mots (le rapprochement les rate), ou du même vocabulaire pour des
 * défauts différents (il les rapproche à tort). C'est pourquoi il signale et ne conclut pas — il
 * rend une PISTE de lecture, pas un verdict.
 *
 * Usage : node todo\rapprocher.mjs --mesure   (joue sur le registre réel et rend la précision)
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

/** Les statuts qui rendent un rapprochement UTILE : un travail déjà tranché. */
export const STATUTS_CLOS = new Set(["corrige", "ecarte"]);

/** Un terme présent dans plus de cette part des items ne discrimine rien. Mesuré, pas deviné. */
export const PART_MAX_DOCUMENTAIRE = 0.2;

/**
 * LES DEUX CONDITIONS, ET D'OÙ VIENNENT LEURS VALEURS. Balayage joué sur les 154 items du registre
 * réel, chacun rejoué COMME S'IL ENTRAIT contre les autres, avec DEUX vrais positifs connus pour
 * étalon — TF-0614/TF-0598 (le doublon fondateur) et TF-0609/TF-0587, découvert par ce balayage :
 *
 *     seuil 0.14 → 20 items signalés sur 154, les deux étalons trouvés
 *     seuil 0.16 →  9 items signalés sur 154, les deux étalons trouvés     ← retenu
 *     seuil 0.18 →  3 items signalés sur 154, LE DOUBLON FONDATEUR PERDU (il vaut 0.165)
 *
 * 0.16 est donc le point où le bruit tombe de plus de la moitié sans perdre l'étalon. Et les 9
 * restants ont été LUS, pas comptés : 4 sont les deux étalons (chaque paire est signalée des deux
 * côtés), les 5 autres forment 3 paires du MÊME ÉPISODE — deux artefacts d'un même run de delivery,
 * deux faces d'une bascule de domaine, deux dépôts d'un même ménage de parc. Ce ne sont pas des
 * doublons, et ce n'est pas du bruit non plus : c'est du contexte utile. D'où le libellé, qui dit
 * « ressemble à » et JAMAIS « doublon » — affirmer le doublon serait faux 3 fois sur 5.
 *
 * LA SECONDE CONDITION NE MORD PAS SUR CE CORPUS, et c'est écrit plutôt que caché : les items du
 * registre sont longs, donc tout recouvrement de 0.16 implique déjà beaucoup de termes partagés —
 * testée jusqu'à 15, elle ne retire aucun constat. Elle garde un cas que le corpus ne contient pas
 * ENCORE : deux items COURTS qui partagent deux mots atteignent 0.25 sans rien dire. Une clause
 * qu'aucun cas ne joue est une clause morte ; celle-ci est donc prouvée par une FIXTURE construite
 * exprès (`rapprocher.test.mjs`, cas « court contre court »), et sa limite est déclarée ici.
 */
export const SEUIL_RECOUVREMENT = 0.16;
export const RARES_PARTAGES_MIN = 4;

/**
 * Les termes d'un texte. Aucune liste d'arrêt écrite à la main : la fréquence documentaire s'en
 * charge, et une liste qu'on écrit soi-même est une liste dont on devient l'angle mort.
 */
export function termes(texte) {
  return new Set(
    String(texte || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 5),
  );
}

/** Le texte d'un item, tel qu'un rapprochement doit le lire : son titre et son constat. */
export const texteDe = (e) => `${e.titre || ""} ${e.contenu || ""}`;

/**
 * L'état COURANT de chaque item du registre : dernier statut connu, et le texte de sa création.
 * Un registre en ajout seul porte plusieurs évènements par item ; rapprocher sur les évènements
 * ferait compter un item autant de fois qu'il a bougé.
 */
export function itemsDuRegistre(evenements) {
  const par = new Map();
  for (const e of evenements) {
    if (!e.id) continue;
    const vu = par.get(e.id) || { id: e.id, titre: "", contenu: "", statut: null, date: null };
    if (e.ev === "creation") { vu.titre = e.titre || ""; vu.contenu = e.contenu || ""; }
    if (e.statut) vu.statut = e.statut;
    if (e.date_correction || e.date_decision) vu.date = e.date_correction || e.date_decision;
    par.set(e.id, vu);
  }
  return [...par.values()];
}

/** La fréquence documentaire de chaque terme, sur le corpus donné. */
export function frequences(items) {
  const df = new Map();
  for (const it of items) {
    for (const t of termes(texteDe(it))) df.set(t, (df.get(t) || 0) + 1);
  }
  return df;
}

/**
 * Les rapprochements d'un texte entrant contre les items CLOS, du plus probable au moins probable.
 * Rien n'est bloqué, rien n'est conclu : chaque ligne est une piste de lecture, avec de quoi la
 * vérifier — l'identifiant, le statut, la date, et les termes rares qui ont motivé le rapprochement.
 */
export function rapprochements(texteEntrant, items, { df = null, seuil = SEUIL_RECOUVREMENT,
  rares = RARES_PARTAGES_MIN, partMax = PART_MAX_DOCUMENTAIRE } = {}) {
  const documentaire = df || frequences(items);
  const plafond = Math.max(2, Math.floor(items.length * partMax));
  const discriminant = (t) => (documentaire.get(t) || 0) <= plafond;

  const entrant = new Set([...termes(texteEntrant)].filter(discriminant));
  if (!entrant.size) return [];

  const sortie = [];
  for (const it of items) {
    if (!STATUTS_CLOS.has(it.statut)) continue;
    const cible = new Set([...termes(texteDe(it))].filter(discriminant));
    if (!cible.size) continue;
    const communs = [...entrant].filter((t) => cible.has(t));
    // Jaccard sur les termes DISCRIMINANTS seulement : le recouvrement d'un vocabulaire de métier
    // partagé par tout le registre gonflerait le score sans rien dire.
    const score = communs.length / (entrant.size + cible.size - communs.length);
    if (score >= seuil && communs.length >= rares) {
      sortie.push({ id: it.id, statut: it.statut, date: it.date,
        titre: String(it.titre).slice(0, 110),
        score: Math.round(score * 1000) / 1000, communs: communs.sort().slice(0, 12) });
    }
  }
  return sortie.sort((a, b) => b.score - a.score);
}

// ---- mesure sur le corpus RÉEL : ce qu'il attrape à TORT se lit AVANT le reste (N-23) --------
if (process.argv.includes("--mesure")) {
  const registre = join(ICI, "TODO.jsonl");
  if (!existsSync(registre)) { console.error("registre introuvable"); process.exit(2); }
  const evenements = readFileSync(registre, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
  const items = itemsDuRegistre(evenements);
  const df = frequences(items);
  const seuil = Number(process.argv[process.argv.indexOf("--seuil") + 1]) || SEUIL_RECOUVREMENT;
  const rares = Number(process.argv[process.argv.indexOf("--rares") + 1]) || RARES_PARTAGES_MIN;

  // Le protocole : chaque item du registre est rejoué COMME S'IL ENTRAIT, contre les items clos
  // autres que lui. Le seul VRAI positif connu est TF-0614 → TF-0598. Tout le reste est du bruit
  // à lire, et le lire est le travail — pas le compter.
  let avecConstat = 0; const lignes = [];
  for (const it of items) {
    const autres = items.filter((x) => x.id !== it.id);
    const r = rapprochements(texteDe(it), autres, { df, seuil, rares });
    if (r.length) {
      avecConstat += 1;
      lignes.push(`${it.id} (${it.statut}) → ${r.slice(0, 3).map((x) => `${x.id}@${x.score}`).join(", ")}`
        + `  ::  ${String(it.titre).slice(0, 70)}`);
    }
  }
  const cible = rapprochements(texteDe(items.find((x) => x.id === "TF-0614") || {}), items.filter((x) => x.id !== "TF-0614"), { df, seuil, rares });
  console.log(lignes.join("\n"));
  console.log(`\n--- seuil ${seuil} · rares ${rares} · plafond documentaire ${Math.max(2, Math.floor(items.length * PART_MAX_DOCUMENTAIRE))} sur ${items.length} items`);
  console.log(`items rendant au moins un rapprochement : ${avecConstat} / ${items.length}`);
  console.log(`LE VRAI POSITIF CONNU (TF-0614 → TF-0598) : ${cible.some((x) => x.id === "TF-0598") ? "TROUVÉ, rang " + (cible.findIndex((x) => x.id === "TF-0598") + 1) : "MANQUÉ"}`);
}
