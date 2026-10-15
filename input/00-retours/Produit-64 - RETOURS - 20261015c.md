# Lot de retours — Produit-64 → pilot (propagation des hooks du gabarit aux produits) — 2026-10-15, indice c

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `oracles/hook-ouverture.mjs` (avec `oracles/lib-ouverture-async.mjs`) et `gabarits/HERITAGE.json` (entrée `.claude/settings.json`).

**Origine** : session de conversation du 15/10/2026, vers 09:55 (heure de Paris), vérification demandée par l'humain : le mécanisme de mise à jour de la factory et des forges fonctionne-t-il chez les produits ?

Ce lot porte **2 retours** (RT-60 et RT-61).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-15** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (`oracles/hook-ouverture.mjs`, `gabarits/HERITAGE.json`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-60 | majeur | générique | **Un hook ajouté au gabarit après l'installation d'un produit n'atteint jamais ce produit, alors que l'ouverture sait déjà réparer une entrée.** Mesuré le 15/10 sur les 21 produits du poste qui portent `forge/hooks/factory.mjs` : `publication-hebergee` (gabarit du 12/10) est présent chez 2 sur 21, `droits-accordes` (13/10) chez 2 sur 21, `ecriture` chez 8 sur 21. Le mécanisme de tirage, lui, marche : les 4 produits ouverts depuis le 13/10 (Produit-82, Produit-83, Produit-12, Produit-64) ont leur ouverture passée en asynchrone et leur relais à jour, et les 15 autres n'ont pas été rouverts depuis (date de leur dernière session). TF-1592 attend « le geste de chaque produit » : ce geste est automatisable, et `passerOuvertureEnAsync` (TF-1635) le fait déjà pour la seule entrée d'ouverture. | À l'ouverture, une fusion chirurgicale de TOUTES les entrées de `gabarits/settings-produit.json` absentes du produit, reconnues par leur commande `forge/hooks/factory.mjs <nom>` : ajout seulement, rien de retiré, permissions et hooks propres au produit intacts. Une entrée retirée volontairement se déclare (liste d'exclusions du produit), sans quoi elle est reposée. |
| RT-61 | mineur | générique | **Le relevé d'héritage n'exige que 2 des 7 hooks du gabarit.** `gabarits/HERITAGE.json`, entrée `.claude/settings.json`, mode `presence_et_motif` : les motifs exigés sont `publication-hebergee` et `ouverture … --contexte-json`. `restitution`, `page-html`, `ecriture`, `droits-accordes` et `lexique` peuvent manquer sans aucun constat : Produit-12, ouvert le 14/10, n'a ni PostToolUse ni UserPromptSubmit, et rien ne le signale. | Un motif par commande du gabarit, ou un motif dérivé du gabarit lui-même (chaque `factory.mjs <nom>` qu'il déclare), pour que l'ajout d'un hook au gabarit ajoute de lui-même son contrôle. |

**Portée** : générique pour les 2 retours.

## La règle qui aurait évité le retour

- **RT-60** : classe `boucle-retour-sans-descente` — une correction close au pilot (TF-1528, TF-1592) ne redescend pas jusqu'au produit sous une forme qu'il rencontre sans geste.
- **RT-61** : classe à créer `motif-heritage-partiel-du-gabarit` (famille `heritage-produit`) — le contrôle d'un fichier hérité n'exige qu'une partie de ce que son gabarit déclare.

## Rattachement

Registre interrogé le 15/10/2026 (`todo/TODO.jsonl`, recherche « settings-produit », « TF-1592 », « TF-1528 ») : TF-1592 est en attente produit, avec les lots d'héritage du 13/10 confiés aux 19 produits ; TF-1635 corrige la seule entrée d'ouverture ; aucun item ne propose d'automatiser la fusion des autres entrées, ni d'étendre les motifs exigés.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le mécanisme du projet commun (RAF-159) applique déjà la fusion chirurgicale proposée en RT-60, pour sa propre entrée | `tools/projet-commun/lib-projet-commun.mjs`, banc 18/18 | oui | cité en RT-60 comme exemple réutilisable |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.
