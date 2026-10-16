# Retours forges — Produit-79 — 20261007a

- **Contexte** : clôture du run Produit-79 du 07/10/2026 (ouverture, étape conception, rendu de la fiche produit)
- **Références ledger** : `forge\ledger.jsonl` seq 28, 29, 30, 31, 32, 33, 34, 35, 36, 37 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

Les retours 29 à 37 ont été observés pendant la session et consignés au ledger à la clôture, avec
l'heure de leur écriture. Le retour 28 a été consigné au moment même.

## pilot (`digit-ai-factory`)

Le run a coûté deux remises à niveau du poste avant l'ouverture, et cinq contournements de règles
de conformité en remplissant le socle documentaire.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-1 | majeur | générique | `node scripts\readme-dossiers.mjs --base .` a créé 458 `README.md` dans `input\Media\`, une arborescence de médias de l'utilisateur (5 187 fichiers) apparue pendant la session. `input\` est en lecture seule pour tout producteur. Les 458 fichiers ont été retirés aussitôt, en ne visant que ceux qui portaient l'en-tête du générateur et dataient de cette commande (ledger seq 28) | borner le script à `input\` et `output\` de premier niveau, ou exclure tout sous-dossier d'`input\` que le run n'a pas créé |
| RP-2 | majeur | générique | `oracle-skills` K11/K2 déclarait la copie installée de `digit-ai-page-html` « modifiée après sa dernière propagation ». Or `check_html.py` et `render_page.py` y étaient identiques aux blobs des commits `6a64883` et `8678939` de la source (`git hash-object`). `--appliquer` refusait d'écraser, et le poste restait « non prêt » (seq 29) | confronter la copie aux blobs de l'historique de la source avant de conclure à un travail non versionné |
| RP-3 | majeur | générique | `bootstrap.mjs --pull` laissait le pilot « en retard de 83 commits ». La cause, non nommée par le message : une ligne locale dans `todo\HERITAGE-RELEVES.jsonl`, journal écrit par un oracle et versionné, bloquait le fast-forward (seq 30) | sortir ce journal de l'arbre versionné, ou faire nommer par `bootstrap` le fichier qui bloque le pull |
| RP-4 | mineur | générique | `oracle-conformite-projet` R-24 lit « aucun nom d'hôte ne s'écarte de la règle R-24 » comme une prose d'écart : le motif « écart » n'a pas de borne de mot (seq 31) | borner le motif au mot entier |
| RP-5 | mineur | générique | R-13 : `robots.txt` et `llms.txt`, posés à la racine par `adopter-projet-existant.mjs`, suffisent à refuser la déclaration « documentaire » d'un produit au stade conception. Il a fallu déclarer `FORGE_ROOT` dans `.env.example` (seq 32) | ne pas compter comme signal de site les artefacts posés par l'adoption elle-même |
| RP-6 | mineur | générique | `llms.txt` posé par l'adoption garde ses marqueurs de gabarit (`{Produit}`, `{Accueil}`) et aucune règle ne le signale (seq 33) | étendre à `llms.txt` la détection de marqueurs non instanciés de R-20 |
| RP-7 | mineur | générique | des titres imposés par les gabarits `docs-projet`, par exemple « Ce que le produit ne fait volontairement pas » dans FONCTIONNEL, sont refusés par `oracle-ecriture` EC-8 comme tournures d'annonce (seq 34) | aligner gabarit et oracle : exempter les titres de gabarit, ou les reformuler |
| RP-8 | majeur | générique | aucune famille de `gabarits\documents\catalogue.jsonl` ne couvre une fiche produit, c'est-à-dire un périmètre fonctionnel en paliers tiré d'un référentiel d'exigences. La fiche de conception a été écrite avec `famille: aucune — candidature remontée` (seq 35) | créer une famille `gd-fiche-produit` ; forme disponible dans `output\Produit-79 - Fiche produit - 20261007a.html` chez ce produit |

## forge-agents (`digit-ai-forge-agents`)

Le skill `digit-ai-page-html` a produit une page conforme. Sa matrice d'états a pourtant jugé un tableau que le lecteur ne voit pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | majeur | générique | `render_page.py --matrice-etats` actionne le premier `.tf-btn` du document, même s'il appartient à un panneau d'onglet masqué. L'état « filtre-sans-resultat » est alors déclaré muet, alors que le message existe : relevé Chromium du 07/10/2026, « Aucune ligne ne correspond aux filtres », compteur « 0 ligne sur 8 » en classe `zero`. La même page rend PASS servie avec `#existant` (seq 36) | ne retenir que les déclencheurs visibles, ou ouvrir le panneau du tableau avant de jouer l'état |

## forge-conception (`digit-ai-forge-conception`)

Les quatre verbes et les six oracles ont tenu. Une seule convention manquait.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-1 | mineur | générique | `ETAT.json` ne porte qu'un verbe, alors que les 4 verbes écrivent dans le même dossier d'étape. La session a improvisé `ETAT-<verbe>.json`, accepté par `oracle-etat` (seq 37) | fixer la convention de nommage d'un ETAT par verbe dans un même dossier |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le générateur de la fiche insérait son script d'initialisation à la première occurrence de la balise de fin de corps, qui se trouvait dans un commentaire du boilerplate, retiré ensuite | insertion à la dernière occurrence (`rfind`) dans `rendre_fiche.py` | non | défaut de ce générateur : le boilerplate ne cite plus de balise en clair depuis A5, sauf dans ce commentaire, et un générateur qui retire les commentaires ne le rencontre qu'une fois |
| Un exemple de lecture affirmait que les réservations pèsent le plus au MVP, alors que le socle en compte 20 contre 13 | exemple calculé depuis `EXIGENCES.json` | non | erreur d'auteur, corrigée par la règle déjà écrite : un chiffre se calcule depuis sa source |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. La fiche produit n'a pas de
famille (RP-8). Elle part du boilerplate du socle `digit-ai-page-html` 1.26.0.

## Documents mûrs

Aucun document mûr sur ce lot : la fiche produit en est à son premier indice et n'a pas encore de verdict de son lecteur.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `adopter-projet-existant.mjs` pose le socle complet d'un dossier vide en 25 éléments, après un essai qui n'écrit rien. Idempotent et non destructif comme annoncé.
- `ledger.mjs append` a refusé un `etape_close` sans `resume` en nommant le champ dû (TF-1366).
- Les six oracles de conception ont rendu des messages qui nomment la règle et l'exigence. Trois passes ont suffi.
- `oracle-tracabilite` T3 et T5 ont rehaché la vue scellée (7 053 caractères, empreinte identique).
- `check_html.py` et `render_page.py` publient leur périmètre de non-mesure. Il a orienté la revue de lecture, qui a trouvé deux défauts hors de leur champ.

## Ordre recommandé

1. RP-1 : un outil de forge a écrit dans les données de l'utilisateur. Le correctif est un bornage de parcours.
2. RA-1 : faux rouge sur toute page à onglets portant des tableaux filtrables, une combinaison que le socle prescrit lui-même.
3. RP-2 et RP-3 : ils bloquent l'ouverture de tout run sur ce poste avec un message qui ne nomme pas la cause.
4. RP-8 : la famille `gd-fiche-produit` a déjà une instance réelle.
5. RP-4 à RP-7 et RC-1 : faux positifs et conventions mineures.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain : tous viennent d'oracles ou d'observations de la
session. Deux retours n'ont pas de classe au référentiel, et portent une classe proposée :

- RP-1 : clé proposée `outil-de-forge-ecrit-dans-input`, famille `emplacement-livrable`, libellé « Un outil de forge écrit dans `input\`, réservé aux entrants humains et en lecture seule pour tout producteur ».
- RP-3 : clé proposée `fraicheur-bloquee-par-journal-versionne`, famille `heritage-produit`, libellé « Un journal écrit par un oracle est versionné et bloque la mise à jour du dépôt qui le porte ».
