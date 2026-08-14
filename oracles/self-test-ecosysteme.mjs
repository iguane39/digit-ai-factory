#!/usr/bin/env node
/**
 * self-test-ecosysteme.mjs — recette à double sens d'oracle-ecosysteme :
 * une fixture VERTE (2 forges, toutes surfaces renseignées) PASSE ; une fixture ROUGE
 * (fiche absente + README muet + compte de schéma faux) ÉCHOUE en déclenchant E1, E6, E7.
 * Fixtures en dossier temporaire — rien n'est écrit dans le dépôt.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const oracle = join(dirname(fileURLToPath(import.meta.url)), "oracle-ecosysteme.mjs");
const lance = (racine) => {
  try { return { exit: 0, r: JSON.parse(execFileSync("node", [oracle, racine], { encoding: "utf8" })) }; }
  catch (e) { return { exit: e.status, r: JSON.parse(String(e.stdout || "{}")) }; }
};
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

function construire(base, { ficheAlpha = true, readmeComplet = true, compte = 3 } = {}) {
  mkdirSync(join(base, "fiches"), { recursive: true });
  mkdirSync(join(base, "output"), { recursive: true });
  writeFileSync(join(base, "bootstrap.mjs"),
    'const FORGES = [\n  { nom: "digit-ai-forge-alpha", preuve: "x" },\n  { nom: "digit-ai-forge-beta", preuve: "y" },\n];\n');
  // E8 (R-28.1/R-31, 14/08) : les forges de fixture sont « nées après la règle » — leurs
  // fiches portent le verdict de non-recouvrement exigé pour rester vertes sur E8.
  if (ficheAlpha) writeFileSync(join(base, "fiches", "forge-alpha.md"),
    "# fiche alpha\n\nNon-recouvrement : aucun service du catalogue ne couvre alpha (vérifié, cité).\n");
  writeFileSync(join(base, "fiches", "forge-beta.md"),
    "# fiche beta\n\nNon-recouvrement : aucun service du catalogue ne couvre beta (vérifié, cité).\n");
  writeFileSync(join(base, "INVENTAIRE.md"), "## forge-alpha\n## forge-beta\n");
  writeFileSync(join(base, "CONTRAT-INTERFACE.md"), "| Alpha | x |\n| Beta | y |\n");
  writeFileSync(join(base, "CLAUDE.md"), "pipeline : alpha → beta\n");
  writeFileSync(join(base, "README.md"),
    readmeComplet ? "forges : forge-alpha · forge-beta\n" : "forges : forge-beta\n");
  writeFileSync(join(base, "output", "Forge Pilot - Schéma Écosystème - 20260811a.html"),
    `<span><b>Périmètre</b> ${compte} forges</span> forge-alpha forge-beta`);
}

// ---- VERTE ---------------------------------------------------------------
const verte = mkdtempSync(join(tmpdir(), "eco-verte-"));
construire(verte);
const v = lance(verte);
check("verte · exit 0", () => { if (v.exit !== 0) throw new Error(`exit ${v.exit}`); });
check("verte · verdict PASS", () => { if (v.r.verdict !== "PASS") throw new Error(v.r.verdict); });
check("verte · E0-E7 sans FAIL", () => {
  const f = v.r.findings.filter(x => x.statut === "FAIL");
  if (f.length) throw new Error(f.map(x => x.regle).join(","));
});

// ---- ROUGE : fiche alpha absente · README muet sur alpha · compte faux ----
const rouge = mkdtempSync(join(tmpdir(), "eco-rouge-"));
construire(rouge, { ficheAlpha: false, readmeComplet: false, compte: 9 });
const r = lance(rouge);
check("rouge · exit 1", () => { if (r.exit !== 1) throw new Error(`exit ${r.exit}`); });
check("rouge · verdict FAIL", () => { if (r.r.verdict !== "FAIL") throw new Error(r.r.verdict); });
check("rouge · E1, E6, E7 et E8 déclenchées (et seulement elles)", () => {
  const durs = [...new Set(r.r.findings.filter(x => x.statut === "FAIL").map(x => x.regle))].sort();
  // E8 depuis la mécanisation R-28.1 (14/08) : fiche absente = verdict de
  // non-recouvrement illisible pour une forge née après la règle.
  if (durs.join(",") !== "E1,E6,E7,E8") throw new Error(`déclenchées : ${durs.join(",")}`);
});
check("rouge · messages localisants", () => {
  const msgs = r.r.findings.filter(x => x.statut === "FAIL").map(x => x.message).join(" | ");
  // fiche alpha ABSENTE → E8 se déclenche aussi (pas de verdict de non-recouvrement
  // lisible) : attendu depuis la mécanisation R-28.1 du 14/08.
  for (const attendu of ["forge-alpha.md", "forge-alpha", "9 forges", "non-recouvrement"])
    if (!msgs.includes(attendu)) throw new Error(`« ${attendu} » absent des messages`);
});

rmSync(verte, { recursive: true, force: true });
rmSync(rouge, { recursive: true, force: true });
console.log(`\nSelf-test oracle-ecosysteme : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
