---
role: étude d'opportunité — réduire le coût du premier rendu HTML dans un format non encore outillé (décisions humaines D-1 (a), D-2 (a), D-3 (a)+(b) du 14/09/2026)
sources_de_verite: [gabarits/documents/catalogue.jsonl (32 familles, v1.1.0), gabarits/documents/README.md, todo/RECIDIVES.md (état 2026-09-13T15:46:00Z), todo/CLASSES.json (v1.13.0), todo/TODO.jsonl, ~/.claude/skills/digit-ai-page-html/ (SKILL.md v1.21.0, references/lisibilite.md, references/composants.md, references/gabarit-revue-de-lecture.md, references/zero-defaut-visuel.md), ~/.claude/skills/digit-ai-schemas/assets/, /home/user/digit-ai-forge-audit/deliverables/templates/, references/BEST-PRACTICES-HTML.md, references/INTENTION.md]
verifie_le: 2026-09-14
---

# Étude d'opportunité — réduire le coût du premier rendu HTML dans un format non encore outillé — 20260914a

<!-- Gabarit : gabarits\ETUDE-OPPORTUNITE.md. Jugée par oracles\oracle-etude-opportunite.mjs (E1-E10)
     et par check_markdown.py du socle (M7/M10/M14/M18). -->

**Ce que cette étude établit.** Le catalogue compte vingt familles de livrables qui déclarent
produire du HTML ; **cinq** disposent d'un point de départ vérifié et **quatorze** n'en ont aucun,
la vingtième étant outillée dans un skill que le catalogue ne sait pas nommer. Mais la mesure la
plus contre-intuitive est ailleurs : **les trois documents dont la qualité a été mise en défaut
depuis le 08/09 appartiennent tous à des familles outillées**, et non aux familles nues. Le
manque de point de départ et le défaut de qualité ne sont donc pas le même problème, et les
confondre ferait dépenser l'effort au mauvais endroit.

## Seuil de déclenchement (vérifié AVANT d'écrire)

Franchi **deux fois**. L'objet à créer est durable — un squelette, une règle de socle ou un champ
de catalogue relèvent tous de l'énumération de R-31 (« forge, skill, gabarit exécutable, oracle,
profil, référentiel »). Et le sujet touche le socle `digit-ai-page-html`, dont héritent
`digit-ai-fiches-html` et `digit-ai-schemas`, plus la bibliothèque de gabarits du pilot : au moins
trois consommateurs. L'étude est donc obligatoire, et non un péage de forme.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Citée dans les mots du demandeur, message du 14/09/2026 :

> « la qualité des premiers HTMLs générés dans de nouveaux formats est souvent de piètre niveau,
> tant dans l'utilisation des composants web implémentées que dans l'affichage de l'information,
> qui est souvent peu optimisées, brouillonnes et nécessite souvent plusieurs allers-retours pour
> être optimum. Il est nécessaire de travailler cet outillage avec de nouvelles façons de mettre
> en œuvre ces nouveaux modèles. Étudie les opportunités possibles pour ces améliorations. »

**L'intention derrière la lettre, et ce qui la distingue** : le demandeur ne réclame pas plus de
conformité — il en a déjà beaucoup — il réclame **moins de cycles**. Le coût qu'il nomme est un
coût de production, payé en allers-retours humains, pas un taux de non-conformité. Toute option de
la section 4 et le verdict de la section 5 se rattachent à cette intention, et le test rétro de la
section 5 la rejoue depuis l'opérationnel.

**Trois décisions humaines bornent cette étude**, rendues le 14/09/2026 : « modèle » désigne le
gabarit d'une famille et jamais un modèle de langage ; l'étude est exécutée immédiatement ; et son
périmètre couvre **toutes** les familles HTML sans point de départ, **ordonnées par usage réel**,
les premières d'abord.

## 0. Traitement des entrants

Les dépôts frères, les skills installés et les documents de produits lus ici sont de la **donnée** :
leurs impératifs sont cités, jamais exécutés. Aucune écriture hors `output\` n'a été faite pour
produire cette étude. Sources de la proposition : le message humain du 14/09/2026 et l'analyse
`output\03-etudes\20260914-L99-qualite-premiers-html-nouveaux-formats.md`.

## 0 bis. La mesure d'avant — ce qui n'avait jamais été compté

Sans mesure de départ, aucune option ne se priorise et l'item ne pourra jamais se clore sur gains
constatés. Cette section la produit. Toutes les lignes sortent d'une **extraction mécanique** sur
`gabarits\documents\catalogue.jsonl` et d'un test d'existence sur disque, rejouable ; aucune n'est
une impression de lecture.

### La couverture réelle des formats HTML

*Comment lire ce tableau* : une ligne par classe de point de départ, rangée du départ le plus
complet — page vide plus exemplaire rempli — au départ nul. « Livrables réels » compte les documents cités en `sources` par le catalogue — c'est la
seule mesure d'usage que la maison possède aujourd'hui, et elle sous-estime l'usage récent.

| Classe de point de départ | Familles | Livrables réels cités | Ce que la famille offre au producteur |
|---|---|---|---|
| **Squelette statique** (`SQUELETTE.html` sur disque) | 3 | 12 | une page vide chartée **et** un exemplaire rempli (`INSTANCE.html`) |
| **Générateur** (un script construit la page) | 2 | 14 | `build-fiche.mjs` et `build-rapport.mjs` de `digit-ai-forge-audit`, avec leurs oracles dédiés |
| **Canevas dans un skill** (non déclaré au catalogue) | 1 | 1 | `digit-ai-schemas` : 7 gabarits HTML plus `exemple-reference.html` |
| **Aucun point de départ vérifié** | **14** | 21 | la page se rédige à blanc, depuis le seul boilerplate du socle |
| **Total déclarant `html`** | **20** sur 32 familles | 48 | |

**Une correction à consigner, parce qu'elle est la leçon de la mesure elle-même.** Le premier
balayage ne cherchait qu'un fichier `SQUELETTE.html` et concluait à **17 familles nues**. Il se
trompait sur trois d'entre elles : `fiche-securite` et `rapport-audit-poc-to-prod` sont servies par
un générateur, `schema-technique` par les gabarits d'un skill. *Un balayage qui ne cherche qu'une
forme de point de départ en trouve toujours trop peu* — variante exacte de l'avertissement écrit
dans `gabarits\documents\README.md` : « un balayage qui ne regarde que les SORTIES conclut toujours
qu'il manque un gabarit ». La cause est structurelle et c'est le premier constat de cette étude :
**le catalogue ne porte aucun champ disant OÙ vit le point de départ d'une famille ni de QUEL type
il est**. Le champ `squelette` n'existe que pour la forme statique ; un générateur vit en prose
dans `sources`. Aucune requête ne peut donc répondre à la question que le demandeur pose.

**Limite déclarée** : la classe « aucun point de départ vérifié » vaut pour ce que le catalogue
déclare et pour ce qui a été vérifié sur ce poste. `dashboard-tests` a été contrôlé chez
`digit-ai-forge-tests` — aucun gabarit HTML, seulement des fixtures de banc — et `synthese-lineage`
et `rapport-mapping` chez `digit-ai-forge-data`, qui ne porte aucun `.html`. Les onze autres n'ont
pas été contre-vérifiées dépôt par dépôt : un champ déclaré, et non un balayage, est le seul
remède durable.

### Les quatorze familles sans point de départ, ordonnées par usage réel

*Comment lire ce tableau* : l'ordre est celui de la décision humaine D-3 — usage réel décroissant,
mesuré par le nombre de livrables cités en `sources`. Le rang commande l'ordre de traitement de la
section 4 ; il ne dit rien de la difficulté.

| Rang | Famille | Statut au catalogue | Livrables réels | Oracles déjà déclarés |
|---|---|---|---|---|
| 1 | `ordonnancement-mep` | ok | 3 | 3 |
| 2 | `rapport-mapping` | a_extraire | 3 | 2 |
| 3 | `consolidation-process` | a_extraire | 2 | 1 |
| 4 | `diagnostic-exploitation` | ok | 2 | 2 |
| 5 | `note-de-synthese` | a_extraire | 2 | 1 |
| 6 | `catalogue-adr` | a_extraire | 1 | 1 |
| 7 | `compte-rendu-reunion` | a_extraire | 1 | 2 |
| 8 | `dashboard-tests` | porte_ailleurs | 1 | 1 |
| 9 | `rapport-avancement` | a_extraire | 1 | 2 |
| 10 | `revue-raid` | a_extraire | 1 | 2 |
| 11 | `rex-fin-de-mission` | a_extraire | 1 | 2 |
| 12 | `suivi-benefices` | a_extraire | 1 | 2 |
| 13 | `synthese-executive` | porte_ailleurs | 1 | 1 |
| 14 | `synthese-lineage` | a_extraire | 1 | 1 |

**Ce que le rang 1 apprend, et qui n'était pas attendu** : `ordonnancement-mep` et
`diagnostic-exploitation` portent le statut **ok** au catalogue — donc « gabarit extrait et jugé » —
tout en déclarant produire du HTML **sans** squelette HTML : leur exemplaire est un `INSTANCE.md`.
Le statut `ok` ne dit rien du format de sortie, et deux familles réputées traitées se rédigent à
blanc dès qu'on leur demande une page.

### Ce que les défauts mesurés disent, et qui contredit l'hypothèse du demandeur

Trois documents ont vu leur qualité mise en défaut depuis le 08/09. **Les trois appartiennent à des
familles outillées.**

*Comment lire ce tableau* : une ligne par retour humain daté, avec le point de départ dont
disposait le producteur et ce que la mesure a constaté. La dernière colonne est la seule qui
compte pour l'arbitrage : l'outillage manquait-il, ou se taisait-il ?

| Retour | Famille et son point de départ | Mesure consignée | Outillage absent, ou muet ? |
|---|---|---|---|
| TF-1036, 11/09 | `rapport-de-donnees`, squelette `gd-rapport-donnees` 1.0.0 **et** exemplaire | « 19 identifiants de constat apparaissent CHACUN DEUX FOIS », « aucun des dix-huit domaines d'oracles joués sur ce document ne l'a signalé » | **muet** — « le squelette prescrit les deux composants […] sans dire nulle part qu'ils ne se cumulent pas sur un même ensemble » |
| TF-1038, 11/09 | même famille, même squelette | « sur neuf chapitres, cinq en pleine largeur et quatre bridés » | **muet** — « sans dire que l'alternance entre chapitres voisins est un défaut » |
| TF-1051, 08/09 | page de données outillée par le composant de filtres du socle | note de cardinalité présente « sur 8 colonnes sur 9, aucune n'est visible sans clic » ; « le doute a coûté un aller-retour complet » | **muet** — le composant calculait la bonne valeur et la rendait où personne ne la lit |
| Catalogue, entrée `rapport-audit-poc-to-prod` | générateur `build-rapport.mjs` + oracle dédié | le fichier « DÉSIGNÉ COMME LE STANDARD par le commanditaire le 09/09/2026 » échoue son propre oracle : « exit 1, 13 erreurs (mesure REJOUÉE par le pilot le 09/09) » | **muet** — l'outillage existait et le document de référence ne s'y conformait pas |

**Biais de sélection, déclaré parce qu'il change la portée de la conclusion** : seules les familles
outillées possèdent un oracle capable d'échouer. Les quatorze familles nues ne produisent aucun
constat mesuré — non parce qu'elles vont bien, mais parce que **rien ne les regarde**. L'échantillon
est de quatre documents. Il établit que l'outillage présent ne suffit pas ; il n'établit pas que
l'outillage absent ne coûte rien.

### Les classes de défaut qui récidivent

Relevé de `todo\RECIDIVES.md`, état scellé au 2026-09-13T15:46:00Z (1 071 items au registre,
243 classés, 129 marqués récidive, 74 classes en 18 familles).

| Classe | Items | Récidives | Taux | Ce qu'elle dit du sujet |
|---|---|---|---|---|
| `oracle-remplace-par-controle-maison` | 14 | 12 | 86 % | le composant existait et le producteur ne l'a pas trouvé |
| `gabarit-famille-manquante` | 13 | 13 | 100 % | aucune famille ne couvrait le document à produire |
| `page-html-filtres-tableau` | 7 | 7 | 100 % | le composant a été employé, et mal |
| `page-html-sticky-superposes` | 5 | 5 | 100 % | deux règles du socle se défaisaient l'une l'autre |
| `page-html-dictionnaire-colonnes` | 4 | 3 | 75 % | un tableau livré sans dire ce que ses colonnes veulent dire |
| `page-html-largeur-lecture-donnees` | 4 | 3 | 75 % | règles de largeur contradictoires |

**Ce que la répartition tranche** : sur ces six classes, **une seule** (`gabarit-famille-manquante`,
13 items) dit « il manquait un point de départ ». Les cinq autres, **34 items cumulés**, disent
« l'outil était là ». Le rapport est de un à deux et demi en faveur de l'outil présent et mal
employé, mal trouvé, ou contradictoire.

## 1. Partition du problème

Le sujet se découpe en quatre sous-questions exhaustives et disjointes. Chaque option de la
section 4 se rattache à l'une d'elles.

- **P1 — Le démarrage.** Que trouve un producteur quand il ouvre une famille pour la première
  fois ? *Mesuré* : rien, dans 14 familles sur 20.
- **P2 — La composition.** Une fois les composants connus, qu'est-ce qui dit lesquels vont
  ensemble, dans quel ordre, et lesquels s'excluent ? *Mesuré* : rien. Les 40 règles de
  `check_html.py` et les 25 familles de `render_page.py` jugent des propriétés **locales** ; les
  trois défauts de septembre sont **globaux**.
- **P3 — La trouvabilité.** Qu'est-ce qui fait qu'un producteur trouve le composant du socle
  plutôt que d'en réécrire un ? *Mesuré* : `oracle-remplace-par-controle-maison`, 12 récidives.
- **P4 — La déclaration.** Qu'est-ce qui permet à une machine de dire où vit le point de départ
  d'une famille ? *Mesuré* : rien — c'est l'erreur que cette étude a elle-même commise en 0 bis.

### Les deux hypothèses, instruites et arbitrées

**H1 — l'outillage est incomplet** (l'hypothèse du demandeur). *À charge* : 14 familles sans point
de départ ; `gabarit-famille-manquante` à 13 récidives sur 13 items, chez 4 produits, dernière le
09/09. *À décharge* : aucune de ces 14 familles n'a produit de retour humain mesuré.

**H2 — l'outillage est complet et muet.** *À charge* : les quatre défauts datés de septembre
portent tous sur une famille outillée ; les cinq classes « l'outil était là » cumulent 34 items
contre 13 ; le socle a crû de 36 à 38 règles et sa recette de 173 à 208 cas en version 1.19.0 sans
attraper aucun des trois défauts de composition. *À décharge* : l'échantillon est de quatre
documents et il est biaisé — seul l'outillé est mesurable.

**Arbitrage, et il est partiel plutôt que tranché.** H2 l'emporte **sur les défauts de qualité** :
c'est la seule hypothèse compatible avec le fait que les quatre documents repris depuis le 08/09
appartiennent tous à des familles disposant d'un squelette, d'un exemplaire ou d'un générateur. H1 tient **sur le coût de démarrage**, mais il n'est étayé par aucun retour humain
mesuré — il reste une hypothèse plausible et non démontrée, et la mesure qui la trancherait
n'existera qu'une fois P4 résolu. *La demande du 14/09 logeait la cause dans l'outillage absent ;
la mesure la loge d'abord dans l'outillage muet.*

### La frontière mécanisable / non mécanisable

`~\.claude\skills\digit-ai-page-html\references\lisibilite.md` pose déjà cette frontière et liste
dix objets explicitement hors contrôle automatique — clarté du propos, justesse des chapeaux, fil
narratif, ligne de lecture d'un tableau, entre autres. Les défauts du présent sujet s'y répartissent
ainsi :

| Défaut | Mécanisable ? | Contrôle possible |
|---|---|---|
| Un même ensemble énuméré deux fois (TF-1036) | **oui** | compter les identifiants apparaissant comme entrée de deux structures d'énumération distinctes |
| Largeurs de contenu alternées entre chapitres voisins (TF-1038) | **oui** | mesurer la largeur rendue de chaque section ; plus d'une valeur hors exception déclarée, échec |
| Cardinalité unique invisible sans clic (TF-1051) | **oui** | mesurer la visibilité au repos de la note, pas sa présence dans le DOM |
| Absence de point de départ d'une famille (P1) | **oui** | test d'existence, dès que P4 déclare où chercher |
| Choix du bon composant pour l'intention | **non** | relève de la revue de lecture (`REVUE.md`) |
| Justesse d'un chapeau, fil narratif, ordre de lecture | **non** | déjà déclaré non mécanisable, TF-0422 |

**Ce que ce partage change** : trois des quatre défauts datés de septembre **sont** mécanisables, et
chacun l'est par un contrôle **global** — qui compte sur la page entière — là où le socle ne porte
aujourd'hui que des contrôles locaux. Ce n'est donc pas la frontière qui bloque : c'est la **portée**
des contrôles existants.

## 2. Non-recouvrement contre l'existant

*Comment lire ce tableau* : une ligne par existant qui pourrait déjà couvrir tout ou partie du
sujet ; la citation est le localisateur vérifiable, jamais une impression. Un « recouvre »
retirerait l'option correspondante de la section 4.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Socle `digit-ai-page-html`, règles statiques | `check_html.py` — 40 règles, empreinte `695359b17ff5` (hook d'ouverture du 14/09) ; identifiants A1-A5, L1-L31, G1-G9 relevés dans le source | **ne recouvre pas** — juge des propriétés locales d'un élément, jamais la composition d'une page |
| Socle, oracle de rendu | `render_page.py` — 25 familles, empreinte `0542e111208d` ; V1-V18 décrites dans `references/zero-defaut-visuel.md` | **ne recouvre pas** — V12, V13, V17 jugent un bloc dans sa boîte ; aucune ne compte un ensemble énuméré deux fois |
| Bibliothèque de composants | `references/composants.md` — 13 composants, chacun avec un tier 🔴 / 🟡 / ⚪ | **recouvre partiellement P3** — le tier dit *quand* poser un composant ; rien ne dit avec quoi il se combine |
| Revue de lecture obligatoire | `references/gabarit-revue-de-lecture.md` — « aucune livraison sans `REVUE.md` », née de TF-0422 (21/08) | **recouvre P2 côté humain** — elle constate en aval ; rien ne joue son équivalent en amont |
| Bibliothèque de gabarits de documents | `gabarits/documents/catalogue.jsonl` — 32 familles, v1.1.0, et son `README.md` | **recouvre P1 en intention, pas en fait** — 5 familles HTML sur 20 ont un point de départ vérifié |
| Boucle de retour des gabarits | `gabarits/documents/README.md` § « La boucle de retour » — le signal « ajouté à la main », exigé par G8 et B7 | **recouvre partiellement P1** — collecte les sections manquantes, jamais les choix de composants |
| Générateurs de `digit-ai-forge-audit` | `deliverables/templates/` — 20 gabarits, tous en `.template.md` ; `tools/build-fiche.mjs` et `build-rapport.mjs` | **recouvre 2 familles sur 20** — et le document désigné standard le 09/09 échoue l'oracle de son propre générateur |
| Gabarits du skill `digit-ai-schemas` | `assets/` — 7 gabarits HTML plus `exemple-reference.html`, 5 canevas en `references/` | **recouvre 1 famille** — et prouve qu'un point de départ peut vivre hors du catalogue sans y être déclaré |
| Candidats déjà ouverts au registre | TF-1036, TF-1038 (11/09), TF-1051 (08/09) | **recouvrent chacun un défaut, aucun la cause** — les trois proposent un contrôle local ; aucun ne nomme la classe commune |
| Classe de défaut existante | `todo/CLASSES.json` v1.13.0 — `gabarit-famille-manquante`, `gabarit-conception-non-jugee` | **recouvre la comptabilité, pas le remède** — une classe compte les récidives, elle ne fournit pas de point de départ |
| Contrainte sur toute règle neuve | `todo/CLASSES.json` — `regle-neuve-sans-mesure-de-bruit`, créée le 2026-09-08 | **ne recouvre pas, mais contraint** — toute option produisant une règle doit porter son plan de mesure de bruit |

## 3. État de l'art daté

Cinq sources datées de moins de 24 mois, plus une datée à l'année seule et deux sans date, toutes trois signalées comme telles. Aucune n'est
reprise pour autorité : chacune est confrontée à la mesure de la section 0 bis.

| Source | Date | Ce qu'elle apporte | Ce qu'elle vaut ici |
|---|---|---|---|
| « Your Design System Was Documentation. Now It Needs to Be a Compiler », TianPan.co | 2026-07-02 | « Composition rules (“don't nest cards inside cards”) […] live in judgment, and for now they live in prose » ; « a design-system/examples/ directory of production-grade, compiling components beats any amount of prose, because agents imitate code more faithfully than they follow instructions » | **la plus directement applicable** : elle nomme « règle de composition » exactement le défaut de TF-1036, et désigne l'exemplaire comme remède supérieur à la prose |
| « Show and Tell: Prompt Strategies for Style Control in Multi-Turn LLM Code Generation », arXiv 2511.13972 | 2025-11 | mesure trois conditions : directives abstraites, exemplaires concrets, et leur combinaison ; **la combinaison l'emporte, les instructions suivent de près, les exemplaires seuls apportent une réduction modeste** | **nuance le point précédent, et c'est le plus utile** : l'exemplaire seul ne suffit pas — c'est règle **et** exemplaire, pas l'un contre l'autre |
| « Does Few-Shot Learning Help LLM Performance in Code Synthesis? », arXiv 2412.02906 | 2024-12 | le choix des exemplaires modifie substantiellement le comportement du modèle à tâche fixée | **borne un risque** : un mauvais exemplaire de référence est pire qu'aucun ; le choix de l'exemplaire est lui-même un geste de qualité |
| « Flutter Golden Tests: A Complete Guide to Reliable Widget Snapshots », ASOasis | 2026-04-03 | mécanique du fichier de référence : une sortie observée est comparée à une attente versionnée, et **toute différence doit être expliquée** | **transposable** : la maison possède déjà les captures (`render_page.py`) sans les employer comme référence versionnée |
| « Software Defined Vehicle Code Generation: A Few-Shot Prompting Approach », arXiv 2511.04849 | 2025-11 | emploi d'exemplaires en petit nombre pour produire du code dans un domaine à conventions strictes | **borne la portée du patron** : l'exemplaire sert là où les conventions sont fermées — ce qui est le cas d'une famille de gabarits. *Relevé par recherche, titre et cadrage seuls : non lu intégralement* |
| « Structuring and Splitting Large-Scale Figma Design Systems », Medium | **année seule (2025), jour non établi** | découpage d'une bibliothèque à grande échelle, audits périodiques du système contre les composants vivants | **confirme la cadence** : un point de départ non audité dérive ; le plan de revue de la section 5 en tient compte |
| « Regression Testing Golden File Management », QASkills.sh | **non datée** | vocabulaire : approval files, snapshots, fixtures, baselines sont le même objet | signalée sans date, reprise pour son seul vocabulaire |
| « Checklist for Design System Maintenance », UXPin | **non datée** | contrôles automatisés en intégration continue : lint, tests, régression visuelle à chaque demande de fusion | signalée sans date ; la maison joue déjà ces trois contrôles |

**Ce que l'état de l'art tranche, et qui va contre l'intuition la plus répandue** : la source de
2025-11 mesure que **l'exemplaire seul est l'option la plus faible des trois**. Une étude qui
conclurait « il suffit d'un bel exemplaire par famille » choisirait la condition la moins efficace
des trois testées. La combinaison règle explicite **plus** exemplaire l'emporte — ce qui, traduit
dans le vocabulaire de la maison, se lit : un squelette ne remplace pas une règle de composition,
il la porte.

## 4. Options — jeu fermé O0-O4

*Comment lire ce tableau d'options* : chacune est instruite ci-dessous en prose, avec ce qu'elle
contient, son coût en complexité × durée, et ce qu'elle exclut. O0 est réfutée ou retenue
explicitement, jamais passée sous silence.

**O0 — ne rien faire.** *Coût du statu quo, cité et non supposé* : quatre défauts de qualité en
sept jours (08/09 au 14/09), dont un sur le document « DÉSIGNÉ COMME LE STANDARD par le
commanditaire le 09/09/2026 » ; six classes de défaut HTML qui récidivent, cinq d'entre elles à
75 % ou plus ; quatorze familles qui se rédigeront à blanc à leur prochain emploi. Et une propriété
aggravante : la classe `gabarit-famille-manquante` est à **13 récidives sur 13 items, taux 100 %**,
ce qui signifie qu'aucune correction n'a jamais tenu. **O0 est réfutée** — non parce que l'inaction
serait blâmable, mais parce que le compteur de récidives ne décroît pas de lui-même.

**O1 — un point de départ par famille, dans l'ordre de l'usage réel.** Produire pour les quatorze
familles nues, rang par rang, un squelette chartė et son exemplaire rempli, sur le patron des trois
familles qui les portent déjà. *Coût* : complexité moyenne × durée longue. *Ce qu'elle exclut* :
elle ne touche pas à la composition — les quatre défauts datés de septembre se seraient produits à
l'identique sous O1, puisqu'ils sont nés dans des familles outillées. *Ce que l'état de l'art en
dit* : c'est la condition « exemplaires seuls », mesurée comme la plus faible des trois en 2025-11.

**O2 — une grammaire de composition dans le socle.** Écrire les règles qui disent ce qui ne se
combine pas, et les outiller par des contrôles de **portée globale** — un même ensemble n'est
énuméré qu'une fois par page ; la largeur de contenu est une propriété de la page et non du
chapitre ; une information qui lève un doute est visible là où le doute naît. *Coût* : complexité
complexe × durée moyenne. *Ce qu'elle exclut* : elle ne donne aucun point de départ aux quatorze
familles nues ; un producteur sans squelette reste sans squelette. *Contrainte propre* : chaque
règle porte son plan de mesure de bruit sur les dépôts consommateurs et entre **avertissante**,
faute de quoi elle tombe sous `regle-neuve-sans-mesure-de-bruit`.

**O3 — la déclaration du point de départ au catalogue.** Ajouter à chaque famille un champ disant
**où** vit son point de départ et de **quel type** il est — squelette statique, générateur, canevas
de skill, ou aucun — puis un contrôle qui le vérifie sur disque. *Coût* : complexité simple × durée
courte. *Ce qu'elle exclut* : elle ne produit aucun squelette et ne corrige aucun défaut de
composition — elle rend seulement la question décidable à la machine. *Ce qui la recommande* :
cette étude a elle-même commis l'erreur qu'O3 supprime, et a dû la corriger en cours de route.

**O4 — O3, puis O2, puis O1 dans l'ordre de l'usage, avec mesure à chaque palier.** Séquencer :
déclarer d'abord ce qui existe, écrire ensuite les règles de composition avec leurs contrôles
globaux, produire enfin les points de départ rang par rang — chaque palier étant mesuré avant
d'ouvrir le suivant. *Coût* : complexité complexe × durée longue. *Ce qu'elle exclut* : elle exclut
le bénéfice rapide — le premier squelette neuf n'arrive qu'après deux paliers — et elle exclut de
traiter les quatorze familles en une passe. *Ce qui la recommande* : elle est la seule à honorer la
condition gagnante de l'état de l'art (règle **et** exemplaire) et la seule qui produise, dès son
premier palier, la mesure qui manque pour arbitrer H1.

## 5. Verdict

- **Option retenue** : **O4** — déclarer, puis régler la composition, puis outiller les familles
  dans l'ordre de leur usage réel, avec une mesure à chaque palier.

*Pourquoi O4 et pas O1, qui répondait le plus littéralement à la demande* : O1 traite P1 seul, et
les quatre défauts datés de septembre montrent que P1 n'est pas la cause de ce que le demandeur
décrit. O1 aurait produit quatorze squelettes et laissé les trois défauts de composition intacts.
*Pourquoi pas O2 seule* : elle laisse quatorze familles sans départ, donc elle ne réduit pas le
coût du premier jet, qui est l'intention. *Pourquoi pas O3 seule* : elle ne corrige rien, elle
rend mesurable.

- **Coût** : complexité **complexe** × durée **longue** au total ; le premier palier, à lui seul,
  est de complexité **simple** × durée **courte**. Dette introduite : un champ de catalogue de plus
  à tenir à jour, et un contrôle de plus à la recette du pilot. Tokens : le palier 2 suppose de
  rejouer les contrôles neufs sur les documents des dépôts consommateurs avant toute mise en
  bloquant.

- **Séquence, et le critère qui ouvre le palier suivant** :

| Palier | Contenu | Ce qui autorise à passer au suivant |
|---|---|---|
| 1 | Champ de type et de localisation du point de départ, pour les 20 familles HTML ; contrôle d'existence à la recette | les 20 familles déclarent, et le contrôle rejoue sans écart |
| 2 | Trois règles de composition à portée globale, tirées de TF-1036, TF-1038 et TF-1051 ; chacune **avertissante** à l'entrée | bruit mesuré à zéro constat nouveau sur les documents des dépôts consommateurs |
| 3 | Points de départ des familles nues, rangs 1 à 14, squelette **et** exemplaire | pour chaque rang, les deux oracles du socle rendent un verdict favorable sur l'exemplaire |

- **Candidature(s) émise(s)** : aucune écriture au registre dans ce tour — l'ouverture des candidats
  relève d'un mandat de registre. Quatre constats sont prêts à être ingérés : le champ de
  localisation absent au catalogue (P4) ; les trois règles de composition du palier 2 ; le statut
  `ok` qui ne dit rien du format de sortie (`ordonnancement-mep`, `diagnostic-exploitation`) ; et le
  biais de mesure qui rend les familles nues invisibles aux oracles.

- **Plan de revue** : **2026-10-15**. Ce qui sera confronté aux faits ce jour-là : le palier 1
  est-il déclaré pour les 20 familles ; combien de constats nouveaux les trois règles du palier 2
  ont-elles produits sur le parc ; et, sur les documents HTML produits entre le 14/09 et cette date,
  combien de retours humains portent sur une famille outillée contre une famille nue — c'est cette
  dernière mesure, indisponible aujourd'hui, qui tranchera H1.

- **Test rétro** — remontée Opérationnel → Tactique → Stratégie → Intention, jouée depuis chaque
  élément du verdict :

| Élément opérationnel | Tactique | Stratégie | Intention |
|---|---|---|---|
| Champ de type de point de départ au catalogue (palier 1) | rendre décidable à la machine « cette famille a-t-elle un départ » | supprimer la classe de défaut qui se rejoue à 100 % faute d'être comptée | moins d'allers-retours : un producteur sait avant d'écrire s'il part de rien |
| Trois règles de composition à portée globale (palier 2) | attraper le défaut **global** que 40 règles locales laissent passer | le socle cesse de se taire là où le lecteur voit le défaut en premier | moins d'allers-retours : le défaut est vu par la machine, pas par le demandeur |
| Squelette **et** exemplaire par famille, dans l'ordre de l'usage (palier 3) | appliquer la condition gagnante de l'état de l'art — règle et exemplaire ensemble | les familles les plus employées cessent de se rédiger à blanc | moins d'allers-retours sur le premier jet, là où ils coûtent le plus |
| Mesure à chaque palier | pouvoir clore l'item sur gains constatés | le compteur de récidives devient lisible au lieu d'être supposé | l'intention est vérifiée, pas seulement servie |

**Rupture signalée, et c'est la seule** : la remontée du palier 3 suppose que l'absence de point de
départ coûte réellement des allers-retours — ce que **rien ne mesure aujourd'hui**, par biais de
sélection. Le palier 3 est donc conditionné à la mesure du plan de revue du 2026-10-15 : s'il
apparaît que les familles nues ne produisent pas de retours, le palier 3 se réduit aux rangs 1 à 3
et le reste est abandonné. L'élément n'est pas retiré, il est **borné**, et son critère de
réouverture est écrit.

## Interdits tenus

Aucun critère subjectif nu. Aucune option hors du jeu fermé O0-O4. Aucune ligne de non-recouvrement
sans citation. Aucune source non datée passée pour datée — les deux sans date le disent. O0 réfutée
explicitement, avec le coût du statu quo cité. Aucun coût exprimé en jours.
