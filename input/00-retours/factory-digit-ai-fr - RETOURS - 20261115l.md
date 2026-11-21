# Retours forges — factory-digit-ai-fr — 20261115l

- **Contexte** : run `forge-digit-ai-fr-20261114a`, rédaction des pages de la forge des données et de la forge de design de la version 2 du site, à partir du catalogue de la Factory et des README des forges.
- **Références ledger** : forge/ledger.jsonl seq 287, 288.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Les rédacteurs des pages de la forge des données et de la forge de design ont comparé le catalogue de la Factory aux README de ces forges. Dans les deux cas, le README présente des contrôles ou des services que le catalogue ne porte pas. Les pages suivent le catalogue : elles ne peuvent pas citer ces services.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte 2 retours, RP-56 et RP-57 : le catalogue et les README des forges ne couvrent pas les mêmes services.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-56 | **majeur** | générique | **Le catalogue n'a aucune ligne pour 9 contrôles ou scripts que le README de la forge des données présente** : `oracle-jeu-fictif`, `oracle-delimiter`, `oracle-enchainer`, `oracle-qualifier`, `oracle-rapprocher`, `oracle-reconstruire`, `oracle-rendre`, `isoler-lignes-non-donnees`, `verifier_unites_parquet`. Le tableau de services du README est resté à la version 1.6.0 du catalogue, avec 7 services contre 15. Les services cat-dat-14 et cat-dat-15 donnent 444 et 449 vérifications le même jour, le 29/10/2026. Ni le README ni le catalogue ne définissent les couches Bronze et Silver. Preuve : `catalogue.jsonl` du pilot (version 1.8.0, dernier commit le 06/11/2026) ; README de `digit-ai-forge-data` ; rapport du rédacteur de la page `forge-data`, le 15/11/2026. | À la génération des vues, comparer le catalogue et le README : chaque contrôle présenté au README a sa ligne, ou le README le dit hors catalogue. Régénérer le tableau de services du README depuis le catalogue, et gloser les couches Bronze, Silver et Gold dans le README. |
| RP-57 | **mineur** | générique | **Le README de la forge de design présente 2 services sans ligne au catalogue** : le verbe `clip-de-presentation`, 5e verbe de la forge, et un « rendu comparatif d'un correctif » dit prouvé. Les preuves du catalogue de cette forge datent du 04/08 au 07/09/2026. Preuve : README de `digit-ai-forge-design` ; `catalogue.jsonl` du pilot ; rapport du rédacteur de la page `forge-design`, le 15/11/2026. | Le même contrôle de couverture que RP-56. |

## La règle qui aurait évité le retour

- RP-56 et RP-57 : rien ne compare la liste des services du README d'une forge à ses lignes de catalogue. Classe à créer : `catalogue-readme-desynchronises`.

## Remarques restées au produit

- Les pages citent les services du catalogue, et l'écart est écrit dans leurs « Manques signalés ». Généralisable : non, la cause générale est RP-56.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
