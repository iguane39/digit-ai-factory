# Boucle d'amélioration des forges

Version 1.0.0 — 2026-08-04

Le steering améliore les cinq forges par **itérations bornées**. Jamais d'amélioration spontanée,
jamais d'application sans validation humaine.

## Canal des retours produits (règle 18, 06/08/2026)

Chaque produit prépare ses retours dans `forge\retours\` — un lot = un fichier
`RETOURS-<AAAAMMJJ><indice>.md` (gabarit : `gabarits\RETOURS-FORGES.md`), généré à chaque
clôture de run et à chaque inspection/incident. **Remise progressive** : l'humain copie le lot
dans `input\` du steering quand il veut déclencher une campagne — l'original reste chez le
produit (historique), le lot remis ne se modifie plus. Côté steering : chaque lot reçu est
traité comme campagne de ce document (généralisation, mise en œuvre, preuve, push), consigné
ci-dessous avec sa source. Les confirmations positives des lots closent les entrées « à
vérifier » du backlog.

## Le cycle (borné par construction)

```
retour consigné ──► qualification ──► PROPOSITION (diff + justification) ──► validation humaine ──► application ──► vérification
     (ledger)        (1 itération =                                          (feu vert explicite,     (par le steering,    (oracles/self-test
                      1 déclencheur,                                          scopé à ce diff)         commit dans la       de la forge
                      1 forge,                                                                         forge concernée)     concernée au vert)
                      1 proposition)
```

- **Déclencheur** : un `retour` consigné dans un ledger de run. Trois sources : la forge elle-même
  (défaut rencontré en l'invoquant), une autre forge (incompatibilité d'interface), le produit
  construit (défaut du livrable remonté à sa forge d'origine). Pas de retour consigné → pas d'itération.
- **Périmètre** : une itération = **une forge**, un ensemble cohérent de modifications répondant à
  **un** retour. Pas de refonte opportuniste, pas de drive-by.
- **Sortie** : un fichier `propositions\<AAAAMMJJ>-<forge>-<slug>.md` contenant : le retour d'origine
  (référence ledger), le diagnostic, le diff proposé, la justification, le test de vérification
  (quel oracle/self-test prouvera que c'est corrigé sans régression).
- **Validation** : le « ok » de l'humain porte sur **cette proposition précise**. Un ok sur le
  diagnostic ne vaut pas mandat d'application.
- **Vérification** : après application, exécuter le self-test/les oracles de la forge modifiée ;
  un rouge = revert et retour au diagnostic.

## État au 04/08/2026 (soir) — campagne de mise en œuvre exécutée

Sur mandat humain explicite (« mets-les en œuvre, teste-les, pousse-les »), une campagne a traité
le backlog, chaque forge vérifiée par sa recette native puis rejouée par l'orchestrateur avant push :

- **Appliqués et poussés** : forge-tests R-T1/T2*/T3/T4/T5/T6/T7/T8/T9 + dette uv.lock
  (5 commits, recette 12/12 rouge + 0 bloquant vert, e2e miniveille exit 3 sans PYTHONUTF8) ·
  conception R-C3(doc)/C5/C6 (3 commits, self-test 14 règles vert, 4 oracles PASS sur livrable réel) ·
  design R-D1/D2/D4/D5/D6 (3 commits, self-test vert, run-oracles exit 0 sur livrable réel) ·
  development R-V1/R-V5-CLI+doc (3 commits, ruff 0, mypy strict 0, 284 tests verts, 19 nouveaux) ·
  agents R-A1/A2/A3 + durcissement verrou Windows (4 commits, self-test 6/6 rejoué 5×,
  preuve de concurrence 51/51 seq sans collision).
- *R-T2 partiel assumé : le `webServer` Playwright du projet audité peut encore écrire chez lui
  (déclaré `non_juge`) ; pans visuel (goldens versionnés) et mutation (modifie-restaure) déclarés
  au README de forge-tests plutôt que corrigés.
- **Différés (exigent un arbitrage humain de fond)** : R-D3 (producteur d'images Gemini — chantier
  neuf), R-V2 (adaptateurs amont conception/design → development) + R-V4 (recouvrements BMAD et
  gates — arbitrage de périmètre), R-V3 (délégation des HITL — constitutionnel), ruff à 0 sur
  forge-tests (30 erreurs préexistantes, dont des défauts PLANTÉS du banc — les corriger
  fausserait la recette).

## 06/08/2026 — socle de règles projet (17 règles décidées + oracle exécutable)

Inventaire de 11 dépôts → `REGLES-PROJET.md` (17 règles, 4 conflits arbitrés par l'humain :
Old\ hors git, commits locaux par défaut, code jamais daté, journaux d'oracles versionnés).
Encodé : socle créé à l'ouverture de run (CLAUDE.md étape 1), rattrapage en tête de run de
version, et `oracles\oracle-conformite-projet.mjs` (self-test double sens 3/3 ; preuve terrain :
8 findings nommés sur Produit-12, dont l'absence de git).

## 06/08/2026 — revue graphique d'implémentation (nouvelle capacité)

Sur proposition humaine validée : forge-design intervient désormais AUSSI en aval — mode
« critique d'implémentation » de `critique-le-design` v1.1.0 (le produit implémenté jugé contre
sa promesse design : tokens, écrans/états, CTA, rendu 2 thèmes, voix ; écarts ancrés versés au
ledger comme retours vers development). Étape 5 bis du steering, en parallèle de tests
(fonction/forme, frontière écrite avec le pan `interface`). Exercé sur le run pilote : tokens
conformes, rendu PASS, 1 écart CTA réel détecté du premier coup.

## Campagne du 05/08/2026 (soir) — retours de PRODUCTION v0.1.0, généralisés

Source : `input/RETOURS-FORGES-02.md` (complément production : 12 défauts trouvés par
l'utilisateur en 10 min malgré 100 % de couverture mesurée). Mandat : généraliser — traiter les
causes racines sur un périmètre large. **Quatre lois transverses** encodées dans le CLAUDE.md du
steering et déclinées dans chaque forge :
1. *Toute affordance est câblée ou n'existe pas* — conception : exigence socle candidate ·
   design : pattern « un CTA = une cible » + contrôle C15 exécutable dans check_maquette.py ·
   development : discipline + test · tests : **nouveau pan `interface`** (contrôle statique des
   éléments inertes, tout le projet, limites déclarées) — prouvé : 5/5 câblés sur MiniVeille,
   5 inertes nommés sur la fixture rouge.
2. *Frontières d'environnement explicites* — `*_MODE_DEMO` absent par défaut (development,
   conception), **qualif populée** avant GO (ETAPE-MEP §3 bis) avec endpoint de peuplement gated.
3. *L'oubli n'existe pas* — surface implicite SaaS proposée d'office et écartée explicitement
   (enumere-la-surface, exception close et versionnée).
4. *Une donnée volatile est une donnée* — catalogues/tarifs en base, datés, sourcés
   (development, conception).
Plus : **RT-6** `non_testables[]` agrégé au-dessus des 11 adaptateurs + `--reprendre <rapport>`
(rejoue uniquement le non-exercé, provenance à l'élément — vérifié : `pans_repris_sans_rejeu`) ·
**RT-8** généralisé en module `forge_tests/sql.py` partagé (3 autres lecteurs corrigés du même
motif « parser avant filtrer », littéraux gérés, recette 13/13) · **RS-6** run de version défini
(ledger N = entrée du run N+1, delta par étape, tests toujours complets) · **fraîcheur des
forges** : pull obligatoire à l'ouverture de run + versions consignées dans `run_open`.
Différé : RT-7 volet Playwright (« effet observable » dynamique — le contrôle statique couvre le
repli) ; composants `.jsx/.tsx/.vue/.svelte` hors pan interface (déclaré `non_juge`).

## Campagne du 05/08/2026 — retours du premier produit réel (Produit-12)

Source : `input/RETOURS-FORGES.md` (compilé à la clôture du premier run bout en bout réel,
brief → production Railway). Mise en œuvre sur mandat humain, chaque forge revérifiée par
l'orchestrateur avant clôture :

- **forge-tests** : RT-1 (repli sqlite3 dans la sonde data + motifs explicites — prouvé sur
  MiniVeille : « 33 instructions SQL OBSERVÉES… schéma créé par le code applicatif »), RT-2
  (`FORGE_TESTS_APP=module:attribut` + finding `sonde-muette:api`), RT-3 (section « Contrat du
  projet audité » au README, chaque affirmation vérifiée dans le code — 2 écarts découverts et
  documentés : Alembic non mesuré, batch limité à `app/batch.py`), RT-4 (DDL jamais évincé de la
  fenêtre, contrainte résiduelle documentée). Recette 12/12 rouge + 0 bloquant vert, 2 runs
  identiques.
- **forge-conception** : RC-1 (S1 en `SANS_OBJET` nommé quand ratio ≥ seuil — le `--seuil` de S2
  devient opérant, self-test double sens conservé), RC-2 (ton par délégation documenté dans
  derive-les-vues).
- **forge-design** : RD-2 (`--rendu` sur run-oracles-design : render_page clair + sombre
  auto-généré + oracle-a11y, SKIP motivé si outillage absent). RD-1 (faux positif V4 intra-icône
  SVG < 48 px) corrigé dans `~/.claude/skills/digit-ai-page-html/scripts/render_page.py` —
  **hors git, non poussable**, prouvé dans les deux sens (icône composite ignorée, vrai
  chevauchement de layout toujours détecté).
- **forge-development** : RV-1/RV-2 (run-playbook : traçabilité `E-xxx` en docstring + gate grep
  100 %, checklist « produit auditable » vérifiée contre le code de forge-tests).
- **forge-agents** : RA-1 (`ledger.mjs append --fichier`, BOM PowerShell absorbé, self-test 8/8
  rejoué 5×), RA-3 (déclencheur « CDC de cadrage » restreint au motif `## SECTION 0` — un README
  ne matche plus, le gabarit matche ; **l'installation `~/.claude` porte encore le défaut**, à
  corriger sur décision). RA-2 (calibrage Sonnet vs Opus) : à mesurer au prochain run.
- **steering** : RS-1 (verbe 4 natif, D-C2/D-C4 soldées), RS-2 (discipline d'auditabilité à
  l'étape development), RS-3 (règle de sélection des smoke tests M-3 : impact max du
  référentiel), RS-4 (M-4 premier déploiement : N-1 = N accepté déclaré), RS-5 (ton par
  délégation au prompt canonique).
- **Vérifiés en conditions réelles** (RT-5, confirmations du run) : R-T1/T2/T3/T4/T5/T8 du
  04/08 tiennent sur un projet réel — entrées closes.

## Backlog initial (issu de l'inventaire du 2026-08-04)

Retours candidats déjà collectés, par forge, priorisés. Statut : `candidat` tant que l'humain n'a
pas demandé de proposition.

### forge-tests (les plus urgents — bloquent l'étape 4 en conditions réelles)
| id | Retour | Gravité |
|---|---|---|
| R-T1 | `subprocess.TimeoutExpired` non attrapée (`execution.py:191`) tue l'audit entier sans rapport | bloquant |
| R-T2 | Garde-fou lecture-seule G-1 violé : artefacts écrits dans le projet audité (34 Mo constatés) | bloquant |
| R-T3 | `text=True` sans `encoding=` → `UnicodeDecodeError` cp1252 sous Windows | majeur |
| R-T4 | Rapport non persistable (`--sortie` absent) ; `--generer --json` pollue stdout | majeur |
| R-T5 | Pan front vise localhost au lieu de `FORGE_TESTS_BASE_URL` | majeur |
| R-T6 | README périmé (« aucun code produit ») ; exit code 2 spécifié non implémenté | mineur |
| R-T7 | *(run pilote)* dépendance `coverage` exigée dans le venv du projet cible, déclarée nulle part — « couverture non mesurable » sans message actionnable | majeur |
| R-T8 | *(run pilote)* `UnicodeEncodeError` cp1252 à l'impression du rapport `--json` sous Windows (contournement invocation : `PYTHONUTF8=1`) | majeur |
| R-T9 | *(run pilote)* `RapportRefuse` (règle conjointe) meurt en traceback avec un JSON de 0 octet au lieu de produire un rapport de refus structuré | majeur |

Note : des correctifs pour R-T1/R-T2/R-T3/R-T5 sont déjà rédigés dans le prompt de reprise de
forge-tests, avec la mention « ne rien appliquer sans mon feu vert » — la proposition steering
consistera à les reprendre tels quels, pas à les réinventer.

### forge-conception
| id | Retour | Gravité |
|---|---|---|
| R-C1 | ~~Verbe 4 `derive-les-vues` absent~~ — **résolu côté forge** (constaté le 04/08 à la mise sous git : `skills/derive-les-vues/` existe) | résolu |
| R-C2 | ~~Lien mort `references/formulation.md`~~ — **résolu côté forge** (fichier présent au 04/08) | résolu |
| R-C3 | Pas de manifeste/README ; état « bloqué sous le seuil » sans protocole machine | majeur |
| R-C4 | `MISSION.md` sans gabarit ni fixture ; oracles non enregistrés au registre quality-oracles | mineur |
| R-C5 | *(run pilote)* prédicat binaire E3 matché par sous-chaîne exacte — les formes accordées (« sont présentes ») ne matchent pas, ce qui force des formulations artificielles | mineur |
| R-C6 | *(run pilote)* oracle-claims A1 scanne `besoins[].enonce` qui n'a aucun champ pour loger une source — un chiffre légitime dans un besoin est un FAIL non réparable | mineur |

### forge-design
| id | Retour | Gravité |
|---|---|---|
| R-D1 | Critères bloquants C1/C6/C7 sans exécutant (render_page.py, oracle-claims, oracle-nommage non résolus) | majeur |
| R-D2 | `run-oracles-design.mjs` non documenté ; skills non installés ; dist/ désynchronisé | majeur |
| R-D3 | Producteur d'images Gemini spécifié, jugé (oracle-images), jamais implémenté | majeur |
| R-D4 | Aucune convention d'emplacement des sorties, ledger de run exigé mais non spécifié | mineur |
| R-D5 | *(run pilote)* `tokens.md` n'offre aucun token sémantique erreur/succès alors que la page témoin doit démontrer un état d'erreur | mineur |
| R-D6 | *(run pilote)* l'exemple d'échelle typographique de `tokens.md` viole sa propre règle ratio ≥ 1.25 (premier pas ×1.167) | mineur |

### forge-development
| id | Retour | Gravité |
|---|---|---|
| R-V1 | Aucune sortie machine (`SprintReport` jeté, exit toujours 0) | majeur |
| R-V2 | Aucun adaptateur amont (EXIGENCES.json → `_bmad-output/` ; tokens.css/MARQUE.md → `design/DESIGN.md`) | majeur |
| R-V3 | `HumanGate` headless toujours False — pas de délégation possible des HITL à un orchestrateur | majeur |
| R-V4 | Recouvrement non arbitré : BMAD refait la conception, les gates internes recouvrent forge-tests | majeur |
| R-V5 | Paramètres clés (`saas_scope`, `brand_charter`) inaccessibles par le CLI ; dogfooding DE-1 non fait | mineur |

### forge-agents
| id | Retour | Gravité |
|---|---|---|
| R-A1 | `ledger.mjs` sans verrou d'écriture concurrente (collision seq constatée) | majeur |
| R-A2 | Chemins absolus obsolètes (`C:/dev/Forge-Agents/`) dans profil d'admission et ledger | majeur |
| R-A3 | Pas de convention de runs (defs/ vs defs-p4/), pas de README/CLAUDE.md | mineur |

## Ordre recommandé (si l'humain demande des propositions)

1. **R-T1 + R-T2 + R-T3 + R-T5** (forge-tests) — correctifs déjà rédigés côté forge, il ne manque
   que le feu vert ; débloquent l'étape 4 sur projets réels.
2. **R-C1** (verbe 4) — débloque la sortie native conception → design et supprime la dette D-C2.
3. **R-V2** (adaptateurs amont) — c'est la couture centrale de l'écosystème ; à concevoir avec
   l'arbitrage R-V4.
4. Le reste au fil des retours de runs.
