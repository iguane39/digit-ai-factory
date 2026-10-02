#!/usr/bin/env node
/**
 * sas-retours-doctrine.test.mjs — recette de TF-1460 (28/09/2026, corrigé le 02/10/2026).
 *
 * LE FAIT. La règle LOT-SAS (`gabarits\oracle-lot-retours.mjs`, TF-0981 puis TF-1055, 14/09/2026)
 * refuse, à l'ingestion, un lot posé à la RACINE d'`input\00-retours\` sous son nom réel : la
 * remise d'un produit ou d'une forge doit atterrir dans le sas `input\00-retours\_arrivee\`
 * (ignoré par git), que l'outil d'accueil du pilot (`todo\accueillir-lot`) pseudonymise puis déplace à la racine suivie.
 * L'agent « adoption » de la campagne D-32 (a) du 28/09/2026 a relevé SEPT textes de doctrine qui
 * continuaient de prescrire la racine comme lieu de REMISE — une consigne lue par un producteur
 * aurait fait écrire son lot directement là où LOT-SAS le refuse.
 *
 * CE QUE CETTE RECETTE VÉRIFIE : chacun des sept textes porte désormais la mention du sas
 * (`_arrivee\`) à l'endroit précis qui prescrivait la remise, au lieu de la racine nue. Elle ne
 * revérifie pas la racine `input\00-retours\` ailleurs dans ces textes (point de dépôt légitime
 * APRÈS l'accueil — `TODO-FORGE.md` le décrit lui-même) : seule la phrase de REMISE est en cause.
 * Le texte est comparé espaces et sauts de ligne NORMALISÉS, pour ne pas dépendre d'un retour à la
 * ligne de mise en forme. Jouée par `oracles\self-tests.mjs` (I2).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const norm = (s) => s.replace(/\s+/g, " ");

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

// {fichier relatif au pilot, sous-chaîne ATTENDUE après correction (normalisée)}
const CAS = [
  ["CLAUDE.md", "sidecar remis au sas `<pilot>\\input\\00-retours\\_arrivee\\`,"],
  ["gabarits/AGENT-INSATISFACTION.md", "sidecar, remis au sas `<pilot>\\input\\00-retours\\_arrivee\\`"],
  ["gabarits/docs-projet/TODO-PRODUIT.md", "remis au sas > `<pilot>\\input\\00-retours\\_arrivee\\` et ingéré"],
  ["references/ETAPES-RUN.md", "copie des deux fichiers dans le sas `<pilot>\\input\\00-retours\\_arrivee\\`"],
  ["references/RUN-MANDAT.md", "sidecar remis au sas `<pilot>\\input\\00-retours\\_arrivee\\`,"],
  ["REGLES-PROJET.md", "remise = copie dans le sas `input\\00-retours\\_arrivee\\` du pilot, jamais à sa racine"],
  ["references/TODO-FORGE.md", "remise au sas `input\\00-retours\\_arrivee\\`,"],
];

for (const [rel, attendu] of CAS) {
  check(`${rel} — la remise pointe vers le sas, pas la racine (TF-1460)`, () => {
    const texte = norm(readFileSync(join(PILOT, rel), "utf8"));
    if (!texte.includes(norm(attendu))) {
      throw new Error(`sous-chaîne attendue absente : « ${attendu} »`);
    }
  });
}

console.log(`\nsas-retours-doctrine (TF-1460) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
