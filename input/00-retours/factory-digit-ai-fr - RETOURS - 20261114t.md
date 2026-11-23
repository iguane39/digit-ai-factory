# Retours forges — factory-digit-ai-fr — 20261114t

> **Annoté à la réception le 23/11/2026** : ce lot a été refusé à la porte le 23/11/2026 (la ligne du sidecar portait une famille du référentiel au lieu d'une clé de classe). Clé choisie à la lecture du retour : RP-23 devient `oracle-perimetre-de-non-mesure-non-publie` (famille `regle-morte`), la même que RP-22 du lot 20261114s, comme le dit la section « La règle qui aurait évité le retour ». Reportée au sidecar et à cette section. Aucun autre mot du lot n'a changé ; l'original reste chez le produit.

- **Contexte** : étape `animation-forge-tests` du run `forge-digit-ai-fr-20261114a`, critique d'implémentation de forge-design jouée sur le banc de l'animation. Ce lot complète le lot 20261114s, déjà remis, qui porte les entrées 148 et 149 du ledger.
- **Références ledger** : forge/ledger.jsonl seq 155 ; les seq 148 et 149 sont portées par le lot 20261114s.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

`run-oracles-design.mjs` a jugé le banc de l'animation avec la feuille de jetons de la direction B. L'oracle de bascule y a déclaré la palette sombre absente, alors qu'elle vit dans la feuille de jetons liée, celle-là même qui lui était passée.

---

## digit-ai-forge-design (`digit-ai-forge-design`)

Ce chapitre porte un retour, RP-23 : l'oracle de bascule ne lit pas la palette sombre d'une feuille liée.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-23 | **mineur** | générique | **`oracle-bascule.mjs` (règle B-T4) déclare « palette sombre absente » quand le bloc `[data-theme="dark"]` vit dans une feuille liée.** Il ne lit que le HTML, même quand cette feuille lui est passée par `--tokens`. Preuve : `run-oracles-design.mjs` sur `forge/etapes/design-v2/animations/banc.html --tokens ../studio/tokens-b.css`, feuille qui porte le bloc sombre à la ligne 201. | Lire le fichier passé par `--tokens` et les feuilles locales liées avant de juger B-T4. |

## La règle qui aurait évité le retour

RP-23 : un oracle qui ne lit pas sa cible doit dire qu'il ne l'a pas mesurée. Classe : `oracle-perimetre-de-non-mesure-non-publie` (famille `regle-morte`), la même que RP-22 du lot 20261114s.

## Remarques restées au produit

- La même critique relève deux vrais manques de la feuille de jetons de la direction B : aucun jeton ne prescrit l'anneau de focus (règle T8), et aucun `color-scheme` n'accompagne les thèmes clair et sombre (règle SC4). Ils se corrigent à l'étape de la maquette. Généralisable : non, ce sont des manques de cette feuille.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
