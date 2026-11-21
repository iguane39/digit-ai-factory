# Retours forges — factory-digit-ai-fr — 20261115f

- **Contexte** : test avec agents de la proposition P2 (décision D-215 (b)), le 15/11/2026 ; un agent rédacteur a affiché des noms réels en sondant une table de noms.
- **Références ledger** : forge/ledger.jsonl seq 218.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

La consigne du rédacteur interdisait d'afficher le contenu des tables désignées par `FORGE_NOMS_INTERDITS` et `FORGE_PRODUITS_PSEUDO`. Pour en connaître la structure, il a affiché les clés de leurs sous-objets, qui sont des noms réels de clients et de produits. Il l'a déclaré lui-même dans son rapport. Les noms sont restés dans sa transcription locale, hors de tout dépôt.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-45 : sonder une table de noms en affiche des valeurs, faute d'une commande qui ne rend que la structure.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-45 | **majeur** | générique | **Un agent a affiché des noms réels de clients et de produits en sondant la structure des tables de noms, malgré l'interdit de sa consigne.** Preuve : rapport final du rédacteur témoin du test D-215 (« one structure probe printed sub-keys of both tables, and they turned out to be client and product names »). | Une commande du pilot qui rend la structure d'une table de noms sans aucune valeur, citée par toute consigne qui y touche. La consigne seule ne suffit pas. |

## La règle qui aurait évité le retour

RP-45 : l'interdit d'afficher une table de noms ne tient qu'à la consigne. Classe à créer : `agent-affiche-des-noms-reels-en-sondant-une-table`, famille `anonymisation`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
