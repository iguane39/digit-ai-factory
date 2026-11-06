# Retours forges — Produit-84 — 20261106e

- **Contexte** : le 06/11/2026, la session `1a69e60e` améliore par L99 le prompt « sécurité par défaut dans la Factory », puis le fait exécuter au pilot. En préparant le prompt, elle mesure le registre public du pilot ; en restituant, elle se heurte à 2 règles de restitution qui se contredisent.
- **Références ledger** : `forge\ledger.jsonl` seq 236, 237 (rectification de l'heure de 236) et 240.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-06
- **Complétude** : 5 entrées `type: retour` écrites depuis le lot 20261106d (seq 236, 238, 239, 240 et 241), relues le 06/11/2026 à 11:22 dans `forge\ledger.jsonl`. Les seq 236 et 240 vont au sidecar. Les seq 238 et 239 sont déjà remises par les lots 20261106c et 20261106d. La seq 241 vient d'une autre session, qui y consigne le même défaut que la seq 240 : RT-57 couvre les deux.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le registre public** : le prompt réécrit fait écrire une étude au pilot, qui est un dépôt PUBLIC (`gh repo view --json visibility` rend PUBLIC). En vérifiant le contrôle des noms réels, la session trouve que le registre `todo\TODO.jsonl` porte déjà 3 lignes qui citent ce produit sous des noms réels d'environnement et de dossier, au lieu de son pseudonyme.
- **Les règles de restitution** : la restitution de fin de tour doit rappeler les décisions ouvertes (S93). Écrits au format que S93 prescrit, ces rappels sont refusés par S4, bloquante, comme des décisions sans tableau d'options.

## Factory (pilot) — pseudonymisation du registre public des retours

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-56 | majeur | générique | **Le registre public des retours porte des noms réels d'environnement et de dossier d'un produit.** (1) `grep -n -iE '<motifs des noms réels du produit>' todo/TODO.jsonl` rend 3 lignes, relues le 06/11/2026 à 10:48 : TF-2043, TF-2076 et TF-2136. (2) Elles citent un nom d'environnement de qualification, un nom d'environnement de développement et le nom du dossier du produit. (3) La pseudonymisation d'accueil remplace les noms du produit et du client, mais pas ces noms d'environnement ni de dossier. (4) Les 3 lignes sont déjà commitées dans un dépôt public. Ledger seq 236. | Étendre la table des pseudonymes aux noms d'environnement et de dossier que chaque produit déclare. Faire refuser par `oracle-todo` toute ligne ajoutée qui porte un nom de la table. Reprendre les 3 lignes existantes. Règle qui aurait évité le retour : aucune ; la table ne connaît que les noms de produit et de client. |

## Factory (pilot) — règles S93 et S4 de la restitution

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-57 | bloquant | générique | **Le remède prescrit par S93 est refusé par S4.** (1) S93 demande de rappeler chaque décision ouverte au bloc 3 sous la forme « > **D-N — <la question ?>** posée le <jour>, sans réponse ». (2) Appliqué mot pour mot à 8 décisions, ce format fait refuser la restitution par S4 : « posée(s) au format B sans son TABLEAU d'options ». (3) S4 ne reconnaît un rappel que par `manqueAuRappel` (`oracles\oracle-synthese.mjs`, l. 581) : sélecteur, heure HH:MM, mot « inchangée », sujet de 3 mots au moins, et aucun point d'interrogation. (4) Mesuré le 06/11/2026 : 2 préjugements refusés, puis PASS au format de `manqueAuRappel`. Ledger seq 240 ; même défaut consigné par une autre session en seq 241. | Aligner le texte du remède de S93 sur `manqueAuRappel`, et ajouter une fixture qui joue S93 et S4 ensemble. Règle qui aurait évité le retour : aucune fixture ne croise 2 règles d'oracle-synthese. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Aucune remarque n'est restée au produit : les 2 défauts sont dans le registre et les oracles du pilot. Généralisables : oui, d'où RT-56 et RT-57.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause : les écarts sont dans un registre et dans un oracle.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : les écarts sont au pilot.

## Confirmations positives

- Le refus de S4 nomme les décisions concernées : la cause se retrouve dans `manqueAuRappel` sans deviner.
- Le relevé d'ouverture donne le pseudonyme du produit au pilot : le prompt a pu l'imposer sans chercher.

## Ordre recommandé

1. RT-57 : il bloque toute restitution d'un produit qui a des décisions ouvertes depuis moins de 14 jours.
2. RT-56 : les 3 lignes sont déjà publiques ; chaque jour de plus les laisse lisibles.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-56 : aucune ; la table des pseudonymes ne connaît pas les noms d'environnement et de dossier. Classe : `anonymisation-portee-partielle`.
- RT-57 : aucune ; aucune fixture ne joue S93 et S4 ensemble. Classe : `regle-qui-interdit-son-propre-remede`.
