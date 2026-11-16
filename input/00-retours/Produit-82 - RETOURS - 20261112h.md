# Retours forges — Produit-82 — 20261112h

- **Contexte** : relecture indépendante des corrections de l'agent de campagne sur le portail unique, avant tout déploiement en recette ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 230
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

Ce lot ne porte aucun retour aux forges : son seul retour reste au produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 10 constats mineurs de la relecture indépendante des commits `6538da4..d418028` (seq 230), dont la suppression d'organisation qui écrit sa trace hors transaction | 6 confiés à la consigne de correction n° 2, 4 gardés en reste nommé | non, défauts de code du produit | en cours |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La seconde relecture indépendante, sur le code corrigé, ne trouve plus ni bloquant ni majeur : la boucle correction puis relecture a convergé en un tour.

## Ordre recommandé

1. Aucun retour aux forges dans ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour ne suit aucune correction humaine. La règle qui l'aurait évité : toute écriture qui garde la trace d'une suppression se fait dans la même transaction que la suppression.
