# Étude d'opportunité — conventions de la forge gravées ou paramétrables (TF-0322) — 20260817f

## Seuil de déclenchement (vérifié AVANT d'écrire)

TF-0322 déclare lui-même le seuil franchi (« Seuil TF-0155 franchi : objet durable + noyau +
toutes les forges »). Vérification indépendante, faite avant d'écrire :

1. **Crée un objet durable** (R-31) — les pistes nomment « un fichier de préférences unique
   lu par les générateurs ET par les oracles » et « un oracle qui juge la cohérence entre la
   préférence déclarée et les artefacts produits » : un référentiel et un contrôle.
2. **Touche le noyau et ≥ 3 forges** — les conventions visées sont écrites dans
   `REGLES-PROJET.md` (règles 2, 4, 5, 7, 18, 25), dans les gabarits du pilot, et dans les
   contrôles de trois dépôts au moins (pilot, organization, agents).

Score au registre : gain 3 · preuve 3 · **effort 4** · **valeur 2,3** — la valeur la plus
faible des 7 candidatures ouvertes, et le seul effort à 4 (`todo\TODO.jsonl` : TF-0317 1 ·
TF-0318 2,7 · TF-0319 4,5 · TF-0320 4 · **TF-0322 2,3** · TF-0323 4 · TF-0324 3). Le seuil
oblige à instruire ; il n'oblige pas à construire.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas. Sa
piste centrale — « un fichier de préférences unique lu par les générateurs ET par les
oracles, valeurs par défaut égales aux conventions actuelles » — est examinée comme option,
non adoptée par le seul fait d'avoir été écrite. Son exclusion explicite est retenue et
vérifiée : « Ne pas confondre avec `gabarits\docs-projet\PARAMETRAGE.md` et `.env.example`
(R-20/R-22), qui décrivent la configuration d'exécution d'un PRODUIT. »

Sources de la proposition : **TF-0322** (`todo\TODO.jsonl`, créé le 2026-08-17T10:10:02Z,
statut `candidat` ; demandeur « humain (Sébastien) — demande directe en session pilot » ;
source « demande directe du 16/08/2026, complément aux 5 idées du même jour »).
Précédent cité par l'item et lu en entier à l'archive : **TF-0165**
(`todo\TODO-ARCHIVE.jsonl`, créé 2026-08-13T14:04:21Z, archivé 2026-08-13T15:01:43Z).
Item lié, instruit le même jour : TF-0319 (`output\03-etudes\20260817-etude-opportunite-rangement-output.md`).

## 1. Partition du problème

- **P-a — Ce qui est DÉJÀ paramétrable.** L'item postule que les conventions sont gravées
  partout. La première question est de mesurer si c'est vrai, dimension par dimension.
- **P-b — Le coût réellement payé.** Combien d'arbitrages de convention ont été pris en
  session, et que sont-ils devenus ? C'est la seule mesure qui décide entre instruire et
  construire.
- **P-c — La valeur d'une convention unique.** Ce qu'un paramétrage ferait perdre, mesuré et
  non postulé.
- **P-d — Le nombre de porteurs.** Combien de lieux écrivent la même convention en dur, et
  divergent-ils déjà ? C'est ce qui chiffre l'effort de toute option construite.
- **P-e — Ce qui n'est pas négociable, et pourquoi.** L'item pose la question ; y répondre
  par écrit est dû quelle que soit l'issue de la section 4 (loi transverse n° 3 : on
  s'écarte explicitement, jamais par omission).

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `digit-ai-forge-agents\.claude\skills\quality-oracles\profils\digit-ai.json` bloc `nommage` | `"nommage": {"_decision": "Q3-bis …", "prefixe": "Digit-AI", "libelle": "<Projet> - <Objet> - AAAAMMJJ{a…}.<ext>", "declencheur": "^.+ - .+", "regex": "^[^_]+ - [^_]+ - \\d{8}[a-z](?: .*)?\\.[A-Za-z0-9]+$"}` — fichier versionné `"version": "1.1.0"` | **recouvre la dimension « nommage des fichiers » en entier** : le nommage EST déjà un paramètre déclaré, versionné, portant sa décision d'origine dans le fichier même — le postulat « gravées, pas paramétrables » est faux pour cette dimension |
| `…\quality-oracles\profils\generique.json` bloc `nommage` (`"version": "1.2.0"`) | `"_decision": "TF-0071 (11/08/2026) : convention générique MINIMALE plutôt que SKIP permanent … Un projet aux conventions propres n'est jamais condamné : ses fichiers ordinaires ne déclenchent pas."` | recouvre la **portée** que l'item demande (préférence par profil, surcharge possible) : deux profils coexistent déjà, dont un pensé pour un projet aux conventions propres |
| `…\quality-oracles\scripts\oracle-nommage.mjs` l.26-27 | `if (pArg) { try { nom = JSON.parse(fs.readFileSync(pArg,'utf8')).nommage \|\| null } catch {} }` puis `if (!nom \|\| !nom.regex \|\| !(nom.declencheur \|\| nom.prefixe)) out('SKIP', [], [...NJ,'profil sans convention de nommage'], 2)` | recouvre le mécanisme que l'item décrit comme difficile — « un contrôle qui juge contre une constante doit désormais juger contre la préférence déclarée » : ce contrôle est écrit, exercé, et dégrade en SKIP motivé sans préférence |
| `REGLES-PROJET.md` §M R-33 bis | « Le passage au bloquant se fait par un **paramètre unique et versionné**, sans retoucher la règle » — `[gates] websec_bloquant = false` au frontmatter de `docs\projet\PARAMETRAGE.md` ; R-33 ter ajoute `admission_skill_bloquante = false` | recouvre le PATRON de paramétrage de l'écosystème (paramètre versionné, défaut déclaré, surcharge par produit, passage consigné) ; portée limitée à l'armement des gates — c'est le modèle qu'une option construite reprendrait, pas un doublon |
| `REGLES-PROJET.md` §B règle 4 alinéa RV-2 | « quand un ENTRANT exige un autre nommage pour le livrable, le nommage du pilot **prime** ; la correspondance entre le nom exigé et le nom produit est consignée au ledger (champ `note_nommage`) — jamais d'arbitrage silencieux » | **recouvre entièrement le conflit fondateur** que TF-0165 avait laissé ouvert : la question « laquelle prime » est tranchée, dans le sens inverse du paramétrage, et l'arbitrage est rendu traçable au lieu d'être supprimé |
| `_Nhood\SCC_ALX\forge\ledger.jsonl` seq 1 champ `note_nommage` | « le prompt d'origine demandait `mapping_bronze_alx_silver_<client>_<AAAAMMJJ><indice>.md` ; R-4 du pilot impose « `<Marque> - <Type> <Objet> - AAAAMMJJ<indice>` » … Le nommage pilot prime, l'ecart est consigne ici » | le précédent TF-0165 est sur pièces et son coût est mesurable : **une ligne de ledger**, une fois, le 13/08 — puis l'alinéa RV-2 a supprimé le besoin de réarbitrer |
| Recensement des arbitrages de convention au registre | recherche par titre sur `nommage\|convention\|graphie\|casse` dans `todo\TODO.jsonl` (41 événements) et `todo\TODO-ARCHIVE.jsonl` (1 596 événements) → TF-0034, TF-0061, TF-0062, TF-0071, TF-0109, TF-0149, TF-0165, TF-0227, TF-0269, TF-0281 | **un seul** de ces dix items est un conflit de PRÉFÉRENCE (TF-0165) ; les neuf autres sont des alignements sur une convention existante ou des mécanisations. P-b est mesuré : 1 arbitrage sur 1 637 événements de registre |
| `oracles\oracle-conformite-projet.mjs` l.37 | `const MOTIF_DATE = / - \d{8}[a-z]?\.[\w.]+$/;` — 5 usages (R-4 l.110, R-25 l.169, R-6 l.228, R-16 l.319) | confirme P-d chez le pilot : une constante en dur, indépendante du profil `nommage` de quality-oracles qui décrit la même convention |
| `digit-ai-forge-organization\oracles\oracle-conventions.mjs` l.199-200 | `const QUEUE_CONFORME = /^(\d{8})([a-z])(?: .*)?\.[A-Za-z0-9]+$/;` et `QUEUE_SANS_INDICE` | deuxième constante en dur, indépendante des deux précédentes — trois écritures de la même convention dans trois dépôts |
| Recensement exécuté des porteurs | 8 fichiers de l'écosystème portent un motif `\d{8}` en dur : `check_html.py`, `quality-oracles\scripts\oracle-coherence.mjs`, `quality-oracles\scripts\oracle-nommage.mjs` (l.38, dans un indice d'aide), `oracle-conventions.mjs` + son `self-test.mjs`, `gate-conventions.mjs`, `oracle-conformite-projet.mjs`, `digit-ai-forge-seo\scripts\rapport_html.py` | chiffre l'effort de toute option construite : 8 fichiers dans 4 dépôts, dont 3 frères — donc autant de mandats humains (garde-fou du noyau). Ce n'est pas un recouvrement, c'est le devis |
| `REGLES-PROJET.md` §F règle 18 | « **le préfixe projet est obligatoire** (décision 13/08 : les lots de tous les projets cohabitent chez le pilot, le nom dit qui retourne quoi) » | recouvre P-c en doctrine : la convention unique n'est pas un goût, c'est ce qui rend la boîte d'entrée lisible |
| `input\00-retours\old\` (mesure exécutée) | **19 lots de 9 produits distincts** dans un seul dossier : Approval2 (2), AuxPortesDeLaBaie (1), BdL (2), COMPTA - Ventilation de facture SFR (2), SCC_ALX (5), bourse-aux-vacants (4), digit-desk.fr (1), forge-digit-ai-fr (1), pilot-campagne-fiches-html (1) | P-c mesuré : c'est la contrepartie exacte qu'un nommage par produit ferait perdre — 9 conventions dans un dossier au lieu d'une |
| `oracles\oracle-boite-entree.mjs` (B1-B3) | apparie les lots par **sidecar homonyme et registre d'ingestion** (`lot_sha`), jamais par un motif de nom de produit | nuance honnête contre P-c : la MACHINE est déjà insensible au nommage des lots ; c'est l'humain qui lit par le nom, et la règle 18 le dit explicitement — donc la perte serait humaine, pas mécanique |
| `digit-ai-forge-organization\decisions\D-15.md` §Décision al. c | la graphie `old\` a été tranchée par ALIGNEMENT : « par alignement sur l'état de fait du 13/08 (six dépôts + `audit_nhood` l'écrivent déjà ainsi ; **zéro re-migration**) … Cette graphie **remplace** … celle retenue par D-02 » | précédent de méthode contre le paramétrage : le seul vrai conflit de convention de l'histoire du corpus s'est réglé en **réduisant à une valeur**, pas en admettant deux |
| `references\ETAPES-RUN.md` §1 et `gabarits\CLAUDE-PRODUIT.md` l.46 | les deux disent « `Old\` jamais versionné » ; `REGLES-PROJET.md` l.4-7 : « C1 = `old\` (minuscule — graphie D-15) … et **VERSIONNÉ** … l'ancien arbitrage "jamais versionné" est **caduc** » | P-d en défaut sur pièces, et l'argument le plus fort du candidat : deux valeurs pour une notion existent déjà, non par choix mais par défaut de mise à jour. Un paramètre n'aurait pas empêché cela — mais l'absence de point d'écriture unique l'a permis |
| `todo\oracle-todo.mjs` l.68 et `oracles\oracle-insatisfactions.mjs` l.41 | `if (!e.id \|\| !/^TF-\d{4}$/.test(e.id))` ; `const RE_ID = /^INS-\d{4}$/` avec contrôle de séquence sans trou | recouvre P-e pour les identifiants stables : leur format est une garantie du registre (unicité, séquence, ids jamais réaffectés — `CONTRAT-INTERFACE.md` §3 bis), pas une préférence. L'item le dit déjà ; il reste à l'écrire là où c'est opposable |
| `gabarits\docs-projet\PARAMETRAGE.md` et `.env.example` (R-20/R-22) | R-22 : « les noms de variables déclarés dans le frontmatter `variables:` de `PARAMETRAGE.md` et ceux de `.env.example` … sont identiques » | ne recouvre pas : configuration d'exécution d'un PRODUIT, comme l'item l'affirme — vérification faite, l'exclusion qu'il pose est juste |
| `output\03-etudes\20260817-etude-opportunite-rangement-output.md` §5 (TF-0319) | verdict O3 : la frontière livrable/travail se DÉCLARE, `output\<NN>-<famille>\` vérifié par les appelants existants | recouvre la dimension « dossiers » que l'item veut rendre paramétrable : le rangement devient déclaré au cas par cas, ce qui répond au besoin sans système de préférences |

## 3. État de l'art daté

**Non instruit** — motif : aucune campagne de recherche externe n'est mandatée, et la
question est arithmétique avant d'être doctrinale. Les pièces datées qui la tranchent ont
toutes été lues et comptées ce jour : les deux profils de nommage (`digit-ai.json` v1.1.0,
`generique.json` v1.2.0 portant sa décision du 2026-08-11), TF-0165 (2026-08-13), D-15
(2026-08-13), l'alinéa RV-2 de la règle 4 (2026-08-13), R-33 bis (2026-08-14), les 19 lots
de `input\00-retours\old\` (2026-08-13 à 2026-08-17) et le recensement des 8 porteurs de
constantes. Un référentiel externe sur les systèmes de configuration ne dirait rien du
nombre d'arbitrages payés dans cet écosystème, qui est la mesure décisive. La revue de la
section 5 confronte le verdict à ce même compteur.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : RÉFUTÉE**, sur un motif de forme et un défaut mesuré, et non sur la
  préférence du demandeur :
  - **Deux valeurs pour une notion existent déjà.** `references\ETAPES-RUN.md` §1 et
    `gabarits\CLAUDE-PRODUIT.md` l.46 portent « `Old\` jamais versionné », que
    `REGLES-PROJET.md` déclare caduc depuis le 13/08 ; le second est copié dans chaque
    produit à l'ouverture de run et `_Nhood\SCC_ALX\CLAUDE.md` l.46 le porte. Une convention
    écrite dans N lieux diverge : c'est constaté, pas prédit.
  - **La question posée resterait sans réponse écrite.** L'item demande explicitement « ce
    qui reste NON paramétrable et pourquoi ». Répondre par le silence est exactement ce que
    la loi transverse n° 3 interdit : « la surface implicite … est proposée d'office et
    s'écarte explicitement, jamais par omission ». Et le gabarit d'étude existe précisément
    parce qu'une décision qui n'existe qu'« en une ligne de journal » se re-instruit
    (`gabarits\ETUDE-OPPORTUNITE.md`, en-tête TF-0155).
  - Ce que O0 ne coûte PAS, et qui est dit ici : **un seul arbitrage de convention en
    session sur toute l'histoire du registre** (TF-0165, 1 ligne de ledger, 13/08), déjà
    fermé par l'alinéa RV-2. Le coût du statu quo n'est pas l'arbitrage : c'est l'absence de
    réponse écrite et la dispersion des porteurs.

- **O1 — le refus déclaré et le périmètre d'unicité écrit.**
  1. *P-e* : un alinéa opposable à `REGLES-PROJET.md` §B énonce ce qui n'est **pas**
     paramétrable et pourquoi, en trois classes motivées : les **identifiants stables**
     (`TF-\d{4}`, `INS-\d{4}`, ids `R-xx` et `D-xx`) parce que leur unicité et leur séquence
     sont des garanties de registre contrôlées par `oracle-todo` R2 et `oracle-insatisfactions`
     I1, et que le §3 bis interdit de déplacer un identifiant consommé sans table de
     correspondance ; le **motif daté des livrables** parce que la règle 18 fonde la
     lisibilité de la boîte d'entrée sur son unicité (19 lots, 9 produits, un dossier) ; les
     **familles d'`output\`** parce que D-15 les a tranchées par alignement pour éviter la
     re-migration.
  2. *P-a* : le même alinéa renvoie à ce qui **est** déjà paramétrable, avec ses chemins —
     le bloc `nommage` des profils de `quality-oracles` (deux profils, versionnés) et le
     patron `[gates]` de R-33 bis — de sorte qu'un utilisateur aux conventions propres sache
     par où passer, et que le demandeur reçoive une réponse et non un refus.
  3. *P-d* : les deux porteurs du texte caduc sont alignés sur C1 — geste déjà porté par le
     verdict de TF-0319, cité ici pour ne pas être compté deux fois.
  *Coût* : ¼ j, 1 dépôt (pilot), 2 fichiers, aucun objet durable créé (R-31 non déclenchée),
  aucune écriture dans un dépôt frère. *Ce qu'elle exclut* : toute préférence nouvelle — un
  entrant qui exige un autre nommage reste régi par l'alinéa RV-2, avec son arbitrage
  consigné au ledger.

- **O2 — le profil de nommage étendu aux contrôles du pilot.** `oracle-conformite-projet` lit
  le bloc `nommage` d'un profil au lieu de sa constante `MOTIF_DATE` l.37, défaut = profil
  `digit-ai`. *Coût* : ~½ j, 1 dépôt, plus des fixtures à double sens (R-31 al. 2, invariant
  I1 de R-35). *Ce qu'elle exclut* : les dossiers, les formats de date et les formats de
  version — soit trois des quatre dimensions que l'item nomme ; et 6 des 8 porteurs restent
  en dur, dont 3 dans des dépôts frères. On paramètre un consommateur sur quatre et on crée
  une dépendance du pilot vers un fichier de forge-agents, là où la table de routage
  (`CONTRAT-INTERFACE.md` §5) ne prévoit pas cette lecture.

- **O3 — le fichier de préférences unique lu par les générateurs ET les contrôles.** Le
  contenu de la piste de l'item : un `conventions.json` du pilot (dossiers, nommages, formats
  de date, formats de version), surcharge par produit, les 8 porteurs migrés, plus un
  contrôle de cohérence entre préférence déclarée et artefacts produits. *Coût* : estimation
  2 à 3 j sur 4 dépôts, dont 3 frères — donc 3 mandats humains ; `conventions.json` devient
  un référentiel à identifiants, donc `CONTRAT-INTERFACE.md` §3 bis s'applique (table de
  correspondance versionnée à chaque évolution) et R-31 exige oracle propre, fixtures à
  double sens et surfaces d'intégration livrées le jour même. *Ce qu'elle exclut* : la
  garantie qu'une convention n'a qu'une valeur. Elle crée une seconde vérité par convention
  (le texte normatif et le paramètre), et le seul conflit réel de l'histoire du corpus a
  précisément été réglé par le contraire (D-15 al. c, « zéro re-migration »). Mise en regard
  du compteur mesuré — 1 arbitrage sur 1 637 événements de registre — 2 à 3 j et 3 mandats
  achètent la résolution d'un problème qui s'est présenté une fois et qui est déjà tranché
  par RV-2.

- **O4 — les conventions déclarées par produit, sans paramètre central.** Chaque produit
  déclare ses conventions dans `docs\projet\PARAMETRAGE.md` (patron R-33 bis étendu) et les
  contrôles jugent contre elles. *Coût* : ~1,5 j, plus la mise à jour du gabarit
  `docs-projet\PARAMETRAGE.md` et de R-22. *Ce qu'elle exclut* : l'unicité transverse, et la
  perte est chiffrée — la boîte d'entrée du pilot recevrait jusqu'à 9 conventions de lots au
  lieu d'une, sur les 19 lots mesurés. `oracle-boite-entree` continuerait de fonctionner (il
  apparie par sidecar, pas par nom), mais la règle 18 dit ce qui se perd : « le nom dit qui
  retourne quoi ». C'est la seule option dont le coût est supporté par l'humain qui lit, ce
  qui est le contraire du besoin exprimé.

## 5. Verdict

- **Option retenue** : **O1**.
- **Motif du choix, en une phrase mesurable** : le coût réellement payé par l'absence de
  paramètre est **1 arbitrage sur 1 637 événements de registre**, déjà fermé par l'alinéa
  RV-2, tandis que la convention unique porte une valeur mesurée (19 lots de 9 produits
  lisibles dans un dossier) et qu'une dimension sur quatre est **déjà** paramétrable
  (profils `nommage`, deux profils versionnés) — O1 répond à la question posée pour ¼ j,
  O3 achèterait pour 2 à 3 j et 3 mandats la résolution d'un problème qui s'est présenté une
  fois.
- **Coût** : ¼ j. Pilot seul : un alinéa à `REGLES-PROJET.md` §B (les trois classes non
  négociables et leurs motifs, plus les deux points de paramétrage existants avec leurs
  chemins). Aucun objet durable, aucun contrôle neuf, aucune fixture due, aucun dépôt frère
  touché. Dette assumée et déclarée : les 8 porteurs de constantes restent indépendants — si
  une convention change un jour, le changement se fera à 8 endroits, et cette étude ne le
  cache pas.
- **Ce que le verdict refuse explicitement** : le système de préférences (O3), sa version par
  produit (O4) et son amorce partielle (O2). Ce refus est écrit ici, avec ses motifs
  chiffrés, pour être opposable et révisable — pas pour clore la question par omission.
- **Candidature(s) émise(s)** : aucune candidature nouvelle — TF-0322 porte l'objet et reste
  en `candidat` jusqu'à décision humaine. La correction des deux porteurs du texte caduc est
  déjà portée par le verdict de TF-0319 : ne pas la compter deux fois.
- **Plan de revue** : **2026-11-17** (trois mois). Deux mesures, toutes deux chiffrables sur
  pièces : (1) nombre d'arbitrages de convention consignés au ledger depuis le 17/08 (champ
  `note_nommage` ou équivalent) — **si ce nombre atteint 2**, O2 puis O3 se réinstruisent sur
  une mesure et non sur une préférence, le compteur ayant alors triplé en trois mois ;
  (2) nombre de valeurs divergentes pour une même convention dans les textes normatifs du
  pilot (aujourd'hui 1 : la graphie et le versionnement de `old\`, en cours de correction ;
  cible 0).

## Non jugé par cette étude

- La justesse de chaque convention en vigueur : cette étude juge le régime des conventions
  (gravé ou paramétrable), pas la valeur de telle convention.
- Le renommage du pilot demandé par TF-0317, qui est une préférence de nom d'objet et non un
  régime de convention : instruit séparément.
- Le paramétrage des conventions internes aux fichiers (Q4), déclaré « ouvert **côté
  organization** — pas une décision pilot tant qu'aucune proposition n'est remise »
  (`REGLES-PROJET.md` §G).
