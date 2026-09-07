// Recette de rebatir-clone.mjs (D-12 a, TF-0877, 07/09/2026) — double sens sur dépôts factices :
// un « distant » dont l'histoire est réécrite après qu'un clone a pris de l'avance, une arborescence
// liée oubliée dans le clone ; le script doit sauvegarder, réaligner, rejouer le commit propre et
// retirer l'arborescence — et REFUSER un arbre sale, ne RIEN faire sur un clone à jour.
//
// Lancer :  node scripts/rebatir-clone.test.mjs   (joué par oracles/self-tests.mjs, invariant I2 ;
// lanceur maison du pilot : la dernière ligne porte le compte « N PASS, M FAIL » que la baseline lit)
import assert from "node:assert/strict";
const CAS = [];
const test = (nom, fn) => CAS.push([nom, fn]);
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(ICI, "rebatir-clone.mjs");
const sh = (cwd, cmd, ...a) => { const r = spawnSync(cmd, a, { cwd, encoding: "utf8" }); if (r.status !== 0) throw new Error(`${cmd} ${a.join(" ")} : ${r.stderr || r.stdout}`); return (r.stdout || "").trim(); };
const g = (cwd, ...a) => sh(cwd, "git", "-c", "user.email=recette@example.com", "-c", "user.name=recette", "-c", "commit.gpgsign=false", ...a);
const lancer = (depot, ...opts) => { const r = spawnSync(process.execPath, [SCRIPT, depot, "--json-only", ...opts], { encoding: "utf8", env: { ...process.env, FORGE_ROOT: dirname(depot), FORGE_SKILLS_INSTALLES: join(dirname(depot), "aucun-skill") } }); let j = null; try { j = JSON.parse(r.stdout); } catch { /* laissé nul */ } return { code: r.status, j, brut: r.stdout + r.stderr }; };

function parc() {
  const base = mkdtempSync(join(tmpdir(), "rebatir-"));
  const distant = join(base, "distant.git");
  g(base, "init", "--bare", "-b", "main", distant);
  const auteur = join(base, "auteur");
  g(base, "clone", "-q", distant, auteur);
  writeFileSync(join(auteur, "a.txt"), "un\n"); g(auteur, "add", "."); g(auteur, "commit", "-q", "-m", "premier commit, message sale : NomClient");
  writeFileSync(join(auteur, "b.txt"), "deux\n"); g(auteur, "add", "."); g(auteur, "commit", "-q", "-m", "second commit");
  g(auteur, "push", "-q", "origin", "main");
  const poste = join(base, "poste");
  g(base, "clone", "-q", distant, poste);
  return { base, distant, auteur, poste };
}

test("clone à jour → rien à rebâtir (exit 0), aucune sauvegarde écrite", () => {
  const { base, poste } = parc();
  const r = lancer(poste);
  assert.equal(r.code, 0, r.brut);
  assert.match(r.j.message, /rien à rebâtir/);
  assert.equal(r.j.sauvegarde, null);
  rmSync(base, { recursive: true, force: true });
});

test("arbre sale → refus (exit 2), rien n'est touché", () => {
  const { base, poste } = parc();
  writeFileSync(join(poste, "a.txt"), "modifié\n");
  const r = lancer(poste);
  assert.equal(r.code, 2, r.brut);
  assert.match(r.j.message, /arbre de travail sale/);
  assert.match(sh(poste, "git", "status", "--porcelain"), /^\s*M a\.txt$/);
  rmSync(base, { recursive: true, force: true });
});

test("histoire distante réécrite + commit propre au poste + arborescence liée → sauvegardé, réaligné, rejoué, arborescence retirée, porte déclarée", () => {
  const { base, auteur, poste } = parc();
  // le poste prend de l'avance : un commit propre
  writeFileSync(join(poste, "local.txt"), "travail du poste\n"); g(poste, "add", "."); g(poste, "commit", "-q", "-m", "travail propre au poste");
  // et une arborescence liée oubliée, détachée sur l'ancienne histoire
  const lie = join(base, "avant");
  g(poste, "worktree", "add", "-q", "--detach", lie, "HEAD~1");
  // l'auteur réécrit l'histoire publiée (message pseudonymisé) et publie en force
  g(auteur, "filter-branch", "-f", "--msg-filter", "sed s/NomClient/Client-A/", "--", "--all");
  g(auteur, "push", "-q", "--force", "origin", "main");
  const essai = lancer(poste, "--essai");
  assert.equal(essai.code, 0, essai.brut);
  // Après une réécriture, l'AVANCE par hachage compte aussi les anciens commits réécrits (ici 3) :
  // c'est le delta PROPRE au poste, mesuré depuis l'ancien origin/main, qui vaut 1.
  assert.equal(essai.j.avant.avance, 3, "avance par hachage : deux commits réécrits + un propre"); assert.ok(essai.j.avant.retard >= 1); assert.equal(essai.j.avant.delta_propre, 1);
  assert.equal(essai.j.patches.length, 1, `un patch propre au poste annoncé — mesuré : ${JSON.stringify(essai.j.avant)} ${JSON.stringify(essai.j.patches)}`);
  assert.ok(existsSync(join(poste, "local.txt")) && essai.j.sauvegarde.verifie === null, "l'essai n'écrit rien");
  const r = lancer(poste, "--sauvegardes", join(base, "sauv"));
  assert.equal(r.code, 0, r.brut);
  assert.equal(r.j.sauvegarde.verifie, true, "paquet vérifié");
  assert.ok(existsSync(r.j.sauvegarde.paquet));
  assert.equal(r.j.rejeu.length, 1); assert.equal(r.j.rejeu[0].statut, "rejoue");
  assert.equal(r.j.worktrees_retires.length, 1);
  assert.equal(r.j.apres.avance, 1); assert.equal(r.j.apres.retard, 0, "réaligné sur la nouvelle histoire");
  assert.ok(existsSync(join(poste, "local.txt")), "le travail propre au poste est rejoué");
  assert.match(g(poste, "log", "-1", "--format=%s", "HEAD~1"), /second commit/);
  assert.match(g(poste, "log", "--format=%s", "--all"), /Client-A/); assert.doesNotMatch(g(poste, "log", "--format=%s", "--all"), /NomClient/, "l'ancienne histoire n'est plus atteignable");
  assert.equal(g(poste, "worktree", "list").split("\n").length, 1, "arborescence liée retirée");
  assert.ok(existsSync(lie), "les fichiers de l'arborescence liée sont laissés en place");
  assert.equal(r.j.porte.verdict, "SKIP", "sans oracle sur le poste de recette, la porte se déclare SKIP — jamais PASS par défaut");
  assert.match(r.j.message, /GO humain/, "la publication reste un GO humain, jamais un push du script");
  assert.ok(readdirSync(join(base, "sauv")).some((f) => f.endsWith(".HEAD.txt")), "HEAD d'avant consigné");
  rmSync(base, { recursive: true, force: true });
});

test("rejeu en conflit → exit 1, patch conservé, clone laissé sur origin/main", () => {
  const { base, auteur, poste } = parc();
  writeFileSync(join(poste, "a.txt"), "version du poste\n"); g(poste, "add", "."); g(poste, "commit", "-q", "-m", "le poste modifie a.txt");
  writeFileSync(join(auteur, "a.txt"), "version publiée\n"); g(auteur, "add", "."); g(auteur, "commit", "-q", "--amend", "-m", "second commit, a.txt réécrit"); g(auteur, "push", "-q", "--force", "origin", "main");
  const r = lancer(poste, "--sauvegardes", join(base, "sauv"));
  assert.equal(r.code, 1, r.brut);
  assert.equal(r.j.rejeu[0].statut, "echoue");
  assert.match(r.j.message, /conflit/);
  assert.equal(r.j.apres.retard, 0);
  assert.ok(readdirSync(join(base, "sauv")).some((f) => f.endsWith("-patches")), "le patch reste sur disque");
  assert.equal(sh(poste, "git", "status", "--porcelain").trim(), "", "aucun état am résiduel");
  rmSync(base, { recursive: true, force: true });
});

let pass = 0, fail = 0;
for (const [nom, fn] of CAS) {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${String(e.message || e).split("\n")[0].slice(0, 300)}`); fail++; }
}
console.log(`rebatir-clone (D-12 a, TF-0877) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
