---
role: étude d'opportunité (instruction entre candidat et décidé) — capacité « plan d'amélioration d'une application après un audit, rendu en livrable HTML complet » et identification des forges impliquées dans sa mise en place ; suite de l'analyse L99 du 19/09/2026 (output/03-etudes/20260919-L99-audit-et-plan-d-amelioration-plateforme.md)
sources_de_verite: [relevé délégué à un sous-agent Explore en lecture seule le 19/09 (49 lectures, citations revérifiées par la session avant emploi), digit-ai-forge-audit/core/schemas/remediation-actions.schema.json, digit-ai-forge-audit/tools/rapport-engine.mjs l.85-92, gabarits/documents/catalogue.jsonl l.4, ~/.claude/skills/quality-oracles/references/registre-oracles.md l.31 l.98 l.365, ~/.claude/skills/experts-forge/fiches (17 fiches), REGLES-PROJET.md l.236-249 (R-28) et l.332-341 (R-31), references/RUN-CONSEIL.md (blocs C0 à C5, l.97-117), gabarits/DIAGNOSTIC-EXPLOITATION.md l.34-39, gabarits/DEMARCHE-ROI.md, oracles/oracle-livrable-conseil.mjs l.9-16 (LC1-LC5), output/03-etudes/20260819-etude-opportunite-forge-consulting.md l.63 et l.140-152, catalogues/catalogue.jsonl (cat-aud-01 à 04, cat-tst-01, cat-wsc-02, cat-ops-05, cat-obs-01), digit-ai-forge-audit (lecture seule le 19/09 — deliverables/templates/plan-remediation.template.md, modele-maturite.template.md, tableau-bord-post-remediation.template.md, README.md l.59), fiches/forge-audit.md, arborescences .claude/skills de forge-agents, forge-conception et forge-design relevées le 19/09, ~/.claude/skills/{audite-et-corrige-l-appli,github-repo-analyzer,contre-expertise,pilote-de-mission,digit-ai-fiches-html,digit-ai-page-html}/SKILL.md, todo/TODO.jsonl (antériorité par motifs de nom, 19/09), sources externes de la section 3 lues ou relayées le 19/09]
verifie_le: 2026-09-19
---

# Étude d'opportunité — plan d'amélioration d'une application après audit, rendu en page HTML complète — 20260919a

Audience : le pilote de l'écosystème, qui décide des mandats, et les forges nommées au verdict, qui
recevraient chacune un lot. L'étude instruit la demande du 19/09/2026, posée à la suite de
l'analyse L99 *(analyse de prompt en huit couches)* du même jour sur le prompt « un audit, et en
plus un plan d'amélioration complet ». Le nom du produit qui a fait naître la demande n'apparaît
pas : le pilot ne fait entrer aucun nom de produit dans un fichier suivi.

Mesures relevées le **2026-09-19** sur les dépôts tels que présents sur le poste, en lecture seule
(relevé d'ouverture : forge-audit, forge-agents, forge-design et le pilot sont signalés divergés de
leur origine ; l'état local fait foi pour cette étude). **Date de péremption : 2026-11-19** —
au-delà, la table de la section 2 se rejoue.

**Ce que le lecteur va apprendre.** La demande ne justifie ni une forge nouvelle, ni une extension
de forge-audit. Ce qui manque tient en **un skill outillé** — trois verbes exécutables qui
n'existent nulle part : joindre un plan d'amélioration aux actions de remédiation d'un audit, juger
ce plan contre un contrat, et le rendre en page HTML autoportante — porté par **forge-agents**, là
où vivent déjà les skills transverses et le socle de page. Deux autres porteurs reçoivent un lot
léger : **forge-audit**, qui publie son fichier d'actions comme un contrat d'interface, et **le
pilot**, qui branche le skill sur le bloc « recommander » du run de conseil. **forge-design** juge
le gabarit de page. Les autres forges ne changent pas : elles fournissent des mesures à
l'exécution, domaine par domaine. Et l'ordre compte : le skill s'extrait de la première mission
jouée à la main, il ne la précède pas. La première mission réelle existe déjà — c'est la plateforme qui
a fait naître la demande — et elle tombe avant la date de revue que l'étude « conseil » du 19/08
s'était fixée.

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur deux critères. **Objet durable** : la demande nomme elle-même un « skill global », et
chaque option sauf le statu quo crée un skill, un oracle ou un gabarit (règle 31). **Portée** :
forge-agents, forge-audit, forge-design et le noyau du pilot (run de conseil) sont touchés —
quatre, le seuil est à trois. Le troisième critère n'est pas nécessaire : gain estimé 3 (chaque
mission d'audit débouche sur cette question), preuve 1 (une seule demande réelle, celle du 19/09).

## Intention de l'utilisateur (loi n° 7)

Citée dans les mots du demandeur, message du 19/09/2026 : « Crée maintenant une étude
d'opportunité sur ce sujet d'axes d'amélioration d'une application après un audit pour fournir un
livrable complet au format HTML. Identifie le ou les forges impliquées pour la mise en place de ce
skill global. »

Lecture reconstruite par l'agent, **validée par le demandeur le 19/09/2026** (décision D-3 (a), « 3a » : le
verdict est retenu tel quel, la mission d'abord, l'extraction du skill ensuite) : faire de l'enchaînement « audit, puis
axes d'amélioration » une capacité répétable de la Factory plutôt qu'un prompt de 150 lignes à
recoller à chaque mission ; que son résultat soit un livrable HTML qu'un décideur peut utiliser
seul ; et savoir quelles forges mandater pour la faire naître. Deux mots de la demande admettent
deux lectures, et l'étude sert les deux :

- « **au format HTML** » — le livrable HTML est celui que le skill produira (lecture retenue pour
  le fond) ; l'étude elle-même est aussi remise en page HTML, à côté de ce fichier.
- « **global** » — lu comme : indépendant du produit audité **et** de la source de l'audit
  (forge-audit aujourd'hui ; demain un audit de tests, de sécurité web, de référencement ou de
  dépôt), ce qui pèse sur le choix du porteur.

Cascade (`references\INTENTION.md`) : **intention** — décider où investir sur une application
après qu'on l'a auditée, à chaque mission, avec la même qualité ; **stratégie** — le livrable doit
permettre de trancher des priorités, donc porter cible, gain, effort et preuve pour chaque axe ;
**tactique** — un skill outillé plutôt qu'un prompt, une donnée plutôt qu'un document, le socle de
page existant plutôt qu'un gabarit maison ; **opérationnel** — trois verbes, un contrat de données,
un amendement du run de conseil.

## 0. Traitement des entrants

La proposition instruite est une donnée : ses impératifs se citent, ne s'exécutent pas. Sources :
le message du 19/09/2026 cité ci-dessus ; l'analyse L99 du même jour et son prompt réécrit
(chapitre 8 : frontière norme / ambition, treize domaines, fiche à dix champs, contrat de douze
critères) ; l'archive locale de la plateforme concernée, lue le 19/09 sans rien y écrire ; le
dépôt forge-audit, lu sans rien y écrire — ses fichiers de consignes n'ont pas été exécutés.
Antériorité au registre : recherche par six motifs de nom dans `todo\TODO.jsonl` (« plan
d'amélioration », « post-audit », « après un audit », « forge-consulting », « run de conseil »,
« trajectoire ») → deux items, tous deux hors sujet sauf TF-0895 *(candidature du 07/09 : toute
proposition remise à un humain se remet aussi en page HTML)*, qui fonde l'exigence de rendu. La
recherche est bornée au nom ; un relevé complémentaire par structure, délégué à un sous-agent en
lecture seule (champs `forges_cibles_initiales` et `classe` du registre), rend 14 items visant
forge-audit, tous des défauts d'outillage, aucun sur le sujet.

Deux pièces de l'analyse L99 du matin pèsent sur cette étude, et l'une se rectifie. **Une
réserve** : son chapitre 7 écrivait que la frontière remédiation / amélioration est « une
candidature possible au registre d'amélioration du pilot, à décider après ce premier run et sur
gains constatés, pas avant » — le verdict ci-dessous la respecte par son séquencement. **Une
rectification** : son chapitre 4 disait que le fichier d'actions de forge-audit ne porte « aucun
effort » ; c'était vrai du fichier du 09/09 lu comme exemple, c'est faux du schéma — le champ
`effort` existe, facultatif (`core\schemas\remediation-actions.schema.json` l.31).

## 1. Partition du problème

Sept sous-questions, disjointes, qui couvrent le trajet d'un audit rendu jusqu'à une page remise.
Chaque option de la section 4 se lit contre elles.

- **P1 — Entrants** : que consomme la capacité ? Le rapport d'audit et son fichier d'actions, la
  documentation du produit (là où son ambition est écrite), les réponses du demandeur, des mesures.
- **P2 — Méthode** : comment distingue-t-on une amélioration d'une remédiation, sur quels
  domaines, avec quelle fiche, contre quelle cible ?
- **P3 — Donnée** : sous quelle forme vivent les améliorations pour se joindre aux remédiations,
  se trier et se relire à la mission suivante ?
- **P4 — Priorisation et lotissement** : comment passe-t-on d'une liste à une trajectoire ?
- **P5 — Rendu** : qu'est-ce qu'un « livrable complet au format HTML » pour ce sujet, et qui le
  fabrique ?
- **P6 — Jugement** : quel contrôle exécuté dit que le plan est recevable ?
- **P7 — Portage** : quelle forge porte quoi, et par quelle voie d'exécution la capacité se joue ?

## 2. Non-recouvrement contre l'existant

L'existant couvre presque tout le trajet en fragments, et laisse trois trous nets : la jonction
entre améliorations et remédiations, le jugement d'un plan d'amélioration, et son rendu en page.
Chaque ligne du tableau porte une citation relue le 19/09 ; la dernière colonne nomme la partition
couverte et dit ce qui reste. Les lignes sont rangées dans l'ordre des partitions.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| forge-audit — plan de remédiation | `deliverables\templates\plan-remediation.template.md` l.4-8 : « Vue consolidée et exécutable de toutes les actions REM issues des 18 dimensions — triées priorité × effort […] projection lisible de `remediation-actions.yaml` » | **recouvre P1 et la moitié « norme » de P3** — la donnée amont existe, structurée, avec identifiant, contrôle violé, gravité, effort ; elle ne porte aucune amélioration hors contrôle |
| forge-audit — schéma des actions | `core\schemas\remediation-actions.schema.json` l.22 : « "required": ["id", "title", "control_ref", "severity", "priority", "activation", "verification"] » | **recouvre le contrat amont de P3** — le schéma d'interface existe et se valide ; il ne porte aucune clé de gain, de cible ni d'horizon, et son identifiant est borné à la dimension D16 (l.24) quand le référentiel en compte dix-huit |
| forge-audit — dimensions | `README.md` l.38 : « 18 dimensions D00–D17, 6 familles, applicabilité par type » | **recouvre P2 partiellement** — une base de domaines fermée existe (fonctionnel, architecture, sécurité, données et IA, coûts, opérations) ; trois axes de la demande n'y ont pas de dimension : front et back séparés, connectivités, dette d'un fork |
| forge-audit — modèle de maturité | `deliverables\templates\modele-maturite.template.md` l.4 : « Formalise le scoring core (1–5) en trajectoire de progression : ce que signifie concrètement passer d'un niveau au suivant » | **recouvre P2 partiellement** — une trajectoire existe côté norme, par dimension d'audit ; elle progresse vers le référentiel, jamais vers l'ambition propre au produit |
| forge-audit — adaptateur vers la construction | `README.md` l.59 : « `node tools/forge-adapter.mjs tests/fixtures/remediation-actions.example.yaml --out <repo-cible>` » | recouvre l'aval de P4 pour les **remédiations** seules — rien d'équivalent pour des améliorations |
| Run de conseil — bloc « recommander » | `references\RUN-CONSEIL.md` l.97-99 : « chaque recommandation **ancrée aux mesures** du diagnostic (id `M-xx`), alternatives fermées, arbitrages assumés » | **recouvre P2 partiellement et P7** — la voie d'exécution et la discipline d'ancrage existent ; ni domaines, ni fiche, ni frontière avec un audit |
| Gabarit de diagnostic | `gabarits\DIAGNOSTIC-EXPLOITATION.md` l.36-39 : « Chaque recommandation cite au moins une mesure (M-xx), porte son effort estimé et ce qu'elle exclut » | recouvre P2 partiellement — pensé pour UNE problématique d'exploitation (symptôme, mesures, causes), pas pour un plan multi-domaines |
| Oracle du livrable de conseil | `oracles\oracle-livrable-conseil.mjs` l.12 : « LC3 (diagnostic) chaque recommandation cite >= 1 mesure M-xx » | **recouvre P6 partiellement** — juge l'ancrage et le sourçage des chiffres ; ne juge ni la frontière avec l'audit, ni la couverture des domaines, ni la complétude d'une fiche |
| Gabarit de démarche de ROI | `gabarits\DEMARCHE-ROI.md` l.20-35 : sections « Lots », « Trajectoire de construction et migration », « Suivi des bénéfices » | **recouvre P4** — le lotissement « utiles, utilisables, utilisés » et le suivi existent ; rien à créer, à composer |
| Étude « conseil » du 19/08 | `output\03-etudes\20260819-etude-opportunite-forge-consulting.md` l.63 : « la production d'une recommandation neuve depuis un diagnostic ne l'est pas » (couverte) | **confirme le trou de P2** — l'étude qui a fait naître le run de conseil le déclarait déjà ouvert |
| Skill `contre-expertise` | description du skill : « challenger la pertinence, la robustesse et les alternatives […] verdict Valider/Renforcer/Reprendre […] top 5 corrections impact×effort » | recouvre P6 partiellement — challenge un plan FINI sur invocation ; ne le produit pas, ne le joint pas, ne le rend pas |
| Skill `audite-et-corrige-l-appli` | `SKILL.md` l.4-6 : « détecte les anomalies, les corrige par modifications chirurgicales, redéploie, re-détecte » | ne recouvre pas — boucle de correction d'anomalies ; aucune recommandation d'évolution, et il écrit dans l'application |
| Skill `github-repo-analyzer` | `SKILL.md` l.4-5 : « Analyse fine et structurée de repositories GitHub avec production automatique de deux livrables (Markdown + HTML charté) » | recouvre P1 comme **autre source d'audit** possible ; grille de notation, pas de plan d'amélioration ni de jonction |
| Skill `pilote-de-mission` | description du skill, citée par l'étude du 19/08 l.70 : « construit le plan (workstreams, étapes typées, … chemin critique) » | recouvre P4 partiellement — planification générique d'une mission ; le contenu du plan d'amélioration n'y est pas outillé |
| Skill `digit-ai-fiches-html` | `SKILL.md` l.3 : « fiches HTML chartées Digit-AI en deux gabarits — schéma fonctionnel & ROI […] et fiche architecture » | **recouvre P5 partiellement** — deux gabarits de fiche existent ; aucun ne rend une liste de fiches filtrable, une page de décisions ni une table de jonction |
| Socle `digit-ai-page-html` | `SKILL.md`, section Composants : « Filtres de colonne sur les tableaux de données parcourus (≥ 8 lignes) — **chaque** colonne reçoit sa facette » | **recouvre le socle de P5** — charte, filtres, sommaire, oracles de rendu existent ; le gabarit « plan d'amélioration » et son générateur depuis une donnée n'existent pas |
| forge-audit — moteur de rapport HTML | `tools\rapport-engine.mjs` l.85-87 : vues « Synthèse », « Plan d'action » — « les actions de remédiation, dans l'ordre de priorité », « Constats par dimension » | **recouvre P5 partiellement** — un moteur de page autoportante, filtrée et jugée existe côté audit ; aucune de ses sept vues n'est un plan d'amélioration |
| Bibliothèque de documents du pilot | `gabarits\documents\catalogue.jsonl` l.4 (rapport d'audit) : « la bibliothèque, qui indexe et renvoie sans réécrire ce qu'une forge génère » | **borne P5** — la page du plan d'amélioration cite le rapport d'audit et s'y joint ; elle n'en réécrit aucune vue |
| Skill `experts-forge` — fiches | dossier `experts-forge\fiches\` relevé le 19/09 : 17 fiches, dont `expert-interop-archi.md`, `expert-migration-plateforme-brownfield.md`, quatre `expert-ops-*`, `expert-data.md` | **recouvre P2 partiellement** — architecture, connectivités, exploitation et données ont leur expert ; aucune fiche dont le nom porte performances, front, back ou coûts |
| Registre `quality-oracles` | `references\registre-oracles.md` l.31 : « Plan de mission (cohérence structurelle) », l.98 : « Autorité d'une décision affirmée », l.365 : « Restitution lisible : la page se conçoit pour ses lecteurs » | **recouvre P6 partiellement** — trois juges à composer (trajectoire, régime d'autorité d'une recommandation, lisibilité de la page) ; aucun domaine « plan d'amélioration » |
| Skill `la-barre` | `SKILL.md` l.4 : « Trouve, qualifie et pérennise la barre de qualité d'un livrable — une référence externe » | recouvre P2 partiellement — un instrument pour écrire une **ambition** quand la documentation du produit n'en porte pas ; à composer |
| Skill `qualifie-l-entrant`, mode rétro-modèle | `references\RUN-CONSEIL.md` l.88-89 : « Si la compréhension complète d'un existant est requise : **mode rétro-modèle** (`RETRO-MODELE.md`, oracle RM1-RM5) » | **recouvre P1** pour la lecture de l'existant — à composer tel quel |
| Répartition des skills entre forges | arborescence `.claude\skills` relevée le 19/09 : forge-agents en porte 18, dont `digit-ai-page-html`, `quality-oracles`, `pilote-de-mission`, `contre-expertise` ; forge-conception 4 ; forge-design 4 ; forge-audit et forge-data aucun | **tranche P7** — les skills transverses et le socle de page vivent chez forge-agents |

En une phrase : l'amont (l'audit et sa donnée), l'aval (lotir, planifier, remettre) et le socle de
page existent ; ce qui n'existe nulle part, ce sont **trois verbes** — joindre, juger, rendre un
plan d'amélioration — et la méthode écrite qui les nourrit.

## 3. État de l'art daté

Cinq sources de moins de 24 mois, et deux repères plus anciens signalés comme tels. Le tableau se
lit par ligne : la source, sa date, ce qu'elle établit, puis la leçon retenue pour la conception ;
la colonne « lecture » dit si la source a été lue ou seulement relayée par un résultat de
recherche — aucune source relayée ne fonde seule le verdict.

| Source | Date | Ce qu'elle établit | Leçon retenue | Lecture |
|---|---|---|---|---|
| Microsoft, .NET Blog — « Your Migration's Source of Truth: The Modernization Assessment » (devblogs.microsoft.com/dotnet) | 2026-04-07 | l'évaluation est un **fichier du dépôt** ; constats classés *Mandatory / Potential / Optional*, chacun avec fichiers et lignes ; « Every planning decision […] traces back to what the assessment found » | la donnée est la source, le plan en dérive ; la troisième classe (« Optional ») est exactement l'amélioration hors blocage | lue |
| AWS — « AWS Well-Architected adds enhanced implementation guidance » (aws.amazon.com/about-aws/whats-new) et guide de l'outil, page « issues by improvement plan item » | 2024-11-06 | les éléments du plan d'amélioration se listent par pilier et par risque, et « You can filter the items based on pillar and severity » | un plan d'amélioration se consulte comme une liste **filtrable par domaine et par gravité** — c'est le tableau à facettes du socle ; limite : le cadre reste côté norme | lue (guide) ; date relayée |
| DORA — « State of AI-assisted Software Development 2025 » (dora.dev/dora-report-2025) | 2025-09 | « AI's primary role is as an amplifier, magnifying an organization's existing strengths and weaknesses » | les axes d'amélioration ne sont pas que du code : exploitation, qualité, documentation et flux de travail sont des domaines à part entière | lue (page d'accueil du rapport) |
| OWASP — Application Security Verification Standard 5.0.0 (github.com/OWASP/ASVS) | 2025-05 | environ 350 exigences en 17 chapitres, niveaux 1 à 3 | le côté **norme** est fermé et versionné (forge-audit y est alignée, `fiches\forge-audit.md` l.29) : le test « rattachable à un contrôle » qui trace la frontière est donc décidable | relayée |
| ACM EASE 2025 — « Assessing Software Product Quality in DevOps: An ISO 25010:2023 Perspective » (doi 10.1145/3727967.3756847) | 2025-06 | usage du modèle de qualité ISO/IEC 25010:2023 (neuf caractéristiques) pour évaluer un produit | une liste de domaines se défend mieux adossée à un modèle fermé : la compatibilité répond aux connectivités, la capacité d'interaction au front, puis efficacité de performance, maintenabilité, flexibilité | relayée (page refusée à la lecture, erreur 403) |
| Repère ancien — arc42, « ISO 25010:2023 Update » (quality.arc42.org) | 2023-11 | les neuf caractéristiques et ce qui change depuis 2011 (sûreté ajoutée, portabilité devenue flexibilité) | hors fenêtre de 24 mois : cité pour la définition, ne compte pas parmi les cinq | lue |
| Repère ancien — InfoQ, « Getting Technical Debt on the Roadmap » | 2024-03-27 | « Align technical debt resolution with business priorities to ensure it's incorporated into the roadmap » | hors fenêtre : confirme que chaque axe doit nommer l'effet métier visé — le champ « cible servie » de la fiche | lue |

Ce que l'état de l'art ne fournit pas : aucune des sources lues ne sépare explicitement
**remédiation** et **amélioration** en deux listes jointes ; les cadres d'éditeurs restent côté
norme. La frontière norme / ambition est un apport de l'analyse L99 du 19/09, à éprouver sur la
première mission.

## 4. Options — jeu fermé O0-O4

Cinq options *(O0 : ne rien faire ; O1 à O4 : options réelles)*, chacune avec son contenu, son
coût en complexité × durée, et ce qu'elle exclut.

- **O0 — ne rien faire** : garder le prompt réécrit du 19/09 comme modèle à recoller. **Réfutée.**
  Coût du statu quo, cité : le prompt d'origine valait 20 sur 100 avec 3 défauts bloquants
  (synthèse L99 du 19/09, bloc 2) — toute mission future qui repart d'une phrase repaie cette
  analyse ; le contrat de douze critères se vérifierait à la main, alors que le noyau n'accepte un
  livrable « que sur le seul verdict d'un oracle exécuté » ; la page HTML se referait à chaque
  fois ; et l'étude du 19/08 déclarait déjà non couverte « la production d'une recommandation neuve
  depuis un diagnostic » (l.63).
- **O1 — un référentiel de méthode seul** : écrire la frontière, les domaines et la fiche dans
  `references\` du pilot, avec un prompt type. Coût : simple × court. Exclut P3, P5 et P6 : rien ne
  joint, ne juge ni ne rend. C'est ce que la règle 31 prescrit pour un savoir **sans verbe
  outillé** (« un référentiel versionné […] jamais une forge NI un skill », `REGLES-PROJET.md`
  l.340-341) — donc la bonne forme si l'on renonçait aux verbes, pas si on les veut.
- **O2 — un skill outillé chez forge-agents, un contrat de données avec forge-audit, un
  amendement du run de conseil** : détaillée à la section 5. Coût : complexe × moyen. Exclut une
  forge nouvelle et toute modification du référentiel d'audit.
- **O3 — étendre forge-audit** d'un livrable « plan d'amélioration ». Coût : moyen × moyen. Son
  meilleur argument est réel : forge-audit possède déjà le schéma d'actions, un moteur de page à
  sept vues et l'oracle de ce rendu — une huitième vue coûterait moins qu'un skill. **Exclue**
  malgré cela, pour trois raisons citées : le produit forge-audit est public et agnostique du client
  (`fiches\forge-audit.md` l.13 : « 0 mention tenant dans le produit »), alors qu'une ambition est
  propre à un client par nature ; son invariant est « aucun score n'est affecté sans preuve »
  (`modele-maturite.template.md` l.5-6), quand une amélioration est un pari sur un gain ; et la
  lecture « global » de la demande exige d'accepter d'autres sources d'audit que forge-audit, ce
  qu'un livrable interne à forge-audit interdit.
- **O4 — une forge dédiée** (« amélioration » ou « conseil »). Coût : très complexe × long.
  **Exclue** par la règle 28 : les trois verbes existent bien nulle part ailleurs (critère 1), mais
  la capacité n'a ni cadence ni mandat propres (critère 3) — son mandat est celui du run de
  conseil, qui existe ; et l'étude du 19/08 a déjà tranché « aucune nouvelle forge » (l.140-141)
  pour le même périmètre.

## 5. Verdict

- **Option retenue** : O2.
- **Contenu, objet par objet.** Le skill, de nom de travail `plan-d-amelioration`, porte une
  méthode et trois verbes. *La méthode* (référentiel interne au skill, daté et éditable) : la
  frontière « écart à une norme = remédiation, écart à une ambition = amélioration » ; une base de
  domaines qui reprend les dix-huit dimensions de forge-audit là où elles existent, y ajoute ce
  qu'elles ne séparent pas (front, back, connectivités, dette d'un fork), s'adosse au modèle
  ISO/IEC 25010:2023 et s'ajuste au produit avec motif ; la
  fiche à dix champs ; les cinq questions d'ouverture ; les trois statuts d'un chiffre (mesuré, lu,
  hypothèse). *Verbe 1 — joindre* : lit le fichier des améliorations et le fichier d'actions d'un
  audit, refuse toute amélioration rattachable à un contrôle évalué (zéro doublon), résout les
  renvois croisés, produit la table de jonction. *Verbe 2 — juger* : un oracle qui joue le contrat
  de sortie (complétude des fiches, constats sourcés, chiffres à statut, domaines couverts,
  horizon et rang, aucun effort en jours), né avec ses fixtures rouge et verte. *Verbe 3 —
  rendre* : du fichier de données vers la page HTML autoportante au socle, et vers une vue
  Markdown.
- **Le « livrable complet au format HTML », défini.** Une page de données au socle
  `digit-ai-page-html`, en huit chapitres sous sommaire permanent : (1) les dix premières
  décisions, en choix fermés ; (2) la synthèse par domaine et par horizon, en indicateurs ;
  (3) le tableau de toutes les fiches, filtrable et triable par le composant du socle ; (4) le
  détail de chaque fiche, en ligne dépliable ; (5) la table de jonction avec les remédiations de
  l'audit ; (6) la trajectoire en lots et horizons, en schéma de flux temporel ; (7) le plan de
  mesure, là où aucune instance n'a pu être mesurée ; (8) la méthode, les sources et le statut des
  chiffres. Imprimable, sans requête réseau, jugée par `check_html.py`, `render_page.py` et
  l'oracle de filtres, puis par la critique d'implémentation de forge-design.
- **Forges impliquées dans la mise en place.** Le tableau donne une ligne par porteur, dans
  l'ordre de dépendance des lots ; la troisième colonne dit pourquoi ce porteur et pas un autre.

| Porteur | Ce qu'il reçoit | Pourquoi lui |
|---|---|---|
| **forge-audit** | déclarer son schéma d'actions existant comme contrat d'interface versionné (clé de jonction : le contrôle violé et le constat), exporter la liste des contrôles évalués, et lever la borne de l'identifiant à la dimension D16 (défaut déjà au registre du pilot) | la frontière ne se vérifie que si l'on sait quels contrôles ont été joués ; la donnée et son schéma lui appartiennent |
| **forge-agents** | le skill `plan-d-amelioration` (méthode, verbes joindre et rendre), son oracle enregistré au registre `quality-oracles` et composant les trois juges existants, le gabarit de page posé sur le socle `digit-ai-page-html`, et quatre fiches d'expert manquantes (performances, front, back, coûts) | les 18 skills transverses, le socle de page, le registre des oracles et les fiches d'expert y vivent ; `write-a-skill`, `write-an-oracle` et `write-an-expert` y sont l'outillage de naissance |
| **forge-design** | la critique d'implémentation du gabarit de page, et le contrôle de généricité | toute page HTML livrée porte son verdict ; un plan d'amélioration générique dans sa forme trahirait son fond |
| **le pilot** (porteur, pas une forge) | l'amendement du bloc « recommander » du run de conseil pour appeler le skill, l'entrée au catalogue de services, la situation « audit puis amélioration » au protocole d'accueil | le run de conseil et le routage des intentions lui appartiennent |

- **Forges mobilisées à l'exécution, sans modification.** forge-conception (lecture de l'existant
  par le mode rétro-modèle), puis, selon les domaines instruits : forge-tests (audit de la suite
  de tests), forge-websec (dépendances vulnérables), forge-ops (plans et dérive), forge-observability
  (sondes), forge-data (mesures de base en lecture seule). Elles fournissent des **mesures** aux
  fiches ; aucune ne reçoit de lot.
- **Séquencement — le skill naît de la première mission, pas avant elle.** La règle 31 exige
  qu'un objet durable naisse exercé, et l'analyse du matin demandait d'attendre « ce premier run »
  et des « gains constatés ». D'où trois temps : (1) jouer la mission réelle avec le prompt réécrit
  du 19/09, à la main, en tenant le fichier de données et la page ; (2) extraire le skill de ce qui
  a tenu — la mission fournit les fixtures réelles, vertes et rouges ; (3) seulement alors, les lots
  de forge-audit, de forge-design et du pilot. Construire le skill avant la mission reviendrait à
  figer treize domaines et dix champs que personne n'a encore éprouvés.
- **Coût** : complexité : complexe · durée : moyen. Dette assumée : la base de treize domaines et
  la frontière norme / ambition naissent d'une seule analyse et n'ont pas encore été éprouvées ;
  la première mission les corrigera.
- **Candidature(s) émise(s)** : `input\01-candidatures\plan-d-amelioration-post-audit-20260919a.tf.jsonl`
  — quatre candidatures de lot et trois constats en passant, ingérés en candidat sur décision
  humaine du 19/09/2026 (D-4 (a)) ; chaque item attend sa propre décision.
- **Plan de revue** : 2026-10-19. À cette date, confronter le verdict à la première mission réelle
  — la plateforme qui a fait naître la demande : le prompt réécrit du 19/09 y aura-t-il été joué,
  la frontière aura-t-elle tenu, combien de fiches auront été retirées faute de cible ? Cette
  mission répond aussi à la clause de revue de l'étude du 19/08 (2026-10-01 : « si aucune mission
  de conseil réelle n'a exercé le run type, requalifier »).
- **Test rétro** : *joindre* → une donnée plutôt qu'un document → permettre de trancher des
  priorités sans payer deux fois → décider où investir : la chaîne tient. *Juger* → un oracle
  plutôt qu'une relecture → même qualité à chaque mission : tient. *Rendre* → le socle plutôt
  qu'un gabarit maison → un livrable qu'un décideur utilise seul : tient. *Contrat d'interface
  chez forge-audit* → sert « global » seulement à moitié : il ouvre la jonction avec forge-audit,
  pas avec les autres sources d'audit ; **rupture assumée** — le verbe joindre naît avec un seul
  adaptateur, et l'étude le dit plutôt que de promettre cinq adaptateurs non exercés. Questions du
  demandeur rejouées : « une étude d'opportunité sur ce sujet » → ce document ; « un livrable
  complet au format HTML » → défini ci-dessus en huit chapitres, et l'étude est remise en page ;
  « le ou les forges impliquées » → le tableau des porteurs, quatre lignes, et la liste des forges
  mobilisées sans modification ; « ce skill global » → un skill, chez forge-agents, avec la limite
  dite sur « global ».

## Interdits (tenus)

Aucun critère subjectif ; jeu fermé tenu ; chaque ligne de non-recouvrement citée ; sources
datées, et marquées « lue » ou « relayée » ; O0 réfutée sur coûts cités ; aucun effort en jours.
