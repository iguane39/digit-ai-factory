# Retours forges — factory-digit-ai-fr — 20261115o

- **Contexte** : run `forge-digit-ai-fr-20261114a`, rédaction des pages de la forge des agents et de la forge d'exploitation de la version 2 du site, à partir du catalogue de la Factory et du README de la forge.
- **Références ledger** : forge/ledger.jsonl seq 318.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Les rédacteurs des pages de la forge des agents et de la forge d'exploitation ont comparé le catalogue de la Factory aux README de ces forges. Les deux sources ne nomment pas les mêmes services, et une date du catalogue est postérieure au fichier qui la porte. Les pages suivent le catalogue.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-60 : le catalogue et les README des forges des agents et d'exploitation ne couvrent pas les mêmes services.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-60 | **mineur** | générique | **Le catalogue et les README des forges des agents et d'exploitation se contredisent.** Le README de la forge des agents liste 6 services, contre 12 au catalogue. La ligne cat-agt-13 porte une date de contrôle, le 12/11/2026, postérieure au dernier commit du catalogue, le 06/11/2026. Le README de la forge d'exploitation présente l'inventaire des composants, les réglages de plateforme, la sauvegarde et les tâches planifiées, sans ligne au catalogue 1.8.0. Son chiffre de 329 contrôles (cat-ops-09) date du 29/10/2026, et la forge compte 19 commits depuis. Preuve : `catalogue.jsonl` du pilot ; README de `digit-ai-forge-agents` et de `digit-ai-forge-ops` ; rapports des rédacteurs des pages `forge-agents` et `forge-ops`, le 15/11/2026. | Le contrôle de couverture catalogue ↔ README proposé en RP-56 (lot 20261115l) ; refuser une date de contrôle postérieure au fichier qui la porte. |

## La règle qui aurait évité le retour

- RP-60 : rien ne compare la liste des services du README d'une forge à ses lignes de catalogue. Classe à créer : `catalogue-readme-desynchronises`, la même que RP-56.

## Remarques restées au produit

- La page cite les services du catalogue, et l'écart est écrit dans ses « Manques signalés ». Généralisable : non, la cause générale est RP-56.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
