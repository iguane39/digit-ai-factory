# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20260903a

- **Contexte** : mise en conformité Factory d'un livrable HTML existant (« Ordonnancement des
  étapes de MEP », indice 20260903a) — rebâti sur le socle `digit-ai-page-html` 1.18.0, jugé par
  `check_html.py`, `render_page.py` (fermé et états ouverts) et `oracle-filtres-tableau.mjs`,
  journal R-32 écrit sous `forge/oracles/`. Décision humaine du 03/09/2026 de remonter ce lot.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici. Statut : `a_remettre` → `remis le <date>`
- **Statut** : remis le 04/09/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Origine de ce lot.** La demande tenait en une ligne : *« mets à jour le fichier pour être
conforme à la Factory »*. La conformité s'est prouvée en trois oracles et quatre largeurs de rendu,
et elle a été atteinte. Quatre faits ont coûté au passage, et aucun n'est propre à ce projet :
une famille de document que la bibliothèque ne connaît pas, un défaut de mise en page du
boilerplate que ses deux oracles ne voient pas, un outil du socle inutilisable hors du dépôt des
skills, et une contradiction entre ce que le gabarit de lot autorise et ce que la porte
d'ingestion refuse.

---

## `pilot` — bibliothèque de gabarits et porte d'ingestion

Le catalogue des familles de documents et la porte d'ingestion des lots ont tous deux laissé un
trou mesurable pendant ce travail.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-37 | majeur | générique | **Aucune famille de `gabarits\documents\catalogue.jsonl` ne couvre un plan d'ordonnancement de mise en production — le document le plus lu d'un passage en production n'a ni gabarit, ni squelette, ni fil `gabarit` + `version_du_gabarit`.** Mesuré le 03/09/2026 sur les 30 familles du catalogue : `dossier-mep` est `porte_ailleurs` (« la forme est prescrite par l'étape MEP du pilot », format `md`, sources `ETAPE-MEP.md`), `checklist-go-prod` est `porte_ailleurs` chez forge-audit (« liste de présence, chaque ligne portant sa preuve »), `dossier-cab` est `a_extraire`. Aucune ne décrit un **ordonnancement** : étapes identifiées, nature du geste, dépendances, propriétaire, niveau de blocage, preuve de fin, phases datées. Conséquence : la page a été bâtie **entièrement à la main** sur le boilerplate — en-tête, KPI, légende, sept tableaux, chapitre des inversions — et son en-tête déclare « aucun gabarit », ce qui rend tout retour ultérieur sur sa forme impossible à rattacher (G8). Le même trou existait déjà dans ce projet pour la fiche sécurité (RA-33 du 24/08 : « aucune version portée par le document »). | Créer la famille **`ordonnancement-mep`** (ou étendre `dossier-mep` d'un format HTML) : sections fixes *comment lire · lots ordonnés · écarts hors chemin · inversions interdites · lecture pour le comité*, tableau normatif à colonnes fixes (`#`, objet, nature, à faire, dépend de, propriétaire, bloquant, preuve de fin), badges de nature et de blocage avec légende, valeur d'ordre `data-v` sur les colonnes temporelles. **Provenance disponible** : ce livrable, jugé PASS par les trois oracles — la bibliothèque extrait ses familles de livrables réels, celui-ci en est un. |
| RA-40 | majeur | générique | **Le gabarit de lot et la porte d'ingestion se contredisent sur le retour sans classe.** `gabarits\RETOURS-FORGES.md` (§ classe obligatoire) écrit : *« Aucune clé ne convient ? Le dire dans le `.md` … et laisser le pilot créer la classe dans son référentiel : une classe ne se crée jamais dans un sidecar. »* Or `todo\ingerer-lot.mjs` (bloc « classe déclarée », seuil `2026-09-03`) refuse **le lot entier, atomiquement**, dès qu'une ligne de sidecar a une classe absente ou inconnue : *« classe manquante — … Une classe nouvelle se crée dans le référentiel … jamais dans le sidecar »*. Le producteur qui suit le gabarit à la lettre voit donc tout son lot rejeté, y compris ses retours correctement classés. Mesuré sur ce lot même : RA-38 ci-dessous n'a aucune clé dans les 30 du référentiel (famille `page-html-socle` : polices distantes, sticky superposés, teinte de refus, largeur de lecture, sommaire absent, grille non alignée, dictionnaire de colonnes, filtres, temps affiché, liste sans détail — rien sur le repli en cartes). **Sa ligne de sidecar est volontairement retenue** pour ne pas faire tomber RA-37 et RA-39 avec elle. | Deux gestes, l'un ou l'autre. (a) **Une valeur sentinelle admise par l'ingestion** — `"classe": "a_creer"` avec un champ `"classe_proposee": {cle, famille, regle}` — qui entre en file d'attente au lieu de rejeter le lot, et crée un item de registre « classe à créer » pour le pilot. (b) Sinon, **aligner le gabarit sur la porte** : écrire qu'un retour sans classe **ne va pas au sidecar** et reste dans le `.md`, et que le pilot le saisit à la main — c'est ce que ce lot fait, faute de mieux. *Un gabarit qui promet une porte que le code ferme fait payer la contradiction au premier producteur qui la rencontre.* |

## `digit-ai-page-html` — le boilerplate et son outil de pose

Le socle a tenu l'essentiel : trois oracles ont trouvé quarante défauts réels sur la page d'origine
et n'ont laissé passer qu'un seul défaut visible. C'est celui-là, et l'outil qui a manqué pour
embarquer les composants.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-38 | majeur | générique | **Le repli en cartes du boilerplate éclate toute cellule au contenu riche en fragments, et aucun des deux oracles ne le voit.** `assets/boilerplate.html` prescrit sous 900 px : `table.repli-cartes td { display: grid; grid-template-columns: minmax(9ch, 38%) 1fr }` avec le libellé en `td::before`. Ce modèle suppose **une cellule = un nœud texte**. Dès qu'une cellule contient `<strong>`, `<code>` ou plusieurs nœuds — le cas ordinaire d'une colonne « ce qu'il y a à faire » — **chaque enfant devient un item de grille** : le libellé prend la première case, puis le texte se répartit en deux colonnes phrase par phrase. Mesuré le 03/09/2026 sur la page en cours, capture à 1 280 px : la cellule « Contrôle croisé des **affirmations partagées** entre DAT, DEX… » se rendait sur quatre lignes alternant colonne gauche et colonne droite ; à 390 px, la cellule S-27 rendait ses huit `<code>` en huit cases empilées à gauche, chacune suivie d'une virgule orpheline à droite. **`check_html.py` : PASS 36/36. `render_page.py` : PASS aux quatre largeurs** — rien ne déborde, rien ne se chevauche, le contraste tient ; le texte est simplement illisible. Trouvé uniquement en regardant la capture. Le squelette `dossier-exploitation/INSTANCE.html` porte la même règle, avec des cellules de démonstration à un seul nœud texte — le défaut n'y est pas visible par construction. | **(1) Correctif de socle** : remplacer la grille par l'empilement — `td { display: block }` et `td::before { display: block }` — c'est la forme que `composants.md` § 6 (paliers mécanisés, TF-0558) prescrit déjà ; le boilerplate contredit sa propre référence. Appliqué chez le produit, verdict inchangé aux oracles, lecture rétablie sur les captures. **(2) Une mesure au rendu** : dans `render_page.py`, un `td` en `display: grid` dont le nombre d'enfants rendus (nœuds texte non vides + éléments) dépasse 2 est un bloquant de famille « cellule éclatée » — c'est mécanique, et c'est exactement ce que V1/V2/V4 ne mesurent pas. **(3) Instancier le squelette avec des cellules riches** avant publication (même mécanisme que RA-35 du 24/08 : un squelette qui n'a été éprouvé que sur des cellules d'un mot n'a pas été éprouvé). |
| RA-39 | mineur | générique | **`scripts/embarquer-composants.mjs` ne sert qu'au dépôt des skills : un produit qui veut embarquer un composant du socle réécrit le poseur.** Le module exporte `blocCanonique`, `echapper` et `sha` — mais son analyse d'arguments s'exécute **à l'import** (`if (constat === ecrire) { … process.exit(2) }`), donc `import { blocCanonique } from '…/embarquer-composants.mjs'` termine le processus avec le code 2 avant toute utilisation ; et `--ecrire` ne parcourt que `SKILLSROOT` (« pose dans les pages du dépôt des skills »). Conséquence mesurée le 03/09/2026 : pour embarquer `table-filters.js`, `table-filters.css` et `find-in-page.js` avec les marqueurs `COMPOSANT-EMBARQUE` et l'empreinte sha256 que `oracle-parite-assets` attend, le produit a réimplémenté le format du bloc en Python (échappement de `</script`, trois lignes de commentaire, attributs `data-composant` / `data-empreinte`). Une copie **conforme au format** mais produite par un second outil — la classe de défaut que ce script a précisément été écrit pour éliminer (« une copie manuelle est une fourche silencieuse »). | Séparer l'API du point d'entrée : l'analyse d'arguments sous `if (import.meta.url === pathToFileURL(process.argv[1]).href)`, et une commande `embarquer-composants.mjs --poser <page.html> --composants a.js,b.css` qui pose les blocs dans **n'importe quel fichier**, hors du dépôt des skills. La parité serait alors jouable des deux côtés par le même code, comme `oracle-lot-retours.mjs` l'est pour les lots. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Thème piloté par `prefers-color-scheme`, favicon absent, sommaire absent, tableaux sans filtre ni repli, 21 contrastes insuffisants, largeurs bridées à 64-71 % | Page rebâtie sur le boilerplate du socle ; chaque contrôle rouge → vert consigné au journal `forge/oracles/… - 20260903a.json` | non | Défauts d'une page écrite hors socle ; les règles existent toutes (A2, G1, L2, L4, L13, L25, V1, V2) et les ont trouvés — rien ne manque au socle |
| Rangée de contrôles jugée désalignée (V11) entre le champ de recherche de la colonne latérale et les boutons de facette du corps | `data-alignement-ok` sur la grille document, avec motif | **peut-être** | Une grille « colonne latérale + corps » n'est pas une rangée de formulaire ; V11 la prend pour telle dès qu'un `input` et un `button` sont enfants du même conteneur `grid`. Un seul cas observé : non remonté, à surveiller si le squelette DEX (même grille) le rencontre |
| Les 4 autres HTML récents du dossier de sortie (DAT, DEX, rétro-ingénierie, reste à traiter) portent les mêmes défauts et n'ont pas de journal R-32 | **Non corrigés**, décision humaine du 03/09 (option « ne rien faire ») | non | Écart R-32 propre à ce projet, connu et déclaré ; il sera rendu par le contrôle de conformité du pilot |
| Tiret « — » dans la colonne Bloquant (contraste 2,4:1, sans légende) | Badge « non bloquant » avec légende | non | Choix de rédaction local |
| Tri armé par défaut sur des tableaux dont l'ordre EST le sens (ordonnancement) | Laissé armé : le tri par propriétaire sert la lecture « qui fait quoi » | non | Arbitrage propre au document ; la sortie `data-tf-tri="off"` existe si un lecteur s'en plaint |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output/Client-A - Ordonnancement des etapes de MEP - Produit-65 - 20260903a.html` | **aucun** — la famille la plus proche du catalogue, `gd-dossier-mep`, est `porte_ailleurs` et sans squelette (RA-37) ; l'en-tête du document déclare « aucun gabarit » et cite le socle `digit-ai-page-html` 1.18.0 | Toute la structure : sections, colonnes normatives, badges de nature et de blocage, exemple de lecture par lot | Le propriétaire métier a exigé la conformité Factory du document tel qu'il avait été livré la veille — c'est la demande de ce jour, pas une supposition | L'intégralité de la page (en-tête, KPI, légende double, sept tableaux, écarts, inversions, conclusion), le journal R-32 et la déclaration d'absence de gabarit | **générique** — tout projet qui passe en production produit ce document |

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot** — vérifié par l'agent le
03/09/2026 : le seul document produit n'avait pas de famille, c'est l'objet de RA-37.

## Confirmations positives

- **Les deux oracles du socle se complètent comme la doctrine D7 l'annonce** : `check_html.py` a
  trouvé 11 bloquants statiques (A2, G1, L3, L4 ×4, L13, L18, L25) et `render_page.py` en a trouvé
  d'autres que le premier ne peut pas voir — 21 contrastes V2 par largeur, 2 brides L2, 8
  débordements V1 à 768 et 390 px. Aucun des deux n'a rendu de faux positif sur la page finale.
- **Le snippet S-G1** (quatre morceaux, R-30) a fonctionné à la première pose : clair par défaut,
  bascule persistée, `color-scheme` suivant le thème, impression claire — vérifié en capture sombre.
- **Le composant `table-filters`** (TF-0782 : une facette par en-tête, exemption motivée par
  colonne, compteur `data-tf-count-for`) s'est câblé en une passe sur cinq tableaux ; l'oracle
  `oracle-filtres-tableau.mjs` a nommé exactement ce qui manquait (G4 `id`, G5 compteur, G6 print)
  et a rendu PASS après.
- **La grille latérale collante du squelette DEX** (TF-0787) transposée telle quelle a fait passer
  `sommaire_perdu` sur bureau ; le cas mobile a demandé une bande repliable, comme la règle L25 le dit.
- **Le journal d'un autre produit** (`Produit-02.com/forge/oracles/`) a servi de modèle de
  format R-32 sans ambiguïté — la convention est stable d'un produit à l'autre.

## Ordre recommandé

1. **RA-38 (1)** — une ligne de CSS dans le boilerplate, et le défaut disparaît de tous les
   documents à venir. Coût quasi nul ; c'est le seul retour dont l'absence de correction produit un
   livrable illisible que les oracles déclarent vert.
2. **RA-40** — trancher la contradiction gabarit / ingestion, parce qu'elle bloque la remontée
   automatique de tout retour sur une classe nouvelle, RA-38 compris.
3. **RA-37** — la famille `ordonnancement-mep`, avec ce livrable pour provenance : moyen × court,
   la structure est déjà écrite et jugée.
4. **RA-38 (2)** puis **RA-39** — la mesure au rendu et l'outil de pose, utiles mais sans coût
   immédiat pour les livrables.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain sur le rendu : les quatre ont été trouvés par les
oracles, par la lecture des captures ou par l'exécution des outils. Les classes désignées, et
celles qui manquent :

- **RA-37** → classe `gabarit-famille-manquante` (règle : `gabarits/documents/catalogue.jsonl`,
  oracle G8). Ligne de sidecar présente.
- **RA-38** → **aucune clé du référentiel ne couvre ce défaut.** La règle qui l'aurait évité existe
  pourtant : `composants.md` § 6 prescrit l'empilement, et le boilerplate ne la suit pas. Clé
  proposée au pilot : `page-html-repli-cartes-cellule-eclatee`, famille `page-html-socle`, règle
  `references/composants.md § 6 ; assets/boilerplate.html`, oracle `render_page.py` (mesure à
  créer, proposition (2)). **Ligne de sidecar retenue jusqu'à création de la clé** — c'est RA-40.
- **RA-39** → classe `oracle-remplace-par-controle-maison` (le producteur réécrit un outil du socle
  faute de pouvoir l'employer). Ligne de sidecar présente.
- **RA-40** → aucune clé : le défaut est une contradiction entre deux textes du pilot. Clé
  proposée : `gabarit-contredit-par-la-porte`, famille `restitution-forme` ou nouvelle famille
  `boucle-retour`. Ligne de sidecar retenue, pour la même raison que RA-38.
