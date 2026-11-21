# Retours forges — factory-digit-ai-fr — 20261115p

- **Contexte** : run `forge-digit-ai-fr-20261114a`, rédaction de la page de la forge d'audit de la version 2 du site, à partir du catalogue de la Factory et du README de la forge.
- **Références ledger** : forge/ledger.jsonl seq 320.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le rédacteur de la page de la forge d'audit a comparé le catalogue de la Factory au README de la forge. Les comptes de contrôles et de décisions d'architecture diffèrent, et la reprise d'un existant n'a aucun service au catalogue du côté de la forge d'audit.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-61 : le catalogue et le README de la forge d'audit ne donnent pas les mêmes comptes.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-61 | **mineur** | générique | **Le catalogue et le README de la forge d'audit se contredisent.** Le README compte 185 contrôles, le catalogue 175 ; le README compte 84 décisions d'architecture, le catalogue 75. La reprise d'un existant, que montre le clip 12 de la campagne LinkedIn, n'a aucun service au catalogue côté forge d'audit : elle repose sur le rétro-modèle de la forge de conception (cat-con-08), qui n'a « pas encore de run réel ». Preuve : `catalogue.jsonl` du pilot ; README de `digit-ai-forge-audit` ; rapport du rédacteur de la page `forge-audit`, le 15/11/2026. | Le contrôle de couverture catalogue ↔ README proposé en RP-56 (lot 20261115l) ; rattacher au catalogue la reprise d'un existant à la forge qui la porte. |

## La règle qui aurait évité le retour

- RP-61 : rien ne compare la liste des services du README d'une forge à ses lignes de catalogue. Classe à créer : `catalogue-readme-desynchronises`, la même que RP-56.

## Remarques restées au produit

- La page cite les services du catalogue, et l'écart est écrit dans ses « Manques signalés ». Généralisable : non, la cause générale est RP-56.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
