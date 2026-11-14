---
role: vue fonctionnelle du produit — ce qu'il fait et pour qui (R-20, TF-0087)
destinataire: humain
role_destinataire: commanditaire et équipe produit
sources_de_verite: [forge/EXIGENCES.json]
verifie_le: {AAAA-MM-JJ}
---

# Fonctionnel — {Produit}

> Vue lisible du métier, jamais un doublon : quand `EXIGENCES.json` existe
> (forge-conception), ce fichier en est la projection — l'exigence fait foi.
> Pour un produit importé sans référentiel, il est rédigé depuis le code et
> chaque affirmation est datée comme toute valeur volatile.
>
> **Toute table de ce fichier, celles du modèle comme celles que le produit ajoute (table de
> correspondance, de statuts, de parcours), est précédée de sa phrase de lecture** : ce que vaut
> une ligne, ce que vaut chaque colonne, comment la table est triée, ce qui en est exclu. Le hook
> d'écriture refuse un chapitre de plus de 12 lignes de table sans cette phrase (M10) et un
> chapitre qui s'ouvre sur une table nue (M7) ; le modèle la montre donc avant chaque table.

## À quoi sert le produit

{Une phrase. Qui a le problème, ce que le produit y change.}

## Utilisateurs & rôles

{Phrase de lecture : une ligne est un rôle ; dire ce que vaut chaque colonne, comment les rôles sont triés et ce que la table exclut.}

| Rôle | Qui | Droits | Limites |
|---|---|---|---|
| {admin} | {…} | {…} | {…} |
| {utilisateur} | {…} | {…} | {…} |

## Objets métier & cycle de vie

{Phrase de lecture : une ligne est un objet métier ; dire ce que vaut chaque colonne, comment les objets sont triés et ce que la table exclut.}

| Objet | États | Transitions clés | Où il vit |
|---|---|---|---|
| {annonce} | {brouillon → publiée → archivée} | {publication : rôle admin} | {table/collection} |

## Parcours principaux

1. {Parcours nominal 1 — entrée → étapes → sortie observable.}
2. {Parcours nominal 2.}

## Règles de gestion structurantes

- {Règle 1 — la contrainte métier qui explique une bizarrerie du code.}
- {Règle 2.}

## Exclusions volontaires

- {Exclusion assumée 1 — et pourquoi (renvoi exigence ou décision datée).}
