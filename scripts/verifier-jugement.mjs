#!/usr/bin/env node
/**
 * verifier-jugement.mjs — un livrable MODIFIÉ après avoir été jugé se voit (TF-0523, 23/08/2026).
 *
 * LE DÉFAUT, commis puis constaté le 23/08. J'ai écrasé QUATRE FOIS le même fichier de livrable —
 * correction de style, montée de version de gabarit, ajout de trois schémas, correction de
 * chevauchements — alors que la règle 5 des règles de projet dit : « l'indice est une lettre par
 * itération du même jour ; une nouvelle version = un nouveau fichier daté, JAMAIS d'écrasement ».
 * Les états intermédiaires sont perdus, et LE MÊME NOM A DÉSIGNÉ QUATRE CONTENUS DIFFÉRENTS.
 *
 * AGGRAVANT, et c'est lui qui rend l'outil nécessaire plutôt que la règle suffisante : j'avais
 * signalé le même défaut UNE HEURE PLUS TÔT sur un gabarit — un numéro de version désignant deux
 * squelettes différents — et je l'ai reproduit sur mes propres livrables. **Connaître la règle ne
 * suffit pas, et une règle non câblée ne s'applique pas, y compris à celui qui vient de la citer.**
 *
 * LE MOMENT OÙ UN FICHIER CESSE D'ÊTRE UN BROUILLON EST IDENTIFIABLE : c'est celui où il passe ses
 * oracles pour la première fois. R-32 exige déjà un journal d'oracles par livrable HTML ; il suffit
 * d'y lire l'empreinte du contenu jugé et de la confronter au fichier présent. La preuve existait,
 * personne ne la relisait.
 *
 * Usage :
 *   node scripts\verifier-jugement.mjs <dossier|fichier> [...]      → verdict JSON, exit 0/1
 *   node scripts\verifier-jugement.mjs output --sceller             → (re)pose l'empreinte courante
 *
 * `--sceller` est le geste qu'on fait UNE FOIS, quand le fichier est réputé bon : il écrit
 * l'empreinte à côté de lui. Sans ce geste, un livrable est « non scellé » — ce n'est pas un défaut,
 * c'est un état, et l'outil le dit sans échouer. Un contrôle qui exige un sceau sur tout l'existant
 * se fait désactiver le jour de son arrivée.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { createHash } from "node:crypto";

const args = process.argv.slice(2);
const SCELLER = args.includes("--sceller");
const cibles = args.filter((a) => !a.startsWith("--"));
// TF-0692 (31/08/2026) — LE PDF ENTRE DANS LE CHAMP DU SCEAU.
//
// LE FAIT : des familles de livrables declarent DEUX formats, html et pdf. Le controle n'en jugeait
// qu'un : la moitie du jeu etait hors de portee, Y COMPRIS QUAND ELLE ETAIT SCELLEE. Une paire
// pouvait donc se desynchroniser — le document corrige, sa version imprimable restee en arriere —
// sans que rien ne le dise, et c'est la version imprimable qui est DIFFUSEE.
//
// L'ITEM PROPOSAIT DEUX VARIANTES ET RECOMMANDAIT LA SECONDE, moins ambitieuse : un controle de
// coherence de jeu, sans lire le PDF. La MESURE a renverse ce choix. Le sceau hache un BUFFER —
// `sha(readFileSync(f))`, sans encodage — donc rien n'exigeait que le contenu soit lisible : la
// premiere variante coutait deux lignes, pas un dispositif. Et l'effet de bord a ete mesure avant
// d'etre suppose : ZERO fichier PDF dans ce depot, donc aucun livrable existant ne bascule sous
// controle par surprise.
const JUGES = new Set([".html", ".htm", ".md", ".pdf"]);
// Le nom d'un livrable porte sa date et son indice (règle 4) : c'est cela qui doit changer quand le
// contenu change. Un fichier hors convention n'est pas jugé — les README, notices et registres
// générés ne sont pas des livrables datés.
const NOMME_LIVRABLE = /\s-\s\d{8}[a-z]\.(html?|md|pdf)$/i;
const SCEAU = ".jugement.json";

const findings = [];
const add = (regle, severite, ou, message) => findings.push({ regle, severite, ou, message });

const NON_JUGE = [
  "un fichier HORS convention de nommage daté : les README, notices et vues générées ne sont pas " +
  "des livrables à indice, et leur imposer un sceau ferait du bruit sans rien protéger",
  "un livrable NON SCELLÉ : c'est un état, pas un défaut. Le sceau se pose une fois, quand le " +
  "fichier est réputé bon — exiger un sceau sur tout l'existant ferait désactiver le contrôle",
  "la QUALITÉ du contenu : cet outil compare deux empreintes, il ne relit rien",
  "un fichier RENOMMÉ correctement (nouvel indice) : c'est exactement ce que la règle demande, et " +
  "son sceau naît avec lui",
  "la COHÉRENCE D'UN JEU de formats : un livrable html scellé dont le pdf frère manque n'est pas " +
  "signalé ici. Depuis le 31/08 les deux formats sont scellés SÉPARÉMENT, ce qui attrape la " +
  "modification silencieuse de l'un ou de l'autre ; l'ABSENCE de l'un des deux reste un autre " +
  "sujet, et il est déclaré plutôt que faussement promis",
];

const sha = (b) => createHash("sha256").update(b).digest("hex");

function fichiers(cible) {
  if (!existsSync(cible)) return [];
  if (statSync(cible).isFile()) return [cible];
  const out = [];
  const marcher = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith(".") || e.name === "_oracles" || e.name === "node_modules") continue;
      const c = join(d, e.name);
      if (e.isDirectory()) marcher(c);
      else if (JUGES.has(extname(e.name).toLowerCase())) out.push(c);
    }
  };
  marcher(cible);
  return out;
}

if (!cibles.length) {
  process.stdout.write(JSON.stringify({
    outil: "verifier-jugement", verdict: "ERREUR",
    message: "usage : node scripts\\verifier-jugement.mjs <dossier|fichier> [...] [--sceller]",
  }, null, 1) + "\n");
  process.exit(2);
}

let scelles = 0, verifies = 0, nonScelles = 0;
for (const cible of cibles) {
  for (const f of fichiers(cible)) {
    if (!NOMME_LIVRABLE.test(basename(f))) continue;
    const empreinte = sha(readFileSync(f));
    const sceau = f + SCEAU;
    if (SCELLER) {
      writeFileSync(sceau, JSON.stringify({
        format: "pilot/jugement@1", fichier: basename(f), empreinte,
        scelle_le: new Date().toISOString(),
        regle: "règle 5 — une nouvelle version = un nouveau fichier daté, JAMAIS d'écrasement (TF-0523)",
      }, null, 1) + "\n", "utf8");
      scelles++;
      continue;
    }
    if (!existsSync(sceau)) { nonScelles++; continue; }
    let j = null;
    try { j = JSON.parse(readFileSync(sceau, "utf8")); } catch { /* sceau illisible */ }
    if (!j || typeof j.empreinte !== "string") {
      add("J-0", "majeur", f, "sceau illisible — le supprimer et rejouer `--sceller` si le fichier est réputé bon");
      continue;
    }
    verifies++;
    if (j.empreinte !== empreinte) {
      add("J-1", "bloquant", f,
        `livrable MODIFIÉ après avoir été jugé, à indice INCHANGÉ. Le sceau porte ` +
        `${j.empreinte.slice(0, 12)}…, le fichier porte ${empreinte.slice(0, 12)}… — scellé le ` +
        `${(j.scelle_le || "?").slice(0, 19)}. Le même nom désigne donc deux contenus, et l'état ` +
        "précédent est perdu. Règle 5 : une nouvelle version = un NOUVEAU fichier daté, avec l'indice " +
        "suivant. Si la modification est délibérée et le fichier pas encore diffusé, rejouer " +
        "`--sceller` — mais alors c'est un choix, pas un oubli.");
    }
  }
}

const durs = findings.filter((f) => f.severite === "bloquant" || f.severite === "majeur");
const verdict = SCELLER ? "SCELLE" : durs.length ? "FAIL" : "PASS";
process.stdout.write(JSON.stringify({
  outil: "verifier-jugement", version: "1.0.0", cibles, verdict,
  mesure: SCELLER ? { scelles } : { verifies, non_scelles: nonScelles, ecarts: durs.length },
  findings: findings.length ? findings : [{
    regle: "J-1", severite: "info", ou: cibles.join(" "),
    message: SCELLER ? `${scelles} livrable(s) scellé(s)` :
      `${verifies} livrable(s) scellé(s) vérifié(s), aucun modifié après jugement` +
      (nonScelles ? ` · ${nonScelles} non scellé(s), déclaré(s) et non jugé(s)` : ""),
  }],
  non_juge: NON_JUGE,
  remede: "un nouveau contenu = un nouveau fichier avec l'indice suivant (règle 5) ; `--sceller` ne se rejoue que sur un choix assumé",
}, null, 1) + "\n");
process.exit(verdict === "FAIL" ? 1 : 0);
