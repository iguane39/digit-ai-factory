#!/usr/bin/env node
/**
 * verifier-paragraphes-coupes.mjs — détecte et corrige les paragraphes de prose coupés à la main
 * sur plusieurs lignes source (TF-1534, 02/10/2026).
 *
 * LA RÈGLE (S54 d'oracle-synthese.mjs, règle de forme transverse n° 9, v2.32.0 de
 * gabarits\RESTITUTION.md) : un paragraphe de prose s'écrit sur UNE SEULE ligne source — le chat
 * de l'extension VS Code rend chaque saut de ligne, et un paragraphe coupé vers 100 caractères s'y
 * affiche en colonne étroite au lieu d'occuper la largeur (retour humain du 29/09/2026, TF-1494).
 * Les listes, les tableaux, les citations et le code gardent leur forme.
 *
 * CE FICHIER REPREND L'ALGORITHME EXACT DE S54 (oracles\oracle-synthese.mjs), dupliqué plutôt
 * qu'importé — S54 vit dans une fonction `juger()` de 2000+ lignes, non exportée pour cet usage,
 * et ce fichier-ci est hors du périmètre des synthèses qu'oracle-synthese juge (un référentiel
 * normatif, « ne se marque PAS », selon ses propres termes). La duplication est consciente et
 * nommée (même geste que EST_SIDECAR dans scripts\generer-lisezmoi-output.mjs, TF-1404).
 *
 * TF-1534 (02/10/2026) : le gabarit `gabarits\RESTITUTION.md`, qui PRESCRIT cette règle depuis la
 * v2.32.0 et que les sessions IMITENT, restait lui-même coupé vers 100 caractères hors des
 * passages ajoutés le 01/10/2026 — la règle n'était pas tenue par son propre texte.
 *
 * Usage : node gabarits\verifier-paragraphes-coupes.mjs <fichier.md> [--corriger]
 *   --corriger : réécrit les paragraphes coupés en une seule ligne chacun (espaces normalisés),
 *   sans toucher aux listes, tableaux, citations, code, titres et filets.
 * Exit : 0 = aucune coupure (ou corrigée) · 1 = coupure(s) détectée(s) sans --corriger.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Les paragraphes de prose coupés sur ≥ 2 lignes source consécutives, même algorithme que S54. */
export function paragraphesCoupes(texte) {
  const lignes = texte.replace(/\r\n?/g, "\n").split("\n");
  let i0 = 0;
  if (/^---\s*$/.test(lignes[0] || "")) {
    const fin = lignes.findIndex((l, i) => i > 0 && /^(?:---|\.\.\.)\s*$/.test(l));
    if (fin > 0) i0 = fin + 1;
  }
  const RE_PUCE = /^\s*(?:[-*+]|\d{1,3}[.)])\s+/;
  const coupes = [];
  let dansCode = false, dansListe = false, para = null;
  const clore = () => { if (para && para.n >= 2) coupes.push(para); para = null; };
  for (let i = i0; i < lignes.length; i++) {
    const l = lignes[i];
    if (/^\s*(?:```|~~~)/.test(l)) { clore(); dansCode = !dansCode; continue; }
    if (dansCode) continue;
    if (!l.trim()) { clore(); continue; }
    if (dansListe && para === null && !/^\s{2,}\S/.test(l) && !RE_PUCE.test(l)) dansListe = false;
    if (/^\s*#{1,6}\s/.test(l) || /^\s*\|/.test(l) || /^\s*>/.test(l) || /^\s*</.test(l)
      || /^\s*(?:-{3,}|\*{3,}|_{3,}|={3,})\s*$/.test(l)) { clore(); dansListe = false; continue; }
    if (RE_PUCE.test(l)) { clore(); dansListe = true; continue; }
    if (dansListe) continue;
    if (para) { para.n++; para.lignes.push(i); }
    else para = { ligne: i + 1, n: 1, lignes: [i], debut: l.trim().replace(/\s+/g, " ").slice(0, 60) };
  }
  clore();
  return coupes;
}

/** Réécrit le texte : chaque paragraphe coupé devient une seule ligne, espaces normalisés entre
 *  les fragments qui portaient un retour à la ligne. Rien d'autre ne bouge — même découpage en
 *  lignes que `paragraphesCoupes`, donc les mêmes exclusions (listes, tableaux, code, titres…). */
export function reformater(texte) {
  const eol = /\r\n/.test(texte) ? "\r\n" : "\n";
  const lignes = texte.replace(/\r\n?/g, "\n").split("\n");
  const coupes = paragraphesCoupes(texte);
  const aFusionner = new Set();
  for (const c of coupes) for (const i of c.lignes) aFusionner.add(i);
  const sortie = [];
  let i = 0;
  while (i < lignes.length) {
    if (aFusionner.has(i)) {
      const fragments = [];
      while (i < lignes.length && aFusionner.has(i)) { fragments.push(lignes[i].trim()); i++; }
      sortie.push(fragments.join(" ").replace(/\s+/g, " "));
      continue;
    }
    sortie.push(lignes[i]);
    i++;
  }
  return sortie.join(eol);
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const fichier = args.find((a) => !a.startsWith("--"));
  const CORRIGER = args.includes("--corriger");
  if (!fichier) { console.error("usage : node gabarits\\verifier-paragraphes-coupes.mjs <fichier.md> [--corriger]"); process.exit(2); }
  const texte = readFileSync(fichier, "utf8");
  const coupes = paragraphesCoupes(texte);
  if (!coupes.length) { console.log(`${fichier} : aucun paragraphe coupé`); process.exit(0); }
  if (!CORRIGER) {
    console.error(`${fichier} : ${coupes.length} paragraphe(s) coupé(s) — le 1er à la ligne ${coupes[0].ligne}, `
      + `sur ${coupes[0].n} lignes (« ${coupes[0].debut}… »)`);
    process.exit(1);
  }
  writeFileSync(fichier, reformater(texte), "utf8");
  console.log(`${fichier} : ${coupes.length} paragraphe(s) reformaté(s) en une ligne chacun`);
  process.exit(0);
}
