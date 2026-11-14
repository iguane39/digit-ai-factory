# Retours forges — factory-digit-ai-fr — 20261114m

- **Contexte** : boucle L99 du 14/11/2026 sur le prompt « défauts créés par les corrections des agents ». Deux relecteurs aveugles, lancés en lecture seule stricte, ont écrit des fichiers temporaires.
- **Références ledger** : forge/ledger.jsonl seq 117.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

À la passe 3 de la boucle, les 2 relecteurs aveugles (agents génériques) avaient pour consigne « aucune écriture ». Pour vérifier une prémisse, chacun a écrit des fichiers temporaires hors dépôt : une copie du registre TODO, des scripts sous `/tmp`. Ils les ont supprimés, puis l'ont déclaré dans leur rapport. Aucun fichier des dépôts n'a été touché. Même famille que RP-7 du lot 20261114h : une lecture seule écrite dans la consigne, que rien ne fait respecter.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-13 : un relecteur « en lecture seule » écrit des fichiers, faute d'un type d'agent sans outil d'écriture.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-13 | **mineur** | générique | **2 relecteurs sur 2 de la passe 3 ont écrit des fichiers temporaires malgré la consigne « aucune écriture ».** Preuve : rapports finaux des deux agents, qui déclarent l'écriture et la suppression. L'agent générique dispose de Write et de Bash ; aucun type de relecteur sans écriture n'existe. | Créer un type d'agent relecteur dédié sans Write ni Edit, ce qui rejoint TF-2241 (O6 de l'étude du 06/11). À défaut, la consigne de relecture fournit un dossier de brouillon autorisé, hors dépôt. |

## La règle qui aurait évité le retour

RP-13 : la lecture seule d'un relecteur n'est tenue que par sa consigne. Classe à créer : `agent-lecture-seule-ecrit-hors-perimetre`, famille `regle-morte`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
