#!/usr/bin/env node
/**
 * hook-taches-actives.mjs — LA FIN DE TOUR DIT LES TÂCHES D'ARRIÈRE-PLAN QUE LA SESSION A LANCÉES ET QUI TOURNENT ENCORE
 * (TF-2414, RU-17 de Produit-84, décision R-58 « A1 et A2 » du 10/11/2026 ; moitié du pilot, la moitié de forge-agents étant
 * `oracle-serveur-de-banc.mjs`, qui juge qu'un banc arrête son serveur dans la même commande).
 *
 * LE FAIT. Un `wrangler pages dev` lancé en arrière-plan le 09/11/2026 à 20:16 pour un banc a survécu au tour ; le 10/11, son esbuild avait
 * consommé 25 880 s de processeur, et la campagne de tests qui ne prenait que 2 minutes la veille n'avançait plus : 15 minutes de campagne
 * bloquée, deux oracles faussés. Rien ne disait, en fin de tour, qu'une commande lancée en arrière-plan tournait encore.
 *
 * CE QUE FAIT CE HOOK. Hook `Stop` du pilot. Il relit la transcription de la session et liste, en AVERTISSEMENT (`systemMessage`, exit 0), chaque
 * tâche d'arrière-plan lancée par la session et non revenue : une commande (`run_in_background` ou « Command running in background with ID: … ») ou
 * un agent asynchrone (« Async agent launched … agentId: … »). Une tâche est revenue quand une `<task-notification>` de même identifiant porte un
 * statut final (`completed`, `failed`, `killed`…), ou quand la session l'a arrêtée (`TaskStop`, `KillShell`). Pour chacune : sa nature, son
 * identifiant, son geste (la commande ou la description de l'agent), son âge. Il ne bloque jamais et n'arrête rien : arrêter une tâche est le geste de la
 * session, que le message nomme.
 * Mêmes lectures que `tachesEnAttente` de `hook-restitution.mjs` (TF-1649), appliquées à TOUTE la session et non au tour : un serveur lancé il y a trois
 * tours est une tâche encore active.
 *
 * NON JUGÉ (déclaré). L'état réel du processus : seul le journal de la session est lu, une tâche arrêtée hors de la session (kill du poste, fin
 * de commande sans notification que le harnais n'a pas écrite) reste listée ; un serveur lancé en avant-plan, ou par une commande qui s'en détache
 * (`start`, `nohup … &` dans une commande ordinaire), n'est pas une tâche du harnais et n'est pas vu ; les tâches d'une AUTRE session. Chez un
 * produit, le hook n'est pas posé : l'héritage ne le porte pas.
 *
 * Usage : node oracles\hook-taches-actives.mjs      (stdin : JSON du hook Stop : `transcript_path`, `session_id`)
 * Exit : toujours 0 ; l'avertissement sort sur stdout en JSON `systemMessage`.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const ARRETS = new Set(["TaskStop", "KillShell", "KillBash"]);
const ID_ARRET = ["task_id", "shell_id", "bash_id", "id"];
const MOTS_CLES = ["running in background", "Async agent launched", "task-notification", "TaskStop", "KillShell", "KillBash"];
const LIMITE_LISTE = 6;

const contenuDe = (e) => (Array.isArray(e?.message?.content) ? e.message.content : []);
const texteDe = (b) => (typeof b?.content === "string" ? b.content
  : Array.isArray(b?.content) ? b.content.map((c) => (typeof c === "string" ? c : c?.text || "")).join("\n") : "");
const premiereLigne = (s, max) => { const l = String(s ?? "").split(/\r?\n/).find((x) => x.trim()) || ""; return l.trim().length > max ? `${l.trim().slice(0, max - 1)}…` : l.trim(); };

/**
 * Les tâches d'arrière-plan lancées dans la transcription (texte JSONL) et non revenues :
 * [{ id, genre: "commande" | "agent", geste, depuis_min }]. `maintenant` (ms) sert à mesurer l'âge.
 */
export function tachesActives(transcript, maintenant = Date.now()) {
  const lignes = String(transcript).split(/\r?\n/);
  const lancees = new Map();            // identifiant de tâche -> { genre, utilisation (tool_use_id), ts }
  const finies = new Set();
  for (const ligne of lignes) {
    if (!ligne.trim() || !MOTS_CLES.some((m) => ligne.includes(m))) continue;
    let e = null;
    try { e = JSON.parse(ligne); } catch { continue; }
    const ts = Date.parse(e?.timestamp);
    for (const b of contenuDe(e)) {
      if (b.type === "tool_use" && ARRETS.has(b.name)) {
        for (const k of ID_ARRET) if (typeof b.input?.[k] === "string") finies.add(b.input[k]);
      }
      if (b.type !== "tool_result") continue;
      const t = texteDe(b);
      for (const m of t.matchAll(/running in background with ID:\s*([\w-]+)/g)) lancees.set(m[1], { genre: "commande", utilisation: b.tool_use_id, ts });
      for (const m of t.matchAll(/Async agent launched[\s\S]{0,400}?agentId:\s*([\w-]+)/g)) lancees.set(m[1], { genre: "agent", utilisation: b.tool_use_id, ts });
    }
    if (ligne.includes("task-notification")) {
      for (const m of ligne.matchAll(/<task-id>([\w-]+)<\/task-id>[\s\S]{0,600}?<status>(\w+)<\/status>/g))
        if (!/^(?:running|pending|started)$/i.test(m[2])) finies.add(m[1]);
    }
  }
  const actives = [...lancees].filter(([id]) => !finies.has(id));
  if (!actives.length) return [];
  // Le geste de chaque tâche active : l'appel d'outil qui l'a lancée (une seconde lecture, bornée aux lignes qui portent son identifiant).
  const gestes = new Map();
  const voulus = new Set(actives.map(([, l]) => l.utilisation).filter(Boolean));
  for (const ligne of lignes) {
    if (!ligne.includes("tool_use") || ![...voulus].some((id) => ligne.includes(id))) continue;
    let e = null;
    try { e = JSON.parse(ligne); } catch { continue; }
    for (const b of contenuDe(e)) if (b.type === "tool_use" && voulus.has(b.id)) gestes.set(b.id, { texte: b.input?.command ?? b.input?.description ?? b.input?.prompt ?? "", ts: Date.parse(e?.timestamp) });
  }
  return actives.map(([id, l]) => {
    const g = gestes.get(l.utilisation) || {};
    const lance = Number.isFinite(l.ts) ? l.ts : g.ts;   // le résultat du lancement n'est pas toujours daté : l'appel l'est
    return { id, genre: l.genre, geste: premiereLigne(g.texte, 90), depuis_min: Number.isFinite(lance) ? Math.max(0, Math.round((maintenant - lance) / 60000)) : null };
  });
}

/** Le message d'avertissement pour une liste de tâches actives (chaîne vide : rien à dire). */
export function messageTaches(actives) {
  if (!actives.length) return "";
  const liste = actives.slice(0, LIMITE_LISTE).map((t) => `${t.genre} ${t.id}${t.geste ? ` « ${t.geste} »` : ""}${t.depuis_min === null ? "" : `, lancée il y a ${t.depuis_min} min`}`).join(" ; ")
    + (actives.length > LIMITE_LISTE ? ` ; +${actives.length - LIMITE_LISTE} autre(s)` : "");
  return `[tâches d'arrière-plan — TF-2414] ${actives.length} tâche(s) lancée(s) par cette session ne sont pas revenues : ${liste}. `
    + "Un serveur lancé pour un banc survit au tour : le 10/11/2026, un `wrangler pages dev` laissé actif depuis la veille avait consommé 25 880 s de processeur dans son esbuild et "
    + "bloqué une campagne de tests (RU-17). Arrête ce qui ne sert plus (outil TaskStop, avec l'identifiant ci-dessus) ou dis pourquoi cela reste actif. "
    + "Avertissement seulement : le tour se clôt, rien n'est arrêté ici.";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let entree = {};
  try { entree = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch { /* entrée illisible : rien à dire */ }
  try {
    const chemin = entree.transcript_path;
    if (chemin && existsSync(chemin)) {
      const actives = tachesActives(readFileSync(chemin, "utf8"));
      const journal = process.env.FORGE_HOOKS_JOURNAL || join(ICI, "..", ".claude", "hooks-journal.jsonl");
      if (actives.length) {
        // Le journal ne garde que les fins de tour où quelque chose a été dit : la mesure de la période d'avertissement.
        try {
          mkdirSync(dirname(journal), { recursive: true });
          appendFileSync(journal, JSON.stringify({ ts: new Date().toISOString(), hook: "taches-actives", session: entree.session_id || null, actives: actives.length, commandes: actives.filter((t) => t.genre === "commande").length }) + "\n");
        } catch { /* journal facultatif */ }
        process.stdout.write(JSON.stringify({ systemMessage: messageTaches(actives) }) + "\n");
      }
    }
  } catch { /* une panne du hook ne retient jamais la fin d'un tour */ }
  process.exit(0);
}
