#!/usr/bin/env node
/**
 * nettoyer-copies.mjs — les copies de travail et les branches du pilot qui ne servent plus,
 * relevées en essai par défaut, supprimées seulement sur `--supprimer` (D-97 (a) du 29/10/2026).
 *
 * LE FAIT. Le 29/10/2026, le pilot portait 14 copies de travail (8 sous `.claude/worktrees`, 2,1 Go,
 * et 6 sous `C:/tmp` laissées par des campagnes) et 15 branches déjà fusionnées sans copie. Ces
 * copies faussaient deux relevés : `relever-appelants.mjs` y voyait des appelants (911 contrôles et
 * 0 sans appelant, contre 102 et 2), et les 4 commandes prescrites introuvables du relevé
 * d'ouverture vivaient toutes dans des copies. Rien ne les retirait.
 *
 * CE QUI EST SUPPRIMABLE, et rien d'autre :
 *   · une copie de travail NON verrouillée (un agent vivant verrouille la sienne), dont la branche
 *     est déjà dans `main`, et qui ne porte aucune modification ni fichier non suivi : sa
 *     suppression ne perd rien que `main` n'ait déjà ;
 *   · une branche sans copie, déjà dans `main`, et nommée par un agent ou une campagne
 *     (`worktree-agent-*`, `campNNNN*`). Une branche de sauvegarde, de report ou de reconstruction
 *     se garde : son nom dit qu'elle a été voulue.
 * La suppression passe par `git worktree remove` sans `--force` et `git branch -d` : git refuse
 * lui-même une copie modifiée ou une branche non fusionnée, en second rempart.
 *
 * Usage : node scripts/nettoyer-copies.mjs [--racine <dépôt>] [--json] [--supprimer] [--self-test]
 * Exit 0 ; 1 si une suppression demandée a échoué ; 2 sur entrée illisible.
 */
import { existsSync, mkdtempSync, writeFileSync, rmSync, realpathSync, statSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const BRANCHE_JETABLE = /^(worktree-agent-|camp\d)/;
const norm = (p) => resolve(p).replaceAll("\\", "/").toLowerCase();

const git = (args, cwd) => spawnSync("git", args, { cwd, encoding: "utf8" });

/** Rend { copies: [...], branches: [...], supprimables: { copies, branches } } pour le dépôt `racine`. */
// Revue de code de l'œil critique du 29/10/2026 (D-97 (a) l'avait mis en service le même jour) :
// `git status --porcelain` ne voit pas les fichiers ignorés (`.env`, artefacts), que `git worktree
// remove` supprime pourtant avec le dossier ; et un agent vivant, non verrouillé, dont la branche
// vient de naître sur `main` paraît « fusionné et propre ». D'où `--ignored` et la garde de récence.
export const RECENCE_MIN = 120;
export function relever(racine, principale = "main", { recenceMin = RECENCE_MIN } = {}) {
  const fusionnee = (b) => git(["merge-base", "--is-ancestor", b, principale], racine).status === 0;
  const blocs = git(["worktree", "list", "--porcelain"], racine).stdout.split(/\r?\n\r?\n/).filter((b) => b.trim());
  const copies = blocs.map((b) => ({
    chemin: (/^worktree (.*)$/m.exec(b) || [])[1],
    branche: ((/^branch refs\/heads\/(.*)$/m.exec(b) || [])[1]) || null,
    verrou: /^locked/m.test(b),
  })).filter((c) => c.chemin && norm(c.chemin) !== norm(racine)).map((c) => {
    const present = existsSync(c.chemin);
    const propre = present && git(["status", "--porcelain", "--ignored"], c.chemin).stdout.trim() === "";
    const fus = c.branche ? fusionnee(c.branche) : false;
    const age = present ? (Date.now() - Math.max(statSync(c.chemin).mtimeMs, 1000 * Number(git(["log", "-1", "--format=%ct", c.branche || "HEAD"], racine).stdout.trim() || 0))) / 60000 : Infinity;
    const motif = !present ? "dossier absent" : c.verrou ? "verrouillée (agent vivant)" : !c.branche ? "tête détachée" : !fus ? "branche non fusionnée" : !propre ? "modifications, fichiers non suivis ou ignorés" : age < recenceMin ? `touchée il y a moins de ${recenceMin} minutes` : null;
    return { ...c, chemin_relatif: relative(racine, c.chemin).replaceAll("\\", "/"), fusionnee: fus, propre, supprimable: motif === null, motif };
  });
  const avecCopie = new Set(copies.map((c) => c.branche).filter(Boolean));
  const branches = git(["branch", "--format=%(refname:short)"], racine).stdout.split(/\r?\n/).filter((b) => b && b !== principale && !avecCopie.has(b)).map((b) => {
    const fus = fusionnee(b);
    const motif = !fus ? "branche non fusionnée" : !BRANCHE_JETABLE.test(b) ? "nom à garder (sauvegarde, report, reconstruction…)" : null;
    return { branche: b, fusionnee: fus, supprimable: motif === null, motif };
  });
  return { copies, branches, supprimables: { copies: copies.filter((c) => c.supprimable).length, branches: branches.filter((b) => b.supprimable).length } };
}

export function supprimer(racine, r) {
  const faits = [];
  for (const c of r.copies.filter((x) => x.supprimable)) {
    const w = git(["worktree", "remove", c.chemin], racine);
    const b = w.status === 0 ? git(["branch", "-d", c.branche], racine) : null;
    faits.push({ copie: c.chemin_relatif, branche: c.branche, worktree_remove: w.status, branch_d: b ? b.status : null, erreur: w.status ? w.stderr.trim().slice(0, 200) : b && b.status ? b.stderr.trim().slice(0, 200) : null });
  }
  for (const b of r.branches.filter((x) => x.supprimable)) {
    const d = git(["branch", "-d", b.branche], racine);
    faits.push({ branche: b.branche, branch_d: d.status, erreur: d.status ? d.stderr.trim().slice(0, 200) : null });
  }
  git(["worktree", "prune"], racine);
  return faits;
}

function selfTest() {
  const T = realpathSync(mkdtempSync(join(tmpdir(), "nettoyer-copies-")));
  const depot = join(T, "depot");
  const casse = [];
  const g = (...a) => { const r = git(a, depot); if (r.status) throw new Error(`git ${a.join(" ")} : ${r.stderr}`); return r; };
  try {
    spawnSync("git", ["init", "-q", "-b", "main", depot]);
    g("config", "user.email", "t@t"); g("config", "user.name", "t");
    writeFileSync(join(depot, "a.txt"), "a\n"); g("add", "a.txt"); g("commit", "-qm", "init");
    g("worktree", "add", "-q", "-b", "worktree-agent-fini", join(T, "fini"));
    g("worktree", "add", "-q", "-b", "worktree-agent-encours", join(T, "encours"));
    writeFileSync(join(T, "encours", "b.txt"), "b\n"); git(["add", "b.txt"], join(T, "encours")); git(["commit", "-qm", "travail"], join(T, "encours"));
    g("worktree", "add", "-q", "-b", "worktree-agent-vivant", join(T, "vivant")); g("worktree", "lock", join(T, "vivant"));
    g("worktree", "add", "-q", "-b", "worktree-agent-sale", join(T, "sale")); writeFileSync(join(T, "sale", "brouillon.txt"), "x\n");
    g("worktree", "add", "-q", "-b", "worktree-agent-secret", join(T, "secret"));
    writeFileSync(join(T, "secret", ".gitignore"), ".env\n"); git(["add", ".gitignore"], join(T, "secret")); git(["commit", "-qm", "ignore"], join(T, "secret"));
    g("merge", "-q", "worktree-agent-secret"); writeFileSync(join(T, "secret", ".env"), "SECRET=1\n");
    g("branch", "worktree-agent-orpheline"); g("branch", "sauvegarde-avant-x"); g("branch", "camp1013-q9");
    // Revue du 29/10 : par défaut, une copie touchée depuis moins de 2 heures est gardée (agent peut-être vivant).
    if (relever(depot).copies.find((c) => c.branche === "worktree-agent-fini").supprimable) casse.push("une copie touchée à l'instant est supprimable (agent peut-être vivant)");
    const r = relever(depot, "main", { recenceMin: 0 });
    const copie = (n) => r.copies.find((c) => c.branche === `worktree-agent-${n}`);
    if (!copie("fini") || !copie("fini").supprimable) casse.push("une copie fusionnée, propre et libre n'est pas supprimable");
    if (copie("encours").supprimable) casse.push("une copie à branche non fusionnée est supprimable");
    if (copie("vivant").supprimable || copie("vivant").motif !== "verrouillée (agent vivant)") casse.push("une copie verrouillée est supprimable");
    if (copie("sale").supprimable) casse.push("une copie avec un fichier non suivi est supprimable");
    if (copie("secret").supprimable) casse.push("une copie qui porte un fichier ignoré (.env) est supprimable : il serait perdu");
    const br = (n) => r.branches.find((b) => b.branche === n);
    if (!br("worktree-agent-orpheline").supprimable || !br("camp1013-q9").supprimable) casse.push("une branche d'agent ou de campagne fusionnée n'est pas supprimable");
    if (br("sauvegarde-avant-x").supprimable) casse.push("une branche de sauvegarde est supprimable");
    if (r.supprimables.copies !== 1 || r.supprimables.branches !== 2) casse.push(`1 copie et 2 branches supprimables attendues, ${JSON.stringify(r.supprimables)}`);
    const faits = supprimer(depot, r);
    if (faits.some((f) => f.erreur)) casse.push(`suppression en échec : ${JSON.stringify(faits)}`);
    const apres = relever(depot, "main", { recenceMin: 0 });
    if (apres.copies.some((c) => c.branche === "worktree-agent-fini") || existsSync(join(T, "fini"))) casse.push("la copie supprimée est toujours là");
    if (!existsSync(join(T, "vivant")) || !existsSync(join(T, "sale", "brouillon.txt")) || !existsSync(join(T, "encours")) || !existsSync(join(T, "secret", ".env"))) casse.push("une copie à garder a été touchée");
    if (apres.supprimables.copies !== 0 || apres.supprimables.branches !== 0) casse.push("des supprimables restent après la suppression");
  } catch (e) { casse.push(`erreur : ${e.message}`); }
  finally { git(["worktree", "unlock", join(T, "vivant")], depot); rmSync(T, { recursive: true, force: true }); }
  console.log(JSON.stringify({ outil: "nettoyer-copies", self_test: casse.length ? "FAIL" : "PASS", cas: 12, couverture: "double sens : 7 cas rouges, 5 cas verts", casse }));
  process.exit(casse.length ? 1 : 0);
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) selfTest();
  else {
    const i = args.indexOf("--racine");
    const racine = resolve(i >= 0 ? args[i + 1] : join(ICI, ".."));
    if (!existsSync(join(racine, ".git"))) { console.error(`dépôt illisible : ${racine}`); process.exit(2); }
    const r = relever(racine);
    const faits = args.includes("--supprimer") ? supprimer(racine, r) : null;
    if (args.includes("--json")) { console.log(JSON.stringify({ outil: "nettoyer-copies", mode: faits ? "suppression" : "essai", ...r, faits }, null, 1)); }
    else {
      console.log(`nettoyer-copies — ${faits ? "suppression" : "essai"} : ${r.copies.length} copie(s), ${r.supprimables.copies} supprimable(s) ; ${r.branches.length} branche(s) sans copie, ${r.supprimables.branches} supprimable(s)`);
      for (const c of r.copies) console.log(`  ${c.supprimable ? "×" : "="} copie ${c.chemin_relatif} (${c.branche || "détachée"})${c.motif ? ` — gardée : ${c.motif}` : ""}`);
      for (const b of r.branches) console.log(`  ${b.supprimable ? "×" : "="} branche ${b.branche}${b.motif ? ` — gardée : ${b.motif}` : ""}`);
      if (faits) for (const f of faits) console.log(`  ${f.erreur ? "ÉCHEC" : "fait"} ${f.copie || f.branche}${f.erreur ? ` : ${f.erreur}` : ""}`);
    }
    process.exit(faits && faits.some((f) => f.erreur) ? 1 : 0);
  }
}
