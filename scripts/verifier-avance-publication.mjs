#!/usr/bin/env node
/**
 * verifier-avance-publication.mjs — outiller la borne de R-38 §4-5 (D-4 (a), D-12 (a)).
 *
 * POURQUOI CET OUTIL EXISTE. Le push d'un dépôt est un GO humain (noyau §Garde-fous). Mais R-38
 * §4 (10/09) et §5 (11/09) disent qu'un GO donné sur un TRAVAIL couvre D'OFFICE deux catégories
 * d'enregistrements en avance sur l'origine : la RESTITUTION de ce travail (synthèse, vues
 * régénérées, index de dossiers) et, depuis le 11/09, les CANDIDATURES pures (`candidat`) au
 * registre — sidecar ingéré, événement d'ingestion, classe neuve, vues régénérées. Tout le reste —
 * décision, clôture, règle, contenu de produit — ramène au GO explicite. Cette borne se jugeait
 * À LA MAIN : relire chaque message de commit avant chaque push, un jugement qui ne laisse aucune
 * trace et qu'un tour pressé saute. Cet outil la rejoue MÉCANIQUEMENT, sur les FICHIERS touchés
 * par chaque enregistrement — jamais sur la lecture d'un message de commit, qui peut mentir ou
 * omettre.
 *
 * CE QUI CLASSE, et pourquoi ce n'est PAS le message de commit :
 *   - restitution  : tous les fichiers touchés sont dans R (voir R-38 §4 — synthèses/restitutions
 *                    de `output/`, tout README.md, les vues `todo/` régénérées, `.oracles/**`).
 *   - candidature  : tous les fichiers touchés sont dans R ∪ C (voir R-38 §5 — sidecars
 *                    `input/01-candidatures/*.tf.jsonl`, `todo/CLASSES.json`, `todo/TODO.jsonl`)
 *                    ET, si `todo/TODO.jsonl` est touché, chaque ligne AJOUTÉE par cet
 *                    enregistrement dans ce fichier est un événement `ingestion`, ou `creation`
 *                    sans statut décidé (`statut` absent ou `candidat`) — une ligne `maj`,
 *                    `decision`, `cloture`, un statut décidé, ou une ligne illisible n'est PLUS une
 *                    candidature pure : elle porte une décision, donc `explicite`.
 *   - explicite    : tout le reste — dont `REGLES-PROJET.md`, `CLAUDE.md`, `oracles/**`,
 *                     `scripts/**`, `gabarits/**`, `references/**`, ou tout fichier de produit.
 *
 * Usage :
 *   node scripts\verifier-avance-publication.mjs [--depot <chemin>] [--plage origin/main..HEAD]
 *                                                 [--go "<motif>"]
 * Exit : 0 PASS (aucun enregistrement `explicite`, ou `--go` donné) · 1 FAIL (au moins un
 * enregistrement `explicite`, listé) · 2 argument invalide (`--go` sans motif non vide).
 *
 * CE QU'IL NE FAIT PAS, et c'est délibéré : il ne juge pas si le GO explicite donné est le BON
 * GO — `--go` est une déclaration humaine prise telle quelle, jamais vérifiée contre un ticket ou
 * une décision réelle. Il ne rejoue pas `oracle-nom-client-publie` (une autre porte, un autre
 * domaine). Il ne regarde pas le CONTENU des fichiers de restitution ou de candidature au-delà de
 * la ligne ajoutée de `todo/TODO.jsonl` — un README.md qui mentirait sur son propre contenu reste
 * classé `restitution`. Il ne traite pas spécialement les commits de fusion (plusieurs parents) :
 * `git diff-tree` sans `-m` sur un tel commit peut ne rapporter aucun fichier, ce qui le classerait
 * à tort `restitution` — hors du scénario visé par R-38 §4-5 (des commits linéaires, un par tour).
 */
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };

const DEPOT = val("--depot") || process.cwd();
const PLAGE = val("--plage") || "origin/main..HEAD";

// Le garde d'argument sort AVANT tout appel git : aucune ressource ouverte, `process.exit()` y
// est sans risque (contrairement à un outil qui tiendrait des sockets réseau ouvertes).
const GO_INDEX = args.indexOf("--go");
let GO = null;
if (GO_INDEX >= 0) {
  const motif = args[GO_INDEX + 1];
  if (!motif) {
    process.stdout.write(JSON.stringify({
      outil: "verifier-avance-publication",
      erreur: "--go exige un motif non vide (le GO humain qui couvre les enregistrements explicites)",
    }, null, 1) + "\n");
    process.exit(2);
  }
  GO = motif;
}

function sh(a) {
  return execFileSync("git", a, { cwd: DEPOT, encoding: "utf8" });
}

function sortir(sortie, code) {
  process.stdout.write(JSON.stringify(sortie, null, 1) + "\n");
  process.exit(code);
}

// --- Les deux ensembles de R-38 §4 (R, restitution) et §5 (C, candidature — s'ajoute à R). ---

const base = (f) => f.split("/").pop();

function estDansR(f) {
  if (f.startsWith("output/") && f.endsWith(".md")) {
    const b = base(f);
    if (b.includes("Synthese") || b.includes("Restitution")) return true;
  }
  if (base(f) === "README.md") return true;
  if (f === "output/LISEZMOI.md") return true;
  if (f === "todo/TODO.md") return true;
  if (f === "todo/TODO.html") return true;
  if (f === "todo/AVANCEMENT.md") return true;
  if (f === "todo/RECIDIVES.md") return true;
  if (f === "todo/HERITAGE-RELEVES.jsonl") return true;
  if (f.startsWith("todo/observabilite/")) return true;
  if (f.startsWith(".oracles/")) return true;
  return false;
}

function estDansC(f) {
  if (/^input\/01-candidatures\/[^/]+\.tf\.jsonl$/.test(f)) return true;
  if (f === "todo/CLASSES.json") return true;
  if (f === "todo/TODO.jsonl") return true;
  return false;
}

/** Les fichiers touchés par un enregistrement — renommage résolu sur le chemin d'ARRIVÉE. */
function fichiersDeCommit(sha) {
  let out;
  try { out = sh(["diff-tree", "--no-commit-id", "--name-status", "-r", "--root", sha]); }
  catch { out = ""; }
  return out.split("\n").filter(Boolean).map((l) => {
    const parts = l.split("\t");
    return parts[parts.length - 1];
  });
}

/** Les lignes AJOUTÉES par cet enregistrement dans todo/TODO.jsonl — jamais les lignes ôtées. */
function lignesAjouteesTodoJsonl(sha) {
  let out;
  try { out = sh(["show", sha, "--", "todo/TODO.jsonl"]); }
  catch { out = ""; }
  return out.split("\n")
    .filter((l) => l.startsWith("+") && !l.startsWith("+++"))
    .map((l) => l.slice(1));
}

/** Une ligne de candidature PURE : `ingestion`, ou `creation` sans statut décidé. */
function ligneCandidatureValide(ligne) {
  let obj;
  try { obj = JSON.parse(ligne); } catch { return false; }
  if (!obj || typeof obj !== "object") return false;
  if (obj.ev === "ingestion") return true;
  if (obj.ev === "creation") return obj.statut === undefined || obj.statut === "candidat";
  return false; // maj, decision, cloture, ou tout autre événement : porte une décision
}

function classifier(sha) {
  const fichiers = fichiersDeCommit(sha);
  const horsR = fichiers.filter((f) => !estDansR(f));
  if (horsR.length === 0) return { classe: "restitution", fichiers_hors_classe: [] };

  const horsRC = fichiers.filter((f) => !estDansR(f) && !estDansC(f));
  if (horsRC.length > 0) return { classe: "explicite", fichiers_hors_classe: horsRC };

  // Tous les fichiers sont dans R ∪ C. Reste à vérifier ce que TODO.jsonl a reçu, s'il est touché.
  if (fichiers.includes("todo/TODO.jsonl")) {
    const lignes = lignesAjouteesTodoJsonl(sha);
    const illisible = lignes.some((l) => !ligneCandidatureValide(l));
    if (illisible) return { classe: "explicite", fichiers_hors_classe: ["todo/TODO.jsonl"] };
  }
  return { classe: "candidature", fichiers_hors_classe: [] };
}

// --- Hors dépôt git : rien à juger, PASS non_juge (point 4 du contrat). ---
try { sh(["rev-parse", "--is-inside-work-tree"]); }
catch {
  sortir({
    outil: "verifier-avance-publication", plage: PLAGE, enregistrements: [], verdict: "PASS",
    motif: "hors dépôt git : rien à juger",
    non_juge: [`« ${DEPOT} » n'est pas un dépôt git (ou git est inatteignable)`],
  }, 0);
}

// --- La plage : illisible (référence absente, ex. pas d'`origin`) → PASS non_juge, comme une plage vide. ---
let log;
try { log = sh(["log", "--format=%H%x01%s", PLAGE]); }
catch (e) {
  sortir({
    outil: "verifier-avance-publication", plage: PLAGE, enregistrements: [], verdict: "PASS",
    motif: "plage illisible : rien à juger",
    non_juge: [`la plage « ${PLAGE} » n'a pas pu être résolue : ${String(e.message || e).split("\n")[0]}`],
  }, 0);
}

const lignesLog = log.split("\n").filter(Boolean);
if (lignesLog.length === 0) {
  sortir({
    outil: "verifier-avance-publication", plage: PLAGE, enregistrements: [], verdict: "PASS",
    motif: "plage vide : aucun enregistrement à juger",
    non_juge: [`la plage « ${PLAGE} » ne contient aucun enregistrement`],
  }, 0);
}

const commits = lignesLog.map((l) => {
  const i = l.indexOf("\x01");
  return { sha: l.slice(0, i), sujet: l.slice(i + 1) };
});

const enregistrements = commits.map(({ sha, sujet }) => ({ sha, sujet, ...classifier(sha) }));
const explicites = enregistrements.filter((e) => e.classe === "explicite");

if (GO) {
  sortir({
    outil: "verifier-avance-publication", plage: PLAGE, enregistrements, verdict: "PASS", go: GO,
    motif: `GO humain explicite donné : ${GO} — couvre aussi les enregistrements explicites de la plage`,
  }, 0);
}

if (explicites.length === 0) {
  sortir({
    outil: "verifier-avance-publication", plage: PLAGE, enregistrements, verdict: "PASS",
    motif: "aucun enregistrement explicite dans la plage : restitution et candidatures pures, couvertes d'office (R-38 §4-5)",
  }, 0);
}

sortir({
  outil: "verifier-avance-publication", plage: PLAGE, enregistrements, verdict: "FAIL",
  motif: `${explicites.length} enregistrement(s) explicite(s) hors GO — attend un GO humain (--go) ou un rebasage : ` +
    explicites.map((e) => `${e.sha.slice(0, 7)} (${e.sujet})`).join(", "),
}, 1);
