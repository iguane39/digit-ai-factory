# Fiche d audit — forge-seo-geo (ex forge-seo, renommée le 19/08/2026 — le volet GEO, nœuds 53-58, entre au nom)

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture des ~32 Ko de
baseline commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque
audit (l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-08-19
(revue écosystème 20260808a, source de l extraction initiale).

### forge-seo — santé 9/9 + 5/5 mission réelle (08/08)
Delta : quasi nul (travail non committé sur gabarit_html.py, à trancher). Forces : mission
réelle à jour (6ᵉ itération HTML) · refus de rapport partiel codé · séparation forge/mission
tenue. Faiblesses : baseline D-S1→D-S4 confirmée — la dérive `schema_version` est OBSERVÉE sur
la mission réelle et invisible machine (le contrôle 4 vérifie autre chose).

### Annotation — revue écosystème 20260819 (preuves rejouées le 19/08)

Preuve rejouée : `validate.py` → **12/12 contrôles** (fiche : 9/9 — la recette a grandi,
« une seule commande joue toute la recette », 65dbcd2). Périmée : la dérive `schema_version`
D-S1→D-S4 « invisible machine » — couverte depuis par les contrôles 11-12 (versions à la
source unique, registre d'évolutions scellé sur la grille, TF-0240). Renommée
forge-seo-geo le 19/08 (TF-0390) : le volet GEO (nœuds 53-58) entre au nom. Aucun constat
nouveau.
