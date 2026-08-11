# digit-ai-forge-pilot

Projet de pilotage de l'écosystème forge Digit-AI. **Un seul point de démarrage** pour construire
un produit en mobilisant les dix forges bout en bout, et pour les améliorer par itérations
bornées.

**Les dix forges** — pipeline : [forge-conception](https://github.com/iguane39/digit-ai-forge-conception) ·
[forge-design](https://github.com/iguane39/digit-ai-forge-design) ·
[forge-development](https://github.com/iguane39/digit-ai-forge-development) ·
[forge-tests](https://github.com/iguane39/digit-ai-forge-tests) — transverses :
[forge-agents](https://github.com/iguane39/digit-ai-forge-agents) (outils partagés) ·
[forge-ops](https://github.com/iguane39/digit-ai-forge-ops) (exploitation, outille la MEP) ·
[forge-data](https://github.com/iguane39/digit-ai-forge-data) (discipline de la donnée : lineage,
qualité, restitution sourcée) — sur
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
vérifie les prérequis, clone les dix forges en dépôts frères (`core.longpaths` activé : les
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

## Prompts d'usage — un par situation, copier-coller strict

Chaque bloc se colle **tel quel** dans une session Claude Code ouverte **dans le dossier du
produit** — zéro modification, aucun nom à insérer : le prompt localise la forge tout seul
(ou l'installe depuis GitHub), prend CE dossier comme produit, et **demande en session, en une
seule question**, ce qui dépend du cas. Le seul cas à fichier reste le lancement (n° 1).

Le préambule commun à tous les blocs :

> **Phase 0** — localise la forge (ne suppose rien d'installé) : `$FORGE_ROOT` si défini, sinon
> cherche `digit-ai-forge-pilot` dans le parent de ce projet, `c:\dev`, `~/.digit-ai-forge` ;
> introuvable → `git clone https://github.com/iguane39/digit-ai-forge-pilot` dans
> `~/.digit-ai-forge` puis `node bootstrap.mjs` (doit finir « Poste prêt ») ; déjà là →
> `git pull --ff-only` dans le pilot puis `node bootstrap.mjs --pull`. Retiens la racine.

### 1 · Lancer un nouveau produit

Copier [PROMPT-PRODUIT.md](PROMPT-PRODUIT.md) dans un dossier vide et coller son bloc : sa
phase 0 est la même, et ses 7 champs de brief sont le seul formulaire de tout l'écosystème.

### 2 · Faire évoluer ou remédier un produit existant

```
Run de version via la forge Digit-AI — le run vit ICI, dans ce projet.
Phase 0 : localise la forge ($FORGE_ROOT, sinon parent du projet, c:\dev,
~/.digit-ai-forge ; introuvable → git clone
https://github.com/iguane39/digit-ai-forge-pilot dans ~/.digit-ai-forge puis
node bootstrap.mjs, fin « Poste prêt » exigée ; sinon git pull --ff-only +
node bootstrap.mjs --pull). Retiens la racine.
Avant d'ouvrir le run : demande-moi EN UNE QUESTION l'objet de l'évolution ou
de la remédiation — ne suppose jamais. Puis lis references\RUN-VERSION.md du
pilot et déroule : rattrapage du socle d'abord (27 règles + docs\projet\),
delta par étape, tests TOUJOURS en entier, ledger chaîné (run_precedent).
Rien ne se corrige hors run.
```

### 3 · Tester et corriger

```
Cycle de tests COMPLET de CE projet via forge-tests — stratégie, cas de
tests, jeux de données, exécution, corrections ; jamais sur parole.
Phase 0 : localise la forge ($FORGE_ROOT, sinon parent du projet, c:\dev,
~/.digit-ai-forge ; introuvable → git clone
https://github.com/iguane39/digit-ai-forge-pilot dans ~/.digit-ai-forge puis
node bootstrap.mjs, fin « Poste prêt » exigée ; sinon git pull --ff-only +
node bootstrap.mjs --pull). Rien à me demander : la cible est ce dossier.
Puis, depuis digit-ai-forge-tests sous la racine de la forge, lance
uv run python -m forge_tests sur CE projet avec : --json ; --sortie vers
forge\rapport-tests.json du projet ; --generer et --livrables vers un
dossier frère proposition-tests, HORS du projet (G-1).
La STRATÉGIE, c'est le rapport : surface énumérée depuis le code, 12 pans,
risques scorés, seuils opposables. Les CAS DE TESTS : cahiers fonctionnels
et techniques dérivés + cas générés — déposés en PROPOSITION hors du projet
(G-1), leur adoption passe par moi ou par la boucle, jamais en douce. Le
JEU DE DONNÉES est synthétique — jamais une donnée réelle. L'EXÉCUTION est
la suite réelle sous couverture ET mutation. Les CORRECTIONS sortent en
boucle de fermeture BORNÉE : corrige → re-audite (--reprendre), 3 cycles
maximum, G-2 absolue — au-delà, livre le rapport avec écarts résiduels et
actions[] classées (IA / dev / utilisateur). Dashboard avec --precedent
pour la tendance entre deux audits. Verdicts persistés au ledger ; aucun ✓
sans oracle exécuté.
```

### 4 · Revoir le design d'une implémentation

```
Revue graphique d'implémentation de CE projet (forge-design, mode critique
aval). Phase 0 : localise la forge ($FORGE_ROOT, sinon parent du projet,
c:\dev, ~/.digit-ai-forge ; introuvable → git clone
https://github.com/iguane39/digit-ai-forge-pilot dans ~/.digit-ai-forge puis
node bootstrap.mjs, fin « Poste prêt » exigée ; sinon git pull --ff-only +
node bootstrap.mjs --pull).
Puis : juge le produit RENDU contre sa promesse design — les tokens.css,
DESIGN.md et MARQUE.md de CE projet s'ils existent (absents → dis-le et
demande-moi en une question contre quelle référence juger). Exécute les
oracles de <racine>\digit-ai-forge-design (run-oracles-design.mjs) et
render_page.py du socle HTML — le rendu se mesure en pixels, pas dans le
CSS — inspecte les PNG, et verse chaque écart ancré au ledger comme retour
consommable par development. Verdict + top corrections impact×effort.
```

### 5 · Déployer en staging puis préparer la production

```
Étape MEP de CE projet, outillée forge-ops. Phase 0 : localise la forge
($FORGE_ROOT, sinon parent du projet, c:\dev, ~/.digit-ai-forge ;
introuvable → git clone https://github.com/iguane39/digit-ai-forge-pilot
dans ~/.digit-ai-forge puis node bootstrap.mjs, fin « Poste prêt » exigée ;
sinon git pull --ff-only + node bootstrap.mjs --pull).
Puis lis ETAPE-MEP.md du pilot. La cible de déploiement : lis-la dans le
brief ou docs\projet\PARAMETRAGE.md de ce projet ; absente → demande-la-moi
EN UNE QUESTION (locale | railway | gcp | azure | aws). Ensuite :
plan via <racine>\digit-ai-forge-ops (ops.mjs plan + oracle O-5 PASS — le
plan porte des placeholders, jamais de credential) ; staging réel avec
healthcheck et rollback PROUVÉ (O-1…O-4) ; dossier M-1…M-5 complet ; mise à
jour de docs\projet\COMPOSANTS-OPS.md. La production attend mon GO explicite
sur dossier de preuve — ne déploie pas.
```

### 6 · Auditer le SEO d'un produit en ligne

```
Mandat d'audit SEO via forge-seo — ce message vaut mandat, la mission vit
ICI, chez le produit. Phase 0 : localise la forge ($FORGE_ROOT, sinon parent
du projet, c:\dev, ~/.digit-ai-forge ; introuvable → git clone
https://github.com/iguane39/digit-ai-forge-pilot dans ~/.digit-ai-forge puis
node bootstrap.mjs, fin « Poste prêt » exigée ; sinon git pull --ff-only +
node bootstrap.mjs --pull).
Le domaine à auditer : détecte-le depuis ce projet (config, docs\projet\,
README) ; introuvable ou ambigu → demande-le-moi EN UNE QUESTION, avec le nom
du client. Puis scaffold via <racine>\digit-ai-forge-seo\scriptsnew_mission.py, déroule seo\METHODE.md (87 nœuds, preuves T1-T4 affichées,
garde-fous anti-hallucination), et valide avant toute remise : validate.py
(exit 0 exigé) puis rapport_html.py --verifier.
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
| `REGLES-PROJET.md` | les 27 règles de socle projet (R-1..R-19 des 06-10/08, R-20..R-23 socle documentaire à 8 fichiers + 2 vues générées, R-24 URLs d'environnement, R-25 types au registre, R-26 modèle ancré au schéma réel, R-27 surface web ouverte aux agents IA — 11/08) |
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
