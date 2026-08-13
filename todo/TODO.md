# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=2e8b01609e9e archive=dddba6755869 · dernier événement: 2026-08-13T07:03:34.891Z -->

**5 actifs** (candidat 5 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **142 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0145 | candidat | 2 | pilot : orchestrateur de boucle remédiation ↔ réexécution (tests audite/exécute · development remédie sous run · humain tranche), bornée ≤ 3, état terminal classé | **oui** — aujourd'hui l'utilisateur doit lui-même enchaîner audit → correction → réaudit et décider quand s'arrêter ; sans orchestrateur borné à état terminal classé, « en autonomie jusqu'au vert » est soit infini soit tricheur |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0142 | candidat | 4.5 | forge-tests + pilot : harnais de préparation d'environnement d'audit (installer deps, servir le front, renseigner le contrat projet) — le trou n° 1 de BAV2 | **oui** — sur BAV2, la moitié des pans rendent « non mesurable » pour la seule raison que l'environnement n'est pas prêt — l'utilisateur reçoit un audit à trous là où une préparation automatique aurait rendu les pans mesurables |
| TF-0146 | candidat | 3 | forge-tests : rapport exhaustif test-par-test (PASSANT / NON-PASSANT / NON-EXÉCUTÉ + pourquoi + détail), au-delà de l'agrégat par pan | **oui** — le grief explicite de l'utilisateur — « le rapport ne fournit pas la liste et le détail de tous les tests exécutés » — reste ouvert tant que le rapport agrège par pan sans descendre au test |
| TF-0143 | candidat | 2 | forge-tests : générateur de cas de tests EXÉCUTABLES par pan (nominal + limite + rejet), au-delà de la proposition actuelle | **oui** — un audit qui dit « qualif 2/4 » sans fournir les 2 cas manquants exécutables laisse l'utilisateur écrire lui-même ce que la forge a déjà identifié comme manquant |
| TF-0144 | candidat | 2 | forge-tests : générateur de volumétrie de données seedé, synthétique, dimensionné PAR CAS, persisté hors projet et rejouable | **oui** — sans données par cas rejouables, un cas identifié reste non exécutable faute d'entrées, et un run ne se reproduit pas à l'identique — la confiance exige le déterminisme |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
