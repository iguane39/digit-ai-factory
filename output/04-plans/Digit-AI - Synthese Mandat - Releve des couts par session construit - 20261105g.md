---
destinataire: humain
---

# Synthèse Mandat — relevé des temps, des jetons et de la charge à la fin de chaque session, construit (05/11/2026)

## 0. Synthèse d'ouverture

Le relevé est construit et câblé, au pilot comme chez chaque produit. À la fin de chaque session, une ligne est écrite chez le produit. Elle porte les jetons, le temps actif et la charge en 3 indicateurs séparés, puis la ventilation par run et par étape. Une session fermée sans fin propre est relevée à l'ouverture suivante. Au pilot, les 59 sessions encore sur le disque sont déjà relevées : 7,54 milliards de jetons, soit 2 750,88 $ au tarif public de l'API. Chaque produit recevra le relevé à sa prochaine ouverture.

Livré : [Script du relevé des coûts](scripts/relever-couts.mjs)

## 1. En-tête d'identification

Mandat de construction au pilot `digit-ai-factory`, sur votre « A1 » qui lance la candidature TF-2181 (option O2 de l'étude 20261105a). Période : 05/11/2026 de 15:18 à 16:56, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; 1 agent `verificateur` pour la relecture d'intention ; escalade de modèle : aucune.

Intention de la demande : construire le relevé recommandé par l'étude, avec la charge suivie en 3 indicateurs séparés selon D-177.

Test rétro : le résultat sert cette intention. Le relevé écrit les 3 indicateurs sans les additionner, garde les jetons avant la purge et calcule le coût depuis un référentiel daté.

## 2. Verdict en une ligne

Relevé construit et câblé : recettes du relevé à 13/13 et du lanceur à 41/41 ; le harnais complet garde 238/238 recettes vertes et rend exit 1 sur 3 contrôles d'état du parc étrangers au tour.

## 3. Décisions attendues

Aucune décision nouvelle : la revue des chiffres est datée du 2026-12-15.

## 4. Traité

Le tour a construit 4 fichiers neufs, câblé 6 fichiers existants et prouvé le relevé sur des sessions réelles.

- **Le relevé**, `scripts/relever-couts.mjs`. Il compte les jetons une fois par réponse, en 4 catégories et par modèle, sous-agents à part. Il calcule le temps actif aux 3 seuils et range chaque réponse dans son run et son étape, d'après le journal. La charge y est écrite en 3 indicateurs : interventions humaines, temps humain et temps agent. Aucun montant n'est écrit : la vue `--vue` calcule le coût à la lecture.
- **Le temps humain**, validé sur 1 487 messages humains de 588 sessions : l'écart qui précède vaut 208 s en médiane et 3,1 h au 95e centile. Chaque écart est donc borné au 75e centile, 894 s, et le relevé compte les écarts bornés.
- **Le référentiel daté**, `references/SUIVI-COUTS.json` : les prix des 7 modèles servis, les 3 seuils d'inactivité et le plafond du temps humain, chacun avec sa source, et une revue le 2026-12-15.
- **Le hook**, `oracles/hook-couts.mjs` : il se déclenche à la fin de session et, en tâche de fond, à l'ouverture pour le rattrapage. Il est câblé au pilot et au gabarit des produits, et l'héritage passe en version 1.52.0. Le relevé de la session en cours a pris 243 ms.
- **Un fichier par poste**, `couts-<poste>.jsonl` : 2 postes qui écrivent dans le même fichier se heurteraient à chaque fusion git. La vue lit tous les fichiers d'un dossier.
- **Recettes.** Le relevé passe 13/13 cas. 2 mutants ont été attrapés, l'un par 3 cas, l'autre par 1 cas. Le lanceur passe 41/41 avec 2 cas neufs, le self-test de conformité 216/216, le relevé d'héritage 46/46. Le harnais complet rend 238/238 recettes vertes. Il sort en exit 1 sur 3 contrôles d'état du parc, sans lien avec ce tour : un sceau rompu sur une synthèse du 02/11, des skills installés qui divergent de leurs forges, un README sans rôle sous `input/Tiktok`.
- **Preuve sur le run de Produit-79.** Le relevé y range 45 382 179 jetons, le total exact des 2 décomptes de l'étude. La sortie est allée dans le dossier de travail : rien n'a été écrit chez le produit.
- **Écart corrigé par la vue.** 3 réponses `<synthetic>` à 0 jeton rendaient le coût « non calculable ». Un bloc sans jeton coûte désormais 0 $, cas vert ajouté à la recette.
- **Registre.** TF-2181 est passée en `decide` sur votre « A1 », puis en `en_cours` jusqu'à la revue ; `oracle-todo` rend PASS à chaque écriture.
- **Relecture d'intention :** sert, gravité aucune (RI-20261105-08).

## 5. Non traité

- **La vue dans la restitution de forge-data** — motif : borne_atteinte, la vue vit au pilot, `--vue` ; la porter dans forge-data est une étape de plus, consignée sous TF-2181.
- **La veille de forge-observability** sur les sessions sans relevé — motif : borne_atteinte, même raison, consignée sous TF-2181.
- **Le marqueur automatique du pilot** — motif : borne_atteinte, une session du pilot qui sert un produit le déclare par `--pour <pseudonyme>` ; le poser d'office à l'ingestion d'un lot ou au lancement d'une campagne reste à faire.
- **Les interventions humaines au pilot** — motif : hors_mandat, le pilot n'a pas de journal de run ; elles se comptent chez les produits seulement.
- **Le relevé chez les produits** — motif : hors_mandat, le pilot n'écrit chez un produit que sur run demandé ; chacun reçoit le hook à sa prochaine ouverture.
- **La publication du pilot** — motif : hors_mandat, non demandée ; l'enregistrement reste local.

## 7. Risques

- **Transcriptions d'un produit purgées avant sa prochaine ouverture.** Énoncé : le rattrapage ne relève que ce qui reste sur le disque, et les transcriptions de plus de 30 jours disparaissent. Signal : un produit ouvert après le 2026-11-15 dont le premier relevé commence après sa dernière session connue. Parade : l'action A-1.

## 8. Prochaines actions

Une suite possible, d'abord parce que chaque jour d'attente efface un jour de jetons chez les produits fermés.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Ouvrir une fois chaque produit actif pour que son hook rattrape ses sessions encore sur le disque | TF-2181 | auto_ia | hors_mandat : le pilot n'écrit chez un produit que sur run demandé ; attend votre « A1 » | une session ouverte dans le dossier de chaque produit | si rien n'est fait, les sessions de plus de 30 jours d'un produit fermé sont perdues |

## 9. Traces

- Code : `scripts/relever-couts.mjs`, `scripts/relever-couts.test.mjs`, `oracles/hook-couts.mjs`, `references/SUIVI-COUTS.json`.
- Câblage : `.claude/settings.json`, `gabarits/settings-produit.json`, `gabarits/hooks-factory.mjs` et sa recette, `gabarits/HERITAGE.json` en version 1.52.0, `oracles/self-test.mjs`, `references/INDEX.md`.
- Relevé du pilot : `todo/observabilite/couts-pilot-Dell-XPS-16.jsonl`, 60 lignes pour 59 sessions.
- Registre : TF-2181 dans `todo/TODO.jsonl`, relecture RI-20261105-08 dans `todo/relectures-intention.jsonl`.
- Enregistrement : commit local 9e919365 au pilot, non publié.
