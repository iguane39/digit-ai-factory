#!/usr/bin/env node
/**
 * synchroniser.test.mjs — « synchronise avec GitHub » rejoué sur des dépôts JETABLES (D-107 (a), 29/10/2026).
 *
 * AUCUN DÉPÔT RÉEL N'EST TOUCHÉ, et aucun envoi réel n'a lieu : chaque test bâtit son propre parc dans
 * un dossier temporaire — une origine nue par dépôt (`origines\<nom>.git`), un clone de travail à la
 * racine du parc, un clone « voisin » qui joue l'autre session qui publie en parallèle. Les noms des
 * forges sont ceux de `lib-parc.mjs` : le script les lit là, comme `bootstrap.mjs`, et un test
 * prouve qu'il ne porte aucune liste en dur (un `lib-parc.mjs` propre au pilot jetable la remplace).
 *
 * Ce qui est prouvé, par scénario (chacun a son cas VERT et son cas ROUGE) :
 *   · avance rapide, rebase des enregistrements locaux, dépôt à jour ;
 *   · CONFLIT : arrêt propre, dépôt laissé tel qu'il était (HEAD, arbre, aucun rebase en cours, aucune
 *     remise, origine intacte), conflit rapporté (fichiers, enregistrement) ;
 *   · REFUS DE PUBLICATION : le pre-push d'essai refuse, la sortie est rapportée TELLE QUELLE, l'envoi
 *     n'est ni rejoué ni contourné (un seul appel du hook, origine inchangée) ;
 *   · le GO : `--go` > FORGE_PUSH_GO > GO permanent de R-38 par. 6 (pilot et forges) ; hors du §6, pas
 *     d'envoi sans GO (`go_manquant`) ;
 *   · le distant qui avance PENDANT l'envoi (le hook d'essai publie depuis un voisin) : récupération,
 *     rebase et nouvel envoi, deux tentatives consignées ;
 *   · au pilot, l'index régénéré seul ne bloque pas ; un bloc RÔLE écrit à la main, lui, bloque et reste intact ;
 *   · LE MODE ESSAI N'ÉCRIT RIEN : l'empreinte de TOUT le parc (`.git` et origines compris) est la
 *     même avant et après, hook d'essai jamais appelé ; le même scénario joué sans `--essai` la CHANGE
 *     (cas rouge du test : sans lui, une empreinte qui ne bouge jamais ne prouverait rien).
 */
import { test as testNode } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { FORGES, PILOT, CANAL } from "./lib-parc.mjs";
import { estIndexRegenere, classerRefus, choisirCible, resoudreGo, resoudreCibles, GO_PERMANENT } from "./synchroniser.mjs";

// Le compte des cas est tenu ICI, et imprimé à la sortie (I5 : le cliquet lit la DERNIÈRE ligne, `node:test` la termine par une durée).
let joues = 0;
let reussis = 0;
const test = (nom, fn) => { joues++; testNode(nom, async (t) => { await fn(t); reussis++; }); };

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "synchroniser.mjs");
const FORGE_A = "digit-ai-forge-tests";
const FORGE_B = "digit-ai-forge-ops";
const QUEUE = "digit-ai-queue";
const DEBUT = "<!-- ROLE:DEBUT -->";
const FIN = "<!-- ROLE:FIN -->";
const sl = (p) => p.split("\\").join("/");

// --- Le parc jetable -------------------------------------------------------------------------------
function git(cwd, ...argv) {
  const r = spawnSync("git", argv, { cwd, encoding: "utf8", env: { ...process.env, LC_ALL: "C", GIT_TERMINAL_PROMPT: "0" } });
  if (r.status !== 0) throw new Error(`git ${argv.join(" ")} (${cwd}) : ${r.stderr}`);
  return r.stdout.trim();
}
const ecrire = (d, chemin, contenu) => { const f = join(d, ...chemin.split("/")); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, contenu); };
function enregistrer(d, chemin, contenu, message) { ecrire(d, chemin, contenu); git(d, "add", "--", chemin); git(d, "commit", "-q", "-m", message); return git(d, "rev-parse", "HEAD"); }
function configurer(d) {
  for (const [k, v] of [["user.email", "essai@invalide.invalid"], ["user.name", "Essai"], ["core.autocrlf", "false"], ["commit.gpgsign", "false"], ["core.longpaths", "true"], ["core.hooksPath", sl(join(d, ".git", "hooks"))]]) git(d, "config", k, v);
}

const rolePilot = (t) => `${DEBUT}\n${t}\n${FIN}`;
const readmeOutput = (role, fichiers) => `# output\n\n${rolePilot(role)}\n\n## Table\n${fichiers.sort().map((n) => `- ${n}`).join("\n")}\n`;
// Le générateur d'index du pilot jetable : déterministe, préserve le bloc RÔLE du disque, relit la liste des fichiers.
const GENERATEUR = `import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const base = process.argv[process.argv.indexOf("--base") + 1];
const f = join(base, "output", "README.md");
const t = readFileSync(f, "utf8");
const role = t.slice(t.indexOf("${DEBUT}"), t.indexOf("${FIN}") + "${FIN}".length);
const fichiers = readdirSync(join(base, "output")).filter((n) => n !== "README.md").sort();
writeFileSync(f, "# output\\n\\n" + role + "\\n\\n## Table\\n" + fichiers.map((n) => "- " + n).join("\\n") + "\\n");
`;

/** Un parc : racine, origines nues, clones de travail, voisins. `noms` = les dépôts à créer. */
function creerParc(noms = [FORGE_A]) {
  const racine = mkdtempSync(join(tmpdir(), "synchro-"));
  mkdirSync(join(racine, "origines"));
  mkdirSync(join(racine, "voisins"));
  const parc = { racine, origine: (n) => join(racine, "origines", `${n}.git`), depot: (n) => join(racine, n), voisin: (n) => join(racine, "voisins", n) };
  for (const nom of noms) {
    git(racine, "init", "-q", "--bare", "-b", "main", parc.origine(nom));
    git(racine, "clone", "-q", parc.origine(nom), parc.depot(nom));
    const d = parc.depot(nom);
    configurer(d);
    git(d, "checkout", "-q", "-b", "main");
    ecrire(d, "base.txt", "base\n");
    if (nom === PILOT) {
      ecrire(d, "scripts/readme-dossiers.mjs", GENERATEUR);
      ecrire(d, "output/README.md", readmeOutput("rôle écrit à la main", []));
      ecrire(d, "input/README.md", `# input\n\n${rolePilot("entrants")}\n`);
    }
    git(d, "add", "-A");
    git(d, "commit", "-q", "-m", "commit initial");
    git(d, "push", "-q", "origin", "main");
    git(racine, "clone", "-q", parc.origine(nom), parc.voisin(nom));
    configurer(parc.voisin(nom));
  }
  parc.avancerOrigine = (nom, chemin, contenu, message = "commit du voisin") => { enregistrer(parc.voisin(nom), chemin, contenu, message); git(parc.voisin(nom), "push", "-q", "origin", "main"); };
  parc.teteOrigine = (nom) => git(parc.origine(nom), "rev-parse", "main");
  parc.fin = () => rmSync(racine, { recursive: true, force: true });
  return parc;
}

function hook(d, texte) { const f = join(d, ".git", "hooks", "pre-push"); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, texte); try { chmodSync(f, 0o755); } catch { /* sous Windows, git lance le hook par sh */ } }
const compteurHook = (d) => { const f = join(d, ".git", "hook-appels.txt"); return existsSync(f) ? readFileSync(f, "utf8").split("\n").filter(Boolean).length : 0; };

/** Joue le script sur le parc jetable. L'environnement est PROPRE : aucun FORGE_PUSH_GO hérité, sauf demande. */
function lancer(parc, args = [], env = {}) {
  const e = { ...process.env, ...env };
  // TF-0957 : le script lance le générateur d'index du pilot (ici une doublure, mais le contrôle `bancs-isoles` lit le
  // texte) ; la chaîne d'anonymisation ne lit jamais les tables du canal réel depuis une recette — tables jetables désignées.
  e.FORGE_NOMS_INTERDITS = join(parc.racine, "_noms-interdits.json");
  e.FORGE_PRODUITS_PSEUDO = join(parc.racine, "_produits-pseudonymes.json");
  if (!("FORGE_PUSH_GO" in env)) delete e.FORGE_PUSH_GO;
  delete e.FORGE_ROOT; delete e.FORGE_CONFIDENTIEL;
  const r = spawnSync(process.execPath, [OUTIL, "--racine", parc.racine, "--pilot", parc.depot(PILOT), ...args], { encoding: "utf8", env: e });
  let j = null;
  try { j = JSON.parse(r.stdout); } catch { /* sortie illisible : j reste null */ }
  return { code: r.status, j, stderr: r.stderr, stdout: r.stdout };
}
const de = (res, nom) => res.j?.depots?.find((x) => x.nom === nom);

function empreinte(dossier) {
  const h = createHash("sha1");
  const parcourir = (p) => {
    for (const e of readdirSync(p, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const f = join(p, e.name);
      h.update(relative(dossier, f) + "\0");
      if (e.isDirectory()) parcourir(f); else h.update(readFileSync(f));
    }
  };
  parcourir(dossier);
  return h.digest("hex");
}
const statut = (d) => git(d, "status", "--porcelain", "--untracked-files=no");

// --- Avance rapide, à jour, rebase -----------------------------------------------------------------
test("(a) avance rapide : le retard est récupéré, avant/après mesurés, rien à publier", () => {
  const p = creerParc();
  try {
    p.avancerOrigine(FORGE_A, "a.txt", "a\n", "un");
    p.avancerOrigine(FORGE_A, "b.txt", "b\n", "deux");
    const r = lancer(p, ["--cible", "tests"]);
    const d = de(r, FORGE_A);
    assert.equal(r.code, 0, r.stderr);
    assert.equal(d.statut, "synchronise");
    assert.equal(d.recupere.mode, "avance-rapide");
    assert.equal(d.recupere.commits, 2);
    assert.deepEqual([d.avant.retard, d.avant.avance, d.apres.retard, d.apres.avance], [2, 0, 0, 0]);
    assert.equal(d.publication.jouee, false);
    assert.match(d.publication.raison_non_jouee, /rien à publier/);
    assert.equal(git(p.depot(FORGE_A), "rev-parse", "HEAD"), p.teteOrigine(FORGE_A));
    assert.equal(r.j.depots.length, 1, "--cible n'en vise qu'un");
  } finally { p.fin(); }
});

test("(b) dépôt à jour : rien n'est fait, rien n'est dit de plus", () => {
  const p = creerParc();
  try {
    const tete = git(p.depot(FORGE_A), "rev-parse", "HEAD");
    const r = lancer(p, ["--cible", "tests"]);
    assert.equal(de(r, FORGE_A).statut, "a_jour");
    assert.equal(r.code, 0);
    assert.equal(de(r, FORGE_A).recupere.mode, "aucun");
    assert.equal(de(r, FORGE_A).publication.jouee, false);
    assert.equal(git(p.depot(FORGE_A), "rev-parse", "HEAD"), tete);
    assert.equal(p.teteOrigine(FORGE_A), tete);
  } finally { p.fin(); }
});

test("(c) rebase : l'enregistrement local est rejoué sur l'origine puis publié, histoire linéaire, aucune remise", () => {
  const p = creerParc();
  try {
    const d = p.depot(FORGE_A);
    enregistrer(d, "local.txt", "local\n", "mon enregistrement");
    p.avancerOrigine(FORGE_A, "o1.txt", "1\n", "origine 1");
    p.avancerOrigine(FORGE_A, "o2.txt", "2\n", "origine 2");
    const r = lancer(p, ["--cible", "tests"]);
    const c = de(r, FORGE_A);
    assert.equal(r.code, 0, r.stderr);
    assert.equal(c.statut, "synchronise");
    assert.equal(c.recupere.mode, "rebase");
    assert.equal(c.recupere.rejoues, 1);
    assert.deepEqual([c.avant.retard, c.avant.avance], [2, 1]);
    assert.equal(c.publication.publie, true);
    assert.equal(c.publication.commits, 1);
    assert.deepEqual([c.apres.retard, c.apres.avance], [0, 0]);
    assert.equal(p.teteOrigine(FORGE_A), git(d, "rev-parse", "HEAD"), "l'origine porte maintenant le travail local");
    assert.equal(git(d, "rev-list", "--merges", "--count", "HEAD"), "0", "histoire linéaire : un rebase, pas une fusion");
    assert.equal(readFileSync(join(d, "local.txt"), "utf8"), "local\n");
    assert.equal(git(d, "stash", "list", "--format=%h %gs"), "", "aucune remise : la pile est partagée");
    assert.equal(git(d, "log", "-1", "--format=%s"), "mon enregistrement");
  } finally { p.fin(); }
});

// --- Le conflit ------------------------------------------------------------------------------------
test("(d) conflit : arrêt propre du rebase, dépôt tel qu'il était, conflit rapporté, rien publié", () => {
  const p = creerParc();
  try {
    const d = p.depot(FORGE_A);
    enregistrer(d, "base.txt", "version locale\n", "je change base.txt");
    p.avancerOrigine(FORGE_A, "base.txt", "version distante\n", "il change base.txt");
    const tete = git(d, "rev-parse", "HEAD");
    const origineAvant = p.teteOrigine(FORGE_A);
    const r = lancer(p, ["--cible", "tests"]);
    const c = de(r, FORGE_A);
    assert.equal(r.code, 1);
    assert.equal(c.statut, "conflit");
    assert.deepEqual(c.conflit.fichiers, ["base.txt"]);
    assert.equal(c.conflit.commit.sujet, "je change base.txt");
    assert.equal(c.conflit.depot_intact, true);
    assert.equal(git(d, "rev-parse", "HEAD"), tete, "HEAD n'a pas bougé");
    assert.equal(git(d, "rev-parse", "--abbrev-ref", "HEAD"), "main");
    assert.equal(existsSync(join(d, ".git", "rebase-merge")) || existsSync(join(d, ".git", "rebase-apply")), false, "aucun rebase en cours");
    assert.equal(statut(d), "", "arbre propre : aucun marqueur de conflit");
    assert.equal(readFileSync(join(d, "base.txt"), "utf8"), "version locale\n");
    assert.equal(p.teteOrigine(FORGE_A), origineAvant, "l'origine n'a pas bougé");
    assert.notEqual(c.publication?.jouee, true, "un dépôt en conflit ne publie pas");
    assert.equal(git(d, "stash", "list", "--format=%h %gs"), "");
  } finally { p.fin(); }
});

// --- Le refus de publication -----------------------------------------------------------------------
test("(e) refus du pre-push : rapporté tel quel, non rejoué, non contourné, origine inchangée", () => {
  const p = creerParc();
  try {
    const d = p.depot(FORGE_A);
    hook(d, "#!/bin/sh\necho appel >> \"$(git rev-parse --git-dir)/hook-appels.txt\"\necho 'PUBLICATION REFUSEE - porte de recette : un nom interdit' >&2\nexit 1\n");
    enregistrer(d, "local.txt", "local\n", "local");
    const origineAvant = p.teteOrigine(FORGE_A);
    const r = lancer(p, ["--cible", "tests"]);
    const c = de(r, FORGE_A);
    assert.equal(r.code, 1);
    assert.equal(c.statut, "refuse");
    assert.equal(c.publication.publie, false);
    assert.equal(c.publication.refus.classe, "refus_porte");
    assert.match(c.publication.refus.sortie, /PUBLICATION REFUSEE - porte de recette : un nom interdit/, "la sortie du hook est citée telle quelle");
    assert.equal(c.publication.tentatives.length, 1, "un refus de porte n'est pas rejoué");
    assert.equal(compteurHook(d), 1, "le hook n'a été appelé qu'une fois");
    assert.equal(p.teteOrigine(FORGE_A), origineAvant, "ni force ni --no-verify : l'origine est intacte");
    assert.equal(c.avant.avance, 1);
    assert.equal(c.apres.avance, 1, "le travail local reste en avance, intact");
  } finally { p.fin(); }
});

// --- Le GO ---------------------------------------------------------------------------------------
const HOOK_GO = "#!/bin/sh\necho \"${FORGE_PUSH_GO:-<aucun>}\" > \"$(git rev-parse --git-dir)/go-vu.txt\"\nexit 0\n";
const goVu = (d) => readFileSync(join(d, ".git", "go-vu.txt"), "utf8").trim();

test("(f) GO : permanent d'une forge (R-38 par. 6), puis l'environnement, puis --go", () => {
  for (const [args, env, attendu] of [
    [[], {}, GO_PERMANENT.forge],
    [[], { FORGE_PUSH_GO: "D-X (a) du 01/01" }, "D-X (a) du 01/01"],
    [["--go", "D-Y (b) du 02/02"], { FORGE_PUSH_GO: "D-X (a) du 01/01" }, "D-Y (b) du 02/02"],
  ]) {
    const p = creerParc();
    try {
      const d = p.depot(FORGE_A);
      hook(d, HOOK_GO);
      enregistrer(d, "local.txt", "local\n", "local");
      const r = lancer(p, ["--cible", "tests", ...args], env);
      assert.equal(de(r, FORGE_A).statut, "synchronise", r.stderr);
      assert.equal(goVu(d), attendu, "le pre-push lit FORGE_PUSH_GO");
      assert.equal(de(r, FORGE_A).publication.go.motif, attendu);
    } finally { p.fin(); }
  }
});

test("(g) hors R-38 par. 6 (digit-ai-queue) : sans GO déclaré, rien n'est envoyé ; avec --go, l'envoi part", () => {
  const p = creerParc([QUEUE]);
  try {
    const d = p.depot(QUEUE);
    hook(d, HOOK_GO);
    enregistrer(d, "local.txt", "local\n", "local");
    const origineAvant = p.teteOrigine(QUEUE);
    const sans = lancer(p, ["--cible", "queue"]);
    assert.equal(de(sans, QUEUE).statut, "go_manquant");
    assert.equal(sans.code, 1);
    assert.equal(p.teteOrigine(QUEUE), origineAvant);
    assert.equal(existsSync(join(d, ".git", "go-vu.txt")), false, "le hook n'a pas été appelé : aucun envoi tenté");
    const avec = lancer(p, ["--cible", "queue", "--go", "D-99 (a) du 29/10"]);
    assert.equal(de(avec, QUEUE).statut, "synchronise");
    assert.equal(goVu(d), "D-99 (a) du 29/10");
    assert.notEqual(p.teteOrigine(QUEUE), origineAvant);
  } finally { p.fin(); }
});

test("(h) --sans-publier : récupère et intègre, n'envoie pas", () => {
  const p = creerParc();
  try {
    const d = p.depot(FORGE_A);
    hook(d, HOOK_GO);
    enregistrer(d, "local.txt", "local\n", "local");
    p.avancerOrigine(FORGE_A, "o.txt", "o\n");
    const origineAvant = p.teteOrigine(FORGE_A);
    const r = lancer(p, ["--cible", "tests", "--sans-publier"]);
    const c = de(r, FORGE_A);
    assert.equal(c.statut, "recupere");
    assert.equal(c.recupere.mode, "rebase");
    assert.equal(c.publication.jouee, false);
    assert.equal(p.teteOrigine(FORGE_A), origineAvant);
    assert.equal(existsSync(join(d, ".git", "go-vu.txt")), false);
    assert.deepEqual([c.apres.retard, c.apres.avance], [0, 1]);
  } finally { p.fin(); }
});

// --- Le distant qui avance pendant l'envoi ---------------------------------------------------------
test("(i) le distant avance pendant l'envoi : récupération, rebase et nouvel envoi, deux tentatives", () => {
  const p = creerParc();
  try {
    const d = p.depot(FORGE_A);
    const marque = sl(join(p.racine, "voisin-a-publie"));
    const v = sl(p.voisin(FORGE_A));
    // Au premier appel, le hook joue « l'autre session » : il publie depuis le voisin, puis laisse passer.
    hook(d, `#!/bin/sh\nunset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE\nif [ ! -f "${marque}" ]; then\n  touch "${marque}"\n  echo "pendant l'envoi" > "${v}/concurrent.txt"\n  git -C "${v}" add concurrent.txt && git -C "${v}" commit -q -m "publie en parallele" && git -C "${v}" push -q origin main\nfi\nexit 0\n`);
    enregistrer(d, "local.txt", "local\n", "mon enregistrement");
    const r = lancer(p, ["--cible", "tests"]);
    const c = de(r, FORGE_A);
    assert.equal(r.code, 0, r.stderr + JSON.stringify(c.publication));
    assert.equal(c.statut, "synchronise");
    assert.equal(c.publication.tentatives.length, 2);
    assert.equal(c.publication.tentatives[0].classe, "distant_avance");
    assert.equal(c.publication.tentatives[1].code, 0);
    assert.equal(c.recupere.reprises, 1);
    assert.equal(p.teteOrigine(FORGE_A), git(d, "rev-parse", "HEAD"));
    const fichiers = git(d, "ls-tree", "-r", "--name-only", "HEAD").split("\n");
    assert.ok(fichiers.includes("concurrent.txt") && fichiers.includes("local.txt"), "les deux travaux sont dans l'origine");
  } finally { p.fin(); }
});

test("(i bis) un envoi long n'est jamais muet : battement pendant l'envoi, sortie du pre-push relayée en direct", () => {
  const p = creerParc();
  try {
    const d = p.depot(FORGE_A);
    hook(d, "#!/bin/sh\nsleep 2\necho 'sortie du pre-push, en direct' >&2\nexit 0\n");
    enregistrer(d, "local.txt", "local\n", "local");
    const r = lancer(p, ["--cible", "tests"], { SYNCHRONISER_BATTEMENT_MS: "400" });
    assert.equal(de(r, FORGE_A).statut, "synchronise", r.stderr);
    assert.match(r.stderr, /envoi toujours en cours \(\d+ s\)/, "au moins un battement émis pendant l'envoi");
    assert.match(r.stderr, /sortie du pre-push, en direct/, "la sortie du hook est relayée sur stderr");
    assert.match(de(r, FORGE_A).publication.tentatives[0].sortie, /sortie du pre-push, en direct/, "et gardée dans le compte rendu");
  } finally { p.fin(); }
});

// --- Le pilot : les index d'output\ ----------------------------------------------------------------
test("(j) pilot : un index régénéré seul ne bloque pas la récupération ; l'index est régénéré ensuite", () => {
  const p = creerParc([PILOT]);
  try {
    const d = p.depot(PILOT);
    // Le hook d'écriture a régénéré l'index localement (un fichier non suivi y est listé) : arbre modifié.
    ecrire(d, "output/b.md", "b\n");
    writeFileSync(join(d, "output", "README.md"), readmeOutput("rôle écrit à la main", ["b.md"]));
    assert.match(statut(d), /output\/README\.md/);
    // L'origine a avancé en touchant ce MÊME index : git refuserait l'avance rapide sur l'arbre modifié.
    p.avancerOrigine(PILOT, "output/a.md", "a\n", "un livrable");
    enregistrer(p.voisin(PILOT), "output/README.md", readmeOutput("rôle écrit à la main", ["a.md"]), "index du livrable");
    git(p.voisin(PILOT), "push", "-q", "origin", "main");
    const r = lancer(p, ["--cible", "pilot"]);
    const c = de(r, PILOT);
    assert.equal(r.code, 0, r.stderr);
    assert.equal(c.statut, "synchronise");
    assert.equal(c.recupere.mode, "avance-rapide");
    assert.deepEqual(c.recupere.index_ecartes, ["output/README.md"]);
    assert.equal(c.index.joue, true);
    assert.deepEqual(c.index.regeneres, ["output/README.md"], "régénéré : il liste a.md ET le fichier local b.md");
    const readme = readFileSync(join(d, "output", "README.md"), "utf8");
    assert.match(readme, /- a\.md/);
    assert.match(readme, /- b\.md/);
    assert.equal(git(d, "rev-parse", "HEAD"), p.teteOrigine(PILOT));
  } finally { p.fin(); }
});

test("(k) pilot : un bloc RÔLE écrit à la main n'est jamais écarté — la modification bloque, intacte", () => {
  const p = creerParc([PILOT]);
  try {
    const d = p.depot(PILOT);
    const modifie = readmeOutput("RÔLE REDIGÉ PAR L'HUMAIN, pas encore enregistré", []);
    writeFileSync(join(d, "output", "README.md"), modifie);
    p.avancerOrigine(PILOT, "output/README.md", readmeOutput("rôle écrit à la main", ["a.md"]), "index distant");
    const tete = git(d, "rev-parse", "HEAD");
    const r = lancer(p, ["--cible", "pilot"]);
    const c = de(r, PILOT);
    assert.equal(r.code, 1);
    assert.equal(c.statut, "bloque");
    assert.match(c.raisons[0], /refusée par git/);
    assert.equal(readFileSync(join(d, "output", "README.md"), "utf8"), modifie, "le travail humain est intact");
    assert.equal(git(d, "rev-parse", "HEAD"), tete);
  } finally { p.fin(); }
});

test("(l) rebase impossible sur un arbre modifié : le dépôt est laissé tel quel, jamais remisé", () => {
  const p = creerParc();
  try {
    const d = p.depot(FORGE_A);
    enregistrer(d, "local.txt", "local\n", "local");
    ecrire(d, "base.txt", "travail d'une autre session, non enregistré\n");
    p.avancerOrigine(FORGE_A, "o.txt", "o\n");
    const tete = git(d, "rev-parse", "HEAD");
    const r = lancer(p, ["--cible", "tests"]);
    const c = de(r, FORGE_A);
    assert.equal(c.statut, "bloque");
    assert.deepEqual(c.conflit.fichiers, ["base.txt"]);
    assert.equal(readFileSync(join(d, "base.txt"), "utf8"), "travail d'une autre session, non enregistré\n");
    assert.equal(git(d, "rev-parse", "HEAD"), tete);
    assert.equal(git(d, "stash", "list", "--format=%h %gs"), "");
  } finally { p.fin(); }
});

test("(m) un enregistrement de fusion local ne se rebase pas : bloqué, rien n'est aplati", () => {
  const p = creerParc();
  try {
    const d = p.depot(FORGE_A);
    git(d, "checkout", "-q", "-b", "cote");
    enregistrer(d, "cote.txt", "cote\n", "sur la branche");
    git(d, "checkout", "-q", "main");
    enregistrer(d, "main.txt", "main\n", "sur main");
    git(d, "merge", "-q", "--no-ff", "-m", "fusion locale", "cote");
    p.avancerOrigine(FORGE_A, "o.txt", "o\n");
    const tete = git(d, "rev-parse", "HEAD");
    const r = lancer(p, ["--cible", "tests"]);
    assert.equal(de(r, FORGE_A).statut, "bloque");
    assert.match(de(r, FORGE_A).raisons[0], /fusion/);
    assert.equal(git(d, "rev-parse", "HEAD"), tete);
  } finally { p.fin(); }
});

// --- Les cibles se lisent, elles ne s'écrivent pas en dur -------------------------------------------
test("(n) les cibles sont celles de lib-parc.mjs, pilot d'abord, canal en dernier ; un lib-parc propre au pilot les remplace", () => {
  const p = creerParc([PILOT, FORGE_A]);
  try {
    const r = lancer(p, ["--essai"]);
    const noms = r.j.depots.map((x) => x.nom);
    assert.deepEqual(noms, [PILOT, ...FORGES.map((f) => f.nom), CANAL.nom]);
    assert.equal(de(r, FORGE_A).statut, "a_jour");
    assert.equal(de(r, "digit-ai-forge-design").statut, "absent", "le clone est l'affaire de bootstrap, pas d'une synchronisation");
    // Cas ROUGE d'une liste en dur : le pilot jetable déclare UNE autre forge ; le script doit suivre CE fichier.
    ecrire(p.depot(PILOT), "scripts/lib-parc.mjs", `export const FORGES = [{ nom: "digit-ai-forge-zzz", preuve: "x" }];\nexport const PILOT = "${PILOT}";\nexport const CANAL = { nom: "canal-zzz", dossier: "_zzz", preuve: "x", prive: true };\n`);
    const r2 = lancer(p, ["--essai"]);
    assert.deepEqual(r2.j.depots.map((x) => x.nom), [PILOT, "digit-ai-forge-zzz", "canal-zzz"]);
  } finally { p.fin(); }
});

test("(o) --cible inconnue : exit 2 ; dépôt hors ligne : dit, exit 1 ; aucun dépôt présent : AUCUN_DEPOT, exit 1", () => {
  const p = creerParc([FORGE_A]);
  try {
    const inconnue = lancer(p, ["--cible", "inexistante"]);
    assert.equal(inconnue.code, 2);
    assert.match(inconnue.stderr, /ne désigne aucun dépôt/);
    assert.equal(lancer(p, ["--bidule"]).code, 2);
    git(p.depot(FORGE_A), "remote", "set-url", "origin", join(p.racine, "nexiste-pas.git"));
    const hors = lancer(p, ["--cible", "tests"]);
    assert.equal(de(hors, FORGE_A).statut, "hors_ligne");
    assert.equal(hors.code, 1);
    const vide = creerParc([]);
    try {
      const r = lancer(vide, ["--cible", "tests"]);
      assert.equal(de(r, FORGE_A).statut, "absent");
      assert.equal(r.j.verdict, "AUCUN_DEPOT");
      assert.equal(r.code, 1, "une racine fausse ne rend pas « tout va bien »");
    } finally { vide.fin(); }
  } finally { p.fin(); }
});

// --- Le mode essai n'écrit rien --------------------------------------------------------------------
/** Un parc où CHAQUE branche du script a quelque chose à faire. */
function parcComplet() {
  const p = creerParc([PILOT, FORGE_A, FORGE_B, QUEUE]);
  // pilot : un enregistrement local « explicite », l'origine avance, un index modifié localement, un non-suivi
  enregistrer(p.depot(PILOT), "scripts/outil.mjs", "// outil\n", "un outil");
  p.avancerOrigine(PILOT, "output/a.md", "a\n", "un livrable");
  ecrire(p.depot(PILOT), "output/b.md", "b\n");
  writeFileSync(join(p.depot(PILOT), "output", "README.md"), readmeOutput("rôle écrit à la main", ["b.md"]));
  // forge A : en retard (avance rapide)
  p.avancerOrigine(FORGE_A, "a.txt", "a\n");
  // forge B : conflit attendu
  enregistrer(p.depot(FORGE_B), "base.txt", "local\n", "local sur base");
  p.avancerOrigine(FORGE_B, "base.txt", "distant\n", "distant sur base");
  // queue : en avance, hors du GO permanent
  enregistrer(p.depot(QUEUE), "local.txt", "local\n", "local");
  // un pre-push partout : s'il est appelé, il laisse une trace DANS le dépôt (donc dans l'empreinte)
  for (const n of [PILOT, FORGE_A, FORGE_B, QUEUE]) hook(p.depot(n), "#!/bin/sh\necho appel >> \"$(git rev-parse --git-dir)/hook-appels.txt\"\nexit 0\n");
  return p;
}

test("(p) --essai N'ÉCRIT RIEN : l'empreinte de tout le parc (.git et origines compris) est identique, hook jamais appelé", () => {
  const p = parcComplet();
  try {
    const avant = empreinte(p.racine);
    const r = lancer(p, ["--essai"]);
    const apres = empreinte(p.racine);
    assert.equal(apres, avant, "le mode essai a écrit quelque part (arbre, .git, origine)");
    for (const n of [PILOT, FORGE_A, FORGE_B, QUEUE]) assert.equal(compteurHook(p.depot(n)), 0, `le hook de ${n} ne se joue pas en essai`);
    assert.equal(r.j.essai, true);
    // ... et il PRÉDIT, il ne se contente pas de se taire :
    const a = de(r, FORGE_A);
    assert.equal(a.statut, "synchronise");
    assert.equal(a.recupere.mode, "avance-rapide");
    assert.deepEqual([a.avant.retard, a.avant.avance], [1, 0]);
    assert.equal(a.apres.prevu, true);
    const b = de(r, FORGE_B);
    assert.equal(b.statut, "conflit");
    assert.deepEqual(b.conflit.fichiers, ["base.txt"]);
    assert.equal(b.conflit.commit.sujet, "local sur base");
    const q = de(r, QUEUE);
    assert.equal(q.statut, "go_manquant");
    const pil = de(r, PILOT);
    assert.equal(pil.statut, "synchronise");
    assert.equal(pil.recupere.mode, "rebase");
    assert.deepEqual(pil.recupere.index_ecartes, ["output/README.md"], "le rebase exige un arbre propre : l'index régénéré serait écarté, puis régénéré");
    assert.deepEqual(pil.index.index_modifies_actuels, ["output/README.md"]);
    assert.equal(pil.publication.go.motif, GO_PERMANENT.pilot);
    assert.equal(pil.publication.classement_r38.verdict, "FAIL", "scripts/outil.mjs est un enregistrement explicite (R-38 par. 4-5)");
    assert.equal(pil.publication.classement_r38.explicites.length, 1);
    assert.equal(r.code, 1, "un conflit prévu se dit par le code de sortie");
  } finally { p.fin(); }
});

test("(q) cas ROUGE de (p) : le même scénario joué SANS --essai change l'empreinte (le test sait voir une écriture)", () => {
  const p = parcComplet();
  try {
    const avant = empreinte(p.racine);
    const r = lancer(p, []);
    assert.notEqual(empreinte(p.racine), avant);
    assert.equal(de(r, FORGE_A).statut, "synchronise");
    assert.equal(de(r, FORGE_B).statut, "conflit");
    assert.equal(de(r, QUEUE).statut, "go_manquant");
    assert.equal(de(r, PILOT).statut, "synchronise");
    assert.equal(compteurHook(p.depot(FORGE_A)), 0, "la forge A n'était qu'en retard : rien à envoyer, donc pas d'envoi");
    assert.equal(compteurHook(p.depot(PILOT)), 1, "le pilot avait un enregistrement local : un envoi, un appel du hook");
    assert.equal(compteurHook(p.depot(QUEUE)), 0);
    // le même parc, REJOUÉ sur sa propre sortie : tout est à jour, plus rien ne s'écrit
    const r2 = lancer(p, []);
    assert.equal(de(r2, FORGE_A).statut, "a_jour");
  } finally { p.fin(); }
});

// --- Les fonctions pures ---------------------------------------------------------------------------
test("(r) fonctions pures : index régénéré, classement d'un refus, cible, GO", () => {
  assert.equal(estIndexRegenere("output/README.md"), true);
  assert.equal(estIndexRegenere("input/00-retours/old/README.md"), true);
  assert.equal(estIndexRegenere("output\\03-etudes\\README.md"), true);
  assert.equal(estIndexRegenere("README.md"), false, "le README de la racine n'est pas un index d'input\\ ou d'output\\");
  assert.equal(estIndexRegenere("output/LISEZMOI.md"), false, "un LISEZMOI est en partie écrit à la main");
  assert.equal(estIndexRegenere("scripts/README.md"), false);
  assert.equal(classerRefus("! [rejected]        HEAD -> main (fetch first)"), "distant_avance");
  assert.equal(classerRefus(" ! [remote rejected] HEAD -> main (incorrect old value provided)"), "distant_avance", "l'autre session a publié PENDANT l'envoi");
  assert.equal(classerRefus("PUBLICATION REFUSEE - un enregistrement en avance exige le GO"), "refus_porte");
  assert.equal(classerRefus("fatal: unable to access 'https://x/': Could not resolve host"), "reseau_ou_acces");
  const cibles = resoudreCibles({ PILOT, FORGES, CANAL }, { racine: "/r", pilot: "/r/p" });
  assert.equal(choisirCible(cibles, "tests").nom, FORGE_A);
  assert.equal(choisirCible(cibles, FORGE_B).nom, FORGE_B);
  assert.equal(choisirCible(cibles, "pilot").type, "pilot");
  assert.equal(choisirCible(cibles, "canal").type, "canal");
  assert.equal(choisirCible(cibles, "n-existe-pas"), null);
  const pilot = cibles[0]; const forge = cibles.find((c) => c.nom === FORGE_A); const queue = cibles.find((c) => c.nom === QUEUE); const canal = cibles.at(-1);
  assert.equal(resoudreGo(pilot, { env: {} }).motif, GO_PERMANENT.pilot);
  assert.equal(resoudreGo(forge, { env: {} }).motif, GO_PERMANENT.forge);
  assert.equal(resoudreGo(queue, { env: {} }), null);
  assert.equal(resoudreGo(canal, { env: {} }), null);
  assert.equal(resoudreGo(queue, { env: { FORGE_PUSH_GO: "D-1" } }).motif, "D-1");
  assert.equal(resoudreGo(forge, { go: "D-2", env: { FORGE_PUSH_GO: "D-1" } }).motif, "D-2");
});

// I5 — LE CLIQUET LIT LA DERNIÈRE LIGNE (voir `lib-baseline-recettes.mjs`) : le compte est imprimé APRÈS le rapport du coureur de tests.
process.on("exit", () => {
  console.log(`Banc synchroniser : ${reussis}/${joues} PASS (D-107 (a) — avance rapide, rebase, dépôt à jour, GO, distant avancé pendant l'envoi, index du pilot ; cas rouges : un conflit laisse le dépôt tel qu'il était, un refus du pre-push est rapporté sans contournement, un rôle écrit à la main bloque et reste intact, hors GO permanent rien ne part, et le mode essai n'écrit rien — empreinte de tout le parc identique, alors que le même scénario sans --essai la change)`);
});
