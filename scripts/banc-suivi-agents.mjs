#!/usr/bin/env node
/**
 * banc-suivi-agents.mjs — BANC DE BOUT EN BOUT DU SUIVI DES AGENTS (prompt 20261112g, ÉTAPE 5 ; D-209 (a) du 12/11/2026).
 *
 * Ouvre une VRAIE session Claude Code (`claude -p --input-format stream-json`, sur l'abonnement) dans un dossier de banc hors
 * de tout dépôt, câblée avec les hooks RÉELS du pilot : `oracles/hook-restitution.mjs` et `oracles/hook-suivi-agents.mjs --veille`
 * (Stop, asyncRewake) et `oracles/hook-suivi-agents.mjs` (PostToolUse). La session reçoit UN seul message : lancer un ou
 * plusieurs agents factices en arrière-plan par l'outil Agent, puis clore son tour sur « Lancé. ». Elle ne reçoit plus rien :
 * l'entrée reste ouverte, muette, pendant `--duree-min`. Tout point de suivi vient donc du mécanisme.
 *
 * Pourquoi l'entrée continue plutôt qu'un `claude -p "<prompt>"` : l'essai du 12/11 à 21:21 a prouvé qu'un `claude -p` attend
 * un hook asyncRewake de 60 s ; une attente de 15 min avec des agents d'arrière-plan n'est pas prouvée en `-p` simple, et un
 * relevé du 05/11 rapporte des agents coupés 10 min après la fin du tour (TF-2193). L'entrée continue garde la session ouverte.
 *
 * Bancs (agents factices, `scripts/banc-agent-factice.mjs`) :
 *   e2e       un agent de 35 min                      → points attendus à 15 et 30 min (± 2) ;
 *   fige      agents « fige » (40 min, muet après 12) et « commande » (commande de 20 min annoncée)
 *             → au point de 15 : fige « actif », commande « commande longue » ; au point de 30 : fige « présumé arrêté » ;
 *   court     un agent de 10 min                       → aucun point.
 *
 * Réglages de banc, déclarés : `BASH_MAX_TIMEOUT_MS` et `CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS` relevés pour que la commande
 * de l'agent factice reste au premier plan (TF-2463) ; `FORGE_HOOKS_JOURNAL` dérivé vers le dossier du banc.
 *
 * Usage : node scripts/banc-suivi-agents.mjs --banc e2e|fige|court --dossier <dossier hors dépôt> [--duree-min 45] [--modele sonnet]
 * Sortie : <dossier>/sortie.jsonl (flux de la session), <dossier>/banc.json (session, transcript, heures).
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, createWriteStream, existsSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const PILOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const opt = (n, d = null) => { const i = process.argv.indexOf(n); return i > 1 ? process.argv[i + 1] : d; };
const banc = opt("--banc");
const dossier = opt("--dossier") && resolve(opt("--dossier"));
const dureeMin = Number(opt("--duree-min", "45"));
const modele = opt("--modele", "sonnet");
if (!["e2e", "fige", "court"].includes(banc) || !dossier) { console.error("usage : --banc e2e|fige|court --dossier <dossier>"); process.exit(2); }
if (dossier.toLowerCase().startsWith("c:\\dev")) { console.error("le dossier de banc doit être hors des dépôts (c:\\dev)"); process.exit(2); }

const slash = (p) => p.replace(/\\/g, "/");
mkdirSync(join(dossier, ".claude"), { recursive: true });
const hook = (args, extra = {}) => ({ type: "command", command: `node "${slash(join(PILOT, "oracles", args[0]))}"${args[1] ? ` ${args[1]}` : ""}`, ...extra });
writeFileSync(join(dossier, ".claude", "settings.json"), JSON.stringify({
  hooks: {
    Stop: [{ hooks: [hook(["hook-restitution.mjs"], { timeout: 60 }), hook(["hook-suivi-agents.mjs", "--veille"], { timeout: 1200, asyncRewake: true })] }],
    PostToolUse: [{ hooks: [hook(["hook-suivi-agents.mjs"], { timeout: 10 })] }],
  },
}, null, 2));

const agentFactice = (scenario) => {
  const av = slash(join(dossier, `avancement-${scenario}.jsonl`));
  const commande = `node "${slash(join(PILOT, "scripts", "banc-agent-factice.mjs"))}" --scenario ${scenario} --avancement "${av}"`;
  return `Tu es un agent de banc. Ta seule tâche : lancer avec l'outil Bash, AU PREMIER PLAN (run_in_background: false), avec le paramètre timeout 2700000, exactement la commande suivante, puis attendre qu'elle rende la main.\n\n${commande}\n\nTon fichier d'avancement est ${av} ; la commande l'écrit seule. Quand elle rend la main, réponds « fini » et rien d'autre. N'emploie aucun autre outil, ne relance rien.`;
};
const lancer = (scenario) => `- un agent de type general-purpose, modèle haiku, description « banc ${scenario} », run_in_background: true, dont la consigne est, mot pour mot, entre les balises :\n<consigne>\n${agentFactice(scenario)}\n</consigne>`;
const SCENARIOS = { e2e: ["e2e"], fige: ["fige", "commande"], court: ["court"] };
const message = `Banc du suivi des agents. Lance avec l'outil Agent, dans un seul message et en arrière-plan :\n${SCENARIOS[banc].map(lancer).join("\n")}\n\nPuis termine ton tour en écrivant exactement « Lancé. » et rien d'autre. N'appelle aucun autre outil.`;

const env = { ...process.env, BASH_MAX_TIMEOUT_MS: "3000000", CLAUDE_CODE_AUTO_BACKGROUND_TIMEOUT_MS: "3000000", FORGE_HOOKS_JOURNAL: slash(join(dossier, "hooks-journal.jsonl")) };
const exe = existsSync(join(homedir(), "AppData", "Roaming", "npm", "node_modules", "@anthropic-ai", "claude-code", "bin", "claude.exe"))
  ? join(homedir(), "AppData", "Roaming", "npm", "node_modules", "@anthropic-ai", "claude-code", "bin", "claude.exe") : "claude";
const args = ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose", "--model", modele, "--permission-mode", "bypassPermissions"];
const sortie = createWriteStream(join(dossier, "sortie.jsonl"));
const debut = new Date();
const enfant = spawn(exe, args, { cwd: dossier, env, stdio: ["pipe", "pipe", "pipe"] });
enfant.stdout.pipe(sortie);
const erreurs = createWriteStream(join(dossier, "erreurs.txt"));
enfant.stderr.pipe(erreurs);
enfant.stdin.write(JSON.stringify({ type: "user", message: { role: "user", content: message } }) + "\n");
const bilan = { banc, dossier, debut: debut.toISOString(), duree_min: dureeMin, modele, exe, message };
writeFileSync(join(dossier, "banc.json"), JSON.stringify(bilan, null, 1));
const fermer = setTimeout(() => { try { enfant.stdin.end(); } catch { /* déjà fermée */ } }, dureeMin * 60000);
const tuer = setTimeout(() => { try { enfant.kill(); } catch { /* déjà finie */ } }, (dureeMin + 3) * 60000);
enfant.on("exit", (code) => {
  clearTimeout(fermer); clearTimeout(tuer);
  let session = null;
  try { for (const l of readFileSync(join(dossier, "sortie.jsonl"), "utf8").split("\n")) { const o = JSON.parse(l || "null"); if (o && o.session_id) { session = o.session_id; break; } } } catch { /* sortie vide */ }
  const projet = dossier.replace(/[^A-Za-z0-9]/g, "-");
  const transcript = session ? join(homedir(), ".claude", "projects", projet, `${session}.jsonl`) : null;
  writeFileSync(join(dossier, "banc.json"), JSON.stringify({ ...bilan, fin: new Date().toISOString(), code, session, transcript, transcript_existe: transcript ? existsSync(transcript) : false }, null, 1));
  console.log(`banc ${banc} fini, code ${code}, session ${session}, transcript ${transcript}`);
  process.exit(0);
});
