# Retours forges — Produit-78 — 20260928e

- **Contexte** : application des décisions D-2 (a), D-3 (a) et D-4 (a) du 28/09/2026 : enregistrement local du run d'étude, puis ouverture du parcours d'animation (run Produit-78-20260928-reseau, étape N0). Un lot remis ne se modifie pas : les frictions de ce tour partent dans ce lot.
- **Références ledger** : `forge\ledger.jsonl` seq 149, 150, 151 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici.
- **Statut** : remis le 2026-09-28

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

## pilot (`digit-ai-factory`)

Le générateur des README et l'adoption écrivent chez le produit un texte du pilot ; un gabarit et ce générateur écrivent des tournures que l'oracle d'écriture refuse.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-11 | majeur | générique | `scripts\readme-dossiers.mjs`, relancé chez le produit avec `--base .`, applique la table des pseudonymes du pilot (décision D-37) : « Produit-02 » devient « Produit-02 » dans le bloc Rôle rédigé à la main de `input\README.md` (« Entrants du projet Produit-02 ») et dans les titres de la table (« d'Produit-02 »). Le dépôt du produit est privé et le nom du domaine y est attendu : Seb lit un pseudonyme à la place de son propre nom. Aucune option ne désactive la substitution (lecture du script, lignes 322 à 352). Preuve : ledger seq 149. | Ne pseudonymiser que dans un dépôt publiable, pilot ou forge ; ne jamais réécrire le bloc Rôle. |
| RP-12 | mineur | générique | Après `adopter-projet-existant.mjs` et `readme-dossiers.mjs --base .`, le bloc Rôle de `input\README.md` portait « Entrants du pilot, en familles numérotées (D-15) » et celui de `output\README.md` « Livrables du pilot […] Les deux familles `05-` sont une collision DÉCLARÉE ». Ce texte faux chez un produit est entré au commit d'adoption de 10:33 et a été réécrit à la main à 14:38. Preuve : ledger seq 150. | Poser chez un produit un rôle de produit, ou un rôle vide qui le demande. |
| RP-13 | mineur | générique | `gabarits\docs-projet\TODO-PRODUIT.md`, ligne 108 : l'en-tête « Ce qu'il faudra faire alors » fait échouer EC-8 d'`oracle-ecriture` sur tout registre qui le garde. `scripts\readme-dossiers.mjs`, ligne 248 : la phrase générée « Ce que le dossier contient à l'instant de la dernière régénération » fait échouer EC-1, annonce nominalisée, sur un README court : FAIL sur `output\README.md` avec 0 fichier listé (156 mots), PASS avec 3 fichiers listés. Preuve : ledger seq 151. | Renommer l'en-tête du gabarit (« Geste prévu à ce moment ») et la phrase générée (« Contenu du dossier à la dernière régénération »). |

## La règle qui aurait évité le retour

2 retours n'ont pas de classe au référentiel ; chacun porte la clé réservée `classe-a-creer` et une classe proposée. RP-13 porte la classe `deux-regles-du-socle-inconciliables`.

- RP-11 : clé proposée `pseudonymisation-chez-le-client-lui-meme`, famille `anonymisation`, libellé « Un outil du pilot applique la table des pseudonymes dans le dépôt privé d'un client : son propre nom y devient un pseudonyme, jusque dans le texte écrit à la main ».
- RP-12 : clé proposée `role-du-pilot-recopie-chez-le-produit`, famille `heritage-produit`, libellé « L'adoption pose chez le produit un texte qui décrit le pilot : le produit hérite d'un rôle faux sans que rien ne le signale ».

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le chapitre « Décision à J+90 » des objectifs s'ouvrait sur un tableau nu (M7) | phrase d'ouverture ajoutée | non | Défaut de rédaction de la session ; la règle existe et a mordu. |
| Le README de `donnees\reseau\` ne portait pas la mention de rédaction avec une IA | mention ajoutée | non | Défaut de rédaction de la session. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les dépôts d'ouverture suivent `references\RUN-RESEAU.md` du pilot et la disposition de l'instance `digit-ai-marketing`.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| aucun document de la bibliothèque | — | — | — | — | — |

## Documents mûrs

Aucun document mûr sur ce lot : aucun document du produit n'a été repris 5 fois, et aucun verdict de lecteur n'a été rendu.

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| aucun | — | — | — | — | reste au produit, parce qu'aucun document n'est mûr |
