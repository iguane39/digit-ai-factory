# Retours forges — Produit-82 — 20261113b

- **Contexte** : reprise du déploiement en recette et migration des comptes (action A-48) ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 259, 260
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

Ce lot ne porte aucun retour aux forges : ses 2 retours restent au produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 9 identités de test au mot de passe déductible du code, dont 5 au rôle Opérateur, actives sur la recette depuis le passage du 12/11 à 22:45 UTC (seq 259) | 8 désactivées, la dernière administratrice de son organisation réinitialisée avec un mot de passe aléatoire ; vérifié en lecture seule | non, défaut propre aux tests du produit | corrigée sur l'instance ; l'hygiène des identités Opérateur laissées par chaque passage reste à traiter |
| Le temps 2 hébergé perdait le jeton de workspace entre la vérification et l'écriture : « API Railway : Not Authorized » (seq 260) | jeton lu avant la vérification, double de la CLI étendu à `railway api`, test rouge puis vert (commit ab2d946) | non | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La vérification préalable du temps 2 a refusé de jouer tant qu'une identité réelle ne s'était pas reconnectée, et elle a nommé le résidu de test qui la bloquait.

## Ordre recommandé

1. Aucun retour aux forges dans ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours ne suivent aucune correction humaine. La règle qui les aurait évités : un double de la CLI d'une plateforme couvre chaque sous-commande que le code appelle, avec le jeton qu'elle exige.
