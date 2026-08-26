// TF-0673 — la SECONDE SOURCE du canal pilot → produit, et les deux façons dont elle peut mentir.
//
// LE FAIT QUI A OUVERT CETTE SOURCE. `emettre-travaux.mjs` est le seul canal du pilot vers un
// produit, et il était câblé en dur sur une unique classe de travail : les artefacts d'héritage.
// Tout autre constat destiné à un produit n'avait AUCUNE VOIE — le défaut exact que ce script
// existe pour corriger, son propre en-tête l'écrivant : *un état mesuré qui n'atteint pas son
// destinataire ne devient pas un travail fait.*
//
// LE FAIT QUI A RENDU CETTE RECETTE NÉCESSAIRE, et il est arrivé au premier essai. Le rendez-vous
// ne se faisait pas : le relevé nomme le produit « Produit-02.com », le registre écrit
// « Produit-02 ». L'émetteur a rendu « 1 déjà présent » — un message parfaitement normal —
// en perdant trois constats SANS UN MOT. Rien ne l'aurait dit ; seule une empreinte qui n'avait
// pas bougé l'a montré.
//
// Ces cas tiennent donc trois propriétés, chacune dans les deux sens :
//   1. le rendez-vous SE FAIT malgré le suffixe de domaine, et il REFUSE l'inclusion ;
//   2. un constat orphelin est DÉNONCÉ, jamais perdu ;
//   3. un champ absent du registre est DIT absent, jamais comblé par de la prose plausible.

import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  blocConstat, constatsDestines, constatsDuRegistre, memeProduit, normaliserProduit, orphelins,
} from "./emettre-travaux.mjs";

const dir = mkdtempSync(join(tmpdir(), "emettre-travaux-"));

/** Un registre de fixture : append-only, un événement par ligne, comme le vrai. */
const registre = (evenements) => {
  const p = join(dir, `reg-${evenements.length}-${Math.abs(hash(evenements))}.jsonl`);
  writeFileSync(p, evenements.map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
  return p;
};
const hash = (o) => [...JSON.stringify(o)].reduce((a, c) => ((a * 31 + c.charCodeAt(0)) | 0), 7);

const casse = [];
const cas = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); }
  catch (e) { casse.push(`${nom} — ${e.message}`); console.log(`  [FAIL] ${nom} : ${e.message}`); }
};

console.log("emettre-travaux — seconde source du canal (TF-0673)");

// ---------------------------------------------------------------------------------------------
// 1. LE RENDEZ-VOUS
// ---------------------------------------------------------------------------------------------

cas("le suffixe de domaine du dépôt ne fait pas manquer le rendez-vous", () => {
  assert.equal(normaliserProduit("Produit-02.com"), "produit-02");
  assert.ok(memeProduit("Produit-02", "Produit-02.com"));
});

cas("le rapprochement REFUSE l'inclusion — « Foo » n'est pas « FooBar »", () => {
  // Le motif vaut d'être tenu par un cas : une comparaison lâche qui se trompe dépose du travail
  // chez quelqu'un qui n'en est pas le destinataire. C'est PIRE que ne rien déposer — le vrai
  // destinataire n'apprend rien ET un autre est dérangé.
  assert.ok(!memeProduit("Foo", "FooBar"));
  assert.ok(!memeProduit("Foo", "FooBar.com"));
});

cas("un destinataire vide ne se rapproche de RIEN, pas même d'un autre vide", () => {
  assert.ok(!memeProduit("", ""));
  assert.ok(!memeProduit(undefined, "Foo"));
});

cas("un constat destiné au produit est retenu, et le rendez-vous traverse le suffixe", () => {
  const p = registre([
    { ev: "creation", id: "TF-9001", statut: "candidat", destinataire_produit: "MonProduit" },
  ]);
  assert.equal(constatsDuRegistre("MonProduit.com", p).length, 1);
});

cas("un constat CLOS n'est plus confié — sinon le produit le recevrait à chaque exécution", () => {
  const p = registre([
    { ev: "creation", id: "TF-9002", statut: "candidat", destinataire_produit: "MonProduit" },
    { ev: "maj", id: "TF-9002", statut: "corrige" },
  ]);
  assert.equal(constatsDuRegistre("MonProduit", p).length, 0);
});

cas("l'état se reconstitue par FUSION des événements, pas sur le dernier vu", () => {
  // Le registre est append-only : le titre écrit à la création n'est pas répété à chaque mise à
  // jour. Lire le seul dernier événement rendrait un constat sans titre ni contenu.
  const p = registre([
    { ev: "creation", id: "TF-9003", statut: "candidat", destinataire_produit: "MonProduit",
      titre: "Le titre d'origine", contenu: "le fait" },
    { ev: "maj", id: "TF-9003", statut: "decide", decideur: "humain" },
  ]);
  const [c] = constatsDuRegistre("MonProduit", p);
  assert.equal(c.titre, "Le titre d'origine");
  assert.equal(c.statut, "decide");
});

// ---------------------------------------------------------------------------------------------
// 2. L'ORPHELIN — la face voisine du défaut, celle dont le signal est nul par construction
// ---------------------------------------------------------------------------------------------

cas("un constat qui désigne un produit absent du parc est DÉNONCÉ", () => {
  const p = registre([
    { ev: "creation", id: "TF-9004", statut: "candidat", destinataire_produit: "ProduitDisparu" },
  ]);
  const perdus = orphelins([{ produit: "AutreProduit.com" }], p);
  assert.equal(perdus.length, 1);
  assert.equal(perdus[0].id, "TF-9004");
});

cas("un constat dont le produit EXISTE n'est pas dénoncé à tort", () => {
  const p = registre([
    { ev: "creation", id: "TF-9005", statut: "candidat", destinataire_produit: "MonProduit" },
  ]);
  assert.deepEqual(orphelins([{ produit: "MonProduit.com" }], p), []);
});

cas("un constat orphelin mais CLOS n'est pas dénoncé — il n'attend plus personne", () => {
  const p = registre([
    { ev: "creation", id: "TF-9006", statut: "candidat", destinataire_produit: "ProduitDisparu" },
    { ev: "maj", id: "TF-9006", statut: "ecarte" },
  ]);
  assert.deepEqual(orphelins([{ produit: "AutreProduit" }], p), []);
});

cas("un registre SANS aucun destinataire ne fabrique pas d'orphelins", () => {
  const p = registre([{ ev: "creation", id: "TF-9007", statut: "candidat" }]);
  assert.deepEqual(constatsDestines(p), []);
  assert.deepEqual(orphelins([{ produit: "MonProduit" }], p), []);
});

cas("un registre introuvable rend une liste vide, jamais une exception", () => {
  // Un émetteur qui lève sur un registre absent transformerait une donnée manquante en panne.
  assert.deepEqual(constatsDestines(join(dir, "il-n-existe-pas.jsonl")), []);
});

cas("une ligne illisible n'emporte pas les lignes saines", () => {
  const p = join(dir, "abime.jsonl");
  writeFileSync(p, '{"ev":"creation","id":"TF-9008","statut":"candidat","destinataire_produit":"MonProduit"}\n'
    + "{ ceci n'est pas du JSON\n", "utf8");
  assert.equal(constatsDuRegistre("MonProduit", p).length, 1);
});

// ---------------------------------------------------------------------------------------------
// 3. LE CHAMP ABSENT — dit absent, jamais comblé
// ---------------------------------------------------------------------------------------------

cas("un champ absent du registre est DIT absent, et le bloc désigne le registre", () => {
  // Un lot qui comblerait les trous par de la prose plausible ferait croire au produit qu'on lui
  // a écrit quelque chose de mesuré. L'aveu doit pointer l'endroit où il se corrige.
  const rendu = blocConstat({ id: "TF-9009", titre: "Un constat nu" });
  assert.match(rendu, /non renseigné au registre/);
  assert.match(rendu, /aucune demande explicite/);
  assert.match(rendu, /aucune vérification déclarée/);
});

cas("un constat COMPLET ne porte aucun aveu de manque", () => {
  const rendu = blocConstat({
    id: "TF-9010", titre: "Un constat complet", gravite: "majeur", contenu: "le fait mesuré",
    pourquoi_produit: "parce que", demande_produit: "faire ceci", effort: "simple × court",
    verification: "la commande rend PASS", consequence: "sinon ceci",
  });
  assert.ok(!rendu.includes("non renseigné au registre"), "un constat complet ne doit rien avouer");
  assert.match(rendu, /gravité majeur/);
});

cas("le bloc porte l'IDENTIFIANT — sans lui, le produit ne peut rattacher son avancement", () => {
  assert.match(blocConstat({ id: "TF-9011" }), /### TF-9011/);
});

console.log(casse.length
  ? `\nemettre-travaux : ${casse.length} cas en échec\n  - ${casse.join("\n  - ")}`
  : "\nemettre-travaux : 15/15 PASS (rendez-vous malgré le suffixe et refus de l'inclusion ; "
    + "orphelin dénoncé, et non dénoncé à tort ni quand il est clos ; registre absent ou abîmé "
    + "sans exception ; champ manquant DIT manquant, constat complet muet)");
process.exit(casse.length ? 1 : 0);
