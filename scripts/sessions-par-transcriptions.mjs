#!/usr/bin/env node
/**
 * sessions-par-transcriptions.mjs — LE REPLI DE `ListAgents` : COMPTER LES SESSIONS VIVANTES PAR LEURS TRANSCRIPTIONS (TF-2735, 22/11/2026).
 *
 * LE FAIT, le 14/11/2026. `ListAgents` est absent d'une session `claude -p` (« No matching deferred tools found »), alors que le même outil répondait à 16:27 dans la session de
 * l'éditeur : le diagnostic 20261114b a compté les sessions par inférence sur les transcriptions, et un critère d'acceptation qui exigeait le compte de `ListAgents` est devenu
 * injugeable. Tout prompt, hameçon ou critère qui s'appuie sur `ListAgents` prévoit donc ce repli, et DIT que le compte est une inférence.
 *
 * LA RÈGLE DU REPLI (la même fenêtre que `oracles\hook-flotte.mjs` et le suivi des agents) : une session est VIVANTE quand sa transcription, ou celle d'un de ses sous-agents,
 * a été écrite depuis moins de 15 minutes. Le compte lit les `<session>.jsonl` sous `projects\<projet>\` de chaque profil `~\.claude*` du poste (et de `CLAUDE_CONFIG_DIR`).
 * CE QUE LE REPLI NE DIT PAS, et la sortie le répète : une session ouverte et silencieuse depuis plus de 15 minutes n'est pas comptée ; une session d'un autre poste n'est pas vue ;
 * un compte par transcription n'est pas le compte d'`ListAgents` (qui voit les sessions branchées), c'est une inférence.
 *
 * Usage : node scripts\sessions-par-transcriptions.mjs [--projet <dossier de travail>] [--fenetre-min <n>] [--json]
 *   sans --projet : tous les projets du poste ; avec : seulement le projet dont le dossier de travail est celui-là (nom de dossier de projet dérivé du chemin).
 * Exit : 0 compte rendu (zéro compris) · 2 usage.
 */
import { readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dossiersParDefaut } from "./relever-contexte-sessions.mjs";
import { vieDeTranscription } from "../oracles/lib-sessions.mjs";

export const FENETRE_VIVANTE_MIN = 15;
const slug = (chemin) => String(chemin).replace(/[^A-Za-z0-9]/g, "-").toLowerCase();

/** Les sessions des dossiers de projet donnés, avec leur vie : [{ session, court, projet, vie_min, vivante }]. Pur à l'horloge et au disque près. */
export function sessionsDesDossiers(dossiers, { maintenant = Date.now(), fenetreMin = FENETRE_VIVANTE_MIN, vieDe = vieDeTranscription } = {}) {
  const sortie = [];
  for (const d of dossiers) {
    let entrees = []; try { entrees = readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const e of entrees) {
      if (!e.isFile() || !/^[\w-]+\.jsonl$/.test(e.name)) continue;
      const fichier = join(d, e.name);
      const vie = vieDe(fichier);
      if (!vie) continue;
      const age = (maintenant - vie) / 60000;
      sortie.push({ session: e.name.replace(/\.jsonl$/, ""), court: e.name.slice(0, 8), projet: basename(d), vie_min: Math.round(age * 10) / 10, vivante: age < fenetreMin });
    }
  }
  return sortie.sort((a, b) => a.vie_min - b.vie_min);
}

export function principal(a, env = process.env, sortie = (t) => process.stdout.write(t + "\n"), erreur = (t) => process.stderr.write(t + "\n")) {
  const inconnues = a.filter((x) => x.startsWith("--") && !["--projet", "--fenetre-min", "--json"].includes(x));
  if (inconnues.length) { erreur(`option inconnue : ${inconnues[0]} — usage : node scripts\\sessions-par-transcriptions.mjs [--projet <dossier>] [--fenetre-min <n>] [--json]`); return 2; }
  const val = (nom) => { const i = a.indexOf(nom); return i >= 0 ? a[i + 1] : undefined; };
  if ((a.includes("--projet") && !val("--projet")) || (a.includes("--fenetre-min") && !/^\d+$/.test(val("--fenetre-min") || ""))) { erreur("--projet attend un dossier, --fenetre-min un entier de minutes"); return 2; }
  const fenetreMin = a.includes("--fenetre-min") ? Number(val("--fenetre-min")) : FENETRE_VIVANTE_MIN;
  let dossiers = dossiersParDefaut(env);
  if (a.includes("--projet")) { const s = slug(resolve(val("--projet"))); dossiers = dossiers.filter((d) => basename(d).toLowerCase() === s); }
  const toutes = sessionsDesDossiers(dossiers, { fenetreMin });
  const vivantes = toutes.filter((s) => s.vivante);
  const borne = `inférence sur ${dossiers.length} dossier(s) de projet du poste, fenêtre de ${fenetreMin} min ; ce n'est pas le compte de ListAgents (absent d'une session claude -p, TF-2735) : une session silencieuse depuis plus de ${fenetreMin} min et une session d'un autre poste ne sont pas comptées`;
  if (a.includes("--json")) sortie(JSON.stringify({ vivantes: vivantes.length, sessions_lues: toutes.length, fenetre_min: fenetreMin, projets_lus: dossiers.length, methode: "inférence sur les transcriptions", borne, sessions: vivantes }, null, 1));
  else {
    sortie(`${vivantes.length} session(s) vivante(s) sur ${toutes.length} lue(s) — ${borne}`);
    for (const s of vivantes) sortie(`  ${s.court} · dernière écriture il y a ${s.vie_min} min · projet ${s.projet}`);
  }
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase()) process.exit(principal(process.argv.slice(2)));
