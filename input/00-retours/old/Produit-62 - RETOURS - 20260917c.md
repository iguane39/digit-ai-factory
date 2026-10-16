# Retours forges — Produit-62 — 20260917c

- **Contexte** : friction d'oracle observée en séance le 2026-09-17 à la clôture du tour « design d'origine » (lot 20260917b), sans retour humain : `oracle-conformite-projet` rend **FAIL R-4** sur 3 fichiers internes d'un projet Power BI au format PBIP, alors que le livrable est le **dossier daté** qui les contient.
- **Références ledger** : `forge\ledger.jsonl`, entrée `type: retour` du 2026-09-17 15:00
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` — l'original reste ici.
- **Statut** : remis le 2026-09-17

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-factory (pilot, `oracles\oracle-conformite-projet.mjs`, règle R-4)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-23 | mineur | générique | **R-4 juge au nommage daté les fichiers INTERNES d'un livrable-dossier, selon leur extension.** Fait observé : `node oracles\oracle-conformite-projet.mjs .` sur Produit-62, journal `forge\oracles\2026-09-17o-oracle-conformite-projet.json` : **3** constats `R-4 FAIL « livrable sans nommage <Marque> - <Objet> - AAAAMMJJ<indice> »` sur `output/Client-A - Projet Power BI - 20260917m/Tenancy Schedule Asset.Report/StaticResources/RegisteredResources/fond.svg`, `reset1.png`, `reset2.png`. Ces fichiers sont les ressources d'image du rapport (fond de page, icônes du bouton de réinitialisation), imposées par le format PBIP de Microsoft à cet emplacement et référencées par leur nom dans `report.json` ; le livrable remis est le dossier `Client-A - Projet Power BI - 20260917m`, daté et indicé selon R-4. Les **40** autres fichiers du même dossier (`.tmdl`, `.json`, `.pbir`, `.pbism`, `.pbip`) ne sont pas jugés parce que leur extension est hors de `EXT_LIVRABLE` (l. 289) : *le même dossier est donc conforme ou fautif selon l'extension de ses parties, pas selon ce qui est remis.* Les renommer au motif daté est impossible : le plafond de longueur de chemin de la même règle R-4 (150 caractères sidecar compris, alinéa TF-1015) serait dépassé (« Client-A - Fond - 20260917m.svg » porte le chemin à **163**). Le verdict global du projet est FAIL sur ce seul motif, alors que R-4 est tenue par le dossier. | **(1)** Dans `oracle-conformite-projet.mjs`, un fichier situé SOUS un dossier dont le nom satisfait déjà `MOTIF_DATE` est une **partie** du livrable, pas un livrable : R-4 ne juge que le dossier (nommage, indice unique, longueur de chemin de chaque partie), comme elle le fait déjà pour `.oracles\` (pièces de preuve) et `docs\projet\` (socle). **(2)** À défaut, exempter les emplacements imposés par un format tiers (`StaticResources\`) au même titre que `.oracles\`. **(3)** Classe candidate : voir ci-dessous. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le produit déclare le FAIL R-4 au bloc 4 de sa restitution comme faux positif d'oracle, sans le masquer ni renommer les fichiers | restitution 20260917o, bloc 4 et bloc 5 ; journal d'oracle versionné tel quel | oui — un FAIL contesté se déclare, il ne se contourne pas (R-40, « un ✓ sans oracle exécuté n'est pas un ✓ » vaut aussi pour un rouge) | déclaré |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- Le journal d'oracle nomme le fichier, la règle et le message : la friction s'est diagnostiquée en une lecture de 20 lignes de l'oracle (l. 283 à 306).

## Ordre recommandé

1. RF-23 — une condition d'une ligne dans l'oracle ; sans elle, tout produit qui livre un projet PBIP avec des images (fond, logo) sort FAIL sur la conformité.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-23** → `controle-vrai-sur-le-mauvais-invariant` (famille `regle-morte`, correspondance APPROCHÉE : la règle protège « tout livrable remis porte un nom daté » et mesure « tout fichier d'extension X sous output\ porte un nom daté » — la partie est prise pour le livrable). Classe candidate, même famille, libellé proposé : `partie-de-livrable-jugee-comme-livrable` — « un contrôle de nommage, de versionnement ou d'emplacement s'applique aux fichiers internes d'un livrable composé (dossier PBIP, paquet, site statique) comme s'ils étaient remis un à un : le dossier tient la règle, ses parties la violent par construction du format tiers ».
