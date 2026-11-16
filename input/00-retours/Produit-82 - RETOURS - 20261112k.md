# Retours forges — Produit-82 — 20261112k

- **Contexte** : mise à jour du référentiel d'exigences après D-24 (a) et D-25 (a) ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 236
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

Ce lot ne porte aucun retour aux forges : son seul retour reste au produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `git stash` sans étiquette lancé par la session dans un dépôt où un agent commitait, refusé par le hook de remisage (seq 236) | comparaison refaite par `git show` vers le bloc-notes | non, la règle TF-1754 existe et son hook a joué | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le hook de remisage a arrêté un geste qui pouvait prendre le travail de l'agent de correction en cours.

## Ordre recommandé

1. Aucun retour aux forges dans ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour ne suit aucune correction humaine. La règle qui l'aurait évité existe déjà : TF-1754, et son hook l'a appliquée.
