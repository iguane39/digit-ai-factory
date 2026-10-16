# Retours forges — COMPTA - Ventilation de facture Fournisseur-A — 20260814a

- **Contexte** : clôture du run `20260814-tests-Fournisseur-A` (cycle « tester et corriger », 2 audits complets + 1 vague de correction)
- **Références ledger** : `forge\ledger.jsonl` seq 7, 10, 11, 16, 17 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-14

Produit audité : FastAPI + Jinja2 **à racine plate** (`app\`, `tests\`, `.venv\` à la racine,
sans dossier `backend\`) — disposition répandue qui a exposé une classe entière de limites de
l'auditeur. Tous les retours visent forge-tests ; tous sont des faits mesurés au ledger.

## forge-tests (`digit-ai-forge-tests`)

Le run a coûté : 1 exit 2 (livrables refusés à tort), 2 pans jamais mesurables (a11y, visuel),
7 pans perdus sur l'ancrage `backend\`, 1 aller-retour de configuration inutile (motif
trompeur), 1 pollution de mesure croissante par cycle.

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RT-1 | majeur | Garde-fou anti-fuite des jeux de données : `FORGE_TESTS_PRODUIT` déclaré dans `<projet>\.env.forge-tests` (emplacement documenté au README) est collecté comme valeur sensible du projet, puis le champ `.produit` du jeu — qui reprend légitimement ce nom — est refusé : `DonneeNonSynthetique`, exit 2, 4 livrables non produits (ledger seq 6-7, stderr cycle 1 tentative 1). Contournement appliqué : variable passée en environnement processus. | Exclure les variables `FORGE_TESTS_*` du corpus de valeurs interdites (elles configurent l'auditeur, pas le produit), ou documenter que `PRODUIT` ne doit jamais vivre dans `.env.forge-tests` |
| RT-2 | bloquant | Ancrage `backend\` en dur : `disposition.py` ancre la découverte du paquet sur `<cible>\backend`, `execution.py` lance la suite avec `cwd=<cible>\backend`, `securite.py:131` teste `(cible/'backend').is_dir()`. Produit à racine plate (`app\` + `tests\` + `.venv\` à la racine) : **7 pans non mesurables** (api, data, migrations, batch, fichiers, back, securite) alors que suite pytest (74 tests verts) et app factory sont standards. TF-0097 (12/08) n'a résolu que le NOM du paquet, pas l'ANCRE (ledger seq 10). | Découvrir la racine d'exécution comme le paquet : essayer `<cible>\backend` puis `<cible>` (présence tests\ + paquet + venv) ; ou accepter `FORGE_TESTS_SOURCES` absolu comme base complète (cwd compris) |
| RT-3 | majeur | Pans accessibilite/visuel : l'inventaire de routes lit uniquement `frontend\src\routes.jsx` (`adaptateurs\accessibilite.py`, `_routes`). App à gabarits Jinja servis par le backend : « aucune route » alors que `FORGE_TESTS_BASE_URL` est servie et que le pan qualif venait de parcourir 33 puis 42 éléments sur cette même instance (ledger seq 11). | Quand `frontend\src\routes*` est absent et `BASE_URL` servie, réutiliser l'inventaire de routes découvert par le crawl qualif (+ `FORGE_TESTS_QUALIF_ROUTES`) |
| RT-4 | majeur | Le pan interface scanne `forge\` du produit : les livrables archivés du cycle N-1 (`forge\etapes\tests\livrables\`, convention ETAPES-RUN du pilot) entrent à l'inventaire du cycle N — 344 éléments au cycle 2 dont **262 issus du dashboard et des cahiers archivés**, contre 82 éléments produit au cycle 1. Aucun faux échec ici, mais mesure polluée et croissante à chaque cycle (ledger seq 16, rapports cycle 1 vs 2). | Exclure `forge\` du périmètre des gabarits, comme `node_modules`/`.venv`/`.visuel` — c'est le dossier de run du pilot, jamais du produit |
| RT-5 | mineur | Motif trompeur du pan securite : `analyser()` teste `racine is None OR not backend\` et publie dans les deux cas « registre d oracles introuvable : definir FORGE_TESTS_ORACLES ». Ici le registre ÉTAIT résolu (chemin par défaut existant + variable déclarée) ; la cause réelle était `backend\` absent. Coût : un aller-retour de configuration inutile entre cycles 1 et 2 (ledger seq 17). | Séparer les deux causes en deux motifs distincts — le `POUR_COUVRIR`, lui, dit déjà la bonne cause |

## Confirmations positives

- **CLI native robuste en conditions réelles** : 3 audits complets en 10-13 s chacun, codes de
  sortie contractuels (2 puis 3), stdout JSON pur, avancement TF-0094 émis, `--sortie` a
  préservé le rapport même sur l'exit 2 (« la mesure n'est pas perdue » — vérifié).
- **G-1 tenue** : aucune écriture constatée dans l'arbre du produit pendant les 3 audits ;
  le refus du jeu de données est bien intervenu AVANT toute écriture.
- **Sceaux** : 4 cahiers (cycles 1 et 2) vérifiés `verifier_sceau` → PASS.
- **Pan qualif efficace** : a trouvé en une passe un vrai défaut produit (`/logout` → 404 local
  via `/.auth/logout` plateforme) ; après correctif env-aware : 42/42, seuil 1,0 tenu.
- **`actions[]` a correctement routé** la correction (`manuelle_dev → development`) : la boucle
  du pilot a fermé en 1 cycle, zéro `auto_ia` restante.
- **Tendance `--precedent`** intégrée au dashboard du cycle 2 sans friction.

## Ordre recommandé

1. **RT-2** — une classe entière de projets réels (racine plate) perd ses 7 pans les plus riches.
2. **RT-1** — livrables systématiquement bloqués dès que la config documentée est suivie.
3. **RT-4** — la pollution grandit à chaque cycle chez tout produit piloté (interaction pilot×forge).
4. **RT-3** — deux pans perdus pour toute app server-rendered, instance pourtant déjà parcourue.
5. **RT-5** — une ligne de motif, un aller-retour économisé chez chaque futur utilisateur.
