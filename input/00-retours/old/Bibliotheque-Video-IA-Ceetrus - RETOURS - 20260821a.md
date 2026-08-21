# Retours forges — Bibliothèque vidéo IA Ceetrus — 20260821a

- **Contexte** : run de conseil du 21/08/2026 (reprise de l'audit de la Production Nhood du 18/08 avant MEP) — production du livrable `output\Nhood - Diagnostic - Constats Prod avant MEP - Bibliotheque Video IA Ceetrus - 20260821a.{md,html}`
- **Références ledger** : sans objet — run de conseil mené hors socle de ledger produit (le produit n'en porte pas)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-21

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Origine de ce lot** : un **retour humain direct du 21/08/2026** sur le livrable HTML remis
(« le rapport HTML affiche des textes sur une partie de la largeur seulement, ce problème avait
déjà été remonté à la factory »). Le point avait effectivement été remonté le 13/08 sous
**TF-0172** et clos le même jour en « seconde partie **réfutée** avec citation », avec
`gains_constates: zéro correctif nécessaire`. Ce lot est donc un **reconstat** : il apporte ce
que la clôture du 13/08 n'avait pas, à savoir le **verdict exécuté de l'oracle** de la forge
elle-même.

---

## digit-ai-forge-agents (`digit-ai-forge-agents`) — skill `digit-ai-page-html`

Le socle a bien tenu sur ce livrable (deux oracles, 21 règles), mais deux de ses affordances
se contredisent sur la largeur de lecture, et une troisième laisse croire qu'un conteneur
scrollable suffit à faire passer V1.

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RA-1 | bloquant | **RECONSTAT de TF-0172.** `assets\boilerplate.html` porte `p, li { margin: 0 0 1em; max-width: var(--prose); }` avec `--prose: 75ch`. Une page construite **à partir du boilerplate sans y toucher** est jugée en défaut BLOQUANT par l'oracle de la même forge : `render_page.py` → `[BLOQUANT] L2 largeur de texte : p « Ces constats arrivent dans une fenêtre c… » — largeur 647px pour 1130px disponibles (ratio 0.57, seuil 0.85) — bride par max-width:646.875px`. Après retrait de la bride : PASS aux trois breakpoints (1280 / 768 / 390). TF-0172 avait remonté **exactement** ce point le 13/08 ; il a été clos « seconde partie réfutée avec citation » de la doctrine E4, **sans que l'oracle qui la contredit soit joué**. | Aligner le boilerplate sur celui de ses deux textes qui fait foi après arbitrage (cf. RA-3), et à la clôture d'un item réfuté sur un artefact outillé, exiger le **verdict de l'oracle**, pas la citation d'une doctrine (R-35 : gates en défaut vérifiés, jamais présumés). |
| RA-2 | majeur | **L2-rendu mesure le ratio contre le CONTENEUR : déplacer la bride d'un cran le satisfait sans rien changer pour le lecteur.** Mesuré sur la même page : bride portée par `p` → BLOQUANT (ratio 0,57) ; **même** bride portée par un `div` parent (`width: min(100%, 82ch)`, `p { max-width: none }`) → **PASS**, alors que le texte occupe toujours ~57 % de la fenêtre à 1280 px. C'est précisément l'état que le lecteur humain a refusé le 21/08. L'échappatoire prescrite par la doctrine (« la mesure de lecture se règle sur le conteneur, pas sur le paragraphe », SKILL.md) est l'angle mort exact du contrôle. | Mesurer aussi le bloc de texte contre la largeur du **conteneur principal** (`.wrap`), ou dénoncer un conteneur de lecture qui laisse plus de 15 % de vide à sa droite sans contenu voisin. Sans cela, la règle est satisfiable sans être tenue. |
| RA-4 | majeur | **`overflow-x: auto` ne fait pas passer V1** : le contrôle compare `getBoundingClientRect().right` au viewport, sans regarder si un ancêtre défile. Mesuré sur cette page, dont **tous** les tableaux étaient déjà dans un conteneur `overflow-x: auto` : **26 défauts V1 à 390 px** (25 causes distinctes, 935 éléments) et **4 à 768 px** ; **0** après repli des tableaux en cartes sous 900 px (`data-label` + `td::before { content: attr(data-label) }`). Or le repli en cartes n'est ni dans le boilerplate ni dans les composants obligatoires (il n'est cité qu'en option dans `references\composants.md`), et la consigne générale « wide content must scroll inside its own `overflow-x: auto` container » laisse croire l'inverse. | Verser le repli en cartes au boilerplate (ou aux composants obligatoires dès qu'une page porte un tableau de plus de 3 colonnes), et corriger la phrase : un conteneur scrollable ne fait pas passer V1, il rend seulement le tableau consultable. |

## pilot (`digit-ai-factory`) — référentiel `BEST-PRACTICES-HTML.md`

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RA-3 | majeur | **La doctrine E4/L2 produit un résultat refusé par un lecteur humain sur un livrable réel.** `BEST-PRACTICES-HTML.md` E4 : « La prose reste bornée en `ch` (`--prose`) : c'est le conteneur qui s'élargit, pas la ligne de texte (L2) », conteneur à `clamp(75vw, 1680px, 92vw)`. À 1280 px de fenêtre, cela donne 647 px de texte pour 1130 px de conteneur — soit la moitié de la page vide à droite, ce que le retour humain du 21/08 nomme comme défaut. Trois textes coexistent aujourd'hui sans hiérarchie : E4 (prose bornée), L2-rendu (bloc ≥ 85 % de la largeur offerte), et le boilerplate (bride sur le paragraphe, forme que L2 interdit). | Trancher **une fois** et l'écrire dans le référentiel : soit la prose remplit le conteneur (et E4 le dit, et le boilerplate retire sa bride), soit elle reste bornée et le conteneur cesse d'être à 92 vw pour les pages de prose. En l'état, chaque run refait l'arbitrage — c'était déjà le `preuve_du_cout` de TF-0172 le 13/08. |

## Confirmations positives

- `check_html.py` : **PASS, 21 règles, aucun avertissement** sur le livrable final. Les règles de lisibilité ont attrapé de vrais manques, pas du bruit : **L6** (27 entrées de sommaire sans annonce `.toc-d`), **L7** (27 chapitres sans chapeau `.ch-apprend`), **L10** (chapitres de données sans exemple de lecture), **L14** (la convention de sourçage `[src: …]` rendue en clair — exemptée par `data-motif-ok` avec son motif), **L1** (un nom de ressource écrit `stiactfstatepr…` lu comme du texte tronqué — c'était bien une valeur à préciser). Aucune de ces cinq n'aurait été vue à la relecture humaine.
- `render_page.py` : le regroupement des débordements **par sous-arbre responsable** (TF-0382) a rendu l'inventaire exploitable — 25 causes annoncées au lieu de 16 relevés plafonnés, et la borne déclarée. Sans lui, le repli en cartes n'aurait pas été identifié comme le correctif unique.
- Les captures ne sont pas tombées dans l'arbre de livraison (TF-0230) : `--out` a été respecté, `output\` du produit est resté propre.
- Le repli en cartes tient à 390 px : l'en-tête de colonne devient l'étiquette de la valeur, les 40 lignes du tableau de mesures restent lisibles sans défilement horizontal.

## Ordre recommandé

1. **RA-3** d'abord — c'est l'arbitrage dont RA-1 et RA-2 sont les conséquences. Le trancher rend les deux autres mécaniques.
2. **RA-1** ensuite — une ligne de CSS au boilerplate, une fois RA-3 tranché ; et la prescription de clôture (verdict d'oracle exigé sur un item réfuté) qui a laissé passer le reconstat.
3. **RA-4** — indépendant des trois autres, gain immédiat sur toute page à tableaux.
4. **RA-2** — le plus coûteux (évolution de la mesure), mais c'est lui qui empêchera le prochain reconstat.
