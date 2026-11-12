#!/usr/bin/env node
/**
 * hooks-factory.mjs — lanceur des hooks de la factory DEPUIS un produit (copié en
 * forge\hooks\factory.mjs à l'ouverture du run — gabarits\settings-produit.json, R-44).
 *
 * Il ne porte aucune règle : il RÉSOUT le pilot (même ordre que AGENTS.md — $FORGE_ROOT,
 * parent du produit, c:\dev, ~/.digit-ai-forge) et délègue au hook du pilot, stdin compris
 * (le hook Stop lit le transcript sur stdin). Ainsi une règle corrigée dans la factory
 * s'applique au produit sans recopie — et quand la factory est impliquée, ses règles
 * priment sur celles du projet (R-43).
 *
 * Usage : node forge\hooks\factory.mjs <ouverture|restitution|page-html|lexique> [options du hook]
 * Pilot introuvable : le hook est sauté en le DISANT (stderr), jamais en silence, exit 0 —
 * un produit ne doit pas devenir inutilisable parce que la factory n'est pas sur ce poste.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PRODUIT = resolve(ICI, "..", "..");
const [nom, ...options] = process.argv.slice(2);
// `page-html` (TF-0765, 02/09/2026) : hook PostToolUse joué à chaque écriture d'un fichier .html du
// produit — les règles de socle d'une page (filtres de tableau L4 / G1-G6) se rencontrent au moment
// où l'on produit, pas au pilot trois livraisons plus tard. Avertit, ne bloque jamais.
// `lexique` (03/09/2026, mandat d'amélioration continue) : hook UserPromptSubmit — le lexique
// d'invocation RV-6 (« améliore le prompt », « l99 », « barre », « améliore ce skill ») cesse d'être
// une consigne que l'agent oublie : le hook reconnaît le mot-clé et injecte l'appel du skill.
// `ecriture` (12/09/2026, mandat humain D-1 (a) de la synthèse 20260911j, TF-1064) : hook PostToolUse
// joué à chaque écriture d'un fichier .md du produit — le plancher d'écriture du pilot
// (references/ECRITURE.md, E-1..E-12) se rencontre au moment où l'on écrit : densités de tournures
// creuses par famille, phrases longues en série, puces trop profondes, emphase de structure.
// Avertit, ne bloque jamais.
// `publication-hebergee` (12/10/2026, TF-1592, retour RT-117) : hook PreToolUse sur l'outil Artifact —
// R-38 (aucun livrable publié sur un service hébergé sans GO humain consigné) cesse d'être une phrase
// que la session lit ou non : l'outil qui publie est refusé tant qu'aucun GO n'est consigné. Bloque.
// `droits-accordes` (13/10/2026, TF-1528) : hook PostToolUse joué à chaque écriture d'un script ou d'un fichier
// d'infrastructure — le contrôle des droits accordés (identifiants Graph, échec masqué, succès sans relecture)
// se joue quand le produit écrit le script, pas à la mise en production. Avertit, ne bloque jamais.
// `identite-sortante` (15/10/2026, TF-1716, retour RT-5 du 14/10) : hook PreToolUse sur Bash, PowerShell et
// WebFetch — R-62 (aucune donnée d'identité de l'utilisateur vers un service tiers sans sa demande) se joue
// sur l'outil qui émet la requête : l'adresse de l'utilisateur, ou une adresse dans un User-Agent, refusée. Bloque.
// `remisage` (15/10/2026, TF-1754, retour RT-59) : hook PreToolUse sur Bash et PowerShell — la pile de remisage git
// est partagée entre arbres de travail et sessions : `git stash` nu, `pop`, un remisage sans `-m`, `apply` sans SHA,
// `drop` nu et `clear` sont refusés ; `push -u -m <étiquette>`, `apply <sha>` et `list` passent. Bloque.
// `reprise` (15/10/2026, TF-1736, décision humaine D-3 (b), R-64) : hook SessionStart (asynchrone) et Stop —
// un produit dont le développeur a déclaré un canal de reprise (forge/REPRISE.json) se reprend sur tous ses
// postes sans geste humain : restauration depuis le canal à l'ouverture, envoi vers le canal en fin de tour
// sous le feu vert de publication consigné. Ne bloque jamais.
// `flotte` (18/10/2026, décision humaine D-19 (a)) : hook PreToolUse sur l'outil Agent — une délégation vise un
// agent nommé de la flotte (`.claude/agents/`, modèle, effort et outils déclarés), ou déclare `model` ET `effort`
// pour garder l'agent générique ; sinon un rappel entre dans le contexte de la session. Avertit, ne bloque jamais.
// `gestes-distants` (26/10/2026, TF-1959, décision humaine D-77 (b) amendée) : hook PreToolUse sur Bash et PowerShell —
// une décision groupée pour tous les gestes destructifs distants du tour, jamais une confirmation par commande :
// `az … delete`, `terraform destroy`, une attribution de droits, `gh repo delete`, `git push --force` sont refusés
// tant qu'aucun lot approuvé valide (forge/gestes-approuves.jsonl, 24 h au plus) ne les couvre. Bloque. Le mode
// `--poser` (écrire le lot approuvé) n'a pas non plus l'usage de l'entrée standard. TF-2084 (04/11/2026) : le même hook,
// en PreToolUse et en PostToolUse, tient le registre `forge/gestes-en-cours.jsonl` des gestes distants ouverts par les
// sessions du produit et AVERTIT quand une autre session a un geste ouvert sur la même ressource ; `--ouvrir`, `--clore`
// et `--lister` déclarent ou lisent un geste à la main (un banc), sans entrée standard non plus.
// `mutation-en-cours` (04/11/2026, TF-2126) : hook PreToolUse sur Bash et PowerShell — la campagne de mutation de
// forge-tests altère les sources EN PLACE et pose `.forge-tests-mutation-en-cours` (TF-2091) ; tant que ce verrou
// existe, `git commit`, le `git add` d'un fichier muté et un déploiement sont refusés, avec les fichiers mutés
// nommés et le remède d'un verrou orphelin (pid mort). Bloque.
// `lecons` (04/11/2026, TF-2150, décision humaine D-172 (a)) : hook PreToolUse sur Bash, PowerShell, Write, Edit et
// MultiEdit — la table des leçons du pilot (references/LECONS.json) et celle du produit (forge/LECONS.jsonl) sont lues
// au moment du geste : la leçon dont le déclencheur correspond entre au contexte, citée comme une donnée (600 caractères
// au plus, 3 leçons au plus), et chaque rappel servi s'écrit à forge/lecons-rappels.jsonl. Une leçon en barrière, qui
// refuse le geste au pilot, AVERTIT seulement chez un produit en v1. Ne bloque jamais chez un produit.
// `couts` (05/11/2026, TF-2181, GO humain « A1 », lecture de la charge D-177) : hook SessionEnd et SessionStart (asynchrone,
// `--rattraper`) — la session qui se ferme est relevée par scripts/relever-couts.mjs du pilot et sa ligne s'écrit à
// forge/couts-<poste>.jsonl : jetons, temps actif, charge en 3 indicateurs séparés, ventilation par run et par étape. Aucun montant
// écrit ; ne bloque jamais.
// `controles-produit` (06/11/2026, TF-2211, retour RP-31 de Produit-86) : hook PostToolUse sur Bash et PowerShell — la clé
// `controles_produit` de forge/PROFIL.json désigne les contrôles PROPRES du produit (commande en tableau, `quand` : run_open, run_close) ;
// la commande qui vient d'écrire un run_open ou un run_close au ledger les déclenche, et leur verdict entre au contexte de la session. Ne bloque jamais.
// `suivi-agents` (12/11/2026, D-209 (a), prompt « Suivi des agents toutes les 15 minutes » 20261112g) : hook Stop en `asyncRewake`
// (`--veille`) et hook PostToolUse — tant qu'un sous-agent de la session tourne, la session est réveillée toutes les 15 minutes, même
// après la fin de son tour, et écrit un point « Suivi agents » : état de chaque agent jugé de l'extérieur (actif, silencieux, commande
// longue, présumé arrêté, fini) avec l'âge mesuré, tâches faites et restantes lues à son fichier d'avancement. La veille attend jusqu'à
// 19 min : le délai du lanceur est porté à 1 190 s pour elle seule. Ne bloque jamais un outil.
const NOMS = new Set(["ouverture", "restitution", "page-html", "lexique", "ecriture", "publication-hebergee", "droits-accordes", "identite-sortante", "remisage", "reprise", "flotte", "gestes-distants", "mutation-en-cours", "lecons", "couts", "controles-produit", "suivi-agents"]);
if (!NOMS.has(nom)) { console.error(`[hooks-factory] hook inconnu : ${nom} (attendu : ${[...NOMS].join(" | ")})`); process.exit(0); }

const candidats = [
  process.env.FORGE_ROOT && join(process.env.FORGE_ROOT, "digit-ai-factory"),
  join(dirname(PRODUIT), "digit-ai-factory"),
  "c:\\dev\\digit-ai-factory",
  join(homedir(), ".digit-ai-forge", "digit-ai-factory"),
].filter(Boolean);
const pilot = candidats.find((c) => existsSync(join(c, "bootstrap.mjs")) && existsSync(join(c, "oracles", `hook-${nom}.mjs`)));
if (!pilot) {
  console.error(`[hooks-factory] pilot introuvable (${candidats.join(" ; ")}) — hook ${nom} SAUTÉ, règle non jouée : installer la factory (AGENTS.md phase 0) ou exporter FORGE_ROOT.`);
  process.exit(0);
}
// TF-1765 (15/10/2026) : `--prejuger <fichier>` juge un FICHIER et n'a pas l'usage de l'entrée standard ;
// la lire attendait sa fermeture, et un préjugement lancé avec une entrée ouverte n'a rien rendu en
// 9 minutes le 14/10. Elle n'est donc pas lue en préjugement, ni quand elle est un terminal.
let stdin = "";
if (!["--prejuger", "--poser", "--ouvrir", "--clore", "--lister"].some((o) => options.includes(o)) && !process.stdin.isTTY) {
  try { stdin = readFileSync(0, "utf8"); } catch { /* pas de stdin (SessionStart) */ }
}
const argv = [join(pilot, "oracles", `hook-${nom}.mjs`), ...options];
if (nom === "ouverture") argv.push("--pilot", pilot);
const delai = nom === "suivi-agents" && options.includes("--veille") ? 1190000 : 230000;
const r = spawnSync(process.execPath, argv, { encoding: "utf8", input: stdin, cwd: PRODUIT, timeout: delai });
if (r.stdout) process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);
process.exit(r.status ?? 0);
