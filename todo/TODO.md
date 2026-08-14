# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=7617c6c0e44c archive=610fb0723376 · dernier événement: 2026-08-14T09:41:59Z -->

**6 actifs** (candidat 6 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **191 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0189 | candidat | 9 | pilot — règle 33 « sécurité offensive sur mandat » + branchement ASVS/WSTG aux étapes du run | **oui** — l'écosystème porte un contrat de sécurité que rien ne branche : il est payé et non opposé |
| TF-0196 | candidat | 6 | Sidecar de retours : le schéma émis par les produits ne passe pas l'ingesteur R10 — normalisation à la main à chaque lot | **oui** — le lot a exigé une normalisation manuelle avant ingestion ; tout lot produit émis au même format la réclamera |

## forge-agents-security

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0188 | candidat | 2 | forge-agents-security — corpus d'injection versionné + mapping LLM Top 10 : l'exigence LLM01 est déclarée sans vérificateur | **oui** — une exigence de profil sans oracle est une exigence qui ne tient pas — elle passe le gate sans être opposée |

## forge-audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0190 | candidat | 2 | forge-audit — mapping ADR <-> ASVS : la gouvernance et l'exécution citent des référentiels disjoints | **oui** — sans mapping, la conformité se déclare deux fois et se prouve zéro |

## forge-websec

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0186 | candidat | 3 | forge-websec — référentiel WSTG curé : la méthode de test de sécurité, absente à 0 occurrence de l'écosystème | **oui** — le contrat ASVS de websec dit QUOI exiger et rien ne dit COMMENT le vérifier — le cas de test est réinventé à chaque campagne |
| TF-0187 | candidat | 3 | forge-websec — oracle-dast.mjs enveloppant ZAP : lève la dette D-W1, seule brique offensive automatisable | **oui** — aucune vérification active n'existe : la forge ne juge que la configuration et les dépendances, jamais le comportement de l'application servie |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
