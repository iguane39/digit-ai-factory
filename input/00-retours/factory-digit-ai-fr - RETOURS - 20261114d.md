# Retours forges — factory-digit-ai-fr — 20261114d

- **Contexte** : étape de conception du run `forge-digit-ai-fr-20261114a`, 14/11/2026. Le hook d'écriture du poste a refusé une version de `docs/projet/FONCTIONNEL.md`.
- **Références ledger** : forge/ledger.jsonl seq 71.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

En mettant à jour le document fonctionnel du produit, la session a ajouté la table de correspondance des 15 clips sans phrase de lecture. Le hook a refusé l'écriture (règle M10), la phrase a été ajoutée, l'oracle a rendu PASS.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-4 : le gabarit du document fonctionnel ne montre pas la phrase de lecture d'une table.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-4 | **mineur** | générique | **Le gabarit de `docs/projet/FONCTIONNEL.md` ne prévoit aucune table, donc aucune phrase de lecture ; une table ajoutée à l'étape de conception sort sans elle.** Preuve : refus du hook d'écriture du 14/11/2026 (M10, table de 17 lignes), corrigé puis PASS. | Le gabarit montre, pour toute table, la phrase de lecture attendue (ce que vaut une ligne, l'ordre, ce qui est exclu). |

## La règle qui aurait évité le retour

RP-4 : la règle M10 de `check_markdown.py` existe et a joué son rôle au hook ; ce qui manque est son rappel dans le gabarit. Classe proposée, à créer au pilot : clé `gabarit-doc-projet-sans-mode-de-lecture`, famille `gabarit-document`, libellé « Un gabarit de document projet ne montre pas la phrase de lecture d'une table ».

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
