# Retours forges — digit-ai-forge-agents — 20260907a

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260907a` (deux items, TF-0880 puis TF-0855,
  confiés comme un seul lot), reçu dans `input\00-travaux\` de la forge et joué sur mandat humain
  du 07/09/2026 (action A-58, décision D-24 (a)). L'ordre recommandé par le lot a été tenu : la
  frontière d'abord, les cinq mentions ensuite. Le lot déposé porte désormais `traite le 2026-09-07`.
- **Références ledger** : aucune — le dépôt `digit-ai-forge-agents` ne porte pas de
  `forge\ledger.jsonl` (c'est une forge, pas un produit instancié). La preuve tient aux deux commits
  `32cd320` et `0de710c`, **faits localement sur `main` et NON POUSSÉS**, et aux recettes rejouées
  citées ci-dessous. Le non-push n'est pas un constat : il est la consigne du lot, le pilot
  réécrivant l'histoire de cette forge avant de publier.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-07

## Ce que le lot de travaux a produit

Le lot confiait deux items dans un ordre justifié — la frontière d'abord, parce qu'elle rend la
mesure du second lisible — et les deux sont faits dans cet ordre, en deux commits. Le tableau qui
suit dit, pour chaque partie demandée, ce qui a été écrit et par quelle preuve exécutée elle se
vérifie ; les mesures rouges, les comptes et les écarts viennent juste en dessous. Il se lit une
ligne à la fois : la colonne du milieu est le geste, celle de droite le verdict qui l'atteste.

| Partie du lot | Ce qui a été fait | Preuve exécutée |
|---|---|---|
| **TF-0880** (1) la graphie littérale gagne la frontière des variantes | `porteProduit()` ne teste plus `hay.includes(cle)` : une fonction `litteralProduit()` compile, par clé, la graphie échappée encadrée de `(?<![A-Za-z0-9])` et `(?![A-Za-z0-9])`, sensible à la casse et sans le drapeau `g` — pour la raison exacte déjà écrite pour les variantes. | Porte rejouée sur cette forge : **8 constats C5 → 5**, les trois blobs éteints. |
| **TF-0880** (2) l'arbitrage du pilot, appliqué tel qu'il est tranché | Une clé purement alphanumérique se borne ; une clé qui porte déjà un séparateur se cherche telle quelle — ses séparateurs restent littéraux, elle n'est pas dérivée — mais bornée aux deux bouts de la même façon. Les deux cas tiennent dans **une** expression : la clé échappée, encadrée des deux gardes. Le comportement des variantes multi-mots n'est pas touché. | La table porte 61 clés, dont 45 chemins de disque que C5 ignore : **16 clés sont jugées**, 10 par leurs variantes (chemin inchangé) et 6 par la seule graphie littérale, désormais bornée — 3 purement alphanumériques, 3 à séparateur. Recette verte des deux côtés. |
| **TF-0880** (3) trois cas de recette sur dépôt jetable | Trois contrôles neufs à `scripts\self-test.mjs`, sur trois dépôts `git init` jetables et une table jetable à clé **inventée** de trois lettres — aucun nom du parc ne s'écrit dans la recette, même règle que TF-0820. Blob `base64` portant la clé entre deux lettres → **PASS** ; clé en **mot entier** dans une phrase → **FAIL**, constat vérifié au contrat `findings[]` ; clé **collée** à des lettres → **PASS**. | Recette de `quality-oracles` : **PASS, 224 contrôles** (221 avant ce lot), 0 échec. |
| **TF-0880** (4) la porte rejouée sur la forge de développement | Porte jouée deux fois sur `c:\dev\digit-ai-forge-development` à `4d81314`, **en lecture seule**, avec les deux tables du canal : une fois avec l'oracle d'origine, une fois avec l'oracle corrigé. | **1 constat avant, 1 après** — le même message de commit, aucun constat dans un blob ni avant ni après. `git status` du dépôt de développement vide, `HEAD` toujours `4d81314`. |
| **TF-0855** (1) les cinq mentions remplacées | Les cinq mentions du nom de `Produit-09` suivi d'un toponyme réel sont remplacées par le pseudonyme et par un lieu **inventé** (`Montbrelle`, absent des deux tables), dans `experts-forge\fiches\expert-seo-web.md:6`, `experts-forge\fixtures\fixture-seo-web.md:9`, `experts-forge\references\corpus-seo-web.md:3`, `quality-oracles\fixtures\manifest.json:487` et `quality-oracles\fixtures\parite-migration-red.txt:1`. | 5 remplacements, **0 résidu** : la clé ne subsiste dans aucun des cinq fichiers. `manifest.json` revalidé comme JSON. |
| **TF-0855** (1 bis) la substitution ne passe jamais par la main | Le remplacement est fait par un script qui **lit la clé dans la table du canal** et l'applique ; le nom réel n'est recopié nulle part — ni dans un fichier, ni dans un message de commit, ni dans ce compte rendu. | Les deux messages de commit et ce lot ne portent que le pseudonyme. |
| **TF-0855** (2) plus aucun constat sur l'arbre courant | Porte rejouée sur le dépôt entier, après les deux commits, avec les deux tables du canal. | **PASS**, verdict `C1-C5`, **0 constat** — ni sur l'arbre courant, ni en message de commit, ni en nom de fichier. |
| **TF-0855** (3) les recettes que ces fichiers servent | `manifest.json` et `parite-migration-red.txt` sont rejoués par la recette de `quality-oracles` (la fixture rouge de `parite-migration` et sa provenance) ; les trois pièces d'`experts-forge` par le routage et le scaffold. Le gate d'écriture C7 a été joué à la main sur les trois Markdown édités. | Recette **224 contrôles PASS** · routage **7/7** · scaffold **2/2** · C7 sur les trois Markdown : **aucun constat neuf**. |
| (0) le contrat de sortie ne bouge pas | La forme d'un constat — `sev`, `regle`, `msg`, `where` — n'est pas touchée ; les règles C1 à C4 non plus ; la table n'est pas copiée dans le dépôt. | Un contrôle de la recette vérifie que chaque constat C5 du cas rouge porte `sev`, `msg` et `where`. |

**Le rouge d'abord, et il porte sur les deux sens.** Les trois cas neufs ont été joués sur l'oracle
**d'avant** le correctif, en le ramenant à `HEAD` le temps d'une passe puis en le restaurant.

| Ce qui a été joué | Ce que la recette a rendu |
|---|---|
| Les trois cas neufs, contre l'oracle d'origine (`hay.includes`) | **2 échecs** — « la clé au milieu d'un blob base64 fait ENCORE un constat C5 (1) » et « la clé COLLÉE à des lettres fait encore un constat C5 (1) ». |
| Le cas du milieu, contre le même oracle d'origine | **VERT déjà** — et c'est le garde-fou : il passe avant comme après, donc il prouve que borner n'a pas rendu l'angle aveugle. Sans lui, une frontière trop large se lirait comme un progrès tout en éteignant la règle. |
| Les trois cas, contre l'oracle corrigé | **3 verts.** Fichier restauré, recette à 224 contrôles. |

**Les comptes, avant et après.** La recette de `quality-oracles` passe de **221 à 224** contrôles,
tous verts ; aucun contrôle préexistant n'a été retiré ni réécrit. Le banc du hook reste à **37**
cas : ce lot ne touche pas au hook. La porte de publication sur cette forge passe de **8 constats
C5 (FAIL)** à **0 constat (PASS)** — trois éteints par la frontière, cinq par le remplacement. Le
registre des oracles passe de **2.17.0 à 2.18.0**, et `maj-versions-livrees --livrer` a soldé
l'écart unique qui en découlait.

**Les écarts au lot, avec leur motif.** Deux, dont aucun ne porte sur la substance.

- **Deux commits plutôt qu'un.** Le lot laissait le choix. Deux ont été retenus parce que les deux
  items ne se prouvent pas de la même façon : celui de la frontière se prouve par une recette et une
  mesure de bruit, celui des mentions par la porte elle-même. Les mélanger aurait rendu la
  bissection inutile le jour où l'un des deux se révèle mauvais.
- **La table n'est pas balayée au-delà de la clé courte.** Le lot demande cinq mentions précises ;
  les 15 autres clés jugées par C5 ne font aucun constat sur l'arbre courant, ce que la porte finale
  atteste — mais aucun balayage manuel n'a été fait au-delà de ce que la porte voit, et la porte ne
  voit que ce que la table contient. C'est la limite déjà déclarée de l'oracle, redite ici. Les 45
  clés de chemin de disque restent ignorées par construction, et l'oracle le dit à son `non_juge`.

**Les recettes de la forge, toutes rejouées après les écritures** :
`quality-oracles\scripts\self-test.mjs` **PASS (224 contrôles)** · banc du hook
`qo-gate-write.mjs --self-test` **37/37** · `forge-agents\scripts\self-test.mjs` 29 PASS, 0 FAIL ·
`self-test-hamecon-publication.mjs` 7 PASS · `experts-forge\scripts\self-test-routage.mjs` 7/7 ·
`write-an-expert\scripts\self-test-scaffold.mjs` 2/2 · `self-test-gates-jq.sh` 28 PASS ·
`self-test-gate-budget.sh` 7 PASS · `oracle-etat-forge.mjs` sur `versions-livrees.json` **PASS**
(13 skills, F1-F3 vérifiés) après `maj-versions-livrees --livrer`.

**La porte de publication, jouée avec les tables du canal, rend PASS.** `oracle-nom-client-publie`
sur le dépôt entier, avec `--referentiel` et `--produits` pointant `c:\dev\_confidentiel\tables\`,
rend **PASS en C1-C5, zéro constat**, après les deux commits. Le lot annonçait qu'il resterait des
constats d'**histoire** : il n'en reste aucun, et la raison est mécanique plutôt qu'heureuse — C5 ne
balaie pas le CONTENU de l'historique (limite déclarée au `non_juge` de l'oracle), et aucun message
de commit du dépôt ne porte de nom de produit. Ce que la porte atteste est donc exactement ce que le
lot demandait de prouver : **aucun constat ne vise l'arbre courant**. Les blobs anciens des cinq
fichiers modifiés continuent d'exister dans l'historique, et c'est la réécriture du pilot qui les
emporte — pas ce lot.

**La source, jamais la copie installée.** Dix fichiers suivis ont changé, tous dans le dépôt de la
forge : l'oracle et sa recette, les deux vues du registre des oracles, le manifeste des versions
livrées, et les cinq fichiers de TF-0855. Le fichier non suivi `run\rapport-jouet.md.oracles.json`
n'a été ni supprimé ni commité, et le `HEAD` d'avant le lot (`9454701`) n'a pas été touché. Les
copies installées sous `~\.claude\` n'ont pas été modifiées.

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Un constat est sorti du traitement de ce lot. Il n'a pas été corrigé ici parce qu'il appelle une
décision du pilot plutôt qu'un geste, et parce que le corriger toucherait le câblage de la porte
dans tout le parc, ce que le lot ne vise pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-1 | bloquant | générique | **Le hameçon `pre-push` appelle la porte SANS lui désigner les tables, et les tables ont déménagé : la porte ne mesure plus rien et refuse tout.** `installer-hamecon-publication.mjs` fabrique un `pre-push` dont la ligne utile est `SORTIE="$(node "$ORACLE" "$DEPOT" 2>&1)"` — aucun `--referentiel`, aucun `--produits`. La porte retombe donc sur sa résolution par défaut : `_noms-interdits.json` auprès de la cible, puis chez son parent, puis sous `$FORGE_ROOT`. Or D-28 (a) a déplacé les deux tables vers `c:\dev\_confidentiel\tables\` et les anciens fichiers libres de `c:\dev\` n'existent plus — **vérifié le 07/09/2026** : `c:\dev\_noms-interdits.json` et `c:\dev\_produits-pseudonymes.json` sont absents. **Mesure** : la porte jouée sur cette forge sans argument et sans variable d'environnement rend **SKIP**, motif « RÉFÉRENTIEL DES NOMS INTERDITS ABSENT », pistes explorées `_noms-interdits.json · ..\_noms-interdits.json`. Le hameçon traite explicitement le SKIP comme un refus — « un oracle qui ne peut pas mesurer ne doit pas laisser passer » —, ce qui est le bon choix de conception et produit ici le pire effet pratique : **tout dépôt du parc où le hameçon est posé refuse désormais chaque push**, et le seul remède qu'un développeur trouve sous la main est `git push --no-verify`, c'est-à-dire la porte contournée pour de bon. La forge qui porte la porte est aussi celle qui a écrit le hameçon : le constat est générique, pas local. | Deux gestes, à trancher par le pilot parce qu'ils touchent le câblage hérité par tout le parc. **(a)** Le hameçon transmet les deux chemins — soit en les figeant à l'installation (`installer-hamecon-publication.mjs` reçoit `--referentiel=` et `--produits=` et les écrit dans le `pre-push` posé), soit en exportant `FORGE_NOMS_INTERDITS` et `FORGE_PRODUITS_PSEUDO` dans l'environnement des postes. La seconde voie a l'avantage de ne rien écrire de localisant dans un dépôt. **(b)** Ajouter aux pistes de résolution par défaut de l'oracle le chemin du canal confidentiel, de sorte qu'un déménagement de la donnée ne casse pas silencieusement la porte. Dans les deux cas, une recette qui **joue le hameçon posé** et exige un refus explicite « tables introuvables » plutôt qu'un SKIP générique rendrait la panne lisible : aujourd'hui le message parle d'un fichier `_noms-interdits.json` que plus personne n'est censé créer. |

**Portée** — le constat est *générique* : `installer-hamecon-publication.mjs` et
`oracle-nom-client-publie` sont l'outillage de publication de tout le parc, et les tables sont
partagées. Cette forge est seulement l'endroit où le constat s'est montré, parce que c'est là que la
porte se joue le plus souvent.

**Ce constat n'a pas de classe au référentiel, et le sidecar de ce lot est donc vide.** Les 45 clés
de `todo\CLASSES.json` ont été parcourues. Les deux plus proches sont
`anonymisation-portee-partielle` — qui nomme une passe d'anonymisation incomplète, pas un câblage
rompu — et `porte-cle-courte-sans-frontiere`, créée le 07/09 pour le défaut que ce lot vient de
corriger. Aucune ne convient : ici la porte est juste, sa règle est juste, et c'est **la donnée
qu'elle consomme qui a déménagé sans que son câblage suive**. La famille d'accueil naturelle serait
`hook-ou-gate`, et la règle se dit ainsi : *une donnée hors dépôt qui commande une porte est
désignée explicitement par le câblage de cette porte ; un déplacement de la donnée casse le câblage,
jamais le silence.* Une classe ne se crée jamais dans un sidecar : le pilot reste seul juge de
l'ouvrir, et RC-1 est décrit ici en prose pour qu'il ait de quoi le faire.

## Remarques restées au produit

Aucune remarque n'est restée au produit — vérifié le 2026-09-07. Le seul constat sorti du traitement
porte sur le câblage de la porte de publication et sur des tables hors dépôt, jamais sur du code
propre à cette forge : il est donc remonté ci-dessus plutôt que corrigé en silence. Les deux
corrections faites ici sont exactement celles que le lot confiait, ni plus ni moins. Verdict de
généralisation : **généralisable → remonté en RC-1**.

## Retours sur les documents produits

Aucun document produit depuis un gabarit. Le chantier est un correctif de code, trois contrôles de
recette, cinq remplacements de texte et deux mises à jour de registre. Le seul gabarit employé est
celui du présent lot de retours (`gabarits\RETOURS-FORGES.md`) : rien ne lui a manqué à la lecture,
et le lot 20260906a de la même forge a servi de modèle de structure, section par section.

## Confirmations positives

Trois choses ont tenu en conditions réelles pendant ce run, et méritent d'être closes comme
vérifiées.

- **Le cas qui passe déjà est le plus utile des trois.** Le cas du mot entier était vert avant le
  correctif comme après ; il n'apporte rien à la démonstration du défaut, et il est pourtant le seul
  qui empêche la correction de trop bien réussir. Borner une recherche se lit comme un progrès
  jusqu'au jour où l'on découvre que la règle ne trouve plus rien : le garde-fou doit être écrit
  **dans le même mouvement** que la frontière, pas après.
- **L'arbitrage tranché en amont a coûté zéro aller-retour.** Le lot précédent avait remonté le
  défaut **et** le fait qu'un arbitrage restait à poser — clé alphanumérique contre clé à
  séparateur — sans le trancher lui-même. Le pilot l'a tranché dans le lot de travaux, et les deux
  cas se sont révélés tenir dans une seule expression, ce qu'aucune des deux parties ne pouvait
  affirmer avant de l'écrire. Remonter la question séparément du défaut a été payant.
- **La substitution faite depuis la table, jamais à la main, se vérifie toute seule.** Le script lit
  la clé dans le canal et compte les résidus ; le nom réel n'a transité par aucun fichier de
  travail, aucun message de commit et aucune ligne de ce compte rendu. Une anonymisation qui se tape
  à la main laisse toujours une occurrence, et c'est en général celle qu'aucune porte ne regarde.

## Ordre recommandé

1. **La réécriture d'histoire et la publication forcée d'abord**, puisqu'elles sont déjà décidées et
   que les deux commits de ce lot les attendent. La porte est verte sur l'arbre courant : ce qui
   reste à emporter vit dans les blobs anciens des cinq fichiers, hors de portée de C5 par
   construction.
2. **RC-1 ensuite**, parce qu'il est bloquant partout où le hameçon est posé et que son effet
   pratique — un refus systématique dont le remède apparent est `--no-verify` — désapprend la porte
   à ceux qui la rencontrent. Chaque jour où il dure augmente le nombre de gens pour qui contourner
   est devenu le geste normal.
3. **La création de la classe en dernier**, si le pilot juge le constat récurrent : elle n'est utile
   qu'une fois le câblage décidé, parce que c'est la décision qui dira si la règle porte sur le
   hameçon, sur la résolution par défaut de l'oracle, ou sur les deux.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot traite des travaux confiés, pas un retour humain sur un livrable. La règle nommée l'est donc
pour les classes des deux items traités et pour celle du constat remonté.

- **TF-0880 relève de la classe `porte-cle-courte-sans-frontiere`**, créée par le pilot le 07/09, et
  la règle qui l'aurait évité est celle que ce lot vient de câbler : *toute graphie cherchée par la
  porte est bornée par des non-alphanumériques, la même frontière que les variantes, et une fixture
  double sens l'atteste par forme de clé.* Ce qui manquait n'était pas la connaissance de la règle —
  elle était écrite, correctement, deux lignes plus haut dans le même fichier, pour les variantes.
  Ce qui manquait était de constater que **les deux chemins du même contrôle ne l'appliquaient pas
  tous les deux**. Le défaut était invisible tant que la table ne portait que des noms longs, parce
  qu'une clé de deux mots et huit lettres gagnait sa frontière par la bande, en passant par les
  variantes. La règle générale se dit donc plus largement : *deux chemins qui cherchent le même
  terme dans le même oracle appliquent la même règle de frontière, et la recette les éprouve
  séparément* — un chemin qui n'est jamais emprunté par les données du jour n'est pas un chemin sûr,
  c'est un chemin non mesuré.
- **TF-0855 relève de `anonymisation-portee-partielle`, en récidive marquée**, et la règle qui
  l'aurait évité n'est pas celle de la porte mais celle de la **table** : *une donnée volatile qui
  commande une porte fait rejouer la porte partout où elle a déjà été jouée.* La loi transverse n° 4
  dit qu'un référentiel périssable vit éditable, daté et sourcé ; elle ne dit toujours pas ce qui se
  passe quand il **grandit**. Le lot du 05/09 avait écrit « porte PASS en C1-C5 » de bonne foi, et
  cette phrase était vraie au moment où elle a été écrite : la clé courte n'existait pas encore. Un
  PASS daté d'avant une mise à jour de table n'est pas un PASS, c'est un PASS périmé — et rien
  aujourd'hui ne le marque comme tel.
- **RC-1 n'a pas de classe au référentiel, et se décrit donc en prose** (voir la section du
  constat). La règle qui l'aurait évité est la loi transverse n° 1 dans sa variante la plus
  littérale : *toute affordance est câblée ou n'existe pas.* Le hameçon **est** le câblage de la
  porte ; il a été écrit à une époque où la donnée vivait à un endroit deviné par défaut, et il n'a
  jamais reçu de moyen de la désigner. Déplacer la donnée était une bonne décision — elle sort du
  disque nu et entre dans un canal — mais un déplacement de donnée est un changement de contrat pour
  tout ce qui la consomme. La règle se dit : *quand une donnée hors dépôt déménage, la liste de ses
  consommateurs est établie et chacun est rejoué ; un consommateur qui la résolvait par convention
  est recâblé, pas laissé à sa convention.* Ici, un seul consommateur a été rejoué — la porte, à la
  main, avec ses arguments — et c'est précisément pour cela que la panne du hameçon ne s'est pas vue
  avant ce run.
