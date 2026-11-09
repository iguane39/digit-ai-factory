# Retours forges — Produit-84 — 20261109a

- **Contexte** : le 09/11/2026, la session `3c08d011` mène la remédiation de l'audit POC-to-Prod du 04/11/2026 en 6 lots fusionnés, puis joue la campagne forge_tests sur la branche fusionnée.
- **Références ledger** : `forge\ledger.jsonl` seq 256.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-09
- **Complétude** : 1 entrée `type: retour` écrite par cette session (seq 256), relue le 09/11/2026 dans `forge\ledger.jsonl`. Elle va au sidecar. Les 14 retours plus anciens restés sans lot viennent d'autres sessions et ne sont pas repris ici.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **La campagne de tests** : sur la branche fusionnée, forge_tests rend PARTIEL avec 9 constats bloquants. Trois d'entre eux déclarent « non câblé » chaque workflow GitHub planifié, alors que les 3 fichiers sont présents dans `.github/workflows/`.

## digit-ai-forge-tests — déclencheurs planifiés de la CI

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-12 | majeur | générique | **Chaque workflow GitHub planifié est déclaré « trigger-non-cable », en bloquant.** (1) Pour un déclencheur cron-ci, la désignation est le nom du fichier du workflow, par exemple `derive-nocturne.yml`. (2) `_cible_existe` (`forge_tests/declencheurs.py`, l. 102 à 135) ne connaît pas l'extension `.yml` : il traite le nom comme un module Python pointé et cherche `derive-nocturne/yml.py`. (3) Mesuré le 09/11/2026 sur la branche `remediation-audit` : 3 bloquants (`derive-nocturne.yml`, `sauvegarde.yml`, `sonde.yml`), rapport `forge\etapes\tests\rapport-20261109.json`. Ledger seq 256. | Pour un déclencheur cron-ci, tenir la cible pour câblée : c'est le fichier du workflow lui-même. Ajouter `.yml` et `.yaml` aux extensions de fichier de `_cible_existe`, avec une fixture qui porte un workflow planifié. Règle qui aurait évité le retour : aucune fixture ne porte de workflow GitHub planifié. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Aucune remarque n'est restée au produit : le défaut est dans l'outil de la forge, il vaut pour tout produit qui planifie un workflow.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause : l'écart est dans un outil.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : l'écart est dans la forge.

## Confirmations positives

- Le message du constat nomme le fichier et la désignation : la cause se retrouve dans `_cible_existe` en une lecture.
- Le pan interface a mesuré 65 éléments sur 65 exercés sur une page de 5 476 lignes découpée en 3 fichiers.

## Ordre recommandé

1. RU-12 : il met en échec bloquant tout produit qui ajoute une sonde, une sauvegarde ou un plan planifié.
