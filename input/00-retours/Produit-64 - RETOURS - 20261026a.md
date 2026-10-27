# Lot de retours — Produit-64 → digit-ai-factory (constat de différence entre branches) — 2026-10-26, indice a

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-factory`, règle de preuve des constats sur un dépôt (gabarit `gabarits/RESTITUTION.md`, bloc 4, et `oracle-synthese`).

**Origine** : session de conversation du 26/10/2026, vers 10:15 (heure de Paris). Erreur relevée par la session elle-même : elle a relu ses propres mesures pour répondre à la demande du porteur « identifie les modifications à faire pour R16 ».

Ce lot porte **1 retour** (RT-72).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-26** dans le sas d'arrivée du pilot. Les empreintes SHA-256 ont été comparées des deux côtés après la copie. L'original reste ici, dans l'historique du produit.

---

## digit-ai-factory (preuve des constats sur un dépôt)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-72 | mineur | générique | **Un constat « fichiers absents de `main` » a été écrit à partir d'un écart de contenu, sans lire le statut de chaque fichier.** La fiche du 21/10 (`output/old/03-Syntheses/Client-A - Pipelines IAC Dev et Qualif - Ecarts a GDE0201 v1.2 - 20261021a.md`, constat 4) disait « `env/uat` contient 3 fichiers qui ne sont pas dans `main` ». La mesure du 26/10 sur les mêmes empreintes (`main` 35618ba, `env/uat` db5274d), avec `git diff --name-status origin/main origin/env/uat`, donne `M` pour les 3 fichiers : ils existent dans les deux branches avec un contenu différent. La préconisation tirée de ce constat changeait de nature : il fallait reporter 10 lignes de `infra/prd.tfvars`, et non ajouter 3 fichiers. La fiche était jugée PASS, et la restitution aussi. | 1) Règle de preuve : un constat de différence entre deux références git cite la sortie de `git diff --name-status` (statuts A, M, D), et non `--stat` ni `--shortstat`, qui ne disent pas si le fichier existe des deux côtés. 2) Contrôle d'`oracle-synthese` : signaler « absent(s) de », « n'est pas dans » ou « ne sont pas dans » suivi d'un nom de branche, quand la preuve citée ne contient ni statut `A`/`D` ni `--name-status`. 3) Fixture rouge/verte : le constat 4 de la fiche du 21/10 en rouge, celui de l'indice b du 26/10 en vert. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-72** : classe `classe-a-creer`, proposée `constat-de-difference-sans-statut-de-fichier` : un écart entre deux branches décrit comme une absence alors qu'aucune sortie lue ne distingue ajout, suppression et modification.

## Rattachement

Registre interrogé le 26/10/2026 : `grep -i -E "name-status|absent.*diff|diff.*absent|fichiers absents|modifi[ée]s? au lieu|ajout.*modif" todo/TODO.jsonl` → 8 ligne(s) trouvée(s) ; aucun item ne porte sur cette classe (8 lignes rendues, toutes hors sujet : TF-0549, TF-0802, TF-0819, TF-0818, TF-0852, TF-0858, TF-0912, TF-0844). Item voisin : S76 du gabarit (un chiffre rapporté par un agent se recompte à la source), qui porte sur un chiffre et pas sur la nature d'un écart.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Constat 4 de la fiche IAC du 21/10 | nouvel indice `20261026b` corrigé ; l'indice `20261021a` est passé dans `output/old/03-Syntheses/` | oui | proposé à la factory en RT-72 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de documents de la bibliothèque sur ce lot.

## Documents mûrs

Déclaration reprise du lot `20261020b`, sans changement : aucune nouvelle série n'atteint 5 versions datées dans ce tour.

| Document | Versions | Verdict |
|---|---|---|
| Guide développeur POC-to-Prod | 30 | remonté : sa forme est la famille `gd-guide-de-reference` du pilot depuis le 28/09/2026 (règle R-57) |
| Modèle Rapport d'audit POC-to-Prod | 22 | reste au produit, parce qu'il est régénéré par `propager-pack.mjs` à chaque version du pack Client-A ; ses versions suivent le pack, pas une forme manquante |
| Catalogue ADR Client-A par domaine | 5 | reste au produit, parce qu'il est régénéré à chaque bump du dépôt de gouvernance Client-A (outils `actualiser-catalogue-depot.mjs`) |
| Comparatif des pipelines - Guide, IA Essentials, Cockpit IA | 6 | reste au produit, parce qu'il est déjà rendu par le générateur de la famille `gd-guide-de-reference` ; ses versions suivent le parc des produits Client-A |
| Propositions ADR par domaine | 16 | reste au produit, parce qu'il porte des propositions d'ADR propres à Client-A ; la série est close depuis le 30/06/2026 |
| Schéma Process POC-to-Prod End-to-end | 14 | reste au produit, parce que c'est un schéma de la méthode Client-A ; la série est close depuis le 08/07/2026 |
| Référentiel POC-to-Prod - Audit | 10 | reste au produit, parce que son contenu est le référentiel Client-A, et que sa forme générique vit au produit d'audit `digit-ai-forge-audit` |
| Compliance Pack - Format & Contenus des contraintes | 10 | reste au produit, parce qu'il décrit le pack Client-A ; série close depuis le 10/07/2026 |
| Process Ingénierie POC-to-Prod - Consolidation et cible | 7 | reste au produit, parce qu'il est propre à la méthode Client-A ; série close depuis le 01/09/2026 |
| Matrice Contraintes ADR Light-Complet | 6 | reste au produit, parce qu'elle est propre au périmètre Client-A ; série close depuis le 08/07/2026 |

## Confirmations positives

- Relire ses propres mesures avant de bâtir une préconisation dessus a suffi à trouver l'erreur, avant qu'IAC n'agisse sur la préconisation 2.

## Ordre recommandé

RT-72 seul.
