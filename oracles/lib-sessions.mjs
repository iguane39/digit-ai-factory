/**
 * lib-sessions.mjs — LE REGISTRE DES SESSIONS D'UN PRODUIT : QUI EST LÀ, QUI COORDONNE, QUI TIENT QUEL FICHIER (D-218 (b) du 14/11/2026,
 * item I2 du mandat 20261114n ; étude 20261114c, option O2, corrigée par le mandat).
 *
 * LE FAIT (diagnostic 20261114b) : le 14/11/2026, cinq sessions travaillaient sur le même produit sans se voir, et trois écrivaient
 * dans les mêmes fichiers (ledger, mobilisation, README) ; l'indice 20261114g a été porté par deux livrables de radical distinct.
 *
 * LE REGISTRE. `forge/sessions.jsonl` du produit, ajouté jamais réécrit, une ligne par événement (schéma `pilot/sessions@1`) :
 *   · `open`       : { session, ts, racine, poste, transcription } — la session s'inscrit (hook SessionStart) ;
 *   · `objet`      : { session, ts, objet } — les 200 premiers caractères de la première demande humaine (premier UserPromptSubmit) ;
 *   · `revendique` : { session, ts, chemin } — un chemin relatif à la racine, à sa première écriture (PostToolUse). Avec
 *                    `role: "coordinatrice"` et sans chemin, la session se déclare coordinatrice ; avec `role: "coordinatrice"`, un
 *                    chemin et `pour`, la coordinatrice revendique un fichier commun pour une session nommée ;
 *   · `libere`     : { session, ts, chemin } — le chemin rendu (SessionEnd) ;
 *   · `vie`        : { session, ts } — preuve de vie (Stop, au plus une fois toutes les 5 minutes) ;
 *   · `close`      : { session, ts, raison } — fin de session (SessionEnd) ;
 *   · `expire`     : { session, ts, cible } — `session` constate que `cible` a disparu.
 * Il est écrit dans l'arbre PRINCIPAL du dépôt et lu dans tous les arbres de travail liés, comme `forge/gestes-en-cours.jsonl`. Il ne
 * se commite jamais (motif du `.gitignore` socle, clé `journaux_de_hooks` de gabarits/HERITAGE.json). Chaque écriture passe par
 * `sousVerrou` (lib-decisions.mjs) : lecture, décision et ajout dans la même section. C'est l'idée reprise des équipes d'agents,
 * où une tâche se réclame sous verrou.
 *
 * LA VIE. La preuve de vie d'une session est son dernier événement, ou la date de modification de sa transcription (ou de celle d'un
 * de ses sous-agents, rangée sous `<transcription>/subagents/`) quand elle est plus récente. Une session est expirée 15 minutes après
 * sa dernière preuve de vie, fermée par `close`. Un `expire` posé par une autre session vaut tant que la session expirée n'a pas
 * donné de preuve de vie postérieure.
 *
 * L'ÉLECTION. La coordinatrice est la session vivante dont l'`open` est le plus ancien, comparé à la seconde, puis l'identifiant de
 * session le plus petit dans l'ordre lexical. Les quatre cas du mandat en découlent. 1. Première : la plus ancienne session non
 * expirée. 2. Passation : la coordinatrice ferme, la suivante par ancienneté prend le rôle. 3. Disparition : la première session qui
 * constate l'expiration de la coordinatrice la déclare (`expire`), la suivante prend le rôle. 4. Double revendication : la date
 * d'`open` la plus ancienne prime, puis l'identifiant. Une session élue sans revendication du rôle en cours l'écrit ; l'autre se range.
 *
 * CE QUE CE MODULE NE FAIT PAS. Il ne bloque rien : il avertit. Il ne voit pas une session d'un autre poste, ni une écriture faite par
 * une commande shell (seuls Write, Edit et MultiEdit revendiquent). Une session tuée sans SessionEnd reste comptée vivante jusqu'à
 * son expiration. Il ne décide rien qui relève du porteur (R-58) : la coordinatrice annonce l'état et sérialise les fichiers communs.
 */
import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, readSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { hostname } from "node:os";
import { spawnSync } from "node:child_process";
import { sousVerrou } from "./lib-decisions.mjs";
import { court } from "./lib-session.mjs";

export const FICHIER_SESSIONS = "forge/sessions.jsonl";
export const SCHEMA = "pilot/sessions@1";
export const EVENEMENTS = Object.freeze(["open", "objet", "revendique", "libere", "vie", "close", "expire"]);
export const EXPIRATION_MIN = 15;
export const VIE_INTERVALLE_MIN = 5;
export const OBJET_MAX = 200;
export const ROLE_COORDINATRICE = "coordinatrice";
/** Verrou court : la section dure quelques millisecondes, et un hook rend la main en moins de 300 ms. Au-delà de 200 ms d'attente,
 *  la panne se déclare et rien n'est bloqué ; un verrou de plus de 5 s est celui d'un processus mort. */
export const VERROU_SESSIONS = Object.freeze({ essais: 20, pauseMs: 10, perimeMs: 5000 });
const MIN = 60_000;
const WINDOWS = process.platform === "win32";

/** Une panne de lecture ou d'écriture du registre : elle ne bloque jamais une session, elle se déclare. */
export class PanneRegistre extends Error {}

// ---- LES RACINES -------------------------------------------------------------------------------------------------------------------
const egal = (a, b) => (WINDOWS ? resolve(a).toLowerCase() === resolve(b).toLowerCase() : resolve(a) === resolve(b));

/** L'arbre principal du dépôt qui porte `base` (le même dossier hors arbre de travail lié). Lit le fichier `.git` d'un arbre lié
 *  (« gitdir: … », puis `commondir`) sans lancer git, qui coûte un processus ; git tranche si la forme est inattendue. */
export function arbrePrincipal(base) {
  const dotgit = join(base, ".git");
  let st; try { st = statSync(dotgit); } catch { return base; }
  if (st.isDirectory()) return base;
  try {
    const gitdir = resolve(base, (/^gitdir:\s*(.+)$/m.exec(readFileSync(dotgit, "utf8")) || [])[1].trim());
    const commun = resolve(gitdir, readFileSync(join(gitdir, "commondir"), "utf8").trim());
    if (basename(commun) === ".git") return dirname(commun);
  } catch { /* forme inattendue : git tranche */ }
  const r = spawnSync("git", ["-C", base, "rev-parse", "--git-common-dir"], { encoding: "utf8", timeout: 3000 });
  const commun = r.status === 0 ? resolve(base, String(r.stdout).trim()) : null;
  return commun && basename(commun) === ".git" ? dirname(commun) : base;
}

/** La racine de la session : `CLAUDE_PROJECT_DIR`, que le harnais pose aux hooks, sinon le premier dossier qui porte `forge/`,
 *  `.claude/` ou `.git` en remontant depuis `depart`. */
export function racineDeSession({ depart = process.cwd(), env = process.env } = {}) {
  if (env?.CLAUDE_PROJECT_DIR) return resolve(env.CLAUDE_PROJECT_DIR);
  const d0 = resolve(depart);
  for (let d = d0; ; d = dirname(d)) {
    if (existsSync(join(d, "forge")) || existsSync(join(d, ".claude")) || existsSync(join(d, ".git"))) return d;
    if (dirname(d) === d) return d0;
  }
}

/** Le registre de la racine `base` : { base, principal, racines, ecriture, fichier }. `fichier` est null hors d'un produit (aucun
 *  dossier `forge/`) : le pilot, qui n'en a pas, n'a pas de registre. */
export function registreDe(base) {
  const b = resolve(base);
  const principal = arbrePrincipal(b);
  const racines = egal(principal, b) ? [b] : [b, principal];
  const ecriture = existsSync(join(principal, "forge")) ? principal : existsSync(join(b, "forge")) ? b : null;
  return { base: b, principal, racines, ecriture, fichier: ecriture ? join(ecriture, ...FICHIER_SESSIONS.split("/")) : null };
}

// ---- LES CHEMINS -------------------------------------------------------------------------------------------------------------------
/** Le chemin d'un fichier écrit, relatif à la racine de la session (ou à l'arbre principal), en barres obliques ; null hors des deux. */
export function cheminRelatif(fichier, racines) {
  if (!fichier) return null;
  for (const r of racines) {
    const rel = relative(r, resolve(String(fichier)));
    if (rel && !rel.startsWith("..") && !isAbsolute(rel)) return rel.split(sep).join("/");
  }
  return null;
}
/** La clé de comparaison d'un chemin : sans casse sous Windows, dont le système de fichiers l'ignore. */
export const cleDeChemin = (c) => (WINDOWS ? String(c).replaceAll("\\", "/").toLowerCase() : String(c).replaceAll("\\", "/"));

// ---- LA LECTURE ----------------------------------------------------------------------------------------------------------------------
/** Les lignes lisibles du registre aux racines données : { lignes, illisibles, fichiers }. Une ligne complète illisible est comptée ;
 *  la dernière ligne sans saut de ligne final est peut-être en cours d'écriture : ignorée sans être comptée. Un fichier illisible lève
 *  `PanneRegistre`. */
export function lireRegistre(racines) {
  const lignes = [], fichiers = [];
  let illisibles = 0;
  const vus = new Set();
  for (const r of racines) {
    const chemin = join(r, ...FICHIER_SESSIONS.split("/"));
    const cle = WINDOWS ? chemin.toLowerCase() : chemin;
    if (vus.has(cle)) continue;
    vus.add(cle);
    if (!existsSync(chemin)) continue;
    let brut;
    try { brut = readFileSync(chemin, "utf8"); } catch (e) { throw new PanneRegistre(`${chemin} illisible (${e.code || e.message})`); }
    fichiers.push(chemin);
    const morceaux = brut.split("\n");
    morceaux.forEach((l, i) => {
      const t = l.trim();
      if (!t) return;
      let o = null;
      try { o = JSON.parse(t); } catch { /* illisible */ }
      if (o && typeof o === "object" && !Array.isArray(o) && typeof o.ev === "string" && typeof o.session === "string" && o.session) lignes.push(o);
      else if (i < morceaux.length - 1) illisibles++;
    });
  }
  return { lignes, illisibles, fichiers };
}

// ---- LES LIGNES --------------------------------------------------------------------------------------------------------------------
const ligne = (ev, session, maintenant, champs = {}) => ({ schema: SCHEMA, ev, session, ts: new Date(maintenant).toISOString(), ...champs });
/** Les 200 premiers caractères d'une demande, espaces resserrés. */
export const resumerObjet = (texte) => String(texte ?? "").replace(/\s+/g, " ").trim().slice(0, OBJET_MAX);
export const ligneOpen = ({ session, racine, transcription = null }, m = Date.now()) => ligne("open", session, m, { racine, poste: hostname(), transcription });
export const ligneObjet = ({ session, objet }, m = Date.now()) => ligne("objet", session, m, { objet: resumerObjet(objet) });
export const ligneRevendique = ({ session, chemin = null, role = null, pour = null, origine = null }, m = Date.now()) =>
  ligne("revendique", session, m, { ...(chemin ? { chemin } : {}), ...(role ? { role } : {}), ...(pour ? { pour } : {}), ...(origine ? { origine } : {}) });
export const ligneLibere = ({ session, chemin, pour = null }, m = Date.now()) => ligne("libere", session, m, { chemin, ...(pour ? { pour } : {}) });
export const ligneVie = ({ session }, m = Date.now()) => ligne("vie", session, m);
export const ligneClose = ({ session, raison = null }, m = Date.now()) => ligne("close", session, m, { raison });
export const ligneExpire = ({ session, cible }, m = Date.now()) => ligne("expire", session, m, { cible });

// ---- L'ÉCRITURE SOUS VERROU ----------------------------------------------------------------------------------------------------------
const finitParSaut = (fichier) => {
  let fd;
  try {
    const taille = statSync(fichier).size;
    if (!taille) return true;
    fd = openSync(fichier, "r");
    const b = Buffer.alloc(1);
    readSync(fd, b, 0, 1, taille - 1);
    return b[0] === 0x0a;
  } catch { return true; } finally { if (fd !== undefined) try { closeSync(fd); } catch { /* fermé */ } }
};

/**
 * La section verrouillée du registre : relit le registre, appelle `decider(lu)`, qui rend les lignes à écrire, et les ajoute en une
 * écriture. Rend { ecrites, lu } ; rien hors d'un produit. Un verrou non obtenu ou une écriture refusée lève `PanneRegistre`.
 */
export function sousVerrouDuRegistre(reg, decider, { verrou = VERROU_SESSIONS } = {}) {
  if (!reg?.fichier) return { ecrites: [], lu: null };
  try {
    return sousVerrou(reg.fichier + ".lock", () => {
      const lu = lireRegistre(reg.racines);
      const ecrites = (decider(lu) || []).filter(Boolean);
      if (ecrites.length) {
        mkdirSync(dirname(reg.fichier), { recursive: true });
        const prefixe = existsSync(reg.fichier) && !finitParSaut(reg.fichier) ? "\n" : "";
        appendFileSync(reg.fichier, prefixe + ecrites.map((l) => JSON.stringify(l)).join("\n") + "\n", "utf8");
      }
      return { ecrites, lu };
    }, verrou);
  } catch (e) {
    if (e instanceof PanneRegistre) throw e;
    throw new PanneRegistre(`registre ${reg.fichier} non écrit : ${e.message}`);
  }
}

// ---- L'ÉTAT : VIE, ÉLECTION, REVENDICATIONS ----------------------------------------------------------------------------------------
/** La dernière écriture de la transcription d'une session ou de celle d'un de ses sous-agents ; 0 si rien ne se lit. */
export function vieDeTranscription(transcription) {
  if (!transcription) return 0;
  let t = 0;
  try { t = statSync(transcription).mtimeMs; } catch { /* absente */ }
  const sous = join(String(transcription).replace(/\.jsonl$/i, ""), "subagents");
  let fichiers = [];
  try { fichiers = readdirSync(sous); } catch { /* aucun sous-agent */ }
  for (const f of fichiers) if (f.endsWith(".jsonl")) { try { t = Math.max(t, statSync(join(sous, f)).mtimeMs); } catch { /* disparu */ } }
  return t;
}

const parAnciennete = (a, b) => (Math.floor(a.open.t / 1000) - Math.floor(b.open.t / 1000)) || (a.session < b.session ? -1 : a.session > b.session ? 1 : 0);

/**
 * L'état du registre à `maintenant` : { sessions: Map<id, fiche>, vivantes: [fiche], coordinatrice, conflits, revendicationsRole }.
 * Une fiche : { session, open, objet, derniere, vie, fermee, close, expiree, vivante, tient: Map<clé, revendication> }. `vieDe` lit la
 * dernière écriture d'une transcription (injectable pour les essais).
 */
export function etatDesSessions(lignes, { maintenant = Date.now(), vieDe = vieDeTranscription } = {}) {
  const fiches = new Map();
  const fiche = (id) => {
    let f = fiches.get(id);
    if (!f) { f = { session: id, open: null, objet: null, objetLe: 0, derniere: 0, fermee: false, close: null, tient: new Map(), roleLe: 0, expireLe: 0 }; fiches.set(id, f); }
    return f;
  };
  const revendicationsRole = [];
  for (const l of lignes) {
    const t = Date.parse(l.ts);
    if (!Number.isFinite(t)) continue;
    const s = fiche(l.session);
    s.derniere = Math.max(s.derniere, t);
    if (l.ev === "open") { s.open = { ts: l.ts, t, racine: l.racine ?? null, poste: l.poste ?? null, transcription: l.transcription ?? null }; s.fermee = false; s.close = null; }
    else if (l.ev === "objet") { s.objet = l.objet ?? null; s.objetLe = t; }
    else if (l.ev === "revendique") {
      if (!l.chemin && l.role === ROLE_COORDINATRICE) { s.roleLe = t; revendicationsRole.push({ session: l.session, t }); }
      else if (l.chemin) {
        const titulaire = l.role === ROLE_COORDINATRICE && l.pour ? fiche(String(l.pour)) : s;
        titulaire.tient.set(cleDeChemin(l.chemin), { chemin: l.chemin, ts: l.ts, t, par: l.session, ...(l.origine ? { origine: l.origine } : {}) });
      }
    } else if (l.ev === "libere" && l.chemin) (l.pour ? fiche(String(l.pour)) : s).tient.delete(cleDeChemin(l.chemin));
    else if (l.ev === "close") { s.fermee = true; s.close = { ts: l.ts, t, raison: l.raison ?? null }; }
    else if (l.ev === "expire" && l.cible) { const c = fiche(String(l.cible)); c.expireLe = Math.max(c.expireLe, t); }
  }
  for (const s of fiches.values()) {
    s.vie = Math.max(s.derniere, vieDe(s.open?.transcription));
    s.declaree = s.expireLe > 0 && s.expireLe >= s.vie;
    s.expiree = !s.fermee && (maintenant - s.vie >= EXPIRATION_MIN * MIN || s.declaree);
    s.vivante = !s.fermee && !s.expiree;
  }
  const vivantes = [...fiches.values()].filter((s) => s.vivante);
  const eligibles = vivantes.filter((s) => s.open).sort(parAnciennete);
  const coordinatrice = eligibles[0]?.session ?? null;
  const parChemin = new Map();
  for (const s of vivantes) for (const [cle, r] of s.tient) {
    if (!parChemin.has(cle)) parChemin.set(cle, { chemin: r.chemin, sessions: [] });
    parChemin.get(cle).sessions.push(s.session);
  }
  const conflits = [...parChemin.values()].filter((c) => c.sessions.length > 1);
  return { sessions: fiches, vivantes: [...eligibles, ...vivantes.filter((s) => !s.open)], coordinatrice, conflits, revendicationsRole, maintenant };
}

/** Les sessions que `session` constate expirées et que personne n'a déclarées depuis leur dernière preuve de vie. */
export function expirationsAConstater(etat, session) {
  return [...etat.sessions.values()]
    .filter((s) => s.session !== session && s.expiree && !s.declaree && (s.open || s.tient.size))
    .map((s) => s.session);
}

/** `session` doit-elle écrire sa revendication du rôle ? Oui quand elle est élue et qu'aucune revendication d'elle ne tient : aucune
 *  depuis son `open`, ou une autre session a revendiqué le rôle après elle (double revendication : l'élue réaffirme, l'autre se range). */
export function doitRevendiquerLeRole(etat, session) {
  if (!session || etat.coordinatrice !== session) return false;
  const s = etat.sessions.get(session);
  if (!s?.roleLe || (s.open && s.roleLe < s.open.t)) return true;
  return etat.revendicationsRole.some((r) => r.session !== session && r.t > s.roleLe);
}

/** Les AUTRES sessions vivantes qui tiennent ce chemin. */
export function tenantsAutres(etat, chemin, session) {
  const cle = cleDeChemin(chemin);
  return etat.vivantes.filter((s) => s.session !== session && s.tient.has(cle));
}

/** La session tient-elle déjà ce chemin ? */
export const tientDeja = (etat, chemin, session) => !!etat.sessions.get(session)?.tient.has(cleDeChemin(chemin));

/** La session vivante que désigne `id`, entier ou abrégé (8 caractères suffisent) ; null si aucune ou plusieurs. */
export function sessionDesignee(etat, id) {
  const v = String(id ?? "").trim();
  if (!v) return null;
  const exacte = etat.sessions.get(v);
  if (exacte) return exacte;
  const prefixe = [...etat.sessions.values()].filter((s) => s.session.startsWith(v));
  return prefixe.length === 1 ? prefixe[0] : null;
}

/**
 * Le pouvoir d'écriture de la coordinatrice, et le seul : revendiquer un fichier commun pour une session nommée. Rend { lignes } ou
 * { refus }. Refusé quand `session` n'est pas la coordinatrice élue, quand la session nommée n'est pas vivante, ou quand une AUTRE
 * session vivante tient déjà le chemin : la coordinatrice n'écrit pas dans le chemin d'une autre session vivante. Un chemin que la
 * coordinatrice tenait elle-même passe à la session nommée (sa propre revendication est libérée).
 */
export function revendicationPour(etat, { session, chemin, pour }, maintenant = Date.now()) {
  if (!session || etat.coordinatrice !== session) {
    return { refus: `seule la coordinatrice revendique un fichier pour une autre session ; elle est ${etat.coordinatrice ? court(etat.coordinatrice) : "absente du registre"}, et cette session est ${court(session) || "non identifiée"}` };
  }
  const cible = sessionDesignee(etat, pour);
  if (!cible?.vivante) return { refus: `la session ${String(pour ?? "").slice(0, 40)} n'est pas une session vivante du registre (identifiant entier, ou ses 8 premiers caractères)` };
  const autres = tenantsAutres(etat, chemin, cible.session).filter((s) => s.session !== session);
  if (autres.length) return { refus: `${chemin} est tenu par la session vivante ${autres.map((s) => court(s.session)).join(", ")} : la coordinatrice n'écrit pas dans le chemin d'une autre session vivante` };
  const lignes = [ligneRevendique({ session, chemin, role: ROLE_COORDINATRICE, pour: cible.session }, maintenant)];
  if (tientDeja(etat, chemin, session) && cible.session !== session) lignes.push(ligneLibere({ session, chemin }, maintenant));
  return { lignes, pour: cible.session };
}

// ---- CE QUE VOIT UNE SESSION -------------------------------------------------------------------------------------------------------
const heure = (t) => { const d = new Date(t); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
const borne = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const objetCourt = (s, n = 70) => (s?.objet ? `« ${borne(s.objet, n)} »` : "objet non déclaré");

/** Les lignes de contexte d'un tour (UserPromptSubmit), 3 au plus : qui coordonne, les sessions vivantes et leur objet, les conflits.
 *  Une session seule n'en reçoit aucune. */
export function lignesDeContexte(etat, session) {
  const autres = etat.vivantes.filter((s) => s.session !== session);
  if (!autres.length) return [];
  const nom = (id) => (id === session ? `${court(id)} (cette session)` : court(id));
  const coord = etat.coordinatrice ? etat.sessions.get(etat.coordinatrice) : null;
  const sortie = [borne(`Sessions du produit (forge/sessions.jsonl, D-218 (b)) — coordinatrice : ${coord ? `${nom(coord.session)}${coord.session === session ? "" : ` ${objetCourt(coord, 60)}`}` : "aucune"} ; avertissement seulement, le porteur prime.`, 400)];
  const vues = etat.vivantes.slice(0, 6).map((s) => `${nom(s.session)} ${objetCourt(s, 50)}${s.open ? ` depuis ${heure(s.open.t)}` : ""}`);
  const reste = etat.vivantes.length - vues.length;
  sortie.push(borne(`Vivantes (${etat.vivantes.length}) : ${vues.join(" ; ")}${reste > 0 ? ` ; +${reste} autre(s)` : ""}.`, 500));
  if (etat.conflits.length) {
    const c = etat.conflits.slice(0, 4).map((x) => `${x.chemin} tenu par ${x.sessions.map(nom).join(" et ")}`);
    sortie.push(borne(`Conflits : ${c.join(" ; ")}${etat.conflits.length > 4 ? ` ; +${etat.conflits.length - 4} autre(s)` : ""}. Écrire un chemin tenu se signale au porteur.`, 500));
  }
  return sortie;
}

/** L'avertissement d'une écriture sur un chemin que d'autres sessions vivantes tiennent (PreToolUse). Texte vide sinon. */
export function avertissementChemin(tenants, chemin, { maintenant = Date.now(), racine = null, commande = null } = {}) {
  if (!tenants.length) return "";
  const qui = tenants.map((s) => {
    const il = Math.max(0, Math.round((maintenant - s.vie) / MIN));
    const ailleurs = s.open?.racine && racine && !egal(s.open.racine, racine) ? `, arbre ${s.open.racine}` : "";
    return `la session ${court(s.session)} (${objetCourt(s)}, dernière preuve de vie il y a ${il} min${ailleurs})`;
  });
  return `CHEMIN REVENDIQUÉ (D-218 (b)) — ${chemin} est tenu par ${qui.join(" et ")}. Avertissement, rien n'est bloqué. Si le porteur `
    + "t'a demandé cette écriture, fais-la et signale-lui le conflit ; sinon, laisse ce fichier à cette session ou écris ailleurs."
    + (commande ? ` État des sessions : ${commande}` : "");
}
