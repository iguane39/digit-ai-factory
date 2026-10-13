#!/usr/bin/env node
/**
 * hook-puits-windows.test.mjs — une redirection vers /dev/null ne se joue pas dans PowerShell (TF-1584).
 * Deux sens : le hook REFUSE les formes qui créent un fichier « null » (exit 2, remède `$null` nommé) et
 * LAISSE PASSER ce qui n'en crée pas ; le remède qu'il propose (`$null`) est JOUÉ et doit passer.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-puits-windows.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const jouer = (commande, outil = "PowerShell") => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify({ tool_name: outil, tool_input: { command: commande } }) });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
};

check("rouge — `> /dev/null`, `2>/dev/null`, `>> /dev/null`, `*> /dev/null` : refusés, remède `$null` nommé", () => {
  for (const c of ["git status > /dev/null", "git fetch 2>/dev/null", "ls >> /dev/null", "Get-Item x *> /dev/null", "foo 1>/dev/null; bar"]) {
    const r = jouer(c);
    if (r.code !== 2 || !/\$null/.test(r.out) || !/TF-1584/.test(r.out)) throw new Error(`${c} : exit ${r.code} — ${r.out}`);
  }
});
check("rouge — `Out-File`, `Tee-Object`, `Set-Content`, `Add-Content` vers /dev/null : refusés", () => {
  for (const c of ["git log | Out-File /dev/null", "x | Out-File -FilePath /dev/null -Append", "x | Tee-Object /dev/null", "Set-Content -Path /dev/null -Value a", "Add-Content /dev/null a"]) {
    const r = jouer(c);
    if (r.code !== 2) throw new Error(`${c} : exit ${r.code} attendu 2`);
  }
});
check("rouge — le nom préfixé d'un connecteur (mcp__x__PowerShell) est jugé comme l'outil", () => {
  if (jouer("a > /dev/null", "mcp__x__PowerShell").code !== 2) throw new Error("préfixe non reconnu");
});
check("vert — le remède proposé (`$null`, `Out-Null`) passe", () => {
  for (const c of ["git status > $null", "git fetch 2> $null", "git status | Out-Null", "x *> $null"]) {
    const r = jouer(c);
    if (r.code !== 0) throw new Error(`${c} : exit ${r.code} — ${r.out}`);
  }
});
check("vert — citer `> /dev/null` dans une chaîne ou un here-string n'est pas le jouer", () => {
  for (const c of [
    "git commit -m \"la redirection > /dev/null crée un fichier\"",
    "Write-Host 'utiliser 2>/dev/null est interdit'",
    "git commit -m @'\nmessage citant 2>/dev/null\n'@",
  ]) {
    const r = jouer(c);
    if (r.code !== 0) throw new Error(`${c} : exit ${r.code} attendu 0 — ${r.out}`);
  }
});
check("vert — un chemin qui CONTIENT /dev/null sans en être la cible n'est pas refusé", () => {
  for (const c of ["Get-Content ./x/dev/null-notes.txt", "git status > sortie.txt"]) {
    if (jouer(c).code !== 0) throw new Error(`${c} refusé à tort`);
  }
});
check("vert — l'outil Bash n'est pas concerné : /dev/null y est un vrai puits", () => {
  if (jouer("git status > /dev/null 2>&1", "Bash").code !== 0) throw new Error("Bash refusé à tort");
});
check("vert — entrée vide ou illisible : on laisse passer (pas un appel d'outil)", () => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: "pas du json" });
  if (r.status !== 0) throw new Error(`exit ${r.status}`);
});
console.log(`\nhook-puits-windows (TF-1584) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
