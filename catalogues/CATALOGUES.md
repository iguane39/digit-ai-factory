# Catalogues de services des forges — vue générée

> **Vue générée** par `catalogues/generer-vues.mjs` depuis `catalogue.jsonl` (source unique, v1.6.2, 2026-08-15) — ne jamais éditer ce fichier.
> 80 services · 66 prouvés · 14 déclarés. Un service **prouvé** a une preuve exécutée (oracle, CLI, run réel) ; un service **déclaré** n'a que sa méthode documentée — il est affiché comme tel, jamais promis.

## forge-conception (pipeline) — 7 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-con-01 | **Qualifier l'entrant** | qualifier mon idée, CDC ou produit existant en entrant exploitable | `skills\qualifie-l-entrant (méthode, mode degrade)` | run pilote 04/08/2026 — chaîne complète exercée, conception 4/4 oracles PASS (RUN-PILOTE.md) | prouve | experimental |
| cat-con-02 | **Énumérer la surface** | énumérer toute la surface fonctionnelle de mon produit | `skills\enumere-la-surface (méthode, mode degrade)` | oracle-surface.mjs exécutable (self-test double sens) + run pilote 04/08 | prouve | experimental |
| cat-con-03 | **Rédiger les exigences** | obtenir un référentiel d'exigences scellé et traçable | `skills\redige-les-exigences (méthode, mode degrade)` | oracles oracle-exigences/tracabilite/claims exécutables + run pilote 04/08 (4/4 PASS) | prouve | experimental |
| cat-con-04 | **Dériver les vues aval** | produire le cadrage consommable par le design et la mission | `skills\derive-les-vues (méthode, mode degrade — D-C2 soldée le 04/08)` | run pilote 04/08 — vues dérivées produites et consommées par l'étape design | prouve | experimental |
| cat-con-05 | **Valider les exigences (oracles)** | vérifier mécaniquement mon référentiel d'exigences | `node oracles\oracle-{exigences,tracabilite,surface,claims,etat,ears,constitution,delta}.mjs <artefact>` | 8 oracles, 30 règles, self-test à double sens (campagne TF-0101 du 12/08, rejoué par le pilot) | prouve | production |
| cat-con-06 | **Constitution projet** | séparer mes invariants non négociables du référentiel qui évolue | `node oracles\oracle-constitution.mjs <CONSTITUTION.md>` | TF-0101 (12/08) : fixtures double sens, self-test vert, rejoué pilot | prouve | experimental |
| cat-con-07 | **Cycle delta (évolution d'un référentiel scellé)** | faire évoluer EXIGENCES.json par deltas proposés, appliqués, archivés | `node oracles\oracle-delta.mjs <delta> --referentiel <exigences> · node scripts\delta.mjs appliquer\|archiver` | TF-0101 (12/08) : recette 16/16 — un delta refusé n'altère jamais le référentiel (empreinte prouvée) | prouve | experimental |

## forge-design (pipeline) — 9 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-des-01 | **Système de marque** | doter mon produit d'une identité et de tokens exploitables | `skills\systeme-de-marque (méthode, mode degrade)` | run pilote 04/08 — tokens produits, oracles design PASS | prouve | experimental |
| cat-des-02 | **Studio de direction** | explorer et trancher une direction artistique | `skills\studio-de-direction (méthode, mode degrade)` | exercé le 12/08 : 3 directions réellement rendues (BRIEF, tokens+signature par direction, DIRECTION.md motivé), oracles slop/tokens/a11y/rendu PASS sur les trois (TF-0102) | prouve | experimental |
| cat-des-03 | **Améliorer le design (maquette)** | obtenir une maquette HTML autonome de mon interface | `skills\ameliore-le-design (méthode, mode degrade)` | run pilote 04/08 — page témoin produite, 34 règles au vert | prouve | experimental |
| cat-des-04 | **Critiquer le design (amont et aval)** | faire critiquer une maquette ou juger le produit rendu contre sa promesse design | `skills\critique-le-design (méthode) ; mode aval : revue graphique d'implémentation (ETAPES-RUN §5 bis)` | méthode documentée seule — mode aval défini au process, pas encore exercé sur produit réel | declare | experimental |
| cat-des-05 | **Valider le design (oracles)** | vérifier mécaniquement charte, tokens, mobile, images et corpus | `node oracles\run-oracles-design.mjs <html> [--mobile] [--tokens t.css] [--json-only]` | 12 oracles, 52 règles verrouillées — self-test rejoué pilot le 12/08 (TF-0102 + TF-0133 : un toggle mort FAIL mécaniquement) | prouve | production |
| cat-des-06 | **Générer les visuels** | produire les images et visuels réels de mes maquettes | `producteur d'images (Gemini) — spécifié chez design, exercé via le pilot` | TF-0019/0020 clos le 12/08 — trois visuels réels jugés PASS (commits pilot) | prouve | experimental |
| cat-des-07 | **Tokens DTCG (source → dérivé)** | faire des tokens une source W3C interopérable, jamais éditée en CSS | `node scripts\generer-tokens-css.mjs · node oracles\oracle-dtcg.mjs <tokens.json> <css>` | TF-0102 (12/08) : 66 déclarations iso à l'ancien fichier main, PASS production, self-test 48 règles rejoué pilot | prouve | experimental |
| cat-des-08 | **Baseline de régression visuelle** | détecter toute régression visuelle contre une référence approuvée versionnée | `node oracles\oracle-baseline.mjs [approuver\|juger]` | TF-0102 (12/08) : 0,0000 % conforme / 17,3 % divergent mesurés ; approbation post-FAIL refusée | prouve | experimental |
| cat-des-09 | **Contrôler la généricité d'une interface (règles importées)** | vérifier mécaniquement ce qui, dans un rendu, trahit une interface faite par défaut | `node oracles\oracle-taste.mjs <page.html>` | TF-0199 (14/08) : règles extraites d'une source externe MIT (consultée le 14/08), self-test 13 oracles / 56 règles. TA1/TA2 rétrogradées APRÈS mesure : la borne de saturation condamnait toute palette OKLCH du corpus, et la source se contredit (son propre accent recommandé viole sa règle) | prouve | experimental |

## forge-development (pipeline) — 7 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-dev-01 | **Construire le produit sous gates** | transformer mes exigences et mon design en produit qui fonctionne | `méthode du run-playbook appliquée par agent (mode degrade) ; gates rejoués : ruff check + pytest` | run pilote 04/08 — ruff+pytest verts, traçabilité 11/11 | prouve | experimental |
| cat-dev-02 | **Double gate code + design** | garantir que rien ne passe sans vérification code ET design | `.github\workflows\double-gate.yml + conductor\gates\design_gate.py` | CI verte, 266 tests, ratio tests/code ~0,91 — INVENTAIRE §3 | prouve | production |
| cat-dev-03 | **Gate spec (under/over-build)** | détecter ce que le code sous-livre ou sur-livre par rapport à la spec | `conductor (gate spec), remédiation bornée à 3` | TF-0375 (18/08) : corpus RÉEL Approval porté en banc double sens — 4 sous-livrés bloquent, 2 sur-livrés vus sans bloquer, 12 évolutions de doctrine NON transformées en écarts ; et les **trois chemins qui rendaient un succès sans avoir jugé** sont supprimés (reviewer par défaut, juge muet, registre non écrit). Reste non démontré : que le juge LIT bien le cahier — demande un run réel, empêché par D-V1 | declare | experimental |
| cat-dev-04 | **Conductor bout en bout (CLI)** | lancer « idée → SaaS » en une commande | `uv run --project <forge> python -m conductor run "<idée>"` | inutilisable en headless (HITL fermés, NotImplementedError sans opt-in, exit toujours 0) — D-V1 | declare | experimental |
| cat-dev-05 | **Générer DESIGN.md linté** | produire le document design du produit accepté par le gate | `generer-design-md.mjs (D-V2 soldée le 07/08)` | PASS vérifié le 07/08 (CONTRAT-INTERFACE §5) | prouve | experimental |
| cat-dev-06 | **Gate anti-patterns IA** | bloquer imports fantômes, secrets en dur et routes sans auth avant merge | `conductor\gates\ai_antipatterns_gate.py` | TF-0103 (12/08) : 15 tests double sens, 0 faux positif sur conductor entier | prouve | experimental |
| cat-dev-07 | **Gate de mutation (3e métrique)** | mesurer la force réelle de mes tests, pas seulement leur couverture | `conductor\gates\mutation_gate.py + job CI mutation` | TF-0103 (12/08) : mesure réelle Docker 61,1 % (223/365) — honnête, sous seuil, consignée | prouve | experimental |

## forge-tests (pipeline) — 8 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-tst-01 | **Auditer une suite de tests** | savoir ce que mes tests couvrent vraiment et ce qui n'est pas exercé | `uv run python -m forge_tests <racine> --json [--sortie <fichier>]` | seule vraie CLI de l'écosystème ; run pilote 04/08 exit 3, couverture API 8/8 seuil 1.0, mutation 0.714 ≥ 0.70 | prouve | experimental |
| cat-tst-02 | **Générer des cas de tests à adopter et exécuter** | recevoir des cas de tests à adopter et exécuter (solde publié, R-40), sans pollution de mon projet | `uv run python -m forge_tests <racine> --generer <dossier-proposition>` | CLI vérifiée ; TF-0143 (13/08) : cas prouvés COLLECTABLES (pytest --collect-only), pas seulement plausibles — self-test/recette rejoués pilot | prouve | experimental |
| cat-tst-03 | **Livrables de tests dérivés** | obtenir cahiers de tests, jeu de données synthétique et dashboard | `uv run python -m forge_tests <racine> --livrables <dossier-proposition>` | CLI vérifiée ; TF-0144 (13/08) : volumétrie dimensionnée PAR CAS, seedée/déterministe/synthétique — recette jeux+dashboard OK rejoués pilot | prouve | experimental |
| cat-tst-04 | **Tendance et reprise ciblée** | comparer deux audits et ne rejouer que ce qui n'était pas vert | `uv run python -m forge_tests <racine> --precedent <r.json> \| --reprendre <r.json>` | CLI vérifiée le 12/08 (options --precedent et --reprendre documentées) | prouve | experimental |
| cat-tst-05 | **Inventaire sans exécution** | cartographier la surface de test sans rien exécuter | `env FORGE_TESTS_SANS_EXECUTION=1 + CLI` | documenté (INVENTAIRE §4) — non exercé isolément sur cas réel | declare | experimental |
| cat-tst-06 | **Impact par diff, flaky, propriétés, mutation par risque** | auditer moins mais juste : cibler par diff, isoler les flaky, proposer du property-based | `forge_tests\{impact,flaky,generateur_proprietes}.py · risque.repartir_mutants` | TF-0104 (12/08) : 14 tests dédiés dont 2 bout-en-bout git réel — CÂBLAGE CLI RESTANT (services non invocables par flag) | declare | experimental |
| cat-tst-07 | **Rapport exhaustif test-par-test** | obtenir le verdict et le pourquoi de CHAQUE test, pas seulement un agrégat par pan | `forge_tests
| cat-tst-08 | **Juger un catalogue de traductions** | savoir si mes traductions sont COMPLÈTES, si leurs paramètres sont intacts et si mes libellés d'action sont constants — sans attendre un build servi | `forge_tests\catalogue_i18n.py`, câblé au pan `i18n` (aucun modèle appelé) | TF-0383 (19/08) : sur un produit client livré, le pan rendait SKIP / 0 finding et rend FAIL / 5 findings nommés — 150 clés manquantes sur 245 pour 5 des 7 locales déclarées, servies par le repli sans le dire. 19 tests double sens ; **la JUSTESSE d'une traduction est déclarée non jugée** | prouve | experimental |
oyau.py (section essais) + forge_tests\junit.py` | TF-0146 (13/08) : 12 tests, self-test noyau vert, pytest 154 rejoué pilot ; v0 — branchement des adaptateurs (--junitxml → essais réels) = jalon d'intégration | prouve | experimental |

## forge-agents (transverse) — 12 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-agt-01 | **Fabriquer des agents spécialisés** | découper un workflow en agents outillés et vérifiés | `skill forge-agents (conversationnel) + compile-agent-def.mjs (fail-closed)` | deux runs réels bout en bout avec gates déclenchés ; propale P4 livrée | prouve | experimental |
| cat-agt-02 | **Ledger de run vérifiable** | journaliser tout run en JSONL auditable et vérifiable machine | `node .claude\skills\forge-agents\scripts\ledger.mjs verify <ledger.jsonl>` | contrat repris par le pilot (CONTRAT-INTERFACE §3) ; ledger du run pilote 23 entrées vérifié | prouve | production |
| cat-agt-03 | **Atelier des skills qualité** | héberger et faire évoluer les outils transverses de qualité | `sources vivantes dans le dépôt agents ; chaîne d'admission avec fixture rouge juge` | chaîne d'admission prouvée discriminante ; skills consommés quotidiennement par le pilot | prouve | production |
| cat-agt-04 | **Projection OTLP GenAI du ledger** | rendre mes runs lisibles par tout backend d'observabilité | `node .claude\skills\forge-agents\scripts\otlp-project.mjs <ledger>` | TF-0106 (12/08) : 0 span sur ledger corrompu (mesuré), self-test 17 PASS rejoué pilot | prouve | experimental |
| cat-agt-05 | **Oracle agent-evals** | détecter la régression sémantique d'un agent entre versions | `node .claude\skills\forge-agents\scripts\oracle-agent-evals.mjs` | TF-0106 (12/08) : fixtures double sens au self-test, juge distinct de l'exécutant | prouve | experimental |
| cat-agt-06 | **Gate budget G0** | plafonner les appels modèle d'un ticket avant l'appel, fail-closed | `.queue\gates\g0-budget.sh (hook PreToolUse)` | TF-0106 (12/08) : self-test 4 PASS + 2 SKIP motivés — ATTENTION : .queue non versionné (candidature ouverte) | prouve | experimental |
| cat-agt-07 | **Analyser un prompt (L99)** | stress-tester un prompt en 8 couches (OODA noté, blindspots, premortem, wargame) et le réécrire avec contrat de sortie et écarts à la lettre | `skill prompt-analyzer-l99 — invocation : « Améliore le prompt… », « l99 », « analyse ce prompt »` | usages réels : campagne TF-0153 (13/08, score 34→91), run Produit-10 (5 défauts trouvés qu'une réécriture manuelle avait manqués) | prouve | production |
| cat-agt-08 | **Améliorer un skill existant** | diagnostiquer, noter (grille 7 dimensions /5) et corriger un skill sans régression de déclenchement | `skill ameliore-un-skill — invocation : « améliore/audite/durcis ce skill »` | déclaré au catalogue le 14/08 (RV-7) — skill exposé et documenté, usage réel à consigner au premier mandat | declare | experimental |
| cat-agt-09 | **Contre-expertise d'un livrable** | faire contre-expertiser un livrable par un second regard indépendant du producteur | `skill contre-expertise` | déclaré au catalogue le 14/08 (RV-7) — usage réel à consigner | declare | experimental |
| cat-agt-10 | **Fiches expert du domaine** | mobiliser ou rédiger une fiche d'expertise versionnée (experts-forge / write-an-expert) | `skills experts-forge et write-an-expert` | déclaré au catalogue le 14/08 (RV-7) — fiches\ du pilot en sont les consommatrices | declare | experimental |
| cat-agt-11 | **Fixer la barre d'un livrable** | trouver, prouver (test d'existence exécuté) et décomposer la référence externe qui fixe le niveau d'un livrable — pré-vol d'un prompt ou en ligne d'une boucle | `skill la-barre — invocation : « barre… » en tête de message ; registre : references\registre-barres.md` | usages réels : pré-vol TF-0083 (11/08, 3 barres data), campagne catalogues (12/08), TF-0153 (13/08, barre Allure), run Produit-10 (13/08 : protocole tenu intégralement, arrêt au pas 5, garde anti-gameable exercé) | prouve | production |

| cat-agt-12 | **Tenir la cadence d'une mission** | savoir si mes cinq artefacts périodiques (revue RAID, avancement, compte rendu, REX, suivi des bénéfices) sont à jour au regard de la cadence déclarée | `node .claude\skills\quality-oracles\scripts\oracle-cadence-de-mission.mjs <MISSION.md> [--aujourdhui AAAA-MM-JJ]` · table normative : `pilote-de-mission\references\artefacts-de-cadence.md` | TF-0324 (18/08) : C1-C5, fixtures double sens jouées au self-test (144 → 147 contrôles) avec quatre sources réelles sur le disque ; C5 itère sur les cinq artefacts ATTENDUS, jamais sur ceux déclarés. Reste ouvert : aucune instanciation sur mission réelle — aucune n'est instrumentée dans les dépôts | declare | experimental |

## forge-ops (transverse) — 5 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-ops-01 | **Déployer, restaurer, état** | déployer mon produit avec bascule saine et retour arrière prouvé | `node scripts\ops.mjs deployer\|restaurer\|etat <cible>` | self-test à preuve par le geste : déploiement réel local v1→v2 + rollback + 4 défauts refusés — 14 PASS | prouve | experimental |
| cat-ops-02 | **Verdicts d'exploitation O-1…O-4** | prouver que mon déploiement est sain et réversible | `node oracles\oracle-ops.mjs <cible> --json-only` | self-test 14 PASS ; consommés par M-1…M-5 de l'étape MEP | prouve | experimental |
| cat-ops-03 | **Plans cloud plan-first** | préparer un déploiement cloud sans exposer de credential | `node scripts\ops.mjs plan <cible> + oracle O-5` | plans livrés et O-5 PASS (TF-0081, 11/08) — exécution réelle par cible restant à consigner (D-P1) | prouve | experimental |
| cat-ops-04 | **Canary local simulé** | basculer progressivement avec critère de promotion explicite | `node scripts\ops.mjs canary <build> <cible> [--seuils f.json]` | TF-0107 (12/08) : promotion ET dégradation au palier 25 % prouvées au self-test (45 PASS rejoué pilot) | prouve | experimental |
| cat-ops-05 | **Drift O-6 et verdict rollback SLO** | détecter la dérive déclaré↔constaté et savoir quand recommander un retour arrière | `node oracles\oracle-ops.mjs --drift <f> <cible> · --verdict-rollback <mesures> --seuils <f>` | TF-0107 (12/08) : 3 classes de dérive invisibles à O1-O4, chacune PASS-avant/FAIL-après au self-test | prouve | experimental |

## forge-data (transverse) — 8 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-dat-01 | **Profiler (qualité en assertions)** | exprimer et vérifier la qualité de mes données en assertions exécutables | `node oracles\oracle-profiler.mjs <assertions.json>` | self-test double sens 15 PASS (fixtures synthétiques) ; barre Great Expectations (registre la-barre) | prouve | experimental |
| cat-dat-02 | **Tracer (lineage exigible)** | déclarer et vérifier le lineage complet de mes données | `node oracles\oracle-tracer.mjs <lineage.json>` | self-test 15 PASS ; barre OpenLineage (registre la-barre) | prouve | experimental |
| cat-dat-03 | **Restituer (chiffres sourcés)** | garantir que tout chiffre restitué est ancré à sa source | `node oracles\oracle-restituer.mjs <rapport.md>` | self-test 15 PASS ; barre dbt-core (registre la-barre) | prouve | experimental |
| cat-dat-04 | **Fonds de savoir data** | réutiliser les patterns éprouvés de rétro-ingénierie et de lineage | `references\ du dépôt data (lecture)` | documents anonymisés (zéro client vérifié par grep) — savoir, pas d'exécutable | declare | experimental |
| cat-dat-05 | **Contractualiser (data contract)** | sceller l'accord producteur↔consommateur en contrat vérifiable machine | `node oracles\oracle-contractualiser.mjs <contrat.json>` | TF-0108 (12/08) : fixtures double sens, self-test 30 PASS rejoué pilot ; ODCS statué « retenu » dans STANDARDS-DATA | prouve | experimental |
| cat-dat-06 | **Importer un schéma exporté** | dériver un brouillon d'assertions et de contrat depuis le schéma exporté de ma base | `node scripts\importer.mjs <schema.sql>` | TF-0139 (12/08) : round-trip prouvé — le brouillon PASSE oracle-profiler/oracle-contractualiser ; self-test 30→36 PASS, rejoué pilot ; jamais de connexion (fichier seul) | prouve | experimental |
| cat-dat-07 | **Traduire un lineage Unity Catalog** | convertir le lineage colonne natif de Databricks en lineage exigible par la forge | `node scripts	raduire-unity-catalog.mjs <export.json>` | TF-0141 (12/08) : round-trip prouvé (oracle-tracer PASS), self-test 36→41 ; VALIDÉ SUR FIXTURE SYNTHÉTIQUE (aucun workspace payant) ; export incohérent → refus | prouve | experimental |
| cat-dat-08 | **Mesurer une base connectée** | exécuter des requêtes SQL en lecture seule sur un warehouse Databricks et archiver chaque couple requête/résultat, pour que tout chiffre restitué remonte à sa source | `python scripts\mesurer_base.py <id> "<sql>" \| --lot <lot.json> \| --self-test` | RD-3 (Produit-10, 13/08) : porté du script éprouvé du run réel (7,2 M de lignes mesurées, Databricks Statement Execution) ; garde lecture-seule à self-test double sens 8/8 ; AUCUNE valeur de poste en dur (env seul) | prouve | experimental |

## forge-observability (transverse) — 3 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-obs-01 | **Observer (plans → snapshots)** | surveiller entre les runs ce que l'écosystème ne vérifie qu'en one-shot | `node scripts\observer.mjs <plan.json>` | TF-0112 (12/08) : self-test double sens 30 PASS rejoué pilot | prouve | experimental |
| cat-obs-02 | **Détecter la dérive** | être alerté quand quelque chose a changé depuis le dernier passage | `node scripts\derive.mjs <snapshots.jsonl>` | TF-0112 (12/08) : régressions data et tests prouvées sur fixtures (faux oracle à état PASS→FAIL) | prouve | experimental |
| cat-obs-03 | **Veille citation IA** | suivre la présence d'un domaine dans les réponses génératives | `veille-ia\METHODE.md (méthode manuelle documentée)` | méthode documentée seule — automatisation écartée en v0 avec raisons datées (API payantes, non-reproductibilité) | declare | experimental |

## forge-audit (sur mandat) — 4 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-aud-01 | **Référentiel d'audit POC-to-Prod** | auditer la gouvernance et l'architecture de mon produit vers la production | `core\ (adr, controls, dimensions, invariants.json) — dépôt public MIT, marque blanche AuditCore` | deux CI vertes (produit + engagement, iso-parité) ; 55/55 tests et lint N0 0 finding rejoués par le pilot le 12/08 | prouve | production |
| cat-aud-02 | **Oracles d'audit** | vérifier mécaniquement parcours et couverture fonctionnelle | `node oracles\smoke-parcours.mjs · node oracles\verifier-couverture-fonctionnelle.mjs` | exécutés en CI (produit + tenant) | prouve | production |
| cat-aud-03 | **Engagement d'audit par tenant** | mener un engagement client isolé consommant le référentiel | `dépôt d'engagement privé par client, consommant le produit en submodule pinné — sur mandat humain` | un engagement client réel complet, 2 CI vertes (produit + engagement, iso-parité) | prouve | production |
| cat-aud-04 | **Policy-as-code (démonstrateur OPA)** | transformer des contrôles déclaratifs en gate exécuté sur l'IaC | `profiles\policy-as-code\ (conftest via Docker)` | TF-0110 (12/08) : iac-verte 5/5 PASS, iac-rouge 5/5 FAIL nommant le CTL — démonstrateur, migration non faite | prouve | experimental |

## forge-seo (sur mandat) — 7 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-seo-01 | **Créer une mission d'audit SEO** | ouvrir une étude SEO outillée pour mon site — l'étude vit dans le dossier du projet hôte | `python scripts\new_mission.py (CLI stdlib)` | mission réelle complète livrée (produit-02.fr) | prouve | production |
| cat-seo-02 | **Dérouler l'audit 87 nœuds** | auditer mon site en ligne sur toute la grille, preuves à l'appui | `seo\METHODE.md déroulée en session (mandat humain requis — jamais de déclenchement automatique)` | mission réelle : 67 nœuds mesurés / 20 hors périmètre, HTML 6e itération, CSV 24 colonnes | prouve | production |
| cat-seo-03 | **Valider forge et mission** | vérifier mécaniquement l'intégrité de la forge et d'une mission | `python scripts\validate.py [--mission <chemin>]` | exécuté 9/9 (forge) et 5/5 (mission réelle) | prouve | production |
| cat-seo-04 | **Rapport HTML vérifié** | recevoir un rapport d'audit autonome et contrôlé avant remise | `python scripts\rapport_html.py --verifier` | rapport client réel livré (6e itération), contrôles exécutés | prouve | production |
| cat-seo-05 | **Runs de suivi récurrents** | suivre l'évolution SEO d'un site entre deux audits | `méthode documentée (récurrence post-MEP)` | jamais exercé — un seul run réel à ce jour ; snapshot en dérive de schéma (D-S2) | declare | experimental |
| cat-seo-06 | **Instrumentation de crawl avancée** | mesurer aussi les sites JS, le balisage, les CWV terrain (clé CrUX gratuite requise — sinon nœud 31 non mesuré) et les crawlers IA (journaux serveur requis, accès souvent exceptionnel — sinon verdict non mesurable motivé, nœud 58 jugé sur robots.txt/llms.txt seuls) | `python scripts\{crawler.py --rendu-js, crux.py, agents_ia.py}` | TF-0105 (12/08) : 22 tests de preuve + validate 12/12 rejoué pilot ; intégration rapport en restes | prouve | experimental |
| cat-seo-07 | **Scorer et écrire le CSV d'actions** | transformer les actions rédigées de la mission en CSV scoré, trié et contrôlé | `python scripts\scorer_actions.py --mission <chemin>` | TF-0073 (12/08) : 17/17 preuves double sens + bout-en-bout réel 8/8, rejoués par le pilot | prouve | experimental |

## forge-organization (sur mandat) — 4 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-org-01 | **Doctrine des conventions** | disposer de conventions arbitrées pour tous les projets | `conversationnel — documents comme points d'accroche (proposés au pilot, qui encode dans REGLES-PROJET.md)` | oracle-conventions mécanise D-02/03/04/05/06/09/10 et déclare SANS_OBJET motivé les 5 restantes ; 12 décisions au format MADR (ids stables) ; PASS sur le dépôt lui-même (TF-0109, rejoué pilot) | prouve | experimental |
| cat-org-02 | **Composant filtres-tableau** | réutiliser un composant de filtres de tableau vérifié | `node output\composant-filtres-tableau\oracle-filtres-tableau.mjs` | oracle vérifié dans les deux sens (fixtures rouge/verte) | prouve | experimental |
| cat-org-03 | **Études normatives** | ancrer les pratiques sur les normes du métier | `conversationnel` | étude documentée — contrôles proposés non implémentés | declare | experimental |
| cat-org-04 | **Gate de conventions packagé** | vérifier les conventions en pre-commit/CI sans dépendre de la forge | `node output\gate-conventions\gate-conventions.mjs [--staged]` | TF-0109 (12/08) : self-test 6/6 + 2 robustesse, rejoué pilot ; PROPOSÉ aux dépôts, jamais déployé d'office | prouve | experimental |

## forge-agents-security (sur mandat) — 3 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-sec-01 | **Scanner un agent (statique)** | vérifier qu'un agent défini ne porte pas de capacités dangereuses | `node oracles\oracle-scan-agentdef.mjs <def>` | TF-0111 (12/08) : self-test double sens 24 PASS rejoué pilot ; 20 fixtures synthétiques | prouve | experimental |
| cat-sec-02 | **Scanner les appels d'outils (dynamique)** | détecter les patterns d'attaque dans un journal d'exécution d'agent | `node oracles\oracle-scan-toolcalls.mjs <journal.jsonl> --perimetre <racine>` | TF-0111 (12/08) : chaque pattern prouvé rouge avec son cas légitime voisin vert (faux positifs mesurés) | prouve | experimental |
| cat-asc-03 | **Rejouer un corpus d'injection de prompt** | savoir si une charge d'injection a TRAVERSÉ jusqu'à un acte de mon agent | `node oracles\oracle-corpus-injection.mjs <cible>` | TF-0188 (14/08) : self-test 38 PASS (24 avant), dont 2 voisins légitimes qui NE déclenchent pas. Rejeu PASSIF sur artefact : aucun modèle sollicité, donc la résistance d'un système vivant n'est pas mesurée | prouve | experimental |

## forge-websec (sur mandat) — 5 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-wsc-01 | **Juger l'exposition runtime** | savoir si mon produit servi expose une configuration dangereuse | `node scripts\capturer.mjs <url> <capture.json> puis node oracles\oracle-exposition.mjs <capture.json>` | TF-0123 (12/08) : self-test 23 PASS rejoué pilot, 15 cas exposition déterministes | prouve | experimental |
| cat-wsc-02 | **Scanner les dépendances vulnérables (SCA)** | savoir si mes dépendances portent des CVE connues, avec seuils | `node oracles\oracle-sca.mjs <racine-produit> [--seuils f.json]` | TF-0123 (12/08) : sens rouge démontré sur CVE réelles (lodash 4.17.15, django 1.4), rejoué pilot | prouve | experimental |
| cat-wsc-03 | **Tenir un contrat de sécurité ASVS L1** | m'engager sur un niveau de sécurité vérifiable et daté | `referentiels\asvs-l1.md (frontmatter challenge_date)` | référentiel curé sur le texte source OWASP — vérification partiellement outillée, le reste en revue humaine | declare | experimental |
| cat-wsc-04 | **Méthode de test de sécurité (WSTG curé)** | savoir COMMENT vérifier une exigence de sécurité, cas par cas | `referentiels\wstg-cas.md` | TF-0186 (14/08) : curation sur le sommaire WSTG 4.2, énumération datée et à recouper au dépôt source — 20 des 28 cas restent manuels, 5 seulement rendus par un oracle exécuté | declare | experimental |
| cat-wsc-05 | **Scanner dynamiquement (DAST, sur mandat)** | faire exécuter un scan actif contre une cible que j'ai le droit de tester | `node oracles\oracle-dast.mjs --cible <url> --autorisation <fichier.json>` | TF-0187 (14/08) : 7 verrous cumulatifs, self-test 36 PASS ; garde-fou rejoué au pilot (cible non listée -> FAIL « rien n'a été émis », sans autorisation -> FAIL). Exécution ZAP réelle NON prouvée : binaire absent du poste — D-W1 requalifiée, pas close | prouve | experimental |

---

Règles : source unique `catalogue.jsonl` (écrivain unique : pilot) · ids stables, évolution sous table de correspondance (CONTRAT-INTERFACE §3 bis) · toute correction ou ajout passe par candidature TODO-FORGE, jamais par édition directe · barre de niveau : Backstage Software Catalog (registre la-barre).
