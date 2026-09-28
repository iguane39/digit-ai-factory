# Retours forges — Produit-78 — 20260928d

- **Contexte** : conformité du projet rejouée après le dépôt de la restitution de clôture du run Produit-78-20260928-mandat-etude, une fois le lot « Produit-78 - RETOURS - 20260928c » remis. Un lot remis ne se modifie pas : la friction trouvée à ce moment part dans ce lot.
- **Références ledger** : `forge\ledger.jsonl` seq 130 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici.
- **Statut** : remis le 2026-09-28

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

## pilot (`digit-ai-factory`)

La règle de nommage prescrit un outil de réindexation qui rend l'indice qu'elle refuse.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-10 | mineur | générique | `oracles\oracle-conformite-projet.mjs`, R-4 : « indice « 20260928a » porté par 2 livrables de radical distinct […] réindexer le plus récent (`scripts\allouer-indice.mjs`) ». R-4 juge l'indice par jour et par dossier ; `allouerIndice({ dossier, prefixe, jour })` ne cherche que les indices pris sous le même préfixe, et a rendu « a » pour « APDLB - Rapport - Synthèse de clôture du run de mandat - », dans un dossier où l'étude du jour porte déjà « a ». La restitution a été renommée à la main en « b ». Preuve : ledger seq 130. | Offrir à `allouerIndice` une portée « dossier » qui compte tous les radicaux du jour, et la nommer dans le message de R-4. |

## La règle qui aurait évité le retour

Le retour porte une classe du référentiel, `regle-qui-interdit-son-propre-remede` : le message de refus de R-4 prescrit un outil dont la réponse est refusée par R-4.

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La restitution de clôture portait l'indice « a » du jour, déjà pris par l'étude sous `output\` | renommée en « b », qui l'ordonne après l'étude, puis rejugée | non | Suite directe de RP-10 : la session a suivi l'outil prescrit. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| aucun document de la bibliothèque | — | — | — | — | — |

## Documents mûrs

Aucun document mûr sur ce lot : aucun document du produit n'a été repris 5 fois, et aucun verdict de lecteur n'a été rendu.

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| aucun | — | — | — | — | reste au produit, parce qu'aucun document n'est mûr |
