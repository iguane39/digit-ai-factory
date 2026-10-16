# Lot de retours — Produit-64 → pilot (canal des retours produit → factory) — 2026-10-15, indice e

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire le canal des lots de retours (gabarit, oracle de lot, hook d'ouverture du produit et du pilot).

**Origine** : session de conversation du 15/10/2026, vers 11:10 (heure de Paris). Le porteur a demandé de doter le projet commun Client-A d'un canal de retours depuis ses produits « comme la factory », et de relever ce qui manque au canal de la factory. Le canal du projet commun est posé (RAF-161 du produit, branche `feature/retours-projet-commun-20261015`, banc 51/51) ; ce lot remonte ce que sa conception a mesuré chez la factory.

Ce lot porte **3 retours** (RT-63 à RT-65).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## pilot (canal des lots de retours)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-63 | majeur | générique | **Quatre lots réels écrits chez trois produits sont restés `a_remettre` de 17 à 50 jours, et aucun contrôle ne l'a vu.** Relevé du 15/10/2026 sur les produits de `C:\dev\_Client-A\` (ligne `**Statut** : a_remettre`, gabarits exclus) : un produit COMPTA, lots `20260825a`, `20260825b` (50 jours) et `20260925a` (17 jours) ; un produit vidéo, lot `20260908a` (36 jours). Aucun n'est au pilot : `git grep` sur `origin/main` du pilot (0 commit de retard) de phrases propres à chacun (« gate1b-et-conformite », « audit indépendant du 24/09 », « Bibliothèque vidéo ») ne rend rien dans `input/` ni `todo/`, et `input/00-retours/old/` n'a pas ces lots. Côté code, aucun module du pilot ne lit `a_remettre` (`grep -rl a_remettre` sur `oracles scripts todo forge` : 0 fichier) : B8 et B9 d'`oracle-boite-entree` ne voient que la boîte du pilot, jamais ce qui n'y est pas arrivé. | Relever le statut chez le producteur : le hook d'ouverture du PRODUIT nomme ses lots `a_remettre` (au-delà de 24 h : oubli), et le relevé des produits que fait déjà le hook d'ouverture du pilot (« Héritage des produits, relevé en lecture seule ») les compte. Mieux, la remise devient un script (`remettre-lot` : oracle de forme, copie au sas, empreintes comparées, statut passé à « remis le ») que le hook d'ouverture du produit joue seul. C'est ce que fait le projet commun depuis le 15/10 : `tools/projet-commun/lib-retours.mjs`, `remettre()`. |
| RT-64 | majeur | générique | **Le gabarit et l'oracle du lot sont RECOPIÉS chez chaque produit, et la copie dérive.** Ce produit porte `forge/retours/oracle-lot.mjs` (531 lignes), `GABARIT-LOT-RETOURS.md` et `CLASSES.json` en copies ; le relevé d'héritage de l'ouverture du 15/10 les donne « conformes sur le DISQUE, divergents de HEAD ». TF-1568 et TF-1569 (02/10) montrent la suite : deux lots refusés à la porte du pilot parce que rédigés sous une copie antérieure à R-57. Le gabarit le dit lui-même : « Le fichier `forge\retours\oracle-lot.mjs` absent ? […] il se recopie depuis `gabarits\oracle-lot-retours.mjs` du pilot ». | Faire du produit un RELAIS, comme `forge/hooks/factory.mjs` le fait déjà pour les hooks : un `oracle-lot.mjs` de quelques lignes qui résout le pilot sur le poste (`FORGE_ROOT`) et importe son module. Le gabarit se lit au pilot, et le produit n'en garde qu'un pointeur. Une règle neuve s'applique alors au lot suivant sans recopie, et la classe des lots refusés pour cause de copie périmée disparaît. Le projet commun l'applique depuis le 15/10 : son gabarit `tools/projet-commun/GABARIT-RETOURS.md` et son oracle ne sont jamais recopiés chez le produit. |
| RT-65 | mineur | générique | **Le produit n'apprend pas ce que sont devenus ses retours.** Les sections du hook d'ouverture côté produit (`oracles/hook-ouverture.mjs`, 24 titres « ## » distincts relevés le 15/10) ne disent rien des TF frappés pour ce produit ni de leur statut. Le gabarit renvoie à `TODO-PRODUIT.md` et aux lots de travaux reçus, deux canaux que le produit doit aller lire. Constat de ce jour : ce produit a remis 99 fichiers de lots avant celui-ci, et sa session n'a vu le sort d'aucun à l'ouverture. | À l'ouverture du produit, une section « Vos retours » : pour chaque TF dont la `source` nomme ce produit, son statut au registre et sa date de clôture, et les items clos depuis l'ouverture précédente. Le registre est déjà sur le poste, il ne manque que la lecture. Côté projet commun, c'est le rôle des récépissés `input/00-retours/RECEPISSES.jsonl`, lus par `ouverture-produit.mjs`. |

**Portée** : générique — les trois défauts tiennent au canal, pas à ce produit.

## La règle qui aurait évité le retour

- **RT-63** : classe à créer, `lot-ecrit-jamais-remis`, famille `contrat-interface-forge` : « Un lot écrit chez le producteur au statut `a_remettre` n'est relevé par personne : la remise est un geste de session que rien ne déclenche et que rien ne compte côté producteur. » La règle qui l'aurait évité : la remise est jouée par un script et le statut est relevé à l'ouverture.
- **RT-64** : classe `releve-heritage-juge-arbre-pas-histoire`, celle de TF-1568. La règle qui l'aurait évité : un artefact de contrôle se délègue par relais, il ne se recopie pas.
- **RT-65** : classe `boucle-retour-sans-descente`. La règle qui l'aurait évité : l'ingestion rend un récépissé que le producteur lit à son ouverture.

## Rattachement

Registre interrogé le 15/10/2026 (`todo/TODO.jsonl`, 4 249 lignes, sortie complète, sans troncature) :

- motifs « non remis | jamais remis | a_remettre | devenir d'un retour » : 2 items, TF-0883 et TF-1068, sans rapport (boîte du produit, chemin d'un lot de travaux). **RT-63 est neuf** ; TF-0908 porte le cas symétrique, côté pilot (lot arrivé, jamais ingéré) ;
- motifs « recopie | relais » autour de l'oracle et du gabarit : TF-0848, TF-0850, TF-0852, TF-1171 et TF-1393 traitent de la garde et du relevé de recopie, jamais de la remplacer par un relais. TF-1568 et TF-1569 en sont les symptômes. **RT-64 est neuf** comme proposition ;
- motifs « ce qu'est devenu | réponse au produit | TF frappé » : 1 item sans rapport (TF-1206). **RT-65 est neuf** ;
- le transport local au poste (le sas `_arrivee` ignoré par git) est **déjà TF-1214**, et n'est pas remonté ici. Matière pour lui : le projet commun transporte ses lots par git, en branche `retours/<produit>/<lot>` du dépôt partagé, poussée sans toucher l'arbre du clone (`commit-tree` sur un index temporaire).

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le canal du projet commun ne fonctionnait que dans un sens (tirage) | canal des retours posé, RAF-161 | non pour la factory | propre au projet commun Client-A ; ses leçons sont remontées en RT-63 à RT-65 |
| Une session a cru pouvoir modifier un script par un heredoc, et les antislashs ont été altérés | édition refaite par l'outil d'édition | non | déjà consigné en mémoire de poste (« Script en ligne et antislashs »), sans nouveauté |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.
