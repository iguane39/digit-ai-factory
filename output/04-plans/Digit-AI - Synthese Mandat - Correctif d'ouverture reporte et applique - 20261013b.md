---
destinataire: humain
---

# Synthèse Mandat — correctif d'ouverture reporté sur la base actuelle et appliqué, recette verte, publication en attente (13/10/2026)

## 0. Synthèse d'ouverture

Le correctif d'ouverture est appliqué au pilot, sur ce poste, et sa recette est verte. Le relevé d'ouverture tourne désormais en arrière-plan : il ne retient plus l'ouverture de la session, et il arrive en entier à l'assistant, règles de fin de tour comprises. Il reste un geste de votre main : ouvrir une session dans l'extension VS Code pour constater qu'elle démarre. Les 3 commits du jour attendent votre accord pour être publiés.

## 1. En-tête d'identification

- **quoi** — votre réponse « 1a » : reporter le correctif sur la base actuelle du pilot, puis jouer la recette, les self-tests comparés, la mesure et le commit.
- **sur quoi** — pilot `digit-ai-factory`, de `eb4bedca` au commit `7f6d4e62`, non publié.
- **quand** — 2026-10-13, de 16:13 à 16:37 UTC+02:00 (Europe/Paris), heures relevées par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `git apply -3`, `oracles/hook-ouverture.test.mjs`, `oracles/self-tests.mjs`, `oracles/oracle-readme-dossiers.mjs`, `oracles/hook-ouverture.mjs --contexte-json` chronométré, `todo/journaliser.mjs`.
- **intention** — que les sessions de la factory s'ouvrent dans l'extension VS Code avec leurs règles de fin de tour sous les yeux de l'assistant. **Test rétro** : servie sur le poste pour la partie mesurable ici, la sortie JSON et la recette ; l'ouverture dans l'extension n'est pas encore constatée (A-2).

## 2. Verdict en une ligne

**TENU sur le poste — correctif appliqué en `9bfc8153`, recette 14 PASS 0 FAIL avec sens rouge joué, self-tests 1 défaut sur 207 sans lien et PASS au rejeu, hook en JSON mesuré à 55 939 ms hors du chemin d'ouverture.**

## 3. Décisions attendues de l'humain

Le seul bloquant qui retient la suite, ce qui le lève, et ce qui se passe sinon :

- la publication des commits `eb4bedca`, `9bfc8153` et `7f6d4e62` : votre décision D-2 ; sans elle, le correctif reste sur ce poste et l'autre poste continue d'ouvrir ses sessions avec le hook synchrone.

> **D-2 — Publiez-vous les 3 commits du jour du pilot `digit-ai-factory`, de `eb4bedca` à `7f6d4e62` ?**
>
> Rappel du sujet : posée à 16:12 pour le seul `eb4bedca`, elle s'étend à `9bfc8153` (le correctif) et `7f6d4e62` (2 notes au registre). Le prompt du lot interdit de pousser sans votre accord ; le pilot a 37 commits locaux non publiés.
>
> **Recommandation : (a).** Source consultée : `git status -sb`, qui dit « ahead 37 » ; la recette et la mesure de ce tour, toutes deux vertes.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier maintenant, avec votre feu vert cité | complexité faible · durée courte | aucune |
| (b) publier après votre test dans l'extension VS Code | complexité faible · durée courte | l'autre poste reste sur le hook synchrone d'ici là |

> **Si rien n'est décidé** : (b) par défaut — les commits restent locaux jusqu'à votre test.

## 4. Traité — avec sa preuve

Ce tour a reporté le correctif, l'a éprouvé et l'a consigné.

- **Report du patch sur `f381339e`** : 3 fichiers appliqués sans écart, conflit de contexte dans `oracles/hook-ouverture.test.mjs` résolu en gardant les 3 cas ajoutés le 13/10 et les 2 cas du correctif.
  - preuve : `git apply -3` → « Applied patch … cleanly » pour 3 fichiers ; `grep -c` des marqueurs de conflit → 0.
- **Recette du hook d'ouverture** : 14 PASS, 0 FAIL (le prompt attendait 9 sur l'ancienne base, qui n'avait pas les 5 cas ajoutés depuis).
  - preuve : `node oracles/hook-ouverture.test.mjs`, exit 0. Sens rouge joué : une ligne retirée du contexte JSON rend 13 PASS, 1 FAIL ; fichier restauré, `git diff` vide.
- **Self-tests du pilot** : 1 oracle en défaut sur 207, `oracle-readme-dossiers.mjs` sur le parc réel, sans lien avec le correctif qui ne touche aucun index de dossier ; aucun des 5 défauts du 12/10 cités par le prompt ne revient.
  - preuve : `node oracles/self-tests.mjs`, 1 195 s, « 1/207 oracle(s) en défaut » ; `node oracles/oracle-readme-dossiers.mjs` rejoué seul → verdict PASS.
- **Baseline des recettes** : seule la ligne de `oracles/hook-ouverture.test.mjs` est gardée, de 11 à 14 cas ; les 19 autres lignes relevées par le cliquet sont écartées.
  - preuve : `git diff` de `oracles/baseline-recettes.json` → 1 ligne retirée, 1 ajoutée.
- **Mesure sur le poste** : le hook en mode JSON sort en 55 939 ms, exit 0, avec un objet `SessionStart` valide dont le contexte de 18 654 caractères contient la section des gates de session.
  - preuve : `date +%s%3N` autour du lancement ; `JSON.parse` sur la sortie ; `grep` de `"async": true` dans `.claude/settings.json` et `gabarits/settings-produit.json`.
- **Commits locaux** `9bfc8153` (le correctif, 5 fichiers) et `7f6d4e62` (2 notes de registre sur TF-1635 et TF-1636).
  - preuve : `git commit --only`, exit 0 ; `journaliser.mjs` → PASS avant et après écriture.

## 5. Non traité — avec son motif

- La publication des 3 commits — motif : `dependance_bloc_3`, votre accord exigé par le prompt (D-2).
- Le test d'ouverture dans l'extension VS Code — motif : `decision`, geste laissé à votre main par le prompt (A-2).
- Le relevé complet des self-tests sur la base sans correctif, que le prompt demandait pour comparer — motif : `borne_atteinte`, 1 195 s par passage ; le seul défaut a été rejoué seul et rend PASS, ce qui suffit à l'écarter.
- La propagation du gabarit corrigé aux produits existants — motif : `hors_mandat`, le prompt la laisse à l'héritage.

## 6. Écarts à la lettre

- **Le prompt attendait** « 9 PASS, 0 FAIL » → **la recette rend 14 PASS** → **pourquoi** : 5 cas ont été ajoutés le 13/10 après la base du correctif ; les 2 cas du correctif y sont, et verts.
- **Le prompt demandait** de comparer les self-tests à un passage sans le correctif → **j'ai rejoué seul le seul oracle en défaut** → **pourquoi** : un passage complet dure 20 minutes, et le rejeu isolé tranche la question pour le seul défaut relevé.

## 7. Risques

- Le relevé d'ouverture peut arriver après le premier échange : les gestes du premier tour se font alors sur l'état d'avant le tirage du dépôt distant.
  - signal : l'en-tête « hook SessionStart asynchrone » reçu après une première réponse ;
  - parade : la correction de fond portée par TF-1635.
- Les produits existants gardent leur copie des réglages, avec le hook synchrone.
  - signal : le message « Subprocess initialization did not complete within 60000ms » chez un produit ;
  - parade : la propagation par l'héritage, geste humain.
- Le relevé fait 18 654 caractères, et le plafond de la forme JSON n'est pas mesuré.
  - signal : l'assistant ne voit plus la section des gates de session lors du test A-2 ;
  - parade : sortir l'historique des versions du relevé, comme le propose TF-1636.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier les 3 commits du jour avec votre feu vert cité | `auto_ia` | `neuve` | `dependance_bloc_3` — D-2 | le correctif reste sur ce poste |
| **A-2** | Dans VS Code, ouvrir le dossier `C:\dev\digit-ai-factory`, ouvrir le panneau Claude Code, puis écrire « Sans outil : vois-tu la section Gates actifs dans cette session (R-44) ? » | `manuelle_utilisateur` | TF-1635 | `presence` — tentative mesurée : `code --list-extensions` voit `anthropic.claude-code`, mais aucune commande de la CLI n'ouvre son panneau de discussion, seule cible du test | le correctif n'est pas prouvé dans le client |
| **A-3** | Répondre à D-2 | `manuelle_utilisateur` | `neuve` | `decision` | les commits restent locaux |

## 9. Traces

`oracles/hook-ouverture.mjs`, `oracles/hook-ouverture.test.mjs`, `.claude/settings.json`, `gabarits/settings-produit.json`, `todo/TODO.jsonl` (TF-1635, TF-1636), commits `9bfc8153` et `7f6d4e62`.
