# Retours forges — factory-digit-ai-fr — 20261115n

- **Contexte** : run `forge-digit-ai-fr-20261114a`, contrôle de compréhension des pages de la version 2 du site par des lecteurs isolés.
- **Références ledger** : forge/ledger.jsonl seq 309.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le contrôle de compréhension de la version 2 lance des lecteurs isolés par `claude -p` sur l'abonnement, selon la décision D-73 (a). Au tour 2 de la page de la forge de conception, le lecteur technique a répondu à la question témoin qu'il avait reçu un bloc de contexte automatique, portant l'adresse électronique du compte. Le contrôle s'est arrêté comme prévu, et le mode de lancement est soumis au créateur.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-59 : l'isolement des lecteurs laisse passer le contexte automatique du compte.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-59 | **majeur** | générique | **Le mode d'isolement des lecteurs du contrôle de compréhension laisse passer un bloc de contexte automatique du harnais**, qui porte l'adresse électronique du compte et la mention d'outils de l'environnement. Le mode est celui de D-73 (a) : `claude -p --setting-sources "" --tools "" --disable-slash-commands --strict-mcp-config --system-prompt`, depuis un dossier vide. 1 lecteur sur plus de 40 lancements l'a déclaré le 15/11/2026. La question témoin ne repose que sur la déclaration du lecteur : les autres l'ont peut-être reçu sans le dire. Preuve : `forge/etapes/contenus/controle/forge-conception-texte-tour2.json` du produit, lecteur technique. | Documenter ce bloc dans la procédure des lecteurs isolés. Offrir un mode sans contexte qui ne dépende pas d'une clé d'API, que `--bare` exige. Remplacer la question témoin déclarative par un contrôle objectif : un marqueur injecté dans le contexte, puis cherché dans la réponse. |

## La règle qui aurait évité le retour

- RP-59 : la question témoin ne détecte une fuite que si le lecteur la déclare. Classe à créer : `isolement-lecteur-declaratif`.

## Remarques restées au produit

- Le contrôle est suspendu au produit jusqu'à la décision du créateur sur le mode de lancement (D-227). Généralisable : oui, c'est l'objet de RP-59.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
