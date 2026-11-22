# Retours forges — factory-digit-ai-fr — 20261116j

- **Contexte** : run `forge-digit-ai-fr-20261116a` (traduction du site en six langues), étape design tenue par l'agent constructeur, le 16/11/2026.
- **Références ledger** : forge/ledger.jsonl seq 501, 502, 503.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 16/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

La maquette du sélecteur de langue et de deux pages allemandes a été produite en un seul fichier à deux écrans, comme la consigne le demandait. Deux oracles ont refusé des formes que le site servi emploie déjà, et la commande de tests prescrite par le produit échoue sur ce poste.

---

## digit-ai-forge-design (`forge-design`)

Ce chapitre porte un retour, RT-97.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-97 | **mineur** | générique | **`oracle-bascule` ne reconnaît pas une bascule de thème câblée par délégation, une boucle `forEach` sur les boutons, alors que le comportement est identique à celui du site servi.** Preuve : maquette `forge/etapes/design-traduction/maquette-traduction.html` du 16/11/2026 ; ledger du produit, entrée 502. | Reconnaître le câblage par boucle ou par délégation, ou juger le comportement au rendu. |

## digit-ai-factory (`pilot`)

Ce chapitre porte deux retours, RP-98 et RP-99.

Le tableau se lit comme le précédent.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-98 | **mineur** | générique | **`check_html.py` du socle `digit-ai-page-html` compte les h1 d'un écran masqué : une maquette à deux écrans dans un seul fichier rend deux refus de h1.** Preuve : même maquette ; ledger du produit, entrée 501. | Ne compter que les écrans visibles, ou admettre une exemption déclarée pour une maquette à plusieurs écrans. |
| RP-99 | **mineur** | générique | **Sur le poste Dell-XPS-16, `uv run pytest` échoue (erreur 4551), alors que `uv run python -m pytest` rend 338 réussis ; les `CLAUDE.md` des produits prescrivent `uv run pytest`. L'entrée 503 du ledger nomme le poste par erreur « DESKTOP » : le poste mesuré est Dell-XPS-16 (`hostname`).** Preuve : rapport de l'agent constructeur du 16/11/2026 ; ledger du produit, entrée 503. | Prescrire `uv run python -m pytest` dans les gabarits, ou diagnostiquer l'erreur 4551 au bootstrap du poste. |

## La règle qui aurait évité le retour

- RT-97 et RP-98 : classe à créer `oracle-juge-la-forme-pas-le-rendu` : un oracle refuse une forme de code ou de document dont le rendu est conforme.
- RP-99 : classe à créer `commande-prescrite-non-portable` : une commande prescrite par un gabarit échoue sur un poste où une variante passe.

## Remarques restées au produit

- Trois constats de production relevés par l'agent, hors du périmètre de la maquette : des champs du formulaire de contact pointent vers des messages d'erreur absents ; le cachet de l'accueil emploie une exemption de chevauchement en bloc ; ce cachet dépasse d'1 px à 480 px et moins. Généralisable : non, propres aux gabarits de ce site ; à traiter à l'étape de développement du run.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
