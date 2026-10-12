#!/usr/bin/env node
/**
 * ledger.test.mjs — recette à double sens du gabarit `gabarits\ledger.py` (TF-1205). Joué par
 * `oracles\self-tests.mjs` (I2).
 *
 * LE DÉFAUT REJOUÉ. Sous une console Windows en cp1252, `python forge/ledger.py etape_close --resume "21/100 → 89/100"`
 * écrivait l'entrée puis levait `UnicodeEncodeError` à l'affichage : code de sortie 1 là où l'écriture avait réussi.
 * Le témoin ROUGE est le gabarit privé de ses deux protections (flux forcés en UTF-8, affichage de repli) : il doit
 * reproduire le défaut exact (entrée écrite ET sortie en échec). Le VERT est le gabarit lui-même, sous la même console.
 *
 * SANS python sur le poste, la recette se déclare NON JOUÉE et sort 0 : elle ne compte ni pour ni contre.
 */
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const GABARIT = readFileSync(join(ICI, "ledger.py"), "utf8");
const PYTHON = ["python", "python3", "py"].find((bin) => {
  const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
});
if (!PYTHON) {
  console.log("\nledger.py : NON JOUÉ — aucun interpréteur python sur ce poste (ni pour ni contre)");
  process.exit(0);
}

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

// La console du défaut : cp1252, sans le mode UTF-8 de Python. PYTHONIOENCODING fixe l'encodage des flux standard.
const CONSOLE = { ...process.env, PYTHONIOENCODING: "cp1252", PYTHONUTF8: "0" };
const RESUME = "21/100 → 89/100";

/** Un produit jetable : `forge\ledger.py` du texte donné, run ouvert. */
function produit(texte) {
  const d = mkdtempSync(join(tmpdir(), "ledger-gabarit-"));
  mkdirSync(join(d, "forge"));
  writeFileSync(join(d, "forge", "ledger.py"), texte, "utf8");
  const script = join(d, "forge", "ledger.py");
  const ouvrir = spawnSync(PYTHON, [script, "run_open", "--run_id", "essai"], { encoding: "utf8", env: CONSOLE });
  att(ouvrir.status === 0, `run_open refusé : ${ouvrir.stderr}`);
  return { d, script };
}
const entrees = (d) => readFileSync(join(d, "forge", "ledger.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

// Le témoin rouge : le gabarit privé de ses deux protections. La chirurgie est VÉRIFIÉE, sans quoi le rouge serait vide.
const sansFlux = GABARIT.replace(/for _flux in \(sys\.stdout, sys\.stderr\):[\s\S]*?pass\n/, "");
const MUTANT = sansFlux.replace("    afficher(ajouter(run, type_, **champs))", "    print(json.dumps(ajouter(run, type_, **champs), ensure_ascii=False))");

const dossiers = [];
try {
  check("témoin — la chirurgie du rouge a bien retiré les deux protections du gabarit", () => {
    att(sansFlux !== GABARIT && !/_flux\.reconfigure/.test(sansFlux), "le bloc des flux n'a pas été retiré");
    att(MUTANT !== sansFlux && !/afficher\(ajouter/.test(MUTANT), "l'affichage de repli n'a pas été retiré");
  });

  check("rouge — sans les protections, une flèche sous cp1252 écrit l'entrée PUIS sort en échec (le défaut du 13/09)", () => {
    const { d, script } = produit(MUTANT); dossiers.push(d);
    const r = spawnSync(PYTHON, [script, "etape_close", "--resume", RESUME], { encoding: "utf8", env: CONSOLE });
    att(r.status !== 0, `le mutant n'échoue pas (exit ${r.status}) : le test ne reproduit pas le défaut`);
    att(/UnicodeEncodeError/.test(r.stderr), `l'échec n'est pas l'erreur d'encodage : ${r.stderr.slice(-200)}`);
    const e = entrees(d);
    att(e.length === 2 && e[1].resume === RESUME, "l'entrée n'a pas été écrite avant l'échec : ce n'est pas le défaut décrit");
  });

  check("vert — le gabarit sous la même console écrit l'entrée et SORT 0, la flèche affichée en UTF-8", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    const r = spawnSync(PYTHON, [script, "etape_close", "--resume", RESUME], { env: CONSOLE });
    att(r.status === 0, `exit ${r.status} : ${r.stderr}`);
    const sortie = JSON.parse(r.stdout.toString("utf8"));
    att(sortie.seq === 2 && sortie.resume === RESUME, `confirmation illisible : ${r.stdout.toString("utf8")}`);
    att(entrees(d).length === 2 && entrees(d)[1].resume === RESUME, "le ledger ne porte pas l'entrée exacte");
  });

  check("vert — rejouer une commande réussie ajoute UNE entrée de plus, jamais un doublon silencieux d'un échec", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    for (let i = 0; i < 2; i++) att(spawnSync(PYTHON, [script, "retour", "--resume", RESUME], { env: CONSOLE }).status === 0, "rejeu refusé");
    att(entrees(d).map((x) => x.seq).join() === "1,2,3", "seq non strictement croissants");
  });

  check("vert — --verifier affiche ses accents (« INTÈGRE », « · ») sous cp1252 et sort 0", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    spawnSync(PYTHON, [script, "retour", "--resume", RESUME], { env: CONSOLE });
    const r = spawnSync(PYTHON, [script, "--verifier"], { env: CONSOLE });
    att(r.status === 0 && /INTÈGRE/.test(r.stdout.toString("utf8")), `exit ${r.status} : ${r.stderr}`);
  });

  check("vert — un flux qui refuse l'UTF-8 et ne sait pas se reconfigurer : repli ASCII échappé, entrée écrite, exit 0", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    const harnais = join(d, "harnais.py");
    writeFileSync(harnais, [
      "import sys, runpy",
      "class Strict:",
      "    def __init__(self): self.sortie = []",
      "    def write(self, s):",
      "        s.encode('ascii')",
      "        self.sortie.append(s)",
      "        return len(s)",
      "    def flush(self): pass",
      "strict = Strict()",
      "reel = sys.stdout",
      "sys.stdout = strict",
      `sys.argv = ['ledger.py', 'retour', '--resume', ${JSON.stringify(RESUME)}]`,
      `runpy.run_path(${JSON.stringify(script)}, run_name='__main__')`,
      "reel.write(''.join(strict.sortie))",
    ].join("\n"), "utf8");
    const r = spawnSync(PYTHON, [harnais], { encoding: "utf8", env: CONSOLE });
    att(r.status === 0, `exit ${r.status} : ${r.stderr.slice(-300)}`);
    att(/\\u2192/.test(r.stdout), `le repli ASCII n'a pas été affiché : ${r.stdout}`);
    att(entrees(d).length === 2 && entrees(d)[1].resume === RESUME, "l'entrée n'est pas écrite telle quelle");
  });

  check("vert — un type inconnu est refusé sans rien écrire, et le gabarit garde le contrat (première entrée run_open)", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    const r = spawnSync(PYTHON, [script, "inconnu"], { encoding: "utf8", env: CONSOLE });
    att(r.status !== 0 && entrees(d).length === 1, `exit ${r.status}, ${entrees(d).length} entrée(s)`);
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { for (const d of dossiers) if (existsSync(d)) rmSync(d, { recursive: true, force: true }); }

console.log(`\nledger.py (gabarit) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
