#!/usr/bin/env node
/**
 * construire.mjs — construit l'entrée d'un jugement à l'aveugle sur le banc des défauts échappés
 * (TF-1073) : pour chaque livrable, le défaut à rechercher puis les listes de constats de chaque
 * condition sous des étiquettes L1..Ln permutées ; la clé de correspondance est écrite à part et ne
 * doit jamais être montrée au juge.
 *
 * Les listes viennent de fichiers Markdown dont chaque bloc ```text contient des sections
 * « ## E-NN » (format de sortie de la consigne commune du protocole). La référence est le premier
 * bloc de --reference ; les candidates sont les blocs de --candidats, dans l'ordre de --codes.
 * Permutation : celle du manifeste quand elle porte exactement les codes joués (rejeu de la mesure
 * du 14/09/2026) ; sinon un ordre déterministe tiré d'une empreinte du livrable et des codes.
 *
 * Usage : node construire.mjs --reference <md> --candidats <md> --codes XUM --sortie <dossier>
 *                             [--manifeste <manifeste.json>]
 * Exit : 0 construit · 1 liste manquante ou de plus de 8 constats · 2 entrée illisible.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const blocs = (t) => [...t.matchAll(/```text\r?\n([\s\S]*?)```/g)].map((m) => m[1]);

export function parLivrable(bloc) {
  const r = {};
  for (const part of bloc.split(/^## (?=E-\d+)/m).slice(1)) {
    const id = part.match(/^(E-\d+)/)[1];
    r[id] = part.slice(id.length).trim().split(/\r?\n/)
      .filter((l) => !/non retenu faute de préjudice net/.test(l)) // constat retiré par son auteur (mesure du 14/09)
      .join("\n");
  }
  return r;
}

// Ordre des listes présenté au juge. Ce N'EST PAS un sceau : rien n'est vérifié contre cette valeur,
// elle ne sert qu'à mélanger les conditions de façon reproductible (14/09/2026 : une empreinte
// sha256 employée ici comptait pour un site de scellement non déclaré, règle E2 d'oracle-empreintes ;
// un mélange n'a pas à naître comme un sixième mécanisme d'empreinte). Graine : somme pondérée des
// codes de caractères, déterministe et sans cryptographie.
const graine = (s) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 2147483647, 7);

function permutation(livrable, codes) {
  if (livrable.perm && [...livrable.perm].sort().join("") === [...codes].sort().join("")) return livrable.perm;
  return [...codes].sort((a, b) => graine(livrable.id + a) - graine(livrable.id + b) || a.localeCompare(b)).join("");
}

export function construire({ reference, candidats, codes, manifeste }) {
  const cond = { [manifeste.seuil.reference]: parLivrable(blocs(reference)[0] || "") };
  const bc = blocs(candidats);
  [...codes].forEach((c, i) => { cond[c] = parLivrable(bc[i] || ""); });
  const tous = manifeste.seuil.reference + codes;
  let entree = "# Entrée du jugement à l'aveugle\n\nPour chaque livrable : le défaut échappé à rechercher, puis des listes de constats L1… produites par des relecteurs indépendants. L'ordre des listes change d'un livrable à l'autre.\n";
  const cle = {};
  const decompte = Object.fromEntries([...tous].map((c) => [c, 0]));
  for (const l of manifeste.livrables) {
    entree += `\n## ${l.id}\n\n**Défaut échappé à rechercher** : ${l.defaut}\n\nLivrable relu : \`${l.id}.md\` du dossier des livrables.\n`;
    cle[l.id] = {};
    [...permutation(l, tous)].forEach((c, i) => {
      const L = "L" + (i + 1);
      cle[l.id][L] = c;
      const txt = cond[c][l.id];
      if (!txt) throw Object.assign(new Error(`liste manquante : ${c} ${l.id}`), { code: 1 });
      const n = (txt.match(/^\d+\. /gm) || []).length;
      if (n > 8) throw Object.assign(new Error(`plus de 8 constats : ${c} ${l.id} (${n})`), { code: 1 });
      decompte[c] += n;
      entree += `\n### ${L}\n\n${txt}\n`;
    });
  }
  return { entree, cle, decompte };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const arg = (nom) => { const i = process.argv.indexOf(nom); return i > 0 ? process.argv[i + 1] : null; };
  try {
    const manifeste = JSON.parse(readFileSync(arg("--manifeste") || join(ICI, "manifeste.json"), "utf8"));
    const { entree, cle, decompte } = construire({
      reference: readFileSync(arg("--reference"), "utf8"),
      candidats: readFileSync(arg("--candidats"), "utf8"),
      codes: arg("--codes"),
      manifeste,
    });
    const sortie = arg("--sortie");
    mkdirSync(sortie, { recursive: true });
    writeFileSync(join(sortie, "entree.md"), entree);
    writeFileSync(join(sortie, "cle.json"), JSON.stringify(cle, null, 1));
    console.log(JSON.stringify({ decompte, total: Object.values(decompte).reduce((a, b) => a + b, 0), sortie }));
  } catch (e) {
    console.error(`[banc] ${e.message}`);
    process.exit(e.code === 1 ? 1 : 2);
  }
}
