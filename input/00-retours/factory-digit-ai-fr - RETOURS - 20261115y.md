# Retours forges — factory-digit-ai-fr — 20261115y

- **Contexte** : run `forge-digit-ai-fr-20261114a`, release de staging de la v2 du site journalisée par `ops.mjs deployer`, sur Windows, Node 25.2.1.
- **Références ledger** : forge/ledger.jsonl seq 388.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le contrat de santé de la release répond sain quand on le lance seul. Sous `ops.mjs`, il plante sur une assertion de Node, et la release est refusée comme malade. Il a fallu lire l'erreur, remplacer `process.exit` par `process.exitCode` dans le contrat, puis redéployer.

---

## digit-ai-forge-ops (`forge-ops`)

Ce chapitre porte un retour, RP-74 : un outil de déploiement confond le plantage de son contrat de santé avec une santé en échec.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-74 | **mineur** | générique | **`ops.mjs deployer` lit comme une santé en échec le plantage d'un `sante.mjs` qui appelle `process.exit()` juste après `fetch` : « Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76 », exit 3221226505, alors que le même contrat, lancé seul, rend exit 0.** Preuve : `forge/etapes/mep/cible/journal.jsonl` du produit, seq 10 (`deploiement_refuse`) puis seq 11 (`deploiement`, même image, contrat corrigé) ; `forge/etapes/mep/build/sante.mjs` ; `node --version` : v25.2.1. | Dans la règle du contrat de santé du README (« une release sans `sante.mjs` est refusée »), prescrire `process.exitCode` plutôt que `process.exit` après une requête ; et faire distinguer à `ops.mjs` un plantage du contrat (code d'exception Windows, assertion libuv) d'une santé en échec, avec un message qui le dit. |

## La règle qui aurait évité le retour

- RP-74 : classe à créer `contrat-de-sante-plantage-lu-comme-echec` — un outil de déploiement confond le plantage de son contrat de santé avec une santé en échec.

## Remarques restées au produit

- Le contrat de santé du produit est corrigé (`process.exitCode`), et la release suivante est déployée. Généralisable : non, la cause générale est RP-74.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
