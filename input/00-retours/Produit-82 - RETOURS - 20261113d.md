# Retours forges — Produit-82 — 20261113d

- **Contexte** : mise à jour de 4 vues du dossier projet après le portail unique (action A-53) ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 268, 269, 270
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-ops, `oracle-ops`

Le retour porte sur le contrôle des conteneurs à état, joué sur une instance hébergée par une plateforme gérée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-38 | mineur | générique | Le 13/11/2026, sur `docs/projet/COMPOSANTS-OPS.md`, `oracle-ops --conteneurs-a-etat` refuse la ligne « postgres, recette » de la table des composants à état. Il attend une commande `docker run` ou `docker compose`, alors que le volume de la recette est créé par l'API Railway, au travers de `deployer.py`. Son propre `non_juge` exclut pourtant les plateformes gérées. Sur le dépôt entier, il ne lit pas une ancre YAML (`&`) de `docker-compose.yml`, et il compte un `docker run` du clone amont `vendor-check`, en lecture seule et ignoré par git. Ledger seq 269. **RT-38** : clé proposée `oracle-ops-plateforme-geree`. | Accepter, pour une plateforme gérée, la commande ou le script qui crée le volume ; résoudre les ancres YAML ; ignorer le périmètre exclu par git. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| R-22 passe de 2 à 32 variables en défaut : la consigne demandait les 2 `.env.example`, et l'oracle ne lit que celui de la racine (seq 268) | non corrigée : le fichier qui fait foi se choisit dans une version ultérieure | non | ouverte, documentée |
| `CLAUDE.md` cite agentgateway v1.6.0 alors que la pile épingle v1.7.0 (seq 270) | non corrigée dans ce tour | non | ouverte |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- L'agent rédacteur a marqué « non mesuré » chaque affirmation sur l'instance hébergée qu'aucune entrée du ledger ne mesure, au lieu de la déduire du code.

## Ordre recommandé

1. RT-38 : il refuse toute instance hébergée sur une plateforme gérée.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours ne suivent aucune correction humaine. La règle qui les aurait évités : une consigne qui touche une vue jugée par un oracle se relit contre cet oracle avant le lancement.
