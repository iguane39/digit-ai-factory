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

cas("declencherDevelopment ne lance RIEN — et c'est le contrat, pas un manque", () => {
  // TF-0363 : `CONTRAT-INTERFACE` §4 ligne Development désigne la CONSTRUCTION DIRECTE PAR
  // AGENT, et déclare `conductor` inutilisable en headless (dette D-V1, assumée le 14/08).
  const r = declencherDevelopment({ finding_ref: "H-13", produit: "C:/dev/un-produit" });

  assert.equal(r.joue, false);
  assert.match(r.motif, /construction DIRECTE PAR AGENT/);
  assert.match(r.motif, /D-V1/, "le motif cite la dette qui l'a décidé, il ne l'affirme pas");
});

cas("aucun appel à `conductor` ne subsiste dans le module", () => {
  // Le verrou du correctif : deux versions de ce fichier ont appelé conductor, l'une avec une
  // option inventée. Un test qui vérifie l'absence du NOM est le seul qui attrape la récidive.
  const source = readFileSync(new URL("./appels-reels.mjs", import.meta.url), "utf8");
  // Le motif du refus CITE `conductor` en prose — c'est voulu, il explique pourquoi on ne
  // l'appelle pas. Ce qu'on traque est le jeton COMMANDE : `"conductor"` entre guillemets,
  // la forme sous laquelle il entrerait dans un tableau d'arguments.
  const guillemet = String.fromCharCode(34) + "conductor" + String.fromCharCode(34);
  const apostrophe = String.fromCharCode(39) + "conductor" + String.fromCharCode(39);
  const jeton = [guillemet, apostrophe];
  const appels = source.split(String.fromCharCode(10))
    .filter((l) => jeton.some((j) => l.includes(j)));

  assert.deepEqual(appels, [], "conductor ne doit apparaître qu'en prose, pas en appel");

  // Second sens : le motif du refus contient bien le mot en PROSE, et le verrou l ignore.
  assert.ok(source.includes("`conductor` y est déclaré inutilisable"),
    "la prose qui explique le refus doit rester lisible dans le module");
  // Et il attraperait un vrai appel : la forme traquée est celle d un argument de commande.
  const faux = ['    args: ["run", ' + guillemet + ', "--mode"],'].join("");
  assert.ok(jeton.some((j) => faux.includes(j)),
    "le motif du verrou doit reconnaître un conductor passé en argument");
});

cas("l'ordre de construction porte les gates du CONTRAT, pas des gates inventés", () => {
  const r = declencherDevelopment({ finding_ref: "H-13", produit: "C:/x" });

  assert.deepEqual(r.ordre.gates, ["ruff check", "pytest"]);
  assert.equal(r.ordre.etape_cible, "development");
  assert.match(r.ordre.spec, /run-playbook\.md$/, "la spec est le playbook, source unique (TF-0007)");
  assert.match(r.ordre.frontiere, /G-2 absolue/);
});

cas("un playbook introuvable est DIT, jamais supposé lisible", () => {
  const r = declencherDevelopment({ finding_ref: "H-13", produit: "C:/x" }, { racine: "Z:/vide" });

  assert.equal(r.ordre.spec_lisible, false);
  assert.match(r.motif, /playbook cité est introuvable/);
});

cas("sans produit, l'ordre est REFUSÉ — deviner la cible serait choisir où écrire du code", () => {
  const r = declencherDevelopment({ finding_ref: "H-13" });

  assert.equal(r.joue, false);
  assert.match(r.motif, /sans cible désignée/);
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
