#!/usr/bin/env node
/**
 * relever-flotte.mjs — LA FLOTTE D'AGENTS SE RELÈVE DANS LES TRANSCRIPTIONS, ELLE NE SE CONSIGNE PAS À LA MAIN
 * (décision humaine D-19 (a) du 18/10/2026, étude `output/03-etudes/20261018-etude-opportunite-flotte-d-agents.md`).
 *
 * LE FAIT. Le §4 bis de CONTRAT-INTERFACE.md demandait de consigner, pour chaque tranche déléguée, le modèle, la
 * version servie, l'effort, les jetons et l'escalade. Relevé du 18/10/2026 : 8 ledgers modifiés depuis le 25/09,
 * aucune invocation consignée après cette date ; le journal des campagnes s'arrête au 01/10 alors que plus de 50
 * sous-agents ont été lancés le 02/10. Et la correction de l'effort (TF-1561) a été close sur 3 définitions qu'aucune
 * délégation n'employait : 0 agent compilé sur 201 sous-agents. Une règle que personne ne mesure ne se corrige pas.
 *
 * CE QU'IL MESURE, en lecture seule, dans les transcriptions de Claude Code de chaque profil `~\.claude*` du poste :
 *   · les APPELS de l'outil Agent (sessions principales) : vers un agent NOMMÉ (un type qui n'est ni générique ni
 *     intégré), vers un générique AVEC dérogation dite (`model` ET `effort` déclarés), ou HORS FLOTTE (générique sans) ;
 *   · les SOUS-AGENTS : type, modèle et effort SERVIS, jetons de sortie et relus, contexte au premier appel,
 *     appels d'outils ;
 *   · les réponses servies par un modèle HORS DE LA GÉNÉRATION COURANTE de `references/MODELES-EN-SERVICE.json`,
 *     sessions comprises (le juge externe `oracle-judge` y tournait sur Opus 4.6 le 18/10).
 *   · la SIMULTANÉITÉ (TF-1928, décision humaine D-48 (a) du 19/10/2026, étude `output/03-etudes/20261019-etude-opportunite-sessions-paralleles-paliers-autonomie.md`) :
 *     par session principale, le PIC de sous-agents dont les durées de vie se chevauchent (du premier au dernier message du
 *     sous-agent ; deux durées qui se touchent ne se chevauchent pas), la distribution de ce pic et le nombre de sessions à 5
 *     ou plus et à 10 ou plus. Un sous-agent en attente compte comme actif : le pic peut être surestimé. L'unité est le
 *     sous-agent d'une session, pas la session parallèle. Indicateur seul : il n'entre pas dans les critères de la flotte ;
 *   · les RELECTURES D'INTENTION de l'essai du 18/10/2026 (D-23 (a), `references/RELECTURE-INTENTION.md`) : les sous-agents
 *     `verificateur` dont la description commence par « Relecture d'intention », leurs jetons par jour, et si le SEUIL
 *     D'ARRÊT de l'essai (plus de 4 000 000 de jetons de relecture par jour, D-25 du 18/10/2026 ; 1 000 000 à l'ouverture de l'essai) est franchi — il se dit à part des critères.
 * Et il juge les 4 critères de revue écrits d'avance par l'étude (revue du 2026-11-01) : part des appels vers un
 * agent nommé ≥ 90 % ; 0 délégation Opus sans effort déclaré ; 0 réponse hors génération courante ; et il donne la
 * médiane des jetons relus par sous-agent, à comparer à la période de l'étude.
 *
 * `--journal <fichier.jsonl>` ajoute UNE ligne datée (indicateurs et étiquette) : c'est la consignation de fin de
 * campagne du §4 bis, produite par l'outil au lieu d'être écrite à la main.
 *
 * Usage : node scripts\relever-flotte.mjs [--jours N | --depuis AAAA-MM-JJ] [--transcripts <dossier>]…
 *           [--projet <motif>] [--referentiel <MODELES-EN-SERVICE.json>] [--json] [--journal <f.jsonl> [--etiquette <nom>]]
 * Exit : 0 relevé rendu (PASS ou AVERT : un relevé n'échoue pas, il dit) · 2 option inconnue ou valeur invalide.
 * NON JUGÉ (déclaré) : la justesse de l'agent choisi pour la tâche ; les sous-agents lancés hors de l'outil Agent
 * (une CLI `claude -p` compte comme une SESSION) ; les postes et profils absents de ce poste ; les sessions principales
 * vivantes en parallèle (la simultanéité compte des sous-agents, pas des sessions).
 */
import { existsSync, readFileSync, readdirSync, statSync, appendFileSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dossiersParDefaut } from "./relever-contexte-sessions.mjs";

export const VERSION = "1.2.0";
const ICI = dirname(fileURLToPath(import.meta.url));
const REF_DEFAUT = join(ICI, "..", "references", "MODELES-EN-SERVICE.json");
export const GENERIQUES = new Set(["general-purpose", "claude", "Explore", "Plan", ""]);
export const INTEGRES_FIXES = new Set(["claude-code-guide", "statusline-setup"]);
export const SEUILS = { part_nommee_min: 0.9, opus_sans_effort_max: 0, hors_generation_max: 0 };
/** L'essai de relecture d'intention (D-23 (a) du 18/10/2026, `references/RELECTURE-INTENTION.md`) : dates et seuil d'arrêt. */
export const ESSAI_RELECTURE = { debut: "2026-10-18", fin: "2026-11-01", prolongation: "prolongé en service par D-73 (b)", revue: "2026-11-08", seuil_jetons_par_jour: 4000000 };
/** Une relecture d'intention est un sous-agent `verificateur` dont la description commence par « Relecture d'intention ». */
export const estRelectureIntention = (type, description) => type === "verificateur" && /^\s*relecture d['’]intention/i.test(String(description || ""));
/** Limite par défaut de sous-agents simultanés d'une session (`code.claude.com/docs/en/sub-agents`, lue le 2026-10-19) : voir `references/PARALLELISME-CLAUDE-CODE.md`. */
export const LIMITE_SOUS_AGENTS_SIMULTANES = 20;
/** Le pic de chevauchement d'intervalles [début, fin] en millisecondes ; à égalité d'instant, une fin précède un début. */
export function picSimultaneite(intervalles) {
  const ev = [];
  for (const [d, f] of intervalles) { ev.push([d, 1]); ev.push([f, -1]); }
  ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let c = 0, m = 0;
  for (const [, v] of ev) { c += v; if (c > m) m = c; }
  return m;
}
const jourLocal = (iso) => { const d = new Date(iso); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

const lignes = (txt) => txt.split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
const mediane = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };
const compter = (xs) => xs.reduce((o, k) => ((o[k] = (o[k] || 0) + 1), o), {});
const principal = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "aucun";

/** La génération courante lue au référentiel : famille → { identifiant, depuis } ; null s'il est illisible. */
export function generationCourante(referentiel) {
  try {
    const j = JSON.parse(readFileSync(referentiel, "utf8"));
    const g = new Map();
    for (const [famille, v] of Object.entries(j.generation_courante || {})) if (v && v.identifiant) g.set(famille, { identifiant: v.identifiant, depuis: v.courante_depuis || "0000-00-00" });
    return g.size ? g : null;
  } catch { return null; }
}
/**
 * Une réponse est HORS GÉNÉRATION quand sa famille a, à sa date, une version courante qui n'est pas celle servie :
 * Opus 5 servi le 20/09 était courant (Opus 5.5 ne l'est que depuis le 23/09) ; servi le 17/10, il ne l'est plus.
 * Un suffixe de date (`claude-haiku-4-5-20251001`) ou de contexte (`[1m]`) ne change pas la version.
 */
export function estHorsGeneration(servi, ts, generation) {
  const s = String(servi || "").replace(/\[.*\]$/, "");
  const f = (s.match(/^claude-(opus|sonnet|haiku|fable)-/) || [])[1];
  const c = f && generation.get(f);
  if (!c || String(ts || "") < c.depuis) return false;
  return !(s === c.identifiant || s.startsWith(c.identifiant + "-"));
}
/** Classe un appel de l'outil Agent : « nomme », « derogation » ou « hors_flotte ». */
export function classerAppel(input) {
  const type = typeof input?.subagent_type === "string" ? input.subagent_type.trim() : "";
  if (type && !GENERIQUES.has(type)) return "nomme";
  const aModele = typeof input?.model === "string" && input.model.trim() !== "";
  const aEffort = typeof input?.effort === "string" && input.effort.trim() !== "";
  return aModele && aEffort ? "derogation" : "hors_flotte";
}

function* fichiers(dossier) {
  let entrees; try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return; }
  for (const e of entrees) {
    const p = join(dossier, e.name);
    if (e.isFile() && e.name.endsWith(".jsonl")) yield { fichier: p, sous_agent: false };
    else if (e.isDirectory()) {
      const s = join(p, "subagents");
      if (existsSync(s)) for (const f of readdirSync(s)) if (f.endsWith(".jsonl")) yield { fichier: join(s, f), sous_agent: true, session: e.name };
    }
  }
}

/** Relève la flotte dans des dossiers de projets, depuis un horodatage ISO. */
export function relever(dossiers, depuisIso, courants) {
  const appels = [], sous = [], horsGeneration = [], parSession = new Map();
  const limiteMs = Date.parse(depuisIso);
  for (const d of dossiers) for (const t of fichiers(d)) {
    let st; try { st = statSync(t.fichier); } catch { continue; }
    if (st.mtimeMs < limiteMs) continue;
    // Une réponse du modèle s'écrit sur PLUSIEURS lignes (un bloc de contenu par ligne) qui répètent le même
    // `message.id` : le contenu se lit sur toutes les lignes ; l'usage, une fois par réponse, sur sa DERNIÈRE ligne —
    // les jetons relus y sont répétés à chaque ligne, et la sortie n'y est complète qu'à la dernière (mesuré le
    // 18/10 : 8, 8 puis 557 jetons de sortie pour une même réponse). Additionner ligne à ligne surestime.
    const toutes = lignes(readFileSync(t.fichier, "utf8"));
    const recs = toutes.filter((r) => r.type === "assistant" && r.message && r.timestamp >= depuisIso);
    if (!recs.length) continue;
    const parId = new Map();
    recs.forEach((r, i) => parId.set(r.message.id || `#${i}`, r));
    const rep = [...parId.values()];
    const projet = basename(d);
    if (courants) for (const r of rep) if (r.message.model && estHorsGeneration(r.message.model, r.timestamp, courants)) {
      horsGeneration.push({ projet, modele: r.message.model, sous_agent: t.sous_agent });
    }
    if (!t.sous_agent) {
      for (const r of recs) for (const c of r.message.content || []) {
        if (c?.type === "tool_use" && (c.name === "Agent" || c.name === "Task")) {
          appels.push({ projet, ts: r.timestamp, type: c.input?.subagent_type ?? null, modele: c.input?.model ?? null, effort: c.input?.effort ?? null, classe: classerAppel(c.input) });
        }
      }
      continue;
    }
    let meta = {}; try { meta = JSON.parse(readFileSync(t.fichier.replace(/\.jsonl$/, ".meta.json"), "utf8")); } catch { /* méta absente */ }
    const g = { projet, type: meta.agentType ?? "?", description: meta.description ?? "", jour: jourLocal(rep[0].timestamp), servis: {}, efforts: {}, sortie: 0, relus: 0, total: 0, outils: 0 };
    const u0 = rep[0].message.usage || {};
    g.contexte_initial = (u0.input_tokens || 0) + (u0.cache_read_input_tokens || 0) + (u0.cache_creation_input_tokens || 0);
    for (const r of rep) {
      if (r.message.model) g.servis[r.message.model] = (g.servis[r.message.model] || 0) + 1;
      if (r.effort) g.efforts[r.effort] = (g.efforts[r.effort] || 0) + 1;
      const u = r.message.usage || {};
      g.sortie += u.output_tokens || 0; g.relus += u.cache_read_input_tokens || 0;
      g.total += (u.input_tokens || 0) + (u.output_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
    }
    for (const r of recs) for (const c of r.message.content || []) if (c?.type === "tool_use") g.outils++;
    g.modele = principal(g.servis); g.effort = principal(g.efforts);
    // La durée de vie du sous-agent : de son premier à son dernier message horodaté (toutes lignes, prompt compris).
    const horo = toutes.map((r) => Date.parse(r.timestamp)).filter(Number.isFinite);
    if (horo.length) {
      const cle = `${projet}/${t.session}`;
      if (!parSession.has(cle)) parSession.set(cle, []);
      parSession.get(cle).push([Math.min(...horo), Math.max(...horo)]);
    }
    sous.push(g);
  }
  const parClasse = compter(appels.map((a) => a.classe));
  const total = appels.length;
  const opusSansEffort = appels.filter((a) => a.classe !== "nomme" && !a.effort && (a.modele === "opus" || a.modele === null)).length;
  const indicateurs = {
    appels: total,
    appels_vers_agent_nomme: parClasse.nomme || 0,
    appels_avec_derogation: parClasse.derogation || 0,
    appels_hors_flotte: parClasse.hors_flotte || 0,
    part_nommee: total ? (parClasse.nomme || 0) / total : null,
    delegations_opus_sans_effort: opusSansEffort,
    sous_agents: sous.length,
    sous_agents_par_type: compter(sous.map((g) => g.type)),
    sous_agents_modele_effort: compter(sous.map((g) => `${g.modele} / ${g.effort}`)),
    reponses_hors_generation: horsGeneration.length,
    hors_generation_par_modele: compter(horsGeneration.map((h) => `${h.modele}${h.sous_agent ? " (sous-agent)" : " (session)"}`)),
    jetons_sortie_sous_agents: sous.reduce((s, g) => s + g.sortie, 0),
    jetons_relus_sous_agents: sous.reduce((s, g) => s + g.relus, 0),
    mediane_relus_par_sous_agent: mediane(sous.map((g) => g.relus)),
    mediane_contexte_initial: mediane(sous.map((g) => g.contexte_initial)),
    mediane_appels_outils: mediane(sous.map((g) => g.outils)),
  };
  const criteres = [
    { critere: "part des appels vers un agent nommé ≥ 90 %", tenu: indicateurs.part_nommee === null ? null : indicateurs.part_nommee >= SEUILS.part_nommee_min },
    { critere: "0 délégation Opus sans effort déclaré", tenu: opusSansEffort <= SEUILS.opus_sans_effort_max },
    { critere: "0 réponse hors génération courante", tenu: courants ? horsGeneration.length <= SEUILS.hors_generation_max : null },
  ];
  const verdict = criteres.some((c) => c.tenu === false) ? "AVERT" : "PASS";
  // L'essai de relecture d'intention : les jetons d'une relecture sont ceux de toutes ses réponses (entrée, sortie, cache relu
  // et écrit, une réponse comptée sur sa dernière ligne) — la méthode de la mesure du 18/10 (min 46 056 = 4 + 1 660 + 25 131 + 19 261).
  // Le seuil porte sur les jetons de relecture PAR JOUR : la dépense que l'essai ajoute. Il n'entre pas dans les critères de la
  // flotte (son verdict reste celui de l'étude flotte) : il se dit à part, et franchi, l'essai s'arrête et demande.
  const relectures = sous.filter((g) => estRelectureIntention(g.type, g.description));
  const parJour = {};
  for (const g of relectures) parJour[g.jour] = (parJour[g.jour] || 0) + g.total;
  const jourMax = Object.entries(parJour).sort((x, y) => y[1] - x[1])[0] || null;
  // La simultanéité (TF-1928) : le pic par session principale, sa distribution, et la session qui porte le maximum.
  const pics = [...parSession].map(([cle, iv]) => ({ cle, pic: picSimultaneite(iv), sous_agents: iv.length }));
  const picMax = pics.reduce((m, p) => (p.pic > (m ? m.pic : 0) ? p : m), null);
  indicateurs.simultaneite = {
    sessions_avec_sous_agents: pics.length,
    pic_max: picMax ? picMax.pic : 0,
    session_pic_max: picMax ? picMax.cle.split("/").pop().slice(0, 8) : null,
    sessions_a_5_ou_plus: pics.filter((p) => p.pic >= 5).length,
    sessions_a_10_ou_plus: pics.filter((p) => p.pic >= 10).length,
    distribution_des_pics: compter(pics.map((p) => p.pic)),
    limite_par_defaut: LIMITE_SOUS_AGENTS_SIMULTANES,
  };
  indicateurs.essai_relecture_intention = {
    ...ESSAI_RELECTURE,
    relectures: relectures.length,
    jetons: relectures.reduce((t, g) => t + g.total, 0),
    jetons_par_jour: parJour,
    jour_max: jourMax ? { jour: jourMax[0], jetons: jourMax[1] } : null,
    seuil_franchi: !!jourMax && jourMax[1] > ESSAI_RELECTURE.seuil_jetons_par_jour,
  };
  return { indicateurs, criteres, verdict, appels, sous_agents: sous };
}

/** La ligne du relevé sur la simultanéité : le pic maximal et sa session, les sessions à 5 ou plus et à 10 ou plus, la limite par défaut dite. */
export function ligneSimultaneite(s) {
  if (!s.sessions_avec_sous_agents) return "  simultanéité : aucune session n'a lancé de sous-agent sur la période";
  return `  simultanéité de sous-agents : ${s.sessions_avec_sous_agents} session(s) en ont lancé, pic maximal ${s.pic_max} (session ${s.session_pic_max}), `
    + `${s.sessions_a_5_ou_plus} session(s) à 5 ou plus, ${s.sessions_a_10_ou_plus} à 10 ou plus ; limite par défaut d'une session : ${s.limite_par_defaut} (unité : le sous-agent, pas la session parallèle)`;
}

/** La ligne du relevé sur l'essai de relecture d'intention : le décompte, le jour le plus chargé, et le seuil d'arrêt dit. */
export function ligneEssaiRelecture(e) {
  const n = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const max = e.jour_max ? `jour le plus chargé ${e.jour_max.jour} : ${n(e.jour_max.jetons)} jetons` : "aucun jour chargé";
  return `  relectures d'intention (essai du ${e.debut} au ${e.fin}, ${e.prolongation}, revue le ${e.revue}) : ${e.relectures} relecture(s), ${n(e.jetons)} jetons ; ${max} — seuil de ${n(e.seuil_jetons_par_jour)} jetons par jour `
    + (e.seuil_franchi ? "FRANCHI : arrêter l'essai et demander à l'humain" : "tenu");
}

export function executer(argv, env = process.env, maintenant = new Date()) {
  const a = { transcripts: [], projet: null, jours: 14, depuis: null, referentiel: REF_DEFAUT, json: false, journal: null, etiquette: null };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    const val = () => { const v = argv[++i]; if (v === undefined || v.startsWith("--")) throw new Error(`${x} attend une valeur`); return v; };
    try {
      if (x === "--transcripts") a.transcripts.push(val());
      else if (x === "--projet") a.projet = val().toLowerCase();
      else if (x === "--jours") a.jours = Number(val());
      else if (x === "--depuis") a.depuis = val();
      else if (x === "--referentiel") a.referentiel = val();
      else if (x === "--json") a.json = true;
      else if (x === "--journal") a.journal = val();
      else if (x === "--etiquette") a.etiquette = val();
      else return { code: 2, sortie: `relever-flotte : option inconnue : ${x}` };
    } catch (e) { return { code: 2, sortie: `relever-flotte : ${e.message}` }; }
  }
  if (a.depuis !== null && !/^\d{4}-\d{2}-\d{2}/.test(a.depuis)) return { code: 2, sortie: "relever-flotte : --depuis attend une date AAAA-MM-JJ" };
  if (a.depuis === null && !(Number.isFinite(a.jours) && a.jours > 0)) return { code: 2, sortie: "relever-flotte : --jours attend un nombre positif" };
  const depuisIso = a.depuis ? new Date(a.depuis).toISOString() : new Date(maintenant.getTime() - a.jours * 86400000).toISOString();
  let dossiers = a.transcripts.length ? a.transcripts : dossiersParDefaut(env);
  if (a.projet) dossiers = dossiers.filter((d) => basename(d).toLowerCase().includes(a.projet));
  const courants = generationCourante(a.referentiel);
  const r = relever(dossiers, depuisIso, courants);
  const rapport = { outil: "relever-flotte", version: VERSION, depuis: depuisIso, dossiers: dossiers.length, verdict: r.verdict, criteres: r.criteres, indicateurs: r.indicateurs,
    non_juge: ["la justesse de l'agent choisi pour la tâche", "les sous-agents lancés hors de l'outil Agent (une CLI `claude -p` compte comme une session)", "les postes et profils absents de ce poste", "les sessions principales vivantes en parallèle (la simultanéité compte les sous-agents d'une session, et un sous-agent en attente compte comme actif)"] };
  if (a.journal) appendFileSync(a.journal, JSON.stringify({ ts: maintenant.toISOString(), etiquette: a.etiquette, depuis: depuisIso, verdict: r.verdict, indicateurs: r.indicateurs }) + "\n");
  if (a.json) return { code: 0, sortie: JSON.stringify(rapport, null, 1), rapport };
  const I = r.indicateurs;
  const pc = (x) => (x === null ? "—" : `${Math.round(x * 100)} %`);
  const k = (n) => (n === null ? "—" : `${Math.round(n / 1000)} k`);
  const out = [
    `relever-flotte ${VERSION} — depuis ${depuisIso.slice(0, 10)}, ${dossiers.length} dossier(s) de projets : verdict ${r.verdict}`,
    `  appels de l'outil Agent : ${I.appels} — vers un agent nommé ${I.appels_vers_agent_nomme} (${pc(I.part_nommee)}), dérogation dite ${I.appels_avec_derogation}, hors flotte ${I.appels_hors_flotte}`,
    `  sous-agents : ${I.sous_agents} — ${Object.entries(I.sous_agents_modele_effort).sort((x, y) => y[1] - x[1]).map(([m, n]) => `${m} ×${n}`).join(", ") || "aucun"}`,
    `  jetons des sous-agents : ${k(I.jetons_sortie_sous_agents)} en sortie, ${k(I.jetons_relus_sous_agents)} relus ; médianes : ${k(I.mediane_relus_par_sous_agent)} relus, ${k(I.mediane_contexte_initial)} au premier appel, ${I.mediane_appels_outils ?? "—"} appels d'outils`,
    `  réponses hors génération courante : ${I.reponses_hors_generation}${I.reponses_hors_generation ? " — " + Object.entries(I.hors_generation_par_modele).map(([m, n]) => `${m} ×${n}`).join(", ") : ""}${courants ? "" : " (référentiel illisible : non jugé)"}`,
  ];
  out.push(ligneSimultaneite(I.simultaneite));
  out.push(ligneEssaiRelecture(I.essai_relecture_intention));
  for (const c of r.criteres) out.push(`  [${c.tenu === null ? "NON JUGÉ" : c.tenu ? "TENU" : "NON TENU"}] ${c.critere}`);
  if (a.journal) out.push(`  journal : une ligne ajoutée à ${a.journal}`);
  return { code: 0, sortie: out.join("\n"), rapport };
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const r = executer(process.argv.slice(2));
  (r.code === 2 ? console.error : console.log)(r.sortie);
  process.exit(r.code);
}
