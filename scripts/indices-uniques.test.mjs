#!/usr/bin/env node
/**
 * indices-uniques.test.mjs — l'unicité des indices se juge seule, sur R-4 (TF-1359, 26/09/2026).
 * Dépôt git réel en dossier temporaire. Rouge : deux synthèses du même jour, de radical distinct,
 * sous le même indice — le cas du 23/09, une par poste — nommées avec leur indice. Vert : les mêmes,
 * la seconde réindexée. Borne : un livrable mal nommé (rouge ancien de R-4) n'est PAS rapporté ici.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "indices-uniques.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const depot = (fichiers) => {
  const D = mkdtempSync(join(tmpdir(), "indices-"));
  spawnSync("git", ["-C", D, "init", "-q", "-b", "main"]);
  mkdirSync(join(D, "output", "04-plans"), { recursive: true });
  for (const f of fichiers) writeFileSync(join(D, "output", "04-plans", f), "# Synthèse\n", "utf8");
  spawnSync("git", ["-C", D, "add", "."]);
  return D;
};
const jouer = (D) => spawnSync(process.execPath, [OUTIL, D], { encoding: "utf8" });

check("rouge — deux synthèses du 23/09 sous l'indice « d », une par poste : l'indice partagé est nommé", () => {
  const D = depot(["Marque - Synthese Mandat - Quatre decisions - 20260923d.md", "Marque - Synthese Mandat - Pilot rattrape - 20260923d.md"]);
  const r = jouer(D);
  rmSync(D, { recursive: true, force: true });
  if (r.status !== 1 || !/20260923d/.test(r.stdout)) throw new Error(`exit ${r.status} : ${r.stdout}${r.stderr}`);
});
check("vert — les mêmes, la seconde réindexée en « e »", () => {
  const D = depot(["Marque - Synthese Mandat - Quatre decisions - 20260923d.md", "Marque - Synthese Mandat - Pilot rattrape - 20260923e.md"]);
  const r = jouer(D);
  rmSync(D, { recursive: true, force: true });
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${r.stdout}${r.stderr}`);
});
check("borne — un livrable seulement mal nommé (rouge ancien de R-4) n'est pas rapporté comme indice partagé", () => {
  const D = depot(["plan-sans-convention.md", "Marque - Synthese Mandat - Seule - 20260926a.md"]);
  const r = jouer(D);
  rmSync(D, { recursive: true, force: true });
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${r.stdout}${r.stderr}`);
});

// --depuis : seul ce qu'un tirage vient d'apporter est rejugé ; le passif est compté, jamais accusé.
const git = (D, ...a) => spawnSync("git", ["-C", D, "-c", "user.name=recette", "-c", "user.email=recette@exemple.invalid", ...a], { encoding: "utf8" });
check("rouge --depuis — la synthèse de l'autre poste arrive par le tirage sous l'indice déjà pris : nommée", () => {
  const D = depot(["Marque - Synthese Mandat - Quatre decisions - 20260923d.md"]);
  git(D, "commit", "-q", "-m", "ce poste");
  const avant = git(D, "rev-parse", "HEAD").stdout.trim();
  writeFileSync(join(D, "output", "04-plans", "Marque - Synthese Mandat - Pilot rattrape - 20260923d.md"), "# Synthèse\n", "utf8");
  git(D, "add", "."); git(D, "commit", "-q", "-m", "tirage de l autre poste");
  const r = spawnSync(process.execPath, [OUTIL, D, "--depuis", avant], { encoding: "utf8" });
  rmSync(D, { recursive: true, force: true });
  if (r.status !== 1 || !/20260923d/.test(r.stdout)) throw new Error(`exit ${r.status} : ${r.stdout}${r.stderr}`);
});
check("borne --depuis — un indice partagé ANTÉRIEUR n'est pas rejugé : compté en passif, exit 0", () => {
  const D = depot(["Marque - Synthese Mandat - Ancienne un - 20260815a.md", "Marque - Synthese Mandat - Ancienne deux - 20260815a.md"]);
  git(D, "commit", "-q", "-m", "passif");
  const avant = git(D, "rev-parse", "HEAD").stdout.trim();
  writeFileSync(join(D, "output", "04-plans", "Marque - Synthese Mandat - Neuve - 20260926a.md"), "# Synthèse\n", "utf8");
  git(D, "add", "."); git(D, "commit", "-q", "-m", "tirage sans collision");
  const r = spawnSync(process.execPath, [OUTIL, D, "--depuis", avant], { encoding: "utf8" });
  rmSync(D, { recursive: true, force: true });
  if (r.status !== 0 || !/passif : 1 indice/.test(r.stdout)) throw new Error(`exit ${r.status} : ${r.stdout}${r.stderr}`);
});

console.log(`\nindices-uniques (TF-1359) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
