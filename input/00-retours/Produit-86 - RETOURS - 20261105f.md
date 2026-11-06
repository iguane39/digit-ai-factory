# Retours forges — Produit-86 — 20261105f

- **Contexte** : clôture du run `20261105b-evolution-e2e-complet-et-hygiene`, après les lettres « 473a, 474a, 475a » du porteur (ledger seq 554 à 556) : machine Azure des workers retirée, E-108 ré-énoncée, 11 tests de bout en bout confiés au run suivant.
- **Références ledger** : `forge\ledger.jsonl` seq 553 et 560 (entrées `type: retour`) ; retour antérieur cité : RP-33 (lot 20261105e).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 05/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 05/11/2026 : `todo/CLASSES.json` du pilot, 241 classes, filtré sur `decision|oubli|ouverte|journal|hook`. Aucune classe ne décrit une décision posée puis perdue d'un run à l'autre : RP-34 propose la sienne. RP-35 reprend la classe proposée par RP-33 (lot 20261105e).

## pilot (restitution, hooks)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-34 | majeur | générique | D-48 (« Supprime-t-on le réseau vide créé en Europe du Nord le 03/11 (adresse publique facturée) ? », ledger seq 305), posée le 03/11 à 21:24, n'a jamais reçu de réponse et n'a plus été rappelée dans aucune restitution suivante. Les ressources qu'elle visait sont restées facturées deux jours, jusqu'au retrait groupé D-473 du 05/11. Ledger seq 553. | À chaque restitution, le hook liste les D-N du ledger sans `reponse_humain` et exige leur rappel en une ligne au bloc 3 ; une décision ouverte depuis plus d'un run est signalée au relevé d'ouverture. |
| RP-35 | mineur | générique | Le hook `gestes-distants` écrit `forge/gestes-approuves.jsonl` dans l'arbre du produit ; le chemin d'abonnement Azure du retour arrière y est lu comme un secret par le balayage E-082 du produit (pytest rouge, valeur de 80 caractères). Deuxième journal de hook dans l'arbre du produit le même jour, après RP-33 (lot 20261105e). Ledger seq 560. | Écrire les journaux des hooks hors de l'arbre du produit, ou les déclarer ensemble aux produits avec une règle d'ignorance commune. |

## La règle qui aurait évité le retour

- `decision-ouverte-perdue-entre-deux-runs` (RP-34) : une décision posée reste rappelée à chaque restitution tant qu'elle n'a pas de réponse.
- `journal-de-hook-dans-l-arbre-du-produit` (RP-35, déjà proposée par RP-33) : un journal de la factory ne s'écrit pas dans l'arbre de travail d'un produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `forge/gestes-approuves.jsonl` porte un identifiant d'abonnement | laissé hors de git, déclaré en exclusion motivée du balayage | oui, porté par RP-35 | remonté |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261105e) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- La décision groupée a tenu : 2 gestes approuvés en une fois, posés au hook, joués mot pour mot, aucun refus.

## Ordre recommandé

RP-34 d'abord, puis RP-35 avec RP-33.
