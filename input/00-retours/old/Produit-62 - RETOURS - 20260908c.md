# Retours forges — Produit-62 — 20260908c

- **Contexte** : douzième retour humain sur le mandat forge-data `20260907-lineage-tenancy-schedule-asset`, sur la page HTML de proposition (version `20260908c`) : « Mets les chapitres et sous-chapitres ensemble. Et certaines cellules de certains tableaux n'ont pas d'explications ou de descriptifs de leurs contenus. » Capture : dans le tableau « Le rapport aujourd'hui », la cellule `LOC.FAI_LOT_MOIS + DIM_BATIMENT, …` affichait pour infobulle la définition de la colonne (« Tables du DWH SQL Server LOC, REF, REFGEO interrogées par la requête embarquée ») et non l'explication des objets nommés ; le menu de gauche séparait le sommaire des chapitres d'un bloc « Sous-chapitres ». Corrigé côté produit dans la version `20260908e` (menu unique hiérarchisé ; dictionnaire des objets de l'entrepôt hérité, des grains, des familles d'articles et des volumes ; 0 cellule à identifiant sans explication sur 3 953). Ce lot porte les deux causes de socle.
- **Références ledger** : `forge\ledger.jsonl` seq 43 (retour humain et causes), seq 44 (page `20260908e` et verdicts), seq 45 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-08

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## forge-agents (`digit-ai-forge-agents`, skill `digit-ai-page-html`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-13 | majeur | générique | **Faute de sommaire imbriqué admis par L7 (RA-11, lot 20260908b), un menu unique chapitres + sous-chapitres n'est possible qu'en remplaçant les liens de sous-chapitre par des BOUTONS — une régression sémantique imposée par l'oracle.** Retour humain : « mets les chapitres et sous-chapitres ensemble » (le bloc séparé « Sous-chapitres » de la version `20260908c`, contournement de RA-11, n'était pas acceptable pour le lecteur). Seule forme qui passe `check_html` avec un menu unique : `<ol class="toc-sous">` sous chaque entrée de `nav.toc`, dont les entrées sont des `<button data-cible="#id">` (L7 ne lit que les `<a href="#…">` du sommaire) avec défilement et focus posés en JavaScript. Mesure : 15 boutons, clic sur « Mesures DAX » → cible placée sous l'en-tête collant (`--hh-tab`), hash mis à jour, sommaire toujours visible ; `check_html` PASS. Coût : un lien de navigation qui n'est plus un lien (pas de clic-milieu, pas de copie d'adresse, pas d'ancre sans JavaScript), et un contournement que le prochain produit devra redécouvrir. | Même remède que RA-11, priorité relevée : L7 dédoublonne par ÉLÉMENT et juge les descendants DIRECTS de la cible ; tant que ce n'est pas fait, `lisibilite.md` L25 doit dire explicitement qu'un sommaire à deux niveaux est admis avec des `<a>` et comment (cible = bloc `div.souschap` contenant `h3` + `.ch-apprend`), et `check_html` doit le laisser passer. Classe candidate : `oracle-impose-un-contournement`. |
| RA-14 | majeur | générique | **Un générateur n'a d'explication que pour les objets d'un catalogue joint ; les objets d'un système cité mais jamais joint (entrepôt hérité SQL Server, paramètres du PBIX) n'ont aucun dictionnaire, et l'infobulle retombe sur la définition de la colonne — que l'humain lit comme « pas d'explication ».** Version `20260908c` : 2 981 infobulles, dont celles des colonnes « Source DWH legacy » et « Source legacy (requête M) » ne portaient que la définition de colonne (capture humaine sur `LOC.FAI_LOT_MOIS + DIM_BATIMENT…`) ; les grains (`lot × bail × mois`), les familles d'articles (« famille 20 ») et les volumes (« 755 088 ») n'étaient pas expliqués non plus. Aucune règle du socle (I4 dictionnaire de colonnes, L3 légende) ne demande qu'un système source CITÉ par une page ait un dictionnaire de ses objets. Correction produit `20260908e` : dictionnaire déclaré de 28 objets de l'entrepôt hérité (source : requêtes M du PBIX et analyse du mandat, source écrite dans chaque infobulle), 3 schémas, 9 familles d'articles, 6 grains, volumes expliqués (« 755 088 lignes chargées… statistiques pbixray ») ; prose libre sans infobulle (elle s'explique elle-même) ; mesure : 3 953 cellules, 3 153 avec infobulle, 0 cellule à identifiant technique sans explication (contre 900 tautologiques la veille et ~200 génériques ce matin). | I4 bis (BEST-PRACTICES § I) : toute page qui nomme les objets d'un système source (préfixe de schéma, identifiants en majuscules, noms techniques) déclare un dictionnaire de ces objets — lu dans le catalogue quand il est joint (Unity Catalog, information_schema), ÉCRIT et sourcé quand il ne l'est pas — et `check_html` L3 ter : une cellule portant un identifiant technique (motif `[A-Z]{2,}_[A-Z0-9_]+`, `schema.table`) dont le `title` est identique à la définition de colonne du `th` = constat « objet non expliqué ». |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Menu en deux blocs | menu unique : sous-chapitres sous leur chapitre, boutons de navigation (`.toc-lien-sous`), défilement sous les collants, hash mis à jour | oui | remontée (RA-13) |
| Cellules de l'entrepôt hérité sans explication | dictionnaire `LEGACY` (28 objets), `LEGACY_SCHEMAS`, `FAMILLES`, `GRAINS` dans le générateur, source déclarée dans l'infobulle | oui | remontée (RA-14) |
| Prose libre affublée d'une infobulle générique | plus d'infobulle sur une cellule de ≥ 5 mots sans identifiant | oui | inclus dans RA-14 |
| Volumes sans explication | infobulle « N lignes chargées dans la table X (statistiques pbixray, lecture du 2026-09-07) » | oui | inclus dans RA-14 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- `check_html` accepte un `<button>` dans `nav.toc` sans constat : la forme est valide, seule sa nécessité est un défaut.
- Le comptage des cellules « à identifiant sans explication » est un contrôle de dix lignes rejouable ; il a rendu 0 dès la première passe après le dictionnaire.

## Ordre recommandé

1. RA-13 — parce que le contournement dégrade la sémantique de navigation de toute page qui voudra un sommaire à deux niveaux.
2. RA-14 — parce qu'une règle simple (un système cité a un dictionnaire) ferme la classe.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les deux items suivent un retour humain. Classes : RA-13 → `page-html-sommaire-absent` (famille `page-html-socle`, voisine : récidive de RA-11 avec un coût nouveau ; classe candidate `oracle-impose-un-contournement`) ; RA-14 → `page-html-dictionnaire-colonnes` (famille `page-html-socle`, voisine : dictionnaire des OBJETS d'un système source, pas seulement des colonnes du tableau ; classe candidate `page-html-systeme-cite-sans-dictionnaire`).
