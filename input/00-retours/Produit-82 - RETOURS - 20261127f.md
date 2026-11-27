# Retours forges — Produit-82 — 20261127f

- **Contexte** : retour du porteur, le 27/11/2026, sur la comparaison de 18 maquettes de tableau de bord conçues par Claude, Codex et Gemini. Il demande de conserver un principe et d'en ajouter un.
- **Références ledger** : `forge\ledger.jsonl` seq 436, 437
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-27

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-forge-design, comparaison de maquettes

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-70 | majeur | générique | Le porteur demande de garder la planche mosaïque. Consigne, mot pour mot : « Très bien les mosaïques d'images, à conserver dans les principes de la Factory. » Les 2 planches livrées assemblent 9 captures à 1920 px en 3 rangées, une par concepteur, avec le nom de chaque maquette : `output\02-maquette-portail\Produit-82 - Planche - Dashboard Couts - 20261127w.png` et `… Empreinte - 20261127x.png`. Le script qui les produit tient en 30 lignes de Pillow. Preuve : `forge\ledger.jsonl` seq 436. | Toute comparaison de maquettes ou de directions livre une planche mosaïque des captures, avec une rangée par concepteur ou par direction et le nom de chaque maquette. L'outil de la planche entre dans forge-design, à côté de la critique d'implémentation. |
| RT-71 | majeur | générique | Le porteur ajoute un principe. Consigne, mot pour mot : « Rajoute le principe que les maquettes doivent suivre la charte graphique de l'application existante, sinon il est difficile de se projeter sur le résultat final une fois implémenté. » Les 18 maquettes du 27/11 avaient chacune leur propre charte, sans lien avec le portail servi sous /Digit-AI. Elles sont refaites dans le cadre réel du portail : un kit autonome tiré de la page servie, avec les 6 feuilles réelles et les polices embarquées. Preuve : `forge\ledger.jsonl` seq 437. | Le cahier des charges d'une maquette d'un produit existant joint l'interface servie (balisage, feuilles et polices réels) et exige qu'elle s'y insère. Un contrôle compare les jetons de la maquette à ceux de la charte du produit et refuse une couleur hors de ces jetons. |

## Remarques restées au produit

- Le kit de charte du produit est construit par un script de session (`kit.py`) à partir de `forge\etapes\version-20261126-tenon-fidele\Digit-AI-consommation-servie.html` et de `Produit-82\portail\actifs` (généralisable : oui, par RT-71).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le porteur a validé la planche mosaïque comme forme de comparaison.

## Ordre recommandé

1. RT-71 : sans la charte de l'application, une comparaison de maquettes ne se projette pas sur le produit.
2. RT-70 : l'outil existe déjà ; il reste à le ranger dans forge-design.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot porte une décision du porteur. La règle est qu'une maquette d'un produit existant naît dans le cadre et la charte de l'application servie, et qu'une comparaison se livre en planche mosaïque. Classes proposées :
- `maquette-hors-charte-de-l-application` (RT-71) ;
- `comparaison-sans-planche-mosaique` (RT-70).
