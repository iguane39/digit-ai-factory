# Retours forges — factory-digit-ai-fr — 20260818a

- **Contexte** : clôture du run de version `forge-digit-ai-fr-20260818a` (page « Comment ça marche »)
- **Références ledger** : `forge\ledger.jsonl` seq 38 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `<factory>\input\00-retours\`
- **Statut** : remis le 2026-08-18

| id | forge | gravité | constat | preuve | proposition |
|---|---|---|---|---|---|
| RC-1 | conception | majeur | `oracle-ears` détecte ses déclencheurs par inclusion de sous-chaîne sans frontière de mot : le déclencheur d'authentification `sso` matche dans le mot « re**sso**urce », et EA5 réclame alors tout le cycle de vie de session sur une exigence qui ne parle pas d'authentification | ledger seq 38 ; exigence EX-044 (« La page est servie sans ressource chargée depuis un domaine externe ») reformulée pour contourner | appliquer aux `DECLENCHEURS_AUTH` et `DECLENCHEURS_ASYNC` la même regex à frontières de mot que `AMBIGUS` (EA2) — les termes courts (`sso`, `saml`, `oidc`) sont les plus exposés |
