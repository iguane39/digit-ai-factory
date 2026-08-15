# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=37a505e2eaf8 archive=deb138cfe9c0 · dernier événement: 2026-08-15T11:35:11Z -->

**5 actifs** (candidat 0 · décidé 0 · en cours 5 · corrigé 0 · écarté 0) · **242 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0242 | en_cours | 9 | design : réparer la copie installée de systeme-de-marque (generer-design-md.mjs sans lib/color.mjs) | **oui** — 1 contournement au run réel du 15/08 ; tout poste qui n'a pas le dépôt cloné est bloqué |

## ops

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0245 | en_cours | 9 | ops : path.resolve() des arguments build/cible du CLI ops.mjs | **oui** — 1 deploiement_refuse erroné au journal du run réel du 15/08 |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0243 | en_cours | 6 | tests : le fallback .env du dépôt forge fuit la BASE_URL d'un autre produit dans tout nouvel audit | **oui** — 1 cycle de boucle de fermeture consommé à diagnostiquer 11 constats étrangers au produit |
| TF-0246 | en_cours | 6 | tests : aligner les types des livrables --livrables sur le registre organization | **oui** — 3 renommages manuels + 1 passe de conformité supplémentaire au run du 15/08 |
| TF-0244 | en_cours | 4.5 | tests : lire les déclarations responses= depuis app.openapi() au lieu d'une regex de source | **oui** — 1 faux constat manuelle_dev + 1 contestation à instruire au run du 15/08 |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
