# Retours forges — Produit-82 — 20261112m

- **Contexte** : relecture indépendante des corrections n° 2 avant recette ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 241, 242
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

Ce lot ne porte aucun retour aux forges : son seul retour reste au produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le détail de D-25 présentait le compte de campagne `qualif-d17241` comme un compte réel, alors que le brief le marque compte de test et que la migration l'applique par son préfixe (seq 242) | énoncé rectifié au ledger et dans la restitution au porteur ; code inchangé, il suit le brief ; en-tête de la liste des rôles à corriger | non, la règle de relire la source avant d'écrire une décision existe déjà | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La relecture indépendante, lancée avant le déploiement, a trouvé l'écart entre l'énoncé de la décision et le code avant qu'il n'agisse sur la recette.

## Ordre recommandé

1. Aucun retour aux forges dans ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour ne suit aucune correction humaine. La règle qui l'aurait évité : chaque compte classé dans une décision se relit contre le brief et le relevé initial avant d'être nommé au porteur.
