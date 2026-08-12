# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=286768c0bb56 archive=7dc34b9e2932 · dernier événement: 2026-08-12T12:56:39.304Z -->

**2 actifs** (candidat 2 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **134 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0135 | candidat | 5 | L'analyse des gardes ne lit QUE main.py : tout code 400/409 déclaré par un projet à routeurs devient une divergence BLOQUANTE fausse | **oui** — payé en réel le 12/08 : déclarer les codes d'erreur au schéma OpenAPI — le correctif que l'audit lui-même réclamait — a fait apparaître 3 divergences bloquantes fausses sur un code inchangé |
| TF-0132 | candidat | 4 | Pan front : « --trace on » forcé en dur, et une trace indisponible se lit « votre suite e2e est rouge » | **oui** — payé en réel le 12/08 : le pan front a dû être EXCLU du run d'audit final pour ne pas produire un « suite e2e en échec » sur une suite verte de bout en bout |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
