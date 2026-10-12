#!/usr/bin/env node
/**
 * restitutions.mjs — LE BANC DES RESTITUTIONS REFUSÉES, AUTO-ÉTIQUETÉ PAR LE HOOK DE FIN DE TOUR (TF-1551, étape 1
 * de l'étude `output\03-etudes\20261001-etude-opportunite-rsi-et-ssl.md`, gisement « transcripts du pilot »).
 *
 * L'ÉTIQUETTE EST GRATUITE. Quand le hook de restitution refuse une réponse finale, la transcription de la session
 * garde le texte refusé ET le motif du refus, règle par règle (« S1 — bloc(s) absent(s) … »). Personne n'annote : le
 * juge de l'époque a étiqueté. Le journal des hooks (`.claude\hooks-journal.jsonl`) ne garde que le verdict et les
 * identifiants de règle, jamais le texte — c'est la transcription qui complète ses paires.
 *
 * DEUX VERBES.
 *   --extraire  lit les transcriptions (`*.jsonl`) et écrit, HORS DU DÉPÔT, un corpus : un enregistrement par refus
 *               (texte refusé, règles bloquantes nommées, règles signalées au passage, version du gabarit citée) et,
 *               quand la chaîne de refus s'est close par un texte rendu, ce texte ACCEPTÉ. Un texte de restitution
 *               peut porter un nom de client : le corpus vit dans le canal confidentiel
 *               (`<racine>\_confidentiel\bancs\restitutions\`), jamais sous git.
 *   --rejouer   rejoue chaque texte refusé devant le juge d'AUJOURD'HUI (`oracle-synthese`, par `juger` du hook) et
 *               publie des TAUX, sans aucun texte : part des refus qui restent refusés sur les règles que l'époque
 *               nommait, part qui ne le sont plus, part des textes acceptés qui le restent.
 *
 * CE QUE LE BANC DIT, ET CE QU'IL NE DIT PAS. Un refus d'hier devenu un PASS aujourd'hui est soit une règle
 * assouplie ou retirée depuis (légitime si l'humain l'a décidé), soit une détection perdue (un défaut de juge) : le
 * banc LISTE les règles concernées, il ne tranche pas. Les refus dont le motif dépend du contexte du tour (AFFICHAGE,
 * GESTE, PROCÉDURE, NIVEAU : ils comparent le message à une synthèse déposée ou à la demande humaine) ne sont pas
 * rejouables sur le seul texte et sont comptés à part. Rien n'est proposé, rien n'est modifié : lecture seule.
 *
 * Usage : node restitutions.mjs --extraire <dossier de transcriptions>... [--sortie <dossier>]
 *         node restitutions.mjs --rejouer [--corpus <dossier>] [--json]
 * Exit  : 0 = banc joué · 1 = aucune paire exploitable · 2 = usage.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const VERSION = "1.0.0";
const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(join(ICI, "..", ".."));

/** Les règles qui bloquent, telles que le hook les déclare (`BLOQUANTES` de hook-restitution.mjs). */
export const REGLES_BLOQUANTES = new Set(["S1", "S3", "S4", "S6"]);
const CONTEXTUELLES = new Set(["AFFICHAGE", "GESTE", "PROCÉDURE", "NIVEAU", "MOYEN"]);

const texteDe = (message) => {
  const c = message && message.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c)) return c.filter((b) => b && b.type === "text" && typeof b.text === "string").map((b) => b.text).join("\n");
  return "";
};
const estResultatOutil = (message) => Array.isArray(message && message.content) && message.content.some((b) => b && b.type === "tool_result");

/** Le motif d'un refus, lu dans le message du hook : règles bloquantes nommées, règles signalées, version du gabarit. */
export function lireMotif(raison) {
  const t = String(raison || "");
  const tete = t.split(/\n\s*\n/)[0];
  const bloquantes = [];
  for (const l of tete.split("\n")) {
    const m = /^([A-ZÉÈ][A-Za-zÉÈ]*\d*)\s+—\s/.exec(l.trim());
    if (m && !/^(oracle|hook)/i.test(m[1])) bloquantes.push(m[1]);
  }
  const signalees = ((/non bloquant\s*:\s*([^)\n]+)\)/i.exec(t) || [, ""])[1]).split(/[,\s]+/).filter((x) => /^S\d+$/.test(x));
  const version = (/RESTITUTION\.md \(v(\d+\.\d+\.\d+)\)/.exec(t) || [, null])[1];
  return { bloquantes: [...new Set(bloquantes)], signalees, version };
}

/**
 * Extrait les refus d'UNE transcription (texte JSONL). Pur. Un refus = le dernier texte de l'assistant avant un message
 * « Stop hook feedback » du hook de restitution (la pièce jointe `hook_blocking_error` qui le double est ignorée).
 * `accepte` = le dernier texte rendu après le dernier refus de la chaîne, tant qu'aucun autre refus ni message humain
 * ne l'a suivi.
 */
export function extraire(jsonl, session = "session") {
  const refus = [];
  let dernier = null;       // { texte, consomme }
  let chaine = null;        // le dernier refus, en attente de son texte accepté
  let suivant = null;       // texte rendu depuis le dernier refus
  const clore = () => { if (chaine && suivant) chaine.accepte = suivant; chaine = null; suivant = null; };
  const lignes = String(jsonl).split("\n");
  for (let i = 0; i < lignes.length; i++) {
    if (!lignes[i].trim()) continue;
    let o; try { o = JSON.parse(lignes[i]); } catch { continue; }
    const message = o.message;
    if (o.type === "assistant" && message) {
      const t = texteDe(message).trim();
      if (t) { dernier = { texte: t, consomme: false }; if (chaine) suivant = t; }
      continue;
    }
    let raison = null;
    if (o.type === "user" && message && typeof message.content === "string" && message.content.startsWith("Stop hook feedback:")) raison = message.content.replace(/^Stop hook feedback:\s*/, "");
    else if (o.type === "attachment" && o.attachment && o.attachment.type === "hook_blocking_error" && o.attachment.blockingError) raison = String(o.attachment.blockingError.blockingError || "");
    if (raison !== null) {
      if (!/\[hook restitution/.test(raison) || !dernier || dernier.consomme) continue;
      dernier.consomme = true;
      const motif = lireMotif(raison);
      const r = { id: `${session}#${i + 1}`, session, ligne: i + 1, refuse: dernier.texte, regles_bloquantes: motif.bloquantes, regles_signalees: motif.signalees, version_gabarit: motif.version, accepte: null };
      refus.push(r);
      if (chaine && !suivant) { /* refus sans texte rendu entre les deux : même chaîne */ }
      chaine = r; suivant = null;
      continue;
    }
    if (o.type === "user" && message && !estResultatOutil(message) && texteDe(message).trim()) clore(); // un message humain ferme la chaîne
  }
  clore();
  return refus;
}

/** Les dossiers de transcriptions par défaut : `projects\<pilot>` sous chaque profil Claude Code du poste. */
export function dossiersParDefaut(env = process.env, home = process.env.USERPROFILE || process.env.HOME || "") {
  const racines = new Set([env.CLAUDE_CONFIG_DIR, join(home, ".claude"), join(home, ".claude-b")].filter(Boolean));
  const slug = resolve(PILOT).replace(/[^A-Za-z0-9]/g, "-").replace(/^-+/, "");
  const trouves = [];
  for (const r of racines) {
    const p = join(r, "projects");
    if (!existsSync(p)) continue;
    for (const d of readdirSync(p)) if (d.toLowerCase() === slug.toLowerCase() || d.toLowerCase() === "c--dev-digit-ai-factory") trouves.push(join(p, d));
  }
  return [...new Set(trouves)];
}

export function extraireDossiers(dossiers) {
  const tous = [];
  for (const d of dossiers) {
    if (!existsSync(d)) continue;
    const fichiers = statSync(d).isDirectory() ? readdirSync(d).filter((f) => f.endsWith(".jsonl")).map((f) => join(d, f)) : [d];
    for (const f of fichiers) tous.push(...extraire(readFileSync(f, "utf8"), basename(f, ".jsonl").slice(0, 8)));
  }
  return tous;
}

/** Rejoue le corpus devant `juge(texte) → { fails: [{regle}] }` ; ne publie que des comptes, jamais un texte. */
export function rejouer(corpus, juge) {
  const par = {};
  const bump = (r, k) => { (par[r] ||= { refus: 0, toujours_refuses: 0, ne_le_sont_plus: 0 })[k]++; };
  const res = { version: VERSION, refus: corpus.length, rejouables: 0, non_rejouables_contexte: 0, sans_regle_nommee: 0,
    toujours_refuses: 0, ne_le_sont_plus: 0, partiels: 0, acceptes: 0, acceptes_toujours: 0, acceptes_refuses_aujourdhui: 0,
    par_regle: par, versions_gabarit: {}, ne_le_sont_plus_ids: [], acceptes_refuses_ids: [] };
  for (const r of corpus) {
    if (r.version_gabarit) res.versions_gabarit[r.version_gabarit] = (res.versions_gabarit[r.version_gabarit] || 0) + 1;
    const nommees = (r.regles_bloquantes || []).filter((x) => /^S\d+$/.test(x));
    if (!nommees.length) { (r.regles_bloquantes || []).some((x) => CONTEXTUELLES.has(x)) ? res.non_rejouables_contexte++ : res.sans_regle_nommee++; }
    else {
      res.rejouables++;
      const aujourdhui = new Set(juge(r.refuse).fails.map((f) => f.regle));
      const encore = nommees.filter((x) => aujourdhui.has(x));
      for (const x of nommees) { bump(x, "refus"); bump(x, aujourdhui.has(x) ? "toujours_refuses" : "ne_le_sont_plus"); }
      if (encore.length === nommees.length) res.toujours_refuses++;
      else if (encore.length === 0) { res.ne_le_sont_plus++; res.ne_le_sont_plus_ids.push(r.id); }
      else res.partiels++;
    }
    if (r.accepte) {
      res.acceptes++;
      const bloquantes = juge(r.accepte).fails.map((f) => f.regle).filter((x) => REGLES_BLOQUANTES.has(x));
      if (bloquantes.length) { res.acceptes_refuses_aujourdhui++; res.acceptes_refuses_ids.push(`${r.id} (${bloquantes.join(",")})`); }
      else res.acceptes_toujours++;
    }
  }
  res.taux_toujours_refuses = res.rejouables ? res.toujours_refuses / res.rejouables : null;
  res.taux_acceptes_toujours = res.acceptes ? res.acceptes_toujours / res.acceptes : null;
  return res;
}

export const cheminCorpusParDefaut = (env = process.env) =>
  join(env.FORGE_CONFIDENTIEL || join(env.FORGE_ROOT || join(PILOT, ".."), "_confidentiel"), "bancs", "restitutions");

const lanceEnDirect = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const val = (o) => { const i = args.indexOf(o); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : null; };
  const pct = (x) => (x === null ? "—" : `${Math.round(x * 100)} %`);
  if (args.includes("--extraire")) {
    const i = args.indexOf("--extraire");
    const donnes = args.slice(i + 1).filter((a) => !a.startsWith("--") && a !== val("--sortie"));
    const dossiers = donnes.length ? donnes : dossiersParDefaut();
    const corpus = extraireDossiers(dossiers);
    const sortie = val("--sortie") || cheminCorpusParDefaut();
    mkdirSync(sortie, { recursive: true });
    writeFileSync(join(sortie, "corpus.jsonl"), corpus.map((r) => JSON.stringify(r)).join("\n") + (corpus.length ? "\n" : ""), "utf8");
    console.log(`banc des restitutions ${VERSION} : ${corpus.length} refus extraits (${corpus.filter((r) => r.accepte).length} avec leur texte accepté) de ${dossiers.length} dossier(s) → ${join(sortie, "corpus.jsonl")}`);
    process.exit(corpus.length ? 0 : 1);
  }
  if (args.includes("--rejouer")) {
    const dossier = val("--corpus") || cheminCorpusParDefaut();
    const f = join(dossier, "corpus.jsonl");
    if (!existsSync(f)) { console.error(`corpus introuvable : ${f} — jouer d'abord --extraire`); process.exit(2); }
    const corpus = readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
    const { juger } = await import(pathToFileURL(join(PILOT, "oracles", "hook-restitution.mjs")).href);
    const res = rejouer(corpus, juger);
    if (args.includes("--json")) console.log(JSON.stringify(res, null, 1));
    else {
      console.log(`banc des restitutions ${VERSION} — ${res.refus} refus, dont ${res.rejouables} rejouables sur le seul texte (${res.non_rejouables_contexte} dépendent du contexte du tour, ${res.sans_regle_nommee} sans règle nommée)`);
      console.log(`  toujours refusés aujourd'hui sur toutes leurs règles : ${res.toujours_refuses}/${res.rejouables} (${pct(res.taux_toujours_refuses)}) · partiellement : ${res.partiels} · plus refusés : ${res.ne_le_sont_plus}`);
      console.log(`  textes rendus après refus : ${res.acceptes}, toujours acceptés : ${res.acceptes_toujours} (${pct(res.taux_acceptes_toujours)}), refusés aujourd'hui : ${res.acceptes_refuses_aujourdhui}`);
      for (const [r, v] of Object.entries(res.par_regle).sort((a, b) => b[1].refus - a[1].refus)) console.log(`  ${r} : ${v.refus} refus, ${v.toujours_refuses} encore refusés, ${v.ne_le_sont_plus} ne le sont plus`);
    }
    process.exit(res.rejouables || res.acceptes ? 0 : 1);
  }
  console.error("usage : node restitutions.mjs --extraire <dossier de transcriptions>... [--sortie <dossier>] | --rejouer [--corpus <dossier>] [--json]");
  process.exit(2);
}
