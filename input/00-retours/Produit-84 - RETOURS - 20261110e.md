# Retours forges — Produit-84 — 20261110e

- **Contexte** : le 10/11/2026, la session `3c08d011` rejoue les 151 règles ouvertes de l'audit du 04/11 sur la version v1.14.0 qualifiée, puis fait rendre le rapport de re-audit par forge-audit.
- **Références ledger** : `forge\ledger.jsonl` seq 297.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-10
- **Complétude** : 1 entrée `type: retour` écrite par cette session depuis son lot 20261110b (seq 297), relue le 10/11/2026 dans `forge\ledger.jsonl`. Les retours des seq 292 et 294, écrits par d'autres sessions, sont dans les lots 20261110c et 20261110d.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le rapport de re-audit** passe toutes les portes de forge-audit, puis échoue à la porte du standard d'audit du client, pour les 6 mêmes raisons que le 05/11.

## digit-ai-forge-audit et projet commun Produit-64 — porte du client

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-22 | bloquant | générique | **Le rendu POC-to-Prod de forge-audit ne peut pas passer la porte du standard client.** (1) Le rapport `20261110a` passe `verifier-rapport`, `verifier-forme-rapport` et `verifier-rapport-html` (diffusable). (2) La porte `verifier-rapport-audit.mjs` du projet commun (commit `d4eca4b`) rend NON CONFORME avec 6 anomalies, identiques au 05/11 (ledger seq 208). (3) 4 viennent de la porte : elle compile comme du JavaScript les blocs `<script type=application/json>` du rendu. (4) 2 viennent de D14 : la porte exige score et criticité pour une dimension sans objet (aucun modèle d'IA). (5) La mobilisation exige une sortie CONFORME de cette porte pour la forge audit : elle est inatteignable sans fausser une donnée. Ledger seq 297 ; sortie dans `forge\audit\20261110\porte-client.txt`. | La porte ignore les blocs de type `application/json` et accepte une dimension sans objet, au score nul motivé ; à défaut, un contrat commun entre forge-audit et la porte, avec un banc partagé. Règle qui aurait évité le retour : aucune ; le contrat entre les 2 n'existe pas. Classe proposée : `porte-client-incompatible-avec-le-rendu`. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Aucune : la seule friction du tour est généralisable.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause : le rapport est rendu par forge-audit.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : le retour porte sur 2 outils de la forge.

## Confirmations positives

- La porte machine de forge-audit a refusé 7 liens de couverture devenus incohérents après le re-audit, et nommé chacun : la correction a pris une ligne.
- `build-rapport --copie-output` a rangé l'indice précédent sous `old/` sans rien écraser, comme demandé par RT-52.

## Ordre recommandé

1. RU-22 : il bloque la vérification de tout rapport d'audit de ce client par la mobilisation.
