---
destinataire: humain
---

# Synthèse Mandat — Actions A-1, A-3 et A-4 exécutées, la lettre de D-108 demandée (14/11/2026)

## 0. Synthèse d'ouverture

Trois de vos quatre accords sont exécutés. Le lot refusé du site public n'avait plus besoin d'être redemandé : le produit l'avait déjà remis, corrigé, et ses deux retours sont au registre. Les 15 copies de dépôts devenues inutiles sont supprimées, après vérification qu'aucune ne portait de travail non publié. Les 16 sujets neufs du registre sont triés. Pour la quatrième, votre accord vise une décision posée le 29/10, et votre message n'en cite pas la lettre : je vous la redemande ci-dessous, avec ses deux options.

Livré : [Synthèse du 14/11, actions A-1 à A-4](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Actions%20A-1%20a%20A-4%20du%2014-11%20executees%20-%2020261114c.md)

## 1. En-tête d'identification

Exécution de votre réponse « A1, A2, A3, A4 » à la synthèse 20261114b, sur le pilot `digit-ai-factory` et le poste DESKTOP-ULTRA7. Synthèse relevée le 14/11/2026 à 16:42, heure de Paris (`date`). Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : exécuter les quatre actions acceptées, jusqu'à leur preuve.

Test rétro : la synthèse sert cette intention, et pas seulement sa lettre. Trois actions sont faites et prouvées ; la quatrième attend la lettre de la décision qu'elle vise, que la préférence du porteur du 26/10 exige avant tout geste.

## 2. Verdict

3 actions exécutées sur 4 (A-1 sans objet, constaté ; A-3 et A-4 faites) ; 15 clones supprimés sur 15 ; 16 sujets décidés sur 16 ; `oracle-todo` PASS après l'écriture.

## 3. Décisions attendues

Bloquants de ce tour, chacun avec ce qui le lève :
- L'application de votre accord sur les verdicts sans mesure attend la lettre de sa décision : « 108a » ou « 108b » la lève.

Votre accord A-2 vise la décision sur les verdicts sans mesure réelle, posée le 29/10 à 19:13 : il faut sa lettre pour l'appliquer. Elle décide aussi du commit local de forge-design sous `C:\dev`, qui applique déjà l'option (b) sans l'avoir publiée.

> **D-108 — Faut-il qu'un oracle ou une mise en service ne puisse plus rendre PASS sans mesure réelle ?**
> - **De quoi s'agit-il** : l'oracle de fluidité de la forge design, qui mesure les images par seconde d'une page (`oracle-fluidite.mjs`), et la déclaration « en service » de la forge ops.
> - **Le problème** : l'oracle de fluidité a rendu PASS à 60 images par seconde pour 3,3 mesurées ; une tâche planifiée a été déclarée « en service » puis rien n'a été publié pendant 4 jours ; une capture à 390 px manquante n'a pas fait échouer le contrôle.
> - **Pourquoi vous** : c'est un point de doctrine : ce qu'un oracle a le droit d'appeler un PASS, et donc ce que les produits livrent.
> - **Recommandation : (b)** — 2 forges, un même défaut : le PASS ne repose sur aucune mesure. Source consultée : l'analyse de l'œil critique du 29/10 (lots 4 et 5), recommandation scellée dans `todo/oeil-critique-scelles.jsonl`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) | forge-ops : « en service » exige l'identifiant d'une publication lue, et une échéance dépassée alerte | environ 4 h | un enregistrement de retrait |
| (b) | comme (a), plus forge-design : l'oracle de fluidité attend la carte graphique, et une capture manquante rend FAIL ; le commit local du 29/10 est repris sur la forge à jour puis publié | environ 1 jour | un enregistrement de retrait |

> **Sans réponse** : les 2 oracles peuvent encore rendre PASS sans mesure, et forge-design reste divergée sous `C:\dev`.

## 4. Traité

- A-1, sans objet : le lot 20261114i refusé portait 2 retours que le produit a remis le même jour dans son lot 20261114j, avec des familles de classe existantes ; ils sont au registre (TF-2550, TF-2551, source « 20261114j »). Aucun lot de travaux déposé : il aurait demandé un travail déjà fait.
- A-3 : 15 clones supprimés sous `.claude\worktrees` (13 forges, la file, le canal) après vérification de chacun — 0 commit d'avance après `fetch`, 0 modification, 0 remisage ; 3 étaient tenus ouverts par 9 processus `bash.exe` laissés par des agents de la campagne entre 12:14 et 12:33, arrêtés par leur PID avant la suppression.
- A-4 : TF-2541 à TF-2555 et TF-2559 décidés sous R-58, tous à faire par une session ; TF-2555 est traité avec TF-2553, dont il est la preuve d'usage.

Relecture d'intention : sans objet, motif : aucun agent lancé dans ce tour, chaque action exécutée par moi et prouvée par sa commande.

## 5. Non traité

- A-2, D-108 — motif : `dependance_bloc_3`, la lettre manque.
- Les classes à créer de 11 des sujets triés (clé proposée par le produit, sans classe au référentiel) — motif : `borne_atteinte`, à créer au référentiel lors de leur correction.
- Les 9 anciens arbres d'agents du pilot sous `.claude\worktrees` (du 14/09 au 29/10) — motif : `hors_mandat`, A-3 ne visait que les clones de forges.

## 6. Écarts à la lettre

- Vous avez accepté A-1 (déposer un lot de travaux chez le site public) → je n'ai rien déposé → le produit avait déjà remis le lot corrigé, entré au registre.
- A-3 ne nommait pas d'arrêt de processus → j'ai arrêté 9 processus `bash.exe` → ils tenaient 3 des clones ouverts ; ils venaient des agents de la campagne, tous terminés.

## 7. Risques

- Une autre session travaille sur le pilot en ce moment (une étude neuve sous `output\03-etudes`) ; signal : des fichiers non suivis qui ne sont pas les miens ; parade : je n'enregistre que mes fichiers.

## 8. Prochaines actions

Le tableau dit qui agit et ce qui se passe si rien n'est fait ; la première vous revient.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Répondre à D-108 en écrivant « 108a » ou « 108b » dans la conversation ; la réponse s'inscrit à `decisions/REGISTRE.jsonl` | neuve | manuelle_utilisateur | decision : changement de juge des forges design et ops | ce message | les oracles peuvent rendre PASS sans mesure ; forge-design reste divergée sous `C:\dev` |
| A-2 | Appliquer la lettre choisie : (a) dans forge-ops, ou (b) dans forge-ops et forge-design, en reprenant le commit local du 29/10 sur la forge à jour avant publication | neuve | auto_ia | dependance_bloc_3 : A-1 | votre réponse | D-108 reste sans effet |
| A-3 | Corriger les sujets décidés du registre par une campagne, comme ce matin | neuve | auto_ia | borne_atteinte : 36 sujets décidés dans ce tour et les précédents | prochaine demande « TODOs et retours » | ils attendent la prochaine campagne |

## 9. Traces

Registre `todo\TODO.jsonl` (16 décisions, TF-2541 à TF-2555 et TF-2559) ; options de D-108 relues dans la transcription de la session du 29/10 (fd15a4ec) ; `todo/oeil-critique-scelles.jsonl`.
