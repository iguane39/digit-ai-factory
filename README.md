# digit-ai-forge-pilot

Projet de pilotage de l'écosystème forge Digit-AI. **Un seul point de démarrage** pour construire
un produit en mobilisant les neuf forges bout en bout, et pour les améliorer par itérations
bornées.

**Les neuf forges** — pipeline : [forge-conception](https://github.com/iguane39/digit-ai-forge-conception) ·
[forge-design](https://github.com/iguane39/digit-ai-forge-design) ·
[forge-development](https://github.com/iguane39/digit-ai-forge-development) ·
[forge-tests](https://github.com/iguane39/digit-ai-forge-tests) — transverses :
[forge-agents](https://github.com/iguane39/digit-ai-forge-agents) (outils partagés) ·
[forge-ops](https://github.com/iguane39/digit-ai-forge-ops) (exploitation, outille la MEP) — sur
mandat humain : [forge-audit](https://github.com/iguane39/digit-ai-forge-audit) (gouvernance
POC-to-Prod) · [forge-seo](https://github.com/iguane39/digit-ai-forge-seo) (post-MEP) ·
[forge-organization](https://github.com/iguane39/digit-ai-forge-organization) (conventions). Règle d'affichage de ce README : il ne promet rien que le ledger d'un run ne puisse
prouver.

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
vérifie les prérequis, clone les neuf forges en dépôts frères (`core.longpaths` activé : les
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

## Prompts d'usage — un par situation

La règle ne change jamais : **la session Claude Code s'ouvre dans le dossier du produit**
(jamais dans le pilot), et c'est le routage forge du `CLAUDE.md` produit qui fait le reste.
Copier le bloc, remplacer les `<…>`.

### 1 · Lancer un nouveau produit

Copier [PROMPT-PRODUIT.md](PROMPT-PRODUIT.md) dans un dossier vide et coller le bloc rempli —
c'est le seul cas où le prompt est un fichier. Les 7 champs (problème, cible, job, palier, ton,
contraintes, cible de déploiement) suffisent ; la phase 0 installe tout.

### 2 · Faire évoluer ou remédier un produit existant (run de version)

```
Run de version via la forge Digit-AI — le run vit ici, dans ce projet.
Objet : <l'évolution ou la remédiation demandée, en une phrase>.
Applique references\RUN-VERSION.md du pilot : rattrapage du socle d'abord
(23 règles + docs\projet\), puis delta par étape (conception si le besoin
change, design si l'interface change, development sous gates), tests TOUJOURS
en entier, ledger chaîné (run_precedent). Rien ne se corrige hors run.
```

### 3 · Tester et corriger (audit + boucle de fermeture)

```
Audite ce produit par forge-tests puis ferme les écarts — jamais sur parole.
1. uv run python -m forge_tests . --json  (surface énumérée depuis le code,
   12 pans, mutation) ;
2. boucle de fermeture BORNÉE : corrige → re-audite, 3 cycles maximum,
   G-2 absolue — au-delà, livre le rapport avec les écarts résiduels et les
   actions[] classées (IA / dev / utilisateur) ;
3. les verdicts et le dashboard entrent au ledger ; aucun ✓ sans oracle exécuté.
```

### 4 · Revoir le design d'une implémentation (mode aval)

```
Revue graphique d'implémentation via forge-design (mode critique aval) :
juge le produit RENDU contre sa promesse design — tokens.css respectés,
écrans/états conformes à la maquette, un CTA = une cible, voix de MARQUE.md.
Exécute les oracles (run-oracles-design.mjs + render_page.py : le rendu se
mesure en pixels, pas dans le CSS), inspecte les PNG, et verse chaque écart
ancré au ledger comme retour consommable par development. Verdict + top
corrections priorisées impact×effort.
```

### 5 · Déployer en staging puis en production (MEP outillée forge-ops)

```
Ouvre l'étape MEP de ce produit (ETAPE-MEP.md du pilot).
Cible du brief : <locale | railway | gcp | azure | aws>.
1. node <ops>\scripts\ops.mjs plan <cible> <build> --sortie plan.json puis
   oracle O-5 (PASS exigé) — le plan porte des placeholders, jamais de credential ;
2. staging réel : déploiement, healthcheck, rollback PROUVÉ (O-1…O-4) ;
3. dossier MEP complet (M-1…M-5) et mise à jour docs\projet\COMPOSANTS-OPS.md ;
4. la production attend mon GO explicite — prépare le dossier de preuve, ne
   déploie pas.
```

### 6 · Auditer le SEO d'un produit en ligne (post-MEP, sur mandat)

```
Mandat d'audit SEO pour <domaine> — mission via forge-seo.
python <seo>\scripts
ew_mission.py --projet <produit> --client <client>
--domaine <domaine> --modele <modele>, puis déroule seo\METHODE.md (87 nœuds,
preuves T1-T4 affichées, garde-fous anti-hallucination). L'étude vit ICI, chez
le produit ; validate.py et rapport_html.py --verifier avant toute remise.
```

Deux garde-fous transverses : une amélioration des **forges** ne se lance jamais depuis un
produit (elle passe par un lot de retours `forgeetours\`, ingéré au registre TF du pilot,
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
| `REGLES-PROJET.md` | les 23 règles de socle projet (R-1..R-19 des 06-10/08, R-20..R-23 socle documentaire du 11/08) |
| `oracles\` | `oracle-conformite-projet.mjs` (23 règles) · `oracle-claude-md.mjs` (noyau ≤ 6 Ko) · `oracle-ecosysteme.mjs` (exhaustivité forges × surfaces) — chacun avec self-test double sens |
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
