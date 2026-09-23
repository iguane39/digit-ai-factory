/**
 * lib-socle-page.mjs — LES PAGES GÉNÉRÉES PAR LE PILOT DÉRIVENT LEUR COQUILLE DU SOCLE, ET LE SOCLE
 * SE CHERCHE LÀ OÙ IL EST (TF-1324 et TF-1321, décisions humaines D-14 (a) et D-13 (a) du 23/09/2026).
 *
 * ============================================================================================
 * D'OÙ VIENT CE MODULE
 * ============================================================================================
 *
 * Le 22/09/2026, TF-1317 (décision humaine D-6 (b)) a fait dériver la coquille des pages d'étude du
 * gabarit du socle `digit-ai-page-html` au lieu de la coquille écrite à la main de `lib-vue-html.mjs`.
 * Deux restes étaient déclarés, et ce module les ferme ensemble :
 *
 * 1. LE SOCLE N'ÉTAIT CHERCHÉ QU'À UN ENDROIT (TF-1324). Le générateur lisait la copie INSTALLÉE,
 *    sous le répertoire personnel, et rien d'autre. Le circuit d'intégration hébergé n'en a pas : il
 *    clone la SOURCE du socle, `digit-ai-forge-agents`, à côté du pilot, et pose FORGE_ROOT sur leur
 *    parent commun. Mesuré le 23/09 par `scripts\simuler-recette-hebergee.mjs` : le self-test levait
 *    « gabarit du socle introuvable », à l'identique avant et après la synchronisation du jour, et
 *    rendait 12/12 sur ce poste. *Une recette qui ne cherche sa matière qu'à l'endroit où son auteur
 *    l'a posée ne juge que le poste de son auteur* (classe
 *    `recette-locale-ne-rejoue-pas-l-environnement-de-la-ci`).
 *
 * 2. DEUX GÉNÉRATEURS GARDAIENT LA COQUILLE ÉCRITE À LA MAIN (TF-1321). `generer-architecture.mjs` et
 *    `generer-modele-donnees.mjs` projettent les vues de `docs\projet\` chez les produits. Leurs
 *    pages portaient la même classe de défaut que les études avant TF-1317 : aucune bascule de thème,
 *    aucun repli des tableaux en cartes, aucun composant déclaré. Elles passent ici par la même
 *    coquille que les études.
 *
 * ============================================================================================
 * L'ORDRE DE RECHERCHE, ET CE QUI SE PASSE QUAND RIEN N'EST TROUVÉ
 * ============================================================================================
 *
 * L'ordre est celui qu'`oracles\oracle-gabarits-documents.mjs` tient déjà pour `check_html.py` : la
 * copie INSTALLÉE d'abord, parce que c'est elle qui s'exécute dans une session ; puis la SOURCE sous
 * FORGE_ROOT, là où le circuit hébergé la pose ; puis la source dans le dépôt frère du pilot.
 *
 * Aucune des trois : le socle est ABSENT. L'appelant le DIT, avec les chemins cherchés et le geste
 * qui y remédie. Il ne lève pas une trace de pile, et il ne se replie jamais sur une autre coquille :
 * un repli silencieux est exactement le défaut que la dérivation ferme (TF-1317).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { skillsInstalles } from "./lib-config-installee.mjs";
import { empreinteTexte } from "./lib-empreinte.mjs";
import { esc } from "./lib-vue-html.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SOUS_LA_SOURCE = [".claude", "skills", "digit-ai-page-html", "assets"];

/** Une variable d'environnement posée ET non vide, sinon `null` (même lecture que lib-config-installee). */
const posee = (env, nom) => (typeof env[nom] === "string" && env[nom].trim() !== "" ? env[nom].trim() : null);

/**
 * Le dossier des ASSETS du socle, cherché dans l'ordre déclaré en tête de module.
 * @returns {{ assets: string|null, origine: string|null, cherches: string[] }}
 *   `assets` : le premier dossier qui porte `boilerplate.html`, sinon `null` ; `origine` : d'où il
 *   vient, à imprimer tel quel ; `cherches` : TOUS les chemins essayés, pour que l'absence se lise.
 */
export function socleDePage(env = process.env) {
  const candidats = [];
  const installes = skillsInstalles(env);
  if (installes.chemin) {
    candidats.push({ chemin: join(installes.chemin, "digit-ai-page-html", "assets"), origine: `copie installée (${installes.decide_par})` });
  }
  const racine = posee(env, "FORGE_ROOT");
  if (racine) candidats.push({ chemin: join(racine, "digit-ai-forge-agents", ...SOUS_LA_SOURCE), origine: `source sous FORGE_ROOT=${racine}` });
  candidats.push({ chemin: join(ICI, "..", "..", "digit-ai-forge-agents", ...SOUS_LA_SOURCE), origine: "source, dépôt frère du pilot" });
  const trouve = candidats.find((c) => existsSync(join(c.chemin, "boilerplate.html")));
  return { assets: trouve ? trouve.chemin : null, origine: trouve ? trouve.origine : null, cherches: candidats.map((c) => c.chemin) };
}

/** La phrase qui dit ce qui manque et comment l'obtenir — la même pour les trois générateurs. */
export function socleAbsent(socle) {
  return "socle digit-ai-page-html introuvable (boilerplate.html) — cherché dans : "
    + socle.cherches.join(" ; ")
    + ". Remède : installer les skills (node bootstrap.mjs --pull), ou cloner digit-ai-forge-agents à côté du pilot, "
    + "ou poser FORGE_ROOT sur le parent commun des deux";
}

/** Lit un asset du socle. Absent : chaîne vide, et l'appelant le DIT — jamais un échec muet. */
export function lireAsset(nom, assets) {
  if (!assets) return "";
  try { return readFileSync(join(assets, nom), "utf8"); } catch { return ""; }
}

/** Le poseur de composants DU SOCLE (`embarquer-composants.mjs`), ou `null` s'il est introuvable. */
export async function chargerPoseur(assets) {
  if (!assets) return null;
  const script = join(assets, "..", "scripts", "embarquer-composants.mjs");
  if (!existsSync(script)) return null;
  try { return (await import(pathToFileURL(script).href)).poserComposants || null; } catch { return null; }
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
// INLINÉS, JAMAIS RÉFÉRENCÉS : la page est autoportante (A1), donc les assets entrent dans le
// document. C'est le prix d'un fichier qu'on peut envoyer par courriel et ouvrir sans réseau, et
// c'est la propriété que la doctrine exige en premier.
export const SEUIL_FILTRE = 8;

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
 * Le rendu markdown produit un flux plat, et à 3840 px ce flux étire la prose à plus de deux cents
 * caractères par ligne : l'œil perd le début de la ligne suivante, et l'oracle de rendu le refuse
 * (V18). *La mesure de lecture se pose sur le CONTENEUR, pas sur le texte* (L2) : toute suite de
 * blocs de PROSE devient un `section.chap.lire` (1 080 px, le token du socle) ; les tableaux, leurs
 * compteurs et les figures restent SES FRÈRES, à pleine largeur. Le conteneur DÉCLARE sa mesure
 * (`data-mesure-lecture`), comme le socle l'exige dès qu'un chapitre de lecture côtoie des frères
 * plus larges.
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
    if (/^<div class="defile">/.test(l) || /^<p class="tf-count"/.test(l) || /^\s*<figure/.test(l)) {
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
 * Remplit les emplacements du gabarit du socle. Les notes d'auteur du gabarit (commentaires HTML)
 * ne partent pas au lecteur (D11) ; un emplacement introuvable ou laissé vide est une ERREUR, jamais
 * un repli silencieux sur une autre coquille — une page qui ne sait pas qu'elle a raté son gabarit
 * est exactement le défaut que ce remède ferme.
 *
 * Les paramètres propres à chaque famille de page ont leur défaut, celui des études : le surtitre,
 * le pied, la lettre du favicon, et ce qui suit le titre principal (la ligne de métadonnées des vues).
 */
export function coquilleDuSocle({
  gabarit, titre, description, indice, corpsHtml,
  surtitre = "Digit-AI · Étude", pied = null, lettre = "D", apresTitre = "", titreDocument = null,
}) {
  let h = String(gabarit || "");
  if (!h) throw new Error("gabarit du socle introuvable (digit-ai-page-html/assets/boilerplate.html) : la page ne peut pas être dérivée du socle");
  h = h.replace(/<!--[\s\S]*?-->/g, "");
  const remplir = (motif, par, nom) => {
    if (!motif.test(h)) throw new Error(`gabarit du socle : emplacement « ${nom} » introuvable — le socle a changé de forme`);
    h = h.replace(motif, () => par);
  };
  remplir(/<title>[\s\S]*?<\/title>/, `<title>${esc(titreDocument || `Digit-AI — ${titre} — ${indice}`)}</title>`, "titre du document");
  remplir(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`, "description");
  remplir(/<p class="eyebrow">[^<]*<\/p>/, `<p class="eyebrow">${esc(surtitre)}</p>`, "surtitre");
  remplir(/<h1>[^<]*<\/h1>/, `<h1>${esc(titre)}</h1>${apresTitre ? `\n        ${apresTitre}` : ""}`, "titre principal");
  remplir(/<main>[\s\S]*?<\/main>/, `<main>\n${corpsHtml}\n    </main>`, "corps");
  remplir(/<footer class="doc">[\s\S]*?<\/footer>/, `<footer class="doc">\n      ${pied ?? `Digit-AI — ${esc(titre)} — ${indice}`}\n    </footer>`, "pied de page");
  h = h.replaceAll("{L}", lettre);
  const reste = h.match(/\{[A-ZÉ][^{}<>\n]{0,60}\}/);
  if (reste) throw new Error(`gabarit du socle : l'emplacement ${reste[0]} n'a pas été rempli`);
  return h;
}

/**
 * LE REPLI EN CARTES DU SOCLE, SUR CHAQUE TABLEAU (TF-1317). Le socle replie en cartes tout
 * `table.repli-cartes` sous 900 px et restitue l'en-tête de chaque cellule par `data-label`. Sans
 * la classe et les étiquettes, une table de quatre colonnes défile à l'horizontale sur un
 * téléphone — mesuré le 22/09 sur trois tables d'une page d'étude.
 */
export function replierTableaux(html) {
  return html.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/g, (tout, attrs, dedans) => {
    const tetes = [...dedans.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
    if (!tetes.length) return tout;
    const corps = dedans.replace(/<tr>([\s\S]*?)<\/tr>/g, (ligne, cellules) => {
      let i = 0;
      return `<tr>${cellules.replace(/<td>/g, () => `<td data-label="${esc(tetes[i++] ?? "")}">`)}</tr>`;
    });
    const classes = /\bclass="/.test(attrs) ? attrs.replace(/\bclass="/, 'class="repli-cartes ') : `${attrs} class="repli-cartes"`;
    return `<table${classes}>${corps}</table>`;
  });
}

/**
 * Pose la barre de recherche, les composants du socle et la règle d'impression. La règle G6 est
 * la moins intuitive et la plus utile : le JS ne s'exécute pas à l'export PDF, donc sans la règle
 * `@media print` un document exporté APRÈS un filtrage sortirait tronqué, en silence.
 *
 * Les composants sont posés par le poseur DU SOCLE (TF-1315) : chacun entre ses marqueurs
 * COMPOSANT-EMBARQUE, scellé par l'empreinte de sa source, ce qui permet à la passe d'imputation de
 * forge-design de les mettre au compte du socle au lieu de l'auteur de la page. L'initialisation
 * vient APRÈS eux, le poseur les insérant avant `</body>`.
 */
export function cablerComposants(html, ids, poseur) {
  if (!ids.length) return html;
  if (!poseur) throw new Error("poseur de composants du socle introuvable (digit-ai-page-html/scripts/embarquer-composants.mjs) : les composants ne peuvent pas être embarqués sous sceau");
  const { html: pose, manquants } = poseur(html, ["table-filters.css", "table-filters.js", "find-in-page.js"]);
  if (manquants.length) throw new Error(`composants du socle absents : ${manquants.join(", ")}`);
  const barre = `    <div class="find-bar">
      <label for="find">Rechercher dans le document</label>
      <input id="find" type="search" placeholder="Rechercher dans le document…">
      <p id="findCount" class="find-count" aria-live="polite"></p>
    </div>
`;
  // Les règles PROPRES à la barre de recherche, aux jetons du SOCLE : l'échelle y est écrite en
  // multiples de 4 px (T3 les admet) et l'alerte s'appelle --red. Les jetons --e1..--e10 et --alerte
  // de l'ancienne coquille n'existent pas au socle : les garder aurait rendu des variables vides.
  const style = `  <style>
    .find-bar{display:flex;flex-direction:column;gap:4px;margin:0 0 20px}
    .find-bar label{font-size:.78rem;color:var(--muted);font-weight:600}
    .find-bar input{font:inherit;padding:8px 12px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--surface);color:var(--ink)}
    .find-count{margin-top:4px;font-size:.72rem;color:var(--muted);min-height:1em}
    .find-count.zero{color:var(--red)}
    .tf-count{margin:8px 0 20px;font-size:.72rem;color:var(--muted);min-height:1em}
    mark.find-hit{background:var(--amber-fill);color:var(--ink);border-radius:2px;display:inline;padding:0;margin:0}
    @media print{tr[data-tf-hidden]{display:table-row !important}.find-bar{display:none}}
    /* Un IDENTIFIANT se coupe, un mot jamais (L19 du socle réserve la coupure à « code »). Mesuré le
       22/09 à 390 px : un tableau replié en cartes débordait à 442 px, porté par des chemins de 44 à
       95 caractères sans aucun point de coupure ; la prose, elle, ne se coupe pas. */
    main code{overflow-wrap:anywhere}
  </style>
`;
  const init = `  <script>
    DigitAITableFilters.initAll(document);
    DigitAIFindInPage.init(document.getElementById('find'), document.querySelector('main'), document.getElementById('findCount'));
  </script>
`;
  const fin = pose.lastIndexOf("</body>");
  const avecInit = `${pose.slice(0, fin)}${init}${pose.slice(fin)}`;
  return avecInit
    .replace("</head>", `${style}</head>`)
    .replace(/<main>\n/, `<main>\n${barre}`);
}

// ── LES VUES DE docs\projet : ARCHITECTURE ET MODÈLE DE DONNÉES (TF-1321) ────────────────────
//
// CE QUE LA VUE GARDE DE L'ANCIENNE COQUILLE, et pourquoi chacun de ces traits survit :
//   · le SCEAU de la source dans le pied (`Sceau source <code>…</code>`) — R-26 bis de
//     `oracle-conformite-projet` le relit pour juger la PARITÉ de la vue avec sa source ; le
//     perdre rendrait toute vue « antérieure au mécanisme de sceau », donc non jugeable ;
//   · la ligne de MÉTADONNÉES sous le titre (rôle, sources de vérité, date de vérification) ;
//   · le SCHÉMA, en figure, à pleine largeur (L26) ;
//   · l'indice daté DÉRIVÉ de `verifie_le`, jamais saisi (A4, TF-0556) ;
//   · la lettre du favicon, prise au titre quand l'appelant n'en donne pas.
// CE QU'ELLE GAGNE, par le socle et sans rien écrire : la bascule de thème câblée et persistée
// (R-30), le repli des tableaux en cartes, les composants posés sous sceau pour les tables longues.
//
// SES RÈGLES PROPRES — la figure et la ligne de métadonnées — sont écrites aux JETONS du socle, à
// l'échelle de 4 px : un espacement ou une couleur en dur y serait compté par oracle-tokens sur
// chacune des vues du parc, comme la coquille d'avant le 20/09 l'a été (TF-1162).
const STYLE_VUE = `  <style>
    .meta{color:var(--muted);font-size:.85rem;margin:4px 0 0}
    figure.schema{margin:16px 0;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:16px;overflow-x:auto}
    figure.schema figcaption{color:var(--muted);font-size:.85rem;margin-top:8px}
    figure.schema svg{max-width:100%;height:auto}
    @media print{figure.schema{break-inside:avoid}}
  </style>
`;

/** L'indice R-4 d'une vue : `verifie_le` (ou `date`) de sa source, sinon le jour. */
export function indiceDeLaVue(front, version) {
  const d = String((front && (front.verifie_le || front.date)) || "").match(/(\d{4})-(\d{2})-(\d{2})/);
  return version || (d ? `${d[1]}${d[2]}${d[3]}a` : new Date().toISOString().slice(0, 10).replaceAll("-", "") + "a");
}

/**
 * Rend une vue de `docs\projet\` sur la coquille du socle. Pur : aucune écriture.
 * @param {object} o — `gabarit` (le boilerplate lu), `poseur` (celui du socle), `titre`,
 *   `description`, `front` (en-tête de la source), `svg` ({ label, corps, legende } ou `null`),
 *   `corpsHtml` (le markdown déjà rendu), `source` (le texte scellé), `surtitre`, `lettre`.
 */
export function pageDeVue({ gabarit, poseur, titre, description, front = {}, svg = null, corpsHtml, source, surtitre, lettre, version }) {
  const indice = indiceDeLaVue(front, version);
  const titreDocument = /\b\d{8}[a-z]?\b/.test(titre) ? titre : `Digit-AI — ${titre} — ${indice}`;
  // TF-0359 / TF-0615 : le sceau porte la source normalisée LF, par la fonction partagée.
  const sceau = empreinteTexte(source, 12);
  const initiale = (lettre || (titre || "D").trim()[0] || "D").toUpperCase();
  const meta = `<p class="meta">rôle : ${esc(front.role || "—")} · sources de vérité : <code>${esc(front.sources_de_verite || "—")}</code> · vérifié le ${esc(front.verifie_le || "—")}</p>`;
  const figure = svg
    ? `<figure class="schema" role="img" aria-label="${esc(svg.label)}">\n${svg.corps}\n      <figcaption>${esc(svg.legende)}</figcaption>\n    </figure>\n`
    : "";
  // La figure reste HORS du découpage en chapitres : `enChapitres` lit ligne à ligne, et un schéma
  // écrit sur plusieurs lignes y serait coupé en deux, sa fin rangée dans une section de prose.
  const brut = coquilleDuSocle({
    gabarit, titre, description, indice, titreDocument,
    corpsHtml: figure + enChapitres(corpsHtml),
    surtitre, lettre: initiale, apresTitre: meta,
    pied: `Vue générée — NE PAS ÉDITER (la source Markdown fait foi ; la régénérer via le script du pilot). Sceau source <code>${sceau}</code>.`,
  });
  const { html, ids } = armerTableaux(brut);
  return cablerComposants(replierTableaux(html), ids, poseur).replace("</head>", `${STYLE_VUE}</head>`);
}

/**
 * Le point d'entrée des deux générateurs de vues : cherche le socle, rend la page, ou DIT ce qui
 * manque. Rend `{ html }` ou `{ absent: "<phrase>" }` — jamais une exception pour un socle absent.
 */
export async function rendreVue(options, env = process.env) {
  const socle = socleDePage(env);
  const gabarit = lireAsset("boilerplate.html", socle.assets);
  if (!gabarit) return { absent: socleAbsent(socle) };
  const poseur = await chargerPoseur(socle.assets);
  return { html: pageDeVue({ ...options, gabarit, poseur }) };
}
