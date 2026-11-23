#!/usr/bin/env node
/**
 * propager-skills-agents.mjs — recopie les skills installés de la Factory chez les agents tiers du
 * poste, Codex (`~/.codex/skills`) et Antigravity (`~/.gemini/config/skills`).
 *
 * POURQUOI (D-240 (b), décision humaine du 23/11/2026). Le 2e banc multi-agents a mesuré que Codex
 * et Antigravity, ouverts au pilot, ne chargent aucun des skills de la Factory : seulement les
 * leurs. Claude devait leur citer, ticket par ticket, le savoir-faire qu'un skill porte déjà. La
 * décision : leur en donner une copie, tenue à jour par `bootstrap.mjs --pull`.
 *
 * CE QUE LE SCRIPT GARANTIT
 * - Il n'écrit que dans le dossier de skills d'un agent INSTALLÉ (son dossier personnel existe) ;
 *   un poste sans Codex ni Antigravity n'est pas touché.
 * - Il ne remplace JAMAIS un skill qu'il n'a pas posé : chaque copie porte un témoin
 *   `.copie-factory.json` ; un dossier homonyme sans témoin est laissé et signalé.
 * - Il retire les copies dont la source a disparu (témoin présent, source absente).
 * - La comparaison se fait octet pour octet, sans empreinte : rien n'est haché.
 *
 * CE QU'IL NE GARANTIT PAS : qu'un skill copié marche chez l'agent. Les hooks de la Factory ne
 * tournent que dans Claude Code, et un skill qui appelle un outil propre à Claude (Agent, Skill)
 * se lit chez Codex comme une procédure, pas comme un appel.
 *
 * Usage : node scripts/propager-skills-agents.mjs [--verifier] [--source <dir>] [--cibles <d1,d2>]
 *   --verifier  n'écrit rien ; exit 1 si une copie manque, diverge ou survit à sa source
 *   --source    dossier des skills à recopier (défaut : skills installés de Claude Code)
 *   --cibles    dossiers de skills cibles, séparés par des virgules (défaut : Codex et Antigravity
 *               s'ils sont installés) — voie des recettes
 * Sortie : JSON {verdict, source, cibles:[{agent, dossier, copies, retires, epargnes, ecarts}]}
 * Exit : 0 aligné ou propagé · 1 écart en --verifier, ou erreur d'écriture · 2 rien à juger
 */
import { existsSync, readdirSync, readFileSync, statSync, mkdirSync, rmSync, cpSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { homedir } from "node:os";
import { skillsInstalles } from "./lib-config-installee.mjs";

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const verifier = args.includes("--verifier");
const TEMOIN = ".copie-factory.json";

const source = opt("--source") ? resolve(opt("--source")) : skillsInstalles().chemin;

function ciblesParDefaut() {
  const c = [];
  const codexHome = process.env.CODEX_HOME || join(homedir(), ".codex");
  if (existsSync(codexHome)) c.push({ agent: "codex", dossier: join(codexHome, "skills") });
  const gemini = join(homedir(), ".gemini");
  if (existsSync(join(gemini, "antigravity-cli"))) c.push({ agent: "antigravity", dossier: join(gemini, "config", "skills") });
  return c;
}
const cibles = opt("--cibles")
  ? opt("--cibles").split(",").filter(Boolean).map((d) => ({ agent: "cible", dossier: resolve(d) }))
  : ciblesParDefaut();

function sortie(verdict, detail, code) {
  process.stdout.write(JSON.stringify({ verdict, source, ...detail }, null, 1) + "\n");
  process.exit(code);
}

if (!source || !existsSync(source)) sortie("SKIP", { message: "dossier source des skills introuvable", cibles: [] }, 2);
if (!cibles.length) sortie("SKIP", { message: "ni Codex ni Antigravity installés sur ce poste", cibles: [] }, 2);

// Un skill de la Factory : un dossier qui porte SKILL.md, hors dossiers techniques.
const skills = readdirSync(source, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith(".") && e.name !== "synced" && existsSync(join(source, e.name, "SKILL.md")))
  .map((e) => e.name).sort();

// Liste relative de tous les fichiers d'un dossier, témoin exclu.
function fichiers(d, pre = "") {
  const r = [];
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (!pre && e.name === TEMOIN) continue;
    const rel = pre ? `${pre}/${e.name}` : e.name;
    if (e.isDirectory()) r.push(...fichiers(join(d, e.name), rel));
    else if (e.isFile()) r.push(rel);
  }
  return r.sort();
}
function identiques(a, b) {
  if (!existsSync(b)) return false;
  const fa = fichiers(a), fb = fichiers(b);
  if (fa.length !== fb.length || fa.some((x, i) => x !== fb[i])) return false;
  return fa.every((x) => {
    const pa = join(a, x), pb = join(b, x);
    if (statSync(pa).size !== statSync(pb).size) return false;
    return readFileSync(pa).equals(readFileSync(pb));
  });
}

let ecartsTotal = 0;
const rapport = [];
for (const c of cibles) {
  const r = { agent: c.agent, dossier: c.dossier, copies: [], retires: [], epargnes: [], ecarts: [] };
  if (!verifier) mkdirSync(c.dossier, { recursive: true });
  for (const s of skills) {
    const dst = join(c.dossier, s);
    const temoin = join(dst, TEMOIN);
    if (existsSync(dst) && !existsSync(temoin)) { r.epargnes.push(s); continue; }
    if (identiques(join(source, s), dst)) continue;
    if (verifier) { r.ecarts.push(`${s} : copie absente ou divergente`); continue; }
    rmSync(dst, { recursive: true, force: true });
    cpSync(join(source, s), dst, { recursive: true });
    writeFileSync(temoin, JSON.stringify({ source: join(source, s), copie_le: new Date().toISOString(), par: "scripts/propager-skills-agents.mjs", decision: "D-240 (b)" }, null, 1) + "\n");
    r.copies.push(s);
  }
  if (existsSync(c.dossier)) {
    for (const e of readdirSync(c.dossier, { withFileTypes: true })) {
      if (!e.isDirectory() || skills.includes(e.name)) continue;
      if (!existsSync(join(c.dossier, e.name, TEMOIN))) continue;
      if (verifier) { r.ecarts.push(`${e.name} : copie orpheline, sa source a disparu`); continue; }
      rmSync(join(c.dossier, e.name), { recursive: true, force: true });
      r.retires.push(e.name);
    }
  }
  ecartsTotal += r.ecarts.length;
  rapport.push(r);
}

const verdict = verifier ? (ecartsTotal ? "FAIL" : "PASS") : "PASS";
sortie(verdict, { skills: skills.length, mode: verifier ? "verifier" : "appliquer", cibles: rapport }, verdict === "FAIL" ? 1 : 0);
