# Retours forges — Produit-82 — 20261127a

- **Contexte** : création sur la recette d'un compte Opérateur Digit-AI, à la demande du porteur du 27/11/2026.
- **Références ledger** : `forge\ledger.jsonl` seq 397
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-27

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

Aucun retour ne vise une forge dans ce lot.

## Remarques restées au produit

- La fiche d'accès du produit ne liste pas les Opérateurs créés sur la recette. Son générateur ne lit que les identités du fichier des organisations. Le mot de passe provisoire du nouvel Opérateur n'est donc rangé que dans le fichier des identités de la recette, ignoré par git. Preuve : `forge\ledger.jsonl` seq 397. La correction passe par un run de version du produit (généralisable : non, propre au produit).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La vérification à blanc des organisations a dit, avant tout geste, que le compte demandé dans l'organisation existait déjà, ce qui a évité un doublon.

## Ordre recommandé

1. Aucun retour à ordonner : la seule remarque reste au produit.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle est qu'une fiche d'accès générée liste tous les rôles que l'outil de création sait produire, Opérateur compris. Classe proposée : aucune, la remarque reste au produit.
