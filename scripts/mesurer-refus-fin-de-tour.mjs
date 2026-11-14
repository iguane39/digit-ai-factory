#!/usr/bin/env node
/**
 * mesurer-refus-fin-de-tour.mjs — COMBIEN DE FINS DE TOUR LE HOOK DE RESTITUTION A-T-IL REFUSÉES, ET SOUS
 * QUELLE FORME ? (TF-1947, action A-1 du 05/11/2026.)
 *
 * LE FAIT. Le 05/11/2026, 83 refus ont été comptés sur 7,5 jours (29/10 au 05/11) par un agent, avec un script
 * jetable : la mesure ne se rejouait pas. Le rappel de restitution servi au lancement d'un agent (L-006, TF-1947)
 * se juge le 12/11 contre ces chiffres ; ce script les rend rejouables, sur la même définition.
 *
 * CE QU'IL COMPTE, en lecture seule, dans les transcriptions de chaque profil `~\.claude*` du poste (sessions et
 * sous-agents) : une ligne `attachment` de type `hook_blocking_error`, d'événement `Stop`, dont le texte nomme au
 * moins une règle en tête de ligne (« S<n> — »). Un même refus écrit deux fois (même `toolUseID`, même instant,
 * même début de texte) compte une fois. Chaque refus est classé par la phrase « Jugé parce que » du hook :
 *   · `tour_ecrit` : « tour de travail », la restitution complète était due ;
 *   · `verdict_court` et `verdict_long` : « message portant un VERDICT (N mots », seuil de 250 mots ;
 *   · `sans_ecriture_court` et `sans_ecriture_long` : « message de N mots rendu », même seuil ;
 *   · `autre` : le reste.
 * Le rythme se rend en refus par 7 jours sur la période, à comparer à la référence (78, le 05/11/2026).
 *
 * Exit : 0 relevé rendu ; 2 option invalide.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dossiersParDefaut } from "./relever-contexte-sessions.mjs";

export const REFERENCE_PAR_SEMAINE = 78;
const SEUIL_MOTS = 250;
const REGLE = /^S(\d+) — /gm;

function* transcriptions(dossier) {
  let entrees; try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return; }
  for (const e of entrees) {
    const p = join(dossier, e.name);
    if (e.isFile() && e.name.endsWith(".jsonl")) yield { fichier: p, sous_agent: false };
    else if (e.isDirectory() && existsSync(join(p, "subagents")))
      for (const f of readdirSync(join(p, "subagents"))) if (f.endsWith(".jsonl")) yield { fichier: join(p, "subagents", f), sous_agent: true };
  }
}

/** La forme d'un refus, lue dans la phrase « Jugé parce que » du hook. Pur. */
export function formeDuRefus(texte) {
  let m;
  if (/Jugé parce que : tour de travail/.test(texte)) return "tour_ecrit";
  if ((m = texte.match(/message portant un VERDICT \((\d+) mots/))) return +m[1] <= SEUIL_MOTS ? "verdict_court" : "verdict_long";
  if ((m = texte.match(/message de (\d+) mots rendu/))) return +m[1] <= SEUIL_MOTS ? "sans_ecriture_court" : "sans_ecriture_long";
  return "autre";
}

/** Les refus distincts entre deux instants ISO (fin exclue), sur une liste de dossiers de projet. */
export function relever(dossiers, depuisIso, jusquIso) {
  const refus = new Map();
  for (const d of dossiers) for (const { fichier, sous_agent } of transcriptions(d)) {
    let texte; try { texte = readFileSync(fichier, "utf8"); } catch { continue; }
    for (const ligne of texte.split("\n")) {
      if (!ligne.includes('"hook_blocking_error"') || !ligne.includes('"Stop"')) continue;
      let r; try { r = JSON.parse(ligne); } catch { continue; }
      const a = r.attachment || {};
      if (a.type !== "hook_blocking_error" || a.hookEvent !== "Stop") continue;
      const ts = r.timestamp || "";
      if (ts < depuisIso || ts >= jusquIso) continue;
      const be = a.blockingError;
      const t = typeof be === "object" && be ? String(be.blockingError || "") : String(be || "");
      const regles = [...new Set([...t.matchAll(REGLE)].map((x) => `S${x[1]}`))].sort();
      if (!regles.length) continue;
      const cle = `${a.toolUseID}|${ts}|${t.slice(0, 200)}`;
      if (!refus.has(cle)) refus.set(cle, { ts, projet: d.split(/[\\/]/).pop(), sous_agent, regles, forme: formeDuRefus(t) });
    }
  }
  return [...refus.values()].sort((x, y) => x.ts.localeCompare(y.ts));
}

const compter = (liste, f) => liste.reduce((o, x) => { for (const k of [].concat(f(x))) o[k] = (o[k] || 0) + 1; return o; }, {});

// Minuit, heure de Paris, d'une date AAAA-MM-JJ, en instant ISO.
export function minuitParis(date) {
  const midi = new Date(`${date}T12:00:00Z`);
  const decalage = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", timeZoneName: "shortOffset" })
    .formatToParts(midi).find((p) => p.type === "timeZoneName").value.match(/GMT([+-]\d+)?/)[1] || "0";
  return new Date(Date.parse(`${date}T00:00:00Z`) - Number(decalage) * 3600000).toISOString();
}

export function executer(argv, env = process.env, maintenant = new Date()) {
  const a = { transcripts: [], depuis: null, jusqu: null, reference: REFERENCE_PAR_SEMAINE, json: false };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    const val = () => { const v = argv[++i]; if (v === undefined || v.startsWith("--")) throw new Error(`${x} attend une valeur`); return v; };
    try {
      if (x === "--transcripts") a.transcripts.push(val());
      else if (x === "--depuis") a.depuis = val();
      else if (x === "--jusqu-au") a.jusqu = val();
      else if (x === "--reference") a.reference = Number(val());
      else if (x === "--json") a.json = true;
      else return { code: 2, sortie: `mesurer-refus-fin-de-tour : option inconnue : ${x}` };
    } catch (e) { return { code: 2, sortie: `mesurer-refus-fin-de-tour : ${e.message}` }; }
  }
  for (const [nom, v] of [["--depuis", a.depuis], ["--jusqu-au", a.jusqu]])
    if (v !== null && !/^\d{4}-\d{2}-\d{2}$/.test(v)) return { code: 2, sortie: `mesurer-refus-fin-de-tour : ${nom} attend une date AAAA-MM-JJ` };
  if (a.depuis === null) return { code: 2, sortie: "mesurer-refus-fin-de-tour : --depuis AAAA-MM-JJ est requis" };
  if (!(Number.isFinite(a.reference) && a.reference > 0)) return { code: 2, sortie: "mesurer-refus-fin-de-tour : --reference attend un nombre positif" };
  const depuisIso = minuitParis(a.depuis);
  const jusquIso = a.jusqu ? minuitParis(a.jusqu) : maintenant.toISOString();
  const jours = (Date.parse(jusquIso) - Date.parse(depuisIso)) / 86400000;
  if (!(jours > 0)) return { code: 2, sortie: "mesurer-refus-fin-de-tour : la période est vide" };
  const dossiers = a.transcripts.length ? a.transcripts.map((d) => resolve(d)) : dossiersParDefaut(env);
  const refus = relever(dossiers, depuisIso, jusquIso);
  const parSemaine = Math.round((refus.length / jours) * 7 * 10) / 10;
  const rapport = {
    outil: "mesurer-refus-fin-de-tour", depuis: depuisIso, jusqu_au: jusquIso, jours: Math.round(jours * 100) / 100,
    dossiers: dossiers.length, refus: refus.length, par_semaine: parSemaine, reference_par_semaine: a.reference,
    ecart_a_la_reference: Math.round((parSemaine - a.reference) * 10) / 10,
    par_forme: compter(refus, (x) => x.forme), par_jour: compter(refus, (x) => x.ts.slice(0, 10)),
    par_regle: compter(refus, (x) => x.regles), par_projet: compter(refus, (x) => x.projet),
    sous_agents: refus.filter((x) => x.sous_agent).length,
    non_juge: ["la justesse de chaque refus", "les postes et profils absents de ce poste", "les jours UTC de par_jour, qui ne suivent pas l'heure de Paris"],
  };
  if (a.json) return { code: 0, sortie: JSON.stringify(rapport, null, 2) };
  const lignes = [
    `Refus du hook de fin de tour du ${depuisIso} au ${jusquIso} (${rapport.jours} jours, ${dossiers.length} dossiers de projet) : ${refus.length}`,
    `Rythme : ${parSemaine} par 7 jours, contre ${a.reference} de référence (écart ${rapport.ecart_a_la_reference})`,
    `Par forme : ${Object.entries(rapport.par_forme).map(([k, v]) => `${k} ${v}`).join(", ") || "aucun"}`,
    `Par jour (UTC) : ${Object.entries(rapport.par_jour).map(([k, v]) => `${k} ${v}`).join(", ") || "aucun"}`,
    `Dans des sous-agents : ${rapport.sous_agents}`,
  ];
  return { code: 0, sortie: lignes.join("\n") };
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const r = executer(process.argv.slice(2));
  (r.code === 0 ? console.log : console.error)(r.sortie);
  process.exit(r.code);
}
