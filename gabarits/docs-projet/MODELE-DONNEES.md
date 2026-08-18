---
role: modèle de données — tables, colonnes, liens, ancré au schéma réel (R-20/R-26, TF-0091)
destinataire: humain
sources_de_verite: ["{migrations/}", "{app/models.py}"]
verifie_le: {AAAA-MM-JJ}
---

# Modèle de données — {Produit}

> Chaque table DÉCLARE sa provenance : le fichier de schéma réel d'où elle se lit
> (migration, ORM, DDL) — une table introuvable dans sa provenance = FAIL R-26.
> Jamais rédigé de mémoire (loi 4 : une donnée volatile est une donnée). Index et
> contraintes avancées : hors v1, dette tracée. Produit sans persistance : remplacer
> le corps par « sans objet — aucune persistance » et le motiver en une phrase.
> Projection : `node <pilot>\scripts\generer-modele-donnees.mjs docs\projet\MODELE-DONNEES.md`
> régénère `MODELE-DONNEES.html` — la vue n'est JAMAIS éditée à la main.

## Table : {annonces}

- role: {ce que représente une ligne, une phrase}
- provenance: {migrations/001_init.sql}

| Colonne | Type | Nullable | Clé |
|---|---|---|---|
| {id} | {uuid} | {non} | {PK} |
| {titre} | {text} | {non} | {—} |
| {auteur_id} | {uuid} | {non} | {FK} |

Liens sortants :

| Colonne | Cible | Cardinalité |
|---|---|---|
| {auteur_id} | {utilisateurs.id} | {n-1} |

## Table : {utilisateurs}

- role: {ce que représente une ligne, une phrase}
- provenance: {migrations/001_init.sql}

| Colonne | Type | Nullable | Clé |
|---|---|---|---|
| {id} | {uuid} | {non} | {PK} |
| {email} | {text} | {non} | {unique} |
