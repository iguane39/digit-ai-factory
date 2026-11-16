# Retours forges — digit-ai-marketing — 20261112d

- **Contexte** : autre — demande humaine du 12/11/2026 : « Améliore ce prompt : Je souhaite poster les différentes vidéos d'animations présentant la Factory sur LinkedIn à partir de la semaine prochaine… », revue L99 du prompt en mode boucle.
- **Références ledger** : `forge\ledger.jsonl` seq 726 (entrée `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 28 MP4 relevés sous `output/03-publications`, dont 15 en récit client ; `references/RUN-RESEAU.md` du pilot lu à la ligne 125. Ce lot remonte 1 retour, tiré de 1 entrée du ledger, au pilot.

---

## Pilot (`digit-ai-factory`)

Le run d'animation de réseau exclut encore la vidéo pour un motif que la Factory a rendu faux le 10/11/2026.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-213 | majeur | générique | **L'exclusion « Pas de vidéo » du run d'animation de réseau survit à son motif.** Faits : `references/RUN-RESEAU.md:125` dit « Pas de vidéo : aucun verbe outillé ne la produit » et renvoie la vidéo à une décision humaine. Depuis le 10/11/2026, le skill clip-de-presentation de forge-design (TF-2405) produit des MP4 jugés par `oracle-clip` ; ce produit en porte 28 sous `output/03-publications`, dont 15 en récit client (relevé du 12/11/2026 à 14:26). Le porteur demande le 12/11/2026 de les publier sur LinkedIn dans le cadre du run. Le motif est faux, la règle n'a pas bougé, et aucun gate du run ne juge une publication vidéo. (ledger seq 726) | Rouvrir le point par décision humaine : la publication de clips déjà jugés par `oracle-clip` entre au run, la production restant au skill ; sinon l'exclusion se réécrit avec un motif vrai. Toute exclusion motivée par l'absence d'un outil nomme l'outil attendu, pour qu'un relevé signale le motif devenu faux. Classe à créer : `exclusion-de-run-perimee-par-une-capacite-neuve`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RP-213 | `grep -i "RUN-RESEAU" todo/TODO.jsonl \| grep -i -c "vid"` | 3 | aucun : TF-1158 crée le run, TF-1178 élargit les réseaux, TF-1278 paramètre le run ; aucun ne rouvre la vidéo |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le relevé d'ouverture a signalé D-180, décision ouverte sur la publication de la série, avant toute analyse : la revue l'a citée dès le chapitre 4.

## Ordre recommandé

1. RP-213.

## La règle qui aurait évité le retour

Aucune règle ne relit le motif d'une exclusion de run quand une capacité est versée ; la colonne « Proposition esquissée » propose la classe `exclusion-de-run-perimee-par-une-capacite-neuve`.
