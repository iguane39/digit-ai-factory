# TODO-FORGE — registre des améliorations, mode opératoire

Référence chargée à la demande depuis le noyau `CLAUDE.md` (TF-0053).

Le registre structuré des améliorations vit dans `todo\` : source unique `TODO.jsonl`
(événements `creation`/`maj`/`ingestion`, écrivain unique : le pilot), vue générée `TODO.md`
(jamais éditée), archive `TODO-ARCHIVE.jsonl` (ids jamais réutilisés), `oracle-todo.mjs`
(R1-R11) à faire passer après toute écriture.

**Écrire au registre : `node todo\journaliser.mjs --fichier <evenements.json>`** (TF-0413,
20/08). Les événements y entrent **sans `ts`** — l'outil le STAMPE. Il refuse tout événement
qui en porte un, sans rien écrire, et il ANNULE son écriture (fichier repris à l'octet près)
si `oracle-todo` passait avant et échoue après. `--essai` montre ce qui serait écrit.
*Pourquoi c'est un outil et pas une consigne* : les `ts` composés à la main étaient en avance
de 2 h 40 à 7 h 30 sur l'heure réelle — dix clôtures sur six jours, aucune en retard, pendant
que les événements écrits par `ingerer-lot.mjs` collaient au commit à la minute. Une heure
qu'on écrit soi-même est une heure qu'on invente ; aucune durée n'était calculable au registre.
**R11** constate le défaut (un `ts` postérieur à l'heure d'exécution est un FAIL, tolérance
d'horloge de 2 min, antériorité déclarée en deçà du 20/08 18:30 Z) ; `journaliser.mjs` en
supprime la cause. L'heure d'un fait RAPPORTÉ (décision d'hier, correction d'avant-hier) est
une donnée : `date_decision`, `date_correction` — jamais `ts`, qui est l'heure de
consignation.

**Deux sessions, un seul compteur : ce qui est couvert et ce qui ne l'est pas** (TF-0394 puis
TF-0481). Le préflight de `ingerer-lot.mjs` fait `git fetch` puis compare `HEAD..origin/main`
sur les deux registres, et REFUSE l'ingestion si le distant a avancé — sinon les ids séquentiels
repartiraient du mauvais maximum. C'est juste, et ça reste.

Mais c'est un **check-then-act** : il regarde AVANT d'écrire. Il ne peut rien contre la fenêtre
qui s'ouvre PENDANT l'ingestion — deux sessions qui frappent les mêmes numéros avant que l'une
ait poussé. **Cette fenêtre a été payée trois fois** : une avant TF-0394, puis deux le 22/08 —
cinq candidatures renumérotées le matin avec trois commits de rattrapage, et un `TF-0514` frappé
pendant qu'une autre session publiait le sien le soir.

Deux mécanismes s'y ajoutent, et **aucun des deux ne ferme la fenêtre** :

- un **post-contrôle** après écriture : l'ingestion re-`fetch` et compare les ids qu'elle vient
  de frapper à ceux d'`origin`. Il ne peut pas échouer — l'écriture est faite, annuler perdrait
  le travail — mais il AVERTIT, nomme les ids en cause et donne la commande qui répare. La
  fenêtre n'est pas fermée : elle cesse d'être découverte à la main, plus tard ;
- **`node todo\renumeroter.mjs <ancien> <nouveau> --motif "…"`**, parce que le coût mesuré n'est
  pas la collision mais la RENUMÉROTATION MANUELLE. L'outil REFUSE un motif de moins de
  30 caractères, un id absent, et un id cible déjà pris — **archive comprise**, un numéro archivé
  restant pris. Le motif s'annote dans le champ `source` de la création, à la suite de ce qui y
  était : *un identifiant qui change sans que la raison soit lisible vaut moins qu'un identifiant
  absent*, et l'histoire s'annote au lieu de se réécrire.

**Les deux voies qui fermeraient vraiment la fenêtre sont écartées, et il vaut mieux dire
pourquoi que les laisser croire possibles.** Frapper les ids AU PUSH suppose que tout l'aval
(vues, oracle, TODO-PRODUIT) sache travailler sur des lots sans numéro : ce n'est pas un
correctif, c'est un changement de modèle. Réserver un bloc atomiquement sur `origin`
fonctionnerait — la mise à jour d'une référence git EST un compare-and-swap — mais elle exige de
POUSSER pendant l'ingestion, et R-38 réserve le push au GO humain : un outil qui publie sans GO
pour se protéger d'une collision échangerait un défaut contre une violation.

**Une correction close REDESCEND chez les producteurs, ou elle se rouvre (R12, TF-0757, 02/09).**
Trois récidives en quatre jours sur un seul projet ont montré que les retours MONTENT au registre
et ne redescendent pas sous une forme qu'un producteur rencontre au moment où il produit — un
registre de candidatures n'est pas une redescente. Toute clôture en `corrige` postérieure au
02/09/2026 15:00 Z porte un champ **`descente`** : `regle` (la règle générique écrite au socle ou au
gabarit, avec sa référence), `oracle` (le contrôle qui la joue), `digest` (la ligne du référentiel
hérité par les produits), ou `non_mecanisable` (l'énoncé explicite et son motif). R12 refuse la
clôture qui n'en porte aucun — et `journaliser.mjs` annule alors l'écriture. *Une correction qui vit
dans le registre du pilot et nulle part chez le producteur n'est pas câblée* (loi n° 1). Les 600+
clôtures antérieures restent de la prose : c'est déclaré, pas rattrapé.

**Un retour porte sa CLASSE, et une récidive se COMPTE — jamais refusée (R13, mandat du 03/09/2026).**
Mesuré au pas 0 du mandat, sur les 788 items du registre : **50** déclaraient une récidive en toutes
lettres (« déjà corrigé », « reproduit », « récidive ») — 6 % du registre, en hausse chaque semaine
d'août (1, 11, 15, 19) — et AUCUN champ ne permettait de les compter. Un classement automatique par
famille de mots-clés a été essayé d'abord : 94 % de « récidives » sur les grandes familles, 321
items dans plusieurs familles, 196 dans aucune — inexploitable, parce qu'une famille (« page
HTML ») n'est pas un défaut (« polices distantes chargées »). D'où trois choses câblées le même
jour. (1) **Le référentiel `todo\CLASSES.json`** — donnée datée (loi n° 4), deux niveaux : la
FAMILLE sert à lire, la CLASSE sert à compter ; une classe est un défaut généralisé avec la règle
où il vit, l'oracle qui la joue et les clôtures qui l'ont fondée (`fondee_par`, ids seulement —
la date se lit au registre, N-6). Il est **hérité en copie identique** (`forge\retours\CLASSES.json`,
R-47) : le producteur qui écrit un lot y lit ce qu'il doit déclarer. (2) **À l'ingestion**, tout
retour d'un lot daté du 03/09 ou après porte `classe` ; absente ou inconnue, `ingerer-lot.mjs`
REFUSE en nommant les clés proches — une classe nouvelle se crée dans le référentiel, jamais dans
un sidecar. Un retour dont la classe est déjà close en `corrige` ENTRE, marqué `recidive_de`,
avec l'oracle censé l'avoir attrapé : la récidive est la mesure de la descente, la refuser la
cacherait. Une classe créée SANS clôture fondatrice moins de 30 jours après un retour d'une classe
voisine est signalée `classe_suspecte` — la façon la moins chère de faire baisser un compteur est
d'inventer des clés. (3) **R13** de l'oracle : une classe hors référentiel est un FAIL ; une
récidive marquée est AVERTISSANTE (doctrine v2.5.0 de la restitution : elle se durcira sur corpus
propre). **La vue `todo\RECIDIVES.md`** (`generer-recidives.mjs`, générée, jamais éditée)
porte le taux de récidive par classe et par produit, le délai clôture → descente constatée (lu
dans `todo\HERITAGE-RELEVES.jsonl`, que le hook d'ouverture du pilot écrit à chaque relevé
R-47), le taux d'héritage par artefact, et la contre-métrique : classes créées par semaine et
classes sans fondateur. Ce qui n'est pas mesurable y est dit, jamais mis à zéro. Recettes :
`todo\ingerer-classe.test.mjs` (8 cas), `todo\self-test.mjs` (R13, 2 cas),
`todo\generer-recidives.test.mjs` (5 cas). La cadence de relecture du référentiel — la revue
des classes — est écrite dans `BOUCLE-AMELIORATION.md`.

**Gouvernance** : tout entre en `candidat` ; seul un mandat humain (« décide TF-xxxx », un lot de
décisions appliqué par `todo\appliquer-export.mjs` — format `TF-decisions-*.json`, produit
par l'humain et non plus par la page (TF-0328) — ou un mandat global explicite) passe en `decide` — le décideur
et la date sont tracés (R6). Transitions : candidat→decide→en_cours→corrige|ecarte→archive.
Clôture `corrige` : `gains_constates`, `corrections_realisees`, `date_correction` exigés (R7).

**Intake** : lots des produits (règle 18), **lots des forges** (toute forge peut déposer un
lot ciblant n'importe quelle forge — même gabarit, remise dans `input\00-retours\`, préfixé
du projet ou de la forge émettrice), demandes humaines directes ; candidatures hors lot :
`input\01-candidatures\`. **Avant toute ingestion, confronter le lot au registre ET à
l'archive** : un lot déjà traité par un autre canal part en `old\` sans ingestion (incident
du 13/08 : 32 doublons créés puis retirés pour l'avoir omis). L'écriture DIRECTE dans
TODO.jsonl par une autre session est **interdite** — toute candidature passe par un sidecar
`.tf.jsonl` + `node todo\ingerer-lot.mjs <sidecar>`
(validation atomique, idempotente par sha du lot, ids frappés à l'ingestion). Le contournement
se détecte : règle **R10** de l'oracle (creation de session externe sans événement
`ingestion` — incident TF-0049).

**Ce qu’un lot n'a PAS remonté se déclare (R-45, 21/08).** Tout lot daté du 21/08 ou après
porte une section « Remarques restées au produit » : chaque remarque que le produit a corrigée
chez lui sans la remonter y figure avec son **verdict de généralisation** — non généralisable et
pourquoi, ou généralisable et alors REMONTÉE. Aucun lot n'en a ? Il l'écrit. Câblé aux deux
bouts : `ingerer-lot.mjs` REFUSE le lot (rejet atomique) et `oracle-boite-entree` **B6** le
constate. *Ce qui se perd dans un tri silencieux n'est pas le défaut : c'est sa CLASSE* — largeur
de lecture, tableaux illisibles au mobile, états vides absents ont tous commencé comme « un
défaut de ce livrable-là ». La justesse du verdict n'est PAS jugée : un raisonnement écrit peut
être faux et se corrige, un raisonnement absent est perdu pour tout le monde.

**Ce qu'un document a coûté à son gabarit se déclare (R-46, 22/08).** Pendant de R-45, côté
LIVRABLES. Tout lot daté du 22/08 ou après porte une section « Retours sur les documents
produits » : pour chaque document tiré d'un gabarit de `gabarits\documents\`, le couple
`gabarit` + `version_du_gabarit` qu'il affiche en en-tête, ce qui a manqué, ce qui a gêné le
LECTEUR, ce qui a été ajouté à la main, et la portée. Aucun document issu d'un gabarit ? Le lot
l'écrit. Câblé aux deux bouts — `ingerer-lot.mjs` REFUSE, `oracle-boite-entree` **B7**
constate — et le fil est prescrit en amont par **G8** de `oracle-gabarits-documents`.
*Pourquoi ce canal manquait* : celui qui existait parle des FORGES, jamais des DOCUMENTS. Les
quatre premières familles de la bibliothèque ont été extraites en allant chercher à la main ce
que les projets refaisaient — un gabarit barré par un projet, des runbooks réinventés quatre
fois. Rien ne faisait remonter cette matière en continu.

**Prouver la boîte vide, à l'ouverture de tout run** — `node oracles\oracle-boite-entree.mjs`
(B1-B5, self-test 17/17, exit 0/1/2). Le 14/08, un lot `Produit-10 - RETOURS - 20260814b`
(5 candidatures) est resté dans `input\00-retours\` sans être ingéré pendant qu'un autre lot
du même jour l'était ; rien ne l'a signalé, et il a été trouvé par hasard en listant les
fichiers non suivis avant de poser un tag. La leçon tient en une phrase : **un registre à jour
ne dit rien de ce qui n'y est jamais entré** — l'oracle R1-R10 juge l'intégrité de ce qui est
DEDANS, jamais l'existence de ce qui est resté DEHORS. Trois défauts, tous mesurés sur le cas
réel : sidecar jamais ingéré (B1), sidecar édité APRÈS son ingestion — le registre en porte le
nom mais plus le contenu (B2), lot `.md` remis sans sidecar, donc ingérable par aucun canal et
invisible par construction (B3). Un sidecar brut au format produit est couvert par son dérivé
`.normalise.tf.jsonl` ingéré, et `old\` reste hors périmètre : le canal d'échappement
documenté plus haut n'est pas un défaut.

**Un lot reçu sous un nom interdit se NETTOIE SUR DISQUE avant d'entrer, et une empreinte qui
change par anonymisation se RE-CONSIGNE avec sa preuve (02/09).** Le lendemain de la passe
d'anonymisation du 01/09 (D-37), la boîte rendait 23 constats B2 et 5 constats B1 pour ZÉRO
édition : l'empreinte consignée était celle du fichier d'avant la passe. Trois pièces ferment ce
trou. (1) `node todo\anonymiser-suivis.mjs --fichiers <chemin>…` nettoie une liste EXPLICITE,
suivie ou non par git — c'est la voie d'un lot reçu avec un nom de client : contenu et nom
réécrits sur disque avant `ingerer-lot`, l'original restant chez le produit ; le pilot n'ajoute
jamais un lot brut au suivi. (2) `node todo\reempreinter-lot.mjs <sidecar>` consigne la nouvelle
empreinte d'un sidecar déjà ingéré SEULEMENT s'il PROUVE que le contenu courant est la forme
anonymisée du contenu ingéré : version retrouvée dans l'historique git (renommages compris), copie
d'avant fournie par `--avant`, ou `--par-rapprochement` (titres du sidecar = créations consignées,
en nombre égal) — tout le reste est REFUSÉ comme édition. L'événement est une `ingestion` sans
`creations` portant un bloc `reempreinte` (empreinte d'avant, motif, preuve). `anonymiser-suivis`
l'appelle lui-même sur chaque sidecar qu'il réécrit : celui qui change un contenu est le seul à
tenir la preuve. (3) Deux lots d'un même produit remis le même jour sous le même indice par deux
sessions se **réindexent** à la réception (indice suivant libre, note en tête du `.md`, source du
sidecar suivie) : deux lots sous un même nom ne s'ordonnent pas — classe TF-0750, transposée aux
lots. Recettes : `todo\reempreinter-lot.test.mjs` (12 cas), `todo\ingerer-anonymise-fichier.test.mjs`
(l'événement d'ingestion passe par la même substitution que la candidature — RT-11 du Produit-12).

**Réécrire l'historique d'un dépôt est un geste humain décidé, outillé par un mode opératoire
fixe (TF-0752, D-38 (a), 03/09).** Nettoyer l'arbre ne nettoie pas le passé : le 01/09, la porte
de publication rendait 200 constats dans l'historique seul du pilot. La séquence jouée, et à
rejouer telle quelle sur tout dépôt qui publie : (1) **sauvegarde entière** — `git bundle create
<hors-dépôt>/<dépôt>-avant-filter-repo.bundle --all`, vérifiée par `git bundle verify`, HEAD
d'avant consigné à côté ; (2) **règles dérivées des tables, jamais écrites à la main** —
`node scripts\generer-remplacements-historique.mjs <dossier>` produit `remplacements.txt`
(contenus + messages) et `filename-callback.py` (noms de fichiers) depuis `_noms-interdits.json`
et `_produits-pseudonymes.json`, lues au moment du geste ; (3) **réécriture** —
`git filter-repo --replace-text <dossier>\remplacements.txt --replace-message <même fichier>
--filename-callback "$(cat <dossier>\filename-callback.py)" --force` (répondre N si l'outil
propose de continuer une passe d'un autre jour) ; (4) **remettre `origin`**, que l'outil retire ;
(5) **juger** — `oracle-nom-client-publie .` doit rendre PASS, historique compris ; un constat
restant se traite en corrigeant le GÉNÉRATEUR (pas le fichier de règles) et en rejouant (3)-(5).
Ce que la première passe a appris : un sigle se remplace insensible à la casse, comme la porte le
juge — 96 constats tenaient à un identifiant de run en minuscules. Après le geste, deux choses
restent humaines : la publication forcée (`git push --force`, R-38) et toute autre copie locale du
dépôt, devenue incompatible avec la nouvelle histoire (à recloner, pas à fusionner).

**La propagation d'une correction se MESURE, elle ne se souhaite pas (TF-0689, 01/09).** Le
champ `produits_beneficiaires` est de la prose — 73 items clos en portaient au 27/08, aucun
n'était opposable à personne, et un produit nommé bénéficiaire a livré DEUX FOIS sans le
correctif à quatre jours de sa clôture. Trois pièces ferment la boucle : (1) une clôture PEUT
porter `criteres_beneficiaires` — `{familles_de_gabarit: ["gd-…"], types_de_livrable: ["…"]}`,
structure fermée confrontable au marqueur G4 des documents et au 2ᵉ segment des noms datés ;
(2) le produit tient `forge\socle-adopte.jsonl` — une ligne `{tf, date_adoption, preuve}` par
adoption, la preuve étant un FAIT (fichier, commande, empreinte, commit) ; (3)
`oracles\oracle-propagation.mjs <dossier produit>` confronte les deux (P1-P2, self-test 8/8) et
est joué À CHAQUE LOT REMIS par `ingerer-lot.mjs`, en avertissement jamais en blocage — un
produit n'est jugé QUE sur ce qu'il PRODUIT (pas de production concernée = SANS_OBJET). Bornes
déclarées : les 600+ items archivés avant la convention restent de la prose ; la véracité des
preuves d'adoption relève du produit.

**Étude d'opportunité (TF-0155)** : avant de passer en `decide` un candidat qui **crée un
objet durable** (R-31), **touche ≥ 3 forges ou le noyau**, ou **porte un gain ≥ 3 avec une
preuve ≤ 2**, l'instruire via `gabarits\ETUDE-OPPORTUNITE.md` (livrable :
`output\03-etudes\`), jugée par `oracles\oracle-etude-opportunite.mjs` (E1-E7, self-test
`--self-test`). Sous le seuil : décision directe, pas de péage.

**À chaque campagne** : mettre à jour les items (date_correction, corrections_realisees,
**gains_constates exigés à la clôture**, version_forge_corrigee, produits_beneficiaires) puis
régénérer la vue **et la page** (`generer-page.mjs` → `TODO.html`, consultation humaine en
LECTURE SEULE : les cases à décider et les commentaires ont été retirés le 12/08 sous mandat
humain, les décisions se prenant hors page — cette prescription a survécu six jours à son objet,
et TF-0318 a été instruit dessus ; TF-0328). Le self-test
(`node todo\self-test.mjs`, fixtures à double sens) après toute évolution de l'outillage.

Consulter le registre à l'ouverture de tout run. `BOUCLE-AMELIORATION.md` reste le journal
narratif : il référence les ids TF, il ne duplique plus les listes.

## Insatisfactions — l'autre registre, et pourquoi il est séparé (TF-0287, 15/08)

Une **insatisfaction** n'est pas une amélioration : elle se **rouvre** (« ça ne va
toujours pas »), elle porte un délai dépôt→release, et son instruction est un dossier à
six blocs. Ce cycle de vie n'entre pas dans TF (candidat → décidé → corrigé → archivé) :
forcer l'un dans l'autre aurait déformé les deux (étude 20260815d, option O3 écartée).

- **Dépôt** : l'humain écrit UNE phrase et dépose ses captures — `gabarits\INSATISFACTION.md`,
  nommé `INSATISFACTION - <produit|a-identifier> - AAAAMMJJ<lettre>.md`, dans le canal des
  lots (`<produit>\forge\retours\` ou `<pilot>\input\00-retours\`). **Aucun sidecar exigé
  de lui** : c'est l'instruction qui le produira. Il n'écrit **jamais** le protocole.
- **Registre** : `insatisfactions\REGISTRE.jsonl` (écrivain unique : toi) — événements
  `depot` · `reouverture` · `instruction` · `cloture` ; vue `REGISTRE.md` générée.
- **Instruction** : `gabarits\AGENT-INSATISFACTION.md` (= AGENT-CAMPAGNE + les six blocs :
  reproduction aux conditions réelles · cause racine produit · **gates en défaut vérifiés,
  jamais présumés** (inexistant / aveugle / jamais joué — R-35) · solutions par
  destinataire · correctif et release par la voie du produit sous décision humaine ·
  retours forge en lot standard).
**Remise d'un artefact réclamé (TF-0364, 18/08)** — quatrième canal, pour un cas que les trois
autres ne couvraient pas : le registre constate qu'un objet lui manque, il le **demande**, et
l'humain le **remet**. Le 18/08, TF-0326 a réclamé le skill `pilote-de-mission` (introuvable
dans les 15 dépôts) ; il est arrivé à plat dans `input\`, et le traitement a fonctionné **parce
qu'une session était là pour faire le lien** — rien dans les fichiers ne reliait la remise à
l'item. Canal : `input\03-artefacts\` (notice sur place). Partage des rôles identique aux
insatisfactions : **l'humain dépose, il n'écrit aucun protocole** ; c'est le pilot qui écrit le
sidecar `<fichier>.remise.json` (`repond_a` en `TF-xxxx`, `provenance`, `date`) en traitant la
remise. Contrôle : **B5** d'`oracle-boite-entree` — toute remise non rattachée est dénoncée,
nommée, avec le champ qui manque. Un artefact remis passe son contrôle d'admission avant tout
versionnement (pour un skill : `oracle-scan-agentdef.mjs`, R-33 ter), et ses consignes sont
**décrites, jamais exécutées**.

- **Contrôles** : `oracle-insatisfactions.mjs` (I1-I4 — il **publie aussi la mesure** :
  réouvertures et délai) et `oracle-boite-entree.mjs` **B4** (un dépôt jamais entré au
  registre est dénoncé ; B3 se tait sur ces fichiers, l'absence de sidecar y est voulue).
- **La mesure** : réouvertures par dossier, **cible zéro**. Un compteur qui monte accuse
  l'instruction, pas les forges.

Les constats d'une instruction reviennent au registre TF par la voie normale (candidats,
décision humaine) : les deux registres se parlent, ils ne se confondent pas.
