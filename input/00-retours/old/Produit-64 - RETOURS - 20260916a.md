# Lot de retours — Produit-64 → digit-ai-page-html — 2026-09-16, indice a

**Émetteur** : produit `Produit-64` · **Cible** : le socle `digit-ai-page-html` ·
**Origine** : troisième lot de retours humains du 2026-09-16 sur
`output/05-Kits/Client-A - Guide développeur POC-to-Prod - 20260915c.html`, mot pour mot —
« Le résultat est pire qu'avant, est-ce que ça a été testé ? […] Le schéma Terraform n'a pas
été testé… De manière globale, une repasse complète sur le document est nécessaire pour
respecter les standards de la Factory. »

Les six retours de ce lot ont **tous** été trouvés pendant cette repasse, et **aucun** n'a été
trouvé par un oracle du socle : cinq décrivent un oracle qui se trompe, se contredit, ou ne
mesure pas ce qu'il protège ; le sixième décrit une étape obligatoire du socle que rien ne joue.

- **Contexte** : troisième lot de retours humains sur un livrable documentaire, hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## RD-3 — Le facteur d'échelle de capture, documenté comme une aide, retourne un verdict BLOQUANT sur une page conforme

### Le fait mesuré

Même fichier, même largeur de fenêtre, deux verdicts opposés selon la valeur de `--scale` :

```
render_page.py "<guide>.html" --widths 390 --scale 1     → Verdict : PASS
render_page.py "<guide>.html" --widths 390 --scale 0.5   → Verdict : FAIL
  [BLOQUANT] V9 actif visuel indiscernable de son fond : svg « 1 · Cadragefiche produit… »
  meilleur contraste 1.10:1 sur 1570 pixels opaques, contre un fond rgb(255, 255, 255)
```

Mesure indépendante du même SVG, capturé à l'échelle native par un harnais Playwright : la
capture fait 314 × 20 px, **6 280 pixels tous opaques**, dont **746 pixels d'encre
`rgb(15, 23, 42)`** — soit **18,1:1** contre le fond blanc. À `--scale 0.5` la même capture
tombe à 157 × 10 px, les 1 570 pixels que l'oracle rapporte, et le rastériseur y noie une
police de 13 px rendue à 1,9 px : il ne reste que du quasi-blanc.

L'aide de l'option ne parle que de capture : « facteur d'échelle du rendu ; accepte un flottant
(0.4 sur une page très haute — moins de pixels à encoder, capture qui aboutit) ». Elle est donc
présentée comme un réglage de **performance**, et c'est exactement pour cette raison qu'elle a
été employée : la page fait 13:1 à 390 px.

### Ce que le défaut coûte

Le premier réflexe devant un bloquant V9 est de **changer la charte du livrable** — foncer le
remplissage des boîtes de schéma jusqu'à passer le seuil. Ce geste aurait dégradé huit schémas
pour satisfaire un artefact de rastérisation. Une sonde dont le verdict dépend d'un paramètre
de confort envoie corriger ce qui n'est pas cassé.

### La règle qui aurait évité le retour

Aucune règle du socle ne couvre le sujet. La plus proche est la doctrine de banc double sens de
`quality-oracles` : tout contrôle en service porte un **banc de fixtures dans les deux sens**.
Ce banc existe pour V9 — il ne le joue qu'à l'échelle 1. Deux gestes, du moins cher au plus sûr :

1. le banc de V9 rejoue sa fixture conforme à **chaque échelle documentée** (1, 0.5, 0.4) ;
2. V9 **refuse de rendre un verdict bloquant** quand la capture a été réduite : sous l'échelle 1,
   le constat part au `non_juge` avec sa raison, comme le socle le fait déjà pour les captures
   impossibles. Le silence d'une sonde se déclare ; un faux rouge, lui, ne se rattrape pas.

---

## RD-4 — La règle d'impression que L16 PRESCRIT fait échouer L1 sur six passages de prose innocents

### Le fait mesuré

Une fenêtre modale à deux onglets déclare le motif ARIA attendu (`role="tab"`,
`role="tabpanel"`, panneau masqué par `hidden`). `check_html.py` L16 refuse alors la page tant
que la feuille ne porte pas la règle d'impression qu'il nomme lui-même :

```
L16 panneaux d'onglets masqués et aucune règle @media print ne les réaffiche — à l'impression,
TOUS les panneaux se lisent ([role="tabpanel"][hidden] { display: block } sous @media print).
```

La règle a été posée **mot pour mot**. Résultat, au contrôle suivant :

```
x L1 ponctuation orpheline : une ligne s'ouvre sur « . » après l'élément de bloc
  div.chap > ol > li > a (sélecteur « [role="tabpanel"][hidden] » retenu SANS vérification de
  sa contrainte d'ancêtre) — la phrase a été coupée par l'insertion d'un élément en son milieu.
```

**Six échecs bloquants**, tous sur de la prose intacte, tous causés par la règle que L16 venait
d'imposer.

### Le mécanisme, lu dans le code

`check_html.py` collecte les règles dont `display` vaut `block|flex|grid|table|list-item`, puis
classe chaque sélecteur : `_evaluable(compound)` renvoie **faux** dès que le compound contient
`[`, `]`, `:`, `(`, `)` ou `*`. Une règle non évaluable devient **permissive** —
`_compound_matche(n, parties[-1])` décide seul. Or sur le compound `[role="tabpanel"][hidden]`,
cette fonction ne trouve **ni balise, ni classe, ni identifiant** à vérifier, et renvoie donc
**vrai pour tout élément du document**. Chaque `<a>`, `<strong>` et `<code>` de la page devient
un bloc, et L1 accuse la prose qui les entoure.

Le remède qui débloque n'est écrit nulle part : **préfixer le sélecteur d'une classe**
(`.modale-corps[role="tabpanel"][hidden]`) rend le compound partiellement vérifiable et limite
la permissivité aux éléments concernés. Trouvé en lisant la source de l'oracle, pas son message.

### La règle qui aurait évité le retour

`regle-qui-interdit-son-propre-remede` (registre, 2026-09-10) : **tout contrôle bloquant dont le
message propose une correction porte, à son banc, un cas qui JOUE cette correction et qui doit
PASSER.** La classe existe, la règle est écrite, et le cas n'est pas au banc. Le geste :
ajouter au banc de L16 une fixture qui pose la règle d'impression prescrite **et rejoue L1
dessus**. Deuxième geste, indépendant : quand une règle non évaluable retient un élément,
`pourquoi_bloc` le dit déjà — mais la règle **compte quand même** dans le verdict. Un sélecteur
sans balise, classe ni identifiant ne devrait retenir **aucun** élément plutôt que tous : la
permissivité par défaut est ici l'inverse du choix sûr.

---

## RD-5 — L6 et « sommaire perdu » lisent le MÊME premier nav, et leurs exigences s'excluent

### Le fait mesuré

Le destinataire humain demande, mot pour mot : « Les textes dans le menu ne sont pas
nécessaires, cela laissera plus d'espace entre les titres. » Le menu passe en titres seuls.
`check_html.py` refuse aussitôt, onze fois :

```
x L6 entrée sans annonce : « Démarrer » — un élément .toc-d d'au moins 12 caractères est attendu.
```

Le sommaire reconnu est choisi par `_sommaire(a)` : **le premier** `nav.toc` ou
`nav[aria-label^="Sommaire"]` du document. `render_page.py` fait le même choix, avec le même
sélecteur, pour sa famille `sommaire_perdu` — et lui exige que ce nav **reste dans la fenêtre
aux 60 % de la page**.

Les deux exigences ne tiennent pas ensemble sur un même élément dès que le document est long :

- une barre **collante** peut rester visible, mais onze annonces de douze caractères y tiennent
  la place que le lecteur a explicitement demandé de rendre ;
- un sommaire **en cartes**, où l'annonce se lit, ne peut pas être collant : c'est une grille.

La page livrée porte donc **trois navigations** — barre collante de onze vues (titres seuls),
menu latéral collant des chapitres de la vue, et sommaire en cartes avec ses onze annonces.
Chaque oracle n'en regarde **qu'une**, et rend son verdict comme si elle était seule.

Mesure du repli réel, prise au navigateur : le bandeau à onze entrées est `position: sticky`,
haut 0 / bas 194 px, et **reste dans la fenêtre après 20 000 px de défilement, script actif
comme script coupé** (11 vues visibles sans script). Aucun lecteur ne perd la navigation.
`sommaire_perdu` rend pourtant BLOQUANT aux six largeurs, en désignant les cartes.

### La règle qui aurait évité le retour

`deux-regles-du-socle-inconciliables` (registre, 2026-09-08) : **tenir la première fait
mécaniquement échouer la seconde, et aucun auteur ne peut satisfaire les deux.** La classe
existe ; la fixture qu'elle appelle — « une fixture qui applique les règles voisines et doit
rester verte » — n'est pas écrite pour ce couple. Deux gestes :

1. `_sommaire` et `sommaire_perdu` collectent **tous** les nav candidats, pas le premier :
   L6 juge celui qui porte les annonces, `sommaire_perdu` juge le plus permanent, et une page
   qui offre les deux passe les deux ;
2. à défaut, le socle **écrit** laquelle des deux l'emporte quand elles se croisent, pour qu'un
   auteur cesse de chercher l'élément impossible.

---

## RD-6 — `data-overlap-ok` éteint V4 sur l'élément entier, et V4 ne mesurait pas l'invariant qu'il protège

### Le fait mesuré

Dans le schéma des trois couches Terraform, le libellé de flèche « expose ses sorties à » était
imprimé **à l'intérieur de la boîte `01_Subscription`**, sous son sous-titre : un lecteur y
lisait une troisième ligne de légende de la couche, pas le sens d'une flèche. Le défaut a
traversé deux livraisons et a été trouvé **en regardant une capture**, jamais par un oracle.

Aucun contrôle ne pouvait le voir :

| Sonde | Ce qu'elle mesure | Pourquoi elle est muette ici |
|---|---|---|
| V1 | débordement horizontal | le texte est dans le cadre du SVG |
| V2 | contraste `color` sur fond effectif | le texte est lisible, c'est sa PLACE qui est fausse |
| V4 | recouvrement de deux rectangles | le `<text>` porte `data-overlap-ok` — il est **exempté en bloc** |
| L1 | ponctuation orpheline | du texte SVG, hors du modèle de prose |

`data-overlap-ok` est indispensable dans un schéma : un libellé posé **sur** sa boîte recouvre
son rectangle par construction, et sans exemption V4 crierait sur chaque boîte. Mais
l'exemption s'applique à l'élément, pas à la paire : une fois posée, elle couvre aussi le
recouvrement **non voulu** — un libellé de flèche tombé dans une boîte voisine.

Et V4 mesure une grandeur **corrélée** à ce qu'il protège : deux rectangles se recouvrent.
L'invariant est autre : **un libellé appartient à l'élément qu'il annote**. Tant que la
corrélation tient, V4 a raison ; le jour où un libellé change d'élément sans changer de
géométrie, il est muet.

### La règle qui aurait évité le retour

`controle-vrai-sur-le-mauvais-invariant` (registre, 2026-09-09) : **un contrôle mesure
l'INVARIANT qu'il protège, jamais une grandeur qui lui est seulement corrélée.** Le geste, à la
portée du socle : `data-overlap-ok` cesse d'être un interrupteur et devient une **paire
déclarée** — `data-overlap-ok="<id de l'élément recouvert>"`. Un recouvrement avec un autre
élément que celui déclaré redevient un constat. Coût : un attribut à renseigner là où le
schéma le pose déjà.

---

## RD-7 — Une référence SVG valide dans le FICHIER, cassée dans l'INSTANCE SERVIE : sept schémas sur huit sans pointe de flèche

### Le fait mesuré

Le générateur produit huit schémas SVG dans un même document. Chacun définissait son marqueur
de pointe sous le **même** identifiant :

```html
<defs><marker id="pointe" …></marker></defs>
<line … marker-end="url(#pointe)"/>
```

Dans un document unique, `url(#pointe)` résout vers le **premier** élément portant cet
identifiant — celui du schéma de la vue d'entrée. Les onze vues du guide étant peintes une à
la fois (`display: none` sur les dix autres), **dès qu'une autre vue est affichée le marqueur
référencé vit dans un sous-arbre masqué et n'est plus référençable** : les flèches deviennent
des traits nus. Mesuré sur les captures : pointes présentes sur `parcours` (vue peinte au
chargement), **absentes sur les sept autres schémas**.

Le défaut est invisible à toute lecture du fichier — le marquage est syntaxiquement correct et
l'identifiant existe — et invisible aux sondes de rendu : rien ne déborde, rien ne se recouvre,
rien ne manque de contraste. Il n'apparaît qu'en **regardant une capture de la vue concernée**.

### La règle qui aurait évité le retour

`controle-joue-sur-fichier-pas-sur-instance-servie` (registre, 2026-09-14) : **tout contrôle de
rendu d'une page qui sera servie se joue aussi sur une instance servie.** Le geste, peu coûteux
et mécanisable dans `check_html.py` :

1. dans un document portant plusieurs `<svg>`, les identifiants de `marker`, `linearGradient`,
   `clipPath` et `filter` sont **uniques** ;
2. un `url(#id)` résout vers un élément du **même** `<svg>` que son porteur.

Deux règles de marquage pur, zéro faux positif par construction, et elles attrapent une classe
entière que ni le fichier ni la capture pleine page ne révèlent.

---

## RD-8 — La revue de lecture est déclarée OBLIGATOIRE avant toute livraison, et rien ne la joue

### Le fait mesuré

`digit-ai-page-html/SKILL.md` écrit : « Ce qui suppose de LIRE […] n'est pas mécanisé : c'est la
**revue de lecture — OBLIGATOIRE avant toute livraison (TF-0422)** […] consigner chaque constat
dans `REVUE.md` ». Le gabarit ajoute : « **aucune livraison sans `REVUE.md`**, et
`run-oracles`/l'orchestrateur le vérifient (fichier présent, daté, non vide) ».

Ce produit n'exécute pas `run-oracles` : il consomme le socle par ses trois scripts. **Aucun
d'eux ne demande `REVUE.md`**, et aucun ne le mentionne dans sa sortie. L'indice `20260915c` a
donc été livré sans revue, avec trois verdicts verts :

| Oracle | Verdict sur `20260915c` | Défauts qu'il n'a pas vus |
|---|---|---|
| `check_html.py` | PASS, 40 règles | pointes de flèche absentes, libellé dans la mauvaise boîte, libellé tronqué |
| `render_page.py` | PASS, 6 largeurs | idem, plus la prose à 840 px dans une colonne de 1 144 |
| `check_markdown.py --style` | PASS | sans objet |

Le destinataire humain a ouvert le fichier et relevé **sept défauts**, dont **cinq** qu'une
lecture de captures montre en une minute. La revue faite le 16/09 les a tous retrouvés, plus
trois autres, en 33 tuiles et 8 captures de schéma.

### Ce que l'écart révèle

Une étape obligatoire qui n'est jouée que par l'orchestrateur du pilot **n'existe pas** pour un
produit qui consomme le socle directement — et le socle ne le dit pas. Pire : ses trois scripts
rendent PASS, et trois PASS se lisent comme un travail fini. C'est le même mécanisme que
RD-2 (un oracle qui rend PASS sans publier ce qu'il ne mesure pas, remonté dans le lot
`20260915b`), un cran plus haut : ici ce n'est pas une mesure qui manque au rapport, c'est
**une étape entière de la doctrine**.

### La règle qui aurait évité le retour

`regle-ecrite-sans-oracle-qui-la-joue` (registre) : **une règle écrite dans un texte opposable,
avec ses conditions, et qu'aucun contrôle ne joue, tient à la discipline de celui qui
l'applique — c'est-à-dire à rien d'opposable.** Le geste, à coût presque nul : `check_html.py`
publie, à côté de son verdict, une ligne de `non_juge` qui **nomme la revue de lecture, dit
qu'elle n'a pas été jouée ici, et donne le chemin du gabarit** — exactement ce que le socle
fait déjà pour V5, V6, V9 et V18. Un PASS cesserait alors de se lire comme un travail fini.

---

## Remise

Ce lot vise **le socle `digit-ai-page-html`** pour ses six retours. Remise dans
`input/00-retours/_arrivee/` du pilot. Le sidecar
`Produit-64 - RETOURS - 20260916a.tf.jsonl` porte les six lignes, chacune avec
`racine_produit`, conformément à la règle 8 du `CLAUDE.md` de ce produit.

**Aucune clé de classe n'est proposée à la création** : les six retours portent des clés
existantes, et c'est en soi le constat le plus dur de ce lot. Les classes décrivent déjà
exactement ces défauts — `controle-sans-fixture-double-sens`,
`regle-qui-interdit-son-propre-remede`, `deux-regles-du-socle-inconciliables`,
`controle-vrai-sur-le-mauvais-invariant`, `controle-joue-sur-fichier-pas-sur-instance-servie`,
`regle-ecrite-sans-oracle-qui-la-joue` — et **cinq d'entre elles portent, au registre, un
oracle noté « à créer »**. La classe nomme le défaut ; rien ne l'empêche.

## Ordre recommandé

Les six retours sont classés par rapport gain sur effort, et l'anaphore est assumée : chaque
ligne s'ouvre sur l'identifiant du retour parce que c'est lui qu'on vient chercher ici.

1. **RD-7**, le meilleur rapport gain sur effort : deux règles de marquage pur dans
   `check_html.py`, zéro faux positif par construction, et elles attrapent une classe entière
   que ni la lecture du fichier ni la capture pleine page ne révèlent.
2. **RD-4**, parce qu'il **bloque** aujourd'hui toute page employant le motif d'onglets que le
   socle prescrit, et que le remède n'est écrit nulle part.
3. **RD-3**, parce qu'un faux rouge envoie dégrader un livrable conforme, et que le banc existe
   déjà — il suffit de le rejouer à chaque échelle documentée.
4. **RD-8**, à coût presque nul : une ligne de `non_juge` de plus, et un PASS cesse de se lire
   comme un travail fini.
5. **RD-5**, qui demande un choix de doctrine avant un correctif.
6. **RD-6**, le plus coûteux : il change un contrat de marquage déjà employé dans le parc.

---

## Remarques restées au produit

Quatre défauts de la même repasse sont restés ici : ils se corrigent dans le générateur, et
leur classe existe déjà au registre.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Sept tableaux débordaient à 1 440 px : la largeur d'un tableau était la somme ABSOLUE de ses colonnes | la largeur d'une colonne devient une part du tableau, plafonnée par la somme des colonnes ; 0 débordement sur 40 tableaux × 8 largeurs | non | classe `page-html-dictionnaire-colonnes` au registre depuis le 03/09, déjà remontée le 15/09 sous RT-17 — une neuvième remontée n'apprendrait rien |
| `CL3_APP_ADO_CIA_REGAP_D1` coupé entre le `_D` et le `1` dans une colonne trop étroite | la largeur vient du CONTENU, et une colonne qui porte du code est incompressible : le rabot ne tombe que sur la prose | **oui, mais déjà couvert** | même classe que ci-dessus ; la règle manquante — « une colonne portant un identifiant ne se rabote pas » — est versée en preuve à RT-17, dont elle montre la troisième récidive |
| Cinq liens de chapitre sur dix atterrissaient derrière un bandeau collant de 194 px pour une marge figée à 142 | la hauteur du bandeau est mesurée et publiée dans `--hh`, relue par les marges de défilement | non | défaut de mise en œuvre du produit ; le socle ne prescrit pas de marge de défilement chiffrée, et il a raison — elle dépend du bandeau |
| `data-mesure-lecture="840"` déclaré sur un conteneur rendu à 1 000 px | la valeur déclarée et la valeur rendue sont désormais la même, et c'est le jeton du socle : 1 080 px | **oui** | remonté **non** : le socle publie déjà son jeton E4 et sa mesure certifiée ; le produit avait simplement inventé un chiffre. Le fait est consigné ici pour qu'il ne se reproduise pas, sans charger le registre |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de `gabarits/documents/` sur ce lot — vérifié le
2026-09-16. Le livrable qui a reçu les retours est produit par un générateur propre au produit.
En revanche, **un gabarit du socle a été employé pour la première fois** :
`references/gabarit-revue-de-lecture.md`.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a gêné le lecteur | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `forge/travaux/REVUE-20260916a-guide-developpeur.md` | `gabarit-revue-de-lecture.md` — **sans numéro de version affiché** | le gabarit prescrit `--sections "<sélecteur>"` pour capturer chaque section ; sur une page à vues masquées, l'option ne rend **qu'une** capture — celle de la vue peinte. Les dix autres vues ne sont capturées par personne, et rien ne le dit | rien : la revue a été tenue, mais avec un harnais écrit à la main | un harnais Playwright de 40 lignes qui bascule `location.hash` et tuile chaque vue ; et la capture des huit schémas un par un | **générique** — toute page à vues, onglets ou panneaux masqués est concernée, et c'est précisément la forme que le socle recommande pour un document long |
| `Client-A - Guide développeur POC-to-Prod - 20260916a.html` | aucun — générateur propre au produit | aucun gabarit ne couvre un référentiel de règles à identifiants stables | sept défauts au premier coup d'œil sur l'indice précédent | le générateur entier, ses huit schémas, sa navigation, ses largeurs de colonne | générique — un gabarit « référentiel de règles » manque toujours à la bibliothèque, constat déjà porté le 15/09 |

**Retour de forme, pour la troisième fois** : ni `ECRITURE.md`, ni `RETOURS-FORGES.md`, ni
`gabarit-revue-de-lecture.md` n'affichent de numéro de version en en-tête, alors que la règle
R-46 demande de rattacher un retour à « la version affichée en en-tête du document ». Porté le
13/09 sur le gabarit de lot, le 15/09 sur le plancher d'écriture, et ici sur un gabarit du socle.

## Confirmations positives

- **Le partage mécanique / revue de lecture tient exactement ce qu'il annonce.** Les trois
  oracles n'ont laissé passer **aucun** défaut de leur périmètre : les sept défauts de
  `20260915c` relèvent tous de ce que le socle déclare non mécanisable, et la revue les a tous
  retrouvés. Le partage est juste ; c'est son **exécution** qui n'est pas opposable (RD-8).
- **Les lignes de `non_juge` de `render_page.py` ont servi deux fois** dans cette repasse :
  celle de V18 a fait rejouer la grille à 3 840 et 2 560 px — sans quoi la mesure de lecture
  n'aurait jamais été jugée —, et celle de V9 a évité de lire un silence comme un vert. Le
  correctif de `RD-2` (lot `20260915b`) est **vérifié en conditions réelles**.
- **Le plafond V18 de 135 caractères par ligne est le bon garde-fou.** Le destinataire demandait
  « plus de largeur pour le texte » ; le jeton E4 du socle (1 080 px, certifié à 134 caractères)
  a donné la réponse chiffrée et opposable, +29 % sur l'indice précédent, sans discussion.
