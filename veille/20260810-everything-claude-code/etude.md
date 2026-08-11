# Étude — Everything Claude Code (2026-08-10)

Notes d'archive. Étude détaillée complète : [`ETUDE-EVERYTHING-CLAUDE-CODE.md`](../ETUDE-EVERYTHING-CLAUDE-CODE.md).

- **Proposition** : dépôt `affaan-m/everything-claude-code` (v2.2.0, MIT), vainqueur hackathon
  Anthropic × Forum Ventures. Cloné **en lecture seule** (88 Mo, 3454 fichiers), rien exécuté.
- **Cartographie** : 67 agents · ~460 fichiers skills · 94 commandes · 122 rules par langage ·
  11 JSON Schemas · hooks `PreToolUse` (gouvernance/apprentissage continu) · méta-skills d'éval.
- **Déjà couvert chez nous** : gates, ledgers, oracles, `contre-expertise`, defs YAML à `arbitre`
  et chaînes de provenance.
- **3 patterns retenus et appliqués** (validés `self-test.mjs` forge-agents, 10 PASS) :
  - **P1** `oracle-defs.mjs` — cohérence transversale du graphe `de:`/`vers:`.
  - **P2** `regime-de-preuve.md` — exécution non destructive, durcie, ne jamais réécrire le livrable.
  - **P3** `provenance{source,author,confidence,date}` — fail-closed sur capacité importée.
- **Écarté** : la machinerie exécutable (install/hooks capturant secrets et usage) — hors doctrine.
- **Rapport charté** : [`rapport.html`](rapport.html) (oracles `check_html` + `render_page` PASS).
- **Poussé** : forge-agents `master` `8a6b3ce` · pilot `main` `9ff13b7`.
