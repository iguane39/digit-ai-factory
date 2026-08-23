#!/usr/bin/env node
// bootstrap.mjs — amorce ou met à jour un poste pour l'écosystème forge Digit-AI.
//
// v2 (20/08/2026, revue « dernières versions ») — « Poste prêt » veut désormais dire, et
// prouve par exécution : le pilot ET les treize forges sont présents, chacun À JOUR de son
// origin (mesuré : retard/avance en commits, version affichée), et les skills installés sont
// ceux que les forges versionnent. Avant : « mis à jour » signifiait « pull sans erreur »,
// « déjà présent » valait « prêt » à 50 commits de retard, le pilot n'était pas mis à jour,
// les skills jamais installés ni propagés (K1 rouge sur poste vierge, K2 rouge après chaque
// pull), un dépôt renommé se dupliquait, et gh bloquait des forges devenues publiques.
//
// Usage :  node bootstrap.mjs [--racine <dossier>] [--pull] [--sans-skills] [--sans-pilot]
//   --racine      racine d'installation (défaut : $FORGE_ROOT, sinon le parent de ce dépôt)
//   --pull        met à jour (git pull --ff-only) le pilot puis les forges présentes, et
//                 propage les skills versionnés vers la copie installée (oracle-skills
//                 --appliquer) — lancer --pull EST la décision humaine de propagation (R-29)
//   --sans-skills ne juge ni ne propage les skills (recette sur dépôts factices)
//   --sans-pilot  ne touche pas au dépôt pilot courant (recette)
// Env :  BOOTSTRAP_SOURCE        base des dépôts (défaut https://github.com/iguane39)
//        FORGE_SKILLS_INSTALLES  dossier des skills installés (défaut ~/.claude/skills)
//
// Sans --pull, le poste est seulement MESURÉ : un dépôt en retard est un DÉFAUT dont le
// remède est nommé (--pull). Un skill installé en écart est un DÉFAUT dont le remède est
// nommé (--pull). Rien n'est « prêt » par omission.
// Prérequis bloquants : git, node >= 18. gh n'est plus requis (forges publiques depuis le
// 10/08 ; gh reste utile aux dépôts d'engagement privés, hors bootstrap).
// Contrat de sortie : rapport sur stdout, exit 0 = poste prêt, 1 = au moins un défaut.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const MOI = fileURLToPath(import.meta.url);
const SOURCE = (process.env.BOOTSTRAP_SOURCE || "https://github.com/iguane39").replace(/\/+$/, "");
const FORGES = [
  { nom: "digit-ai-forge-conception", preuve: "oracles/self-test.mjs" },
  { nom: "digit-ai-forge-design", preuve: "oracles/run-oracles-design.mjs" },
  { nom: "digit-ai-forge-development", preuve: "digit-ai-forge-development/pyproject.toml" },
  { nom: "digit-ai-forge-tests", preuve: "forge_tests/__main__.py" },
  { nom: "digit-ai-forge-agents", preuve: ".claude/skills/forge-agents/SKILL.md" },
  // forge-seo-geo : ex forge-seo, renommée le 20/08 (TF-0390) — le volet GEO entre au nom.
  { nom: "digit-ai-forge-seo-geo", preuve: "scripts/validate.py", alias: ["digit-ai-forge-seo"] },
  { nom: "digit-ai-forge-organization", preuve: "output/02-composants/composant-filtres-tableau/oracle-filtres-tableau.mjs" },
  // forge-audit : le PRODUIT AuditCore (public, marque blanche — ex `digit-ai-forge-auditcore`,
  // renommé le 11/08). L'espace d'engagement client (`digit-ai-forge-audit_client-a`, privé) est hors bootstrap.
  { nom: "digit-ai-forge-audit", preuve: "core/invariants.json", alias: ["digit-ai-forge-auditcore"] },
  // forge-ops : exploitation — outille l'étape MEP du pilot (TF-0040).
  { nom: "digit-ai-forge-ops", preuve: "oracles/self-test.mjs" },
  // forge-data : discipline de la donnée (TF-0083).
  { nom: "digit-ai-forge-data", preuve: "oracles/self-test.mjs" },
  // forge-agents-security : sécurité agentique (TF-0111) — le juge ne vit pas chez le jugé.
  { nom: "digit-ai-forge-agents-security", preuve: "oracles/self-test.mjs" },
  // forge-observability : observabilité continue entre les runs (TF-0112).
  { nom: "digit-ai-forge-observability", preuve: "oracles/self-test.mjs" },
  // forge-websec : sécurité du produit web livré (TF-0123).
  { nom: "digit-ai-forge-websec", preuve: "oracles/self-test.mjs" },
];

const args = process.argv.slice(2);
const pull = args.includes("--pull");
const sansSkills = args.includes("--sans-skills");
const sansPilot = args.includes("--sans-pilot");
const iRacine = args.indexOf("--racine");
const racine = resolve(iRacine >= 0 ? args[iRacine + 1] : process.env.FORGE_ROOT || dirname(ICI));
const SKILLS_INSTALLES = process.env.FORGE_SKILLS_INSTALLES || join(homedir(), ".claude", "skills");

const run = (cmd, argv, cwd) => {
  const r = spawnSync(cmd, argv, { cwd, encoding: "utf-8", windowsHide: true });
  if (r.error) return { status: 127, stdout: "", stderr: String(r.error.message || r.error) };
  return { status: r.status ?? 1, stdout: r.stdout || "", stderr: r.stderr || "" };
};
const git = (cwd, ...argv) => run("git", argv, cwd);
const sortie = (r) => (r.stdout || "").trim();

const defauts = [];
const averts = [];
const versions = [];
const ligne = (statut, msg) => console.log(`[${statut}] ${msg}`);
const defaut = (msg, remede) => { ligne("DEFAUT", `${msg} — remède : ${remede}`); defauts.push(msg); };

console.log(`Amorçage forge — racine : ${racine}\n`);

// 1. Prérequis ------------------------------------------------------------------------------
{
  const majeur = Number(process.versions.node.split(".")[0]);
  if (majeur >= 18) ligne("ok", `node ${process.versions.node}`);
  else defaut(`node ${process.versions.node} trop ancien`, "installer node >= 18");
  const g = run("git", ["--version"]);
  if (g.status === 0) ligne("ok", sortie(g));
  else defaut("git indisponible", "installer git et le mettre dans le PATH");
  for (const [cmd, argv, note] of [
    ["gh", ["auth", "status"], "requis seulement pour les dépôts d'engagement privés"],
    ["uv", ["--version"], "requis plus tard pour l'étape tests"],
    ["python", ["--version"], "requis plus tard pour l'étape tests"],
  ]) {
    const r = run(cmd, argv);
    if (r.status === 0) ligne("ok", `${cmd} disponible`);
    else { ligne("avert", `${cmd} indisponible (${note})`); averts.push(cmd); }
  }
  if (defauts.length) { console.log(`\nPoste NON prêt — ${defauts.length} défaut(s).`); process.exit(1); }
}

// 2. État d'un dépôt : version, retard/avance sur origin, propreté ---------------------------
function etatDepot(dest) {
  const e = { fetch: false, branche: "", version: "", sha: "", date: "", retard: null, avance: null, propre: true };
  e.branche = sortie(git(dest, "rev-parse", "--abbrev-ref", "HEAD")) || "HEAD";
  e.sha = sortie(git(dest, "rev-parse", "--short", "HEAD"));
  e.version = sortie(git(dest, "describe", "--tags", "--always")) || e.sha;
  e.date = sortie(git(dest, "log", "-1", "--format=%cs"));
  e.propre = sortie(git(dest, "status", "--porcelain")) === "";
  const f = git(dest, "fetch", "--quiet", "origin");
  e.fetch = f.status === 0;
  if (e.fetch && git(dest, "rev-parse", "--verify", "--quiet", `origin/${e.branche}`).status === 0) {
    e.retard = Number(sortie(git(dest, "rev-list", "--count", `HEAD..origin/${e.branche}`)));
    e.avance = Number(sortie(git(dest, "rev-list", "--count", `origin/${e.branche}..HEAD`)));
  }
  return e;
}
const decrire = (e) => {
  if (!e.fetch) return "origin injoignable (hors ligne ?) — fraîcheur NON vérifiée";
  if (e.retard === null) return `branche ${e.branche} sans amont origin — fraîcheur non mesurable`;
  if (e.retard === 0 && e.avance === 0) return "à jour";
  if (e.retard > 0 && e.avance > 0) return `DIVERGÉ (${e.avance} devant, ${e.retard} derrière)`;
  if (e.retard > 0) return `en retard de ${e.retard} commit(s)`;
  return `en avance de ${e.avance} commit(s) (travail local non poussé)`;
};

// Juge un dépôt présent : le met à jour si --pull, sinon le mesure. Enregistre sa version.
function traiterPresent(nom, dest) {
  let e = etatDepot(dest);
  if (pull && e.fetch && e.retard > 0 && e.avance === 0) {
    const p = git(dest, "pull", "--ff-only", "--quiet");
    if (p.status === 0) { e = etatDepot(dest); ligne("ok", `${nom} — mis à jour (${e.version}, ${decrire(e)})`); }
    else defaut(`${nom} — pull impossible : ${(p.stderr || "").trim().split("\n")[0].slice(0, 120)}`,
      "git status dans le dépôt, résoudre (stash/commit), relancer --pull");
  } else if (e.fetch && e.retard > 0 && e.avance > 0) {
    defaut(`${nom} — ${decrire(e)}`, "rebase ou merge à la main dans le dépôt (ff-only refusé par construction)");
  } else if (e.fetch && e.retard > 0) {
    defaut(`${nom} — ${decrire(e)} (${e.version})`, "node bootstrap.mjs --pull");
  } else {
    const s = e.fetch ? "ok" : "avert";
    ligne(s, `${nom} — présent, ${decrire(e)} (${e.version})`);
    if (!e.fetch) averts.push(`${nom} hors ligne`);
  }
  if (!e.propre) ligne("avert", `${nom} — modifications locales non committées (le pull --ff-only les tolère tant qu'elles ne touchent pas les fichiers mis à jour)`);
  versions.push({ nom, version: e.version, sha: e.sha, date: e.date, etat: decrire(e) });
  return e;
}

// 3. Le pilot lui-même : mis à jour AVANT les forges (sa liste de forges peut avoir changé) --
console.log("");
if (!sansPilot) {
  const empreinteAvant = createHash("sha256").update(readFileSync(MOI)).digest("hex");
  if (existsSync(join(ICI, ".git"))) traiterPresent("digit-ai-factory (pilot)", ICI);
  else ligne("avert", "digit-ai-factory (pilot) — pas un dépôt git : fraîcheur du pilot non vérifiable");
  const empreinteApres = createHash("sha256").update(readFileSync(MOI)).digest("hex");
  if (empreinteAvant !== empreinteApres && !process.env.BOOTSTRAP_RELANCE) {
    // Ce script vient d'être mis à jour par son propre pull : le reste doit s'exécuter avec la
    // version neuve (liste de forges, règles), pas avec celle chargée en mémoire.
    console.log("\n[relance] bootstrap.mjs a changé pendant la mise à jour du pilot — relance avec la version neuve.\n");
    const r = spawnSync(process.execPath, [MOI, ...args], { stdio: "inherit", env: { ...process.env, BOOTSTRAP_RELANCE: "1" } });
    process.exit(r.status ?? 1);
  }
}

// 4. Les forges : renommage hérité, clone, mesure ou mise à jour ----------------------------
console.log("");
for (const f of FORGES) {
  const dest = join(racine, f.nom);
  // Renommage hérité (ex : digit-ai-forge-seo → -seo-geo) : un dossier à l'ancien nom dont
  // l'origin est bien CE dépôt est renommé sur place et pointé sur le nouveau nom — jamais
  // dupliqué, jamais laissé orphelin.
  if (!existsSync(join(dest, ".git"))) {
    for (const ancien of f.alias || []) {
      const vieux = join(racine, ancien);
      if (!existsSync(join(vieux, ".git"))) continue;
      const url = sortie(git(vieux, "remote", "get-url", "origin"));
      // Séparateur `/` OU `\` : une origin locale sous Windows s'écrit avec des antislashs.
      if (!new RegExp(`[\\\\/](${ancien}|${f.nom})(\\.git)?$`).test(url)) continue;
      try {
        renameSync(vieux, dest);
        git(dest, "remote", "set-url", "origin", `${SOURCE}/${f.nom}.git`);
        ligne("ok", `${f.nom} — dossier hérité « ${ancien} » renommé et pointé sur ${f.nom} (aucun doublon)`);
      } catch (e) {
        defaut(`${f.nom} — dossier hérité « ${ancien} » non renommable : ${e.code || e.message}`,
          `fermer ce qui tient le dossier, puis : ren ${ancien} ${f.nom} · git remote set-url origin ${SOURCE}/${f.nom}.git`);
      }
      break;
    }
  }
  if (existsSync(join(dest, ".git"))) {
    traiterPresent(f.nom, dest);
  } else if (existsSync(dest)) {
    defaut(`${f.nom} — le dossier existe SANS dépôt git`, "le déplacer ou le supprimer, puis relancer");
  } else {
    // core.longpaths : les forges portent des noms de fichiers longs (convention
    // "Digit-AI - ... - AAAAMMJJx.md") qui dépassent MAX_PATH sous Windows.
    const r = git(racine, "clone", "--quiet", "-c", "core.longpaths=true", `${SOURCE}/${f.nom}.git`, dest);
    if (r.status === 0) {
      const e = etatDepot(dest);
      ligne("ok", `${f.nom} — cloné (${e.version})`);
      versions.push({ nom: f.nom, version: e.version, sha: e.sha, date: e.date, etat: "cloné" });
    } else defaut(`${f.nom} — clone en échec : ${(r.stderr || "").trim().split("\n")[0].slice(0, 120)}`,
      `vérifier l'accès à ${SOURCE}/${f.nom}.git`);
  }
}

// 4 bis. LES DÉPÔTS QUE LA LISTE NE CONNAÎT PAS (TF-0525) ------------------------------------
//
// LE FAIT, mesuré le 23/08. Le balayage des dépôts de la racine a rendu QUINZE entrées là où
// l'écosystème en compte quatorze. La quinzième est un SECOND CLONE DU PILOT, sous un ancien nom :
// même `origin`, même dépôt, deux répertoires. Il est absent de la liste `FORGES`, donc `--pull` ne
// le voit pas et ne le mettra JAMAIS à jour — il portait 110 commits de retard au moment de la
// mesure, et son dernier commit local datait de quatre jours plus tôt.
//
// CE QU'UN CLONE MORT PIÈGE, et ce n'est pas théorique : quelqu'un y avait ingéré une candidature,
// en croyant écrire dans le registre vivant. Le sujet a été redécouvert QUATRE JOURS PLUS TARD par
// un lot de retours, et instruit une seconde fois. Rien n'était perdu — c'est le travail refait qui
// a coûté.
//
// Le marqueur `PERIME.md` posé dans ce clone était NON VERSIONNÉ : un nouveau clone ne l'aurait pas.
// Un avertissement qui ne survit pas au clonage n'avertit personne.
//
// CE QUI EST JUGÉ ICI, et pas plus : la racine porte-t-elle un répertoire git dont l'`origin` est
// celui d'un dépôt DÉJÀ connu, ou un répertoire qui ressemble à une mise de côté (`_old`, `_vide`,
// `_ancien`, `PERIME.md`) ? On le DIT, on ne le supprime pas : effacer un dépôt sur une heuristique
// serait échanger un piège contre une perte.
console.log("");
{
  // HORS PÉRIMÈTRE DÉCLARÉ, avec la cause de chacun (règle N-13). Un dépôt de l'écosystème que
  // bootstrap ne suit PAS exprès se nomme ici, une fois — sinon le contrôle qui suit le signale à
  // chaque ouverture, et un avertissement qui revient sans jamais rien vouloir dire s'apprend à
  // être ignoré. C'est la mesure du 23/08 qui l'impose : la règle neuve rendait TROIS dépôts, dont
  // deux volontaires et déjà documentés ailleurs. Une précision d'un sur trois n'est pas un contrôle.
  const HORS_PERIMETRE = new Map([
    ["digit-ai-forge-audit_client-a", "espace d'engagement CLIENT, privé et hors bootstrap — porte des livrables remis, pas de l'outillage"],
    ["digit-ai - saas forge", "produit SaaS distinct, gouverné par son propre dépôt public — l'écosystème forge ne le pilote pas"],
  ]);
  const connus = new Map();          // origin normalisé -> nom du dépôt attendu
  const attendus = new Set(FORGES.map((f) => f.nom));
  attendus.add("digit-ai-factory");
  // LE SEPARATEUR FAIT PARTIE DE LA NORMALISATION, et son absence rendait la comparaison
  // fausse en silence : une origin ecrite « C:\\dev\\bare/depot.git » et une autre
  // « C:\\dev\\bare\\depot.git » designent le MEME depot et ne se ressemblaient pas. Deux clones du
  // meme depot, l un cite avec des barres obliques et l autre avec des antislashs, echappaient donc
  // au controle du second clone. Trouve en jouant le cas du renommage (TF-0533).
  const normaliser = (u) => (u || "").trim().replaceAll("\\", "/")
    .replace(/\.git$/, "").replace(/\/+$/, "").toLowerCase();
  const originDe = (d) => {
    const r = git(d, "remote", "get-url", "origin");
    return r.status === 0 ? normaliser(r.stdout) : null;
  };
  // LES ALIAS COMPTENT ICI, ET LEUR ABSENCE A COUTE UN DEPOT FANTOME (TF-0533, 23/08/2026).
  // Ce balayage reconnaissait un second clone en comparant des CHAINES d'origin. Or l'origin d'un
  // clone antérieur à un renommage porte l'ANCIEN nom : « …/digit-ai-forge-seo.git » face à
  // « …/digit-ai-forge-seo-geo.git ». Deux chaînes différentes, donc aucun rapprochement — et le
  // dossier tombait entre les trois branches de ce contrôle, déclaré comme RIEN. Mesuré : trois
  // commits de retard, compté comme un dépôt vivant par tout oracle de parc, qui annonçait
  // « 16 dépôts » pour 15 et lisait 26 fichiers de trop. Un oracle avait même été patché pour
  // l'exclure LUI, nommément, plutôt que la cause soit traitée ici.
  // La table d'alias existait déjà, à deux fonctions d'ici : elle sert maintenant AUSSI à
  // reconnaître les origins. Un renommage futur est donc couvert sans un geste.
  for (const nom of attendus) {
    const d = join(racine, nom);
    if (!existsSync(join(d, ".git"))) continue;
    const o = originDe(d);
    if (!o) continue;
    connus.set(o, nom);
    const f = FORGES.find((x) => x.nom === nom);
    for (const ancien of (f && f.alias) || []) {
      connus.set(o.replace(/[^/]+$/, ancien.toLowerCase()), nom);
    }
  }
  let entrees = [];
  try { entrees = readdirSync(racine, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name); }
  catch { entrees = []; }
  const suspects = [];
  for (const nom of entrees) {
    if (attendus.has(nom)) continue;
    const d = join(racine, nom);
    const estGit = existsSync(join(d, ".git"));
    const perime = existsSync(join(d, "PERIME.md"));
    // `_archive-` est la convention du parc depuis le 23/08 (references/CONVENTION-DEPOTS-MIS-DE-COTE.md) :
    // un dépôt mis de côté se RENOMME une fois, au lieu d'être exclu nommément dans chaque contrôle.
    const nommeMisDeCote = /(_old|_vide|_ancien|_backup|\.bak)$/i.test(nom) || /^_archive-/i.test(nom);
    if (!estGit) {
      // UN MARQUEUR POSÉ EXPRÈS SE LIT AVANT DE CRIER À L'ACCIDENT (23/08/2026). Cette branche
      // passait avant toute lecture de `PERIME.md` : un répertoire tombé là par mégarde et une
      // PIERRE TOMBALE posée délibérément recevaient le même verdict, « rien de ce qu'on y écrit
      // n'est suivi ». Or l'un est un accident à corriger et l'autre un choix à respecter — les
      // confondre apprend à ignorer les deux.
      if (perime) suspects.push({ nom, motif: "mise de côté DÉCLARÉE (PERIME.md présent, répertoire non versionné) — pierre tombale, pas accident" });
      // Un répertoire NON git qui porte le nom d'un dépôt de l'écosystème est un piège aussi : on
      // s'y installe en croyant être dans un dépôt, et rien n'y est versionné.
      else if (/^digit-ai/i.test(nom)) suspects.push({ nom, motif: "répertoire NON versionné portant un nom de l'écosystème — rien de ce qu'on y écrit n'est suivi" });
      continue;
    }
    const o = originDe(d);
    if (o && connus.has(o)) {
      const retard = git(d, "rev-list", "--count", "HEAD..origin/main");
      const n = retard.status === 0 ? (retard.stdout || "").trim() : "?";
      suspects.push({
        nom,
        motif: `SECOND CLONE de ${connus.get(o)} (même origin) — ${n} commit(s) de retard, hors de la liste ` +
          "des dépôts donc jamais mis à jour par --pull. Y travailler écrit dans un registre mort",
      });
      continue;
    }
    if (perime || nommeMisDeCote) {
      suspects.push({ nom, motif: `mise de côté (${perime ? "PERIME.md présent" : "nom archivé ou en _old/_vide"}) — ne rien y exécuter` });
      continue;
    }
    // LE TROISIÈME TROU DE CE MÊME BALAYAGE, trouvé le 23/08 en regardant la racine à l'œil : un
    // dépôt qui porte un nom de l'écosystème, versionné, avec SON PROPRE origin — donc ni une forge
    // de la liste, ni un second clone, ni une mise de côté. Il tombait entre toutes les branches et
    // n'était déclaré NULLE PART. Mesuré : `digit-ai-queue` vit dans le parc depuis un moment, hors
    // de toute vérification de fraîcheur, et rien ne l'avait jamais dit. Le contrôle ne tranche pas
    // — il POSE la question, parce que la réponse (entrer dans la liste, ou être hors périmètre
    // assumé) est une décision humaine.
    if (/^digit-ai/i.test(nom) && !HORS_PERIMETRE.has(nom.toLowerCase())) {
      suspects.push({ nom, motif: `dépôt de l'écosystème HORS LISTE avec son propre origin (${o || "origin illisible"}) — ni forge suivie, ni second clone, ni mise de côté : jamais vérifié par --pull. À inscrire dans la liste des forges, ou à déclarer hors périmètre` });
    }
  }
  if (!suspects.length) ligne("ok", `racine propre — aucun dépôt hors liste sous ${racine}`);
  else for (const x of suspects) {
    ligne("avert", `${x.nom} — ${x.motif}. Ne rien y exécuter ; supprimer un répertoire est un geste HUMAIN (R-29) — ce contrôle le déclare, il ne l'efface pas`);
    averts.push(x.nom);
  }
}

// 5. Preuves de points d'entrée (contrat d'interface) ---------------------------------------
console.log("");
for (const f of FORGES) {
  const p = join(racine, f.nom, f.preuve);
  if (existsSync(p)) ligne("ok", `preuve ${f.nom} : ${f.preuve}`);
  else defaut(`preuve absente : ${f.nom}/${f.preuve}`, "dépôt incomplet ou contrat d'interface changé — relancer --pull, sinon signaler");
}

// 6. Skills : ce qui s'exécute au poste doit être ce que les forges versionnent --------------
// (K1 : skill versionné absent de la copie installée · K2 : copie divergente). oracle-skills
// NOMME son remède ; --pull l'applique : la dérive versionné↔installé a été payée trois fois
// (archive « 9 skills sur 20 », TF-0391, TF-0414) parce qu'aucun geste de mise à jour ne la
// propageait. Sans --pull : mesure seule, défaut nommé.
console.log("");
if (sansSkills) ligne("avert", "skills non jugés (--sans-skills)");
else {
  const oracle = join(ICI, "oracles", "oracle-skills.mjs");
  if (!existsSync(oracle)) ligne("avert", "oracles/oracle-skills.mjs absent — skills non jugés");
  else {
    const juger = (appliquer) => {
      const argv = [oracle, "--racine", racine, "--installes", SKILLS_INSTALLES];
      if (appliquer) argv.push("--appliquer");
      const r = run(process.execPath, argv, ICI);
      let rapport = {};
      try { rapport = JSON.parse(r.stdout); } catch { /* sortie non JSON : jugée par le code de retour */ }
      const echecs = (rapport.findings || []).filter((x) => x.statut === "FAIL");
      return { code: r.status, verdict: rapport.verdict, echecs };
    };
    let v = juger(false);
    if (v.code === 2) ligne("avert", `skills — non jugeables : ${v.verdict || "SKIP"} (aucun skill versionné trouvé sous la racine ?)`);
    else if (v.code === 0) ligne("ok", `skills installés = skills versionnés (${SKILLS_INSTALLES})`);
    else if (pull) {
      const a = juger(true);
      v = juger(false);
      if (v.code === 0) ligne("ok", `skills propagés vers ${SKILLS_INSTALLES} (oracle-skills --appliquer, décision portée par --pull) — rejeu PASS`);
      else defaut(`skills — ${v.echecs.length} règle(s) encore en échec après propagation : ${[...new Set(v.echecs.map((x) => x.regle))].join(", ")}`,
        `node oracles/oracle-skills.mjs --racine "${racine}" (le verdict nomme le remède ; --purger si des orphelins subsistent)`);
      if (a.code === 2) averts.push("propagation SKIP");
    } else {
      const regles = [...new Set(v.echecs.map((x) => x.regle))].join(", ");
      defaut(`skills installés en écart avec les forges (${v.echecs.length} règle(s) : ${regles})`, "node bootstrap.mjs --pull");
    }
  }
}

// 7. Bilan : versions, puis verdict ----------------------------------------------------------
if (versions.length) {
  console.log("\nVersions au poste :");
  for (const v of versions) console.log(`  ${v.nom.padEnd(34)} ${String(v.version).padEnd(22)} ${v.sha.padEnd(8)} ${v.date}  ${v.etat}`);
}
console.log(
  defauts.length
    ? `\nPoste NON prêt — ${defauts.length} défaut(s), chacun avec son remède ci-dessus.`
    : `\nPoste prêt — présent, à jour, skills alignés${averts.length ? ` (${averts.length} avertissement(s) non bloquant(s))` : ""}. Si la racine n'est pas le parent du pilot, exporter FORGE_ROOT=${racine} avant d'ouvrir la session.`
);
process.exit(defauts.length ? 1 : 0);
