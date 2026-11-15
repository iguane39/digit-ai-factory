#!/usr/bin/env node
/**
 * noter-fiche.test.mjs — le verdict d'un agent se note sur sa fiche, en ajout seul, dans les deux sens (D-219 (e) du 15/11/2026,
 * TF-2563, mandat 20261115b, lot L2).
 *   VERT  : une relecture « sert » notée sur la fiche d'un agent ajoute UNE ligne d'événement, signée de la session, et laisse les lignes
 *           d'avant intactes, octet pour octet ; les deux verdicts notés en un appel tiennent sur une ligne ; une relecture « derive »
 *           relue « sert » après correction finit « sert » (le dernier événement l'emporte) ; une fiche partielle reçoit un verdict ;
 *           chez un produit, le fichier est forge/fiches-agents.jsonl et la sortie ne cite pas le dossier du produit ; la lecture garde la
 *           dernière fiche d'un agent, met à part une fiche sans identifiant, compte une ligne illisible et une ligne d'un autre schéma.
 *   ROUGE : le même verdict noté deux fois n'écrit rien la seconde fois (« déjà noté », exit 0) ; un agent sans fiche rend 1 sans rien
 *           écrire ; sans fichier de fiches, 1, et aucun fichier n'est créé ; sans --agent, sans verdict, verdict hors vocabulaire,
 *           identifiant mal formé ou option inconnue, 2 sans rien écrire.
 * Fichiers jetables sous le répertoire temporaire ; le fichier des fiches du pilot n'est jamais touché. Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { lireFiches, noterFiche, SCHEMA_VERDICT } from "./noter-fiche.mjs";
import { SCHEMA } from "../oracles/lib-fiches-agents.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(ICI, "noter-fiche.mjs");
const FICHES_DU_PILOT = join(ICI, "..", "todo", "observabilite", "fiches-agents.jsonl");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (cond, msg) => { if (!cond) throw new Error(msg); };
const etatDe = (f) => (existsSync(f) ? `${statSync(f).size}:${statSync(f).mtimeMs}` : "absent");
const avantPilot = etatDe(FICHES_DU_PILOT);

const base = mkdtempSync(join(tmpdir(), "noter-fiche-"));
const SESSION = "5e550000-1111-4000-8000-000000000000";
const ENV = { ...process.env, FORGE_SESSION_ID: SESSION, FORGE_CONTEXTE_BANC: "1", CLAUDE_PROJECT_DIR: base };
delete ENV.FORGE_FICHES_AGENTS;
/** Une fiche à la forme du lot L1 (15 clés et leurs compléments). */
const fiche = (id, plus = {}) => ({ schema: SCHEMA, ts: "2026-11-15T09:00:00.000Z", session: "cafe0000", session_source: "hook", agent_id: id, type: "explorateur",
  modele: "claude-opus-5-5", effort: "high", duree_s: 41, jetons_entree: 1200, jetons_sortie: 300, appels_outils: 3, verdict_livrable: null, verdict_relecture: null,
  frictions: 0, cause_fin: "fini", projet: "digit-ai-factory", partielle: false, lacunes: [], ...plus });
let n = 0;
/** Un fichier de fiches jetable, désigné par FORGE_FICHES_AGENTS. */
const fichierDe = (lignes) => { const f = join(base, `fiches-${++n}.jsonl`); writeFileSync(f, lignes.map((l) => (typeof l === "string" ? l : JSON.stringify(l))).join("\n") + "\n", "utf8"); return f; };
const jouer = (args, { fichier = null, env = ENV, cwd = base } = {}) => {
  const e = { ...env }; if (fichier) e.FORGE_FICHES_AGENTS = fichier;
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", env: e, cwd });
  return { code: r.status, out: r.stdout || "", err: r.stderr || "" };
};
const lignesDe = (f) => readFileSync(f, "utf8").trim().split("\n").map((l) => JSON.parse(l));

try {
  check("vert — une relecture « sert » notée : une ligne d'événement liée à la fiche, signée de la session, les lignes d'avant intactes", () => {
    const f = fichierDe([fiche("a1"), fiche("a2")]);
    const avant = readFileSync(f, "utf8");
    const r = jouer(["--agent", "a1", "--verdict-relecture", "sert"], { fichier: f });
    att(r.code === 0 && /verdict noté sur la fiche de l'agent a1 \(relecture sert\)/.test(r.out), `exit ${r.code} : ${r.out}${r.err}`);
    const apres = readFileSync(f, "utf8");
    att(apres.startsWith(avant), "les lignes d'avant ont changé");
    const l = lignesDe(f);
    att(l.length === 3, `${l.length} lignes au lieu de 3`);
    const ev = l[2];
    att(ev.schema === SCHEMA_VERDICT && ev.agent_id === "a1" && ev.verdict_relecture === "sert" && ev.verdict_livrable === null, JSON.stringify(ev));
    att(ev.session === SESSION.slice(0, 8) && ev.session_source === "session_start", `signature ${ev.session} ${ev.session_source}`);
    att(Object.keys(ev).every((k) => ["schema", "ts", "agent_id", "verdict_livrable", "verdict_relecture", "session", "session_source"].includes(k)), `clé hors contrat : ${Object.keys(ev)}`);
    att(lireFiches(apres).verdicts.get("a1").verdict_relecture === "sert" && !lireFiches(apres).verdicts.has("a2"), "lecture du verdict");
  });
  check("rouge — le même verdict noté deux fois : la seconde fois n'écrit rien, « déjà noté », exit 0", () => {
    const f = fichierDe([fiche("b1")]);
    att(jouer(["--agent", "b1", "--verdict-livrable", "PASS"], { fichier: f }).code === 0, "premier appel");
    const avant = readFileSync(f, "utf8");
    const r = jouer(["--agent", "b1", "--verdict-livrable", "pass"], { fichier: f });
    att(r.code === 0 && /déjà noté/.test(r.out), `exit ${r.code} : ${r.out}${r.err}`);
    att(readFileSync(f, "utf8") === avant, "une seconde ligne a été écrite");
  });
  check("vert — une relecture « derive » relue « sert » après correction : deux événements, le dernier l'emporte, le remplacé est dit", () => {
    const f = fichierDe([fiche("c1")]);
    att(jouer(["--agent", "c1", "--verdict-relecture", "derive"], { fichier: f }).code === 0, "derive");
    const r = jouer(["--agent", "c1", "--verdict-relecture", "sert"], { fichier: f });
    att(r.code === 0 && /après relecture derive/.test(r.out), r.out + r.err);
    att(lignesDe(f).length === 3 && lireFiches(readFileSync(f, "utf8")).verdicts.get("c1").verdict_relecture === "sert", readFileSync(f, "utf8"));
  });
  check("vert — les deux verdicts en un appel tiennent sur une ligne ; une fiche partielle reçoit un verdict", () => {
    const f = fichierDe([fiche("d1", { partielle: true, lacunes: ["transcription vide"], cause_fin: null })]);
    const r = jouer(["--agent", "d1", "--verdict-livrable", "FAIL", "--verdict-relecture", "dérive", "--json"], { fichier: f });
    const j = JSON.parse(r.out);
    att(r.code === 0 && j.ecrit === true && j.ligne.verdict_livrable === "FAIL" && j.ligne.verdict_relecture === "derive", r.out + r.err);
    att(lignesDe(f).length === 2, `${lignesDe(f).length} lignes`);
  });
  check("rouge — un agent sans fiche rend 1 sans rien écrire ; un verdict seul (sans fiche) ne compte pas comme une fiche", () => {
    const f = fichierDe([fiche("e1"), { schema: SCHEMA_VERDICT, ts: "2026-11-15T09:01:00.000Z", agent_id: "e2", verdict_livrable: "PASS", verdict_relecture: null }]);
    const avant = readFileSync(f, "utf8");
    for (const id of ["inconnu", "e2"]) {
      const r = jouer(["--agent", id, "--verdict-relecture", "sert"], { fichier: f });
      att(r.code === 1 && new RegExp(`aucune fiche de l'agent ${id}`).test(r.err), `${id} : exit ${r.code} : ${r.out}${r.err}`);
    }
    att(readFileSync(f, "utf8") === avant, "le fichier a changé");
  });
  check("rouge — sans fichier de fiches : 1, et aucun fichier n'est créé", () => {
    const f = join(base, "absent", "fiches.jsonl");
    const r = jouer(["--agent", "f1", "--verdict-relecture", "sert"], { fichier: f });
    att(r.code === 1 && /aucun fichier de fiches/.test(r.err), `exit ${r.code} : ${r.err}`);
    att(!existsSync(f), "un fichier a été créé");
    const hors = noterFiche({ agent: "f1", verdictRelecture: "sert", env: { CLAUDE_PROJECT_DIR: join(base, "hors-projet-absent") }, cwd: base });
    att(hors.code === 1 && /hors du pilot et de tout produit/.test(hors.motif), JSON.stringify(hors));
  });
  check("rouge — sans --agent, sans verdict, verdict hors vocabulaire, identifiant mal formé, option inconnue : 2 sans rien écrire", () => {
    const f = fichierDe([fiche("g1")]);
    const avant = readFileSync(f, "utf8");
    const cas = [["--verdict-relecture", "sert"], ["--agent", "g1"], ["--agent", "g1", "--verdict-livrable", "OK"], ["--agent", "g1", "--verdict-relecture", "bien"],
      ["--agent", "../g1", "--verdict-relecture", "sert"], ["--agent", "g1", "--verdict-relecture", "sert", "--inconnue"], ["--agent", "--verdict-relecture", "sert"]];
    for (const a of cas) { const r = jouer(a, { fichier: f }); att(r.code === 2, `${a.join(" ")} : exit ${r.code} ${r.out}${r.err}`); }
    att(readFileSync(f, "utf8") === avant, "le fichier a changé");
  });
  check("vert — chez un produit : le verdict va à forge/fiches-agents.jsonl du projet, et la sortie ne cite pas le dossier du produit", () => {
    const produit = join(base, "produit-banc-zeta");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const f = join(produit, "forge", "fiches-agents.jsonl");
    writeFileSync(f, JSON.stringify(fiche("h1", { projet: "Produit-41" })) + "\n", "utf8");
    const r = jouer(["--agent", "h1", "--verdict-relecture", "sert"], { env: { ...ENV, CLAUDE_PROJECT_DIR: produit }, cwd: produit });
    att(r.code === 0 && /forge\/fiches-agents\.jsonl du projet/.test(r.out), `exit ${r.code} : ${r.out}${r.err}`);
    att(!/produit-banc-zeta/.test(r.out + r.err), `le dossier du produit est cité : ${r.out}`);
    att(lignesDe(f).length === 2 && lignesDe(f)[1].verdict_relecture === "sert", readFileSync(f, "utf8"));
  });
  check("vert — la lecture : dernière fiche d'un agent, fiche sans identifiant à part, ligne illisible et autre schéma comptés, verdict hors vocabulaire ignoré", () => {
    const t = [fiche("i1", { duree_s: 10 }), fiche("i1", { duree_s: 99 }), fiche(null), "pas du json", { schema: "pilot/autre@1", agent_id: "i1" },
      { schema: SCHEMA_VERDICT, agent_id: "i1", verdict_livrable: "PEUT-ETRE", verdict_relecture: "sert", ts: "2026-11-15T09:02:00.000Z" }].map((l) => (typeof l === "string" ? l : JSON.stringify(l))).join("\r\n");
    const l = lireFiches(t);
    att(l.fiches.size === 1 && l.fiches.get("i1").duree_s === 99, "la dernière fiche d'un agent ne fait pas foi");
    att(l.sansIdentifiant.length === 1 && l.illisibles === 1 && l.autres === 1, JSON.stringify({ sans: l.sansIdentifiant.length, ill: l.illisibles, autres: l.autres }));
    const v = l.verdicts.get("i1");
    att(v.verdict_livrable === null && v.verdict_relecture === "sert" && v.ts === "2026-11-15T09:02:00.000Z", JSON.stringify(v));
  });
  check("rouge — le banc n'a rien écrit au fichier des fiches du pilot", () => {
    att(etatDe(FICHES_DU_PILOT) === avantPilot, `${FICHES_DU_PILOT} : ${avantPilot} → ${etatDe(FICHES_DU_PILOT)}`);
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

console.log(`\nnoter-fiche : ${pass} PASS, ${fail} FAIL — cas rouges : verdict noté deux fois, agent sans fiche, fichier absent, usage invalide`);
process.exit(fail ? 1 : 0);
