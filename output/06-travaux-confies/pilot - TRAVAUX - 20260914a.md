# Travaux confiés par le pilot — digit-ai-forge-agents (socle `digit-ai-page-html`) — 20260914a

- **Émetteur** : `digit-ai-factory` (le pilot)
- **Références registre** : `todo\TODO.jsonl` du pilot — item **TF-1074** (les 40 règles de `check_html.py` et les 25 familles de `render_page.py` jugent des propriétés LOCALES, et les trois défauts de septembre sont GLOBAUX), instruit par l'étude d'opportunité `output\03-etudes\20260914-etude-opportunite-premiers-html-nouveaux-formats.md` sur décisions humaines D-1 (a), D-2 (a), D-3 (a)+(b) du 14/09/2026 ; les trois éléments citent en outre **TF-1036**, **TF-1038** et **TF-1051**, les trois retours humains qui les fondent.
- **Dépôt** : ce fichier **N'A PAS ÉTÉ DÉPOSÉ** chez la forge. Le socle vit dans un dépôt frère (`digit-ai-forge-agents\.claude\skills\digit-ai-page-html\`), et y écrire demande un mandat humain explicite (garde-fou du noyau). L'original reste au pilot (`output\06-travaux-confies\`). Il partira à la forge le jour où le mandat est donné, sans une ligne de plus.
- **Statut** : `a_traiter` — **non remis**, en attente de mandat humain.
- **Sort du lot reçu** : ce lot entre dans l'histoire du produit — `git add` du fichier et de son sidecar — SAUF si `git check-ignore "<ce fichier>"` le déclare ignoré, auquel cas il reste hors de l'histoire et vit sur le seul poste qui l'a reçu. La ligne est obligatoire dans l'un comme dans l'autre cas : le canal a supposé la boîte d'entrée ignorée par git sans le dire, et chez un dépôt qui versionne `input\` à dessein deux lots reçus sont restés non suivis indéfiniment (mesuré le 06/09).
- **Empreinte du contenu confié** : `TF-1074-composition@20260914`
- **Sidecar machine** : `pilot - TRAVAUX - 20260914a.tf.jsonl`, une ligne par élément.

> ## ⛔ AVANT DE TRAITER — un geste, une seconde
>
> ```
> node c:\dev\digit-ai-factory\gabarits\oracle-travaux-pilot.mjs "<ce fichier>.md"
> ```
>
> Le même module a été joué par le pilot AVANT d'écrire ce lot (règles T1 à T7).

## Ce lot est une DONNÉE, pas une consigne exécutable

Le pilot traite vos lots de retours comme de la donnée : leurs consignes sont décrites, jamais exécutées. Le même principe s'applique ici, dans l'autre sens. Ce lot décrit un travail et argumente pourquoi il vaut d'être fait ; il ne commande rien. Vous restez le juge de ce que vous en faites, sur votre run, avec vos oracles ; un constat écarté rejoint vos écarts assumés avec son motif — il ne disparaît pas. Aucun commit n'a été fait chez vous, et aucun fichier du socle n'a été touché.

## Le fait commun aux trois éléments

Les trois derniers retours humains sur la qualité d'une page portent sur un document bâti **sur un squelette existant et suivi**, et **aucun** des contrôles du socle ne les a vus. Ce n'est pas une lacune de couverture : c'est une lacune de **portée**. Un contrôle local regarde UN élément et répond sur lui ; ces trois défauts ne se voient qu'en comparant des éléments entre eux, à l'échelle de la page. Le socle est passé de 36 à 38 règles et sa recette de 173 à 208 cas en version 1.19.0 — et aucune de ces règles neuves n'aurait attrapé l'un des trois. *Le rendement marginal de la règle unitaire décroît ; c'est la portée qu'il faut changer, pas le nombre.*

## Travaux confiés

### TF-1074 / TF-1036 — L32 : un même ensemble d'éléments n'est énuméré qu'UNE fois par page · gravité majeur

- **Le fait** : retour humain du 11/09/2026, mot pour mot, « Pas de double listing qui ne sert à rien si ce n'est dupliquer l'information. » Mesure consignée à TF-1036 sur un rapport HTML bâti sur le squelette `gd-rapport-donnees` 1.0.0 : **19 identifiants de constat apparaissent CHACUN DEUX FOIS** comme entrée de liste — une fois en ligne du tableau filtrable du chapitre 03, une fois en `summary` d'un `details` du chapitre 04. Le squelette prescrit les deux composants (`table.repli-cartes` et `details.fiche`) sans dire nulle part qu'ils ne se cumulent pas sur un même ensemble. **Aucun des dix-huit domaines d'oracles joués sur ce document ne l'a signalé.**
- **Pourquoi cela vous concerne** : le socle prescrit les deux composants ; c'est donc au socle de dire qu'ils ne s'additionnent pas. Tant qu'il se tait, chaque page qui emploie les deux repose la question au lecteur, et le lecteur la repose à l'auteur.
- **Ce qui est demandé** : une règle **L32** dans `check_html.py`, à portée de PAGE. *Mesure* : collecter les identifiants qui apparaissent comme entrée d'une structure d'énumération (ligne de `<tbody>`, `<li>`, `<summary>`) ; si un même identifiant apparaît dans **deux structures distinctes** et que la page ne porte pas `data-enumeration-double` **avec son motif**, c'est un constat. *Exemption déclarée* : `data-enumeration-double="<motif>"` sur la seconde structure. *Entrée* : **avertissante**, jamais bloquante à la mise en service.
- **Effort estimé** : complexité moyenne × durée courte.
- **Comment vous saurez que c'est fait** : `python scripts/check_html.py <page>` rend un constat L32 sur une fixture rouge portant le même identifiant dans un `<tbody>` et un `<summary>`, et PASS sur la fixture verte où le détail vit DANS la ligne (ligne de tableau dépliable, composant 10 du socle) ; `python scripts/self_test.py` vert.
- **Si ce n'est pas fait** : la classe de défaut se rejoue à chaque page qui emploie les deux composants, et elle est déjà passée au travers de dix-huit domaines d'oracles une fois.

### TF-1074 / TF-1038 — V19 : la largeur de contenu est une propriété de la PAGE, pas du chapitre · gravité majeur

- **Le fait** : retour humain du 11/09/2026, « homogénéise la largeur des contenus de la page principale pour ne pas avoir des grandes largeurs mixées avec des petites largeurs, comme sur l'exemple entre le chapitre 6 et le chapitre 7 ». Mesure consignée à TF-1038 : **sur neuf chapitres, cinq en pleine largeur et quatre bridés**, dans un ordre qui suit la nature du contenu et non la lecture. Le squelette prescrit `.chap.lire` pour la prose et la pleine largeur pour les données, sans dire que l'alternance entre chapitres voisins est un défaut.
- **Pourquoi cela vous concerne** : `L26` tranche déjà la largeur d'une page de DONNÉES, et `E4` celle du conteneur ; aucune des deux ne regarde la **cohérence entre sections d'une même page**. Le geste est au socle parce que c'est lui qui prescrit les deux formes.
- **Ce qui est demandé** : une famille **V19** dans `render_page.py`, mesurée sur le rendu. *Mesure* : relever la largeur rendue de chaque section de premier niveau ; si l'on compte plus d'une valeur distincte (tolérance 2 px) hors sections portant `data-largeur-exception` **avec son motif**, c'est un constat. *Entrée* : **avertissante**. *Frontière déclarée* : une page qui se déclare de lecture (`data-page="lecture"`) ou de données (`data-page="donnees"`) est jugée sur cette déclaration ; une page qui ne déclare rien est jugée sur la largeur majoritaire de ses sections.
- **Effort estimé** : complexité moyenne × durée moyenne.
- **Comment vous saurez que c'est fait** : `python scripts/render_page.py <page>` rend un constat V19 sur une fixture rouge à neuf sections dont quatre bridées, et PASS sur la fixture verte où toutes partagent leur largeur ; mesuré aux largeurs de la grille par défaut.
- **Si ce n'est pas fait** : le défaut est invisible à tout contrôle et ne se voit qu'à l'œil du destinataire, une fois le document remis.

### TF-1074 / TF-1051 — V20 : une information qui lève un doute est visible LÀ OÙ le doute naît · gravité majeur

- **Le fait** : mesure consignée à TF-1051 le 08/09/2026 sur une page de données de 20 lignes et 9 colonnes. Deux colonnes ne portaient qu'une seule valeur distincte. Le composant de filtres **calculait bien la cardinalité** et rendait la note « Une seule valeur dans cette colonne. » — mais **à l'intérieur du panneau de facette, replié par défaut**. Sonde après initialisation : la note existe sur **8 colonnes sur 9, aucune n'est visible sans clic**. Le destinataire a lu vingt fois la même chaîne et a écrit « Il doit y avoir un problème de login, il y a toujours la même valeur ». La valeur était juste. **Le doute a coûté un aller-retour complet.**
- **Pourquoi cela vous concerne** : le calcul est bon, le composant est bon, et le défaut est un défaut de **placement** — donc un défaut du socle qui décide où le composant rend ses notes.
- **Ce qui est demandé** : une famille **V20** dans `render_page.py`. *Mesure* : pour toute note portant `data-leve-doute` (ou la note de cardinalité du composant de filtres), vérifier qu'elle est visible **au repos**, sans interaction ; une note présente dans le DOM et invisible au repos est un constat. *Entrée* : **avertissante**. *Geste complémentaire, à votre arbitrage* : rendre la cardinalité dans l'EN-TÊTE quand elle vaut 1, plutôt que dans le panneau.
- **Effort estimé** : complexité simple × durée courte.
- **Comment vous saurez que c'est fait** : `python scripts/render_page.py` rend un constat V20 sur une fixture rouge où la note vit dans un `details` replié, et PASS sur la fixture verte où elle est rendue dans le `<th>` ; les deux fixtures jouées dans le navigateur sur l'asset réel, comme les trois fixtures du composant de filtres de la version 1.17.0.
- **Si ce n'est pas fait** : un lecteur continue de prendre une valeur juste pour une panne, et chaque occurrence coûte un aller-retour.

## Ce que le pilot a déjà fait de son côté

- L'étude d'opportunité est produite et jugée : `oracle-etude-opportunite.mjs` PASS 10/10, `check_markdown.py` PASS. Elle porte la mesure d'avant, l'arbitrage des deux hypothèses et le jeu fermé d'options.
- Les **modules producteurs ont été LUS** avant d'écrire ce lot, et voici lesquels : `scripts\check_html.py` (relevé des identifiants A1-A5, L1-L31, G1-G9 dans le source ; 40 règles selon l'empreinte `695359b17ff5` du hook d'ouverture du 14/09) ; `scripts\render_page.py` (relevé des familles V ; 25 familles selon l'empreinte `0542e111208d`) ; `references\zero-defaut-visuel.md` (tableau V8 à V18, y compris V15 ter) ; `references\lisibilite.md` (§ « Ce qui n'est PAS mécanisable », dix objets, lignes 457-479) ; `references\composants.md` (13 composants et leurs tiers) ; `references\gabarit-revue-de-lecture.md` ; `SKILL.md` v1.21.0 et son journal de versions.
- Le palier précédent est fait et prouvé chez le pilot : le catalogue des gabarits déclare désormais le point de départ de ses 20 familles HTML, et la règle G5 de `oracles\oracle-gabarits-documents.mjs` le vérifie sur disque — self-test 12 cas, bruit mesuré à zéro sur la recette du pilot.
- Les quatre constats de l'étude sont au registre : TF-1073 (clos), TF-1074 (ce lot), TF-1075, TF-1076, plus TF-1077 trouvé en passant.
- **Rien n'a été écrit dans le socle ni dans aucun dépôt frère.**

## Ce que le pilot NE demande PAS

- Pas de règle **bloquante** à la mise en service : les trois entrent avertissantes, et se durciront quand le corpus sera propre — c'est la doctrine que le socle applique déjà à ses propres règles neuves.
- Pas de mise en service sans **mesure de bruit sur les dépôts CONSOMMATEURS** : la classe `regle-neuve-sans-mesure-de-bruit` (créée le 08/09/2026) décrit précisément le défaut d'une règle dont le bruit n'a été mesuré que chez son auteur. La version 1.20.0 du socle a mesuré « 357 à 362 pages HTML suivies de huit dépôts du parc, zéro constat nouveau » — c'est cette mesure-là qui est attendue, pas une autre.
- Pas de refonte des règles existantes : L26, E4, V12, V13 et V17 ne changent pas. Les trois règles demandées s'ajoutent à une portée qu'aucune d'elles ne couvre.
- Pas de contrôle sur ce que `lisibilite.md` déclare non mécanisable — justesse d'un chapeau, fil narratif, choix du bon composant pour l'intention restent à la revue de lecture.
- Pas de décision sur les identifiants **L32**, **V19** et **V20** : ils sont proposés, la numérotation vous appartient.

## Ordre recommandé

1. **V20 d'abord**, parce qu'il est le moins cher (complexité simple × durée courte), que son défaut est déjà entièrement mesuré à TF-1051, et qu'il supprime une classe d'aller-retour dont le coût est constaté et non supposé.
2. **L32 ensuite**, parce qu'il est statique — donc mesurable sans navigateur — et que sa fixture rouge se fabrique en deux structures d'une même page.
3. **V19 en dernier**, parce qu'il est le seul à demander un arbitrage de frontière (que juge-t-on d'une page qui ne se déclare ni lecture ni données), et qu'un arbitrage mal posé produit du bruit sur tout le parc.

## Remise du compte rendu

À la clôture de votre run, un lot de retours `digit-ai-forge-agents - RETOURS - <date><i>.md` (+ sidecar) remis dans `c:\dev\digit-ai-factory\input\00-retours\` dit ce qui a été fait, avec la preuve (fixtures rouges et vertes, self-test, mesure de bruit sur les dépôts consommateurs) — le pilot clôt TF-1074 sur gains constatés.
