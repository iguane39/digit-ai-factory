# Retours forges — Produit-04 — 20260827b

- **Contexte** : relecture humaine du PDF de la fiche sécurité, le 27/08/2026. Le commanditaire a
  vu que la colonne des intitulés mangeait un tiers de la page pendant que la colonne de texte se
  serrait. Le défaut a été mesuré, corrigé, et **la question a été posée : pourquoi aucun oracle ne
  l'a vu ?** Ce lot répond à cette question, avec la mesure. Hors run.
- **Références ledger** : `forge\ledger.jsonl` — **aucune entrée `type: retour`**, et aucun ledger :
  ce produit n'a pas de run ouvert (écart déclaré au carnet, 27/08).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `digit-ai-factory\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-27

Convention de gravité : **bloquant** · **majeur** · **mineur**.
Préfixe d'identifiant : `RP-` pour le pilot (séquence continue du produit, `RP-3` au lot précédent),
`RA-` pour forge-audit, `RS-` pour le socle de rendu — ce dernier préfixe est **proposé** : le socle
n'est pas une forge, et aucune lettre ne lui était attribuée. Le pilot re-frappe les ids à l'ingestion.

---

## pilot (`digit-ai-factory`)

**Le fait qui donne son sujet à ce lot : la règle qui décrit ce défaut EXISTE, elle est classée
BLOQUANTE, et elle rend `PASS` sur le document fautif.** Ce n'est donc pas un manque de règle. C'est
une chaîne de trois maillons dont chacun est raisonnable isolément, et dont l'assemblage ne couvre
rien : le contrôle de rendu ne regarde pas les livrables des produits, l'oracle de gabarits exclut
les fiches, et la règle elle-même est aveugle au support employé. Corriger un seul des trois
donnerait une couverture de façade — c'est pourquoi ils sont remontés ensemble.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-4 | **majeur** | générique | **Le contrôle de rendu ne s'exécute JAMAIS sur un livrable de produit — il ne balaie que les instances de référence du pilot.** `scripts\verifier-rendu-instances.mjs`, écrit le 23/08 sur le constat qu'« un contrôle statique ne rend pas la page », porte en dur son périmètre : `const dossier = join(PILOT, "gabarits", "documents")`, puis `INSTANCE.html` de chaque famille. Aucun chemin d'un `output\` de produit n'y entre, et aucun contrôle équivalent n'existe côté produit. Conséquence : **tout ce que le socle de rendu sait mesurer — contraste, débordement, chevauchement, largeurs L2 — n'est jamais mesuré sur ce qui est réellement REMIS à un lecteur.** Les instances de référence sont vertes ; les livrables ne sont pas jugés. La capacité est là depuis quatre jours et elle ne regarde que le catalogue, jamais la production. | Un point d'entrée rendant le contrôle exécutable sur un dossier arbitraire — `node scripts\verifier-rendu-instances.mjs <dossier>` — et, mieux, un contrôle destiné aux produits qui prenne leur `output\`. Le produit peut alors le jouer dans la passe qui produit le livrable, ce qui est le seul moment où le résultat sert à quelque chose. |
| RP-5 | **majeur** | générique | **Les FICHES sont explicitement hors du périmètre de l'oracle de gabarits, et rien d'autre ne les reprend.** `oracles\oracle-gabarits-documents.mjs` déclare son `non_juge`, mot pour mot : « les familles de gabarit hors `gabarits\documents\` (**fiches**, prompts, squelettes de forge) ». Le gabarit de la fiche sécurité de mise à disposition est précisément une fiche, portée par `digit-ai-forge-audit`. L'exclusion est honnête et assumée ; le problème est qu'aucun autre contrôle ne la rattrape, si bien qu'un gabarit de fiche n'est jugé par RIEN — ni sur sa forme, ni sur son rendu. Or une fiche sécurité est lue par un RSSI : c'est un des documents les plus exposés de l'écosystème. | Soit étendre le périmètre aux familles de fiches, soit — plus honnête si l'exclusion doit rester — **déclarer nommément qui les juge**. Un `non_juge` qui renvoie vers un contrôle nommé est une frontière ; un `non_juge` qui ne renvoie nulle part est un trou avec une étiquette dessus. Le même raisonnement vaut pour « prompts » et « squelettes de forge ». |

## socle de rendu (`digit-ai-page-html`)

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RS-1 | **bloquant** | générique | **`l2_gouttiere` décrit EXACTEMENT ce défaut, au seuil exact, et ne le voit pas — parce qu'elle ne regarde que les grilles CSS.** La famille est déclarée par le socle : `"l2_gouttiere": {"libelle": "L2 gouttière d'étiquettes", "severite": "bloquant"}`, seuil `L2_COL_MAX = 0.20`. Son commentaire décrit notre cas au mot près : « une grille `etiquette \| contenu` où la colonne d'etiquettes prend 22 % de la largeur […] le lecteur voit un tiers de page vide et un contenu tassé à droite ». MAIS son implémentation commence par `if (cs.display !== 'grid' && cs.display !== 'inline-grid') continue;`, et son commentaire assume l'exclusion : « un vrai tableau de données n'est pas une grille CSS et n'y entre jamais ». Or **une mise en page `intitulé \| contenu` en `<table>` n'est pas un tableau de données** — c'est la même intention, exprimée avec l'autre outil. PREUVE, exécutée le 27/08 : `python render_page.py "<fiche à 32 %>" --widths 1440` rend **`verdict : PASS`, `l2_gouttiere : 0 constat`** sur le document que la règle est faite pour condamner. La règle n'a pas échoué : elle n'a pas été appelée, et rien ne le disait. | Faire entrer les mises en page `<table>` à deux colonnes dans `l2_gouttiere`, avec les MÊMES garde-fous qui protègent déjà des faux positifs (première cellule courte, seconde cellule longue) — ces garde-fous suffisent à écarter un vrai tableau de données, où les deux colonnes portent des valeurs comparables. Mesurer alors la largeur de la première colonne rendue plutôt que la piste de grille. Le seuil de 0,20 n'a pas à bouger : il est juste, et cette remontée en apporte une confirmation indépendante (cf. CP-1). |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - CAL - Fiche Sécurité Mise à disposition - Dev - 20260827c` (html + pdf) | `gd-fiche-securite` · gabarit Client-A `20260710a` | **Le gabarit posait `td.k{width:32%}` sur une colonne d'intitulés courts** (« Nom », « Tags », « Budget anticipé ») pendant que la colonne de droite porte des paragraphes entiers. Mesuré avant correction : **12,6 % à 19,4 % de la largeur de page gaspillés sur 7 tables sur 8**. Une seule contrainte réelle, « Confidentialité / Intégrité / Disponibilité », qui exigeait 27 %. Le gabarit ne posait pas non plus `table-layout:fixed` : la largeur déclarée n'était donc qu'un vœu, le moteur ré-élargissant la colonne dès qu'un libellé s'allonge | Le commanditaire a ouvert le PDF et demandé de réduire la première colonne « afin de laisser plus d'espace pour la largeur de la deuxième colonne qui contient plus de texte ». Le défaut avait traversé **deux fiches livrées et trois régénérations** sans que rien ne le signale | `td.k{width:20%}`, `table{table-layout:fixed}`, `td.v{overflow-wrap:break-word}` — dans un gabarit **nouveau et daté** (`20260827a`), le `20260710a` restant intact. Résultat mesuré : gaspillage ramené à 0,6–7,4 %, **68 % → 80 % de largeur rendue au texte**, sans débordement (`scrollWidth == clientWidth`) | **générique** — c'est la mise en page de la famille, pas celle de ce produit |
| idem | idem | Le gabarit n'est pas daté dans son emploi : rien n'obligeait à en créer une nouvelle version pour le corriger, et le réflexe naturel est de l'éditer en place | Non observé — anticipé par le produit | Le gabarit corrigé est sorti en `20260827a` plutôt qu'en réécriture de `20260710a` : **un gabarit est un livrable, il suit la règle 5** | **générique** |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le contrôle de rendu du produit ne vérifiait que le FORMAT du support | `generer-pdf.mjs` relit `/MediaBox` et compte `/Type /Page` : A4, portrait, nombre de pages. C'est utile et ça reste. Mais un document peut être parfaitement A4, tenir en trois pages, et gaspiller 15 % de sa largeur à chaque ligne | **oui** | La CLASSE est remontée en RP-4 et RS-1. Le constat général — *les dimensions du support ne disent rien de l'emploi qu'on en fait* — vaut pour tout contrôle de rendu qui s'arrête au format |
| Aucun contrôle typographique ne s'exécutait dans la passe de génération | Écriture de `forge\etapes\audit\oracle-mise-en-page.mjs` : mesure, dans le moteur de rendu du poste, l'écart entre largeur RÉSERVÉE et largeur EXIGÉE, chiffre le gaspillage, et RECOMMANDE la largeur juste. Câblé dans la même passe que la génération, **y compris sur le chemin « rien à générer »** — un contrôle qu'une passe à vide fait taire ne protège que les jours où l'on produit du neuf | **partiellement** | L'implémentation reste au produit et **devrait devenir inutile** : si RS-1 est retenu, le socle couvre le cas et cet oracle local fait double emploi. Il est écrit pour tenir l'intervalle, pas pour durer. Ce qui se généralise n'est pas ce code, c'est le fait qu'il ait fallu l'écrire |
| L'oracle local recommande une largeur par le 75e centile des besoins | Ni la moyenne (elle laisse déborder la moitié des intitulés), ni le maximum (un seul libellé exceptionnel imposerait sa loi au document — c'est le mécanisme même qui a produit les 32 %) | non | Détail d'implémentation. Mentionné parce qu'il produit **20 %**, la valeur que le socle prescrit déjà : deux chemins indépendants, un seul nombre. C'est ce qui donne confiance dans le seuil, pas dans le code |

## Confirmations positives

- **CP-1 — le seuil `L2_COL_MAX = 0.20` du socle est confirmé par un chemin indépendant.** Ce
  produit a mesuré les besoins réels de sa colonne d'intitulés sans connaître ce seuil, et en a
  dérivé une recommandation par le 75e centile : **20 %**. Le socle prescrit 0,20. Deux méthodes
  sans lien, le même nombre. Le seuil n'a pas à être rediscuté quand RS-1 sera instruit — seule sa
  portée doit l'être.
- **CP-2 — l'allocateur d'indice, livré le matin même (lot `20260827a`, RP-2), a tenu à sa première
  vraie sollicitation.** La correction de mise en page a produit `20260827c` sans toucher à `a` ni à
  `b`, et une re-exécution à contenu inchangé n'a rien créé. Le défaut d'écrasement remonté ce matin
  ne s'est pas reproduit l'après-midi, alors que la journée a vu **trois** versions de la fiche.
- **CP-3 — le garde-fou de fraîcheur du PDF (RA-2, lot `20260822a`) a servi une seconde fois.** Il
  avait bloqué un tirage verrouillé à 16:24 ; le changement d'indice a résolu le blocage sans qu'il
  faille désactiver le contrôle. Un garde-fou qu'on contourne en le désactivant ne vaut rien ; ici,
  la voie normale l'a satisfait.

## Ordre recommandé

1. **RS-1 d'abord**, et sans hésitation. C'est le seul des trois dont la correction protège
   **immédiatement tout l'écosystème** : la règle, le seuil et les garde-fous anti-faux-positifs
   existent déjà, il ne manque qu'un support. C'est aussi le moins risqué — étendre une famille
   déjà classée bloquante, dont personne ne conteste le bien-fondé.
2. **RP-4 ensuite.** Sans lui, RS-1 ne protège toujours que les instances de référence du pilot :
   la règle verrait le défaut, mais personne ne la jouerait sur un livrable remis. Les deux
   ensemble ferment la boucle ; l'un sans l'autre donne une couverture de façade.
3. **RP-5 en dernier**, ou traité comme une clarification plutôt que comme un développement : si
   RP-4 aboutit, un gabarit de fiche est rendu comme les autres, et le `non_juge` n'a plus qu'à dire
   vers quoi il renvoie.
4. Le retour sur le gabarit `gd-fiche-securite` (section « documents produits ») est **applicable
   immédiatement et indépendamment** : les trois lignes de CSS sont écrites, mesurées et vérifiées.
   Rien n'oblige à attendre RS-1 pour en faire bénéficier les autres produits.
