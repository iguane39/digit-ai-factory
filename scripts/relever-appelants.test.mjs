#!/usr/bin/env node
/**
 * relever-appelants.test.mjs — le relevé des contrôles sans appelant, dans les deux sens (TF-1096).
 *   VERT  : un contrôle lancé par un hook (`node oracles/oracle-a.mjs`) a un appelant ;
 *   ROUGE : un contrôle cité seulement par une doctrine `.md` et par sa propre recette n'en a
 *           aucun — il est relevé, et le relevé dit qu'il est cité en doctrine ;
 *   BORNE : le harnais qui joue les recettes n'est pas un appelant.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { relever } from "./relever-appelants.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const T = mkdtempSync(join(tmpdir(), "appelants-"));
try {
  mkdirSync(join(T, "oracles"), { recursive: true });
  writeFileSync(join(T, "oracles", "oracle-a.mjs"), "console.log('a');\n");
  writeFileSync(join(T, "oracles", "oracle-b.mjs"), "console.log('b');\n");
  writeFileSync(join(T, "oracles", "oracle-c.mjs"), "console.log('c');\n");
  writeFileSync(join(T, "oracles", "hook-fin.mjs"), "spawnSync('node', ['oracles/oracle-a.mjs']);\n");
  writeFileSync(join(T, "oracles", "oracle-b.test.mjs"), "import './oracle-b.mjs';\n");
  writeFileSync(join(T, "oracles", "self-tests.mjs"), "run('oracle-c.mjs --self-test');\n");
  writeFileSync(join(T, "README.md"), "Le contrôle `oracle-b.mjs` juge la forme.\n");
  const r = relever(T);
  const sans = (c) => r.sansAppelant.find((x) => x.controle === `oracles/${c}`);
  check("VERT — un contrôle lancé par un hook a un appelant", () => {
    if (sans("oracle-a.mjs")) throw new Error("oracle-a est relevé sans appelant alors qu'un hook le lance");
  });
  check("ROUGE — cité seulement en doctrine et par sa recette : relevé SANS appelant, « cité en doctrine »", () => {
    const b = sans("oracle-b.mjs");
    if (!b) throw new Error("oracle-b n'est pas relevé — une recette et une doctrine sont prises pour des appels");
    if (!b.cite_en_doctrine) throw new Error("le relevé ne dit pas qu'il est cité en doctrine");
  });
  check("BORNE — le harnais des recettes n'est pas un appelant", () => {
    if (!sans("oracle-c.mjs")) throw new Error("le harnais self-tests.mjs est compté comme appelant");
  });
  check("un hook lui-même est un contrôle compté", () => {
    if (r.controles !== 4) throw new Error(`${r.controles} contrôle(s) comptés, 4 attendus`);
  });
} finally { rmSync(T, { recursive: true, force: true }); }
console.log(`\nrelever-appelants (TF-1096) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
