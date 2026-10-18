#!/usr/bin/env node
/**
 * relever-flotte.test.mjs — le relevé de la flotte d'agents, dans les deux sens (D-19 (a), 18/10/2026).
 *   VERT  : une délégation vers un agent nommé et une dérogation dite (model ET effort) tiennent le critère de
 *           part nommée ; un modèle courant n'est pas « hors génération », pas plus qu'une ancienne version servie
 *           AVANT la date où la suivante est devenue courante ; une réponse écrite sur plusieurs lignes (même
 *           `message.id`) ne compte ses jetons qu'une fois, sur sa dernière ligne ;
 *   ROUGE : la forme mesurée le 18/10 (agent générique sans modèle ni effort) est HORS FLOTTE et fait tomber le
 *           critère ; une session servie par une version dépassée (le juge sur Opus 4.6) est nommée ; AVERT, exit 0 ;
 *   BORNES : `--journal` ajoute exactement une ligne ; une option inconnue rend 2.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { executer, classerAppel, estHorsGeneration } from "./relever-flotte.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const T = mkdtempSync(join(tmpdir(), "flotte-"));
const REF = join(T, "MODELES.json");
writeFileSync(REF, JSON.stringify({ generation_courante: {
  opus: { identifiant: "claude-opus-5-5", courante_depuis: "2026-09-23" },
  sonnet: { identifiant: "claude-sonnet-5-5", courante_depuis: "2026-10-03" },
  haiku: { identifiant: "claude-haiku-4-5", courante_depuis: "2026-08-10" } } }));
const ts = "2026-10-15T10:00:00.000Z";
const appel = (id, input) => JSON.stringify({ type: "assistant", timestamp: ts, message: { id, model: "claude-opus-5-5", usage: { output_tokens: 10, cache_read_input_tokens: 1000 }, content: [{ type: "tool_use", name: "Agent", input }] } });
const reponse = (id, model, sortie, relus, quand = ts) => JSON.stringify({ type: "assistant", timestamp: quand, effort: "high", message: { id, model, usage: { output_tokens: sortie, cache_read_input_tokens: relus, input_tokens: 5, cache_creation_input_tokens: 100 }, content: [{ type: "text", text: "x" }] } });

function projet(nom, sessionLignes, sousAgents = []) {
  const d = join(T, "projects", nom);
  mkdirSync(join(d, "s1", "subagents"), { recursive: true });
  writeFileSync(join(d, "s1.jsonl"), sessionLignes.join("\n") + "\n");
  sousAgents.forEach(([lignes, meta], i) => {
    writeFileSync(join(d, "s1", "subagents", `agent-${i}.jsonl`), lignes.join("\n") + "\n");
    writeFileSync(join(d, "s1", "subagents", `agent-${i}.meta.json`), JSON.stringify(meta));
  });
  return d;
}
const lancer = (dossier, ...extra) => executer(["--transcripts", dossier, "--depuis", "2026-10-01", "--referentiel", REF, "--json", ...extra]);

try {
  check("classement : agent nommé, dérogation dite, hors flotte", () => {
    const c = [classerAppel({ subagent_type: "campagne" }), classerAppel({ subagent_type: "general-purpose", model: "sonnet", effort: "medium" }),
      classerAppel({ subagent_type: "general-purpose" }), classerAppel({}), classerAppel({ subagent_type: "Explore", model: "haiku" }),
      classerAppel({ subagent_type: "claude" })];
    if (c.join() !== "nomme,derogation,hors_flotte,hors_flotte,hors_flotte,hors_flotte") throw new Error(c.join());
  });
  check("génération : Opus 5 servi avant le 23/09 est courant, après il ne l'est plus ; un suffixe ne change rien", () => {
    const g = new Map([["opus", { identifiant: "claude-opus-5-5", depuis: "2026-09-23" }], ["haiku", { identifiant: "claude-haiku-4-5", depuis: "2026-08-10" }]]);
    if (estHorsGeneration("claude-opus-5", "2026-09-20T00:00:00Z", g)) throw new Error("Opus 5 le 20/09 compté hors génération");
    if (!estHorsGeneration("claude-opus-5", "2026-10-17T00:00:00Z", g)) throw new Error("Opus 5 le 17/10 non compté");
    if (estHorsGeneration("claude-opus-5-5[1m]", "2026-10-17T00:00:00Z", g)) throw new Error("suffixe [1m] compté");
    if (estHorsGeneration("claude-haiku-4-5-20251001", "2026-10-17T00:00:00Z", g)) throw new Error("suffixe de date compté");
  });

  const vert = projet("vert", [appel("a1", { subagent_type: "campagne", prompt: "x" }), appel("a2", { subagent_type: "general-purpose", model: "sonnet", effort: "medium", prompt: "y" })],
    [[[reponse("m1", "claude-sonnet-5-5", 8, 50000), reponse("m1", "claude-sonnet-5-5", 300, 50000), reponse("m2", "claude-sonnet-5-5", 200, 60000)], { agentType: "campagne" }]]);
  check("vert — agent nommé et dérogation dite : rien hors flotte, aucune délégation Opus sans effort", () => {
    const r = lancer(vert).rapport;
    if (r.indicateurs.appels !== 2 || r.indicateurs.appels_hors_flotte !== 0) throw new Error(JSON.stringify(r.indicateurs));
    if (r.indicateurs.part_nommee !== 0.5) throw new Error(`part nommée ${r.indicateurs.part_nommee}, attendu 0,5 : la dérogation dite n'est pas un agent nommé`);
    if (r.criteres[1].tenu !== true || r.criteres[2].tenu !== true) throw new Error(JSON.stringify(r.criteres));
  });
  check("vert — une réponse sur plusieurs lignes compte ses jetons une fois, sur sa dernière ligne", () => {
    const I = lancer(vert).rapport.indicateurs;
    if (I.jetons_sortie_sous_agents !== 500) throw new Error(`sortie ${I.jetons_sortie_sous_agents}, attendu 300 + 200 = 500`);
    if (I.jetons_relus_sous_agents !== 110000) throw new Error(`relus ${I.jetons_relus_sous_agents}, attendu 50 000 + 60 000`);
  });

  const rouge = projet("rouge", [appel("b1", { subagent_type: "general-purpose", prompt: "x" }), appel("b2", { prompt: "y" }), reponse("j1", "claude-opus-4-6", 5, 100)],
    [[[reponse("n1", "claude-opus-5-5", 50, 9000)], { agentType: "general-purpose" }]]);
  check("rouge — la forme du 18/10 (générique sans modèle ni effort) : hors flotte, critères NON tenus, AVERT, exit 0", () => {
    const r = lancer(rouge);
    if (r.code !== 0) throw new Error(`exit ${r.code}`);
    const I = r.rapport.indicateurs;
    if (I.appels_hors_flotte !== 2 || I.delegations_opus_sans_effort !== 2) throw new Error(JSON.stringify(I));
    if (r.rapport.verdict !== "AVERT" || r.rapport.criteres[0].tenu !== false || r.rapport.criteres[1].tenu !== false) throw new Error(JSON.stringify(r.rapport.criteres));
  });
  check("rouge — une session servie par Opus 4.6 est nommée hors génération", () => {
    const I = lancer(rouge).rapport.indicateurs;
    if (I.reponses_hors_generation !== 1 || !I.hors_generation_par_modele["claude-opus-4-6 (session)"]) throw new Error(JSON.stringify(I.hors_generation_par_modele));
  });
  check("bornes — --journal ajoute exactement une ligne datée et étiquetée", () => {
    const j = join(T, "journal.jsonl");
    lancer(vert, "--journal", j, "--etiquette", "campagne-test");
    lancer(vert, "--journal", j);
    const l = readFileSync(j, "utf8").trim().split("\n").map((x) => JSON.parse(x));
    if (l.length !== 2 || l[0].etiquette !== "campagne-test" || !l[0].ts || l[0].indicateurs.appels !== 2) throw new Error(JSON.stringify(l[0]).slice(0, 200));
  });
  check("bornes — une option inconnue rend 2", () => {
    if (executer(["--inconnue"]).code !== 2) throw new Error("code attendu 2");
    if (executer(["--depuis", "hier"]).code !== 2) throw new Error("date invalide acceptée");
  });
} finally {
  rmSync(T, { recursive: true, force: true });
}
console.log(`\nrelever-flotte : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
