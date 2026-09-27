#!/usr/bin/env node
/**
 * lib-parc.test.mjs — les dépôts déclarés du parc, et la lecture commune des balayages (TF-1327,
 * 27/09/2026). Rouge d'origine : le produit de marque `digit-ai-marketing` jugé comme une forge par
 * `oracle-empreintes`, parce que le périmètre se lisait au seul préfixe du nom.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { FORGES, PILOT, PRODUITS_DE_L_ECOSYSTEME, estDepotEcosysteme } from "./lib-parc.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

check("rouge d'origine — un PRODUIT déclaré de l'écosystème n'est pas balayé comme une forge", () => {
  if (!PRODUITS_DE_L_ECOSYSTEME.has("digit-ai-marketing")) throw new Error("le produit de marque n'est plus déclaré");
  if (estDepotEcosysteme("digit-ai-marketing")) throw new Error("digit-ai-marketing est pris pour une forge");
});
check("vert — le pilot et chaque forge déclarée restent balayés", () => {
  for (const nom of [PILOT, ...FORGES.map((f) => f.nom)]) if (!estDepotEcosysteme(nom)) throw new Error(`${nom} sort du balayage`);
});
check("vert — un dossier hors de l'écosystème n'est pas balayé", () => {
  for (const nom of ["_confidentiel", "un-produit-client", "Digit-ai.fr"]) if (estDepotEcosysteme(nom)) throw new Error(`${nom} est balayé`);
});
check("borne — une forge FICTIVE de banc reste balayée (les bancs jouent des parcs jetables)", () => {
  if (!estDepotEcosysteme("digit-ai-forge-jouet")) throw new Error("un banc de forge fictive deviendrait aveugle");
});

console.log(`\nlib-parc (TF-1327) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
