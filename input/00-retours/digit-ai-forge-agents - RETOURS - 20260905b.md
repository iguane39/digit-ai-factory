# Retours forges — digit-ai-forge-agents — 20260905b

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905c` (items TF-0815 et TF-0816,
  confiés en un seul lot), reçu dans `input\00-travaux\` de la forge et joué sur mandat humain
  du 05/09/2026 (« A-36 à A-40 », action A-36).
- **Références ledger** : aucune — le dépôt `digit-ai-forge-agents` ne porte pas de
  `forge\ledger.jsonl` (c'est une forge, pas un produit instancié). La preuve tient au commit
  `f8d81d8`, poussé sur `origin/main` en avance rapide depuis `0dc0b2a`, et aux recettes
  rejouées, citées ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-05

## Ce que le lot de travaux a produit (TF-0815 et TF-0816)

Le lot confiait deux éléments dans un ordre justifié, et les deux sont faits, dans cet ordre. Le
tableau dit ce qui a été écrit et par quelle preuve exécutée chaque partie se vérifie ; les
mesures avant/après, le changement de contrat et les écarts suivent juste en dessous.

| Élément du lot | Ce qui a été fait | Preuve exécutée |
|---|---|---|
| TF-0815 (1) faire porter à la ligne le NOMBRE de constats de l'oracle | Dans `runCli` de `.claude\skills\quality-oracles\scripts\run-oracles.mjs`, le champ `detail` d'un verdict commence désormais par `<n> constat(s) · ` dès que l'oracle rend au moins une raison, suivi des deux premiers messages comme avant. La troncature à deux messages est gardée — une ligne de verdict n'est pas un rapport — mais elle annonce ce qu'elle tronque. | Deux notes Markdown identiques à un chapitre près, passées à `run-oracles.mjs --profil digit-ai --niveau note` : `2 constat(s) · …` contre `3 constat(s) · …`. Détail de la mesure ci-dessous. |
| TF-0815 (2) fixture double sens au banc du hook | Trois cas ajoutés à `node .claude\hooks\qo-gate-write.mjs --self-test` : `HEAD` à deux constats plus une édition qui en ajoute un troisième → 1 neuf, nommé, refus ; même `HEAD` sans constat neuf → 0 neuf, 2 préexistants, écriture acceptée ; et un troisième qui garde la porte ouverte quand la dette DIMINUE. | Banc du hook : **34/34** (26/26 avant ce lot). Sans les deux correctifs : **28/34**, les six cas neufs attendus rouges. |
| TF-0815 (3) déclarer le changement de contrat du champ `detail` | Déclaré au chapitre « Le changement de contrat » ci-dessous, et redit dans le message de commit `f8d81d8`. | Le présent lot, remis au pilot. |
| TF-0816 (1) résoudre la cible en entrée de `constatsAvant()` | `cibleResolue()` posée dans le hook, pure et exportée : ce qui part vers `git -C` est désormais toujours absolu. | Le même appel du hook avec un chemin relatif puis absolu rend le MÊME partage. Mesure ci-dessous. |
| TF-0816 (2) DÉCLARER le repli quand le delta n'est pas calculable | `motifSansDelta()` posée, pure et exportée : quatre états nommés — hors dépôt, chemin non résolu ou fichier non suivi, absent de `HEAD`, seconde passe injouable — chacun avec son motif en clair. `constatsAvant()` rend `{ constats, motif }`, et le verdict bloquant écrit `(DELTA NON CALCULABLE — <motif>. …)`. | Cible hors dépôt : le refus porte « DELTA NON CALCULABLE — hors dépôt — aucun dépôt git au-dessus de ce fichier ». Sortie citée ci-dessous. |
| TF-0816 (3) fixture double sens | Cinq cas ajoutés au banc : relatif et absolu donnent la même cible interrogée ; la cible est toujours absolue ; le motif « hors dépôt » est écrit et jamais nul ; les quatre motifs diffèrent ; un delta CALCULABLE ne fabrique aucun motif. | Banc du hook, mêmes 34/34. Ces cinq cas sont rouges sans le correctif. |

**La mesure de TF-0815, avant puis après.** Le défaut a été reproduit d'abord, pour disposer du
sens rouge avant tout correctif. Le support est le couple de notes décrit par le lot : deux
fichiers Markdown identiques à un chapitre près, l'un avec deux chapitres ouverts sur un tableau
nu, l'autre avec trois.

| Passe | Ligne rendue par le runner pour l'oracle de lisibilité | Effet sur le partage du hook |
|---|---|---|
| Avant correctif, note à deux chapitres fautifs | `❌ […] — M7 … « Chapitre A » (ligne 6) … ; M7 … « Chapitre B » (ligne 13) …` | clé de référence |
| Avant correctif, note à trois chapitres fautifs | la MÊME ligne, mot pour mot ; « Chapitre C » n'y figure pas | même clé, aucun compteur ne bouge → **0 neuf, écriture acceptée** |
| Après correctif, note à deux chapitres fautifs | `❌ […] — 2 constat(s) · M7 … « Chapitre A » … ; M7 … « Chapitre B » …` | clé de référence |
| Après correctif, note à trois chapitres fautifs | la même ligne, mais `3 constat(s) · ` | même clé après masquage, compteur 2 → 3 → **1 neuf, écriture refusée** |

**La mesure de TF-0816, avant puis après.** Le support est `run\rapport-jouet.md` du dépôt de la
forge, dont la version `HEAD` porte déjà un constat M7 (« Racine du projet (premier niveau) »),
avec la même édition que la mesure de TF-0806 : un chapitre ajouté en fin de fichier, ouvert sur
un tableau nu. Le troisième cas emploie un fichier créé hors de tout dépôt git, supprimé après
la mesure.

| Passe | Partage rendu par le hook | Verdict |
|---|---|---|
| Avant correctif, `file_path` ABSOLU | `delta=true`, 1 neuf, 1 préexistant | exit 2, BLOQUÉ, le préexistant nommé |
| Avant correctif, `file_path` RELATIF | `delta=false`, 2 neufs, 0 préexistant — et **rien** dans le verdict ne dit que le delta a été abandonné | exit 2, BLOQUÉ, sans motif |
| Après correctif, `file_path` ABSOLU | `delta=true`, 1 neuf, 1 préexistant | exit 2, BLOQUÉ, le préexistant nommé |
| Après correctif, `file_path` RELATIF | `delta=true`, 1 neuf, 1 préexistant — **identique** au chemin absolu | exit 2, BLOQUÉ, le préexistant nommé |
| Après correctif, cible HORS DÉPÔT | `delta=false`, tout compte comme neuf, et le verdict le DIT | exit 2, BLOQUÉ, portant « DELTA NON CALCULABLE — hors dépôt — aucun dépôt git au-dessus de ce fichier, il n'a pas de version HEAD » |

Le fichier support a été restauré à l'identique après la mesure (`git checkout --`, empreinte
`md5 c9bf1f938d8fd1ad6c46d90a08240edf`, celle d'avant la mesure). Le fichier non suivi
`run\rapport-jouet.md.oracles.json` a été laissé en place et n'a pas été commité, comme demandé ;
les quatre journaux d'oracles que les mesures ont créés ailleurs dans le dépôt ont été retirés,
et l'arbre est revenu à son état d'entrée.

**Le changement de contrat du champ `detail`.** C'est la partie de ce lot qui sort du dépôt de la
forge, et elle est dite ici pour que le registre la porte. Le champ `detail` d'un verdict rendu
par `run-oracles.mjs` commence désormais par `<n> constat(s) · ` dès que l'oracle appelé a rendu
au moins une raison ; le reste est inchangé, et la forme JSON de la sortie ne bouge pas d'un
champ. Trois conséquences valent d'être nommées. D'abord, toute ligne `❌` affichée par le runner
s'allonge de quelques caractères, dans les sorties comme dans les journaux `*.oracles.json` de
toutes les forges. Ensuite, un lecteur qui comparait ce champ mot pour mot d'une passe à l'autre
verra une différence là où le nombre de constats change — c'est précisément l'effet recherché, et
c'est ce qui rend TF-0815 corrigé. Enfin, la borne tenue est celle que le pilot a tranchée :
rien d'autre que ce compte n'a été ajouté au champ.

**Les écarts au lot, avec leur motif.** Trois, tous mineurs, aucun sur la substance demandée.

- **Le hook a dû être modifié en plus du runner**, alors que le lot annonçait que `compteur()`
  traiterait une occurrence de plus comme neuve « sans autre modification ». La liste des
  marqueurs de multiplicité que `compteur()` reconnaît est fermée et codée en dur — `× n`,
  `n occurrences`, `n éléments`, `n fois`, `n cas` — et aucun n'attrape « 3 constat(s) » : le
  motif `cas` ne rencontre pas le mot « constat ». Un marqueur y a donc été ajouté, et le compte
  annoncé par le runner est lu EN PREMIER, avant `× n` : il compte la ligne entière quand `× n`
  ne compte qu'à l'intérieur d'un message.
- **La fixture bout en bout de TF-0815 n'a pas été jouée à travers le hook**, faute de support :
  aucun fichier suivi de la forge ne porte, dans sa version `HEAD`, deux constats d'un même
  oracle, et en fabriquer un aurait demandé un commit fait pour servir une mesure. Les deux sens
  sont donc éprouvés là où le lot les demandait — au banc — et la preuve runner est celle que le
  lot nomme lui-même comme moyen de vérification (les deux notes qui diffèrent par le nombre).
- **Un seul commit pour les deux éléments**, et non un par élément : les deux correctifs vivent
  dans les deux mêmes fichiers, et les séparer aurait demandé de découper des morceaux de la même
  fonction. C'est aussi le style de la forge, dont le commit précédent portait déjà deux items.

**Les recettes de la forge, toutes rejouées après les correctifs** : banc du hook 34/34 ·
`forge-agents\scripts\self-test.mjs` 29 PASS, 0 FAIL · `quality-oracles\scripts\self-test.mjs`
PASS (215 contrôles) · `self-test-hamecon-publication.mjs` 7 PASS · `experts-forge\scripts\self-test-routage.mjs`
7/7 PASS · `write-an-expert\scripts\self-test-scaffold.mjs` 2/2 PASS · `self-test-gates-jq.sh`
28 PASS · `self-test-gate-budget.sh` 7 PASS · `oracle-promesses.mjs` sur `.claude\hooks\` : PASS ·
porte de publication `oracle-nom-client-publie.mjs` sur le dépôt entier : **PASS** (aucun des
cinq termes du référentiel dans les contenus, les noms de fichiers ni les messages de commit),
jouée avant le push.

**La source, jamais la copie installée.** Seules les sources versionnées du dépôt de la forge ont
été modifiées : `.claude\hooks\qo-gate-write.mjs` et
`.claude\skills\quality-oracles\scripts\run-oracles.mjs`. Les copies installées sous
`~\.claude\hooks\` et `~\.claude\skills\` n'ont pas été touchées, et la remarque du lot précédent
tient toujours : tant que le réalignement n'a pas eu lieu, les sessions en cours jouent encore la
version défaillante des deux fichiers.

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Un seul constat est sorti du traitement de ce lot, et il porte sur la recette du gate plutôt que
sur son comportement. Il n'a pas été corrigé dans ce lot : le corriger demande de toucher à la
signature d'une fonction du gate, ce que le lot ne demandait pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RB-1 | mineur | générique | **La moitié IMPURE du gate — `constatsAvant()`, celle qui va chercher `HEAD` — n'est éprouvée par aucun cas de son banc, et les trois défauts corrigés en deux jours y vivaient tous.** Le banc du hook (34 cas) n'éprouve que des fonctions pures : `motifExemption`, `normaliserChemin`, `partagerConstats`, `constatDePoliceNeutralise`, et depuis ce lot `cibleResolue` et `motifSansDelta`. La fonction qui interroge git et rejoue les oracles sur la version `HEAD` n'est couverte par aucun cas, et elle ne peut pas l'être en l'état : le banc s'exécute au-dessus du dispatch `--self-test`, donc avant l'évaluation des `const` du corps du hook, dont `runner` ; l'appeler depuis le banc lève une erreur de zone morte temporelle, avalée par le `try/catch` du banc en échec MUET (le coût en a déjà été payé le 01/09, cinq cas sur six). **Mesure du 05/09/2026** : les deux sens de TF-0816 ont dû être mesurés à la main, en simulant un appel du hook avec un JSON sur l'entrée standard, plus un troisième appel manuel pour la cible hors dépôt. Trois mesures manuelles pour un lot, aucune capturée par la recette — et le banc est pourtant passé de 26 à 34 cas, tous de fonctions pures. | Injecter le chemin du runner en paramètre de `constatsAvant()` (valeur par défaut inchangée) pour que le banc puisse l'appeler sans toucher à la zone morte, puis lui donner un cas bout en bout sur un fichier SUIVI de la forge dont `HEAD` porte déjà un constat — `run\rapport-jouet.md` remplit cette condition et sert de support de mesure depuis TF-0806. Le coût du cas est une seconde passe d'oracles, quelques secondes : c'est le prix d'une recette qui couvre la moitié du gate qui casse. |

**Un second constat, sans classe, donc écrit en prose.** Le contrat de sortie de
`run-oracles.mjs` n'a **aucun domicile écrit**. Le champ `detail` a changé deux fois en dix jours
— sa source de raisons le 26/08 (TF-0659), son en-tête aujourd'hui — et aucun document versionné
ne dit ce que ce champ contient ni ne porte de version qu'un lecteur pourrait surveiller.
`references\regles-oracles.md` décrit le contrat d'ENTRÉE que doit tenir un oracle CLI
(`{oracle, domaine, artefact, verdict, findings[], non_juge[]}`), jamais la forme de ce que le
runner rend en retour. C'est pourquoi la déclaration de ce lot passe par un lot de retours, ce
qui est le bon canal mais pas un domicile : le prochain lecteur qui compare deux `detail` n'a
toujours rien à lire. Aucune clé de `todo\CLASSES.json` ne nomme ce défaut — les voisines
possibles (`recette-verdict-non-prononcable`, `auteur-juge-son-contrat`) portent un autre
mécanisme — et une classe ne se crée jamais dans un sidecar : le constat reste donc ici, en
prose, à la décision du pilot.

## Remarques restées au produit

Aucune remarque n'est restée au produit — vérifié le 2026-09-05. Le seul constat trouvé pendant
la mesure vise la recette de la forge elle-même et est remonté ci-dessus (RB-1) plutôt que
corrigé en silence : le lot borne explicitement ce qui est demandé, et sa correction toucherait
la signature d'une fonction du gate, ce qui n'était pas mandaté. Le constat sans classe est écrit
en prose au même chapitre, pour la même raison.

## Retours sur les documents produits

Aucun document produit depuis un gabarit. Le chantier est entièrement du code de hook, du code de
runner et leurs recettes. Le seul gabarit employé est celui du présent lot de retours
(`gabarits\RETOURS-FORGES.md`, `version_du_gabarit` non portée par le fichier de référence
consulté), et rien ne lui a manqué à la lecture : le lot précédent de la même forge a servi de
modèle de structure, section par section.

## Confirmations positives

Trois choses ont tenu en conditions réelles pendant ce run, et méritent d'être closes comme
vérifiées.

- **La normalisation du chemin (TF-0806) tient sous le nouveau format de ligne.** Le préfixe
  `<n> constat(s) · ` s'insère entre le chemin et les messages ; les six cas de banc écrits le
  05/09 au matin restent verts, et le jeton `<fichier>` continue d'absorber le chemin des deux
  côtés du partage.
- **La discipline de la zone morte temporelle a de nouveau payé.** Les deux fonctions pures de
  TF-0816 ont été déclarées au-dessus du dispatch `--self-test` dès leur écriture, sur la foi du
  commentaire laissé le 01/09 ; aucun échec muet n'a été rencontré.
- **La méthode « rouge d'abord » a discriminé.** Sur les huit cas ajoutés au banc, six sont
  rouges sans les correctifs et deux sont verts par construction — ces deux-là gardent la porte
  ouverte quand la dette diminue ou ne bouge pas. Un banc où tous les cas neufs rougissent aurait
  été le signe d'un correctif trop large.

## Ordre recommandé

1. **Le réalignement des copies installées d'abord** — les deux fichiers corrigés vivent aussi
   sous `~\.claude\`, et c'est cette copie-là que les sessions jouent. Tant qu'elle n'est pas
   réalignée, la correction de TF-0815 n'existe que dans le dépôt.
2. **RB-1 ensuite** — il ne corrige aucun comportement, il rend rejouable ce qui a coûté trois
   mesures manuelles aujourd'hui, et il couvre la seule moitié du gate où les trois derniers
   défauts sont apparus.
3. **Le domicile du contrat de sortie en dernier** — le constat sans classe ci-dessus. Sa valeur
   est de rendre surveillable un champ que deux lots ont déjà changé ; elle est réelle mais
   différable, et elle appelle d'abord une décision de classe.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot traite des travaux confiés, pas un retour humain sur un livrable. La règle nommée l'est
donc pour la classe des deux items traités et pour celle du constat remonté.

- **TF-0815 et TF-0816 relevaient tous deux de la classe `gate-ecriture-juge-fichier-entier`**,
  et la règle qui les aurait évités est celle que ce lot vient de câbler des deux côtés : *ce
  qu'un contrôle ne sait pas, il le dit*. TF-0816 en est le cas pur — le delta s'abandonnait sans
  le dire. TF-0815 en est la variante silencieuse à l'autre bout : une ligne qui résume deux
  constats sur trois affirme implicitement qu'elle les résume tous, et c'est cette affirmation
  tacite qui a ouvert le gate.
- **RB-1 relève de la même classe, et la réserve écrite le 05/09 au matin tient toujours.** Le
  libellé de la classe dit « juge le fichier entier au lieu du delta » ; c'est bien la
  conséquence observable d'un défaut de `constatsAvant()`, puisque tout y retombe sur « delta
  nul, tout est neuf ». La classe est donc retenue pour le mécanisme et le code, comme le pilot
  l'a tranché pour RA-1 — le premier des deux constats du lot de retours du 05/09 au matin, celui
  qui est devenu TF-0815. Si le pilot ouvre un jour une classe pour le SENS inverse (« un gate au
  delta identifie mal un constat »), RB-1 devra la suivre.
