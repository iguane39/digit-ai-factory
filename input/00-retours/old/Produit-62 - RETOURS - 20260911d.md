# Retours forges — Produit-62 — 20260911d

- **Contexte** : première exécution réelle d'un chargement Databricks depuis ce produit, le 2026-09-11, après l'ouverture de la connexion par l'humain. Le schéma Gold, ses quinze tables et son alimentation sont passés ; trois défauts ont été mesurés en chemin, dont un seul est généralisable au-delà de ce produit.
- **Références ledger** : `forge\ledger.jsonl` seq 119 (exécution et ses compteurs), seq 120 (les trois corrections), seq 121 (contrainte relâchée), seq 122 (ce retour)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-11

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-forge-data (outillage d'export Parquet vers un lakehouse Databricks)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-15 | majeur | générique | **Le seul moteur Parquet disponible sur un poste sous contrôle d'application écrit des horodatages que Databricks refuse de relire, et le défaut ne se voit qu'au premier chargement réel.** Fait mesuré le 2026-09-11 : `CREATE OR REPLACE TABLE … AS SELECT * FROM parquet.'…'` a rendu **`[PARQUET_TYPE_ILLEGAL] Illegal Parquet type: INT64 (TIMESTAMP(NANOS,false)). SQLSTATE: 42846`** sur la toute première instruction du chargement. Cause : `fastparquet` transcrit une colonne `datetime64[ns]` de pandas en `TIMESTAMP(NANOS)`, et le moteur de lecture de Databricks admet la milliseconde et la microseconde, jamais la nanoseconde. **Sept des vingt-sept tables** extraites étaient concernées, sur des colonnes de dates de bail, d'indexation et de déclaration. Le piège est double. D'abord il est **silencieux à l'écriture** : la recette d'extraction de ce produit relit chaque fichier avec le même moteur et rend PASS, parce que `fastparquet` se relit lui-même sans difficulté — six contrôles verts sur un fichier que le lakehouse refusera. Ensuite il est **inévitable sur ce poste** : `pyarrow`, qui écrirait en microsecondes par défaut, a sa bibliothèque `_compute` bloquée par la stratégie de contrôle d'application du poste, et sa seule présence casse `import pandas` — il a dû être désinstallé, `fastparquet` est le seul moteur restant. *Un format d'échange qui se relit par son propre écrivain n'est pas vérifié : il n'est vérifié que par son lecteur de destination.* | **(1)** Dans l'outillage d'export de la forge, ramener toute colonne `datetime64[ns]` à `datetime64[us]` avant écriture — la microseconde suffit à des dates de gestion et la conversion ne perd rien de réel ; c'est la parade posée ici, dans `forge\etapes\data\extraire-pbix-reference.py`. **(2)** Faire porter à la recette d'export un contrôle sur le TYPE PARQUET écrit, et non sur la relecture par le même moteur : `ParquetFile(f).dtypes` suffit à refuser une colonne restée en nanosecondes. **(3)** Écrire au mode d'emploi de la forge le tableau des unités admises par destination (Databricks : millisecondes et microsecondes ; nanosecondes refusées), pour que le choix ne se redécouvre pas produit par produit. **(4)** Fixture double sens : un fichier écrit depuis une colonne `datetime64[ns]` est refusé par le contrôle ; le même après conversion passe. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'exécuteur visait un entrepôt SQL codé en dur (`7e6dbd0cbcbd6fb7`) que ce compte ne voit pas : toute écriture rendait HTTP 403 pendant que la lecture passait par le bon entrepôt | l'entrepôt se lit désormais dans `.env`, variable `DATABRICKS_WAREHOUSE_ID`, la constante n'étant qu'un repli nommé ; `GET /api/2.0/sql/warehouses` n'en rend qu'un, `9659bbf7ca9d4f84` | oui pour le principe — deux outils d'un même produit ne visent pas deux machines différentes — mais c'était une divergence locale entre un script et le fichier d'environnement du produit | resté au produit |
| La même erreur HTTP a tué le script sur une trace de pile, sans dire quelle instruction ni quel entrepôt | la fonction d'exécution rend un échec mesuré portant le code de réponse, l'entrepôt visé et le corps de la réponse ; classe : une panne d'environnement rendue comme un défaut du produit | oui pour le principe, et il est **déjà écrit** dans la doctrine des oracles de la forge (« un oracle qui ne distingue pas les deux fait passer une panne d'environnement pour un défaut du produit ») ; ce script n'est pas un oracle et n'en héritait pas | resté au produit |
| Cent conditions sur 104 545 tiennent à un lot sans bail, et la contrainte non nulle de la colonne les refusait | contrainte relâchée sur la table déployée et dans la définition rééditée sous l'indice 20260911o, avec le commentaire qui porte la mesure ; la clé primaire de la table prévoyait déjà l'absence de bail | non : arbitrage de modélisation propre à ce jeu de données | resté au produit |
| Les entrées que l'exécuteur écrit lui-même au ledger ne portent pas de numéro de séquence, à la différence de toutes les autres | constaté, non corrigé dans ce tour : les sept entrées restent lisibles et datées | à voir — la convention de numérotation du ledger appartient au socle du pilot, mais aucun contrôle ne l'impose aujourd'hui et le coût mesuré est nul | resté au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : les trois livrables touchés sont une définition SQL, un mapping en valeurs séparées et une documentation de modèle de données, tous produits par des scripts de ce produit. Le gabarit `MODELE-DONNEES.md` du socle documentaire a été suivi sans friction — sa projection se régénère en une commande et rend « 7 table(s), 5 lien(s) ».

## Confirmations positives

- Le chargement est **idempotent par construction** : chaque insertion est précédée d'une purge sur la colonne de provenance. C'est ce qui a permis de rejouer les quarante et une instructions après la correction de la contrainte sans dupliquer une seule ligne — 755 088 lignes de faits mensuels par lot avant comme après.
- Le garde-fou de périmètre a joué exactement comme prévu : la vue à plat visant un schéma bac à sable a été **écartée et déclarée** à chaque passe, jamais jouée, sans qu'il faille y penser.
- Les trente-quatre contrôles de valeurs attendues, calculés hors ligne sur les fichiers d'origine, sont passés **sans un seul écart** dès la première exécution complète — la réconciliation n'a pas eu à être inventée après coup.
- Le mode simulation a fait son travail : il avait annoncé 18 écritures, 16 fichiers, 41 instructions et 34 contrôles, et c'est exactement ce qui s'est joué.

## Ordre recommandé

1. RF-15 — c'est le seul retour de ce lot, et il touche tout produit de la forge qui exporte du Parquet vers un lakehouse depuis un poste où `pyarrow` est indisponible.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Classe : **RF-15** → `controle-vrai-sur-le-mauvais-invariant` (correspondance EXACTE : la recette d'extraction vérifiait bel et bien que le fichier se relit, mais avec le moteur qui l'a écrit — l'invariant qui compte est la lecture par la DESTINATION, et il n'était mesuré nulle part).
