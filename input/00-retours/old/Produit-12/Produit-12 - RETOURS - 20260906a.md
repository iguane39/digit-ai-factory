# Retours forges — Produit-12 — 20260906a

- **Contexte** : session hors run du 2026-09-05 (fiches Memento, avant / après BERNARD, référentiel
  de réponses types v2) — remise sur mandat humain du 2026-09-06 (action A-4). Une friction
  mesurée sur trois pages HTML conformes au socle : la critique d'implémentation de forge-design
  rend FAIL pour des écarts que le socle lui-même embarque.
- **Références ledger** : `forge\ledger.jsonl` seq 144 (le retour), 145 (mesures de la session),
  146 (mandat humain de remise)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici.
- **Statut** : remis le 2026-09-06 dans la boîte d'entrée du pilot (`<pilot>\input\00-retours\`) — ce lot ne se modifie plus

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du
produit : la série RS s'arrêtait à RS-23 (lot 13).

---

## digit-ai-forge-design (et le socle `digit-ai-page-html`)

Le cas tient en une phrase : **une page qui suit le socle à la lettre ne peut pas passer la
critique d'implémentation**, parce que le composant de filtres de tableau que le socle prescrit
et embarque (`table-filters.css` / `.js`, posé avec son empreinte, parité d'asset exigée) porte
lui-même des couleurs en dur, des espacements hors échelle 4 pt et des anneaux de focus posés
sans être prescrits.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-24 | mineur | générique | **La critique forge-design juge le CSS hérité du socle comme s'il était celui de l'auteur.** Mesuré le 2026-09-05 sur deux pages neuves (fiches Memento, avant / après BERNARD) puis le 2026-09-05 sur une troisième (référentiel de réponses types v2) : `check_html.py` PASS (36 règles, empreinte c16177d42a88), `render_page.py` PASS (4 largeurs, matrice d'états), et `run-oracles-design.mjs --json-only` FAIL avec 19 à 20 écarts durs par page — oracle-tokens T1 (`color: #fff` sur `.tf-btn.tf-on`, `background: #f6f8fc` sur `.tf-opts label:hover`), T3 (14 espacements 2, 3, 6, 7, 10, 14, 18 px sur `.tf-btn`, `.tf-panel`, `.tf-search`, `.tf-actions`, `.tf-opts`, `.tf-reset`, `tr[data-tf-empty] td`), T8 (4 anneaux de focus `:focus-visible` posés), et oracle-slop S4 (couleur pure #fff, la même). Une fois le CSS propre à l'auteur corrigé (filets 3 px → 1 px, échelle 4 pt, couleur pure du favicon), la liste « hors socle » est vide sur les trois pages : `[]`. Tous les écarts restants vivent dans le bloc `COMPOSANT-EMBARQUE table-filters.css`, que l'auteur n'a pas le droit de modifier (oracle de parité d'assets). Preuves : `forge\oracles\Produit-12 - Proposition fiches memento - 20260905a.json`, `… - Exemple avant apres BERNARD - 20260905a.json`, `… - Proposition reponses types - 20260905a.json` (les trois journaux R-32 portent les trois verdicts côte à côte, avec le partage socle / hors socle) | Deux voies, l'une ou l'autre : (1) le socle aligne `table-filters.css` sur ses propres tokens et sur l'échelle 4 pt, et déclare ses anneaux de focus (source unique, propagée par R-47 à tous les produits) ; (2) `run-oracles-design.mjs` exempte les blocs `COMPOSANT-EMBARQUE` dont l'empreinte correspond à un asset du socle, et ne juge que le CSS de l'auteur — le verdict redevient une mesure du travail de la session. La voie (1) est la bonne à terme, la voie (2) rend le verdict utile dès maintenant |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot — vérifié par la session du 2026-09-06 : les
écarts propres aux trois pages (identifiants de chapitre et de tableau en doublon, filets de
3 px, espacements hors échelle, jeton insécable en repli-cartes, contraste des compteurs à zéro)
ont été corrigés dans les constructeurs du produit (`construire_pages.py`, `rendre_html.py`) et
sont passés rouge → vert sur `check_html`, `render_page` et la partie « hors socle » de la
critique ; rien de local ne subsiste.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot —
vérifié par la session du 2026-09-06 : les livrables de la session sont des pages HTML sur le
socle `digit-ai-page-html` (jugées par ses oracles) et des Markdown jugés par `quality-oracles`.

## La règle qui aurait évité le retour

Aucune clé de `forge\retours\CLASSES.json` ne nomme ce défaut : la plus proche est
`page-html-filtres-tableau` (défauts du composant de filtres), retenue dans le sidecar faute de
mieux. La classe manquante serait : « un oracle juge le CSS hérité d'un socle comme celui de
l'auteur » — un verdict qui ne distingue pas ce que la session a écrit de ce qu'elle a reçu ne
mesure rien de son travail.

## Confirmations positives

- **Le partage socle / hors socle est calculable** depuis les findings de la critique (champ
  `where` : sélecteur `.tf-*` ou bloc `COMPOSANT-EMBARQUE`) : les journaux R-32 du produit le
  portent, ce qui a permis de corriger tout ce qui était corrigeable sans toucher au socle.
- **Les oracles du socle et de la critique se complètent bien** sur le CSS de l'auteur : L7 et
  L10 (structure), V1 et V2 (rendu), S1, T3 et S4 (critique) ont chacun trouvé un défaut réel et
  distinct sur les mêmes pages en une session.

## Ordre recommandé

1. **RS-24 voie (2)** — exempter les blocs `COMPOSANT-EMBARQUE` à empreinte connue : un
   changement de lecture dans l'orchestrateur, sans toucher au socle, qui rend le verdict
   exploitable dès la prochaine page.
2. **RS-24 voie (1)** — aligner `table-filters.css` sur les tokens et l'échelle 4 pt, propagé
   par R-47 : le défaut disparaît à la source pour tous les produits.
