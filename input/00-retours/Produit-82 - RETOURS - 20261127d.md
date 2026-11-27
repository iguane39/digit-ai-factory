# Retours forges — Produit-82 — 20261127d

- **Contexte** : demande du porteur du 27/11/2026, « 3 maquettes de Dashboard, pour chaque LLM, Claude, Codex & Gemini », pour 2 tableaux de bord ; la session l'a lue de travers et le porteur l'a corrigée.
- **Références ledger** : `forge\ledger.jsonl` seq 430
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-27

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-factory (pilot), lecture de la demande

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-68 | majeur | générique | La demande portait sur 2 tableaux de bord et sur « 3 maquettes, pour chaque LLM, Claude, Codex & Gemini ». La session l'a lue comme « un tableau de bord par LLM suivi » et a livré 3 pages en 32 minutes. Elle n'a pas chargé le skill `delegue-a-codex-et-gemini`, dont le déclencheur couvre « un design, une maquette ou une direction artistique demandé à Claude ». Correction du porteur, mot pour mot : « La demande n'a pas été comprise. J'attends 2 types de dashboard différents, et pour chaque dashboard, 3 maquettes, construites par chaque LLM. Donc j'attends au final 9 maquettes pour le premier Dashboard et 9 maquettes pour le deuxième dashboard. Recommence. » Preuve : `forge\ledger.jsonl` seq 430. | Quand une demande de maquette nomme Claude, Codex ou Gemini, la session charge `delegue-a-codex-et-gemini` avant de construire. Elle écrit en une ligne le compte des livrables attendus (types × concepteurs × variantes) avant le premier fichier. Un hook avant outil peut le rappeler quand une demande nomme ces 3 modèles et le mot « maquette ». |

## Remarques restées au produit

- Les 3 pages livrées par erreur restent dans `output\02-maquette-portail\` (indices a, b, c). La reprise produit 18 maquettes aux indices d à u (généralisable : non).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `agent-tiers.mjs etat` a rendu PRET pour Codex et Gemini en une commande. La reprise a lancé 4 gestes de conception en parallèle sans autre réglage.

## Ordre recommandé

1. RT-68, seul retour du lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot suit une correction du porteur. Une demande qui nomme des LLM à côté du mot « maquette » se lit d'abord comme une demande de conception confiée à ces LLM, et le compte des livrables se pose avant de construire. Classe proposée : `concepteurs-nommes-lus-comme-sujets`.
