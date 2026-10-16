# Étude d'opportunité — rangement des livrables destinés à l'humain dans `output\` (TF-0319) — 20260817d

## Seuil de déclenchement (vérifié AVANT d'écrire)

TF-0319 franchit le seuil TF-0155 sur deux critères indépendants, chacun vérifiable :

1. **Crée un objet durable** (R-31) — l'item demande explicitement « un oracle de rangement
   rejouable par toute forge » : un contrôle neuf, donc un objet durable au sens de
   `REGLES-PROJET.md` §K.
2. **Touche ≥ 3 forges ou le noyau** — périmètre déclaré `["pilot",
   "digit-ai-forge-organization"]`, portée réelle : les **13 forges du bootstrap + le pilot**
   (`oracles\oracle-ecosysteme.mjs` E0, exécuté ce jour : « source de vérité : 13 forge(s) au
   bootstrap ») **et** tout produit, via `REGLES-PROJET.md` règles 2 et 16.

Score au registre : gain 3 · preuve 3 · effort 2 · valeur 4,5 — la plus haute des 7
candidatures ouvertes (`todo\TODO.jsonl` : TF-0317 1 · TF-0318 2,7 · TF-0319 **4,5** ·
TF-0320 4 · TF-0322 2,3 · TF-0323 4 · TF-0324 3).

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas — en
particulier sa piste « un oracle de rangement rejouable par toute forge », qui est examinée
comme option parmi d'autres, jamais adoptée par le seul fait d'avoir été écrite.

Sources de la proposition : **TF-0319** (`todo\TODO.jsonl`, créé le 2026-08-17T10:10:02Z,
statut `candidat` ; demandeur « humain (Sébastien) — demande directe en session pilot » ;
source « demande directe du 16/08/2026, 5 idées à travailler quand le crédit le permettra »).
Antécédents lus en entier à l'archive : **TF-0149** (`todo\TODO-ARCHIVE.jsonl`, créé
2026-08-13T07:44:14Z, archivé 2026-08-13T08:17:36Z) et **TF-0150** (versionnement de `old\`).
Décision de convention correspondante, lue chez la forge gardienne des `D-xx` en **lecture
seule** : `digit-ai-forge-organization\decisions\D-15.md`.

## 1. Partition du problème

Découpage exhaustif et disjoint ; chaque option de la section 4 se rattache à une partition.

- **P-a — La frontière.** Qu'est-ce qu'un livrable destiné à l'humain, par opposition à un
  artefact de travail ? C'est la seule question difficile, et l'item le dit lui-même. Elle
  n'est pas décidable depuis un chemin ni depuis un nom.
- **P-b — La portée.** Les règles de rangement existantes visent les **produits**. Un dépôt
  de **forge** n'a aujourd'hui aucune obligation de rangement opposable : 9 des 14 dépôts
  d'écosystème n'ont même pas de dossier `output\`.
- **P-c — La structure interne d'`output\`.** Familles numérotées, une version courante à la
  racine, `old\` par famille, `LISEZMOI.md` de correspondance : décidé le 13/08, jamais
  mécanisé.
- **P-d — L'appelant (R-35).** Quel contrôle, joué par qui et à quel moment, dénonce un
  livrable écrit hors d'`output\` ? Sans appelant nommé, la règle est une décoration.
- **P-e — L'unicité du texte.** La même notion de rangement s'écrit aujourd'hui dans
  plusieurs documents du pilot, dont deux portent encore un arbitrage déclaré caduc.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `REGLES-PROJET.md` §A règle 2 | « `output\` existe ; tout livrable généré destiné à l'humain y vit (rapports, PV, exports). Précision D-06 : un document *normatif* (doctrine, gabarit, registre) n'est pas une sortie — il vit à la racine ou dans `docs\` » | recouvre la RÈGLE pour un produit, et pose déjà la frontière P-a côté doctrine ; muette sur les dépôts de forge, et son mécanisme déclaré (P0+O) ne va pas au-delà du dossier |
| `oracles\oracle-conformite-projet.mjs` l.81 | `for (const [n, d] of [["R-1","input"],["R-2","output"],["R-3","docs"]]) existsSync(p(d)) ? ok(n, d+"/", "présent") : ko(...)` | ne recouvre PAS P-d : le contrôle juge la PRÉSENCE du dossier, jamais la LOCALISATION d'un livrable — un rapport laissé sous `forge\etapes\` laisse R-2 en PASS |
| `oracles\oracle-conformite-projet.mjs` l.317-320 (R-16) | `if (!existsSync(p("forge","DOSSIER-MEP.md"))) so("R-16", …)` puis recherche `/MEP/i` dans `output\` | recouvre la copie du SEUL dossier de MEP ; les « PV, revues » que la règle 16 nomme ne sont jamais cherchés, et l'absence de `DOSSIER-MEP.md` rend le contrôle SANS_OBJET |
| `REGLES-PROJET.md` §F règle 16 | « Les rapports finaux destinés à l'humain (DOSSIER-MEP, PV, revues) sont **copiés** dans `output\` au nommage daté — l'original de travail reste sous `forge\etapes\` » — colonne Mécanisme : **S** | recouvre la doctrine ET la frontière P-a (original de travail vs copie remise) ; son mécanisme est « S » (vérification pilot), donc sans appelant machine : R-35 la classe en dette |
| `digit-ai-forge-organization\decisions\D-15.md` §Décision (a)…(e) | familles `01-<famille>\`, une seule version courante à la racine, `old\` minuscule par famille, noms inchangés, « `LISEZMOI.md` de mapping obligatoire » | recouvre entièrement P-c ; son propre frontmatter `oracle:` dit « non mécanisée à ce jour … à instrumenter dans une prochaine campagne » |
| `digit-ai-forge-organization\oracles\oracle-conventions.mjs` `SANS_OBJET` D-01 | « `output/` réservé aux livrables vs `dist/` = artefact de build : distinguer les deux suppose de lire le CONTENU du dossier, pas son chemin — non mécanisable depuis un balayage de noms » | ne recouvre pas P-a : il la DÉCLARE non mécanisable par le nom seul — c'est le verrou à lever, et la preuve qu'un contrôle par motif de nom a déjà été refusé en connaissance de cause |
| `digit-ai-forge-organization\oracles\oracle-conventions.mjs` `NON_JUGE` | « les fichiers non datés — distinguer un livrable d'un fichier de travail suppose de lire (D-02 ne s'impose qu'aux fichiers datés) » | même verrou, déclaré côté non-jugé : deux formulations indépendantes du même constat, aucune n'ouvre de voie |
| `digit-ai-forge-organization\output\02-composants\gate-conventions\INSTALLATION.md` | « **Rien n'a été installé.** Ce composant est **PROPOSÉ** … Aucune écriture n'a eu lieu hors de ce dépôt » | un appelant à l'écriture existe, packagé, invocable en pre-commit — jamais installé nulle part : P-d reste entier, et l'installation est une décision humaine |
| `output\03-etudes\20260817-etude-opportunite-publication-livrables.md` et `REGLES-PROJET.md` §R al. 1 | « Un livrable est un **fichier autoportant sur disque**, à l'emplacement du produit » | recouvre le CANAL (publier hors du poste) et affirme « à l'emplacement du produit » sans définir cet emplacement ; ne recouvre ni P-b ni P-c ni P-d |
| `references\ETAPES-RUN.md` §1 | « un livrable remplacé migre dans `Old\` (**jamais versionné**) » | contredit `REGLES-PROJET.md` l.4-7 : « C1 = `old\` (minuscule — graphie D-15) autorisé pour les livrables et **VERSIONNÉ** … l'ancien arbitrage "jamais versionné" est **caduc** » — P-e sur pièces, 4 jours après l'arbitrage |
| `gabarits\CLAUDE-PRODUIT.md` l.46 | « `output\`/`docs\`, `Old\` jamais versionné, `.env` jamais committé » | deuxième porteur du texte caduc, et le plus coûteux : ce gabarit est copié dans CHAQUE produit à l'ouverture de run (`references\ETAPES-RUN.md` §1) — `_Client-A\Produit-10\CLAUDE.md` l.46 le porte à l'identique |
| `oracles\oracle-boite-entree.mjs` (B1-B3) | joué à l'ouverture de tout run (`references\ETAPES-RUN.md` §1 : « un lot est-il arrivé sans être pris ? ») | recouvre le rangement de l'ENTRANT — un lot déposé et non traité est dénoncé et suspend l'ouverture ; la symétrie de sortie n'existe pas : aucun contrôle ne dénonce un livrable non rangé |
| `oracles\oracle-ecosysteme.mjs` E1-E7 | « Source de vérité UNIQUE : la liste FORGES de `bootstrap.mjs` — toute forge qui y entre devient exigible partout » ; E5 lit déjà `output\` « ni ses sous-dossiers » comprise | ne recouvre pas le rangement, mais fournit l'appelant manquant côté FORGES : le seul contrôle du pilot dont le périmètre soit l'écosystème entier, déjà PASS sur 13 forges |
| `catalogues\CATALOGUES.md` cat-org-01 | « oracle-conventions mécanise D-02/03/04/05/06/09/10 et déclare SANS_OBJET motivé les 5 restantes » | recouvre le catalogue de ce qui est mécanisé : D-15 n'y figure pas, ce qui confirme le trou sans supposition |

## 3. État de l'art daté

**Non instruit** — motif : aucune campagne de recherche externe n'est mandatée pour cet
item, et le besoin est entièrement défini par des pièces internes datées et vérifiées ce
jour (D-15 du 2026-08-13, TF-0149 et TF-0150 à l'archive du 2026-08-13, les 14 recouvrements
potentiels de la section 2, tous lus dans les fichiers cités). Les conventions de rangement
de livrables sont propres à un écosystème : une source externe ne trancherait pas P-a, qui
est la seule question difficile. La revue datée de la section 5 confronte le verdict aux
faits mesurés, sans détour par une recherche externe.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : RÉFUTÉE.** Coût du statu quo, cité et compté sur pièces :
  - **7 livrables datés vivent hors d'`output\`** dans les dépôts d'écosystème (recensement
    exécuté ce jour ; `input\`, `Old\`, `old\` et les dossiers `fixtures\` exclus car ils
    portent des violations volontaires) : `digit-ai-forge-conception\Digit-AI - CDC Forge -
    Conception & PRD - 20260804a.md` · `digit-ai-forge-conception\Digit-AI - Prompt Forge -
    Conception & PRD Cadrage - 20260804a.md` · `digit-ai-forge-audit_client-a\Digit-AI - Schema
    Architecture - Forge Audit - 20260712a.html` · `digit-ai-forge-design\demo\Digit-AI -
    Maquette Bailleur - Interventions - 20260804a.html` · et les 3 documents datés à la
    racine de `digit-ai-forge-organization`, dont le statut (doctrine au sens de D-06, donc
    légitime à la racine, ou livrable, donc dû à `output\`) n'est déclaré nulle part — P-a
    non tranchée produit une ambiguïté qu'aucun lecteur ne peut lever.
  - **9 des 14 dépôts d'écosystème n'ont aucun `output\`** (agents-security, audit,
    conception, data, development, observability, ops, tests, websec) : un livrable produit
    par l'une de ces forges n'a, littéralement, aucun endroit prévu.
  - **L'`output\` du pilot lui-même est en écart avec D-15**, non détecté : deux familles
    portent le même numéro (`05-catalogues-readmes-forges\` et `05-insatisfactions\`, écart
    à D-15 al. a) et `output\LISEZMOI.md` ne mentionne pas la seconde (0 occurrence,
    vérifié) alors que le registre `todo\TODO.jsonl` cite des chemins d'insatisfactions
    (écart à D-15 al. e). L'auteur de la règle la viole sans le savoir depuis que la famille
    a été créée.
  - **Le rappel écrit s'est déjà perdu une fois.** `D-15.md` §Conséquences demandait « À
    consigner comme candidature TODO-FORGE côté pilot » et `REGLES-PROJET.md` l.119 note
    « mécanisation de D-15 dans `oracle-conventions` = candidat » : **aucun item du registre
    ne la porte** (recherche sur 1 596 événements d'archive et 41 événements courants — les
    deux seules mentions de D-15 sont TF-0149 et TF-0150). TF-0319 est cette candidature qui
    revient 4 jours plus tard par la voie humaine, c'est-à-dire au prix d'une demande
    humaine au lieu d'un mécanisme. C'est exactement la loi transverse n° 3 (« l'oubli
    n'existe pas ») prise en défaut.
  - Ne rien faire reconduit les cinq constats, et l'écart s'agrandit à chaque livrable.

- **O1 — la règle seule, étendue aux forges.** Amender la règle 2 pour couvrir les dépôts de
  forge et non les seuls produits, corriger les deux textes caducs (P-e), sans écrire de
  contrôle. *Coût* : ¼ j, 3 fichiers du pilot, aucun dépôt frère. *Ce qu'elle exclut* :
  l'appelant (P-d) — donc elle rejoue à l'identique la séquence 13/08 → 17/08, où une
  décision écrite (D-15) et catalogée n'a produit aucun effet et a même perdu sa propre
  candidature de mécanisation. Le coût de O0 démontre que ce chemin a déjà été essayé.

- **O2 — contrôle par le NOM seul.** Un oracle déclare FAIL tout fichier au motif daté
  (`- AAAAMMJJ<indice>.<ext>`) trouvé hors d'`output\`. *Coût* : ½ j, 1 dépôt. *Ce qu'elle
  exclut* : P-a — elle condamnerait les entrants d'`input\` (déjà 12 fichiers datés chez
  agents, audit_client-a, development, pilot), les fixtures d'oracles, et les documents
  normatifs que D-06 place explicitement à la racine. C'est le faux positif que
  `oracle-conventions.mjs` a refusé de produire en le déclarant `SANS_OBJET` D-01 ; le
  reproduire chez le pilot serait décider contre un constat déjà écrit.

- **O3 — la frontière se DÉCLARE, le contrôle la vérifie.**
  1. *P-a* : un livrable destiné à l'humain porte une marque explicite — pour un document
     Markdown ou HTML, une clé de frontmatter (`destinataire: humain`) ; pour un livrable
     produit dans un run, l'événement de ledger qui l'annonce (le champ
     `livrable_attendu` existe déjà : `_Client-A\Produit-10\forge\ledger.jsonl` seq 1 le porte).
     Ce qui n'est pas marqué n'est **jamais** jugé : zéro faux positif par construction, et
     le verrou D-01 est levé sans avoir à deviner ce que contient un fichier.
  2. *P-b + P-c + P-d* : deux appelants déjà joués reçoivent les contrôles.
     Côté produit, `oracle-conformite-projet` (joué à l'ouverture ET rejoué avant
     `run_close`, `references\ETAPES-RUN.md` §1) reçoit : tout artefact marqué vit sous
     `output\<NN>-<famille>\`, et les quatre contrôles de D-15 (numérotation unique des
     familles, une seule version courante par famille, `old\` minuscule,
     `LISEZMOI.md` présent dès qu'un chemin antérieur est cité ailleurs). Côté forge,
     `oracle-ecosysteme` (périmètre = les 13 forges du bootstrap) reçoit les mêmes contrôles
     et l'exigence d'un `output\` dès qu'un artefact marqué existe dans le dépôt.
  3. *P-e* : les deux textes caducs sont alignés sur C1, et le marquage naît dans les
     **gabarits** du pilot (`RESTITUTION.md`, `ETUDE-OPPORTUNITE.md`, `INSATISFACTION.md`,
     `docs-projet\`), pas dans la main de l'agent — sans quoi le marquage serait à son tour
     une affordance non câblée (loi transverse n° 1).
  *Coût* : ~1 j. Écritures du pilot seules pour les points 2 et 3 ; le point 1 et la
  mécanisation de D-15 chez `oracle-conventions` exigent un **mandat humain** pour écrire
  chez `digit-ai-forge-organization` (garde-fou du noyau). *Ce qu'elle exclut* : le
  rattrapage rétroactif des 7 livrables constatés (antériorité déclarée, comme les 14 forges
  antérieures à R-31 le sont pour E8) et le rangement des produits legacy, hors périmètre.
  *Risque nommé* : un producteur qui oublie de marquer échappe au contrôle — faux négatif
  assumé, mesuré à la revue (section 5) par le rapport entre livrables marqués et livrables
  déposés.

- **O4 — un verbe de dépôt unique.** Un script `deposer-livrable` qui range, nomme, met
  l'ancienne version en `old\`, met à jour le `LISEZMOI.md` et journalise ; écrire un
  livrable ailleurs devient un geste qu'aucun producteur n'a de raison de faire. *Coût* :
  1,5 à 2 j pour le verbe, plus la migration de tous les producteurs existants (générateurs
  de rapports de seo, audit, tests, moteur `rapport-engine.mjs` de forge-audit) — dette de
  migration non mesurée, répartie sur des dépôts frères, donc autant de mandats. *Ce qu'elle
  exclut* : tout jugement de l'existant — un verbe qui range bien ne dit rien des 7 livrables
  déjà mal rangés, ni des 9 forges sans `output\`. Elle ne remplace pas O3, elle s'y
  ajouterait plus tard si la mesure de la revue montre un taux de marquage insuffisant.

## 5. Verdict

- **Option retenue** : **O3**.
- **Motif du choix, en une phrase mesurable** : O3 est la seule option qui donne un appelant
  déjà joué à une règle déjà écrite (les 5 constats de O0 deviennent détectables) sans
  produire le faux positif que O2 rouvrirait et que `oracle-conventions.mjs` a documenté
  comme refusé.
- **Coût** : ~1 j. Pilot : 2 nouveaux findings d'`oracle-conformite-projet`, 4 contrôles
  D-15 dupliqués côté `oracle-ecosysteme`, marquage porté dans 4 gabarits, alignement de
  `references\ETAPES-RUN.md` §1 et `gabarits\CLAUDE-PRODUIT.md` l.46 sur C1. Fixtures à
  double sens exigées par R-31 al. 2 et par l'invariant I1 de R-35 (sans quoi
  `oracles\self-tests.mjs` échoue à l'ouverture du run suivant, ce qui est le comportement
  voulu). Dette assumée et déclarée : le faux négatif du non-marquage ; le rattrapage des
  7 livrables antérieurs ; la mécanisation de D-15 chez organization, suspendue au mandat.
- **Candidature(s) émise(s)** : aucune candidature nouvelle — TF-0319 porte déjà l'objet et
  reste en `candidat` jusqu'à décision humaine. Deux dépendances à décider explicitement,
  car aucune ne relève du pilot seul : (a) mandat d'écriture chez
  `digit-ai-forge-organization` pour mécaniser D-15 dans `oracle-conventions.mjs` ; (b)
  sort du `gate-conventions.mjs` proposé le 12/08 et jamais installé — l'installer donnerait
  un appelant à l'écriture, ne pas l'installer se déclare comme dette, jamais par silence.
- **Plan de revue** : **2026-09-17** (un mois). Trois mesures, toutes chiffrables sur
  pièces : (1) nombre de livrables marqués `destinataire: humain` déposés depuis le 17/08,
  rapporté au nombre de livrables réellement déposés dans les `output\` — un rapport
  inférieur à 1 mesure le faux négatif et rouvre O4 ; (2) nombre de FAIL rendus par les
  nouveaux contrôles, séparés en vrais et faux positifs — un seul faux positif rouvre la
  frontière P-a ; (3) nombre de forges parmi les 9 sans `output\` qui en ont créé un, et
  nombre d'écarts D-15 résiduels dans l'`output\` du pilot (aujourd'hui 2 : la collision
  `05-` et le `LISEZMOI.md` incomplet).

## Non jugé par cette étude

- La justesse du marquage lui-même : qu'un producteur qualifie correctement son artefact de
  livrable pour humain relève de la relecture, pas d'un contrôle de forme.
- Le rangement des produits legacy et des dépôts hors écosystème (`c:\dev` compte des dépôts
  qui n'ont jamais été forgés) : R-37 al. 3 fixe déjà le principe du rattrapage au premier
  contact, cette étude ne l'étend pas.
- Le contenu des `old\` : archive gelée, jamais renommée (`oracle-conventions.mjs`
  `NON_JUGE`).
