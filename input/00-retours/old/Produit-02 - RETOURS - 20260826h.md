# Retours forges — Produit-02.com — 20260826h

- **Contexte** : l'exploitant a signalé, à l'œil, un encart « Disponibilités » en double sur la
  page de réservation. Le défaut est réel, il est en production, et **aucun contrôle de la
  chaîne ne pouvait le voir** — pas parce qu'il était subtil, mais parce que les trois
  mécanismes qui auraient dû le rencontrer regardent tous ailleurs.
- **Références ledger** : `runs\20260823-retrait-domaine-bretagne\ledger.jsonl` seq 72, 73, 74
  (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-08-26

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qu'un défaut trouvé à l'œil dit de la chaîne qui ne l'a pas trouvé

Le défaut lui-même est mince : sur `/reservation`, le surtitre « DISPONIBILITÉS » coiffait le
bloc de recherche, puis **le même surtitre, mot pour mot**, coiffait la section « Réserver en
ligne » 900 px plus bas. Une seule ligne dans le générateur, `${suptitle(R.suptitle)}` appelé
deux fois sur la même page — donc **garanti identique dans les sept langues par construction**.
Corrigé ici en une ligne, sept pages regénérées, vérifié en capture pleine page.

Ce qui mérite d'être remonté n'est pas le défaut, c'est la question que l'exploitant a posée en
le signalant : *pourquoi ça n'a pas été vu ?* Trois mécanismes auraient pu le rencontrer. Aucun
ne pouvait.

1. **L'audit forge_tests** a déclaré **SANS OBJET** les cinq pans qui regardent une page rendue,
   au motif que *« ce projet ne rend aucune page »*. Le projet est 203 pages HTML.
2. **La revue visuelle** s'appuie sur des captures **viewport**. Le doublon était sous le bas de
   la seule capture desktop de cette page.
3. **L'outillage du produit sait juger un doublon** — mais seulement **entre** deux pages,
   jamais **dans** une page.

Les trois trous sont indépendants, et chacun se referme séparément. C'est pour ça qu'ils font
trois retours et pas un.

## `digit-ai-forge-tests`

Un retour, sur un audit qui a déclaré inexistant ce que le produit est
intégralement : des pages.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-57 | bloquant | produit+générique | **Les cinq pans qui regardent une page rendue sont déclarés SANS OBJET sur un projet qui n'est que des pages.** `forge\etapes\tests\rapport-20260825.json`, clé `pans_sans_objet` : `visuel`, `accessibilite`, `contraste`, `clavier`, `plancher`, tous au motif littéral *« aucun dossier `frontend\`, aucune instance servie (FORGE_TESTS_BASE_URL) et aucune route déclarée (FORGE_TESTS_QUALIF_ROUTES) : **ce projet ne rend aucune page** »*. Mesure contradictoire : le projet contient **203 fichiers HTML** sous `site\`, et `package.json` les sert (`"start": "serve site -l …"`). Le détecteur ne reconnaît le rendu qu'à **trois signaux** — un dossier `frontend\`, une instance servie, des routes déclarées — qu'un **site statique généré** ne présente jamais, quelle que soit sa taille. **La contradiction est interne au même rapport** : dans le même fichier, le pan `i18n` annonce **203 éléments inventoriés, ratio 1.0**, lus dans ce même dossier via `FORGE_TESTS_I18N_BUILD=site`, clé **déjà déclarée** dans `.env.forge-tests`. Deux pans du même audit sont en désaccord sur l'existence des pages du produit, et un seul a raison. Conséquence mesurée : le verdict **PARTIEL** du 25/08 affiche `interface` à **1.0 (18329/18329)** — une couverture annoncée à 100 % — pendant que **tout ce qui pourrait VOIR une page est éteint**. | Reconnaître une **troisième forme de rendu** : un répertoire de HTML généré, que ce projet **désigne déjà** par `FORGE_TESTS_I18N_BUILD`. Le pan `i18n` sait le lire ; les cinq autres l'ignorent parce qu'ils interrogent une autre clé. Le remède minimal est de faire converger la détection de « ce produit rend des pages » vers **une seule source**, celle que le produit déclare. Point de doctrine derrière la mécanique : **SANS OBJET est plus grave que NON COUVERT.** Un pan non couvert est un trou qui demande à être comblé et qui figure au verdict comme tel ; un pan sans objet est un trou **déclaré inexistant**, qui disparaît du raisonnement de qui lit le rapport. Si le motif d'un SANS OBJET est une **inférence** (« ce projet ne rend aucune page ») et non un fait déclaré par le produit, il devrait au minimum être **falsifiable au rapport** — ici, un simple décompte des `.html` du dossier déclaré l'aurait renversé. |

## `digit-ai-forge-design`

Un retour, sur un verdict visuel rendu à travers une fenêtre trop étroite pour
contenir le défaut.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-58 | majeur | produit+générique | **Le verdict visuel repose sur des captures viewport, qui détruisent exactement la relation qu'un doublon met en jeu.** Mesure : `forge\captures\reservation-desktop.png` fait **1440 × 900** — une fenêtre — alors que la page pleine mesure **1440 × 3684** (capture refaite ce jour pour l'établir). Le surtitre en double se trouvait à **environ 800 px sous le bas** de la seule capture desktop de cette page ; `reservation-mobile.png` (375 × 780) et `reservation-resultats.png` (1440 × 900) ne l'atteignent pas davantage. **La capacité existait, dans le même dossier** : `index-full-desktop.png` fait 1440 × 7001, `bienetre-full-desktop.png` 1440 × 3723, `gite-full-desktop.png` 1440 × 5180. Trois pages sur les 203 ont eu une capture pleine page ; la page de réservation, non. Le cadrage était donc **choisi page par page, à la main, sans règle** — et le hasard du cadrage décidait de ce que la revue pouvait voir. | **Un défaut de répétition n'est pas un défaut de point, c'est un défaut de RELATION entre deux points éloignés de la page.** Aucun jeu de captures viewport ne peut le contenir : la répétition n'existe que dans le cadre qui contient les deux occurrences. Règle proposée pour le mode « critique d'implémentation » : **tout verdict visuel porté sur une page s'appuie sur au moins une capture pleine page** ; les captures viewport servent à juger la ligne de flottaison et le comportement au défilement, jamais à conclure sur la page. Corollaire opérationnel : quand une revue rend un verdict, elle devrait **nommer les captures sur lesquelles elle s'appuie et leurs dimensions** — un verdict adossé à une seule fenêtre de 900 px sur une page de 3684 se lit alors pour ce qu'il est, un verdict sur un quart de la page. |

## `digit-ai-factory`

Un retour, sur une famille d'oracles qui ne marche que dans un sens.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-59 | majeur | produit+générique | **La notion « un doublon est un défaut » existe dans l'outillage, mais sur un seul axe.** `build\check-seo.mjs` ligne 39 lève une erreur franche sur `« <page> : title dupliqué avec <autre page> »` — c'est-à-dire l'unicité **ENTRE** livrables, câblée et rouge en CI. **Aucun** contrôle de la chaîne ne juge l'unicité **DANS** un livrable : ni `build\ci\verif-pages.py` (consentement, traceurs, comptes de pages par langue, fichiers de référencement), ni `check-i18n.mjs`, ni `check-traductions.mjs`, ni `audit-browser.mjs` (calendrier, fonctionnel), ni les pans forge_tests. Mesure : **70 des 203 pages** portaient le même surtitre deux fois — 7 pages de réservation (corrigées ici) et 63 pages de ville et de profil (déclarées ci-dessous) —, et le balayage qui les trouve toutes tient en **six lignes de Python** sur le HTML déjà sur disque, sans navigateur. Le rapport coût/portée est écrasant, et personne ne l'a payé parce que **la direction inverse du même contrôle existait déjà et donnait le sentiment que la classe était couverte**. | Une famille d'oracles « **unicité** » du socle doit porter ses **deux axes**, et le dire : *unicité entre livrables* (deux pages, même titre) et *unicité dans un livrable* (une page, deux fois le même intertitre). Un catalogue qui n'en nomme qu'un laisse l'autre moitié de la classe invisible — et **invisible avec l'apparence d'être couverte**, ce qui est pire que non couvert. La classe est indépendante du format : titres de sections répétés dans un document généré, identifiants réutilisés, lignes dupliquées dans un tableau de restitution, mêmes clés dans deux blocs d'un fichier de configuration. Le remède est un oracle générique paramétré par le sélecteur de l'élément dont l'unicité est attendue, pas un contrôle HTML de plus. |

## Ce que ce retour ne couvre pas

Le correctif appliqué ici traite **la page de réservation, dans les sept langues** — les
7 occurrences que l'exploitant a signalées. **Il ne traite pas les 63 autres pages** qui portent
le même surtitre deux fois : **35 pages de ville** (5 villes × 7 langues, surtitre « Aux
alentours » sur le `page-head` puis sur la section « Infos pratiques ») et **28 pages de profil
et séminaire** (4 profils × 7 langues, « Votre séjour » / « Votre événement » repris sur la
section d'itinéraire).

Ces 63 pages ne sont **pas** corrigées, et le choix est délibéré plutôt que subi : la seconde
occurrence y est **dans une colonne de texte accolée à une photo** (`section.experience.righty`)
et non centrée en pleine largeur, elle est **séparée par une section intermédiaire**, et elle
coiffe à chaque fois un `h2` distinct. Le même mécanisme produit donc, selon la mise en page, un
défaut franc ou une répétition défendable — et **trancher pour 63 pages est un arbitrage
éditorial, pas une correction technique**. Il est posé à l'exploitant, il n'est pas décidé ici.

La mesure est donnée pour que le sujet ne passe pas pour clos : **70 pages portaient le défaut,
7 sont corrigées, 63 restent, et c'est dit ici plutôt que découvert au prochain coup d'œil.**

## Remarques restées au produit

Ce que le produit a corrigé — ou délibérément pas — chez lui, chacune avec son
verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le surtitre `Disponibilités` était émis deux fois sur la page de réservation par `build\build.mjs`, via le même `${suptitle(R.suptitle)}` | Retrait de la seconde occurrence, sur la section `#moteur` ; le `h2` à vagues ouvre la section seul, comme le fait déjà « Questions fréquentes » plus bas sur la même page. Le surtitre demeure dans `moteurBeds24()`, où la même section vit sur une page de gîte et n'y apparaît qu'une fois | non | **Rien de généralisable dans le correctif lui-même** — c'est un choix éditorial propre à ce gabarit de page. Ce qui l'est, c'est l'**absence de contrôle** qui l'a laissé passer : remonté en **RT-59**. |
| Le générateur est bien la source unique : `node build\build.mjs` reproduit `site\` **à l'octet près** avant correctif (`git status` vide après regénération) | Rien à corriger — vérifié avant d'éditer, pour être sûr que le correctif ne serait pas écrasé au prochain build et qu'aucune page n'avait dérivé à la main | non | **Confirmation, pas défaut.** Consignée parce qu'elle conditionne la validité du correctif : sans elle, éditer les 7 HTML aurait été le geste, et il aurait été faux. |
| `build\shots-viewport.mjs` et `build\shots-scroll.mjs` cadrent par fenêtre ; aucun script du produit ne produit systématiquement une capture pleine page | **Non corrigée** — une capture pleine page a été produite à la main pour vérifier ce correctif, mais le script du produit n'a pas été touché | oui | **Généralisable → remonté en RT-58.** La règle (« un verdict visuel s'appuie sur au moins une pleine page ») appartient au socle ; le câblage du script appartient au produit et reste à faire chez lui. |
| L'oracle de consentement (`npm run verifier`) ne démarre pas ici : `Failed to launch the browser process` sur `msedge.exe` | **Non corrigée** — contournée pour ce run en lançant la capture par un autre chemin d'exécution | non | **Rien de généralisable, mais à ne pas oublier** : le contrôle statique `verif-pages.py` est passé au vert, le volet navigateur n'a **pas** tourné. Consigné pour qu'un futur « les contrôles passent » sur ce poste ne soit pas lu comme incluant le navigateur. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.** Ce lot naît d'un
défaut signalé à l'œil par l'exploitant et de l'enquête sur la chaîne de contrôle qui ne l'a pas
vu ; il ne produit ni ne consomme de livrable de la bibliothèque. La section est **déclarée
vide, elle n'est pas omise**.

## Confirmations positives

- **Le générateur a tenu sa promesse, et c'est ce qui a rendu le correctif sûr.** `site\` est
  reproduit à l'octet près par `build\build.mjs` : le correctif a donc pu être posé **une fois,
  à la source**, et les sept langues en sont sorties ensemble. Un site où les 203 pages auraient
  dérivé à la main aurait transformé une ligne en sept éditions et six occasions de se tromper.
- **Le rapport de tests portait déjà, en clair, le fait qui le contredit.** Le motif
  « ce projet ne rend aucune page » et le décompte `i18n` de 203 pages cohabitent dans le même
  fichier JSON. Le rapport n'a rien caché : il a **écrit les deux moitiés de sa propre
  contradiction**, et c'est ce qui a permis de la nommer en quelques minutes.
- **La déclaration `.env.forge-tests` du produit était déjà juste.** `FORGE_TESTS_I18N_BUILD=site`
  y est posé, avec le commentaire *« l'arborescence telle que le visiteur la reçoit »*. Le produit
  avait déjà dit à la forge où regarder ; RT-57 ne demande pas une déclaration de plus, il demande
  que les autres pans lisent celle qui existe.

## Ordre recommandé

1. **RT-57** — d'abord, parce qu'il est le seul des trois à faire disparaître un pan entier du
   raisonnement. Tant qu'un audit peut annoncer une couverture de 100 % en ayant déclaré
   inexistant tout ce qui regarde une page, les deux autres retours corrigent des angles d'un
   contrôle qui, lui, ne tourne pas.
2. **RT-59** — ensuite, parce que c'est le moins cher : six lignes pour une classe qui touchait
   70 pages sur 203, sur un axe dont l'autre moitié est déjà câblée et déjà rouge en CI.
3. **RT-58** — enfin, parce qu'il porte sur la discipline d'un verdict humain plutôt que sur un
   mécanisme, et qu'il devient beaucoup plus facile à tenir une fois RT-57 réglé : un pan visuel
   qui tourne produit les captures dont la règle a besoin.
