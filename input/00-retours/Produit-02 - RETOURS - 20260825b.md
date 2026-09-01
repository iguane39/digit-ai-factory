# Retours forges — deux fichiers de même taille pris pour le même fichier — 20260825b

- **Contexte** : le logo du bandeau de navigation est devenu un fantôme bleu foncé sur fond
  bleu foncé, en production. J'ai introduit la régression la veille, je ne l'ai pas vue, et
  l'exploitant l'a signalée. La cause est une septième occurrence du motif que ce run remonte
  depuis trois jours — mais avec un signal partiel d'un genre nouveau : **la taille en octets**.
- **Références** : commits `8d08677` (la régression) et `652f52e` (le correctif),
  `site/assets/img/logo.svg` et `logo-white.svg`. Lots précédents : `20260823c`, `20260824a`
  et `b`, `20260825a`.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le site porte deux logos vectoriels pour deux contextes, et c'est le CSS qui choisit lequel
afficher selon le fond. Retirer la mention « & chambres d'hôtes » du logo de référence
demandait donc de traiter les deux fichiers. J'en ai traité un seul, puis j'ai écrit son
contenu dans les deux.

| Fichier | Contenu réel | Usage |
|---|---|---|
| `logo.svg` | remplissages `#2d4047` et `#a25d42` | fonds clairs — menu compacté, pied de page |
| `logo-white.svg` | remplissage `#FFFFFF`, rien d'autre | fonds sombres — bandeau de navigation, hero |

Les deux pesaient **exactement 19 922 octets** et portaient la même date de modification.
Un `ls -la` les affichait sur deux lignes rigoureusement parallèles. J'en ai conclu qu'il
s'agissait du même fichier dupliqué — et je l'ai même écrit à l'exploitant, comme un constat.

Une empreinte les aurait séparés en une seconde : `985f9811…` contre `395285e8…`.
La coïncidence de taille n'a rien d'étonnant, ce sont deux exports du même dessin où seule
la valeur hexadécimale des couleurs change, à longueur de chaîne égale.

## Les deux retours

Le premier porte sur le signal trompeur, le second sur la vérification qui manquait. Les
deux sont nécessaires : le premier seul laisse passer d'autres formes du même piège.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-28 | majeur | **La taille en octets a servi de preuve d'identité.** Deux fichiers de 19 922 octets, même horodatage, ont été traités comme un seul. La conséquence a atteint la production : le logo du bandeau de navigation, rendu en `#2d4047` sur un fond `#2d4047`, soit un ratio de contraste de **1,0**. C'est la septième occurrence en trois jours du motif remonté au lot `20260823c` — une source partielle prise pour une preuve — mais la première où le signal trompeur est une **métadonnée de fichier** et non une réponse d'API ou un commentaire de code. La famille est donc plus large qu'écrit jusqu'ici : elle couvre tout indicateur corrélé à ce qu'on cherche sans le déterminer. | Étendre la règle de RT-11 au-delà des ressources externes : **l'identité de deux artefacts s'établit par empreinte, jamais par taille, date, nom ou nombre de lignes.** Ces indicateurs sont des indices de divergence — ils prouvent que deux fichiers diffèrent quand ils diffèrent, jamais qu'ils coïncident quand ils coïncident. Le coût de l'empreinte est nul, celui de l'erreur a été une régression en production. |
| RT-29 | majeur | **Un actif visuel a été validé sur son fichier, jamais sur son rendu en contexte.** J'avais bien rendu le SVG modifié en PNG et vérifié qu'il ne portait plus « & chambres d'hôtes » — ce qui était vrai, et sans rapport avec le défaut. Le défaut n'existe **que dans le contexte d'usage** : un logo blanc devenu bleu foncé n'est visible que posé sur son fond sombre. Le correctif appliqué a capturé le bandeau de navigation au navigateur et le défaut a sauté aux yeux immédiatement. L'oracle de contraste du projet n'aurait rien vu non plus : il ne mesure que le texte, jamais les images. | Règle : **un actif visuel se valide dans le contexte où il est servi**, pas isolément. Pour un logo : une capture du composant qui l'affiche, dans chacun de ses états. Oracle proposé, complémentaire de celui demandé en RT-13 : mesurer le contraste des **images** contre le fond effectivement peint derrière elles, par échantillonnage de pixels — un logo monochrome sur fond uni est le cas le plus simple à mesurer et le plus visible quand il échoue. Fixture rouge : un logo dont le remplissage égale la couleur de fond. |

## Le correctif appliqué, et pourquoi il ne recopie rien

Ce chapitre décrit la méthode retenue, parce que la tentation évidente — traiter un fichier
et copier le résultat — est exactement ce qui a produit le défaut.

Les deux originaux ont été restaurés depuis `7444077`, puis **chacun retraité pour lui-même** :
les seize tracés du « & » et de « chambres d'hôtes » sont identifiés par `getBBox` **dans le
fichier courant**, jamais transposés depuis l'autre. Les indices se sont trouvés être les
mêmes — 23 à 38 — mais cela ne se supposait pas, cela se mesurait.

Le rendu a ensuite été vérifié dans les deux contextes, capture à l'appui : logo blanc net
sur le bandeau sombre, version couleur correcte sur fond clair. Un garde-fou a été ajouté à
la séquence de contrôle : **les deux empreintes doivent différer**, et c'est vérifié avant
tout commit.

## Confirmation positive

- **L'exploitant a signalé le défaut en une phrase, avec la capture qui le prouve.** Quatrième
  fois en trois jours. Le rapport entre ce que l'outillage couvre et ce que l'œil humain
  attrape reste très défavorable à l'outillage sur tout ce qui est visuel — ce que RT-13 et
  RT-29 visent ensemble.

## Remarques restées au produit

> Section ajoutée le **2026-08-26**, après l'arrivée du gabarit `RETOURS-FORGES.md`
> (`TF-0626`) : ce lot avait été rédigé sans lui et ne portait donc ni R-45 ni R-46.
> L'ajout est **purement additif** — aucun retour, aucun chiffre, aucune formulation
> d'origine n'a été touché. Le contenu ci-dessous est reconstitué depuis les commits
> de la fenêtre du lot.

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Corrigé chez le produit | Verdict de généralisation |
|---|---|
| Restauration de `logo-white.svg`, écrasé par la version couleur, puis retraitement **indépendant** des deux fichiers, avec garde sur leurs empreintes sha256. | **Généralisable → REMONTÉ en RT-28** : la taille en octets avait servi de preuve d'identité entre deux fichiers. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit.** Aucun des gabarits de `gabarits\documents\`
n'a servi sur ce projet : aucun document du dépôt ne porte d'identifiant `gd-…`. La section
est déclarée vide, elle n'est pas omise.

Une observation tombe hors du périmètre de R-46, qui vise les livrables issus de
`gabarits\documents\`, et est consignée faute de canal plus juste : **ce lot lui-même a été
produit sans son gabarit de méthode**, `RETOURS-FORGES.md` étant absent du dépôt jusqu'à
`TF-0626` du 26/08/2026. C'est la cause directe de l'ajout rétroactif signalé ci-dessus.

## Ordre recommandé

1. **RT-28** — l'extension de RT-11 aux métadonnées de fichier ; coût nul, et elle couvre une
   famille bien plus large que ce seul cas.
2. **RT-29** — à traiter avec RT-13 du lot `20260824a`, dont il est le pendant pour les
   images : même oracle, même mesure au pixel, deux natures d'élément.
