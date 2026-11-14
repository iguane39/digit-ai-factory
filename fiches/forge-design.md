# Fiche d audit — forge-design

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture de la baseline
commune par agent d audit. MISE À JOUR à chaque audit — dernière mise à jour : 2026-08-19
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

### Annotation — revue écosystème 20260819 (preuves rejouées le 19/08)

Preuve rejouée : self-test → **VERT, 21 oracles / 73 règles** (fiche : 13/56 — la forge a
grandi). Périmée : « working tree vide » — 3 dossiers `baseline/` NON SUIVIS
(digit-desk-accueil, digit-desk-accueil-produit, landing) alors que la baseline est un
artefact VERSIONNÉ par contrat (TF-0102, `maquette-bailleur` l'est) : ces verrous de
régression visuelle ne survivent pas à un clone. → candidature `revue-20260819-design`.
D-D3 (producteur d'images local) et le mode aval de critique-le-design restent en l'état.

### Annotation — 13/11/2026 (TF-2473, suite de TF-2461) : le rendu lit FORGE_DESIGN_PYTHON, plus l'environnement uv

Ce qui change pour un produit : `--rendu` (la critique de `run-oracles-design.mjs`) ne lance plus `uv` et ne lit plus le
dossier courant (forge-design b6ebb1a, `oracles/lib/rendu.mjs`). Il prend l'interpréteur Python dans cet ordre :
`$FORGE_DESIGN_PYTHON`, puis `python` ou `python3` du PATH qui importe playwright, puis le `.venv` sous la racine de la forge.
Un produit dont playwright vit seulement dans son environnement uv rend donc SKIP au rendu tant qu'il ne pose pas
`FORGE_DESIGN_PYTHON`, et le verdict ne dépend plus du dossier d'où il lance.

Le geste, à faire par le produit lui-même (le pilot n'écrit pas chez un produit, R-58) : lire l'interpréteur de son
environnement avec `uv run python -c "import sys; print(sys.executable)"` (mesuré le 13/11/2026 : rend un chemin absolu),
puis le poser avant la critique, en PowerShell `$env:FORGE_DESIGN_PYTHON = "<ce chemin>"`, en Bash `export FORGE_DESIGN_PYTHON="<ce chemin>"`.
Une consigne, au pilot comme chez un produit, ne dit plus « playwright dans l'environnement uv » pour le rendu : elle dit
`FORGE_DESIGN_PYTHON`. `oracles\oracle-chemin-prescrit.mjs` (règle CP5) refuse chez le pilot une ligne qui cite le repli retiré.
Relevé du 13/11/2026 par `git grep` sur le pilot : aucune consigne du pilot ne le citait ; les produits ne sont pas relevés d'ici.
