# Retours forges — Produit-78 — 20260928f

- **Contexte** : conformité du projet rejouée après l'ouverture du parcours d'animation (run Produit-78-20260928-reseau), une fois le lot « Produit-78 - RETOURS - 20260928e » remis. Un lot remis ne se modifie pas : la friction trouvée à ce moment part dans ce lot.
- **Références ledger** : `forge\ledger.jsonl` seq 157 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici.
- **Statut** : remis le 2026-09-28

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

## pilot (`digit-ai-factory`)

Un oubli dans un `run_open` devient un échec de conformité sans issue.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-14 | majeur | générique | `oracles\oracle-conformite-projet.mjs`, R-19 : « run de version sans run_precedent — les runs se chaînent » sur le `run_open` de l'entrée 141, écrit sans ce champ par oubli de la session. La règle lit le champ du `run_open` lui-même (lignes 1227 à 1229) ; R-42 interdit de réécrire l'entrée ; aucune rectification par ajout n'est lue, alors que la même règle en lit une pour `versions_forges` depuis TF-0709 et TF-0801. Le chaînage déclaré par ajout (entrée 156) reste sans effet, et le produit reste en FAIL de conformité. `references\RUN-RESEAU.md` ne liste pas non plus les champs du `run_open` d'un parcours ouvert après un autre run. Preuve : ledger seq 157. | Lire une rectification `{type: "rectification_run_open", seq_vise, champ: "run_precedent", valeur, cause}` comme R-19 lit celle de `versions_forges` ; nommer les champs du `run_open` dans chaque voie d'exécution. |

## La règle qui aurait évité le retour

Le retour n'a pas de classe au référentiel ; il porte la clé réservée `classe-a-creer` et une classe proposée.

- RP-14 : clé proposée `regle-sans-voie-de-rectification`, famille `regle-morte`, libellé « Une règle juge un champ d'une entrée de journal que R-42 interdit de réécrire, sans lire aucune rectification par ajout : un oubli devient un FAIL définitif ».

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le `run_open` du parcours omettait `run_precedent` | chaînage déclaré par ajout au journal, entrée 156 | oui | Oubli de la session ; il devient général par l'absence de voie de rectification, objet de RP-14. |
| La clé `digit-ai-confidentiel` du même `run_open` était refusée par R-19 | rectification par ajout, entrée 155, comme pour le premier run | non | Faux positif déjà remonté en RP-4 du lot « Produit-78 - RETOURS - 20260928a ». |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| aucun document de la bibliothèque | — | — | — | — | — |

## Documents mûrs

Aucun document mûr sur ce lot : aucun document du produit n'a été repris 5 fois, et aucun verdict de lecteur n'a été rendu.

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| aucun | — | — | — | — | reste au produit, parce qu'aucun document n'est mûr |
