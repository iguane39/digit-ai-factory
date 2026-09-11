#!/usr/bin/env node
// rebatir-clone.mjs — REBÂTIT un clone local sur l'histoire PUBLIÉE quand celle-ci a été réécrite,
// sans perdre le travail propre au poste. Décision D-12 (a) du 07/09/2026 ; candidature TF-0877.
//
// LE FAIT. Depuis le 03/09, l'histoire publiée de presque tous les dépôts du parc a été réécrite au
// moins une fois (pseudonymisation par git filter-repo, mode opératoire TF-0752). Chaque réécriture
// rend le clone de l'AUTRE poste « DIVERGÉ » au bootstrap suivant : le pull en avance rapide refuse,
// et le mode opératoire dit « toute autre copie locale … à recloner, pas à fusionner ». Le 07/09 au
// matin, dix forges ont été rebâties à la main dans un sens ; le soir, deux forges de plus l'ont été
// dans l'autre. La méthode qui a tenu (mesurer le delta propre au poste, sauvegarder en paquet,
// réaligner, rejouer, juger par la porte avant tout push) vivait en mémoire d'un poste : ce script
// la rend répétable et identique sur les deux postes.
//
// Ce qu'il fait, dans cet ordre, et rien d'autre :
//   0. refuse un arbre sale (commit ou stash d'abord) et un dépôt sans `origin` ;
//   1. `git fetch origin --tags --force --prune --prune-tags` ;
//   2. mesure : avance (origin/main..HEAD) et retard (HEAD..origin/main). Retard nul = rien à rebâtir
//      (à jour, ou en avance simple : `git push` suffit) ;
//   3. arborescences de travail LIÉES (`git worktree list`) : leur enregistrement est retiré — la porte
//      de publication lit `git log --all`, qui les compte (forge-tests, 07/09 : 262 commits vus pour
//      183). Les fichiers du dossier lié ne sont jamais touchés ;
//   4. SAUVEGARDE entière : `git bundle create <sauvegardes>/<dépôt>-<horodatage>.bundle --all`,
//      vérifiée par `git bundle verify`, HEAD d'avant consigné à côté ;
//   5. le delta propre au poste (origin/main..HEAD) est exporté en patches (`git format-patch`) dans
//      le même dossier de sauvegarde ;
//   6. `git reset --hard origin/main`, suivi de branche rétabli ;
//   7. rejeu des patches par `git am --3way`, dans l'ordre ; un rejeu qui échoue est abandonné
//      (`git am --abort`), nommé au rapport, et le script s'arrête en exit 1 — le patch reste sur
//      disque, la décision est humaine ;
//   8. la porte de publication (`oracle-nom-client-publie`) est jouée sur le clone rebâti, les deux
//      tables étant désignées depuis la racine du parc ; son verdict est rapporté. JAMAIS de push :
//      la publication est une décision humaine (R-38).
// `--essai` mesure et annonce (pas 0 à 2, plus la liste de ce qui serait fait) sans rien écrire.
//
// Usage : node scripts/rebatir-clone.mjs <chemin-dépôt> [--sauvegardes <dossier>] [--essai] [--json-only]
//   --sauvegardes  dossier des paquets (défaut : <racine du parc>/_sauvegardes)
// Contrat de sortie : JSON {outil, depot, avant, apres, sauvegarde, patches, rejeu, worktrees_retires,
// porte, message} · exit 0 = rebâti (ou rien à rebâtir) · 1 = rejeu d'un patch échoué · 2 = refus.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cheminsTables } from "./lib-confidentiel.mjs";
import { cheminSkillsInstalles } from "./lib-config-installee.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const depotArg = args.find((a) => !a.startsWith("--"));
const ESSAI = args.includes("--essai");
const jsonOnly = args.includes("--json-only");
const iS = args.indexOf("--sauvegardes");

const R = { outil: "rebatir-clone", depot: depotArg ? resolve(depotArg) : null, essai: ESSAI, avant: null, apres: null,
  sauvegarde: null, patches: [], rejeu: [], worktrees_retires: [], porte: null, message: "" };
const sortir = (code, message) => { R.message = message; process.stdout.write(JSON.stringify(R, null, jsonOnly ? 0 : 2) + "\n"); process.exit(code); };

if (!depotArg) sortir(2, "usage : node scripts/rebatir-clone.mjs <chemin-dépôt> [--sauvegardes <dossier>] [--essai] [--json-only]");
const depot = R.depot;
// core.longpaths : ce script n'appelle aucun `git clone` (il RÉALIGNE un clone existant), mais
// `reset --hard` et `am --3way` réécrivent l'arbre de travail — sous MAX_PATH = 260, un chemin
// long y échoue exactement comme au checkout d'un clone frais (TF-1015, 10/09/2026 : 22 fichiers
// refusés, dépôt sans arbre de travail). L'option est donc portée par TOUS les appels git d'ici.
const git = (...a) => spawnSync("git", ["-c", "core.longpaths=true", ...a], { cwd: depot, encoding: "utf8" });
const ok = (r) => r.status === 0;
if (!existsSync(join(depot, ".git"))) sortir(2, `${depot} n'est pas un dépôt git`);
if (!ok(git("remote", "get-url", "origin"))) sortir(2, "aucun remote `origin` — rien à rebâtir dessus");

// 0 · arbre propre
const sale = (git("status", "--porcelain").stdout || "").split("\n").filter((l) => l && !l.startsWith("??"));
if (sale.length) sortir(2, `arbre de travail sale (${sale.length} fichier(s) modifié(s) ou indexé(s)) — commit ou stash d'abord, jamais un reset sur du travail non consigné`);

// 1 · fetch — mais d'abord retenir ce que le poste CONNAISSAIT du distant : le delta propre au poste,
// c'est ce qu'il a commité par-dessus cet ancien origin/main. Après une réécriture, « origin/main..HEAD »
// contiendrait aussi tous les anciens commits réécrits (autres hachages, même travail) et les rejouer
// ferait conflit sur du travail déjà publié : c'est le piège qui a fait échouer la première recette.
const ancienOrigin = (git("rev-parse", "--verify", "-q", "origin/main").stdout || "").trim() || null;
// En ESSAI, origin/main n'est pas déplacé : le distant est lu dans une référence temporaire, sinon
// l'essai consommerait la connaissance de l'ancien distant et le vrai passage rejouerait les commits
// réécrits (première recette, 07/09). Le vrai passage fetche normalement, étiquettes comprises.
const DISTANT = ESSAI ? "refs/rebatir/distant" : "origin/main";
const f = ESSAI ? git("fetch", "origin", "+refs/heads/main:refs/rebatir/distant") : git("fetch", "origin", "--tags", "--force", "--prune", "--prune-tags");
if (!ok(f)) sortir(2, `git fetch a échoué : ${(f.stderr || "").trim().slice(0, 200)}`);
const finirEssai = () => { git("update-ref", "-d", "refs/rebatir/distant"); };

// 2 · mesure
const compte = (plage) => Number.parseInt((git("rev-list", "--count", plage).stdout || "0").trim(), 10) || 0;
const head = () => (git("rev-parse", "--short", "HEAD").stdout || "").trim();
R.avant = { head: head(), avance: compte(`${DISTANT}..HEAD`), retard: compte(`HEAD..${DISTANT}`), ancien_origin: ancienOrigin ? ancienOrigin.slice(0, 7) : null };
// Le delta PROPRE au poste : ce qu'il a commité par-dessus l'ancien origin/main (s'il est encore
// ancêtre de HEAD — le cas normal : tiré, puis commité), ET dont le contenu est absent du distant
// (`git cherry` : un commit réécrit avec le même diff porte le même identifiant de patch et n'est pas
// rejoué ; un commit réécrit avec un autre diff est un vrai delta, jugé au rejeu).
const plageDelta = ancienOrigin && ok(git("merge-base", "--is-ancestor", ancienOrigin, "HEAD")) ? `${ancienOrigin}..HEAD` : `${DISTANT}..HEAD`;
const absentsDuDistant = new Set((git("cherry", DISTANT, "HEAD").stdout || "").split("\n").filter((l) => l.startsWith("+ ")).map((l) => l.slice(2).trim()));
// PREMIER USAGE RÉEL (forge-development, 07/09 21:32) : un `git fetch` fait à la main AVANT l'outil
// avait déjà déplacé origin/main — l'ancien distant n'était plus connu, la plage est retombée sur
// `origin/main..HEAD`, et un commit réécrit dont le CONTENU avait changé (pseudonymisation d'un
// fichier) portait un autre identifiant de patch : pris pour propre au poste, rejoué, conflit.
// Second filtre, par le SUJET : un commit dont le sujet existe déjà dans l'histoire du distant est
// un commit publié sous une autre empreinte, jamais un delta — la réécriture conserve les sujets.
const sujetsDistants = new Set((git("log", "--format=%s", DISTANT).stdout || "").split("\n").map((s) => s.trim()).filter(Boolean));
const sujetDe = (c) => (git("log", "-1", "--format=%s", c).stdout || "").trim();
const commitsDelta = (git("rev-list", "--reverse", plageDelta).stdout || "").split("\n").map((s) => s.trim())
  .filter((s) => s && absentsDuDistant.has(s) && !sujetsDistants.has(sujetDe(s)));
R.avant.delta_propre = commitsDelta.length;
if (R.avant.retard === 0) { if (ESSAI) finirEssai(); sortir(0, R.avant.avance === 0 ? "à jour de origin/main — rien à rebâtir" : `en avance simple de ${R.avant.avance} commit(s), origin/main est un ancêtre — rien à rebâtir, un push ordinaire suffit (sur GO humain)`); }

// 3 · arborescences liées
const wt = (git("worktree", "list", "--porcelain").stdout || "").split(/\n\n+/).map((b) => b.trim()).filter(Boolean)
  .map((b) => Object.fromEntries(b.split("\n").map((l) => { const i = l.indexOf(" "); return i < 0 ? [l, true] : [l.slice(0, i), l.slice(i + 1)]; })))
  .filter((w) => w.worktree && resolve(w.worktree) !== resolve(depot));
for (const w of wt) R.worktrees_retires.push({ chemin: w.worktree, head: String(w.HEAD || "").slice(0, 7), detachee: "detached" in w });
if (wt.length && !ESSAI) {
  // L'enregistrement vit sous .git/worktrees/<nom>/gitdir, qui pointe vers le dossier lié. On retire
  // l'enregistrement, jamais le dossier : supprimer un répertoire est un geste humain.
  const meta = join(depot, ".git", "worktrees");
  const cibles = new Set(wt.map((w) => resolve(w.worktree).toLowerCase()));
  if (existsSync(meta)) for (const d of readdirSync(meta)) {
    try {
      const gitdir = readFileSync(join(meta, d, "gitdir"), "utf8").trim().replace(/[\\/]\.git$/, "");
      if (cibles.has(resolve(gitdir).toLowerCase())) rmSync(join(meta, d), { recursive: true, force: true });
    } catch { /* un enregistrement illisible est laissé à `git worktree prune` */ }
  }
  git("worktree", "prune");
}

// 4 · sauvegarde
const racineParc = process.env.FORGE_ROOT ? resolve(process.env.FORGE_ROOT) : dirname(depot);
const dossierSauv = resolve(iS >= 0 ? args[iS + 1] : join(racineParc, "_sauvegardes"));
const horodatage = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "-");
const base = `${basename(depot)}-${horodatage}`;
const paquet = join(dossierSauv, `${base}.bundle`);
const dossierPatches = join(dossierSauv, `${base}-patches`);
R.sauvegarde = { paquet, head_avant: R.avant.head, verifie: null };
if (ESSAI) {
  R.patches = commitsDelta.map((c) => ({ commit: c.slice(0, 7), sujet: (git("log", "-1", "--format=%s", c).stdout || "").trim().slice(0, 80) }));
  finirEssai();
  sortir(0, `ESSAI — rien n'a été écrit. Ferait : ${R.worktrees_retires.length} arborescence(s) liée(s) retirée(s), paquet ${paquet}, ${R.patches.length} patch(es) rejoué(s) après reset sur origin/main, porte jouée`);
}
mkdirSync(dossierSauv, { recursive: true });
const b = git("bundle", "create", paquet, "--all");
if (!ok(b)) sortir(2, `git bundle create a échoué : ${(b.stderr || "").trim().slice(0, 200)}`);
R.sauvegarde.verifie = ok(git("bundle", "verify", paquet));
if (!R.sauvegarde.verifie) sortir(2, "paquet de sauvegarde non vérifiable — rien n'est rebâti sans sauvegarde prouvée");
writeFileSync(join(dossierSauv, `${base}.HEAD.txt`), `${basename(depot)} HEAD avant reconstruction : ${(git("rev-parse", "HEAD").stdout || "").trim()}\norigin/main : ${(git("rev-parse", "origin/main").stdout || "").trim()}\n`);

// 5 · delta propre au poste
mkdirSync(dossierPatches, { recursive: true });
commitsDelta.forEach((c, i) => {
  const fp = git("format-patch", "-1", c, "--start-number", String(i + 1), "-o", dossierPatches);
  if (!ok(fp)) sortir(2, `git format-patch a échoué sur ${c.slice(0, 7)} : ${(fp.stderr || "").trim().slice(0, 200)}`);
  R.patches.push({ commit: c.slice(0, 7), fichier: (fp.stdout || "").trim().split("\n").pop() });
});

// 6 · réalignement
if (!ok(git("reset", "--hard", "origin/main"))) sortir(2, "git reset --hard origin/main a échoué");
git("branch", "--set-upstream-to=origin/main");

// 7 · rejeu
for (const p of R.patches) {
  const am = git("am", "--3way", p.fichier);
  if (ok(am)) { p.rejoue = head(); R.rejeu.push({ patch: basename(p.fichier), statut: "rejoue", commit: p.rejoue }); continue; }
  git("am", "--abort");
  R.rejeu.push({ patch: basename(p.fichier), statut: "echoue", detail: (am.stdout + am.stderr).trim().slice(0, 300) });
  R.apres = { head: head(), avance: compte("origin/main..HEAD"), retard: compte("HEAD..origin/main") };
  sortir(1, `rejeu du patch ${basename(p.fichier)} en conflit — abandonné, le patch reste dans ${dossierPatches} ; le clone est sur origin/main plus ${R.apres.avance} patch(es) rejoué(s) ; la suite est une décision humaine`);
}
R.apres = { head: head(), avance: compte("origin/main..HEAD"), retard: compte("HEAD..origin/main") };

// 8 · porte de publication (jamais de push)
const pistesOracle = [
  join(cheminSkillsInstalles(), "quality-oracles", "scripts", "oracle-nom-client-publie.mjs"),
  join(racineParc, "digit-ai-forge-agents", ".claude", "skills", "quality-oracles", "scripts", "oracle-nom-client-publie.mjs"),
];
const oracle = pistesOracle.find((p) => existsSync(p));
if (!oracle) R.porte = { verdict: "SKIP", motif: "oracle-nom-client-publie introuvable — la porte se joue à la main avant tout push" };
else {
  const env = { ...process.env };
  const { clients: noms, produits: prod } = cheminsTables(racineParc); // canal confidentiel (D-28 a), env, ou ancien fichier libre
  if (existsSync(noms) && !env.FORGE_NOMS_INTERDITS) env.FORGE_NOMS_INTERDITS = noms;
  if (existsSync(prod) && !env.FORGE_PRODUITS_PSEUDO) env.FORGE_PRODUITS_PSEUDO = prod;
  const o = spawnSync(process.execPath, [oracle, depot], { encoding: "utf8", env, maxBuffer: 1 << 26 });
  let verdict = "ILLISIBLE", constats = 0;
  try { const j = JSON.parse(o.stdout); verdict = j.verdict; constats = (j.findings || []).filter((x) => x.regle && /^C\d/.test(x.regle) && x.sev !== "info").length; } catch { /* verdict illisible, dit tel quel */ }
  R.porte = { verdict, constats, oracle };
}
sortir(0, `clone rebâti sur origin/main (${R.avant.head} → ${R.apres.head}) : ${R.rejeu.length} patch(es) rejoué(s), ${R.worktrees_retires.length} arborescence(s) liée(s) retirée(s), paquet ${basename(paquet)} vérifié ; porte ${R.porte.verdict} — la publication reste un GO humain`);
