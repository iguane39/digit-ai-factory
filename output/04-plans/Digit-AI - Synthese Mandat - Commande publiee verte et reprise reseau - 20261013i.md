---
destinataire: humain
---

# Synthèse Mandat — commande d'installation publiée et verte sur poste neuf, reprise réseau ajoutée (13/10/2026)

## 0. Synthèse d'ouverture

La commande d'installation corrigée est en ligne. Jouée telle quelle depuis l'adresse publique sur un poste neuf, sans node, sans git et sans identifiants, elle finit sur « FACTORY DIGIT-AI OPÉRATIONNELLE », 8 contrôles sur 8. Un développeur qui donne l'adresse du dépôt à son agent obtient donc maintenant une installation sans question. Un premier passage avait échoué sur une coupure réseau d'une seconde ; l'installateur retente désormais une fois dans ce cas. Cette dernière amélioration attend votre accord pour être publiée.

## 1. En-tête d'identification

- **quoi** — exécution de votre réponse « 2a » : publication de la commande Windows corrigée, puis mesure de cette commande depuis l'adresse publique sur un poste neuf.
- **sur quoi** — pilot `digit-ai-factory`, publié jusqu'à `efb3c06a` ; reprise réseau `03cc4af5` enregistrée, non publiée.
- **quand** — 2026-10-13, de 19:28 à 19:40 UTC+02:00 (Europe/Paris), heures relevées par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `git push`, `git fetch`, `curl`, la commande documentée lancée par `cmd`, `scripts/installer-projet.test.mjs`, `oracles/lib-baseline-recettes.test.mjs`.
- **intention** — qu'un développeur qui ne connaît que l'adresse du dépôt obtienne la factory installée sur son projet, sans question, avec une fin claire. **Test rétro** : servie, mesurée par la commande publiée elle-même sur poste neuf ; seule la reprise réseau reste à publier (D-3).

## 2. Verdict en une ligne

**TENU — commande publiée jouée depuis l'adresse publique sur poste neuf : « FACTORY DIGIT-AI OPÉRATIONNELLE », 8/8 contrôles verts, exit 0, 0 erreur `iex` ; recette `installer-projet` 21/21, sens rouge joué.**

## 3. Décisions attendues de l'humain

Le seul bloquant qui retient la suite, ce qui le lève, et ce qui se passe sinon :

- la publication de la reprise réseau : votre décision D-3 ; sans elle, une coupure réseau passagère pendant l'installation d'un développeur finit encore sur « INSTALLATION INCOMPLÈTE », et son agent doit relancer.

> **D-3 — Publiez-vous l'enregistrement `03cc4af5` du pilot `digit-ai-factory`, la seconde tentative du bootstrap sur coupure réseau ?**
>
> Rappel du sujet : à 19:38, la commande publiée a fini « INSTALLATION INCOMPLÈTE » sur « Empty reply from server » au clonage d'un dépôt privé ; les 3 sondes suivantes ont rendu le refus d'accès normal. `scripts/installer-projet.mjs` retente désormais le bootstrap une fois quand l'échec porte une signature réseau. C'est le seul enregistrement local non publié.
>
> **Recommandation : publier maintenant.** Source consultée : `git log --oneline origin/main..HEAD`, qui ne liste que `03cc4af5`, et la recette 21/21 qui prouve qu'un refus d'accès ne déclenche pas la reprise.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier `03cc4af5` maintenant | complexité faible · durée courte | aucune |
| (b) ne pas publier | aucun | une coupure réseau d'une seconde fait relancer l'installation |

> **Si rien n'est décidé** : la seconde option par défaut, l'enregistrement reste local.

## 4. Traité — avec sa preuve

Ce tour a constaté la publication, mesuré la commande publiée, et rendu l'installateur tolérant aux coupures réseau.

- **Publication de « 2a »** : mon envoi de `61a21c63` a été refusé parce qu'une autre session publiait au même instant ; GitHub porte depuis `22cee592` et `61a21c63`.
  - preuve : `git push` → « cannot lock ref 'refs/heads/main': is at efb3c06a » ; `git branch -r --contains` → `origin/main` pour les 2 ; `curl` de `AGENTS.md` et `installer.ps1` publiés → la nouvelle commande, 1 occurrence chacun.
- **Commande publiée mesurée sur poste neuf** : pilot cloné depuis GitHub par MinGit, le git portable de Git for Windows, sans node ni git au départ, configuration Claude isolée.
  - preuve : rejeu de 19:39 → « Poste prêt », « 8/8 contrôle(s) exécuté(s) verts », bannière d'opérationnalité, `EXIT=0`, 0 erreur « chaîne vide ».
- **Coupure réseau passagère** : le premier passage de 19:38 a fini « INSTALLATION INCOMPLÈTE » sur « Empty reply from server ».
  - preuve : `git ls-remote` des 2 dépôts privés joué 3 fois dans le même environnement → exit 128, « could not read Username », le refus d'accès que le bootstrap compte en avertissement.
- **Seconde tentative du bootstrap** sur signature réseau, une seule, dans `scripts/installer-projet.mjs`.
  - preuve : recette 21/21 avec 4 cas neufs, dont 2 qui vérifient qu'un refus d'accès et un dépôt divergé ne la déclenchent pas ; sens rouge joué, la signature « Empty reply » retirée rend 20/21, fichier restauré à l'identique ; cliquet des recettes passé de 17 à 21 cas, `oracles/lib-baseline-recettes.test.mjs` 25 PASS.
- **Enregistrement** `03cc4af5` (3 fichiers).
  - preuve : `git commit --only`, exit 0.

## 5. Non traité — avec son motif

- La publication de `03cc4af5` — motif : `dependance_bloc_3`, publication sur un service hébergé (D-3).
- `installer.sh` joué sous Linux — motif : `borne_atteinte` ; 2 voies essayées plus tôt dans la session : `wsl -l -q` ne liste que la distribution interne `docker-desktop`, `docker version` rend « failed to connect to the docker API ».

## 6. Écarts à la lettre

- **Vous avez répondu** « 2a », publier les 2 enregistrements → **ils sont en ligne, mais par l'envoi d'une autre session** → **pourquoi** : elle a publié toute la branche au même instant ; mon envoi limité à `61a21c63` a été refusé par GitHub, sans effet.

## 7. Risques

- La reprise réseau n'est pas en ligne tant que D-3 n'est pas tranchée.
  - signal : un développeur rapporte « INSTALLATION INCOMPLÈTE » avec « Empty reply from server » ou « Failed to connect » ;
  - parade : relancer la même commande, qui est idempotente ; ou publier `03cc4af5`.
- `installer.sh` n'a jamais été exécuté.
  - signal : un développeur sous macOS ou Linux rapporte une erreur du script ;
  - parade : le jouer dès qu'un poste Linux ou le démon Docker est disponible.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier `03cc4af5` avec votre feu vert cité au contrôle de publication | `auto_ia` | TF-1637 | `dependance_bloc_3` — D-3 | une coupure réseau fait relancer l'installation |
| **A-2** | Jouer `installer.sh` dans un conteneur Linux vierge dès que le démon Docker tourne | `auto_ia` | TF-1637 | `dependance_externe` — `docker version` → « failed to connect to the docker API » | la voie macOS et Linux reste non mesurée |
| **A-3** | Répondre à D-3 | `manuelle_utilisateur` | TF-1637 | `decision` | l'enregistrement reste local |

## 9. Traces

`scripts/installer-projet.mjs`, `scripts/installer-projet.test.mjs`, `oracles/baseline-recettes.json`, commits `61a21c63` (publié) et `03cc4af5` (local).
