# Retours forges — Produit-10 — 20260824a

- **Contexte** : mise à jour de la factory après cinq jours sans run. Deux frictions
  attendaient au ledger depuis le 19/08 (`a_compiler`), le rejeu des oracles du socle sous le
  **jeu de règles courant** en a produit trois autres, mesurées le 24/08, et la remise de ce
  lot en a révélé une sixième. L'héritage de la factory, qui n'était pas tenu ici, a été
  rattrapé dans la foulée (`R-43`, `R-47` — voir « Remarques restées au produit »).
- **Références ledger** : `forge\ledger.jsonl` seq 55, 56, 57 — plus les mesures du 24/08
  consignées avec ce lot.
- **Remise au pilot** : copié dans `<PILOT_ROOT>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-08-24

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `Produit-10 - RETOURS - 20260818b` (remis, ingéré en `TF-0378` à `TF-0382`,
les cinq soldés `corrigé`). La séquence d'ids continue en **`RA-21`** côté forge-agents et en
**`RV-10`** côté factory.

---

## Le fait qui ouvre ce lot

Les **8 livrables HTML** de `output\`, tous **PASS 0 FAIL / 0 WARN** le 19/08, sont **FAIL**
le 24/08 : **12 échecs, tous `L19`**, sans qu'un octet ait bougé dans un seul fichier.

| Livrable | Verdict 19/08 | Verdict 24/08 |
|---|---|---|
| `Rapport mapping Bronze al2 vers Silver Client-A - 20260819a.html` | PASS 0/0 | **FAIL 2** (L19 ×2) |
| `Rapport mapping global ALX Client-C et Client-A - 20260819a.html` | PASS 0/0 | **FAIL 2** (L19 ×2) |
| `Etude Impact du rechargement AL2 et des transcodifications - 20260819a.html` | PASS 0/0 | **FAIL 2** (L19 ×2) |
| `Gabarit Rapport de donnees HTML - 20260813a.html` | PASS 0/0 | **FAIL 2** (L19 ×2) |
| `Rapport mapping Bronze al2 vers Silver Client-A - 20260813a.html` | PASS 0/0 | **FAIL 1** (L19) |
| `Rapport mapping Bronze alx vers Silver Client-C - 20260818a.html` | PASS 0/0 | **FAIL 1** (L19) |
| `Etude comparative mapping Client-C contre al2 Client-A - 20260818b.html` | PASS 0/0 | **FAIL 1** (L19) |
| `Revue des corrections du mapping Client-C 12h vers 18a - 20260818c.html` | PASS 0/0 | **FAIL 1** (L19) |

Ce constat est **dicible** parce que `TF-0366` a été corrigé : `check_html --version-regles`
rend **29 règles, empreinte `b10762163897`** le 24/08, contre **21 règles, empreinte
`269d9b6211e0`** le 18/08. Sans ce champ, ce lot aurait rapporté une « régression des
livrables » ; avec lui, il rapporte un **jeu de règles neuf** — et le vrai sujet, qui est que
`L19` **contredit une prescription du même socle** (`RA-23` ci-dessous).

## forge-agents (`digit-ai-forge-agents`) — socle `digit-ai-page-html`

Quatre retours : deux qui attendaient au ledger depuis le 19/08 et sont **vérifiés encore
présents dans le socle le 24/08**, deux nés du rejeu de ce jour.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RA-21 | majeur | produit+générique | **Deux composants du socle se contredisent sur le contraste du surlignage.** `references\composant-recherche.md` l.39 prescrit `mark.find-hit { background: var(--amber-fill,#fde9c8); color: inherit; }` — **toujours en place le 24/08**. Sur un badge à texte clair — le pattern `.b-map` du **même socle**, blanc sur bleu — le surlignage repeint le FOND en amber-fill sans toucher au texte : **blanc sur presque blanc, ratio 1,04:1**. Mesure du 19/08 sur livrable réel : **21 constats V2 BLOQUANTS aux quatre largeurs**, uniquement en état de recherche active (`--etats-ouverts`). Seule une page qui porte les deux composants ET une recherche active le révèle. | Poser l'encre explicitement dans la prescription : `color: var(--ink)`. Les deux jetons basculent ensemble en thème sombre, le contraste tient des deux côtés — c'est le correctif appliqué ici, vérifié aux quatre largeurs. |
| RA-22 | mineur | produit+générique | **V4 mesure des boîtes englobantes ; la boîte d'un inline vaut la hauteur d'em, pas l'interligne.** Deux inline **frères** sur des lignes consécutives se recouvrent donc dès que `line-height` est inférieur à cette hauteur, **sans qu'un pixel peint ne se superpose**. La parade déjà présente dans `scripts\render_page.py` (l.360-366, `getClientRects()` par ligne) ne couvre **que** l'inline réparti sur plusieurs lignes — vérifié le 24/08, le cas des deux frères reste jugé sur la boîte d'em. Mesure du 19/08 (`scripts\mesurer_chevauchement_marks.py`, **1 246 marks**) : à `line-height` 1,22 le recouvrement vaut **5 px** et rend un constat **BLOQUANT à 390 px** ; à 1,3 il vaut encore 3 px ; à 1,45 il disparaît. | Ignorer l'intersection entre deux inline **frères du même parent** quand elle tient dans la différence entre hauteur d'em et interligne — ou la classer en avertissement. Même nature d'exclusion que `colgroup` (TF-0444) et que le groupe SVG titré (TF-0424). |
| RA-23 | majeur | générique | **`L19` refuse ce que `composants.md` §6 rend obligatoire, et il le refuse sans regarder sous quelle media query la règle vit.** §6 (l.117-118) : « **Palier intermédiaire obligatoire** entre le seuil de repli et la largeur où le tableau tient à l'aise : `overflow-wrap: anywhere` sur les cellules ». `L19` (`check_html.py` l.1125-1170, TF-0492, 22/08) traite `td` comme un sélecteur de prose et rend **FAIL bloquant**. Les deux sélecteurs incriminés ici — « `tbody td` » et « `.table-wrap:has(th:nth-child(7)) tbody td` » — sont **à l'intérieur du bloc `@media` du repli en cartes**, donc actifs **uniquement** là où §6 les exige. L'oracle ne peut pas le savoir : `regles_css` (l.297-311) aplatit la feuille par une regex `([^{}]+)\{([^{}]*)\}` et **ne conserve aucun contexte d'at-rule** — il n'écarte que les sélecteurs commençant par `@`. Coût mesuré : **12 FAIL sur 8 livrables** de ce projet, **2 FAIL sur chacune des 3 vues** générées par les scripts de la factory (`RV-10`), tous du même motif. | Trois pistes, par ordre de coût : (1) faire porter à `regles_css` le contexte d'at-rule, et exempter `L19` sous une media query de repli en cartes ; (2) exempter le couple `display:block` + `overflow-wrap:anywhere` sur `td` — c'est la signature du repli en cartes, jamais celle de la prose ; (3) à défaut, **trancher la contradiction dans §6** et y écrire l'exemption attendue (`data-coupure-ok`, ou une classe reconnue par le motif TECHNIQUE de `L19`). Ce qu'il ne faut pas laisser : les deux textes en l'état, l'un obligeant ce que l'autre bloque. |
| RA-24 | mineur | produit+générique | **§6 donne la règle de calibrage en prose, et aucun mécanisme : chaque projet la retraduit, et se trompe.** §6 pose « ~130 px de largeur utile par colonne — un tableau de N colonnes se replie sous `N × 130 px` environ, et 640 px n'est le bon seuil que jusqu'à 4-5 colonnes », puis l'exemple de code fige `@media (max-width: 640px)`. Ici le repli était réglé à **900 px** ; un tableau de **8 colonnes** déborde jusque vers 1 400 px (bord droit mesuré à **1 308 px** pour un viewport de 1 280). Résultat : **FAIL 16 débordements V1** sur `20260818e`, **invisibles cinq jours** — et le même 900 px est **figé en dur** dans `gabarits\documents\rapport-de-donnees\SQUELETTE.html` de la factory (l.209-231), donc reproduit par tout projet qui l'instancie. | Mécaniser la règle plutôt que la décrire : `.table-wrap:has(th:nth-child(7))` déclenche le repli anticipé **sans qu'aucun émetteur ait à poser de classe** (mesuré ici : `20260818e` repasse de FAIL 16 à **PASS 0 bloquant**). Un sélecteur par palier de colonnes (5, 7, 9) couvre le calibrage §6 en trois lignes de CSS. |

**Portée** (R-45) : *générique* — le défaut vaut pour tout projet employant la forge ;
*produit+générique* — corrigé ici **et** la classe vaut ailleurs.

## factory (`digit-ai-factory`)

Deux retours. Le premier est né de la remise de ce lot même : `R-47` n'a pas su localiser ce
produit, et le défaut d'héritage qu'elle aurait constaté était **réel**. Le second **élargit**
celui resté au ledger le 19/08 (seq 55) : ce n'est pas une vue qui échoue, ce sont **les
trois**, et la cause commune est dans la bibliothèque partagée.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-11 | majeur | générique | **`R-47` ne trouve pas un produit rangé sous un dossier client : le cercle qu'elle devait refermer reste ouvert pour tout un parc.** `todo\ingerer-lot.mjs` l.308-320 cherche le produit parmi les **enfants directs** de `<FORGE_ROOT>` dont le nom commence par le nom du lot, plus un repli `<candidat>\projet`. Ce produit vit sous `C:\dev\_Client-A\Produit-10` : la remise de ce lot même a imprimé « **conformité de l'héritage NON vérifiée pour « Produit-10 » — dossier introuvable sous C:\dev** ». Le message est honnête, et c'est là le problème : **il ne s'agit pas d'un produit hors doctrine**, mais d'un produit invisible à la recherche. Vérifié le 24/08 : le même oracle, **pointé à la main** sur le dossier, rendait `R-43` **FAIL** (précédence non câblée) et `R-47` **FAIL** (2 artefacts absents — `forge\hooks\factory.mjs`, `.claude\settings.json` — et `CLAUDE.md` sans la clause `R-43`). Exactement le défaut du 23/08 qui a motivé la règle, vivant, et non vu par le mécanisme censé le rattraper. Le dossier `C:\dev\_Client-A\` porte **22 produits**, tous hors de portée de cette recherche. | Descendre d'un niveau quand aucun enfant direct ne correspond : un balayage des petits-enfants de `<FORGE_ROOT>` portant un `forge\`, borné à 2 niveaux, suffit ici. Plus sûr encore : faire porter au **sidecar** le chemin du produit (`racine_produit`) — le produit sait toujours où il est, la factory ne peut que le deviner. Et à défaut de cible trouvée, **le dire au registre** plutôt qu'au seul stderr : une vérification non faite qui ne laisse pas de trace est une vérification qu'on croit faite. |
| RV-10 | majeur | générique | **Les vues `docs\projet\` produites par les scripts de la factory échouent au `check_html` du socle — et le projet n'a pas le droit de les corriger.** Mesuré le 24/08 (29 règles, empreinte `b10762163897`), sur les fichiers **commités**, avant toute modification : `MODELE-DONNEES.html` **FAIL 23 / WARN 3** (A4 ×1, L3 ×6, **L4 ×13**, L13 ×1, L19 ×2) · `TODO-PRODUIT.html` **FAIL 7 / WARN 2** (A4 ×1, L3 ×4, L19 ×2) · `ARCHITECTURE.html` **FAIL 3 / WARN 3** (A4 ×1, L19 ×2). Les deux familles présentes sur **les trois** viennent de la bibliothèque partagée `scripts\lib-vue-html.mjs` : le `<title>` (l.81) ne reprend aucun indice de version daté → **A4** ; `overflow-wrap:anywhere` sur `.meta`, `td` et `footer` (l.103, 109, 115) → **L19**. Les familles restantes dépendent du contenu : 13 tables de 8 à 89 lignes sans `data-filterable` (**L4**), aucune barre de recherche statique (**L13**), jetons de colonne non légendés (**L3**). **Tension de règles** : `R-26` interdit d'éditer une vue générée, `R-32` exige qu'un livrable HTML passe les oracles — un projet consciencieux ne peut ni corriger, ni livrer vert. | Faire passer `lib-vue-html.mjs` sur les règles du socle, en commençant par les deux familles transverses : **A4** (reprendre l'indice daté du nommage dans le `<title>`) et **L19** (réserver `anywhere` aux cellules d'identifiants, ou attendre l'arbitrage de `RA-23` — les deux retours se rejoignent ici). Pour **L4/L13**, poser `data-filterable` et l'outillage de recherche du socle dès qu'une table générée dépasse 8 lignes : le générateur connaît le nombre de lignes qu'il écrit. Pour **L3**, légender les jetons de colonne — ou déclarer une exemption motivée pour une vue de MODÈLE de données, où tout jeton **est** un nom de colonne. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le repli en cartes se déclenchait à 900 px alors qu'un tableau de 8 colonnes le réclame vers 1 400 | règle `.table-wrap:has(th:nth-child(7))` ajoutée au gabarit du projet ; `20260818e` repasse de FAIL 16 à PASS 0 bloquant | **oui** | La règle §6 est juste ; ce qui manque est sa **mécanisation**, et le même 900 px est figé dans le squelette de la bibliothèque → remonté en **`RA-24`** |
| `mark.find-hit` gardait le blanc d'un badge `.b-map` : 21 constats V2 bloquants en recherche active | encre posée explicitement (`color: var(--ink)`) dans le gabarit du projet | **oui** | Le défaut naît de **deux composants du socle** qui se contredisent, pas de notre CSS → remonté en **`RA-21`** |
| Interligne des titres à 1,22 : deux surlignages de lignes consécutives se recouvraient de 5 px | interligne porté à 1,45, mesure à l'appui (`scripts\mesurer_chevauchement_marks.py`) | **oui** | Le correctif local **contourne** une mesure d'oracle discutable ; la classe est la mesure elle-même → remontée en **`RA-22`** |
| `docs\projet\TODO-PRODUIT.md` n'existait pas : dix documents du socle sur onze | instancié le 22/08 depuis `gabarits\docs-projet\TODO-PRODUIT.md` | **non** | Rien de généralisable : la classe est déjà tenue par `TF-0462`, et le gabarit a servi tel quel, sans ajout à la main |
| L'héritage de la factory n'était pas tenu ici : `forge\hooks\factory.mjs` et `.claude\settings.json` absents, `CLAUDE.md` sans la clause `R-43` — donc **aucun hook de la factory ne s'exécutait** dans ce produit depuis le 23/08 | les deux artefacts recopiés depuis `gabarits\` (copie conforme vérifiée), clause `R-43` ajoutée au `CLAUDE.md` ; `oracle-conformite-projet` passe de **FAIL (R-43, R-47)** à **PASS 29 / 0 FAIL** le 24/08 | **oui** | Les fichiers manquants sont propres à ce produit ; ce qui est généralisable, c'est que **le contrôle chargé de le détecter ne pouvait pas nous voir** → remonté en **`RV-11`** |
| Notre copie de `gabarits\RETOURS-FORGES.md` datait du 13/08 et ne portait ni la colonne *Portée*, ni les sections R-45/R-46 | copie rafraîchie depuis la factory avant d'écrire ce lot | **non** | Classe déjà connue et outillée : le refus de `ingerer-lot.mjs` nomme cette cause en toutes lettres (« CAUSE LA PLUS FRÉQUENTE », `TF-0502`). Rien à ajouter — sinon que le garde-fou a **prévenu avant** le rejet, ce qui est le comportement voulu |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot** : les 8 livrables
de `output\` sont antérieurs à `gabarits\documents\` (posée le 21/08) et sortent des
générateurs du projet ; aucun ne porte le couple `gabarit` + `version_du_gabarit` de **G8**.

Le retour utile est ailleurs, et il est dû : la famille **`gd-rapport-donnees` (version du
gabarit `1.0.0`)** a été **extraite de ce projet** — sa provenance le dit, « extrait du gabarit
produit par le projet Produit-10 le 13/08/2026 […] et de quatre rapports de mapping bâtis dessus
entre le 14 et le 19/08 ». Ce que ce projet peut dire du gabarit qui vient de lui, il le doit :

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a gêné le lecteur | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Produit-10 - Gabarit Rapport de donnees HTML - 20260813a.html` (la **source** de l'extraction) | `gd-rapport-donnees` · `1.0.0` — **rétro-rattachement** : le document est antérieur au catalogue et ne porte pas le couple G8 | **le seuil de repli des tableaux** : `SQUELETTE.html` l.209-231 fige 900 px, quand `composants.md` §6 le fait dépendre du nombre de colonnes. Le squelette **passe** `check_html` (PASS 0 / 1 WARN) parce que sa table d'exemple a 3 colonnes ; l'instance réelle, à 8 colonnes, a rendu **FAIL 16 V1** | rien de rapporté par le destinataire sur ce point | le calibrage par `:has(th:nth-child(7))`, écrit ici après coup — voir `RA-24` | **générique** — vaut pour toute instance de la famille |
| idem | idem | **le palier `overflow-wrap: anywhere` sur les cellules**, exigé par §6, est **absent** du squelette : il reste vert sous `L19` en n'appliquant pas §6, quand une instance qui applique §6 devient rouge (12 FAIL ici) | — | le palier §6, appliqué dans nos gabarits, et désormais **sanctionné** par `L19` | **générique** — l'arbitrage manque au gabarit autant qu'au socle (`RA-23`) |

Autrement dit : le gabarit `1.0.0` a tranché **en silence** une contradiction du socle, en
retirant le palier §6 pour rester vert. Le tri était peut-être le bon ; il n'est écrit nulle
part, et l'instance suivante le refera dans l'autre sens.

## Confirmations positives

- **`TF-0366` (version du jeu de règles dans le verdict) — le correctif tient à distance.**
  C'est **cinq jours plus tard** qu'il a servi : sans `--version-regles`, la chute de PASS 0/0
  à 12 FAIL se lisait comme une régression de nos livrables. Avec lui, elle se lit comme
  **8 règles nouvelles** (21 → 29) et se remonte utilement. C'est exactement l'usage prévu par
  `RA-14`, constaté en conditions réelles.
- **`TF-0367` (résolution de `<PILOT_ROOT>` par signature) — rejouée le 24/08**, depuis la
  racine de ce produit avec `FORGE_ROOT=C:\dev` : rend `C:\dev\digit-ai-factory`, exit 0, en
  écartant les deux copies périmées. **Cinq jours et une centaine de commits factory plus
  tard**, elle est toujours juste — ce qu'un chemin écrit en dur n'aurait pas été.
- **`TF-0424` et `TF-0444` (exclusions V4 : groupe SVG titré, `colgroup`/`col`)** — présents
  dans `render_page.py` le 24/08 ; aucun faux positif de ces deux familles sur nos livrables.
  `RA-22` demande la **même nature** d'exclusion pour un troisième cas.
- **Le refus R-45/R-46 de `ingerer-lot.mjs` a joué en prévention, pas en sanction** : son
  message nomme la cause la plus fréquente — une copie de gabarit jamais rafraîchie (`TF-0502`)
  — et c'est ce qui a fait rafraîchir la nôtre **avant** d'écrire ce lot.

## Contrôle de complétude

- **Garde de sidecar** : 6 lignes, `schema: 1`, les 5 champs obligatoires (`titre`, `contenu`,
  `demandeur`, `source`, `date_demande`) présents, `forges_cibles_initiales` non vide, **aucun
  `id` frappé**, score entier sur les trois axes.
- **Ingestion à blanc** : `todo\ingerer-lot.mjs` joué contre une **copie** du registre dans un
  répertoire de travail — R-45, R-46, validation intégrale et frappe des ids exercées ; le
  registre de la factory n'est **pas** touché.
- **Ce qui n'est pas fait, et pourquoi** : l'ingestion réelle n'est pas lancée — elle écrit
  dans le registre d'un dépôt frère et relève de la décision humaine.

## Ordre recommandé

1. **`RV-11`** — un contrôle qui ne s'exécute pas coûte plus qu'un contrôle absent : on le
   croit joué. Il est resté muet sur un défaut d'héritage **réel**, et 22 produits d'un même
   dossier client sont dans le même angle mort. Le correctif est court.
2. **`RA-23`** — la contradiction `L19` / §6 met **11 fichiers** en rouge (8 livrables de ce
   projet, 3 vues de la factory) pour une prescription que le socle impose lui-même. Tant
   qu'elle tient, aucun projet suivant §6 ne peut livrer vert, et `RV-10` ne peut pas être
   corrigé proprement.
3. **`RV-10`** — deux familles sur trois vues viennent de **deux lignes** de
   `lib-vue-html.mjs` ; c'est le meilleur rapport gain/effort du lot, une fois `RA-23` tranché.
4. **`RA-21`** — 21 constats bloquants pour **une déclaration de couleur** dans une référence.
5. **`RA-24`** — trois lignes de CSS dans §6 et dans le squelette de `gd-rapport-donnees`
   épargnent à chaque projet la retraduction d'une règle de calibrage écrite en prose.
6. **`RA-22`** — le moins urgent : contournable par l'interligne, mais il déforme la mise en
   page pour satisfaire une mesure, et c'est une dette qui se paiera ailleurs.
