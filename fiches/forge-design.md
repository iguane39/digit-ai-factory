# Fiche d audit — forge-design

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture de la baseline
commune par agent d audit. MISE À JOUR à chaque audit — dernière mise à jour : 2026-08-14
(point 7 du mandat : les deux dettes D-D2/D-D3 du contrat §5 instruites, fiche périmée depuis
le 08/08 remise au niveau).

### forge-design — 13 oracles / 56 règles verrouillées, arbre propre (14/08)

Delta depuis le 08/08 : les trois faiblesses de la revue précédente sont **levées** —
`oracle-motion` est committé (le chantier « testé, jamais committé, 22 fichiers » n'existe
plus : un clone et le poste ont désormais la même santé), les **5 skills sont installés au
poste** (`systeme-de-marque`, `studio-de-direction`, `ameliore-le-design`,
`critique-le-design`, `derive-les-vues`), et le working tree est vide. Forces :
`run-oracles-design.mjs` 13 oracles / 56 règles, self-test vert · `oracle-dtcg` (tokens source
→ dérivé) · `oracle-baseline` (régression visuelle, approbation post-FAIL refusée) ·
`oracle-taste` neuf (TA1-TA4, règles importées d'une source externe avec attribution).
Faiblesses / dettes : **producteur d'images non local** — la capacité existe et a été exercée
via le pilot (cat-des-06, trois visuels PASS le 12/08), la rendre locale reste bloquée sur un
feu vert de coût API (D-D3, décision humaine) · le mode **aval** de `critique-le-design`
(étape 5 bis, produit vs promesse) reste **documenté et jamais exercé sur produit réel** —
premier run à consigner ici · `dist\` à revérifier (périmé de 4 évolutions au 08/08, non
recontrôlé depuis).
