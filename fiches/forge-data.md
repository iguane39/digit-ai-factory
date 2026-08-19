# Fiche d audit — forge-data

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture de la baseline
commune par agent d audit. MISE À JOUR à chaque audit — dernière mise à jour : 2026-08-19
(création, TF-0083 — révision tracée de l écartement du 08/08 sur preuve REX).

### forge-data — self-test 15/15, née exercée sur fixtures synthétiques (11/08)

Delta : dépôt neuf (v0). Forces : **trois oracles au niveau de trois barres externes
validées** (registre la-barre : Great Expectations → P1-P3, OpenLineage → T1-T5, dbt-core
→ R1-R4), chacune testée d existence puis validée humain avant injection · verdict de
non-recouvrement ÉCRIT avant construction (composition stricte : data-quality-auditor
appelé, oracle-claims/forge-tests/forge-audit hors périmètre) · REX réel anonymisé
(12 patterns à portée qualifiée, grep zéro-client collé) · standards gouvernés avec
écartés explicites (DMBOK, data mesh — raisons datées). Faiblesses / dettes : **D-D1**
grain dataset (le colonne→colonne, cœur du REX X5, reste hors v0) ; **D-D2** l oracle juge
le lineage DÉCLARÉ, pas sa véracité d exécution (capture runtime = niveau 3, hors v0) ;
la composition avec data-quality-auditor est doctrinale, pas outillée (pas d appel
machine) ; aucun run produit ne l a encore exercée — premier run à consigner ici.

### Annotation — revue écosystème 20260819 (preuves rejouées le 19/08)

Preuve rejouée : self-test → **54 PASS, 0 FAIL** (fiche : 15/15 — grandie : RD-1→RD-4,
cat-dat-08 porté du run réel SCC_ALX, R5 « chiffre nu » TF-0378/0379). D-D1 (grain
colonne→colonne) : entamée par le traducteur Unity Catalog (TF-0141). D-D2 (lineage déclaré
vs exécuté) inchangée. Aucun constat nouveau.
