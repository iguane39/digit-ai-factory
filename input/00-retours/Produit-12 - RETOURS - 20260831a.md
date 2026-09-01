# Retours forges — Client-A-POC-to-Prod — 20260831a

- **Contexte** : production d'un livrable HTML de consolidation de process (`Client-A - Process
  Ingénierie POC-to-Prod - Consolidation et cible`), **trois indices en un jour** — `a` non
  conforme au socle, `b` conforme au socle subordonné mais refusée par le lecteur, `c` conforme
  après alignement sur le livrable de référence de la maison
- **Références** : ce projet ne tient pas de ledger de run ; traçabilité par les fichiers
  `output/old/03-Syntheses/…20260831a` et `…20260831b`, et par le livrable servi `…20260831c`
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : **remis le 2026-08-31** — les deux fichiers déposés dans la boîte d'entrée du pilot `digit-ai-factory/input/00-retours/`, hors git ; l'original reste ici (historique du produit).

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Ce que ce lot documente.** Quatre jours après le lot `20260827a`, **le même projet a refait la
même erreur, par le même chemin**. Il a écrit un livrable HTML contre
`references/BEST-PRACTICES-HTML.md`, a chargé trois `<link>` Google Fonts parce que son item A1
les autorise en toutes lettres, et n'a découvert la contradiction qu'en **relisant son propre lot
de retours du 27/08**, où elle est déjà décrite sous **RT-1**. Le lot ne remonte pas une nouvelle
classe de défaut : il apporte la **preuve que RT-1 est toujours ouvert et se rejoue**, plus trois
défauts de forme qui n'avaient pas encore été rencontrés. Il consigne aussi, sans les remonter,
les deux erreurs qui sont miennes et non celles du socle.

---

## digit-ai-factory (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-1bis | **bloquant** | générique | **Reconstat de RT-1, quatre jours après, sur un autre livrable du même projet — et le coût est identique.** L'item **A1** de `references/BEST-PRACTICES-HTML.md` autorise « zéro dépendance **hors web fonts** », et son item **D4** prescrit Roboto + DM Sans + JetBrains Mono en citant une source qui les charge. J'ai donc écrit `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?…">` et trois `<link rel="preconnect">`, et déclaré le livrable conforme — indice `20260831b`, publié. La règle **A1** de l'oracle normatif refuse toute requête réseau au chargement. **Le seul document qui m'a détrompé est mon propre lot de retours du 27/08**, relu par hasard ; le livrable conforme de la maison (`Client-A - Différentiel Sécurité PSO IA - 20260827b`) fait, lui, **0 requête réseau** et déclare les trois familles en tokens avec repli système. La proposition de RT-1 n'a pas été appliquée : l'en-tête du fichier revendique toujours « **Source de vérité unique** ». | Appliquer RT-1 tel quel, et **corriger A1 et D4 dans le même geste** : « aucune requête réseau au chargement, y compris pour les polices ; les familles chartées se déclarent en tokens avec repli système, comme `…PSO IA - 20260827b`. » Tant que le texte autorise les web fonts, chaque nouveau lecteur du fichier refera ce livrable. Deux occurrences en quatre jours, même projet, même chemin. |
| RT-4 | majeur | générique | **B1 et B6 se contredisent en pratique, et le socle n'arbitre pas.** B1 « header sticky » est verdict *adapter*, B6 « tableau de données triable, **`thead` sticky** » est verdict *adopter*. Sur une page longue à tableaux, les deux se superposent : l'en-tête de tableau se colle au bord haut de la fenêtre, **derrière** l'en-tête de document, et devient illisible ; ou bien on lui donne un décalage vertical, et il flotte alors au-dessus des premières lignes de son propre tableau. Aucun des deux textes ne dit lequel cède, ni ne fournit le décalage. Coût : deux cycles de rendu pour découvrir la collision, puis un arbitrage pris **par le produit** — l'en-tête et le sommaire forment un bloc fixe, le `thead` cède — ce qu'un produit ne devrait pas avoir à trancher seul. | Trancher au socle, et écrire le geste : soit B6 l'emporte et B1 devient « en-tête statique sur les pages à tableaux », soit B1 l'emporte et B6 reçoit son décalage sous la forme d'un token (`--hh`) que le gabarit pose. Un exemple dans le boilerplate suffirait ; c'est une question de deux lignes de CSS, et elle coûte un cycle de rendu à chaque page longue. |
| RT-5 | mineur | générique | **La ligne D5 ne documente pas la teinte de refus, que la maison emploie pourtant.** D5 « palette sémantique de statut » nomme `--green`, `--amber`, `--teal`. Un rapport de conformité a besoin d'un quatrième registre — « non déclaré », bas d'échelle d'une carte de chaleur. Faute de le trouver, je l'ai d'abord **inventé** et déclaré comme extension locale dans mon livrable. En ouvrant le livrable conforme de la maison, j'ai constaté que `--red` / `--red-fill` / `--red-line` **y figurent déjà** (`#B91C1C` / `#FEF2F2` / `#F6CFCF`) : la palette les porte, la documentation non. | Ajouter `--red` et ses deux dérivés à la ligne D5, avec leurs valeurs. Une palette dont un registre entier n'est documenté nulle part se fait réinventer, et deux réinventions donnent deux rouges différents dans deux livrables de la même maison. |
| RT-6 | mineur | générique | **Aucune famille de gabarit ne couvre une consolidation de process, et le catalogue ne le dit pas comme un manque.** Les 31 familles de `gabarits/documents/catalogue.jsonl` ont été parcourues : `gd-note-synthese-audit` porte un verdict d'audit à un commanditaire, `gd-modele-maturite` évalue une maturité, `gd-tableau-bord-post-remediation` compare deux audits du même objet. Aucune ne consolide **les process déclarés par plusieurs produits** en une cible commune avec écarts et décisions. J'ai donc inventé la structure, et déclaré `gabarit : candidat « consolidation-process »` dans l'en-tête du livrable, faute de pouvoir renseigner **G8**. | Ouvrir la famille en statut `a_extraire` avec ce livrable comme première source. Elle a des voisines proches : le lot PROCESS amont (déclaration par produit) et la consolidation aval forment une paire, et la paire se reproduira à chaque campagne. |

**Portée** (R-45) : les quatre retours ci-dessus sont de portée *générique*. Aucun ne dépend du
contenu du livrable, ni de ce projet, ni de son client.

## Confirmations — ce qui a bien fonctionné

| Objet | Constat |
|---|---|
| **E4 · largeur utile** | Le token `clamp(75vw, 1680px, 92vw)` et la doctrine D1 sont **justes et suffisamment argumentés** : le texte de E4 raconte l'arbitrage du 21/08, le coût mesuré (647 px de texte pour 1 130 px de conteneur) et ce qu'il remplace. C'est ce récit — pas la règle seule — qui m'a permis de comprendre que ma bride à 1 280 px était le défaut exact qu'il décrit. |
| **Doctrine D3 · repli en cartes** | La phrase « un conteneur `overflow-x: auto` ne fait pas passer un tableau » avec ses 26 défauts mesurés à 390 px a évité une discussion : il n'y avait rien à arbitrer, seulement à faire. Le repli en cartes a supprimé tout débordement sur 14 tableaux. |
| **Pattern S-G1** | Collé tel quel, il fonctionne du premier coup, y compris la note sur la fixture sombre — « figer `data-theme="dark"` dans le HTML rendu ». Sans cette note j'aurais produit huit captures « sombres » qui rendaient clair, puisque l'init rebascule. Elle m'a fait refaire la preuve. |
| **Livrable conforme de la maison** | `Client-A - Différentiel Sécurité PSO IA - 20260827b` a tranché **quatre** questions que les textes laissaient ouvertes : zéro requête réseau, `.lire` centré par marges auto, `--red` déjà dans la palette, `--w` en `max-width`. **Un artefact conforme vaut trois pages de doctrine** — c'est la leçon la plus utile de la journée, et elle plaide pour que le socle nomme explicitement un livrable de référence à ouvrir. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| J'ai posé `.lire{max-width:1080px}` **sans marges auto**, donc collé à gauche : à 1920 px, le texte occupait 61 % du conteneur et laissait la moitié droite vide — le défaut exact que la doctrine D1 décrit, reproduit en croyant l'appliquer. | Bride retirée : la prose occupe la largeur offerte, première branche de D1. | **non** | Le socle écrit « ~1 080 px **centrés** » — le mot y est. C'est une lecture fautive de ma part, pas un défaut du texte. Consigné pour l'honnêteté du registre. |
| J'ai chargé trois `<link>` Google Fonts en croyant appliquer A1. | Retirés ; familles déclarées en tokens avec repli système. | **oui** | La faute d'attention est mienne, mais la **classe** ne l'est pas : le texte autorise explicitement ce que l'oracle refuse. Remonté en **RT-1bis** — c'est la deuxième occurrence en quatre jours. |
| J'ai d'abord mesuré la conformité avec un contrôle écrit par moi, faute des deux oracles du socle. | Les 17 contrôles maison sont conservés **et déclarés comme substituts** dans le livrable, avec la mention explicite que ce n'est pas équivalent à `check_html.py` + `render_page.py`. | **oui** | Exactement **RT-2** du lot du 27/08, toujours ouvert : les deux oracles vivent dans le skill, non vendorisé dans le sous-module `factory/` pinné de ce dépôt. Aucun livrable HTML d'ici ne peut être jugé comme la doctrine D7 l'exige. Pas de nouveau numéro : RT-2 suffit, et ce lot en est la seconde preuve de coût. |
| Trois indices publiés en une journée (`a`, `b`, `c`) pour un même livrable. | Les deux versions supplantées sont versées dans `output/old/03-Syntheses/`, conformément à la règle de nommage. | non | Coût de mon apprentissage du socle, pas un défaut de forge. Il est néanmoins la mesure de ce que RT-1bis et RT-4 coûtent à un nouvel arrivant. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** — et c'est le retour lui-même : la famille qui
conviendrait, une consolidation de process multi-produits, est absente du catalogue (RT-6).
Le livrable porte donc en en-tête `gabarit : candidat « consolidation-process »`, faute de
pouvoir renseigner G8 (identifiant de famille + `version_du_gabarit`). Le tableau ci-dessous
documente ce que cette absence a coûté.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - Process Ingénierie POC-to-Prod - Consolidation et cible - 20260831c.html` | **aucun** — famille absente du catalogue, déclarée en candidat « consolidation-process » dans l'en-tête | La famille elle-même (RT-6), et un **livrable de référence nommé** à ouvrir avant d'écrire : c'est en ouvrant `…PSO IA - 20260827b` que quatre questions ouvertes se sont fermées d'un coup. | Deux refus successifs du lecteur humain, **tous deux sur la forme** : indice `a` « le format ne respecte pas la Factory » ; indice `b` « défauts sur la largeur, et l'en-tête n'est pas fixe avec les onglets affichés en permanence ». La structure, elle, n'a été contestée à aucun des trois indices. | Toute la structure : synthèse décisionnelle à KPI cliquables, table de réconciliation étapes ↔ phases, fiches d'étape à champs imposés, carte de chaleur produit × étape, plans de rattrapage par produit, décisions numérotées à options et recommandation, annexe de traçabilité ligne à ligne, et une **annexe A6 de conformité de forme** qui dit où chaque règle du socle est tenue. | **générique** |
