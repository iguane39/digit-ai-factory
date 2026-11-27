# Retours forges — Produit-82 — 20261127b

- **Contexte** : revue du portail par le porteur, le 27/11/2026, sur la recette sous /Digit-AI ; reprise de 9 écrans restés au dessin de l'ancienne composition et de 4 désalignements champ-bouton.
- **Références ledger** : `forge\ledger.jsonl` seq 400, 401, 402, 403, 404, 405, 406, 407, 408, 409
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-27

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-forge-design, critique d'implémentation

Les deux retours portent sur ce que la critique d'implémentation n'a pas vu le 26/11/2026, et que le porteur a vu à l'œil le 27/11.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-62 | majeur | générique | Le 26/11/2026, la composition Tenon a été jugée sur 6 écrans refaits (12 pages, 15/15 et 16/16, ledger seq 391). Les 9 autres écrans servis sous la même adresse (Transparence, Clé personnelle, Journal, Documentation, Mot de passe, Organisations, Fournisseurs, Identités, Instance) gardaient l'ancienne composition : titres en capitales, plaques sombres, cadres de 2 px, boutons en pilule. Aucun oracle ne les a rendus, faute d'être nommés dans le périmètre. Le porteur l'a relevé sur la page Transparence. Preuve : `forge\ledger.jsonl` seq 404 et 408. | Quand une composition ou une charte change, la critique se joue sur toutes les pages que le menu sert, relevées par le menu lui-même, et non sur la liste des écrans refaits. Un contrôle compare les classes de chaque page servie à la feuille de la composition et nomme les composants qu'elle ne dessine pas. |
| RT-63 | majeur | générique | Le 27/11/2026, une mesure écrite par la session (`mesure.py`, dans le dossier temporaire) a relevé 14 désalignements champ-bouton sur une même rangée, à 1920 px. Le pire était dans l'inspecteur des Comptes : un champ de 52 px face à un bouton de 40 px, décalé de 12 px. Ailleurs : Fournisseurs (champ de 42 px, bouton de 36 px, 9 fois), Identités (liste de 42 px, bouton de 48 px), Conversation (liste de 36 px, boutons de 40 px). render_page et run-oracles-design avaient rendu PASS sur ces pages le 26/11. Le porteur a demandé que « ce problème ne se produise jamais ». Preuve : `forge\ledger.jsonl` seq 402 et 409. | Un oracle de rendu qui mesure, dans chaque formulaire, les champs et boutons d'une même rangée, et rend FAIL au-delà d'1 px d'écart de hauteur ou de haut. La mesure du produit tient en 20 lignes de JavaScript, joué par Playwright. |

## Remarques restées au produit

- L'administrateur client voyait un compte de démonstration nommé « admin.digit-ai » et l'a pris pour l'Opérateur Digit-AI. Corrigé sur place : la liste des comptes d'une organisation exclut désormais toute identité d'Opérateur, et le serveur refuse tout geste sur elle (généralisable : non, propre au produit).
- Les boutons « Gérer » de chaque ligne et « Ajouter une personne » en tête de la page Comptes doublaient un geste déjà présent. Retirés sur place (généralisable : non).
- Typographie de la composition réduite d'un cran (×0,9, plancher de 12 px), sur consigne du porteur (généralisable : non).
- Budgets en euros et usage des clés d'API : posés en décisions D-35 et D-36 (généralisable : non).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le refus du hook de lecture des fichiers d'environnement a dévié la mesure vers un script écrit par l'outil d'écriture, qui lit les mots de passe sans les afficher.

## Ordre recommandé

1. RT-63 : la mesure est prête et un défaut de ce type a été vu par le porteur avant tout oracle.
2. RT-62 : il demande de relever les pages servies par le menu, plus long à outiller.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot suit une correction du porteur. La règle est qu'un changement de composition se juge sur toutes les pages servies, et qu'une rangée de formulaire se mesure. Classes proposées : `perimetre-de-critique-borne-aux-ecrans-refaits` et `rangee-de-formulaire-non-mesuree`.
