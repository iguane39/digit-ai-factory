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
cat-dat-08 porté du run réel Produit-10, R5 « chiffre nu » TF-0378/0379). D-D1 (grain
colonne→colonne) : entamée par le traducteur Unity Catalog (TF-0141). D-D2 (lineage déclaré
vs exécuté) inchangée. Aucun constat nouveau.

**Migration d'un rapport Power BI vers un nouveau modèle (TF-1179, TF-1180, TF-1186, TF-1190 — 17 et
19/09/2026).** La procédure vit chez la forge : `references\MIGRATION-RAPPORT-POWERBI.md`, 11 étapes,
chacune gardée par un contrôle qui existe (`oracle-enchainer`, déclaration `.chaine.json`). Cinq
oracles la jugent : `oracle-delimiter` (le périmètre se prend à ce que les visuels lisent),
`oracle-reconstruire` (la mise en page fournie se conserve), `oracle-rendre` (liaisons, export
chiffré, geste de rendu réel déclaré), `oracle-qualifier` (le rapport migré peut-il remplacer
l'original ; classe « définition changée »), et la règle M7 d'`oracle-modeliser` (un modèle déclare
les décisions qui l'ont façonné). Preuve rejouée le 19/09/2026 : self-test → **356 PASS, 0 FAIL**.
