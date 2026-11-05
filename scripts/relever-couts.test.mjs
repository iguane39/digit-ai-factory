#!/usr/bin/env node
/**
 * relever-couts.test.mjs — le relevé de fin de session jugé sur des transcriptions de synthèse (TF-2181, GO « A1 » du
 * 05/11/2026 ; charge lue par D-177, « A, b & c séparés »).
 *
 * Chaque règle a son cas : une réponse écrite sur 2 lignes compte une fois ; les sous-agents se comptent à part ; le
 * temps actif suit chacun des 3 seuils ; le temps humain borne l'écart au plafond et ne compte ni un résultat d'outil
 * ni un rappel injecté ; les interventions humaines se lisent au journal dans la fenêtre de la session ; une étape close
 * sans ouverture commence au jalon précédent ; une session inchangée n'est pas réécrite ; au pilot, la session marquée
 * sert son pseudonyme, la non marquée la Factory, et un nom réel est refusé ; la vue calcule le coût à la lecture et
 * dit « non calculable » quand un prix manque ; le palier long d'un modèle se compte à part ; le rattrapage saute la
 * session courante ; le hook écrit chez un produit et ne sort jamais en erreur.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { releverSession, ecrireReleve, rattraper, marquer, vue, lireJournal, lireReferentiel, coutModele, cible, poste, rattraperIci, dossierDuProjet } from "./relever-couts.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "..", "oracles", "hook-couts.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const egal = (a, b, quoi) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${quoi} : attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)}`); };
const base = mkdtempSync(join(tmpdir(), "relever-couts-"));
const REF = lireReferentiel();

const T0 = Date.parse("2026-11-05T10:00:00Z");
const ts = (s) => new Date(T0 + s * 1000).toISOString();
const humain = (s, texte = "question du porteur") => ({ type: "user", timestamp: ts(s), message: { role: "user", content: texte } });
const outil = (s) => ({ type: "user", timestamp: ts(s), message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } });
const reponse = (s, id, u, model = "claude-opus-5-5") => ({ type: "assistant", timestamp: ts(s), message: { id, model, usage: u } });
const U = (i, c, r, o, cc) => ({ input_tokens: i, cache_creation_input_tokens: c, cache_read_input_tokens: r, output_tokens: o, ...(cc ? { cache_creation: cc } : {}) });
const ecrire = (f, objets) => { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, objets.map((o) => JSON.stringify(o)).join("\n") + "\n", "utf8"); };

// Session de référence : 0 humain, 10 s réponse, 40 s outil, 440 s réponse, 1440 s humain, 1450 s réponse (2 lignes).
const dossier = join(base, "transcriptions");
const S1 = join(dossier, "S1.jsonl");
ecrire(S1, [
  humain(0),
  reponse(10, "m1", U(1, 100, 1000, 10, { ephemeral_5m_input_tokens: 40, ephemeral_1h_input_tokens: 60 })),
  outil(40),
  reponse(440, "m2", U(2, 0, 2000, 20)),
  { type: "user", timestamp: ts(445), message: { role: "user", content: "<system-reminder>rappel injecté</system-reminder>" } },
  humain(1445),
  reponse(1450, "m3", U(0, 0, 500, 5)),
  reponse(1452, "m3", U(0, 0, 500, 7)),
]);
ecrire(join(dossier, "S1", "subagents", "agent-a.jsonl"), [
  { type: "user", timestamp: ts(20), message: { role: "user", content: "consigne de l'agent" }, isSidechain: true },
  reponse(25, "s1", U(3, 30, 300, 3), "claude-sonnet-5-5"),
]);

check("1 une réponse écrite sur 2 lignes compte une fois, sur sa dernière ligne", () => {
  const r = releverSession(S1, { referentiel: REF });
  egal(r.jetons.principal, { input_tokens: 3, cache_creation_input_tokens: 100, cache_read_input_tokens: 3500, output_tokens: 37 }, "jetons principaux");
});
check("2 les sous-agents se comptent à part, et le total réunit les deux", () => {
  const r = releverSession(S1, { referentiel: REF });
  egal(r.sous_agents, 1, "sous-agents"); egal(r.jetons.sous_agents.output_tokens, 3, "sortie des sous-agents");
  egal(r.jetons.total, 3 + 100 + 3500 + 37 + 3 + 30 + 300 + 3, "total");
});
check("3 le temps actif suit chacun des 3 seuils du référentiel", () => {
  const r = releverSession(S1, { referentiel: REF });
  // écarts : 10, 30, 400, 5, 1000, 5, 2 → au seuil 24,85 : 22 ; au 11,723 : 22 ; au 296,172 : 52
  egal(r.temps_actif_s[24.85].session, 22, "seuil retenu"); egal(r.temps_actif_s[296.172].session, 52, "seuil haut");
});
check("4 le temps humain borne l'écart au plafond, sans résultat d'outil ni rappel injecté", () => {
  const r = releverSession(S1, { referentiel: REF });
  egal(r.charge.temps_humain_s, 894, "temps humain borné"); egal(r.charge.temps_humain_ecarts_bornes, 1, "écarts bornés");
  egal(r.charge.temps_agent_s, r.temps_actif_s[24.85].session + r.temps_actif_s[24.85].sous_agents, "temps agent");
});

const journalF = join(base, "ledger.jsonl");
ecrire(journalF, [
  { seq: 1, ts: ts(-5), type: "run_open", run: "R1" },
  { seq: 2, ts: ts(5), type: "etape_open", etape: "conception" },
  { seq: 3, ts: ts(100), type: "question_humain", question: "?" },
  { seq: 4, ts: ts(500), type: "etape_close", etape: "conception" },
  { seq: 5, ts: ts(1460), type: "etape_close", etape: "rendu" },
  { seq: 6, ts: ts(9999), type: "reponse_humain", reponse: "hors fenêtre" },
]);
check("5 interventions humaines lues au journal dans la fenêtre de la session seulement", () => {
  const r = releverSession(S1, { referentiel: REF, journal: lireJournal(journalF) });
  egal(r.charge.interventions_humaines, { questions: 1, reponses: 0 }, "interventions");
});
check("6 une étape close sans ouverture commence au jalon précédent (R4)", () => {
  const r = releverSession(S1, { referentiel: REF, journal: lireJournal(journalF) });
  const par = Object.fromEntries(r.par_etape.map((e) => [`${e.run}/${e.etape}`, e.jetons]));
  egal(par["R1/conception"], 1111 + 2022 + 336, "conception (m1, m2 et le sous-agent)");
  egal(par["R1/rendu"], 507, "rendu (m3, après la clôture de conception)");
});

const produit = join(base, "produit");
mkdirSync(join(produit, "forge"), { recursive: true });
writeFileSync(join(produit, "forge", "ledger.jsonl"), readFileSync(journalF, "utf8"), "utf8");
check("7 une session inchangée n'est pas réécrite ; un message de plus produit une nouvelle ligne", () => {
  const a = ecrireReleve(S1, { racine: produit, referentiel: REF });
  const b = ecrireReleve(S1, { racine: produit, referentiel: REF });
  if (!a.ecrit || b.ecrit) throw new Error(`1re écriture ${a.ecrit}, 2e ${b.ecrit} (${b.motif})`);
  appendFileSync(S1, JSON.stringify(reponse(1500, "m4", U(1, 0, 0, 1))) + "\n");
  const c = ecrireReleve(S1, { racine: produit, referentiel: REF });
  if (!c.ecrit) throw new Error("la session prolongée n'a pas été relevée");
  egal(readFileSync(cible(produit).sortie, "utf8").trim().split("\n").length, 2, "lignes écrites");
});

const pilot = join(base, "pilot");
for (const d of ["scripts", "todo/observabilite"]) mkdirSync(join(pilot, d), { recursive: true });
writeFileSync(join(pilot, "bootstrap.mjs"), "", "utf8");
writeFileSync(join(pilot, "scripts", "relever-couts.mjs"), "", "utf8");
check("8 au pilot, la session marquée sert son pseudonyme, la non marquée la Factory, un nom réel est refusé", () => {
  const S2 = join(dossier, "S2.jsonl");
  ecrire(S2, [humain(0), reponse(5, "x1", U(1, 0, 0, 1))]);
  marquer(pilot, "S1", "Produit-79");
  egal(ecrireReleve(S1, { racine: pilot, referentiel: REF }).releve.pour, "Produit-79", "session marquée");
  egal(ecrireReleve(S2, { racine: pilot, referentiel: REF }).releve.pour, "Factory", "session non marquée");
  let refuse = false; try { marquer(pilot, "S2", "MonClientReel"); } catch { refuse = true; }
  if (!refuse) throw new Error("un nom réel a été accepté comme marqueur");
  if (!existsSync(join(pilot, "todo", "observabilite", `couts-pilot-${poste()}.jsonl`))) throw new Error("relevé du pilot absent");
});
check("9 la vue calcule le coût à la lecture, et dit « non calculable » quand un prix manque", () => {
  const m = { entree: 1e6, ecriture_cache_5m: 0, ecriture_cache_1h: 1e6, ecriture_cache_sans_duree: 0, lecture_cache: 1e6, sortie: 1e6 };
  egal(coutModele("claude-opus-5-5", m, REF), 4 + 8 + 0.2 + 20, "coût d'un million par catégorie");
  egal(coutModele("modele-inconnu", m, REF), null, "modèle sans prix");
  egal(coutModele("<synthetic>", { entree: 0, ecriture_cache_5m: 0, ecriture_cache_1h: 0, ecriture_cache_sans_duree: 0, lecture_cache: 0, sortie: 0 }, REF), 0, "bloc sans jeton");
  const f = join(base, "vue.jsonl");
  const r = releverSession(S1, { referentiel: REF });
  writeFileSync(f, JSON.stringify({ ...r, modeles: { "claude-opus-5-5": m } }) + "\n" + JSON.stringify({ ...r, sessionId: "S9", modeles: { "modele-inconnu": m } }) + "\n", "utf8");
  const v = vue(f, REF);
  if (v.cout_equivalent_usd !== null || !v.modeles_non_calculables.includes("modele-inconnu") || v.cout_partiel_usd !== 32.2) throw new Error(JSON.stringify(v).slice(0, 300));
});
check("10 le palier long d'un modèle se compte à part et prend son prix", () => {
  const S3 = join(dossier, "S3.jsonl");
  ecrire(S3, [humain(0), reponse(5, "h1", U(10, 0, 200000, 10), "claude-haiku-5-5"), reponse(9, "h2", U(10, 0, 10, 10), "claude-haiku-5-5")]);
  const r = releverSession(S3, { referentiel: REF });
  if (!r.modeles["claude-haiku-5-5>100000"] || !r.modeles["claude-haiku-5-5"]) throw new Error(Object.keys(r.modeles).join(", "));
  egal(coutModele("claude-haiku-5-5>100000", r.modeles["claude-haiku-5-5>100000"], REF) > coutModele("claude-haiku-5-5", r.modeles["claude-haiku-5-5>100000"], REF), true, "palier long plus cher");
});
check("11 le rattrapage relève les sessions sans relevé, saute la session courante et celles à jour", () => {
  const prod2 = join(base, "produit2"); mkdirSync(join(prod2, "forge"), { recursive: true });
  const b1 = rattraper(dossier, { racine: prod2, sauf: "S3", referentiel: REF });
  const ids = readFileSync(cible(prod2).sortie, "utf8").trim().split("\n").map((l) => JSON.parse(l).sessionId);
  if (ids.includes("S3") || !ids.includes("S1") || !ids.includes("S2")) throw new Error(`relevées : ${ids}`);
  const b2 = rattraper(dossier, { racine: prod2, sauf: "S3", referentiel: REF });
  egal([b1.ecrites, b2.ecrites], [2, 0], "écritures au 1er et au 2e rattrapage");
});
check("13 un fichier par poste : 2 postes n'écrivent jamais le même fichier, et la vue d'un dossier les lit tous", () => {
  egal(poste("DESKTOP ULTRA/7"), "DESKTOP-ULTRA-7", "nom de poste nettoyé");
  const prod4 = join(base, "produit4"); mkdirSync(join(prod4, "forge"), { recursive: true });
  if (cible(prod4, "A").sortie === cible(prod4, "B").sortie) throw new Error("même fichier pour 2 postes");
  const r = releverSession(S1, { referentiel: REF });
  writeFileSync(cible(prod4, "A").sortie, JSON.stringify(r) + "\n", "utf8");
  writeFileSync(cible(prod4, "B").sortie, JSON.stringify({ ...r, sessionId: "S-B" }) + "\n", "utf8");
  egal(vue(join(prod4, "forge"), REF).sessions, 2, "sessions lues sur les 2 postes");
});
check("14 --ici trouve les transcriptions du projet dans chaque profil du poste, par le nom encodé de son chemin", () => {
  const prod5 = join(base, "Mon.Produit 5"); mkdirSync(join(prod5, "forge"), { recursive: true });
  const maison = join(base, "maison");
  const enc = dossierDuProjet(prod5);
  for (const [p, id] of [[".claude", "A1"], [".claude-b", "B1"]]) ecrire(join(maison, p, "projects", enc.toUpperCase().slice(0, 1) + enc.slice(1), `${id}.jsonl`), [humain(0), reponse(5, id, U(1, 0, 0, 1))]);
  ecrire(join(maison, ".claude", "projects", "un-autre-projet", "X1.jsonl"), [humain(0), reponse(5, "x", U(1, 0, 0, 1))]);
  const b = rattraperIci(prod5, { maison, referentiel: REF });
  const ids = readFileSync(cible(prod5).sortie, "utf8").trim().split("\n").map((l) => JSON.parse(l).sessionId).sort();
  egal([b.dossiers, ids], [2, ["A1", "B1"]], "dossiers et sessions relevés");
  // Une sortie nommée est respectée : un essai depuis le pilot n'écrit rien chez le produit (incident du 05/11/2026).
  const prod6 = join(base, "Mon.Produit 6"); mkdirSync(join(prod6, "forge"), { recursive: true });
  for (const p of [".claude", ".claude-b"]) ecrire(join(maison, p, "projects", dossierDuProjet(prod6), "C1.jsonl"), [humain(0), reponse(5, "c1", U(1, 0, 0, 1))]);
  const ailleurs = join(base, "essai-ici.jsonl");
  rattraperIci(prod6, { maison, sortie: ailleurs, referentiel: REF });
  if (existsSync(cible(prod6).sortie) || !existsSync(ailleurs)) throw new Error("la sortie nommée n'a pas été respectée");
});
check("12 le hook écrit chez un produit à la fin de session, et sort en 0 sur une entrée illisible", () => {
  const prod3 = join(base, "produit3"); mkdirSync(join(prod3, "forge"), { recursive: true }); mkdirSync(join(prod3, ".git"));
  const env = { ...process.env, CLAUDE_PROJECT_DIR: prod3 };
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", env, input: JSON.stringify({ session_id: "S1", transcript_path: S1, cwd: prod3 }) });
  if (r.status !== 0 || !existsSync(cible(prod3).sortie)) throw new Error(`exit ${r.status} ${r.stderr}`);
  const mauvais = spawnSync(process.execPath, [HOOK], { encoding: "utf8", env, input: "pas du JSON" });
  egal(mauvais.status, 0, "exit sur entrée illisible");
  const ratt = spawnSync(process.execPath, [HOOK, "--rattraper"], { encoding: "utf8", env, input: JSON.stringify({ session_id: "S1", transcript_path: S1, cwd: prod3 }) });
  egal(ratt.status, 0, "exit du rattrapage");
});

try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ }
console.log(`\nrelever-couts : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
