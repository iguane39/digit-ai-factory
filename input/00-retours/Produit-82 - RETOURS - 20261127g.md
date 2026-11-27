# Retours forges — Produit-82 — 20261127g

- **Contexte** : reprise de 18 maquettes de tableau de bord à la charte Digit-AI, le 27/11/2026, dont 12 conçues par Codex et Gemini avec le skill `delegue-a-codex-et-gemini`.
- **Références ledger** : `forge\ledger.jsonl` seq 438
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-27

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-forge-agents, skill delegue-a-codex-et-gemini

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-72 | majeur | générique | Les 3 maquettes de Gemini pour le tableau A pèsent de 85 à 91 Ko et portent encore les emplacements `/*__CHARTE_CSS__*/`, `/*__MOTEUR_JS__*/` et `/*__THEME_JS__*/`, non remplis. Le lanceur a pourtant rendu PASS, parce que les livrables étaient présents et non vides. La page plante au chargement (« MOTEUR is not defined ») et s'affiche sans la charte. Sans le banc de la session, ces 3 maquettes seraient parties au porteur cassées. Preuve : `forge\ledger.jsonl` seq 438. | Le geste `concevoir` vérifie avant de rendre PASS que le livrable HTML ne porte plus d'emplacement `/*__X__*/` ni `{{x}}` et qu'il se charge sans erreur JavaScript. Sinon il rend PARTIEL avec le motif. |

## Remarques restées au produit

- L'assemblage des 3 maquettes de Gemini est complété par la session : chaque emplacement a été remplacé par le fichier fourni du même nom, sans autre modification. La note de comparaison le dit (généralisable : non).
- La session avait mesuré une copie des maquettes de Gemini pour le tableau B prise avant la fin de leur assemblage, et le banc rendait une erreur qui n'existait plus. La mesure a été rejouée sur les fichiers finaux, après le compte rendu du lanceur (généralisable : oui, ne mesurer qu'après le compte rendu de l'agent).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Avec le kit de charte et les règles des oracles joints au cahier des charges, les maquettes de Codex passent de 221 à 338 constats de rendu par page à 0 à 50.

## Ordre recommandé

1. RT-72, seul retour du lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit pas une correction du porteur. La règle est qu'un verdict de livraison d'un agent tiers juge le livrable ouvert, pas seulement sa présence sur le disque. Classe proposée : `livrable-tiers-juge-sur-sa-presence`.
