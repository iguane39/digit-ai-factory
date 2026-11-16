# Retours forges — Produit-82 — 20261113a

- **Contexte** : clôture des corrections n° 3 avant le nouveau déploiement en recette ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 251, 252, 253
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

Ce lot ne porte aucun retour aux forges : ses 3 retours restent au produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| ENF-34 rouge à la recette : le test signait son formulaire avec un secret que le service de recette ne reçoit pas (seq 251) | le jeton se lit dans le gestionnaire chargé par le test (commit 7c91e68) | non, défaut propre au test | corrigée, à confirmer en recette |
| Le parcours en navigateur lisait la page de documentation avant la fin de son chargement (seq 252) | attente de la navigation sur 3 liens, parcours sous latence ajouté à `make test` (commit 7c91e68) | non | corrigée, à confirmer en recette |
| Les commits de l'agent n° 3 portent l'attribution d'un autre modèle que celui qui les a écrits (seq 253) | modèle réel consigné au ledger (seq 250) ; historique non réécrit | non, l'erreur vient de la consigne de lancement écrite par la session | corrigée au ledger |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- L'agent a reproduit sur la pile locale les 2 échecs vus seulement en recette, sans accès à l'instance, puis les a corrigés.

## Ordre recommandé

1. Aucun retour aux forges dans ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours ne suivent aucune correction humaine. La règle qui les aurait évités : un test joué aussi en recette se vérifie sur la pile locale avec les variables de la recette, `ROLE=recette` et sans `PORTAIL_SECRET`.
