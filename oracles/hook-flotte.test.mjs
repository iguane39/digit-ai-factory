#!/usr/bin/env node
/**
 * hook-flotte.test.mjs — une délégation vise un agent de la flotte, ou dit sa dérogation (D-19 (a), 18/10/2026).
 * Sens rouge (avertit, exit 0, rappel dans `additionalContext`) : la forme mesurée le 18/10 (agent générique
 * sans modèle ni effort), un appel sans type, `Explore` sans modèle, un générique avec modèle mais sans effort,
 * et l'ancien nom d'outil `Task`. Sens vert (silence, exit 0) : un agent nommé du projet, un générique qui
 * déclare modèle ET effort, un agent intégré à modèle fixe, un autre outil, une entrée illisible.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-flotte.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

// Un projet jetable qui porte deux agents nommés, et un « poste » vide : le hook ne lit pas le vrai poste.
const racine = mkdtempSync(join(tmpdir(), "hook-flotte-"));
const projet = join(racine, "projet"), maison = join(racine, "maison");
mkdirSync(join(projet, ".claude", "agents"), { recursive: true });
mkdirSync(maison, { recursive: true });
for (const n of ["campagne", "explorateur"]) writeFileSync(join(projet, ".claude", "agents", `${n}.md`), `---\nname: ${n}\n---\n`);

const jouer = (entree) => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: typeof entree === "string" ? entree : JSON.stringify(entree),
    env: { ...process.env, USERPROFILE: maison, HOME: maison } });
  let ctx = "";
  try { ctx = JSON.parse(r.stdout || "{}").hookSpecificOutput?.additionalContext || ""; } catch { ctx = "<stdout illisible>"; }
  return { code: r.status, ctx, out: r.stdout || "" };
};
const appel = (tool_input, tool_name = "Agent") => ({ tool_name, tool_input: { prompt: "x", description: "y", ...tool_input }, cwd: projet });

const ROUGES = [
  [{ subagent_type: "general-purpose" }, "la forme mesurée le 18/10 : générique sans modèle ni effort", /le modèle .* et l'effort/],
  [{}, "aucun type d'agent", /aucun type/],
  [{ subagent_type: "Explore" }, "Explore natif sans modèle : il prend celui de la session", /Explore/],
  [{ subagent_type: "claude" }, "l'agent « claude », générique du harnais (relevé le 18/10)", /« claude »/],
  [{ subagent_type: "general-purpose", model: "sonnet" }, "modèle déclaré mais pas l'effort", /sans l'effort/],
];
for (const [ti, nom, motif] of ROUGES) {
  check(`rouge — ${nom} : avertit sans bloquer`, () => {
    const r = jouer(appel(ti));
    if (r.code !== 0) throw new Error(`exit ${r.code} : un avertissement ne bloque jamais`);
    if (!/FLOTTE D'AGENTS \(D-19 \(a\)/.test(r.ctx)) throw new Error(`aucun rappel : ${r.out.slice(0, 160)}`);
    if (!motif.test(r.ctx)) throw new Error(`le manque n'est pas nommé : ${r.ctx.slice(0, 200)}`);
    if (!/campagne, explorateur/.test(r.ctx)) throw new Error("la flotte du projet n'est pas listée");
  });
}
check("rouge — l'ancien nom d'outil Task est jugé comme Agent", () => {
  const r = jouer(appel({ subagent_type: "general-purpose" }, "Task"));
  if (!/FLOTTE D'AGENTS/.test(r.ctx)) throw new Error("Task passe sans rappel");
});
check("rouge — sans agent nommé visible, le rappel le dit au lieu d'inventer une flotte", () => {
  const vide = join(racine, "vide"); mkdirSync(vide, { recursive: true });
  const r = jouer({ tool_name: "Agent", tool_input: { subagent_type: "general-purpose" }, cwd: vide });
  if (!/Aucun agent nommé n'est visible ici/.test(r.ctx)) throw new Error(r.ctx.slice(0, 200));
});

const VERTS = [
  [appel({ subagent_type: "campagne" }), "un agent nommé du projet"],
  [appel({ subagent_type: "general-purpose", model: "sonnet", effort: "medium" }), "un générique qui déclare modèle ET effort (dérogation dite)"],
  [appel({ subagent_type: "claude-code-guide" }), "un agent intégré à modèle fixe"],
  [{ tool_name: "Bash", tool_input: { command: "ls" }, cwd: projet }, "un autre outil"],
  ["{pas du json", "une entrée illisible"],
];
for (const [entree, nom] of VERTS) {
  check(`vert — ${nom} : silence, exit 0`, () => {
    const r = jouer(entree);
    if (r.code !== 0 || r.out.trim()) throw new Error(`exit ${r.code}, sortie « ${r.out.slice(0, 120)} »`);
  });
}

rmSync(racine, { recursive: true, force: true });
console.log(`\nhook-flotte : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
