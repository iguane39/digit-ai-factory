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

Pour changer un agent, on modifie son `.yaml`, puis on recompile le lot entier depuis la racine du pilot :

```
node <forge-agents>\.claude\skills\forge-agents\scripts\compile-agent-def.mjs gabarits\flotte\*.yaml --out .claude\agents
```

Claude Code charge les agents d'un projet à l'ouverture d'une session : un agent ajouté ou recompilé ne sert qu'à partir de la session suivante. Constaté le 18/10/2026 : lancé dans la session qui venait de compiler la flotte, `explorateur` a été refusé (« Agent type 'explorateur' not found »). Chez un produit, l'ouverture qui recopie l'héritage rend donc la flotte disponible à l'ouverture d'après.

Un changement de modèle ou d'effort cite la mesure qui le fonde (`CONTRAT-INTERFACE.md` §4 bis). La mesure vient de `node scripts\relever-flotte.mjs`, et le référentiel daté est la clé `flotte` de `references\MODELES-EN-SERVICE.json`.
