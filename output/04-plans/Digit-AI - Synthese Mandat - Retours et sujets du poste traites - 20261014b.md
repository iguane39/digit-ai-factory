---
destinataire: humain
---

# Synthèse Mandat — retours et sujets qui attendaient ce poste (14/10/2026)

## 0. Synthèse d'ouverture

Ce poste, DESKTOP-ULTRA7, était celui que plusieurs sujets du registre attendaient. 3 sujets sont clos. Le réglage de modèle du poste suit désormais le nom de famille, et son effort de réflexion est réglé sur « élevé », conformément à la table décidée le 13/10 ; l'installation sans question, vérifiée, est close aussi. Un nouveau lot de Produit-12 est arrivé ce matin : il demande que la reprise d'un produit sur un autre poste du développeur devienne automatique. La porte du pilot l'a refusé, car son unique retour propose une classe nouvelle sans la décrire. La cause est mesurée : le contrôle de remise qu'a Produit-12 sur son disque date du 03/10, et la règle qui a refusé le lot n'existe que depuis le 13/10. 3 décisions vous reviennent, dont la publication de l'enregistrement.

## 1. En-tête d'identification

- **quoi** — exécution de votre demande « Traite tous les TODOs et retours qui concernent ce poste » : boîte d'entrée, sujets du registre en attente de ce poste, réglages du poste.
- **sur quoi** — pilot `digit-ai-factory`, enregistrement local `f900813b` (non publié) ; réglages Claude du poste (`~/.claude/settings.json`) ; Produit-12 et forge-agents lus sans écriture.
- **quand** — 2026-10-14, de 11:20 à 12:10 UTC+02:00 (Europe/Paris), heure de fin relevée par `date`.
- **qui** — session de pilotage Claude Opus 5.5, sans agent ; escalade : aucune ; outils joués : `oracle-boite-entree`, `accueillir-lot`, `ingerer-lot`, `emettre-travaux --essai`, `oracle-modeles-en-service`, `journaliser`, `oracle-todo`, `installer-projet.test.mjs`.
- **intention** — que rien de ce qui dépend de ce poste ne reste bloqué faute d'y avoir été fait. **Test rétro** : servie pour les réglages, la vérification attendue et les attentes mal posées ; le lot arrivé ce matin n'entre pas au registre sans votre choix (D-1).

## 2. Verdict en une ligne

**TENU — 3 sujets clos sur contrôle vert (MS4 (réglage au nom de famille) et MS5 (effort conforme à la table) : FAIL → PASS, recette d'installation 21/21), registre PASS après 8 écritures ; 1 lot refusé à la porte, cause mesurée.**

## 3. Décisions attendues de l'humain

Chaque décision suit le même ordre : la question, le rappel du sujet, la recommandation et sa source, puis un tableau dont chaque ligne est une option, avec son coût et ce qu'elle exclut ; la ligne de repli dit ce qui s'applique sans réponse. Les 3 bloquants qui retiennent la suite, ce qui les lève, et ce qui se passe sinon :

- le lot Produit-12 du 14/10 : votre décision D-1 ; sans elle, son retour bloquant sur la reprise multi-poste reste hors du registre.
- les 2 règles perdues du socle des pages : votre décision D-2 ; sans elle, le sujet reste ouvert sans rien à faire.
- la publication de `f900813b` : votre décision D-3 ; sans elle, l'autre poste peut frapper les mêmes numéros.

> **D-1 — Comment faites-vous entrer le lot `Produit-12 - RETOURS - 20261014a`, refusé parce que son retour propose une classe nouvelle sans la décrire ?**
>
> Rappel du sujet : son unique retour, classé bloquant, demande qu'un produit dont le développeur a déclaré un dossier de reprise (Google Drive ou équivalent) se reprenne sur tous ses postes sans geste humain. La porte refuse la ligne : « classe à créer » sans clé, famille ni libellé. Cause mesurée chez le produit, en lecture seule : son contrôle de remise `forge/retours/oracle-lot.mjs` est en 1.5.0, enregistré le 03/10 et identique sur disque, alors que le pilot est en 1.7.0 depuis le 13/10 à 12:19. Le produit a donc remis avec les bons formats, mais sous un contrôle trop ancien pour lui signaler le manque ; sa copie se remettra à niveau à sa prochaine ouverture.
>
> **Recommandation : (b).** Le contenu du retour est complet et chiffré, seule sa classe manque, et le défaut vient d'une copie restée ancienne, pas du produit. Source consultée : `ingerer-lot.mjs` (motif du rejet), `oracle-lot.mjs` du produit (version 1.5.0) et `git log` du gabarit du pilot (`99516cf0`, 13/10).

| Option | Coût | Exclusions |
|---|---|---|
| (a) renvoyer le lot au produit par un lot de travaux, Produit-12 étant sur ce poste | complexité faible · durée courte | le retour attend la prochaine session du produit |
| (b) l'ingérer sous dérogation tracée, avec une classe proposée par le pilot (clé « reprise-multi-poste-manuelle »), et signaler au produit sa copie ancienne par un lot de travaux | complexité faible · durée courte | la classe est écrite par le pilot et non par le produit |
| (c) rien | aucun | le retour reste hors du registre, la boîte d'entrée reste rouge |

> **Si rien n'est décidé** : l'option (c) s'applique, le lot reste suivi dans `input/00-retours/` sans être ingéré.

> **D-2 — Que faites-vous des 2 règles du socle des pages qui n'existent plus sur aucun des 2 postes ?**
>
> Rappel du sujet : le sujet sur la collision de numéros du socle des pages attendait que ce poste vérifie si les règles « largeurs mélangées » et « doute invisible » y vivaient encore. Elles ne sont dans aucune référence des 13 forges, dans aucune copie installée des skills, ni dans les sauvegardes du 19 et du 20/09 ; l'autre poste n'avait aucun écart le 12/10. La collision est résolue, ces 2 règles sont perdues.
>
> **Recommandation : (b).** Les 2 règles n'ont plus de texte nulle part, et un défaut qu'elles auraient attrapé reviendra par un retour, que le compteur des récidives verra. Source consultée : `git log --all -S` sur les 13 forges et les sauvegardes clonées.

| Option | Coût | Exclusions |
|---|---|---|
| (a) les réécrire comme 2 candidatures neuves, à instruire | complexité moyenne · durée moyenne | leur texte d'origine est perdu, il faut les reconcevoir |
| (b) clore le sujet en déclarant la perte | complexité faible · durée courte | les 2 contrôles n'existeront pas tant qu'un retour ne les redemande pas |
| (c) rien | aucun | le sujet reste ouvert sans action possible |

> **Si rien n'est décidé** : l'option (c) s'applique, le sujet reste en attente de votre décision.

> **D-3 — Publiez-vous l'enregistrement `f900813b` du pilot `digit-ai-factory` ?**
>
> Rappel du sujet : il porte les 8 écritures au registre de ce tour et le lot Produit-12 accueilli. C'est le seul enregistrement local non publié.
>
> **Recommandation : (a).** Un registre non publié laisse l'autre poste frapper les mêmes numéros. Source consultée : `git log origin/main..HEAD`, qui ne liste que `f900813b`.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier maintenant, avec votre feu vert cité au contrôle de publication | complexité faible · durée courte (environ 9 min de contrôle avant envoi) | aucune |
| (b) attendre D-1 et D-2, puis tout publier ensemble | complexité faible · durée courte | le registre reste local d'ici là |

> **Si rien n'est décidé** : l'option (b) s'applique, l'enregistrement reste local.

## 4. Traité — avec sa preuve

Ce tour a vidé le sas, réglé le poste, fait la vérification attendue et corrigé 2 attentes fausses.

- **Lot Produit-12 du 14/10 accueilli** : nom et contenu pseudonymisés, puis note de réception posée avant l'ingestion. Elle masque 2 noms de clients du produit restés dans les titres de la section « Documents mûrs », absents des tables.
  - preuve : `accueillir-lot.mjs` → « 2 lot(s) accueilli(s), 0 refusé(s) » ; `grep -c` des 2 noms sur la copie du pilot → 0.
- **Ingestion du lot refusée**, registre intact, cause mesurée chez le produit (D-1).
  - preuve : `ingerer-lot.mjs` → « [REJET ATOMIQUE] … classe-a-creer sans classe_proposee complète » ; `oracle-lot.mjs` du produit → `VERSION = "1.5.0"`, dernier enregistrement `a2e2918` du 03/10, aucun écart sur disque.
- **Réglage de modèle du poste** au nom de famille (`opus[1m]`), sujet TF-1560 clos.
  - preuve : `oracle-modeles-en-service` → MS4 FAIL → PASS, « tous au nom de famille ».
- **Effort de réflexion du poste** à « élevé » sur les 2 entrées Opus, sujet TF-1557 clos.
  - preuve : même contrôle → MS5 FAIL (« medium », « xhigh ») → PASS, « conforme à la table ».
- **Installation sans question** vérifiée puis close (TF-1637), avec la réserve que la voie Linux et macOS n'a jamais été exécutée.
  - preuve : `installer-projet.test.mjs` → 21/21, dont 3 cas rouges ; `readme-dossiers.test.mjs` → 28 PASS.
- **Vérification attendue de ce poste** sur le socle des pages (TF-1307), décision posée (D-2).
  - preuve : `git log --all -S largeurs_melangees` → 0 résultat sur les 13 forges et sur les sauvegardes du 19 et du 20/09.
- **Attentes corrigées** de TF-1568 et TF-1601 : Produit-12 est présent sur ce poste, et son lot de travaux du 04/10, qui les porte, attend chez lui.
  - preuve : `emettre-travaux --tous --essai` localise Produit-12 ; son lot `pilot - TRAVAUX - 20261004a` porte « Statut : a_traiter ».
- **Registre** : 8 événements journalisés, vues régénérées, enregistrement `f900813b`.
  - preuve : `journaliser.mjs` → verdict avant PASS, après PASS ; `oracle-todo` → PASS.

## 5. Non traité — avec son motif

- L'ingestion du lot Produit-12 du 14/10 — motif : `dependance_bloc_3`, D-1.
- La publication de `f900813b` — motif : `dependance_bloc_3`, D-3.
- Les lots Produit-12 du 01/10 (b) et du 02/10 (a), et Produit-03 du 02/10 (e), que la boîte d'entrée compte encore comme jamais ingérés — motif : `dependance_externe`, ils sont déjà renvoyés à leur produit et attendent sa nouvelle remise ; Produit-03 n'est pas sur ce poste.
- Le dépôt de nouveaux lots de travaux à 10 produits, que l'essai d'émission proposait — motif : `hors_perimetre`, les lots du 04/10 sont encore « a_traiter » chez Produit-12 et Produit-02, et un redépôt les doublerait.
- Les 5 arborescences d'agent sous `.claude/worktrees/`, qui mettent le pilot en défaut de fraîcheur — motif : `decision`, sujet TF-1323 en attente de votre décision, et supprimer un dossier est un geste humain.
- L'ouverture de session lente et la sortie de hook tronquée (TF-1635, TF-1636), mesurées sur ce poste — motif : `decision`, la correction de fond reste à arbitrer, et aucune fiche de décision n'est écrite.

## 6. Écarts à la lettre

- **Vous avez demandé** de traiter tous les retours de ce poste → **le seul retour arrivé n'est pas entré au registre** → **pourquoi** : la porte le refuse, et compléter sa classe à la place du produit revient à vous (D-1).
- **Le sujet TF-1557 désignait** un geste humain → **je l'ai exécuté**, contrôle MS5 rejoué en PASS → **pourquoi** : c'est un réglage de ce poste, décidé le 13/10, réversible, et votre demande le couvre ; la copie d'avant est gardée hors dépôt.

## 7. Risques

- Le contrôle de remise ancien chez Produit-12 peut faire refuser son prochain lot pour la même raison.
  - signal : un lot Produit-12 rejeté sur « classe_proposee » ;
  - parade : la remise à niveau à son ouverture, ou l'option (b) de D-1.
- Le réglage « élevé » vaut pour ce poste seulement ; l'autre poste n'est pas vu par le contrôle.
  - signal : MS5 en FAIL à l'ouverture de l'autre poste ;
  - parade : le même réglage y est fait par une session de ce poste-là.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Ingérer ou renvoyer le lot Produit-12 du 14/10 selon votre choix | `auto_ia` | TF-1601 | `dependance_bloc_3` — D-1 | le retour bloquant reste dehors |
| **A-2** | Clore ou réécrire les 2 règles perdues selon votre choix | `auto_ia` | TF-1307 | `dependance_bloc_3` — D-2 | le sujet reste ouvert |
| **A-3** | Publier `f900813b` avec votre feu vert cité | `auto_ia` | TF-1560 | `dependance_bloc_3` — D-3 | le registre reste local |
| **A-4** | Répondre à D-1, D-2 et D-3 | `manuelle_utilisateur` | TF-1601 | `decision` | les 3 bloquants restent en place |

## 9. Traces

`todo/TODO.jsonl`, `input/00-retours/Produit-12 - RETOURS - 20261014a.md` et son sidecar, `~/.claude/settings.json` (copie d'avant dans le dossier temporaire de la session), enregistrement `f900813b` (local).
