#!/usr/bin/env node
/**
 * lib-pseudonyme-produit.mjs — LE NOM D'UN PRODUIT N'ENTRE JAMAIS DANS UN FICHIER SUIVI ; SON
 * PSEUDONYME, SI (décision D-1 (a) du 03/09/2026, porte de publication rouge).
 *
 * LE FAIT PAYÉ. Le relevé d'héritage joué à chaque ouverture du pilot (oracles/hook-ouverture.mjs)
 * journalisait le chemin RÉEL de chaque produit du parc dans `todo/HERITAGE-RELEVES.jsonl`, un
 * fichier SUIVI par git ; `todo/RECIDIVES.md` en est généré. Mesuré le 03/09 à 15:41 par
 * `oracle-nom-client-publie` : 21 constats bloquants C1 sur ces deux fichiers, cinq ouvertures
 * après la réécriture d'historique qui venait justement de retirer ces noms. Un nettoyage qui
 * ne corrige pas l'écrivain est provisoire par construction (même classe que D-37 du 01/09).
 *
 * CE QUE FAIT CE MODULE : il rend, pour un chemin de produit relatif au parc, le NOM PUBLIABLE
 * du produit — son pseudonyme `Produit-NN` quand la table le connaît, sinon un MARQUEUR qui ne le
 * nomme pas (depuis le 23/09/2026, voir plus bas). Il passe par les deux référentiels hors dépôt de
 * `todo/anonymiser-entrant.mjs` — jamais par une liste embarquée ici (loi n° 4 : embarquer la
 * liste des noms interdits publierait ce qu'elle protège).
 *
 * CE QU'IL NE FAIT PAS, ET C'EST MESURÉ : il n'INSCRIT PAS un produit inconnu dans la table.
 * Le premier jet le faisait (pseudoProduit), et l'essai de l'anonymiseur qui a suivi voulait
 * réécrire QUATORZE fichiers suivis — l'archive immuable du registre (R8), un script, des études
 * datées — parce qu'un nom que le parc citait depuis trois semaines venait de recevoir un
 * pseudonyme. L'inscription appartient à l'INGESTION du premier lot (ingerer-lot.mjs), où elle a
 * un sens ; un relevé de lecture n'a pas à changer l'identité d'un produit dans tout le dépôt.
 *
 * CE QU'IL REFUSE : rendre un nom de client. Si un référentiel manque, `anonymiser` lève —
 * l'appelant décide de NE PAS journaliser et le dit, plutôt que d'écrire un nom réel une fois de plus.
 *
 * ET DEPUIS LE 23/09/2026, RENDRE LE NOM D'UN PRODUIT QUE LA TABLE NE CONNAÎT PAS (TF-1323, décision
 * humaine D-10 (a)). Le nom « anonymisé » d'un produit inconnu n'est anonyme que pour les CLIENTS :
 * le nom du produit, lui, sortait tel quel. Mesuré le 22/09 : le journal publié du pilot portait DIX
 * noms de produits hors table, le premier depuis le 03/09, dont celui de la plateforme d'une mission
 * de conseil. Un produit inconnu rend désormais le MARQUEUR ci-dessous — jamais son nom, même
 * anonymisé. L'inscription à la table reste le geste de l'ingestion ; le relevé, lui, ne nomme plus
 * ce qu'il ne sait pas pseudonymiser.
 */
import { basename } from "node:path";
import { anonymiser } from "../todo/anonymiser-entrant.mjs";

/**
 * Ce que le journal écrit à la place d'un produit inconnu de la table. Il ne porte AUCUNE partie du
 * nom : ni préfixe, ni longueur, ni empreinte — une empreinte sans secret se confirme en hachant un
 * nom deviné. Le prix est déclaré : deux produits inconnus sont indiscernables dans le journal, et
 * ceux qui le lisent (`todo/generer-recidives.mjs`) les comptent à part au lieu de les attribuer.
 */
export const MARQUEUR_PRODUIT_HORS_TABLE = "(produit hors table)";

/**
 * Nom publiable d'un produit à partir de son chemin relatif au parc (« _Client/Sous/produit »).
 * Rend « Produit-NN » si la table le connaît, sinon `MARQUEUR_PRODUIT_HORS_TABLE` ; lève si un
 * référentiel manque.
 */
export function pseudonymeProduit(cheminRelatif) {
  const nom = basename(String(cheminRelatif).replaceAll("\\", "/"));
  // DEUX PASSES, et la recette l'a exigé : `anonymiser` substitue les PRODUITS avant les CLIENTS.
  // Un nom de dossier qui porte le client (« OutilFictilabsZAP », nom inventé) ne rejoint la clé
  // de la table (« OutilClient-ZZAP », clé déjà pseudonymisée côté client) qu'après la
  // substitution du client — donc au second passage seulement. Sur un texte déjà propre, la
  // seconde passe ne change rien. (Exemples inventés : le 03/09, la réécriture d'historique a
  // remplacé dans ce commentaire même un nom réel de produit cité en exemple — la loi n° 4 vaut
  // aussi pour les commentaires.)
  const propre = anonymiser(anonymiser(nom).texte).texte;
  // Un pseudonyme présent dans le texte (« Produit-02.com », « Produit-11 ») EST la réponse : le
  // réinscrire créerait un pseudonyme de pseudonyme (défaut payé le 02/09, note de la table).
  const deja = propre.match(/Produit-\d{2,}/);
  return deja ? deja[0] : MARQUEUR_PRODUIT_HORS_TABLE;
}
