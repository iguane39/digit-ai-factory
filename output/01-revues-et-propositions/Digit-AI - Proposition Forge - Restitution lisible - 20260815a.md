# Proposition — Doctrine « restitution lisible » pour forge-design

**Statut : PROPOSITION — aucune implémentation.** Mandat humain du 15/08/2026 (analyse
L99 du prompt « dashboards HTML »). Candidature au registre : TF-0235. L'encodage dans
forge-design se fera par campagne mandatée après GO humain — ce document ne modifie
aucun dépôt frère.

---

## 1. Constat, vérifié sur pièce

Les pages HTML de restitution générées par les forges passent le socle (charte,
accessibilité, rendu) mais échouent devant leurs lecteurs. Cas de référence mesuré :
`AuxPortesDeLaBaie.com\seo\livrables\Aux Portes de la Baie - Audit SEO - 20260809k.html` —
491 Ko sur une seule page, 11 chapitres et 31 sections empilés, **0 graphique**
(0 `<canvas>`, 0 `<svg>`) pour des centaines de valeurs chiffrées, KPIs affichés sans
définition ni repère ni action, mécanismes de filtre/recherche présents mais non
combinables et sans tri de colonnes généralisé, interactions à effet insignifiant
(replis qui masquent quelques lignes dans un océan de texte).

Le défaut n'est pas la conformité — le socle la tient. C'est la **conception pour le
lecteur** : personne n'a demandé qui lit la page, pour décider quoi, ni par quel chemin.

## 2. Positionnement — ce qui manque, et où ça s'ajoute

L'existant couvre quatre compétences, aucune ne couvre celle-ci :

| Existant | Ce qu'il garantit | Ce qu'il ne garantit pas |
|---|---|---|
| Socle `digit-ai-page-html` (V1-V7, L1-L12, `render_page`) | page conforme : charte, WCAG, responsive, zéro défaut visuel | qu'elle soit **lisible et exploitable** |
| `systeme-de-marque` | identité (tokens, voix) | — |
| `ameliore-le-design` | maquettes navigables de **produits** | la restitution de **données** |
| `critique-le-design` | audit d'un design produit (7 dimensions) | pas de dimension « lecture de données » |
| `studio-de-direction` | arbitrage entre directions | — |

La doctrine proposée est **l'étage au-dessus du socle** : le socle juge « la page
est-elle bien construite ? », cette couche juge « la page fait-elle son travail auprès
de son lecteur ? ». Elle complète les skills existants, elle n'en duplique aucun ; sa
mécanique (gabarit + oracle) suit le précédent du socle, qui a prouvé que la
convergence des forges passe par des artefacts consommables, pas par de la prose.

## 3. Familles de livrables — on ne conçoit pas la même page pour le même usage

Le mot « dashboard » recouvre trois objets aux CX opposées. Toute règle de la doctrine
se décline par famille ; confondre les familles est le défaut n° 1 du cas SEO.

**F1 — Rapport d'audit ponctuel** (ex. : audit SEO, rapport forge-tests de fin de run).
Un état des lieux daté, à verdicts et preuves, lu quelques fois puis archivé.
CX cible : **guidage narratif** — constat → impact → action — avec exploration à la
demande.

**F2 — Dashboard de suivi récurrent** (ex. : dashboard de tests d'une campagne en
cours, suivi post-MEP). Des indicateurs revisités périodiquement.
CX cible : **détection de dérive** — état, tendance, écart au seuil, en un écran.

**F3 — Registre-outil** (ex. : `TODO.html` du pilot). Une base vivante qu'on consulte,
filtre et annote. CX cible : **manipulation** — retrouver, trier, décider, exporter.

### Lecteurs types par famille

Toute règle ci-dessous cite le lecteur qu'elle sert. Les lecteurs types sont définis
une fois par famille, réutilisables par toutes les forges productrices :

| Famille | Lecteur | Niveau | Question d'entrée |
|---|---|---|---|
| F1 | **Le commanditaire** | novice du domaine | « quel est l'état, qu'est-ce que ça change pour moi, qu'est-ce que je dois décider ? » |
| F1 | **Le metteur en œuvre** | opérationnel | « qu'est-ce que je dois faire, dans quel ordre, avec quoi ? » |
| F1 | **L'expert du domaine** | expert | « les verdicts tiennent-ils ? où sont les preuves et la méthode ? » |
| F2 | **Le pilote** | opérationnel | « est-ce que ça dérive ? où, depuis quand, de combien ? » |
| F2 | **L'opérateur** | opérationnel | « qu'est-ce qui m'attend dans la file, que traiter d'abord ? » |
| F3 | **Le mainteneur** | opérationnel | « où est l'entrée que je cherche, comment la faire évoluer ? » |
| F3 | **L'auditeur** | expert | « qui a décidé quoi, quand, sur quelle preuve ? » |

## 4. Les règles — chacune sert un lecteur nommé et porte son contrôle

Notation : **RL-n · [famille] · lecteur servi · contrôle** (O = oracle mécanique,
R = revue outillée via `critique-le-design`).

**RL-1 · toutes · commanditaire/pilote · O+R.** *La vue d'ensemble tient en un écran.*
Premier écran : verdict global, 3 à 7 chiffres clés contextualisés, les actions
prioritaires, et la navigation vers les vues. Un lecteur novice répond en moins de
30 secondes à : quel est l'état, que faire en premier, où creuser. — O : présence
structurée des trois blocs au-dessus de la ligne de flottaison (render 1280/768/390) ;
R : test des 30 secondes.

**RL-2 · toutes · tous · O.** *Navigation par vues, une question par vue.* Le livrable
s'organise en vues (dans le fichier unique — onglets, routeur à ancres… au choix du
concepteur), chacune déclarant son objectif en une phrase visible. Une vue qui ne
répond à aucune question n'existe pas. — O : chaque vue porte son objectif déclaré ;
aucune section orpheline hors vue.

**RL-3 · toutes · commanditaire · O.** *Un chiffre affiché porte sa lecture.* Un KPI =
définition + valeur + repère (seuil, comparaison ou tendance) + action associée s'il en
appelle une. Un chiffre sans repère de lecture ne s'affiche pas en KPI. — O : gabarit
de composant à emplacements obligatoires ; un emplacement vide est un défaut.

**RL-4 · toutes · commanditaire/pilote · O(heuristique)+R.** *La visualisation est là où
elle éclaire, et seulement là.* Comparaisons, répartitions et évolutions se montrent
graphiquement (SVG/CSS inline — fichier autonome) ; chaque graphique énonce la question
à laquelle il répond (figcaption). Jamais de « un graphique par KPI » mécanique. — O :
une vue exposant ≥ N séries comparables sans aucune visualisation lève un
avertissement ; un graphique sans figcaption-question est un défaut ; R : pertinence.

**RL-5 · toutes · metteur en œuvre/mainteneur · O.** *La donnée tabulaire est
exploitable.* Tout tableau ≥ 10 lignes : tri par colonne ; ≥ 10 lignes avec dimensions :
filtres **combinables** ; > 50 lignes : recherche. Fonctionnels, testés au render
(le socle sait déjà piloter la page). — O : test comportemental par tableau.

**RL-6 · toutes · tous · O.** *Une interaction a un effet significatif.* Extension de la
loi transverse n° 1 (« toute affordance est câblée ou n'existe pas ») : câblée **et**
son effet change matériellement ce que le lecteur voit ou comprend. Un repli qui masque
3 lignes sur 400 visibles est un défaut. — O : delta de contenu visible avant/après
interaction au-dessus d'un seuil (mesuré au render).

**RL-7 · F1 surtout · commanditaire · R+O(heuristique).** *Le texte sert la donnée.*
Chaque paragraphe s'ancre : un constat (avec sa donnée), son impact, son action. Les
blocs génériques qui n'apprennent rien sur CE site/CE run sont supprimés — le
générique vit une fois dans la vue Méthode. — O : paragraphe long sans donnée ni renvoi
= avertissement ; R : arbitrage.

**RL-8 · toutes · expert/auditeur · O.** *Le détail à la demande, jamais la perte.*
La hiérarchisation (vue d'ensemble → vues → replis) ne supprime rien : 100 % des
relevés, preuves et traçabilité restent accessibles. — O : inventaire de contenu
source = inventaire de contenu cible (iso-contenu).

**RL-9 · toutes · tous · O.** *Chemins d'entrée par lecteur.* La vue d'ensemble propose
« vous êtes X → commencez ici » pour chaque lecteur type de la famille. — O : présence ;
R : justesse des chemins.

**RL-10 · toutes · — · O.** *Écart explicite* (loi transverse n° 3) : une page qui
s'écarte d'une règle le déclare (manifeste d'écarts dans la page), jamais par
omission. — O : écart non déclaré = défaut ; écart déclaré = consigné, pas sanctionné.

## 5. Mécanique d'application — comment la doctrine s'impose sans se répéter

Quatre artefacts, livrés par la campagne d'encodage (après GO) :

1. **`REFERENTIEL-RESTITUTION.md`** (forge-design) — familles, lecteurs types, règles
   RL-1…RL-10. La doctrine en un lieu, versionnée.
2. **Gabarit consommable** — squelette HTML au socle + composants à emplacements
   obligatoires (`kpi`, `vue`, `tableau-exploitable`, `graphique-question`,
   `chemins-lecteurs`, `manifeste-ecarts`). Les forges productrices (tests, seo,
   audit, data, observability…) génèrent DANS le gabarit : la conformité RL devient
   un effet de bord de la production, comme le socle l'a fait pour la conformité HTML.
3. **`oracle-restitution.mjs`** — les contrôles O ci-dessus, self-test à fixtures
   rouge/verte par règle, même contrat que les oracles existants (exit 0/1).
4. **Extension de `critique-le-design`** — une 8e dimension « lecture de données »
   portant les contrôles R, pour la revue graphique aval (étape 5 bis des runs).

Insertion pipeline : le gabarit et l'oracle sont invoqués par les forges productrices ;
le pilot contrôle au même titre que le socle actuel. Coût permanent assumé : chaque
nouveau dashboard devra déclarer ses lecteurs et ses vues — c'est le but.

## 6. Gouvernance — question à trancher, pas tranchée ici

La compétence (référentiel, gabarit, oracle, revue) a sa place dans **forge-design**.
Mais la règle opposable « tout livrable de restitution passe l'oracle-restitution »
est transverse à toutes les forges : son encodage relève-t-il de `REGLES-PROJET.md`
(pilot) sur proposition d'organization (« organization organise, pilot pilote »),
ou du seul contrat de forge-design ? **Décision humaine requise** (D3 ci-dessous).

## 7. Mise en œuvre proposée (après GO) — par campagnes mandatées

| Phase | Contenu | Forges touchées | Effort |
|---|---|---|---|
| P1 | Référentiel + gabarit + oracle + fixtures | design | 3-5 j |
| P2 | Preuve sur le cas SEO (proposition jointe) | — (produit, sous mandat) | 2-3 j |
| P3 | Extension critique-le-design (8e dimension) | design | 1-2 j |
| P4 | Migration des producteurs (dashboard tests, rapports seo/audit…) | tests, seo, audit, data… | par campagnes successives |

Seuils TF-0155 atteints (objet durable créé, ≥ 3 forges touchées) : une **étude
d'opportunité** (`gabarits\ETUDE-OPPORTUNITE.md`) est due avant le passage en `decide`.

## 8. Décisions humaines attendues (L5)

- **D1** — GO/no-GO sur la doctrine (déclenche l'étude d'opportunité TF-0155, puis P1).
- **D2** — Valider ou amender les lecteurs types §3 (c'est le socle de tout le reste).
- **D3** — Gouvernance de la règle opposable : REGLES-PROJET (pilot) ou contrat
  forge-design (§6).
- **D4** — Périmètre de P4 : quelles forges productrices migrer en premier.
- **D5** — Le seuil « significatif » de RL-6 (delta de contenu visible) : valeur à
  fixer à la première fixture, proposée à 20 %.
