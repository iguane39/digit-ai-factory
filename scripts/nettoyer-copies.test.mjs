#!/usr/bin/env node
/**
 * nettoyer-copies.test.mjs — la recette de `nettoyer-copies.mjs`, jouée par `oracles\self-tests.mjs` (I2).
 * Elle joue le `--self-test` du script, qui monte un dépôt jetable : une copie fusionnée, propre et libre
 * est supprimée ; une copie verrouillée, non fusionnée ou portant un fichier non suivi est gardée ; une
 * branche de sauvegarde est gardée (D-97 (a) du 29/10/2026).
 */
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const r = spawnSync(process.execPath, [join(ICI, "nettoyer-copies.mjs"), "--self-test"], { encoding: "utf8" });
let j = null;
try { j = JSON.parse(r.stdout); } catch { /* dit ci-dessous */ }
if (!j) { console.error(`  [FAIL] self-test illisible (exit ${r.status}) : ${(r.stderr || r.stdout).slice(0, 300)}`); console.log("\nnettoyer-copies (D-97) : 0 PASS, 1 FAIL"); process.exit(1); }
for (const c of j.casse) console.error(`  [FAIL] ${c}`);
console.log(`  ${j.couverture}`);
console.log(`\nnettoyer-copies (D-97) : ${j.cas - j.casse.length} PASS, ${j.casse.length} FAIL — couverture à double sens`);
process.exit(j.casse.length ? 1 : 0);
