#!/usr/bin/env node
/**
 * hook-gardes-commande.mjs — DEUX GESTES DE COMMANDE QUE LE CONTRAT INTERDISAIT SANS QUE RIEN LES REFUSE (TF-2721, TF-2689, 22/11/2026).
 *
 * 1. UN RELEVÉ NON FILTRÉ DE L'ENVIRONNEMENT N'AFFICHE PAS UN JETON (TF-2721, constat du 15/11/2026).
 *    Le fait : un agent `constructeur` a affiché `CLAUDE_CODE_MESSAGING_TOKEN` dans sa transcription par un relevé non filtré de l'environnement ; tout ce
 *    qu'un outil affiche entre dans la transcription locale, en clair. Le hook REFUSE (exit 2) : `env` et `printenv` sans nom de variable, `set`, `export` et
 *    `declare -x|-p` sans affectation, `cat /proc/<pid>/environ`, `Get-ChildItem|Get-Item env:` (liste entière), `[Environment]::GetEnvironmentVariables()`,
 *    un code en ligne (`node -e`, `python -c`) qui imprime `process.env` ou `os.environ` en entier, et l'affichage d'UNE variable dont le nom évoque un
 *    secret (`printenv X_TOKEN`, `echo $X_API_KEY`, `Write-Host $env:X_SECRET`). Il LAISSE PASSER la lecture d'une variable ordinaire (`printenv FORGE_ROOT`,
 *    `$env:FORGE_ROOT`), `env A=1 commande`, `set -e`, un test de présence qui n'affiche rien. La voie permise : `node scripts\env-session.mjs`
 *    (jetons masqués), avec `--noms`, `--var NOM`, `--presente NOM`.
 *
 * 2. UN PROCESSUS SE VISE PAR LE PID NOTÉ À SON LANCEMENT, JAMAIS PAR LE MOTIF DE SA LIGNE DE COMMANDE (TF-2689, constat du 16/11/2026, lot fws).
 *    Le fait : pour arrêter sa propre recette, un agent de campagne a tué 3 processus dont la ligne contenait `oracles/self-test.mjs` ; 2 n'étaient pas les
 *    siens (recettes d'autres agents). Le contrat n'interdisait pas l'arrêt par motif. Le hook REFUSE : `taskkill` sans `/PID`, `Stop-Process -Name` ou `Stop-Process
 *    <nom>`, un `Stop-Process` ou `kill` alimenté par un tuyau (sauf d'un PID lu : `Get-Content`, `echo`), `Stop-Process -Id (Get-Process …)`, `pkill`, `killall`,
 *    `kill $(pgrep …)`, `… | xargs kill`, `.Terminate()`, `wmic process … delete|terminate`. Il LAISSE PASSER `taskkill /PID <n> [/T] [/F]`, `Stop-Process -Id <n>`,
 *    `kill <n>`. Le remède est joué par le banc : `node scripts\processus-par-pid.mjs arreter --pid <n> --arbre` arrête le processus et ses enfants, puis VÉRIFIE
 *    par la liste des processus (TF-2731) ; `lancer` en note le PID au lancement.
 *
 * NON JUGÉ (déclaré) : un arrêt par un script dont le texte n'est pas dans la commande ; un nom de variable de jeton assemblé à l'exécution ; un secret porté par une
 * variable au nom banal ; une commande encodée (`-EncodedCommand`, `base64 -d | sh`) ; un PID noté à tort (le hook décide sur la FORME de la cible, pas sur son
 * exactitude). Hook `PreToolUse` sur `Bash` et `PowerShell`. Jamais de lecture de fichier : le hook décide sur le texte de la commande.
 *
 * Usage : node oracles\hook-gardes-commande.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : 0 laisse passer · 2 refuse (motif sur stderr).
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { decouper } from "./hook-fichiers-env.mjs";
import { nomSecret } from "../scripts/env-session.mjs";

export const OUTILS = new Set(["Bash", "PowerShell"]);
const ICI = dirname(fileURLToPath(import.meta.url));
export const SCRIPT_ENV = resolve(ICI, "..", "scripts", "env-session.mjs");
export const SCRIPT_PROCESSUS = resolve(ICI, "..", "scripts", "processus-par-pid.mjs");

const base = (m) => String(m).split(/[\\/]/).pop().replace(/\.(?:exe|cmd|bat|ps1)$/i, "").toLowerCase();
const PREFIXES = new Set(["sudo", "command", "builtin", "exec", "nohup", "time", "nice", "call", "&", "then", "else", "do", "if", "while", "until", "!", "{", "}"]);

/**
 * La commande sans le CORPS de ses documents ici (`<<'EOF' … EOF`, `<<EOF`, `<<-EOF`) : un message de commit ou un fichier écrit par `cat <<EOF` n'est pas une suite de commandes, et
 * ses lignes ne se jugent pas comme telles (un message qui cite « pkill -f » en début de ligne serait refusé à tort). La ligne qui ouvre le document reste jugée.
 */
export function sansHeredoc(commande) {
  const lignes = String(commande || "").split("\n");
  const sortie = [];
  let fin = null;
  for (const l of lignes) {
    if (fin !== null) { if (l.trim() === fin) fin = null; continue; }
    sortie.push(l);
    const m = /<<-?\s*(?:'([^']+)'|"([^"]+)"|\\?([A-Za-z_][\w]*))/.exec(l);
    if (m) fin = m[1] || m[2] || m[3];
  }
  return sortie.join("\n");
}

/** Le texte sans ses chaînes entre guillemets : une charge qui n'est qu'un mot dans un message ne se juge pas comme une commande. */
const sansGuillemets = (t) => String(t).replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""');

/** Les étages d'une commande, chacun réduit à { cmd, args } (affectations et préfixes sautés ; `env` reste une commande). */
function etagesDe(texte) {
  const sortie = [];
  for (const chaine of decouper(texte)) {
    chaine.forEach((mots, rang) => {
      const utiles = [];
      for (let k = 0; k < mots.length; k++) { if (/^[<>]/.test(mots[k])) { k++; continue; } utiles.push(mots[k]); }
      let i = 0;
      while (i < utiles.length && (/^[A-Za-z_]\w*=/.test(utiles[i]) || PREFIXES.has(utiles[i].toLowerCase()))) i++;
      if (i >= utiles.length) return;
      sortie.push({ cmd: base(utiles[i]), args: utiles.slice(i + 1), rang, amont: chaine.slice(0, rang).map((m) => base(m[0] ?? "")) });
    });
  }
  return sortie;
}

// ---------------------------------------------------------------------------------------------------
// 1. L'environnement
// ---------------------------------------------------------------------------------------------------
const AFFICHEURS = "echo|printf|write-output|write-host|write-error|write-warning|out-host|print";
const NOM_ENV_PS = /^\$?\{?env:\\?(\*?)([A-Za-z_][\w.\-]*)?\}?$/i;

/** Les fautes d'un relevé d'environnement dans une commande (liste de phrases courtes). */
export function fautesEnvironnement(commande, profondeur = 0) {
  const fautes = [];
  if (profondeur > 3) return fautes;
  const texte = sansHeredoc(commande);
  if (!/env|set|export|declare|typeset|environ|Environment|Get-ChildItem|gci|\bls\b|\bdir\b|Get-Item|\bgi\b|TOKEN|SECRET|KEY|PASS|AUTH|CREDENTIAL/i.test(texte)) return fautes;

  for (const m of texte.matchAll(/\$\(([^()]*)\)/g)) fautes.push(...fautesEnvironnement(m[1], profondeur + 1));
  // Le texte brut : les formes qu'aucun découpage de mots ne voit.
  if (/\/proc\/[^\s/]+\/environ\b/.test(texte)) fautes.push("lecture de `/proc/<pid>/environ` (l'environnement entier d'un processus)");
  if (/\[\s*(?:System\.)?Environment\s*\]\s*::\s*GetEnvironmentVariables\s*\(\s*\)/i.test(texte)) fautes.push("`[Environment]::GetEnvironmentVariables()` (l'environnement entier)");

  for (const { cmd, args } of etagesDe(texte)) {
    const libres = args.filter((a) => !a.startsWith("-") && !a.startsWith("/"));
    if (/^(?:bash|sh|zsh|dash|ksh)$/.test(cmd)) {
      const k = args.findIndex((a) => /^-[a-z]*c[a-z]*$/.test(a));
      if (k >= 0 && args[k + 1] !== undefined) fautes.push(...fautesEnvironnement(args[k + 1], profondeur + 1));
    } else if (/^(?:powershell|pwsh)$/.test(cmd)) {
      const k = args.findIndex((a) => /^-(?:command|c|cmd)$/i.test(a));
      if (k >= 0) fautes.push(...fautesEnvironnement(args.slice(k + 1).join(" "), profondeur + 1));
    } else if (cmd === "cmd") {
      const k = args.findIndex((a) => /^\/[ck]$/i.test(a));
      if (k >= 0) fautes.push(...fautesEnvironnement(args.slice(k + 1).join(" "), profondeur + 1));
    } else if (cmd === "env") {
      if (!libres.some((a) => !/^\w+=/.test(a))) fautes.push("`env` sans commande liste tout l'environnement");
    } else if (cmd === "printenv") {
      if (!libres.length) fautes.push("`printenv` sans nom liste tout l'environnement");
      for (const n of libres) if (nomSecret(n)) fautes.push(`\`printenv ${n}\` affiche une variable de jeton`);
    } else if (cmd === "set") {
      if (!args.length) fautes.push("`set` sans argument liste les variables, l'environnement compris");
    } else if (cmd === "export") {
      if (!libres.length && (!args.length || args.every((a) => /^-[a-z]*p[a-z]*$/.test(a)))) fautes.push("`export` sans affectation liste l'environnement exporté");
    } else if (cmd === "declare" || cmd === "typeset") {
      if (!libres.length && args.some((a) => /^-[a-z]*[xp][a-z]*$/.test(a))) fautes.push(`\`${cmd} -x|-p\` sans nom liste l'environnement`);
    } else if (/^(?:get-childitem|gci|ls|dir|get-item|gi)$/.test(cmd)) {
      for (const a of args) {
        const m = NOM_ENV_PS.exec(a.replace(/^-path$/i, ""));
        if (!m) continue;
        if (m[1] === "*" || !m[2]) fautes.push(`\`${cmd} env:\` liste tout l'environnement`);
        else if (nomSecret(m[2])) fautes.push(`\`${cmd} env:${m[2]}\` affiche une variable de jeton`);
      }
    } else if (/^(?:node|nodejs|bun|deno)$/.test(cmd) || /^(?:python|python3|py)$/.test(cmd)) {
      const enLigne = /^(?:node|nodejs|bun|deno)$/.test(cmd) ? /^(?:-e|--eval|-p|--print|eval)$/ : /^-c$/;
      if (args.some((a) => enLigne.test(a))) {
        const code = args.join(" ");
        const puits = /console\.(?:log|error|info|dir|warn)|process\.std(?:out|err)\.write|JSON\.stringify|util\.inspect|Object\.(?:entries|values)|\bprint\s*\(|pprint|json\.dumps/;
        const entier = /process\.env(?![\w.\[])|(?<![\w.])os\.environ(?![\w.\[])|os\.environ\.(?:items|values|copy)\s*\(|dict\s*\(\s*os\.environ\s*\)/;
        if (entier.test(code) && puits.test(code)) fautes.push(`\`${cmd}\` avec un code en ligne qui imprime tout l'environnement`);
      }
    }
  }
  // L'affichage d'UNE variable de jeton : `echo $X_TOKEN`, `Write-Host $env:X_SECRET`, `echo ${X_API_KEY}`.
  const reAffiche = new RegExp(`\\b(?:${AFFICHEURS})\\b[^\\n;|&]*?\\$\\{?(?:env:)?([A-Za-z_][\\w.]*)\\}?`, "gi");
  for (const m of texte.matchAll(reAffiche)) if (nomSecret(m[1])) fautes.push(`affichage de la variable de jeton \`${m[1]}\``);
  return [...new Set(fautes)];
}

// ---------------------------------------------------------------------------------------------------
// 2. L'arrêt d'un processus
// ---------------------------------------------------------------------------------------------------
const SOURCES_DE_PID_LU = new Set(["get-content", "gc", "cat", "echo", "write-output", "printf", "type"]);
const ARRETEURS = new Set(["stop-process", "spps", "kill", "taskkill", "pkill", "killall"]);

/** Les fautes d'un arrêt de processus par motif dans une commande. */
export function fautesArretParMotif(commande, profondeur = 0) {
  const fautes = [];
  if (profondeur > 3) return fautes;
  const texte = sansHeredoc(commande);
  if (!/kill|Stop-Process|spps|Terminate|wmic/i.test(texte)) return fautes;

  for (const m of texte.matchAll(/\$\(([^()]*)\)/g)) fautes.push(...fautesArretParMotif(m[1], profondeur + 1));
  const hors = sansGuillemets(texte);
  if (/\bStop-Process\b[^|;\n]*\(\s*(?:Get-(?:Process|CimInstance|WmiObject)|gps|gcim)/i.test(hors)) fautes.push("`Stop-Process` dont la cible est une requête de processus");
  if (/\bkill\b[^|;\n]*(?:\$\(|`)\s*(?:pgrep|ps|pidof)\b/.test(hors)) fautes.push("`kill` dont la cible est la sortie de `pgrep` ou `ps`");
  if (/\|\s*xargs\s+(?:-\S+\s+)*kill\b/.test(hors)) fautes.push("`… | xargs kill` : la cible vient d'un filtre");
  if (/\|\s*(?:ForEach-Object|ForEach|%)\b[^|]*\b(?:Stop-Process|spps|taskkill)\b/i.test(hors) && !/^\s*(?:Get-Content|gc|cat|echo|Write-Output|type)\b/i.test(hors))
    fautes.push("`Stop-Process` ou `taskkill` dans un `ForEach-Object` alimenté par un tuyau : la cible est celle d'un filtre, pas un PID noté");
  if (/\.Terminate\s*\(|Invoke-CimMethod[^|;\n]*Terminate|\bwmic\b[^|;\n]*\bprocess\b[^|;\n]*\b(?:delete|call\s+terminate)\b/i.test(hors)) fautes.push("arrêt par la méthode `Terminate` ou `wmic process … delete` sur une sélection");

  for (const { cmd, args, amont } of etagesDe(texte)) {
    const bas = args.map((a) => a.toLowerCase());
    if (/^(?:bash|sh|zsh|dash|ksh)$/.test(cmd)) {
      const k = args.findIndex((a) => /^-[a-z]*c[a-z]*$/.test(a));
      if (k >= 0 && args[k + 1] !== undefined) fautes.push(...fautesArretParMotif(args[k + 1], profondeur + 1));
      continue;
    }
    if (/^(?:powershell|pwsh)$/.test(cmd)) {
      const k = args.findIndex((a) => /^-(?:command|c|cmd)$/i.test(a));
      if (k >= 0) fautes.push(...fautesArretParMotif(args.slice(k + 1).join(" "), profondeur + 1));
      continue;
    }
    if (cmd === "cmd") {
      const k = args.findIndex((a) => /^\/[ck]$/i.test(a));
      if (k >= 0) fautes.push(...fautesArretParMotif(args.slice(k + 1).join(" "), profondeur + 1));
      continue;
    }
    if (!ARRETEURS.has(cmd)) continue;
    if (cmd === "pkill" || cmd === "killall") { fautes.push(`\`${cmd}\` arrête par nom ou par motif de ligne de commande`); continue; }
    if (cmd === "taskkill") {
      if (!bas.some((a) => /^[/-]pid$/.test(a))) fautes.push("`taskkill` sans `/PID` (arrêt par nom d'image `/IM` ou par filtre `/FI`)");
      continue;
    }
    // Stop-Process, spps, kill
    const parNom = bas.some((a) => /^-(?:name|processname|n)$/.test(a));
    if (parNom) { fautes.push(`\`${cmd} -Name\` arrête par nom de processus`); continue; }
    const libres = args.filter((a) => !a.startsWith("-"));
    const idDonne = bas.some((a) => /^-id$/.test(a));
    if (cmd !== "kill" && !idDonne && libres.some((a) => !/^\d+$/.test(a) && !a.startsWith("$"))) fautes.push(`\`${cmd} <nom>\` arrête par nom de processus`);
    if (amont.length && !amont.every((c) => SOURCES_DE_PID_LU.has(c))) fautes.push(`\`${cmd}\` alimenté par un tuyau (\`${amont.join(" | ")}\`) : la cible est celle d'un filtre, pas un PID noté`);
  }
  return [...new Set(fautes)];
}

/** Juge l'entrée d'un hook PreToolUse : { decision: "laisse" } ou { decision: "refuse", motif }. */
export function juger(entree) {
  if (!OUTILS.has(entree?.tool_name)) return { decision: "laisse" };
  const commande = entree?.tool_input?.command;
  if (typeof commande !== "string" || !commande.trim()) return { decision: "laisse" };
  const env = fautesEnvironnement(commande), arret = fautesArretParMotif(commande);
  const motifs = [];
  if (env.length) motifs.push(`RELEVÉ DE L'ENVIRONNEMENT REFUSÉ (TF-2721) — ${env.join(" ; ")}. Le 15/11/2026, un agent a affiché CLAUDE_CODE_MESSAGING_TOKEN dans sa transcription par un relevé non filtré : `
    + `tout ce qu'un outil affiche entre dans la transcription locale, en clair. Voie permise : \`node ${SCRIPT_ENV}\` (valeurs de jeton masquées), \`--noms\` (les seuls noms), \`--var NOM\`, \`--presente NOM\` (oui ou non).`);
  if (arret.length) motifs.push(`ARRÊT DE PROCESSUS PAR MOTIF REFUSÉ (TF-2689) — ${arret.join(" ; ")}. Le 16/11/2026, un agent de campagne a tué 3 processus dont la ligne contenait oracles/self-test.mjs : 2 n'étaient pas les siens (recettes d'autres agents). `
    + `Un processus se vise par le PID noté à son lancement : \`node ${SCRIPT_PROCESSUS} lancer --fichier-pid <fichier> -- <commande>\` le note, \`node ${SCRIPT_PROCESSUS} arreter --pid <n> --arbre\` arrête ce processus et ses enfants puis VÉRIFIE par la liste des processus (TF-2731).`);
  return motifs.length ? { decision: "refuse", motif: motifs.join("\n") } : { decision: "laisse" };
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase()) {
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = {};
  try { entree = JSON.parse(brut || "{}"); } catch { /* entrée illisible : pas un appel d'outil */ }
  let v = { decision: "laisse" };
  try { v = juger(entree); } catch { /* une panne du juge ne bloque jamais un outil */ }
  if (v.decision === "refuse") { process.stderr.write(v.motif + "\n"); process.exit(2); }
  process.exit(0);
}
