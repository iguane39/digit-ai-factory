# Règles projet — DÉCIDÉES le 2026-08-06

**Les 17 règles sont adoptées** (décision humaine du 06/08). Arbitrages des conflits :
C1 = `old\` (minuscule — graphie D-15) autorisé pour les livrables et **VERSIONNÉ**
(amendement humain du 13/08, TF-0150 : le rangement fait partie de l'histoire que git
garde ; re-gitignorer retirerait des livrables déjà commités — l'ancien arbitrage
« jamais versionné » est caduc, le CODE reste hors old\ par la règle 6) ;
C2 = `git init` + **commits locaux par défaut** dès l'ouverture du run, remote/push sur GO
humain ; C3 = le nommage daté ne s'applique jamais au code ; C4 = journaux d'oracles
**versionnés** dans `forge\`.
Application : phase 0 du prompt produit (P0), vérifications pilot (S), et l'oracle
exécutable `oracles\oracle-conformite-projet.mjs` (O) — chaque n° de règle est un n° de finding.
Rattrapage des projets existants : au prochain run de version de chacun.

Sources : inventaire exécuté sur 11 dépôts (6 forges, produit pilote MiniVeille, Produit-12
— produit forge réel —, ASDMailManager, Produit-02.com, Transcript, BeefProject).
Annexe d'inventaire en fin de document. Mécanismes : **P0** = créé par la phase 0 du prompt
produit · **S** = vérifié par le pilot à l'ouverture de run · **O** = oracle conformité
projet (2e mandat) · **G** = gate humain.

## A. Structure de dossiers

| n° | Règle (binaire) | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 1 | `input\` existe à la racine ; tout entrant fourni par l'humain y vit | observée 7/11 (forges, Produit-12, Transcript…) | tous projets, nouveaux + rattrapage | P0+O | nul | **défaut** |
| 2 | `output\` existe ; tout livrable généré destiné à l'humain y vit (rapports, PV, exports). **Précision D-06 (adoptée 11/08, TF-0084)** : un document *normatif* (doctrine, gabarit, registre) n'est pas une sortie — il vit à la racine ou dans `docs\`, avec son `Old\` à côté, jamais sous `output\` | observée 3/11 (`digit-ai-forge-agents/output/`, Transcript, BeefProject) ; précision : D-06 organization | tous, nouveaux + rattrapage | P0+O | nul | **défaut** |
| 3 | `docs\` pour la documentation pérenne du produit (hors run) | observée 3/11 (development, tests, Produit-02) | produits, nouveaux | P0 | nul | option |
| — | `forge\` (ledger, étapes) : **déjà acté** au contrat d'interface §2, pour mémoire | Produit-12/forge/ | — | — | — | déjà appliqué |

## B. Nommage

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 4 | Tout livrable documentaire est nommé `<Projet> - <Objet> - AAAAMMJJ<indice>.<ext>` — **le nom du PROJET prime sur l'émetteur** (Q3-bis tranchée par l'humain le 09/08 : « Produit-02 - Audit SEO - … », plus jamais « Digit-AI - … » en tête). Les fichiers historiques ne sont pas renommés. **Alinéa RV-2 (Produit-10, 13/08)** : quand un ENTRANT exige un autre nommage pour le livrable, le nommage du pilot **prime** ; la correspondance entre le nom exigé et le nom produit est consignée au ledger (champ `note_nommage`) — jamais d'arbitrage silencieux | convention historique observée avec préfixe émetteur ; **décision humaine du 09/08** la corrige ; alinéa : retour Produit-10 RV-2 (conflit vécu, arbitré au ledger seq 1) | **livrables uniquement** (input\, output\, docs\) — JAMAIS le code (conflit C3) | S+O | faible | **défaut** |
| 5 | L'indice est une lettre (a, b, c…) par itération du même jour ; une nouvelle version = un **nouveau fichier daté**, jamais d'écrasement | observée (`20260721b` → `20260721d`, `revue.md`/`revue-v2`) | livrables uniquement | S+O | faible | **défaut** |
| 25 | Le `<Type>` du nom de tout livrable daté (2ᵉ segment, 1ᵉʳ mot) **figure au registre des types** (`registre-types.json` d'organization, comparaison insensible casse/accents) — un type nouveau s'ajoute au registre dans un commit motivé (D-04), jamais improvisé dans un nom. Registre lu en dépôt frère ; poste non équipé → non jugeable, pas FAIL | **D-04 organization (décidée 08/08), encodée 11/08 (TF-0084)** — registre 1.1.0, 29 types, complété sur usage réel | produits, nouveaux + rattrapage | O | nul | **défaut** |

**Alinéa paramétrage (TF-0322, décidé le 17/08 — étude 20260817f, verdict O1 : refus
instruit d'un système de paramètres).** Trois classes de conventions ne se négocient pas,
chacune pour un motif mesuré : les **identifiants stables** (ids TF, ids de schéma §3 bis —
un id renuméroté casse toute traçabilité), le **motif daté des livrables** (règle 4 — 19 lots
de 9 produits cohabitent dans une seule boîte d'entrée parce que le nom dit qui retourne
quoi), les **familles d'`output\`** (D-15 — le seul conflit de graphie de l'histoire s'est
réglé par alignement, zéro re-migration). Ce qui EST paramétrable existe déjà et se déclare :
le bloc `nommage` des profils `quality-oracles` (prefixe, libelle, declencheur, regex — jugé
par `oracle-nommage.mjs`, SKIP motivé sans profil, TF-0071) et l'alinéa RV-2 de la règle 4
(un entrant qui exige un autre nommage : le pilot prime, correspondance au ledger). Un
demandeur reçoit une voie, pas un mur ; critère de réouverture : un deuxième conflit de
préférence réel consigné au ledger.

## C. Versions et git

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 6 | Le code n'a qu'un magasin de versions : git. Aucune copie datée ni dossier `Old\` pour du code | générique (standard) + état de l'écosystème (6 dépôts git) | tous | O | nul | **défaut** |
| 7 | Quand un livrable documentaire est remplacé par une version plus récente, l'ancien migre dans `Old\` du même dossier (lisibilité du dossier courant — pas un magasin de versions) | **citée par toi** ; observée 1/30+ (`OptimAssur/old`) | livrables uniquement | S+O | faible | option (conflit C1) |
| 8 | Tout nouveau produit est `git init` à l'ouverture du run, avec commit initial + commits par étape (le **push/remote reste sur ton GO**) | gap constaté : Produit-12 sans git | produits, nouveaux | P0 | nul | **défaut** (conflit C2) |
| 9 | Commits en Conventional Commits français | observée (development 116 commits, campagnes forges) | tous dépôts git | S | nul | **défaut** |
| 10 | `.gitignore` socle dès la création : `.env`, `.venv/`, `__pycache__/`, `node_modules/`, `generated/`, artefacts de build, **sidecars d'oracles** `*.oracles.json` / `*.oracles-cache.json` / `*.oracles-historique.jsonl` (TF-0065 — les preuves VOULUES restent versionnées sous `forge\`, exception `!forge/**`, décision C4) | observée (9/11) ; sidecars : 3 campagnes polluées | tous | P0+O | nul | **défaut** |

## D. Documentation du produit

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 11 | Chaque produit naît avec un `CLAUDE.md` d'après `gabarits\CLAUDE-PRODUIT.md`, **section « Routage forge » remplie** (verdict tests → forge_tests, évolution → run de version, déploiement → MEP ; boucle intérieure libre) — étendue le 06/08 : sans routage, les sessions ad hoc contournent les forges (constaté sur le correctif v0.2.0) | observée 11 projets maison ; absente du produit forge réel | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 12 | Chaque produit naît avec un `README.md` minimal : une phrase de quoi, 2 commandes de démarrage, lien CLAUDE.md | observée 8/11 ; absente d'Produit-12 | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |

### D bis. Socle documentaire `docs\projet\` (R-20..R-23 — décision humaine du 11/08, TF-0082)

**Principe directeur** : les fichiers de `docs\projet\` sont des **vues pour humains et agents** —
chacun **déclare sa source de vérité** (frontmatter YAML : `role`, `sources_de_verite`,
`verifie_le`) et ne la duplique jamais ; toute valeur volatile est datée ; **aucun secret,
jamais** (R-14 inchangée — dépôts au régime public).

**Producteur d'étape (TF-0086, constat du run MEP Produit-11)** : la CRÉATION du socle appartient à
l'**ouverture du run** — squelette des 8 fichiers copié depuis `gabarits\docs-projet\`,
frontmatter renseigné (phase 0 / rattrapage de run de version). Chaque étape actualise ensuite
ses fichiers (conception → FONCTIONNEL, design/development → TECHNOS et ARCHITECTURE,
development → MODELE-DONNEES depuis le schéma réel — puis régénère les vues HTML —,
MEP → COMPOSANTS-OPS…)
et la **clôture exécute `oracle-conformite-projet` — un FAIL R-20 bloque la clôture**. Produit
importé (dépôt repris) : rattrapage explicite à l'ouverture de son premier run de version —
socle créé depuis l'état constaté, `.env.example` reconstruit (R-13) avant que R-22 ne juge.

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 20 | `docs\projet\` complet — **8 fichiers + 2 projections générées** : `TECHNOS.md` (technologies + versions + liens, ancrées lockfiles), `COMPOSANTS-OPS.md` (hiérarchie/noms/types/IDs/URLs/IPs des composants déployés — depuis `ops etat`/plans/DOSSIER-MEP, instanciations datées, placeholders si dépôt public), `PARAMETRAGE.md` (signification des variables, URLs/ports par environnement — hébergés en placeholders), `ACCES-TEST.md` (profils + comptes de démo locale), `COMMANDES.md` (install, dev, test, build, deploy qualif, rollback, seed démo — blocs exécutables), `FONCTIONNEL.md` (**TF-0087** : ce que fait le produit et pour qui — rôles, objets métier et cycle de vie, parcours, règles de gestion, exclusions assumées ; vue d'`EXIGENCES.json` quand il existe, sinon rédigé du code et daté), `ARCHITECTURE.md` et `MODELE-DONNEES.md` (**TF-0091** : sources des vues techniques — structure logique / tables-colonnes-liens — projetées en `ARCHITECTURE.html` et `MODELE-DONNEES.html` par les générateurs du pilot, vues JAMAIS éditées à la main) ; chaque fichier ouvre par un frontmatter YAML (`role`, `sources_de_verite`, `verifie_le`). Noms **fixes** — documents vivants exemptés du nommage daté R-4 (ce ne sont pas des livrables). Autres fichiers admis seulement s'ils servent l'automatisation ou l'onboarding ET n'existent pas déjà sous forme machine (sinon renvoi) | manque constaté : les runs de version redécouvrent tout ; FONCTIONNEL : demande humaine en clôture du run Produit-11 | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 21 | Fraîcheur TECHNOS : chaque `nom@version` du frontmatter `versions:` de `TECHNOS.md` correspond aux lockfiles/manifestes du produit (`package-lock.json`, `pyproject.toml`…) — une version divergente = FAIL | loi 4 : une donnée volatile est une donnée | produits | O | nul | **défaut** |
| 22 | Parité PARAMETRAGE ↔ `.env.example` : les noms de variables déclarés dans le frontmatter `variables:` de `PARAMETRAGE.md` et ceux de `.env.example` (R-13, qui reste la liste qui fait foi) sont identiques | double vérité interdite | produits | O | nul | **défaut** |
| 23 | `ACCES-TEST.md` : en-tête dur littéral « comptes de démonstration locale — jamais valides hors MODE_DEMO » présent, comptes créés par seed derrière drapeau `MODE_DEMO` (loi 2), **zéro motif de secret réel** (motifs d'oracle-secrets) ; tout accès d'environnement réel = référence `# à fournir :` (R-15 → non_testables) | R-14 + loi 2 + régime public | produits | O | nul | **défaut** |

## E. Environnements et configuration

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 13 | `.env.example` versionné et **exhaustif** : toutes les variables attendues — applicatives ET infra (ports, URLs, cible de déploiement, drapeaux `*_MODE_DEMO`) — valeurs par défaut sûres ou vides, en-tête « ne jamais renseigner de secret ici » | observée (design, tests, ASDMailManager, Produit-02 — en-tête littéral constaté) | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 14 | `.env` réel toujours gitignoré ; aucun secret committé, jamais | observée partout + loi pilot existante | tous | O | nul | **défaut** (quasi-loi déjà) |
| 15 | Les variables que la forge ne peut pas renseigner (clés tierces, identifiants) portent un commentaire `# à fournir :` dans `.env.example` — elles alimentent directement les `non_testables[]` de l'étape qualif (RT-6) | générique, prolonge RT-6 | produits | P0+S | faible | **défaut** |
| 26 | **Modèle de données ancré au schéma réel** : chaque table déclarée dans `MODELE-DONNEES.md` porte une `provenance:` (fichier/dossier de schéma — migration, ORM, DDL) qui existe et contient le nom de la table ; table introuvable dans sa provenance = FAIL localisant. Exemption explicite : « sans objet — aucune persistance » (loi 3). Placeholders de squelette non jugés. Complétude inverse et exactitude des colonnes : revue de schéma (non_juge) | **TF-0091** (décision humaine du 11/08) — le REX Produit-11 : modèle reconstitué de tête en plein run | produits, nouveaux + rattrapage | O | nul | **défaut** |
| 27 | **Surface web née ouverte aux agents IA** : tout produit à surface web copie à l'ouverture `gabarits\web\robots.txt` (agents IA de recherche AUTORISÉS par défaut — GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended… ; bloquer = décision consignée, datée et motivée DANS le fichier) et `gabarits\web\llms.txt` (carte du site pour les moteurs génératifs, ouverture reprise de FONCTIONNEL.md, tenue par development/MEP, cohérente avec le sitemap). Oracle : un `robots.txt` présent qui interdit un agent IA sans ligne de décision = FAIL ; `llms.txt` absent à côté d'un `robots.txt` = FAIL ; aucun `robots.txt` = SANS_OBJET (surface web non déclarée) | **décision humaine du 11/08 (TF-0095)** — pendant produit du nœud 58 de la grille seo | produits à surface web, nouveaux + rattrapage | P0+O | nul | **défaut** |
| 24 | **URLs d'application par environnement** : tout environnement hébergé expose son application sous un hôte préfixé `<nom-appli>-<env>.<domaine>` avec env ∈ {`dev`, `qualif`, `production`} — ex. `https://produit-02-production.up.railway.app`. Le staging outillé de l'étape MEP se nomme **qualif** dans les URLs ; le local (`localhost`, `127.0.0.1`) est hors périmètre ; les hôtes non applicatifs (BDD…) aussi. Vérifié sur la table « URLs & ports par environnement » de `PARAMETRAGE.md` (placeholders `<…>`/`{…}` non jugés) | **décision humaine du 11/08** (TF-0090) | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |

## F. Livrables et archivage

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 16 | Les rapports finaux destinés à l'humain (DOSSIER-MEP, PV, revues) sont **copiés** dans `output\` au nommage daté (n° 4) — l'original de travail reste sous `forge\etapes\` | cohérence avec `digit-ai-forge-agents/output/` | produits | S | faible | **défaut** |
| 17 | Les journaux d'oracles (`*.oracles.json`, `*.oracles-historique.jsonl`) sont versionnés dans `forge\` (ce sont des preuves), ignorés partout ailleurs | observée : présents dans Produit-12/forge/ | produits | P0 (.gitignore) | nul | option (conflit C4) |
| 18 | `forge\retours\` existe (gabarit inclus) ; chaque lot de retours forges est un fichier `<projet> - RETOURS - <AAAAMMJJ><indice>.md` (+ sidecar `.tf.jsonl` homonyme) — **le préfixe projet est obligatoire** (décision 13/08 : les lots de tous les projets cohabitent chez le pilot, le nom dit qui retourne quoi), un fichier par lot, ids en séquence continue par produit, **jamais modifié après remise** ; remise = copie dans `input\00-retours\` du pilot (après ingestion, la paire part en `old\`) | **mandat humain du 06/08**, préfixe + famille 00-retours **13/08** ; format éprouvé (Produit-12, Produit-10) | produits, nouveaux + rattrapage | P0+S+O | faible | **adoptée** (décisions 06/08 et 13/08) |

## G. Circuit des conventions (D-13) — traçabilité organization → pilot

Aboutissement de Q-B (TF-0039, constat du 11/08). Le circuit — proposition `D-xx` chez
organization → remise au pilot → **décision humaine** → encodage ici + oracle — a été
traversé en réel une première fois : **D-03/Q3-bis → règle 4 → oracle de conformité**
(les deux documents se référencent). État de chaque proposition, sans raccourci : rien
n'est encodé sans décision, rien de décidé n'est laissé sans encodage tracé.

| D-xx (organization, décidées 08-09/08) | Encodage corpus | État |
|---|---|---|
| D-01 `output/` ≠ artefacts de build | règle 2 (`dist/` hors périmètre : pas un livrable) | encodée |
| D-02 indice obligatoire + archivage `Old\` sans effacement | règles 5 et 7 | encodée — soldée 11/08 (TF-0084) ; **casse alignée 13/08 (D-15/TF-0149)** : la graphie qui prévaut pour `output\` est désormais `old\` **minuscule** (état de fait des 6 dépôts) — `Old` reste le fait d'époque, non réécrit |
| D-03 préfixe = nom du projet (Q3-bis) | règle 4 | **encodée — cas d'école du circuit** |
| D-04 taxonomie des types, registre `registre-types.json` | **règle 25** (oracle, lecture seule du registre) | **encodée 11/08 (TF-0084)** — registre 1.1.0 complété sur usage réel (29 types) |
| D-05 `CLAUDE.md` point d'entrée, compléments référencés | règle 11 + gabarit `CLAUDE-PRODUIT.md` | encodée |
| D-06 `input/` = fourni par l'humain · `output/` = ce qui sort | règles 1 et 2 | encodée — précision « la doctrine n'est pas une sortie » **adoptée au corpus 11/08 (TF-0084)**, portée au périmètre de la règle 2 |
| D-07 artefacts de traçabilité : patron optionnel | non-obligation explicite | sans objet |
| D-08→D-11 livrable HTML sortant : charte + autonomie + généré | mécanisme livrable, pas socle projet : `references\BEST-PRACTICES-HTML.md` + socle `digit-ai-page-html` + recette `check_html`/`render_page` (loi qualité) | couvertes — défaut D-10 **corrigé 11/08 (TF-0085)** : contrôle A1 exécuté dans `check_html.py` (self-test 30/30), vrai positif corrigé sur le boilerplate même |
| D-12 composant partagé : inliner, jamais installer en douce | garde-fou pilot « aucune écriture dans les dépôts frères hors mandat » | encodée |
| D-13 le circuit lui-même | CLAUDE.md pilot, ligne de gouvernance Q-B | encodée |
| D-14 `forge-steering` → `forge-pilot` | répercuté sur les surfaces VIVANTES (bootstrap, README, schéma) — **corrigé le 17/08 (TF-0332)** : « répercuté partout » était faux, 26 occurrences de `forge-steering` subsistent (histoire, archives, faits d'époque — jamais réécrites, classe a. de l'énumération 20260817i) ; TF-0062 fut archivé sans `gains_constates` ni `corrections_realisees`, et la jonction que son texte ordonnait de conserver a disparu avant preuve — dette de traçabilité soldée par cette ligne et par la fenêtre A du renommage factory | constatée, **soldée en traçabilité 17/08** |
| D-15 rangement `output\` en familles numérotées (`01-…`, une version courante à la racine, versions antérieures dans `old\` **minuscule**, `LISEZMOI.md` de mapping obligatoire si références antérieures) | appliqué le 13/08 (pilot 5 familles, agents/design/organization/seo) ; casse `old\` **tranchée par l'humain le 13/08** (alignement sur l'état de fait, supersède la graphie `Old` de D-02 pour `output\`) | **encodée 13/08 (TF-0149)** — mécanisation de D-15 dans `oracle-conventions` = candidat |

Q4 (conventions internes aux fichiers) reste ouverte **côté organization** — pas une
décision pilot tant qu'aucune proposition n'est remise.

## H. Admission d'une nouvelle forge (règle 28 — décidée le 12/08, TF-0125)

Issue de l'étude d'opportunité du 12/08 (`output\03-etudes\20260812-etude-opportunite-forges.md`),
qui a départagé 4 candidatures avec ce critère (fixture de validation : appliqué aux 4,
il redonne les verdicts rendus — 1 forge, 3 profils).

**R-28.** Une forge naît si et seulement si :
1. elle porte **≥ 2 verbes outillés exécutables** qui n'existent dans aucune forge —
   prouvé par un **verdict de non-recouvrement écrit** citant le catalogue de services ;
2. sa v0 naît **exercée** : oracles propres à self-test double sens, fixtures synthétiques
   (précédents : forge-data TF-0083, agents-security/observability TF-0111/0112) ;
3. elle a une **cadence ou un mandat propres** qui la distinguent d'une extension d'une
   forge existante ;
4. son intégration des surfaces écosystème (bootstrap, fiche, INVENTAIRE, CONTRAT,
   noyau, README, schéma, catalogue) est livrée **le jour même** — `oracle-ecosysteme`
   fait foi.

**Corollaire** : un corpus de savoir sans verbe outillé est un **référentiel versionné**
(frontmatter daté-sourcé, fraîcheur par claims — `profils\`, `references\`), jamais une
forge (loi transverse n° 4).

Contrôle exécutable : périmètre écosystème (pas socle produit) → R-28 ne rentre pas dans
`oracle-conformite-projet` ; les points 2 et 4 sont déjà tenus par les self-tests des
forges et `oracle-ecosysteme` ; **le point 1 est mécanisé depuis le 14/08** : règle E8
d'`oracle-ecosysteme` — toute forge née après R-31 porte un verdict de non-recouvrement
écrit dans sa fiche (les 14 forges antérieures sont en antériorité déclarée), self-test 7/7.

## I. « L'IA fait, l'humain décide » (règle 29 — décidée le 12/08, TF-0131)

Décision humaine directe du 12/08 (TF-0131) : une pratique déjà vécue en session mais
jamais encodée — chaque run ré-arbitrait au cas par cas ce qui revient à l'IA et ce qui
revient à l'utilisateur, sans critère écrit.

**R-29.**
1. Toute démarche proposée à l'utilisateur (accueil, plans d'étape, dossiers MEP)
   présente PAR DÉFAUT la voie automatisée. Toute action laissée à l'utilisateur porte
   sa justification écrite, parmi trois motifs seulement : un secret à fournir, une
   décision de goût, un GO de gouvernance. Une action sans l'un de ces trois motifs
   reste à l'IA.
2. Tout rapport remis à l'humain classe les actions restantes en trois catégories : IA,
   développeur, utilisateur — reprise du format `actions[]` de forge-tests, généralisé
   hors de ce seul contexte.
3. Les propositions d'outils ou de services tiers sont admises, marquées « en option ».
   L'exécution d'un service tiers payant exige un GO humain préalable — le garde-fou
   « aucune API tierce payante hors modèles Claude » prime toujours sur R-29. Les gates
   déjà en place (GO production, mandats humains) priment toujours sur R-29.

Surfaces d'application encodées : `references\ACCUEIL.md` étape 5 (démarche proposée),
`gabarits\AGENT-CAMPAGNE.md` (rapport final des agents de campagne).
Mécanisme : S (vérification pilot à l'ouverture de run). Contrôle exécutable : hors
`oracle-conformite-projet` (portée transverse aux prompts et rapports, pas au socle
d'un projet produit) — reste de TF-0131, à mécaniser si un gap se constate en run réel.

## J. Thème clair et bascule sombre câblée (règle 30 — décidée le 12/08, TF-0131)

Décision humaine directe du 12/08 (TF-0131), prolonge C4 (light theme systématique,
socle `digit-ai-page-html`) : le thème clair reste le défaut confirmé, une bascule
sombre devient obligatoire sur tout HTML autonome livré.

**R-30.**
1. Périmètre : tout HTML autonome livré — pages produit et livrables documentaires du
   socle `digit-ai-page-html`. Thème clair par défaut (confirme C4, ne le remplace pas).
2. Bascule sombre en zone d'en-tête (position par défaut : haut à droite, géométrie
   fine tenue par les tokens et gabarits du socle HTML) : câblée — une bascule sans
   effet observable est un défaut (loi transverse n° 1) ; choix persisté en
   `localStorage`. **Amendement TF-0158 (13/08) : clair par défaut STRICT** — l'héritage
   `prefers-color-scheme` à la première visite est RETIRÉ (appliqué à la lettre, il a
   produit le retour humain du 13/08 « thème sombre par défaut » sur un livrable réel :
   un livrable circule et doit s'ouvrir identique chez tous ses lecteurs) ; le sombre
   est un choix explicite du lecteur, persisté ; palette sombre
   dérivée mécaniquement des tokens clairs — une source, deux projections, jamais une
   seconde charte ; contraste AA tenu dans les deux thèmes ; l'impression
   (`@media print`) reste toujours en thème clair, quel que soit le thème affiché à
   l'écran au moment de l'impression.
3. Révocation par projet : consignée dans le frontmatter de `docs\projet\PARAMETRAGE.md`
   — une exception non consignée par écrit n'existe pas ; un contrôle rendu
   SANS_OBJET porte toujours son motif ; aucune neutralisation silencieuse.

**Amendement RV-9 (14/08, lot Produit-10)** — le retour signalait R-30 comme « incohérente ».
Vérification faite : la RÈGLE était déjà juste depuis TF-0158 ; c'est le **pattern de
référence** qui la contredisait — le snippet S-G1 que les implémenteurs copient, et **la
fixture VERTE de l'oracle G1**, suivaient encore `prefers-color-scheme`. La preuve de
conformité démontrait donc le comportement interdit, ce qui explique que « deux livrables du
même socle puissent s'ouvrir différemment sur le même poste ». Les deux sont alignés. S'y
ajoute `<meta name="color-scheme">` : figé à `light dark`, le navigateur peignait ses propres
surfaces (ascenseurs, contrôles) en sombre sur un corps clair — il **suit** désormais le thème
effectif, juste dans les deux états. Le retrait de la bascule, lui, n'est PAS demandé et n'a
pas été fait : il contredirait le point 2.

Surface d'application encodée : `references\BEST-PRACTICES-HTML.md` (pattern de
référence HTML/CSS/JS + deux fixtures preuves, double sens). Mécanisme : S + pattern
référencé depuis tout run produisant du HTML. **Contrôle exécutable : soldé** — la règle
G1 de `check_html.py` (skill `digit-ai-page-html`) tient le contrôle depuis les campagnes
des 12-13/08 : bascule présente non câblée = FAIL bloquant, absence totale = avertissement
(rendu figé légitime), fixtures g1-* à double sens au self-test.

## K. Admission de tout objet durable (règle 31 — décidée le 13/08, TF-0156)

Généralise R-28 : les dossiers d'opportunité du 12-13/08 ont tranché des naissances de
référentiels, de verbes, de consignes et de règles avec le même raisonnement que R-28,
appliqué par symétrie — le raisonnement tenait, il n'était opposable nulle part.

**R-31.** Un objet durable nouveau (forge, skill, gabarit exécutable, oracle, profil,
référentiel) naît selon le même test qu'une forge, R-28 devenant son cas particulier :
1. **≥ 1 verbe outillé exécutable** absent partout ailleurs, prouvé par un **verdict de
   non-recouvrement écrit et cité** (≥ 2 pour une forge — seuil R-28 conservé) ;
2. il naît **exercé** : oracle ou self-test à double sens dès la v0 ;
3. il a une **cadence ou un mandat propres** ;
4. ses **surfaces d'intégration** sont livrées le jour même.

**Corollaire (conservé et étendu)** : sans verbe outillé, c'est un **référentiel
versionné** (frontmatter daté-sourcé, fraîcheur par claims) — jamais une forge NI un
skill. Fixture de validation : R-31 rejouée sur les 5 verdicts rendus du 12-13/08
(forge websec · profils produit · verbe `importer` + profils-moteur · personas écartés ·
NO-GO skill Opportunité) redonne les 5 verdicts — aucun ne bascule.

## L. Gate aval des livrables HTML (règle 32 — décidée le 13/08, retour Produit-10 RV-4)

Constat : un livrable HTML (`Client-A - Rapport Client-C - Mapping… - 20260812c.html`) est
sorti avec 31 bloquants `check_html` + 21 bloquants V2 `render_page` — aucun gate ne
l'avait mesuré. Le §2 bis du contrat couvre l'AMONT (gabarits des forges) ; R-32 couvre
l'AVAL (tout HTML déposé en sortie).

**R-32.** Tout fichier `.html` déposé dans `output\` (ou remis à un client) passe
`check_html.py` **et** `render_page.py` avant remise ; le verdict est consigné en
journal d'oracle sous `forge\` (versionné, décision C4). Un `.html` d'`output\` sans
journal d'oracle correspondant est un défaut. Mécanisme : O — contrôle R-32 de
`oracle-conformite-projet.mjs` (présence du journal ; le contenu du verdict reste
porté par le journal lui-même).

## M. Sécurité offensive — sur mandat, jamais dans la voie automatique (règle 33 — 14/08, TF-0189)

Constat de l'étude du 14/08 (`output\03-etudes\20260814-etude-opportunite-pentest-owasp.md`) :
forge-websec porte un contrat ASVS 5.0.0 L1 depuis le 12/08 que **rien ne branche au cycle**
(dette D-W3 : « jamais exercée sur produit réel ») — un produit franchit M-1…M-5 sans qu'aucune
exigence de sécurité lui soit opposée. Et le pentest manuel, exclu par websec (README §Limites),
n'est repris par personne.

**R-33.** Deux volets indissociables.

1. **Branchement de l'existant** — les exigences ASVS curées s'opposent à l'étape *conception*
   (le profil `webapp` les pointe déjà), la méthode de test s'exécute à l'étape *tests*, et le
   verdict websec est produit au *gate MEP*. Un produit web dont aucun verdict websec n'est au
   dossier de MEP porte un manque déclaré, pas un silence. *(Le caractère bloquant ou non de ce
   verdict au gate reste une décision humaine ouverte — cf. l'étude, §5.)*
2. **Voie offensive sur mandat** — toute exécution de sécurité **active** (DAST, fuzzing,
   injection réelle, test d'intrusion) est une **voie sur mandat humain, jamais la voie
   automatique d'un run**. C'est l'exception explicite et motivée à la loi transverse n°5
   (« la voie automatisée est le défaut ») : une capacité à double usage ne s'exerce pas par
   défaut. Six garde-fous, tous exigibles avant exécution : périmètre autorisé **par écrit**
   (cible nommée, fenêtre datée, autorisation consignée au ledger) · jamais sur un tiers ·
   instance dédiée, jamais la production servant des utilisateurs réels sans autorisation
   distincte · aucune technique d'évasion de la journalisation ou de la détection · identifiants
   de test cloisonnés et révoqués à la clôture, `.env` jamais transmis · l'outil observe, il ne
   modifie jamais le produit testé (G-1 transposé).

Mécanisme : porté par l'oracle DAST de forge-websec, **fail-closed** — l'oracle refuse de
s'exécuter si la cible n'est pas déclarée autorisée. **Exécution prouvée le 14/08 (TF-0206)** :
ZAP 2.17.0, passe passive sur instance autorisée, trois alertes réelles, garde-fou rejoué.

**R-33 bis — le verdict websec au gate MEP : PRÉSENT, non bloquant, paramétrable
(décision humaine du 14/08).** Le verdict de sécurité est produit et porté au dossier de MEP
dès maintenant ; il **n'interdit pas** la mise en production. Un produit qui n'en porte aucun
a un **manque déclaré**, pas un refus. Le passage au bloquant se fait par un **paramètre
unique et versionné**, sans retoucher la règle :

```toml
# docs\projet\PARAMETRAGE.md — frontmatter du produit
[gates]
websec_bloquant = false   # défaut de l'écosystème au 14/08
```

Quand il passe à `true`, un verdict websec absent ou FAIL bloque le GO — et le passage se
consigne comme toute décision (qui, quand, sur quel constat). Deux raisons de ne pas l'armer
d'office : aucun produit n'a encore de verdict websec de bout en bout, et armer un gate que
personne n'a exercé le ferait désarmer au premier faux positif — un gate qu'on apprend à
contourner ne protège plus rien.

**R-33 ter — l'admission d'un skill tiers passe par le scan, en avertissement d'abord.** Tout
skill venu de l'extérieur passe `oracle-scan-agentdef.mjs` (CAP-1..4) **avant** admission au
sens de la règle 31 ; le verdict est **consigné et non bloquant** au 14/08, avec le même
interrupteur (`[gates] admission_skill_bloquante = false`). Motif de ne pas l'armer tout de
suite : l'oracle n'a jamais scanné un skill tiers réel — l'armer sur une population non
mesurée produirait des refus qu'on lèverait à la main, c'est-à-dire un gate mort. Motif de
l'armer bientôt : sur 3 984 skills publics audités en 2026-02, **1 467 portent un défaut et 76
une charge malveillante confirmée**.

## N. Un pan d'audit qui DÉPENSE est sur mandat (règle 34 — 14/08, TF-0202)

Constat de l'étude du 14/08 sur les tests de prompts : un pan qui appelle un modèle pour
mesurer (stabilité d'une réponse, jugement sémantique) engage une **dépense** à chaque audit.
La règle 29 pose que « dépenses et gates restent humains » ; elle n'était pas exécutable au
niveau du pan.

**R-34.** Un pan d'audit qui appelle un modèle payant n'entre **jamais** dans la voie par
défaut : il s'active explicitement (`--pans <nom>`), sous plafond de dépense (gate budget G0 de
forge-agents), et le rapport publie ce qu'il a consommé. Corollaire opposable : **un audit
lancé sans option ne coûte rien** — c'est ce qui permet de le rejouer sans arbitrage. Un pan
qui dépense sans ces trois conditions est un défaut d'auditeur, pas une fonctionnalité.

**Seuils du volet stabilité (décision du 14/08)** — aucune source primaire ne les normalise
(constat de l'étude du 14/08 : le vocabulaire est stabilisé, les chiffres ne le sont pas). Ils
sont donc un **choix de l'écosystème, déclaré comme tel et publié au rapport**, jamais présenté
comme une norme : **5 rejeux** par cas et **stabilité exigée à 100 %** (toute variation de
réponse à entrée identique est un constat). Le fondement du rejeu, lui, est mesuré et non
choisi : à température 0, 1 000 complétions produisent 80 sorties distinctes — un run unique
ne mesure rien. Ces deux nombres se révisent sur mesure, pas sur opinion.

**Outillage tiers du volet stabilité : ouvert, sous conditions (O4 de l'étude).** Envelopper un
outil libre à verdict machine (promptfoo, DeepEval, Inspect AI — tous libres et gatables) est
**autorisé**, à trois conditions : l'enveloppe reste **paramétrable** (jamais un outil codé en
dur — la plateforme Evals d'OpenAI s'arrête le 2026-11-30 et Ragas n'a pas publié depuis
2026-01), l'outil n'est **jamais installé par l'oracle**, et son absence donne un **SKIP
motivé** — exactement la discipline d'`oracle-sca` et d'`oracle-dast`.

**Skill tiers en exécution : NON, et ce n'est pas un report.** L'option O2 de l'étude
taste-skill (vendorer un skill externe pour l'exécuter) reste **fermée** tant que la réserve A1
n'est pas levée : ce skill prescrit des ressources chargées par le réseau que `check_html.py`
refuse en FAIL bloquant. Admettre un objet qui prescrit ce que l'écosystème interdit mettrait
deux règles en contradiction chez le constructeur. La voie ouverte reste la **barre** (importer
un niveau) et l'**extraction attribuée** des règles compatibles — toutes deux livrées.

## O. Un contrôle qui existe sans être joué n'existe pas (règle 35 — 15/08, TF-0232)

Trois occurrences en deux jours, même maladie sous trois visages :

- la consigne `RESTITUTION.md` v1 — écrite, **citée par aucun run**, donc jamais appliquée ;
- `ruff` dans forge-tests — configuré, rendant 21 erreurs, **appelé par aucun pas de recette** ;
- les self-tests des oracles du pilot — huit recettes à double sens, **jouées par rien**. Le
  jour où un agrégateur les a lancées, il a trouvé que `oracle-claude-md`, gardien du plafond
  du noyau depuis TF-0037, **n'avait aucun self-test** : il n'avait jamais été vu refuser quoi
  que ce soit.

Le point commun n'est pas la négligence, c'est la **forme de la règle** : « il faut penser à
le lancer » n'est pas un mécanisme. Un contrôle sans appelant est une décoration, et une
décoration donne la même assurance qu'un garde-fou sans en avoir la propriété.

**R-35.** Tout contrôle livré (oracle, linter, self-test, recette) désigne **son appelant** au
moment où il est écrit — un pas de recette, une étape de run, un gate. Un contrôle sans
appelant nommé n'est pas livré : il est en dette, et se déclare comme tel.

Deux corollaires opposables :

1. **À l'ouverture de tout run**, `node oracles\self-tests.mjs`, `node
   oracles\oracle-boite-entree.mjs` et `node oracles\oracle-skills.mjs` sont joués et leurs
   verdicts portés au ledger en `oracles_verdict` (pas 1 de `references\ETAPES-RUN.md`). Un
   échec **suspend l'ouverture** : des oracles qui ne savent plus refuser ne peuvent rien juger
   de ce qui suit, un lot non pris fausse tout ce qu'on croit savoir du reste-à-faire, et un
   skill — ou un hook (K6-K8, TF-0290/0297/0305 : intégrité, câblage, existence du fichier
   câblé) — divergent fait exécuter autre chose que ce que le dépôt versionne.

   *Corollaire du corollaire, appris le 15/08* : un applicateur ne présume **jamais** du sens
   de la dérive. La copie installée n'est pas toujours celle qui est en retard — `--appliquer`
   refuse d'écraser une version par une plus ancienne (K5), sinon « synchroniser » détruit du
   travail.
2. **Invariant I1** — un oracle sans recette à double sens est un **échec** de l'agrégateur,
   jamais un silence. Sans cela, ajouter un oracle non testé serait la façon la plus simple de
   faire baisser le compte d'échecs.

## P. La restitution se conçoit pour ses lecteurs (règle 36 — 15/08, TF-0235)

Le cas fondateur : le rapport SEO d'Produit-02 (20260809k) — conforme au socle,
illisible pour ses lecteurs. 491 Ko sur une page, zéro graphique, des KPIs sans lecture :
la conformité de la PAGE ne dit rien du travail qu'elle fait auprès de qui la lit.
La compétence vit chez **forge-design** (`REFERENTIEL-RESTITUTION.md` : familles
rapport/suivi/registre, lecteurs types, règles RL-1..RL-10, gabarit consommable) ; la
règle opposable vit **ici** — arbitrage de gouvernance du 15/08 (mandat global) :
« organization organise, pilot pilote » vaut aussi pour design — la forge outille,
le pilot impose.

**R-36.** Tout livrable HTML de restitution (rapport d'audit, dashboard de suivi,
registre-outil) **déclare sa famille** (`data-restitution="rapport|suivi|registre"`) et
**passe `oracle-restitution`** (forge-design). Une page de restitution qui ne se déclare
pas est un écart à déclarer en revue de campagne — jamais un silence (loi n° 3).

**Appelant (R-35)** : le registre global quality-oracles v2.11.0 (gate C7 à l'écriture,
C6 à la diffusion — déclenchement par contenu `data-restitution`, SKIP motivé sinon) ;
en revue aval, la dimension D8 de `critique-le-design` (étape 5 bis). Producteurs déjà
migrés à la naissance de la règle : forge-seo (e80e078). Les autres forges productrices
migrent par campagnes mandatées (P4), chacune journalisée.

## Q. Toucher une UI engage les verdicts de la forge, run ou pas (règle 37 — 15/08, TF-0285)

Le cas fondateur, mesuré le 15/08 : sur `produit-07` — produit **legacy**, jamais né sous
la doctrine — une session ad hoc ajoute une pastille de langue au header. Contrôles joués :
un crawl HTTP (401 routes en 200) et des greps de présence de liens. Résultat en
production : **le menu français compressé**, chevauchant le logo. Les contrôles n'étaient
pas absents ; ils testaient la **modification**, jamais l'**expérience**.

Pourquoi le trou existait : le routage forge d'un produit vit dans son `CLAUDE.md`, posé
**à sa naissance sous la doctrine** (`ETAPES-RUN.md` §1 : « la section "Routage forge" est
obligatoire et remplie : c'est elle qui garantit que les sessions ad hoc dans le produit
passent par les forges pour tout verdict »). Un legacy n'a jamais reçu ce fichier : le gate
n'a pas été retiré, **il n'a jamais été posé**.

**R-37.** Toute session qui modifie l'**interface** d'un produit — forgé ou non, dans un run
ou hors run — rejoue avant de livrer, au minimum :
1. le **rendu en pixels** des pages touchées, avant ET après (débordements, chevauchements,
   retours à la ligne nouveaux) — le rendu se juge en pixels, pas en présence de liens ;
2. si le produit sert plusieurs langues, le **verdict de parité** (routes, navigation,
   langue du contenu) sur les pages touchées ;
3. et, **au premier contact** avec un produit legacy, le rattrapage de la seule section
   « Routage forge » de son `CLAUDE.md` (pas le socle entier — c'est l'appelant durable qui
   manquait, il se pose une fois et sert ensuite toutes les sessions).

**Appelant (R-35)** : la règle est portée par le pilot (ici) et **rendue tenable par un
geste court** — une seule commande, avant/après, verdict machine (forge-design, TF-0286) :

```
node oracles\rendu-comparatif.mjs --avant <fichier|url> --apres <fichier|url> [--zone <sélecteur>]
```

exit **0** aucun constat dur nouveau · **1** régression de rendu · **2** indéterminé
(outillage de capture absent → SKIP motivé, jamais une capture maison). Il ne signale que
les constats **nouveaux** — ce qui est réparé est compté et affiché, jamais porté au débit.
Une règle de vérification visuelle qui coûte plus qu'une commande n'est pas tenue hors run
— c'est le constat du 15/08, pas une prédiction.
Côté détection, R-37 s'appuie sur les pans interface (composants React inclus, TF-0283) et
i18n (TF-0284) de forge-tests.

**Écart** : possible et explicite (une modification qui ne touche aucun rendu se déclare
telle), jamais par omission — loi transverse n° 3. `organization` peut porter cette règle
à son catalogue de conventions ; sa force opposable vit ici (« organization organise, pilot
pilote »).

## R. Aucun livrable ne se publie sur un service hébergé sans GO humain (règle 38 — 17/08, TF-0302)

Le cas fondateur, sur pièces (lot `Produit-01 - RETOURS - 20260817a`, RG-07 bloquant) : un
rapport d'écarts citant **deux écarts de sécurité exploitables** (antivirus `fake`, `/docs`
ouverts) a été rendu à la fois comme fichier local et comme **page hébergée hors du poste**
(URL claude.ai/code/artifact/…, 17/08), avant toute validation humaine. Aucune règle écrite
ne l'interdisait : G-1 et R-32 cadrent l'EMPLACEMENT et la FORME des livrables sur le poste,
le garde-fou git ne couvre que le push — la publication n'a enfreint aucun texte, **c'est
exactement le défaut**. Étude : `output\03-etudes\20260817-etude-opportunite-publication-livrables.md`
(verdict O3).

**R-38.**
1. **Aucun livrable de produit** (rapport, note de synthèse, kit, dashboard, maquette —
   tout fichier destiné à l'humain ou au client) **ne passe par un outil de publication
   hébergée** (artifact, page web, pastebin, partage cloud) **sans GO humain préalable et
   consigné**. Un livrable est un **fichier autoportant sur disque**, à l'emplacement du
   produit. Publier EST une sortie du poste : une page « privée par défaut » peut être
   mise en cache ou indexée — la réversibilité n'est jamais garantie.
2. **Le retrait n'est pas outillé** (constat du 17/08, option O4 de l'étude — aucun verbe
   machine de suppression) : toute publication fautive se retire **à la main dans
   l'interface du service**, et le retrait se consigne (qui, quand, URL) comme toute
   décision. Une publication non retirable se déclare au ledger en écart, jamais en silence.
3. Périmètre : livrables des produits ET du pilot ; les pages dont la publication est la
   FINALITÉ décidée du produit (site public en MEP) suivent leur voie normale (gates MEP,
   GO humain) — R-38 vise le canal de COMMODITÉ, pas la mise en production.

**Appelants (R-35)** : le garde-fou du noyau (`CLAUDE.md` §Garde-fous) et
`gabarits\CLAUDE-PRODUIT.md` §Conventions (toute session produit le charge) ; la FORME
autoportante est mécanisée par `check_html.py` étendu (TF-0303 — un fichier écrit pour un
hôte qui fournit `<head>` est détectable : ni doctype, ni charset) ; le gate C7 à
l'écriture reste le point de contrôle amont (réinstallation : décision humaine pendante).

## S. Familles nommées et numérotation stable — output\ et docs\ (règle 39 — 17/08, TF-0347/0348)

Mandat humain direct du 17/08 (prompt analysé L99, écarts validés poste par poste).
Convention cataloguée chez organization le même jour : **D-16** (registre des noms
canoniques de familles — `XX-audit`, `XX-tests` au départ).

**R-39.**
1. **Noms de familles transverses conventionnés** : les documents d'un audit vivent dans
   une famille `XX-audit` d'`output\`, les documents de stratégie et d'exécution de tests
   dans `XX-tests` — le NOM vient du registre D-16 (identique partout), le NUMÉRO est
   local au dépôt.
2. **Numérotation stable** : le numéro s'attribue à la création (premier numéro libre du
   dépôt) et ne se renumérote JAMAIS — un renumérotage casse les chemins portés par les
   registres à événements figés (cas réel TF-0339). Le `LISEZMOI.md` (D-15 al. e)
   documente, il ne se substitue pas à la stabilité.
3. **Extension à `docs\`** : les documents pérennes HORS socle `docs\projet\` se rangent
   dans des sous-dossiers thématiques numérotés de `docs\` (`01-…`, `02-…`), mêmes règles.
   **`docs\projet\` est INTOUCHÉ** : ses 8 fichiers à noms fixes (R-20) alimentent
   générateurs et oracles — les numéroter exigerait une étude, jamais une improvisation.

**Appelant (R-35)** : revue de clôture de run (R-4/D-15 déjà jouées par
`oracle-conformite-projet`) ; la mécanisation des familles (D-15 + D-16 ensemble) reste
la dette déclarée par D-15 elle-même — candidature de mécanisation au registre.

## T. Un test proposé s'exécute — la voie « proposition de tests » est fermée (règle 40 — 17/08, TF-0349)

Mandat humain direct du 17/08 ; étude `output\03-etudes\20260817-etude-opportunite-tests-bout-en-bout.md`
(verdict O3). Le coût, mesuré sur pièces le jour même : des « Cahiers de tests » qui se
déclarent eux-mêmes proposition, soldes réels **971 cas dérivés / 0 adopté** (Produit-11) et
**680 / 0** (COMPTA) — des contrôles jamais joués livrés comme s'ils protégeaient (R-35).
La forme cible existe déjà : le rapport d'exécution STRATEGIE-E2E de Produit-11 (69 tests
verts, mutation 0,90).

**R-40.**
1. **Trois états seulement** pour tout cas de test dérivé : **adopté et exécuté** ·
   **`non_testable` motivé** (idiome RT-6 : `champs_requis[]` nommés — il se répare en
   fournissant, pas en écrivant) · **écarté par décision humaine nommée** (qui, quand,
   pourquoi). L'état « proposition » n'est plus un état terminal : un cahier remis dont
   le solde `dérivés − adoptés − non_testables − écartés` n'est pas nul porte un
   reste-à-faire, jamais un livrable clos.
2. **La chaîne s'exécute de bout en bout** — cas de tests, jeux de données, exécution
   réelle, rapport d'exécution dans la famille `XX-tests` d'`output\` (R-39), corrections
   sous les gates existants : boucle de fermeture ≤ 5 cycles, G-2 absolue, G-1
   (l'auditeur ne modifie pas le produit — les correctifs passent par la voie du
   produit), dépenses et GO humains inchangés (R-29). Les cahiers de travail restent
   sous `forge\etapes\`, seul le rapport d'exécution est un livrable d'`output\`.
3. **L'e2e déclare le cycle de vie de son instance** (monter/démonter, ce qui reste
   debout est publié) — la règle s'arme pleinement à la résolution de TF-0340/0341.

**Appelants (R-35)** : le pas de l'étape 5 (`ETAPES-RUN.md` — la boucle ne se clôt pas
sur un solde non nul) et le contrat « prêt client » (traçabilité exigences→tests 100 %
s'entend désormais en cas EXÉCUTÉS) ; **mécanisé** : `oracles\oracle-adoption-tests.mjs
<racine-produit>` (A1-A5, self-test 12/12, antériorités < 17/08 jamais jugées — premier
tir réel : 1065/0 sur Produit-11). Les deux issues non-adoption se déclarent dans le sidecar
`<produit>\forge\cas-ecartes.jsonl` — `{"cas","statut":"non_testable","champs_requis":[…]}`
ou `{"cas","statut":"ecarte","qui","quand","pourquoi"}` — à côté du `cas-adoptes.jsonl`
de forge-tests (les y mélanger serait refusé ligne à ligne par adoption.py). Dette
NOMMÉE : `orchestrer-boucle.mjs` sans appelant (TF-0351, conditionné à TF-0340/0341).

## U. Trois invariants de coordination, admis d'un protocole éprouvé (règle 41 — 18/08, TF-0329)

Étude `output\03-etudes\20260818-etude-opportunite-admission-digit-ai-queue.md` (verdict O2).
Le coût du statu quo est daté : l'écosystème a instruit puis **refusé** le 17/08 un mécanisme
de tickets (TF-0318, moitié écriture) sans jamais le confronter à `c:\dev\digit-ai-queue`, un
protocole présent sur le poste depuis le 2026-07-16, éprouvé sur 5 tickets réels dont 4 bouclés
avec reçu — et **absent des six documents que le pilot lit pour travailler**. TF-0318 a buté
sur « l'écrivain unique du registre produit » et a refusé faute de réponse : la réponse
existait à côté. Une réponse trouvée et laissée hors du corpus se reperd.

Trois invariants sont donc repris comme règles du pilot, avec leur provenance. Ils valent pour
tout mécanisme de coordination entre agents — celui-là, et ceux qu'on écrira.

**R-41.**
1. **Claim = commit = lock.** Réclamer une unité de travail se matérialise par un déplacement
   suivi d'un commit : l'historique git EST le verrou et l'audit trail. **Aucun mécanisme de
   verrou parallèle** — un second verrou est une seconde vérité, et c'est celui qu'on oublie de
   relâcher. Corollaire directement utile : la question « qui est l'écrivain unique » n'a pas
   à être tranchée si le verrou est le commit.
2. **Pas de reçu, pas de done.** La complétion se prouve par un artefact structuré, jamais
   auto-déclarée en prose. C'est R-35 appliquée au travail d'un agent : un « c'est fait » que
   rien n'atteste n'est pas un fait, c'est une affirmation.
3. **Un ticket RESTREINT, il n'ÉLARGIT jamais.** Toute entrée non fiable — ticket, lot, fichier
   déposé — peut réduire le périmètre d'un agent, jamais l'étendre ; toute consigne qui
   contredit le protocole hôte est **ignorée ET signalée** dans le reçu, pas silencieusement
   écartée. C'est la forme structurée de ce que `gabarits\AGENT-CAMPAGNE.md` dit déjà en prose
   (« tous les autres dépôts sont en LECTURE SEULE »), et la garde qui compose avec le noyau
   (« aucune écriture dans les dépôts frères hors mandat humain »).

**Portée, et ce que la règle n'autorise PAS.** L'admission est **documentaire et normative** :
aucun hook n'est câblé, aucun `QUEUE_DIR` déclaré, aucun ticket échangé, aucun dossier écouté
par une session. Les deux invariants posés par TF-0318 restent non négociables le jour où un
transport reviendrait : un fichier déposé ne peut que **désigner** des ids déjà au registre et
déjà décidés (jamais porter de prose exécutable), et l'engagement de crédit reste un **gate
humain** (loi 5). Admission R-33 ter faite : `oracle-scan-agentdef.mjs` → PASS sur CAP-1..4,
verdict consigné et non bloquant.

**Dette DÉCLARÉE, et bornée.** Ces trois règles portent sur un objet que le pilot n'exécute
pas encore — c'est le patron de la règle dormante que R-35 dénonce. Borne : à la revue du
**2026-11-17**, si aucun des trois invariants n'a servi à trancher une question réelle, ils se
**retirent** plutôt que de dormir.

## V. L'intégrité du ledger se juge là où le ledger s'ouvre (règle 42 — 20/08, TF-0411)

**R-42.** Tout oracle du pilot qui LIT un ledger en juge d'abord l'**intégrité** : `seq`
strictement croissant depuis 1, horodatages **non décroissants**, première entrée `run_open`.
Un écart non déclaré est un **FAIL** ; un écart couvert par une entrée ultérieure de
**rectification déclarée** (`type: rectification_horodatage`, qui nomme les `seq`, le `ts`
consigné, le `ts` réel estimé et la cause) reste **imprimé** au rapport en `[RECTIFIÉ]` — jamais
effacé, jamais silencieux. **L'histoire ne se réécrit pas** : on rectifie par ajout.

*Le fait qui la fait naître.* Le contrôle d'intégrité existait depuis l'origine
(`ledger.mjs verify`, contrat d'interface §3) et n'était **câblé à aucun déclencheur** : il
n'apparaissait qu'au contrat « prêt client », en fin de run. Résultat mesuré le 20/08 sur
`Produit-11` : deux horodatages en recul (une mise en production journalisée 3 h 25
avant l'entrée qui la précède, une autre 1 h 30 avant), dans un ledger de 138 entrées, publiées
dans l'historique git — et la seconde **invisible** parce que le vérificateur s'arrêtait au
premier écart. C'est l'exemple canonique de R-35 : un contrôle qui existe sans être joué
n'existe pas.

**Ce que la règle n'exige PAS.** Elle ne réclame pas un chaînage cryptographique (aucun ledger
du parc n'en porte, et l'ajouter réécrirait l'histoire) ; elle ne juge pas la VÉRACITÉ des
horodatages, seulement leur cohérence d'ordre — un `ts` faux mais croissant reste hors de
portée, et se déclare. Corollaire d'outillage, déjà appliqué : l'écriture refuse un `ts`
antérieur au dernier (l'heure de l'ACTION appartient au payload, pas au champ d'entrée), et la
vérification **accumule** les écarts au lieu de s'arrêter au premier.

## Conflits à trancher (ta décision explicite)

- **C1 — `old\` vs git (n° 6/7)** : **TRANCHÉ le 13/08 (TF-0150)** — `old\` (minuscule,
  D-15) réservé aux livrables documentaires comme rangement de lisibilité, et **versionné**
  (git garde l'histoire du rangement comme du reste ; re-gitignorer retirerait des
  livrables déjà commités). Le code, lui, n'a que git (règle 6). L'historique du conflit
  reste ci-dessous pour mémoire.
- **C2 — n° 8 vs garde-fou actuel** : le CLAUDE.md pilot dit aujourd'hui « création du dépôt
  git du produit sur validation humaine ». La règle 8 inverserait : init + commits **locaux**
  par défaut (traçabilité dès la naissance), seuls remote/push restant sur ton GO. **Recommandé :
  adopter la règle 8** (le commit local est réversible, l'absence d'historique ne l'est pas).
- **C3 — nommage daté et code** : `main.py` ne s'appellera jamais `Digit-AI - main - 20260806a.py`.
  La règle 4 est scopée livrables ; le code suit les conventions de son langage. À confirmer.
- **C4 — journaux d'oracles** : versionnés = dossiers `forge\` chargés mais preuves rejouables ;
  ignorés = léger mais preuves perdues au clone. **Recommandé : versionnés (n° 17).**

## Après ta décision (2e mandat, non anticipé)

Les règles retenues s'encoderont dans : la **phase 0 de PROMPT-PRODUIT.md** (création du socle
P0), le **CLAUDE.md pilot** (vérifications S, y compris rattrapage en run de version), et un
**oracle « conformité projet »** exécutable (contrôles O, binaires — le n° de règle devient le
n° de finding). Rattrapage des projets existants : appliqué au prochain run de version de
chaque produit, jamais en masse silencieuse.

---

## Annexe — inventaire (preuves)

| Dépôt | CLAUDE.md | README | .env.example | input\ | output\ | Old\ | git | fichiers datés |
|---|---|---|---|---|---|---|---|---|
| pilot | ✔ | ✔ | — | ✔ | — | — | ✔ | 0 |
| conception | — | ✔ | — | — | — | — | ✔ | 2 |
| design | — | ✔ | ✔ | ✔ | — | — | ✔ | 1 |
| development | — | ✔ | — | ✔ | — | — | ✔ | 1 |
| tests | — | ✔ | ✔ | — | — | — | ✔ | 7 |
| agents | — | ✔ | — | ✔ | ✔ | — | ✔ | 14 |
| **Produit-12** (produit forge) | **—** | **—** | — | ✔ | — | — | **—** | 0 |
| ASDMailManager | — | ✔ | ✔ | ✔ | — | — | ✔ | 2 |
| Produit-02.com | — | ✔ | ✔ | ✔ | — | — | ✔ | 0 |
| Transcript | — | — | — | ✔ | ✔ | — | — | 0 |
| BeefProject | — | — | — | ✔ | ✔ | — | — | 2 |

`Old\` : une seule occurrence sur tout `c:\dev` (`OptimAssur/old`). CLAUDE.md : 13 occurrences
sur `c:\dev` (11 projets maison + pilot + inZM), zéro dans les produits forge. Nommage daté :
motif `<Marque> - <Objet> - AAAAMMJJ<lettre>` vérifié sur 25+ fichiers, exclusivement documentaires.
