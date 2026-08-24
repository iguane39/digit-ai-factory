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
 * ANTÉRIORITÉ DÉCLARÉE : R-45 ne juge que les lots datés du 21/08 ou après, R-46 du 22/08 ou
 * après. La date se lit dans le NOM du fichier (`… - AAAAMMJJ<lettre>.md`), jamais sur le
 * disque : une copie change la date de fichier, pas la date du lot.
 *
 * Usage :
 *   node oracle-lot-retours.mjs <lot.md> [--json]
 * Exit : 0 = forme tenue (ou lot antérieur aux règles) · 1 = forme en défaut · 2 = lot illisible.
 */
import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";

export const VERSION = "1.0.0";

/** R-45 depuis le 21/08/2026, R-46 depuis le 22/08 — antériorité déclarée, jamais devinée. */
export const SEUILS = { "R-45": "20260821", "R-46": "20260822" };

const SECTION_R45 = /^##\s+Remarques\s+rest[ée]es?\s+au\s+produit\s*$/im;
const SECTION_R46 = /^##\s+Retours\s+sur\s+les\s+documents\s+produits\s*$/im;
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

/** Le corps d'une section, jusqu'au prochain titre de niveau 2. */
const corpsDeSection = (texte, re) => (texte.split(re)[1] || "").split(/^## /m)[0] || "";

/**
 * Juge un lot. Rend { verdict, date, constats[] } — chaque constat porte SON REMÈDE.
 *
 * Le remède n'est pas une politesse : un message qui prescrit la moitié du geste conduit tout
 * droit à une seconde violation (leçon TF-0552), et un contrôle dont on ne sait pas quoi faire
 * se contourne au lieu de se corriger (R-33 bis).
 */
export function verifier(cheminLot, texteFourni) {
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
        `ajouter la section « ## ${quoi} » au lot. Rien à y mettre ? L'écrire : « ${rienADire} ». La forme se déclare, elle ne se devine pas (loi n° 3). Gabarit : forge\\retours\\RETOURS-FORGES.md`);
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
