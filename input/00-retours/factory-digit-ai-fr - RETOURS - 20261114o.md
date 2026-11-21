# Retours forges — factory-digit-ai-fr — 20261114o

- **Contexte** : décision D-74 (a) du run `forge-digit-ai-fr-20261114a` : une troisième réécriture de la page de la forge des tests, puis un dernier tour du contrôle de compréhension.
- **Références ledger** : forge/ledger.jsonl seq 139 (et les tours, seq 136 et 138).
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Après la troisième réécriture, la page a été jugée deux fois :

- sur une version dont la présentation comptait 71 mots, le tour a rendu 8 réponses sur 8 tenues ;
- sur la version finale, ramenée à 65 mots pour tenir le critère 1 de l'amendement (de 45 à 65 mots), le tour a échoué sur Q2 chez les 2 lecteurs.

Les deux versions ne diffèrent que par 2 phrases de la présentation. Le lecteur technique a perdu un élément qu'il tenait aux tours 2, 3 et 4, alors que la phrase qui le porte est restée dans la section « Ce que vous obtenez ».

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-15 : le verdict du contrôle de compréhension varie d'un tirage à l'autre.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-15 | **majeur** | générique | **Un seul lecteur par profil ne distingue pas un défaut du texte d'une variation du lecteur.** Preuve : `forge/etapes/contenus/controle/forge-tests-texte-tour4-71mots.json` (8 sur 8) et `forge-tests-texte-tour4.json` (Q2 manquée chez les 2 lecteurs), sur deux textes presque identiques. Avec une borne de 2 réécritures, le contrôle pousse à réécrire un texte correct. | Juger chaque élément sur 3 lecteurs par profil, à la majorité (2 sur 3). Ou rejouer une fois un élément manqué avant de compter une réécriture. Dans les deux cas, chiffrer le surcoût dans l'autorisation de lancements. |

## La règle qui aurait évité le retour

RP-15 : aucune règle ne fixe le nombre de lecteurs par profil ni le seuil d'accord d'un contrôle de compréhension. Classe à créer : `controle-comprehension-un-tirage`, famille `regle-morte`. Le verdict d'un tirage unique n'est pas prononçable. L'entrée 139 du ledger proposait la famille `oracle-faux-verdict`, absente du registre du pilot : le lot la corrige.

## Remarques restées au produit

- La page de la forge des tests part en l'état, avec ses écarts nommés, comme le prévoit D-74 (a). Généralisable : non, c'est l'application d'une décision du créateur à cette page.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
