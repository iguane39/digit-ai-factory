#!/usr/bin/env node
/**
 * generer-acces-local.test.mjs — recette du geste `generer-acces-local.mjs` (TF-2605, 16/11/2026).
 *
 * Double sens : la fiche locale se génère avec ses valeurs, ignorée et jamais indexée ; chaque refus (fiche non ignorée, suivie,
 * produit hors git, cible = pilot, fiche versionnée absente) échoue AVANT d'écrire, sans citer une valeur, et son remède joué passe.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(ICI, "generer-acces-local.mjs");
const GABARIT_GITIGNORE = join(ICI, "..", "gabarits", "gitignore-produit");
const MOTIF = "docs/projet/ACCES-TEST.local.md";
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (cond, message) => { if (!cond) throw new Error(message); };

// Valeurs d'essai : jamais un vrai secret, et assez singulières pour se chercher dans une sortie.
const V = { id: "compte-essai-quinze@exemple.test", mdp: "mdp-d-essai-7d4f0c19", cle: "cle-d-essai-9a2b6e55" };
const FICHE = [
  "---", "role: profils d'accès", "verifie_le: 2026-11-16", "---", "# Accès de test — Produit-X", "",
  "> comptes de démonstration locale — jamais valides hors MODE_DEMO", "",
  "Le seed lit `MODE_DEMO` ; la valeur de cette variable n'est pas un secret.", "",
  "## Comptes de démo (locale uniquement)", "",
  "| Profil | Identifiant | Mot de passe |", "|---|---|---|",
  "| admin | `DEMO_ADMIN_IDENTIFIANT` | `DEMO_ADMIN_MOTDEPASSE` |", "",
  "## Environnements déployés — comptes de test", "",
  "| Environnement | Adresse | Identifiant | Mot de passe ou clé | Mis à jour le |", "|---|---|---|---|---|",
  "| staging | https://x-staging.exemple.test | `STAGING_ADMIN_IDENTIFIANT` | `STAGING_ADMIN_MOTDEPASSE` | 2026-11-16 |",
  "| production | {URL_PROD} | `PROD_ADMIN_IDENTIFIANT` | `PROD_CLE_API` | 2026-11-16 |", "",
].join("\n");
const ENV = [`DEMO_ADMIN_IDENTIFIANT=${V.id}`, `DEMO_ADMIN_MOTDEPASSE="${V.mdp}"`, "STAGING_ADMIN_IDENTIFIANT=staging-admin@exemple.test",
  `STAGING_ADMIN_MOTDEPASSE=${V.mdp}-staging`, `PROD_CLE_API=${V.cle}`, "MODE_DEMO=1", ""].join("\n");
// PROD_ADMIN_IDENTIFIANT est volontairement absent : la fiche doit dire ce qui manque, sans échouer.

const git = (d, ...a) => spawnSync("git", ["-C", d, ...a], { encoding: "utf8" });
function produit({ gitignore = `${MOTIF}\n`, fiche = FICHE, env = ENV, depot = true } = {}) {
  const d = mkdtempSync(join(tmpdir(), "acces-local-"));
  mkdirSync(join(d, "forge"), { recursive: true });
  mkdirSync(join(d, "docs", "projet"), { recursive: true });
  if (fiche !== null) writeFileSync(join(d, "docs", "projet", "ACCES-TEST.md"), fiche, "utf8");
  if (gitignore !== null) writeFileSync(join(d, ".gitignore"), gitignore, "utf8");
  if (env !== null) writeFileSync(join(d, ".env"), env, "utf8");
  if (depot) { git(d, "init", "-q", "-b", "main"); git(d, "config", "user.email", "t@exemple.test"); git(d, "config", "user.name", "t"); }
  return d;
}
const lancer = (d, ...extra) => {
  const r = spawnSync("node", [SCRIPT, "--produit", d, ...extra], { encoding: "utf8" });
  let json = null; try { json = JSON.parse(r.stdout.trim().split("\n").pop()); } catch { /* sortie non JSON */ }
  return { code: r.status, out: r.stdout + r.stderr, json };
};
const sansValeur = (out) => Object.values(V).every((v) => !out.includes(v)) && !out.includes("staging-admin@exemple.test");
const local = (d) => join(d, "docs", "projet", "ACCES-TEST.local.md");
const nettoyer = (d) => rmSync(d, { recursive: true, force: true });

check("vert — la fiche locale porte les valeurs des colonnes d'accès, la fiche versionnée n'est pas touchée, aucune valeur ne sort sur la sortie standard", () => {
  const d = produit();
  try {
    const avant = readFileSync(join(d, "docs", "projet", "ACCES-TEST.md"), "utf8");
    const r = lancer(d);
    att(r.code === 0 && r.json && r.json.verdict === "OK", `exit ${r.code} : ${r.out}`);
    const t = readFileSync(local(d), "utf8");
    for (const v of [V.id, V.mdp, V.cle, "staging-admin@exemple.test", `${V.mdp}-staging`]) att(t.includes(v), `valeur absente de la fiche locale : ${v.slice(0, 12)}…`);
    att(t.includes("`MODE_DEMO`") && !/MODE_DEMO`?\s*=\s*1/.test(t), "la prose ou une colonne hors accès a été résolue (MODE_DEMO)");
    att(!t.startsWith("---") && /FICHE LOCALE/.test(t), "bannière absente ou frontmatter recopié");
    att(readFileSync(join(d, "docs", "projet", "ACCES-TEST.md"), "utf8") === avant, "la fiche versionnée a été modifiée");
    att(sansValeur(r.out), `une valeur est sortie sur la sortie standard : ${r.out}`);
    att(JSON.stringify(r.json.variables_absentes) === JSON.stringify(["PROD_ADMIN_IDENTIFIANT"]), `variables absentes : ${JSON.stringify(r.json.variables_absentes)}`);
    att(/\(non renseignée : PROD_ADMIN_IDENTIFIANT\)/.test(t), "la variable absente n'est pas dite dans la fiche");
  } finally { nettoyer(d); }
});
check("vert — la connexion d'essai : une consigne par ligne qui porte une adresse, rien pour une adresse non renseignée", () => {
  const d = produit();
  try {
    const r = lancer(d); att(r.code === 0, r.out);
    const t = readFileSync(local(d), "utf8");
    att(/\| Essai de connexion \|/.test(t), "colonne « Essai de connexion » absente");
    att(/ouvrir https:\/\/x-staging\.exemple\.test, saisir l'identifiant puis le mot de passe de cette ligne/.test(t), "consigne d'essai absente pour staging");
    att(/\{URL_PROD\}[^\n]*adresse non renseignée : rien à essayer/.test(t), "une adresse non renseignée a reçu une consigne d'essai");
    att(r.json.lignes_avec_essai === 1, `lignes avec essai : ${r.json.lignes_avec_essai}`);
  } finally { nettoyer(d); }
});
check("vert — le fichier généré est IGNORÉ par git et jamais indexé, même après `git add -A`", () => {
  const d = produit();
  try {
    att(lancer(d).code === 0, "génération refusée");
    att(git(d, "check-ignore", "-q", "--", MOTIF).status === 0, "le fichier généré n'est pas ignoré");
    att(!/ACCES-TEST\.local/.test(git(d, "status", "--porcelain", "-uall").stdout), "le fichier généré apparaît dans git status");
    git(d, "add", "-A");
    att(!/ACCES-TEST\.local/.test(git(d, "ls-files").stdout), "le fichier généré est entré dans l'index après git add -A");
    att(/ACCES-TEST\.md/.test(git(d, "ls-files").stdout), "témoin : la fiche versionnée, elle, est bien indexable");
  } finally { nettoyer(d); }
});
check("vert — la régénération remplace les valeurs (un déploiement rafraîchit la fiche)", () => {
  const d = produit();
  try {
    att(lancer(d).code === 0, "première génération refusée");
    writeFileSync(join(d, ".env"), ENV.replace(V.cle, "cle-d-essai-renouvelee-11"), "utf8");
    att(lancer(d).code === 0, "régénération refusée");
    const t = readFileSync(local(d), "utf8");
    att(t.includes("cle-d-essai-renouvelee-11") && !t.includes(V.cle), "l'ancienne valeur survit à la régénération");
  } finally { nettoyer(d); }
});
check("vert — le gitignore SOCLE du pilot ignore la fiche locale (le motif y est, le geste passe sur un produit qui le porte)", () => {
  const d = produit({ gitignore: readFileSync(GABARIT_GITIGNORE, "utf8") });
  try { const r = lancer(d); att(r.code === 0 && r.json.verdict === "OK", `gitignore du socle : ${r.out}`); }
  finally { nettoyer(d); }
});
check("rouge — fiche locale NON IGNORÉE : refus avant d'écrire, sans valeur, et le remède (ajouter le motif) joué fait passer", () => {
  const d = produit({ gitignore: "node_modules/\n" });
  try {
    const r = lancer(d);
    att(r.code === 1 && r.json && r.json.verdict === "REFUS" && /n'est PAS ignoré/.test(r.json.message), `refus attendu : ${r.out}`);
    att(!existsSync(local(d)), "le fichier a été écrit malgré le refus");
    att(sansValeur(r.out), "une valeur figure dans le refus");
    writeFileSync(join(d, ".gitignore"), `node_modules/\n${MOTIF}\n`, "utf8");
    att(lancer(d).code === 0, "le remède prescrit (ajouter le motif) ne fait pas passer le geste");
  } finally { nettoyer(d); }
});
check("rouge — fiche locale SUIVIE par git : refus, remède `git rm --cached` joué", () => {
  const d = produit();
  try {
    writeFileSync(local(d), "ancienne fiche\n", "utf8");
    git(d, "add", "-f", "--", MOTIF);
    const r = lancer(d);
    att(r.code === 1 && /SUIVI par git/.test(r.json.message), `refus attendu : ${r.out}`);
    att(readFileSync(local(d), "utf8") === "ancienne fiche\n", "le fichier suivi a été réécrit malgré le refus");
    git(d, "rm", "--cached", "-q", "--", MOTIF);
    att(lancer(d).code === 0, "le remède prescrit (git rm --cached) ne fait pas passer le geste");
  } finally { nettoyer(d); }
});
check("rouge — produit hors dépôt git : refus (l'ignorance ne se prouve pas)", () => {
  const d = produit({ depot: false });
  try { const r = lancer(d); att(r.code === 1 && /pas un dépôt git/.test(r.json.message) && !existsSync(local(d)), `refus attendu : ${r.out}`); }
  finally { nettoyer(d); }
});
check("rouge — fiche versionnée absente : refus nommant le fichier", () => {
  const d = produit({ fiche: null });
  try { const r = lancer(d); att(r.code === 1 && /ACCES-TEST\.md est absent/.test(r.json.message), `refus attendu : ${r.out}`); }
  finally { nettoyer(d); }
});
check("rouge — la cible est le pilot : refus", () => {
  const d = produit();
  try {
    mkdirSync(join(d, "gabarits"), { recursive: true });
    writeFileSync(join(d, "gabarits", "HERITAGE.json"), "{}", "utf8");
    const r = lancer(d); att(r.code === 1 && /pilot lui-même/.test(r.json.message) && !existsSync(local(d)), `refus attendu : ${r.out}`);
  } finally { nettoyer(d); }
});
check("rouge — un chemin de sortie hors du produit est refusé, une option inconnue rend 2", () => {
  const d = produit();
  try {
    const r = lancer(d, "--sortie", "../hors-produit.md"); att(r.code === 1 && /DANS le produit/.test(r.json.message), `refus attendu : ${r.out}`);
    const u = lancer(d, "--inconnue"); att(u.code === 2, `exit ${u.code} attendu 2`);
  } finally { nettoyer(d); }
});

console.log(`\ngenerer-acces-local (TF-2605) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
