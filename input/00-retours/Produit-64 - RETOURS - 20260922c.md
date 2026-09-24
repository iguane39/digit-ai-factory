# Lot de retours — Produit-64 → digit-ai-factory — 2026-09-22, indice c

**Émetteur** : produit `Produit-64` · **Cible** : le pilot `digit-ai-factory`
(`oracles/oracle-synthese.mjs`) · **Origine** : deux faux positifs de règles BLOQUANTES rencontrés
en écrivant la restitution de la maquette de lecture du guide du développeur.

Ce lot porte **2 retours**.

- **Contexte** : session de production d'une maquette de forme sur le guide du développeur Client-A,
  22/09/2026. Hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

Les deux retours visent le même module, `oracles/oracle-synthese.mjs`, et la même mécanique : une
règle qui lit du Markdown **ligne par ligne** et traite un simple retour à la ligne comme une
frontière de structure. Dans les deux cas, le document était conforme et le verdict a été rouge.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-20 | majeur | générique | `decisionsDuBloc()` ouvre un nouveau segment de décision sur **toute** ligne de citation dont le texte commence par un nombre, y compris quand cette ligne n'est que le **repli** de la phrase précédente. Mesuré le 22/09 : dans un bloc 3 conforme, la ligne `> **171** paragraphes ; s'arrêter au CSS…` — repli de la phrase ouverte deux lignes plus haut — a satisfait `RE_TETE_CITATION` (ligne 417), ouvert un segment dont la tête est « 171 paragraphes », et **capté le tableau des options** qui suivait. Le segment usurpateur portant `(a)`, il est devenu la seule entrée de `groupesDecisions` (ligne 1611), et la décision réelle `D-1` a disparu du jugement : **S30 FAIL** « 1 décision sur 1 SANS NUMÉRO » et **S16 FAIL** « posée sans trace d'instruction », sur une décision qui porte `> **D-1 — …**`, sa recommandation, sa source citée et son tableau à trois options. Seul remède trouvé : **replier la phrase autrement** pour que le nombre ne tombe pas en début de ligne | Un segment ne s'ouvre que sur une ligne **précédée d'une ligne vide** (ou de la première ligne du bloc) — une tête de décision est toujours en tête de paragraphe, jamais au milieu d'un. Règle qui aurait évité le retour : aucune — c'est un défaut d'implémentation, pas de doctrine, et la classe `oracle-faux-positif` le couvre déjà |
| RT-21 | mineur | générique | `estGlose()` (ligne 1780) lit ce qui suit **immédiatement** le désignateur et attend `(`, `—`, `:`, `pour`, `désigne` ou `c'est`. Un désignateur écrit entre accents graves — la forme que le reste du socle prescrit pour un identifiant — présente un backtick de fermeture avant sa parenthèse : `` `RAF-073` (entrée du registre…) `` n'est **pas** reconnue comme glosée, et **S23 FAIL**. Mesuré le 22/09 : gloser 2 désignateurs correctement a exigé de **retirer leurs accents graves**, c'est-à-dire de dégrader la citation pour satisfaire la règle qui la juge | Faire sauter à `estGlose()` un éventuel backtick de fermeture avant de chercher l'amorce de glose — un caractère à ajouter à la classe déjà tolérée. Règle qui aurait évité le retour : aucune ; c'est le pendant, côté glose, de ce que TF-0992 a déjà corrigé pour S37 (« un fragment entre accents graves est une citation ») — la leçon n'a pas été portée jusqu'ici |

## Remarques restées au produit

- La porte `tools/verifier-revue-de-lecture.mjs` **de ce produit** indexe les revues de lecture sur
  l'indice de jour (`AAAAMMJJ<lettre>`) et non sur le nom du livrable : deux livrables HTML
  d'objets différents sortis le même jour sous le même indice ne peuvent pas avoir chacun leur
  revue. Corrigé chez nous par contournement — le livrable a pris l'indice `c` —, et consigné en
  `RAF-074` pour correction. **Généralisable : non** — cet outil est écrit par ce produit et ne
  vient d'aucun gabarit de forge ; le pilot n'a pas d'équivalent.
- Le guide du développeur a reçu **3 indices le même jour** (`20260922a`, `b`, puis la maquette en
  `c`), ce qui rend la lecture de `output/05-Kits/` dépendante du README pour savoir lequel fait
  foi. **Généralisable : non** — la convention R-4 prévoit l'indice, et c'est le rythme de ce
  produit qui est inhabituel, pas la convention.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot — la maquette, sa revue de
lecture et la restitution sont écrites depuis les gabarits du socle `digit-ai-page-html` et de
`RESTITUTION.md`, qui ne sont pas des familles de `gabarits/documents/`.

## Confirmations positives

- **`oracle-synthese` a attrapé 6 autres défauts réels** sur cette même restitution — S5 (2 restes
  sans motif, parce que le motif vivait dans une sous-puce lue comme un élément à part), S14
  (3 actions sur 4 sans identifiant de registre), S19 (4 actions sans conséquence de non-action),
  S37, S45 et EC-9. Aucun n'était un faux positif, et chacun portait le geste qui répare. Les
  2 retours ci-dessus portent sur des angles morts, pas sur la valeur de l'outil.
- **La jonction en-tête + ligne pour les tableaux du bloc 8** (TF-0508) a tenu : renommer une
  colonne en « Si elle n'est pas faite » a suffi à satisfaire S19 sur les 4 lignes, sans recopier
  la locution dans chaque cellule. C'est exactement ce que le correctif du 22/08 promettait.
- **`check_html`, `render_page` et les 7 oracles de `digit-ai-forge-design`** ont trouvé, sur une
  page écrite avec soin, 3 bloquants S1, 13 écarts T3, 1 L19, 1 L21, 6 L7, 1 L3, 1 L25, 9 V18 et
  4 V1 — tous réels. La page remise est PASS aux trois.

## Ordre recommandé

1. **RT-20** d'abord : il rend rouges deux règles bloquantes sur un document conforme, et le seul
   contournement est de reformuler une phrase juste. Le correctif tient en une condition.
2. **RT-21** ensuite : il coûte une dégradation de citation, pas un blocage.

## La règle qui aurait évité le retour (TF-0779)

Aucun des 2 retours ne suit un retour humain : les 2 viennent d'un oracle exécuté, sur un document
que son auteur croyait conforme et qui l'était. La règle générale qui les couvre existe déjà —
classe `oracle-faux-positif`, « un oracle rend rouge sur un artefact conforme : le verdict opposé
cesse d'être prononçable, et l'auteur apprend à ignorer le juge ». Ce que ces 2 cas ajoutent est
une **cause commune**, qui mériterait d'être écrite au socle des oracles de forme : *une règle qui
lit du Markdown ne traite jamais un retour à la ligne comme une frontière de structure — une
frontière de paragraphe est une ligne VIDE, et une citation entre accents graves est un fragment,
jamais une position*. TF-0992 l'a déjà établi pour S37 le 16/09 ; il n'a pas été porté aux autres
règles du même fichier.
