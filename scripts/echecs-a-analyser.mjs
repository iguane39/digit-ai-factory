#!/usr/bin/env node
/**
 * echecs-a-analyser.mjs — LES FICHES À ANALYSER : LES AGENTS DE 17 MINUTES OU PLUS QUI NE FINISSENT PAS « fini », 5 AU PLUS PAR REVUE,
 * ET LA CONSIGNE DE L'ANALYSTE POUR L'UN D'EUX (décision humaine D-219 (e) du 15/11/2026, TF-2563, mandat 20261115b, lot L5 ; étude
 * `output/03-etudes/Digit-AI - Étude - Amelioration continue des agents par leurs lecons - 20261114d.md`, option O4).
 *
 * LE FAIT (étude, Q1, « Manques identifiés », 3) : la cause d'un échec d'agent est dans sa transcription, et aucun script ne l'extrait ;
 * la fiche d'exécution (lot L1) n'en porte que la forme, `cause_fin`, par une heuristique. L'étude chiffre le risque de l'option O4, « le
 * coût récurrent dépasse le gain », et sa parade : « ne déclencher l'analyse que sur les agents de plus de 17 min qui échouent ».
 * Mesuré le 15/11/2026 sur les 369 transcriptions de sous-agents du poste en 30 jours (heuristique du lot L1 rejouée) : 80 agents de
 * 17 minutes ou plus, dont 1 seul qui ne finit pas `fini` ; et `"is_error":true` figure dans 138 transcriptions, presque toutes finies :
 * une erreur d'outil suivie d'une reprise n'est pas une cause d'échec.
 *
 * CE QU'IL FAIT, en lecture seule. Il lit les fiches du PROJET COURANT, le fichier que vise aussi `noter-fiche.mjs` (`cheminFiches` du
 * lot L1 : `FORGE_FICHES_AGENTS`, sinon celui du pilot ou du produit de `CLAUDE_PROJECT_DIR` ou du répertoire courant), par la règle de
 * `lireFiches` : ce qu'il retient se note donc sans écrire chez un autre projet. Il retient les fiches À ANALYSER : durée connue de 17
 * minutes ou plus (`SEUIL_MIN` d'`oracle-suivi-agents.mjs`, le seuil du suivi et de `longs_non_finis` de la mission « agents » de l'œil
 * critique), cause de fin autre que `fini` (inconnue comprise), aucune cause encore analysée, transcription présente sur le poste ; les
 * plus anciennes d'abord, parce que le harnais purge une transcription après un mois ; 5 au plus (`PLAFOND`). Ce qui n'est pas retenu
 * est compté, jamais tu : déjà analysées, sans transcription, au-delà du plafond.
 *   `--agent <id>` juge UN agent et prépare la consigne de l'analyste (`analyste-echecs`, `gabarits/flotte/analyste-echecs.yaml`) : sa
 * fiche, le chemin de sa transcription, le jeu fermé des causes (`CAUSES_ANALYSEES` de `noter-fiche.mjs`) avec ce que chacune désigne,
 * la forme de la réponse, et la commande par laquelle la session inscrira la cause. Il REFUSE (exit 1) un agent de moins de 17 minutes,
 * de durée inconnue, fini, sans fiche, ou dont la transcription n'est plus sur le poste.
 *   Le coût d'une analyse se MESURE à la fiche de l'analyste lui-même (type `analyste-echecs`, écrite par le hook de fin d'agent) : la
 * liste en donne les médianes de jetons et de durée, ou dit qu'aucune analyse n'a encore couru.
 *
 * JAMAIS UN HOOK NE LANCE L'ANALYSTE : la mission « agents » de l'œil critique ou une session le lance, sur une fiche que cette liste
 * retient. Ce script ne lance rien et n'écrit rien ; la cause se note par `scripts/noter-fiche.mjs --cause-analysee <cause> --analyste`.
 *
 * AUCUN CHEMIN DE PRODUIT dans la liste : un projet se dit par le pseudonyme que porte la fiche, le fichier lu par son nom de contrat
 * (`lieuDe` de `noter-fiche.mjs`). Seule la consigne de `--agent` cite le chemin de la transcription sur le poste, parce que l'analyste
 * doit la lire : elle va à l'outil Agent, jamais à un fichier versionné.
 *
 * Usage : node scripts\echecs-a-analyser.mjs [--jours N | --depuis AAAA-MM-JJ] [--json] [--transcripts <dossier de projet>]…
 *         node scripts\echecs-a-analyser.mjs --agent <id> [--json] [--transcripts <dossier de projet>]…
 *   (défaut : 30 jours, la durée de vie d'une transcription ; `--transcripts` : les dossiers de projets où chercher les transcriptions,
 *   au lieu de ceux du poste, `dossiersParDefaut` de `relever-contexte-sessions.mjs`)
 * Exit : 0 liste rendue, ou agent à analyser · 1 agent refusé (moins de 17 minutes, durée inconnue, fini, sans fiche, sans transcription)
 *        · 2 usage invalide.
 * NON JUGÉ (déclaré) : la justesse de la cause (le porteur la valide ou la corrige) ; le plafond tient à UN appel par revue, et la
 * liste rejouée après des causes notées rend les suivantes ; les agents d'un autre projet, dont la cause s'écrirait chez lui ; un agent
 * dont la fiche manque (hook absent, autre poste) ; une transcription purgée par le harnais.
 * Recette : `scripts/echecs-a-analyser.test.mjs`.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CAUSES_ANALYSEES, ID_AGENT, lieuDe, lireFiches } from "./noter-fiche.mjs";
import { dureeLisible } from "./relever-flotte.mjs";
import { dossiersParDefaut } from "./relever-contexte-sessions.mjs";
import { cheminFiches } from "../oracles/lib-fiches-agents.mjs";
import { racineDuProjet } from "../oracles/lib-racine-projet.mjs";
import { SEUIL_MIN } from "../oracles/oracle-suivi-agents.mjs";

export const VERSION = "1.0.0";
/** Le plafond d'analyses par revue (mandat 20261115b, lot L5) : il se change par un commit motivé, jamais par une option. */
export const PLAFOND = 5;
export const ANALYSTE = "analyste-echecs";
export const JOURS_DEFAUT = 30;
const ICI = dirname(fileURLToPath(import.meta.url));
const NOTER = join(ICI, "noter-fiche.mjs");
const PROJET_ADMIS = [/^Produit-\d{2,}$/, /^digit-ai-[a-z0-9-]+$/];
const SESSION_COURTE = /^[0-9a-f-]{1,36}$/i;

/** Ce que désigne chaque cause du jeu fermé, et les marques à chercher dans la transcription : la consigne de l'analyste les recopie. */
export const DEFINITIONS_CAUSES = Object.freeze({
  erreur_consigne: "la consigne a empêché ou égaré l'agent : prémisse fausse, fichier ou chemin désigné absent, demandes contradictoires, critère de fin introuvable ; l'agent le dit, ou travaille sur un objet que la consigne a mal nommé",
  depassement_contexte: "le contexte de l'agent s'est épuisé : « Prompt is too long », résumé de compaction (`\"isCompactSummary\":true`) suivi d'une perte du fil ou de tâches refaites",
  erreur_outil: "une panne de l'outillage a arrêté l'agent : erreur d'API (`\"isApiErrorMessage\":true`, modèle `<synthetic>`), délai dépassé, limite de sortie (`\"stop_reason\":\"max_tokens\"`), refus de hook ou de permission sans issue ; une erreur d'outil (`\"is_error\":true`, `<tool_use_error>`) suivie d'une reprise n'est pas la cause",
  abandon: "l'agent s'est arrêté sans finir et sans panne qui l'y force : interruption (« [Request interrupted by user »), fin sur un appel d'outil sans texte final, phrase d'attente",
  autre: "aucune des quatre, ou la transcription ne permet pas de trancher : dire ce qui manque",
});

const mediane = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };
const jourHeure = (iso) => { const d = new Date(iso); if (Number.isNaN(d.getTime())) return "heure inconnue"; const p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };
const taille = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1).replace(".", ",")} Mo` : `${n} octets`);

/** L'éligibilité d'une fiche à l'analyse : { eligible, motif }. La borne : durée connue de 17 minutes ou plus, cause de fin autre que `fini`. */
export function eligibilite(fiche, { seuilMin = SEUIL_MIN } = {}) {
  if (!fiche) return { eligible: false, motif: "aucune fiche de cet agent : rien à analyser" };
  const d = Number.isFinite(fiche.duree_s) ? fiche.duree_s : null;
  if (d === null) return { eligible: false, motif: `durée inconnue : la borne de ${seuilMin} minutes ne se vérifie pas, l'analyse n'est pas lancée` };
  if (d < seuilMin * 60) return { eligible: false, motif: `agent de moins de ${seuilMin} minutes (${dureeLisible(d)}) : refusé, l'analyse ne se lance qu'à partir de ${seuilMin} minutes` };
  if (fiche.cause_fin === "fini") return { eligible: false, motif: "agent fini : sa fiche ne dit aucun échec à analyser" };
  return { eligible: true, motif: `${dureeLisible(d)}, fin « ${fiche.cause_fin ?? "inconnue"} »` };
}

/**
 * La transcription d'un agent sur le poste, `<dossier de projet>/<session>/subagents/agent-<id>.jsonl`, ou null. La session se cherche
 * d'abord par les 8 caractères que porte la fiche, puis dans toutes les sessions (une fiche dont la session est inconnue ou héritée).
 */
export function transcriptionDe(agentId, session, dossiers) {
  if (!ID_AGENT.test(String(agentId ?? ""))) return null;
  const prefixe = typeof session === "string" && SESSION_COURTE.test(session) ? session.toLowerCase() : "";
  for (const filtre of prefixe ? [prefixe, ""] : [""]) {
    for (const d of dossiers) {
      let sessions; try { sessions = readdirSync(d, { withFileTypes: true }); } catch { continue; }
      for (const s of sessions) {
        if (!s.isDirectory() || (filtre && !s.name.toLowerCase().startsWith(filtre))) continue;
        const f = join(d, s.name, "subagents", `agent-${agentId}.jsonl`);
        if (existsSync(f)) return f;
      }
    }
  }
  return null;
}

/** Une fiche dite sans chemin ni contenu : identifiants, nombres, noms de modèle, d'effort et de type, projet sous un pseudonyme admis. */
export function resume(fiche) {
  return { agent_id: fiche.agent_id ?? null, ts: fiche.ts ?? null, projet: typeof fiche.projet === "string" && PROJET_ADMIS.some((re) => re.test(fiche.projet)) ? fiche.projet : null,
    type: fiche.type ?? null, session: fiche.session ?? null, duree_s: Number.isFinite(fiche.duree_s) ? fiche.duree_s : null, cause_fin: fiche.cause_fin ?? null,
    modele: fiche.modele ?? null, effort: fiche.effort ?? null, appels_outils: Number.isFinite(fiche.appels_outils) ? fiche.appels_outils : null, partielle: fiche.partielle === true };
}

/** Le coût mesuré d'une analyse : les fiches de l'analyste lui-même (type `analyste-echecs`), toutes dates. */
export function coutDesAnalyses(fiches) {
  const a = [...fiches.values()].filter((f) => f.type === ANALYSTE);
  const nombres = (k) => a.map((f) => f[k]).filter(Number.isFinite);
  return { analyses: a.length, mediane_jetons_entree: mediane(nombres("jetons_entree")), mediane_jetons_sortie: mediane(nombres("jetons_sortie")), mediane_duree_s: mediane(nombres("duree_s")) };
}

/**
 * La liste d'une revue : { eligibles, retenues (5 au plus, des plus anciennes aux plus récentes), deja_analysees, sans_transcription,
 * au_dela_du_plafond } — identifiants seuls hors des retenues. `trouver` est injectable pour les bancs.
 */
export function listerEchecs({ fiches, verdicts, depuisIso = "", dossiers = [], plafond = PLAFOND, seuilMin = SEUIL_MIN, trouver = transcriptionDe }) {
  const candidates = [...fiches.values()]
    .filter((f) => String(f.ts ?? "") >= depuisIso && eligibilite(f, { seuilMin }).eligible)
    .sort((x, y) => String(x.ts ?? "").localeCompare(String(y.ts ?? "")) || String(x.agent_id).localeCompare(String(y.agent_id)));
  const retenues = [], deja = [], sans = [], auDela = [];
  for (const f of candidates) {
    const v = verdicts.get(f.agent_id);
    if (v && v.cause_analysee) { deja.push(f.agent_id); continue; }
    if (retenues.length >= plafond) { auDela.push(f.agent_id); continue; }
    if (!trouver(f.agent_id, f.session, dossiers)) { sans.push(f.agent_id); continue; }
    retenues.push(resume(f));
  }
  return { eligibles: candidates.length, retenues, deja_analysees: deja, sans_transcription: sans, au_dela_du_plafond: auDela };
}

/** La consigne de l'analyste pour un agent : ce qu'il lit, ce qu'il rend, ce qu'il ne fait pas. */
export function consigneAnalyste({ fiche, transcription, lignes, octets }) {
  const r = resume(fiche);
  const lacunes = Array.isArray(fiche.lacunes) && fiche.lacunes.length ? ` ; lacunes de la fiche : ${fiche.lacunes.join(" ; ")}` : "";
  return [
    `Analyse de la cause d'échec de l'agent ${r.agent_id} (D-219 (e), mandat 20261115b, lot L5).`,
    `Sa fiche : type ${r.type ?? "inconnu"}, ${dureeLisible(r.duree_s)}, cause de fin « ${r.cause_fin ?? "inconnue"} » selon l'heuristique du hook, modèle ${r.modele ?? "inconnu"}, `
      + `effort ${r.effort ?? "inconnu"}, ${r.appels_outils ?? "?"} appel(s) d'outils${lacunes}.`,
    `Sa transcription, la seule à lire : ${transcription} (${lignes} lignes, ${taille(octets)}). Une ligne est un objet JSON.`,
    "",
    `Méthode : lis d'abord la fin (Read, offset ${Math.max(1, lignes - 80)}), cherche par Grep les marques des causes ci-dessous, puis remonte au premier signe de ce qui a arrêté l'agent.`,
    "",
    "Rends UNE cause du jeu fermé, écrite telle quelle :",
    ...CAUSES_ANALYSEES.map((c) => `- ${c} : ${DEFINITIONS_CAUSES[c]}`),
    "",
    "Réponds en trois lignes :",
    "cause : <une des cinq>",
    "citation : « <extrait recopié mot pour mot> » (ligne <n>)",
    "raison : <pourquoi cet extrait fonde cette cause plutôt qu'une autre>",
    "",
    "Tu n'écris aucun fichier et ne lances aucune commande. De la transcription, tu ne recopies que la citation.",
  ].join("\n");
}

/** La commande par laquelle la session inscrit la cause, depuis le même dossier que cette liste. */
export const commandeApres = (id) => `node "${NOTER}" --agent ${id} --cause-analysee <cause> --analyste ${ANALYSTE}`;

/** Juge UN agent et prépare la consigne : { code, eligible, motif, fiche, transcription, lignes, octets, consigne, apres, deja }. */
export function preparerAgent({ id, fiches, verdicts, dossiers, seuilMin = SEUIL_MIN }) {
  const fiche = fiches.get(id) ?? null;
  const e = eligibilite(fiche, { seuilMin });
  const base = { eligible: false, fiche: fiche ? resume(fiche) : null, transcription: null, lignes: null, octets: null, consigne: null, apres: null, deja: null };
  if (!e.eligible) return { ...base, code: 1, motif: `agent ${id} refusé — ${e.motif}` };
  const t = transcriptionDe(id, fiche.session, dossiers);
  if (!t) return { ...base, code: 1, motif: `agent ${id} refusé — sa transcription n'est plus sur le poste (purgée après un mois, ou écrite sur un autre poste) : rien à lire` };
  let lignes = 0, octets = 0;
  try { const b = readFileSync(t); octets = b.length; for (const x of b) if (x === 10) lignes++; } catch { return { ...base, code: 1, motif: `agent ${id} refusé — sa transcription est illisible` }; }
  const v = verdicts.get(id);
  const deja = v && v.cause_analysee ? { cause_analysee: v.cause_analysee, analyste: v.analyste } : null;
  return { code: 0, eligible: true, motif: `agent ${id} à analyser — ${e.motif}${deja ? ` ; déjà analysé (${deja.cause_analysee} par ${deja.analyste ?? "un analyste sans nom lisible"}) : une seconde analyse ajoutera une ligne` : ""}`,
    fiche: resume(fiche), transcription: t, lignes, octets, consigne: consigneAnalyste({ fiche, transcription: t, lignes, octets }), apres: commandeApres(id), deja };
}

const ligneCout = (c) => (c.analyses
  ? `  coût mesuré d'une analyse (${c.analyses} fiche(s) de l'analyste, type ${ANALYSTE}) : médiane ${c.mediane_jetons_entree ?? "?"} jetons d'entrée, ${c.mediane_jetons_sortie ?? "?"} de sortie, ${dureeLisible(c.mediane_duree_s)}`
  : `  coût d'une analyse : non mesuré, aucune fiche de l'analyste (type ${ANALYSTE}) ; la première analyse lancée écrira la sienne, que cette liste résumera`);

export function executer(argv, env = process.env, maintenant = new Date(), cwd = process.cwd()) {
  const a = { agent: null, jours: JOURS_DEFAUT, depuis: null, json: false, transcripts: [] };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    const val = () => { const v = argv[++i]; if (v === undefined || v.startsWith("--")) throw new Error(`${x} attend une valeur`); return v; };
    try {
      if (x === "--agent") a.agent = val();
      else if (x === "--jours") a.jours = Number(val());
      else if (x === "--depuis") a.depuis = val();
      else if (x === "--transcripts") a.transcripts.push(val());
      else if (x === "--json") a.json = true;
      else return { code: 2, sortie: `echecs-a-analyser : option inconnue : ${x}` };
    } catch (e) { return { code: 2, sortie: `echecs-a-analyser : ${e.message}` }; }
  }
  if (a.agent !== null && !ID_AGENT.test(a.agent)) return { code: 2, sortie: `echecs-a-analyser : --agent attend l'identifiant d'un agent (lettres, chiffres, - et _, 64 au plus), reçu « ${a.agent.slice(0, 40)} »` };
  if (a.depuis !== null && !/^\d{4}-\d{2}-\d{2}/.test(a.depuis)) return { code: 2, sortie: "echecs-a-analyser : --depuis attend une date AAAA-MM-JJ" };
  if (a.depuis === null && !(Number.isFinite(a.jours) && a.jours > 0)) return { code: 2, sortie: "echecs-a-analyser : --jours attend un nombre positif" };
  let chemin = null;
  try { chemin = cheminFiches(racineDuProjet(cwd, env), env); } catch { chemin = null; }
  let texte = null;
  try { if (chemin) texte = readFileSync(chemin, "utf8"); } catch { texte = null; }
  const lieu = !chemin ? "aucun fichier de fiches (hors du pilot et de tout produit)" : `${lieuDe(chemin, env)}${texte === null ? " (absent)" : ""}`;
  const { fiches, verdicts } = lireFiches(texte ?? "");
  const dossiers = a.transcripts.length ? a.transcripts : dossiersParDefaut(env);
  const cout = coutDesAnalyses(fiches);

  if (a.agent !== null) {
    const p = preparerAgent({ id: a.agent, fiches, verdicts, dossiers });
    if (a.json) return { code: p.code, sortie: JSON.stringify({ outil: "echecs-a-analyser", version: VERSION, lieu, agent: a.agent, ...p }, null, 1) };
    const out = [`echecs-a-analyser ${VERSION} — ${p.motif}`];
    if (p.eligible) out.push("", `Consigne de l'analyste (outil Agent, subagent_type ${ANALYSTE}) :`, "", p.consigne, "", "Après sa réponse, la session inscrit la cause, depuis ce même dossier :", p.apres);
    return { code: p.code, sortie: out.join("\n") };
  }

  const depuisIso = a.depuis ? new Date(a.depuis).toISOString() : new Date(maintenant.getTime() - a.jours * 86400000).toISOString();
  const l = listerEchecs({ fiches, verdicts, depuisIso, dossiers });
  const rapport = { outil: "echecs-a-analyser", version: VERSION, lieu, depuis: depuisIso, seuil_min: SEUIL_MIN, plafond: PLAFOND, agents_fiches: fiches.size, ...l, cout,
    non_juge: ["la justesse de la cause, que le porteur valide ou corrige", "un second appel dans la même revue, qui rend les fiches suivantes : le plafond tient à un appel par revue",
      "les agents d'un autre projet, dont la cause s'écrirait chez lui", "un agent sans fiche, une transcription purgée"] };
  if (a.json) return { code: 0, sortie: JSON.stringify(rapport, null, 1) };
  const out = [`echecs-a-analyser ${VERSION} — ${lieu}, depuis ${depuisIso.slice(0, 10)} : ${fiches.size} agent(s) fiché(s), ${l.eligibles} de ${SEUIL_MIN} min ou plus dont la fin n'est pas « fini », `
    + `${l.retenues.length} retenu(s) sur un plafond de ${PLAFOND} par revue`];
  if (l.retenues.length) {
    out.push(`  à analyser, des plus anciens aux plus récents (la consigne de chacun : --agent <id>) :`);
    for (const r of l.retenues) out.push(`    ${jourHeure(r.ts)} · ${r.projet ?? "projet inconnu"} · ${r.type ?? "type inconnu"} · ${r.agent_id} · ${dureeLisible(r.duree_s)} · ${r.cause_fin ?? "cause inconnue"}${r.partielle ? " · partielle" : ""}`);
  }
  out.push(`  non retenus : ${l.deja_analysees.length} déjà analysé(s), ${l.sans_transcription.length} sans transcription sur le poste, ${l.au_dela_du_plafond.length} au-delà du plafond (la revue suivante les reprend)`);
  out.push(ligneCout(cout));
  out.push(`  l'analyste n'est jamais lancé par un hook : la mission « agents » de l'œil critique ou la session le lance ; la cause se note par noter-fiche.mjs --cause-analysee`);
  return { code: 0, sortie: out.join("\n") };
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const r = executer(process.argv.slice(2));
  (r.code === 2 ? console.error : console.log)(r.sortie);
  process.exit(r.code);
}
