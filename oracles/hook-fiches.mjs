#!/usr/bin/env node
/**
 * hook-fiches.mjs — À LA FIN DE CHAQUE AGENT, SA FICHE D'EXÉCUTION S'ÉCRIT, ET RIEN NE RETIENT L'AGENT
 * (décision humaine D-219 (e) du 15/11/2026, TF-2563, mandat 20261115b, lot L1).
 *
 * Hook `SubagentStop`. Il lit l'entrée du harnais (https://code.claude.com/docs/en/hooks, « SubagentStop input » : `session_id`,
 * `agent_id`, `agent_type`, `agent_transcript_path`, `last_assistant_message`, `cwd`, `stop_hook_active`), construit la fiche de l'agent
 * et l'ajoute au fichier des fiches du projet : au pilot `todo/observabilite/fiches-agents.jsonl`, chez un produit
 * `forge/fiches-agents.jsonl` (`lib-fiches-agents.mjs`, qui dit les champs, la cause de fin et ce qui n'est pas jugé).
 *
 * IL NE REFUSE JAMAIS. Une transcription absente ou illisible donne une fiche partielle ; le hook ne rend aucune décision, n'écrit rien
 * sur la sortie standard et sort toujours en 0. Une panne d'écriture se dit sur la sortie d'erreur, sans retenir la fin de l'agent.
 *
 * BUDGET : il rend la main en moins de 300 ms, mesuré par le banc voisin `oracles/hook-fiches.test.mjs` (médiane de 5 passages, sur des
 * transcriptions de la taille médiane, du 99e centile et du maximum des sous-agents du poste au 15/11/2026).
 *
 * Il se câble au `SubagentStop`, à côté de `hook-remise-agent.mjs` : au pilot dans `.claude/settings.json`
 * (`node "${CLAUDE_PROJECT_DIR}/oracles/hook-fiches.mjs"`), chez un produit par le lanceur (`forge/hooks/factory.mjs fiches`, nom à
 * déclarer dans `NOMS` de `gabarits/hooks-factory.mjs`, entrée dans `gabarits/settings-produit.json`).
 *
 * Usage : node oracles\hook-fiches.mjs      (stdin : JSON du hook SubagentStop)
 * Exit : toujours 0 (aucune décision, jamais).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { traiterFinDAgent } from "./lib-fiches-agents.mjs";

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  let entree = null;
  try { entree = JSON.parse(readFileSync(0, "utf8") || "null"); } catch { /* entrée illisible : aucun agent à ficher */ }
  try {
    const r = traiterFinDAgent(entree);
    if (r.erreur) process.stderr.write(`[fiches-agents] fiche non écrite : ${r.erreur}\n`);
  } catch { /* une panne du hook ne retient jamais la fin d'un agent */ }
  process.exit(0);
}
