# Lot de retours — Produit-64 → digit-ai-page-html — 2026-09-23, indice a

**Émetteur** : produit `Produit-64` · **Cible** : le socle `digit-ai-page-html`
(`find-in-page.js`, `render_page.py`) · **Origine** : la première ligne de tableau dépliable du
guide développeur, posée le 23/09 avec le composant 10 du socle (`table-detail.js`).

Ce lot porte **2 retours**, tous deux trouvés en jouant les interactions dans un navigateur : aucun
des oracles du socle ne les voit.

- **Contexte** : demande du porteur du 23/09/2026 sur le guide développeur — « mets le détail de
  chaque étape directement dans la liste avec des chevrons ouvrants / fermants ». Hors run de forge.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## digit-ai-page-html (`digit-ai-page-html`)

Le socle prescrit la ligne dépliable (composant 10, règle L17) et la recherche dans la page ; posés
ensemble dans un même livrable, le second désactive le premier, et l'oracle de rendu déclare
« tout déplié » une page dont aucune ligne n'est ouverte.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-17 | majeur | générique | `find-in-page.js` remet à chaque frappe le HTML d'origine de son conteneur (`container.innerHTML = pristine`) : les écouteurs posés par les AUTRES composants dans ce conteneur disparaissent. Mesuré le 23/09 sur `Client-A - Guide développeur POC-to-Prod - 20260922j.html`, livré : panneau de filtre ouvert au clic **1**, puis, après une recherche saisie et effacée, **0** au même clic | surligner sans réécrire — envelopper les nœuds texte trouvés et les dés-envelopper à la frappe suivante —, ou exposer un rappel « après restauration » que les composants suivent ; aucune règle du socle ne couvre la cohabitation des composants, classe proposée ci-dessous |
| RD-18 | majeur | générique | L'état `tout-deplie` de `render_page.py --matrice-etats` ouvre les `<details>` et le premier panneau de filtre, jamais les lignes `tr[data-detail]` du composant 10. Mesuré le 23/09 sur la vue `G8` du guide : `"tout-deplie": {"applique": true, "motif": "0 <details> ouvert(s), premier panneau deplie"}`, alors que les **11** lignes de détail restent repliées. Même trou, lu dans le code et non exécuté, dans `--etats-ouverts` (`render_page.py`, qui n'ouvre que `document.querySelectorAll('details')`) | ouvrir aussi les boutons `button[aria-controls]` dont la cible porte `data-detail`, et dire au motif combien de lignes ont été ouvertes ; un état qui n'ouvre rien de ce qu'il nomme se déclare NON JOUÉ, comme la matrice le prévoit déjà pour un déclencheur absent |

### RD-17 — La recherche dans la page désactive les autres composants du socle

**Le fait mesuré.** Sonde navigateur du 23/09/2026, Chromium, sur le livrable `20260922j` déjà
servi : un clic sur le premier bouton de filtre d'un tableau ouvre son panneau (compte **1**), un
second clic le ferme ; on saisit un mot dans la recherche du guide, on l'efface, on clique de
nouveau : le panneau ne s'ouvre plus (compte **0**). La cause se lit dans le composant :
`run()` réaffecte `container.innerHTML` à chaque frappe, ce qui recrée tous les nœuds de la zone.
Les attributs survivent — `.tf-btn` est toujours là —, les écouteurs non.

**Ce que le produit a fait chez lui.** Les chevrons de ses lignes dépliables sont écoutés au niveau
du document par un relais, qui ne bascule qu'un chevron que le composant n'a pas câblé. Mesuré :
après une recherche, le chevron ouvre et referme sa ligne. **Les filtres ne sont pas protégés** :
les recâbler après chaque recherche recopierait chez le produit une correction qui appartient au
composant, et l'écart reste ouvert chez nous (`RAF-084`).

### RD-18 — « Tout déplié » ne déplie pas le composant que le socle prescrit

**Le fait mesuré.** `render_page.py <vue G8> --widths 1280 --matrice-etats`, le 23/09/2026 : verdict
**PASS**, état `tout-deplie` déclaré **appliqué**, motif « 0 `<details>` ouvert(s), premier panneau
deplie ». La vue porte 11 lignes `tr[data-detail]`, toutes restées fermées. L'état ouvert — celui où
une ligne de détail peut déborder, où une commande longue peut sortir du tableau — n'a donc été
mesuré par aucun oracle du socle : le produit l'a mesuré avec une sonde écrite pour ce tour
(aucun débordement à 6 largeurs × 2 thèmes).

## Ordre recommandé

1. **RD-18 d'abord** : une ligne dans l'état de la matrice, et le socle voit l'état ouvert de son
   propre composant ; c'est aussi ce qui aurait fait voir RD-17 à la première page qui les combine.
2. **RD-17 ensuite** : le correctif touche un composant embarqué dans de nombreuses pages, il
   demande sa fixture — recherche puis filtre, recherche puis chevron.

## La règle qui aurait évité le retour

- **RD-17** — aucune clé existante ne décrit le défaut : `controle-joue-sur-fichier-pas-sur-instance-servie`
  dit pourquoi personne ne l'a vu (les combinaisons d'états après interaction ne sont jouées par
  personne), pas ce qu'il est. **Classe proposée** : clé `composant-qui-reecrit-le-dom-de-ses-voisins`,
  famille `page-html-socle`, libellé « Un composant du socle réécrit le HTML de son conteneur pour
  se réinitialiser et détruit en silence les écouteurs que les autres composants y ont posés :
  après son premier usage, filtres, lignes dépliables et infobulles de la zone ne répondent plus ».
- **RD-18** — classe existante `controle-vrai-sur-le-mauvais-invariant` : l'état mesure « des
  `<details>` ouverts », grandeur corrélée à « tout est déplié » tant que le socle n'avait pas
  d'autre repli ; la corrélation s'est rompue avec le composant 10, et la mécanique juste rend un
  « appliqué » faux.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La colonne « # » du tableau, prise à la proportion, faisait passer le bouton de filtre sous le « # » (capture du porteur) et aurait fait passer le chevron sous le numéro | le générateur du guide rend incompressible une colonne dont toutes les cellules portent un chevron (5,5 rem) | non | propre au calcul de largeurs de colonnes du générateur de ce produit, qui n'est pas celui du socle |
| `oracle-motion` R8 avertissait d'une durée de transition écrite en dur sur le chevron | jetons `--dur-etat` et `--ease-deplacement` du contrat de marque déclarés et consommés, 1 avertissement → 0 | non | la règle existe et a joué ; rien à remonter |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le livrable est le guide
développeur, rendu par le générateur du produit.

## Confirmations positives

- **Le composant 10 (`table-detail.js`) a tenu son contrat** : repli au chargement, ouverture par
  le `#hash` d'une entrée de sommaire, ligne de détail qui suit sa ligne mère au tri — mesuré.
- **`table-filters.js` exclut bien la ligne de détail du compte** : « 11 lignes sur 11 » avec
  11 lignes de détail présentes.
- **L17 de `check_html.py` a jugé la forme** au premier rendu : id, bouton, `colspan`, règle
  d'impression — PASS sans reprise.
