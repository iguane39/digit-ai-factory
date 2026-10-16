# Retours forges — digit-ai-forge-agents — 20260906a

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905i` (item unique TF-0824, le contrat
  de SORTIE de `run-oracles.mjs` sans domicile écrit), reçu dans `input\00-travaux\` de la forge
  et joué sur mandat humain du 06/09/2026 (« A50 »). Le lot 20260905g, dont celui-ci devait suivre
  l'instruction, portait bien `traite le 2026-09-05` : l'ordre demandé est tenu.
- **Références ledger** : aucune — le dépôt `digit-ai-forge-agents` ne porte pas de
  `forge\ledger.jsonl` (c'est une forge, pas un produit instancié). La preuve tient au commit
  `9454701`, **fait localement sur `main` et NON POUSSÉ**, et aux recettes rejouées citées
  ci-dessous. Le motif du non-push est le premier constat remonté (RC-2).
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-06

## Ce que le lot de travaux a produit (TF-0824)

Le lot confiait quatre parties dans un ordre justifié — le document d'abord, la recette ensuite —
et les quatre sont faites dans cet ordre. Le tableau qui suit dit, pour chaque partie demandée, ce
qui a été écrit et par quelle preuve exécutée elle se vérifie ; les mesures rouges, les comptes et
les écarts viennent juste en dessous. Il se lit une ligne à la fois : la colonne du milieu est le
geste, celle de droite le verdict qui l'atteste.

| Partie du lot | Ce qui a été fait | Preuve exécutée |
|---|---|---|
| (1) un contrat de SORTIE écrit à côté du contrat d'entrée | Fichier neuf `.claude\skills\quality-oracles\references\contrat-sortie-runner.md` : la sortie texte partie par partie, la ligne de résultat caractère par caractère, les quatre replis du champ `detail` quand l'oracle ne rend aucune raison, ses trois enrichissements (cache, promotion des avertissements au niveau `production`, lignes fabriquées par le lanceur lui-même), les lignes d'exemption, les quatre verdicts avec leurs codes de sortie, les modes `--json` et `--verifier-empreinte`. | Le document est lui-même jugé : `run-oracles.mjs` sur ce fichier rend **CONFORME**, 3 PASS / 4 SKIP / 0 échec. |
| (1 bis) la VERSION du contrat | `Version du contrat : 1.2.0` en tête, avec la règle écrite : tout changement futur incrémente la version, met à jour le tableau d'historique **et** se déclare au registre du pilot par un lot de retours. | Un contrôle de recette refuse un document sans version. |
| (2) la recette éprouve le contrat | Trois contrôles neufs à `scripts\self-test.mjs`. L'expression opposable n'est **pas recopiée** : le document la porte à la ligne `ligne-fail = …` (§2.4) et la recette la **lit là**. Une forme changée d'un seul côté fait rougir le banc, quel que soit le côté. | Recette de `quality-oracles` : **PASS, 221 contrôles** (218 avant ce lot), 0 échec. |
| (2 bis) le sens rouge : une ligne sans l'en-tête de compte est refusée | Le cas rouge fabrique la ligne d'**avant le 05/09** en retirant l'en-tête de la ligne réellement rendue, et exige qu'elle soit refusée par la forme documentée. | Trois rouges mesurés, détaillés ci-dessous — dont celui-ci, joué en affaiblissant l'expression documentée. |
| (3) l'historique des deux changements | Tableau daté dans le document : **1.0.0** (avant le 26/08), **1.1.0** (26/08, TF-0659), **1.2.0** (05/09, TF-0815), chacune avec ce qui a changé dans la sortie et si la rupture est assumée. Les deux versions antérieures n'ont jamais été écrites à l'époque et portent la version qu'elles **auraient** portée — c'est dit en clair. | Un contrôle de recette exige les deux dates `2026-08-26` et `2026-09-05` dans le document. |
| (4) tout changement futur incrémente la version | Écrit en §7 du document comme une règle, pas comme un vœu, et **câblé** : la recette compare la forme documentée à la ligne rendue, donc un changement du code sans changement du document fait rougir le banc avant d'atteindre un lecteur. | Rouge n° 1 ci-dessous : le lanceur ramené à sa forme d'avant le 05/09 fait échouer la recette. |
| (0) le contrat lui-même ne bouge pas | `run-oracles.mjs` n'est **pas modifié** d'un caractère ; le contrat d'ENTRÉE des oracles CLI n'est pas touché non plus. | `git diff` sur `scripts\run-oracles.mjs` : vide, après chacune des trois mesures rouges. |

**Les trois rouges, mesurés avant le vert et des deux côtés du contrat.** Un contrat écrit qu'aucun
rouge n'éprouve est une prose de plus ; un contrôle qui accepte tout n'est pas un contrôle. Les
trois sens ont donc été joués séparément, chacun en restaurant l'état d'origine ensuite.

| Ce qui a été cassé exprès | Ce que la recette a rendu |
|---|---|
| `run-oracles.mjs` ramené à sa forme d'avant le 05/09 (en-tête de compte retiré du champ `detail`) | **ROUGE** — « la ligne rendue ne suit PAS la forme documentée — contrat et code ont divergé ». Fichier restauré, `git diff` vide. |
| Le document du contrat retiré le temps d'une passe | **ROUGE** — « `contrat-sortie-runner.md` absent — le contrat de SORTIE du lanceur n'a pas de domicile ». |
| L'en-tête de compte retiré de l'**expression documentée**, le code intact | **ROUGE sur le cas rouge** — « une ligne SANS en-tête de compte passe la forme documentée : l'expression est sans dents, elle aurait accepté la sortie d'avant le 05/09 ». |
| Rien (état livré) | **VERT** — la ligne rendue par le lanceur sur une fixture fautive passe la forme, et la ligne d'avant le 05/09 est refusée. |

**Les comptes, avant et après.** La recette de `quality-oracles` passe de **218 à 221** contrôles,
tous verts. Le banc du hook reste à **37** cas, tous verts : ce lot ne touche pas au hook. Aucun
contrôle préexistant n'a été retiré ni réécrit.

**Les écarts au lot, avec leur motif.** Trois, dont un seul porte sur la substance.

- **Le contrat d'ENTRÉE n'est pas où le lot le situe.** Le lot écrit que
  `references\regles-oracles.md` décrit le contrat d'entrée des oracles CLI. Vérifié : ce fichier
  porte les règles canoniques d'audit **R1 à R10**, et la chaîne
  `{oracle,domaine,artefact,verdict,findings[],non_juge[]}` n'y figure pas — elle vit dans
  `SKILL.md`, section « Outillage », puce « Oracles CLI ». Le lot laissait le choix entre une
  section neuve dans `regles-oracles.md` et un fichier dédié : le fichier dédié a été retenu,
  **parce que** poser le contrat de sortie à côté du canon R1-R10 l'aurait éloigné du contrat
  d'entrée au lieu de l'en rapprocher. Le renvoi est donc posé dans `SKILL.md`, juste au-dessus de
  la puce du contrat d'entrée — là où un lecteur qui cherche l'un trouve l'autre.
- **`oracle-skills` du pilot n'a pas été rejoué, et les copies installées ne sont pas réalignées.**
  Le critère de vérification du lot dit « `oracle-skills` du pilot rend PASS après réalignement des
  copies installées ». Le réalignement de `~\.claude\skills\` sort du dépôt de la forge, et le
  mandat de ce run interdit d'écrire ailleurs. La remarque des trois lots précédents tient donc
  toujours : le contrat de sortie documenté vit dans le dépôt de la forge, pas encore dans la copie
  que les runs appellent.
- **Un seul commit, non poussé.** C'est le style de la forge pour un item unique ; le non-push,
  lui, n'est pas un choix de style et fait l'objet de RC-2 ci-dessous.

**Les recettes de la forge, toutes rejouées après les écritures** :
`quality-oracles\scripts\self-test.mjs` **PASS (221 contrôles)** · banc du hook
`qo-gate-write.mjs --self-test` **37/37** · `forge-agents\scripts\self-test.mjs` 29 PASS, 0 FAIL ·
`self-test-hamecon-publication.mjs` 7 PASS · `experts-forge\scripts\self-test-routage.mjs` 7/7 ·
`write-an-expert\scripts\self-test-scaffold.mjs` 2/2 · `self-test-gates-jq.sh` 28 PASS ·
`self-test-gate-budget.sh` 7 PASS · `oracle-etat-forge.mjs` sur `versions-livrees.json` **PASS**
(13 skills, F1-F3 vérifiés) après `maj-versions-livrees --livrer`. Le manifeste avait un écart à
solder — `quality-oracles` livré 2.12.0 pour un dépôt à 2.13.0 — et `oracle-etat-forge` le rendait
**FAIL en F1** avant le geste : la mesure avant/après du manifeste est donc, elle aussi, faite.

**La porte de publication, jouée avant le push et refusée.** `oracle-nom-client-publie` sur le
dépôt entier, avec les deux tables réelles, rend **FAIL, 8 constats C5** — et il les rendait déjà,
à l'identique, sur `main` **avant** ce lot, au commit `db3d391`. Aucun des huit ne vient des
fichiers écrits ici, aucun n'est dans le périmètre de TF-0824. Le push est donc **suspendu**,
conformément à la règle du mandat : pas de PASS, pas de push. Le détail est en RC-2.

**La source, jamais la copie installée.** Quatre fichiers suivis ont changé, tous dans le dépôt de
la forge : `references\contrat-sortie-runner.md` (neuf), `SKILL.md` (renvoi + version 2.12.0 →
2.13.0), `scripts\self-test.mjs` (trois contrôles), et `versions-livrees.json` (aligné). Le fichier
non suivi `run\rapport-jouet.md.oracles.json` n'a été ni supprimé ni commité. Les copies installées
sous `~\.claude\` n'ont pas été touchées.

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Deux constats sont sortis du traitement de ce lot, tous deux sur la porte de publication et tous
deux **préexistants** au lot : ils n'ont pas été corrigés ici parce que les corriger sortirait du
périmètre confié, et parce que l'un des deux appelle une décision, pas un geste.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-2 | bloquant | générique | **La porte de publication rend FAIL sur `main`, et ce lot ne peut donc pas être poussé.** Mesure du 06/09/2026, sur `main` au commit `db3d391` — c'est-à-dire **avant** toute écriture de ce lot — puis à l'identique après : `oracle-nom-client-publie` avec les deux tables réelles rend **FAIL, 8 constats C5**, tous dans le contenu de fichiers suivis, aucun dans un message de commit. Cinq sont des mentions **réelles** du nom de `Produit-09` suivi d'un toponyme, dans `experts-forge\fiches\expert-seo-web.md:6`, `experts-forge\fixtures\fixture-seo-web.md:9`, `experts-forge\references\corpus-seo-web.md:3`, `quality-oracles\fixtures\manifest.json:487` et `quality-oracles\fixtures\parite-migration-red.txt:1` — un dépôt **public** les sert aujourd'hui. Les trois autres sont des faux positifs (RC-3). Ce qui a changé entre le 05/09 et aujourd'hui n'est pas le dépôt mais la **table** : `_produits-pseudonymes.json` porte un horodatage du 2026-09-06 à 08:50 et une clé de trois lettres de plus, correspondant à `Produit-09`. Le lot du 05/09 pouvait donc écrire de bonne foi « porte PASS en C1-C5 » : la porte était verte parce que la clé n'existait pas encore, pas parce que le dépôt était propre. **Récidive** de la classe `anonymisation-portee-partielle` : une passe d'anonymisation qui ne couvre que les dépôts connus au moment où elle est jouée laisse les suivants découvrir le nom par la porte. | Deux gestes distincts, à trancher par le pilot parce qu'ils touchent trois skills que ce lot ne visait pas. **(a)** Les cinq mentions vivent dans de la prose de provenance (« constat de … du 21/07 ») : elles se remplacent par le pseudonyme sans rien perdre du sens, et le contenu de l'historique n'est pas concerné — C5 ne le balaie pas (RC-1 du lot 20260905c). **(b)** Décider si la mise à jour d'une table hors dépôt déclenche un balayage des dépôts déjà déclarés propres : sans ce réflexe, chaque clé ajoutée transforme une porte verte en porte rouge à la publication suivante, c'est-à-dire au pire moment. |
| RC-3 | majeur | générique | **La règle C5 cherche la clé littérale sans aucune frontière, donc une clé courte accuse à l'intérieur des mots et des blobs.** `porteProduit()` de `oracle-nom-client-publie.mjs` teste `hay.includes(p.cle)` pour la graphie littérale ; les variantes bornées par `(?<![A-Za-z0-9])…(?![A-Za-z0-9])` ne sont dérivées **que** si la clé porte au moins deux mots et huit lettres. Une clé courte d'un seul mot n'a donc jamais de frontière. **Mesure du 06/09/2026** : trois des huit constats C5 du dépôt tombent sur la même sous-chaîne d'un blob `base64` de police `woff2`, aux lignes `digit-ai-schemas\assets\exemple-reference.html:92`, `template-modele-donnees.html:93` et `template-multi-bandes.html:92` — soit **trois faux positifs sur huit constats, 37,5 % du bruit de cette passe**. Le coût n'est pas le bruit seul : il est qu'un lecteur pressé, voyant trois constats manifestement faux, décide que les cinq autres le sont aussi. La règle R3 des oracles (« déclarer ce qu'on ne juge pas ») est tenue, mais la précision, elle, ne l'est pas. | Appliquer à la graphie **littérale** la même frontière que celle déjà écrite pour les variantes, plutôt que `includes()` — le code existe deux lignes plus haut dans le même fichier. Un arbitrage reste à poser et il n'est pas mécanique : une clé courte purement alphanumérique se borne sans risque, mais borner une clé qui contient déjà un séparateur changerait le comportement de clés existantes. Une fixture double sens par forme de clé (courte d'un mot, longue de deux mots, clé à point, clé de chemin) rendrait l'arbitrage vérifiable au lieu de le laisser au jugement. |

**Portée** — les deux constats sont *génériques* : `oracle-nom-client-publie` est la porte de
publication de tout le parc, et la table des pseudonymes est partagée. Aucun des deux n'est propre
à cette forge ; cette forge est seulement l'endroit où ils se sont montrés aujourd'hui.

## Remarques restées au produit

Aucune remarque n'est restée au produit — vérifié le 2026-09-06. Les deux constats sortis du
traitement portent sur un oracle partagé et sur une table hors dépôt, jamais sur du code propre à
cette forge : ils sont donc remontés ci-dessus plutôt que corrigés en silence. Le seul geste local
qui aurait pu passer pour une correction « chez le produit » — remplacer les cinq mentions par le
pseudonyme — a été **écarté volontairement** : il touche trois skills que le lot ne vise pas, et le
faire sans décision aurait effacé la preuve du constat au moment même où il se découvre. Verdict de
généralisation : **généralisable → remonté en RC-2 et RC-3**.

## Retours sur les documents produits

Aucun document produit depuis un gabarit. Le chantier est un document de contrat écrit de zéro, un
renvoi dans un `SKILL.md` et trois contrôles de recette. Le seul gabarit employé est celui du
présent lot de retours (`gabarits\RETOURS-FORGES.md`) : rien ne lui a manqué à la lecture, et le
lot 20260905c de la même forge a servi de modèle de structure, section par section.

## Confirmations positives

Trois choses ont tenu en conditions réelles pendant ce run, et méritent d'être closes comme
vérifiées.

- **Le contrat lu à la source vaut mieux que le contrat recopié.** L'expression opposable vit dans
  le document et la recette va l'y chercher. Le troisième rouge le prouve dans le sens qui compte :
  affaiblir l'**expression** sans toucher au **code** fait rougir le banc, exactement comme
  affaiblir le code sans toucher à l'expression. Une copie dans le script aurait laissé les deux
  dériver en silence — c'est le défaut même que TF-0824 nomme.
- **La porte de publication a fait son travail, et c'est pour cela qu'il n'y a pas de push.** Elle
  a arrêté un dépôt public sur un nom réel, sans rien savoir de ce lot, et sur un défaut plus ancien
  que lui. C'est le comportement voulu : une porte qui ne bloque que le travail de celui qui la joue
  ne sert à rien.
- **Le rouge d'abord a corrigé la description du travail, une fois de plus.** Le premier rouge
  visait le code ; c'est en le jouant qu'est apparu le besoin du troisième, sur l'expression. Une
  forme documentée peut être vraie et sans dents, et rien dans le lot ne demandait de le vérifier.

## Ordre recommandé

1. **RC-2 d'abord**, parce qu'il bloque une publication et qu'il grandit avec le temps : chaque
   commit de plus est un commit de plus servi par l'hébergeur au-dessus des mêmes cinq mentions.
   C'est aussi le seul des deux qui appelle une décision du pilot plutôt qu'un correctif.
2. **RC-3 ensuite**, parce qu'il change la lecture de RC-2 sans en changer la substance : une fois
   les faux positifs éteints, la porte dira cinq constats et non huit, et le prochain lecteur ne
   perdra pas son crédit sur trois lignes de `base64`.
3. **Le réalignement des copies installées en dernier**, hors périmètre de ce lot mais toujours
   ouvert depuis trois lots : le contrat de sortie documenté, comme la règle C5 avant lui, n'existe
   pour l'instant que dans le dépôt de la forge.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot traite des travaux confiés, pas un retour humain sur un livrable. La règle nommée l'est donc
pour la classe de l'item traité et pour celles des deux constats remontés.

- **TF-0824 relève de la classe `contrat-de-sortie-sans-domicile`**, celle que le pilot a créée le
  05/09 en l'entrant au registre, et la règle qui l'aurait évité est celle que ce lot vient de
  câbler : *un outil hérité par d'autres dépôts porte un contrat de SORTIE écrit et versionné à
  côté de son contrat d'entrée.* Ce qui manquait n'était pas la connaissance du format — deux
  commentaires de `run-oracles.mjs` le décrivent très bien, à l'endroit exact où il se construit —
  mais un **domicile** : un commentaire dit pourquoi le code fait ce qu'il fait, il ne dit pas à un
  lecteur extérieur ce qu'il peut attendre, et il ne porte pas de version qu'on puisse surveiller.
  C'est la loi transverse n° 1 dans sa variante documentaire : un contrat non écrit à un endroit
  citable n'existe pas pour celui qui le consomme.
- **RC-2 relève de `anonymisation-portee-partielle`, en récidive**, et la règle qui l'aurait évité
  n'est pas celle de la porte mais celle de la **table** : *une donnée volatile qui commande une
  porte fait rejouer la porte partout où elle a déjà été jouée.* La loi transverse n° 4 dit qu'un
  référentiel périssable vit éditable, daté et sourcé ; elle ne dit pas encore ce qui se passe
  quand il grandit. Ici, la table a gagné une clé à 08:50 et six dépôts déclarés propres la veille
  ont cessé de l'être sans qu'aucun d'eux ne le sache. Le lot du 05/09 a écrit « PASS en C1-C5 » de
  bonne foi et cette phrase était vraie au moment où elle a été écrite — ce qui est exactement le
  mode de défaillance que la classe nomme.
- **RC-3 n'a pas de classe au référentiel, et se décrit donc en prose.** Les 37 clés de
  `todo\CLASSES.json` ont été parcourues. La plus proche est `garde-lexicale-frontiere-ascii`, et
  elle ne convient pas : elle nomme une garde qui emploie **la mauvaise** frontière (la frontière
  ASCII du moteur, qu'un accent casse), alors qu'ici la garde littérale n'en emploie **aucune** —
  `includes()` n'a pas de frontière à se tromper. La différence n'est pas de degré : dans un cas le
  correctif est de changer d'assertion, dans l'autre il est d'en poser une. La règle qui aurait
  évité le retour se dit ainsi : *deux chemins qui cherchent le même terme dans le même oracle
  appliquent la même règle de frontière ; celui qui n'en applique aucune est le trou.* Le voisinage
  est celui de `garde-lexicale-frontiere-ascii` et de `fixture-jugee-par-son-seul-oracle` — une
  fixture double sens par **forme de clé** aurait montré le trou le jour où C5 a été écrite. Le
  pilot reste seul juge de créer une classe : une classe ne se crée jamais dans un sidecar, et le
  sidecar de ce lot ne porte donc qu'une ligne, celle de RC-2.
