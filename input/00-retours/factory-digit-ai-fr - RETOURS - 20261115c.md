# Retours forges — factory-digit-ai-fr — 20261115c

- **Contexte** : run `forge-digit-ai-fr-20261114a`, refonte du texte de la page de la forge des tests. Le rédacteur relève un écart entre les services affichés par la page et le catalogue de la Factory.
- **Références ledger** : forge/ledger.jsonl seq 221.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

La page de la forge des tests affichait 9 services, dont 7 prouvés. Le catalogue de la Factory en compte 10, dont 8 prouvés. La liste de la page venait du relevé de l'étape 0, qui avait recopié la section « Catalogue de services » du README de la forge. Or cette section a dérivé du catalogue dont elle se dit générée.

---

## digit-ai-forge-tests (`digit-ai-forge-tests`)

Ce chapitre porte un retour, RP-42 : la section « Catalogue de services » du README n'est plus celle du catalogue du pilot.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-42 | **majeur** | générique | **La section « Catalogue de services » du README se dit « générée depuis » le catalogue du pilot (v1.6.0), mais en a dérivé.** Elle porte 2 services absents du catalogue actuel : « Prouver la 404 personnalisée par langue » et « Une suite jouée par la chaîne, ou déclarée hors portée ». Il lui en manque 3 : « Juger un catalogue de traductions », « Fabrique de données chargée en base » et « Auditer un Worker Cloudflare ou une base Supabase ». Elle compte 9 services, 7 prouvés, contre 10 et 8 au catalogue. Preuve : README, lignes 31 à 52 (commit 1e4b77c) ; `catalogues/catalogue.jsonl` du pilot (commit 220b184, 06/11/2026). | Régénérer la section depuis le catalogue du pilot à chaque version de celui-ci. Faire échouer un contrôle quand la liste ou les statuts divergent. |

## La règle qui aurait évité le retour

RP-42 : une copie générée du catalogue n'est jamais comparée à sa source. Classe : `heritage-produit`.

## Remarques restées au produit

- La page de la forge des tests suit désormais le catalogue de la Factory : 10 services, 8 prouvés, 2 déclarés. Le relevé de l'étape 0 en gardait la copie dérivée. Généralisable : oui, c'est l'objet de RP-42.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
