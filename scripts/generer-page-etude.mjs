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
import { lireSource, mdVersHtml, esc } from "./lib-vue-html.mjs";
import {
  socleDePage, socleAbsent, lireAsset as lireAssetDuSocle, chargerPoseur,
  armerTableaux, enChapitres, coquilleDuSocle, replierTableaux, cablerComposants as cablerComposantsDuSocle,
} from "./lib-socle-page.mjs";

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
  const brut = coquilleDuSocle({
    gabarit,
    titre,
    description,
    indice: indiceDeLaPage(front, indiceDuNom(nomSource) || undefined),
    corpsHtml: enChapitres(mdVersHtml(corps.replace(/^#\s+.+$\r?\n/m, ""))),
  });
  const { html, ids } = armerTableaux(decrireColonnes(brut));
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
  if (!/<table\b/.test(html) || !/<li>/.test(html) || !/<blockquote>/.test(html))
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

  rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test generer-page-etude : 12/12 PASS (page écrite à côté de sa source ; autoportante, " +
      "aucune ressource distante ; titre portant l'indice DATÉ de la source et non celui du jour ; " +
      "corps rendu — tableau, liste et citation ; un seul titre principal ; deux générations de la " +
      "même source identiques à l'octet ; indice lu sur les DEUX formes de nom admises ; table longue " +
      "armée pour le filtrage ; assets du socle réellement lus et embarqués ; bascule de thème câblée " +
      "et persistée ; chaque tableau repliable en cartes ; composants embarqués sous marqueur scellé)");
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
