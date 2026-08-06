#!/usr/bin/env node
/**
 * self-test.mjs — recette à double sens de oracle-conformite-projet :
 * une fixture VERTE construite conforme PASSE (exit 0), une fixture ROUGE à défauts plantés
 * ÉCHOUE (exit 1) en déclenchant chacune des règles attendues. Fixtures construites en
 * dossier temporaire (git réel inclus) — rien n'est écrit dans le dépôt.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const oracle = join(dirname(fileURLToPath(import.meta.url)), "oracle-conformite-projet.mjs");
// Pas de shell : sous Windows, shell:true re-découpe les arguments contenant des espaces
// (constaté : le message de commit éclaté en pathspecs). git/node sont des exécutables directs.
const sh = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: "utf8" });
const lance = (projet) => {
  try { return { exit: 0, rapport: JSON.parse(sh("node", [oracle, projet])) }; }
  catch (e) { return { exit: e.status, rapport: JSON.parse(String(e.stdout || "{}")) }; }
};

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

// ---- fixture VERTE : projet conforme aux 17 règles ------------------------------------------
const verte = mkdtempSync(join(tmpdir(), "conf-verte-"));
for (const d of ["input", "output", "docs", "forge", "output/Old"]) mkdirSync(join(verte, d), { recursive: true });
writeFileSync(join(verte, "CLAUDE.md"), "# Produit\ncommandes, conventions, reprise forge/ledger.jsonl\n");
writeFileSync(join(verte, "README.md"), "# Produit\nDémarrage : 2 commandes.\n");
writeFileSync(join(verte, ".env.example"), "# ne jamais renseigner de secret ici\nPORT=8000\nAPI_TIERCE_CLE= # à fournir :\n");
writeFileSync(join(verte, ".env"), "PORT=8000\n");
writeFileSync(join(verte, ".gitignore"), ".env\n.venv/\n__pycache__/\nnode_modules/\ngenerated/\nOld/\n");
writeFileSync(join(verte, "output", "Digit-AI - Rapport Test - 20260806a.md"), "rapport\n");
writeFileSync(join(verte, "forge", "audit.oracles.json"), "{}\n");
writeFileSync(join(verte, "app.py"), "print('produit')\n");
sh("git", ["init", "-q", "-b", "main"], verte);
sh("git", ["-c", "user.email=t@t", "-c", "user.name=t", "add", "-A"], verte);
sh("git", ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "feat: socle initial du produit"], verte);

check("verte : projet conforme → PASS exit 0", () => {
  const { exit, rapport } = lance(verte);
  if (exit !== 0) throw new Error(`exit ${exit}, findings FAIL : ${JSON.stringify(rapport.findings.filter((f) => f.statut === "FAIL"))}`);
  if (rapport.verdict !== "PASS") throw new Error("verdict != PASS");
  if (!rapport.non_juge.length) throw new Error("non_juge vide — un oracle sans limites déclarées ne juge rien");
});

// ---- fixture ROUGE : défauts plantés, chaque règle dure doit se déclencher -------------------
const rouge = mkdtempSync(join(tmpdir(), "conf-rouge-"));
mkdirSync(join(rouge, "output", "Old"), { recursive: true });      // R-1 (input absent), R-3 (docs absent)
writeFileSync(join(rouge, "output", "rapport-final.md"), "x\n");    // R-4 : livrable non daté
writeFileSync(join(rouge, "output", "Old", "vieux - 20260101a.py"), "x = 1\n"); // R-6 : code sous Old
writeFileSync(join(rouge, "main - 20260806a.py"), "x = 1\n");       // R-6 : code daté
// pas de .gitignore → R-7 (Old non ignoré) + R-10 ; pas de git → R-8 ; ni CLAUDE ni README → R-11/R-12 ; pas d'env.example → R-13

check("rouge : chaque règle attendue se déclenche, FAIL exit 1", () => {
  const { exit, rapport } = lance(rouge);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1`);
  const declenchees = new Set(rapport.findings.filter((f) => f.statut === "FAIL").map((f) => f.regle));
  for (const attendue of ["R-1", "R-3", "R-4", "R-6", "R-7", "R-8", "R-10", "R-11", "R-12", "R-13"])
    if (!declenchees.has(attendue)) throw new Error(`règle ${attendue} non déclenchée sur la fixture rouge`);
});

check("rouge : les findings sont localisants (jamais « quelque part »)", () => {
  const { rapport } = lance(rouge);
  for (const f of rapport.findings) if (!f.ou || !f.message) throw new Error(`finding ${f.regle} sans localisation ou message`);
});

for (const d of [verte, rouge]) rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
console.log(`\nSelf-test conformité projet : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
