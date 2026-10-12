#!/usr/bin/env node
/**
 * rejouer-verdicts-cites.mjs — un verdict cité dans un message de commit est REJOUÉ sur une copie
 * propre de ce commit, jamais sur l'arbre de travail (TF-1400, 12/10/2026, décision « Traiter » du
 * même jour sur la recommandation (a) de la fiche du 02/10).
 *
 * LE FAIT, mesuré le 24/09/2026 chez Produit-64. Le commit 0e98aff annonçait « Portes : périmètre
 * 19/19, banc 9/9, chemins PASS ». Rejouées sur un `git worktree add --detach` propre de ce commit
 * — la condition de l'agent de CI —, les mêmes portes rendaient 18/19 exit 1, 8/9, et FAIL sur cinq
 * références. Cause commune : elles lisaient des fichiers présents sur le disque du poste et absents
 * de l'histoire (un sous-module privé, un dossier ignoré, deux synthèses jamais commitées). Envoyé
 * tel quel, le commit rougissait la CI de main, verte sur ses huit derniers runs. Aucune règle ne
 * le disait : R-47 vaut pour les artefacts hérités, la classe recette-locale pour l'environnement
 * de la CI, aucune pour le verdict cité au commit.
 *
 * LA CONVENTION, lisible par une machine. Un message qui CITE un verdict le fait par une ligne de
 * pied de message :
 *     Verdict: <commande> => exit <N>
 *     Verdict: <commande> => exit <N> ; contient "<fragment de la sortie>"
 * (`contient` pour un compte comme « 19/19 », qu'un code de sortie ne porte pas). Ce script lit ces
 * lignes sur chaque commit de la plage, crée une copie PROPRE du commit (worktree détaché, hors du
 * dépôt, environnement sans variable `FORGE_*` ni `CLAUDE*` — celui d'un runner), y joue la
 * commande, et compare. Un écart, ou une commande qui ne s'exécute pas, est un FAIL qui nomme le
 * commit, la ligne citée et ce que la copie propre a rendu.
 *
 * Usage : node scripts\rejouer-verdicts-cites.mjs [--depot <dossier>] [--plage origin/main..HEAD]
 *                                                  [--delai-s 600]
 * Exit : 0 PASS (tous les verdicts cités se confirment, ou aucun n'est cité) · 1 FAIL ·
 *        2 argument invalide ou dépôt/plage illisible (jamais un vert : rien n'a été jugé).
 *
 * NON JUGÉ (déclaré) : un verdict cité en PROSE libre, sans ligne `Verdict:` — le message peut
 * mentir ou omettre, le script ne lit que la convention ; ce que la commande mesure (une porte qui
 * lit une source hors dépôt devrait se déclarer NON JUGÉE quand elle manque plutôt que d'échouer ou
 * de passer en silence : correctif de chaque porte, chez son propriétaire) ; l'environnement du
 * runner hébergé au-delà des variables retirées (système de fichiers, chaîne d'outils : voir
 * `simuler-recette-hebergee.mjs` pour cette simulation-là).
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RE_VERDICT = /^Verdict:\s*(.+?)\s*=>\s*exit\s+(\d+)(?:\s*;\s*contient\s+"([^"]+)")?\s*$/;

/** Les verdicts cités par un message : [{ commande, exit, contient|null, ligne }]. */
export function verdictsCites(message) {
  const sortie = [];
  for (const brute of String(message || "").split(/\r?\n/)) {
    const m = RE_VERDICT.exec(brute.trim());
    if (m) sortie.push({ commande: m[1], exit: Number(m[2]), contient: m[3] || null, ligne: brute.trim() });
  }
  return sortie;
}

const git = (depot, a, opts = {}) => spawnSync("git", ["-C", depot, "-c", "core.quotepath=false", ...a], { encoding: "utf8", ...opts });

/** L'environnement d'un runner : ni FORGE_* ni CLAUDE* hérités du poste. */
function envRunner() {
  const e = {};
  for (const [k, v] of Object.entries(process.env)) if (!/^(FORGE_|CLAUDE)/i.test(k)) e[k] = v;
  e.CI = "true";
  return e;
}

/** Rejoue les verdicts cités sur la plage. Rend { verdict, commits, ecarts, non_jugeable }. */
export function rejouer({ depot, plage = "origin/main..HEAD", delaiS = 600 }) {
  const top = git(depot, ["rev-parse", "--show-toplevel"]);
  if (top.status !== 0) return { verdict: "NON_JUGEABLE", motif: `« ${depot} » n'est pas un dépôt git` };
  const log = git(depot, ["log", "--reverse", "--format=%H%x01%s", plage]);
  if (log.status !== 0) return { verdict: "NON_JUGEABLE", motif: `plage « ${plage} » illisible : ${(log.stderr || "").split("\n")[0]}` };
  const commits = log.stdout.split("\n").filter(Boolean).map((l) => { const i = l.indexOf("\x01"); return { sha: l.slice(0, i), sujet: l.slice(i + 1) }; });
  const ecarts = [];
  const jugees = [];
  for (const c of commits) {
    const msg = git(depot, ["show", "-s", "--format=%B", c.sha]).stdout;
    const cites = verdictsCites(msg);
    if (!cites.length) continue;
    const racine = mkdtempSync(join(tmpdir(), "vc-"));
    const copie = join(racine, "c");
    try {
      const ajout = git(depot, ["-c", "core.longpaths=true", "worktree", "add", "--detach", copie, c.sha]);
      if (ajout.status !== 0) {
        ecarts.push({ sha: c.sha, ligne: cites[0].ligne, cause: `copie propre impossible : ${(ajout.stderr || "").split("\n")[0]}` });
        continue;
      }
      for (const v of cites) {
        const r = spawnSync(v.commande, { shell: true, cwd: copie, encoding: "utf8", env: envRunner(), timeout: delaiS * 1000 });
        const sortie = (r.stdout || "") + (r.stderr || "");
        const rendu = r.error ? `non exécutée (${r.error.code || r.error.message})` : `exit ${r.status}`;
        const memeCode = !r.error && r.status === v.exit;
        const memeSortie = v.contient === null || sortie.includes(v.contient);
        jugees.push({ sha: c.sha, ligne: v.ligne, rendu, confirme: memeCode && memeSortie });
        if (!memeCode || !memeSortie) {
          ecarts.push({
            sha: c.sha, ligne: v.ligne,
            cause: `cité « exit ${v.exit}${v.contient ? ` ; contient "${v.contient}"` : ""} », la copie propre rend ${rendu}`
              + (memeCode && !memeSortie ? ` sans « ${v.contient} » dans la sortie` : "")
              + (sortie.trim() ? ` — fin de sortie : ${sortie.trim().split("\n").slice(-3).join(" | ").slice(0, 300)}` : ""),
          });
        }
      }
    } finally {
      git(depot, ["worktree", "remove", "--force", copie]);
      rmSync(racine, { recursive: true, force: true });
    }
  }
  git(depot, ["worktree", "prune"]);
  return { verdict: ecarts.length ? "FAIL" : "PASS", commits: commits.length, jugees, ecarts };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const inconnues = args.filter((a) => a.startsWith("--") && !["--depot", "--plage", "--delai-s"].includes(a));
  if (inconnues.length) { console.error(`option inconnue : ${inconnues[0]}`); process.exit(2); }
  const delai = val("--delai-s") === undefined ? 600 : Number(val("--delai-s"));
  if (!Number.isFinite(delai) || delai <= 0) { console.error("--delai-s attend un nombre positif"); process.exit(2); }
  const r = rejouer({ depot: val("--depot") || process.cwd(), plage: val("--plage") || "origin/main..HEAD", delaiS: delai });
  if (r.verdict === "NON_JUGEABLE") { console.log(`[NON JUGEABLE] ${r.motif}`); process.exit(2); }
  for (const j of r.jugees) console.log(`  [${j.confirme ? "CONFIRMÉ" : "ÉCART"}] ${j.sha.slice(0, 8)} ${j.ligne} → copie propre : ${j.rendu}`);
  for (const e of r.ecarts) console.log(`  [FAIL] ${e.sha.slice(0, 8)} « ${e.ligne} » : ${e.cause}`);
  console.log(`verdict : ${r.verdict} (${r.commits} commit(s) dans la plage, ${r.jugees.length} verdict(s) cité(s) rejoué(s)${r.jugees.length ? "" : " ; aucun verdict cité par la convention `Verdict:`"})`);
  process.exit(r.verdict === "PASS" ? 0 : 1);
}
