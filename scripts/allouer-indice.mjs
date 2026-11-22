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
 *     DOSSIER (tous radicaux, comme R-4) ; les 26 prises → le PREMIER DOUBLE SUFFIXE LIBRE, « za » à
 *     « zz » (TF-2681, le 28e lot du 15/11) ; les 52 prises → erreur claire, jamais un nom pris.
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
 * PORTÉE DE LA RECHERCHE D'INDICES PRIS (TF-1450, 28/09/2026 ; défaut inversé par TF-2631, 16/11/2026).
 * Le défaut du module est `porte: "dossier"`, celui de la ligne de commande : le module déclarait
 * « prefixe » quand la commande portait « dossier », et seul l'appel en module sans option rendait un
 * indice que R-4 refuse (RP-216). Avec `porte: "prefixe"`, demandable,
 * la fonction ne voit QUE les fichiers de son propre `prefixe` — or R-4 (`oracle-conformite-
 * projet.mjs`) juge l'indice unique PAR JOUR ET PAR DOSSIER, tous radicaux confondus (TF-0750).
 * Mesuré le 28/09 : dans un dossier où « <Marque> - Étude - 20260928a » existait déjà, un appel
 * pour un AUTRE radical (« <Marque> - Rapport - 20260928… ») avec la portée par défaut a rendu
 * « a » — collision immédiate avec le livrable existant, renommage manuel après coup. Passer
 * `porte: "dossier"` compte tous les fichiers du dossier qui portent CE jour, quel que soit leur
 * préfixe ou leur extension — le même repérage que R-4 — et c'est la portée à employer pour
 * RÉINDEXER un livrable que R-4 vient de signaler en collision (c'est désormais le défaut) :
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
import { INDICE } from "../oracles/lib-indice-nom.mjs";
import { cleDeChemin, etatDesSessions, ligneRevendique, lireRegistre, racineDeSession, registreDe, sousVerrouDuRegistre, tientDeja } from "../oracles/lib-sessions.mjs";

const LETTRES = "abcdefghijklmnopqrstuvwxyz";

// TF-2681 : après « z », l'indice est un double suffixe « za » à « zz » (52 noms par jour et par dossier).
// TF-2685 : l'expression de l'indice vit dans `oracles\lib-indice-nom.mjs`, lue par tous les lecteurs de nom de lot.

/**
 * TF-2724 (RP-46, 15/11/2026) : le préfixe tel que le NOM DU LIVRABLE le porte. R-4 écrit « <radical> - AAAAMMJJ<indice>.<ext> » ; un appel
 * dont le préfixe s'arrête sur le radical (« … D-219e ») faisait coller le jour au radical dans le nom réservé (« … D-219e20261115b.md »),
 * alors que le livrable s'écrit « … D-219e - 20261115b.md » : la réservation ne correspondait pas au fichier. Un préfixe qui ne finit pas
 * par le séparateur « - » le reçoit ; un préfixe vide reste vide.
 */
export const prefixeDeNom = (prefixe) => {
  const p = String(prefixe ?? "");
  if (!p.trim() || /\s-\s$/.test(p)) return p;
  return `${p.replace(/\s*-?\s*$/, "")} - `;
};

/** La forme canonique : chaque occurrence de `<jour><indice>` perd son indice (une lettre, ou « z » et sa seconde lettre). */
export const canonique = (texte, jour) =>
  String(texte).replaceAll(new RegExp(`${jour}${INDICE}`, "g"), jour);

/**
 * Rend l'indice à employer pour écrire `${prefixe}${jour}<indice>${extension}` dans `dossier`.
 * Voir le contrat en tête de fichier.
 */
export function allouerIndice({ dossier, prefixe, jour, contenu, extension = ".html", porte = "dossier", reserves = [] }) {
  if (!/^\d{8}$/.test(String(jour))) throw new Error(`jour attendu AAAAMMJJ, reçu « ${jour} »`);
  prefixe = prefixeDeNom(prefixe);
  // TF-1450 : portée « dossier » — tous les radicaux du jour, quel que soit leur préfixe ou leur
  // extension (même repérage que R-4, ` - AAAAMMJJ<lettre>.<ext>` en fin de nom). Portée « prefixe »
  // (par défaut, inchangée) : uniquement CE préfixe, la seule que R-4 ne peut pas voir en collision.
  const motif = porte === "dossier"
    ? new RegExp(` - ${jour}(${INDICE})\\.[\\w.]+$`)
    : new RegExp(
      `^${String(prefixe).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${jour}(${INDICE})${String(extension).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
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
  // Un double suffixe (TF-2681) n'a pas de rang dans LETTRES : seule une lettre simple avant « z » a une suivante.
  const suivant = derniere.length === 1 ? LETTRES.indexOf(derniere) + 1 : LETTRES.length;
  if (suivant < LETTRES.length) return LETTRES[suivant];
  // TF-1850 (18/10/2026, RP-13) : « z » est pris et la suivante n'existe pas — l'ancienne branche
  // rendait « z », un nom DÉJÀ PRIS. R-4 n'admet qu'UNE lettre (` - \d{8}[a-z]?\.`) et la juge par
  // jour ET par dossier, tous radicaux confondus : on rend donc la PREMIÈRE LETTRE LIBRE DU JOUR
  // DANS LE DOSSIER, quelle que soit la portée demandée (une lettre libre pour CE préfixe peut être
  // prise par un AUTRE radical, que R-4 verrait en collision). Mesuré le 15/10 : 17 lettres du jour
  // restaient libres dans 06-rapports.
  // TF-2681 (16/11/2026) : les 26 lettres prises, l'allocateur refusait et proposait le lendemain, que le
  // juge de lot refuse (LOT-DATE) : le 28e lot du 15/11 n'avait aucun nom. Il propose désormais le premier
  // double suffixe libre, « za » à « zz » ; il échoue quand les 52 noms du jour sont pris.
  const motifDossier = new RegExp(` - ${jour}(${INDICE})\\.[\\w.]+$`);
  const prisDuDossier = new Set(noms.map((f) => f.match(motifDossier)).filter(Boolean).map((m) => m[1]));
  const libre = [...LETTRES].find((l) => !prisDuDossier.has(l))
    ?? [...LETTRES].map((l) => `z${l}`).find((d) => !prisDuDossier.has(d));
  if (!libre) {
    throw new Error(`aucune lettre libre pour le jour ${jour} dans ${dossier} : les 26 lettres a-z et les 26 doubles za-zz sont prises `
      + "— ranger ce livrable dans un autre dossier, ou le dater du jour suivant (le juge de lot refuse un lot daté d'un jour à venir : LOT-DATE)");
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
  && new RegExp(`^\\d{8}${INDICE}$`).test(nom.slice(prefixe.length, nom.length - extension.length));

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
      if (!propre && dossier && !existsSync(join(dossier, nom))) propre = nom.slice(prefixe.length + 8, nom.length - extension.length);
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

/**
 * TF-2634 (RP-217, 12/11/2026) : les noms des AUTRES dossiers où le même indice peut être pris (le sas du pilot, la boîte d'entrée, pour un lot de retours dont
 * le fichier de l'autre session n'est pas dans `forge/retours/`). Lus à l'appel, donc juste avant l'écriture. Un dossier introuvable est une erreur d'usage :
 * l'ignorer rendrait un indice calculé sans lui, sans le dire.
 */
export function nomsDesDossiers(dossiers = []) {
  const noms = [];
  for (const d of dossiers) {
    let liste;
    try { liste = readdirSync(d); } catch (e) { throw new ErreurUsage(`--aussi : dossier introuvable ou illisible (${resolve(d)} : ${e.code || e.message}) — l'indice n'est pas rendu sans lui`); }
    noms.push(...liste);
  }
  return noms;
}

/** L'indice que rend la commande sans `--reserver` : le disque, plus les réservations des sessions vivantes du produit, lues sans verrou.
 *  Hors d'un produit, ou registre illisible, le disque seul (le second cas est dit à `avertir`). `aussi` : d'autres dossiers dont les noms comptent comme pris (TF-2634). */
export function allouerIndiceVuDuRegistre({ dossier, prefixe = "", jour, contenu, extension = ".html", porte = "dossier", session = sessionCourante().id, avertir = () => {}, aussi = [] }) {
  prefixe = prefixeDeNom(prefixe);
  const p = registreDuDossier(dossier);
  let reservations = { noms: [], propre: null };
  if (p) {
    try { reservations = nomsReserves(etatDesSessions(lireRegistre(p.reg.racines).lignes), p.relatif, { prefixe, extension, jour, session, dossier: p.dossier }); }
    catch (e) { avertir(`registre des sessions illisible, réservations des autres sessions non lues : ${e.message}`); }
  }
  return lettreAvecReservations({ dossier, prefixe, jour, contenu, extension, porte }, { ...reservations, noms: [...reservations.noms, ...nomsDesDossiers(aussi)] });
}

/**
 * `--reserver` : sous le verrou du registre des sessions du produit, l'indice rendu ET sa réservation pour la session courante, une
 * revendication du nom de fichier (`origine: allouer-indice --reserver`). Rend { lettre, nom, chemin, deja, registre, session, source }.
 * Lève `ErreurUsage` hors d'un produit, ou sans session identifiée.
 */
export function reserverIndice({ dossier, prefixe = "", jour, contenu, extension = ".html", porte = "dossier", session = sessionCourante(), maintenant = Date.now(), aussi = [] }) {
  if (!/^\d{8}$/.test(String(jour))) throw new Error(`jour attendu AAAAMMJJ, reçu « ${jour} »`);
  prefixe = prefixeDeNom(prefixe);
  if (!session?.id) throw new ErreurUsage("--reserver exige une session identifiée : FORGE_SESSION_ID (posée par le hook SessionStart) ou CLAUDE_CODE_SESSION_ID");
  const p = registreDuDossier(dossier);
  if (!p) throw new ErreurUsage(`${resolve(dossier)} n'est sous aucun produit (aucun dossier forge/ en remontant) : le registre des sessions vit chez un produit ; sans --reserver, l'indice se rend sans réservation`);
  let r;
  sousVerrouDuRegistre(p.reg, (lu) => {
    const etat = etatDesSessions(lu.lignes, { maintenant });
    const reservees = nomsReserves(etat, p.relatif, { prefixe, extension, jour, session: session.id, dossier: p.dossier });
    const lettre = lettreAvecReservations({ dossier: p.dossier, prefixe, jour, contenu, extension, porte },
      { ...reservees, noms: [...reservees.noms, ...nomsDesDossiers(aussi)] });
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
 *                                   [--contenu-fichier <f>] [--porte dossier|prefixe] [--reserver] [--aussi <dossier>]...
 *
 * `--aussi <dossier>` (répétable, TF-2634) : les noms de cet autre dossier comptent comme pris. Pour un LOT DE RETOURS, l'indice se lit dans
 * `forge/retours/` ET dans le sas du pilot (`input/00-retours/_arrivee`) juste avant l'écriture : une autre session du produit a pu remettre un lot
 * du même jour sans qu'il soit chez celle-ci (RP-217, 12/11/2026). Un dossier introuvable est refusé (exit 2), jamais ignoré.
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
  const AVEC_VALEUR = new Set(["dossier", "prefixe", "jour", "extension", "contenu-fichier", "porte", "aussi"]);
  let reserver = false;
  const aussi = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--reserver") { reserver = true; continue; }
    if (a.startsWith("--")) {
      const cle = a.slice(2);
      if (!AVEC_VALEUR.has(cle) || i + 1 >= argv.length) { erreur(`option inconnue ou sans valeur : ${a}\n`); return 2; }
      if (cle === "aussi") { aussi.push(argv[++i]); continue; }
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
      const r = reserverIndice({ dossier, prefixe, jour, contenu, extension, porte, aussi });
      sortie(`${r.lettre}\n`);
      erreur(`indice ${r.lettre} ${r.deja ? "déjà réservé" : "réservé"} pour la session ${r.session.slice(0, 8)} (${r.source}) : ${r.chemin}, registre ${r.registre}\n`);
      return 0;
    }
    sortie(`${allouerIndiceVuDuRegistre({ dossier, prefixe, jour, contenu, extension, porte, aussi, avertir: (t) => erreur(`${t}\n`) })}\n`);
    return 0;
  } catch (e) { erreur(`${e.message}\n`); return e instanceof ErreurUsage ? 2 : 1; }
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  process.exit(executerCli(process.argv.slice(2)));
}
