#!/usr/bin/env node
/**
 * hook-couts.mjs — hook SessionEnd et SessionStart (asynchrone) du relevé des coûts (TF-2181, GO humain « A1 » du
 * 05/11/2026, étude `output/03-etudes/Digit-AI - Étude - Suivi des temps et des couts par produit - 20261105a.md`).
 *
 * SessionEnd : la session qui se ferme est relevée par `scripts/relever-couts.mjs` — jetons, temps actif et charge —
 * et sa ligne s'écrit chez le produit (`forge/couts-<poste>.jsonl`) ou au pilot (`todo/observabilite/couts-pilot-<poste>.jsonl`).
 * SessionStart `--rattraper` : les sessions du même dossier de transcriptions dont le relevé manque ou date (fenêtre
 * fermée sans SessionEnd, poste éteint) sont relevées en tâche de fond, dans un budget de 40 s, la plus ancienne
 * d'abord ; la session qui s'ouvre est exclue.
 *
 * Mesuré le 05/11/2026 : la plus grosse transcription du poste (73,6 Mo) se relit en 0,52 s. Le hook n'ajoute rien à
 * la fin d'un tour ni à l'ouverture (asynchrone). Il ne bloque jamais : toute erreur sort sur stderr, exit 0.
 *
 * Entrée standard : le JSON du hook (`session_id`, `transcript_path`, `cwd`). Usage : node oracles\hook-couts.mjs [--rattraper]
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { racineDuProjet } from "./lib-racine-projet.mjs";
import { ecrireReleve, rattraper } from "../scripts/relever-couts.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const modeRattrapage = process.argv.includes("--rattraper");
try {
  let entree = {};
  try { entree = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch { /* entrée vide ou illisible */ }
  const racine = racineDuProjet(entree.cwd || process.cwd());
  const transcription = entree.transcript_path;
  if (!transcription) { console.error("[hook-couts] aucune transcription dans l'entrée du hook : relevé sauté"); process.exit(0); }
  if (modeRattrapage) {
    const b = rattraper(dirname(transcription), { racine, sauf: entree.session_id || null, budgetS: 40 });
    if (b.ecrites || b.hors_budget) console.error(`[hook-couts] rattrapage : ${b.ecrites} relevé(s) écrit(s), ${b.hors_budget} hors budget`);
  } else if (existsSync(transcription)) {
    const r = ecrireReleve(transcription, { racine });
    if (r.ecrit) console.error(`[hook-couts] session relevée : ${r.releve.jetons.total} jetons → ${r.sortie}`);
  }
} catch (e) {
  console.error(`[hook-couts] relevé non écrit (${e.message}) ; ${join(ICI, "..", "scripts", "relever-couts.mjs")} --rattraper le reprendra`);
}
process.exit(0);
