# Retours forges — Produit-86 — 20261110b

- **Contexte** : clôture du run `20261110b-approbateur-en-terminal`. La commande `approbateur` permet à l'approbateur de signer et de décider en terminal ; le mandat v4 de la mission « Produit-86 CostControl » a été signé ainsi, et la campagne du lot 1 est lancée.
- **Références ledger** : `forge\ledger.jsonl` seq 874 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 10/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 10/11/2026 : `todo/CLASSES.json` du pilot. RP-61 se rattache à `compte-total-hors-canal-des-constats` : un compte repris d'un affichage borné plutôt que d'une requête de compte.

## digit-ai-forge-agents

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-61 | mineur | générique | La session a écrit au ledger « 12 demandes, 7 autorisées, 12 jobs » (seq 852), tirés d'une liste tronquée par `head` et d'une liste de jobs bornée par `limit` qui mêlait des jobs antérieurs. Le recompte par requête donne 11 demandes, 6 autorisées et 6 jobs (seq 874). L'oracle S90 ne l'a vu qu'à la restitution. | Rappeler la règle S90 (un chiffre se montre dans le tour) au moment de l'écriture au ledger, pas seulement à la restitution. |

## La règle qui aurait évité le retour

- `compte-total-hors-canal-des-constats` (RP-61) : un compte se tire d'une requête de compte, jamais d'un affichage borné.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La suite e2e et forge_tests lancés en `&` dans un shell d'arrière-plan sont morts avec lui à l'arrêt de Docker Desktop | relancés comme tâches suivies | non : geste de la session | reste au produit, parce que c'est un geste de session sans règle de forge |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261109a) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le test de mise en production a prouvé, sur l'instance servie, que la commande de l'approbateur refuse un lancement sans terminal.
