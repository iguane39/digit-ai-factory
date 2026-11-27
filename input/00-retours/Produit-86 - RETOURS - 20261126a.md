# Retours forges — Produit-86 — 20261126a

- **Contexte** : restitution du run `20261125b-definition-openapi-api-cdc` (définition OpenAPI de l'API de Produit-84), refusée par le porteur pour son format le 26/11/2026.
- **Références ledger** : `forge\ledger.jsonl`, seq 1052 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 26/11/2026 est `todo/CLASSES.json` du pilot. Aucune classe ne couvre le cas : la plus proche, `decision-ecrite-dans-le-vocabulaire-de-l-auteur`, vise une décision déjà au format B. Classe à créer : `decision-hors-selecteur-echappe-aux-controles`.

## digit-ai-factory (pilot)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-75 | majeur | générique | Le 25/11/2026 vers 16:34, `factory.mjs restitution --prejuger` a rendu `affichable: true` une restitution dont le bloc 3 posait une décision titrée « **Décision 1 — …** », en prose, options (a), (b), (c) en ligne, sans sélecteur D-N réservé ni tableau `Option · Ce qui se passe · Coût · Retour arrière`. Elle rappelait en une ligne 4 décisions posées en entier plus tôt dans la même session sous « Décision 1 » à « Décision 4 ». S30, S78, RÉSERVATION et RÉAFFICHAGE n'ont rien relevé. Le porteur l'a refusée le 26/11 : « Le format de la restitution ne respecte pas l'attendu. » Reprise au format B avec D-493 à D-497 réservés : affichable. | Lire « Décision N » (et toute tête de décision en gras portant des options) comme une tête de décision : S30 exige alors un sélecteur D-N, S78 le tableau du format B, RÉSERVATION l'inscription, et RÉAFFICHAGE compte ces têtes parmi les décisions posées dans la session. Fixture rouge : la restitution du 25/11 à 16:34. |

## La règle qui aurait évité le retour

- `decision-hors-selecteur-echappe-aux-controles` (RP-75) : un contrôle qui s'ancre sur une forme prescrite (« D-N ») juge aussi les formes voisines qui portent le même contenu (une tête en gras suivie d'options), sinon l'écart de forme le fait taire.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests | 16 copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré au lot 20261125a) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : aucun refus de plateforme n'a été rencontré.

## Confirmations positives

- `reserver-decision.mjs` a réservé D-493 à D-497 en cinq appels, sans collision, et le préjugement a guidé la reprise règle par règle (S15, S16, S20, S23).
