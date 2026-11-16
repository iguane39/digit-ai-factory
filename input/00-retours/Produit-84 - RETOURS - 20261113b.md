# Retours forges — Produit-84 — 20261113b

- **Contexte** : le 13/11/2026, la session `4c9a6f46` remet le lot 20261113a au sas du pilot, puis consigne cette remise au ledger.
- **Références ledger** : `forge\ledger.jsonl` seq 311.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-13
- **Complétude** : 1 entrée `type: retour` écrite par cette session après le lot 20261113a (seq 311), relue le 13/11/2026 dans `forge\ledger.jsonl`.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **La trace de remise d'un lot** n'a pas de type au ledger : consignée en `retour`, elle devient un retour de plus, que le hook de fin de tour exige de remettre en lot.

## digit-ai-factory — ledger du produit et hook de fin de tour

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-24 | mineur | générique | **Consigner la remise d'un lot crée un retour orphelin.** (1) `forge\ledger.py` n'admet aucun type pour la remise d'un lot : ses 24 types ne contiennent ni `lot_remis` ni équivalent. (2) La session a consigné la remise du lot 20261113a en `type: retour` (seq 311), comme une session précédente le 10/11 (seq 300). (3) Le hook de fin de tour a refusé la restitution : « le tour a écrit 1 retour (seq 311) et aucun lot ne le cite ». (4) Il a fallu ce lot, qui ne porte aucune friction de produit, pour lever le refus. | Un type `lot_remis` au ledger, qui cite le lot et que le contrôle des lots ignore ; à défaut, le contrôle ignore une entrée `retour` dont l'objet nomme un lot déjà remis. Règle qui aurait évité le retour : aucune. Classe proposée : `remise-de-lot-sans-type-au-ledger`, famille `tracabilite-ledger`. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Aucune : la seule friction du tour est généralisable.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : le retour porte sur le ledger et un hook de la forge.

## Confirmations positives

- Le hook de fin de tour a vu le retour orphelin dans le ledger avant l'affichage, au préjugement : rien n'est parti sans lot.

## Ordre recommandé

1. RU-24 : chaque remise de lot consignée au ledger le reproduit.
