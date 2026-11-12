#!/usr/bin/env node
/**
 * oracle-suivi-agents.mjs — ORACLE DE RELEVÉ : TOUT AGENT DE PLUS DE 17 MINUTES A EU SES POINTS DE SUIVI.
 *
 * Prompt « Suivi des agents toutes les 15 minutes » (20261112g, ÉTAPE 5 ; D-209 (a) du 12/11/2026). Lit des transcripts de
 * sessions (et leur dossier `subagents\`), et, pour chaque sous-agent dont la course dépasse 17 minutes, mesure trois écarts
 * dans le transcript de la session PARENTE : lancement → premier point de suivi, entre deux points, dernier point → fin
 * (ou → maintenant pour un agent encore en course). Un point de suivi est un message de texte de l'assistant dont la
 * première ligne est « Suivi agents » (`estPointDeSuivi`, lib-suivi-agents.mjs).
 *
 * Exit 1 si un écart dépasse 17 minutes ou si un agent de plus de 17 minutes n'a aucun point ; 0 sinon ; 2 en erreur d'usage.
 *
 * Usage :
 *   node oracles/oracle-suivi-agents.mjs --transcript <session.jsonl> [--transcript …]
 *   node oracles/oracle-suivi-agents.mjs --depuis <AAAA-MM-JJTHH:MM> [--profils <dossier>,<dossier>]   (transcripts modifiés depuis)
 *   node oracles/oracle-suivi-agents.mjs --self-test       (paire de fixtures rouge et verte)
 *
 * NON JUGÉ : le CONTENU du point (justesse des tâches faites et restantes), un agent dont la session s'est fermée avant sa
 * fin (S67 : aucune conversation ne peut plus porter de point ; il est compté à part, « session fermée », jamais en FAIL),
 * une commande d'arrière-plan de la session, une session `claude -p` lancée par un script.
 */
import { existsSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync, utimesSync, rmSync } from "node:fs";
import { join } from "node:path";
import { homedir, tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { lireParent, agentsDeSession, MINUTE } from "./lib-suivi-agents.mjs";

export const SEUIL_MIN = 17;

/** Mesure les agents d'une session : [{ id, nom, courseMin, points, ecarts:[{de,a,min}], pire, verdict, motif }]. */
export function mesurerSession(transcript, maintenant = Date.now()) {
  const parent = lireParent(transcript);
  const agents = agentsDeSession(transcript, maintenant, parent);
  const finSession = parent.dernierTs ?? maintenant;
  const res = [];
  for (const a of agents) {
    const fin = a.fini ? a.finA : maintenant;
    const courseMin = (fin - a.lancement) / MINUTE;
    if (courseMin <= SEUIL_MIN) continue;
    const pts = parent.points.map((p) => p.ts).filter((t) => t >= a.lancement && t <= fin + SEUIL_MIN * MINUTE);
    const ecarts = [];
    let prec = a.lancement, de = "lancement";
    for (const t of pts.filter((t) => t <= fin)) { ecarts.push({ de, a: "point", min: (t - prec) / MINUTE }); prec = t; de = "point"; }
    const finEffective = a.fini ? fin : Math.min(maintenant, finSession + SEUIL_MIN * MINUTE);
    // le dernier point → fin : un point émis APRÈS la fin (au plus 17 min) couvre l'agent fini
    const apres = pts.find((t) => t > fin);
    ecarts.push({ de, a: a.fini ? "fin" : "maintenant", min: ((apres && a.fini ? Math.min(apres, finEffective) : finEffective) - prec) / MINUTE });
    const sessionFermee = !a.fini && maintenant - finSession > SEUIL_MIN * MINUTE && maintenant - a.vie > SEUIL_MIN * MINUTE;
    const pire = Math.max(...ecarts.map((e) => e.min));
    let verdict = "PASS", motif = `${pts.length} point(s), écart maximal ${pire.toFixed(1)} min`;
    if (sessionFermee) { verdict = "SANS_OBJET"; motif = "session fermée avant la fin de l'agent (S67)"; }
    else if (!pts.length) { verdict = "FAIL"; motif = `aucun point de suivi pour un agent de ${courseMin.toFixed(1)} min`; }
    else if (pire > SEUIL_MIN) { verdict = "FAIL"; motif = `écart de ${pire.toFixed(1)} min (> ${SEUIL_MIN})`; }
    res.push({ id: a.id, nom: a.nom, courseMin: +courseMin.toFixed(1), fini: a.fini, points: pts.map((t) => new Date(t).toISOString()), ecarts: ecarts.map((e) => ({ ...e, min: +e.min.toFixed(1) })), pire: +pire.toFixed(1), verdict, motif });
  }
  return res;
}

function transcriptsDepuis(depuis, profils) {
  const res = [];
  for (const prof of profils) {
    const projets = join(prof, "projects");
    if (!existsSync(projets)) continue;
    for (const p of readdirSync(projets)) {
      const d = join(projets, p);
      let fichiers = [];
      try { fichiers = readdirSync(d); } catch { continue; }
      for (const f of fichiers) {
        if (!f.endsWith(".jsonl")) continue;
        const chemin = join(d, f);
        try { if (statSync(chemin).mtimeMs >= depuis && existsSync(join(d, f.slice(0, -6), "subagents"))) res.push(chemin); } catch { /* illisible */ }
      }
    }
  }
  return res;
}

export function juger(transcripts, maintenant = Date.now()) {
  const sessions = transcripts.map((t) => ({ transcript: t, agents: mesurerSession(t, maintenant) })).filter((s) => s.agents.length);
  const tous = sessions.flatMap((s) => s.agents);
  const fails = tous.filter((a) => a.verdict === "FAIL");
  return { oracle: "oracle-suivi-agents", verdict: fails.length ? "FAIL" : "PASS", sessions_lues: transcripts.length,
    agents_juges: tous.length, fail: fails.length, sans_objet: tous.filter((a) => a.verdict === "SANS_OBJET").length, sessions,
    non_juge: ["le contenu des points (justesse des tâches)", "un agent dont la session s'est fermée (SANS_OBJET, S67)", "les commandes d'arrière-plan de la session"] };
}

// ---- Fixtures rouge et verte : une session fictive par fixture, écrite dans un dossier temporaire ----
function fixture(racine, nom, { points, agent }) {
  const M = MINUTE, T0 = Date.parse("2026-11-12T20:00:00Z"), iso = (t) => new Date(T0 + t * M).toISOString();
  const dir = join(racine, nom);
  mkdirSync(join(dir, nom, "subagents"), { recursive: true });
  const lignes = [JSON.stringify({ type: "user", timestamp: iso(0), message: { role: "user", content: "Lance le banc." } })];
  for (const p of points) lignes.push(JSON.stringify({ type: "assistant", timestamp: iso(p), message: { role: "assistant", content: [{ type: "text", text: `Suivi agents\n- banc · actif (preuve de vie il y a 1 min) · faits : a · restants : b` }] } }));
  lignes.push(JSON.stringify({ type: "assistant", timestamp: iso(agent.fin + 1), message: { role: "assistant", content: [{ type: "text", text: "Fini." }] } }));
  const transcript = join(dir, `${nom}.jsonl`);
  writeFileSync(transcript, lignes.join("\n") + "\n");
  const f = join(dir, nom, "subagents", "agent-banc01.jsonl");
  writeFileSync(f, [JSON.stringify({ type: "user", timestamp: iso(0.2), message: { role: "user", content: "banc" } }), JSON.stringify({ type: "assistant", timestamp: iso(agent.fin), message: { role: "assistant", content: [{ type: "text", text: "fini" }] } })].join("\n") + "\n");
  writeFileSync(join(dir, nom, "subagents", "agent-banc01.meta.json"), JSON.stringify({ description: "banc", agentType: "general-purpose", finished: true }));
  const r = Date.now() - 60000;
  utimesSync(f, r / 1000, r / 1000);
  return { transcript, maintenant: T0 + (agent.fin + 30) * M };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) {
    const racine = mkdtempSync(join(tmpdir(), "oracle-suivi-"));
    const cas = [
      ["verte : 35 min, points à 15 et 30", { points: [15.3, 30.4], agent: { fin: 35 } }, "PASS"],
      ["rouge : 35 min, aucun point", { points: [], agent: { fin: 35 } }, "FAIL"],
      ["rouge : 35 min, un seul point à 15 (dernier point → fin 20 min)", { points: [15.1], agent: { fin: 35 } }, "FAIL"],
      ["rouge : premier point à 18 min", { points: [18, 30], agent: { fin: 35 } }, "FAIL"],
      ["verte : agent de 16 min sans point, non jugé", { points: [], agent: { fin: 16 } }, "PASS"],
    ];
    let ok = 0;
    for (const [nom, def, attendu] of cas) {
      const { transcript, maintenant } = fixture(racine, nom.replace(/[^a-z0-9]+/gi, "-").slice(0, 40), def);
      const r = juger([transcript], maintenant);
      const bon = r.verdict === attendu;
      if (bon) ok++;
      console.log(`${bon ? "ok  " : "ÉCHEC"} ${nom} → ${r.verdict}${bon ? "" : ` (attendu ${attendu}) ${JSON.stringify(r.sessions)}`}`);
    }
    rmSync(racine, { recursive: true, force: true });
    console.log(`oracle-suivi-agents --self-test : ${ok}/${cas.length} PASS`);
    process.exit(ok === cas.length ? 0 : 1);
  }
  const transcripts = [];
  for (let i = 0; i < args.length; i++) if (args[i] === "--transcript") transcripts.push(args[++i]);
  const iDepuis = args.indexOf("--depuis");
  if (iDepuis >= 0) {
    const depuis = Date.parse(args[iDepuis + 1]);
    if (Number.isNaN(depuis)) { console.error("--depuis : date illisible"); process.exit(2); }
    const iP = args.indexOf("--profils");
    const profils = iP >= 0 ? args[iP + 1].split(",") : [join(homedir(), ".claude"), join(homedir(), ".claude-b")];
    transcripts.push(...transcriptsDepuis(depuis, profils));
  }
  if (!transcripts.length) { console.error("usage : --transcript <session.jsonl> | --depuis <date> | --self-test"); process.exit(2); }
  const r = juger(transcripts);
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}
