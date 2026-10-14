---
destinataire: humain
---

# Synthèse Mandat — correctif d'ouverture arrêté sur une base qui a bougé, 2 candidatures ingérées, durée du hook mesurée à 73 secondes (13/10/2026)

## 0. Synthèse d'ouverture

Le correctif d'urgence qui devait rendre l'ouverture des sessions plus rapide n'est pas appliqué. Le prompt demandait de s'arrêter si sa base avait bougé, et c'est le cas : 3 des 4 fichiers ont été modifiés cet après-midi. Les 2 candidatures du lot sont au registre, en attente d'arbitrage. La mesure faite sur ce poste confirme le défaut : le relevé d'ouverture prend 73 secondes, au-delà des 60 que tolère l'extension VS Code. Sa sortie fait 19 Ko, et cette session même n'en a reçu qu'un aperçu de 2 Ko, sans les règles de fin de tour. 2 décisions vous reviennent : adapter le correctif à la base actuelle, et publier le commit local.

## 1. En-tête d'identification

- **quoi** — votre demande de suivre le prompt du lot `Digit-AI - Correctif Factory - Ouverture de session sous le delai client - 20261013b.zip`.
- **sur quoi** — pilot `digit-ai-factory`, de `f381339e` au commit `eb4bedca`, non publié.
- **quand** — 2026-10-13, de 16:05 à 16:12 UTC+02:00 (Europe/Paris), heures relevées par `date` et au transcript.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `git apply --check`, `todo/ingerer-lot.mjs`, `todo/oracle-todo.mjs`, `todo/journaliser.mjs`, `oracles/hook-ouverture.mjs` chronométré.
- **intention** — que les sessions de la factory s'ouvrent dans l'extension VS Code avec leurs règles de fin de tour sous les yeux de l'assistant. **Test rétro** : non servie pour l'instant. Le défaut est mesuré et inscrit au registre, mais l'ouverture échoue toujours tant que le correctif n'est pas adapté (D-1).

## 2. Verdict en une ligne

**PARTIEL — correctif arrêté (`git apply --check` exit 1 sur 2 fichiers), 2 candidatures ingérées (TF-1635, TF-1636), `oracle-todo` PASS, hook d'ouverture mesuré à 73 531 ms et 18 949 octets.**

## 3. Décisions attendues de l'humain

Les 2 bloquants qui retiennent la suite, ce qui les lève, et ce qui se passe sinon :

- l'application du correctif d'ouverture : votre décision D-1 ; sans elle, l'extension VS Code continue de couper l'ouverture des sessions du pilot à 60 secondes.
- la publication du commit `eb4bedca` : votre décision D-2 ; sans elle, l'autre poste peut frapper les mêmes numéros de registre.

> **D-1 — Adaptez-vous le correctif `Digit-AI - Correctif Factory - Ouverture asynchrone et contexte JSON - 20261013b.patch` à la base actuelle `f381339e` du pilot ?**
>
> Rappel du sujet : le prompt du lot demande de s'arrêter si `oracles/hook-ouverture.mjs`, `oracles/hook-ouverture.test.mjs` ou les 2 fichiers de réglages ont bougé depuis `5ecdee3`. Trois ont bougé, par 5 commits du 13/10, et le patch refuse de s'appliquer sur les 2 fichiers de code.
>
> **Recommandation : (a).** Source consultée : `git diff 5ecdee3 HEAD` sur les 4 fichiers. L'écart ne touche que le voisinage du patch. Une ligne `ligneCrochetReadme()` a été ajoutée avant la fin du relevé, 3 cas de recette ont été ajoutés en fin de test, et un crochet `droits-accordes` a été ajouté plus bas dans `gabarits/settings-produit.json`. Aucune ligne que le patch modifie n'a changé.

| Option | Coût | Exclusions |
|---|---|---|
| (a) la session reporte le patch sur `f381339e`, puis joue les étapes 2 à 5 et 7 du prompt (recette, self-tests comparés, mesure, commit local) | complexité faible · durée courte | le test dans l'extension VS Code reste à votre main |
| (b) la session claude.ai qui l'a écrit le régénère sur `f381339e` | complexité faible · durée moyenne | l'ouverture reste en échec d'ici là |
| (c) laisser le correctif de côté et attendre la vraie correction portée par la candidature d'ouverture | complexité forte · durée longue | exclut tout palliatif à court terme |

> **Si rien n'est décidé** : (c) par défaut — le correctif reste de côté et l'ouverture continue d'échouer dans l'extension.

> **D-2 — Publiez-vous le commit `eb4bedca` du pilot `digit-ai-factory` ?**
>
> Rappel du sujet : le commit ajoute le sidecar `input/01-candidatures/ouverture-de-session-sous-le-delai-du-client-20261013b.tf.jsonl` et 4 lignes à `todo/TODO.jsonl`. Le prompt interdit de pousser sans votre accord, et le pilot a déjà 34 commits locaux non publiés.
>
> **Recommandation : (a).** Source consultée : le relevé `git status -sb`, qui dit « ahead 35 » après ce commit ; le demandeur nommé dans le sidecar figure déjà 250 fois au registre publié.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier maintenant, avec votre feu vert cité | complexité faible · durée courte | aucune |
| (b) publier avec le correctif, une fois D-1 tranchée | complexité faible · durée courte | le registre reste local d'ici là |

> **Si rien n'est décidé** : (b) par défaut — le commit reste local jusqu'au prochain tour.

## 4. Traité — avec sa preuve

Ce tour a fait ce que le prompt permettait sans le correctif : la vérification de base, l'ingestion et la mesure du poste.

- **Vérification de la base du correctif** : `HEAD` descend bien de `5ecdee3`, mais 3 des 4 fichiers ont bougé.
  - preuve : `git merge-base --is-ancestor` exit 0 ; `git log 5ecdee3..HEAD` sur les fichiers ; `git apply --check` → « patch does not apply » sur `oracles/hook-ouverture.mjs` et `oracles/hook-ouverture.test.mjs`, exit 1.
- **Ingestion des 2 candidatures** : TF-1635 (l'ouverture dépend d'un hook synchrone sans borne de durée) et TF-1636 (une sortie de hook au-delà de 10 Ko est tronquée), au statut candidat.
  - preuve : « [OK] 2 candidature(s) ingérée(s) en CANDIDAT (lot fe8cdb187a1a) », exit 0 ; rejeu « [DÉJÀ INGÉRÉ] … 0 création (idempotence) » ; `oracle-todo` PASS sur les chemins positionnels.
- **Mesure du hook d'ouverture sur ce poste**, que la candidature d'ouverture déclarait non mesurée : 73 531 ms, exit 0, pour une sortie de 18 949 octets où la section des gates de session est à la ligne 98.
  - preuve : `node oracles/hook-ouverture.mjs` chronométré par `date +%s%3N` ; `wc -c` et `grep -n` sur la sortie ; à l'ouverture de cette session, le harnais a rendu « Output too large (18KB) » avec un aperçu de 2 Ko.
- **Mesures consignées au registre** sur TF-1635 et TF-1636, par 2 événements de mise à jour.
  - preuve : `journaliser.mjs` → verdict PASS avant et après écriture.
- **Commit local** `eb4bedca`, limité au sidecar, aux 2 index du dossier d'entrée et au registre.
  - preuve : `git commit --only`, exit 0 ; les fichiers modifiés avant ce tour restent hors du commit.

## 5. Non traité — avec son motif

- Les étapes 2 à 7 du correctif (application, recette, self-tests, mesure après correctif, test dans l'extension, commit) — motif : `dependance_bloc_3`, base modifiée, arrêt prescrit par le prompt (D-1).
- La publication du commit — motif : `dependance_bloc_3`, publication soumise à votre accord (D-2).
- La propagation du gabarit corrigé aux produits, qui portent une copie de leurs réglages — motif : `hors_mandat`, le prompt la laisse à l'héritage.

## 6. Écarts à la lettre

- **Le prompt demandait** de décompresser le zip à la racine du dépôt → **j'ai décompressé dans le dossier temporaire de la session** et copié le seul sidecar dans `input/01-candidatures/` → **pourquoi** : le patch n'avait rien à faire à la racine du dépôt, et une archive entrante se lit hors du dépôt.
- **Le prompt ne demandait pas** de consigner la mesure du poste au registre → **je l'ai fait** → **pourquoi** : la candidature d'ouverture disait cette durée non mesurée, et la session a mesuré 73 secondes.

## 7. Risques

- Le palliatif, une fois appliqué, rend le relevé d'ouverture asynchrone : il peut arriver après le premier échange, et les premiers gestes se font alors sur l'état d'avant le tirage du dépôt distant.
  - signal : un en-tête « hook SessionStart asynchrone » reçu après une première réponse ;
  - parade : la correction de fond portée par TF-1635.
- Les produits existants gardent leur copie des réglages, avec le hook synchrone : ils peuvent échouer de la même façon dans l'extension.
  - signal : le même message « Subprocess initialization did not complete within 60000ms » chez un produit ;
  - parade : la propagation par l'héritage, geste humain.
- La sortie du relevé a presque doublé depuis la mesure du 12/10 (10 777 puis 18 949 octets) : le plafond de la forme JSON n'est pas mesuré.
  - signal : la recette de TF-1636 qui demande à l'assistant de citer la dernière section reçue ;
  - parade : sortir l'historique des versions du relevé, comme le propose TF-1636.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Reporter le patch sur `f381339e`, jouer la recette et les self-tests comparés, remesurer, commit local | `auto_ia` | TF-1635 | `dependance_bloc_3` — D-1 | l'ouverture échoue toujours dans l'extension |
| **A-2** | Publier les commits locaux du pilot avec votre feu vert cité | `auto_ia` | `neuve` | `dependance_bloc_3` — D-2 | le registre reste local |
| **A-3** | Ouvrir une session du pilot dans l'extension VS Code après le correctif, puis demander à l'assistant, sans outil, s'il voit la section des gates de session | `manuelle_utilisateur` | TF-1635 | `presence` — tentative mesurée : `code --list-extensions` voit `anthropic.claude-code`, mais aucune commande de la CLI n'ouvre son panneau de discussion, seule cible du test | le correctif n'est pas prouvé dans le client |
| **A-4** | Répondre à D-1 et D-2 | `manuelle_utilisateur` | `neuve` | `decision` | les 2 bloquants restent en place |

## 9. Traces

`todo/TODO.jsonl` (TF-1635, TF-1636), `input/01-candidatures/ouverture-de-session-sous-le-delai-du-client-20261013b.tf.jsonl`, commit `eb4bedca`.
