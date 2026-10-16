# Lot de retours — Produit-64 → digit-ai-page-html, digit-ai-forge-design — 2026-09-24, indice b

**Émetteur** : produit `Produit-64` · **Cibles** : le socle `digit-ai-page-html`
(`find-in-page.js`) et la forge `digit-ai-forge-design` (`oracle-mobile`) · **Origine** : le tableau
des résultats de recherche ajouté au guide développeur le 24/09.

Ce lot porte **3 retours**. Tous ont été trouvés par une sonde navigateur écrite pour ce tour.
Aucun des scripts du socle ni des oracles de la forge ne les voit.

- **Contexte** : demande du porteur du 24/09/2026 sur le guide développeur — « Complète la
  recherche pour qu'elle affiche un tableau avec les onglet concernés et la portion de texte qui
  contient le texte saisi ». Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## digit-ai-page-html (`digit-ai-page-html`)

Le composant de recherche du socle écrit dans le document sans tenir compte de ce qu'il fouille.
Il pose un élément HTML dans un schéma SVG, qui ne le peint pas. Il remet le contenu d'origine
à chaque frappe, ce qui défait l'état que la page y avait posé.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-22 | majeur | générique | `find-in-page.js`, fonction `highlight()`, remplace le nœud de texte trouvé par un `<mark>` créé par `document.createElement` — un élément HTML — même quand ce nœud est dans un `<text>` SVG. SVG ne peint pas un élément HTML : **le mot trouvé disparaît du schéma** tant que la recherche est active. Mesuré le 24/09 dans Chromium sur `Client-A - Guide développeur POC-to-Prod - 20260924e.html`, titre de bande « 2 · Annuaire Microsoft Entra ID — … » : `getNumberOfChars()` passe de **93 à 87**, `getComputedTextLength()` de **632 à 592 px**, et le schéma se lit « Annuaire Microsoft ID ». `check_html` PASS, `render_page` PASS, `run-oracles-design` 9/9 : aucun ne joue une recherche | dans un nœud dont l'ancêtre est un `<svg>`, créer un `<tspan class="find-hit">` par `createElementNS('http://www.w3.org/2000/svg', 'tspan')` au lieu d'un `<mark>`, et le styler en gras souligné ; fixture rouge : un `<text>` portant le terme cherché, contrôle du nombre de caractères peints avant et pendant la recherche |
| RD-23 | majeur | produit+générique | **Effet nouveau de RD-17** (lot du 23/09) : en remettant à chaque frappe le HTML relevé à l'initialisation, le composant ne défait pas seulement les écouteurs des autres composants, il **ramène l'état d'affichage du relevé**. Sur une page à vues dont une seule est peinte, la recherche réaffiche la vue qui était active quand le relevé a été pris. Mesuré le 24/09 sur `20260924a` : depuis « Mise en production », taper « Entra » affiche « Démarrer ». Et toute référence que la page garde vers un nœud du conteneur devient un nœud détaché : un clic d'onglet change l'adresse, jamais la vue | documenter dans `composant-recherche.md` que le conteneur est RECRÉÉ à chaque frappe, et qu'une page ne doit y garder ni référence ni état ; mieux, retirer les surlignages sans remettre le HTML d'origine (dérouler chaque `mark.find-hit` en son texte, puis `normalize()`), ce qui fermerait RD-17 et RD-23 ensemble |

### RD-22 — Le mot cherché disparaît d'un schéma pendant la recherche

**Le fait mesuré.** Sonde Chromium du 24/09, vue « Services Azure imposés » du guide, schéma des
connexions. Avant la recherche : 93 caractères peints, 632 px. Pendant la recherche de
« Entra » : 87 caractères peints, 592 px. La capture montre « Annuaire Microsoft ID ». Le
compteur annonce l'occurrence, mais le lecteur ne la voit pas : le composant l'a retirée du dessin.

**Ce que le produit a fait chez lui.** Après chaque recherche, le guide remplace chaque
`mark.find-hit` situé dans un `<svg>` par un `<tspan class="find-hit">` portant le même texte :
93 caractères peints, 632 px, le mot en gras souligné. Le correctif ne vaut que pour ce guide.

### RD-23 — La recherche ramène l'affichage à l'état de son relevé

**Le fait mesuré.** Sonde du 24/09 sur le livrable du matin : vue active « g8 » avant la
recherche, « demarrer » après. Un clic sur l'onglet « Sécurité et secrets » change `location.hash`
en `#vue-g6`, et la vue peinte reste « demarrer ». La page gardait la liste de ses vues, relevée
au chargement : après la première frappe, cette liste ne désigne plus que des nœuds détachés.

**Ce que le produit a fait chez lui.** La page relit ses vues à chaque usage, retient la vue
courante et la réapplique après chaque recherche. Sonde : « g8 » conservée, « g6 » après le clic.
Les filtres de tableau, eux, restent muets après une recherche (RD-17, inchangé chez le produit).

## digit-ai-forge-design (`digit-ai-forge-design`)

`oracle-mobile` juge le viewport, les cibles tactiles, l'encoche, le reflow et le paysage. Il ne
mesure pas la part de l'écran qu'un contenu collant retire à la lecture au téléphone.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-24 | majeur | générique | Au téléphone, un bandeau `position: sticky` dont la navigation se replie en plusieurs rangs occupe l'essentiel de l'écran, une fois la page défilée : **717 px sur 844 à 390 px de large**, 346 sur 1 000 à 760. Il reste une bande de lecture d'environ 130 px, et tout élément qui reçoit le focus sous ce bandeau est caché — critère WCAG 2.2 **2.4.11** (AA). Mesuré le 24/09 sur `Client-A - Guide développeur POC-to-Prod - 20260924e.html` : `oracle-mobile` **PASS**, et les 8 autres oracles de `run-oracles-design` aussi | règle M9 : aux largeurs de téléphone, après un défilement, la hauteur cumulée des éléments `sticky` ou `fixed` en haut de page ne dépasse pas une part bornée de la fenêtre (par exemple 25 %) ; fixture rouge : un bandeau collant portant 14 onglets à 390 px |

### RD-24 — Un bandeau collant qui laisse 130 px de lecture au téléphone

**Le fait mesuré.** Sonde du 24/09 à 4 largeurs, après `window.scrollTo(0, 2000)` : le bandeau reste
en haut, sa hauteur est de 717 px à 390, 346 à 760, 293 à 900 et 240 à 1 280. À 390, les 14 onglets
du guide se replient en 11 rangs.

**Ce que le produit a fait chez lui.** Rien sur le bandeau pour l'instant : le choix est soumis au
porteur (le bandeau défile au téléphone, ou les onglets s'y replient en menu). Le panneau des
résultats de recherche, lui, s'ouvre désormais en surimpression fixe sous le champ, pour ne pas
dépendre de la hauteur du bandeau.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le trait d'une étiquette de version visait la ligne, pas son nœud | le trait part du bord qui fait face au nœud et s'arrête sur son cercle | non | géométrie propre au générateur de schémas du guide |
| Fermer rendait le focus au champ, qui rouvrait le panneau | le focus rendu par la page ne rouvre pas | non | ergonomie propre au panneau du guide |
| Échap vidait la recherche avant de fermer le panneau (comportement natif d'un champ de recherche) | premier Échap : fermer ; second : vider | non | choix d'ergonomie du produit ; le composant du socle ne gère pas de panneau |
| Le rendu plantait sur les contraintes sans décision source du pack du jour | fiche nommant la règle source et la famille | non | générateur propre au guide, pack propre au tenant |
| 3 espacements du panneau hors de l'échelle de 4 px | ramenés sur l'échelle | non | `oracle-tokens` T3 les a vus : la forge a joué juste |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le livrable est le guide
développeur, rendu par le générateur du produit.

## Confirmations positives

- **`oracle-tokens` T3** a refusé les 3 espacements hors échelle du panneau, et le correctif l'a
  remis à 0 écart dur.
- **`render_page`** a tenu la géométrie des étiquettes : un trait qui chevaucherait son nœud serait
  un recouvrement V4, et les deux vues de schémas rendent 0 bloquant à 7 largeurs.
- **`verifier-revue-de-lecture`** a refusé le livrable tant que sa revue n'était pas écrite (RL-1),
  puis l'a accepté.

## Ordre recommandé

1. **RD-22 d'abord** : quelques lignes dans `highlight()`, une fixture, et le composant cesse
   d'effacer ce qu'il trouve.
2. **RD-23 ensuite, avec RD-17** : retirer les surlignages sans remettre le HTML d'origine ferme
   les deux d'un coup.
3. **RD-24** : une règle neuve dans `oracle-mobile`, à mesurer d'abord en bruit sur le parc.

## La règle qui aurait évité le retour

- **RD-22** — aucune règle ne couvre le défaut : aucun oracle ne joue une recherche sur la page
  qu'il juge. **Classe proposée** : clé `surlignage-html-pose-dans-un-schema-svg`, famille
  `page-html-socle`, libellé « La recherche dans la page pose un élément HTML (mark) dans le texte
  d'un schéma SVG : SVG ne le peint pas, et le mot trouvé disparaît du schéma pendant la
  recherche ».
- **RD-23** — même défaut généralisé que RD-17 : **classe proposée le 23/09** avec lui, clé
  `composant-qui-reecrit-le-dom-de-ses-voisins`, famille `page-html-socle`. Ce lot la reprend à
  l'identique, sans en créer d'autre.
- **RD-24** — la règle existe, mais aucun oracle ne la joue : WCAG 2.2 critère 2.4.11, que le socle
  vise en AA. **Classe proposée** : clé `bandeau-collant-qui-couvre-l-ecran-au-telephone`,
  famille `page-html-socle`, libellé « Un en-tête collant dont la navigation se replie en plusieurs
  rangs occupe l'essentiel de l'écran au téléphone : la lecture tient dans une bande, et l'élément
  qui reçoit le focus peut être caché ».
