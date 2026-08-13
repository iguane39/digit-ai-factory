# Étude d'opportunité — spécialisations forge-data par moteur (Databricks, Oracle, Postgres, Azure SQL)

**Mandat humain du 12/08/2026** — analyse seulement, aucune construction, aucune écriture dans
forge-data. Décision humaine via candidatures TODO-FORGE. Méthode : grille R-28
(REGLES-PROJET §H) appliquée moteur par moteur, non-recouvrement écrit contre les capacités
existantes de forge-data, recherche d'état de l'art datée (≥ 2 sources par moteur).

## 0. Ce qui existe déjà (lu sur pièces) et ce que « spécialisation » peut vouloir dire

forge-data porte **4 verbes** (profiler, tracer, restituer, contractualiser) et **3 formats
déclaratifs AGNOSTIQUES du moteur**, vérifiés dans les fixtures :
- `forge-data/assertions@1` : qualité par colonne (unique, bornes, ensemble, motif, fraîcheur,
  non_nul) — l'`objet` est une référence logique `dataset.colonne`, jamais une connexion ;
- `forge-data/contrat@1` : schéma (objet → propriétés typées) + SLA + propriétaire + version ;
- `forge-data/lineage@1` : entrées datées → transformations → sorties, **grain colonne** inclus.

**Aucun de ces formats ne se connecte à un moteur** : ils jugent des artefacts qu'un humain (ou
un futur outil) rédige. « Spécialisation moteur » se range donc dans le jeu fermé R-28 :

- **A. profil-moteur** = référentiel versionné (dialecte de contraintes, mapping de types, noms
  de vues catalogue, commande d'export) — du **savoir daté-sourcé** (loi n° 4), consommé par
  les verbes existants. C'est le régime des profils produit (website/webapp/…).
- **B. verbe outillé nouveau** = un parseur/juge d'un **artefact EXPORTÉ** du moteur (DDL, DACPAC,
  JSON de catalogue) que les 3 formats ne produisent pas encore — prouvé par non-recouvrement,
  **exécutable sans API tierce payante** (sur fichier, jamais sur connexion vive).
- **C. connecteur live** = **écarté par défaut** : driver propriétaire + instance = garde-fou
  paiement + injouable en CI. Même les offres « gratuites » (Oracle Free local, Azure SQL free
  tier, Databricks Community) supposent une instance que la forge devrait opérer — hors de son
  rôle (elle juge des artefacts, elle n'exploite pas de base).

## 1. Non-recouvrement — le trou réel n'est PAS par moteur

Confronté aux 4 verbes / 3 formats, le « manque » commun aux quatre moteurs est **le même** :
rien dans forge-data n'**ingère un export de schéma d'un moteur pour en dériver un brouillon**
d'`assertions@1` ou de `contrat@1`. Aujourd'hui on écrit ces artefacts à la main ; `oracle-
profiler`/`oracle-contractualiser` les *jugent* mais ne les *produisent* pas depuis une source.
Le trou est donc **un verbe d'import unique**, pas quatre spécialisations — ce qui diffère d'un
moteur à l'autre (NUMBER/VARCHAR2 Oracle, JSONB/domaines Postgres, DECIMAL/NVARCHAR Azure,
clause CONSTRAINT Delta) est **le dialecte**, c'est-à-dire de la donnée de profil, pas du code.

## 2. Dossiers par moteur (état de l'art daté)

| Moteur | Nature | Artefact exportable **sans instance payante** ? | Lineage natif | Verdict R-28 |
|---|---|---|---|---|
| **Postgres** | RDBMS open-source (v18, 25/09/2025) | **Oui, local/hors-ligne** : `pg_dump --schema-only`, `information_schema`/`pg_catalog` | aucun (à reconstruire) | **A** profil dialecte + **porte la fixture** du verbe d'import (seul artefact 100 % libre) |
| **Oracle** | RDBMS commercial (« AI Database 26ai »/19c) | DDL via `DBMS_METADATA.GET_DDL` ; édition Free 23ai locale existe, mais la prod est Enterprise → **artefact fourni par le client** | aucun | **A** profil dialecte (vues `ALL_/DBA_CONSTRAINTS`, `SEARCH_CONDITION`) |
| **Azure SQL** | SQL Server managé PaaS (famille 2025) | `sys.check_constraints`/`INFORMATION_SCHEMA`, DACPAC ; free tier permanent mais compte Azure requis → **artefact fourni par le client** | aucun (Purview = couche payante séparée) | **A** profil dialecte (T-SQL, `sys.*`) |
| **Databricks** | **Lakehouse/Spark + Unity Catalog — PAS un RDBMS** | Unity Catalog : lineage colonne natif via `system.access.column_lineage`, mais **workspace Premium/Enterprise payant**, aucun mode libre | **oui, colonne-à-colonne** (schéma propriétaire) | **A** profil gouvernance + **B différé** : traducteur export Unity Catalog → `lineage@1` |

Sources principales (datées) : PostgreSQL 18.0 Release Notes (25/09/2025) ; Oracle
`DBMS_DEVELOPER.GET_METADATA` 23ai 23.7 (02/2025) + Autonomous Always Free (consulté 12/08/2026) ;
Azure SQL « Try for Free » (ms.date 2026-03-10) + `sys.check_constraints` (maj 2026-07-20) ;
Unity Catalog Data Lineage (learn.microsoft.com, maj 2026-08-06).

## 3. Verdict d'ensemble

**Ne PAS créer « 4 spécialisations ».** La réponse juste, sous R-28, est :

1. **Un seul verbe outillé nouveau, transverse** (candidat le plus solide) : `importer` — un
   parseur d'artefact de schéma **exporté** (DDL SQL en premier) qui produit un **brouillon**
   d'`assertions@1` (NOT NULL → non_nul, CHECK bornes/ensemble → bornes/ensemble, UNIQUE →
   unique, types → motif) et de `contrat@1` (schéma + types). Zéro dépendance (parse de texte),
   **jamais de connexion** — toujours en aval d'un fichier fourni. **Postgres d'abord** : seul
   moteur dont l'artefact (`pg_dump --schema-only`) est 100 % libre et local, donc seul à
   pouvoir porter une **fixture double sens** en self-test sans rien payer.
2. **Quatre profils-moteur** (référentiels versionnés, loi n° 4) portant le dialecte de
   contraintes, le mapping de types, les noms de vues catalogue et la commande d'export — qui
   **alimentent** le verbe `importer` et documentent comment profiler/tracer *ce* moteur avec
   les formats existants. **Créés au premier run réel touchant le moteur, pas par anticipation**
   (doctrine « au premier brief » des profils produit) — sauf Postgres, créé avec le verbe.
3. **Databricks à part** : ce n'est pas une base relationnelle. Son apport est le **lineage
   colonne natif d'Unity Catalog** → candidat B **différé** (traducteur export UC → `lineage@1`),
   déclenché quand un client fournit un export UC réel (artefact payant, jamais connecté).
4. **Aucun connecteur live** (C) : refus explicite — ce serait la première dépendance de
   l'écosystème à une instance externe payante, rupture du garde-fou fondateur.

## 4. Critère d'entrée d'un profil-moteur (proposition, symétrique aux profils produit)

Un profil-moteur naît **au premier run réel qui touche ce moteur** (un brief data cite Oracle,
Azure SQL…), jamais par anticipation ; il reste un **référentiel** (dialecte + types + export,
daté-sourcé, fraîcheur par claims) tant qu'aucun **artefact exporté propre au moteur** n'exige
un parseur que le verbe `importer` générique ne couvre pas. Un nouvel artefact non couvert
(ex. le JSON Unity Catalog) est alors un **verbe** au sens R-28, prouvé par non-recouvrement.

## Annexe — traçabilité

Recherche : 1 tranche Sonnet (68 k tokens, 17 outils, 2,8 min, 8+ sources datées). Formats
forge-data vérifiés sur les fixtures réelles (`assertions/contrat/lineage-*.json`). Aucune
construction : `git status` de forge-data inchangé, aucun fichier créé dans la forge.
Candidatures issues de l'étude : voir sidecar ingéré (verbe `importer` Postgres-first ;
famille de profils-moteur au premier run ; traducteur Unity Catalog différé).
