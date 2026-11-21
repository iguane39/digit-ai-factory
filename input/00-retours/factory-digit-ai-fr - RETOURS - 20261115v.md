# Retours forges — factory-digit-ai-fr — 20261115v

- **Contexte** : run `forge-digit-ai-fr-20261114a`, rédaction de la page de la forge d'exploitation de la version 2 du site, à partir du catalogue de la Factory et du README de la forge.
- **Références ledger** : forge/ledger.jsonl seq 351.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le rédacteur de la page de la forge d'exploitation a lu les preuves des services au catalogue. Plusieurs services classés « prouvé » n'ont été éprouvés qu'en essai. La page l'écrit, et son cartouche compte quand même ces services parmi les prouvés.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-71 : un service porte le statut prouvé au catalogue alors que son champ preuve ou le README de sa forge dit l'exécution réelle non faite.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-71 | **mineur** | générique | **Le catalogue classe « prouvé » des services de la forge d'exploitation, le feu vert GitHub et les plans Supabase, que leur preuve ne montre éprouvés qu'en essai, sans exécution réelle.** Preuve : `catalogue.jsonl` du pilot, lignes de la forge `ops` ; README de `digit-ai-forge-ops` ; rapport du rédacteur de la page `forge-ops`, le 15/11/2026. | Même contrôle que RP-55 (lot 20261115k) : un service dont la preuve ne porte que sur un essai porte un statut qui le dit, ou « déclaré ». |

## La règle qui aurait évité le retour

- RP-71 : classe à créer `statut-catalogue-sans-preuve` — un service porte le statut prouvé au catalogue alors que son champ preuve ou le README de sa forge dit l'exécution réelle non faite.

## Remarques restées au produit

- La page affiche le statut du catalogue, et l'écart est écrit dans ses « Manques signalés ». Généralisable : non, la cause générale est RP-71.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
