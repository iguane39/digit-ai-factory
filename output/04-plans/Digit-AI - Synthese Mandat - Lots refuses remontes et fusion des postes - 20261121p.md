---
destinataire: humain
---

# Synthèse Mandat — A3 (lots refusés remontés au producteur) et A4 (publication après fusion avec l'autre poste) faites, 21/11/2026

## 0. Synthèse d'ouverture

Les 2 actions sont faites. Les corrections attendues des lots refusés sont remises à leur producteur, avec la cause mesurée : il inscrivait des noms de famille là où la porte attend des noms de classe, et son contrôle de remise l'en avertissait sans le bloquer. Le travail du pilot est publié. Il a d'abord fallu fusionner le travail des deux postes, dont les numéros de décision se chevauchaient : ce poste a renuméroté les siens comme vous l'avez choisi, et la veille des éditeurs devient D-228, la péremption des compétences D-229. Ce poste et la version publiée sont maintenant alignés. Il vous reste un geste : redémarrer l'éditeur, qui garde une ancienne valeur de configuration.

## 1. En-tête d'identification

- **Quoi** : actions A-3 et A-4 de la synthèse 20261121k.
- **Sur quoi** : le pilot digit-ai-factory, la boîte d'entrée du producteur, la branche principale publiée.
- **Quand** : 21/11/2026, relevés par `date` à 13:17 (fusion enregistrée, publication lancée), 13:18 (publication acceptée) et 13:19 (branche locale alignée).
- **Qui** : Claude Opus 5.5, session du pilot, du commit ccd4aa9c au commit de fusion 945f1ea3.
- **Intention** : « A3 & A4 », soit remettre aux producteurs les corrections de leurs lots refusés, puis publier le travail du pilot.
- **Test rétro** : la remise est faite, sa cause est mesurée et non supposée, et la publication est acceptée sur un arbre fusionné et contrôlé. Le résultat sert l'intention.

## 2. Verdict

- Lot de travaux déposé chez le producteur : 16 éléments, dont les 3 nouveaux constats (TF-2758 à TF-2760), 0 commit chez lui.
- Registre des décisions après fusion : 0 numéro en double, plus grand numéro 229 (`reserver-decision --verifier` PASS).
- Registre des sujets après fusion : oracle du registre PASS.
- Publication : 1er envoi refusé (code de sortie 1), 2d accepté (`a3d46e8e..945f1ea3`, code de sortie 0) ; la branche locale est alignée sur la branche distante.

## 3. Décisions attendues

Aucune décision nouvelle. Rappel des décisions ouvertes :
- D-221 : rouvrir l'exclusion « Pas de vidéo » pour publier les clips sur LinkedIn, posée le 16/11 à 15:06, inchangée.
- D-222 : enchaîner sans les reposer les étapes d'un plan déjà validé, posée le 16/11 à 15:06, inchangée.
- D-223 : fusionner les fichiers .env d'un produit avec un coffre sur Drive, posée le 16/11 à 15:06, inchangée.
- D-227 : remplacer Gemini CLI refusé pour un compte personnel, posée le 21/11 à 13:11 sur l'autre poste, inchangée.

## 4. Traité

- **A-3, cause mesurée chez le producteur, en lecture seule** :
  - ses sidecars portent dans le champ « classe » les 9 clés de famille du référentiel (`regle-morte`, `page-html-socle`…), reprises de son journal ;
  - son contrôle de remise charge celui du pilot, qui rend « PASS — AVEC AVERTISSEMENT : la porte du pilot REFUSERA ce lot » avec un code de sortie 0 (rejoué sur le lot 20261115j).
- **A-3, remise** :
  - TF-2758 (9 lots, clés de famille), TF-2759 (classe proposée non nommée), TF-2760 (deux lots sous le même nom, RP-80 réutilisé) sont inscrits et décidés par votre réponse ;
  - le lot est déposé dans la boîte d'entrée du producteur par `todo/emettre-travaux.mjs` (« [DÉPOSÉ] … 16 élément(s) ») ;
  - TF-2761, candidat pour le pilot : faire échouer ce contrôle quand la porte refusera le lot.
- **Produit-02 et Produit-85** : leurs lots refusés ont déjà leurs sujets (TF-2557, TF-2558), déposés chez eux le 14/11 (lots « 20261114a » relevés dans leurs boîtes). Rien de neuf à leur confier.
- **A-4, fusion** :
  - l'autre poste a publié D-224 à D-227 ; ce poste a renuméroté les siens 2 fois (4cf600fe, puis f5695f31 après la réservation de D-227 par l'autre poste) ;
  - 4 lignes du registre des décisions, 20 mentions dans 7 livrables et 1 ligne du registre des sujets ont été renumérotées ;
  - fusion faite dans un arbre séparé (945f1ea3) : registre des décisions uni dans l'ordre chronologique, index régénérés par leurs générateurs, aucun indice du jour partagé par dossier.
- **A-4, publication** : le 1er envoi a été refusé parce que l'autre poste a publié pendant la garde ; le 2d est accepté à 13:18.
- **Alignement du poste** : branche locale avancée jusqu'à 945f1ea3 ; les 30 lignes non enregistrées des 2 journaux du poste ont été réappliquées, et les 2 index générés ont été régénérés.

Relecture d'intention : sert.

## 5. Non traité

- **Cette synthèse** n'est pas encore enregistrée ni publiée : elle est écrite après la publication.
- **Les messages des commits** 9999e8db et 1cbd81cb citent encore D-224 et D-225 : l'histoire ne se réécrit pas.

## 6. Écarts à la lettre

- Vous avez demandé A-4, « publier les 4 commits du pilot » → j'ai d'abord fusionné les 4 commits de l'autre poste et renuméroté 2 décisions de ce poste, 2 fois → parce que la branche distante avait avancé, et que vous avez choisi « Renuméroter ici ».
- Vous avez demandé A-3, une liste par producteur → seul factory-digit-ai-fr en reçoit une nouvelle → parce que les 2 autres producteurs avaient déjà la leur depuis le 14/11.

## 7. Risques

- **La session concurrente a des livrables non enregistrés.** Signal : ses fichiers en attente sous `output/`. Parade : 2 index générés ont été retirés de son attente d'enregistrement et régénérés ; ses autres fichiers sont intacts.
- **La variable `FORGE_ROOT` de cette session pointe encore sur le dossier des arbres de travail**, un environnement hérité d'avant son retrait du 14/11. Signal : « produit non localisable » à l'ingestion. Parade : redémarrer l'éditeur (A-1) ; en attendant, `FORGE_ROOT=C:\dev` est passé à chaque commande.

## 8. Prochaines actions

Ordre : A-1 d'abord, parce que l'ingestion et l'émission de travaux en dépendent ; A-2 est indépendante.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Redémarrer l'éditeur pour que les sessions suivantes perdent l'ancienne valeur de `FORGE_ROOT` | neuve | manuelle_utilisateur | presence : la variable vient du processus de l'éditeur, qu'une session ne peut pas relancer | fermer puis rouvrir VS Code | Si rien n'est fait : l'ingestion ne localise pas les produits et la cause d'un refus n'est pas mesurée |
| A-2 | Enregistrer et publier cette synthèse | neuve | auto_ia | garde_fou : chaque publication demande votre accord explicite | `git commit` puis `git push` | Si rien n'est fait : cette synthèse n'existe que sur ce poste |

## 9. Traces

- Commits publiés : 88766fe6 (remise aux producteurs), 4cf600fe et f5695f31 (renumérotations), 945f1ea3 (fusion).
- Registre : `todo/TODO.jsonl`, TF-2758 à TF-2761 ; `decisions/REGISTRE.jsonl`, D-228 et D-229.
- Lot déposé : `input/00-travaux/pilot - TRAVAUX - 20261121a.md` du dépôt du producteur.
- Journal de la publication : `push-plan-mode.log`, dans le dossier temporaire de la session.
