# Retours forges — Produit-62 — 20260907b

- **Contexte** : clôture du run de mandat `20260907-lineage-tenancy-schedule-asset` (forge-data, lecture seule sur un workspace Databricks réel et un rapport Power BI réel) — retours d'usage des verbes de forge-data, versés sur mandat humain du 2026-09-07 (« remonte à la factory »).
- **Références ledger** : `forge\ledger.jsonl` seq 6 et 7 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-07

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## forge-data (`digit-ai-forge-data`)

Premier mandat réel de la forge sur un lakehouse Databricks (Unity Catalog, quatre catalogues) et sur un PBIX de 524 Mo. Les trois oracles employés (tracer, modéliser, restituer) ont tenu ; deux entrées ont manqué en amont et ont été refaites à la main.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-1 | majeur | générique | `scripts\traduire-unity-catalog.mjs` ne lit que l'export des system tables `system.access.column_lineage`. Sur ce workspace, `SELECT … FROM system.access.table_lineage` répond `[INSUFFICIENT_PERMISSIONS] User does not have USE SCHEMA on Schema 'system.access'. SQLSTATE: 42501`, alors que `GET /api/2.0/lineage-tracking/table-lineage?table_name=…&include_entity_lineage=true` répond et donne, par table, les `upstreams` / `downstreams` (tableInfo) et les `notebook_id`. Le lineage table de 30 objets a été relevé par cette API et transcrit à la main dans le `lineage@1` (`output\20260907-lineage-tenancy-schedule-asset.json`, PASS T1-T7). | Accepter comme seconde entrée du traducteur l'export JSON de l'API `lineage-tracking` (grain table, `confiance.niveau` 2, `type` runtime), en plus de l'export des system tables (grain colonne, niveau 3). Le profil `databricks.md` §4 ne mentionne que les system tables « Premium/Enterprise » ; l'API REST est disponible sur ce workspace sans ce droit. |
| RD-2 | majeur | générique | Le rapport Power BI existant était la Pierre de Rosette du mandat (25 requêtes T-SQL embarquées vers le DWH legacy, 160 mesures, 17 relations), et aucun verbe de la forge ne lit un modèle Power BI. L'extraction a été faite avec `pbixray` (pip, 7 s sur le fichier) et un parseur maison du `Report/Layout` (JSON UTF-16) pour lister les champs des visuels ; le mapping de 47 lignes en est dérivé à la main (`output\20260907-mapping-tenancy-schedule-asset.csv`). | Un verbe `importer` au dialecte Power BI : depuis un `.pbix` (via pbixray) ou un projet PBIP/TMDL, dériver un brouillon de `lineage@1` (tables, colonnes, requêtes M comme entrées datées, mesures comme transformations déclaratives, relations) et la liste des champs réellement employés par les visuels — symétrique du `verifier-modele-semantique.mjs` de forge-audit qui juge un TMDL sans le traduire. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le Bash de la session cassait les heredocs contenant des caractères accentués ; les fichiers en français ont été écrits par l'outil d'écriture de l'assistant | contournement de session, noté en mémoire de poste | non | propre au poste Windows et à l'outil, rien de généralisable à une forge |
| Python sous Git Bash ne lit pas les chemins `/c/…` ; chemins `C:/…` employés | contournement de session | non | idem |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

- `oracle-tracer` T7 a forcé la déclaration de l'instance sur chaque dataset, y compris la source OneStream inconnue, déclarée `inconnu://onestream` plutôt qu'omise.
- `oracle-restituer` R5 a fait ancrer 33 nombres de prose en trois passes ; la déclaration morte de quatre chiffres (R3) a été repérée.
- `oracle-modeliser` M5 (dimension temps au grain jour, contiguë) a fait poser `dim_date` au jour alors que les faits sont mensuels — décision de conception utile pour la time intelligence Power BI.
- Le profil `databricks.md` (clés informationnelles, types imbriqués) a été confirmé : aucune contrainte d'unicité réelle sur les tables Silver lues.

## Ordre recommandé

1. RD-1 — un changement d'entrée sur un script existant, et il rend le lineage réel accessible sans droit `system.access`.
2. RD-2 — un verbe neuf, plus long, mais c'est l'entrant de tout mandat de reconstruction de rapport existant.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun des deux retours ne suit un retour humain : ce sont des manques d'outillage constatés par l'agent. Classe la plus proche du référentiel pour les deux : `oracle-remplace-par-controle-maison` (famille `skill-ou-oracle-non-invoque`) — le producteur a écrit ses propres extractions (API lineage, pbixray) faute d'outil du socle ; la nuance est qu'ici l'outil n'existait pas plutôt qu'il n'a pas été trouvé. Si le pilot juge la nuance utile, une classe « entrée réelle non couverte par le verbe » est à créer par lui.
