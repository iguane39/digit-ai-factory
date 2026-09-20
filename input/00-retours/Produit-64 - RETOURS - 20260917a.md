# Lot de retours — Produit-64 → digit-ai-page-html — 2026-09-17, indice a

**Émetteur** : produit `Produit-64` · **Cible** : le socle `digit-ai-page-html` ·
**Origine** : lot de retours du porteur Client-A du 17/09/2026 sur le guide développeur — quinze
demandes de correction et de complétion, toutes appliquées sur l'indice `20260917a`.

Les 2 retours de ce lot ont été trouvés en jouant les 6 oracles sur la page corrigée. Tous deux
sont des défauts **entre** un composant ou une sonde du socle et la page qui les emploie : la page
fait ce que le socle prescrit, et un contrôle du même écosystème la refuse pour cela.

- **Contexte** : reprise d'un livrable documentaire sur retours humains, hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-09-17** — les 2 fichiers déposés dans le sas d'arrivée du pilot `digit-ai-factory/input/00-retours/_arrivee/` (ignoré par git). Empreintes SHA-256 vérifiées identiques entre l'original et la copie du sas, pour les 2 fichiers — sidecar `c43992ce…d3665`. L'original reste ici, historique du produit.

---

## RD-11 — Le composant d'infobulle du socle pose un rembourrage hors échelle 4 pt, et la page qui l'embarque échoue oracle-tokens

### Le fait mesuré

Le socle rend l'infobulle structurée **obligatoire** dès qu'une légende porte plus de 2 objets
(`composants.md`, composant 13, marqué 🔴 ; `lisibilite.md`, L3 g). Le guide développeur en avait
besoin : chaque objet de la chaîne porte une légende à 3 précisions, chaque code cité une
légende à 2 lignes. Le composant a été posé par la voie prescrite :

```
node embarquer-composants.mjs --poser <page> --composants infobulle.js,infobulle.css
```

Joué ensuite, `oracle-tokens` de `digit-ai-forge-design` rend **FAIL** sur la page, et ses deux
seuls constats majeurs portent sur le bloc que le poseur vient d'écrire :

| Règle | Constat | Où |
|---|---|---|
| T3, majeur | espacement 10px hors échelle 4pt sur padding | sélecteur `#infobulle` |
| T3, majeur | espacement 14px hors échelle 4pt sur padding | sélecteur `#infobulle` |

La déclaration `padding: 10px 14px` vit dans `assets/infobulle.css`, marqué « NE PAS ÉDITER ICI :
la SOURCE fait foi » par le poseur. Le producteur ne peut ni la corriger dans sa page — le contrôle
de parité le refuserait — ni la contourner : l'oracle lit les déclarations, pas le rendu.

### Pourquoi c'est un défaut du socle

La veille, la même page **sans** ce composant rendait `oracle-tokens` PASS après 57 espacements
recalés sur l'échelle 4 pt (lot `20260916b`, RD-9 — le socle qui ne nomme que 3 de ses 4 oracles). Le seul geste qui l'a fait rougir est
d'avoir suivi une règle 🔴 du socle. 2 règles du même écosystème sont donc inconciliables sur
une page qui les respecte toutes deux.

### La règle qui aurait évité le retour

`deux-regles-du-socle-inconciliables` (registre) : **2 règles qu'une même page doit
satisfaire sont jouées ensemble sur une fixture, avant d'être prescrites ensemble.** Le geste est
d'une ligne : `padding: 8px 12px` (ou `12px 16px`) dans `assets/infobulle.css`, puis
`oracle-tokens` joué sur `tf-infobulle-structuree.html`. La page de ce produit repassera au vert
au prochain `--ecrire`, sans autre geste.

---

## RD-12 — La sonde V9 mesure un schéma sous le bandeau collant que sa propre capture peint au milieu de la page

### Le fait mesuré

`render_page.py` rend **FAIL** à 3 840 et 2 560 px sur le premier schéma du guide, et PASS aux
5 autres largeurs :

```
V9 actif INDISCERNABLE de son fond — meilleur contraste 1.00:1 sur 39494 pixels opaques,
contre un fond rgb(255, 255, 255). Couleur dominante de l'actif : rgb(255, 255, 255).
```

Le schéma n'est pas blanc : ses boîtes sont teintées (`--sch-fill: #DCE9E1`, 1,25:1 contre le
blanc), ses traits et ses textes contrastent. Une capture Playwright du même élément
(`svg.screenshot()`), à 3 840 px, montre les 5 boîtes et leurs flèches. La capture pleine page
produite par la sonde elle-même (`…-w3840.png`) montre la cause : le bandeau `position: sticky`
est **peint au milieu de la page**, à la hauteur exacte du premier schéma, et le recouvre d'un
aplat blanc. La sonde mesure alors le bandeau, pas le schéma. Le mécanisme : `--etats-ouverts` remplit le
champ de recherche, le composant de recherche fait défiler la page jusqu'au premier résultat, et
la capture pleine page qui suit peint le bandeau collant à ce décalage. À 1 920 px et en dessous,
le premier résultat tombe ailleurs : PASS. **Contre-épreuves** : la même page **sans**
`--etats-ouverts` rend PASS à 3 840 et 2 560 px, aucun constat dur ; l'indice précédent
(`20260916a`), même bandeau, même schéma, rend PASS aux 2 largeurs avec `--etats-ouverts`.
Le verdict dépend de la position d'un résultat de recherche, pas de l'actif jugé.

### Pourquoi ce n'est pas un défaut de la page

Un bandeau collant est un choix de navigation que le socle admet — la revue du 16/09 mesurait
qu'il reste en fenêtre après 20 000 px de défilement, et le jugeait utile. La sonde V9 fait ce
qu'elle promet : mesurer l'actif « dans le contexte où il est servi ». Mais ce contexte est celui
de **sa** capture pleine page, où un élément collant se trouve à un endroit où aucun lecteur ne le
verra. La mesure est vraie sur l'image et fausse sur la page.

### La règle qui aurait évité le retour

`controle-vrai-sur-le-mauvais-invariant` (registre) : **un contrôle mesure l'invariant qu'il
protège, jamais une grandeur qui lui est seulement corrélée.** L'invariant est « l'actif se
distingue de son fond quand un lecteur le regarde ». 2 gestes possibles, le premier étant le
moins cher : (1) V9 capture l'élément lui-même (`el.screenshot()`) après l'avoir fait défiler
hors de tout élément `position: sticky | fixed` — ou masque ces éléments le temps de la mesure ;
(2) V9 déclare en `non_juge` tout actif dont la boîte croise celle d'un élément collant dans la
capture, au lieu de le compter en défaut. Chez ce produit, le constat est déclaré comme artefact,
preuve à l'appui, et le livrable est servi avec un verdict `render_page` FAIL expliqué — ce qui
est exactement l'état qu'un contrôle ne devrait pas produire.

---

## Remise

Ce lot vise **le socle `digit-ai-page-html`** pour ses 2 retours. Remise dans
`input/00-retours/_arrivee/` du pilot. Le sidecar
`Produit-64 - RETOURS - 20260917a.tf.jsonl` porte les 2 lignes, chacune avec
`racine_produit`, conformément à la règle 8 du `CLAUDE.md` de ce produit.

**Aucune clé de classe n'est proposée à la création** : les 2 retours portent des clés
existantes — `deux-regles-du-socle-inconciliables` et `controle-vrai-sur-le-mauvais-invariant`.

## Ordre recommandé

1. **RD-11**, d'abord : le geste tient en une déclaration CSS, et toute page qui suit la règle 🔴 du
   composant 13 est rouge tant qu'il n'est pas fait.
2. **RD-12** ensuite : le geste est une ligne de code dans la sonde, mais il demande de choisir
   entre 2 formes, et la fixture rouge à écrire est une page à bandeau collant.

---

## Remarques restées au produit

3 corrections de cette séance restent chez le produit : elles portent sur son générateur ou sur
l'ordre de ses scripts, et leur classe est déjà au registre.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Une colonne de prose qui CITE un identifiant était traitée en colonne d'identifiants : un tableau à 5 colonnes mesurait 1 645 px dans une colonne de 1 467 | une colonne est incompressible quand le code est le contenu de la moitié de ses cellules au moins ; une colonne de prose qui cite un identifiant garde au moins la largeur de cet identifiant, qui passe entier à la ligne | non | classe `page-html-dictionnaire-colonnes` déjà remontée 3 fois ; le fait sert de preuve, rien de neuf à remonter |
| Un identifiant en cellule se coupait en 2 lignes par `overflow-wrap: anywhere` posé sur `code` | les identifiants sans barre oblique portent `white-space: nowrap` en cellule ; les adresses continuent de se replier | non | même classe ; 0 identifiant coupé de 1 280 à 3 840 px après correction, hors une URL de 64 caractères et une carte à 390 px |
| Les composants du socle sont posés APRÈS le script de la page, en fin de corps : le script les cherchait avant qu'ils existent, et l'infobulle ne s'ouvrait pas | le script attend `DOMContentLoaded` | oui, mais déjà dit | `composants.md` prescrit de coller les composants « en fin de corps » ; l'ordre relatif au script de la page relève du producteur |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** de `gabarits/documents/` du pilot sur ce lot —
vérifié le 2026-09-17 : les pièces de cette séance sont un lot de retours, une revue de lecture et
une page HTML générée, aucune ne sort de la bibliothèque du pilot.

**Un gabarit du socle a été employé** pour la 3e fois : `references/gabarit-revue-de-lecture.md`,
toujours **sans identifiant `gd-…` ni version affichée en en-tête** — le rattachement se fait par
le chemin du gabarit et la date de lecture, 2026-09-17. Retour de forme déjà porté par les lots
`20260916a` et `20260916b`.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `forge/travaux/REVUE-20260917a-guide-developpeur.md` | `gabarit-revue-de-lecture.md` — sans numéro de version affiché | rien de neuf depuis le lot `20260916b` : le gabarit ne dit toujours pas comment rattacher la revue au livrable | rien : la revue a été tenue et la porte locale `tools/verifier-revue-de-lecture.mjs` la juge PASS | rien de plus que le 16/09 | générique, déjà remonté (RD-8 — la revue de lecture obligatoire jouée par aucun contrôle du socle) |

## Confirmations positives

- **La chaîne des 6 oracles a tenu son rôle** : `check_html.py` a trouvé 22 liens vers des
  ancres inexistantes (L8) et 2 chapeaux trop longs (L7) ; `oracle-tokens` a trouvé deux paires
  de contraste à déclarer (T5) ; `render_page.py` a mesuré 322 tableaux × largeurs. Tous corrigés
  avant livraison, sauf les 2 constats de ce lot, qui ne sont pas au producteur.
- **Le lecteur de source embarquée du socle (composant 12) a inspiré la bonne voie** pour embarquer
  un catalogue de 724 Ko : un bloc que le navigateur n'exécute pas, décompressé au premier clic —
  262 Ko encodés, 0 erreur de console, catalogue entier ouvert en 0,02 s.
