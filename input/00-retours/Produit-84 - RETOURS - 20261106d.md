# Retours forges — Produit-84 — 20261106d

- **Contexte** : le 06/11/2026, après le schéma des agents de la boucle L99, la session vérifie les livrables de la forge design mobilisée. Le contrôle déclare manquant un compagnon d'oracles présent et frais.
- **Références ledger** : `forge\ledger.jsonl` seq 239.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-06
- **Complétude** : 2 entrées `type: retour` écrites depuis le lot 20261106c (seq 236 et 239), relues le 06/11/2026 à 11:09 dans `forge\ledger.jsonl`. La seq 239 va au sidecar. La seq 236 appartient à la session `1a69e60e`, encore ouverte, qui la remet dans son propre lot.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le livrable** : le compagnon `.oracles.json` du schéma est écrit à 11:07, à côté de la page, sous `output\03-prompts`. Ses 3 oracles rendent PASS.
- **Le contrôle** : `mobiliser.mjs --verifier` rend MANQUE pour la forge design. Il cite comme périmé le compagnon d'une fiche du 30/10/2026, rangé sous `output\02-fiches-securite`.
- **La cause** : le contrôle retient le premier fichier qui répond au motif, dans l'ordre des dossiers, puis ne juge la fraîcheur que de celui-là.

## Factory (pilot) — verrou « livré », contrôle des livrables des forges mobilisées

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-55 | bloquant | générique | **Un livrable frais est masqué par un ancien du même motif, rangé dans un dossier trié avant.** (1) `trouver()` de `oracles\lib-mobilisation.mjs` (l. 343) rend la première correspondance de `output/**/*.oracles.json`. (2) `etatDesLivrables()` (l. 474) ne juge que la fraîcheur de celle-là. (3) Mesuré le 06/11/2026 à 11:09 : verdict MANQUE, fichier « trouvé » écrit le 30/10/2026, alors que le compagnon du schéma, écrit à 11:07, est présent. (4) Le verrou « livré » (S85) refuserait une restitution dont le livrable est fait. Ledger seq 239. | Parcourir toutes les correspondances et retenir la plus récente, ou la première écrite après la demande. Règle qui aurait évité le retour : aucune ; la bibliothèque ne prévoit pas plusieurs correspondances. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Aucune remarque n'est restée au produit : le défaut est tout entier dans la bibliothèque du pilot. Généralisable : oui, d'où RT-55.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause : l'écart est dans un contrôle, voir RT-55.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : l'écart est dans un contrôle du pilot.

## Confirmations positives

- Le message du contrôle nomme le fichier retenu et sa date d'écriture : la cause se lit sans ouvrir le code.

## Ordre recommandé

1. RT-55 : seul retour du lot ; tout produit qui porte un compagnon ancien dans un dossier trié avant reste bloqué au verrou « livré ».

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-55 : aucune ; `trouver()` est écrite pour une seule correspondance. Classe proposée : `livrable-frais-masque-par-un-ancien` (famille `hook-ou-gate`).
