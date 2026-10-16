# Retours forges — Produit-62 — 20260911b

- **Contexte** : friction observée en séance le 2026-09-11, en livrant sous `output\` un projet Power BI au format PBIP, dont l'arborescence interne est imposée par Microsoft. Le générateur d'index du pilot (`scripts\readme-dossiers.mjs`, appelé par le hook `PostToolUse`) descend dans tous les sous-dossiers d'`output\` et y écrit un `README.md`. Huit fichiers d'index sont ainsi arrivés à l'intérieur du livrable, dont un dans `…\SemanticModel\definition\tables\`, c'est-à-dire dans la définition du modèle sémantique. Publiés tels quels, ils seraient entrés dans la définition de l'élément Fabric.
- **Références ledger** : `forge\ledger.jsonl` seq 106 (livrables du tour), seq 108 (cette friction et sa parade côté produit)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-11

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-factory (pilot, `scripts\readme-dossiers.mjs` et le hook `PostToolUse` de `gabarits\settings-produit.json`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-05 | majeur | générique | **Le générateur d'index écrit dans un livrable-dossier dont la structure est imposée par un format externe, et y dépose des fichiers que ce format ne connaît pas.** Fait mesuré le 2026-09-11 : après le premier commit du livrable `output\Client-A - Projet Power BI - 20260911b\` (28 fichiers, format PBIP de Microsoft : `<nom>.SemanticModel\definition\tables\*.tmdl`, `<nom>.Report\report.json`, `.platform`, `*.pbip`), le hook a régénéré les index et `git status` a rendu **huit** `README.md` non suivis, à huit niveaux du livrable : à sa racine, dans `…\Report\`, `…\Report\StaticResources\`, `…\Report\StaticResources\RegisteredResources\`, `…\SemanticModel\`, `…\SemanticModel\definition\`, `…\SemanticModel\definition\cultures\` et `…\SemanticModel\definition\tables\`. Lecture du code : `dossiers()` parcourt récursivement toute racine d'`--racines` et `EST_MACHINE(nom)` n'écarte qu'un nom commençant par `.` ou valant `_oracles` — aucun mécanisme ne permet à un dossier de déclarer que sa structure est close. Conséquences mesurées : (1) l'index lui-même est faux et vide de sens — un README qui décrit « Dim Bail.tmdl, Dim Bien.tmdl… » n'a aucun lecteur ; (2) le livrable n'est plus conforme à son format, et la publication l'aurait transmis tel quel à l'interface de programmation Fabric, qui reçoit une définition fichier par fichier ; (3) le défaut est PERSISTANT : toute écriture ultérieure sous `output\` le reproduit, et un contributeur qui nettoie voit les fichiers revenir au geste suivant. *Un générateur qui écrit DANS un artefact dont il ne connaît pas le format le corrompt, et le fait silencieusement à chaque hook.* | **(1)** Un dossier déclare sa structure close par un marqueur — fichier `.no-index` à sa racine, ou entrée dans une liste `structure_close` du manifeste du produit — et `dossiers()` ne descend pas dedans ; l'index du dossier PARENT le mentionne comme un livrable unique, avec son compte de fichiers. **(2)** À défaut de marqueur, reconnaître les formats connus par leur signature de racine (`*.pbip`, `*.SemanticModel`, `*.Report`, `*.sln`, `node_modules`, `*.app`) — moins bon, parce qu'une liste de signatures vieillit. **(3)** Dans tous les cas, borner la PROFONDEUR : au-delà de deux niveaux sous une racine, un README par dossier cesse d'aider un lecteur et devient du bruit versionné. **(4)** Fixture double sens : un dossier portant le marqueur ne reçoit aucun index et son parent le compte pour un ; le même dossier sans marqueur en reçoit un par niveau. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les huit fichiers d'index étaient dans le livrable au moment du commit | supprimés avant le commit du projet ; ils n'ont jamais été versionnés | non : geste ponctuel | resté au produit |
| La publication aurait transmis ces fichiers à Fabric | l'exécuteur `forge\etapes\data\executer-lot1.py` filtre désormais par extension du format (`.tmdl`, `.json`, `.pbism`, `.pbir`, `.pbip`, `.platform`) et RECENSE ce qu'il écarte dans son rapport, plutôt que de le taire | oui pour le principe (un envoi vers un service tiers ne transmet que ce que le format déclare), mais la parade appartient au produit qui publie — le défaut de fond est chez le générateur | remontée (RP-05) |
| Le contrôle P15 de la recette du projet compte les fichiers étrangers | ajouté à `forge\etapes\data\generer-projet-powerbi.py` : la recette échoue si un fichier hors format est présent au moment de la génération | non : contrôle local, propre à ce livrable | resté au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le gabarit `settings-produit.json`, qui installe le hook, n'est pas en cause par son contenu : c'est la portée du générateur qu'il appelle qui l'est.

## Confirmations positives

- Le défaut s'est vu immédiatement : `readme-dossiers.mjs` imprime la liste de ce qu'il régénère et a nommé « `…\definition\tables\README.md` : rôle non rédigé », ce qui a mis le problème sous les yeux au lieu de le laisser dormir.
- Le plafond de longueur de chemin publié le matin même (alinéa TF-1015 de la règle 4) a, lui, parfaitement joué son rôle sur ce même livrable : 21 fichiers refusés, correction en une passe, et le contrôle a été repris dans la recette du produit pour que le cas ne revienne pas.

## Ordre recommandé

1. RP-05 — tant qu'un dossier ne peut pas déclarer sa structure close, tout livrable au format imposé (projet Power BI, solution, application empaquetée) reçoit des fichiers étrangers à chaque écriture sous `output\`, sur tous les produits du parc.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Classe : **RP-05** → `emplacement-livrable-hors-convention` (correspondance APPROCHÉE : la classe vise un livrable généré hors du dossier prévu ; ici c'est l'inverse, un fichier de la forge généré DANS un livrable dont le format ne l'attend pas). Classe candidate, libellé proposé : `generateur-ecrit-dans-un-artefact-au-format-impose` — « un générateur de la forge écrit un fichier à l'intérieur d'un artefact dont la structure est imposée par un format externe, qu'il ne connaît pas : l'artefact cesse d'être conforme, et le défaut se reproduit à chaque exécution du générateur ».
