# gabarits\flotte\ — la flotte d'agents de la Factory

Ce dossier porte la source des 5 agents nommés que le pilot et les produits lancent pour exécuter les tâches. Il existe depuis la décision humaine D-19 (a) du 18/10/2026, prise sur l'étude `output\03-etudes\20261018-etude-opportunite-flotte-d-agents.md`.

Chaque fichier `<id>.yaml` est une définition au format `agent.def` de forge-agents. Elle déclare le mandat de l'agent, ses outils, ses critères d'arbitre, son modèle par nom de famille et son effort. Le compilateur en tire `.claude\agents\<id>.md`, que Claude Code lance par `subagent_type`, et l'héritage des produits recopie ces fichiers à l'identique (HERITAGE 1.29.0).

| Agent | Pour quoi | Modèle et effort |
|---|---|---|
| `explorateur` | lecture, extraction et comptage mécaniques | Haiku, effort non déclaré |
| `verificateur` | rejouer une recette ou un oracle et dire si c'est fait | Sonnet, medium |
| `campagne` | écrire dans UN dépôt sous `gabarits\AGENT-CAMPAGNE.md` | Sonnet, high |
| `constructeur` | construction complexe, sur complexité manifeste ou escalade | Opus, max |
| `redacteur` | document sous gabarit, jugé par son oracle | Sonnet, high |

Pour changer un agent, on modifie son `.yaml`, puis on recompile le lot entier depuis la racine du pilot. Le script compile dans un tampon par `compile-agent-def.mjs` de forge-agents, joue `oracle-scan-agentdef` de forge-agents-security sur chaque agent compilé, et n'installe dans `.claudeagents` que si chaque FAIL est déclaré (TF-2487) :

```
node scripts\compiler-flotte.mjs
node scripts\compiler-flotte.mjs --verifier
```

La seconde commande juge les agents déjà installés sans rien écrire ; `oracles\self-tests.mjs` la joue sur le parc (I4). Un constat CAP de l'oracle se résout de deux façons : retirer de la définition l'outil que le rôle n'emploie pas, ou le déclarer par une ligne de commentaire de la source, `# scan-agentdef CAP-n : <motif>`. Le motif dit la mesure qui montre que le rôle emploie l'outil (60 caractères au moins) ; une déclaration dont la règle ne se déclenche plus est refusée. Le compilateur ignore les commentaires : `agent.def` ne gagne aucune clé. Relevé du 13/11/2026 : constructeur et redacteur déclarent CAP-1 (WebFetch et WebSearch lisent la documentation officielle), explorateur et verificateur déclaraient CAP-3 (Bash, et PowerShell, sont leur façon de compter et de rejouer) ; depuis oracle-scan-agentdef 0.3.0 (TF-2512, 14/11/2026), un shell seul accordé à un mandat de lecture n'est plus qu'une note mineure, et leur ligne est redevenue un commentaire qui garde la mesure de l'emploi.

Claude Code charge les agents d'un projet à l'ouverture d'une session : un agent ajouté ou recompilé ne sert qu'à partir de la session suivante. Constaté le 18/10/2026 : lancé dans la session qui venait de compiler la flotte, `explorateur` a été refusé (« Agent type 'explorateur' not found »). Chez un produit, l'ouverture qui recopie l'héritage rend donc la flotte disponible à l'ouverture d'après.

Un changement de modèle ou d'effort cite la mesure qui le fonde (`CONTRAT-INTERFACE.md` §4 bis). La mesure vient de `node scripts\relever-flotte.mjs`, et le référentiel daté est la clé `flotte` de `references\MODELES-EN-SERVICE.json`.
