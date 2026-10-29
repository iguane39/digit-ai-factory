/**
 * lib-racine-projet.mjs — la racine du PROJET d'un hook, jamais le répertoire courant brut (TF-1943, 29/10/2026).
 *
 * Depuis TF-1903 (21/10/2026), les hooks se lancent par une commande ancrée sur `${CLAUDE_PROJECT_DIR}` et se
 * déclenchent donc après un `cd` dans un sous-dossier. L'entrée qu'ils reçoivent porte alors `cwd` = le sous-dossier :
 * un hook qui y cherche `.claude/agents/`, `references/NIVEAUX.md` ou `forge/retours/` juge la mauvaise cible et rend
 * un verdict sur elle (mesuré le 21/10 : hook-flotte lancé depuis un sous-dossier répond « Aucun agent nommé n'est
 * visible ici »). Cette fonction rend le dossier du projet, dans cet ordre :
 *   1. `CLAUDE_PROJECT_DIR`, quand la variable est posée et nomme un dossier existant (Claude Code la pose aux hooks) ;
 *   2. à défaut, le premier dossier qui porte un `.git` (dossier ou fichier d'un arbre de travail lié) en remontant
 *      depuis `cwd` ; un `.claude` ne marque pas une racine : celui du poste (`~/.claude`) en ferait remonter trop haut ;
 *   3. à défaut, `cwd` lui-même (un dossier jetable sans dépôt est son propre projet).
 * Pure : l'environnement et le disque sont les seules entrées, aucune écriture.
 */
import { existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export function racineDuProjet(cwd, env = process.env) {
  const ancre = env && env.CLAUDE_PROJECT_DIR;
  if (ancre) {
    try { if (statSync(ancre).isDirectory()) return resolve(ancre); } catch { /* variable périmée : on remonte depuis cwd */ }
  }
  const depart = resolve(cwd || process.cwd());
  for (let d = depart; ; d = dirname(d)) {
    if (existsSync(join(d, ".git"))) return d;
    if (dirname(d) === d) break;
  }
  return depart;
}
