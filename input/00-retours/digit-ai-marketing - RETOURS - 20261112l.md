# Retours forges — digit-ai-marketing — 20261112l

- **Contexte** : autre — demande humaine du 12/11/2026 : « Utilise ma clé VEO pour animer Emma de mon compte Gemini », après le lot 20261112j.
- **Références ledger** : `forge\ledger.jsonl` seq 778 (entrée `type: retour`, qui rectifie la seq 758).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 64 modèles listés sur la clé Gemini du pilot, dont 3 modèles Omni ; 1 vidéo générée en 39 s. Ce lot remonte 1 retour, tiré de 1 entrée du ledger, au pilot.

---

## Pilot (`digit-ai-factory`)

RP-219 concluait à tort qu'aucune voie image vers vidéo n'existait au poste.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-221 | majeur | générique | **Rectification de RP-219 : la voie existait, la session cherchait un nom de modèle arrêté.** Faits : Veo 3.1 est arrêté dans l'API Gemini depuis le 22/10/2026 (https://aistudio.google.com/docs/video, lu le 12/11/2026). Son successeur `gemini-omni-1.2-flash` (Interactions API, `POST /v1beta/interactions`, `response_format` de type video) figure parmi les 64 modèles de la clé du pilot. La session filtrait la liste sur « veo, video, imagen, predict » et l'a manqué. Relancée sur consigne humaine, la génération a rendu en 39 s une vidéo de 8 s en 720×1280, avec des gestes. (ledger seq 778) | Proposition de RP-219 maintenue et précisée : une table datée des voies de génération par média (image, vidéo, voix), qui porte le nom courant de chaque modèle et ses prédécesseurs arrêtés, lue avant de déclarer une voie absente. Classe à créer : `type-livrable-sans-voie-de-production`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RP-221 | `grep -i "veo\|vid[ée]o" todo/TODO.jsonl \| grep -i -c "g[ée]n[ée]r"` | 1 | voisin : TF-1924 (vidéo de lancement générée par le code) ; RP-219 du lot 20261112j, que ce retour rectifie |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `gemini-omni-1.2-flash` a gardé le personnage généré au tour précédent (visage, tenue, porte-documents, fond) et suivi le découpage de la consigne en 4 temps.

## Ordre recommandé

1. RP-221, à traiter avec RP-219.

## La règle qui aurait évité le retour

Aucune règle ne demande de vérifier le nom courant d'un modèle avant de déclarer une voie absente ; la colonne « Proposition esquissée » le propose.
