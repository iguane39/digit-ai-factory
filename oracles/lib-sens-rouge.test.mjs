#!/usr/bin/env node
/**
 * lib-sens-rouge.test.mjs — LE MÉCANISME QUI MESURE LE DOUBLE SENS LE TIENT LUI-MÊME (TF-1082).
 *
 * Un compteur de couverture qui compterait tout le monde serait rassurant et faux : c'est
 * exactement la classe de défaut qu'il existe pour mesurer. Chaque règle de lecture est donc
 * prouvée dans ses DEUX sens — une sortie qui DÉCLARE un cas rouge est reconnue, une sortie qui
 * n'en déclare aucun ne l'est PAS, et les pièges du dépôt (le « 0 FAIL » de fin de résumé, les
 * entrées d'état du parc, les recettes en échec) sont chacun leur propre borne.
 *
 * Joué par `oracles\self-tests.mjs` (I2 : tout `*.test.mjs` du dépôt est joué).
 */
import { marquesSensRouge, porteUneRecette, confronterSensRouge } from "./lib-sens-rouge.mjs";

const echecs = [];
const verifier = (nom, condition) => { if (!condition) echecs.push(nom); };

// ── SENS VERT — ce qui DOIT être reconnu, dans les trois formes observées au dépôt ──────────
verifier("VERT — un cas étiqueté rouge dans une ligne de détail est reconnu",
  marquesSensRouge("  [PASS] rouge R13 : classe hors référentiel → FAIL exit 1, règle nommée").length > 0);
verifier("VERT — une couverture « DEUX sens » annoncée au résumé est reconnue",
  marquesSensRouge("lib-vue-html (TF-0907) : 8/8 — chaque règle prouvée dans ses DEUX sens").length > 0);
verifier("VERT — une recette « à double sens » est reconnue",
  marquesSensRouge("recette à double sens de oracle-conformite-projet : 93 PASS").length > 0);
verifier("VERT — l'intention écrite « doit échouer » est reconnue",
  marquesSensRouge("le cas suivant doit échouer, et il échoue").length > 0);

// ── SENS ROUGE — ce qui NE DOIT PAS être reconnu. Sans ces cas, le compteur compterait tout ──
verifier("ROUGE — une recette qui ne joue que des fixtures conformes n'est PAS comptée couverte",
  marquesSensRouge("  [PASS] verte : projet conforme → PASS exit 0\nSelf-test : 12 PASS").length === 0);
verifier("ROUGE — le « 0 FAIL » qui clôt presque tous les résumés du dépôt ne vaut PAS cas rouge",
  marquesSensRouge("Self-test TODO-FORGE : 58 PASS, 0 FAIL").length === 0);
verifier("ROUGE — le mot « échec » seul ne vaut pas l'intention « doit échouer »",
  marquesSensRouge("aucun échec relevé sur le parc").length === 0);
verifier("ROUGE — une sortie vide ou absente n'est jamais comptée couverte",
  marquesSensRouge("").length === 0 && marquesSensRouge(undefined).length === 0);

// ── LES BORNES DE POPULATION — qui est MESURÉ, et qui ne l'est pas ───────────────────────────
verifier("BORNE — un oracle d'état joué sur le parc réel (I4) n'est pas une recette : il rend un verdict, pas des cas",
  !porteUneRecette({ statut: "OK", via: "I4 (oracle d'état)", sortie: "" }));
verifier("BORNE — une recette EN ÉCHEC n'est pas mesurée : elle a déjà son verdict",
  !porteUneRecette({ statut: "ECHEC", via: "--self-test", sortie: "  [PASS] rouge : …" }));
verifier("BORNE — une recette verte jouée par --self-test ou par I2 EST mesurée",
  porteUneRecette({ statut: "OK", via: "--self-test", sortie: "" })
  && porteUneRecette({ statut: "OK", via: "I2 (fichier de test du dépôt)", sortie: "" }));

// ── LE BILAN — il compte ce qu'il dit compter, et nomme ce qui manque ────────────────────────
{
  const bilan = confronterSensRouge([
    { nom: "a.test.mjs", statut: "OK", via: "I2", sortie: "[PASS] rouge : la règle refuse" },
    { nom: "b.test.mjs", statut: "OK", via: "I2", sortie: "[PASS] verte : 3 PASS, 0 FAIL" },
    { nom: "c.mjs (parc réel)", statut: "OK", via: "I4 (oracle d'état)", sortie: "PASS sur le parc" },
    { nom: "d.test.mjs", statut: "ECHEC", via: "I2", sortie: "[FAIL] rouge : …" },
  ]);
  verifier("BILAN — seules les recettes vertes portant des cas sont mesurées (2 sur 4)", bilan.mesurees === 2);
  verifier("BILAN — le compte des couvertes est juste (1)", bilan.avecRouge === 1);
  verifier("BILAN — la recette sans cas rouge est NOMMÉE, jamais fondue dans un total",
    bilan.sansRouge.length === 1 && bilan.sansRouge[0].nom === "b.test.mjs");
  verifier("BILAN — l'entrée d'état du parc n'entre ni au numérateur ni au dénominateur",
    !bilan.sansRouge.some((x) => x.nom.includes("parc réel")));
}

if (echecs.length) {
  console.error("lib-sens-rouge : FAIL\n  - " + echecs.join("\n  - "));
  process.exit(1);
}
console.log("lib-sens-rouge (TF-1082) : 15/15 PASS — les trois formes de cas ROUGE du dépôt sont "
  + "reconnues, une recette qui ne joue que des fixtures conformes ne l'est PAS, le « 0 FAIL » de "
  + "fin de résumé ne vaut pas preuve, et les bornes de population tiennent (état du parc et "
  + "recette en échec hors mesure) ; chaque règle de lecture est prouvée dans ses DEUX sens");
