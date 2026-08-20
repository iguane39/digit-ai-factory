#!/usr/bin/env node
/**
 * hook-ouverture.mjs — hook `SessionStart` de Claude Code : la règle de fraîcheur s'EXÉCUTE
 * au lieu d'être rappelée. À l'ouverture (ou la reprise) d'une session : `bootstrap.mjs --pull`
 * (pilot, treize forges, skills — versions affichées), contrôle des README d'input\/output\,
 * puis les gates actifs sont dits à l'assistant — ce que ce hook imprime entre dans son
 * contexte.
 *
 * Pourquoi (R-44, mandat humain du 20/08 : « les mises à jour des forges ne sont toujours pas
 * appliquées ») : CLAUDE.md disait « à l'ouverture de tout run — pull + bootstrap --pull » ;
 * aucune session ne le faisait sans y être invitée. La règle a désormais un exécutant.
 *
 * Options : --sans-bootstrap · --sans-readme (sessions produit : les README du pilot ne sont
 * pas leur affaire) · --pilot <dossier> (lanceur produit : chemin du pilot résolu).
 */
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const iPilot = args.indexOf("--pilot");
const PILOT = iPilot >= 0 ? args[iPilot + 1] : join(ICI, "..");
const lignes = [];

if (!args.includes("--sans-bootstrap")) {
  const b = join(PILOT, "bootstrap.mjs");
  if (existsSync(b)) {
    const r = spawnSync(process.execPath, [b, "--pull"], { encoding: "utf8", timeout: 200000, cwd: PILOT });
    const sortie = (r.stdout || "") + (r.stderr || "");
    const utiles = sortie.split(/\r?\n/).filter((l) => /^\[(DEFAUT|avert|relance)\]|^Poste|^\s{2}digit-ai-/.test(l));
    lignes.push(`## Fraîcheur (bootstrap --pull, exit ${r.status ?? "?"})`, ...utiles.map((l) => l.trimEnd()));
    if (r.status !== 0) lignes.push("→ Poste NON prêt : appliquer les remèdes ci-dessus AVANT tout run (règle Fraîcheur, R-19).");
  } else lignes.push("## Fraîcheur : bootstrap.mjs introuvable dans le pilot — mise à jour NON jouée.");
}

if (!args.includes("--sans-readme")) {
  const g = join(PILOT, "scripts", "readme-dossiers.mjs");
  if (existsSync(g)) {
    const r = spawnSync(process.execPath, [g, "--check", "--base", PILOT], { encoding: "utf8" });
    lignes.push("", r.status === 0 ? "## README d'input\\ et output\\ : à jour." : `## README d'input\\ et output\\ : DÉFAUT — ${(r.stderr || "").trim().split("\n").slice(0, 4).join(" ")} → node scripts\\readme-dossiers.mjs puis rédiger les rôles.`);
  }
}

lignes.push("",
  "## Gates actifs dans cette session (R-44)",
  "- Tout message de fin de tour de TRAVAIL suit gabarits\\RESTITUTION.md (bloc 0 + 8 blocs ; décisions en options (a)/(b)/(c) ; actions par acteur auto_ia/manuelle_dev/manuelle_utilisateur ET ordonnées ; effort en complexité × durée). Le hook Stop le juge par oracle-synthese et REFUSE l'arrêt en cas d'échec.",
  "- Les README d'input\\ et output\\ se régénèrent après chaque écriture (hook PostToolUse) ; un rôle non rédigé est un défaut.",
  "- Quand la factory est impliquée, ses règles priment sur celles du projet (R-43).");
console.log(lignes.join("\n"));
process.exit(0);
