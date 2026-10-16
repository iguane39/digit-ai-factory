# Retours forges — digit-ai-forge-conception — 20260906a

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905h` (TF-0822 et TF-0823), sur mandat humain du 06/09/2026 (« A49 »). Les deux travaux confiés sont faits, joués et prouvés dans les deux sens, **commités et poussés**. Ils se traitent sur la version laissée par le lot du sceau (`c8be40d`, TF-0818), comme le lot le demandait — les deux touchent le self-test.
- **Références ledger** : ce dépôt ne tient pas de `forge\ledger.jsonl` — les références opposables sont les **commits `b1a9247`** (TF-0822) et **`094a341`** (TF-0823) de `digit-ai-forge-conception`, **poussés** sur `origin/main` (`c8be40d..094a341`, avance rapide, aucun `git pull`, aucun merge, aucun push forcé), et la sortie de `node oracles\self-test.mjs`, qui imprime `15 oracles, 55 regles` puis `SELF-TEST VERT` — elle imprimait `14 oracles, 51 regles` avant ce run.
- **Sidecar** : **une ligne**, classe `champ-transcrit-de-prose-sans-correspondance` — la classe que le pilot vient de créer pour TF-0822 a une **seconde instance dans la même forge**, mesurée pendant l'instruction : les **tables closes des oracles** sont elles aussi déclarées « transcription exécutable » d'un document en prose, et rien ne les relie à lui. Les deux autres constats du run sont restés au produit, avec leur verdict de généralisation.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `input\00-retours\` du pilot ; le lot de travaux reste chez la forge, sa ligne de statut passée à `traite le 2026-09-06` — seule édition faite. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-09-06

## Contrôle de complétude

Le lot confiait **deux** travaux, en quatre demandes numérotées pour le premier et quatre pour le
second. Les huit sont instruites, chacune avec le moyen de vérification que le lot énonçait
lui-même comme critère de fin. Les quatre exclusions du lot sont tenues à la lettre. L'ordre
recommandé est respecté : TF-0822 d'abord (commit `b1a9247`), TF-0823 ensuite (commit `094a341`),
la matrice attendue étant établie **après** la dernière règle ajoutée — elle ne s'est écrite
qu'une fois.

## Ce qui a été fait — TF-0822, `EXIGENCES.md` devient un artefact jugé

**Le défaut, tel qu'il se mesurait avant.** Deux champs racine du référentiel sont déclarés
« transcrits de la prose et de nulle part ailleurs » ; sur les onze oracles de la forge, **zéro**
ne prenait `EXIGENCES.md` ou `SURFACE.md` en entrée. **Mesure faite avant tout correctif**, le
06/09/2026 : un `EXIGENCES.json` portant un écart socle complet — motif de 137 caractères,
décideur, date — posé à côté d'un `EXIGENCES.md` d'**une seule section**, sans section 7, rend
`oracle-exigences` **exit 0**, `oracle-surface` **exit 0**, `oracle-claims` **exit 0**,
`oracle-ears` **exit 0**, `oracle-tracabilite` **exit 0**, et le **verdict agrégé du runner
exit 0**. Le même jeu, rejoué après correctif : `oracle-exigences-md` **exit 1**, agrégé du
runner **exit 1**.

**Le porteur, déclaré comme le lot le demandait : un oracle NEUF**, `oracle-exigences-md`
(v1.0.0), et non des contrôles versés dans `oracle-exigences`. Le motif est l'artefact jugé —
`oracle-exigences` prend `EXIGENCES.json` et n'a jamais lu de Markdown ; l'artefact de celui-ci
est un document de **prose**, comme `CONSTITUTION.md` a le sien. Un oracle, un artefact. Le
corollaire est ce qui a tranché : un `EXIGENCES.md` absent sort alors en **2** (l'oracle n'a pas
jugé), là où l'enfouir dans `oracle-exigences` aurait fait sortir en 2 un référentiel JSON
parfaitement lisible.

**Les quatre règles neuves**, chacune nommant ce qui manque :

| Règle | Ce qu'elle juge | Verdict quand elle échoue |
|---|---|---|
| **P1** | les **sept sections** du gabarit de `schema-referentiel.md` sont présentes | FAIL, chaque section absente **nommée** avec son rang |
| **P2** | les sections **4** (Hypothèses) et **7** (Ce que le référentiel ne dit pas) sont **non vides** | FAIL, la section nommée, absente ou vide distinguées |
| **P3** | chaque entrée d'`ecarts_exigences_socle` figure en **section 7** d'`EXIGENCES.md` | FAIL, l'entrée **nommée**, avec le motif attendu cité |
| **P4** | chaque entrée d'`ecarts_surface_implicite` figure en **section 3** de `SURFACE.md` | FAIL, idem |

**La correspondance porte sur la clé ET le motif**, et il faut les deux : la clé seule laisserait
réécrire le motif dans le JSON après coup, le motif seul ne rattacherait la phrase à aucune
candidate. Le numéro écrit dans un titre n'est pas exigé (« ## Origine » vaut « ## 1. Origine ») —
ce qui est dû est la section, pas sa décoration. La comparaison retire les diacritiques et unifie
apostrophes, tirets et espaces : un motif recopié sans accent reste la même décision, une
**reformulation** ne correspond toujours pas — c'est exactement ce que « transcrit sans
reformulation » veut dire.

**Aucune migration, comme le lot l'excluait.** `EXIGENCES.md` absent → **exit 2**, jamais FAIL ;
référentiel absent, champ d'écart absent ou `SURFACE.md` absent → **`SANS_OBJET` motivé**. Ce qui
est refusé est l'entrée de JSON qui n'a pas de prose, jamais la prose qui n'a pas encore été
écrite. Aucune fixture antérieure n'a reçu de document de prose.

**L'affordance est câblée ET vérifiée.** L'oracle rejoint la table des voisins de
`run-oracles-conception.mjs` (`EXIGENCES.md`, comme `CONSTITUTION.md` / `DELTA.json` /
`ETAT.json`), et le témoin de la branche TF-0255 compte désormais **quatre** voisins absents en
`NON_JUGE` motivé. Câbler sans témoin aurait été une affordance que rien ne vérifie.

## Ce qui a été fait — TF-0823, la matrice des verdicts

**Le défaut, tel qu'il se mesurait avant.** **Mesure faite avant tout correctif**, le 06/09/2026,
par le même balayage manuel qui avait servi la veille : sur les **56 cellules** des quatorze
fixtures portant un `EXIGENCES.json`, croisées avec les quatre oracles qui le jugent, **18**
rendaient exit 1 ; **6 seulement** étaient regardées par un cas du self-test. **Douze verdicts
d'échec ne l'étaient par rien** — `delta-prose-verte`, `delta-rouge` et `delta-verte` sur
`oracle-exigences` ; `ears-verte` sur `oracle-exigences` et `oracle-surface` ; `ears-rouge` sur
`oracle-exigences`, `oracle-surface` et `oracle-claims` ; `seuil-rc1` sur `oracle-exigences` et
`oracle-surface` au seuil par défaut ; `verte` et `rouge` sur `oracle-ears`.

**Ce qui a été posé.** Le calcul vit à part (`oracles\matrice.mjs`), pour qu'un humain l'imprime
sans jouer toute la recette ; le jugement est dans le self-test ; la référence est une **donnée**
(`oracles\matrice-attendue.json`, **v1.0.0, datée du 2026-09-06**, éditable, versionnée dans le
dépôt). **23 fixtures × 11 oracles, 86 cellules applicables.**

Une cellule **non applicable** — l'oracle n'a pas son artefact dans cette fixture — reste
**vide** : elle ne s'écrit pas dans la matrice attendue, et ne se confond jamais avec un verdict.
C'est ce qui distingue « il n'y avait rien à juger là » de « il a jugé et n'a pas pu ».

**La bascule du 05/09 est portée avec sa date**, dans un journal `bascules` que le self-test
relit : `delta-rouge` × `oracle-exigences`, **PASS → FAIL**, **2026-09-05**, sa cause (E10 sur un
référentiel **cible** de delta, non migré — c'est le cas « référentiel antérieur au champ » que
E10 doit accuser) et la façon dont elle a été constatée (**balayage manuel, faute de matrice**).
Le self-test vérifie que chaque bascule déclarée est **datée, motivée, et conforme à la cellule
qu'elle décrit** : le journal et la matrice ne peuvent pas diverger en silence.

**La matrice est imprimée**, une ligne par fixture, une colonne par oracle, un point pour une
cellule non applicable, légende et comptes en pied. Un lecteur voit ce que chaque fixture rend,
pas seulement ce que la recette en dit.

**Mettre la matrice à jour est un geste explicite**, dans le commit qui change la règle :
`node oracles\matrice.mjs` imprime la matrice courante **et** le bloc JSON prêt à coller. Une
cellule absente de la matrice attendue est un écart au même titre qu'un verdict qui change —
c'est ce qui rend une fixture ou un oracle neufs impossibles à glisser sans le dire. Un garde
supplémentaire, non demandé et gardé : **tout `oracle-*.mjs` du dossier doit figurer dans la
table de la matrice**, et réciproquement.

### La preuve, dans l'ordre où le lot la demandait

Le lot écrivait lui-même ses critères de fin, sous « Comment vous saurez que c'est fait ». Chaque
geste a été joué le 06/09/2026 sur le dépôt de la forge.

**Comment lire ce tableau.** La colonne de gauche reprend un critère du lot, **dans l'ordre où le
lot l'écrit** — TF-0822 d'abord, TF-0823 ensuite, la porte et le push en dernier ; aucun critère
du lot n'est omis, et aucune ligne n'est ajoutée qui ne réponde à l'un d'eux. La colonne de droite
donne le résultat **exécuté**, avec la commande, le verdict et le code de sortie : c'est une
mesure, jamais un commentaire. Les deux lignes « Rouge d'abord » sont les mesures faites **avant**
toute ligne de correctif ; toutes les autres sont postérieures.

| Moyen de vérification écrit dans le lot | Résultat exécuté le 06/09/2026 |
|---|---|
| **Rouge d'abord (TF-0822)** : l'écart écrit dans le JSON sans prose passe | écart socle complet + `EXIGENCES.md` d'une seule section → **5 oracles exit 0**, agrégé du runner **exit 0**. Le défaut est reproduit avant toute ligne de correctif |
| Une fixture dont le JSON porte un écart absent de la prose rend **FAIL** | cas 6 de la branche : `oracle-exigences-md` **exit 1**, P3 FAIL nommant `ecarts_exigences_socle[0] (donnees-demonstration)` |
| La même **avec** la prose rend **PASS** | `exigences-md-verte` → **exit 0**, **8 constats, 0 FAIL** (P1, 2 × P2, 3 × P3, 2 × P4) |
| Une fixture **sans section 7** rend FAIL | cas 3 : section 7 présente et **vide** → P2 FAIL ; le gabarit privé de sa section 6 → P1 FAIL la nommant |
| **Rouge d'abord (TF-0823)** : une fixture voisine bascule en silence | balayage manuel des 56 cellules : **18 FAIL, 6 regardés, 12 invisibles** — dont la bascule du 05/09 |
| `node oracles\self-test.mjs` **imprime** la matrice | 23 lignes de fixtures, 11 colonnes d'oracles, légende et comptes — publiée avant la recette |
| Le self-test rend **FAIL** quand une cellule est altérée à dessein | `verte` × `oracle-ears` passée de FAIL à PASS dans le fichier versionné → « **ÉCART DE RECETTE : verte x oracle-ears — attendu PASS, obtenu FAIL** », self-test **rouge**, exit 1 ; fichier restauré → **vert**. Même résultat sur la cellule de la bascule |
| **PASS** quand la matrice est conforme | 7 cas comptés, 7 tenus, self-test **VERT** |
| La bascule du 05/09 est portée **avec sa date** | `bascules[0]` : `delta-rouge` × `oracle-exigences`, `de: PASS`, `vers: FAIL`, `date: 2026-09-05`, cause et mode de constat écrits ; cas 4 et 5 de la branche le vérifient |
| `node oracles\self-test.mjs` compte les états neufs | **SELF-TEST VERT**, sortie `15 oracles, 55 regles` (`14 oracles, 51 regles` avant) ; branche TF-0822 : **12 cas comptés, 12 tenus** ; branche TF-0823 : **7 cas comptés, 7 tenus** |
| Porte de publication avant tout `push` | `oracle-nom-client-publie` → **FAIL, 14 constats C5**, tous antérieurs — preuve détaillée plus bas |
| Push | `c8be40d..094a341`, `main` en **avance rapide**, aucun `git pull`, aucun merge, aucun push forcé |

### Le compte, avant → après

Ce que la forge savait dire hier de la prose dont ses champs sont transcrits, et de ce que ses
propres fixtures rendent ailleurs que sur leur oracle — et ce qu'elle sait en dire aujourd'hui.
Les deux chiffres qui comptent sont ceux des deux premières lignes : aucun oracle ne lisait la
prose, un la lit ; six cellules sur cinquante-six étaient regardées, elles le sont toutes.

| Mesure | Avant (`c8be40d`) | Après (`094a341`) |
|---|---|---|
| Oracles qui lisent `EXIGENCES.md` ou `SURFACE.md` | **0** sur 11 | **1** — `oracle-exigences-md` |
| Cellules fixture × oracle regardées par la recette | **6** sur 56 mesurées à la main | **86 sur 86**, recalculées à chaque passe |
| Écart écrit dans le JSON, absent de la prose | **PASS** partout, agrégé exit 0 | **FAIL**, l'entrée nommée, agrégé exit 1 |
| Gabarit d'`EXIGENCES.md` jugé | par **personne** | **P1 et P2**, sections 4 et 7 non vides comprises |
| Verdicts d'échec invisibles au self-test | **12** | **0** — chacun est une cellule attendue, datée par son commit |
| Bascule de verdict hors périmètre | invisible jusqu'au balayage manuel | **échec de recette nommant la fixture et l'oracle** |
| Journal des bascules connues | aucun | **1 entrée**, datée, motivée, confrontée à la matrice |
| Entrées d'oracle × règles au self-test | 14 × 51, VERT | **15 × 55, VERT** |
| Durée du self-test complet | ~2 s | **~10 s** (86 cellules calculées en plus) |

**Aucun verdict ne change hors périmètre**, et c'est vérifié plutôt que supposé : la matrice
attendue **est** cette vérification, et elle est verte au premier jet sur les 86 cellules.

**Fichiers touchés** : 14 fichiers au commit `b1a9247` (+1 381 / −10), 5 au commit `094a341`
(+491 / −1) ; total **16 fichiers, +1 871 / −10**. Le dossier `input\` reste **non suivi**, comme
pour les lots précédents de cette forge.

### La porte de publication, et la preuve qu'aucun constat ne vient de ce run

`node oracle-nom-client-publie.mjs .` rend **FAIL** avec **14 constats C5** — le lot en annonçait
12, l'écart est nommé plus bas. Aucun ne provient de ce run, et ce n'est pas une affirmation :

| Constat | `where` | `git blame` / `git log` |
|---|---|---|
| 1 nom de produit, contenu | `oracles\oracle-constitution.mjs:119` | `afdd1548`, **2026-08-24** |
| 6 noms de produit, contenus | `oracles\oracle-ears.mjs` l. 65, 121, 164, 198, 211, 262 | `2e7015cc`, `d770b445`, `b6c5e953`, `642e11a4` ×2, `1e729009` — **2026-08-18 à 08-24** |
| 2 noms de produit, contenu | `skills\enumere-la-surface\references\typologie-surface.md:79` | `705ed779`, **2026-08-20** — ligne **non touchée** par ce run, dont l'ajout est aux lignes 170 et suivantes |
| 5 noms de produit, **messages de commit** | `1e72900976bf`, `705ed7795ecc`, `9df02049945a`, `2e7015cc5a6d` | **2026-08-18 à 08-24** |

**Mes commits sont `b1a9247` et `094a341`** : aucun `where` ne les cite. Contrôle complémentaire,
joué en plus du `blame` : les **1 871 lignes ajoutées** par `git diff c8be40d..HEAD` ont été
confrontées aux 71 termes des deux référentiels — **aucune occurrence**. Push effectué en avance
rapide, comme la règle du mandat le prévoit.

## Ce qui n'a pas été fait, et l'écart à la lettre du lot

- **Les quatre exclusions du lot sont tenues.** Aucun contrôle sur un autre document de prose que
  `EXIGENCES.md` et `SURFACE.md`. **Aucune migration** des référentiels scellés — une fixture
  antérieure se juge sur la présence de la prose seulement, et l'oracle le **déclare** en
  `SANS_OBJET` motivé plutôt que de le taire. **Aucun changement du sceau des vues** (lot
  20260905e, déjà instruit). **Aucune matrice pour d'autres forges** : le patron est transposable,
  il n'a pas été porté ailleurs.
- **Écart 1 — la porte rend 14 constats, le lot en annonçait 12.** L'écart est dans le comptage,
  pas dans la nature : les deux constats supplémentaires sont les deux termes trouvés sur **une
  même ligne** de `typologie-surface.md:79` (un nom et son suffixe régional, comptés séparément) et
  une sixième occurrence dans `oracle-ears.mjs`. Tous sont antérieurs au 25/08. La campagne de
  réécriture décidée par le pilot les couvre ; rien n'a été touché ici, comme le mandat le
  prévoyait.
- **Écart 2 — un garde non demandé, gardé (R-43, « renforcer oui, assouplir jamais »).** Le lot
  demandait la matrice et sa comparaison. La forge a ajouté le cas 6 : **tout `oracle-*.mjs` du
  dossier doit figurer dans la table de la matrice, et réciproquement**. Motif : sans lui, un
  oracle neuf serait hors matrice, c'est-à-dire exactement le trou que ce lot comble, déplacé d'un
  cran. Coût : un cas de recette et deux lignes de calcul.
- **Écart 3 — les témoins d'altération partent de la matrice RÉELLE, pas de la matrice attendue.**
  Ce n'est pas un raccourci : une matrice attendue déjà périmée produirait des écarts étrangers à
  l'altération, et le témoin cesserait de prouver que la comparaison **discrimine**. Le cas 1, lui,
  juge bien la donnée versionnée — et le sens rouge a été rejoué **sur le disque**, sur le fichier
  versionné, avant d'être restauré.

## digit-ai-forge-conception (`digit-ai-forge-conception`)

Instruire TF-0822 laisse un résidu que le lot n'excluait pas et que le correctif ne couvre pas :
la classe qui vient d'être créée a une **seconde instance dans la même forge**, à un fichier de
distance, sur un autre type de transcription.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RC-10 | majeur | générique | **Les tables closes des oracles sont, elles aussi, des transcriptions de prose que rien ne relie à leur source.** Trois tables de code portent en commentaire qu'elles sont la « transcription exécutable » d'un document en prose et « ne l'étendent pas » : `SURFACE_IMPLICITE` dans `oracle-surface` (11 clés, source `typologie-surface.md` § « Surface implicite SaaS »), `EXIGENCES_SOCLE` dans `oracle-exigences` (3 clés, source `schema-referentiel.md` § « Exigences socle candidates »), et `SECTIONS_EXIGENCES_MD` dans l'`oracle-exigences-md` **écrit par ce lot** (7 sections, source le gabarit du même document). **Mesure du 06/09/2026** : les comptes concordent aujourd'hui — 11 clés de code contre 11 lignes de prose, 7 sections contre 7 lignes — et rien ne le vérifie. Un douzième candidat (`bandeau-cookies`) ajouté à la table close **en prose** de `typologie-surface.md` laisse `oracle-surface` **exit 0** sur sa fixture verte et le **self-test entier VERT** : la table du code reste à 11, personne ne le dit. C'est mot pour mot le libellé de la classe — « l'oracle prouve que la règle est écrite, jamais qu'elle a été décidée » — appliqué au **code** au lieu du JSON, et le lot qui referme la première instance en ouvre une troisième en la posant. | Le patron existe déjà chez la forge et il est éprouvé : le **cas 6** de la branche TF-0818 extrait la phrase citée dans un message d'échec et la confronte à `vues.md`, mot pour mot. Le généraliser en un cas de recette par table close — pour chaque clé de la table du code, la chercher dans la table de prose déclarée, et l'inverse — coûte une fonction et trois appels, et rend la divergence impossible à introduire en silence. Corollaire de doctrine : **une transcription est une transcription, que la cible soit un champ JSON ou une constante de code** ; la règle de la classe gagnerait à le dire, sans quoi elle se lit comme ne visant que les référentiels. |

**Portée** : RC-10 est *générique*. Il vaut pour toute forge dont un oracle porte une liste close
« reprise à l'identique » d'un document de méthode — l'idiome est employé au moins trois fois
ici, et la même formule (« cette table en est la transcription exécutable, elle ne l'étend pas »)
se retrouve d'un oracle à l'autre.

## Remarques restées au produit

Deux constats sont restés ici, et chacun porte son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| **Six fixtures nommées « verte » rendent FAIL sur un oracle voisin**, et leur nom ne le dit pas : `delta-verte`, `delta-prose-verte` et `ears-verte` sur `oracle-exigences`, `ears-verte` sur `oracle-surface`, `verte` (la fixture **partagée**) sur `oracle-ears`. Aucune n'est un défaut en soi — une fixture dédiée à un oracle n'a pas à passer les autres — mais rien ne le disait, et « verte » se lit comme un absolu | Rien de plus : c'est précisément ce que la matrice de TF-0823 rend **visible et opposable**. Les six cellules sont désormais des verdicts attendus, datés par leur commit, et une septième ferait échouer la recette | **non** — le mécanisme général est déjà remonté et corrigé (TF-0823) | La matrice répond à la question mieux qu'un renommage : elle dit **pour quel oracle** une fixture est verte, ce qu'un nom de dossier ne saura jamais dire. Renommer coûterait des fixtures et ne prouverait rien |
| **Le filtre `--seulement` du runner agrégé compare par sous-chaîne** (`f.includes(s)`) : `--seulement=exigences` sélectionne désormais **aussi** `oracle-exigences-md`, effet de bord de l'oracle neuf | Rien : le comportement est **correct** dans le seul emploi existant (la branche TF-0255 du self-test, où l'oracle neuf doit précisément sortir en `NON_JUGE`), et le durcir sans besoin serait un changement non demandé | **non** — local à ce runner, et sans conséquence mesurée | Constaté et déclaré plutôt que corrigé en passant. Le jour où deux oracles devront être distingués par ce filtre, la comparaison exacte sera le geste, avec son motif |

## Retours sur les documents produits

Aucun document produit depuis un gabarit. Le travail a porté sur du code d'oracle, des fixtures,
une donnée de recette versionnée (`matrice-attendue.json`) et des références de skill. Le seul
gabarit employé est celui de la remise elle-même (`gabarits\RETOURS-FORGES.md`).

## Confirmations positives

- **La boucle du pilot s'est refermée en un jour, deux fois.** Les constats RC-6 et RC-7 du lot
  `20260905c`, remis **sans sidecar faute de classe**, ont produit les deux classes du 05/09, puis
  TF-0822 et TF-0823, puis ce lot de travaux, puis `oracle-exigences-md` et la matrice. Le
  mécanisme « un constat sans classe se décrit en prose » n'a rien perdu en route, deux fois de
  suite.
- **L'ordre recommandé par le lot était le bon, et il se vérifie.** La matrice attendue a été
  établie **après** l'entrée de P1–P4 : elle porte les deux fixtures neuves et leurs quatorze
  cellules dès sa version 1.0.0, et n'a été écrite qu'**une** fois. Établie avant, elle aurait été
  réécrite le jour même — ce que le lot annonçait mot pour mot.
- **La mesure d'avant correctif est entrée dans la recette, deux fois.** Le cas 10 de la branche
  TF-0822 rejoue le référentiel antérieur au champ (`SANS_OBJET` motivé, exit 0) ; le cas 12
  rejoue le document absent (exit 2). Le jour où quelqu'un croira pouvoir transformer ces états en
  FAIL, la recette le dira.
- **La fixture isolante marche une quatrième fois.** `exigences-md-rouge` porte le **même**
  `EXIGENCES.json` que la verte, au caractère près : seule la prose change. Les quatre contrôles
  neufs y échouent, chacun pour son propre motif, et aucun ne dépend d'une fixture qui échoue
  partout.
- **La porte de publication a été jouée avant le `push`, pas après**, et son verdict FAIL a été
  **instruit constat par constat** plutôt que contourné : quatorze `where`, quatorze `git blame`
  ou `git log`, tous antérieurs au 25/08/2026.
- **La normalisation `eol=lf` a tenu une fois de plus** (TF-0114) : six fichiers de fixtures neufs
  passent leurs oracles sur un poste dont `core.autocrlf` réécrit le reste en CRLF, et les 86
  cellules de la matrice sont stables entre deux passes.

## Ordre recommandé

1. **RC-10 seul.** Il n'y a qu'un retour au pilot dans ce lot. Il est majeur parce qu'il porte sur
   la classe que le pilot vient de créer : tant qu'il tient, la classe se lit comme ne visant que
   les champs de référentiel, et la même divergence reste introduisible en silence dans le code
   des oracles — y compris dans l'oracle écrit aujourd'hui pour la refermer.

## La règle qui aurait évité le retour

- **RC-10 — la classe existe, et c'est celle que le pilot a créée hier.**
  `champ-transcrit-de-prose-sans-correspondance` (famille `regle-morte`) dit mot pour mot ce que
  RC-10 constate : « l'oracle prouve que l'écart est écrit, jamais qu'il a été décidé ». Sa règle
  écrite vise cependant un **champ machine** d'un référentiel, et cite en exemple les deux champs
  de cette forge ; RC-10 apporte la mesure qui l'élargit : la même transcription existe **du
  document de méthode vers la constante de code**, trois fois dans la même forge, et le lot qui
  referme la première instance en pose une troisième. La règle de la classe gagnerait à porter
  cette précision — la cible d'une transcription peut être une constante autant qu'un champ.
  C'est la seule ligne du sidecar.
- **Aucun défaut de lot ouvert.** Le lot `20260905h` passe `oracle-travaux-pilot` **PASS sur ses
  six contrôles** (T1 à T6, joué avant instruction), nomme le bon module producteur avec sa ligne
  de lecture citée, borne ce qu'il ne demande pas, et justifie son ordre — lequel s'est révélé
  exact à l'exécution. Aucune candidature n'est ouverte de ce côté.
- **Les deux remarques restées au produit ne suivent aucun retour humain** : elles ont été
  trouvées par l'instruction elle-même, la première par la matrice qu'elle posait. Leur verdict de
  généralisation est *non* dans les deux cas, motif écrit en regard.
