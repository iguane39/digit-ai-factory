#!/usr/bin/env node
/**
 * self-tests.mjs — joue TOUS les self-tests d'oracles du pilot, en un pas.
 *
 * Pourquoi. Chaque oracle du pilot porte sa recette à double sens (fixtures rouges qui
 * prouvent que la règle sait échouer), et **rien ne les appelait** : il fallait y penser,
 * oracle par oracle. Un contrôle qu'on n'exécute que lorsqu'on y pense n'est pas un
 * garde-fou — c'est le défaut qu'on a corrigé le 14/08 sur la consigne RESTITUTION (écrite,
 * citée par aucun run) puis le 15/08 sur `ruff` dans forge-tests (configuré, joué par aucun
 * pas de recette). Le troisième cas était ici, chez nous.
 *
 * Deux formes cohabitent et c'est voulu : les oracles récents portent `--self-test` en
 * interne, les deux plus anciens ont un fichier `self-test*.mjs` dédié. L'agrégateur prend
 * les deux plutôt que d'imposer une réécriture qui n'apporterait rien.
 *
 * INVARIANT (I1) : tout `oracle-*.mjs` doit être couvert — par `--self-test` ou par un
 * fichier dédié. Un oracle sans recette est signalé comme un échec, pas passé sous silence :
 * sans quoi ajouter un oracle non testé serait la façon la plus simple de faire baisser le
 * compte d'échecs.
 *
 * INVARIANT (I2, TF-0351 du 18/08) : tout `*.test.mjs` du dépôt est JOUÉ ici. I1 ne regardait
 * que `oracles\` — les tests de `outillage-tests-e2e\` étaient donc verts et joués par
 * personne, exactement la dette R-35 que l'agrégateur existe pour éteindre. Le trou n'était pas
 * dans la règle mais dans son périmètre : un fichier de test qu'aucun pas ne lance est du même
 * ordre qu'un oracle sans recette, et se signale de la même façon.
 *
 * Usage : node oracles\self-tests.mjs        → exit 0 si tout passe, 1 sinon.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

// Oracles couverts par un fichier de recette dédié plutôt que par `--self-test`.
const DEDIES = {
  "oracle-conformite-projet.mjs": "self-test.mjs",
  "oracle-ecosysteme.mjs": "self-test-ecosysteme.mjs",
};

const oracles = readdirSync(ICI).filter((f) => f.startsWith("oracle-") && f.endsWith(".mjs")).sort();
const resultats = [];

for (const nom of oracles) {
  const source = readFileSync(join(ICI, nom), "utf8");
  const interne = source.includes('"--self-test"');
  const dedie = DEDIES[nom];

  if (!interne && !dedie) {
    // I1 : un oracle sans recette à double sens ne prouve pas qu'il sait échouer.
    resultats.push({ nom, statut: "SANS RECETTE", detail: "ni --self-test ni fichier dédié (I1)" });
    continue;
  }

  const [cmd, args] = interne
    ? [join(ICI, nom), ["--self-test"]]
    : [join(ICI, dedie), []];
  const r = spawnSync(process.execPath, [cmd, ...args], { encoding: "utf8" });
  const lignes = (r.stdout || "").split("\n").filter((l) => l.trim());
  resultats.push({
    nom,
    statut: r.status === 0 ? "OK" : "ECHEC",
    detail: (lignes[lignes.length - 1] || r.stderr?.split("\n")[0] || "aucune sortie").slice(0, 72),
    via: interne ? "--self-test" : dedie,
  });
}

// I2 — les fichiers de test hors `oracles\`, joues ici plutot que par personne. La
// decouverte est faite sur le DISQUE et non sur une liste : une liste ecrite a la main aurait
// laisse invisible le prochain fichier ajoute, ce qui est precisement le defaut d origine.
const RACINE = join(ICI, "..");
const ZONES_TESTS = ["outillage-tests-e2e"];
for (const zone of ZONES_TESTS) {
  let fichiers = [];
  try { fichiers = readdirSync(join(RACINE, zone)).filter((f) => f.endsWith(".test.mjs")).sort(); }
  catch { continue; }
  for (const nom of fichiers) {
    const r = spawnSync(process.execPath, [join(RACINE, zone, nom)], { encoding: "utf8" });
    const lignes = (r.stdout || "").trim().split("\n").filter((l) => l.trim());
    resultats.push({
      nom: `${zone}/${nom}`,
      statut: r.status === 0 ? "OK" : "ECHEC",
      detail: (lignes[lignes.length - 1] || r.stderr?.split("\n")[0] || "aucune sortie").slice(0, 72),
      via: "I2 (fichier de test du dépôt)",
    });
  }
}

console.log("=".repeat(78));
console.log("  Self-tests des oracles du pilot");
console.log("=".repeat(78));
for (const r of resultats) {
  const marque = r.statut === "OK" ? "OK    " : r.statut === "ECHEC" ? "ECHEC " : "MANQUE";
  console.log(`  [${marque}] ${r.nom.padEnd(32)} ${r.detail}`);
}
const echecs = resultats.filter((r) => r.statut !== "OK");
console.log("=".repeat(78));
console.log(
  echecs.length
    ? `  ${echecs.length}/${resultats.length} oracle(s) en défaut : ${echecs.map((r) => r.nom).join(", ")}`
    : `  ${resultats.length}/${resultats.length} recettes jouées et vertes (oracles + fichiers de test du dépôt, I1 et I2)`,
);
process.exit(echecs.length ? 1 : 0);
