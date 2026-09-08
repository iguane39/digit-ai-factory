#!/usr/bin/env node
/**
 * lib-vue-html.test.mjs — LE SOCLE DES PROJECTIONS TIENT LES RÈGLES QU'IL IMPOSE AUX PRODUITS
 * (TF-0907, retour d'un produit du 07/09/2026, patch joint au lot).
 *
 * LE FAIT, mesuré au navigateur par le produit qui l'a subi : les vues HTML de `docs\projet\`
 * générées par ce socle rendaient la colonne de lecture à **646 px** — 50 % de la fenêtre à
 * 1280 px, 40 % à 1600, **34 % à 1920** — et le schéma SVG à largeur FIXE, soit 32 % à 1920.
 * `check_html.py` rendait FAIL sur L3 pour MODELE-DONNEES et A4/L3/L4/L13/L18/L19 pour
 * TODO-PRODUIT. *Les règles I1 et L26 sont imposées AUX PRODUITS par le pilot, et les
 * générateurs du pilot ne les tenaient pas.* Le patch a été écrit par le produit, faute de
 * l'être ici.
 *
 * CE QUE CETTE RECETTE FIGE, et pourquoi elle est à DOUBLE SENS : les quatre propriétés du
 * remède sont vérifiées sur la page réellement produite (sens VERT), puis les mêmes assertions
 * sont rejouées sur une page volontairement RAMENÉE à l'état d'avant (sens ROUGE). Sans le
 * second sens, une assertion écrite de travers passerait sur n'importe quoi — c'est le défaut
 * que tout le dépôt refuse ailleurs.
 *
 * CE QU'ELLE NE FAIT PAS, et c'est déclaré : elle n'exécute pas `check_html.py` ni
 * `render_page.py`. Elle tient les propriétés de MARQUAGE du socle dans le HTML produit ; le
 * verdict de rendu appartient aux oracles du socle, qui demandent python et un navigateur.
 *
 * Joué par `oracles\self-tests.mjs` (I2 : tout `*.test.mjs` du dépôt est joué).
 */
import { coquille, mdVersHtml, svgBoites } from "./lib-vue-html.mjs";

const echecs = [];

const page = coquille({
  titre: "Modèle de données",
  description: "vue de recette",
  front: { role: "modèle", sources_de_verite: "schema.sql", verifie_le: "2026-09-08" },
  svg: { label: "flux", corps: svgBoites([{ id: "A", sous: "amont" }, { id: "B", sous: "aval" }], [{ de: "A", vers: "B" }]), legende: "deux étapes" },
  corpsHtml: mdVersHtml("| colonne | type |\n|---|---|\n| id | entier |\n"),
  source: "# source\n",
  lettre: "M",
});

// Les quatre propriétés du remède, chacune avec la mesure qui l'a imposée.
const REGLES = [
  ["I1/L26 — la colonne de lecture ne bride plus la page", (h) => /\.colonne\{max-width:none/.test(h),
    "la colonne restait à 75ch : 646 px, soit 34 % de la fenêtre à 1920 px"],
  ["L26 — le schéma SVG suit la largeur disponible", (h) => /<svg[^>]*width="100%"/.test(h),
    "le SVG sortait à largeur FIXE, 32 % de la fenêtre à 1920 px"],
  ["nommage français — la classe de défilement s'appelle `defile`", (h) => /class="defile"/.test(h) && !/class="scroll"/.test(h),
    "la classe s'appelait `scroll`, seul nom anglais du rendu"],
  ["A4 — le titre porte son indice daté, dérivé de `verifie_le`", (h) => /<title>[^<]*20260908a<\/title>/.test(h),
    "le titre sortait nu : deux révisions du même jour portaient le même nom à l'écran"],
];

for (const [nom, tenue, cout] of REGLES) {
  if (!tenue(page)) echecs.push(`VERT — ${nom} : non tenue par la page produite (coût constaté : ${cout})`);
}

// SENS ROUGE — la page ramenée à l'état d'avant le 07/09. Chaque assertion DOIT y échouer :
// une assertion qui passe des deux côtés ne prouve rien.
const avant = page
  .replace(".colonne{max-width:none;margin:0}", ".colonne{max-width:75ch;margin:0 auto}")
  .replaceAll('class="defile"', 'class="scroll"')
  .replace(/<svg([^>]*)width="100%" style="max-width:\d+px"/, '<svg$1width="820"')
  .replace(/<title>[^<]*<\/title>/, "<title>Modèle de données</title>");
for (const [nom, tenue] of REGLES) {
  if (tenue(avant)) echecs.push(`ROUGE — ${nom} : l'assertion passe AUSSI sur la page d'avant le remède, elle ne prouve rien`);
}

if (echecs.length) { console.error("lib-vue-html : FAIL\n  - " + echecs.join("\n  - ")); process.exit(1); }
console.log(`lib-vue-html (TF-0907) : ${REGLES.length * 2}/${REGLES.length * 2} — colonne pleine largeur, SVG à 100 %, classe defile, titre daté ; chaque règle prouvée dans ses DEUX sens (page produite / page d'avant le remède)`);
