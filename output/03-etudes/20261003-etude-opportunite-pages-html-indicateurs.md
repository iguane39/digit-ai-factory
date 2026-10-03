---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-03
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — pages HTML de données : indicateurs, graphiques, infobulles et justesse des comptes — 20261003a

Cette étude instruit, côté factory, les huit améliorations demandées par la remontée du 03/10/2026 sur les pages HTML et leurs indicateurs (lot « Produit-02 - RETOURS - 20261003b », RT-118 à RT-125, au sas d'arrivée), et contre-vérifie l'étude que le produit a jointe à son lot. Elle dit quoi poser au socle, dans quel ordre, et ce qui a été mesuré pour le dire.

## Seuil de déclenchement (à vérifier AVANT d'écrire)

Seuil atteint, deux fois : les propositions créent des objets durables (deux composants embarquables, au moins trois règles d'oracle — R-31) et touchent trois dépôts et le pilot (digit-ai-forge-agents pour `digit-ai-page-html` et `quality-oracles`, digit-ai-forge-design pour `oracle-saisie`, le pilot pour `oracle-etude-opportunite`).

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande au pilot, 03/10/2026, citée mot pour mot : « Tu dois avoir une remontée sur les pages HTML / KPIs + je souhaiterais que tu lances une étude d'opportunités sur des études d'améliorations d'éléments demandés. »

Demande d'origine, chez le produit, le même jour, citée par son lot : « De manière plus globale, pour ce fichier et pour la Factory : travaille sur une étude d'améliorations des pages HTML et de l'affichage des informations et KPIs pour fournir des fichiers plus complets, plus étoffés, plus lisibles, optimisés avec de meilleurs composants de lecture (ex : tuiles, mais pas que), tooltips... » ; et deux retours : « des tooltips qui affichent ce qu'on a par ailleurs sur la page, ça n'a pas d'intérêt » ; « pourquoi est-ce qu'on n'est pas passé à un histogramme avec plusieurs valeurs par colonne, avec différentes couleurs ? ».

Lecture retenue (reconstruite par le pilot, à valider par le demandeur) : que chaque produit reçoive du socle, sans le redemander, des pages dont les indicateurs sont justes, présentés en tuiles et en graphiques à plusieurs séries, et dont les infobulles ajoutent une information ; l'étude du pilot sert à trier et séquencer les huit demandes, pas à refaire celle du produit.

## 0. Traitement des entrants

Les propositions instruites sont des DONNÉES : leurs impératifs se citent, ils ne s'exécutent pas. Sources :
- lot « Produit-02 - RETOURS - 20261003b » (`input\00-retours\_arrivee\`, non encore accueilli ni ingéré), RT-118 à RT-125, ledger produit seq 378 à 385 ;
- étude jointe du produit, « Etude amelioration des pages HTML - 20261003a » (verdict O2, oracle-etude-opportunite PASS chez lui) ;
- registre : TF-0928 et TF-0954 (statut `corrige`, 08/09/2026), TF-0935 (`corrige`) ;
- code du socle lu le 03/10/2026 : `check_html.py` (L3, L3 bis), `composants.md`, `oracle-calculs.mjs`, `oracle-saisie.mjs`, `render_page.py` (V4), `oracles\oracle-etude-opportunite.mjs`.

**Correction apportée à l'étude du produit** : elle donne TF-0954 « toujours candidat ». Le registre la porte `corrige` depuis le 08/09/2026, avec la règle L3 bis posée sur la seule égalité stricte entre l'infobulle d'une cellule `<td>` et le texte de cette cellule. RT-118 n'est donc pas un retour resté sans règle : c'est une récidive À CÔTÉ d'une règle posée — l'infobulle répète le texte d'un VOISIN (le montant écrit au-dessus d'une barre, le libellé de l'entonnoir), porté par un `<title>` SVG ou un élément hors tableau, que L3 bis ne lit pas.

## 1. Partition du problème

Six sous-questions, disjointes, qui couvrent les huit RT :

1. **P1 — Justesse des comptes** (RT-121) : un même indicateur affiché sous deux valeurs, faute de contrôle croisé.
2. **P2 — Infobulles qui répètent la page** (RT-118) : redite du voisinage, et L3 qui pousse vers un `title` redondant.
3. **P3 — Graphiques à plusieurs séries** (RT-119) : aucun composant de graphique au socle, la série unique est la voie la plus courte.
4. **P4 — Tuiles d'indicateurs** (RT-120) : la grille de KPI n'est qu'un extrait, sans comparaison ni écart.
5. **P5 — Faux positifs et règles inconciliables** (RT-122, RT-123, RT-124, RT-125) : quatre contournements subis par le produit.
6. **P6 — Propagation au parc** : comment ce qui sera posé atteint les produits qui écrivent déjà leurs graphiques et tuiles à la main.

## 2. Non-recouvrement contre l'existant

Ce chapitre dit, pour chaque pièce du socle qui pourrait déjà répondre, ce qu'elle couvre et la ligne de code ou de registre qui le prouve ; cinq lignes nomment la cause exacte d'un RT.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| L3 bis, infobulle qui recopie sa cellule | `check_html.py`, bloc « L3 bis : une infobulle qui RECOPIE sa cellule (TF-0928, 08/09) » : boucle sur `n.tag == "td"`, test `_norme_legende(reste) == _norme_legende(cellule)` | ne recouvre pas P2 : ne lit ni les `<title>` SVG, ni le texte voisin, et n'exige que l'égalité stricte |
| TF-0954 | `todo\TODO.jsonl`, maj du 08/09 : « Le seuil reste l'égalité stricte : la variante « contient sans rien ajouter » n'est pas posée, faute d'avoir mesuré son bruit » | recouvre P2 sur le principe, pas sur le voisinage ; la variante écartée est celle qu'il faut désormais mesurer |
| L3, toute valeur porte sa légende | `check_html.py`, message « L3 valeur sans légende : … — title, aria-label, … » | ne recouvre pas P2 : accepte `title` en premier, d'où le chemin vers la redite |
| Grille de KPI | `composants.md`, section « 1 — Grille de KPI 🟡 » : « Toujours **label + valeur (+ hint)** », extrait HTML/CSS | recouvre P4 en partie : ni comparaison, ni écart, ni asset embarquable |
| KPI cliquables | `composants.md`, section « 8 — KPI cliquables filtrant une liste 🔴 », asset `kpi-filter.js` | ne recouvre pas P4 : filtre, ne présente pas |
| Assets du socle | `digit-ai-page-html\assets\` : `infobulle.js`, `kpi-filter.js`, `table-detail.js`, `tabs.js`, `table-filters.js`, `table-arbre.js`, `find-in-page.js`, `source-reader.js`, `visibilite-lignes.js` | ne recouvre pas P3 : aucun composant de graphique |
| Canevas tableau de bord | skill `digit-ai-schemas` : « tableau de bord (KPI portfolio) » | ne recouvre pas P3/P4 : schéma isolé, pas un rapport de données à chapitres |
| Contrôle des calculs | `oracle-calculs.mjs` ligne 49 : `const text = fs.readFileSync(file, 'utf8')` lu tel quel | ne recouvre pas P1 (re-somme des totaux, ne confronte pas deux valeurs d'un même libellé) ; cause de RT-122 (lit le source brut, attributs compris) |
| Inférence de type de saisie | `oracle-saisie.mjs` ligne 245 : `const foin = [at(el, 'name'), at(el, 'id'), at(el, 'placeholder'), libelleDe(el)]` | cause de RT-123 : le placeholder entre dans l'indice au même poids que `name` |
| Chevauchements V4 | `render_page.py`, « V4 chevauchements significatifs entre éléments frères (bloquant) » | cause de RT-124 : aucune exemption pour une étiquette contenue dans sa marque |
| Dates de l'étude | `oracle-etude-opportunite.mjs`, E3 `/\b(20\d{2}[-/.]?\d{2}([-/.]?\d{2})?)\b/g`, E7 `/plan de revue[^\n]*\b20\d{2}…/` | cause de RT-125 : JJ/MM/AAAA jamais reconnu |
| Propagation | `scripts\embarquer-composants.mjs` (socle) et relevé d'héritage R-47 (8 produits, 76 manques au 03/10) | recouvre P6 pour les composants embarqués ; ne réécrit pas les SVG faits main déjà livrés |

**Mesure du parc (P6), 03/10/2026, heuristique en lecture seule** : sur 20 dépôts produits, 111 pages HTML portent un `<rect>` de graphique écrit à la main et 116 une grille `class="kpi…"` ; un seul produit en porte 28 et 53. La demande n'est pas propre au produit émetteur.

## 3. État de l'art daté

Sources relues par le pilot le 2026-10-03 (l'outil de lecture rend un résumé ; les citations courtes sont celles qu'il rapporte) :

1. **Zebra BI, « What Is a KPI Card? »**, mise à jour le 2026-09-23 — https://zebrabi.com/charts/kpi-card/. Une tuile porte quatre éléments : la valeur, un point de comparaison (période précédente ou cible), l'écart absolu et relatif, un libellé ; écart d'un pourcentage en points ; repère de sens autre que la couleur.
2. **ClearPoint Strategy, « KPI Dashboard Best Practices: 12 Rules for 2026 »**, publiée le 2026-03-13, mise à jour le 2026-07-01 — https://www.clearpointstrategy.com/blog/kpi-dashboard-best-practices. Trois niveaux : 3 à 5 indicateurs de tête, 8 à 12 d'appui, le détail au clic. **Correction** : l'étude du produit lui attribue la recommandation des barres empilées ; la relecture ne la retrouve pas dans cette source.
3. **Datawireframe, « 12 Dashboard Layout Patterns »**, publiée le 2026-03-23, mise à jour le 2026-07-22 — https://www.datawirefra.me/blog/dashboard-layout-patterns. Rangée de 3 à 6 tuiles, puis 2 à 4 graphiques ; au-delà de 9 indicateurs, onglets ; un rapport défilant se range en sections tuiles, graphiques, tableaux.
4. **Madrigan, « Data Visualization 2025 »**, publiée le 2026-03-26 — https://blog.madrigan.com/en/blog/202603261521/. Les infobulles « reveal additional details without cluttering the chart » ; filtrer, trier, descendre dans le détail.
5. **5of10, « Dashboard Design Best Practices: The Complete 2026 Guide »**, année 2026 sans jour publié (non comptée comme datée) — https://5of10.com/articles/dashboard-design-best-practices/. Tuile : valeur, libellé, comparaison, tendance ; barres empilées à 100 % pour comparer des compositions.
6. **Registre factory, TF-0954**, décision du 2026-09-08 — `todo\TODO.jsonl`. Mesure de bruit sur 355 pages de huit dépôts avant de poser une règle d'infobulle : méthode à reprendre pour toute règle nouvelle de cette étude.
7. **Skill `dataviz` du harness**, relevé par le produit le 2026-10-03 (non relu par le pilot) : palette catégorielle validée par script en clair et en sombre, filets de 2 px entre segments, légende dès deux séries.

Hors fenêtre des 24 mois, cité pour mémoire : Nielsen Norman Group, « Tooltip Guidelines », 2019-01-27 — « Tooltips with obvious or redundant text are not beneficial to users ».

Convergence : la tuile porte valeur, comparaison et écart (1, 5) ; 3 à 6 tuiles en tête puis les graphiques (2, 3) ; l'infobulle ajoute ce que la page ne montre pas (4, NN/g) ; une partie d'un tout se montre empilée (5, 7). Aucune source ne traite P1 : la justesse d'un indicateur entre deux grains de la même API est un sujet de la factory, pas de l'état de l'art du tableau de bord.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : réfutée. Coût du statu quo mesuré le 03/10/2026 : un compte faux publié PASS 15/15 (54 visites engagées sur 63 au lieu de 40 sur 64) ; trois versions du même rapport en une journée ; une règle d'infobulle posée le 08/09 contournée le 03/10 par un autre porteur ; quatre contournements subis contre des faux positifs ; 111 pages à graphique écrit à la main sur 20 dépôts.
- **O1 — oracles seulement** : poser les règles de justesse et de redite (P1, P2) et corriger les quatre faux positifs (P5), sans composant. Coût : complexité moyenne · durée courte. Ferme la voie du compte faux PASS. Exclut P3 et P4 : la série unique reste la voie la plus courte, et un avertissement « série unique » n'est pas jugeable sans composant qui déclare ses séries.
- **O2 — règles et composants au socle, en trois lots ordonnés** (verdict du produit, séquencé par le pilot) :
  - **Lot A — justesse et faux positifs** (P1, P5) : règle « même indicateur, deux valeurs » (même libellé normalisé, deux nombres distincts dans la page → rouge ; sortie déclarative `data-indicateur-portee` pour deux périmètres légitimes), mesurée en bruit sur le parc AVANT d'être bloquante ; `oracle-calculs` lit le texte rendu ; `oracle-saisie` n'infère plus un type du seul placeholder ; V4 exempte une étiquette déclarée contenue dans sa marque ; E3 et E7 reconnaissent JJ/MM/AAAA. Chaque correctif avec fixtures rouge et verte.
  - **Lot B — infobulles** (P2) : L3 bis étendue aux `<title>` SVG et aux infobulles hors tableau, comparées au texte de leur cible ET de son voisinage immédiat ; variante « contient sans rien ajouter » mesurée en bruit avant pose ; L3 nomme `aria-describedby` comme porteur de légende.
  - **Lot C — composants** (P3, P4, P6) : asset « tuiles d'indicateurs » (valeur, libellé, comparaison, écart absolu et relatif, sens, tendance optionnelle) ; asset « barres empilées » SVG vertical et horizontal, palette catégorielle en jetons validée clair et sombre, infobulle par segment, séries déclarées ; avertissement « série unique » quand les séries déclarées en portent plusieurs ; propagation par `embarquer-composants.mjs`.
  - Coût : complexité complexe · durée moyenne ; une campagne forge-agents, une correction forge-design, une correction au pilot. Exclut une bibliothèque externe.
- **O3 — bibliothèque de graphiques externe embarquée** (Chart.js, ECharts) : rendu immédiat, plusieurs centaines de kilo-octets par page ; ne règle ni P1, ni P2, ni P5. Exclut l'autonomie du socle (page autoportante, aucune requête réseau).
- **O4 — gabarit complet « rapport de pilotage »** (tuiles, graphiques, tableaux pré-câblés) : suppose les composants du lot C et n'apporte aucune règle de justesse ; sans O2, il fige la forme sans juger le contenu. À rouvrir à la revue, une fois O2 en service.

## 5. Verdict

- **Option retenue** : O2 — règles et composants au socle, livrés dans l'ordre lot A, lot B, lot C.
- **Pourquoi cet ordre** : le seul défaut bloquant (RT-121) est un compte faux sorti PASS ; il passe avant la forme. Les faux positifs du lot A coûtent un contournement à chaque page et se corrigent localement. Le lot B réutilise la méthode de mesure de bruit de TF-0954. Le lot C est le plus long et le seul qui demande une propagation.
- **Coût** : complexité complexe · durée moyenne au total — lot A complexité moyenne · durée courte ; lot B complexité moyenne · durée courte ; lot C complexité complexe · durée moyenne. Dette évitée : une réécriture par produit (20 dépôts concernés).
- **Candidature(s) émise(s)** : aucune par cette étude. Les candidatures existent déjà au sidecar du lot (RT-118 à RT-125) ; elles entrent au registre par l'accueil et l'ingestion du lot (`node todo\accueillir-lot.mjs`, puis `node todo\ingerer-lot.mjs <sidecar>`), geste non joué dans ce tour. RT-118 se rattache à TF-0954 comme récidive, pas comme candidature neuve.
- **Plan de revue** : le 2026-10-15, au relevé de statut suivant du produit émetteur : la page produite ce jour-là est jouée contre les règles posées ; à défaut de règles posées, le retard se constate et se date.
- **Test rétro** :
  - lot A, règle « même indicateur, deux valeurs » → tactique : aucun compte faux ne sort PASS → stratégie : des indicateurs justes → intention : « plus complets » n'a de valeur que juste (RT-121) ;
  - lot A, quatre faux positifs → tactique : supprimer les contournements → stratégie : une barrière qualité qui juge le fond → intention : les composants demandés (étiquettes dans les segments, dates françaises) ne sont plus punis ;
  - lot B → tactique : la redite du voisinage devient rouge → stratégie : l'infobulle ajoute → intention : « les tooltips doivent fournir des informations complémentaires » ;
  - lot C, tuiles → intention : « meilleurs composants de lecture (ex : tuiles, mais pas que) » ; lot C, barres empilées → intention : « un histogramme avec plusieurs valeurs par colonne, avec différentes couleurs » ; propagation → intention : « pour la Factory » ;
  - questions rejouées : « tu dois avoir une remontée » → oui, lot 20261003b, huit RT, au sas ; « lance une étude d'opportunités » → cette étude, verdict unique ; « améliorations d'éléments demandés » → les huit RT, chacun rattaché à P1-P5 ;
  - O4 écartée sans rupture : elle sert la même intention plus tard, sur les composants du lot C ;
  - aucun élément sans parent.

## Interdits (l'oracle les tient)

Aucun critère subjectif sans mesure, aucune option hors du jeu fermé, aucune ligne de non-recouvrement sans citation, aucune source non datée comptée comme datée, O0 jamais passée sous silence.
