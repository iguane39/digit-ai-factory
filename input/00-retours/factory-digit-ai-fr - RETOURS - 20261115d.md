# Retours forges — factory-digit-ai-fr — 20261115d

> **Annoté à la réception le 23/11/2026** : ce lot a été refusé à la porte le 23/11/2026 (la ligne du sidecar portait une famille du référentiel au lieu d'une clé de classe). Clé choisie à la lecture du retour : RP-43 devient `lot-remis-ecrasable` (famille `lot-forme`). Reportée au sidecar et à la section « La règle qui aurait évité le retour ». Aucun autre mot du lot n'a changé ; l'original reste chez le produit.

- **Contexte** : run `forge-digit-ai-fr-20261114a`. Deux sessions écrivent des lots de retours sur le même produit, le même jour.
- **Références ledger** : forge/ledger.jsonl seq 222.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Cette session a écrit son lot sous l'indice 20261115b, que l'autre session avait pris quelques minutes plus tôt. L'écriture a écrasé la copie locale du lot déjà remis. `oracle-lot.mjs` a refusé la remise, car le sas portait un autre contenu sous ce nom (R-49). La copie locale a été restaurée depuis le sas, identique au contrôle `cmp`. Le lot de cette session est parti sous l'indice c, avec l'identifiant RP-42 : les deux sessions avaient aussi pris RP-41.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-43 : l'indice et l'identifiant d'un lot ne sont pas réservés.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-43 | **majeur** | générique | **Deux sessions choisissent l'indice de leur lot par « premier indice libre », sans réservation.** Rien n'empêche d'écrire sur un lot déjà remis : le 15/11/2026, la copie locale du lot 20261115b a été écrasée, puis restaurée depuis le sas. Les identifiants RP se sont croisés aussi. Preuve : ledger seq 222 ; refus R-49 d'`oracle-lot.mjs` ; `cmp` entre la copie restaurée et celle du sas. | Réserver l'indice et l'identifiant RP d'un lot avant de l'écrire, comme `reserver-decision.mjs` le fait pour les décisions. Rendre un lot remis non inscriptible. |

## La règle qui aurait évité le retour

RP-43 : R-49 protège le sas, pas la copie locale du produit, et rien ne réserve un indice. Classe : `lot-remis-ecrasable` (famille `lot-forme`).

## Remarques restées au produit

- Cette session vérifie désormais l'absence du fichier avant d'écrire un lot. Généralisable : oui, c'est l'objet de RP-43.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
