# Retours forges — Produit-82 — 20261126c

- **Contexte** : le porteur a comparé la maquette Tenon et la page servie sous /Digit-AI, captures à l'appui, et constaté que ce ne sont pas les mêmes pages. Tous les contrôles du tour étaient pourtant au vert.
- **Références ledger** : `forge\ledger.jsonl` seq 384, 385
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-26

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-forge-design et digit-ai-factory, fidélité d'une page à sa maquette

Le retour porte sur l'absence de contrôle entre une page portée et la maquette dont elle se réclame.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-60 | majeur | générique | Le 26/11/2026, une page déclarée portée de la maquette Tenon a passé render_page (12 rendus PASS), la critique d'implémentation (15/15, 15/15 et 16/16 PASS) et la relecture d'intention de fin de tour (« sert », confiance moyenne). Elle n'avait ni la structure ni les composants de la maquette : le porteur l'a vu en posant deux captures côte à côte. La critique juge la page contre des règles, jamais contre sa source. Le relecteur d'intention ne lit que du texte, sans capture. Preuve : `forge\ledger.jsonl` seq 385. | Un oracle de fidélité à la maquette : les mêmes écrans rendus à la même largeur, l'inventaire des régions et composants de la maquette retrouvés ou non dans la page, et la capture côte à côte jointe à la relecture d'intention quand la demande nomme une maquette. |

## Remarques restées au produit

- RT-59 (seq 384) : les écrans servis sous /Fit-Retail2 et /Digit-AI gardent le balisage de TCO. Seuls la feuille de style et deux éléments de l'inspecteur ont changé. La restriction était écrite dans la feuille de composition, sans être dite au porteur. La reprise au balisage de la maquette se fait au produit (généralisable : oui, c'est RT-60).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

Aucune confirmation positive sur ce lot : le défaut a traversé tous les contrôles joués.

## Ordre recommandé

1. RT-60 : un portage de maquette qui ne contrôle pas sa fidélité à la maquette peut passer tous les oracles et rater la demande.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot suit une correction humaine. Une page qui se réclame d'une maquette se juge contre cette maquette, capture contre capture, avant d'être annoncée comme portée. Une restriction de périmètre se dit au porteur au moment où elle est prise. Classe proposée : `page-portee-sans-controle-de-fidelite-a-sa-maquette`.
