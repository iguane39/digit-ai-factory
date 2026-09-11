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
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
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
  // TF-0879 (08/09) — CE CAS A ÉCHOUÉ SUR UN POSTE ET PASSÉ SUR L'AUTRE, et son message ne disait
  // ni QUELLE assertion ni QUELLES valeurs : « Expected values to be strictly equal », rien de
  // plus. Une recette qui ne dit pas par quoi elle a jugé oblige à rejouer le scénario à la main
  // pour apprendre ce qu'elle savait déjà. Chaque assertion porte donc son intitulé ET ses deux
  // valeurs. La dépendance au poste, elle, est bornée en amont : `lancer()` force
  // `FORGE_SKILLS_INSTALLES` sur un dossier inexistant du parc temporaire, si bien que la porte
  // rend SKIP sur TOUT poste, qu'un oracle y soit installé ou non.
  assert.equal(r.code, 0, `exit ${r.code} attendu 0 — sortie brute : ${r.brut}`);
  assert.equal(r.j.sauvegarde.verifie, true, `paquet vérifié : mesuré ${JSON.stringify(r.j.sauvegarde)}`);
  assert.ok(existsSync(r.j.sauvegarde.paquet), `le paquet annoncé n'existe pas sur le disque : ${r.j.sauvegarde.paquet}`);
  assert.equal(r.j.rejeu.length, 1, `un seul patch propre au poste doit être rejoué — mesuré ${r.j.rejeu.length} : ${JSON.stringify(r.j.rejeu)}`);
  assert.equal(r.j.rejeu[0].statut, "rejoue", `statut du rejeu « ${r.j.rejeu[0].statut} », « rejoue » attendu : ${JSON.stringify(r.j.rejeu[0])}`);
  assert.equal(r.j.worktrees_retires.length, 1, `une arborescence liée doit être retirée — mesuré ${r.j.worktrees_retires.length} : ${JSON.stringify(r.j.worktrees_retires)}`);
  assert.equal(r.j.apres.avance, 1, `avance après rebâti : mesurée ${r.j.apres.avance}, 1 attendue (le seul commit propre au poste) — ${JSON.stringify(r.j.apres)}`);
  assert.equal(r.j.apres.retard, 0, `réaligné sur la nouvelle histoire : retard mesuré ${r.j.apres.retard}, 0 attendu — ${JSON.stringify(r.j.apres)}`);
  assert.ok(existsSync(join(poste, "local.txt")), "le travail propre au poste est rejoué");
  assert.match(g(poste, "log", "-1", "--format=%s", "HEAD~1"), /second commit/);
  assert.match(g(poste, "log", "--format=%s", "--all"), /Client-A/); assert.doesNotMatch(g(poste, "log", "--format=%s", "--all"), /NomClient/, "l'ancienne histoire n'est plus atteignable");
  assert.equal(g(poste, "worktree", "list").split("\n").length, 1,
    `arborescence liée retirée — « git worktree list » rend encore :\n${g(poste, "worktree", "list")}`);
  assert.ok(existsSync(lie), `les fichiers de l'arborescence liée sont laissés en place : ${lie}`);
  // CE QUE CE CAS EXIGE DU POSTE, et il l'IMPOSE au lieu de l'espérer (TF-0879) : aucun
  // `oracle-nom-client-publie` atteignable. `lancer()` pointe `FORGE_SKILLS_INSTALLES` sur un
  // dossier inexistant, et la seconde piste vit sous le parc TEMPORAIRE — donc SKIP partout.
  assert.equal(r.j.porte.verdict, "SKIP",
    `la porte doit se déclarer SKIP quand aucun oracle n'est atteignable — mesuré « ${r.j.porte.verdict} » : ${JSON.stringify(r.j.porte)}. `
    + "Un poste qui rendrait autre chose a un oracle atteignable malgré FORGE_SKILLS_INSTALLES : c'est CELA qu'il faut corriger, pas l'assertion");
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

test("fetch fait AVANT l'outil + commit réécrit dont le contenu change → seul le commit propre au poste est rejoué (filtre par sujet)", () => {
  // Le cas réel du 07/09 21:32 (forge-development) : l'ancien distant n'est plus connu, et un
  // commit publié réécrit avec un autre contenu porte un autre identifiant de patch.
  const { base, auteur, poste } = parc();
  writeFileSync(join(poste, "local.txt"), "travail du poste\n"); g(poste, "add", "."); g(poste, "commit", "-q", "-m", "travail propre au poste");
  writeFileSync(join(auteur, "b.txt"), "deux, contenu pseudonymisé\n"); g(auteur, "add", "."); g(auteur, "commit", "-q", "--amend", "--no-edit"); g(auteur, "push", "-q", "--force", "origin", "main");
  g(poste, "fetch", "-q", "origin"); // la connaissance de l'ancien distant est perdue
  const r = lancer(poste, "--sauvegardes", join(base, "sauv"));
  assert.equal(r.code, 0, r.brut);
  assert.ok(g(poste, "rev-parse", "origin/main").startsWith(r.j.avant.ancien_origin), "l'ancien distant connu est déjà le nouveau (fetch fait avant)");
  assert.equal(r.j.rejeu.length, 1, `un seul rejeu attendu — mesuré : ${JSON.stringify(r.j.rejeu)}`);
  assert.equal(r.j.rejeu[0].statut, "rejoue");
  assert.ok(existsSync(join(poste, "local.txt")));
  assert.match(g(poste, "show", "HEAD~1:b.txt"), /pseudonymisé/, "le contenu réécrit du distant est conservé, pas écrasé par l'ancien");
  rmSync(base, { recursive: true, force: true });
});

test("TF-1015 — tout appel git du script porte `-c core.longpaths=true` (l'arbre de travail se réécrit ici aussi)", () => {
  const source = readFileSync(SCRIPT, "utf8");
  const helper = source.split("\n").find((l) => /^const git = /.test(l));
  assert.ok(helper, "l'aide `git` du script n'est plus reconnaissable — l'assertion ne prouve plus rien");
  assert.match(helper, /"-c",\s*"core\.longpaths=true"/,
    "sans core.longpaths, `reset --hard` et `am --3way` échouent sur un chemin long comme le checkout du 10/09 (22 fichiers refusés)");
  assert.equal((source.match(/git\(\s*["']clone["']/g) || []).length, 0,
    "un `git clone` est apparu dans le script : vérifier qu'il porte lui aussi -c core.longpaths=true (TF-1015)");
});

let pass = 0, fail = 0;
for (const [nom, fn] of CAS) {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${String(e.message || e).split("\n")[0].slice(0, 300)}`); fail++; }
}
console.log(`rebatir-clone (D-12 a, TF-0877) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
