# Retours forges — Produit-84 — 20261104c

- **Contexte** : réalignement du rapport d'audit du 04/11/2026 sur le format standard `gd-rapport-audit`, production de la présentation à l'instance de décision et de la fiche sécurité (demande du porteur « A1 »).
- **Références ledger** : `forge\ledger.jsonl` seq 177 et 178.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-04
- **Complétude** : 2 entrées `type: retour` écrites depuis le lot 20261104b (seq 177 et 178), relues le 04/11/2026 à 10:46 dans `forge\ledger.jsonl` ; les 2 vont au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le réalignement.** Les champs du gabarit ont été ajoutés à `rapport-data.json` : cartes de synthèse, D00, gate, architecture, tests, analyses, composants. Les deux gates sont à exit 0.
- **La présentation.** Générée telle quelle, elle affichait « Aucun constat critique » et un plan vide pour un audit en NO-GO. Elle a été rendue depuis une vue dérivée des mêmes données.
- **Le décompte.** La cause du faux bloquant D14 (RU-7, lot 20261104a) est mesurée.

## Forge audit (`digit-ai-forge-audit`)

2 retours.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-8 | majeur | générique | **`build-slides.mjs` rend une présentation fausse et incomplète.** Le 04/11/2026, sur un `rapport-data.json` aux deux gates verts : (1) la diapositive des risques filtre `severite === 'critique'`, valeur absente du vocabulaire du référentiel (Fatal, Bloquant, Majeur, Standard), et affiche « Aucun constat critique » pour 2 Fatals et 17 Bloquants ; (2) le plan lit `data.actions`, vide quand les remédiations sont portées par les règles, au lieu du plan de `buildPlan` ; (3) 5 diapositives contre 8 dans `presentation-autorite.template.md`, sans schéma d'architecture (que le commentaire du générateur dit conservé), sans contexte ni contacts. Ledger seq 177. | Filtrer sur Fatal et Bloquant ; lire le plan de `buildPlan`, comme le rapport ; rendre les 8 diapositives du gabarit, schéma compris (`renderArchi`) ; juger la présentation par un oracle, comme le rapport. Règle qui aurait évité le retour : aucune, la présentation n'a pas d'oracle. **RU-8** : classe proposée `generateur-de-livrable-sans-oracle`. |
| RU-9 | mineur | générique | **Un score `null` compte comme bloquant.** Une dimension `off` qui porte `"score": null` est comptée bloquante par `rapport-engine.mjs` et `build-slides.mjs` (`d.score <= 2` vaut `true` pour `null` en JavaScript), et `verifier-rapport.mjs` accepte ce `null`. Retirer la clé a ramené les bloquants de 16 à 15 le 04/11/2026. Cause de RU-7 (lot 20261104a). Ledger seq 178. | `verifier-rapport.mjs` refuse un score `null` ; le moteur teste `typeof score === 'number'`. Règle qui aurait évité le retour : aucune fixture avec un score `null`. **RU-9** : classe existante `oracle-faux-positif`. |

## Rattachement

Registre interrogé le 04/11/2026 au pilot, `todo/TODO.jsonl` : la recherche `build-slides` n'a pas été rejouée dans ce lot ; RU-9 précise la cause de RU-7 (lot 20261104a), que le pilot n'a pas encore ingéré.

Items recoupés : RU-7 (lot 20261104a).

## Remarques restées au produit

- Mon chemin `/c/dev/…` passé à `build-rapport.mjs` a été lu comme `C:\c\dev\…` ; rendu égaré supprimé dans le tour. Généralisable : non, erreur de la session.
- Fiche sécurité d'abord éditée à la main, puis reconstruite par `construire.mjs` comme l'exige le produit. Généralisable : non, erreur de la session, corrigée dans le tour.

## Retours sur les documents produits

- `gd-presentation-autorite` : la sortie du générateur ne tient pas la trame de 8 diapositives (RU-8).

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le moteur de rapport rend, une fois fournis, les cartes de synthèse, le schéma d'architecture et les vues des tests, des outils et des composants, et le manifeste des écarts s'est vidé.
- `render_page`, joué par la critique de design, a détecté un débordement de 10 px à 390 px causé par un chemin de fichier dans une synthèse.

## Ordre recommandé

1. RU-8 : une instance de décision lit « aucun constat critique » sur un NO-GO.
2. RU-9 : correction courte, qui ferme RU-7.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RU-8 : aucune, la présentation n'a pas d'oracle.
- RU-9 : aucune fixture avec un score `null`.
