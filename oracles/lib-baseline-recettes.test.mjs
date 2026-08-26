#!/usr/bin/env node
/**
 * lib-baseline-recettes.test.mjs — le CLIQUET du nombre de cas par recette (TF-0681).
 *
 * LE FAIT QU'IL FERME. Le 26/08/2026, un fichier de recette a été écrasé et ONZE CAS ont
 * disparu. Le harnais a rendu tout vert : il joue le fichier, lit sa ligne de résumé, compte un
 * OK — et ce compte est AUTO-DÉCLARÉ, donc rien ne savait ce qu'il valait la veille.
 *
 * Les promesses, chacune dans les deux sens :
 *   · une BAISSE est un échec, une HAUSSE inscrit la nouvelle valeur ;
 *   · les DEUX formes de résumé du dépôt sont lues — imposer une forme unique ferait sortir du
 *     cliquet toutes les recettes existantes le jour de sa publication ;
 *   · un résumé ILLISIBLE est déclaré non jugé, jamais tenu pour conforme ;
 *   · une recette EN ÉCHEC ne fait pas baisser la baseline — son compte partiel n'a rien à voir
 *     avec la disparition d'un cas.
 */
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { compteDe, confronter, ecrire, lire } from "./lib-baseline-recettes.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "baseline-recettes-"));
const JOUR = "2026-08-26";
const ok = (nom, resume) => ({ nom, statut: "OK", resume });

// ── la lecture du compte ─────────────────────────────────────────────────────────────────────

check("les DEUX formes de résumé du dépôt sont lues", () => {
  // Imposer une forme unique ferait sortir du cliquet toutes les recettes existantes le jour de
  // sa publication — le contrôle mesurerait alors l'écart à son auteur, pas la couverture.
  att(compteDe("emettre-travaux (TF-0627) : 24 PASS, 0 FAIL") === 24, "forme « N PASS » mal lue");
  att(compteDe("Self-test unicite : 14/14 PASS (verte PASS…)") === 14, "forme « N/N PASS » mal lue");
  att(compteDe("Self-test conformité projet : 44 PASS, 0 FAIL") === 44, "compte à deux chiffres mal lu");
});

check("le ratio nu est lu SANS exiger le mot « PASS »", () => {
  // Mesure du premier passage du cliquet : exiger « PASS » laissait 39 recettes sur 73 hors du
  // contrôle, dont deux familles parfaitement comptables. Une règle qui impose une forme que le
  // dépôt n'emploie pas mesure l'écart à son auteur, pas la couverture.
  att(compteDe("relever-heritage : 14/14 tests verts") === 14, "« N/N tests verts » non lu");
  att(compteDe("Recette cadence : 16/16 cas") === 16, "« Recette X : N/N cas » non lu");
});

check("un verdict d'ÉTAT du parc n'est pas pris pour un compte de cas", () => {
  // Les oracles d'état rendent « I4 — PASS sur le parc » : aucun chiffre, donc rien à compter.
  // Les compter à zéro ferait échouer le cliquet à chaque exécution sur une absence normale.
  att(compteDe("I4 — PASS sur le parc") === null, "un verdict d'état a produit un compte");
  att(compteDe("I3 — familles numérotées : disque et tables d'accord") === null,
    "une ligne sans chiffre a produit un compte");
});

check("un résumé sans compte rend `null`, et `null` n'est PAS zéro", () => {
  // Zéro cas serait un FAIT ; illisible est un AVEU. Les confondre ferait tomber la baseline
  // d'une recette à chaque changement de sa mise en forme.
  att(compteDe("tout va bien") === null, "un résumé sans chiffre a rendu un compte");
  att(compteDe("") === null, "un résumé vide a rendu un compte");
  att(compteDe(undefined) === null, "une absence de résumé a levé ou rendu un compte");
});

// ── le cliquet ───────────────────────────────────────────────────────────────────────────────

check("une BAISSE est dénoncée, avec le nombre exact de cas perdus", () => {
  // Le cas fondateur, aux chiffres près : 22 cas devenus 11.
  const b = confronter([ok("todo/x.test.mjs", "x : 11 PASS, 0 FAIL")],
    { "todo/x.test.mjs": { cas: 22, vu_le: "2026-08-25" } }, JOUR);
  att(b.baisses.length === 1, "la baisse n'est pas dénoncée");
  att(b.baisses[0].perdus === 11, `${b.baisses[0].perdus} cas perdus annoncés au lieu de 11`);
  att(b.baseline["todo/x.test.mjs"].cas === 22, "la baseline a été abaissée sans décision");
});

check("une HAUSSE inscrit la nouvelle valeur — le cliquet ne descend jamais", () => {
  const b = confronter([ok("todo/x.test.mjs", "x : 24 PASS, 0 FAIL")],
    { "todo/x.test.mjs": { cas: 11, vu_le: "2026-08-25" } }, JOUR);
  att(b.baisses.length === 0, "une hausse a été prise pour une baisse");
  att(b.baseline["todo/x.test.mjs"].cas === 24, "la hausse n'a pas été inscrite");
  att(b.baseline["todo/x.test.mjs"].vu_le === JOUR, "la date de la hausse n'est pas inscrite");
});

check("un compte ÉGAL ne bouge rien — ni écriture, ni verdict", () => {
  const b = confronter([ok("todo/x.test.mjs", "x : 11 PASS, 0 FAIL")],
    { "todo/x.test.mjs": { cas: 11, vu_le: "2026-08-25" } }, JOUR);
  att(b.baisses.length === 0 && b.montees.length === 0, "un compte stable a produit un mouvement");
  att(b.baseline["todo/x.test.mjs"].vu_le === "2026-08-25", "la date a bougé sans raison");
});

check("une recette INCONNUE de la baseline est une première mesure, pas une baisse", () => {
  const b = confronter([ok("todo/neuve.test.mjs", "neuve : 5 PASS, 0 FAIL")], {}, JOUR);
  att(b.baisses.length === 0, "une recette neuve a été prise pour une baisse");
  att(b.montees.length === 1 && b.montees[0].avant === null, "la première mesure n'est pas signalée comme telle");
  att(b.baseline["todo/neuve.test.mjs"].cas === 5, "la première mesure n'est pas inscrite");
});

// ── les bornes ───────────────────────────────────────────────────────────────────────────────

check("une recette EN ÉCHEC ne fait pas baisser la baseline", () => {
  // Une recette en échec a déjà son verdict. Lire son compte partiel ferait baisser la baseline
  // pour une raison qui n'a RIEN à voir avec la disparition d'un cas — et le vrai défaut, une
  // fois la recette réparée, passerait alors inaperçu.
  const b = confronter([{ nom: "todo/x.test.mjs", statut: "ECHEC", resume: "x : 3 PASS, 8 FAIL" }],
    { "todo/x.test.mjs": { cas: 11, vu_le: "2026-08-25" } }, JOUR);
  att(b.baisses.length === 0, "une recette en échec a été comptée comme une baisse");
  att(b.baseline["todo/x.test.mjs"].cas === 11, "la baseline a bougé sur une recette en échec");
});

check("un résumé ILLISIBLE est DÉCLARÉ non jugé, jamais tenu pour conforme", () => {
  // Sans cela, une recette qui change son format de sortie sortirait du cliquet SANS QUE
  // PERSONNE NE LE VOIE — exactement la classe de défaut que ce cliquet existe pour fermer.
  const b = confronter([ok("todo/muette.test.mjs", "tout va bien")],
    { "todo/muette.test.mjs": { cas: 11, vu_le: "2026-08-25" } }, JOUR);
  att(b.nonLus.length === 1, "la recette illisible n'est pas déclarée");
  att(b.baisses.length === 0, "un résumé illisible a été pris pour une baisse");
  att(b.baseline["todo/muette.test.mjs"].cas === 11, "la baseline a bougé sur un résumé illisible");
});

check("une baseline absente ou abîmée rend un objet vide, jamais une exception", () => {
  // Un cliquet qui lève sur son propre fichier transformerait une donnée manquante en panne du
  // harnais entier — et le harnais est ce qui juge tout le reste.
  att(Object.keys(lire(join(T, "il-n-existe-pas.json"))).length === 0, "un fichier absent a levé");
  const abime = join(T, "abime.json");
  writeFileSync(abime, "{ ceci n'est pas du JSON", "utf8");
  att(Object.keys(lire(abime)).length === 0, "un fichier abîmé a levé");
  const tableau = join(T, "tableau.json");
  writeFileSync(tableau, "[1,2,3]", "utf8");
  att(Object.keys(lire(tableau)).length === 0, "un tableau a été accepté comme baseline");
});

check("le fichier écrit est TRIÉ — un fichier versionné dont l'ordre bouge est illisible", () => {
  const f = join(T, "baseline.json");
  ecrire(f, { "z/z.test.mjs": { cas: 1 }, "a/a.test.mjs": { cas: 2 } });
  const relu = readFileSync(f, "utf8");
  att(relu.indexOf("a/a.test.mjs") < relu.indexOf("z/z.test.mjs"), "les clés ne sont pas triées");
  att(Object.keys(lire(f)).length === 2, "le fichier écrit ne se relit pas");
});

check("le cliquet reste MUET sur ce qu'il n'a pas vu — aucune recette inventée", () => {
  // Une baseline qui porte une recette disparue ne doit pas la faire échouer ici : ce cliquet
  // compte des CAS, pas des FICHIERS. La disparition d'un fichier entier est un autre objet,
  // et le prétendre couvert serait la demi-couverture que N-38 dénonce.
  const b = confronter([], { "todo/disparue.test.mjs": { cas: 11, vu_le: "2026-08-25" } }, JOUR);
  att(b.baisses.length === 0 && b.nonLus.length === 0, "le cliquet s'est prononcé sur une absence");
  att(b.baseline["todo/disparue.test.mjs"].cas === 11, "l'entrée d'une recette absente a été perdue");
});

console.log(`\nbaseline-recettes (TF-0681) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
