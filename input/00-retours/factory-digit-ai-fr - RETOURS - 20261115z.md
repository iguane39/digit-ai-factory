# Retours forges — factory-digit-ai-fr — 20261115z

- **Contexte** : run `forge-digit-ai-fr-20261114a`, audit `forge_tests` du site, routes de la v2 déclarées par `FORGE_TESTS_QUALIF_ROUTES`, contre l'image d'essai servie en local.
- **Références ledger** : forge/ledger.jsonl seq 393.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le pan contraste rend 4 constats bloquants sur des libellés d'animations SVG en boucle infinie. Au repos, chaque phase de ces animations montre le libellé lisible : la mesure a lu une image de fondu. Les 4 constats deviennent 4 actions de développement à arbitrer à la main.

---

## digit-ai-forge-tests (`forge-tests`)

Ce chapitre porte un retour, RP-75 : un contrôle de rendu mesure une animation en boucle pendant une transition et compte le constat bloquant.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-75 | **mineur** | générique | **Le pan contraste compte bloquants 4 libellés d'animations CSS infinies mesurés pendant leur fondu : « projet » à 1,01:1 sur `/v2/`, « écrans » à 2,61:1 sur `/v2/outils/forge-tests`, « agent » à 1,76:1 et « charge » à 1,95:1. La note TF-2313 du pan dit qu'une animation sans fin n'est pas attendue, mais le constat reste bloquant.** Preuve : `forge/etapes/tests/rapport-20261115c.json` du produit, constats `contraste:/v2/…` ; captures au repos `forge/etapes/design-v2/animations/captures/<animation>/phase-N.png`, où chaque libellé se lit. | Pour un texte porté par une animation CSS infinie, mesurer à l'état figé de la page (animations en pause sur leur image de repos, ou mouvement réduit émulé), ou classer le constat en `non_juge` « mesure en cours de transition » plutôt qu'en bloquant. |

## La règle qui aurait évité le retour

- RP-75 : classe à créer `oracle-mesure-en-transition` — un contrôle de rendu mesure une animation en boucle pendant une transition et compte le constat bloquant.

## Remarques restées au produit

- Les 4 constats sont arbitrés au produit comme des mesures de transition, sans changement des animations. Généralisable : oui, même cause que RP-73 côté `render_page.py`.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
