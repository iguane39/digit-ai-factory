# Retours forges — Bibliothèque vidéo IA Ceetrus — 20260821c

- **Contexte** : retour humain de formatage du 21/08/2026 sur le livrable HTML remis, et reprise du générateur qui l'a produit
- **Références ledger** : sans objet — run de conseil mené hors socle de ledger produit
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-21

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Origine de ce lot** : deux demandes humaines de formatage (largeurs de colonnes dérivées du
contenu ; puces et sous-puces à la place des longs paragraphes) et, en les appliquant, deux
défauts mesurés sur les oracles du socle. S'y ajoute une question posée par l'humain — *les
modèles générés comme celui-ci sont-ils proposés à la factory pour être réutilisés ?* — dont la
réponse instruite est **non**, et qui devient RA-10.

---

## digit-ai-forge-agents (`digit-ai-forge-agents`) — skill `digit-ai-page-html`

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RA-6 | bloquant | **`<colgroup>` est compté comme une boîte qui recouvre `thead` et `tbody` : la voie HTML standard pour déclarer des largeurs de colonnes est interdite par l'oracle.** Mesuré le 21/08 : après ajout d'un `<colgroup><col style="width:…%">` par tableau, `render_page.py` a rendu **50 défauts V4 bloquants** de la forme `colgroup × thead — intersection 1630×42px (100 % du plus petit)` et `colgroup × tbody — intersection 1630×6530px`, à 1920 px et à 1280 px, sur une page par ailleurs saine. `colgroup` et `col` sont des éléments de mise en page à aire nulle : leur rectangle englobe par construction celui du tableau. Contournement appliqué faute de mieux : porter les largeurs sur les `<th>` de l'en-tête. | Exclure `colgroup` et `col` de l'analyse V4 (comme `position: fixed` l'est déjà), et ajouter une fixture rouge/verte : un tableau à `colgroup` légitime doit sortir PASS. |
| RA-7 | bloquant | **Un tableau dont les lignes n'ont pas le même nombre de cellules passe les trois oracles et rend un trou dans la page.** Mesuré sur pièce : cinq lignes du tableau de mesures portaient une barre verticale non échappée à l'intérieur d'un span `code` (alternatives de regex `grep -niE "deploy\|webapp\|acr"`, opérateur `\|\|` de shell). Résultat : 7 à 9 cellules pour un en-tête de 4, et au rendu **une demi-page blanche** sous la ligne `M-23`, visible sur la capture 1280 px. Or `check_html.py` a rendu **PASS (aucun problème détecté)** et `render_page.py` **PASS (0 bloquant)** sur cette même page. Aucun des deux ne compte les cellules. | Ajouter un contrôle de cohérence de tableau : nombre de cellules de chaque ligne du corps égal à celui de l'en-tête, sinon FAIL — c'est un défaut de STRUCTURE, pas de style, et il est invisible à la relecture. Fixture rouge : une ligne à cellule surnuméraire. |
| RA-8 | majeur | **Aucune guidance sur les largeurs de colonnes : un tableau charté répartit la largeur à parts égales, ce qui donne autant de place à une colonne d'identifiants qu'à une colonne de prose.** Retour humain du 21/08 sur le livrable : « des colonnes avec uniquement un ID n'ont pas besoin d'une largeur aussi importante ». Mesuré : sur un tableau d'actions à 4 colonnes, la colonne `#` (contenu le plus large : 1 caractère) recevait **25 %** de la largeur ; après dérivation depuis le contenu, elle reçoit **4,1 %** et les colonnes de texte passent de 25 % à 25 / 43 / 27 %. Heuristique retenue et vérifiée sur les 25 tableaux de la page : base = max(longueur de l'en-tête, 90ᵉ centile des cellules), poids = base^0,6, plancher 4 % / plafond 42 %, renormalisation ; les colonnes dont le contenu le plus large tient en 12 caractères passent en `white-space: nowrap`. | Verser l'heuristique et son snippet aux composants (à côté du repli en cartes de RA-4), ou au minimum la documenter dans `bonnes-pratiques.md` : un tableau de données n'est pas une grille régulière. |

## pilot (`digit-ai-factory`) — référentiel et boucle de capitalisation

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RA-9 | majeur | **Rien dans le socle ne demande d'organiser un texte long en puces : les règles de lisibilité couvrent le texte tronqué, les légendes, le sommaire, les chapeaux — pas le pavé de prose.** Retour humain du 21/08 : « pour les textes longs, favorise les puces et sous-puces pour organiser les idées, sujets ou actions / décisions ». Mesuré après reprise du même livrable : les blocs « Risque » et « Impacts » convertis en listes ancrées donnent **71 listes de lecture** et **243 puces**, les deux oracles restant PASS — la conversion ne coûte rien aux contrôles existants et change la lisibilité du document. Aucune règle L1-L14 ne l'aurait demandée, et aucun texte du référentiel ne l'esquisse. | Documenter la pratique dans `bonnes-pratiques.md` (un paragraphe qui énumère — marqueurs « (a) (b) (c) », « trois conséquences », « deux risques » — est une liste écrite en prose) ; et instruire une règle L en **avertissement** plutôt qu'en échec : un paragraphe de plus de N mots portant un marqueur d'énumération est un candidat à la mise en liste. |
| RA-10 | majeur | **Un livrable produit par un run n'est jamais proposé à la factory comme modèle réutilisable : le canal de capitalisation n'existe qu'en ENTRÉE.** Instruit le 21/08 sur les fichiers : `input\02-entrants-html\` porte le rôle « livrables HTML fournis comme référence ou source d'extraction (best practices, **modèles de rapport**) » et contient 3 fichiers, tous **déposés à la main** ; `references\BEST-PRACTICES-HTML.md` capitalise des *patterns de forme* (A1-F5) extraits de 2 de ces entrants, et son § Delta est soldé depuis le 14/08 ; `gabarits\` ne contient que des gabarits **écrits**, aucun dérivé d'un livrable produit. L'étape 7 de la séquence de run (`CLAUDE.md`) ne remonte que le lot de RETOURS. Conséquence : un modèle de document réutilisable — structure de sections + source markdown jugée par un oracle de contenu + générateur déterministe vers une page chartée jugée par deux oracles de forme — n'a aucun chemin pour entrer, et se réinvente à chaque run. | Ouvrir le canal sortant : à la clôture d'un run, proposer les livrables **de forme réutilisable** avec leur générateur, dans `input\02-entrants-html\` (le rôle du dossier le couvre déjà) ou dans un `gabarits\livrables\` dédié ; la décision d'en faire un gabarit reste humaine, comme pour un candidat TF. **Ce document est proposé comme premier cas** : il est déposé avec ce lot (cf. Confirmations positives). |

## Confirmations positives

- **Le document est déposé** : `Nhood - Diagnostic - Constats Prod avant MEP - Bibliotheque Video IA Ceetrus - 20260821a.html` est copié dans `<pilot>\input\02-entrants-html\`, au titre de RA-10 et conformément au rôle déclaré de ce dossier. Ce qu'il porte comme modèle, au-delà de son contenu métier : cinq sections au gabarit `DIAGNOSTIC-EXPLOITATION`, un tableau de mesures identifiées consommées par des recommandations ancrées, un bloc par constat (recommandation, constat repris, mesures, risque en puces, actions pas à pas avec preuve attendue, impacts en puces), et un **couple source/rendu** : le markdown fait foi et est jugé par `oracle-livrable-conseil`, la page est **générée** et jugée par `check_html.py` + `render_page.py`.
- **Les règles de lisibilité de TF-0423 ont fait exactement leur travail.** Le premier jet posait un chapeau *généré* identique dans le chapitre parent et dans ses 22 enfants, et un exemple de lecture *répété mot pour mot* 22 fois. L7 et L10 les ont nommés tous les deux, avec le bon diagnostic (« remplissage généré »), ce qui a conduit à dénester les chapitres et à instancier chaque exemple de lecture sur la première ligne de SON tableau. Sans ces deux règles, la conformité mécanique serait passée.
- **Le seuil de 60 mots du chapeau est bien calibré** : il a attrapé trois chapeaux à 61, 69 et 74 mots qui étaient effectivement des paragraphes déguisés, et laissé passer les 24 autres.
- **Le repli des tableaux en cartes tient toujours** après passage aux largeurs dérivées : 0 défaut V1 à 768 et 390 px, les largeurs en pourcentage étant neutralisées sous le point de bascule.

## Ordre recommandé

1. **RA-7** — un tableau qui rend un trou dans la page en passant les trois oracles est le défaut le plus grave du lot : il rend le verdict PASS non concluant sur la structure des tableaux.
2. **RA-6** — sans lui, la voie standard de déclaration des largeurs reste interdite, et RA-8 doit se contenter d'un contournement.
3. **RA-8** puis **RA-9** — les deux demandes humaines de formatage, à verser au référentiel pour ne plus être refaites par chaque run.
4. **RA-10** — le plus structurant, et le seul qui demande une décision de gouvernance plutôt qu'un correctif.
