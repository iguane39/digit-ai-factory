# Retours forges — un texte illisible en production, et l'oracle qui ne pouvait pas le voir — 20260824a

- **Contexte** : l'exploitant signale un texte illisible sur la page d'accueil du site en
  production. Le défaut est réel, il touche deux blocs de la même section, et il vivait là
  depuis la mise en ligne. L'analyse de sa non-détection met au jour trois défaillances
  empilées de l'outillage, plus une quatrième dans l'outil que j'ai écrit pour le mesurer.
- **Références** : `site/assets/css/main.css` (`.color-exp.flip`), `build/check-contrast.mjs`,
  session du 24/08/2026 sur `Produit-02.com`. Lot précédent : `20260823c`, dont ce lot
  est une application directe — le motif « une source partielle prise pour complète » s'y
  vérifie une sixième fois.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Le défaut, et pourquoi il produit deux illisibilités d'un coup

Ce chapitre décrit le mécanisme avant d'accuser l'outillage : le défaut est instructif en
lui-même, parce qu'une seule ligne de CSS incomplète en produit deux visibles à des endroits
opposés de l'écran.

La section `.color-exp` peint sa moitié **gauche** en couleur sombre via un pseudo-élément
`::before`. La variante `.flip` déplace cette moitié à **droite**. Mais la disposition, elle,
ne bouge pas : `.experience.lefty` place invariablement le texte à droite et les images à
gauche. Avec `.flip`, deux choses cassent donc simultanément.

| Élément | Se retrouve sur | Garde la couleur | Résultat mesuré |
|---|---|---|---|
| le bloc de texte | la moitié **sombre** | sombre | ratio **1,0 à 1,6** — illisible |
| la légende manuscrite | la moitié **claire** | blanche, via `.on-half-dark` | blanc sur blanc |

Le correctif appliqué vit dans le CSS et non dans le générateur : c'est `.flip` qui était
incomplet, pas la page. Toute section `.flip` future est désormais correcte sans rien avoir
à déclarer. Après correction, mesuré au pixel : **7,4 à 10,9** en desktop, et le mobile était
déjà sain puisque la moitié sombre y devient un aplat clair à 6 % d'opacité.

## Pourquoi aucun contrôle ne l'a vu — quatre couches

Ce chapitre est le cœur du retour. Le projet **possède** un vérificateur de contraste, et il
a pourtant laissé passer un texte à 1,0 de ratio pendant des semaines. Quatre raisons
s'empilent, et chacune suffisait seule.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-13 | majeur | **Le seul vérificateur de contraste ne regarde que le menu.** `build/check-contrast.mjs` s'annonce lui-même : « Mesure le contraste réel du menu (texte blanc) sur chaque page FR, état haut de page ». Il sélectionne `.header-line` et rien d'autre. Le corps de page — titres, paragraphes, boutons, légendes — n'est jamais mesuré. Il n'aurait donc **jamais** vu ce défaut, même en tournant à chaque build. Un oracle dont la portée est aussi étroite que son nom est large donne une fausse assurance : « le contraste est vérifié » était vrai et sans valeur. | Étendre la mesure au corps de page, sur les éléments porteurs de texte, à **au moins deux points de rupture** — le défaut ici était desktop uniquement, un contrôle mobile seul l'aurait manqué. Nommer l'oracle d'après ce qu'il couvre réellement, ou couvrir ce que son nom promet. |
| RT-14 | majeur | **Une mesure par styles calculés n'aurait rien vu non plus.** Le fond fautif est peint par un **pseudo-élément** `::before`, et la règle `.color-exp .experience .txt { background: transparent }` rend le fond propre de l'élément transparent. Un contrôle qui compare `color` à `background-color` — ce que font la plupart des outils, dont l'audit axe-core courant — lit donc le fond du conteneur, clair, et **conclut que tout va bien**. Seul un échantillonnage de **pixels réels** après rendu détecte l'écart. | Poser la règle au socle : un oracle de contraste se mesure **au pixel après rendu**, jamais aux styles calculés. Corollaire à écrire dans son `non_juge` : tout ce qui peint sans être un `background-color` — pseudo-éléments, dégradés, images de fond, `mix-blend-mode`, superpositions — est hors de portée d'une mesure DOM. |
| RT-15 | majeur | **L'oracle n'est appelé par rien, et ne peut pas se lancer.** Deux défauts cumulés, mesurés : il est cité par **0 fichier** du dépôt — ni CI, ni `package.json`, ni documentation ; et sa ligne 23 code le navigateur **en dur** : `executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'`. Ce chemin n'existe pas sur la machine de travail, l'oracle échoue au lancement. Son voisin `build/ci/oracle-consent.mjs` fait pourtant bien les choses : liste de candidats plus `CHROME_PATH` en tête. La bonne pratique existait à côté, dans le même dépôt. | Aucun oracle ne code un chemin de navigateur en dur : `CHROME_PATH` d'abord, liste de repli ensuite, message explicite si rien n'est trouvé. Et tout oracle présent au dépôt est atteignable par la cible unique de vérification proposée en **RT-10** du lot `20260823c` — un oracle que rien n'appelle n'est pas un oracle, c'est un fichier. |
| RT-16 | mineur | **L'outil de mesure que j'ai écrit pour vérifier le correctif était lui-même faux, deux fois.** D'abord `page.screenshot({clip})` travaille en coordonnées **page** alors que `getBoundingClientRect` rend des coordonnées **viewport** : après défilement, j'échantillonnais une zone sans rapport et j'ai lu des fonds gris qui n'existent nulle part dans la palette. Ensuite, échantillonner **un seul pixel** à côté du texte tombait de l'autre côté de la frontière entre les deux moitiés, donnant un ratio de 1,0 sur un élément pourtant correct. Corrigé en prenant la couleur **dominante** de la boîte de l'élément. | Ce qui sauve ici est un principe, pas une astuce : les valeurs mesurées doivent être **confrontées à la palette connue** du projet. Un fond `rgb(204,204,204)` sur un site dont aucune variable ne vaut ce gris est un aveu que la sonde est fausse, pas que le site l'est. Un oracle de contraste devrait refuser de conclure quand la couleur de fond échantillonnée n'appartient à aucun token déclaré. |

## Un défaut systémique découvert au passage

Ce chapitre signale sans corriger : la mesure a révélé un écart bien plus large que celui
signalé, dont la correction est une décision de design et non un correctif.

La classe `.suptitle` — les kickers du type « NOS GÎTES », « TOUTE L'ANNÉE » — est en
`--pale-hover` (`#aac1c9`). Sur fond clair, le ratio tombe à **1,79 sur `--bg-soft`** et
**1,88 sur blanc**, contre un seuil AA de 3,0 pour du grand texte. Ce sont **392 occurrences
sur les 203 pages**. Sur fond sombre, en revanche, le même token donne 5,78 et passe.

Ce n'est pas corrigé ici : assombrir tous les kickers du site change son apparence partout,
et cela relève de l'exploitant. Mais c'est exactement le genre d'écart qu'un oracle de portée
correcte aurait signalé dès le premier build.

## Confirmations positives

- **Le signalement humain a fonctionné là où quatre couches d'outillage ont échoué.** C'est
  le même enseignement qu'hier avec la capture d'écran Railway, et il mérite d'être écrit
  deux fois plutôt qu'oublié une.
- **`oracle-consent.mjs` est le contre-exemple utile.** Portabilité du navigateur, contrôles
  nommés, sortie lisible, échec bruyant : le modèle à suivre existe dans le même dossier que
  l'oracle défaillant. Le correctif de RT-15 consiste largement à copier son voisin.
- **Le correctif CSS a tenu au premier essai sur les deux points de rupture**, une fois la
  sonde de mesure réparée — ce qui confirme que le diagnostic du mécanisme était juste.

## Ordre recommandé

1. **RT-14** — c'est la règle de méthode ; sans elle, un oracle de contraste étendu se
   contenterait des styles calculés et raterait la même famille de défauts.
2. **RT-13** — étendre la portée au corps de page, à plusieurs points de rupture.
3. **RT-15** — portabilité et câblage ; c'est le moins coûteux et il conditionne les deux
   précédents, puisqu'un oracle injoignable ne protège de rien.
4. **RT-16** — le garde-fou sur la sonde elle-même, à traiter avec RT-14.
