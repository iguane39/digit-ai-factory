# Gabarit — Tableau de bord de pilotage

**Famille** `gd-tableau-de-bord-pilotage` · **Version du gabarit** 1.0.0 · **Écrite le** 18/10/2026

> **Formats** HTML (page autoportante, calculée dans le navigateur)
> **Règles engagées** D1 D3 D4 D6 D7 D8 D9 D10 D11 (`gabarits\documents\README.md`)
> **Provenance** extraite du tableau de bord d'acquisition et de réservations refait par `Produit-79`
> (`Produit-79 - Dashboard - Acquisition et réservations - 20261017y.html` et ses trois versions
> suivantes, jusqu'à la 20261018s), après le refus en bloc de la 20261017s le 17/10/2026 : retour RP-15
> du lot `Produit-79 - RETOURS - 20261017c` (section « Documents mûrs »), étude d'opportunité
> `output\03-etudes\20261018-etude-opportunite-tableau-de-bord-pilotage.md`, option O4 décidée le
> 18/10/2026 (D-31 (a), TF-1855). Le gabarit reprend la forme, jamais la matière : aucun chiffre, aucune
> ligne de code et aucun libellé du produit n'y entrent.

## La règle qui commande toutes les autres

**Une commande recalcule toute la page, et aucun chiffre ne s'écrit à la main.** Les données vivent
dans un bloc déclaré (`tdb-donnees`), la page déclare ce que chaque tuile, graphique, tableau et bloc
de lecture en montre, et le moteur de la famille recalcule le tout à chaque changement de période, de
comparaison ou d'objet. *Un chiffre écrit dans une phrase est faux à la première commande* : le
17/10/2026, un coût de référence écrit à la main dans un texte de la page différait de la valeur que
portaient ses données, et la refonte l'a relié à la valeur calculée (lot 20261017c, remarques restées
au produit).

## Quand l'employer

Remettre à un exploitant la **page qui pilote une intention** : où en est-on, sur la période qu'il
choisit, comparée à la même période un an plus tôt, pour l'objet qu'il choisit, et que faire ensuite.
Ce n'est pas :

- un tableau de bord de **résultats de tests** (`dashboard-tests`, généré par forge-tests sous le nom
  « … - Dashboard tests - … ») ;
- un **rapport de données** (`rapport-de-donnees` : mapping, qualité, lineage) ;
- un **delta entre deux audits** (`tableau-bord-post-remediation`, chez forge-audit) ;
- un **suivi de bénéfices** annoncés au cadrage (`suivi-benefices`).

Le référentiel de restitution de forge-design décrit un « dashboard de suivi récurrent »
(`data-restitution="suivi"`) dont l'expérience visée est la détection de dérive : cette famille ne s'y
déclare pas, et son rapprochement reste une question ouverte (voir « Les manques déclarés de la
version 1.0.0 »).

## Structure — la cascade ISTO

La page se construit par la cascade de la loi transverse n° 7 (`references\INTENTION.md`) : un
chapitre par étage, dans l'ordre de la descente, chacun déclaré par `data-isto` sur sa `section.chap`.

| Étage | `data-isto` | Porte | Ne porte pas |
|---|---|---|---|
| Intention | `intention` | L'intention du lecteur, **citée** ; les décisions que la page prépare ; comment lire la page | Aucun chiffre |
| Stratégie | `strategie` | Le levier choisi, les chiffres de tête (tuiles), son graphique et son tableau | Le détail des moyens |
| Tactique | `tactique` | Un chapitre par moyen : son graphique, son bloc de lecture, son tableau | Les actions |
| Opération | `operation` | Les actions, chacune avec son objectif à échéance et sa formule | Une action sans objectif |
| Annexes | `annexe` | Sources, définitions des indicateurs, ce qui n'est pas mesuré | Un chiffre de période |

Les quatre étages sont dus, dans cet ordre ; plusieurs chapitres tactiques se suivent ; les annexes
ferment la page. Chaque chapitre ouvre comme le veut le socle : ce qu'il apprend (`.ch-apprend`), ce
qu'il contient (`.contenu`), ses termes (`.termes`) et, avant un tableau, un exemple de lecture.

*Le test rétro se lit sur la page* : chaque action du chapitre Opération nomme la tactique qu'elle
sert, chaque tactique sert la stratégie, et la stratégie répond à l'intention citée.

## Les commandes globales

Une barre de commandes, collante sur bureau, recalcule **toute** la page. Chacune porte son marqueur :

| Commande | Marqueur | Contrat |
|---|---|---|
| Période | `select[data-commande="periode"]` | Préréglages : 12, 6 et 3 derniers mois, chaque année des données, « personnalisée » |
| De, à | `select[data-commande="de"]`, `select[data-commande="a"]` | Un mois de début et un mois de fin ; un début après la fin se corrige seul |
| Comparaison | `select[data-commande="comparaison"]` | `un-an` (la même période un an plus tôt, par défaut) ou `precedente` (la période de même durée qui précède) |
| Objet | `[data-commande="objet"]` et un bouton `data-tdb-objet` par objet, plus `tout` | Dû dès que les données déclarent deux objets |
| Réinitialiser | `[data-commande="reinitialiser"]` | Rend la période de référence, la comparaison à un an et tous les objets |
| Bandeau | `[data-periode-lib]` | Dit en clair la période lue, sa comparaison et l'objet |

**L'objet** est ce que le lecteur pilote (un site, un établissement, une gamme). « Tout » additionne
les objets ; un chapitre propre à un objet le déclare (`data-objet="<id>"`, plusieurs ids séparés par
une espace) et se masque, avec son entrée de sommaire, quand le lecteur en choisit un autre.

## La comparaison

La comparaison par défaut est **la même période un an plus tôt** : elle neutralise la saison, ce que
la période précédente ne fait pas. Quand les données ne couvrent pas la période de comparaison, la page
le dit (« comparaison impossible : aucune donnée sur … ») et ne compare pas : jamais une comparaison à
une période partielle.

## L'entonnoir

Au moins un entonnoir, de trois étapes au moins, déclaré dans les données (`entonnoirs`) et dessiné
par le composant barres-empilées en barres horizontales. Chaque étape est **comprise dans la
précédente** : un taux de passage au-delà de 100 % dit un parcours mal construit. Le 17/10/2026, un
entonnoir rapportait des sessions à des clics, son taux de passage dépassait 100 %, et seul un œil l'a
vu ; l'oracle de la famille le refuse désormais (TBI3). Son tableau porte l'étape, l'effectif, le taux de passage et le taux depuis
la première étape.

## Les tableaux — total et part, ou motif

Chaque tableau dit s'il **découpe un total** :

- `data-partition="oui"` : ses lignes sont les parts d'un tout. Il porte une **ligne de total**
  (`tfoot`) et une **colonne de part** (`th data-colonne="part"`), que le moteur calcule ; le total
  vaut la somme des lignes et le tout recalculé, les parts font 100 % ;
- `data-partition="non"` : il n'est pas un découpage, et il le dit par son motif écrit
  (`data-partition-motif`, et la même phrase sous son titre, `.tdb-motif`).

Deux exceptions reviennent, et l'étude du 18/10/2026 les a relevées sur la page d'origine (2 tableaux
sur 15) : le tableau qui met **deux objets côte à côte** sur des mesures communes, et le **tableau des
objectifs**. Le tableau de l'entonnoir en est une troisième, par construction. Le tableau de données
qu'un graphique du socle porte sous lui est la vue de ce graphique, pas un tableau de la page.

## Les objectifs à échéance et leur formule

Chaque action du chapitre Opération porte un objectif **calculé**, jamais écrit :

- un **départ** : l'indicateur sur une période déclarée (`depart.de`, `depart.a`), sur 12 mois
  glissants le plus souvent ;
- un **sens** : `hausse` ou `baisse` ;
- une ou plusieurs **échéances** : un mois (`a`, au format AAAA-MM) et un taux ;
- la **formule**, rendue en clair dans la colonne Calcul : `départ × (1 + taux)` pour une hausse,
  `départ × (1 − taux)` pour une baisse.

Les objectifs partent de leur période de départ et **ne suivent pas** les commandes de la page : le
chapitre le dit. Un bloc de lecture peut prendre un objectif pour référence de son verdict
(`data-tdb-reference="objectif:<id>:<rang de l'échéance>"`) : il compare alors les 12 mois qui finissent
au dernier mois lu.

## Le bloc de lecture — un emplacement par graphique

À côté de chaque graphique, un bloc `div.lecture` (`data-lecture-de="<id du graphique>"`) porte cinq
rubriques, dans cet ordre : **Ce qui s'est passé**, **Pourquoi**, **Fiabilité**, **Verdict**, **À
faire**. Le refus du 17/10/2026 citait d'abord cela : « aucun graphique interprété ».

- *Calculé* : « ce qui s'est passé » (valeur, comparaison, écart), la couverture de « fiabilité »
  (mois mesurés), le **verdict** et sa référence nommée. Le verdict compare l'indicateur du bloc
  (`data-tdb-indicateur`) à sa référence (`data-tdb-reference`) au seuil déclaré (`data-tdb-seuil`) :
  `bon`, `moyen`, `mauvais`, ou `non jugeable` quand la référence manque.
- *Écrit* : la cause, la fiabilité de la source, l'action. Une cause s'écrit pour la **période de
  référence** des données (`reference`) et tous les objets ; dès que le lecteur en sort, le bloc le dit
  (« Cette cause est écrite pour … »).

**Ce n'est pas encore une règle.** L'oracle de la famille signale un graphique sans bloc complet en
avertissement (TB8), jamais en refus : la règle de lecture (TF-1856) attend sa porte de mesure, et sa
granularité (un bloc par graphique, ou aussi par tableau) n'est pas tranchée.

## Les graphiques passent par les composants du socle

Aucun graphique n'est dessiné à la main (règle L39 du socle) : tuiles d'indicateurs
(`tuiles-indicateurs`), barres empilées (`barres-empilees`, vertical par mois, horizontal par objet et
pour l'entonnoir) et infobulle (`infobulle`) sont **posés** par
`embarquer-composants.mjs --poser`, avec la feuille du gabarit (`boilerplate.css`). Le moteur leur
passe la donnée et ne dessine rien. Il ajoute deux gestes, sans toucher aux composants :

- la grille d'un graphique passe derrière ses barres, et le moteur déclare cette superposition par
  paires (`data-overlap-ok`, TF-1146) : à 390 px, le contrôle de rendu prenait une ligne de grille pour
  une liaison entre la première et la dernière barre ;
- le tableau de données d'un graphique se replie en cartes sous 900 px, comme ceux de la page (D3).

Une partition porte au plus six parts : c'est la limite du composant.

## Les données

Un seul bloc, `<script type="application/json" id="tdb-donnees">`, au schéma
`pilot/tableau-de-bord-pilotage@1` :

| Champ | Contenu |
|---|---|
| `mois` | Les mois couverts, contigus, au format AAAA-MM |
| `reference` | La période pour laquelle la prose est écrite ; c'est aussi la période affichée au chargement |
| `objets` | `[{id, libelle}]` ; `libelle_tout` nomme leur somme |
| `partitions` | `{id: {libelle, parts: [{id, libelle}]}}` |
| `series` | `{id: {partition?, format, valeurs}}` ; `valeurs` donne, par objet, un tableau d'une valeur par mois, et pour une série découpée (`partition`), d'abord la part puis l'objet |
| `indicateurs` | `{id: {libelle, serie, part?, format, sens}}` ou `{…, ratio: [numérateur, dénominateur]}` |
| `entonnoirs` | `{id: {libelle, etapes: [{libelle, court, indicateur}]}}` |
| `objectifs` | `[{id, action, indicateur, objet, depart, fenetre, sens, echeances: [{a, taux}]}]` |
| `donnees_fictives` | `true` pour une démonstration ou une amorce, et la page l'affiche (`data-donnees-fictives`) ; `false` sinon, et la mention disparaît |

3 règles de calcul, tenues par le moteur et recomptées par l'oracle : un **ratio** est le rapport
des SOMMES de la période, jamais la moyenne des ratios mensuels (D9) ; un mois sans valeur (`null`)
n'est **jamais un zéro**, il se compte dans la couverture ; une série absente pour un objet n'en fait
pas partie (« non mesuré pour cet objet »).

## Le moteur

Le moteur (`script data-moteur="gd-tableau-de-bord-pilotage" data-version="…"`) se corrige dans
`SQUELETTE.html` et se recopie à l'identique dans `INSTANCE.html` : la recette de l'oracle refuse un
écart entre les deux. Un document produit garde la version du moteur qu'il a copiée ; la monter est un
geste daté, consigné par le produit.

## Le nom du livrable

`<Marque> - Dashboard - <Objet du pilotage> - AAAAMMJJ<indice>.html`. « Dashboard » est au registre
des types d'organization ; le catalogue résout « dashboard » sur cette famille et garde
« dashboard tests » à `dashboard-tests`, le nom que le générateur de forge-tests écrit (G8).

## Les vocabulaires fermés

- `data-isto` : `intention` · `strategie` · `tactique` · `operation` · `annexe`.
- `data-partition` : `oui` · `non` (avec motif).
- `data-commande` : `periode` · `de` · `a` · `comparaison` · `objet` · `reinitialiser`.
- Comparaison : `un-an` · `precedente`.
- Format d'un indicateur : `nombre` · `euros` · `euros2` · `pourcent`.
- Sens d'un indicateur : `hausse` · `baisse` (favorable dans ce sens) · `neutre` (jamais jugé).
- Verdict : `bon` · `moyen` · `mauvais` · `non jugeable`.

## Le lecteur se déclare

```
role_destinataire: {qui pilote avec ce tableau de bord, et quelles décisions il lui demande}
```

Un premier document de cette famille est à **enjeu fort** au sens de la fiche de conception
(`gabarits\documents\FICHE-CONCEPTION.md`, § 6, condition 4 : famille neuve) : sa fiche se valide par
l'humain avant l'écriture.

## Avant de remettre

1. Les données sont celles du produit, `donnees_fictives` vaut `false` et la mention des données
   fictives a disparu.
2. Chaque `{…}` est rempli ; la cause de chaque bloc de lecture est écrite pour la période de
   référence.
3. `node <pilot>\oracles\oracle-tableau-de-bord-pilotage.mjs <page.html>` rend PASS : règles TB sur
   le fichier, règles TBI dans Chromium (chaque chiffre recompté à chaque état des commandes).
4. `check_html.py` puis `render_page.py` du socle, aux largeurs par défaut, en clair puis avec
   `--theme sombre`, et `--etats-ouverts` (D7).
5. La critique d'implémentation de forge-design par son point d'entrée :
   `node <forge-design>\oracles\run-oracles-design.mjs <page.html> --racine <forge-design> --rendu`.
6. La revue de lecture du socle, sur captures, dont un état de commande autre que celui du chargement.

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire`. Tout ce qui n'entre pas dans ses
décisions sort d'ici et vit dans le **document d'auteur** — un fichier distinct, tenu par celui qui
produit, cité en renvoi et jamais recopié :

- le **registre des arbitrages** encore ouverts, avec leur instance et leur état ;
- l'**historique des versions** du tableau de bord et des données qu'il a portées ;
- les **notes de production** : extractions, appels de source, scripts de génération, contrôles joués.

**La frontière est un critère d'ACTION, pas de confort.** Une information qui change ce que le
lecteur FAIT reste chez lui, même inconfortable : un mois non mesuré, une source qui compte un
plancher, une cause écrite pour une autre période. Une information qui ne change que ce que l'AUTEUR
doit encore obtenir part au document d'auteur.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*

## Oracles

- `oracle-tableau-de-bord-pilotage.mjs` du pilot — TB0 à TB9 sur le fichier, TB8 en avertissement ;
  TBI1 à TBI6 dans Chromium par `tableau-de-bord-pilotage-interactions.py`, TBI7 en avertissement ;
- `check_html.py` et `render_page.py` du socle `digit-ai-page-html`, dont L39 (graphiques hors
  composant) et V22 (canvas) ;
- `run-oracles-design.mjs` de forge-design, avec l'imputation des constats aux composants du socle ;
- `oracle-gabarits-documents.mjs` du pilot — G1 à G14 sur la famille, G8 sur le nom du livrable.

## Les manques déclarés de la version 1.0.0

- **La règle de lecture** (TF-1856) : la porte de l'étude O4 attend une page née de ce squelette et
  jugée, la granularité tranchée, le lieu tranché (socle ou forge-design) et une mesure de bruit sur
  les pages du parc.
- **Le SWOT détaillé et les recommandations à onze rubriques** de la page d'origine : ils faisaient
  partie des sept points du refus, mais ni le retour RP-15 ni la décision ne les portent.
- **La fiche de conception de l'instance** : l'instance prouve le squelette, elle n'est remise à
  personne.
- **Un export sans JavaScript** : la page calcule dans le navigateur ; l'impression du navigateur rend
  l'état affiché, un export PDF par WeasyPrint ne rend que l'état statique.
- **Le rapprochement avec le dashboard de suivi récurrent** du référentiel de restitution de
  forge-design (`data-restitution="suivi"`).

## Limites du jugement

L'oracle recompte chaque chiffre **depuis les données de la page** : il ne remonte pas à la source qui
les a remplies, et une série fausse à l'extraction passe. Il ne juge ni la cause ni l'action écrites.
Un état que ni les commandes ni les objets déclarés n'atteignent n'est pas rejoué.

## Boucle de retour

Le document produit porte `gabarit: gd-tableau-de-bord-pilotage` et sa version, **visiblement**, en
tête de page. Un retour sur la **forme** se remet au pilot, par la section « Retours sur les documents
produits » du lot (`gabarits\RETOURS-FORGES.md`) ; un retour sur le **fond** (quel indicateur, quel
objectif) reste au produit.
