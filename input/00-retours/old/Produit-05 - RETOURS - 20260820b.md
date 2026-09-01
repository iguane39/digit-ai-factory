# Retours forges — Produit-05 — 20260820b

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : seconde reprise du rapport HTML de synthèse Produit-05 (version `20260820c`),
  après une relecture client de vingt points sur la version `b`. Les corrections demandées
  portaient sur le détail à la demande (99 lignes dépliables ajoutées), le vocabulaire, la
  justesse des chiffres et plusieurs défauts d'interface. La production de cette version a
  révélé **sept limites d'outillage** que la version `b` n'avait pas rencontrées, parce
  qu'elle n'employait ni dépliants, ni état vide de filtre, ni sources embarquées.
- **Références ledger** : aucun ledger dans ce projet (run hors pilot, skills appelés depuis
  Claude Code). Pièces : `output/v2-architecture-cible/rapport/REVUE.md` §1 et §3,
  `rapport/old/…20260820b.html` (version précédente), `rapport/…20260820c.html` (livrée).
- **Lot précédent** : `Produit-05 - RETOURS - 20260820a.md`, statut `a_remettre` — non remis,
  donc non modifié : ce lot-ci est un fichier neuf, conformément à la règle.
- **Remise au pilot** : copier ce fichier et son sidecar `.tf.jsonl` dans
  `<pilot>\input\00-retours\`. **Remise soumise à validation humaine** (règle 18) : rien
  n'a été copié ni poussé.
- **Statut** : remis le 2026-08-20

**Numérotation** : le lot `20260820a` a consommé RD-1 à RD-5 et RA-1 à RA-3. Ce lot continue
en RD-6 à RD-12 et RA-4 à RA-5.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Vérification préalable.** Recherche faite avant rédaction : `composants.md` ne propose ni
composant de ligne dépliable, ni gestion de l'état vide d'un filtre ; `table-filters.js`
connaît pourtant déjà l'attribut `data-detail` — il l'emploie pour **exclure** ces lignes du
comptage, sans qu'aucun composant du catalogue ne les produise. La convention existe donc à
moitié : côté consommateur, pas côté producteur. C'est le sens de RD-9.

---

## forge-design (`digit-ai-forge-design`) — skills `digit-ai-page-html`, `digit-ai-schemas`

Sept retours, deux racines : **le composant de filtres n'est pas extensible** (RD-6 à RD-8), et
**trois règles se comprennent mal quand elles se déclenchent** (RD-10 à RD-12).

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RD-6 | **bloquant** | **`table-filters.js` n'expose aucun rappel après filtrage, et son instance n'est pas enveloppable.** `init()` retourne `{ appliquer, fermerTout }`, mais toutes les interactions internes — cases à cocher, boutons « Tous » et « Aucun », recherche — appellent la fonction `appliquer` **capturée dans la fermeture**, jamais `instance.appliquer`. Envelopper l'instance (`inst.appliquer = function () { original(); monTraitement(); }`) est donc **silencieusement sans effet** : le code s'exécute au premier appel manuel, puis plus jamais. Constaté en production sur ce livrable : le message « aucun résultat » était bien inséré dans le DOM (`textContent` correct, `colSpan` correct) mais restait `hidden: true` après un clic sur « Aucun », parce que le recalcul n'avait jamais lieu. Le défaut n'apparaît pas aux tests unitaires — seulement à l'usage. Contournement retenu : un `MutationObserver` sur `data-tf-hidden`, avec garde de réentrance. | Publier un point d'extension explicite. Le moins invasif : accepter `opts.apresFiltrage(table, visibles, total)` dans `init()` et l'appeler à la fin de la fonction interne `appliquer` — une ligne, rétrocompatible. Sinon, appeler `instance.appliquer` plutôt que la fonction locale, ce qui rend l'enveloppe possible. Sans l'un des deux, **tout traitement post-filtrage passe par un observateur de mutations**, c'est-à-dire par la surveillance d'un effet de bord plutôt que par un contrat. |
| RD-7 | majeur | **Aucun état vide : un filtre qui ne laisse rien produit un tableau sans un mot.** Le composant masque les lignes et met le compteur à zéro, mais ne dit rien dans le corps du tableau — qui devient un cadre de quelques pixels de haut, coincé entre l'en-tête et la légende. C'est un **défaut relevé par le client sur le livrable** : « le fait de cliquer sur aucun casse complètement l'affichage avec une barre verticale minuscule, inutilisable ». Le compteur passe pourtant bien à « 0 ligne sur 66 » en rouge : l'information existe, elle est simplement hors du regard du lecteur, qui regarde le tableau. | Une ligne d'état vide fournie par le composant, insérée et retirée par lui, avec un libellé par défaut surchargable (`data-tf-vide="…"`) : « aucune ligne ne correspond aux filtres actifs ». Complément utile : un bouton « tout réafficher » dans cette ligne, puisque c'est la seule action que le lecteur veut à ce moment-là. Fixture rouge disponible : un tableau filtrable où l'on décoche tout. |
| RD-8 | majeur | **Le panneau de filtre déborde de tout conteneur qui défile, et le panneau des dernières colonnes est coupé.** Le composant positionne son panneau en `position: absolute; left: 0` dans le `th`. Or `composants.md` prescrit d'envelopper les tableaux larges dans un conteneur `overflow-x: auto` — les deux se contredisent : le panneau ouvert **crée un ascenseur horizontal** (défaut relevé par le client : « fait apparaître un ascenseur horizontal, peu disgracieux »), et pour les dernières colonnes il sort du cadre visible. Contournement retenu : `left: auto; right: 0` sur les deux dernières colonnes, plus une classe basculée en JS qui passe le conteneur en `overflow: visible` tant qu'un panneau est ouvert. | Le composant devrait porter ces deux comportements lui-même : (a) choisir le côté d'ouverture selon la place disponible, mesurée à l'ouverture ; (b) neutraliser le rognage de son conteneur défilant pendant qu'un panneau est ouvert, et le rétablir à la fermeture. Les deux tiennent en une dizaine de lignes et évitent que chaque page les réinvente — mal. |
| RD-9 | majeur | **Pas de composant « ligne de tableau dépliable » au catalogue, alors que la convention existe déjà à moitié.** `table-filters.js` exclut explicitement `tr[data-detail]` de son comptage — la convention est donc **connue du consommateur** mais **aucun composant ne la produit**. Ce livrable a dû écrire de zéro : le balisage (bouton avec `aria-expanded` et `aria-controls`, ligne `tr.det[hidden]` avec `colspan`), le style du chevron, la bascule, l'ouverture forcée à l'impression, la synchronisation avec le filtrage (RD-6), et le dépliage automatique quand une ancre vise une ligne fermée. Soit ~40 lignes de JS et ~20 de CSS, pour un besoin qui se représentera à chaque tableau de référence : **99 lignes dépliables dans ce seul livrable**. | Ajouter le composant au catalogue, sur le modèle de `table-filters.js`, avec son oracle : tout bouton dépliant vise une ligne existante, toute ligne de détail a un bouton, le `colspan` couvre toutes les colonnes, et le contenu est visible à l'impression. Les trois derniers points sont exactement les contrôles que ce livrable a dû écrire lui-même dans son script d'assemblage. |
| RD-10 | mineur | **Collision de vocabulaire : `.note` est une classe de SCORE pour L3.** `check_html.py` définit `CL_SCORE = {"sc", "score", "note", "jauge"}` — « note » y est au sens d'une *note chiffrée*. Une carte d'encadré marquée `class="card note"` (« note » au sens de *remarque*, usage français courant et naturel) déclenche donc : `L3 valeur sans barème lié : « Des jalons internes pour prouver plus tôt » — aria-describedby vers la légende attendu`. Le message parle d'un barème pour un titre de paragraphe : **incompréhensible sans lire le code de l'oracle**, ce qu'il a fallu faire. Contournement : renommer la classe en `.card.encadre`. | Deux pistes, cumulables : (a) restreindre la détection aux classes non ambiguës (`sc`, `score`, `jauge`) et exiger `note` **combinée** à un chiffre dans le contenu ; (b) faire dire au message ce qui a déclenché la règle — « la classe `note` est lue comme une note chiffrée » — car c'est l'information qui manque pour corriger. Le socle gagnerait aussi à réserver et documenter `.card.note` comme classe d'encadré, puisque c'est le nom auquel tout le monde pense. |
| RD-11 | mineur | **L8 « lien interne muet » : le message n'indique pas la sortie la plus simple.** Vingt-deux échecs sur ce livrable, tous de la forme : `L8 lien interne muet : « H5 » → #q-h5 — libellé de 8 caractères nommant la cible, ou title/aria-label de 12 caractères.` Le cas est légitime et fréquent : un renvoi vers une question ouverte ou un chapitre numéroté s'écrit `H5` ou `1.5`, parce que c'est **ainsi que le document les nomme partout ailleurs** — l'allonger nuirait à la lecture. La sortie existe (un `title`), mais le message la présente comme une alternative de second rang, et ne dit pas qu'un `title` court suffit. | Reformuler : « ajoutez un `title` décrivant la cible (au moins 12 caractères) — le libellé visible peut rester court ». Et distinguer deux cas dans le message : un lien dont le libellé est un **identifiant du document** (`H5`, `E2`, `1.5`, `ADR 0022`) n'est pas muet pour son lecteur, il est simplement elliptique pour un lecteur d'écran — c'est le `title` qui règle cela, pas l'allongement du libellé. |
| RD-12 | mineur | **Aucun contrôle ne vérifie qu'un glyphe existe dans la pile de repli déclarée.** Le chevron des lignes dépliables était écrit `content: "\25B6"` (▶). Tous les oracles passent — `check_html` PASS, `render_page` PASS aux quatre largeurs, `run-oracles` sans écart sur ce point. À la lecture des captures **mobiles**, le glyphe s'affiche en tofu : la pile de repli mono (Consolas, faute de JetBrains Mono) n'a pas ce caractère. Il a fallu l'œil pour le voir, et le remplacer par `›` (U+203A), présent partout. À noter : le socle lui-même emploie `▸` et `▾` dans les exemples de `details/summary`, avec le même risque. | Un contrôle statique bon marché : lister les caractères employés en `content:` CSS et hors du plan multilingue de base, et **avertir** quand ils sortent d'une liste blanche de glyphes réputés présents dans les piles de repli déclarées (chevrons simples, guillemets, tirets, puces). Ce n'est pas un FAIL — c'est un « vérifiez ce glyphe sur un poste sans vos polices ». Et corriger les exemples du socle par la même occasion. |

## forge-agents (`digit-ai-forge-agents`) — skill `quality-oracles`

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-4 | majeur | **`oracle-slop` analyse le texte du document sans distinguer le contenu CITÉ de l'interface produite.** Ce livrable embarque douze documents sources en texte intégral, dans des blocs `<details><pre>` — c'est une exigence d'autoportance : un rapport qui renvoie à des fichiers du dépôt perd ses sources dès qu'il part par courriel. L'oracle signale alors : `emoji « ↔ » dans l'interface : utiliser une icône SVG dessinée`. Le caractère vient du registre des décisions, phrase « mapping contexte↔provider ». **Le corriger reviendrait à falsifier une citation** : c'est le seul écart de ce lot qu'il est *interdit* de corriger. Même mécanique attendue sur les futures pages embarquant des extraits de code ou de correspondance. | Exclure de l'analyse « interface » les zones explicitement marquées comme du contenu cité — `<pre>`, `<code>`, `<blockquote>`, ou un attribut dédié (`data-cite`) — comme le fait déjà la famille lisibilité pour certains contrôles. À défaut, un motif d'exemption étroit et déclaré, au niveau du fichier, sur la seule famille « emoji ». Le principe général : **un oracle de forme ne doit pas juger un texte que le livrable n'a pas écrit.** |
| RA-5 | mineur | **Le budget DOM ne distingue pas les nœuds d'interface des nœuds de contenu.** `oracle-perf` avertit à 6 000 nœuds ; ce livrable en compte 7 174, dont une part importante vient des 99 lignes de détail et des 12 sources embarquées — c'est-à-dire de la **valeur ajoutée demandée par le client**, pas d'une inflation de balisage. L'avertissement reste juste sur le fond (une page lourde reste une page lourde), mais il ne permet pas de distinguer « page mal construite » de « page riche assumée ». | Publier la métrique en deux temps dans le message : nœuds totaux, et nœuds hors zones repliées ou citées. Le seuil peut rester unique ; c'est le **diagnostic** qui gagne à séparer les deux, parce que les corrections diffèrent du tout au tout. |

## Confirmations positives

- **`render_page.py --etats-ouverts` a prouvé sa valeur** : c'est ce mode qui a permis de
  contrôler les panneaux de filtre et les dépliants ouverts, donc de valider un état que le
  rendu par défaut ne montre jamais. Sans lui, RD-8 serait passé en production.
- **L4 a attrapé un vrai manque** : le tableau des indicateurs (12 lignes) sans filtres. La
  bonne réponse était une exemption déclarée avec motif — le mécanisme
  `data-filterable="off"` + `data-filterable-reason` a fonctionné exactement comme prévu.
- **L1 a attrapé une ellipse réelle** : une puce se terminant par « … » qui masquait une
  énumération incomplète. Reformulée, pas exemptée.
- **L3 a eu raison sur le fond** dans tous les cas non ambigus : les indicateurs sans légende
  liée étaient effectivement illisibles pour qui n'a pas la méthode de calcul.
- **`oracle-claims`** : 82 affirmations chiffrées contrôlées et toutes rattachées à une
  source. C'est cet oracle, plus la discipline qu'il impose, qui a conduit à **recompter les
  chiffres à la source** — et à découvrir que trois annonces des livrables étaient fausses
  (31 capacités au lieu de 32, 204 ou 206 sous-capacités au lieu de 208).
- **`render_page.py` V1 et V2** ont attrapé quatre débordements réels à 390 px et sept
  contrastes insuffisants, tous corrigés à la source.
- **TF-0230** (captures hors de l'arbre de livraison) : respecté sans intervention.

## Ordre recommandé

1. **RD-6** — c'est la racine : sans point d'extension, toute page qui veut faire quelque
   chose après un filtrage doit surveiller des mutations du DOM. Une ligne de code côté
   composant supprime le problème pour tous les livrables à venir.
2. **RD-7** — défaut vu par un client sur un livrable ; correction courte, bénéfice immédiat
   sur toutes les pages à tableaux filtrables.
3. **RD-9** — le besoin est prouvé (99 occurrences sur un seul livrable) et la convention
   existe déjà à moitié dans le composant de filtres.
4. **RD-8** — contradiction entre deux prescriptions du même socle ; à trancher côté composant.
5. **RA-4** — c'est le seul écart de ce lot qu'on ne peut pas corriger sans falsifier une
   citation ; il se reproduira sur toute page embarquant ses sources.
6. **RD-10, RD-11** — deux messages d'oracle qui coûtent une lecture de code pour être
   compris ; corrections purement rédactionnelles.
7. **RD-12, RA-5** — confort et finesse de diagnostic.
