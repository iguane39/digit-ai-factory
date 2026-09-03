#!/usr/bin/env node
// generer-remplacements-historique.mjs — dérive, DEPUIS les deux tables hors git, les règles que
// `git filter-repo` applique pour retirer les noms de clients et de produits de TOUT l'historique
// d'un dépôt (contenus, messages de commit, noms de fichiers). Mode opératoire complet :
// references/TODO-FORGE.md, paragraphe « Réécrire l'historique d'un dépôt » (D-38, 03/09/2026).
//
//   node scripts/generer-remplacements-historique.mjs <dossier-de-sortie>
//
// Produit deux fichiers dans <dossier-de-sortie> :
//   · remplacements.txt   — format --replace-text / --replace-message (`A==>B`, `regex:…==>B`)
//   · filename-callback.py — corps Python pour --filename-callback (littéraux, les plus longs d'abord)
//
// Ce que la première réécriture (03/09) a appris, et qui est câblé ici :
//   · un SIGLE se remplace INSENSIBLE À LA CASSE et mot entier — la porte de publication juge
//     ainsi, et la passe sensible à la casse avait laissé 96 constats sur un identifiant de run
//     en minuscules ;
//   · un nom de produit multi-mots se remplace aussi dans ses variantes (espaces, tirets,
//     soulignés, casse) — même règle que todo/anonymiser-entrant.mjs ;
//   · les clés de table qui sont des CHEMINS (C:\…) ne sont pas des noms : ignorées.
// Le script lit les tables AU MOMENT du geste : un alias ajouté à la table entre dans la
// réécriture sans retouche du script. Les tables ne sont jamais copiées dans le dépôt.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const sortie = process.argv[2];
if (!sortie) { console.error("usage : node scripts/generer-remplacements-historique.mjs <dossier-de-sortie>"); process.exit(2); }
const NOMS = process.env.FORGE_NOMS_INTERDITS || "c:/dev/_noms-interdits.json";
const PRODUITS = process.env.FORGE_PRODUITS_PSEUDO || "c:/dev/_produits-pseudonymes.json";
const clients = JSON.parse(readFileSync(NOMS, "utf8"));
const produits = JSON.parse(readFileSync(PRODUITS, "utf8")).produits || {};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const lignes = [];
const noms = []; // paires littérales pour les NOMS DE FICHIERS
for (const n of clients.noms || []) {
  const c = clients.pseudonymes?.[n]; if (!c) continue;
  const cap = n[0].toUpperCase() + n.slice(1).toLowerCase();
  lignes.push(`${n.toUpperCase()}==>${c.toUpperCase()}`, `${cap}==>${c}`, `${n.toLowerCase()}==>${c.toLowerCase()}`);
  noms.push([n.toUpperCase(), c.toUpperCase()], [cap, c], [n.toLowerCase(), c.toLowerCase()]);
}
for (const i of clients.identifiants || []) { const c = clients.pseudonymes?.[i]; if (c) { lignes.push(`${i}==>${c}`); noms.push([i, c]); } }
for (const g of clients.sigles || []) { const c = clients.pseudonymes?.[g]; if (c) lignes.push(`regex:(?i)(?<![A-Za-z0-9_])${esc(g)}(?![A-Za-z0-9_])==>${c}`); }
for (const [k, v] of Object.entries(produits)) {
  if (/^[A-Za-z]:[\\/]/.test(k)) continue;
  lignes.push(`${k}==>${v}`); noms.push([k, v]);
  if (!k.includes(".")) {
    const mots = k.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_]+/).filter(Boolean);
    if (mots.length >= 2 && mots.join("").length >= 8) lignes.push(`regex:(?i)(?<![A-Za-z0-9])${mots.map(esc).join("[\\s\\-_]*")}(?![A-Za-z0-9])==>${v}`);
  }
}
const uniq = [...new Set(lignes)];
mkdirSync(sortie, { recursive: true });
writeFileSync(join(sortie, "remplacements.txt"), uniq.join("\n") + "\n", "utf8");
const paires = [...noms].sort((a, b) => b[0].length - a[0].length);
const py = `paires = ${JSON.stringify(paires)}\nfor de, vers in paires:\n    filename = filename.replace(de.encode(), vers.encode())\nreturn filename`;
writeFileSync(join(sortie, "filename-callback.py"), py, "utf8");
console.log(JSON.stringify({ regles_contenu_et_messages: uniq.length, paires_noms_de_fichiers: paires.length, sortie }));
