---
destinataire: humain
---

# Synthèse Mandat — rappel des leçons au geste et relevé des frictions du tour, sur D-172 (a) et (b) (05/11/2026)

## 0. Synthèse d'ouverture

Les 2 constructions décidées sont faites, vérifiées et publiées au pilot ; chaque produit les recevra à sa prochaine ouverture, sans que le pilot écrive chez lui. Avant une commande qui a déjà causé une erreur, l'agent reçoit désormais la leçon correspondante, avec la solution à préférer. Cinq leçons réelles sont en place, dont celle des longues commandes qui avait été mordue 12 fois. En fin de tour, le contrôle relève vos corrections et les refus de contrôle, et les inscrit dans un journal. Chez un produit, il avertit quand le tour dit n'avoir « rien à remonter » malgré ces signaux. Il avertit seulement, sans refuser : sur 28 cas relus, il avait raison 89 fois sur 100, sous le seuil de 90 fixé d'avance. Il y a une limite à connaître : le rappel arrive avec le résultat de la commande, donc il sert à la commande suivante ; seule une leçon devenue barrière arrête la commande elle-même. Vous n'avez rien à décider aujourd'hui.

## 1. En-tête d'identification

Run de mandat sur votre réponse « ok, fais les 2 » à D-172, au pilot `digit-ai-factory`. Relevés d'horloge du 04/11/2026 à 16:50 au 05/11/2026 à 09:37, heure de Paris (UTC+01:00) ; le poste a dormi la nuit. Session pilote Claude Opus 5.5 ; 2 agents `constructeur` (Opus 5.5), chacun dans un arbre de travail isolé ; escalade de modèle : aucune, la complexité était cotée « complexe » par l'étude.

Intention de la demande : construire les options (a) et (b) de D-172, pour que Claude cesse de refaire une erreur connue, au pilot et chez les produits.

Test rétro : le résultat sert cette intention. La leçon est rappelée au geste qui la déclenche ; la récidive après rappel est détectable par le croisement des deux journaux, et fait passer la leçon en barrière. Les produits reçoivent les leçons par lecture au pilot.

## 2. Verdict en une ligne

2 constructions sur 2 fusionnées et publiées, `git rev-list` à 0 0 ; 268 cas de recette verts sur les 6 recettes touchées, dont le cas 16 du lanceur, réparé au passage.

## 3. Décisions attendues

Aucune décision ne vous revient.

## 4. Traité

- **Rappel des leçons (D-172 (a), sujet TF-2150).**
  - Le contrôle `oracles/hook-lecons.mjs` se joue avant les commandes et les écritures de fichier.
  - Sa table `references/LECONS.json` compte 5 leçons. Chacune a sa preuve au registre, vérifiée avant chaque rappel.
  - Le script `scripts/lecons.mjs` juge la table, liste les récidives et passe une leçon en barrière.
  - Au pilot, une barrière refuse la commande ; chez un produit, elle avertit, en première version.
  - Mesure sur 30 786 commandes du mois écoulé : 311 rappels, 0 faux positif sur 29 relus. Durée médiane : 74 ms.
  - Essai réel : la leçon sur `git push` filtré est servie, rien n'est servi sur `git status`.
- **Frictions du tour (D-172 (b), sujet TF-2141).**
  - Le relevé `oracles/lib-frictions.mjs` est branché au contrôle de fin de tour, avec un journal par poste, au pilot et chez les produits.
  - Le gabarit de restitution passe en 2.60.0.
  - Mesure d'entrée : 157 transcriptions de 15 produits, 804 fins de tour rejouées. Sur 28 tours relus, 25 refus étaient justes et 3 à tort, d'où l'avertissement.
- **Recettes rejouées sur l'arbre fusionné.** `hook-lecons` 49/49, `lecons` 40/40, `hook-restitution-frictions` 30/30, `hook-restitution` 64/64, `hooks-factory` 39/39, `relever-heritage` 46/46. `oracle-claude-md` rend PASS.
- **Fusion.** Elle s'est faite dans un arbre de travail propre, gardes de fusion actives, car l'index principal portait le travail indexé d'autres sessions. Il y avait 4 conflits :
  - l'héritage : 2 versions 1.50.0, la mienne passée en 1.51.0 ;
  - le cliquet des recettes : la mesure la plus haute est gardée ;
  - 2 fichiers d'exclusion, dont un doublon retiré.
  La branche principale a avancé en avance rapide, puis les arbres et branches temporaires ont été retirés.
- **Cas 16 du lanceur réparé.** Il attendait une version périmée du gabarit ; il la lit désormais dans le gabarit.
- **Registre.** TF-2150 et TF-2141 passent « en cours », avec une échéance au 15/12/2026. Les constats des agents deviennent 3 candidats : TF-2155 (le rappel arrive après la commande), TF-2156 (« reste au produit » sans retour consigné passe le contrôle) et TF-2157 (une référence `.json` orpheline n'est pas signalée). `oracle-todo` rend PASS avant et après.
- **Publication** sous le feu vert permanent D-54 (b) du pilot : `8b1ac7bc..ce8244c7`, vérifiée par `git rev-list` à 0 0.
- **Relecture d'intention :** sans objet, motif : l'essai a franchi son plafond de jetons, constaté au relevé d'ouverture.

## 5. Non traité

- **Le passage du contrôle des frictions en refus** : motif, la mesure est sous le seuil de 90 % fixé d'avance ; il faut la contre-mesure d'un second relecteur avant toute bascule.
- **2 défauts extérieurs relevés par les agents** : motif, ils ne viennent pas de ce chantier. Le compte de `references/PRODUITS.md` dit 32 produits pour 33 constatés. Le script `scripts/ranger-secret.mjs`, écrit par une autre session le 05/11, calcule une empreinte sans être déclaré dans `references/EMPREINTES.md`.
- **L'enregistrement du registre** : motif, d'autres sessions y ont du travail non enregistré ; mes 8 événements depuis hier partiront avec leur prochain enregistrement.
- **La mesure chez les produits et au second profil** : motif, le rappel n'est éprouvé qu'au pilot et en recette.

## 7. Risques

- **Leçon trop large.** Énoncé : une leçon dont le motif ratisse trop rappellerait à tort et userait l'attention. Signal : des rappels sur des commandes sans rapport, visibles dans le journal `lecons-rappels.jsonl`. Parade : `node scripts/lecons.mjs --verifier`, et la revue de chaque leçon à sa date du 15/12/2026.

## 8. Prochaines actions

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Mesurer au 15/12/2026 les récidives des 5 leçons et les rappels servis, puis clore ou corriger les 2 sujets | TF-2150 | auto_ia | échéance, les journaux doivent se remplir | `node scripts/lecons.mjs --recidives` | aucune preuve que les erreurs baissent |
| A-2 | Faire contre-mesurer le contrôle des frictions par un second relecteur, puis le passer en refus s'il franchit 90 % | TF-2141 | auto_ia | échéance, le même jour que A-1 | la mesure et son classement, rejouables par l'agent | le contrôle reste un avertissement |
| A-3 | Recompter les produits de la référence et déclarer le script qui calcule une empreinte | neuve | auto_ia | hors du périmètre de ce chantier | `node references/generer-compte-produits.mjs` ; `references/EMPREINTES.md` | 2 recettes du harnais restent rouges |

## 9. Traces

- Commits publiés : `5cbaff8c`, `1df6ab25`, `df8df2f3` (rappel des leçons), `145a9773` (frictions), fusions `9e45639d` et `ce8244c7`.
- Code : `oracles/hook-lecons.mjs`, `references/LECONS.json`, `scripts/lecons.mjs`, `oracles/lib-frictions.mjs`, `oracles/hook-restitution.mjs`, `gabarits/HERITAGE.json` (1.51.0), `gabarits/RESTITUTION.md` (2.60.0).
- Registre : `todo/TODO.jsonl`, TF-2150, TF-2141, TF-2155 à TF-2157 ; écrits, non enregistrés.
- Étude d'origine : `output/03-etudes/Digit-AI - Étude - Apprentissage des erreurs par les produits et la Factory - 20261104b.md`.
