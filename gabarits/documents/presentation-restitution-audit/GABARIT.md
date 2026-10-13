# Gabarit — Présentation de restitution d'audit (points bloquants)

**Famille** `gd-presentation-restitution-audit` · **Version du gabarit** 1.0.0 · **Écrite le** 13/10/2026

> **Formats** Markdown (trame, une diapositive par section) · PowerPoint (rendu remis)
> **Règles engagées** D1 D6 D11 (`gabarits\documents\README.md`)
> **Provenance** le besoin remonté par `Produit-68` le 24/09/2026 (lot `Produit-68 - RETOURS -
> 20260926a`, RP-61, TF-1389) : présenter les points bloquants d'un audit, un par diapositive, avec
> titre, synthèse du problème, criticité et effort, risques et impacts, solution. La forme voisine,
> `gd-presentation-autorite`, porte la décision de mise en production en huit diapositives et vit chez
> `digit-ai-forge-audit` ; elle ne couvre pas ce besoin (voir la frontière ci-dessous).

## La règle qui commande toutes les autres

**Une diapositive ne dit rien que le rapport d'audit n'établisse.** Chaque point bloquant renvoie au
constat du rapport par son identifiant ; sa criticité est celle du rapport, recopiée et jamais
réévaluée pour la présentation ; son effort est celui du plan de remédiation. *Une présentation qui
requalifie une criticité devient un second rapport, plus court et moins prouvé, que l'auditeur
défendra seul en séance.*

## Quand l'employer

Restituer à l'équipe auditée, ou à son commanditaire, **les points qui bloquent** et ce qu'il faut
faire pour les lever : la séance de restitution qui suit un audit, avant ou après la décision de mise en
production. Le livrable se nomme « Note de présentation » ou « Présentation de restitution » : ces deux
noms sont résolus par `oracle-gabarits-documents` (G8) sur cette famille.

**Frontière avec `gd-presentation-autorite`.** Celle-ci porte la **décision** (go, go sous réserve,
no-go) devant l'instance qui la prend : huit diapositives, trois risques, une décision demandée. Cette
famille-ci porte le **recensement** des bloquants devant ceux qui les lèvent : autant de diapositives
que de points, cinq zones identiques. Les deux se complètent et ne se mélangent pas dans un même
fichier : l'une demande une décision, l'autre prépare le travail.

## Structure — la trame est due

La trame suit l'ordre d'une séance : ce que l'audit conclut, la vue d'ensemble, chaque point, l'ordre
de traitement, ce qui est demandé. Le titre de la diapositive (`## n · …`) est celui que lit le
générateur de support (`digit-ai-pptx`) ; la trame vaut pour tout rendu.

| # | Diapositive | Porte | Ne porte pas |
|---|---|---|---|
| 1 | **Titre** | Marque, objet de l'audit, date, présentateur | Aucune conclusion |
| 2 | **Ce que l'audit conclut** | Le verdict du rapport en une phrase, le nombre de points bloquants, le périmètre audité | Le détail d'un point |
| 3 | **Vue d'ensemble** | Un tableau : identifiant, titre, criticité, effort, une ligne par point | La solution d'un point |
| 4 à 3+N | **Un point bloquant par diapositive** | Les cinq zones, dans l'ordre fixe ci-dessous | Deux points sur la même diapositive |
| 4+N | **Ordre de traitement** | L'ordre proposé de levée, avec la raison de l'ordre | Une date : l'ordre n'est pas un planning |
| 5+N | **Décisions attendues** | Ce que l'assistance doit trancher en séance, une ligne par décision | Une décision déjà prise |

### Les cinq zones d'une diapositive de point bloquant

Elles sont **toujours les mêmes, dans le même ordre**, pour que la salle sache où chercher dès la
deuxième diapositive. La répétition est voulue : c'est elle qui permet de comparer deux points.

1. **Titre** — le problème en une phrase affirmative (« Les sauvegardes ne sont jamais restaurées »),
   pas le nom d'une dimension de l'audit.
2. **Synthèse du problème** — ce qui a été constaté, avec le renvoi au constat du rapport.
3. **Criticité et effort** — la criticité du rapport, puis l'effort en complexité × durée (règle E8 :
   jamais en jours).
4. **Risques et impacts** — ce qui arrive si le point n'est pas levé, pour qui, et à quel endroit du
   produit.
5. **Solution** — le geste de levée et ce qui prouvera qu'il est fait (le critère de clôture).

## Les vocabulaires fermés

- **Criticité** : celle du rapport d'audit, dans ses mots. La famille n'en définit aucune échelle.
- **Effort** : `simple` · `moyen` · `complexe` pour la complexité, `court` · `moyen` · `long` pour la
  durée, écrits « complexité × durée » (ex. `moyen × court`). Jamais de jours-hommes.
- **Renvoi** : l'identifiant du constat dans le rapport (`D07-C3`), et le nom du rapport avec son
  indice daté. Un point sans renvoi ne figure pas.

## Les refus de ce gabarit

- **Un point sans renvoi au rapport.** C'est le seul refus qui fait exister cette famille : sans lui, la
  présentation porte des constats que personne n'a prouvés.
- **Une criticité reclassée.** Un point jugé « majeur » au rapport ne devient pas « critique » pour
  appuyer la séance ; si la criticité est discutable, le rapport se corrige d'abord.
- **Un effort en jours.** Complexité et durée, la règle de conversion écrite au rapport (E8).
- **Un point à deux solutions sans choix.** Une diapositive propose la solution retenue ; les options
  écartées vivent au rapport.
- **Plus de cinq zones.** Une sixième zone est un second sujet : il prend sa diapositive.
- **Des titres interchangeables** (D6) : « Point 1 », « Point 2 » ne disent rien à qui parcourt le
  support.

## Le lecteur se déclare

Tout document tiré de ce gabarit déclare son lecteur en tête, frontmatter en `md` :

```
role_destinataire: {qui assiste à la restitution, et ce qu'il lève ou décide à l'issue}
```

## Avant de remettre

1. Chaque point a son renvoi, et chaque renvoi se retrouve dans le rapport d'audit nommé.
2. Le nombre de points du tableau de la diapositive 3 égale le nombre de diapositives de point.
3. Aucun `{…}` restant.
4. Le support PowerPoint est rendu par `digit-ai-pptx` depuis la trame, puis son paquet est jugé par
   `scripts\verifier-ooxml.py` du pilot.

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire`. Tout ce qui n'entre pas
dans ses décisions sort d'ici et vit dans le **document d'auteur** — un fichier distinct, tenu par
celui qui produit, cité en renvoi et jamais recopié :

- le **registre des arbitrages** encore ouverts, avec leur instance et leur état ;
- l'**historique des versions** du document et son statut de relecture ;
- les **notes de production** : sources à confirmer, sections à reprendre, questions à l'auteur.

**La frontière est un critère d'ACTION, pas de confort.** Une information qui change ce que le
lecteur FAIT reste chez lui, même quand elle est inconfortable : « cette règle n'est pas encore
opposable, appliquez-la et signalez tout écart » appartient au document du lecteur, parce qu'un
lecteur doit savoir sur quoi il s'engage. Une information qui ne change que ce que l'AUTEUR doit
encore obtenir part au document d'auteur. Le doute utile au lecteur se dit à l'endroit qui le
concerne ; le doute de l'auteur ne le suit pas.

**Un document long se découpe en VUES d'un fichier unique, pas en fichiers**, sauf demande
contraire de son lecteur : 11 fichiers à partager sont un coût pour lui, jamais pour son auteur.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*

## Oracles

- `oracle-gabarits-documents.mjs` du pilot — G1 (trame et instance), G2 (instance remplie), G4 (le
  couple `gabarit` / version rendu), G8 (le nom du livrable résout sa famille), G10, G13 ;
- `oracle-ecriture.mjs` du pilot sur la trame et l'instance (tournures d'annonce en titre, EC-8) ;
- `scripts\verifier-ooxml.py` du pilot sur le PowerPoint remis : validité du paquet ;
- pour le **rendu** : les contrôles propres à `digit-ai-pptx` (polices embarquées, charte).

## Limites du jugement

**Le rendu visuel des diapositives.** L'instance de cette famille est une trame Markdown : aucun
PowerPoint n'est versionné ici, donc ni la lisibilité d'une diapositive ni le débordement d'un texte
ne sont jugés par cette famille. Ils relèvent de `digit-ai-pptx` au moment du rendu. **Que le renvoi
dise vrai** : l'identifiant de constat est présent ; qu'il pointe un constat qui établit ce que la
diapositive affirme se vérifie à la lecture du rapport, pas par un oracle.

## Boucle de retour

Le document produit porte `gabarit: gd-presentation-restitution-audit` et sa version, en tête de la
trame et au pied de la dernière diapositive. Un retour sur la **forme** se remet au pilot, par la
section « Retours sur les documents produits » du lot (`gabarits\RETOURS-FORGES.md`) ; un retour sur le
**fond** — quelle criticité, quel effort — se remet à `digit-ai-forge-audit`.
