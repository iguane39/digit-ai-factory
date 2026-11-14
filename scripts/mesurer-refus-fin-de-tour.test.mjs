#!/usr/bin/env node
/**
 * mesurer-refus-fin-de-tour.test.mjs — le relevé des refus du hook de fin de tour, dans les deux sens (TF-1947,
 * action A-1 du 05/11/2026).
 *   VERT  : un refus de chaque forme est classé ; un refus de sous-agent compte et se dit ; le rythme se rend
 *           par 7 jours ;
 *   ROUGE : un refus écrit deux fois, un refus hors période, un hook bloquant d'un autre événement et un refus
 *           sans règle nommée ne comptent pas ;
 *   BORNES : sans --depuis, ou avec une option inconnue, exit 2 ; minuit de Paris suit l'heure d'hiver et d'été.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { executer, formeDuRefus, minuitParis } from "./mesurer-refus-fin-de-tour.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const T = mkdtempSync(join(tmpdir(), "refus-fin-de-tour-"));
const tete = "[hook restitution — R-44] oracle-synthese FAIL BLOQUANT sur ta réponse finale :\nJugé parce que : ";
const refus = (id, ts, raison, regles = "S1 — bloc(s) absent(s).\nS4 — décision sans options.", evenement = "Stop") =>
  JSON.stringify({ type: "attachment", timestamp: ts, attachment: { type: "hook_blocking_error", hookEvent: evenement, hookName: evenement, toolUseID: id, blockingError: { blockingError: `${tete}${raison}\n${regles}` } } });
const P = join(T, "projects", "c--dev-produit");
mkdirSync(join(P, "s1", "subagents"), { recursive: true });
writeFileSync(join(P, "s1.jsonl"), [
  refus("a", "2026-11-06T10:00:00.000Z", "tour de travail (2 écriture(s), 3 commande(s))."),
  refus("a", "2026-11-06T10:00:00.000Z", "tour de travail (2 écriture(s), 3 commande(s))."),
  refus("b", "2026-11-06T11:00:00.000Z", "message portant un VERDICT (40 mots, sans écriture)."),
  refus("c", "2026-11-07T09:00:00.000Z", "message portant un VERDICT (319 mots, sans écriture)."),
  refus("d", "2026-11-07T10:00:00.000Z", "message de 120 mots rendu sans écriture."),
  refus("e", "2026-11-08T10:00:00.000Z", "message de 400 mots rendu sans écriture."),
  refus("f", "2026-11-08T11:00:00.000Z", "autre chose."),
  refus("g", "2026-11-01T10:00:00.000Z", "tour de travail (1 écriture(s))."),
  refus("h", "2026-11-08T12:00:00.000Z", "tour de travail.", "S1 — bloc absent.", "PreToolUse"),
  refus("i", "2026-11-08T13:00:00.000Z", "tour de travail.", "aucune règle nommée en tête de ligne, S3 cité dans la phrase"),
  "{ ligne illisible",
].join("\n") + "\n");
writeFileSync(join(P, "s1", "subagents", "agent-0.jsonl"), refus("j", "2026-11-09T10:00:00.000Z", "tour de travail (1 écriture(s)).") + "\n");
const jouer = (...x) => executer(["--transcripts", P, "--depuis", "2026-11-05", "--jusqu-au", "2026-11-12", "--json", ...x]);

check("vert — chaque forme est classée, le sous-agent compte, le rythme se rend par 7 jours", () => {
  const r = jouer();
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie}`);
  const j = JSON.parse(r.sortie);
  const attendu = { tour_ecrit: 2, verdict_court: 1, verdict_long: 1, sans_ecriture_court: 1, sans_ecriture_long: 1, autre: 1 };
  if (JSON.stringify(j.par_forme, Object.keys(attendu)) !== JSON.stringify(attendu)) throw new Error(`par forme : ${JSON.stringify(j.par_forme)}`);
  if (j.refus !== 7 || j.sous_agents !== 1 || j.jours !== 7 || j.par_semaine !== 7) throw new Error(`refus ${j.refus}, sous-agents ${j.sous_agents}, jours ${j.jours}, rythme ${j.par_semaine}`);
  if (j.ecart_a_la_reference !== 7 - 78 || j.par_regle.S1 !== 7) throw new Error(`écart ${j.ecart_a_la_reference}, S1 ${j.par_regle.S1}`);
});

check("rouge — doublon, hors période, autre événement et refus sans règle nommée ne comptent pas", () => {
  const j = JSON.parse(jouer().sortie);
  if (j.par_jour["2026-11-01"] || j.refus !== 7) throw new Error(`par jour : ${JSON.stringify(j.par_jour)}`);
  if (formeDuRefus(`${tete}message portant un VERDICT (250 mots`) !== "verdict_court" || formeDuRefus(`${tete}message portant un VERDICT (251 mots`) !== "verdict_long") throw new Error("seuil de 250 mots mal placé");
});

check("bornes — --depuis requis, option inconnue et date mal formée en exit 2 ; minuit de Paris en hiver et en été", () => {
  if (executer(["--transcripts", P]).code !== 2) throw new Error("sans --depuis : exit attendu 2");
  if (executer(["--depuis", "2026-11-05", "--inconnue"]).code !== 2) throw new Error("option inconnue : exit attendu 2");
  if (executer(["--depuis", "05/11/2026"]).code !== 2) throw new Error("date mal formée : exit attendu 2");
  if (minuitParis("2026-11-05") !== "2026-11-04T23:00:00.000Z" || minuitParis("2026-07-01") !== "2026-06-30T22:00:00.000Z") throw new Error(`minuit : ${minuitParis("2026-11-05")}, ${minuitParis("2026-07-01")}`);
});

console.log(`\nRecette mesurer-refus-fin-de-tour (TF-1947, A-1) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
