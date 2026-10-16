---
destinataire: humain
---

# Synthèse Mandat — installation de la factory sans question, avec une bannière finale d'opérationnalité (13/10/2026)

## 0. Synthèse d'ouverture

Le développeur a reçu ces questions parce que nos propres consignes les prescrivaient. Son poste n'avait pas node, et la première étape de l'installation était un programme node : sans node, il ne démarre même pas pour signaler le manque. Nos prompts demandaient en plus de lister les outils manquants puis d'attendre une confirmation, et ils citaient trois outils dont l'installation n'a pas besoin. L'installation tient désormais en une commande qui pose elle-même ce qui manque, sans droit d'administrateur, installe le projet sans rien modifier, et finit sur « FACTORY DIGIT-AI OPÉRATIONNELLE » quand 8 contrôles exécutés sont verts. Le correctif est prouvé sur un poste simulé sans node, sans git et sans identifiants. Il reste votre accord pour publier le pilot, car le développeur télécharge l'installateur depuis GitHub.

## 1. En-tête d'identification

- **quoi** — mandat : expliquer les questions posées à un développeur tiers, puis rendre l'installation de la factory et des forges muette jusqu'à une fin explicite.
- **sur quoi** — pilot `digit-ai-factory` (commit `b6e66279`, non publié) et `digit-ai-forge-agents` (commit `91c6830`, publié).
- **quand** — 2026-10-13, de 16:46 à 17:02 UTC+02:00 (Europe/Paris), heures relevées par `stat` sur la capture reçue et par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `installer.ps1` sur un poste simulé, `scripts/installer-projet.test.mjs`, `scripts/readme-dossiers.test.mjs`, `scripts/adopter-projet-existant.test.mjs`, `oracles/oracle-chemin-prescrit.mjs`, `todo/journaliser.mjs`.
- **intention** — qu'un développeur qui écrit « Utilise https://github.com/iguane39/digit-ai-factory pour ce projet » obtienne une factory installée sur son projet, sans question, et sache clairement qu'elle est prête. **Test rétro** : servie sur le poste simulé, où la commande finit sur la bannière d'opérationnalité ; elle ne le sera chez le développeur qu'après publication du pilot (D-1).

## 2. Verdict en une ligne

**TENU sur poste simulé — `installer.ps1` pose MinGit (git portable de Git for Windows) et node v24.21.0 sans droit admin, puis rend « FACTORY DIGIT-AI OPÉRATIONNELLE », 8 contrôles sur 8 verts, exit 0 ; recettes `installer-projet` 17/17 et `readme-dossiers` 28/28, sens rouge joué.**

## 3. Décisions attendues de l'humain

Le seul bloquant qui retient la suite, ce qui le lève, et ce qui se passe sinon :

- la publication du pilot, qui porte l'installateur : votre décision D-1 ; sans elle, l'adresse que lit l'agent du développeur ne contient pas `installer.ps1`, et la prochaine session chez lui posera les mêmes questions.

> **D-1 — Publiez-vous le pilot `digit-ai-factory` jusqu'au commit `b6e66279`, soit 39 commits locaux ?**
>
> Rappel du sujet : l'agent du développeur lit `AGENTS.md` et télécharge `installer.ps1` sur GitHub ; tant que le pilot n'est pas publié, rien ne change chez lui. Les 39 commits portent aussi le travail des autres sessions du jour, dont le commit `10d7d389` qui rend non bloquants les dépôts privés inaccessibles, nécessaire au même développeur, et les 3 commits que votre décision D-2 de 16:12 attend encore.
>
> **Recommandation : publier maintenant.** Source consultée : `git status -sb`, qui dit « ahead 39 », et le troisième passage sur le poste simulé, vert sur l'état enregistré `b6e66279`.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier maintenant les 39 commits, votre feu vert cité au contrôle de publication | complexité faible · durée courte | aucune |
| (b) publier après votre propre essai sur un poste neuf | complexité faible · durée moyenne | le développeur reste bloqué d'ici là |

> **Si rien n'est décidé** : la seconde option par défaut, les commits restent locaux.

## 4. Traité — avec sa preuve

Ce tour a trouvé 3 causes, les a corrigées à la source, puis a prouvé le résultat sur un poste simulé.

- **Cause 1, node absent** : la phase d'installation commençait par `node bootstrap.mjs`, et aucune consigne ne disait quoi faire sans node ; l'agent a improvisé la question « portable, winget ou vous ? ».
  - preuve : lecture de `AGENTS.md` au commit `7f6d4e62`, dont la seule commande d'installation est `node bootstrap.mjs --pull`.
- **Cause 2, consignes qui demandaient d'attendre** : `PROMPT-PRODUIT.md` et `PROMPT-PRODUIT-EXISTANT.md` disaient « s'il en manque, liste-les […] puis attends que je confirme » et citaient gh, uv et python ; le skill d'accueil disait « attendre l'accord avant d'installer quoi que ce soit ».
  - preuve : `grep` de « attends que je confirme » dans les 2 prompts avant correction ; `bootstrap.mjs` n'exige que git et node.
- **Cause 3, un poste tiers ne pouvait jamais être déclaré prêt** : les 2 dépôts privés du propriétaire et le hook de publication absent d'un clone neuf du pilot rendaient « Poste NON prêt — 4 défaut(s) ».
  - preuve : premier passage sur le poste simulé, sortie relevée ; le remède « gh auth status » explique le « gh » de la question.
- **Installateur** `installer.ps1` et `installer.sh` à la racine du pilot : git et node posés en portée utilisateur, uv par son installateur officiel, pilot localisé ou cloné, aucune fenêtre d'identifiants.
  - preuve : sur le poste simulé, « [pose] git absent : MinGit portable » puis « [pose] node >= 18 absent : node v24.21.0 LTS portable », et `Parser::ParseFile` → 0 erreur.
- **Fin d'installation explicite** `scripts/installer-projet.mjs` : bootstrap, pose automatique du hook de publication du pilot, adoption non destructive du projet, puis la bannière « FACTORY DIGIT-AI OPÉRATIONNELLE — prête à être utilisée sur ce projet » ou « INSTALLATION INCOMPLÈTE » avec un remède par contrôle rouge.
  - preuve : recette `scripts/installer-projet.test.mjs` 17/17 ; sens rouge joué, une bannière verte sans bootstrap rend 14/17 et exit 1, fichier restauré.
- **Rôle des dossiers d'entrants et de livrables d'un produit** posé d'office, au lieu d'un rôle vide en défaut ; le rôle du pilot n'y entre toujours pas.
  - preuve : `scripts/readme-dossiers.test.mjs` 28/28, cas ajusté ; mutation qui retire ce rôle → exit 1, fichier restauré à l'identique.
- **Consignes réécrites** : `AGENTS.md`, `README.md`, les 2 prompts canoniques, `references/ACCUEIL.md` et le skill `accueil-factory` 1.1.0 disent « aucune question à l'installation, l'intention se demande après la bannière ».
  - preuve : `oracles/oracle-chemin-prescrit.mjs` PASS sur ses règles de chemins prescrits ; `scripts/adopter-projet-existant.test.mjs` 30 PASS.
- **Preuve de bout en bout** : `installer.ps1` joué sur un poste simulé sans node, sans git, sans identifiants git et avec une configuration Claude isolée, 13 forges clonées depuis GitHub.
  - preuve : troisième passage, « Poste prêt », « 8/8 contrôle(s) exécuté(s) verts », bannière d'opérationnalité, `EXIT=0`.
- **Enregistrement** : pilot `b6e66279` (12 fichiers, le registre limité à mes 2 lignes), forge-agents `91c6830` publié.
  - preuve : `git push` → « dd59d44..91c6830 main -> main », `git rev-list --count origin/main..main` → 0 ; `journaliser.mjs` → PASS avant et après.

Bannière rendue par le troisième passage, telle quelle :

```
════════════════════════════════════════════════════════════════════════
  FACTORY DIGIT-AI OPÉRATIONNELLE — prête à être utilisée sur ce projet
════════════════════════════════════════════════════════════════════════
  ✓ poste (bootstrap --pull) : Poste prêt : pilot et forges présents et à jour, skills alignés
  ✓ forges : 13/13 présentes
  ✓ skills : 28 installé(s), dont l'accueil de la factory
  ✓ adoption du projet : ADOPTE · 26 élément(s) posé(s)
  ✓ README d'input\ et output\ : présents, rôles rédigés
  ✓ dépôt git local : présent, sans dépôt distant ajouté
  ✓ hameçons du projet : .claude/settings.json câblé sur forge/hooks/factory.mjs, CLAUDE.md posé
  ✓ pilot trouvable aux sessions suivantes
  8/8 contrôle(s) exécuté(s) verts.

  Les hameçons du projet s'activent à la prochaine ouverture de session Claude Code dans ce dossier.
  Pour commencer, dites ce que vous voulez obtenir, par exemple :
    « crée un site de réservation » · « fais évoluer ce produit » · « teste ce projet de bout en bout »
```

## 5. Non traité — avec son motif

- La publication du pilot, et le passage par l'adresse publiée sur le poste simulé qui en dépend — motif : `dependance_bloc_3`, publication sur un service hébergé (D-1).
- `installer.sh` joué sous Linux — motif : `borne_atteinte` ; 2 voies essayées : `wsl -l -q` ne liste que la distribution interne `docker-desktop`, et `docker version` rend « failed to connect to the docker API » (démon arrêté). Le script suit le contrat de `installer.ps1`, sans exécution.
- Les modifications non enregistrées d'une autre session dans le pilot (hook d'ouverture, contrat d'héritage, cliquet des recettes) — motif : `hors_mandat`, laissées telles quelles dans l'arbre de travail.

## 6. Écarts à la lettre

- **La demande disait** « sans avoir à lui poser des questions de ce type » → **l'installation n'en pose aucune, mais l'accueil demande encore l'intention après la bannière, et l'accord avant de lancer un run** → **pourquoi** : choisir ce qu'on construit reste une décision du développeur ; seule l'installation est muette.
- **La demande visait la factory et les forges** → **l'installateur installe aussi le projet** (socle, dépôt git local, hameçons) → **pourquoi** : « prête à être utilisée sur le projet » exige que le projet soit câblé, et l'adoption ne modifie aucun fichier existant.

## 7. Risques

- Un poste dont la stratégie d'exécution interdit les scripts PowerShell téléchargés.
  - signal : l'agent du développeur rapporte un refus d'exécution de `installer.ps1` ;
  - parade : la commande passe déjà `-ExecutionPolicy Bypass` pour ce seul processus ; sinon, cloner le pilot puis lancer le fichier local.
- Node posé pendant l'installation n'est visible des sessions suivantes qu'après réouverture de VS Code.
  - signal : un hook du projet échoue sur « node introuvable » à la session suivante ;
  - parade : la bannière le dit quand l'installateur a modifié le PATH utilisateur.
- Une autre session modifie les mêmes fichiers du pilot en ce moment.
  - signal : `git status` montre `bootstrap.mjs` ou le registre modifiés hors de ce tour ;
  - parade : enregistrement limité à mes chemins, le registre construit ligne par ligne.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier les 39 commits du pilot avec votre feu vert cité au contrôle de publication | `auto_ia` | TF-1637 | `dependance_bloc_3` — D-1 | le développeur reçoit encore les questions |
| **A-2** | Rejouer le poste simulé par l'adresse publiée, `irm https://raw.githubusercontent.com/iguane39/digit-ai-factory/main/installer.ps1 \| iex` | `auto_ia` | TF-1637 | `dependance_bloc_3` — D-1 | la voie réelle du développeur reste non mesurée |
| **A-3** | Répondre à D-1 | `manuelle_utilisateur` | TF-1637 | `decision` | les commits restent locaux |

## 9. Traces

`installer.ps1`, `installer.sh`, `scripts/installer-projet.mjs`, `scripts/installer-projet.test.mjs`, `scripts/readme-dossiers.mjs`, `AGENTS.md`, `README.md`, `PROMPT-PRODUIT.md`, `PROMPT-PRODUIT-EXISTANT.md`, `references/ACCUEIL.md`, `todo/TODO.jsonl` (TF-1637), commits `b6e66279` et `91c6830`.
