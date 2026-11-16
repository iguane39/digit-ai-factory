# Retours forges — Produit-82 — 20261113e

- **Contexte** : examen des 9 constats SAST du code par la session, puis déclaration au registre des constats contestés (action A-54) ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 274
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-tests, registre des constats contestés

Le retour porte sur le dédoublonnage des déclarations de `forge/constats-contestes.jsonl`.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-39 | mineur | générique | Le 13/11/2026, 2 lignes de code portent chacune 2 constats SAST distincts sous le même identifiant : `comptes.py:362` (f-string et `sqlalchemy-execute-raw-query`) et `comptes.py:814` (`formatted-sql-query` et `sqlalchemy-execute-raw-query`). Chaque déclaration porte le champ `texte`, que l'aide `pour_declarer` présente comme l'ancre sur le message. La forge refuse pourtant la seconde de chaque paire comme doublon de la première : 13 déclarations retenues, 2 refusées. Preuve : `forge/etapes/tests/rapport-20261113b.json`, `declarations.entrees`, lignes 10 et 15. Ledger seq 274. **RT-39** : clé proposée `declaration-doublon-sur-message`. | Dédoublonner sur le couple identifiant et `texte` quand `texte` est fourni. |

## Remarques restées au produit

Rien à dire : ce lot ne porte aucune remarque restée au produit (généralisable : sans objet).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le registre vérifie que la preuve citée existe avant de retenir une déclaration, ce qui empêche d'écarter un constat sans regarder le code.

## Ordre recommandé

1. RT-39 : il laisse au décompte un constat que le produit a examiné et contesté avec preuve.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour ne suit aucune correction humaine. La règle qui l'aurait évité : un champ que l'aide présente comme une clé de rapprochement entre dans la clé d'unicité.
