# Retours forges — factory-digit-ai-fr — 20261115q

- **Contexte** : run `forge-digit-ai-fr-20261114a`, rédaction de la page de la forge de sécurité des agents de la version 2 du site, à partir du catalogue de la Factory et du README de la forge.
- **Références ledger** : forge/ledger.jsonl seq 322.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le rédacteur de la page de la forge de sécurité des agents a comparé le catalogue de la Factory au README de la forge. Un contrôle récent du README n'a pas de ligne au catalogue.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-62 : un contrôle du README de la forge de sécurité des agents manque au catalogue.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-62 | **mineur** | générique | **Le README de la forge de sécurité des agents présente le contrôle `oracle-pep-impact`, ajouté le 14/11/2026 (TF-2422), qui n'a aucune ligne au catalogue.** Le catalogue compte 6 services pour cette forge. Preuve : README de `digit-ai-forge-agents-security` ; `catalogue.jsonl` du pilot ; rapport du rédacteur de la page `forge-agents-security`, le 15/11/2026. | Le contrôle de couverture catalogue ↔ README proposé en RP-56 (lot 20261115l). |

## La règle qui aurait évité le retour

- RP-62 : rien ne compare la liste des services du README d'une forge à ses lignes de catalogue. Classe à créer : `catalogue-readme-desynchronises`, la même que RP-56.

## Remarques restées au produit

- La page cite les services du catalogue, et l'écart est écrit dans ses « Manques signalés ». Généralisable : non, la cause générale est RP-56.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
