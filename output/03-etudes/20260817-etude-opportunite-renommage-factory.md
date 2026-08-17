# Étude d'opportunité — renommage du pilot en « factory » — 20260817h

<!-- Instruit TF-0317 au gabarit gabarits\ETUDE-OPPORTUNITE.md (TF-0155), jugé par
     oracles\oracle-etude-opportunite.mjs. Tous les chiffres de cette étude ont été relevés
     sur le poste le 17/08/2026 ; les commandes de relevé sont citées avec eux. -->

## Seuil de déclenchement (à vérifier AVANT d'écrire)

Franchi sur deux critères indépendants : l'item **touche le noyau** (`CLAUDE.md`, 6 occurrences
du mot « pilot ») **et ≥ 3 forges** (les 14 dépôts frères en portent 48 occurrences de
`forge-pilot`, relevé `git grep -I -o -i forge-pilot` dépôt par dépôt). Le troisième critère —
gain ≥ 3 avec preuve ≤ 2 — n'est **pas** franchi : l'item porte `gain: 2`, ce qui est en soi un
fait à instruire (§4, O0). Étude donc obligatoire, mais obligatoire sur un item de faible gain
déclaré : la charge de la preuve n'est pas allégée par l'origine humaine de la demande.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.

Sources de la proposition : **TF-0317** (`todo\TODO.jsonl`, `ev:creation`,
`ts: 2026-08-17T10:10:02.463Z`, `statut: candidat`) ; `demandeur: "humain (Sébastien) — demande
directe en session pilot"` ; `source: "demande directe du 16/08/2026 (5 idées à travailler quand
le crédit le permettra)"` ; `score: {gain:2, preuve:2, effort:4, valeur:1}` ;
`preuve_du_cout: null`.

**Une inexactitude de l'entrant, relevée avant toute instruction.** TF-0317 écrit :
« renomme-t-on le DÉPÔT (aujourd'hui `digit-ai-forge-steering`, déjà désaligné du nom "pilot"
employé partout) ». C'est faux sur le poste au 17/08/2026, et le fait se vérifie en deux
commandes :

- `git config --get remote.origin.url` → `https://github.com/iguane39/digit-ai-forge-pilot.git` ;
- `gh repo view iguane39/digit-ai-forge-pilot --json name` → `{"name":"digit-ai-forge-pilot"}` ;
- le dossier local est `c:\dev\digit-ai-forge-pilot`, et `ls c:\dev\digit-ai-forge-steering`
  répond « jonction ABSENTE ».

Le dépôt, son remote et son dossier portent **déjà** le nom `pilot`. La première des « deux
questions à trancher » de l'entrant porte donc sur un désalignement qui n'existe plus. Cette
inexactitude ne disqualifie pas la demande — elle en retire le seul argument factuel avancé, et
déplace la charge de la preuve sur le coût du nom actuel (§4, O0).

## 1. Partition du problème

Découpage exhaustif et disjoint. Chaque option de §4 se rattache à une partition.

- **P1 — la présentation extérieure.** Ce que voit quelqu'un qui n'est pas dans le poste : le
  nom du dépôt public, sa description GitHub, la première ligne du README, le prompt d'usage.
  C'est la seule partition que l'entrant motive explicitement (« l'objet présenté à
  l'extérieur »).
- **P2 — les identifiants consommés.** Les chaînes `pilot` qui ne sont pas de la prose mais des
  clés lues par du code : préfixes de schéma, champ `ecrivain`, noms de dossiers cités en
  chemins absolus par des consommateurs extérieurs au dépôt.
- **P3 — la prose vivante.** Les occurrences du mot dans les documents qui sont relus à chaque
  run (noyau, règles, contrat, inventaire, gabarits, références).
- **P4 — l'histoire.** Registres d'événements, ledgers, livrables datés, journal narratif : par
  doctrine déjà tranchée, non réécrits.
- **P5 — la dette du renommage précédent.** Ce que le renommage de 2026-08-09 a laissé derrière
  lui et qui est encore présent aujourd'hui. Partition distincte de P1-P4 : elle existe que l'on
  renomme ou non.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Renommage `forge-steering` → `forge-pilot`, décision humaine du 09/08 | `BOUCLE-AMELIORATION.md` l.379-386 : « Dépôt GitHub renommé (`digit-ai-forge-pilot`, l'ancien nom redirige), dossier local renommé avec **jonction de compatibilité** » | **recouvre** — le geste demandé (dépôt + remote + dossier) a déjà été exécuté une fois sur cet objet ; son coût réel est mesurable, pas à estimer |
| Encodage de ce renommage au corpus des règles | `REGLES-PROJET.md` l.118 : « \| D-14 `forge-steering` → `forge-pilot` \| répercuté partout (bootstrap, README, schéma) \| constatée \| » | **recouvre — et se contredit** : « répercuté partout » est démenti par 26 occurrences résiduelles de `forge-steering` dans le dépôt (`git grep -I -o -i forge-steering \| wc -l` → 26) |
| Item de rattrapage du renommage précédent | `todo\TODO-ARCHIVE.jsonl`, TF-0062 « Rattrapage du renommage pilot chez les produits et missions », `ev:creation ts:2026-08-09T12:38:19.654Z`, puis `{"ev":"maj","ts":"2026-08-11T13:54:28Z","id":"TF-0062","statut":"archive"}` | **recouvre** — le reste-à-faire d'un renommage a déjà eu son item ; il est passé à `archive` **sans** `gains_constates`, `date_correction` ni `corrections_realisees`, alors que `references\TODO-FORGE.md` l.47 exige « **gains_constates exigés à la clôture** » |
| Résolution des chemins de `bootstrap.mjs` | `bootstrap.mjs` l.50 : `iRacine >= 0 ? args[iRacine + 1] : process.env.FORGE_ROOT \|\| dirname(ICI)` | **ne recouvre pas — et n'est pas touché** : la racine se déduit du **parent** du dépôt, jamais de son nom ; la liste `FORGES` (l.19-45) énumère les 14 frères, aucun n'étant le pilot |
| `$FORGE_ROOT` et la convention `digit-ai-forge-*` | `CLAUDE.md` §Chemins : « racine des forges = `$FORGE_ROOT`, sinon le parent de ce dépôt » | **ne recouvre pas** : un dépôt nommé `digit-ai-forge-factory` reste dans `digit-ai-forge-*` ; la convention de préfixe survit au renommage |
| Loi des référentiels à identifiants | `CONTRAT-INTERFACE.md` §3 bis l.116-128 : « une évolution qui déplace ou retire des identifiants embarque une table de correspondance versionnée (`ancien_id → nouvel_id \| retiré`) » | **recouvre** — les identifiants `pilot/catalogue@1` (5 occurrences : `oracles\oracle-catalogues.mjs` ×3, `catalogues\generer-vues.mjs`, `catalogues\catalogue.jsonl`) et `pilot/fraicheur-claims@1` (3 occurrences) tombent sous cette loi ; le précédent payé y est cité (grille seo 82→87 nœuds, 14 ids déplacés, constats écrits « dans le mauvais nœud, sans alerte ») |
| Doctrine de non-réécriture de l'histoire | `BOUCLE-AMELIORATION.md` l.384-386 : « l'HISTOIRE n'est pas réécrite (ledgers, TODO.jsonl, entrées passées de ce journal, livrables datés d'output\) : le mot "steering" y reste un fait d'époque » | **recouvre — et borne le périmètre** : 555 occurrences de « pilot » en `todo\TODO-ARCHIVE.jsonl`, 49 en `todo\TODO.html` (vue générée), 36 en `todo\TODO.jsonl` sont hors périmètre par doctrine, soit ~76 % des 1415 occurrences du dépôt |
| Consigne de rattrapage en run de version | `references\RUN-VERSION.md` l.11 : « Au rattrapage, corriger aussi les **références `digit-ai-forge-steering`** (chemins absolus…) » | **recouvre** — la consigne existe déjà pour l'ancien renommage ; un nouveau renommage la duplique au lieu de la solder |
| Gabarit de remise des lots de retours | `gabarits\RETOURS-FORGES.md` (9 occurrences du mot « pilot ») + `CLAUDE.md` §Clore : « remis à `<pilot>\input\00-retours\` » | **recouvre partiellement** : le gabarit désigne le pilot par un **jeton** `<pilot>`, pas par un chemin en dur — le renommage y coûte la seule prose |
| Description GitHub du dépôt public | `gh repo view iguane39/digit-ai-forge-pilot --json description,visibility` → `{"description":"","visibility":"PUBLIC"}` | **ne recouvre pas** — la surface de présentation extérieure la plus directe est **vide et inutilisée** ; elle est disponible sans renommer quoi que ce soit |
| Prompt d'usage du README (porte d'entrée réelle) | `README.md` l.95, 105, 116, 123, 130, 137, 144 — 7 occurrences de `https://github.com/iguane39/digit-ai-forge-pilot` en tête des prompts d'usage | **touché** — mais préservé par la redirection GitHub (§4) : ces 7 URL continuent de fonctionner après renommage |
| Registre des insatisfactions (où un coût vécu se dépose) | `insatisfactions\REGISTRE.jsonl` : un seul dossier, `INS-0001`, `produit: "produit-07"`, `resume: "le menu français est compressé…"` | **ne recouvre pas — et c'est le fait décisif** : aucune insatisfaction n'a été déposée sur le nom du pilot ; le circuit prévu pour capter un coût vécu est vide sur ce sujet |
| Registre TF, recherche d'un coût déclaré du nom | `todo\TODO.jsonl`, TF-0317 : `"preuve_du_cout":null` et `score.preuve: 2` — aucun autre item du registre ne signale une confusion de nom | **ne recouvre pas** : le seul item qui parle du nom est celui-ci, et il déclare lui-même n'avoir pas de preuve de coût |

## 3. État de l'art daté

**Non instruit** — motif : le sujet est le choix d'un nom propre pour un dépôt
d'un seul poste, dans un écosystème privé de 15 dépôts. Il n'existe pas de littérature
comparative applicable : aucun corpus externe ne peut trancher entre « pilot » et « factory »
pour cet objet, et aucune mesure publiée ne s'appliquerait à un périmètre de cette nature. La
seule source externe pertinente n'est pas une revue de littérature mais une **contrainte de
fournisseur** — le comportement de GitHub au renommage — et elle est citée là où elle produit un
effet, en §4 : *Renaming a repository*, GitHub Docs, consulté le 2026-08-17,
`https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository`.
Instruire ici cinq sources datées reviendrait à habiller la décision : elle se joue entièrement
sur des faits du poste, tous relevés et cités en §2 et §4.

## 4. Options — jeu fermé O0-O4

**Contrainte de fournisseur, commune à toutes les options qui renomment.** GitHub Docs,
*Renaming a repository* (consulté 2026-08-17) : toutes les opérations `git clone`, `git fetch` et
`git push` visant l'emplacement précédent continuent de fonctionner comme si elles visaient le
nouveau ; la documentation recommande néanmoins de mettre à jour les clones locaux
(`git remote set-url`), et pose une réserve **dure** : si un nouveau dépôt réutilise plus tard
l'ancien nom, les redirections cessent. Ce comportement a été **constaté sur cet objet même** au
renommage du 09/08 (`BOUCLE-AMELIORATION.md` l.381 : « l'ancien nom redirige »). Conséquence
opposable : un renommage ne casse **ni** les 7 URL du prompt d'usage du README, **ni** les
clones existants, **ni** `bootstrap.mjs` (§2). Ce qu'un renommage casse tient à trois choses,
et trois seulement : les **chemins absolus en dur** chez les consommateurs, les **identifiants de
schéma** (§3 bis), et la **cohérence de la prose** relue à chaque run.

**Chiffrage commun, relevé le 17/08/2026.** Périmètre réel d'un renommage complet, une fois
l'histoire écartée par doctrine (P4) :

| Surface | Relevé | Commande |
|---|---|---|
| Pilot, prose et code **vivants** | **334 occurrences de « pilot » dans 58 fichiers** (hors `todo\*.jsonl`, `todo\TODO.html`, `output\`, `input\`, `runs\`, `*.oracles.json`) | `git grep -I -o -i -w pilot -- ':!todo/*.jsonl' ':!output/*' …` |
| Pilot, têtes de liste | `BOUCLE-AMELIORATION.md` 54 · `catalogues\catalogue.jsonl` 29 · `catalogues\CATALOGUES.md` 28 · `REGLES-PROJET.md` 25 · `INVENTAIRE.md` 14 · `README.md` 13 · `CONTRAT-INTERFACE.md` 13 · `CLAUDE.md` 6 | idem, `cut -d: -f1 \| uniq -c` |
| 14 dépôts frères | **48 occurrences de `forge-pilot` dans 21 fichiers** : organization 16 (6 fichiers), websec 6, agents-security 5, tests 3, et 2 chacun pour agents, audit, conception, data, design, development, observability, ops, seo | `git grep -I -o -i forge-pilot` dans chaque dépôt |
| Produits déjà nés | **13 `CLAUDE.md` de produits** hors dépôts forges (BeefProject · VCA/AgentIA · VCA/FinTech · VCA/Retail · Approval · Produit-01 · archimate · Produit-11 · COMPTA-Fournisseur-A · Produit-08 · Plateforme_video_IA · RefAudit · Produit-10). **Un seul** cite `forge-pilot` (Produit-10, 1 occurrence) ; **aucun** ne cite `forge-steering` | `find . -maxdepth 3 -name CLAUDE.md -not -path './digit-ai-forge-*'` puis `grep -c` |
| Produits, toutes surfaces | **50 occurrences** réparties sur 5 produits : Produit-10 30 · Produit-01 10 · BourseAuxVacants2 6 · COMPTA-Fournisseur-A 3 · Cockpit IA 1. Dont **histoire non réécrite** : `forge\ledger.jsonl` (Produit-10 8, Produit-01 7) et `forge\retours\*` (Produit-10 9, Produit-01 3). **Surface vivante réelle : 9 occurrences, 3 fichiers, 1 produit** — Produit-10 `PROMPT-PRODUIT.md` (5), `docs\projet\COMMANDES.md` (3), `CLAUDE.md` (1) | `grep -r -I -o -i -e forge-pilot -e forge-steering` par produit |
| Identifiants sous §3 bis | `pilot/catalogue@1` (5) · `pilot/fraicheur-claims@1` (3) · `"ecrivain": "pilot"` (1) — **table de correspondance versionnée obligatoire** | `git grep -I -o -e 'pilot/[a-z-]*@[0-9]'` |

**Le coût réel du précédent D-14, mesuré et non estimé.** L'entrant demande ce coût ; le voici,
tel qu'il est relevable aujourd'hui, 8 jours après le geste du 09/08 :

1. `REGLES-PROJET.md` l.118 déclare D-14 « répercuté partout (bootstrap, README, schéma) » et son
   état « constatée » — pendant que **26 occurrences de `forge-steering` subsistent** dans le
   dépôt. Une partie est légitimement de l'histoire (`output\`, `runs\`, `BOUCLE`), mais deux
   occurrences sont **vivantes et opposables** : `REGLES-PROJET.md` l.118 elle-même, et
   `references\RUN-VERSION.md` l.11 qui porte encore la consigne de rattrapage.
2. TF-0062, l'item de rattrapage, est passé de `candidat` (09/08) à `archive` (11/08) en 2 jours,
   **sans un seul champ de clôture renseigné** — ni `gains_constates`, ni `corrections_realisees`,
   ni `date_correction`. Le rattrapage n'a donc pas été *fait* : il a été *classé*.
3. La jonction de compatibilité `c:\dev\digit-ai-forge-steering`, que TF-0062 ordonnait de
   « **NE PAS** supprimer avant ce rattrapage », est **absente** du poste. Elle a donc disparu
   avant que le rattrapage ne soit prouvé.
4. Contre-mesure du coût : la conséquence redoutée ne s'est pas matérialisée. Aucune
   insatisfaction, aucun lot de retours, aucun item TF ne signale une rupture imputable au
   renommage. Le coût du précédent est donc **un coût de traçabilité, pas un coût de panne** :
   trois affirmations de conformité fausses dans le corpus, et un item clos sans preuve.

C'est le fait qui doit gouverner ce verdict : **un renommage sur cet écosystème ne casse pas le
poste, il casse la confiance qu'on peut accorder aux déclarations de conformité du corpus.** Et
la loi 1 du noyau (« toute affordance est câblée ou n'existe pas ») a un pendant exact ici : une
conformité déclarée sans être vérifiée n'existe pas.

- **O0 — ne rien faire.** *Contenu* : le nom `pilot` reste, aucun geste.
  *Coût du statu quo, cité* : **nul et non mesuré**. Les trois circuits de l'écosystème prévus
  pour capter un coût vécu sont vides sur ce sujet — `insatisfactions\REGISTRE.jsonl` ne contient
  qu'`INS-0001` (menus de produit-07) ; aucun lot de `input\00-retours\` ne signale une
  confusion de nom ; et TF-0317 déclare lui-même `"preuve_du_cout":null` avec `score.preuve: 2`.
  L'unique argument factuel de l'entrant — le dépôt serait « aujourd'hui
  `digit-ai-forge-steering` » — est démenti par `git remote -v` (§0). Le nom est par ailleurs
  **exact** pour ce que le noyau décrit : `CLAUDE.md` ouvre sur « Tu es l'orchestrateur », et
  `README.md` l.205 pose « **Le pilot est le seul conducteur** » — conduire est bien ce que fait
  l'objet ; « factory » nommerait l'écosystème entier, dont ce dépôt n'est qu'une pièce.
  *Ce que O0 exclut* : O0 laisse intacte la dette de P5 (les 3 affirmations fausses ci-dessus).
  **O0 n'est donc pas retenue telle quelle** — non parce que le nom coûte, mais parce que le
  renommage *précédent* coûte encore, et qu'un statu quo intégral laisserait ce coût au corpus.

- **O1 — renommage complet** (dépôt GitHub `gh repo rename`, dossier local, prose vivante,
  frères, produit, identifiants de schéma). *Coût* : 334 occurrences vivantes du pilot sur 58
  fichiers + 48 chez 14 frères — or **aucune écriture n'est permise dans un dépôt frère hors
  mandat humain** (`CLAUDE.md` §Garde-fous), donc 14 mandats ou 14 runs de version ; + 9
  occurrences vivantes chez Produit-10, produit **autonome** que le pilot ne touche que sur run
  demandé (même garde-fou) ; + 2 identifiants de schéma exigeant chacun une table de
  correspondance versionnée (§3 bis) et la reprise de 3 oracles (`oracle-catalogues.mjs`,
  `oracle-fraicheur-doc.mjs`, `generer-vues.mjs`) ; + la reprise de l'entrée D-14 et de
  `RUN-VERSION.md` l.11, qui devraient alors porter **deux** renommages successifs. *Ce qu'elle
  exclut* : elle interdit de garder les identifiants `pilot/*@1` stables, et elle rend le corpus
  porteur d'une chaîne à trois noms (`steering` → `pilot` → `factory`) là où le précédent à deux
  noms a déjà produit trois affirmations fausses. Effort déclaré `4` : confirmé par le relevé.

- **O2 — renommage de PRÉSENTATION seule.** *Contenu* : trois gestes, aucun sur un chemin, un
  identifiant ou un dépôt. (a) renseigner la **description GitHub**, aujourd'hui vide sur un
  dépôt public (`gh repo view` → `"description":""`) — c'est la surface que voit littéralement
  « l'extérieur » dont parle l'entrant, et elle est inutilisée ; (b) une ligne d'ouverture du
  `README.md` qui nomme l'objet dans les termes de la demande (l'usine qui mobilise les forges
  bout en bout), le nom technique du dépôt restant inchangé ; (c) une ligne au
  `BOUCLE-AMELIORATION.md` qui trace que l'appellation extérieure et le nom du dépôt sont
  **délibérément distincts**, afin qu'un futur run ne le lise pas comme un défaut.
  *Coût* : 1 champ GitHub + 2 lignes de prose. Zéro dépôt frère, zéro produit, zéro identifiant,
  zéro table de correspondance, zéro oracle à reprendre — le noyau reste sous son plafond de 6 Ko.
  *Ce qu'elle exclut* : elle n'aligne pas le nom technique sur l'appellation ; elle assume cet
  écart et l'écrit. Elle ne ferme aucune porte : O1 reste accessible plus tard, à coût inchangé.

- **O3 — solder la dette du renommage précédent, sans en ouvrir un nouveau** (partition P5
  seule). *Contenu* : corriger l'état de D-14 en `REGLES-PROJET.md` l.118 (« répercuté partout »
  est faux), traiter les occurrences vivantes de `forge-steering`, et rouvrir la question de
  TF-0062 clos sans `gains_constates` contre `TODO-FORGE.md` l.47. *Coût* : ~3 fichiers vivants.
  *Ce qu'elle exclut* : elle ne répond pas à la demande humaine, qui porte sur le nom, pas sur la
  dette. Retenir O3 seule serait répondre à côté.

- **O4 — renommage complet différé, conditionné à une preuve.** *Contenu* : O1 reste candidate
  mais ne passe en décidé que lorsqu'un coût du nom est **déposé** dans un circuit existant — une
  insatisfaction au `REGISTRE.jsonl`, ou un lot de `forge\retours\` mentionnant une confusion.
  *Coût* : nul jusqu'au déclenchement. *Ce qu'elle exclut* : elle laisse la demande humaine sans
  réponse observable pendant l'attente, ce qui est précisément le reproche que l'entrant adresse
  au nom actuel — être juste sans être lisible.

## 5. Verdict

- **Option retenue** : O2 — renommage de présentation seule.
- **Motif opposable** : la demande porte explicitement sur « l'objet présenté à l'extérieur ».
  Le relevé montre que la surface extérieure la plus directe — la description d'un dépôt
  **public** — est **vide** (`gh repo view` → `"description":""`), tandis que le coût d'un
  renommage technique est chiffré à 334 occurrences vivantes sur 58 fichiers, 48 chez 14 dépôts
  frères qu'aucune écriture ne peut toucher hors mandat, 2 identifiants de schéma sous table de
  correspondance §3 bis, et un précédent (D-14) qui a déjà laissé **3 affirmations de conformité
  fausses** au corpus pour un renommage de moindre portée. Payer le maximum pour traiter un
  symptôme dont le circuit de mesure est vide, alors que la surface visée est disponible pour le
  minimum, n'est pas soutenable. O2 satisfait l'intention à son point d'application réel.
- **Coût** : 1 champ de description GitHub, 2 lignes de prose (`README.md`,
  `BOUCLE-AMELIORATION.md`). Aucun dépôt frère, aucun produit, aucun identifiant, aucun oracle
  touché. Dette créée : **un écart assumé et écrit** entre l'appellation extérieure et le nom
  technique du dépôt — dette dont le porteur est la ligne (c) de O2 elle-même, qui existe pour
  empêcher qu'un run futur la relise comme un défaut.
- **Gate humain (rappelé même si O2 ne le déclenche pas)** : si le pilot ou l'humain revient sur
  O1, le geste `gh repo rename` est un **GATE HUMAIN** — jamais joué par un agent. Motifs :
  l'irréversibilité pratique de la réserve GitHub (réutiliser l'ancien nom casse définitivement
  les redirections, GitHub Docs 2026-08-17), le fait que le dépôt soit **public**, et R-29 du
  corpus (« les gates déjà en place — GO production, mandats humains — priment toujours sur
  R-29 », `REGLES-PROJET.md` l.168-169). L'agent prépare la commande et l'inventaire ; l'humain
  seul l'exécute.
- **Candidature(s) émise(s)** : une candidature distincte pour le contenu de O3, qui existe
  indépendamment de la présente décision — *« Solder la dette du renommage D-14 : "répercuté
  partout" est faux, TF-0062 clos sans gains_constates, jonction de compatibilité supprimée avant
  preuve »*, cibles `pilot`, appuyée sur les 3 constats chiffrés de §4. Écrite au registre par le
  pilot (écrivain unique, `references\TODO-FORGE.md` l.6) ; **la présente étude n'écrit rien au
  registre**. TF-0317 est proposé à la clôture en `ecarte` avec ce motif :
  *« instruite le 17/08 ; renommage technique non retenu faute de coût mesuré du nom (3 circuits
  de captation vides) ; intention satisfaite par O2 ; réouvrable par O4 sur dépôt d'une preuve »*.
- **Plan de revue** : **2026-11-17** (3 mois). Le verdict sera confronté à trois faits
  vérifiables, dans cet ordre : (1) `insatisfactions\REGISTRE.jsonl` contient-il, depuis le
  2026-08-17, un dossier imputant un coût au nom du pilot ? (2) un lot de `input\00-retours\`
  mentionne-t-il une confusion de nom ? (3) la description GitHub renseignée par O2 est-elle
  toujours en place et exacte (`gh repo view --json description`) ? **Si (1) ou (2) est vrai, O4
  se déclenche et O1 revient en instruction avec la preuve manquante.** Si les trois sont faux et
  (3) est vrai, le verdict est confirmé et TF-0317 reste écarté. Revue intermédiaire de
  circonstance : à la naissance du prochain produit, vérifier que son `CLAUDE.md` n'introduit pas
  de nouveau chemin absolu vers le pilot (le relevé du 17/08 en compte 1 sur 13).
