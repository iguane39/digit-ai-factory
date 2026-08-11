# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=ec06ffeb898b archive=3f6e5cd58943 · dernier événement: 2026-08-11T15:01:06Z -->

**3 actifs** (candidat 2 · décidé 0 · en cours 1 · corrigé 0 · écarté 0) · **94 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0095 | candidat | 3 | Côté produits : robots.txt ouvert aux agents IA par défaut + llms.txt généré au socle web | **oui** — sans socle, chaque produit repasse par l'audit seo pour découvrir le même écart — le nœud 58 le détecterait produit par produit au lieu d'être réglé une fois à la naissance |

## seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0073 | en_cours | 1 | Rapatrier la production du CSV d'actions scoré (livrables-gen.py de la mission) — complément de TF-0056 | **oui** — le BOM du CSV réel trahit déjà un producteur hors forge |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0096 | candidat | 3 | forge-tests : flux d'avancement natif dans l'exécution (mutation, pans) — l'offenseur d'origine | **oui** — le run Produit-01 du 11/08 : ~45 min de mutation sans un signal — l'opérateur a dû reconstruire l'avancement à la main depuis les logs |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
