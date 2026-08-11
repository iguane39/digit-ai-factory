---
role: architecture technique — structure logique, flux, choix (R-20, TF-0091)
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

## Vue d'ensemble

{Le système en un paragraphe : qui parle à qui, où vivent les données, ce qui est
volontairement simple. 3 à 6 phrases.}

## Composant : {front}

- role: {ce qu'il fait, une phrase}
- techno: {React 18 — détail au TECHNOS.md}
- expose: {HTTP :5173 — pages}
- etat: {sans état}

## Composant : {api}

- role: {ce qu'il fait, une phrase}
- techno: {FastAPI — détail au TECHNOS.md}
- expose: {HTTP :8080 — /api/*}
- etat: {sans état — persiste via bdd}

## Composant : {bdd}

- role: {persistance relationnelle}
- techno: {PostgreSQL 16}
- expose: {SQL :5432 — jamais public}
- etat: {détail des tables au MODELE-DONNEES.md}

## Flux

| De | Vers | Protocole | Mode | Donnée portée |
|---|---|---|---|---|
| {front} | {api} | {HTTP/JSON} | {synchrone} | {requêtes métier} |
| {api} | {bdd} | {SQL} | {synchrone} | {lecture/écriture des objets métier} |

## Données (D06)

{Où vivent les données et qui y touche — le détail des tables, colonnes et liens vit
dans `MODELE-DONNEES.md` (renvoi, pas duplication).}

## Delivery (D09)

{Comment ça se construit et se déploie, en 2-3 phrases : build, artefact, cible.
Les gestes exécutables vivent dans `COMMANDES.md`, l'instancié dans `COMPOSANTS-OPS.md`.}

## Choix structurants & renvois ADR

| Choix | Motif (une phrase) | ADR forge-audit |
|---|---|---|
| {monolithe modulaire} | {une équipe, un déploiement — le découpage attendra la preuve du besoin} | {ADR0104} |
