# Retours forges — digit-ai-forge-design — 20260912a

- **Contexte** : traitement du lot de travaux `pilot - TRAVAUX - 20260912b` (**TF-1066**,
  **TF-1064**), reçu dans `input\00-travaux\` de la forge et joué sur mandat humain du
  12/09/2026 — décision **D-1 (b)** de la synthèse `20260912a` du pilot.
- **Références ledger** : sans objet — cette forge n'ouvre pas de run produit et n'a pas de
  `forge\ledger.jsonl`. La preuve tient au **commit local `89bcc33`** (aucun push) et aux
  recettes rejouées après lui, citées ligne à ligne ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans
  `c:\dev\digit-ai-factory\input\00-retours\`. Aucun autre fichier n'a été écrit hors du dépôt
  de la forge ; ni `~\.claude\skills\` ni aucun dépôt frère n'ont été touchés.
- **Statut** : remis le 2026-09-12

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node c:\dev\digit-ai-factory\gabarits\oracle-lot-retours.mjs "<ce fichier>.md"
> ```
>
> Joué : **PASS** (R-45 PASS, R-46 PASS, R-49 PASS). Comme le 05/09, cette forge n'a pas de
> copie `forge\retours\oracle-lot.mjs` — elle n'est pas un produit instancié — et le module du
> pilot a donc été appelé **à sa source**, qui est le même code que celui de la porte
> d'ingestion.

Le lot confié a lui aussi été vérifié avant traitement, comme il le prescrit — mais **pas par
la commande qu'il prescrit**, qui n'existe pas dans ce dépôt (c'est le retour **RD-18**) :

```
node forge\travaux\oracle-travaux.mjs "…"         → Error: Cannot find module (MODULE_NOT_FOUND)
node gabarits\oracle-travaux-pilot.mjs "…"        → PASS, T1 à T8 verts (oracle-travaux-pilot 1.2.0)
```

---

## Ce qui a été fait sur les deux travaux confiés

Les deux travaux sont **faits**, chacun avec le moyen de vérification que le lot avait lui-même
posé comme critère de fin. Ce chapitre se lit travail par travail : ce qui a changé, la preuve
exécutée, puis ce qui n'a pas été fait et pourquoi. Un seul commit local porte l'ensemble —
`89bcc33`, 15 fichiers, 906 insertions, 12 suppressions — parce que les deux travaux partagent
les mêmes fichiers de contrat et qu'un découpage aurait laissé le dépôt dans un état
intermédiaire où `criteres-sortie.md` cite un oracle qui n'existe pas encore.

| Travail | Verdict | Preuve exécutée |
|---|---|---|
| **TF-1066** — largeur de conception 1920 px, grille jusqu'au 4K | **fait**, les six points (1)-(6) | `run-oracles-design.mjs` liste **sept** largeurs ; `self-test.mjs` **exit 0** ; `self-test-baseline.mjs` **exit 0** sur mesures réelles (Playwright présent) |
| **TF-1064** — renvois E-12 et juge des textes d'application | **fait**, les quatre points (1)-(4) | `oracle-textes-application --self-test` **24 PASS / 0 FAIL** ; fixture rouge **exit 1 / FAIL**, verte **exit 0 / PASS** ; banc `self-test.mjs` **39 → 40 oracles, 120 → 124 règles**, tout vert |

### TF-1066 — la largeur de conception est 1920 px, et la grille monte au 4K

Les six points du lot, dans son ordre :

1. **`skills\ameliore-le-design\references\contrat-technique.md`** — la ligne *Breakpoints*
   sépare désormais deux notions que le texte confondait : « **1920 px = largeur de conception
   par défaut (Full HD)** ; grille de vérification 3840 / 2560 / 1920 / 1440 / 1024 / 768 / 390,
   portrait et paysage », avec citation de **E5** de `references\BEST-PRACTICES-HTML.md`. Un
   chapitre neuf dit ce que le 4K change et qui ne se devine pas depuis les nombres : la mesure
   de lecture reste portée par le conteneur (E4) — la prose ne s'étire pas sur le plancher
   `75vw` de 2 880 px —, une page de données prend toute la largeur, une grille fluide gagne des
   colonnes plutôt que des marges, aucune hauteur fixe.
2. **`criteres-sortie.md` (C1) et `critique-le-design\references\grille.md`** —
   `--widths 3840,2560,1920,1440,1024,768,390`, et « 5 breakpoints × 2 thèmes » devient
   « **7 breakpoints (3840 → 390) × 2 thèmes** ».
3. **`oracles\run-oracles-design.mjs`** — `LARGEURS_RENDU` étendu aux sept largeurs. La grille
   est en outre **dite** et non plus seulement passée à `render_page.py` : une ligne en tête de
   sortie, et un champ `grille_rendu` au JSON. Sortie mesurée, sur n'importe quelle cible :
   `grille de rendu (7 largeurs) : 3840 / 2560 / 1920* / 1440 / 1024 / 768 / 390 px — * = largeur de conception (Full HD, E5)`.
   Motif : un verdict de rendu qui ne dit pas à quelles largeurs il a été rendu ne se relit pas.
4. **`oracles\oracle-baseline.mjs`** — grille par défaut `3840,2560,1920,1024,390`. Le
   `non_juge` « grille réduite v0 (3 largeurs) — étendre à la grille complète est un reste »
   **se clôt** et cède la place à la seule dissymétrie qui subsiste, déclarée : 1440 et 768 sont
   hors de la grille de *baseline* pour borner le nombre de PNG approuvés, et restent jugés par
   `render_page.py`. `self-test-baseline.mjs` épingle `--widths 600` sur sa racine jetable : le
   banc est indépendant de cette valeur par défaut, et il le reste.
5. **Skill `ameliore-le-design`** — règle dure ajoutée : toute maquette de bureau se conçoit à
   **1920 px** (viewport du rendu de travail, captures, cotes annoncées), jamais à 1280 ni 1440.
6. **Skill `critique-le-design`, dimension D5 Adaptation** — « un écran dont le rendu n'a pas
   été mesuré à **2560 et 3840** n'est pas jugé adapté », dans le `SKILL.md` et dans `grille.md`.

**1440 et 1024 n'ont pas été retirés** de la grille, comme le lot le demandait : ce sont des
largeurs de vérification, elles y restent.

**Recettes, sorties telles quelles.**

```
node oracles\self-test.mjs            → exit 0 · « Tout vert — 40 oracles, 124 règles verrouillées. »
node oracles\self-test-baseline.mjs   → exit 0 · « Tout vert — approbation, rejugement conforme
                                        et gouvernance B1-B3 vérifiés sur mesures réelles. »
```

`self-test-baseline.mjs` a bien **tourné** et non sauté : l'outillage de rendu (Python +
Playwright + `render_page.py` au chemin canonique) est présent sur ce poste, et les sept
vérifications du banc portent sur des captures réelles, pas sur un `SKIP` motivé.

### TF-1064 — les textes d'application ont leur plancher et leur juge

1. **`skills\systeme-de-marque\references\voix.md`** — une ligne de renvoi par section
   (*Actions*, *Erreurs*, *États vides*) citant **E-12** de `references\ECRITURE.md` comme
   plancher. La voix reste la nôtre et se déploie au-dessus ; aucune autre ligne du contrat n'a
   été réécrite. Le chapitre « Ce que l'oracle ne juge pas » gagne un paragraphe, parce qu'il
   disait en toutes lettres qu'aucun script ne juge ces textes et que ce n'est plus tout à fait
   vrai : la **présence** l'est désormais, la **justesse** ne l'est toujours pas.
2. **`oracles\oracle-textes-application.mjs`** — oracle neuf, au standard §3 de
   `quality-oracles` : contrat JSON `{oracle, domaine, artefact, verdict, findings[], non_juge[]}`,
   findings localisants (`fichier:ligne · clé`), `non_juge` obligatoire et non vide, **exit
   0/1/2**, garde d'entrée pour rester importable comme module. Il lit un fichier de chaînes
   extraites — `.json` **plat ou imbriqué** (clés aplaties en `a.b.c`), `.arb` (`@@…` ignorés,
   `@clé.description` servant de contexte), `.po` (`msgctxt`/`msgid`/`msgstr`, `msgstr` primant
   sauf s'il est vide), `.properties` (continuations `\`, échappements `\uXXXX`) — ou les
   littéraux d'un `.html` (`placeholder`, `title`, `aria-label`, `alt` ; texte des `<button>`,
   `<label>`, `<option>` ; texte des éléments `role="alert"`, `.error`, `.empty`,
   `[data-etat="vide"]`).
   Quatre règles : **T4-1** erreur sans indication de cause **ni** verbe de réparation
   (bloquant ; une seule des deux moitiés = avertissement, parce que E-12 demande les deux),
   **T4-2** état vide sans verbe d'action (bloquant), **T4-3** libellé d'action générique
   (avertissement), **T4-4** erreur qui s'excuse (avertissement). Les listes de verbes, d'indices
   de cause et de libellés génériques sont des **constantes exportées et extensibles** — une
   donnée de langue est une donnée, pas de la mécanique.
3. **`skills\critique-le-design`** — D7 Contenu cite l'oracle dans le `SKILL.md`, dans
   l'enchaînement d'oracles de `grille.md` et dans sa table de pondération. Un paragraphe dit ce
   qui change : D7 n'est plus une dimension de pure lecture, une note s'y cite comme ailleurs,
   et ce que l'oracle ne tranche pas (justesse du ton, fidélité à la voix, constance d'un écran
   à l'autre) reste explicitement à la lecture.
4. **`skills\ameliore-le-design\references\criteres-sortie.md`** — l'oracle est joué **avant
   C15**, et il l'est sous un numéro : le critère **C14**, qui n'existait pas (la liste sautait
   de C13 à C15). La justification est dans le fichier et elle est vérifiable : *un « Valider »
   parfaitement câblé passe C15 et rate C14* — C15 juge la cible d'un CTA, C14 juge son libellé.
   La commande est ajoutée à l'enchaînement de contrôle.
5. **Registre local** — `oracles\registre-entrees.md` reçoit un chapitre daté du 12/09/2026 :
   ligne de tableau, entrée JSON, et chapitre « Ce que cet oracle ne juge PAS ». Le statut est
   **`candidat`**, et la mention « **remontée §4 à forge-agents à faire** » ouvre le chapitre :
   l'entrée n'est **pas** injectée dans
   `~\.claude\skills\quality-oracles\references\registre-oracles.md` — aucune écriture hors de
   ce dépôt n'a eu lieu pendant ce run. **C'est un geste qui reste dû, et il appartient au
   pilot** (voir « Ordre recommandé »).

**Fixtures et bancs.** Deux fixtures dans `oracles\fixtures\` — `textes-application-rouge.json`
et `textes-application-verte.json` — portant exactement les chaînes que le lot nomme. Elles sont
enrôlées au banc de la forge (`self-test.mjs`, une entrée `CAS`) et rejouées par le `--self-test`
de l'oracle lui-même, qui porte **24 cas** : les trois rouges et les trois vertes du mandat, huit
bornes (la cause seule, la réparation seule, « Valider la commande » qui n'est pas générique, une
chaîne ordinaire qui ne déclenche rien, la précédence erreur > état vide, la clé qui suffit à
classer, la frontière de mot sur `compresse-le`, la chaîne sans lettre), sept cas d'extraction
(un par format, plus le `<script>` dont le contenu n'est pas pris pour un texte d'application) et
les deux fixtures de dépôt aux deux sens.

**Recettes, sorties telles quelles.**

```
node oracles\oracle-textes-application.mjs --self-test
  → exit 0 · « Textes d'application (T4-1…T4-4) : 24 PASS, 0 FAIL »

node oracles\oracle-textes-application.mjs oracles\fixtures\textes-application-rouge.json
  → exit 1 · verdict FAIL · 7 chaînes lues · 4 bloquant(s), 4 avertissement(s)
    DUR   T4-1 « Une erreur est survenue »          [… :7 · erreur.generique]
    DUR   T4-1 « Oups, une erreur est survenue. Désolé. » + AVERT T4-4 (excuse)
    DUR   T4-2 « Aucune donnée »                     [… :12 · liste.vide]
    DUR   T4-2 « Aucun résultat »                    [… :13 · liste.recherche_sans_resultat]
    AVERT T4-3 « Valider », « Cliquez ici » · AVERT T4-1 « Champ invalide » (cause sans réparation)

node oracles\oracle-textes-application.mjs oracles\fixtures\textes-application-verte.json
  → exit 0 · verdict PASS · 8 chaînes lues · 0 bloquant, 0 avertissement

node oracles\self-test.mjs   → exit 0 · « Tout vert — 40 oracles, 124 règles verrouillées. »
                               (39 oracles / 120 règles avant ce lot)
```

Les deux chaînes que le lot donnait comme critère de fin se comportent comme il le demandait :
« Une erreur est survenue » rend **FAIL**, « Le fichier dépasse 10 Mo. Compresse-le ou envoie-le
en deux fois. » rend **PASS**.

**L'oracle n'est pas vide, et c'est mesuré et non supposé** : lancé en aveugle sur une fixture
préexistante du dépôt, `oracles\fixtures\maquette-cta-rouge.html`, il relève au premier essai un
`<button>Valider</button>` réel (T4-3, ligne 45) — un défaut que ce dépôt portait dans ses
propres preuves depuis des semaines, et qu'aucun oracle ne voyait.

### Un écart au lot, assumé et consigné : `T4-*` et non `TA*`

Le lot nomme les quatre règles **TA1 à TA4**. Ces quatre identifiants sont **déjà pris dans ce
dépôt** par `oracle-taste` (TA1 familles d'accent, TA2 saturation, TA3 filets, TA4 systèmes
cohabitants) et cités sous ce sens par `grille.md`, à la dimension D1. Mesure :
`grep -rl "TA1"` rend `oracle-taste.mjs`, `registre-entrees.md`,
`regles-importees-taste-skill.md`, `self-test.mjs`, `grille.md`. Deux sens pour un même
identifiant **dans le même rapport de critique** est un défaut de cohérence, pas une nuance : le
rapport aurait cité « TA1 » pour une famille d'accent au paragraphe D1 et pour une erreur sans
réparation au paragraphe D7.

Le préfixe retenu, **`T4`**, est le code de typologie de `references\ECRITURE.md` — « T4 :
textes d'application » : il dit ce qu'il juge, et il ne pouvait pas entrer en collision. L'écart
est écrit à trois endroits qui le rendent introuvable-par-accident : l'en-tête de l'oracle, le
chapitre du registre local, et le commentaire du banc. Il est remonté ici en **RD-19**.

---

## digit-ai-factory (`digit-ai-factory`)

Deux retours, nés du traitement lui-même — pas d'une lecture d'intention. Le premier a empêché
de jouer le contrôle que le lot prescrit ; le second a fait dévier une consigne du lot, et le
pilot doit savoir pourquoi son texte et l'artefact livré ne se ressemblent pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-18 | majeur | générique | **Le contrôle ⛔ « obligatoire » d'un lot de travaux pointe un chemin qui n'existe chez aucune FORGE.** Le lot `pilot - TRAVAUX - 20260912b.md` ouvre, comme le gabarit `gabarits\TRAVAUX-PILOT.md` le prescrit, par un encadré ⛔ « AVANT DE TRAITER — un geste, une seconde » portant `node forge\travaux\oracle-travaux.mjs "<ce fichier>.md"`. **Mesuré le 12/09/2026 dans `c:\dev\digit-ai-forge-design`** : la commande rend `Error: Cannot find module 'C:\dev\digit-ai-forge-design\forge\travaux\oracle-travaux.mjs' (MODULE_NOT_FOUND)`, et `find . -name "oracle-travaux*"` ne rend **rien** — ce dépôt n'a pas de dossier `forge\` du tout. La cause est au référentiel et elle est explicite : `gabarits\HERITAGE.json` pose `forge\travaux\oracle-travaux.mjs` (mode `copie_conforme`) et déclare en `non_juge` « un produit qui n'est pas sous doctrine (aucun `forge\`) : R-47 rend SANS_OBJET ». Une **forge** n'est pas un produit instancié : elle reçoit les lots de travaux et ne reçoit pas l'héritage qui porte leur juge. **Récidive mesurée** : le lot `digit-ai-forge-design - RETOURS - 20260905a` disait déjà, le 05/09, avoir dû appeler « le module du pilot **à sa source** » faute de copie locale ; le lot du 12/09 prescrit le même chemin, mot pour mot. Le contrôle a donc été joué à la source (`node gabarits\oracle-travaux-pilot.mjs` → PASS, T1-T8), mais par déduction de session, pas parce que le lot le disait. | Deux voies, non exclusives. (1) Que `gabarits\TRAVAUX-PILOT.md` donne **les deux chemins** dans son encadré ⛔ — la copie héritée d'abord, le module du pilot à sa source ensuite, avec la phrase qui les départage (« pas de `forge\` chez vous ? alors vous n'êtes pas un produit instancié : jouez-le à la source ») — exactement le motif que T8 applique déjà, et bien, au **sort du lot reçu** (« SAUF si `git check-ignore` … »). (2) Que le pilot **calcule** l'encadré à l'émission : il sait, au moment d'écrire le lot, si le destinataire porte `forge\travaux\oracle-travaux.mjs`, puisqu'il mesure déjà `input\00-travaux\` pour écrire la ligne « Sort du lot reçu ». **La règle qui aurait évité ce retour** : *une affordance est câblée ou elle n'existe pas* (loi transverse n° 1) — un encadré qui prescrit une commande sur un dépôt où elle ne tourne pas est une affordance non câblée, et l'oracle `oracle-travaux-pilot` T-* ne mesure pas cela. |
| RD-19 | mineur | générique | **Un lot de travaux prescrit des identifiants de règles déjà pris dans le dépôt cible, sans les avoir relevés.** Le lot `20260912b` demande, pour l'oracle T4, les règles « **TA1** … **TA2** … **TA3** … **TA4** ». **Mesuré le 12/09/2026** : ces quatre identifiants sont pris depuis le 14/08 par `oracles\oracle-taste.mjs` (TA1 familles d'accent, TA2 saturation, TA3 filets, TA4 systèmes de design cohabitants), enregistrés sous ce sens au registre local (`oracles\registre-entrees.md`, ligne du 04/08), verrouillés au banc (`oracles\self-test.mjs`) et **cités en toutes lettres** par `skills\critique-le-design\references\grille.md` (« Les avertissements TA1 (familles d'accent) et TA2 (saturation) d'`oracle-taste` »). Suivre le lot à la lettre aurait produit un rapport de critique où « TA1 » désigne une famille d'accent au paragraphe D1 et une erreur sans réparation au paragraphe D7. Le coût réel est faible (un choix de préfixe) ; le coût s'il n'était pas vu serait un identifiant ambigu dans le référentiel le plus lu de la forge. Écart assumé et consigné : les règles sont **`T4-1` à `T4-4`**, d'après le code de typologie de `references\ECRITURE.md`. | Que le gabarit de lot de travaux dise, là où il prescrit un artefact nommé (règle, critère `Cnn`, clé de référentiel), **qui tranche le nom** : soit le pilot relève l'espace de noms du destinataire avant d'émettre — il lit déjà le module producteur, comme T6 l'exige, donc le relevé est à sa portée —, soit le lot prescrit la **sémantique** et laisse au destinataire le choix de l'identifiant, en le disant. Deuxième effet utile, gratuit : le lot du 12/09 demandait aussi « l'oracle est joué avant C15 » sans savoir que **C14 était libre** dans `criteres-sortie.md` — le numéro est tombé juste par chance, et la chance n'est pas une méthode. |

**Portée** : les deux sont *génériques*. RD-18 frappe **toute forge** destinataire d'un lot de
travaux — c'est-à-dire, par construction, tout dépôt qui n'est pas un produit instancié. RD-19
frappe tout lot de travaux qui prescrit un identifiant dans un dépôt qu'il ne possède pas.

## Remarques restées au produit

Trois remarques sont restées chez la forge, chacune avec son verdict de généralisation écrit.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| **`criteres-sortie.md` sautait de C13 à C15** : le numéro C14 n'existait nulle part dans le dépôt (`grep -rn "C14"` → aucun résultat avant ce lot), sans qu'aucun texte ne dise s'il avait été retiré ou jamais écrit. | Le trou est **comblé** : le critère des textes d'application prend C14, et il tombe exactement là où le lot le demandait — « joué avant C15 ». La coïncidence est heureuse, elle n'est pas une méthode (voir RD-19). | **non** | Dette de rédaction locale à un seul fichier. La classe générique correspondante — un lot qui prescrit une position sans connaître la numérotation du destinataire — est déjà remontée en **RD-19** ; en faire un second retour serait compter deux fois le même défaut. Aucune ligne de sidecar distincte. |
| **La grille de `oracle-baseline` a cinq largeurs quand celle de `run-oracles-design` en a sept** : 1440 px et 768 px restent hors de la grille de *baseline* par défaut. | **Choix assumé, pas un oubli** : chaque largeur de baseline coûte un PNG approuvé versionné dans ce dépôt, et le lot fixait lui-même la grille attendue (`3840,2560,1920,1024,390`). La dissymétrie est écrite dans le `non_juge` de l'oracle — elle sort donc à **chaque** exécution, jamais seulement dans un commentaire. | **non** | Propre à cet oracle et à son coût de stockage. Le principe employé — *une couverture réduite se déclare au `non_juge`, elle ne se devine pas depuis la valeur par défaut* — est déjà le standard §3 de `quality-oracles` ; rien de neuf à remonter. |
| **Les renvois à E-12 de `voix.md` vivent à l'intérieur du bloc de code qui porte la structure imposée de `MARQUE.md`** — c'est là que sont les sections *Actions*, *Erreurs*, *États vides*. | Écrits en **prose simple**, au même registre que les instructions déjà présentes dans ce bloc (« Trois mots concrets. Ni “moderne”… »), et non en commentaire HTML : un auteur qui remplit le gabarit les lit, et les remplace par son contenu comme il remplace les autres. | **non** | Particularité de forme de ce seul contrat. Le lot demandait « une ligne de renvoi par section » et c'est exactement ce qui a été écrit ; le fait que ces sections vivent dans un gabarit imbriqué n'a coûté qu'une décision de rédaction, tranchée en une minute. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot.
Les seuls artefacts dérivés d'un gabarit du pilot sont ce lot de retours lui-même et son sidecar
(`gabarits\RETOURS-FORGES.md`), qui ne sont pas des livrables et ne portent ni identifiant
`gd-…` ni `version_du_gabarit` — leur retour éventuel relèverait de la forme du lot, jugée par
`oracle-lot-retours`, et elle a tenu.

## Confirmations positives

Quatre choses ont tenu en conditions réelles, et deux d'entre elles sont exactement ce que la
mécanique du pilot promet.

- **Une règle du pilot est descendue et s'est jouée le jour même, sans traduction.** E5 de
  `references\BEST-PRACTICES-HTML.md` donne la grille `3840,2560,1920,1440,1024,768,390` comme
  une **valeur**, pas comme une intention. Elle s'est recopiée telle quelle dans une constante
  de code, une ligne de contrat et deux références de skill, sans qu'une seule décision de
  design ait eu à être re-prise ici. C'est le contraire du défaut de RD-18 : là, la règle porte
  ce qu'il faut pour être appliquée.
- **Le contrat d'oracle de cette forge accueille un domaine neuf sans rien changer au banc.**
  Enrôler `oracle-textes-application` a coûté **une entrée `CAS`** de sept lignes dans
  `self-test.mjs` ; le banc a vérifié de lui-même les six invariants (exit 0 sur la verte, exit 1
  et FAIL sur la rouge, les quatre règles déclenchées, le contrat JSON complet, `non_juge` non
  vide) sans une ligne de test écrite à la main. 39 → 40 oracles, 120 → 124 règles, tout vert au
  premier essai.
- **La garde d'entrée d'`oracle-coherence-promesse` était réutilisable telle quelle.** Le motif
  — « un oracle qui s'exécute quand on le lit n'est pas testable unitairement » — a permis
  d'écrire `juger()` comme une fonction pure et d'en faire porter les 24 cas du `--self-test`
  sans jamais passer par le disque, sauf pour les deux fixtures de dépôt. Un motif écrit une
  fois dans un commentaire de cette forge a servi deux oracles à quinze jours d'intervalle.
- **Les critères « Comment vous saurez que c'est fait » du lot étaient exécutables tels
  qu'écrits.** Les cinq (sept largeurs listées, deux bancs PASS, `--self-test` PASS, les deux
  chaînes témoins, entrée au registre) se sont joués sans reformulation ni interprétation. C'est
  ce qui a permis de dire « fait » sans jamais l'affirmer sans preuve.

## Ordre recommandé

Deux retours, et **une action qui n'est pas un retour** mais qui les précède en urgence.

1. **La remontée §4 de `oracle-textes-application` au registre global — un geste mandaté, dû.**
   Rang 1 parce que c'est le seul point du lot qui reste **ouvert**, et parce qu'il l'est par
   respect du garde-fou (« aucune écriture dans les dépôts frères hors mandat humain ») et non
   par oubli. L'entrée est écrite, datée, sourcée et prête à injecter dans
   `oracles\registre-entrees.md`, chapitre « Entrée du 12/09/2026 » — ligne de tableau et objet
   JSON. Tant qu'elle n'est pas injectée, le statut reste `candidat` et un producteur d'une
   autre forge ne trouvera pas cet oracle au registre qu'il consulte. Le chapitre le dit en
   toutes lettres, pour que personne ne le lise comme injecté.
2. **RD-18 — le contrôle ⛔ qui ne tourne pas chez son destinataire.** Rang 2 : c'est le seul des
   deux qui **empêche un geste prescrit**, et c'est une récidive à sept jours. Le correctif le
   moins cher est d'une phrase dans `gabarits\TRAVAUX-PILOT.md` — le gabarit sait déjà écrire ce
   genre de branche, il le fait à sa ligne « Sort du lot reçu ».
3. **RD-19 — les identifiants prescrits sans relevé.** Rang 3 : mineur, sans blocage ni faux
   vert, et déjà payé ici par un écart assumé et documenté. À traiter quand le gabarit de lot
   sera rouvert pour RD-18 : les deux corrections se posent dans le même fichier, à deux
   paragraphes d'écart.

## La règle qui aurait évité le retour (TF-0779)

Aucun des deux retours ne suit un retour humain : les deux sont nés d'une **mesure exécutée**
pendant le traitement du lot — une commande qui a rendu `MODULE_NOT_FOUND`, un `grep -rl` sur
un identifiant. La règle est nommée pour la classe, et une classe manquante est **signalée** au
pilot plutôt que créée ici : une classe ne se crée jamais dans un sidecar.

- **RD-18 relève d'une classe existante : `boucle-retour-sans-descente`** (famille
  `heritage-produit`). Le libellé décrit le fait : « une correction close au pilot ne redescend
  pas sous une forme que le producteur rencontre ». `oracle-travaux-pilot.mjs` **existe** et
  **fonctionne** — joué à la source, il rend PASS sur ce lot, T1 à T8. Ce qui ne descend pas,
  c'est le moyen de le jouer : `gabarits\HERITAGE.json` ne le pose que chez les produits
  instanciés, et le producteur — une forge — ne rencontre que sa **prescription**. Le retour
  entre **marqué récidive** : le lot `digit-ai-forge-design - RETOURS - 20260905a` avait déjà
  constaté l'absence de la copie locale le 05/09 et contourné en appelant le module à sa source,
  et le lot du 12/09 reprend le même chemin inchangé. Si le pilot juge que la classe vise la
  *correction* et non l'*outillage*, une classe voisine est proposée, sous la même famille :
  *un artefact d'héritage n'est posé que chez les produits instanciés, et un texte du pilot en
  prescrit l'usage à des destinataires qui ne le reçoivent pas.*
- **Aucune clé ne convient pour RD-19.** La famille `lot-forme` porte le bon objet — la forme
  d'un lot — mais aucune de ses quatre classes ne couvre le cas :
  `lot-de-travaux-mauvais-module-producteur` vise le module à qui l'on confie une production
  qu'il n'assure pas, ce qui n'est pas le sujet ; `correction-symptome-sans-classe`,
  `lot-remis-ecrasable` et `registre-doublon-non-detecte` visent d'autres gestes. La famille
  `regle-morte` porte la bonne **forme** — un identifiant qui cesse de désigner une seule chose
  — mais ses classes visent des contrôles, pas des noms. Le pilot est invité à créer la classe
  s'il la juge fondée — proposition de libellé : *un lot de travaux prescrit un identifiant
  (règle, critère numéroté, clé de référentiel) dans l'espace de noms du destinataire sans
  l'avoir relevé, et le destinataire doit choisir entre la collision et l'écart au lot.* Ce
  retour n'a donc **pas** de ligne de sidecar.
