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

// TF-1404 (02/10/2026) — UN SIDECAR N'EST PAS UN LIVRABLE. Mesuré le 24/09 : LISEZMOI.md portait
// 48 lignes de `*.jugement.json` à côté de `*.oracles-cache.json` et `*.oracles-historique.jsonl`
// dans sa table « Livrable » — le filtre d'extension (`.json`, `.jsonl`) ne les distinguait pas
// d'un vrai livrable. Les trois formes de sidecar sont fabriquées, suivies par git, à côté du
// livrable réel : seul ce dernier doit entrer dans la table.
check("vert — les sidecars (.jugement.json, .oracles-cache.json, .oracles-historique.jsonl) n'entrent pas dans la table des livrables", () => {
  const D = depot("lf", false);
  const g = (...a) => spawnSync("git", ["-C", D, ...a], { encoding: "utf8" });
  const dir = join(D, dirname(LIVRABLE));
  const sidecars = [
    `${LIVRABLE}.jugement.json`,
    `${LIVRABLE}.oracles-cache.json`,
    `${LIVRABLE}.oracles-historique.jsonl`,
    `${LIVRABLE}.oracles.json`,
  ];
  for (const s of sidecars) writeFileSync(join(D, s), "{}", "utf8");
  g("add", "-A");
  const ib = indexDe(D);
  rmSync(D, { recursive: true, force: true });
  if (!/Synthese de recette/.test(ib)) throw new Error("le livrable réel manque à l'index");
  for (const s of sidecars) {
    const base = s.split("/").pop();
    if (ib.includes(base)) throw new Error(`le sidecar ${base} est entré dans la table des livrables`);
  }
});

// TF-1414 (01/10/2026) — un commit fait depuis un ARBRE DE TRAVAIL LIÉ lance le garde de
// pré-enregistrement avec GIT_DIR exporté par git vers `.git/worktrees/<nom>`. Le relevé
// `git -C output ls-files` héritait de cette variable et ne listait plus les livrables de l'arbre :
// l'index publié se vidait sans alerte (410 livrables à 0, mesuré le 24/09).
check("rouge → vert — lancé comme un crochet d'arbre de travail lié (GIT_DIR exporté), l'index garde ses livrables", () => {
  const D = depot("lf", false);
  const g = (...a) => spawnSync("git", ["-C", D, ...a], { encoding: "utf8" });
  g("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "init");
  const W = D + "-lie";
  const r0 = g("worktree", "add", "-q", W, "-b", "lie");
  try {
    if (r0.status !== 0) throw new Error(`worktree add exit ${r0.status} : ${r0.stderr}`);
    const env = { ...process.env, GIT_DIR: join(D, ".git", "worktrees", W.split(/[\\/]/).pop()) };
    const r = spawnSync(process.execPath, [OUTIL, join(W, "output"), "--silencieux"], { encoding: "utf8", env });
    if (r.status !== 0) throw new Error(`générateur exit ${r.status} : ${r.stderr}`);
    if (!/Synthese de recette/.test(readFileSync(join(W, "output", "LISEZMOI.md"), "utf8"))) throw new Error("le livrable suivi manque à l'index lancé avec GIT_DIR exporté");
  } finally { rmSync(W, { recursive: true, force: true }); rmSync(D, { recursive: true, force: true }); }
});

console.log(`\ngenerer-lisezmoi-output (TF-1243) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
