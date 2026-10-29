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
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { relever } from "./relever-appelants.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));

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
  check("SONDE (TF-1165) — `--json` rend `nombre_sans_appelant`, le scalaire que lit le plan hebdomadaire, égal à la liste", () => {
    const s = spawnSync(process.execPath, [join(ICI, "relever-appelants.mjs"), "--racine", T, "--json"], { encoding: "utf8" });
    if (s.status !== 0) throw new Error(`exit ${s.status} : ${s.stderr}`);
    const d = JSON.parse(s.stdout);
    if (d.nombre_sans_appelant !== d.sansAppelant.length || d.nombre_sans_appelant !== r.sansAppelant.length) throw new Error(`nombre_sans_appelant = ${d.nombre_sans_appelant}, liste = ${d.sansAppelant.length}, module = ${r.sansAppelant.length}`);
    if (d.nombre_sans_appelant < 2) throw new Error("oracle-b et oracle-c ne sont pas comptés");
  });
  // D-97 (a) du 29/10/2026 : une copie de travail d'agent n'est pas un appelant, et ses contrôles ne se comptent pas.
  mkdirSync(join(T, ".claude", "worktrees", "agent-x", "oracles"), { recursive: true });
  writeFileSync(join(T, ".claude", "worktrees", "agent-x", "oracles", "hook-fin.mjs"), "spawnSync('node', ['oracles/oracle-b.mjs']);\n");
  writeFileSync(join(T, ".claude", "worktrees", "agent-x", "oracles", "oracle-b.mjs"), "console.log('b');\n");
  const w = relever(T);
  check("ROUGE (D-97) — une copie de travail sous .claude/worktrees n'appelle pas oracle-b", () => {
    if (!w.sansAppelant.some((x) => x.controle === "oracles/oracle-b.mjs")) throw new Error("oracle-b paraît appelé par la copie de travail : le faux zéro du 29/10 revient");
  });
  check("BORNE (D-97) — les contrôles d'une copie de travail ne sont pas comptés", () => {
    if (w.controles !== 4) throw new Error(`${w.controles} contrôle(s) comptés, 4 attendus`);
  });
  // D-97 (a) : --tous-scripts relève le code mort au-delà de la convention de nom des contrôles.
  mkdirSync(join(T, "scripts"), { recursive: true });
  mkdirSync(join(T, "fixtures"), { recursive: true });
  writeFileSync(join(T, "scripts", "outil-oublie.mjs"), "console.log('x');\n");
  writeFileSync(join(T, "scripts", "outils_py.py"), "def f():\n  return 1\n");
  writeFileSync(join(T, "scripts", "principal.py"), "from outils_py import f\n");
  writeFileSync(join(T, "scripts", "app.js"), "console.log('page');\n");
  writeFileSync(join(T, "page.html"), "<script src=\"scripts/app.js\"></script>\n");
  writeFileSync(join(T, "fixtures", "rouge.mjs"), "console.log('jeu');\n");
  mkdirSync(join(T, "paquet"), { recursive: true });
  writeFileSync(join(T, "paquet", "relatif.py"), "x = 1\n");
  writeFileSync(join(T, "paquet", "__init__.py"), "from . import relatif\n");
  mkdirSync(join(T, ".venv", "Lib"), { recursive: true });
  writeFileSync(join(T, ".venv", "Lib", "tiers.py"), "y = 2\n");
  const t = relever(T, { tous: true });
  const sansT = (f) => t.sansAppelant.some((x) => x.controle === f);
  check("ROUGE (--tous-scripts) — un script que rien ne nomme est relevé", () => {
    if (!sansT("scripts/outil-oublie.mjs")) throw new Error("scripts/outil-oublie.mjs n'est pas relevé");
  });
  check("VERT (--tous-scripts) — un module Python importé par son nom et un script chargé par une page sont appelés", () => {
    if (sansT("scripts/outils_py.py")) throw new Error("l'import Python « from outils_py import » n'est pas reconnu");
    if (sansT("scripts/app.js")) throw new Error("la page HTML qui charge app.js n'est pas reconnue comme appelant");
  });
  check("VERT et BORNE (--tous-scripts) — un import relatif Python appelle son module ; un environnement .venv est écarté", () => {
    if (sansT("paquet/relatif.py")) throw new Error("« from . import relatif » n'est pas reconnu");
    if (t.sansAppelant.some((x) => x.controle.startsWith(".venv/"))) throw new Error("un fichier de .venv est relevé");
  });
  check("BORNE (--tous-scripts) — un jeu d'essai sous fixtures n'est pas du code livré", () => {
    if (t.sansAppelant.some((x) => x.controle.startsWith("fixtures/"))) throw new Error("un fichier de fixtures est relevé");
  });
} finally { rmSync(T, { recursive: true, force: true }); }
console.log(`\nrelever-appelants (TF-1096) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
