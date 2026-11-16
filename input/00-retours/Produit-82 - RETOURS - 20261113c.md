# Retours forges — Produit-82 — 20261113c

- **Contexte** : campagne de la forge des tests sur la version déployée en recette (action A-51) ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 264, 265
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-tests, pan sécurité

Le retour porte sur les constats que le pan sécurité compte dans un périmètre que le rapport déclare exclu.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-37 | majeur | générique | Le 13/11/2026, le rapport `forge/etapes/tests/rapport-20261113.json` déclare exclus, sous `perimetre_exclu_git` (TF-1767), les dossiers ignorés par git : `vendor-check`, `Produit-82/sauvegardes`, `Produit-82/deploy/railway/clients` et `Produit-82/runtime`. Il compte pourtant 643 de ses 701 constats dans ces dossiers, dont 631 bloquants : 614 dans `vendor-check`, 21 dans les sauvegardes, 6 dans `clients` et 2 dans `runtime`. La campagne du 15/10/2026 n'en comptait aucun. Les 2 constats gitleaks de `.env.forge-tests.exemple` portent sur des valeurs vides, le cas déjà remonté pour `oracle-secrets` sous RT-36. Ledger seq 264, sous-totaux recomptés par script en seq 265. **RT-37** : clé proposée `perimetre-exclu-compte-en-securite`. | Le pan sécurité applique `perimetre_exclu_git` comme les autres pans, ou range ces constats à part sans les compter bloquants. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Sous-totaux de seq 264 additionnés à la main, 2 chiffres faux (seq 265) | recomptés par script et rectifiés au ledger | non, la règle de recompter à la source existe | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le rapport nomme lui-même son périmètre exclu et son motif, ce qui a permis de trier les 701 constats en quelques minutes.

## Ordre recommandé

1. RT-37 : tant qu'il reste ouvert, un produit qui garde un clone amont ou des sauvegardes locales ne lit plus son pan sécurité.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour ne suit aucune correction humaine. La règle qui l'aurait évité : un périmètre déclaré exclu s'applique à chaque pan d'un même rapport.
