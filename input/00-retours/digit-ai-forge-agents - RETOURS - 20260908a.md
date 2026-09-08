# Retours forges — digit-ai-forge-agents — 20260908a

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260908a` (un item, TF-0887), reçu dans
  `input\00-travaux\` de la forge et joué sur mandat humain du 08/09/2026 (action A-68, décision
  D-31 (a)). L'ordre recommandé par le lot a été tenu : les pistes de la porte d'abord, le hameçon
  ensuite. Le lot déposé porte désormais `traite le 2026-09-08`.
- **Références ledger** : aucune — le dépôt `digit-ai-forge-agents` ne porte pas de
  `forge\ledger.jsonl` (c'est une forge, pas un produit instancié). La preuve tient au commit
  `bfdb251`, **publié sur `main` en avance rapide** (`edfdb2e` → `bfdb251`), et aux recettes
  rejouées citées ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-08

## Ce que le lot de travaux a produit

Le lot confiait quatre parties d'un même item, dans un ordre justifié : la porte doit savoir où
chercher avant que le hameçon ait quelque chose à répéter. Le tableau qui suit dit, pour chaque
partie demandée, ce qui a été écrit et par quelle preuve exécutée elle se vérifie ; les mesures
rouges, les comptes et les écarts viennent juste en dessous. Il se lit une ligne à la fois : la
colonne du milieu est le geste, celle de droite le verdict qui l'atteste.

| Partie du lot | Ce qui a été fait | Preuve exécutée |
|---|---|---|
| **(1)** les pistes par défaut connaissent le canal | `resoudreReferentiel()` et `resoudreProduits()` poussent, **après** `--referentiel`/`--produits` et **après** les deux variables d'environnement, `<racine>\_confidentiel\tables\noms-interdits.json` et `…\produits-pseudonymes.json`. Les anciens fichiers libres restent **en dernier recours**, aucune piste retirée. | Porte jouée sur la forge **sans argument et sans variable** : **SKIP → PASS en C1-C5**. |
| **(1 bis)** la racine, dans l'ordre | `FORGE_ROOT` quand elle est posée — sinon les deux racines qu'on devine : le parent du dépôt jugé, puis le parent de la forge (le cas d'un `.bundle` jugé en zone temporaire, où seule l'implantation de la forge dit encore où est la racine). Une racine **déclarée** est aussi ce qui rend la marche mesurable : un banc y pointe une racine jetable et la porte cesse de pouvoir atteindre le canal réel du poste. | Cas neuf de la recette : la porte trouve les tables par le **parent du dépôt jugé**, sans la moindre variable. |
| **(1 ter)** la piste retenue est nommée | Le `non_juge` porte « table lue (référentiel des noms interdits) : … » et « table lue (pseudonymes de produits) : … ». Depuis que la porte cherche toute seule, le verdict seul ne dit plus **laquelle** des tables a été lue — celle du canal, un ancien fichier libre, ou celle d'un banc jetable. | Cas neuf de la recette : les deux chemins du canal jetable sont exigés dans le `non_juge`. |
| **(2)** le hameçon laisse la porte résoudre, et répète le motif d'un SKIP | Le `pre-push` fabriqué **ne grave aucun chemin** : un chemin résolu à l'installation est vrai le jour de la pose et périme en silence — les tables ont déménagé le 07/09, un hameçon posé la veille aurait pointé un fichier disparu sans que rien ne le dise, et le même geste se rejoue sur l'autre poste où la racine n'est pas au même endroit. Sur SKIP il imprime le motif **en clair, en entier**, préfixé « porte SKIP : », avant de refuser. | Cas de recette renforcé : le refus doit porter `verdict SKIP` **et** « porte SKIP : … » **et** le motif du référentiel absent. |
| **(3)** les autres lecteurs des tables | Recherche exhaustive dans l'arbre suivi : **`oracle-nom-client-publie.mjs` est le seul lecteur des deux tables** dans cette forge. Les deux autres fichiers qui les nomment (`self-test.mjs`, `self-test-hamecon-publication.mjs`) les **fabriquent** en zone jetable, ils ne les résolvent pas. Aucun anonymiseur ne vit ici. | Recherche sur `noms-interdits` et `produits-pseudonymes` : 3 fichiers de code, 1 seul résolveur. Rien à recâbler. |
| **(4 a)** fixtures double sens à la recette de `quality-oracles` | Deux contrôles neufs, sur racine jetable et noms **inventés**. **VERT** : `_confidentiel\tables\` sous la racine, dépôt jugé dedans, aucun argument et aucune variable → la porte joue **C1 et C5** et nomme les deux tables lues. **ROUGE** : aucune table nulle part sous une racine déclarée → **SKIP motivé**, dont les pistes explorées listent le canal. | Recette de `quality-oracles` : **PASS, 226 contrôles** (224 avant ce lot), 0 échec. |
| **(4 b)** fixtures à `self-test-hamecon-publication.mjs` | Un **cas 5** neuf : racine jetable portant `_confidentiel\tables\`, dépôts dedans, `pre-push` fabriqué, **aucune variable d'environnement** — le dépôt porteur est refusé sur un verdict FAIL avec ses constats, le dépôt propre passe. Le **cas 4** (référentiel absent) exige désormais le motif en clair. | Banc du hameçon : **10 PASS, 0 FAIL** (7 avant ce lot), sur de vrais dépôts et de vrais `git push`. |
| **(0)** ce que le lot ne demandait pas | Aucune table copiée dans le dépôt. Aucune ancienne piste retirée. C1 à C5 inchangées, contrat de sortie `findings[]` inchangé, ordre de recherche de l'oracle par le `pre-push` inchangé. | Un contrôle de la recette vérifie que chaque constat C5 porte `sev`, `msg` et `where` ; les fixtures rouge et verte des bundles rendent toujours FAIL et PASS. |

**Le rouge d'abord, et il porte sur les deux correctifs.** Les cas neufs ont été joués sur le code
**d'avant**, en le ramenant à son état antérieur le temps d'une passe puis en le restaurant.

| Ce qui a été joué | Ce que la recette a rendu |
|---|---|
| Les deux cas neufs de `quality-oracles`, contre la porte d'origine | **2 échecs** — « la porte appelée SANS argument et SANS variable rend encore SKIP alors que le canal est sous la racine du dépôt jugé » et « le motif du SKIP ne liste pas la piste du canal ». |
| Le cas 5 du banc du hameçon, contre la porte d'origine | **2 échecs** — dépôt **porteur** ET dépôt **propre** refusés sur SKIP. C'est la panne du 07/09 reproduite à l'identique : le garde-fou refuse tout, y compris le travail juste. |
| Le cas 4 du banc, contre le hameçon d'origine | **1 échec** — « refus SANS motif lisible ». |
| Tous les cas, contre le code corrigé | **Verts.** Fichiers restaurés, différence vérifiée, recettes à 226 et 10. |

**Les comptes, avant et après.** La recette de `quality-oracles` passe de **224 à 226** contrôles ;
le banc du hameçon de **7 à 10** cas ; le banc du hook d'écriture reste à **37** (ce lot n'y touche
pas). La porte de publication sur cette forge passe de **SKIP** à **PASS en C1-C5** lorsqu'elle est
jouée sans argument et sans variable. Le registre des oracles passe de **2.18.0 à 2.19.0** (vue
humaine alignée), et `maj-versions-livrees --livrer` a soldé l'écart unique qui en découlait. Neuf
fichiers suivis ont changé, tous dans le dépôt de la forge, dont un seul créé
(`quality-oracles\fixtures\_produits-pseudonymes.json`, table de jeu d'essai aux noms inventés).

**Les écarts au lot, avec leur motif.** Trois, dont un seul porte sur la substance.

- **Le `pre-push` ne grave pas les chemins : il laisse la porte les résoudre.** Le lot ouvrait les
  deux voies (« passe les chemins résolus à l'installation **ou**, à défaut, laisse la porte les
  résoudre »). La seconde a été retenue, et le motif est écrit dans le hameçon lui-même : un chemin
  résolu à l'installation périme en silence — c'est exactement ce qui vient de se produire — et il
  suppose que la racine du poste qui pose le hameçon est celle du poste qui pousse. Une seule
  échelle de résolution dans le parc, tenue à un seul endroit.
- **Quatre fixtures préexistantes ont dû être rendues étanches**, et ce n'est pas un embellissement :
  sans cela le lot ne pouvait pas être vert. Le détail est en RC-1, avec la mesure.
- **Le commit a été rebasé sur `origin/main` avant publication.** Le lot annonçait `main` à
  `0e0c223` ; au moment de la publication, l'origine portait **cinq commits de plus** (`edfdb2e`),
  poussés par une autre session sur `digit-ai-schemas` et sur le registre `la-barre`. Le commit
  local a donc été **rebasé** sur `origin/main` — geste sur un commit local jamais publié, aucune
  histoire publiée touchée — de sorte que la publication reste une **avance rapide** stricte, sans
  envoi forcé, comme le mandat l'exige. Toutes les recettes et les deux verdicts de porte ont été
  **rejoués après le rebasage**, sur l'histoire réellement publiée.

**Les recettes de la forge, toutes rejouées après les écritures et après le rebasage** :
`quality-oracles\scripts\self-test.mjs` **PASS (226 contrôles)** · `self-test-hamecon-publication.mjs`
**10 PASS, 0 FAIL** · banc du hook `qo-gate-write.mjs --self-test` **37/37** ·
`forge-agents\scripts\self-test.mjs` 29 PASS, 0 FAIL · `experts-forge\scripts\self-test-routage.mjs`
7/7 · `write-an-expert\scripts\self-test-scaffold.mjs` 2/2 · `digit-ai-page-html\scripts\self_test.py`
173/173 · `self-test-gates-jq.sh` 28 PASS · `self-test-gate-budget.sh` 7 PASS ·
`oracle-etat-forge.mjs` sur `versions-livrees.json` **PASS** (13 skills, F1-F3 vérifiés) après
`maj-versions-livrees --livrer`.

**La porte de publication rend PASS des deux façons, et c'est la preuve du correctif.** Sur le dépôt
entier, à `bfdb251` : avec `--referentiel` et `--produits` pointant `c:\dev\_confidentiel\tables\`,
**PASS en C1-C5, zéro constat** ; puis **sans aucun argument et les deux variables d'environnement
retirées du processus**, **PASS en C1-C5, zéro constat**, le `non_juge` nommant les deux tables du
canal. Les deux verdicts sont identiques — avant ce lot, le second était **SKIP**. Le fichier non
suivi `run\rapport-jouet.md.oracles.json` n'a été ni supprimé ni commité, et les copies installées
sous `~\.claude\` n'ont pas été modifiées.

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Deux constats sont sortis du traitement de ce lot. Le premier a été corrigé ici parce que le lot
était invérifiable sans lui ; il est remonté parce que le mécanisme n'a rien de local. Le second
n'est pas corrigeable par un commit : il appelle un geste sur le poste et une décision du pilot.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-1 | majeur | générique | **Quatre fixtures rendaient un verdict qui dépendait de la machine, pas de la règle — et deux d'entre elles jugeaient une version de l'outil qui n'était plus celle qu'on venait d'écrire.** Le mécanisme s'est révélé en ajoutant la piste du canal, mais il lui préexiste. **(a)** Les deux bundles `nom-client-publie-red/green` du manifeste appelaient l'oracle **sans désigner leurs tables** : ils comptaient sur la marche « fichier voisin de l'artefact ». Dès qu'une piste plus large a été ajoutée, ils ont été jugés contre les tables **réelles du poste** — **mesuré le 08/09** : la fixture ROUGE rendait **PASS**, faute de trouver dans la table du parc le nom inventé qu'elle porte. Une fixture rouge qui passe est une fixture morte. **(b)** Les cas TF-0820 et TF-0880 de la recette **effaçaient** `FORGE_ROOT` pour s'isoler ; la marche « parent de la forge » atteint le canal réel sur un poste du parc, et le cas « C5 non jouée : table absente » a **trouvé une table** — il mesurait donc l'inverse de ce qu'il croit. **(c)** Le banc du hameçon héritait du vrai `$HOME` : le `pre-push` cherchant l'oracle d'abord dans `~\.claude\skills\`, le banc éprouvait la **copie montée** et non la source. **Mesuré le 08/09** : après modification de l'oracle, les quatre cas du banc restaient verts **sur la version de la veille**. **(d)** Son cas 4 (« référentiel absent ») tolérait le seul fragment « REFUSEE » et se satisfaisait d'un refus pour **« oracle introuvable »** : la branche SKIP n'était éprouvée par personne. Les quatre sont corrigés dans le commit `bfdb251` — tables désignées explicitement, racine jetable **déclarée** au lieu d'être effacée, copie de la **source** déposée au repli du hameçon avec `HOME` détourné, assertion du cas 4 durcie sur `verdict SKIP` **et** son motif. | La règle est générique et vaut pour toute forge à recettes : **une recette épingle ce qu'elle éprouve.** Trois déclinaisons. **(a)** Une fixture **désigne** sa donnée de jeu d'essai, elle ne la résout jamais par voisinage — le voisinage est une coïncidence de rangement, et il cède au premier élargissement de la résolution. **(b)** L'isolement d'un banc se fait en **déclarant** une racine jetable, jamais en effaçant une variable : effacer rend la main aux marches devinées, qui sont précisément celles qui atteignent le poste. **(c)** Un banc qui éprouve un **câblage** (hook, gate, lanceur posé) épingle la **version sous test** — le câblage garde son ordre de recherche réel, c'est le banc qui se met en position de juger ce qu'il modifie ; sans quoi il rend vert sur l'avant-dernière version, ce qui est le pire des verts. Un oracle transverse est envisageable : refuser une commande de fixture qui n'épingle pas ses données d'entrée vivant hors dépôt. |
| RC-2 | bloquant | générique | **Le correctif est publié et reste sans effet sur les postes tant que la copie montée n'est pas synchronisée — et rien ne le dit.** Le `pre-push` posé par `installer-hamecon-publication.mjs` cherche l'oracle **d'abord** dans `~\.claude\skills\quality-oracles\scripts\`, et seulement ensuite dans la source du dépôt. **Vérifié le 08/09/2026** : la copie montée sur ce poste date du 07/09 à 22:44 et diffère de la source ; elle ne connaît donc pas le canal. Conséquence exacte : **TF-0887 est corrigé, prouvé, poussé — et tout dépôt du parc portant le hameçon continue de refuser chaque push** jusqu'à ce qu'un humain joue `node sync-skills.mjs --sync --vers installation`. Aucune porte ne signale cet écart : `oracle-etat-forge` compare le **manifeste** au **dépôt** (F1-F3) et rend PASS ; `sync-skills --diff` sait le voir mais c'est un geste manuel, hors de toute recette et hors de l'ouverture de run. Le même piège vaut pour tout correctif futur de la porte, du gate d'écriture ou de n'importe quel script hérité par le poste. | Deux gestes, à trancher par le pilot. **(a)** Un geste immédiat, humain : `sync-skills --sync --vers installation` sur les deux postes, sans quoi ce lot ne produit aucun effet là où il compte. **(b)** Un geste structurel : faire dire à l'ouverture d'un run l'écart **dépôt ↔ installation** sur les scripts, pas seulement les versions de frontmatter — soit en ajoutant une règle F à `oracle-etat-forge` qui rend FAIL quand un script du dépôt diffère de sa copie montée, soit en branchant `sync-skills --diff` au hook `SessionStart` de la forge. La règle se dit : *un correctif qui vit dans un dépôt et s'exécute depuis une copie n'est pas livré tant que la copie n'a pas bougé ; l'écart entre les deux est une porte, pas une hygiène.* |

**Portée** — les deux constats sont *génériques*. RC-1 décrit une manière d'écrire les recettes qui
vaut pour toutes les forges à fixtures ; RC-2 porte sur le mécanisme d'installation des skills, qui
est le même dans tout le parc. Cette forge est seulement l'endroit où les deux se sont montrés,
parce que c'est là que vivent la porte et son câblage.

**Les classes.** RC-1 relève de `recette-verdict-non-prononcable` (famille `regle-morte`), en
**récidive** : le libellé de la classe dit « un verdict de recette dépend d'un outil non épinglé ou
d'oracles dont l'empreinte n'est pas consignée », et c'est exactement le cas — l'outil non épinglé
est ici tantôt la **copie** de l'oracle, tantôt la **table** que porte la machine. Le sidecar de ce
lot porte cette candidature. **RC-2 n'a pas de classe au référentiel** : les 46 clés de
`todo\CLASSES.json` ont été parcourues. `porte-sans-chemin-des-tables`, créée le 07/09, nomme le
défaut que ce lot vient de corriger, pas celui-ci ; `alias-de-transition-perime-survivant` et
`motif-exclusion-couvert-compte-absent` parlent d'héritage entre dépôts, jamais entre un dépôt et
une installation. La famille d'accueil naturelle serait `hook-ou-gate`, et la règle se dit :
*un artefact versionné dans un dépôt mais exécuté depuis une copie installée n'est livré qu'une fois
la copie alignée, et l'écart entre les deux est jugé à l'ouverture de run.* Une classe ne se crée
jamais dans un sidecar : le pilot reste seul juge de l'ouvrir, et RC-2 est décrit ici en prose pour
qu'il ait de quoi le faire.

## Remarques restées au produit

Aucune remarque n'est restée au produit — vérifié le 2026-09-08. Les deux constats sortis du
traitement portent l'un sur la manière d'écrire les recettes, l'autre sur le mécanisme
d'installation des skills : aucun n'est propre à cette forge, et les deux sont remontés ci-dessus
plutôt que corrigés en silence. Ce qui a été corrigé ici l'a été parce que le lot était
invérifiable sans, et le dit. Verdict de généralisation : **généralisable → remonté en RC-1 et
RC-2**.

## Retours sur les documents produits

Aucun document produit depuis un gabarit. Le chantier est un correctif de code (deux scripts), deux
blocs de recette, un manifeste de fixtures, une table de jeu d'essai neuve et deux mises à jour de
registre. Le seul gabarit employé est celui du présent lot de retours
(`gabarits\RETOURS-FORGES.md`) : rien ne lui a manqué à la lecture, et le lot 20260907a de la même
forge a servi de modèle de structure, section par section.

## Confirmations positives

Trois choses ont tenu en conditions réelles pendant ce run, et méritent d'être closes comme
vérifiées.

- **Le lot remontait un constat que la forge avait elle-même émis la veille, et la boucle s'est
  fermée en un tour.** Le constat RC-1 du lot 20260907a décrivait la panne, proposait deux voies (a)
  et (b) et laissait l'arbitrage au pilot ; le pilot a tranché (b) en l'élargissant, l'a confié avec
  l'ordre d'exécution, et le correctif a été écrit sans un seul aller-retour. Remonter le constat
  **et** la question ouverte, sans les trancher soi-même, reste le geste le plus rentable de cette
  boucle.
- **La mesure « variables retirées » demandée par le mandat était indispensable et non évidente.**
  Les deux variables sont posées au niveau utilisateur de ce poste et pointent vers le canal : la
  porte les lit **en premier**, et n'importe quelle mesure faite sans les retirer aurait rendu PASS
  avant comme après — le cas n'aurait rien discriminé et le correctif aurait été déclaré prouvé sans
  l'être. Un banc qui hérite de l'environnement du poste mesure le poste ; c'est la même racine que
  RC-1, vue depuis la ligne de commande.
- **Le rouge joué sur le code d'avant a trouvé plus que ce qu'on cherchait.** Ramener la porte à son
  état antérieur pour vérifier que les cas neufs échouent a fait tomber **deux fixtures
  préexistantes** (RC-1 a et b) qu'aucune lecture n'aurait signalées. Un cas rouge ne prouve pas
  seulement que le correctif sert : il rejoue tout le voisinage dans un état où les hypothèses
  tacites deviennent visibles.

## Ordre recommandé

1. **La synchronisation des copies montées d'abord** (RC-2, geste (a)), parce que sans elle ce lot
   n'a produit aucun effet là où la panne se manifeste : les dépôts du parc portant le hameçon
   continuent de refuser chaque push, et chaque jour qui passe ajoute des gens pour qui
   `--no-verify` est devenu le geste normal.
2. **RC-2 geste (b) ensuite**, parce que le piège se rejouera à l'identique au prochain correctif de
   la porte, du gate d'écriture ou de tout script hérité par le poste — et qu'il se rejouera en
   silence, avec des recettes vertes.
3. **RC-1 en dernier**, parce qu'il est corrigé là où il a été trouvé et qu'il n'immobilise rien.
   Son intérêt est la règle, pas le geste : les autres forges à fixtures gagnent à la recevoir avant
   d'ajouter leur prochaine marche de résolution.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot traite des travaux confiés, pas un retour humain sur un livrable. La règle nommée l'est donc
pour la classe de l'item traité et pour celles des deux constats remontés.

- **TF-0887 relève de `porte-sans-chemin-des-tables`**, créée par le pilot le 07/09, et la règle qui
  l'aurait évité est celle que ce lot vient de câbler : *la porte connaît le canal confidentiel dans
  ses pistes par défaut, et tout hook qui l'appelle lui passe les chemins ou la laisse les résoudre ;
  un SKIP dit son motif et le hook le répète.* Ce qui manquait n'était pas la connaissance du
  déplacement — il était décidé, documenté, et deux variables d'environnement avaient été posées le
  jour même pour tenir le coup. Ce qui manquait était de traiter le déplacement d'une donnée comme
  un **changement de contrat pour ses consommateurs**. La béquille a fonctionné, et c'est
  précisément pourquoi la panne est restée invisible sur le poste qui l'avait posée : elle ne se
  voyait que sur un poste ou un clone qui ne l'avait pas. La règle se dit plus largement : *une
  béquille posée à la main pour absorber un déplacement de donnée masque la panne au lieu de la
  révéler ; elle se pose avec une date de péremption et un cas de recette qui l'ignore.*
- **RC-1 relève de `recette-verdict-non-prononcable`, en récidive**, et la règle qui l'aurait évité
  est celle-ci : *une recette épingle ce qu'elle éprouve — sa donnée d'entrée comme la version de
  l'outil sous test.* Les quatre fixtures étaient justes le jour de leur écriture et le sont restées
  aussi longtemps que la résolution par défaut n'a pas bougé. Elles ne se sont pas cassées : elles
  ont cessé de mesurer ce qu'elles croyaient mesurer, en silence, et la seule chose qui a changé est
  **hors du dépôt**. Une fixture qui dépend d'une convention de rangement est un contrôle dont le
  périmètre est écrit ailleurs que dans son code — et personne ne relit une convention quand il
  élargit une résolution.
- **RC-2 n'a pas de classe au référentiel, et se décrit donc en prose** (voir la section du
  constat). La règle qui l'aurait évité est la loi transverse n° 1 dans sa variante d'installation :
  *toute affordance est câblée ou n'existe pas* — et une affordance qui vit dans un dépôt mais
  s'exécute depuis une copie n'est câblée qu'une fois la copie alignée. Le parc sait déjà comparer
  les deux arbres (`sync-skills --diff`) et sait déjà comparer les **versions livrées** aux versions
  montées (`oracle-etat-forge`, F1) ; ce qui manque est le contrôle du **contenu des scripts** entre
  le dépôt et l'installation, au moment où quelqu'un peut encore agir. Un correctif qu'on pousse en
  croyant l'avoir livré est plus coûteux qu'un correctif qu'on n'a pas écrit : il ferme le sujet.
