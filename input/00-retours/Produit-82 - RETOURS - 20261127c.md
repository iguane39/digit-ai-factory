# Retours forges — Produit-82 — 20261127c

- **Contexte** : construction de 3 maquettes de tableau de bord de consommation (Claude, Codex, Gemini), le 27/11/2026, jugées par check_html, oracle-filtres-tableau, render_page et run-oracles-design.
- **Références ledger** : `forge\ledger.jsonl` seq 424, 425, 426, 427
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-27

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-page-html (skill du socle)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-64 | majeur | générique | Le 27/11/2026, 4 listes de filtres à choix multiples écrites en `<details>`/`<summary>` (LLM, modèle, équipe, usage) ont été rendues FAIL par la règle L9 de `check_html.py` : d'abord « détail vide », puis « dépliant qui cache trop peu : 50 caractères ». Un `<details>` qui porte un groupe de cases à cocher est un contrôle de formulaire, pas une explication repliée. Contournement : un bouton `aria-expanded` et un panneau `hidden`. Preuve : `forge\ledger.jsonl` seq 424. | Exempter de L9 un `<details>` dont le contenu est un groupe de cases (`role="group"`, `input type="checkbox"`), ou documenter au socle le motif bouton et panneau pour les listes à choix multiples. |
| RT-65 | mineur | générique | La capture pleine page de `render_page.py` à 1920 px fige l'en-tête collant au milieu de la page : une bande vide en tête, et l'en-tête peint vers 880 px, sur le graphique. Une revue de lecture faite sur cette capture voit un défaut absent de l'écran. Preuve : `forge\ledger.jsonl` seq 427. | Passer `header.colle` en `position: static` pendant la capture pleine page, ou orienter la revue vers les captures `ecranNN`. |

## quality-oracles

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-66 | majeur | générique | `oracle-filtres-tableau.mjs` a rendu FAIL G3 « tableau jamais initialisé » sur les 3 maquettes. Le code était `var t = document.getElementById('t-detail'); DigitAITableFilters.init(t)`. Le banc navigateur montrait pourtant les facettes construites et triées. Contournement : écrire `init(document.getElementById('t-detail'))`. Preuve : `forge\ledger.jsonl` seq 425. | Suivre l'affectation d'une variable locale jusqu'à l'identifiant du tableau, ou déclarer cette limite au `non_juge`. |

## digit-ai-factory (pilot)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-67 | mineur | générique | `scripts/mobiliser.mjs --preparer --type maquette` est refusé : la carte connaît produit-neuf, evolution, audit-complet, site-web, donnees, agent, mise-en-production, securite, donnees-personnelles et document. La demande « 3 maquettes de Dashboard » a été classée evolution, ce qui a exigé de design les livrables DESIGN.md et jetons, puis 4 passages pour motiver les écarts. Preuve : `forge\ledger.jsonl` seq 426. | Ajouter un type `maquette` à la carte : design mobilisée, development et ops écartées par défaut, DESIGN.md et jetons non exigés pour une maquette de démonstration. |

## Remarques restées au produit

- La règle D9 du produit interdit tout montant, alors que la demande portait sur le coût. Les maquettes affichent des euros fictifs, déclarés tels par un bandeau qui renvoie les tarifs réels à « À CHIFFRER PAR DIGIT-AI » (généralisable : non).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `embarquer-composants.mjs --poser` a posé le composant de filtres dans les 3 pages, et `--constat` a confirmé que les copies sont identiques à leur source.
- `render_page.py` a trouvé 4 défauts réels que la lecture du code ne montrait pas : une barre qui débordait à 3840 px, deux étiquettes de courbe superposées, un tableau qui débordait à 1024 px, des contrôles décalés de 3 px.

## Ordre recommandé

1. RT-66 : un faux FAIL sur un appel ordinaire du composant, que tout producteur rencontrera.
2. RT-64 : une liste à choix multiples est un motif courant des tableaux de bord.
3. RT-67, puis RT-65.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit pas une correction du porteur. La règle est qu'un oracle statique juge le motif et non sa forme d'écriture : un contrôle de formulaire n'est pas une explication, et un appel par variable reste un appel. Classes proposées :
- `oracle-statique-lie-a-une-forme-d-ecriture` (RT-64) ;
- `capture-pleine-page-et-entete-collant` (RT-65) ;
- `oracle-filtres-appel-par-variable` (RT-66) ;
- `carte-des-forges-sans-type-maquette` (RT-67).
