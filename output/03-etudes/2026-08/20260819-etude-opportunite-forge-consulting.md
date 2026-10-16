# Étude d'opportunité — « forge-consulting » (conseil de bout en bout) — 20260819c

Instruite au gabarit `gabarits\ETUDE-OPPORTUNITE.md`. Périmètre d'écriture : ce fichier et
son sidecar de candidature. Aucune forge créée, aucun run type ajouté, aucun commit —
décision humaine (R-29). Troisième étude du mandat du 19/08 ; elle cite les études 1 et 2
(`20260819a`, `20260819b`). Le nom « forge-consulting » est traité comme HYPOTHÈSE de la
demande, jamais comme décision.

## Seuil de déclenchement (vérifié AVANT rédaction)

- **Crée un objet durable** — oui, quelle que soit l'option de construction (type de run,
  gabarits, ou dépôt — R-31, `REGLES-PROJET.md` l.239). **Porte franchie.**
- **Touche ≥ 3 forges ou le noyau** — oui : la demande cite elle-même la remise aux
  forges aval (conception, design, development, tests, MEP) — le noyau d'orchestration
  est touché.
- **Gain ≥ 3 avec preuve ≤ 2** — oui : gain estimé 3, preuve 1 (aucune mission de
  conseil consignée nulle part dans l'écosystème). Étude obligatoire.

## 0. Traitement des entrants

La demande instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.

- **Demande humaine du 19/08** (verbatim, phrase-fleuve conservée) : « reprendre des
  besoins et problématiques (charge, performance, temps de réponse, coûts...), CDC,
  spécifications fonctionnelles ou techniques, architectures, solutions techniques ;
  fournir directions/pistes, solutions fonctionnelles et/ou techniques, corrections,
  améliorations, optimisations ; construire un lotissement et une ou plusieurs
  planifications de construction et migration d'applications et de bases de données,
  avec démarches de ROI et MEP de lots utiles, utilisables, utilisés ; puis passer la
  main aux forges aval. »
- Conformément au mandat, la phrase-fleuve est PARTITIONNÉE en blocs disjoints (§1) et
  chaque bloc est testé séparément contre l'existant (§2) — un verdict global sur le
  bloc indivis serait invérifiable.
- **Antériorité** : grep du 19/08/2026 sur `todo\TODO.jsonl` et
  `insatisfactions\REGISTRE.jsonl` — 0 candidat, 0 insatisfaction sur le conseil.

## 1. Partition du problème

Partition de la phrase-fleuve en cinq blocs disjoints + une coordonnée transverse :

- **C1 — Reprise d'entrants** : besoins, problématiques, CDC, spécifications,
  architectures, solutions proposées — les qualifier en matière exploitable.
- **C2 — Diagnostic** : problèmes de charge, performance, temps de réponse, coûts —
  mesurer et objectiver avant de recommander.
- **C3 — Recommandation** : directions, pistes, solutions, corrections, optimisations —
  produire un avis opposable avec alternatives.
- **C4 — Lotissement et planification** : découpage en lots « utiles, utilisables,
  utilisés », planification de construction et de migration (applications ET bases),
  démarche de ROI.
- **C5 — Interface aval** : le contrat de passage aux forges (quel artefact de sortie
  du conseil devient l'entrant de quelle forge).
- **T — Hébergement** : run type du pilot vs nouvelle forge vs extension de skills.

## 2. Non-recouvrement contre l'existant

Chaque ligne porte une citation vérifiable, relue le 19/08/2026 en lecture seule.
Une ligne par bloc au minimum ; le bloc couvert est nommé dans le verdict.

| Existant examiné | Citation | Verdict |
|---|---|---|
| Skill `qualifie-l-entrant` | `SKILL.md` l.3 : « idée, cahier des charges, produit à reprendre… en déterminant son type, le protocole d'extraction applicable » | **recouvre C1** — la reprise de CDC/spécifications est son objet exact ; seule la matière « problématique d'exploitation » (charge, coûts) n'est pas un de ses types d'entrant |
| Skill `clarifie-une-idee` | `SKILL.md` l.3 : « trois phases — clarifier, challenger (analyse des angles morts et de la faisabilité), mettre en œuvre » | recouvre l'amont de C1 (besoin encore flou) — composé par `qualifie-l-entrant` lui-même |
| Skill `contre-expertise` | `SKILL.md` l.3 : « contre-expertise de fond d'un livrable fini — résultat, document, solution ou architecture proposée — … verdict Valider/Renforcer/Reprendre … top 5 corrections impact×effort » | **recouvre C3 partiellement** — le challenge d'une solution EXISTANTE est couvert ; la production d'une recommandation neuve depuis un diagnostic ne l'est pas |
| forge-audit — référentiel | `catalogues\CATALOGUES.md` l.110, cat-aud-01 : « auditer la gouvernance et l'architecture de mon produit vers la production » (2 CI vertes, 55/55) | recouvre C2 partiellement — le diagnostic GOUVERNANCE/architecture existe sur mandat ; charge, performance, temps de réponse, coûts n'ont pas de contrôle versionné |
| forge-observability | `fiches\forge-observability.md` (via `catalogues\CATALOGUES.md` l.100 et suiv.) : « Observer (plans → snapshots) · Détecter la dérive » | recouvre C2 partiellement — sondes techniques entre les runs ; pas de diagnostic de coût ni de restitution conseil |
| forge-data — mesurer | `catalogues\CATALOGUES.md` l.96, cat-dat-08 : requêtes lecture seule sur base connectée, « tout chiffre restitué remonte à sa source » (prouvé RD-3) | recouvre l'instrument de C2 côté données — à composer, rien à créer |
| Skill `redige-les-exigences` — paliers | `SKILL.md` l.3 et l.57 : « palier MVP · V1 · V2 », « arbitrer un périmètre MVP » | **recouvre C4 partiellement** — le lotissement PRODUIT (paliers) existe ; la planification datée, la migration et le ROI n'y sont pas |
| Skill `digit-ai-propale` | `SKILL.md` l.5-14 : « découpage en lots, chiffrage encadré … de transformer un diagnostic ou des notes de RDV en proposition, ou de produire le lot suivant » | **recouvre C4 partiellement** — lotissement + chiffrage COMMERCIAL prouvés en usage ; c'est une propale, pas un plan d'exécution ni une démarche de ROI suivie |
| Skill `digit-ai-prospection` | `SKILL.md` l.3 : « diagnostic métier 6 cartes, 10-15 cas d'usage avec scoring ICE chiffré … préparer un diagnostic pré-commercial » | recouvre l'amont commercial de C2/C3 — pré-vente, pas une mission de conseil sur un SI existant |
| Skill `pilote-de-mission` | `SKILL.md` l.1-10 : « construit le plan (workstreams, étapes typées, … chemin critique), anime la co-exécution … adapte le plan » — « pour tous types de missions (projet perso, mission client, réponse à AO, projet forge) » | **recouvre C4 partiellement** — la planification et le suivi génériques existent ; le CONTENU conseil (lots de migration, ROI) vit dans l'instance, non outillé |
| forge-ops — plans cloud | `catalogues\CATALOGUES.md` l.81, cat-ops-03 : « plans déterministes 4 phases (rollback exigé) », 4 cibles cloud, fiches expert admises (`fiches\forge-ops.md` l.22-27) | recouvre C4 partiellement — la planification de MIGRATION côté cible cloud existe en mode plan ; la migration de bases et le séquencement multi-lots n'y sont pas |
| Protocole d'accueil du pilot | `references\ACCUEIL.md` l.1-39 : « Identifier l'intention … Identifier les forges impliquées … Proposer la démarche … Attendre l'accord explicite » | **recouvre C5 partiellement** — le routage intention → démarche existe pour les intentions de BUILD ; aucune situation « conseil » dans le routage (l.53 : « Routage intention → situation ») |
| Types de run existants | `references\RUN-MANDAT.md` l.45-50 (« la remise du livrable EST la fin du run ») et `references\RUN-VERSION.md` l.4-9 | ne recouvre pas — le run-mandat livre UN livrable d'expertise ; aucune trajectoire multi-lots avec ROI suivi et remises successives aux forges |

En une phrase : chaque bloc de la phrase-fleuve est couvert en fragments — souvent
prouvés — par 7 objets au moins ; ce qui n'existe nulle part, c'est le FIL : une
trajectoire de mission conseil qui enchaîne C1→C5 avec un contrat d'interface vers les
forges, et le diagnostic d'exploitation (charge/coûts) outillé.

## 3. État de l'art daté

Sources relevées par recherche web exécutée le 2026-08-19 ; chiffres relayés par sources
secondaires, non vérifiés aux sources primaires — aucun ne fonde seul le verdict.

- **Gartner (relayé par contus.com, consulté le 2026-08-19)** : 40 % des applications
  d'entreprise incorporeraient des agents IA d'ici 2026 (moins de 5 % en 2025) — la
  demande de conseil outillé par agents est un marché réel.
- **Gartner (relayé par codebridge.tech, consulté le 2026-08-19)** : plus de 40 % des
  projets d'IA agentique seraient annulés d'ici fin 2027 — l'argument anti-O0 est
  aussi l'argument anti-précipitation : le taux d'échec du domaine est élevé.
- **Hyperscalers (relayé par cloudconsultingfirms.com, consulté le 2026-08-19)** :
  outillage de migration agentique livré entre fin 2025 et T1 2026, compression
  estimée des délais de migration de 30-40 % (estimation McKinsey relayée) — le bloc
  C4-migration a des références industrielles récentes.
- **Taux d'abandon (même source, consulté le 2026-08-19)** : 42 % des entreprises
  auraient abandonné la plupart de leurs initiatives IA en 2025 (17 % l'année
  précédente), faute de gouvernance et de propriété opérationnelle — ce qui plaide
  pour un conseil ancré sur des preuves exécutées, le différenciant réel de la forge.
- **Panorama des cabinets (alphaapexgroup.com, consulté le 2026-08-19)** : l'offre
  « AI readiness assessment, architecture design, governance planning » est
  standardisée chez les cabinets — la valeur distinctive n'est pas le contenu du
  conseil mais son régime de preuve.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : RÉFUTÉE partiellement, retenue partiellement. Retenue pour
  les blocs C1 et C3 : la reprise d'entrants et le challenge de solutions sont
  couverts (`qualifie-l-entrant`, `contre-expertise` — tableau §2) ; rien à créer.
  Réfutée pour le fil C1→C5 : aujourd'hui une demande de conseil arrivant à l'accueil
  n'a AUCUNE situation de routage (`references\ACCUEIL.md` l.53) — elle serait
  improvisée, en contradiction avec le README (« N'improvise pas »). Coût du statu
  quo : chaque mission de conseil réelle se déroulerait hors protocole, sans ledger
  ni oracles — le contraire de la doctrine du dépôt.
- **O1 — run type « conseil » au pilot** : un `references\RUN-CONSEIL.md` (patron
  RUN-MANDAT/RUN-VERSION) qui enchaîne les capacités EXISTANTES : C1 par
  `qualifie-l-entrant`, C2 par composition (cat-dat-08, forge-audit,
  forge-observability) plus un gabarit de diagnostic d'exploitation à créer, C3 par
  `contre-expertise` étendue en mode « recommandation », C4 par `redige-les-exigences`
  (paliers) + `pilote-de-mission` (plan daté) + gabarit ROI à créer, C5 par une
  situation « conseil » ajoutée au routage d'ACCUEIL, chaque lot sortant comme
  PROMPT-PRODUIT d'un run de build. Coût : 2 gabarits + 1 type de run + routage +
  oracle de livrable conseil ; aucune forge nouvelle. Exclut : tout moteur de
  diagnostic automatique (le diagnostic reste instruit par mission).
- **O2 — nouvelle forge-consulting (14e dépôt)** : exclue. Le tableau §2 montre 7+
  recouvrements partiels : la forge dédiée serait à plus de 80 % de la délégation vers
  l'existant, pour un coût de possession permanent (bootstrap, fiche, catalogue,
  self-test, R-31) — et avec preuve du besoin = 1 (aucune mission consignée), c'est
  l'exact profil des 40 % de projets agentiques annulés cités en §3.
- **O3 — extension des seuls skills commerciaux** (`digit-ai-propale` +
  `pilote-de-mission`) : exclue — elle couvrirait C4 mais laisserait C2 (diagnostic
  outillé) et C5 (interface forges) orphelins, et le conseil resterait hors ledger.
- **O4 — différer jusqu'à une première mission réelle** : réfutée de justesse — la
  preuve du besoin est faible (preuve 1), mais différer sans même le routage d'accueil
  garantit que la première mission réelle sera improvisée ; le coût de O1 est
  suffisamment bas pour précéder la demande. La clause de revue (§5) rend ce pari
  falsifiable : sans mission réelle au rendez-vous, O4 redevient le verdict.

## 5. Verdict

- **Option retenue** : O1 — run type « conseil » orchestrant l'existant (aucune
  nouvelle forge), avec deux gabarits neufs (diagnostic d'exploitation, démarche ROI),
  une situation « conseil » au routage d'accueil, et un contrat d'interface C5 :
  chaque lot du conseil sort comme entrant de build (PROMPT-PRODUIT rempli ou
  ENTRANT.md), traçé au ledger.
- **Coût** : 4-6 jours ; dette assumée : le diagnostic d'exploitation naît en gabarit
  instruit (déclaré), son outillage viendra des mesures réelles de la première
  mission.
- **Candidature émise** : `input\01-candidatures\candidature-run-conseil.tf.jsonl`
  (sidecar, en attente de GO humain — score preuve 1 assumé et affiché).
- **Plan de revue** : 2026-10-01 — si aucune mission de conseil réelle n'a exercé le
  run type, requalifier vers l'option de report (O4) et retirer la candidature ; si
  une mission a eu lieu, consigner ce que le run type n'a pas su tenir.

## Interdits (tenus)

Aucun critère subjectif ; jeu fermé tenu ; chaque ligne de non-recouvrement citée bloc
par bloc ; sources datées et marquées relayées ; O0 traitée bloc par bloc, jamais
passée sous silence ; le nom « forge-consulting » n'a pas survécu à l'instruction.
