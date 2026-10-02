#!/usr/bin/env node
/**
 * espacement-4pt-herite.test.mjs — recette de TF-1274 (20/09/2026, mesuré le 20/09, corrigé le
 * 02/10/2026).
 *
 * LE FAIT. En bâtissant 10 pages sur le patron de `rapport-de-donnees`, l'agent de campagne du
 * 20/09 a mesuré 2 écarts T3 durs d'oracle-tokens (forge-design) venant du BLOC DE STYLE HÉRITÉ
 * des trois familles antérieures de `gabarits\documents\` (`rapport-de-donnees`,
 * `dossier-architecture-technique`, `dossier-exploitation`) : les cellules de tableau (`th, td`)
 * en `8px 10px` et le sommaire latéral (`nav.toc`) en `16px 18px` — deux valeurs hors de
 * l'échelle 4 pt (4, 8, 12, 16, 20, 24…). L'agent les avait corrigées dans ses SEULS fichiers ;
 * les trois familles sources les portaient encore, et auraient été refusées par oracle-tokens à
 * son prochain passage.
 *
 * CE QUE CETTE RECETTE VÉRIFIE : les deux valeurs incriminées sont absentes des gabarits SQUELETTE
 * et INSTANCE des trois familles nommées, et les valeurs recalées (`8px 12px`, `16px 20px` —
 * celles déjà retenues par les familles plus récentes du même dossier) sont bien en place. Elle
 * ne rejoue pas oracle-tokens lui-même, qui vit chez forge-design et n'est pas dans ce dépôt ;
 * elle verrouille la PART du défaut qui vit ici, dans le texte du gabarit hérité. Jouée par
 * `oracles\self-tests.mjs` (I2, découverte des `*.test.mjs` du dépôt à deux niveaux).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const FAMILLES = ["rapport-de-donnees", "dossier-architecture-technique", "dossier-exploitation"];
const FICHIERS = ["SQUELETTE.html", "INSTANCE.html"];

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

for (const fam of FAMILLES) {
  for (const nom of FICHIERS) {
    const chemin = join(ICI, fam, nom);
    let texte;
    try { texte = readFileSync(chemin, "utf8"); }
    catch (e) { check(`${fam}/${nom} lisible`, () => { throw new Error(e.message); }); continue; }

    check(`${fam}/${nom} — les cellules de tableau ne sont plus en 8px 10px (hors échelle 4 pt)`, () => {
      if (/padding:\s*8px 10px/.test(texte)) {
        throw new Error("le bloc th, td porte encore 8px 10px — 10 n'est pas un multiple de 4");
      }
    });
    check(`${fam}/${nom} — les cellules de tableau sont en 8px 12px, recalées sur l'échelle 4 pt`, () => {
      if (!/th,\s*td\s*\{[^}]*padding:\s*8px 12px/.test(texte)) {
        throw new Error("le bloc th, td n'affiche pas padding: 8px 12px — la correction a-t-elle été reprise ?");
      }
    });
    check(`${fam}/${nom} — le sommaire latéral n'est plus en 16px 18px (hors échelle 4 pt)`, () => {
      if (/padding:\s*16px 18px/.test(texte)) {
        throw new Error("le bloc nav.toc porte encore 16px 18px — 18 n'est pas un multiple de 4");
      }
    });
    check(`${fam}/${nom} — le sommaire latéral est en 16px 20px, recalé sur l'échelle 4 pt`, () => {
      if (!/nav\.toc\s*\{[^}]*padding:\s*16px 20px/.test(texte)) {
        throw new Error("le bloc nav.toc n'affiche pas padding: 16px 20px — la correction a-t-elle été reprise ?");
      }
    });
  }
}

console.log(`\nespacement-4pt-herite (TF-1274) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
