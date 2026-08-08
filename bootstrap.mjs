#!/usr/bin/env node
// bootstrap.mjs — amorce un poste pour l'écosystème forge Digit-AI.
// Clone (ou vérifie) les cinq forges à côté de ce dépôt steering, puis contrôle
// que leurs points d'entrée attendus par le CONTRAT-INTERFACE existent.
//
// Usage :  node bootstrap.mjs [--racine <dossier>] [--pull]
//   --racine  racine d'installation (défaut : $FORGE_ROOT, sinon le parent de ce dépôt)
//   --pull    met à jour (git pull --ff-only) les forges déjà présentes
//
// Prérequis bloquants : git, gh authentifié (dépôts privés github.com/iguane39).
// Contrat de sortie : rapport sur stdout, exit 0 = poste prêt, 1 = au moins un défaut.

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const COMPTE = "iguane39";
const FORGES = [
  { nom: "digit-ai-forge-conception", preuve: "oracles/self-test.mjs" },
  { nom: "digit-ai-forge-design", preuve: "oracles/run-oracles-design.mjs" },
  { nom: "digit-ai-forge-development", preuve: "digit-ai-forge-development/pyproject.toml" },
  { nom: "digit-ai-forge-tests", preuve: "forge_tests/__main__.py" },
  { nom: "digit-ai-forge-agents", preuve: ".claude/skills/forge-agents/SKILL.md" },
  { nom: "digit-ai-forge-seo", preuve: "scripts/validate.py" },
  { nom: "digit-ai-forge-organization", preuve: "output/composant-filtres-tableau/oracle-filtres-tableau.mjs" },
];

const args = process.argv.slice(2);
const pull = args.includes("--pull");
const iRacine = args.indexOf("--racine");
const racine = resolve(
  iRacine >= 0 ? args[iRacine + 1] : process.env.FORGE_ROOT || dirname(ICI)
);

const run = (cmd, argv, cwd) =>
  spawnSync(cmd, argv, { cwd, encoding: "utf-8", shell: process.platform === "win32" });

const defauts = [];
const ligne = (statut, msg) => console.log(`[${statut}] ${msg}`);

console.log(`Amorçage forge — racine : ${racine}\n`);

// 1. Prérequis
for (const [cmd, argv, bloquant] of [
  ["git", ["--version"], true],
  ["gh", ["auth", "status"], true],
  ["uv", ["--version"], false],
  ["python", ["--version"], false],
]) {
  const r = run(cmd, argv);
  const ok = r.status === 0;
  ligne(ok ? "ok" : bloquant ? "DEFAUT" : "avert", `${cmd} ${ok ? "disponible" : "indisponible"}`);
  if (!ok && bloquant) defauts.push(`prérequis bloquant absent : ${cmd}`);
  if (!ok && !bloquant)
    console.log(`        (requis plus tard : uv/python pour l'étape tests — pas pour cloner)`);
}
if (defauts.length) {
  console.log(`\nPoste NON prêt — ${defauts.length} défaut(s).`);
  process.exit(1);
}

// 2. Clonage / vérification des cinq forges
console.log("");
for (const f of FORGES) {
  const dest = join(racine, f.nom);
  if (existsSync(join(dest, ".git"))) {
    if (pull) {
      const r = run("git", ["pull", "--ff-only"], dest);
      if (r.status === 0) ligne("ok", `${f.nom} — présent, mis à jour`);
      else {
        ligne("DEFAUT", `${f.nom} — pull impossible : ${(r.stderr || "").trim().slice(0, 120)}`);
        defauts.push(`${f.nom} : pull en échec`);
      }
    } else ligne("ok", `${f.nom} — déjà présent (utiliser --pull pour mettre à jour)`);
  } else if (existsSync(dest)) {
    ligne("DEFAUT", `${f.nom} — le dossier existe SANS dépôt git : à résoudre à la main`);
    defauts.push(`${f.nom} : dossier non-git existant`);
  } else {
    // core.longpaths : les forges portent des noms de fichiers longs (convention
    // "Digit-AI - ... - AAAAMMJJx.md") qui dépassent MAX_PATH sous Windows dès que
    // la racine est un peu profonde. Constaté au premier test de ce script.
    const r = run("gh", ["repo", "clone", `${COMPTE}/${f.nom}`, dest, "--", "-c", "core.longpaths=true"]);
    if (r.status === 0) ligne("ok", `${f.nom} — cloné`);
    else {
      ligne("DEFAUT", `${f.nom} — clone en échec : ${(r.stderr || "").trim().slice(0, 120)}`);
      defauts.push(`${f.nom} : clone en échec`);
    }
  }
}

// 3. Preuves de points d'entrée (contrat d'interface)
console.log("");
for (const f of FORGES) {
  const p = join(racine, f.nom, f.preuve);
  if (existsSync(p)) ligne("ok", `preuve ${f.nom} : ${f.preuve}`);
  else {
    ligne("DEFAUT", `preuve absente : ${f.nom}/${f.preuve}`);
    defauts.push(`${f.nom} : point d'entrée ${f.preuve} introuvable`);
  }
}

console.log(
  defauts.length
    ? `\nPoste NON prêt — ${defauts.length} défaut(s) : ${defauts.join(" ; ")}`
    : `\nPoste prêt. Si la racine n'est pas le parent du steering, exporter FORGE_ROOT=${racine} avant d'ouvrir la session.`
);
process.exit(defauts.length ? 1 : 0);
