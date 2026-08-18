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

## Arbitrage du 18/08 — la condition est levée, ce qui reste est nommé (TF-0351)

Ce dossier portait une dette R-35 vivante : `orchestrer-boucle.mjs`, livré le 13/08 pour la
finalité exacte de TF-0349, n'avait **aucun appelant** — l'étude 20260817 l'a exhumé par
`grep`, pas par le corpus — et ses tests n'étaient joués par personne (l'invariant I1 de
`oracles\self-tests.mjs` ne regardait que `oracles\`).

L'étude conditionnait le câblage complet (option O4, 3-5 j sur 3 dépôts) à la résolution de
TF-0340/0341, cycle de vie de l'instance servie. **Ces deux items sont clos le 18/08**
(`forge_tests/instance.py` : contrat de montage/démontage déclaré, provenance de l'instance
confrontée à l'arbre de travail). La condition est donc levée, et l'arbitrage est **câbler**,
non retirer : l'outil sert une finalité qui est maintenant atteignable.

Deux temps, séparés pour ne pas maquiller le second en premier :

1. **fait le 18/08** — les tests de ce dossier entrent dans la recette du pilot par le nouvel
   invariant **I2** : tout `*.test.mjs` du dépôt est joué. Un test vert que rien ne lance
   n'était pas un garde-fou ;
2. **fait le 18/08 aussi, après instruction** — l'intégration réelle, sous la forme que
   l'étude `output-etudes60818-etude-opportunite-cablage-orchestrer-boucle.md` a retenue
   (verdict **O3**, candidature TF-0360). Voir la section suivante.

## Le câblage réel, et la frontière qu'il tient (TF-0360, 18/08)

`appels-reels.mjs` est l'appelant qui manquait. Il ne réécrit rien de la boucle : il fournit
les trois fonctions que `orchestrer-boucle.mjs` attendait — `auditer`, `reprendre`,
`declencherDevelopment` — plus le journal de tours.

**La frontière, et c'est tout l'arbitrage** :

| Qui | Quoi | Pourquoi lui |
|---|---|---|
| **forge-tests** | la DÉFINITION DE FIN d'une campagne (`forge_tests/boucle.py`, TF-0352/0353) — cinq points, publiés dans la section `boucle` de chaque rapport | la forge qui PRESCRIT une règle est celle qui la JUGE (même principe que le mouvement chez forge-design, TF-0335) |
| **le pilot** | LIRE ce verdict, router les actions par leur `etape_cible`, tenir le journal chez le produit | il orchestre, il ne juge pas la fin |
| **le pilot** | la borne ≤ N cycles | c'est un plafond de **dépense** (loi 5), jamais un critère de fin — on peut s'arrêter avant la fin, on ne peut pas décider que c'est fini |

Trois refus explicites, chacun vérifié par un test :

- `cibleAtteinte` **ne recalcule aucun** des cinq points : quand la section `boucle` est là,
  elle a le dernier mot. Un rapport au triplet vert dont forge-tests dit `en_cours` **n'est pas
  vert** ;
- section `boucle` absente (forge-tests antérieure au 18/08) → on ne **devine** pas un verdict
  qu'elle n'a pas rendu : la lecture le DIT, et la boucle retombe sur son seul plafond ;
- `declencherDevelopment` ne **prétend jamais** avoir joué : un run development engage des
  gates et une dépense, il rend la commande exacte et attend une décision (`executer: true`).

Le journal de boucle est écrit **chez le produit** (`forge/journal-boucle.jsonl`) : c'est sa
campagne, et le journal doit lui survivre. Chaque tour en est **dérivé** du rapport plutôt que
compté à la main — un chiffre saisi deux fois diverge.

*Ce qui reste hors de ce câblage, et se déclare* : aucune campagne réelle n'a encore été close
par cette voie. Les tests prouvent la frontière et les refus, pas un bout-en-bout — lancer un
audit complet en test prendrait des minutes et dépendrait d'un démon de conteneurs. C'est le
premier fait que le plan de revue du 2026-09-15 confrontera.

## TF-0145 — `orchestrer-boucle.mjs`

Orchestrateur de boucle remédiation ↔ réexécution (plan §4 phases 5-6), porté par le pilot :
classe les actions au format R-29 (`categorie` ∈ `auto_ia` / `manuelle_dev` /
`manuelle_utilisateur`, aligné sur `forge_tests/actions.py`), applique/déclenche les actions
IA/development (appels **injectés**, documentés — jamais exécutés en dur ici), réexécute, et
mesure la tendance du triplet couverture/passage/mutation. **Borné ≤ N cycles (défaut ≤ 5,
extensible à 7 si chaque cycle réduit strictement le reste — aligné sur `ETAPES-RUN.md`,
mandat du 14/08 ; l'ancien défaut de 3 divergeait de la doctrine ; G-2 absolue)**.
*Dette R-35 SOLDÉE le 18/08 (TF-0360)* : cet orchestrateur a désormais un appelant réel,
`appels-reels.mjs`, et sa condition (TF-0340/0341, cycle de vie d'instance) est levée.

État terminal, jamais « jusqu'au vert » : soit `cible_atteinte` (triplet aux seuils, 0 écart),
soit `cycles_epuises` à N — l'état mesuré est rendu avec les écarts résiduels classés par
catégorie, jamais un vert forcé.

```
node outillage-tests-e2e/orchestrer-boucle.mjs \
  --rapport-initial <rapport1.json> --sequence <rapport2.json,rapport3.json> [--n-max 3] [--json]
```

`auditer`/`reprendre`/`declencherDevelopment` restent **injectés** par l'appelant — ce fichier
n'appelle toujours rien lui-même, et c'est voulu : il reste jouable sur fixtures. Les appels
réels vivent dans `appels-reels.mjs` (TF-0360), à côté. La CLI ci-dessus ne rejoue qu'une
séquence de fixtures.

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
