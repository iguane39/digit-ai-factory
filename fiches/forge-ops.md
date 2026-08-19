# Fiche d audit — forge-ops

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture de la baseline
commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque audit
(l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-08-19
(création, TF-0040).

### forge-ops — santé self-test 14/14, née exercée (11/08)

Delta : dépôt neuf (v0, commit initial). Forces : **preuve par le geste dès la naissance**
(self-test = déploiement réel local v1→v2 + rollback prouvé + 4 défauts types refusés) ·
règle dure tenue par construction (healthcheck AVANT bascule, jamais de bascule sur release
malade) · journal au contrat ledger (seq croissant, append-only) · frontières écrites
(outille la MEP, ne décide pas ; M-1…M-5 jamais dupliqué ; GO humain incompressible ;
invocation pilot uniquement). Faiblesses / dettes : **D-P1** — v0 ne connaît que la cible
locale/staging fichiers (`releases/` + `COURANT` + `journal.jsonl`) ; les cibles cloud
(Railway, VPS, conteneur distant) restent à outiller — le trou TF-0040 « déploiement Railway
artisanal » n est comblé que pour le geste, pas pour la cible d origine. **D-P2** — aucun
garde-fou machine n empêche un produit d invoquer `ops.mjs` en direct (frontière doctrinale,
non outillée). Pas encore de run MEP réel passé par la forge — premier run à consigner ici.

**Delta 11/08 (TF-0081)** : D-P1 amendée — mode **plan** livré (railway, gcp Cloud Run,
azure Container Apps, aws App Runner) : plans déterministes 4 phases (rollback exigé),
oracle **O-5**, self-test 24 PASS hors-ligne zéro credential ; chaque cible adossée à sa
**fiche expert admise** (experts-forge : ops-railway/gcp/azure/aws, verdicts MATERIEL 5/5,
oracle-judge `claude -p`). Dette résiduelle : **exécution réelle à consigner par cible**
(premier run MEP authentifié, GO humain) — le plan prouvé devient geste prouvé à ce moment-là.

### Annotation — revue écosystème 20260819 (preuves rejouées le 19/08)

Preuve rejouée : self-test → **68 PASS, 0 FAIL** (fiche : 14/14 puis 24 — la forge a
grandi : canary O-7 scellé TF-0298, empreinte anti-dérive TF-0288). D-P1 partiellement
soldée : DEUX déploiements Railway réels versés au corpus expert (TF-0258, TF-0269) —
« exécution réelle à consigner » est faite pour Railway, reste gcp/azure/aws. D-P2
(garde-fou machine anti-invocation directe) inchangée. Aucun constat nouveau.
