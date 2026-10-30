#!/usr/bin/env node
/**
 * lib-produits-hors-table.test.mjs — D-102 (a) : le signal des produits actifs absents de la table des pseudonymes.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JOURS_ACTIF, produitsActifsHorsTable } from "./lib-produits-hors-table.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const T = mkdtempSync(join(tmpdir(), "hors-table-"));
const pilot = join(T, "digit-ai-factory");
mkdirSync(join(pilot, ".oracles"), { recursive: true });
const p = (n) => join(T, n);
writeFileSync(join(pilot, ".oracles", "produits-au-demarrage.json"), JSON.stringify({ produits: {
  [p("connu-actif")]: {}, [p("inconnu-actif")]: {}, [join(T, "_Client", "inconnu-imbrique")]: {}, [p("inconnu-dormant")]: {}, [p("sans-git")]: {}, [p("digit-ai-marketing")]: {},
} }), "utf8");
const MAINTENANT = Date.parse("2026-10-30T10:00:00Z");
const commits = { "connu-actif": MAINTENANT - 864e5, "inconnu-actif": MAINTENANT - 864e5, "inconnu-imbrique": MAINTENANT - 2 * 864e5, "inconnu-dormant": MAINTENANT - (JOURS_ACTIF + 1) * 864e5, "digit-ai-marketing": MAINTENANT - 864e5 };
const dernierCommit = (c) => commits[c.split(/[\\/]/).pop()] ?? null;
const pseudonyme = (r) => (r === "connu-actif" ? "Produit-01" : "(produit hors table)");
const opts = { pseudonyme, dernierCommit, maintenant: MAINTENANT, ecosysteme: new Set(["digit-ai-marketing"]) };

try {
  const r = produitsActifsHorsTable(pilot, opts);
  check("rouge — un produit actif absent de la table est rendu, un sous-dossier de client compris, par son chemin relatif au parc", () => {
    att(r.horsTable.join(",") === "_Client/inconnu-imbrique,inconnu-actif", r.horsTable.join(","));
  });
  check("vert — un produit de la table, un produit dormant et un dossier sans git ne sont pas rendus", () => {
    for (const n of ["connu-actif", "inconnu-dormant", "sans-git"]) att(!r.horsTable.includes(n), n);
    att(r.actifs === 3 && r.produits === 6, JSON.stringify(r));
  });
  check("borne — un produit de l'écosystème garde son nom par règle : il n'est jamais compté", () => {
    att(!r.horsTable.includes("digit-ai-marketing"), "digit-ai-marketing est compté");
  });
  check("borne — sans relevé de démarrage, rien n'est rendu et rien ne plante", () => {
    const v = produitsActifsHorsTable(join(T, "absent"), opts);
    att(v.horsTable.length === 0 && v.produits === 0, JSON.stringify(v));
  });
} finally { rmSync(T, { recursive: true, force: true }); }
console.log(`\nlib-produits-hors-table (D-102) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
