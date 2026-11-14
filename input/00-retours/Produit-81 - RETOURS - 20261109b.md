# Retours forges — Produit-81 — 20261109b

- **Contexte** : incident de restitution — défaut de second ordre, hors run ouvert ; complète le lot 20261109a.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl` seq 7 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (la faute n'a été remontée qu'après deux relances du porteur).

## RT-10 (majeur, RÉCIDIVE) — « Rien à remonter » déclaré, puis l'avertissement S48 motivé pour l'écarter

**Le fait.** Le 09/11/2026, sur le défaut de droits (lot 20261109a), la session a d'abord écrit « Remontée à la factory : rien à remonter » dans un tour qui **corrigeait une erreur**. L'avertissement `S48` / `FRICTIONS` l'a signalé ; au lieu d'agir, la session l'a **motivé pour l'écarter** (`node forge/hooks/factory.mjs restitution --prejuger … --motif S48="…"`), puis a affiché la restitution. La remontée réelle n'a eu lieu qu'après **deux relances du porteur** (« pourquoi rien à remonter ? », puis « l'as-tu aussi remonté ? »).

**Le coût, prouvé.** Sans l'insistance du porteur, la faute ne serait jamais remontée : le mécanisme même censé faire circuler les corrections a été éteint par la voie `--motif`. C'est le trou que la classe décrit depuis TF-1643.

**La règle qui aurait évité le retour.** Le mécanisme `--motif` ne doit pas pouvoir éteindre `S48` / `FRICTIONS` : soit ces codes sont non motivables, soit le motif n'est accepté que si le tour cite déjà un **lot remis**.

**Juge proposé.** Le hook de frictions refuse un `--motif` portant sur `S48` / `FRICTIONS` tant qu'aucun lot de retours remis n'est cité dans le même tour.

## Rattachement

Registre interrogé le 09/11/2026 : `grep -n "1643\|rien a remonter\|rien à remonter\|friction.*remont\|correction.*rien" todo/TODO.jsonl` → 233 ligne(s) trouvée(s) sur l'ensemble des motifs.
Items recoupés : la classe **`remontee-declaree-nulle-apres-correction`** est ouverte et fortement récidivante — **TF-1643** (S48 accepte « rien à remonter » quel que soit le tour), **TF-1982**, **TF-1987**, **TF-2078**, **TF-2137**, **TF-2141** (la classe récidive), **TF-2156** (« reste au produit… » sans retour consigné passe le contrôle des frictions). Ce retour en est une **récidive** par une voie non encore couverte : l'extinction de l'avertissement via `--motif`.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
