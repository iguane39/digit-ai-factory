#!/usr/bin/env node
/**
 * relever-heritage.mjs — l'état de l'héritage chez TOUS les produits du parc, sans rien y écrire.
 *
 * ============================================================================================
 * POURQUOI (TF-0626, décision humaine du 25/08/2026 — « mesurer d'abord, décider ensuite »)
 * ============================================================================================
 *
 * LE FAIT QUI L'A FAIT NAÎTRE. En corrigeant le résolveur de produits (TF-0623), la localisation
 * a cessé d'être aveugle — et la première mesure possible a rendu, pour deux produits, SIX et SEPT
 * artefacts d'héritage absents sur huit. Parmi les absents : le gabarit de restitution et le hook
 * qui la juge. Un produit qui ne les a pas rend ses travaux hors du format prescrit SANS QU'AUCUN
 * CONTRÔLE NE LE REFUSE.
 *
 * CE QUI REND LE RELEVÉ NÉCESSAIRE PLUTÔT QU'UNE SUITE DE GESTES. R-47 existe, elle est câblée à
 * l'ingestion, sa recette est verte — et elle rendait « non vérifié » sur les cibles qu'elle ne
 * savait pas trouver. Le parc croyait donc avoir un juge de conformité là où il n'en avait pas, et
 * personne ne pouvait le savoir. Avant de décider quoi recopier et où, il faut un état DATÉ,
 * exhaustif sur ce qui est localisable, et opposable.
 *
 * ============================================================================================
 * CE QU'IL FAIT, ET SURTOUT CE QU'IL NE FAIT PAS
 * ============================================================================================
 *
 * IL N'ÉCRIT RIEN CHEZ AUCUN PRODUIT. Pas un fichier, pas une ligne, pas un `.gitignore`. Il lit
 * des noms de fichiers et vérifie des existences. La recopie est un geste HUMAIN, produit par
 * produit (N-5 : seuls les produits se modifient eux-mêmes), et un relevé qui se mettrait à
 * réparer serait exactement le geste qu'aucun contrôle ne pourrait annuler.
 *
 * IL NE LIT AUCUN CONTENU, sauf pour les artefacts en `copie_conforme` dont il compare
 * l'EMPREINTE à celle de la source — c'est la seule façon de distinguer « présent » de « présent
 * et à jour », et cette distinction est le cœur du sujet : un produit qui porte une COPIE PÉRIMÉE
 * du gabarit est plus dangereux qu'un produit qui n'en a pas, parce qu'il croit être conforme.
 * L'empreinte est calculée sur les lignes normalisées (`lib-empreinte`), donc insensible aux fins
 * de ligne — sans quoi tout le parc paraîtrait divergent sous Windows.
 *
 * IL DÉCLARE CE QU'IL NE VOIT PAS. Un produit rangé au-delà de la profondeur bornée n'est pas
 * relevé, et le relevé le DIT plutôt que de laisser croire à l'exhaustivité.
 *
 * Usage : node scripts\relever-heritage.mjs [--md <fichier>] [--json]
 */
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { empreinteFichier } from "./lib-empreinte.mjs";
import { PROFONDEUR_MAX, SAUTES } from "../todo/localiser-produit.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);
const racine = process.env.FORGE_ROOT || join(PILOT, "..");

/** Les dépôts du pilot et des forges ne sont pas des produits : ils ne reçoivent pas l'héritage. */
const PAS_UN_PRODUIT = /^(digit-ai|_archive-)/i;

const enfants = (d) => {
  try { return readdirSync(d, { withFileTypes: true }).filter((x) => x.isDirectory()); }
  catch { return []; }
};

/**
 * Tous les produits du parc, reconnus à leur `forge\` — le marqueur qu'un run de forge a eu lieu.
 * On ne descend pas SOUS un produit : ses sous-dossiers ne sont pas des produits.
 */
export function produitsDuParc(base, profondeurMax = PROFONDEUR_MAX) {
  const trouves = [];
  const descendre = (d, niveau) => {
    if (niveau > profondeurMax) return;
    for (const e of enfants(d)) {
      if (SAUTES.has(e.name)) continue;
      const c = join(d, e.name);
      if (niveau === 1 && PAS_UN_PRODUIT.test(e.name)) continue;
      if (existsSync(join(c, "forge"))) { trouves.push(c); continue; }
      descendre(c, niveau + 1);
    }
  };
  descendre(base, 1);
  return trouves;
}

/** L'état d'UN artefact chez UN produit : absent, présent-divergent, ou conforme. */
export function etatArtefact(dossierProduit, artefact, racinePilot) {
  const cible = join(dossierProduit, String(artefact.cible).replaceAll("/", "\\"));
  if (!existsSync(cible)) return { etat: "absent" };
  if (artefact.mode !== "copie_conforme") return { etat: "present" };
  const source = join(racinePilot, String(artefact.source).replaceAll("/", "\\"));
  if (!existsSync(source)) return { etat: "present", note: "source introuvable au pilot — non comparable" };
  const a = empreinteFichier(source, 12);
  const b = empreinteFichier(cible, 12);
  // LES EMPREINTES NE S'APPELLENT PLUS `source` ET `produit` (TF-0645, 26/08). Le contrat
  // `HERITAGE.json` donne a `source` un sens PRECIS : le CHEMIN de l'artefact chez le pilot.
  // Ce retour l'ecrasait par une EMPREINTE, et le releve perdait le chemin en route — si bien
  // que `emettre-travaux.mjs` le REFABRIQUAIT par chirurgie de chaine sur la cible, avec deux
  // cas particuliers rustines a la main. Un champ qui porte deux sens dans deux fichiers voisins
  // ne se documente pas : il se renomme.
  return a === b ? { etat: "conforme", empreinte: a } : { etat: "divergent", empreinte_pilot: a, empreinte_produit: b };
}

export function relever(base, contrat, racinePilot) {
  return produitsDuParc(base).map((dossier) => {
    const artefacts = contrat.artefacts.map((a) => ({
      // `source` est PORTE jusqu'ici, tel que le contrat l'ecrit : c'est le chemin que le
      // consommateur doit citer, et le deduire de la cible est faux des que les deux ne se
      // repondent pas (TF-0645).
      cible: a.cible, source: a.source, mode: a.mode, ...etatArtefact(dossier, a, racinePilot),
    }));
    const compte = (e) => artefacts.filter((x) => x.etat === e).length;
    return {
      produit: relative(base, dossier).replaceAll("\\", "/"),
      dossier,
      absents: compte("absent"),
      divergents: compte("divergent"),
      conformes: compte("conforme") + compte("present"),
      total: artefacts.length,
      artefacts,
    };
  }).sort((x, y) => (y.absents + y.divergents) - (x.absents + x.divergents));
}

// ---- exécution ------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const contrat = JSON.parse(readFileSync(join(PILOT, "gabarits", "HERITAGE.json"), "utf8"));
  const lignes = relever(racine, contrat, PILOT);
  const totalManques = lignes.reduce((n, l) => n + l.absents + l.divergents, 0);

  if (args.includes("--json")) {
    console.log(JSON.stringify({ outil: "relever-heritage", racine: String(racine),
      contrat: contrat.version, produits: lignes.length, manques: totalManques, lignes }, null, 1));
  } else {
    for (const l of lignes) {
      const drapeau = l.absents + l.divergents === 0 ? "CONFORME" : `${l.absents} absent(s)`
        + (l.divergents ? `, ${l.divergents} DIVERGENT(s)` : "");
      console.log(`${l.produit.padEnd(50)} ${drapeau}`);
    }
    console.log(`\n${lignes.length} produit(s) relevé(s), ${totalManques} manque(s) au total — contrat v${contrat.version}`);
    console.log(`NON RELEVÉ : tout produit rangé au-delà de ${PROFONDEUR_MAX} niveaux sous ${racine}, ` +
      "et tout produit absent de ce poste. Aucune écriture n'a été faite chez aucun produit.");
  }

  const iMd = args.indexOf("--md");
  if (iMd >= 0 && args[iMd + 1]) {
    writeFileSync(args[iMd + 1], rendreMarkdown(lignes, contrat, racine, totalManques), "utf8");
    console.log(`\nrelevé écrit : ${args[iMd + 1]}`);
  }
}

export function rendreMarkdown(lignes, contrat, base, totalManques) {
  const t = [];
  t.push("| Produit | Absents | Divergents | Conformes | Ce qui manque |");
  t.push("|---|---|---|---|---|");
  for (const l of lignes) {
    const manque = l.artefacts.filter((a) => a.etat === "absent").map((a) => a.cible);
    const diverge = l.artefacts.filter((a) => a.etat === "divergent").map((a) => `${a.cible} (PÉRIMÉ)`);
    t.push(`| \`${l.produit}\` | ${l.absents} | ${l.divergents} | ${l.conformes}/${l.total} | `
      + `${[...diverge, ...manque].join(" · ") || "—"} |`);
  }
  return t.join("\n") + `\n\n${lignes.length} produits relevés · ${totalManques} manques · contrat v${contrat.version}`
    + `\n\nNON RELEVÉ : tout produit rangé au-delà de ${PROFONDEUR_MAX} niveaux sous \`${base}\`, et tout`
    + " produit absent de ce poste. Aucune écriture n'a été faite chez aucun produit.\n";
}
