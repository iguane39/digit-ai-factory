# Retours forges — Produit-78 — 20260928c

- **Contexte** : restitution de clôture du run Produit-78-20260928-mandat-etude, jugée par `oracle-synthese` après la remise du lot « Produit-78 - RETOURS - 20260928b ». Un lot remis ne se modifie pas : la friction trouvée en écrivant la restitution part dans ce lot.
- **Références ledger** : `forge\ledger.jsonl` seq 129 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici.
- **Statut** : remis le 2026-09-28

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

## pilot (`digit-ai-factory`)

Le juge des restitutions refuse les identifiants que deux gabarits du pilot prescrivent.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-9 | majeur | générique | `oracles\oracle-synthese.mjs`, `ID_STABLE` (ligne 789) exige 2 à 4 chiffres, et S14 retire d'abord tout « A-N » comme un sélecteur d'action. Le gabarit `gabarits\docs-projet\TODO-PRODUIT.md` numérote les améliorations `{A-01}` : une action qui cite son identifiant réel échoue à S14. Le gabarit de lot numérote les retours par préfixe et numéro (« RT-2 ») : une remontée qui cite « RQ-3 » échoue à S39. Mesuré sous Node 24 : « registre A-01 », « RQ-3 » et « RT-2 » non reconnus, « TF-1319 » reconnu. À l'inverse, `DECLAREE_NEUVE` lit « neuf » dans « un clone neuf » et fait passer S14 à une action sans identifiant. La restitution de clôture de ce run échoue ainsi à S14 et à S39 sur des identifiants réels. Preuve : ledger seq 129. | Reconnaître les identifiants du registre produit et des lots, sélecteur `A-N` du message exclu par sa position en tête de ligne ; borner `DECLAREE_NEUVE` à la mention « (neuve) ». |

## La règle qui aurait évité le retour

Le retour porte une classe du référentiel, `deux-regles-du-socle-inconciliables` : les gabarits du registre produit et du lot de retours prescrivent une forme d'identifiant que le juge des restitutions refuse.

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La restitution portait 7 défauts de forme à sa première passe : non-traités sans motif sur leur ligne, affirmation sans preuve, source sans chemin, codes sans glose, confirmation d'écriture sans chemin absolu, correction sans contrôle rouge et vert | réécrite ligne par ligne, puis rejugée | non | Défauts de rédaction de la session ; les règles existent et ont mordu. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. La restitution suit le gabarit `forge\RESTITUTION.md`, hors de la bibliothèque `gabarits\documents\`.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| aucun document de la bibliothèque | — | — | — | — | — |

## Documents mûrs

Aucun document mûr sur ce lot : aucun document du produit n'a été repris 5 fois, et aucun verdict de lecteur n'a été rendu.

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| aucun | — | — | — | — | reste au produit, parce qu'aucun document n'est mûr |
