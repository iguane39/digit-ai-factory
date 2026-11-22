#!/usr/bin/env node
/**
 * hook-gardes-commande.test.mjs — deux gestes de commande refusés : le relevé non filtré de l'environnement (TF-2721) et l'arrêt d'un processus par motif (TF-2689).
 *
 * Sens rouge : chaque forme que le hook déclare refuser (liste de ses en-têtes) est refusée, avec le motif qui nomme le geste ; sens vert : chaque forme proche
 * qu'il déclare laisser passer passe (lire UNE variable ordinaire, `env A=1 cmd`, `set -e`, `taskkill /PID 12`, `Stop-Process -Id 12`, `kill 12`). Le remède est JOUÉ
 * (TF-1013) : les commandes que le motif de refus propose passent le hook, et le script d'environnement ne rend aucune valeur de jeton. Entrées illisibles, outils
 * étrangers, commande vide : silence. Aucun processus réel n'est arrêté ici : le hook décide sur le texte. Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fautesArretParMotif, fautesEnvironnement, juger, sansHeredoc, SCRIPT_ENV, SCRIPT_PROCESSUS } from "./hook-gardes-commande.mjs";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-gardes-commande.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

// ---- TF-2721 : l'environnement ----
const ENV_ROUGES = [
  ["env", "`env` seul"], ["env | sort", "`env` dans un tuyau"], ["printenv", "`printenv` seul"], ["printenv | grep -i claude", "`printenv` filtré par grep (la sortie a déjà tout lu)"],
  ["set", "`set` seul"], ["export -p", "`export -p`"], ["export", "`export` seul"], ["declare -x", "`declare -x`"], ["declare -p", "`declare -p`"],
  ["cat /proc/self/environ | tr '\\0' '\\n'", "/proc/self/environ"], ["Get-ChildItem env:", "Get-ChildItem env:"], ["gci Env:\\", "gci Env:\\"], ["ls env:*", "ls env:*"], ["dir env:", "dir env:"],
  ["Get-Item env:*", "Get-Item env:*"], ["Get-ChildItem -Path env:", "Get-ChildItem -Path env:"], ["[Environment]::GetEnvironmentVariables()", "GetEnvironmentVariables()"],
  ["[System.Environment]::GetEnvironmentVariables() | Format-List", "System.Environment GetEnvironmentVariables"],
  ["node -e \"console.log(process.env)\"", "node -e qui imprime process.env"], ["node -p \"JSON.stringify(process.env)\"", "node -p JSON.stringify(process.env)"],
  ["node -e \"for (const [k,v] of Object.entries(process.env)) console.log(k, v)\"", "node -e Object.entries(process.env)"], ["python -c \"import os; print(os.environ)\"", "python -c print(os.environ)"],
  ["python3 -c \"import os; print(dict(os.environ))\"", "python3 dict(os.environ)"],
  ["printenv CLAUDE_CODE_MESSAGING_TOKEN", "printenv d'une variable de jeton"], ["echo $GITHUB_TOKEN", "echo $GITHUB_TOKEN"], ["echo \"clé : ${ANTHROPIC_API_KEY}\"", "echo ${ANTHROPIC_API_KEY}"],
  ["Write-Host $env:CLAUDE_CODE_MESSAGING_TOKEN", "Write-Host $env:…TOKEN"], ["Get-Item env:MA_PASSWORD", "Get-Item env:MA_PASSWORD"],
  ["bash -c 'env | grep TOKEN'", "env sous bash -c"], ["cmd /c set", "cmd /c set"], ["powershell -Command \"Get-ChildItem env:\"", "powershell -Command"], ["echo $(printenv)", "printenv dans $( )"],
];
for (const [commande, nom] of ENV_ROUGES) {
  check(`rouge (TF-2721) — ${nom} : refusé`, () => {
    const f = fautesEnvironnement(commande);
    att(f.length > 0, `aucune faute pour « ${commande} »`);
    const v = juger({ tool_name: commande.startsWith("Get-") || commande.startsWith("Write-") || /^(?:gci|ls|dir|\[)/.test(commande) ? "PowerShell" : "Bash", tool_input: { command: commande } });
    att(v.decision === "refuse" && /RELEVÉ DE L'ENVIRONNEMENT REFUSÉ \(TF-2721\)/.test(v.motif) && /env-session\.mjs/.test(v.motif), `pas de refus motivé : ${JSON.stringify(v).slice(0, 200)}`);
  });
}
const ENV_VERTS = [
  "printenv FORGE_ROOT", "printenv HOME PATH", "echo $FORGE_ROOT", "echo $env:FORGE_ROOT", "Write-Host $env:USERNAME", "env FORGE_ROOT=C:/dev node x.mjs", "env -i PATH=/usr/bin ls", "set -e", "set -euo pipefail", "export FORGE_ROOT=C:/dev",
  "declare -x FORGE_ROOT=C:/dev", "Get-ChildItem env:FORGE_ROOT", "(Get-Item env:FORGE_ROOT).Value", "gci .", "ls -la", "dir C:\\dev", "node -e \"console.log(process.env.FORGE_ROOT)\"", "node -e \"spawn('x', [], { env: { ...process.env, A: '1' } })\"",
  "python -c \"import os; print(os.environ['FORGE_ROOT'])\"", "python -c \"import os; print(os.environ.get('HOME'))\"", "echo $GIT_AUTHOR_NAME", "git log --format=%an", "cat README.md", "echo \"pas de jeton ici\"",
  `node ${SCRIPT_ENV}`, `node ${SCRIPT_ENV} --noms`, `node ${SCRIPT_ENV} --presente ANTHROPIC_API_KEY`, `node ${SCRIPT_ENV} --var FORGE_ROOT`,
];
for (const commande of ENV_VERTS) check(`vert (TF-2721) — « ${commande.slice(0, 70)} » : laisse passer`, () => { const f = fautesEnvironnement(commande); att(f.length === 0, `faux refus : ${f.join(" ; ")}`); });

// ---- TF-2689 : l'arrêt d'un processus ----
const ARRET_ROUGES = [
  ["taskkill /IM node.exe /F", "taskkill /IM"], ["taskkill /F /FI \"IMAGENAME eq node.exe\"", "taskkill /FI"], ["taskkill /F /IM node.exe /T", "taskkill /IM /T"],
  ["Stop-Process -Name node -Force", "Stop-Process -Name"], ["Stop-Process node", "Stop-Process <nom>"], ["spps -Name node", "spps -Name"], ["Get-Process node | Stop-Process", "Get-Process | Stop-Process"],
  ["Get-Process -Name node | Where-Object { $_.CommandLine -match 'self-test' } | Stop-Process -Force", "filtre sur la ligne de commande"],
  ["Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*self-test.mjs*' } | ForEach-Object { Stop-Process -Id $_.ProcessId }", "CIM filtré par la ligne de commande puis Stop-Process"],
  ["Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | ForEach-Object { $_.Terminate() }", "Terminate() sur une sélection"], ["wmic process where \"commandline like '%self-test%'\" delete", "wmic process where … delete"],
  ["Stop-Process -Id (Get-Process node).Id", "Stop-Process -Id (Get-Process …)"], ["pkill -f self-test", "pkill -f"], ["killall node", "killall"], ["kill $(pgrep -f self-test)", "kill $(pgrep …)"], ["kill -9 $(ps aux | grep self-test | awk '{print $2}')", "kill $(ps … | grep …)"],
  ["pgrep -f self-test | xargs kill", "pgrep | xargs kill"], ["ps aux | grep node | awk '{print $2}' | xargs -r kill -9", "ps | grep | xargs kill"], ["bash -c 'pkill -f self-test'", "pkill sous bash -c"], ["cmd /c taskkill /IM node.exe /F", "taskkill sous cmd /c"],
  ["powershell -Command \"Stop-Process -Name node\"", "Stop-Process -Name sous powershell -Command"],
];
for (const [commande, nom] of ARRET_ROUGES) {
  check(`rouge (TF-2689) — ${nom} : refusé`, () => {
    const f = fautesArretParMotif(commande);
    att(f.length > 0, `aucune faute pour « ${commande} »`);
    const v = juger({ tool_name: "Bash", tool_input: { command: commande } });
    att(v.decision === "refuse" && /ARRÊT DE PROCESSUS PAR MOTIF REFUSÉ \(TF-2689\)/.test(v.motif) && /processus-par-pid\.mjs/.test(v.motif) && /PID noté/.test(v.motif), `pas de refus motivé : ${JSON.stringify(v).slice(0, 200)}`);
  });
}
const ARRET_VERTS = [
  "taskkill /PID 6972 /T /F", "taskkill /F /PID 6972", "Stop-Process -Id 6972", "Stop-Process -Id 6972 -Force", "Stop-Process 6972", "Stop-Process -Id $pidNote", "spps -Id 6972", "kill 6972", "kill -9 6972", "kill -TERM $PID_NOTE", "kill %1",
  "Get-Content pid.txt | Stop-Process", "echo 6972 | kill", "Get-Process -Id 6972", "Get-Process node", "ps aux | grep node", "pgrep -f self-test", "tasklist /FI \"PID eq 6972\"", "git commit -m \"ne plus faire pkill -f ni taskkill /IM\"",
  "echo \"killall est refusé\"", "grep -rn \"Stop-Process -Name\" oracles/", `node ${SCRIPT_PROCESSUS} arreter --pid 6972 --arbre`, `node ${SCRIPT_PROCESSUS} verifier --fichier-pid pid.json`,
];
for (const commande of ARRET_VERTS) check(`vert (TF-2689) — « ${commande.slice(0, 70)} » : laisse passer`, () => { const f = fautesArretParMotif(commande); att(f.length === 0, `faux refus : ${f.join(" ; ")}`); });

check("vert — le corps d'un document ici (message de commit, fichier écrit par cat) n'est pas une suite de commandes : ses lignes ne sont pas jugées ; la ligne qui l'ouvre l'est encore", () => {
  const msg = "git commit -F - <<'EOF'\nUn correctif.\npkill -f self-test\nprintenv\nenv\nTaskkill /IM node.exe\nEOF";
  att(fautesArretParMotif(msg).length === 0 && fautesEnvironnement(msg).length === 0, `faux refus : ${[...fautesArretParMotif(msg), ...fautesEnvironnement(msg)].join(" ; ")}`);
  att(juger({ tool_name: "Bash", tool_input: { command: msg } }).decision === "laisse", "le hook refuse un message de commit");
  att(fautesEnvironnement("cat <<EOF > notes.txt\nligne\nEOF\nprintenv").length === 1, "une commande APRÈS le document ici n'est plus jugée");
  att(fautesArretParMotif("pkill -f x <<EOF\nrien\nEOF").length === 1, "la ligne qui ouvre le document n'est plus jugée");
  att(sansHeredoc("a <<-'FIN'\nx\n\tFIN\nb") === "a <<-'FIN'\nb", `sansHeredoc : ${JSON.stringify(sansHeredoc("a <<-'FIN'\nx\n\tFIN\nb"))}`);
});
check("remède joué (TF-1013) — les commandes que les deux motifs de refus proposent passent le hook, bouclée sur le texte du motif", () => {
  const refus = juger({ tool_name: "Bash", tool_input: { command: "env | grep TOKEN; taskkill /IM node.exe /F" } });
  att(refus.decision === "refuse" && /RELEVÉ/.test(refus.motif) && /ARRÊT/.test(refus.motif), "un refus double est attendu");
  for (const m of refus.motif.matchAll(/`(node [^`]+)`/g)) {
    const cmd = m[1].replace(/<[^>]+>/g, "123");
    att(juger({ tool_name: "Bash", tool_input: { command: cmd } }).decision === "laisse", `le remède « ${cmd} » est refusé`);
  }
});
check("câblage — le hook est au PreToolUse de `.claude/settings.json` du pilot, sur Bash ET PowerShell (une affordance câblée ou inexistante)", () => {
  const reglages = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", ".claude", "settings.json"), "utf8"));
  const groupe = (reglages.hooks?.PreToolUse || []).find((g) => (g.hooks || []).some((h) => /hook-gardes-commande\.mjs/.test(h.command || "")));
  att(groupe, "hook-gardes-commande.mjs n'est câblé à aucun PreToolUse");
  att(/\bBash\b/.test(groupe.matcher) && /\bPowerShell\b/.test(groupe.matcher), `le matcher « ${groupe.matcher} » ne couvre pas Bash et PowerShell`);
});
check("hook en ligne de commande : exit 2 et motif sur stderr au refus, exit 0 muet pour une commande permise, un outil étranger, une entrée illisible ou vide", () => {
  const jouer = (stdin) => spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: stdin });
  const r = jouer(JSON.stringify({ tool_name: "PowerShell", tool_input: { command: "Get-ChildItem env:" } }));
  att(r.status === 2 && /TF-2721/.test(r.stderr), `refus : exit ${r.status} ${r.stderr.slice(0, 120)}`);
  for (const ok of [JSON.stringify({ tool_name: "Bash", tool_input: { command: "printenv FORGE_ROOT" } }), JSON.stringify({ tool_name: "Read", tool_input: { file_path: "x" } }), "{pas du json", "", JSON.stringify({ tool_name: "Bash", tool_input: { command: "   " } })]) {
    const s = jouer(ok); att(s.status === 0 && !s.stdout.trim() && !s.stderr.trim(), `« ${ok.slice(0, 40)} » : exit ${s.status} ${s.stderr.slice(0, 80)}`);
  }
});

console.log(`\nhook-gardes-commande (TF-2721, TF-2689) : ${pass} PASS, ${fail} FAIL — cas rouges : relevés d'environnement entiers, affichage d'une variable de jeton, arrêts par nom, par filtre, par motif de ligne de commande`);
process.exit(fail ? 1 : 0);
