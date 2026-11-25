# Lot de retours — Produit-64 → digit-ai-factory (un remisage nu arrêté par le garde, mesure d'efficacité) — 2026-11-23, indice e

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, garde de remisage (`forge/hooks/factory.mjs remisage`, TF-1754).

**Origine** : session interactive du 23/11/2026. Après les décisions D-22 (a) et D-23 (a), la session a créé le wiki du projet APP-IA, puis inséré un texte au guide du développeur dans un arbre de travail propre. Pour comparer l'oracle de forme avant et après l'insertion, elle a tenté un `git stash -q`, refusé par le garde.

Ce lot porte **1 retour** (RT-84).

- **Contexte** : une session de ce produit, hors run.
- **Références ledger** : `forge/ledger.jsonl`, seq 27 (retour RT-84).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : rédigé et remis le 2026-11-23.

---

## digit-ai-factory (garde de remisage)

Le retour, son fait mesuré et ce qu'il demande :

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-84 | mineur | générique | **Le garde de remisage a arrêté une récidive, dans un arbre de travail détaché.** Le 23/11/2026 vers 16:07, dans un `git worktree` de commit, la session a enchaîné `git stash -q`, l'oracle de forme, puis `git stash pop -q`. Le hook a refusé la commande avant exécution : « REMISAGE REFUSÉ (TF-1754) — `git stash -q` remise SANS étiquette ». Rien n'a été remisé. La session a comparé l'état d'avant sur une copie d'`origin/dev`, sans remisage. | Aucun changement demandé : c'est une mesure d'efficacité du garde, qui a joué dans un arbre de travail secondaire, là où la pile partagée est la plus dangereuse. À compter comme une récidive arrêtée pour la classe. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-84** : classe `remisage-partage-sans-garde`. Le garde existe et a joué ; la récidive vient d'un réflexe de la session pour comparer deux états d'un fichier, que la copie depuis `origin/dev` remplace sans risque.

## Rattachement

Registre interrogé le 23/11/2026 : `node -e` sur `todo/CLASSES.json`, filtre « stash, remisage, suppression à cible variable » → 1 ligne(s) trouvée(s), `remisage-partage-sans-garde`, à laquelle ce retour se rattache.

## Remarques restées au produit

Un second refus du même tour reste au produit, parce que la leçon est déjà en mémoire du poste et que le garde a joué : une suppression `Remove-Item` dont la cible passait par une variable a été refusée par le garde `rm-variable` du poste, puis réécrite avec un chemin littéral. Généralisable : non, parce que ce garde est propre au poste et déjà en service.

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot : les 2 pages du wiki et le texte du guide suivent la proposition `Client-A - Proposition - Presentation des produits dans Azure DevOps - 20261123f.md`, et `check_markdown.py` les rend PASS.

## Documents mûrs

Mesurés par `node forge/retours/oracle-lot.mjs` le 23/11/2026 : 10 documents. Ce lot n'instruit pas leur forme ; les verdicts du lot `Produit-64 - RETOURS - 20261123a` restent inchangés, et ils sont rappelés ci-dessous.

| Document (versions) | Verdict |
|---|---|
| Guide développeur POC-to-Prod (30) | remonté : sa forme est la famille `gd-guide-de-reference` du pilot, publiée le 28/09/2026 |
| Modèle Rapport d'audit POC-to-Prod (24) | reste au produit, parce que sa forme relève du produit d'audit (`auditcore`) et non de la bibliothèque du pilot ; non instruit plus avant par cette session |
| Propositions ADR par domaine (16) | reste au produit, parce que sa matière est propre à Client-A ; forme non instruite par cette session, à juger par le porteur |
| Schéma Process POC-to-Prod End-to-end (14) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Référentiel POC-to-Prod - Audit (10) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Compliance Pack - Format & Contenus des contraintes (10) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Process Ingénierie POC-to-Prod - Consolidation et cible (7) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Matrice Contraintes ADR Light-Complet (6) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Comparatif des pipelines - Guide, IA Essentials, Cockpit IA (6) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |
| Catalogue ADR Client-A par domaine (5) | reste au produit, parce que sa forme n'a pas été instruite par cette session ; à juger par le porteur |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé. La création du wiki, de ses pages et le déplacement d'ordre ont été acceptés par Azure DevOps ; les 2 refus du tour viennent des garde-fous du poste, pas de la plateforme.
