# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=1afd58d9b1a9 archive=ce74d874c5a9 · dernier événement: 2026-08-12T16:17:45.436Z -->

**4 actifs** (candidat 4 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **138 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## data

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0140 | candidat | 4 | forge-data : famille de profils-moteur (dialecte contraintes, types, catalogue, export) — référentiels créés au premier run réel, pas 4 d'avance | **oui** — sans profil, chaque run touchant Oracle/Azure/Databricks redécouvre le dialecte et le mapping de types en session ; avec, le verbe importer et les verbes existants s'appliquent au moteur sans réapprentissage |
| TF-0139 | candidat | 3 | forge-data : verbe « importer » — un parseur de schéma EXPORTÉ (DDL d'abord) → brouillon assertions@1/contrat@1, Postgres-first, zéro connexion | **oui** — la rédaction manuelle des assertions/contrats pour chaque dataset est le coût que forge-data cherche à outiller ; un import depuis le schéma réel supprime la saisie et l'erreur de recopie — vérifiable sans instance payante grâce à Postgres |
| TF-0141 | candidat | 1 | forge-data : traducteur lineage Unity Catalog (Databricks) → lineage@1 — candidat différé, artefact fourni par le client | **oui** — le lineage colonne d'Unity Catalog est la donnée de lineage la plus riche du marché ; ne pas savoir l'ingérer laisse un client Databricks reconstruire à la main un lineage que sa plateforme produit déjà — mais tant qu'aucun export réel n'est fourni, rien à exercer |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0138 | candidat | 3 | Banc-vert : 26 findings bloquants révélés une fois servi sur son propre port (masqués tant qu'il testait Produit-01) — à ventiler et diagnostiquer | **oui** — le banc vert est le TÉMOIN qui prouve que la forge ne crie pas au loup sur un projet sain ; tant qu'il porte 26 bloquants, la recette ne peut pas prononcer S-01 et la garantie « zéro faux positif sur du sain » n'est pas tenue |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
