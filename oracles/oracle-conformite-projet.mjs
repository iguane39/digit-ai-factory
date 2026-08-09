#!/usr/bin/env node
/**
 * oracle-conformite-projet.mjs — vérifie qu'un projet produit respecte REGLES-PROJET.md
 * (17 règles décidées le 2026-08-06). Node pur, zéro dépendance, lecture seule.
 *
 * Usage : node oracle-conformite-projet.mjs <racine-du-projet>
 * Sortie : JSON sur stdout — { oracle, version, cible, verdict, findings[], non_juge[] }
 *          finding = { regle: "R-<n>", statut: PASS|FAIL|SANS_OBJET, ou, message }
 * Exit : 0 = PASS · 1 = FAIL · 2 = l'oracle n'a pas pu juger.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, basename, relative } from "node:path";
import { spawnSync } from "node:child_process";

const cible = process.argv[2];
if (!cible || !existsSync(cible)) {
  console.log(JSON.stringify({ oracle: "oracle-conformite-projet", verdict: "ERREUR", message: "racine de projet introuvable" }));
  process.exit(2);
}

const findings = [];
const ok = (regle, ou, message) => findings.push({ regle, statut: "PASS", ou, message });
const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
const so = (regle, message) => findings.push({ regle, statut: "SANS_OBJET", ou: "-", message });

const p = (...seg) => join(cible, ...seg);
const git = (...args) => spawnSync("git", ["-C", cible, ...args], { encoding: "utf8" });
const aGit = existsSync(p(".git"));

const MOTIF_DATE = / - \d{8}[a-z]?\.[\w.]+$/;
const EXT_CODE = new Set(["py", "js", "mjs", "cjs", "ts", "tsx", "jsx", "go", "rs", "java", "rb", "php", "cs"]);
const EXT_LIVRABLE = new Set(["md", "pdf", "html", "pptx", "docx", "xlsx", "zip", "png", "svg"]);
const EXCLUS_NOMMAGE = new Set(["README.md", "CLAUDE.md", "index.md"]);
const IGNORES_PARCOURS = new Set([".git", ".venv", "node_modules", "__pycache__", "generated", "dist", ".claude"]);

function* fichiers(dossier, prof = 0) {
  if (prof > 6 || !existsSync(dossier)) return;
  for (const e of readdirSync(dossier)) {
    if (IGNORES_PARCOURS.has(e)) continue;
    const chemin = join(dossier, e);
    const st = statSync(chemin);
    if (st.isDirectory()) yield* fichiers(chemin, prof + 1);
    else yield chemin;
  }
}
const rel = (f) => relative(cible, f).replaceAll("\\", "/");

// R-1..R-3 — structure
for (const [n, d] of [["R-1", "input"], ["R-2", "output"], ["R-3", "docs"]])
  existsSync(p(d)) ? ok(n, d + "/", "présent") : ko(n, d + "/", `dossier ${d}\\ absent de la racine`);

// R-18 — canal de retours forges (mandat du 06/08 : chaque projet prépare ses lots de retours)
existsSync(p("forge", "retours"))
  ? ok("R-18", "forge/retours/", "canal de retours présent")
  : ko("R-18", "forge/retours/", "dossier forge\\retours\\ absent — les retours vers les forges n'ont pas de canal");

// R-4 — nommage daté des livrables (output/ et docs/ ; input/ non jugé : entrants humains)
let r4 = true;
for (const d of ["output", "docs"]) {
  for (const f of fichiers(p(d))) {
    const nom = basename(f);
    const ext = nom.split(".").pop().toLowerCase();
    if (EXCLUS_NOMMAGE.has(nom) || !EXT_LIVRABLE.has(ext) || /\/Old\//i.test("/" + rel(f))) continue;
    if (!MOTIF_DATE.test(nom)) { ko("R-4", rel(f), "livrable sans nommage « <Marque> - <Objet> - AAAAMMJJ<indice> »"); r4 = false; }
  }
}
if (r4) ok("R-4", "output/, docs/", "livrables au nommage daté (ou aucun livrable)");

// R-6 — code : jamais de copie datée, jamais dans Old\
let r6 = true;
for (const f of fichiers(cible)) {
  const nom = basename(f);
  const ext = nom.split(".").pop().toLowerCase();
  if (!EXT_CODE.has(ext)) continue;
  if (MOTIF_DATE.test(nom)) { ko("R-6", rel(f), "fichier de code avec nommage daté — git est le magasin de versions du code"); r6 = false; }
  if (/(^|\/)[Oo]ld\//.test("/" + rel(f))) { ko("R-6", rel(f), "fichier de code dans un dossier Old\\ — interdit (C1)"); r6 = false; }
}
if (r6) ok("R-6", "*", "aucune copie datée de code, aucun code sous Old\\");

// R-7 — Old\ jamais versionné (C1)
const gitignore = existsSync(p(".gitignore")) ? readFileSync(p(".gitignore"), "utf8") : "";
const oldExiste = [...fichiers(cible)].some((f) => /(^|\/)[Oo]ld\//.test("/" + rel(f)));
if (!oldExiste) so("R-7", "aucun dossier Old\\ dans le projet");
else if (/^[Oo]ld\/$/m.test(gitignore) || /(^|\n)\*{0,2}\/?[Oo]ld\/(\n|$)/.test(gitignore)) ok("R-7", ".gitignore", "Old\\ présent et ignoré par git (C1)");
else ko("R-7", ".gitignore", "des dossiers Old\\ existent mais ne sont pas ignorés par git (décision C1 : Old pas dans git)");

// R-8 — git initialisé (C2)
aGit ? ok("R-8", ".git/", "dépôt git présent") : ko("R-8", ".git/", "pas de dépôt git — git init + commit initial exigés dès l'ouverture du run (C2)");

// R-9 — Conventional Commits (20 derniers, hors merge)
if (!aGit) so("R-9", "pas de git");
else {
  const log = git("log", "-20", "--format=%s");
  if (log.status !== 0 || !log.stdout.trim()) so("R-9", "aucun commit à juger");
  else {
    const mauvais = log.stdout.trim().split("\n").filter((s) => !/^Merge/.test(s) && !/^(feat|fix|docs|chore|refactor|test|perf|build|ci|style|revert)(\(.+\))?!?:/.test(s));
    mauvais.length ? ko("R-9", "git log", `${mauvais.length} commit(s) hors Conventional Commits, ex. « ${mauvais[0].slice(0, 60)} »`) : ok("R-9", "git log", "20 derniers commits conformes");
  }
}

// R-10 — .gitignore socle
if (!gitignore) ko("R-10", ".gitignore", "absent");
else if (!/^\.env$/m.test(gitignore)) ko("R-10", ".gitignore", "n'ignore pas .env");
else ok("R-10", ".gitignore", "présent, .env ignoré");

// R-11 — CLAUDE.md présent ET porteur de la table de routage forge (étendu le 06/08 :
// sans elle, les sessions ad hoc contournent les forges — constaté sur le correctif v0.2.0)
if (!existsSync(p("CLAUDE.md"))) ko("R-11", "CLAUDE.md", "absent — chaque produit naît avec son CLAUDE.md (gabarit pilot)");
else {
  const claude = readFileSync(p("CLAUDE.md"), "utf8");
  const manques = [];
  if (!/##\s*Routage forge/i.test(claude)) manques.push("section « Routage forge »");
  if (!/forge_tests/.test(claude)) manques.push("route tests (forge_tests)");
  if (!/run de version/i.test(claude)) manques.push("route évolution (run de version)");
  if (!/MEP/.test(claude)) manques.push("route déploiement (MEP)");
  manques.length
    ? ko("R-11", "CLAUDE.md", `présent mais sans routage forge complet — manque : ${manques.join(", ")}`)
    : ok("R-11", "CLAUDE.md", "présent, table de routage forge complète");
}
existsSync(p("README.md")) ? ok("R-12", "README.md", "présent") : ko("R-12", "README.md", "absent");

// R-13 — .env.example exhaustif (présence + ≥ 1 variable)
const envEx = [".env.example", ".env.exemple"].map((n) => p(n)).find((f) => existsSync(f));
if (!envEx) ko("R-13", ".env.example", "absent — toutes les variables attendues (applicatives + infra) doivent y être déclarées");
else if (!/^[A-Z][A-Z0-9_]*=/m.test(readFileSync(envEx, "utf8"))) ko("R-13", basename(envEx), "présent mais aucune variable déclarée");
else ok("R-13", basename(envEx), "présent avec variables déclarées");

// R-14 — .env jamais versionné
if (!aGit) so("R-14", "pas de git");
else {
  const suivi = git("ls-files", ".env");
  suivi.stdout.trim() ? ko("R-14", ".env", "VERSIONNÉ dans git — interdit, à retirer de l'index") : ok("R-14", ".env", "non versionné");
}

// R-16 — dossier de MEP copié dans output\ au nommage daté
if (!existsSync(p("forge", "DOSSIER-MEP.md"))) so("R-16", "pas de DOSSIER-MEP.md (étape MEP non atteinte)");
else {
  const copie = existsSync(p("output")) && readdirSync(p("output")).some((n) => /MEP/i.test(n) && MOTIF_DATE.test(n));
  copie ? ok("R-16", "output/", "dossier de MEP copié au nommage daté") : ko("R-16", "output/", "DOSSIER-MEP.md existe mais aucune copie datée dans output\\");
}

// R-17 — journaux d'oracles versionnés dans forge\ (C4)
const journaux = [...fichiers(p("forge"))].filter((f) => /\.oracles.*\.json/.test(basename(f)));
if (!journaux.length) so("R-17", "aucun journal d'oracle sous forge\\");
else if (!aGit) so("R-17", "pas de git");
else {
  const ignore = git("check-ignore", rel(journaux[0]));
  ignore.stdout.trim() ? ko("R-17", rel(journaux[0]), "journaux d'oracles ignorés par git — décision C4 : versionnés (preuves)") : ok("R-17", "forge/", `${journaux.length} journal(aux) d'oracles versionnables`);
}

const nonJuge = [
  "R-5 (pas d'écrasement de version) : invisible statiquement — jugé par revue de diff",
  "R-15 (marqueurs « à fournir » exhaustifs) : l'oracle ne sait pas quelles variables sont tierces",
  "input\\ non jugé en nommage : les entrants humains arrivent tels quels",
  "seule la PRÉSENCE de CLAUDE.md/README est jugée, pas la pertinence de leur contenu",
];

const echecs = findings.filter((f) => f.statut === "FAIL").length;
console.log(JSON.stringify({
  oracle: "oracle-conformite-projet", version: "1.0.0", cible: String(cible),
  verdict: echecs ? "FAIL" : "PASS", findings, non_juge: nonJuge,
}, null, 1));
process.exit(echecs ? 1 : 0);
