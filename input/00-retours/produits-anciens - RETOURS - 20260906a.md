# Retours forges — produits-anciens — 20260906a

- **Contexte** : run d'héritage joué chez **trois produits anciens** (désignés ici *produit ancien
  n° 1*, *n° 2* et *n° 3*, dans l'ordre où ils ont été traités), sur mandat humain explicite du
  06/09/2026 — décision D-23 (a), action A-55. Les trois ont tourné en août, avant l'ouverture du
  canal des lots (25/08) ; le relevé d'héritage du pilot (R-47) rendait chez chacun « héritage du
  pilot non tenu — 8 absent(s), 3 périmé(s) ». Un seul lot pour les trois.
- **Références ledger** : aucune — le mandat interdit expressément d'écrire dans
  `forge\ledger.jsonl` des produits, et aucun run n'a été ouvert chez eux. La preuve tient aux
  trois commits locaux cités ci-dessous (ces dépôts n'ont pas de remote : aucun push) et aux
  sorties d'oracle rejouées avant et après.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-06

## Ce que le run d'héritage a produit, produit par produit

Le geste est le même chez les trois et il tient en deux temps : le geste unique du pilot
(`scripts\recopier-heritage.mjs .`, joué **depuis le dépôt du produit**) pour les artefacts en mode
`copie_conforme`, puis l'instanciation, **par le produit**, de ce que le contrat d'héritage lui
laisse personnaliser et qu'aucun script ne pose. Aucun fichier modifié localement par un produit
n'a été écrasé : les sept cibles de copie conforme étaient **toutes absentes** chez les trois, et
les deux fichiers déjà présents (`CLAUDE.md`, `.gitignore`) ont été **complétés**, jamais remplacés.

| | Produit ancien n° 1 | Produit ancien n° 2 | Produit ancien n° 3 |
|---|---|---|---|
| **HEAD avant** | `9490c71` | `5b47421` | `c1f2511` |
| **Arbre avant** | propre | propre | **11 fichiers non suivis** (sidecars d'oracles et un lot de retours du 25/08) — laissés intacts, aucun n'entre au commit |
| **R-47 avant** | FAIL — 8 absents, 3 périmés | FAIL — 8 absents, 3 périmés | FAIL — 8 absents, 3 périmés |
| **Périmés (détail)** | gabarit de lot à la version du 14/08 · `CLAUDE.md` sans « R-43 » · `.gitignore` sans **4** motifs du socle | idem · `.gitignore` sans **3** motifs | idem · `.gitignore` sans **6** motifs |
| **Copies conformes (7)** | `forge\retours\GABARIT-LOT-RETOURS.md`, `forge\retours\oracle-lot.mjs`, `forge\retours\CLASSES.json`, `forge\hooks\factory.mjs`, `forge\RESTITUTION.md`, `forge\travaux\TRAVAUX-PILOT.md`, `forge\travaux\oracle-travaux.mjs` | identique | identique |
| **Instanciés par le produit (4)** | `.claude\settings.json`, `forge\travaux\ECARTS-ASSUMES.md`, clause de précédence R-43 au `CLAUDE.md`, motifs de socle au `.gitignore` | identique | identique, les trois graphies exactes de sidecars d'oracles étant placées **avant** `!forge/**` pour ne pas ré-ignorer les preuves rangées sous `forge\` |
| **Laissés au produit** | `robots.txt` et `llms.txt` (mode `presence`, présents, inchangés) · l'alias `forge\retours\RETOURS-FORGES.md`, périmé, **non supprimé** (voir RH-2) | idem | idem |
| **R-47 après** | **PASS — 13 artefacts hérités présents et à jour** | **PASS — 13** | **PASS — 13** |
| **Commit** | `8549581` — 11 fichiers, 2202 insertions | `2a668aa` — 11 fichiers, 2200 insertions | `fba0efc` — 11 fichiers, 2206 insertions |
| **Arbre après** | propre | propre | les mêmes 11 fichiers non suivis, à l'identique |

**Un effet de bord favorable, mesuré et non recherché** : **R-43** (précédence de la factory)
rendait FAIL chez les trois et rend **PASS** chez les trois après ce run. Le motif est mécanique —
R-43 exige la clause au `CLAUDE.md`, `.claude\settings.json` et `forge\hooks\factory.mjs`, qui sont
trois des artefacts que l'héritage pose. Le mandat ne le demandait pas ; il tombe avec R-47.

**Ce qui n'a PAS été corrigé, et le motif** — les autres constats rouges de
`oracle-conformite-projet` sont **antérieurs à ce run**, sans rapport avec l'héritage, et le mandat
borne le périmètre à R-47. Ils sont déclarés ici, jamais touchés :

| Produit | Constats rouges restants (inchangés avant/après) |
|---|---|
| n° 1 | R-4 (indice `20260815a` partagé par 4 livrables), R-19 ×2 (deux `run_open` sans `versions_forges`), R-20 (marqueur de gabarit non instancié dans `ACCES-TEST.md`), R-24 (écart de nommage documenté en prose), R-26 ×2 (deux projections HTML périmées) |
| n° 2 | R-4, R-20 ×2 (`ACCES-TEST.md`, `MODELE-DONNEES.md`) |
| n° 3 | R-4, R-9 (2 commits hors Conventional Commits, tous deux **antérieurs** à ce run), R-20 |

Le verdict global de `oracle-conformite-projet` reste donc FAIL chez les trois — **R-47 et R-43,
eux, sont verts**, et c'est ce que le mandat demandait.

## digit-ai-factory (`digit-ai-factory`)

Trois retours, tous nés de la mesure elle-même : jouer le même geste trois fois de suite fait
apparaître ce qui, joué une fois, passe pour une particularité de produit. Un seul porte une classe
existante ; les deux autres n'en ont aucune et sont signalés au pilot plutôt que rattachés de force.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RH-1 | majeur | générique | **Le « geste unique » ne rend pas R-47 vert, et le message de R-47 promet qu'il le fait.** `scripts\recopier-heritage.mjs` ne copie que les artefacts en mode `copie_conforme` ; ceux en mode `presence` / `presence_et_motif` / `presence_et_motifs` sont **listés et laissés**, y compris quand ils sont **absents** — c'est-à-dire quand il n'y a chez le produit aucune personnalisation à préserver. **Mesure du 06/09/2026, identique chez les trois produits** : le script rend « 7 copié(s), 0 déjà conforme(s), 6 laissé(s) », et parmi les 6 laissés, **4 maintiennent R-47 en FAIL** — `.claude\settings.json` ABSENT, `forge\travaux\ECARTS-ASSUMES.md` ABSENT, `CLAUDE.md` sans clause R-43, `.gitignore` sans 4/3/6 motifs du socle. Or le message de R-47 se termine par « Remise à niveau **EN UN GESTE**, exécuté par le produit depuis son dépôt : `node <PILOT_ROOT>\scripts\recopier-heritage.mjs .` ». Le geste joué, R-47 rend encore FAIL. **Coût mesuré : 12 gestes manuels** (4 × 3 produits), dont deux copies de gabarit pur, une insertion de paragraphe et une édition de `.gitignore` où l'ORDRE des lignes est signifiant — chacun re-déduit par la session, sans forme qui le prescrive. | Distinguer, dans le script, **absent** de **présent**. Un artefact `presence` ou `presence_et_motif` **absent** n'a rien à protéger : l'instancier depuis le gabarit est strictement correct et c'est ce que le produit fait à la main. Pour `presence_et_motifs`, ajouter les motifs manquants en fin de fichier plutôt que d'écraser — en signalant que l'ordre des négations importe. **Ne rien écraser reste la règle dès que le fichier est PRÉSENT** : c'est la garde qui donne sa valeur au script. À défaut, corriger le message de R-47 : « un geste, plus les artefacts personnalisables absents que le script liste » — un message qui prescrit la moitié du geste conduit à la seconde violation (leçon TF-0552, citée par l'oracle de lot lui-même). |
| RH-2 | majeur | générique | **L'alias de transition périmé survit à côté de la copie à jour, et R-47 cesse de le regarder.** R-47 lit l'alias **seulement si** la cible canonique est absente : `if (!existsSync(dst) && a.alias_accepte && existsSync(p(a.alias_accepte))) dst = p(a.alias_accepte)`. **Mesure du 06/09/2026 chez les trois produits** : avant le run, `forge\retours\RETOURS-FORGES.md` portait la version publiée le **2026-08-14**, **62 lignes** ; après recopie, `forge\retours\GABARIT-LOT-RETOURS.md` porte la version courante, **180 lignes** — et R-47 rend PASS pendant que les **deux fichiers cohabitent**. Le fichier périmé est celui qui porte l'ANCIEN nom, celui que trois lots du produit n° 3 citent déjà, et il ne contient ni la section « La règle qui aurait évité le retour », ni l'obligation de classe du 03/09, ni le paragraphe « avant de remettre — un geste, une seconde ». Un producteur qui l'ouvre écrit un lot refusé à l'ingestion, et le contrôle d'héritage dit vert. | Deux voies, non exclusives. (1) Que R-47 juge l'alias **même quand la cible canonique existe** : présent et divergent = périmé, avec pour remède « supprimer l'alias, la migration est faite ». (2) Que `recopier-heritage.mjs` **signale** l'alias résiduel après avoir écrit la cible canonique — il connaît déjà `alias_accepte`, il ne lui manque qu'une ligne de sortie. La suppression reste un geste git du produit, comme l'en-tête du script le pose ; ce qui manque n'est pas le droit de supprimer, c'est le fait que **personne ne dise qu'il reste quelque chose à supprimer**. |
| RH-3 | mineur | générique | **R-47 compte « absent » un motif de `.gitignore` dont une graphie plus large est déjà présente.** Le contrôle `presence_et_motifs` compare des **lignes nues** exactes. **Mesure du 06/09/2026, produit n° 3** : son `.gitignore` portait `*.oracles*.json` et `*.oracles*.jsonl`, qui couvrent **strictement** les trois motifs exigés `*.oracles.json`, `*.oracles-cache.json`, `*.oracles-historique.jsonl` ; R-47 les a comptés comme **3 motifs absents sur 6**, et la mise en conformité a consisté à écrire trois lignes redondantes à côté de deux lignes qui faisaient déjà le travail — le fichier dit désormais deux fois la même exclusion, de deux manières. `HERITAGE.json` pose pourtant le raisonnement inverse, en toutes lettres, pour `.env` : « exiger une graphie exacte ferait crier sur une protection equivalente ». La règle est donc juste et son application ne la suit pas. | Le contrôle a besoin de la ligne nue pour rester mécanique — le remplacer par une équivalence de globs serait cher et faux. Deux gardes bornées suffisent : (1) que chaque motif exigé puisse déclarer une **graphie équivalente acceptée** (`equivalents: ["*.oracles*.json"]`), au même titre qu'un artefact déclare son `alias_accepte` — même patron, même motif ; (2) que le message distingue « motif absent » de « motif couvert par une graphie plus large, à normaliser », pour qu'un produit conforme ne soit pas invité à écrire de la redondance. Sans (1), le socle fabrique des `.gitignore` où deux lignes disent la même chose, et une exclusion écrite deux fois se corrige un jour à un seul endroit. |

**Portée** : les trois sont *génériques*. Aucun des trois faits ne dépend du contenu d'un produit :
RH-1 et RH-3 frappent tout dépôt que le contrat d'héritage juge ; RH-2 frappe tout dépôt portant
un artefact sous son alias de transition — c'est-à-dire, par construction, tout produit né avant
le renommage du 01/09.

## Remarques restées au produit

Trois remarques sont restées chez les produits, plus l'alias périmé décrit en RH-2 — chacune avec
son verdict de généralisation écrit. Aucune n'a été corrigée : le mandat borne le périmètre à R-47,
et corriger en passant ce qu'on n'a pas mandat de corriger est exactement ce que les garde-fous
interdisent.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'alias `forge\retours\RETOURS-FORGES.md`, périmé (version du 14/08, 62 lignes), reste dans les trois dépôts à côté de la copie canonique à jour (180 lignes). | **Pas corrigée** — sa suppression est un geste git qui appartient au produit (l'en-tête de `recopier-heritage.mjs` le dit), et le mandat borne le commit aux fichiers recopiés. Le fait est mesuré et déclaré. | **oui** | Remonté ci-dessus en **RH-2**. La remarque est locale (trois fichiers), la classe ne l'est pas : c'est le contrôle d'héritage qui devient aveugle à ce qu'il existe pour voir, chez tout produit portant un alias de transition. |
| Les constats rouges antérieurs de `oracle-conformite-projet` : R-4 chez les trois (indice `20260815a` partagé par 4 livrables), R-20 chez les trois (marqueur `{VAR_ADMIN_STAGING}` non instancié dans `ACCES-TEST.md`), R-19 ×2 et R-24 et R-26 ×2 chez le n° 1, R-20 ×2 chez le n° 2, R-9 chez le n° 3. | **Pas corrigées** — hors périmètre du mandat, et antérieures au run. Non-régression **mesurée** et non supposée : l'oracle a été rejoué avant et après chez chacun, et la liste des constats rouges est identique à R-43 et R-47 près. | **non** | Ce sont des dettes de produit, datées, dont chacune a déjà son point d'application chez son produit. Le marqueur `{VAR_ADMIN_STAGING}` identique chez les trois pourrait sembler une classe, mais il vient d'un gabarit `docs-projet` commun instancié le même jour de la même façon : c'est **un** oubli répliqué, pas une classe de défaut neuve. Aucune ligne de sidecar. |
| Chez le produit n° 3, onze fichiers non suivis dormaient dans l'arbre — dix sidecars d'oracles et un lot de retours daté du 25/08, jamais commis. | **Pas touchés**, et c'est le point : la modification du `.gitignore` exigée par R-47 a été construite pour ne **pas** changer leur état (les trois graphies exactes insérées **avant** `!forge/**`). Vérifié par `git status --porcelain` avant et après : même liste, même ordre. | **non** | Propre à ce dépôt. La leçon générique correspondante est déjà dite en RH-3 : une édition de `.gitignore` où l'ordre des lignes décide du résultat ne se prescrit pas par une liste de motifs non ordonnée. Aucune ligne de sidecar distincte. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot. Les
seuls fichiers dérivés d'un gabarit sont des artefacts d'**héritage** — `.claude\settings.json`
depuis `gabarits\settings-produit.json` et `forge\travaux\ECARTS-ASSUMES.md` depuis
`gabarits\ECARTS-ASSUMES.md` —, qui ne sont pas des livrables et ne portent ni `gd-…` ni
`version_du_gabarit`. Ce qu'ils ont coûté est remonté en **RH-1**, où il est un défaut du geste de
recopie et non du gabarit.

## Confirmations positives

Quatre choses ont tenu en conditions réelles, et deux d'entre elles sont exactement ce que le
contrat d'héritage promet.

- **Le contrat `HERITAGE.json` a fait ce pour quoi il existe : il n'a rien fait deviner.** Chacun
  des treize artefacts porte sa source, son mode et son motif ; le verdict R-47 nomme les absents
  AVEC leur source. La session n'a jamais eu à choisir d'où copier — et c'est précisément le défaut
  du 23/08 que le référentiel corrige.
- **La garde « ne pas écraser une personnalisation » a été éprouvée pour de bon.** Deux fichiers
  déjà présents chez chaque produit (`CLAUDE.md`, `.gitignore`) sont en mode personnalisable ; le
  script les a laissés, et le produit les a **complétés** sans perdre une ligne. Un script qui les
  aurait écrasés aurait détruit le routage forge de trois produits.
- **La normalisation des fins de ligne tient (TF-0072).** Les trois dépôts n'ont pas la même
  convention — git a averti « CRLF sera remplacé par LF » chez le n° 1 et « LF sera remplacé par
  CRLF » chez les n° 2 et 3 — et R-47 rend PASS chez les trois : la comparaison normalisée est ce
  qui rend le verdict portable d'un poste à l'autre.
- **R-47 et R-43 se répondent sans se doubler.** R-43 vérifie la présence des hooks, R-47 leur
  fraîcheur ; poser l'héritage a fait basculer les deux au vert dans le même geste, sans qu'aucune
  correction n'ait visé R-43. Le recouvrement est assumé au référentiel, et il se vérifie.

## Ordre recommandé

Trois retours, et l'ordre entre eux est dicté par ce qui saigne aujourd'hui plutôt que par la
gravité affichée.

1. **RH-2 — l'alias périmé qu'aucun contrôle ne regarde plus.** Rang 1 : c'est le seul des trois
   qui produit un **faux vert**. Les trois produits sont désormais déclarés conformes tout en
   portant, sous le nom que leurs propres lots citent, un gabarit qui ignore l'obligation de classe
   du 03/09. Un produit qui l'ouvre écrit un lot refusé à l'ingestion, et le relevé d'héritage ne
   l'a pas prévenu. Le correctif est d'une ligne côté script, de trois côté oracle.
2. **RH-1 — le geste unique qui n'est unique qu'à moitié.** Rang 2 : il coûte cher (12 gestes
   manuels pour trois produits) mais il ne trompe personne — R-47 reste rouge et le dit. À traiter
   avec RH-2, parce que les deux touchent le même fichier et que la ligne qui signale l'alias
   résiduel se pose au même endroit que celle qui instancie un artefact absent.
3. **RH-3 — les graphies équivalentes comptées absentes.** Rang 3 : mineur, sans faux vert ni
   coût de temps, mais il produit une dette silencieuse — des `.gitignore` où deux lignes disent la
   même exclusion. À traiter quand le champ `equivalents` sera écrit, pas avant : c'est un ajout de
   référentiel, pas une correction de code.

## La règle qui aurait évité le retour (TF-0779)

Aucun des trois retours ne suit un retour humain : les trois sont nés d'une **mesure exécutée**
pendant le run — R-47 joué avant et après chez chacun, et la comparaison des sorties du script de
recopie. La règle est nommée pour la classe, et une classe manquante est **signalée** au pilot
plutôt que créée ici : une classe ne se crée jamais dans un sidecar.

- **RH-1 est couvert par une classe existante : `boucle-retour-sans-descente`** (famille
  `heritage-produit`, règle `references/TODO-FORGE.md` R12 « descente », oracle `oracle-todo` R12).
  Le libellé décrit le fait : « une correction close au pilot ne redescend pas sous une forme que
  le producteur rencontre ». La correction — le contrat d'héritage complet — est close au pilot ;
  ce qui redescend sous une forme mécanique s'arrête à sept artefacts sur treize, et les six autres
  redescendent sous forme de **prose dans un message d'oracle**. Le retour entre **marqué
  récidive** : la classe est fondée par TF-0757, close, et le fait est mesuré trois fois en une
  journée sur trois dépôts distincts — c'est l'information la plus utile du lot, une descente qui
  s'arrête à mi-chemin et qu'un verdict rouge ne suffit pas à faire franchir.
- **Aucune clé ne convient pour RH-2.** La famille `regle-morte` décrit exactement la forme du
  défaut — « un contrôle qui rend PASS sur ce qu'il existe pour refuser » — mais aucune de ses
  quatre classes ne porte ce cas : `sceau-de-vue-provenance-sans-contenu` en est la plus proche par
  la forme (un sceau valide sur un contenu amputé) et vise un objet différent, la vue dérivée d'un
  référentiel d'exigences. La famille `heritage-produit` porte le bon objet et ses deux classes
  visent l'absence de descente, pas la **survivance de l'ancien à côté du neuf**. Le pilot est
  invité à créer la classe s'il la juge fondée — proposition de libellé : *un artefact hérité
  subsiste sous son nom de transition, périmé, à côté de la copie à jour, et le contrôle
  d'héritage cesse de le regarder dès que la copie canonique existe*. Ce retour n'a donc **pas** de
  ligne de sidecar.
- **Aucune clé ne convient pour RH-3.** Le cas est le **symétrique** de `regle-morte` : un contrôle
  qui rend FAIL sur ce qui est déjà conforme. Aucune famille du référentiel ne couvre le faux
  positif d'un contrôle de socle — `hook-ou-gate` vise « un hook ou un gate absent, bloquant à tort,
  ou contourné », et « bloquant à tort » s'en approche, mais sa seule classe (`gate-ecriture-juge-fichier-entier`)
  vise le périmètre d'un gate d'écriture, pas l'équivalence de deux graphies. Le pilot est invité à
  trancher : soit la classe se crée sous `hook-ou-gate`, soit le fait rejoint RH-1 comme un défaut
  du même contrat. Ce retour n'a donc **pas** de ligne de sidecar.
