# Retours forges — Produit-78 — 20260928g

- **Contexte** : application des décisions D-5 (a) et D-6 (a) du 28/09/2026 dans le run Produit-78-20260928-reseau : étape N0 validée, textes de préparation, semaine à blanc, brief du site, enregistrement local.
- **Références ledger** : `forge\ledger.jsonl` seq 173 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici.
- **Statut** : remis le 2026-09-28

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

## pilot (`digit-ai-factory`)

Une porte du parcours réseau est écrite sans contrôle qui la joue.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-15 | majeur | générique | `references\RUN-RESEAU.md`, étape N2 : trois portes, « faits chiffrés par `oracle-claims` ; transparence par `oracle-transparence` ; voix par la règle de marque ». Aucun oracle ne lit de règles de voix de publication : `oracle-run-reseau.mjs` juge RR1 à RR7 sans règle de voix ; `contrats-publication.json` de forge-agents ne porte que longueur, accroche, clôture, hashtags et pièce requise ; le lexique du produit est réservé au vocabulaire du lecteur. Les 11 règles vérifiables de la proposition d'Produit-02 (mots écartés, formules imposées, 2 émojis au plus, 3 à 5 hashtags, aucun taux en accroche) n'ont ni format de donnée ni lecteur. Les écrire créerait une donnée que rien ne lit ; les contrôler exigerait un contrôle maison. Preuve : ledger seq 173 ; registre du produit, amélioration A-08 en attente. | Un format de règles de voix par émetteur (mots écartés, formules imposées, plafonds), lu par `oracle-run-reseau.mjs` comme une 8e règle, avec sa fixture double sens. |

## La règle qui aurait évité le retour

Le retour porte une classe du référentiel, `regle-ecrite-sans-oracle-qui-la-joue` : la porte « voix » est écrite dans le parcours opposable, et aucun oracle ne la joue.

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'étude du 28/09 rangeait les liens suivis parmi les réglages natifs, alors que le site fixe lui-même l'origine transmise à Beds24 | brief d'un run de version du site ; question d'origine posée dans Beds24 en attendant ; écart consigné, entrée 171 | non | Hypothèse de l'étude, propre à ce site ; aucune règle de forge en cause. |
| La synthèse du tour précédent comptait « −35 % » sur 5 pages au lieu de 4 | chiffre corrigé dans la synthèse de ce tour et dans le brief ; écart consigné, entrée 172 | non | Erreur de lecture de la session, qui a pris des occurrences pour des pages. |

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
