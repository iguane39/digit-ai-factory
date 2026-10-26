/**
 * lib-decisions.mjs — LE REGISTRE DES NUMÉROS DE DÉCISION (D-N) DU PILOT, ET LA RÉSERVATION (TF-1872, 18/10/2026).
 *
 * LE FAIT, mesuré le 18/10/2026 : la synthèse 20261018j pose D-24, la synthèse 20261018l pose D-25 et D-26, et la synthèse
 * 20261018k, d'une autre session du même poste sur le même arbre, pose D-24 à D-28 pour cinq autres sujets. Une réponse
 * « 24a » devient ambiguë. Le contrôle RÉSERVATION livré le même jour par TF-1849 ne s'appliquait qu'aux produits, qui
 * inscrivent leurs D-N dans `forge\ledger.jsonl` ; au pilot, il se taisait : aucun registre n'existait.
 *
 * LA DÉCISION HUMAINE (D-32 (a), « valable tous produits », 18/10/2026) : « Chaque décision nouvelle s'inscrit dans un registre
 * partagé du pilot avant d'être affichée ; le contrôle de restitution refuse un numéro déjà pris » — et le même mécanisme vaut
 * pour tous les produits : UNE règle, UNE façon de réserver, au pilot comme chez chaque produit.
 *
 * CE QUE CE MODULE PORTE
 *   · le registre du pilot, `decisions\REGISTRE.jsonl` : une entrée `decision` par numéro réservé, amorcée avec les numéros
 *     déjà affichés ; tenu sous le dépôt du pilot, donc PARTAGÉ par toutes les sessions qui travaillent sur le même arbre ;
 *   · `reserverAuPilot` / `reserverChezProduit` : rendre le prochain numéro libre ET l'inscrire, sous UN verrou, en une seule
 *     opération. Chez un produit l'inscription reste celle de SON `forge\ledger.jsonl` (entrée `question_humain`, champ
 *     `decisions_posees`), écrite par SON écrivain (`forge\ledger.py`, sinon `ledger.mjs` de forge-agents) ;
 *   · `ressemblance` : deux libellés de la même question se reconnaissent, deux questions différentes se distinguent ;
 *   · le REGISTRE COMMUN DU POSTE chez un produit (TF-1911, D-83 (a) du 26/10/2026) : `<git rev-parse --git-common-dir>/forge-decisions.jsonl`,
 *     partagé par tous les arbres de travail d'un même dépôt, jamais versionné ; voir plus bas `lireRegistreCommun` et `reserverChezProduit`.
 *
 * CE QUE LA RÉSERVATION NE COUVRE PAS (dit, non tu)
 *   · une session qui prend un numéro SANS passer par l'outil (le texte est écrit à la main, ou par une autre voie) : le
 *     verrou n'arbitre que les sessions qui l'utilisent ; le contrôle de restitution rattrape le numéro au moment d'afficher ;
 *   · deux POSTES : le registre du pilot voyage par git ; deux postes qui réservent chacun de leur côté prennent le même numéro, et la
 *     collision n'apparaît qu'à la fusion (`--verifier` la nomme). Les D-N sont numérotées par poste (fusion du 20/09/2026). Chez un
 *     produit, le registre commun ne couvre pas non plus deux postes (D-83 (a)) : il vit dans le dossier git de CE poste ;
 *   · que la question réservée soit celle qui sera affichée : le contrôle ne compare que le sens, par les mots.
 */
import { existsSync, readFileSync, appendFileSync, openSync, closeSync, unlinkSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
export const PILOT = resolve(ICI, "..");
export const REGISTRE_PILOT = join(PILOT, "decisions", "REGISTRE.jsonl");

export const D_NUMERO = /(?<![\p{L}\p{N}_])D\s*-?\s*(\d{1,3})(?![\p{N}])/giu;

// ---- LA RESSEMBLANCE DE DEUX QUESTIONS ---------------------------------------------------------------------------
const MOTS_VIDES = new Set(["faut", "elle", "elles", "vous", "nous", "dans", "pour", "avec", "sans", "cette", "cela", "leur", "leurs", "sont", "être", "etre",
  "faire", "avant", "comme", "plus", "moins", "tout", "tous", "toute", "toutes", "doit", "doivent", "peut", "peuvent", "puis", "dont", "mais", "aussi", "entre", "chaque"]);
const sansAccents = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "");
/** Les mots qui portent le sens d'une question : minuscules, sans accent, quatre lettres au moins, hors mots vides. */
export function jetons(question) {
  return new Set(sansAccents(question).toLowerCase().replace(/\bd-?\d{1,3}\b/g, " ").split(/[^a-z0-9]+/)
    .filter((m) => m.length >= 4 && !MOTS_VIDES.has(m)).map((m) => m.replace(/(?:s|x)$/, "")));
}
/** Part des mots du libellé le plus court qui se retrouvent dans l'autre : 1 = même question, 0 = rien en commun. */
export function ressemblance(a, b) {
  const A = jetons(a), B = jetons(b);
  if (!A.size || !B.size) return 0;
  let communs = 0; for (const m of A) if (B.has(m)) communs++;
  return communs / Math.min(A.size, B.size);
}
/** Deux libellés qui parlent de la même décision (seuil fixé sur les 18 questions du 18/10/2026 — voir la recette). */
export const SEUIL_MEME_QUESTION = 0.5;
export const memeQuestion = (a, b) => ressemblance(a, b) >= SEUIL_MEME_QUESTION;

// ---- LE REGISTRE DU PILOT ------------------------------------------------------------------------------------------
/** Le registre : { fichier, existe, entrees: [{ n, question, ... }], numeros: Set<string>, max }. Une ligne illisible est ignorée, comptée. */
export function lireRegistrePilot(fichier = REGISTRE_PILOT) {
  if (!existsSync(fichier)) return { fichier, existe: false, entrees: [], numeros: new Set(), max: 0, illisibles: 0 };
  const entrees = []; let illisibles = 0;
  for (const l of readFileSync(fichier, "utf8").split(/\r?\n/)) {
    if (!l.trim()) continue;
    let e; try { e = JSON.parse(l); } catch { illisibles++; continue; }
    if (e?.type !== "decision" || !Number.isInteger(e.n)) continue;
    entrees.push(e);
  }
  return { fichier, existe: true, entrees, numeros: new Set(entrees.map((e) => String(e.n))), max: entrees.reduce((m, e) => Math.max(m, e.n), 0), illisibles };
}

/** La session est-elle au pilot (le dossier de travail est le dépôt du pilot ou en dessous, worktrees compris) ? */
export function estAuPilot(racine, pilot = PILOT) {
  if (!racine) return false;
  const norm = (p) => resolve(p).toLowerCase().replace(/[\\/]+$/, "");
  const r = norm(racine), p = norm(pilot);
  return r === p || r.startsWith(p + sep.toLowerCase()) || r.startsWith(p + "/");
}

// ---- LE VERROU (même mécanisme que `ledger.mjs append` : fichier adjacent créé en exclusif) -------------------------
const dormir = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const VERROU_ESSAIS = 200, VERROU_PAUSE_MS = 50, VERROU_PERIME_MS = 60_000;
/** `options` (TF-1911) : nombre d'essais, pause et délai de péremption propres à un verrou ; sans elles, les valeurs d'avant (registre du pilot inchangé). */
export function sousVerrou(verrou, fn, { essais = VERROU_ESSAIS, pauseMs = VERROU_PAUSE_MS, perimeMs = VERROU_PERIME_MS } = {}) {
  mkdirSync(dirname(verrou), { recursive: true });
  let pris = false;
  for (let i = 0; i < essais && !pris; i++) {
    try { closeSync(openSync(verrou, "wx")); pris = true; }
    catch (e) {
      if (e.code !== "EEXIST" && e.code !== "EPERM" && e.code !== "EACCES") throw e;
      // Un verrou plus vieux que `perimeMs` (une minute par défaut) est celui d'un processus mort : la section verrouillée dure quelques millisecondes.
      try { if (Date.now() - statSync(verrou).mtimeMs > perimeMs) unlinkSync(verrou); } catch { /* disparu entre-temps */ }
      dormir(pauseMs);
    }
  }
  if (!pris) throw new Error(`verrou non obtenu après ${(essais * pauseMs) / 1000} s : un autre processus détient ${verrou}`);
  try { return fn(); } finally { try { unlinkSync(verrou); } catch { /* déjà absent */ } }
}

export function controlerQuestion(question) {
  const q = String(question || "").replace(/\s+/g, " ").trim();
  if (q.length < 15) return { ok: false, raison: "la question est vide ou trop courte : une décision se pose comme une question complète, avec son point d'interrogation" };
  if (!/\?\s*$/.test(q)) return { ok: false, raison: "la question ne finit pas par un point d'interrogation : le libellé réservé est celui qui sera affiché (« > **D-N — <la question ?>** »)" };
  return { ok: true, question: q };
}

const session = (s) => String(s || process.env.CLAUDE_CODE_SESSION_ID || "").slice(0, 8) || null;
const aujourdhui = () => new Date().toISOString().slice(0, 10);

/** Réserve le prochain numéro libre au registre du pilot et l'inscrit : UN verrou, une lecture, une écriture. */
export function reserverAuPilot({ question, fichier = REGISTRE_PILOT, sessionId = null, source = null, plancher = 0 }) {
  const q = controlerQuestion(question);
  if (!q.ok) throw new Error(q.raison);
  return sousVerrou(fichier + ".lock", () => {
    const reg = lireRegistrePilot(fichier);
    const n = Math.max(reg.max, plancher) + 1;
    const entree = { type: "decision", n, question: q.question, date: aujourdhui(), ts: new Date().toISOString(), session: session(sessionId), origine: "reservation", ...(source ? { source } : {}) };
    mkdirSync(dirname(fichier), { recursive: true });
    const contenu = existsSync(fichier) ? readFileSync(fichier, "utf8") : "";
    appendFileSync(fichier, (contenu && !contenu.endsWith("\n") ? "\n" : "") + JSON.stringify(entree) + "\n", "utf8");
    return { id: "D-" + n, n, question: q.question, registre: fichier, ecrit_par: "lib-decisions.mjs (registre du pilot)" };
  });
}

/** Reformule une décision DÉJÀ inscrite (même numéro, libellé réécrit — le cas du format B du 17/10/2026, où D-1 à D-12 ont été reposées plus lisiblement). */
export function reformulerAuPilot({ n, question, fichier = REGISTRE_PILOT, sessionId = null }) {
  const q = controlerQuestion(question);
  if (!q.ok) throw new Error(q.raison);
  const num = Number(String(n).replace(/\D/g, ""));
  return sousVerrou(fichier + ".lock", () => {
    const reg = lireRegistrePilot(fichier);
    if (!reg.numeros.has(String(num))) throw new Error(`D-${num} n'est pas inscrite au registre : une décision NOUVELLE se réserve (--question), seule une décision inscrite se reformule`);
    const entree = { type: "decision", n: num, question: q.question, date: aujourdhui(), ts: new Date().toISOString(), session: session(sessionId), origine: "reformulation" };
    const contenu = readFileSync(fichier, "utf8");
    appendFileSync(fichier, (contenu && !contenu.endsWith("\n") ? "\n" : "") + JSON.stringify(entree) + "\n", "utf8");
    return { id: "D-" + num, n: num, question: q.question, registre: fichier, ecrit_par: "lib-decisions.mjs (registre du pilot)" };
  });
}

// ---- CHEZ UN PRODUIT : l'inscription reste celle de `forge\ledger.jsonl` ----------------------------------------------
/** Tous les numéros D-N que le ledger d'un produit nomme, toutes entrées confondues (une décision posée ou répondue occupe son numéro). */
export function numerosDuLedger(produit) {
  const fichier = join(produit, "forge", "ledger.jsonl");
  const numeros = new Set();
  if (!existsSync(fichier)) return { fichier, existe: false, numeros, max: 0 };
  for (const l of readFileSync(fichier, "utf8").split(/\r?\n/)) {
    if (!l.trim()) continue;
    let e; try { e = JSON.parse(l); } catch { continue; }
    for (const m of JSON.stringify(e).matchAll(D_NUMERO)) numeros.add(String(Number(m[1])));
  }
  return { fichier, existe: true, numeros, max: [...numeros].reduce((m, n) => Math.max(m, Number(n)), 0) };
}

/** L'écrivain du ledger de ce produit : `forge\ledger.py` s'il existe (pile Python), sinon `ledger.mjs` de forge-agents sous la racine du parc. */
export function ecrivainDeLedger(produit, racineParc = process.env.FORGE_ROOT || dirname(PILOT)) {
  const py = join(produit, "forge", "ledger.py");
  if (existsSync(py)) return { sorte: "python", chemin: py };
  const mjs = join(racineParc, "digit-ai-forge-agents", ".claude", "skills", "forge-agents", "scripts", "ledger.mjs");
  if (existsSync(mjs)) return { sorte: "node", chemin: mjs };
  return null;
}

// ---- LE REGISTRE COMMUN DU POSTE, PAR PRODUIT (TF-1911, D-83 (a) du 26/10/2026) ---------------------------------------------
//
// LE FAIT : les 18 et 19/10/2026, trois collisions chez un même produit (D-155, D-156, D-159, RT-137, RT-131, RT-139), chacune entre ARBRES
// DE TRAVAIL d'un même dépôt : le ledger d'un produit vit dans chaque arbre (`forge\ledger.jsonl`), une réservation faite dans l'un est
// invisible des autres, et l'humain a répondu « 159a » à deux questions différentes.
//
// LA DÉCISION HUMAINE (D-83 (a)) : « Un registre commun par produit et par poste. La réservation s'écrit sous verrou dans un fichier partagé
// par tous les arbres de travail du même dépôt sur ce poste (rangé dans le dossier git commun, jamais versionné), et le contrôle de fin de
// tour refuse un numéro déjà pris là ; ne couvre pas deux postes différents. »
//
// OÙ : `<git rev-parse --git-common-dir>/forge-decisions.jsonl`, verrou `forge-decisions.jsonl.lock` à côté. Le dossier git commun est celui
// que partagent tous les `git worktree` d'un dépôt ; il n'est pas dans l'arbre de travail, donc jamais versionné, jamais poussé.
// Le journal du produit (`forge\ledger.jsonl`) reste la trace versionnée : le registre commun s'AJOUTE, il ne le remplace pas.
// CE QUE CELA NE COUVRE PAS : deux postes (chacun a son dossier git) ; un produit qui n'est pas un dépôt git (le registre est alors
// indisponible, la réservation se fait comme avant et le DIT) ; un numéro pris SANS l'outil (écrit à la main au ledger).
export const REGISTRE_COMMUN_NOM = "forge-decisions.jsonl";
/** Verrou du registre commun : sa section contient l'écrivain du ledger (un processus Python ou Node, de 0,1 à 1 s). Périmé au-delà de 30 s ;
 *  la fenêtre d'attente (800 × 50 ms = 40 s) dépasse ce délai, pour qu'un verrou mort soit repris PAR l'appel qui l'attendait. */
export const VERROU_COMMUN = { essais: 800, pauseMs: 50, perimeMs: 30_000 };

/** Le dossier git commun du dépôt qui porte `dossier` (partagé par tous ses arbres de travail), ou la raison pour laquelle il n'y en a pas. */
export function dossierGitCommun(dossier) {
  const env = { ...process.env }; for (const k of ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[k];
  const r = spawnSync("git", ["rev-parse", "--git-common-dir"], { encoding: "utf8", cwd: dossier, env });
  if (r.error) return { ok: false, raison: `git introuvable ou illisible (${r.error.code || r.error.message})` };
  const sortie = String(r.stdout || "").trim();
  if (r.status !== 0 || !sortie) return { ok: false, raison: `${resolve(dossier)} n'est pas dans un dépôt git (${String(r.stderr || "").trim().slice(0, 120) || "git rev-parse a échoué"})` };
  return { ok: true, dossier: resolve(dossier, sortie) };
}

/** Le registre commun d'un produit : { disponible, raison, fichier, existe, entrees, numeros, max, illisibles }. Une ligne illisible est ignorée, comptée. */
export function lireRegistreCommun(produit) {
  const g = dossierGitCommun(produit);
  if (!g.ok) return { disponible: false, raison: g.raison, fichier: null, existe: false, entrees: [], numeros: new Set(), max: 0, illisibles: 0 };
  return { disponible: true, raison: null, ...lireRegistrePilot(join(g.dossier, REGISTRE_COMMUN_NOM)) };
}

/** Le prochain numéro libre chez un produit : l'UNION du registre commun, du ledger du produit (toute entrée qui nomme D-N) et du plancher. Lecture seule. */
export function prochainChezProduit({ produit, plancher = 0 }) {
  const ledger = numerosDuLedger(produit);
  const commun = lireRegistreCommun(produit);
  return { n: Math.max(ledger.max, commun.max, plancher) + 1, ledger, commun };
}

/** Réserve le prochain numéro libre chez un produit et l'inscrit à son `forge\ledger.jsonl`, par l'écrivain du produit, sous un verrou propre à la réservation.
 *  Depuis TF-1911 : le numéro se calcule aussi sur le registre commun du poste, où la réservation s'inscrit AVANT le ledger, sous le verrou de ce registre. */
export function reserverChezProduit({ produit, question, plancher = 0, racineParc, ecrivain = null }) {
  const q = controlerQuestion(question);
  if (!q.ok) throw new Error(q.raison);
  const w = ecrivain || ecrivainDeLedger(produit, racineParc);
  if (!w) throw new Error("écrivain du ledger introuvable : ni forge/ledger.py chez le produit, ni ledger.mjs de forge-agents sous la racine du parc (node bootstrap.mjs --pull dans le pilot)");
  const ledger = join(produit, "forge", "ledger.jsonl");
  if (!existsSync(ledger)) throw new Error(`ledger du produit introuvable (${ledger}) : un produit ouvre son run avant de poser une décision`);
  const g = dossierGitCommun(produit);
  const fichierCommun = g.ok ? join(g.dossier, REGISTRE_COMMUN_NOM) : null;
  const section = () => reserverSousVerrous({ produit, q, plancher, w, ledger, fichierCommun });
  // Le verrou du registre commun est pris EN PREMIER, celui du produit ensuite : toujours dans cet ordre, donc sans interblocage.
  const r = fichierCommun ? sousVerrou(fichierCommun + ".lock", section, VERROU_COMMUN) : section();
  return fichierCommun ? { ...r, registre_commun: fichierCommun } : { ...r, registre_commun: null, registre_commun_indisponible: g.raison };
}

function reserverSousVerrous({ produit, q, plancher, w, ledger, fichierCommun }) {
  // Verrou PROPRE à la réservation : ceux de `ledger.py` et de `ledger.mjs` (`<ledger>.lock`) sont pris par l'écrivain lui-même, dans la section qui suit.
  return sousVerrou(join(produit, "forge", "decisions.lock"), () => {
    const avant = numerosDuLedger(produit);
    const commun = fichierCommun ? lireRegistrePilot(fichierCommun) : { max: 0 };
    const n = Math.max(avant.max, commun.max, plancher) + 1;
    const id = "D-" + n;
    const decisions = { [id]: q.question };
    if (fichierCommun) {
      // Le registre commun d'abord : si l'écrivain du ledger refuse ensuite, le numéro reste pris (un trou n'est pas une erreur) ; l'inverse laisserait un numéro affiché et libre.
      const entree = { type: "decision", n, question: q.question, date: aujourdhui(), ts: new Date().toISOString(), session: session(null), arbre: resolve(produit), origine: "reservation" };
      const contenu = existsSync(fichierCommun) ? readFileSync(fichierCommun, "utf8") : "";
      appendFileSync(fichierCommun, (contenu && !contenu.endsWith("\n") ? "\n" : "") + JSON.stringify(entree) + "\n", "utf8");
    }
    let r;
    if (w.sorte === "python") {
      r = spawnSync("python", [w.chemin, "question_humain", "--decisions_posees", JSON.stringify(decisions), "--reservee_par", "reserver-decision.mjs"], { encoding: "utf8", env: { ...process.env, PYTHONUTF8: "1" }, cwd: produit });
    } else {
      const payload = join(dirname(ledger), `.reservation-${process.pid}.json`);
      writeFileSync(payload, JSON.stringify({ type: "question_humain", decisions_posees: decisions, reservee_par: "reserver-decision.mjs" }), "utf8");
      try { r = spawnSync(process.execPath, [w.chemin, "append", ledger, "--fichier", payload], { encoding: "utf8", cwd: produit }); }
      finally { try { unlinkSync(payload); } catch { /* déjà absent */ } }
    }
    if (r.status !== 0) throw new Error(`l'écrivain du ledger (${w.sorte}) a refusé l'inscription (exit ${r.status})${fichierCommun ? ` ; ${id} reste pris au registre commun du poste, un trou n'est pas une erreur` : ""} : ${(r.stderr || r.stdout || "").trim().slice(0, 300)}`);
    const apres = numerosDuLedger(produit);
    if (!apres.numeros.has(String(n))) throw new Error(`${id} n'apparaît pas au ledger après l'écriture : l'inscription n'est pas prouvée`);
    return { id, n, question: q.question, registre: ledger, ecrit_par: w.sorte === "python" ? "forge/ledger.py du produit" : "ledger.mjs de forge-agents" };
  });
}

/** Les numéros pris plusieurs fois pour des questions différentes (hors collisions déjà déclarées `collision: true`). */
export function doublonsDuRegistre(reg) {
  const par = new Map();
  // Une reformulation (même décision, libellé réécrit) n'est pas une seconde décision sous le même numéro.
  for (const e of reg.entrees.filter((x) => x.origine !== "reformulation")) { if (!par.has(e.n)) par.set(e.n, []); par.get(e.n).push(e); }
  const sorties = [];
  for (const [n, es] of par) if (es.length > 1 && es.some((e) => !e.collision)) sorties.push({ n, questions: es.map((e) => e.question) });
  return sorties;
}
