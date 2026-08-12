# Catalogues de services des forges — vue générée

> **Vue générée** par `catalogues/generer-vues.mjs` depuis `catalogue.jsonl` (source unique, v1.1.0, 2026-08-12) — ne jamais éditer ce fichier.
> 58 services · 50 prouvés · 8 déclarés. Un service **prouvé** a une preuve exécutée (oracle, CLI, run réel) ; un service **déclaré** n'a que sa méthode documentée — il est affiché comme tel, jamais promis.

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

## forge-design (pipeline) — 8 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-des-01 | **Système de marque** | doter mon produit d'une identité et de tokens exploitables | `skills\systeme-de-marque (méthode, mode degrade)` | run pilote 04/08 — tokens produits, oracles design PASS | prouve | experimental |
| cat-des-02 | **Studio de direction** | explorer et trancher une direction artistique | `skills\studio-de-direction (méthode, mode degrade)` | exercé le 12/08 : 3 directions réellement rendues (BRIEF, tokens+signature par direction, DIRECTION.md motivé), oracles slop/tokens/a11y/rendu PASS sur les trois (TF-0102) | prouve | experimental |
| cat-des-03 | **Améliorer le design (maquette)** | obtenir une maquette HTML autonome de mon interface | `skills\ameliore-le-design (méthode, mode degrade)` | run pilote 04/08 — page témoin produite, 34 règles au vert | prouve | experimental |
| cat-des-04 | **Critiquer le design (amont et aval)** | faire critiquer une maquette ou juger le produit rendu contre sa promesse design | `skills\critique-le-design (méthode) ; mode aval : revue graphique d'implémentation (ETAPES-RUN §5 bis)` | méthode documentée seule — mode aval défini au process, pas encore exercé sur produit réel | declare | experimental |
| cat-des-05 | **Valider le design (oracles)** | vérifier mécaniquement charte, tokens, mobile, images et corpus | `node oracles\run-oracles-design.mjs <html> [--mobile] [--tokens t.css] [--json-only]` | 5 oracles, 34 règles, self-test vert du 04/08 ; corpus 123 entrées sourcées | prouve | production |
| cat-des-06 | **Générer les visuels** | produire les images et visuels réels de mes maquettes | `producteur d'images (Gemini) — spécifié chez design, exercé via le pilot` | TF-0019/0020 clos le 12/08 — trois visuels réels jugés PASS (commits pilot) | prouve | experimental |
| cat-des-07 | **Tokens DTCG (source → dérivé)** | faire des tokens une source W3C interopérable, jamais éditée en CSS | `node scripts\generer-tokens-css.mjs · node oracles\oracle-dtcg.mjs <tokens.json> <css>` | TF-0102 (12/08) : 66 déclarations iso à l'ancien fichier main, PASS production, self-test 48 règles rejoué pilot | prouve | experimental |
| cat-des-08 | **Baseline de régression visuelle** | détecter toute régression visuelle contre une référence approuvée versionnée | `node oracles\oracle-baseline.mjs [approuver\|juger]` | TF-0102 (12/08) : 0,0000 % conforme / 17,3 % divergent mesurés ; approbation post-FAIL refusée | prouve | experimental |

## forge-development (pipeline) — 7 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-dev-01 | **Construire le produit sous gates** | transformer mes exigences et mon design en produit qui fonctionne | `méthode du run-playbook appliquée par agent (mode degrade) ; gates rejoués : ruff check + pytest` | run pilote 04/08 — ruff+pytest verts, traçabilité 11/11 | prouve | experimental |
| cat-dev-02 | **Double gate code + design** | garantir que rien ne passe sans vérification code ET design | `.github\workflows\double-gate.yml + conductor\gates\design_gate.py` | CI verte, 266 tests, ratio tests/code ~0,91 — INVENTAIRE §3 | prouve | production |
| cat-dev-03 | **Gate spec (under/over-build)** | détecter ce que le code sous-livre ou sur-livre par rapport à la spec | `conductor (gate spec), remédiation bornée à 3` | testé par la suite de la forge (fakes) — jamais démontré sur produit réel | declare | experimental |
| cat-dev-04 | **Conductor bout en bout (CLI)** | lancer « idée → SaaS » en une commande | `uv run --project <forge> python -m conductor run "<idée>"` | inutilisable en headless (HITL fermés, NotImplementedError sans opt-in, exit toujours 0) — D-V1 | declare | experimental |
| cat-dev-05 | **Générer DESIGN.md linté** | produire le document design du produit accepté par le gate | `generer-design-md.mjs (D-V2 soldée le 07/08)` | PASS vérifié le 07/08 (CONTRAT-INTERFACE §5) | prouve | experimental |
| cat-dev-06 | **Gate anti-patterns IA** | bloquer imports fantômes, secrets en dur et routes sans auth avant merge | `conductor\gates\ai_antipatterns_gate.py` | TF-0103 (12/08) : 15 tests double sens, 0 faux positif sur conductor entier | prouve | experimental |
| cat-dev-07 | **Gate de mutation (3e métrique)** | mesurer la force réelle de mes tests, pas seulement leur couverture | `conductor\gates\mutation_gate.py + job CI mutation` | TF-0103 (12/08) : mesure réelle Docker 61,1 % (223/365) — honnête, sous seuil, consignée | prouve | experimental |

## forge-tests (pipeline) — 6 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-tst-01 | **Auditer une suite de tests** | savoir ce que mes tests couvrent vraiment et ce qui n'est pas exercé | `uv run python -m forge_tests <racine> --json [--sortie <fichier>]` | seule vraie CLI de l'écosystème ; run pilote 04/08 exit 3, couverture API 8/8 seuil 1.0, mutation 0.714 ≥ 0.70 | prouve | experimental |
| cat-tst-02 | **Générer des cas de tests en proposition** | recevoir des cas de tests prêts à adopter, sans pollution de mon projet | `uv run python -m forge_tests <racine> --generer <dossier-proposition>` | CLI vérifiée le 12/08 (--generer documenté « jamais dans le projet ») | prouve | experimental |
| cat-tst-03 | **Livrables de tests dérivés** | obtenir cahiers de tests, jeu de données synthétique et dashboard | `uv run python -m forge_tests <racine> --livrables <dossier-proposition>` | CLI vérifiée le 12/08 (option --livrables, régénérés à chaque audit) | prouve | experimental |
| cat-tst-04 | **Tendance et reprise ciblée** | comparer deux audits et ne rejouer que ce qui n'était pas vert | `uv run python -m forge_tests <racine> --precedent <r.json> \| --reprendre <r.json>` | CLI vérifiée le 12/08 (options --precedent et --reprendre documentées) | prouve | experimental |
| cat-tst-05 | **Inventaire sans exécution** | cartographier la surface de test sans rien exécuter | `env FORGE_TESTS_SANS_EXECUTION=1 + CLI` | documenté (INVENTAIRE §4) — non exercé isolément sur cas réel | declare | experimental |
| cat-tst-06 | **Impact par diff, flaky, propriétés, mutation par risque** | auditer moins mais juste : cibler par diff, isoler les flaky, proposer du property-based | `forge_tests\{impact,flaky,generateur_proprietes}.py · risque.repartir_mutants` | TF-0104 (12/08) : 14 tests dédiés dont 2 bout-en-bout git réel — CÂBLAGE CLI RESTANT (services non invocables par flag) | declare | experimental |

## forge-agents (transverse) — 6 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-agt-01 | **Fabriquer des agents spécialisés** | découper un workflow en agents outillés et vérifiés | `skill forge-agents (conversationnel) + compile-agent-def.mjs (fail-closed)` | deux runs réels bout en bout avec gates déclenchés ; propale P4 livrée | prouve | experimental |
| cat-agt-02 | **Ledger de run vérifiable** | journaliser tout run en JSONL auditable et vérifiable machine | `node .claude\skills\forge-agents\scripts\ledger.mjs verify <ledger.jsonl>` | contrat repris par le pilot (CONTRAT-INTERFACE §3) ; ledger du run pilote 23 entrées vérifié | prouve | production |
| cat-agt-03 | **Atelier des skills qualité** | héberger et faire évoluer les outils transverses de qualité | `sources vivantes dans le dépôt agents ; chaîne d'admission avec fixture rouge juge` | chaîne d'admission prouvée discriminante ; skills consommés quotidiennement par le pilot | prouve | production |
| cat-agt-04 | **Projection OTLP GenAI du ledger** | rendre mes runs lisibles par tout backend d'observabilité | `node .claude\skills\forge-agents\scripts\otlp-project.mjs <ledger>` | TF-0106 (12/08) : 0 span sur ledger corrompu (mesuré), self-test 17 PASS rejoué pilot | prouve | experimental |
| cat-agt-05 | **Oracle agent-evals** | détecter la régression sémantique d'un agent entre versions | `node .claude\skills\forge-agents\scripts\oracle-agent-evals.mjs` | TF-0106 (12/08) : fixtures double sens au self-test, juge distinct de l'exécutant | prouve | experimental |
| cat-agt-06 | **Gate budget G0** | plafonner les appels modèle d'un ticket avant l'appel, fail-closed | `.queue\gates\g0-budget.sh (hook PreToolUse)` | TF-0106 (12/08) : self-test 4 PASS + 2 SKIP motivés — ATTENTION : .queue non versionné (candidature ouverte) | prouve | experimental |

## forge-ops (transverse) — 5 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-ops-01 | **Déployer, restaurer, état** | déployer mon produit avec bascule saine et retour arrière prouvé | `node scripts\ops.mjs deployer\|restaurer\|etat <cible>` | self-test à preuve par le geste : déploiement réel local v1→v2 + rollback + 4 défauts refusés — 14 PASS | prouve | experimental |
| cat-ops-02 | **Verdicts d'exploitation O-1…O-4** | prouver que mon déploiement est sain et réversible | `node oracles\oracle-ops.mjs <cible> --json-only` | self-test 14 PASS ; consommés par M-1…M-5 de l'étape MEP | prouve | experimental |
| cat-ops-03 | **Plans cloud plan-first** | préparer un déploiement cloud sans exposer de credential | `node scripts\ops.mjs plan <cible> + oracle O-5` | plans livrés et O-5 PASS (TF-0081, 11/08) — exécution réelle par cible restant à consigner (D-P1) | prouve | experimental |
| cat-ops-04 | **Canary local simulé** | basculer progressivement avec critère de promotion explicite | `node scripts\ops.mjs canary <build> <cible> [--seuils f.json]` | TF-0107 (12/08) : promotion ET dégradation au palier 25 % prouvées au self-test (45 PASS rejoué pilot) | prouve | experimental |
| cat-ops-05 | **Drift O-6 et verdict rollback SLO** | détecter la dérive déclaré↔constaté et savoir quand recommander un retour arrière | `node oracles\oracle-ops.mjs --drift <f> <cible> · --verdict-rollback <mesures> --seuils <f>` | TF-0107 (12/08) : 3 classes de dérive invisibles à O1-O4, chacune PASS-avant/FAIL-après au self-test | prouve | experimental |

## forge-data (transverse) — 5 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-dat-01 | **Profiler (qualité en assertions)** | exprimer et vérifier la qualité de mes données en assertions exécutables | `node oracles\oracle-profiler.mjs <assertions.json>` | self-test double sens 15 PASS (fixtures synthétiques) ; barre Great Expectations (registre la-barre) | prouve | experimental |
| cat-dat-02 | **Tracer (lineage exigible)** | déclarer et vérifier le lineage complet de mes données | `node oracles\oracle-tracer.mjs <lineage.json>` | self-test 15 PASS ; barre OpenLineage (registre la-barre) | prouve | experimental |
| cat-dat-03 | **Restituer (chiffres sourcés)** | garantir que tout chiffre restitué est ancré à sa source | `node oracles\oracle-restituer.mjs <rapport.md>` | self-test 15 PASS ; barre dbt-core (registre la-barre) | prouve | experimental |
| cat-dat-04 | **Fonds de savoir data** | réutiliser les patterns éprouvés de rétro-ingénierie et de lineage | `references\ du dépôt data (lecture)` | documents anonymisés (zéro client vérifié par grep) — savoir, pas d'exécutable | declare | experimental |
| cat-dat-05 | **Contractualiser (data contract)** | sceller l'accord producteur↔consommateur en contrat vérifiable machine | `node oracles\oracle-contractualiser.mjs <contrat.json>` | TF-0108 (12/08) : fixtures double sens, self-test 30 PASS rejoué pilot ; ODCS statué « retenu » dans STANDARDS-DATA | prouve | experimental |

## forge-audit (sur mandat) — 4 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-aud-01 | **Référentiel d'audit POC-to-Prod** | auditer la gouvernance et l'architecture de mon produit vers la production | `core\ (adr, controls, dimensions, invariants.json) — dépôt public MIT, marque blanche AuditCore` | deux CI vertes (produit + engagement, iso-parité) ; 55/55 tests et lint N0 0 finding rejoués par le pilot le 12/08 | prouve | production |
| cat-aud-02 | **Oracles d'audit** | vérifier mécaniquement parcours et couverture fonctionnelle | `node oracles\smoke-parcours.mjs · node oracles\verifier-couverture-fonctionnelle.mjs` | exécutés en CI (produit + tenant) | prouve | production |
| cat-aud-03 | **Engagement d'audit par tenant** | mener un engagement client isolé consommant le référentiel | `dépôt d'engagement privé par client, consommant le produit en submodule pinné — sur mandat humain` | un engagement client réel complet, 2 CI vertes (produit + engagement, iso-parité) | prouve | production |
| cat-aud-04 | **Policy-as-code (démonstrateur OPA)** | transformer des contrôles déclaratifs en gate exécuté sur l'IaC | `profiles\policy-as-code\ (conftest via Docker)` | TF-0110 (12/08) : iac-verte 5/5 PASS, iac-rouge 5/5 FAIL nommant le CTL — démonstrateur, migration non faite | prouve | experimental |

## forge-seo (sur mandat) — 6 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-seo-01 | **Créer une mission d'audit SEO** | ouvrir une étude SEO outillée chez mon produit | `python scripts\new_mission.py (CLI stdlib)` | mission réelle complète livrée (auxportesdelabaie.fr) | prouve | production |
| cat-seo-02 | **Dérouler l'audit 87 nœuds** | auditer mon site en ligne sur toute la grille, preuves à l'appui | `seo\METHODE.md déroulée en session (mandat humain requis — jamais de déclenchement automatique)` | mission réelle : 67 nœuds mesurés / 20 hors périmètre, HTML 6e itération, CSV 24 colonnes | prouve | production |
| cat-seo-03 | **Valider forge et mission** | vérifier mécaniquement l'intégrité de la forge et d'une mission | `python scripts\validate.py [--mission <chemin>]` | exécuté 9/9 (forge) et 5/5 (mission réelle) | prouve | production |
| cat-seo-04 | **Rapport HTML vérifié** | recevoir un rapport d'audit autonome et contrôlé avant remise | `python scripts\rapport_html.py --verifier` | rapport client réel livré (6e itération), contrôles exécutés | prouve | production |
| cat-seo-05 | **Runs de suivi récurrents** | suivre l'évolution SEO d'un site entre deux audits | `méthode documentée (récurrence post-MEP)` | jamais exercé — un seul run réel à ce jour ; snapshot en dérive de schéma (D-S2) | declare | experimental |
| cat-seo-06 | **Instrumentation de crawl avancée** | mesurer aussi les sites JS, le balisage, les CWV terrain et les crawlers IA | `python scripts\{crawler.py --rendu-js, crux.py, agents_ia.py}` | TF-0105 (12/08) : 22 tests de preuve + validate 12/12 rejoué pilot ; intégration rapport en restes | prouve | experimental |

## forge-organization (sur mandat) — 4 services

| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |
|---|---|---|---|---|---|---|
| cat-org-01 | **Doctrine des conventions** | disposer de conventions arbitrées pour tous les projets | `conversationnel — documents comme points d'accroche (proposés au pilot, qui encode dans REGLES-PROJET.md)` | oracle-conventions mécanise D-02/03/04/05/06/09/10 et déclare SANS_OBJET motivé les 5 restantes ; 12 décisions au format MADR (ids stables) ; PASS sur le dépôt lui-même (TF-0109, rejoué pilot) | prouve | experimental |
| cat-org-02 | **Composant filtres-tableau** | réutiliser un composant de filtres de tableau vérifié | `node output\composant-filtres-tableau\oracle-filtres-tableau.mjs` | oracle vérifié dans les deux sens (fixtures rouge/verte) | prouve | experimental |
| cat-org-03 | **Études normatives** | ancrer les pratiques sur les normes du métier | `conversationnel` | étude documentée — contrôles proposés non implémentés | declare | experimental |
| cat-org-04 | **Gate de conventions packagé** | vérifier les conventions en pre-commit/CI sans dépendre de la forge | `node output\gate-conventions\gate-conventions.mjs [--staged]` | TF-0109 (12/08) : self-test 6/6 + 2 robustesse, rejoué pilot ; PROPOSÉ aux dépôts, jamais déployé d'office | prouve | experimental |

---

Règles : source unique `catalogue.jsonl` (écrivain unique : pilot) · ids stables, évolution sous table de correspondance (CONTRAT-INTERFACE §3 bis) · toute correction ou ajout passe par candidature TODO-FORGE, jamais par édition directe · barre de niveau : Backstage Software Catalog (registre la-barre).
