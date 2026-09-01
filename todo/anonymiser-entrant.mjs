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

  // 4) référentiel ABSENT → refus, jamais un passage silencieux
  process.env.FORGE_NOMS_INTERDITS = join(dir, "absent.json");
  let refuse = false;
  try { anonymiser("Zorglub"); } catch { refuse = true; }
  if (!refuse) casse.push("référentiel absent et le texte passe quand même — le convoi n'est pas arrêté");

  for (const m of casse) console.log("  [FAIL] " + m);
  console.log(`\nSelf-test anonymiseur d'entrants : ${4 - casse.length}/4 cas, ${casse.length} FAIL`);
  process.exit(casse.length ? 1 : 0);
}
