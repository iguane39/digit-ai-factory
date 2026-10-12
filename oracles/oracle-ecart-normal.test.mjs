#!/usr/bin/env node
/**
 * oracle-ecart-normal.test.mjs — recette à double sens de `oracle-ecart-normal.mjs` (TF-1511).
 * Joué par `oracles\self-tests.mjs` (I1/I2). Le cas rouge est la phrase réelle du 30/09/2026.
 */
import { phrasesSignalees, verifierCorpus, VERSION } from "./oracle-ecart-normal.mjs";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (c, m) => { if (!c) throw new Error(m); };
const n = (t) => phrasesSignalees(t).length;

try {
  check("rouge — le cas fondateur du 30/09/2026 est signalé", () => {
    att(n("Le site renvoie l'erreur AADSTS700038 : C'est normal à ce stade, le site est né fermé.") === 1, "non signalé");
  });
  check("rouge — « attendu » à côté d'un HTTP 503 est signalé", () => {
    att(n("Le HTTP 503 est attendu pendant le déploiement.") === 1, "non signalé");
  });
  check("rouge — « voulu » à côté d'une erreur 403 est signalé", () => {
    att(n("L'erreur 403 est l'état voulu.") === 1, "non signalé");
  });
  check("rouge — une cellule de tableau est jugée seule", () => {
    att(n("| titre | L'erreur AADSTS700038 est normale | autre |") === 1, "cellule non jugée");
  });
  check("verte — la formulation corrigée (écart à fermer) n'est pas signalée", () => {
    att(n("L'erreur AADSTS700038 n'est pas normale : c'est l'écart à fermer.") === 0, "la version corrigée est signalée");
    att(n("L'erreur AADSTS700038 est un écart connu, à fermer par la création de l'inscription.") === 0, "l'écart est signalé");
  });
  check("verte — un mot de normalité sans code d'erreur n'est pas signalé", () => {
    att(n("Le comportement est normal pour ce produit.") === 0, "faux positif sans code");
  });
  check("verte — un code d'erreur sans mot de normalité n'est pas signalé", () => {
    att(n("Le site renvoie l'erreur AADSTS700038.") === 0, "faux positif sans mot");
  });
  check("verte — deux phrases distinctes ne se croisent pas", () => {
    att(n("Le site renvoie l'erreur HTTP 500. Le reste est normal.") === 0, "la coupure de phrase ne tient pas");
  });
  check("corpus — un dossier est parcouru, le rouge compte 1, le vert 0", () => {
    const d = mkdtempSync(join(tmpdir(), "ecart-normal-"));
    try {
      writeFileSync(join(d, "rouge.md"), "L'erreur AADSTS700038 est normale à ce stade.\n");
      writeFileSync(join(d, "vert.md"), "L'erreur AADSTS700038 est un écart à fermer.\n");
      const r = verifierCorpus([d]);
      att(r.fichiers === 2 && r.signales.length === 1 && /rouge\.md$/.test(r.signales[0].fichier), JSON.stringify(r));
    } finally { rmSync(d, { recursive: true, force: true }); }
  });
  check("VERSION exportée", () => att(/^\d+\.\d+\.\d+$/.test(VERSION), VERSION));
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }

console.log(`\noracle-ecart-normal (TF-1511) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
