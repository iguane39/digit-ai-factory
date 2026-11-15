#!/usr/bin/env node
/**
 * allouer-indice.mjs — l'ALLOCATION d'indice livrée comme une fonction, pas seulement la
 * violation comme un verdict (TF-0691, 28/08/2026).
 *
 * LE FAIT QUI LE REND NÉCESSAIRE, mesuré sur un dépôt de produit le 27/08 : un générateur de
 * fiche portait son nom de sortie dans une CONSTANTE (`const BASE = "… - Dev - 20260827a"`) et
 * a réécrit le même fichier quatre fois en 80 minutes — trois contenus différents sous un seul
 * nom, dont deux poussés. `verifier-jugement.mjs` n'y pouvait rien PAR CONSTRUCTION : il compare
 * un livrable à un sceau posé au premier passage d'oracles, or un générateur écrit son nom de
 * sortie AVANT tout passage d'oracle — il n'y a pas de sceau à ce moment-là. C'est la
 * reproduction exacte du défaut fondateur de TF-0523, quatre jours après son remède, par la voie
 * que le remède ne couvre pas.
 *
 * LE CONTRAT (règle 5 des règles de projet — une nouvelle version = un NOUVEAU fichier daté) :
 *   · rien n'existe pour ce jour                  → indice `a` ;
 *   · un fichier du jour porte le MÊME contenu    → SON indice — une re-génération à contenu
 *     inchangé n'est pas une nouvelle version, sinon l'outil pond un fichier par lancement ;
 *   · sinon                                       → l'indice SUIVANT le dernier pris ;
 *   · le dernier pris est « z » (TF-1850)         → la PREMIÈRE LETTRE LIBRE DU JOUR DANS LE
 *     DOSSIER (tous radicaux, comme R-4) ; les 26 prises → erreur claire, jamais un nom refusé.
 *
 * LA COMPARAISON SE FAIT SUR UNE FORME CANONIQUE où l'indice est neutralisé, parce que la
 * référence imprimée DANS le document (`REF-…-20260827a`, nom de fichier auto-cité) contient
 * l'indice : sans neutralisation, deux contenus identiques différeraient toujours d'une lettre
 * et l'outil allouerait un indice neuf à chaque lancement — le défaut qu'il existe pour fermer.
 *
 * Usage comme module (la voie prévue — tout générateur de la bibliothèque l'importe au lieu de
 * porter une constante) :
 *   import { allouerIndice } from "<pilot>/scripts/allouer-indice.mjs";
 *   const indice = allouerIndice({ dossier, prefixe: "Client - Fiche - Dev - ",
 *                                  jour: "20260831", contenu, extension: ".html" });
 *   const nom = `${prefixe}${jour}${indice}${extension}`;
 *
 * PORTÉE DE LA RECHERCHE D'INDICES PRIS (TF-1450, 28/09/2026). Par défaut (`porte: "prefixe"`),
 * la fonction ne voit QUE les fichiers de son propre `prefixe` — or R-4 (`oracle-conformite-
 * projet.mjs`) juge l'indice unique PAR JOUR ET PAR DOSSIER, tous radicaux confondus (TF-0750).
 * Mesuré le 28/09 : dans un dossier où « <Marque> - Étude - 20260928a » existait déjà, un appel
 * pour un AUTRE radical (« <Marque> - Rapport - 20260928… ») avec la portée par défaut a rendu
 * « a » — collision immédiate avec le livrable existant, renommage manuel après coup. Passer
 * `porte: "dossier"` compte tous les fichiers du dossier qui portent CE jour, quel que soit leur
 * préfixe ou leur extension — le même repérage que R-4 — et c'est la portée à employer pour
 * RÉINDEXER un livrable que R-4 vient de signaler en collision :
 *   const indice = allouerIndice({ dossier, prefixe, jour, contenu, extension, porte: "dossier" });
 *
 * Ce que ce module NE fait PAS, et c'est déclaré :
 *   · il n'écrit RIEN — il rend une lettre, le générateur écrit ; seule l'option `--reserver`
 *     écrit, au registre des sessions du produit (voir plus bas) ;
 *   · il ne juge pas le contenu — `verifier-jugement.mjs` reste le juge de l'édition manuelle ;
 *   · il ne voit pas deux générateurs qui écrivent le même nom EN MÊME TEMPS — la fenêtre
 *     existe, comme pour toute allocation par lecture du disque, sauf entre sessions d'un produit
 *     qui réservent leur indice.
 *
 * LA RÉSERVATION (D-218 (b), item I4, 15/11/2026). Le fait : le 14/11/2026, l'indice 20261114g a
 * été porté par deux livrables de radical distinct dans output/ du même produit, deux sessions
 * ayant demandé leur lettre sans écrire entre les deux appels. Chez un produit (un dossier forge/
 * en remontant), `--reserver` inscrit sous verrou, au registre `forge/sessions.jsonl`, le nom de
 * fichier rendu pour la session courante (une revendication, oracles/lib-sessions.mjs), et
 * l'appel suivant d'une autre session saute cette lettre, qu'il réserve ou non : la commande lit
 * toujours les réservations des autres sessions vivantes du produit. La session qui redemande le
 * même radical (même préfixe, même extension) retrouve sa lettre. Une réservation vaut tant que sa
 * session vit (15 minutes après sa dernière preuve de vie) ; deux postes restent invisibles l'un à
 * l'autre. La fonction `allouerIndice` reste pure : un appelant lui passe `reserves` s'il le veut.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { sessionCourante } from "../oracles/lib-session.mjs";
import { cleDeChemin, etatDesSessions, ligneRevendique, lireRegistre, racineDeSession, registreDe, sousVerrouDuRegistre, tientDeja } from "../oracles/lib-sessions.mjs";

const LETTRES = "abcdefghijklmnopqrstuvwxyz";

/** La forme canonique : chaque occurrence de `<jour><lettre>` perd sa lettre. */
export const canonique = (texte, jour) =>
  String(texte).replaceAll(new RegExp(`${jour}[a-z]`, "g"), jour);

/**
 * Rend l'indice à employer pour écrire `${prefixe}${jour}<indice>${extension}` dans `dossier`.
 * Voir le contrat en tête de fichier.
 */
export function allouerIndice({ dossier, prefixe, jour, contenu, extension = ".html", porte = "prefixe", reserves = [] }) {
  if (!/^\d{8}$/.test(String(jour))) throw new Error(`jour attendu AAAAMMJJ, reçu « ${jour} »`);
  // TF-1450 : portée « dossier » — tous les radicaux du jour, quel que soit leur préfixe ou leur
  // extension (même repérage que R-4, ` - AAAAMMJJ<lettre>.<ext>` en fin de nom). Portée « prefixe »
  // (par défaut, inchangée) : uniquement CE préfixe, la seule que R-4 ne peut pas voir en collision.
  const motif = porte === "dossier"
    ? new RegExp(` - ${jour}([a-z])\\.[\\w.]+$`)
    : new RegExp(
      `^${String(prefixe).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${jour}([a-z])${String(extension).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
  // D-218 (b) : un nom réservé par une autre session compte comme un fichier présent du dossier.
  const noms = [...new Set([...(existsSync(dossier) ? readdirSync(dossier) : []), ...reserves])];
  const pris = noms.map((f) => ({ f, m: f.match(motif) })).filter((x) => x.m)
    .map(({ f, m }) => ({ lettre: m[1], nom: f }))
    .sort((a, b) => a.lettre.localeCompare(b.lettre));
  if (!pris.length) return "a";
  // TF-1863 : sans `contenu` (appel en ligne de commande, rien à comparer), pas de recherche d'identité.
  if (contenu !== undefined) {
    const mienne = canonique(contenu, jour);
    for (const { lettre, nom } of pris) {
      let existant;
      try { existant = readFileSync(join(dossier, nom), "utf8"); } catch { continue; }
      if (canonique(existant, jour) === mienne) return lettre;
    }
  }
  const derniere = pris[pris.length - 1].lettre;
  const suivant = LETTRES.indexOf(derniere) + 1;
  if (suivant < LETTRES.length) return LETTRES[suivant];
  // TF-1850 (18/10/2026, RP-13) : « z » est pris et la suivante n'existe pas — l'ancienne branche
  // rendait « z », un nom DÉJÀ PRIS. R-4 n'admet qu'UNE lettre (` - \d{8}[a-z]?\.`) et la juge par
  // jour ET par dossier, tous radicaux confondus : on rend donc la PREMIÈRE LETTRE LIBRE DU JOUR
  // DANS LE DOSSIER, quelle que soit la portée demandée (une lettre libre pour CE préfixe peut être
  // prise par un AUTRE radical, que R-4 verrait en collision). Mesuré le 15/10 : 17 lettres du jour
  // restaient libres dans 06-rapports. Aucune libre : l'outil échoue, il ne rend pas un nom que
  // l'oracle de nommage refuserait.
  const motifDossier = new RegExp(` - ${jour}([a-z])\\.[\\w.]+$`);
  const prisDuDossier = new Set(noms.map((f) => f.match(motifDossier)).filter(Boolean).map((m) => m[1]));
  const libre = [...LETTRES].find((l) => !prisDuDossier.has(l));
  if (!libre) {
    throw new Error(`aucune lettre libre pour le jour ${jour} dans ${dossier} : les 26 lettres a-z sont prises `
      + "(R-4 n'admet qu'une lettre par jour et par dossier) — ranger ce livrable dans un autre dossier, ou le dater du jour suivant");
  }
  return libre;
}

// ---- LA RÉSERVATION AU REGISTRE DES SESSIONS DU PRODUIT (D-218 (b), item I4) ----------------------------------------------------
/** Une demande d'usage impossible (hors d'un produit, session non identifiée) : la commande sort en 2. */
export class ErreurUsage extends Error {}

/** Le registre des sessions du produit qui porte `dossier`, et le chemin de ce dossier relatif au produit ; null hors d'un produit. */
function registreDuDossier(dossier) {
  const d = resolve(dossier);
  const reg = registreDe(racineDeSession({ depart: d, env: {} }));
  if (!reg.fichier) return null;
  for (const r of reg.racines) {
    const x = relative(r, d);
    if (!x.startsWith("..") && !isAbsolute(x)) return { reg, dossier: d, relatif: x.split(sep).join("/") };
  }
  return null;
}

const DU_RADICAL = (nom, prefixe, extension) => nom.startsWith(prefixe) && nom.endsWith(extension)
  && /^\d{8}[a-z]$/.test(nom.slice(prefixe.length, nom.length - extension.length));

/**
 * Les réservations vivantes du dossier : `noms`, les noms de fichier réservés par les autres sessions, et par la session courante pour un
 * autre radical, qui comptent comme pris ; `propre`, la lettre que la session courante a réservée pour CE radical (même préfixe, même
 * jour, même extension) et dont le fichier n'est pas encore écrit : la redemander la rend, l'allocateur ne comblant pas les trous.
 */
export function nomsReserves(etat, relatifDossier, { prefixe = "", extension = ".html", jour = null, session = null, dossier = null } = {}) {
  const noms = [];
  let propre = null;
  for (const s of etat.vivantes) for (const r of s.tient.values()) {
    const c = String(r.chemin), i = c.lastIndexOf("/");
    if (cleDeChemin(i >= 0 ? c.slice(0, i) : "") !== cleDeChemin(relatifDossier)) continue;
    const nom = i >= 0 ? c.slice(i + 1) : c;
    if (s.session === session && DU_RADICAL(nom, prefixe, extension) && (!jour || nom.slice(prefixe.length, prefixe.length + 8) === String(jour))) {
      if (!propre && dossier && !existsSync(join(dossier, nom))) propre = nom.charAt(prefixe.length + 8);
      continue;
    }
    noms.push(nom);
  }
  return { noms, propre };
}

/** La lettre : la réservation propre du radical si elle tient, sauf quand l'identité de contenu désigne un fichier déjà écrit. */
function lettreAvecReservations(options, { noms, propre }) {
  const calcul = allouerIndice({ ...options, reserves: noms });
  return propre && !existsSync(join(options.dossier, `${options.prefixe}${options.jour}${calcul}${options.extension}`)) ? propre : calcul;
}

/** L'indice que rend la commande sans `--reserver` : le disque, plus les réservations des sessions vivantes du produit, lues sans verrou.
 *  Hors d'un produit, ou registre illisible, le disque seul (le second cas est dit à `avertir`). */
export function allouerIndiceVuDuRegistre({ dossier, prefixe = "", jour, contenu, extension = ".html", porte = "dossier", session = sessionCourante().id, avertir = () => {} }) {
  const p = registreDuDossier(dossier);
  let reservations = { noms: [], propre: null };
  if (p) {
    try { reservations = nomsReserves(etatDesSessions(lireRegistre(p.reg.racines).lignes), p.relatif, { prefixe, extension, jour, session, dossier: p.dossier }); }
    catch (e) { avertir(`registre des sessions illisible, réservations des autres sessions non lues : ${e.message}`); }
  }
  return lettreAvecReservations({ dossier, prefixe, jour, contenu, extension, porte }, reservations);
}

/**
 * `--reserver` : sous le verrou du registre des sessions du produit, l'indice rendu ET sa réservation pour la session courante, une
 * revendication du nom de fichier (`origine: allouer-indice --reserver`). Rend { lettre, nom, chemin, deja, registre, session, source }.
 * Lève `ErreurUsage` hors d'un produit, ou sans session identifiée.
 */
export function reserverIndice({ dossier, prefixe = "", jour, contenu, extension = ".html", porte = "dossier", session = sessionCourante(), maintenant = Date.now() }) {
  if (!/^\d{8}$/.test(String(jour))) throw new Error(`jour attendu AAAAMMJJ, reçu « ${jour} »`);
  if (!session?.id) throw new ErreurUsage("--reserver exige une session identifiée : FORGE_SESSION_ID (posée par le hook SessionStart) ou CLAUDE_CODE_SESSION_ID");
  const p = registreDuDossier(dossier);
  if (!p) throw new ErreurUsage(`${resolve(dossier)} n'est sous aucun produit (aucun dossier forge/ en remontant) : le registre des sessions vit chez un produit ; sans --reserver, l'indice se rend sans réservation`);
  let r;
  sousVerrouDuRegistre(p.reg, (lu) => {
    const etat = etatDesSessions(lu.lignes, { maintenant });
    const lettre = lettreAvecReservations({ dossier: p.dossier, prefixe, jour, contenu, extension, porte },
      nomsReserves(etat, p.relatif, { prefixe, extension, jour, session: session.id, dossier: p.dossier }));
    const nom = `${prefixe}${jour}${lettre}${extension}`;
    const chemin = p.relatif ? `${p.relatif}/${nom}` : nom;
    r = { lettre, nom, chemin, deja: tientDeja(etat, chemin, session.id) };
    return r.deja ? [] : [ligneRevendique({ session: session.id, chemin, origine: "allouer-indice --reserver" }, maintenant)];
  });
  return { ...r, registre: p.reg.fichier, session: session.id, source: session.source };
}

/**
 * POINT D'ENTRÉE EN LIGNE DE COMMANDE (TF-1863, 19/10/2026, R-58 option a). Six documents prescrivent
 * `node scripts\allouer-indice.mjs` ; le module n'avait aucun point d'entrée, la commande se terminait
 * sans rien dire. Elle imprime désormais l'indice (une lettre) sur la sortie standard.
 *
 *   node scripts/allouer-indice.mjs [dossier] [prefixe] [jour]
 *   node scripts/allouer-indice.mjs --dossier <d> --prefixe <p> --jour AAAAMMJJ [--extension .md]
 *                                   [--contenu-fichier <f>] [--porte dossier|prefixe] [--reserver]
 *
 * Défauts : dossier = répertoire courant, prefixe = « » (aucun), jour = aujourd'hui (heure locale),
 * portée « dossier » (celle de R-4 : une lettre par jour et par dossier, tous radicaux confondus ;
 * « prefixe » reste demandable). Sans `--contenu-fichier`, aucune identité de contenu n'est cherchée :
 * l'indice rendu est la lettre qui suit la dernière prise. Chez un produit, les lettres que les autres
 * sessions vivantes ont réservées comptent comme prises ; `--reserver` réserve la lettre rendue pour la
 * session courante (D-218 (b)). Sortie 0 = indice imprimé ; 1 = dossier plein ou jour mal formé ;
 * 2 = usage erroné, ou `--reserver` hors d'un produit ou sans session identifiée.
 */
export function executerCli(argv, { sortie = (t) => process.stdout.write(t), erreur = (t) => process.stderr.write(t) } = {}) {
  const valeurs = {};
  const positions = [];
  const AVEC_VALEUR = new Set(["dossier", "prefixe", "jour", "extension", "contenu-fichier", "porte"]);
  let reserver = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--reserver") { reserver = true; continue; }
    if (a.startsWith("--")) {
      const cle = a.slice(2);
      if (!AVEC_VALEUR.has(cle) || i + 1 >= argv.length) { erreur(`option inconnue ou sans valeur : ${a}\n`); return 2; }
      valeurs[cle] = argv[++i];
    } else positions.push(a);
  }
  if (positions.length > 3) { erreur("trop d'arguments : [dossier] [prefixe] [jour]\n"); return 2; }
  const [pDossier, pPrefixe, pJour] = positions;
  const dossier = valeurs.dossier ?? pDossier ?? process.cwd();
  const prefixe = valeurs.prefixe ?? pPrefixe ?? "";
  const porte = valeurs.porte ?? "dossier";
  if (porte !== "dossier" && porte !== "prefixe") { erreur("--porte attend « dossier » ou « prefixe »\n"); return 2; }
  const d = new Date();
  const aujourdhui = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const jour = String(valeurs.jour ?? pJour ?? aujourdhui).replaceAll("-", "");
  let contenu;
  if (valeurs["contenu-fichier"] !== undefined) {
    try { contenu = readFileSync(valeurs["contenu-fichier"], "utf8"); }
    catch (e) { erreur(`contenu illisible : ${e.message}\n`); return 2; }
  }
  const extension = valeurs.extension ?? ".html";
  try {
    if (reserver) {
      const r = reserverIndice({ dossier, prefixe, jour, contenu, extension, porte });
      sortie(`${r.lettre}\n`);
      erreur(`indice ${r.lettre} ${r.deja ? "déjà réservé" : "réservé"} pour la session ${r.session.slice(0, 8)} (${r.source}) : ${r.chemin}, registre ${r.registre}\n`);
      return 0;
    }
    sortie(`${allouerIndiceVuDuRegistre({ dossier, prefixe, jour, contenu, extension, porte, avertir: (t) => erreur(`${t}\n`) })}\n`);
    return 0;
  } catch (e) { erreur(`${e.message}\n`); return e instanceof ErreurUsage ? 2 : 1; }
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  process.exit(executerCli(process.argv.slice(2)));
}
