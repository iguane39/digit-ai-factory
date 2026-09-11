#!/usr/bin/env node
/**
 * verifier-avance-publication.test.mjs — la borne de R-38 §4-5 rejouée sur un dépôt jetable.
 *
 * NOTE DE FORME : le prompt qui a produit ce fichier demandait `node:test` + `node:assert`
 * explicitement (deux fois), alors que `verifier-bascule.test.mjs` — donné comme modèle de FORME —
 * utilise en réalité un harnais maison (`check`/`pass`/`fail`), comme les seize autres
 * `scripts\*.test.mjs` du dépôt : AUCUN n'emploie `node:test`. Choix fait ici : suivre la
 * consigne explicite et répétée (`node:test`/`node:assert/strict`, `node --test` comme commande de
 * lancement), ce qui reste conforme à la FORME du modèle (dépôt git jetable en `os.tmpdir()`,
 * commentaire d'en-tête qui explique le POURQUOI, sortie JSON interrogée en aveugle) sans en copier
 * le harnais. Signalé au rapport de restitution — pas un blocage, un écart de forme mineur.
 *
 * CHAQUE TEST CONSTRUIT SON PROPRE DÉPÔT JETABLE, plutôt qu'un dépôt partagé rembobiné entre
 * scénarios : deux tests qui liraient/écriraient le même dépôt en parallèle (le lanceur `node
 * --test` peut paralléliser des fichiers, et ordonnance les tests d'un même fichier sans garantie
 * absolue d'un unique thread d'exécution selon les options) se marcheraient dessus. Un dépôt par
 * test coûte quelques `git init` de plus et évite toute dépendance d'ordre.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-avance-publication.mjs");

/** Un dépôt git jetable, avec `refs/remotes/origin/main` posée sur le commit initial (la borne
 * par défaut de l'outil, `origin/main..HEAD`) — sans réseau ni remote réel : `update-ref` suffit. */
function creerDepot() {
  const d = mkdtempSync(join(tmpdir(), "verif-avance-pub-"));
  const git = (a) => execFileSync("git", a, { cwd: d, encoding: "utf8" });
  git(["init", "-q"]);
  git(["config", "user.email", "test@example.invalid"]);
  git(["config", "user.name", "Test"]);
  writeFileSync(join(d, "base.txt"), "base\n");
  git(["add", "base.txt"]);
  git(["commit", "-q", "-m", "commit initial (hors plage)"]);
  git(["update-ref", "refs/remotes/origin/main", "HEAD"]);
  return { d, git };
}

function ecrire(d, chemin, contenu) {
  const cheminComplet = join(d, ...chemin.split("/"));
  mkdirSync(dirname(cheminComplet), { recursive: true });
  writeFileSync(cheminComplet, contenu);
}

/** Appelle l'outil et rend `{ code, j }` — jamais une exception, même sur exit != 0. */
function lancer(d, ...extra) {
  try {
    const stdout = execFileSync(process.execPath, [OUTIL, "--depot", d, ...extra], { encoding: "utf8" });
    return { code: 0, j: JSON.parse(stdout) };
  } catch (e) {
    let j = null;
    try { j = JSON.parse(e.stdout || "null"); } catch { /* sortie illisible : j reste null */ }
    return { code: e.status ?? 1, j };
  }
}

test("(a) restitution + candidature, trois enregistrements → PASS exit 0", () => {
  const { d, git } = creerDepot();
  try {
    ecrire(d, "output/2026-Synthese-run.md", "# Synthese\ncontenu\n");
    git(["add", "output/2026-Synthese-run.md"]);
    git(["commit", "-q", "-m", "Synthese du run"]);

    ecrire(d, "todo/CLASSES.json", "{}\n");
    ecrire(d, "todo/TODO.jsonl", JSON.stringify({ ev: "ingestion", id: "tf-1" }) + "\n");
    git(["add", "todo/CLASSES.json", "todo/TODO.jsonl"]);
    git(["commit", "-q", "-m", "ingestion d'un lot"]);

    ecrire(d, "README.md", "vue régénérée\n");
    git(["add", "README.md"]);
    git(["commit", "-q", "-m", "index de dossier régénéré"]);

    const r = lancer(d);
    assert.equal(r.code, 0, JSON.stringify(r.j));
    assert.equal(r.j.verdict, "PASS");
    assert.equal(r.j.enregistrements.length, 3);
    assert.ok(r.j.enregistrements.every((e) => e.classe !== "explicite"), JSON.stringify(r.j.enregistrements));
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("(b) un enregistrement touchant REGLES-PROJET.md → FAIL exit 1, sha nommé", () => {
  const { d, git } = creerDepot();
  try {
    ecrire(d, "REGLES-PROJET.md", "une règle neuve\n");
    git(["add", "REGLES-PROJET.md"]);
    git(["commit", "-q", "-m", "règle neuve"]);
    const sha = git(["rev-parse", "HEAD"]).trim();

    const r = lancer(d);
    assert.equal(r.code, 1, JSON.stringify(r.j));
    assert.equal(r.j.verdict, "FAIL");
    const explicite = r.j.enregistrements.find((e) => e.sha === sha);
    assert.ok(explicite, "le sha du commit REGLES-PROJET.md est absent des enregistrements");
    assert.equal(explicite.classe, "explicite");
    assert.ok(explicite.fichiers_hors_classe.includes("REGLES-PROJET.md"));
    assert.ok(r.j.motif.includes(sha.slice(0, 7)), "le motif ne nomme pas le sha en avance");
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("(c1) TODO.jsonl : une ligne ajoutée `maj` porte une décision → FAIL", () => {
  const { d, git } = creerDepot();
  try {
    ecrire(d, "todo/TODO.jsonl", JSON.stringify({ ev: "maj", id: "tf-2", statut: "clos" }) + "\n");
    git(["add", "todo/TODO.jsonl"]);
    git(["commit", "-q", "-m", "maj de statut"]);

    const r = lancer(d);
    assert.equal(r.code, 1, JSON.stringify(r.j));
    assert.equal(r.j.verdict, "FAIL");
    assert.equal(r.j.enregistrements[0].classe, "explicite");
    assert.ok(r.j.enregistrements[0].fichiers_hors_classe.includes("todo/TODO.jsonl"));
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("(c2) TODO.jsonl : une ligne ajoutée `creation` statut `candidat` → PASS", () => {
  const { d, git } = creerDepot();
  try {
    ecrire(d, "todo/TODO.jsonl", JSON.stringify({ ev: "creation", id: "tf-3", statut: "candidat" }) + "\n");
    git(["add", "todo/TODO.jsonl"]);
    git(["commit", "-q", "-m", "création candidate"]);

    const r = lancer(d);
    assert.equal(r.code, 0, JSON.stringify(r.j));
    assert.equal(r.j.verdict, "PASS");
    assert.equal(r.j.enregistrements[0].classe, "candidature");
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("(d1) --go \"<motif>\" couvre un enregistrement explicite → PASS exit 0 avec `go`", () => {
  const { d, git } = creerDepot();
  try {
    ecrire(d, "REGLES-PROJET.md", "une règle neuve\n");
    git(["add", "REGLES-PROJET.md"]);
    git(["commit", "-q", "-m", "règle neuve sous GO"]);

    const r = lancer(d, "--go", "D-12 (a)");
    assert.equal(r.code, 0, JSON.stringify(r.j));
    assert.equal(r.j.verdict, "PASS");
    assert.equal(r.j.go, "D-12 (a)");
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("(d2) --go sans motif (vide) est refusé → exit 2", () => {
  const { d } = creerDepot();
  try {
    const r = lancer(d, "--go", "");
    assert.equal(r.code, 2, JSON.stringify(r.j));
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("(e) plage vide (origin/main == HEAD) → PASS, enregistrements vides", () => {
  const { d } = creerDepot();
  try {
    const r = lancer(d);
    assert.equal(r.code, 0, JSON.stringify(r.j));
    assert.equal(r.j.verdict, "PASS");
    assert.deepEqual(r.j.enregistrements, []);
    assert.ok(Array.isArray(r.j.non_juge) && r.j.non_juge.length > 0);
  } finally { rmSync(d, { recursive: true, force: true }); }
});
