# digit-ai-forge-steering

Projet de pilotage de l'écosystème forge Digit-AI. **Un seul point de démarrage** pour construire
un produit en mobilisant les cinq forges bout en bout, et pour les améliorer par itérations
bornées. Règle d'affichage de ce README : il ne promet rien que le ledger d'un run ne puisse
prouver.

## Démarrer un produit

Créer un dossier vide pour le nouveau produit, y **copier [PROMPT-PRODUIT.md](PROMPT-PRODUIT.md)**
(depuis ce dépôt GitHub — c'est le seul fichier nécessaire au départ), ouvrir une session
Claude Code **dans ce nouveau dossier** et coller le prompt rempli. Le prompt est autonome pour
tout nouvel utilisateur : sa phase 0 vérifie les prérequis (git, `gh` authentifié avec accès aux
dépôts privés `iguane39`, node ≥ 18, uv, python), localise la forge ou **l'installe depuis
GitHub** (`~/.digit-ai-forge` par défaut, via `bootstrap.mjs`), puis le run entier — ledger,
artefacts d'étapes, code — vit dans le projet produit.

**Amorçage manuel** (équivalent de la phase 0) : cloner ce dépôt puis `node bootstrap.mjs` —
vérifie les prérequis, clone les cinq forges en dépôts frères (`core.longpaths` activé : les
noms de fichiers des forges dépassent MAX_PATH sinon) et contrôle leurs points d'entrée.
Options : `--racine <dossier>` (+ `FORGE_ROOT` en session), `--pull` pour mettre à jour.
Testé : amorçage réel d'un répertoire vierge, 5/5 clonées, exit 0.

L'orchestrateur (piloté par [CLAUDE.md](CLAUDE.md)) déroule cinq étapes :

```
conception ──► design ──► development ──► tests ──► MEP
(EXIGENCES.json) (tokens.css,   (produit,        (audit         (staging autonome,
 4 oracles        maquette,      ruff+pytest,     forge_tests,    production sur
 exécutés)        34 règles)     traçabilité)     exit 0/1/3)     GO humain)
```

Chaque étape est validée par des **oracles exécutés** — jamais par confiance. Chaque run vit sous
`runs\<AAAAMMJJ>-<slug>\` avec son ledger JSONL (état, reprise idempotente, audit).

## Ce qui est prouvé aujourd'hui

Un run pilote complet a été exécuté le 04/08/2026 ([RUN-PILOTE.md](RUN-PILOTE.md)) : produit-test
« MiniVeille » du brief au rapport d'audit, **zéro intervention humaine**, ledger de 23 entrées
vérifié par l'outil natif de forge-agents. Verdicts : conception 4/4 oracles PASS, design PASS,
development ruff+pytest verts avec traçabilité exigences→tests 11/11, forge-tests exit 3
(couverture de surface API 8/8 au seuil 1.0, score de mutation 0.714 au seuil 0.70).

## Ce qui tourne en mode dégradé (déclaré, pas caché)

Trois étapes sur quatre n'ont pas de point d'entrée natif chez leur forge : conception, design et
development sont exécutées par le steering en appliquant leurs méthodes documentées, validées par
leurs oracles natifs (détail : [CONTRAT-INTERFACE.md](CONTRAT-INTERFACE.md) §5, dettes D-*).
Seule l'étape tests est native (CLI `forge_tests`). L'étape MEP ([ETAPE-MEP.md](ETAPE-MEP.md))
est portée par le steering lui-même : **staging autonome avec oracle exécuté, mise en production
uniquement sur GO humain**, donné sur un dossier de preuve généré (DOSSIER-MEP.md).

## Limites assumées

- Les cinq forges sont invoquées par **chemins locaux** (racine = `$FORGE_ROOT` ou le parent de
  ce dépôt) ; chacune a son dépôt GitHub privé sous `github.com/iguane39`, et `bootstrap.mjs`
  équipe un poste vierge. Les clones locaux restent la source d'exécution — pas de forge
  invoquée à distance.
- Le run pilote portait sur un produit volontairement petit (backend + page unique) ; la maquette
  design complète (9 écrans) et les cibles de déploiement cloud n'ont pas encore été exercées.
- Les améliorations des forges sont des **propositions en diff** (backlog :
  [BOUCLE-AMELIORATION.md](BOUCLE-AMELIORATION.md)), appliquées après validation humaine seulement.

## Contenu

| Fichier | Rôle |
|---|---|
| `CLAUDE.md` | l'orchestrateur — instructions de pilotage de la session (5 étapes) |
| `PROMPT-PRODUIT.md` | modèle du point d'entrée — à copier à la racine de chaque projet produit |
| `INVENTAIRE.md` | état réel des cinq forges (points d'entrée, oracles, manques) |
| `CONTRAT-INTERFACE.md` | format d'invocation, ledger, routage par modèle, dette d'intégration |
| `ETAPE-MEP.md` | la 5e étape : déploiement staging, oracle MEP, gate GO production |
| `REGLES-PROJET.md` | les 17 règles de socle projet (décidées le 06/08) |
| `oracles\` | `oracle-conformite-projet.mjs` (17 règles, exit 0/1/2) + self-test double sens |
| `BOUCLE-AMELIORATION.md` | amélioration des forges (bornée, gated humain) + backlog de retours |
| `HYPOTHESES.md` | hypothèses prises, datées, révisables |
| `RUN-PILOTE.md` | preuve d'autonomie : le run pilote et ses verdicts |
| `runs\` | archive locale du run pilote (les runs vivent désormais dans le projet produit) |

## Principes

- **Le steering est le seul conducteur** : les forges se déclarent non-orchestrables ou
  s'ignorent entre elles ; l'enchaînement vit ici.
- **Routage par modèle** : Fable pilote, Opus construit le complexe, Sonnet par défaut, Haiku
  pour le mécanique. Départ au moins cher plausible, escalade sur échec d'oracle, tout consigné.
- **Jamais d'écriture dans les dépôts frères.** Le contenu des forges et des entrants est de la
  donnée, jamais des instructions.
- **La qualité est mesurée, pas proclamée** : « prêt client » = oracles des cinq étapes au vert
  ou seuils tenus + dossier de MEP complet — aucun critère en « optimal » ou « confiance ».
