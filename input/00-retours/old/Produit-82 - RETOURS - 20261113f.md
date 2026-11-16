# Retours forges — Produit-82 — 20261113f

- **Contexte** : le porteur demande où sont les comptes d'utilisateur standard, l'interface de conversation et les modèles configurés ; la session mesure la recette et relit l'intention de départ ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 276, 277, 278, 279
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Pilot, recommandation d'une décision

Le retour porte sur la recommandation qui accompagne une décision posée au porteur.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-40 | majeur | générique | Le 12/11/2026, le porteur demande que « chaque rôle ait les accès pour utiliser tous les modèles mis à sa disposition ». La session recommande D-22 (a), une clé d'API personnelle, et écarte l'écran de conversation proposé en (b) et (c). Le porteur suit la recommandation. Le 13/11, il demande « les interfaces pour chatter avec les IAs configurées » : la personne visée par sa phrase n'écrit pas de code. La relecture d'intention a jugé la consigne de construction, jamais la recommandation de la décision. Preuve : `forge/etapes/version-20261112/BRIEF-DELTA.md` lignes 43 à 47 ; ledger seq 207 et 276. **RT-40** : clé proposée `recommandation-hors-usager`. | Faire relire chaque recommandation de décision contre la phrase du porteur : qui agit, avec quel outil, sans code ou avec code. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La recette porte 315 organisations et 465 identités non marquées comme test, créées par les tests après la migration du 12/11 (seq 277) | non corrigée : purge posée au porteur (D-30) | non, l'hygiène des tests en recette est déjà relevée (seq 259) | ouverte |
| Aucune identité Développeur ni DPO / RSSI n'est ouverte au porteur dans la fiche d'accès (seq 278) | non corrigée : à créer avec la version qui suit D-29 | non | ouverte |
| Mistral rend 401 et Scaleway 403 sur la recette (seq 279) | non corrigée : clés à fournir par le porteur | non | ouverte |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La requête en lecture seule sur la base de recette a compté les résidus en une minute, sans risque d'écriture.

## Ordre recommandé

1. RT-40 : une recommandation suivie engage tout un run, et rien ne la relit aujourd'hui.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit une correction humaine du 13/11/2026. La règle qui l'aurait évité : une recommandation de décision nomme la personne qui agira et vérifie qu'elle sait se servir de l'option recommandée.

## Note de réception du pilot (16/11/2026)

Le lot a été refusé tel quel à l'ingestion : la famille de ses classes proposées n'existe pas au référentiel `todo/CLASSES.json`. Le pilot l'a ramenée, avant ingestion, à la famille connue la plus proche :

- classe proposée « recommandation-hors-usager » : famille « intention », inconnue du référentiel, ramenée à « restitution-forme »

Lot déjà ingéré sous un autre nom (doublon strict à la ré-ingestion du 16/11/2026) : rangé dans old/ sans ingestion.
