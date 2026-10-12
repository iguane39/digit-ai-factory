#!/usr/bin/env node
/**
 * oracle-ecart-normal.mjs — UN ÉTAT QUI CONTREDIT LE RÉSULTAT DÉCRIT PAR LE COMMANDITAIRE NE SE
 * PRÉSENTE PAS COMME NORMAL, ATTENDU OU VOULU (TF-1511, lot Produit-03 20261001a, RA-57).
 *
 * LE FAIT PAYÉ. Le 29/09/2026 le commanditaire décrit son résultat : à la première visite, il remplira
 * le formulaire d'approbation. Le 30/09 la procédure de l'exploitant écrit de l'erreur AADSTS700038 :
 * « c'est normal à ce stade », et la restitution 20260930f titre l'erreur « état voulu ». Les faits
 * étaient justes, le cadrage faux : l'erreur était l'écart à fermer. Coût : 2 allers-retours humains.
 *
 * CE QUI EST JUGÉ (E1). Une même phrase qui porte à la fois un mot de normalité (normal, attendu, voulu,
 * prévu, habituel) et un code d'erreur (AADSTS<n>, HTTP 4xx/5xx, « erreur 4xx/5xx », ERR_*). Une phrase
 * qui nie la normalité (« n'est pas normal », « écart », « inattendu ») est admise : elle dit ce que la
 * règle demande.
 *
 * CE QUI N'EST PAS JUGÉ (NON_JUGE). Le sens : un « normal » à côté d'un code peut être juste (une 404
 * attendue d'un test de robustesse). La règle ne sait pas distinguer ; elle SIGNALE, un humain tranche.
 * Elle n'attrape pas un état présenté comme normal sans code d'erreur, ni sur deux phrases.
 *
 * STATUT. AVERTISSANT : mesurée sur le corpus avant de mordre (décision (a) de TF-1511). Le bruit mesuré
 * est dit au rapport de campagne ; elle n'est pas câblée dans `oracle-synthese.mjs`. `--corpus <dossiers>`
 * rend les phrases signalées ; `--strict` rend exit 1 si au moins une l'est.
 *
 * Usage : node oracle-ecart-normal.mjs <fichier|dossier>... [--strict] [--json]
 * Exit  : 0 = rien de signalé, ou mode avertissant · 1 = signalé en --strict · 2 = chemin illisible.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

export const VERSION = "1.0.0";
export const NON_JUGE = [
  "le sens d'un « normal » à côté d'un code d'erreur : il peut être juste, un humain tranche",
  "un état présenté comme normal sans code d'erreur, ou sur deux phrases",
];

export const MOT_NORMALITE = /\b(?:c['’]est normal|est normale?|sont normale?s|normal(?:e|ement)?|attendue?s?|voulue?s?|prévue?s?|habituelle?s?|comportement nominal)\b/i;
export const CODE_ERREUR = /\bAADSTS\d+\b|\bHTTP\s*[45]\d\d\b|\berreurs?\s*[45]\d\d\b|\b(?:code|statut|status)\s*[45]\d\d\b|\bERR_[A-Z_]{3,}\b|\b[45]\d\d\s+(?:Not Found|Forbidden|Unauthorized|Bad Request|Internal Server Error)\b/i;
//: Une phrase qui nie la normalité dit déjà l'écart.
export const NEGATION = /\b(?:n['’]est (?:pas|plus) (?:normale?|attendue?|voulue?|prévue?)|pas normale?|anormale?|inattendue?s?|non voulue?|n['’]est pas le résultat|écart|à fermer|à corriger)\b/i;

export function phrasesSignalees(texte) {
  const sortie = [];
  const lignes = String(texte).replace(/\r\n/g, "\n").split("\n");
  lignes.forEach((ligne, i) => {
    // Une ligne de tableau se découpe par cellule, une prose par phrase.
    const morceaux = ligne.split(/(?<=[.!?…;])\s+|\s\|\s/);
    for (const m of morceaux) {
      if (MOT_NORMALITE.test(m) && CODE_ERREUR.test(m) && !NEGATION.test(m)) {
        sortie.push({ ligne: i + 1, phrase: m.trim().slice(0, 240) });
      }
    }
  });
  return sortie;
}

function fichiersDe(chemin, acc = []) {
  const s = statSync(chemin);
  if (s.isFile()) { if (/\.(md|html?|txt)$/i.test(chemin)) acc.push(chemin); return acc; }
  for (const f of readdirSync(chemin)) {
    if (f === "node_modules" || f === ".git") continue;
    fichiersDe(join(chemin, f), acc);
  }
  return acc;
}

export function verifierCorpus(chemins) {
  const fichiers = chemins.flatMap((c) => fichiersDe(c));
  const signales = [];
  for (const f of fichiers) {
    for (const p of phrasesSignalees(readFileSync(f, "utf8"))) signales.push({ fichier: f, ...p });
  }
  return { version: VERSION, fichiers: fichiers.length, signales, non_juge: NON_JUGE };
}

const lanceEnDirect = process.argv[1] && process.argv[1].replaceAll("\\", "/").endsWith("oracle-ecart-normal.mjs");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const cibles = args.filter((a) => !a.startsWith("--"));
  if (!cibles.length || cibles.some((c) => !existsSync(c))) {
    console.error("usage : node oracle-ecart-normal.mjs <fichier|dossier>... [--strict] [--json]");
    process.exit(2);
  }
  const r = verifierCorpus(cibles);
  if (args.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else {
    console.log(`oracle-ecart-normal ${VERSION} — ${r.fichiers} fichier(s) jugé(s), ${r.signales.length} phrase(s) signalée(s)`);
    for (const s of r.signales) console.log(`  [SIGNALE] ${s.fichier}:${s.ligne} — ${s.phrase}`);
    if (r.signales.length) console.log("Un état qui contredit le résultat décrit par le commanditaire se dit comme un écart à fermer, avec ce qui le fermera.");
  }
  process.exit(args.includes("--strict") && r.signales.length ? 1 : 0);
}
