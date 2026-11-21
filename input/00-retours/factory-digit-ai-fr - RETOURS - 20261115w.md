# Retours forges — factory-digit-ai-fr — 20261115w

- **Contexte** : run `forge-digit-ai-fr-20261114a`, critique d'implémentation de forge-design sur les 16 pages de la version 2 du site, servies en local.
- **Références ledger** : forge/ledger.jsonl seq 378.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

La critique d'implémentation, jouée sur les 16 pages servies, refuse 2 pages par la règle S6 d'oracle-slop. Le caractère visé est une flèche « ↔ » qui fait partie du nom exact d'un service du catalogue de la Factory, repris tel quel par la page, comme la consigne de rédaction l'exige.

---

## digit-ai-forge-design (`forge-design`)

Ce chapitre porte un retour, RP-72 : un contrôle de design prend un signe typographique d'un texte courant pour un emoji de décor.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-72 | **mineur** | générique | **La règle S6 d'oracle-slop refuse le caractère « ↔ » (U+2194) comme un emoji d'interface, alors qu'il figure dans le nom exact d'un service du catalogue, « Réconcilier (Gold ↔ modèle sémantique) ».** Preuve : sortie de `run-oracles-design.mjs` sur `/v2/outils` (ligne 2631) et `/v2/outils/forge-data` (ligne 1135), le 15/11/2026 ; `forge/etapes/contenus/forge-data.md`, ligne 67, du produit. | Limiter S6 aux emojis à présentation emoji par défaut et aux pictogrammes de décor, et laisser passer les flèches typographiques d'un texte courant ; ou offrir un marqueur d'exemption pour un nom propre repris. |

## La règle qui aurait évité le retour

- RP-72 : classe à créer `oracle-faux-positif-typographie` — un contrôle de design prend un signe typographique d'un texte courant pour un emoji de décor.

## Remarques restées au produit

- Le refus est arbitré au produit comme faux, et le nom du service reste tel quel sur les 2 pages. Généralisable : non, la cause générale est RP-72.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
