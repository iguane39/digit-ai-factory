# Retours forges — factory-digit-ai-fr — 20261114e

- **Contexte** : étape de design du run `forge-digit-ai-fr-20261114a`, 14/11/2026. La rubrique du studio de direction, écrite sur le modèle de la référence du skill, a été refusée par le hook d'écriture.
- **Références ledger** : forge/ledger.jsonl seq 77.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

La rubrique figée du studio reprenait la forme de `references/rubrique.md` du skill `studio-de-direction` : un chapitre « Les six critères » ouvert directement par son tableau. Le hook d'écriture l'a refusée (M7), une phrase d'ouverture a été ajoutée, puis l'écriture est passée.

---

## digit-ai-forge-design (`digit-ai-forge-design`)

Ce chapitre porte un retour, RD-2 : une référence de skill dont la forme fait refuser ses copies.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RD-2 | **mineur** | générique | **La référence `rubrique.md` du skill `studio-de-direction` ouvre un chapitre par un tableau nu ; une rubrique recopiée sur elle est refusée par la règle M7.** Preuve : refus du hook d'écriture du 14/11/2026 sur `forge/etapes/design-v2/RUBRIQUE.md` ; la référence porte « ## Les six critères » suivi directement du tableau. | Ouvrir le chapitre de la référence par une phrase de lecture, pour que la copie naisse conforme. |

## La règle qui aurait évité le retour

RD-2 : la règle M7 de `check_markdown.py` existe ; c'est la référence du skill qui ne la respecte pas. Classe proposée, à créer au pilot : clé `reference-de-skill-hors-regle-de-lisibilite`, famille `gabarit-document`, libellé « Une référence de skill a une forme que les règles de lisibilité refusent à ses copies ».

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
