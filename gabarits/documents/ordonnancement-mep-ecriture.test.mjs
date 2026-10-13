#!/usr/bin/env node
/**
 * ordonnancement-mep-ecriture.test.mjs — recette de TF-1529 (01/10/2026, corrigé le 02/10/2026).
 *
 * LE FAIT, mesuré le 01/10/2026 : trois textes restaient rouges à `oracle-ecriture.mjs` avant
 * comme après la campagne D-37 — la famille `gabarits\documents\ordonnancement-mep` (gabarit,
 * squelette et 2 instances, 6 constats : 3 tournures d'annonce EC-8 en en-tête de colonne et en
 * titre, 3 valeurs écrites en toutes lettres EC-9), `references\PRODUITS.md` (EC-8, EC-9) et
 * `references\INDEX.md` (EC-1, densité de tirets d'incise à 46,32 ‰ pour un seuil de 40 ‰). Ces
 * règles d'écriture sont nées après ces textes.
 *
 * CE QUE CETTE RECETTE VÉRIFIE : les règles MESURÉES (EC-1, EC-8, EC-9) sont désormais PASS ou
 * AVERT (jamais FAIL) sur les six fichiers. Elle ne revérifie PAS EC-3 (profondeur de puces) sur
 * les fichiers `.html` de la famille : ce contrôle confond `* { box-sizing: border-box; }` d'un
 * bloc `<style>` avec une puce Markdown de 3e niveau — un défaut d'`oracle-ecriture.mjs` lui-même
 * (il ne découpe pas les blocs `<style>`/`<script>` comme il découpe le code Markdown),
 * PRÉEXISTANT et IDENTIQUE sur `rapport-de-donnees/SQUELETTE.html` qu'aucune session n'a touché —
 * hors du périmètre de cette correction, notée séparément (doctrine neuve, hors de ce mandat).
 * Jouée par `oracles\self-tests.mjs` (I2).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { juger } from "../../oracles/oracle-ecriture.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..", "..");
const DONNEE = JSON.parse(readFileSync(join(PILOT, "references", "tics-redactionnels.json"), "utf8"));

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

/** Les règles MESURÉES par le constat d'origine (EC-1, EC-8, EC-9) ne sont jamais FAIL — les
 *  autres règles (dont EC-3, défaut préexistant d'oracle-ecriture sur les blocs <style>) ne sont
 *  pas de ce périmètre. */
function sansFailMesure(chemin, relatif) {
  return echecsMesures(readFileSync(chemin, "utf8"), relatif);
}

/** Le même jugement, sur un TEXTE : les constats FAIL des règles mesurées. */
function echecsMesures(texte, relatif) {
  const { findings } = juger(texte, { donnee: DONNEE, cheminRelatif: relatif });
  return findings.filter((f) => f.statut === "FAIL" && /^EC-(1|8|9)(:|$)/.test(f.regle));
}

const CIBLES = [
  ["gabarits/documents/ordonnancement-mep/GABARIT.md", join(ICI, "ordonnancement-mep", "GABARIT.md")],
  ["gabarits/documents/ordonnancement-mep/SQUELETTE.html", join(ICI, "ordonnancement-mep", "SQUELETTE.html")],
  ["gabarits/documents/ordonnancement-mep/INSTANCE.html", join(ICI, "ordonnancement-mep", "INSTANCE.html")],
  ["gabarits/documents/ordonnancement-mep/INSTANCE.md", join(ICI, "ordonnancement-mep", "INSTANCE.md")],
  ["references/PRODUITS.md", join(PILOT, "references", "PRODUITS.md")],
  ["references/INDEX.md", join(PILOT, "references", "INDEX.md")],
];

for (const [rel, chemin] of CIBLES) {
  check(`TF-1529 — ${rel} : EC-1, EC-8 et EC-9 ne rendent plus FAIL`, () => {
    const echecs = sansFailMesure(chemin, rel);
    att(echecs.length === 0, `${echecs.length} échec(s) encore mesuré(s) : ${echecs.map((f) => `${f.regle} — ${f.message.slice(0, 80)}`).join(" | ")}`);
  });
}

// SENS ROUGE (TF-1245) : le jugement doit REFUSER un texte qui porte les défauts d'origine (EC-8 en
// titre et en en-tête de colonne, EC-9 en valeurs écrites en toutes lettres), et laisser passer le
// même fait écrit en chiffres. Ces fixtures sont celles de la recette d'oracle-ecriture.
const EC8_ROUGE = "# Ce que ce guide couvre\n\nUn paragraphe de prose ordinaire, assez long pour "
  + "ne rien declencher d'autre, qui decrit un dispositif sans employer de tournure d'annonce.\n\n"
  + "| Ce qu'elle apprend | Mesure |\n|---|---|\n| une ligne | une valeur |\n";
const EC9_ROUGE = "# Mesure\n\nLes vues pesent huit virgule huit megaoctets sur les deux cent "
  + "quatre-vingts du depot. Un identifiant vit dans cent trente-deux revisions. La doctrine est "
  + "entree le sept septembre, et la mesure a ete refaite le seize septembre.\n";
const EC9_VERTE = "# Mesure\n\nLes vues pesent 8,8 Mo sur les 280 du depot. Un identifiant vit "
  + "dans 132 revisions. La doctrine est entree le 7 septembre, et la mesure a ete refaite le "
  + "16 septembre.\n";
check("cas rouge — un titre et un en-tête de colonne en tournure d'annonce rendent FAIL (EC-8)", () => {
  const echecs = echecsMesures(EC8_ROUGE, "banc/ec8-rouge.md");
  att(echecs.some((f) => f.regle === "EC-8"), "le jugement a laissé passer la tournure d'annonce refusée");
});
check("cas rouge — des valeurs écrites en toutes lettres rendent FAIL (EC-9)", () => {
  const echecs = echecsMesures(EC9_ROUGE, "banc/ec9-rouge.md");
  att(echecs.some((f) => f.regle === "EC-9"), "le jugement a laissé passer des valeurs en toutes lettres");
});
check("cas vert — les mêmes faits écrits en chiffres ne rendent aucun FAIL", () => {
  const echecs = echecsMesures(EC9_VERTE, "banc/ec9-verte.md");
  att(echecs.length === 0, `faux FAIL : ${echecs.map((f) => f.regle).join(", ")}`);
});

console.log(`\nordonnancement-mep-ecriture (TF-1529) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
