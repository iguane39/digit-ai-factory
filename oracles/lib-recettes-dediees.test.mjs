#!/usr/bin/env node
/**
 * lib-recettes-dediees.test.mjs — câble le `--self-test` de la table des recettes dédiées à la recette du pilot (TF-2589, 15/11/2026).
 * Le `--self-test` rendait exit 0 sans une ligne ; il rend maintenant un verdict chiffré, et ce fichier garantit que quelqu'un le joue :
 * un `--self-test` que rien n'exécute est une affordance non câblée. Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEDIES, jugerTable } from "./lib-recettes-dediees.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const LIB = join(dirname(fileURLToPath(import.meta.url)), "lib-recettes-dediees.mjs");
const jouer = (...args) => spawnSync(process.execPath, [LIB, ...args], { encoding: "utf8", timeout: 60000 });

check("--self-test — rend exit 0 ET un verdict chiffré « N/N PASS » (jamais le silence d'avant)", () => {
  const r = jouer("--self-test");
  const m = /Self-test lib-recettes-dediees : (\d+)\/(\d+) PASS/.exec(r.stdout || "");
  att(r.status === 0 && m && m[1] === m[2] && Number(m[2]) >= 6, `exit ${r.status}, sortie « ${String(r.stdout).slice(0, 160)} »`);
});
check("sans drapeau — le module ne lance rien et ne dit rien : c'est une bibliothèque importée par le harnais", () => {
  const r = jouer();
  att(r.status === 0 && !(r.stdout || "").trim(), `exit ${r.status}, sortie « ${String(r.stdout).slice(0, 160)} »`);
});

check("rouge — une entrée dont le banc est absent est refusée par `jugerTable` (la table réelle, elle, n'a aucun défaut)", () => {
  const ICI = dirname(LIB);
  att(jugerTable(DEDIES, ICI).length === 0, jugerTable(DEDIES, ICI).join(" | "));
  const refus = jugerTable({ ...DEDIES, "oracle-reprise.mjs": "banc-qui-n-existe-pas.test.mjs" }, ICI);
  att(refus.length === 1 && /banc absent : banc-qui-n-existe-pas\.test\.mjs/.test(refus[0]), refus.join(" | "));
});

console.log(`\nlib-recettes-dediees (TF-2589) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
