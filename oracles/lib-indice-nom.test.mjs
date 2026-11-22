#!/usr/bin/env node
/**
 * lib-indice-nom.test.mjs — l'indice d'un nom de lot se lit pareil partout, « za » compris (TF-2685, 22/11/2026).
 *
 * Le fait : après TF-2681, l'allocateur rend « za » à « zz » au 27e nom d'un jour et le juge de lot les lit ; six autres
 * lecteurs portaient encore `\d{8}[a-z]?`. Ce banc joue CHAQUE lecteur sur un nom en « za », dans les deux sens : un indice
 * valide est lu, un indice qui n'en est pas un (« zzz », majuscule, chiffre) ne l'est pas. Le rouge d'origine est le compte
 * des lecteurs qui refusaient « za » : 7 expressions sur 7 avant la correction (mesuré le 22/11/2026 sur les copies de l'époque).
 * Les lecteurs de B6, B10 (oracle-boite-entree) et de R-4 (oracle-conformite-projet) se jouent dans LEURS recettes
 * (`--self-test` et `oracles\self-test.mjs`), qui portent chacune leurs cas « za ».
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { INDICE, JOUR_INDICE, NOM_DE_LOT } from "./lib-indice-nom.mjs";
import { dateDuLot } from "../gabarits/oracle-lot-retours.mjs";
import { lotsARemettre } from "./lib-retours-produit.mjs";
import { LIVRABLE, moisDuNom } from "../scripts/ranger-dossiers.mjs";

// TF-0957 : `accueillir-lot.mjs` touche la chaîne d'anonymisation. Le banc pose ses tables jetables AVANT de charger ce module,
// pour ne jamais lire ni écrire les tables réelles du poste (`todo\bancs-isoles.mjs`).
const TABLES = mkdtempSync(join(tmpdir(), "indice-nom-tables-"));
writeFileSync(join(TABLES, "_noms-interdits.json"), JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
writeFileSync(join(TABLES, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
process.env.FORGE_NOMS_INTERDITS = join(TABLES, "_noms-interdits.json");
process.env.FORGE_PRODUITS_PSEUDO = join(TABLES, "_produits-pseudonymes.json");
const { estUnLot } = await import("../todo/accueillir-lot.mjs");

let pass = 0, fail = 0;
const check = async (nom, fn) => {
  try { await fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.log(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const LETTRES = [..."abcdefghijklmnopqrstuvwxyz"];
const VALIDES = ["", ...LETTRES, ...LETTRES.map((l) => `z${l}`)];   // 1 + 26 + 26 = 53 formes
const INVALIDES = ["zzz", "A", "zA", "1", "za1", "ab"];
const lot = (indice) => `PROD - RETOURS - 20261115${indice}.md`;

console.log("lib-indice-nom — l'indice d'un nom de lot, une seule écriture (TF-2685)\n");

await check("l'indice commun lit les 53 formes (aucun, « a » à « z », « za » à « zz ») et refuse « zzz », une majuscule, un chiffre, deux lettres sans « z »", () => {
  const re = new RegExp(`^${JOUR_INDICE}$`);
  for (const i of VALIDES) if (!re.test(`20261115${i}`)) throw new Error(`« ${i} » refusé`);
  for (const i of INVALIDES) if (re.test(`20261115${i}`)) throw new Error(`« ${i} » accepté`);
  if (!new RegExp(`^${INDICE}$`).test("za")) throw new Error("INDICE ne lit pas « za »");
});

await check("NOM_DE_LOT sépare préfixe, jour et indice d'un lot « za »", () => {
  const m = NOM_DE_LOT.exec(lot("za"));
  if (!m || m[1] !== "PROD" || m[2] !== "20261115" || m[3] !== "za") throw new Error(JSON.stringify(m));
  if (NOM_DE_LOT.exec(lot("zzz"))) throw new Error("« zzz » est lu comme un lot");
});

await check("PARITÉ — le juge de lot (qui garde sa propre copie, il voyage chez les produits) lit les mêmes 53 formes et refuse les mêmes autres", () => {
  for (const i of VALIDES) if (dateDuLot(lot(i)) !== "20261115") throw new Error(`le juge de lot ne lit pas « ${i} » : ${dateDuLot(lot(i))}`);
  // Un chiffre en plus du jour (« 1 ») n'est pas comparé : `dateDuLot` lit alors les 8 derniers chiffres, ce qui n'est pas l'objet ici.
  for (const i of ["zzz", "ab", "za1"]) {
    const dansLib = NOM_DE_LOT.test(lot(i)), dansJuge = !!dateDuLot(lot(i));
    if (dansLib !== dansJuge) throw new Error(`« ${i} » : lib ${dansLib}, juge de lot ${dansJuge} — les deux expressions ont divergé`);
  }
});

await check("accueillir-lot — estUnLot lit un lot « za » (rouge avant : il le tenait pour un fichier quelconque), et refuse « zzz » et une pièce jointe", () => {
  for (const i of VALIDES) if (!estUnLot(lot(i))) throw new Error(`« ${i} » n'est pas un lot`);
  if (estUnLot(lot("zzz"))) throw new Error("« zzz » est un lot");
  if (estUnLot("PROD - RETOURS - 20261115za - PJ - capture.md")) throw new Error("une pièce jointe est prise pour un lot");
});

await check("lib-retours-produit — lotsARemettre voit un lot « za » à remettre (rouge avant : le lot n'était pas lu, le produit ne se savait pas en retard)", async () => {
  const produit = mkdtempSync(join(tmpdir(), "indice-za-"));
  try {
    mkdirSync(join(produit, "forge", "retours"), { recursive: true });
    writeFileSync(join(produit, "forge", "retours", lot("za")), "# lot\n\n- **Statut** : a_remettre\n", "utf8");
    writeFileSync(join(produit, "forge", "retours", lot("zzz")), "# pas un lot\n\n- **Statut** : a_remettre\n", "utf8");
    const rendu = await lotsARemettre(produit, null, { maintenant: Date.now() + 10 * 24 * 3600 * 1000, anon: null });
    const noms = rendu.map((l) => l.nom);
    if (noms.length !== 1 || noms[0] !== lot("za")) throw new Error(`lots rendus : ${JSON.stringify(noms)}`);
  } finally { rmSync(produit, { recursive: true, force: true }); }
});

await check("ranger-dossiers — LIVRABLE et moisDuNom lisent « za » : le mois et le radical d'un livrable du 28e rang, sans le classer « sans-date »", () => {
  const m = LIVRABLE.exec("Produit - Objet - 20261115za.md");
  if (!m || m[1] !== "Produit - Objet" || m[2] !== "20261115za" || m[3] !== "md") throw new Error(JSON.stringify(m));
  if (LIVRABLE.exec("Produit - Objet - 20261115zzz.md")) throw new Error("« zzz » est lu comme un livrable");
  for (const i of VALIDES) if (moisDuNom(`Produit - Objet - 20261115${i}.md`) !== "2026-11") throw new Error(`mois non lu pour « ${i} »`);
  if (moisDuNom("Produit - Objet - 20261115zzz.md") !== null) throw new Error("« zzz » donne un mois");
});

rmSync(TABLES, { recursive: true, force: true });
console.log(`\nlib-indice-nom : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
