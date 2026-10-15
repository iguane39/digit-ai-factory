#!/usr/bin/env node
/**
 * hook-remisage.mjs — LA PILE DE REMISAGE GIT EST PARTAGÉE : un remisage nu ne s'y joue pas (TF-1754,
 * lot Produit-64 20261015b, RT-59).
 *
 * LE FAIT. Le 15/10/2026, un `git stash` nu, glissé en fin de commande composée dans un arbre de
 * travail lié (worktree), a remisé la ligne de registre préparée pour `main` (« WIP on main »). La
 * pile de remisage est UNE pour tous les arbres de travail d'un dépôt et toutes les sessions qui y
 * travaillent : un `pop` voisin aurait pu prendre ce travail, ou ce remisage se mêler à un autre.
 * Récupéré à la main (`apply <sha>`, puis `drop`). Aucun hook ne l'a arrêté, alors que le harnais
 * rappelle la consigne dès l'entrée dans l'arbre de travail : une consigne qu'aucun mécanisme
 * n'exécute décore.
 *
 * CE QUE FAIT CE HOOK. Hook `PreToolUse` sur `Bash` et `PowerShell`. Il découpe la commande en
 * segments (`&&`, `||`, `;`, `|`, saut de ligne) et REFUSE (exit 2, motif sur stderr) :
 *   · `git stash` nu, ou toute forme de remisage sans message (`git stash -u`, `git stash push` sans
 *     `-m`, `git stash save`) : un remisage sans étiquette ne se retrouve pas dans une pile partagée ;
 *   · `git stash pop` et `git stash apply` sans référence explicite : ils prennent le SOMMET de la
 *     pile, qui peut être le travail d'une autre session ;
 *   · `git stash drop` sans référence, et `git stash clear` : ils détruisent ce qui peut être à autrui.
 * Il LAISSE PASSER : `git stash push [-u] -m <étiquette>` (et `git stash -m <étiquette>`),
 * `git stash apply <sha>`, `git stash list`, `git stash show`, `git stash drop <référence>`,
 * `git stash branch|create|store`. `apply stash@{n}` est refusé : l'indice glisse quand une autre
 * session remise entre-temps ; le SHA, lui, ne bouge pas (`git stash list --format="%h %gs"`).
 *
 * NON JUGÉ (déclaré). Un remisage joué par un script dont le texte n'est pas dans la commande ; un
 * alias git ; une commande construite par variable.
 *
 * Usage : node oracles\hook-remisage.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : 0 laisse passer · 2 refuse (motif sur stderr).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const OUTILS = new Set(["Bash", "PowerShell"]);
const SHA = /^[0-9a-f]{7,40}$/i;
// Options globales de git qui prennent une valeur dans le mot suivant.
const OPTIONS_A_VALEUR = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace", "--exec-path"]);

/** Découpe un segment de commande en mots, guillemets simples et doubles compris. */
export function mots(segment) {
  const out = [];
  const re = /"((?:[^"\\]|\\.)*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(segment))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

/** Les segments d'une commande composée. */
export const segments = (commande) => String(commande || "").split(/&&|\|\||[;|\n]/);

/** Juge UN segment : rend null (rien à dire) ou le motif du refus. */
export function jugerSegment(segment) {
  const m = mots(segment);
  let i = m.findIndex((x) => /(^|[\\/])git(\.exe)?$/i.test(x));
  if (i < 0) return null;
  i++;
  while (i < m.length && m[i].startsWith("-")) { i += OPTIONS_A_VALEUR.has(m[i]) ? 2 : 1; }
  if (m[i] !== "stash") return null;
  const reste = m.slice(i + 1);
  const sous = reste[0] && !reste[0].startsWith("-") ? reste[0] : null;
  const args = sous ? reste.slice(1) : reste;
  const aMessage = args.some((a) => a === "-m" || a === "--message" || /^--message=/.test(a) || /^-m./.test(a));
  const reference = args.find((a) => !a.startsWith("-"));
  if (sous === null || sous === "push") {
    return aMessage ? null : `\`git stash${sous ? " push" : ""}${args.length ? " " + args.join(" ") : ""}\` remise SANS étiquette`;
  }
  if (sous === "save") return "`git stash save` remise sans étiquette retrouvable (forme dépréciée)";
  if (sous === "pop") return "`git stash pop` prend le SOMMET d'une pile partagée, qui peut être le travail d'une autre session";
  if (sous === "apply") {
    if (!reference) return "`git stash apply` sans référence prend le SOMMET d'une pile partagée";
    if (!SHA.test(reference)) return `\`git stash apply ${reference}\` désigne une position de pile, qui glisse quand une autre session remise`;
    return null;
  }
  if (sous === "drop") return reference ? null : "`git stash drop` sans référence détruit le SOMMET d'une pile partagée";
  if (sous === "clear") return "`git stash clear` détruit TOUTE la pile, partagée entre arbres de travail et sessions";
  return null; // list, show, branch, create, store
}

/** Juge l'entrée d'un hook PreToolUse. */
export function juger(entree) {
  if (!OUTILS.has(entree?.tool_name)) return { decision: "laisse" };
  const commande = entree?.tool_input?.command;
  if (typeof commande !== "string" || !/\bstash\b/.test(commande)) return { decision: "laisse" };
  const fautes = segments(commande).map(jugerSegment).filter(Boolean);
  if (!fautes.length) return { decision: "laisse" };
  return {
    decision: "refuse",
    motif: `REMISAGE REFUSÉ (TF-1754) — ${fautes.join(" ; ")}. La pile de remisage est UNE pour tous les arbres de travail `
      + "d'un dépôt et toutes les sessions qui y travaillent : le 15/10/2026, un `git stash` nu a remisé le travail préparé pour main. "
      + "Remède : `git stash push -u -m \"<étiquette>\"`, puis retrouver l'entrée par `git stash list --format=\"%h %gs\"` et "
      + "`git stash apply <sha>` ; mieux, un commit sur une branche de travail.",
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = {};
  try { entree = JSON.parse(brut || "{}"); } catch { /* entrée illisible : pas un appel d'outil */ }
  let v = { decision: "laisse" };
  try { v = juger(entree); } catch { /* une panne du juge ne bloque jamais un outil */ }
  if (v.decision === "refuse") { process.stderr.write(v.motif + "\n"); process.exit(2); }
  process.exit(0);
}
