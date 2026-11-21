# Retours forges — factory-digit-ai-fr — 20261115x

- **Contexte** : run `forge-digit-ai-fr-20261114a`, rendu de contrôle `render_page.py` (skill digit-ai-page-html) sur les 16 pages de la version 2 du site, servies en local, à 390 et 1 440 px, thèmes clair et sombre.
- **Références ledger** : forge/ledger.jsonl seq 381.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le rendu de contrôle compte 2 contrastes bloquants dans des animations en boucle, sur les pages du développement et de l'observabilité. Au repos, chaque phase de ces animations montre le mot visé lisible sur le fond clair : la mesure a été prise pendant un fondu, sur une boucle qui tourne sans scènes déclarées.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-73 : un contrôle de rendu mesure une animation en boucle pendant une transition et compte le constat bloquant.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-73 | **mineur** | générique | **`render_page.py` mesure le contraste d'un texte d'animation CSS infinie à un instant quelconque de la boucle, et le compte bloquant : « agent » à 1,76:1 sur un fond rgb(40,30,23) absent sous ce mot au repos, « qualité » à 1,04:1 alors que son opacité vaut 0 de 0 à 3 % du cycle.** Preuve : `v2_outils_forge-development-clair.json` et `v2_outils_forge-observability-clair.json` du rendu du 15/11/2026 (famille v2_contrast) ; capture au repos `forge/etapes/design-v2/animations/captures/clip-02/phase-2.png` du produit, où « agent » se lit sur le fond clair ; `static/v2/animations/clip-10.css`, keyframes `c10-l1`. | Pour une animation CSS infinie sans scènes déclarées, mesurer le texte animé sur l'état figé de la page (animations mises en pause à leur image de repos, ou mode de mouvement réduit), ou classer le constat en NON JUGÉ « mesure en cours de transition » plutôt qu'en bloquant. |

## La règle qui aurait évité le retour

- RP-73 : classe à créer `oracle-mesure-en-transition` — un contrôle de rendu mesure une animation en boucle pendant une transition et compte le constat bloquant.

## Remarques restées au produit

- Les 2 constats sont arbitrés au produit comme des mesures de transition : aucun mot ne change. Généralisable : non, la cause générale est RP-73.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
