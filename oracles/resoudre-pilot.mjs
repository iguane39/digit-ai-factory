#!/usr/bin/env node
// resoudre-pilot — trouve le dépôt du pilot par son CONTENU, jamais par son nom.
//
// TF-0367 (lot Produit-10 20260818a, 18/08/2026). Le renommage `digit-ai-forge-pilot` →
// `digit-ai-factory` (17/08) a cassé en silence les chemins écrits en dur dans les `CLAUDE.md`
// des projets consommateurs : `node <FORGE_ROOT>\digit-ai-forge-pilot\oracles\
// oracle-conformite-projet.mjs .` échoue en « fichier introuvable », sans alias, sans shim,
// sans note. Il a fallu lister `c:\dev` et reconnaître le dépôt à son contenu — en écartant
// `digit-ai-forge-pilot_old` et `digit-ai-forge-pilot_vide`, qui subsistent tous deux et
// portent un `oracles\oracle-conformite-projet.mjs` d'apparence valide. Celui de `_old` date
// du 17/08 : il aurait rendu un verdict PLAUSIBLE sous un jeu de règles périmé.
//
// C'est le patron du défaut, pas l'instance : à la génération précédente, `steering` → `pilot`
// avait déjà coûté un rattrapage (TF-0062), et il s'était appuyé sur une jonction de
// compatibilité — « NE PAS la supprimer avant ce rattrapage ». Le renommage du 17/08 s'en est
// passé, sur une décision assumée dont la revue du 24/08 devait mesurer le coût (critère n°5
// de l'étude de séquencement). Ce fichier est la réponse de classe : **le nom du dépôt du pilot
// cesse d'être une information que ses consommateurs doivent connaître.**
//
//   node resoudre-pilot.mjs            → le chemin, sur stdout, exit 0
//   node resoudre-pilot.mjs --json     → { racine, methode, ecartes[], non_juge[] }
//
// Ordre de résolution, du plus explicite au plus déduit :
//   1. `$PILOT_ROOT` s'il est posé et valide — l'humain a le dernier mot ;
//   2. le dépôt qui CONTIENT ce fichier (cas normal : on est dedans) ;
//   3. parmi les frères de `$FORGE_ROOT` (sinon le parent), celui qui porte la SIGNATURE.
//
// Exit : 0 résolu · 1 aucun candidat · 2 plusieurs candidats indiscernables (jamais un choix
// silencieux entre deux dépôts qui se ressemblent — c'est exactement le piège de `_old`).

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

// La SIGNATURE : ce que le pilot est le seul à porter, ET qui vit à la racine. On ne se
// contente pas d'`oracles/oracle-conformite-projet.mjs` — c'est précisément le fichier que
// `_old` porte aussi. Le registre TODO et son outillage, eux, identifient le pilot VIVANT.
const SIGNATURE = [
  "oracles/oracle-conformite-projet.mjs",
  "todo/TODO.jsonl",
  "todo/oracle-todo.mjs",
  "REGLES-PROJET.md",
  "CONTRAT-INTERFACE.md",
];

// Un dépôt qui porte ce marqueur s'exclut lui-même, quoi qu'il porte par ailleurs. C'est le
// moyen donné aux copies mises de côté de ne plus jamais être prises pour l'original.
const MARQUEUR_PERIME = "PERIME.md";

// LA SECONDE SERRURE, ET POURQUOI IL EN FALLAIT UNE (TF-0630, 25/08/2026). Jusqu'ici, une copie
// du pilot n'était écartée QUE par `PERIME.md`. Or ce marqueur n'est pas versionné — il ne peut
// pas l'être : une copie du pilot partage son dépôt distant avec le pilot vivant, donc committer
// puis pousser le marqueur apposerait « PÉRIMÉ » sur le dépôt vivant. Ce fichier est donc, par
// construction, le genre de chose qui disparaît.
// ET IL A DISPARU. TF-0525 consigne le 23/08 que le clone du pilot PORTE son `PERIME.md` ; le
// 25/08, mesuré avant toute écriture, LE FICHIER ÉTAIT ABSENT. Deux jours, cause non établie.
// Pendant cette fenêtre, ce clone portait les cinq fichiers de signature et redevenait un
// candidat parfaitement valide.
// LE PRÉFIXE `_archive-` EST LA SERRURE QUI NE PEUT PAS S'ÉVAPORER : il vit dans le NOM du
// répertoire, visible sans l'ouvrir, et c'est déjà la convention du parc pour un dépôt mis de
// côté (`references/CONVENTION-DEPOTS-MIS-DE-COTE.md`).
// CE QUE ÇA NE CHANGE PAS, et c'est la raison d'être de ce fichier : l'écart reste BRUYANT. Le
// motif est nommé dans `ecartes`, comme celui du marqueur. Ce résolveur n'a jamais eu le droit
// de choisir en silence entre deux dépôts qui se ressemblent ; il ne l'a toujours pas.
const PREFIXE_ARCHIVE = /^_archive-/i;

function estPilot(racine) {
  if (PREFIXE_ARCHIVE.test(basename(racine))) return { ok: false, motif: "nom en `_archive-` — dépôt mis de côté par la convention du parc" };
  if (existsSync(join(racine, MARQUEUR_PERIME))) return { ok: false, motif: "marqué PERIME.md" };
  const absents = SIGNATURE.filter((f) => !existsSync(join(racine, f)));
  if (absents.length) return { ok: false, motif: `signature incomplète (${absents.join(", ")})` };
  return { ok: true };
}

function candidatsFreres(racine) {
  if (!existsSync(racine)) return [];
  return readdirSync(racine, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => join(racine, d.name))
    .filter((chemin) => estPilot(chemin).ok);
}

export function resoudrePilot() {
  const ecartes = [];

  if (process.env.PILOT_ROOT) {
    const declare = resolve(process.env.PILOT_ROOT);
    const verdict = estPilot(declare);
    if (verdict.ok) return { racine: declare, methode: "$PILOT_ROOT", ecartes };
    ecartes.push(`$PILOT_ROOT=${declare} écarté : ${verdict.motif}`);
  }

  const ici = resolve(join(ICI, ".."));
  if (estPilot(ici).ok) return { racine: ici, methode: "dépôt courant", ecartes };

  const racineForges = process.env.FORGE_ROOT
    ? resolve(process.env.FORGE_ROOT)
    : resolve(join(ici, ".."));
  const trouves = candidatsFreres(racineForges);

  // Ce qui a été REGARDÉ et écarté est nommé : sans ça, « introuvable » n'apprend rien, et
  // c'est ce qui a coûté une inspection manuelle le 18/08.
  for (const d of readdirSync(racineForges, { withFileTypes: true }).filter((x) => x.isDirectory())) {
    const chemin = join(racineForges, d.name);
    if (trouves.includes(chemin)) continue;
    const v = estPilot(chemin);
    // `_archive-` est nommé ici AUSSI, et pas seulement dans `estPilot` : une exclusion qui
    // écarte sans le dire redevient exactement le choix silencieux que ce fichier interdit.
    if (!v.ok && /PERIME|_archive-|signature incomplète \(todo/.test(v.motif)) {
      ecartes.push(`${d.name} : ${v.motif}`);
    }
  }

  if (trouves.length === 1) return { racine: trouves[0], methode: `frère de ${racineForges}`, ecartes };
  if (!trouves.length) return { racine: null, methode: null, ecartes, erreur: "aucun candidat" };
  return {
    racine: null, methode: null, ecartes,
    erreur: `${trouves.length} candidats indiscernables : ${trouves.join(" · ")} — poser `
      + "PILOT_ROOT, renommer les copies mises de côté en `_archive-…` (durable, visible sans "
      + "ouvrir le dossier), ou les marquer d'un fichier PERIME.md",
  };
}

const NON_JUGE = [
  "la FRAÎCHEUR du dépôt trouvé : une copie complète et à jour de signature mais restée sur "
  + "un commit ancien est indiscernable ici — c'est `git` qui le dit, pas la présence de fichiers",
  "les chemins déjà ÉCRITS EN DUR dans les CLAUDE.md des produits : ce script les remplace pour "
  + "l'avenir, il ne les corrige pas chez eux (garde-fou : le pilot n'intervient pas hors run demandé)",
];

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const r = resoudrePilot();
  if (process.argv.includes("--json")) {
    process.stdout.write(JSON.stringify({ ...r, non_juge: NON_JUGE }, null, 1) + "\n");
  } else if (r.racine) {
    process.stdout.write(r.racine + "\n");
    for (const e of r.ecartes) process.stderr.write(`écarté — ${e}\n`);
  } else {
    process.stderr.write(`pilot NON RÉSOLU : ${r.erreur}\n`);
    for (const e of r.ecartes) process.stderr.write(`écarté — ${e}\n`);
  }
  process.exit(r.racine ? 0 : (r.erreur === "aucun candidat" ? 1 : 2));
}
