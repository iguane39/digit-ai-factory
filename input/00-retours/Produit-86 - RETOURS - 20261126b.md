# Retours forges — Produit-86 — 20261126b

- **Contexte** : run `20261126a-decisions-d493-d497` : un tir proposé au porteur sans vérifier la fenêtre du mandat, relevé le 26/11/2026.
- **Références ledger** : `forge\ledger.jsonl` seq 1058 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Aucun retour de ce lot ne vise une forge : le registre `todo/CLASSES.json` du pilot n'est pas sollicité.

## La règle qui aurait évité le retour

Aucune règle de forge : le contrôle existait dans le produit, et la session ne l'a pas joué avant d'écrire l'action.

## Remarques restées au produit

| Réf. ledger | Gravité | Remarque | Motif du maintien au produit |
|---|---|---|---|
| seq 1058 | majeur | Deux restitutions (25/11 à 16:31, 26/11 à 14:32) proposaient le tir du lot 3 comme faisable sans que la session ait vérifié la fenêtre du mandat. Le contrôle du produit `sondes.contexte_du_ticket`, joué le 26/11 vers 14:50, rend le mandat v10 clos depuis le 20/11 à 18:00 et le job du ticket arrêté depuis le 13/11. Aucun tir n'est parti. | Le contrôle existe dans le produit, la session ne l'avait pas joué : avant de proposer un tir, jouer `contexte_du_ticket`. Généralisable : non. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261109b, 20261112e, 20261112f et 20261125a) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : l'écart a été vu par une session voisine, pas par un refus.

## Confirmations positives

- La session Produit-84 a demandé la fenêtre avant de tirer, au lieu de tirer sur une autorisation périmée : la coordination a évité un refus de l'oracle.
