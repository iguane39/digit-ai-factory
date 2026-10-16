# Retours forges — digit-ai-forge-conception — 20260905d

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905e` (TF-0818), sur mandat humain du 05/09/2026 (« A44 »). Le travail confié est fait, joué et prouvé dans les deux sens, **commité et poussé**. Il se traite sur la version laissée par TF-0814 (`be41b25`), comme le lot le demandait — les deux touchent la vue de cadrage.
- **Références ledger** : ce dépôt ne tient pas de `forge\ledger.jsonl` — la référence opposable est le **commit `c8be40d`** de `digit-ai-forge-conception`, **poussé** sur `origin/main` (`be41b25..c8be40d`, avance rapide), et la sortie de `node oracles\self-test.mjs` (**14 entrées d'oracle, 51 règles, VERT**).
- **Sidecar** : **une ligne**, classe `sceau-de-vue-provenance-sans-contenu` — le défaut que ce lot corrige sur la première famille de vues **existe à l'identique sur la seconde**, mesuré ce soir. Le second constat de ce run (RC-9) n'a pas de clé dans `todo\CLASSES.json` : il est porté en prose, jamais dans le sidecar.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `input\00-retours\` du pilot ; le lot de travaux reste chez la forge, sa ligne de statut passée à `traite le 2026-09-05` — seule édition faite. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-09-05

## Contrôle de complétude

Le lot confiait **un** travail, en trois demandes numérotées. Les trois sont instruites, chacune
avec le moyen de vérification que le lot énonçait lui-même comme critère de fin. Les trois
exclusions du lot sont tenues à la lettre. Le seul endroit où l'instruction **dépasse** la lettre
est nommé plus bas, avec son motif.

## Ce qui a été fait — TF-0818, la vue porte l'empreinte de son propre corps

**Le défaut, tel qu'il se mesurait avant.** `oracle-tracabilite` T3 compare l'empreinte SHA-256
que la vue **porte** à celle de sa **source**. Elle dit d'où vient la vue ; elle ne regarde pas ce
qu'il y a dedans. **Mesure faite avant tout correctif**, le 05/09/2026, sur la vue de la fixture
`surface-implicite-verte` : le fichier fait **4 327 caractères**, sa section « Surface implicite
écartée » en fait **996** — un peu moins d'un quart, et elle porte les **deux** écarts opposables
du référentiel. Section retirée, en-tête laissé intact : `oracle-tracabilite` rend **T3 PASS**,
**verdict global PASS**, **exit 0**. Une décision opposable pouvait donc disparaître d'une vue
sans qu'aucun des douze oracles de la forge ne le voie, et la surface exposée grandissait à
chaque champ neuf porté par une vue — TF-0811 en a ajouté un, TF-0814 un second.

**Précision sur le chiffre du lot.** Le lot annonce « 996 caractères sur 3 074 ». Le nombre
retiré est exact ; le dénominateur est celui d'**avant** TF-0814 (3 174 octets au commit
`d6ab8ff`). TF-0814 a fait grandir la même vue à 4 327 caractères, si bien que la proportion
tombe à un quart sur cette fixture-là. Le tiers annoncé se retrouve à l'identique sur les
fixtures dédiées de ce lot, plus petites : **862 caractères sur 2 649**, soit **33 %**.

**(1) L'empreinte du corps, écrite par `derive-les-vues`.** Toute vue markdown porte désormais
**deux** empreintes en tête, et il en faut deux parce qu'elles ne prouvent pas la même chose :

| En-tête | Ce qu'il prouve | Règle qui le juge |
|---|---|---|
| `source-sha256` | **d'où** vient la vue — la source n'a pas bougé | T3 |
| `corps-sha256` | **ce que** la vue contient — le corps est celui qui a été dérivé | **T5** |

Le corps est **tout ce qui suit la ligne du sceau** — le sceau ne se hache donc jamais lui-même,
et il n'y a pas de point fixe à chercher. Mêmes fins de ligne normalisées LF que la source
(TF-0114). L'ordre de production est écrit dans le contrat parce qu'il n'est pas indifférent :
**le corps d'abord, son empreinte ensuite, l'en-tête en dernier**.

**(2) T5, dans `oracle-tracabilite` (v1.0.0 → v1.1.0)**, trois états, chacun **nommé** :

| État | Verdict rendu |
|---|---|
| Corps conforme à l'empreinte portée | PASS, avec le nombre de caractères rehachés |
| Corps différent | **FAIL**, « corps de la vue altéré », les deux empreintes tronquées en regard |
| En-tête `corps-sha256` **absent** | `SANS_OBJET` **qui le dit** : provenance jugée, contenu non jugé |

Le troisième état est la façon de tenir l'exclusion du lot sans mentir au lecteur. Aucune vue
déjà scellée n'est migrée ; une vue antérieure se juge exactement comme hier — et le verdict
cesse de laisser croire que son contenu a été vérifié, ce qui était précisément le défaut.

**(3) La liste des sections est CITÉE, jamais CÂBLÉE.** `vues.md` la porte en prose pour la fiche
de cadrage. Le message d'échec la recopie entre guillemets droits, précédée de sa source et de la
mention « **NON vérifié ici** » : T5 voit qu'un octet du corps a bougé, jamais lequel, jamais
quelle section manque — les deux limites sont déclarées au `non_juge`. La seconde variante,
câbler la liste close, **n'est pas retenue** : le lot la laissait à notre jugement, et RC-8
ci-dessous montre, mesure à l'appui, qu'elle ne suffirait pas seule.

**Un garde-fou sur la citation, et il n'était pas demandé.** Une phrase recopiée d'un document en
prose qu'aucun contrôle ne relit est exactement le défaut que le pilot vient de classer
(`champ-transcrit-de-prose-sans-correspondance`, TF-0822). Le **cas 6** de la branche de self-test
extrait la phrase du message d'échec réellement produit et la confronte au contenu de `vues.md` :
si elle change d'un côté seulement, la recette échoue. La citation reste une citation, et elle ne
peut plus dériver en silence.

**(4) Fixtures double sens.** Deux fixtures **dédiées** neuves, `oracles\fixtures\corps-de-vue-verte`
et `-rouge`. Elles partagent le **même** `EXIGENCES.json` et le **même en-tête de sceau** ; seul
le corps diffère — la rouge est la verte amputée de sa seule section « Exigences socle écartées ».
C'est l'idiome de la fixture **isolante** de TF-0811 et TF-0814, poussé d'un cran : ici T3 reste
**vert** des deux côtés. Une rouge qui échouerait aussi sur T3 ne prouverait pas que T5 attrape ce
que T3 laisse passer.

### La preuve, dans l'ordre où le lot la demandait

Le lot écrivait lui-même son critère de fin, sous « Comment vous saurez que c'est fait ». Chaque
geste a été joué le 05/09/2026 sur le dépôt de la forge ; le tableau met en regard ce qui était
demandé et ce que la commande a rendu, exit compris. La première ligne est la plus importante :
c'est le défaut reproduit **avant** d'écrire la moindre ligne de correctif.

| Moyen de vérification écrit dans le lot | Résultat exécuté le 05/09/2026 |
|---|---|
| **Rouge d'abord** : reproduire l'amputation qui passe | `surface-implicite-verte`, section « Surface implicite écartée » (996 car. sur 4 327) retirée, en-tête intact → `oracle-tracabilite` **exit 0**, verdict **PASS**, **T3 PASS**. Le défaut est reproduit avant tout correctif |
| `oracle-tracabilite` **FAIL** sur la fixture amputée | `corps-de-vue-rouge` → **exit 1**, **16 constats, 1 seul FAIL** : T5, message « **corps de la vue altéré** », les deux empreintes en regard, et **T3 reste PASS** |
| `oracle-tracabilite` **PASS** sur la fixture intacte | `corps-de-vue-verte` → **exit 0**, **16 constats, 0 FAIL** ; T5 PASS, « 2 649 caractère(s) rehachés, empreinte identique » |
| Le FAIL nomme les sections attendues, sans les câbler | le message porte la phrase de `vues.md` entre guillemets droits, précédée de « cité de `skills/derive-les-vues/references/vues.md` (section 1) et **NON vérifié ici** » |
| La vue régénérée porte les **deux** empreintes | `corps-de-vue-verte/CADRAGE-DESIGN.md` : `source: EXIGENCES.json`, `source-sha256`, `corps-sha256` — trois lignes d'en-tête, contrat mis à jour dans `vues.md` |
| Une vue **non migrée** se juge comme aujourd'hui | cas 3 de la branche : la même vue amputée, privée de `corps-sha256` → **exit 0**, T3 PASS, **T5 SANS_OBJET** dont le message dit que le contenu n'est pas jugé |
| `node oracles\self-test.mjs` compte les deux états | **SELF-TEST VERT** — **14 entrées d'oracle, 51 règles** (13 × 50 avant) ; branche TF-0818 : **6 cas comptés, 6 tenus, 0 en échec** |
| Porte de publication avant tout `push` | `oracle-nom-client-publie` sur le dépôt, référentiel `_noms-interdits.json` (5 termes) → **PASS** : aucun terme dans les contenus, les noms de fichiers ni les messages de commit |
| Push | `be41b25..c8be40d`, `main` en **avance rapide**, aucun `git pull`, aucun merge, aucun push forcé |

### Le compte, avant → après

Ce que la forge savait dire hier du contenu d'une vue dérivée, et ce qu'elle sait dire
aujourd'hui. Le chiffre qui compte est celui de la première ligne : aucun oracle ne jugeait ce
qu'une vue contient, un le juge — c'est là qu'une décision cesse de pouvoir disparaître en
silence.

| Mesure | Avant (`be41b25`) | Après (`c8be40d`) |
|---|---|---|
| Oracles qui jugent le **contenu** d'une vue dérivée | **0** sur 13 | **1** — `oracle-tracabilite` T5 |
| Vue amputée d'un tiers, en-tête intact | **PASS**, exit 0 | **FAIL**, exit 1, la règle et la cause nommées |
| Verdicts prononçables sur le corps d'une vue | 0 | **3** — PASS, FAIL, `SANS_OBJET` motivé |
| Empreintes portées par une vue markdown | 1 (la source) | **2** (la source **et** le corps) |
| Cas joués par la branche du self-test | 0 | **6** (5 états + 1 témoin, dont la mesure d'avant rejouée) |
| Entrées d'oracle × règles au self-test | 13 × 50, VERT | **14 × 51, VERT** |
| Fixtures dédiées à T5 | 0 | **2**, même source et même en-tête, corps différents |
| `oracle-tracabilite` | v1.0.0, T1–T4 | **v1.1.0, T1–T5** |
| `derive-les-vues` | v1.4.0 | **v1.5.0** |

**Aucun verdict ne change hors périmètre**, et c'est vérifié plutôt que supposé : T5 rend
`SANS_OBJET` sur toute vue antérieure, donc les fixtures `verte`, `surface-implicite-verte` et
`exigences-socle-verte` gardent le verdict qu'elles avaient — le self-test entier le rejoue.

**Fichiers touchés** (10, commit `c8be40d`, +632 / −30) : `oracles\oracle-tracabilite.mjs`,
`oracles\self-test.mjs`, `oracles\registre-entrees.md`, `README.md`,
`skills\derive-les-vues\SKILL.md` et son `references\vues.md`, et les quatre fichiers des deux
fixtures neuves. Le dossier `input\` reste non suivi, comme pour les lots précédents.

## Ce qui n'a pas été fait, et l'écart à la lettre du lot

- **Les trois exclusions du lot sont tenues.** Aucune liste close de sections câblée (elle est
  citée, et le motif de ne pas la câbler est mesuré : RC-8). **Aucune migration** des vues déjà
  scellées — les trois vues des fixtures antérieures restent telles quelles, et T5 y déclare ce
  qu'elle ne juge pas. **Aucun changement du sceau de la source** ni de la chaîne de dérivation :
  `source-sha256` est inchangé au caractère près, T3 aussi.
- **Aucun `git pull`, aucun merge, aucun push forcé** ; `main` en avance rapide.
- **Écart 1 — un garde-fou non demandé, et il coûte un cas de recette (R-43, « renforcer oui,
  assouplir jamais »).** Le lot demandait de citer la prose du contrat dans le message d'échec. La
  forge a ajouté, en plus, le **cas 6** qui confronte la phrase citée au contrat. Motif : sans lui,
  ce lot **créait** le défaut que TF-0822 vient de nommer — une transcription de prose que rien ne
  relie à sa source. Coût : un cas de self-test, et une phrase de `vues.md` légèrement reformulée
  pour être citable telle quelle (« définies plus bas » remplace « (ci-dessous) »).
- **Le lot 20260905h** est **vu, non traité** : il n'est pas confié à ce run.

## digit-ai-forge-conception (`digit-ai-forge-conception`)

Instruire TF-0818 laisse deux résidus que le lot n'excluait pas et que le correctif ne couvre
pas : la **seconde** famille de vues, scellée par le même mécanisme incomplet, et le verdict
agrégé du point d'entrée déclaré de la forge. Le premier a une classe et entre au sidecar ; le
second n'en a pas et reste en prose, juste après le tableau.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RC-8 | majeur | générique | **La seconde famille de vues porte le même défaut, et la variante « liste close de sections câblée » ne le ferme pas.** Les vues par profil (`VUE-PO.md`, `VUE-CSM.md`, `VUE-UTILISATEUR.md`, dérivées de `RETRO-MODELE.md`) sont scellées par `source_sha256` en frontmatter, jugé par `oracle-vues-profil` VP2 — empreinte de la **source** seule, exactement l'état que TF-0818 vient de corriger sur la première famille. Cet oracle porte pourtant **déjà** la seconde variante que le lot laissait à notre jugement : VP4 vérifie une liste close de sections imposées par profil. **Mesure du 05/09/2026** sur `oracles\fixtures\vues-profil-verte` : la vue fait 750 caractères ; la section « Règles de gestion » **vidée de son contenu, le titre laissé en place** (162 caractères retirés, 22 %) → **VP1, VP2, VP3 et VP4 tous PASS, exit 0**. La liste câblée ne voit rien, parce qu'elle juge des titres et non du texte ; l'empreinte du corps, elle, l'aurait vu. Contre-mesure du même banc : la section retirée **avec** son titre fait bien échouer VP4 — c'est la seule amputation que la variante attrape, et ce n'est pas celle qui fait disparaître une décision. | Porter `corps-sha256` sur les vues par profil aussi, avec une règle VP5 jumelle de T5, et le même état `SANS_OBJET` pour les vues antérieures. Le format, le calcul et l'idiome de message sont écrits et éprouvés par ce lot : le coût est celui des fixtures. Corollaire pour la doctrine : **une liste de sections câblée ne remplace jamais une empreinte de corps** — elle prouve qu'un titre est là, jamais qu'il y a quelque chose dessous. |

**Portée** : RC-8 est *générique*. Il vaut pour toute forge qui scelle un artefact dérivé par
l'empreinte de sa source — l'idiome est employé par au moins deux familles de vues ici, et il est
recommandé ailleurs dans l'écosystème.

**RC-9 — sans classe, donc en prose et pas au sidecar.** *(mineur, générique.)* **Le verdict
agrégé du point d'entrée déclaré de la forge vaut FAIL sur toute cible, y compris verte.**
`manifeste.json` désigne `node oracles\run-oracles-conception.mjs <EXIGENCES.json>` comme
`point_entree_oracles`. Ce runner lance les dix oracles sur la cible ; sept d'entre eux ne jugent
pas `EXIGENCES.json`, et six l'annoncent proprement en `NON_JUGE` (exit 2, motif déclaré).
`oracle-retro-modele` est le septième, et il rend **FAIL** : il lit le JSON comme du Markdown et
constate l'absence de ses sections. **Mesure du 05/09/2026**, sur une fixture que ce lot ne touche
pas (`exigences-socle-verte`, verte pour ses cinq oracles applicables) : verdict agrégé **FAIL**,
`oracle-retro-modele` **FAIL**, les neuf autres PASS ou NON_JUGE. Le même verdict sort sur toute
cible correcte — un verdict qui vaut FAIL partout ne se prononce jamais, et un orchestrateur qui
le lit apprend zéro. La correction est locale : `oracle-retro-modele` doit sortir en **2**
(NON_JUGE) quand la cible n'est pas un `RETRO-MODELE.md`, comme le font déjà `oracle-constitution`
et `oracle-vues-profil`. **Aucune clé de `todo\CLASSES.json` ne le couvre** : la famille est
`regle-morte`, mais `recette-verdict-non-prononcable` parle d'outils non épinglés,
`garde-lexicale-frontiere-ascii` de frontières de mot, et les deux classes créées ce soir parlent
de sceaux et de transcription de prose. La classe qui manque serait « un verdict agrégé qui vaut
FAIL sur toute cible parce qu'un oracle hors domaine rend FAIL au lieu de NON_JUGE ». Le pilot
décide s'il la crée ; RC-9 entrerait alors au registre par elle.

## Remarques restées au produit

Trois constats sont restés ici, et chacun porte son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le générateur des fixtures neuves écrivait le sceau **sans** le saut de ligne que la règle consomme : la vue verte sortait à 2 650 caractères scellés pour 2 649 relus, et T5 la déclarait altérée alors qu'elle ne l'était pas | Le corps est défini une seule fois, comme « tout ce qui suit la ligne du sceau », et la même définition sert à l'écrire et à la relire ; la recette de calcul est écrite dans `vues.md` | **non**, mais la leçon est câblée | Un écart d'**un caractère** entre celui qui scelle et celui qui juge rend le contrôle inutilisable. C'est pourquoi la recette vit dans le contrat, et pas dans la tête du producteur |
| La branche de self-test nommait ses vues éphémères `2-amputee.md` : le rappel des sections attendues, indexé sur le **nom** de la vue, ne se déclenchait pas, et le cas 6 jugeait un message que personne ne reçoit | Chaque cas éphémère a son propre dossier, la vue gardant son nom réel `CADRAGE-DESIGN.md` | **non** | Trouvé par le self-test lui-même, en une passe : le cas 6 a échoué avant d'être vert. C'est le contrôle qui a fait son travail |
| `skills\derive-les-vues\SKILL.md` dépasse la limite de 100 lignes du validateur de structure `write-a-skill` : **118 lignes** après ce lot, **111 avant** | Rien : l'écart préexiste au lot, et il a été **réduit** en cours de route (128 lignes à la première rédaction, ramenées à 118 en déplaçant la recette et les exemples dans `references\vues.md`) | **non** | Verdict WARN du validateur, identique avant et après. Le mécanisme correct — pousser le détail vers `references/` — a été appliqué ; le franchissement de la limite est antérieur et n'appartient pas à ce lot |

## Retours sur les documents produits

Aucun document produit depuis un gabarit. Le travail a porté sur du code d'oracle, des fixtures
et des références de skill. Le seul gabarit employé est celui de la remise elle-même
(`gabarits\RETOURS-FORGES.md`).

## Confirmations positives

- **La boucle du pilot s'est refermée en un jour, et elle est vérifiable.** Le constat RC-5 du lot
  `20260905b`, remis **sans sidecar faute de classe**, a produit la classe
  `sceau-de-vue-provenance-sans-contenu`, puis l'item TF-0818, puis ce lot de travaux, puis la
  règle T5. Le mécanisme « un constat sans classe se décrit en prose » n'a rien perdu en route.
- **Le lot en boîte ne passe plus la porte qui l'a produit, et c'est une bonne nouvelle.**
  `node gabarits\oracle-travaux-pilot.mjs` rend aujourd'hui **FAIL** sur `20260905e` : la règle
  **T6** (« tout module producteur nommé porte sa ligne de lecture déclarée ») refuse le lot, qui
  nomme `derive-les-vues` sans citer la ligne qui prouve ce qu'il produit. Le lot déclare lui-même
  n'avoir été joué que sur **T1 à T5** : T6 est **postérieure** à son dépôt, née de RC-4 la veille
  et portée par TF-0819. Ce n'est donc pas un défaut du pilot, c'est la preuve que la règle est
  vivante et qu'elle aurait attrapé le lot si elle avait existé. Le module nommé est le bon —
  `derive-les-vues` produit bien les trois vues (`SKILL.md`, section « Les trois vues »), ce qui
  est vérifié ici avant d'écrire une ligne. **Aucune candidature n'est ouverte** : TF-0819 couvre
  déjà la règle.
- **La fixture isolante marche une troisième fois, et d'un cran plus fin.** `corps-de-vue-rouge`
  rend **1 FAIL sur 16 constats**, la verte **0 sur 16** — et surtout **T3 reste PASS des deux
  côtés**. La preuve ne dépend pas d'une fixture qui échoue partout, ni même d'une fixture qui
  échoue sur la règle voisine.
- **La mesure d'avant correctif est entrée dans la recette.** Le cas 3 de la branche ne raconte
  pas le défaut, il le **rejoue** : la même vue amputée, sans empreinte de corps, rend toujours
  exit 0. Le jour où quelqu'un croira pouvoir supprimer le `SANS_OBJET`, la recette le dira.
- **La normalisation `eol=lf` a tenu une fois de plus** (TF-0114) : deux fixtures neuves scellées
  sur des empreintes calculées en LF passent T3 **et** T5 sur un poste dont `core.autocrlf`
  réécrit le reste en CRLF.
- **La porte de publication a été jouée avant le `push`, pas après** : PASS sur les contenus, les
  noms de fichiers **et** les messages de commit, référentiel de 5 termes.

## Ordre recommandé

1. **RC-8 d'abord** — c'est le même défaut, sur la même forge, à un fichier de distance, et il
   porte une information qui vaut au-delà : la variante « liste close câblée », que le lot
   présentait comme la seconde option, est **mesurée insuffisante seule**. Tant que RC-8 tient, la
   moitié des vues de la forge est protégée et l'autre non, ce qui est le pire état — parce que la
   doctrine, elle, dit désormais que les vues sont scellées.
2. **RC-9 ensuite** — mineur et local, mais il touche le **point d'entrée déclaré** au manifeste :
   c'est ce qu'un orchestrateur lit en premier, et il y lit FAIL quoi qu'il arrive.

## La règle qui aurait évité le retour

Aucun des deux retours ne suit un retour humain : les deux ont été trouvés par l'instruction
elle-même, en câblant TF-0818. La règle est donc nommée pour ce qu'elle vaut.

- **RC-8 — la classe existe, et c'est celle que le pilot a créée ce matin.**
  `sceau-de-vue-provenance-sans-contenu` (famille `regle-morte`) dit mot pour mot ce que RC-8
  constate : « le sceau d'une vue dérivée prouve sa provenance, jamais son contenu ». Sa règle
  écrite mentionne d'ailleurs les **deux** variantes — l'empreinte du corps *ou* la liste close de
  sections jugée par l'oracle de traçabilité. RC-8 apporte la mesure qui les départage : sur
  `oracle-vues-profil`, la liste close **est déjà câblée** (VP4) et laisse néanmoins passer une
  section vidée de son contenu. La règle de la classe gagnerait à porter cette précision — les
  deux variantes ne sont pas équivalentes, la seconde ne remplace pas la première. C'est la seule
  ligne du sidecar.
- **RC-9 — aucune clé ne le couvre, et il n'est donc PAS au sidecar.** La règle existe : un oracle
  hors de son domaine sort en **2** et non en **1**, c'est le contrat commun de cette forge, écrit
  dans `oracles\_contrat.mjs` et rappelé dans son README (« un orchestrateur doit distinguer 1 de
  2 : le premier est un verdict, le second une incapacité à juger »). Ce qui manque n'est pas la
  règle, c'est le contrôle qui la joue sur le runner agrégé. La classe qui conviendrait est le
  pendant « verdict agrégé » de `recette-verdict-non-prononcable`. Le pilot décide s'il la crée.
- **Aucun défaut de lot ouvert.** Le lot `20260905e` nomme le bon module producteur, et sa seule
  faute au regard de la porte actuelle (T6, la ligne de lecture déclarée) est **antérieure** à
  l'existence de cette règle. Elle est décrite en confirmation positive plus haut, sans
  candidature : TF-0819 la couvre déjà.
