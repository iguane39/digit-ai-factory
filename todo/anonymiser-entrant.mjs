#!/usr/bin/env node
/**
 * anonymiser-entrant.mjs — retire les noms de CLIENTS et de PRODUITS de tout ce qui entre au
 * registre, avant l'écriture.
 *
 * ============================================================================================
 * POURQUOI CE MODULE EXISTE, ET POURQUOI IL EST DANS LA CHAÎNE PLUTÔT QU'À CÔTÉ
 * ============================================================================================
 *
 * LE 27/08, dix dépôts publics ont dû être réécrits parce qu'ils portaient le nom d'un client :
 * 115 fichiers, 648 occurrences, quatre livrables clients entiers. Le 28/08 au matin, cinq lots
 * de retours attendaient dans la boîte — huit fichiers sur dix portaient encore ce nom. Ils ont
 * été pseudonymisés À LA MAIN avant ingestion. À 09:47 le même jour, UN NOUVEAU LOT est arrivé,
 * porteur du même nom.
 *
 * C'est la démonstration en trois actes qu'un geste manuel ne tient pas : le flux des retours est
 * continu, et chaque lot qui arrive porte le nom du produit qui l'envoie. Tant que la
 * substitution vit dans les doigts de celui qui ingère, elle sera oubliée le jour où il pense à
 * autre chose — et ce jour-là, le nom repart dans un dépôt public. La loi transverse n° 1 le dit
 * autrement : toute affordance est câblée ou n'existe pas.
 *
 * ============================================================================================
 * DEUX RÉFÉRENTIELS, ET AUCUN NE VIT DANS UN DÉPÔT
 * ============================================================================================
 *
 * Un contrôle qui embarquerait la liste des noms interdits PUBLIERAIT EXACTEMENT CE QU'IL
 * PROTÈGE (loi n° 4 : une donnée volatile est une donnée, pas du code) :
 *
 *   · `<racine>/_noms-interdits.json`      — les CLIENTS, table figée, alimentée à la main ;
 *   · `<racine>/_produits-pseudonymes.json` — les PRODUITS, table qui S'ÉTEND TOUTE SEULE : un
 *     produit inconnu reçoit le prochain pseudonyme libre et l'association est écrite. Sans quoi
 *     il faudrait déclarer chaque produit avant son premier lot, et le premier lot passerait.
 *
 * L'absence d'un référentiel ne se contourne pas en silence : `anonymiser()` REFUSE, elle ne
 * laisse pas passer. Un anonymiseur qui ne peut pas anonymiser doit arrêter le convoi.
 *
 * ============================================================================================
 * CE QU'IL NE FAIT PAS, ET C'EST DÉCLARÉ
 * ============================================================================================
 *
 *   · il ne relit pas ce qui est DÉJÀ au registre — il garde la porte, il ne rattrape pas ;
 *   · il ne voit que le TEXTE des champs qu'on lui donne ;
 *   · un client ou un produit dont le nom n'apparaît nulle part dans les deux tables passe :
 *     la table des produits s'étend à la découverte, celle des clients non.
 *
 * Usage comme module : import { anonymiser, pseudoProduit } from "./anonymiser-entrant.mjs";
 * Usage en ligne de commande : node anonymiser-entrant.mjs --self-test
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { cheminsTables } from "../scripts/lib-confidentiel.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = process.env.FORGE_ROOT || join(ICI, "..", "..");

const CHEMIN_CLIENTS = () => cheminsTables(RACINE).clients; // canal confidentiel (D-28 a), env, ou ancien fichier libre
const CHEMIN_PRODUITS = () => cheminsTables(RACINE).produits;

// Un sigle court se cherche en MOT ENTIER : mesuré le 27/08, le sigle d'un opérateur télécom
// inscrit comme un nom ordinaire attrapait `candidatsFreres` et `resFront`, deux identifiants de
// code bien réels. La frontière exclut lettres, chiffres et souligné — un tiret ou un point EST
// une frontière, ce qui couvre une forme composée du genre `COMPTA-XYZ` sans toucher un
// identifiant de code qui contiendrait les mêmes lettres au milieu d'un mot.
// LES EXEMPLES DE CE FICHIER SONT INVENTÉS, et c'est une règle : le 27/08, un oracle écrit
// pour traquer les noms de clients a été refusé par lui-même parce que son propre commentaire
// en citait un en exemple.
// LA CASSE, et elle a coûté une passe entière (01/09/2026). Ce motif était sensible à la casse
// (`"g"` seul) là où la PORTE de publication, elle, compare sans y être sensible. Résultat
// mesuré sur le parc : un anonymiseur passé sur 187 fichiers laissait `20260814-tests-Fournisseur-A` —
// le sigle en minuscules — et la porte le refusait juste après. Deux contrôles du même sujet
// qui ne s'accordent pas sur la casse donnent le pire des deux mondes : le nettoyage se croit
// fini, et le refus tombe à la publication, quand il coûte le plus cher à comprendre.
const bordé = (mot) => new RegExp(`(?<![A-Za-z0-9_])${mot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z0-9_])`, "gi");

function lireClients() {
  const p = CHEMIN_CLIENTS();
  if (!existsSync(p)) return null;
  const d = JSON.parse(readFileSync(p, "utf8"));
  const table = [];
  for (const n of d.noms || []) {
    const maj = n.toUpperCase(), bas = n.toLowerCase();
    const cap = n[0].toUpperCase() + n.slice(1).toLowerCase();
    const cible = d.pseudonymes && d.pseudonymes[n];
    if (!cible) continue;                       // sans pseudonyme déclaré, on ne devine pas
    table.push([maj, cible.toUpperCase()], [cap, cible], [bas, cible.toLowerCase()]);
  }
  for (const i of d.identifiants || []) {
    const cible = (d.pseudonymes || {})[i];
    if (cible) table.push([i, cible]);
  }
  const sigles = [];
  for (const g of d.sigles || []) {
    const cible = (d.pseudonymes || {})[g];
    if (cible) sigles.push([g, cible]);
  }
  return { table, sigles };
}

/**
 * Les VARIANTES de graphie d'un nom de produit, en une expression (TF-0742) : mots de la clé
 * séparés par rien, une espace, un tiret ou un souligné, en toute casse, bornés par des
 * non-alphanumériques. `null` quand la clé n'a qu'un mot (rien à dériver, et un mot seul en
 * toute casse mordrait sur de la prose) ou porte un point (graphie de domaine, prise telle quelle).
 */
export function variantes(nom) {
  if (typeof nom !== "string" || nom.includes(".")) return null;
  const mots = nom.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[\s\-_]+/).filter(Boolean);
  if (mots.length < 2 || mots.join("").length < 8) return null;
  const corps = mots.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[\\s\\-_]*");
  // Le SOULIGNÉ est une frontière d'identifiant, pas une frontière de mot (TF-0927, 08/09) :
  // écrites `[A-Za-z0-9]`, ces bornes laissaient `calc_<nom>_total` matcher, et la substitution
  // coupait l'identifiant que la garde du dessous venait de refuser de couper. Deux gardes du
  // même sujet qui ne s'accordent pas sur l'alphabet donnent le pire des deux mondes — la même
  // leçon que la casse, au même endroit. `bordé` excluait déjà `_` ; celle-ci ne le faisait pas.
  return new RegExp(`(?<![A-Za-z0-9_])${corps}(?![A-Za-z0-9_])`, "gi");
}

function lireProduits() {
  const p = CHEMIN_PRODUITS();
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf8"));
}

/** Un émetteur FORGE (ou le pilot, ou la file de tickets) : nom public, jamais pseudonymisé (TF-0807). */
export const EST_EMETTEUR_FORGE = /^digit-ai-(forge-[a-z0-9-]+|factory|queue)$/i;

/** Le processus courant est-il un banc de test ? Mesuré sur son point d'entrée, jamais deviné. */
const estUnBanc = () => /\.test\.mjs$/i.test(process.argv[1] || "") || process.argv.includes("--self-test");

/** Le chemin vise-t-il une table JETABLE, sous le répertoire temporaire du système ? */
function sousRepertoireTemporaire(chemin) {
  const norme = (x) => String(x).replaceAll("\\", "/").toLowerCase();
  return norme(chemin).startsWith(norme(tmpdir()));
}

/**
 * La garde, isolée pour être éprouvable SANS rien écrire nulle part : un banc de test qui vise une
 * table hors du répertoire temporaire du système ne doit pas pouvoir l'étendre.
 */
export const extensionInterdite = (chemin) => estUnBanc() && !sousRepertoireTemporaire(chemin);

/** Pseudonyme STABLE d'un produit ; l'inscrit s'il est inconnu. */
export function pseudoProduit(nom) {
  const p = CHEMIN_PRODUITS();
  // UN BANC DE TEST N'ÉTEND JAMAIS LE RÉFÉRENTIEL RÉEL (08/09/2026), et c'est la TROISIÈME fois
  // que la même classe se paie ici : la garde du dessus — « un nom de moins de 5 caractères ne
  // s'inscrit pas » — est née le 02/09 d'une fixture non isolée qui avait inscrit son produit
  // jouet. Elle traitait la LONGUEUR du nom, pas la CAUSE.
  //
  // Le fait, mesuré le 08/09 : les 46 bancs du dépôt ont été joués d'affilée avec les variables
  // d'environnement pointant sur les tables RÉELLES du canal confidentiel. Cinq bancs ne posent
  // pas leurs propres tables jetables ; leurs neuf produits jouets sont entrés dans la table de
  // production, et la porte de publication a refusé le dépôt sur 81 constats — tous nés de noms
  // inventés par des fixtures. Corriger les cinq bancs aurait été exact et insuffisant : le
  // sixième banc écrit demain repartirait avec le même défaut (loi n° 1, toute affordance est
  // câblée ou n'existe pas).
  //
  // La garde vit donc au point de PASSAGE, et elle ne devine rien : le point d'entrée du
  // processus est-il un banc (`*.test.mjs`, ou `--self-test`), et la table visée est-elle hors du
  // répertoire temporaire du système ? Les deux ensemble, et seulement les deux, valent refus —
  // un banc correct pose ses tables sous `tmpdir()` et passe, l'ingestion réelle n'est pas un
  // banc et passe aussi. Le refus est BRUYANT : un banc qui ne s'isole pas doit le savoir.
  if (extensionInterdite(p)) {
    throw new Error(
      `un banc de test ne peut pas étendre le référentiel réel des produits (${p}) : poser des tables `
      + "jetables sous le répertoire temporaire et les désigner par FORGE_NOMS_INTERDITS et "
      + "FORGE_PRODUITS_PSEUDO, comme le font les autres bancs du dossier");
  }
  const d = lireProduits();
  if (!d) return null;
  d.produits = d.produits || {};
  // UN NOM QUI EST DÉJÀ UN PSEUDONYME NE S'INSCRIT PAS (02/09/2026, payé en ingérant un lot
  // anonymisé sur disque avant son ingestion) : « Produit-12 » lu dans le nom du lot était
  // inconnu comme CLÉ, donc inscrit comme produit neuf → « Produit-13 », et l'anonymiseur a
  // ensuite substitué Produit-12 par Produit-13 dans dix candidatures. Une table qui pseudonymise
  // ses propres pseudonymes tourne en rond, et chaque tour décale tout le parc d'un cran.
  if (Object.values(d.produits).includes(nom) || /^Produit-\d{2,}$/.test(nom)) return nom;
  // UNE FORGE N'EST PAS UN PRODUIT (TF-0807, 05/09/2026) : le gabarit des lots autorise une forge à
  // remettre un lot au pilot, préfixé de son nom — et ce nom est PUBLIC (dépôt publié, cité par le
  // noyau). Le 05/09, trois lots de forges ont inscrit « Produit-60 », « Produit-61 », « Produit-62 »
  // à la table et rendu le registre illisible (« demandeur : Produit-60 » pour un constat de la forge
  // de développement). Un émetteur forge garde son nom et n'entre jamais à la table.
  if (EST_EMETTEUR_FORGE.test(nom)) return nom;
  // UN NOM TROP COURT NE S'INSCRIT PAS NON PLUS (02/09, second cas payé le même jour) : « PROD »,
  // nom de fixture d'une recette non isolée, inscrit comme produit — et une clé de quatre lettres
  // substituée par inclusion réécrit « PRODUCTION » en « Produit-13UCTION ». Le refus est dit.
  if (nom.length < 5) { console.error(`[ANONYMISÉ] « ${nom} » n'est pas inscrit : un nom de produit fait au moins 5 caractères (une clé courte mordrait sur les mots qui la contiennent)`); return null; }
  if (!d.produits[nom]) {
    const n = Object.keys(d.produits).length + 1;
    d.produits[nom] = `Produit-${String(n).padStart(2, "0")}`;
    d.date_derniere_extension = new Date().toISOString().slice(0, 10);
    writeFileSync(p, JSON.stringify(d, null, 1), "utf8");
  }
  return d.produits[nom];
}

// Les caractères dont est fait un identifiant de code, dans à peu près tous les langages.
const IDENT = /[A-Za-z0-9_]/;

/**
 * Substitution LITTÉRALE d'un nom, occurrence par occurrence, qui REFUSE de couper un
 * identifiant de code — et le dit (TF-0927).
 *
 * ============================================================================================
 * LE FAIT, ET IL A COÛTÉ DIX-HUIT JOURS DE TESTS MUETS
 * ============================================================================================
 *
 * Le 20/08, une passe de pseudonymisation a remplacé un nom de produit AU MILIEU d'un
 * identifiant de fonction Python. Le pseudonyme porte un tiret (`Produit-07`, `Client-A`) ;
 * le tiret n'est pas un caractère d'identifiant. Le module est devenu non compilable, la
 * collecte de la suite de tests s'est arrêtée sur l'erreur d'import, zéro test a été joué —
 * et rien ne l'a signalé pendant DIX-HUIT JOURS. La forge des tests a livré le garde-fou du
 * SYMPTÔME (un module non collectable est un échec nommé, pas un silence) ; la CAUSE est ici.
 *
 * ============================================================================================
 * POURQUOI REFUSER PLUTÔT QUE SUBSTITUER AUTREMENT
 * ============================================================================================
 *
 * On pouvait dériver un pseudonyme sans tiret pour les contextes de code. Ç'aurait été deux
 * pseudonymes pour un produit, donc deux vérités dans le registre, et la règle K5 du canal
 * confidentiel dit l'inverse : un pseudonyme par produit. Surtout, un identifiant de code qui
 * porte un nom de client est un défaut de nommage du CODE : il se renomme, avec ses appelants,
 * par un développeur qui sait ce qu'il casse. Une substitution de texte ne sait pas cela.
 *
 * Le refus n'est donc pas une abstention : c'est le seul verdict exact. Il laisse le nom en
 * place, l'inscrit dans `refuses`, et la porte de publication continuera de refuser le dépôt —
 * ce qui rend le défaut visible AVANT la publication au lieu de le rafistoler en silence.
 *
 * La borne, dans l'autre sens : un remplacement collé dont le pseudonyme n'introduit AUCUN
 * caractère étranger à un identifiant reste fait. Refuser là serait perdre des nettoyages
 * légitimes sans rien protéger.
 *
 * ============================================================================================
 * ET LE CONTEXTE, PARCE QUE HORS DU CODE LA MÊME GARDE DÉTRUIT AUTRE CHOSE
 * ============================================================================================
 *
 * La garde ne s'arme que sur un texte DÉCLARÉ code par son appelant (`anonymiser(t, { code:
 * true })`). Mesuré en la posant d'abord partout : `scripts/lib-pseudonyme-produit.mjs` résout
 * le pseudonyme d'un produit en anonymisant son nom DEUX FOIS, et la table porte donc des clés
 * déjà à moitié pseudonymisées, nées d'une substitution COLLÉE. Armée sur ces noms, la garde
 * rendait un produit connu introuvable — un banc vert depuis le 03/09 est passé au rouge.
 *
 * Un nom de produit n'est pas un identifiant de code : le couper n'y casse aucune compilation.
 * C'est bien le CONTEXTE qui discrimine, comme le demandait l'item, et il se déclare — il ne se
 * devine pas depuis le texte.
 */
function substituerHorsIdentifiant(texte, nom, pseudo, refuses, code) {
  if (!texte.includes(nom)) return { texte, fait: false };
  const pseudoCasseUnIdent = code && [...String(pseudo)].some((c) => !IDENT.test(c));
  let out = "", i = 0, fait = false;
  for (;;) {
    const j = texte.indexOf(nom, i);
    if (j < 0) { out += texte.slice(i); break; }
    const avant = j > 0 ? texte[j - 1] : "";
    const apres = j + nom.length < texte.length ? texte[j + nom.length] : "";
    const collé = (avant && IDENT.test(avant)) || (apres && IDENT.test(apres));
    if (collé && pseudoCasseUnIdent) {
      refuses.push({
        nom_masqué: `${nom.length} caractère(s)`, pseudo,
        motif: "l'occurrence est collée à un caractère d'identifiant et le pseudonyme en introduirait un "
          + "étranger — substituer casserait le code ; l'identifiant se renomme à la main",
        autour: texte.slice(Math.max(0, j - 24), j).replace(/\s+/g, " ")
          + "⟦…⟧" + texte.slice(j + nom.length, j + nom.length + 24).replace(/\s+/g, " "),
      });
      out += texte.slice(i, j + nom.length);
    } else { out += texte.slice(i, j) + pseudo; fait = true; }
    i = j + nom.length;
  }
  return { texte: out, fait };
}

/**
 * Anonymise un texte. Rend `{ texte, remplaces, refuses }`, ou lève si un référentiel manque —
 * un anonymiseur qui ne peut pas anonymiser arrête le convoi, il ne laisse pas passer.
 * `refuses` n'est jamais vide pour rien : chaque entrée est une occurrence LAISSÉE EN PLACE.
 */
export function anonymiser(texte, { code = false } = {}) {
  if (typeof texte !== "string" || !texte) return { texte, remplaces: [], refuses: [] };
  const clients = lireClients();
  const produits = lireProduits();
  if (!clients) throw new Error(`référentiel des clients introuvable (${CHEMIN_CLIENTS()}) — ` +
    "l'ingestion s'arrête : anonymiser à moitié serait pire que ne pas anonymiser");
  if (!produits) throw new Error(`référentiel des produits introuvable (${CHEMIN_PRODUITS()}) — ` +
    "l'ingestion s'arrête : anonymiser à moitié serait pire que ne pas anonymiser");
  const remplaces = [];
  const refuses = [];
  let out = texte;
  // Les PRODUITS d'abord : leurs noms sont souvent plus longs et contiennent parfois un nom de
  // client (`Produit-04`). Substituer le client en premier casserait la clé du produit.
  // TF-0913 (08/09/2026) — LA CLÉ LA PLUS LONGUE D'ABORD, ET C'EST TOUT L'ÉCART.
  //
  // LE FAIT, mesuré deux fois le 08/09 sur des lots réels : la table portait « X » et
  // « X_Reporting », deux produits distincts. `Object.entries` rend les clés dans l'ordre
  // d'insertion ; la courte est arrivée la première, `out.split(nom).join(pseudo)` a coupé au
  // milieu de la longue, et quinze fichiers ont été nommés et réécrits sous le pseudonyme du
  // MAUVAIS produit. Le registre, lui, portait le bon : `ingerer-lot` résout le nom complet.
  // Personne n'a rien écrit à la main, et l'outil affichait « [ANONYMISÉ] » à chaque passe.
  //
  // Le remède ne coûte qu'un tri : une clé qui en contient une autre passe AVANT elle, donc la
  // courte ne trouve plus rien à couper. Il vaut aussi pour les clients ci-dessous, où le même
  // recouvrement existe (un sigle contenu dans un nom).
  const parLongueur = (a, b) => String(b[0]).length - String(a[0]).length;
  for (const [nom, pseudo] of Object.entries(produits.produits || {}).sort(parLongueur)) {
    const litt = substituerHorsIdentifiant(out, nom, pseudo, refuses, code);
    if (litt.fait) { out = litt.texte; remplaces.push(nom); } else out = litt.texte;
    // TF-0742 (02/09/2026) : UNE table qui n'énumère qu'une graphie ne protège que cette graphie.
    // Mesuré le 01/09 : la clé concaténée était substituée, la forme ESPACÉE du même nom — écrite
    // en toutes lettres dans le titre et le contenu — traversait, et deux occurrences sont entrées
    // au registre suivi pendant que l'outil affichait « [ANONYMISÉ] ». Les variantes se DÉRIVENT
    // donc de la clé : ses mots (frontières de casse, tirets, soulignés) peuvent être séparés par
    // rien, une espace, un tiret ou un souligné, en toute casse. Une clé qui porte un point est une
    // graphie de domaine et se prend telle quelle : la dériver attraperait des liens légitimes.
    const re = variantes(nom);
    if (re && re.test(out)) { out = out.replace(re, pseudo); remplaces.push(nom); }
    // TF-0826 (08/09/2026) — LA CASSE, POUR LES PRODUITS AUSSI, ET ELLE A DORMI SEPT JOURS.
    //
    // La ligne du dessus compare avec `includes`, donc À LA CASSE PRÈS. La table portait un nom
    // de produit en capitale initiale ; treize fichiers suivis du dépôt PUBLIC du pilot en
    // portaient la graphie minuscule — un nom de domaine, forme naturelle dans de la prose. Le
    // module passait dessus à chaque exécution en rendant « 0 à réécrire », et la porte de
    // publication ne rattrapait rien : elle ne connaît que la table des CLIENTS.
    //
    // Le commentaire de `bordé`, écrit le 01/09, dit DÉJÀ la leçon — « deux contrôles du même
    // sujet qui ne s'accordent pas sur la casse donnent le pire des deux mondes » — mais elle
    // n'avait été appliquée qu'aux sigles des clients. Une leçon rangée dans un commentaire
    // n'est pas un correctif : elle vaut pour chaque site qui compare des noms.
    //
    // Bornée, parce qu'insensible à la casse SANS frontière, une clé courte mordrait sur de la
    // prose ordinaire. Additive, parce qu'elle vient APRÈS la voie littérale : une occurrence
    // que celle-ci attrapait au milieu d'un mot reste attrapée, rien ne se perd. Mesuré sur les
    // 1367 fichiers suivis du pilot : 13 fichiers gagnés, 0 perdu, 0 clé nouvellement mordante.
    const bord = bordé(nom);
    if (bord.test(out)) { out = out.replace(bordé(nom), pseudo); remplaces.push(nom); }
  }
  for (const [de, vers] of [...clients.table].sort(parLongueur)) {
    // Même garde pour les clients : c'est un nom de CLIENT qui a cassé le module Python le 20/08.
    const litt = substituerHorsIdentifiant(out, de, vers, refuses, code);
    out = litt.texte;
    if (litt.fait) remplaces.push(de);
  }
  for (const [de, vers] of clients.sigles) {
    const re = bordé(de);
    if (re.test(out)) { out = out.replace(bordé(de), vers); remplaces.push(de); }
  }
  return { texte: out, remplaces: [...new Set(remplaces)], refuses };
}

/** Anonymise les champs texte d'une candidature, en place sur une copie. */
export function anonymiserCandidature(c) {
  const copie = { ...c };
  const touches = [];
  for (const champ of ["titre", "contenu", "demandeur", "source", "preuve_du_cout"]) {
    if (typeof copie[champ] === "string") {
      const { texte, remplaces } = anonymiser(copie[champ]);
      copie[champ] = texte;
      touches.push(...remplaces);
    }
  }
  return { candidature: copie, remplaces: [...new Set(touches)] };
}

// ---- self-test : les DEUX sens, sur des tables jetables ------------------------------------
//
// LA GARDE D'IMPORT (01/09/2026), et elle a été payée pour être vue. Ce bloc se déclenchait sur
// `process.argv[2] === "--self-test"` SEUL, sans vérifier que ce fichier est le point d'entrée.
// Conséquence : tout module qui l'IMPORTE et qu'on lance avec `--self-test` voyait le banc de
// l'anonymiseur s'exécuter à sa place, puis `process.exit` emporter la session avant que son
// propre banc n'ait joué une seule ligne — un banc qui rend 4/4 verts pour un module qui n'a
// rien été testé. C'est le pire état d'un contrôle : il rassure au lieu de juger.
//
// Le défaut était DÉJÀ NOMMÉ dans ce dossier — `todo\journaliser.mjs` porte la même garde et
// écrit pourquoi : « un module dont l'import déclenche la ligne de commande n'est pas
// importable ». La leçon existait, l'idiome existait, et ce fichier ne l'avait pas repris.
if (process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
    === process.argv[1].toLowerCase().replaceAll("\\", "/") && process.argv[2] === "--self-test") {
  const { mkdtempSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const dir = mkdtempSync(join(tmpdir(), "anon-entrant-"));
  const casse = [];
  writeFileSync(join(dir, "_noms-interdits.json"), JSON.stringify({
    noms: ["Zorglub"], identifiants: ["wks-99999999999999"], sigles: ["ZRG"],
    pseudonymes: { Zorglub: "Client-A", "wks-99999999999999": "wks-00000000000000", ZRG: "Sigle-A" },
  }), "utf8");
  writeFileSync(join(dir, "_produits-pseudonymes.json"), JSON.stringify({
    produits: { "CalculatriceZorglubZAP": "Produit-01", "Gribouille-ai.fr": "Produit-02" },
  }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(dir, "_noms-interdits.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(dir, "_produits-pseudonymes.json");

  // 1) un texte porteur est nettoyé — client, identifiant, sigle et produit
  const r1 = anonymiser("Lot de CalculatriceZorglubZAP pour Zorglub, espace wks-99999999999999, facture ZRG.");
  if (/Zorglub|wks-99999999999999|\bZRG\b/.test(r1.texte)) casse.push("un texte porteur n'est pas nettoyé : " + r1.texte);
  if (!r1.texte.includes("Produit-01")) casse.push("le nom de produit n'est pas remplacé par son pseudonyme");

  // 2) SECOND SENS — un mot qui CONTIENT le sigle sans en être un ne doit pas bouger
  const r2 = anonymiser("Les identifiants candidatsFreres et resFront ne sont pas des sigles.");
  if (r2.texte !== "Les identifiants candidatsFreres et resFront ne sont pas des sigles.")
    casse.push("le sigle mord sur de la prose ordinaire : " + r2.texte);

  // 3) un produit INCONNU reçoit un pseudonyme stable, et le même au second appel
  const p1 = pseudoProduit("un-produit-neuf");
  const p2 = pseudoProduit("un-produit-neuf");
  if (!p1 || p1 !== p2) casse.push(`le pseudonyme d'un produit n'est pas stable : ${p1} puis ${p2}`);
  if (p1 === "Produit-01") casse.push("un produit neuf réutilise le pseudonyme d'un autre");

  // 2 bis) TF-0742 — les VARIANTES de graphie d'un produit sont substituées : forme espacée en
  //        toute casse, tirets, soulignés ; et le second sens : un mot seul de la clé ne bouge pas
  const r2b = anonymiser("Le site Calculatrice zorglub zap, dit calculatrice-Zorglub-ZAP ou calculatrice_zorglub_zap, est en ligne.");
  if (/calculatrice[\s\-_]*zorglub[\s\-_]*zap/i.test(r2b.texte)) casse.push("une graphie espacée, tiretée ou soulignée du produit traverse : " + r2b.texte);
  if ((r2b.texte.match(/Produit-01/g) || []).length !== 3) casse.push("les trois graphies ne sont pas toutes remplacées par le pseudonyme : " + r2b.texte);
  const r2c = anonymiser("Une calculatrice ordinaire et le mot ZAP seul ne sont pas des produits.");
  if (r2c.texte.includes("Produit-01")) casse.push("un mot isolé de la clé est pris pour le produit : " + r2c.texte);
  // (nom de domaine INVENTÉ : une clé réelle écrite ici serait réécrite par la passe d'anonymisation
  //  — c'est arrivé le 02/09, et le banc s'est mis à tester autre chose que ce qu'il croyait)
  if (variantes("Zorglub-ai.fr") !== null) casse.push("une clé de domaine (avec un point) se voit dériver des variantes — elle doit être prise telle quelle");

  // 3 quater) LA CASSE D'UNE CLÉ DE PRODUIT, DANS LES DEUX SENS (TF-0826, 08/09) — sens vert :
  //           la clé porte une capitale initiale, le texte porte la graphie minuscule du même
  //           nom, et elle est remplacée ; sens rouge : la même graphie COLLÉE dans un mot plus
  //           long n'est pas touchée, sans quoi une clé courte insensible à la casse mordrait
  //           sur de la prose ordinaire.
  const r2d = anonymiser("redéployer gribouille-ai.fr ce soir, puis xgribouille-ai.frx à la marge");
  if (r2d.texte.includes("gribouille-ai.fr ce soir"))
    casse.push("la graphie minuscule d'une clé de produit capitalisée traverse : " + r2d.texte);
  if (!r2d.texte.includes("xgribouille-ai.frx"))
    casse.push("la clé insensible à la casse mord à l'intérieur d'un mot plus long : " + r2d.texte);

  // 3 quinquies) UN REMPLACEMENT NE COUPE PAS UN IDENTIFIANT DE CODE, ET IL LE DIT (TF-0927,
  //              08/09) — le défaut d'origine : un nom substitué au milieu d'un identifiant de
  //              fonction Python y a introduit le tiret du pseudonyme, le module est devenu non
  //              compilable, et la suite de tests n'a plus rien collecté pendant dix-huit jours.
  //              Sens vert : l'occurrence en PROSE est remplacée. Sens rouge : l'occurrence
  //              COLLÉE dans un identifiant reste en place ET remonte dans `refuses`.
  const r2e = anonymiser("def calc_CalculatriceZorglubZAP_total(): pass  # module de CalculatriceZorglubZAP", { code: true });
  if (!r2e.texte.includes("calc_CalculatriceZorglubZAP_total"))
    casse.push("l'identifiant de code a été coupé par la substitution : " + r2e.texte);
  if (!r2e.texte.includes("de Produit-01"))
    casse.push("l'occurrence en prose n'est pas remplacée : " + r2e.texte);
  if (r2e.refuses.length !== 2)
    casse.push(`les refus ne sont pas remontés (produit ET client attendus) : ${JSON.stringify(r2e.refuses)}`);
  if (!r2e.refuses.every((x) => /identifiant/.test(x.motif) && !/Zorglub|Calculatrice/.test(JSON.stringify(x.nom_masqué))))
    casse.push("un refus ne nomme pas son motif, ou recopie le nom qu'il protège : " + JSON.stringify(r2e.refuses));

  //           Et le SECOND SENS DU CONTEXTE : hors code, la garde ne s'arme pas — un nom de
  //           produit à moitié pseudonymisé naît d'une substitution collée, et l'interdire
  //           rendrait introuvable un produit connu de la table (banc de lib-pseudonyme-produit).
  const r2f = anonymiser("def calc_CalculatriceZorglubZAP_total()");
  if (r2f.texte.includes("CalculatriceZorglubZAP"))
    casse.push("hors contexte de code, la garde s'arme quand même : " + r2f.texte);
  if (r2f.refuses.length)
    casse.push("hors contexte de code, un refus est remonté : " + JSON.stringify(r2f.refuses));

  // 3 bis) un nom qui EST déjà un pseudonyme n'est jamais réinscrit ni décalé (02/09)
  const p3 = pseudoProduit("Produit-01");
  if (p3 !== "Produit-01") casse.push(`un pseudonyme réinscrit comme produit neuf : Produit-01 → ${p3}`);
  if (Object.keys(JSON.parse(readFileSync(process.env.FORGE_PRODUITS_PSEUDO, "utf8")).produits).includes("Produit-01"))
    casse.push("la table porte un pseudonyme comme CLÉ — elle pseudonymise ses propres pseudonymes");
  if (anonymiser("lot de Produit-01").texte !== "lot de Produit-01") casse.push("un texte déjà anonymisé est réécrit");

  // 3 sexies) UN BANC N'ÉTEND PAS LE RÉFÉRENTIEL RÉEL (08/09) — la garde est éprouvée SANS rien
  //           écrire : elle est une fonction pure du chemin visé. Sens rouge : un chemin hors du
  //           répertoire temporaire, depuis un banc, est interdit. Sens vert : la table jetable de
  //           ce banc-ci, sous ce même répertoire, est autorisée — sans quoi la garde bloquerait
  //           les bancs corrects, et le cas 3 ci-dessus ne passerait pas. Le défaut d'origine :
  //           46 bancs joués avec les variables pointant sur les tables réelles ont fait entrer
  //           neuf produits jouets dans la table de production, et la porte de publication a
  //           refusé le dépôt sur 81 constats, tous nés de noms inventés par des fixtures.
  if (!extensionInterdite("C:/un/chemin/hors/du/repertoire/temporaire.json"))
    casse.push("un banc peut étendre un référentiel hors du répertoire temporaire — c'est ainsi que neuf produits jouets sont entrés dans la table de production le 08/09");
  if (extensionInterdite(join(dir, "_produits-pseudonymes.json")))
    casse.push("la garde bloque la table JETABLE d'un banc correct — elle empêcherait tous les bancs de s'exécuter");
  let refusDit = "";
  try { pseudoProduit("un-produit-de-fixture"); } catch (e) { refusDit = e.message; }
  if (refusDit && !/FORGE_PRODUITS_PSEUDO/.test(refusDit))
    casse.push("le refus ne nomme pas la variable à poser : " + refusDit);

  // 4) référentiel ABSENT → refus, jamais un passage silencieux
  process.env.FORGE_NOMS_INTERDITS = join(dir, "absent.json");
  let refuse = false;
  try { anonymiser("Zorglub"); } catch { refuse = true; }
  if (!refuse) casse.push("référentiel absent et le texte passe quand même — le convoi n'est pas arrêté");

  for (const m of casse) console.log("  [FAIL] " + m);
  console.log(`\nSelf-test anonymiseur d'entrants : ${9 - casse.length}/9 cas, ${casse.length} FAIL`);
  process.exit(casse.length ? 1 : 0);
}
