#!/usr/bin/env node
/**
 * relever-campagnes-tests.test.mjs — le relevé des campagnes de tests, dans les deux sens (TF-2727, 15/11/2026).
 *
 * Le cas fondateur se rejoue sur des produits de fixture : des rapports PARTIEL à boucle `en_cours` sans aucun journal de tours,
 * que l'outil signale en exit 1 ; le remède (le journal de tours tenu) le fait passer en exit 0. Une campagne dont le dernier
 * rapport porte une boucle `terminee` est relevée, et la semaine se lit par `--depuis`. Aucun produit réel n'est lu.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const OUTIL = join(dirname(fileURLToPath(import.meta.url)), "relever-campagnes-tests.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (c, m) => { if (!c) throw new Error(m); };
const T = mkdtempSync(join(tmpdir(), "campagnes-"));
const lancer = (...a) => {
  const r = spawnSync(process.execPath, [OUTIL, ...a], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie illisible */ }
  return { code: r.status, j, brut: (r.stdout || "") + (r.stderr || "") };
};
/** Un produit de fixture : des rapports `{ nom: { verdict, boucle? } }`, un journal facultatif de `tours` lignes. */
function produit(nom, rapports, tours = null) {
  const racine = join(T, nom);
  const dossier = join(racine, "forge", "etapes", "tests");
  mkdirSync(dossier, { recursive: true });
  for (const [fichier, contenu] of Object.entries(rapports)) writeFileSync(join(dossier, fichier), typeof contenu === "string" ? contenu : JSON.stringify(contenu), "utf8");
  if (tours !== null) {
    writeFileSync(join(racine, "forge", "journal-boucle.jsonl"), "", "utf8");
    for (let i = 1; i <= tours; i++) appendFileSync(join(racine, "forge", "journal-boucle.jsonl"), JSON.stringify({ tour: i, cible_atteinte: false }) + "\n");
  }
  return racine;
}

try {
  check("rouge — 3 rapports PARTIEL à boucle en_cours et AUCUN journal : 3 partiels sans tour nommés, exit 1", () => {
    const p = produit("produit-a", {
      "rapport-20260901.json": { verdict: "PARTIEL", boucle: { statut: "en_cours" } },
      "rapport-20260905.json": { verdict: "PARTIEL", boucle: { statut: "en_cours" } },
      "rapport-20260909.json": { verdict: "PARTIEL", boucle: { statut: "en_cours" } },
    });
    const r = lancer(p, "--le", "2026-11-22");
    att(r.code === 1 && r.j.verdict === "FAIL", r.brut.slice(0, 300));
    att(r.j.mesure.partiels_sans_tour === 3 && r.j.mesure.rapports === 3, JSON.stringify(r.j.mesure));
    att(r.j.partiels_sans_tour.every((x) => x.produit === "produit-a") && r.j.partiels_sans_tour[0].fichier === "rapport-20260901.json", "le rapport n'est pas nommé");
    att(r.j.produits[0].journal.existe === false, "l'absence de journal n'est pas dite");
  });

  check("vert — le remède joué : le journal de tours tenu (1 tour), le même produit passe, exit 0", () => {
    const p = produit("produit-a2", { "rapport-20260901.json": { verdict: "PARTIEL", boucle: { statut: "en_cours" } } }, 1);
    const r = lancer(p, "--le", "2026-11-22");
    att(r.code === 0 && r.j.mesure.partiels_sans_tour === 0 && r.j.mesure.produits_avec_journal === 1, r.brut.slice(0, 300));
  });

  check("un journal VIDE ou sans ligne lisible n'est pas un tour : le rapport PARTIEL reste signalé", () => {
    const p = produit("produit-vide", { "rapport-20260901.json": { verdict: "FAIL" } }, 0);
    appendFileSync(join(p, "forge", "journal-boucle.jsonl"), "pas du json\n", "utf8");
    const r = lancer(p);
    att(r.code === 1 && r.j.produits[0].journal.existe === true && r.j.produits[0].journal.tours === 0, r.brut.slice(0, 300));
  });

  check("une campagne TERMINÉE (dernier rapport, boucle terminee) est relevée, et la semaine se lit par --depuis", () => {
    const recent = produit("produit-b", {
      "rapport-20260801.json": { verdict: "PARTIEL", boucle: { statut: "en_cours" } },
      "rapport-20261118.json": { verdict: "PASS", boucle: { statut: "terminee" } },
    }, 4);
    const ancien = produit("produit-c", { "rapport-20260817.json": { verdict: "PASS", boucle: { statut: "terminee" } } }, 3);
    const r = lancer(recent, ancien, "--le", "2026-11-22");
    att(r.code === 0 && r.j.mesure.campagnes_terminees === 2, r.brut.slice(0, 300));
    att(r.j.mesure.terminees_depuis === 1 && r.j.depuis === "2026-11-15", `la semaine : ${r.j.mesure.terminees_depuis} depuis ${r.j.depuis}`);
    const large = lancer(recent, ancien, "--le", "2026-11-22", "--depuis", "2026-08-01");
    att(large.j.mesure.terminees_depuis === 2, "--depuis ne déplace pas la fenêtre");
  });

  check("borne — un rapport sans section `boucle` n'est jamais compté terminé ; un rapport illisible est COMPTÉ, jamais ignoré en silence", () => {
    const p = produit("produit-d", { "rapport-20261110.json": { verdict: "PASS" }, "rapport-20261111.json": "{pas du json" }, 2);
    const r = lancer(p, "--le", "2026-11-22");
    att(r.j.mesure.campagnes_terminees === 0 && r.j.mesure.rapports === 1 && r.j.mesure.rapports_illisibles === 1, JSON.stringify(r.j.mesure));
  });

  check("--parc ne lit que les dossiers qui portent forge/etapes/tests ; aucun produit : exit 2, jamais un vert de complaisance", () => {
    const racine = join(T, "parc");
    mkdirSync(join(racine, "autre-dossier"), { recursive: true });
    mkdirSync(join(racine, "_sauvegarde", "forge", "etapes", "tests"), { recursive: true });
    mkdirSync(join(racine, "produit-e", "forge", "etapes", "tests"), { recursive: true });
    writeFileSync(join(racine, "produit-e", "forge", "etapes", "tests", "rapport-20261101.json"), JSON.stringify({ verdict: "PARTIEL" }), "utf8");
    const r = lancer("--parc", racine);
    att(r.code === 1 && r.j.mesure.produits === 1 && r.j.produits[0].produit === "produit-e", r.brut.slice(0, 300));
    const vide = lancer("--parc", join(T, "parc", "autre-dossier"));
    att(vide.code === 2 && vide.j.verdict === "SKIP", vide.brut.slice(0, 200));
  });

  check("une date illisible est une erreur d'USAGE : exit 2, jamais un verdict sur un produit", () => {
    const r = lancer(join(T, "produit-a"), "--le", "22/11/2026");
    att(r.code === 2 && r.j.verdict === "ERREUR", r.brut.slice(0, 200));
  });

  check("l'outil n'écrit chez aucun produit : l'arbre d'un produit relevé est identique avant et après", () => {
    const p = produit("produit-f", { "rapport-20260901.json": { verdict: "PARTIEL" } });
    const liste = () => spawnSync(process.execPath, ["-e", `const fs=require('fs'),p=require('path');const o=[];(function m(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const c=p.join(d,e.name);if(e.isDirectory())m(c);else o.push(c+':'+fs.statSync(c).size)}})(${JSON.stringify(p)});console.log(o.sort().join('|'))`], { encoding: "utf8" }).stdout;
    const avant = liste();
    lancer(p);
    att(avant === liste(), "l'arbre du produit a changé");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nrelever-campagnes-tests (TF-2727) : ${pass} PASS, ${fail} FAIL — rouge sans journal de tours puis vert avec lui, campagne terminée relevée dans sa semaine, bornes (rapport illisible, sans boucle, journal vide, hors parc)`);
process.exit(fail ? 1 : 0);
