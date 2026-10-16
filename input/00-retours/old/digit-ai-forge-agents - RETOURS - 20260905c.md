# Retours forges — digit-ai-forge-agents — 20260905c

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905g` (items TF-0820, volet
  « porte de publication », et TF-0821, confiés en un seul lot), reçu dans `input\00-travaux\`
  de la forge et joué sur mandat humain du 05/09/2026 (« A46 »).
- **Références ledger** : aucune — le dépôt `digit-ai-forge-agents` ne porte pas de
  `forge\ledger.jsonl` (c'est une forge, pas un produit instancié). La preuve tient au commit
  `db3d391`, poussé sur `origin/main` en avance rapide depuis `f8d81d8`, et aux recettes
  rejouées, citées ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-05

## Ce que le lot de travaux a produit (TF-0820 et TF-0821)

Le lot confiait deux éléments dans un ordre justifié, et les deux sont faits, dans cet ordre. Le
tableau qui suit dit, pour chaque partie demandée, ce qui a été écrit et par quelle preuve
exécutée elle se vérifie ; les mesures avant/après, les comptes de cas et les écarts viennent
juste en dessous. Il se lit une ligne à la fois : la colonne du milieu est le geste, celle de
droite le verdict qui l'atteste.

| Élément du lot | Ce qui a été fait | Preuve exécutée |
|---|---|---|
| TF-0820 (1) une règle C5 lisant la table des pseudonymes de produits | Dans `.claude\skills\quality-oracles\scripts\oracle-nom-client-publie.mjs` : option `--produits=<chemin>`, variable `FORGE_PRODUITS_PSEUDO`, et résolution par voisinage comme pour le référentiel des clients. Les clés non-chemins de la table sont cherchées dans les contenus des fichiers suivis, dans leurs noms, et dans les messages de commit de tout l'historique. | Porte jouée sur un clone jetable d'une forge publique : **FAIL, 5 constats C5**. La même porte, version d'avant, rendait **PASS**. Détail ci-dessous. |
| TF-0820 (1 bis) les mêmes variantes que `anonymiser-entrant.mjs` | `variantesProduit()` reprend mot pour mot la règle de `variantes()` du pilot : clé prise telle quelle, puis mots séparés par rien, une espace, un tiret ou un souligné, en toute casse, bornés par des non-alphanumériques, dès deux mots et huit lettres ; clé à point prise telle quelle ; clé de chemin ignorée. Seul le drapeau `g` est retiré, parce qu'un `test()` d'expression globale dépend de l'appel précédent. | Comparaison ligne à ligne des deux corps de fonction : identiques hors nom, style de guillemets et drapeau. Et sur la table réelle, 14 noms de produits retenus, 45 clés de chemin ignorées — nombres écrits au `non_juge`. |
| TF-0820 (1 ter) l'absence de table se DÉCLARE | Sans table, l'oracle ne fait pas SKIP : il joue C1-C4 et écrit au `non_juge` « C5 NON JOUÉE : table absente », avec le remède et les pistes explorées. Le verdict PASS dit alors « C5 non jouée » dans son propre message. | Troisième cas de recette, ci-dessous : le même dépôt porteur rend PASS sur C1-C4 **et** l'angle éteint est nommé. |
| TF-0820 (2) fixtures double sens sur dépôt jetable | Trois cas ajoutés à `node .claude\skills\quality-oracles\scripts\self-test.mjs` : dépôt fabriqué par `git init` dans un dossier temporaire, un fichier commis, une table de pseudonymes jetable portant un nom de produit **inventé**. | Recette de `quality-oracles` : **PASS, 218 contrôles** (215 avant ce lot), 0 échec. |
| TF-0820 (3) contrat de sortie inchangé | `findings[]` garde ses quatre champs (`regle`, `sev`, `msg`, `where`) ; C5 émet `regle: "C5"` et `sev: "bloquant"` comme C1-C4. Seul le libellé du constat informatif d'un PASS change, pour dire si C5 a été jouée. | Un cas de recette vérifie que chaque constat C5 porte les trois champs de localisation. |
| TF-0821 (1) rendre `constatsAvant()` éprouvable | Dans `.claude\hooks\qo-gate-write.mjs`, `lignesFautives` et `constatsAvant` remontent au-dessus du dispatch `--self-test`, et le lanceur d'oracles s'injecte : `opts.runner ?? runner`. Le `??` court-circuite, donc la `const runner` du corps du hook n'est jamais lue quand l'appelant fournit le sien. Le contrat `{ constats, motif }` ne bouge pas d'un caractère. | Le banc appelle la fonction pour de vrai. Verdict : **37/37**. |
| TF-0821 (2) un cas de banc sur dépôt jetable, dans les deux sens | Un dépôt fabriqué par `git init`, un fichier commis portant un constat, une édition qui insère trois lignes sans ajouter de constat, et un lanceur de jeu d'essai qui rend une ligne d'oracle. Le sens rouge emploie une cible hors de tout dépôt. | Cas vert : `motif` nul, un constat retrouvé sur `HEAD`, partage **0 neuf / 1 préexistant**. Cas rouge : `constats` à `null` **et** `motif` porté (« hors dépôt … »). |
| TF-0821 (3) le banc n'avale plus une erreur | Le résultat d'un cas porte désormais son erreur : `{ nom, tenu, erreur }`. Un cas qui lève hors de son assertion compte FAIL **et** sa ligne affiche `ERREUR LEVEE : <message>`. Un troisième cas éprouve le banc lui-même. | Témoin injecté à dessein : `[ECHEC ] TEMOIN B …` suivi de `ERREUR LEVEE : BOUM-TEMOIN`, 37/38. Le même témoin sur la version d'avant : `[ECHEC ]` **sans un mot**. |

**La mesure de TF-0820, avant puis après.** Le défaut a été reproduit d'abord, sur deux supports
distincts, pour disposer du sens rouge avant tout correctif. Le premier support est le clone
jetable de la forge de développement au commit `00097b6`, c'est-à-dire son état avant le lot qui
lui est confié en parallèle ; rien n'a été écrit dans ce dépôt-là. Le second est un dépôt
fabriqué à la volée, dont la table de pseudonymes jetable porte un nom de produit inventé.

| Passe | Support | Verdict rendu |
|---|---|---|
| Avant correctif | clone de la forge de développement à `00097b6` | **PASS** — un seul constat informatif, `C1-C4`, et rien sur les produits |
| Après correctif | le même clone, `--produits` fourni | **FAIL** — 5 constats `C5` : 2 dans l'arbre courant (deux fichiers, un par fichier) et 3 dans des messages de commit |
| Avant correctif | dépôt jetable porteur d'un nom de produit inventé | **PASS**, 0 constat C5, et aucune mention de l'angle au `non_juge` |
| Après correctif | le même dépôt jetable | **FAIL**, 2 constats C5 — la graphie littérale et sa variante espacée en minuscules |
| Après correctif | le même dépôt, pseudonyme seul | **PASS**, et la table employée est nommée au `non_juge` |
| Après correctif | le même dépôt porteur, **sans** `--produits` | **PASS** sur C1-C4, et « C5 NON JOUÉE : table absente » écrit au `non_juge` |

Les cinq constats du clone sont tous bornés par des non-alphanumériques — vérifié caractère par
caractère, sans recopier le nom trouvé — et portent **deux** noms de produits distincts de la
table, pas un seul. Le nom réel n'est cité nulle part dans cette forge : ni dans le code, ni dans
une fixture, ni dans un message de commit.

**La mesure de TF-0821, avant puis après.** Le lot annonçait un échec MUET ; la mesure a montré
un cas plus sévère, et il vaut d'être nommé. Appelée depuis le banc de la version d'avant sur un
fichier suivi et présent dans `HEAD`, `constatsAvant()` ne levait pas jusqu'à l'appelant : la
`ReferenceError` de zone morte temporelle sur `runner` tombait dans le `try/catch` **de la
fonction elle-même**, qui la convertissait en `motif = "seconde passe injouable — les oracles
n'ont pas pu être rejoués sur la version HEAD"`. Le banc ne voyait donc pas une erreur, il voyait
un motif — un motif qui ment sur la cause. Un lecteur aurait cherché du côté du lanceur d'oracles
un défaut qui vivait dans l'ordre des déclarations.

| Passe | Ce que rend `constatsAvant()` | Ce qu'en dit le banc |
|---|---|---|
| Avant correctif, fichier suivi | `constats = null`, `motif = "seconde passe injouable …"` | `[ECHEC ]`, 34/36 — et le motif désigne la mauvaise cause |
| Avant correctif, cas qui lève | — | `[ECHEC ]` **sans aucun message** |
| Après correctif, dépôt jetable | `constats = [1 ligne]`, `motif = null` | `[OK    ]` — partage 0 neuf / 1 préexistant |
| Après correctif, cible hors dépôt | `constats = null`, `motif = "hors dépôt — aucun dépôt git au-dessus de ce fichier …"` | `[OK    ]` — le repli est déclaré |
| Après correctif, cas qui lève | — | `[ECHEC ]` **suivi de** `ERREUR LEVEE : BOUM-TEMOIN` |

**Les comptes de cas, avant et après.** Le banc du hook passe de **34 à 37** cas, tous verts ; le
lot en demandait 36 au moins, et un cas nomme `constatsAvant` dans son intitulé. La recette de
`quality-oracles` passe de **215 à 218** contrôles, tous verts. Aucun cas préexistant n'a été
retiré ni réécrit.

**Les écarts au lot, avec leur motif.** Trois, aucun sur la substance demandée.

- **Cinq constats C5 sur le clone, et non trois.** Le lot annonçait « trois mentions d'un nom de
  produit réel, en commentaire et en docstring », dans deux fichiers de l'arbre courant. La
  mesure sur le clone à `00097b6` en trouve **deux** dans l'arbre courant — une par fichier, dans
  les deux fichiers que le lot nomme — et **trois de plus dans des messages de commit**, portant
  un second nom de produit de la table. La règle C5 juge les trois angles que le lot lui demande,
  donc elle voit les cinq. Le point qui vaut décision du pilot est ailleurs : les trois mentions
  des messages de commit ne se corrigent pas en éditant un fichier. Tant que l'historique de ce
  dépôt n'est pas réécrit, la porte y restera **FAIL en C5**, même une fois le lot parallèle
  traité — et le critère « après, PASS » du lot ne pourra pas être tenu par ce seul lot.
- **C5 ne balaie pas le CONTENU de l'historique**, là où C4 le fait pour les clients. Le lot
  demande explicitement les contenus, les noms de fichiers et les messages de commit ; c'est
  exactement ce qui est implémenté, et le critère de vérification du lot (« FAIL C5 sur trois
  mentions ») ne tient qu'à cette portée. L'écart est **déclaré au `non_juge`** de l'oracle plutôt
  que laissé tacite, et il est remonté ci-dessous comme constat à instruire séparément.
- **Un seul commit pour les deux éléments**, et non un par élément. C'est le style de la forge,
  dont les deux commits précédents portaient déjà deux items chacun, et les deux correctifs se
  relisent ensemble : les fixtures de TF-0821 réutilisent le patron de dépôt jetable écrit pour
  C5, comme l'ordre recommandé du lot l'avait prévu.

**Les recettes de la forge, toutes rejouées après les correctifs** : banc du hook **37/37** ·
`quality-oracles\scripts\self-test.mjs` **PASS (218 contrôles)** ·
`forge-agents\scripts\self-test.mjs` 29 PASS, 0 FAIL · `self-test-hamecon-publication.mjs`
7 PASS · `experts-forge\scripts\self-test-routage.mjs` 7/7 PASS ·
`write-an-expert\scripts\self-test-scaffold.mjs` 2/2 PASS · `self-test-gates-jq.sh` 28 PASS ·
`self-test-gate-budget.sh` 7 PASS · `oracle-promesses.mjs` sur `.claude\hooks\` : PASS ·
`oracle-etat-forge.mjs` sur `versions-livrees.json` : PASS (13 skills, F1-F3 vérifiés).

**Les deux portes de publication, jouées avant le push.** La copie installée
(`~\.claude\skills\…`), qui ne connaît que C1-C4, rend **PASS** sur le dépôt entier. La source du
dépôt, avec la table réelle passée par `--produits`, rend **PASS en C1-C5** : aucun des 5 termes
du référentiel des clients ni des 14 noms de produits de la table dans les contenus, les noms de
fichiers ni les messages de commit. La table n'a jamais été copiée dans le dépôt ; elle est lue
au moment du geste, comme le référentiel des clients.

**La source, jamais la copie installée.** Seules les sources versionnées du dépôt de la forge ont
été modifiées : `.claude\hooks\qo-gate-write.mjs`, les deux scripts et les deux références de
`quality-oracles`, et le manifeste `versions-livrees.json` (registre des oracles 2.16.0 → 2.17.0).
Les copies installées sous `~\.claude\` n'ont pas été touchées : la remarque des deux lots
précédents tient toujours, et elle vaut désormais aussi pour la porte de publication — tant que le
réalignement n'a pas eu lieu, un `oracle-nom-client-publie` appelé depuis `~\.claude\` ne joue
**pas** C5, et ne le dit pas non plus, faute d'en connaître l'existence.

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Un seul constat est sorti du traitement de ce lot. Il porte sur la portée de la règle qui vient
d'être écrite, il est déclaré dans l'oracle lui-même, et il n'a pas été corrigé ici : l'étendre
sortirait de ce que le lot demande, et le critère de vérification du lot en dépend.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-1 | mineur | générique | **C5 juge trois angles sur les quatre que C1-C4 couvrent pour les clients : le CONTENU de l'historique lui échappe.** La règle écrite ce jour juge les contenus et les noms des fichiers suivis de l'arbre courant, et les messages de commit de tout l'historique — soit exactement les trois angles nommés par le lot. Elle ne rejoue pas l'angle C4, qui fouille le contenu des fichiers de tout l'historique, y compris ceux retirés de l'arbre. **Mesure du 05/09/2026** : sur le clone de la forge de développement à `00097b6`, C5 rend 5 constats ; le même balayage étendu au contenu de l'historique, joué à la main avec `git grep -l -I -F` sur les 151 révisions, trouve **12 couples (révision, fichier)** portant une clé littérale, sur 2 fichiers distincts — donc douze constats de plus que la porte ne voit aujourd'hui. Le trou est de même nature que celui du 27/08 côté clients : retirer un fichier de l'arbre ne le retire pas des commits, et l'hébergeur sert encore ce qu'un commit ancien contient. L'écart est **déclaré** au `non_juge` de l'oracle, il n'est pas tacite. | Étendre C5 à l'angle C4 en réutilisant le passage par `git grep` déjà écrit pour les clients : les clés littérales s'y branchent directement (`-F`, sensible à la casse) ; les variantes de graphie demandent un motif que `git grep -E` sache lire, donc une traduction du lookbehind `(?<![A-Za-z0-9])` en frontière que `git grep` accepte, ou un balayage maison des blobs. Le coût est réel et le gain aussi : sans cet angle, un nom de produit retiré de l'arbre reste servi par l'hébergeur et la porte reste verte dessus. À trancher avec la question du réalignement des copies installées, qui conditionne l'endroit d'où la porte est jouée. |

## Remarques restées au produit

Aucune remarque n'est restée au produit — vérifié le 2026-09-05. Le seul constat trouvé pendant
le traitement porte sur la portée de la règle neuve et est remonté ci-dessus (RC-1) plutôt que
corrigé en silence : le lot borne explicitement les trois angles demandés, et son critère de
vérification (« FAIL C5 sur trois mentions ») ne tient qu'à cette portée. Il est **généralisable :
oui** — la question « un contrôle neuf couvre-t-il tous les angles que son voisin couvre déjà ? »
vaut pour toute règle ajoutée à un oracle multi-angles, et le 27/08 a déjà payé une fois pour
l'angle oublié. Le lot parallèle confié à la forge de développement n'a pas été touché : les deux
fichiers fautifs et les trois messages de commit lui appartiennent, et rien n'a été écrit dans ce
dépôt.

## Retours sur les documents produits

Aucun document produit depuis un gabarit. Le chantier est entièrement du code d'oracle, du code de
hook et leurs recettes. Le seul gabarit employé est celui du présent lot de retours
(`gabarits\RETOURS-FORGES.md`, `version_du_gabarit` non portée par le fichier de référence
consulté), et rien ne lui a manqué à la lecture : le lot précédent de la même forge a servi de
modèle de structure, section par section.

## Confirmations positives

Trois choses ont tenu en conditions réelles pendant ce run, et méritent d'être closes comme
vérifiées.

- **La méthode « rouge d'abord » a discriminé deux fois, et la seconde a corrigé le lot.** Sur
  TF-0820, la version d'avant rend PASS sur les deux supports, la version d'après rend FAIL sur les
  deux : la règle juge le nom, pas la structure. Sur TF-0821, le rouge a montré autre chose que ce
  que le lot annonçait — non pas une erreur avalée par le banc, mais une erreur avalée par la
  fonction elle-même et rendue sous un motif faux. Sans reproduction préalable, le correctif aurait
  été écrit contre la mauvaise description.
- **La discipline de la zone morte temporelle se paie une fois et sert ensuite.** Le commentaire
  laissé le 01/09 au-dessus du dispatch disait exactement où le piège se trouve ; il a suffi à
  choisir l'injection plutôt qu'une réécriture de la fonction, et le contrat `{ constats, motif }`
  n'a pas bougé.
- **La porte neuve s'est jugée elle-même.** `oracle-nom-client-publie` avec C5 a été joué sur le
  dépôt qui le porte, avec les DEUX tables réelles : PASS. C'est la même vérification qui, le
  27/08, avait fait échouer cet oracle sur son propre commentaire — et c'est pourquoi le nom de
  produit des fixtures est inventé.

## Ordre recommandé

1. **Le réalignement des copies installées d'abord** — la porte vit aussi sous `~\.claude\`, et
   c'est cette copie que les runs appellent. Tant qu'elle n'est pas réalignée, C5 n'existe que
   dans le dépôt de la forge, et une publication jugée depuis la copie installée passera sans que
   les produits soient regardés.
2. **La question des messages de commit de la forge de développement ensuite** — trois des cinq
   constats C5 y vivent, et aucun geste sur des fichiers ne les retire. C'est une décision de
   réécriture d'historique, donc une décision du pilot, pas de la forge.
3. **RC-1 en dernier** — l'extension de C5 à l'angle C4. Sa valeur est réelle mais elle est
   différable, et elle se traite mieux une fois les deux points précédents tranchés, parce que le
   coût du balayage de l'historique dépend de l'endroit d'où la porte est jouée.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot traite des travaux confiés, pas un retour humain sur un livrable. La règle nommée l'est
donc pour la classe des deux items traités et pour celle du constat remonté.

- **TF-0820 relève de la classe `anonymisation-portee-partielle`**, et la règle qui l'aurait évité
  est celle que ce lot vient de câbler : *une porte juge tout ce que la règle qu'elle applique
  énonce*. La règle du parc dit « aucun nom de client **ni de produit** dans un dépôt publié » ;
  la porte ne lisait qu'un des deux référentiels, et l'écart entre la règle écrite et la règle
  câblée ne se voyait nulle part — la porte ne déclarait pas les produits comme non jugés, elle
  n'en parlait pas du tout. C'est la loi transverse n° 1 dans sa variante silencieuse : une
  affordance à moitié câblée est indistinguable d'une affordance entière tant que rien ne dit
  laquelle des deux on regarde. La correction pose donc les deux moitiés ensemble : l'angle **et**
  sa déclaration d'absence.
- **TF-0821 relève de la classe `gate-ecriture-juge-fichier-entier`**, et la réserve écrite le
  05/09 au matin tient toujours : le libellé de la classe nomme la conséquence observable, pas le
  mécanisme, et c'est bien la conséquence — tout retombe sur « delta nul, tout est neuf » dès que
  `constatsAvant()` échoue. La règle qui l'aurait évité est celle que le parc applique déjà aux
  livrables et pas encore à ses propres bancs : *une fonction qu'aucun cas n'éprouve n'est pas
  couverte, même quand le compte de cas monte*. Le banc est passé de 21 à 26 puis à 34 cas en
  quatre jours, sans jamais toucher la seule fonction où les trois derniers défauts ont vécu.
- **RC-1 relève de `anonymisation-portee-partielle` lui aussi**, et pour le mécanisme exact de sa
  fondation : une passe qui ne couvre qu'une partie des angles laisse l'historique porter des noms.
  Aucune classe n'est créée par ce lot, et aucune ne l'est dans le sidecar.
