#!/usr/bin/env node
/**
 * releve-workflows-heberges.mjs — UN WORKFLOW HÉBERGÉ QUI ÉCHOUE SE DIT À L'OUVERTURE DU PILOT (TF-2442, RP-26, 12/11/2026).
 *
 * LE FAIT. Du 03 au 12/11/2026, le workflow de programmation des publications d'un produit a échoué sur 5 exécutions
 * de suite : 3 publications du client ne sont pas parties, 4 autres étaient bloquées, et personne ne l'a su pendant 9 jours
 * ; le défaut a été vu par hasard à l'affichage d'un calendrier. Ni le poste ni la session ne regardaient les automatisations
 * hébergées d'un produit : elles tournent chez l'hébergeur, hors de tout ce que le relevé d'ouverture lisait.
 *
 * LA RÈGLE (décision du pilot sous R-58, 12/11/2026). Le relevé d'ouverture du pilot lit, EN LECTURE SEULE et EN ARRIÈRE-PLAN, les
 * dernières exécutions des workflows hébergés des produits du parc, et signale tout workflow en échec 2 fois de suite ou plus. Le hook
 * d'ouverture est synchrone et sa coupure est à 60 s (TF-1635) : il ne lit ici qu'un fichier de trace local et, quand elle est périmée,
 * lance ce script DÉTACHÉ (même modèle que le rejeu hebdomadaire, D-135 (a)). Le résultat se lit à l'ouverture suivante, avec sa date.
 *
 * CE QUE LE RELEVÉ LIT. Pour chaque produit du parc qui porte `.github/workflows/*.yml` ET un remote `origin` GitHub : `gh run list`
 * (lecture), sur la branche par défaut quand le dépôt local la connaît (un échec de CI sur une branche de travail n'est pas une
 * automatisation en panne). Rien n'est écrit chez le produit, rien n'est relancé, aucun secret n'est lu.
 *
 * LA SÉRIE. Par workflow, les exécutions terminées de la plus récente à la plus ancienne : `failure`, `timed_out` et `startup_failure`
 * comptent, `success` arrête la série, une exécution en cours, annulée ou sautée est ignorée (elle ne dit rien du code).
 *
 * NON JUGÉ (déclaré). Qu'un workflow SANS exécution récente soit mort (planifié mais jamais déclenché) : le relevé ne voit que les
 * échecs enregistrés. Un produit sans `gh` authentifié sur ce poste : dit comme « NON relevé », jamais comme « sain ». Un dépôt
 * dont l'origine n'est pas GitHub : hors relevé. La cause de l'échec : le relevé donne l'adresse de l'exécution, il ne lit pas ses journaux.
 *
 * Usage : node oracles/releve-workflows-heberges.mjs --executer [--trace <fichier>] [--racine <dossier du parc>]
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, renameSync, rmSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
export const SEUIL_ECHECS = 2;
export const REFRAICHIR_MIN = 60;           // minutes : une trace plus récente que ça n'est pas relevée de nouveau
export const PERIME_H = 48;                  // heures : au-delà, l'ouverture dit que la trace est ancienne
const MARGE_VERROU_MS = 15 * 60000;          // un relevé qui dure plus que ça est tenu pour coupé, même si son pid répond
const DELAI_GH_MS = Number(process.env.FORGE_DELAI_GH_MS) || 30000;   // la recette l'allonge : son faux gh attend qu'on le libère, après plusieurs ouvertures
const FORMAT = "pilot/workflows-heberges@1";
const ECHEC = new Set(["failure", "timed_out", "startup_failure"]);

export function cheminTrace(pilot) {
  if (process.env.FORGE_TRACE_WORKFLOWS) return process.env.FORGE_TRACE_WORKFLOWS;
  // Métadonnées LOCALES de git : rien de suivi, rien de publié (même place que la trace des gestes d'avant relevé).
  const r = spawnSync("git", ["rev-parse", "--git-common-dir"], { encoding: "utf8", cwd: pilot });
  const d = (r.stdout || "").trim();
  return join(d ? (d.startsWith("/") || /^[A-Za-z]:/.test(d) ? d : join(pilot, d)) : join(pilot, ".claude"), "digit-ai-workflows-heberges.json");
}
const cheminVerrou = (trace) => `${trace}.verrou`;
const lireJson = (c) => { try { return JSON.parse(readFileSync(c, "utf8")); } catch { return null; } };
export const lireTrace = (trace) => lireJson(trace);
function ecrireAtomique(chemin, objet) {
  mkdirSync(dirname(chemin), { recursive: true });
  const tmp = `${chemin}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(objet, null, 1) + "\n", "utf8");
  renameSync(tmp, chemin);
}
export function pidVivant(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; }
}

/** `gh` réel, ou le script que `FORGE_GH_SCRIPT` désigne (recette seulement : un faux `gh`, jamais le réseau). */
export function lanceurGh(args, { cwd } = {}) {
  const faux = process.env.FORGE_GH_SCRIPT;
  return faux ? spawnSync(process.execPath, [faux, ...args], { encoding: "utf8", timeout: DELAI_GH_MS, cwd })
    : spawnSync("gh", args, { encoding: "utf8", timeout: DELAI_GH_MS, cwd });
}
const lanceurGit = (args, cwd) => spawnSync("git", args, { encoding: "utf8", cwd, timeout: 10000 });

/** « propriétaire/dépôt » d'une adresse GitHub (https ou ssh), ou null pour tout autre hébergeur. */
export function slugGithub(url) {
  const m = /github\.com[:/]+([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?\s*$/i.exec(String(url || "").trim());
  return m ? `${m[1]}/${m[2]}` : null;
}

export function aDesWorkflows(dossier) {
  try { return readdirSync(join(dossier, ".github", "workflows")).some((f) => /\.ya?ml$/i.test(f)); } catch { return false; }
}

/**
 * Les workflows en échec `seuil` fois de suite ou plus, d'après une liste d'exécutions (`gh run list --json`).
 * Rend { workflows_vus, en_echec: [{ workflow, consecutifs, depuis, dernier, url }] }.
 */
export function seriesEnEchec(executions, seuil = SEUIL_ECHECS) {
  const parWorkflow = new Map();
  for (const e of Array.isArray(executions) ? executions : []) {
    const nom = String(e.workflowName || e.name || "").trim();
    if (!nom) continue;
    if (!parWorkflow.has(nom)) parWorkflow.set(nom, []);
    parWorkflow.get(nom).push(e);
  }
  const en_echec = [];
  for (const [workflow, runs] of parWorkflow) {
    runs.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    let n = 0, depuis = null, dernier = null, url = null;
    for (const r of runs) {
      if (r.status && r.status !== "completed") continue;                 // en cours ou en file : ne dit rien du code
      if (ECHEC.has(r.conclusion)) { n++; depuis = r.createdAt; if (!dernier) { dernier = r.createdAt; url = r.url || null; } continue; }
      if (r.conclusion === "success") break;
      /* annulée, sautée, neutre, périmée, action requise : ignorée */
    }
    if (n >= seuil) en_echec.push({ workflow, consecutifs: n, depuis, dernier, url });
  }
  en_echec.sort((a, b) => b.consecutifs - a.consecutifs || a.workflow.localeCompare(b.workflow));
  return { workflows_vus: parWorkflow.size, en_echec };
}

/** Relève un produit : { produit, slug, workflows_vus, en_echec } ou { produit, ..., non_releve: <cause> } ; null si le produit n'a rien d'hébergé. */
export function releverProduit(dossier, base, { gh = lanceurGh, git = lanceurGit } = {}) {
  const produit = relative(base, dossier).replaceAll("\\", "/") || dossier;
  if (!aDesWorkflows(dossier)) return null;
  const slug = slugGithub(git(["remote", "get-url", "origin"], dossier).stdout);
  if (!slug) return null;
  const tete = (git(["symbolic-ref", "--short", "refs/remotes/origin/HEAD"], dossier).stdout || "").trim().replace(/^origin\//, "");
  const r = gh(["run", "list", "--repo", slug, "--limit", "30", ...(tete ? ["--branch", tete] : []), "--json", "databaseId,workflowName,status,conclusion,createdAt,url"], { cwd: dossier });
  if (r.error || r.status !== 0) return { produit, slug, non_releve: String(r.error?.code || (r.stderr || "").trim().split(/\r?\n/)[0] || `exit ${r.status}`).slice(0, 140) };
  let liste; try { liste = JSON.parse(r.stdout); } catch { return { produit, slug, non_releve: "sortie de gh illisible" }; }
  return { produit, slug, ...seriesEnEchec(liste) };
}

/** Relève tous les produits du parc (lecture seule). `produits` : liste de dossiers, par défaut ceux de `produitsDuParc(base)`. */
export async function releverParc(base, { produits = null, gh = lanceurGh, git = lanceurGit } = {}) {
  const liste = produits || (await import("../scripts/relever-heritage.mjs")).produitsDuParc(base);
  const out = [];
  for (const d of liste) { const p = releverProduit(d, base, { gh, git }); if (p) out.push(p); }
  return out;
}

/** Faut-il lancer un relevé ? Non si un relevé tourne (verrou vivant) ou si la dernière trace a moins de REFRAICHIR_MIN minutes. */
export function decisionReleve(trace, { maintenant = new Date(), vivant = pidVivant } = {}) {
  const v = lireJson(cheminVerrou(trace));
  if (v && vivant(v.pid) && maintenant - Date.parse(v.ts) <= MARGE_VERROU_MS) return { lancer: false, raison: "en-cours", pid: v.pid };
  const fin = Date.parse(lireTrace(trace)?.fin);
  if (Number.isFinite(fin) && maintenant - fin < REFRAICHIR_MIN * 60000) return { lancer: false, raison: "a-jour", age_min: Math.round((maintenant - fin) / 60000) };
  return { lancer: true, raison: Number.isFinite(fin) ? "echu" : "jamais" };
}

/** Lance le relevé DÉTACHÉ et rend la main aussitôt (aucun résultat attendu). `spawner` est injectable. Un lancement impossible est rendu `lance: false`. */
export function lancerReleve({ trace, pilot, racine = null, maintenant = new Date(), vivant = pidVivant, spawner = spawn } = {}) {
  const d = decisionReleve(trace, { maintenant, vivant });
  if (!d.lancer) return { ...d, lance: false };
  const t0 = Date.now();
  try {
    const enfant = spawner(process.execPath, [join(ICI, "releve-workflows-heberges.mjs"), "--executer", "--trace", trace, ...(racine ? ["--racine", racine] : [])],
      { cwd: pilot, detached: true, stdio: "ignore", windowsHide: true, env: process.env });
    enfant.on?.("error", () => { /* lu sur `pid` ci-dessous */ });
    if (!enfant.pid) return { ...d, lance: false, erreur: "aucun processus n'a démarré (pas de pid)", duree_ms: Date.now() - t0 };
    enfant.unref?.();
    return { ...d, lance: true, pid: enfant.pid, duree_ms: Date.now() - t0 };
  } catch (e) { return { ...d, lance: false, erreur: e.code || e.message, duree_ms: Date.now() - t0 }; }
}

/** Ce que le relevé dit à l'ouverture : la trace lue (jamais un réseau), puis le lancement éventuel. Vide quand il n'y a rien à dire. */
export function lignesOuverture(trace, { maintenant = new Date(), lancer = null } = {}) {
  const t = lireTrace(trace);
  const out = [];
  const jour = (ts) => String(ts || "?").slice(0, 10);
  if (t && Array.isArray(t.produits)) {
    const age_h = Math.round((maintenant - Date.parse(t.fin)) / 3600000);
    const vus = t.produits.reduce((s, p) => s + (p.workflows_vus || 0), 0);
    const echecs = t.produits.flatMap((p) => (p.en_echec || []).map((e) => ({ ...e, produit: p.produit })));
    const manques = t.produits.filter((p) => p.non_releve);
    out.push(`- relevé du ${jour(t.fin)} (il y a ${Number.isFinite(age_h) ? age_h : "?"} h${age_h > PERIME_H ? ` — ANCIEN, plus de ${PERIME_H} h` : ""}) : ${vus} workflow(s) chez ${t.produits.length} produit(s) hébergé(s), `
      + (echecs.length ? `**${echecs.length} en échec ${SEUIL_ECHECS} fois de suite ou plus**` : `aucun en échec ${SEUIL_ECHECS} fois de suite`));
    for (const e of echecs.slice(0, 8)) out.push(`  - ${e.produit} : \`${e.workflow}\` en échec ${e.consecutifs} fois de suite, depuis le ${jour(e.depuis)} (dernière exécution le ${jour(e.dernier)})${e.url ? ` — ${e.url}` : ""}`);
    if (echecs.length > 8) out.push(`  - … et ${echecs.length - 8} autre(s) : lire ${trace}`);
    if (manques.length) out.push(`- NON relevé (≠ sain) : ${manques.slice(0, 6).map((p) => `${p.produit} (${p.non_releve})`).join(" ; ")}${manques.length > 6 ? ` ; … ${manques.length - 6} autre(s)` : ""}`);
  } else if (t === null && lancer) out.push("- aucun relevé encore sur ce poste : le premier est lancé en arrière-plan, son résultat se lit à l'ouverture suivante.");
  const l = lancer ? lancer() : null;
  if (l?.lance) out.push(`- relevé relancé en arrière-plan (${l.raison === "jamais" ? "jamais fait" : `trace de plus de ${REFRAICHIR_MIN} min`}, pid ${l.pid}, lancement en ${l.duree_ms} ms, sans attente) : résultat à l'ouverture suivante.`);
  else if (l?.erreur) out.push(`- relevé NON lancé (${l.erreur}) : les workflows hébergés des produits ne sont pas relevés cette fois.`);
  return out.length ? ["", "## Workflows hébergés des produits (TF-2442, RP-26 — relevé en lecture seule, oracles/releve-workflows-heberges.mjs)", ...out] : [];
}

/** Le relevé détaché : pose son verrou, relève le parc, écrit la trace, retire le verrou. */
export async function executer({ trace, base, gh = lanceurGh, git = lanceurGit, produits = null } = {}) {
  const verrou = cheminVerrou(trace);
  const debut = new Date().toISOString();
  ecrireAtomique(verrou, { pid: process.pid, ts: debut });
  try {
    const rel = await releverParc(base, { produits, gh, git });
    ecrireAtomique(trace, { format: FORMAT, debut, fin: new Date().toISOString(), seuil: SEUIL_ECHECS, produits: rel });
    return rel;
  } finally { rmSync(verrou, { force: true }); }
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes("--executer")) {
  const a = process.argv.slice(2);
  const val = (nom) => { const i = a.indexOf(nom); return i >= 0 ? a[i + 1] : null; };
  const pilot = join(ICI, "..");
  const trace = val("--trace") || cheminTrace(pilot);
  const base = val("--racine") || process.env.FORGE_ROOT || join(pilot, "..");
  try { await executer({ trace, base }); process.exit(0); } catch (e) { console.error(`releve-workflows-heberges : ${e.message}`); process.exit(1); }
}
