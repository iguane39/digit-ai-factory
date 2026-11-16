# Retours forges — Produit-86 — 20261112e

- **Contexte** : run `20261112a-comptes-et-ecritures`. Deux sessions de Produit-86 ont fait travailler chacune un agent constructeur dans la même copie de travail, et la collision n'a été vue que par un message entre sessions.
- **Références ledger** : `forge\ledger.jsonl` seq 962 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 12/11/2026 est `todo/CLASSES.json` du pilot. RP-67 s'y rattache à `designateur-de-decision-sans-reservation`, par analogie : une ressource partagée par deux sessions du même produit, ici une copie de travail au lieu d'un numéro de décision, n'est réservée nulle part.

## digit-ai-forge-agents

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-67 | majeur | générique | Le 12/11/2026, la session pentests-d6 avait ouvert le run et la copie `C:/dev/_Client-A/Produit-86-lot2` à 08:11 UTC (ledger seq 949). Son agent y a commité E-148 (d83ca0f). Une seconde session y a lancé, à 08:27 UTC, un autre constructeur chargé de E-148 à E-151 : il a écrit 10 fichiers non commités au milieu du travail du premier. La collision n'a été vue que par un message de pentests-d6. Aucun marqueur ne dit qu'une copie de travail est occupée, et les 17 fichiers modifiés relevés à 08:20 UTC n'ont pas été lus comme le travail d'une session vivante. Ces copies sont créées hors de l'isolation automatique, en contournement de RP-63 (lot 20261112a). | Poser un marqueur d'occupation à la création d'une copie de travail (session, run, agent, date), le lire avant tout lancement d'agent dans une copie existante, et interroger la liste des sessions vivantes avant de déléguer dans un run qu'une autre session a ouvert. |

## La règle qui aurait évité le retour

- `designateur-de-decision-sans-reservation` (RP-67) : une ressource partagée entre sessions se réserve avant usage, et la réservation se lit avant d'y lancer un agent.

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré au lot 20261109b) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le message entre sessions a permis de partager le travail en un échange, sans perte : E-151 pour un agent, E-149 et E-150 pour l'autre.
