#!/usr/bin/env node
/**
 * hook-taches-actives.test.mjs — la fin de tour dit les tâches d'arrière-plan encore actives (TF-2414, RU-17, moitié du pilot).
 *
 * Sens rouge (le hook parle, exit 0, `systemMessage`) : une commande lancée en arrière-plan et jamais revenue (le `wrangler pages dev` du fait),
 * un agent asynchrone non revenu, une notification de statut `running`, l'identifiant et le geste et l'âge nommés, la liste bornée à 6 avec son reste.
 * Sens vert (silence) : la tâche revenue (`completed`, `failed`, `killed`), arrêtée par `TaskStop` ou `KillShell`, aucune tâche d'arrière-plan,
 * transcription absente ou illisible. Un avertissement : jamais de `decision: block`. Câblage : le hook est au `Stop` de `.claude/settings.json`.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { messageTaches, tachesActives } from "./hook-taches-actives.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "hook-taches-actives.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const base = mkdtempSync(join(tmpdir(), "taches-actives-"));

const T0 = Date.parse("2026-11-09T20:16:00Z");
const iso = (minutes) => new Date(T0 + minutes * 60000).toISOString();
/** Lancement d'une commande en arrière-plan : l'appel, puis son résultat « Command running in background with ID: … ». */
const lanceCommande = (idUse, idTache, command, min = 0) => [
  { type: "assistant", timestamp: iso(min), message: { content: [{ type: "tool_use", id: idUse, name: "Bash", input: { command, run_in_background: true } }] } },
  { type: "user", timestamp: iso(min), message: { content: [{ type: "tool_result", tool_use_id: idUse, content: `Command running in background with ID: ${idTache}. Output is being written to: /tmp/${idTache}.output` }] } },
];
const lanceAgent = (idUse, idAgent, description, min = 0) => [
  { type: "assistant", timestamp: iso(min), message: { content: [{ type: "tool_use", id: idUse, name: "Agent", input: { description, prompt: "x", run_in_background: true } }] } },
  { type: "user", timestamp: iso(min), message: { content: [{ type: "tool_result", tool_use_id: idUse, content: [{ type: "text", text: `Async agent launched successfully.\nagentId: ${idAgent} (internal ID)` }] }] } },
];
const notification = (idTache, statut, min = 5) => ({ type: "user", timestamp: iso(min), message: { content: `<task-notification>\n<task-id>${idTache}</task-id>\n<status>${statut}</status>\n</task-notification>` } });
const arret = (nom, cle, idTache, min = 5) => ({ type: "assistant", timestamp: iso(min), message: { content: [{ type: "tool_use", id: `stop-${idTache}`, name: nom, input: { [cle]: idTache } }] } });
const jsonl = (entrees) => entrees.map((e) => JSON.stringify(e)).join("\n") + "\n";
const SERVEUR = "npx wrangler pages dev ./dist --port 8788";

const jouer = (transcript, { journal = join(base, "journal.jsonl") } = {}) => {
  const chemin = join(base, `t-${Math.random().toString(36).slice(2)}.jsonl`);
  if (transcript !== null) writeFileSync(chemin, transcript, "utf8");
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ transcript_path: chemin, session_id: "S-test" }), env: { ...process.env, FORGE_HOOKS_JOURNAL: journal } });
  let sortie = null;
  try { sortie = r.stdout.trim() ? JSON.parse(r.stdout) : null; } catch { sortie = { illisible: r.stdout }; }
  return { code: r.status, sortie, out: r.stdout || "" };
};

check("rouge — le serveur de banc lancé en arrière-plan et jamais revenu est listé : identifiant, geste, âge, remède TaskStop, exit 0", () => {
  const maintenant = T0 + 17 * 3600000;   // lancé à 20:16, jugé 17 h plus tard
  const a = tachesActives(jsonl(lanceCommande("tu1", "bsrv1", SERVEUR)), maintenant);
  if (a.length !== 1 || a[0].id !== "bsrv1" || a[0].genre !== "commande" || !a[0].geste.startsWith("npx wrangler pages dev") || a[0].depuis_min !== 17 * 60) throw new Error(JSON.stringify(a));
  const r = jouer(jsonl(lanceCommande("tu1", "bsrv1", SERVEUR)));
  const m = r.sortie?.systemMessage || "";
  if (r.code !== 0 || !/bsrv1/.test(m) || !/wrangler pages dev/.test(m) || !/TaskStop/.test(m) || !/RU-17/.test(m) || r.sortie.decision) throw new Error(`exit ${r.code} ${r.out.slice(0, 300)}`);
});
check("rouge — un agent asynchrone non revenu est listé comme tel, avec sa description ; commande et agent ensemble : 2 tâches", () => {
  const a = tachesActives(jsonl([...lanceCommande("tu1", "bsrv1", SERVEUR), ...lanceAgent("tu2", "ag42", "Relevé du lot pg", 3)]), T0 + 10 * 60000);
  if (a.length !== 2 || a[1].genre !== "agent" || a[1].id !== "ag42" || a[1].geste !== "Relevé du lot pg" || a[1].depuis_min !== 7) throw new Error(JSON.stringify(a));
});
check("rouge — une notification de statut `running` n'est pas un retour : la tâche reste active", () => {
  const a = tachesActives(jsonl([...lanceCommande("tu1", "bsrv1", SERVEUR), notification("bsrv1", "running")]));
  if (a.length !== 1) throw new Error(JSON.stringify(a));
});
check("vert — la tâche revenue (completed, failed, killed) n'est plus listée, et le hook se tait", () => {
  for (const statut of ["completed", "failed", "killed"]) {
    const t = jsonl([...lanceCommande("tu1", "bsrv1", SERVEUR), notification("bsrv1", statut)]);
    if (tachesActives(t).length) throw new Error(`${statut} : encore listée`);
    const r = jouer(t);
    if (r.code !== 0 || r.out.trim()) throw new Error(`${statut} : le hook parle : ${r.out.slice(0, 160)}`);
  }
});
check("vert, remède joué — la session arrête le serveur (TaskStop, ou KillShell) : il n'est plus listé", () => {
  if (tachesActives(jsonl([...lanceCommande("tu1", "bsrv1", SERVEUR), arret("TaskStop", "task_id", "bsrv1")])).length) throw new Error("TaskStop : encore listée");
  if (tachesActives(jsonl([...lanceCommande("tu1", "bsrv1", SERVEUR), arret("KillShell", "shell_id", "bsrv1")])).length) throw new Error("KillShell : encore listée");
  const r = jouer(jsonl([...lanceCommande("tu1", "bsrv1", SERVEUR), arret("TaskStop", "task_id", "bsrv1")]));
  if (r.out.trim()) throw new Error(`le hook parle encore : ${r.out.slice(0, 160)}`);
});
check("vert — l'arrêt ou le retour d'UNE tâche ne retire pas l'autre", () => {
  const a = tachesActives(jsonl([...lanceCommande("tu1", "bsrv1", SERVEUR), ...lanceCommande("tu2", "bsrv2", "npm run dev", 2), notification("bsrv1", "completed")]));
  if (a.length !== 1 || a[0].id !== "bsrv2") throw new Error(JSON.stringify(a));
});
check("vert — aucune tâche d'arrière-plan (commande ordinaire), transcription absente ou illisible, entrée vide : silence, exit 0, rien au journal", () => {
  const journal = join(base, "journal-vert.jsonl");
  const ordinaire = jsonl([{ type: "assistant", timestamp: iso(0), message: { content: [{ type: "tool_use", id: "tu9", name: "Bash", input: { command: "ls" } }] } },
    { type: "user", timestamp: iso(0), message: { content: [{ type: "tool_result", tool_use_id: "tu9", content: "a.txt" }] } }]);
  for (const t of [ordinaire, "{ pas du json\n", ""]) {
    const r = jouer(t, { journal });
    if (r.code !== 0 || r.out.trim()) throw new Error(`exit ${r.code} sortie « ${r.out.slice(0, 120)} »`);
  }
  const absente = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ transcript_path: join(base, "absente.jsonl") }), env: { ...process.env, FORGE_HOOKS_JOURNAL: journal } });
  const vide = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: "", env: { ...process.env, FORGE_HOOKS_JOURNAL: journal } });
  if (absente.status !== 0 || absente.stdout.trim() || vide.status !== 0 || vide.stdout.trim()) throw new Error("transcription absente ou entrée vide : le hook parle ou échoue");
  if (existsSync(journal)) throw new Error("le journal a reçu une ligne alors que rien n'a été dit");
});
check("rouge — la liste est bornée à 6 et dit son reste ; le message ne bloque jamais (aucune décision) et le journal garde le compte", () => {
  const huit = jsonl(Array.from({ length: 8 }, (_, i) => lanceCommande(`tu${i}`, `b${i}`, `serveur ${i}`, i)).flat());
  const m = messageTaches(tachesActives(huit));
  if (!/8 tâche\(s\)/.test(m) || !/\+2 autre\(s\)/.test(m) || /b7/.test(m)) throw new Error(m.slice(0, 400));
  const journal = join(base, "journal-rouge.jsonl");
  const r = jouer(huit, { journal });
  if (r.code !== 0 || r.sortie?.decision || r.sortie?.continue === false) throw new Error(`le hook bloque : ${r.out.slice(0, 200)}`);
  const ligne = JSON.parse(readFileSync(journal, "utf8").trim().split("\n").pop());
  if (ligne.hook !== "taches-actives" || ligne.actives !== 8 || ligne.commandes !== 8 || ligne.session !== "S-test") throw new Error(JSON.stringify(ligne));
});
check("câblage — le hook est au Stop de `.claude/settings.json` du pilot, après le hook de restitution, et son banc le nomme", () => {
  const reglages = JSON.parse(readFileSync(join(ICI, "..", ".claude", "settings.json"), "utf8"));
  const commandes = (reglages.hooks?.Stop || []).flatMap((g) => g.hooks || []).map((h) => String(h.command));
  const iHook = commandes.findIndex((c) => /hook-taches-actives\.mjs/.test(c)), iResti = commandes.findIndex((c) => /hook-restitution\.mjs/.test(c));
  if (iHook < 0) throw new Error("hook-taches-actives.mjs n'est pas au Stop");
  if (iHook < iResti) throw new Error("le hook doit suivre celui de la restitution");
});

rmSync(base, { recursive: true, force: true });
console.log(`\nhook-taches-actives : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
