---
destinataire: humain
---

# Synthèse Mandat — suivi des agents, 2 produits équipés et premier relevé d'usage, 13/11/2026

## 0. Synthèse d'ouverture

Les 34 produits ont maintenant de quoi recevoir le suivi des agents : Produit-77 et Produit-67 sont équipés depuis ce matin, et le hook y répond. Le premier relevé d'usage a fait apparaître un défaut que les bancs n'avaient pas montré. Ce matin, 4 rappels sur 6 de la session pilote sont arrivés dans le contexte des sous-agents, jamais sous vos yeux. Ce défaut et 2 autres sont corrigés, prouvés et envoyés au dépôt public du pilot. Sur les 8 agents lancés depuis le déploiement, 3 ont eu leurs points à temps. 3 tournaient chez 2 produits qui n'ont pas encore rouvert de session. Les 2 derniers ont manqué un point pour des causes identifiées. Le relevé sur une semaine reste daté du 19/11.

## 1. En-tête d'identification

Mandat : actions A-1 et A-2 de la synthèse 20261112j, sur votre « A1 & A2 ». Sur le pilot `digit-ai-factory` (commit 412dd4e2 au départ) et chez 2 produits. Période : 13/11/2026, de 09:36 à 10:25, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; 1 agent factice en Haiku pour la mesure de l'entrée du hook.

Intention de la demande : que le suivi des agents tourne vraiment partout, et le vérifier sur des sessions réelles plutôt qu'aux seuls bancs.

Test rétro : le résultat sert cette intention ; le relevé a trouvé ce que les bancs ne montraient pas, et le correctif part chez tous les produits par leur lanceur, qui joue le hook du pilot.

## 2. Verdict en une ligne

Suivi des agents installé chez les 2 produits qui manquaient, relevé d'usage lisible par cause, 3 défauts du mécanisme corrigés avec leur recette à double sens et envoyés sur `origin/main`.

## 3. Décisions attendues

Rien n'attend de décision ; le seul bloquant qui retient la suite est daté :

- relevé d'usage sur une semaine de sessions réelles : levé le 19/11/2026 par le pilot.

## 4. Traité

Le travail se range en 3 parties : les 2 produits, le relevé d'usage, puis les défauts que le relevé a révélés.

**Produits équipés (action A-1)**
- Produit-77 reçoit 22 copies du pilot, 7 fichiers tirés de leurs gabarits et 17 motifs ajoutés à son `.gitignore`, dont le lanceur et les réglages qui câblent `suivi-agents`. Le tout est commis en local, sans envoi.
  - preuve : `recopier-heritage.mjs --essai` d'abord, sans aucun écrasement ; commit local bad373d, `git commit --only` sur les 30 chemins écrits.
- Produit-67 reçoit 7 copies et 9 fichiers tirés de leurs gabarits ; la règle d'héritage y passe.
  - preuve : `oracle-conformite-projet`, règle d'héritage PASS, « 31 artefact(s) hérité(s) présent(s) et à jour ».
- Depuis chacun des 2 produits, le lanceur trouve le hook du pilot et celui-ci répond.
  - preuve : `node forge/hooks/factory.mjs suivi-agents` rend le rappel attendu, sortie 0 ; relevé d'héritage du parc : réglages présents et lanceur conforme chez les 2.

**Relevé d'usage (action A-2)**
- Premier relevé à 09:46 : 43 agents jugés, 43 FAIL, sans cause. Il jugeait tout agent d'une session modifiée depuis la veille au soir, même lancé avant le mécanisme.
  - preuve : `oracle-suivi-agents --depuis 2026-11-12T22:40`, 6 sessions lues.
- Relevé rejoué à 09:53 après correction de l'oracle : 8 agents lancés depuis le déploiement, 3 PASS, 3 FAIL faute de hook dans la session et 2 vrais manques.
  - preuve : sortie `fail_par_cause` de l'oracle, `{"manque":2,"hook_absent":3}`.
- Les 3 agents sans hook tournaient chez 2 produits qui n'ont pas rouvert de session depuis le déploiement ; ils recevront le hook à leur prochaine ouverture.
  - preuve : aucun fichier d'état du hook pour ces 2 sessions.
- Les 2 manques, de 25,2 et 18,4 minutes, ont 2 causes lues au transcript. À 09:25, un tour s'est terminé sur une erreur d'authentification, sans hook de fin de tour. De 09:37 à 09:47, la session a attendu dans une seule commande de 10 minutes, pendant laquelle aucun hook ne parle.
  - preuve : entrées du transcript de la session 4d7dfda3 entre 09:18 et 09:55.

**Défauts révélés et corrigés**
- Le hook disait « tour en cours depuis 553 min » au premier outil d'un tour neuf ; le résumé de compaction, écrit après votre message à l'heure de la compaction, passait pour le début du tour. Ce résumé est désormais écarté.
  - preuve : recette 43 sur 43, 42 sur 43 sans le correctif ; sur le vrai transcript, début du tour à 09:36 au lieu de 00:23.
- Le rappel partait dans le contexte d'un sous-agent : l'outil d'un sous-agent déclenche le même hook, avec la session du parent. Les rappels de 08:50, 09:05, 09:22 et 09:52 sont ainsi arrivés chez des agents de campagne, et chacun repoussait l'échéance. L'entrée d'un sous-agent porte `agent_id` ; le rappel n'y part plus.
  - preuve : journal temporaire de 14 entrées et 1 agent factice ; recette 45 sur 45, et 2 échecs sans le correctif.
- L'oracle de relevé donne maintenant la cause de chaque FAIL ; il écarte les agents lancés avant la date et compte, en session VS Code, les points que le hook a demandés. Le hook garde ces demandes 8 jours au lieu des 20 dernières.
  - preuve : `--self-test` 10 sur 10, dont 5 cas neufs rouges et verts.
- Code enregistré et envoyé sous a8cfca80 ; registre : TF-2484 créé, décidé et clos en « corrige » sur ses recettes rouge puis verte, avec ses gains et sa descente.
  - preuve : `git merge-base --is-ancestor a8cfca80 origin/main` rend 0 ; `oracle-todo` PASS avant et après l'écriture ; `hook-restitution.test` 77 sur 77, `hooks-factory.test` 50 sur 50, conformité 241 PASS et 0 FAIL.

Relecture d'intention : sans objet, motif : aucun agent n'a reçu de consigne de travail dans ce tour, le seul agent lancé était un agent factice de mesure, sans tâche.

## 5. Non traité

- L'envoi du commit de Produit-77 — motif : hors_mandat ; un envoi chez un produit attend votre accord à chaque fois, le commit reste local sur sa branche de travail.
- Le dépôt git de Produit-67, qui n'en a pas — motif : hors_mandat ; la règle du pilot l'exige, mais créer le dépôt et son premier commit dépasse l'équipement du suivi.
- Les 2 écarts de Produit-77 à la règle d'héritage — motif : hors_mandat ; son `CLAUDE.md`, propre au produit, ne cite pas 3 repères, et un fichier suivi sous `forge\` porte une valeur de forme secrète, que je n'ai ni lue ni recopiée.
- La résolution du répertoire personnel dans 3 de mes scripts — motif : hors_mandat ; une autre session du pilot l'a décidée ce matin sous TF-2483, la faire ici la ferait faire 2 fois.
- Un point pendant une commande de premier plan de la session — motif : dépendance externe ; aucun hook ne tourne pendant un outil, seule une attente par tranches courtes laisse passer le rappel.

## 6. Écarts à la lettre

L'action A-1 vous demandait d'ouvrir une session chez les 2 produits, ou de me donner mandat ; j'ai lu « A1 » comme ce mandat et fait le geste par le script d'héritage du pilot. L'action A-2 était datée du 19/11 : je l'ai jouée dès aujourd'hui, comme relevé d'étape, et la mesure sur une semaine reste due.

## 7. Risques

- Produit-77 s'ouvrait jusqu'ici depuis son dossier parent, hors de son dépôt ; ses réglages ne se chargent qu'à l'ouverture dans le dépôt.
  - signal : une session de ce produit sans fichier d'état du hook au prochain relevé.
  - parade : ouvrir le dossier du dépôt, ou équiper aussi le dossier parent.
- Une session qui attend ses agents dans une longue commande au premier plan reste muette jusqu'à la fin de la commande.
  - signal : un FAIL « manque » dont l'écart couvre une commande de plus de 150 secondes.
  - parade : la règle d'attente par tranches de 150 secondes de `gabarits/AGENT-CAMPAGNE.md`, à étendre à la session qui lance les agents.

## 8. Prochaines actions

Une seule action reste, sans ordre à choisir, parce qu'elle attend une semaine de sessions réelles plutôt qu'un geste.

| Sélecteur | Item | Action | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | TF-2484 | Relever le suivi sur une semaine de sessions réelles | auto_ia | gate_gouvernance : relevé d'usage daté du 19/11 | `node oracles/oracle-suivi-agents.mjs --depuis 2026-11-13T10:25` | si rien n'est fait : les 2 correctifs du jour restent prouvés au banc seulement |

## 9. Traces

- Correctifs : `oracles/lib-suivi-agents.mjs`, `oracles/hook-suivi-agents.mjs`, `oracles/oracle-suivi-agents.mjs`, recette `oracles/hook-suivi-agents.test.mjs`.
- Héritage : `scripts/recopier-heritage.mjs`, `scripts/relever-heritage.mjs`, `gabarits/hooks-factory.mjs`.
- Synthèse précédente : `output/04-plans/Digit-AI - Synthese Mandat - Suivi des agents toutes les 15 minutes - 20261112j.md`.
