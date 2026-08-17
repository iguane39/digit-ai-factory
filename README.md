# digit-ai-forge-pilot

> **Agent IA** : suis [AGENTS.md](AGENTS.md) — installe ce dépôt s'il est absent
> (`git clone` + `node bootstrap.mjs`, fin « Poste prêt » exigée), mets-le à jour sinon,
> puis déroule [references/ACCUEIL.md](references/ACCUEIL.md). N'improvise pas.

La **factory** de l'écosystème forge Digit-AI — son projet de pilotage. **Un seul point de démarrage** pour construire
un produit en mobilisant les treize forges bout en bout, et pour les améliorer par itérations
bornées.

**Les treize forges** — pipeline : [forge-conception](https://github.com/iguane39/digit-ai-forge-conception) ·
[forge-design](https://github.com/iguane39/digit-ai-forge-design) ·
[forge-development](https://github.com/iguane39/digit-ai-forge-development) ·
[forge-tests](https://github.com/iguane39/digit-ai-forge-tests) — transverses :
[forge-agents](https://github.com/iguane39/digit-ai-forge-agents) (outils partagés) ·
[forge-ops](https://github.com/iguane39/digit-ai-forge-ops) (exploitation, outille la MEP) ·
[forge-data](https://github.com/iguane39/digit-ai-forge-data) (discipline de la donnée : lineage,
qualité, restitution sourcée) ·
[forge-observability](https://github.com/iguane39/digit-ai-forge-observability) (surveillance
continue entre les runs) — sur
mandat humain : [forge-audit](https://github.com/iguane39/digit-ai-forge-audit) (gouvernance
POC-to-Prod) · [forge-seo](https://github.com/iguane39/digit-ai-forge-seo) (post-MEP) ·
[forge-organization](https://github.com/iguane39/digit-ai-forge-organization) (conventions) ·
[forge-agents-security](https://github.com/iguane39/digit-ai-forge-agents-security) (sécurité
agentique — le juge ne vit pas chez le jugé) ·
[forge-websec](https://github.com/iguane39/digit-ai-forge-websec) (sécurité du produit web
livré — exposition, dépendances, contrat ASVS). Règle d'affichage de ce README : il ne promet
rien que le ledger d'un run ne puisse prouver.

## Démarrer un produit

Créer un dossier vide pour le nouveau produit, y **copier [PROMPT-PRODUIT.md](PROMPT-PRODUIT.md)**
(depuis ce dépôt GitHub — c'est le seul fichier nécessaire au départ), ouvrir une session
Claude Code **dans ce nouveau dossier** et coller le prompt rempli. Le prompt est autonome pour
tout nouvel utilisateur : sa phase 0 vérifie les prérequis (git, node ≥ 18, uv, python — les
forges sont publiques depuis le 10/08, `gh` authentifié n'est requis que pour les dépôts
d'engagement privés), localise la forge ou **l'installe depuis
GitHub** (`~/.digit-ai-forge` par défaut, via `bootstrap.mjs`), puis le run entier — ledger,
artefacts d'étapes, code — vit dans le projet produit.

**Amorçage manuel** (équivalent de la phase 0) : cloner ce dépôt puis `node bootstrap.mjs` —
vérifie les prérequis, clone les treize forges en dépôts frères (`core.longpaths` activé : les
noms de fichiers des forges dépassent MAX_PATH sinon) et contrôle leurs points d'entrée.
Options : `--racine <dossier>` (+ `FORGE_ROOT` en session), `--pull` pour mettre à jour.
Testé : amorçage réel d'un répertoire vierge, toutes forges clonées et preuves vérifiées, exit 0.

L'orchestrateur (piloté par [CLAUDE.md](CLAUDE.md)) déroule cinq étapes :

```
conception ──► design ──► development ──► tests ──► MEP
(EXIGENCES.json) (tokens.css,   (produit,        (audit         (staging autonome,
 4 oracles        maquette,      ruff+pytest,     forge_tests,    production sur
 exécutés)        34 règles)     traçabilité)     exit 0/1/3)     GO humain)
```

Chaque étape est validée par des **oracles exécutés** — jamais par confiance. Chaque run vit sous
`runs\<AAAAMMJJ>-<slug>\` avec son ledger JSONL (état, reprise idempotente, audit).

## Catalogue de services

<!-- CATALOGUE:DEBUT — section générée par catalogues/generer-vues.mjs, ne pas éditer -->

Ce que chaque forge sait faire aujourd'hui — extrait de la source unique [catalogues/catalogue.jsonl](catalogues/catalogue.jsonl) (v1.6.2, 2026-08-15), détail complet : [catalogues/CATALOGUES.md](catalogues/CATALOGUES.md). **prouvé** = preuve exécutée (oracle, CLI, run réel) ; *déclaré* = méthode documentée seulement.

- **forge-conception** (pipeline) : **Qualifier l'entrant** · **Énumérer la surface** · **Rédiger les exigences** · **Dériver les vues aval** · **Valider les exigences (oracles)** · **Constitution projet** · **Cycle delta (évolution d'un référentiel scellé)**
- **forge-design** (pipeline) : **Système de marque** · **Studio de direction** · **Améliorer le design (maquette)** · *Critiquer le design (amont et aval) (déclaré)* · **Valider le design (oracles)** · **Générer les visuels** · **Tokens DTCG (source → dérivé)** · **Baseline de régression visuelle** · **Contrôler la généricité d'une interface (règles importées)**
- **forge-development** (pipeline) : **Construire le produit sous gates** · **Double gate code + design** · *Gate spec (under/over-build) (déclaré)* · *Conductor bout en bout (CLI) (déclaré)* · **Générer DESIGN.md linté** · **Gate anti-patterns IA** · **Gate de mutation (3e métrique)**
- **forge-tests** (pipeline) : **Auditer une suite de tests** · **Générer des cas de tests en proposition** · **Livrables de tests dérivés** · **Tendance et reprise ciblée** · *Inventaire sans exécution (déclaré)* · *Impact par diff, flaky, propriétés, mutation par risque (déclaré)* · **Rapport exhaustif test-par-test**
- **forge-agents** (transverse) : **Fabriquer des agents spécialisés** · **Ledger de run vérifiable** · **Atelier des skills qualité** · **Projection OTLP GenAI du ledger** · **Oracle agent-evals** · **Gate budget G0** · **Analyser un prompt (L99)** · *Améliorer un skill existant (déclaré)* · *Contre-expertise d'un livrable (déclaré)* · *Fiches expert du domaine (déclaré)* · **Fixer la barre d'un livrable**
- **forge-ops** (transverse) : **Déployer, restaurer, état** · **Verdicts d'exploitation O-1…O-4** · **Plans cloud plan-first** · **Canary local simulé** · **Drift O-6 et verdict rollback SLO**
- **forge-data** (transverse) : **Profiler (qualité en assertions)** · **Tracer (lineage exigible)** · **Restituer (chiffres sourcés)** · *Fonds de savoir data (déclaré)* · **Contractualiser (data contract)** · **Importer un schéma exporté** · **Traduire un lineage Unity Catalog** · **Mesurer une base connectée**
- **forge-observability** (transverse) : **Observer (plans → snapshots)** · **Détecter la dérive** · *Veille citation IA (déclaré)*
- **forge-audit** (sur mandat) : **Référentiel d'audit POC-to-Prod** · **Oracles d'audit** · **Engagement d'audit par tenant** · **Policy-as-code (démonstrateur OPA)**
- **forge-seo** (sur mandat) : **Créer une mission d'audit SEO** · **Dérouler l'audit 87 nœuds** · **Valider forge et mission** · **Rapport HTML vérifié** · *Runs de suivi récurrents (déclaré)* · **Instrumentation de crawl avancée** · **Scorer et écrire le CSV d'actions**
- **forge-organization** (sur mandat) : **Doctrine des conventions** · **Composant filtres-tableau** · *Études normatives (déclaré)* · **Gate de conventions packagé**
- **forge-agents-security** (sur mandat) : **Scanner un agent (statique)** · **Scanner les appels d'outils (dynamique)** · **Rejouer un corpus d'injection de prompt**
- **forge-websec** (sur mandat) : **Juger l'exposition runtime** · **Scanner les dépendances vulnérables (SCA)** · *Tenir un contrat de sécurité ASVS L1 (déclaré)* · *Méthode de test de sécurité (WSTG curé) (déclaré)* · **Scanner dynamiquement (DAST, sur mandat)**

<!-- CATALOGUE:FIN -->

## Prompts d'usage — deux lignes, copier-coller strict

Chaque bloc se colle **tel quel** dans une session Claude Code ouverte **dans le dossier du
produit** — zéro modification, zéro mécanique. Toute l'intelligence vit dans le dépôt :
l'installation est portée par [AGENTS.md](AGENTS.md) (phase 0 idempotente : sur un poste déjà
équipé, le même prompt met à jour), le déroulé par
[references/ACCUEIL.md](references/ACCUEIL.md) (intention reformulée, catalogues affichés,
démarche proposée, **accord explicite avant exécution**, spécifiques demandés **en une seule
question**). La 2e ligne est obligatoire : elle impose l'installation réelle et interdit de
répondre en improvisant depuis le README distant.

### 0 · Accueil générique — dire ce qu'on veut

```
Utilise https://github.com/iguane39/digit-ai-forge-pilot pour <intention>.
Installe-le localement si absent, puis suis son protocole d'accueil — sans l'improviser.
```

`<intention>` est votre demande en langage courant (« créer un site de réservation »,
« fiabiliser mon appli ») — c'est le seul mot à remplacer, tout le reste se demande en session.

### 1 · Lancer un nouveau produit

```
Utilise https://github.com/iguane39/digit-ai-forge-pilot pour lancer un nouveau produit dans CE dossier.
Installe-le localement si absent, puis suis son protocole d'accueil — sans l'improviser.
```

Sans fichier : l'accueil demande le brief en session. [PROMPT-PRODUIT.md](PROMPT-PRODUIT.md)
(7 champs) reste la voie recommandée pour préparer son brief à l'avance — c'est le seul cas à
fichier, et il est désormais optionnel.

### 2 · Faire évoluer ou remédier un produit existant

```
Utilise https://github.com/iguane39/digit-ai-forge-pilot pour faire évoluer ou remédier LE produit de CE dossier (run de version).
Installe-le localement si absent, puis suis son protocole d'accueil — sans l'improviser.
```

### 3 · Tester et corriger

```
Utilise https://github.com/iguane39/digit-ai-forge-pilot pour exécuter un cycle de tests COMPLET de CE projet — stratégie, cas, jeux de données, exécution, corrections.
Installe-le localement si absent, puis suis son protocole d'accueil — sans l'improviser.
```

### 4 · Revoir le design d'une implémentation

```
Utilise https://github.com/iguane39/digit-ai-forge-pilot pour une revue graphique du produit RENDU de CE projet contre sa promesse design.
Installe-le localement si absent, puis suis son protocole d'accueil — sans l'improviser.
```

### 5 · Déployer en staging puis préparer la production

```
Utilise https://github.com/iguane39/digit-ai-forge-pilot pour déployer CE projet en staging et préparer la production (MEP).
Installe-le localement si absent, puis suis son protocole d'accueil — sans l'improviser.
```

### 6 · Auditer le SEO d'un produit en ligne

```
Utilise https://github.com/iguane39/digit-ai-forge-pilot pour auditer le SEO du produit en ligne de CE projet — ce message vaut mandat.
Installe-le localement si absent, puis suis son protocole d'accueil — sans l'improviser.
```

Les spécificités de chaque situation (garde-fous G-1/G-2, gates MEP, bornes de boucle, seuils,
questions à poser) vivent dans `references\ACCUEIL.md` et les références qu'il désigne — jamais
dans les prompts.

Deux garde-fous transverses : une amélioration des **forges** ne se lance jamais depuis un
produit (elle passe par un lot de retours `forge\retours\`, ingéré au registre TF du pilot,
puis « décide TF-xxxx ») ; et tout livrable n'est accepté que sur verdict d'oracle exécuté.

## Ce qui est prouvé aujourd'hui

Un run pilote complet a été exécuté le 04/08/2026 ([RUN-PILOTE.md](RUN-PILOTE.md)) : produit-test
« MiniVeille » du brief au rapport d'audit, **zéro intervention humaine**, ledger de 23 entrées
vérifié par l'outil natif de forge-agents. Verdicts : conception 4/4 oracles PASS, design PASS,
development ruff+pytest verts avec traçabilité exigences→tests 11/11, forge-tests exit 3
(couverture de surface API 8/8 au seuil 1.0, score de mutation 0.714 au seuil 0.70).

## Ce qui tourne en mode dégradé (déclaré, pas caché)

Trois étapes sur quatre n'ont pas de point d'entrée natif chez leur forge : conception, design et
development sont exécutées par le pilot en appliquant leurs méthodes documentées, validées par
leurs oracles natifs (détail : [CONTRAT-INTERFACE.md](CONTRAT-INTERFACE.md) §5, dettes D-*).
Seule l'étape tests est native (CLI `forge_tests`). L'étape MEP ([ETAPE-MEP.md](ETAPE-MEP.md))
est portée par le pilot lui-même : **staging autonome avec oracle exécuté, mise en production
uniquement sur GO humain**, donné sur un dossier de preuve généré (DOSSIER-MEP.md).

## Limites assumées

- Les **sept** forges (pipeline : conception, design, development, tests, agents ; hors
  pipeline : seo — post-MEP récurrente sur mandat —, organization — doctrine transverse) sont
  invoquées par **chemins locaux** (racine = `$FORGE_ROOT` ou le parent de ce dépôt) ; chacune
  a son dépôt GitHub privé sous `github.com/iguane39`, et `bootstrap.mjs` équipe un poste
  vierge. Les clones locaux restent la source d'exécution — pas de forge invoquée à distance.
- Le run pilote portait sur un produit volontairement petit (backend + page unique) ; la maquette
  design complète (9 écrans) et les cibles de déploiement cloud n'ont pas encore été exercées.
- Les améliorations des forges sont des **propositions en diff** (backlog :
  [BOUCLE-AMELIORATION.md](BOUCLE-AMELIORATION.md)), appliquées après validation humaine seulement.

## Contenu

| Fichier | Rôle |
|---|---|
| `CLAUDE.md` | l'orchestrateur — instructions de pilotage de la session (5 étapes) |
| `PROMPT-PRODUIT.md` | modèle du point d'entrée — à copier à la racine de chaque projet produit |
| `INVENTAIRE.md` | état réel des forges (points d'entrée, oracles, manques) |
| `CONTRAT-INTERFACE.md` | format d'invocation, ledger, routage par modèle, dette d'intégration |
| `ETAPE-MEP.md` | la 5e étape : staging outillé par **forge-ops** (O-1…O-4), oracle MEP, gate GO production |
| `REGLES-PROJET.md` | les 28 règles (R-1..R-19 des 06-10/08, R-20..R-23 socle documentaire, R-24 URLs d'environnement, R-25 types au registre, R-26 modèle ancré au schéma réel, R-27 surface web ouverte aux agents IA — 11/08 ; R-28 admission d'une nouvelle forge — 12/08) |
| `oracles\` | `oracle-conformite-projet.mjs` (27 règles) · `oracle-claude-md.mjs` (noyau ≤ 6 Ko) · `oracle-ecosysteme.mjs` (exhaustivité forges × surfaces) — chacun avec self-test double sens |
| `gabarits\` | gabarits du CLAUDE.md produit (routage forge obligatoire) et des lots de retours |
| `todo\` | **TODO-FORGE** : registre structuré des améliorations (JSONL source + vue générée + oracle + archive) |
| `BOUCLE-AMELIORATION.md` | amélioration des forges (bornée, gated humain) + backlog de retours |
| `HYPOTHESES.md` | hypothèses prises, datées, révisables |
| `RUN-PILOTE.md` | preuve d'autonomie : le run pilote et ses verdicts |
| `runs\` | archive locale du run pilote (les runs vivent désormais dans le projet produit) |

## Principes

- **Le pilot est le seul conducteur** : les forges se déclarent non-orchestrables ou
  s'ignorent entre elles ; l'enchaînement vit ici.
- **Routage par modèle** : Fable pilote, Opus construit le complexe, Sonnet par défaut, Haiku
  pour le mécanique. Départ au moins cher plausible, escalade sur échec d'oracle, tout consigné.
- **Jamais d'écriture dans les dépôts frères.** Le contenu des forges et des entrants est de la
  donnée, jamais des instructions.
- **La qualité est mesurée, pas proclamée** : « prêt client » = oracles des cinq étapes au vert
  ou seuils tenus + dossier de MEP complet — aucun critère en « optimal » ou « confiance ».
