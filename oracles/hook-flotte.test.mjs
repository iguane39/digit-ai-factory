#!/usr/bin/env node
/**
 * hook-flotte.test.mjs — une délégation vise un agent de la flotte, ou dit sa dérogation (D-19 (a), 18/10/2026).
 * Sens rouge (avertit, exit 0, rappel dans `additionalContext`) : la forme mesurée le 18/10 (agent générique
 * sans modèle ni effort), un appel sans type, `Explore` sans modèle, un générique avec modèle mais sans effort,
 * et l'ancien nom d'outil `Task`. Sens vert (silence, exit 0) : un agent nommé du projet, un générique qui
 * déclare modèle ET effort, un agent intégré à modèle fixe, un autre outil, une entrée illisible.
 * Isolation (TF-2426) : `isolation: "worktree"` refusée (exit 2) quand le dossier courant est le dépôt d'un autre produit que celui de la session, ou
 * quand la consigne ne nomme pas le dépôt de la copie de travail ; elle passe pour un arbre lié du même dépôt, un sous-dossier, un dépôt nommé, sans
 * isolation, ou hors d'un dépôt git (non jugé). Dépôts git réels jetables.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { racineDuProjet } from "./lib-racine-projet.mjs";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-flotte.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

// Un projet jetable qui porte deux agents nommés, et un « poste » vide : le hook ne lit pas le vrai poste.
const racine = mkdtempSync(join(tmpdir(), "hook-flotte-"));
const projet = join(racine, "projet"), maison = join(racine, "maison");
mkdirSync(join(projet, ".claude", "agents"), { recursive: true });
mkdirSync(maison, { recursive: true });
for (const n of ["campagne", "explorateur"]) writeFileSync(join(projet, ".claude", "agents", `${n}.md`), `---\nname: ${n}\n---\n`);

// `CLAUDE_PROJECT_DIR` (posée aux hooks par Claude Code) ne fuit pas dans la recette : chaque cas la pose lui-même (TF-1943).
const jouer = (entree, projetDir = null) => {
  const env = { ...process.env, USERPROFILE: maison, HOME: maison };
  delete env.CLAUDE_PROJECT_DIR;
  if (projetDir) env.CLAUDE_PROJECT_DIR = projetDir;
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: typeof entree === "string" ? entree : JSON.stringify(entree), env });
  let ctx = "";
  try { ctx = JSON.parse(r.stdout || "{}").hookSpecificOutput?.additionalContext || ""; } catch { ctx = "<stdout illisible>"; }
  return { code: r.status, ctx, out: r.stdout || "", err: r.stderr || "" };
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
check("TF-2554 — l'avertissement de flotte décrit le `relecteur` : lecture seule, sans Write, Edit ni shell, pour qu'un relecteur ne parte pas en agent générique", () => {
  const r = jouer(appel({ subagent_type: "general-purpose" }));
  if (!/relecteur : relecture aveugle en lecture seule, sans Write, Edit ni shell/.test(r.ctx)) throw new Error(`le relecteur n'est pas décrit : ${r.ctx.slice(0, 400)}`);
});
check("rouge — sans agent nommé visible, le rappel le dit au lieu d'inventer une flotte", () => {
  const vide = join(racine, "vide"); mkdirSync(vide, { recursive: true });
  const r = jouer({ tool_name: "Agent", tool_input: { subagent_type: "general-purpose" }, cwd: vide });
  if (!/Aucun agent nommé n'est visible ici/.test(r.ctx)) throw new Error(r.ctx.slice(0, 200));
});

const VERTS = [
  [appel({ subagent_type: "verificateur", description: "Relecture d'intention consigne" }), "la relecture d'intention elle-même (sinon chaque relecture en appellerait une)"],
  [{ tool_name: "Bash", tool_input: { command: "ls" }, cwd: projet }, "un autre outil"],
  ["{pas du json", "une entrée illisible"],
];
for (const [entree, nom] of VERTS) {
  check(`vert — ${nom} : silence, exit 0`, () => {
    const r = jouer(entree);
    if (r.code !== 0 || r.out.trim()) throw new Error(`exit ${r.code}, sortie « ${r.out.slice(0, 120)} »`);
  });
}

// D-23 (a) du 18/10/2026 — « chaque consigne d'agent » : TOUT appel d'agent rappelle la relecture de sa consigne, pas seulement
// les agents d'écriture (restriction relevée par la relecture de fin de tour RI-20261018-01). Même sortie, exit 0, jamais un refus.
for (const nom of ["campagne", "constructeur", "redacteur", "explorateur", "verificateur", "relecteur", "claude-code-guide"]) {
  check(`rouge — un appel vers « ${nom} » rappelle la relecture de la consigne sans bloquer`, () => {
    const r = jouer(appel({ subagent_type: nom }));
    if (r.code !== 0) throw new Error(`exit ${r.code} : un rappel ne bloque jamais`);
    if (!/RELECTURE D'INTENTION \(essai D-23 \(a\)/.test(r.ctx)) throw new Error(`aucun rappel : ${r.out.slice(0, 160)}`);
    if (!r.ctx.includes(`« ${nom} »`) || !/--preparer consigne --fichier/.test(r.ctx) || !/verificateur/.test(r.ctx) || !/jamais blocage/.test(r.ctx))
      throw new Error(`le rappel ne nomme pas l'agent, la commande, le relecteur ou l'absence de blocage : ${r.ctx.slice(0, 260)}`);
    if (/FLOTTE D'AGENTS/.test(r.ctx)) throw new Error("un agent nommé reçoit l'avertissement de flotte en plus du rappel");
  });
}
check("rouge — l'ancien nom d'outil Task vers « campagne » rappelle aussi la relecture", () => {
  if (!/RELECTURE D'INTENTION/.test(jouer(appel({ subagent_type: "campagne" }, "Task")).ctx)) throw new Error("Task passe sans rappel");
});
check("rouge — sans agent nommé visible, un appel vers « constructeur » rappelle quand même (le rappel ne dépend pas du dossier)", () => {
  const vide = join(racine, "vide2"); mkdirSync(vide, { recursive: true });
  if (!/RELECTURE D'INTENTION/.test(jouer({ tool_name: "Agent", tool_input: { subagent_type: "constructeur" }, cwd: vide }).ctx)) throw new Error("rappel absent");
});
check("rouge — une dérogation dite (générique avec model ET effort) reçoit le rappel de relecture, sans l'avertissement de flotte", () => {
  const r = jouer(appel({ subagent_type: "general-purpose", model: "sonnet", effort: "medium" }));
  if (r.code !== 0 || !/RELECTURE D'INTENTION/.test(r.ctx) || /FLOTTE D'AGENTS/.test(r.ctx)) throw new Error(`sortie inattendue : « ${r.out.slice(0, 160)} »`);
});
check("rouge — un générique sans modèle reçoit l'avertissement de flotte ET le rappel de relecture", () => {
  const r = jouer(appel({ subagent_type: "general-purpose" }));
  if (!/FLOTTE D'AGENTS/.test(r.ctx) || !/RELECTURE D'INTENTION/.test(r.ctx)) throw new Error(r.ctx.slice(0, 200));
});

// TF-1943 (29/10/2026) — LE HOOK JUGE LE PROJET, PAS LE SOUS-DOSSIER OÙ LA SESSION S'EST DÉPLACÉE. Depuis que les hooks se déclenchent après un `cd`
// (commandes ancrées sur CLAUDE_PROJECT_DIR, TF-1903), l'entrée porte `cwd` = le sous-dossier. Mesuré le 21/10/2026 : lancé depuis un sous-dossier, le hook
// répondait « Aucun agent nommé n'est visible ici » alors que le projet en porte deux. ROUGE : le MÊME appel, `cwd` dans un sous-dossier, par la racine git
// puis par CLAUDE_PROJECT_DIR. VERT : un dossier sans dépôt ni variable reste son propre projet (le cas « vide » ci-dessus).
const projetGit = join(racine, "projet-git");
mkdirSync(join(projetGit, ".git"), { recursive: true });
mkdirSync(join(projetGit, ".claude", "agents"), { recursive: true });
mkdirSync(join(projetGit, "src", "profond"), { recursive: true });
for (const n of ["campagne", "explorateur"]) writeFileSync(join(projetGit, ".claude", "agents", `${n}.md`), `---\nname: ${n}\n---\n`);
check("rouge — cwd dans un sous-dossier d'un dépôt : les agents du projet sont listés (racine git)", () => {
  const r = jouer({ tool_name: "Agent", tool_input: { subagent_type: "general-purpose" }, cwd: join(projetGit, "src", "profond") });
  if (/Aucun agent nommé n'est visible ici/.test(r.ctx)) throw new Error("le hook a lu le sous-dossier : « Aucun agent nommé n'est visible ici »");
  if (!/campagne, explorateur/.test(r.ctx)) throw new Error(`la flotte du projet n'est pas listée : ${r.ctx.slice(0, 200)}`);
});
check("rouge — CLAUDE_PROJECT_DIR prime sur cwd : les agents du projet sont listés depuis un dossier sans rien", () => {
  const ailleurs = join(racine, "ailleurs"); mkdirSync(ailleurs, { recursive: true });
  const r = jouer({ tool_name: "Agent", tool_input: { subagent_type: "general-purpose" }, cwd: ailleurs }, projet);
  if (!/campagne, explorateur/.test(r.ctx)) throw new Error(`la variable est ignorée : ${r.ctx.slice(0, 200)}`);
});
check("vert — CLAUDE_PROJECT_DIR périmée (dossier absent) : repli sur la racine git de cwd", () => {
  const r = jouer({ tool_name: "Agent", tool_input: { subagent_type: "general-purpose" }, cwd: join(projetGit, "src") }, join(racine, "n-existe-pas"));
  if (!/campagne, explorateur/.test(r.ctx)) throw new Error(`pas de repli : ${r.ctx.slice(0, 200)}`);
});
check("lib — racineDuProjet : variable, puis .git (dossier ou fichier d'arbre lié), puis cwd ; un .claude ne marque pas la racine", () => {
  const un = (cwd, env) => racineDuProjet(cwd, env);
  const egal = (a, b, nom) => { if (resolve(a) !== resolve(b)) throw new Error(`${nom} : ${a} ≠ ${b}`); };
  egal(un(join(projetGit, "src", "profond"), {}), projetGit, "racine git en dossier");
  const arbre = join(racine, "arbre-lie"); mkdirSync(join(arbre, "a", "b"), { recursive: true }); writeFileSync(join(arbre, ".git"), "gitdir: ../x\n");
  egal(un(join(arbre, "a", "b"), {}), arbre, "racine git en fichier (arbre de travail lié)");
  egal(un(join(projet, ".claude", "agents"), {}), join(projet, ".claude", "agents"), "un .claude sans .git ne marque pas la racine : cwd lui-même");
  egal(un(join(projetGit, "src"), { CLAUDE_PROJECT_DIR: projet }), projet, "la variable prime");
  egal(un(join(projetGit, "src"), { CLAUDE_PROJECT_DIR: join(racine, "absent") }), projetGit, "variable périmée : repli");
});

// TF-2443 (12/11/2026) — UNE RACINE DE SESSION EN MINUSCULE FAIT REFUSER L'ISOLATION. Rejoué avec Claude Code 2.1.322 : `isolation: "worktree"` depuis `c:\…`
// rend « Refusing to use … as an isolation worktree: git resolves its working tree to C:/… » ; depuis `C:\…`, l'agent démarre. Le hook le dit AVANT le refus.
// ROUGE : l'appel avec isolation depuis une racine en minuscule (cwd, séparateur /, variable de projet, ancien nom Task). VERT : le REMÈDE joué (la même racine en
// majuscule), l'absence d'isolation, un autre outil, un chemin qui ne commence pas par une lettre de lecteur.
const ISOLE = { subagent_type: "general-purpose", model: "sonnet", effort: "medium", isolation: "worktree" };
const racineMin = (cwd, ti = ISOLE, tool_name = "Agent", projetDir = null) => jouer({ tool_name, tool_input: { prompt: "x", description: "y", ...ti }, cwd }, projetDir);
const ROUGES_RACINE = [
  [() => racineMin("c:\\dev\\produit"), "cwd en minuscule", "C:\\dev\\produit"],
  [() => racineMin("c:/dev/produit"), "cwd en minuscule avec séparateurs /", "C:/dev/produit"],
  [() => racineMin("C:\\dev\\produit", ISOLE, "Agent", "d:\\dev\\produit"), "CLAUDE_PROJECT_DIR en minuscule, cwd en majuscule", "D:\\dev\\produit"],
  [() => racineMin("c:\\dev\\produit", ISOLE, "Task"), "l'ancien nom d'outil Task", "C:\\dev\\produit"],
];
for (const [jouerCas, nom, canonique] of ROUGES_RACINE) {
  check(`rouge — isolation depuis une racine en minuscule (${nom}) : avertit sans bloquer, nomme la racine canonique`, () => {
    const r = jouerCas();
    if (r.code !== 0) throw new Error(`exit ${r.code} : un avertissement ne bloque jamais`);
    if (!/RACINE DE SESSION EN MINUSCULE \(TF-2443/.test(r.ctx)) throw new Error(`aucun avertissement : ${r.out.slice(0, 160)}`);
    if (!r.ctx.includes(`« ${canonique} »`)) throw new Error(`la racine canonique ${canonique} n'est pas nommée : ${r.ctx.slice(0, 260)}`);
    if (!/RELECTURE D'INTENTION/.test(r.ctx)) throw new Error("l'avertissement a remplacé le rappel de relecture au lieu de s'y ajouter");
  });
}
check("vert — le remède joué : la même racine en majuscule ne reçoit aucun avertissement de racine", () => {
  const r = racineMin("C:\\dev\\produit");
  if (r.code !== 0 || /RACINE DE SESSION/.test(r.ctx)) throw new Error(`exit ${r.code}, avertissement encore émis : ${r.ctx.slice(0, 160)}`);
});
check("vert — racine en minuscule sans isolation : aucun avertissement de racine (le refus ne vise que l'isolation)", () => {
  const r = racineMin("c:\\dev\\produit", { ...ISOLE, isolation: undefined });
  if (/RACINE DE SESSION/.test(r.ctx)) throw new Error(r.ctx.slice(0, 160));
});
check("vert — isolation sans lettre de lecteur (chemin POSIX, UNC, relatif) : aucun avertissement de racine", () => {
  for (const cwd of ["/home/u/produit", "\\\\hote\\partage\\produit", "dev\\produit"]) {
    const r = racineMin(cwd);
    if (/RACINE DE SESSION/.test(r.ctx)) throw new Error(`${cwd} : ${r.ctx.slice(0, 160)}`);
  }
});
check("vert — un autre outil que l'agent, même avec isolation et racine en minuscule : silence", () => {
  const r = racineMin("c:\\dev\\produit", ISOLE, "Bash");
  if (r.code !== 0 || r.out.trim()) throw new Error(`exit ${r.code}, sortie « ${r.out.slice(0, 120)} »`);
});

// ---- TF-2426 (14/11/2026) : l'isolation suit le dossier courant de la session, pas le produit que la consigne nomme -------------------------------
// Le fait : un agent isolé a reçu la copie du dépôt de Produit-84 au lieu de Produit-86, la session venant d'y lire des migrations. Des dépôts git RÉELS,
// jetables : deux dépôts (alpha, beta), un arbre lié d'alpha et un sous-dossier d'alpha.
const git = (cwd, ...a) => spawnSync("git", ["-C", cwd, "-c", "user.email=t@t", "-c", "user.name=t", "-c", "commit.gpgsign=false", ...a], { encoding: "utf8" });
const alpha = join(racine, "depot-alpha"), beta = join(racine, "depot-beta"), alphaLie = join(racine, "arbre-lie-d-alpha");
for (const d of [alpha, beta]) { mkdirSync(d, { recursive: true }); git(d, "init", "-q", "-b", "main"); writeFileSync(join(d, "a.txt"), "a\n"); git(d, "add", "-A"); git(d, "commit", "-q", "-m", "init"); }
git(alpha, "worktree", "add", "-q", alphaLie);
mkdirSync(join(alpha, "src", "migrations"), { recursive: true });
const isole = (cwd, projetDir, extra = {}, tool_name = "Agent") =>
  jouer({ tool_name, tool_input: { prompt: "Corrige le sujet et rends le rapport.", description: "Campagne", subagent_type: "campagne", isolation: "worktree", ...extra }, cwd }, projetDir);
const refus = (r) => r.code === 2 && /ISOLATION REFUSÉE \(TF-2426/.test(r.err);

check("rouge — TF-2426 : isolation depuis le dépôt d'un AUTRE produit que celui de la session : refusée (exit 2), les deux dépôts nommés, le remède dit", () => {
  const r = isole(beta, alpha, { prompt: "Corrige le sujet dans depot-alpha." });
  if (!refus(r) || !/dossier courant/i.test(r.err)) throw new Error(`exit ${r.code} ${r.err.slice(0, 200)}`);
  if (!r.err.toLowerCase().includes("depot-beta") || !r.err.toLowerCase().includes("depot-alpha") || !/git worktree add/.test(r.err)) throw new Error(`dépôts ou remède non nommés : ${r.err.slice(0, 400)}`);
});
check("rouge — TF-2426 : le dossier courant est un sous-dossier d'un autre dépôt (le cas des migrations lues) : refusée de même", () => {
  mkdirSync(join(beta, "migrations"), { recursive: true });
  const r = isole(join(beta, "migrations"), alpha, { prompt: "Corrige le sujet dans depot-alpha." });
  if (!refus(r)) throw new Error(`exit ${r.code} ${r.err.slice(0, 200)}`);
});
check("rouge — TF-2426 : la consigne ne nomme pas le dépôt de la copie de travail : refusée, le nom du dépôt et la ligne à écrire donnés", () => {
  const r = isole(alpha, alpha);
  if (!refus(r) || !/NOMMER le dépôt/.test(r.err) || !/Dépôt de la copie de travail : depot-alpha/.test(r.err)) throw new Error(`exit ${r.code} ${r.err.slice(0, 300)}`);
});
check("vert — TF-2426, remède joué : la même consigne qui nomme le dépôt (dans la consigne, ou dans la description) passe, sans refus", () => {
  for (const extra of [{ prompt: "Dépôt de la copie de travail : depot-alpha. Corrige le sujet." }, { description: "Campagne depot-alpha" }]) {
    const r = isole(alpha, alpha, extra);
    if (r.code !== 0 || r.err.trim()) throw new Error(`exit ${r.code} ${r.err.slice(0, 200)}`);
  }
});
check("vert — TF-2426 : un arbre lié du MÊME dépôt (dossier d'un autre nom) et un sous-dossier du dépôt sont le produit de la session ; le chemin du dépôt vaut nom", () => {
  const lie = isole(alphaLie, alpha, { prompt: `Dépôt de la copie de travail : ${alpha}` });
  if (lie.code !== 0) throw new Error(`arbre lié refusé : exit ${lie.code} ${lie.err.slice(0, 200)}`);
  const sous = isole(join(alpha, "src", "migrations"), alpha, { prompt: "Travail dans depot-alpha." });
  if (sous.code !== 0) throw new Error(`sous-dossier refusé : exit ${sous.code} ${sous.err.slice(0, 200)}`);
});
check("vert — TF-2426 : sans isolation, un dossier courant d'un autre dépôt n'est pas refusé (le refus ne vise que l'isolation)", () => {
  const r = isole(beta, alpha, { isolation: undefined });
  if (r.code !== 0 || r.err.trim()) throw new Error(`exit ${r.code} ${r.err.slice(0, 200)}`);
});
check("vert — TF-2426 : non jugé, dit : dossier courant hors d'un dépôt git, ou session sans CLAUDE_PROJECT_DIR (le refus 1 n'a rien à comparer, le refus 2 reste joué)", () => {
  const horsGit = isole(join(racine, "vide"), alpha);
  if (horsGit.code !== 0) throw new Error(`hors git refusé : exit ${horsGit.code} ${horsGit.err.slice(0, 200)}`);
  const sansProjet = isole(beta, null, { prompt: "Travail dans depot-beta." });
  if (sansProjet.code !== 0) throw new Error(`sans CLAUDE_PROJECT_DIR, le refus 1 a joué : ${sansProjet.err.slice(0, 200)}`);
  if (!refus(isole(beta, null))) throw new Error("sans CLAUDE_PROJECT_DIR, le refus 2 (dépôt non nommé) n'est plus joué");
});
check("vert — TF-2426 : l'ancien nom d'outil Task est jugé comme Agent ; un autre outil avec isolation reste silencieux", () => {
  if (!refus(isole(beta, alpha, {}, "Task"))) throw new Error("Task n'est pas refusé");
  const r = isole(beta, alpha, {}, "Bash");
  if (r.code !== 0 || r.out.trim() || r.err.trim()) throw new Error(`exit ${r.code} ${r.out.slice(0, 100)} ${r.err.slice(0, 100)}`);
});

// TF-2621 (16/11/2026) — UNE COPIE DE TRAVAIL OCCUPÉE PAR UNE SESSION PORTE SON MARQUEUR, ET UNE AUTRE SESSION N'Y LANCE PAS SON AGENT.
// Le fait (Produit-86, RP-67) : le 12/11/2026, deux sessions d'un même produit ont fait travailler chacune un constructeur dans la même copie : 10 fichiers d'un agent
// écrits au milieu du travail commité de l'autre. Le marqueur (session, run, agent, date) se pose dans le répertoire git de la copie ; le hook le lit avant tout lancement d'agent
// et REFUSE (exit 2) quand l'occupante est une AUTRE session encore vivante. Cas : DEUX sessions sur UNE copie, jouées sur un dépôt git réel et un arbre lié.
const OCCUPER = join(dirname(HOOK), "..", "scripts", "occuper-copie.mjs");
const refusOcc = (r) => r.code === 2 && /COPIE DE TRAVAIL OCCUPÉE \(TF-2621/.test(r.err);
const lance = (cwd, session, extra = {}) => jouer({ tool_name: "Agent", session_id: session, tool_input: { prompt: "Corrige le sujet et rends le rapport.", description: "Campagne", subagent_type: "campagne", ...extra }, cwd });
const marqueurDe = (copie) => join(String(git(copie, "rev-parse", "--path-format=absolute", "--git-dir").stdout).trim(), "occupation-copie.json");
const occuper = (...args) => spawnSync(process.execPath, [OCCUPER, ...args], { encoding: "utf8", env: { ...process.env, USERPROFILE: maison, HOME: maison, CLAUDE_CONFIG_DIR: "", CLAUDE_CODE_SESSION_ID: "" } });
const poser = (copie, session, extra = []) => occuper("--poser", copie, "--session", session, "--run", "run-1", "--agent", "constructeur", ...extra);
check("rouge — TF-2621 : deux sessions sur une même copie : la session B est refusée (exit 2), la session A occupante, son run, son agent et le remède sont nommés", () => {
  const p = poser(alphaLie, "session-A"); if (p.status !== 0) throw new Error(`pose du marqueur : exit ${p.status} ${p.stderr}${p.stdout}`);
  const r = lance(alphaLie, "session-B");
  if (!refusOcc(r)) throw new Error(`exit ${r.code}, stderr « ${r.err.slice(0, 200)} »`);
  for (const m of ["session-A", "run-1", "constructeur", "git worktree add", "--liberer"]) if (!r.err.includes(m)) throw new Error(`le refus ne dit pas « ${m} » : ${r.err.slice(0, 400)}`);
});
check("vert — TF-2621 : la session occupante relance dans sa propre copie sans refus", () => {
  const r = lance(alphaLie, "session-A");
  if (r.code !== 0 || r.err.trim()) throw new Error(`exit ${r.code} ${r.err.slice(0, 200)}`);
});
check("rouge — TF-2621 : la copie n'est nommée que par la consigne (dossier courant ailleurs) : la session B est refusée aussi", () => {
  const r = jouer({ tool_name: "Agent", session_id: "session-B", tool_input: { prompt: `Dépôt de la copie de travail : ${alphaLie}\nCorrige le sujet.`, description: "Campagne", subagent_type: "campagne" }, cwd: projet });
  if (!refusOcc(r)) throw new Error(`exit ${r.code}, stderr « ${r.err.slice(0, 200)} »`);
});
check("vert — TF-2621 : une AUTRE copie du même dépôt, sans marqueur, reste libre pour la session B ; une entrée sans session_id n'est pas jugée", () => {
  const r = lance(alpha, "session-B"); if (r.code !== 0 || r.err.trim()) throw new Error(`autre copie : exit ${r.code} ${r.err.slice(0, 200)}`);
  const s = jouer({ tool_name: "Agent", tool_input: { prompt: "x", description: "y", subagent_type: "campagne" }, cwd: alphaLie });
  if (s.code !== 0 || s.err.trim()) throw new Error(`sans session_id : exit ${s.code} ${s.err.slice(0, 200)}`);
});
check("vert — TF-2621 : un marqueur ancien dont l'occupante n'écrit plus (aucune transcription, date de plus de 15 minutes) ne retient personne", () => {
  const f = marqueurDe(alphaLie), m = JSON.parse(readFileSync(f, "utf8"));
  writeFileSync(f, JSON.stringify({ ...m, date: new Date(Date.now() - 2 * 3600 * 1000).toISOString() }));
  const r = lance(alphaLie, "session-B");
  if (r.code !== 0 || r.err.trim()) throw new Error(`exit ${r.code} ${r.err.slice(0, 200)}`);
});
check("rouge — TF-2621 : un marqueur ancien dont l'occupante écrit encore (transcription modifiée à l'instant) retient la copie : refus", () => {
  const dossier = join(maison, ".claude", "projects", "p"); mkdirSync(dossier, { recursive: true });
  writeFileSync(join(dossier, "session-A.jsonl"), "{}\n");
  const r = lance(alphaLie, "session-B");
  if (!refusOcc(r)) throw new Error(`exit ${r.code}, stderr « ${r.err.slice(0, 200)} »`);
  rmSync(join(dossier, "session-A.jsonl"));
});
check("vert — TF-2621 : --lire dit l'occupante ; --liberer retire le marqueur, la session B lance ; --poser sur une copie déjà occupée par une autre session est refusé (1), --forcer l'écrase", () => {
  poser(alphaLie, "session-A", ["--forcer"]);
  const l = occuper("--lire", alphaLie); if (l.status !== 0 || !/session-A/.test(l.stdout)) throw new Error(`--lire : exit ${l.status} ${l.stdout}${l.stderr}`);
  const deuxieme = poser(alphaLie, "session-B"); if (deuxieme.status !== 1 || !/occupée/.test(deuxieme.stderr + deuxieme.stdout)) throw new Error(`--poser par B : exit ${deuxieme.status} ${deuxieme.stderr}${deuxieme.stdout}`);
  const f = occuper("--liberer", alphaLie); if (f.status !== 0) throw new Error(`--liberer : exit ${f.status} ${f.stderr}`);
  if (existsSync(marqueurDe(alphaLie))) throw new Error("le marqueur subsiste après --liberer");
  const r = lance(alphaLie, "session-B"); if (r.code !== 0 || r.err.trim()) throw new Error(`après libération : exit ${r.code} ${r.err.slice(0, 200)}`);
  const sans = occuper("--lire", alphaLie); if (sans.status !== 0 || !/aucun marqueur/.test(sans.stdout)) throw new Error(`--lire sans marqueur : ${sans.stdout}`);
});
check("rouge — TF-2621 : options invalides : --poser sans session (ni CLAUDE_CODE_SESSION_ID) rend 2, un dossier qui n'est pas un dépôt rend 2, une option inconnue rend 2", () => {
  if (occuper("--poser", alphaLie).status !== 2) throw new Error("--poser sans session accepté");
  if (occuper("--poser", join(racine, "vide"), "--session", "s").status !== 2) throw new Error("dossier hors dépôt accepté");
  if (occuper("--inconnue").status !== 2) throw new Error("option inconnue acceptée");
});

// ---- TF-2705 : un agent hérite d'un FORGE_ROOT sans pilot ----
const jouerSousRacine = (entree, forgeRoot) => {
  const env = { ...process.env, USERPROFILE: maison, HOME: maison };
  delete env.CLAUDE_PROJECT_DIR;
  if (forgeRoot === null) delete env.FORGE_ROOT; else env.FORGE_ROOT = forgeRoot;
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: JSON.stringify(entree), env });
  let ctx = ""; try { ctx = JSON.parse(r.stdout || "{}").hookSpecificOutput?.additionalContext || ""; } catch { ctx = "<stdout illisible>"; }
  return { code: r.status, ctx, out: r.stdout || "" };
};
const parcSansPilot = join(racine, "parc-sans-pilot", ".claude", "worktrees"); mkdirSync(parcSansPilot, { recursive: true });
check("rouge — TF-2705 : un FORGE_ROOT sous .claude\\worktrees (la valeur du 15/11/2026) fait avertir AVANT le lancement, remède nommé, exit 0", () => {
  const r = jouerSousRacine(appel({ subagent_type: "campagne" }), parcSansPilot);
  if (r.code !== 0) throw new Error(`exit ${r.code} : un avertissement ne bloque jamais`);
  if (!/FORGE_ROOT HÉRITÉ SANS PILOT \(TF-2705/.test(r.ctx) || !/102 erreurs de fixture/.test(r.ctx)) throw new Error(`aucun avertissement : ${r.ctx.slice(0, 240)}`);
  if (!/nommer dans la consigne « FORGE_ROOT=\S+ pour toute commande/.test(r.ctx) || /FORGE_ROOT=undefined/.test(r.ctx)) throw new Error(`remède absent ou vide : ${r.ctx.slice(0, 500)}`);
});
check("rouge → vert — TF-2705 : le remède du message, posé dans FORGE_ROOT, ne fait plus avertir (la valeur nommée est un parc qui porte le pilot)", () => {
  const rouge = jouerSousRacine(appel({ subagent_type: "campagne" }), parcSansPilot);
  const valeur = /« FORGE_ROOT=(\S+) pour toute commande/.exec(rouge.ctx)?.[1];
  if (!valeur) throw new Error("aucune valeur conseillée dans le message");
  const vert = jouerSousRacine(appel({ subagent_type: "campagne" }), valeur);
  if (/FORGE_ROOT HÉRITÉ SANS PILOT/.test(vert.ctx)) throw new Error(`la valeur conseillée « ${valeur} » avertit encore : ${vert.ctx.slice(0, 200)}`);
});
check("vert — TF-2705 : sans FORGE_ROOT, aucun avertissement de racine (les chemins se déduisent du dépôt)", () => {
  const r = jouerSousRacine(appel({ subagent_type: "campagne" }), null);
  if (/FORGE_ROOT HÉRITÉ/.test(r.ctx)) throw new Error(r.ctx.slice(0, 200));
});
// ---- TF-2736 : une consigne « lecture seule » lancée sur un agent qui peut écrire ----
check("rouge — TF-2736 : une consigne « lecture seule » vers un agent générique avertit, nomme `relecteur`, exit 0", () => {
  for (const ti of [{ subagent_type: "general-purpose", prompt: "Relecteur aveugle : lis le texte, aucune écriture.", model: "opus", effort: "high" }, { prompt: "Travail en lecture seule sur le registre." }]) {
    const r = jouer(appel(ti));
    if (r.code !== 0) throw new Error(`exit ${r.code}`);
    if (!/LECTURE SEULE SANS LE TYPE QUI LA TIENT \(TF-2736/.test(r.ctx) || !/subagent_type: "relecteur"/.test(r.ctx)) throw new Error(`aucun avertissement : ${r.ctx.slice(0, 240)}`);
  }
});
check("vert — TF-2736 : la même consigne vers `relecteur`, et une consigne sans lecture seule vers un générique daté, ne portent pas cet avertissement ; le remède joué (type relecteur) passe", () => {
  const r1 = jouer(appel({ subagent_type: "relecteur", prompt: "Relecteur aveugle : lis le texte, aucune écriture." }));
  if (/LECTURE SEULE SANS/.test(r1.ctx)) throw new Error("un relecteur reçoit l'avertissement de lecture seule");
  const r2 = jouer(appel({ subagent_type: "general-purpose", prompt: "Écris le fichier de sortie.", model: "sonnet", effort: "high" }));
  if (/LECTURE SEULE SANS/.test(r2.ctx)) throw new Error("une consigne d'écriture reçoit l'avertissement de lecture seule");
});

rmSync(racine, { recursive: true, force: true });
console.log(`\nhook-flotte : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
