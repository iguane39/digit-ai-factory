# Fiche d audit — forge-ops

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture de la baseline
commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque audit
(l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-08-11
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
non outillée). Pas encore de run MEP réel passé par la forge (créée ce jour) — premier run
à consigner ici.
