#!/usr/bin/env node
/**
 * oracle-chemin-ancre.test.mjs — recette à DOUBLE SENS de `oracle-chemin-ancre.mjs`.
 *
 * Les fixtures sont des dépôts jetables : le défaut fondateur de TF-1297 est reproduit ligne pour
 * ligne (une résolution du répertoire personnel au niveau module), et son remède aussi — la même
 * résolution déplacée dans une fonction doit rendre vert, sans quoi l'oracle punirait le remède
 * qu'il recommande.
 *
 * Joué par `oracles\self-tests.mjs` (I1 via DEDIES, I2 comme tout `*.test.mjs`).
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { juger, NON_JUGE, resolutionsAuNiveauModule, RE_RACINE_CONFIG } from "./oracle-chemin-ancre.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "chemin-ancre-"));
let n = 0;

const LIB_CONFORME = [
  'import { homedir } from "node:os";',
  "export function settingsInstalle() {",
  '  const variable = process.env.CLAUDE_CONFIG_DIR ? "CLAUDE_CONFIG_DIR" : "defaut";',
  '  const chemin = process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");',
  "  return { chemin, decide_par: variable, variable };",
  "}",
].join("\n");

/** Un dépôt jetable : la lib partagée (sauf si on la retire) et un fichier sous `oracles\`. */
const depot = (source, { lib = LIB_CONFORME } = {}) => {
  const d = join(T, `d${++n}`);
  mkdirSync(join(d, "oracles"), { recursive: true });
  mkdirSync(join(d, "scripts"), { recursive: true });
  if (lib !== null) writeFileSync(join(d, "scripts", "lib-config-installee.mjs"), lib, "utf8");
  writeFileSync(join(d, "oracles", "oracle-bidon.mjs"), source, "utf8");
  return d;
};
const constat = (r, regle) => r.findings.find((x) => x.regle === regle);

// -- CA1 : la fonction partagee, les deux sens --------------------------------------------------
check("ROUGE — une racine de configuration résolue à la main est un FAIL (CA1)", () => {
  const src = 'import { homedir } from "node:os";\nfunction f() { return join(homedir(), ".claude", "skills"); }\n';
  const f = constat(juger(depot(src)), "CA1");
  if (f.statut !== "FAIL") throw new Error(`CA1 ${f.statut} — la résolution maison n'a pas de provenance`);
  if (!/oracle-bidon/.test(f.message)) throw new Error("le constat ne LOCALISE pas le fichier");
});

check("VERT — la même résolution passant par la fonction partagée passe CA1", () => {
  const src = 'import { settingsInstalle } from "../scripts/lib-config-installee.mjs";\nfunction f() { return settingsInstalle().chemin; }\n';
  const f = constat(juger(depot(src)), "CA1");
  if (f.statut !== "PASS") throw new Error(`CA1 ${f.statut} : ${f.message}`);
});

check("VERT — un chemin sous le répertoire personnel qui n'est PAS une racine de configuration", () => {
  const src = 'import { homedir } from "node:os";\nfunction f() { return join(homedir(), "travail", "brouillon.txt"); }\n';
  const f = constat(juger(depot(src)), "CA1");
  if (f.statut !== "PASS") throw new Error("faux positif : écrire un brouillon ne juge aucune copie installée");
});

// -- CA2 : le niveau module, les deux sens ------------------------------------------------------
check("ROUGE — une résolution AU NIVEAU MODULE est un FAIL (la forme exacte de TF-1297)", () => {
  const src = 'import { homedir } from "node:os";\nconst REGISTRE = join(homedir(), ".claude", "skills", "x.json");\n';
  const f = constat(juger(depot(src)), "CA2");
  if (f.statut !== "FAIL") throw new Error(`CA2 ${f.statut} — l'échec précéderait le verdict`);
  if (!/:2/.test(f.message)) throw new Error("le constat ne donne pas la LIGNE");
});

check("VERT — la même résolution DANS une fonction passe CA2 : le remède n'est pas puni", () => {
  const src = 'import { homedir } from "node:os";\nfunction registre() { return join(homedir(), ".claude", "x.json"); }\n';
  const f = constat(juger(depot(src)), "CA2");
  if (f.statut !== "PASS") throw new Error(`CA2 ${f.statut} — l'oracle punit le remède qu'il recommande`);
});

check("ROUGE — la variable d'environnement du répertoire personnel compte aussi (CA2)", () => {
  const src = "const RACINE = process.env.HOME + \"/x\";\n";
  const f = constat(juger(depot(src)), "CA2");
  if (f.statut !== "FAIL") throw new Error("seule la forme `homedir()` est vue, et l'autre forme passe");
});

check("VERT — une déclaration indentée n'est pas au niveau module", () => {
  const ligne = '  const x = join(homedir(), ".claude");';
  if (resolutionsAuNiveauModule(ligne).length) throw new Error("l'indentation n'est pas le discriminant");
});

// -- CA3 : la fonction partagee rend bien les deux choses ---------------------------------------
check("VERT — une lib qui rend le chemin ET la variable décidante passe CA3", () => {
  const f = constat(juger(depot("// rien\n")), "CA3");
  if (f.statut !== "PASS") throw new Error(`CA3 ${f.statut} : ${f.message}`);
});

check("ROUGE — une lib qui ne rend plus la provenance est un FAIL (CA3)", () => {
  const amputee = 'import { homedir } from "node:os";\nexport function settingsInstalle() { return { chemin: join(homedir(), ".claude") }; }\n';
  const f = constat(juger(depot("// rien\n", { lib: amputee })), "CA3");
  if (f.statut !== "FAIL") throw new Error("la provenance peut disparaître sans que rien ne le dise");
});

check("ROUGE — une lib ABSENTE est un FAIL, pas un silence (CA3)", () => {
  const f = constat(juger(depot("// rien\n", { lib: null })), "CA3");
  if (f.statut !== "FAIL") throw new Error("le remède peut disparaître sans que rien ne le dise");
  if (!/ABSENTE/.test(f.message)) throw new Error("le constat ne dit pas ce qui manque");
});

// -- portee et contrat ---------------------------------------------------------------------------
check("VERT — une RECETTE qui pose sa propre racine n'est pas accusée", () => {
  const d = depot("// rien\n");
  writeFileSync(join(d, "oracles", "oracle-bidon.test.mjs"), 'const R = join(homedir(), ".claude");\n', "utf8");
  const r = juger(d);
  if (constat(r, "CA1").statut !== "PASS" || constat(r, "CA2").statut !== "PASS") {
    throw new Error("un banc qui pose ses racines jetables est accusé de le faire");
  }
});

check("SANS OBJET — un dépôt sans exécutable est déclaré hors portée, jamais accusé", () => {
  const d = join(T, "vide");
  mkdirSync(d, { recursive: true });
  if (juger(d).verdict !== "SANS_OBJET") throw new Error("un dépôt vide est accusé au lieu d'être écarté");
});

check("le motif de racine de configuration ne mord pas sur n'importe quel chemin", () => {
  if (RE_RACINE_CONFIG.test('join(homedir(), "Documents")')) throw new Error("le motif est trop large");
  if (!RE_RACINE_CONFIG.test('join(homedir(), ".claude")')) throw new Error("le motif est trop étroit");
});

check("le verdict PUBLIE ce qu'il n'a pas jugé", () => {
  if (!Array.isArray(NON_JUGE) || NON_JUGE.length < 3) throw new Error("non_juge absent ou squelettique");
});

console.log(`\noracle-chemin-ancre : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
