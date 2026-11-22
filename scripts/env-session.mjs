#!/usr/bin/env node
/**
 * env-session.mjs — LIRE L'ENVIRONNEMENT D'UNE SESSION SANS EN AFFICHER UN JETON (TF-2721, 22/11/2026).
 *
 * LE FAIT, le 15/11/2026 : un agent `constructeur` a affiché `CLAUDE_CODE_MESSAGING_TOKEN` dans sa transcription par un relevé non filtré de
 * l'environnement (`env`, `printenv`, `Get-ChildItem env:`). Il ne l'a écrit nulle part ailleurs, mais tout ce qu'un outil affiche entre dans la
 * transcription locale, lisible en clair. `oracles\hook-gardes-commande.mjs` refuse ces relevés ; ce script est la voie qu'il propose à la place,
 * comme `scripts\env-masque.mjs` l'est pour un fichier `.env`.
 *
 * Usage :
 *   node scripts\env-session.mjs                  chaque variable, NOM=valeur ; la valeur d'une variable de jeton est remplacée par ******** (jamais sa longueur)
 *   node scripts\env-session.mjs --noms           la liste des seuls noms, une par ligne
 *   node scripts\env-session.mjs --var NOM        la valeur d'UNE variable, sauf si c'est un jeton (alors ********)
 *   node scripts\env-session.mjs --presente NOM   « oui » ou « non », exit 0 ou 1 : la présence d'une variable, jamais sa valeur
 *   node scripts\env-session.mjs --filtre <motif> seules les variables dont le NOM contient le motif (insensible à la casse), valeurs masquées de même
 *
 * Ce qui est masqué : une variable dont le NOM évoque un secret (TOKEN, SECRET, PASSWORD, KEY, CREDENTIAL, AUTH, COOKIE, BEARER, SESSION_ACCESS…), ou dont la
 * VALEUR a la forme d'un jeton (préfixes `ghp_`, `github_pat_`, `sk-`, `xox…-`, `AKIA…`, `eyJ…`, ou 32 caractères et plus sans espace ni séparateur de chemin).
 * Le masquage se trompe du côté sûr : une valeur longue d'apparence anodine peut être masquée à tort, jamais l'inverse. Jamais une valeur masquée sur la
 * sortie standard ni sur la sortie d'erreur. NON JUGÉ : une valeur secrète courte portée par une variable au nom banal (`X=abc123`).
 * Exit : 0 rendu · 1 `--presente` sur une variable absente · 2 usage.
 */
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const MASQUE = "********";
const NOM_SECRET = /TOKEN|SECRET|PASSW(?:OR)?D|PASSWD|API[_-]?KEY|ACCESS[_-]?KEY|PRIVATE[_-]?KEY|CREDENTIAL|AUTH(?!OR)|COOKIE|BEARER|SIGNATURE|SESSION_ACCESS|(?:^|_)PAT$|(?:^|_)KEY$|CERT_?KEY/i;
const VALEUR_JETON = /^(?:gh[pousr]_|github_pat_|sk-|sk_|xox[abprs]-|AKIA[0-9A-Z]{8}|eyJ[\w-]{8,}\.)/;
const VALEUR_LONGUE_OPAQUE = /^[A-Za-z0-9+=_\-.~]{32,}$/;

/** Le NOM d'une variable évoque-t-il un secret ? */
export const nomSecret = (nom) => NOM_SECRET.test(String(nom));
/** La VALEUR a-t-elle la forme d'un jeton ? (une valeur qui contient un séparateur de chemin n'en est pas une) */
export const valeurJeton = (valeur) => { const v = String(valeur ?? ""); return VALEUR_JETON.test(v) || (VALEUR_LONGUE_OPAQUE.test(v) && !/[\\/:]/.test(v)); };
/** Faut-il masquer la valeur de cette variable ? */
export const aMasquer = (nom, valeur) => nomSecret(nom) || valeurJeton(valeur);
/** La valeur à afficher : masquée ou telle quelle. Une valeur vide reste vide (savoir qu'une variable est vide n'est pas un secret). */
export const valeurAffichable = (nom, valeur) => (valeur === "" || valeur === undefined ? "" : aMasquer(nom, valeur) ? MASQUE : valeur);

/** Les lignes du relevé : { lignes, total }. Pur : l'environnement est un argument. */
export function releve(env, { filtre = null, noms = false } = {}) {
  const f = filtre ? String(filtre).toLowerCase() : null;
  const cles = Object.keys(env).filter((k) => !f || k.toLowerCase().includes(f)).sort((a, b) => a.localeCompare(b));
  return { lignes: cles.map((k) => (noms ? k : `${k}=${valeurAffichable(k, env[k])}`)), total: cles.length };
}

export function principal(argv, env = process.env, sortie = (t) => process.stdout.write(t + "\n"), erreur = (t) => process.stderr.write(t + "\n")) {
  const i = (opt) => argv.indexOf(opt);
  const valeur = (opt) => { const k = i(opt); const v = k >= 0 ? argv[k + 1] : undefined; return v === undefined || v.startsWith("--") ? null : v; };
  for (const opt of ["--var", "--presente", "--filtre"]) if (i(opt) >= 0 && valeur(opt) === null) { erreur(`${opt} attend une valeur`); return 2; }
  const inconnues = argv.filter((a) => a.startsWith("--") && !["--noms", "--var", "--presente", "--filtre"].includes(a));
  if (inconnues.length) { erreur(`option inconnue : ${inconnues[0]} — usage : node scripts\\env-session.mjs [--noms | --var NOM | --presente NOM | --filtre <motif>]`); return 2; }
  if (i("--presente") >= 0) {
    const nom = valeur("--presente");
    const presente = Object.prototype.hasOwnProperty.call(env, nom) && env[nom] !== "";
    sortie(presente ? "oui" : "non");
    return presente ? 0 : 1;
  }
  if (i("--var") >= 0) {
    const nom = valeur("--var");
    if (!Object.prototype.hasOwnProperty.call(env, nom)) { sortie(`${nom} : absente`); return 0; }
    sortie(`${nom}=${valeurAffichable(nom, env[nom])}`);
    return 0;
  }
  const r = releve(env, { filtre: valeur("--filtre"), noms: i("--noms") >= 0 });
  for (const l of r.lignes) sortie(l);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase()) process.exit(principal(process.argv.slice(2)));
