/**
 * lib-suivi-agents.mjs — L'ÉTAT DES AGENTS D'UNE SESSION, JUGÉ DE L'EXTÉRIEUR, ET LE « POINT DE SUIVI » QUI LE MONTRE.
 *
 * LE FAIT (relevé du 12/11/2026, prompt `output/04-plans/Digit-AI - Prompt - Suivi des agents toutes les 15 minutes -
 * 20261112g.md`) : sur 30 jours, 267 sous-agents ont tourné plus de 15 minutes, 142 plus d'une heure, le plus long 1 002
 * minutes. La règle d'émission (TF-0094, `gabarits/AGENT-CAMPAGNE.md`) existait depuis le 11/08 et a été réécrite 3 fois ;
 * rien n'obligeait la session à lire l'avancement ni à le montrer au porteur. Ce module ne compte sur aucune coopération :
 * il lit le dossier `subagents\` que le harnais écrit à côté du transcript de la session, et le fichier d'avancement
 * que la consigne de l'agent a nommé.
 *
 * DÉFINITIONS, partagées par le hook (`hook-suivi-agents.mjs`), le juge de fin de tour (`hook-restitution.mjs`,
 * `oracle-synthese.mjs`) et l'oracle de relevé (`oracle-suivi-agents.mjs`) :
 *   · un POINT DE SUIVI est un message de texte de l'assistant dont la première ligne non vide est exactement
 *     `Suivi agents`, suivie d'au moins une ligne d'agent (« - <nom> · <état> (… N min …) · faits : … · restants : … ») ;
 *   · la PREUVE DE VIE d'un agent est la plus récente de deux écritures : la dernière entrée horodatée de son
 *     transcript, la dernière ligne de son fichier d'avancement ;
 *   · ÉTATS : « fini » (le harnais l'a noté : `finished` du `.meta.json`, ou notification de fin au transcript parent),
 *     « commande longue » (la dernière ligne d'avancement porte `commande` et une `fin_attendue` non échue, TF-2434),
 *     « actif » (preuve de vie de moins de 5 min), « silencieux » (5 à 15 min), « présumé arrêté » (plus de 15 min).
 *   · CADENCE : un agent entre dans les points à 14 min de course ; son point est dû 15 min après son lancement, puis
 *     15 min après le dernier point qui l'a couvert. Plusieurs agents d'une session tiennent dans un seul point.
 *
 * HORLOGE : `FORGE_SUIVI_MINUTE_MS` (défaut 60000) accélère la minute pour les bancs UNITAIRES seulement (déclaré).
 */
import { existsSync, readdirSync, readFileSync, statSync, openSync, readSync, closeSync } from "node:fs";
import { join, basename } from "node:path";

export const MINUTE = Number(process.env.FORGE_SUIVI_MINUTE_MS || 60000);
export const SEUIL_POINT_MIN = 15;     // un point est dû toutes les 15 minutes
export const ENTREE_POINT_MIN = 14;    // un agent entre dans les points à 14 min de course
export const ACTIF_MIN = 5;
export const ARRETE_MIN = 15;
export const ETATS = ["actif", "silencieux", "commande longue", "présumé arrêté", "fini"];

const LIGNE_AGENT = new RegExp(`^-\\s+\\S.*\\s·\\s(?:${ETATS.join("|")})(?![A-Za-zÀ-ÿ])[^\\n]*?\\d+\\s?min`);
const POSE_UN_GESTE = /(?<![A-Za-zÀ-ÿ])[DA]\s*-\s*\d{1,3}(?![0-9])\**\s*(?:[—–:|]|-\s|\(\s*[a-e]\s*\))/m;

/** Lignes d'agent mesurées d'un texte (une ligne d'agent porte un état et un âge en minutes). */
export function lignesAgent(texte) {
  return String(texte || "").split(/\r?\n/).filter((l) => LIGNE_AGENT.test(l.trim()));
}

/**
 * Vrai si le texte EST un point de suivi : première ligne non vide exactement `Suivi agents`, au moins une ligne d'agent
 * mesurée, aucun titre Markdown, aucune décision D-N ni action A-N posée, 60 lignes au plus. Un texte qui porte le motif
 * sans ligne d'agent mesurée (le « faux point ») n'en est pas un.
 */
export function estPointDeSuivi(texte) {
  const lignes = String(texte || "").split(/\r?\n/);
  const pleines = lignes.filter((l) => l.trim());
  if (!pleines.length || pleines[0].trim() !== "Suivi agents") return false;
  if (pleines.length > 60) return false;
  if (pleines.some((l) => /^#{1,6}\s/.test(l.trim()))) return false;
  if (POSE_UN_GESTE.test(texte)) return false;
  return lignesAgent(texte).length >= 1;
}

/** Lit au plus `octets` à la fin d'un fichier (les transcripts dépassent souvent 10 Mo). */
export function lireFin(chemin, octets = 8 * 1024 * 1024) {
  const taille = statSync(chemin).size;
  if (taille <= octets) return readFileSync(chemin, "utf8");
  const fd = openSync(chemin, "r");
  try {
    const tampon = Buffer.alloc(octets);
    readSync(fd, tampon, 0, octets, taille - octets);
    const t = tampon.toString("utf8");
    return t.slice(t.indexOf("\n") + 1);
  } finally { closeSync(fd); }
}

function lireDebut(chemin, octets = 256 * 1024) {
  const fd = openSync(chemin, "r");
  try {
    const tampon = Buffer.alloc(octets);
    const n = readSync(fd, tampon, 0, octets, 0);
    return tampon.subarray(0, n).toString("utf8");
  } finally { closeSync(fd); }
}

const parser = (l) => { try { return JSON.parse(l); } catch { return null; } };
const tsDe = (e) => (e && e.timestamp ? Date.parse(e.timestamp) : NaN);

function texteAssistant(e) {
  if (!e || e.type !== "assistant" || !e.message) return null;
  const c = e.message.content;
  if (typeof c === "string") return c;
  if (!Array.isArray(c)) return null;
  const t = c.filter((b) => b && b.type === "text").map((b) => b.text || "").join("\n");
  return t || null;
}

function estMessageHumain(e) {
  if (!e || e.type !== "user" || e.isMeta) return false;
  const c = e.message && e.message.content;
  if (typeof c === "string") return !/^<task-notification>/.test(c.trim());
  if (!Array.isArray(c)) return false;
  if (c.some((b) => b && b.type === "tool_result")) return false;
  const t = c.filter((b) => b && b.type === "text").map((b) => b.text || "").join("\n").trim();
  return Boolean(t) && !/^<task-notification>/.test(t);
}

/**
 * Lecture du transcript PARENT : heures des points de suivi, début du tour en cours (dernier message humain), agents
 * notifiés finis (`<task-notification>` au statut terminal).
 */
export function lireParent(cheminTranscript) {
  const res = { points: [], debutTour: null, notifiesFinis: new Map(), premierTs: null, dernierTs: null };
  if (!cheminTranscript || !existsSync(cheminTranscript)) return res;
  const texte = lireFin(cheminTranscript);
  for (const l of texte.split("\n")) {
    if (!l) continue;
    const e = parser(l);
    if (!e) continue;
    const ts = tsDe(e);
    if (!Number.isNaN(ts)) { if (res.premierTs === null) res.premierTs = ts; res.dernierTs = ts; }
    const ta = texteAssistant(e);
    if (ta && estPointDeSuivi(ta) && !Number.isNaN(ts)) res.points.push({ ts, texte: ta });
    if (estMessageHumain(e) && !Number.isNaN(ts)) res.debutTour = ts;
    if (l.includes("<task-notification>")) {
      for (const m of l.matchAll(/<task-id>([^<]+)<\/task-id>[\s\S]*?<status>([^<]+)<\/status>/g)) {
        if (/completed|failed|killed|stopped|error|cancel/i.test(m[2]) && !Number.isNaN(ts)) res.notifiesFinis.set(m[1].trim(), ts);
      }
    }
  }
  return res;
}

const MOTIF_AVANCEMENT = /(?:[A-Za-z]:[\\/]|\/)[^\s"'`<>|*?]*avancement[^\s"'`<>|*?]*\.jsonl/gi;
// Le chemin suit souvent l'étiquette « Avancement : `…\campagne-a2\L1.jsonl` » sans contenir le mot (6 consignes du 12/11/2026).
const MOTIF_ETIQUETTE = /avancement[^\n]{0,80}?((?:[A-Za-z]:[\\/]|\/)[^\s"'`<>|*?]+\.jsonl)/gi;
/** Vrai si une consigne nomme un fichier d'avancement (chemin qui contient le mot, ou chemin `.jsonl` après l'étiquette). */
export function nommeUnAvancement(consigne) {
  const t = String(consigne || "");
  return /avancement[^\s"'`]*\.jsonl/i.test(t) || /avancement[^\n]{0,80}?\.jsonl/i.test(t);
}

/** Le chemin d'avancement nommé dans la consigne de l'agent ou dans ses premières écritures (le premier qui existe). */
export function cheminAvancement(cheminAgent) {
  let debut = "";
  try { debut = lireDebut(cheminAgent); } catch { return null; }
  const vus = new Set();
  const trouves = [...[...debut.matchAll(MOTIF_ETIQUETTE)].map((m) => m[1]), ...[...debut.matchAll(MOTIF_AVANCEMENT)].map((m) => m[0])];
  for (const m of trouves.map((x) => [x])) {
    const brut = m[0].replace(/\\\\/g, "\\");
    if (vus.has(brut)) continue;
    vus.add(brut);
    const p = /^\/[a-z]\//i.test(brut) ? `${brut[1]}:${brut.slice(2)}` : brut; // /c/… (Git Bash) → c:/…
    if (existsSync(p)) return p;
  }
  return vus.size ? [...vus][0] : null;
}

const enListe = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (Array.isArray(v)) return v.length ? v.map((x) => (typeof x === "object" ? (x.nom || x.id || JSON.stringify(x)) : String(x))).join(", ") : "aucune";
  if (typeof v === "number") return `${v}`;
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
};
const premier = (o, cles) => { for (const c of cles) if (o && o[c] !== undefined && o[c] !== null && o[c] !== "") return o[c]; return undefined; };
const couper = (s, n = 180) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** Heure attendue d'une ligne d'avancement : ISO 8601, ou « HH:MM » rapportée au jour de la ligne (lendemain si passée de plus de 12 h). */
export function finAttendue(ligne, tsLigne) {
  const v = premier(ligne, ["fin_attendue", "fin_attendue_iso", "fin_prevue_commande"]);
  if (!v) return null;
  const iso = Date.parse(v);
  if (!Number.isNaN(iso) && /\d{4}-\d{2}-\d{2}/.test(String(v))) return iso;
  const m = String(v).match(/(\d{1,2})[:h](\d{2})/);
  if (!m || !tsLigne) return null;
  const d = new Date(tsLigne);
  d.setHours(Number(m[1]), Number(m[2]), 0, 0);
  let t = d.getTime();
  if (t < tsLigne - 12 * 3600000) t += 24 * 3600000;
  return t;
}

/** Dernière ligne d'avancement lisible : { ts, ligne, faits, restants, commande, fin }. */
export function lireAvancement(chemin) {
  if (!chemin || !existsSync(chemin)) return null;
  let texte = "";
  try { texte = lireFin(chemin, 256 * 1024); } catch { return null; }
  const lignes = texte.split(/\r?\n/).filter(Boolean).map(parser).filter((o) => o && typeof o === "object");
  const mtime = statSync(chemin).mtimeMs;
  if (!lignes.length) return { ts: mtime, ligne: null, faits: null, restants: null, commande: null, fin: null };
  const d = lignes[lignes.length - 1];
  const tsBrut = premier(d, ["ts", "horodatage", "emis_a", "heure_emission", "emission"]);
  const tsL = tsBrut && /\d{4}-\d{2}-\d{2}/.test(String(tsBrut)) ? Date.parse(tsBrut) : mtime;
  const faits = enListe(premier(d, ["faits", "taches_faites", "realise", "réalisé", "fait", "termine", "termines"]));
  const restants = enListe(premier(d, ["restants", "taches_restantes", "raf", "reste", "restant", "a_faire"]));
  const commande = premier(d, ["commande", "commande_longue"]);
  const fin = commande ? finAttendue(d, Number.isNaN(tsL) ? mtime : tsL) : null;
  return { ts: Math.max(Number.isNaN(tsL) ? 0 : tsL, mtime), ligne: d, faits, restants, commande: commande ? String(commande) : null, fin };
}

function derniereEntree(cheminAgent) {
  let premierTs = null, dernierTs = null;
  try {
    for (const l of lireDebut(cheminAgent, 64 * 1024).split("\n")) { const ts = tsDe(parser(l)); if (!Number.isNaN(ts)) { premierTs = ts; break; } }
    const fin = lireFin(cheminAgent, 256 * 1024).split("\n");
    for (let i = fin.length - 1; i >= 0; i--) { const ts = tsDe(parser(fin[i])); if (!Number.isNaN(ts)) { dernierTs = ts; break; } }
  } catch { /* fichier en cours d'écriture : relu au passage suivant */ }
  return { premierTs, dernierTs };
}

/** Dossier `subagents\` d'une session, à côté de son transcript `<session>.jsonl`. */
export function dossierAgents(cheminTranscript) {
  return cheminTranscript ? join(cheminTranscript.replace(/\.jsonl$/i, ""), "subagents") : null;
}

/**
 * Les agents de la session, mesurés à `maintenant` : [{ id, nom, lancement, vie, fini, finA, avancement, etat, ageVieMin, courseMin, faits, restants, fin }].
 * Ne lit que les agents dont le transcript a bougé dans les 48 dernières heures.
 */
export function agentsDeSession(cheminTranscript, maintenant = Date.now(), parent = null) {
  const dossier = dossierAgents(cheminTranscript);
  if (!dossier || !existsSync(dossier)) return [];
  const p = parent || lireParent(cheminTranscript);
  const res = [];
  for (const f of readdirSync(dossier)) {
    if (!/^agent-.+\.jsonl$/.test(f)) continue;
    const chemin = join(dossier, f);
    let st;
    try { st = statSync(chemin); } catch { continue; }
    if (maintenant - st.mtimeMs > 48 * 3600000) continue;
    const id = basename(f, ".jsonl").replace(/^agent-/, "");
    let meta = {};
    try { meta = JSON.parse(readFileSync(chemin.replace(/\.jsonl$/, ".meta.json"), "utf8")); } catch { /* méta absente : agent lu sans nom */ }
    const { premierTs, dernierTs } = derniereEntree(chemin);
    const lancement = premierTs ?? st.birthtimeMs ?? st.mtimeMs;
    const cheminAv = cheminAvancement(chemin);
    const av = lireAvancement(cheminAv);
    const vieTranscript = dernierTs ?? st.mtimeMs;
    const vie = Math.max(vieTranscript, av ? av.ts : 0);
    const notifie = p.notifiesFinis.get(id);
    const fini = meta.finished === true || notifie !== undefined;
    const finA = fini ? (notifie ?? vieTranscript) : null;
    const ageVieMin = Math.max(0, (maintenant - vie) / MINUTE);
    let etat;
    if (fini) etat = "fini";
    else if (av && av.commande && av.fin && av.fin > maintenant) etat = "commande longue";
    else if (ageVieMin < ACTIF_MIN) etat = "actif";
    else if (ageVieMin < ARRETE_MIN) etat = "silencieux";
    else etat = "présumé arrêté";
    const nom = [meta.description, meta.agentType].filter(Boolean).join(", ") || `agent ${id.slice(0, 8)}`;
    res.push({ id, nom, lancement, vie, fini, finA, avancement: cheminAv, etat, ageVieMin, courseMin: ((finA ?? maintenant) - lancement) / MINUTE,
      faits: av ? av.faits : null, restants: av ? av.restants : null, fin: av ? av.fin : null, aAvancement: Boolean(av) });
  }
  return res.sort((a, b) => a.lancement - b.lancement);
}

/** Dernier point qui a couvert l'agent : un point émis quand l'agent avait au moins 14 min de course. */
export function dernierPointCouvrant(agent, points) {
  let d = null;
  for (const pt of points) if (pt.ts >= agent.lancement + ENTREE_POINT_MIN * MINUTE && (!agent.finA || pt.ts <= agent.finA + 17 * MINUTE)) d = pt.ts;
  return d;
}

/** Échéance du prochain point pour un agent en course : 15 min après son lancement, puis après le dernier point qui l'a couvert. */
export function echeanceAgent(agent, points) {
  const d = dernierPointCouvrant(agent, points);
  return (d ?? agent.lancement) + SEUIL_POINT_MIN * MINUTE;
}

const hhmm = (t) => new Date(t).toTimeString().slice(0, 5);

/** Ligne d'agent du point (contenu fixé par l'ÉTAPE 3.3 du prompt : nom, état et âge, faits, restants). */
export function ligneDe(a, maintenant = Date.now()) {
  const age = Math.round(a.ageVieMin);
  let etat;
  if (a.etat === "fini") etat = `fini (fin il y a ${Math.max(0, Math.round((maintenant - a.finA) / MINUTE))} min)`;
  else if (a.etat === "commande longue") etat = `commande longue (fin attendue ${hhmm(a.fin)}, preuve de vie il y a ${age} min)`;
  else etat = `${a.etat} (preuve de vie il y a ${age} min)`;
  const faits = a.aAvancement ? couper(a.faits ?? "non déclaré par l'agent") : "non déclaré par l'agent";
  const restants = a.aAvancement ? couper(a.restants ?? "non déclaré par l'agent") : "non déclaré par l'agent";
  return `- ${a.nom} · ${etat} · faits : ${faits} · restants : ${restants}`;
}

/**
 * L'état de suivi d'une session à `maintenant` : agents en course, agents à montrer, échéance du prochain point.
 * `tourEnCours` ajoute la session elle-même quand son tour dépasse 15 min (hook PostToolUse).
 */
export function etatSuivi(cheminTranscript, maintenant = Date.now(), { tourEnCours = false, pointsDemandes = [] } = {}) {
  const parent = lireParent(cheminTranscript);
  // Les points que le hook a DEMANDÉS comptent pour la cadence, même absents du transcript : mesuré le 12/11/2026 dans une session
  // VS Code (harnais 2.1.322), des textes de l'assistant, dont 2 points de suivi, n'entrent pas au transcript (seul leur résumé de
  // pensée y figure). Sans ce relais, le hook redemanderait un point toutes les 3 minutes. L'oracle de relevé, lui, ne lit que le transcript.
  const demandes = pointsDemandes.map((t) => (typeof t === "number" ? t : Date.parse(t))).filter((t) => !Number.isNaN(t) && t <= maintenant);
  if (demandes.length) {
    parent.points = [...parent.points, ...demandes.map((ts) => ({ ts, texte: null, demande: true }))].sort((a, b) => a.ts - b.ts);
  }
  const agents = agentsDeSession(cheminTranscript, maintenant, parent);
  const dernierPoint = parent.points.length ? parent.points[parent.points.length - 1].ts : null;
  const enCourse = agents.filter((a) => !a.fini);
  const echeances = enCourse.map((a) => echeanceAgent(a, parent.points));
  let session = null;
  if (tourEnCours && parent.debutTour) {
    const debut = parent.debutTour;
    const pointsTour = parent.points.filter((p) => p.ts >= debut + ENTREE_POINT_MIN * MINUTE);
    const d = pointsTour.length ? pointsTour[pointsTour.length - 1].ts : debut;
    session = { debut, echeance: d + SEUIL_POINT_MIN * MINUTE, courseMin: (maintenant - debut) / MINUTE };
    echeances.push(session.echeance);
  }
  const echeance = echeances.length ? Math.min(...echeances) : null;
  const montres = agents.filter((a) => {
    if (!a.fini) return (maintenant - a.lancement) >= ENTREE_POINT_MIN * MINUTE;
    // un agent fini figure UNE dernière fois, dans le premier point qui suit sa fin, s'il a couru au moins 14 min ; sans point
    // antérieur, seulement s'il a fini dans les 17 dernières minutes (relevé le 12/11/2026 : un agent fini 193 min plus tôt montré)
    const repere = Math.max(dernierPoint ?? 0, maintenant - 17 * MINUTE);
    return a.courseMin >= ENTREE_POINT_MIN && a.finA > repere;
  });
  return { agents, enCourse, montres, echeance, session, points: parent.points, dernierPoint };
}

/** Le texte du point de suivi, prêt à recopier. */
export function redigerPoint(etat, maintenant = Date.now()) {
  const lignes = ["Suivi agents"];
  if (etat.session && etat.session.courseMin >= ENTREE_POINT_MIN) {
    lignes.push(`- session principale · actif (tour en cours depuis ${Math.round(etat.session.courseMin)} min) · faits : <tes tâches faites dans ce tour> · restants : <tes tâches restantes>`);
  }
  for (const a of etat.montres) lignes.push(ligneDe(a, maintenant));
  return lignes.length > 1 ? lignes.join("\n") : null;
}

/** Consigne qui accompagne le point dans le contexte de la session. */
export function consignePoint(point, { enTour = false } = {}) {
  return [
    `[suivi-agents] Un point de suivi est dû : un agent de cette session tourne depuis plus de 15 minutes${enTour ? ", ou ton propre tour dépasse 15 minutes" : ""}.`,
    `Écris ${enTour ? "maintenant, avant ton prochain appel d'outil," : "maintenant"} un message de texte qui reprend le point ci-dessous tel quel, première ligne exactement « Suivi agents ».`,
    enTour ? "Remplace les marques <…> de la ligne « session principale » par tes tâches réelles, puis reprends ton travail." : "N'ajoute rien d'autre, puis termine ton tour : la veille se réarme seule à la fin du tour.",
    "",
    point,
  ].join("\n");
}
