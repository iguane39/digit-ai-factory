# Étude d'opportunité — la mise à jour des forges transporte le code, pas la consigne (TF-0320) — 20260817e

## Seuil de déclenchement (vérifié AVANT d'écrire)

TF-0320 franchit le seuil TF-0155 sur deux critères, chacun vérifiable :

1. **Crée un objet durable** (R-31) — les pistes de l'item nomment « un journal de règles
   versionné et lisible par machine côté forges », c'est-à-dire un **référentiel à
   identifiants** au sens de `CONTRAT-INTERFACE.md` §3 bis, plus un contrôle si l'option
   contraignante est retenue.
2. **Touche ≥ 3 forges ou le noyau** — le mécanisme visé est celui de `CLAUDE.md`
   §Fraîcheur (« pull pilot `--ff-only` + `node bootstrap.mjs --pull` ; versions au ledger
   (R-19) »), donc le noyau et les 13 forges du bootstrap.

Score au registre : gain 4 · preuve 3 · effort 3 · valeur 4. **`preuve_du_cout` est `null`** :
l'item est déclaré sans coût payé en réel. Cette étude en tient compte comme d'une contrainte
d'honnêteté, pas comme d'un détail de forme — une construction ne se justifie pas par un
risque bien raconté.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas. Ses
deux pistes — « un journal de règles versionné et lisible par machine côté forges (id de
règle, version, delta, date d'entrée en vigueur), restitué au produit à l'ouverture de run
avec le diff depuis la version qu'il portait au ledger » et « le choix entre information (le
produit lit) et contrainte (un oracle refuse d'ouvrir le run sur une version de règles
périmée) » — sont examinées comme options, aucune adoptée par le seul fait d'être écrite.

Sources de la proposition : **TF-0320** (`todo\TODO.jsonl`, créé le 2026-08-17T10:10:02Z,
statut `candidat` ; demandeur « humain (Sébastien) — demande directe en session pilot » ;
source « demande directe du 16/08/2026, 5 idées à travailler quand le crédit le permettra » ;
forges cibles initiales `["pilot","digit-ai-forge-organization"]`). L'item se termine par un
constat que cette étude vérifie : « Le ledger porte déjà les versions : il donne le point de
comparaison, il ne raconte pas encore le contenu du changement. »

## 1. Partition du problème

- **P-a — Le point de comparaison.** Le ledger porte-t-il réellement une valeur comparable
  par machine ? C'est le préalable de toute restitution de delta : sans point de départ
  normalisé, il n'y a pas de diff à calculer.
- **P-b — L'objet du changement.** Où vivent les règles, et une règle porte-t-elle une
  version ? Un delta suppose un objet versionné, pas seulement un texte daté.
- **P-c — Le canal de restitution.** Qui dit quoi au produit à l'ouverture de son run, et
  sous quelle forme (lecture humaine, ligne de ledger, verdict d'oracle) ?
- **P-d — Information ou contrainte.** Un écart de version de règles informe-t-il, ou
  bloque-t-il l'ouverture ? La question est posée par l'item, elle est décidable
  indépendamment des trois précédentes.
- **P-e — Le cas « personne ne la lui fait payer ».** L'item nomme deux régimes distincts :
  la règle qu'un oracle finit par faire payer, et la règle qu'aucun contrôle ne tient. Les
  deux n'appellent pas le même remède.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `CLAUDE.md` §Fraîcheur + `bootstrap.mjs` l.85-92 | « à l'ouverture de tout run — pull pilot `--ff-only` + `node bootstrap.mjs --pull` ; versions au ledger (R-19) » ; le code exécuté est `run("git", ["pull","--ff-only"], dest)` et une ligne d'état par forge | recouvre le TRANSPORT du code et rien d'autre — le constat fondateur de l'item est exact sur pièces : aucune synthèse de changement n'est produite ni lue |
| `oracles\oracle-conformite-projet.mjs` l.344-353 (R-19) | `if (!v \|\| typeof v !== "object" \|\| !Object.keys(v).length) ko("R-19", …, "run_open sans versions_forges")` | recouvre la PRÉSENCE d'un point de comparaison (objet non vide) ; ne juge ni son contenu, ni sa complétude, ni sa forme — donc ne le rend pas comparable |
| `_Nhood\Approval2\forge\ledger.jsonl` seq 1 | `"versions_forges": {"conception": "aabc448", "design": "d74c957", "development": "c177c6a", "tests": "18c3947", "agents": "c650ae5"}` — 5 clés, noms courts | P-a en défaut sur pièces : 5 forges sur 13, clés en noms courts — R-19 rend PASS |
| `_Nhood\SCC_ALX\forge\ledger.jsonl` seq 1 | `"versions_forges": {"digit-ai-forge-pilot": "3b18fff", "digit-ai-forge-data": "da1e9a4", …}` — 14 clés, noms de dépôt complets | P-a en défaut confirmé : deux conventions de clés incompatibles cohabitent, toutes deux PASS R-19 — un diff machine sur ce champ n'est pas calculable aujourd'hui sans normalisation préalable |
| `CONTRAT-INTERFACE.md` §3 bis | « Tout référentiel dont les éléments portent des identifiants consommés par ailleurs … obéit à la même loi : une évolution qui déplace ou retire des identifiants embarque une **table de correspondance versionnée** … et les consommateurs refusent un artefact dont la version de référentiel diffère de la leur sans table applicable » | la LOI existe déjà et couvre exactement le besoin — les ids `R-xx` sont consommés ailleurs (`REGLES-PROJET.md` l.11-12 : « chaque n° de règle est un n° de finding ») ; ce qui manque n'est pas la loi mais sa **déclinaison** pour `REGLES-PROJET.md`, absente de la liste des déclinaisons existantes du §3 bis |
| `REGLES-PROJET.md` en-tête et l.13 | « # Règles projet — DÉCIDÉES le 2026-08-06 » … « Rattrapage des projets existants : au prochain run de version de chacun » | recouvre entièrement P-d dans le sens de l'INFORMATION : la politique d'entrée en vigueur est déjà décidée — une règle nouvelle s'applique au prochain run de version, pas immédiatement ; un blocage d'ouverture contredirait ce texte |
| `REGLES-PROJET.md` structure des 38 règles | ni version de corpus ni version par règle : les évolutions sont narratives dans le texte — « **Amendement TF-0158 (13/08)** », « **Amendement RV-9 (14/08, lot SCC_ALX)** », « **R-7 inversée le 13/08 par TF-0150** » | P-b en défaut : le corpus est daté et raconté, jamais versionné ; un consommateur ne peut pas savoir ce qui a changé sans relire les 525 lignes |
| Tags annotés de l'écosystème (`git tag --sort=-creatordate`, 13 forges + pilot) | `v1.16.0` (2026-08-15) « restitution lisible : doctrine (referentiel, gabarit, oracle RL, D8) … » · `v1.15.0` (2026-08-15) « ce qui s'exécute est enfin ce qui est versionné » · `v1.14.0` (2026-08-15) « un contrôle qui existe sans être joué n'existe pas » | un journal de changements EXISTE déjà, synchronisé sur tous les dépôts, et nomme même la règle par sa maxime ; il est narratif, par vague, et arrêté au 15/08 — R-38 (17/08) n'y figure pas : le canal existant a 2 jours et 1 règle de retard |
| `BOUCLE-AMELIORATION.md` | 1 605 lignes, 44 entrées de campagne, dont « Campagne du 17/08/2026 (2e vague) — … R-38 née d'un lot du matin » | recouvre le récit exhaustif et daté de tous les changements ; document du pilot, jamais restitué au produit, non lisible par machine — c'est le journal que l'item cherche, dans la mauvaise forme et au mauvais endroit |
| `oracles\oracle-skills.mjs` K1-K6 + `references\ETAPES-RUN.md` §1 | « skills ET hooks exécutés = versionnés ? (K1-K6, TF-0290) » ; mesure du 15/08 : « sur 20 skills versionnés, 4 divergeaient et 5 n'étaient pas installés du tout » | recouvre l'écart entre CODE versionné et CODE exécuté, joué à l'ouverture de tout run et suspensif ; muet sur les règles écrites — même maladie, autre substrat |
| `output\03-etudes\20260817-etude-opportunite-ecart-servi-versionne.md` (verdict O3) + forge-ops O-7 | « `deployer` scelle une empreinte sha256 par release, **O-7** la compare au déployé » (`BOUCLE-AMELIORATION.md`, campagne du 17/08) | recouvre le raisonnement « comparer une empreinte scellée à ce qui est servi », déjà éprouvé et livré ; périmètre = produit déployé, aucune règle comparée |
| `oracles\oracle-fraicheur-doc.mjs` v2 + `oracles\fraicheur-claims.json` | « chaque claim confronte une affirmation comptable d'un document de pilotage à une sonde exécutable sur la source » | recouvre la fraîcheur COMPTABLE des documents de pilotage (un nombre cité contre un nombre constaté) ; ne suit aucune règle et n'a aucune notion de version |
| `REGLES-PROJET.md` §O (R-35) | « Tout contrôle livré … désigne **son appelant** au moment où il est écrit … Un contrôle sans appelant nommé n'est pas livré : il est en dette, et se déclare comme tel » | recouvre P-e en entier : le cas « personne ne la lui fait payer » est la maladie que R-35 traite déjà, par la déclaration de dette — TF-0320 n'a rien à ajouter sur ce volet |
| `REGLES-PROJET.md` §J amendement RV-9 (14/08) | « le snippet S-G1 que les implémenteurs copient, et **la fixture VERTE de l'oracle G1**, suivaient encore `prefers-color-scheme`. La preuve de conformité démontrait donc le comportement interdit » | seul coût de cette famille réellement payé et documenté : une règle amendée le 13/08 dont les PORTEURS n'avaient pas suivi, retournée par l'humain le 14/08. Il a été payé parce que les porteurs n'ont pas été mis à jour, pas parce qu'un journal manquait — un journal ne l'aurait pas évité |
| `gabarits\CLAUDE-PRODUIT.md` l.46 et `_Nhood\SCC_ALX\CLAUDE.md` l.46 | les deux portent « `Old\` jamais versionné », que `REGLES-PROJET.md` l.4-7 déclare **caduc** depuis le 13/08 (« C1 = `old\` … et **VERSIONNÉ** … l'ancien arbitrage "jamais versionné" est caduc ») | le défaut de TF-0320 est ici **dans les faits**, sous sa forme la plus dure : le gabarit copié dans chaque produit à l'ouverture de run transporte une consigne inversée quatre jours plus tôt, et un produit réel la porte |
| Ledgers des 5 produits réels | derniers `run_open` : Approval2 2026-08-11 · SCC_ALX 2026-08-13 · bourse-aux-vacants 2026-08-14 · nhood-cockpit-ia 2026-08-14 · COMPTA 2026-08-14 | R-35 (15/08), R-36 (15/08), R-37 (15/08) et R-38 (17/08) sont nées **après le dernier `run_open` de tous les produits sans exception** : 4 règles qu'aucun ledger produit ne mentionne — le fait est mesuré, son coût ne l'est pas |

## 3. État de l'art daté

**Non instruit** — motif : aucune campagne de recherche externe n'est mandatée, et la
question posée est interne à la forme des règles de cet écosystème. Les pièces datées qui
définissent le besoin ont toutes été lues ce jour : les deux ledgers produits (2026-08-11 et
2026-08-13), les tags annotés (2026-08-14 et 2026-08-15), les amendements narratifs de
`REGLES-PROJET.md` (2026-08-13 et 2026-08-14), les 5 derniers `run_open` (2026-08-11 à
2026-08-14). Une source externe sur la diffusion de politiques versionnées ne trancherait ni
P-a (la forme d'un champ de ledger interne) ni P-d, que `REGLES-PROJET.md` l.13 a déjà
tranchée. La revue de la section 5 confronte le verdict aux faits mesurés.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : RÉFUTÉE**, mais sur un coût de forme, pas sur un incident — la
  distinction est portée au verdict.
  - **Le point de comparaison que R-19 est censé garantir n'est pas comparable.** Deux
    ledgers réels portent deux conventions de clés inconciliables (`"conception"` chez
    Approval2, `"digit-ai-forge-conception"` chez SCC_ALX) et l'un ne relève que 5 forges
    sur 13 ; les deux sont PASS à R-19. La phrase de l'item — « le ledger donne le point de
    comparaison » — est fausse aujourd'hui : il donne deux points de comparaison de formes
    différentes et un troisième incomplet. Ce n'est pas un risque, c'est un défaut sur
    pièces d'un contrôle existant.
  - **Une consigne inversée circule.** `gabarits\CLAUDE-PRODUIT.md` l.46 dit « `Old\` jamais
    versionné » ; `REGLES-PROJET.md` l.4-7 déclare cet arbitrage caduc depuis le 13/08. Le
    gabarit est copié dans chaque produit à l'ouverture de run
    (`references\ETAPES-RUN.md` §1) et `_Nhood\SCC_ALX\CLAUDE.md` l.46 le porte à
    l'identique. Ne rien faire, c'est laisser ce mécanisme de diffusion opérer.
  - **4 règles sont nées après le dernier `run_open` de tous les produits** (R-35, R-36,
    R-37 le 15/08, R-38 le 17/08) et aucun ledger n'en porte trace.
  - Ce que O0 ne coûte PAS, et qui est dit ici : **aucun incident imputable à l'ignorance
    d'une règle nouvelle n'est documenté**. Le seul coût payé de la famille (RV-9, 14/08) a
    été payé par des porteurs non mis à jour, et corrigé par leur mise à jour. Le champ
    `preuve_du_cout` de TF-0320 dit `null` et cette étude ne le contredit pas.

- **O1 — le delta du texte, restitué à l'ouverture, sans référentiel neuf.**
  1. *P-a* : la forme de `versions_forges` est normalisée et rendue opposable — clés = noms
     de dépôt complets, les 13 forges du bootstrap **plus** le pilot, valeur = sha court.
     R-19 est étendu pour la juger (les deux ledgers existants deviennent des antériorités
     déclarées, jamais réécrites).
  2. *P-c* : à l'ouverture d'un run de version, le pilot joue
     `git -C <pilot> diff --stat <sha_precedent>..HEAD -- REGLES-PROJET.md gabarits\ references\`
     — le `sha_precedent` étant lu au `run_open` du ledger précédent, que R-19 chaîne déjà
     par `run_precedent` — et porte le résultat au ledger dans un champ dédié, lu par
     l'orchestrateur avant la première étape.
  3. *P-b et P-d* : aucun changement — les règles restent datées et non versionnées, la
     politique d'entrée en vigueur reste celle de `REGLES-PROJET.md` l.13 (au prochain run
     de version).
  *Coût* : ~½ j, 1 dépôt (pilot), aucun objet durable créé — donc R-31 n'est pas déclenchée
  et l'option ne paie pas le péage d'un référentiel de plus. *Ce qu'elle exclut* : les règles
  qui vivent hors du pilot — les `D-xx` d'organization, les contrats propres des forges, le
  référentiel de restitution de forge-design ; le delta ne voit que ce que le pilot versionne.
  *Ce qu'elle corrige au passage* : les deux porteurs de la consigne caduque (`gabarits\
  CLAUDE-PRODUIT.md` l.46, `references\ETAPES-RUN.md` §1), sans quoi le canal restituerait
  fidèlement une règle fausse.

- **O2 — le journal de règles machine-lisible, par forge.** Chaque forge publie un
  `regles.jsonl` (id, version, date d'effet, delta, appelant), le pilot le lit à l'ouverture
  et restitue le diff depuis la version du ledger. *Coût* : 14 dépôts à équiper, dont 13
  frères — donc autant de mandats humains (garde-fou du noyau) ; un référentiel à
  identifiants de plus, ce qui déclenche `CONTRAT-INTERFACE.md` §3 bis (table de
  correspondance versionnée à **chaque** évolution de règle) et R-31 (oracle propre, fixtures
  à double sens, surfaces d'intégration livrées le jour même). Estimation 2 à 3 j. *Ce qu'elle
  exclut* : rien fonctionnellement, mais elle crée un **troisième lieu** où une règle
  s'écrit, après le texte normatif et l'oracle qui la tient — et c'est précisément la
  double vérité que la loi transverse n° 4 et le §3 bis existent pour borner. La mesure du
  15/08 sur les skills (« 4 divergeaient et 5 n'étaient pas installés du tout » sur 20) dit
  ce qu'il advient d'un exemplaire de plus qu'aucun contrôle ne confronte.

- **O3 — la contrainte : refus d'ouverture sur version de règles périmée.** Un oracle
  suspend l'ouverture du run tant que le produit n'a pas acquitté le delta. *Coût* : ½ j
  au-dessus de O2, dont O3 dépend (sans version de règles, rien à comparer). *Ce qu'elle
  exclut* : la voie « information », et surtout elle contredit deux textes en vigueur —
  `REGLES-PROJET.md` l.13 (« Rattrapage des projets existants : au prochain run de version
  de chacun ») et le motif que R-33 bis oppose à l'armement d'office : « armer un gate que
  personne n'a exercé le ferait désarmer au premier faux positif — un gate qu'on apprend à
  contourner ne protège plus rien ». Sur un delta dont aucun coût n'est mesuré, c'est
  exactement le gate qu'on apprendra à contourner.

- **O4 — la règle devient une donnée.** `REGLES-PROJET.md` devient la projection d'un
  référentiel par règle (id, version, texte, mécanisme, appelant, date d'effet), et le delta
  se calcule sur les versions de règles, pas sur des lignes de texte. *Coût* : 2 à 3 j de
  construction plus la migration des 38 règles, et un générateur de vue à tenir. Appuyée en
  principe par la loi transverse n° 4 (« une donnée volatile est une donnée, pas du code »)
  et par le précédent des vues générées (R-20 : `ARCHITECTURE.md` projeté en
  `ARCHITECTURE.html`, « vues JAMAIS éditées à la main »). *Ce qu'elle exclut* : la
  rédaction libre — or ce que portent les règles actuelles n'est pas seulement un impératif,
  c'est le **cas fondateur** qui le rend applicable (R-37 tient parce qu'elle raconte le menu
  français compressé sur `digit-ai.fr` ; R-38 parce qu'elle raconte le rapport publié hors du
  poste). Réduire une règle à un champ retirerait ce qui la rend opposable en session.

## 5. Verdict

- **Option retenue** : **O1**.
- **Motif du choix, en une phrase mesurable** : O1 est la seule option dont le coût (~½ j,
  1 dépôt, zéro objet durable) reste inférieur au coût constaté (un champ de ledger
  non comparable, deux porteurs d'une consigne caduque), alors que O2 à O4 demandent 2 à 3 j
  et un référentiel de plus pour un risque dont `preuve_du_cout` dit `null`.
- **Coût** : ~½ j. Pilot seul : extension de R-19 (forme de `versions_forges`), un pas
  d'ouverture de run dans `references\ETAPES-RUN.md` §1, un champ de ledger documenté au
  `CONTRAT-INTERFACE.md` §3, correction des deux porteurs caducs, fixtures à double sens pour
  le nouveau volet de R-19 (invariant I1 de R-35). Dettes assumées et déclarées : le delta ne
  couvre pas les règles vivant chez les forges frères (P-b partiel) ; les règles restent
  datées et non versionnées ; les deux ledgers existants restent en antériorité, jamais
  réécrits.
- **Ce que le verdict refuse explicitement** : le journal de règles par forge (O2), la
  contrainte d'ouverture (O3) et la mise en données des règles (O4) — non parce qu'ils sont
  mal conçus, mais parce qu'aucun incident payé ne les appelle et que chacun crée un
  exemplaire de plus d'une règle. Ce refus est écrit ici pour ne pas être une omission (loi
  transverse n° 3) et sera rouvert par la mesure, pas par la préférence.
- **Candidature(s) émise(s)** : aucune candidature nouvelle — TF-0320 porte l'objet et reste
  en `candidat` jusqu'à décision humaine. Un reste à décider séparément, hors périmètre de
  cette étude : `catalogues\CATALOGUES.md` et les fiches de forge ne déclarent aucune version
  de règles, ce qui est cohérent avec le refus de O2.
- **Plan de revue** : **2026-10-17** (deux mois). Trois mesures, toutes chiffrables sur
  pièces : (1) nombre d'incidents imputables à l'ignorance d'une règle nouvelle ou amendée,
  relevés au ledger ou dans les lots de `input\00-retours\` — **si ce nombre atteint 1**,
  O2 se réinstruit sur un coût payé et non sur un risque ; (2) nombre de `run_open` postérieurs
  au 17/08 portant un `versions_forges` normalisé sur 14 clés, rapporté au nombre total (une
  valeur inférieure à 1 signale que la normalisation n'a pas pris) ; (3) nombre de textes du
  pilot portant encore une règle déclarée caduque (aujourd'hui 2, cible 0).

## Non jugé par cette étude

- La pertinence de chaque règle : cette étude juge la diffusion d'un changement de règle, pas
  le contenu des règles.
- Les règles portées par les forges frères (les `D-xx` d'organization, le
  `REFERENTIEL-RESTITUTION.md` de forge-design, les contrats de forge-tests) : leur mise en
  version relèverait de O2, refusé — leur diffusion reste assurée par les canaux existants
  (tags annotés, lots de retours, campagnes mandatées).
- L'opportunité d'un tag pour la vague du 17/08 : le retard du canal de tags est constaté
  (dernier tag `v1.16.0` du 15/08, R-38 née le 17/08), sa correction est un geste de
  scellage de campagne, pas un objet à instruire.
