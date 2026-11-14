# Retours forges — factory-digit-ai-fr — 20261114k

- **Contexte** : exécution de l'amendement du 14/11/2026 (2) du run `forge-digit-ai-fr-20261114a`, rédaction de la page témoin de la forge des tests. Un pourcentage du README de la forge des tests, repris par le rédacteur, ne correspond pas au tableau qu'il résume.
- **Références ledger** : forge/ledger.jsonl seq 115.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le rédacteur de la page témoin a repris du README de la forge des tests la phrase « 69 % des anomalies n'existaient pas au tour 1 ». Le tableau juste au-dessus compte 4, 9, 1 et 0 anomalies par tour : 10 anomalies sur 14 sont nées après le premier tour, soit 71 %. Le site allait publier un chiffre que sa propre source dément. L'orchestrateur a remplacé le pourcentage par les comptes, avant tout contrôle de compréhension.

---

## digit-ai-forge-tests (`digit-ai-forge-tests`)

Ce chapitre porte un retour, RT-1 : un pourcentage du README démenti par le tableau voisin.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | **mineur** | locale | **La phrase « 69 % des anomalies n'existaient pas au tour 1 » ne correspond pas au tableau qui la précède (4, 9, 1, 0 : 10 sur 14, soit 71 %).** Preuve : `c:\dev\digit-ai-forge-tests\README.md`, section « Une campagne se termine », vers les lignes 1138 à 1144 ; la page témoin en portait 6 occurrences avant correction. | Écrire « 10 anomalies sur 14 (71 %) », ou corriger le tableau s'il est faux ; ajouter au contrôle du README un recalcul des pourcentages cités contre le tableau voisin. |

## La règle qui aurait évité le retour

RT-1 : aucune règle ne recalcule un pourcentage écrit en prose contre les données qu'il résume. Classe à créer : `chiffre-de-readme-contredit-par-son-tableau`, famille `tracabilite-ledger`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
