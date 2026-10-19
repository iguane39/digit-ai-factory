#!/usr/bin/env node
/**
 * hook-flotte.mjs — UNE DÉLÉGATION VISE UN AGENT DE LA FLOTTE, OU DIT SA DÉROGATION (D-19 (a) du 18/10/2026).
 *
 * LE FAIT. Relevé du 18/10/2026 sur les transcriptions du poste, 30 jours : 191 sous-agents génériques
 * sur 201, aucun appel sur 157 ne transmettait l'effort de sa classe de tâche (règle TF-1557 du 13/10),
 * et les produits déléguaient 75 fois sur 97 sans nommer de modèle — donc au modèle et à l'effort de la
 * session. Chaque règle de la flotte dépendait de ce que la session écrivait dans la consigne au moment
 * de l'appel (étude `output/03-etudes/20261018-etude-opportunite-flotte-d-agents.md`, constats M-01 à M-09).
 * La flotte est désormais définie (`gabarits/flotte/*.yaml`, compilée en `.claude/agents/`) : chaque agent
 * y porte son modèle, son effort et ses outils. Ce hook rappelle cette flotte au moment où l'on délègue.
 *
 * CE QUE FAIT CE HOOK. Hook `PreToolUse` sur l'outil qui lance un sous-agent (`Agent`, ancien nom `Task`).
 * Il laisse passer sans rien dire :
 *   · un agent nommé du projet ou du poste (un fichier `.claude/agents/<nom>.md`) ;
 *   · un agent intégré dont le modèle est fixé par le harnais (`claude-code-guide`, `statusline-setup`) ;
 *   · un agent générique (`general-purpose`, `claude`, `Explore`, `Plan`, ou aucun type) quand l'appel déclare À LA
 *     FOIS `model` et `effort` : c'est une dérogation dite, que le relevé de flotte comptera.
 * Sinon il AVERTIT : un rappel entre dans le contexte de la session (`additionalContext`), qui nomme la
 * flotte disponible et ce qui manque à l'appel. Il ne bloque JAMAIS en v1 : la décision D-19 (a) prévoit
 * l'avertissement d'abord, le blocage seulement après la revue du 2026-11-01 sur le relevé de flotte.
 *
 * NON JUGÉ (déclaré). Le choix du BON agent pour la tâche (un `explorateur` lancé sur une construction
 * passe) ; les sous-agents lancés par un script ou une CLI (`claude -p`), qui ne passent pas par l'outil.
 *
 * Et quand l'appel vise un agent d'ÉCRITURE (`campagne`, `constructeur`, `redacteur`), il rappelle la relecture de la consigne de
 * l'essai du 18/10/2026 (D-23 (a), `references/RELECTURE-INTENTION.md`) : même sortie `additionalContext`, même exit 0.
 *
 * Usage : node oracles\hook-flotte.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : toujours 0 ; l'avertissement sort sur stdout en JSON `hookSpecificOutput.additionalContext`.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

export const OUTILS = new Set(["Agent", "Task"]);
export const GENERIQUES = new Set(["general-purpose", "claude", "Explore", "Plan", ""]);
export const INTEGRES_FIXES = new Set(["claude-code-guide", "statusline-setup"]);
/** Les agents d'ÉCRITURE de la flotte (conservé pour les appelants ; la relecture de consigne vaut pour TOUT agent, D-23 (a)). */
export const AGENTS_D_ECRITURE = new Set(["campagne", "constructeur", "redacteur"]);

/** Les agents nommés visibles depuis un dossier de projet : `.claude/agents/` du projet et du poste. */
export function agentsNommes(cwd, maison = homedir()) {
  const noms = new Set();
  for (const d of [join(cwd || ".", ".claude", "agents"), join(maison, ".claude", "agents")]) {
    try {
      if (!existsSync(d)) continue;
      for (const f of readdirSync(d)) if (f.endsWith(".md")) noms.add(f.slice(0, -3));
    } catch { /* dossier illisible : aucun agent de plus */ }
  }
  return noms;
}

/** Juge l'entrée d'un hook PreToolUse : rend { decision: "laisse" }, { decision: "avertit", message } ou { decision: "rappelle", message }. */
export function juger(entree, { maison } = {}) {
  if (!OUTILS.has(entree?.tool_name)) return { decision: "laisse" };
  const ti = entree?.tool_input || {};
  const type = typeof ti.subagent_type === "string" ? ti.subagent_type.trim() : "";
  const nommes = agentsNommes(entree?.cwd || process.cwd(), maison);
  // D-23 (a) du 18/10/2026 : CHAQUE consigne passée à un agent se relit avant le lancement — « Chaque consigne d'agent
  // et chaque fin de tour sont relues ». La première version ne visait que les agents d'écriture : la relecture de fin de
  // tour du 18/10 l'a relevé comme une restriction que la décision n'autorisait pas (RI-20261018-01). Seule exception, la
  // relecture d'intention elle-même (description « Relecture d'intention … »), sans quoi chaque relecture en appellerait une.
  // Rappel seulement — l'appel part tel quel.
  const description = typeof ti.description === "string" ? ti.description.trim() : "";
  if (/^Relecture d'intention/i.test(description)) return { decision: "laisse" };
  const rappel = (cible) => "RELECTURE D'INTENTION (essai D-23 (a) du 18/10/2026, du 2026-10-18 au 2026-11-01) — cet appel vise « " + cible + " » : "
    + "chaque consigne passée à un agent se relit AVANT le lancement. `node scripts/relecture-intention.mjs --preparer consigne --fichier <consigne.md>` "
    + "(chez un produit : le script du pilot) écrit la demande humaine du tour, citée mot pour mot, et imprime la consigne à passer à un `verificateur` "
    + "dont la description commence par « Relecture d'intention » ; un écart majeur se corrige dans la consigne ou se pose à l'humain avant l'appel. Une campagne dont les agents reçoivent le même gabarit se relit une fois, le gabarit et la liste des sujets ensemble (plusieurs --fichier), puis chaque livrable à sa réception (--preparer reception, D-40 (a) du 19/10/2026). "
    + "Rappel seulement (alerte, jamais blocage) : l'appel part tel quel. `references/RELECTURE-INTENTION.md`.";
  if (type && !GENERIQUES.has(type)) return { decision: "rappelle", message: rappel(type) };
  const aModele = typeof ti.model === "string" && ti.model.trim() !== "";
  const aEffort = typeof ti.effort === "string" && ti.effort.trim() !== "";
  if (aModele && aEffort) return { decision: "rappelle", message: rappel(type || "agent générique") };
  const manque = [!aModele && "le modèle (`model`)", !aEffort && "l'effort (`effort`)"].filter(Boolean).join(" et ");
  const flotte = [...nommes].sort();
  const cible = type || "(aucun type : agent générique)";
  const message = `FLOTTE D'AGENTS (D-19 (a) du 18/10/2026) — cet appel vise « ${cible} » sans ${manque} : `
    + "l'agent prendra ceux de la session, souvent Opus à l'effort le plus haut. "
    + (flotte.length
      ? `Agents nommés disponibles, chacun avec son modèle, son effort et ses outils : ${flotte.join(", ")} `
        + "(explorateur : lecture et comptage mécaniques ; verificateur : rejouer et dire si c'est fait ; "
        + "campagne : écrire dans UN dépôt sous le contrat AGENT-CAMPAGNE ; constructeur : construction complexe ; "
        + "redacteur : document sous gabarit). Relancer l'appel avec `subagent_type` à l'un d'eux, "
      : "Aucun agent nommé n'est visible ici (`.claude/agents/` absent) : ")
    + "ou garder l'agent générique en déclarant `model` ET `effort` — une dérogation dite, que le relevé de flotte compte "
    + "(`node scripts/relever-flotte.mjs` au pilot). Avertissement seulement : l'appel part tel quel. " + rappel(cible);
  return { decision: "avertit", message };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = {};
  try { entree = JSON.parse(brut || "{}"); } catch { /* entrée illisible : pas un appel d'outil */ }
  let v = { decision: "laisse" };
  try { v = juger(entree); } catch { /* une panne du juge ne bloque jamais un outil */ }
  if (v.decision === "avertit" || v.decision === "rappelle") {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: v.message } }) + "\n");
  }
  process.exit(0);
}
