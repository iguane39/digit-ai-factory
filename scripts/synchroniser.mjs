#!/usr/bin/env node
/**
 * synchroniser.mjs — « SYNCHRONISE AVEC GITHUB » EN UN SEUL SCRIPT, AU PILOT ET DANS LES FORGES
 * (D-107 (a), décision humaine du 29/10/2026).
 *
 * LE FAIT. La demande est revenue 8 fois dans 7 sessions, du 20 au 29/10/2026, et chaque session
 * recomposait le geste à la main. La session qui a posé la décision a vu QUATRE publications du pilot
 * refusées : le distant avait avancé (une autre session publie en parallèle), un GO manquait, et une
 * porte de publication défaillante bloquait. Un geste qu'on recompose se rate de quatre façons ; il
 * s'écrit donc une fois, avec son compte rendu.
 *
 * CE QUE FAIT LE SCRIPT, par dépôt et dans cet ordre :
 *   1. RÉCUPÈRE (`git fetch origin`) et MESURE l'avance et le retard sur `origin/<branche>` ;
 *   2. INTÈGRE : avance rapide si le dépôt n'a rien d'unique, sinon REBASE des enregistrements locaux
 *      sur l'origine. Sur conflit : `git rebase --abort`, le dépôt est vérifié IDENTIQUE à ce qu'il
 *      était (même HEAD, plus d'opération en cours), et le conflit est rapporté — fichiers et
 *      enregistrement en cause. Jamais de fusion à la main, jamais de force ;
 *   3. AU PILOT, régénère les index d'`input\` et d'`output\` (`node scripts\readme-dossiers.mjs`).
 *      Une modification qui ne porte QUE sur un tel index ne bloque pas la récupération : elle est
 *      écartée le temps de l'intégration (contenu gardé en mémoire, remis si l'intégration échoue),
 *      puis l'index est régénéré. Condition : le bloc RÔLE, écrit à la main, est identique à celui
 *      du dépôt — sinon c'est du travail humain et la modification bloque, intacte ;
 *   4. PUBLIE (`git push origin HEAD:<branche>`) avec le GO déclaré. Le pre-push du pilot ne lit
 *      `FORGE_PUSH_GO` que lorsqu'un enregistrement en avance est `explicite` (R-38 par. 4-5,
 *      `scripts\verifier-avance-publication.mjs`) : restitution et candidatures pures passent seules,
 *      tout enregistrement qui porte une décision, une clôture, une règle ou un contenu de produit
 *      exige le motif. Le GO se lit dans l'ordre : `--go "<motif>"`, puis `FORGE_PUSH_GO`, puis le GO
 *      PERMANENT de R-38 par. 6 (D-54 (b) du 03/10 pour le pilot, D-53 (b) du 03/10 pour une forge).
 *      Le canal confidentiel, `digit-ai-queue` et les produits restent au GO par envoi : sans GO
 *      déclaré, ils ne sont pas poussés et le compte rendu dit `go_manquant`. Un refus du pre-push
 *      est rapporté TEL QUEL (sortie complète), sans contournement : ni `--no-verify`, ni force.
 *      Seul un rejet « le distant a avancé » entre l'intégration et l'envoi (une autre session vient
 *      de publier) est rejoué : nouvelle récupération, nouveau rebase, nouvel envoi — 3 tentatives
 *      au plus, chacune consignée.
 *
 * LES CIBLES se lisent comme `bootstrap.mjs` : le pilot (ce dépôt, ou `--pilot`), les forges de
 * `FORGES` de `scripts\lib-parc.mjs` (relu APRÈS le pilot, dont la liste a pu changer), puis le canal
 * confidentiel. Aucune liste en dur ici. Un dépôt absent est rapporté `absent` — le clone est l'affaire
 * de `bootstrap.mjs --pull`, pas d'une synchronisation.
 *
 * JAMAIS : force, `--no-verify`, `git stash` (la pile est UNE pour tous les arbres de travail, voir
 * `oracles\hook-remisage.mjs` : un remisage nu a pris le travail préparé pour main le 15/10/2026),
 * création de branche distante, commit de ce que le script n'a pas écrit. Un arbre sale qui empêcherait
 * le rebase n'est donc jamais remisé : le dépôt est laissé tel quel et `bloque` dit quels fichiers.
 *
 * LE MODE ESSAI N'ÉCRIT RIEN (`--essai`). Vérifié par le test, qui compare octet à octet l'arbre
 * entier — `.git` compris, origines comprises — avant et après : un autre script du pilot a déjà eu
 * un `--essai` ignoré en silence. Sa récupération se fait dans un dossier d'objets de quarantaine
 * (`GIT_OBJECT_DIRECTORY`, le dépôt en alternate) sans référence ni FETCH_HEAD ; le rebase est
 * simulé commit par commit par `git merge-tree --write-tree`, dans la même quarantaine ; les
 * lectures d'état n'écrivent jamais dans l'index (`GIT_OPTIONAL_LOCKS=0`). Il prédit : le mode
 * d'intégration, le conflit éventuel, ce qui serait publié, le GO résolu et, au pilot, le classement
 * R-38 des enregistrements.
 *
 * NON JUGÉ (déclaré). Le pre-push n'est PAS joué en essai (il peut durer ~9 min au pilot, et
 * `git push --dry-run` le joue pour de bon) : un refus de la porte des noms n'est pas prédit. Le
 * rebase simulé par fusions successives peut différer d'un vrai rebase sur des commits qui deviennent
 * vides. Les commits de fusion locaux ne se rebasent pas (ils seraient aplatis) : `bloque`. Une
 * branche absente de l'origine n'est pas créée. Les non-suivis ne sont ni lus ni touchés (leur
 * nombre est dit). Les sous-modules.
 *
 * Usage : node scripts\synchroniser.mjs [--essai] [--cible <nom>] [--racine <dossier>]
 *                                       [--sans-publier] [--go "<motif>"] [--pilot <dossier>]
 *   --essai         n'écrit rien : prédit, et dit ce qui serait fait
 *   --cible <nom>   n'en viser qu'un : `pilot`, `canal`, ou une forge (nom exact, ou son suffixe :
 *                   `tests` pour digit-ai-forge-tests)
 *   --racine        racine du parc (défaut : $FORGE_ROOT, sinon le parent du pilot) — comme bootstrap
 *   --sans-publier  récupère et intègre, ne publie pas
 *   --go <motif>    GO déclaré (prioritaire sur FORGE_PUSH_GO et sur le GO permanent de R-38 par. 6)
 *   --pilot         dossier du pilot (défaut : ce dépôt) — réservé aux recettes sur dépôts jetables
 * Sortie : JSON sur stdout, un compte rendu par dépôt (`depots[]`) ; avancement ligne à ligne sur
 * stderr. Le pre-push du pilot dure ~9 min et un process long muet est en défaut de contrat : l'envoi
 * relaie la sortie du pre-push en direct et émet un battement toutes les 3 min
 * (`SYNCHRONISER_BATTEMENT_MS` pour le régler, en recette).
 * Exit : 0 tout est synchronisé (ou absent) · 1 au moins un dépôt en conflit, bloqué, refusé, sans GO,
 * hors ligne ou en échec · 2 argument invalide.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ACCES_REFUSE } from "./lib-parc.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));

// R-38 par. 6 (D-53 (b) et D-54 (b), 03/10/2026) : le GO PERMANENT de push du pilot et des forges.
export const GO_PERMANENT = { pilot: "D-54 (b) du 03/10", forge: "D-53 (b) du 03/10" };
const TENTATIVES_MAX = 3;
const BATTEMENT_MS = Number(process.env.SYNCHRONISER_BATTEMENT_MS) > 0 ? Number(process.env.SYNCHRONISER_BATTEMENT_MS) : 180000;
const SORTIE_MAX = 20000;
const MARQUE_ROLE_DEBUT = "<!-- ROLE:DEBUT -->";
const MARQUE_ROLE_FIN = "<!-- ROLE:FIN -->";
// L'index qu'`readme-dossiers.mjs` génère : un README.md d'input\ ou d'output\ (jamais un LISEZMOI, en partie à la main).
const INDEX_REGENERE = /^(input|output)(\/.+)?\/README\.md$/;
export const estIndexRegenere = (chemin) => INDEX_REGENERE.test(String(chemin).split("\\").join("/"));

// ---------------------------------------------------------------------------------------------
// git : jamais de fenêtre d'identifiants, jamais d'éditeur, aucune écriture d'index optionnelle.
// ---------------------------------------------------------------------------------------------
const ENV = {
  ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never", GIT_OPTIONAL_LOCKS: "0",
  GIT_EDITOR: "true", GIT_SEQUENCE_EDITOR: "true", LC_ALL: "C",
};
function git(cwd, argv, env = {}, delai = 0) {
  const r = spawnSync("git", argv, {
    cwd, encoding: "utf8", windowsHide: true, maxBuffer: 256 * 1024 * 1024, env: { ...ENV, ...env },
    ...(delai ? { timeout: delai } : {}),
  });
  if (r.error) return { status: 127, stdout: "", stderr: String(r.error.message || r.error) };
  return { status: r.status ?? 1, stdout: r.stdout || "", stderr: r.stderr || "" };
}
/**
 * Un git LONG (l'envoi, dont le pre-push du pilot dure ~9 min) : la sortie du process est relayée en direct sur
 * stderr ET gardée entière pour le compte rendu, et un battement dit toutes les 3 minutes que l'envoi court
 * encore — un process long muet est indiscernable d'un blocage (TF-0094, TF-0252).
 */
function gitLong(cwd, argv, env, nom) {
  return new Promise((resolvePromesse) => {
    const debut = Date.now();
    const enfant = spawn("git", argv, { cwd, windowsHide: true, env: { ...ENV, ...env } });
    let out = "";
    let err = "";
    enfant.stdout.on("data", (d) => { out += d; });
    enfant.stderr.on("data", (d) => { err += d; process.stderr.write(d); });
    const battement = setInterval(() => dire(`${nom} — envoi toujours en cours (${Math.round((Date.now() - debut) / 1000)} s)`), BATTEMENT_MS);
    const fin = (status, plus = "") => { clearInterval(battement); resolvePromesse({ status, stdout: out, stderr: err + plus }); };
    enfant.on("error", (e) => fin(127, String(e.message || e)));
    enfant.on("close", (code) => fin(code ?? 1));
  });
}
const sortie = (r) => (r.stdout || "").trim();
const premiereLigne = (t) => String(t || "").trim().split(/\r?\n/)[0].slice(0, 200);
const dire = (msg) => process.stderr.write(`[synchroniser ${new Date().toTimeString().slice(0, 8)}] ${msg}\n`);

/** Une sortie complète, bornée par la QUEUE (le motif d'un refus est à la fin) — la borne se dit. */
function citer(texte) {
  const t = String(texte || "").trim();
  return t.length > SORTIE_MAX ? { sortie: t.slice(t.length - SORTIE_MAX), tronquee: true, taille: t.length } : { sortie: t, tronquee: false, taille: t.length };
}

// ---------------------------------------------------------------------------------------------
// Les cibles : lues comme bootstrap.mjs (FORGES de lib-parc, puis le canal), jamais en dur.
// ---------------------------------------------------------------------------------------------
async function chargerParc(pilot) {
  // Relu à chaque appel, cache contourné : le pilot mis à jour peut avoir changé la liste des forges.
  const propre = join(pilot, "scripts", "lib-parc.mjs");
  const fichier = existsSync(propre) ? propre : join(ICI, "lib-parc.mjs");
  return import(`${pathToFileURL(fichier).href}?v=${Date.now()}`);
}

export function resoudreCibles(parc, { racine, pilot }) {
  const cibles = [{ nom: parc.PILOT, type: "pilot", chemin: pilot, prive: false }];
  for (const f of parc.FORGES) cibles.push({ nom: f.nom, type: f.prive ? "depot-prive" : "forge", chemin: join(racine, f.nom), prive: !!f.prive, alias: f.alias || [] });
  const canal = process.env.FORGE_CONFIDENTIEL || join(racine, parc.CANAL.dossier);
  cibles.push({ nom: parc.CANAL.nom, type: "canal", chemin: canal, prive: true });
  return cibles;
}

/** `--cible` : le nom exact, `pilot`, `canal`, ou le suffixe d'une forge. Rend null si rien ne correspond. */
export function choisirCible(cibles, demande) {
  const d = String(demande);
  const exact = cibles.find((c) => c.nom === d || (c.alias || []).includes(d));
  if (exact) return exact;
  if (d === "pilot" || d === "pilote") return cibles.find((c) => c.type === "pilot");
  if (d === "canal") return cibles.find((c) => c.type === "canal");
  return cibles.find((c) => c.type !== "pilot" && c.type !== "canal" && (c.nom === `digit-ai-forge-${d}` || c.nom === `digit-ai-${d}`)) || null;
}

/** Le GO : `--go`, puis FORGE_PUSH_GO, puis le GO permanent de R-38 par. 6 pour le pilot et les forges seuls. */
export function resoudreGo(cible, { go, env = process.env }) {
  if (go) return { motif: go, origine: "--go" };
  if (env.FORGE_PUSH_GO) return { motif: env.FORGE_PUSH_GO, origine: "FORGE_PUSH_GO (environnement)" };
  if (cible.type === "pilot") return { motif: GO_PERMANENT.pilot, origine: "R-38 par. 6 (GO permanent du pilot)" };
  if (cible.type === "forge") return { motif: GO_PERMANENT.forge, origine: "R-38 par. 6 (GO permanent des forges)" };
  return null;
}

// ---------------------------------------------------------------------------------------------
// État d'un dépôt.
// ---------------------------------------------------------------------------------------------
const gitPath = (cwd, nom) => resolve(cwd, sortie(git(cwd, ["rev-parse", "--git-path", nom])));
/** Une opération git déjà en cours (rebase, fusion, cherry-pick) : le script n'y touche pas. */
function operationEnCours(cwd) {
  for (const nom of ["rebase-merge", "rebase-apply", "MERGE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD"]) if (existsSync(gitPath(cwd, nom))) return nom;
  return null;
}
const rebaseEnCours = (cwd) => existsSync(gitPath(cwd, "rebase-merge")) || existsSync(gitPath(cwd, "rebase-apply"));

/** Modifications SUIVIES de l'arbre (les non-suivis sont comptés à part, jamais touchés). */
function lireModifies(cwd) {
  const r = git(cwd, ["status", "--porcelain=v1", "-z", "--untracked-files=no"]);
  const t = r.stdout.split("\0");
  const out = [];
  for (let i = 0; i < t.length; i++) {
    if (!t[i]) continue;
    const xy = t[i].slice(0, 2);
    out.push({ xy, chemin: t[i].slice(3) });
    if (/[RC]/.test(xy)) i++; // le chemin d'origine d'un renommage suit
  }
  return out;
}
const compterNonSuivis = (cwd) => sortie(git(cwd, ["ls-files", "--others", "--exclude-standard", "-z"])).split("\0").filter(Boolean).length;

const roleDe = (texte) => {
  const a = texte.indexOf(MARQUE_ROLE_DEBUT);
  const b = texte.indexOf(MARQUE_ROLE_FIN);
  return a >= 0 && b > a ? texte.slice(a, b + MARQUE_ROLE_FIN.length).split("\r\n").join("\n") : null;
};

/**
 * Sépare les modifications en : index régénérés PURS (écartables sans perte) et autres (travail à garder).
 * Un index est pur quand il est modifié dans l'arbre SEULEMENT (rien d'indexé) et que son bloc RÔLE,
 * écrit à la main, est identique à celui de HEAD : le reste se régénère de façon déterministe.
 */
function classerModifies(cwd, modifies) {
  const index = [];
  const autres = [];
  for (const m of modifies) {
    let pur = false;
    if (estIndexRegenere(m.chemin) && m.xy === " M") {
      const head = git(cwd, ["show", `HEAD:${m.chemin}`]);
      let local = null;
      try { local = readFileSync(join(cwd, m.chemin), "utf8"); } catch { /* illisible : pas pur */ }
      const rh = head.status === 0 ? roleDe(head.stdout) : null;
      pur = rh !== null && local !== null && roleDe(local) === rh;
    }
    (pur ? index : autres).push(m.chemin);
  }
  return { index, autres };
}

function ecarterIndex(cwd, chemins) {
  const sauve = new Map(chemins.map((p) => [p, readFileSync(join(cwd, p))]));
  for (const p of chemins) git(cwd, ["checkout", "--", p]);
  return sauve;
}
const restaurerIndex = (cwd, sauve) => { for (const [p, contenu] of sauve) writeFileSync(join(cwd, p), contenu); };

/** Avance et retard de HEAD sur une référence (nom de référence, ou sha en essai avec l'environnement de quarantaine). */
function ecart(cwd, ref, env = {}) {
  const retard = git(cwd, ["rev-list", "--count", `HEAD..${ref}`], env);
  const avance = git(cwd, ["rev-list", "--count", `${ref}..HEAD`], env);
  if (retard.status !== 0 || avance.status !== 0) return { retard: null, avance: null };
  return { retard: Number(sortie(retard)), avance: Number(sortie(avance)) };
}

// ---------------------------------------------------------------------------------------------
// Essai : la récupération en quarantaine, et le rebase simulé.
// ---------------------------------------------------------------------------------------------
function creerQuarantaine(cwd) {
  const dossier = mkdtempSync(join(tmpdir(), "synchroniser-essai-"));
  mkdirSync(join(dossier, "pack"));
  mkdirSync(join(dossier, "info"));
  const objets = gitPath(cwd, "objects");
  return {
    dossier,
    env: {
      GIT_OBJECT_DIRECTORY: dossier, GIT_ALTERNATE_OBJECT_DIRECTORIES: objets,
      GIT_AUTHOR_NAME: "synchroniser-essai", GIT_AUTHOR_EMAIL: "essai@invalide.invalid",
      GIT_COMMITTER_NAME: "synchroniser-essai", GIT_COMMITTER_EMAIL: "essai@invalide.invalid",
    },
    nettoyer: () => { try { rmSync(dossier, { recursive: true, force: true }); } catch { /* temporaire du poste */ } },
  };
}

function recupererEnEssai(cwd, branche, q) {
  const l = git(cwd, ["ls-remote", "origin", `refs/heads/${branche}`], {}, 120000);
  if (l.status !== 0) return { ok: false, stderr: l.stderr };
  const sha = l.stdout.trim().split(/\s/)[0];
  if (!sha) return { ok: true, sansAmont: true };
  if (git(cwd, ["cat-file", "-e", `${sha}^{commit}`]).status !== 0) {
    // ni référence, ni FETCH_HEAD, ni étiquette, ni entretien : les objets vont dans la quarantaine.
    const f = git(cwd, ["-c", "gc.auto=0", "-c", "maintenance.auto=false", "fetch", "--quiet", "--no-tags", "--no-write-fetch-head",
      "--refmap=", "--no-recurse-submodules", "origin", `refs/heads/${branche}`], q.env, 180000);
    if (f.status !== 0) return { ok: false, stderr: f.stderr };
  }
  return { ok: true, sha };
}

/** Rejoue les enregistrements locaux sur `onto` par fusions successives, en quarantaine. */
function simulerRebase(cwd, onto, q) {
  const locaux = sortie(git(cwd, ["rev-list", "--reverse", "--topo-order", `${onto}..HEAD`], q.env)).split("\n").filter(Boolean);
  let courant = onto;
  for (const c of locaux) {
    const mt = git(cwd, ["merge-tree", "--write-tree", "--name-only", `--merge-base=${c}^`, courant, c], q.env);
    const lignes = mt.stdout.split("\n");
    if (mt.status === 1) {
      const fin = lignes.indexOf("");
      return { conflit: true, commit: c.slice(0, 7), sujet: sortie(git(cwd, ["log", "-1", "--format=%s", c], q.env)), fichiers: lignes.slice(1, fin < 0 ? undefined : fin).filter(Boolean) };
    }
    if (mt.status !== 0) return { conflit: false, inconnu: true, raison: premiereLigne(mt.stderr) || "merge-tree illisible" };
    const arbre = lignes[0].trim();
    const ct = git(cwd, ["commit-tree", arbre, "-p", courant, "-m", "essai"], q.env);
    if (ct.status !== 0) return { conflit: false, inconnu: true, raison: premiereLigne(ct.stderr) };
    courant = sortie(ct);
  }
  return { conflit: false, rejoues: locaux.length };
}

// ---------------------------------------------------------------------------------------------
// Intégration réelle : avance rapide, sinon rebase ; sur échec, le dépôt est remis tel qu'il était.
// ---------------------------------------------------------------------------------------------
function integrer(cwd, ref, etat, shaAvant) {
  const modifies = lireModifies(cwd);
  const { index, autres } = classerModifies(cwd, modifies);
  if (etat.avance === 0) {
    const args = ["merge", "--ff-only", "--no-autostash", "--quiet", ref];
    let m = git(cwd, args);
    if (m.status === 0) return { ok: true, mode: "avance-rapide" };
    if (!index.length) return { ok: false, classe: "bloque", raison: `avance rapide refusée par git : ${premiereLigne(m.stderr)}`, detail: m.stderr.trim(), fichiers: autres };
    const sauve = ecarterIndex(cwd, index);
    m = git(cwd, args);
    if (m.status === 0) return { ok: true, mode: "avance-rapide", index_ecartes: index };
    restaurerIndex(cwd, sauve);
    return { ok: false, classe: "bloque", raison: `avance rapide refusée par git, même index écartés : ${premiereLigne(m.stderr)}`, detail: m.stderr.trim(), fichiers: autres };
  }
  // Rebase des enregistrements locaux.
  if (Number(sortie(git(cwd, ["rev-list", "--merges", "--count", `${ref}..HEAD`]))) > 0) {
    return { ok: false, classe: "bloque", raison: "un enregistrement de fusion local serait aplati par le rebase : rebase ou fusion à la main" };
  }
  if (autres.length) {
    return { ok: false, classe: "bloque", raison: "arbre de travail modifié : le rebase est refusé par git, et le script ne remise jamais (la pile est partagée)", fichiers: autres };
  }
  const sauve = index.length ? ecarterIndex(cwd, index) : new Map();
  const r = git(cwd, ["rebase", "--no-autostash", ref]);
  if (r.status === 0) return { ok: true, mode: "rebase", rejoues: etat.avance, index_ecartes: index };
  const enCours = rebaseEnCours(cwd);
  const conflit = { classe: enCours ? "conflit" : "bloque", raison: enCours ? "conflit au rebase" : `rebase refusé par git : ${premiereLigne(r.stderr)}`, detail: r.stderr.trim() };
  if (enCours) {
    conflit.fichiers = sortie(git(cwd, ["diff", "--name-only", "--diff-filter=U"])).split("\n").filter(Boolean);
    const arret = sortie(git(cwd, ["rev-parse", "REBASE_HEAD"]));
    if (arret) conflit.commit = { sha: arret.slice(0, 7), sujet: sortie(git(cwd, ["log", "-1", "--format=%s", arret])) };
    const ab = git(cwd, ["rebase", "--abort"]);
    if (ab.status !== 0) conflit.abandon = `rebase --abort en échec : ${premiereLigne(ab.stderr)}`;
  }
  restaurerIndex(cwd, sauve);
  const intact = sortie(git(cwd, ["rev-parse", "HEAD"])) === shaAvant && !operationEnCours(cwd);
  conflit.depot_intact = intact;
  if (!intact) { conflit.classe = "echec"; conflit.raison = `${conflit.raison} — ET LE DÉPÔT N'EST PAS REVENU À SON ÉTAT : HEAD ou opération en cours à vérifier à la main`; }
  return { ok: false, ...conflit };
}

// ---------------------------------------------------------------------------------------------
// Publication.
// ---------------------------------------------------------------------------------------------
/** Pourquoi un envoi a échoué : le distant a avancé, le réseau, ou une porte (pre-push) qui refuse. */
export function classerRefus(texte) {
  const t = String(texte || "");
  // Le rejet « le distant a avancé » d'abord : git ne contacte le distant qu'APRÈS un pre-push qui a laissé passer,
  // donc un `[rejected]` n'est jamais le refus d'une porte. DEUX formes : le rejet vu avant l'envoi (`fetch first`),
  // et celui du serveur quand l'autre session publie PENDANT le pre-push — qui peut durer ~9 min au pilot, alors
  // que les références ont été lues avant lui (`[remote rejected] … incorrect old value`, `cannot lock ref`).
  if (/\[rejected\]|non-fast-forward|fetch first|Updates were rejected|stale info|incorrect old value|cannot lock ref|is at [0-9a-f]+ but expected/i.test(t)) return "distant_avance";
  if (/PUBLICATION REFUSEE|MESSAGE REFUSE|hook declined|pre-push/i.test(t)) return "refus_porte";
  if (ACCES_REFUSE.test(t) || /unable to access|Could not resolve|timed out|Connection (refused|reset)/i.test(t)) return "reseau_ou_acces";
  return "refus_porte";
}

function pousser(cwd, branche, go, nom) {
  const env = go ? { FORGE_PUSH_GO: go.motif } : {};
  // Refspec simple, JAMAIS de `+`, `--force*`, `--no-verify` : le pre-push juge, son refus se rapporte.
  return gitLong(cwd, ["push", "origin", `HEAD:refs/heads/${branche}`], env, nom);
}

const hookPrePush = (cwd) => {
  const configure = sortie(git(cwd, ["config", "core.hooksPath"]));
  const dossier = configure ? resolve(cwd, configure) : gitPath(cwd, "hooks");
  return existsSync(join(dossier, "pre-push"));
};

/** Au pilot : régénère les index d'input\ et d'output\, puis dit lesquels diffèrent de HEAD. */
function regenererIndex(cwd) {
  const script = join(cwd, "scripts", "readme-dossiers.mjs");
  if (!existsSync(script)) return { joue: false, raison: "scripts\\readme-dossiers.mjs absent de ce dépôt" };
  const r = spawnSync(process.execPath, [script, "--base", cwd, "--silencieux"], { cwd, encoding: "utf8", windowsHide: true });
  const diff = lireModifies(cwd).map((m) => m.chemin).filter(estIndexRegenere);
  return { joue: true, code: r.status, regeneres: diff, ...(r.status ? { sortie: citer((r.stdout || "") + (r.stderr || "")).sortie } : {}) };
}

/** Le classement R-38 par. 4-5 des enregistrements en avance (essai seulement, lecture seule). */
function classerAvance(pilot, plage, env) {
  const script = join(ICI, "verifier-avance-publication.mjs");
  const r = spawnSync(process.execPath, [script, "--depot", pilot, "--plage", plage], { encoding: "utf8", windowsHide: true, env: { ...ENV, ...env } });
  try {
    const j = JSON.parse(r.stdout);
    return { verdict: j.verdict, exit: r.status, explicites: (j.enregistrements || []).filter((e) => e.classe === "explicite").map((e) => ({ sha: e.sha, sujet: e.sujet, fichiers: e.fichiers_hors_classe })) };
  } catch { return { verdict: "illisible", exit: r.status }; }
}

// ---------------------------------------------------------------------------------------------
// Un dépôt, de bout en bout.
// ---------------------------------------------------------------------------------------------
export async function synchroniserDepot(cible, opts = {}) {
  const { essai = false, publier = true, go = null } = opts;
  const cwd = cible.chemin;
  const cr = {
    nom: cible.nom, type: cible.type, chemin: cwd, essai, statut: "", raisons: [], branche: null,
    avant: null, recupere: { mode: "aucun", commits: 0 }, index: null, publication: null, apres: null,
  };
  const fini = (statut, raison) => { cr.statut = statut; if (raison) cr.raisons.push(raison); return cr; };

  if (!existsSync(join(cwd, ".git"))) {
    return fini("absent", cible.prive ? "dépôt privé absent (facultatif)" : "dépôt absent du poste : le clone est l'affaire de `node bootstrap.mjs --pull`");
  }
  cr.branche = sortie(git(cwd, ["rev-parse", "--abbrev-ref", "HEAD"])) || "HEAD";
  if (cr.branche === "HEAD") return fini("bloque", "HEAD détaché : aucune branche à synchroniser");
  const enCours = operationEnCours(cwd);
  if (enCours) return fini("bloque", `opération git en cours (${enCours}) : le script n'y touche pas`);
  if (git(cwd, ["remote", "get-url", "origin"]).status !== 0) return fini("bloque", "pas de remote `origin`");

  const shaAvant = sortie(git(cwd, ["rev-parse", "HEAD"]));
  const q = essai ? creerQuarantaine(cwd) : null;
  try {
    // 1. Récupération et mesure --------------------------------------------------------------
    let ref;
    let envLecture = {};
    let fetchOk = false;
    if (essai) {
      const rec = recupererEnEssai(cwd, cr.branche, q);
      if (!rec.ok) return echecReseau(cr, cible, rec.stderr, fini);
      if (rec.sansAmont) return fini("bloque", `la branche ${cr.branche} n'existe pas sur origin : le script ne crée pas de branche distante`);
      ref = rec.sha; envLecture = q.env; fetchOk = true;
    } else {
      dire(`${cible.nom} — récupération`);
      const f = git(cwd, ["fetch", "--quiet", "origin"], {}, 180000);
      if (f.status !== 0) return echecReseau(cr, cible, f.stderr, fini);
      fetchOk = true;
      ref = `origin/${cr.branche}`;
      if (git(cwd, ["rev-parse", "--verify", "--quiet", ref]).status !== 0) return fini("bloque", `la branche ${cr.branche} n'existe pas sur origin : le script ne crée pas de branche distante`);
    }
    const mesure = ecart(cwd, ref, envLecture);
    cr.avant = { sha: shaAvant.slice(0, 7), retard: mesure.retard, avance: mesure.avance, modifies: lireModifies(cwd).length, non_suivis: compterNonSuivis(cwd), fetch: fetchOk };
    if (mesure.retard === null) return fini("echec", "avance et retard illisibles après la récupération");
    dire(`${cible.nom} — ${cr.branche} : ${mesure.avance} devant, ${mesure.retard} derrière${essai ? " (essai)" : ""}`);

    // 2. Intégration ---------------------------------------------------------------------------
    let avanceApres = mesure.avance;
    if (mesure.retard > 0) {
      cr.recupere.commits = mesure.retard;
      if (essai) {
        const prevu = predireIntegration(cwd, ref, mesure, q);
        Object.assign(cr.recupere, prevu.recupere);
        if (prevu.index) cr.index = prevu.index;
        if (prevu.echec) { cr.recupere.mode = prevu.echec.classe; cr.conflit = prevu.echec; return fini(prevu.echec.classe === "conflit" ? "conflit" : "bloque", prevu.echec.raison); }
      } else {
        dire(`${cible.nom} — intégration (${mesure.avance === 0 ? "avance rapide" : "rebase de " + mesure.avance + " enregistrement(s)"})`);
        const i = integrer(cwd, ref, mesure, shaAvant);
        if (!i.ok) {
          cr.recupere.mode = i.classe;
          cr.conflit = { classe: i.classe, fichiers: i.fichiers || [], commit: i.commit || null, depot_intact: i.depot_intact ?? true, detail: citer(i.detail).sortie };
          return fini(i.classe === "conflit" ? "conflit" : i.classe, i.raison);
        }
        cr.recupere.mode = i.mode;
        if (i.rejoues !== undefined) cr.recupere.rejoues = i.rejoues;
        if (i.index_ecartes?.length) cr.recupere.index_ecartes = i.index_ecartes;
      }
    }

    // 3. Au pilot : les index régénérés ----------------------------------------------------------
    if (cible.type === "pilot") {
      if (essai) {
        const { index } = classerModifies(cwd, lireModifies(cwd));
        cr.index = { ...(cr.index || {}), joue: false, raison: "essai : la régénération n'est pas jouée", index_modifies_actuels: index };
      } else {
        dire(`${cible.nom} — régénération des index d'input\\ et d'output\\`);
        cr.index = regenererIndex(cwd);
      }
    }

    // 4. Publication ---------------------------------------------------------------------------
    const apresInteg = essai ? { retard: 0, avance: avanceApres } : ecart(cwd, ref);
    avanceApres = apresInteg.avance;
    cr.publication = { jouee: false, publie: false, commits: avanceApres, go: null, tentatives: [], refus: null };
    if (!publier) { cr.publication.raison_non_jouee = "--sans-publier"; }
    else if (!avanceApres) { cr.publication.raison_non_jouee = "rien à publier : aucun enregistrement local en avance"; }
    else {
      const goRes = resoudreGo(cible, { go });
      cr.publication.go = goRes;
      cr.publication.pre_push_present = hookPrePush(cwd);
      if (!goRes) {
        cr.publication.raison_non_jouee = `go_manquant : ${cible.nom} est hors du GO permanent de R-38 par. 6 (GO par envoi) — relancer avec --go "<motif>"`;
        cr.apres = apres(cwd, ref, essai, { retard: 0, avance: avanceApres });
        return fini("go_manquant", cr.publication.raison_non_jouee);
      }
      if (essai) {
        cr.publication.raison_non_jouee = "essai : l'envoi n'est pas joué, et le pre-push NON PLUS (il peut durer ~9 min, et un refus de la porte des noms n'est pas prédit)";
        if (cible.type === "pilot") cr.publication.classement_r38 = classerAvance(cwd, `${ref}..HEAD`, q.env);
      } else {
        const ok = await publierAvecReprises(cwd, cible, cr, goRes, ref);
        if (!ok) { cr.apres = apres(cwd, ref, essai); return fini("refuse", `publication refusée (${cr.publication.refus?.classe})`); }
      }
    }

    // 5. Bilan -----------------------------------------------------------------------------------
    // (un envoi refusé est déjà rendu plus haut : ici, tout ce qui devait partir est parti, ou le serait en essai)
    const partira = cr.publication.publie || (essai && publier && avanceApres > 0);
    cr.apres = apres(cwd, ref, essai, { retard: 0, avance: partira ? 0 : avanceApres });
    if (mesure.retard === 0 && mesure.avance === 0) return fini("a_jour");
    if (!publier && avanceApres) return fini("recupere", `en avance de ${avanceApres} enregistrement(s) : non publié (--sans-publier)`);
    return fini("synchronise");
  } finally {
    q?.nettoyer();
  }
}

function echecReseau(cr, cible, stderr, fini) {
  if (cible.prive && ACCES_REFUSE.test(stderr || "")) return fini("inaccessible", `dépôt privé hors d'accès pour ce compte (facultatif) : ${premiereLigne(stderr)}`);
  return fini("hors_ligne", `origin injoignable : ${premiereLigne(stderr)}`);
}

function apres(cwd, ref, essai, prevu = null) {
  if (essai) return { prevu: true, ...prevu };
  const e = ecart(cwd, ref);
  return { sha: sortie(git(cwd, ["rev-parse", "--short", "HEAD"])), retard: e.retard, avance: e.avance, modifies: lireModifies(cwd).length };
}

/** Essai : ce que l'intégration ferait, sans rien écrire. */
function predireIntegration(cwd, ref, mesure, q) {
  const { index, autres } = classerModifies(cwd, lireModifies(cwd));
  const entrants = sortie(git(cwd, ["diff", "--name-only", `HEAD...${ref}`], q.env)).split("\n").filter(Boolean);
  if (mesure.avance === 0) {
    const collisions = autres.filter((p) => entrants.includes(p));
    if (collisions.length) return { echec: { classe: "bloque", raison: "avance rapide refusée par git : des fichiers modifiés localement sont touchés par la récupération", fichiers: collisions }, recupere: { mode: "bloque" } };
    return { recupere: { mode: "avance-rapide", ...(index.some((p) => entrants.includes(p)) ? { index_ecartes: index.filter((p) => entrants.includes(p)) } : {}) } };
  }
  if (Number(sortie(git(cwd, ["rev-list", "--merges", "--count", `${ref}..HEAD`], q.env))) > 0) return { echec: { classe: "bloque", raison: "un enregistrement de fusion local serait aplati par le rebase : rebase ou fusion à la main" }, recupere: { mode: "bloque" } };
  if (autres.length) return { echec: { classe: "bloque", raison: "arbre de travail modifié : le rebase serait refusé, et le script ne remise jamais (la pile est partagée)", fichiers: autres }, recupere: { mode: "bloque" } };
  const sim = simulerRebase(cwd, ref, q);
  if (sim.conflit) return { echec: { classe: "conflit", raison: "conflit prévu au rebase (simulé par merge-tree)", fichiers: sim.fichiers, commit: { sha: sim.commit, sujet: sim.sujet } }, recupere: { mode: "conflit" } };
  if (sim.inconnu) return { echec: { classe: "echec", raison: `rebase non simulable : ${sim.raison}` }, recupere: { mode: "inconnu" } };
  return { recupere: { mode: "rebase", rejoues: sim.rejoues, ...(index.length ? { index_ecartes: index } : {}) } };
}

/** Envoi, puis reprise bornée si le distant a avancé entre-temps. Rend true si publié. */
async function publierAvecReprises(cwd, cible, cr, goRes, ref) {
  const pub = cr.publication;
  pub.jouee = true;
  for (let n = 1; n <= TENTATIVES_MAX; n++) {
    dire(`${cible.nom} — envoi (tentative ${n}/${TENTATIVES_MAX}, GO : ${goRes.motif})${cible.type === "pilot" ? " — le pre-push du pilot peut durer ~9 min" : ""}`);
    const p = await pousser(cwd, cr.branche, goRes, cible.nom);
    const texte = `${p.stdout}\n${p.stderr}`;
    const t = { n, code: p.status, ...citer(texte) };
    if (p.status === 0) { pub.tentatives.push(t); pub.publie = true; return true; }
    t.classe = classerRefus(texte);
    pub.tentatives.push(t);
    if (t.classe !== "distant_avance" || n === TENTATIVES_MAX) { pub.refus = { classe: t.classe, code: p.status, ...citer(texte) }; return false; }
    // Le distant a avancé pendant l'envoi : une autre session publie. Récupérer, rebaser, rejouer.
    dire(`${cible.nom} — le distant a avancé : nouvelle récupération`);
    if (git(cwd, ["fetch", "--quiet", "origin"], {}, 180000).status !== 0) { pub.refus = { classe: "reseau_ou_acces", ...citer(texte) }; return false; }
    const e = ecart(cwd, ref);
    if (e.retard > 0) {
      const i = integrer(cwd, ref, e, sortie(git(cwd, ["rev-parse", "HEAD"])));
      if (!i.ok) { pub.refus = { classe: i.classe, raison: i.raison, fichiers: i.fichiers || [], ...citer(i.detail) }; cr.conflit = { classe: i.classe, fichiers: i.fichiers || [], commit: i.commit || null, depot_intact: i.depot_intact ?? true }; return false; }
      cr.recupere.reprises = (cr.recupere.reprises || 0) + 1;
      cr.recupere.mode = cr.recupere.mode === "aucun" ? i.mode : `${cr.recupere.mode}+${i.mode}`;
      cr.recupere.commits += e.retard;
    }
    pub.commits = ecart(cwd, ref).avance;
  }
  return false;
}

// ---------------------------------------------------------------------------------------------
// L'ensemble.
// ---------------------------------------------------------------------------------------------
const BLOQUANTS = new Set(["conflit", "bloque", "refuse", "go_manquant", "hors_ligne", "echec"]);

export async function synchroniser(opts) {
  const pilot = resolve(opts.pilot || join(ICI, ".."));
  const racine = resolve(opts.racine || process.env.FORGE_ROOT || dirname(pilot));
  const ctx = { essai: !!opts.essai, publier: opts.publier !== false, go: opts.go || null };
  let parc = await chargerParc(pilot);
  let cibles = resoudreCibles(parc, { racine, pilot });
  const unique = opts.cible ? choisirCible(cibles, opts.cible) : null;
  if (opts.cible && !unique) {
    const e = new Error(`--cible « ${opts.cible} » ne désigne aucun dépôt du parc. Valides : pilot, canal, ${cibles.filter((c) => c.type === "forge" || c.type === "depot-prive").map((c) => c.nom.replace(/^digit-ai-(forge-)?/, "")).join(", ")}`);
    e.code = "CIBLE_INCONNUE";
    throw e;
  }
  const depots = [];
  const faire = async (c) => { depots.push(await synchroniserDepot(c, ctx)); const d = depots[depots.length - 1]; dire(`${d.nom} — ${d.statut}${d.raisons.length ? " : " + d.raisons[0] : ""}`); };
  if (unique) await faire(unique);
  else {
    await faire(cibles[0]); // le pilot d'abord : sa liste de forges a pu changer avec ce qu'il vient de récupérer
    parc = await chargerParc(pilot);
    cibles = resoudreCibles(parc, { racine, pilot });
    for (const c of cibles.slice(1)) await faire(c);
  }
  const presents = depots.filter((d) => d.statut !== "absent" && d.statut !== "inaccessible");
  const verdict = !presents.length ? "AUCUN_DEPOT" : depots.some((d) => BLOQUANTS.has(d.statut)) ? "A_TRAITER" : "OK";
  return {
    outil: "synchroniser", decision: "D-107 (a) du 29/10/2026", racine, pilot, essai: ctx.essai, publier: ctx.publier,
    resume: Object.fromEntries([...new Set(depots.map((d) => d.statut))].map((s) => [s, depots.filter((d) => d.statut === s).length])),
    verdict, depots,
  };
}

function lireArgs(argv) {
  const a = { essai: false, publier: true };
  const valeur = (i, nom) => { if (argv[i + 1] === undefined || argv[i + 1].startsWith("--")) { const e = new Error(`${nom} exige une valeur`); e.code = "ARG"; throw e; } return argv[i + 1]; };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === "--essai") a.essai = true;
    else if (x === "--sans-publier") a.publier = false;
    else if (x === "--go") a.go = valeur(i++, "--go");
    else if (x === "--cible") a.cible = valeur(i++, "--cible");
    else if (x === "--racine") a.racine = valeur(i++, "--racine");
    else if (x === "--pilot") a.pilot = valeur(i++, "--pilot");
    else { const e = new Error(`argument inconnu : ${x}`); e.code = "ARG"; throw e; }
  }
  return a;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const compte = await synchroniser(lireArgs(process.argv.slice(2)));
    process.stdout.write(JSON.stringify(compte, null, 2) + "\n");
    process.exit(compte.verdict === "OK" ? 0 : 1);
  } catch (e) {
    if (e.code === "ARG" || e.code === "CIBLE_INCONNUE") {
      process.stderr.write(`synchroniser : ${e.message}\nusage : node scripts\\synchroniser.mjs [--essai] [--cible <nom>] [--racine <dossier>] [--sans-publier] [--go "<motif>"]\n`);
      process.exit(2);
    }
    throw e;
  }
}
