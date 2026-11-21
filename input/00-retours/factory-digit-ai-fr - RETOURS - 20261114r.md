# Retours forges — factory-digit-ai-fr — 20261114r

- **Contexte** : remplace le lot 20261114q, que la porte refusera faute de clé de classe nommée pour son premier retour. exécution de D-75 (a) et D-76 (b) le 14/11/2026 : correction et exécution au pilot du prompt sur les défauts créés, boucle L99 sur le prompt d'amélioration continue des agents.
- **Références ledger** : forge/ledger.jsonl seq 143, 144.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Deux frictions. La première : un relecteur aveugle a de nouveau écrit un fichier temporaire, alors que sa consigne interdisait toute écriture, même temporaire. C'est la récidive du constat RP-13 du lot 20261114m. La seconde : deux sessions du même produit ont pris le même indice de livrable dans `output\` le même jour. Un autre processus a ensuite renommé la revue de cette session de g en k, sans trace, ce qui a cassé le lien « Livré » de la restitution suivante.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte deux retours : RP-19 (récidive de la lecture seule non tenue) et RP-20 (indice de livrable alloué deux fois).

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-19 | **mineur** | générique | **Récidive de RP-13 : 3 relecteurs sur 6 en 3 passes ont écrit hors de leur lecture seule, même avec l'interdit explicite des fichiers temporaires.** Preuve : rapport final du relecteur 1, passe 2 de la seconde boucle (écriture puis suppression d'un fichier sous `%TEMP%`). | Même remède que RP-13 : un type de relecteur sans Write ni Edit. La consigne seule ne suffit pas. |
| RP-20 | **majeur** | générique | **Deux sessions ont alloué l'indice g du même jour dans `output\` ; la revue de cette session a été renommée en k sans trace, et son lien « Livré » pointait vers un chemin disparu.** Preuve : `20261114k.md` daté de 15:38:31, journal de boucle de 15:36:03 ; revue de l'autre session « retours sur la direction B … 20261114g.md ». `allouer-indice.mjs` ne réserve rien, et sa portée « dossier » ignore `--prefixe`. | `allouer-indice.mjs` réserve la lettre (création atomique du fichier, ou fichier de réservation). Tout renommage d'un livrable laisse une entrée au ledger et un renvoi depuis l'ancien nom. |

## La règle qui aurait évité le retour

RP-19 : la lecture seule d'un relecteur ne tient qu'à sa consigne. Classe à créer : `agent-lecture-seule-ecrit-hors-perimetre`, famille `regle-morte` (déjà proposée au lot 20261114m). RP-20 : aucune règle n'empêche deux sessions de prendre le même indice. Classe à créer : `indice-de-livrable-alloue-deux-fois`, famille `versionnement-livrable`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : les deux constats sont remontés ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
