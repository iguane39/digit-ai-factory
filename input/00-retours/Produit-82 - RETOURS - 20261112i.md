# Retours forges — Produit-82 — 20261112i

- **Contexte** : suite de tests relancée par la session sur les corrections de l'agent de campagne, avant tout déploiement en recette ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 231
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

Ce lot ne porte aucun retour aux forges : son seul retour reste au produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `make test` sort en exit 2 : `e2e_vues_tco_local.py` passe un mot de passe aléatoire qui peut commencer par un tiret, lu comme une option 1 fois sur 64 (seq 231) | confié à la consigne de correction n° 2, item 7 | non, défaut de test du produit | en cours |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le `make test` rejoué par la session, au lieu du verdict vert annoncé par l'agent, a fait sortir un test instable que 15 passes vertes n'avaient pas montré.

## Ordre recommandé

1. Aucun retour aux forges dans ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour ne suit aucune correction humaine. La règle qui l'aurait évité : une valeur aléatoire passée en argument de ligne de commande se passe sous la forme `--option=valeur`.
