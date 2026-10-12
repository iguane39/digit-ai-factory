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
 * étranger : un hook écrit ou modifié à la main se fusionne à la main, et c'est dit.
 * TF-1325 (D-20 (a), 26/09/2026) : une copie versionnée ANTÉRIEURE — un hook identique, aux fins
 * de ligne près, à une version de l'histoire de `scripts/hooks-git/pre-commit` — n'est pas un hook
 * étranger : `--installer` la remplace par la version courante. Sans cela, chaque garde ajoutée à
 * la copie versionnée exigeait une fusion à la main sur chaque poste, pour un fichier que personne
 * n'avait écrit.
 *
 * TF-1275 (12/10/2026) : H3 — quand le dépôt porte `scripts/verifier-avance-publication.mjs`, le hook
 * `pre-push` installé EXISTE et l'appelle. R-38 par. 5 écrit que « le hook pre-push du pilot le joue » ;
 * la section qui l'appelle est insérée à la main dans un fichier de `.git/hooks/` qui ne voyage pas, et
 * une repose de l'installeur de la forge des outils l'efface sans rien dire (il réécrit le fichier
 * depuis son gabarit). H3 rend ce silence audible : absence nommée, jamais réparée ici (la pose du
 * pre-push reste à l'installeur, qui doit porter la section — décision du 02/10/2026, option a).
 *
 * TF-1400 (12/10/2026) : H4 — quand le dépôt suit `scripts/rejouer-verdicts-cites.mjs`, le `pre-push`
 * installé l'appelle. Sa section (avec celle de H3) est versionnée dans
 * `scripts/hooks-git/pre-push-prolongement-local` ; `--installer` l'écrit entre les marqueurs de section
 * propre du gabarit de l'installeur de la forge des outils (TF-1402) quand cette section est VIDE, et ne
 * touche jamais une section remplie ni un pre-push sans marqueurs.
 *
 * NON JUGÉ : `core.hooksPath` pointé ailleurs (le chemin est résolu par git, pas deviné) ; ce que
 * font les gardes ; le `commit-msg`, posé par l'installeur de la forge des outils ; la POSE du
 * `pre-push` (H3 la constate, elle ne la fait pas).
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
// TF-1325 : la copie antérieure se reconnaît à son CONTENU, confronté à chaque version que l'histoire
// du dépôt a portée — jamais à une date ni à un en-tête, qu'un hook recopié à la main garderait aussi.
const sansCr = (t) => String(t).split("\r\n").join("\n");
if (INSTALLER && existsSync(cheminHook) && existsSync(SOURCE)) {
  const installe = sansCr(readFileSync(cheminHook, "utf8"));
  if (installe !== sansCr(readFileSync(SOURCE, "utf8"))) {
    const shas = git("log", "--format=%H", "--", "scripts/hooks-git/pre-commit").stdout.split(/\r?\n/).filter(Boolean);
    const connue = shas.find((sha) => {
      const v = git("show", `${sha}:scripts/hooks-git/pre-commit`);
      return v.status === 0 && sansCr(v.stdout) === installe;
    });
    if (connue) {
      writeFileSync(cheminHook, readFileSync(SOURCE, "utf8"));
      try { chmodSync(cheminHook, 0o755); } catch { /* système sans bits d'exécution : git lit le fichier */ }
      constats.push(`[MIS À JOUR] hook pre-commit : copie versionnée du commit ${connue.slice(0, 8)}, périmée, remplacée par la version courante de scripts/hooks-git/pre-commit`);
    }
  }
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

const prePush = (() => {
  const p = git("rev-parse", "--git-path", "hooks/pre-push").stdout.trim();
  return isAbsolute(p) ? p : join(DEPOT, p);
})();

// TF-1400 — H4 : le pre-push rejoue les verdicts cités au commit (scripts/rejouer-verdicts-cites.mjs).
// Sa section vit dans la copie versionnée `scripts/hooks-git/pre-push-prolongement-local`, écrite
// entre les deux marqueurs que le gabarit de l'installeur de la forge des outils réserve à la section
// propre d'un dépôt (TF-1402) : il la recopie à chaque repose. `--installer` ne l'écrit que dans une
// section VIDE ; une section déjà remplie se fusionne à la main, jamais par-dessus.
const GARDE_VERDICTS = "scripts/rejouer-verdicts-cites.mjs";
const SOURCE_PROLONGEMENT = join(DEPOT, "scripts", "hooks-git", "pre-push-prolongement-local");
const DEBUT_PROLONGEMENT = "# >>> prolongement local >>>";
const FIN_PROLONGEMENT = "# <<< prolongement local <<<";
const suitVerdicts = git("ls-files", "--", GARDE_VERDICTS).stdout.trim() === GARDE_VERDICTS;
if (INSTALLER && suitVerdicts && existsSync(prePush) && existsSync(SOURCE_PROLONGEMENT)
    && !readFileSync(prePush, "utf8").includes("rejouer-verdicts-cites.mjs")) {
  const brut = readFileSync(prePush, "utf8");
  const fin = brut.includes("\r\n") ? "\r\n" : "\n";
  const L = sansCr(brut).split("\n");
  const i = L.findIndex((l) => l.trim() === DEBUT_PROLONGEMENT);
  const j = L.findIndex((l, k) => k > i && l.trim() === FIN_PROLONGEMENT);
  if (i >= 0 && j > i && L.slice(i + 1, j).every((l) => !l.trim())) {
    const section = sansCr(readFileSync(SOURCE_PROLONGEMENT, "utf8")).replace(/\n+$/, "").split("\n");
    writeFileSync(prePush, [...L.slice(0, i + 1), ...section, ...L.slice(j)].join(fin));
    constats.push("[INSTALLÉ] section propre du pre-push posée depuis scripts/hooks-git/pre-push-prolongement-local");
  }
}

// TF-1275 — H3 : le pre-push qui joue le contrôle d'avance (R-38 par. 4-6) est posé ET l'appelle.
const GARDE_AVANCE = "scripts/verifier-avance-publication.mjs";
if (git("ls-files", "--", GARDE_AVANCE).stdout.trim() === GARDE_AVANCE) {
  if (!existsSync(prePush)) {
    ko("H3", "AUCUN hook pre-push installé alors que R-38 par. 5 dit qu'il joue " + GARDE_AVANCE
      + " : une publication part sans contrôle d'avance ni porte des noms. Remède : poser le pre-push par "
      + "l'installeur de la forge des outils (installer-hamecon-publication.mjs), puis y rétablir la section R-38 par. 4-6");
  } else if (!readFileSync(prePush, "utf8").includes("verifier-avance-publication.mjs")) {
    ko("H3", "hook pre-push installé qui n'appelle pas " + GARDE_AVANCE + " — la section R-38 par. 4-6 a été effacée "
      + "(repose de l'installeur, qui réécrit le fichier depuis son gabarit). Remède : la rétablir avant la porte des noms");
  } else ok("H3", "le hook pre-push installé appelle " + GARDE_AVANCE);
}

if (suitVerdicts) {
  const remede = "Remède : poser le pre-push par l'installeur de la forge des outils (installer-hamecon-publication.mjs "
    + "<dépôt> --seul=pre-push, gabarit à section propre TF-1402), puis `node scripts/verifier-hooks-git.mjs --installer`";
  if (!existsSync(prePush)) ko("H4", "AUCUN hook pre-push installé : un verdict cité au commit part sans être rejoué sur une copie propre. " + remede);
  else if (!readFileSync(prePush, "utf8").includes("rejouer-verdicts-cites.mjs")) {
    const L = sansCr(readFileSync(prePush, "utf8")).split("\n");
    const i = L.findIndex((l) => l.trim() === DEBUT_PROLONGEMENT);
    const j = L.findIndex((l, k) => k > i && l.trim() === FIN_PROLONGEMENT);
    ko("H4", "hook pre-push installé qui n'appelle pas " + GARDE_VERDICTS + " — "
      + (i < 0 || j < 0 ? "il n'a pas les marqueurs de section propre. " + remede
        : L.slice(i + 1, j).every((l) => !l.trim()) ? "sa section propre est vide. Remède : `node scripts/verifier-hooks-git.mjs --installer`"
          : (INSTALLER ? "hook existant CONSERVÉ (jamais écrasé) ; " : "")
            + "sa section propre est déjà remplie : y fusionner à la main scripts/hooks-git/pre-push-prolongement-local"));
  } else ok("H4", "le hook pre-push installé appelle " + GARDE_VERDICTS);
}

for (const c of constats) console.log(c);
const echec = constats.some((c) => c.startsWith("[FAIL]"));
console.log(`verdict : ${echec ? "FAIL" : "PASS"} (${gardes.length} garde(s) de pré-commit déclarée(s))`);
process.exit(echec ? 1 : 0);
