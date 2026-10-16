# Retours forges — Produit-68 — 20260924a

- **Contexte** : 2 retours humains du 24/09/2026 sur le rapport d'audit remis le 20/09 au format de référence du commanditaire. Le premier : « Revois la largeur du document pour être conforme aux règles de la Factory ». Le second : « Le schéma d'architecture n'est pas conforme. Pourquoi cela n'a pas été vu et corrigé ? Corrige et remonte à la Factory pour correction. » Les 2 défauts avaient passé les 4 juges du socle de page ; ce lot remonte les raisons.
- **Références ledger** : `forge\ledger.jsonl`, entrées `type: retour` des étapes `largeur-rapport` et `schema-architecture` : seq 213 et 214 (retours RP-50 et RP-51 du journal, repris ici sous RG-10 et RG-9), seq 249 à 251 (RG-7, RG-8, RP-53), seq 252 et 253 (remarques restées au produit).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, le 24/09/2026, sur la demande humaine « remonte à la Factory pour correction ». Les lots 20260919a, 20260919b et 20260920a du produit restent à remettre : ce lot ne les reprend pas.
- **Statut** : remis le 24/09/2026 au sas `<pilot>\input\00-retours\_arrivee\`

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort, précision).

---

## forge-agents (`digit-ai-forge-agents`, skill `digit-ai-page-html`)

Les 2 défauts du rapport, une largeur plafonnée à 1 280 px et un schéma d'architecture illisible et faux, ont passé `check_html.py` et `render_page.py` sans un constat. 4 angles morts les expliquent ; chacun est mesuré sur la page remise le 20/09.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RG-7 — contraste d'un texte SVG jugé sur la mauvaise paire | majeur | générique | **V2 lit la mauvaise paire** : il juge un texte SVG sur sa propriété `color` et sur le fond de ses ancêtres HTML, alors que ce texte est peint par `fill` sur la forme posée dessous. Sur le schéma d'architecture du rapport : 28 libellés sur 35 à 1:1 ou 1,05:1 sur leur boîte, dans les 2 thèmes, et V2 muet. Un libellé de la couleur de sa boîte passe donc V2 : le faux PASS que TF-0582 décrit pour les fonds peints hors `background-color`. | Pour un `text` ou un `tspan`, lire `fill` comme couleur de texte et prendre pour fond la forme remplie posée dessous dans le même groupe ; sinon, déclarer le texte SVG non mesuré au `non_juge`. Règle qui aurait évité le retour : V2 de `zero-defaut-visuel.md`, qui ne regardait pas cette paire. |
| RG-8 — une ligne droite ne chevauche jamais rien pour V4 | majeur | générique | **Une flèche droite échappe à V4** : V4 compare des boîtes englobantes, et une flèche droite a une boîte d'aire nulle. Sur le même schéma : 5 liaisons tracées en ligne droite à travers les boîtes intermédiaires, cachées derrière elles, soit 11 traversées et 18 paires de flèches confondues, sans un constat V4. À l'inverse, 42 des 45 constats V4 du schéma venaient de la boîte d'une flèche coudée, qui recouvre des éléments que le trait ne touche pas. | Juger les segments d'une polyligne, d'une ligne ou d'un chemin : un segment qui entre dans une autre boîte, ou 2 segments colinéaires sans extrémité commune. L'étape 8 de `forge\etapes\audit\outils\sonde-rapport-reference.py` en donne une forme exécutable. Règle qui aurait évité le retour : « routage des flèches sans superposition » de `digit-ai-schemas`, qu'aucun oracle ne joue hors de ses canevas. |
| RG-9 — seule la vue d'accueil est jugée, et rien ne le dit | majeur | générique | **Une seule vue jugée** : `render_page.py` ne rend que l'état initial d'une page, et son `non_juge` ne le déclare pas. Le rapport a 7 modes ; 6 ne sont jamais rendus. Rejouées sur 11 vues à 8 largeurs, ses propres mesures relèvent sur la page du 20/09 ce qu'aucun juge n'avait vu : paragraphes bridés dans 6 vues, tableau rogné, prose à 171 caractères par ligne, et tout le schéma d'architecture. Verdict rendu le 20/09 : PASS aux 7 largeurs. | Publier au `non_juge` que seul l'état initial est jugé ; offrir une déclaration des vues d'une page applicative (liste de gestes, ou attribut sur les commandes de vue) pour y rejouer les familles. La porte publique `mesure_js()` de la version 1.24.0 a permis à la mission de le faire sans recopier une formule. |
| RG-10 — le plafond de largeur n'est lu que sur 6 sélecteurs | majeur | générique | **6 sélecteurs lus, pas un de plus** : la règle L2 de `check_html.py` ne lit un plafond en px que sur `body`, `main`, `.wrap`, `.container`, `.page` et `#page`. Le rapport posait son conteneur sur `.app`, à 1 280 px : 67 % d'une fenêtre de 1 920 px et 33 % d'une fenêtre de 3 840, sous le plancher de 75 % de la règle E4, et `check_html` a rendu PASS, 0 échec. | Repérer le conteneur principal par sa position (le bloc de flux qui porte l'essentiel du contenu) et non par son nom, ou mesurer au rendu le rapport entre ce conteneur et la fenêtre sur toute page, et pas seulement sur une page déclarée page de données. Règle qui aurait évité le retour : E4 de `BEST-PRACTICES-HTML.md`. |

## pilot (`digit-ai-factory`)

La revue de lecture aurait montré le schéma illisible sur sa première capture ; rien n'a exigé qu'elle soit faite.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-53 — la revue de lecture obligatoire n'a pas de juge à la remise | majeur | générique | **Une obligation sans juge** : le socle de page exige un `REVUE.md` avant toute livraison HTML (TF-0422), et aucun contrôle ne l'exige chez un produit au moment de la remise. Le rapport remis le 20/09/2026 sous `output\01-audit\` n'en avait pas, et son schéma illisible a vécu 4 jours dans un livrable remis. Le hook page-html du produit joue l'oracle des filtres ; `oracle-conformite-projet` ne regarde pas la revue ; le socle confie ce contrôle à `run-oracles`, qu'un produit ne lance pas. | Faire exiger, par `oracle-conformite-projet` ou par le hook page-html, un `REVUE.md` daté et non vide, plus récent que chaque `.html` remis sous `output\`. Règle qui aurait évité le retour : la revue de lecture obligatoire du skill `digit-ai-page-html`, écrite et jouée nulle part chez un produit. |

## Remarques restées au produit

5 remarques sont restées à la mission ; chacune porte son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La mise au socle du format de référence comptait `fill` parmi les couleurs de texte : les fonds de boîte du schéma sont devenus la couleur de leur libellé. | `socle-format.mjs` : le `fill` d'une forme est un fond ; une boîte et son libellé forment une paire de famille, vérifiée dans les 2 thèmes. Étape 8 de la sonde passée de 56 libellés sous 4,5:1 à 0. | oui | La classe qui l'a laissée passer est remontée : RG-7. L'outil lui-même est propre à la mission. |
| Le routage du gabarit de référence trace une liaison interne à une bande à travers les nœuds intermédiaires, et une liaison longue à travers le voisin de sa source. | `schema-routage.js` remplace l'étape de routage : ports et voies propres à chaque flèche. Étape 8 passée de 11 traversées et 18 paires confondues à 0. | oui | La classe est remontée : RG-8. Le moteur de la forge d'audit ne porte pas ce routage, 0 occurrence le 24/09. |
| Revenir au mode Rapport d'audit depuis l'onglet Schéma levait une erreur JavaScript, présente aussi sur la page de référence. | Garde dans `renderPanel` : l'onglet Schéma est redessiné. Étape 8 : 0 erreur au retour. | non | Rien de généralisable : défaut du gabarit remis par le commanditaire. |
| Le gabarit plafonnait sa page à 1 280 px et ses modes à 3 largeurs différentes. | Page de données déclarée, pleine largeur, prose tenue dans ses conteneurs de lecture. Étape 7 de la sonde passée de 188 défauts à 0. | oui | Les classes sont remontées : RG-9 et RG-10. |
| La sonde lisait une couleur pendant sa transition de 150 ms, puis, sous mouvement réduit, dans la même image que le clic. | Mesure sous mouvement réduit, et attente courte après chaque geste. | non | Rien de généralisable : la sonde est un outil de la mission ; `render_page.py` ne mesure pas après un clic. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le rapport suit le format de référence du commanditaire, par décision humaine du 20/09/2026.

## Confirmations positives

- La porte publique `mesure_js()` et `mesure_large_js()` de `render_page.py` (version 1.24.0) a permis de rejouer les mesures du socle sur 11 vues et 8 largeurs sans recopier une formule.
- Le groupe SVG titré (TF-0424) et la paire déclarée (TF-1146) ont suffi à faire passer V4 au schéma corrigé, avec des déclarations calculées et non posées en bloc.
- `verifier-remediation.mjs` de la forge d'audit a extrait les 159 actions à l'identique à chaque rendu, 3 indices dans la journée.

## Ordre recommandé

1. RG-7, parce qu'un texte illisible passe aujourd'hui le seul contrôle de contraste du socle dès qu'il est dans un SVG.
2. RG-9, parce qu'il ouvre aux autres familles de mesure toutes les vues d'une page applicative, ce qui aurait vu les 2 défauts de ce lot.
3. RP-53, parce que la revue de lecture est le seul contrôle qui voit ce que les oracles ne mesurent pas encore.
4. RG-8, puis RG-10.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les 5 retours de ce lot suivent un retour humain ; chacun nomme sa règle dans sa colonne « Proposition esquissée ». Les règles existaient toutes, écrites : V2 de `zero-defaut-visuel.md` (RG-7), le routage sans superposition de `digit-ai-schemas` (RG-8), la transparence du `non_juge` (RG-9), E4 de `BEST-PRACTICES-HTML.md` (RG-10) et la revue de lecture obligatoire (RP-53). Aucune n'était jouée sur ce livrable : le trou n'est pas dans les règles, il est entre les règles et leurs juges.
