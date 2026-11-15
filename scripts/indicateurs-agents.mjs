#!/usr/bin/env node
/**
 * indicateurs-agents.mjs — CHAQUE INDICATEUR DE DÉLAI DES AGENTS EST GARDÉ PAR UN INDICATEUR DE QUALITÉ, MESURÉ CONTRE UNE BASE ET UN
 * SEUIL DATÉS (décision humaine D-219 (e) du 15/11/2026, TF-2563, mandat 20261115b, lot L4, étage O3 ; étude `output/03-etudes/Digit-AI -
 * Étude - Amelioration continue des agents par leurs lecons - 20261114d.md`, section Q4).
 *
 * LE FAIT (étude, Q4) : « Chaque optimisation qui réduit un délai ou un coût doit être gardée par un indicateur de qualité, pour que le
 * gain de vitesse ne se paie pas en défauts. » Quatre paires y sont écrites, avec le seuil de chaque gardien fixé avant toute mesure ;
 * aucune n'était calculée, et deux gardiens n'avaient pas de données : le lien agent → verdict manquait (les lots L1 et L2 l'ont construit).
 *
 * CE QU'IL FAIT. Il calcule les 8 indicateurs des 4 paires sur une fenêtre (`fenetre_jours` du référentiel, 14 jours) :
 *   · P1 : durée médiane d'un agent, gardée par la part des agents dont le verdict de livrable noté est PASS ;
 *   · P2 : jetons médians par agent (entrée et sortie de la fiche), gardés par la part « sert » des relectures d'intention notées ;
 *   · P3 : frictions par session avec sous-agents, gardées par la part de ces frictions suivies d'un retour consigné ;
 *   · P4 : délai du lancement au premier point de suivi, gardé par la part des agents suivis (au moins un point).
 * Sources, lues et jamais réécrites : les fiches d'exécution (`releverFiches` de `relever-flotte.mjs`, la lecture du lot L2) ; les journaux
 * de frictions (`.claude/frictions.jsonl` du pilot, `forge/frictions.jsonl` de chaque produit du parc) et le ledger de chaque produit ; le
 * relevé de suivi (`juger` d'`oracles/oracle-suivi-agents.mjs`, sur les transcriptions des profils du poste). Les définitions, les bases et
 * les seuils se lisent dans `references/INDICATEURS-AGENTS.json`, que ce script n'écrit JAMAIS : une base ou un seuil se change par un
 * commit motivé, jamais par la boucle (étude, Q5 : « Modifier le seuil d'un indicateur de qualité » reste humain).
 *   · un indicateur que les données ne permettent pas de calculer se dit « non mesurable » avec sa raison, jamais une valeur inventée ;
 *   · une valeur mesurable dont la base manque au référentiel se dit « base à poser », et un seuil relatif à la base n'est pas évalué ;
 *   · un indicateur de délai n'a pas de seuil (l'étude n'en fixe pas) : il se compare à sa base, c'est son gardien qui alerte ;
 *   · P1 et P2 se comparent à la base sur les seuls types d'agent de la base (« comparaison appariée », étude, Q4).
 * Chaque appel réécrit la page `todo/observabilite/indicateurs-agents.md` (vue générée, non versionnée : D-4 (a), `.gitignore` ;
 * `FORGE_PAGE_INDICATEURS_AGENTS` ou `--page` la déroutent, pour un banc). L'ouverture du pilot le joue (`oracles/hook-ouverture.mjs`) et
 * recopie `ligne_alerte` en une ligne quand un seuil est franchi : une alerte, jamais un blocage.
 *
 * Usage : node scripts\indicateurs-agents.mjs [--json] [--jours N | --depuis AAAA-MM-JJ] [--referentiel <INDICATEURS-AGENTS.json>]
 *           [--fiches <fiches-agents.jsonl>]… [--racine <dossier du pilot>] [--parc <dossier>] [--suivi <relevé.json> | --profils <d1,d2>]
 *           [--page <page.md>]
 *   `--racine` : le pilot dont se lisent les fiches et les frictions, et où la page s'écrit (défaut : ce dépôt) ; `--parc` : le dossier des
 *   produits (défaut : le parent de la racine) ; `--suivi` : un relevé à la forme de la sortie d'`oracle-suivi-agents.mjs`, lu au lieu des
 *   transcriptions ; `--profils` : les profils de configuration où lire les transcriptions (défaut : ceux de l'oracle de suivi).
 * Exit : 0 relevé rendu, seuil franchi ou non (l'alerte est dans la sortie : un relevé n'échoue pas, il dit) · 2 option inconnue, valeur
 *        invalide ou référentiel illisible : rien n'est calculé et la page n'est pas réécrite.
 * NON JUGÉ (déclaré, repris à la sortie) : la complexité des tâches ; les fiches, frictions et transcriptions d'un autre poste ; la justesse
 * d'un verdict noté ou d'un retour consigné ; et ce que chaque paire déclare au référentiel (`non_juge`).
 * Recette : `scripts/indicateurs-agents.test.mjs`.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dureeLisible, releverFiches, sourcesDesFiches } from "./relever-flotte.mjs";
import { juger, profilsParDefaut, SEUIL_MIN, transcriptsDepuis } from "../oracles/oracle-suivi-agents.mjs";

export const VERSION = "1.0.0";
export const SCHEMA_REFERENTIEL = "pilot/indicateurs-agents@1";
const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(ICI, "..");
export const REFERENTIEL_DEFAUT = join(PILOT, "references", "INDICATEURS-AGENTS.json");
export const PAGE = "todo/observabilite/indicateurs-agents.md";
export const VARIABLE_PAGE = "FORGE_PAGE_INDICATEURS_AGENTS";
const JOUR_MS = 86400000;
export const RAISON_BASE_A_POSER = "valeur mesurable, base absente du référentiel : elle se pose par un commit motivé, jamais par la boucle";
export const NON_JUGE = Object.freeze([
  "la complexité des tâches : aucune fiche ne la porte, la comparaison appariée ne tient que les types d'agent",
  "les fiches, les frictions et les transcriptions d'un autre poste, absentes de ce disque, et celles d'un produit rangé hors du parc",
  "la justesse d'un verdict noté sur une fiche, et celle d'un retour consigné",
  "une fiche sans identifiant de session : elle compte aux paires P1 et P2, pas aux sessions de la paire P3",
]);

/** La médiane, règle de relever-flotte.mjs : la valeur de rang n/2 arrondi par défaut (une valeur observée, jamais une moyenne de deux). */
export const mediane = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };
const part = (k, n) => (n ? k / n : null);
const instant = (ts) => { const t = Date.parse(ts ?? ""); return Number.isFinite(t) ? t : null; };
const session8 = (s) => (typeof s === "string" && s.trim().length >= 8 ? s.trim().slice(0, 8) : null);
const avecVerdictLivrable = (a) => a.verdict_livrable === "PASS" || a.verdict_livrable === "FAIL";
const avecVerdictRelecture = (a) => a.verdict_relecture === "sert" || a.verdict_relecture === "derive";
/** Les agents jugés d'un relevé de suivi, hors agent d'une session fermée (S67 : aucune conversation ne pouvait plus porter son point). */
const agentsDuSuivi = (releve) => (releve?.sessions || []).flatMap((s) => s?.agents || []).filter((a) => a && a.verdict !== "SANS_OBJET");
const premierEcart = (a) => { const e = Array.isArray(a?.ecarts) ? a.ecarts[0] : null; return (a?.points || []).length && e && e.de === "lancement" && e.a === "point" ? e.min : null; };

/** Les mesures, par clé `mesure` du référentiel : données → { valeur, n, detail?, raison? }. `sur: "agents"` se restreint aux types de la base. */
export const MESURES = Object.freeze({
  duree_mediane_agent: { unite: "s", sur: "agents", quoi: "agent(s)", calcul: ({ agents }) => {
    const xs = agents.map((a) => a.duree_s).filter(Number.isFinite);
    return xs.length ? { valeur: mediane(xs), n: xs.length } : { valeur: null, n: 0, raison: "aucune fiche d'exécution de la fenêtre ne porte de durée" };
  } },
  part_livrables_pass: { unite: "part", sur: "agents", quoi: "verdict(s) de livrable", calcul: ({ agents }) => {
    const v = agents.filter(avecVerdictLivrable);
    return v.length ? { valeur: part(v.filter((a) => a.verdict_livrable === "PASS").length, v.length), n: v.length }
      : { valeur: null, n: 0, raison: "aucun verdict de livrable n'est noté sur les fiches de la fenêtre : le lien agent → verdict existe (scripts/noter-fiche.mjs --verdict-livrable), aucun appel ne l'a encore écrit" };
  } },
  jetons_medians_agent: { unite: "jetons", sur: "agents", quoi: "agent(s)", calcul: ({ agents }) => {
    const xs = agents.filter((a) => Number.isFinite(a.jetons_entree) && Number.isFinite(a.jetons_sortie)).map((a) => a.jetons_entree + a.jetons_sortie);
    return xs.length ? { valeur: mediane(xs), n: xs.length } : { valeur: null, n: 0, raison: "aucune fiche d'exécution de la fenêtre ne porte ses jetons d'entrée et de sortie (fiche partielle ou transcription bornée)" };
  } },
  part_relectures_sert: { unite: "part", sur: "agents", quoi: "relecture(s) notée(s)", calcul: ({ agents }) => {
    const v = agents.filter(avecVerdictRelecture);
    return v.length ? { valeur: part(v.filter((a) => a.verdict_relecture === "sert").length, v.length), n: v.length }
      : { valeur: null, n: 0, raison: "aucune relecture d'intention n'est notée sur les fiches de la fenêtre (scripts/relecture-intention.mjs --consigner --point reception --agent)" };
  } },
  frictions_par_session: { unite: "frictions par session", sur: "frictions", quoi: "session(s)", calcul: ({ sessions, frictions }) => (sessions.size
    ? { valeur: frictions.length / sessions.size, n: sessions.size, detail: { frictions: frictions.length } }
    : { valeur: null, n: 0, raison: "aucune session ne porte de fiche d'exécution dans la fenêtre : aucune session avec sous-agents à compter" }) },
  part_frictions_suivies_retour: { unite: "part", sur: "frictions", quoi: "friction(s) jugeable(s)", calcul: ({ sessions, frictions }) => {
    const auPilot = frictions.filter((f) => f.lieu === "pilot").length;
    const produits = frictions.filter((f) => f.lieu === "produit");
    const jugeables = produits.filter((f) => f.signeDepuis !== null && f.signeDepuis <= f.t);
    const detail = { frictions: frictions.length, au_pilot: auPilot, produits_sans_signature: produits.length - jugeables.length };
    if (!jugeables.length) return { valeur: null, n: 0, detail, raison: !sessions.size ? "aucune session avec sous-agents dans la fenêtre"
      : !frictions.length ? "aucune friction des sessions avec sous-agents dans la fenêtre"
      : `aucune friction jugeable sur ${frictions.length} : ${auPilot} au pilot, où aucun écrivain ne consigne un retour signé de sa session, et ${detail.produits_sans_signature} chez des produits dont le ledger ne signait pas encore ses entrées à l'heure de la friction (D-218 (b), gabarits/ledger.py)` };
    const suivies = jugeables.filter((f) => f.retours.some((r) => r.session === f.session8 && r.t >= f.t)).length;
    return { valeur: part(suivies, jugeables.length), n: jugeables.length, detail: { ...detail, suivies } };
  } },
  delai_premier_point_suivi: { unite: "min", sur: "suivi", quoi: "agent(s) suivi(s) pendant leur course", calcul: ({ suivi }) => {
    if (!suivi?.lu) return { valeur: null, n: 0, raison: suivi?.motif || "relevé de suivi non lu" };
    const xs = agentsDuSuivi(suivi.releve).map(premierEcart).filter(Number.isFinite);
    return xs.length ? { valeur: mediane(xs), n: xs.length } : { valeur: null, n: 0, raison: `aucun agent jugé par le relevé de suivi (plus de ${SEUIL_MIN} min de course, hors session fermée) ne porte de point de suivi pendant sa course dans la fenêtre` };
  } },
  part_agents_suivis: { unite: "part", sur: "suivi", quoi: "agent(s) jugé(s)", calcul: ({ suivi }) => {
    if (!suivi?.lu) return { valeur: null, n: 0, raison: suivi?.motif || "relevé de suivi non lu" };
    const jug = agentsDuSuivi(suivi.releve);
    if (!jug.length) return { valeur: null, n: 0, raison: `aucun agent de plus de ${SEUIL_MIN} min de course (SEUIL_MIN d'oracle-suivi-agents.mjs), hors session fermée, dans le relevé de suivi de la fenêtre` };
    const sans = jug.filter((a) => !(a.points || []).length);
    return { valeur: part(jug.length - sans.length, jug.length), n: jug.length, detail: { suivis: jug.length - sans.length, sans_point_hook_absent: sans.filter((a) => a.cause === "hook_absent").length } };
  } },
});

/** Le référentiel lu et contrôlé : { ok: true, ref } ou { ok: false, motif }. Un seuil qu'il ne saurait pas évaluer est refusé, jamais ignoré. */
export function lireReferentiel(chemin) {
  let ref;
  try { ref = JSON.parse(readFileSync(chemin, "utf8")); } catch (e) { return { ok: false, motif: e?.code === "ENOENT" ? "fichier absent" : `JSON illisible (${String(e?.message || e).slice(0, 80)})` }; }
  if (!ref || ref.schema !== SCHEMA_REFERENTIEL) return { ok: false, motif: `schéma attendu ${SCHEMA_REFERENTIEL}, lu « ${String(ref?.schema ?? "aucun").slice(0, 40)} »` };
  if (!Array.isArray(ref.paires) || !ref.paires.length) return { ok: false, motif: "aucune paire d'indicateurs" };
  for (const p of ref.paires) {
    for (const role of ["delai", "qualite"]) {
      const d = p?.[role];
      if (!d || !MESURES[d.mesure]) return { ok: false, motif: `paire ${p?.id ?? "?"} : indicateur de ${role === "delai" ? "délai" : "qualité"} sans mesure connue (« ${String(d?.mesure ?? "aucune").slice(0, 40)} »)` };
      const b = d.base;
      if (b !== null && b !== undefined && (typeof b !== "object" || Array.isArray(b) || (b.valeur !== null && b.valeur !== undefined && !Number.isFinite(b.valeur)))) return { ok: false, motif: `${d.id ?? p.id} : base invalide (un objet dont la valeur est un nombre ou null)` };
    }
    if (p.delai.seuil !== null && p.delai.seuil !== undefined) return { ok: false, motif: `${p.delai.id ?? p.id} : un indicateur de délai ne porte pas de seuil (l'étude n'en fixe pas ; son gardien alerte)` };
    const s = p.qualite.seuil;
    const tolerance = Number(s?.tolerance_points ?? 0);
    if (!s || !((s.type === "plancher" && Number.isFinite(s.valeur)) || (s.type === "plancher_base" && Number.isFinite(tolerance) && tolerance >= 0))) {
      return { ok: false, motif: `${p.qualite.id ?? p.id} : seuil invalide (attendu : « plancher » et sa valeur, ou « plancher_base » et sa tolérance en points)` };
    }
  }
  return { ok: true, ref };
}

/** Les journaux de frictions : celui du pilot (`.claude/frictions.jsonl`), puis `forge/frictions.jsonl` de chaque dossier du parc, avec son ledger. */
export function sourcesDesFrictions({ racine = PILOT, parc = dirname(resolve(racine)) } = {}) {
  const sources = [{ fichier: join(racine, ".claude", "frictions.jsonl"), lieu: "pilot", ledger: null }];
  let entrees = [];
  try { entrees = readdirSync(parc, { withFileTypes: true }); } catch { /* parc illisible : le pilot seul */ }
  for (const e of entrees) {
    if (!e.isDirectory() || resolve(join(parc, e.name)) === resolve(racine)) continue;
    const f = join(parc, e.name, "forge", "frictions.jsonl");
    if (existsSync(f)) sources.push({ fichier: f, lieu: "produit", ledger: join(parc, e.name, "forge", "ledger.jsonl") });
  }
  return sources;
}

const objets = (texte) => {
  const o = [];
  let illisibles = 0;
  for (const brute of String(texte ?? "").split("\n")) {
    const l = brute.trim();
    if (!l) continue;
    try { const x = JSON.parse(l); if (x && typeof x === "object" && !Array.isArray(x)) o.push(x); else illisibles++; } catch { illisibles++; }
  }
  return { objets: o, illisibles };
};

/**
 * Les frictions des journaux : [{ t, session8, lieu, signeDepuis, retours }] et leur décompte. `signeDepuis` : l'heure de la première entrée
 * signée (`session`) du ledger du produit, null au pilot ou sans entrée signée ; `retours` : les entrées `type: retour` signées de ce ledger.
 */
export function lireFrictions(sources) {
  const frictions = [];
  let fichiers = 0, illisibles = 0, ledgers = 0;
  for (const s of sources) {
    let texte;
    try { texte = readFileSync(s.fichier, "utf8"); } catch { continue; }
    fichiers++;
    let signeDepuis = null;
    const retours = [];
    if (s.ledger) {
      let lignes = [];
      try { lignes = objets(readFileSync(s.ledger, "utf8")).objets; ledgers++; } catch { /* ledger absent : ni signature ni retour */ }
      for (const e of lignes) {
        const t = instant(e.ts), sess = session8(e.session);
        if (t === null || !sess) continue;
        if (signeDepuis === null || t < signeDepuis) signeDepuis = t;
        if (e.type === "retour") retours.push({ session: sess, t });
      }
    }
    const l = objets(texte);
    illisibles += l.illisibles;
    for (const f of l.objets) {
      const t = instant(f.ts), sess = session8(f.session);
      if (t === null || !sess) { illisibles++; continue; }
      frictions.push({ t, session8: sess, lieu: s.lieu, signeDepuis, retours });
    }
  }
  return { frictions, fichiers, illisibles, ledgers };
}

/** Le relevé de suivi : le fichier `--suivi` (forme de la sortie d'`oracle-suivi-agents.mjs`), sinon `juger` sur les transcriptions des profils. */
export function releverSuivi({ fichier = null, profils = null, depuisIso, maintenant = new Date() } = {}) {
  if (fichier) {
    try {
      const r = JSON.parse(readFileSync(fichier, "utf8"));
      if (!r || !Array.isArray(r.sessions)) throw new Error("aucune liste de sessions");
      return { lu: true, releve: r, source: "relevé désigné par --suivi" };
    } catch (e) { return { lu: false, motif: `relevé de suivi désigné illisible (${String(e?.message || e).slice(0, 80)})` }; }
  }
  try {
    const depuis = Date.parse(depuisIso);
    const ps = profils ?? profilsParDefaut();
    const transcripts = transcriptsDepuis(depuis, ps);
    const releve = transcripts.length ? juger(transcripts, maintenant.getTime(), { depuis }) : { sessions_lues: 0, agents_juges: 0, sessions: [] };
    return { lu: true, releve, source: `${transcripts.length} transcription(s) de session avec sous-agents, sur ${ps.length} profil(s) du poste` };
  } catch (e) { return { lu: false, motif: `relevé de suivi en panne (${String(e?.message || e).slice(0, 80)})` }; }
}

/** Un indicateur évalué contre sa base et, pour un gardien, son seuil : état « non mesurable », « base à poser », « comparé à la base », « tenu » ou « franchi ». */
function evaluer(role, def, donnees) {
  const M = MESURES[def.mesure];
  const base = def.base && typeof def.base === "object" ? def.base : null;
  const brute = M.calcul(donnees);
  const types = M.sur === "agents" && Array.isArray(base?.types) && base.types.length ? base.types : null;
  const appariee = types ? M.calcul({ ...donnees, agents: donnees.agents.filter((a) => types.includes(a.type ?? "inconnu")) }) : null;
  const comparee = appariee ?? brute;
  const valBase = base && Number.isFinite(base.valeur) ? base.valeur : null;
  const r = { id: def.id, role, libelle: def.libelle, definition: def.definition ?? null, base_etude: def.base_etude ?? null, mesure: def.mesure, unite: M.unite, quoi: M.quoi,
    valeur: brute.valeur, n: brute.n, detail: brute.detail ?? null, types_base: types, valeur_appariee: appariee ? appariee.valeur : null,
    n_apparie: appariee ? appariee.n : null, valeur_comparee: comparee.valeur,
    base: base ? { valeur: valBase, n: base.n ?? null, mesuree_le: base.mesuree_le ?? null, non_mesurable: base.non_mesurable ?? null } : null,
    seuil: def.seuil ?? null, plancher: null, franchi: false, ecart: null, base_a_poser: false, etat: null, raison: null };
  if (comparee.valeur === null) {
    r.etat = "non mesurable";
    r.raison = appariee && brute.valeur !== null ? `aucun agent des types de la base (${types.join(", ")}) : ${appariee.raison}` : comparee.raison;
    return r;
  }
  r.base_a_poser = valBase === null;
  if (role === "delai") {
    if (valBase === null) { r.etat = "base à poser"; r.raison = RAISON_BASE_A_POSER; return r; }
    r.ecart = comparee.valeur - valBase;
    r.etat = "comparé à la base";
    return r;
  }
  const s = def.seuil;
  if (s.type === "plancher") r.plancher = s.valeur;
  else if (valBase === null) { r.etat = "base à poser"; r.raison = `${RAISON_BASE_A_POSER} ; le seuil, relatif à la base, n'est pas évalué`; return r; }
  else r.plancher = Math.max(0, valBase - (Number(s.tolerance_points) || 0) / 100);
  r.franchi = comparee.valeur < r.plancher - 1e-9;
  r.etat = r.franchi ? "franchi" : "tenu";
  return r;
}

const virgule = (x, d) => x.toFixed(d).replace(".", ",");
const milliers = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
/** Une valeur dite dans son unité ; « — » pour une valeur absente. */
export function valeurLisible(unite, v) {
  if (!Number.isFinite(v)) return "—";
  if (unite === "s") return dureeLisible(v);
  if (unite === "part") return `${virgule(v * 100, 1)} %`;
  if (unite === "min") return `${virgule(v, 1)} min`;
  if (unite === "jetons") return `${milliers(Math.round(v))} jetons`;
  if (unite === "frictions par session") return `${virgule(v, 2)} friction(s) par session`;
  return String(v);
}
/** Un écart signé à la base : en points pour une part, dans l'unité sinon. */
function ecartLisible(unite, x) {
  if (!Number.isFinite(x)) return "—";
  if (Math.abs(x) < 1e-9) return "écart nul";
  const signe = x > 0 ? "+" : "−";
  if (unite === "part") return `${signe}${virgule(Math.abs(x) * 100, 1)} points`;
  return `${signe}${valeurLisible(unite, Math.abs(x))}`;
}

/** La ligne que le relevé d'ouverture du pilot recopie quand un seuil est franchi ; null sinon. */
export function ligneAlerte(franchis, ref) {
  if (!franchis.length) return null;
  const dits = franchis.map((q) => `${q.id} « ${String(q.libelle).slice(0, 90)} » ${valeurLisible(q.unite, q.valeur_comparee)} pour un plancher de ${valeurLisible(q.unite, q.plancher)} (${q.n_apparie ?? q.n} ${q.quoi})`);
  return `indicateurs des agents (D-219 (e), \`references\\INDICATEURS-AGENTS.json\` du ${ref?.date ?? "date inconnue"}) : **${franchis.length} seuil(s) franchi(s)** — ${dits.join(" ; ")} — lire \`${PAGE}\` ; un seuil ne se change que par un commit motivé`;
}

/**
 * Le calcul, pur : { verdict, seuils, seuils_franchis, ligne_alerte, paires, non_juge, … }. `agents` : la sortie `agents` de `releverFiches` ;
 * `frictions` : celle de `lireFrictions` ; `suivi` : celle de `releverSuivi` ; `referentiel` : l'objet lu par `lireReferentiel`.
 */
export function calculer({ agents = [], frictions = [], suivi = null, referentiel, depuisIso, maintenant = new Date() }) {
  const depuis = Date.parse(depuisIso);
  const sessions = new Set(agents.map((a) => session8(a.session)).filter(Boolean));
  const retenues = frictions.filter((f) => f.t >= depuis && sessions.has(f.session8));
  const donnees = { agents, sessions, frictions: retenues, suivi };
  const paires = referentiel.paires.map((p) => ({ id: p.id, methode: p.methode ?? null, non_juge: Array.isArray(p.non_juge) ? p.non_juge : [],
    delai: evaluer("delai", p.delai, donnees), qualite: evaluer("qualite", p.qualite, donnees) }));
  const qualites = paires.map((p) => p.qualite);
  const franchis = qualites.filter((q) => q.etat === "franchi");
  const tenus = qualites.filter((q) => q.etat === "tenu").length;
  return {
    outil: "indicateurs-agents", version: VERSION, mesure_le: maintenant.toISOString(), depuis: depuisIso,
    fenetre_jours: Math.round((maintenant.getTime() - depuis) / JOUR_MS),
    referentiel: { date: referentiel.date ?? null, version: referentiel.version ?? null, fenetre_jours: referentiel.fenetre_jours ?? null },
    verdict: franchis.length ? "ALERTE" : tenus ? "TENU" : "NON_EVALUE",
    seuils: { franchis: franchis.length, tenus, non_evalues: qualites.length - franchis.length - tenus },
    seuils_franchis: franchis.map((q) => ({ id: q.id, libelle: q.libelle, valeur: q.valeur_comparee, plancher: q.plancher, n: q.n_apparie ?? q.n })),
    ligne_alerte: ligneAlerte(franchis, referentiel),
    paires, non_juge: [...NON_JUGE],
  };
}

const heureLocale = (iso) => { const d = new Date(iso); const p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };
const valeurCellule = (q) => {
  if (q.valeur === null) return "non mesurable";
  const tout = `${valeurLisible(q.unite, q.valeur)}, ${q.n} ${q.quoi}${q.mesure === "frictions_par_session" && q.detail ? `, ${q.detail.frictions} friction(s)` : ""}`;
  return q.types_base ? `${tout} ; types de la base : ${q.valeur_appariee === null ? "aucun agent" : `${valeurLisible(q.unite, q.valeur_appariee)}, ${q.n_apparie} ${q.quoi}`}` : tout;
};
const baseCellule = (q) => (q.base && q.base.valeur !== null ? `${valeurLisible(q.unite, q.base.valeur)}, ${q.base.n ?? "?"} ${q.quoi}, ${String(q.base.mesuree_le ?? "").slice(0, 10)}`
  : q.base?.non_mesurable ? "non mesurable à la première mesure" : "à poser");
const seuilCellule = (q) => {
  const s = q.seuil;
  if (!s) return "aucun : le gardien alerte";
  const texte = s.type === "plancher" ? `au moins ${valeurLisible(q.unite, s.valeur)}` : Number(s.tolerance_points) ? `au moins la base moins ${s.tolerance_points} points` : "au moins la base";
  return q.plancher !== null && s.type === "plancher_base" ? `${texte} (${valeurLisible(q.unite, q.plancher)})` : texte;
};
const etatCellule = (q) => (q.etat === "franchi" ? "**franchi**" : q.etat === "comparé à la base" ? `comparé à la base : ${ecartLisible(q.unite, q.ecart)}` : q.etat);

/** La page Markdown de la mesure (régénérée à chaque appel ; jugée par check_markdown.py). */
export function pageMarkdown(r) {
  const L = [
    "# Indicateurs des agents : chaque délai gardé par sa qualité",
    "",
    `Page régénérée à chaque appel de \`scripts/indicateurs-agents.mjs\` : vue générée, non versionnée (D-4 (a)), à ne pas éditer à la main. Mesure du ${heureLocale(r.mesure_le)} sur la fenêtre ouverte le ${heureLocale(r.depuis)} (${r.fenetre_jours} jours) ; définitions, bases et seuils lus dans \`references/INDICATEURS-AGENTS.json\` (version ${r.referentiel.version ?? "?"} du ${r.referentiel.date ?? "?"}), que le script n'écrit jamais.`,
    "",
    `**Verdict : ${r.verdict}** — ${r.seuils.franchis} seuil(s) franchi(s), ${r.seuils.tenus} tenu(s), ${r.seuils.non_evalues} non évalué(s) sur ${r.paires.length}.`,
    "",
    "## Les quatre paires",
    "",
    "Chaque paire de l'étude 20261114d (section Q4) apparie un indicateur de délai à l'indicateur de qualité qui le garde. Le tableau se lit ligne par ligne : la valeur de la fenêtre, la base posée le jour de la première mesure, le seuil, qui ne vaut que pour l'indicateur de qualité, puis l'état ; un indicateur « non mesurable » ou « base à poser » a sa raison dans la section suivante.",
    "",
    "| Paire | Rôle | Indicateur | Valeur | Base | Seuil | État |",
    "|---|---|---|---|---|---|---|",
  ];
  for (const p of r.paires) for (const q of [p.delai, p.qualite]) {
    L.push(`| ${p.id} | ${q.role === "delai" ? "délai" : "qualité"} | ${q.libelle} | ${valeurCellule(q)} | ${baseCellule(q)} | ${seuilCellule(q)} | ${etatCellule(q)} |`);
  }
  L.push("", "## Raisons et méthodes", "", "Pour chaque paire, la méthode de l'étude, puis ce que chaque indicateur compte et, quand il n'est pas évalué, pourquoi.", "");
  for (const p of r.paires) {
    L.push(`- **${p.id}** : ${p.methode ?? "méthode non écrite au référentiel"}`);
    for (const q of [p.delai, p.qualite]) {
      const etat = q.raison ? `${q.etat} : ${q.raison}` : q.etat;
      L.push(`  - ${q.role === "delai" ? "délai" : "qualité"}, ${q.libelle} : ${q.definition ?? "définition non écrite"}. État : ${etat}${q.base_a_poser && !q.raison ? ` ; base à poser (${RAISON_BASE_A_POSER})` : ""}.`
        + `${q.base_etude ? ` Base de l'étude : ${q.base_etude}.` : ""}`);
    }
    for (const n of p.non_juge) L.push(`  - non jugé : ${n}.`);
  }
  L.push("", "## Alerte au relevé d'ouverture", "");
  if (r.ligne_alerte) L.push("Un seuil est franchi : le relevé d'ouverture du pilot porte la ligne ci-dessous, qui avertit et ne bloque rien.", "", `- ${r.ligne_alerte}`);
  else L.push("Aucun seuil n'est franchi : le relevé d'ouverture du pilot ne porte aucune ligne d'alerte des indicateurs.");
  L.push("", "## Sources lues", "", "Les nombres ci-dessous comptent ce qui a été lu sur ce poste ; aucun nom de produit ni chemin de produit n'y figure.", "");
  const S = r.sources || {};
  if (S.fiches) L.push(`- fiches d'exécution : ${S.fiches.fichiers_lus} fichier(s) lu(s), ${S.fiches.agents} agent(s) dans la fenêtre${S.fiches.lignes_illisibles ? `, ${S.fiches.lignes_illisibles} ligne(s) illisible(s) sautée(s)` : ""}.`);
  if (S.frictions) L.push(`- journaux de frictions : ${S.frictions.fichiers} fichier(s), ${S.frictions.lignes} friction(s), dont ${S.frictions.retenues} des sessions avec sous-agents dans la fenêtre ; ${S.frictions.ledgers} ledger(s) de produit lu(s)${S.frictions.illisibles ? ` ; ${S.frictions.illisibles} ligne(s) illisible(s) sautée(s)` : ""}.`);
  if (S.suivi) L.push(`- relevé de suivi : ${S.suivi.lu ? `${S.suivi.source}, ${S.suivi.agents_juges} agent(s) jugé(s) par l'oracle, dont ${S.suivi.sessions_fermees} d'une session fermée (hors paire P4)` : `non lu, ${S.suivi.motif}`}.`);
  L.push("", "## Ce que la mesure ne juge pas", "", "Les angles morts que la mesure déclare, outre ceux de chaque paire ci-dessus :", "");
  for (const n of r.non_juge) L.push(`- ${n}.`);
  return L.join("\n") + "\n";
}

function ecrirePage(chemin, texte) {
  try { mkdirSync(dirname(chemin), { recursive: true }); writeFileSync(chemin, texte, "utf8"); return { ecrite: true }; }
  catch (e) { return { ecrite: false, erreur: e?.code || "erreur d'écriture" }; }
}

export function executer(argv, env = process.env, maintenant = new Date()) {
  const a = { json: false, jours: null, depuis: null, referentiel: REFERENTIEL_DEFAUT, fiches: [], racine: PILOT, parc: null, suivi: null, profils: null, page: null };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    const val = () => { const v = argv[++i]; if (v === undefined || v.startsWith("--")) throw new Error(`${x} attend une valeur`); return v; };
    try {
      if (x === "--json") a.json = true;
      else if (x === "--jours") a.jours = Number(val());
      else if (x === "--depuis") a.depuis = val();
      else if (x === "--referentiel") a.referentiel = val();
      else if (x === "--fiches") a.fiches.push(val());
      else if (x === "--racine") a.racine = resolve(val());
      else if (x === "--parc") a.parc = resolve(val());
      else if (x === "--suivi") a.suivi = val();
      else if (x === "--profils") a.profils = val().split(",").map((s) => s.trim()).filter(Boolean);
      else if (x === "--page") a.page = val();
      else return { code: 2, sortie: `indicateurs-agents : option inconnue : ${x}` };
    } catch (e) { return { code: 2, sortie: `indicateurs-agents : ${e.message}` }; }
  }
  if (a.depuis !== null && !(/^\d{4}-\d{2}-\d{2}/.test(a.depuis) && Number.isFinite(Date.parse(a.depuis)))) return { code: 2, sortie: "indicateurs-agents : --depuis attend une date AAAA-MM-JJ" };
  if (a.jours !== null && !(Number.isFinite(a.jours) && a.jours > 0)) return { code: 2, sortie: "indicateurs-agents : --jours attend un nombre positif" };
  const lu = lireReferentiel(a.referentiel);
  if (!lu.ok) return { code: 2, sortie: `indicateurs-agents : référentiel illisible (${lu.motif}) : rien n'est calculé, la page n'est pas réécrite` };
  const jours = a.jours ?? (Number.isFinite(lu.ref.fenetre_jours) && lu.ref.fenetre_jours > 0 ? lu.ref.fenetre_jours : 14);
  const depuisIso = a.depuis ? new Date(a.depuis).toISOString() : new Date(maintenant.getTime() - jours * JOUR_MS).toISOString();
  const parc = a.parc ?? dirname(resolve(a.racine));
  const fiches = releverFiches(a.fiches.length ? a.fiches : sourcesDesFiches({ pilot: a.racine, parc, env }), depuisIso);
  const fr = lireFrictions(sourcesDesFrictions({ racine: a.racine, parc }));
  const suivi = releverSuivi({ fichier: a.suivi, profils: a.profils, depuisIso, maintenant });
  const r = calculer({ agents: fiches.agents, frictions: fr.frictions, suivi, referentiel: lu.ref, depuisIso, maintenant });
  const depuisMs = Date.parse(depuisIso);
  const sessions = new Set(fiches.agents.map((x) => session8(x.session)).filter(Boolean));
  r.sources = {
    fiches: { fichiers_lus: fiches.indicateurs.fichiers_lus, agents: fiches.agents.length, lignes_illisibles: fiches.indicateurs.lignes_illisibles },
    frictions: { fichiers: fr.fichiers, lignes: fr.frictions.length, retenues: fr.frictions.filter((f) => f.t >= depuisMs && sessions.has(f.session8)).length, ledgers: fr.ledgers, illisibles: fr.illisibles },
    suivi: suivi.lu ? { lu: true, source: suivi.source, ...(() => { const t = (suivi.releve?.sessions || []).flatMap((s) => s?.agents || []);
      return { agents_juges: t.length, sessions_fermees: t.filter((x) => x?.verdict === "SANS_OBJET").length }; })() } : { lu: false, motif: suivi.motif },
  };
  const designee = a.page ?? (typeof env?.[VARIABLE_PAGE] === "string" && env[VARIABLE_PAGE].trim() ? env[VARIABLE_PAGE].trim() : null);
  const cheminPage = designee ?? join(a.racine, ...PAGE.split("/"));
  r.page = { chemin: designee ?? PAGE, ...ecrirePage(cheminPage, pageMarkdown(r)) };
  if (a.json) return { code: 0, sortie: JSON.stringify(r, null, 1), resultat: r };
  const lignes = [`indicateurs-agents ${VERSION} — fenêtre de ${r.fenetre_jours} jour(s) depuis ${depuisIso.slice(0, 10)}, référentiel du ${lu.ref.date ?? "?"} : verdict ${r.verdict} `
    + `(${r.seuils.franchis} seuil(s) franchi(s), ${r.seuils.tenus} tenu(s), ${r.seuils.non_evalues} non évalué(s))`];
  for (const p of r.paires) for (const q of [p.delai, p.qualite]) {
    lignes.push(`  ${q.id} · ${q.libelle} : ${q.valeur === null ? "non mesurable" : valeurCellule(q)} · base ${baseCellule(q)} · ${q.etat}${q.raison ? ` — ${q.raison}` : ""}`);
  }
  lignes.push(r.page.ecrite ? `  page : ${r.page.chemin} réécrite` : `  page : ${r.page.chemin} NON réécrite (${r.page.erreur})`);
  if (r.ligne_alerte) lignes.push(`  ALERTE : ${r.ligne_alerte}`);
  return { code: 0, sortie: lignes.join("\n"), resultat: r };
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const r = executer(process.argv.slice(2));
  (r.code === 2 ? console.error : console.log)(r.sortie);
  process.exit(r.code);
}
