#!/usr/bin/env node
// generer-modele-donnees.mjs — projette docs\projet\MODELE-DONNEES.md en MODELE-DONNEES.html
// (TF-0091). La source Markdown fait foi ; la vue est régénérée, jamais éditée.
// Déterministe, autonome (A1), chartée. Usage :
//   node scripts/generer-modele-donnees.mjs <chemin>\MODELE-DONNEES.md
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { lireSource, mdVersHtml, coquille, svgBoites } from "./lib-vue-html.mjs";

const src = process.argv[2];
if (!src) { console.error("usage : generer-modele-donnees.mjs <MODELE-DONNEES.md>"); process.exit(2); }
const texte = readFileSync(src, "utf8");
const { front, corps } = lireSource(texte);

// tables : blocs « ## Table : nom » ; liens : table « Liens sortants » du bloc
const tables = [], liens = [];
const blocs = [...corps.matchAll(/^## Table : (.+)$/gm)];
blocs.forEach((m, i) => {
  const nom = m[1].trim();
  if (/[{}]/.test(nom)) return; // placeholder de gabarit
  const fin = i + 1 < blocs.length ? blocs[i + 1].index : corps.length;
  const bloc = corps.slice(m.index, fin);
  // nb de colonnes décrites = lignes de données de la table AVANT « Liens sortants »
  const avantLiens = bloc.split(/Liens sortants/)[0];
  const nbCol = avantLiens.split(/\r?\n/).filter((r) =>
    /^\s*\|/.test(r) && !/^\s*\|[\s:|-]+\|?\s*$/.test(r) && !/^\s*\|\s*Colonne\b/.test(r)).length;
  tables.push({ id: nom, sous: `${nbCol} colonne(s)` });
  const lb = bloc.match(/Liens sortants\s*:?\s*$([\s\S]*)/m);
  if (lb) for (const r of lb[1].split(/\r?\n/)) {
    if (!/^\s*\|/.test(r) || /^\s*\|[\s:|-]+\|?\s*$/.test(r)) continue;
    const c = r.trim().replace(/^\||\|$/g, "").split("|").map((x) => x.trim());
    if (c[0] === "Colonne" || c.length < 3 || /[{}]/.test(c.join(""))) continue;
    const cible = c[1].split(".")[0];
    liens.push({ de: nom, vers: cible, titre: `${c[0]} → ${c[1]} (${c[2]})` });
  }
});

const sansObjet = /sans objet — aucune persistance/i.test(corps);
const titre = (corps.match(/^# (.+)$/m) || [null, "Modèle de données"])[1].trim();
const svg = !sansObjet && tables.length >= 2 ? {
  label: `Diagramme du modèle : ${tables.length} tables, ${liens.length} lien(s)`,
  legende: `${tables.length} table(s), ${liens.length} lien(s) — colonne, cible et cardinalité de chaque flèche dans les tables « Liens sortants ».`,
  corps: svgBoites(tables, liens),
} : null;

const html = coquille({
  titre, description: "Modèle de données — vue générée depuis MODELE-DONNEES.md, ancrée au schéma réel (R-26).",
  front, svg, corpsHtml: mdVersHtml(corps.replace(/^# .+$\r?\n/m, "")), source: texte,
});
const cible = join(dirname(src), "MODELE-DONNEES.html");
writeFileSync(cible, html);
console.log(`MODELE-DONNEES.html générée — ${tables.length} table(s), ${liens.length} lien(s)${sansObjet ? " (sans objet)" : ""}`);
