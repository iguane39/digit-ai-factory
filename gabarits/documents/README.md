# Bibliothèque de gabarits de documents

Les gabarits de **livrables** que la factory propose à un projet, quel que soit son domaine :
un projet qui doit rendre un rapport de données, un diagnostic, un rapport d'audit ou une
fiche de sécurité prend le gabarit de sa famille plutôt que d'inventer une forme.

Source unique : **`catalogue.jsonl`** — une ligne par famille, avec sa **provenance** (le ou
les livrables réels d'où la forme est tirée) et son **statut**. Les vues, s'il y en a un jour,
s'en dérivent ; ce fichier ne se recopie pas à la main. Oracle : `oracles\oracle-gabarits-documents.mjs`
(G1-G7, joué par la recette du pilot).

*Pourquoi cette bibliothèque existe.* Chaque projet réinventait la forme de ses livrables, et
les défauts de forme se rejouaient d'un projet à l'autre — largeur de lecture, tableaux
illisibles au mobile, schémas sans légende. Un projet est même allé jusqu'à produire son propre
gabarit de rapport de données, barré et documenté (`SCC_ALX`, 13/08) : un travail utile resté
chez lui, invisible aux autres. La bibliothèque hisse ces formes au niveau de la factory et
leur applique, une fois pour toutes, ce que les retours ont coûté à découvrir.

---

## Ce qu'est un gabarit, ici

Un gabarit est un **squelette déclaré**, jamais la copie d'un livrable client :

- **`GABARIT.md`** — le contrat de structure : sections obligatoires, ce que chacune doit
  contenir, emplacements à remplir écrits en `{…}`, et les règles de la doctrine que la
  famille engage. C'est la pièce qui fait foi ; elle vaut pour tout format de sortie.
- **`SQUELETTE.html`** (familles nativement HTML) — la page vide correspondante, bâtie sur le
  socle `digit-ai-page-html`, portant déjà les correctifs de forme listés ci-dessous.

**Aucune donnée client** dans un gabarit. La forme se hisse, le contenu reste chez le projet —
c'est aussi ce que l'oracle vérifie (G5).

## S'en servir

1. Choisir la famille dans `catalogue.jsonl` (champ `famille`, `quand_l_employer`).
2. Copier le dossier de la famille chez le projet, dans son `output\` (nommage D-15 :
   `<Client> - <Objet> - AAAAMMJJ<indice>`).
3. Remplir les emplacements. Un emplacement laissé tel quel est un défaut, pas un oubli
   toléré : les gabarits n'ont pas de valeur par défaut silencieuse.
4. Juger le résultat par l'oracle du domaine (HTML : `check_html.py` **et** `render_page.py`
   du socle — les deux, le premier ne voit pas ce que le second mesure).

**Avant de créer une famille, chercher le GÉNÉRATEUR — pas seulement les livrables produits.**
Une forme peut être massivement réutilisée dans le corpus ET déjà outillée par une forge : douze
fiches de sécurité et huit rapports d'audit ont été relevés comme preuve de réutilisation le
21/08, alors que `digit-ai-forge-audit` portait déjà leur gabarit, leur générateur, leur oracle
et leur version anglaise. Deux gabarits ont été écrits en doublon avant que le
`deliverables/templates/` de la forge ne soit ouvert. La règle qui en sort : **un balayage qui
ne regarde que les SORTIES conclut toujours qu'il manque un gabarit.** Le statut
`porte_ailleurs` existe pour ce cas — la bibliothèque indexe et renvoie, elle ne réécrit pas.

Une famille absente du catalogue se **remonte** (candidat TF), elle ne s'improvise pas. Une
famille en statut `a_extraire` porte déjà ses sources : le travail d'extraction est identifié,
il n'est pas encore fait — et le dire vaut mieux qu'une bibliothèque qui a l'air complète.

---

## Doctrine transverse — ce que tout document généré tient

Sept règles, toutes **nées d'un retour payé** sur un livrable réel. Elles ne dépendent ni du
format ni de la forge productrice : un tableau illisible au mobile l'est autant dans un rapport
d'audit que dans un rapport de données. Chaque gabarit déclare celles qu'il engage, et l'oracle
vérifie que la déclaration existe (G4).

| id | Règle | Le fait qui la fait naître |
|---|---|---|
| **D1** | **Largeur utile.** Le texte occupe la largeur qu'on lui offre, ou le conteneur se resserre. Jamais un texte bridé à 57 % d'un conteneur large : la moitié de page vide à droite est un défaut, pas une élégance. Une seule doctrine tranchée, écrite au référentiel, et le rendu jugé par l'oracle exécuté — jamais par citation de la doctrine. | Retour humain direct du 21/08 sur un rapport HTML remis (« des textes sur une partie de la largeur seulement »). Le point avait déjà été remonté le 13/08 (TF-0172) et clos « réfuté avec citation », sans que l'oracle qui le contredit soit joué. |
| **D2** | **La règle se tient, pas seulement se satisfait.** Une mesure qui porte sur le conteneur se contourne en déplaçant la contrainte d'un cran, sans rien changer pour le lecteur. Un gabarit ne prescrit pas une forme satisfaisable à vide. | Mesuré le 21/08 : bride sur `p` → BLOQUANT ; **même** bride portée par le `div` parent → PASS, avec un texte occupant toujours 57 % de la fenêtre. |
| **D3** | **Tableau large : un repli, pas seulement un ascenseur.** Un conteneur `overflow-x: auto` rend un tableau consultable ; il ne le rend pas lisible et ne fait pas passer le contrôle de débordement. Au-delà de 3 colonnes, le repli en cartes sous 900 px est dû. | Mesuré le 21/08 sur une page dont **tous** les tableaux étaient déjà dans un conteneur scrollable : 26 défauts de débordement à 390 px, 25 causes distinctes — **0** après repli en cartes. |
| **D4** | **Filtre, tri, recherche : l'état vide est dû.** Une surface filtrable qui ne laisse rien doit le dire en toutes lettres, et rappeler comment revenir. Un tableau muet se lit comme une panne. | Lot Hoopiz du 20/08 : le composant de filtres masquait les lignes et mettait le compteur à zéro sans un mot (RD-7), et son panneau débordait de tout conteneur défilant (RD-8). |
| **D5** | **Schéma : conventions déclarées, glyphes prouvés.** Toute superposition voulue se déclare (`data-overlap-ok`) et la convention est écrite ; tout glyphe employé en `content` CSS est prouvé présent dans la pile de repli déclarée ; légende et unités sont dues. | Lot Hoopiz du 20/08 : convention `data-overlap-ok` de fait, non documentée, imposée à tout SVG (RD-4) ; chevron `\25B6` absent des polices de repli, jamais vérifié par aucun contrôle (RD-12). |
| **D6** | **Conformité mécanique n'est pas qualité.** Douze chapeaux identiques au mot près satisfont la règle qui les exige et dégradent la page. Un gabarit prescrit ce que la section doit APPRENDRE au lecteur, pas la présence d'un bloc. | Lot Hoopiz du 20/08 (RD-3) : L6/L7/L10 toutes PASS sur une version dont les chapeaux étaient interchangeables. |
| **D7** | **Un livrable se juge sur verdict exécuté.** Deux oracles sur un HTML — conformité (`check_html.py`) **et** rendu (`render_page.py`) — parce que le premier ne mesure ni largeur, ni débordement, ni contraste. Le PASS de l'un ne vaut pas pour l'autre. | Le reconstat du 21/08 : la page passait `check_html` à 21 règles pendant que `render_page` la déclarait BLOQUANTE sur la largeur de lecture. |

*Ces règles sont une DOCTRINE, pas un oracle.* Ce qui les exécute vit ailleurs et est nommé
famille par famille dans le catalogue (`oracles` de chaque ligne) : le socle HTML pour D1-D3 et
D5-D7, la relecture humaine pour D6. `oracle-gabarits-documents.mjs` ne juge que la
**bibliothèque** — que chaque famille déclare sa provenance, ses emplacements, ses règles et
son oracle, et qu'aucune donnée client ne soit restée dans un squelette.
