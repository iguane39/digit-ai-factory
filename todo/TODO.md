# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=5457b2dd2341 archive=3eb4a8fa16f9 · dernier événement: 2026-08-12T10:30:23Z -->

**30 actifs** (candidat 0 · décidé 0 · en cours 0 · corrigé 30 · écarté 0) · **96 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0118 | corrige | 9 | forge-agents : gates G1-G3 en fail-open quand jq est absent — le garde-fou s'efface exactement quand l'environnement est dégradé | **oui** — un gate qui laisse passer en environnement dégradé est pire qu'aucun gate : il donne l'illusion du contrôle — l'anti-serial-collapse ne protège actuellement que les postes bien équipés |
| TF-0119 | corrige | 9 | forge-agents : .queue/ n'a jamais été versionné — les gates G0-G3 (hooks de sécurité) ne vivent que sur le poste | **oui** — les gates anti-serial-collapse et budget sont documentés comme actifs mais n'existent sur aucun poste équipé par bootstrap — la protection annoncée au catalogue est fantôme hors du poste d'origine |
| TF-0106 | corrige | 2 | Agents : projection OTLP GenAI du ledger, budget gate avant appel modèle et oracle d'évals LLM-as-judge sur fixtures de régression | **oui** — les mesures de routage §4 bis se font aujourd'hui à la main depuis les relevés du harnais ; sans evals versionnées, une régression de qualité d'un agent ne se détecte qu'à l'incident |

## audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0110 | corrige | 2 | Audit : dimension « gouvernance IA » (ISO 42001 / NIST AI RMF / EU AI Act), policy-as-code OPA sur un sous-ensemble des 169 contrôles, FinOps 2026 et pilier soutenabilité | **oui** — un engagement client 2026 qui demande la conformité EU AI Act ne trouve aujourd'hui aucune dimension pour l'instruire ; les contrôles non exécutables se vérifient à l'œil — coût de revue et risque d'écart à chaque engagement |

## conception

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0114 | corrige | 6 | Conception : self-test structurellement rouge sur poste Windows — le SHA-256 de la fixture verte diverge par conversion CRLF (core.autocrlf) | **oui** — le self-test annonce SELF-TEST ROUGE — 1 anomalie sur un poste Windows standard : tout agent qui l'exécute doit ré-enquêter la fausse alerte, et un vrai défaut T3 serait noyé |
| TF-0101 | corrige | 3 | Conception : scoring EARS par patron strict, « constitution » projet et deltas OpenSpec pour les runs de version | **oui** — chaque exigence mal formée passe le gate binaire actuel et se paie en aval (tests intraçables, under-build détecté tard) ; le run de version rattrape le socle à la main faute de deltas outillés |

## data

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0108 | corrige | 2 | Data : 4e verbe « contractualiser » (data contracts ODCS v3.1), lineage au grain colonne et pont natif entre lineage@1 et les facets qualité OpenLineage | **oui** — sans contrat, tout écart producteur/consommateur se découvre à l'exécution chez le consommateur ; sans grain colonne, un chiffre restitué reste traçable seulement jusqu'au fichier — insuffisant pour l'audit d'un chiffre contesté |

## design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0102 | corrige | 3 | Design : pipeline tokens DTCG-first (tokens.css dérivé, plus source), baseline de régression visuelle versionnée et studio-de-direction enfin exercé | **oui** — sans baseline, chaque revue graphique repart de zéro et une régression visuelle entre deux runs est indétectable ; sans DTCG, aucun pont outillé entre maquette, Figma et code — extraction manuelle à chaque marque |

## development

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0120 | corrige | 3 | forge-development : score de mutation du conductor à 61,1 % — renforcer les tests puis rendre le job mutation bloquant | **oui** — 39 % des mutants survivent à une suite de 337 tests verts : la couverture actuelle donne une confiance partiellement illusoire sur le code du conducteur lui-même |
| TF-0103 | corrige | 2 | Development : isolation sandbox du mode unattended, score de mutation au gate, et contrôles CI spécifiques au code généré par IA | **oui** — un agent à effets réels non isolé peut endommager le poste (incidents 2026 documentés) ; une suite verte à couverture haute mais mutation faible laisse passer du code IA faux — le coût se paie au premier produit client |

## ops

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0107 | corrige | 2 | Ops : canary local simulé, oracle O-6 de drift déclaré↔constaté et verdict « rollback recommandé » à seuils SLO fixés par l'humain | **oui** — O-2 ne rejoue le healthcheck qu'une fois : une dégradation qui apparaît 2 minutes après bascule n'est vue par personne jusqu'à l'utilisateur ; premier run MEP cloud (D-P1) exposé |

## organization

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0109 | corrige | 3 | Organization : mécaniser les 8 décisions sans oracle, convertir D-01→D-12 au format MADR et packager un gate de conventions invocable en PR | **oui** — 8 décisions sur 12 ne peuvent ni PASS ni FAIL : la doctrine est déclarative là où la loi du pilot exige l'oracle exécuté ; le recouvrement D-01→D-12 ↔ REGLES-PROJET.md (D-O3) reste irréconciliable tant que les décisions n'ont pas d'ids stables |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0124 | corrige | 6 | Profils produit website/webapp/mobile : référentiels versionnés du pilot consommés par les forges — pas de nouvelles forges | **oui** — aujourd'hui le savoir par type de produit est implicite (development suppose la webapp SaaS, design porte M1-M6 sans profil déclaré) : chaque run le redécouvre en session — un profil daté-sourcé le rend routable par ACCUEIL et challengeable en fraîcheur |
| TF-0123 | corrige | 4.5 | Nouvelle forge : sécurité du produit web livré (proposition : digit-ai-forge-websec) — verbes outillés prouvés, échéance CRA 09/2026 | **oui** — aucun service de l'écosystème ne juge l'exposition runtime ni les dépendances vulnérables d'un produit livré ; le CRA rend le signalement obligatoire dès le 11/09/2026 — chaque MEP d'ici là part sans contrat de sécurité vérifiable |
| TF-0125 | corrige | 4 | R-28 : critère d'admission d'une nouvelle forge — verbes outillés + née exercée + cadence propre + surfaces le jour même ; un corpus sans verbe = référentiel | **oui** — sans critère encodé, chaque proposition de forge rejoue le débat de zéro et le risque de forge-corpus (matrice type × étape) reste ouvert — 4 candidatures en un jour l'ont prouvé |
| TF-0113 | corrige | 3 | Fraîcheur documentaire : INVENTAIRE.md et fiches dérivent du réel (3 écarts constatés en une campagne) — oracle de fraîcheur transverse à instruire | **oui** — cette campagne a failli publier deux comptages faux dans le catalogue public (corrigés in extremis sur vérification) ; toute décision de routage prise sur l'INVENTAIRE périmé hérite de l'erreur |
| TF-0115 | corrige | 3 | Généraliser oracle-fraicheur-doc par fichier de claims — 3 dérives documentaires supplémentaires trouvées en une seule campagne | **oui** — 4 dérives en 2 campagnes le même jour : la documentation ment plus vite que les oracles ne vérifient — chaque dérive coûte une ré-enquête ou publie du faux |
| TF-0111 | corrige | 1 | Nouvelle forge candidate : sécurité agentique (scan des tool calls, fixtures rouges d'attaques, red-teaming des agents compilés) | **oui** — le mode unattended de development et les campagnes multi-agents du pilot exécutent des tool calls sans aucune inspection — un skill ou un entrant compromis a aujourd'hui le champ libre jusqu'au garde-fou git |
| TF-0112 | corrige | 1 | Nouvelle forge candidate : observabilité continue (dérive data, revue par commit, veille citation IA) — le trou transverse « one-shot vs continu » | **oui** — entre deux runs, personne ne regarde : une dérive de données, une régression de tests ou une chute de visibilité IA ne se découvre qu'au run suivant — des semaines plus tard sur un produit en production |

## seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0121 | corrige | 6 | forge-seo : scoring.md écrit « quick win » (espace) là où snapshot.schema.json exige « quick-win » — la prose contredit le seul contrat contrôlé | **oui** — le vocabulaire est contrôlé à l'écriture depuis TF-0073 : chaque mission rédigée d'après la prose actuelle échouera au premier passage de scorer_actions.py |
| TF-0105 | corrige | 4.5 | SEO : rendu JavaScript optionnel au crawl (Playwright), extraction JSON-LD automatisée, collecte CrUX outillée et ventilation du trafic des crawlers IA | **oui** — sur tout site JS-heavy, l'audit actuel sous-mesure structurellement deux nœuds sans le signaler — risque direct sur un livrable client facturé ; la collecte CWV manuelle n'est pas reproductible d'un auditeur à l'autre |
| TF-0073 | corrige | 1 | Rapatrier la production du CSV d'actions scoré (livrables-gen.py de la mission) — complément de TF-0056 | **oui** — le BOM du CSV réel trahit déjà un producteur hors forge |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0116 | corrige | 9 | forge-tests : bug G-1 dans la version en cours d'édition de mutation.py (session tierce) — mutant non restauré après audit | **oui** — un mutant non restauré corrompt silencieusement le banc : tous les audits suivants mesurent un corpus faux — c'est un G-1 (le juge altère ce qu'il juge) |
| TF-0117 | corrige | 6 | forge-tests : dashboard du banc-rouge en échec check_html — « NULL » littéral ×24 dans les cellules d'un tableau | **oui** — le dashboard est un livrable client du cycle de tests : 24 « NULL » à l'écran sur le banc de démonstration même de la forge |
| TF-0122 | corrige | 5 | RÉGRESSION du correctif TF-0100 : une route non concrétisable fait tomber l'audit ENTIER (exit 2, aucun rapport) au lieu de sortir en non_juge | **oui** — payé en réel le 12/08 : ~50 min d'audit perdues et ZÉRO livrable produit, sur un projet dont les onze autres pans étaient mesurables — la régression coûte plus cher que le faux négatif qu'elle corrige |
| TF-0104 | corrige | 4.5 | Tests : sélection par diff de code (test impact analysis), détection de flaky tests, squelettes property-based en proposition et échantillonnage de mutation piloté par le risque | **oui** — un audit complet coûte des dizaines de minutes là où un diff n'exige que quelques tests ; un flaky non détecté rend le verdict mutation non reproductible — le juge devient lui-même non fiable |
| TF-0097 | corrige | 4 | forge-tests suppose une arborescence au lieu de lire la configuration que le projet déclare — deux pans rendus non mesurables à tort | **oui** — payé en réel le 11/08 : deux pans sur douze déclarés non mesurables à tort, avec un motif affirmant l'inexistence d'artefacts que l'audit venait de faire tourner |
| TF-0098 | corrige | 3 | forge-tests lance `npx playwright test` sans vérifier qu'une config Playwright existe — « suite e2e en échec » au lieu de « aucune suite e2e » | **oui** — payé en réel le 11/08 : l'action rendue au rapport envoyait réparer une suite qui n'existe pas, en affirmant qu'elle est rouge |
| TF-0099 | corrige | 3 | Le scan de secrets n'est pas borné aux sources du produit — 11 « fuites » toutes situées dans des dépendances | **oui** — payé en réel le 11/08 : 3 findings bloquants du pan securite sur 3 n'accusent aucune ligne du produit audité |
| TF-0100 | corrige | 2.7 | Routage react-router non reconnu : 8 routes réelles inventoriées à zéro, trois pans emportés en cascade, et le motif du SKIP nomme la mauvaise cause | **oui** — payé en réel le 11/08 : trois pans sur douze non mesurés sur les deux cycles, et un motif de SKIP qui a envoyé chercher un build, un npm et un navigateur tous les trois présents |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
