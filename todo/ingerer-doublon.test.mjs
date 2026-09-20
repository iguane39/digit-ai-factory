#!/usr/bin/env node
/**
 * ingerer-doublon.test.mjs — UN DOUBLON STRICT EST REFUSÉ À L'INGESTION (TF-0956, 14/09/2026).
 *
 * Le 08/09, six candidatures identiques mot pour mot à six autres sont entrées au registre en
 * une commande : deux lots renommés par la pseudonymisation étaient redevenus « jamais ingérés ».
 * Les deux sens, sur un registre jetable et des tables jetables (TF-0957) :
 *   ROUGE : une candidature dont le titre ET le contenu (à la casse et aux espaces près) sont
 *           ceux d'une création du registre → rejet atomique, l'id nommé, registre intact ;
 *   ROUGE : deux lignes identiques dans le MÊME lot → rejet atomique ;
 *   VERT  : même titre, contenu différent → ingérée (un recouvrement n'est pas un doublon).
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ingerer-lot.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const T = mkdtempSync(join(tmpdir(), "ingerer-doublon-"));
writeFileSync(join(T, "_noms.json"), JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
writeFileSync(join(T, "_prod.json"), JSON.stringify({ produits: {} }), "utf8");
const ENV = { ...process.env, FORGE_NOMS_INTERDITS: join(T, "_noms.json"), FORGE_PRODUITS_PSEUDO: join(T, "_prod.json") };

const ligne = (titre, contenu) => JSON.stringify({ schema: 1, titre, contenu, demandeur: "pilot (recette)",
  source: "ingerer-doublon.test.mjs", date_demande: "2026-09-14", forges_cibles_initiales: ["pilot"], score: { gain: 1, preuve: 1, effort: 1 } });
const registre = join(T, "TODO.jsonl");
writeFileSync(registre, "", "utf8");
const ingerer = (nom, lignes) => {
  const p = join(T, nom);
  writeFileSync(p, lignes.join("\n") + "\n", "utf8");
  const r = spawnSync(process.execPath, [OUTIL, p, "--registre", registre, "--sans-fetch"], { encoding: "utf8", env: ENV, timeout: 180000 });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
};

try {
  const premier = ingerer("premier.tf.jsonl", [ligne("pilot : un défaut mesuré", "le contenu d'origine")]);
  check("mise en place — la première candidature est ingérée", () => {
    if (premier.code !== 0) throw new Error(`exit ${premier.code} : ${premier.sortie.slice(0, 300)}`);
  });
  const id = (/"id":"(TF-\d+)"/.exec(readFileSync(registre, "utf8")) || [])[1];

  check("ROUGE — la même candidature (casse et espaces près) sous un autre lot : rejet atomique, l'id nommé, registre intact", () => {
    const avant = readFileSync(registre, "utf8");
    const r = ingerer("renomme.tf.jsonl", [ligne("pilot : un  DÉFAUT mesuré", "le contenu d'origine")]);
    if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — un doublon strict est entré`);
    if (!/doublon strict/.test(r.sortie) || !r.sortie.includes(id)) throw new Error(`le refus ne nomme pas l'original (${id}) : ${r.sortie.slice(0, 300)}`);
    if (!/reempreinter-lot/.test(r.sortie)) throw new Error("le remède ne nomme pas le geste de rattachement");
    if (readFileSync(registre, "utf8") !== avant) throw new Error("le registre a été écrit malgré le refus");
  });

  check("ROUGE — deux lignes identiques dans le MÊME lot : rejet atomique", () => {
    const r = ingerer("interne.tf.jsonl", [ligne("pilot : autre", "x"), ligne("pilot : autre", "x")]);
    if (r.code !== 1 || !/la ligne 1 du même lot/.test(r.sortie)) throw new Error(`exit ${r.code} — le doublon interne au lot passe`);
  });

  check("VERT — même titre, contenu différent : ingérée (un recouvrement n'est pas un doublon)", () => {
    const r = ingerer("voisin.tf.jsonl", [ligne("pilot : un défaut mesuré", "un contenu qui dit autre chose")]);
    if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  });
} finally {
  rmSync(T, { recursive: true, force: true });
}
console.log(`\ningerer-doublon (TF-0956) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
