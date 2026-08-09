# Fiche d audit — forge-agents

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture des ~32 Ko de
baseline commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque
audit (l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-08-08
(revue écosystème 20260808a, source de l extraction initiale).

### forge-agents — santé 8/8 ×2 ; quality-oracles : 3 échecs repo / 6 installation
Delta : 7 commits (04-05/08). Forces : verrou ledger re-prouvé · atelier oracles/experts vivant
(usage réel du jour, non committé) · propagation partielle vérifiée octet à octet. Faiblesses :
**skill méta dormant depuis le 24/07** (les campagnes utilisent l'Agent tool du harnais) ·
**dérive repo↔installation prouvée** (registre 2.6.1 vs 2.9.1 — le repo n'est plus la source de
ce qui s'exécute) · régression CRLF nouvelle (2 échecs réels) · installation à 6 échecs (dont
un skill déclaré ok mais absent) · travail du jour non committé.
