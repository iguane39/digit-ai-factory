# BdL — RETOURS — 20260815a

Lot compilé à la clôture du run 20260815a-bdl (nouveau site Brasserie du Lac), le
15/08/2026. Source : entrées `type: retour` du ledger `forge/ledger.jsonl` (seq 6, 7, 19,
36, 45, 50, 59, 60). Contrôle de complétude : 9 retours au ledger, 8 à destination des
forges compilés ici en 7 candidatures (seq 45 et 50 fusionnées : même défaut, deux
étages) ; le retour seq 46 (destinataire development, écarts revue 5 bis) a été traité
DANS le run (cycle 2) et n'appelle pas de candidature forge.

## R1 — oracle-boite-entree : faux positif massif sur conversion CRLF (seq 6)

Un checkout git Windows (autocrlf) de la boîte migrée pilot→steering a converti LF→CRLF :
12 findings B1/B2 FAIL pour zéro édition réelle (preuve : sha256 après normalisation LF ==
sha du registre, vérifié sidecar par sidecar le 15/08/2026). Proposer : normaliser les fins
de ligne avant hachage dans `empreinte()`, ou `.gitattributes` `input/** text eol=lf` au
dépôt porteur.

## R2 — oracle-skills --appliquer ne purge pas les orphelins (seq 7)

`--appliquer` copie source→copie mais laisse les fichiers « en trop » (sauvegardes
`.avant-*`, lockfiles, fixtures locales) : K2 reste FAIL après application (11 orphelins
sur 3 skills constatés le 15/08/2026). Proposer `--appliquer --purger` avec quarantaine,
jamais de suppression sèche.

## R3 — run-oracles-conception : FAIL agrégé trompeur (seq 19)

Quand seuls les artefacts du verbe redige-les-exigences existent, constitution/delta/etat
échouent structurellement (artefacts d'autres verbes absents) et l'agrégé sort exit 1
alors que les 5 oracles applicables sont PASS. Proposer NON_JUGE quand l'artefact d'entrée
du sous-oracle n'existe pas.

## R4 — forge-tests : adaptateurs migrations/data aveugles sur racine plate (seq 36)

`adaptateurs/{migrations,data}.py` cherchent `<cible>/backend/migrations` en dur alors que
`disposition.py` (TF-0216) sait découvrir la racine plate — sur ce produit (`migrations/` à
la racine), les pans data/migrations n'ont pas vu les `.sql` (constaté aux 5 audits du
15/08/2026).

## R5 — forge-tests : pan prompts en effet Larsen à deux étages (seq 45 + 50)

Étage 1 : l'inventaire prompts scanne `forge/` — le champ `orchestrateur` du ledger et les
alias cités dans un fichier de contestation deviennent des « modèles du produit ». Étage
2 : les rapports d'audit persistés (`forge/etapes/tests/rapport-*.json`), exigés par le
contrat ETAPES-RUN, sont ré-inventoriés au run suivant — l'audit ne peut PAS converger
sans contestation (4 alias fantômes, 5 contestations nécessaires le 15/08/2026). Proposer
d'exclure `forge/` et les rapports de la forge elle-même de l'inventaire prompts.

## R6 — fiche expert-ops-railway : 4 pièges constatés au premier déploiement réel (seq 59)

Exécution réelle Railway consignée (D-P1 : 8 tentatives le 15/08/2026, succès à la 8e) :
(a) `startCommand` exécuté SANS shell — `$PORT` littéral, crash-loop ; port en dur ou CMD
d'image requis ; (b) l'edge public ET le healthcheck parlent IPv4 au conteneur — uvicorn
`--host ::` (v6-only) = connection refused ; bind `0.0.0.0` ; (c) volume monté root — une
image non-root doit poser `RAILWAY_RUN_UID=0` ou aligner l'UID ; (d) le CLI ne montre pas
les logs runtime d'un déploiement échoué — l'API GraphQL (`deploymentLogs`, `httpLogs`
avec `upstreamErrors`) oui. À verser à la fiche `expert-ops-railway.md` et au plan O-5.

## R7 — forge-tests : refus G-1 de --livrables illisible (seq 60)

Un `--livrables` pointé dans le projet audité est refusé (G-1, comportement voulu) en
exit 2 mais sans motif lisible en queue de sortie — 2 exécutions perdues avant diagnostic
le 15/08/2026. Proposer un message terminal explicite.
