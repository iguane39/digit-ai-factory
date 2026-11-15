#!/usr/bin/env node
/**
 * hook-sessions.mjs — LE REGISTRE DES SESSIONS D'UN PRODUIT, TENU PAR SES HOOKS (D-218 (b) du 14/11/2026, items I1 et I3 du mandat
 * 20261114n, 15/11/2026). Une seule commande pour six événements ; l'événement se lit au champ `hook_event_name` de l'entrée standard.
 *
 *   SessionStart     : pose `FORGE_SESSION_ID` au fichier `CLAUDE_ENV_FILE` (l'identité que lit `lib-session.mjs` hors hook), puis écrit
 *                      `open` (ou `vie` pour une session déjà inscrite : reprise, compaction) ;
 *   UserPromptSubmit : au premier tour, écrit `objet` ; à chaque tour, met au contexte 3 lignes au plus — qui coordonne, les sessions
 *                      vivantes et leur objet, les conflits sur les chemins revendiqués ;
 *   PreToolUse       : (Write, Edit, MultiEdit) un chemin tenu par une autre session vivante part avec un avertissement qui la nomme ;
 *   PostToolUse      : (Write, Edit, MultiEdit) revendique le chemin écrit, si la session ne le tient pas déjà ;
 *   Stop             : écrit `vie`, au plus une fois toutes les 5 minutes ;
 *   SessionEnd       : libère les chemins de la session, puis écrit `close`.
 * SessionStart et UserPromptSubmit constatent aussi les sessions disparues (`expire`) et, pour la session élue coordinatrice, écrivent
 * sa revendication du rôle quand elle n'en a pas (lib-sessions.mjs, l'élection).
 *
 * TROIS RÈGLES DE CONDUITE. Aucun refus : jamais de code de sortie 2, c'est l'option (b) de D-218 ; le blocage (option (c)) ne se décide
 * qu'à la revue du 01/12/2026. Une session seule ne voit rien : aucune ligne de contexte tant qu'aucune autre session n'est vivante. Un
 * registre illisible ne bloque jamais une session : la panne se déclare une fois par session (témoin sous le dossier temporaire du
 * poste), au contexte d'un événement qui en a un, et le hook sort en 0.
 *
 * Usage (hook)          : node forge/hooks/factory.mjs sessions
 * Usage (coordinatrice) : node forge/hooks/factory.mjs sessions --revendiquer <chemin> --pour <session> [--session <id>]
 *                         le seul pouvoir d'écriture de la coordinatrice : un fichier commun revendiqué pour une session nommée.
 * Hors d'un produit (aucun dossier forge/, le pilot), seule l'identité se pose : il n'y a pas de registre.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { SOURCES, court, poserVariable, sessionCourante } from "./lib-session.mjs";
import {
  PanneRegistre, VIE_INTERVALLE_MIN, avertissementChemin, cheminRelatif, doitRevendiquerLeRole, etatDesSessions, expirationsAConstater,
  ligneClose, ligneExpire, ligneLibere, ligneObjet, ligneOpen, ligneRevendique, ligneVie, lignesDeContexte, lireRegistre, racineDeSession,
  registreDe, revendicationPour, ROLE_COORDINATRICE, sousVerrouDuRegistre, tenantsAutres, tientDeja, vieDeTranscription,
} from "./lib-sessions.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(ICI, "..");
const MIN = 60_000;
/** Les événements qui portent un contexte vers la session : Stop en a un, mais il relancerait le tour ; SessionEnd n'en a pas. */
const AVEC_CONTEXTE = new Set(["SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse"]);
const OUTILS_ECRITURE = new Set(["Write", "Edit", "MultiEdit"]);
/** Un tour que Claude Code ouvre lui-même n'est pas la demande humaine qui fait l'objet de la session. */
const TOUR_AUTOMATIQUE = /^\s*<(?:task-notification|cross-session-message|system-reminder)\b/;

/** La commande qui montre l'état des sessions au porteur (scripts/sessions-actives.mjs, item I5). */
export const commandeEtat = (racine) => `node "${join(PILOT, "scripts", "sessions-actives.mjs")}" --produit "${racine}"`;

/** Après les lignes propres à l'événement : les sessions disparues constatées, puis la revendication du rôle si la session est élue. */
function completer(lignes, propres, session, maintenant, vieDe) {
  const etat = etatDesSessions([...lignes, ...propres], { maintenant, vieDe });
  const expires = expirationsAConstater(etat, session).map((cible) => ligneExpire({ session, cible }, maintenant));
  const apres = etatDesSessions([...lignes, ...propres, ...expires], { maintenant, vieDe });
  const role = doitRevendiquerLeRole(apres, session) ? [ligneRevendique({ session, role: ROLE_COORDINATRICE }, maintenant)] : [];
  return [...propres, ...expires, ...role];
}

/** La ligne d'inscription, quand la session n'est pas inscrite (hook câblé en cours de session, SessionStart perdu) ou a été fermée. */
const inscription = (etat, session, base, entree, maintenant) => {
  const f = etat.sessions.get(session);
  return !f?.open || f.fermee ? [ligneOpen({ session, racine: base, transcription: entree?.transcript_path ?? null }, maintenant)] : [];
};

/**
 * Traite une entrée de hook. Rend { evenement, session, contexte, ecrites, variable, illisibles, hors_produit }. Lève `PanneRegistre`
 * quand le registre ne se lit ou ne s'écrit pas : l'appelant la déclare, rien n'est bloqué.
 */
export function traiter(entree, { env = process.env, maintenant = Date.now(), vieDe = vieDeTranscription } = {}) {
  const evenement = entree?.hook_event_name ?? null;
  // Dans un hook, l'identité est celle de l'entrée standard, et seulement elle : une variable d'environnement peut venir d'une session
  // mère (RP-25), et la poser au fichier ou l'inscrire au registre referait le défaut que l'item I1 corrige.
  const s = sessionCourante({ entree, env });
  const session = s.source === SOURCES.HOOK ? s.id : null;
  const r = { evenement, session, contexte: null, ecrites: 0, variable: null, illisibles: 0, hors_produit: false };
  if (evenement === "SessionStart" && session) r.variable = poserVariable(session, env);
  if (!session) return r;
  const base = racineDeSession({ depart: entree?.cwd || process.cwd(), env });
  const reg = registreDe(base);
  if (!reg.fichier) { r.hors_produit = true; return r; }
  const ecrire = (decider) => {
    const { ecrites, lu } = sousVerrouDuRegistre(reg, decider);
    r.ecrites += ecrites.length;
    r.illisibles = Math.max(r.illisibles, lu?.illisibles || 0);
    return { ecrites, lu };
  };

  if (evenement === "SessionStart") {
    ecrire((lu) => {
      const etat = etatDesSessions(lu.lignes, { maintenant, vieDe });
      const propres = inscription(etat, session, base, entree, maintenant);
      return completer(lu.lignes, propres.length ? propres : [ligneVie({ session }, maintenant)], session, maintenant, vieDe);
    });
    return r;
  }

  if (evenement === "UserPromptSubmit") {
    const { ecrites, lu } = ecrire((lu) => {
      const etat = etatDesSessions(lu.lignes, { maintenant, vieDe });
      const propres = inscription(etat, session, base, entree, maintenant);
      const f = etat.sessions.get(session);
      const objetPose = !propres.length && f?.objet && f.objetLe >= (f.open?.t ?? 0);
      const prompt = String(entree?.prompt ?? "");
      if (!objetPose && prompt.trim() && !TOUR_AUTOMATIQUE.test(prompt)) propres.push(ligneObjet({ session, objet: prompt }, maintenant));
      return completer(lu.lignes, propres, session, maintenant, vieDe);
    });
    const etat = etatDesSessions([...(lu?.lignes || []), ...ecrites], { maintenant, vieDe });
    const lignes = lignesDeContexte(etat, session);
    if (lignes.length) r.contexte = lignes.join("\n");
    return r;
  }

  if (evenement === "PreToolUse" || evenement === "PostToolUse") {
    if (!OUTILS_ECRITURE.has(entree?.tool_name)) return r;
    const chemin = cheminRelatif(entree?.tool_input?.file_path, reg.racines);
    if (!chemin) return r;
    if (evenement === "PreToolUse") {
      const lu = lireRegistre(reg.racines);
      r.illisibles = lu.illisibles;
      const etat = etatDesSessions(lu.lignes, { maintenant, vieDe });
      const texte = avertissementChemin(tenantsAutres(etat, chemin, session), chemin, { maintenant, racine: base, commande: commandeEtat(reg.principal) });
      if (texte) r.contexte = texte;
      return r;
    }
    const rep = entree?.tool_response;
    if (rep && typeof rep === "object" && (rep.is_error === true || rep.isError === true || rep.interrupted === true)) return r;
    ecrire((lu) => {
      const etat = etatDesSessions(lu.lignes, { maintenant, vieDe });
      const propres = inscription(etat, session, base, entree, maintenant);
      if (!tientDeja(etat, chemin, session)) propres.push(ligneRevendique({ session, chemin }, maintenant));
      return propres;
    });
    return r;
  }

  if (evenement === "Stop") {
    // Lecture sans verrou d'abord : la plupart des fins de tour n'ont rien à écrire, et ne prennent pas le verrou.
    const lu0 = lireRegistre(reg.racines);
    r.illisibles = lu0.illisibles;
    const f0 = etatDesSessions(lu0.lignes, { maintenant, vieDe }).sessions.get(session);
    if (f0?.open && !f0.fermee && maintenant - f0.derniere < VIE_INTERVALLE_MIN * MIN) return r;
    ecrire((lu) => {
      const etat = etatDesSessions(lu.lignes, { maintenant, vieDe });
      const propres = inscription(etat, session, base, entree, maintenant);
      const f = etat.sessions.get(session);
      if (!propres.length && maintenant - (f?.derniere || 0) >= VIE_INTERVALLE_MIN * MIN) propres.push(ligneVie({ session }, maintenant));
      return propres;
    });
    return r;
  }

  if (evenement === "SessionEnd") {
    ecrire((lu) => {
      const f = etatDesSessions(lu.lignes, { maintenant, vieDe }).sessions.get(session);
      if (!f || f.fermee || (!f.open && !f.tient.size)) return [];
      return [...[...f.tient.values()].map((x) => ligneLibere({ session, chemin: x.chemin }, maintenant)), ligneClose({ session, raison: entree?.reason ?? null }, maintenant)];
    });
    return r;
  }
  return r;
}

// ---- LA PANNE : DÉCLARÉE UNE FOIS PAR SESSION --------------------------------------------------------------------------------------
const temoinDePanne = (session) => join(tmpdir(), "forge-sessions-pannes", `${String(session || "inconnue").replace(/[^\w-]/g, "_").slice(0, 80)}.txt`);

/** Le texte de la panne, à déclarer s'il ne l'a pas déjà été pour cette session ; null sinon. Le témoin s'écrit à la déclaration. */
export function declarationDePanne(session, raison, evenement) {
  if (!AVEC_CONTEXTE.has(evenement)) return null;
  const temoin = temoinDePanne(session);
  if (existsSync(temoin)) return null;
  try { mkdirSync(dirname(temoin), { recursive: true }); writeFileSync(temoin, `${new Date().toISOString()} ${raison}\n`, "utf8"); } catch { /* le témoin manque : la panne se redira */ }
  return `REGISTRE DES SESSIONS EN PANNE (D-218 (b)) — ${raison}. Rien n'est bloqué : la session travaille sans voir les autres sessions du `
    + "produit, et cette panne ne se redit plus pendant la session. Remède : lire forge/sessions.jsonl (une ligne JSON par événement) ; "
    + "une ligne illisible s'ignore, un verrou forge/sessions.jsonl.lock de plus de 5 s se reprend tout seul.";
}

function sortir(evenement, contexte) {
  if (contexte && AVEC_CONTEXTE.has(evenement)) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: evenement, additionalContext: contexte } }) + "\n");
  process.exit(0);
}

/** `--revendiquer <chemin> --pour <session>` : la coordinatrice revendique un fichier commun pour une session nommée. */
function revendiquerALaMain(argv, env = process.env) {
  const val = (cle) => { const i = argv.indexOf(cle); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : null; };
  const chemin0 = val("--revendiquer"), pour = val("--pour");
  if (!chemin0 || !pour) { process.stderr.write("usage : --revendiquer <chemin> --pour <session> [--session <id>]\n"); return 2; }
  const { id: session } = sessionCourante({ env, explicite: val("--session") });
  const base = racineDeSession({ depart: process.cwd(), env });
  const reg = registreDe(base);
  if (!reg.fichier) { process.stderr.write(`${base} n'est pas un produit (aucun dossier forge/) : il n'y a pas de registre des sessions\n`); return 2; }
  const chemin = cheminRelatif(resolve(base, chemin0), reg.racines);
  if (!chemin) { process.stderr.write(`${chemin0} est hors du produit ${base}\n`); return 2; }
  let resultat;
  sousVerrouDuRegistre(reg, (lu) => {
    resultat = revendicationPour(etatDesSessions(lu.lignes), { session, chemin, pour });
    return resultat.lignes || [];
  });
  if (resultat.refus) { process.stderr.write(`refusé : ${resultat.refus}\n`); return 1; }
  process.stdout.write(`${chemin} revendiqué pour la session ${court(resultat.pour)} par la coordinatrice ${court(session)}\n`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const argv = process.argv.slice(2);
  if (argv.includes("--revendiquer")) {
    let code = 1;
    try { code = revendiquerALaMain(argv); } catch (e) { process.stderr.write(`registre des sessions : ${e.message}\n`); }
    process.exit(code);
  }
  let entree = null, panne = null, r = null;
  try { const brut = readFileSync(0, "utf8"); entree = brut.trim() ? JSON.parse(brut) : {}; }
  catch (e) { panne = `entrée du hook illisible (${String(e.message).slice(0, 120)})`; }
  if (entree && typeof entree === "object") {
    try { r = traiter(entree); }
    catch (e) { panne = e instanceof PanneRegistre ? e.message : `erreur du hook (${String(e?.message || e).slice(0, 200)})`; }
  }
  const evenement = entree?.hook_event_name ?? null;
  const session = sessionCourante({ entree, env: process.env }).id;
  if (!panne && r?.illisibles) panne = `${r.illisibles} ligne(s) illisible(s) au registre forge/sessions.jsonl, ignorées`;
  const declaration = panne ? declarationDePanne(session, panne, evenement) : null;
  if (panne) process.stderr.write(`[hook-sessions] ${panne}\n`);
  sortir(evenement, [r?.contexte, declaration].filter(Boolean).join("\n") || null);
}
