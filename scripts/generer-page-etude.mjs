#!/usr/bin/env node
/**
 * generer-page-etude.mjs — LA PAGE HOMONYME D'UN LIVRABLE REMIS À UN HUMAIN.
 *
 * ============================================================================================
 * POURQUOI (TF-0923 volet 3, décision humaine D-3 option (a) du 16/09/2026)
 * ============================================================================================
 *
 * LA DOCTRINE ÉTAIT ÉCRITE ET JOUÉE PAR PERSONNE. `references\RUN-MANDAT.md` dit depuis le
 * 07/09/2026 (TF-0895) que toute proposition remise à un humain se remet AUSSI en page autoportante,
 * et `references\RUN-CONSEIL.md` le répète. Le retour fondateur est une phrase du destinataire :
 * « aucun fichier HTML n'a été généré […] il doit faire partie intégrante de la proposition ».
 *
 * CE QUE LA MESURE A MONTRÉ, et c'est ce qui a fait poser la question plutôt qu'écrire la règle :
 * cinq études d'opportunité postérieures à la doctrine n'avaient aucune page. Deux lectures
 * étaient possibles — la doctrine n'est pas appliquée, ou elle ne visait pas les études. La
 * décision humaine a tranché la PREMIÈRE : une étude d'opportunité porte en tête son audience, et
 * cette audience est « le pilote de l'écosystème, qui décide des mandats ». *Un document dont le
 * lecteur nommé est celui qui décide est remis à un humain*, quel que soit le mot de son titre.
 *
 * POURQUOI UN GÉNÉRATEUR ET PAS CINQ PAGES ÉCRITES À LA MAIN. Cinq pages écrites à la main sont
 * cinq dettes : la sixième étude repartirait sans page, et chaque correction de la source ferait
 * diverger sa page en silence. Le générateur rend la règle TENABLE — une commande, et la page suit
 * sa source. Il ne porte aucune valeur de marque : la coquille et les jetons sont LUS dans le socle
 * `digit-ai-page-html` par `scripts\lib-socle-page.mjs` (TF-1317, TF-1324), et le rendu markdown
 * vient de `scripts\lib-vue-html.mjs`.
 *
 * DÉTERMINISTE : même source, même page, octet pour octet. Aucune date générée — l'indice vient du
 * nom du fichier source, et le sceau est l'empreinte de la source normalisée. Une page régénérée
 * sans que sa source ait bougé ne produit aucun diff, donc aucun bruit au registre.
 *
 * Usage :
 *   node scripts\generer-page-etude.mjs <source.md> [<source.md>…]   → écrit la page homonyme
 *   node scripts\generer-page-etude.mjs --dossier output\03-etudes [--depuis 20260907]
 *       → les seuls livrables de rôle proposition/étude/trajectoire/conseil, datés au plus tôt
 *         du jour où la doctrine est entrée ; les deux bornes se désarment (`--depuis ""`)
 *   node scripts\generer-page-etude.mjs --self-test
 * Exit : 0 · 1 défaut de self-test · 2 argument invalide.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { lireSource, mdVersHtml, esc } from "./lib-vue-html.mjs";
import {
  socleDePage, socleAbsent, lireAsset as lireAssetDuSocle, chargerPoseur,
  armerTableaux, enChapitres, coquilleDuSocle, replierTableaux, cablerComposants as cablerComposantsDuSocle,
} from "./lib-socle-page.mjs";
import { cheminSkillsInstalles } from "./lib-config-installee.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));

/** L'indice R-4 d'un nom de fichier : « …- AAAAMMJJx.md » ou « AAAAMMJJ-objet.md ». */
export function indiceDuNom(nom) {
  const base = basename(String(nom)).replace(/\.[a-z0-9]+$/i, "");
  const fin = /(\d{8}[a-z]?)$/.exec(base.split(" - ").pop().trim());
  if (fin) return fin[1];
  const tete = /^(\d{8})[-_]/.exec(base);
  return tete ? `${tete[1]}a` : null;
}

/**
 * LES RÔLES QUI PORTENT UNE PAGE HOMONYME, ET LA DATE D'ENTRÉE DE LA DOCTRINE — déclarés ICI,
 * lus ailleurs (TF-0923 volet a, 20/09/2026).
 *
 * `references\RUN-MANDAT.md` (pas 5) et `references\RUN-CONSEIL.md` (C5) disent depuis le
 * 07/09/2026 (TF-0895) que toute PROPOSITION remise à un humain se remet AUSSI en page HTML
 * autoportante ; la décision humaine D-3 (a) du 16/09 y a joint les études, trajectoires et
 * conseils — *un document dont le lecteur nommé est celui qui décide est remis à un humain*.
 *
 * `oracles\oracle-conformite-projet.mjs` les LIT pour refuser un tel document sans sa page. Une
 * liste recopiée là-bas se périmerait au premier rôle ajouté ici, EN SILENCE — c'est la classe
 * exacte que ce dépôt refuse partout ailleurs (TF-0151, TF-0367).
 */
export const ROLES_PAGE_HOMONYME = /^(proposition|trajectoire|etude|conseil)\b/i;
export const DOCTRINE_PAGE_HOMONYME = "20260907";

/**
 * L'objet R-4 d'un nom de livrable, désaccentué et en minuscules — la part du nom qui porte le
 * rôle. Deux formes de nom sont admises : la forme R-4 `<Projet> - <Objet> - AAAAMMJJ<indice>`,
 * et la forme dérogatoire des études du pilot `AAAAMMJJ-objet`.
 */
export function objetDuNom(nom) {
  const base = basename(String(nom)).replace(/\.[a-z0-9]+$/i, "");
  const parts = base.split(" - ");
  const objet = parts.length >= 3 ? parts.slice(1, -1).join(" ")
    : (/^\d{8}[-_](.+)$/.exec(base) || [, base])[1].replace(/-/g, " ");
  return objet.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Le rôle qui impose une page homonyme, ou `null` si le nom n'en porte aucun. */
export function rolePageHomonyme(nom) {
  const m = ROLES_PAGE_HOMONYME.exec(objetDuNom(nom));
  return m ? m[1].toLowerCase() : null;
}

/**
 * Le TITRE et la DESCRIPTION d'une étude. Le titre est le premier `# ` de la source ; la
 * description est la première phrase de prose qui suit, tronquée — jamais inventée, jamais vide :
 * une page sans description sort du socle par A4, et une description devinée ment au moteur de
 * recherche comme au lecteur.
 */
export function enTete(corps) {
  const titre = (/^#\s+(.+)$/m.exec(corps) || [, ""])[1].trim();
  const apres = corps.slice(corps.indexOf(titre) + titre.length);
  const phrase = (apres.split(/\r?\n/).map((l) => l.trim())
    .find((l) => l && !/^[#>|*-]/.test(l) && !/^[a-z_]+\s*:/.test(l)) || "").replace(/\s+/g, " ");
  return { titre, description: phrase.slice(0, 180) || titre.slice(0, 180) };
}

/**
 * UNE NOTE D'AUTEUR DÉCRIT UNE COLONNE, ET C'EST L'AUTEUR QUI L'ÉCRIT (16/09/2026).
 *
 * LE FAIT : la règle L3 du socle exige qu'une colonne CALCULÉE publie sa formule, et elle
 * reconnaît une telle colonne à son NOM — un vocabulaire fermé où « Classement » figure. Une étude
 * du parc porte une colonne « Classement » qui n'ordonne rien et ne calcule rien : elle étiquette
 * la phase où chaque grief aurait été attrapé. *Une règle qui lit un nom et suppose une mécanique
 * accuse un document juste* — c'est la classe exacte corrigée le matin même sur le juge des
 * restitutions, prise par l'autre bout.
 *
 * DEUX SORTIES ÉTAIENT POSSIBLES ET UNE SEULE EST HONNÊTE. Renommer la colonne du livrable pour
 * satisfaire l'oracle laisserait un contrôle de forme dicter le vocabulaire d'un document — le
 * contournement que TF-0987 a payé et supprimé. Inventer une formule pour une colonne qui n'en a
 * pas serait pire. Reste la vraie : *que l'auteur DISE ce que sa colonne est*, et que la page relie
 * la note à l'en-tête par `aria-describedby`, ce que la règle demande.
 *
 * LA CONVENTION, tenue par ce seul mécanisme et lisible dans la source en Markdown : une citation
 * placée SOUS un tableau et ouverte par le nom d'une colonne en gras décrit cette colonne.
 *
 *     > **Classement** : la phase où le grief aurait été attrapé — une étiquette, pas un calcul.
 *
 * Elle sert le lecteur du Markdown autant que celui de la page : la note est au même endroit pour
 * les deux, et rien n'existe que dans le rendu.
 */
export function decrireColonnes(html) {
  let n = 0;
  const notes = [];
  // Les citations qui ouvrent sur un nom en gras : elles deviennent les descriptions candidates.
  // TF-1443 (28/09/2026, retour Produit-78 20260928b RP-7) : le motif exigeait 2 caractères au
  // moins entre les balises `strong` — une colonne dont le nom tient en UNE lettre (« X », un
  // réseau) gardait sa note sous le tableau, mais son en-tête ne recevait jamais `aria-describedby`,
  // contrairement aux 39 autres en-têtes de la même page. Rien dans la convention (une citation
  // ouverte par le nom en gras d'une colonne) n'exige une longueur minimale : le nom est celui que
  // l'auteur a choisi, pas celui que le motif tolère.
  const avecId = html.replace(/<blockquote><p><strong>([^<]{1,40})<\/strong>\s*(:|&nbsp;:)/g, (tout, nom, sep) => {
    n += 1;
    const id = `col-${n}`;
    notes.push({ id, nom: nom.trim() });
    return `<blockquote id="${id}"><p><strong>${nom}</strong> ${sep}`;
  });
  if (!notes.length) return avecId;
  // Chaque en-tête dont le libellé est celui d'une note pointe vers elle. Le lien est posé sur
  // TOUS les en-têtes homonymes : une même colonne peut revenir dans deux tableaux d'un document,
  // et la note vaut pour les deux — la répéter serait du bruit.
  return avecId.replace(/<th scope="col">([^<]*)<\/th>/g, (tout, libelle) => {
    const note = notes.find((x) => x.nom.toLowerCase() === libelle.trim().toLowerCase());
    return note ? `<th scope="col" aria-describedby="${note.id}">${libelle}</th>` : tout;
  });
}

/**
 * UNE ÉTUDE LONGUE POSE SON SOMMAIRE, ET LE SOMMAIRE POINTE VERS DE VRAIS CHAPITRES (TF-1437,
 * 28/09/2026, retour Produit-78 20260928a RP-3).
 *
 * LE FAIT : `check_html.py` du socle avertit L6 (« aucun sommaire détecté ») sur une étude de 17
 * chapitres, et sa règle L25 exige, au-delà de trois `<h2>`, un `<nav aria-label="Sommaire">` (ou
 * `nav.toc`) listant CHAQUE chapitre, chacun avec une ancre vers un `id` réel et une annonce
 * `.toc-d` d'au moins 12 caractères (L6). Le socle fournit déjà la position collante
 * (`nav.toc.colle`, `boilerplate.html`) ; personne ne posait le MARQUAGE qui l'active.
 *
 * L'ANNONCE `.toc-d` NE PEUT PAS SE CONTENTER DU TITRE : le gabarit d'étude porte des titres
 * courts et réels (« 5. Verdict » ne fait que 10 caractères) — les tronquer serait inventer une
 * contrainte de longueur sur la PROSE de l'auteur pour satisfaire un contrôle de forme, exactement
 * le contournement que ce fichier refuse ailleurs (cf. `decrireColonnes`). L'annonce porte donc la
 * position du chapitre dans le sommaire (« Chapitre 2 sur 5 »), toujours ≥ 15 caractères dès que le
 * sommaire existe (il ne s'affiche qu'à partir de 4 chapitres) : un fait vrai, pas un remplissage.
 */
/**
 * UN CHAPITRE EST UNE VRAIE SECTION DU DOM, PAS UN TITRE SEUL (TF-1566, 02/10/2026).
 *
 * LE FAIT. `check_html.py` (règle L7) exige qu'un élément `.ch-apprend` soit DESCENDANT du nœud
 * que le sommaire cible — et un `id` posé sur le seul `<h2>` (version antérieure de cette
 * fonction) ne porte jamais ce qui le suit : en HTML, un `<h2>` et les paragraphes qui viennent
 * après sont FRÈRES, jamais parent et enfant. Toute page portant un sommaire (TF-1437) échouait
 * donc L7 par construction, quel que soit le contenu du chapitre : mesuré le 01/10/2026, 16
 * échecs sur l'étude d'un produit, 9 sur une étude du pilot régénérée — et le self-test de ce
 * générateur restait vert parce qu'il ne jouait jamais `check_html.py` (classe
 * `fixture-jugee-par-son-seul-oracle`).
 *
 * LA CORRECTION. Chaque chapitre devient un `<section id="…">` qui enveloppe son `<h2>` et tout
 * ce qui le suit jusqu'au chapitre suivant ; l'`id` QUITTE le `<h2>` pour la section — le poser
 * sur les deux ferait gagner le DERNIER rencontré dans `index_ids` du socle (un dict Python),
 * jamais la section. Le découpage en « chap lire » (largeur de lecture, 1080 px, TF-1239) doit
 * rester NICHÉ dans cette section plutôt que la couper en deux : un essai séparé — poser
 * `enChapitres` du socle APRÈS ce balisage — casse la section du premier chapitre en deux dès
 * qu'un tableau y apparaît (`enChapitres` referme son `section.chap.lire` sur le tableau, sans
 * savoir qu'un `<section id>` l'enveloppe), preuve sur l'étude réelle du 19/09/2026 qui porte un
 * tableau au chapitre 2. Fusionner les deux passes en une seule — celle-ci — ferme ce trou :
 * chaque frontière de chapitre referme explicitement son `<section id>`, jamais un marqueur de
 * tableau qui n'a aucune idée d'où il vit.
 *
 * LE CHAPEAU `.ch-apprend` EST ÉCRIT, JAMAIS GÉNÉRÉ (L7 du socle le refuse explicitement — un
 * chapeau généré serait le défaut fondateur de la règle, TF-0423). Convention au même patron que
 * `decrireColonnes` ci-dessus : une citation Markdown (`> …`) qui ouvre un chapitre — RIEN entre
 * le `## ` et elle — en devient le chapeau, convertie en `<p class="ch-apprend">`. Un chapitre qui
 * n'en porte pas reste SANS chapeau, à bon droit : en inventer un depuis le seul titre serait
 * exactement le remplissage que la règle existe pour refuser.
 */
export function identifierChapitres(html) {
  const lignes = html.split("\n");
  const pris = new Set();
  const chapitres = [];
  const sortie = [];
  let prose = [];
  let chapitre = null; // { id, lignes } hors de tout chapitre : `null`, avant le premier `## `.

  const fermerProse = () => {
    if (!prose.length) return;
    const bloc = ['<section class="chap lire" data-mesure-lecture>', ...prose, "</section>"];
    (chapitre ? chapitre.lignes : sortie).push(...bloc);
    prose = [];
  };
  const fermerChapitre = () => {
    fermerProse();
    if (!chapitre) return;
    sortie.push(`<section id="${chapitre.id}">`, ...chapitre.lignes, "</section>");
    chapitre = null;
  };

  for (const l of lignes) {
    const h2 = /^<h2>([\s\S]*?)<\/h2>$/.exec(l.trim());
    if (h2) {
      fermerChapitre();
      // Le texte affiché est déjà échappé par inline() (esc() puis balises) : on ne le rééchappe
      // jamais, et on retire les balises inline (code, strong, lien) pour n'en garder que le
      // texte, qui sert À LA FOIS d'ancre (normalisée) et de libellé affiché dans le sommaire.
      const texte = h2[1].replace(/<[^>]+>/g, "").trim();
      const base = (texte || "chapitre").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "chapitre";
      let id = base, suffixe = 2;
      while (pris.has(id)) { id = `${base}-${suffixe}`; suffixe += 1; }
      pris.add(id);
      chapitres.push({ id, texte });
      chapitre = { id, lignes: [l] };
      continue;
    }
    // Un tableau, son compteur et une figure sont des FRÈRES de la prose, à l'intérieur du
    // chapitre courant — même règle de partage qu'`enChapitres` du socle, reprise ici parce
    // qu'elle doit désormais composer avec la frontière de chapitre (cf. commentaire ci-dessus).
    if (/^<div class="defile">/.test(l) || /^<p class="tf-count"/.test(l) || /^\s*<figure/.test(l)) {
      fermerProse();
      (chapitre ? chapitre.lignes : sortie).push(l);
      continue;
    }
    prose.push(l);
  }
  fermerChapitre();
  fermerProse(); // de la prose hors de tout chapitre (avant le premier `## `, ou page sans `## `).

  const dote = sortie.join("\n").replace(
    /(<section id="[^"]+">\s*<h2>[\s\S]*?<\/h2>\s*(?:<section class="chap lire" data-mesure-lecture>\s*)?)<blockquote><p>([\s\S]*?)<\/p><\/blockquote>/g,
    (tout, avant, texteChapeau) => `${avant}<p class="ch-apprend">${texteChapeau}</p>`,
  );
  return { html: dote, chapitres };
}

/** L25 du socle : « au-delà de trois chapitres », donc le sommaire se pose DÈS le 4e. */
export const SEUIL_SOMMAIRE = 4;

/**
 * Le style du sommaire, posé UNE fois, seulement quand il est câblé.
 *
 * Espacements à l'échelle 4 pt (T3 d'`oracle-tokens`, TF-1566, 02/10/2026) : les valeurs
 * d'origine — `gap:6px 18px`, `gap:2px` — n'étaient pas des multiples de 4 et faisaient échouer
 * T3 sur `nav.toc` de toute page portant un sommaire, à chaque régénération.
 *
 * `nav.barre` : seconde navigation, compacte et collante EN PERMANENCE, sous 900 px seulement
 * (cf. commentaire de `sommaireLateral`).
 */
const STYLE_SOMMAIRE = `  <style>
    nav.toc{display:flex;flex-wrap:wrap;gap:8px 20px;margin:0 0 20px;padding:12px 16px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm)}
    nav.toc a{display:flex;flex-direction:column;gap:4px;text-decoration:none;color:var(--ink)}
    nav.toc a:hover{text-decoration:underline}
    nav.toc a strong{font-size:.85rem;font-weight:600}
    .toc-d{color:var(--muted);font-size:.72rem;font-weight:400}
    .ch-apprend{margin:0 0 16px;color:var(--muted)}
    nav.barre{display:none}
    @media (max-width:900px){
      nav.barre{display:flex;gap:16px;overflow-x:auto;position:sticky;top:var(--hh);z-index:15;background:var(--bg);border-bottom:1px solid var(--line);padding:8px 16px;margin:0 0 20px}
      nav.barre a{flex:0 0 auto;white-space:nowrap;text-decoration:none;color:var(--ink);font-size:.8rem;font-weight:600}
      nav.barre a:hover{text-decoration:underline}
    }
  </style>
`;

/**
 * Le sommaire du socle, prêt à insérer en tête de `<main>` — chaîne vide sous le seuil (page
 * courte, un sommaire y serait du bruit, cf. commentaire de `identifierChapitres`).
 *
 * DEUX NAVIGATIONS, UNE SEULE TOUJOURS VISIBLE AU DÉFILEMENT (TF-1566, 02/10/2026, patron TF-1145).
 * `nav.toc.colle` du socle repasse `position: static` sous 900 px (`boilerplate.html`) — à bon
 * droit : une bande de cartes annotées, large, n'a rien à faire collée sur un écran de poche. Mais
 * alors AUCUNE navigation ne reste dans la fenêtre au défilement, et `render_page.py` le refuse
 * (famille `sommaire_perdu`) : mesuré le 01/10/2026 sur l'étude du pilot du 19/09 régénérée, aux
 * trois largeurs ≤ 900 px (900, 768, 390). `nav.barre` est la seconde navigation que TF-1145
 * prescrit pour ce cas — compacte (titres seuls, sans l'annonce `.toc-d`), collante EN PERMANENCE
 * sous 900 px (la media query de `STYLE_SOMMAIRE`), invisible au-delà pour ne pas doubler la bande
 * déjà collante du bureau. `check_html.py` ne lit que le PREMIER `nav` pour L6/L7/L10 : `nav.barre`
 * est donc posée APRÈS `nav.toc` dans le document, pour ne jamais lui voler ce rôle.
 */
export function sommaireLateral(chapitres) {
  if (chapitres.length < SEUIL_SOMMAIRE) return "";
  const total = chapitres.length;
  const entrees = chapitres.map(({ id, texte }, i) =>
    `<a href="#${id}"><strong>${texte}</strong> <span class="toc-d">Chapitre ${i + 1} sur ${total}</span></a>`).join("\n      ");
  const barre = chapitres.map(({ id, texte }) => `<a href="#${id}">${texte}</a>`).join("");
  return `<nav class="toc colle" aria-label="Sommaire">\n      ${entrees}\n    </nav>\n`
    + `<nav class="barre" aria-label="Sommaire permanent">${barre}</nav>\n`;
}

// ── LA COQUILLE SE DÉRIVE DU SOCLE, ET LE SOCLE SE CHERCHE LÀ OÙ IL EST ─────────────────────────
//
// TF-1317 (décision humaine D-6 (b) du 22/09/2026) a fait dériver cette page du gabarit du socle
// `digit-ai-page-html` : trois conventions du socle manquaient à la coquille écrite à la main — la
// bascule de thème, le repli des tableaux en cartes, les composants posés sous marqueur scellé.
//
// Le 23/09/2026 (TF-1324 et TF-1321, décisions humaines D-14 (a) et D-13 (a)), la coquille et ses
// pièces ont quitté ce fichier pour `scripts\lib-socle-page.mjs`, que les générateurs d'architecture
// et de modèle de données emploient aussi. Deux choses y ont changé, et elles se lisent là-bas :
//   · le socle se cherche dans la copie INSTALLÉE, puis dans sa SOURCE sous FORGE_ROOT, puis dans le
//     dépôt frère du pilot — le circuit d'intégration hébergé ne porte que la source, et ce
//     générateur y levait « gabarit du socle introuvable » ;
//   · un socle introuvable se DIT, chemins cherchés compris : le self-test se déclare SANS OBJET et
//     la ligne de commande sort en 2, au lieu d'une trace de pile.
// Les fonctions déplacées restent exportées d'ici : leurs consommateurs n'ont rien à changer.
export { SEUIL_FILTRE, armerTableaux, enChapitres, coquilleDuSocle, replierTableaux } from "./lib-socle-page.mjs";

/** Lit un asset du socle, résolu À L'APPEL (TF-1297) : absent, chaîne vide, et l'appelant le DIT. */
export function lireAsset(nom, racine = socleDePage().assets) {
  return lireAssetDuSocle(nom, racine);
}

/** Le poseur de composants DU SOCLE, chargé une fois. `null` si le socle est introuvable. */
const POSEUR = await chargerPoseur(socleDePage().assets);

/** Pose la barre de recherche et les composants du socle, avec le poseur chargé par défaut. */
export function cablerComposants(html, ids, poseur = POSEUR) {
  return cablerComposantsDuSocle(html, ids, poseur);
}

/** L'indice R-4 de la page : celui du nom, sinon `verifie_le` de la source, sinon le jour. */
function indiceDeLaPage(front, version) {
  const d = String((front && (front.verifie_le || front.date)) || "").match(/(\d{4})-(\d{2})-(\d{2})/);
  return version || (d ? `${d[1]}${d[2]}${d[3]}a` : new Date().toISOString().slice(0, 10).replaceAll("-", "") + "a");
}


/** Rend le HTML d'une étude. Pur : aucune écriture ; l'heure n'intervient que si la source n'est pas datée. */
export function pageEtude(texteSource, nomSource, { gabarit = lireAsset("boilerplate.html"), poseur = POSEUR } = {}) {
  const { front, corps } = lireSource(texteSource);
  const { titre, description } = enTete(corps);
  // TF-1437 puis TF-1566 : `identifierChapitres` pose désormais À LA FOIS les sections de chapitre
  // (id, chapeau) ET le découpage en largeur de lecture — les deux doivent composer dans UNE
  // passe, cf. son commentaire. Le sommaire, lui, reste HORS des chapitres : un frère du texte,
  // pas un paragraphe de lecture (cf. lib-socle-page.mjs).
  const { html: corpsDote, chapitres } = identifierChapitres(mdVersHtml(corps.replace(/^#\s+.+$\r?\n/m, "")));
  const sommaire = sommaireLateral(chapitres);
  const brut = coquilleDuSocle({
    gabarit,
    titre,
    description,
    indice: indiceDeLaPage(front, indiceDuNom(nomSource) || undefined),
    corpsHtml: sommaire + corpsDote,
    // TF-1442 : le contenu du marquage TR2 est LU dans le frontmatter de la source, jamais câblé ici.
    marqueurIA: front.assistant,
  });
  const avecStyleSommaire = sommaire ? brut.replace("</head>", `${STYLE_SOMMAIRE}</head>`) : brut;
  const { html, ids } = armerTableaux(decrireColonnes(avecStyleSommaire));
  return cablerComposants(replierTableaux(html), ids, poseur);
}

/** Écrit la page homonyme d'une source. Rend le chemin écrit. */
export function ecrirePage(chemin) {
  const texte = readFileSync(chemin, "utf8");
  const cible = chemin.replace(/\.md$/i, ".html");
  writeFileSync(cible, pageEtude(texte, chemin));
  return cible;
}

// ── LA RECETTE ───────────────────────────────────────────────────────────────────────────────

const SOURCE_ESSAI = `---
verifie_le: 2026-09-16
---

# Étude d'opportunité — un sujet d'essai — 20260916a

Audience : le pilote de l'écosystème, qui décide des mandats.

## Ce qui est mesuré

| Condition | Rappel | Retenu |
|---|---|---|
| référence | 2/9 | non |

- un point mesuré ;
- un second point, avec \`un identifiant\` cité.

1. un geste numéroté ;
2. un second geste numéroté.

> Une citation de référence.
`;

// LA SOURCE QUI TRAVERSE LES ASSETS DU SOCLE, ET POURQUOI IL EN FAUT UNE SECONDE (22/09/2026).
// `SOURCE_ESSAI` ne porte qu'UNE ligne de données : `armerTableaux` n'arme donc aucune table,
// `cablerComposants` sort à sa première ligne, et `lireAsset` n'est JAMAIS appelé. Le self-test
// rendait 7/7 pendant que la ligne de commande levait `ReferenceError` au premier appel réel, sur
// tous les postes. *Une recette qui ne traverse pas la seule ligne capable d'échouer ne mesure
// pas le programme : elle mesure le chemin qu'on avait déjà en tête.* Ce second essai franchit
// `SEUIL_FILTRE`, donc il câble les trois assets du socle et il échoue si leur lecture casse.
const SOURCE_ESSAI_TABLE_LONGUE = `---
role: essai
---

# Étude d'opportunité — un tableau long — 20260916b

Audience : le pilote de l'écosystème, qui décide des mandats.

## Ce que le tableau porte

Ce chapitre existe pour franchir le seuil de filtrage et câbler les composants du socle.

| Ligne | Valeur |
|---|---|
| une | 1 |
| deux | 2 |
| trois | 3 |
| quatre | 4 |
| cinq | 5 |
| six | 6 |
| sept | 7 |
| huit | 8 |
| neuf | 9 |
`;

// TF-1437 — LE SEUIL SE PROUVE AUX DEUX BORDS : trois chapitres et quatre, jamais un seul côté.
// Une recette qui ne joue QUE le côté « avec sommaire » ne prouverait rien : une règle sans
// condition (toujours vrai) la passerait aussi. `SOURCE_ESSAI_SOMMAIRE` porte quatre `##` de
// premier niveau — le seuil exact du socle (L25 : « au-delà de trois ») — et l'un d'eux, « 5.
// Verdict », est volontairement COURT (10 caractères) : l'annonce .toc-d ne peut donc pas se
// contenter du texte du titre (cf. commentaire de `sommaireLateral`).
//
// TF-1566 — LE CHAPEAU `.ch-apprend` SE PROUVE AUSSI AUX DEUX BORDS. Le chapitre 1 et le
// chapitre 3 ouvrent par une citation : elle doit devenir leur chapeau. Le chapitre 5 (« Verdict »)
// n'en porte aucune : il doit rester SANS `.ch-apprend`, jamais un chapeau inventé depuis son
// titre (L7 le refuse). Le chapitre 2 porte un TABLEAU au milieu de sa prose, sans chapeau : c'est
// le cas qui a cassé l'essai d'une passe séparée (identifierChapitres puis enChapitres) sur
// l'étude réelle du 19/09/2026 — le tableau refermait la section du CHAPITRE à la place de celle
// de la PROSE, laissant le texte qui suit hors de `<section id="non-recouvrement">`.
const SOURCE_ESSAI_SOMMAIRE = `---
role: essai
---

# Étude d'opportunité — un sommaire d'essai — 20260916c

Audience : le pilote de l'écosystème, qui décide des mandats.

## 1. Partition du problème

> Ce chapitre découpe le sujet en questions précises et mesurables, contre lesquelles chaque option du verdict se lit une à une.

Contenu du premier chapitre.

## 2. Non-recouvrement

Avant le tableau, ce que l'existant couvre déjà.

| Colonne | Valeur |
|---|---|
| une | 1 |

Après le tableau, ce que l'existant laisse ouvert — cette phrase doit rester DANS la section du chapitre.

## 3. État de l'art

> Ce chapitre relève les sources datées qui fondent la conception retenue, chacune avec la leçon exacte qu'elle en tire.

Contenu du troisième chapitre.

## 5. Verdict
Contenu du quatrième chapitre, au titre volontairement court, sans chapeau écrit.
`;

const SOURCE_ESSAI_SANS_SOMMAIRE = `---
role: essai
---

# Étude d'opportunité — sans sommaire — 20260916d

Audience : le pilote de l'écosystème, qui décide des mandats.

## 1. Partition du problème
Contenu.

## 2. Non-recouvrement
Contenu.

## 3. État de l'art
Contenu.
`;

/**
 * LES DEUX CONTRÔLES DU SOCLE SE JOUENT SUR UNE ÉTUDE RÉELLE, PAS SEULEMENT SUR DES FIXTURES EN
 * MÉMOIRE (TF-1566, 02/10/2026).
 *
 * LE FAIT : le self-test de ce générateur rendait 15/15 PASS pendant que `check_html.py` refusait
 * les pages réellement écrites — 16 échecs L7 sur une étude de produit, 9 sur une étude du pilot
 * régénérée le 01/10/2026, et `render_page.py` y refusait `sommaire_perdu` aux trois largeurs
 * ≤ 900 px. Aucune fixture en mémoire ne portait de sommaire ET un vrai tableau au milieu d'un
 * chapitre : le défaut vivait exactement dans cet angle mort (classe
 * `fixture-jugee-par-son-seul-oracle`, récidive de TF-0823 et consorts).
 *
 * LA PARADE : regénérer une étude RÉELLE du dépôt — `output\03-etudes\` du 19/09/2026, neuf
 * chapitres, un tableau au chapitre 2 — et jouer dessus les deux scripts du socle, comme un
 * lecteur les jouerait. Résolution identique à `oracle-gabarits-documents.mjs` : la copie
 * INSTALLÉE d'abord, puis la source sous le dépôt frère `digit-ai-forge-agents`.
 *
 * SKIP MOTIVÉ, JAMAIS UN VERT DE COMPLAISANCE (même doctrine que `verifier-rendu-instances.mjs`) :
 * sans python ou sans l'un des deux scripts, ce SEUL cas se déclare NON JOUÉ — motivé, nommé — et
 * ne compte ni pour ni contre le self-test ; les 21 autres cas, eux, jugent le reste normalement.
 */
const CANDIDATS_CHECK_HTML = [
  join(cheminSkillsInstalles(), "digit-ai-page-html", "scripts", "check_html.py"),
  join(ICI, "..", "..", "digit-ai-forge-agents", ".claude", "skills", "digit-ai-page-html", "scripts", "check_html.py"),
];
const CANDIDATS_RENDER_PAGE = [
  join(cheminSkillsInstalles(), "digit-ai-page-html", "scripts", "render_page.py"),
  join(ICI, "..", "..", "digit-ai-forge-agents", ".claude", "skills", "digit-ai-page-html", "scripts", "render_page.py"),
];
const CHECK_HTML = CANDIDATS_CHECK_HTML.find(existsSync) || null;
const RENDER_PAGE = CANDIDATS_RENDER_PAGE.find(existsSync) || null;
const PYTHON = ["python", "python3", "py"].find((bin) => {
  const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
});
const ETUDE_REELLE = join(ICI, "..", "output", "03-etudes",
  "20260919-etude-opportunite-plan-d-amelioration-post-audit.md");

/** Joue `check_html.py` et `render_page.py` sur la page régénérée de l'étude réelle. */
function jouerControlesDuSocleSurUneEtudeReelle(nonJuge) {
  if (!CHECK_HTML || !RENDER_PAGE || !PYTHON) {
    nonJuge.push("les deux contrôles du socle sur une étude réelle : " +
      (!PYTHON ? "aucun interpréteur python" : `check_html.py ${CHECK_HTML ? "trouvé" : "introuvable"}, render_page.py ${RENDER_PAGE ? "trouvé" : "introuvable"}`) +
      " — ce cas n'a PAS tourné, il ne compte ni pour ni contre le self-test");
    return;
  }
  if (!existsSync(ETUDE_REELLE)) {
    nonJuge.push(`les deux contrôles du socle sur une étude réelle : ${ETUDE_REELLE} introuvable — ce cas n'a PAS tourné`);
    return;
  }
  const pageReelle = ecrirePage(ETUDE_REELLE);
  const casse = [];

  const rCheck = spawnSync(PYTHON, ["-X", "utf8", CHECK_HTML, pageReelle],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  const sortieCheck = (rCheck.stdout || "") + (rCheck.stderr || "");
  const echecsL7 = sortieCheck.split("\n").filter((l) => /\bL7\b.*chapeau/.test(l));
  if (echecsL7.length)
    casse.push(`check_html.py L7 (chapeau .ch-apprend) : ${echecsL7.length} échec(s) sur l'étude réelle — ` +
      echecsL7[0].trim().slice(0, 140));

  const rRender = spawnSync(PYTHON, ["-X", "utf8", RENDER_PAGE, pageReelle,
    "--widths", "390,768,900", "--output", "json"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  let rapport = null;
  try { rapport = JSON.parse((rRender.stdout || "").trim()); } catch { /* traité juste après */ }
  if (!rapport) {
    casse.push("render_page.py n'a rendu aucun JSON lisible sur l'étude réelle — " +
      (rRender.stderr || "").split("\n")[0].slice(0, 160));
  } else {
    for (const largeur of Object.keys(rapport.breakpoints || {})) {
      const perdu = rapport.breakpoints[largeur]?.issues?.sommaire_perdu || [];
      if (perdu.length)
        casse.push(`render_page.py sommaire_perdu à ${largeur}px sur l'étude réelle : ${perdu.length} constat(s) — ` +
          "nav.barre devrait rester collante et visible à cette largeur");
    }
  }

  return casse;
}

function selfTest() {
  // SANS OBJET DÉCLARÉ, JAMAIS UNE TRACE DE PILE (TF-1324, D-14 (a) du 23/09/2026). Sans socle, la
  // page ne peut pas être dérivée, donc rien de ce qui suit ne peut être jugé. Le résumé NOMME
  // l'absence et les chemins cherchés, sort en 0, et ne porte aucun compte de cas : le cliquet du
  // harnais le rend alors NON JUGÉ plutôt que de voir des cas disparaître — même contrat que le
  // banc de coquille. Un faux vert serait pire : il affirmerait des cas qui n'ont pas été joués.
  const socle = socleDePage();
  if (!socle.assets || !POSEUR) {
    console.log(`Self-test generer-page-etude : SANS OBJET — ${socle.assets ? "poseur de composants du socle introuvable sous " + socle.assets : socleAbsent(socle)} ; aucun cas joué, aucun cas compté`);
    return 0;
  }
  const dir = mkdtempSync(join(tmpdir(), "page-etude-"));
  const casse = [];
  const f = join(dir, "20260916-etude-opportunite-essai.md");
  writeFileSync(f, SOURCE_ESSAI, "utf8");

  const cible = ecrirePage(f);
  if (!existsSync(cible)) casse.push("la page homonyme n'est pas écrite à côté de sa source");
  const html = readFileSync(cible, "utf8");

  // 1. AUTOPORTANTE — aucune requête réseau, c'est la règle A1 du socle et la raison d'être du format.
  if (/<(script|link|img)[^>]+(src|href)=["']https?:/i.test(html))
    casse.push("la page charge une ressource distante : elle n'est plus autoportante (A1)");
  // 2. LE TITRE PORTE L'INDICE DE LA SOURCE, jamais la date du jour : deux révisions du même jour
  //    porteraient sinon le même nom à l'écran (A4, leçon de TF-0556).
  if (!/<title>[^<]*20260916a[^<]*<\/title>/.test(html))
    casse.push("le titre de la page ne porte pas l'indice daté de sa source — deux révisions du même jour seraient indiscernables");
  // 3. LE CONTENU EST RENDU, pas recopié en bloc : le tableau devient un tableau, la puce une puce.
  // Le tableau porte désormais la classe de repli du socle : on cherche la balise, pas `<table>` nu.
  // TF-1436 : une liste NUMÉROTÉE (`<ol>`) est de la même famille — sans ce cas, une liste à puces
  // verte n'aurait rien dit d'une liste numérotée sortie en un seul paragraphe.
  if (!/<table\b/.test(html) || !/<li>/.test(html) || !/<blockquote>/.test(html) || !/<ol>/.test(html))
    casse.push("le corps de l'étude n'est pas rendu (tableau, liste à puces, liste numérotée ou citation manquants)");
  // 4. LE TITRE DE NIVEAU 1 N'EST PAS DOUBLÉ — la coquille le pose, le corps ne doit pas le répéter.
  if ((html.match(/<h1[ >]/g) || []).length !== 1)
    casse.push(`${(html.match(/<h1[ >]/g) || []).length} balises de titre principal — le socle en exige exactement une`);
  // 5. DÉTERMINISTE — deux générations de la même source rendent le même octet. Sans cette
  //    propriété, chaque régénération produirait un diff et le registre se remplirait de bruit.
  const deux = pageEtude(SOURCE_ESSAI, f);
  if (deux !== html) casse.push("deux générations de la MÊME source diffèrent — la page n'est pas déterministe");
  // 6. L'INDICE SE LIT DANS LES DEUX FORMES DE NOM que la doctrine admet.
  if (indiceDuNom("20260914-etude-opportunite-x.md") !== "20260914a")
    casse.push("l'indice n'est pas lu sur la forme datée en tête, réservée aux études");
  if (indiceDuNom("Digit-AI - Note Revue - Sujet - 20260818b.md") !== "20260818b")
    casse.push("l'indice n'est pas lu sur la forme R-4");
  // 8. LES ASSETS DU SOCLE SONT RÉELLEMENT LUS — le seul cas qui franchit `SEUIL_FILTRE`, donc le
  //    seul qui appelle `lireAsset`. Sans lui, une référence morte dans la signature de cette
  //    fonction passait sept contrôles verts et cassait la ligne de commande (22/09/2026).
  const fLong = join(dir, "20260916-etude-opportunite-table-longue.md");
  writeFileSync(fLong, SOURCE_ESSAI_TABLE_LONGUE, "utf8");
  const htmlLong = readFileSync(ecrirePage(fLong), "utf8");
  if (!/data-filterable/.test(htmlLong))
    casse.push("une table de neuf lignes n'est pas armée pour le filtrage — le seuil du socle n'est pas appliqué");
  if (!/\.tf-btn/.test(htmlLong) || !/find-bar/.test(htmlLong))
    casse.push("les assets du socle ne sont pas embarqués dans une page qui porte une table longue — `lireAsset` n'a rien rendu (socle absent, ou référence morte dans la résolution du chemin)");
  // 9 à 11 — CE QUE LA COQUILLE DÉRIVÉE DU SOCLE DOIT APPORTER (TF-1317, TF-1244, TF-1315 ; décision
  // humaine D-6 (b) du 22/09/2026). Chacune de ces trois propriétés manquait à la coquille écrite à
  // la main, et chacune a été trouvée par un juge différent le même jour.
  if (!/id="theme-toggle"/.test(html) || !/localStorage\.setItem\(\s*'digitai-theme'/.test(html))
    casse.push("la page ne porte pas la bascule de thème câblée et persistée du socle (R-30 point 2)");
  // Le contrôle juge les tableaux DU DOCUMENT, dans `<main>` : le script embarqué du composant de
  // filtres contient lui-même la chaîne « <td> », et le compter reviendrait à juger le code du socle.
  const principal = htmlLong.slice(htmlLong.indexOf("<main>"), htmlLong.indexOf("</main>"));
  const tables = principal.match(/<table\b[^>]*>/g) || [];
  const cellules = principal.match(/<td\b[^>]*>/g) || [];
  if (!tables.length || !tables.every((t) => /repli-cartes/.test(t)) || !cellules.every((c) => /data-label="/.test(c)))
    casse.push("un tableau n'est pas repliable en cartes : classe repli-cartes ou étiquette data-label manquante");
  const blocs = htmlLong.match(/<!--\s*COMPOSANT-EMBARQUE:DEBUT\s+[\w.-]+/g) || [];
  if (blocs.length < 3 || !/data-composant="table-filters\.css" data-empreinte="sha256:[0-9a-f]{64}"/.test(htmlLong))
    casse.push(`les composants ne sont pas embarqués sous marqueur scellé (${blocs.length} bloc(s) marqué(s), 3 attendus)`);

  // 12. TF-1442 — LA COQUILLE PORTE LE MARQUAGE MACHINE D'ASSISTANCE IA (oracle-transparence TR2).
  // Non vide, sans quoi TR2 le rendrait invisible (« content="[^"]*" » que TR2 exige NON VIDE).
  const marquageIA = /<meta name="ai-generated" content="([^"]*)">/.exec(html);
  if (!marquageIA || !marquageIA[1].trim())
    casse.push("la page ne porte pas <meta name=\"ai-generated\"> à contenu non vide — TR2 resterait en défaut au 2026-12-03");

  // 13. TF-1443 — UNE NOTE DE COLONNE D'UNE SEULE LETTRE (« X ») SE RELIE AUSSI À SON EN-TÊTE, et
  // le cas déjà couvert (nom de plusieurs lettres) ne régresse pas — double sens sur le MÊME appel.
  const HTML_COLONNES = '<table><thead><tr><th scope="col">X</th><th scope="col">Reseau detaille</th></tr></thead></table>'
    + "<blockquote><p><strong>X</strong> : le réseau, une étiquette posée par l'auteur, pas un calcul.</p></blockquote>"
    + '<blockquote><p><strong>Reseau detaille</strong> : le nom complet du réseau étudié.</p></blockquote>';
  const rduColonnes = decrireColonnes(HTML_COLONNES);
  if (!/<th scope="col" aria-describedby="col-1">X<\/th>/.test(rduColonnes))
    casse.push("une colonne d'UNE lettre (« X ») ne reçoit plus aria-describedby — sa note reste orpheline (TF-1443)");
  if (!/<th scope="col" aria-describedby="col-2">Reseau detaille<\/th>/.test(rduColonnes))
    casse.push("une colonne de plusieurs lettres régresse après le geste TF-1443 — elle ne reçoit plus aria-describedby");

  // 14 à 16. TF-1437 — LE SOMMAIRE LATÉRAL COLLANT, POSÉ DÈS LE SEUIL, PAS AVANT (L25 du socle).
  const fSommaire = join(dir, "20260916-etude-opportunite-sommaire.md");
  writeFileSync(fSommaire, SOURCE_ESSAI_SOMMAIRE, "utf8");
  const htmlSommaire = readFileSync(ecrirePage(fSommaire), "utf8");
  if (!/<nav class="toc colle" aria-label="Sommaire">/.test(htmlSommaire))
    casse.push("une étude à 4 chapitres ne porte aucun sommaire latéral collant — L25 du socle resterait en FAIL");
  const blocSommaire = (htmlSommaire.match(/<nav class="toc colle"[\s\S]*?<\/nav>/) || [""])[0];
  const ancresSommaire = [...blocSommaire.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  // TF-1566 : l'ancre vise désormais la SECTION du chapitre, jamais le seul <h2> — un id posé sur
  // les deux ferait gagner le dernier rencontré dans `index_ids` de check_html.py, jamais la
  // section (cf. commentaire d'`identifierChapitres`), et L7 resterait en FAIL sans jamais le dire.
  if (ancresSommaire.length !== 4 || !ancresSommaire.every((id) => htmlSommaire.includes(`<section id="${id}">`)))
    casse.push(`le sommaire porte ${ancresSommaire.length} entrée(s) valide(s), 4 attendues — chacune vers un <section id> réel (L25 « sommaire incomplet » sinon)`);
  const annoncesSommaire = [...blocSommaire.matchAll(/<span class="toc-d">([^<]*)<\/span>/g)].map((m) => m[1]);
  if (annoncesSommaire.length !== 4 || annoncesSommaire.some((a) => a.length < 12))
    casse.push(`annonce(s) .toc-d absente(s) ou < 12 caractères : ${JSON.stringify(annoncesSommaire)} — L6 exige ≥ 12 caractères, y compris pour un titre COURT (« 5. Verdict »)`);

  // 17 à 19. TF-1566 — LE CHAPEAU `.ch-apprend` EST ÉCRIT, JAMAIS GÉNÉRÉ (L7 du socle). Les id
  // portent le numéro écrit en tête du titre (« 1. Partition… » → `1-partition-du-probleme`) :
  // identifierChapitres ne le retire pas, il fait partie du TEXTE du chapitre.
  const secPartition = (htmlSommaire.match(/<section id="1-partition-du-probleme">[\s\S]*?<\/section>/) || [""])[0];
  if (!/<p class="ch-apprend">Ce chapitre découpe le sujet/.test(secPartition))
    casse.push("la citation qui ouvre le chapitre 1 ne devient pas son chapeau .ch-apprend — L7 resterait en FAIL");
  const secEtat = (htmlSommaire.match(/<section id="3-etat-de-l-art">[\s\S]*?<\/section>/) || [""])[0];
  if (!/<p class="ch-apprend">Ce chapitre relève les sources/.test(secEtat))
    casse.push("la citation qui ouvre le chapitre 3 ne devient pas son chapeau .ch-apprend — L7 resterait en FAIL");
  const secVerdict = (htmlSommaire.match(/<section id="5-verdict">[\s\S]*?<\/section>/) || [""])[0];
  if (/ch-apprend/.test(secVerdict))
    casse.push("le chapitre 5, qui n'ouvre par aucune citation, reçoit quand même un chapeau — un chapeau GÉNÉRÉ est exactement le défaut que L7 refuse (TF-0423)");

  // 20. TF-1566 — UN TABLEAU AU MILIEU D'UN CHAPITRE NE COUPE PAS SA SECTION EN DEUX. Cas qui a
  // cassé l'essai d'une passe séparée sur l'étude réelle du 19/09/2026 (cf. commentaire
  // d'`identifierChapitres`) : le texte APRÈS le tableau doit rester DANS `<section id="…">`, et
  // cette section doit se refermer avant que la suivante ne s'ouvre (un seul `<table`, imbrication
  // propre).
  const secNonRecouvrement = (htmlSommaire.match(/<section id="2-non-recouvrement">[\s\S]*?(?=<section id="3-etat-de-l-art">)/) || [""])[0];
  if (!/Avant le tableau/.test(secNonRecouvrement) || !/<table\b/.test(secNonRecouvrement)
    || !/Après le tableau[\s\S]*doit rester DANS/.test(secNonRecouvrement) || !/<\/section>\s*$/.test(secNonRecouvrement))
    casse.push("un tableau au milieu d'un chapitre coupe sa section en deux — la prose qui le suit fuit hors de son <section id>");

  const fSansSommaire = join(dir, "20260916-etude-opportunite-sans-sommaire.md");
  writeFileSync(fSansSommaire, SOURCE_ESSAI_SANS_SOMMAIRE, "utf8");
  const htmlSansSommaire = readFileSync(ecrirePage(fSansSommaire), "utf8");
  if (/<nav class="toc colle"/.test(htmlSansSommaire))
    casse.push("une étude à SEULEMENT 3 chapitres porte déjà un sommaire — le seuil L25 (strictement plus de trois) n'est pas respecté, du bruit sur un document court");

  // 21. TF-1566 — `nav.barre`, LA SECONDE NAVIGATION QUI RESTE COLLANTE SOUS 900 PX (patron
  // TF-1145) : posée APRÈS `nav.toc` (check_html.py ne lit que le PREMIER nav pour L6/L7/L10),
  // une entrée par chapitre, masquée par défaut et rendue par la media query de `STYLE_SOMMAIRE`.
  const iToc = htmlSommaire.indexOf('<nav class="toc colle"');
  const iBarre = htmlSommaire.indexOf('<nav class="barre"');
  const blocBarre = (htmlSommaire.match(/<nav class="barre" aria-label="Sommaire permanent">[\s\S]*?<\/nav>/) || [""])[0];
  const ancresBarre = [...blocBarre.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  if (iBarre < 0 || iToc < 0 || iBarre < iToc)
    casse.push("nav.barre est absente ou précède nav.toc — check_html.py ne lit que le premier nav pour L6/L7/L10, nav.barre lui volerait ce rôle");
  if (ancresBarre.length !== 4 || JSON.stringify(ancresBarre) !== JSON.stringify(ancresSommaire))
    casse.push(`nav.barre porte ${ancresBarre.length} ancre(s) (${JSON.stringify(ancresBarre)}), devrait porter exactement celles de nav.toc (${JSON.stringify(ancresSommaire)}) — sinon la navigation permanente ne mène pas aux mêmes chapitres`);
  if (!/nav\.barre\{display:none\}/.test(htmlSommaire) || !/max-width:900px\)\{\s*nav\.barre\{display:flex/.test(htmlSommaire))
    casse.push("nav.barre n'est pas bornée à la media query ≤ 900 px — elle doublerait la bande déjà collante du bureau au-delà");

  // 22. TF-1566 — check_html.py et render_page.py, joués sur une étude RÉELLE (cf. commentaire de
  // `jouerControlesDuSocleSurUneEtudeReelle`) : SKIP motivé dans `nonJuge`, jamais un vert qui
  // affirmerait un cas non joué.
  const nonJuge = [];
  const casseControleReel = jouerControlesDuSocleSurUneEtudeReelle(nonJuge);
  if (casseControleReel && casseControleReel.length) casse.push(...casseControleReel);

  rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  const nbCas = casseControleReel ? 22 : 21;
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : `Self-test generer-page-etude : ${nbCas}/${nbCas} PASS (page écrite à côté de sa source ; autoportante, ` +
      "aucune ressource distante ; titre portant l'indice DATÉ de la source et non celui du jour ; " +
      "corps rendu — tableau, liste à puces, liste NUMÉROTÉE et citation ; un seul titre principal ; " +
      "deux générations de la même source identiques à l'octet ; indice lu sur les DEUX formes de " +
      "nom admises ; table longue armée pour le filtrage ; assets du socle réellement lus et " +
      "embarqués ; bascule de thème câblée et persistée ; chaque tableau repliable en cartes ; " +
      "composants embarqués sous marqueur scellé ; marquage machine d'assistance IA posé (TR2) ; " +
      "note de colonne d'une lettre reliée par aria-describedby, sans régresser le cas déjà couvert ; " +
      "sommaire latéral collant posé et ancré DÈS quatre chapitres, absent à trois ; chapeau " +
      ".ch-apprend écrit depuis une citation, jamais généré, nav.barre collante en permanence sous " +
      "900 px" + (casseControleReel ? " ; check_html.py et render_page.py verts sur une étude réelle)" : ")") +
      (nonJuge.length ? ` — NON JOUÉ : ${nonJuge.join(" · ")}` : ""));
  return casse.length ? 1 : 0;
}

// ── LA LIGNE DE COMMANDE ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const lance = process.argv[1] && basename(process.argv[1]) === "generer-page-etude.mjs";
if (lance) {
  if (args.includes("--self-test")) process.exit(selfTest());
  let cibles = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--dossier");
  const d = args.indexOf("--dossier");
  if (d >= 0) {
    const dossier = args[d + 1];
    if (!dossier || !existsSync(dossier)) {
      console.error("dossier introuvable — usage : node scripts\\generer-page-etude.mjs --dossier <chemin>");
      process.exit(2);
    }
    // LE MODE DOSSIER A DÉBORDÉ À SON PREMIER USAGE, et le garde vient de là (16/09/2026). Lancé
    // sans borne sur le dossier des études, il a écrit SOIXANTE-CINQ pages là où la décision
    // humaine en couvrait CINQ : quarante-sept études antérieures à l'entrée de la doctrine — que
    // la règle 5 interdit de réécrire — et treize annexes de mesure, qui ne sont ni des
    // propositions, ni des études, ni des trajectoires. *Un mode « tout le dossier » sans borne
    // fabrique du travail que personne n'a demandé, et le fait passer pour une application de la
    // règle.* Deux bornes, donc, toutes deux déclarées et toutes deux désarmables à la main : le
    // RÔLE, lu dans le nom que R-4 rend porteur, et la DATE d'entrée de la doctrine (TF-0895).
    // Les deux bornes vivent en tête de ce fichier (`ROLES_PAGE_HOMONYME`,
    // `DOCTRINE_PAGE_HOMONYME`) : l'oracle de conformité les lit de là, plutôt que d'en tenir une
    // copie qui se périmerait au premier rôle ajouté (TF-0923 volet a).
    const i2 = args.indexOf("--depuis");
    const depuis = i2 >= 0 ? String(args[i2 + 1] || "") : DOCTRINE_PAGE_HOMONYME;
    cibles = cibles.concat(readdirSync(dossier)
      .filter((f) => /\.md$/i.test(f) && !/^(README|LISEZMOI)\.md$/i.test(f))
      .filter((f) => {
        if (!rolePageHomonyme(f)) return false;
        const d = (/(\d{8})/.exec(f.replace(/\.md$/i, "")) || [])[1];
        return !depuis || (d && d >= depuis);
      })
      .map((f) => join(dossier, f)));
  }
  if (!cibles.length) {
    console.error("cible absente — usage : node scripts\\generer-page-etude.mjs <source.md>… | --dossier <chemin> | --self-test");
    process.exit(2);
  }
  // Sans socle, aucune page ne peut être dérivée : le dire, chemins cherchés compris, AVANT la
  // première écriture (TF-1324). Une trace de pile levée au milieu d'un lot laisserait des pages
  // écrites et d'autres non, sans que le lecteur sache lesquelles.
  const socle = socleDePage();
  if (!socle.assets) { console.error(socleAbsent(socle)); process.exit(2); }
  for (const c of cibles) {
    if (!existsSync(c)) { console.error(`source introuvable : ${c}`); process.exit(2); }
    console.log(`page écrite : ${ecrirePage(c)}`);
  }
}
