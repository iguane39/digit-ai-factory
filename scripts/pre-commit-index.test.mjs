#!/usr/bin/env node
/**
 * pre-commit-index.test.mjs — l'index enregistré nomme la synthèse qu'il accompagne, et l'arbre est
 * propre juste après l'enregistrement (TF-1325, D-20 (a) du 26/09/2026).
 *
 * Dépôt git réel en dossier temporaire, scénario mesuré les 23 et 24/09 : une synthèse est ÉCRITE,
 * le hook d'écriture régénère aussitôt les index (la synthèse n'est pas encore suivie, ils ne la
 * nomment pas), puis la synthèse seule est indexée et enregistrée.
 * Rouge — sans la garde : l'index enregistré ignore la synthèse, et la régénération suivante laisse
 * un diff local (ce qui bloque le `pull --ff-only` d'ouverture de l'autre poste).
 * Vert — même scénario, hook pre-commit qui appelle la garde : l'index enregistré nomme la synthèse,
 * et régénérer après l'enregistrement ne change plus rien.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const GARDE = join(ICI, "pre-commit-index.mjs").split("\\").join("/");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const SYNTHESE = "output/04-plans/Marque - Synthese Mandat - Recette de l index - 20260926a.md";
// La régénération du hook d'écriture, dans son ordre (`.claude\settings.json`, PostToolUse) :
// les README d'abord, l'index des livrables ensuite.
const regenerer = (D) => {
  spawnSync(process.execPath, [join(ICI, "readme-dossiers.mjs"), "--base", D, "--silencieux"], { cwd: D, encoding: "utf8" });
  spawnSync(process.execPath, [join(ICI, "generer-lisezmoi-output.mjs"), join(D, "output"), "--silencieux"], { cwd: D, encoding: "utf8" });
};
const depot = (avecGarde) => {
  const D = mkdtempSync(join(tmpdir(), "index-precommit-"));
  const g = (...a) => spawnSync("git", ["-C", D, "-c", "user.name=recette", "-c", "user.email=recette@exemple.invalid", "-c", "core.quotepath=false", ...a], { encoding: "utf8" });
  g("init", "-q", "-b", "main");
  g("config", "core.autocrlf", "false");
  mkdirSync(join(D, "input"), { recursive: true });
  mkdirSync(join(D, "output", "04-plans"), { recursive: true });
  writeFileSync(join(D, "input", "note.md"), "# Note d'entrée\n", "utf8");
  writeFileSync(join(D, "output", "04-plans", "Marque - Plan initial - 20260925a.md"), "# Plan initial\n", "utf8");
  regenerer(D);
  g("add", "."); g("commit", "-q", "-m", "etat initial");
  if (avecGarde) {
    writeFileSync(join(D, ".git", "hooks", "pre-commit"), `#!/bin/sh\nnode "${GARDE}" --depot "$(git rev-parse --show-toplevel)" || exit $?\n`, "utf8");
  }
  // Le scénario : écriture, régénération immédiate par le hook d'écriture, indexage de la seule
  // synthèse, enregistrement.
  writeFileSync(join(D, SYNTHESE), "# Marque — Synthèse de mandat — Recette de l'index\n\nContenu.\n", "utf8");
  regenerer(D);
  g("add", "--", SYNTHESE);
  const c = g("commit", "-q", "-m", "synthese du tour");
  return { D, g, commit: c };
};

check("rouge — sans la garde : l'index enregistré ignore la synthèse, et l'arbre est sale après régénération", () => {
  const { D, g } = depot(false);
  const enregistre = g("show", "HEAD:output/04-plans/README.md").stdout;
  regenerer(D);
  const sale = g("status", "--porcelain").stdout.trim();
  rmSync(D, { recursive: true, force: true });
  if (/Recette de l index/.test(enregistre)) throw new Error("le scénario ne reproduit pas le défaut : l'index nomme déjà la synthèse");
  if (!sale) throw new Error("le scénario ne reproduit pas le défaut : l'arbre est propre");
});
check("vert — avec la garde au pre-commit : l'index enregistré nomme la synthèse, et l'arbre reste propre", () => {
  const { D, g, commit } = depot(true);
  if (commit.status !== 0) throw new Error(`enregistrement refusé : ${commit.stderr}`);
  const enregistre = g("show", "HEAD:output/04-plans/README.md").stdout;
  const lisezmoi = g("show", "HEAD:output/LISEZMOI.md");
  regenerer(D);
  const sale = g("status", "--porcelain").stdout.trim();
  rmSync(D, { recursive: true, force: true });
  if (!/Recette de l index/.test(enregistre)) throw new Error("l'index enregistré ne nomme pas la synthèse");
  if (lisezmoi.status !== 0 || !/Recette de l index/.test(lisezmoi.stdout)) throw new Error("output/LISEZMOI.md enregistré ne nomme pas la synthèse");
  if (sale) throw new Error(`arbre sale après régénération : ${sale}`);
});

console.log(`\npre-commit-index (TF-1325) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
