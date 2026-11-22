# Retours forges — factory-digit-ai-fr — 20261116g

- **Contexte** : hors run, mise en production du clip 01 (réponse D-230 a du créateur, 16/11/2026).
- **Références ledger** : forge/ledger.jsonl seq 445, 446.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 16/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

La mise en production du clip 01 a buté sur le lien Railway : depuis la racine de session en minuscule, `railway status` ne trouvait aucun projet lié. Le déploiement est passé depuis le chemin en majuscule enregistré par Railway. Dans le même tour, le hook de remisage a refusé un `git stash` sans étiquette, à juste titre.

---

## digit-ai-forge-ops (`forge-ops`)

Ce chapitre porte un retour, RT-91 : le lien Railway dépend de la casse du chemin.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-91 | **mineur** | générique | **`railway status` lancé depuis `c:\dev\factory.digit-ai.fr` répond « No linked project found » ; `~/.railway/config.json` enregistre le lien sous `C:\dev\factory.digit-ai.fr`. Depuis ce chemin, le statut et `railway up --ci` passent (déploiement 43515925).** Preuve : ledger du produit, entrée 445 ; même cause que TF-2443 (racine de session en minuscule). | Dans la recette de mise en production, lancer Railway depuis le `projectPath` enregistré dans `~/.railway/config.json`, ou passer `--project` et `--service` explicitement. |

## La règle qui aurait évité le retour

- RT-91 : classe à créer `outil-lie-a-la-casse-du-chemin` : un outil tiers lie un projet à un chemin sensible à la casse sous Windows.

## Remarques restées au produit

- Le refus du `git stash` sans étiquette par le hook de remisage (TF-1754) était justifié ; la vérification a été faite autrement. Généralisable : non, la règle a tenu son rôle (ledger, entrée 446).

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
