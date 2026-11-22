# Retours forges — factory-digit-ai-fr — 20261116h

- **Contexte** : run `forge-digit-ai-fr-20261116a` (traduction du site en six langues), étape de conception tenue par l'agent rédacteur, le 16/11/2026.
- **Références ledger** : forge/ledger.jsonl seq 471, 472, 473, 474, 475, 476.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 16/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

L'étape de conception a produit la cascade d'intention, 90 exigences, l'inventaire du texte à traduire, un glossaire de 61 termes en six langues et la liste des arbitrages. Quatre outils de la chaîne de traduction et de la conception ont montré un écart entre ce qu'ils exigent et ce que leur documentation dit.

---

## digit-ai-forge-conception (`forge-conception`)

Ce chapitre porte un retour, RT-92 : le skill de rédaction des exigences ne décrit pas deux règles que son oracle applique.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-92 | **majeur** | générique | **`oracle-exigences` E10 juge quatre exigences socle candidates (dont `identite-unique`, TF-2611), alors que `references/schema-referentiel.md` du skill en liste trois ; `oracle-tracabilite` T7 (TF-2660) exige avec la cascade la clé `parcours`, un `utilisateur_final` et une intention citée d'une réponse humaine, et le SKILL.md ne cite que T6.** Preuve : ledger du produit, entrées 462 et 471. | Mettre à jour SKILL.md et `schema-referentiel.md` : quatre candidates, règle T7 et ses trois conditions. |

## digit-ai-factory (`pilot`)

Ce chapitre porte trois retours, RP-93 à RP-95, sur les outils de la chaîne de traduction.

Le tableau se lit comme le précédent.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-93 | **majeur** | générique | **`verifier-sonde-glossaire.mjs` ne rejoue que la première commande d'une cellule de preuve, alors que G5 exige deux sources de nature différente : les secondes commandes du glossaire du produit sont scellées mais jamais rejouées par l'outil.** Preuve : ledger du produit, entrée 472. | Rejouer chaque commande scellée de la cellule, et le dire dans le gabarit `GLOSSAIRE.md`. |
| RP-94 | **mineur** | générique | **`oracle-glossaire.mjs` lit toute ligne de tableau sous un titre de niveau 2 : un tableau de présentation à 3 colonnes fait rendre G0 FAIL ; la contrainte n'est écrite ni dans le gabarit ni dans l'oracle.** Preuve : ledger du produit, entrée 473. | Borner la lecture aux sections qui portent `categorie`, ou écrire la contrainte dans le gabarit. |
| RP-95 | **mineur** | générique | **La chaîne cite IATE comme preuve de marché, sans sonde rejouable : le 16/11/2026, `curl` rend 000 sur iate.europa.eu depuis le poste, et l'encyclopédie répond 429 à trois sondes simultanées sans User-Agent descriptif.** Preuve : ledger du produit, entrée 474. | Fournir à l'étape A3 des sondes rejouables et espacées, avec leur User-Agent, et dire quoi faire quand IATE est injoignable. |

## La règle qui aurait évité le retour

- RT-92 : classe à créer `skill-en-retard-sur-son-oracle` : un oracle applique une règle que le skill qui le mobilise ne décrit pas.
- RP-93 : classe à créer `sonde-partiellement-rejouee` : un outil de rejeu ne rejoue qu'une partie des preuves qu'une règle exige.
- RP-94 et RP-95 : même classe que RP-93 pour RP-95 ; RP-94 relève d'une contrainte d'oracle non écrite, classe à créer `contrainte-oracle-non-documentee`.

## Remarques restées au produit

- Du texte français est servi hors des sources prévues : image de partage, quatre libellés du script de page, trois sections désignées par leur titre (ledger, entrée 475). Généralisable : non, propre aux surfaces de ce site ; traité par l'exigence EX-117 du run.
- Défauts de contenu servis en production : ancien domaine `forge.digit-ai.fr` dans trois gabarits, hébergeur « À compléter » sur la page des mentions légales, 18 descriptions de page hors bornes (ledger, entrée 476). Généralisable : non, propre aux contenus de ce site ; à corriger dans ce run.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
