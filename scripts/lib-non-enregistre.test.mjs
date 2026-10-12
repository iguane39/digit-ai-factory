#!/usr/bin/env node
/**
 * lib-non-enregistre.test.mjs — recette du relevé daté des fichiers non enregistrés (TF-1200).
 * Dépôt git éphémère ; l'âge est posé par utimes. Les deux sens à chaque fois : un fichier de plus de
 * 48 h rend « périmé » (rouge), le même fichier récent ne le rend pas (vert) ; un index généré ou un
 * sceau, même vieux, ne date rien et ne rend rien périmé.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { releverNonEnregistres, dire, estGenere, seuilHeures, SEUIL_HEURES_DEFAUT } from "./lib-non-enregistre.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const T = mkdtempSync(join(tmpdir(), "non-enregistre-"));
const git = (...a) => spawnSync("git", ["-C", T, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { encoding: "utf8" });
git("init", "-q", "-b", "main");
writeFileSync(join(T, "suivi.md"), "a\n");
mkdirSync(join(T, "input"), { recursive: true });
writeFileSync(join(T, "input", "README.md"), "# index\n");
git("add", "-A"); git("commit", "-q", "-m", "init");
const vieillir = (rel, jours) => { const d = new Date(Date.now() - jours * 86400000); utimesSync(join(T, rel), d, d); };

check("dépôt propre : rien à dire", () => {
  const m = releverNonEnregistres(T);
  if (m.total !== 0 || dire("x", m) !== null || m.perime) throw new Error(JSON.stringify(m));
});

writeFileSync(join(T, "suivi.md"), "b\n");
check("vert : un fichier modifié à l'instant est compté, daté, et non périmé", () => {
  const m = releverNonEnregistres(T);
  if (m.total !== 1 || m.travail !== 1 || m.perime) throw new Error(JSON.stringify(m));
  if (!/moins d'une heure/.test(dire("x", m))) throw new Error(dire("x", m));
});

vieillir("suivi.md", 5);
check("rouge : le même fichier vieux de 5 jours rend le relevé PÉRIMÉ et dit son âge et son chemin", () => {
  const m = releverNonEnregistres(T);
  if (!m.perime) throw new Error("non périmé");
  if (!/5 j \(suivi\.md\)/.test(dire("x", m))) throw new Error(dire("x", m));
});

check("le seuil se déclare : 10 jours rend le même fichier non périmé", () => {
  if (releverNonEnregistres(T, { seuil: 240 }).perime) throw new Error("périmé malgré le seuil");
  if (seuilHeures({ BOOTSTRAP_SEUIL_NON_ENREGISTRE_HEURES: "240" }) !== 240) throw new Error("variable ignorée");
  if (seuilHeures({}) !== SEUIL_HEURES_DEFAUT || seuilHeures({ BOOTSTRAP_SEUIL_NON_ENREGISTRE_HEURES: "abc" }) !== SEUIL_HEURES_DEFAUT) throw new Error("défaut non tenu");
});

git("checkout", "--", "suivi.md");
writeFileSync(join(T, "input", "README.md"), "# index regénéré\n");
vieillir("input/README.md", 9);
writeFileSync(join(T, "seal.md.jugement.json"), "{}");
vieillir("seal.md.jugement.json", 9);
check("un index généré et un sceau, même vieux de 9 jours, sont comptés à part et ne rendent rien périmé", () => {
  const m = releverNonEnregistres(T);
  if (m.total !== 2 || m.generes !== 2 || m.travail !== 0 || m.perime) throw new Error(JSON.stringify(m));
  if (!/2 modification\(s\).*dont 2 généré/.test(dire("x", m))) throw new Error(dire("x", m));
});

check("classement : journaux machine et sceaux généraux reconnus, un livrable ne l'est pas", () => {
  for (const c of ["todo/HERITAGE-RELEVES.jsonl", "todo/observabilite/RECIDIVES.json", "a/b/README.md", "x.jugement.json", "x.oracles.json"])
    if (!estGenere(c)) throw new Error(`${c} devrait être classé généré`);
  for (const c of ["output/04-plans/synthese.md", "todo/TODO.jsonl", "scripts/readme-dossiers.mjs"])
    if (estGenere(c)) throw new Error(`${c} ne doit pas être classé généré`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\nlib-non-enregistre (TF-1200) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
