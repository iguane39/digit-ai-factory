# Retours forges — factory-digit-ai-fr — 20261115k

- **Contexte** : run `forge-digit-ai-fr-20261114a`, rédaction des pages de forge de la version 2 du site, à partir du catalogue de la Factory et des README des forges.
- **Références ledger** : forge/ledger.jsonl seq 275, 278.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Les rédacteurs des pages de la forge de sécurité web et de la forge de conception ont comparé les statuts du catalogue de la Factory aux README de ces forges. Dans les deux cas, le catalogue donne « prouvé » à des services que leur propre preuve, ou le README, ne prouve pas encore. Les cartouches des pages affichent les chiffres du catalogue : ils affichent donc des services prouvés qui ne le sont pas.

---

## digit-ai-forge-websec (`websec`)

Ce chapitre porte un retour, RP-54 : le statut du service DAST au catalogue contredit sa preuve et le README.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-54 | **majeur** | générique | **Le catalogue donne « prouvé » au service DAST de la forge de sécurité web, alors que sa propre preuve dit que l'exécution réelle de ZAP n'est pas prouvée.** Le README de la forge dit « partiellement prouvé » et relève 2 exécutions réelles : une passe passive le 14/08/2026, un balayage actif le 12/11/2026. Les chiffres des 2 services déclarés divergent aussi : 9 chapitres ASVS et 28 cas WSTG dont 20 manuels au catalogue, contre 7 chapitres et 39 cas dont 21 manuels au README. Preuve : `catalogue.jsonl` du pilot, ligne 82 ; README de la forge ; rapport du rédacteur de la page `forge-websec` du 15/11/2026. | Remettre au catalogue la preuve et le statut que le README établit, puis aligner les chiffres ASVS et WSTG. |

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-55 : 2 services du catalogue sont dits prouvés sans exécution réelle.

Le tableau se lit comme le précédent.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-55 | **majeur** | générique | **Le catalogue classe « prouvé » les services cat-con-08 (rétro-modèle) et cat-con-09 (vues par profil) de la forge de conception, alors que leur champ preuve dit « pas encore de run réel ».** La ligne cat-con-05 annonce aussi « 8 oracles, 30 règles », contre « 19 oracles, 60 règles » au self-test de la forge joué le 15/11/2026. Le cartouche de la page affiche 9 prouvés sur 9 ; il afficherait 7 sur 9 si ces 2 services passaient en « déclaré ». Preuve : `catalogue.jsonl` du pilot ; sortie de `node oracles/self-test.mjs` de la forge, le 15/11/2026 ; rapport du rédacteur de la page `forge-conception`. | À la génération des vues du catalogue, refuser « prouvé » quand le champ preuve dit « pas encore de run réel », et recompter oracles et règles depuis le self-test de la forge. |

## La règle qui aurait évité le retour

- RP-54 et RP-55 : rien ne compare le statut d'un service à sa preuve, ni au README de sa forge, quand le catalogue est écrit. Classe à créer : `statut-catalogue-sans-preuve`.

## Remarques restées au produit

- Les pages affichent le statut du catalogue, et chaque écart est écrit dans les « Manques signalés » de la page. Généralisable : non, la cause générale est RP-54 et RP-55.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
