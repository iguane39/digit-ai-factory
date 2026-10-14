# Lot de retours — Produit-81 → digit-ai-forge-agents, digit-ai-forge-design et skill client-a-schemas (schéma d'architecture contre les oracles HTML) — 2026-10-13, indice b

**Émetteur** : produit `Produit-81`, mission d'audit en lecture seule d'un dépôt tiers · **Cibles** : `digit-ai-forge-agents` (`digit-ai-page-html/scripts/render_page.py`), `digit-ai-forge-design` (`oracles/oracle-bascule.mjs`, `oracles/oracle-tokens.mjs`) et le skill `client-a-schemas`.

**Origine** : demande du porteur, le 13/10/2026 : « Construis un schéma d'architecture complet détaillé de l'application, incluant les flux entrants et sortants », en charte Client-A. Le livrable est une page HTML produite par le skill `client-a-schemas`, puis jugée par les oracles HTML du registre de `quality-oracles`.

Ce lot porte **4 retours** (RT-5 à RT-8).

- **Contexte** : production d'un livrable hors run, dans un dossier frère du clone tiers (`Produit-81-audit\`), pour ne rien écrire dans le dépôt du client (voir lot `20261013a`, RT-3).
- **Références ledger** : sans objet. Aucun run n'est ouvert sur ce produit.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-13** dans le sas d’arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L’original est provisoirement dans le dossier temporaire de la session (voir lot `20261013a`, RT-3).

---

## skill client-a-schemas (gabarit `assets/template-multi-bandes.html`, `references/conventions-communes.md`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-5 | majeur | générique | **Le gabarit du skill produit une page que les oracles HTML du registre refusent dès la première exécution.** Mesuré le 13/10/2026 sur la page instanciée telle que le gabarit la prescrit. `render_page.py` rend 35 défauts bloquants à 1920 px : 30 chevauchements V4, chacun entre un élément et ce qui le contient (le cadre `svg-frame` et ses nœuds, la pastille de bande et son titre), plus 3 états indiscernables et 2 L2. Il rend aussi 4 V1 à 390 px, parce que la convention §11 prescrit le « scroll horizontal via `overflow-x` » alors que le socle dit V1 bloquant « même dans un conteneur `overflow-x:auto` » (`composants.md` §6). `check_html.py` ajoute 11 bloquants : A1 (le gabarit charge Google Fonts par 3 requêtes), A2, A4, L2 (`max-width: 820px` sur `.lede` et `.section-intro`), L4, L13, L19, L25 et L11. `oracle-tokens` relève 120 défauts durs, surtout T1 sur les `style="fill:#…"` en ligne que le gabarit pose sur chaque texte de pipeline et d'intégration. Il a fallu **six cycles de correction** pour atteindre PASS, sans changer une seule couleur rendue. Autre écart : `conventions-communes.md` §7 renvoie à `assets/tooltip-script.html`, absent du paquet (le script est en revanche embarqué dans le gabarit). | Remettre le gabarit sur le socle `digit-ai-page-html` : polices en piles locales, favicon et titre daté, sommaire collant et recherche, colonnes `.lire` déclarées `data-mesure-lecture`, pastilles en `<g>` titrés, cadres porteurs de `data-overlap-ok` listant leurs nœuds, couleurs passées par des tokens dans les styles en ligne, SVG à `width:100%` sans `min-width`. Joindre au skill une fixture verte qui passe `render_page.py` et `check_html.py`. Retirer de §7 la référence au fichier absent, ou le livrer. |

**Portée** : générique. Toute page produite par ce skill repart de ce gabarit.

## digit-ai-forge-design (`oracle-bascule.mjs`, `oracle-tokens.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-6 | majeur | générique | **Deux oracles de la même chaîne se contredisent sur le thème sombre, et l'un rend bloquant ce que l'autre déclare conforme.** Sur la même page, le 13/10/2026 : `oracle-bascule` rend B-T1, B-T3 et B-T4 **bloquants** (« aucun bouton de bascule », « aucune persistance », « palette sombre absente »). Dans la même exécution de `run-oracles-design.mjs`, `oracle-tokens` T4 écrit « thème clair seul — conforme à la doctrine du socle (sombre optionnel ; s'il est déclaré, la parité redevient bloquante) ». Quant à `check_html.py`, il dit en G1 : « avertissement R-30, pas un défaut bloquant : un rendu figé (export print/PDF) n'a légitimement aucune bascule ». Un auteur ne peut pas satisfaire les trois : l'orchestrateur reste FAIL sur une page que le socle déclare conforme. | Aligner `oracle-bascule` sur la doctrine écrite : ne rien juger quand aucun thème sombre n'est déclaré (même règle que T4), et ne devenir bloquant que si un bloc sombre ou un bouton existe. Ou bien, si la doctrine a changé, mettre à jour T4 et G1 en même temps. |
| RT-7 | mineur | générique | **`oracle-tokens` juge des paires qui ne peuvent pas exister à l'écran.** T8 juge l'anneau de focus contre **chaque** token de fond. Ici, il le juge contre `--tt-bg` (#1e293b) et `--tt-code-bg` (#334155), qui ne servent qu'à une infobulle en `pointer-events: none`, jamais focalisable. Aucune couleur unique ne tient 3:1 à la fois sur les fonds pastel de la palette et sur ce fond sombre (calcul fait sur 11 candidates le 13/10). T8 reste donc rouge quelle que soit la couleur choisie. De même, T5 présume une paire texte/fond entre `--tt-ink` et `--c-purple-stroke`, qui est le fond d'un `::before` décoratif à `content: ''`, sans texte. Les deux constats sont « majeurs » et comptent comme durs dans le verdict. | T8 : ne juger l'anneau que contre les fonds d'éléments focalisables ou de leurs ancêtres, et ignorer les tokens consommés seulement sous `pointer-events: none`. T5 : écarter les pseudo-éléments dont le `content` est vide. Fixture rouge et fixture verte pour chacun. |

**Portée** : générique pour les deux.

## digit-ai-forge-agents (`digit-ai-page-html/scripts/render_page.py`, famille `controles_desalignes`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-8 | mineur | générique | **`controles_desalignes` prend la grille de mise en page d'une page (sommaire latéral et contenu) pour une rangée de formulaire.** Le 13/10/2026, à 1280, 1920, 2560 et 3840 px, le constat est bloquant : « 2 contrôles d'une même rangée sur 2 hauteurs — écart de 2 920px ». Les deux « contrôles » sont le champ de recherche du sommaire et le premier bouton de filtre d'un tableau, 3 000 px plus bas dans `<main>`. La règle exclut `table, nav, .tf-panel` comme boîte, mais pas une grille dont un enfant est un `<nav>`. L'auteur doit poser `data-alignement-ok` sur la page entière, ce qui fait taire la règle pour toute vraie rangée de formulaire qu'elle contiendrait. | Exclure de la rangée tout enfant qui est, ou qui contient comme premier contrôle, un élément sous `nav` ; ou ne retenir que les enfants dont la hauteur reste sous un plafond (une rangée de champs ne fait pas 3 000 px). Fixture : grille sommaire et contenu verte, rangée de 4 champs décalés rouge. |

**Portée** : générique. Toute page au socle qui suit L25 avec un sommaire latéral et une recherche (L13) déclenche ce constat.

## Rattachement

Le 13/10/2026, aucune recherche n'a été faite par cette session au registre (`todo/TODO.jsonl`) ; l'ingestion rapprochera. Voisins cités par les outils pendant la session :
- RT-5 : `TF-1146` et `TF-1281` (exemptions V4 par paires, que le gabarit n'emploie pas) ;
- RT-8 : `TF-0773` (création de la famille `controles_desalignes`) ;
- RT-6 et RT-7 : aucun voisin relevé.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les réécritures Python sous Windows ont converti les fins de ligne en CRLF et fait échouer la parité P3 des composants embarqués | Écriture en `newline="\n"` ; parité rejouée verte par `embarquer-composants.mjs --constat` | non : geste de l'auteur, l'oracle a bien vu l'écart | non remonté |
| La bande 1 du schéma prenait 6 px de texte à 1280 px avec un sommaire latéral | Sommaire en bande collante sous 1600 px | non : choix de mise en page de ce livrable | non remonté |
| Thème sombre absent | Écart assumé : charte Client-A claire, livrable imprimable ; voir RT-6 | oui | remonté : RT-6 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le livrable vient du gabarit d'un skill, `client-a-schemas/assets/template-multi-bandes.html`, qui n'appartient pas à la bibliothèque de documents du pilot ; ce qu'il a coûté est décrit en RT-5.

## Documents mûrs

Aucun document mûr nouveau sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : rien n'a été déployé ni publié.

## Confirmations positives

- `render_page.py` a trouvé ce que la relecture n'aurait pas vu : la prose étirée à 3840 px (V18) et l'écart irrégulier des légendes (V7).
- `embarquer-composants.mjs --poser` a embarqué les filtres et la recherche en un geste, et `--constat` a rendu la parité vérifiable.
- `check_html.py` a donné, pour chaque défaut, le geste exact qui le répare (`.toc-d` dans le lien, `.ch-apprend`, `.exemple-lecture`, `data-filter-reason`).

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-5** : aucune classe existante ne convient. `marque-emettrice-portee-par-deux-chartes` parle de valeurs de marque contradictoires, pas d'un gabarit qui échoue aux oracles du socle.
  - Clé proposée : `gabarit-de-skill-refuse-par-les-oracles-du-socle`
  - Famille : `page-html-socle`
  - Libellé : « Le gabarit livré par un skill de rendu produit, tel quel, une page que les oracles HTML du registre refusent : chaque usage repaie la mise au socle, faute d'une fixture verte jointe au gabarit »
- **RT-6** : classe `deux-regles-du-socle-inconciliables`.
- **RT-7** : classe `oracle-faux-positif`.
- **RT-8** : classe `oracle-faux-positif`.

## Ordre recommandé

1. **RT-5**, parce que c'est le seul retour qui coûte à chaque usage : six cycles de correction par page produite.
2. **RT-6**, parce qu'il rend la chaîne forge-design rouge sur toute page claire conforme.
3. **RT-8**, parce qu'il pousse les auteurs à faire taire la règle sur la page entière.
4. **RT-7**.
