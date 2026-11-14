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
 * Et quand l'appel demande `isolation: "worktree"` depuis une racine de session dont la lettre de lecteur est en minuscule
 * (`c:\…`), il avertit que le harnais refusera l'isolation et nomme la racine canonique (TF-2443, voir `racineEnMinuscule`).
 * NON JUGÉ de ce volet : une isolation posée par la définition d'un agent (`isolation: worktree` en tête de son `.md`), que
 * l'entrée du hook ne porte pas.
 *
 * Et quand l'appel demande `isolation: "worktree"`, il REFUSE (exit 2) si le dossier courant n'est pas dans le dépôt du produit de la session, ou si la
 * consigne ne nomme pas le dépôt de la copie de travail (TF-2426, voir `jugerIsolation`).
 *
 * Usage : node oracles\hook-flotte.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : 0 ; l'avertissement sort sur stdout en JSON `hookSpecificOutput.additionalContext`. 2 pour un refus d'isolation (TF-2426), motif sur stderr.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { racineDuProjet } from "./lib-racine-projet.mjs";

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

/**
 * TF-2443 (12/11/2026) — UNE RACINE DE SESSION À LETTRE DE LECTEUR MINUSCULE FAIT REFUSER L'ISOLATION.
 * Le fait, rejoué le 12/11/2026 avec Claude Code 2.1.322 depuis une racine `c:\…` puis `C:\…` : avec `isolation: "worktree"`,
 * la racine en minuscule rend « Refusing to use c:\…\.claude\worktrees\agent-… as an isolation worktree: git resolves its
 * working tree to C:/… » et laisse une copie vide verrouillée ; la même racine en majuscule réussit. Git résout toujours
 * `C:/…`, et le harnais compare les deux chemins à la casse près. Ce refus ne vit dans aucun hook ni outil du parc : il est
 * dans le harnais. Le remède est d'ouvrir la session sur la racine canonique ; ce rappel le dit AVANT le refus.
 */
export const LECTEUR_MINUSCULE = /^[a-z]:[\\/]/;
export function racineEnMinuscule(entree, env = process.env) {
  const ti = entree?.tool_input || {};
  if (typeof ti.isolation !== "string" || ti.isolation.trim() !== "worktree") return null;
  return [entree?.cwd, env?.CLAUDE_PROJECT_DIR].find((c) => typeof c === "string" && LECTEUR_MINUSCULE.test(c)) ?? null;
}
const messageRacine = (racine) => "RACINE DE SESSION EN MINUSCULE (TF-2443, 12/11/2026) — cet appel demande `isolation: \"worktree\"` depuis « " + racine
  + " » : git résout « " + racine[0].toUpperCase() + racine.slice(1) + " », le harnais compare les deux chemins à la casse près et refuse l'isolation "
  + "(« Refusing to use … as an isolation worktree: git resolves its working tree to C:/… »), en laissant une copie vide verrouillée sous `.claude/worktrees`. "
  + "Rouvrir la session sur « " + racine[0].toUpperCase() + racine.slice(1) + " » (lettre de lecteur en majuscule), ou lancer l'agent sans `isolation` sur un arbre "
  + "créé par `git worktree add` (consigne de campagne). Avertissement seulement : l'appel part tel quel.";

/**
 * TF-2426 (14/11/2026, décision R-58 du 10/11/2026) — L'ISOLATION SUIT LE DOSSIER COURANT DE LA SESSION, PAS LE PRODUIT QUE LA CONSIGNE NOMME.
 * Le fait (RP-62 de Produit-86, ledger seq 882) : un agent `constructeur` lancé avec `isolation: "worktree"` a reçu une copie de travail du dépôt de
 * Produit-84 au lieu de Produit-86, parce que la session venait d'y lire des migrations (son dossier courant y était resté). L'agent s'est arrêté sans rien
 * écrire ; sa relance a coûté environ 5 minutes. Le harnais crée la copie dans le dépôt du dossier courant, et rien dans l'appel ne le disait.
 * LA RÈGLE, en deux refus (PreToolUse, exit 2) : 1) le dépôt du dossier courant (`cwd` de l'entrée) est celui du PRODUIT de la session (`CLAUDE_PROJECT_DIR`) —
 * même dépôt, un arbre lié du même dépôt compris, jugé à son répertoire git commun ; 2) la consigne NOMME le dépôt de la copie de travail (son dossier, ou le
 * chemin du dépôt) : sans cette ligne, l'agent ne peut pas voir qu'il travaille ailleurs que chez le produit nommé.
 * NON JUGÉ, dit : un dossier courant qui n'est pas un dépôt git (le harnais refusera lui-même), une session sans `CLAUDE_PROJECT_DIR` (le refus 1 n'a rien à
 * comparer, le refus 2 reste joué), et une isolation posée par la définition d'un agent (`isolation: worktree` en tête de son `.md`), que l'entrée n'a pas.
 */
const norme = (p) => String(p || "").replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
export function depotDe(dossier) {
  if (typeof dossier !== "string" || !dossier || !existsSync(dossier)) return null;
  const r = spawnSync("git", ["-C", dossier, "rev-parse", "--path-format=absolute", "--show-toplevel", "--git-common-dir"], { encoding: "utf8", timeout: 10000 });
  if (r.status !== 0) return null;
  const [racine, commun] = String(r.stdout).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return racine && commun ? { racine, commun, nom: basename(dirname(commun)), dossier: basename(racine) } : null;
}
export function jugerIsolation(entree, env = process.env) {
  const ti = entree?.tool_input || {};
  if (!OUTILS.has(entree?.tool_name) || typeof ti.isolation !== "string" || ti.isolation.trim() !== "worktree") return null;
  const courant = depotDe(entree?.cwd);
  if (!courant) return null;
  const session = env?.CLAUDE_PROJECT_DIR ? depotDe(env.CLAUDE_PROJECT_DIR) : null;
  if (session && norme(session.commun) !== norme(courant.commun))
    return "ISOLATION REFUSÉE (TF-2426, 14/11/2026) — cet appel demande `isolation: \"worktree\"` : le harnais crée la copie de travail du dépôt du DOSSIER COURANT de la session (« "
      + courant.racine + " »), qui n'est pas le dépôt du produit de la session (« " + session.racine + " »). Le 10/11/2026, un agent isolé a reçu la copie d'un autre produit que celui que "
      + "sa consigne nommait, parce que la session venait d'y lire des migrations ; il s'est arrêté sans rien écrire et sa relance a coûté environ 5 minutes. "
      + "Remède : revenir au dépôt du produit (`cd " + session.racine + "`) avant l'appel, ou lancer l'agent sans `isolation` sur un arbre créé par `git worktree add` (consigne de campagne).";
  const texte = norme(`${ti.prompt || ""}\n${ti.description || ""}`);
  const noms = [courant.nom, courant.dossier, courant.racine].filter(Boolean).map(norme);
  if (!noms.some((n) => texte.includes(n)))
    return "ISOLATION REFUSÉE (TF-2426, 14/11/2026) — l'appel d'un agent isolé doit NOMMER le dépôt de sa copie de travail : le harnais la crée dans le dépôt du dossier courant (« "
      + courant.nom + " », " + courant.racine + "), et ni la consigne ni la description ne le disent. Remède : ajouter à la consigne la ligne « Dépôt de la copie de travail : "
      + courant.nom + " », ou le chemin du dépôt ; l'agent voit ainsi qu'il travaille ailleurs que chez le produit nommé.";
  return null;
}

/** Juge l'entrée d'un hook PreToolUse : rend { decision: "laisse" }, { decision: "avertit", message }, { decision: "rappelle", message } ou { decision: "refuse", message } (TF-2426). */
export function juger(entree, options = {}) {
  const refus = jugerIsolation(entree, options.env);
  if (refus) return { decision: "refuse", message: refus };
  const v = jugerFlotte(entree, options);
  const racine = OUTILS.has(entree?.tool_name) ? racineEnMinuscule(entree) : null;
  if (!racine) return v;
  return { decision: "avertit", message: messageRacine(racine) + (v.message ? "\n\n" + v.message : "") };
}

function jugerFlotte(entree, { maison } = {}) {
  if (!OUTILS.has(entree?.tool_name)) return { decision: "laisse" };
  const ti = entree?.tool_input || {};
  const type = typeof ti.subagent_type === "string" ? ti.subagent_type.trim() : "";
  // TF-1943 : les agents du PROJET, pas ceux du sous-dossier où la session s'est déplacée (`cwd` de l'entrée après un `cd`).
  const nommes = agentsNommes(racineDuProjet(entree?.cwd), maison);
  // D-23 (a) du 18/10/2026 : CHAQUE consigne passée à un agent se relit avant le lancement — « Chaque consigne d'agent
  // et chaque fin de tour sont relues ». La première version ne visait que les agents d'écriture : la relecture de fin de
  // tour du 18/10 l'a relevé comme une restriction que la décision n'autorisait pas (RI-20261018-01). Seule exception, la
  // relecture d'intention elle-même (description « Relecture d'intention … »), sans quoi chaque relecture en appellerait une.
  // Rappel seulement — l'appel part tel quel.
  const description = typeof ti.description === "string" ? ti.description.trim() : "";
  if (/^Relecture d'intention/i.test(description)) return { decision: "laisse" };
  // L'essai a couru du 2026-10-18 au 2026-11-01, puis a été prolongé en service par D-73 (b) du 26/10/2026
  // (references/RELECTURE-INTENTION.md) : le rappel ne le présente plus comme un essai en cours (œil critique du 10/11/2026).
  // Œil critique du 10/11/2026 (A4) : le rappel tenait 894 caractères et se recopiait à chaque appel d'agent, 8 fois
  // dans un même tour ; il garde la commande et la règle de campagne, le détail vit dans la référence.
  const rappel = (cible) => "RELECTURE D'INTENTION (essai D-23 (a) du 18/10/2026, en service depuis le 2026-11-01 par D-73 (b)) — cet appel vise « " + cible + " » : "
    + "relire la consigne avant le lancement, `node scripts/relecture-intention.mjs --preparer consigne --fichier <consigne.md>` (chez un produit, le script du pilot), "
    + "puis la passer à un `verificateur` « Relecture d'intention » ; une campagne relit une fois son gabarit commun (D-47 (a)). "
    + "Alerte, jamais blocage : l'appel part tel quel. `references/RELECTURE-INTENTION.md`.";
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
  if (v.decision === "refuse") { process.stderr.write(v.message + "\n"); process.exit(2); }
  if (v.decision === "avertit" || v.decision === "rappelle") {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: v.message } }) + "\n");
  }
  process.exit(0);
}
