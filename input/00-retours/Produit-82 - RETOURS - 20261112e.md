# Retours forges — Produit-82 — 20261112e

- **Contexte** : rapport de l'agent constructeur sur les 5 jalons du portail unique, relu par la session avant sa vérification ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 213, 214, 215, 216, 217, 218
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## quality-oracles, `oracle-filtres-tableau`

Le retour porte sur la règle G2 de l'oracle.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-31 | majeur | générique | G2 cherche le composant de filtres dans le document seul. Le portail d'Produit-82 l'assemble dans `actifs/portail.js`, que G3 et G6 lisent pourtant comme actif déclaré. 6 pages du portail rendent FAIL G2 alors que leurs tables portent les filtres (relevé de l'agent constructeur, 12/11/2026). Ledger seq 213. **RT-31** : clé proposée `oracle-g2-ignore-actifs-declares`. | G2 lit les actifs déclarés par la page, comme G3 et G6. |

## pilot (`digit-ai-factory`), contrat `gabarits/AGENT-CAMPAGNE.md`

Le retour porte sur la règle des fichiers d'environnement du contrat d'agent.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-32 | majeur | générique | À 12:26Z et 12:40Z le 12/11/2026, une copie récursive de `deploy/railway/` par l'agent constructeur a emporté un fichier d'environnement de l'instance hébergée et son fichier de projet dans le bloc-notes. Fichiers non ouverts, supprimés aussitôt, copies suivantes filtrées. La règle « aucun `.env` lu, copié ou déplacé » ne nomme pas la copie récursive d'un dossier qui en contient. Ledger seq 216. **RT-32** : clé proposée `copie-recursive-emporte-env`. | Le contrat nomme la copie récursive et prescrit l'exclusion des fichiers d'environnement, avec une vérification de leur absence après copie. |
| RT-33 | mineur | générique | La définition d'agent `constructeur` demande d'écrire au ledger ; le contrat fait du rapport la seule sortie de l'agent. L'agent a tranché pour le contrat et proposé 4 entrées, écrites ensuite par la session. Ledger seq 217 (`conflit_regles`). **RT-33** : clé proposée `agent-ledger-contradictoire`. | Aligner la définition d'agent sur le contrat : l'agent propose les entrées dans son rapport. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `test_ef19` appelle la clé 100 ms après sa création, la passerelle a mis 112 ms à recharger (seq 214) | à corriger dans un run : attente de l'acceptation au lieu d'un délai fixe | non | ouvert |
| Le contrôle T5 interdit dans le groupe `client-a` tout autre utilisateur que `client-a`, ce que contredit la clé personnelle de D-22 (a) (seq 215) | décision D-24 posée au porteur | non | en attente de décision |
| Le relevé de départ annonçait 37 comptes en recette ; il y en a 151 (seq 218) | relevé refait par la sortie capturée et comptée | non | corrigé |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- L'agent a trouvé et corrigé un interblocage latent de `comptes.py` : deux appels simultanés se bloquaient dans `initialiser()`.

## Ordre recommandé

1. RT-32 : un fichier d'environnement copié hors du dépôt est une fuite possible.
2. RT-31 : le faux refus pousse à ignorer un oracle sur 6 pages.
3. RT-33 : sans effet sur le produit, l'agent a tranché juste.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine ; les retours viennent du rapport de l'agent. La règle qui aurait évité RT-32 : toute copie de dossier par un agent exclut les fichiers d'environnement et vérifie leur absence. Classes proposées : **RT-31** `oracle-g2-ignore-actifs-declares` (famille `hook-ou-gate`), **RT-32** `copie-recursive-emporte-env` (famille `secret-hors-perimetre`), **RT-33** `agent-ledger-contradictoire` (famille `contrat-interface-forge`).
