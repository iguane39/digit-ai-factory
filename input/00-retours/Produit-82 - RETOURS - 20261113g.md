# Retours forges — Produit-82 — 20261113g

- **Contexte** : ce lot reprend le retour du lot 20261113f, dont le sidecar portait une famille inconnue du référentiel, refusée par la porte du pilot. Le porteur demande où sont les comptes d'utilisateur standard, l'interface de conversation et les modèles configurés ; la session mesure la recette et relit l'intention de départ ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 276, 277, 278, 279
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Pilot, recommandation d'une décision

Le retour porte sur la recommandation qui accompagne une décision posée au porteur.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-41 | majeur | générique | Le 12/11/2026, le porteur demande que « chaque rôle ait les accès pour utiliser tous les modèles mis à sa disposition ». La session recommande D-22 (a), une clé d'API personnelle, et écarte l'écran de conversation proposé en (b) et (c). Le porteur suit la recommandation. Le 13/11, il demande « les interfaces pour chatter avec les IAs configurées » : la personne visée par sa phrase n'écrit pas de code. La relecture d'intention a jugé la consigne de construction, jamais la recommandation de la décision. Preuve : `forge/etapes/version-20261112/BRIEF-DELTA.md` lignes 43 à 47 ; ledger seq 207 et 276. **RT-41** : clé proposée `recommandation-hors-usager`. | Faire relire chaque recommandation de décision contre la phrase du porteur : qui agit, avec quel outil, sans code ou avec code. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le lot 20261113f a été remis avec la famille « intention », absente du référentiel : `oracle-lot.mjs` l'a signalé en avertissement et a quand même copié le lot au sas | candidature reprise ici sous RT-41, famille `hook-ou-gate` | non, l'oracle prévient déjà ; la session a lu l'avertissement après la copie | corrigée |
| Les 3 remarques du lot 20261113f (seq 277, 278, 279) | inchangées, portées par ce lot-là | non | ouvertes |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La requête en lecture seule sur la base de recette a compté les résidus en une minute, sans risque d'écriture.

## Ordre recommandé

1. RT-41 : une recommandation suivie engage tout un run, et rien ne la relit aujourd'hui.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit une correction humaine du 13/11/2026. La règle qui l'aurait évité : une recommandation de décision nomme la personne qui agira et vérifie qu'elle sait se servir de l'option recommandée.
