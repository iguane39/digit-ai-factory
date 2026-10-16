# Retours forges — Produit-62 — 20260908a

- **Contexte** : dixième retour humain sur le mandat forge-data `20260907-lineage-tenancy-schedule-asset`, sur la page HTML de proposition (version m du 2026-09-07) : « Le rapport HTML doit inclure la liste de tous les champs du rapport Power BI pour avoir une vision exhaustive du mapping, de sa complétion et de sa cohérence. Ce listing doit pouvoir être filtré, trié, recherché […] le nombre de champs du rapport, ainsi que les principaux KPIs du rapport ne sont pas rappelés en début de document, impossible de le savoir. Les bulles des statuts des champs ne sont pas non plus suffisamment différentes […]. Le mapping doit également afficher tous les KPIs, nombre de champs, nombre de champs existants, à ajouter…, manquants ? » Corrigé côté produit dans la version `20260908a` de la page (chiffres clés en tête avec le dénominateur, trois tableaux exhaustifs filtrables — 342 colonnes, 160 mesures, 25 requêtes — statut « Manquant » compté, badges à fond plein et glyphe). Ce lot porte les trois causes de socle.
- **Références ledger** : `forge\ledger.jsonl` seq 35 (retour humain et causes), seq 36 (page 20260908a et verdicts), seq 37 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-08

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## forge-agents (`digit-ai-forge-agents`, skill `digit-ai-page-html`)

La page jugée PASS par `check_html.py` (36 règles), `render_page.py` (trois largeurs) et `oracle-filtres-tableau.mjs` la veille affichait un tableau de mapping de 47 lignes sans jamais dire combien de champs le rapport source compte (342 colonnes, 160 mesures), ni combien n'ont aucune ligne (38 et 22, mesurés le soir même par la recette). Ses cartes « chiffres clés » renvoyaient au rapport Markdown (« élément hors de cette page »). Ses badges de palier employaient les cinq teintes pastel du socle (`--green-fill`, `--teal-fill`, `--amber-fill`, `--red-fill`, `--surface`), toutes à contraste texte/fond conforme, et l'humain ne les distinguait pas entre elles.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-6 | majeur | générique | **Aucune règle du socle n'exige qu'une page de mapping ou de couverture affiche son DÉNOMINATEUR et la liste exhaustive des éléments qu'elle couvre.** `references\BEST-PRACTICES-HTML.md` § I (I1 pleine largeur, I2 sommaire, I3 alignement, I4 dictionnaire de colonnes, I5 temps) et `lisibilite.md` L1–L29 ne parlent que de la forme de ce qui est affiché, jamais de la complétude d'un tableau par rapport à sa population source. Mesure : page `output\old\Client-A - Proposition Lineage Tenancy Schedule Asset - 20260907m.html` — 47 lignes de mapping, quatre cartes « chiffres clés » dont deux renvoient hors page (`kpi-hint` : « élément hors de cette page : voir le rapport Markdown »), aucun compteur de colonnes source ; `check_html` PASS, `render_page` PASS, `oracle-filtres-tableau` PASS. La recette jouée le même soir (`forge\etapes\data\recette-proposition.py`) rend 38 colonnes et 22 mesures sans ligne : la page présentait comme complet un mapping qui ne l'était pas, et rien ne pouvait le dire au lecteur. Correction produit : version `20260908a` — six cartes en tête (colonnes du rapport 342, couvertes 304, manquantes 38, mesures 160 dont 22 manquantes, requêtes 25, lignes 47), cartes par palier qui filtrent le tableau exhaustif, chapitre « Tous les champs du rapport » (trois tableaux filtrables/triables/cherchables, manquants en tête). | Règle I6 candidate (BEST-PRACTICES § I, contrôle `check_html`) : une page de données dont un tableau représente une couverture (mapping, inventaire, conformité — détectable par un `caption` ou un `th` portant « mapping », « couverture », « statut ») affiche, AVANT le tableau, le dénominateur (« N éléments source ») et le compte des éléments sans correspondance ; et porte un tableau exhaustif au grain de l'élément source (`data-population="<N>"` sur la table, `N` = nombre de `tr` du tbody, comparé par `check_html`). Une carte KPI qui dit « voir ailleurs » est un constat (`page-html-liste-renvoi-sans-detail`). |
| RA-7 | majeur | générique | **Les teintes d'état du socle sont indiscernables entre elles pour le lecteur ; l'oracle ne mesure que le contraste texte/fond de chaque badge, jamais la distinguabilité ENTRE états ni la présence d'un indice non colorimétrique.** Tokens du boilerplate : `--green-fill #DCFCE7`, `--teal-fill`, `--amber-fill #FEF3C7`, `--red-fill #FEE2E2`, `--surface` : cinq fonds pastel de luminance voisine (L* ≈ 93 à 97), texte encré. `render_page.py` V2 vérifie 4,5:1 texte/fond par élément → PASS. Retour humain, mot pour mot : « Les bulles des statuts des champs ne sont pas non plus suffisamment différentes pour être suffisamment différenciées ». WCAG 1.4.1 (« la couleur n'est pas le seul moyen ») n'est pas contrôlé non plus : un badge pastel sans glyphe repose sur la teinte. Correction produit : fonds pleins distincts (vert #166534, bleu #0F5F8F, ambre #92400E, rouge #B91C1C, gris #4B5563 barré, violet #7E22CE), texte blanc ≥ 4,5:1 mesuré, un glyphe par palier (● ＋ ◐ ✎ ✕ ?), légende visible reprenant couleur + forme + libellé. | V16 candidate (`render_page`) : pour un jeu de badges d'état d'une même page (même classe de base, ≥ 3 variantes), mesurer la distance de couleur entre fonds deux à deux (ΔE ≥ 20 ou différence de luminance ≥ 0,25) et exiger un indice non colorimétrique commun (glyphe, forme ou libellé distinct) ; documenter dans `charte-et-tokens.md` que les tokens `*-fill` sont des fonds de CARTE, pas des fonds de BADGE d'état, et fournir des tokens `*-solid` avec encre blanche. |

## forge-data (`digit-ai-forge-data`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-3 | majeur | générique | **Un mapping livré et jugé PASS par les oracles de forge-data n'a jamais été mesuré contre l'inventaire de sa source.** `oracle-tracer` (lineage@1, T1–T7) juge la complétude d'un lineage déclaré ; `oracle-modeliser` la forme d'un modèle ; `oracle-restituer` l'ancrage des chiffres d'un rapport. Aucun ne prend en entrée l'inventaire de la source mappée (ici 342 colonnes, 160 mesures, 25 requêtes lues par pbixray) pour rendre un taux de couverture et la liste des orphelins. Le produit a écrit son propre contrôle (`forge\etapes\data\recette-proposition.py`, `oracle-couverture-pbix.py`, `oracle-coherence-proposition.py`) : couverture 304/342, 22 mesures orphelines, 1 incohérence Silver, 28/28 SQL — trouvés après deux jours et trois synthèses PASS. | Oracle `oracle-couvrir` (schéma `couverture@1`) : entrées = inventaire source (liste d'éléments `{table, colonne}` ou `{objet}`, produit par un importeur : pbixray pour un PBIX, information_schema pour une base) + mapping (CSV ou JSON avec une colonne « objet source ») + règles de rattachement déclarées (nommé, table entière, exclusion motivée) ; sortie = taux, orphelins, éléments couverts par exclusion ; PASS seulement à 0 orphelin. Le script du produit est un point de départ ; `importer` de forge-data gagne un verbe `pbix` (déjà demandé en RD-2). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Chiffres clés sans dénominateur, cartes renvoyant hors page | version `20260908a` : six cartes de population et couverture, cartes par palier filtrant le tableau exhaustif | oui | remontée (RA-6) |
| Aucun listing exhaustif des champs | chapitre « Tous les champs du rapport » : 342 colonnes, 160 mesures, 25 requêtes, chacune avec statut, rattachement, ligne de mapping, Gold et Silver ; filtrable, triable, cherchable ; manquants en tête | oui | remontée (RA-6, RD-3) |
| Badges de palier indiscernables | fonds pleins + glyphes + légende ; contraste blanc/fond ≥ 4,5:1 vérifié par `render_page` | oui | remontée (RA-7) |
| La version m de la page reste dans `output\old\` avec son journal R-32 | règle 7 appliquée (`git mv`), journal R-32 de `20260908a` nomme la version remplacée | non | propre au run |
| Les 38 colonnes et 22 mesures « Manquant » ne sont pas encore rattachées | la page les AFFICHE et les compte ; leur rattachement est la reprise du mapping (A-18), jugée par la recette | non | propre au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- Le composant `table-filters` du socle tient 342 lignes × 7 colonnes et 160 lignes × 5 colonnes sans réglage : filtres par facette, tri, compteur ; `oracle-filtres-tableau` PASS.
- `kpi-filter.js` filtre un tableau par attribut `data-statut` depuis des cartes : trois jeux de cartes vers trois tableaux dans la même page, sans conflit.
- `check_html` L10 a exigé un exemple de lecture dès que le tableau des actions a atteint huit lignes : la règle suit la donnée.

## Ordre recommandé

1. RD-3 — parce qu'un oracle de couverture aurait rendu FAIL le mapping le premier jour, avant trois synthèses PASS et un retour humain.
2. RA-6 — parce que la page est le livrable lu ; sans dénominateur affiché, aucun lecteur ne peut juger la complétude.
3. RA-7 — deux lignes de tokens et une règle de distance de couleur.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les trois items suivent un retour humain. Aucune règle existante ne couvrait exactement le fait ; les plus proches sont nommées. Classes : RA-6 → `page-html-liste-renvoi-sans-detail` (famille `page-html-socle`, correspondance exacte pour les cartes « voir le rapport Markdown » ; le dénominateur absent est une instance nouvelle de la même classe : la page renvoyait ailleurs ce qu'elle devait porter) ; RA-7 → `page-html-teinte-refus` (famille `page-html-socle`, voisine : même sujet des teintes d'état, ici l'indistinction entre elles ; classe candidate proposée au pilot : `page-html-etats-indiscernables`) ; RD-3 → `oracle-remplace-par-controle-maison` (famille `skill-ou-oracle-non-invoque`, correspondance exacte : le producteur a écrit son propre contrôle faute d'oracle du socle).
