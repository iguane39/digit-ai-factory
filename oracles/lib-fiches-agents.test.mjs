#!/usr/bin/env node
/**
 * lib-fiches-agents.test.mjs — la fiche d'exécution d'un agent (D-219 (e) du 15/11/2026, TF-2563, mandat 20261115b, lot L1).
 *
 * Fixtures à double sens, toutes écrites sous le dossier temporaire, tables de pseudonymes jetables comprises :
 *   · un agent FINI : les 15 clés, les mesures exactes (une réponse comptée une fois, sur sa dernière ligne : la somme ligne à ligne,
 *     rouge, donnerait 615 jetons de sortie au lieu de 607) et la cause `fini` ;
 *   · un agent ABANDONNÉ (fin sur un appel d'outil, interruption), en ERREUR (erreur d'API, limite de sortie), en TIMEOUT : jamais `fini` ;
 *   · le dernier message du hook prime sur une transcription en retard : `fini` avec lui, `abandonne` sans lui ;
 *   · une transcription ILLISIBLE (absente, faite de lignes cassées, partiellement lisible, dossier à la place du fichier) : une fiche
 *     partielle dont les lacunes le disent, jamais une exception ;
 *   · un produit SANS PSEUDONYME CONNU : table absente (projet null), produit inconnu de la table (inscrit sous un Produit-NN neuf),
 *     pseudonyme rendu qui serait le nom réel (refusé) ; le nom réel n'entre jamais dans la ligne ; un arbre lié prend le nom de son
 *     arbre principal ; le pilot garde son nom public ;
 *   · aucun contenu de consigne ni de livrable, aucun chemin, aucune description d'agent dans la ligne écrite ;
 *   · les frictions : un refus de hook compte, une correction qui suit la consigne compte, le vocabulaire de la consigne ne compte pas ;
 *   · l'écriture en ajout seul, la destination (pilot, produit, ailleurs, variable), l'agent interne du harnais, la panne de construction.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = mkdtempSync(join(tmpdir(), "fiches-agents-"));
// Tables JETABLES avant tout appel : un banc n'étend jamais le référentiel réel (anonymiser-entrant.mjs, 08/09/2026).
const TABLE_CLIENTS = join(base, "_noms-interdits.json");
const TABLE_PRODUITS = join(base, "_produits-pseudonymes.json");
writeFileSync(TABLE_CLIENTS, JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
writeFileSync(TABLE_PRODUITS, JSON.stringify({ produits: { "produit-connu-fictif": "Produit-41" } }), "utf8");
process.env.FORGE_NOMS_INTERDITS = TABLE_CLIENTS;
process.env.FORGE_PRODUITS_PSEUDO = TABLE_PRODUITS;

const L = await import("./lib-fiches-agents.mjs");
const { CHAMPS, SCHEMA, causeFin, cheminFiches, construireFiche, ecrireFiche, lireEntrees, mesurer, projetDe, traiterFinDAgent, typeDe } = L;

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (cond, msg) => { if (!cond) throw new Error(msg); };

// ---- FIXTURES ---------------------------------------------------------------------------------------------------------------------
const T0 = Date.parse("2026-11-15T08:00:00Z");
const iso = (s) => new Date(T0 + s * 1000).toISOString();
const U = (entree, ecrit, relu, sortie) => ({ input_tokens: entree, cache_creation_input_tokens: ecrit, cache_read_input_tokens: relu, output_tokens: sortie });
const consigne = (texte, s = 0) => ({ parentUuid: null, isSidechain: true, type: "user", timestamp: iso(s), message: { role: "user", content: texte } });
const reponse = (contenu, s, { id, usage = U(1, 0, 0, 1), model = "claude-opus-5-5", effort = "high", stop = "end_turn", extra = {} } = {}) =>
  ({ isSidechain: true, type: "assistant", timestamp: iso(s), effort, message: { id, model, role: "assistant", type: "message", content: contenu, stop_reason: stop, usage }, ...extra });
const texte = (t) => ({ type: "text", text: t });
const outil = (name, input, id) => ({ type: "tool_use", id, name, input });
const resultat = (id, contenu, s) => ({ isSidechain: true, type: "user", timestamp: iso(s), message: { role: "user", content: [{ type: "tool_result", tool_use_id: id, content: contenu }] } });
const humain = (t, s) => ({ isSidechain: true, type: "user", timestamp: iso(s), message: { role: "user", content: [{ type: "text", text: t }] } });
const erreurApi = (t, s, { error = "server_error", statut = 500 } = {}) => ({ isSidechain: true, type: "assistant", timestamp: iso(s), isApiErrorMessage: true, error, apiErrorStatus: statut,
  message: { id: `err-${s}`, model: "<synthetic>", role: "assistant", type: "message", content: [texte(t)], stop_reason: "stop_sequence", usage: U(0, 0, 0, 0) } });
const REQUETE = '{"type":"api-request-blob","sessionId":"S","message":{"content":"LIVRABLE-SECRET-9Z C:/dev/produit-fictif-reel"}}';

/** L'agent FINI : une lecture, puis un rapport écrit sur DEUX lignes d'une même réponse (pensée, puis texte). */
const FINI = () => [
  consigne("CONSIGNE-SECRETE-7Q : lis C:/dev/produit-fictif-reel/src/a.py. Non, ne modifie rien, c'est faux de toucher au code.", 0),
  reponse([texte("Je lis le fichier."), outil("Read", { file_path: "C:/dev/produit-fictif-reel/src/a.py" }, "toolu_A")], 5, { id: "msg_1", stop: "tool_use", usage: U(10, 100, 1000, 50) }),
  resultat("toolu_A", "contenu LIVRABLE-SECRET-9Z de C:/dev/produit-fictif-reel", 6),
  reponse([{ type: "thinking", thinking: "LIVRABLE-SECRET-9Z" }], 60, { id: "msg_2", stop: null, usage: U(2, 0, 2000, 8) }),
  reponse([texte("Rapport final : LIVRABLE-SECRET-9Z est lu dans C:/dev/produit-fictif-reel.")], 65, { id: "msg_2", stop: "end_turn", usage: U(2, 0, 2000, 557) }),
];

let numero = 0;
/** Écrit la transcription d'un agent comme le harnais la range (`<session>/subagents/agent-<id>.jsonl`, `.meta.json` à côté). */
function transcription(entrees, { brutes = [], meta = { agentType: "explorateur", description: "DESCRIPTION-SECRETE produit-fictif-reel" }, id = `a${++numero}` } = {}) {
  const dossier = join(base, "sessions", "f00dcafe-0000-4000-8000-000000000000", "subagents");
  mkdirSync(dossier, { recursive: true });
  const chemin = join(dossier, `agent-${id}.jsonl`);
  const lignes = entrees.map((e) => JSON.stringify(e));
  lignes.splice(1, 0, ...brutes);
  writeFileSync(chemin, lignes.join("\n") + "\n", "utf8");
  if (meta) writeFileSync(join(dossier, `agent-${id}.meta.json`), JSON.stringify(meta), "utf8");
  return { chemin, id };
}
const entreeDe = (t, plus = {}) => ({ hook_event_name: "SubagentStop", session_id: "f00dcafe-0000-4000-8000-000000000000", agent_id: t.id, agent_type: "explorateur",
  agent_transcript_path: t.chemin, cwd: join(base, "produit-connu-fictif"), stop_hook_active: false, ...plus });
function racineFictive(nom, { pilot = false } = {}) {
  const r = join(base, nom);
  mkdirSync(pilot ? join(r, "oracles") : join(r, "forge"), { recursive: true });
  if (pilot) { writeFileSync(join(r, "bootstrap.mjs"), "", "utf8"); writeFileSync(join(r, "oracles", "hook-restitution.mjs"), "", "utf8"); }
  return r;
}
const PRODUIT = racineFictive("produit-connu-fictif");
const fiche = (entrees, plus = {}, opts = {}) => construireFiche(entreeDe(transcription(entrees, opts.t), plus), { racine: PRODUIT, env: {}, ...opts.c });
const SECRETS = ["CONSIGNE-SECRETE-7Q", "LIVRABLE-SECRET-9Z", "DESCRIPTION-SECRETE", "produit-fictif-reel", "C:/dev", "C:\\\\dev", "subagents", "agent-a"];

// ---- LA FICHE D'UN AGENT FINI ------------------------------------------------------------------------------------------------------
check("vert — agent fini : les 15 clés de l'étude dans l'ordre, et rien d'autre que schema, session_source, partielle et lacunes", () => {
  const f = fiche(FINI(), {}, { t: { brutes: [REQUETE] } });
  const cles = Object.keys(f);
  att(JSON.stringify(cles) === JSON.stringify(["schema", ...CHAMPS.slice(0, 2), "session_source", ...CHAMPS.slice(2), "partielle", "lacunes"]), cles.join(","));
  att(CHAMPS.length === 15 && f.schema === SCHEMA, `${CHAMPS.length} champs`);
});
check("vert — agent fini : mesures exactes (durée 65 s, 1 appel d'outil, 3 112 jetons d'entrée, 607 de sortie, modèle et effort servis, 0 friction)", () => {
  const f = fiche(FINI(), {}, { t: { brutes: [REQUETE] } });
  att(f.cause_fin === "fini" && f.duree_s === 65 && f.appels_outils === 1, JSON.stringify(f));
  att(f.jetons_entree === 3112 && f.jetons_sortie === 607, `entrée ${f.jetons_entree}, sortie ${f.jetons_sortie}`);
  att(f.modele === "claude-opus-5-5" && f.effort === "high" && f.frictions === 0 && f.type === "explorateur", JSON.stringify(f));
  att(f.session === "f00dcafe" && f.session_source === "hook" && f.projet === "Produit-41" && f.partielle === false && f.lacunes.length === 0, JSON.stringify(f));
  att(f.verdict_livrable === null && f.verdict_relecture === null, "les verdicts ne se notent pas ici");
});
check("rouge — sommer les lignes d'une même réponse surcompte (615 et 5 114) : la fiche compte la réponse une fois, sur sa dernière ligne", () => {
  const somme = FINI().filter((e) => e.type === "assistant").reduce((s, e) => s + e.message.usage.output_tokens, 0);
  att(somme === 615, `fixture : ${somme}`);
  att(mesurer(FINI()).jetons_sortie === 607 && mesurer(FINI()).jetons_entree === 3112, JSON.stringify(mesurer(FINI())));
});
check("rouge — aucun contenu de consigne ni de livrable, aucun chemin, aucune description dans la ligne écrite", () => {
  const dest = join(base, "secrets.jsonl");
  const r = traiterFinDAgent(entreeDe(transcription(FINI(), { brutes: [REQUETE] }), { last_assistant_message: "Rapport final : LIVRABLE-SECRET-9Z" }), { env: { FORGE_FICHES_AGENTS: dest } });
  att(r.ecrit === true, JSON.stringify(r));
  const ligne = readFileSync(dest, "utf8");
  const fuites = SECRETS.filter((s) => ligne.includes(s));
  att(!fuites.length, `fuite : ${fuites.join(", ")} dans ${ligne}`);
});
check("vert — les lignes de requête au modèle (api-request*) sont sautées sans compter comme illisibles", () => {
  const { entrees, illisibles } = lireEntrees([REQUETE, JSON.stringify(FINI()[0]), "", "  "].join("\n"));
  att(entrees.length === 1 && illisibles === 0, `${entrees.length} entrées, ${illisibles} illisibles`);
});

// ---- LA CAUSE DE FIN --------------------------------------------------------------------------------------------------------------
const debut = () => FINI().slice(0, 3);
check("rouge — fin sur un appel d'outil sans résultat : abandonne, jamais fini", () => {
  const c = causeFin([...debut(), reponse([texte("Je lance la recette."), outil("Bash", { command: "npm test" }, "toolu_B")], 70, { id: "m3", stop: "tool_use" })]);
  att(c.cause === "abandonne" && c.regle === "sans_texte_final", JSON.stringify(c));
});
check("rouge — interruption après la dernière réponse : abandonne", () => {
  const c = causeFin([...debut(), reponse([outil("Bash", { command: "npm test" }, "toolu_C")], 70, { id: "m3", stop: "tool_use" }), resultat("toolu_C", "[Request interrupted by user for tool use]", 71)],
    { dernierMessage: "" });
  att(c.cause === "abandonne" && c.regle === "interruption", JSON.stringify(c));
});
check("rouge — erreur d'API en dernière réponse (<synthetic>, isApiErrorMessage) : erreur, et le modèle servi n'est pas « <synthetic> »", () => {
  const e = [...FINI(), erreurApi('API Error: 500 {"type":"error","error":{"type":"api_error"}}', 70)];
  const c = causeFin(e);
  att(c.cause === "erreur" && c.regle === "erreur_api", JSON.stringify(c));
  att(mesurer(e).modele === "claude-opus-5-5", mesurer(e).modele);
});
check("rouge — erreur d'API qui dit un délai (« timed out », statut 504) : timeout ; le dernier message du hook en forme d'erreur : erreur", () => {
  att(causeFin([...debut(), erreurApi("API Error: Request timed out.", 70, { error: "unknown", statut: null })]).cause === "timeout", "timed out");
  att(causeFin([...debut(), erreurApi("API Error: 504 Gateway", 70, { error: "unknown", statut: 504 })]).cause === "timeout", "504");
  att(causeFin(FINI(), { dernierMessage: "API Error: 529 Overloaded" }).cause === "erreur", "dernier message d'erreur");
});
check("rouge — réponse finale coupée à la limite de sortie (max_tokens) : erreur", () => {
  const c = causeFin([...debut(), reponse([texte("Rapport coupé")], 70, { id: "m3", stop: "max_tokens" })], { dernierMessage: "Rapport coupé" });
  att(c.cause === "erreur" && c.regle === "limite_de_sortie", JSON.stringify(c));
});
check("vert — rapport remis par SubagentHandback, même sans texte final : fini", () => {
  const c = causeFin([...debut(), reponse([outil("SubagentHandback", { message: "rapport" }, "toolu_H")], 70, { id: "m3", stop: "tool_use" })]);
  att(c.cause === "fini" && c.regle === "remise", JSON.stringify(c));
});
check("double sens — transcription en retard (finit sur un résultat d'outil) : fini avec le dernier message du hook, abandonne sans lui", () => {
  const e = FINI().slice(0, 3);
  att(causeFin(e, { dernierMessage: "Rapport final." }).cause === "fini", "avec le dernier message");
  att(causeFin(e).cause === "abandonne", "sans le dernier message");
});
check("vert — un message système (isMeta) après le texte final ne rouvre pas l'agent : fini", () => {
  const e = [...FINI(), { isSidechain: true, isMeta: true, type: "user", timestamp: iso(66), message: { role: "user", content: "<system-reminder>x</system-reminder>" } }];
  att(causeFin(e).cause === "fini", JSON.stringify(causeFin(e)));
});

// ---- LA TRANSCRIPTION ILLISIBLE ---------------------------------------------------------------------------------------------------
check("rouge — transcription absente : fiche partielle (mesures null, lacune dite), identité et projet gardés, jamais une exception", () => {
  const f = construireFiche(entreeDe({ chemin: join(base, "absente.jsonl"), id: "a-absent" }), { racine: PRODUIT, env: {} });
  att(f.partielle === true && f.lacunes.includes("transcription de l'agent introuvable") && f.lacunes.includes("cause de fin indéterminée"), JSON.stringify(f.lacunes));
  att(f.duree_s === null && f.jetons_entree === null && f.cause_fin === null && f.agent_id === "a-absent" && f.projet === "Produit-41" && f.type === "explorateur", JSON.stringify(f));
  const g = construireFiche(entreeDe({ chemin: join(base, "absente.jsonl"), id: "a-absent" }, { last_assistant_message: "Rapport." }), { racine: PRODUIT, env: {} });
  att(g.cause_fin === "fini" && g.partielle === true, "le dernier message du hook donne la cause même sans transcription");
});
check("rouge — transcription faite de lignes cassées : fiche partielle « transcription vide » et lignes illisibles comptées", () => {
  const dossier = join(base, "sessions", "f00dcafe-0000-4000-8000-000000000000", "subagents");
  writeFileSync(join(dossier, "agent-casse.jsonl"), "pas du json\n{\"tronquée\": \n", "utf8");
  const f = construireFiche(entreeDe({ chemin: join(dossier, "agent-casse.jsonl"), id: "casse" }), { racine: PRODUIT, env: {} });
  att(f.partielle && f.lacunes.includes("transcription vide") && f.lacunes.some((l) => /^2 ligne\(s\) illisible/.test(l)) && f.cause_fin === null, JSON.stringify(f.lacunes));
});
check("rouge — transcription partiellement lisible (dernière ligne tronquée) : mesures sur ce qui se lit, lacune dite", () => {
  const t = transcription(FINI());
  writeFileSync(t.chemin, readFileSync(t.chemin, "utf8") + '{"type":"assistant","message":{"id":"x"', "utf8");
  const f = construireFiche(entreeDe(t), { racine: PRODUIT, env: {} });
  att(f.partielle && f.lacunes.some((l) => /^1 ligne\(s\) illisible/.test(l)) && f.duree_s === 65 && f.cause_fin === "fini", JSON.stringify(f));
});
check("rouge — un dossier à la place de la transcription : « transcription de l'agent illisible », pas d'exception", () => {
  const d = join(base, "un-dossier.jsonl");
  mkdirSync(d, { recursive: true });
  const f = construireFiche(entreeDe({ chemin: d, id: "dossier" }), { racine: PRODUIT, env: {} });
  att(f.partielle && f.lacunes.includes("transcription de l'agent illisible"), JSON.stringify(f.lacunes));
});
check("rouge — au-delà de la borne de lecture : tête et queue lues (durée et cause), jetons, appels et frictions null, lacune dite", () => {
  const e = [consigne("x", 0)];
  for (let i = 1; i <= 120; i++) e.push(reponse([outil("Read", { file_path: `f${i}` }, `t${i}`)], i * 10, { id: `m${i}`, stop: "tool_use" }), resultat(`t${i}`, "ok", i * 10 + 1));
  e.push(reponse([texte("Rapport.")], 1300, { id: "fin" }));
  const t = transcription(e);
  const f = construireFiche(entreeDe(t), { racine: PRODUIT, env: {}, borne: 8000 });
  att(f.partielle && f.lacunes.some((l) => /au-delà de la borne de lecture de 8000 octets/.test(l)), JSON.stringify(f.lacunes));
  att(f.duree_s === 1300 && f.cause_fin === "fini" && f.jetons_entree === null && f.appels_outils === null && f.frictions === null, JSON.stringify(f));
  const entiere = construireFiche(entreeDe(t), { racine: PRODUIT, env: {} });
  att(entiere.appels_outils === 120 && entiere.partielle === false, "sous la borne, la même transcription est lue en entier");
});

// ---- LE PROJET, JAMAIS SOUS SON NOM RÉEL ------------------------------------------------------------------------------------------
check("rouge — produit inconnu de la table : inscrit sous un Produit-NN neuf (table jetable), et son nom n'entre pas dans la ligne", () => {
  const r = racineFictive("produit-inconnu-fictif");
  const dest = join(base, "inconnu.jsonl");
  const res = traiterFinDAgent(entreeDe(transcription(FINI()), { cwd: r }), { env: { FORGE_FICHES_AGENTS: dest } });
  att(res.ecrit && res.fiche.projet === "Produit-42", JSON.stringify(res.fiche?.projet));
  att(JSON.parse(readFileSync(TABLE_PRODUITS, "utf8")).produits["produit-inconnu-fictif"] === "Produit-42", "la table jetable n'a pas reçu le produit");
  att(!readFileSync(dest, "utf8").includes("produit-inconnu-fictif"), "le nom réel est dans la ligne");
});
check("rouge — table des produits absente : projet null et lacune, jamais le nom du dossier", () => {
  process.env.FORGE_PRODUITS_PSEUDO = join(base, "table-absente.json");
  try {
    const r = racineFictive("produit-sans-table-fictif");
    const f = construireFiche(entreeDe(transcription(FINI()), { cwd: r }), { racine: r, env: {} });
    att(f.projet === null && f.partielle && f.lacunes.some((l) => /pseudonyme du projet indisponible/.test(l)), JSON.stringify(f));
    att(!JSON.stringify(f).includes("produit-sans-table-fictif"), "le nom réel est dans la fiche");
  } finally { process.env.FORGE_PRODUITS_PSEUDO = TABLE_PRODUITS; }
});
check("rouge — un pseudonyme rendu qui serait un nom réel est refusé ; une panne de pseudoProduit donne projet null", () => {
  att(projetDe(PRODUIT, { pseudo: () => "produit-connu-fictif" }).projet === null, "un nom réel rendu entre dans la fiche");
  att(projetDe(PRODUIT, { pseudo: () => { throw new Error("table illisible"); } }).projet === null, "une panne fait passer quelque chose");
  att(projetDe(PRODUIT, { pseudo: () => "Produit-07" }).projet === "Produit-07", "un pseudonyme valide est refusé");
});
check("vert — le pilot garde son nom public, table absente comprise ; un arbre lié prend le nom de son arbre principal", () => {
  const pilot = racineFictive("digit-ai-factory", { pilot: true });
  process.env.FORGE_PRODUITS_PSEUDO = join(base, "table-absente.json");
  try { att(projetDe(pilot).projet === "digit-ai-factory", JSON.stringify(projetDe(pilot))); } finally { process.env.FORGE_PRODUITS_PSEUDO = TABLE_PRODUITS; }
  const principal = join(base, "depot-principal-fictif"), lie = join(base, "arbre-lie-fictif");
  mkdirSync(join(principal, ".git", "worktrees", "arbre-x"), { recursive: true });
  writeFileSync(join(principal, ".git", "worktrees", "arbre-x", "commondir"), "../..\n", "utf8");
  mkdirSync(lie, { recursive: true });
  writeFileSync(join(lie, ".git"), `gitdir: ${join(principal, ".git", "worktrees", "arbre-x")}\n`, "utf8");
  const vus = [];
  projetDe(lie, { pseudo: (nom) => { vus.push(nom); return "Produit-08"; } });
  att(vus.length === 1 && vus[0] === "depot-principal-fictif", `nom passé à pseudoProduit : ${vus.join(", ")}`);
});

// ---- LE TYPE ----------------------------------------------------------------------------------------------------------------------
check("double sens — type : la flotte et les intégrés fixes gardent leur nom, les génériques deviennent « generique », tout autre nom « propre »", () => {
  const flotte = new Set(["explorateur", "constructeur"]);
  att(typeDe("explorateur", { flotte }) === "explorateur" && typeDe("claude-code-guide", { flotte }) === "claude-code-guide", "flotte ou intégré");
  att(["general-purpose", "Explore", "Plan", "claude", ""].every((t) => typeDe(t, { flotte }) === "generique"), "génériques");
  att(typeDe("agent-du-produit-fictif-reel", { flotte }) === "propre" && typeDe(null, { flotte }) === null, "propre ou inconnu");
  att(typeDe("verificateur") === "verificateur", "la flotte du pilot (gabarits/flotte) n'est pas lue");
  const f = fiche(FINI(), { agent_type: "agent-du-produit-fictif-reel" });
  att(f.type === "propre" && !JSON.stringify(f).includes("produit-fictif-reel"), JSON.stringify(f.type));
});
check("vert — type lu au .meta.json quand le hook ne le donne pas ; un agent interne du harnais (agent_type vide, sans type) n'a pas de fiche", () => {
  const f = fiche(FINI(), { agent_type: undefined });
  att(f.type === "explorateur", JSON.stringify(f.type));
  const dest = join(base, "interne.jsonl");
  const r = traiterFinDAgent(entreeDe(transcription(FINI(), { meta: null }), { agent_type: "" }), { env: { FORGE_FICHES_AGENTS: dest } });
  att(r.ecrit === false && /agent interne/.test(r.motif) && !existsSync(dest), JSON.stringify(r));
  const s = traiterFinDAgent(entreeDe(transcription(FINI()), { agent_type: "" }), { env: { FORGE_FICHES_AGENTS: dest } });
  att(s.ecrit === true && s.fiche.type === "explorateur", "un agent dont le .meta.json porte un type a sa fiche");
});

// ---- LES FRICTIONS ----------------------------------------------------------------------------------------------------------------
check("double sens — frictions : un refus de hook compte, une correction après la consigne compte, le vocabulaire de la consigne ne compte pas", () => {
  att(mesurer(FINI()).frictions === 0, `consigne comptée : ${mesurer(FINI()).frictions}`);
  const refus = [...debut(), reponse([outil("Write", { file_path: "x.md", content: "y" }, "toolu_W")], 20, { id: "m3", stop: "tool_use" }),
    resultat("toolu_W", "PreToolUse:Write hook error: [node qo-gate-write.mjs]: écriture refusée", 21), reponse([texte("Rapport.")], 30, { id: "m4" })];
  att(mesurer(refus).frictions === 1, `refus : ${mesurer(refus).frictions}`);
  const correction = [...FINI(), humain("Non, ce n'est pas ce qu'on avait convenu.", 70), reponse([texte("Corrigé.")], 80, { id: "m5" })];
  att(mesurer(correction).frictions === 1, `correction : ${mesurer(correction).frictions}`);
});

// ---- SESSION, EFFORT, DESTINATION, ÉCRITURE ---------------------------------------------------------------------------------------
check("vert — session par sessionCourante() ; sans session_id ni variable : session null et lacune ; effort repris de l'entrée du hook à défaut", () => {
  const sans = fiche(FINI(), { session_id: undefined });
  att(sans.session === null && sans.session_source === "inconnue" && sans.lacunes.includes("session inconnue"), JSON.stringify(sans));
  const parEnv = construireFiche({ ...entreeDe(transcription(FINI())), session_id: undefined }, { racine: PRODUIT, env: { FORGE_SESSION_ID: "beefbeef-1" } });
  att(parEnv.session === "beefbeef" && parEnv.session_source === "session_start", JSON.stringify(parEnv.session));
  const e = FINI().map((x) => (x.type === "assistant" ? { ...x, effort: undefined } : x));
  att(fiche(e, { effort: { level: "medium" } }).effort === "medium", "effort de l'entrée");
});
check("vert — destination : pilot, produit, variable FORGE_FICHES_AGENTS ; ailleurs aucune fiche", () => {
  const pilot = racineFictive("digit-ai-factory", { pilot: true });
  att(cheminFiches(pilot, {}) === join(pilot, "todo", "observabilite", "fiches-agents.jsonl"), cheminFiches(pilot, {}));
  att(cheminFiches(PRODUIT, {}) === join(PRODUIT, "forge", "fiches-agents.jsonl"), cheminFiches(PRODUIT, {}));
  att(cheminFiches(PRODUIT, { FORGE_FICHES_AGENTS: "x.jsonl" }) === "x.jsonl", "variable");
  const ailleurs = join(base, "dossier-quelconque");
  mkdirSync(ailleurs, { recursive: true });
  att(cheminFiches(ailleurs, {}) === null, "un dossier quelconque reçoit une fiche");
  const r = traiterFinDAgent(entreeDe(transcription(FINI()), { cwd: ailleurs }), { env: {} });
  att(r.ecrit === false && /hors du pilot/.test(r.motif), JSON.stringify(r));
});
check("vert — chez un produit, la fiche s'écrit à forge/fiches-agents.jsonl, en ajout seul : la première ligne reste intacte", () => {
  const r1 = traiterFinDAgent(entreeDe(transcription(FINI())), { env: {} });
  const chemin = join(PRODUIT, "forge", "fiches-agents.jsonl");
  att(r1.ecrit && r1.chemin === chemin, JSON.stringify(r1));
  const avant = readFileSync(chemin, "utf8");
  const r2 = traiterFinDAgent(entreeDe(transcription(FINI()), { stop_hook_active: true }), { env: {} });
  const apres = readFileSync(chemin, "utf8");
  att(r2.ecrit && apres.startsWith(avant) && apres.trim().split("\n").length === avant.trim().split("\n").length + 1, "la ligne n'est pas ajoutée, ou la première a changé");
  att(ecrireFiche(join(base, "un-dossier.jsonl"), { a: 1 }).ecrit === false, "une écriture impossible lève au lieu de le dire");
});
check("rouge — entrée illisible ou sans agent : aucune fiche, aucune exception ; une panne de construction écrit une fiche minimale partielle", () => {
  for (const x of [null, "pas un objet", [1, 2], {}, { session_id: "s" }]) {
    const r = traiterFinDAgent(x, { env: { FORGE_FICHES_AGENTS: join(base, "rien.jsonl") } });
    att(r.ecrit === false && r.motif, JSON.stringify(x));
  }
  att(!existsSync(join(base, "rien.jsonl")), "une entrée sans agent a écrit une fiche");
  const dest = join(base, "panne.jsonl");
  const r = traiterFinDAgent(entreeDe(transcription(FINI())), { env: { FORGE_FICHES_AGENTS: dest }, maintenant: { toISOString() { throw new Error("horloge"); } } });
  const l = JSON.parse(readFileSync(dest, "utf8").trim());
  att(r.ecrit && l.partielle === true && l.lacunes[0] === "panne de construction de la fiche" && l.agent_id && l.session === "f00dcafe", JSON.stringify(l));
});

rmSync(base, { recursive: true, force: true });
console.log(`\nlib-fiches-agents : ${pass} PASS, ${fail} FAIL — cas rouges : abandon, erreur, timeout, transcription illisible, nom réel refusé, contenu absent`);
process.exit(fail ? 1 : 0);
