---
role: vue fonctionnelle du produit — ce qu'il fait et pour qui (R-20, TF-0087)
destinataire: humain
sources_de_verite: [forge/EXIGENCES.json]
verifie_le: {AAAA-MM-JJ}
---

# Fonctionnel — {Produit}

> Vue lisible du métier, jamais un doublon : quand `EXIGENCES.json` existe
> (forge-conception), ce fichier en est la projection — l'exigence fait foi.
> Pour un produit importé sans référentiel, il est rédigé depuis le code et
> chaque affirmation est datée comme toute valeur volatile.

## À quoi sert le produit

{Une phrase. Qui a le problème, ce que le produit y change.}

## Utilisateurs & rôles

| Rôle | Qui | Ce qu'il peut faire | Ce qu'il ne peut pas |
|---|---|---|---|
| {admin} | {…} | {…} | {…} |
| {utilisateur} | {…} | {…} | {…} |

## Objets métier & cycle de vie

| Objet | États | Transitions clés | Où il vit |
|---|---|---|---|
| {annonce} | {brouillon → publiée → archivée} | {publication : rôle admin} | {table/collection} |

## Parcours principaux

1. {Parcours nominal 1 — entrée → étapes → sortie observable.}
2. {Parcours nominal 2.}

## Règles de gestion structurantes

- {Règle 1 — la contrainte métier qui explique une bizarrerie du code.}
- {Règle 2.}

## Ce que le produit ne fait volontairement pas

- {Exclusion assumée 1 — et pourquoi (renvoi exigence ou décision datée).}
