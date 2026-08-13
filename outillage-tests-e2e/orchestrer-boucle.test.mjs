// Self-test TF-0145 (double sens) — logique de boucle testée sur un FAUX forge-tests (fixtures
// `fixtures/rapports-boucle/*.json`, séquences de rapports successifs), jamais un vrai run.
//
// Trois oracles à prouver, chacun avec sa preuve dédiée :
//   1. la boucle s'arrête à N cycles (jamais plus) ;
//   2. elle ne déclare JAMAIS "cible_atteinte" si un écart subsiste ;
//   3. les actions sont toujours classées — un finding orphelin fait échouer, pas disparaître.

import { join } from "node:path";
import assert from "node:assert/strict";

import {
  N_CYCLES_DEFAUT,
  chargerRapport,
  classerActions,
  cibleAtteinte,
  garantirHonnetete,
  orchestrerBoucle,
} from "./orchestrer-boucle.mjs";

const ICI = new URL(".", import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, "$1");
const FIXTURES = join(ICI, "fixtures", "rapports-boucle");
const f = (nom) => chargerRapport(join(FIXTURES, nom));

/** Rejoue une liste de rapports déjà chargés ; au-delà, reconduit le dernier (plateau assumé et documenté). */
function reprendreDepuisSequence(rapports) {
  let i = 0;
  return async () => {
    const r = rapports[Math.min(i, rapports.length - 1)];
    i += 1;
    return r;
  };
}

const tests = [];
const test = (nom, fn) => tests.push({ nom, fn });

// --------------------------------------------------------------------------------------------
// VERT — séquence convergente : cible atteinte avant épuisement des N cycles.
// --------------------------------------------------------------------------------------------

test("orchestrerBoucle (VERT) : séquence convergente -> cible_atteinte, 0 écart, sous N", async () => {
  const rapportInitial = f("convergent-cycle-1.json");
  const suite = [f("convergent-cycle-2.json"), f("convergent-cycle-3-terminal.json")];
  const appelsIA = [];
  const appelsDev = [];
  const resultat = await orchestrerBoucle({
    rapportInitial,
    reprendre: reprendreDepuisSequence(suite),
    appliquerActionIA: async (a) => appelsIA.push(a.finding_ref),
    declencherDevelopment: async (a) => appelsDev.push(a.finding_ref),
    nMax: N_CYCLES_DEFAUT,
  });
  assert.equal(resultat.statut, "cible_atteinte");
  assert.equal(resultat.ecarts.length, 0);
  assert.ok(resultat.cycles < N_CYCLES_DEFAUT, "doit converger AVANT d'épuiser les 3 cycles (preuve : pas un simple compteur)");
  assert.equal(resultat.rapport.verdict, "PASS");
  // Les actions IA/dev classées au fil des cycles ont bien été appelées (documenté, injecté).
  assert.ok(appelsIA.includes("back/mutant-12"), "l'action auto_ia du cycle 1 doit avoir été appliquée");
  assert.ok(appelsDev.includes("back/form-non-exerce"), "l'action manuelle_dev du cycle 1 doit avoir été déclenchée (appel documenté)");
});

// --------------------------------------------------------------------------------------------
// VERT (aussi) — séquence non convergente : N épuisés, K écarts classés = état terminal honnête.
// --------------------------------------------------------------------------------------------

test("orchestrerBoucle (VERT) : séquence non convergente -> cycles_epuises à N, écart humain classé", async () => {
  const rapportInitial = f("non-convergent-cycle-1.json");
  const suite = [f("non-convergent-cycle-2.json"), f("non-convergent-cycle-3.json")]; // plateau ensuite
  const resultat = await orchestrerBoucle({
    rapportInitial,
    reprendre: reprendreDepuisSequence(suite),
    nMax: 3,
  });
  assert.equal(resultat.statut, "cycles_epuises");
  assert.equal(resultat.cycles, 3, "doit s'arrêter EXACTEMENT à N, ni avant ni après");
  assert.equal(resultat.ecarts.length, 1);
  assert.equal(resultat.ecarts[0].categorie, "manuelle_utilisateur");
  assert.equal(resultat.ecarts[0].finding_ref, "design/golden-accueil");
  assert.deepEqual(resultat.ecarts_par_categorie.manuelle_utilisateur.map((e) => e.finding_ref), ["design/golden-accueil"]);
  // Jamais "vert" malgré 3 cycles écoulés : le triplet n'est pas aux seuils.
  assert.equal(cibleAtteinte(resultat.rapport), false);
});

// --------------------------------------------------------------------------------------------
// Oracle 1 — la boucle s'arrête à N cycles, prouvé en la bornant PLUS BAS que la séquence
// disponible : si elle ignorait la borne, elle continuerait et finirait par converger (la
// séquence convergente le permettrait) ; bornée à 1, elle doit s'arrêter avant.
// --------------------------------------------------------------------------------------------

test("oracle : bornée à N=1, s'arrête à 1 cycle même si la séquence continuerait à s'améliorer", async () => {
  const rapportInitial = f("convergent-cycle-1.json");
  const suite = [f("convergent-cycle-2.json"), f("convergent-cycle-3-terminal.json")];
  const resultat = await orchestrerBoucle({
    rapportInitial,
    reprendre: reprendreDepuisSequence(suite),
    nMax: 1,
  });
  assert.equal(resultat.cycles, 1, "G-2 : jamais plus que N, même si converger semblait proche");
  assert.equal(resultat.statut, "cycles_epuises", "cycle 1 (convergent-cycle-2) n'atteint pas encore la cible -> honnête, pas vert");
});

// --------------------------------------------------------------------------------------------
// Oracle 2 — ne déclare JAMAIS "cible_atteinte" avec un écart résiduel : preuve directe par le
// garde-fou dédié, dans les deux sens (refuse à tort ; laisse passer à raison).
// --------------------------------------------------------------------------------------------

test("oracle (ROUGE) : garantirHonnetete refuse \"cible_atteinte\" tant qu'un écart subsiste", () => {
  const rapportAvecEcart = f("non-convergent-cycle-1.json");
  assert.throws(
    () => garantirHonnetete("cible_atteinte", rapportAvecEcart),
    /refus \(G-2\)/,
    "un vert forcé sur un rapport avec écart doit être refusé, pas seulement déconseillé"
  );
});

test("oracle (VERT) : garantirHonnetete laisse passer \"cible_atteinte\" quand 0 écart réel", () => {
  const rapportPropre = f("convergent-cycle-3-terminal.json");
  assert.equal(garantirHonnetete("cible_atteinte", rapportPropre), true);
});

// --------------------------------------------------------------------------------------------
// Oracle 3 — un finding sans action classée fait échouer la boucle, jamais disparaître en
// silence (miroir de l'invariant réel de forge_tests/actions.py : classifier()).
// --------------------------------------------------------------------------------------------

test("oracle (ROUGE) : un finding orphelin (sans action) fait échouer la boucle, jamais disparaître", async () => {
  const rapportOrphelin = {
    cycle: 1,
    verdict: "PARTIEL",
    triplet: { couverture: 0.5, passage: 0.5, mutation: 0.2 },
    seuils: { couverture: 1.0, passage: 1.0, mutation: 0.7 },
    findings: [{ id: "back/x", pan: "back", classe: "element-non-exerce", message: "x jamais atteint" }],
    actions: [], // <- aucune action pour ce finding : orphelin
  };
  await assert.rejects(
    () => orchestrerBoucle({ rapportInitial: rapportOrphelin, reprendre: async () => rapportOrphelin }),
    /orphelin/,
    "la boucle doit refuser de démarrer sur un rapport qui laisse un finding sans action"
  );
});

test("classerActions : détecte l'orphelin explicitement (pas seulement via l'exception de la boucle)", () => {
  const { orphelins } = classerActions({
    findings: [{ id: "a" }, { id: "b" }],
    actions: [{ finding_ref: "a", categorie: "auto_ia" }],
  });
  assert.equal(orphelins.length, 1);
  assert.equal(orphelins[0].id, "b");
});

// --------------------------------------------------------------------------------------------
// Exécution
// --------------------------------------------------------------------------------------------

let echecs = 0;
for (const { nom, fn } of tests) {
  try {
    await fn();
    console.log(`  PASS  ${nom}`);
  } catch (err) {
    echecs += 1;
    console.error(`  FAIL  ${nom}`);
    console.error(`        ${err.stack || err.message}`);
  }
}
console.log(`\n${tests.length - echecs}/${tests.length} tests verts`);
process.exit(echecs ? 1 : 0);
