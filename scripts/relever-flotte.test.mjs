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
  // D-23 (a) du 18/10/2026 — les relectures d'intention : un `verificateur` dont la description commence par « Relecture d'intention ».
  // Les jetons d'une relecture sont ceux de toutes ses réponses (5 + sortie + relus + 100 écrits en cache, ici) ; le seuil d'arrêt
  // de l'essai porte sur le total PAR JOUR.
  const RELU = 700000, PAR_REPONSE = 5 + 10 + RELU + 100;
  const relecture = (desc, quand, type = "verificateur") => [[reponse(`r1-${desc}-${quand}`, "claude-sonnet-5-5", 10, RELU, quand), reponse(`r2-${desc}-${quand}`, "claude-sonnet-5-5", 10, RELU, quand)], { agentType: type, description: desc }];
  const J15 = "2026-10-15T10:00:00.000Z", J16 = "2026-10-16T10:00:00.000Z";
  const tenu = projet("relectures-tenu", [], [relecture("Relecture d'intention fin-de-tour", J15), relecture("Relecture d'intention consigne", J16),
    relecture("Relecture R01 aveugle", J15), relecture("Relecture d'intention déguisée", J15, "campagne"), relecture("relecture d’intention en minuscules", J15)]);
  const franchi = projet("relectures-franchi", [], [relecture("Relecture d'intention fin-de-tour", J15), relecture("Relecture d'intention consigne", J15), relecture("Relecture d'intention lot", J15)]);
  check("vert — les relectures d'intention sont comptées (verificateur + description), avec leurs jetons par jour ; le seuil du jour est tenu", () => {
    const e = lancer(tenu).rapport.indicateurs.essai_relecture_intention;
    if (e.relectures !== 3) throw new Error(`relectures ${e.relectures}, attendu 3 : un verificateur « Relecture R01 aveugle » et un campagne « Relecture d'intention » ne comptent pas`);
    if (e.jetons !== 3 * 2 * PAR_REPONSE) throw new Error(`jetons ${e.jetons}, attendu ${3 * 2 * PAR_REPONSE}`);
    if (e.jetons_par_jour[Object.keys(e.jetons_par_jour).sort()[0]] !== 2 * 2 * PAR_REPONSE || Object.keys(e.jetons_par_jour).length !== 2) throw new Error(JSON.stringify(e.jetons_par_jour));
    if (e.seuil_franchi !== false) throw new Error("seuil franchi à tort : 4 200 690 jetons répartis sur deux jours, chacun sous les 4 millions");
  });
  check("rouge — plus de 4 000 000 de jetons de relecture en UN jour : le seuil d'arrêt est franchi, dit, exit 0, et le verdict de la flotte ne bouge pas", () => {
    const r = lancer(franchi);
    const e = r.rapport.indicateurs.essai_relecture_intention;
    if (e.seuil_franchi !== true || e.jour_max.jetons !== 3 * 2 * PAR_REPONSE) throw new Error(JSON.stringify(e));
    if (r.code !== 0) throw new Error(`exit ${r.code}`);
    if (r.rapport.criteres.length !== 3) throw new Error("le seuil de l'essai est entré dans les critères de la flotte");
    const t = executer(["--transcripts", franchi, "--depuis", "2026-10-01", "--referentiel", REF]).sortie;
    if (!/relectures d'intention \(essai du 2026-10-18 au 2026-11-01, prolongé en service par D-73 \(b\), revue le 2026-11-08\) : 3 relecture\(s\).*FRANCHI : arrêter l'essai et demander/.test(t)) throw new Error(t);
  });
  check("vert — sans relecture d'intention, le relevé le dit (0, seuil tenu) ; un verificateur ordinaire ne compte pas", () => {
    const t = executer(["--transcripts", vert, "--depuis", "2026-10-01", "--referentiel", REF]).sortie;
    if (!/0 relecture\(s\), 0 jetons ; aucun jour chargé — seuil de 4 000 000 jetons par jour tenu/.test(t)) throw new Error(t);
  });
  // TF-1928 (D-48 (a) du 19/10/2026) — la simultanéité : le pic de sous-agents dont les durées de vie se chevauchent, par session.
  const H = (hm) => `2026-10-15T${hm}:00.000Z`;
  const vivants = (nom, durees) => durees.map(([debut, fin], i) => [[reponse(`${nom}-${i}-a`, "claude-sonnet-5-5", 5, 1000, H(debut)), reponse(`${nom}-${i}-b`, "claude-sonnet-5-5", 5, 1000, H(fin))], { agentType: "campagne" }]);
  // trois sous-agents se chevauchent de 10:05 à 10:08 ; le quatrième vient bien après : pic 3 pour 4 sous-agents.
  const chevauche = projet("simult-vert", [], vivants("v", [["10:00", "10:10"], ["10:02", "10:08"], ["10:05", "10:12"], ["10:20", "10:30"]]));
  // six sous-agents l'un après l'autre, chaque fin touchant le début du suivant : pic 1, jamais 6.
  const enfile = projet("simult-rouge", [], vivants("r", [["10:00", "10:10"], ["10:10", "10:20"], ["10:20", "10:30"], ["10:30", "10:40"], ["10:40", "10:50"], ["10:50", "11:00"]]));
  // cinq sous-agents vivants ensemble : une session à 5 ou plus.
  const cinq = projet("simult-cinq", [], vivants("c", [["10:00", "10:30"], ["10:01", "10:31"], ["10:02", "10:32"], ["10:03", "10:33"], ["10:04", "10:34"]]));
  check("vert — la simultanéité est le pic de chevauchement (3 pour 4 sous-agents dont un tardif), pas leur nombre", () => {
    const s = lancer(chevauche).rapport.indicateurs.simultaneite;
    if (s.pic_max !== 3 || s.sessions_avec_sous_agents !== 1 || s.distribution_des_pics["3"] !== 1) throw new Error(JSON.stringify(s));
    if (s.sessions_a_5_ou_plus !== 0 || s.sessions_a_10_ou_plus !== 0) throw new Error(JSON.stringify(s));
    if (s.limite_par_defaut !== 20) throw new Error(`limite ${s.limite_par_defaut}`);
  });
  check("rouge — six sous-agents bout à bout ne sont pas six simultanés : pic 1, aucune session à 5 ou plus", () => {
    const s = lancer(enfile).rapport.indicateurs.simultaneite;
    if (s.pic_max !== 1) throw new Error(`pic ${s.pic_max} : des durées qui se touchent ont été comptées comme chevauchantes, ou le nombre de sous-agents a été lu comme un pic`);
    if (s.sessions_a_5_ou_plus !== 0) throw new Error(JSON.stringify(s));
  });
  check("vert — la distribution compte les sessions : trois dossiers, trois sessions, pics 3, 1 et 5 ; une session à 5 ou plus", () => {
    const r = lancer(chevauche, "--transcripts", enfile, "--transcripts", cinq).rapport.indicateurs;
    const s = r.simultaneite;
    if (s.sessions_avec_sous_agents !== 3 || s.pic_max !== 5 || s.sessions_a_5_ou_plus !== 1 || s.sessions_a_10_ou_plus !== 0) throw new Error(JSON.stringify(s));
    if (JSON.stringify(s.distribution_des_pics) !== JSON.stringify({ 1: 1, 3: 1, 5: 1 })) throw new Error(JSON.stringify(s.distribution_des_pics));
    if (r.sous_agents !== 4 + 6 + 5) throw new Error(`sous-agents ${r.sous_agents}, attendu 15 : le pic doit porter sur la population des sous-agents relevés`);
  });
  check("vert — la ligne du relevé dit le pic, la session, les seuils 5 et 10 et la limite par défaut ; sans sous-agent, elle le dit", () => {
    const t = executer(["--transcripts", chevauche, "--transcripts", cinq, "--depuis", "2026-10-01", "--referentiel", REF]).sortie;
    if (!/simultanéité de sous-agents : 2 session\(s\) en ont lancé, pic maximal 5 \(session s1\), 1 session\(s\) à 5 ou plus, 0 à 10 ou plus ; limite par défaut d'une session : 20/.test(t)) throw new Error(t);
    const v = executer(["--transcripts", projet("simult-aucun", [appel("z1", { subagent_type: "campagne", prompt: "x" })]), "--depuis", "2026-10-01", "--referentiel", REF]).sortie;
    if (!/simultanéité : aucune session n'a lancé de sous-agent/.test(v)) throw new Error(v);
  });
  check("bornes — la simultanéité n'entre pas dans les critères de la flotte : le verdict reste celui des trois critères", () => {
    const r = lancer(cinq).rapport;
    if (r.criteres.length !== 3) throw new Error(`${r.criteres.length} critères`);
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
