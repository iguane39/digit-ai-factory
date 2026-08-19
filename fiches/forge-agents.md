# Fiche d audit — forge-agents

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture des ~32 Ko de
baseline commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque
audit (l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-08-19
(revue écosystème 20260808a, source de l extraction initiale).

### forge-agents — santé 8/8 ×2 ; quality-oracles : 3 échecs repo / 6 installation
Delta : 7 commits (04-05/08). Forces : verrou ledger re-prouvé · atelier oracles/experts vivant
(usage réel du jour, non committé) · propagation partielle vérifiée octet à octet. Faiblesses :
**skill méta dormant depuis le 24/07** (les campagnes utilisent l'Agent tool du harnais) ·
**dérive repo↔installation prouvée** (registre 2.6.1 vs 2.9.1 — le repo n'est plus la source de
ce qui s'exécute) · régression CRLF nouvelle (2 échecs réels) · installation à 6 échecs (dont
un skill déclaré ok mais absent) · travail du jour non committé.

### Annotation — revue écosystème 20260819 (preuves rejouées le 19/08)

Preuve rejouée : self-test quality-oracles (repo) → **PASS 147 contrôles** (l'échec
« régression visuelle » du 16/08 n'apparaît plus). Périmée : « 3 échecs repo / 6 installation ».
TOUJOURS VIVANTE et aggravée : la dérive repo↔installation — v2.12.0 (repo) vs v2.10.0
(installé), mesurée le 19/08 ; oracle-skills K2 FAIL sur **10 skills / 17** (dont 2 créés le
jour même par la session de revue elle-même : la propagation n'est le gate de personne).
→ candidature `revue-20260819-agents` (reconstat de l'item archivé « 9 skills sur 20 »).
