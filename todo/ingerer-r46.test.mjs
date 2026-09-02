#!/usr/bin/env node
/**
 * ingerer-r46.test.mjs — R-46 : un lot remis DIT ce que ses documents ont coûté au gabarit.
 *
 * Pendant de R-45 côté LIVRABLES. R-45 demande ce qu'un projet a corrigé chez lui sans le
 * remonter ; R-46 demande ce qui a manqué, gêné ou dû être ajouté à la main dans un document
 * produit depuis un gabarit de `gabarits\documents\`. C'est le seul canal par lequel un gabarit
 * s'améliore : il ne vieillit pas en s'usant, il vieillit parce que la réalité des projets le
 * dépasse et que personne ne le dit.
 *
 * Le couple `gabarit` + `version_du_gabarit` est ce qui rend le retour exploitable — c'est G8 de
 * `oracle-gabarits-documents` qui le fait prescrire par les gabarits, et cette règle-ci qui le
 * fait remonter. Sans lui, « il manquait une section » ne se rattache à aucune famille.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));

// ISOLATION DES TABLES D'ANONYMISATION (02/09/2026) : une recette qui joue l'ingesteur sans les
// isoler INSCRIT ses noms de fixture dans la table REELLE des pseudonymes du parc (« PROD » et
// 24 chemins Temp… y sont entrés ainsi). Tables jetables, donc, comme pour tout ce qui écrit.
{
  const _d = mkdtempSync(join(tmpdir(), "tables-anon-"));
  writeFileSync(join(_d, "_noms-interdits.json"), JSON.stringify({ noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" } }), "utf8");
  writeFileSync(join(_d, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(_d, "_noms-interdits.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(_d, "_produits-pseudonymes.json");
}
const OUTIL = join(ICI, "ingerer-lot.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "r46-"));
const CANDIDATURE = JSON.stringify({
  schema: 1, titre: "pilot : un retour de recette", contenu: "c", demandeur: "produit-recette",
  source: "lot de recette", date_demande: "2026-08-22",
  forges_cibles_initiales: ["digit-ai-factory"],
});

// R-45 est déjà en vigueur : tout lot de recette doit la satisfaire, sinon on mesurerait R-45
// au lieu de R-46. La section ci-dessous est le minimum qui la passe.
const R45 = "\n## Remarques restées au produit\n\nAucune remarque n'est restée au produit — vérifié le 2026-08-22.\n";
const SECTION = "## Retours sur les documents produits";

let serie = 0;
const ingerer = ({ nomLot, md }) => {
  const registre = join(T, `reg-${++serie}.jsonl`);
  writeFileSync(registre, "", "utf8");
  const sidecar = join(T, `${nomLot}.tf.jsonl`);
  writeFileSync(sidecar, CANDIDATURE + "\n", "utf8");
  if (md !== null) writeFileSync(join(T, `${nomLot}.md`), md, "utf8");
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre], { encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), registre };
};

check("rouge — lot du 22/08 SANS la section : refusé, registre intact", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822a", md: "# lot\n" + R45 });
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/R-46/.test(r.sortie)) throw new Error("le refus ne cite pas la règle");
  if (readFileSync(r.registre, "utf8").length !== 0) throw new Error("le registre a été touché malgré le refus");
});

check("rouge — section PRÉSENTE mais aucun retour rattaché à un gabarit", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822b", md: `# lot\n${R45}\n${SECTION}\n\n(rien)\n` });
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/ne s'applique\s*\n?\s*à rien|ne rattache aucun/.test(r.sortie)) throw new Error(`motif inattendu : ${r.sortie.slice(0, 200)}`);
});

check("verte — déclaration explicite qu'aucun document n'est issu d'un gabarit", () => {
  const md = `# lot\n${R45}\n${SECTION}\n\nAucun document produit depuis un gabarit de la bibliothèque sur ce lot.\n`;
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822c", md });
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 200)}`);
});

check("verte — un retour qui NOMME son gabarit et sa version", () => {
  const md = `# lot\n${R45}\n${SECTION}\n\n| Document | Gabarit | Ce qui a manqué |\n|---|---|---|\n| Dossier d'exploitation | gd-dossier-exploitation · version du gabarit 1.0.0 | aucune section sur le décommissionnement progressif |\n`;
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822d", md });
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 200)}`);
});

check("borne — lot ANTÉRIEUR au seuil : antériorité déclarée, jamais réécrite (R-33 bis)", () => {
  // Le lot porte R-45 (en vigueur depuis le 21/08) : sans elle, c'est R-45 qui refuserait et
  // le cas mesurerait la mauvaise règle. Ici, seule la borne de R-46 est en jeu.
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260821z", md: "# lot d'avant R-46\n" + R45 });
  if (r.code !== 0) throw new Error(`un lot du 21/08 a été refusé — le contrôle met l'existant en échec (exit ${r.code})`);
});

check("borne — candidature HORS lot (aucun .md homonyme) : rien à exiger", () => {
  const r = ingerer({ nomLot: "candidature-hors-lot - 20260822a", md: null });
  if (r.code !== 0) throw new Error(`exit ${r.code} : une candidature sans lot n'a pas de section à porter`);
});

check("les deux règles se cumulent — un lot qui passe R-46 mais PAS R-45 reste refusé", () => {
  const md = `# lot\n\n${SECTION}\n\nAucun document produit depuis un gabarit de la bibliothèque sur ce lot.\n`;
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260822e", md });
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — R-45 n'est plus exigée`);
  if (!/R-45/.test(r.sortie)) throw new Error("le refus ne cite pas R-45");
});

rmSync(T, { recursive: true, force: true });
console.log(`\nR-46 (retours sur les documents produits) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
