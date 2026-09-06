# Retours forges — Produit-12 — 20260906b

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905k` (item de registre TF-0819 — trois
  artefacts hérités périmés : `forge\travaux\TRAVAUX-PILOT.md`, `forge\travaux\oracle-travaux.mjs`,
  `forge\retours\CLASSES.json`), reçu dans `input\00-travaux\` du produit et joué sur mandat humain
  du 06/09/2026 (« A52 »). Le travail confié est fait : R-47 passe de FAIL à PASS, les trois
  fichiers sont commis chez le produit.
- **Références ledger** : aucune — le mandat interdit expressément d'écrire dans
  `forge\ledger.jsonl` du produit pendant cette boucle. La preuve tient au commit `7ba309e` (local,
  non poussé — le produit décide seul de sa publication) et aux oracles rejoués, cités ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
  L'indice est **`b`** et non `a` : l'indice `a` du 06/09 était déjà pris par un autre lot de ce
  produit, remis **et ingéré** le matin même (suivi par git, commit `e3031e1`). Le fait est raconté
  en RS-29, parce qu'il a d'abord été un écrasement avant d'être un indice.
  Aucune copie n'a été gardée chez le produit et son `INDEX-DES-LOTS.md` n'a pas été touché : le lot
  porte le pseudonyme du produit, qui n'est pas sa convention de nommage locale, et une autre
  session travaillait dans le dépôt au même moment. C'est un écart assumé au `CLAUDE.md` du produit,
  tranché par R-43 (mandat de la factory) et déclaré ici plutôt que passé sous silence.
- **Statut** : remis le 2026-09-06
- **Ids** : ce lot consomme `RS-25` à `RS-29` — la séquence du produit était à `RS-24`, frappé le
  matin même par le lot `Produit-12 - RETOURS - 20260906a`.

## Ce que le lot de travaux a produit (TF-0819)

Le lot confiait un travail en trois parties, et les trois sont faites. Le tableau dit ce qui a été
joué et par quelle preuve exécutée chaque partie se vérifie.

| Partie du lot | Ce qui a été fait | Preuve exécutée |
|---|---|---|
| (1) la remise à niveau en un geste, depuis le dépôt du produit | `node <PILOT_ROOT>\scripts\recopier-heritage.mjs .` — précédé d'un `--essai`, le mandat demandant de s'arrêter si le geste voulait écraser une modification locale. L'essai a rendu **3 à copier, 4 déjà conformes, 6 laissés** (modes personnalisés) ; aucun des trois à copier n'était modifié localement, et les quatre déjà conformes le sont restés. Rien n'a été écrasé, rien n'a été laissé de côté. | `[COPIÉ] forge/travaux/TRAVAUX-PILOT.md ← gabarits/TRAVAUX-PILOT.md` · `[COPIÉ] forge/travaux/oracle-travaux.mjs ← gabarits/oracle-travaux-pilot.mjs` · `[COPIÉ] forge/retours/CLASSES.json ← todo/CLASSES.json`. Après geste : `oracle-travaux.mjs` porte `VERSION = "1.1.0"`, `CLASSES.json` porte `version 1.2.0` et **37 classes**. |
| (2) rejouer le relevé | `node <PILOT_ROOT>\oracles\oracle-conformite-projet.mjs .` avant et après, sorties conservées et comparées finding par finding. | **Avant** : `R-47 · FAIL · « héritage du pilot non tenu — 0 absent(s), 3 périmé(s) »`. **Après** : `R-47 · PASS · « 11 artefact(s) hérité(s) présent(s) et à jour »`. Le diff des deux relevés ne porte **qu'une seule différence** : cette bascule. 248 constats FAIL avant, 247 après — aucun autre verdict n'a bougé (voir RS-27 sur ce que sont ces 247). |
| (3) commettre les trois fichiers recopiés, chez le produit, par le produit | Commit **partiel explicite** : `git add` des trois chemins, puis `git commit --only -- <les trois>`. Le dépôt portait au même moment onze modifications non commises et un renommage **déjà indexé** qui ne sont pas de cette boucle — aucun n'est entré dans le commit. Pas de push. | `7ba309e` — `3 files changed, 606 insertions(+), 1 deletion(-)`, dont `create mode 100644 forge/retours/CLASSES.json`. `git status` après commit : les onze modifications et le renommage indexé sont intacts, au même état qu'avant. La ligne de statut du lot reçu est passée à `traite le 2026-09-06` — seule édition faite dans `input\00-travaux\`. |

**Le moyen de vérification du lot est tenu, les trois branches** — `R-47 PASS` ;
`node forge\travaux\oracle-travaux.mjs "<le lot>"` imprime **six** règles, T6 comprise
(`oracle-travaux-pilot 1.1.0`, verdict PASS, T6 : « aucun module producteur nommé — rien à lire ») ;
`CLASSES.json` en `1.2.0`, 37 classes. Pour mémoire, le même oracle avant le geste imprimait
`oracle-travaux-pilot 1.0.0` et **cinq** règles : l'asymétrie que le lot décrit était réelle, et
elle est levée.

## digit-ai-factory (`digit-ai-factory`)

Cinq retours. Aucun ne conteste le travail confié : il est juste, il était dû, il est fait. Trois
portent sur le **canal** qui l'a acheminé, un sur ce que la commande de vérification rend à côté de
son verdict, et le dernier sur une immuabilité que rien ne tient — celui-là raconte une faute de
cette session, et il est ici pour cette raison.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-25 | majeur | générique | **La descente d'héritage atteint le disque et jamais l'histoire git ; R-47 juge le même disque, donc l'écart ne se voit nulle part.** Mesure du 06/09/2026, avant tout geste : `forge\retours\CLASSES.json` était **présent** chez le produit en version `1.0.0` (30 classes, datée du 03/09) et **non suivi par git** — `git status` le rangeait en « Untracked files ». Il n'a pu arriver que par une recopie d'héritage : il était donc là, conforme à une version du pilot, et absent de toute histoire. Au même instant, trois autres artefacts en mode `copie_conforme` étaient **conformes au pilot et non commis** : `forge\RESTITUTION.md`, `forge\hooks\factory.mjs`, `forge\retours\GABARIT-LOT-RETOURS.md` (`recopier-heritage.mjs --essai` les rend `[CONFORME]`, `git status` les rend `modified`). R-47 n'a rien dit d'aucun des quatre : avant le geste elle comptait « 0 absent, 3 périmés » sur le seul contenu, après elle rend « 11 artefacts présents et à jour » — verdict identique qu'ils soient versionnés ou non. Un clone neuf de ce dépôt repartirait sans les quatre, et R-47 y rendrait FAIL là où elle rend PASS ici. Le relevé du parc `todo\HERITAGE-RELEVES.jsonl`, qui alimente le délai de descente de `todo\RECIDIVES.md`, mesure ce même disque : il mesure l'état d'un **poste**, pas l'état d'un produit. | Deux gestes, tous deux petits. (1) R-47 relève l'artefact hérité **conforme mais non suivi par git** — un `git ls-files --error-unmatch <cible>` par artefact suffit, et le constat se formule comme les autres : « présent, conforme, hors histoire — ce poste l'a, le dépôt ne l'a pas ». Sans lui, la règle qui garantit que le produit *porte* son héritage rend PASS sur un produit qui ne le porte que jusqu'au prochain clone. (2) La voie de recopie — le script comme le hook — imprime en fin de geste la ligne `git add` exacte des fichiers qu'elle vient d'écrire : elle sait déjà les nommer, elle les liste. Le commit reste la décision du produit ; ce qui manque, c'est qu'il soit *proposé*. |
| RS-26 | majeur | générique | **Le lot demande à la main un geste que le hook d'ouverture fait seul depuis le 30/08, et ne le dit pas ; et l'outil manuel n'a aucune garde git.** Lecture du code, deux faits. (a) `oracles\hook-ouverture.mjs` recopie, à chaque ouverture d'un produit portant le lanceur, **tous** les artefacts en mode `copie_conforme` de `HERITAGE.json` (l. 86-95, `copyFileSync`) — c'est-à-dire **exactement les trois** de TF-0819, que `HERITAGE.json` déclare tous trois `copie_conforme`. Le pilot le sait et l'imprime : son propre relevé du parc écrit, pour un produit portant le lanceur, « — remis à niveau à sa prochaine ouverture (copies identiques) ; le reste est un geste du produit » (l. 198). Ce produit porte le lanceur (`forge\hooks\factory.mjs` conforme) et son câblage (`.claude\settings.json`, `SessionStart` → `node forge/hooks/factory.mjs ouverture`). Le lot, lui, argumente comme si la voie manuelle était la seule et ne cite jamais la voie automatique. La différence réelle entre les deux voies n'est pas la recopie : c'est le **commit**, que le lot demande (partie 3) et que la voie automatique ne fait pas — c'est-à-dire exactement RS-25. La valeur propre du lot est donc dans sa partie 3, et tout son argumentaire porte sur sa partie 1. (b) `recopier-heritage.mjs` écrit (`writeFileSync`, l. 85) sans consulter git : ni modification non commise, ni fichier non suivi. Trois artefacts hérités étaient modifiés-non-commis au moment du geste ; ils se sont trouvés conformes, donc rien n'a été perdu — mais la garde n'existait pas dans l'outil. Elle vivait dans la **prose du mandat humain** qui accompagnait ce lot (« si le script veut écraser un fichier modifié localement, arrête-toi »). Une garde qui vit dans un mandat ne protège que la session qui l'a reçu. `--essai` existe et fait le travail ; rien ne l'appelle avant le geste, ni le message de R-47 ni le lot. | (1) Quand la voie automatique couvre déjà le geste demandé, le lot le **dit** — une ligne dans « ce qui est demandé » : « votre hook d'ouverture recopie ces trois fichiers à votre prochaine ouverture ; ce que ce lot ajoute, c'est le commit ». Le lot devient alors deux fois plus court et deux fois plus juste. À poser dans `gabarits\TRAVAUX-PILOT.md`, pas dans un lot. (2) `recopier-heritage.mjs` interroge git avant d'écraser : une cible **modifiée non commise**, ou **non suivie** et divergente, fait basculer le geste en `--essai` — il liste, n'écrit pas, et demande `--forcer`. Le cas nominal (cible propre ou identique) n'est pas ralenti. *Une affordance non câblée n'existe pas* vaut aussi pour une garde. |
| RS-27 | majeur | générique | **La commande de vérification que le lot impose rend 247 constats FAIL, dont 242 (98 %) sur des fichiers que le `.gitignore` du produit exclut explicitement — et elle recopie dans son verdict les noms réels de 41 tiers.** Mesure du 06/09/2026 : `oracle-conformite-projet` rend `verdict: FAIL`, 247 findings FAIL — `R-4` 243, `R-25` 3, `R-2` 1. **242** d'entre eux portent des fichiers d'un **unique dossier d'`output\`** que le produit exclut par une ligne de son `.gitignore` assortie de son motif écrit (« noms réels de propriétaires et de locataires — produits localement, jamais versionnés »). Vérification faite : les 242 chemins passés à `git check-ignore` rendent **242 ignorés sur 242**. Ces 242 constats sont tous R-4 (« livrable sans nommage `<Marque> - <Objet> - AAAAMMJJ<indice>` ») sur des PDF rangés selon la norme documentaire du métier du client, et **41 dossiers** de leur chemin portent un nom réel de tiers, recopié tel quel dans le message du constat — verdict que le hook d'ouverture imprime à chaque démarrage de session. Le pilot applique déjà exactement ce raisonnement à ses propres journaux (D-1 (a) du 03/09 : `HERITAGE-RELEVES.jsonl` est suivi par git, **donc** il ne porte que des pseudonymes) ; la sortie d'un oracle joué **chez** un produit n'est couverte par aucune passe équivalente. Effet mesurable : les **5** constats réels du dépôt (4 R-4, 1 R-2) pèsent 2 % du verdict. Le mot est du pilot lui-même, dans le lot `20260905b` : « un gate qui bruite se contourne avant d'être corrigé ». | R-2 et R-4 ne jugent pas un chemin que `git check-ignore` déclare exclu du dépôt. Le mécanisme d'exclusion existe déjà et est déclaré (`input\`, `gabarits\`, `fixtures\`, `old\`, `.oracles\` sont hors jugement « par motif déclaré ») ; ce qui manque, c'est que le motif le plus fort — *le dépôt a écrit noir sur blanc que ce chemin n'entrera jamais dans son histoire* — n'en fasse pas partie. Un fichier qui ne sera jamais versionné n'est pas un livrable d'`output\` au sens de R-4 : c'est un artefact d'atelier, et R-2 le reconnaît déjà pour cinq autres dossiers. Bénéfice joint, et c'est le plus important : plus aucun nom de tiers ne sort dans un verdict d'oracle. Si l'exclusion doit rester un choix explicite plutôt qu'une déduction, un champ déclaré côté produit fait le même travail — mais alors le silence doit jouer en faveur de la non-publication du nom. |
| RS-28 | mineur | générique | **Le pilot dépose ses lots dans `input\00-travaux\` du produit en supposant qu'`input\` y est ignoré par git ; chez ce produit il ne l'est pas.** Mesure : `git check-ignore "input\00-travaux\pilot - TRAVAUX - 20260905k.md"` rend **exit 1** — non ignoré. Ce produit versionne `input\` à dessein et n'en exclut que deux entrants nommés, porteurs de données personnelles. Le lot reçu et son sidecar apparaissent donc en fichiers non suivis dans le `git status` du produit, indéfiniment, et **aucune règle ne dit** s'ils doivent entrer dans l'histoire du produit : ni le lot, ni `TRAVAUX-PILOT.md`. La question a dû être tranchée à la main dans le mandat humain qui accompagnait ce lot (« si le dépôt ignore `input\`, ne change rien ; sinon ne commets pas la boîte »). Ce qui se tranche dans un mandat se retranchera dans le suivant. | Une ligne dans `gabarits\TRAVAUX-PILOT.md` : le lot reçu est **une donnée d'entrée, pas un livrable du produit** — il n'entre pas dans l'histoire du produit, quel que soit le statut d'`input\` chez lui ; le produit qui préfère l'y garder le décide et le consigne. Deux phrases suffisent, et elles suppriment une question par lot et par produit. |
| RS-29 | majeur | générique | **Rien n'empêche d'écraser un lot déjà remis ET ingéré : l'immuabilité est écrite en prose des deux côtés du canal.** Le fait est de cette session, et il est déclaré pour cette raison. Ce lot devait porter l'indice `a`, celui que le mandat nommait. Ce nom était **déjà pris** par un lot du même produit, remis et **ingéré le matin même** — suivi par git, présent dans le commit `e3031e1` du pilot. Une écriture ordinaire l'a remplacé, et **aucun contrôle ne s'y est opposé** : ni le gabarit, qui écrit pourtant « un lot remis ne se modifie JAMAIS » ; ni `oracle-lot-retours`, qui juge la forme du fichier écrit et non le fait qu'il en écrase un autre — il a rendu PASS sur l'écrasement ; ni la boîte d'entrée, dont B1/B2 savent dire qu'un sidecar ingéré a changé mais **à l'ouverture suivante du pilot**, jamais au moment de l'écriture. Ce qui a rattrapé l'écrasement est un `git status` de contrôle, c'est-à-dire une **habitude**, pas une règle : sur un dépôt où le lot n'aurait pas encore été commis, il n'y aurait eu ni signal ni retour en arrière. Réparation faite dans la minute : le lot d'origine restauré depuis `HEAD` (`git diff` vide, contenu identique à `e3031e1`), les trois sidecars d'oracle produits par l'écriture supprimés, et le présent lot passé à l'indice `b`. | Deux voies, et la seconde est presque gratuite. (1) L'écriture d'un `<projet> - RETOURS - <date><indice>.md` dans `input\00-retours\` se refuse si le nom existe déjà — hook `PreToolUse` côté pilot, ou garde dans l'outil de dépôt : « ce nom est pris, l'indice suivant est `b` ». (2) La comparaison d'empreinte de B2 existe déjà et sait exactement dire « ce nom a été ingéré, ce contenu ne l'est plus » ; jouée **au moment de l'écriture** plutôt qu'à l'ouverture suivante, elle transforme un constat après coup en refus. Accessoirement, le gabarit gagnerait à dire au producteur comment choisir son indice — « regarder ce que la boîte porte déjà pour ce projet à cette date » — plutôt que de supposer qu'il le sait. |

**Portée** : *générique* pour les cinq. RS-25, RS-26, RS-28 et RS-29 ne dépendent d'aucun contenu de
ce produit : ils frappent tout produit du parc portant le canal des lots. RS-27 dépend d'un fait de
ce produit — un dossier gitignoré volumineux — mais la classe ne dépend de rien : tout produit qui
exclut un dossier d'`output\` (données personnelles, gros binaires, exports locaux) verra son
verdict de conformité rempli de constats sur des fichiers qui n'entreront jamais dans son dépôt.

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot — vérifié par la session mandatée, le
2026-09-06. Le seul travail fait chez le produit est celui que le lot demandait : recopie, relevé,
commit `7ba309e`, ligne de statut du lot reçu. Rien n'a été corrigé « en passant », et le dépôt
portait par ailleurs onze modifications non commises et un renommage indexé appartenant à une autre
session, laissés strictement intacts. Le seul constat qui aurait pu rester ici — quatre artefacts
hérités vivant hors de l'histoire git du produit — n'y reste pas : il est remonté en **RS-25**,
parce que le mécanisme qui les y a mis est celui du pilot et qu'aucun produit ne peut le corriger
chez lui.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le travail a consisté à
recopier trois artefacts hérités, à rejouer deux oracles et à faire un commit ; aucun livrable n'a
été dérivé de `gabarits\documents\`. Le présent lot est écrit depuis le gabarit du canal de retours
(`forge\retours\GABARIT-LOT-RETOURS.md`, copie conforme du pilot), qui n'appartient pas à cette
bibliothèque et auquel ce lot n'a rien eu à ajouter à la main — sauf, et c'est RS-29, la façon de
choisir son indice, que le gabarit ne dit pas.

## Confirmations positives

Trois choses ont tenu en conditions réelles pendant ce lot, et il vaut de les dire parce que chacune
est un mécanisme récent.

- **Le geste unique fait ce qu'il promet, et son mode `--essai` est ce qui a rendu le geste sûr.**
  `recopier-heritage.mjs --essai` a rendu la liste exacte de ce qui allait être écrit (3), de ce qui
  était déjà conforme (4) et de ce qui restait au produit (6) ; la comparaison avec `git status`
  avant écriture a permis de savoir *avant* que rien de local n'allait être perdu. Le geste réel a
  ensuite rendu la même liste, à l'identique. C'est exactement ce qu'un essai doit permettre — et
  c'est le motif de RS-26 (b) : rien ne l'appelle, il faut le connaître.
- **R-47 est exacte, et son message porte son remède.** Le constat d'avant nommait les trois
  artefacts, leur source au pilot, la date de la version que le produit portait, puis disait en
  toutes lettres « aucune faute côté produit : le pilot a avancé depuis », puis la commande. Une
  session qui lit ce message n'a rien à chercher. Et la bascule FAIL → PASS est la **seule**
  différence entre les deux relevés, ce qui rend la preuve de non-régression calculable plutôt que
  déclarée.
- **La règle T6 arrive avec sa recette et se prononce juste sur un cas qui n'est pas le sien.**
  Jouée sur le lot qui l'apporte, elle rend « aucun module producteur nommé — rien à lire », et
  c'est le bon verdict : le lot nomme trois modules à **exécuter** (`recopier-heritage.mjs`,
  `oracle-conformite-projet.mjs`, `oracle-travaux.mjs`), aucun à qui il **attribue la production**
  d'un artefact. Une règle neuve qui sait ne pas se déclencher est une règle qui tiendra.

## Ordre recommandé

Cinq retours, et l'ordre n'est pas indifférent : deux sont des trous de mécanisme qui saignent à
chaque produit, un est une perte de donnée possible, deux sont des lignes de gabarit.

1. **RS-27 — les 242 constats sur des chemins gitignorés, et les 41 noms de tiers dans le verdict.**
   Rang 1 sans concurrence, pour deux raisons qui se cumulent : c'est le seul des cinq où un nom
   réel de personne sort à chaque ouverture de session, et c'est celui qui rend le verdict de
   conformité inexploitable — 98 % de bruit sur la commande que la doctrine impose de jouer avant
   toute clôture de run. Le correctif est un filtre, et il vaut pour tout le parc.
2. **RS-29 — l'écrasement d'un lot déjà ingéré.** Rang 2 parce que c'est le seul des cinq où
   quelque chose se **perd** : ici la restauration a été possible parce que le lot était commis ;
   entre sa remise et le commit du pilot, elle ne l'aurait pas été. La voie (2) réutilise une
   comparaison qui existe déjà.
3. **RS-25 — l'héritage qui vit sur le disque et pas dans l'histoire.** Silencieux : rien ne le
   signale aujourd'hui, et il rend faux le seul indicateur qui mesure la descente
   (`RECIDIVES.md`). Un produit peut afficher « héritage à jour » pendant des mois sans qu'une
   ligne de son dépôt le porte. Le contrôle à ajouter tient en un appel git par artefact.
4. **RS-26 — la voie automatique tue, et la garde en prose.** À traiter **avec** RS-25, jamais
   après : les deux voies de descente sont le même sujet, et la partie (a) de RS-26 ne se corrige
   qu'en écrivant ce que RS-25 rend enfin vrai — la voie automatique recopie, la voie manuelle
   recopie *et propose le commit*. La partie (b), la garde git de l'écrasement, est indépendante et
   coûte dix lignes.
5. **RS-28 — le statut du lot reçu chez un produit qui versionne `input\`.** Deux phrases dans
   `gabarits\TRAVAUX-PILOT.md`. Dernier parce qu'il ne coûte qu'une question par lot ; à faire en
   même temps que RS-26 (1), qui touche le même fichier.

## La règle qui aurait évité le retour (TF-0779)

Aucun des cinq retours ne suit un retour humain : tous sont nés du geste demandé par le lot, de la
commande de vérification qu'il impose, ou de la remise de ce lot-ci. La classe est nommée pour
chacun, et une classe qui manque est **signalée** au pilot plutôt que créée ici.

- **RS-25** et **RS-26** entrent sous la classe existante `boucle-retour-sans-descente` (famille
  `heritage-produit`, règle `references/TODO-FORGE.md R12 « descente »`, oracle `oracle-todo R12`).
  Le rattachement est fait en connaissance de son imperfection, et elle est dite : le libellé vise
  une correction qui *ne redescend pas*, alors qu'ici elle redescend — mais jusqu'au disque
  seulement, sans que le producteur la rencontre ni que son dépôt la porte. C'est la **qualité** de
  la descente, pas son absence. Si le pilot juge le rattachement trop large, la classe à créer est
  nommable en une ligne : *« la descente d'un artefact hérité atteint le disque du poste et jamais
  l'histoire du dépôt ; le contrôle qui la juge lit le même disque »* — famille `heritage-produit`,
  règle à écrire dans R-47, oracle `oracle-conformite-projet R-47`.
- **RS-27** entre sous la classe existante `anonymisation-portee-partielle` (famille
  `anonymisation`, règle `todo/anonymiser-suivis.mjs`, oracle `oracle-nom-client-publie`), et là
  encore le fait déborde le libellé, ce qui doit se voir : la classe parle de dépôts et
  d'historique, le fait porte sur la **sortie d'un oracle** ; et les noms sont ceux de **tiers du
  client** (propriétaires, locataires), pas d'un client ni d'un produit. La parenté est réelle — la
  passe d'anonymisation ne couvre qu'une partie des surfaces, et celle-ci n'en est pas — mais si le
  pilot préfère une classe propre, elle se nomme : *« un oracle du socle recopie dans son verdict
  des chemins que le dépôt exclut, et ces chemins portent des noms de personnes »*. Le second volet
  de RS-27, le bruit à 98 %, relève lui de la famille `regle-morte` sans qu'aucune de ses trois
  classes ne le couvre : *un contrôle qui rend juste sur ce qu'il n'a pas à juger* n'existe pas au
  référentiel.
- **RS-29** entre sous la classe existante `lot-de-travaux-mauvais-module-producteur` ? Non : elle
  vise la forme d'un lot ÉMIS, pas le sort d'un lot REÇU. Aucune clé ne convient, et la famille la
  plus proche est `hook-ou-gate` (« un hook ou un gate absent, bloquant à tort, ou contourné »),
  dont la seule classe vise le périmètre d'un gate d'écriture, pas son absence. La classe à créer
  se nomme : *« un artefact déclaré immuable par un gabarit n'est protégé par aucun contrôle à
  l'écriture ; l'immuabilité vit en prose »* — famille `hook-ou-gate`, règle
  `gabarits/RETOURS-FORGES.md « un lot remis ne se modifie JAMAIS »`, oracle à poser (hook
  d'écriture côté pilot, ou B2 joué à l'écriture). Ce constat n'a donc **pas** de ligne de sidecar.
- **Aucune clé ne convient** non plus pour **RS-28** — le statut, chez le produit, du lot de travaux
  reçu. La famille `lot-forme` couvre la forme d'un lot, pas son **sort** après réception ; la
  famille `heritage-produit` couvre les artefacts que le pilot copie, or un lot de travaux n'est pas
  un artefact hérité — il n'est pas dans `HERITAGE.json` et ne doit pas y être. Le pilot est invité
  à créer la classe s'il la juge fondée ; une classe ne se crée jamais dans un sidecar. Ce constat
  n'a donc **pas** de ligne de sidecar non plus.
