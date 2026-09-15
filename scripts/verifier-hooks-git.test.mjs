#!/usr/bin/env node
/**
 * verifier-hooks-git.test.mjs — une garde de pré-commit déclarée et jamais appelée est un FAIL
 * (TF-1041, part pilot). Dépôt git réel en dossier temporaire, deux gardes jouets.
 *
 * Rouges : aucun hook (le clone frais) ; un hook qui n'appelle qu'une garde (l'état qu'aurait
 * posé l'installeur de la forge des outils) ; une copie versionnée qui a dérivé. Remède JOUÉ
 * (TF-1013) : `--installer` sur un hook absent, puis PASS. Borne : `--installer` n'écrase jamais
 * un hook existant. Hors dépôt : non jugeable (exit 2), jamais un vert.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-hooks-git.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const SOURCE = "#!/bin/sh\nnode \"$R/todo/pre-commit-a.mjs\" || exit $?\nnode \"$R/oracles/pre-commit-b.mjs\" || exit $?\n";
const depot = () => {
  const D = mkdtempSync(join(tmpdir(), "hooks-git-"));
  const g = (...a) => spawnSync("git", ["-C", D, ...a], { encoding: "utf8" });
  g("init", "-q", "-b", "main");
  for (const f of ["todo/pre-commit-a.mjs", "oracles/pre-commit-b.mjs", "oracles/pre-commit-b.test.mjs"]) {
    mkdirSync(join(D, dirname(f)), { recursive: true });
    writeFileSync(join(D, f), "// garde jouet\n", "utf8");
  }
  mkdirSync(join(D, "scripts", "hooks-git"), { recursive: true });
  writeFileSync(join(D, "scripts", "hooks-git", "pre-commit"), SOURCE, "utf8");
  g("add", ".");
  return D;
};
const lancer = (D, ...extra) => {
  const r = spawnSync(process.execPath, [OUTIL, "--depot", D, ...extra], { encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
};
const HOOK = (D) => join(D, ".git", "hooks", "pre-commit");

check("rouge — clone frais, aucun hook : les deux gardes déclarées sont nommées, jamais appelées", () => {
  const D = depot();
  const r = lancer(D);
  if (r.code !== 1 || !/AUCUN hook pre-commit installé/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  if (!/todo\/pre-commit-a\.mjs/.test(r.sortie) || !/oracles\/pre-commit-b\.mjs/.test(r.sortie)) throw new Error("les gardes ne sont pas nommées");
  if (/pre-commit-b\.test\.mjs/.test(r.sortie)) throw new Error("une recette est prise pour une garde");
  rmSync(D, { recursive: true, force: true });
});
check("rouge — hook qui n'appelle qu'une garde (celui de l'installeur externe) : la garde oubliée est nommée", () => {
  const D = depot();
  writeFileSync(HOOK(D), "#!/bin/sh\nnode \"$R/todo/pre-commit-a.mjs\"\n", "utf8");
  const r = lancer(D);
  if (r.code !== 1 || !/n'appelle pas 1 garde/.test(r.sortie) || !/oracles\/pre-commit-b\.mjs/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("remède joué — `--installer` sur un hook absent pose la copie versionnée, puis PASS sans option", () => {
  const D = depot();
  const r1 = lancer(D, "--installer");
  if (r1.code !== 0 || !/\[INSTALLÉ\]/.test(r1.sortie)) throw new Error(`exit ${r1.code} : ${r1.sortie}`);
  if (readFileSync(HOOK(D), "utf8") !== SOURCE) throw new Error("le hook posé n'est pas la copie versionnée");
  const r2 = lancer(D);
  if (r2.code !== 0) throw new Error(`après installation, exit ${r2.code} : ${r2.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("borne — `--installer` n'écrase JAMAIS un hook existant, même incomplet", () => {
  const D = depot();
  const etranger = "#!/bin/sh\necho hook du poste\n";
  writeFileSync(HOOK(D), etranger, "utf8");
  const r = lancer(D, "--installer");
  if (r.code !== 1 || !/CONSERVÉ/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  if (readFileSync(HOOK(D), "utf8") !== etranger) throw new Error("le hook existant a été écrasé");
  rmSync(D, { recursive: true, force: true });
});
check("rouge — copie versionnée qui a dérivé (une garde en moins) : H2 la nomme", () => {
  const D = depot();
  writeFileSync(join(D, "scripts", "hooks-git", "pre-commit"), "#!/bin/sh\nnode \"$R/todo/pre-commit-a.mjs\"\n", "utf8");
  writeFileSync(HOOK(D), SOURCE, "utf8");
  const r = lancer(D);
  if (r.code !== 1 || !/\[FAIL\] H2/.test(r.sortie) || !/oracles\/pre-commit-b\.mjs/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("borne — hors dépôt git : non jugeable (exit 2), jamais un vert", () => {
  const D = mkdtempSync(join(tmpdir(), "hooks-hors-git-"));
  const r = lancer(D);
  if (r.code !== 2) throw new Error(`exit ${r.code} attendu 2`);
  if (existsSync(join(D, ".git"))) throw new Error("un dépôt a été créé");
  rmSync(D, { recursive: true, force: true });
});

console.log(`\nverifier-hooks-git (TF-1041) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
