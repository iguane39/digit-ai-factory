#!/usr/bin/env node
/**
 * noter-fiche.mjs — LE VERDICT D'UN AGENT S'INSCRIT SUR SA FICHE D'EXÉCUTION, ET LA FICHE N'EST JAMAIS RÉÉCRITE
 * (décision humaine D-219 (e) du 15/11/2026, TF-2563, mandat 20261115b, lot L2 ; étude `output/03-etudes/Digit-AI - Étude -
 * Amelioration continue des agents par leurs lecons - 20261114d.md`, section Q1).
 *
 * LE FAIT (mandat 20261115b, « Ce que le mandat corrige dans l'étude ») : aucun écrivain ne lie un agent au verdict de son livrable.
 * La fiche que le hook de fin d'agent écrit (`oracles/lib-fiches-agents.mjs`, lot L1) porte `verdict_livrable` et `verdict_relecture`
 * à null : le verdict vient après la fin de l'agent, à la réception de son livrable, et le fichier des fiches est en ajout seul.
 *
 * CE QU'IL FAIT. Il ajoute au fichier des fiches du projet UNE ligne d'événement, `schema: pilot/fiches-agents-verdict@1`, liée à la
 * fiche par `agent_id` : `ts`, `agent_id`, `verdict_livrable` (PASS ou FAIL) et `verdict_relecture` (sert ou derive), null pour celui
 * qui n'est pas noté, et la signature de la session qui note (`session`, `session_source`, `lib-session.mjs`). Rien d'autre : ni nom,
 * ni chemin, ni contenu. LA LECTURE (`lireFiches`, la seule, que `relever-flotte.mjs` emploie aussi) : la dernière fiche d'un
 * `agent_id` fait foi (règle du lot L1) ; pour chaque verdict, le dernier événement qui le porte l'emporte, dans l'ordre du fichier
 * (une relecture « derive » corrigée puis relue « sert » finit « sert »). Un verdict déjà noté à la même valeur n'est pas réécrit.
 *
 * LE FICHIER est celui du projet, par `cheminFiches()` du lot L1 : `FORGE_FICHES_AGENTS` s'il est posé (bancs, essais), sinon
 * `todo/observabilite/fiches-agents.jsonl` au pilot, `forge/fiches-agents.jsonl` chez un produit ; le projet est `CLAUDE_PROJECT_DIR`,
 * sinon le dépôt du répertoire courant (`lib-racine-projet.mjs`). Les messages ne citent jamais le chemin d'un produit.
 *
 * Usage : node scripts\noter-fiche.mjs --agent <id> [--verdict-livrable PASS|FAIL] [--verdict-relecture sert|derive] [--json]
 *   (un verdict au moins). Appelé par `scripts/relecture-intention.mjs --consigner <verdict.json> --point reception --agent <id>`.
 * Exit : 0 verdict noté, ou déjà noté à la même valeur (rien n'est écrit) · 1 aucune fiche de cet agent, aucun fichier de fiches ou
 *        écriture impossible : rien n'est écrit · 2 usage invalide.
 * NON JUGÉ (déclaré) : la justesse du verdict ; un agent repris après son verdict (le verdict reste lié à son identifiant, pas à une
 * course) ; deux sessions qui notent le même verdict au même instant (deux lignes identiques, sans effet sur la lecture) ; une fiche
 * sans identifiant d'agent, qui ne peut pas recevoir de verdict.
 * Recette : `scripts/noter-fiche.test.mjs`.
 */
import { appendFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SCHEMA, FICHIER_PILOT, FICHIER_PRODUIT, VARIABLE_DESTINATION, cheminFiches } from "../oracles/lib-fiches-agents.mjs";
import { racineDuProjet } from "../oracles/lib-racine-projet.mjs";
import { signature } from "../oracles/lib-session.mjs";

export const SCHEMA_VERDICT = "pilot/fiches-agents-verdict@1";
export const VERDICTS_LIVRABLE = Object.freeze(["PASS", "FAIL"]);
export const VERDICTS_RELECTURE = Object.freeze(["sert", "derive"]);
export const ID_AGENT = /^[\w-]{1,64}$/;

/**
 * Le contenu d'un fichier de fiches : { fiches (Map agent_id → dernière fiche), sansIdentifiant (fiches sans agent_id), verdicts
 * (Map agent_id → { verdict_livrable, verdict_relecture, ts }), illisibles, autres (lignes d'un autre schéma) }. Pure.
 */
export function lireFiches(texte) {
  const fiches = new Map(), verdicts = new Map(), sansIdentifiant = [];
  let illisibles = 0, autres = 0;
  for (const brute of String(texte ?? "").split("\n")) {
    const l = brute.trim();
    if (!l) continue;
    let o = null;
    try { o = JSON.parse(l); } catch { illisibles++; continue; }
    if (!o || typeof o !== "object" || Array.isArray(o)) { illisibles++; continue; }
    const id = typeof o.agent_id === "string" && ID_AGENT.test(o.agent_id) ? o.agent_id : null;
    if (o.schema === SCHEMA) { if (id) fiches.set(id, o); else sansIdentifiant.push(o); }
    else if (o.schema === SCHEMA_VERDICT && id) {
      const v = verdicts.get(id) || { verdict_livrable: null, verdict_relecture: null, ts: null };
      if (VERDICTS_LIVRABLE.includes(o.verdict_livrable)) v.verdict_livrable = o.verdict_livrable;
      if (VERDICTS_RELECTURE.includes(o.verdict_relecture)) v.verdict_relecture = o.verdict_relecture;
      if (typeof o.ts === "string") v.ts = o.ts;
      verdicts.set(id, v);
    } else autres++;
  }
  return { fiches, sansIdentifiant, verdicts, illisibles, autres };
}

/** Le fichier des fiches, dit sans le chemin d'un produit. */
function lieuDe(chemin, env) {
  const n = String(chemin).replace(/\\/g, "/");
  const designe = typeof env?.[VARIABLE_DESTINATION] === "string" ? env[VARIABLE_DESTINATION].trim() : "";
  if (designe && resolve(designe) === resolve(chemin)) return `le fichier désigné par ${VARIABLE_DESTINATION}`;
  if (n.endsWith(FICHIER_PILOT)) return `${FICHIER_PILOT} du pilot`;
  if (n.endsWith(FICHIER_PRODUIT)) return `${FICHIER_PRODUIT} du projet`;
  return "le fichier des fiches";
}

/**
 * Note un verdict sur la fiche d'un agent : { code, ecrit, deja?, motif, ligne? } (codes de l'en-tête). Ne lève pas.
 * Options injectables pour les bancs : `env`, `cwd`, `maintenant`.
 */
export function noterFiche({ agent, verdictLivrable = null, verdictRelecture = null, env = process.env, cwd = process.cwd(), maintenant = new Date() } = {}) {
  const id = typeof agent === "string" ? agent.trim() : "";
  if (!ID_AGENT.test(id)) return { code: 2, ecrit: false, motif: `--agent attend l'identifiant d'un agent (lettres, chiffres, - et _, 64 au plus), reçu « ${String(agent ?? "").slice(0, 40)} »` };
  const vl = verdictLivrable === null || verdictLivrable === undefined ? null : String(verdictLivrable).trim().toUpperCase();
  const vr = verdictRelecture === null || verdictRelecture === undefined ? null : String(verdictRelecture).trim().toLowerCase().replace("dérive", "derive");
  if (vl === null && vr === null) return { code: 2, ecrit: false, motif: "un verdict au moins : --verdict-livrable PASS|FAIL ou --verdict-relecture sert|derive" };
  if (vl !== null && !VERDICTS_LIVRABLE.includes(vl)) return { code: 2, ecrit: false, motif: `--verdict-livrable attend PASS ou FAIL, reçu « ${String(verdictLivrable).slice(0, 20)} »` };
  if (vr !== null && !VERDICTS_RELECTURE.includes(vr)) return { code: 2, ecrit: false, motif: `--verdict-relecture attend sert ou derive, reçu « ${String(verdictRelecture).slice(0, 20)} »` };
  let chemin = null;
  try { chemin = cheminFiches(racineDuProjet(cwd, env), env); } catch { chemin = null; }
  if (!chemin) return { code: 1, ecrit: false, motif: `hors du pilot et de tout produit, sans ${VARIABLE_DESTINATION} : aucun fichier de fiches, rien n'est noté` };
  const ou = lieuDe(chemin, env);
  let texte;
  try { texte = readFileSync(chemin, "utf8"); } catch { return { code: 1, ecrit: false, motif: `aucun fichier de fiches (${ou}) : rien n'est noté` }; }
  const { fiches, verdicts } = lireFiches(texte);
  if (!fiches.has(id)) return { code: 1, ecrit: false, motif: `aucune fiche de l'agent ${id} dans ${ou} : rien n'est noté` };
  const avant = verdicts.get(id) || { verdict_livrable: null, verdict_relecture: null };
  const neuf = {
    verdict_livrable: vl !== null && vl !== avant.verdict_livrable ? vl : null,
    verdict_relecture: vr !== null && vr !== avant.verdict_relecture ? vr : null,
  };
  const demandes = [vl !== null ? `livrable ${vl}` : null, vr !== null ? `relecture ${vr}` : null].filter(Boolean).join(", ");
  if (neuf.verdict_livrable === null && neuf.verdict_relecture === null) {
    return { code: 0, ecrit: false, deja: true, motif: `déjà noté sur la fiche de l'agent ${id} (${demandes}) : rien n'est réécrit` };
  }
  const ligne = { schema: SCHEMA_VERDICT, ts: maintenant.toISOString(), agent_id: id, ...neuf, ...signature({ env }) };
  try {
    appendFileSync(chemin, (texte && !texte.endsWith("\n") ? "\n" : "") + JSON.stringify(ligne) + "\n", "utf8");
  } catch (e) { return { code: 1, ecrit: false, motif: `écriture impossible dans ${ou} (${e?.code || "erreur d'écriture"}) : rien n'est noté` }; }
  const remplaces = [
    neuf.verdict_livrable && avant.verdict_livrable ? `livrable ${avant.verdict_livrable}` : null,
    neuf.verdict_relecture && avant.verdict_relecture ? `relecture ${avant.verdict_relecture}` : null,
  ].filter(Boolean);
  const notes = [neuf.verdict_livrable ? `livrable ${neuf.verdict_livrable}` : null, neuf.verdict_relecture ? `relecture ${neuf.verdict_relecture}` : null].filter(Boolean).join(", ");
  return { code: 0, ecrit: true, ligne, motif: `verdict noté sur la fiche de l'agent ${id} (${notes}) dans ${ou}${remplaces.length ? `, après ${remplaces.join(", ")}` : ""}` };
}

export function executer(argv, env = process.env, maintenant = new Date(), cwd = process.cwd()) {
  const a = { agent: null, livrable: null, relecture: null, json: argv.includes("--json") };
  let erreur = null;
  for (let i = 0; i < argv.length && !erreur; i++) {
    const x = argv[i];
    const val = () => { const v = argv[++i]; if (v === undefined || v.startsWith("--")) throw new Error(`${x} attend une valeur`); return v; };
    try {
      if (x === "--agent") a.agent = val();
      else if (x === "--verdict-livrable") a.livrable = val();
      else if (x === "--verdict-relecture") a.relecture = val();
      else if (x !== "--json") erreur = `option inconnue : ${x}`;
    } catch (e) { erreur = e.message; }
  }
  const r = erreur ? { code: 2, ecrit: false, motif: erreur }
    : a.agent === null ? { code: 2, ecrit: false, motif: "--agent <id> est exigé" }
    : noterFiche({ agent: a.agent, verdictLivrable: a.livrable, verdictRelecture: a.relecture, env, cwd, maintenant });
  const sortie = a.json
    ? JSON.stringify({ outil: "noter-fiche", code: r.code, ecrit: r.ecrit, deja: Boolean(r.deja), motif: r.motif, ligne: r.ligne ?? null })
    : `noter-fiche : ${r.motif}`;
  return { ...r, json: a.json, sortie };
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const r = executer(process.argv.slice(2));
  (r.code === 0 || r.json ? console.log : console.error)(r.sortie);
  process.exit(r.code);
}
