#!/usr/bin/env node
/**
 * coquille-vues-plafond.test.mjs — recette de TF-1515 (01/10/2026, corrigé le 02/10/2026).
 *
 * LE FAIT, mesuré le 01/10/2026 sur `construire-guide.py` (gd-guide-de-reference) : le bandeau
 * collant (`header.bandeau`, `position: sticky; top: 0`) enveloppe `nav.vues`, qui replie sa barre
 * en RANGS SANS BORNE à mesure que les vues s'ajoutent — avec l'instance de la famille (5 vues),
 * bas du bandeau à 256 px sur 844 au téléphone (30 % de l'écran) ; avec 14 vues (guide d'un
 * produit réel), 615 px (73 %, 229 px de lecture restants). Les captures d'ÉLÉMENT ne l'auraient
 * jamais montré : `render_page` neutralise les éléments collants le temps d'une capture (règle V9).
 *
 * CE QUE CETTE RECETTE VÉRIFIE, structurellement (sans dépendance à un navigateur) : sous le
 * seuil téléphone (`max-width: 760px`), `nav.vues` porte un plafond de hauteur borné
 * (`max-height`) ET un défilement interne (`overflow-y: auto`) — la partie qui CROÎT avec le
 * contenu devient défilante dans SA PROPRE boîte, le bandeau haut (marque, outils) restant
 * toujours entier visible. Vérifié à la fois sur la SOURCE du composant
 * (`composants/coquille-vues.css`) et sur ses deux copies posées (SQUELETTE.html, INSTANCE.html,
 * bloc `COMPOSANT-GABARIT`), pour qu'une correction de la source non reposée reste détectée.
 *
 * Une mesure RÉELLE (Playwright, fenêtre 390×844, défilement 3000 px, 14 vues synthétiques) a
 * confirmé l'effet le 02/10/2026 : bas du bandeau 525 px SANS le plafond, 408 px AVEC — non
 * committée ici en recette permanente (dépendance navigateur, hors de ce que les autres recettes
 * du dépôt embarquent), mais rejouable à la main depuis une copie de `INSTANCE.html` enrichie de
 * vues. Jouée par `oracles\self-tests.mjs` (I2).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

/** Le bloc de la media query téléphone, isolé pour ne pas confondre avec une autre règle
 *  `nav.vues` qui vivrait ailleurs dans le fichier (desktop, paysage court, print). */
function blocPhone(texte) {
  const i = texte.indexOf("@media (max-width: 760px)");
  if (i < 0) return null;
  const debut = texte.indexOf("{", i);
  let profondeur = 0, j = debut;
  for (; j < texte.length; j++) {
    if (texte[j] === "{") profondeur++;
    if (texte[j] === "}") { profondeur--; if (profondeur === 0) break; }
  }
  return texte.slice(debut, j + 1);
}

const SOURCE = join(ICI, "guide-de-reference", "composants", "coquille-vues.css");
const SQUELETTE = join(ICI, "guide-de-reference", "SQUELETTE.html");
const INSTANCE = join(ICI, "guide-de-reference", "INSTANCE.html");

/** Dans un fichier posé (SQUELETTE/INSTANCE), coquille-vues.css vit entouré d'autres composants,
 *  chacun avec SA PROPRE media query téléphone : isoler le bloc COMPOSANT-GABARIT avant d'y
 *  chercher, sinon `blocPhone` trouve la première media query venue, d'un autre composant. */
function blocComposant(texte, nom) {
  const m = texte.match(new RegExp(`<!-- COMPOSANT-GABARIT:DEBUT ${nom.replace(/\./g, "\\.")} [\\s\\S]*?<!-- COMPOSANT-GABARIT:FIN ${nom.replace(/\./g, "\\.")} -->`));
  return m ? m[0] : texte;
}

for (const [nom, chemin, scope] of [
  ["composants/coquille-vues.css (source)", SOURCE, null],
  ["SQUELETTE.html (posé)", SQUELETTE, "coquille-vues.css"],
  ["INSTANCE.html (posé)", INSTANCE, "coquille-vues.css"],
]) {
  check(`${nom} — nav.vues porte un plafond de hauteur ET un défilement interne sous 760px`, () => {
    const brut = readFileSync(chemin, "utf8");
    const texte = scope ? blocComposant(brut, scope) : brut;
    const bloc = blocPhone(texte);
    if (!bloc) throw new Error("media query téléphone (max-width: 760px) introuvable");
    const m = bloc.match(/nav\.vues\s*\{([^}]*)\}/);
    if (!m) throw new Error("aucune règle nav.vues dans la media query téléphone — le bandeau reste sans plafond");
    if (!/max-height\s*:/.test(m[1])) throw new Error("nav.vues n'a pas de max-height — la barre des vues peut encore croître sans borne");
    if (!/overflow-y\s*:\s*auto/.test(m[1])) throw new Error("nav.vues n'a pas overflow-y: auto — un plafond sans défilement couperait des vues, inatteignables");
  });
}

check("header.bandeau lui-même n'a pas de max-height — c'est nav.vues qui plafonne, pas le bandeau haut (marque, outils)", () => {
  const texte = readFileSync(SOURCE, "utf8");
  const regleBandeau = texte.match(/header\.bandeau\s*\{[^}]*\}/)[0];
  if (/max-height/.test(regleBandeau)) throw new Error("header.bandeau porte un max-height — la marque et les outils risqueraient d'être coupés");
});

console.log(`\ncoquille-vues-plafond (TF-1515) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
