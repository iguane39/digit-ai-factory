# Retours forges — Produit-62 — 20260917b

- **Contexte** : retour humain du 2026-09-17, mot pour mot : « Le PowerBI semble fonctionner mais le design a été modifié. Corrige le rapport pour revenir sur le design original. » Le projet Power BI généré par le mandat depuis le 2026-09-15 reprenait les champs et les en-têtes du rapport du client et **réinventait sa mise en page** (filtres en ligne, tableau pleine page, page de 1600 × 900, aucun fond, aucun titre, aucun bouton de réinitialisation) alors que le fichier PBIX du client, fourni en entrée, porte la mise en page complète.
- **Références ledger** : `forge\ledger.jsonl`, entrées `type: decision` (14:15) et `type: execution` (14:40) du 2026-09-17
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` — l'original reste ici.
- **Statut** : remis le 2026-09-17

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-forge-data (verbe `restituer`, reconstruction de rapports)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-22 | majeur | générique | **Un générateur de rapport Power BI a réinventé la mise en page d'un rapport que le client possédait déjà, et 23 contrôles PASS ne l'ont pas vu.** Fait observé : le mandat « reconstruire le rapport Tenancy Schedule Asset sur la Gold » a produit, du 2026-09-15 au 2026-09-17, des projets (`Client-A - Projet Power BI - 20260916f` à `20260917i`) dont le rapport était **dessiné par le générateur** : segments alignés en haut (210 × 76, pas de 218), tableau pleine page, page « Etat locatif » en **1600 × 900** contre **1280 × 720** à l'origine, sans fond, sans titre, sans bouton « Reset filters », sans signet, sans largeurs de colonnes, sans tri. Le fichier `input\Tenancy Schedule Asset.pbix` porte pourtant `Report/Layout` en entier : 2 pages, **19** visuels avec position, taille, polices, couleurs, **60** largeurs de colonnes, un signet « Clear selection », 3 ressources d'image et un thème. La recette du générateur rendait PASS sur **P6 « en-têtes repris au caractère près, 70 / 70 »** et l'audit sur **A1** (même contrôle) : *l'invariant mesuré était le texte des en-têtes, l'invariant protégé était « le lecteur retrouve son rapport »*. Le destinataire a vu le rapport 2 jours avant de le dire. Correction chez le produit : classe `Transposeur` — le Layout d'origine est lu, ses ressources copiées sous noms courts, et **seules les liaisons changent** (chaque champ d'origine → champ du nouveau modèle, par rang de projection pour le grand tableau ; filtres, tri, sélections par défaut et signet transposés ; littéraux typés selon la colonne cible) ; contrôles **P24** (géométrie au pixel contre le Layout : pages, visibilité, ordre, 19 visuels en type, x, y, largeur, hauteur — 21 objets, 0 écart) et **P25** (ressources présentes et référencées). Rendu prouvé : export PDF **22,5 s**, **449 705** octets, **0** libellé d'erreur du service, image lue. Premier rendu après transposition : **2** segments en erreur « Something's wrong with one or more filters » — un littéral texte `'2026'` substitué à `null` sur une colonne entière ; second rendu propre. | **(1)** Règle de reconstruction dans forge-data (`restituer`, volet rapports) : *quand le rapport à reconstruire existe (PBIX, PBIP), sa mise en page est CONSERVÉE et transposée ; une mise en page générée n'est qu'un repli, déclaré comme tel au bloc 6*. **(2)** Oracle de fidélité de mise en page : comparer le `report.json` produit au `Report/Layout` d'origine — pages (nom, taille, ordre, visibilité), visuels (nom, type, x, y, largeur, hauteur), objets de formatage par visuel, ressources référencées ; le contrôle P24 du produit en est le prototype. **(3)** Dans la transposition d'un Layout, les littéraux d'une sélection par défaut se typent selon la colonne cible (`2026L` pour un entier, `'…'` pour un texte) et un littéral `null` ne se remplace jamais — un texte sur une colonne entière rend le segment en erreur sans échouer la publication. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Ordre du `Select` d'une requête PBIR ≠ ordre des projections : la carte des 60 colonnes du grand tableau s'était décalée (en-têtes et largeurs sur les mauvaises colonnes) au premier essai | carte construite par rang de **projection** (`preparer_table`), vérifiée colonne par colonne avant publication | oui — c'est la matière de RF-22 (2) : l'oracle compare les projections, pas le Select | résolue avant publication |
| Chemins des ressources au-delà du plafond R-4 (150 caractères) avec leurs noms d'origine | ressources renommées `theme.json`, `fond.svg`, `reset1.png`, `reset2.png` ; références réécrites dans tout le Layout avant lecture | partiellement — tout produit PBIP qui embarque des ressources rencontre le plafond | résolue |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le livrable touché est un projet au format Microsoft (PBIP) généré par le mandat.

## Confirmations positives

- L'oracle de rendu joué à la main (export PDF → fichier → image lue, RF-21 du même jour) a vu le défaut des 2 segments en erreur AVANT que l'humain ne le voie : la boucle « publier → exporter → lire » a tenu son rôle.
- Les décisions avec « Comment faire » (RF-20) et l'inventaire des bloquants (S45) ont permis de tenir 3 décisions d'exploitation ouvertes sans réouverture du sujet.

## Ordre recommandé

1. RF-22 — le défaut a coûté 2 jours de lecture d'un rapport « au design modifié » et une demande humaine explicite ; la règle (1) est une phrase, l'oracle (2) existe déjà chez le produit sous le nom P24.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-22** → `controle-vrai-sur-le-mauvais-invariant` (famille `regle-morte`, correspondance APPROCHÉE : le contrôle mesurait une grandeur corrélée — les en-têtes du tableau — quand l'invariant protégé était la mise en page que le lecteur connaît). Classe candidate, même famille, libellé proposé : `reconstruction-qui-reinvente-l-existant` — « un livrable de reconstruction regénère ce que l'entrée du mandat contient déjà (mise en page, nomenclature, ordre) au lieu de le conserver et de ne changer que ce que le mandat vise : la lettre (les champs) est tenue, l'intention (retrouver son rapport) est perdue ».
