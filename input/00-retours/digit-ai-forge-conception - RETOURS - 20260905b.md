# Retours forges — digit-ai-forge-conception — 20260905b

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905b` (TF-0811), sur mandat humain du 05/09/2026. Le travail confié est fait, joué et prouvé dans les deux sens ; ce lot rend compte et remonte **deux** constats nouveaux, tous deux nés de l'instruction elle-même. Il fait suite au lot `20260905a` du matin, dont TF-0811 était précisément la candidature (RC-2).
- **Références ledger** : ce dépôt ne tient pas de `forge\ledger.jsonl` — la référence opposable est le **commit local `d6ab8ff`** de `digit-ai-forge-conception`, aucun `push`, et la sortie de `node oracles\self-test.mjs` (**12 entrées d'oracle, 49 règles, VERT**).
- **Sidecar** : une seule ligne, pour **RC-4**. RC-5 n'y figure pas — aucune classe de `todo\CLASSES.json` ne le couvre, et une classe ne se crée jamais dans un sidecar (voir la dernière section).
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `input\00-retours\` du pilot ; le lot de travaux reste chez la forge, sa ligne de statut passée à `traite le 2026-09-05` — seule édition faite. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-09-05

## Contrôle de complétude

Le lot confiait **un** travail, en quatre demandes. Les quatre sont instruites, chacune avec le
moyen de vérification que le lot énonçait comme critère de fin. Rien n'est resté en attente ; les
deux endroits où l'instruction **s'écarte** de la lettre du lot sont nommés plus bas, avec leur
motif — l'un est un renforcement, l'autre une attribution de verbe.

## Ce qui a été fait — TF-0811, l'écart explicite a un lieu où s'écrire

**Le défaut, tel qu'il se mesurait avant.** S4 (posée le matin même, TF-0804, commit `0830694`)
ne pouvait qu'avertir. La cause était unique et le lot la nommait : `EXIGENCES.json` n'offrait
**aucun champ** où porter l'écart explicite d'un candidat d'office. Un FAIL aurait accusé un
référentiel dont l'écart est légitime — les trois exclusions que P-2 déclare lui-même — et un
référentiel qui **oublie** le candidat n'était accusé par rien. L'oubli restait indiscernable de
la décision, ce que la loi transverse n° 3 interdit précisément.

**(1) Le champ.** `ecarts_surface_implicite`, à la racine du référentiel : une entrée par
candidat écarté, `{ element, motif, decide_par, date }`. Il se transcrit de la **section 3
« Écartés » de `SURFACE.md` et de nulle part ailleurs** — la prose reste le lieu où l'écart se
rédige, le champ n'en est que la forme lisible par un oracle. **Facultatif à la lecture** :
absent, il vaut « aucun écart déclaré », et un référentiel antérieur au champ n'est jugé que sur
la présence de ses candidats — aucune migration due, comme le lot l'excluait.

**(2) S4 devient jugeante**, quatre états, chacun **nommé** :

| État | Verdict rendu |
|---|---|
| Surface web + candidat présent à la surface énumérée | PASS |
| Surface web + candidat absent + écart déclaré qui tient | PASS, message préfixé « [ÉCARTÉ] » |
| Surface web + candidat absent + aucun écart, ou écart qui ne tient pas | **FAIL**, le candidat nommé |
| Aucun point d'entrée web énuméré | PASS motivé — le bloc n'est pas dû |

**(3) La mécanique vaut pour les onze candidats** de la liste close, pas seulement la 404 : aide,
onboarding, compte, favicon, états vides, erreurs visibles, mentions légales, responsive,
accessibilité RGAA, ses livrables légaux, 404 par langue. La table de la machine est la
transcription de celle de `typologie-surface.md`, clé par clé ; elle ne l'étend pas.

**(4) Fixtures double sens par état.** Deux fixtures **dédiées** neuves,
`oracles\fixtures\surface-implicite-verte` et `-rouge`. La rouge est le **même** référentiel que
la verte, privé de sa seule 404 et de son champ d'écarts — fixture **isolante**, même idiome que
`constitution-sans-promesse` : S1, S2 et S3 y restent verts, et le seul FAIL possible est celui
que S4 doit prouver. La verte porte sa vue dérivée `CADRAGE-DESIGN.md` **régénérée**, section
« Surface implicite écartée » comprise, scellée sur l'empreinte de sa source (T3 PASS).

### La preuve, dans l'ordre où le lot la demandait

Le lot écrivait lui-même son critère de fin, en cinq gestes. Chacun a été joué le 05/09/2026 sur
le dépôt de la forge ; le tableau met en regard ce qui était demandé et ce que la commande a
rendu, exit compris.

| Moyen de vérification écrit dans le lot | Résultat exécuté le 05/09/2026 |
|---|---|
| FAIL sur une fixture à surface web sans 404 ni écart | `oracle-surface` sur `surface-implicite-rouge` → **FAIL**, exit 1, **3 constats FAIL nommés** (`page-404`, `accessibilite-rgaa`, `livrables-accessibilite`) |
| PASS « [ÉCARTÉ] » sur la même fixture avec l'écart déclaré | même référentiel + les 3 écarts déclarés → **PASS**, exit 0, **3 constats PASS** dont le message ouvre par « [ÉCARTÉ] » |
| PASS sur la fixture avec la 404 | `oracle-surface` sur `surface-implicite-verte` → **PASS**, exit 0, 33 constats, 0 FAIL |
| `node oracles\self-test.mjs` compte les états | **SELF-TEST VERT** — branche TF-0811 : **7 cas comptés, 7 tenus, 0 en échec** |
| `derive-les-vues` porte le champ dans la vue du cadrage design | `CADRAGE-DESIGN.md` de la fixture verte porte la section « Surface implicite écartée » (4 colonnes) ; `oracle-tracabilite --vue` → **PASS**, T3 PASS |

### Le compte, avant → après

Ce que la règle savait dire hier, et ce qu'elle sait dire aujourd'hui. Le chiffre qui compte est
celui de la deuxième ligne : un candidat d'office jugé en avertissement contre onze jugés pour
de bon — c'est là que l'oubli cesse d'être indiscernable de la décision.

| Mesure | Avant (`0830694`) | Après (`d6ab8ff`) |
|---|---|---|
| Verdicts que S4 sait prononcer | 1 — `SANS_OBJET`, jamais bloquant | 3 — PASS, PASS « [ÉCARTÉ] », **FAIL** |
| Candidats d'office jugés | 1 (la 404), en avertissement | **11**, chacun nommé, un constat par candidat |
| Constats S4 sur un référentiel à surface web | 1 | **11** |
| Cas joués par la branche du self-test | 3 (TF-0804) | **7** (TF-0811 : 4 états + 3 témoins) |
| Entrées d'oracle × règles au self-test | 11 × 48, VERT | **12 × 49, VERT** |
| Fixtures dédiées à S4 | 0 | **2**, dont une avec sa vue scellée |
| `oracle-surface` | v1.1.0 | **v1.2.0** |

**Verdicts non nuls PRÉEXISTANTS, vérifiés identiques avant et après** : `oracle-ears` (exit 1)
et `oracle-retro-modele` (exit 1) sur la fixture verte **partagée** — les deux ont leurs propres
fixtures et ne jugent pas ce référentiel-là. Non corrigés, comme le mandat le demandait.

**Fichiers touchés** (12, commit `d6ab8ff`) : `oracles\oracle-surface.mjs`,
`oracles\self-test.mjs`, `oracles\registre-entrees.md`, `README.md`,
`skills\enumere-la-surface\SKILL.md` (1.3.0 → 1.4.0) et son
`references\typologie-surface.md`, `skills\redige-les-exigences\references\schema-referentiel.md`,
`skills\derive-les-vues\SKILL.md` (1.2.0 → 1.3.0) et son `references\vues.md`, plus les trois
fichiers des deux fixtures neuves. Le dossier `input\` reste non suivi.

## Ce qui n'a pas été fait, et les deux écarts à la lettre du lot

- **Aucune migration** des référentiels déjà scellés, aucun changement du sceau ni de la chaîne
  de dérivation au-delà du champ neuf, aucun oracle de la 404 **servie** : les trois exclusions
  du lot sont tenues à la lettre.
- **Écart 1 — un renforcement (R-43, « renforcer oui, assouplir jamais »).** Le lot posait le
  motif d'au moins vingt caractères comme seule condition pour qu'un écart tienne. La forge en
  exige **quatre**, cumulatives : `element` dans la liste close, `motif` ≥ 20 caractères,
  `decide_par` non vide, `date` au format `AAAA-MM-JJ`. Motif : les deux derniers champs
  figurent dans le schéma que le lot propose lui-même, et un écart n'est opposable que parce
  qu'il est écrit, **daté et signé** — un `{ element, motif }` seul redevient une prose que
  personne n'a décidée. Deux témoins du self-test le prouvent (motif trop court, clé hors liste).
- **Écart 2 — l'attribution du verbe.** Le lot demande un champ « dérivé de la section 3 de
  `SURFACE.md` **par `derive-les-vues`** ». Or `derive-les-vues` dérive les vues **depuis**
  `EXIGENCES.json` ; il n'écrit jamais dans le référentiel. Le verbe qui construit
  `EXIGENCES.json` à partir d'`ENTRANT.md` et de `SURFACE.md` est `redige-les-exigences`. La
  forge a donc réparti : `redige-les-exigences` **transcrit** la section 3 dans le champ, et
  `derive-les-vues` **porte** le champ dans la fiche de cadrage design — ce second point est
  exactement le moyen de vérification que le lot écrit, et il est tenu.

## digit-ai-forge-conception (`digit-ai-forge-conception`)

Instruire TF-0811 a fait apparaître deux trous du **même profil** que celui qu'il comble : une
règle qui existe, une décision qui doit s'écrire, et rien qui la lise.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RC-4 | majeur | générique | Les **trois exigences socle candidates** de `redige-les-exigences\references\schema-referentiel.md` (données de démonstration invisibles en production · données volatiles éditables, datées, sourcées · effet observable de tout élément interactif) portent **mot pour mot** la même règle que la surface implicite : « chaque candidate est retenue ou **écartée explicitement**, raison consignée en section 7 d'`EXIGENCES.md` ». Or la section 7 est de la **prose**, et **aucun oracle de la forge ne la lit** — c'est exactement l'état où S4 se trouvait avant TF-0811. Mesure : sur les onze oracles de la forge, zéro ne prend `EXIGENCES.md` en entrée ; les huit qui jugent `EXIGENCES.json` n'ont aucun champ à lire pour ces trois candidates. Trois lois transverses (n° 2, n° 4, n° 1) sont donc, à ce jour, non jugeables mécaniquement en conception. | Rejouer la mécanique de TF-0811 à l'identique : un champ racine `ecarts_exigences_socle: [{ element, motif, decide_par, date }]` sur une liste close de trois clés, une règle d'`oracle-exigences` qui juge présence ou écart, et les fixtures double sens. Le coût est connu — TF-0811 a tenu en une passe — et la moitié du travail (le format de l'écart, sa validation, son idiome de message) est déjà écrite et éprouvée. |
| RC-5 | majeur | générique | **Le sceau d'une vue prouve sa fraîcheur, jamais sa complétude.** `oracle-tracabilite` T3 compare l'empreinte SHA-256 que la vue **porte** à celle de sa source ; il ne regarde pas ce que la vue contient. Mesure faite le 05/09 sur la fixture verte de TF-0811 : la section « Surface implicite écartée » retirée de `CADRAGE-DESIGN.md` (**996 caractères sur 3 074, soit un tiers du document**, dont les deux écarts déclarés), l'en-tête laissé intact — T3 rend **PASS**, verdict global **PASS**, exit 0. Une vue peut donc perdre une section entière, et avec elle une décision opposable, sans qu'aucun oracle ne le voie. Le défaut grandit avec chaque champ neuf porté par une vue : TF-0811 en ajoute un. | Sceller ce que la vue **doit contenir**, pas seulement d'où elle vient : une liste close de sections attendues par type de vue (le contrat de `vues.md` la porte déjà en prose), vérifiée par T3 ou par une règle voisine. Variante moins coûteuse : faire porter à la vue l'empreinte de **son propre corps** en plus de celle de sa source — une amputation change alors l'empreinte, et le contrôle reste un contrôle de forme. |

**Portée** : les deux sont *génériques* — ils valent pour tout projet employant cette forge, et
RC-5 vaut pour toute vue scellée de l'écosystème, pas seulement celles de la Conception.

**Le sidecar ne porte qu'une ligne, RC-4.** RC-5 en est absent volontairement : aucune clé de
`todo\CLASSES.json` ne le couvre, et une ligne à classe inconnue ferait refuser le lot ENTIER à
l'ingestion. Le détail et la classe qui manque sont en dernière section — une classe ne se crée
jamais dans un sidecar.

## Remarques restées au produit

Trois constats sont restés ici, et chacun porte son verdict de généralisation. Deux ne sortent
pas de ce dépôt ; le troisième est généralisable mais n'a trouvé aucune classe où entrer, ce qui
est en soi l'information à remonter.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Six critères de la fixture verte neuve échouaient à E3 (prédicat hors liste fermée) et un à E4 (« complet ») | Réécrits avec des prédicats de la liste fermée (`retourne`, `est affichée`, `est absente`) ; la fixture passe désormais les quatre oracles applicables, pas seulement celui qu'elle sert | **non** | Rien de généralisable : c'est de l'hygiène de fixture, et le précédent existait déjà (`ears-verte` échoue aussi à `oracle-exigences`). Le rappel a été écrit dans le commit, pas remonté |
| Le lot attribue à `derive-les-vues` l'écriture d'un champ d'`EXIGENCES.json`, que ce verbe ne produit jamais (écart 2 ci-dessus) | Réparti entre `redige-les-exigences` (transcription) et `derive-les-vues` (portage dans la vue), les deux documentés | **oui**, mais non remonté au sidecar | Aucune clé de `todo\CLASSES.json` ne couvre « un lot de travaux qui nomme le mauvais module producteur » : la plus proche, `correction-symptome-sans-classe`, dit autre chose. Déclaré en dernière section pour que le pilot crée la classe s'il le décide — une classe ne se crée jamais dans un sidecar |
| Le gate d'écriture C7 n'a bloqué **aucune** édition de ce run | Rien à corriger | **non** | Le défaut TF-0806/TF-0812 est déjà au registre, remonté le matin même (RC-3 du lot `20260905a`). Le noter deux fois ne l'instruit pas mieux ; l'information utile est qu'il ne s'est **pas** reproduit ici |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le travail a porté sur
du code d'oracle, des fixtures et des références de skill. Le seul gabarit employé est celui-ci
(`gabarits\RETOURS-FORGES.md`), pour la remise même, et il n'a rien coûté à ajouter à la main.

## Confirmations positives

- **La mécanique de TF-0804 a tenu à la refonte.** Les trois états que sa branche prouvait
  (surface web + 404, surface web sans 404, sans surface web) se retrouvent tels quels dans la
  branche TF-0811 — le seul changement est le **verdict** du deuxième. Une règle posée en
  avertissement a donc pu devenir jugeante sans que sa détection soit rejouée : c'est ce que
  vaut le fait d'avoir séparé, dès TF-0804, la condition d'applicabilité du verdict.
- **La fixture isolante marche.** L'idiome hérité de `constitution-sans-promesse` (la rouge est
  la verte privée d'une seule chose) donne exactement **3 FAIL sur 31 constats**, tous S4 : la
  règle discrimine, et la preuve ne dépend pas d'une fixture qui échoue partout.
- **`AVANT` / `APRES` de TF-0799 se sont réemployées sans un mot de plus.** Les onze lexiques de
  la liste close sont construits avec les mêmes constantes partagées : « états vides », « mentions
  légales », « déclaration d'accessibilité » et « accessibilité » sont trouvés du premier coup,
  là où `\b` en aurait manqué quatre sur onze. Le correctif du matin a payé le même jour.
- **La normalisation `eol=lf` des fixtures a tenu.** La vue neuve, scellée sur une empreinte
  calculée en LF, passe T3 sur un poste dont le `core.autocrlf` réécrit tout le reste en CRLF
  (TF-0114). Aucun ajustement n'a été nécessaire.

## Ordre recommandé

1. **RC-4 d'abord** — meilleur rapport gain/effort du lot : la mécanique est écrite, éprouvée et
   documentée ; il ne reste qu'à l'appliquer à une liste close de trois clés. Il ferme trois lois
   transverses (n° 1, n° 2 et n° 4) qui ne sont aujourd'hui jugeables par rien en conception,
   pour un coût comparable à celui de TF-0811 — une passe.
2. **RC-5 ensuite** — plus large et plus structurant (il touche toute vue scellée de
   l'écosystème, pas seulement celles de cette forge), donc à trancher au niveau du contrat
   d'interface plutôt qu'ici. Il ne bloque rien tant que les vues sont régénérées par un verbe et
   non retouchées ; il devient coûteux le jour où quelqu'un en édite une à la main, et ce jour-là
   la perte est silencieuse.

## La règle qui aurait évité le retour

Aucun des deux retours de ce lot ne suit un **retour humain** : les deux ont été trouvés par
l'instruction elle-même, en câblant TF-0811. La règle est donc nommée pour ce qu'elle vaut :

- **RC-4** — la règle existe et elle est la **loi transverse n° 3** (« l'oubli n'existe pas »),
  écrite dans `CLAUDE.md` et déclinée dans `schema-referentiel.md`. Ce qui manque n'est pas la
  règle, c'est son **oracle** : c'est exactement la règle § 4 de `quality-oracles` (domaine sans
  oracle → en définir un). Classe retenue : `surface-implicite-non-livree`, la même que RC-2 du
  lot du matin — **récidive assumée du même profil sur un autre bloc de candidats**, et c'est
  précisément l'information utile.
- **RC-5 — aucune clé ne le couvre, et il n'est donc PAS au sidecar.** La règle existe pourtant :
  *« une vue est régénérable, jamais éditée »*, et T3 la juge. Elle est **incomplète**, pas
  absente : elle juge la provenance et non le contenu. La famille qui conviendrait est
  `regle-morte` — « un contrôle qui rend PASS sur ce qu'il existe pour refuser » décrit exactement
  la mesure — mais `regle-morte` est une **famille**, pas une classe, et ses deux classes
  (`recette-verdict-non-prononcable`, `garde-lexicale-frontiere-ascii`) disent autre chose. Une
  classe ne se crée jamais dans un sidecar : le retour est donc porté ici, en toutes lettres, et
  le pilot décide s'il en crée une — quelque chose comme « un sceau qui prouve la provenance et
  pas le contenu ». RC-5 entrerait alors au registre par cette classe.
- **Sans classe également** : « un lot de travaux qui nomme le mauvais module producteur »
  (écart 2). Le coût mesuré est faible ici — une décision d'attribution, prise et documentée —
  mais il croît avec la taille du lot, et il se paie en interprétation silencieuse. Aucune clé de
  `todo\CLASSES.json` ne le couvre ; le pilot décide s'il en crée une.
