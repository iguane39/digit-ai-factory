#!/usr/bin/env node
/**
 * hook-publication-hebergee.test.mjs — R-38 portée par l'outil Artifact (TF-1592).
 * Deux sens : le hook REFUSE une publication sans GO (exit 2, motif nommant R-38) et LAISSE PASSER
 * ce qui ne publie rien ; le remède qu'il propose (variable ou entrée de ledger) est JOUÉ et doit
 * faire passer. Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-publication-hebergee.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const ENV_PROPRE = { ...process.env };
delete ENV_PROPRE.FORGE_PUBLICATION_GO;
const jouer = (entree, env = ENV_PROPRE) => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify(entree), env });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
};
const dossierVide = () => mkdtempSync(join(tmpdir(), "pubheb-"));
const artefact = (action, cwd, extra = {}) => ({ tool_name: "Artifact", cwd, tool_input: { ...(action === undefined ? {} : { action }), file_path: "x.html", ...extra } });

check("rouge — publication SANS action (le défaut de l'outil) et sans GO : refusée, R-38 nommée", () => {
  const D = dossierVide();
  const r = jouer(artefact(undefined, D));
  if (r.code !== 2 || !/R-38/.test(r.out) || !/« publish »/.test(r.out)) throw new Error(`exit ${r.code} : ${r.out}`);
  rmSync(D, { recursive: true, force: true });
});
check("rouge — `publish` explicite, `pin`, `write_db`, `reply`, création depuis un type : tous refusés sans GO", () => {
  const D = dossierVide();
  for (const a of ["publish", "pin", "write_db", "reply", "resolve"]) {
    const r = jouer(artefact(a, D));
    if (r.code !== 2) throw new Error(`${a} : exit ${r.code} attendu 2 — ${r.out}`);
  }
  const t = jouer({ tool_name: "Artifact", cwd: D, tool_input: { type_url: "https://claude.ai/x", title: "t" } });
  if (t.code !== 2) throw new Error(`type_url : exit ${t.code} attendu 2`);
  rmSync(D, { recursive: true, force: true });
});
check("rouge — une action inconnue est refusée (fermé par défaut)", () => {
  const D = dossierVide();
  const r = jouer(artefact("inconnue_demain", D));
  if (r.code !== 2) throw new Error(`exit ${r.code} attendu 2 — ${r.out}`);
  rmSync(D, { recursive: true, force: true });
});
check("rouge — le nom préfixé d'un connecteur (mcp__x__Artifact) est jugé comme l'outil", () => {
  const D = dossierVide();
  const r = jouer({ ...artefact(undefined, D), tool_name: "mcp__plugin__Artifact" });
  if (r.code !== 2) throw new Error(`exit ${r.code} attendu 2`);
  rmSync(D, { recursive: true, force: true });
});
check("rouge — un GO mal formé (variable sans citation de décision) ne vaut rien", () => {
  const D = dossierVide();
  const r = jouer(artefact(undefined, D), { ...ENV_PROPRE, FORGE_PUBLICATION_GO: "oui vas-y" });
  if (r.code !== 2) throw new Error(`exit ${r.code} attendu 2 — ${r.out}`);
  rmSync(D, { recursive: true, force: true });
});
check("rouge — une entrée de ledger sans r38 ou sans citation ne vaut pas GO", () => {
  const D = dossierVide();
  mkdirSync(join(D, "forge"));
  writeFileSync(join(D, "forge", "ledger.jsonl"),
    JSON.stringify({ seq: 1, type: "go_publication", citation: "D-9 (a) du 03/10" }) + "\n"
    + JSON.stringify({ seq: 2, type: "go_publication", r38: true, citation: "vas-y" }) + "\n"
    + JSON.stringify({ seq: 3, type: "retour", r38: true, citation: "D-9 (a) du 03/10" }) + "\n", "utf8");
  const r = jouer(artefact(undefined, D));
  if (r.code !== 2) throw new Error(`exit ${r.code} attendu 2 — ${r.out}`);
  rmSync(D, { recursive: true, force: true });
});
check("remède joué — FORGE_PUBLICATION_GO=\"D-N (x) du JJ/MM\" : la même publication passe (exit 0)", () => {
  const D = dossierVide();
  const r = jouer(artefact(undefined, D), { ...ENV_PROPRE, FORGE_PUBLICATION_GO: "D-12 (a) du 03/10" });
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.out}`);
  rmSync(D, { recursive: true, force: true });
});
check("remède joué — une entrée `go_publication` complète au ledger du run : la même publication passe", () => {
  const D = dossierVide();
  mkdirSync(join(D, "forge"));
  writeFileSync(join(D, "forge", "ledger.jsonl"),
    JSON.stringify({ seq: 1, type: "go_publication", r38: true, citation: "D-12 (a) du 03/10" }) + "\n", "utf8");
  const r = jouer(artefact(undefined, D));
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.out}`);
  rmSync(D, { recursive: true, force: true });
});
check("vert — lecture, liste, ouverture, retrait : jamais refusés, GO ou non", () => {
  const D = dossierVide();
  for (const a of ["list", "read", "open", "comments", "status", "quickstart", "read_db", "delete", "unpin"]) {
    const r = jouer(artefact(a, D));
    if (r.code !== 0) throw new Error(`${a} : exit ${r.code} — ${r.out}`);
  }
  rmSync(D, { recursive: true, force: true });
});
check("vert — un autre outil (Write, Bash) n'est pas concerné ; une entrée illisible ne bloque rien", () => {
  const D = dossierVide();
  if (jouer({ tool_name: "Write", cwd: D, tool_input: { file_path: "a.md" } }).code !== 0) throw new Error("Write refusé");
  if (jouer({ tool_name: "Bash", cwd: D, tool_input: { command: "ls" } }).code !== 0) throw new Error("Bash refusé");
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: "pas du json", env: ENV_PROPRE });
  if (r.status !== 0) throw new Error(`entrée illisible : exit ${r.status}`);
  rmSync(D, { recursive: true, force: true });
});

console.log(`\nhook-publication-hebergee (TF-1592) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
