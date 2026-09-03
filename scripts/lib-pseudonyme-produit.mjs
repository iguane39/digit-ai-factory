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
 * du produit — son pseudonyme `Produit-NN` quand la table le connaît, sinon son nom passé par
 * l'anonymiseur (clients et sigles substitués). Il passe par les deux référentiels hors dépôt de
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
 */
import { basename } from "node:path";
import { anonymiser } from "../todo/anonymiser-entrant.mjs";

/**
 * Nom publiable d'un produit à partir de son chemin relatif au parc (« _Client/Sous/produit »).
 * Rend « Produit-NN » si la table le connaît, sinon le nom du dossier anonymisé ; lève si un
 * référentiel manque.
 */
export function pseudonymeProduit(cheminRelatif) {
  const nom = basename(String(cheminRelatif).replaceAll("\\", "/"));
  // DEUX PASSES, et la recette l'a exigé : `anonymiser` substitue les PRODUITS avant les CLIENTS.
  // Un nom de dossier qui porte le client (« CalculatriceClientSCC ») ne rejoint la clé de la
  // table (« Produit-04 ») qu'après la substitution du client — donc au second
  // passage seulement. Sur un texte déjà propre, la seconde passe ne change rien.
  const propre = anonymiser(anonymiser(nom).texte).texte;
  // Un pseudonyme présent dans le texte (« Produit-02.com », « Produit-11 ») EST la réponse : le
  // réinscrire créerait un pseudonyme de pseudonyme (défaut payé le 02/09, note de la table).
  const deja = propre.match(/Produit-\d{2,}/);
  return deja ? deja[0] : propre;
}
