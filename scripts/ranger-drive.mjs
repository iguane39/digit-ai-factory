#!/usr/bin/env node
/**
 * ranger-drive.mjs — RANGE UN DOSSIER DE PRODUIT DU DRIVE AU MODÈLE DE D-238 (a) DU 23/11/2026.
 *
 * Le modèle : `<dev du Drive>/<Produit>/`, sans suffixe « - Reprise », aux sous-dossiers fixes `donnees` (le canal de
 * reprise), `coffre` (les fichiers d'environnement), `memoire-claude` (la mémoire Claude du projet), et rien d'autre.
 * Les noms d'avant (`DONNEES-HORS-GIT`, `hors-git`, `SECRETS`, `MEMOIRE-CLAUDE`) se lisent dans scripts/synchro-drive.json.
 *
 * RIEN N'EST SUPPRIMÉ. Les notices `REPRISE.md` et les caches d'oracles partent sous `<parent du dev>/_a-retirer-<date>/
 * <dossier>/` (à la racine du Drive : un retrait sous `dev` allongerait des chemins déjà proches de 260 caractères) ;
 * leur suppression reste un geste humain. Chaque déplacement est un renommage sur le même volume : le client Drive le
 * voit comme un déplacement, rien n'est renvoyé.
 *
 * QUAND LE JOUER. Un dossier que le code d'un produit lit par son ancien nom (un manifeste, un script, une
 * configuration) se range dans la session de CE produit, dans le même tour que la mise à jour de son code : le pilot
 * ne réécrit pas un produit. Un manifeste de reprise écrit avant le rangement suit le dossier rangé sans être
 * réécrit (`cheminsConvention` d'oracle-reprise, même décision).
 *
 * Usage : node scripts/ranger-drive.mjs --dossier "<nom sous dev>" [--racine-canal] [--caches-seuls] [--appliquer]
 *                                       [--drive-dev <dossier>]
 *   --racine-canal  le canal de reprise du produit est déclaré à la RACINE du dossier : tout ce qui n'est ni coffre,
 *                   ni mémoire, ni notice, ni cache entre dans `donnees`
 *   --caches-seuls  ne retire que les caches d'oracles ; noms et sous-dossiers restent
 *   --appliquer     sans lui, rien n'est écrit : le plan est rendu
 * Exit : 0 plan rendu ou rangement fait et conforme · 1 refus ou écart restant · 2 argument invalide.
 */
import { existsSync, mkdirSync, readdirSync, renameSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { lireConfig, resoudreDriveDev, ecartsAuModele } from "./synchro-drive.mjs";

const jour = () => new Date().toISOString().slice(0, 10).replaceAll("-", "");

/** Le plan : [{ de, vers, motif }] dans l'ordre d'exécution, et les refus. */
export function planifierRangement(cfg, driveDev, nom, { racineCanal = false, cachesSeuls = false, date = jour() } = {}) {
  const source = join(driveDev, nom);
  const refus = []; const etapes = [];
  if (!existsSync(source)) return { source, etapes, refus: [`${source} n'existe pas`] };
  const cible = join(driveDev, cfg.suffixe_ancien && nom.endsWith(cfg.suffixe_ancien) ? nom.slice(0, -cfg.suffixe_ancien.length) : nom);
  const retrait = join(dirname(driveDev), `${cfg.retrait}-${date}`, nom);
  const cache = new RegExp(cfg.a_retirer.motif_cache);
  const entrees = readdirSync(source).filter((n) => !/^desktop\.ini$/i.test(n));
  const restantes = [];
  for (const n of entrees) {
    if (cache.test(n) || (!cachesSeuls && cfg.a_retirer.fichiers.includes(n))) etapes.push({ de: join(source, n), vers: join(retrait, n), motif: cache.test(n) ? "cache d'oracle retiré" : "notice retirée" });
    else restantes.push(n);
  }
  if (cachesSeuls) return { source, cible: source, retrait, etapes, refus };
  const modele = cfg.sous_dossiers;
  const ancien = new Map();
  for (const [nouveau, anciens] of Object.entries(cfg.anciens_noms)) for (const a of anciens) ancien.set(a.toLowerCase(), nouveau);
  const pris = new Set(restantes.filter((n) => Object.values(modele).includes(n)));
  const autres = [];
  for (const n of restantes) {
    if (Object.values(modele).includes(n) && !(racineCanal && n === modele.canal)) continue;
    const nouveau = ancien.get(n.toLowerCase());
    if (nouveau && !(racineCanal && nouveau === modele.canal)) {
      if (pris.has(nouveau)) { refus.push(`« ${n} » et « ${nouveau} » coexistent dans ${nom} : à fusionner à la main`); continue; }
      pris.add(nouveau);
      etapes.push({ de: join(source, n), vers: join(source, nouveau), motif: `ancien nom « ${n} »` });
    } else autres.push(n);
  }
  if (racineCanal && autres.length) {
    // le canal était la racine : ses éléments entrent dans `donnees`, par un dossier d'attente (un élément peut s'appeler `donnees`)
    const attente = join(source, `.${modele.canal}-rangement`);
    if (existsSync(attente)) refus.push(`${attente} existe déjà : un rangement précédent s'est interrompu`);
    for (const n of autres) etapes.push({ de: join(source, n), vers: join(attente, n), motif: "élément du canal déclaré à la racine" });
    etapes.push({ de: attente, vers: join(source, modele.canal), motif: "canal rangé dans donnees" });
  } else for (const n of autres) refus.push(`« ${n} » n'a pas de place au modèle : à ranger à la main, ou --racine-canal si le canal est déclaré à la racine`);
  if (cible !== source) {
    if (existsSync(cible)) refus.push(`${cible} existe déjà : les deux dossiers sont à fusionner à la main`);
    etapes.push({ de: source, vers: cible, motif: "suffixe retiré" });
  }
  return { source, cible, retrait, etapes, refus };
}

export function appliquer(plan) {
  for (const e of plan.etapes) {
    mkdirSync(dirname(e.vers), { recursive: true });
    // MEMOIRE-CLAUDE → memoire-claude ne change que la casse : sur un volume insensible à la casse, la cible « existe »
    // déjà (c'est la source) ; le renommage passe par un nom d'attente (mesuré le 23/11/2026, arrêt sur 2 dossiers).
    const casseSeule = resolve(e.de) !== resolve(e.vers) && resolve(e.de).toLowerCase() === resolve(e.vers).toLowerCase();
    if (casseSeule) { const attente = `${e.de}.casse-rangement`; renameSync(e.de, attente); renameSync(attente, e.vers); continue; }
    if (existsSync(e.vers)) throw new Error(`${e.vers} existe déjà : arrêt avant d'écraser (étapes faites jusque-là : voir le plan)`);
    renameSync(e.de, e.vers);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const a = process.argv.slice(2);
  const val = (n) => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : undefined; };
  const connus = ["--dossier", "--drive-dev", "--racine-canal", "--caches-seuls", "--appliquer"];
  const inconnu = a.find((x, i) => x.startsWith("--") && !connus.includes(x) && !["--dossier", "--drive-dev"].includes(a[i - 1]));
  const nom = val("--dossier");
  if (inconnu || !nom) { process.stderr.write(`ranger-drive : ${inconnu ? `argument inconnu : ${inconnu}` : "--dossier est exigé"}\n`); process.exit(2); }
  const cfg = lireConfig();
  const { dossier: driveDev, essais } = resoudreDriveDev(cfg, { option: val("--drive-dev") });
  if (!driveDev) { process.stderr.write(`ranger-drive : dossier dev du Drive introuvable ; essayés : ${essais.join(" ; ")}\n`); process.exit(2); }
  const plan = planifierRangement(cfg, driveDev, nom, { racineCanal: a.includes("--racine-canal"), cachesSeuls: a.includes("--caches-seuls") });
  const faire = a.includes("--appliquer") && !plan.refus.length;
  if (faire) appliquer(plan);
  const ecarts = faire && existsSync(plan.cible) && statSync(plan.cible).isDirectory() ? ecartsAuModele(cfg, plan.cible.split(/[\\/]/).pop(), plan.cible) : null;
  process.stdout.write(JSON.stringify({ outil: "ranger-drive", decision: "D-238 (a) du 23/11/2026", applique: faire, ...plan, ecarts_restants: ecarts }, null, 1) + "\n");
  process.exit(plan.refus.length || (ecarts && ecarts.length && !a.includes("--caches-seuls")) ? 1 : 0);
}
