# Fiche d audit — forge-pilot (ex-steering)

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture des ~32 Ko de
baseline commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque
audit (l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-08-08
(revue écosystème 20260808a, source de l extraction initiale).

### steering (auto-audit) — santé 3/3 + bootstrap 7/7 + ledgers PASS (y compris ASD, 76 entrées)
Delta : 22 commits en 4 jours. Forces : 2 produits réels bout en bout · boucle ~2 h sur le lot
03 · 18 règles + oracle · transparence sur ses propres dettes. Faiblesses : CLAUDE.md ×3,4 en
4 jours sans plafond · **`versions_forges`/`run_precedent` jamais appliqués au produit réel**
(0/76 entrées malgré ≥ 2 versions livrées) · archive pilote hors git (preuve non versionnée) ·
reprise idempotente jamais exercée · recouvrement de gouvernance non tranché (Q-B).
