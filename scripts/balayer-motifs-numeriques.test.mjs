#!/usr/bin/env node
/**
 * balayer-motifs-numeriques.test.mjs — double sens du balayeur (TF-0438) sur une arborescence
 * ÉPHÉMÈRE, plus les six vérités de garde établies PAR EXÉCUTION le 21/08.
 *
 * Ce que la recette verrouille :
 *   1. un motif NU au bord (le défaut d'origine, `0 item(s) actif(s)`) est signalé ;
 *   2. le même motif GARDÉ ne l'est plus — sinon le balayeur crierait sur ses propres correctifs ;
 *   3. un commentaire qui ressemble à un littéral (« (2/4, R-30) ») ne compte pas ;
 *   4. les faits de garde eux-mêmes : `\b` suffit entre deux chiffres, et ÉCHOUE devant un
 *      séparateur décimal — c'est la rectification du 21/08, tenue ici par exécution et non
 *      par une phrase (la première rédaction affirmait le contraire).
 * Joué par oracles/self-tests.mjs (invariant I2 : tout *.test.mjs du dépôt est joué).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "balayer-motifs-numeriques.mjs");
const base = mkdtempSync(join(tmpdir(), "balayeur-"));
const echecs = [];

try {
  // --- 1 à 3 : le balayeur sur une arborescence connue ------------------------------------
  const src = join(base, "src");
  mkdirSync(src, { recursive: true });
  writeFileSync(join(src, "nu.mjs"),
    'if (/0 item\\(s\\) actif\\(s\\)/.test(sortie)) throw new Error("registre vide");\n', "utf8");
  writeFileSync(join(src, "garde.mjs"),
    'if (/(?<![0-9])0 item\\(s\\) actif\\(s\\)/.test(sortie)) throw new Error("registre vide");\n' +
    'if (/exit 1(?![0-9])/.test(sortie)) ok();\n', "utf8");
  writeFileSync(join(src, "commentaire.mjs"),
    "const css = `\n  /* S-G1 (2/4, R-30) — tokens sombres */\n  body { color: red; }\n`;\n", "utf8");

  const r = spawnSync(process.execPath, [OUTIL, src, "--json"], { encoding: "utf8" });
  let rapport = null;
  try { rapport = JSON.parse(r.stdout); } catch { echecs.push(`sortie JSON illisible : ${r.stdout.slice(0, 200)}`); }
  if (rapport) {
    const par = (f) => rapport.hits.filter((h) => h.fichier.endsWith(f));
    if (par("nu.mjs").length !== 1) echecs.push(`1 : motif NU non signalé (${par("nu.mjs").length} hit(s))`);
    if (par("garde.mjs").length) echecs.push(`2 : motif GARDÉ signalé à tort (${par("garde.mjs").length} hit(s)) — le balayeur crierait sur ses propres correctifs`);
    if (par("commentaire.mjs").length) echecs.push("3 : un commentaire CSS compté comme littéral de motif");
  }

  // --- 4 : les faits de garde, établis par exécution ---------------------------------------
  const faits = [
    ["\\b suffit entre deux chiffres", /\b0 item/.test("130 item"), false],
    ["… et laisse passer le vrai zéro", /\b0 item/.test("0 item"), true],
    ["(?<![0-9]) suffit aussi", /(?<![0-9])0 item/.test("130 item"), false],
    ["\\b ÉCHOUE devant un séparateur décimal", /bottom:\s*0\b/.test("bottom: 0.5rem"), true],
    ["… là où (?![0-9.]) tient", /bottom:\s*0(?![0-9.])/.test("bottom: 0.5rem"), false],
    ["… sans refuser le zéro nu", /bottom:\s*0(?![0-9.])/.test("bottom: 0"), true],
  ];
  for (const [nom, obtenu, attendu] of faits)
    if (obtenu !== attendu) echecs.push(`4 : « ${nom} » — obtenu ${obtenu}, attendu ${attendu}`);
} catch (e) {
  echecs.push(`harnais : ${String(e).slice(0, 200)}`);
} finally {
  try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ }
}

if (echecs.length) { console.error("balayer-motifs-numeriques : FAIL\n  - " + echecs.join("\n  - ")); process.exit(1); }
console.log("balayer-motifs-numeriques (TF-0438) : 9/9 — nu signalé, gardé muet, commentaire ignoré, et les 6 faits de garde tenus par exécution");
