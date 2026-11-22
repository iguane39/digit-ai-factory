// lib-racine-parc.mjs — LA RACINE DU PARC EST CELLE QUI PORTE LE PILOT, JAMAIS LE PARENT D'UN ARBRE LIÉ (TF-2720, TF-2705, 22/11/2026).
//
// LE FAIT, le 14 et le 15/11/2026 (RP-48 et seq 328 du produit forge-digit-ai-fr). `FORGE_ROOT` valait
// `C:\dev\digit-ai-factory\.claude\worktrees`, un dossier sous lequel le pilot n'existe pas : `oracle-lot-retours.test` rendait
// 89 PASS et 6 FAIL, 95 PASS et 0 FAIL sous `FORGE_ROOT=C:\dev`, et la recette d'un produit tombait en 102 erreurs de fixture
// (`catalogue.jsonl` introuvable) avant toute modification. La valeur venait de la bannière du bootstrap : « exporter
// FORGE_ROOT=<racine> », où la racine était `dirname(<dépôt du pilot>)`. Joué depuis un arbre lié (`.claude\worktrees\<nom>`, ou
// toute copie de `git worktree add`), le parent de l'arbre n'est pas le parc. TF-2520 avait déjà refusé de PERSISTER une telle
// racine ; ce module ferme les deux autres bouts : la valeur CONSEILLÉE n'est plus fausse, et une valeur héritée sans pilot se
// REFUSE là où elle fausse un verdict (la recette agrégée, le lancement d'un agent) au lieu de rougir six cas sur cent.
//
// Ce que le module juge : une racine est VALIDE quand son dossier `digit-ai-factory` (le nom que les hooks, les relais et les
// recettes cherchent sous `FORGE_ROOT`) porte la signature du pilot (les trois fichiers qui n'existent qu'au pilot vivant). Un autre
// dossier qui porte la signature ne suffit pas : sous `.claude\worktrees`, chaque arbre lié d'agent est une copie complète du pilot,
// et la racine fautive aurait été jugée valide. Il ne juge pas la fraîcheur du dépôt trouvé, ni le choix entre deux pilots (c'est le rôle
// de `oracles\resoudre-pilot.mjs`, qui écarte les copies mises de côté) : il dit seulement qu'une racine NE PORTE PAS de pilot.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PILOT } from "../scripts/lib-parc.mjs";

/** Les fichiers que seul le pilot vivant porte, à sa racine (sous-ensemble de la signature de `resoudre-pilot.mjs`). */
export const SIGNATURE_PILOT = ["oracles/oracle-conformite-projet.mjs", "todo/oracle-todo.mjs", "REGLES-PROJET.md"];

/** Un chemin sous `.claude\worktrees` : un arbre lié d'agent, jamais la racine d'un parc (même motif que `racinePersistable`, TF-2520). */
export const SOUS_ARBRE_LIE = /[\\/]\.claude[\\/]worktrees(?:[\\/]|$)/i;

/** Un dossier porte-t-il la signature du pilot ? */
export const portePilot = (dossier, existe = existsSync) => SIGNATURE_PILOT.every((f) => existe(join(dossier, f)));

/** Le dépôt « principal » d'un arbre lié, lu dans git : le dossier qui porte le `.git` commun. `null` hors d'un dépôt ou sans git. */
export function depotPrincipal(depot) {
  const r = spawnSync("git", ["-C", depot, "rev-parse", "--path-format=absolute", "--git-common-dir"], { encoding: "utf8", timeout: 10000, windowsHide: true });
  if (r.error || r.status !== 0) return null;
  const commun = String(r.stdout || "").trim();
  return commun && basename(commun) === ".git" ? dirname(commun) : null;
}

/**
 * La racine du parc à CONSEILLER pour un dépôt de pilot (le dossier qui contient `oracles\`). Un arbre lié rend la racine de son
 * dépôt principal (lue dans git, sinon déduite du chemin `…\.claude\worktrees\<nom>`), jamais le parent de l'arbre.
 * `principal` s'injecte pour les essais (sans git).
 */
export function racineConseillee(depot, { principal = depotPrincipal } = {}) {
  const d = resolve(depot);
  const principalTrouve = principal(d);
  if (principalTrouve) return dirname(resolve(principalTrouve));
  const m = SOUS_ARBRE_LIE.exec(d);
  if (m) return dirname(d.slice(0, m.index));
  return dirname(d);
}

/**
 * Le jugement d'un `FORGE_ROOT` : { etat: "absente" | "valide" | "sans-pilot", forgeRoot, motif }.
 *   absente   : la variable n'est pas posée, les chemins se déduisent du dépôt (rien à refuser) ;
 *   valide    : un dossier direct de la racine porte la signature du pilot ;
 *   sans-pilot: la racine n'existe pas, ou aucun de ses dossiers directs ne porte le pilot — `motif` dit laquelle des deux, et si la
 *               valeur est sous `.claude\worktrees` (cause relevée le 15/11/2026).
 */
export function jugerForgeRoot(env = process.env, { existe = existsSync, lister = (d) => readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) } = {}) {
  const brut = env?.FORGE_ROOT;
  if (!brut) return { etat: "absente", forgeRoot: null, motif: "FORGE_ROOT n'est pas posée" };
  const racine = resolve(brut);
  if (!existe(racine)) return { etat: "sans-pilot", forgeRoot: racine, motif: `FORGE_ROOT=${racine} n'existe pas` };
  let noms = [];
  try { noms = lister(racine); } catch { /* racine illisible : aucun pilot trouvé */ }
  const sousArbre = SOUS_ARBRE_LIE.test(racine);
  if (!sousArbre && noms.includes(PILOT) && portePilot(join(racine, PILOT), existe)) return { etat: "valide", forgeRoot: racine, motif: `${PILOT} est sous ${racine}` };
  return {
    etat: "sans-pilot", forgeRoot: racine,
    motif: `FORGE_ROOT=${racine} ne contient pas ${PILOT} avec la signature du pilot (${SIGNATURE_PILOT.join(", ")})${sousArbre ? " — la valeur est SOUS `.claude\\worktrees` : c'est le parent d'un arbre lié d'agent, pas un parc" : ""}`,
  };
}

/** Le remède à écrire à côté d'un refus : la racine à poser, calculée pour le dépôt qui joue. */
export function remedeForgeRoot(depot, options) {
  const racine = racineConseillee(depot, options);
  return `poser FORGE_ROOT=${racine} (la racine qui contient le pilot), ou retirer la variable pour que les chemins se déduisent du dépôt`;
}

// Usage : node oracles/lib-racine-parc.mjs --juger    → dit si FORGE_ROOT (sinon rien) porte le pilot, sans afficher aucune autre variable.
// Exit : 0 valide ou absente · 3 sans pilot (remède sur la sortie d'erreur). Jamais un relevé de l'environnement (TF-2721).
if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase() && process.argv.includes("--juger")) {
  const j = jugerForgeRoot(process.env);
  if (j.etat === "sans-pilot") { console.error(`FORGE_ROOT SANS PILOT — ${j.motif}. Remède : ${remedeForgeRoot(join(dirname(fileURLToPath(import.meta.url)), ".."))}.`); process.exit(3); }
  console.log(`FORGE_ROOT ${j.etat} — ${j.motif}`);
}
