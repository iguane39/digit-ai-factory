# Retours forges — Produit-82 — 20261127e

- **Contexte** : comparaison de 18 maquettes de tableau de bord conçues par Claude, Codex et Gemini sur un même cahier des charges, le 27/11/2026.
- **Références ledger** : `forge\ledger.jsonl` seq 433
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-27

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-forge-agents, skill delegue-a-codex-et-gemini

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-69 | majeur | générique | Le geste `concevoir` transmet le cahier des charges du produit, mais pas les règles que les oracles de la Factory jugent. Sur les 12 maquettes de Codex et de Gemini, `render_page.py` compte de 11 à 911 constats bloquants par page, presque tous des chevauchements entre une zone de survol transparente et les marques SVG. Les 6 maquettes de Claude, dont les agents connaissaient `data-overlap-ok`, en comptent de 0 à 3. La critique `run-oracles-design` rend FAIL sur les 18, pour les jetons, l'échelle de 4 px et la parité de thème. La comparaison mesure donc en partie la connaissance des oracles, pas seulement le design. Preuve : `forge\ledger.jsonl` seq 433 et 432. | Joindre à la consigne de `concevoir` un extrait court des règles jugées et les commandes à rejouer. L'extrait couvre les jetons en `:root` avec un thème sombre complet, l'échelle de 4 px, `data-overlap-ok` pour les calques de survol et le contraste AA. |

## Remarques restées au produit

- La note de comparaison du produit signale ce biais et donne, à côté du total, le compte des constats hors chevauchements (généralisable : non).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Les 4 gestes `concevoir` lancés en parallèle ont tous rendu PASS, entre 1 079 et 1 263 secondes, avec leurs 3 maquettes et leur fichier de directions. Les 12 pages affichent les chiffres du moteur commun fourni.

## Ordre recommandé

1. RT-69, seul retour du lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit pas une correction du porteur. La règle est qu'un concepteur jugé par un oracle reçoit les règles de cet oracle avec son cahier des charges. Classe proposée : `brief-tiers-sans-conventions-des-oracles`.
