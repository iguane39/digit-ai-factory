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
 *   node scripts\verifier-jugement.mjs output --sceller --essai     → ANNONCE sans rien écrire
 *   node scripts\verifier-jugement.mjs output --sceller --en-masse  → au-delà d'un livrable, se déclare
 *
 * `--sceller` est le geste qu'on fait UNE FOIS, quand le fichier est réputé bon : il écrit
 * l'empreinte à côté de lui. Sans ce geste, un livrable est « non scellé » — ce n'est pas un défaut,
 * c'est un état, et l'outil le dit sans échouer. Un contrôle qui exige un sceau sur tout l'existant
 * se fait désactiver le jour de son arrivée.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { createHash } from "node:crypto";
// TF-1266 (D-15 (a), 17/09/2026) — le perimetre se LIT dans references\EXTENSIONS-JUGEES.json,
// il ne se recopie pas : quatre controles enumeraient chacun le leur et les listes divergeaient.
import { livrablesPorteurs } from "./lib-extensions-jugees.mjs";

const args = process.argv.slice(2);
const SCELLER = args.includes("--sceller");
const ESSAI = args.includes("--essai");
const EN_MASSE = args.includes("--en-masse");

/**
 * LE SEUIL DE MASSE, ET POURQUOI IL EST A UN (TF-1303, decision humaine A-30 du 22/09/2026).
 *
 * `--sceller` est le geste qu on fait UNE FOIS, quand un fichier est repute bon. Il vivait a UN
 * MOT de la forme qui MESURE, sur la meme commande et la meme cible. Le 22/09/2026 la forme
 * ecrivante a ete lancee a la place de la mesurante : 166 sceaux poses et 42 modifies, c est-a-
 * dire « ce livrable est repute bon » ecrit sur tout un dossier sans qu aucun ait ete relu.
 *
 * CE QUE CE GESTE AURAIT EFFACE est le vrai cout : une fois les sceaux rendus, le verificateur
 * rend FAIL sur 30 ECARTS reels. Le re-scellement les aurait remplaces par 30 verts, sans trace,
 * puisque l empreinte d origine aurait ete perdue.
 *
 * Sceller PLUS D UN livrable exige donc `--en-masse`, en toutes lettres. Un geste qu on fait une
 * fois se nomme au singulier ; celui qui porte sur un dossier entier se declare.
 */
const SEUIL_DE_MASSE = 1;
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
const JUGES = livrablesPorteurs();
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

// TF-1312 / D-32 (22/09/2026) — L EMPREINTE PORTE SUR LE CONTENU NORMALISE, PAS SUR LES OCTETS
// DU POSTE.
//
// LE FAIT MESURE : ce sceau hachait les octets de l ARBRE DE TRAVAIL, que git reecrit a chaque
// extraction selon `core.autocrlf` du poste. Le meme livrable rendait `af16115…` sur ce disque
// (CRLF) et `8dbe037…` au depot (LF). Un sceau pose ici etait donc vert ici et rouge partout
// ailleurs — c est ce qui tenait la recette hebergee fermee, et c est la vraie cause des 31
// ecarts que j avais d abord attribues a la reecriture d histoire du 09/09.
//
// CE QUI EST NORMALISE, ET CE QUI NE L EST PAS. Les formats TEXTUELS voient leurs fins de ligne
// ramenees a un seul saut avant le calcul : ce sont eux, et eux seuls, que git reecrit. Un PDF
// reste hache octet pour octet — normaliser un binaire ferait collisionner deux contenus
// reellement differents, et git ne le touche pas. La frontiere du sceau est donc celle de git,
// la seule qui le rende portable sans mentir sur ce qu il protege.
const TEXTUELS = new Set([".md", ".html", ".htm"]);
export const METHODE = "sha256/lf";
const normaliser = (buffer, fichier) => (TEXTUELS.has(extname(fichier).toLowerCase())
  ? Buffer.from(buffer.toString("utf8").replace(/\r\n/g, "\n"), "utf8")
  : buffer);
export const empreinteDe = (fichier) => sha(normaliser(readFileSync(fichier), fichier));

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

// TF-1306 / D-29 (22/09/2026) — UN SCELLEMENT REEL NE PREND QUE DES FICHIERS NOMMES.
//
// LE FAIT, COMMIS DEUX FOIS DANS LA MEME JOURNEE : le garde de masse fait DECLARER l intention
// (`--en-masse`), il ne fait pas VERIFIER la PORTEE. Le 22/09 l intention a ete declaree pour 31
// livrables identifies, la cible est restee le dossier `output`, et 213 ont ete scelles. Une
// declaration ne mesure rien : seule la cible dit sur quoi le geste tombe.
//
// LA PORTEE SE VERIFIE DONC A LA SOURCE : ecrire un sceau exige que chaque cible soit un FICHIER.
// La mesure et l essai gardent le dossier — ils n ecrivent rien, et c est par eux qu on obtient
// justement la liste a nommer. C est la seule forme ou la commande qui mesure et la commande qui
// ecrit ne different pas que d un mot sur la meme cible.
if (SCELLER && !ESSAI) {
  const dossiers = cibles.filter((c) => existsSync(c) && statSync(c).isDirectory());
  if (dossiers.length) {
    process.stdout.write(JSON.stringify({
      outil: "verifier-jugement", version: "1.0.0", cibles, verdict: "REFUSE",
      mesure: { cibles_dossier: dossiers.length },
      message:
        `${dossiers.length} cible(s) sont des DOSSIERS, et un scellement reel ne prend que des ` +
        "fichiers nommes. Sceller est la declaration « ce livrable est repute bon » : elle se pose " +
        "sur des livrables qu on a lus, pas sur une arborescence dont on ignore la taille. Jouer " +
        "d abord `--sceller --essai` sur le dossier pour obtenir la liste, puis rejouer en nommant " +
        "les fichiers retenus.",
      dossiers,
    }, null, 1) + "\n");
    process.exit(2);
  }
}

if (!cibles.length) {
  process.stdout.write(JSON.stringify({
    outil: "verifier-jugement", verdict: "ERREUR",
    message: "usage : node scripts\\verifier-jugement.mjs <dossier|fichier> [...] [--sceller [--essai|--en-masse]]",
  }, null, 1) + "\n");
  process.exit(2);
}

let scelles = 0, verifies = 0, nonScelles = 0;
const aSceller = [], ecrases = [];
for (const cible of cibles) {
  for (const f of fichiers(cible)) {
    if (!NOMME_LIVRABLE.test(basename(f))) continue;
    const empreinte = empreinteDe(f);
    const sceau = f + SCEAU;
    if (SCELLER) {
      // UN LIVRABLE EN ECART DIT SON ECART AVANT D ETRE ECRASE : c est le cas ou le sceau ment,
      // et l ecraser en silence supprime la seule trace de la divergence.
      if (existsSync(sceau)) {
        try {
          const ancien = JSON.parse(readFileSync(sceau, "utf8"));
          if (ancien && ancien.empreinte && ancien.empreinte !== empreinte) {
            ecrases.push({ fichier: f, avant: ancien.empreinte.slice(0, 12), apres: empreinte.slice(0, 12), scelle_le: (ancien.scelle_le || "?").slice(0, 19) });
          }
        } catch { /* sceau illisible : il sera remplace, et le compte le dit */ }
      }
      // PREMIERE PASSE : on COLLECTE, on n écrit rien. Le garde de masse tombe après la boucle,
      // et un refus qui arrive après l'écriture n'est pas un refus — mesuré le 22/09/2026 :
      // 169 sceaux posés malgré un verdict REFUSE.
      aSceller.push({ fichier: f, sceau, empreinte });
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
    if (j.empreinte !== empreinte && !j.methode) {
      // UN SCEAU SANS METHODE PRECEDE LA NORMALISATION : il a ete calcule sur les octets du poste
      // qui l a pose, et son ecart ne prouve rien sur le contenu du livrable. Le dire, plutot que
      // d accuser le livrable d une modification qui n a peut-etre pas eu lieu.
      add("J-2", "majeur", f,
        "sceau anterieur a la normalisation des fins de ligne (champ `methode` absent) : son " +
        "empreinte porte les octets du poste qui l a pose, pas le contenu portable. Rejouer " +
        "`--sceller` sur ce livrable une fois son contenu relu — c est le geste prevu par D-32.");
    } else if (j.empreinte !== empreinte) {
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

// LE REFUS D UN SCELLEMENT EN MASSE NON DECLARE. Il tombe APRES le parcours, parce que le
// nombre de livrables concernes ne se connait qu une fois la cible lue — et il n ecrit rien
// quand il refuse : en mode essai, la boucle n a touche aucun fichier.
if (SCELLER && !ESSAI && !EN_MASSE && aSceller.length > SEUIL_DE_MASSE) {
  process.stdout.write(JSON.stringify({
    outil: "verifier-jugement", version: "1.0.0", cibles, verdict: "REFUSE",
    mesure: { a_sceller: aSceller.length, deja_en_ecart: ecrases.length },
    message:
      `${aSceller.length} livrable(s) seraient scelles d un coup, et le seuil est de ${SEUIL_DE_MASSE}. ` +
      "Sceller est la declaration « ce livrable est repute bon » : la poser sur un dossier entier " +
      "se declare en toutes lettres. Relancer avec `--essai` pour voir la liste sans rien ecrire, " +
      "ou avec `--en-masse` si c est bien le geste voulu." +
      (ecrases.length ? ` ATTENTION : ${ecrases.length} de ces livrables sont DEJA EN ECART avec leur sceau — les re-sceller effacerait la seule trace de la divergence.` : ""),
    a_sceller: aSceller.slice(0, 40).map((x) => x.fichier),
    ecraserait: ecrases.slice(0, 40),
  }, null, 1) + "\n");
  process.exit(2);
}

// SECONDE PASSE : l'écriture, une fois le garde franchi. `--essai` s'arrête ici, et c'est tout
// ce qui le distingue d'un scellement réel : il a vu exactement la même liste.
if (SCELLER && !ESSAI) {
  for (const { sceau, fichier, empreinte } of aSceller) {
    writeFileSync(sceau, JSON.stringify({
      format: "pilot/jugement@1", fichier: basename(fichier), empreinte, methode: METHODE,
      scelle_le: new Date().toISOString(),
      regle: "règle 5 — une nouvelle version = un nouveau fichier daté, JAMAIS d'écrasement (TF-0523)",
    }, null, 1) + "\n", "utf8");
  }
}
scelles = aSceller.length;

const durs = findings.filter((f) => f.severite === "bloquant" || f.severite === "majeur");
const verdict = SCELLER ? (ESSAI ? "ESSAI" : "SCELLE") : durs.length ? "FAIL" : "PASS";
process.stdout.write(JSON.stringify({
  outil: "verifier-jugement", version: "1.0.0", cibles, verdict,
  mesure: SCELLER ? { scelles, ecraserait: ecrases.length } : { verifies, non_scelles: nonScelles, ecarts: durs.length },
  // L ESSAI REND LA LISTE A NOMMER. Depuis D-29 un scellement reel refuse un dossier : l essai
  // est donc la voie par laquelle on obtient les chemins a passer en clair. Une voie prescrite
  // qui ne rend pas ce qu elle prescrit de reutiliser n est pas une voie.
  ...(SCELLER && ESSAI ? { a_sceller: aSceller.map((x) => x.fichier), ecraserait: ecrases } : {}),
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
