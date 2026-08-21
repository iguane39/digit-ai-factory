#!/usr/bin/env node
/**
 * readme-dossiers.test.mjs — TF-0451 : la dérive de DATE n'est plus un défaut, la dérive de
 * STRUCTURE en reste un.
 *
 * Le fait fondateur, observé trois fois de suite le 21/08. La table des README porte une
 * colonne « Dernier commit ». Commiter un fichier change sa date, donc la table de son README,
 * donc `--check` sortait « périmé » IMMÉDIATEMENT après un commit qui venait de passer la
 * recette : régénérer, commiter, la recette vire au rouge, régénérer… Le rouge était VRAI et
 * inévitable, ce qui est pire qu'un faux positif — il apprend à régénérer par réflexe sans
 * lire, et le jour où la table signalera un vrai manque, personne ne la lira.
 *
 * La frontière retenue : ce qui fait DÉFAUT est la structure — un fichier apparu, disparu,
 * renommé, un rôle non rédigé. Une divergence portant sur les seules dates devient un
 * avertissement. `--strict` restaure l'égalité stricte pour qui veut l'exiger.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "readme-dossiers.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "readme-dates-"));
mkdirSync(join(T, "input", "sous"), { recursive: true });
mkdirSync(join(T, "output"), { recursive: true });
writeFileSync(join(T, "input", "a.md"), "# Document A\n", "utf8");
writeFileSync(join(T, "input", "b.md"), "# Document B\n", "utf8");

const lancer = (extra = []) =>
  spawnSync(process.execPath, [OUTIL, "--base", T, "--racines", "input,output", ...extra],
    { encoding: "utf8" });

// Mise en place : générer, puis rédiger les rôles (un rôle non rédigé est un défaut à part).
lancer();
const README = join(T, "input", "README.md");
for (const chemin of [README, join(T, "input", "sous", "README.md"), join(T, "output", "README.md")]) {
  writeFileSync(chemin, readFileSync(chemin, "utf8")
    .replace(/<!-- ROLE:DEBUT -->[\s\S]*?<!-- ROLE:FIN -->/,
      "<!-- ROLE:DEBUT -->\nDossier de recette.\n<!-- ROLE:FIN -->"), "utf8");
}

// Normalisation : le générateur PRÉSERVE le rôle mais réécrit sa mise en forme — sans ce
// second passage, le témoin ne serait pas ce que `--check` attend, et la recette mesurerait
// son propre échafaudage au lieu de la règle.
lancer();

check("mise en place : arbre régénéré et rôles rédigés → --check PASS", () => {
  const r = lancer(["--check"]);
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${(r.stderr || "").slice(0, 200)}`);
});

const temoin = readFileSync(README, "utf8");
const deriverLaDate = () => writeFileSync(README,
  temoin.split("\n").map((l) => (l.startsWith("| `a.md`") ? l.replace("| non versionné |", "| 2026-08-21 |") : l)).join("\n"),
  "utf8");

check("dérive de DATE seule → --check TOLÈRE (exit 0) et le DIT", () => {
  deriverLaDate();
  const r = lancer(["--check"]);
  if (r.status !== 0) throw new Error(`exit ${r.status} — la dérive de date fait encore échouer`);
  if (!/à rafraîchir/.test(r.stdout || "")) throw new Error("la tolérance est SILENCIEUSE — un écart toléré doit se dire");
});

check("dérive de DATE seule → --strict REFUSE (exit 1) : l'exigence stricte reste disponible", () => {
  deriverLaDate();
  const r = lancer(["--check", "--strict"]);
  if (r.status !== 1) throw new Error(`exit ${r.status} attendu 1`);
});

check("dérive de STRUCTURE (une ligne de fichier retirée) → --check REFUSE", () => {
  writeFileSync(README, temoin.split("\n").filter((l) => !l.startsWith("| `b.md`")).join("\n"), "utf8");
  const r = lancer(["--check"]);
  if (r.status !== 1) throw new Error(`exit ${r.status} attendu 1 — la structure n'est plus jugée`);
  if (!/périmé/.test(r.stderr || "")) throw new Error("le motif du refus n'est pas dit");
});

check("un fichier AJOUTÉ au dossier reste un défaut — la tolérance ne couvre que les dates", () => {
  writeFileSync(README, temoin, "utf8");
  writeFileSync(join(T, "input", "c.md"), "# Document C\n", "utf8");
  const r = lancer(["--check"]);
  if (r.status !== 1) throw new Error(`exit ${r.status} attendu 1`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\nreadme-dossiers, dérive de date (TF-0451) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
