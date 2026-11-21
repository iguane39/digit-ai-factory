# Retours forges — factory-digit-ai-fr — 20261115t

- **Contexte** : run `forge-digit-ai-fr-20261114a`, pose de la décision D-227 sur le mode de lancement des lecteurs isolés du contrôle de compréhension.
- **Références ledger** : forge/ledger.jsonl seq 326.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le créateur a répondu « 227a (on a déjà dit qu'il n'y avait pas besoin de clé API pour le mode --bare de b), 226a ». L'option (b) de D-227 proposait une clé d'API, alors que la décision D-73 (a) du 14/11/2026 avait retiré cette demande. La session a posé la décision sans relire les décisions déjà tranchées sur le même objet.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-69 : une décision propose une option qu'une décision antérieure a retirée.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-69 | **majeur** | générique | **L'option (b) de D-227 a fait revenir la demande de clé d'API, retirée par D-73 (a) le 14/11/2026.** Au ledger du produit, l'entrée 122 porte `artefacts_remplaces` : « demande de clé d API (option a de D-72) », au sort « retire ». Rien n'oblige la session à relire les décisions tranchées du même objet avant d'en réserver une nouvelle. Preuve : ledger du produit, entrées 122, 305 et 324 ; réponse du créateur citée plus haut. | Avant `reserver-decision.mjs`, lister les décisions tranchées du même objet (`reponse_humain`, `artefacts_remplaces` au sort « retire »), et refuser une option déjà retirée, sauf à la nommer et à dire pourquoi elle revient. |

## La règle qui aurait évité le retour

- RP-69 : la réservation d'une décision ne relit pas les décisions déjà tranchées du même objet. Classe à créer : `option-retiree-reproposee`.

## Remarques restées au produit

- La réponse 227a est appliquée au produit : la question témoin admet le bloc de contexte automatique du compte. Généralisable : oui, c'est l'objet du lot 20261115n, déjà remis.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
