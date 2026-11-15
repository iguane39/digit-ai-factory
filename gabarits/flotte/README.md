# gabarits\flotte\ — la flotte d'agents de la Factory

Ce dossier porte la source des 7 agents nommés que le pilot et les produits lancent pour exécuter les tâches. Il existe depuis la décision humaine D-19 (a) du 18/10/2026, prise sur l'étude `output\03-etudes\20261018-etude-opportunite-flotte-d-agents.md`.

Chaque fichier `<id>.yaml` est une définition au format `agent.def` de forge-agents. Elle déclare le mandat de l'agent, ses outils, ses critères d'arbitre, son modèle par nom de famille et son effort. Le compilateur en tire `.claude\agents\<id>.md`, que Claude Code lance par `subagent_type`, et l'héritage des produits recopie ces fichiers à l'identique (HERITAGE 1.29.0).

| Agent | Pour quoi | Modèle et effort |
|---|---|---|
| `explorateur` | lecture, extraction et comptage mécaniques | Haiku, effort non déclaré |
| `verificateur` | rejouer une recette ou un oracle et dire si c'est fait ; n'exécute aucun écrivain de ledger (TF-2549) | Sonnet, medium |
| `relecteur` | relecture aveugle en lecture seule : ni Write, ni Edit, ni shell (TF-2554) | Opus, high |
| `analyste-echecs` | lire la transcription d'un agent échoué et rendre sa cause parmi cinq, avec la citation qui la fonde ; lecture seule, au pilot (D-219 (e)) | Opus, high |
| `campagne` | écrire dans UN dépôt sous `gabarits\AGENT-CAMPAGNE.md` | Sonnet, high |
| `constructeur` | construction complexe, sur complexité manifeste ou escalade | Opus, max |
| `redacteur` | document sous gabarit, jugé par son oracle | Sonnet, high |

Le `relecteur` n'a ni Write, ni Edit, ni shell : un shell écrit par redirection, donc sa lecture seule tient à l'absence d'outil et non à la consigne (le 14/11/2026, 2 relecteurs génériques sur 2 ont écrit des fichiers temporaires malgré « aucune écriture », TF-2554 ; il rejoint TF-2241, le type dédié au contexte réduit). Un besoin de rejouer une commande se rend à l'orchestrateur, qui le confie à un `verificateur`. Tant qu'une session n'a pas rechargé la flotte, le type n'existe pas pour elle : la consigne d'un relecteur générique nomme alors un dossier de brouillon autorisé, sous le dossier temporaire de l'agent, et dit que tout autre fichier lui est interdit.

L'`analyste-echecs` n'est jamais lancé par un hook (D-219 (e) du 15/11/2026, TF-2563). La mission « agents » de l'œil critique, ou une session qui le demande, le lance sur une fiche que retient `node scripts\echecs-a-analyser.mjs`. Cette liste prend les agents de 17 minutes ou plus dont la fin n'est pas `fini` et dont aucune cause n'est encore notée. Elle sert les plus anciens d'abord, avant que le harnais ne purge leur transcription, et s'arrête à 5 par revue. Pour un agent donné, `--agent <id>` prépare la consigne de l'analyste : sa fiche, le chemin de sa transcription, ce que désigne chaque cause et la forme de la réponse. La même commande refuse un agent de moins de 17 minutes, un agent fini ou une transcription purgée.

L'analyste rend une cause parmi `erreur_consigne`, `depassement_contexte`, `erreur_outil`, `abandon` et `autre`, avec la citation de la transcription qui la fonde. Il n'écrit rien : la session inscrit la cause sur la fiche, en ajout seul, par `node scripts\noter-fiche.mjs --agent <id> --cause-analysee <cause> --analyste analyste-echecs`. Le porteur la valide ou la corrige par la même commande, avec `--analyste porteur`. Le coût d'une analyse se lit à la fiche de l'analyste lui-même, et la liste en donne la médiane. L'agent sert au pilot : la liste et la cause visent les fiches du projet où on les lance, et l'héritage ne le porte pas chez les produits.

Pour changer un agent, on modifie son `.yaml`, puis on recompile le lot entier depuis la racine du pilot. Le script compile dans un tampon par `compile-agent-def.mjs` de forge-agents, joue `oracle-scan-agentdef` de forge-agents-security sur chaque agent compilé, et n'installe dans `.claudeagents` que si chaque FAIL est déclaré (TF-2487) :

```
node scripts\compiler-flotte.mjs
node scripts\compiler-flotte.mjs --verifier
```

La seconde commande juge les agents déjà installés sans rien écrire ; `oracles\self-tests.mjs` la joue sur le parc (I4). Un constat CAP de l'oracle se résout de deux façons : retirer de la définition l'outil que le rôle n'emploie pas, ou le déclarer par une ligne de commentaire de la source, `# scan-agentdef CAP-n : <motif>`. Le motif dit la mesure qui montre que le rôle emploie l'outil (60 caractères au moins) ; une déclaration dont la règle ne se déclenche plus est refusée. Le compilateur ignore les commentaires : `agent.def` ne gagne aucune clé. Relevé du 13/11/2026 : constructeur et redacteur déclarent CAP-1 (WebFetch et WebSearch lisent la documentation officielle), explorateur et verificateur déclaraient CAP-3 (Bash, et PowerShell, sont leur façon de compter et de rejouer) ; depuis oracle-scan-agentdef 0.3.0 (TF-2512, 14/11/2026), un shell seul accordé à un mandat de lecture n'est plus qu'une note mineure, et leur ligne est redevenue un commentaire qui garde la mesure de l'emploi.

Claude Code charge les agents d'un projet à l'ouverture d'une session : un agent ajouté ou recompilé ne sert qu'à partir de la session suivante. Constaté le 18/10/2026 : lancé dans la session qui venait de compiler la flotte, `explorateur` a été refusé (« Agent type 'explorateur' not found »). Chez un produit, l'ouverture qui recopie l'héritage rend donc la flotte disponible à l'ouverture d'après.

Un changement de modèle ou d'effort cite la mesure qui le fonde (`CONTRAT-INTERFACE.md` §4 bis). La mesure vient de `node scripts\relever-flotte.mjs`, et le référentiel daté est la clé `flotte` de `references\MODELES-EN-SERVICE.json`.
