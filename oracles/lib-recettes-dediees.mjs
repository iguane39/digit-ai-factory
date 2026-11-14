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
  "oracle-reprise.mjs": "oracle-reprise.test.mjs",
  "oracle-banc-double-sens.mjs": "oracle-banc-double-sens.test.mjs",
  // Les 2 oracles nés des décisions humaines D-17 (a) et D-18 (a) du 22/09/2026, qui donnent
  // enfin un juge à 2 règles du corpus que rien ne jouait. Banc dédié pour la même raison que
  // les précédents : leurs fixtures écrivent à dessein le défaut que l'oracle refuse.
  "oracle-depense-voie-par-defaut.mjs": "oracle-depense-voie-par-defaut.test.mjs",
  "oracle-verrou-unique.mjs": "oracle-verrou-unique.test.mjs",
  // Né de la décision humaine D-15 (a) du 22/09/2026, qui a tranché l'ordre : le contrôle
  // D'ABORD, la classe ensuite. Le cliquet R15 refuse une classe neuve sans juge existant.
  "oracle-repere-externe.mjs": "oracle-repere-externe.test.mjs",
  // Le juge d'enclenchement (TF-1319, décision humaine D-13 (a) du 23/09/2026). Banc dédié : ses
  // fixtures bâtissent un parc jetable de fausses forges et y copient le VRAI mécanisme de
  // confrontation de forge-tests — embarquées dans l'oracle, elles le feraient se juger lui-même.
  "oracle-enclenchement.mjs": "oracle-enclenchement.test.mjs",
  // Le juge de la déduction publiée comme un fait (TF-1581, campagne du 12/10/2026). Banc dédié : ses
  // fixtures écrivent à dessein l'affirmation sans source que l'oracle refuse.
  "oracle-source-contenu.mjs": "oracle-source-contenu.test.mjs",
  // L'état présenté comme normal à côté d'un code d'erreur (TF-1511, décision du 12/10/2026).
  "oracle-ecart-normal.mjs": "oracle-ecart-normal.test.mjs",
  // Le croisement des identifiants de modèles tiers du parc avec le calendrier de leurs fournisseurs
  // (TF-2109, décision humaine « A2 » du 03/11/2026). Banc dédié : ses fixtures bâtissent des parcs
  // jetables en dépôts git et y écrivent à dessein les identifiants arrêtés que l'oracle refuse.
  "oracle-modeles-tiers.mjs": "oracle-modeles-tiers.test.mjs",
  // Les contrôles propres d'un produit (TF-2211, TF-2505). Le hook se joue par le lanceur du produit (`factory.mjs controles-produit`) : son banc est
  // celui des hooks du gabarit, `hooks-factory.test.mjs` (cas 21 à 21 quinquies : contrôle vert, contrôle rouge dit FAIL avec son exit, déclaration mal
  // formée nommée sans être jouée, commande étrangère muette). Entrée lue par le seul juge BD1 : `self-tests.mjs` joue ce fichier par I2, jamais par I1.
  "hook-controles-produit.mjs": "../gabarits/hooks-factory.test.mjs",
};
