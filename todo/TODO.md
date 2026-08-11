# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=19181b91d860 archive=3eb4a8fa16f9 · dernier événement: 2026-08-11T15:04:54.363Z -->

**4 actifs** (candidat 3 · décidé 0 · en cours 1 · corrigé 0 · écarté 0) · **96 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0073 | en_cours | 1 | Rapatrier la production du CSV d'actions scoré (livrables-gen.py de la mission) — complément de TF-0056 | **oui** — le BOM du CSV réel trahit déjà un producteur hors forge |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0097 | candidat | 4 | forge-tests suppose une arborescence au lieu de lire la configuration que le projet déclare — deux pans rendus non mesurables à tort | **oui** — payé en réel le 11/08 : deux pans sur douze déclarés non mesurables à tort, avec un motif affirmant l'inexistence d'artefacts que l'audit venait de faire tourner |
| TF-0098 | candidat | 3 | forge-tests lance `npx playwright test` sans vérifier qu'une config Playwright existe — « suite e2e en échec » au lieu de « aucune suite e2e » | **oui** — payé en réel le 11/08 : l'action rendue au rapport envoyait réparer une suite qui n'existe pas, en affirmant qu'elle est rouge |
| TF-0099 | candidat | 3 | Le scan de secrets n'est pas borné aux sources du produit — 11 « fuites » toutes situées dans des dépendances | **oui** — payé en réel le 11/08 : 3 findings bloquants du pan securite sur 3 n'accusent aucune ligne du produit audité |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
