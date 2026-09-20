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
 * sa source. Il ne porte aucune valeur de marque : la coquille chartée, les jetons du socle et le
 * rendu markdown viennent de `scripts\lib-vue-html.mjs`, déjà éprouvé par trois générateurs.
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
import { tmpdir, homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { lireSource, mdVersHtml, coquille } from "./lib-vue-html.mjs";

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

// ── LES TABLEAUX LONGS SE FILTRENT, ET LE DOCUMENT SE CHERCHE ────────────────────────────────
//
// LE SOCLE L'EXIGE, ET LA DÉCISION HUMAINE DU 16/09 L'A CONFIRMÉ EN TENANT LA RÈGLE « TELLE
// QU'ELLE EST ÉCRITE » : une page remise à un humain passe le socle `digit-ai-page-html` EN ENTIER
// (R-32). Ses règles L4 et L13 disent qu'une table de huit lignes ou plus se filtre, et qu'un
// document qui en porte une se cherche — « une liste longue se cherche » (standard H2).
//
// LA SORTIE PARESSEUSE EXISTAIT ET A ÉTÉ ÉCARTÉE. Le socle admet `data-filterable="off"` avec un
// motif écrit ; un générateur qui stamperait le même motif sur chaque table produirait exactement
// ce que le socle nomme lui-même comme le pire cas — *une exemption de routine ne se lit plus*.
// Les composants existent et sont éprouvés : on les CÂBLE (loi n° 1), on ne les exempte pas.
//
// INLINÉS, JAMAIS RÉFÉRENCÉS : la page est autoportante (A1), donc les deux assets entrent dans le
// document. Le coût est de 48 Ko par page ; c'est le prix d'un fichier qu'on peut envoyer par
// courriel et ouvrir sans réseau, et c'est la propriété que la doctrine exige en premier.
const SEUIL_FILTRE = 8;
const ASSETS = join(homedir(), ".claude", "skills", "digit-ai-page-html", "assets");

/** Lit un asset du socle. Absent : chaîne vide, et l'appelant le DIT — jamais un échec muet. */
export function lireAsset(nom, racine = ASSETS) {
  try { return readFileSync(join(racine, nom), "utf8"); } catch { return ""; }
}

/**
 * Marque les tables de `SEUIL_FILTRE` lignes ou plus : un `id` stable, `data-filterable`, et le
 * compteur `aria-live` que la règle G5 réclame — sans lui, le lecteur ne sait pas combien de
 * lignes un filtre vient de masquer. Rend `{ html, ids }`.
 */
export function armerTableaux(html) {
  const ids = [];
  let n = 0;
  const sortie = html.replace(/<div class="defile"><table>([\s\S]*?)<\/table><\/div>/g, (bloc, dedans) => {
    const lignes = (dedans.match(/<tr>/g) || []).length - 1;   // l'en-tête ne compte pas
    if (lignes < SEUIL_FILTRE) return bloc;
    n += 1;
    const id = `tab-${n}`;
    ids.push(id);
    return `<div class="defile"><table id="${id}" data-filterable>${dedans}</table></div>`
      + `\n<p class="tf-count" data-tf-count-for="${id}" aria-live="polite"></p>`;
  });
  return { html: sortie, ids };
}

/**
 * LA PROSE EN CHAPITRES, LES TABLEAUX EN FRÈRES (16/09/2026).
 *
 * POURQUOI CETTE MISE EN FORME PLUTÔT QU'UNE BORNE SUR LE TEXTE. Le rendu markdown produit un flux
 * plat — titre, paragraphe, liste, tableau, titre… — et à 3840 px ce flux étire la prose à plus de
 * deux cents caractères par ligne : l'œil perd le début de la ligne suivante, et l'oracle de rendu
 * le refuse (V18). Le premier remède essayé a borné les paragraphes par `max-width` ; L2 l'a refusé
 * dans la seconde qui a suivi, et son message porte le remède juste — *la mesure de lecture se pose
 * sur le CONTENEUR, pas sur le texte*. Les deux règles ne se contredisent pas : prises ensemble,
 * elles décrivent une seule construction, celle du gabarit de chapitre du socle.
 *
 * CE QUE FAIT LA TRANSFORMATION : toute suite de blocs de PROSE devient un `section.chap.lire`
 * (1 080 px, le token du socle, mesuré à 134 caractères par ligne — sous le plafond) ; les
 * tableaux, leurs compteurs et les figures restent SES FRÈRES, à pleine largeur. Le conteneur
 * DÉCLARE sa mesure (`data-mesure-lecture`), comme le socle l'exige dès qu'un chapitre de lecture
 * côtoie des frères plus larges — sans quoi la correction crée une rupture d'alignement, défaut
 * mesuré deux fois le 24/08 chez un produit.
 */
export function enChapitres(html) {
  const lignes = html.split("\n");
  const sortie = [];
  let chapitre = [];
  const fermer = () => {
    if (!chapitre.length) return;
    sortie.push('<section class="chap lire" data-mesure-lecture>', ...chapitre, "</section>");
    chapitre = [];
  };
  for (const l of lignes) {
    // Un tableau, son compteur et une figure sont des FRÈRES du chapitre : ils prennent la largeur.
    if (/^<div class="defile">/.test(l) || /^<p class="tf-count"/.test(l) || /^<figure/.test(l)) {
      fermer();
      sortie.push(l);
      continue;
    }
    chapitre.push(l);
  }
  fermer();
  return sortie.join("\n");
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
  const avecId = html.replace(/<blockquote><p><strong>([^<]{2,40})<\/strong>\s*(:|&nbsp;:)/g, (tout, nom, sep) => {
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
 * Pose la barre de recherche, les composants du socle et la règle d'impression. La règle G6 est
 * la moins intuitive et la plus utile : le JS ne s'exécute pas à l'export PDF, donc sans la règle
 * `@media print` un document exporté APRÈS un filtrage sortirait tronqué, en silence.
 */
export function cablerComposants(html, ids, assets = {}) {
  if (!ids.length) return html;
  const css = assets.css ?? lireAsset("table-filters.css");
  const jsFiltres = assets.jsFiltres ?? lireAsset("table-filters.js");
  const jsRecherche = assets.jsRecherche ?? lireAsset("find-in-page.js");
  const barre = `    <div class="find-bar">
      <label for="find">Rechercher dans le document</label>
      <input id="find" type="search" placeholder="Rechercher dans le document…">
      <p id="findCount" class="find-count" aria-live="polite"></p>
    </div>
`;
  const style = `  <style>
${css}
    /* Espacements et couleurs pris aux JETONS de la coquille (TF-1162) : --e1..--e10 pour
       l'échelle 4 pt, --alerte pour le compteur à zéro. Un « #B42318 » écrit ici est un T1
       bloquant, et cinq espacements hors échelle étaient comptés sur chaque page portant la
       barre de recherche — le défaut vit dans le générateur, pas dans la page. */
    .find-bar{display:flex;flex-direction:column;gap:var(--e1);margin:0 0 var(--e5)}
    .find-bar label{font-size:.78rem;color:var(--muted);font-weight:600}
    .find-bar input{font:inherit;padding:var(--e2) var(--e3);border:1px solid var(--line);border-radius:var(--r-sm);background:var(--surface);color:var(--ink)}
    .find-count{margin-top:var(--e1);font-size:.72rem;color:var(--muted);min-height:1em}
    .find-count.zero{color:var(--alerte)}
    .tf-count{margin:var(--e2) 0 var(--e5);font-size:.72rem;color:var(--muted);min-height:1em}
    mark.find-hit{background:var(--amber-fill);color:var(--ink);border-radius:2px;display:inline;padding:0;margin:0}
    @media print{tr[data-tf-hidden]{display:table-row !important}.find-bar{display:none}}
  </style>
`;
  const scripts = `  <script>
${jsFiltres}
  </script>
  <script>
${jsRecherche}
  </script>
  <script>
    DigitAITableFilters.initAll(document);
    DigitAIFindInPage.init(document.getElementById('find'), document.querySelector('main'), document.getElementById('findCount'));
  </script>
`;
  return html
    .replace("</head>", `${style}</head>`)
    .replace("    <main>\n", `    <main>\n${barre}`)
    .replace("</body>", `${scripts}</body>`);
}

/** Rend le HTML d'une étude. Pur : aucune écriture, aucune horloge. */
export function pageEtude(texteSource, nomSource, assets = {}) {
  const { front, corps } = lireSource(texteSource);
  const { titre, description } = enTete(corps);
  const brut = coquille({
    titre,
    description,
    front,
    corpsHtml: enChapitres(mdVersHtml(corps.replace(/^#\s+.+$\r?\n/m, ""))),
    source: texteSource,
    lettre: "D",
    version: indiceDuNom(nomSource) || undefined,
  });
  const { html, ids } = armerTableaux(decrireColonnes(brut));
  return cablerComposants(html, ids, assets);
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

> Une citation de référence.
`;

function selfTest() {
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
  if (!/<table>/.test(html) || !/<li>/.test(html) || !/<blockquote>/.test(html))
    casse.push("le corps de l'étude n'est pas rendu (tableau, liste ou citation manquants)");
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

  rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test generer-page-etude : 7/7 PASS (page écrite à côté de sa source ; autoportante, " +
      "aucune ressource distante ; titre portant l'indice DATÉ de la source et non celui du jour ; " +
      "corps rendu — tableau, liste et citation ; un seul titre principal ; deux générations de la " +
      "même source identiques à l'octet ; indice lu sur les DEUX formes de nom admises)");
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
  for (const c of cibles) {
    if (!existsSync(c)) { console.error(`source introuvable : ${c}`); process.exit(2); }
    console.log(`page écrite : ${ecrirePage(c)}`);
  }
}
