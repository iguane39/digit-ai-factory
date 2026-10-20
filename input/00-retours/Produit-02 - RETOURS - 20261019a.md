# Retours forges — Produit-02 — 20261019a

- **Contexte** : correction des dates de l'agenda (D-155 (a), 18/10/2026) et sa mise en ligne (D-156 (a), 19/10/2026), hors run. Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 506 (type `retour`, destinataire `digit-ai-factory`).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-19
- **Complétude** : 1 retour de cette session destiné à la factory, seq 506. Il est porté ici, avec sa candidature au sidecar.
  - Les autres retours vers les forges sans lot remis ne sont pas instruits par cette session ; ils restent à compiler par leurs sessions.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Factory (`digit-ai-factory`) — réservation des numéros de décision

Un retour, récidive de la classe `designateur-de-decision-sans-reservation` (seq 476 du 18/10, lot 20261018b) : cette fois la réservation a été FAITE, et elle n'a pas protégé.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-137 | majeur | générique | **Deux numéros de décision réservés en règle et pourtant repris par une autre session du même produit, D-155 et D-156.** Le 18/10/2026 à 17:10 UTC, une session réserve D-155 au journal du dépôt principal, après avoir relu le plus grand numéro au journal local et sur `origin/main` (154, champ `decision` seul). Or une autre session avait déjà posé et tranché son propre D-155 : sa réponse, entrée 484 d'`origin/main`, ne porte le numéro que dans `porte_sur`, et sa question vivait dans le journal de son worktree, non envoyé. À 17:18 UTC, la première session réserve D-156 ; à 17:44 UTC, une autre session réserve aussi D-156, dans le journal de son worktree. Le 19/10, l'humain répond « 156a » dans les deux sessions, et chaque réponse ne se rattache à sa question que par la session où elle est tapée. Ledger seq 506. | (a) Un registre de réservation UNIQUE par produit, hors des worktrees (chemin absolu du dépôt principal, ou `origin/main` relu avant d'écrire), lu par `reserver-decision.mjs` et par le contrôle RÉSERVATION. (b) La recherche du prochain numéro lit aussi `porte_sur` et `resume`, pas seulement `decision`. (c) Le contrôle RÉSERVATION refuse un numéro déjà pris dans un worktree voisin du même dépôt (`git worktree list`). |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui pendant ce travail, ce qu'il en a fait, et si cela se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La source d'évènements rend chaque date un jour trop tôt depuis le 16/10 (changement de serveur reconnu sur son forum). | Écart mesuré à chaque relevé sur des témoins de jour, retiré de toutes les dates ; nouveau contrôle `check-agenda-dates`. | non | Défaut d'une source tierce, corrigé au produit. |
| La vérification de production a échoué une fois : Chrome n'a pas démarré sur le runner, alors que l'empreinte servie était la bonne. | Tâche échouée relancée, verte au second essai. | non | Incident du runner, isolé ; rien à remonter. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : les restitutions suivent `forge\RESTITUTION.md`, et la réponse au .fr suit `forge\demandes\GABARIT-DEMANDE.md` (oracle-demande PASS).

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : l'envoi du 19/10 n'a été ni refusé ni contraint.

## Confirmations positives

- **Le hook de remisage** a refusé un `git stash` sans étiquette dans un worktree ; l'arbre a été vérifié propre (écarts de fins de ligne seuls) avant d'être réinitialisé.
- **La liste des commits à envoyer, relue avant l'envoi**, a révélé que le relevé automatique du lundi était passé entre-temps : la branche a été refaite sur `origin/main` au lieu d'écraser ce relevé.

## Ordre recommandé

1. **RT-137** : majeur ; la proposition (b) se fait en une ligne de recherche, la (a) ferme la classe.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

La règle existe : réserver une D-N avant de l'afficher (TF-1849, TF-1872). Elle a été tenue, et c'est son **périmètre** qui est en défaut : une réservation faite dans un journal que les autres sessions ne lisent pas. **Classe existante** : `designateur-de-decision-sans-reservation`, à amender par un sous-cas « réservation faite dans un journal non partagé ».
