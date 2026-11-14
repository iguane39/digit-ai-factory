# Retours forges — factory-digit-ai-fr — 20261114l

- **Contexte** : exécution de l'amendement du 14/11/2026 (2) du run `forge-digit-ai-fr-20261114a`, contrôle de compréhension de la page témoin. Le créateur a corrigé une demande de clé d'API que l'abonnement rendait inutile.
- **Références ledger** : forge/ledger.jsonl seq 119.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

L'amendement imposait `claude -p --bare` pour lancer des lecteurs isolés de tout contexte, seul mode que l'aide de Claude Code documente comme coupant `CLAUDE.md` et mémoire. Ce mode refuse l'abonnement (« Not logged in »). La session a donc demandé une clé d'API au créateur, qui a répondu : « Tu as déjà tout ce qu'il faut dans l'abonnement. » Quatre lancements d'essai ont montré qu'une autre combinaison d'options isole tout autant sur l'abonnement.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-12 : aucune recette ne dit comment lancer un lecteur isolé sur l'abonnement.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-12 | **majeur** | générique | **Une session a demandé une clé d'API payante pour isoler des lecteurs, alors que l'abonnement suffisait.** Preuve : 4 lancements d'essai du 14/11/2026, de 14:47 à 14:54 : `claude -p --setting-sources "" --system-prompt "…" --tools "" --disable-slash-commands --strict-mcp-config` répond « NON » à une question piège sur un mot du `CLAUDE.md` de l'utilisateur, que le même lancement sans isolement cite ; `--bare` répond « Not logged in ». | Une recette du pilot « lecteur isolé sur abonnement » : cette ligne de commande, la question piège et son témoin positif, à citer par tout prompt qui lance des lecteurs à froid ; ne demander une clé d'API qu'après avoir écarté ce mode. |

## La règle qui aurait évité le retour

RP-12 : aucune règle ne demande d'essayer l'abonnement avant d'exiger une clé d'API payante. Classe à créer : `lecteur-isole-sans-recette-sur-abonnement`, famille `contrat-interface-forge`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
