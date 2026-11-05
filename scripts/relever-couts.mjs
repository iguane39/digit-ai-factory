#!/usr/bin/env node
/**
 * relever-couts.mjs — LES JETONS ET LE TEMPS D'UNE SESSION SE RELÈVENT À SA FIN, CHEZ LE PRODUIT, AVANT QUE LA PURGE
 * NE LES EFFACE (TF-2181, option O2 de l'étude `output/03-etudes/Digit-AI - Étude - Suivi des temps et des couts par
 * produit - 20261105a.md` ; GO humain « A1 » du 05/11/2026 ; charge lue par D-177 du 05/11/2026, « A, b & c séparés »).
 *
 * LE FAIT. Mesuré le 05/11/2026 : les 11 journaux de run des produits ne portent aucune clé de jetons ; Claude Code
 * supprime les transcriptions de plus de 30 jours (`cleanupPeriodDays`, absent des 2 profils), et 14 runs sur 19 avaient
 * déjà perdu tout ou partie des leurs ; le pilot porte 41,4 % des 18,03 milliards de jetons relevés, sans produit.
 *
 * CE QU'IL ÉCRIT, une ligne `couts@1` par relevé de session (une ligne plus récente pour la même session la remplace
 * à la lecture ; une session inchangée n'est pas réécrite) :
 *   · `sessionId`, bornes horaires, nombre de messages, sous-agents ;
 *   · les jetons en 4 catégories, sessions principales et sous-agents à part, et par modèle (écriture de cache 5 min
 *     et 1 h séparées), une fois par `message.id` sur sa dernière ligne (méthode de `relever-flotte.mjs`) ;
 *   · le temps actif aux 3 seuils de `references/SUIVI-COUTS.json`, session et sous-agents à part ;
 *   · la charge en 3 indicateurs séparés, jamais additionnés (D-177) : (a) les interventions humaines du journal de
 *     run dans la fenêtre de la session, (b) le temps humain, écarts qui précèdent un message humain bornés au plafond
 *     du référentiel, (c) le temps agent, temps actif de la session et de ses sous-agents au seuil retenu ;
 *   · la ventilation par run et par étape, lue au journal `forge/ledger.jsonl` (règle R4 de l'étude) ;
 *   · au pilot, `pour` : le produit servi, déclaré par `--pour <pseudonyme>`, sinon « Factory » (règle R3).
 * Aucun montant n'y est écrit : le coût équivalent au tarif public se calcule à la lecture (`--vue`), depuis les prix
 * datés du référentiel, pour qu'un prix périmé ne se fige jamais dans un relevé.
 *
 * Usage :
 *   node scripts\relever-couts.mjs --session <transcription.jsonl> [--racine <projet>] [--sortie <f.jsonl>]
 *   node scripts\relever-couts.mjs --rattraper <dossier de transcriptions> [--racine <projet>] [--sauf <sessionId>] [--budget-s N]
 *   node scripts\relever-couts.mjs --pour <pseudonyme> [--session-id <id>]        (au pilot ; défaut : CLAUDE_CODE_SESSION_ID)
 *   node scripts\relever-couts.mjs --vue <couts-<poste>.jsonl | dossier> [--json]
 *   options communes : [--referentiel <SUIVI-COUTS.json>]
 * Exit : 0 relevé rendu ou rien à relever · 2 option inconnue ou fichier illisible.
 * NON JUGÉ (déclaré) : le second poste et les profils absents de ce poste ; une session tuée avant sa fin, relevée à
 * l'ouverture suivante seulement ; la justesse du seuil d'inactivité, comparée à la télémétrie à revue_prevue ; le
 * produit d'une session du pilot sans marqueur, rangée à la Factory ; les sessions des forges.
 */
import { existsSync, readFileSync, readdirSync, statSync, appendFileSync, mkdirSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { hostname } from "node:os";

export const VERSION = "1.0.0";
const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(ICI, "..");
export const REFERENTIEL = join(PILOT, "references", "SUIVI-COUTS.json");
const CAT = ["input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens", "output_tokens"];
const vide = () => Object.fromEntries(CAT.map((c) => [c, 0]));
const somme = (o) => CAT.reduce((s, c) => s + (o[c] || 0), 0);

export function lireReferentiel(chemin = REFERENTIEL) {
  return JSON.parse(readFileSync(chemin, "utf8"));
}

/** Lignes JSON d'un fichier, les illisibles sautées. */
function lignes(chemin) {
  if (!existsSync(chemin)) return [];
  const out = [];
  for (const l of readFileSync(chemin, "utf8").split("\n")) {
    if (!l.trim()) continue;
    try { out.push(JSON.parse(l)); } catch { /* ligne illisible : sautée */ }
  }
  return out;
}

/** Un message humain : `user` en texte, ni résultat d'outil, ni méta, ni injection de commande ou de rappel. */
export function estHumain(o) {
  if (o.type !== "user" || o.isMeta || o.isSidechain) return false;
  const injecte = (s) => /^<(command-|local-command|system-reminder)/.test(String(s || "").trim());
  const c = o.message?.content;
  if (typeof c === "string") return !injecte(c);
  if (Array.isArray(c)) return !c.some((b) => b.type === "tool_result") && c.some((b) => b.type === "text" && !injecte(b.text));
  return false;
}

/** Une transcription : horodatages des messages, messages humains, réponses dédoublonnées par `message.id`. */
export function lireTranscription(chemin) {
  const temps = [], humains = [], reponses = new Map();
  for (const o of lignes(chemin)) {
    if (!o.timestamp || (o.type !== "user" && o.type !== "assistant")) continue;
    const t = Date.parse(o.timestamp);
    if (Number.isNaN(t)) continue;
    temps.push(t);
    if (estHumain(o)) humains.push(t);
    const u = o.message?.usage;
    if (o.type === "assistant" && u && o.message?.id) reponses.set(o.message.id, { t, u, modele: o.message.model || "inconnu" });
  }
  temps.sort((a, b) => a - b);
  return { temps, humains: new Set(humains), reponses: [...reponses.values()] };
}

/** Jalons du journal de run : intervalles d'étape (R4), runs, interventions humaines. */
export function lireJournal(chemin) {
  const ev = lignes(chemin).filter((o) => o.ts && o.type).map((o) => ({ ...o, t: Date.parse(o.ts) })).filter((o) => !Number.isNaN(o.t));
  ev.sort((a, b) => a.t - b.t);
  const runs = [], etapes = [], interventions = [];
  let run = null, dernierJalon = null;
  const ouvertes = new Map();
  for (const o of ev) {
    if (o.type === "run_open") {
      run = { id: o.run || o.run_id || `run_open#${o.seq ?? runs.length + 1}`, debut: o.t, fin: Infinity };
      runs.push(run); dernierJalon = o.t; ouvertes.clear();
    } else if (o.type === "run_close") {
      if (run) run.fin = o.t;
      run = null; dernierJalon = o.t;
    } else if (o.type === "etape_open") {
      ouvertes.set(o.etape || "?", o.t); dernierJalon = o.t;
    } else if (o.type === "etape_close") {
      const nom = o.etape || "?";
      const debut = ouvertes.has(nom) ? ouvertes.get(nom) : (dernierJalon ?? o.t);
      ouvertes.delete(nom);
      etapes.push({ run: run?.id ?? "hors run", etape: nom, debut, fin: o.t });
      dernierJalon = o.t;
    } else if (o.type === "question_humain" || o.type === "reponse_humain") {
      interventions.push({ t: o.t, type: o.type });
    }
  }
  const enCours = [...ouvertes.entries()].map(([etape, debut]) => ({ run: run?.id ?? "hors run", etape: `${etape} (ouverte)`, debut, fin: Infinity }));
  return { runs, etapes: [...etapes, ...enCours], interventions };
}

/** Le run et l'étape d'un instant (R4) ; hors de tout run : « hors run ». */
export function ranger(t, journal) {
  const e = journal.etapes.find((x) => t > x.debut && t <= x.fin) || journal.etapes.find((x) => t >= x.debut && t <= x.fin);
  if (e) return { run: e.run, etape: e.etape };
  const r = journal.runs.find((x) => t >= x.debut && t <= x.fin);
  return { run: r ? r.id : "hors run", etape: "hors étape" };
}

/** Temps actif : somme des écarts consécutifs au plus égaux au seuil. */
export function tempsActif(temps, seuil) {
  let s = 0;
  for (let i = 1; i < temps.length; i++) { const g = (temps[i] - temps[i - 1]) / 1000; if (g <= seuil) s += g; }
  return s;
}

const arrondi = (x) => Math.round(x * 10) / 10;

/** Le relevé d'une session : sa transcription principale et ses sous-agents (`<session>/subagents/*.jsonl`). */
export function releverSession(cheminSession, { referentiel = lireReferentiel(), journal = null, pour = null } = {}) {
  const sessionId = basename(cheminSession, ".jsonl");
  const principal = lireTranscription(cheminSession);
  const dirSous = join(dirname(cheminSession), sessionId, "subagents");
  const sous = existsSync(dirSous) ? readdirSync(dirSous).filter((f) => f.endsWith(".jsonl")).map((f) => lireTranscription(join(dirSous, f))) : [];
  if (principal.temps.length === 0) return null;
  const debut = principal.temps[0], fin = Math.max(principal.temps.at(-1), ...sous.map((s) => s.temps.at(-1) ?? 0));
  const { retenu, voisins } = referentiel.seuils_inactivite_s;
  const seuils = [retenu, ...voisins];
  const plafond = referentiel.plafond_temps_humain_s.valeur;
  const j = journal || { runs: [], etapes: [], interventions: [] };

  const jetons = { principal: vide(), sous_agents: vide() };
  const modeles = {};
  const parEtape = new Map();
  const cle = (r) => `${r.run}\u0000${r.etape}`;
  const etapeDe = (t) => { const r = ranger(t, j); const k = cle(r); if (!parEtape.has(k)) parEtape.set(k, { ...r, jetons: 0, temps_actif_s: 0 }); return parEtape.get(k); };
  const compter = (rep, genre) => {
    const u = rep.u;
    for (const c of CAT) jetons[genre][c] += u[c] || 0;
    const prix = referentiel.prix?.[rep.modele];
    const prompt = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
    const nom = prix?.seuil_prompt && prompt > prix.seuil_prompt ? `${rep.modele}>${prix.seuil_prompt}` : rep.modele;
    const m = (modeles[nom] ||= { reponses: 0, entree: 0, ecriture_cache_5m: 0, ecriture_cache_1h: 0, ecriture_cache_sans_duree: 0, lecture_cache: 0, sortie: 0 });
    m.reponses++;
    m.entree += u.input_tokens || 0;
    m.lecture_cache += u.cache_read_input_tokens || 0;
    m.sortie += u.output_tokens || 0;
    const cc = u.cache_creation;
    if (cc) { m.ecriture_cache_5m += cc.ephemeral_5m_input_tokens || 0; m.ecriture_cache_1h += cc.ephemeral_1h_input_tokens || 0; }
    else m.ecriture_cache_sans_duree += u.cache_creation_input_tokens || 0;
    etapeDe(rep.t).jetons += somme(u);
  };
  for (const r of principal.reponses) compter(r, "principal");
  for (const s of sous) for (const r of s.reponses) compter(r, "sous_agents");

  const temps_actif_s = {};
  for (const s of seuils) temps_actif_s[s] = { session: arrondi(tempsActif(principal.temps, s)), sous_agents: arrondi(sous.reduce((a, x) => a + tempsActif(x.temps, s), 0)) };
  for (const x of [principal, ...sous]) for (let i = 1; i < x.temps.length; i++) {
    const g = (x.temps[i] - x.temps[i - 1]) / 1000;
    if (g <= retenu) etapeDe(x.temps[i]).temps_actif_s += g;
  }
  let temps_humain = 0, bornes = 0;
  for (let i = 1; i < principal.temps.length; i++) {
    if (!principal.humains.has(principal.temps[i])) continue;
    const g = (principal.temps[i] - principal.temps[i - 1]) / 1000;
    if (g > plafond) bornes++;
    temps_humain += Math.min(g, plafond);
  }
  const inter = j.interventions.filter((x) => x.t >= debut && x.t <= fin);

  return {
    schema: "couts@1",
    outil: `relever-couts ${VERSION}`,
    referentiel: `${referentiel.schema} ${referentiel.version}`,
    releve_le: new Date().toISOString(),
    poste: hostname(),
    sessionId,
    ...(pour ? { pour } : {}),
    debut: new Date(debut).toISOString(),
    fin: new Date(fin).toISOString(),
    messages: principal.temps.length,
    sous_agents: sous.length,
    jetons: { ...jetons, total: somme(jetons.principal) + somme(jetons.sous_agents) },
    modeles,
    temps_actif_s,
    charge: {
      interventions_humaines: { questions: inter.filter((x) => x.type === "question_humain").length, reponses: inter.filter((x) => x.type === "reponse_humain").length },
      temps_humain_s: arrondi(temps_humain),
      temps_humain_ecarts_bornes: bornes,
      temps_agent_s: arrondi(temps_actif_s[retenu].session + temps_actif_s[retenu].sous_agents),
    },
    par_etape: [...parEtape.values()].map((e) => ({ ...e, temps_actif_s: arrondi(e.temps_actif_s) })),
  };
}

/** Le nom du poste dans un nom de fichier : un fichier par poste, pour que 2 postes n'écrivent jamais la même ligne. */
export const poste = (nom = hostname()) => String(nom).replace(/[^A-Za-z0-9_-]/g, "-");

/**
 * Où écrire, et pour qui : chez un produit `forge/couts-<poste>.jsonl` ; au pilot
 * `todo/observabilite/couts-pilot-<poste>.jsonl`. Un fichier par poste : 2 postes qui ajoutent chacun leurs lignes au même
 * fichier se heurtent à chaque fusion git, comme les registres du pilot l'ont montré ; la vue lit tous les fichiers.
 */
export function cible(racine, nomPoste = poste()) {
  const auPilot = existsSync(join(racine, "bootstrap.mjs")) && existsSync(join(racine, "scripts", "relever-couts.mjs")) && !existsSync(join(racine, "forge", "ledger.jsonl"));
  return auPilot
    ? { auPilot, sortie: join(racine, "todo", "observabilite", `couts-pilot-${nomPoste}.jsonl`), marqueurs: join(racine, "todo", "observabilite", `couts-marqueurs-${nomPoste}.jsonl`), journal: null }
    : { auPilot, sortie: join(racine, "forge", `couts-${nomPoste}.jsonl`), marqueurs: null, journal: join(racine, "forge", "ledger.jsonl") };
}

/** Le dernier relevé de chaque session déjà écrit. */
function dejaReleves(sortie) {
  const m = new Map();
  for (const o of lignes(sortie)) if (o.schema === "couts@1" && o.sessionId) m.set(o.sessionId, o);
  return m;
}

/** Relève une session et l'écrit, sauf si le dernier relevé porte déjà la même fin et le même nombre de messages. */
export function ecrireReleve(cheminSession, { racine, sortie, referentiel = lireReferentiel() } = {}) {
  const c = cible(racine);
  const out = sortie || c.sortie;
  const id = basename(cheminSession, ".jsonl");
  const pour = c.marqueurs ? (lignes(c.marqueurs).filter((x) => x.sessionId === id).at(-1)?.pour ?? "Factory") : null;
  const journal = c.journal && existsSync(c.journal) ? lireJournal(c.journal) : null;
  const r = releverSession(cheminSession, { referentiel, journal, pour });
  if (!r) return { ecrit: false, motif: "session sans message" };
  const avant = dejaReleves(out).get(id);
  if (avant && avant.fin === r.fin && avant.messages === r.messages && (avant.pour ?? null) === (r.pour ?? null)) return { ecrit: false, motif: "déjà relevée", releve: avant };
  mkdirSync(dirname(out), { recursive: true });
  appendFileSync(out, JSON.stringify(r) + "\n", "utf8");
  return { ecrit: true, sortie: out, releve: r };
}

/** Rattrapage : toute session du dossier qui n'a pas son relevé à jour, la plus ancienne d'abord, dans le budget. */
export function rattraper(dossier, { racine, sauf = null, budgetS = 40, referentiel = lireReferentiel() } = {}) {
  const t0 = Date.now();
  const out = cible(racine).sortie;
  const deja = dejaReleves(out);
  const fichiers = existsSync(dossier) ? readdirSync(dossier).filter((f) => f.endsWith(".jsonl")).map((f) => join(dossier, f)) : [];
  fichiers.sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs);
  const bilan = { examinees: 0, ecrites: 0, a_jour: 0, hors_budget: 0 };
  for (const f of fichiers) {
    const id = basename(f, ".jsonl");
    if (id === sauf) continue;
    if ((Date.now() - t0) / 1000 > budgetS) { bilan.hors_budget++; continue; }
    const d = deja.get(id);
    if (d && Date.parse(d.fin) >= statSync(f).mtimeMs - 1000) { bilan.a_jour++; continue; }
    bilan.examinees++;
    if (ecrireReleve(f, { racine, referentiel }).ecrit) bilan.ecrites++;
  }
  return bilan;
}

/** Marqueur du pilot (R3) : la session déclare le produit qu'elle sert, sous son pseudonyme. */
export function marquer(racine, sessionId, pour) {
  const c = cible(racine);
  if (!c.auPilot) throw new Error("--pour ne s'emploie qu'au pilot : chez un produit, le relevé appartient déjà au produit");
  if (!/^(Produit-\d{2,3}|Factory)$/.test(pour)) throw new Error(`--pour attend un pseudonyme « Produit-NN » ou « Factory », jamais un nom réel (reçu « ${pour} »)`);
  mkdirSync(dirname(c.marqueurs), { recursive: true });
  appendFileSync(c.marqueurs, JSON.stringify({ sessionId, pour, ts: new Date().toISOString() }) + "\n", "utf8");
  return c.marqueurs;
}

/** Coût équivalent au tarif public d'un bloc de modèle ; null si le prix manque. */
export function coutModele(nom, m, referentiel) {
  // Un bloc sans aucun jeton coûte 0, prix connu ou non : Claude Code écrit des réponses `<synthetic>` à 0 jeton
  // (interruption, erreur d'API) ; 3 au pilot le 05/11/2026, qui rendaient tout le coût « non calculable ».
  if (["entree", "ecriture_cache_5m", "ecriture_cache_1h", "ecriture_cache_sans_duree", "lecture_cache", "sortie"].every((k) => !m[k])) return 0;
  const [base, seuil] = nom.split(">");
  const p0 = referentiel.prix?.[base];
  if (!p0) return null;
  const p = seuil ? p0.au_dela : p0;
  const usd = (m.entree * p.entree + m.ecriture_cache_5m * p.ecriture_cache_5m + (m.ecriture_cache_1h + m.ecriture_cache_sans_duree) * p.ecriture_cache_1h
    + m.lecture_cache * p.lecture_cache + m.sortie * p.sortie) / 1e6;
  return usd;
}

/** Les fichiers de relevé d'une vue : le fichier nommé, ou tous les `couts*.jsonl` d'un dossier, marqueurs exclus. */
export function fichiersDeVue(chemin) {
  if (existsSync(chemin) && statSync(chemin).isDirectory())
    return readdirSync(chemin).filter((f) => /^couts.*\.jsonl$/.test(f) && !f.startsWith("couts-marqueurs")).map((f) => join(chemin, f));
  return [chemin];
}

/** Vue : le dernier relevé de chaque session, agrégé par produit servi, par run et par étape ; coût calculé à la lecture. */
export function vue(chemin, referentiel = lireReferentiel()) {
  const parSession = new Map();
  for (const f of fichiersDeVue(chemin)) for (const [id, o] of dejaReleves(f)) parSession.set(id, o);
  const sessions = [...parSession.values()];
  const runs = new Map();
  let usd = 0;
  const nonCalculables = new Set();
  const agg = { sessions: sessions.length, jetons: 0, temps_agent_s: 0, temps_humain_s: 0, questions: 0, reponses: 0 };
  for (const s of sessions) {
    agg.jetons += s.jetons.total; agg.temps_agent_s += s.charge.temps_agent_s; agg.temps_humain_s += s.charge.temps_humain_s;
    agg.questions += s.charge.interventions_humaines.questions; agg.reponses += s.charge.interventions_humaines.reponses;
    for (const [nom, m] of Object.entries(s.modeles)) { const c = coutModele(nom, m, referentiel); if (c === null) nonCalculables.add(nom); else usd += c; }
    for (const e of s.par_etape) {
      const k = `${s.pour ? s.pour + " · " : ""}${e.run}`;
      const r = runs.get(k) || { run: k, jetons: 0, temps_actif_s: 0, etapes: {} };
      r.jetons += e.jetons; r.temps_actif_s += e.temps_actif_s;
      r.etapes[e.etape] = (r.etapes[e.etape] || 0) + e.jetons;
      runs.set(k, r);
    }
  }
  return { ...agg, cout_equivalent_usd: nonCalculables.size ? null : Math.round(usd * 100) / 100, cout_partiel_usd: Math.round(usd * 100) / 100,
    modeles_non_calculables: [...nonCalculables], prix_lus_le: referentiel.sources?.[0]?.lu_le ?? null, runs: [...runs.values()] };
}

function main(argv) {
  const a = { referentiel: REFERENTIEL, racine: process.env.CLAUDE_PROJECT_DIR || process.cwd(), budget: 40, json: false };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i], val = () => argv[++i];
    if (x === "--session") a.session = val();
    else if (x === "--rattraper") a.rattraper = val();
    else if (x === "--racine") a.racine = val();
    else if (x === "--sortie") a.sortie = val();
    else if (x === "--sauf") a.sauf = val();
    else if (x === "--budget-s") a.budget = Number(val());
    else if (x === "--pour") a.pour = val();
    else if (x === "--session-id") a.sessionId = val();
    else if (x === "--vue") a.vue = val();
    else if (x === "--referentiel") a.referentiel = val();
    else if (x === "--json") a.json = true;
    else return { code: 2, sortie: `relever-couts : option inconnue ${x}` };
  }
  let ref;
  try { ref = lireReferentiel(a.referentiel); } catch (e) { return { code: 2, sortie: `relever-couts : référentiel illisible (${a.referentiel}) : ${e.message}` }; }
  if (a.pour) {
    const id = a.sessionId || process.env.CLAUDE_CODE_SESSION_ID;
    if (!id) return { code: 2, sortie: "relever-couts : --pour exige --session-id ou CLAUDE_CODE_SESSION_ID" };
    try { return { code: 0, sortie: `relever-couts : session ${id} marquée pour ${a.pour} (${marquer(a.racine, id, a.pour)})` }; }
    catch (e) { return { code: 2, sortie: `relever-couts : ${e.message}` }; }
  }
  if (a.vue) {
    const v = vue(a.vue, ref);
    if (a.json) return { code: 0, sortie: JSON.stringify(v, null, 1) };
    const cout = v.cout_equivalent_usd === null ? `non calculable (modèles sans prix : ${v.modeles_non_calculables.join(", ")} ; partiel ${v.cout_partiel_usd} $)` : `${v.cout_equivalent_usd} $`;
    return { code: 0, sortie: [`relever-couts ${VERSION} — vue de ${a.vue}`,
      `  ${v.sessions} session(s), ${v.jetons.toLocaleString("fr-FR")} jetons ; coût équivalent au tarif public : ${cout}, prix lus le ${v.prix_lus_le}`,
      `  charge (D-177, 3 indicateurs séparés) : ${v.questions} questions et ${v.reponses} réponses humaines · temps humain ${Math.round(v.temps_humain_s)} s · temps agent ${Math.round(v.temps_agent_s)} s`,
      ...v.runs.map((r) => `  ${r.run} : ${r.jetons.toLocaleString("fr-FR")} jetons, ${Math.round(r.temps_actif_s)} s actives, ${Object.keys(r.etapes).length} étape(s)`)].join("\n") };
  }
  if (a.session) {
    if (!existsSync(a.session)) return { code: 2, sortie: `relever-couts : transcription introuvable ${a.session}` };
    const r = ecrireReleve(a.session, { racine: a.racine, sortie: a.sortie, referentiel: ref });
    return { code: 0, sortie: r.ecrit ? `relever-couts : session ${basename(a.session, ".jsonl")} relevée (${r.releve.jetons.total} jetons) → ${r.sortie}` : `relever-couts : ${r.motif}` };
  }
  if (a.rattraper) {
    const b = rattraper(a.rattraper, { racine: a.racine, sauf: a.sauf, budgetS: a.budget, referentiel: ref });
    return { code: 0, sortie: `relever-couts : rattrapage — ${b.ecrites} relevé(s) écrit(s), ${b.a_jour} à jour, ${b.hors_budget} hors budget` };
  }
  return { code: 2, sortie: "usage : node scripts\\relever-couts.mjs --session <f.jsonl> | --rattraper <dossier> | --pour <pseudonyme> | --vue <couts-<poste>.jsonl | dossier> [--json]" };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = main(process.argv.slice(2));
  (r.code === 0 ? process.stdout : process.stderr).write(r.sortie + "\n");
  process.exit(r.code);
}
