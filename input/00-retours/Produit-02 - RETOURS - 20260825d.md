# Retours forges — une recherche à source unique, et un angle mort linguistique — 20260825d

- **Contexte** : demande de l'exploitant après une recherche que j'ai menée pour savoir si les
  visiteurs anglophones, germanophones et néerlandophones cherchent réellement le mot
  « gîte » dans leur langue. J'ai conclu sur **une seule source**, Google Suggest, dont le
  biais principal m'a d'abord échappé — et qui a failli produire une recommandation inverse
  de ce qu'il fallait. L'exploitant demande qu'une recherche de ce type croise deux à trois
  sources, et que ce type d'analyse entre dans `forge-seo-geo`.
- **Références** : session du 25/08/2026 ; `seo/donnees/gsc/` du projet ; sondes Google
  Suggest et Google Trends. Lots précédents : `20260823c` à `20260825c`.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qu'une source unique a produit

Ce chapitre expose le mécanisme avant la règle, parce que le cas est instructif : la sonde
fonctionnait, les données étaient réelles, et la conclusion aurait été fausse.

Interrogeant Google Suggest langue par langue, j'obtiens que **« gite » est le terme le plus
suggéré dans les six langues étrangères** — jusqu'à dix complétions en italien, le score le
plus élevé du test. Lu seul, ce résultat dit « gardez gîte partout ».

Deux biais l'invalident, et aucun n'est visible dans la donnée elle-même.

- **Le paramètre `hl=` fixe la langue d'interface, pas le pays du chercheur.** « Gîte »
  domine parce que la requête française domine cet espace de recherche mondialement — pas
  parce qu'un Allemand tape ce mot.
- **En italien, « gite » est un homographe au sens opposé** : pluriel de *gita*, une sortie,
  une excursion. Les complétions le disent — `gite organizzate mont saint michel`,
  `gite in giornata da parigi`, `gite in barca da bonifacio`. Un Italien qui tape ce mot
  cherche un autocar, pas une nuitée. Le score le plus élevé du test mesurait **l'inverse du
  produit**.

La seconde source disponible — l'export Search Console du projet — était par ailleurs
**structurellement muette** sur la question : elle vient de l'ancien site, uniquement en
français, qui ne pouvait pas se positionner sur `Ferienhaus`. Zéro occurrence n'y prouve
rien. Le reconnaître fait partie du croisement.

## Les deux retours

Le premier porte sur la méthode de recherche, le second sur ce que la forge SEO-GEO ne
couvre pas.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-32 | majeur | **Une recherche a produit une recommandation sur une source unique, dont le biais n'était pas décelable dans la donnée.** Google Suggest a rendu un classement cohérent, exploitable, et trompeur : `hl=` ne géolocalise pas, et un homographe italien inversait le sens du meilleur score. Aucun de ces deux biais n'apparaît dans la réponse de l'API — ils demandent de savoir ce que la sonde mesure. La donnée n'était ni fausse ni partielle : elle **répondait à une autre question**, ce qui est la variante remontée en RT-30 le même jour. | Règle de socle pour toute recherche fondant une recommandation : **deux à trois sources de nature différente, et la nature de chacune déclarée**. Ici : Suggest (complétions, sans volume, sans géolocalisation), Search Console du projet (trafic réel mais borné à ce que le site couvre déjà), Keyword Planner ou équivalent (volumes géolocalisés, sous compte). Une source qui ne peut pas répondre se **nomme comme telle** au lieu d'être omise — un « zéro occurrence » sur un site qui n'a pas ce contenu n'est pas un signal. Livrable type : un tableau source × ce qu'elle mesure × ce qu'elle ne peut pas mesurer, avant toute conclusion. |
| RT-33 | majeur | **`forge-seo-geo` ne porte aucun nœud d'analyse lexicale par langue.** Sa grille de 88 nœuds traite le multilingue sous l'angle technique — `hreflang`, canoniques, sitemap, parité des routes — tous conformes sur ce projet. Aucun ne demande si le **vocabulaire employé est celui que le marché cible utilise**. Défaut mesuré ici : la page allemande dit **8 fois « Gîte » et jamais « Ferienhaus »** ; l'italienne emploie un mot qui désigne des excursions. Techniquement irréprochable, commercialement muet — le site est correctement traduit et cherche des visiteurs avec un mot qu'ils ne tapent pas. | Un nœud « adéquation lexicale par marché », à instrumenter comme les autres : pour chaque locale servie, confronter le vocabulaire du `title`, du `H1` et du corps aux termes réellement employés dans cette langue pour cette catégorie de produit. La sonde peut rester légère (complétions + requêtes Search Console du marché quand elles existent), mais elle doit **déclarer ses limites** — pas de volume, pas de géolocalisation fiable — et signaler les **homographes trompeurs**, qui sont le cas le plus coûteux et le moins visible. |

## Ce qui a été fait côté projet

Un contrôleur `check-traductions.mjs` détecte les chaînes **identiques au français** dans les
six autres locales : 42 trouvées, dont les gabarits `meta.gite.title` en `es`, `it` et `pt`,
restés intégralement en français. Il déclare ne pas juger la justesse d'une traduction, seule
l'identité étant décidable par script — même discipline que le `non_juge` du pan i18n de
forge-tests, qui passe au vert sur ce projet et qui a raison de le faire.

## Remarques restées au produit

> Section ajoutée le **2026-08-26**, après l'arrivée du gabarit `RETOURS-FORGES.md`
> (`TF-0626`) : ce lot avait été rédigé sans lui et ne portait donc ni R-45 ni R-46.
> L'ajout est **purement additif** — aucun retour, aucun chiffre, aucune formulation
> d'origine n'a été touché. Le contenu ci-dessous est reconstitué depuis les commits
> de la fenêtre du lot.

**Aucune remarque n'est restée au produit.** Ce lot est né d'une recherche, pas d'un
défaut : aucune ligne de code n'a été corrigée dans sa fenêtre. Ce qu'elle a produit est
remonté en entier — la méthode de recherche en **RT-32**, l'angle mort lexical de
`forge-seo-geo` en **RT-33**. Rien n'a été gardé chez le produit.

## Retours sur les documents produits

**Aucun document produit depuis un gabarit.** Aucun des gabarits de `gabarits\documents\`
n'a servi sur ce projet : aucun document du dépôt ne porte d'identifiant `gd-…`. La section
est déclarée vide, elle n'est pas omise.

Une observation tombe hors du périmètre de R-46, qui vise les livrables issus de
`gabarits\documents\`, et est consignée faute de canal plus juste : **ce lot lui-même a été
produit sans son gabarit de méthode**, `RETOURS-FORGES.md` étant absent du dépôt jusqu'à
`TF-0626` du 26/08/2026. C'est la cause directe de l'ajout rétroactif signalé ci-dessus.

## Confirmations positives

- **Le pan i18n de forge-tests déclare exactement sa portée** : « la JUSTESSE d'une traduction
  n'est PAS jugée — un catalogue complet, aux paramètres intacts et aux libellés constants,
  peut être intégralement mal traduit ». Il passe au vert et ne ment pas. C'est le
  contre-exemple utile des oracles dont la portée reste implicite, et le modèle que RT-33
  demande d'imiter pour le lexical.
- **La question de l'exploitant a produit la correction.** C'est en lui répondant que le faux
  ami italien a été trouvé — pas en menant la recherche.

## Ordre recommandé

1. **RT-32** — la règle de méthode ; elle vaut pour toute recherche de toute forge, et son
   coût est un tableau de trois lignes avant de conclure.
2. **RT-33** — le nœud lexical, à cadrer avec `forge-seo-geo` ; plus coûteux, mais il couvre
   un angle mort que la conformité technique ne verra jamais.
