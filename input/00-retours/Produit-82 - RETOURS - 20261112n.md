# Retours forges — Produit-82 — 20261112n

- **Contexte** : déploiement du portail unique en recette (action A-48), rapport de recette en code 1 ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 246, 247, 248, 249
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

Ce lot ne porte aucun retour aux forges : ses 4 retours restent au produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les tests de migration EF-54 ont joué le temps 1 sur toute la base de recette, sans la liste des rôles : 115 identités migrées, 3 marquées compte de test (seq 246) | consigne de correction n° 3, items 1 et 2 | non, défaut propre à la suite du produit | à corriger |
| 6 tests passés de `skip` à `fail` par la consigne n° 2 ne trouvent pas leurs fichiers dans l'image de recette (seq 247) | consigne n° 3, item 3 | non | à corriger |
| T4, T6 et T7 rouges à moins de 24 h d'une recette précédente, deuxième occurrence du constat de seq 198 (seq 248) | consigne n° 3, item 4 | non | à corriger |
| Heure d'une mesure estimée dans seq 246 au lieu d'être relevée (seq 249) | rectifiée par seq 249 avec l'heure relevée sur les fichiers | non, la règle de relever l'heure existe (TF-1424) | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La sauvegarde prise avant le déploiement rend la situation réversible : elle porte les 151 comptes d'avant toute migration.

## Ordre recommandé

1. Aucun retour aux forges dans ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours ne suivent aucune correction humaine. La règle qui les aurait évités : une consigne qui change le comportement d'un test nomme tous les contextes où ce test s'exécute, la pile locale et le service de recette.
