# Lot de retours — Produit-64 → digit-ai-factory (une lecture `git merge-base` comptée comme une fusion par le hook de fin de tour) — 2026-11-10, indice a

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, `oracles/hook-restitution.mjs` (relevé des écritures du tour).

**Origine** : session interactive du 10/11/2026. Le porteur demandait pourquoi le catalogue reconstruit n'apparaissait pas dans son dossier `output`. La session a seulement lu l'état git. Le hook de fin de tour a refusé la réponse courte vers 15:10, heure de Paris.

Ce lot porte **1 retour** (RT-77).

- **Contexte** : une session de ce produit, hors run.
- **Références ledger** : sans objet ; la décision D-19 de la même session est inscrite à `forge/ledger.jsonl`, sans lien avec ce retour.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : rédigé et remis le 2026-11-10.

---

## digit-ai-factory (hook-restitution, relevé des écritures)

Le retour, son fait mesuré et la correction proposée :

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-77 | mineur | générique | **Une lecture `git merge-base` est comptée comme la commande à effet `git merge`.** Le tour n'a lancé que des lectures : `git status`, `git log`, `git cat-file`, `git merge-base --is-ancestor`, `ls`, `sed -n`. Le hook l'a pourtant jugé « tour de travail », avec pour motif « écrit : commande à effet « git merge » », et il a refusé la réponse courte (FAIL BLOQUANT S1 et S4). Sur le motif `VERBES_EFFET` de `oracles/hook-restitution.mjs` (ligne 267), le rejeu donne `EFFET` pour `git merge-base --is-ancestor b6aca5e fa9e983` et `lecture` pour `git log --oneline`. La cause : le verbe `merge` se termine par `\b`, et le tiret compte comme une frontière de mot. | 1) Terminer chaque verbe de `VERBES_EFFET` et de `GIT_A_OPTIONS` par `(?![\w-])` au lieu de `\b`. 2) Fixture double sens : `git merge-base`, `git merge-tree` et `git merge-file` doivent rester des lectures, et `git merge origin/main` un effet. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-77** : classe `oracle-faux-positif`. Les motifs ne sont pas validés par une fixture double sens qui inclut les sous-commandes au nom composé (`merge-base`). C'est la même famille que TF-2034 (`git stash list` compté comme effet), corrigée verbe par verbe et non par la frontière.

## Rattachement

J'ai interrogé le registre le 10/11/2026 avec `grep -iE "merge-base" todo/TODO.jsonl`. Il en sort 5 items, et aucun ne traite du relevé du hook. L'item le plus proche est TF-2034 (`git stash list`).

## Remarques restées au produit

Rien à dire : aucune remarque n'est restée au produit, généralisable : non, parce que le seul défaut relevé est au pilot et que le produit n'a rien corrigé de son côté.

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot : le tour n'a fait que lire l'état git, sans rien écrire sous `output/`.

## Documents mûrs

Mesurés par `node forge/retours/oracle-lot.mjs` le 10/11/2026 : 10 documents. Ce lot, consacré à RT-77, n'instruit pas leur forme ; les verdicts du lot `Produit-64 - RETOURS - 20261105c` restent inchangés, et ils sont rappelés ci-dessous.

| Document (versions) | Verdict |
|---|---|
| Guide développeur POC-to-Prod (30) | remonté : sa forme est la famille `gd-guide-de-reference` du pilot, publiée le 28/09/2026 |
| Modèle Rapport d'audit POC-to-Prod (22) | reste au produit, parce que sa forme relève du produit d'audit (`auditcore`) et non de la bibliothèque du pilot ; non instruit plus avant par cette session |
| Propositions ADR par domaine (16) | reste au produit, parce que sa matière est propre à Client-A ; forme non instruite par cette session, à juger par le porteur |
| Schéma Process POC-to-Prod End-to-end (14) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Référentiel POC-to-Prod - Audit (10) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Compliance Pack - Format & Contenus des contraintes (10) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Process Ingénierie POC-to-Prod - Consolidation et cible (7) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Matrice Contraintes ADR Light-Complet (6) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Comparatif des pipelines - Guide, IA Essentials, Cockpit IA (6) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Catalogue ADR Client-A par domaine (5) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
