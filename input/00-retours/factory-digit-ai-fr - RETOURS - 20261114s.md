# Retours forges — factory-digit-ai-fr — 20261114s

- **Contexte** : étape `animation-forge-tests` du run `forge-digit-ai-fr-20261114a`. Un agent `constructeur` a dessiné l'animation légendée de la page de la forge des tests et son banc, puis les a jugés par les oracles de forme et de mouvement.
- **Références ledger** : forge/ledger.jsonl, les deux entrées `retour` de l'étape `animation-forge-tests` (destinataires `forge-design` et `forge-agents`).
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

L'animation est un SVG animé par CSS, piloté par une page de banc qui fige une phase par un paramètre d'adresse. Deux oracles l'ont mal jugée :

- `oracle-motion.mjs` a rendu PASS sans lire la feuille d'animation liée ;
- `render_page.py` a rendu 33 à 42 bloquants V4 sur des calques que l'animation cache à l'instant figé.

---

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Ce chapitre porte un retour, RP-21 : l'oracle de rendu juge visibles des éléments qu'une animation cache.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-21 | **majeur** | générique | **`render_page.py` (skill `digit-ai-page-html`) compte comme visibles des éléments cachés par l'opacité de leur groupe ou par leur tracé.** Un SVG animé, figé à n'importe quel instant, rend 33 à 42 bloquants V4 sur des calques invisibles. Une cible `file://` n'accepte pas non plus de paramètres d'adresse. Preuve : rapport du constructeur, friction F2 ; `forge/etapes/design-v2/animations/banc.html?phase=1` à `?phase=6`. | Calculer l'opacité effective, produit de celle des ancêtres. Compter un trait masqué par `stroke-dashoffset` comme invisible. Accepter une adresse `file://` avec paramètres. |

## digit-ai-forge-design (`digit-ai-forge-design`)

Ce chapitre porte un retour, RP-22 : l'oracle de mouvement ne lit pas l'animation d'une page qui la charge par une feuille liée.

Le tableau se lit comme le précédent.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-22 | **mineur** | générique | **`oracle-motion.mjs` ne suit pas les feuilles liées par `<link>`, et sa règle R11 ne reconnaît que les jetons `--dur*` et `--ease*`.** Sur `banc.html`, l'animation n'est pas jugée ; il faut rejouer l'oracle sur `clip-05.css` seul. Une boucle portée par `--cycle-phase` n'est pas résolue, et le PASS de R11 est vide sur ce point. Preuve : rapport du constructeur, friction F1. | Suivre les feuilles locales liées ; résoudre toute propriété personnalisée de durée, quel que soit son préfixe, et rendre NON_MESURE quand une durée ne se résout pas. |

## La règle qui aurait évité le retour

- RP-21 : un oracle de rendu ne juge que ce qui est visible à l'écran ; ici, il n'applique pas la règle à l'opacité héritée. Classe : `regle-morte`.
- RP-22 : un oracle qui ne lit pas sa cible doit dire qu'il ne l'a pas mesurée. Classe : `skill-ou-oracle-non-invoque`.

## Remarques restées au produit

- La légende de la phase 3 disait « vert ou rouge », alors que la palette de la direction B n'a ni vert ni rouge. Elle dit désormais « réussi ou en échec », et le banc a été régénéré. Généralisable : non, c'est une incohérence de cette page.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
