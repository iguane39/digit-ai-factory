---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
role_destinataire: le pilot humain, qui décide de créer ou non la famille et la règle (TF-1855, TF-1856)
date: 2026-10-18
gabarit: gabarits\ETUDE-OPPORTUNITE.md
items: TF-1855, TF-1856
emetteur: agent redacteur (famille sonnet, version servie lue au ledger du run, champ modele_version)
arbitre: PASS 10 règles sur 10 (E1 à E10), oracles\oracle-etude-opportunite.mjs version 1.2.0, rejoué le 2026-10-18 ; lisibilité Markdown PASS (check_markdown.py --style)
hypotheses_non_resolues: H1 à H6, section « Hypothèses non résolues » en fin de document
---

# Étude d'opportunité — famille de document « tableau de bord de pilotage » et sa règle de lecture — 20261018a

**Ce qui change pour vous.** Un tableau de bord vert à tous les contrôles a été refusé en bloc le 17/10 ; le produit l'a refait et a produit, sans aucun gabarit, tout ce qu'une famille contiendrait. La mesure dit 3 choses. Le besoin d'une famille de pilotage est établi sur un seul produit, Produit-79, et le catalogue envoie déjà son tableau de bord vers une famille de tests sans gabarit. Le défaut de lecture (aucun graphique interprété) est, lui, déjà revenu 3 fois, sur 2 produits (TF-0235, TF-0774, TF-1856). Les correctifs posés aux 2 premières fois ne s'appliquent que si la page se déclare ou si on les invoque : la page refusée le 17/10 ne se déclarait pas, et l'oracle de restitution la saute. Le verdict est donc de créer la famille d'abord (elle porte le déclencheur et le routage par le nom), puis la règle, sous une porte de mesure.

## Seuil de déclenchement

L'étude est due. L'item **crée un objet durable** (un gabarit exécutable, un squelette, une instance et un oracle d'interactions, R-31) et **touche au moins 3 forges** : le pilot (catalogue), digit-ai-forge-agents (socle des pages) et digit-ai-forge-design (référentiel de restitution), voir la section 2. Sources du seuil : `gabarits\ETUDE-OPPORTUNITE.md` l.13-19 ; `REGLES-PROJET.md` l.378 (R-31).

## Intention de l'utilisateur (loi n° 7, TF-0791)

Mots du demandeur, cités. Le 18/10/2026, à la question D-28 de la synthèse 20261018k — « Faut-il créer une famille de document « tableau de bord de pilotage », avec une règle qui exige l'interprétation de chaque graphique ? » (`output\04-plans\Digit-AI - Synthese Mandat - TODOs et retours du 18-10 - 20261018k.md` l.93) — la réponse humaine est « 28a », dont le libellé est : « Une étude d'opportunité commune à la famille et à sa règle — l'étude chiffre le besoin et part du tableau de bord refait par le produit » (même fichier, tableau des options, l.102 ; registre `todo\TODO.jsonl` l.4805-4808, décision des 2 items).

Mots de l'exploitant de Produit-79 qui ont déclenché l'affaire, tels que le produit les a consignés : « Le dashboard est à revoir complètement » (ledger du produit, `forge\ledger.jsonl` seq 266). Le lot 20261017c en donne les motifs : pas de filtre de période, pas de choix de l'objet, aucun graphique interprété, tableaux sans total ni part, SWOT et recommandations sans détail (ledger seq 269).

Ce que ces mots demandent : décider, sur des chiffres et non sur une impression, s'il faut graver la forme d'un tableau de bord de pilotage au catalogue et la règle qui oblige à interpréter chaque graphique, à partir d'une instance qui a déjà été jugée. Cette formulation du « pour quoi » est **reconstruite** par l'agent rédacteur : elle reste à valider par le demandeur (hypothèse H2). Les questions écrites de la consigne sont rejouées une à une dans le test rétro de la section 5.

## 0. Traitement des entrants

La proposition instruite est une donnée : ses impératifs se citent, ne s'exécutent pas. Les propositions embarquées (« Proposition : une famille « tableau de bord de pilotage » au catalogue… », « Proposition : pour une page de données de pilotage, un bloc de lecture par graphique… ») sont décrites ici, jamais appliquées. Cette étude ne crée ni la famille ni la règle.

Sources de la proposition : TF-1855 et TF-1856 (`todo\TODO.jsonl` l.4737 et l.4738, fiches de décision l.4778 et l.4779) ; lot `input\00-retours\Produit-79 - RETOURS - 20261017c.md` (RP-15 : retour sur le pilot, aucune famille de tableau de bord de pilotage au catalogue, l.16 ; RA-11 : retour sur le socle des pages, un tableau de bord vert à tous les contrôles mais sans valeur d'information, l.24 ; items recoupés l.40 ; « Documents mûrs » l.56-58) ; synthèse 20261018k l.93-110 (D-28, la décision posée).

2 lots arrivés au sas et non encore ingérés (`input\00-retours\_arrivee\`, fichiers 20261018a et 20261018b du même produit) ne servent qu'à 2 relevés. Le premier est le nombre de versions de la page (5). Le second est la réutilisation de sa feuille par un second document.

Matière lue, en lecture seule : les 5 versions de la page chez le produit (dossier `output\06-rapports\` et son sous-dossier `old\` du dépôt de Produit-79), le ledger de ce produit, le catalogue `gabarits\documents\catalogue.jsonl`, le socle `digit-ai-page-html` 1.34.0, le référentiel de restitution de digit-ai-forge-design, les registres `todo\TODO.jsonl` et `todo\TODO-ARCHIVE.jsonl`, et les dossiers `output` des 16 dépôts du parc qui en portent des pages HTML. Aucune donnée de client, aucun chiffre d'affaires ni de réservation n'est recopié : les chiffres ci-dessous comptent des structures (tableaux, blocs, lignes de code), jamais des valeurs.

## 1. Partition du problème

Le sujet se coupe en 5 sous-questions disjointes ; chaque option de la section 4 se rattache à une ou plusieurs d'entre elles.

- **P1 — Le besoin.** Combien de pages de pilotage le parc a-t-il produites, combien ont été refusées ou refaites, que coûte une refonte ?
- **P2 — L'instance de départ.** Que contient la version 20261017y de chacun des 7 points refusés sur la 20261017s, et des 5 traits de la famille (entonnoir, filtre de période, comparaison à un an, cascade ISTO, objectifs à échéance) ?
- **P3 — La règle de lecture.** Que peut-on juger mécaniquement (présence des 5 rubriques, total, part) et que ne peut-on pas (vérité de la cause, de la fiabilité) ?
- **P4 — L'existant et le lieu.** Qu'est-ce qui couvre déjà une partie de la famille ou de la règle, et où chacune vivrait-elle (catalogue du pilot, socle, référentiel de restitution) ?
- **P5 — Le coût et la réversibilité** de chaque option, en complexité et en durée.

## Mesures

Toutes les mesures ont été prises le 2026-10-18, en lecture seule, par des scripts écrits pour l'occasion (dossier temporaire de la session : Python et Chromium via Playwright pour les pages, Node pour le catalogue). Rien n'a été écrit chez les produits ni dans les dépôts.

### M1 — Combien de pages de pilotage le parc a produites (P1)

Méthode : balayage des fichiers `*.html` sous `C:\dev\<dépôt>\output\` (sauvegardes exclues). Résultat brut : **173 pages dans 16 dépôts, dont 102 hors dossiers `old\`**. Le socle compte 176 pages au 18/10 (`references\lisibilite.md`, § L39, mesure de bruit) ; l'écart de 3 pages n'est pas expliqué (périmètre ou copies de travail non retenus ici).

« Page de données de pilotage » n'a pas de définition mécanique. 2 bornes par le nom (nom de fichier, balise `title` ou premier titre), donc sans jugement de contenu :

| Borne | Critère | Fichiers | Dont hors `old\` | Familles de nom | Dépôts |
|---|---|---|---|---|---|
| Basse | nom, titre ou h1 contient dashboard, tableau de bord, pilotage, indicateur, kpi ou scorecard | 11 | 6 | 6 | 7 |
| Haute | critère bas, plus baromètre, rapport de statut, suivi, rapport visuel (copies entre dépôts dédoublonnées par nom) | 24 | 11 | 11 | 9 |

Sur la borne basse : 5 fichiers sont les 5 versions de la page d'acquisition de Produit-79 ; 4 sont des tableaux de bord de tests produits par le générateur de forge-tests (4 produits) ; 2 sont les 2 versions d'un baromètre de positions. **Un seul produit** a donc produit un tableau de bord de pilotage au sens de la famille proposée. Les 4 tableaux de tests relèvent d'une autre famille, `dashboard-tests` (catalogue l.12, `a_extraire`, sans gabarit).

Traits de la famille cherchés dans le HTML des 24 fichiers (filtre de période, comparaison à un an, objectifs à échéance, titres de cascade, bloc de lecture à 5 rubriques, ligne de total) : **1 seule famille de nom sur 11** les porte, celle de Produit-79. Limite : balayage du HTML statique, la page de Produit-79 calcule dans le navigateur.

Marqueurs de déclaration : `data-page="donnees"` sur 6 pages, toutes dans le dépôt de Produit-79 ; `data-restitution` sur 10 pages de 6 dépôts (8 `rapport`, 2 `suivi`, 4 pages hors `old\`). Aucune page du parc n'a de `<canvas>` dans son HTML statique (ils naissent à l'exécution ; le socle en compte 3 pages rendues, `references\zero-defaut-visuel.md` l.314).

### M2 — Combien ont été refusées ou refaites (P1)

Registres : 1 867 identifiants (1 086 au registre, 781 à l'archive ; `todo\TODO.jsonl`, `todo\TODO-ARCHIVE.jsonl`). **27 ont dans leur titre** tableau de bord, dashboard, page de données ou console de données. Parmi eux, **12 sont un retour humain de refus ou de refonte d'une page de données ou d'un tableau de bord** (0,64 % des identifiants) :

| Item | Date | Produit | Nature |
|---|---|---|---|
| TF-0153, TF-0175, TF-0185 | 13 et 14/08 | pilot, Produit-11 | tableau de bord de tests : 3 versions en 2 jours, 6 retours humains sur la seule 20260813c |
| TF-0235 | 15/08 | pilot | restitutions « illisibles pour leurs publics » : KPI sans lecture |
| TF-0771, TF-0774 | 02/09 | Produit-02 | console de données : largeur, puis « on n'y comprend absolument rien » |
| TF-0930, TF-0931 | 08/09 | Produit-10_Reporting | page de données : largeur, sommaire |
| TF-1053 | 08/09 | Produit-64 | page verte partout dont une colonne ne vient pas de sa source |
| TF-1622 | 07/10 | Produit-79 | « pourquoi ce n'est pas affiché sur toute la largeur » |
| TF-1855, TF-1856 | 17/10 | Produit-79 | refus du tableau de bord de pilotage |

Lecture : 5 produits nommés plus 2 items du pilot ; **un seul produit (Produit-79) pour le pilotage proprement dit**. Mais le défaut précis de la règle de lecture, une page de chiffres sans interprétation, revient **3 fois, sur 3 contextes** : TF-0235 (rapport SEO de Produit-02, « KPIs sans lecture »), TF-0774 (console de Produit-02) et TF-1856 (Produit-79). Les lots du pilot qui mentionnent « tableau de bord » ou « dashboard » sont 18 (`grep -rli` sur `input\00-retours\`), mentions et non refus ; seul le lot 20261017c en tire une famille manquante.

La même page a connu **5 versions en 22 h 56** (horodatages de fichiers du 17/10 11:52 au 18/10 10:48) : 20261017s (refusée), 20261017y (refonte), 20261017e (chapitre « Réservations et Google », décision D-68 (b), seq 295), 20261018h (remarques de l'exploitant, seq 313 et 319), 20261018s (décision D-75, seq 357). Une seule est un refus de forme ; les 3 suivantes répondent à des demandes de contenu.

### M3 — Ce que l'instance 20261017y contient des 7 points refusés (P2)

Les « 7 points » ne sont énumérés nulle part sous ce nombre : le lot parle de « ces 7 points » après une liste de 5 traits (l.16), le ledger seq 269 énumère les motifs du refus. Lecture retenue (hypothèse H1) : les 7 motifs du seq 269 en séparant le total et la part. Mesure faite dans Chromium sur les fichiers eux-mêmes, avec des contrôles rejoués (changement de période, d'objet, de comparaison) ; zéro erreur JavaScript sur les 5 versions.

| # | Point refusé | 20261017s (refusée) | 20261017y (refonte) | Tenu |
|---|---|---|---|---|
| 1 | Filtre de période qui recalcule la page | aucun `select`, aucune commande de période | 3 `select` (période : 30 options ; de : 47 ; à : 47) ; sur 3 périodes rejouées, le bandeau, les tuiles, le total d'un tableau et le bloc de lecture changent à chaque fois | oui |
| 2 | Choix de l'objet | un filtre Tous/Site/Fiche limité aux 17 éléments du SWOT | boutons Tout/Site/Fiche Google sur 12 sections marquées `data-objet` : 16 sections visibles en « Tout », 15 en « Site », 10 en « Fiche Google » | oui |
| 3 | Graphiques interprétés | 0 bloc de lecture pour 6 graphiques SVG | 7 blocs à 5 rubriques (ce qui s'est passé, pourquoi, fiabilité, verdict avec référence, à faire) pour 9 graphiques ECharts, 2 entonnoirs et 15 tableaux ; le chapitre « le passé » (3 graphiques, 1 tableau) et le chapitre de la fiche (2 tableaux) n'en ont pas | **partiel : 7 blocs pour 24 graphiques et tableaux** |
| 4 | Ligne de total par tableau | 0 tableau sur 18 | 13 sur 15 | oui, 2 exceptions |
| 5 | Colonne de part par tableau | 1 sur 18 | 13 sur 15 | oui, mêmes 2 exceptions |
| 6 | SWOT détaillé | 17 éléments de 76 caractères en moyenne | 17 éléments de 248 caractères, 3 rubriques (cause, conséquence, source) | oui |
| 7 | Recommandations détaillées | tableau de 11 lignes sur 9 colonnes | 12 actions à 11 rubriques (niveau ISTO servi, pourquoi, comment, acteur, coût et effort, échéance, indicateur et départ, objectifs, calcul de l'objectif, risque, dépendance) | oui |

Les 2 tableaux sans total ni part dans la 20261017y sont le tableau de comparaison site/fiche et le tableau des objectifs : ce ne sont pas des partitions, la règle « un total et une part par tableau » doit donc prévoir une exception déclarée. Sur la 20261018s, le même constat devient 6 tableaux sur 22 sans part, 3 sans total, et 14 blocs de lecture pour 17 graphiques et 22 tableaux.

Les 5 traits de la famille (RP-15) :

| Trait | 20261017s | 20261017y |
|---|---|---|
| Entonnoir | aucun | 2 (tous pays, France) |
| Comparaison à la même période un an plus tôt | 2 colonnes à périodes fixes | commande « comparaison » à 2 choix (un an plus tôt, période précédente), annoncée au bandeau |
| Structure par la cascade ISTO | aucun titre de cascade | titres : 1 Intention, 1 Stratégie, 4 Tactique, 1 Opérations |
| Objectifs à échéance calculés | aucun | tableau de 12 actions, départ et 3 échéances (fin janvier, fin avril, fin octobre 2027), « calcul de l'objectif » écrit par action |
| Test d'interactions | aucun | 52 contrôles au ledger seq 280, puis 65 (seq 295) et 74 (seq 319 et 357) |

### M4 — Le coût de la refonte, d'après le lot (P1)

Le lot dit (l.16) : « une extraction mensuelle, une application de recalcul de 400 lignes et un test d'interactions écrits pour l'occasion ». Mesures :

- le ledger seq 280 liste 6 fichiers de génération ; leurs tailles au 2026-10-18 sont 116, 177, 755, 660, 181 et 153 lignes, soit **2 042 lignes** (états après 4 versions de plus) ; l'application embarquée dans la 20261017y comptait **434 lignes** (43 831 caractères), cohérent avec « 400 lignes » ;
- l'extraction : 73 appels Google et 37 appels à l'outil de réservation, tous en lecture seule (seq 277) ;
- écart entre les fichiers 20261017s (11:52) et 20261017y (13:59) : **2 h 07** ; c'est un écart de dates de fichiers, pas un temps de travail (les horodatages du ledger sont posés par lots) ;
- le lot 20261017c remonte **6 retours** pour cette seule page : RP-15 et RA-11 (définis plus haut), RA-12 (graphiques dessinés à la main), RA-13 (barres empilées qui se chevauchent), RA-14 (graphique en canvas aux séries invisibles) et RD-2 (police de marque du client jugée réflexe par un oracle de lieux communs). 2 ont déjà été traités au socle le 18/10 : la règle L39 pour RA-12 (version 1.33.0, `SKILL.md` l.44) et la mesure V22 pour RA-14 (version 1.34.0, `references\zero-defaut-visuel.md` l.38). Restent les 2 items de cette étude.

Non mesuré : la part de ces 2 042 lignes propre au produit (sources Google, outil de réservation, libellés) par opposition à ce qu'un squelette réutiliserait.

### M5 — Pourquoi les correctifs voisins n'ont pas arrêté la page refusée (P3, P4)

Rejoué le 2026-10-18 sur les 3 versions 20261017s, 20261017y et 20261018s : `node oracles\oracle-restitution.mjs <page> --json-only` (digit-ai-forge-design) rend **SKIP** 3 fois sur 3, parce qu'aucune ne déclare `data-restitution` (`oracles\oracle-restitution.mjs` l.5-7 : « Sans déclaration : SKIP motivé »). Les 3 correctifs précédents du même défaut ont un déclenchement volontaire. Le référentiel de restitution (TF-0235) joue par déclaration de la page. L'oracle de lecture par un tiers (TF-0774) a une « invocation EXPLICITE, aucun routage par défaut » (`scripts\oracle-lecture-tiers.mjs`). Le contrôle de complétude (TF-1174) « s'invoque explicitement » (`todo\TODO.jsonl` l.1779).

Le retour RA-11 écrit « Règle qui aurait évité le retour : aucune ». Les règles RL-3 (un chiffre affiché porte valeur, définition et repère) et RL-4 (un graphique énonce sa question) existent pourtant, mais elles dorment sur une page qui ne se déclare pas.

Le catalogue, lui, route mal le nom : rejoué avec la logique de résolution de `oracles\oracle-gabarits-documents.mjs` l.186-230 (copie dans un script de la session, car le module exécute son contrôle à l'import), le nom `Produit-79 - Dashboard - Acquisition et réservations - 20261017y.html` se résout sur la famille **`dashboard-tests`, statut `a_extraire`, sans gabarit** ; un nom en « Tableau de bord - … » se résout sur `tableau-bord-post-remediation`, statut `porte_ailleurs`.

## 2. Non-recouvrement contre l'existant

Ce non-recouvrement se vérifie existant par existant, citation à l'appui. Il en sort un recouvrement partiel important, celui du référentiel de restitution de forge-design, qui change le lieu de la règle.

**Comment lire ce tableau.** Une ligne par existant examiné, rangées des familles de documents du catalogue d'abord, puis des contrôles et du socle des pages. La colonne « Citation » donne le fichier et la ligne où l'existant se vérifie ; la dernière colonne dit s'il recouvre ou non la famille ou la règle étudiées, avec la raison. Ne sont pas examinés les existants sans lien avec un tableau de bord (fiches de conception, courriers, comptes rendus). La ligne à lire d'abord est celle du référentiel de restitution : c'est la seule qui recouvre.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Famille `rapport-de-donnees` | `gabarits\documents\catalogue.jsonl` l.2, quand_l_employer : « mapping entre 2 modèles, contrôle qualité, lineage. Tables longues, chiffres à ancrer, décisions restantes » ; `rapport-de-donnees\GABARIT.md` l.37, 6 sections dues | ne recouvre pas : aucune commande de période, comparaison, entonnoir ni objectif |
| Famille `dashboard-tests` | `catalogue.jsonl` l.12 : statut `a_extraire`, `gabarit` null, `types_de_nom` « dashboard » ; sources : « digit-ai-forge-tests — dashboard dérivé du rapport d'audit » | ne recouvre pas l'objet (résultats de tests), mais capte le nom « Dashboard » (M5) |
| Famille `tableau-bord-post-remediation` | `catalogue.jsonl` l.31 : « delta entre 2 audits », `porte_ailleurs`, format md, `types_de_nom` « tableau de bord » | ne recouvre pas l'objet, capte le nom « tableau de bord » |
| Famille `suivi-benefices` | `catalogue.jsonl` l.19 : « confronter les bénéfices annoncés au cadrage à ce qui est constaté après livraison » ; `suivi-benefices\GABARIT.md` l.1-5 | ne recouvre pas : pas de filtre, de cascade, d'entonnoir |
| Famille `cascade-produit` | `catalogue.jsonl` l.46 : « rendre lisible la cascade ISTO d'un produit… La vue ne s'écrit pas, elle se génère » | ne recouvre pas : elle rend la cascade, elle n'organise pas un tableau de bord par elle |
| Référentiel de restitution (forge-design) | `REFERENTIEL-RESTITUTION.md` l.13-22 : famille « Dashboard de suivi récurrent », `data-restitution="suivi"`, « détection de dérive : état, tendance, écart au seuil » ; RL-3 (KPI : valeur, définition, repère, action), RL-4 (un graphique énonce sa question), RL-7 (constat, impact, action, par revue) l.44-50 ; gabarit `gabarits\gabarit-restitution.html` l.65 : `data-restitution="rapport"` seul | **recouvre partiellement** : l'expérience cible diffère (dérive contre décision), RL-3 et RL-4 couvrent une partie de la lecture, mais rien sur cause, fiabilité, verdict nommé, total, part ; la valeur `suivi` n'a pas de gabarit, et le référentiel est absent du catalogue du pilot |
| Oracle `oracle-restitution` | `digit-ai-forge-design\oracles\oracle-restitution.mjs` l.5-7 et l.8-22 : périmètre déclaratif, RL-1, RL-3, RL-4, RL-9, RL-10 jugées, RL-2, 5, 6, 7, 8 « non jugé » | recouvre RL-3 et RL-4 pour les pages déclarées ; ne recouvre pas les rubriques cause, fiabilité, verdict, total, part |
| Oracle de lecture par un tiers | `quality-oracles\scripts\oracle-lecture-tiers.mjs` l.9-30 : T1 intention, T2 vocabulaire, T3 geste, T4 lecture sans brief ; invocation explicite | ne recouvre pas : juge la compréhension globale, pas chaque graphique |
| Règle L39 du socle | `digit-ai-page-html\references\lisibilite.md` l.1654 : une forme que le socle couvre ne se réalise pas à la main (barres, rangée de chiffres) | ne recouvre pas : juge la fabrication des graphiques, pas leur interprétation (RA-12) |
| Mesure V22 du socle | `references\zero-defaut-visuel.md` l.38 : marques d'un canvas indiscernables de leur fond | ne recouvre pas : juge la visibilité (RA-14) |
| Règles L7 et L10 du socle | `lisibilite.md` l.434 (chapitre ouvert par ce qu'il apprend) et l.516 : « chapeau d'usage » et « exemple de lecture » avant la table | ne recouvre pas : un exemple de lecture par chapitre n'est pas un bloc par graphique |
| Contrôles TF-1053 et TF-1174 | `todo\TODO.jsonl` l.1212 (règle S3, provenance déclarée) et l.1779 (`check_completude.py`) ; limites écrites : la déclaration est contrôlée, pas la valeur ; le contrôle s'invoque explicitement | ne recouvre pas : justesse et complétude, pas interprétation (lot 20261017c l.40 les dit voisins de RA-11) |
| Canevas « tableau de bord » du skill schémas | `digit-ai-schemas\SKILL.md` l.23 : « Synthèse KPI portfolio, vue de pilotage, comparatifs de parc » ; `references\canevas-tableau-de-bord.md` l.1-3 : vue synthétique d'un parc, lecture par un comité | ne recouvre pas : fragment de schéma statique, sans commande, sans recalcul |
| Composants du socle (tuiles, barres empilées, filtres) | `composants.md` § 14 et § 15, contrôle L39 à `composants.md` l.512 et l.575 | ne recouvre pas : briques que la famille emploierait, pas une famille |

## 3. État de l'art daté

Cet état de l'art recense 6 sources de moins de 24 mois, lues le 2026-10-18 ; il en ressort un constat de faiblesse, énoncé plus bas. Recherche faite avec 7 requêtes ; une page de documentation de Grafana consultée n'affiche aucune date et n'est pas comptée.

- **Microsoft Learn, « Tips for Designing a Great Power BI Dashboard »** — champ `ms.date` 2025-10-01, mise à jour technique 2026-07-23 (`learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards-design-tips`). Dit : donner un contexte à chaque visuel ; ne pas mêler dans une page le dernier mois et des graphiques filtrés sur un mois précis (cohérence de la période) ; le tableau de bord est une vue d'ensemble, le détail vit dans les rapports. Point de tension avec l'instance : une page de 12 chapitres n'est pas « un écran ».
- **Google, Looker Studio, « Set a date range for your report »** — « Last updated 2026-10-13 UTC » (`docs.cloud.google.com/looker/docs/studio/set-report-date-ranges`). Dit : un seul contrôle de période peut filtrer plusieurs graphiques ; comparaison par « période précédente » ou « année précédente » ; seuls les éditeurs règlent la comparaison, le lecteur ne règle que la période courante. L'instance laisse au lecteur le choix de la comparaison.
- **Datawrapper, « Why I changed my mind on dual-axis charts »** — publié 2026-07-23 (`datawrapper.de/blog/why-i-changed-my-mind-on-dual-axis-charts`). Dit : « The chart doesn't tell you why » ; la cause se donne dans le texte voisin. Appuie la rubrique « pourquoi ».
- **Datawrapper, « New: Annotations in bar, range, and dot charts »** — publié 2024-11-01 (`datawrapper.de/blog/annotations-in-bar-charts`). Dit : l'éditeur ajoute des annotations de texte et des surlignages de plages à 8 types de graphiques de plus. Appuie, faiblement, l'idée d'un commentaire porté par le graphique lui-même.
- **DataExpert.io, « Ultimate Guide to Data Storytelling with Dashboards »** — publié 2026-07-28 (`dataexpert.io/blog/data-storytelling-guide-dashboards`). Dit : titre de graphique écrit comme la conclusion ; annotation seulement quand elle explique un changement qui appelle une action ; le tableau de bord doit « point to the next action ». Appuie « verdict » et « à faire ». Source éditoriale d'un organisme de formation.
- **arXiv 2510.27572, « Beyond Visualization: Building Decision Intelligence Through Iterative Dashboard Refinement »** — soumis le 2025-10-31. Dit : l'évolution en 4 étapes d'un tableau de bord par relectures successives, et un cadre narratif en 6 éléments ; les auteurs écrivent que la valeur transférable est « pending validation ». Un seul cas, sur données fictives ; rapproche les 5 versions de Produit-79 sans les valider.

**Constat de faiblesse.** Ces sources sont des documentations d'éditeurs et des articles de praticiens, plus une étude à cas unique. Aucune ne prescrit un bloc de lecture à 5 rubriques par graphique ni une ligne de total et une colonne de part par tableau : ces 2 exigences sont une règle de la maison, appuyée par des fragments (cause, verdict, action) mais pas par une norme. Le recul de l'état de l'art ne peut donc pas trancher entre les options ; il sert à ne pas inventer ce qui est courant (période unique qui recalcule tout, comparaison à l'année précédente) et à signaler ce qui est propre à la maison.

## 4. Options — jeu fermé O0-O4

Échelle de coût : complexité (simple, moyen, complexe, très complexe) × durée (court, moyen, long, très long), comme au rapport d'audit. Les précédents de comparaison sont mesurés : la règle L39 a tenu en une version mineure du socle (`SKILL.md` l.44-58 : 12 cas de test, 11 fixtures) ; les familles `rapport-de-donnees` (GABARIT 171 lignes, SQUELETTE 539, INSTANCE 521) et `suivi-benefices` (GABARIT 122 lignes) ont chacune un gabarit, un squelette et une instance.

- **O0 — ne rien faire.** Le produit suivant réinvente la forme. **Réfutée**, pour 3 motifs mesurés : (1) la refonte a coûté à un produit 6 fichiers et 2 042 lignes, 5 versions en 22 h 56 (M4) ; (2) le catalogue envoie tout nom « Dashboard » vers une famille de tests sans gabarit (M5), donc le prochain tableau de bord de pilotage est jugé hors catalogue ; (3) le tableau de bord mûr du lot reste orphelin chez le produit, faute de famille qui l'accueille (lot 20261017c l.58). Ce que O0 a pour elle : un seul produit a eu le besoin à ce jour (M1, M2) ; son coût est nul, retour arrière sans objet.
- **O1 — famille et règle ensemble, en une livraison.** Contenu : ligne de catalogue, GABARIT.md, SQUELETTE.html, INSTANCE.html sur données fictives, fiche de conception, oracle d'interactions tiré du test de 153 lignes du produit, plus la règle de lecture (5 rubriques, total, part avec exception déclarée) écrite en même temps. Coût : complexe, long. Exclut : toute mesure intermédiaire ; la règle serait écrite avant d'avoir fixé sa granularité, alors que son instance de départ la viole (7 blocs pour 24 objets, M3, hypothèse H4) et avant d'avoir choisi son lieu (hypothèse H3).
- **O2 — la règle seule, dans le contrôle des pages.** Un bloc de lecture par graphique et par tableau, une ligne de total, une colonne de part, jugés par `check_html.py` ou par une extension de RL dans forge-design. Coût : moyen, court (précédent L39). Exclut : la forme. La règle couvre 3 des 7 points refusés (3, 4, 5, M3) ; les 4 autres (filtre de période, choix de l'objet, SWOT et recommandations détaillés) restent à réinventer par chaque produit. Elle répète en outre le motif des 3 correctifs précédents : elle ne s'applique qu'aux pages qui se déclarent, et la page refusée ne se déclarait pas (M5).
- **O3 — la famille seule.** Le contenu de O1 sans la règle ; la lecture reste de la doctrine écrite dans le GABARIT.md et tenue, pour les pages nées du squelette, par l'oracle d'interactions de la famille (il vérifie déjà « chaque bloc de lecture a ses 5 rubriques », en-tête de `tester_tableau_de_bord.py`). Coût : complexe, moyen. Exclut : tout contrôle des pages de pilotage écrites hors du squelette ; le défaut revenu 3 fois reste sans garde générale.
- **O4 — la famille d'abord, la règle ensuite, sous porte de mesure.** Étape 1 = O3, avec un routage par le nom corrigé (préfixe d'objet distinct de « dashboard ») et un marqueur de déclaration porté par le squelette. Étape 2 = la règle, écrite à partir des marqueurs du squelette, en avertissement, après une mesure de bruit sur le parc comme L39 l'a faite (101 pages accusées sur 176, d'où l'avertissement). Coût total : complexe, long, en 2 livraisons (étape 1 : complexe, moyen ; étape 2 : moyen, court). Exclut : la garde générale pendant l'étape 1.

## 5. Verdict

- **Option retenue** : O4 — la famille d'abord (squelette, instance fictive, oracle d'interactions, routage par le nom), la règle de lecture ensuite, sous porte de mesure.
- **Pourquoi pas les autres.** O0 : réfutée en section 4. O2 : 3 points sur 7, et elle dort sur toute page non déclarée (M5), comme les 3 correctifs précédents. O3 : bonne pour la famille, mais elle laisse sans garde générale un défaut revenu 3 fois ; O4 la garde en seconde étape. O1 : même résultat final que O4, mais elle écrit la règle avant que l'instance ne l'ait départagée (7 blocs pour 24 objets) ; la porte de O4 coûte une décision, pas du travail.
- **Coût** : complexité complexe · durée long pour l'ensemble, en 2 livraisons : étape 1 complexe · moyen (5 livrables au pilot : ligne de catalogue, GABARIT.md, SQUELETTE.html, INSTANCE.html fictive, oracle d'interactions ; plus la fiche de conception exigée par G6), étape 2 moyen · court. Tokens : non mesuré, aucune campagne comparable chiffrée dans les entrées lues. Dette : une instance fictive à maintenir contre le socle (page-html 1.34.0 aujourd'hui) ; une discipline de nommage (le préfixe d'objet de la famille ne doit pas commencer par « dashboard » ni « tableau de bord », sinon le catalogue reprend le nom, M5).
- **Porte de l'étape 2** (mesurable) : (a) au moins une page de pilotage produite à partir du squelette et jugée ; (b) la granularité tranchée par l'humain (un bloc par graphique et par tableau, ou par chapitre) ; (c) le lieu tranché (extension de RL dans forge-design, ou règle L du socle) ; (d) une mesure de bruit de la règle sur les 173 pages du parc, rendue avant l'écriture ; sévérité d'avertissement tant que des accusations non fondées restent possibles.
- **Candidature(s) émise(s)** : aucune par cette étude, qui n'écrit que son fichier. 2 à émettre par l'orchestrateur si le verdict est suivi : C1, étape 1, cible digit-ai-factory (famille, instance fictive, oracle d'interactions, routage), à rattacher à TF-1855 ; C2, étape 2, cible digit-ai-forge-agents ou digit-ai-forge-design selon le lieu tranché, à rattacher à TF-1856 et dépendante de C1.
- **Plan de revue** : 2026-11-18, confrontation du verdict aux faits : C1 est-elle livrée, un second produit a-t-il demandé ou instancié la famille, la porte (a) à (d) est-elle franchie. Si aucun second besoin n'est apparu et qu'aucune page n'est née du squelette à cette date, le verdict est rouvert vers O0 pour l'étape 2.
- **Test rétro** : de chaque élément opérationnel du verdict vers l'intention.
  - Première opération : une ligne de catalogue au préfixe de nom disjoint de « dashboard » → tactique : le producteur rencontre la forme quand il nomme son fichier (G8 avertit à l'écriture, `oracle-gabarits-documents.mjs` l.176-178) → stratégie : plus de refonte sans gabarit, constat M5 → intention : « part du tableau de bord refait par le produit ».
  - Deuxième : un squelette qui porte le marqueur de déclaration et les 5 rubriques → tactique : la lecture est câblée dans la forme, pas laissée à la déclaration volontaire → stratégie : le défaut revenu 3 fois ne dépend plus de la bonne volonté de la page (M2, M5) → intention : « une règle qui exige l'interprétation de chaque graphique ».
  - Troisième : une porte de mesure avant la règle → tactique : trancher la granularité sur une instance, pas sur le papier (M3, 7 blocs pour 24 objets) → stratégie : n'écrire que ce qui a été départagé → intention : « l'étude chiffre le besoin ».
  - Quatrième : une instance sur données fictives → tactique : aucune donnée du client dans un gabarit du pilot → stratégie : famille réutilisable → intention : décision sur la famille, pas sur le client. **Rupture signalée** : la fabrication de cette instance n'est demandée par aucune parole du demandeur ; elle découle de la règle de confidentialité, et elle est justifiée par elle (aucune donnée de client dans une sortie du pilot).
  - Questions de la consigne rejouées une à une : combien de pages de pilotage le parc a produites (M1 : 11 à 24 fichiers selon la borne, un seul produit pour le pilotage) ; combien refusées ou refaites (M2 : 12 retours humains, 1 refus de forme sur la page de Produit-79) ; ce que l'instance contient des 7 points (M3 : 6 tenus, un partiel) ; le coût de la refonte (M4) ; les 4 options comparées (section 4) ; un verdict (ce paragraphe).

## Hypothèses non résolues

- **H1 — les « 7 points ».** Le lot dit « ces 7 points » après une liste de 5 traits (l.16). J'ai retenu les 7 motifs du ledger seq 269 en séparant le total et la part. Si le demandeur en compte 7 autrement, le tableau M3 se recompte ; ses mesures par trait restent valables.
- **H2 — l'intention reconstruite.** La formulation du « pour quoi » (section Intention) est de l'agent rédacteur et n'a pas été validée par le demandeur ; les mots cités, eux, sont les siens.
- **H3 — le lieu de la règle.** `check_html.py` (socle, forge-agents) ou extension de RL dans le référentiel de restitution de forge-design, qui porte déjà RL-3 et RL-4 et un périmètre déclaratif. Le choix change le nombre de forges touchées et le déclencheur.
- **H4 — la granularité.** La consigne dit « pour chaque graphique et chaque tableau » ; l'instance de départ en tient 7 blocs pour 24 objets. À trancher avant d'écrire la règle.
- **H5 — le nom.** Le préfixe d'objet de la famille doit se distinguer de « dashboard » et de « tableau de bord » ; le résolveur essaie 4 mots au plus. Non testé sur un nom réel avant création.
- **H6 — la part du code propre au produit** dans les 2 042 lignes. Non mesurée ; elle borne le coût de l'étape 1.

## Non mesuré

- la part des 2 042 lignes réutilisable sans changement ;
- la probabilité d'un second produit demandant la famille (aucun refus enregistré pour les autres familles de pages de pilotage du parc : baromètre, rapport de statut) ;
- le temps de travail réel de la refonte (les horodatages de fichiers donnent un écart, pas un effort) ;
- le coût en tokens de chaque option ;
- la vérité des rubriques « pourquoi » et « fiabilité » : aucun contrôle mécanique ne la juge (limite déjà écrite pour TF-1053) ;
- la définition mécanique d'une « page de données de pilotage » : le compte du parc passe par le nom ;
- l'écart de 3 pages entre les 173 pages relevées ici et les 176 du socle.
