#!/usr/bin/env node
/**
 * hook-remisage.test.mjs — la pile de remisage partagée gardée par l'outil qui la touche (TF-1754).
 * Sens rouge : la forme exacte du 15/10/2026 (`git stash` nu en fin de commande composée), `pop`,
 * `stash -u` sans message, `push` sans `-m`, `apply` sans référence ou par position, `drop` nu,
 * `clear`, sous Bash et sous PowerShell, y compris derrière `git -C <dossier>`. Sens vert : les formes
 * que le refus propose (`push -u -m`, `apply <sha>`, `list`), `drop <référence>`, une commande sans
 * remisage, un mot « stash » hors de git, et un outil qui n'est pas une commande.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-remisage.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const jouer = (tool_name, command) => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ tool_name, tool_input: { command } }) });
  return { code: r.status, err: r.stderr || "" };
};

const ROUGES = [
  ["Bash", "git add todo/TODO.jsonl && git stash", "la forme du 15/10 : stash nu en fin de commande composée"],
  ["Bash", "git stash pop", "pop"],
  ["Bash", "git stash -u", "stash -u sans message"],
  ["Bash", "git stash push -u", "push sans -m"],
  ["Bash", "git stash save wip", "save"],
  ["Bash", "git stash apply", "apply sans référence"],
  ["Bash", "git stash apply stash@{0}", "apply par position de pile"],
  ["Bash", "git stash drop", "drop nu"],
  ["Bash", "git stash clear", "clear"],
  ["Bash", "git -C ../produit stash", "stash nu derrière -C"],
  ["PowerShell", "git status; git stash", "stash nu sous PowerShell"],
];
for (const [outil, cmd, nom] of ROUGES) {
  check(`rouge — ${nom} : refusé (exit 2, TF-1754 nommé)`, () => {
    const r = jouer(outil, cmd);
    if (r.code !== 2 || !/REMISAGE REFUSÉ \(TF-1754\)/.test(r.err)) throw new Error(`exit ${r.code} : ${r.err.slice(0, 160)}`);
  });
}

const VERTS = [
  ["Bash", 'git stash push -u -m "registre avant rebase"', "push -u -m étiquette"],
  ["Bash", "git stash -m etiquette", "stash -m étiquette"],
  ["Bash", "git stash apply a75a6249", "apply <sha>"],
  ["Bash", 'git stash list --format="%h %gs"', "list"],
  ["Bash", "git stash show -p a75a6249", "show"],
  ["Bash", "git stash drop stash@{2}", "drop <référence>"],
  ["Bash", "git status && git log -1", "sans remisage"],
  ["Bash", "grep -rn stash docs/", "le mot hors de git"],
  ["Write", "git stash", "outil qui n'est pas une commande"],
];
for (const [outil, cmd, nom] of VERTS) {
  check(`vert — ${nom} : laisse passer`, () => {
    const r = jouer(outil, cmd);
    if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.err.slice(0, 160)}`);
  });
}

console.log(`\nhook-remisage : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
