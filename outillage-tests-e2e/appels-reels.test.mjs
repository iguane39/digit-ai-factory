// TF-0360 — le câblage réel de la boucle, et la frontière qu'il tient (option O3).
//
// Ce qui est prouvé ici sans lancer de vraie campagne : la FRONTIÈRE. Le pilot ne recalcule
// aucun des cinq points de fin — il lit le verdict que forge-tests rend dans la section
// `boucle` de son rapport. Les deux cas qui comptent sont ceux où le pilot pourrait mentir :
// un rapport qui se dit terminé mais porte un écart, et un rapport SANS la section (forge-tests
// antérieure au 18/08) où il serait tentant de deviner.
//
// Les appels de sous-processus eux-mêmes ne sont pas joués : un test qui lancerait un audit
// complet mettrait des minutes et dépendrait de Docker. Ce qui est vérifié d'eux, c'est ce qui
// se vérifie sans les jouer — la forme de la commande, la racine d'exécution, et le refus de
// prétendre avoir joué ce qu'on n'a pas joué.

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  JOURNAL_BOUCLE,
  declencherDevelopment,
  finDeCampagne,
  journaliserTour,
  racineForges,
  tourDepuisRapport,
} from "./appels-reels.mjs";
import { cibleAtteinte } from "./orchestrer-boucle.mjs";

let verts = 0;
const rouges = [];
const cas = (titre, fn) => {
  try {
    fn();
    verts += 1;
    console.log(`  PASS  ${titre}`);
  } catch (e) {
    rouges.push(`${titre} — ${e.message}`);
    console.log(`  ROUGE ${titre} — ${e.message}`);
  }
};

const RAPPORT_VERT = {
  triplet: { couverture: 0.95, passage: 1, mutation: 0.8 },
  seuils: { couverture: 0.9, passage: 1, mutation: 0.5 },
  actions: [],
};

console.log("\nla frontière O3 — forge-tests juge la fin, le pilot lit");

cas("un rapport dont forge-tests dit `terminee` autorise le vert", () => {
  const rapport = { ...RAPPORT_VERT, boucle: { statut: "terminee", manques: [] } };
  assert.equal(cibleAtteinte(rapport), true);
});

cas("un rapport dont forge-tests dit `en_cours` INTERDIT le vert, triplet vert ou pas", () => {
  const rapport = {
    ...RAPPORT_VERT,
    boucle: { statut: "en_cours", manques: ["porte « e2e » ABSENTE du journal"] },
  };
  assert.equal(cibleAtteinte(rapport), false, "le pilot a recalculé au lieu de lire");
});

cas("le triplet reste une condition NÉCESSAIRE — les deux juges s'ajoutent", () => {
  const rapport = {
    triplet: { couverture: 0.2 },
    seuils: { couverture: 0.9 },
    actions: [{ finding_ref: "x", categorie: "auto_ia" }],
    boucle: { statut: "terminee" },
  };
  assert.equal(cibleAtteinte(rapport), false, "une campagne close ne rend pas un écart vert");
});

cas("sans section `boucle`, le pilot ne DEVINE pas : il retombe sur l'ancien juge", () => {
  assert.equal(cibleAtteinte(RAPPORT_VERT), true);
  const lecture = finDeCampagne(RAPPORT_VERT);
  assert.equal(lecture.connue, false);
  assert.equal(lecture.terminee, false);
  assert.match(lecture.libelle, /antérieure à TF-0352/);
});

cas("finDeCampagne rend les MANQUES tels quels, sans les reformuler", () => {
  const manques = ["3 anomalie(s) restante(s) pour 0 écart(s) assumé(s) et écrit(s) (d)"];
  const lecture = finDeCampagne({ boucle: { statut: "en_cours", manques, libelle: "…" } });
  assert.equal(lecture.connue, true);
  assert.deepEqual(lecture.manques, manques);
});

console.log("\nle journal de boucle — écrit chez le PRODUIT, c'est sa campagne");

cas("un tour est APPENDÉ, jamais réécrit : l'histoire des tours est le sujet", () => {
  const produit = mkdtempSync(join(tmpdir(), "produit-"));
  journaliserTour(produit, { tour: 1, restantes: 4 });
  journaliserTour(produit, { tour: 2, restantes: 0 });
  const lignes = readFileSync(join(produit, JOURNAL_BOUCLE), "utf8").trim().split("\n");
  assert.equal(lignes.length, 2);
  assert.equal(JSON.parse(lignes[0]).tour, 1);
  assert.equal(JSON.parse(lignes[1]).tour, 2);
});

cas("le journal se crée même si `forge/` n'existe pas encore chez le produit", () => {
  const produit = mkdtempSync(join(tmpdir(), "produit-nu-"));
  const chemin = journaliserTour(produit, { tour: 1 });
  assert.ok(readFileSync(chemin, "utf8").includes('"tour":1'));
});

cas("le tour est DÉRIVÉ du rapport — un chiffre saisi deux fois diverge", () => {
  const rapport = {
    actions: [
      { finding_ref: "a", categorie: "auto_ia" },
      { finding_ref: "b", categorie: "manuelle_dev" },
      { finding_ref: "c", categorie: "manuelle_utilisateur" },
    ],
  };
  // Le correctif est daté d'il y a une heure : figer une date en dur ferait dépendre ce
  // test de l'horloge du poste, et un test qui échoue selon l'heure se désarme vite.
  const correctif = new Date(Date.now() - 3600_000).toISOString();
  const tour = tourDepuisRapport(3, rapport, { dernierCorrectif: correctif });
  assert.equal(tour.anomalies_entrantes, 3);
  assert.equal(tour.restantes, 2, "seules les `auto_ia` sont traitées par la boucle");
  assert.equal(tour.corrigees, 1);
  assert.equal(tour.dernier_correctif, correctif);
  // Comparaison de DATES, jamais de chaînes : « …Z » et « …+02:00 » ne se comparent pas
  // lexicographiquement, et c'est exactement le champ sur lequel TF-0353 refuse une clôture.
  assert.ok(
    new Date(tour.dernier_run_suite) > new Date(tour.dernier_correctif),
    "le rejeu est postérieur au dernier correctif (point (e) de TF-0353)",
  );
});

console.log("\nles appels — la forme, et le refus de prétendre");

cas("declencherDevelopment ne PRÉTEND jamais avoir joué (loi 5)", () => {
  const r = declencherDevelopment({ finding_ref: "H-13" });
  assert.equal(r.joue, false);
  assert.match(r.motif, /gates|absente/);
  assert.equal(r.commande.binaire, "uv");
  assert.ok(r.commande.args.includes("conductor"));
  assert.ok(r.commande.args.includes("H-13"), "l'action est portée dans la commande rendue");
});

cas("la racine des forges suit la règle du noyau (FORGE_ROOT, sinon le parent)", () => {
  const avant = process.env.FORGE_ROOT;
  process.env.FORGE_ROOT = "Z:/ailleurs";
  assert.equal(racineForges(), "Z:/ailleurs");
  if (avant === undefined) delete process.env.FORGE_ROOT;
  else process.env.FORGE_ROOT = avant;
  assert.ok(racineForges().length > 0);
});

console.log("");
if (rouges.length) {
  console.log(`${rouges.length} test(s) rouge(s) sur ${verts + rouges.length}`);
  process.exit(1);
}
console.log(`${verts}/${verts} tests verts`);
