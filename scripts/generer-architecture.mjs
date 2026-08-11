#!/usr/bin/env node
// generer-architecture.mjs — projette docs\projet\ARCHITECTURE.md en ARCHITECTURE.html
// (TF-0091). La source Markdown fait foi ; la vue est régénérée, jamais éditée.
// Déterministe, autonome (A1), chartée. Usage :
//   node scripts/generer-architecture.mjs <chemin>\ARCHITECTURE.md
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { lireSource, mdVersHtml, coquille, svgBoites, esc } from "./lib-vue-html.mjs";

const src = process.argv[2];
if (!src) { console.error("usage : generer-architecture.mjs <ARCHITECTURE.md>"); process.exit(2); }
const texte = readFileSync(src, "utf8");
const { front, corps } = lireSource(texte);

// composants : blocs « ## Composant : nom » + listes « - clé: valeur »
const composants = [];
for (const m of corps.matchAll(/^## Composant : (.+)$\r?\n((?:^- .+$\r?\n?)*)/gm)) {
  const nom = m[1].trim();
  if (/[{}]/.test(nom)) continue; // placeholder de gabarit : hors diagramme
  const attrs = {};
  for (const a of m[2].matchAll(/^- (\w+)\s*:\s*(.+)$/gm)) attrs[a[1]] = a[2].trim();
  composants.push({ id: nom, sous: (attrs.techno || "").split("—")[0].trim().slice(0, 30) });
}

// flux : première table sous « ## Flux » (colonnes De | Vers | …)
const liens = [];
const bloc = corps.match(/^## Flux\s*$([\s\S]*?)(?=^## |\s*$(?![\s\S]))/m);
if (bloc) for (const r of bloc[1].split(/\r?\n/)) {
  if (!/^\s*\|/.test(r) || /^\s*\|[\s:|-]+\|?\s*$/.test(r)) continue;
  const c = r.trim().replace(/^\||\|$/g, "").split("|").map((x) => x.trim());
  if (c[0] === "De" || c.length < 2 || /[{}]/.test(c[0] + c[1])) continue;
  liens.push({ de: c[0], vers: c[1], titre: c.slice(2).filter(Boolean).join(" · ") });
}

const titre = (corps.match(/^# (.+)$/m) || [null, "Architecture"])[1].trim();
const svg = composants.length >= 2 ? {
  label: `Diagramme d'architecture : ${composants.length} composants, ${liens.length} flux`,
  legende: `${composants.length} composant(s), ${liens.length} flux — le détail de chaque flèche est dans la table Flux ci-dessous.`,
  corps: svgBoites(composants, liens),
} : null;

const html = coquille({
  titre, description: "Architecture technique — vue générée depuis ARCHITECTURE.md (la source fait foi).",
  front, svg, corpsHtml: mdVersHtml(corps.replace(/^# .+$\r?\n/m, "")), source: texte,
});
const cible = join(dirname(src), "ARCHITECTURE.html");
writeFileSync(cible, html);
console.log(`ARCHITECTURE.html générée — ${composants.length} composant(s), ${liens.length} flux (${esc(front.verifie_le || "?")})`);
