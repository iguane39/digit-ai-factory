---
destinataire: humain
---

# Synthèse Mandat — affichage double de la réponse corrigé, et revue hebdomadaire accélérée des propositions en place (01/10/2026)

## 0. Synthèse d'ouverture

Votre réponse s'est affichée 2 fois parce que le juge de fin de tour lit un message après son affichage : quand il le refuse, la première version reste à l'écran et la réécriture s'ajoute dessous. 2 défauts y menaient, et les 2 sont réglés. Ma réponse dépassait la longueur permise, et le juge prenait pour une décision à trancher une simple mention de décision. Une réponse courte se vérifie désormais avant d'être affichée. La revue hebdomadaire que vous avez demandée est en place : chaque semaine, 7 propositions au plus, chacune avec ses avantages, inconvénients, impacts et options (a), (b), (c), tranchées en une ligne. Aucune proposition n'a encore sa fiche : il vous revient de dire lesquelles alimentent la première revue.

## 1. En-tête d'identification

- **quoi** — correction d'un défaut d'affichage signalé par vous, puis mise en place de la revue hebdomadaire demandée en cours de tour.
- **sur quoi** — le pilot `digit-ai-factory` : le juge de fin de tour, le relevé d'ouverture, le registre et 2 références.
- **quand** — 2026-10-01 16:01 UTC+02:00 (Europe/Paris), heure relevée par `date` ; début à 15:52:04, horodatage de votre message lu au transcript ; durée mesurée 9 min.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`) ; pilot à `852acdb6` au début, `6e920d7a` après l'enregistrement ; aucun sous-agent ; escalade de modèle : aucune ; recettes jouées : `hook-restitution.test.mjs`, `hook-ouverture.test.mjs`, `lib-baseline-recettes.test.mjs`, `revue-hebdo.mjs --self-test` ; oracles joués : `oracle-todo`, `oracle-etude-opportunite`, `oracle-ecriture`, `oracle-synthese`.
- **intention** — ne plus lire 2 fois la même réponse, et trancher les propositions vite, chaque semaine, sur une présentation claire. **Test rétro** : servie ; les 2 causes mesurées du doublon sont fermées et rejouées sur le cas réel, et la revue rend ses décisions au format du bloc 3, rejoué sur une copie du registre.

## 2. Verdict en une ligne

**Doublon causé par 2 refus du juge après affichage, les 2 causes fermées : recette du juge 39/39 dont 2 cas neufs, contrôle avant affichage qui répond dans les 2 sens ; revue hebdomadaire en place, recette PASS, rappel à l'ouverture affiché, 0 proposition encore munie d'une fiche.**

## 3. Décisions attendues de l'humain

Une décision neuve vous attend, et une décision posée plus tôt dans la session reste ouverte. La revue hebdomadaire ne présente que les propositions munies d'une fiche de décision complète, et aucune n'en a encore. Pour répondre, un sélecteur suffit, par exemple « D-40 a ».

**D-39** : l'intégration retenue par l'étude `output/03-etudes/20261001-etude-opportunite-rsi-et-ssl.md`, posée à 15:44, inchangée.

> **D-40 — Quelles candidatures de `todo/TODO.jsonl` doivent alimenter la première revue hebdomadaire ?**
>
> Le registre compte 184 candidatures en attente, sans fiche de décision. La revue n'en présente aucune tant que leur fiche n'est pas écrite : avantages, inconvénients, impacts, 3 options et une recommandation sourcée. Écrire une fiche demande de relire la candidature et ses sources, sans rien inventer.
>
> **Recommandation : (a).** Source consultée : le mode opératoire écrit dans `references/TODO-FORGE.md`, section « Revue hebdomadaire accélérée », et le compte des candidatures relu au registre à 15:58. Partir des 7 candidatures de plus forte valeur donne une première revue pleine, et le stock commence à baisser dès la première semaine.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Écrire la fiche des 7 candidatures de plus forte valeur et rendre la première revue au prochain tour | moyen × court | les 177 autres attendent les semaines suivantes |
| **(b)** Réserver la revue aux propositions neuves, à commencer par celles de l'étude sur l'auto-amélioration | simple × court | le stock de 184 candidatures reste à trancher une à une, comme aujourd'hui |
| **(c)** Ne rien instruire pour l'instant | nul | la revue reste vide jusqu'à la première fiche écrite |

> **Si rien n'est décidé** : (c).

## 4. Traité — avec sa preuve

Les preuves ci-dessous sont des sorties de commandes de ce tour.

- **La cause du doublon est mesurée** : votre question a reçu une réponse de 158 mots, au-delà de la borne de 150 du niveau Simple. Elle a été refusée après affichage. Sa réécriture de 129 mots citait « (D-39) » dans une phrase, et le juge la tenait aussi pour refusable.
  - preuve : `jugeable` rejoué sur les 2 textes du transcript → « message de 158 mots » jugé, puis « message court POSANT une décision » jugé ; les 2 refus du transcript portent chacun une entrée « Stop hook feedback » et une pièce jointe « hook_blocking_error » à la même seconde.
- **Le faux positif du juge est corrigé, sous recette rouge puis verte** : une décision citée dans la prose n'est plus prise pour une décision posée, et une décision posée par sélecteur reste jugée.
  - preuve : cas 38 ajouté à `oracles/hook-restitution.test.mjs` et joué FAIL avant la modification du motif, puis 39/39 PASS ; rejoué sur le cas réel, la version de 129 mots n'est plus refusée, celle de 158 mots l'est toujours.
- **Un contrôle avant affichage existe pour les réponses courtes** : `node oracles/hook-restitution.mjs --pre-vol` lit le texte sur l'entrée standard et dit si le juge le refuserait.
  - preuve : un texte qui cite une décision → exit 0 ; « répondez D-39 (a) » → exit 1 ; la consigne du niveau Simple, `references/NIVEAUX.md`, l'exige désormais, et `oracle-ecriture` la juge PASS.
- **La revue hebdomadaire accélérée est en place** : un script rend jusqu'à 7 décisions au format du bloc 3, avec avantages, inconvénients, impacts, recommandation sourcée, tableau d'options et repli ; les fiches incomplètes sont listées avec leurs manques.
  - preuve : `node todo/revue-hebdo.mjs --self-test` → PASS ; sur une copie du registre augmentée d'une fiche, `oracle-todo` PASS avant et après, et le dossier rendu porte la décision « D-40 » avec ses 3 options.
- **L'ouverture de session rappelle la revue** quand la dernière a 7 jours ou plus.
  - preuve : `oracles/hook-ouverture.mjs` joué → « revue due, mais aucune proposition n'a de fiche de décision complète » ; `hook-ouverture.test.mjs` 5 PASS, 0 FAIL.
- **Le registre trace le défaut** : candidature TF-1541, classe « faux positif d'oracle », avec la mesure et la correction.
  - preuve : `todo/journaliser.mjs` → PASS avant et après.
- **Tout est enregistré en local** : commit `6e920d7a`, 8 fichiers par enregistrement ciblé.
  - preuve : `git log --oneline -1` → `6e920d7a Restitution : une decision citee…` ; une analyse d'une autre session, indexée avant ce tour, est restée hors du commit.

## 5. Non traité — avec son motif

- L'écriture des fiches de décision du stock du registre — motif : `decision`, elle suit votre réponse à D-40.
- Le retrait de la version refusée à l'écran — motif : `hors_mandat`, l'affichage appartient à Claude Code et un hook de fin de tour ne peut pas effacer un message déjà affiché ; non vérifié dans la documentation de Claude Code.

## 6. Écarts à la lettre

- **Vous avez écrit** « toutes les semaines » → **la revue est due 7 jours après la précédente, sans jour fixe** → **pourquoi** : le même rythme que le relevé des récidives, rappelé à l'ouverture de session, et aucun jour ne vous a été demandé.
- **Vous avez écrit** « validation accélérée » → **7 propositions au plus par semaine, les suivantes reportées** → **pourquoi** : une revue lisible en une fois ; le plafond se change par l'option `--max` du script.
- **Vous avez écrit** « pour que ça ne se reproduise plus » → **les 2 causes mesurées sont fermées, mais un refus légitime affichera toujours 2 versions** → **pourquoi** : le juge lit après affichage ; le contrôle avant affichage en réduit le risque sans pouvoir l'annuler pour un tour de travail.

## 7. Risques

- Une session oublie le contrôle avant affichage ;
  - signal : une réponse « Niveau : Simple » suivie d'un refus du juge au journal des hooks ;
  - parade : la consigne écrite dans `references/NIVEAUX.md`, et la fiche de mémoire de session ajoutée ce jour.
- Une fiche de décision trop flatteuse fait adopter une proposition faible ;
  - signal : une proposition adoptée en (a) dont le gain n'apparaît pas à sa clôture ;
  - parade : la source exigée par la fiche, et la clôture sur gains constatés du registre.

## 8. Prochaines actions

Les actions sont triées, celle de l'IA d'abord ; elle suit votre réponse à D-40.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-4** | Écrire les fiches retenues par D-40, puis rendre la première revue par `node todo/revue-hebdo.mjs --depuis 41 --sortie <dossier>` | `auto_ia` | neuve | `dependance_bloc_3` — suit D-40 | la revue reste vide |
| **A-5** | Trancher D-39 et D-40 — répondre par exemple « D-39 a, D-40 a » | `manuelle_utilisateur` | neuve | `decision` — engager un chantier et choisir ce qui se tranche vous reviennent | (c) s'applique aux 2 |

## 9. Traces

- Juge de fin de tour et sa recette : `oracles/hook-restitution.mjs`, `oracles/hook-restitution.test.mjs`.
- Revue hebdomadaire : `todo/revue-hebdo.mjs`, rappel dans `oracles/hook-ouverture.mjs`, mode opératoire dans `references/TODO-FORGE.md`.
- Consigne du niveau Simple : `references/NIVEAUX.md`.
- Registre : `todo/TODO.jsonl`, candidature TF-1541.
- Étude complétée : `output/03-etudes/20261001-etude-opportunite-rsi-et-ssl.md`, étape 2 reliée à la revue.
- Mémoire de session : `reponse-affichee-deux-fois.md`, avec sa ligne d'index.
- Commit local `6e920d7a` ; rien n'est poussé.
