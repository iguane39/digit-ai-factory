# Composants de la famille `gd-guide-de-reference` — entiers ou à la carte

Les composants que le guide de référence assemble, chacun **réemployable seul** dans une autre
page. Chacun a UNE source (`composants/`), se pose scellé par l'empreinte de cette source, et sa
copie se rejoue contre elle : une copie collée à la main est une fourche silencieuse, et le socle
l'a payé sept fois sur un seul composant (TF-0784).

```
python generateur/construire-guide.py --poser <page.html> --composants jetons.css,modale.css,modale.js
python generateur/construire-guide.py --constat <page.html>      # exit 1 si une copie a dérivé
```

Une feuille se pose avant `</head>`, un script avant `</body>` ; un bloc déjà posé est remis à sa
source. Le bloc porte `<!-- COMPOSANT-GABARIT:DEBUT <nom> … -->` et `data-composant-gabarit` :
un marqueur distinct de celui du socle (`COMPOSANT-EMBARQUE`), pour que le poseur du socle ne
prenne pas ces blocs pour des copies périmées de SES composants.

**Ce que ces composants ne réécrivent pas.** Le surlignage de la recherche (`find-in-page.js`), les
filtres de tableau (`table-filters.js`) et les lignes dépliables (`table-detail.js`) sont des
composants du **socle** `digit-ai-page-html` : ils se posent par SON poseur (`embarquer-composants.mjs
--poser`), et ceux d'ici s'appuient sur eux sans les recopier.

**Règle de montée.** Un composant d'ici monte au socle dès qu'une SECONDE famille l'emploie (R-57,
alinéa 4) : un composant servi par une seule famille reste chez elle, un composant partagé vit là
où le poseur du socle et sa parité le tiennent pour tous.

---

## 0 — Jetons · `jetons.css` — base de tous les autres

Couleurs (clair et sombre), familles de polices `--head` / `--sans` / `--mono` (règle C8 du socle),
rayons, hauteur de bandeau `--hh`, mouvement, et la base typographique (titres, code, blocs,
encadrés, focus). **Aucun autre composant ne porte de couleur en dur.**

- **À la carte** : poser `jetons.css` en premier, puis redéfinir les jetons voulus sur `:root` ;
  ou, dans une page qui a sa charte, ne pas le poser et aliaser (`--accent: var(--blue)`, etc.).
- **Marque** : l'en-tête de la source (`accent`, `accent_fonce`, `accent_sombre`,
  `accent_fonce_sombre`) pose un bloc de jetons APRÈS celui-ci — jamais une édition des feuilles.
- **Alias** : `--blue` y suit `--accent-fonce`, pour que les composants du socle posés à côté
  prennent l'accent de la marque.
- **Contrastes mesurés** avant écriture : tous les couples texte/fond à 4,5:1 au moins, clair et
  sombre ; le `--faint` du socle (2,56:1) y est assombri à 5,74:1, parce que les composants
  l'emploient sur de petits libellés en capitales.

## 1 — Coquille multi-vues · `coquille-vues.css` + `coquille-vues.js` — « les onglets »

**Un fichier, N vues, une seule peinte à la fois.** Bandeau collant (marque, outils), barre des
vues, repères de vue (`.meta`), inventaire (`p.contenu`), sommaire du document en cartes sur la vue
d'entrée, pagination précédente / suivante.

- **Contrat** : `nav.vues a[href="#vue-<cle>"]` et `#contenu > .vue[data-vue="<cle>"]` ; dans le
  `<head>`, l'amorce de `bascule-theme.js` (classe `js` posée avant la première peinture).
- **Comportement** : l'adresse fait foi (`#vue-x` ouvre la vue x ; `#un-chapitre` ouvre la vue qui
  le porte et y défile) ; `aria-current="page"` sur l'onglet courant ; `--hh` MESURÉ et republié à
  chaque redimensionnement ; composants du socle câblés au premier affichage de leur vue.
- **API** : `GuideVues.afficher(cle)`, `.courante()`, `.vues()`, `.surAffichage(fn)`,
  `.reappliquer()` — après une réécriture du contenu, oublie les câblages et recâble la vue courante.
- **Sans script** : toutes les vues se lisent à la suite. **À l'impression** : toutes, sans menus.
- **Pourquoi pas les onglets ARIA du socle (composant 9)** : une vue est une PAGE — elle a son
  adresse, son sommaire et sa pagination, et un lien profond vers un chapitre ouvre la bonne vue.
- **Faits payés** : une liste de vues relevée au chargement devient une liste de nœuds DÉTACHÉS dès
  que la recherche réécrit le contenu (plus aucun onglet ne répondait) ; une marge de défilement
  figée à 142 px pour un bandeau de 194 px envoyait un lien de chapitre sur deux derrière lui.

## 2 — Menu latéral des chapitres · `sommaire-chapitres.css` + `sommaire-chapitres.js`

Le plan de la vue, collant à gauche, **à deux niveaux** : chapitres, puis leurs pas. Le second
niveau ne se déplie que pour le chapitre courant.

- **Contrat** : `.page > nav.chapitres + main` ; `li.toc-s > a[href="#chapitre"]` et
  `ol.toc-n2 a[href="#pas"]` ; chapitres `section.ch`, pas `.pas-bloc` ou `tr[data-detail]`.
- **Comportement** : le chapitre dont le haut a passé le bandeau devient courant (`li.toc-s.actif`),
  puis le pas courant ; **au bas de la page, le dernier chapitre visible devient courant** — sans
  quoi le dernier chapitre d'une vue courte ne l'était jamais (sonde du 24/09/2026).
- **Largeur** : deux colonnes au-dessus de 1 360 px ; en dessous, bande de pastilles au-dessus du
  contenu (à 1 280 px, une colonne de contenu sous 900 px coupait huit identifiants de tableau).
- **Sans script** : tout reste déplié. **Sans coquille** : suit le document entier.

## 3 — Chapitres et sous-chapitres · `hierarchie-chapitres.css`

La hiérarchie de lecture : **chapitre** derrière une gouttière de 3 rem où vit sa pastille (rang ou
code), **rail** qui s'éteint vers le gris, **chapeau** (`p.ch-apprend`), **bandeau d'anatomie**
(`p.regle-meta`, badge légendé — L3), **pas** (`section.pas-bloc`, typés `verification`,
`attention`, `exemple`), et pièces graphiques (`figure.schema`, à taille naturelle).

- **Le rail est un ÉLÉMENT** (`<div class="ch-rail" aria-hidden="true">`), jamais un `::before` de
  `.ch-corps` : peint en dégradé sur l'ancêtre du texte, il rendait le contraste de TOUT le chapitre
  non mesurable par la sonde du socle — 440 éléments « à vérifier à l'œil » ramenés à 4 (24/09/2026).
- **CSS seul** : le générateur produit le marquage depuis le Markdown ; à la main, recopier le
  contrat écrit en tête de la feuille.

## 4 — Recherche et ses résultats · `recherche-resultats.css` + `recherche-resultats.js`

Le compteur du socle dit COMBIEN ; ce panneau dit **OÙ** : une ligne par occurrence — sa vue, son
chapitre, un extrait de 70 caractères de part et d'autre — et un clic ouvre la vue, déplie la ligne
qui porte l'occurrence et l'amène au centre, cerclée. 200 lignes au plus, et le résumé le dit ; au
téléphone, surimpression fixe du champ au bas de l'écran.

- **Dépend de** `find-in-page.js` du socle. **Contrat** : `#recherche`, `#rechercheCompte`,
  `#recherche-resultats` HORS de `#contenu`, et ce script posé APRÈS `#contenu`.
- **Le relevé brut, et c'est la correction qu'il apportait (RAF-084 du produit d'origine).** Jusqu'au
  socle du 26/09/2026, la recherche remettait à chaque frappe le HTML qu'elle avait relevé ; relevé
  APRÈS le câblage des autres composants, il remettait des filtres de tableau dessinés mais sans
  écouteurs — un filtre ouvert au clic 1, puis 0 après une recherche effacée. Ici le relevé est pris
  avant tout câblage (mode `getHTML` du socle) et chaque frappe recâble la vue courante. **Depuis le
  socle du 26/09 (TF-1340)**, la recherche ne réécrit plus le conteneur — elle enveloppe puis
  désenveloppe les mots trouvés — et ignore `getHTML` : le relevé ne sert plus qu'avec un socle
  antérieur, et le recâblage de chaque frappe retrouve les composants déjà posés. **Coût, et il est
  dit** : avec un socle antérieur au 26/09, un filtre posé avant la frappe est remis à zéro.
- **Faits payés** : un `<mark>` HTML dans un `<text>` SVG ne se peint pas — le mot trouvé
  disparaissait du schéma (repeint en `<tspan>`, ce que le socle fait lui-même depuis le 26/09, TF-1353) ; Échap ferme d'abord le panneau, puis vide le
  champ ; le focus rendu au champ ne rouvre pas le panneau.
- **Événement** : `guide:recherche` après chaque frappe. **API** : `GuideRecherche.definirReleve(html)`
  pour une page qui change légitimement son contenu après le chargement — sans effet avec le socle du
  26/09, qui lit le contenu vivant.

## 5 — Fenêtre modale à onglets · `modale.css` + `modale.js` — « la popup du fichier MD »

Une mécanique, deux emplois : le **fichier source Markdown** (onglets « Mise en forme » et « Sans
formatage » — le Markdown lu sans quitter le guide), et la **fiche d'un code cité** (un onglet par
panneau, rendue à la demande depuis un bloc JSON).

- **Contrat** : un déclencheur `[data-ouvre-modale="<id>"]` ; `.modale#<id>[hidden]` > `.modale-fond`
  + `.modale-boite[role=dialog][aria-modal=true]` > `.modale-tete` (titre, onglets `role=tab`, Fermer)
  + panneaux `.modale-corps[role=tabpanel][data-panneau]`. Fiches : `a.code-fiche[data-fiche]` et
  `<script type="application/json" id="fiches-donnees">`.
- **Comportement** : une seule fenêtre ouverte ; Échap, le fond, Fermer et tout lien interne la
  ferment ; le focus va au premier onglet, puis **revient au bouton qui l'a ouverte**. Écouteurs
  posés sur le document : ils survivent aux réécritures de la recherche.
- **Dans la fenêtre**, les titres Markdown sont dégradés en paragraphes stylés (un titre de plus
  ferait croire à un chapitre) et les tableaux déclarent leur exemption de filtres (un aperçu n'est
  pas un parcours). **À l'impression** : fenêtres masquées, panneaux tous visibles (L16).
- **Téléphone** : chaque bouton de la fenêtre est une cible de 44 px (oracle-mobile M2).

## 6 — Tableaux · `tableaux.css`

Mise en page que le générateur prépare aux composants du socle : une largeur PAR colonne, calculée
sur le contenu (les colonnes d'identifiants ne se rabotent jamais, la prose se partage le reste) ;
identifiant jamais coupé en cellule (`code.ident`) ; **repli en cartes sous 900 px** (D3) ; ligne
dépliable (chevron U+203A, détail aligné sur le texte de sa ligne, une seule carte avec sa mère).

- **Faits payés** : 61 colonnes sur 126 sans largeur faisaient les grands vides ; un identifiant
  scindé entre `-R` et `02` se recopiait faux ; un conteneur défilant rend un tableau large
  consultable, jamais lisible (26 débordements à 390 px, 0 après repli en cartes).
- **Sans script** : le détail se lit en place, le chevron disparaît. **À l'impression** : lignes
  filtrées et détails visibles.

## 7 — Bascule de thème · `bascule-theme.css` + `bascule-theme.js`

Clair par défaut (C4), sombre sur demande et **retenu** (R-30). La clé de mémorisation se déclare
sur `<html data-cle-theme="…">` : deux documents d'un même domaine ne se partagent pas leur choix.
L'**amorce** d'une ligne, dans le `<head>`, applique le thème retenu avant la première peinture et
pose la classe `js` — elle est écrite en tête du script.

---

## Composant du document d'origine NON extrait, et pourquoi

- **Le formulaire des valeurs qui réécrit les commandes** (les repères `<TRI>` d'un déroulé
  remplacés par les valeurs saisies, peints par l'API de surlignage du navigateur) : sa mécanique est
  générique, mais ses champs, leurs motifs et leurs aides décrivaient les objets d'UNE plateforme.
  L'extraire exige de séparer le moteur (générique) de sa déclaration de champs (propre au projet) —
  candidat à la bibliothèque, pas encore fait, et le dire vaut mieux qu'un composant à moitié hissé.
- **Les schémas SVG** du guide d'origine décrivaient ses environnements : seule leur règle de forme
  est gardée (`figure.schema`, taille naturelle, jetons) ; les canevas de schéma vivent chez
  `digit-ai-schemas`.
