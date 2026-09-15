#!/usr/bin/env node
/**
 * verifier-hooks-git.mjs — une garde de pré-commit DÉCLARÉE par le dépôt est-elle APPELÉE par le
 * hook git installé ? (TF-1041, part pilot, 15/09/2026)
 *
 * LE FAIT, mesuré le 11/09 chez un produit : trois outils de qualité déclarés par ses manifestes,
 * zéro appel par sa chaîne, et des défauts préexistants trouvés au premier passage. Appliquée au
 * pilot lui-même le 15/09, la même confrontation trouve la même classe : ses deux gardes de
 * pré-commit (`todo/pre-commit-anonymise.mjs`, TF-0980 ; `oracles/pre-commit-quantificateurs.mjs`,
 * TF-1010) ne sont appelées que par `.git/hooks/pre-commit`, un fichier qui NE VOYAGE PAS — écrit à
 * la main sur ce poste, installé par aucun outil du pilot. L'installeur de la forge des outils pose
 * un pre-commit qui ne joue que l'anonymisation : sur un clone frais ou rebâti, la garde des
 * quantificateurs était déclarée et jamais appelée. *Un outil déclaré et non appelé est un outil
 * qui n'existe pas.*
 *
 * CE QUI EST JUGÉ :
 *   H1 · chaque garde suivie `*\/pre-commit-*.mjs` (hors recettes) est appelée par le hook installé ;
 *   H2 · la copie versionnée `scripts/hooks-git/pre-commit` appelle, elle aussi, chaque garde — sinon
 *        la remise à niveau poserait un hook déjà incomplet.
 * `--installer` pose la copie versionnée quand le hook MANQUE, et jamais par-dessus un hook
 * existant : un hook étranger ou périmé se fusionne à la main, et c'est dit.
 *
 * NON JUGÉ : `core.hooksPath` pointé ailleurs (le chemin est résolu par git, pas deviné) ; ce que
 * font les gardes ; le `pre-push` et le `commit-msg`, posés par l'installeur de la forge des outils.
 *
 * Usage : node scripts/verifier-hooks-git.mjs [--depot <dossier>] [--installer]
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable (hors dépôt git).
 */
import { existsSync, readFileSync, writeFileSync, chmodSync, mkdirSync } from "node:fs";
import { dirname, join, resolve, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const iDepot = args.indexOf("--depot");
const DEPOT = resolve(iDepot >= 0 ? args[iDepot + 1] : join(ICI, ".."));
const INSTALLER = args.includes("--installer");
const SOURCE = join(DEPOT, "scripts", "hooks-git", "pre-commit");

const git = (...a) => spawnSync("git", ["-C", DEPOT, "-c", "core.quotepath=false", ...a], { encoding: "utf8" });
const top = git("rev-parse", "--show-toplevel");
if (top.status !== 0) { console.log("[NON JUGEABLE] hors dépôt git — aucun hook à confronter"); process.exit(2); }

const gardes = git("ls-files").stdout.split(/\r?\n/)
  .filter((f) => /(^|\/)pre-commit-[^/]+\.mjs$/.test(f) && !/\.test\.mjs$/.test(f)).sort();
const cheminHook = (() => {
  const p = git("rev-parse", "--git-path", "hooks/pre-commit").stdout.trim();
  return isAbsolute(p) ? p : join(DEPOT, p);
})();

const constats = [];
const ko = (regle, msg) => constats.push(`[FAIL] ${regle} — ${msg}`);
const ok = (regle, msg) => constats.push(`[PASS] ${regle} — ${msg}`);

if (INSTALLER && !existsSync(cheminHook) && existsSync(SOURCE)) {
  mkdirSync(dirname(cheminHook), { recursive: true });
  writeFileSync(cheminHook, readFileSync(SOURCE, "utf8"));
  try { chmodSync(cheminHook, 0o755); } catch { /* système sans bits d'exécution : git lit le fichier */ }
  constats.push(`[INSTALLÉ] hook pre-commit posé depuis scripts/hooks-git/pre-commit`);
}

if (!gardes.length) ok("H1", "aucune garde de pré-commit déclarée par ce dépôt");
else if (!existsSync(cheminHook)) {
  ko("H1", `${gardes.length} garde(s) déclarée(s), AUCUN hook pre-commit installé : ${gardes.join(", ")} — `
    + "déclarées, jamais appelées. Remède : `node scripts/verifier-hooks-git.mjs --installer`");
} else {
  const texte = readFileSync(cheminHook, "utf8");
  const absentes = gardes.filter((g) => !texte.includes(g));
  if (absentes.length) {
    ko("H1", `hook pre-commit installé qui n'appelle pas ${absentes.length} garde(s) déclarée(s) : ${absentes.join(", ")} — `
      + (INSTALLER ? "hook existant CONSERVÉ (jamais écrasé) ; " : "")
      + "fusionner à la main depuis scripts/hooks-git/pre-commit");
  } else ok("H1", `les ${gardes.length} garde(s) déclarée(s) sont appelées par le hook installé`);
}

if (gardes.length) {
  if (!existsSync(SOURCE)) ko("H2", "copie versionnée scripts/hooks-git/pre-commit absente — un clone frais n'a rien à installer");
  else {
    const src = readFileSync(SOURCE, "utf8");
    const manquantes = gardes.filter((g) => !src.includes(g));
    manquantes.length
      ? ko("H2", `la copie versionnée n'appelle pas ${manquantes.join(", ")} — elle poserait un hook déjà incomplet`)
      : ok("H2", "la copie versionnée appelle chaque garde déclarée");
  }
}

for (const c of constats) console.log(c);
const echec = constats.some((c) => c.startsWith("[FAIL]"));
console.log(`verdict : ${echec ? "FAIL" : "PASS"} (${gardes.length} garde(s) de pré-commit déclarée(s))`);
process.exit(echec ? 1 : 0);
