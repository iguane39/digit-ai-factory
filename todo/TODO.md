# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=8dffcc7e4731 archive=3eb4a8fa16f9 · dernier événement: 2026-08-12T06:52:47.897Z -->

**18 actifs** (candidat 17 · décidé 0 · en cours 1 · corrigé 0 · écarté 0) · **96 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0106 | candidat | 2 | Agents : projection OTLP GenAI du ledger, budget gate avant appel modèle et oracle d'évals LLM-as-judge sur fixtures de régression | **oui** — les mesures de routage §4 bis se font aujourd'hui à la main depuis les relevés du harnais ; sans evals versionnées, une régression de qualité d'un agent ne se détecte qu'à l'incident |

## audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0110 | candidat | 2 | Audit : dimension « gouvernance IA » (ISO 42001 / NIST AI RMF / EU AI Act), policy-as-code OPA sur un sous-ensemble des 169 contrôles, FinOps 2026 et pilier soutenabilité | **oui** — un engagement client 2026 qui demande la conformité EU AI Act ne trouve aujourd'hui aucune dimension pour l'instruire ; les contrôles non exécutables se vérifient à l'œil — coût de revue et risque d'écart à chaque engagement |

## conception

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0101 | candidat | 3 | Conception : scoring EARS par patron strict, « constitution » projet et deltas OpenSpec pour les runs de version | **oui** — chaque exigence mal formée passe le gate binaire actuel et se paie en aval (tests intraçables, under-build détecté tard) ; le run de version rattrape le socle à la main faute de deltas outillés |

## data

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0108 | candidat | 2 | Data : 4e verbe « contractualiser » (data contracts ODCS v3.1), lineage au grain colonne et pont natif entre lineage@1 et les facets qualité OpenLineage | **oui** — sans contrat, tout écart producteur/consommateur se découvre à l'exécution chez le consommateur ; sans grain colonne, un chiffre restitué reste traçable seulement jusqu'au fichier — insuffisant pour l'audit d'un chiffre contesté |

## design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0102 | candidat | 3 | Design : pipeline tokens DTCG-first (tokens.css dérivé, plus source), baseline de régression visuelle versionnée et studio-de-direction enfin exercé | **oui** — sans baseline, chaque revue graphique repart de zéro et une régression visuelle entre deux runs est indétectable ; sans DTCG, aucun pont outillé entre maquette, Figma et code — extraction manuelle à chaque marque |

## development

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0103 | candidat | 2 | Development : isolation sandbox du mode unattended, score de mutation au gate, et contrôles CI spécifiques au code généré par IA | **oui** — un agent à effets réels non isolé peut endommager le poste (incidents 2026 documentés) ; une suite verte à couverture haute mais mutation faible laisse passer du code IA faux — le coût se paie au premier produit client |

## ops

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0107 | candidat | 2 | Ops : canary local simulé, oracle O-6 de drift déclaré↔constaté et verdict « rollback recommandé » à seuils SLO fixés par l'humain | **oui** — O-2 ne rejoue le healthcheck qu'une fois : une dégradation qui apparaît 2 minutes après bascule n'est vue par personne jusqu'à l'utilisateur ; premier run MEP cloud (D-P1) exposé |

## organization

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0109 | candidat | 3 | Organization : mécaniser les 8 décisions sans oracle, convertir D-01→D-12 au format MADR et packager un gate de conventions invocable en PR | **oui** — 8 décisions sur 12 ne peuvent ni PASS ni FAIL : la doctrine est déclarative là où la loi du pilot exige l'oracle exécuté ; le recouvrement D-01→D-12 ↔ REGLES-PROJET.md (D-O3) reste irréconciliable tant que les décisions n'ont pas d'ids stables |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0113 | candidat | 3 | Fraîcheur documentaire : INVENTAIRE.md et fiches dérivent du réel (3 écarts constatés en une campagne) — oracle de fraîcheur transverse à instruire | **oui** — cette campagne a failli publier deux comptages faux dans le catalogue public (corrigés in extremis sur vérification) ; toute décision de routage prise sur l'INVENTAIRE périmé hérite de l'erreur |
| TF-0111 | candidat | 1 | Nouvelle forge candidate : sécurité agentique (scan des tool calls, fixtures rouges d'attaques, red-teaming des agents compilés) | **oui** — le mode unattended de development et les campagnes multi-agents du pilot exécutent des tool calls sans aucune inspection — un skill ou un entrant compromis a aujourd'hui le champ libre jusqu'au garde-fou git |
| TF-0112 | candidat | 1 | Nouvelle forge candidate : observabilité continue (dérive data, revue par commit, veille citation IA) — le trou transverse « one-shot vs continu » | **oui** — entre deux runs, personne ne regarde : une dérive de données, une régression de tests ou une chute de visibilité IA ne se découvre qu'au run suivant — des semaines plus tard sur un produit en production |

## seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0073 | en_cours | 1 | Rapatrier la production du CSV d'actions scoré (livrables-gen.py de la mission) — complément de TF-0056 | **oui** — le BOM du CSV réel trahit déjà un producteur hors forge |
| TF-0105 | candidat | 4.5 | SEO : rendu JavaScript optionnel au crawl (Playwright), extraction JSON-LD automatisée, collecte CrUX outillée et ventilation du trafic des crawlers IA | **oui** — sur tout site JS-heavy, l'audit actuel sous-mesure structurellement deux nœuds sans le signaler — risque direct sur un livrable client facturé ; la collecte CWV manuelle n'est pas reproductible d'un auditeur à l'autre |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0104 | candidat | 4.5 | Tests : sélection par diff de code (test impact analysis), détection de flaky tests, squelettes property-based en proposition et échantillonnage de mutation piloté par le risque | **oui** — un audit complet coûte des dizaines de minutes là où un diff n'exige que quelques tests ; un flaky non détecté rend le verdict mutation non reproductible — le juge devient lui-même non fiable |
| TF-0097 | candidat | 4 | forge-tests suppose une arborescence au lieu de lire la configuration que le projet déclare — deux pans rendus non mesurables à tort | **oui** — payé en réel le 11/08 : deux pans sur douze déclarés non mesurables à tort, avec un motif affirmant l'inexistence d'artefacts que l'audit venait de faire tourner |
| TF-0098 | candidat | 3 | forge-tests lance `npx playwright test` sans vérifier qu'une config Playwright existe — « suite e2e en échec » au lieu de « aucune suite e2e » | **oui** — payé en réel le 11/08 : l'action rendue au rapport envoyait réparer une suite qui n'existe pas, en affirmant qu'elle est rouge |
| TF-0099 | candidat | 3 | Le scan de secrets n'est pas borné aux sources du produit — 11 « fuites » toutes situées dans des dépendances | **oui** — payé en réel le 11/08 : 3 findings bloquants du pan securite sur 3 n'accusent aucune ligne du produit audité |
| TF-0100 | candidat | 2.7 | Routage react-router non reconnu : 8 routes réelles inventoriées à zéro, trois pans emportés en cascade, et le motif du SKIP nomme la mauvaise cause | **oui** — payé en réel le 11/08 : trois pans sur douze non mesurés sur les deux cycles, et un motif de SKIP qui a envoyé chercher un build, un npm et un navigateur tous les trois présents |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
