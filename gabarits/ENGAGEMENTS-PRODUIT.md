---
date: AAAA-MM-JJ
source: aucun engagement à la naissance du fichier ; chaque ligne nomme le document qui prend l'engagement
verifie_le: AAAA-MM-JJ
---

# Engagements des documents remis

Chaque pièce, temps ou outil qu'un document remis au client promet s'inscrit ici, dans le tour où le document s'écrit, avec
ce qui le tient : un livrable présent, ou une action nommée. Un programme qui annonce un questionnaire en ligne, un déroulé
qui réserve un temps au bilan, une skill que le formateur installe : chacun est un engagement. Règle : R-67 de
`REGLES-PROJET.md` du pilot, décision D-193 (a) du 10/11/2026.

`oracles/oracle-engagements.mjs` du pilot juge ce fichier. Le hook d'écriture le joue à chaque livrable écrit sous
`output/`, l'ouverture redit ce qui n'est pas tenu, et la revue de préparation d'une séance le joue sur ses documents.

## Engagements

| Engagement | Nature | Pris dans | Tenu par |
|---|---|---|---|
| *(aucun)* | — | — | — |

## Forme d'une ligne

- **Engagement** : ce qui est promis, dans les mots du document.
- **Nature** : `pièce` pour un document, un formulaire ou une attestation ; `temps` pour un créneau réservé au déroulé ;
  `outil` pour une skill, un accès ou une installation.
- **Pris dans** : le document qui promet, son chemin entre accents graves. Une nouvelle version du même document reste
  couverte : le contrôle compare les noms sans leur date ni leur indice.
- **Tenu par**, sous l'une des trois formes suivantes.
  - `livrable :` suivi du chemin du livrable entre accents graves, relatif à la racine du produit ; le livrable doit
    exister. Pour un temps, ajouter `, repère « … »` : ce texte doit se lire dans le livrable. Le contrôle lit le
    Markdown, le HTML, le texte, Word, PowerPoint et Excel ; il ne lit pas un PDF.
  - `action :` suivi de ce qui reste à faire, puis `, porteur <qui>, échéance AAAA-MM-JJ`. L'action est ouverte tant que
    son échéance n'est pas passée ; faite, la ligne pointe le livrable qu'elle a produit.
  - `sans objet —` suivi d'un motif d'au moins 3 mots : l'engagement est retiré du document, ou le document n'en prend
    aucun, et la colonne Engagement dit alors « aucun ».

Un document qui promet sans figurer ici est dit par le contrôle : déclarer ses engagements, ou une ligne « aucun » avec
son motif.
