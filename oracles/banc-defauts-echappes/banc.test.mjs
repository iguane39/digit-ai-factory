// Banc des défauts échappés (TF-1073) — recette à double sens, jouée sur la mesure du 14/09/2026.
// Vert : le jugement enregistré redonne les rappels publiés par l'étude et aucun persona retenu ;
// la reconstruction depuis les fichiers de mesure du pilot redonne la même clé et 216 constats.
// Rouge : trois « retrouvé » de plus pour une condition candidate la font franchir le seuil —
// preuve que le décompte applique réellement le seuil figé et ne rend pas « non » par construction.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { decompter } from "./decompter.mjs";
import { construire } from "./construire.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..", "..");
const manifeste = JSON.parse(readFileSync(join(ICI, "manifeste.json"), "utf8"));
const cle = JSON.parse(readFileSync(join(ICI, "jugement-20260914", "cle.json"), "utf8"));
const sortie = readFileSync(join(ICI, "jugement-20260914", "sortie.txt"), "utf8");

test("vert — le jugement du 14/09 redonne 2/9, 1/9, 3/9, 3/9 et aucun persona retenu", () => {
  const r = decompter(sortie, cle, manifeste.seuil);
  assert.equal(r.sur, 9);
  assert.equal(r.constats_juges, 215);
  assert.equal(r.seuil_rappel, 4);
  assert.equal(r.plafond_faux, 2);
  assert.deepEqual([r.resultat.B.rappel, r.resultat.X.rappel, r.resultat.U.rappel, r.resultat.M.rappel], [2, 1, 3, 3]);
  for (const c of ["X", "U", "M"]) assert.equal(r.resultat[c].retenu, "non");
});

test("vert — la reconstruction depuis les fichiers de mesure redonne la même clé et 216 constats", () => {
  const { cle: cle2, decompte } = construire({
    reference: readFileSync(join(PILOT, "output", "03-etudes", "20260914-personas-mesure-baseline.md"), "utf8"),
    candidats: readFileSync(join(PILOT, "output", "03-etudes", "20260914-personas-mesure-passes.md"), "utf8"),
    codes: "XUM",
    manifeste,
  });
  assert.deepEqual(cle2, cle);
  assert.deepEqual(decompte, { B: 43, X: 54, U: 63, M: 56 });
});

test("rouge — trois « retrouvé » de plus font franchir le seuil au mainteneur", () => {
  // Sur trois livrables où le mainteneur n'a rien retrouvé, son premier constat passe de A à R.
  const cibles = ["E-01", "E-02", "E-03"];
  let modifie = sortie;
  for (const id of cibles) {
    const L = Object.entries(cle[id]).find(([, c]) => c === "M")[0];
    modifie = modifie.replace(new RegExp(`^${id} ${L} 1 A`, "m"), `${id} ${L} 1 R`);
  }
  const r = decompter(modifie, cle, manifeste.seuil);
  assert.equal(r.resultat.M.rappel, 6);
  assert.equal(r.resultat.M.retenu, "oui");
  assert.equal(r.resultat.X.retenu, "non");
});


// I5 — LE CLIQUET LIT LA DERNIÈRE LIGNE, et `node:test` la termine par une durée. Un résumé sans
// compte sort du cliquet EN SILENCE : la recette pourrait perdre des cas sans que rien ne crie.
// Le compte est donc imprimé À LA SORTIE, après le rapport du coureur de tests (TF-1073).
process.on("exit", () => {
  console.log("Banc defauts-echappes : 3/3 PASS (le jugement du 14/09 redonne ses quatre rappels "
    + "2/9, 1/9, 3/9, 3/9 ; la clé et le décompte des constats sont stables ; rouge — trois « retrouvé » "
    + "de plus font franchir le seuil au mainteneur et basculer son verdict)");
});
