---
role: étude d'opportunité (instruction entre candidat et décidé) — préparation des forges à une mission data Silver/Gold sur Databricks puis rapports Power BI ; issue du prompt réécrit par l'analyse L99 du 07/09/2026 et des décisions humaines D-1 (a) et D-2 (a) du même jour
sources_de_verite: [output/03-etudes/20260907-L99-mission-data-silver-gold-powerbi.md, digit-ai-forge-data (CLAUDE.md, README.md, references/STANDARDS-DATA.md, references/REX-DATA.md, references/profils-moteur/LISEZMOI.md et databricks.md, scripts/, oracles/self-test.mjs rejoué le 07/09), digit-ai-forge-audit (core/adr/06-data, core/adr/08-reporting, core/controls/D05.json, profiles/powerbi, profiles/databricks-lakehouse, docs/EXTENSION-CORPUS.md), digit-ai-forge-agents (experts-forge/fiches/expert-data-platform-cloud.md, la-barre/references/registre-barres.md), digit-ai-forge-development/docs/run-playbook.md, digit-ai-forge-tests (README.md, forge_tests/adaptateurs/data.py, forge_tests/generateur_data.py), digit-ai-forge-ops/README.md, digit-ai-forge-observability/README.md, digit-ai-forge-design (oracles/, scripts/, skills/), catalogues/catalogue.jsonl, REGLES-PROJET.md §H, references/RUN-CONSEIL.md, references/RUN-MANDAT.md, references/TODO-FORGE.md, references/INTENTION.md]
verifie_le: 2026-09-07
---

# Étude d'opportunité — préparation des forges à une mission data Silver/Gold sur Databricks puis rapports Power BI — 20260907a

Audience : le pilote de l'écosystème, qui décide des mandats, et les forges nommées au verdict,
qui recevront chacune un lot. L'étude instruit la demande du 07/09/2026 telle que réécrite par
l'analyse L99 du même jour, sous les deux décisions humaines prises à sa lecture : les sept
écarts à la lettre sont validés, et la plateforme cible est **Databricks**.

Mesures relevées le **2026-09-07** sur les dépôts des forges tels que présents sur le poste
(relevé d'ouverture de session : toutes les forges « à jour », forge-agents « en avance de
3 commits non poussés »). **Date de péremption : 2026-11-07** — au-delà, la table de
la section 2 (confrontation à l'existant) doit être rejouée, parce que trois forges citées ont
livré au moins un verbe neuf par mois depuis juillet.

**Ce que le lecteur va apprendre.** La mission n'exige aucune forge nouvelle. L'écosystème porte
déjà la gouvernance de bout en bout (dix-huit décisions d'architecture data et reporting, un
profil Power BI, un profil Databricks lakehouse), la discipline de la donnée (six verbes exercés,
73 contrôles au self-test rejoué ce jour) et l'expertise plateforme (une fiche expert admise).
Ce qui manque tient en **sept objets**, répartis dans **cinq forges existantes** selon leurs
frontières écrites, et en **quatre barres** à instruire. Trois de ces manques ne sont visibles
qu'en jouant la mission de bout en bout : la réconciliation des chiffres entre la couche Gold, le
modèle sémantique et les visuels ; le porteur des verbes de construction ; la mise en production
d'un produit data.

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur deux critères. **Portée** : l'item touche forge-data, forge-audit, forge-development,
forge-design, forge-ops, forge-tests et forge-observability — sept forges, le seuil est à trois.
**Objet durable** : chaque manque retenu au verdict est un oracle, un script, un référentiel ou
une barre, tous objets durables au sens de la règle 31. Le troisième critère (gain élevé sur preuve
faible) n'est pas invoqué : les preuves sont exécutées ci-dessous.

## Intention de l'utilisateur (loi n° 7)

Citée dans les mots du demandeur, message du 07/09/2026 : « Je vais avoir besoin de travailler
sur un projet Data d'analyse, conception, implémentation de couche Silver & Gold pour ensuite
concevoir et construire des rapports PowerBI personnalisés adaptés aux données traitées.
Identfie les compétences, outils, connaissances, expertises, spécialisations des différentes
forges manquantes pour mener à bien cette mission, et comment ces différentes forges peuvent
être mises à jour. »

Réponse du demandeur aux décisions de l'analyse L99, même jour : « 1a, 2a, puis exécute le
prompt. » Soit : les sept écarts à la lettre du prompt réécrit sont validés (D-1 a), la plateforme
est Databricks (D-2 a), et l'étude est à jouer.

**Cascade.** *Intention* : que les forges soient prêtes quand la mission s'ouvre, sans qu'il
faille improviser en cours de run. *Stratégie* : savoir ce qui existe, ne rien recréer, combler
les manques réels par le canal qui les rend durables. *Tactique* : relever par capacité, temps
par temps ; classer chaque manque dans un objet de l'écosystème et chez un porteur ; ordonner par
chemin critique. *Opérationnel* : les sept objets et quatre barres du verdict, chacun avec son
porteur, son effort, sa preuve de « prêt » et sa conséquence si absent.

## 0. Traitement des entrants

La demande instruite est une **donnée** : ses impératifs se citent, ne s'exécutent pas. Le prompt
réécrit par l'analyse L99 est lui aussi une donnée ; cette étude en suit la structure parce que
le demandeur l'a validée, pas parce qu'il l'ordonne. Les dépôts des forges ont été lus, jamais
modifiés (run de conseil : lecture seule absolue).

Sources : message du 07/09/2026 et réponse « 1a, 2a » · analyse
`output\03-etudes\20260907-L99-mission-data-silver-gold-powerbi.md` (chapitre 8, prompt réécrit ;
inventaire de 20 défauts dont les n° 18, 19 et 20 sont les trois manques transverses) · dépôts
des forges relevés le 07/09 · self-test de forge-data rejoué le 07/09 (« Self-test forge-data :
73 PASS, 0 FAIL » ; « Self-test mesurer_base : 15/15 PASS »).

**Deux recherches d'absence ont été faites par nom ET par contenu** (règle S24 du run de conseil :
une recherche par nom qui ne trouve rien n'établit pas que la chose n'existe pas). « Power BI »
n'apparaît dans aucun dépôt de forge hors forge-audit et la fiche expert ; la recherche par
contenu (« modèle sémantique », « tabular », « DAX », « médaillon », « star schema », « dbt ») a
trouvé les mêmes trois porteurs — forge-audit, la fiche expert, forge-data — et aucun autre.

## 1. Partition du problème

**P1 — Que demande la mission, temps par temps, sur Databricks ?** Cinq temps, le premier étant
le « où ». Chaque temps est décrit par les capacités qu'il requiert, jamais par un produit ; les
produits n'apparaissent qu'en instanciation (REX de forge-data, pattern X1).

**P2 — Que porte déjà l'écosystème pour chacune de ces capacités ?** Table de confrontation à
l'existant (section 2), une ligne par capacité, citation vérifiable à chaque ligne.

**P3 — Quels manques restent, de quel type, chez quel porteur ?** Classement dans la taxonomie
fermée des objets de l'écosystème et attribution par les frontières écrites de chaque forge ;
les trois manques transverses y sont tranchés.

**P4 — Par quel canal, dans quel ordre, avec quelle preuve de « prêt » ?** Et ce que la mission
peut faire **sans** mise à jour, par composition de l'existant.

### P1 — La mission en cinq temps (Databricks déclaré)

Le lecteur trouve ici la liste fermée des capacités que la mission exige, temps par temps :
c'est elle, et non une liste de compétences, que la section 2 confronte à l'existant. Le « où »
est un temps à part entière, parce que sans lui aucun chiffre de la mission n'est attribuable.

| Temps | Ce que la mission y fait | Capacités requises |
|---|---|---|
| T0 — le « où » | déclarer l'instance (hôte, espace de travail, catalogue par environnement) et rendre tout chiffre attribuable à son instance | identité d'instance ; environnements déclarés ; mesure en lecture seule archivée avec sa cible |
| T1 — analyse de la couche brute (Bronze) | relever le schéma réel, ses commentaires, ses clés, ce qui manque en trois états ; profiler les jeux ; poser le lineage amont | import d'un schéma exporté au dialecte Databricks ; lecture des commentaires de colonnes ; profilage ; lineage colonne d'Unity Catalog ; cadrage plateforme |
| T2 — Silver | typer, dédoublonner, conformer, historiser ; transformer sous tests ; contractualiser vers Gold ; observer la fraîcheur | transformation SQL/Delta sous tests et documentation générée ; assertions de qualité exécutables ; contrat producteur→consommateur ; lineage T1→T2 ; sondes entre les runs |
| T3 — Gold = modèle dimensionnel | dessiner la matrice en bus depuis les questions des rapports ; déclarer grain, faits, dimensions conformes, dimension temps, changements lents ; construire | modélisation dimensionnelle jugée ; dessin du modèle ; contrat Gold→restitution ; lineage T2→T3 |
| T4 — modèle sémantique et rapports Power BI | modèle sémantique en formats texte (projet PBIP, définition TMDL), mesures définies une fois, mode de connexion par profil de besoin, sécurité au niveau ligne, thème dérivé de la marque, rapports maquettés puis construits, chiffres réconciliés avec Gold, publication sur GO | jugement du modèle sémantique sur ses fichiers ; thème Power BI dérivé des tokens ; maquette validée avant construction ; réconciliation des chiffres ; promotion entre espaces de travail sur GO humain |

**Comment lire ce tableau** : une ligne par temps, dans l'ordre de construction ; la dernière
colonne est la liste des capacités que la section 2 confronte une à une à l'existant. L'ordre de
**conception** de T3 et T4 est inverse de l'ordre de construction : les questions des rapports
fixent le grain de Gold (référence Kimball, retenue par forge-data ; décision d'architecture
ADR0801 *(modèle sémantique gouverné en schéma en étoile)* de forge-audit, invariante).

## 2. Non-recouvrement contre l'existant

**Comment lire ce tableau** : une ligne par capacité de P1, dans l'ordre des temps ; la citation
est le fait relevé (fichier, section, identifiant de catalogue, sortie exécutée) ; le verdict dit
si l'existant **recouvre** la capacité (rien à créer), la recouvre **partiellement** (extension),
ou **ne recouvre pas** (manque). Les identifiants de catalogue `cat-xxx-nn` sont ceux de
`catalogues\catalogue.jsonl` du pilot (84 lignes, version 1.8.0).

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| T0 · identité d'instance | forge-data, oracle-tracer règle T7 (CLAUDE.md : « environnement de chaque dataset — `namespace` désignant l'INSTANCE, jugé à partir du 24/08 ») ; `scripts/mesurer_base.py` : « Le champ `cible` (TF-0595, 24/08) porte le profil, le warehouse, l'HÔTE et le `namespace` » ; self-test rejoué le 07/09 : « 15/15 PASS (8 garde lecture-seule + 7 identité de cible) » | **recouvre** — le « où » est exigé et archivé, sur Databricks précisément |
| T0 · environnements déclarés | pilot, `references\RUN-CONSEIL.md` étape C0 : « Il s'écrit à deux endroits, et les deux sont contrôlés : `docs\projet\COMPOSANTS-OPS.md` section « Environnements de données » (R-20) et le `namespace` de chaque dataset » | **recouvre** |
| T0 · mesure en lecture seule | catalogue `cat-dat-08` « Mesurer une base connectée », statut prouvé ; `mesurer_base.py` : « toute requête dont la tête n'est pas SELECT / SHOW / DESCRIBE / DESC / WITH / EXPLAIN est REFUSÉE avant tout appel réseau » | **recouvre** |
| T1 · import d'un schéma exporté, dialecte Databricks | forge-data `references/profils-moteur/LISEZMOI.md` point 5 : « Seul le dialecte Postgres est aujourd'hui consommé par `scripts/importer.mjs` (v0). Les profils Oracle / Azure SQL / Databricks documentent leur dialecte pour une extension future du verbe … le jour où un artefact réel de ce moteur doit être importé » ; `databricks.md` : « pour un futur parseur analogue à `importer`, hors v0 » | **recouvre partiellement** — le profil existe, le verbe ne lit pas ce dialecte : extension d'`importer` (manque M1) |
| T1 · commentaires de colonnes, absences en trois états | REX-DATA X15 et X16 ; `importer.mjs` « rattache `COMMENT ON TABLE/COLUMN` aux `description` du contrat@1 … et DÉNONCE tout objet cité qu'il ne trouve pas » ; « relève la CIBLE de chaque `FOREIGN KEY` et dénonce celles qui pointent vers une table absente » | **recouvre** — sur le dialecte Postgres ; hérité par M1 sur Databricks |
| T1 · profilage des jeux | skill `data-quality-auditor` (poste, `~/.claude/skills`) ; forge-data CLAUDE.md : « Le profiling de datasets appartient au skill `data-quality-auditor` (appelé, pas réécrit) » ; fiche forge-data : « composition … doctrinale, pas outillée (pas d'appel machine) » | **recouvre** — composition conversationnelle, limite connue et acceptée |
| T1 · lineage colonne Unity Catalog | catalogue `cat-dat-07` prouvé ; CLAUDE.md : « Validé sur fixture synthétique uniquement — aucun export réel disponible sans workspace Unity Catalog Premium/Enterprise payant » | **recouvre** — l'export réel est une donnée du projet, pas un manque de forge |
| T1 · cadrage plateforme | fiche `expert-data-platform-cloud`, « Statut registre : ok — admise le 24/07/2026 », rubrique 1 « Localisation des irritants dans le modèle en couches », déclencheurs `Databricks|médaillon|Bronze.Silver.Gold` | **recouvre** — annotations de cadrage, jamais d'exécution (frontière de la fiche) |
| T2 · assertions de qualité | catalogue `cat-dat-01` prouvé ; barre Great Expectations (STANDARDS-DATA, retenu 0.9) ; règles P1-P4 ; ADR0605 *(qualité des données : règles, seuils et contrôles automatisés)* → CTL-D05-04 | **recouvre** |
| T2 · contrat producteur→consommateur | catalogue `cat-dat-05` prouvé ; barre ODCS v3.1.0 ; ADR0607 *(contrats de données d'intégration)* → CTL-D05-06 | **recouvre** |
| T2 · lineage entre couches | catalogue `cat-dat-02` prouvé, T1-T7 ; ADR0608 *(observabilité des données : monitoring, alerting et lignage)* → CTL-D05-07 | **recouvre** (déclaré ; la véracité runtime reste la dette D-D2 connue) |
| T2 · transformation sous tests et documentation générée | STANDARDS-DATA : dbt-core « retenu (barre) — niveau du verbe restituer : déclaré → généré » ; aucun verbe de forge-data ne juge un projet de transformation ; forge-development `docs\run-playbook.md` : cible « FastAPI + React + PostgreSQL », manifeste `.forge/profile.toml` (P-18) à rôles `backend`/`frontend` ; ADR0803 *(transformations au plus près de la source)* → CTL-D05-12 « logique de transformation significative testée et versionnée au plus près de la source » (mode revue) | **ne recouvre pas** — la barre existe pour un autre verbe, la gouvernance l'exige en revue, aucun verbe ne juge la forme d'un projet de transformation ni ne le construit sous gates (manque M2, et question du porteur) |
| T2 · tests du pan data d'un produit | forge-tests `forge_tests/adaptateurs/data.py` : « Adaptateur Data (SQL) — tables et contraintes depuis les migrations, exercées PAR VIOLATION » ; `generateur_data.py` : « une contrainte non exercée se teste toujours de la même façon — on la viole, on attend un rejet » | **recouvre partiellement** — couvre les contraintes de migrations SQL d'un produit web ; ne lit pas les contraintes Delta (`CONSTRAINT … CHECK`, `NOT NULL`) ni les tests d'un projet de transformation ; à composer avec M2, pas à dupliquer |
| T2 · sondes entre les runs | catalogue `cat-obs-01`, `cat-obs-02` prouvés ; INVENTAIRE §12 : « composition avec un oracle réel de forge-data à exercer au premier plan réel » ; dette D-OB1 « pas de scheduler ni d'alerting » | **recouvre** — la sonde `commande` peut appeler `mesurer_base.py` ; premier plan réel à écrire dans la mission, pas dans la forge |
| T3 · modélisation dimensionnelle jugée | STANDARDS-DATA ligne Kimball : « retenu (référence de modélisation) — vocabulaire des couches et du dimensionnel dans REX/playbooks — **pas d'oracle** » ; ADR0801 → CTL-D05-10 (mode revue), ADR0804 *(dimension de temps normalisée)* → CTL-D05-13, ADR0602 *(modélisation validée par une autorité data, traçabilité colonne)* → CTL-D16-01/02/03 | **ne recouvre pas** — la gouvernance exige un modèle en étoile documenté et validé, personne ne le juge mécaniquement (manque M3) |
| T3 · dessin du modèle | skill `digit-ai-schemas`, canevas « Modèle de données — schéma relationnel, tables / colonnes / clés / relations, classification PII » | **recouvre** |
| T3 · contrat Gold→restitution | `cat-dat-05` ; ADR0802 *(source unique homogène de la couche BI)* → CTL-D05-11 | **recouvre** |
| T4 · jugement du modèle sémantique | forge-audit `profiles/powerbi/README.md` : « 10 contrôles sont liés dans bindings.json », vérification « en priorité sur l'introspection du modèle tabulaire via les DMV exposées par le point de terminaison XMLA … et sur les règles Best Practice Analyzer (Tabular Editor). Lorsqu'aucun outillage programmatique n'est disponible … le contrôle bascule en revue outillée » ; contrôles CTL-D05-10, 13, 14, 15 « mode revue » | **recouvre partiellement** — la revue existe, aucun oracle exécutable ne lit les fichiers TMDL/PBIP du modèle (manque M4) ; le point de terminaison XMLA exige une capacité Premium ou Fabric, donnée du projet |
| T4 · thème Power BI dérivé de la marque | forge-design `cat-des-07` « Tokens DTCG (source → dérivé) », `scripts/generer-tokens-css.mjs`, `oracle-dtcg.mjs` ; `cat-des-09` « Contrôler la généricité d'une interface » (`oracle-taste.mjs <page.html>`, HTML seulement) ; aucune cible « thème Power BI » dans les scripts | **recouvre partiellement** — la source de tokens existe, la dérivation vers un thème Power BI (fichier JSON de thème) n'existe pas (manque M5) |
| T4 · maquette validée avant construction | pilot, `references\RUN-VERSION.md` (TF-0780) : « Un run de version qui touche une INTERFACE … porte au ledger une entrée « maquette_validee » … AVANT la première ligne de code de la vue » ; `cat-des-04` critique aval, statut déclaré | **recouvre** — règle de process, s'applique à un rapport comme à une page |
| T4 · réconciliation des chiffres Gold ↔ mesures ↔ visuels | forge-data `cat-dat-03` restituer, R1-R5 : « tout chiffre d'un rapport référence une entrée déclarée » — sur un rapport **Markdown** ; `mesurer_base.py` archive « le couple requête/résultat/CIBLE » | **ne recouvre pas** — un chiffre de rapport Markdown est ancré, un chiffre de mesure DAX ou de visuel ne l'est pas ; aucun verbe ne compare deux lots de mesures (manque M6) |
| T4 · promotion entre espaces de travail sur GO | forge-ops README : « trois verbes : déployer, exploiter, restaurer … `node scripts\ops.mjs deployer|restaurer|etat <cible>` », `cat-ops-03` « Plans cloud plan-first — génère, n'exécute jamais » (cibles railway, gcp, azure, aws) ; forge-audit `profiles/databricks-lakehouse/README.md` : « Les déploiements … sont appliqués par des Databricks Asset Bundles versionnés » (mode revue) ; pilot R-38 : aucun livrable publié sur un service hébergé sans GO humain | **ne recouvre pas** — aucune cible de plan pour un bundle Databricks ni pour un espace de travail Power BI ; la gouvernance l'attend, l'outillage manque (manque M7) |
| Toute forge nouvelle « data-produit » ou « BI » | REGLES-PROJET §H, R-28 : « ≥ 2 verbes outillés exécutables qui n'existent dans aucune forge … v0 exercée … cadence ou un mandat propres … intégration … le jour même » ; corollaire : « un corpus de savoir sans verbe outillé est un référentiel versionné » | jugé en section 4, option O1 |

**Ce que la table établit.** Sur vingt-quatre capacités, quatorze sont recouvertes, cinq
partiellement, cinq pas du tout. Les sept manques sont tous des **extensions** de verbes ou de
cibles existants (M1, M4, M5, M7), ou des verbes de **jugement de forme** qui prolongent une
gouvernance déjà écrite (M3, M4, M6), sauf un : M2, la transformation, qui est un verbe de
**construction** et pose la question du porteur.

## 3. État de l'art daté

**A. Mesures et faits internes, tous datés à moins de vingt-quatre mois.**

1. **Self-test de forge-data, rejoué le 2026-09-07** — « Self-test forge-data : 73 PASS,
   0 FAIL » ; « Self-test mesurer_base : 15/15 PASS ». Dernier commit de la forge : ce86658,
   2026-08-24.
2. **Fiche d'audit forge-data, 2026-08-19** — self-test « 54 PASS, 0 FAIL » à cette date ; dettes
   D-D1 (grain colonne→colonne) « entamée par le traducteur Unity Catalog », D-D2 (lineage
   déclaré vs exécuté) « inchangée ».
3. **Profil-moteur Databricks, 2026-08-12** (frontmatter `challenge_date`) — « `PRIMARY KEY` /
   `FOREIGN KEY` … informationnelles seulement — déclarées au catalogue mais jamais appliquées
   par le moteur » : un brouillon d'assertions dérivé d'une clé Databricks « doit porter un
   avertissement de fiabilité inférieure ».
4. **Corpus AuditCore de forge-audit, 2026-07-11 (décisions) et 2026-07-12 (contrôles v1.3)** —
   « Couverture : 65/65 ADRs ont ≥ 1 contrôle dérivé — 0 orphelin » ; les six décisions
   reporting ADR0801 à ADR0806 dérivent CTL-D05-10 à CTL-D05-15 ; profil Power BI version 1.0.0,
   dix contrôles ; profil Databricks lakehouse, quinze contrôles.
5. **Fiche expert data-platform-cloud, admise le 2026-07-24** — « 4 clients plateformes data
   (Databricks, Fabric, Fabric Medallion, Snowflake) » ; corpus 7 points.
6. **Standards de forge-data, 2026-08-11** — Kimball « retenu (référence de modélisation) … pas
   d'oracle » ; dbt-core, Great Expectations, OpenLineage, ODCS v3.1.0 retenus en barres.
7. **Registre la-barre, relevé le 2026-09-07** — dix entrées ; aucune ne cible un modèle
   sémantique, un projet de transformation ni un modèle dimensionnel.

**B. Sources externes datées, citées pour la classe d'outil, jamais pour un chiffre transposé.**
Elles établissent une chose : chaque manque M1 à M7 s'exerce aujourd'hui sur un **format texte
ou une ligne de commande**, condition posée par l'analyse L99 pour qu'un verbe soit exerçable par
un agent.

8. **Power BI, format de projet PBIP et langage TMDL** — la vue TMDL de Power BI Desktop est en
   disponibilité générale depuis **2025-09**, après une introduction en 2025-01 ; à cette
   disponibilité, TMDL est devenu le format par défaut du modèle sémantique dans un projet
   PBIP ([blog Power BI, TMDL en mode développeur](https://powerbi.microsoft.com/en-us/blog/tmdl-in-power-bi-desktop-developer-mode-preview/) ;
   [PBIX vs PBIR vs PBIP, 2026-03-30](https://lukasreese.com/2026/03/30/pbix-vs-pbir-vs-pbip/)).
   Conséquence : un modèle sémantique est un dossier de fichiers texte versionnables ; M4 et M6
   peuvent le lire sans ouvrir l'application.
9. **Tabular Editor, analyseur de bonnes pratiques en ligne de commande** — `-A / -ANALYZE`
   pour la version 2 ; commande `te bpa run` avec `--ci github` ou `--ci vsts` pour la CLI
   récente, règles publiées sur le dépôt
   [TabularEditor/BestPracticeRules](https://github.com/TabularEditor/BestPracticeRules)
   ([documentation ligne de commande](https://docs.tabulareditor.com/en/features/Command-line-Options.html) ;
   [scripts CI/CD pour la CLI](https://tabulareditor.com/blog/ci-cd-scripts-for-tabular-editor-2s-cli)).
   Le profil Power BI de forge-audit les cite déjà ; M4 en fait une barre.
10. **Databricks, bundles déclaratifs (Databricks Asset Bundles, renommés Declarative
    Automation Bundles)** — disponibilité générale annoncée en **2024-04**
    ([annonce Databricks](https://www.databricks.com/blog/announcing-general-availability-databricks-asset-bundles) ;
    [documentation](https://docs.databricks.com/aws/en/dev-tools/bundles/)). Conséquence : un
    déploiement Databricks est un fichier de configuration validable hors ligne ; M7 peut le
    juger en « plan-first » comme les cibles cloud existantes de forge-ops.
11. **dbt Core 1.10, 2025-06-16 ; dbt Fusion en préversion depuis 2025-08-20**
    ([journal des versions dbt](https://docs.getdbt.com/docs/dbt-versions) ;
    [feuille de route « même langage, nouveau moteur », 2025-05](https://github.com/dbt-labs/dbt-core/blob/main/docs/roadmap/2025-05-new-engine-same-language.md)).
    Conséquence pour M2 : la forme d'un projet de transformation (modèles, tests, documentation
    générée, `ref`/`source`) reste stable d'un moteur à l'autre ; c'est cette forme, pas un
    moteur, que la barre existante décrit.
12. **Microsoft Fabric, Direct Lake** — modèles composites Direct Lake + import en préversion
    publique ; depuis le **2025-09-05** les modèles sémantiques par défaut ne sont plus créés
    automatiquement ([documentation Fabric](https://learn.microsoft.com/en-us/fabric/data-warehouse/semantic-models) ;
    [développer en Direct Lake](https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-develop)).
    Cité pour une raison seulement : la plateforme étant Databricks, le mode Direct Lake n'est
    **pas** disponible pour la mission ; les modes à profiler (ADR0805 *(homogénéité des modes
    de stockage et de connexion BI)*) sont import et DirectQuery.

## 4. Options — jeu fermé O0-O4

**O0 — ne rien faire.** La mission se joue par composition de l'existant et par gestes humains
là où il manque un verbe. **Réfutée**, coût du statu quo cité : la couche Gold serait jugée à
l'œil (Kimball « pas d'oracle », STANDARDS-DATA) ; la réconciliation des chiffres serait
manuelle, et le précédent de forge-data dit ce que cela vaut (« 788 nus contre 135 ancrés sur cinq
rapports réels, tous PASS », TF-0378) ; la mise en production serait artisanale, ce qui est le
trou prouvé qui a fait naître forge-ops (« MEP sans forge, déploiement artisanal », TF-0040). Trois
manques dont l'écosystème a déjà payé le prix ailleurs.

**O1 — une forge nouvelle « data-produit ».** Jugée contre les quatre points de R-28. Point 1,
deux verbes outillés sans recouvrement : tenable (M2 transformer, M3 modéliser, M6 réconcilier
n'existent nulle part). Point 2, v0 exercée : tenable sur fixtures. **Point 3, cadence ou mandat
propres : non tenu** — un produit data suit la même séquence de run qu'un produit web (conception,
design, development, tests, MEP), et ses verbes sont des jugements de forme (forge-data) ou de
gouvernance (forge-audit), pas une cadence distincte. Point 4, intégration le jour même :
coûteux (bootstrap, fiche, inventaire, contrat, noyau, schéma, catalogue). Coût : complexité très
complexe × durée longue. Exclut : la frontière de forge-data (« composition, jamais duplication »)
serait doublée par une forge qui juge aussi de la donnée.

**O2 — tout chez forge-data.** Les sept manques ajoutés à la forge de la discipline. Coût :
complexité complexe × durée moyenne. Exclut : la frontière écrite de forge-data, « vérifie la
forme de la discipline, pas le contenu des données » — un verbe qui **construit** une
transformation (M2) ou **dérive** un thème (M5) n'est pas un jugement de forme ; l'analyse L99 a
nommé ce risque « fourre-tout data » (chapitre 7).

**O3 — répartition par frontières écrites, extensions de verbes existants, barres instruites.**
Chaque manque va chez la forge dont la frontière le nomme déjà : jugements de forme de la donnée
chez forge-data (M1, M3, M6), mécanisation d'un contrôle de gouvernance chez forge-audit (M4),
dérivation de tokens chez forge-design (M5), plan de déploiement chez forge-ops (M7), discipline
de construction chez forge-development (M2, par un profil data du manifeste P-18), composition
chez forge-tests. Quatre barres au registre la-barre. Coût : complexité complexe × durée moyenne,
en sept lots indépendants. Exclut : rien de la mission ; exclut une forge nouvelle tant que le
point 3 de R-28 n'est pas tenu.

**O4 — référentiels et fiches seulement, aucun verbe.** Un référentiel Power BI daté, un profil
Databricks enrichi, une fiche expert « modélisation dimensionnelle ». Coût : complexité simple ×
durée courte. Exclut : toute preuve exécutée ; la loi de l'écosystème (« un ✓ sans oracle exécuté
n'est pas un ✓ ») s'appliquerait à Gold, au modèle sémantique et aux chiffres sans qu'aucun
oracle ne puisse la tenir.

## 5. Verdict

- **Option retenue** : **O3** — sept objets répartis dans cinq forges existantes selon leurs
  frontières écrites, quatre barres instruites, aucune forge nouvelle ; O1 reste réévaluable si
  un second produit data révèle une cadence propre (point 3 de R-28).
- **Coût** : complexité complexe × durée moyenne pour l'ensemble ; par lot, voir la table 5.2.
  Tokens : sept mandats de forge de taille comparable à TF-0139 (verbe importer) ; dette
  déclarée : D-D2 (véracité runtime) inchangée, la réconciliation M6 compare des mesures
  archivées, pas une exécution observée.
- **Candidature(s) émise(s)** : huit, journalisées le 2026-09-07 par `todo\journaliser.mjs`
  (registre PASS avant et après écriture), puis **décidées le même jour** par décision humaine
  D-3 option (a), dans l'ordre des lots — TF-0858 (M1, L1), TF-0859 (quatre barres, L2), TF-0860
  (M3, L3), TF-0861 (M2, L4), TF-0862 (M4, L5), TF-0863 (M5, L6), TF-0864 (M6, L7), TF-0865
  (M7, L8) ; chacune ouvre un mandat de forge (run de mandat, `references\RUN-MANDAT.md`). Le
  pilot n'écrit dans aucune forge : ce sont les mandats qui écrivent.
- **Plan de revue** : **2026-09-21** — confrontation du verdict aux mandats ouverts et au « où »
  réel de la mission (instance, catalogues, capacité Premium ou non) ; **2026-11-07** —
  péremption de la table de non-recouvrement.
- **Test rétro** : joué en section 5.4, depuis chaque élément opérationnel jusqu'à l'intention ;
  aucune rupture, un élément retiré (voir 5.4).

### 5.1 Les sept manques, typés et attribués

**Comment lire ce tableau** : une ligne par manque, dans l'ordre des temps de la mission ; la
lettre de type renvoie à la taxonomie de l'analyse L99 — (a) verbe outillé, (b) référentiel
versionné, (c) fiche expert, (d) barre, (e) skill, (f) décision d'architecture et contrôle ; le
porteur est justifié par la frontière citée ; le calibrage dit sur quel artefact texte le verbe
s'exerce.

| Manque | Type | Porteur et justification | Calibrage (artefact jugé) | Preuve d'usage dans la mission |
|---|---|---|---|---|
| **M1** — importer un schéma exporté au dialecte Databricks (DDL `SHOW CREATE TABLE`, export `information_schema` en JSON), clés informationnelles avertie | (a) extension d'`importer.mjs` + (b) profil `databricks.md` porté en version 1.1.0 | forge-data — LISEZMOI des profils, point 5 : l'extension « prouvée par non-recouvrement le jour où un artefact réel de ce moteur doit être importé » ; ce jour est T1 | fichier texte exporté, jamais une connexion (loi n° 4 de la forge) | T1 : brouillon d'assertions et de contrat Bronze, commentaires et clés orphelines dénoncés |
| **M2** — juger la forme d'un projet de transformation Silver/Gold (chaque modèle : source ou `ref` déclaré, au moins un test, description ; documentation générée, jamais écrite à la main) et le construire sous gates | (a) oracle « transformer » chez forge-data (forme) + (e) profil data du manifeste `.forge/profile.toml` chez forge-development (construction : rôle `transformations`, commandes `test` et `docs`) + (d) barre dbt-core rattachée au verbe | forge-data pour le **jugement** (frontière : forme de la discipline) ; forge-development pour la **construction** (playbook, disciplines RV-3/RV-4 ; P-18 « clé absente = non applicable ») ; forge-tests compose son pan data avec les tests du projet au lieu de les rejouer | arborescence de projet (SQL/YAML), sortie de `dbt test` ou équivalent archivée en JSON | T2 et T3 : Silver et Gold construites sous tests, documentation générée, lineage déclaré |
| **M3** — juger un modèle dimensionnel déclaré : grain de chaque fait, dimensions conformes, clés de substitution, dimension temps contiguë, type de changement lent par dimension, matrice en bus | (a) oracle « modéliser » + (d) barre Kimball | forge-data — STANDARDS-DATA : Kimball « retenu … pas d'oracle » ; le format déclaratif rejoint `lineage@1` et `contrat@1` ; forge-audit garde la revue (CTL-D05-10, 13) | fichier déclaratif `forge-data/modele-dimensionnel@1` (JSON), fixtures rouge/verte | T3 : Gold conçue depuis les questions de T4, jugée avant construction |
| **M4** — juger un modèle sémantique sur ses fichiers TMDL/PBIP : mesure définie une fois (CTL-D05-02 et 10), relations actives et non ambiguës, table de dates marquée et contiguë (CTL-D05-13), mode de connexion déclaré par profil (CTL-D05-14), rôles de sécurité au niveau ligne présents, statut de certification (CTL-D05-15) | (a) oracle exécutable dans `profiles/powerbi` + (d) barre « règles Best Practice Analyzer de Tabular Editor + format PBIP/TMDL » | forge-audit — son profil dit que le contrôle « bascule en revue » faute d'outillage programmatique ; le format TMDL le rend programmatique ; mécaniser ses propres contrôles reste dans sa frontière | dossier PBIP/TMDL en texte ; jamais le point de terminaison XMLA (capacité payante, donnée du projet) | T4 : modèle sémantique jugé à chaque commit, avant publication |
| **M5** — dériver un thème Power BI (fichier JSON de thème : palette, polices, styles de visuels) depuis `tokens.css` DTCG, et le juger contre la marque | (a) cible « powerbi » de `generer-tokens-css.mjs` ou script frère + règle dans `oracle-dtcg.mjs` | forge-design — `cat-des-07` « Tokens DTCG (source → dérivé) » : une cible dérivée de plus ; loi n° 6 (rendu générique = défaut) | fichier JSON de thème, fixture rouge (thème par défaut) / verte (thème dérivé) | T4 : rapports « personnalisés » par construction, jamais par thème par défaut |
| **M6** — réconcilier deux lots de mesures identifiées : agrégats Gold archivés par `mesurer_base.py` et valeurs des mesures du modèle sémantique (requête DAX exportée en JSON par l'API du service, ou export de visuel), tolérance déclarée, chaque écart nommé | (a) oracle « réconcilier » + extension de `restituer` (un `[c:id]` peut pointer un lot de réconciliation) | forge-data — prolonge `restituer` (« tout chiffre … référence une entrée déclarée ») aux chiffres qui ne sont pas dans un Markdown ; compose `mesurer_base.py` | deux fichiers JSON de mesures archivés (id, valeur, cible, date) ; jamais une connexion depuis l'oracle | T4 : chaque mesure exposée réconciliée avec Gold avant GO ; défaut n° 18 de l'analyse clos |
| **M7** — plan de promotion d'un produit data : cible « databricks-bundle » (validation hors ligne du bundle, quatre phases, retour arrière réel, zéro credential) et cible « powerbi-workspace » (projet PBIP versionné, promotion dev → test → prod, publication conditionnée au GO humain R-38) | (a) deux cibles de `ops.mjs plan` + règle O-5 étendue | forge-ops — `cat-ops-03` « Plans cloud plan-first — génère, n'exécute jamais » : deux cibles de plus ; forge-audit garde la revue (profil Databricks lakehouse) | fichiers de bundle et de projet en texte ; plan JSON jugé par O-5 | MEP : dossier de mise en production complet, GO humain avant toute publication |

### 5.2 Plan de mise à jour par canal, ordonné par chemin critique

**Comment lire ce tableau** : une ligne par lot, dans l'ordre de traitement ; l'ordre suit le
chemin critique de la mission (ce dont T1 a besoin avant T2, T2 avant T3, T3 avant T4, la MEP en
dernier) ; l'effort parle en complexité × durée ; la preuve de « prêt » est binaire et exécutée ;
la dernière colonne dit ce qui se passe si le lot n'est pas fait.

| Lot | Contenu | Canal | Effort | Preuve de « prêt » | Si non fait |
|---|---|---|---|---|---|
| L1 | M1 (importer Databricks + profil 1.1.0) | candidature → mandat forge-data ; outil : extension de `scripts/importer.mjs`, fixture `schema-databricks-{verte,rouge}` | moyen × court | `oracles/self-test.mjs` double sens PASS avec le round-trip Databricks ; `cat-dat-06` mis à jour | T1 se fait à la main : assertions et contrat Bronze écrits sans dérivation, clés orphelines non dénoncées |
| L2 | barres : Kimball (M3), dbt-core rattachée à « transformer » (M2), Tabular Editor BPA + PBIP/TMDL (M4) | skill `la-barre`, mode pré-vol ; quatre entrées `statut: todo` → `ok` après test d'existence | simple × court | quatre entrées au registre avec `dernier_test` daté PASS | M2, M3, M4 se construisent sans niveau de référence, ce que la doctrine la-barre interdit |
| L3 | M3 (oracle modéliser, format `modele-dimensionnel@1`) | candidature → mandat forge-data ; outil : `write-an-oracle` | complexe × moyen | self-test double sens PASS ; fixture verte = étoile à quatre dimensions dont temps ; rouge = grain absent, temps trouée | Gold jugée à l'œil ; CTL-D05-10 et 13 restent en revue seule |
| L4 | M2 (oracle transformer chez forge-data ; profil data P-18 chez forge-development ; composition forge-tests) | deux candidatures → deux mandats ; outil : `write-an-oracle` côté data, édition du playbook côté development | complexe × moyen | self-test PASS ; un projet fixture passe le profil data du playbook (commandes `test` et `docs` résolues) ; forge-tests lit la sortie de tests archivée | Silver et Gold construites hors gates ; la traçabilité exigences → tests du contrat « prêt client » ne couvre pas la donnée |
| L5 | M4 (oracle TMDL/PBIP chez forge-audit) | candidature → mandat forge-audit ; outil : `write-an-oracle` dans `profiles/powerbi` | complexe × moyen | self-test PASS ; fixture verte = modèle TMDL à table de dates marquée et mesures uniques ; rouge = mesure dupliquée, relation ambiguë | le modèle sémantique est revu à la main au portail ; aucun contrôle à chaque commit |
| L6 | M5 (thème Power BI dérivé) | candidature → mandat forge-design ; outil : extension de `generer-tokens-css.mjs` et `oracle-dtcg.mjs` | moyen × court | fixture rouge (thème par défaut) FAIL, verte (thème dérivé) PASS ; `cat-des-07` mis à jour | rapports au thème par défaut : défaut de loi n° 6, visible du client |
| L7 | M6 (oracle réconcilier + extension restituer) | candidature → mandat forge-data ; outil : `write-an-oracle`, composition `mesurer_base.py` | complexe × moyen | self-test PASS ; fixture verte = deux lots égaux sous tolérance ; rouge = un écart nommé | les chiffres des visuels ne sont attribuables à rien ; le précédent des « 788 nus » se rejoue en DAX |
| L8 | M7 (cibles databricks-bundle et powerbi-workspace de `ops.mjs plan`) | candidature → mandat forge-ops | complexe × moyen | O-5 PASS sur un plan fixture à quatre phases et retour arrière ; refus sans credential ; GO humain exigé avant `publish` | MEP artisanale ; publication sur le service sans plan ni retour arrière prouvé |
| L9 | retours de la mission (lots `forge\retours\`) : premier run réel de forge-data de bout en bout, premières instanciations réelles des profils Power BI et Databricks lakehouse | canal standard des lots de retours vers `input\00-retours\` du pilot | simple × court par lot | `oracle-lot.mjs` exit 0 sur chaque lot | ce que la mission apprend ne redescend pas (règle R12 du registre) |

**Ordre justifié en une clause** : L1 et L2 d'abord parce qu'ils coûtent le moins et débloquent
T1 et le niveau de référence de trois autres lots ; L3 avant L4 parce que Gold se conçoit avant de
se construire ; L5 à L7 en parallèle parce qu'ils sont indépendants et tous nécessaires avant le
GO de T4 ; L8 en dernier parce que la MEP ferme la mission.

### 5.3 Ce que la mission fait SANS mise à jour

Par composition de l'existant, dès l'ouverture du run :

- **T0** : `docs\projet\COMPOSANTS-OPS.md` renseigné (R-20), `mesurer_base.py` avec sa cible
  archivée, `namespace` sur chaque dataset (T7).
- **T1** : cadrage par la fiche expert data-platform-cloud ; profilage par `data-quality-auditor`
  ; lineage Unity Catalog traduit si l'export réel est fourni par le projet ; en attendant L1,
  un export DDL Databricks se lit à la main avec le profil-moteur `databricks.md` comme grille
  (types, contraintes appliquées vs informationnelles).
- **T2** : assertions (`oracle-profiler`), contrat Silver (`oracle-contractualiser`), lineage
  T1→T2 (`oracle-tracer`), sonde de fraîcheur (`observer.mjs` avec une sonde `commande` appelant
  `mesurer_base.py`).
- **T3** : dessin du modèle par `digit-ai-schemas` (canevas modèle de données) ; contrat
  Gold→BI ; revue de gouvernance par forge-audit sur mandat (CTL-D05-10, 13).
- **T4** : maquette des rapports validée avant construction (règle TF-0780) ; revue du modèle
  sémantique par le profil Power BI de forge-audit en mode revue outillée ; chiffres des rapports
  Markdown ancrés par `oracle-restituer`.
- **MEP** : dossier de mise en production et GO humain (R-38) ; plan de déploiement écrit à la
  main, jugé à la relecture — c'est exactement le trou que L8 comble.

### 5.4 Test rétro (Opérationnel → Tactique → Stratégie → Intention)

Depuis chaque élément opérationnel du verdict :

- **L1 importer Databricks** → tactique « relever par capacité, T1 exige un import de schéma
  au bon dialecte » → stratégie « ne rien recréer : le profil existe, le verbe s'étend » →
  intention « forges prêtes à l'ouverture ». Sans rupture.
- **L2 quatre barres** → tactique « toute construction de verbe part d'un niveau de référence
  testé d'existence » → stratégie « durable par le canal la-barre » → intention. Sans rupture.
- **L3 modéliser** → tactique « Gold est le modèle dimensionnel, conçu depuis les rapports » →
  stratégie « combler un manque réel : Kimball retenu sans oracle » → intention. Sans rupture.
- **L4 transformer et profil data** → tactique « T2 et T3 se construisent sous gates » →
  stratégie « le porteur suit la frontière écrite : jugement chez data, construction chez
  development » → intention. Sans rupture.
- **L5 modèle sémantique jugé sur fichiers** → tactique « T4 se juge à chaque commit sur des
  fichiers texte » → stratégie « mécaniser une gouvernance déjà écrite » → intention. Sans rupture.
- **L6 thème dérivé** → tactique « personnalisé = dérivé de la marque » → stratégie « loi n° 6 »
  → intention « rapports personnalisés adaptés aux données traitées », mot pour mot. Sans rupture.
- **L7 réconcilier** → tactique « chaque chiffre exposé remonte à Gold » → stratégie « ne pas
  rejouer le précédent des chiffres nus » → intention. Sans rupture.
- **L8 plan de promotion** → tactique « MEP d'un produit data sur GO » → stratégie « le trou
  MEP a déjà coûté une fois » → intention. Sans rupture.
- **L9 retours** → tactique « ce que la mission apprend redescend » → stratégie « les forges
  restent prêtes pour la mission suivante » → intention. Sans rupture.
- **Élément retiré** : une fiche expert « modélisation dimensionnelle » (type c) envisagée en
  O4 ne remonte à aucune ligne tactique une fois L3 retenu — un oracle exécuté rend la fiche
  redondante ; retirée du verdict.

Les deux questions du demandeur, rejouées : « identifie les … manquantes » → section 5.1, sept
manques typés, attribués, calibrés ; « comment ces forges peuvent être mises à jour » → section
5.2, neuf lots, chacun avec son canal, son effort, sa preuve et sa conséquence.

## Interdits (tenus)

Aucun critère subjectif ; jeu fermé O0-O4 ; chaque ligne de non-recouvrement citée ; chaque source
datée ; O0 réfutée sur coût cité ; aucun effort en jours ; aucune donnée client (fixtures
synthétiques nommées à chaque preuve de « prêt ») ; aucune écriture dans une forge par cette étude.
