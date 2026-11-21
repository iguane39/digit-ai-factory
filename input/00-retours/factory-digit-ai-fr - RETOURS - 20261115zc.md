# Retours forges — factory-digit-ai-fr — 20261115zc

> Renommé à l'accueil du pilot le 21/11/2026 : l'indice 20261115zb était déjà porté par un autre lot de ce produit (le retour sur les colonnes, accueilli le 20/11). Contenu inchangé.

- **Contexte** : run `forge-digit-ai-fr-20261114a`, lot L5 du mandat D-219 (e) (l'analyse de la cause d'échec des agents), construit au pilot par un agent `constructeur` le 15/11/2026 de 14:47 à 16:07 ; frictions d'outillage relevées par l'agent dans son fichier d'avancement, recopiées par la session ; puis le conflit de nommage rencontré en compilant ce lot. L'indice à deux lettres suit la décision humaine du 15/11/2026 (RP-80) ; il remplace le lot 20261116a, retiré.
- **Références ledger** : forge/ledger.jsonl seq 401, 402, 403, 406.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

L'agent du lot L5 a livré ses 5 commits, recettes vertes. En chemin, il a buté 3 fois sur l'outillage : un caractère invisible entré dans le code par l'outil d'édition, un argument JSON abîmé par le shell, et un heredoc qu'il a écrit alors que son contrat l'interdit. Il a corrigé ou déclaré chacun, mais aucun contrôle ne l'a arrêté avant. En compilant ce lot, la session a trouvé les 26 lettres du jour prises, et deux contrôles qui se contredisent sur la suite.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte quatre retours, RP-77 à RP-80 : trois frictions d'outillage d'un agent de la flotte, chacune passée sans contrôle, et un conflit de nommage au-delà de la lettre z.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-77 | **mineur** | générique | **Une classe d'accents écrite en séquences d'échappement `̀-ͯ` par l'outil d'édition est entrée dans `scripts/noter-fiche.mjs:57` du pilot comme caractères combinants littéraux, invisibles à l'écran.** L'agent l'a vue en relisant, après le commit `06372347`, et l'a corrigée en `f710be8e`. Preuve : `forge/ledger.jsonl` du produit, entrée 401 ; commits `06372347` et `f710be8e` du pilot. | Faire jouer `oracle-caracteres-controle`, ou un contrôle des caractères combinants hors des chaînes de texte, dans les vérifications ciblées que `AGENT-CAMPAGNE.md` prescrit avant chaque commit de code, et pas seulement à la recette entière. |
| RP-78 | **mineur** | générique | **Git Bash a réduit les antislashs doublés d'un argument JSON passé à node : l'émission d'avancement de l'agent a été refusée, puis rejouée avec des barres obliques.** Même famille que les leçons L-001 et L-003, cette fois chez un agent de la flotte. Preuve : `forge/ledger.jsonl` du produit, entrée 402 ; dernière ligne du fichier d'avancement de l'agent. | Que le script d'émission d'avancement accepte son JSON par un fichier ou par l'entrée standard, et que `AGENT-CAMPAGNE.md` le prescrive à la place d'un argument de ligne de commande. |
| RP-79 | **mineur** | générique | **L'agent a écrit un script de mesure jetable par heredoc, contenu accentué compris, alors que le contrat d'agent de campagne l'interdit ; aucun hook ne l'a arrêté.** Il l'a déclaré en écart et a vérifié la sortie. Preuve : `forge/ledger.jsonl` du produit, entrée 403 ; section « Écarts à la lettre » de son rapport. | Soit un hook `PreToolUse` qui signale un heredoc à contenu non ASCII chez un agent de la flotte, soit une exception écrite au contrat pour les scripts jetables hors dépôt dont la sortie est vérifiée. |
| RP-80 | **mineur** | générique | **Au-delà de la lettre z, deux contrôles se contredisent : `allouer-indice.mjs` refuse d'allouer et `oracle-nommage.mjs` refuse un indice de deux lettres, tandis que `oracle-lot.mjs` refuse un lot daté d'un autre jour que celui de son écriture.** Le lot `20261115za` d'une autre session n'est passé que parce qu'il a été écrit hors de l'outil d'écriture, donc sans le contrôle de nommage. Décision humaine du 15/11/2026 : « Après de a à z, passer à za, zb, zc... ». Preuve : `forge/ledger.jsonl` du produit, entrée 406 ; refus d'`allouer-indice.mjs` (« les 26 lettres a-z sont prises ») et d'`oracle-lot.mjs` (date du lot) rejoués dans le tour. | Étendre `allouer-indice.mjs`, `oracle-nommage.mjs` de quality-oracles et la règle R-4 à la suite za, zb… zz après z, dans l'ordre de tri, et faire juger cette suite par leurs bancs. |

## La règle qui aurait évité le retour

- RP-77 : classe à créer `caractere-invisible-entre-par-l-edition` — une séquence d'échappement écrite par l'outil d'édition entre dans le code comme caractère littéral invisible.
- RP-78 : classe à créer `json-en-argument-abime-par-le-shell` — un JSON passé en argument de ligne de commande perd ses antislashs dans Git Bash.
- RP-79 : classe à créer `heredoc-interdit-sans-garde` — un geste que le contrat d'agent interdit n'est arrêté par aucun hook.
- RP-80 : classe à créer `indice-au-dela-de-z-contradictoire` — au-delà de la lettre z, l'allocation et les contrôles de nommage ne s'accordent pas sur la suite.

## Remarques restées au produit

Aucune remarque n'est restée au produit : les quatre retours portent sur l'outillage du pilot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
