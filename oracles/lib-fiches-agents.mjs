/**
 * lib-fiches-agents.mjs — LA FICHE D'EXÉCUTION D'UN AGENT : UNE LIGNE PAR FIN D'AGENT, SANS UN MOT DE SA CONSIGNE NI DE SON LIVRABLE
 * (décision humaine D-219 (e) du 15/11/2026, TF-2563, mandat 20261115b, lot L1 ; étude `output/03-etudes/Digit-AI - Étude -
 * Amelioration continue des agents par leurs lecons - 20261114d.md`, section Q1).
 *
 * LE FAIT (étude, Q1, « Manques identifiés »). Sur un mois, 300 sous-agents ont tourné et 284 n'ont jamais été publiés un par un :
 * `oracle-suivi-agents.mjs` ne publie que les agents de plus de 17 minutes. Aucun journal ne lie un agent au verdict de son livrable,
 * aucun script n'extrait la cause de sa fin, et le harnais purge les transcriptions après un mois. Une fiche versionnée leur survit.
 *
 * LA FICHE, une ligne JSON par fin d'agent, en ajout seul : au pilot `todo/observabilite/fiches-agents.jsonl`, chez un produit
 * (un dossier `forge/`) `forge/fiches-agents.jsonl`, ailleurs nulle part ; `FORGE_FICHES_AGENTS` désigne un autre fichier (bancs,
 * essais). Les 13 lignes du tableau de l'étude donnent 15 clés :
 *   · `ts` : l'heure de l'écriture ;
 *   · `session` : les 8 premiers caractères de la session, par `sessionCourante()` (`lib-session.mjs`) ;
 *   · `agent_id` : l'identifiant du sous-agent que le hook transmet ;
 *   · `type` : le nom d'un agent de la flotte (`gabarits/flotte/*.yaml`) ou d'un agent intégré fixe, `generique` pour un agent générique
 *     (`GENERIQUES` de `hook-flotte.mjs`), `propre` pour tout autre agent, dont le nom n'est pas recopié : il pourrait porter celui
 *     d'un produit ;
 *   · `modele`, `effort` : le modèle et l'effort SERVIS le plus souvent (`message.model` et `effort` des réponses, TF-1557), hors
 *     réponse synthétique d'erreur ; à défaut d'effort lu, `effort.level` de l'entrée du hook ;
 *   · `duree_s` : du premier message à la dernière activité (« dernier message − premier message », comme l'étude), course par course.
 *     Une course finit à sa dernière ACTIVITÉ (réponse, résultat d'outil, message de texte) : une pièce jointe ou une notification qui
 *     suit la fin ne l'allonge pas. Une REPRISE (tout message reçu après une réponse finale, notification comprise, interruption exceptée)
 *     ouvre une course neuve, et la pause qui la précède ne compte pas. Le fait, à l'essai réel du 15/11/2026 : un agent `explorateur`
 *     du pilot sur 12, fini le 29/10, a reçu le 12/11 une notification de tâche (`isMeta`) sans y répondre ; « dernier message −
 *     premier message » lui comptait 1 147 307 s (13 jours) ;
 *   · `jetons_entree` (entrée, cache écrit et cache relu) et `jetons_sortie` : une réponse se compte une fois, sur sa DERNIÈRE ligne,
 *     la règle de `relever-flotte.mjs` (les jetons relus se répètent à chaque ligne d'une même réponse) ;
 *   · `appels_outils` : les blocs `tool_use` distincts ;
 *   · `verdict_livrable` et `verdict_relecture` : null ici, un autre écrivain les note après la réception, sans réécrire la fiche ;
 *   · `frictions` : `releveFrictions()` de `lib-frictions.mjs` sur la transcription de l'agent, sa consigne exclue (« non, … » d'une
 *     consigne n'est pas une correction) ;
 *   · `cause_fin` : `fini`, `abandonne`, `timeout` ou `erreur`, par l'heuristique ci-dessous ;
 *   · `projet` : le pseudonyme `Produit-NN` par `pseudoProduit()`, ou le nom public du pilot ou d'une forge.
 * S'y ajoutent `schema`, `session_source`, `partielle` et `lacunes` : une fiche à qui une mesure manque le dit, elle ne se tait pas.
 *
 * LA CAUSE DE FIN, règles dans l'ordre, la première qui répond l'emporte :
 *   1. la dernière réponse est une erreur d'API (`isApiErrorMessage`, modèle `<synthetic>`), ou le dernier message transmis par le hook
 *      en a la forme (« API Error: … ») : `timeout` si l'erreur dit un délai (statut 408 ou 504, « timed out », ETIMEDOUT), `erreur` sinon ;
 *   2. une interruption (« [Request interrupted by user ») suit la dernière réponse : `abandonne` ;
 *   3. la dernière réponse est coupée à la limite de sortie (`stop_reason: max_tokens`) : `erreur` ;
 *   4. le dernier appel d'outil remet le rapport (`SubagentHandback`, Claude Code 2.1.271 ou plus) : `fini` ;
 *   5. le hook transmet un dernier message non vide (`last_assistant_message`), ou, à défaut, la dernière réponse porte un texte que rien
 *      ne suit : `fini` ;
 *   6. sinon, aucun texte final, la transcription finit sur un appel d'outil ou sur son résultat : `abandonne`.
 *   Sans transcription lisible ni dernier message, la cause est null et la lacune le dit.
 * Ce qui la fonde, mesuré le 15/11/2026 sur les 350 transcriptions de sous-agents du poste : 344 finissent sur un texte (343 en
 * `end_turn`), 6 sur un appel d'outil, 2 portent une interruption dans leurs 4 derniers messages ; aucune erreur d'API chez un
 * sous-agent, 7 chez des sessions en 31 jours, toutes `<synthetic>` avec un champ `error`. La documentation
 * (https://code.claude.com/docs/en/hooks, « Common input fields ») : la transcription « may lag the in-memory conversation » ; le
 * dernier message que le hook transmet prime donc sur la fin lue au fichier.
 *
 * UNE LIGNE PAR FIN D'AGENT. Un agent dont la remise est refusée (`hook-remise-agent.mjs`) ou qui est repris s'arrête une seconde fois
 * et écrit une seconde ligne, qui le mesure en entier : la dernière ligne d'un `agent_id` fait foi.
 *
 * NON JUGÉ (déclaré) : un agent arrêté par une limite de tours ou par un délai du harnais (forme non observée sur le poste) ; un agent
 * qui finit sur une phrase d'attente (TF-1132) compte `fini` ; un agent interne du harnais (suggestion d'invite, question `/btw`) n'a
 * pas de fiche quand son `agent_type` est vide, il en a une quand la session tourne sous `--agent` ; au-delà de la borne de lecture
 * (32 Mo, 30,34 Mo au plus sur le poste le 15/11/2026), la tête et la queue seules sont lues et jetons, appels d'outils et frictions
 * ne sont pas relevés.
 *
 * AUCUN NOM RÉEL, AUCUN CHEMIN, AUCUN CONTENU : la fiche ne porte que des nombres, des identifiants, des noms de modèle, d'effort et de
 * type, et des lacunes rédigées ici. Le projet passe par `pseudoProduit()` sur le nom de l'ARBRE PRINCIPAL (`arbrePrincipal()` de
 * `lib-sessions.mjs`) : un arbre de travail lié ne s'inscrit pas sous le nom de son dossier. Une valeur qui n'est ni `Produit-NN` ni un
 * nom public `digit-ai-…` n'entre pas dans la fiche.
 *
 * Usage (module) : import { traiterFinDAgent, construireFiche, causeFin } from "./lib-fiches-agents.mjs";
 * Point d'entrée du hook SubagentStop : `oracles/hook-fiches.mjs`. Recette : `oracles/lib-fiches-agents.test.mjs`.
 */
import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, readSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sessionCourante } from "./lib-session.mjs";
import { racineDuProjet } from "./lib-racine-projet.mjs";
import { arbrePrincipal } from "./lib-sessions.mjs";
import { releveFrictions } from "./lib-frictions.mjs";
import { lireFin } from "./lib-suivi-agents.mjs";
import { GENERIQUES, INTEGRES_FIXES } from "./hook-flotte.mjs";
import { transcriptDeLAgent } from "./hook-remise-agent.mjs";
import { EST_EMETTEUR_FORGE, pseudoProduit } from "../todo/anonymiser-entrant.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));

export const SCHEMA = "pilot/fiches-agents@1";
export const CAUSES_FIN = Object.freeze(["fini", "abandonne", "timeout", "erreur"]);
/** Les 15 clés des 13 lignes du tableau de l'étude (section Q1), dans l'ordre de la fiche. */
export const CHAMPS = Object.freeze(["ts", "session", "agent_id", "type", "modele", "effort", "duree_s", "jetons_entree", "jetons_sortie",
  "appels_outils", "verdict_livrable", "verdict_relecture", "frictions", "cause_fin", "projet"]);
export const FICHIER_PILOT = "todo/observabilite/fiches-agents.jsonl";
export const FICHIER_PRODUIT = "forge/fiches-agents.jsonl";
export const VARIABLE_DESTINATION = "FORGE_FICHES_AGENTS";
/** Au-delà, la transcription n'est lue qu'en tête et en queue : le hook garde son budget de 300 ms. */
export const BORNE_LECTURE = 32 * 1024 * 1024;
const TETE = 64 * 1024;
const QUEUE = 8 * 1024 * 1024;
const ID_AGENT = /^[\w-]{1,64}$/;
const PROJET_ADMIS = [/^Produit-\d{2,}$/, /^digit-ai-[a-z0-9-]+$/];
const FORME_ERREUR_API = /^\s*(?:API Error[:\s]|Failed to authenticate|Failed to refresh OAuth token|Not logged in|Request timed out|Prompt is too long)/i;
const DIT_UN_DELAI = /timed?[\s_-]?out|ETIMEDOUT|d[ée]lai d['’]attente/i;
const INTERRUPTION = "[Request interrupted by user";

const nonVide = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);
const blocs = (e) => (Array.isArray(e?.message?.content) ? e.message.content : []);
const texteDe = (e) => {
  const c = e?.message?.content;
  if (typeof c === "string") return c;
  return blocs(e).filter((b) => b && b.type === "text").map((b) => b.text || "").join("\n");
};
const estReponse = (e) => Boolean(e && e.type === "assistant" && e.message && typeof e.message === "object");
const estErreurApi = (e) => estReponse(e) && (e.isApiErrorMessage === true || e.message.model === "<synthetic>");
const plusFrequent = (compte) => Object.entries(compte).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0] ?? null;
const enChaine = (x) => (x === undefined || x === null ? "" : typeof x === "object" ? JSON.stringify(x) : String(x));
const taille = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1).replace(".", ",")} Mo` : `${n} octets`);

/** Les entrées d'une transcription JSONL : { entrees, illisibles }. Les requêtes au modèle (`api-request*`) sont sautées sans être lues. */
export function lireEntrees(texte) {
  const entrees = [];
  let illisibles = 0;
  for (const brute of String(texte ?? "").split("\n")) {
    const l = brute.endsWith("\r") ? brute.slice(0, -1) : brute;
    if (!l || /^\s*$/.test(l) || l.startsWith('{"type":"api-request')) continue;
    try {
      const e = JSON.parse(l);
      if (e && typeof e === "object" && !Array.isArray(e)) entrees.push(e); else illisibles++;
    } catch { illisibles++; }
  }
  return { entrees, illisibles };
}

function lireTete(chemin, octets) {
  const fd = openSync(chemin, "r");
  try {
    const tampon = Buffer.alloc(octets);
    const s = tampon.subarray(0, readSync(fd, tampon, 0, octets, 0)).toString("utf8");
    const k = s.lastIndexOf("\n");
    return k >= 0 ? s.slice(0, k) : "";
  } finally { closeSync(fd); }
}

/** La transcription lue : entière sous la borne, sinon en tête et en queue seulement (`bornee`). */
export function lireTranscription(chemin, { borne = BORNE_LECTURE } = {}) {
  const octets = statSync(chemin).size;
  if (octets <= borne) return { ...lireEntrees(readFileSync(chemin, "utf8")), octets, bornee: false };
  const tete = lireEntrees(lireTete(chemin, Math.max(1, Math.min(TETE, Math.floor(borne / 2)))));
  const queue = lireEntrees(lireFin(chemin, Math.max(1, Math.min(QUEUE, Math.floor(borne / 2)))));
  return { entrees: [...tete.entrees, ...queue.entrees], illisibles: tete.illisibles + queue.illisibles, octets, bornee: true };
}

/** La cause de fin d'un agent : { cause, regle } (règles de l'en-tête, dans l'ordre). `dernierMessage` : `last_assistant_message` du hook. */
export function causeFin(entrees, { dernierMessage = undefined } = {}) {
  const messages = (entrees || []).filter((e) => e && (e.type === "assistant" || e.type === "user"));
  let iA = -1;
  for (let i = messages.length - 1; i >= 0; i--) if (estReponse(messages[i])) { iA = i; break; }
  const derniere = iA >= 0 ? messages[iA] : null;
  const dernier = typeof dernierMessage === "string" ? dernierMessage.trim() : "";
  if (!messages.length && !dernier) return { cause: null, regle: "indeterminee" };
  if (estErreurApi(derniere) || FORME_ERREUR_API.test(dernier)) {
    const indices = [derniere?.error, derniere?.apiErrorStatus, estErreurApi(derniere) ? texteDe(derniere) : "", dernier].map(enChaine).join(" ");
    const statut = Number(derniere?.apiErrorStatus);
    return DIT_UN_DELAI.test(indices) || statut === 408 || statut === 504 ? { cause: "timeout", regle: "erreur_api_delai" } : { cause: "erreur", regle: "erreur_api" };
  }
  const apres = messages.slice(iA + 1);
  if (apres.some((e) => e.type === "user" && enChaine(e.message?.content).includes(INTERRUPTION))) return { cause: "abandonne", regle: "interruption" };
  if (derniere?.message?.stop_reason === "max_tokens") return { cause: "erreur", regle: "limite_de_sortie" };
  let dernierOutil = null;
  for (const e of messages) if (estReponse(e)) for (const b of blocs(e)) if (b?.type === "tool_use") dernierOutil = b.name;
  if (dernierOutil === "SubagentHandback") return { cause: "fini", regle: "remise" };
  if (dernier) return { cause: "fini", regle: "dernier_message" };
  const suivis = apres.filter((e) => !e.isMeta);
  if (derniere && texteDe(derniere).trim() && !blocs(derniere).some((b) => b?.type === "tool_use") && !suivis.length) return { cause: "fini", regle: "texte_final" };
  return { cause: "abandonne", regle: "sans_texte_final" };
}

/** Un message de texte adressé à l'agent : ni résultat d'outil, ni message système (`isMeta`). */
const estMessageTexte = (e) => Boolean(e && e.type === "user" && !e.isMeta && !blocs(e).some((b) => b?.type === "tool_result"));

/** Le nombre de frictions de l'agent, sa consigne exclue ; null si le relevé tombe en panne. */
export function frictionsDe(entrees) {
  const consigne = (entrees || []).findIndex(estMessageTexte);
  const segment = [];
  (entrees || []).forEach((e, i) => { if (e && i !== consigne) segment.push(e.isSidechain ? { ...e, isSidechain: false } : e); });
  try { return releveFrictions(segment).length; } catch { return null; }
}

/**
 * La durée en secondes, course par course (en-tête, `duree_s`) : une course va de son premier point à sa dernière activité ; un message
 * reçu après une réponse finale (texte sans appel d'outil), interruption exceptée, ouvre une course neuve. Null sans horodatage.
 */
export function dureeDesCourses(entrees) {
  const points = [];
  (entrees || []).forEach((e, i) => {
    const t = Date.parse(e?.timestamp ?? "");
    if (!Number.isFinite(t)) return;
    const recu = Boolean(e && e.type === "user" && !blocs(e).some((b) => b?.type === "tool_result"));
    const finale = estReponse(e) && texteDe(e).trim() !== "" && !blocs(e).some((b) => b?.type === "tool_use");
    points.push({ t, i, recu, interruption: recu && enChaine(e.message?.content).includes(INTERRUPTION), activite: estReponse(e) || (e?.type === "user" && !e.isMeta), finale });
  });
  if (!points.length) return null;
  points.sort((a, b) => a.t - b.t || a.i - b.i);
  let total = 0, debut = points[0].t, fin = points[0].t, apresFinale = false;
  for (const p of points) {
    if (p.recu && !p.interruption && apresFinale) { total += fin - debut; debut = p.t; fin = p.t; apresFinale = false; continue; }
    if (p.activite) { fin = p.t; apresFinale = p.finale; }
  }
  return Math.round((total + fin - debut) / 1000);
}

/** Les mesures d'une transcription lue. `avecTotaux: false` (transcription bornée) : jetons, appels d'outils et frictions à null. */
export function mesurer(entrees, { avecTotaux = true } = {}) {
  const reponses = new Map();
  const outils = new Set();
  let sansId = 0;
  (entrees || []).forEach((e, i) => {
    if (!estReponse(e) || estErreurApi(e)) return;
    reponses.set(e.message.id || `#${i}`, e);
    for (const b of blocs(e)) if (b?.type === "tool_use") { if (b.id) outils.add(b.id); else sansId++; }
  });
  const modeles = {}, efforts = {};
  let entree = 0, sortie = 0;
  for (const r of reponses.values()) {
    const u = r.message.usage || {};
    entree += (Number(u.input_tokens) || 0) + (Number(u.cache_creation_input_tokens) || 0) + (Number(u.cache_read_input_tokens) || 0);
    sortie += Number(u.output_tokens) || 0;
    if (nonVide(r.message.model)) modeles[r.message.model] = (modeles[r.message.model] || 0) + 1;
    if (nonVide(r.effort)) efforts[r.effort] = (efforts[r.effort] || 0) + 1;
  }
  return {
    modele: plusFrequent(modeles), effort: plusFrequent(efforts),
    duree_s: dureeDesCourses(entrees),
    jetons_entree: avecTotaux ? entree : null, jetons_sortie: avecTotaux ? sortie : null,
    appels_outils: avecTotaux ? outils.size + sansId : null,
    frictions: avecTotaux ? frictionsDe(entrees) : null,
  };
}

let flotteLue = null;
/** Les noms des agents de la flotte du pilot (`gabarits/flotte/*.yaml`), lus une fois. */
export function flotteDuPilot(dossier = join(ICI, "..", "gabarits", "flotte")) {
  if (flotteLue && flotteLue.dossier === dossier) return flotteLue.noms;
  let noms = new Set();
  try { noms = new Set(readdirSync(dossier).filter((f) => f.endsWith(".yaml")).map((f) => f.slice(0, -5))); } catch { /* flotte illisible : aucun nom reconnu */ }
  flotteLue = { dossier, noms };
  return noms;
}

/** Le type de la fiche : nom de la flotte ou d'un intégré fixe, `generique`, `propre` (nom non recopié), ou null s'il est inconnu. */
export function typeDe(agentType, { flotte = flotteDuPilot() } = {}) {
  if (typeof agentType !== "string") return null;
  const t = agentType.trim();
  if (GENERIQUES.has(t)) return "generique";
  if (INTEGRES_FIXES.has(t) || flotte.has(t)) return t;
  return "propre";
}

/** Le projet de la fiche par `pseudoProduit()` sur le nom de l'arbre principal : { projet, lacune }. Jamais le nom réel. */
export function projetDe(racine, { pseudo = pseudoProduit } = {}) {
  let principal = racine;
  try { principal = arbrePrincipal(racine); } catch { /* racine illisible : elle-même */ }
  const nom = principal ? basename(String(principal)) : "";
  let p = null;
  if (nom) { try { p = pseudo(nom, { racine: principal }); } catch { p = null; } }
  if (!p && EST_EMETTEUR_FORGE.test(nom)) p = nom;
  if (typeof p === "string" && PROJET_ADMIS.some((re) => re.test(p))) return { projet: p, lacune: null };
  return { projet: null, lacune: "pseudonyme du projet indisponible : son nom n'est pas recopié" };
}

/** Le fichier des fiches : `FORGE_FICHES_AGENTS`, sinon celui du pilot ou du produit qui porte `racine`, sinon null. */
export function cheminFiches(racine, env = process.env) {
  const designe = nonVide(env?.[VARIABLE_DESTINATION]);
  if (designe) return designe;
  if (!racine) return null;
  try {
    if (existsSync(join(racine, "bootstrap.mjs")) && existsSync(join(racine, "oracles", "hook-restitution.mjs"))) return join(racine, ...FICHIER_PILOT.split("/"));
    if (existsSync(join(racine, "forge"))) return join(racine, ...FICHIER_PRODUIT.split("/"));
  } catch { /* racine illisible : aucune fiche */ }
  return null;
}

/** Le type déclaré par le harnais à côté de la transcription (`.meta.json`) ; sa description n'est jamais lue. */
function typeDuMeta(chemin) {
  if (!chemin) return null;
  try { return nonVide(JSON.parse(readFileSync(chemin.replace(/\.jsonl$/i, ".meta.json"), "utf8"))?.agentType); } catch { return null; }
}

const transcriptSur = (e) => { try { return transcriptDeLAgent(e); } catch { return null; } };

/**
 * La fiche d'un agent, construite à partir de l'entrée du hook SubagentStop. Ne lève pas pour une transcription absente, illisible ou
 * trop grande : la fiche est partielle et ses lacunes le disent. Options injectables pour les bancs : `env`, `maintenant`, `racine`,
 * `pseudo`, `borne`, `flotte`.
 */
export function construireFiche(entree, { env = process.env, maintenant = new Date(), racine = null, pseudo = pseudoProduit, borne = BORNE_LECTURE, flotte = null } = {}) {
  const e = entree && typeof entree === "object" ? entree : {};
  const lacunes = [];
  const s = sessionCourante({ entree: e, env });
  if (!s.court) lacunes.push("session inconnue");
  const chemin = transcriptSur(e);
  const idBrut = nonVide(e.agent_id) ?? (chemin ? basename(chemin, ".jsonl").replace(/^agent-/, "") : null);
  const agentId = idBrut && ID_AGENT.test(idBrut) ? idBrut : null;
  if (!agentId) lacunes.push("identifiant d'agent absent");
  const type = typeDe(nonVide(e.agent_type) ?? typeDuMeta(chemin) ?? (typeof e.agent_type === "string" ? e.agent_type : null), flotte ? { flotte } : undefined);
  if (type === null) lacunes.push("type d'agent inconnu");
  let lu = null;
  if (!chemin) lacunes.push("transcription de l'agent introuvable");
  else {
    try { lu = lireTranscription(chemin, { borne }); } catch { lacunes.push("transcription de l'agent illisible"); }
  }
  if (lu?.bornee) lacunes.push(`transcription de ${taille(lu.octets)} au-delà de la borne de lecture de ${taille(borne)} : jetons, appels d'outils et frictions non relevés`);
  if (lu?.illisibles) lacunes.push(`${lu.illisibles} ligne(s) illisible(s) de la transcription sautée(s)`);
  if (lu && !lu.entrees.length) lacunes.push("transcription vide");
  const vide = { modele: null, effort: null, duree_s: null, jetons_entree: null, jetons_sortie: null, appels_outils: null, frictions: null };
  const m = lu && lu.entrees.length ? mesurer(lu.entrees, { avecTotaux: !lu.bornee }) : vide;
  if (lu && lu.entrees.length && !lu.bornee && m.frictions === null) lacunes.push("frictions non relevées : panne du relevé");
  const { cause } = causeFin(lu ? lu.entrees : [], { dernierMessage: e.last_assistant_message });
  if (cause === null) lacunes.push("cause de fin indéterminée");
  const projet = projetDe(racine ?? racineDuProjet(e.cwd, env), { pseudo });
  if (projet.lacune) lacunes.push(projet.lacune);
  return {
    schema: SCHEMA, ts: maintenant.toISOString(), session: s.court, session_source: s.source, agent_id: agentId, type,
    modele: m.modele, effort: m.effort ?? nonVide(e.effort?.level), duree_s: m.duree_s,
    jetons_entree: m.jetons_entree, jetons_sortie: m.jetons_sortie, appels_outils: m.appels_outils,
    verdict_livrable: null, verdict_relecture: null, frictions: m.frictions, cause_fin: cause, projet: projet.projet,
    partielle: lacunes.length > 0, lacunes,
  };
}

/** Ajoute la fiche au fichier, en une ligne. Ne lève jamais : { ecrit, chemin, erreur? }. */
export function ecrireFiche(chemin, fiche) {
  try {
    mkdirSync(dirname(chemin), { recursive: true });
    appendFileSync(chemin, JSON.stringify(fiche) + "\n", "utf8");
    return { ecrit: true, chemin };
  } catch (err) { return { ecrit: false, chemin, erreur: String(err?.message || err) }; }
}

/**
 * Ce que fait le hook SubagentStop : { ecrit, chemin?, fiche?, motif?, erreur? }. Aucune fiche hors du pilot et d'un produit, ni pour une
 * entrée qui ne désigne aucun agent, ni pour un agent interne du harnais (`agent_type` vide, sans type au `.meta.json`). Une panne de
 * construction écrit une fiche minimale, marquée partielle.
 */
export function traiterFinDAgent(entree, { env = process.env, maintenant = new Date(), pseudo = pseudoProduit, borne = BORNE_LECTURE } = {}) {
  const e = entree && typeof entree === "object" && !Array.isArray(entree) ? entree : null;
  if (!e) return { ecrit: false, motif: "entrée du hook illisible : aucun agent à ficher" };
  if (!nonVide(e.agent_id) && !nonVide(e.agent_transcript_path)) return { ecrit: false, motif: "entrée du hook sans agent : aucune fiche" };
  const racine = racineDuProjet(e.cwd, env);
  const chemin = cheminFiches(racine, env);
  if (!chemin) return { ecrit: false, motif: "hors du pilot et de tout produit : aucune fiche" };
  if (e.agent_type === "" && !typeDuMeta(transcriptSur(e))) return { ecrit: false, motif: "agent interne du harnais (agent_type vide) : aucune fiche" };
  let fiche;
  try { fiche = construireFiche(e, { env, maintenant, racine, pseudo, borne }); } catch {
    const s = (() => { try { return sessionCourante({ entree: e, env }); } catch { return { court: null, source: null }; } })();
    const ts = (() => { try { return maintenant.toISOString(); } catch { return new Date().toISOString(); } })();
    const id = nonVide(e.agent_id);
    fiche = { schema: SCHEMA, ts, session: s.court, session_source: s.source, agent_id: id && ID_AGENT.test(id) ? id : null,
      type: null, modele: null, effort: null, duree_s: null, jetons_entree: null, jetons_sortie: null, appels_outils: null,
      verdict_livrable: null, verdict_relecture: null, frictions: null, cause_fin: null, projet: null, partielle: true, lacunes: ["panne de construction de la fiche"] };
  }
  return { ...ecrireFiche(chemin, fiche), fiche };
}
