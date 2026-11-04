#!/usr/bin/env node
/**
 * hook-mutation-en-cours.mjs — PAS DE COMMIT NI DE DÉPLOIEMENT PENDANT QU'UNE CAMPAGNE DE MUTATION
 * ALTÈRE LES SOURCES (TF-2126, côté LECTURE du verrou posé par forge-tests, TF-2091).
 *
 * LE FAIT. La campagne de mutation de forge-tests altère EN PLACE les sources du projet audité : elle
 * pose un mutant, rejoue la suite, restaure à l'octet près. Entre la pose et la restauration, une
 * source porte un code FAUX. Le 03/11/2026, chez Produit-86, des mutants étaient visibles dans
 * `audit.py` puis `egress.py` : un commit concurrent les aurait figés dans le dépôt. Depuis le commit
 * 9ea4f4a de forge-tests, `analyser` pose à la racine du projet audité un verrou
 * `.forge-tests-mutation-en-cours` (JSON : `pid`, `depuis`, `fichiers`, `message`) et le retire à la
 * sortie, même sur interruption. Le côté écriture existait ; rien ne lisait le verrou.
 *
 * CE QUE FAIT CE HOOK. Hook `PreToolUse` sur `Bash` et `PowerShell`. Tant que le verrou existe dans le
 * dossier de la commande (ou l'un de ses parents), il REFUSE (exit 2, motif sur stderr) :
 *   · `git commit` sous toutes ses formes (`-a`, `--amend`, `-m …`) : c'est le geste qui fige un mutant ;
 *   · `git add` d'un fichier en cours de mutation, ou d'un chemin qui le contient (`.`, `-A`, `-u`,
 *     un dossier, un motif `*`) : un mutant indexé survit à la fin de la fenêtre et part au commit suivant ;
 *   · un déploiement qui livre l'arbre de travail tel quel (liste fermée ci-dessous).
 * Le message NOMME les fichiers mutés, dit si le pid du verrou est VIVANT (attendre la fin de la
 * campagne, le verrou se retire seul) ou MORT (verrou orphelin : la campagne a été interrompue sans
 * passer par son `finally`, les fichiers peuvent porter encore un mutant — relire le diff, restaurer,
 * retirer le verrou). Il LAISSE PASSER tout le reste : lectures, `git status`, `git diff`, `git log`,
 * `git restore` (le remède), un commit hors du dossier verrouillé.
 *
 * LISTE FERMÉE DES DÉPLOIEMENTS (livrent l'arbre de travail, pas un commit) : `az webapp deploy|up`,
 * `az functionapp deploy|deployment`, `swa deploy`, `wrangler deploy|publish|pages deploy`,
 * `vercel deploy`, `netlify deploy`, `npm publish`. Aucun gabarit de déploiement exécutable n'existe
 * au pilot (la MEP est outillée par forge-ops, qui décide de ses commandes) : la garde porte donc sur
 * l'outil qui part, comme les autres hooks de la factory.
 *
 * NON JUGÉ (déclaré). Un commit ou un déploiement joué par un script dont le texte n'est pas dans la
 * commande, un alias git, une commande construite par variable ; un éditeur ou une interface qui
 * commite sans passer par l'outil Bash ou PowerShell de la session ; un pid réutilisé par le système
 * après la mort de la campagne (le verrou se dirait alors vivant : l'heure de pose, affichée, permet
 * d'en douter) ; un verrou posé hors du dossier de la commande et de ses parents.
 *
 * Usage : node oracles\hook-mutation-en-cours.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : 0 laisse passer · 2 refuse (motif sur stderr).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mots, segments, OUTILS } from "./hook-remisage.mjs";

/** Nom du verrou, tel que forge-tests le pose (forge_tests/adaptateurs/mutation.py, VERROU_MUTATION). */
export const VERROU = ".forge-tests-mutation-en-cours";
const OPTIONS_A_VALEUR = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace", "--exec-path"]);
const CHANGEMENTS_DE_DOSSIER = new Set(["cd", "chdir", "pushd", "set-location", "sl"]);
const NIVEAUX_MAX = 12; // remontée des parents : un projet audité n'est jamais plus profond

const basename = (m) => String(m).split(/[\\/]/).pop().toLowerCase().replace(/\.(exe|cmd|bat|ps1)$/, "");

/** Les mots d'un segment à partir de l'outil `nom` (ex. `az`), ou null. */
function apres(m, nom) {
  const i = m.findIndex((x) => basename(x) === nom);
  return i < 0 ? null : m.slice(i + 1);
}

/** Famille de déploiement d'un segment, ou null. Liste fermée (voir l'en-tête). */
export function deploiement(m) {
  const az = apres(m, "az");
  if (az) {
    const [a, b] = [az[0], az[1]];
    if (a === "webapp" && (b === "deploy" || b === "up")) return `az webapp ${b}`;
    if (a === "functionapp" && (b === "deploy" || b === "deployment")) return `az functionapp ${b}`;
  }
  const swa = apres(m, "swa");
  if (swa && swa[0] === "deploy") return "swa deploy";
  const wr = apres(m, "wrangler");
  if (wr && (wr[0] === "deploy" || wr[0] === "publish" || (wr[0] === "pages" && wr[1] === "deploy"))) return `wrangler ${wr[0]}${wr[0] === "pages" ? " deploy" : ""}`;
  for (const outil of ["vercel", "netlify"]) {
    const o = apres(m, outil);
    if (o && o[0] === "deploy") return `${outil} deploy`;
  }
  const npm = apres(m, "npm");
  if (npm && npm[0] === "publish") return "npm publish";
  return null;
}

/**
 * Analyse UN segment : rend null ou { geste, dossier, args, deplacements }.
 * `dossier` est le `-C` de git (ou null) ; `deplacements` les dossiers des `cd` du segment.
 */
export function analyserSegment(segment) {
  const m = mots(segment);
  if (m.length && CHANGEMENTS_DE_DOSSIER.has(basename(m[0]))) {
    const cible = m.slice(1).find((x) => !x.startsWith("-"));
    return cible ? { geste: null, deplacements: [cible] } : null;
  }
  const dep = deploiement(m);
  if (dep) return { geste: `déploiement (\`${dep}\`)`, famille: "deploiement", deplacements: [] };
  let i = m.findIndex((x) => /(^|[\\/])git(\.exe)?$/i.test(x));
  if (i < 0) return null;
  i++;
  let dossier = null;
  while (i < m.length && m[i].startsWith("-")) {
    if (m[i] === "-C" && m[i + 1]) dossier = m[i + 1];
    i += OPTIONS_A_VALEUR.has(m[i]) ? 2 : 1;
  }
  if (m[i] === "commit") return { geste: "`git commit`", famille: "commit", dossier, args: m.slice(i + 1), deplacements: [] };
  if (m[i] === "add") return { geste: "`git add`", famille: "add", dossier, args: m.slice(i + 1), deplacements: [] };
  return dossier ? { geste: null, deplacements: [dossier] } : null;
}

/** Cherche le verrou dans `dossier` et ses parents ; rend son chemin ou null. */
export function trouverVerrou(dossier) {
  let d = resolve(dossier);
  for (let n = 0; n < NIVEAUX_MAX; n++) {
    if (existsSync(join(d, VERROU))) return join(d, VERROU);
    const p = dirname(d);
    if (p === d) break;
    d = p;
  }
  return null;
}

/** Lit le verrou : { pid, depuis, fichiers, message, illisible }. Un verrou illisible reste un verrou. */
export function lireVerrou(chemin) {
  try {
    const c = JSON.parse(readFileSync(chemin, "utf8"));
    return {
      pid: Number.isInteger(c.pid) ? c.pid : null,
      depuis: typeof c.depuis === "string" ? c.depuis : null,
      fichiers: Array.isArray(c.fichiers) ? c.fichiers.map(String) : [],
      message: typeof c.message === "string" ? c.message : "",
      illisible: false,
    };
  } catch {
    return { pid: null, depuis: null, fichiers: [], message: "", illisible: true };
  }
}

/** true : vivant · false : mort · null : pid inconnu. */
export function pidVivant(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return null;
  try { process.kill(pid, 0); return true; } catch (e) { return e?.code === "EPERM"; }
}

/** Un `git add` touche-t-il un fichier en cours de mutation ? Les motifs non résolubles comptent oui. */
function addTouche(args, base, racine, fichiers) {
  if (args.some((a) => /^(-A|--all|-u|--update|-a|--no-ignore-removal)$/.test(a))) return true;
  const chemins = args.filter((a) => !a.startsWith("-"));
  if (!chemins.length) return false;
  return chemins.some((c) => {
    if (/[*?[]/.test(c) || c === ":/") return true;
    const abs = resolve(base, c);
    return fichiers.some((f) => {
      const fa = resolve(racine, f);
      const rel = relative(abs, fa);
      return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
    });
  });
}

/** Juge l'entrée d'un hook PreToolUse. */
export function juger(entree, env = process.env) {
  if (!OUTILS.has(entree?.tool_name)) return { decision: "laisse" };
  const commande = entree?.tool_input?.command;
  if (typeof commande !== "string" || !/\b(git|az|swa|wrangler|vercel|netlify|npm)\b/i.test(commande)) return { decision: "laisse" };
  const analyses = segments(commande).map(analyserSegment).filter(Boolean);
  if (!analyses.some((a) => a.geste)) return { decision: "laisse" };

  // Le dossier courant suit les `cd` dans l'ordre : un geste se juge contre le verrou de SON dossier.
  let courant = resolve(entree?.cwd || env.CLAUDE_PROJECT_DIR || process.cwd());
  const refus = [];
  for (const a of analyses) {
    for (const d of a.deplacements || []) courant = resolve(courant, d);
    if (!a.geste) continue;
    const base = a.dossier ? resolve(courant, a.dossier) : courant;
    const verrou = trouverVerrou(base);
    if (!verrou) continue;
    const lu = lireVerrou(verrou);
    if (a.famille === "add" && !lu.illisible && !addTouche(a.args, base, dirname(verrou), lu.fichiers)) continue;
    refus.push({ geste: a.geste, verrou, lu });
  }
  if (!refus.length) return { decision: "laisse" };
  return { decision: "refuse", motif: formuler(refus[0], refus.map((r) => r.geste)) };
}

function formuler({ verrou, lu }, gestes) {
  const vivant = pidVivant(lu.pid);
  const fichiers = lu.fichiers;
  const liste = fichiers.length ? fichiers.join(", ") : "(le verrou ne les nomme pas)";
  let age = "";
  if (lu.depuis) {
    const t = Date.parse(lu.depuis);
    if (!Number.isNaN(t)) age = ` (il y a ${Math.max(0, Math.round((Date.now() - t) / 60000))} min)`;
  }
  const etat = lu.illisible ? "verrou ILLISIBLE (JSON invalide ou vide), pid inconnu"
    : vivant === true ? `pid ${lu.pid} VIVANT`
    : vivant === false ? `pid ${lu.pid} MORT`
    : "pid absent du verrou";
  const cmd = fichiers.length ? fichiers.map((f) => `"${f}"`).join(" ") : "<fichiers mutés>";
  const remedeVivant = "Remède, campagne vivante : attendre la fin de la mutation de forge-tests (elle restaure les sources puis retire le verrou "
    + "elle-même), puis rejouer la commande. Ne pas supprimer le verrou à la main : un mutant resterait dans les sources.";
  const remedeOrphelin = "Remède, verrou orphelin (la campagne n'a pas tourné son `finally`, les fichiers peuvent porter encore un mutant) : "
    + `1) \`git diff -- ${cmd}\` ; 2) si le diff ne montre QUE le mutant, \`git restore -- ${cmd}\` (sinon rétablir à la main la seule ligne mutée, `
    + "sans toucher aux modifications légitimes) ; 3) supprimer le verrou (`rm` ou `Remove-Item`) ; 4) rejouer la commande.";
  const remede = vivant === true ? remedeVivant : (vivant === false || lu.illisible || lu.pid === null) ? remedeOrphelin
    : remedeVivant;
  return `MUTATION EN COURS (TF-2126) — ${[...new Set(gestes)].join(" ; ")} refusé : le verrou ${verrou} est posé${age}, ${etat}. `
    + `Fichiers nommés par le verrou, qui portent un code FAUX (mutant) tant que la campagne dure : ${liste}. `
    + "Un commit, un index ou un déploiement maintenant FIGERAIT un mutant dans le dépôt (fait du 03/11/2026 chez Produit-86 : mutants visibles dans "
    + `audit.py puis egress.py). ${remede}`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = {};
  try { entree = JSON.parse(brut || "{}"); } catch { /* entrée illisible : pas un appel d'outil */ }
  let v = { decision: "laisse" };
  try { v = juger(entree); } catch { /* une panne du juge ne bloque jamais un outil */ }
  if (v.decision === "refuse") { process.stderr.write(v.motif + "\n"); process.exit(2); }
  process.exit(0);
}
