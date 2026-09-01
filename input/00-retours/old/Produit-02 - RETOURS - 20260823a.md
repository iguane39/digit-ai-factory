# Retours forges — retrait du domaine breton & audit forge-tests — 20260823a

- **Contexte** : run de version « le site ne présente plus qu'un seul lieu d'hébergement »
  (retrait des derniers résidus du domaine de Vieux-Viel), suivi d'un audit forge-tests
  complet sur `Produit-02.com`. Rapport :
  `forge/etapes/tests/rapport-20260823.json` — verdict **PARTIEL**, 16 pans, 15 constats.
- **Références** : 9 fichiers sources modifiés (`build/data.mjs`, `build/i18n/*.mjs` ×7,
  `build/check-seo.mjs`), 203 pages régénérées. Commit local, non poussé à la remise du lot.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans
  `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

**Fil conducteur de ce lot** — mandat humain explicite du 23/08 : *« demande à la Factory de
retravailler les éléments qu'elle peut traiter toute seule sans que j'aie de décisions à
prendre à ce niveau-là ».* Les six retours ci-dessous partagent une seule racine : **la forge
sollicite une décision humaine là où il n'y a aucune décision à prendre.** Ce ne sont pas
des configurations manquantes, ce sont des évidences que l'outil pouvait déduire seul,
appliquer, et **signaler** au rapport plutôt que demander.

---

## forge-tests (`digit-ai-forge-tests`)

### Le cas d'école : `input\` dans le périmètre du système sous test

Ce chapitre montre comment le périmètre d'audit, faute d'exclusion par défaut, fait porter la
quasi-totalité des constats sur de la matière d'entrée — des pages de tiers sauvegardées — et
laisse dans l'ombre le seul résultat qui intéressait ce run : le produit lui-même est indemne.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-1 | majeur | **12 des 15 constats de l'audit (80 %) portent sur `input\`** — un dossier qui, par son nom même, contient de la matière d'entrée et non du produit. Ce qui y a été audité : `input\lamaisondutraict.com\Chambres d'hôtes au Croisic….htm`, la page d'accueil **d'un site concurrent** sauvegardée depuis un navigateur, et `input\Produit-02.fr\…_files\`, l'**ancienne** version du site aspirée pour comparaison. Le pan `interface` sort FAIL sur un ratio de **0,9998** (18 453 éléments exercés sur 18 456) : les 3 affordances non exercées — « Previous Previous », « Next Next », un `<a>` sans `href` — sont les boutons de carrousel du concurrent. Le produit réel, `site\`, ne porte **aucun** constat. Le verdict PARTIEL ne dit donc rien de l'état du produit : il dit que des pages tierces sauvegardées ne sont pas du code bien câblé, ce que personne n'a jamais prétendu. | Exclure par défaut du périmètre, sans configuration : `input\`, `docs\`, `Old\`, `runs\*\mission-precedente\`, `**\*_files\`, `*.téléchargement`, `*.htm` sauvegardé (marqueur `saved from url`). **Inverser la charge** : l'inclusion d'un de ces dossiers doit être le geste explicite du projet, jamais l'exclusion. Un projet qui range sa matière d'entrée dans `input\` suit la convention de la Factory — il ne devrait pas avoir à s'en excuser dans un `.env`. |
| RT-2 | majeur | Même racine, autre oracle : le pan `securite` sort FAIL sur **9 « secrets »**, tous dans `input\Produit-02.fr\…_files\`. Ce sont les clés API Google Maps (`AIzaSy…`) et Weglot embarquées dans `weglot.min.js.téléchargement` et `saved_resource` — c'est-à-dire du JavaScript minifié **de tiers**, capturé par « Enregistrer la page sous… ». 3 des 9 sont d'ailleurs déjà qualifiés « valeur non réelle (placeholder/env) — OK » par l'oracle lui-même, qui sait donc distinguer, mais pas s'abstenir. Aucun de ces neuf n'est un secret du projet, aucun n'est révocable par le projet, aucun ne peut fuiter par notre fait — ils sont publics dans le HTML du site d'origine. | Un fichier portant l'extension `.téléchargement` / `.download`, ou situé sous un dossier `*_files\`, est un artefact de sauvegarde navigateur : jamais du code source. L'oracle secrets doit l'ignorer sans le dire, ou au mieux le classer `signale` — pas `bloquant`. Corollaire : un « secret » dans du `.min.js` mérite une bande de risque distincte de celle d'un secret dans du code écrit par le projet. |

### Deux manques que la forge sait nommer mais n'amorce pas

Les deux constats suivants ont ceci de commun que la forge dispose déjà de tout ce qu'il
faut pour les lever elle-même — le chemin du fichier, son format, la règle qui l'impose —
et choisit malgré tout de dégrader son verdict plutôt que d'écrire ce qu'elle sait.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-3 | mineur | `boucle.statut = "en_cours"`, manque unique : *« aucun tour au journal de boucle — une campagne sans journal ne peut pas prouver son rejeu (TF-0353). Journal attendu : `forge/journal-boucle.jsonl` »*. La forge **connaît le chemin exact**, elle **connaît le format**, elle **connaît la règle qui l'impose**, et elle vient d'exécuter un tour complet qu'elle pourrait y écrire. Elle rend malgré tout un PARTIEL dont ce manque est un ingrédient. Aucune décision humaine n'entre dans « écrire la ligne du tour que je viens de faire ». | Amorcer `forge/journal-boucle.jsonl` au premier tour et y consigner le tour courant. Si le fichier existe déjà, y ajouter. Le rapport signale la création (« journal de boucle amorcé — tour 1 »). Le PARTIEL se réserve aux manques que la forge ne peut pas combler seule. |
| RT-4 | mineur | `.env.forge-tests` absent du projet. Le rapport énumère pourtant, pan par pan, les clés attendues et **le chemin exact du fichier** (`c:\dev\Produit-02.com/.env.forge-tests`), jusqu'à préciser pour le pan `api` que *« renseigner cette configuration ne le rendrait pas mesurable pour autant »* — la forge sait donc aussi quelles clés seraient **inutiles** ici. Le projet doit néanmoins reconstituer ce fichier à la main depuis un rapport de 1,1 Mo. | Déposer `.env.forge-tests.exemple` à la racine du projet audité au premier audit : clés pertinentes pour la stack détectée, commentées, valeurs vides ; clés sans objet omises ou commentées avec leur motif. Le projet renomme et remplit. Coût forge : nul. Coût projet évité : une lecture de rapport. |

## Factory (`digit-ai-factory`)

Deux retours pour la Factory elle-même : la règle de socle dont les quatre constats
précédents sont des instances, et deux divergences du gabarit de projet qui ont rendu
inapplicable, telle qu'écrite, la consigne de traçabilité du `CLAUDE.md` livré.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-5 | majeur | **Le retour de fond, formulé par l'humain en séance.** RT-1 à RT-4 ne sont pas quatre défauts de forge-tests : c'est quatre fois le même réflexe. À chaque fois la bonne réponse était déductible du contexte — un dossier nommé `input\` n'est pas du produit ; un `.min.js.téléchargement` n'est pas du code ; le tour que je viens d'exécuter est celui que je dois journaliser ; les clés que je viens d'énumérer sont celles que je dois pré-remplir. À chaque fois l'outil a préféré **dégrader son verdict et rendre la main** plutôt que trancher. Le coût est double : le temps humain, et surtout le **signal noyé** — il a fallu écrire un script de dépouillement pour découvrir que `site\` ne portait aucun constat, l'information réellement utile de cet audit. | Poser la règle au socle, opposable à toutes les forges : **une forge ne sollicite l'humain que lorsqu'il y a réellement un arbitrage à rendre.** Quand la réponse se déduit du contexte, elle décide, applique, et l'**inscrit au rapport** dans une section dédiée (« décisions prises d'office ») que l'humain relit *a posteriori*. Ce n'est pas un affaiblissement du GO humain : le GO humain porte sur les **verdicts** et les **mises en production**, pas sur des évidences de configuration. Critère de discrimination proposé : si deux personnes compétentes trancheraient identiquement sans information supplémentaire, ce n'est pas une décision — c'est un défaut d'automatisation. |
| RT-6 | mineur | Deux divergences dans le gabarit de projet livré par la Factory, découvertes en voulant appliquer la consigne *« consigner AU MOMENT MÊME au ledger »* : (1) `CLAUDE.md` désigne le ledger comme `forge\ledger.jsonl` — à deux endroits, dont « Le ledger `forge\ledger.jsonl` porte l'état exact » — alors que `forge\ledger.py` écrit dans `runs\<run>\ledger.jsonl` ; le chemin annoncé n'existe pas. (2) `forge\ledger.py` **épingle le run en dur** (`run = "20260815-audit-seo-Produit-02"`, ligne 68) : ouvrir le run suivant impose d'éditer l'outil. Le run du 15/08 étant clos (`run_close`, seq 24), la consigne du CLAUDE.md était inapplicable telle quelle — le ledger du run de ce jour a dû être écrit à la main, au contrat de `CONTRAT-INTERFACE §3`. | Aligner le `CLAUDE.md` gabarit sur `runs\<run>\ledger.jsonl`, et faire de `ledger.py` un outil paramétré : `--run <id>`, avec défaut = dernier run non clos, et `run_open` refusé si un run est déjà ouvert. Le run courant se lit, il ne se recompile pas dans le source. |

## Confirmations positives

- **Le pan `i18n` a fait exactement son travail.** C'est le seul PASS de l'audit, et c'est
  précisément le pan qui couvre la modification du jour : 7 fichiers de traduction confrontés
  au HTML réellement servi, 203 pages. Un run qui touche les 7 langues et sort PASS sur le
  seul oracle qui regarde les 7 langues, c'est le signal qu'on attendait.
- **La discrimination des constats est fine quand elle s'exerce.** L'oracle secrets sépare
  déjà « secret en clair » de « valeur non réelle (placeholder/env) — OK ». La capacité est
  là ; c'est le périmètre en amont qui manque (RT-2).
- **Le rapport dit ce qu'il ne juge pas, et le dit bien.** La section `non_juge` est
  remarquable de précision — notamment sur l'accessibilité : *« l'audit RGAA complet reste un
  livrable HUMAIN : un tiers des critères n'est pas mécanisable, la machine prépare l'audit,
  elle ne rend pas la déclaration »*. C'est le contre-exemple exact de RT-5 : **là**, la forge
  a raison de rendre la main, et elle explique pourquoi. La règle proposée en RT-5 ne
  menace pas ce comportement, elle le met en valeur en supprimant le bruit autour.
- **`pans_sans_objet` fonctionne déjà comme RT-1 le demande.** Les 4 pans NA
  (`accessibilite`, `contraste`, `clavier`, `visuel`) sont écartés avec un motif déduit du
  projet, sans rien demander à personne. Le mécanisme existe donc au sein même de la forge :
  RT-1 demande de l'étendre au périmètre de fichiers.

## Ordre recommandé

1. **RT-5** — c'est la règle dont RT-1 à RT-4 sont des instances. La traiter en premier
   évite de corriger quatre fois le même réflexe dans quatre forges différentes.
2. **RT-1** — meilleur rapport gain/effort des cas concrets : une liste d'exclusions par
   défaut, et les 12 constats de cet audit qui portent sur `input\` disparaissent.
   Bénéficie à tout projet qui suit la convention `input\` de la Factory, donc à tous.
3. **RT-2** — même correctif de fond, oracle différent ; sans lui, `securite` reste FAIL
   sur des clés qui ne nous appartiennent pas.
4. **RT-6** — bloque l'application littérale du `CLAUDE.md` livré par la Factory, donc
   touche l'amorçage de tout nouveau projet.
5. **RT-3**, **RT-4** — confort d'exploitation, une fois le bruit retiré.
