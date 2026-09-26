#!/usr/bin/env node
/**
 * pre-commit-index.mjs — LES INDEX D'input\ ET D'output\ SE RÉGÉNÈRENT AU MOMENT DE L'ENREGISTREMENT
 * (TF-1325, décision humaine D-20 (a) du 26/09/2026).
 *
 * LE FAIT, mesuré le 23/09/2026 au soir sur les deux postes. Le hook PostToolUse régénère les
 * `README.md` d'index juste après l'ÉCRITURE d'un livrable — donc quand ce livrable n'est pas encore
 * suivi par git. Or `readme-dossiers.mjs` ne nomme que ce que le dépôt porte (TF-0914) : l'index
 * écrit à cet instant ignore la synthèse qu'il accompagne. L'enregistrement emporte alors un index en
 * retard d'un fichier (a3b40b45 et cb4ec57b, un par poste, le même jour), la régénération suivante
 * laisse un diff local, et le `pull --ff-only` d'ouverture de l'autre poste refuse : « Poste NON prêt ».
 *
 * LE REMÈDE CHOISI est le moment, pas le générateur : au pre-commit, l'index git porte déjà ce que
 * l'enregistrement va emporter. Si ce qui est indexé touche `input\` ou `output\`, la garde rejoue
 * `readme-dossiers.mjs` et `generer-lisezmoi-output.mjs`, puis ré-indexe les `README.md` et
 * `LISEZMOI.md` qu'ils ont réécrits : l'index enregistré nomme la synthèse qu'il accompagne, et
 * l'arbre est propre juste après l'enregistrement. Quand git joue le hook sur un index temporaire
 * (`GIT_INDEX_FILE`, commit partiel ou `-a`), les générateurs et le ré-indexage le suivent : ils
 * héritent de l'environnement.
 *
 * ELLE NE REFUSE JAMAIS. Régénérer un index n'est pas une garde de sûreté : un générateur qui échoue
 * se DIT sur la sortie d'erreur, et l'enregistrement passe. Seules les deux gardes qui la précèdent
 * refusent (le nom de client, le quantificateur du noyau). Un README dont un défaut est signalé
 * (rôle non rédigé) est quand même régénéré par son générateur : son défaut se lit à `--check`.
 *
 * NON JUGÉ : un bloc RÔLE modifié à la main et laissé hors de l'index est emporté avec son README
 * régénéré, puisque le générateur reprend le rôle du disque ; les index d'autres dossiers que
 * `input\` et `output\`.
 *
 * Usage : appelée par le hook pre-commit (copie versionnée `scripts/hooks-git/pre-commit`).
 *         node scripts/pre-commit-index.mjs [--depot <dossier>]
 * Exit : toujours 0.
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const iDepot = args.indexOf("--depot");
const DEPOT = resolve(iDepot >= 0 ? args[iDepot + 1] : join(ICI, ".."));
const RACINES = ["input", "output"];
const git = (...a) => spawnSync("git", ["-C", DEPOT, "-c", "core.quotepath=false", ...a], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const signaler = (msg) => process.stderr.write(`[pre-commit-index] ${msg}\n`);

const indexes = git("diff", "--cached", "--name-only", "-z");
if (indexes.status !== 0) { signaler("index git illisible — aucun index régénéré"); process.exit(0); }
const touches = indexes.stdout.split("\0").filter(Boolean).filter((p) => RACINES.some((r) => p === r || p.startsWith(r + "/")));
if (!touches.length) process.exit(0);

const EST_INDEX = (p) => /(^|\/)(README|LISEZMOI)\.md$/.test(p);
/** Les index que la dernière régénération a réécrits (suivis) ou créés (dans un dossier suivi). */
function aIndexer() {
  const lot = git("diff", "--name-only", "-z", "--", ...RACINES).stdout.split("\0").filter(Boolean).filter(EST_INDEX);
  // Un index NOUVEAU (dossier nouveau, ou premier LISEZMOI) n'est ré-indexé que si son dossier porte
  // déjà du contenu indexé : un dossier dont rien n'est suivi n'entre pas au dépôt par son seul
  // README — son NOM serait publié, et aucune garde ne juge un nom de dossier que la table ignore.
  for (const p of git("ls-files", "--others", "--exclude-standard", "-z", "--", ...RACINES).stdout.split("\0").filter(Boolean).filter(EST_INDEX)) {
    const dossier = p.includes("/") ? p.slice(0, p.lastIndexOf("/")) : ".";
    if (git("ls-files", "--", dossier).stdout.split(/\r?\n/).some((f) => f && f !== p)) lot.push(p);
  }
  return lot;
}

// L'ORDRE COMPTE : `output\README.md` affiche le poids de `LISEZMOI.md`, donc l'index des livrables se
// régénère et s'indexe AVANT les README. Dans l'ordre inverse, la recette l'a mesuré, le README
// enregistré porte l'ancien poids et l'arbre est sale juste après l'enregistrement.
// Les générateurs sont ceux de CE dossier, lancés depuis le dépôt jugé et sur lui : `--base` le
// déclare à `readme-dossiers.mjs`, qui refuse d'écrire dans un dépôt qu'on ne lui nomme pas (TF-1201).
const reindexes = [];
for (const [script, extra] of [["generer-lisezmoi-output.mjs", [join(DEPOT, "output")]], ["readme-dossiers.mjs", ["--base", DEPOT]]]) {
  const r = spawnSync(process.execPath, [join(ICI, script), ...extra, "--silencieux"], { cwd: DEPOT, encoding: "utf8" });
  if (r.status !== 0) signaler(`${script} a rendu ${r.status} : ${String(r.stderr || r.stdout || "").trim().split(/\r?\n/).slice(0, 3).join(" · ")}`);
  const lot = aIndexer();
  if (!lot.length) continue;
  const ajout = git("add", "--", ...lot);
  if (ajout.status !== 0) { signaler(`ré-indexage refusé : ${String(ajout.stderr).trim()}`); process.exit(0); }
  reindexes.push(...lot);
}
if (reindexes.length) signaler(`${reindexes.length} index régénéré(s) et ré-indexé(s) avec l'enregistrement : ${reindexes.join(" · ")}`);
process.exit(0);
