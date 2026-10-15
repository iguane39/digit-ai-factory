#!/usr/bin/env node
/**
 * ouvrir-run.test.mjs — recette à double sens de `ouvrir-run.mjs` (TF-1697).
 *
 * Sur des projets FABRIQUÉS puis ADOPTÉS par le vrai `adopter-projet-existant.mjs` : le défaut
 * d'origine est rejoué (un projet adopté rend FAIL R-12, R-13 et R-20, et rien ne pose le socle),
 * puis le geste le pose, sans rien écraser, sans rien reposer au second passage, et l'oracle de
 * conformité dit ce qui reste. Le `run_open` s'écrit par le vrai `ledger.mjs` de forge-agents quand
 * il est cloné sous la racine du parc ; sinon ces cas sont déclarés NON JOUÉS, jamais comptés verts.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { adopter, TYPE_DOCUMENTAIRE } from "./adopter-projet-existant.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(ICI, "..");
let pass = 0, fail = 0, nonJoues = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

// Le module s'importe dynamiquement : absent (l'état d'avant TF-1697), chaque cas est ROUGE et compté.
let M = null;
try { M = await import("./ouvrir-run.mjs"); } catch (e) { M = { erreur: e.message }; }
const ouvrirRun = (...a) => { if (!M.ouvrirRun) throw new Error(`aucun geste outillé d'ouverture de run (${M.erreur || "ouvrirRun absent"})`); return M.ouvrirRun(...a); };

// La racine du parc qui porte l'écrivain du ledger : FORGE_ROOT, le parent du pilot, ou celui de la copie principale.
const LEDGER_REL = join("digit-ai-forge-agents", ".claude", "skills", "forge-agents", "scripts", "ledger.mjs");
const RACINE = [process.env.FORGE_ROOT, dirname(PILOT), resolve(PILOT, "..", "..", "..", "..")]
  .filter(Boolean).map((r) => resolve(r)).find((r) => existsSync(join(r, LEDGER_REL))) || null;

const T = mkdtempSync(join(tmpdir(), "ouvrir-run-"));
const conformite = (d) => {
  const o = spawnSync(process.execPath, [join(PILOT, "oracles", "oracle-conformite-projet.mjs"), d], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return JSON.parse(o.stdout).findings || [];
};
const fails = (f, regle) => f.filter((x) => x.regle === regle && x.statut === "FAIL");
let n = 0;
const projetAdopte = (fichiers = {}, opts = {}) => {
  const d = join(T, `p${++n}`);
  mkdirSync(d, { recursive: true });
  for (const [rel, c] of Object.entries(fichiers)) { mkdirSync(dirname(join(d, rel)), { recursive: true }); writeFileSync(join(d, rel), c, "utf8"); }
  spawnSync("git", ["init", "-q"], { cwd: d });
  const a = adopter(d, { pilot: PILOT, ...opts });
  if (a.verdict !== "ADOPTE") throw new Error(`adoption de la fixture : ${a.verdict} — ${a.motif || ""}`);
  return d;
};

try {
  check("ROUGE (le défaut d'origine) — un projet tout juste adopté rend FAIL R-12, R-13 et R-20 : rien ne pose le socle d'ouverture", () => {
    const f = conformite(projetAdopte({ "src/app.py": "print(1)\n" }));
    att(fails(f, "R-12").length && fails(f, "R-13").length && fails(f, "R-20").some((x) => /docs\\projet|absent/.test(x.ou + x.message)), `la fixture ne rejoue pas le défaut : ${JSON.stringify(f.filter((x) => x.statut === "FAIL").map((x) => x.regle))}`);
  });

  check("VERT — le geste pose docs\\projet\\ (toutes les fiches du gabarit), README.md et .env.example ; R-12 passe, R-20 n'accuse plus un dossier absent", () => {
    const d = projetAdopte({ "src/app.py": "print(1)\n" });
    const r = ouvrirRun({ projet: d, racine: RACINE || T });
    const attendues = readdirSync(join(PILOT, "gabarits", "docs-projet")).filter((x) => x.endsWith(".md"));
    for (const x of attendues) att(existsSync(join(d, "docs", "projet", x)), `docs/projet/${x} non posé`);
    att(existsSync(join(d, "README.md")) && existsSync(join(d, ".env.example")), "README.md ou .env.example non posé");
    const f = conformite(d);
    att(!fails(f, "R-12").length, `R-12 encore FAIL : ${JSON.stringify(fails(f, "R-12"))}`);
    att(!fails(f, "R-20").some((x) => /dossier absent/.test(x.message)), "R-20 accuse encore un docs\\projet\\ absent");
    att(r.conformite.verdict === "FAIL" || r.conformite.verdict === "PASS", `conformité non jouée : ${JSON.stringify(r.conformite)}`);
  });

  check("VERT — aucune variable n'est inventée : .env.example sans variable, et R-13 reste un RESTE À FAIRE nommé", () => {
    const d = projetAdopte({ "src/app.py": "print(1)\n" });
    const r = ouvrirRun({ projet: d, racine: RACINE || T });
    att(!/^[A-Z][A-Z0-9_]*=/m.test(readFileSync(join(d, ".env.example"), "utf8")), "une variable a été inventée dans .env.example");
    att(r.restes.some((x) => x.regle === "R-13"), `R-13 n'est pas dite au reste à faire : ${JSON.stringify(r.restes.map((x) => x.regle))}`);
    att(r.verdict === "RESTES", `verdict ${r.verdict} alors que des restes existent`);
  });

  check("NON DESTRUCTIF — un README.md et une fiche docs\\projet\\ préexistants ne sont pas réécrits", () => {
    const d = projetAdopte({ "README.md": "# Le mien\n", "docs/projet/TECHNOS.md": "ma fiche\n" });
    ouvrirRun({ projet: d, racine: RACINE || T });
    att(readFileSync(join(d, "README.md"), "utf8") === "# Le mien\n", "README.md réécrit");
    att(readFileSync(join(d, "docs", "projet", "TECHNOS.md"), "utf8") === "ma fiche\n", "TECHNOS.md réécrit");
  });

  check("IDEMPOTENT — le second passage ne pose rien", () => {
    const d = projetAdopte();
    ouvrirRun({ projet: d, racine: RACINE || T });
    const r2 = ouvrirRun({ projet: d, racine: RACINE || T });
    att(r2.poses === 0, `${r2.poses} élément(s) reposé(s) au second passage`);
  });

  check("DOCUMENTAIRE — un projet déclaré documentaire ne reçoit pas de .env.example (TF-1439)", () => {
    const d = projetAdopte({ "notes/a.md": "# a\n" }, { type: TYPE_DOCUMENTAIRE });
    ouvrirRun({ projet: d, racine: RACINE || T });
    att(!existsSync(join(d, ".env.example")), ".env.example posé sur un projet documentaire");
  });

  check("REFUS — un dossier sans forge\\ est renvoyé à l'adoption, rien n'est écrit ; le pilot est refusé", () => {
    const d = join(T, "non-adopte"); mkdirSync(d);
    const r = ouvrirRun({ projet: d, racine: RACINE || T });
    att(r.verdict === "REFUS" && /adopter-projet-existant/.test(r.motif) && readdirSync(d).length === 0, `${r.verdict} — ${r.motif}`);
    att(ouvrirRun({ projet: PILOT, racine: RACINE || T }).verdict === "REFUS", "le pilot n'est pas refusé");
  });

  check("SANS --forges — aucun run_open n'est écrit, et c'est un reste à faire nommé (la liste ne se devine pas)", () => {
    const d = projetAdopte();
    const r = ouvrirRun({ projet: d, run: "r1", racine: RACINE || T });
    att(!existsSync(join(d, "forge", "ledger.jsonl")), "un ledger a été écrit sans forges mobilisées");
    att(r.restes.some((x) => x.regle === "run_open" && /--forges/.test(x.message)), "le reste run_open n'est pas dit");
  });

  if (!RACINE) {
    nonJoues += 2;
    console.log("  [NON JOUÉ] 2 cas — ledger.mjs de forge-agents introuvable sous la racine du parc : run_open non testé");
  } else {
    check("RUN_OPEN — écrit par ledger.mjs : schéma 1.1, forges_mobilisees, versions_forges aux noms complets ; verify PASS", () => {
      const d = projetAdopte();
      const r = ouvrirRun({ projet: d, run: "ouverture", forges: "design,tests", racine: RACINE });
      const lignes = readFileSync(join(d, "forge", "ledger.jsonl"), "utf8").trim().split(/\r?\n/).map((l) => JSON.parse(l));
      att(lignes.length === 1 && lignes[0].type === "run_open" && lignes[0].seq === 1, `ledger : ${JSON.stringify(lignes)}`);
      att(lignes[0].schema_ledger === "1.1" && JSON.stringify(lignes[0].forges_mobilisees) === '["design","tests"]', "forme du run_open");
      att(Object.keys(lignes[0].versions_forges).length && Object.keys(lignes[0].versions_forges).every((k) => /^digit-ai-/.test(k)), `versions_forges : ${JSON.stringify(lignes[0].versions_forges)}`);
      att(!r.restes.some((x) => x.regle === "run_open"), "un reste run_open est dit alors que l'entrée est écrite");
      const v = spawnSync(process.execPath, [join(RACINE, LEDGER_REL), "verify", join(d, "forge", "ledger.jsonl")], { encoding: "utf8" });
      att(v.status === 0, `ledger.mjs verify : exit ${v.status} — ${v.stdout}${v.stderr}`);
    });
    check("RUN_OPEN — jamais un second : un ledger qui porte déjà un run_open n'est pas complété", () => {
      const d = projetAdopte();
      ouvrirRun({ projet: d, run: "a", forges: "design", racine: RACINE });
      const r = ouvrirRun({ projet: d, run: "b", forges: "design", racine: RACINE });
      att(readFileSync(join(d, "forge", "ledger.jsonl"), "utf8").trim().split(/\r?\n/).length === 1, "un second run_open a été écrit");
      att(r.faits.some((f) => /DÉJÀ écrit/.test(f.action)), "le refus d'un second run_open n'est pas dit");
    });
  }
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nouvrir-run (TF-1697) : ${pass} PASS, ${fail} FAIL${nonJoues ? `, ${nonJoues} NON JOUÉ(S)` : ""} — cas rouges : le défaut d'origine rejoué, aucune variable inventée, aucun run_open sans forges déclarées, aucun second run_open`);
process.exit(fail ? 1 : 0);
