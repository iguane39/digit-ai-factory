---
role: modèle de données — tables, colonnes, liens, ancré au schéma réel (R-20/R-26, TF-0091)
destinataire: humain
role_destinataire: développeur et analyste de données du produit
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
>
> **Chapeau de chapitre (L7 du socle, TF-2692).** Chaque `##` ouvre par UNE citation `> …` qui dit ce que CE chapitre apprend au
> lecteur (40 caractères au moins, une phrase, jamais la même d'un chapitre à l'autre ni une paraphrase du titre). Elle s'ÉCRIT, la vue
> ne la génère pas : la vue lui donne la classe `ch-apprend`, et sans elle la page échoue L7 dès quatre chapitres.
> Une table de huit lignes ou plus porte, sous son tableau, un paragraphe « Exemple de lecture : … » (30 caractères au moins, L10) qui
> lit UNE ligne à voix haute ; la vue lui donne la classe `exemple-lecture`. Un terme technique du référentiel `jargon-a-gloser` employé
> dans un chapitre y porte sa glose (L30, `<dfn>`) : cela s'écrit dans le chapitre, aucun gabarit ne le fait à la place de l'auteur.

## Table : {annonces}

> {Ce que ce chapitre apprend : ce que représente une ligne de la table annonces et ce qui la relie aux autres.}

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

> {Ce que ce chapitre apprend : ce que représente une ligne de la table utilisateurs et ce qui la relie aux autres.}

- role: {ce que représente une ligne, une phrase}
- provenance: {migrations/001_init.sql}

| Colonne | Type | Nullable | Clé |
|---|---|---|---|
| {id} | {uuid} | {non} | {PK} |
| {email} | {text} | {non} | {unique} |
