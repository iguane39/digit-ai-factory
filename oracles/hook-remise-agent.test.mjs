#!/usr/bin/env node
/**
 * hook-remise-agent.test.mjs — un agent ne se remet pas sans le verdict d'un oracle daté après sa dernière écriture du fichier jugé
 * (TF-2548, classe `gate-cout-invite-au-contournement`).
 *
 * Sens rouge (refus : `decision: "block"`, exit 0) : une page servie écrite par l'outil d'écriture sans critique ; une page écrite PAR COMMANDE
 * (`sed -i`, redirection, `tee`) sans critique — le cas du 14/11, où les corrections passaient par la ligne de commande après le plafond de refus du hook
 * d'écriture ; une critique rendue AVANT la dernière écriture (périmée) ; une critique en SKIP ; la transcription de l'agent retrouvée par l'identifiant.
 * Sens vert (silence) : la critique jouée APRÈS la dernière écriture (PASS ou FAIL), aucun fichier servi (outillage .mjs, fixture, brouillon temporaire),
 * transcription absente, entrée illisible. Remède joué : l'agent refusé joue la critique, la même transcription complétée passe. Jamais de boucle :
 * `stop_hook_active` donne un avertissement, pas un second refus. Câblage : le hook est au `SubagentStop` de `.claude/settings.json`.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { jugerRemise, lireTranscript, transcriptDeLAgent } from "./hook-remise-agent.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "hook-remise-agent.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const base = mkdtempSync(join(tmpdir(), "remise-agent-"));

// Un produit FICTIF hors du dossier temporaire (un fichier du dossier temporaire est un brouillon, jamais servi) : seules des chaînes sont lues.
const PRODUIT = "C:/dev/produit-fictif";
const PAGE = `${PRODUIT}/site/index.html`;
let n = 0;
const iso = (m) => new Date(Date.parse("2026-11-14T10:00:00Z") + m * 60000).toISOString();
const ecrit = (nom, input, m) => [{ type: "assistant", timestamp: iso(m), cwd: PRODUIT, message: { content: [{ type: "tool_use", id: `u${++n}`, name: nom, input }] } }];
const commande = (cmd, m, sortie = "ok") => {
  const id = `u${++n}`;
  return [{ type: "assistant", timestamp: iso(m), cwd: PRODUIT, message: { content: [{ type: "tool_use", id, name: "Bash", input: { command: cmd } }] } },
    { type: "user", timestamp: iso(m), cwd: PRODUIT, message: { content: [{ type: "tool_result", tool_use_id: id, content: sortie }] } }];
};
const critique = (m, sortie = '{"orchestrateur":"run-oracles-design","verdict":"PASS"}') => commande(`node C:/dev/digit-ai-forge-design/oracles/run-oracles-design.mjs ${PAGE} --rendu --json-only`, m, sortie);
const jsonl = (entrees) => entrees.map((e) => JSON.stringify(e)).join("\n") + "\n";

const jouer = (entrees, extra = {}, { journal = join(base, "journal.jsonl") } = {}) => {
  const chemin = join(base, `agent-${++n}.jsonl`);
  writeFileSync(chemin, jsonl(entrees), "utf8");
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ hook_event_name: "SubagentStop", agent_transcript_path: chemin, agent_id: "a1", agent_type: "constructeur", cwd: PRODUIT, session_id: "S-test", ...extra }),
    env: { ...process.env, FORGE_HOOKS_JOURNAL: journal } });
  let sortie = null;
  try { sortie = r.stdout.trim() ? JSON.parse(r.stdout) : null; } catch { sortie = { illisible: r.stdout }; }
  return { code: r.status, sortie, out: r.stdout || "" };
};
const refuse = (r) => r.code === 0 && r.sortie?.decision === "block" && /TF-2548/.test(r.sortie.reason);

check("rouge — une page servie écrite par l'outil d'écriture, sans critique : la remise est refusée, la page nommée et le remède (run-oracles-design) donné", () => {
  const r = jouer([...ecrit("Write", { file_path: PAGE, content: "<html></html>" }, 0)]);
  if (!refuse(r) || !/site\/index\.html/.test(r.sortie.reason) || !/run-oracles-design/.test(r.sortie.reason) || !/constructeur/.test(r.sortie.reason)) throw new Error(r.out.slice(0, 300));
});
check("rouge — la page écrite PAR COMMANDE (sed -i, redirection, tee), le cas d'après le plafond de refus du hook d'écriture : refusée de même", () => {
  for (const cmd of [`sed -i "s/a/b/" ${PAGE}`, `echo '<p>x</p>' >> ${PAGE}`, `cat page.html | tee ${PAGE}`]) {
    const r = jouer([...commande(cmd, 0)]);
    if (!refuse(r)) throw new Error(`${cmd} : ${r.out.slice(0, 200)}`);
  }
});
check("rouge — la critique rendue AVANT la dernière écriture est périmée : refus, et la sortie le dit", () => {
  const r = jouer([...ecrit("Write", { file_path: PAGE, content: "<html></html>" }, 0), ...critique(1), ...commande(`sed -i "s/a/b/" ${PAGE}`, 2)]);
  if (!refuse(r) || !/antérieur à la dernière écriture/.test(r.sortie.reason)) throw new Error(r.out.slice(0, 300));
});
check("rouge — une critique SKIP (indéterminée) n'est pas un verdict : refus", () => {
  const r = jouer([...ecrit("Write", { file_path: PAGE, content: "<html></html>" }, 0), ...critique(1, '{"orchestrateur":"run-oracles-design","verdict":"SKIP"}')]);
  if (!refuse(r)) throw new Error(r.out.slice(0, 300));
});
check("vert, remède joué — la même transcription complétée par la critique APRÈS la dernière écriture (PASS ou FAIL) : la remise passe, en silence", () => {
  for (const verdict of ["PASS", "FAIL"]) {
    const r = jouer([...ecrit("Write", { file_path: PAGE, content: "<html></html>" }, 0), ...commande(`sed -i "s/a/b/" ${PAGE}`, 1), ...critique(2, `{"orchestrateur":"run-oracles-design","verdict":"${verdict}"}`)]);
    if (r.code !== 0 || r.out.trim()) throw new Error(`${verdict} : ${r.out.slice(0, 200)}`);
  }
});
check("vert — aucun fichier servi : outillage .mjs, fixture, gabarit et brouillon du dossier temporaire ne sont pas des pages", () => {
  for (const p of [`${PRODUIT}/oracles/outil.mjs`, `${PRODUIT}/oracles/fixtures/rouge.html`, `${PRODUIT}/gabarits/page.html`, join(tmpdir(), "brouillon.html").replace(/\\/g, "/")]) {
    const r = jouer([...ecrit("Write", { file_path: p, content: "x" }, 0)]);
    if (r.code !== 0 || r.out.trim()) throw new Error(`${p} : ${r.out.slice(0, 200)}`);
  }
});
check("vert — un agent qui n'écrit rien (lecture seule) se remet sans un mot", () => {
  const r = jouer([...commande("git status --short", 0)]);
  if (r.code !== 0 || r.out.trim()) throw new Error(r.out.slice(0, 200));
});
check("jamais de boucle — `stop_hook_active` : pas de second refus, le défaut est DIT (systemMessage) et journalisé", () => {
  const journal = join(base, "journal-boucle.jsonl");
  const r = jouer([...ecrit("Write", { file_path: PAGE, content: "<html></html>" }, 0)], { stop_hook_active: true }, { journal });
  if (r.code !== 0 || r.sortie?.decision || !/déjà refusée une fois/.test(r.sortie?.systemMessage || "")) throw new Error(r.out.slice(0, 300));
  const l = JSON.parse(readFileSync(journal, "utf8").trim().split("\n").pop());
  if (l.hook !== "remise-agent" || l.verdict !== "FAIL" || l.agent !== "constructeur" || l.deja_refuse !== true || l.sans_verdict[0]?.motif !== "absente") throw new Error(JSON.stringify(l));
});
check("la transcription de l'agent se retrouve par son identifiant à côté de celle de la session ; absente ou illisible : silence, exit 0", () => {
  const session = join(base, "session-x.jsonl");
  mkdirSync(join(base, "session-x", "subagents"), { recursive: true });
  writeFileSync(join(base, "session-x", "subagents", "agent-a77.jsonl"), jsonl([...ecrit("Write", { file_path: PAGE, content: "<html></html>" }, 0)]), "utf8");
  if (!transcriptDeLAgent({ transcript_path: session, agent_id: "a77" })?.endsWith("agent-a77.jsonl")) throw new Error("la transcription par identifiant n'est pas retrouvée");
  if (transcriptDeLAgent({ transcript_path: session, agent_id: "../x" }) !== null || transcriptDeLAgent({ transcript_path: session, agent_id: "a78" }) !== null) throw new Error("un identifiant inconnu ou piégé donne une transcription");
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ transcript_path: session, agent_id: "a77", cwd: PRODUIT }), env: { ...process.env, FORGE_HOOKS_JOURNAL: join(base, "j.jsonl") } });
  if (!/"decision":"block"/.test(r.stdout)) throw new Error(`refus attendu par l'identifiant : ${r.stdout.slice(0, 200)}`);
  for (const entree of [{ agent_transcript_path: join(base, "absente.jsonl") }, {}, "pas du json"]) {
    const s = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: typeof entree === "string" ? entree : JSON.stringify(entree), env: { ...process.env, FORGE_HOOKS_JOURNAL: join(base, "j.jsonl") } });
    if (s.status !== 0 || s.stdout.trim()) throw new Error(`${JSON.stringify(entree)} : exit ${s.status} sortie « ${s.stdout.slice(0, 100)} »`);
  }
});
check("le juge pur : jugerRemise rend FAIL avec le fichier et son motif (absente), SANS_OBJET sans fichier servi ; lireTranscript saute une ligne tronquée", () => {
  const e = lireTranscript(jsonl([...ecrit("Write", { file_path: PAGE, content: "x" }, 0)]) + "{ tronquée\n");
  const j = jugerRemise(e, { racine: PRODUIT });
  if (j.verdict !== "FAIL" || j.sans[0]?.motif !== "absente" || !j.servis.includes(PAGE)) throw new Error(JSON.stringify(j));
  if (jugerRemise([], { racine: PRODUIT }).verdict !== "SANS_OBJET") throw new Error("une transcription vide n'est pas SANS_OBJET");
});
check("câblage — le hook est au SubagentStop de `.claude/settings.json` du pilot", () => {
  const reglages = JSON.parse(readFileSync(join(ICI, "..", ".claude", "settings.json"), "utf8"));
  const commandes = (reglages.hooks?.SubagentStop || []).flatMap((g) => g.hooks || []).map((h) => String(h.command));
  if (!commandes.some((c) => /hook-remise-agent\.mjs/.test(c))) throw new Error("hook-remise-agent.mjs n'est pas au SubagentStop");
  if (!existsSync(HOOK)) throw new Error("hook absent");
});

rmSync(base, { recursive: true, force: true });
console.log(`\nhook-remise-agent : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
