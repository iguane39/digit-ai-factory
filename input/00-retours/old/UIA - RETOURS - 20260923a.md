# Retours forges — UIA (Produit-71) — 20260923a

- **Contexte** : clôture du run `UIA-mandat-audit-poc-to-prod-20260923` (audit POC-to-Prod, verdict NO GO).
- **Références ledger** : `forge\ledger.jsonl` seq 9-15, 50-57, 68-70, 81-83 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier et son sidecar dans `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Retours à `digit-ai-forge-audit` (compliance-pack de Produit-64)

| Réf | Gravité | Portée | Le fait | Piste |
|---|---|---|---|---|
| RX-1 | majeur | générique | `verifier-schema-modele.mjs` rend des faux positifs : les noms qualifiés `public."Table"` d'un dump `pg_dump` ne sont pas lus (tables déclarées absentes), et sur un JSON `information_schema` les colonnes de `Notification`/`AuditLog` sont attribuées à `User`. Sur UIA il prononçait une dérive ORM↔base inexistante — contredit par `prisma migrate diff` (No difference). | Lire le schéma qualifié de pg_dump ; ancrer chaque colonne à sa table réelle. |
| RX-2 | majeur | générique | `maj-versions.mjs` lancé à la racine d'un monorepo npm workspaces n'inventorie que le `package.json` racine (8 composants sur 49) : les dépendances des workspaces `backend`/`frontend` sont ignorées. | Détecter les `workspaces` et parcourir chaque paquet. |
| RX-3 | mineur | générique | `maj-versions.mjs` : `pg` (node-postgres) classé `reco_eol` avec cible `8.23.0` dans le même majeur ; le remplaçant de `supertest` extrait « release » au lieu de « 7.1.3+ ». | Affiner l'extraction du driver EOL et du successeur npm. |

## Retours à `digit-ai-forge-tests`

| Réf | Gravité | Portée | Le fait | Piste |
|---|---|---|---|---|
| RX-4 | majeur | générique | Le pan `interface` rend 3 findings `lien-casse` bloquants (`/admin/keys`, `/admin/requests`) : l'oracle ne compose pas les routes imbriquées React Router (`<Route path="/admin">` + `<Route path="keys">`) et déclare la destination absente. Vérifié faux. | Résoudre la composition des routes imbriquées avant de conclure au lien cassé. |

## Retours à `digit-ai-forge-agents` (quality-oracles)

| Réf | Gravité | Portée | Le fait | Piste |
|---|---|---|---|---|
| RX-5 | majeur | générique | `oracle-sca` rend SKIP « npm audit sans sortie exploitable (exit null) » sous Windows alors que `npm audit --json` et l'`oracle-sca` de forge-websec répondent (0 vulnérabilité) : lancement de `npm.cmd` probablement sans `shell:true`. | Invoquer npm avec `shell` sur Windows (comme `runCmd` de maj-versions). |
| RX-6 | mineur | générique | `oracle-secrets` classe bloquants des `password: 'do-not-log'` de tests et un libellé « Le mot de passe initial » ; `oracle-sast` n'utilise pas semgrep disponible via `uvx` (échelle de résolution non câblée). | Exclure les fixtures de test ; tenter `uvx semgrep` avant repli sur les règles intégrées. |

## Remarques restées au produit

- L'écart initial d'adoption (`.gitignore` préexistant, `docs/*.md` hors nommage R-4, absence de `docs/projet/`, commits hors Conventional Commits) est **antérieur au run** et consigné à `forge\travaux\ECARTS-ASSUMES.md` ; il se tranche au premier run de version d'UIA, pas ici. **Généralisable : non** (écart propre à ce produit).
- Le raccourci de l'orchestrateur (`ledger-append.mjs`) et les données de génération du rapport vivent dans le scratchpad de session, hors du produit : ils ne sont pas des livrables. **Généralisable : non**.
- Aucune remarque de portée purement produit n'a été corrigée en silence pendant ce mandat. **Généralisable : non**.

## Retours sur les documents produits

- Le modèle de rapport Client-A (`Client-A - Modèle Rapport d'audit POC-to-Prod`, version du gabarit : 20260827a) cite en clair `const DOMAINS = { ... }` dans son bloc d'instructions : un builder qui remplace par `indexOf('const DOMAINS =')` frappe le texte d'instruction, pas les données. Retirer le bloc d'instructions **avant** toute injection. Coût mesuré : une passe de build silencieusement fausse (verdict GO au lieu de NO GO) rattrapée par le contrôle de format.
- La fiche sécurité et le modèle de rapport portent des `{{…}}` littéraux dans leurs commentaires/JS de rendu : ils font échouer `verifier-roundtrip` (placeholders résiduels) alors qu'ils sont légitimes. Envisager `--no-check-placeholders` documenté, ou neutraliser ces motifs à la génération (version du gabarit : fiche 20260710a).
