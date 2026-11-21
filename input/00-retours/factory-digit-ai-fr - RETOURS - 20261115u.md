# Retours forges — factory-digit-ai-fr — 20261115u

- **Contexte** : run `forge-digit-ai-fr-20261114a`, construction du socle de la version 2 du site sous `/v2` par un agent `constructeur`, le 15/11/2026.
- **Références ledger** : forge/ledger.jsonl seq 329, 334, 335.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le constructeur du socle de la version 2 a relevé 8 frictions. Les 5 qui concernent des forges sont au lot 20261115s, déjà remis. Les 3 autres sont propres au produit : ce lot les déclare et en dit la raison, pour que le registre de la Factory sache qu'elles ne lui reviennent pas.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-70 : un écart du produit qui gêne la recette des agents, sans règle de la Factory pour le prévenir.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-70 | **mineur** | produit | **Le constructeur du socle de la v2 n'a pas pu mettre `ruff check .` au vert : 5 erreurs étaient déjà là au commit de départ, dans 2 fichiers que sa consigne lui interdisait de toucher** (`app/contenu.py` et `tests/test_forge.py`). Sa grille d'arbitre exige pourtant toutes les vérifications natives au vert avant chaque commit. Preuve : `uv run ruff check .` au commit `168735e` du produit, 5 erreurs ; rapport du constructeur, 15/11/2026. | Une consigne d'agent qui interdit des fichiers relève d'abord leurs erreurs de vérification native, et les déclare comme référence admise, pour que l'agent ne soit pas jugé sur elles. |

## La règle qui aurait évité le retour

- RP-70 : rien n'oblige une consigne d'agent à relever les erreurs déjà présentes dans les fichiers qu'elle interdit. Classe à créer : `dette-preexistante-non-declaree-a-l-agent`.

## Remarques restées au produit

- La dette de style de code de `app/contenu.py` et `tests/test_forge.py` (entrée 329) reste au produit : elle sera corrigée par un run de version du site actuel, puisque ce run ne touche pas au site actuel avant la migration. Généralisable : oui, par RP-70.
- Le clic de lecture vidéo sans tête dans Edge (entrée 334) reste au produit : la lecture est prouvée au clavier, et le critère du brief demande seulement qu'elle soit relevée après activation. Généralisable : non, c'est un comportement du navigateur sans tête.
- `docs/projet/ACCES-TEST.md` (entrée 335), avec son marqueur de gabarit non remplacé et des identifiants en valeur, reste au produit : il est hors des items du constructeur et sera repris à l'étape de mise en ligne. Généralisable : non.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
