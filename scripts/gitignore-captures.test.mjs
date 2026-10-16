#!/usr/bin/env node
/**
 * gitignore-captures.test.mjs — les captures du contrôle des pages ne se versionnent pas (TF-1273).
 *
 * LE FAIT, mesuré le 20/09/2026. En écrivant 10 pages sous `gabarits\documents`, le contrôle des pages
 * (`render_page.py`, joué par le hook d'écriture) a déposé ses PNG sous `<famille>\.oracles\` : 193
 * fichiers, 83,5 Mo, que rien ne lisait. Le dépôt n'ignorait pas ce dossier d'atelier, et 384 captures
 * y sont suivies (environ 196 Mo sur douze familles). Le remède pour tout travail à venir est le
 * `.gitignore` du pilot ; cette recette le juge dans les deux sens, sur le VRAI fichier.
 *
 * NON JUGÉ : le sort des captures déjà suivies — les ignorer n'en retire aucune de l'histoire publiée,
 * ce qui exige une réécriture d'historique, donc un accord humain explicite avant toute republication.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PILOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

/** Dépôt jetable portant le .gitignore donné ; rend la fonction « ce chemin est-il ignoré ? ». */
function depot(gitignore) {
  const B = mkdtempSync(join(tmpdir(), "gi-captures-"));
  spawnSync("git", ["-C", B, "init", "-q", "-b", "main"], { encoding: "utf8" });
  writeFileSync(join(B, ".gitignore"), gitignore, "utf8");
  return {
    ignore: (rel) => spawnSync("git", ["-C", B, "check-ignore", "-q", "--", rel], { encoding: "utf8" }).status === 0,
    fin: () => rmSync(B, { recursive: true, force: true }),
  };
}

const reel = depot(readFileSync(join(PILOT, ".gitignore"), "utf8"));
const vide = depot("");

check("rouge → vert — une capture d'une famille NEUVE (jamais vue) est ignorée par le .gitignore du pilot", () => {
  for (const rel of [
    "gabarits/documents/une-famille-neuve/.oracles/INSTANCE-w390.png",
    "gabarits/documents/une-famille-neuve/.oracles/INSTANCE-w3840.png",
    "output/03-etudes/.oracles/page-w1280.png",
  ]) if (!reel.ignore(rel)) throw new Error(`${rel} n'est pas ignoré`);
});
check("rouge — sans la règle (dépôt au .gitignore vide), la même capture n'est PAS ignorée : le défaut d'origine", () => {
  if (vide.ignore("gabarits/documents/une-famille-neuve/.oracles/INSTANCE-w390.png")) throw new Error("la recette ne distingue pas avec et sans règle");
});
check("vert — la règle ne mord pas trop large : un PNG livrable, un gabarit et un sidecar d'oracle restent suivables", () => {
  for (const rel of [
    "output/03-etudes/schema.png",
    "gabarits/documents/une-famille-neuve/modele.png",
    "gabarits/documents/une-famille-neuve/.oracles/rapport.md",
    "gabarits/documents/une-famille-neuve/.oracles/rendu.json",
  ]) if (reel.ignore(rel)) throw new Error(`${rel} est ignoré à tort`);
});

// TF-1703 (15/10/2026) — LE GITIGNORE SOCLE D'UN PRODUIT COUVRE LES JOURNAUX DE run-oracles. Le
// 14/10, `_oracles-journal.json` et `_oracles-journal-historique.jsonl`, écrits par run-oracles à
// la racine d'un dossier jugé, sont apparus dans `git status` chez un produit. Jugé sur le VRAI
// gabarit `gabarits/gitignore-produit`, dans les deux sens.
const socle = depot(readFileSync(join(PILOT, "gabarits", "gitignore-produit"), "utf8"));
check("rouge → vert — TF-1703 : le gitignore socle ignore les journaux de run-oracles hors de forge\\", () => {
  for (const rel of ["_oracles-journal.json", "_oracles-journal-historique.jsonl", "Produit-X/_oracles-journal.json", "src/_oracles-journal-historique.jsonl"])
    if (!socle.ignore(rel)) throw new Error(`${rel} n'est pas ignoré par gabarits/gitignore-produit`);
});
check("rouge — TF-1703 : sans la règle (gitignore vide), le même journal n'est PAS ignoré", () => {
  if (vide.ignore("_oracles-journal.json")) throw new Error("la recette ne distingue pas avec et sans règle");
});
check("vert — TF-1703 : un journal rangé comme PREUVE sous forge\\ reste versionnable (C4)", () => {
  for (const rel of ["forge/etapes/p2/_oracles-journal.json", "forge/oracles/_oracles-journal-historique.jsonl"])
    if (socle.ignore(rel)) throw new Error(`${rel} est ignoré à tort`);
});
// Supabase (16/10/2026) : jeton du CLI, dossiers locaux de `supabase link` et clés dotenvx, d'après
// supabase.com/docs/reference/cli et le dépôt github.com/supabase/cli, lus le 16/10/2026.
check("rouge → vert — Supabase : le gitignore socle ignore le jeton du CLI et ses dossiers locaux", () => {
  for (const rel of [".supabase/access-token", "supabase/.temp/project-ref", "supabase/.temp/pooler-url", "supabase/.branches/_current_branch", "supabase/.env.keys"])
    if (!socle.ignore(rel)) throw new Error(`${rel} n'est pas ignoré par gabarits/gitignore-produit`);
  if (vide.ignore("supabase/.temp/project-ref")) throw new Error("la recette ne distingue pas avec et sans règle");
});
check("vert — Supabase : migrations et config.toml restent versionnables (« safe to commit »)", () => {
  for (const rel of ["supabase/config.toml", "supabase/migrations/20261016000000_init.sql", "supabase/functions/notifier/index.ts"])
    if (socle.ignore(rel)) throw new Error(`${rel} est ignoré à tort`);
});
// TF-1750 (D-5 (a) du 15/10/2026) : ce que le programme écrit en service vit sous var\, ignoré.
const heritage = JSON.parse(readFileSync(join(PILOT, "gabarits", "HERITAGE.json"), "utf8"));
check("rouge → vert — TF-1750 : le gitignore socle ignore var\\ (fichiers déposés, journaux, base locale)", () => {
  for (const rel of ["var/depots/facture.pdf", "var/journaux/app.log", "var/admin.sqlite"])
    if (!socle.ignore(rel)) throw new Error(`${rel} n'est pas ignoré par gabarits/gitignore-produit`);
  const entree = JSON.stringify(heritage).includes('"var/"');
  if (!entree) throw new Error("var/ n'est pas aux motifs exigés de gabarits/HERITAGE.json : un produit sans lui ne serait pas relevé");
});
check("vert — TF-1750 : un livrable sous output\\ reste versionnable", () => {
  for (const rel of ["output/01-rapports/Produit-X - Rapport - 20261015a.html"])
    if (socle.ignore(rel)) throw new Error(`${rel} est ignoré à tort`);
});

reel.fin();
vide.fin();
socle.fin();
console.log(`\ngitignore-captures (TF-1273, TF-1703) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
