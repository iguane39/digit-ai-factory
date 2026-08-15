# Retours de run — digit-desk.fr, 15/08/2026

Run produit complet `20260815-digit-desk-fr` (conception → design → development → tests →
MEP staging). Forges mobilisées : conception `ffb9607`, design `0cb55ab`, development
`4f88db6`, tests `13000f0`, agents `b0931bb`, ops `13aa2fc`, websec `be2ce28`, pilot
`8d9970c`. Tous les constats ci-dessous ont été **payés pendant le run** (ledger seq 18-21,
24, 31-32, 36) — complétude ledger↔lot : 8/8.

## forge-design (`digit-ai-forge-design`)

Quatre frictions payées à l'étape design, toutes contournées sans affaiblir un gate.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RD-1 | majeur | `check_maquette.py` C2/C15 scannent aussi le contenu des `<script>` : le source minifié de Motion **vendoré par la forge elle-même** déclenche un faux positif bloquant C15 (séquences de balises ancre dans le JS). Payé : embarquement base64 du vendored + 2 rebuilds | décaper les blocs `<script>` avant les scans C2/C15 |
| RD-2 | majeur | `oracle-tokens` T5 croise chaque token `texte-*` avec **chaque** token de fond sans co-occurrence réelle : `--texte-sur-accent` (contraste 1.0 avec `--fond`, jamais posé dessus) sort en FAIL, alors que `references/tokens.md` recommande la convention `texte-/fond-` pour les états. Contradiction doc/oracle payée par renommage hors convention (`--sur-accent`, `--alerte`, `--valide`) — le contraste de ces paires retombe sur render_page V2 | apparier par co-occurrence dans une même règle CSS, ou paires déclarées |
| RD-3 | mineur | `oracle-images` I5/I6 supposent des images **générées** (prompt/modèle obligatoires) : pour 18 photos réelles reprises sur mandat du propriétaire, les champs ont été remplis de déclarations « aucun » | `genere:false` dispensant prompt/modèle au profit de `source` + date de relevé |
| RD-4 | mineur | `run-oracles-design.mjs` rapporte `render_page` FAIL avec `findings: []` — le détail (L2, accroche bridée à 0.47) n'était visible qu'en lançant `render_page.py` directement | propager `issues[]` de render_page dans `findings[]` de l'agrégateur |

## forge-tests (`digit-ai-forge-tests`)

Deux constats à l'étape tests ; la voie déclarative a bien fonctionné sur 112 constats.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-1 | majeur | Les ids des findings SAST embarquent le **répertoire temporaire aléatoire** de la passe (`forge-tests-securite-<aléa>/sources/...`) : la contestation `constats-contestes.jsonl` ne peut jamais matcher d'un run à l'autre — vérifié sur 3 runs (`lgvdcxei`, `qyoth9pg`, `ccnh5t5j`). Payé : 2 actions `manuelle_dev` incompressibles au rapport final | id stable ancré au chemin projet, comme le pan secrets (112/112 contestations prises) |
| RT-2 | mineur | Le pan sécurité scanne `tests/vendor/` : axe-core épinglé (jamais servi) génère 114 constats, là où les gates de forge-development excluent `vendor/` par contrat | même exclusion déclarée (`vendor/`, `tests/vendor/`) ou motif `bloque-vendored` dédié |

## forge-ops (`digit-ai-forge-ops`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RV-1 | majeur | `oracle-ops` O-2 casse avec une **cible relative** : `spawnSync(execPath, [path.join(cible, …)], {cwd: releaseDir})` fait résoudre le chemin du script contre le cwd de la release → chemin doublé → `Cannot find module` → rapporté « healthcheck en échec (exit 1) ». Payé : 4 diagnostics dont une copie instrumentée de l'oracle (`ops.mjs deployer`, lui, marche en relatif) | `path.resolve(cible)` en tête d'oracle |

## forge-agents (`digit-ai-forge-agents`) — atelier des skills qualité

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-1 | majeur | Le hook d'écriture `quality-oracles` (C7) juge les **fragments Jinja** comme pages autonomes : `base.html` (blocs `{% %}`, tokens liés par `<link>`) bloqué pour « aucun token déclaré » — l'écriture de templates SSR devient impossible par l'outil d'édition. Payé : contournement par écriture shell, verdict réel reporté sur les pages servies (oracles design + suite Playwright, tous PASS) | exclure les fichiers à marqueurs Jinja/Django, ou juger la page rendue |

## Confirmations positives

- La **voie déclarative** de forge-tests (constats-contestes.jsonl) a tenu : 112/112
  contestations à id stable prises, rejet atomique jamais déclenché à tort.
- `ops.mjs deployer/restaurer` : bascule atomique et rollback réel impeccables — M-4
  prouvé par le geste, journal intègre (O-3).
- La leçon R3 du lot AuxPortesDeLaBaie (détection indifférente à l'ordre des attributs)
  a été **appliquée dès la conception** (critère EX-027) — la boucle de retours fonctionne.
- `generer-design-md.mjs` : contraste mesuré au seuil dur (refus < 4.5:1) — le gate a
  produit une charte scellée consommée telle quelle par le gate design de development.
- L'oracle d'exposition websec (EX-1…EX-11) a validé la frontière staging du premier coup
  (CSP/headers posés dès la construction, EX-039).
