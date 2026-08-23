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
 * INVARIANT (I4, TF-0414 du 20/08) : les oracles d'ÉTAT sont joués sur le PARC RÉEL, pas
 * seulement sur leurs fixtures. `oracle-skills` avait un `--self-test` vert à 68/68 pendant
 * que l'oracle lui-même échouait sur 9 skills : la copie INSTALLÉE divergeait de sa source
 * versionnée, et c'est la copie qui s'exécute. Une recette prouve qu'une règle SAIT échouer ;
 * elle ne dit rien de l'état du monde. Troisième occurrence de cette famille en trois semaines
 * (item d'origine archivé, TF-0391 le 19/08, TF-0414 le 20/08), dont deux APRÈS le gate écrit
 * en gabarit — un paragraphe de doctrine ne s'exécute pas, un pas de recette si.
 * SKIP (exit 2) vaut succès : sur un poste sans les dépôts frères, il n'y a rien à juger.
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

// I1 bis (23/08, decision humaine « ne touche pas les produits ») : les HOOKS portant leur propre
// recette entrent dans le meme invariant. Le motif `oracle-*` les laissait dehors — un hook
// BLOQUANT non couvert est plus dangereux qu'un oracle non couvert, puisqu'il decide de la
// poursuite d'un tour. Ceux qui n'ont pas de `--self-test` gardent leur fichier `.test.mjs`, joue
// par I2.
const oracles = readdirSync(ICI)
  .filter((f) => (f.startsWith("oracle-") || f.startsWith("hook-")) && f.endsWith(".mjs")
    && readFileSync(join(ICI, f), "utf8").includes('"--self-test"'))
  .concat(readdirSync(ICI).filter((f) => f.startsWith("oracle-") && f.endsWith(".mjs")))
  .filter((f, i, t) => t.indexOf(f) === i).sort();
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

// TF-0367 (18/08) — la découverte était sur le disque DANS la zone, mais la LISTE DES ZONES
// était écrite à la main. Le commentaire ci-dessus dit exactement pourquoi c'est un défaut
// (« une liste écrite à la main aurait laissé invisible le prochain fichier ajouté ») — et il
// le disait en étant une liste, un cran plus haut. Constaté en ajoutant
// `oracles/resoudre-pilot.test.mjs` : vert, et joué par personne. Même classe que TF-0362
// (F1 qui n'itère que sur le manifeste) et TF-0333 (la boucle qui n'itère que sur le servi) :
// un contrôle qui parcourt une liste ne voit jamais ce qui n'y est pas.
//
// Les zones sont donc DÉCOUVERTES : tout dossier de premier niveau du dépôt, plus la racine
// elle-même. `node_modules` et les artefacts d'atelier sont exclus nommément — pas devinés.
const HORS_ZONE = new Set([".git", "node_modules", ".venv", "__pycache__", ".oracles", "old"]);
const zonesTests = ["."];
for (const d of readdirSync(RACINE, { withFileTypes: true })) {
  if (d.isDirectory() && !HORS_ZONE.has(d.name)) zonesTests.push(d.name);
}
for (const zone of zonesTests) {
  let fichiers = [];
  try {
    // I2 bis (TF-0413, 20/08) : le MOTIF était aussi étroit que la liste des zones l'avait
    // été (TF-0367). `todo\self-test.mjs` — 38 contrôles verts sur le registre — n'était joué
    // par PERSONNE : il ne finit pas en `.test.mjs`, donc I2 ne le voyait pas, et il ne vit
    // pas sous `oracles\`, donc I1 non plus. Un fichier de recette invisible aux deux
    // invariants est exactement ce que cet agrégateur existe pour éteindre. Les self-tests DE
    // `oracles\` restent hors de ce motif : ils sont déjà joués par I1 (via `DEDIES`), et
    // `self-tests.mjs` s'y appellerait lui-même.
    const motif = (f) => f.endsWith(".test.mjs") || (zone !== "oracles" && /^self-test.*\.mjs$/.test(f));
    fichiers = readdirSync(join(RACINE, zone)).filter(motif).sort();
  } catch { continue; }
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

// I4 — oracles d'ÉTAT, joués sur le parc réel. La liste est COURTE et écrite : elle ne se
// devine pas, puisque la plupart des oracles du pilot jugent un artefact qu'on leur passe et
// non un état permanent. Chaque entrée dit son motif et le geste de remise en état — un
// verdict rouge qui n'indique pas quoi faire se contourne au lieu de se corriger.
const ETAT_DU_PARC = [
  {
    nom: "oracle-skills.mjs",
    motif: "dérive versionné↔installé des skills",
    remede: "node oracles\\oracle-skills.mjs --appliquer (décision humaine, TF-0391)",
  },
  {
    // 23/08 : UN CONTROLE STATIQUE NE REND PAS LA PAGE. Deux instances de gabarit livrees le matin
    // etaient vertes au marquage et rouges au rendu, sur TROIS causes distinctes — contraste,
    // largeur de lecture, chevauchements. Aucune n'est visible sans rendre la page.
    nom: "../scripts/verifier-rendu-instances.mjs",
    motif: "instance de gabarit verte au marquage et fautive au RENDU",
    remede: "corriger la cause nommee par le verdict (contraste, largeur, chevauchement), puis rejouer",
  },
  {
    // TF-0474 (23/08) : la convention d'empreinte ne tient que si un site NON DECLARE se voit.
    // Sept items du registre relevaient de cette classe, traites un par un, dont DEUX
    // redecouvertes strictes du meme defaut. C'est un etat du PARC, pas un artefact : il se joue
    // ici, a chaque recette.
    nom: "oracle-empreintes.mjs",
    motif: "site de scellement sha256 non declare au registre des empreintes",
    remede: "declarer le site dans la table de references\EMPREINTES.md (depot, ce qui est scelle, format)",
  },
  {
    // R-44 (20/08) : un README par dossier d'input\ et output\, présent, à jour, rédigé.
    nom: "oracle-readme-dossiers.mjs",
    motif: "README d'input\\ et output\\ absents, périmés ou non rédigés",
    remede: "node scripts\\readme-dossiers.mjs, puis rédiger le bloc ROLE des README signalés",
  },
];
for (const { nom, remede } of ETAT_DU_PARC) {
  const r = spawnSync(process.execPath, [join(ICI, nom)], { encoding: "utf8" });
  let verdict = null;
  try { verdict = JSON.parse(r.stdout || "{}").verdict; } catch { /* sortie non JSON : le code de retour tranche */ }
  // 0 PASS · 2 non jugeable (dépôts frères absents) → succès. 1 FAIL → échec, avec le remède.
  const ok = r.status === 0 || r.status === 2;
  resultats.push({
    nom: `${nom} (parc réel)`,
    statut: ok ? "OK" : "ECHEC",
    detail: ok
      ? `I4 — ${verdict || "sans verdict lisible"} sur le parc`
      : `I4 — ${verdict || "FAIL"} sur le parc · remède : ${remede}`,
    via: "I4 (oracle d'état)",
  });
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
    : `  ${resultats.length}/${resultats.length} recettes jouées et vertes (oracles, fichiers de test du dépôt, état du parc — I1, I2 et I4)`,
);
process.exit(echecs.length ? 1 : 0);
