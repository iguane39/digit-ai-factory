# Banc des défauts échappés — mesurer un mécanisme de relecture avant de l'adopter

Ce banc dit, chiffres à l'appui, si un mécanisme de relecture (persona, fiche d'expert, grille de
questions, juge) retrouve plus de défauts réels qu'une relecture sans ce mécanisme. Il est né de
l'étude du 14/09/2026 sur les personas par phase et de la décision humaine qui l'a gardé : TF-1073,
décidée le 14/09/2026 (D-3 (a)).

**La règle d'usage** : tout mécanisme de relecture proposé au parc passe ce banc au seuil figé avant
d'être adopté. Le seuil ne se renégocie pas après la mesure : une condition candidate est retenue si
elle retrouve au moins 2 livrables de plus que la référence, sans dépasser le double de ses constats
faux (`manifeste.json`, clé `seuil`).

## Ce qu'il contient

**Mode de lecture** : une ligne par pièce du banc ; la dernière colonne dit où elle vit. Les pièces
confidentielles ne sont jamais recopiées dans le pilot.

| Pièce | Rôle | Où |
|---|---|---|
| Protocole | consigne commune de relecture, séquence, règle de jugement, seuil | `output\03-etudes\20260914-personas-mesure-protocole.md` |
| Échantillon | neuf défauts échappés réels, leur phase, leur source | `output\03-etudes\20260914-personas-mesure-echantillon.md` |
| Livrables reconstitués | le livrable de chaque défaut dans son état d'avant correction | canal confidentiel, `bancs\defauts-echappes\livrables\` |
| Relecture de référence | la ligne de base sans mécanisme, figée le 14/09/2026 à 10:04 | `output\03-etudes\20260914-personas-mesure-baseline.md` |
| Relectures des personas du 14/09 | trois conditions déjà mesurées, non retenues | `output\03-etudes\20260914-personas-mesure-passes.md` |
| Manifeste | défauts à rechercher, permutations, seuil | `manifeste.json` |
| Jugement du 14/09 | clé et étiquettes du juge, pour rejouer le décompte | `jugement-20260914\` |
| Scripts | construire l'entrée du juge, décompter son jugement | `construire.mjs`, `decompter.mjs` |
| Recette | vert : le jugement du 14/09 redonne 2/9, 1/9, 3/9, 3/9 ; rouge : trois retrouvés de plus font basculer le verdict | `banc.test.mjs` |

## Rejouer le banc pour un mécanisme neuf

1. **Relire.** Dans une session neuve, donner au relecteur les neuf livrables du canal (E-01 à E-08
   et E-15, pas E-10) et la consigne commune du protocole, section 2, augmentée du seul mécanisme à
   mesurer. Aucun autre fichier ne lui est ouvert. Enregistrer sa sortie brute dans un bloc
   ```` ```text ```` d'un fichier daté, sous `output\03-etudes\`.
2. **Construire l'entrée du juge.**
   `node oracles\banc-defauts-echappes\construire.mjs --reference output\03-etudes\20260914-personas-mesure-baseline.md --candidats <fichier du mécanisme> --codes N --sortie <dossier hors dépôt>`
3. **Juger à l'aveugle.** Une session neuve reçoit `entree.md` et les livrables du canal, jamais
   `cle.json`, et étiquette chaque constat R (retrouvé), A (autre défaut réel, « proche » s'il frôle
   le défaut) ou F (faux ou générique), une ligne par constat : `E-01 L1 1 A — raison`.
4. **Décompter.**
   `node oracles\banc-defauts-echappes\decompter.mjs --jugement <sortie du juge> --cle <dossier>\cle.json`
   La sortie dit, pour chaque condition, son rappel sur 9 et si elle est retenue.

Recette du banc lui-même : `node --test oracles\banc-defauts-echappes\banc.test.mjs`.

## Limites déclarées

Neuf livrables seulement, aucun de la phase de tests ; un seul juge, du même modèle que les
relecteurs ; la référence a été jouée une fois. Revue le 2026-12-14 : enrichir l'échantillon des
défauts échappés remontés d'ici là, dont au moins un de la phase de tests, et rejouer la référence.
