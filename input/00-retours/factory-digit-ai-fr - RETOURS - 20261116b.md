# Retours forges — factory-digit-ai-fr — 20261116b

- **Contexte** : run `forge-digit-ai-fr-20261114a`, reprise de l'intro du site actuel en tête de l'accueil de la v2, à la demande du créateur du 16/11/2026.
- **Références ledger** : forge/ledger.jsonl seq 418.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 16/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

L'intro du site actuel affiche une ligne de chiffres tirée du catalogue du pilot. Reprise sur l'accueil de la v2, elle annonce « 29 services de qualité et de sécurité, dont 24 prouvés », quand le site actuel annonce « 20, dont 16 », et les deux lignes portent la même étiquette, « catalogue v1.8.0 du 19/08/2026 ». Les deux instantanés du catalogue n'ont pas le même contenu, mais leur en-tête est identique : un lecteur qui compare les deux pages ne peut pas savoir lequel est à jour.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-85 : le catalogue du pilot change de contenu sans changer de version.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-85 | **mineur** | générique | **Les deux instantanés du catalogue du pilot vendus au produit portent le même en-tête, `version` 1.8.0 et `genere` 2026-08-19, pour 83 services dans `vendor/` (commit `d61b813` du 24/08) et 111 dans `vendor-v2/` (commit `e1efe5b` du 15/11). Toute page qui affiche la version du catalogue ment sur l'un des deux.** Preuve : bandeau de `/` et de `/v2/` servis en local le 16/11/2026 ; première ligne de `catalogues/catalogue.jsonl` dans les deux dossiers ; ledger du produit, entrée 418. | Incrémenter `version` et `genere` de `catalogues/catalogue.jsonl` à chaque changement de contenu, et faire refuser par un contrôle du pilot un catalogue dont le contenu diffère de la version précédente à en-tête égal. |

## La règle qui aurait évité le retour

- RP-85 : classe à créer `catalogue-version-figee` : le catalogue change de contenu sans changer de version ni de date.

## Remarques restées au produit

- L'accueil de la v2 affiche les chiffres de son propre catalogue (111 services), cohérents avec le reste de la page (« 93 des 111 services »). L'étiquette de version reste celle du pilot. Généralisable : non, la cause générale est RP-85.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
