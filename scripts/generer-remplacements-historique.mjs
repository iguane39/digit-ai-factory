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
import { cheminsTables } from "./lib-confidentiel.mjs";

const sortie = process.argv[2];
if (!sortie) { console.error("usage : node scripts/generer-remplacements-historique.mjs <dossier-de-sortie>"); process.exit(2); }
const NOMS = cheminsTables().clients; // canal confidentiel (D-28 a), env, ou ancien fichier libre
const PRODUITS = cheminsTables().produits;
const clients = JSON.parse(readFileSync(NOMS, "utf8"));
const produits = JSON.parse(readFileSync(PRODUITS, "utf8")).produits || {};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const lignes = [];
const noms = []; // paires littérales pour les NOMS DE FICHIERS
const motifs = []; // motifs de VARIANTES pour les NOMS DE FICHIERS (09/09/2026, cinquième passe)
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
  // Un nom d'UN SEUL MOT (alias court, sigle de produit — 06/09/2026, TF-0826) se remplace MOT ENTIER et
  // insensible à la casse, comme la porte C5 le juge : un littéral toucherait l'intérieur d'un autre mot
  // (« Produit-09M », « escc ») et manquerait la graphie en minuscules d'un identifiant de run.
  if (/^[A-Za-z0-9]+$/.test(k)) lignes.push(`regex:(?i)(?<![A-Za-z0-9])${esc(k)}(?![A-Za-z0-9])==>${v}`);
  else lignes.push(`${k}==>${v}`);
  noms.push([k, v]);
  if (!k.includes(".")) {
    const mots = k.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s\-_]+/).filter(Boolean);
    if (mots.length >= 2 && mots.join("").length >= 8) {
      const corps = `(?i)(?<![A-Za-z0-9])${mots.map(esc).join("[\\s\\-_]*")}(?![A-Za-z0-9])`;
      lignes.push(`regex:${corps}==>${v}`);
      // LE NOM DE FICHIER A BESOIN DU MÊME MOTIF QUE LE CONTENU (09/09/2026, cinquième passe).
      // Le fait : la passe du 09/09 a laissé UN constat sur 939 — une clé écrite en minuscules
      // à tirets dans la table, et le même nom écrit en Majuscules à Espaces dans le nom d'un
      // rapport. Les contenus étaient couverts depuis le 03/09 par la variante de graphie ; le
      // rappel de noms, lui, ne faisait que du LITTÉRAL. Or la porte juge un nom de fichier AVEC
      // les variantes : une règle qui vaut pour le contenu et pas pour le nom laisse un nom de
      // client dans un chemin publié, et le chemin est ce qu'un moteur indexe en premier.
      // L'exemple est décrit et non cité, et c'est voulu : la première version de ce commentaire
      // citait les deux graphies réelles, la chaîne d'anonymisation les a remplacées par LE MÊME
      // pseudonyme, et la phrase s'est mise à dire « X écrit X ». Un texte dont le SUJET est la
      // graphie d'un nom se détruit en le pseudonymisant — il s'écrit donc sans nom réel dès le
      // départ, ou avec un nom inventé comme le fait le banc de ce script.
      motifs.push([corps, v]);
    }
  }
}
const uniq = [...new Set(lignes)];
mkdirSync(sortie, { recursive: true });
writeFileSync(join(sortie, "remplacements.txt"), uniq.join("\n") + "\n", "utf8");
// UN NOM DE FICHIER SE SUBSTITUE AVEC UNE FRONTIÈRE DE MOT, JAMAIS EN LITTÉRAL NU (09/09/2026).
// Le défaut, relevé par le banc écrit ce jour-là et présent depuis l'origine du script : la
// substitution des noms se faisait par `str.replace()`, sans frontière — un fichier `Zorgon.mjs`
// devenait `Produit-92on.mjs` dès qu'une clé « Zorg » existait — et le vrai parc porte des clés
// de TROIS LETTRES. Le CONTENU avait sa frontière depuis le 06/09 (TF-0826) ; le NOM ne
// l'avait pas. La frontière retenue ici est celle de la PORTE — `[A-Za-z0-9]`, sans le souligné —
// parce qu'un chemin n'est pas du code : renommer `lib_<cle>_helper.py` est voulu, alors que couper
// un identifiant dans une source ne l'est pas (TF-0927).
const bordee = (t) => `(?<![A-Za-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z0-9])`;
const paires = [...noms].sort((a, b) => b[0].length - a[0].length);
const tousMotifs = [
  ...paires.map(([t, v]) => [bordee(t), v]),   // les clés, du plus long au plus court
  ...motifs,                                    // puis les variantes de graphie des noms composés
];
const py = [
  "import re",
  `motifs = ${JSON.stringify(tousMotifs)}`,
  "for motif, vers in motifs:",
  "    filename = re.sub(motif.encode(), vers.encode(), filename)",
  "return filename",
].join("\n");
writeFileSync(join(sortie, "filename-callback.py"), py, "utf8");
console.log(JSON.stringify({ regles_contenu_et_messages: uniq.length, motifs_noms_de_fichiers: tousMotifs.length, sortie }));
