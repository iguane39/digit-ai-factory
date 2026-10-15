#!/usr/bin/env node
/**
 * fraicheur-depot.test.mjs — recette à double sens de la sonde de fraîcheur d'un dépôt (TF-1642).
 *
 * Le fait du 12/10/2026 : un rapport a recommandé un correctif livré depuis 13 jours, parce que le
 * clone lu avait 290 commits de retard et qu'aucun `git fetch` n'avait été joué. Dépôts jetables :
 * un distant nu, la copie lue, et un second clone qui publie.
 *   · rouge — la copie lue est en retard d'un commit publié ailleurs : EN RETARD, exit 1, le geste dit
 *     de lire la référence distante et de prouver une absence par `git grep` sur toute la référence ;
 *   · vert — après `git pull`, la même copie est À JOUR, exit 0 ;
 *   · sans distant : NON JUGEABLE, exit 2 ; `--sans-fetch` ne voit pas un commit qu'il n'a pas tiré.
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const SONDE = join(ICI, "fraicheur-depot.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const T = mkdtempSync(join(tmpdir(), "fraicheur-depot-"));
const git = (d, ...a) => execFileSync("git", ["-C", d, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const sonde = (...a) => spawnSync(process.execPath, [SONDE, ...a], { encoding: "utf8" });

try {
  const nu = join(T, "distant.git"), lue = join(T, "lue"), autre = join(T, "autre");
  execFileSync("git", ["init", "-q", "--bare", "--initial-branch=main", nu]);
  execFileSync("git", ["clone", "-q", nu, lue], { stdio: "ignore" });
  writeFileSync(join(lue, "deploiement.yml"), "etapes: [construire]\n");
  git(lue, "add", "-A"); git(lue, "commit", "-q", "-m", "v0"); git(lue, "push", "-q", "origin", "main");
  execFileSync("git", ["clone", "-q", nu, autre], { stdio: "ignore" });
  writeFileSync(join(autre, "borner-revisions.sh"), "# menage des revisions\n");
  git(autre, "add", "-A"); git(autre, "commit", "-q", "-m", "menage"); git(autre, "push", "-q", "origin", "main");

  const sans = sonde(lue, "--sans-fetch");
  check("--sans-fetch : sans tirage, la copie se croit à jour — c'est pourquoi le tirage est le défaut", () => {
    if (sans.status !== 0 || !/À JOUR/.test(sans.stdout)) throw new Error(`exit ${sans.status} : ${sans.stdout.slice(0, 200)}`);
  });
  const rouge = sonde(lue);
  check("rouge — copie en retard d'un commit publié ailleurs : EN RETARD, exit 1, référence et écart cités", () => {
    if (rouge.status !== 1 || !/EN RETARD/.test(rouge.stdout) || !/1 commit\(s\) de retard/.test(rouge.stdout)) throw new Error(`exit ${rouge.status} : ${rouge.stdout.slice(0, 300)}`);
  });
  check("rouge — le geste dit de lire la référence distante et de prouver une absence par git grep sur toute la référence", () => {
    if (!/show origin\/main:<chemin>/.test(rouge.stdout) || !/grep <motif> origin\/main/.test(rouge.stdout)) throw new Error(rouge.stdout.slice(0, 400));
  });
  git(lue, "pull", "-q", "--ff-only");
  const vert = sonde(lue);
  check("vert — après le tirage, la même copie est À JOUR, exit 0", () => {
    if (vert.status !== 0 || !/À JOUR/.test(vert.stdout) || !/0 commit\(s\) de retard/.test(vert.stdout)) throw new Error(`exit ${vert.status} : ${vert.stdout.slice(0, 200)}`);
  });
  const isole = join(T, "isole");
  execFileSync("git", ["init", "-q", isole]);
  const nj = sonde(isole, "--json");
  check("sans distant : NON JUGEABLE, exit 2 — jamais « à jour » par défaut", () => {
    if (nj.status !== 2 || JSON.parse(nj.stdout).etat !== "non_jugeable") throw new Error(`exit ${nj.status} : ${nj.stdout.slice(0, 200)}`);
  });
} finally {
  try { rmSync(T, { recursive: true, force: true }); } catch { /* verrou toléré */ }
}
console.log(`\nfraicheur-depot (TF-1642) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
