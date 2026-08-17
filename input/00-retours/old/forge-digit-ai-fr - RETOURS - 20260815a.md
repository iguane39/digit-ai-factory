# Retours forges — forge-digit-ai-fr — 20260815a

- **Contexte** : clôture du run forge-digit-ai-fr-20260815a (site vitrine forge.digit-ai.fr,
  brief → staging vérifié, MEP en attente de GO)
- **Références ledger** : `forge\ledger.jsonl` seq 8, 15, 17, 18, 20 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `<pilot>\input\00-retours\`
- **Statut** : remis le 2026-08-15

| id | forge | gravité | constat | preuve | proposition |
|---|---|---|---|---|---|
| RD-8 | design | majeur | copie installée du skill systeme-de-marque cassée : `scripts/generer-design-md.mjs` importe `../oracles/lib/color.mjs`, absent de l'installation `~/.claude/skills` — contourné via la source versionnée du dépôt | ledger seq 8 ; erreur ERR_MODULE_NOT_FOUND reproduite | embarquer lib/ dans le skill installé, ou faire pointer sync-skills sur les dépendances |
| RT-19 | tests | majeur | `charger_env` retombe sur le `.env` du dépôt de la forge quand le projet n'a pas de `.env.forge-tests` : l'audit qualif de ce produit neuf a parcouru l'instance Railway d'un AUTRE produit (11 constats étrangers, seuil 67 % erroné) | ledger seq 15 ; rapport c0 (`/login`, `/admin/*` inexistants chez l'audité) | ne jamais fournir de BASE_URL depuis le fallback forge ; config d'audit par projet uniquement |
| RT-20 | tests | majeur | la lecture statique des déclarations `responses=` (pan api) ne parse pas un dict multiligne et localise le constat dans `backend/app/main.py`, chemin inexistant sur un projet à `app/` racine | ledger seq 17 ; contestation RT-18 retenue au rapport c4 (contre-preuve `test_declaration_responses_contact_EX_012`) | lire les déclarations depuis `app.openapi()` (la sonde dump_openapi existe déjà) |
| RO-1 | ops | majeur | `ops.mjs deployer` : healthcheck lancé avec `cwd=releaseDir` mais chemin de script RELATIF — résolu contre le nouveau cwd, introuvable ; refus à tort journalisé `deploiement_refuse` | ledger seq 18 ; journal cible seq 1 | `path.resolve()` des arguments build/cible à l'entrée du CLI |
| RT-21 | tests | mineur | les livrables `--livrables` portent des types hors registre organization (Cahier, Dashboard, Jeu) — R-25 échoue sur tout produit qui les verse dans `output/` | ledger seq 20 ; renommages du 15/08 | aligner sur `registre-types.json`, ou faire admettre les types (commit motivé D-04) |
