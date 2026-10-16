# Retours forges — Produit-02 — 20260902c

- **Contexte** : inspection humaine de la console v2 en production, une heure après sa
  livraison (run de version « console v2 », brief `forge/PROMPT-CONSOLE.md` v2).
- **Références ledger** : `forge\ledger.jsonl` seq 100 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-02

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node forge\retours\oracle-lot.mjs "<ce fichier>.md"
> ```
>
> Il rend **0** si la forme du lot est tenue, **1** sinon.

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT du produit (dernier employé : RT-74, lot 20260902b).

---

## Factory (`digit-ai-factory`)

Trois défauts de mise en page ont traversé quatre oracles verts et une revue visuelle, et
c'est l'humain qui les a vus en production : « beaucoup de défauts qui n'ont pas été vus
par les oracles alors que ça aurait dû être vus ». Le fait qui commande : l'oracle de rendu
**avait signalé** le débordement, et la session l'a classé « acceptable » parce que le
conteneur défilait. Un signal reclassé sans preuve n'est pas un signal jugé.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-75 | majeur | générique | **Une console de données a été livrée dans une colonne de lecture de 1 180 px, et ses tableaux à huit colonnes se rognaient.** Fait : `console/index.html` héritait de `.corps { max-width: 1180px }` ; à 1 440 px, le tableau V1 mesurait 1 301 px pour 1 136 disponibles, V3 1 256, V7 1 376 (mesures de `build/check-console-ui.py` après ajout du contrôle). `render_page.py` l'avait relevé (« V1 débordement horizontal … table#tab-v1 … 1 183 px pour 390 ») et la revue visuelle l'a classé « conteneur à défilement, acceptable pour un outil d'exploitant ». Preuve : `forge/captures/console-v2/REVUE-VISUELLE-console-v2-20260902.md`, section « écarts résiduels assumés », et le retour humain du 02/09 (« les pages doivent profiter de toute la largeur de l'écran »). | (1) Règle de socle explicite : une page de **données** (console, dashboard, tableau de bord) est pleine largeur et adaptative, la colonne de lecture (68-90 ch) ne vaut que pour la prose ; (2) `render_page.py` distingue « déborde de la fenêtre » et « rogné dans son conteneur défilant à largeur de bureau » — ce second cas est un **bloquant à ≥ 1 280 px** pour un tableau de données, jamais un « acceptable » ; (3) `oracle-verdict-visuel` refuse un « écart résiduel assumé » sur un débordement de tableau à largeur de bureau sans mesure prouvant qu'il tient. |
| RT-76 | majeur | générique | **Aucune règle ni oracle n'exige un sommaire de page dès qu'une page porte plusieurs chapitres.** Fait : l'onglet Volumes porte cinq vues et l'onglet Stratégie six blocs sur 4 000 px de haut ; aucune navigation intra-page n'était fournie, aucun oracle (lisibilité, rendu, verdict visuel) ne l'a demandée. Retour humain : « fournis un menu sur la gauche pour les différents chapitres de chaque page ». Preuve : capture `strategie-pleine.png` du 02/09 13:20 UTC, 1 440 × 4 020, sans sommaire. | Règle de lisibilité L-n : « au-delà de trois chapitres ou de deux écrans de haut, une page porte un sommaire visible en permanence (latéral au bureau, en bande sur mobile) » ; `oracle-lisibilite` (HTML) compte les `h2/h3` et exige un `nav[aria-label]` les listant ; `render_page.py` vérifie que ce nav reste visible après défilement. |
| RT-77 | mineur | générique | **Des champs de formulaire d'une même rangée n'étaient pas alignés**, parce que l'étiquette de statut (« hypothèse », « à renseigner ») passait à la ligne dans le libellé de certains champs et pas d'autres. Fait : capture `strategie-pleine.png` du 02/09 13:20 UTC, les quatre champs d'hypothèses sur deux hauteurs différentes ; aucun oracle ne mesure l'alignement des contrôles d'une grille. Retour humain : « problème aussi sur les textbox pas alignés ». | `render_page.py` ajoute un contrôle V-n « contrôles d'une même rangée de grille alignés » : pour tout conteneur `display: grid` de champs, les `input/select` dont le haut diffère de plus de 2 px au sein d'une rangée (même `offsetTop` de cellule ± 60 px) sont un défaut ; règle de socle : l'étiquette de statut se place sous le champ, jamais dans le libellé. |

## Remarques restées au produit

Deux corrections locales, dont une généralisable et remontée ci-dessus.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Colonne des mots-clés écrasée sur trois lignes dans le tableau à douze colonnes (V2) | largeur minimale de 22 ch sur les cellules de texte, colonnes courtes (marché, date, statut, pic) sans retour à la ligne | oui | classe « une colonne de texte se fait écraser par les colonnes numériques » — couverte par RT-75 (pleine largeur) et par le contrôle de rognage ajouté à l'oracle navigateur du produit |
| En-têtes de colonnes trop longs pour la largeur disponible (« Volume mensuel cumulé », « Impressions estimées ») | libellés raccourcis, sens conservé par le chapô de la vue | non | choix rédactionnel du produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur cette correction — vérifié par la session, le
02/09/2026.

## Confirmations positives

- **L'oracle navigateur du produit a rendu les trois défauts mesurables en dix lignes** :
  largeur du contenu, présence du sommaire, rognage de V1, V3 et V7, alignement des champs —
  3 échecs à la première passe, 37/37 après correction. C'est le contrôle qu'il aurait fallu
  écrire avant la livraison, pas après.

## Ordre recommandé

RT-75 d'abord (la règle et le reclassement interdit sont la cause racine), RT-76 ensuite,
RT-77 en dernier.
