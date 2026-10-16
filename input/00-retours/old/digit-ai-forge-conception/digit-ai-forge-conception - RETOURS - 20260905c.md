# Retours forges — digit-ai-forge-conception — 20260905c

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905d` (TF-0814), sur mandat humain du 05/09/2026 (« A-36 à A-40 », action A-37). Le travail confié est fait, joué et prouvé dans les deux sens, **commité et poussé**. Il fait suite au lot `20260905b` de l'après-midi, dont TF-0814 était précisément la candidature (RC-4).
- **Références ledger** : ce dépôt ne tient pas de `forge\ledger.jsonl` — la référence opposable est le **commit `be41b25`** de `digit-ai-forge-conception`, **poussé** sur `origin/main` (`d6ab8ff..be41b25`), et la sortie de `node oracles\self-test.mjs` (**13 entrées d'oracle, 50 règles, VERT**).
- **Sidecar** : **aucune ligne**. Les deux constats nouveaux de ce run sont réels et mesurés, mais **aucune clé de `todo\CLASSES.json` ne les couvre** — leur famille (`regle-morte`, `skill-ou-oracle-non-invoque`) est la bonne, aucune de leurs classes ne dit ce qu'ils disent. Une classe ne se crée jamais dans un sidecar : les deux sont donc portés en prose, en toutes lettres, comme l'a été RC-5 la veille — mécanisme qui a fonctionné, le pilot ayant créé `sceau-de-vue-provenance-sans-contenu` le jour même.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `input\00-retours\` du pilot ; le lot de travaux reste chez la forge, sa ligne de statut passée à `traite le 2026-09-05` — seule édition faite. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-09-05

## Contrôle de complétude

Le lot confiait **un** travail, en quatre demandes. Les quatre sont instruites, chacune avec le
moyen de vérification que le lot énonçait comme critère de fin. Rien n'est resté en attente ; le
seul endroit où l'instruction **dépasse** la lettre du lot est nommé plus bas, avec son motif —
c'est un renforcement, et il touche un fichier que le lot ne nommait pas.

## Ce qui a été fait — TF-0814, l'écart d'une exigence socle a un lieu où s'écrire

**Le défaut, tel qu'il se mesurait avant.** `skills\redige-les-exigences\references\schema-referentiel.md`
propose d'office trois exigences socle candidates — données de démonstration invisibles en
production · données volatiles éditables, datées, sourcées · effet observable de tout élément
interactif — avec mot pour mot la règle de la surface implicite : « chaque candidate est retenue
ou écartée explicitement, raison consignée en section 7 d'`EXIGENCES.md` ». Or la section 7 est
de la prose, et aucun oracle ne la lit. **Mesure faite avant tout correctif** : un référentiel
privé des trois candidates et sans aucun écart déclaré passait les **cinq** oracles applicables
— `oracle-exigences`, `oracle-tracabilite`, `oracle-surface`, `oracle-claims`, `oracle-ears` —
tous en **exit 0**. L'oubli était indiscernable de la décision, ce que la loi transverse n° 3
interdit précisément.

**(1) Le champ.** `ecarts_exigences_socle`, à la racine du référentiel : une entrée par candidate
écartée, `{ element, motif, decide_par, date }`, sur une liste close de **trois** clés
(`donnees-demonstration`, `donnees-volatiles`, `effet-observable`). Il se transcrit de la
**section 7 d'`EXIGENCES.md` et de nulle part ailleurs** — la prose reste le lieu où l'écart se
rédige, le champ n'en est que la forme lisible par un oracle. **Facultatif à la lecture** :
absent, il vaut « aucun écart déclaré », et un référentiel antérieur au champ n'est jugé que sur
la présence de ses candidates — aucune migration due, comme le lot l'excluait.

**(2) E10, dans `oracle-exigences` (v1.1.0 → v1.2.0)**, trois états, chacun **nommé** :

| État | Verdict rendu |
|---|---|
| Candidate portée par au moins une exigence | PASS |
| Candidate absente + écart déclaré qui tient | PASS, message préfixé « [ÉCARTÉ] » |
| Candidate absente + aucun écart, ou écart qui ne tient pas | **FAIL**, la candidate nommée |

Il n'y a **pas de quatrième état**, et c'est une décision, pas un oubli : contrairement à S4, qui
n'exige la surface implicite que si le produit a une surface web, E10 **n'infère aucune condition
d'applicabilité**. Le « hors périmètre déclaré d'un coup » que la doctrine prévoit — produit sans
donnée de production, sans référentiel périssable, sans élément interactif — **s'écrit**, il ne
se devine pas. Trois lignes d'écart sont le prix de l'opposabilité, délibérément moins cher que
de rendre l'omission indiscernable.

**(3) Un seul format d'écart, un seul validateur.** `defautDEcart(entree, cles)` et `lexique()`
remontent au contrat commun `oracles\_contrat.mjs`, où `oracle-surface` S4 les prend désormais
aussi. Deux définitions de « ce qui fait qu'un écart tient » divergeraient au premier correctif,
et « écarté explicitement » cesserait de vouloir dire la même chose selon la règle qui lit — le
lot demandait « même mécanique et même critère d'écart valide », c'est la façon la plus littérale
de le tenir. Les messages de S4 sont inchangés au caractère près, et ses sept cas restent verts.

**(4) Fixtures double sens par état.** Deux fixtures **dédiées** neuves,
`oracles\fixtures\exigences-socle-verte` et `-rouge`. La rouge est le **même** référentiel que la
verte, privé de son **seul** champ `ecarts_exigences_socle` — fixture **isolante**, même idiome
que `surface-implicite-rouge` : E1 à E9 y restent verts, et le seul FAIL possible est celui que
E10 doit prouver. La verte porte sa vue dérivée `CADRAGE-DESIGN.md`, section « Exigences socle
écartées » comprise, scellée sur l'empreinte de sa source (T3 PASS).

### La preuve, dans l'ordre où le lot la demandait

Le lot écrivait lui-même son critère de fin. Chaque geste a été joué le 05/09/2026 sur le dépôt
de la forge ; le tableau met en regard ce qui était demandé et ce que la commande a rendu, exit
compris.

| Moyen de vérification écrit dans le lot | Résultat exécuté le 05/09/2026 |
|---|---|
| **Rouge d'abord** : la fixture sans les trois candidates ni écart, jugée **avant** la règle | les 5 oracles applicables → **exit 0** partout. Le défaut est reproduit : rien ne le voyait |
| FAIL sur une fixture sans les trois candidates ni écart | `oracle-exigences` sur `exigences-socle-rouge` → **FAIL**, exit 1, **37 constats, 1 seul FAIL**, E10, la candidate `donnees-demonstration` nommée en clair |
| PASS « [ÉCARTÉ] » sur la même fixture avec l'écart déclaré | `exigences-socle-verte` (même référentiel + le champ) → **PASS**, exit 0, **37 constats, 0 FAIL** ; le constat E10 de la candidate écartée ouvre par « [ÉCARTÉ] » |
| PASS sur une fixture qui porte les candidates en exigences | branche du self-test, état 1 : trois candidates portées, **aucun** champ d'écart → **PASS**, 3 constats E10, 0 FAIL |
| `node oracles\self-test.mjs` compte les états (12 × 49 → plus) | **SELF-TEST VERT** — **13 entrées d'oracle, 50 règles** ; branche TF-0814 : **7 cas comptés, 7 tenus, 0 en échec** |
| La vue de cadrage régénérée porte les écarts | `CADRAGE-DESIGN.md` de la fixture verte porte la section « Exigences socle écartées » (4 colonnes) ; `oracle-tracabilite --vue` → **PASS**, T3 PASS |
| Porte de publication avant tout `push` | `oracle-nom-client-publie` sur le dépôt, référentiel `_noms-interdits.json` (5 termes) → **PASS** : aucun terme dans les contenus, les noms de fichiers ni les messages de commit |

### Le compte, avant → après

Ce que la forge savait dire hier des trois candidates socle, et ce qu'elle sait dire
aujourd'hui. Le chiffre qui compte est celui de la première ligne : aucun oracle ne les jugeait,
un les juge — c'est là que l'oubli cesse d'être indiscernable de la décision.

| Mesure | Avant (`d6ab8ff`) | Après (`be41b25`) |
|---|---|---|
| Oracles qui jugent les trois candidates socle | **0** sur 11 | **1** — `oracle-exigences` E10 |
| Verdicts prononçables sur une candidate socle | 0 | **3** — PASS, PASS « [ÉCARTÉ] », **FAIL** |
| Constats sur un référentiel quelconque | 0 | **3**, un par candidate, chacune nommée |
| Cas joués par la branche du self-test | 0 | **7** (3 états + 3 témoins + le sceau de la vue) |
| Entrées d'oracle × règles au self-test | 12 × 49, VERT | **13 × 50, VERT** |
| Fixtures dédiées à E10 | 0 | **2**, dont une avec sa vue scellée |
| Définitions de « un écart qui tient » dans le dépôt | 1, locale à `oracle-surface` | **1, partagée** au contrat commun, lue par S4 **et** E10 |
| `oracle-exigences` | v1.1.0 | **v1.2.0** |

**Un verdict change hors périmètre, déclaré plutôt que masqué** :
`oracles\fixtures\delta-rouge\EXIGENCES.json` — référentiel **cible** d'un delta, jugé par
`oracle-delta` et jamais par `oracle-exigences` dans le self-test — passe de exit 0 à exit 1 sur
`oracle-exigences`. Il n'est **pas** migré : c'est exactement le cas « référentiel antérieur au
champ » que E10 doit accuser. Les autres fixtures dont le verdict `oracle-exigences` était nul
(`verte`, `surface-implicite-verte`, `surface-implicite-rouge`) déclarent leurs trois écarts et
restent vertes : une fixture verte qui deviendrait rouge sur un oracle qu'elle passait serait une
régression, pas une preuve.

**Fichiers touchés** (19, commit `be41b25`, +893 / −51) : `oracles\_contrat.mjs`,
`oracles\oracle-exigences.mjs`, `oracles\oracle-surface.mjs`, `oracles\self-test.mjs`,
`oracles\registre-entrees.md`, `README.md`,
`skills\redige-les-exigences\SKILL.md` (1.2.0 → 1.3.0) et son
`references\schema-referentiel.md`, `skills\derive-les-vues\SKILL.md` (1.3.0 → 1.4.0) et son
`references\vues.md`, les trois fichiers des deux fixtures neuves, et les six fichiers des
fixtures existantes qui déclarent leurs écarts ou reçoivent leur vue régénérée. Le dossier
`input\` reste non suivi, comme pour les lots précédents.

## Ce qui n'a pas été fait, et l'écart à la lettre du lot

- **Aucune migration** des référentiels déjà scellés, **aucun changement du sceau** ni de la
  chaîne de dérivation (TF-0818, non décidé : le lot l'excluait, il n'est pas touché), **aucune
  règle pour d'autres candidates** que les trois du schéma, **aucune classe créée dans un
  sidecar**, **aucun `git pull`** ni merge — `main` en avance rapide. Les cinq exclusions du
  mandat sont tenues à la lettre.
- **Écart 1 — un renforcement, et il touche un fichier que le lot ne nommait pas (R-43,
  « renforcer oui, assouplir jamais »).** Le lot demandait « même mécanique et même critère
  d'écart valide que `ecarts_surface_implicite` ». La forge a lu cela comme une exigence de
  **fond**, pas de copie : plutôt que de dupliquer les quatre conditions dans `oracle-exigences`,
  elle a remonté le validateur et la garde lexicale au contrat commun `oracles\_contrat.mjs`, et
  y a rebranché `oracle-surface`. Motif : deux copies du même critère divergent au premier
  correctif — c'est le défaut que TF-0474 a nommé ailleurs, où cinq mécanismes de scellement
  coexistaient sans format commun. Coût du renforcement : `oracle-surface` est modifié alors que
  le lot ne le demandait pas ; garantie apportée : ses **sept** cas de la branche TF-0811 sont
  rejoués verts, messages inchangés, et le self-test entier reste vert.
- **Le lot 20260905e** est **vu, non traité** : il n'est pas confié à ce run.

## digit-ai-forge-conception (`digit-ai-forge-conception`)

Instruire TF-0814 laisse un résidu que le lot n'excluait pas et que le correctif ne couvre pas :
la moitié **prose** de la règle. Les deux constats ci-dessous en découlent, et aucun n'a de
classe.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RC-6 | majeur | générique | **La transcription depuis la prose n'est vérifiée par rien, et `EXIGENCES.md` n'est l'entrée d'aucun oracle.** Depuis TF-0811 et TF-0814, **deux** champs racine sont déclarés « transcrits de la prose et de nulle part ailleurs » (`ecarts_surface_implicite` ← section 3 de `SURFACE.md` ; `ecarts_exigences_socle` ← section 7 d'`EXIGENCES.md`). Aucun oracle ne prend ces deux fichiers en entrée : mesure du 05/09, sur les onze oracles de la forge, zéro lit `EXIGENCES.md` ou `SURFACE.md` — alors que la forge sait juger du Markdown (`oracle-constitution` lit `CONSTITUTION.md`, `oracle-retro-modele` lit `RETRO-MODELE.md`, `oracle-vues-profil` lit `VUE-PO.md`). Conséquence exacte, écrite noir sur blanc dans la documentation de la forge elle-même : « écrire un écart directement dans le JSON, sans qu'il existe dans `SURFACE.md`, produit un référentiel qui passe l'oracle et une décision que personne n'a prise ». S4 et E10 prouvent donc que l'écart **est écrit**, jamais qu'il a été **décidé**. Le gabarit d'`EXIGENCES.md` (sept sections, dont deux déclarées obligatoires) n'est lui non plus jugé par personne. | Faire de `EXIGENCES.md` un artefact **jugé**, comme `CONSTITUTION.md` l'est déjà : un oracle d'existence et de forme (les sept sections, la 4 et la 7 non vides), puis une règle de **correspondance** — chaque entrée de `ecarts_surface_implicite` et de `ecarts_exigences_socle` a une trace dans la section prose correspondante, et réciproquement. Variante moins coûteuse : le verbe qui transcrit dépose l'empreinte de la section source à côté de l'écart, et l'oracle vérifie qu'elle correspond — même idiome que le sceau des vues, appliqué à l'envers. |
| RC-7 | mineur | générique | **Une fixture est déclarée verte pour l'oracle qu'elle sert, jamais pour les autres — une règle neuve sur un oracle partagé fait basculer les autres en silence.** Mesure du 05/09 : l'entrée d'E10 dans `oracle-exigences` fait passer `oracles\fixtures\delta-rouge\EXIGENCES.json` de exit 0 à exit 1 sur cet oracle. Le self-test ne branche jamais `oracle-exigences` sur cette fixture, donc **aucun contrôle ne le dit** ; il a fallu un balayage manuel des douze fixtures pour le voir, et rien n'obligeait à le faire. Le défaut est structurel, pas accidentel : le self-test associe un couple (fixture verte, fixture rouge) à un oracle, et ne dit rien des autres verdicts qu'une fixture rend. | Publier, au self-test, la **matrice** des verdicts fixture × oracle et la comparer à une matrice attendue versionnée : un verdict qui change sans que la matrice ait été mise à jour devient un échec de recette, et le changement redevient une décision. Le coût est faible — les douze fixtures et les onze oracles sont déjà énumérés dans le fichier. |

**Portée** : les deux sont *génériques*. RC-6 vaut pour toute forge où une décision se rédige en
prose et se transcrit dans un artefact machine — c'est-à-dire toutes ; RC-7 vaut pour toute
recette qui associe des fixtures à des oracles nommés, ce qui est l'idiome de l'écosystème.

**Le sidecar ne porte aucune ligne.** Ni RC-6 ni RC-7 ne trouve de classe dans
`todo\CLASSES.json` — le détail est en dernière section. Une ligne à classe inconnue ferait
refuser le lot ENTIER à l'ingestion, et une classe ne se crée jamais dans un sidecar.

## Remarques restées au produit

Quatre constats sont restés ici, et chacun porte son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Un critère de la fixture verte neuve échouait à E3 (« porte une date de mise à jour et une source » : aucun prédicat de la liste fermée) | Réécrit avec un prédicat de la liste fermée (« sont présentes »), les deux fixtures corrigées ensemble | **non** | Hygiène de fixture, déjà observée sur le lot de la veille. Le rappel est dans le commit, pas remonté |
| La cellule `oracle-exigences` du README portait « `` est ASCII » — la séquence d'échappement avait disparu à une réécriture antérieure, la phrase ne voulait plus rien dire | Restaurée dans la même cellule, éditée de toute façon pour E10 | **non** | Coquille locale d'une seule cellule. Aucune règle générale à en tirer ; la corriger en passant coûtait moins que de la laisser |
| Les fixtures `verte`, `surface-implicite-verte` et `-rouge` ne portaient aucune des trois candidates : E10 les aurait fait basculer au rouge | Les trois déclarent leurs trois écarts, motifs écrits pour ce que chaque produit fictif est ; les vues scellées (`CADRAGE-DESIGN.md`, `MISSION.md`) régénérées sur la nouvelle empreinte | **oui**, et remonté : c'est RC-7 | Le geste était juste ; ce qui manque est le contrôle qui aurait **dit** lesquelles basculaient |
| Le gate d'écriture C7 n'a bloqué **aucune** édition de ce run | Rien à corriger | **non** | Le défaut TF-0806/TF-0812 est déjà au registre. L'information utile est qu'il ne s'est **pas** reproduit ici, pour le second run consécutif |

## Retours sur les documents produits

Aucun document produit depuis un gabarit. Le travail a porté sur du code d'oracle, des fixtures
et des références de skill. Le seul gabarit employé est celui de la remise elle-même
(`gabarits\RETOURS-FORGES.md`), et il n'a rien coûté à ajouter à la main.

## Confirmations positives

- **La mécanique de TF-0811 s'est rejouée en une passe, comme le lot le pariait.** Le format de
  l'écart, sa validation, son idiome de message et la forme de la branche de self-test n'ont pas
  été réinventés : ils ont été **partagés**. Le coût réel a été celui des fixtures, pas celui de
  la règle.
- **La fixture isolante marche une seconde fois.** `exigences-socle-rouge` rend exactement
  **1 FAIL sur 37 constats**, et la verte 0 sur 37 : la règle discrimine, et la preuve ne dépend
  pas d'une fixture qui échoue partout.
- **Le renforcement n'a rien cassé.** `oracle-surface` rebranché sur le validateur commun rejoue
  ses sept cas verts, messages inchangés — la preuve que « même critère d'écart » pouvait devenir
  littéral sans coût.
- **La normalisation `eol=lf` des fixtures a tenu**, une fois de plus (TF-0114) : trois vues
  rescellées sur des empreintes calculées en LF passent T3 sur un poste dont le `core.autocrlf`
  réécrit le reste en CRLF.
- **La porte de publication a été jouée avant le `push`, pas après** : PASS sur les contenus, les
  noms de fichiers **et** les messages de commit, référentiel de 5 termes.

## Ordre recommandé

1. **RC-6 d'abord** — c'est le résidu direct de TF-0811 et TF-0814, et il grandit à chaque champ
   d'écart ajouté : deux aujourd'hui, un troisième le jour où un bloc de candidates supplémentaire
   sera câblé. Tant qu'il tient, les deux règles neuves prouvent une **forme** et jamais une
   **décision**, ce qui est précisément la moitié du problème qu'elles étaient censées fermer.
2. **RC-7 ensuite** — mineur et peu coûteux, mais c'est lui qui aurait rendu visible, sans
   balayage manuel, le seul effet de bord de ce run. Il se paie une fois et sert à chaque règle
   neuve.

## La règle qui aurait évité le retour

Aucun des deux retours ne suit un **retour humain** : les deux ont été trouvés par l'instruction
elle-même, en câblant TF-0814. La règle est donc nommée pour ce qu'elle vaut.

- **RC-6 — aucune clé ne le couvre, et il n'est donc PAS au sidecar.** La règle existe : c'est la
  loi transverse n° 1, *« toute affordance est câblée ou n'existe pas »*, doublée de la règle § 4
  de `quality-oracles` (domaine sans oracle → en définir un). Ce qui manque n'est pas la règle,
  c'est son contrôle. La famille qui conviendrait est `regle-morte` — « un contrôle qui rend PASS
  sur ce qu'il existe pour refuser » décrit exactement la mesure — mais ses trois classes disent
  autre chose : `recette-verdict-non-prononcable` parle d'outils non épinglés,
  `garde-lexicale-frontiere-ascii` de frontières de mot, et `sceau-de-vue-provenance-sans-contenu`
  d'une **vue dérivée**, pas d'un champ transcrit d'une prose. Cette dernière est la **voisine**
  la plus proche, et la classe qui manque en est le pendant : « un champ machine transcrit d'une
  décision écrite en prose, dont aucun contrôle ne vérifie qu'il en vient ». Le pilot décide s'il
  la crée ; RC-6 entrerait alors au registre par elle.
- **RC-7 — aucune clé ne le couvre non plus.** La famille est `skill-ou-oracle-non-invoque` — « un
  oracle ou un contrôle existant non joué » : ici l'oracle existe, la fixture existe, et personne
  ne les met en présence. Aucune de ses six classes ne dit cela : elles parlent de briefs, de
  lexique d'invocation, de contrôles maison. La classe qui manque serait quelque chose comme
  « une fixture de recette dont le verdict n'est jugé que par l'oracle qu'elle sert ». Le coût
  mesuré est faible aujourd'hui (un verdict, trouvé à la main) ; il croît avec le nombre de
  fixtures partagées, et il se paie en régression silencieuse.
- **Aucun défaut de lot à signaler.** Le lot `20260905d` nomme le bon module producteur pour
  chacune des quatre demandes — `redige-les-exigences` transcrit, `derive-les-vues` porte —, ce
  qui est exactement la correction que RC-4 et l'écart 2 du lot de la veille appelaient. La classe
  `lot-de-travaux-mauvais-module-producteur`, créée depuis, ne trouve pas à s'appliquer ici : le
  retour de la veille a été tenu.
