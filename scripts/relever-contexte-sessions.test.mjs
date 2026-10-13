#!/usr/bin/env node
/**
 * relever-contexte-sessions.test.mjs — le relevé du contexte relu par tour, dans les deux sens (TF-1558).
 *   VERT  : une session courte, sous le seuil, rend PASS ; une réponse répétée sur plusieurs lignes (même
 *           `message.id`) ne se compte qu'une fois ; un résultat d'outil et un retour de hook n'ouvrent pas de tour ;
 *   ROUGE : une session qui franchit le seuil est NOMMÉE (AVERT), jamais un échec (exit 0) ;
 *   BORNES : le seuil se lit au référentiel ; une option inconnue rend 2.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { lireTranscription, executer } from "./relever-contexte-sessions.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const humain = (t) => JSON.stringify({ type: "user", message: { role: "user", content: t } });
const outil = () => JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } });
const hook = () => JSON.stringify({ type: "user", message: { role: "user", content: "Stop hook feedback: S1 — bloc absent" } });
const reponse = (id, lu, effort = "high") => JSON.stringify({ type: "assistant", effort, message: { id, model: "claude-opus-5-5", role: "assistant", content: [{ type: "text", text: "x" }], usage: { input_tokens: 2, cache_read_input_tokens: lu, cache_creation_input_tokens: 1000, output_tokens: 50 } } });

const T = mkdtempSync(join(tmpdir(), "contexte-"));
try {
  const courte = [humain("fais A"), reponse("m1", 60000), outil(), reponse("m2", 70000), reponse("m2", 70000), hook(), reponse("m3", 71000), humain("fais B"), reponse("m4", 80000)].join("\n");
  const longue = [humain("mandat 1"), reponse("n1", 60000), humain("mandat 2"), reponse("n2", 450000, "max"), outil(), reponse("n3", 900000, "max")].join("\n");
  const projet = join(T, "projects", "c--dev-pilot");
  mkdirSync(join(projet, "aaaaaaaa-1", "subagents"), { recursive: true });
  writeFileSync(join(projet, "aaaaaaaa-1.jsonl"), courte + "\n");
  writeFileSync(join(projet, "bbbbbbbb-2.jsonl"), longue + "\n");
  writeFileSync(join(projet, "aaaaaaaa-1", "subagents", "agent-x.jsonl"), [humain("tâche"), reponse("s1", 500000)].join("\n") + "\n");
  const ref = join(T, "ref.json");
  writeFileSync(ref, JSON.stringify({ sessions: { seuil_contexte_jetons: 400000 } }));

  check("vert : réponse dédoublonnée par message.id, résultat d'outil et retour de hook n'ouvrent pas de tour", () => {
    const lu = lireTranscription(courte);
    if (lu.reponses.length !== 4) throw new Error(`${lu.reponses.length} réponses au lieu de 4`);
    if (lu.tours !== 2) throw new Error(`${lu.tours} tours au lieu de 2`);
    if (lu.reponses[0].contexte !== 61002) throw new Error(`contexte ${lu.reponses[0].contexte} au lieu de 61002 (entrée + cache lu + cache écrit)`);
  });
  check("vert : une session sous le seuil rend PASS", () => {
    const r = executer(["--transcripts", projet, "--referentiel", ref, "--seuil", "2000000"]).rapport;
    if (r.ensemble.verdict !== "PASS") throw new Error(r.ensemble.verdict);
  });
  check("rouge : la session qui franchit le seuil du référentiel est nommée (AVERT), l'autre non ; sous-agent compté à part", () => {
    const { code, rapport: r } = executer(["--transcripts", projet, "--referentiel", ref]);
    if (code !== 0) throw new Error(`exit ${code}`);
    if (r.ensemble.verdict !== "AVERT" || r.ensemble.sessions_au_dela_du_seuil !== 1) throw new Error(JSON.stringify(r.ensemble));
    if (r.seuil_provenance !== "référentiel") throw new Error(r.seuil_provenance);
    const s = r.sessions.find((x) => x.session.endsWith("bbbbbbbb"));
    if (!s || s.reponses_au_dela_du_seuil !== 2 || s.efforts.max !== 2) throw new Error(JSON.stringify(s));
    if (r.sous_agents.nombre !== 1 || r.sous_agents.au_dela_du_seuil !== 1) throw new Error(JSON.stringify(r.sous_agents));
  });
  check("rouge de bout en bout : la ligne de commande nomme la session au-delà, exit 0", () => {
    const c = spawnSync(process.execPath, [join(ICI, "relever-contexte-sessions.mjs"), "--transcripts", projet, "--referentiel", ref], { encoding: "utf8" });
    if (c.status !== 0 || !/\[AVERT\] c--dev-pilot\/bbbbbbbb/.test(c.stdout)) throw new Error(`exit ${c.status} : ${c.stdout}`);
  });
  check("borne : une option inconnue rend 2", () => {
    if (executer(["--inconnue"]).code !== 2) throw new Error("pas 2");
  });
} finally { rmSync(T, { recursive: true, force: true }); }
console.log(`\nrelever-contexte-sessions (TF-1558) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
