# Retours forges — factory-digit-ai-fr — 20261114n

- **Contexte** : exécution de l'amendement du 14/11/2026 (2) du run `forge-digit-ai-fr-20261114a`, contrôle de compréhension de la page témoin. Écart à l'amendement décidé par le créateur (D-73 (a)) : lecteurs isolés lancés sur l'abonnement au lieu de `--bare`.
- **Références ledger** : forge/ledger.jsonl seq 121.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le créateur a retenu D-73 (a) : le contrôle de compréhension de la page témoin tourne sur l'abonnement, les lecteurs étant isolés par `--setting-sources ""`, `--system-prompt`, `--tools ""`, `--disable-slash-commands` et `--strict-mcp-config`, avec une question piège avant chaque lecture. Le mode `--bare`, que l'amendement imposait, exige une clé d'API. Sur 6 lectures, aucune n'a montré de fuite de contexte.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-14 : l'écart appliqué, qui confirme en usage la recette proposée par le lot 20261114l.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-14 | **mineur** | générique | **Le mode isolé sur l'abonnement a tenu sur 6 lectures réelles : question témoin « AUCUN » et question piège « NON » à chaque fois.** Preuve : `forge/etapes/contenus/controle/forge-tests-texte-tour1.json` à `tour3.json`, champ `fuite_de_contexte` à faux ; coût relevé 0,442 $ pour 9 lancements, imputé à l'abonnement. | Joindre ce relevé à la recette « lecteur isolé sur abonnement » du lot 20261114l, comme preuve d'usage. |

## La règle qui aurait évité le retour

RP-14 : la même que pour RP-12 du lot 20261114l, qui n'a pas de recette pour lancer un lecteur isolé sur l'abonnement. Classe à créer : `lecteur-isole-sans-recette-sur-abonnement`, famille `contrat-interface-forge`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
