# Retours forges — factory-digit-ai-fr — 20261115g

- **Contexte** : rédaction du mandat de construction D-219 (e), le 15/11/2026 ; première utilisation de la réservation d'indice livrée le matin même.
- **Références ledger** : forge/ledger.jsonl seq 245.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

`allouer-indice.mjs --reserver`, livré le 15/11/2026 par la construction du registre des sessions, a rendu la lettre b et l'a inscrite au registre des sessions. Le nom inscrit colle le jour au préfixe sans le séparateur « - », alors que le livrable écrit porte ce séparateur, comme l'exige la convention de nommage. La réservation ne correspond donc pas au fichier.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-46 : le nom réservé diffère du nom du livrable.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-46 | **mineur** | générique | **Le nom réservé par `allouer-indice.mjs --reserver` est « … D-219e20261115b.md », le livrable s'appelle « … D-219e - 20261115b.md ».** Preuve : sortie de la commande du 15/11/2026 à 08:52, avec le préfixe « forge-digit-ai-fr - Brief - Mandat de construction de l'apprentissage des agents D-219e ». | Composer le nom réservé comme le nom du livrable, `<préfixe> - <jour><indice><extension>`, avec une fixture qui compare les deux. |

## La règle qui aurait évité le retour

RP-46 : la fixture de la réservation compare l'indice, pas le nom complet. Classe à créer : `reservation-d-indice-sous-un-nom-different-du-livrable`, famille `versionnement-livrable`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
