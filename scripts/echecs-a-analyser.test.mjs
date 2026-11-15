#!/usr/bin/env node
/**
 * echecs-a-analyser.test.mjs — la liste des fiches à analyser et la consigne de l'analyste, dans les deux sens (D-219 (e) du 15/11/2026,
 * TF-2563, mandat 20261115b, lot L5).
 *   VERT  : la liste retient 5 fiches au plus, des plus anciennes aux plus récentes, parmi les agents de 17 minutes ou plus dont la fin
 *           n'est pas « fini », et compte ce qu'elle ne retient pas (déjà analysés, sans transcription, au-delà du plafond) ; 17 minutes
 *           exactement est retenu ; `--agent` prépare la consigne (transcription, cinq causes et ce qu'elles désignent, forme de la
 *           réponse, commande de la session) ; la transcription se trouve même quand la session de la fiche ne répond pas ; une cause
 *           notée par noter-fiche.mjs fait sortir la fiche de la liste ; le coût se lit aux fiches de l'analyste ; la fenêtre se tient ;
 *           les définitions couvrent exactement le jeu fermé de noter-fiche.mjs.
 *   ROUGE : `--agent` sur un agent de moins de 17 minutes est REFUSÉ (exit 1, aucune consigne) ; de même un agent fini, de durée
 *           inconnue, sans fiche ou sans transcription ; la liste ne cite aucun chemin et ne recopie pas un projet hors pseudonyme ;
 *           usage invalide, 2 ; le banc n'écrit rien, ni à ses fiches ni à celles du pilot.
 * Fichiers jetables sous le répertoire temporaire. Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFINITIONS_CAUSES, eligibilite, PLAFOND } from "./echecs-a-analyser.mjs";
import { CAUSES_ANALYSEES, SCHEMA_VERDICT } from "./noter-fiche.mjs";
import { SCHEMA } from "../oracles/lib-fiches-agents.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(ICI, "echecs-a-analyser.mjs");
const NOTER = join(ICI, "noter-fiche.mjs");
const FICHES_DU_PILOT = join(ICI, "..", "todo", "observabilite", "fiches-agents.jsonl");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (cond, msg) => { if (!cond) throw new Error(msg); };
const etatDe = (f) => (existsSync(f) ? `${statSync(f).size}:${statSync(f).mtimeMs}` : "absent");
const avantPilot = etatDe(FICHES_DU_PILOT);

const base = mkdtempSync(join(tmpdir(), "echecs-a-analyser-"));
const DOSSIER = join(base, "projects", "projet-banc");
const SESSION = "cafe0000-1111-4000-8000-000000000000";
const AUTRE_SESSION = "beef0000-2222-4000-8000-000000000000";
const ENV = { ...process.env, FORGE_SESSION_ID: "5e550000-1111-4000-8000-000000000000", FORGE_CONTEXTE_BANC: "1", CLAUDE_PROJECT_DIR: base };
delete ENV.FORGE_FICHES_AGENTS;
const MIN = 60;
const maintenant = Date.now();
let rang = 0;
/** Une fiche à la forme du lot L1, horodatée dans la fenêtre par défaut, chaque fiche plus récente que la précédente. */
const fiche = (id, plus = {}) => ({ schema: SCHEMA, ts: new Date(maintenant - (200 - ++rang) * 60000).toISOString(), session: "cafe0000", session_source: "hook", agent_id: id,
  type: "campagne", modele: "claude-sonnet-5-5", effort: "high", duree_s: 40 * MIN, jetons_entree: 1000, jetons_sortie: 100, appels_outils: 12, verdict_livrable: null,
  verdict_relecture: null, frictions: 0, cause_fin: "abandonne", projet: "digit-ai-factory", partielle: false, lacunes: [], ...plus });
const transcription = (id, session = SESSION, lignes = 3) => {
  const d = join(DOSSIER, session, "subagents");
  mkdirSync(d, { recursive: true });
  const f = join(d, `agent-${id}.jsonl`);
  writeFileSync(f, Array.from({ length: lignes }, (_, i) => JSON.stringify({ type: "user", rang: i })).join("\n") + "\n", "utf8");
  return f;
};
let n = 0;
const fichierDe = (lignes) => { const f = join(base, `fiches-${++n}.jsonl`); writeFileSync(f, lignes.map((l) => (typeof l === "string" ? l : JSON.stringify(l))).join("\n") + "\n", "utf8"); return f; };
const jouer = (args, { fichier = null, transcripts = true } = {}) => {
  const e = { ...ENV }; if (fichier) e.FORGE_FICHES_AGENTS = fichier;
  const r = spawnSync(process.execPath, [SCRIPT, ...args, ...(transcripts ? ["--transcripts", DOSSIER] : [])], { encoding: "utf8", env: e, cwd: base });
  return { code: r.status, out: r.stdout || "", err: r.stderr || "" };
};
const json = (r) => { try { return JSON.parse(r.out); } catch { throw new Error(`sortie illisible (exit ${r.code}) : ${r.out.slice(0, 200)}${r.err.slice(0, 200)}`); } };

try {
  // La population de la revue : t1 (plus ancien, sans transcription), e1..e7 (éligibles), k1 (déjà analysé), s1 (16 min 59 s), f1 (fini),
  // u1 (durée inconnue), v1 (éligible mais vieux de 40 jours, hors de la fenêtre par défaut).
  const t1 = fiche("t1");
  const e = ["e1", "e2"].map((id) => fiche(id));
  const k1 = fiche("k1", { cause_fin: "erreur" });
  e.push(...["e3", "e4", "e5", "e6", "e7"].map((id) => fiche(id, { cause_fin: id === "e4" ? null : "abandonne" })));
  const s1 = fiche("s1", { duree_s: 17 * MIN - 1, cause_fin: "erreur" });
  const f1 = fiche("f1", { duree_s: 50 * MIN, cause_fin: "fini" });
  const u1 = fiche("u1", { duree_s: null, cause_fin: "erreur", partielle: true, lacunes: ["transcription vide"] });
  const v1 = fiche("v1", { ts: new Date(maintenant - 40 * 86400000).toISOString() });
  for (const f of [...e, k1, s1, f1, u1, v1]) transcription(f.agent_id);
  const analyse = { schema: SCHEMA_VERDICT, ts: new Date(maintenant - 10 * 60000).toISOString(), agent_id: "k1", verdict_livrable: null, verdict_relecture: null,
    cause_analysee: "erreur_outil", analyste: "analyste-echecs", session: "5e550000", session_source: "session_start" };
  const REVUE = fichierDe([t1, ...e, k1, s1, f1, u1, v1, analyse]);

  check("vert — la liste retient 5 fiches au plus, des plus anciennes aux plus récentes, et compte ce qu'elle ne retient pas", () => {
    const r = jouer(["--json"], { fichier: REVUE });
    const j = json(r);
    att(r.code === 0 && j.plafond === PLAFOND && PLAFOND === 5 && j.seuil_min === 17, `exit ${r.code}, plafond ${j.plafond}, seuil ${j.seuil_min}`);
    att(j.retenues.map((x) => x.agent_id).join() === "e1,e2,e3,e4,e5", `retenues : ${j.retenues.map((x) => x.agent_id)}`);
    att(j.eligibles === 9 && j.sans_transcription.join() === "t1" && j.deja_analysees.join() === "k1" && j.au_dela_du_plafond.join() === "e6,e7",
      JSON.stringify({ eligibles: j.eligibles, sans: j.sans_transcription, deja: j.deja_analysees, au_dela: j.au_dela_du_plafond }));
    att(j.retenues[3].cause_fin === null, "une cause de fin inconnue n'est pas « fini » : elle est retenue");
    const t = jouer([], { fichier: REVUE });
    att(t.code === 0 && /5 retenu\(s\) sur un plafond de 5 par revue/.test(t.out) && /1 déjà analysé\(s\), 1 sans transcription sur le poste, 2 au-delà du plafond/.test(t.out), t.out);
  });
  check("rouge — --agent sur un agent de moins de 17 minutes est refusé : exit 1, aucune consigne ; la liste ne le retient pas", () => {
    const r = jouer(["--agent", "s1"], { fichier: REVUE });
    att(r.code === 1 && /agent s1 refusé — agent de moins de 17 minutes \(16 min 59 s\)/.test(r.out), `exit ${r.code} : ${r.out}${r.err}`);
    att(!/Consigne de l'analyste/.test(r.out), "une consigne a été préparée pour un agent refusé");
    const j = json(jouer(["--agent", "s1", "--json"], { fichier: REVUE }));
    att(j.eligible === false && j.consigne === null && j.transcription === null, JSON.stringify(j).slice(0, 300));
    att(eligibilite(s1).eligible === false && eligibilite(s1, { seuilMin: 16 }).eligible === true, "le refus ne tient pas à la borne de 17 minutes");
  });
  check("vert — 17 minutes exactement est retenu (la borne refuse « moins de 17 minutes »)", () => {
    const b1 = fiche("b1", { duree_s: 17 * MIN, cause_fin: "timeout" });
    transcription("b1");
    const r = jouer(["--agent", "b1"], { fichier: fichierDe([b1]) });
    att(r.code === 0 && /agent b1 à analyser — 17 min 00 s, fin « timeout »/.test(r.out), `exit ${r.code} : ${r.out}${r.err}`);
  });
  check("rouge — --agent refuse un agent fini, de durée inconnue, sans fiche ou sans transcription, chacun avec son motif", () => {
    const cas = { f1: /agent fini/, u1: /durée inconnue/, inconnu: /aucune fiche de cet agent/, t1: /n'est plus sur le poste/ };
    for (const [id, motif] of Object.entries(cas)) {
      const r = jouer(["--agent", id], { fichier: REVUE });
      att(r.code === 1 && motif.test(r.out) && !/Consigne de l'analyste/.test(r.out), `${id} : exit ${r.code} : ${r.out}${r.err}`);
    }
  });
  check("vert — --agent prépare la consigne : transcription, cinq causes et ce qu'elles désignent, forme de la réponse, commande de la session", () => {
    const r = jouer(["--agent", "e1"], { fichier: REVUE });
    att(r.code === 0 && r.out.includes(join(DOSSIER, SESSION, "subagents", "agent-e1.jsonl")) && /\(3 lignes, /.test(r.out), `exit ${r.code} : ${r.out}${r.err}`);
    for (const c of CAUSES_ANALYSEES) att(r.out.includes(`- ${c} : ${DEFINITIONS_CAUSES[c]}`), `la cause ${c} n'est pas dans la consigne`);
    for (const motif of [/subagent_type analyste-echecs/, /cause : <une des cinq>/, /citation : « <extrait recopié mot pour mot> » \(ligne <n>\)/, /Tu n'écris aucun fichier et ne lances aucune commande/,
      /noter-fiche\.mjs" --agent e1 --cause-analysee <cause> --analyste analyste-echecs/]) att(motif.test(r.out), `${motif} absent de la sortie`);
    const j = json(jouer(["--agent", "e1", "--json"], { fichier: REVUE }));
    att(j.eligible === true && j.lignes === 3 && typeof j.consigne === "string" && j.fiche.agent_id === "e1" && j.deja === null, JSON.stringify(j).slice(0, 300));
  });
  check("vert — la transcription se trouve dans une autre session quand celle de la fiche ne répond pas ; un agent déjà analysé se dit tel", () => {
    const w1 = fiche("w1", { session: "dead0000" });
    transcription("w1", AUTRE_SESSION);
    const r = jouer(["--agent", "w1"], { fichier: fichierDe([w1]) });
    att(r.code === 0 && r.out.includes(join(DOSSIER, AUTRE_SESSION, "subagents", "agent-w1.jsonl")), `exit ${r.code} : ${r.out}${r.err}`);
    const k = jouer(["--agent", "k1"], { fichier: REVUE });
    att(k.code === 0 && /déjà analysé \(erreur_outil par analyste-echecs\)/.test(k.out), k.out + k.err);
  });
  check("vert — une cause notée par noter-fiche.mjs fait sortir la fiche de la liste, et la suivante y entre", () => {
    const liste = [fiche("x1"), fiche("x2"), fiche("x3"), fiche("x4"), fiche("x5"), fiche("x6")];
    for (const f of liste) transcription(f.agent_id);
    const f = fichierDe(liste);
    att(json(jouer(["--json"], { fichier: f })).retenues.map((x) => x.agent_id).join() === "x1,x2,x3,x4,x5", "liste de départ");
    const note = spawnSync(process.execPath, [NOTER, "--agent", "x1", "--cause-analysee", "abandon", "--analyste", "analyste-echecs"], { encoding: "utf8", env: { ...ENV, FORGE_FICHES_AGENTS: f }, cwd: base });
    att(note.status === 0, `noter-fiche : exit ${note.status} ${note.stdout}${note.stderr}`);
    const j = json(jouer(["--json"], { fichier: f }));
    att(j.retenues.map((x) => x.agent_id).join() === "x2,x3,x4,x5,x6" && j.deja_analysees.join() === "x1", JSON.stringify({ r: j.retenues.map((x) => x.agent_id), d: j.deja_analysees }));
  });
  check("rouge — la liste ne cite aucun chemin, ni des transcriptions ni des fiches, et ne recopie pas un projet hors pseudonyme", () => {
    const p1 = fiche("p1", { projet: "client-reel-banc" });
    transcription("p1");
    const f = fichierDe([p1]);
    for (const args of [[], ["--json"]]) {
      const r = jouer(args, { fichier: f });
      att(r.code === 0 && !r.out.includes(base) && !r.out.includes(DOSSIER) && !r.out.includes("client-reel-banc"), `chemin ou nom recopié : ${r.out.slice(0, 400)}`);
    }
    att(/projet inconnu · campagne · p1/.test(jouer([], { fichier: f }).out) && json(jouer(["--json"], { fichier: f })).retenues[0].projet === null, "le projet hors pseudonyme n'est pas tu");
    att(/le fichier désigné par FORGE_FICHES_AGENTS/.test(jouer([], { fichier: f }).out), "le fichier lu n'est pas nommé par son contrat");
  });
  check("vert — le coût d'une analyse se lit aux fiches de l'analyste ; sans elles, il se dit non mesuré", () => {
    const sans = jouer([], { fichier: fichierDe([fiche("y1")]) });
    att(/coût d'une analyse : non mesuré, aucune fiche de l'analyste \(type analyste-echecs\)/.test(sans.out), sans.out);
    const a = [[100000, 2000, 300], [300000, 6000, 900], [200000, 4000, 600]].map(([je, js, d], i) => fiche(`z${i}`, { type: "analyste-echecs", cause_fin: "fini", jetons_entree: je, jetons_sortie: js, duree_s: d }));
    const f = fichierDe(a);
    const c = json(jouer(["--json"], { fichier: f })).cout;
    att(c.analyses === 3 && c.mediane_jetons_entree === 200000 && c.mediane_jetons_sortie === 4000 && c.mediane_duree_s === 600, JSON.stringify(c));
    att(/coût mesuré d'une analyse \(3 fiche\(s\) de l'analyste, type analyste-echecs\) : médiane 200000 jetons d'entrée, 4000 de sortie, 10 min 00 s/.test(jouer([], { fichier: f }).out), "ligne du coût");
  });
  check("vert — la fenêtre : une fiche de 40 jours sort de la liste par défaut (30 jours) et y entre avec --depuis", () => {
    const vieux = fichierDe([v1]);
    att(json(jouer(["--json"], { fichier: vieux })).eligibles === 0, "la fiche de 40 jours est dans la fenêtre par défaut");
    const depuis = new Date(maintenant - 60 * 86400000).toISOString().slice(0, 10);
    att(json(jouer(["--json", "--depuis", depuis], { fichier: vieux })).retenues.map((x) => x.agent_id).join() === "v1", "--depuis ne l'a pas fait entrer");
  });
  check("vert — les définitions couvrent exactement le jeu fermé de noter-fiche.mjs, ni plus ni moins", () => {
    att(Object.keys(DEFINITIONS_CAUSES).join() === CAUSES_ANALYSEES.join(), `${Object.keys(DEFINITIONS_CAUSES)} / ${CAUSES_ANALYSEES}`);
  });
  check("rouge — usage invalide : option inconnue, --jours nul ou non numérique, --depuis mal formé, --agent sans valeur ou mal formé : 2", () => {
    for (const a of [["--inconnue"], ["--jours", "0"], ["--jours", "abc"], ["--depuis", "15/11/2026"], ["--agent"], ["--agent", "../x"], ["--agent", "--json"]]) {
      const r = jouer(a, { fichier: REVUE, transcripts: false });
      att(r.code === 2, `${a.join(" ")} : exit ${r.code} ${r.out}${r.err}`);
    }
  });
  check("rouge — le banc n'écrit rien : ni au fichier de sa revue, ni au fichier des fiches du pilot", () => {
    const avant = readFileSync(REVUE, "utf8");
    jouer([], { fichier: REVUE }); jouer(["--agent", "e1"], { fichier: REVUE }); jouer(["--agent", "s1"], { fichier: REVUE });
    att(readFileSync(REVUE, "utf8") === avant, "le fichier de la revue a changé");
    att(etatDe(FICHES_DU_PILOT) === avantPilot, `${FICHES_DU_PILOT} : ${avantPilot} → ${etatDe(FICHES_DU_PILOT)}`);
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

console.log(`\nechecs-a-analyser : ${pass} PASS, ${fail} FAIL — cas rouges : agent de moins de 17 minutes refusé, agent fini, durée inconnue, sans fiche, sans transcription, chemin ou projet recopié, usage invalide, écriture du banc`);
process.exit(fail ? 1 : 0);
