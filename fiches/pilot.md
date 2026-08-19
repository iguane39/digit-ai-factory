# Fiche d audit — digit-ai-factory (ex-forge-pilot, ex-steering)

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture des ~32 Ko de
baseline commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque
audit (l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-08-19
(revue écosystème 20260808a, source de l extraction initiale).

### steering (auto-audit) — santé 3/3 + bootstrap 7/7 + ledgers PASS (y compris ASD, 76 entrées)
Delta : 22 commits en 4 jours. Forces : 2 produits réels bout en bout · boucle ~2 h sur le lot
03 · 18 règles + oracle · transparence sur ses propres dettes. Faiblesses : CLAUDE.md ×3,4 en
4 jours sans plafond · **`versions_forges`/`run_precedent` jamais appliqués au produit réel**
(0/76 entrées malgré ≥ 2 versions livrées) · archive pilote hors git (preuve non versionnée) ·
reprise idempotente jamais exercée · recouvrement de gouvernance non tranché (Q-B).

### Annotation — revue écosystème 20260819 (preuves rejouées le 19/08)

Preuves rejouées : agrégat `self-tests.mjs` → **17/17 recettes vertes** · conformité
projet **28 PASS** · oracle-todo **PASS** (83 actifs au moment de la revue) · generer-vues `--check`
**PASS** · oracle-ecosysteme 11 PASS · les self-tests unitaires (adoption 12/12,
claude-md 6/6, étude 2/2, insatisfactions 7/7, conseil 4/4, skills 68/68, restitution 2/2).
LIMITE DÉCLARÉE : auto-audit — le juge vit chez le jugé, et la session de revue a modifié
ce dépôt le jour même. Constat nouveau (vécu en session) : COLLISION D'IDS TF entre deux
sessions parallèles (TF-0383/0384/0385 frappés deux fois depuis la même base fabf0cd le
19/08, renumérotation manuelle à la fusion) — l'écrivain unique n'est unique que par
session. → candidature `revue-20260819-pilot`. Second constat porté par oracle-skills :
K2 FAIL 10/17 (consigné côté forge-agents).
