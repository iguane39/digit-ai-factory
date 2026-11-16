# Retours forges — Produit-82 — 20261112c

- **Contexte** : le porteur refuse l'architecture d'accès du produit (3 portes, un compte par organisation et par système) en lisant la fiche des accès complets ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 205
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`), skill `redige-les-exigences`

Le retour porte sur les exigences socle que la conception propose d'office.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-29 | majeur | générique | Le 12/11/2026, le porteur écrit : « Il doit y avoir un seul portail pour tout le monde, avec une seule URL […] Un utilisateur ne doit pas avoir 15 comptes sur 15 rôles différents ». Mesure : 3 portes humaines par environnement (portail à formulaire, console amont protégée par `htpasswd`, API à clé) ; un compte du portail porte un seul `groupe` et un seul `role` (`Produit-82/scripts/comptes.py`, table `portail_comptes`). EF-20 et EF-24 ont produit 2 systèmes de comptes, et aucune exigence socle ne demandait une identité unique. Ledger seq 205. **RT-29** : clé proposée `identite-unique-non-exigee`. | Ajouter aux exigences socle candidates de `redige-les-exigences` : une seule porte humaine par environnement, une identité par personne, les fonctions portées par des affectations (organisation, rôle). La candidate se retient ou s'écarte avec motif, comme les 3 actuelles (règle E10 d'`oracle-exigences`). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Demande du porteur passée au crible L99, brief delta réécrit avec 3 décisions (D-21 à D-23) | revue et brief sous `output/`, journal de boucle PASS, commit `b16ee0b` | oui, voir RT-29 | en attente des décisions du porteur |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La relecture aveugle à 2 relecteurs a trouvé à la passe 1 un bloquant de sécurité que l'auteur n'avait pas vu : une fusion de comptes par simple homonymie, qui ouvrait une escalade de droits.

## Ordre recommandé

1. RT-29 : un produit à plusieurs surfaces humaines repart sinon avec un compte par surface.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit une correction humaine. La règle qui l'aurait évité : la conception propose d'office une identité unique par personne et une seule porte humaine par environnement. Classe proposée : **RT-29** : `identite-unique-non-exigee`, famille `heritage-produit`, libellé « Les exigences socle ne demandent pas une identité unique par personne ».
