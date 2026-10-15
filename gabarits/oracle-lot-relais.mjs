#!/usr/bin/env node
/**
 * oracle-lot-relais.mjs — LE JUGE DE FORME D'UN LOT, VU DEPUIS UN PRODUIT (TF-1759, 15/10/2026).
 * Copié chez chaque produit sous `forge\retours\oracle-lot.mjs` (gabarits\HERITAGE.json, copie conforme).
 *
 * LE FAIT. Jusqu'au 15/10, le produit recevait une COPIE du module entier (`gabarits\oracle-lot-retours.mjs`,
 * plus de 500 lignes). Recopiée à chaque ouverture, elle était conforme sur le disque et divergente de
 * l'histoire du produit, qui ne l'enregistrait pas ; et une copie jouée avant sa recopie a fait refuser deux
 * lots à la porte (TF-1568, TF-1569). Ce relais ne porte AUCUNE règle : il résout le pilot et délègue à SON
 * module, comme `forge\hooks\factory.mjs` délègue aux hooks. Une règle corrigée au pilot s'applique au
 * produit sans recopie, et le relais lui-même ne change presque jamais.
 *
 * Résolution du pilot (même ordre que le lanceur des hooks) : `FORGE_ROOT\digit-ai-factory`, le voisin
 * `digit-ai-factory` du produit, `c:\dev\digit-ai-factory`, `~\.digit-ai-forge\digit-ai-factory`.
 *
 * Usage : node forge\retours\oracle-lot.mjs "<lot>.md" [--json]   ·   node forge\retours\oracle-lot.mjs --murs [<racine>]
 * Importé : `import { verifier, VERSION, documentsMurs } from "./oracle-lot.mjs"` rend les fonctions du pilot.
 * Pilot introuvable : la forme n'est PAS jugée et le relais le dit (exit 2), jamais un PASS en silence.
 */
import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PRODUIT = resolve(ICI, "..", "..");
const MODULE = join("gabarits", "oracle-lot-retours.mjs");
const candidats = [
  process.env.FORGE_ROOT && join(process.env.FORGE_ROOT, "digit-ai-factory"),
  join(dirname(PRODUIT), "digit-ai-factory"),
  "c:\\dev\\digit-ai-factory",
  join(homedir(), ".digit-ai-forge", "digit-ai-factory"),
].filter(Boolean);
export const PILOT = candidats.find((c) => existsSync(join(c, MODULE))) || null;
const SANS_PILOT = `[oracle-lot] pilot introuvable (${candidats.join(" ; ")}) — la forme du lot n'est PAS jugée : installer la factory (AGENTS.md phase 0) ou exporter FORGE_ROOT.`;

const m = PILOT ? await import(pathToFileURL(join(PILOT, MODULE)).href) : null;
const absent = () => { throw new Error(SANS_PILOT); };
export const VERSION = m ? m.VERSION : null;
export const verifier = m ? m.verifier : absent;
export const documentsMurs = m ? m.documentsMurs : absent;
export const dateDuLot = m ? m.dateDuLot : absent;
export const idsDefinis = m ? m.idsDefinis : absent;

const direct = process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (direct) {
  if (!PILOT) { console.error(SANS_PILOT); process.exit(2); }
  const r = spawnSync(process.execPath, [join(PILOT, MODULE), ...process.argv.slice(2)], { stdio: "inherit", cwd: process.cwd() });
  process.exit(r.status ?? 2);
}
