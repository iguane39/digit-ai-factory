# Règles projet — DÉCIDÉES le 2026-08-06

**Les 17 règles sont adoptées** (décision humaine du 06/08). Arbitrages des conflits :
C1 = `Old\` autorisé pour les livrables mais **jamais versionné** (ignoré par git) ;
C2 = `git init` + **commits locaux par défaut** dès l'ouverture du run, remote/push sur GO
humain ; C3 = le nommage daté ne s'applique jamais au code ; C4 = journaux d'oracles
**versionnés** dans `forge\`.
Application : phase 0 du prompt produit (P0), vérifications pilot (S), et l'oracle
exécutable `oracles\oracle-conformite-projet.mjs` (O) — chaque n° de règle est un n° de finding.
Rattrapage des projets existants : au prochain run de version de chacun.

Sources : inventaire exécuté sur 11 dépôts (6 forges, produit pilote MiniVeille, ASDMailManager2
— produit forge réel —, ASDMailManager, AuxPortesDeLaBaie.com, Transcript, BeefProject).
Annexe d'inventaire en fin de document. Mécanismes : **P0** = créé par la phase 0 du prompt
produit · **S** = vérifié par le pilot à l'ouverture de run · **O** = oracle conformité
projet (2e mandat) · **G** = gate humain.

## A. Structure de dossiers

| n° | Règle (binaire) | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 1 | `input\` existe à la racine ; tout entrant fourni par l'humain y vit | observée 7/11 (forges, ASDMailManager2, Transcript…) | tous projets, nouveaux + rattrapage | P0+O | nul | **défaut** |
| 2 | `output\` existe ; tout livrable généré destiné à l'humain y vit (rapports, PV, exports). **Précision D-06 (adoptée 11/08, TF-0084)** : un document *normatif* (doctrine, gabarit, registre) n'est pas une sortie — il vit à la racine ou dans `docs\`, avec son `Old\` à côté, jamais sous `output\` | observée 3/11 (`digit-ai-forge-agents/output/`, Transcript, BeefProject) ; précision : D-06 organization | tous, nouveaux + rattrapage | P0+O | nul | **défaut** |
| 3 | `docs\` pour la documentation pérenne du produit (hors run) | observée 3/11 (development, tests, AuxPortesDeLaBaie) | produits, nouveaux | P0 | nul | option |
| — | `forge\` (ledger, étapes) : **déjà acté** au contrat d'interface §2, pour mémoire | ASDMailManager2/forge/ | — | — | — | déjà appliqué |

## B. Nommage

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 4 | Tout livrable documentaire est nommé `<Projet> - <Objet> - AAAAMMJJ<indice>.<ext>` — **le nom du PROJET prime sur l'émetteur** (Q3-bis tranchée par l'humain le 09/08 : « Aux Portes de la Baie - Audit SEO - … », plus jamais « Digit-AI - … » en tête). Les fichiers historiques ne sont pas renommés | convention historique observée avec préfixe émetteur ; **décision humaine du 09/08** la corrige | **livrables uniquement** (input\, output\, docs\) — JAMAIS le code (conflit C3) | S+O | faible | **défaut** |
| 5 | L'indice est une lettre (a, b, c…) par itération du même jour ; une nouvelle version = un **nouveau fichier daté**, jamais d'écrasement | observée (`20260721b` → `20260721d`, `revue.md`/`revue-v2`) | livrables uniquement | S+O | faible | **défaut** |
| 25 | Le `<Type>` du nom de tout livrable daté (2ᵉ segment, 1ᵉʳ mot) **figure au registre des types** (`registre-types.json` d'organization, comparaison insensible casse/accents) — un type nouveau s'ajoute au registre dans un commit motivé (D-04), jamais improvisé dans un nom. Registre lu en dépôt frère ; poste non équipé → non jugeable, pas FAIL | **D-04 organization (décidée 08/08), encodée 11/08 (TF-0084)** — registre 1.1.0, 29 types, complété sur usage réel | produits, nouveaux + rattrapage | O | nul | **défaut** |

## C. Versions et git

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 6 | Le code n'a qu'un magasin de versions : git. Aucune copie datée ni dossier `Old\` pour du code | générique (standard) + état de l'écosystème (6 dépôts git) | tous | O | nul | **défaut** |
| 7 | Quand un livrable documentaire est remplacé par une version plus récente, l'ancien migre dans `Old\` du même dossier (lisibilité du dossier courant — pas un magasin de versions) | **citée par toi** ; observée 1/30+ (`OptimAssur/old`) | livrables uniquement | S+O | faible | option (conflit C1) |
| 8 | Tout nouveau produit est `git init` à l'ouverture du run, avec commit initial + commits par étape (le **push/remote reste sur ton GO**) | gap constaté : ASDMailManager2 sans git | produits, nouveaux | P0 | nul | **défaut** (conflit C2) |
| 9 | Commits en Conventional Commits français | observée (development 116 commits, campagnes forges) | tous dépôts git | S | nul | **défaut** |
| 10 | `.gitignore` socle dès la création : `.env`, `.venv/`, `__pycache__/`, `node_modules/`, `generated/`, artefacts de build, **sidecars d'oracles** `*.oracles.json` / `*.oracles-cache.json` / `*.oracles-historique.jsonl` (TF-0065 — les preuves VOULUES restent versionnées sous `forge\`, exception `!forge/**`, décision C4) | observée (9/11) ; sidecars : 3 campagnes polluées | tous | P0+O | nul | **défaut** |

## D. Documentation du produit

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 11 | Chaque produit naît avec un `CLAUDE.md` d'après `gabarits\CLAUDE-PRODUIT.md`, **section « Routage forge » remplie** (verdict tests → forge_tests, évolution → run de version, déploiement → MEP ; boucle intérieure libre) — étendue le 06/08 : sans routage, les sessions ad hoc contournent les forges (constaté sur le correctif v0.2.0) | observée 11 projets maison ; absente du produit forge réel | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 12 | Chaque produit naît avec un `README.md` minimal : une phrase de quoi, 2 commandes de démarrage, lien CLAUDE.md | observée 8/11 ; absente d'ASDMailManager2 | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |

### D bis. Socle documentaire `docs\projet\` (R-20..R-23 — décision humaine du 11/08, TF-0082)

**Principe directeur** : les fichiers de `docs\projet\` sont des **vues pour humains et agents** —
chacun **déclare sa source de vérité** (frontmatter YAML : `role`, `sources_de_verite`,
`verifie_le`) et ne la duplique jamais ; toute valeur volatile est datée ; **aucun secret,
jamais** (R-14 inchangée — dépôts au régime public).

**Producteur d'étape (TF-0086, constat du run MEP BAV2)** : la CRÉATION du socle appartient à
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
| 20 | `docs\projet\` complet — **8 fichiers + 2 projections générées** : `TECHNOS.md` (technologies + versions + liens, ancrées lockfiles), `COMPOSANTS-OPS.md` (hiérarchie/noms/types/IDs/URLs/IPs des composants déployés — depuis `ops etat`/plans/DOSSIER-MEP, instanciations datées, placeholders si dépôt public), `PARAMETRAGE.md` (signification des variables, URLs/ports par environnement — hébergés en placeholders), `ACCES-TEST.md` (profils + comptes de démo locale), `COMMANDES.md` (install, dev, test, build, deploy qualif, rollback, seed démo — blocs exécutables), `FONCTIONNEL.md` (**TF-0087** : ce que fait le produit et pour qui — rôles, objets métier et cycle de vie, parcours, règles de gestion, exclusions assumées ; vue d'`EXIGENCES.json` quand il existe, sinon rédigé du code et daté), `ARCHITECTURE.md` et `MODELE-DONNEES.md` (**TF-0091** : sources des vues techniques — structure logique / tables-colonnes-liens — projetées en `ARCHITECTURE.html` et `MODELE-DONNEES.html` par les générateurs du pilot, vues JAMAIS éditées à la main) ; chaque fichier ouvre par un frontmatter YAML (`role`, `sources_de_verite`, `verifie_le`). Noms **fixes** — documents vivants exemptés du nommage daté R-4 (ce ne sont pas des livrables). Autres fichiers admis seulement s'ils servent l'automatisation ou l'onboarding ET n'existent pas déjà sous forme machine (sinon renvoi) | manque constaté : les runs de version redécouvrent tout ; FONCTIONNEL : demande humaine en clôture du run BAV2 | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 21 | Fraîcheur TECHNOS : chaque `nom@version` du frontmatter `versions:` de `TECHNOS.md` correspond aux lockfiles/manifestes du produit (`package-lock.json`, `pyproject.toml`…) — une version divergente = FAIL | loi 4 : une donnée volatile est une donnée | produits | O | nul | **défaut** |
| 22 | Parité PARAMETRAGE ↔ `.env.example` : les noms de variables déclarés dans le frontmatter `variables:` de `PARAMETRAGE.md` et ceux de `.env.example` (R-13, qui reste la liste qui fait foi) sont identiques | double vérité interdite | produits | O | nul | **défaut** |
| 23 | `ACCES-TEST.md` : en-tête dur littéral « comptes de démonstration locale — jamais valides hors MODE_DEMO » présent, comptes créés par seed derrière drapeau `MODE_DEMO` (loi 2), **zéro motif de secret réel** (motifs d'oracle-secrets) ; tout accès d'environnement réel = référence `# à fournir :` (R-15 → non_testables) | R-14 + loi 2 + régime public | produits | O | nul | **défaut** |

## E. Environnements et configuration

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 13 | `.env.example` versionné et **exhaustif** : toutes les variables attendues — applicatives ET infra (ports, URLs, cible de déploiement, drapeaux `*_MODE_DEMO`) — valeurs par défaut sûres ou vides, en-tête « ne jamais renseigner de secret ici » | observée (design, tests, ASDMailManager, AuxPortesDeLaBaie — en-tête littéral constaté) | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |
| 14 | `.env` réel toujours gitignoré ; aucun secret committé, jamais | observée partout + loi pilot existante | tous | O | nul | **défaut** (quasi-loi déjà) |
| 15 | Les variables que la forge ne peut pas renseigner (clés tierces, identifiants) portent un commentaire `# à fournir :` dans `.env.example` — elles alimentent directement les `non_testables[]` de l'étape qualif (RT-6) | générique, prolonge RT-6 | produits | P0+S | faible | **défaut** |
| 26 | **Modèle de données ancré au schéma réel** : chaque table déclarée dans `MODELE-DONNEES.md` porte une `provenance:` (fichier/dossier de schéma — migration, ORM, DDL) qui existe et contient le nom de la table ; table introuvable dans sa provenance = FAIL localisant. Exemption explicite : « sans objet — aucune persistance » (loi 3). Placeholders de squelette non jugés. Complétude inverse et exactitude des colonnes : revue de schéma (non_juge) | **TF-0091** (décision humaine du 11/08) — le REX BAV2 : modèle reconstitué de tête en plein run | produits, nouveaux + rattrapage | O | nul | **défaut** |
| 27 | **Surface web née ouverte aux agents IA** : tout produit à surface web copie à l'ouverture `gabarits\web\robots.txt` (agents IA de recherche AUTORISÉS par défaut — GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended… ; bloquer = décision consignée, datée et motivée DANS le fichier) et `gabarits\web\llms.txt` (carte du site pour les moteurs génératifs, ouverture reprise de FONCTIONNEL.md, tenue par development/MEP, cohérente avec le sitemap). Oracle : un `robots.txt` présent qui interdit un agent IA sans ligne de décision = FAIL ; `llms.txt` absent à côté d'un `robots.txt` = FAIL ; aucun `robots.txt` = SANS_OBJET (surface web non déclarée) | **décision humaine du 11/08 (TF-0095)** — pendant produit du nœud 58 de la grille seo | produits à surface web, nouveaux + rattrapage | P0+O | nul | **défaut** |
| 24 | **URLs d'application par environnement** : tout environnement hébergé expose son application sous un hôte préfixé `<nom-appli>-<env>.<domaine>` avec env ∈ {`dev`, `qualif`, `production`} — ex. `https://auxportesdelabaie-production.up.railway.app`. Le staging outillé de l'étape MEP se nomme **qualif** dans les URLs ; le local (`localhost`, `127.0.0.1`) est hors périmètre ; les hôtes non applicatifs (BDD…) aussi. Vérifié sur la table « URLs & ports par environnement » de `PARAMETRAGE.md` (placeholders `<…>`/`{…}` non jugés) | **décision humaine du 11/08** (TF-0090) | produits, nouveaux + rattrapage | P0+O | faible | **défaut** |

## F. Livrables et archivage

| n° | Règle | Source | Périmètre | Mécanisme | Coût | Recommandation |
|---|---|---|---|---|---|---|
| 16 | Les rapports finaux destinés à l'humain (DOSSIER-MEP, PV, revues) sont **copiés** dans `output\` au nommage daté (n° 4) — l'original de travail reste sous `forge\etapes\` | cohérence avec `digit-ai-forge-agents/output/` | produits | S | faible | **défaut** |
| 17 | Les journaux d'oracles (`*.oracles.json`, `*.oracles-historique.jsonl`) sont versionnés dans `forge\` (ce sont des preuves), ignorés partout ailleurs | observée : présents dans ASDMailManager2/forge/ | produits | P0 (.gitignore) | nul | option (conflit C4) |
| 18 | `forge\retours\` existe (gabarit inclus) ; chaque lot de retours forges est un fichier `RETOURS-<AAAAMMJJ><indice>.md` — un fichier par lot, ids en séquence continue par produit, **jamais modifié après remise** ; remise = copie dans `input\` du pilot | **mandat humain du 06/08** ; format éprouvé 2× (ASDMailManager2/forge/RETOURS-FORGES*.md) | produits, nouveaux + rattrapage | P0+S+O | faible | **adoptée** (décision 06/08) |

## G. Circuit des conventions (D-13) — traçabilité organization → pilot

Aboutissement de Q-B (TF-0039, constat du 11/08). Le circuit — proposition `D-xx` chez
organization → remise au pilot → **décision humaine** → encodage ici + oracle — a été
traversé en réel une première fois : **D-03/Q3-bis → règle 4 → oracle de conformité**
(les deux documents se référencent). État de chaque proposition, sans raccourci : rien
n'est encodé sans décision, rien de décidé n'est laissé sans encodage tracé.

| D-xx (organization, décidées 08-09/08) | Encodage corpus | État |
|---|---|---|
| D-01 `output/` ≠ artefacts de build | règle 2 (`dist/` hors périmètre : pas un livrable) | encodée |
| D-02 indice obligatoire + archivage `Old\` sans effacement | règles 5 et 7 | encodée — soldée 11/08 (TF-0084) : emplacement = même dossier (règle 7 existante), graphie = `Old` (D-02) ; migration des 4 graphies terrain au prochain run de version de chacun |
| D-03 préfixe = nom du projet (Q3-bis) | règle 4 | **encodée — cas d'école du circuit** |
| D-04 taxonomie des types, registre `registre-types.json` | **règle 25** (oracle, lecture seule du registre) | **encodée 11/08 (TF-0084)** — registre 1.1.0 complété sur usage réel (29 types) |
| D-05 `CLAUDE.md` point d'entrée, compléments référencés | règle 11 + gabarit `CLAUDE-PRODUIT.md` | encodée |
| D-06 `input/` = fourni par l'humain · `output/` = ce qui sort | règles 1 et 2 | encodée — précision « la doctrine n'est pas une sortie » **adoptée au corpus 11/08 (TF-0084)**, portée au périmètre de la règle 2 |
| D-07 artefacts de traçabilité : patron optionnel | non-obligation explicite | sans objet |
| D-08→D-11 livrable HTML sortant : charte + autonomie + généré | mécanisme livrable, pas socle projet : `references\BEST-PRACTICES-HTML.md` + socle `digit-ai-page-html` + recette `check_html`/`render_page` (loi qualité) | couvertes — défaut D-10 **corrigé 11/08 (TF-0085)** : contrôle A1 exécuté dans `check_html.py` (self-test 30/30), vrai positif corrigé sur le boilerplate même |
| D-12 composant partagé : inliner, jamais installer en douce | garde-fou pilot « aucune écriture dans les dépôts frères hors mandat » | encodée |
| D-13 le circuit lui-même | CLAUDE.md pilot, ligne de gouvernance Q-B | encodée |
| D-14 `forge-steering` → `forge-pilot` | répercuté partout (bootstrap, README, schéma) | constatée |

Q4 (conventions internes aux fichiers) reste ouverte **côté organization** — pas une
décision pilot tant qu'aucune proposition n'est remise.

## H. Admission d'une nouvelle forge (règle 28 — décidée le 12/08, TF-0125)

Issue de l'étude d'opportunité du 12/08 (`output\20260812-etude-opportunite-forges.md`),
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
forges et `oracle-ecosysteme` ; la mécanisation du point 1 (verdict de non-recouvrement
exigé dans la fiche de naissance) est consignée comme reste de TF-0125.

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
   `localStorage` ; `prefers-color-scheme` honoré à la première visite en l'absence de
   choix persisté, le bouton prime ensuite sur `prefers-color-scheme` ; palette sombre
   dérivée mécaniquement des tokens clairs — une source, deux projections, jamais une
   seconde charte ; contraste AA tenu dans les deux thèmes ; l'impression
   (`@media print`) reste toujours en thème clair, quel que soit le thème affiché à
   l'écran au moment de l'impression.
3. Révocation par projet : consignée dans le frontmatter de `docs\projet\PARAMETRAGE.md`
   — une exception non consignée par écrit n'existe pas ; un contrôle rendu
   SANS_OBJET porte toujours son motif ; aucune neutralisation silencieuse.

Surface d'application encodée : `references\BEST-PRACTICES-HTML.md` (pattern de
référence HTML/CSS/JS + deux fixtures preuves, double sens). Mécanisme : S + pattern
référencé depuis tout run produisant du HTML. Contrôle exécutable : reste de TF-0131 —
candidature vers `check_html.py` du skill `digit-ai-page-html` (hors périmètre
d'écriture de cette campagne, à porter par mandat).

## Conflits à trancher (ta décision explicite)

- **C1 — `Old\` vs git (n° 6/7)** : deux magasins de versions divergent toujours. Proposition :
  git seul pour le code (n° 6) ; `Old\` réservé aux **livrables documentaires** comme rangement
  de lisibilité (les versions datées coexistent, `Old\` désencombre le dossier courant — git
  garde l'histoire de toute façon). Alternatives : (a) git seul partout, jamais d'`Old\` ;
  (b) la proposition ci-dessus ; (c) `Old\` seulement hors dépôts git. **Recommandé : (b).**
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
| **ASDMailManager2** (produit forge) | **—** | **—** | — | ✔ | — | — | **—** | 0 |
| ASDMailManager | — | ✔ | ✔ | ✔ | — | — | ✔ | 2 |
| AuxPortesDeLaBaie.com | — | ✔ | ✔ | ✔ | — | — | ✔ | 0 |
| Transcript | — | — | — | ✔ | ✔ | — | — | 0 |
| BeefProject | — | — | — | ✔ | ✔ | — | — | 2 |

`Old\` : une seule occurrence sur tout `c:\dev` (`OptimAssur/old`). CLAUDE.md : 13 occurrences
sur `c:\dev` (11 projets maison + pilot + inZM), zéro dans les produits forge. Nommage daté :
motif `<Marque> - <Objet> - AAAAMMJJ<lettre>` vérifié sur 25+ fichiers, exclusivement documentaires.
