#!/usr/bin/env node
/**
 * renommer-livrable.test.mjs — le script qui renomme un livrable sous output/, le trace et laisse un renvoi (TF-2737, D-236 (a)).
 *
 * Sens vert : au pilot (jetable, marqué par `todo/TODO.jsonl`) le livrable et ses compagnons (`.jugement.json` suivi, cache `.oracles\` non suivi) sont renommés, `git mv` pour le suivi, une ligne
 * de trace par fichier à `references/RENOMMAGES-LIVRABLES.jsonl` ; `--vers <dossier>/` garde le nom (R-7 bis, déplacement vers `old/`) ; `--sec` ne touche à rien ; deux renommages
 * se suivent en chaîne ; chez un produit, l'entrée `deplacement_effectue` est écrite PAR `forge/ledger.py` (puis `--verifier` du ledger la juge) et par `ledger.mjs` de forge-agents quand il est là ;
 * un produit sans ledger de run écrit son repli. Sens rouge : une destination qui existe, une source hors `output/`, un README, un dossier, une destination hors `output/`, une source absente,
 * un compagnon dont la place est prise : exit 1, RIEN de déplacé ; une trace refusée par l'écrivain du ledger : le déplacement est DÉFAIT (le fichier est revenu à son nom).
 * Le renvoi se suit : `--suivre` sur l'ancien chemin rend le courant ; la bibliothèque rend null pour un chemin sans renvoi et pour un aller-retour (a → b → a).
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { appendFileSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { suivreRenommage, lireRenvois } from "../oracles/lib-renommages-livrables.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const SCRIPT = join(ICI, "renommer-livrable.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const base = mkdtempSync(join(tmpdir(), "renommer-livrable-"));
const git = (cwd, ...a) => spawnSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "-c", "core.autocrlf=false", ...a], { cwd, encoding: "utf8" });
const ecrire = (racine, rel, texte = "x\n") => { const f = join(racine, ...rel.split("/")); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, texte); };
const jouer = (cwd, ...args) => spawnSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: "utf8", env: { ...process.env, FORGE_ROOT: process.env.FORGE_ROOT || "C:\\dev", PYTHONUTF8: "1" } });
const lignes = (f) => readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
const statutGit = (racine) => git(racine, "status", "--porcelain").stdout;

/** Un dépôt jetable : `pilot` pose le marqueur du pilot, sinon c'est un produit (avec `ledger` : forge/ledger.py + un run ouvert). */
function depot(nom, { pilot = false, ledger = false } = {}) {
  const racine = join(base, nom);
  mkdirSync(racine, { recursive: true });
  git(racine, "init", "-q");
  const dossier = "output/04-plans";
  const livre = `${dossier}/Produit - Etude - 20261123a.md`;
  ecrire(racine, livre, "# etude\n");
  ecrire(racine, `${livre}.jugement.json`, "{}\n");
  ecrire(racine, "README.md", "# depot\n");
  if (pilot) { ecrire(racine, "todo/TODO.jsonl", ""); ecrire(racine, "references/RENOMMAGES-LIVRABLES.jsonl", ""); }
  if (ledger) {
    mkdirSync(join(racine, "forge"), { recursive: true });
    copyFileSync(join(PILOT, "gabarits", "ledger.py"), join(racine, "forge", "ledger.py"));
    const r = spawnSync("python", [join(racine, "forge", "ledger.py"), "run_open", "--run", "essai", "--type_run", "mandat", "--versions_forges", "{}"], { cwd: racine, encoding: "utf8", env: { ...process.env, PYTHONUTF8: "1" } });
    att(r.status === 0, `ledger de fixture : ${r.stderr}`);
  }
  git(racine, "add", "-A"); git(racine, "commit", "-q", "-m", "départ");
  // Un cache d'oracle NON suivi, et un compagnon qui n'en est pas un : un autre livrable dont le nom commence pareil sans point.
  ecrire(racine, `.oracles/${livre}.oracles.json`, "{}\n");
  ecrire(racine, `${dossier}/Produit - Etude - 20261123ab.md`, "autre\n");
  return { racine, livre, dossier };
}

try {
  // ---- Au pilot ----
  const P = depot("pilot", { pilot: true });
  check("pilot — `--sec` dit le plan et ne touche à rien", () => {
    const r = jouer(P.racine, "--de", P.livre, "--vers", `${P.dossier}/Produit - Etude - 20261123c.md`, "--sec");
    att(r.status === 0 && /À BLANC — 3 fichier/.test(r.stdout), `${r.status} ${r.stdout} ${r.stderr}`);
    att(existsSync(join(P.racine, P.livre)) && !lignes(join(P.racine, "references/RENOMMAGES-LIVRABLES.jsonl")).length, "à blanc a touché au dépôt");
  });
  const nouveau = `${P.dossier}/Produit - Etude - 20261123c.md`;
  check("pilot — le livrable, son sceau suivi et son cache `.oracles` non suivi sont renommés ; `git mv` pour le suivi ; le voisin à indice proche reste", () => {
    const r = jouer(P.racine, "--de", P.livre, "--vers", nouveau, "--motif", "indice repris");
    att(r.status === 0 && /RENOMMÉ : /.test(r.stdout) && /TRACE : journal du pilot/.test(r.stdout) && /RENVOI : /.test(r.stdout), `${r.status} ${r.stdout} ${r.stderr}`);
    att(!existsSync(join(P.racine, P.livre)) && existsSync(join(P.racine, nouveau)), "le livrable n'a pas bougé");
    att(existsSync(join(P.racine, `${nouveau}.jugement.json`)) && !existsSync(join(P.racine, `${P.livre}.jugement.json`)), "le sceau n'a pas suivi");
    att(existsSync(join(P.racine, ".oracles", `${nouveau}.oracles.json`)) && !existsSync(join(P.racine, ".oracles", `${P.livre}.oracles.json`)), "le cache d'oracle n'a pas suivi");
    att(existsSync(join(P.racine, `${P.dossier}/Produit - Etude - 20261123ab.md`)), "un autre livrable a été emporté");
    const st = statutGit(P.racine);
    att(/^R /m.test(st) && st.includes("20261123c.md"), `git ne voit pas un renommage : ${st}`);
  });
  check("pilot — une ligne de trace par fichier déplacé, au journal que `ranger-dossiers.mjs` écrit déjà (ancien, nouveau, motif, ts)", () => {
    const l = lignes(join(P.racine, "references/RENOMMAGES-LIVRABLES.jsonl"));
    att(l.length === 3 && l[0].ancien === P.livre && l[0].nouveau === nouveau && l[0].motif === "indice repris" && /^\d{4}-/.test(l[0].ts), JSON.stringify(l));
    att(l.some((x) => x.ancien === `${P.livre}.jugement.json`) && l.some((x) => x.ancien === `.oracles/${P.livre}.oracles.json`), "compagnons non tracés");
  });
  check("renvoi — `--suivre` sur l'ancien chemin rend le courant (exit 0) ; sur un chemin sans renvoi ni fichier, exit 1 ; sur un fichier à sa place, exit 0", () => {
    const r = jouer(P.racine, "--suivre", P.livre);
    att(r.status === 0 && r.stdout.includes(`→ ${nouveau}`), `${r.status} ${r.stdout}`);
    const inconnu = jouer(P.racine, "--suivre", `${P.dossier}/Rien - Etude - 20261123z.md`);
    att(inconnu.status === 1 && /aucun renvoi connu/.test(inconnu.stdout), `${inconnu.status} ${inconnu.stdout}`);
    const present = jouer(P.racine, "--suivre", nouveau);
    att(present.status === 0 && /aucun renvoi, le fichier est à son chemin/.test(present.stdout), `${present.status} ${present.stdout}`);
  });
  check("chaîne — un second renommage prolonge le renvoi : l'ancien chemin d'origine mène au dernier", () => {
    const r = jouer(P.racine, "--de", nouveau, "--vers", `${P.dossier}/Produit - Etude - 20261123d.md`);
    att(r.status === 0, `${r.stdout} ${r.stderr}`);
    const s = suivreRenommage(P.racine, P.livre);
    att(s && s.chemin === `${P.dossier}/Produit - Etude - 20261123d.md` && s.etapes === 2 && existsSync(s.complet), JSON.stringify(s));
    const aussi = suivreRenommage(P.racine, join(P.racine, ...P.livre.split("/")));
    att(aussi && aussi.chemin === s.chemin, "un chemin complet ne se suit pas");
  });
  check("R-7 bis — `--vers <dossier>/old/` garde le nom et crée le dossier ; le chemin d'origine se suit jusque là", () => {
    const courant = `${P.dossier}/Produit - Etude - 20261123d.md`;
    const r = jouer(P.racine, "--de", courant, "--vers", `${P.dossier}/old/`, "--motif", "version remplacée");
    att(r.status === 0 && existsSync(join(P.racine, P.dossier, "old", "Produit - Etude - 20261123d.md")), `${r.status} ${r.stdout} ${r.stderr}`);
    const s = suivreRenommage(P.racine, P.livre);
    att(s && s.chemin === `${P.dossier}/old/Produit - Etude - 20261123d.md` && s.etapes === 3, JSON.stringify(s));
  });
  check("bibliothèque — un chemin sans renvoi rend null, un aller-retour (a → b → a) aussi, hors output/ aussi", () => {
    att(suivreRenommage(P.racine, `${P.dossier}/Jamais - Etude - 20261123z.md`) === null, "chemin inconnu");
    att(suivreRenommage(P.racine, "docs/x.md") === null && suivreRenommage("", P.livre) === null, "hors output ou sans racine");
    const C = join(base, "cycle");
    ecrire(C, "references/RENOMMAGES-LIVRABLES.jsonl", `${JSON.stringify({ ancien: "output/a.md", nouveau: "output/b.md" })}\n${JSON.stringify({ ancien: "output/b.md", nouveau: "output/a.md" })}\n`);
    att(suivreRenommage(C, "output/a.md") === null, "un aller-retour est suivi");
    appendFileSync(join(C, "references/RENOMMAGES-LIVRABLES.jsonl"), "pas du json\n" + JSON.stringify({ ancien: "output/Z.md", nouveau: "output/y.md" }) + "\n");
    att(suivreRenommage(C, "OUTPUT\\z.md")?.chemin === "output/y.md", "la clé ne passe pas la casse et les antislash, ou une ligne illisible arrête le journal");
    att(lireRenvois(C).size === 3, `renvois lus : ${lireRenvois(C).size}`);
  });

  // ---- Les refus : rien n'est déplacé ----
  const R = depot("refus", { pilot: true });
  const avant = statutGit(R.racine);
  const refus = (nom, args, motif) => check(`rouge — ${nom} : exit 1, ${motif}, rien de déplacé`, () => {
    const r = jouer(R.racine, ...args);
    att(r.status === 1 && r.stderr.includes(motif), `${r.status} ${r.stderr}`);
    att(statutGit(R.racine) === avant && existsSync(join(R.racine, R.livre)), "l'arbre a changé");
  });
  refus("une destination qui existe", ["--de", R.livre, "--vers", `${R.dossier}/Produit - Etude - 20261123ab.md`], "la destination existe déjà");
  refus("une source hors output/", ["--de", "README.md", "--vers", "output/README2.md"], "n'est pas sous output/");
  refus("une destination hors output/", ["--de", R.livre, "--vers", "docs/Produit - Etude - 20261123a.md"], "la destination n'est pas sous output/");
  refus("une source absente", ["--de", `${R.dossier}/Absent - Etude - 20261123a.md`, "--vers", `${R.dossier}/Autre - Etude - 20261123a.md`], "n'est pas un fichier existant");
  refus("un dossier", ["--de", R.dossier, "--vers", "output/04-plans-bis"], "n'est pas un fichier existant");
  refus("la destination est la source", ["--de", R.livre, "--vers", R.livre], "la destination est la source");
  refus("--vers manquant", ["--de", R.livre], "--de et --vers sont exigés");
  refus("un argument inconnu", ["--de", R.livre, "--vers", "output/x.md", "--force"], "argument inconnu");
  check("rouge — un README sous output/ est refusé comme non livrable", () => {
    ecrire(R.racine, "output/04-plans/README.md", "# index\n");
    const r = jouer(R.racine, "--de", "output/04-plans/README.md", "--vers", "output/04-plans/LISEZ.md");
    att(r.status === 1 && /régénéré par hook/.test(r.stderr), `${r.status} ${r.stderr}`);
  });
  check("rouge — la place d'un compagnon prise : exit 1, rien de déplacé (un sceau n'en écrase pas un autre)", () => {
    ecrire(R.racine, `${R.dossier}/Produit - Etude - 20261123q.md.jugement.json`, "{}\n");
    const r = jouer(R.racine, "--de", R.livre, "--vers", `${R.dossier}/Produit - Etude - 20261123q.md`);
    att(r.status === 1 && /la place d'un compagnon est prise/.test(r.stderr) && existsSync(join(R.racine, R.livre)), `${r.status} ${r.stderr}`);
  });

  // ---- Chez un produit : au ledger, par son écrivain ----
  const L = depot("produit-py", { ledger: true });
  const nvL = `${L.dossier}/Produit - Etude - 20261123e.md`;
  check("produit (ledger.py) — l'entrée `deplacement_effectue` (ancien, nouveau, motif, compagnons) est écrite PAR forge/ledger.py, le ledger se vérifie encore, le renvoi se suit", () => {
    const r = jouer(L.racine, "--de", L.livre, "--vers", nvL, "--motif", "indice repris");
    att(r.status === 0 && /TRACE : ledger du produit, par forge\/ledger\.py/.test(r.stdout), `${r.status} ${r.stdout} ${r.stderr}`);
    const entrees = lignes(join(L.racine, "forge", "ledger.jsonl"));
    const e = entrees[entrees.length - 1];
    att(e.type === "deplacement_effectue" && e.ancien === L.livre && e.nouveau === nvL && e.motif === "indice repris" && e.compagnons.length === 2 && e.seq === entrees.length, JSON.stringify(e));
    const v = spawnSync("python", [join(L.racine, "forge", "ledger.py"), "--verifier"], { cwd: L.racine, encoding: "utf8", env: { ...process.env, PYTHONUTF8: "1" } });
    att(v.status === 0, `ledger.py --verifier : ${v.stdout} ${v.stderr}`);
    att(suivreRenommage(L.racine, L.livre)?.chemin === nvL, "le renvoi du ledger ne se suit pas");
    att(!existsSync(join(L.racine, "forge", "renommages-livrables.jsonl")), "le repli a été écrit en plus du ledger");
  });
  check("produit — une trace REFUSÉE par l'écrivain du ledger défait le déplacement : le livrable, son sceau et son cache sont revenus", () => {
    const D = depot("produit-refus", { ledger: true });
    writeFileSync(join(D.racine, "forge", "ledger.py"), "import sys\nsys.exit('refus de fixture')\n");
    const r = jouer(D.racine, "--de", D.livre, "--vers", `${D.dossier}/Produit - Etude - 20261123e.md`);
    att(r.status === 1 && /le déplacement est défait/.test(r.stderr) && /refus de fixture/.test(r.stderr), `${r.status} ${r.stderr}`);
    att(existsSync(join(D.racine, D.livre)) && existsSync(join(D.racine, `${D.livre}.jugement.json`)) && existsSync(join(D.racine, ".oracles", `${D.livre}.oracles.json`)), "un fichier n'est pas revenu");
    att(!existsSync(join(D.racine, `${D.dossier}/Produit - Etude - 20261123e.md`)), "le fichier est resté à la destination");
    att(!/^R/m.test(statutGit(D.racine)), `git garde un renommage : ${statutGit(D.racine)}`);
  });
  const MJS = join(process.env.FORGE_ROOT || "C:\\dev", "digit-ai-forge-agents", ".claude", "skills", "forge-agents", "scripts", "ledger.mjs");
  if (existsSync(MJS)) check("produit (ledger.mjs de forge-agents) — sans forge/ledger.py, l'entrée est écrite par ledger.mjs et se suit", () => {
    const M = depot("produit-mjs", { ledger: true });
    rmSync(join(M.racine, "forge", "ledger.py"));
    const r = jouer(M.racine, "--de", M.livre, "--vers", `${M.dossier}/Produit - Etude - 20261123e.md`);
    att(r.status === 0 && /par ledger\.mjs de forge-agents/.test(r.stdout), `${r.status} ${r.stdout} ${r.stderr}`);
    const entrees = lignes(join(M.racine, "forge", "ledger.jsonl"));
    att(entrees[entrees.length - 1].type === "deplacement_effectue" && suivreRenommage(M.racine, M.livre)?.chemin === `${M.dossier}/Produit - Etude - 20261123e.md`, JSON.stringify(entrees[entrees.length - 1]));
  });
  else console.log(`  [SKIP] produit (ledger.mjs de forge-agents) — ${MJS} absent : le canal ledger.mjs n'est pas joué sur ce poste`);
  check("produit sans ledger de run — repli dit à l'écran, écrit à forge/renommages-livrables.jsonl, et le renvoi se suit", () => {
    const S = depot("produit-sans-ledger");
    const r = jouer(S.racine, "--de", S.livre, "--vers", `${S.dossier}/Produit - Etude - 20261123e.md`);
    att(r.status === 0 && /TRACE : repli forge\/renommages-livrables\.jsonl/.test(r.stdout), `${r.status} ${r.stdout} ${r.stderr}`);
    att(lignes(join(S.racine, "forge", "renommages-livrables.jsonl")).length === 3 && suivreRenommage(S.racine, S.livre)?.chemin === `${S.dossier}/Produit - Etude - 20261123e.md`, "repli non écrit ou non suivi");
  });
  check("la source donnée depuis un autre dossier : le dépôt est celui du fichier, pas celui du dossier de travail ; `--racine` explicite aussi", () => {
    const A = depot("autre-dossier", { pilot: true });
    const r = jouer(base, "--de", join(A.racine, A.livre), "--vers", join(A.racine, A.dossier, "Produit - Etude - 20261123f.md"));
    att(r.status === 0 && existsSync(join(A.racine, A.dossier, "Produit - Etude - 20261123f.md")), `${r.status} ${r.stdout} ${r.stderr}`);
    const B = depot("avec-racine", { pilot: true });
    const rr = jouer(base, "--racine", B.racine, "--de", join(B.racine, B.livre), "--vers", join(B.racine, B.dossier, "old") + "/");
    att(rr.status === 0 && existsSync(join(B.racine, B.dossier, "old", "Produit - Etude - 20261123a.md")), `${rr.status} ${rr.stdout} ${rr.stderr}`);
  });
} finally {
  try { rmSync(base, { recursive: true, force: true }); } catch { /* verrou toléré */ }
}

console.log(`\nrenommer-livrable (TF-2737, D-236 (a)) : ${pass} PASS, ${fail} FAIL — cas rouges : destination prise, source hors output/, README, dossier, destination hors output/, source absente, compagnon pris, trace refusée par le ledger (déplacement défait)`);
process.exit(fail ? 1 : 0);
