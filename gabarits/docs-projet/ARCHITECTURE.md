---
role: architecture technique — structure logique, flux, choix (R-20, TF-0091)
destinataire: humain
role_destinataire: développeur et architecte du produit
sources_de_verite: ["{arborescence du code}", "{docker-compose.yml}", forge/EXIGENCES.json]
verifie_le: {AAAA-MM-JJ}
---

# Architecture — {Produit}

> Ce document DÉCRIT la structure ; il ne la juge pas — zéro score, zéro verdict
> (l'audit, c'est forge-audit, sur mandat). Vue LOGIQUE : composants, flux, choix.
> L'instancié déployé (noms réels, IDs, URLs) vit dans `COMPOSANTS-OPS.md` — chacun
> renvoie à l'autre, aucune duplication. Plan repris des dimensions descriptives du
> référentiel d'audit : D01 composants & dépendances · D06 données · D09 delivery.
> Projection : `node <pilot>\scripts\generer-architecture.mjs docs\projet\ARCHITECTURE.md`
> régénère `ARCHITECTURE.html` — la vue n'est JAMAIS éditée à la main.
>
> **Chapeau de chapitre (L7 du socle, TF-2692).** Chaque `##` ouvre par UNE citation `> …` qui dit ce que CE chapitre apprend au
> lecteur (40 caractères au moins, une phrase, jamais la même d'un chapitre à l'autre ni une paraphrase du titre). Elle s'ÉCRIT, la vue
> ne la génère pas : la vue lui donne la classe `ch-apprend`, et sans elle la page échoue L7 dès quatre chapitres.

## Vue d'ensemble

> {Ce que ce chapitre apprend : qui parle à qui dans ce produit et où vivent ses données.}

{Le système en un paragraphe : qui parle à qui, où vivent les données, ce qui est
volontairement simple. 3 à 6 phrases.}

## Composant : {front}

> {Ce que ce chapitre apprend : ce que fait le composant front, ce qu'il montre et ce qu'il appelle.}

- role: {ce qu'il fait, une phrase}
- techno: {React 18 — détail au TECHNOS.md}
- expose: {HTTP :5173 — pages}
- etat: {sans état}

## Composant : {api}

> {Ce que ce chapitre apprend : ce que fait le composant api et ce qu'il est seul à toucher.}

- role: {ce qu'il fait, une phrase}
- techno: {FastAPI — détail au TECHNOS.md}
- expose: {HTTP :8080 — /api/*}
- etat: {sans état — persiste via bdd}

## Composant : {bdd}

> {Ce que ce chapitre apprend : ce que le composant bdd conserve et qui peut l'atteindre.}

- role: {persistance relationnelle}
- techno: {PostgreSQL 16}
- expose: {SQL :5432 — jamais public}
- etat: {détail des tables au MODELE-DONNEES.md}

## Flux

> {Ce que ce chapitre apprend : les flux entre composants, un par ligne, et ce que chacun porte.}

{Phrase de lecture : une ligne est un flux d'un composant vers un autre ; dire ce que vaut chaque colonne, comment la table est triée et ce que la table exclut.}

| De | Vers | Protocole | Mode | Donnée portée |
|---|---|---|---|---|
| {front} | {api} | {HTTP/JSON} | {synchrone} | {requêtes métier} |
| {api} | {bdd} | {SQL} | {synchrone} | {lecture/écriture des objets métier} |

## Données (D06)

> {Ce que ce chapitre apprend : où vivent les données et où lire le détail de leur modèle.}

{Où vivent les données et qui y touche — le détail des tables, colonnes et liens vit
dans `MODELE-DONNEES.md` (renvoi, pas duplication).}

## Delivery (D09)

> {Ce que ce chapitre apprend : comment le produit se construit et se déploie, de l'artefact à la cible.}

{Comment ça se construit et se déploie, en 2-3 phrases : build, artefact, cible.
Les gestes exécutables vivent dans `COMMANDES.md`, l'instancié dans `COMPOSANTS-OPS.md`.}

## Choix structurants & renvois ADR

> {Ce que ce chapitre apprend : les choix qui structurent le produit et la décision qui fonde chacun.}

{Phrase de lecture : une ligne est un choix structurant ; dire ce que vaut chaque colonne, comment la table est triée et ce que la table exclut.}

| Choix | Motif (une phrase) | ADR forge-audit |
|---|---|---|
| {monolithe modulaire} | {une équipe, un déploiement — le découpage attendra la preuve du besoin} | {ADR0104} |
