#!/usr/bin/env node
/**
 * sessions-par-transcriptions.test.mjs — le repli de `ListAgents` en session `claude -p` (TF-2735, 22/11/2026).
 *
 * Un « poste » jetable (HOME et USERPROFILE d'un dossier de la recette) porte deux profils et trois projets, des transcriptions dont l'âge est posé. Sens vert : seules les sessions
 * écrites depuis moins de 15 minutes sont comptées, la vie d'un sous-agent fait vivre sa session, `--projet` restreint au projet du dossier de travail, `--fenetre-min` change la
 * fenêtre. Sens rouge : une transcription de 16 minutes n'est pas comptée ; la sortie DIT que le compte est une inférence qui n'est pas celui de ListAgents (l'affirmation du
 * constat) ; une option inconnue est refusée (exit 2) ; un poste sans profil rend zéro, pas une erreur. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "sessions-par-transcriptions.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const maison = mkdtempSync(join(tmpdir(), "sessions-transcriptions-"));
const posee = (chemin, ageMin) => { mkdirSync(join(chemin, ".."), { recursive: true }); writeFileSync(chemin, "{}\n"); const t = (Date.now() - ageMin * 60000) / 1000; utimesSync(chemin, t, t); };
const projetA = "C--dev-projet-a", projetB = "C--dev-projet-b";
posee(join(maison, ".claude", "projects", projetA, "aaaaaaaa-1111.jsonl"), 3);            // vivante
posee(join(maison, ".claude", "projects", projetA, "bbbbbbbb-2222.jsonl"), 16);           // silencieuse : 16 min
posee(join(maison, ".claude-b", "projects", projetA, "cccccccc-3333.jsonl"), 1);          // vivante, autre profil
posee(join(maison, ".claude", "projects", projetB, "dddddddd-4444.jsonl"), 40);           // ancienne, mais son sous-agent écrit
posee(join(maison, ".claude", "projects", projetB, "dddddddd-4444", "subagents", "agent-x.jsonl"), 5);
posee(join(maison, ".claude", "projects", projetB, "eeeeeeee-5555.jsonl"), 600);          // très ancienne
const lancer = (...args) => { const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", env: { ...process.env, HOME: maison, USERPROFILE: maison, CLAUDE_CONFIG_DIR: "" } }); return { code: r.status, out: r.stdout || "", err: r.stderr || "" }; };

try {
  check("vert — seules les sessions écrites depuis moins de 15 minutes sont vivantes : 3 sur 5 lues (deux profils, la vie d'un sous-agent compte)", () => {
    const j = JSON.parse(lancer("--json").out);
    att(j.vivantes === 3 && j.sessions_lues === 5 && j.fenetre_min === 15, JSON.stringify({ v: j.vivantes, l: j.sessions_lues }));
    const ids = j.sessions.map((s) => s.court).sort();
    att(ids.join() === "aaaaaaaa,cccccccc,dddddddd", ids.join());
  });
  check("rouge — une transcription de 16 minutes et une de 600 minutes ne sont pas comptées", () => {
    const t = lancer().out;
    att(!t.includes("bbbbbbbb") && !t.includes("eeeeeeee") && /3 session\(s\) vivante\(s\) sur 5 lue\(s\)/.test(t), t);
  });
  check("rouge — la sortie dit que le compte est une inférence, que ce n'est pas celui de ListAgents, et ce qu'il ne voit pas (TF-2735)", () => {
    const t = lancer().out;
    att(/inférence/.test(t) && /ce n'est pas le compte de ListAgents/.test(t) && /session d'un autre poste ne sont pas comptées/.test(t), t);
  });
  check("vert — --projet restreint au projet du dossier de travail (nom dérivé du chemin) ; --fenetre-min élargit la fenêtre à 20 minutes", () => {
    const sans = JSON.parse(lancer("--projet", "C:\\dev\\inconnu", "--json").out);
    att(sans.vivantes === 0 && sans.projets_lus === 0, JSON.stringify(sans));
    const large = JSON.parse(lancer("--fenetre-min", "20", "--json").out);
    att(large.vivantes === 4 && large.fenetre_min === 20, `fenêtre de 20 min : ${large.vivantes}`);
    const etroite = JSON.parse(lancer("--fenetre-min", "4", "--json").out);
    att(etroite.vivantes === 2, `fenêtre de 4 min : ${etroite.vivantes}`);
  });
  check("rouge — option inconnue ou valeur invalide : exit 2 ; un poste sans profil rend zéro (exit 0), pas une erreur", () => {
    att(lancer("--tout").code === 2 && lancer("--fenetre-min", "x").code === 2 && lancer("--projet").code === 2, "un usage faux est accepté");
    const vide = mkdtempSync(join(tmpdir(), "sessions-transcriptions-vide-"));
    try {
      const r = spawnSync(process.execPath, [SCRIPT], { encoding: "utf8", env: { ...process.env, HOME: vide, USERPROFILE: vide, CLAUDE_CONFIG_DIR: "" } });
      att(r.status === 0 && /^0 session\(s\) vivante\(s\) sur 0 lue\(s\)/.test(r.stdout), `exit ${r.status} : ${r.stdout}${r.stderr}`);
    } finally { rmSync(vide, { recursive: true, force: true }); }
  });
} finally { rmSync(maison, { recursive: true, force: true }); }

console.log(`\nsessions-par-transcriptions (TF-2735) : ${pass} PASS, ${fail} FAIL — cas rouges : transcription de 16 min non comptée, inférence dite, usage faux`);
process.exit(fail ? 1 : 0);
