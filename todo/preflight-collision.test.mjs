#!/usr/bin/env node
/**
 * preflight-collision.test.mjs — TF-0394 (revue du 19/08) : double sens du préflight
 * anti-collision d'ingerer-lot.mjs, sur dépôts git ÉPHÉMÈRES (aucun réseau, origin =
 * bare local).
 *
 *   VERTE      : origin synchrone → l'ingestion procède (exit 0, id frappé au registre) ;
 *   ROUGE      : origin a avancé sur todo/TODO.jsonl (commit poussé par une « autre
 *                session ») → REFUS exit 1, message TF-0394, registre local INTACT ;
 *   ÉCHAPPE    : même état rouge + `--sans-fetch` → l'ingestion procède (le hors-ligne
 *                s'assume explicitement, il ne se subit pas).
 *
 * Puis le POST-contrôle (TF-0481), ajouté le 25/08 par TF-0634 — le préflight regarde AVANT
 * l'écriture, le post-contrôle regarde APRÈS, pour voir la fenêtre qui s'ouvre PENDANT :
 *
 *   POST-VERT  : origin synchrone → la comparaison ABOUTIT (aucun « comparaison impossible ») ;
 *   POST-ROUGE : un id frappé ici est déjà publié sur origin → COLLISION annoncée, l'id nommé,
 *                la commande de réparation donnée, et exit 0 — ce contrôle AVERTIT, il ne
 *                bloque pas : l'écriture est faite, l'annuler perdrait le travail d'ingestion.
 *
 * Joué par oracles/self-tests.mjs (invariant I2 : tout *.test.mjs du dépôt est joué).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const INGERER = join(ICI, "ingerer-lot.mjs");
const base = mkdtempSync(join(tmpdir(), "tf0394-"));
const echecs = [];
const git = (dir, ...args) =>
  execFileSync("git", ["-C", dir, "-c", "user.email=test@test", "-c", "user.name=test", ...args],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

try {
  // Origin bare + clone « session A »
  const origin = join(base, "origin.git");
  mkdirSync(origin);
  git(origin, "init", "--bare", "--initial-branch=main", ".");
  const workA = join(base, "workA");
  git(base, "clone", "--quiet", origin, workA);
  mkdirSync(join(workA, "todo"));
  writeFileSync(join(workA, "todo", "TODO.jsonl"), "", "utf8");
  git(workA, "add", "-A");
  git(workA, "commit", "--quiet", "-m", "registre initial");
  git(workA, "push", "--quiet", "origin", "main");

  const sidecar = (nom, titre) => {
    const p = join(base, nom);
    writeFileSync(p, JSON.stringify({
      schema: 1, titre, contenu: "test préflight TF-0394", demandeur: "pilot (self-test)",
      source: "preflight-collision.test.mjs", date_demande: "2026-08-19",
      forges_cibles_initiales: ["pilot"], score: { gain: 1, preuve: 1, effort: 1 },
    }) + "\n", "utf8");
    return p;
  };
  const registreA = join(workA, "todo", "TODO.jsonl");
  const lancer = (args) => spawnSync(process.execPath, [INGERER, ...args], { encoding: "utf8" });

  // --- VERTE : origin synchrone, l'ingestion procède -------------------------------------
  const v = lancer([sidecar("verte.tf.jsonl", "verte"), "--registre", registreA]);
  if (v.status !== 0) echecs.push(`VERTE : exit ${v.status} attendu 0 — ${(v.stderr || v.stdout).slice(0, 200)}`);
  else if (!readFileSync(registreA, "utf8").includes('"ev":"creation"'))
    echecs.push("VERTE : exit 0 mais aucune creation écrite au registre");

  // --- ROUGE : une « session B » pousse un commit registre, A est en retard ---------------
  const workB = join(base, "workB");
  git(base, "clone", "--quiet", origin, workB);
  // B frappe son id AVEC L'OUTIL, pas à la main (TF-0634). Une ligne composée à la main portait un
  // item incomplet : tant qu'elle restait chez B, rien ne s'en apercevait — mais dès qu'un cas la
  // fait entrer dans le registre de A, l'oracle post-écriture la refuse, à raison, et le cas
  // échoue pour une raison qui n'a rien à voir avec ce qu'il mesure. Une fixture doit être fausse
  // sur le point qu'elle teste et JUSTE sur tout le reste.
  lancer([sidecar("session-b.tf.jsonl", "frappé par la session B"),
    "--registre", join(workB, "todo", "TODO.jsonl"), "--sans-fetch"]);
  git(workB, "add", "-A");
  git(workB, "commit", "--quiet", "-m", "session B frappe TF-0001");
  git(workB, "push", "--quiet", "origin", "main");

  const avant = readFileSync(registreA, "utf8");
  const r = lancer([sidecar("rouge.tf.jsonl", "rouge"), "--registre", registreA]);
  if (r.status !== 1) echecs.push(`ROUGE : exit ${r.status} attendu 1 (refus préflight)`);
  else if (!/TF-0394/.test(r.stderr)) echecs.push("ROUGE : refus sans le motif TF-0394");
  if (readFileSync(registreA, "utf8") !== avant) echecs.push("ROUGE : le registre local a été modifié malgré le refus");

  // --- ÉCHAPPE : même retard, --sans-fetch assume et procède ------------------------------
  const e = lancer([sidecar("echappe.tf.jsonl", "échappe"), "--registre", registreA, "--sans-fetch"]);
  if (e.status !== 0) echecs.push(`ÉCHAPPE : exit ${e.status} attendu 0 avec --sans-fetch`);

  // --- LE POST-CONTRÔLE (TF-0481), ÉPROUVÉ DANS LES DEUX SENS — TF-0634 -------------------
  //
  // POURQUOI CES DEUX CAS EXISTENT, et pourquoi leur absence a coûté. Le préflight regarde AVANT
  // l'écriture ; le post-contrôle regarde APRÈS, pour voir la fenêtre qui s'ouvre PENDANT. Cette
  // recette jouait trois cas et AUCUN ne touchait le post-contrôle : les trois n'observaient que
  // le code de sortie et le contenu du registre, or le post-contrôle ne peut PAS faire échouer
  // l'ingestion (l'écriture est faite, annuler perdrait le travail) — il n'écrit que sur stderr.
  // Un contrôle dont la seule sortie n'est jamais lue par sa recette est un contrôle non couvert.
  //
  // CE QUE ÇA A LAISSÉ PASSER : `todoDir` était déclaré DANS le bloc du préflight, donc invisible
  // au post-contrôle. Celui-ci levait `todoDir is not defined` à CHAQUE ingestion, son `catch`
  // avalait l'erreur, et les trois cas restaient verts. Le garde-fou anti-collision inter-sessions
  // n'avait jamais tourné — pendant que deux sessions parallèles écrivaient dans ce registre.
  //
  // Le cas VERT ci-dessous échoue tant que le défaut est là : c'est ce qui en fait une preuve et
  // non une illustration.

  // Remettre A au niveau d'origin : le préflight doit passer pour qu'on ATTEIGNE le post-contrôle.
  git(workA, "fetch", "--quiet", "origin");
  git(workA, "reset", "--hard", "--quiet", "origin/main");

  // POST-VERT : origin synchrone → la comparaison DOIT aboutir. Si elle échoue, le post-contrôle
  // le dit sur stderr — et c'est précisément cette phrase qui trahissait le défaut.
  const pv = lancer([sidecar("post-verte.tf.jsonl", "post verte"), "--registre", registreA]);
  if (pv.status !== 0) echecs.push(`POST-VERT : exit ${pv.status} attendu 0`);
  if (/comparaison origin impossible/.test(pv.stderr || ""))
    echecs.push(`POST-VERT : le post-contrôle n'a pas pu comparer — ${(pv.stderr || "").split("\n").find((l) => /CAUSE RÉELLE/.test(l)) || "sans cause"}`);
  if (/COLLISION TF-0481/.test(pv.stderr || ""))
    echecs.push("POST-VERT : collision annoncée alors qu'aucun id frappé n'est sur origin");

  // POST-ROUGE : un id frappé ici est DÉJÀ sur origin, sans que le préflight ait pu le voir.
  // Le montage reproduit exactement cette fenêtre : A est à jour d'origin (donc le préflight
  // passe), mais son registre de TRAVAIL a été vidé — le max local repart donc en arrière et
  // re-frappe un id que la « session B » a déjà publié.
  const dejaPris = /"id":"(TF-\d+)"/.exec(readFileSync(registreA, "utf8"));
  git(workA, "add", "-A");
  git(workA, "commit", "--quiet", "-m", "A publie son ingestion");
  git(workA, "push", "--quiet", "origin", "main");
  writeFileSync(registreA, "", "utf8");            // registre de travail vidé : le max repart à zéro
  const pr = lancer([sidecar("post-rouge.tf.jsonl", "post rouge"), "--registre", registreA]);
  if (pr.status !== 0) echecs.push(`POST-ROUGE : exit ${pr.status} attendu 0 — le post-contrôle AVERTIT, il ne bloque pas`);
  else if (!/COLLISION TF-0481/.test(pr.stderr || ""))
    echecs.push("POST-ROUGE : id déjà pris sur origin, et aucune collision annoncée");
  else if (dejaPris && !pr.stderr.includes(dejaPris[1]))
    echecs.push(`POST-ROUGE : collision annoncée sans nommer l'id en cause (${dejaPris[1]})`);
  else if (!/renumeroter\.mjs/.test(pr.stderr || ""))
    echecs.push("POST-ROUGE : collision annoncée sans la commande qui répare");
} catch (err) {
  echecs.push(`harnais : ${String(err).slice(0, 300)}`);
} finally {
  try { rmSync(base, { recursive: true, force: true }); } catch { /* Windows : verrou git résiduel toléré */ }
}

if (echecs.length) {
  console.error("preflight-collision (TF-0394) : FAIL\n  - " + echecs.join("\n  - "));
  process.exit(1);
}
console.log("preflight-collision (TF-0394, TF-0481, TF-0634) : 5/5 — verte ingère, rouge refuse (registre intact), --sans-fetch assume, post-contrôle compare (vert) et dénonce un id déjà pris (rouge)");
