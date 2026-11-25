# Retours forges — Produit-82 — 20261125e

- **Contexte** : la suite `make test` de l'étape version-20261125-directions-folio-rive a rendu 1 échec sur un test que ce tour ne touche pas. Une autre session vivante du produit partage la même pile locale.
- **Références ledger** : `forge\ledger.jsonl` seq 342
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-25

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Remarques restées au produit

Le défaut porte sur un test du produit ; aucune forge n'est visée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Suite donnée |
|---|---|---|---|---|
| RT-53 | mineur | produit | Le 25/11/2026, `make test` : `test_enf39_nettoyer_ne_garde_que_la_liste_apres_ses_gardes` échoue, car `--verifier` liste 0 organisation au lieu des 2 que le test vient de créer. Rejoué seul, il passe (6 sur 6) ; rejoué avec 3 autres fichiers, il passe (41 sur 41). Il passait au `make test` du matin (ledger seq 324). La cause n'est pas établie ; une autre session partage la pile locale (`forge/sessions.jsonl`). | Non corrigé dans ce tour : à reprendre par une étape qui isole la cause, en rejouant la suite sans session concurrente. |

- RT-53, généralisable : oui. Deux sessions qui partagent une même pile locale peuvent se gêner dans un test qui lit l'état global de la base ; le test ne le dit pas.

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le rejeu ciblé de `test_campagnes.py` dans le conteneur de tests, en 17 s, a suffi à séparer un échec intermittent d'une régression.

## Ordre recommandé

1. RT-53 : un échec intermittent dans la suite de verdict brouille chaque rapport qui suivra.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle est qu'un test qui lit l'état global d'une base partagée photographie seulement ce qu'il a créé. Classe proposée : `test-sensible-a-l-etat-partage`.
