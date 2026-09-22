/**
 * lib-recettes-dediees.mjs — LA TABLE DES RECETTES DÉDIÉES, EN UN SEUL EXEMPLAIRE.
 *
 * Elle vivait dans `self-tests.mjs`, et elle y était seule à la connaître. Le 22/09/2026,
 * `oracle-banc-double-sens.mjs` a eu besoin de la même table pour ne pas accuser un contrôle
 * d'être sans banc alors que le harnais, lui, sait où est le sien. Deux tables auraient divergé
 * au premier ajout, et la divergence aurait rendu VERT le juge pendant que le harnais rendait
 * rouge — ou l'inverse. Le patron est celui déjà posé le 22/09 entre le poseur de l'entrée au
 * poste et son juge : une source, deux lecteurs.
 *
 * Une entrée dit : « ce contrôle-ci est éprouvé par ce fichier-là ». Elle n'existe que lorsque la
 * forme ordinaire — un `--self-test` embarqué, ou un `<controle>.test.mjs` voisin — ne convient
 * pas, et la raison s'écrit sur place.
 */
export const DEDIES = {
  "oracle-conformite-projet.mjs": "self-test.mjs",
  "oracle-ecosysteme.mjs": "self-test-ecosysteme.mjs",
  "oracle-parite-configuration.mjs": "oracle-parite-configuration.test.mjs",
  "oracle-controles-injoignables.mjs": "oracle-controles-injoignables.test.mjs",
  "oracle-amorcage-poste.mjs": "oracle-amorcage-poste.test.mjs",
  "oracle-chemin-prescrit.mjs": "oracle-chemin-prescrit.test.mjs",
  // `hook-amorcage.mjs` importe `hook-lexique.mjs`, qui lit `process.argv` à son CHARGEMENT : un
  // `--self-test` interne partirait jouer le banc de l'importé. Forme dédiée, donc (TF-1285).
  "hook-amorcage.mjs": "hook-amorcage.test.mjs",
  // Les trois oracles nés de l'action A-12 (décision humaine D-5 (a), 22/09/2026) portent leur
  // banc dans un fichier voisin plutôt qu'en `--self-test` : leurs fixtures écrivent à dessein la
  // forme que l'oracle refuse, et embarquées dans l'oracle elles le faisaient se dénoncer lui-même.
  "oracle-regle-sans-juge.mjs": "oracle-regle-sans-juge.test.mjs",
  "oracle-chemin-ancre.mjs": "oracle-chemin-ancre.test.mjs",
  "oracle-invariant-mesure.mjs": "oracle-invariant-mesure.test.mjs",
  "oracle-banc-double-sens.mjs": "oracle-banc-double-sens.test.mjs",
  // Les 2 oracles nés des décisions humaines D-17 (a) et D-18 (a) du 22/09/2026, qui donnent
  // enfin un juge à 2 règles du corpus que rien ne jouait. Banc dédié pour la même raison que
  // les précédents : leurs fixtures écrivent à dessein le défaut que l'oracle refuse.
  "oracle-depense-voie-par-defaut.mjs": "oracle-depense-voie-par-defaut.test.mjs",
  "oracle-verrou-unique.mjs": "oracle-verrou-unique.test.mjs",
  // Né de la décision humaine D-15 (a) du 22/09/2026, qui a tranché l'ordre : le contrôle
  // D'ABORD, la classe ensuite. Le cliquet R15 refuse une classe neuve sans juge existant.
  "oracle-repere-externe.mjs": "oracle-repere-externe.test.mjs",
};
