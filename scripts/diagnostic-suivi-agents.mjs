#!/usr/bin/env node
/**
 * diagnostic-suivi-agents.mjs — POURQUOI LE SUIVI D'AVANCEMENT DES AGENTS N'A TOURNÉ QUE QUELQUES FOIS (prompt 20261112g, ÉTAPE 2).
 *
 * Population : les transcripts de sous-agents (`<profil>\projects\<projet>\<session>\subagents\agent-*.jsonl`) des profils
 * lus, modifiés depuis `--jours` jours (30 par défaut), dont l'écart entre premier et dernier horodatage dépasse 15 minutes.
 * Chaque cas se rattache à sa session parente (`<session>.jsonl`) et se classe dans UNE cause, la première vraie l'emportant :
 *   (a) aucun chemin `…avancement….jsonl` dans la consigne de l'agent ;
 *   (b) un chemin nommé, aucune écriture vers ce chemin dans le transcript de l'agent (entrée d'outil qui le cite) ;
 *   (c) l'agent a écrit, aucun appel d'outil de la session parente dont l'entrée cite ce chemin, du lancement à la fin ;
 *   (d) la session l'a lu, mais un intervalle de plus de 17 min sans message de texte de l'assistant pendant la course ;
 *   (e) suivi tenu : un message de texte de l'assistant au moins toutes les 17 minutes, du lancement à la fin.
 *   « indéterminé » : session parente introuvable ou horodatages absents.
 * Rend le tableau par dépôt (produits pseudonymisés par scripts/lib-pseudonyme-produit.mjs) et un échantillon tiré au hasard
 * (graine fixée) pour la relecture à la main.
 *
 * Usage : node scripts/diagnostic-suivi-agents.mjs [--jours 30] [--profils <d1>,<d2>] [--echantillon 10] [--graine 20261112] [--json <sortie>]
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { racineConfigInstallee } from "./lib-config-installee.mjs";

const opt = (n, d = null) => { const i = process.argv.indexOf(n); return i > 1 ? process.argv[i + 1] : d; };
const MIN = 60000;
const SEUIL_MIN = 15, FENETRE_MIN = 17;

const MOTIF_AV = /[^\s"'`<>|*?()]*avancement[^\s"'`<>|*?()]*\.jsonl/gi;
const norm = (s) => String(s).replace(/\\\\/g, "/").replace(/\\/g, "/").toLowerCase();
/** Les deux derniers segments d'un chemin d'avancement (« campagne-x/avancement.jsonl »), comparables quelle que soit la forme. */
export function queue(chemin) { const p = norm(chemin).split("/").filter(Boolean); return p.length >= 2 ? p.slice(-2).join("/") : null; }

// Le chemin suit souvent l'étiquette « Avancement : `…\campagne-a2\L1.jsonl` » sans contenir le mot (6 consignes du 12/11/2026).
const MOTIF_ETIQUETTE = /avancement[^\n]{0,80}?([^\s"'`<>|*?()]+\.jsonl)/gi;
export function cheminsAvancement(texte) {
  const res = new Set();
  const t = String(texte || "");
  for (const m of t.matchAll(MOTIF_ETIQUETTE)) { const q = queue(m[1]); if (q && !/[<>{}]|\$\{|%/.test(q)) res.add(q); }
  for (const m of t.matchAll(MOTIF_AV)) {
    const q = queue(m[0]);
    if (q && !/[<>{}]|\$\{|%/.test(q)) res.add(q);
  }
  return [...res];
}

const parser = (l) => { try { return JSON.parse(l); } catch { return null; } };
const tsDe = (e) => (e && e.timestamp ? Date.parse(e.timestamp) : NaN);
const blocs = (e) => (e && e.message && Array.isArray(e.message.content) ? e.message.content : []);
const texteUser = (e) => { const c = e && e.message && e.message.content; return typeof c === "string" ? c : blocs(e).filter((b) => b.type === "text").map((b) => b.text || "").join("\n"); };

/** Lecture d'une session parente : appels d'outils (ts, entrée en texte), textes de l'assistant (ts), consignes d'Agent par toolUseId, cwd. */
export function lireSession(chemin) {
  const s = { outils: [], textes: [], consignes: new Map(), cwd: null };
  for (const l of readFileSync(chemin, "utf8").split("\n")) {
    if (!l) continue;
    const e = parser(l);
    if (!e) continue;
    if (!s.cwd && e.cwd) s.cwd = e.cwd;
    const ts = tsDe(e);
    if (e.type !== "assistant") continue;
    for (const b of blocs(e)) {
      if (b.type === "tool_use") {
        const entree = JSON.stringify(b.input || {});
        s.outils.push({ ts, nom: b.name, entree: norm(entree) });
        if ((b.name === "Agent" || b.name === "Task") && b.id) s.consignes.set(b.id, String((b.input && b.input.prompt) || ""));
      } else if (b.type === "text" && (b.text || "").trim() && !Number.isNaN(ts)) s.textes.push(ts);
    }
  }
  return s;
}

/** Lecture d'un transcript d'agent : premier et dernier horodatage, consigne (premier message), entrées d'outils normalisées. */
export function lireAgent(chemin) {
  const a = { debut: null, fin: null, consigne: "", entrees: [] };
  for (const l of readFileSync(chemin, "utf8").split("\n")) {
    if (!l) continue;
    const e = parser(l);
    if (!e) continue;
    const ts = tsDe(e);
    if (!Number.isNaN(ts)) { if (a.debut === null) a.debut = ts; a.fin = ts; }
    if (!a.consigne && e.type === "user") a.consigne = texteUser(e);
    if (e.type === "assistant") for (const b of blocs(e)) if (b.type === "tool_use") a.entrees.push(norm(JSON.stringify(b.input || {})));
  }
  return a;
}

/**
 * La consigne effective : le texte de l'appel Agent, plus les fichiers `.md` qu'il désigne comme consigne et qui existent encore
 * (« Lis d'abord la consigne commune : …\CONSIGNE-AGENT….md », relevé à la relecture du 12/11/2026). Rend aussi les fichiers
 * cités mais disparus : sans eux, l'absence de chemin ne se prouve pas.
 */
export function consigneEffective(texte) {
  const t = String(texte || "");
  // Le contrat lui-même (gabarits\AGENT-CAMPAGNE.md, cité par presque toutes les consignes) n'est pas une consigne : ses chemins
  // d'avancement sont des exemples génériques (« <run>/avancement.jsonl »), qui feraient passer un cas (a) pour un cas (b).
  const cites = [...new Set([...t.matchAll(/[A-Za-z]:[\\/][^\s"'`<>|*?]+\.md/g)].map((m) => m[0])
    .filter((p) => /consigne|lot-|campagne/i.test(p) && !/[\\/]gabarits[\\/]/i.test(p) && !/AGENT-CAMPAGNE\.md$/i.test(p)))];
  let complet = t;
  const disparus = [];
  for (const p of cites) {
    try { complet += "\n" + readFileSync(p, "utf8"); } catch { disparus.push(p); }
  }
  return { texte: complet, disparus };
}

/** Classe un cas (agent + session parente) dans une cause. */
export function classer(agent, session, consigne) {
  if (agent.debut === null || agent.fin === null) return { cause: "indéterminé", motif: "horodatages absents" };
  if (!session) return { cause: "indéterminé", motif: "session parente introuvable" };
  const eff = consigneEffective(consigne);
  let chemins = cheminsAvancement(eff.texte);
  // Un chemin écrit par l'agent prouve qu'on le lui a nommé (consigne citée disparue, ou chemin par défaut du contrat).
  if (!chemins.length) chemins = [...new Set(agent.entrees.flatMap((x) => cheminsAvancement(x)))];
  if (!chemins.length && eff.disparus.length) return { cause: "indéterminé", motif: `consigne citée disparue (${eff.disparus.length} fichier(s)), aucune écriture d'avancement de l'agent` };
  if (!chemins.length) return { cause: "a", motif: "aucun chemin d'avancement dans la consigne ni dans les fichiers qu'elle cite" };
  const ecrit = chemins.filter((q) => agent.entrees.some((x) => x.includes(q)));
  if (!ecrit.length) return { cause: "b", motif: `chemin nommé (${chemins[0]}), aucune écriture de l'agent` };
  const lu = session.outils.some((o) => o.ts >= agent.debut - MIN && o.ts <= agent.fin + MIN && ecrit.some((q) => o.entree.includes(q)));
  if (!lu) return { cause: "c", motif: `l'agent écrit ${ecrit[0]}, la session ne l'a jamais lu pendant la course` };
  const marques = [agent.debut, ...session.textes.filter((t) => t > agent.debut && t < agent.fin), agent.fin];
  let pire = 0;
  for (let i = 1; i < marques.length; i++) pire = Math.max(pire, (marques[i] - marques[i - 1]) / MIN);
  if (pire > FENETRE_MIN) return { cause: "d", motif: `lu, mais ${pire.toFixed(0)} min sans message de texte pendant la course` };
  return { cause: "e", motif: `suivi tenu, écart maximal ${pire.toFixed(0)} min` };
}

function aleatoire(graine) { let s = graine >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/**
 * Les profils de configuration du poste, par la fonction partagée (TF-2483, TF-0995) : celui que la session charge (`CLAUDE_CONFIG_DIR`),
 * puis `~\.claude` et son frère `~\.claude-b`, sans doublon. Sans répertoire personnel, la liste est vide au lieu de lever.
 */
function profilsParDefaut() {
  const defaut = racineConfigInstallee({}).racine;
  return [...new Set([racineConfigInstallee().racine, defaut, defaut && join(dirname(defaut), ".claude-b")].filter(Boolean))];
}

async function main() {
  const jours = Number(opt("--jours", "30"));
  const profils = (opt("--profils") || profilsParDefaut().join(",")).split(",");
  const depuis = Date.now() - jours * 24 * 3600000;
  const { pseudonymeProduit } = await import("./lib-pseudonyme-produit.mjs");
  const parc = "c:\\dev";
  const depotDe = (cwd) => {
    if (!cwd) return "inconnu";
    const r = relative(parc, cwd);
    if (r.startsWith("..") || /^[A-Za-z]:/.test(r)) return "hors parc";
    const premier = r.split(/[\\/]/)[0];
    if (/^digit-ai-/.test(premier)) return premier;
    try { return pseudonymeProduit(premier); } catch { return "produit (pseudonyme indisponible)"; }
  };
  const cas = [];
  const sessions = new Map();
  for (const prof of profils) {
    const projets = join(prof, "projects");
    if (!existsSync(projets)) continue;
    for (const p of readdirSync(projets)) {
      const dp = join(projets, p);
      let entrees = [];
      try { entrees = readdirSync(dp, { withFileTypes: true }); } catch { continue; }
      for (const d of entrees) {
        if (!d.isDirectory()) continue;
        const sub = join(dp, d.name, "subagents");
        if (!existsSync(sub)) continue;
        for (const f of readdirSync(sub)) {
          if (!/^agent-.+\.jsonl$/.test(f)) continue;
          const chemin = join(sub, f);
          let st; try { st = statSync(chemin); } catch { continue; }
          if (st.mtimeMs < depuis) continue;
          let agent; try { agent = lireAgent(chemin); } catch { continue; }
          if (agent.debut === null || (agent.fin - agent.debut) / MIN <= SEUIL_MIN) continue;
          const parent = join(dp, `${d.name}.jsonl`);
          let session = sessions.get(parent);
          if (session === undefined) { session = existsSync(parent) ? lireSession(parent) : null; sessions.set(parent, session); }
          let meta = {};
          try { meta = JSON.parse(readFileSync(chemin.replace(/\.jsonl$/, ".meta.json"), "utf8")); } catch { /* sans méta */ }
          const consigne = (session && meta.toolUseId && session.consignes.get(meta.toolUseId)) || agent.consigne;
          const { cause, motif } = classer(agent, session, consigne);
          cas.push({ profil: prof.endsWith("-b") ? "claude-b" : "claude", depot: depotDe(session && session.cwd), chemin, debut: new Date(agent.debut).toISOString(),
            duree_min: +((agent.fin - agent.debut) / MIN).toFixed(1), cause, motif });
        }
      }
    }
  }
  const CAUSES = ["a", "b", "c", "d", "e", "indéterminé"];
  const parDepot = {};
  for (const c of cas) { parDepot[c.depot] ??= Object.fromEntries(CAUSES.map((k) => [k, 0])); parDepot[c.depot][c.cause]++; }
  const total = Object.fromEntries(CAUSES.map((k) => [k, cas.filter((c) => c.cause === k).length]));
  const rnd = aleatoire(Number(opt("--graine", "20261112")));
  const pool = [...cas];
  const echantillon = [];
  for (let i = 0; i < Number(opt("--echantillon", "10")) && pool.length; i++) echantillon.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  const sortie = { mesure_le: new Date().toISOString(), jours, profils, population: cas.length, total,
    part_indeterminee: cas.length ? +(100 * total["indéterminé"] / cas.length).toFixed(1) : 0, par_depot: parDepot, echantillon };
  if (opt("--json")) writeFileSync(opt("--json"), JSON.stringify({ ...sortie, cas }, null, 1));
  console.log(JSON.stringify(sortie, null, 1));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
