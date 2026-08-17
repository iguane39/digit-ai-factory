#!/usr/bin/env node
/**
 * self-test-ecosysteme.mjs — recette à double sens d'oracle-ecosysteme :
 * une fixture VERTE (2 forges, toutes surfaces renseignées) PASSE ; une fixture ROUGE
 * (fiche absente + README muet + compte de schéma faux) ÉCHOUE en déclenchant E1, E6, E7.
 * E9 (TF-0319) a ses deux fixtures dédiées, pour ne pas perturber les assertions exactes des
 * deux premières : `verteE9` (livrables marqués rangés + pièges de faux positifs) et `rougeE9`
 * (marqué hors output\, marqué sans famille D-15, marqué dans un dépôt sans output\).
 * Fixtures en dossier temporaire — rien n'est écrit dans le dépôt, ni dans les dépôts frères.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const oracle = join(dirname(fileURLToPath(import.meta.url)), "oracle-ecosysteme.mjs");
// FORGE_ROOT est TOUJOURS imposé : sans cela, E9 irait lire les vrais dépôts frères du poste et
// la recette cesserait d'être déterministe (elle dépendrait de l'état de 13 dépôts vivants).
const lance = (racine, forgeRoot) => {
  const env = { ...process.env, FORGE_ROOT: forgeRoot };
  try { return { exit: 0, r: JSON.parse(execFileSync("node", [oracle, racine], { encoding: "utf8", env })) }; }
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

// ---- dépôts de forge de fixture pour E9 (TF-0319) -------------------------
// La marque est le SEUL critère : un livrable marqué se juge, tout le reste est invisible.
const MARQUE = "---\nrole: rapport de campagne\ndestinataire: humain\nverifie_le: 2026-08-17\n---\n\n# Rapport\n";
const NON_MARQUE = "---\nrole: doctrine de la forge\nverifie_le: 2026-08-17\n---\n\n# Doctrine\n";
const ecrire = (base, chemin, contenu) => {
  const abs = join(base, ...chemin.split("/"));
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, contenu);
};
/** `mode: "conforme"` — livrable marqué rangé sous `output\01-rapports\`, plus quatre pièges de
 *  faux positifs qui doivent rester MUETS : un livrable DATÉ mais non marqué à la racine (c'est
 *  le contrôle par motif de nom que l'option O2 rouvrait et que `oracle-conventions.mjs` avait
 *  refusé en SANS_OBJET D-01), et trois marqués en zones hors jugement (`input\`, `gabarits\`,
 *  `old\`).
 *  `mode: "rouge"` — les trois défauts que E9 doit savoir dire. */
function construireForges(forgeRoot, mode) {
  const alpha = join(forgeRoot, "digit-ai-forge-alpha"), beta = join(forgeRoot, "digit-ai-forge-beta");
  if (mode === "conforme") {
    ecrire(alpha, "output/01-rapports/Digit-AI - Rapport Alpha - 20260817a.md", MARQUE);
    ecrire(alpha, "Digit-AI - Rapport Alpha Ancien - 20260804a.md", NON_MARQUE); // daté, NON marqué → jamais jugé
    ecrire(alpha, "input/Client - Rapport Entrant - 20260817a.md", MARQUE);       // entrant = donnée
    ecrire(alpha, "gabarits/RESTITUTION.md", MARQUE);                            // porteur de FORME
    ecrire(alpha, "output/01-rapports/old/Digit-AI - Rapport Alpha - 20260801a.md", MARQUE); // archive gelée
    ecrire(beta, "output/LISEZMOI.md", "# familles\n");
    ecrire(beta, "docs/NOTE-NORMATIVE.md", MARQUE);                              // docs\ = zone de dépôt (D-06)
    return;
  }
  ecrire(alpha, "Digit-AI - Rapport Alpha - 20260817a.md", MARQUE);              // (1) hors output\
  ecrire(alpha, "output/Digit-AI - Rapport Alpha Bis - 20260817a.md", MARQUE);   // (2) output\ sans famille D-15
  ecrire(beta, "Digit-AI - Rapport Beta - 20260817a.md", MARQUE);                // (3) hors output\ ET dépôt sans output\
}

// ---- VERTE ---------------------------------------------------------------
// FORGE_ROOT vide : E9 SANS_OBJET, les assertions exactes de E0-E8 restent intactes.
const sansForges = mkdtempSync(join(tmpdir(), "eco-sans-forges-"));
const verte = mkdtempSync(join(tmpdir(), "eco-verte-"));
construire(verte);
const v = lance(verte, sansForges);
check("verte · exit 0", () => { if (v.exit !== 0) throw new Error(`exit ${v.exit}`); });
check("verte · verdict PASS", () => { if (v.r.verdict !== "PASS") throw new Error(v.r.verdict); });
check("verte · E0-E7 sans FAIL", () => {
  const f = v.r.findings.filter(x => x.statut === "FAIL");
  if (f.length) throw new Error(f.map(x => x.regle).join(","));
});

// ---- ROUGE : fiche alpha absente · README muet sur alpha · compte faux ----
const rouge = mkdtempSync(join(tmpdir(), "eco-rouge-"));
construire(rouge, { ficheAlpha: false, readmeComplet: false, compte: 9 });
const r = lance(rouge, sansForges);
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

// ---- VERTE-E9 (TF-0319) : le rangement conforme passe, et les pièges restent muets --------
const verteE9 = mkdtempSync(join(tmpdir(), "eco-verte-e9-"));
const forgesVertes = mkdtempSync(join(tmpdir(), "eco-forges-vertes-"));
construire(verteE9);
construireForges(forgesVertes, "conforme");
const v9 = lance(verteE9, forgesVertes);
check("verte-E9 · exit 0 et aucun FAIL E9 (livrables marqués rangés sous output\\<NN>-)", () => {
  if (v9.exit !== 0) throw new Error(`exit ${v9.exit} — FAIL : ${JSON.stringify(v9.r.findings.filter(x => x.statut === "FAIL"))}`);
  const e9 = v9.r.findings.filter(x => x.regle === "E9");
  if (!e9.length) throw new Error("aucun finding E9 — une règle qui ne se prononce jamais n'existe pas");
  if (e9.some(x => x.statut === "FAIL")) throw new Error(e9.filter(x => x.statut === "FAIL").map(x => x.message).join(" | "));
});
check("verte-E9 · un fichier DATÉ mais NON marqué n'est jamais jugé (verrou D-01 levé, zéro faux positif)", () => {
  const msgs = v9.r.findings.filter(x => x.regle === "E9").map(x => x.message).join(" | ");
  for (const piege of ["Alpha Ancien", "input/", "gabarits/", "old/"])
    if (msgs.includes(piege)) throw new Error(`« ${piege} » jugé alors qu'il est hors marquage ou hors jugement : c'est le faux positif que l'option O2 rouvrait`);
  const pass9 = v9.r.findings.find(x => x.regle === "E9" && x.statut === "PASS");
  if (!pass9 || !/livrable\(s\) marqué\(s\)/.test(pass9.message))
    throw new Error("le verdict ne dit pas combien de livrables marqués ont été vus — un contrôle muet est indistinguable d'une absence de règle");
});

// ---- ROUGE-E9 (TF-0319) : les trois défauts que E9 doit savoir dire ----------------------
const rougeE9 = mkdtempSync(join(tmpdir(), "eco-rouge-e9-"));
const forgesRouges = mkdtempSync(join(tmpdir(), "eco-forges-rouges-"));
construire(rougeE9); // socle pilot VERT : seule E9 doit tomber
construireForges(forgesRouges, "rouge");
const r9 = lance(rougeE9, forgesRouges);
check("rouge-E9 · exit 1 et E9 SEULE déclenchée", () => {
  if (r9.exit !== 1) throw new Error(`exit ${r9.exit} attendu 1`);
  const durs = [...new Set(r9.r.findings.filter(x => x.statut === "FAIL").map(x => x.regle))].sort();
  if (durs.join(",") !== "E9") throw new Error(`déclenchées : ${durs.join(",")} — le socle pilot de cette fixture est vert, E9 seule doit tomber`);
});
check("rouge-E9 · 4 constats localisants : hors output\\ ×2, sans famille D-15, dépôt sans output\\", () => {
  const e9 = r9.r.findings.filter(x => x.regle === "E9" && x.statut === "FAIL");
  if (e9.length !== 4) throw new Error(`4 constats attendus, ${e9.length} obtenu(s) : ${JSON.stringify(e9.map(x => x.message))}`);
  const msgs = e9.map(x => x.message).join(" | ");
  for (const attendu of ["forge-alpha : Digit-AI - Rapport Alpha - 20260817a.md", "forge-beta : Digit-AI - Rapport Beta - 20260817a.md",
    "hors de output\\", "sans famille", "AUCUN dossier output\\", "digit-ai-forge-beta\\output\\"])
    if (!msgs.includes(attendu)) throw new Error(`« ${attendu} » absent des messages : ${msgs}`);
});

for (const d of [verte, rouge, verteE9, rougeE9, sansForges, forgesVertes, forgesRouges])
  rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
console.log(`\nSelf-test oracle-ecosysteme : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
