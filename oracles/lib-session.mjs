/**
 * lib-session.mjs — L'IDENTITÉ DE LA SESSION QUI ÉCRIT, PAR UNE SEULE SOURCE (D-218 (b) du 14/11/2026, item I1 du mandat
 * 20261114n, 15/11/2026).
 *
 * LE FAIT (RP-25, lot factory-digit-ai-fr 20261114u). D-218, réservée par la session du pilot `0e40d4f5`, porte au registre
 * `session: 74dc7ecb`, l'identifiant de la session de produit qui l'avait lancée. `lib-decisions.mjs` lisait
 * `process.env.CLAUDE_CODE_SESSION_ID`, et un processus enfant hérite de l'environnement de sa mère.
 *
 * LA SOURCE, dans cet ordre : la première qui répond l'emporte.
 *   1. `explicite` : l'identifiant que l'appelant passe (une option `--session`, un paramètre) — source « argument » ;
 *   2. dans un hook : `session_id` de l'entrée standard, que le harnais donne à chaque hook — source « hook » ;
 *   3. hors hook : `FORGE_SESSION_ID`, que le hook SessionStart de la session écrit au fichier `CLAUDE_ENV_FILE`. Le harnais rejoue
 *      ce fichier avant chaque commande Bash de la session : une session enfant qui joue ce hook pose son identifiant par-dessus
 *      celui qu'elle hérite de sa mère — source « session_start » ;
 *   4. à défaut : `CLAUDE_CODE_SESSION_ID`, qu'une session enfant hérite de sa mère — source « heritee_possible » ;
 *   5. rien : identifiant nul — source « inconnue ».
 *
 * La documentation, lue le 15/11/2026 (https://code.claude.com/docs/en/hooks, section « Persist environment variables ») : « SessionStart
 * hooks have access to the CLAUDE_ENV_FILE environment variable, which provides a file path where you can persist environment
 * variables for the shell commands Claude runs later in the session » ; « Each Bash command runs the file's contents as shell code
 * before the command itself ». Et : « CLAUDE_ENV_FILE is available for SessionStart, Setup, CwdChanged, and FileChanged hooks ».
 *
 * CE QUE CELA NE COUVRE PAS (dit, non tu) :
 *   · une session enfant dont le projet ne joue pas ce hook SessionStart hérite AUSSI `FORGE_SESSION_ID` de sa mère, et rien ne
 *     distingue cette valeur de la sienne : le hook est donc câblé chez les produits (gabarits/settings-produit.json) ET au pilot ;
 *   · un hook qui tourne sous PowerShell n'a pas `CLAUDE_ENV_FILE` (même page) ; une commande PowerShell ne reçoit la variable que
 *     si tout le fichier est fait d'affectations simples (Claude Code 2.1.296 ou plus) : sinon, la source retombe en 4 ;
 *   · un sous-agent porte l'identité de sa session, et c'est voulu : il travaille pour elle. Mesuré le 15/11/2026 : le shell d'un
 *     agent `constructeur` voit `CLAUDE_CODE_SESSION_ID` de sa session, et sa transcription porte le même `sessionId`.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";

/** La variable que le hook SessionStart pose au fichier `CLAUDE_ENV_FILE` : le même nom à l'écriture et à la lecture, Python compris. */
export const VARIABLE_SESSION = "FORGE_SESSION_ID";

/** Les sources, de la plus sûre à la moins sûre. */
export const SOURCES = Object.freeze({
  ARGUMENT: "argument",
  HOOK: "hook",
  SESSION_START: "session_start",
  HERITEE: "heritee_possible",
  INCONNUE: "inconnue",
});

const texte = (v) => (v === undefined || v === null ? "" : String(v).trim());

/** Les 8 premiers caractères d'un identifiant de session, ou null. */
export const court = (id) => (texte(id) ? texte(id).slice(0, 8) : null);

/**
 * La session courante : { id, court, source }. `entree` est l'entrée standard d'un hook, déjà lue ; `env` l'environnement
 * (injectable pour les essais) ; `explicite` un identifiant donné par l'appelant.
 */
export function sessionCourante({ entree = null, env = process.env, explicite = null } = {}) {
  const candidats = [
    [explicite, SOURCES.ARGUMENT],
    [entree && typeof entree === "object" ? entree.session_id : null, SOURCES.HOOK],
    [env?.[VARIABLE_SESSION], SOURCES.SESSION_START],
    [env?.CLAUDE_CODE_SESSION_ID, SOURCES.HERITEE],
  ];
  for (const [valeur, source] of candidats) {
    const id = texte(valeur);
    if (id) return { id, court: id.slice(0, 8), source };
  }
  return { id: null, court: null, source: SOURCES.INCONNUE };
}

/** Les champs de signature d'une ligne de registre ou de journal : { session (8 caractères), session_source }. */
export function signature(options = {}) {
  const s = sessionCourante(options);
  return { session: s.court, session_source: s.source };
}

/** Un identifiant que la ligne `export` porte sans guillemets : le harnais la rejoue comme du code shell, et PowerShell n'en lit que les affectations simples. */
export const ID_POSABLE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;

/** La ligne écrite au fichier `CLAUDE_ENV_FILE`. */
export const ligneVariable = (id) => `export ${VARIABLE_SESSION}=${id}`;

/**
 * Pose l'identifiant de la session au fichier `CLAUDE_ENV_FILE` (hook SessionStart), en AJOUT : d'autres hooks y écrivent, et la
 * dernière affectation l'emporte quand le harnais rejoue le fichier. Rend { pose, fichier } ou { pose: false, raison }.
 */
export function poserVariable(id, env = process.env) {
  const fichier = texte(env?.CLAUDE_ENV_FILE);
  if (!fichier) return { pose: false, raison: "CLAUDE_ENV_FILE absent : hook hors SessionStart, ou hook joué sous PowerShell" };
  const valeur = texte(id);
  if (!ID_POSABLE.test(valeur)) return { pose: false, raison: `identifiant de session non posable sans guillemets : « ${valeur.slice(0, 40)} »` };
  let avant = "";
  try { if (existsSync(fichier)) avant = readFileSync(fichier, "utf8"); } catch { /* illisible : l'ajout dira lui-même s'il échoue */ }
  appendFileSync(fichier, (avant && !avant.endsWith("\n") ? "\n" : "") + ligneVariable(valeur) + "\n", "utf8");
  return { pose: true, fichier };
}
