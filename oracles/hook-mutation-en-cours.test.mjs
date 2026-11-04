#!/usr/bin/env node
/**
 * hook-mutation-en-cours.test.mjs — le verrou de mutation de forge-tests, lu par le hook des produits
 * (TF-2126, côté lecture du verrou posé par forge-tests 9ea4f4a, TF-2091).
 *
 * Sens rouge : tant que `.forge-tests-mutation-en-cours` existe, `git commit` (nu, `-am`, `--amend`),
 * `git -C <projet> commit`, `cd <projet> && git commit`, un commit depuis un sous-dossier, sous Bash comme
 * sous PowerShell, `git add` d'un fichier muté / `.` / `-A` / un dossier / un motif, et un déploiement de
 * la liste fermée sont refusés (exit 2). Le message nomme les fichiers mutés ; il dit « VIVANT » (attendre)
 * quand le pid du verrou vit, « MORT » (verrou orphelin, relire le diff puis restaurer) quand il est mort ;
 * un verrou illisible ou sans pid reste un verrou.
 * Sens vert : sans verrou, tout passe ; avec verrou, les lectures, `git restore`, `git add` d'un fichier
 * étranger, un commit dans un AUTRE dossier, un mot « commit » hors de git, un outil qui n'est pas une
 * commande. Remède JOUÉ (TF-1013) : sur un vrai dépôt git dont une source porte un mutant et dont le
 * verrou est orphelin, le commit est refusé ; on suit le remède du message (`git restore`, retrait du
 * verrou) ; le commit passe et le contenu commité est l'original, sans mutant. Le verrou vivant se lève
 * quand la campagne le retire.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "hook-mutation-en-cours.mjs");
const VERROU = ".forge-tests-mutation-en-cours";
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const jouer = (tool_name, command, cwd) => {
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd, input: JSON.stringify({ tool_name, cwd, tool_input: { command } }) });
  return { code: r.status, err: r.stderr || "" };
};

const base = mkdtempSync(join(tmpdir(), "mutation-en-cours-"));
const pidMort = spawnSync(process.execPath, ["-e", ""]).pid; // un processus fini : son pid est mort
const poser = (projet, charge) => writeFileSync(join(projet, VERROU), typeof charge === "string" ? charge : JSON.stringify(charge), "utf8");
const chargeDe = (pid) => ({ pid, depuis: new Date(Date.now() - 4 * 60000).toISOString(), fichiers: ["app/audit.py", "app/egress.py"],
  message: "mutation forge-tests en cours — sources alterees par un mutant, ne pas commiter" });
const projet = (nom) => { const p = join(base, nom); mkdirSync(join(p, "app"), { recursive: true }); return p; };

try {
  // --- Sens rouge : verrou tenu par une campagne VIVANTE (le pid du test) ------------------------------
  const pv = projet("vivant");
  poser(pv, chargeDe(process.pid));
  const ROUGES = [
    ["Bash", "git commit -m \"correctif\"", pv, "git commit"],
    ["Bash", "git add app/audit.py && git commit -am \"x\"", pv, "git commit -am, après un add du fichier muté"],
    ["Bash", "git commit --amend --no-edit", pv, "git commit --amend"],
    ["PowerShell", "git status; git commit -m x", pv, "git commit sous PowerShell"],
    ["Bash", "git commit -m x", join(pv, "app"), "commit lancé depuis un sous-dossier (le verrou est au parent)"],
    ["Bash", `git -C "${pv}" commit -m x`, base, "git -C vers le projet verrouillé"],
    ["Bash", `cd "${pv}" && git commit -m x`, base, "cd vers le projet verrouillé"],
    ["Bash", "git add app/audit.py", pv, "add du fichier muté"],
    ["Bash", "git add .", pv, "add ."],
    ["Bash", "git add -A", pv, "add -A"],
    ["Bash", "git add app", pv, "add du dossier qui contient les fichiers mutés"],
    ["Bash", "git add app/*.py", pv, "add d'un motif"],
    ["Bash", "az webapp deploy --name site --src-path app.zip", pv, "déploiement az webapp deploy"],
    ["Bash", "npm publish", pv, "npm publish"],
    ["PowerShell", "wrangler pages deploy ./dist", pv, "wrangler pages deploy"],
  ];
  for (const [outil, cmd, cwd, nom] of ROUGES) {
    check(`rouge — ${nom} : refusé (exit 2, TF-2126, fichiers nommés)`, () => {
      const r = jouer(outil, cmd, cwd);
      if (r.code !== 2 || !/MUTATION EN COURS \(TF-2126\)/.test(r.err)) throw new Error(`exit ${r.code} : ${r.err.slice(0, 160)}`);
      if (!/app\/audit\.py, app\/egress\.py/.test(r.err)) throw new Error(`fichiers non nommés : ${r.err.slice(0, 260)}`);
    });
  }
  check("rouge — verrou VIVANT : le message dit VIVANT, l'âge de pose, et d'attendre sans supprimer le verrou", () => {
    const r = jouer("Bash", "git commit -m x", pv);
    if (!/pid \d+ VIVANT/.test(r.err) || !/il y a \d+ min/.test(r.err) || !/attendre la fin/.test(r.err) || !/Ne pas supprimer le verrou/.test(r.err)) throw new Error(r.err.slice(0, 400));
  });

  // --- Sens rouge : verrou ORPHELIN (pid mort), illisible, sans pid ----------------------------------
  const po = projet("orphelin");
  poser(po, chargeDe(pidMort));
  check("rouge — verrou ORPHELIN : refusé, le message dit MORT et donne le remède (diff, restore, retrait du verrou)", () => {
    const r = jouer("Bash", "git commit -m x", po);
    if (r.code !== 2 || !/pid \d+ MORT/.test(r.err) || !/orphelin/.test(r.err) || !/git diff -- "app\/audit\.py" "app\/egress\.py"/.test(r.err)
      || !/git restore -- "app\/audit\.py" "app\/egress\.py"/.test(r.err) || !/supprimer le verrou/.test(r.err)) throw new Error(`exit ${r.code} : ${r.err.slice(0, 500)}`);
  });
  const pi = projet("illisible");
  poser(pi, "{ pas du json");
  check("rouge — verrou ILLISIBLE : reste un verrou, refusé avec le remède d'un orphelin", () => {
    const r = jouer("Bash", "git commit -m x", pi);
    if (r.code !== 2 || !/ILLISIBLE/.test(r.err) || !/orphelin/.test(r.err)) throw new Error(`exit ${r.code} : ${r.err.slice(0, 300)}`);
  });
  const ps = projet("sans-pid");
  poser(ps, { depuis: new Date().toISOString(), fichiers: ["app/audit.py"], message: "x" });
  check("rouge — verrou SANS pid : refusé, remède de l'orphelin", () => {
    const r = jouer("Bash", "git commit -m x", ps);
    if (r.code !== 2 || !/pid absent/.test(r.err) || !/orphelin/.test(r.err)) throw new Error(`exit ${r.code} : ${r.err.slice(0, 300)}`);
  });

  // --- Sens vert -------------------------------------------------------------------------------------
  const pn = projet("sans-verrou");
  const VERTS = [
    ["Bash", "git commit -m x", pn, "sans verrou : git commit passe"],
    ["Bash", "git add . && git commit -am x", pn, "sans verrou : add puis commit passent"],
    ["Bash", "az webapp deploy --name site --src-path app.zip", pn, "sans verrou : le déploiement passe"],
    ["Bash", "git status", pv, "avec verrou : git status"],
    ["Bash", "git diff -- app/audit.py", pv, "avec verrou : git diff (le remède se lit)"],
    ["Bash", "git log -3 --oneline", pv, "avec verrou : git log"],
    ["Bash", "git restore -- app/audit.py", pv, "avec verrou : git restore (le remède)"],
    ["Bash", "git add README.md", pv, "avec verrou : add d'un fichier étranger à la mutation"],
    ["Bash", "git commit -m x", pn, "commit dans un AUTRE projet, sans verrou"],
    ["Bash", `cd "${pn}" && git commit -m x`, pv, "cd vers un autre projet avant le commit"],
    ["Bash", `git -C "${pn}" commit -m x`, pv, "git -C vers un autre projet"],
    ["Bash", "echo \"git commit\"", pv, "le mot hors de git"],
    ["Bash", "grep -rn commit docs/", pv, "grep commit"],
    ["Bash", "az webapp show --name site", pv, "az webapp show (lecture)"],
    ["Bash", "npm test", pv, "npm test"],
    ["Write", "git commit -m x", pv, "outil qui n'est pas une commande"],
  ];
  for (const [outil, cmd, cwd, nom] of VERTS) {
    check(`vert — ${nom} : laisse passer`, () => {
      const r = jouer(outil, cmd, cwd);
      if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.err.slice(0, 200)}`);
    });
  }
  check("vert — le verrou vivant se lève quand la campagne le retire (fenêtre fermée)", () => {
    const p = projet("fenetre");
    poser(p, chargeDe(process.pid));
    if (jouer("Bash", "git commit -m x", p).code !== 2) throw new Error("le verrou posé n'est pas tenu");
    unlinkSync(join(p, VERROU));
    const r = jouer("Bash", "git commit -m x", p);
    if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.err.slice(0, 200)}`);
  });

  // --- Le remède JOUÉ sur un vrai dépôt (TF-1013) ----------------------------------------------------
  check("remède joué — dépôt réel, mutant laissé par une campagne morte : refus, restore, retrait du verrou, commit sans mutant", () => {
    const p = projet("depot-reel");
    const g = (...a) => spawnSync("git", ["-c", "user.name=banc", "-c", "user.email=banc@exemple.invalide", "-c", "commit.gpgsign=false", "-c", "core.autocrlf=false", ...a], { cwd: p, encoding: "utf8" });
    const ORIGINAL = "def signe(x):\n    if x > 0:\n        return 1\n    return 0\n";
    const MUTANT = "def signe(x):\n    if x < 0:\n        return 1\n    return 0\n";
    if (g("init", "-q").status !== 0) throw new Error("git init impossible");
    writeFileSync(join(p, "app", "audit.py"), ORIGINAL, "utf8");
    writeFileSync(join(p, ".gitignore"), VERROU + "\n", "utf8");
    g("add", ".");
    if (g("commit", "-q", "-m", "départ").status !== 0) throw new Error("commit de départ impossible");
    writeFileSync(join(p, "app", "audit.py"), MUTANT, "utf8"); // la campagne est morte sans restaurer
    poser(p, { pid: pidMort, depuis: new Date().toISOString(), fichiers: ["app/audit.py"], message: "ne pas commiter" });
    const refus = jouer("Bash", "git commit -am \"mutant\"", p);
    if (refus.code !== 2) throw new Error(`le commit du mutant n'est pas refusé : exit ${refus.code}`);
    // Le remède du message : 1) diff (ne montre que le mutant), 2) restore, 3) retrait du verrou.
    if (!/x < 0/.test(g("diff", "--", "app/audit.py").stdout)) throw new Error("le diff ne montre pas le mutant");
    if (g("restore", "--", "app/audit.py").status !== 0) throw new Error("git restore a échoué");
    unlinkSync(join(p, VERROU));
    writeFileSync(join(p, "app", "autre.py"), "x = 1\n", "utf8"); // un changement légitime ensuite
    const apres = jouer("Bash", "git add app/autre.py && git commit -m \"changement légitime\"", p);
    if (apres.code !== 0) throw new Error(`le remède joué ne lève pas le refus : exit ${apres.code} ${apres.err.slice(0, 200)}`);
    g("add", "app/autre.py");
    if (g("commit", "-q", "-m", "changement légitime").status !== 0) throw new Error("le commit réel échoue après le remède");
    const commite = g("show", "HEAD:app/audit.py").stdout;
    if (commite !== ORIGINAL || readFileSync(join(p, "app", "audit.py"), "utf8") !== ORIGINAL) throw new Error("un mutant est resté dans le dépôt ou l'arbre");
    if (existsSync(join(p, VERROU))) throw new Error("le verrou est resté");
  });
} finally {
  try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ }
}

console.log(`\nhook-mutation-en-cours : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
