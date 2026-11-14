# Retours forges — factory-digit-ai-fr — 20261114b

- **Contexte** : étape 0 du run de version `forge-digit-ai-fr-20261114a` (refresh du site sous /v2, clips LinkedIn), 14/11/2026. Deux mesures de prérequis ont produit un retour.
- **Références ledger** : forge/ledger.jsonl seq 60, 61.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

La mesure 5 de l'étape 0 compare l'historique git du produit au ledger depuis la clôture du dernier run : 5 évolutions ont été livrées sans run ni trace. La mesure 7 joue l'oracle de page du socle sur une page servie par l'application : il échoue sur des règles écrites pour des pages autonomes.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-2 : des évolutions du produit livrées hors run.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-2 | **majeur** | générique | **5 évolutions livrées après la clôture d'un run, sans run ni trace au ledger.** Preuve : `git log --oneline 6b9c4c8..HEAD` liste 90350be (en-tête figé), b28cf0c (portraits), d61b813 (promesse de l'accueil), c1f2511 (page Accompagnement) et fba0efc (héritage du pilot) ; aucune n'est citée au ledger, seule 3abf516 l'est (entrée 43). Le `CLAUDE.md` du produit impose un run de version pour toute évolution. | Un contrôle d'ouverture qui compare les commits postérieurs au dernier `run_close` aux entrées du ledger et nomme chaque commit non tracé. |

## digit-ai-page-html (`digit-ai-page-html`)

Ce chapitre porte un retour, RH-1 : l'oracle de page appliqué à une page servie.

Le tableau se lit comme le précédent.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RH-1 | **mineur** | générique | **`check_html.py` échoue sur une page servie par l'application pour des règles de livrable autonome.** Preuve : l'accueil rendu par le serveur local donne 6 échecs bloquants : `:root` absent (les jetons sont dans une feuille liée), A4 titre sans indice de version, A2 favicon non embarqué, `@media print` absent, L21 classe « toc » sans style (la feuille liée n'est pas lue), L25 sommaire. | Un mode « page servie » qui lit les feuilles liées et exempte les règles propres au livrable autonome, ou une déclaration explicite de non-applicabilité dans le verdict. |

## La règle qui aurait évité le retour

RP-2 : aucune règle existante ne compare l'historique git d'un produit à son ledger. Classe proposée, à créer au pilot : clé `evolution-livree-hors-run`, famille `tracabilite-ledger`, libellé « Une évolution du produit est livrée après la clôture d'un run sans run ni trace au ledger ». RH-1 : rattaché à la classe existante `oracle-faux-positif`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : les deux constats sont remontés ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
