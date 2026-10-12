#!/usr/bin/env node
/**
 * designation-projet.test.mjs — recette du relevé de la désignation d'un projet (TF-1540).
 * Noms INVENTÉS. Rouge : une forme inconnue des tables qui « tient une séquence » est relevée. Vert : un
 * pseudonyme, un émetteur forge et un mot ordinaire ne le sont pas. Puis le relevé est mesuré sur les
 * lots réels du dépôt : il ne doit relever AUCUN pseudonyme ni mot ordinaire (bruit nul).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { relever, aQualifier, messageAQualifier } from "./designation-projet.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const eq = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} au lieu de ${JSON.stringify(b)}`); };

check("rouge — un sigle inconnu qui tient une séquence est relevé", () => {
  eq(relever("**Numérotation** : ZQX7 tient une séquence `RT-nn` ; RT-1 … RT-42 sont consommés."), ["ZQX7"]);
});
check("rouge — une forme à majuscule, avec l'accent de « séquence » ou non, est relevée une seule fois", () => {
  eq(relever("Zorbax tient une séquence RT-nn. Plus loin, Zorbax tient une sequence d'identifiants."), ["Zorbax"]);
});
check("vert — un pseudonyme, un émetteur forge et un mot ordinaire ne sont pas relevés", () => {
  eq(relever("Produit-11 tient une séquence RT-nn. Client-A tient une séquence. digit-ai-forge-tests tient une séquence. le pilot tient une séquence."), []);
});
check("le message nomme la forme et la décision, aucun refus", () => {
  const m = messageAQualifier(aQualifier(["ZQX7 tient une séquence", "rien"]), "le lot");
  if (!/1 forme\(s\) dans le lot : ZQX7/.test(m) || !/TF-1540/.test(m)) throw new Error(m);
  if (messageAQualifier([]) !== null) throw new Error("un message sans forme");
});
check("bruit mesuré — sur les lots du dépôt, aucune forme relevée n'est un pseudonyme ni un mot ordinaire", () => {
  const racine = join(dirname(fileURLToPath(import.meta.url)), "..", "input", "00-retours");
  let lots = 0;
  const vues = new Set();
  for (const d of [racine, join(racine, "old")]) {
    let noms = [];
    try { noms = readdirSync(d).filter((n) => n.endsWith(".md")); } catch { continue; }
    for (const n of noms) { lots++; for (const f of relever(readFileSync(join(d, n), "utf8"))) vues.add(f); }
  }
  for (const f of vues) if (!/[\p{Lu}\d]/u.test(f) || /^[\p{L}]+-\d+$/u.test(f)) throw new Error(`forme parasite relevée : ${f.length} caractère(s)`);
  console.log(`    (${lots} lots lus, ${vues.size} forme(s) distincte(s) relevée(s))`);
});

console.log(`\ndesignation-projet (TF-1540) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
