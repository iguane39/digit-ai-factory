#!/usr/bin/env node
/**
 * hooks-factory.mjs — lanceur des hooks de la factory DEPUIS un produit (copié en
 * forge\hooks\factory.mjs à l'ouverture du run — gabarits\settings-produit.json, R-44).
 *
 * Il ne porte aucune règle : il RÉSOUT le pilot (même ordre que AGENTS.md — $FORGE_ROOT,
 * parent du produit, c:\dev, ~/.digit-ai-forge) et délègue au hook du pilot, stdin compris
 * (le hook Stop lit le transcript sur stdin). Ainsi une règle corrigée dans la factory
 * s'applique au produit sans recopie — et quand la factory est impliquée, ses règles
 * priment sur celles du projet (R-43).
 *
 * Usage : node forge\hooks\factory.mjs <ouverture|restitution|page-html|lexique> [options du hook]
 * Pilot introuvable : le hook est sauté en le DISANT (stderr), jamais en silence, exit 0 —
 * un produit ne doit pas devenir inutilisable parce que la factory n'est pas sur ce poste.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PRODUIT = resolve(ICI, "..", "..");
const [nom, ...options] = process.argv.slice(2);
// `page-html` (TF-0765, 02/09/2026) : hook PostToolUse joué à chaque écriture d'un fichier .html du
// produit — les règles de socle d'une page (filtres de tableau L4 / G1-G6) se rencontrent au moment
// où l'on produit, pas au pilot trois livraisons plus tard. Avertit, ne bloque jamais.
// `lexique` (03/09/2026, mandat d'amélioration continue) : hook UserPromptSubmit — le lexique
// d'invocation RV-6 (« améliore le prompt », « l99 », « barre », « améliore ce skill ») cesse d'être
// une consigne que l'agent oublie : le hook reconnaît le mot-clé et injecte l'appel du skill.
const NOMS = new Set(["ouverture", "restitution", "page-html", "lexique"]);
if (!NOMS.has(nom)) { console.error(`[hooks-factory] hook inconnu : ${nom} (attendu : ouverture | restitution | page-html | lexique)`); process.exit(0); }

const candidats = [
  process.env.FORGE_ROOT && join(process.env.FORGE_ROOT, "digit-ai-factory"),
  join(dirname(PRODUIT), "digit-ai-factory"),
  "c:\\dev\\digit-ai-factory",
  join(homedir(), ".digit-ai-forge", "digit-ai-factory"),
].filter(Boolean);
const pilot = candidats.find((c) => existsSync(join(c, "bootstrap.mjs")) && existsSync(join(c, "oracles", `hook-${nom}.mjs`)));
if (!pilot) {
  console.error(`[hooks-factory] pilot introuvable (${candidats.join(" ; ")}) — hook ${nom} SAUTÉ, règle non jouée : installer la factory (AGENTS.md phase 0) ou exporter FORGE_ROOT.`);
  process.exit(0);
}
let stdin = "";
try { stdin = readFileSync(0, "utf8"); } catch { /* pas de stdin (SessionStart) */ }
const argv = [join(pilot, "oracles", `hook-${nom}.mjs`), ...options];
if (nom === "ouverture") argv.push("--pilot", pilot);
const r = spawnSync(process.execPath, argv, { encoding: "utf8", input: stdin, cwd: PRODUIT, timeout: 230000 });
if (r.stdout) process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);
process.exit(r.status ?? 0);
