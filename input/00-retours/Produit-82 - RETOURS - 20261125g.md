# Retours forges — Produit-82 — 20261125g

- **Contexte** : construction de la direction Fit-Retail du portail, servie sous `/fit-retail` à la charte du site du client (EF-74). Les oracles de rendu et la critique d'implémentation ont rendu PASS sur une page dont un champ affichait une valeur rognée.
- **Références ledger** : `forge\ledger.jsonl` seq 364
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-25

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-forge-design et digit-ai-page-html, oracles de rendu

Le retour porte sur un défaut d'affichage que les 2 oracles de rendu laissent passer.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-55 | majeur | générique | Le 25/11/2026, page Comptes de la direction Fit-Retail à 1920 px : le champ numérique de la part de conversation, large de `9ch` comme en TCO, affiche « 10000( » au lieu de « 100000 », car Poppins est plus large que Barlow. `render_page.py` rend PASS aux 7 largeurs, avec une liste `contenu_rogne` vide, et `run-oracles-design` rend 16/16 PASS. Le défaut n'a été vu qu'en regardant la capture. Preuve : `forge/etapes/version-20261125-fit-retail/apercu-comptes-sombre.png` (avant), `apercu-comptes-part.png` (après le passage à `12ch`). | Un contrôle compare la largeur utile d'un champ (`clientWidth` moins ses marges intérieures) à la largeur de sa valeur, mesurée dans sa police calculée (`measureText` d'un canvas), et rend FAIL quand la valeur dépasse. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le champ de la part de conversation rognait sa valeur sous Poppins | `form.geste-part input { width: 12ch; }` dans `direction-fit-retail.css`, contrôlé sur capture | oui, toute direction qui change de police peut rogner les champs à largeur en `ch` | corrigé |

- RT-55, généralisable : oui. Une valeur de champ rognée ne se voit ni dans le DOM ni dans les styles calculés : seule la mesure du texte dans sa police la révèle.

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `render_page.py` a refusé de juger une page authentifiée sur l'origine distante de la recette (`--etat-session` refusé hors origine locale) : le jugement est resté sur le portail local, au même commit.

## Ordre recommandé

1. RT-55 : une valeur rognée dans un champ de saisie fausse ce que la personne lit ou corrige, et passe aujourd'hui tous les oracles.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle est qu'un oracle de rendu mesure la valeur de chaque champ de saisie dans sa police calculée, et la compare à la largeur utile du champ. Classe proposée : `valeur-de-champ-rognee-non-mesuree`.
