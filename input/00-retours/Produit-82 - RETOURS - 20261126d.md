# Retours forges — Produit-82 — 20261126d

- **Contexte** : reconstruction des écrans du portail au balisage de la maquette Tenon, puis critique d'implémentation sur 12 pages servies.
- **Références ledger** : `forge\ledger.jsonl` seq 387
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-26

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-page-html, render_page, règle L2

Le retour porte sur la mesure de la gouttière d'étiquettes.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-61 | mineur | générique | Le 26/11/2026, la page Consommation de la composition Tenon sous /Digit-AI pose une grille à 2 pistes (0,87fr et 1,35fr). À gauche, la section « Par équipe », qui n'a qu'une équipe sur la pile locale (30 caractères). À droite, la grille des fournisseurs. render_page rend L2 « colonne d'étiquettes 318px sur 840px (38 %) », bloquant. Les deux pistes sont des sections de contenu, cas que le commentaire de la règle exclut, et `data-colonne-ok` sur le conteneur n'en dispense pas. Contourné en disposant les deux sections en flexbox, au rendu identique. Preuve : `forge\ledger.jsonl` seq 387. | Ne compter comme colonne d'étiquettes qu'une piste dont l'enfant n'est ni une section titrée (h2, h3) ni un bloc à plusieurs enfants, ou faire valoir `data-colonne-ok` pour cette mesure. |

## Remarques restées au produit

- La revue des six maquettes renvoyait au portage les défauts de Tenon : espacements hors de l'échelle de 4 px, contrôles d'une même rangée à des hauteurs différentes, anneau de focus hors jetons. Corrigés sur place par `normaliser_tenon.py` et des dispenses déclarées (généralisable : non, propre à cette maquette).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- render_page et la critique d'implémentation ont relevé sur la maquette portée tous les défauts que la revue des six directions avait annoncés, et chacun portait sa voie de sortie.

## Ordre recommandé

1. RT-61 : le faux positif pousse à changer la technique de mise en page pour satisfaire la mesure, au lieu de déclarer le cas.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle est qu'une mesure de gabarit distingue une colonne d'étiquettes d'une section de contenu par sa structure, pas seulement par la longueur de son texte. Classe proposée : `section-de-contenu-lue-comme-etiquette`.
