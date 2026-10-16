# Lot de retours — Produit-64 → digit-ai-page-html — 2026-09-24, indice a

**Émetteur** : produit `Produit-64` · **Cible** : le socle `digit-ai-page-html`
(`render_page.py`, règle L19 de `check_html.py`) · **Origine** : la vue « Audit & Remédiation »
du guide développeur, posée le 24/09.

Ce lot porte **1 retour**, trouvé à la revue de lecture des captures : aucun des scripts du socle
ne l'a vu.

- **Contexte** : demande du porteur du 24/09/2026 sur le guide développeur — « crée un onglet
  Audit & Remédiation » : l'audit des POC, le prompt qui le lance, la rétrogradation possible du
  modèle, la durée, les fichiers déposés, le prompt de remédiation. Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## digit-ai-page-html (`digit-ai-page-html`)

Un mot coupé en son milieu, dans une cellule de tableau, passe les trois scripts du socle : la
règle qui l'interdit ne juge que la cause la plus fréquente, et le contrôle de l'effet n'existe pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-21 | mineur | générique | `render_page.py` rend **PASS, 0 bloquant sur 7 largeurs** (3840 → 390) une page où le mot « **Remédiation** », en gras dans une cellule, se rend « Remédiatio » puis « n » sur la ligne suivante, sans césure ni trait d'union, à 1920 et 1280 px. La cellule porte `overflow-wrap: break-word`, pas `anywhere` : **L19 de `check_html.py` ne vise que `anywhere` et `break-all`**, et rend PASS. Le socle le déclare dans `references/lisibilite.md`, §L19 : « Détecter au rendu qu'un mot est effectivement tombé sur deux lignes sans césure demande un navigateur et vit dans `render_page.py` ; ce contrôle-là n'existe pas encore. » Mesuré le 24/09 sur la vue « Audit & Remédiation » du guide, rendue seule, avant correction | écrire le contrôle de rendu que L19 annonce : pour chaque mot d'un élément de texte, un mot dont les rectangles `Range.getClientRects()` tombent sur deux lignes sans trait d'union est un constat ; même exemption `data-coupure-ok` qu'en statique ; fixture rouge : une cellule de 7 rem portant « Remédiation » en gras sous `overflow-wrap: break-word` |

### RD-21 — Un mot coupé au rendu que ni L19 ni `render_page` ne voient

**Le fait mesuré.** Tableau à cinq colonnes de prose dont la première, « Temps », porte deux
libellés d'un mot en gras, « Audit » et « Remédiation ». La page donne à chaque colonne une part
au prorata de son contenu : la première reçoit 7 % de la table, moins que la largeur du mot en
gras. Le navigateur applique `overflow-wrap: break-word` et casse le mot. Captures de
`render_page` à 1920 et 1280 : « Remédiatio / n ». Verdicts sur cette même page : `check_html`
PASS (42 règles, empreinte `80a50927d99d`), `render_page` PASS, `run-oracles-design` PASS 9/9.

**Pourquoi L19 ne pouvait pas le voir.** `break-word` est légitime sur la prose : il évite qu'une
adresse ou un mot très long déborde de sa colonne. L'interdire en statique accuserait des pages
saines. Seul le contrôle de rendu distingue le mot coupé qu'on voulait éviter du débordement
qu'on voulait empêcher.

**Ce que le produit a fait chez lui.** Il a transposé le tableau : « Audit » et « Remédiation »
sont devenus des en-têtes de colonne, et plus aucun mot n'est coupé aux 7 largeurs. Le correctif
ne vaut que pour ce tableau-là ; la classe reste ouverte sur toute page qui répartit ses colonnes
au prorata du contenu.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La part au prorata du besoin ne garantit pas à une colonne la largeur de son plus long mot | tableau transposé à la source | non | calcul propre au générateur du guide ; la classe générale, un mot coupé que rien ne voit, est remontée en RD-21 |
| La dernière phrase de la tête de vue collait au premier chapitre (espace de 0 px) | phrase placée avant le tableau | non | V7 de `render_page` l'a signalé : le socle a joué juste |
| Les règles propres au guide ne s'ouvrent plus en fiche depuis l'indice `20260922f` (32 fiches, puis 0) | non corrigée, consignée au registre du produit | non | le motif de collecte du générateur ne suit plus la structure de chapitre qu'il écrit lui-même |
| La vue « Sécurité et secrets », rendue seule, porte 29 recouvrements V4 bloquants | non corrigée, consignée au registre du produit | non | V4 les voit dès que la vue est peinte : le socle a joué juste |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le livrable est le guide
développeur, rendu par le générateur du produit.

## Confirmations positives

- **V7 de `render_page` a vu l'espace nul** entre la tête de vue et le premier chapitre, et le
  même relevé sur la vue Installation a permis de dire ce qui était propre à la nouvelle vue.
- **`check_completude` a suivi l'ajout** : 71 982 mots visibles pour 20 553 de source, couverture
  350,2 %.
- **`run-oracles-design` est stable** d'un indice à l'autre : 9 oracles verts, et les mêmes comptes
  d'avertissements (10 `oracle-tokens`, 9 `oracle-taste`) qu'au `20260923b`.

## Ordre recommandé

1. **RD-21**, seul retour du lot : une sonde de rendu par mot, une fixture de deux lignes, et la
   promesse que L19 écrit depuis le 22/08 devient un contrôle.

## La règle qui aurait évité le retour

- **RD-21** — la règle existe : **L19** de `references/lisibilite.md`, « la coupure de mot est
  réservée à ce qui en a besoin ». Sa moitié de rendu est déclarée absente par le socle lui-même.
  Classe : `regle-ecrite-sans-oracle-qui-la-joue`.
