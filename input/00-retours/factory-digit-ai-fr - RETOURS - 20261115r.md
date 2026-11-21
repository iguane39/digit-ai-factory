# Retours forges — factory-digit-ai-fr — 20261115r

- **Contexte** : run `forge-digit-ai-fr-20261114a`, rédaction de la page de la forge `organization` de la version 2 du site, à partir du catalogue de la Factory et du README de la forge.
- **Références ledger** : forge/ledger.jsonl seq 323.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le rédacteur de la page de la forge `organization` a comparé le catalogue de la Factory au README de la forge. Les deux sources ne couvrent pas les mêmes services. La page suit le catalogue, et l'écart est écrit dans ses « Manques signalés ».

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-63 : le catalogue et le README de la forge `organization` ne couvrent pas les mêmes services.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-63 | **mineur** | générique | **Le README de la forge d'organisation liste 5 services, dont « Parité oracle filtres-tableau », alors que le catalogue en version 1.8.0 en compte 4 ; le README parle des décisions D-01 à D-12 et D-15, le catalogue de 12 décisions ; le gabarit de page et le registre des types, présentés par l'historique de la forge, n'ont pas de ligne au catalogue.** Preuve : `catalogue.jsonl` du pilot ; README de `digit-ai-forge-organization` ; rapport du rédacteur de la page `forge-organization`, le 15/11/2026. | Le contrôle de couverture catalogue ↔ README proposé en RP-56 (lot 20261115l). |

## La règle qui aurait évité le retour

- RP-63 : rien ne compare la liste des services du README d'une forge à ses lignes de catalogue. Classe à créer : `catalogue-readme-desynchronises`, la même que RP-56.

## Remarques restées au produit

- La page cite les services du catalogue, et l'écart est écrit dans ses « Manques signalés ». Généralisable : non, la cause générale est RP-56.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
