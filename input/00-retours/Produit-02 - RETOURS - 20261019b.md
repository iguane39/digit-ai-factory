# Retours forges — Produit-02 — 20261019b

> **Note de réception du pilot (21/10/2026, par le précédent de la décision humaine D-43 (a) du 19/10/2026)** : ce lot a été refusé à la porte le 21/10 parce que sa ligne « classe-a-creer » ne portait pas de classe_proposee au sidecar. Au sidecar, la classe proposée de RT-138 est reprise mot pour mot de la section « La règle qui aurait évité le retour ». Famille « rendu » de RT-138, absente du référentiel, rattachée par le pilot à « page-html-socle » pour passer la porte ; ce rattachement est retiré après ingestion et le choix de famille rendu au produit (D-45 (b) du 19/10/2026). Aucun autre mot du lot n'a changé ; l'original reste chez le produit.

- **Contexte** : retour de l'exploitant du 19/10/2026 sur le calendrier de la page /agenda, mise en ligne le 18/10 sous D-148 (a). Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 512 (type `retour`, destinataire `digit-ai-factory`).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-19
- **Complétude** : 1 retour de cette session destiné à la factory depuis le lot 20261019a, seq 512. Il est porté ici, avec sa candidature au sidecar.
  - La seq 506 de la même session est au lot 20261019a, déjà remis (RT-137, TF-1911).

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Factory (`digit-ai-factory`) — fidélité d'une interface à sa demande

Un retour, qui suit un retour humain direct sur une interface jugée verte par la critique d'implémentation et par la relecture d'intention.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-138 | majeur | générique | **Une demande lue par son exemple, et une référence explicite jamais comparée.** Demande du 18/10/2026, mot pour mot : « Un sélecteur de calendrier, comme pour la réservation, réglé par défaut sur les 3 prochaines semaines, qui peut être modifié pour sélectionner une semaine en particulier ». Le calendrier de réservation choisit une arrivée puis un départ. La refonte a pris l'exemple pour la seule fonction : un clic sur un jour sélectionne sa semaine entière, sans date de début ni de fin libres. La promesse de la critique d'implémentation résume la demande par « semaine au choix », sans la citer, puis la juge tenue ; la relecture d'intention n'a rien relevé. Un bouton « Voir les N évènements » non demandé est passé aussi, alors que la liste se met à jour à chaque choix. Retour humain du 19/10/2026 : « ça n'a jamais été demandé ». Ledger seq 512. | (a) La promesse d'une critique d'implémentation cite la demande mot pour mot ; un résumé n'en tient pas lieu. (b) Une référence explicite de la demande (« comme pour X ») devient un critère : le même geste joué sur X et sur le livrable, comparé. (c) La relecture d'intention reçoit la liste des contrôles d'interface ajoutés, chacun rattaché à une phrase de la demande, ou déclaré ajout. |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui pendant ce travail, ce qu'il en a fait, et si cela se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le calendrier de l'agenda impose une semaine entière par clic. | Correction proposée à l'exploitant (D-159) : date de début puis date de fin, comme la réservation ; bouton retiré. | non | En attente de décision. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : la restitution suit `forge\RESTITUTION.md`.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : aucun envoi sur ce lot.

## Confirmations positives

- **La demande retrouvée mot pour mot** dans la transcription de la session du 18/10 a permis de dire précisément où la lecture a dévié, au lieu de discuter d'un souvenir.

## Ordre recommandé

1. **RT-138** : majeur ; la proposition (a) est une règle de rapport, la (b) ferme la classe pour toute référence explicite.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

La relecture d'intention existe (S79) et a passé : son jugement porte sur le livrable écrit, pas sur le comportement comparé à la référence citée. **Classe à créer**, clé proposée `reference-explicite-non-comparee`, famille `rendu`, libellé : « Une demande qui désigne un modèle (« comme pour X ») est servie sans que le geste soit joué sur X et sur le livrable, et l'exemple de la demande devient la seule fonction. »
