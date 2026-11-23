#!/usr/bin/env node
/**
 * propager-skills-agents.test.mjs — la copie des skills de la Factory chez Codex et Antigravity
 * (D-240 (b), 23/11/2026), dans les deux sens.
 *   VERT  : une cible vide reçoit chaque skill avec son témoin ; un second passage ne recopie rien ;
 *           --verifier rend PASS sur une cible alignée ;
 *   ROUGE : une copie modifiée est vue en --verifier (exit 1) puis réalignée ; un skill homonyme posé
 *           par l'agent lui-même (sans témoin) n'est jamais remplacé ; une copie dont la source a
 *           disparu est retirée, et seulement si elle porte le témoin ;
 *   BORNES : un dossier sans SKILL.md et le dossier `synced` ne sont pas recopiés ; sans cible, SKIP exit 2.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "propager-skills-agents.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const ok = (c, m) => { if (!c) throw new Error(m); };

const T = mkdtempSync(join(tmpdir(), "propager-skills-"));
const SRC = join(T, "src"), C1 = join(T, "codex"), C2 = join(T, "agy");
const poser = (d, f, t) => { mkdirSync(dirname(join(d, f)), { recursive: true }); writeFileSync(join(d, f), t); };
poser(SRC, "alpha/SKILL.md", "alpha");
poser(SRC, "alpha/references/a.md", "ref");
poser(SRC, "beta/SKILL.md", "beta");
poser(SRC, "sans-skill/README.md", "x");
poser(SRC, "synced/x/SKILL.md", "x");
poser(C1, "beta/SKILL.md", "beta propre a l'agent");

const jouer = (...a) => {
  const r = spawnSync(process.execPath, [SCRIPT, "--source", SRC, "--cibles", `${C1},${C2}`, ...a], { encoding: "utf8" });
  return { code: r.status, j: JSON.parse(r.stdout || "{}") };
};

check("VERT : premier passage, alpha copié avec témoin dans les 2 cibles", () => {
  const r = jouer();
  ok(r.code === 0, `exit ${r.code}`);
  ok(readFileSync(join(C2, "alpha/references/a.md"), "utf8") === "ref", "sous-dossier non copié");
  ok(existsSync(join(C1, "alpha/.copie-factory.json")), "témoin absent");
  ok(r.j.skills === 2, `skills=${r.j.skills}`);
});
check("ROUGE : beta posé par l'agent sans témoin n'est jamais remplacé", () => {
  ok(readFileSync(join(C1, "beta/SKILL.md"), "utf8") === "beta propre a l'agent", "beta écrasé");
  ok(jouer().j.cibles[0].epargnes.includes("beta"), "beta non signalé comme épargné");
});
check("BORNES : ni sans-skill ni synced recopiés", () => {
  ok(!existsSync(join(C2, "sans-skill")) && !existsSync(join(C2, "synced")), "dossier technique recopié");
});
check("VERT : second passage, rien recopié ; --verifier PASS", () => {
  const r = jouer();
  ok(r.j.cibles.every((c) => c.copies.length === 0), "recopie inutile");
  const v = jouer("--verifier");
  ok(v.code === 0 && v.j.verdict === "PASS", `verifier ${v.code} ${v.j.verdict}`);
});
check("ROUGE : copie modifiée vue en --verifier puis réalignée", () => {
  writeFileSync(join(C2, "alpha/SKILL.md"), "alpha modifié");
  const v = jouer("--verifier");
  ok(v.code === 1 && v.j.verdict === "FAIL", `verifier ${v.code}`);
  jouer();
  ok(readFileSync(join(C2, "alpha/SKILL.md"), "utf8") === "alpha", "non réaligné");
});
check("ROUGE : source disparue, copie témoin retirée, homonyme sans témoin gardé", () => {
  rmSync(join(SRC, "alpha"), { recursive: true });
  poser(C2, "gamma/SKILL.md", "skill propre sans témoin");
  const r = jouer();
  ok(!existsSync(join(C1, "alpha")) && !existsSync(join(C2, "alpha")), "orpheline non retirée");
  ok(existsSync(join(C2, "gamma/SKILL.md")), "skill de l'agent retiré");
  ok(r.j.cibles[1].retires.includes("alpha"), "retrait non rapporté");
});
check("BORNES : sans cible installée, SKIP exit 2", () => {
  const r = spawnSync(process.execPath, [SCRIPT, "--source", join(T, "absent")], { encoding: "utf8" });
  ok(r.status === 2, `exit ${r.status}`);
});

rmSync(T, { recursive: true, force: true });
console.log(`propager-skills-agents : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
