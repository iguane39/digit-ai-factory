# Retours forges — Produit-78 — 20260928h

- **Contexte** : application de la décision D-7 du 28/09/2026, « faire le retour au produit, ne pas faire directement », dans le run Produit-78-20260928-reseau : 3 évolutions du site du domaine demandées à son propre produit.
- **Références ledger** : `forge\ledger.jsonl` seq 181 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici.
- **Statut** : remis le 2026-09-28

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

## pilot (`digit-ai-factory`)

La doctrine ne dit pas comment un produit demande une évolution à un autre produit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-16 | mineur | générique | La doctrine décrit 2 canaux : un produit remonte ses retours au pilot (`forge\retours\` vers `input\00-retours\` du pilot), et le pilot confie des travaux à un produit (`input\00-travaux\` du produit). Aucun texte ne dit comment un produit demande une évolution à un autre. Le produit Produit-78 devait demander au produit du site de transmettre l'origine des liens suivis à Beds24. Le retour a été écrit par ajout dans le journal du produit du site (entrée 107, `ledger.mjs` → « [OK] entrée 107 ajoutée »), d'après le routage de ce produit (« consigner le retour au ledger puis run de version ») et sur décision humaine, hors de toute règle écrite. Preuve : ledger seq 181. | Écrire le canal entre produits : où le retour se dépose, sous quelle forme, et qui l'enregistre dans l'historique du produit destinataire. |

## La règle qui aurait évité le retour

Le retour n'a pas de classe au référentiel ; il porte la clé réservée `classe-a-creer` et une classe proposée.

- RP-16 : clé proposée `canal-entre-produits-absent`, famille `contrat-interface-forge`, libellé « Aucun canal écrit ne permet à un produit d'adresser un retour à un autre produit : la demande s'écrit hors règle, dans le journal du destinataire ou par le pilot, qui n'est pas concerné ».

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Aucune remarque corrigée chez le produit dans ce tour | sans objet | non | Rien n'a été corrigé chez le produit : le tour a remis un retour et consigné une décision. |

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
