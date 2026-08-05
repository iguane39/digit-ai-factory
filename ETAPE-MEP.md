# Étape 5 — MEP (mise en production)

Version 1.0.0 — 2026-08-04

Aucune forge ne déploie (development s'arrête volontairement à « PR-ready, jamais mergé »).
La capacité MEP est donc **portée par le steering** — aucune modification des dépôts frères.
Principe : **le staging est autonome, la production est sur GO humain.** La confiance du client
final se fabrique par un dossier de preuve, pas par l'absence de gate.

## 1. Entrée de l'étape

L'étape MEP ne s'ouvre que si les étapes 1-4 sont closes avec leurs verdicts (oracles verts ou
seuils tenus, exit 3 forge-tests accepté avec pans non couverts consignés). La **cible de
déploiement** vient du brief produit (champ « cible de déploiement ») — si absente, défaut :
conteneur Docker local/staging. Une cible cloud (Railway, VPS, autre) est un **paramètre du
brief**, jamais improvisée en cours de run.

## 2. Ce que l'étape produit (staging, autonome)

Dans le projet produit (`forge\etapes\mep\` pour les preuves, racine pour les fichiers de build) :

1. `Dockerfile` (+ `docker-compose.yml` si plusieurs services) dans le produit.
2. Déploiement **staging** réel : `docker compose up -d` (ou équivalent de la cible), instance
   servie sur un port local dédié.
3. `ROLLBACK.md` : procédure de retour arrière écrite **et testée une fois pendant l'étape**
   (arrêt de la version N, redémarrage de la version N-1 taguée, vérification healthcheck).
4. `DOSSIER-MEP.md` : le dossier de GO (cf. §4).

## 3. Oracle MEP (exécuté, jamais déclaratif)

| # | Contrôle | Preuve exigée |
|---|---|---|
| M-1 | Build du conteneur | `docker build` exit 0, image taguée `<produit>:<run-id>` |
| M-2 | Healthcheck | HTTP 200 sur l'endpoint de santé de l'instance staging, 3 mesures espacées de 10 s |
| M-3 | Smoke tests | ≥ 1 parcours rejoué par exigence MVP en bande de risque « critique » (cotation forge-tests), exécutés **contre l'instance staging servie**, pas contre un TestClient |
| M-4 | Rollback | procédure de `ROLLBACK.md` exécutée une fois avec succès (retour N-1 + healthcheck 200 + retour N) |
| M-5 | Propreté | aucun secret en clair dans l'image ni dans compose (scan des fichiers embarqués) |

Verdict au ledger (`oracles_verdict`, étape `mep`). Un contrôle rouge → retour à l'étape
concernée (max 3 allers-retours, puis diagnostic — même règle que tests↔development).

## 4. Le gate — GO humain (incompressible)

La mise en **production** exige un GO humain explicite, donné sur `DOSSIER-MEP.md`, qui contient :

- les verdicts d'oracles des 5 étapes (avec références ledger `seq`) ;
- le rapport forge-tests (couvertures, mutation, findings, pans non couverts) ;
- le résultat des smoke tests staging (M-3) et du test de rollback (M-4) ;
- les limites déclarées du run (modes dégradés, `non_juge`, hypothèses prises) ;
- la commande exacte de mise en production et la procédure de rollback.

Le GO est consigné au ledger (`reponse_humain`, portée : « GO production <produit> <version> »).
Sans GO : le run se clôt en statut `pret_production_en_attente_GO` — c'est un état de succès,
pas un échec. **Ce gate est incompressible.** Si une autonomie totale sans GO devait un jour
être voulue, elle devrait être demandée explicitement et consignée comme décision assumée dans
`HYPOTHESES.md` — elle est déconseillée : elle contredit les constitutions de forge-development
(HITL non négociables) et la fabrique de confiance client.

## 5. Après la MEP

Les retours de production (incidents, monitoring, remontées client) entrent au ledger avec
`type: "retour"`, source `production`, et alimentent la boucle d'amélioration — même cycle borné,
même gate humain que pour les forges.
