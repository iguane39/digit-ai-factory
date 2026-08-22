#!/usr/bin/env node
/**
 * readme-dossiers.test.mjs — TF-0503 : la table des README ne porte AUCUNE date, donc un commit
 * ne la périme plus. Et la dérive de STRUCTURE reste un défaut.
 *
 * Le fait fondateur, mesuré sept fois sur sept le 22/08/2026. La table portait une colonne
 * « Dernier commit ». Régénérée par le hook AVANT le commit, elle annonçait « non versionné »
 * pour les fichiers que ce commit était justement en train de versionner ; le hook la
 * régénérait après, et l'arbre de travail ressortait SALE d'un commit qui venait de tout
 * prendre. TF-0451 (21/08) avait atténué l'effet — une dérive de date seule devenait un
 * avertissement à `--check` — mais le hook, lui, réécrivait le fichier quand même : l'effet
 * revenait par la porte de l'écriture.
 *
 * La cause est retirée par décision humaine du 22/08 : « ne fais pas de boucle sur les dates
 * des fichiers et/ou dossiers pour ne pas faire grossir inutilement les traitements ou les
 * changements ». Plus de colonne, donc plus de `git log` sur l'arbre à chaque écriture, plus de
 * balayage par dossier, et plus de tolérance à maintenir : ce qui fait DÉFAUT est la structure
 * (fichier apparu, disparu, renommé) et le rôle non rédigé.
 *
 * La recette mesure les deux sens : la table est SANS date (et sans le mot qui la remplaçait),
 * un vrai commit ne change RIEN au README (c'est le défaut d'origine, joué en dépôt réel), et
 * une dérive de structure est TOUJOURS refusée.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "readme-dossiers.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "readme-sans-dates-"));
mkdirSync(join(T, "input", "sous"), { recursive: true });
mkdirSync(join(T, "output"), { recursive: true });
writeFileSync(join(T, "input", "a.md"), "# Document A\n", "utf8");
writeFileSync(join(T, "input", "b.md"), "# Document B\n", "utf8");

const lancer = (extra = []) =>
  spawnSync(process.execPath, [OUTIL, "--base", T, "--racines", "input,output", ...extra],
    { encoding: "utf8" });
const git = (...a) => spawnSync("git", ["-C", T, ...a], { encoding: "utf8" });

// Un dépôt git RÉEL : c'est la seule façon de rejouer le défaut d'origine, qui n'apparaissait
// qu'au moment où un fichier passait de « inconnu de git » à « versionné ».
git("init", "-q", "-b", "main");
git("config", "user.email", "recette@local");
git("config", "user.name", "recette");
git("config", "commit.gpgsign", "false");

// Mise en place : générer, puis rédiger les rôles (un rôle non rédigé est un défaut à part).
lancer();
const README = join(T, "input", "README.md");
for (const chemin of [README, join(T, "input", "sous", "README.md"), join(T, "output", "README.md")]) {
  writeFileSync(chemin, readFileSync(chemin, "utf8")
    .replace(/<!-- ROLE:DEBUT -->[\s\S]*?<!-- ROLE:FIN -->/,
      "<!-- ROLE:DEBUT -->\nDossier de recette.\n<!-- ROLE:FIN -->"), "utf8");
}
// Le générateur PRÉSERVE le rôle mais réécrit sa mise en forme — sans ce second passage, le
// témoin ne serait pas ce que `--check` attend, et la recette mesurerait son échafaudage.
lancer();

check("mise en place : arbre régénéré et rôles rédigés → --check PASS", () => {
  const r = lancer(["--check"]);
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${(r.stderr || "").slice(0, 200)}`);
});

check("la table ne porte AUCUNE colonne de date — ni en-tête, ni « non versionné », ni date ISO", () => {
  const t = readFileSync(README, "utf8");
  if (/Dernier commit/.test(t)) throw new Error("l'en-tête « Dernier commit » est encore là");
  if (/non versionné/.test(t)) throw new Error("« non versionné » subsiste — la colonne a survécu");
  if (/\d{4}-\d{2}-\d{2}/.test(t)) throw new Error("une date ISO subsiste dans la table");
  const entete = t.split("\n").find((l) => l.startsWith("| Élément"));
  if (!entete) throw new Error("en-tête de table introuvable");
  const colonnes = entete.split("|").filter((c) => c.trim()).length;
  if (colonnes !== 4) throw new Error(`${colonnes} colonnes, 4 attendues (Élément, Type, Taille, Titre / nature)`);
});

check("aucun appel à `git log` : le générateur ne lit plus l'historique", () => {
  const src = readFileSync(OUTIL, "utf8");
  const appels = src.split("\n").filter((l) => !l.trim().startsWith("*") && !l.trim().startsWith("//"));
  if (appels.some((l) => /"log"/.test(l))) throw new Error("un appel `git log` subsiste dans le code exécuté");
});

// LE DÉFAUT D'ORIGINE, joué tel quel : un commit qui versionne les fichiers ne doit RIEN changer.
check("TF-0503 — un commit qui versionne les fichiers ne change PAS le README (le défaut d'origine)", () => {
  const avant = readFileSync(README, "utf8");
  git("add", "-A");
  const c = git("commit", "-q", "-m", "recette : tout versionner");
  if (c.status !== 0) throw new Error(`le commit de recette a échoué : ${(c.stderr || "").slice(0, 150)}`);
  const r = lancer();
  if (r.status !== 0) throw new Error(`régénération en échec : ${(r.stderr || "").slice(0, 200)}`);
  if (readFileSync(README, "utf8") !== avant) throw new Error("le README a changé APRÈS le commit — le cycle est encore là");
  const v = lancer(["--check"]);
  if (v.status !== 0) throw new Error(`--check refuse après le commit (exit ${v.status}) : ${(v.stderr || "").slice(0, 200)}`);
});

const temoin = readFileSync(README, "utf8");

check("dérive de STRUCTURE (une ligne de fichier retirée) → --check REFUSE, avec son motif", () => {
  writeFileSync(README, temoin.split("\n").filter((l) => !l.startsWith("| `b.md`")).join("\n"), "utf8");
  const r = lancer(["--check"]);
  if (r.status !== 1) throw new Error(`exit ${r.status} attendu 1 — la structure n'est plus jugée`);
  if (!/périmé/.test(r.stderr || "")) throw new Error("le motif du refus n'est pas dit");
});

check("un fichier AJOUTÉ au dossier reste un défaut", () => {
  writeFileSync(README, temoin, "utf8");
  writeFileSync(join(T, "input", "c.md"), "# Document C\n", "utf8");
  const r = lancer(["--check"]);
  if (r.status !== 1) throw new Error(`exit ${r.status} attendu 1`);
});

check("`--strict` a disparu sans casser l'appel : le drapeau est ignoré, le verdict est le même", () => {
  writeFileSync(README, temoin, "utf8");
  rmSync(join(T, "input", "c.md"), { force: true });
  lancer();
  const sans = lancer(["--check"]);
  const avec = lancer(["--check", "--strict"]);
  if (sans.status !== avec.status) throw new Error(`verdicts divergents : ${sans.status} vs ${avec.status}`);
  if (sans.status !== 0) throw new Error(`exit ${sans.status} attendu 0`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\nreadme-dossiers, table sans dates (TF-0503) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
