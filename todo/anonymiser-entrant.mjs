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

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = process.env.FORGE_ROOT || join(ICI, "..", "..");

const CHEMIN_CLIENTS = () => process.env.FORGE_NOMS_INTERDITS || join(RACINE, "_noms-interdits.json");
const CHEMIN_PRODUITS = () => process.env.FORGE_PRODUITS_PSEUDO || join(RACINE, "_produits-pseudonymes.json");

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
  return new RegExp(`(?<![A-Za-z0-9])${corps}(?![A-Za-z0-9])`, "gi");
}

function lireProduits() {
  const p = CHEMIN_PRODUITS();
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf8"));
}

/** Pseudonyme STABLE d'un produit ; l'inscrit s'il est inconnu. */
export function pseudoProduit(nom) {
  const p = CHEMIN_PRODUITS();
  const d = lireProduits();
  if (!d) return null;
  d.produits = d.produits || {};
  // UN NOM QUI EST DÉJÀ UN PSEUDONYME NE S'INSCRIT PAS (02/09/2026, payé en ingérant un lot
  // anonymisé sur disque avant son ingestion) : « Produit-12 » lu dans le nom du lot était
  // inconnu comme CLÉ, donc inscrit comme produit neuf → « Produit-13 », et l'anonymiseur a
  // ensuite substitué Produit-12 par Produit-13 dans dix candidatures. Une table qui pseudonymise
  // ses propres pseudonymes tourne en rond, et chaque tour décale tout le parc d'un cran.
  if (Object.values(d.produits).includes(nom) || /^Produit-\d{2,}$/.test(nom)) return nom;
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

/**
 * Anonymise un texte. Rend `{ texte, remplaces }`, ou lève si un référentiel manque —
 * un anonymiseur qui ne peut pas anonymiser arrête le convoi, il ne laisse pas passer.
 */
export function anonymiser(texte) {
  if (typeof texte !== "string" || !texte) return { texte, remplaces: [] };
  const clients = lireClients();
  const produits = lireProduits();
  if (!clients) throw new Error(`référentiel des clients introuvable (${CHEMIN_CLIENTS()}) — ` +
    "l'ingestion s'arrête : anonymiser à moitié serait pire que ne pas anonymiser");
  if (!produits) throw new Error(`référentiel des produits introuvable (${CHEMIN_PRODUITS()}) — ` +
    "l'ingestion s'arrête : anonymiser à moitié serait pire que ne pas anonymiser");
  const remplaces = [];
  let out = texte;
  // Les PRODUITS d'abord : leurs noms sont souvent plus longs et contiennent parfois un nom de
  // client (`Produit-04`). Substituer le client en premier casserait la clé du produit.
  for (const [nom, pseudo] of Object.entries(produits.produits || {})) {
    if (out.includes(nom)) { out = out.split(nom).join(pseudo); remplaces.push(nom); }
    // TF-0742 (02/09/2026) : UNE table qui n'énumère qu'une graphie ne protège que cette graphie.
    // Mesuré le 01/09 : la clé concaténée était substituée, la forme ESPACÉE du même nom — écrite
    // en toutes lettres dans le titre et le contenu — traversait, et deux occurrences sont entrées
    // au registre suivi pendant que l'outil affichait « [ANONYMISÉ] ». Les variantes se DÉRIVENT
    // donc de la clé : ses mots (frontières de casse, tirets, soulignés) peuvent être séparés par
    // rien, une espace, un tiret ou un souligné, en toute casse. Une clé qui porte un point est une
    // graphie de domaine et se prend telle quelle : la dériver attraperait des liens légitimes.
    const re = variantes(nom);
    if (re && re.test(out)) { out = out.replace(re, pseudo); remplaces.push(nom); }
  }
  for (const [de, vers] of clients.table) {
    if (out.includes(de)) { out = out.split(de).join(vers); remplaces.push(de); }
  }
  for (const [de, vers] of clients.sigles) {
    const re = bordé(de);
    if (re.test(out)) { out = out.replace(bordé(de), vers); remplaces.push(de); }
  }
  return { texte: out, remplaces: [...new Set(remplaces)] };
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
    produits: { "CalculatriceZorglubSCC": "Produit-01" },
  }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(dir, "_noms-interdits.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(dir, "_produits-pseudonymes.json");

  // 1) un texte porteur est nettoyé — client, identifiant, sigle et produit
  const r1 = anonymiser("Lot de CalculatriceZorglubSCC pour Zorglub, espace wks-99999999999999, facture ZRG.");
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
  const r2b = anonymiser("Le site Calculatrice zorglub scc, dit calculatrice-Zorglub-SCC ou calculatrice_zorglub_scc, est en ligne.");
  if (/calculatrice[\s\-_]*zorglub[\s\-_]*scc/i.test(r2b.texte)) casse.push("une graphie espacée, tiretée ou soulignée du produit traverse : " + r2b.texte);
  if ((r2b.texte.match(/Produit-01/g) || []).length !== 3) casse.push("les trois graphies ne sont pas toutes remplacées par le pseudonyme : " + r2b.texte);
  const r2c = anonymiser("Une calculatrice ordinaire et le mot SCC seul ne sont pas des produits.");
  if (r2c.texte.includes("Produit-01")) casse.push("un mot isolé de la clé est pris pour le produit : " + r2c.texte);
  // (nom de domaine INVENTÉ : une clé réelle écrite ici serait réécrite par la passe d'anonymisation
  //  — c'est arrivé le 02/09, et le banc s'est mis à tester autre chose que ce qu'il croyait)
  if (variantes("Zorglub-ai.fr") !== null) casse.push("une clé de domaine (avec un point) se voit dériver des variantes — elle doit être prise telle quelle");

  // 3 bis) un nom qui EST déjà un pseudonyme n'est jamais réinscrit ni décalé (02/09)
  const p3 = pseudoProduit("Produit-01");
  if (p3 !== "Produit-01") casse.push(`un pseudonyme réinscrit comme produit neuf : Produit-01 → ${p3}`);
  if (Object.keys(JSON.parse(readFileSync(process.env.FORGE_PRODUITS_PSEUDO, "utf8")).produits).includes("Produit-01"))
    casse.push("la table porte un pseudonyme comme CLÉ — elle pseudonymise ses propres pseudonymes");
  if (anonymiser("lot de Produit-01").texte !== "lot de Produit-01") casse.push("un texte déjà anonymisé est réécrit");

  // 4) référentiel ABSENT → refus, jamais un passage silencieux
  process.env.FORGE_NOMS_INTERDITS = join(dir, "absent.json");
  let refuse = false;
  try { anonymiser("Zorglub"); } catch { refuse = true; }
  if (!refuse) casse.push("référentiel absent et le texte passe quand même — le convoi n'est pas arrêté");

  for (const m of casse) console.log("  [FAIL] " + m);
  console.log(`\nSelf-test anonymiseur d'entrants : ${6 - casse.length}/6 cas, ${casse.length} FAIL`);
  process.exit(casse.length ? 1 : 0);
}
