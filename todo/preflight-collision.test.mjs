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
  writeFileSync(join(workB, "todo", "TODO.jsonl"),
    '{"ev":"creation","ts":"2026-08-19T00:00:00Z","id":"TF-0001","statut":"candidat","titre":"frappé par la session B"}\n', "utf8");
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
} catch (err) {
  echecs.push(`harnais : ${String(err).slice(0, 300)}`);
} finally {
  try { rmSync(base, { recursive: true, force: true }); } catch { /* Windows : verrou git résiduel toléré */ }
}

if (echecs.length) {
  console.error("preflight-collision (TF-0394) : FAIL\n  - " + echecs.join("\n  - "));
  process.exit(1);
}
console.log("preflight-collision (TF-0394) : 3/3 — verte ingère, rouge refuse (registre intact), --sans-fetch assume");
