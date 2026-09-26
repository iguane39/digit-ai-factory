#!/usr/bin/env node
/**
 * generer-lisezmoi-output.test.mjs — l'index d'output ne dépend pas du poste qui le régénère
 * (TF-1243, D-20 (a) du 26/09/2026).
 *
 * Deux dépôts git réels en dossier temporaire portent le MÊME livrable suivi : l'un avec des fins de
 * ligne LF sur le disque, l'autre en CRLF — ce que `core.autocrlf=true` fait d'un checkout Windows.
 * Le second porte en plus un fichier NON suivi. Rouge sur l'ancien générateur (poids lu sur le disque,
 * liste lue sur le disque) : les deux index diffèrent, et le non suivi y entre. Vert : zéro octet
 * d'écart entre les deux index, et le non suivi absent.
 * `GENERATEUR=<chemin>` joue la recette contre une autre version du script (preuve du rouge).
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = process.env.GENERATEUR || join(ICI, "generer-lisezmoi-output.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const LIVRABLE = "output/04-plans/Marque - Synthese de recette - 20260926a.md";
// 150 lignes : l'écart CRLF (150 octets) change le poids affiché au dixième de Ko près.
const CONTENU = ["# Marque — Synthèse de recette", "", ...Array.from({ length: 148 }, (_, i) => `Ligne ${i + 1} de la synthèse, écrite pour peser.`)].join("\n") + "\n";

const depot = (finDeLigne, avecNonSuivi) => {
  const D = mkdtempSync(join(tmpdir(), "lisezmoi-"));
  const g = (...a) => spawnSync("git", ["-C", D, ...a], { encoding: "utf8" });
  g("init", "-q", "-b", "main");
  g("config", "core.autocrlf", finDeLigne === "crlf" ? "input" : "false"); // le blob reste LF
  mkdirSync(join(D, dirname(LIVRABLE)), { recursive: true });
  writeFileSync(join(D, LIVRABLE), finDeLigne === "crlf" ? CONTENU.split("\n").join("\r\n") : CONTENU, "utf8");
  g("add", LIVRABLE);
  if (avecNonSuivi) writeFileSync(join(D, "output/04-plans/Marque - Brouillon du poste - 20260926b.md"), "# brouillon\n", "utf8");
  return D;
};
const indexDe = (D) => {
  const r = spawnSync(process.execPath, [OUTIL, join(D, "output"), "--silencieux"], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`générateur exit ${r.status} : ${r.stderr}`);
  const t = readFileSync(join(D, "output", "LISEZMOI.md"), "utf8");
  const a = t.indexOf("<!-- index-livrables:debut"), b = t.indexOf("<!-- index-livrables:fin -->");
  return t.slice(a, b);
};

check("vert — le même livrable suivi, LF sur un poste et CRLF sur l'autre : zéro octet d'écart entre les deux index", () => {
  const A = depot("lf", false), B = depot("crlf", false);
  const ia = indexDe(A), ib = indexDe(B);
  rmSync(A, { recursive: true, force: true }); rmSync(B, { recursive: true, force: true });
  if (ia !== ib) {
    const la = ia.split("\n"), lb = ib.split("\n");
    const i = la.findIndex((l, k) => l !== lb[k]);
    throw new Error(`les index diffèrent, première ligne différente : « ${la[i]} » contre « ${lb[i]} »`);
  }
});
check("vert — un fichier NON suivi du poste n'entre pas dans l'index publié", () => {
  const B = depot("crlf", true);
  const ib = indexDe(B);
  rmSync(B, { recursive: true, force: true });
  if (/Brouillon du poste/.test(ib)) throw new Error("le fichier non suivi est indexé");
  if (!/Synthese de recette/.test(ib)) throw new Error("le livrable suivi manque à l'index");
});

console.log(`\ngenerer-lisezmoi-output (TF-1243) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
