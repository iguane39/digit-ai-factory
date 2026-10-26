# Retours forges — Produit-02 — 20261019c

- **Contexte** : correction du calendrier de la page /agenda (D-159 (a), 19/10/2026), hors run. Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 517 (type `retour`, destinataire `digit-ai-factory`).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-19
- **Complétude** : 1 retour de cette session destiné à la factory depuis le lot 20261019b, seq 517. Il est porté ici, avec sa candidature au sidecar.
  - Les seq 506 et 512 de la même session sont aux lots 20261019a (RT-137, TF-1911) et 20261019b (RT-138), déjà remis.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Factory (`digit-ai-factory`) — réservation des numéros de décision

Un retour, troisième occurrence en 24 heures de la classe portée par RT-137 : la session a appliqué la parade que RT-137 propose en (b) et (c), et la collision a eu lieu quand même.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-139 | majeur | générique | **Relire tous les journaux avant de réserver ne suffit pas : D-159 reprise 7 minutes après sa réservation.** Le 19/10/2026, cette session relève le plus grand numéro dans le journal local, sur `origin/main` et dans les 8 worktrees du dépôt (158), puis réserve D-159 (calendrier de l'agenda) à 20:00:33 UTC au journal du dépôt principal. À 20:07 UTC, une autre session réserve D-159 (cache des feuilles de style) dans son propre journal, puis l'envoie sur `origin/main` (entrées 528 et 529, commit `e4fa56d` « (D-159 a) »). L'humain a répondu « 159a » aux deux. Ma réservation n'était lisible par aucune autre session, puisque le journal du dépôt principal n'est pas envoyé. Ledger seq 517. | (a) Le registre de réservation commun de RT-137 (a) est la seule parade : une réservation n'est faite que si elle est ÉCRITE là où toutes les sessions du produit lisent avant de réserver. (b) À défaut, `reserver-decision.mjs` écrit la réservation dans un fichier unique du dépôt principal (`forge/reservations.jsonl`), sous verrou, que toutes les sessions et tous les worktrees lisent par chemin absolu. |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui pendant ce travail, ce qu'il en a fait, et si cela se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Une autre session a mis en ligne une nouvelle version de l'agenda (40 km, « Voir plus ») pendant la correction du calendrier. | Rebase, conflits résolus en gardant les deux, parcours et oracles rejoués sur la version fusionnée. | non | Lu au distant avant l'envoi ; rien à remonter. |
| La vérification de production déclenchée par le statut de déploiement « en cours » est sautée, puis rejouée au statut « réussi ». | Attente du statut final avant de lire le verdict. | non | Comportement voulu de D-160 ; rien à remonter. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : la restitution suit `forge\RESTITUTION.md`, et le rapport de critique suit celui du 18/10.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : l'envoi du 19/10 n'a été ni refusé ni contraint.

## Confirmations positives

- **Les captures lues à l'image** ont révélé un défaut déjà en ligne (date choisie illisible sous le pointeur) que 13 oracles et render_page ne voyaient pas.

## Ordre recommandé

1. **RT-139** : majeur ; à traiter avec RT-137 (TF-1911), dont il prouve que les propositions (b) et (c) ne suffisent pas seules.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

**Classe existante** : `designateur-de-decision-sans-reservation`, sous-cas « réservation faite dans un journal non partagé », déjà proposé par RT-137.
