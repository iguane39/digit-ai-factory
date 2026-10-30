#!/usr/bin/env node
/**
 * hook-fichiers-env.test.mjs — les `.env` gardés par l'outil qui les lit (D-106 (b), 29/10/2026).
 * Sens rouge : `Read` et `Grep` d'un `.env`, `.env.local`, `.env.production`, `.env*` ; toutes les commandes
 * Bash et PowerShell qui en affichent le contenu (cat, type, Get-Content, head, tail, less, more, grep, sed, awk,
 * Select-String, redirection d'entrée, copie vers la sortie standard, git show, tuyau vers un lecteur, code en
 * ligne, sous-commande, coque `-c`). Sens vert : `.env.example`, `.env.sample`, `.env.template`, les faux positifs
 * évidents (`.environment.md`, `.envrc`, `dotenv`, un dossier `.env`, une recherche DE la chaîne « .env », un mot
 * entre guillemets), les commandes qui ne lisent pas (`git add`, `ls`, `test`, `cp .env.example .env`) et la VOIE
 * PERMISE : la commande que le refus propose passe le hook (remède joué, TF-1013).
 * Les chemins sont des NOMS fictifs : aucun fichier n'est ouvert, ni par le hook, ni par ce banc.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-fichiers-env.mjs");
const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "..", "scripts", "env-masque.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const jouerBrut = (entree, brut) => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: brut ?? JSON.stringify(entree) });
  return { code: r.status, err: r.stderr || "" };
};
const jouer = (tool_name, tool_input) => jouerBrut({ tool_name, tool_input });
const cmd = (outil, command) => jouer(outil, { command });

// ---------------------------------------------------------------------------------------------------
// ROUGES — l'outil Read et l'outil Grep
// ---------------------------------------------------------------------------------------------------
const ROUGES_OUTILS = [
  ["Read", { file_path: "C:\\dev\\produit\\.env" }, "Read de .env (chemin Windows)"],
  ["Read", { file_path: ".env" }, "Read de .env relatif"],
  ["Read", { file_path: "/home/x/produit/.env.local" }, "Read de .env.local"],
  ["Read", { file_path: "C:\\dev\\produit\\.env.production" }, "Read de .env.production"],
  ["Read", { file_path: "C:\\dev\\produit\\.ENV" }, "Read de .ENV (casse)"],
  ["Read", { file_path: "C:\\dev\\produit\\.env.production.bak" }, "Read d'une sauvegarde .env.production.bak"],
  ["Grep", { pattern: "KEY", path: "C:\\dev\\produit\\.env" }, "Grep dont le path est .env"],
  ["Grep", { pattern: "KEY", path: "./app/.env.local", output_mode: "content" }, "Grep dont le path est .env.local"],
  ["Grep", { pattern: "KEY", glob: ".env*" }, "Grep au filtre .env*"],
  ["Grep", { pattern: "KEY", path: ".", glob: "**/.env*" }, "Grep au filtre **/.env*"],
  ["Grep", { pattern: "KEY", glob: "{.env,.env.local}" }, "Grep au filtre à accolades"],
];
for (const [outil, entree, nom] of ROUGES_OUTILS) {
  check(`rouge — ${nom} : refusé (exit 2, D-106 (b) nommé)`, () => {
    const r = jouer(outil, entree);
    if (r.code !== 2 || !/LECTURE DE \.env REFUSÉE \(D-106 \(b\)\)/.test(r.err)) throw new Error(`exit ${r.code} : ${r.err.slice(0, 160)}`);
  });
}

// ---------------------------------------------------------------------------------------------------
// ROUGES — Bash et PowerShell
// ---------------------------------------------------------------------------------------------------
const ROUGES_COMMANDES = [
  // Les lecteurs de la demande : cat, type, Get-Content, head, tail, less, more, grep, sed, awk, Select-String
  ["Bash", "cat .env", "cat"],
  ["Bash", "cat ./.env", "cat ./.env"],
  ["Bash", 'cat "C:\\dev\\produit\\.env"', "cat d'un chemin entre guillemets"],
  ["Bash", "cat ~/produit/.env.local", "cat .env.local"],
  ["Bash", "cat .env.production", "cat .env.production"],
  ["Bash", "type .env", "type"],
  ["Bash", "head -n 5 .env", "head"],
  ["Bash", "tail -f .env.production", "tail"],
  ["Bash", "less .env", "less"],
  ["Bash", "more .env", "more"],
  ["Bash", "grep API_KEY .env", "grep"],
  ["Bash", 'grep -E "(A|B)" .env', "grep dont le motif porte des parenthèses et un tuyau"],
  ["Bash", "grep -r KEY --include=.env .", "grep --include=.env"],
  ["Bash", "grep -e KEY .env", "grep -e"],
  ["Bash", "rg KEY .env", "rg"],
  ["Bash", "sed -n 1,5p .env", "sed"],
  ["Bash", "awk '{print $1}' .env", "awk"],
  ["Bash", "cat .env.example .env", "cat d'un modèle ET du vrai"],
  ["Bash", "base64 .env", "base64"],
  ["Bash", "xxd .env", "xxd"],
  ["Bash", "strings .env", "strings"],
  ["Bash", "sort .env", "sort"],
  ["Bash", "diff .env .env.example", "diff"],
  ["Bash", "sudo cat .env", "cat derrière sudo"],
  ["Bash", "API=1 cat .env", "cat derrière une affectation"],
  // Redirection d'entrée
  ["Bash", "cat < .env", "redirection d'entrée"],
  ["Bash", "cat <.env", "redirection d'entrée collée"],
  ["Bash", "while read l; do echo $l; done < .env", "boucle qui lit .env en entrée"],
  // Composition
  ["Bash", "git add todo/TODO.jsonl && cat .env", "cat en fin de commande composée"],
  ["Bash", "echo ok; cat .env", "cat après un point-virgule"],
  ["Bash", "cat .env | head", "cat en tête de tuyau"],
  ["Bash", "echo $(cat .env)", "sous-commande $( )"],
  ["Bash", 'echo "$(cat .env)"', "sous-commande entre guillemets"],
  ["Bash", "export $(cat .env | xargs)", "export $(cat .env | xargs)"],
  ["Bash", "echo `cat .env`", "accents graves"],
  // Copie vers la sortie standard
  ["Bash", "cp .env /dev/stdout", "cp vers /dev/stdout"],
  ["Bash", "cp .env /dev/fd/1", "cp vers /dev/fd/1"],
  ["Bash", "copy .env CON", "copy vers CON"],
  ["Bash", "dd if=.env", "dd sans fichier de sortie"],
  ["Bash", "dd if=.env of=/dev/stdout", "dd vers /dev/stdout"],
  // git
  ["Bash", "git show HEAD:.env", "git show HEAD:.env"],
  ["Bash", "git diff .env", "git diff .env"],
  ["Bash", "git -C ../produit show HEAD:.env.local", "git show derrière -C"],
  ["Bash", "git log -p -- .env", "git log -p"],
  ["Bash", "git blame .env", "git blame"],
  ["Bash", "git cat-file -p HEAD:.env", "git cat-file"],
  // find, tuyaux, coques, interpréteurs
  ["Bash", "find . -name .env -exec cat {} \\;", "find -exec cat"],
  ["Bash", "find . -name '.env*' | xargs cat", "find | xargs cat"],
  ["Bash", "ls .env | xargs cat", "ls | xargs cat"],
  ["Bash", 'bash -c "cat .env"', "bash -c"],
  ["Bash", "sh -c 'head .env'", "sh -c"],
  ["Bash", "node -e \"console.log(require('fs').readFileSync('.env','utf8'))\"", "node -e"],
  ["Bash", "python -c \"print(open('.env').read())\"", "python -c"],
  ["Bash", "python3 -c 'import pathlib; print(pathlib.Path(\".env.local\").read_text())'", "python3 -c"],
  ["Bash", "perl -ne 'print' .env", "perl -ne"],
  // PowerShell
  ["PowerShell", "Get-Content .env", "Get-Content"],
  ["PowerShell", "gc .env", "gc"],
  ["PowerShell", "Get-Content -Path .\\.env", "Get-Content -Path"],
  ["PowerShell", 'Get-Content -LiteralPath "C:\\dev\\produit\\.env.local" -Raw', "Get-Content -LiteralPath"],
  ["PowerShell", "cat .env", "cat sous PowerShell"],
  ["PowerShell", "type .env", "type sous PowerShell"],
  ["PowerShell", "Select-String -Path .env -Pattern KEY", "Select-String -Path"],
  ["PowerShell", "Select-String KEY .env.production", "Select-String positionnel"],
  ["PowerShell", "sls KEY .env", "sls"],
  ["PowerShell", "Get-Content .env | Select-Object -First 3", "Get-Content | Select-Object"],
  ["PowerShell", "(Get-Content .env)", "Get-Content entre parenthèses"],
  ["PowerShell", "$x = Get-Content .env; Write-Host $x", "affectation d'une lecture"],
  ["PowerShell", "Write-Host (Get-Content .env)", "Get-Content imbriqué"],
  ["PowerShell", "Get-Content (Join-Path $PWD '.env')", "Get-Content d'une sous-expression Join-Path"],
  ["PowerShell", "Get-Content (Get-ChildItem -Filter .env*)", "Get-Content d'une sous-expression Get-ChildItem"],
  ["PowerShell", "Get-Item .env | Get-Content", "Get-Item .env | Get-Content"],
  ["PowerShell", "Get-ChildItem -Filter .env* | gc", "Get-ChildItem -Filter .env* | gc"],
  ["PowerShell", "Get-ChildItem .env | ForEach-Object { Get-Content $_ }", "Get-ChildItem | ForEach-Object { Get-Content }"],
  ["PowerShell", "[IO.File]::ReadAllText('.env')", "ReadAllText"],
  ["PowerShell", '[System.IO.File]::ReadAllLines("C:\\dev\\produit\\.env")', "ReadAllLines"],
  ["PowerShell", 'powershell -Command "gc .env"', "powershell -Command"],
  ["PowerShell", 'pwsh -c "Get-Content .env"', "pwsh -c"],
  ["PowerShell", "cmd /c type .env", "cmd /c type"],
  ["PowerShell", "Copy-Item .env -Destination CON", "Copy-Item vers CON"],
  ["PowerShell", "Get-Content $env:USERPROFILE\\produit\\.env", "Get-Content d'un chemin à variable"],
];
for (const [outil, c, nom] of ROUGES_COMMANDES) {
  check(`rouge — ${nom} (${outil}) : refusé (exit 2, D-106 (b) nommé)`, () => {
    const r = cmd(outil, c);
    if (r.code !== 2 || !/LECTURE DE \.env REFUSÉE \(D-106 \(b\)\)/.test(r.err)) throw new Error(`« ${c} » : exit ${r.code} : ${r.err.slice(0, 160)}`);
  });
}

// ---------------------------------------------------------------------------------------------------
// Le message : pourquoi, et la voie permise
// ---------------------------------------------------------------------------------------------------
check("rouge — le message dit pourquoi (21/10/2026), la voie permise (script de masquage, --cles) et les modèles admis", () => {
  const r = cmd("Bash", "cat .env");
  for (const attendu of [/21\/10\/2026/, /transcription/, /env-masque\.mjs/, /--cles/, /\*{8}/, /\.env\.example/, /\.env\.sample/, /\.env\.template/]) {
    if (!attendu.test(r.err)) throw new Error(`message sans ${attendu} : ${r.err}`);
  }
  if (r.err.includes("\u0000")) throw new Error("octet nul dans le message");
});
check("rouge — le message nomme le fichier visé, pas son contenu : `cat .env.local` cite .env.local", () => {
  const r = cmd("Bash", "cat .env.local");
  if (!/`cat` lit et affiche `\.env\.local`/.test(r.err)) throw new Error(r.err.slice(0, 200));
});

// ---------------------------------------------------------------------------------------------------
// VERTS — les exemptions demandées
// ---------------------------------------------------------------------------------------------------
const VERTS_OUTILS = [
  ["Read", { file_path: "C:\\dev\\produit\\.env.example" }, "Read de .env.example"],
  ["Read", { file_path: "/home/x/produit/.env.sample" }, "Read de .env.sample"],
  ["Read", { file_path: ".env.template" }, "Read de .env.template"],
  ["Read", { file_path: "C:\\dev\\produit\\.env.local.example" }, "Read de .env.local.example"],
  ["Read", { file_path: "C:\\dev\\produit\\.env.production.template" }, "Read de .env.production.template"],
  ["Grep", { pattern: "KEY", path: "C:\\dev\\produit\\.env.example" }, "Grep de .env.example"],
  ["Grep", { pattern: "KEY", glob: ".env.example" }, "Grep au filtre .env.example"],
  // Les faux positifs évidents
  ["Read", { file_path: "C:\\dev\\produit\\docs\\.environment.md" }, "Read de .environment.md (« .env » au milieu d'un mot)"],
  ["Read", { file_path: "C:\\dev\\produit\\.envrc" }, "Read de .envrc (autre fichier, hors périmètre déclaré)"],
  ["Read", { file_path: "C:\\dev\\produit\\docs\\dotenv.md" }, "Read de dotenv.md"],
  ["Read", { file_path: "C:\\dev\\produit\\.env\\bin\\activate" }, "Read dans un dossier .env (environnement virtuel)"],
  ["Read", { file_path: "README.md" }, "Read d'un fichier sans rapport"],
  ["Grep", { pattern: "\\.env", path: "docs" }, "Grep de la chaîne .env dans un dossier"],
  ["Grep", { pattern: "KEY", glob: "*.md" }, "Grep au filtre *.md"],
  ["Grep", { pattern: "KEY", path: ".", glob: "!.env*" }, "Grep qui EXCLUT .env* (filtre négatif)"],
  ["Grep", { pattern: "KEY", path: ".env/lib" }, "Grep dans le dossier .env d'un environnement virtuel"],
  ["Write", { file_path: ".env", content: "CLE=fictive" }, "outil Write (hors périmètre : exige une lecture préalable)"],
  ["Glob", { pattern: "**/.env*" }, "outil Glob (ne rend que des noms)"],
];
for (const [outil, entree, nom] of VERTS_OUTILS) {
  check(`vert — ${nom} : laisse passer`, () => {
    const r = jouer(outil, entree);
    if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.err.slice(0, 160)}`);
  });
}

const VERTS_COMMANDES = [
  // Les modèles
  ["Bash", "cat .env.example", "cat .env.example"],
  ["Bash", "cat .env.sample", "cat .env.sample"],
  ["Bash", "cat .env.template", "cat .env.template"],
  ["Bash", "head -n 20 ./produit/.env.example", "head .env.example"],
  ["Bash", "grep API_KEY .env.example", "grep .env.example"],
  ["Bash", "type .env.example", "type .env.example"],
  ["Bash", "cat .env.production.example .env.local.template", "cat de deux modèles"],
  ["PowerShell", "Get-Content .env.example", "Get-Content .env.example"],
  ["PowerShell", "Select-String -Path .env.sample -Pattern KEY", "Select-String .env.sample"],
  // Faux positifs évidents
  ["Bash", "cat docs/.environment.md", "cat .environment.md"],
  ["Bash", "head .environment.md", "head .environment.md"],
  ["Bash", "cat .envrc", "cat .envrc (hors périmètre déclaré)"],
  ["Bash", "cat docs/dotenv.md", "cat dotenv.md"],
  ["Bash", 'grep -rn "\\.env" docs/', "grep d'une chaîne \\.env (échappement d'expression régulière)"],
  ["Bash", 'grep -rn ".env" docs/', "grep de la chaîne .env (le motif n'est pas un fichier)"],
  ["Bash", "grep -rn -e .env docs/", "grep -e .env (motif nommé)"],
  ["Bash", 'grep -rn "\\.env" docs/ .claude', "grep d'une chaîne dans deux dossiers"],
  ["Bash", "grep -rn KEY --exclude=.env .", "grep qui EXCLUT .env"],
  ["Bash", "rg KEY -g '!.env' .", "rg qui EXCLUT .env"],
  ["Bash", "cat .env/bin/activate", "cat dans un dossier .env"],
  ["Bash", "source .env/bin/activate", "source d'un environnement virtuel .env/"],
  ["Bash", ".env/bin/python -m pytest", "python d'un environnement virtuel .env/"],
  ["Bash", 'echo "voir .env"', "echo d'un texte qui cite .env"],
  ["Bash", 'echo "cat .env"', "echo d'une commande entre guillemets"],
  ["Bash", 'git commit -m "docs: ne jamais cat .env"', "message de commit qui cite cat .env"],
  ["Bash", 'grep -E "(A|B)" README.md', "grep à motif parenthésé sans .env"],
  ["PowerShell", 'Write-Host "Get-Content .env"', "Write-Host d'une commande entre guillemets"],
  // Commandes qui ne lisent pas
  ["Bash", "git add .env.example", "git add .env.example"],
  ["Bash", "git check-ignore .env", "git check-ignore .env"],
  ["Bash", "git ls-files .env", "git ls-files .env"],
  ["Bash", "git status --short .env", "git status .env"],
  ["Bash", "git log --oneline -- .env", "git log --oneline -- .env (noms de commits, pas le contenu)"],
  ["Bash", "git diff --name-only -- .env", "git diff --name-only -- .env"],
  ["Bash", "git diff --stat -- .env", "git diff --stat -- .env"],
  ["Bash", "ls -la .env", "ls -la .env"],
  ["Bash", "ls .env | head", "ls .env | head (le nom, pas le contenu)"],
  ["Bash", "test -f .env && echo present", "test -f .env"],
  ["Bash", "[ -f .env ] && echo present", "[ -f .env ]"],
  ["Bash", "cp .env.example .env", "cp .env.example .env (copie vers un fichier)"],
  ["Bash", "mv .env .env.bak", "mv .env .env.bak"],
  ["Bash", "stat .env", "stat .env"],
  ["Bash", "node -e \"console.log(1)\"", "node -e sans .env"],
  ["Bash", "node -e \"require('dotenv').config()\"", "node -e qui cite dotenv"],
  ["Bash", "python -c \"print('.environment')\"", "python -c qui cite .environment"],
  ["Bash", "node scripts/produit.mjs", "script sans .env"],
  ["PowerShell", "Test-Path .env", "Test-Path .env"],
  ["PowerShell", "Get-Item .env", "Get-Item .env"],
  ["PowerShell", "Get-Item (Join-Path $PWD '.env')", "Get-Item d'une sous-expression Join-Path (ne lit pas)"],
  ["PowerShell", "Get-ChildItem -Force .env*", "Get-ChildItem -Force .env*"],
  ["PowerShell", "Copy-Item .env.example .env", "Copy-Item .env.example .env"],
  ["Bash", "git status && git log -1", "commande sans .env"],
  ["Bash", "", "commande vide"],
];
for (const [outil, c, nom] of VERTS_COMMANDES) {
  check(`vert — ${nom} (${outil}) : laisse passer`, () => {
    const r = cmd(outil, c);
    if (r.code !== 0) throw new Error(`« ${c} » : exit ${r.code} : ${r.err.slice(0, 160)}`);
  });
}

// ---------------------------------------------------------------------------------------------------
// VERTS — la voie permise : le remède du message est joué (TF-1013)
// ---------------------------------------------------------------------------------------------------
const REMEDES = [
  ["Bash", `node "${SCRIPT}" .env`, "script de masquage sur .env"],
  ["Bash", `node "${SCRIPT}" .env --cles`, "script de masquage --cles sur .env"],
  ["Bash", `node "${SCRIPT}" ./produit/.env.production`, "script de masquage sur .env.production"],
  ["PowerShell", `node "${SCRIPT}" .env`, "script de masquage sous PowerShell"],
  ["PowerShell", `node "${SCRIPT}" C:\\dev\\produit\\.env --cles`, "script de masquage --cles sous PowerShell"],
  ["Bash", "node scripts/env-masque.mjs .env", "script de masquage par chemin relatif"],
];
for (const [outil, c, nom] of REMEDES) {
  check(`vert — remède joué : ${nom} (${outil}) : laisse passer`, () => {
    const r = cmd(outil, c);
    if (r.code !== 0) throw new Error(`« ${c} » : exit ${r.code} : ${r.err.slice(0, 160)}`);
  });
}
check("vert — le chemin du script que le message propose est celui qui passe le hook", () => {
  const r = cmd("Bash", "cat .env");
  const m = /`node (.+?env-masque\.mjs) <fichier>`/.exec(r.err);
  if (!m) throw new Error(`chemin du script absent du message : ${r.err.slice(0, 300)}`);
  const joue = cmd("Bash", `node ${m[1]} .env`);
  if (joue.code !== 0) throw new Error(`la commande proposée est refusée : exit ${joue.code} ${joue.err.slice(0, 160)}`);
  if (m[1] !== SCRIPT) throw new Error(`chemin proposé ${m[1]} ≠ script réel ${SCRIPT}`);
});

// ---------------------------------------------------------------------------------------------------
// Robustesse : une entrée qui n'est pas un appel d'outil ne bloque jamais
// ---------------------------------------------------------------------------------------------------
check("vert — entrée illisible : laisse passer (une panne du juge ne bloque jamais un outil)", () => {
  const r = jouerBrut(null, "pas du JSON");
  if (r.code !== 0) throw new Error(`exit ${r.code}`);
});
check("vert — entrée vide : laisse passer", () => {
  const r = jouerBrut(null, "");
  if (r.code !== 0) throw new Error(`exit ${r.code}`);
});
check("vert — commande qui n'est pas une chaîne : laisse passer", () => {
  const r = jouer("Bash", { command: 42 });
  if (r.code !== 0) throw new Error(`exit ${r.code}`);
});

console.log(`\nhook-fichiers-env : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
