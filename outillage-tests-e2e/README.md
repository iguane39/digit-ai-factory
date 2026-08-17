# outillage-tests-e2e

Deux briques v0 issues du plan `output\04-plans\20260813-plan-strategie-tests-e2e.md` (mandat humain du
13/08/2026, TF-0142 et TF-0145). Node zéro dépendance (stdlib uniquement). Chaque brique est née
**exercée sur fixtures** — l'intégration réelle avec forge-tests/forge-development est un jalon
ultérieur, pas cette livraison.

## TF-0142 — `preparer-environnement.mjs`

Harnais de préparation d'environnement d'audit (plan §4 phase 0). Rend un projet *mesurable*
avant un audit forge-tests, en écrivant **dans le projet cible** (jamais dans forge-tests, qui
reste lecture seule) :

1. détecte les dépendances front (`package.json`) et back (`pyproject.toml`), et si elles sont
   déjà installées (`node_modules`, `.venv`) ;
2. choisit un **port front dédié et réellement libre** (test réseau réel sur `127.0.0.1`),
   jamais `4173` (TF-0137 : c'est le port par défaut de `vite preview`, cause de la collision
   D-01) ;
3. renseigne `.env.forge-tests` (`FORGE_TESTS_APP=module:attribut`, `FORGE_TESTS_BASE_URL`) sans
   jamais écraser une valeur déjà posée par un humain ;
4. produit `contrat-audit.json` (dépendances, port, app détectée, healthcheck, `manques[]`).

```
node outillage-tests-e2e/preparer-environnement.mjs <racine-projet> [--executer] [--json]
```

Statut `pret` (exit 0) ou `bloque_question` (exit 3) — un projet sans app détectable ne reçoit
**jamais** un `FORGE_TESTS_APP` fabriqué : le champ manquant est nommé avec sa raison.
`--executer` lance réellement `npm ci` / `uv sync` (mode documenté ; le self-test ne l'exécute
jamais, il le prouve par un exécuteur mock injecté).

## TF-0145 — `orchestrer-boucle.mjs`

Orchestrateur de boucle remédiation ↔ réexécution (plan §4 phases 5-6), porté par le pilot :
classe les actions au format R-29 (`categorie` ∈ `auto_ia` / `manuelle_dev` /
`manuelle_utilisateur`, aligné sur `forge_tests/actions.py`), applique/déclenche les actions
IA/development (appels **injectés**, documentés — jamais exécutés en dur ici), réexécute, et
mesure la tendance du triplet couverture/passage/mutation. **Borné ≤ N cycles (défaut ≤ 5,
extensible à 7 si chaque cycle réduit strictement le reste — aligné sur `ETAPES-RUN.md`,
mandat du 14/08 ; l'ancien défaut de 3 divergeait de la doctrine ; G-2 absolue)**.
*Dette R-35 nommée (TF-0351)* : cet orchestrateur n'a aujourd'hui AUCUN appelant — son
câblage est conditionné à TF-0340/0341 (cycle de vie d'instance).

État terminal, jamais « jusqu'au vert » : soit `cible_atteinte` (triplet aux seuils, 0 écart),
soit `cycles_epuises` à N — l'état mesuré est rendu avec les écarts résiduels classés par
catégorie, jamais un vert forcé.

```
node outillage-tests-e2e/orchestrer-boucle.mjs \
  --rapport-initial <rapport1.json> --sequence <rapport2.json,rapport3.json> [--n-max 3] [--json]
```

`auditer`/`reprendre`/`declencherDevelopment` sont **injectés** par l'appelant ; ce fichier ne
câble aucun appel réel à forge-tests ou forge-development — c'est le jalon d'intégration
ultérieur. La CLI ci-dessus ne rejoue qu'une séquence de fixtures.

## Fixtures (`fixtures/`)

- `projet-complet/`, `projet-incomplet/` — arborescences synthétiques pour TF-0142 (front+back
  détectables / app non détectable). Les self-tests copient ces dossiers dans un répertoire
  temporaire avant d'écrire dedans : les fixtures versionnées restent toujours pristines.
- `rapports-boucle/` — séquences de rapports JSON pour TF-0145 : `convergent-*` (cible atteinte
  avant épuisement de N) et `non-convergent-*` (N épuisés, un écart humain — golden visuel —
  classé et jamais résolu par la boucle elle-même).

## Vérifications

```
node --check outillage-tests-e2e/preparer-environnement.mjs
node --check outillage-tests-e2e/orchestrer-boucle.mjs
node outillage-tests-e2e/preparer-environnement.test.mjs
node outillage-tests-e2e/orchestrer-boucle.test.mjs
node oracles/oracle-claude-md.mjs
```

Chaque self-test est à **double sens** (une fixture verte qui passe, une fixture rouge qui
échoue pour la bonne raison) — voir le détail des oracles en tête de chaque `*.test.mjs`.
