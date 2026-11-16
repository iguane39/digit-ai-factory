# Retours forges — digit-ai-marketing — 20261112e

- **Contexte** : autre — demande humaine du 12/11/2026 : « Améliore ce prompt : Je souhaite poster les différentes vidéos d'animations présentant la Factory sur LinkedIn… », revue L99 du prompt en mode boucle, passe 3.
- **Références ledger** : `forge\ledger.jsonl` seq 731 (entrée `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 2 appels d'`allouerIndice` sur `output/03-publications` au jour 20261112, 1 nom du jour relevé dans ce dossier. Ce lot remonte 1 retour, tiré de 1 entrée du ledger, au pilot.

---

## Pilot (`digit-ai-factory`)

L'allocateur d'indice rend une lettre que la règle de nommage qu'il sert refuse.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-214 | majeur | générique | **`allouer-indice.mjs` ne compte que son propre radical, alors que R-4 refuse un indice du jour porté par deux radicaux.** Faits : le 12/11/2026 à 15:05, `allouerIndice` sur `output/03-publications`, jour 20261112, rend « a » pour un fichier `.md` d'un préfixe neuf et « a » pour un livrable-dossier d'un autre préfixe, alors que `Digit-AI - Présentation - Clip file de tickets multi-agents - 20261112a.mp4` occupe déjà « 20261112a ». `oracle-conformite-projet.mjs` accuse un indice partagé par plusieurs livrables de radical distinct, sauf lot déclaré (ligne 484, commentaire ligne 329). Le relevé d'ouverture de la session comptait 5 indices partagés de ce type au pilot. (ledger seq 731) | L'allocateur rend la première lettre du jour libre dans le dossier, tous radicaux confondus, et compte les livrables-dossiers ; un test du banc pose `X - 20261112a.mp4` et attend « b » pour un autre radical. Classe à créer : `allocateur-aveugle-a-la-regle-qu-il-sert`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RP-214 | `grep -i -E "allouer-indice\|allouerIndice" todo/TODO.jsonl \| grep -i -E "autre(s)? radica\|tous radicaux\|premi.re lettre libre\|indice partag"` | 2 | aucun : TF-1850 traite le passage au-delà de « z », pas l'unicité entre radicaux |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La vérification de clôture de la boucle L99 a vu ce défaut avant toute relecture aveugle, en rejouant l'oracle de conformité dans un projet d'essai.

## Ordre recommandé

1. RP-214.

## La règle qui aurait évité le retour

R-4 (unicité de l'indice dans le dossier) existe et est jugée ; l'allocateur qui doit la servir ne la lit pas, et la colonne « Proposition esquissée » propose la classe `allocateur-aveugle-a-la-regle-qu-il-sert`.
