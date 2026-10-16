# Candidature — une garde de publication contournée par une sortie rompue — 20260924a

Constat de la session du pilot du 24/09/2026, pendant la synchronisation demandée par l'humain.

## Le fait, mesuré

À 13:49, un `git push` de 13 dépôts a été lancé avec sa sortie envoyée dans un filtre
`grep -E "->|…"`. `grep` a lu « -> » comme une option et s'est arrêté aussitôt. Les 13 envois sont
partis, et le hameçon `pre-push` n'a pas tenu : l'envoi du pilot a pris 5 secondes, là où sa porte
des noms de clients en prend 4 à 5 minutes (4 min 30 mesurées à 16:15 sur le même dépôt), et le
classeur de R-38 §4-5, rejoué après coup sur la plage envoyée, rend FAIL faute de feu vert déclaré.

Reproduit sur deux dépôts jetables (scratchpad de la session, aucune publication) :

| Essai | Hameçon | Sortie de `git push` | Résultat |
|---|---|---|---|
| 1 | refuse (message sur la sortie d'erreur, puis sortie 1) | écrite normalement | refusé, le distant ne bouge pas |
| 2 | le même | envoyée dans un filtre qui échoue | **publié** malgré le refus |
| 3 | le même, précédé de `trap '' PIPE` | envoyée dans le même filtre | refusé, le distant ne bouge pas |

Le hameçon meurt au premier écho sur un tuyau fermé, et son refus se perd. La parade tient en une
ligne, `trap '' PIPE` en tête de chaque hameçon qui refuse.

## Ce qui reste à faire

- Ajouter la ligne aux trois gabarits de `installer-hamecon-publication.mjs`
  (`digit-ai-forge-agents`), avec une recette qui rejoue l'essai 2 rouge et l'essai 3 vert.
- Reposer les hameçons du parc ; le `pre-push` du pilot porte en plus la section R-38 §4-5, qui
  n'est pas dans le gabarit de l'installateur, et doit la garder.
- La porte des noms rejouée le 24/09 sur le pilot et les 12 forges couvre après coup ce qui est
  parti à 13:49.

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot — vérifié par la session du pilot, le 24/09/2026 :
le constat est fait au pilot, sur ses propres envois.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## La règle qui aurait évité le retour

Aucune clé du référentiel ne décrit ce défaut. Classe proposée :
`garde-contournee-par-sortie-rompue`, famille `hook-ou-gate`, libellé : « Un hameçon qui refuse
écrit son motif sur la sortie d'erreur puis sort en 1 ; si cette sortie est un tuyau déjà fermé,
le hameçon meurt au premier écho et git publie quand même. La garde protège contre l'accident, et
c'est l'accident qui la contourne. »
