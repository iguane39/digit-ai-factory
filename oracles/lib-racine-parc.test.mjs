#!/usr/bin/env node
/**
 * lib-racine-parc.test.mjs — la racine du parc est celle qui porte le pilot (TF-2720, TF-2705, 22/11/2026).
 *
 * Deux sens à chaque règle :
 *   · ROUGE — un `FORGE_ROOT` qui pointe sous `.claude\worktrees` (la valeur relevée le 15/11/2026), un dossier vide, une racine
 *     absente : jugés « sans-pilot », avec le motif ; la racine conseillée d'un arbre lié (vrai `git worktree add`) n'est PAS le
 *     parent de l'arbre ;
 *   · VERT — une racine qui porte le pilot, une variable absente, la racine conseillée d'un dépôt ordinaire.
 * Le remède est JOUÉ (TF-1013) : la valeur que le refus conseille passe le même jugement.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { jugerForgeRoot, portePilot, racineConseillee, remedeForgeRoot, SIGNATURE_PILOT, SOUS_ARBRE_LIE } from "./lib-racine-parc.mjs";

let ok = 0, ko = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); ok++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); ko++; } };
const att = (c, m) => { if (!c) throw new Error(m); };
const meme = (a, b) => resolve(String(a)).toLowerCase() === resolve(String(b)).toLowerCase();

const base = mkdtempSync(join(tmpdir(), "racine-parc-"));
const git = (cwd, ...a) => execFileSync("git", ["-C", cwd, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const poserPilot = (dossier) => { for (const f of SIGNATURE_PILOT) { mkdirSync(dirname(join(dossier, f)), { recursive: true }); writeFileSync(join(dossier, f), "x\n"); } };

try {
  // Un parc : <base>/parc/digit-ai-factory (dépôt git, signature posée) + un arbre lié sous .claude/worktrees.
  const parc = join(base, "parc");
  const pilot = join(parc, "digit-ai-factory");
  mkdirSync(pilot, { recursive: true });
  git(pilot, "init", "--quiet", "--initial-branch=main");
  poserPilot(pilot);
  writeFileSync(join(pilot, ".gitignore"), ".claude/worktrees/\n");
  git(pilot, "add", "-A");
  git(pilot, "commit", "--quiet", "-m", "départ");
  const arbre = join(pilot, ".claude", "worktrees", "agent-essai");
  git(pilot, "worktree", "add", "--quiet", "-b", "essai", arbre);
  const arbreFrere = join(base, "_wt-essai");
  git(pilot, "worktree", "add", "--quiet", "-b", "frere", arbreFrere);

  check("rouge — FORGE_ROOT sous .claude\\worktrees (la valeur du 15/11/2026) : sans-pilot, motif qui nomme l'arbre lié", () => {
    const j = jugerForgeRoot({ FORGE_ROOT: join(pilot, ".claude", "worktrees") });
    att(j.etat === "sans-pilot", JSON.stringify(j));
    att(/SOUS `\.claude\\worktrees`/.test(j.motif) && /arbre lié/.test(j.motif), j.motif);
  });
  check("rouge — une racine inexistante et un dossier vide sont sans-pilot, avec un motif distinct", () => {
    const absente = jugerForgeRoot({ FORGE_ROOT: join(base, "n-existe-pas") });
    att(absente.etat === "sans-pilot" && /n'existe pas/.test(absente.motif), JSON.stringify(absente));
    const vide = join(base, "vide"); mkdirSync(vide);
    const jv = jugerForgeRoot({ FORGE_ROOT: vide });
    att(jv.etat === "sans-pilot" && /ne contient pas digit-ai-factory/.test(jv.motif), JSON.stringify(jv));
  });
  check("rouge — un dossier qui ne porte qu'une partie de la signature n'est pas un pilot", () => {
    const partiel = join(base, "partiel", "digit-ai-factory"); mkdirSync(join(partiel, "oracles"), { recursive: true });
    writeFileSync(join(partiel, "oracles", "oracle-conformite-projet.mjs"), "x\n");
    att(!portePilot(partiel), "une signature partielle est prise pour le pilot");
    att(jugerForgeRoot({ FORGE_ROOT: join(base, "partiel") }).etat === "sans-pilot", "la racine au pilot partiel est jugée valide");
  });
  check("vert — la racine du parc, qui porte le pilot : valide ; variable absente : absente (rien à refuser)", () => {
    const j = jugerForgeRoot({ FORGE_ROOT: parc });
    att(j.etat === "valide" && meme(j.forgeRoot, parc), JSON.stringify(j));
    att(jugerForgeRoot({}).etat === "absente" && jugerForgeRoot({ FORGE_ROOT: "" }).etat === "absente", "une variable absente ou vide n'est pas « absente »");
  });
  check("rouge → vert — la racine conseillée d'un VRAI arbre lié (.claude\\worktrees puis dossier frère) est le parc, pas le parent de l'arbre", () => {
    att(meme(racineConseillee(arbre), parc), `arbre sous .claude\\worktrees : ${racineConseillee(arbre)} au lieu de ${parc}`);
    att(!meme(racineConseillee(arbre), dirname(arbre)), "la racine conseillée est le parent de l'arbre lié (le défaut de TF-2720)");
    att(meme(racineConseillee(arbreFrere), parc), `arbre frère _wt- : ${racineConseillee(arbreFrere)} au lieu de ${parc}`);
    att(meme(racineConseillee(pilot), parc), `dépôt principal : ${racineConseillee(pilot)}`);
  });
  check("rouge → vert — sans git, la racine d'un chemin .claude\\worktrees se déduit du chemin ; un dossier ordinaire rend son parent", () => {
    const sansGit = { principal: () => null };
    const sous = join(base, "x", "digit-ai-factory", ".claude", "worktrees", "agent-1");
    att(meme(racineConseillee(sous, sansGit), join(base, "x")), `déduite : ${racineConseillee(sous, sansGit)}`);
    att(meme(racineConseillee(join(base, "y", "digit-ai-factory"), sansGit), join(base, "y")), "dépôt ordinaire");
    att(SOUS_ARBRE_LIE.test(sous) && !SOUS_ARBRE_LIE.test(join(base, "claude", "worktrees-ancien")), "motif d'arbre lié");
  });
  check("rouge — la recette agrégée REFUSE (exit 3, aucun cas joué) sous un FORGE_ROOT sans pilot, remède nommé ; le refus se joue avant toute recette", () => {
    const vide = join(base, "vide-recette"); mkdirSync(vide);
    const r = spawnSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), "self-tests.mjs")], { encoding: "utf8", env: { ...process.env, FORGE_ROOT: vide }, timeout: 60000 });
    att(r.status === 3, `exit ${r.status} : ${String(r.stdout).slice(0, 200)}${String(r.stderr).slice(0, 300)}`);
    att(/PRÉREQUIS ABSENT \(TF-2720\)/.test(r.stderr) && /poser FORGE_ROOT=/.test(r.stderr), `refus sans remède : ${r.stderr.slice(0, 300)}`);
    att(!/\[OK\]|PASS/.test(r.stdout), "des recettes ont été jouées malgré le refus");
  });
  check("--juger (la commande que le contrat d'agent prescrit) : exit 0 sous un parc qui porte le pilot, exit 3 et remède sous une racine sans pilot, aucune autre variable affichée", () => {
    const juger = (forgeRoot) => spawnSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), "lib-racine-parc.mjs"), "--juger"], { encoding: "utf8", env: { ...process.env, FORGE_ROOT: forgeRoot, JETON_ESSAI_TF2721: "valeur-secrete-factice" } });
    const bon = juger(parc), mauvais = juger(join(pilot, ".claude", "worktrees"));
    att(bon.status === 0 && /FORGE_ROOT valide/.test(bon.stdout), `parc : exit ${bon.status} ${bon.stdout}${bon.stderr}`);
    att(mauvais.status === 3 && /FORGE_ROOT SANS PILOT/.test(mauvais.stderr) && /poser FORGE_ROOT=/.test(mauvais.stderr), `racine sans pilot : exit ${mauvais.status} ${mauvais.stderr}`);
    att(!bon.stdout.includes("valeur-secrete-factice") && !mauvais.stderr.includes("valeur-secrete-factice"), "une autre variable de l'environnement est affichée");
  });
  check("remède joué — la valeur que le refus conseille, posée dans FORGE_ROOT, passe le même jugement", () => {
    const mauvais = jugerForgeRoot({ FORGE_ROOT: join(pilot, ".claude", "worktrees") });
    att(mauvais.etat === "sans-pilot", "le cas rouge n'est pas rouge");
    const remede = remedeForgeRoot(arbre);
    const valeur = /FORGE_ROOT=(\S+)/.exec(remede)?.[1];
    att(valeur && jugerForgeRoot({ FORGE_ROOT: valeur }).etat === "valide", `le remède « ${remede} » ne rend pas un parc valide`);
  });
} finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* arbres liés verrouillés : le dossier temporaire du système les reprend */ } }

console.log(`\nlib-racine-parc (TF-2720, TF-2705) : ${ok} PASS, ${ko} FAIL — cas rouges : racine sous .claude\\worktrees, racine absente ou vide, signature partielle, arbre lié`);
process.exit(ko ? 1 : 0);
