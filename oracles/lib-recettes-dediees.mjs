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
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

/**
 * Les défauts d'une table de recettes dédiées : un contrôle déclaré qui n'existe pas, ou un banc déclaré qui n'existe pas
 * dans `dossier`. Une entrée qui pointe dans le vide ferait croire un contrôle éprouvé par un fichier absent (TF-2589).
 */
export function jugerTable(table, dossier) {
  const defauts = [];
  for (const [controle, banc] of Object.entries(table)) {
    if (!existsSync(join(dossier, controle))) defauts.push(`contrôle absent : ${controle}`);
    if (!existsSync(join(dossier, banc))) defauts.push(`banc absent : ${banc} (déclaré pour ${controle})`);
  }
  return defauts;
}

// TF-2589 (15/11/2026) : `--self-test` rendait exit 0 sans une ligne — une recette muette ne prouve rien. Il rend désormais un
// verdict chiffré : la table réelle jugée, puis des tables fautives qui doivent être refusées pour la bonne raison (double sens).
function selfTest() {
  const ICI = dirname(fileURLToPath(import.meta.url));
  const cas = [];
  const verifier = (nom, ok, detail = "") => cas.push({ nom, ok, detail });
  const reel = jugerTable(DEDIES, ICI);
  verifier("la table réelle ne pointe que sur des fichiers présents", reel.length === 0, reel.join(" | "));
  verifier("la table réelle porte au moins une entrée", Object.keys(DEDIES).length > 0);
  const vert = jugerTable({ "lib-recettes-dediees.mjs": "lib-recettes-dediees.mjs" }, ICI);
  verifier("vert — une entrée dont le contrôle et le banc existent n'est pas accusée", vert.length === 0, vert.join(" | "));
  const sansBanc = jugerTable({ "lib-recettes-dediees.mjs": "banc-inexistant.test.mjs" }, ICI);
  verifier("rouge — un banc déclaré absent est nommé", sansBanc.length === 1 && /banc absent : banc-inexistant\.test\.mjs/.test(sansBanc[0]), sansBanc.join(" | "));
  const sansControle = jugerTable({ "oracle-inexistant.mjs": "lib-recettes-dediees.mjs" }, ICI);
  verifier("rouge — un contrôle déclaré absent est nommé", sansControle.length === 1 && /contrôle absent : oracle-inexistant\.mjs/.test(sansControle[0]), sansControle.join(" | "));
  const tout = jugerTable({ "oracle-a.mjs": "a.test.mjs" }, ICI);
  verifier("rouge — une entrée toute fausse rend ses deux défauts", tout.length === 2, tout.join(" | "));
  const echecs = cas.filter((c) => !c.ok);
  for (const c of cas) console.log(c.ok ? `  [PASS] ${c.nom}` : `  [FAIL] ${c.nom}${c.detail ? ` — ${c.detail}` : ""}`);
  console.log(`Self-test lib-recettes-dediees : ${cas.length - echecs.length}/${cas.length} PASS — table réelle de ${Object.keys(DEDIES).length} entrées jugée sur disque, `
    + "puis une entrée verte, un banc absent, un contrôle absent et une entrée toute fausse jugés pour la bonne raison");
  return echecs.length ? 1 : 0;
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replace(/\\/g, "/") === resolve(process.argv[1]).toLowerCase().replace(/\\/g, "/");
if (lanceEnDirect && process.argv.includes("--self-test")) process.exit(selfTest());
