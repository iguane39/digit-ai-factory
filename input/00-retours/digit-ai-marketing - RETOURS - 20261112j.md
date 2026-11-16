# Retours forges — digit-ai-marketing — 20261112j

- **Contexte** : autre — demande humaine du 12/11/2026 : animer en vidéo un personnage 3D depuis une photo, au principe de deux clips fournis (image vers vidéo, 8 s).
- **Références ledger** : `forge\ledger.jsonl` seq 758 (entrée `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 2 voies de génération vidéo essayées, 0 disponible ; 4 images générées par Gemini ; 1 vidéo de 192 images calculée en local. Ce lot remonte 1 retour, tiré de 1 entrée du ledger, au pilot.

---

## Pilot (`digit-ai-factory`)

L'animation d'un personnage depuis une photo n'a ni voie de production ni oracle au poste.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-219 | majeur | générique | **Une demande d'image vers vidéo bute sur deux impasses découvertes en cours de tour.** Faits : la clé Gemini du pilot liste 6 modèles d'image et aucun modèle Veo (liste complète relue le 12/11/2026). L'outil `create-video` de Canva répond « Some advanced AI features aren't available with your current plan or trial ». Le skill `clip-de-presentation` ne couvre que le motion design en Canvas. Le produit a livré une animation calculée en local : respiration, balancement, tête, clignements et bouche, sans geste des bras. Aucun oracle ne couvre ce type de livrable : jugement par mesures (écart image à image, bouclage) et par planches. (ledger seq 758) | Une table des voies de génération par type de média (image, vidéo, voix), avec leur état au poste et leur coût, lue avant de proposer une voie à l'humain ; un oracle de clip de personnage (durée, cadence, fluidité, bouclage, planche du visage). Classe à créer : `type-livrable-sans-voie-de-production`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RP-219 | `grep -i "veo\|vid[ée]o" todo/TODO.jsonl \| grep -i -c "g[ée]n[ée]r"` | 1 | voisin : TF-1924 (vidéo de lancement générée par le code, HyperFrames) ; aucun ne couvre l'image vers vidéo |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La clé Gemini du pilot a rendu 4 images alignées au pixel près sur le personnage de départ, ce qui a permis l'incrustation des yeux et de la bouche.
- `allouer-indice.mjs` a donné l'indice libre du dossier sans hésitation.

## Ordre recommandé

1. RP-219.

## La règle qui aurait évité le retour

Aucune règle ne demande de vérifier qu'une voie de génération existe au poste avant de la proposer ; la colonne « Proposition esquissée » propose la classe.
