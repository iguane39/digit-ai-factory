# Retours forges — Produit-82 — 20261125c

- **Contexte** : le portail est construit aussi dans les directions Folio et Rive, servies sous les préfixes `/folio` et `/rive` (étape version-20261125-directions-folio-rive, EF-71). Le parcours navigateur des 2 directions a révélé un défaut de contraste déjà présent en TCO.
- **Références ledger** : `forge\ledger.jsonl` seq 331
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-25

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Remarques restées au produit

Le défaut porte sur une règle du portail et se corrige dans le produit ; aucune forge n'est visée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Correction faite |
|---|---|---|---|---|
| RT-51 | mineur | produit | Le 25/11/2026, Playwright mesure sur la pile locale, en thème sombre, la bascule de thème enfoncée puis survolée : fond `--surface-creuse` (oklch 0.30) sous le texte `--accent-contraste` (oklch 0.20), soit environ 1,3:1. Le défaut existe en TCO comme sous `/folio` et `/rive` (ledger seq 331). | Règle `.theme-toggle[aria-pressed="true"]:hover` ajoutée à `Produit-82/portail/actifs/portail-adaptations.css` : la bascule enfoncée garde son fond d'accent au survol. |

- RT-51, généralisable : oui. Tout portail qui pose un fond de survol commun à ses boutons, sans exception pour l'état enfoncé, a le même défaut ; un contrôle de rendu qui mesure les états combinés le trouverait.

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Les jetons de TCO, sans aucune couleur littérale dans `composition-tco.css`, ont permis d'habiller tout le portail dans 2 autres directions par 2 feuilles chargées après la sienne, sans toucher au gabarit des écrans.

## Ordre recommandé

1. RT-51 : déjà corrigé dans le produit, à confirmer par le rendu en sombre.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle est qu'un état combiné, enfoncé et survolé, se juge au contraste comme chaque état seul. Classe proposée : `etat-combine-non-mesure`.
