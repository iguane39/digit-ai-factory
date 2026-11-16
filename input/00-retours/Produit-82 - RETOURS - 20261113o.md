# Retours forges — Produit-82 — 20261113o

- **Contexte** : correction du nettoyage des anciens comptes, redéploiement et dernier nettoyage de la recette ; run `Produit-82-20261110-version`, étape `version-20261113-usage-sans-code`.
- **Références ledger** : `forge\ledger.jsonl` seq 313
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Un test qui appelle `comptes.py migrer` doit porter la marque `sauf_recette` avec un motif qui nomme « migrer », et seul le test `test_ef54_aucune_migration_en_recette` le disait ; l'agent du nettoyage y a perdu un `make test` complet (ledger seq 313) | la règle est écrite à la définition de la marque, dans `Produit-82/tests/conftest.py`, commit `7661bfd` | non | corrigée |
| Le nettoyage laissait les anciens comptes du portail, que les tests de migration recréaient en identités (ledger seq 309, lot 20261113n) | commits `7d90878` et `603f23e` ; recette nettoyée : 10 anciens comptes de tests et l'identité `maj` supprimés | non | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le garde `test_ef54_aucune_migration_en_recette` a arrêté un test de migration qui serait parti sur la base réelle de la recette.

## Ordre recommandé

Sans objet : ce lot ne porte aucune candidature.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle qui l'aurait évité : une convention que seul un test fait respecter s'écrit aussi là où le développeur pose la marque.
