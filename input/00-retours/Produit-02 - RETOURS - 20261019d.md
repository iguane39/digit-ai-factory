# Retours forges — Produit-02 — 20261019d

> **Note de réception du pilot (21/10/2026, par le précédent de la décision humaine D-43 (a) du 19/10/2026)** : ce lot a été refusé à la porte le 21/10 parce que sa ligne « classe-a-creer » ne portait pas de classe_proposee au sidecar. Au sidecar, la classe proposée de RT-140 est reprise mot pour mot de la section « La règle qui aurait évité le retour ». Famille « controle » de RT-140, absente du référentiel, rattachée par le pilot à « hook-ou-gate » pour passer la porte ; ce rattachement est retiré après ingestion et le choix de famille rendu au produit (D-45 (b) du 19/10/2026). Aucun autre mot du lot n'a changé ; l'original reste chez le produit.

- **Contexte** : clôture de la correction du calendrier de la page /agenda (D-159 (a), 19/10/2026), hors run. Heures en heure de Paris, sauf mention UTC.
- **Références ledger** : `forge\ledger.jsonl` seq 523 (type `retour`, destinataire `digit-ai-factory`).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-10-19
- **Complétude** : 1 retour de cette session destiné à la factory depuis le lot 20261019c, seq 523. Il est porté ici, avec sa candidature au sidecar.
  - Les seq 506, 512 et 517 de la même session sont aux lots 20261019a, 20261019b et 20261019c, déjà remis.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Factory (`digit-ai-factory`) — relecture d'intention

Un retour sur l'outil qui prépare la relecture d'intention de fin de tour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-140 | majeur | générique | **La relecture d'intention a été préparée sur la transcription d'une autre session, puis sans le code livré.** Le 19/10/2026, `node scripts/relecture-intention.mjs --preparer fin-de-tour`, lancé depuis le pilot, lit la transcription la plus récente du pilot (demande « traite les todos et retours », décisions 29a à 33a) : le `verificateur` rend « derive » sur un travail qui n'est pas celui du tour. Relancé depuis le produit avec `--transcript`, il lit la bonne demande, mais le livrable ne porte que les 2 fichiers écrits par l'outil Write (rapport de critique, lot de retours). Il manque les modifications d'`agenda.js`, d'`agenda.css`, d'`agenda-page.mjs` et des 7 catalogues, faites par script dans un worktree, ainsi que les 3 commits envoyés. « dépôt : 2 fichier(s) modifié(s) » mesurait le dépôt principal, pas le worktree. Le diff du commit a dû être ajouté à la main. Ledger seq 523. | (a) Le livrable inclut les commits de la session : ceux envoyés depuis le dernier message humain, ou `origin/main..HEAD` de chaque worktree touché par les commandes du tour. (b) `--preparer` refuse une transcription dont le répertoire de travail n'est pas celui du produit relu, et le dit. (c) Les écritures faites par Bash (heredoc, script Python) sont relevées comme celles de Write, ou le livrable déclare qu'il ne les voit pas. |

## Remarques restées au produit

Ce chapitre dit ce que le produit a constaté chez lui pendant ce travail, ce qu'il en a fait, et si cela se généralise.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le premier verdict de relecture portait sur un autre travail. | Écarté, préparation refaite sur la bonne transcription, diff ajouté, relecture rejouée (RI-20261019-17, sert). | oui | Remonté en RT-140. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : la restitution suit `forge\RESTITUTION.md`.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : aucun envoi refusé ni contraint.

## Confirmations positives

- **Le verdict lu avant d'être cité** : le premier « derive » parlait de décisions 29a à 33a, absentes de cette session. Il a été écarté au lieu d'être posé à l'humain.

## Ordre recommandé

1. **RT-140** : majeur ; la proposition (a) rend la relecture juste pour tout tour qui livre du code.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

La relecture d'intention existe (S79) ; c'est sa préparation qui ne voit ni le worktree ni les écritures faites par Bash. **Classe à créer**, clé proposée `relecture-sans-le-livrable`, famille `controle`, libellé : « Une relecture juge un livrable dont la préparation a omis le code, ou une demande lue dans la transcription d'une autre session. »
