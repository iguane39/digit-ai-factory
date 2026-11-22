# Retours forges — factory-digit-ai-fr — 20261116i

- **Contexte** : run `forge-digit-ai-fr-20261116a` (traduction du site en six langues), clôture des contrôles de conception, le 16/11/2026.
- **Références ledger** : forge/ledger.jsonl seq 491.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 16/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le contrôle des exigences restait rouge sur une exigence socle, « une identité par personne », sans objet pour un site qui n'a aucun compte. Sa règle exige une décision humaine référencée pour l'écarter : la question a été posée au créateur, qui a répondu, mot pour mot : « 244a (on se demande même pourquoi tu me poses la question) ».

---

## digit-ai-forge-conception (`forge-conception`)

Ce chapitre porte un retour, RT-96 : une exigence socle sans objet mesurable coûte une décision humaine.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-96 | **mineur** | générique | **`oracle-exigences` E10 exige une décision humaine référencée pour écarter `identite-unique`, même quand le produit n'a aucun compte : site sans authentification, seul envoi le formulaire de contact (`docs/projet/ACCES-TEST.md`). La décision D-244 a été posée, et le créateur a répondu « on se demande même pourquoi tu me poses la question ».** Preuve : ledger du produit, entrées 486 et 491. | Accepter dans E10 un écart « sans objet » décidé par la session quand une mesure prouve l'absence de l'objet (aucune route d'authentification, aucun modèle de compte), avec la commande citée ; réserver la décision humaine aux écarts où l'objet existe. |

## La règle qui aurait évité le retour

- RT-96 : classe à créer `decision-deductible-posee` : une décision est posée à l'humain alors que sa réponse se déduit d'une mesure.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
