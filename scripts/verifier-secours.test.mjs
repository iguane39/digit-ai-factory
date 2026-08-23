#!/usr/bin/env node
/**
 * verifier-secours.test.mjs — TF-0512 : une procédure de secours se relit avant d'être crue.
 *
 * Le fait fondateur, sur un geste coupant réel. Un mode de test imprimait sa commande de retour
 * arrière AVANT le geste risqué — précaution voulue — et l'a imprimée avec l'URL de l'émetteur
 * remplacée par `***` : le moteur de pipeline avait pris l'adresse du tenant pour un secret. La
 * commande était inutilisable telle quelle, et elle l'était PRÉCISÉMENT dans le seul scénario où on
 * irait la chercher : l'urgence.
 *
 * Ce que cette recette fige, et surtout ce qu'elle REFUSE de faire crier : la frontière entre
 * DÉCRIRE un masquage et EN SUBIR un. Une doctrine qui parle de `***` en prose ne doit pas échouer —
 * sans quoi la règle ferait crier la page qui l'explique, et se ferait désactiver le jour même.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-secours.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "secours-"));
const ecrire = (nom, contenu) => { const p = join(T, nom); writeFileSync(p, contenu, "utf8"); return p; };
const lancer = (...a) => {
  const r = spawnSync(process.execPath, [OUTIL, ...a], { encoding: "utf8" });
  let j = null;
  try { j = JSON.parse(r.stdout || "null"); } catch { /* sortie illisible */ }
  return { code: r.status, j };
};

check("le cas RÉEL : une URL masquée dans la commande de retour arrière → REFUS", () => {
  const p = ecrire("rollback-masque.md", [
    "# Retour arrière — service de facturation",
    "",
    "Rejouer la version N-1 :",
    "",
    "```",
    "node scripts/ops.mjs restaurer --tenant *** --version 1.4.2",
    "```",
  ].join("\n"));
  const r = lancer(p);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!r.j.findings.some((f) => f.regle === "S-1")) throw new Error("le masque n'est pas dénoncé");
  if (!/inutilisable telle quelle/.test(JSON.stringify(r.j))) throw new Error("le message ne dit pas le coût");
});

check("la même procédure, composée de valeurs non masquables → PASSE", () => {
  const p = ecrire("rollback-propre.md", [
    "# Retour arrière — service de facturation",
    "",
    "Rejouer la version N-1 :",
    "",
    "```",
    "node scripts/ops.mjs restaurer --service facturation --version 1.4.2",
    "```",
  ].join("\n"));
  const r = lancer(p);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${JSON.stringify(r.j.findings).slice(0, 200)}`);
});

check("LA FRONTIÈRE : une doctrine qui PARLE de `***` en prose ne doit pas échouer", () => {
  const p = ecrire("doctrine.md", [
    "# Pourquoi un secours ne vit pas dans un journal",
    "",
    "Le moteur avait remplacé l'adresse par *** : la commande imprimée était donc inutilisable.",
    "Tout secours imprimé dans un journal est exposé au même effet, et [REDACTED] en est une autre forme.",
  ].join("\n"));
  const r = lancer(p);
  if (r.code !== 0) throw new Error("la prose explicative est mise en défaut — la règle ferait crier la page qui l'explique");
});

check("une option SANS VALEUR est le même défaut, en plus discret → REFUS", () => {
  const p = ecrire("rollback-vide.md", [
    "```",
    "node scripts/ops.mjs restaurer --service facturation --version=",
    "```",
  ].join("\n"));
  const r = lancer(p);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!r.j.findings.some((f) => f.regle === "S-2")) throw new Error("l'option vide n'est pas dénoncée");
});

check("une ligne de commande HORS bloc est jugée aussi (un journal n'encadre rien)", () => {
  const p = ecrire("journal.txt", [
    "2026-08-22T18:04:11Z  precaution : commande de retour arriere",
    "docker compose --project-name *** down",
    "2026-08-22T18:04:12Z  geste risque",
  ].join("\n"));
  const r = lancer(p);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — un journal n'encadre pas ses commandes`);
});

check("--stdin relit une sortie de journal, le canal où on irait chercher la procédure", () => {
  const r = spawnSync(process.execPath, [OUTIL, "--stdin"], {
    encoding: "utf8", input: "kubectl rollout undo deployment/api --namespace ***\n",
  });
  if (r.status !== 1) throw new Error(`exit ${r.status} attendu 1`);
});

check("plusieurs fichiers d'un coup : le verdict est celui du lot", () => {
  const bon = ecrire("bon.md", "```\ngit checkout v1.4.2\n```\n");
  const mauvais = ecrire("mauvais.md", "```\ngit remote set-url origin ***\n```\n");
  if (lancer(bon).code !== 0) throw new Error("le bon fichier seul échoue");
  if (lancer(bon, mauvais).code !== 1) throw new Error("un lot contenant un défaut passe");
});

rmSync(T, { recursive: true, force: true });
console.log(`\nverifier-secours (TF-0512) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
