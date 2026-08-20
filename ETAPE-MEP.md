# Étape 5 — MEP (mise en production)

Version 1.0.0 — 2026-08-04

Development s'arrête volontairement à « PR-ready, jamais mergé ». L'étape MEP est **portée
par le pilot** et **outillée par forge-ops** (TF-0040, 11/08) : la forge fournit les gestes
(déployer, restaurer, journal) et leurs verdicts O-1…O-4 — le pilot orchestre, l'oracle
M-1…M-5 ci-dessous reste la seule vérité de l'étape, et la production reste sur **GO humain**.
Principe : **le staging est autonome, la production est sur GO humain.** La confiance du client
final se fabrique par un dossier de preuve, pas par l'absence de gate.

## 0 bis. Outillage forge-ops (articulation)

| Qui | Fait quoi |
|---|---|
| forge-ops | `ops.mjs deployer <build> <cible>` (healthcheck **avant** bascule, `COURANT` atomique), `restaurer` (rollback re-vérifié puis journalisé), `journal.jsonl` append-only |
| oracle-ops (O-1…O-4) | pointeur sain, healthcheck rejoué, journal intègre, rollback prouvable — verdicts versés au dossier MEP |
| pilot (cette étape) | orchestre les gestes, exécute M-1…M-5 (qui consomme O-1…O-4 comme preuves), assemble `DOSSIER-MEP.md` |
| humain | **GO production** — incompressible, jamais délégué à un oracle |

forge-ops ne duplique pas M-1…M-5 et n'est jamais invoquée par un produit en direct.
Le test de rollback exigé au §2.3 s'exécute désormais par `ops.mjs restaurer` (geste réel
journalisé), plus par une procédure manuelle ad hoc.

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
| M-3 | Smoke tests | ≥ 1 parcours rejoué par exigence MVP d'impact maximal (champ `cotation.impact` du référentiel `EXIGENCES.json` — toutes les ex æquo du niveau le plus élevé), exécutés **contre l'instance staging servie**, pas contre un TestClient |
| M-4 | Rollback | procédure de `ROLLBACK.md` exécutée une fois avec succès (retour N-1 + healthcheck 200 + retour N) |
| M-5 | Propreté | aucun secret en clair dans l'image ni dans compose (scan des fichiers embarqués) |

Verdict au ledger (`oracles_verdict`, étape `mep`). Un contrôle rouge → retour à l'étape
concernée (max 3 allers-retours, puis diagnostic — même règle que tests↔development).

**Premier déploiement** (aucune version N-1 réelle n'existe) : M-4 se prouve avec N-1 = N —
la mécanique complète (tags, volumes, arrêt/redémarrage, healthchecks) est exercée, la
substitution de version ne l'est pas. Preuve dégradée acceptée, **déclarée comme telle** au
dossier de MEP.

**Produit public français** (RF-6, lot SCC-FR 20260820a ; étude RGAA 20260820a) : RGAA 4.1 /
WCAG AA y est une **obligation légale**, et le parc ne mesure aujourd'hui ni le contraste (mesure
existante non câblée : `render_page.py` V2), ni la navigation clavier, ni les états ouverts.
Tant que ce trou tient, le dossier de MEP d'un produit public porte un **écart déclaré au GO
humain** : « conformité RGAA non mesurée — audit humain à budgéter, déclaration d'accessibilité
à produire ». « Prêt client » ne se prononce jamais sur une conformité légale non mesurée en la
taisant.

## 3 bis. Qualif populée (avant le GO — demande utilisateur RT-6/RS-7)

Entre le staging technique et le GO, une **version de qualification populée de données** est
déployée et auditée comme l'application réelle :

1. Le produit expose un **endpoint de peuplement** gated par drapeau d'environnement (loi 2 —
   absent en production) ; la qualif est peuplée par cet endpoint, jamais à la main.
2. `forge_tests` tourne contre l'instance qualif servie (`FORGE_TESTS_BASE_URL`), bout en bout.
3. Les éléments **non testables faute de configuration** (identifiants tiers, jetons, clés) ne
   sont ni oubliés ni maquillés : ils sortent dans la section `non_testables[]` du rapport
   {élément, champs_requis}, présentée à l'humain EN FIN d'audit avec la liste précise à saisir.
4. Dès que l'humain fournit les éléments : `--reprendre <rapport>` rejoue **uniquement** les
   éléments non exercés, jusqu'à couverture complète — sans rejouer ce qui a déjà passé.

Le résultat qualif (couverture, non-testables soldés) entre au dossier de MEP.

## 4. Le gate — GO humain (incompressible)

La mise en **production** exige un GO humain explicite, donné sur `DOSSIER-MEP.md`, qui contient :

- les verdicts d'oracles des 5 étapes (avec références ledger `seq`) ;
- le rapport forge-tests (couvertures, mutation, findings, pans non couverts), le **dashboard
  de tests** (copie datée dans `output\`) et la liste `actions[manuelle_utilisateur]` extraite
  du rapport — chaque saisie attendue de l'utilisateur (champs, où, pourquoi) pour compléter
  les tests restants ; à réception, `--reprendre` rejoue les seuls tests concernés et le
  dashboard est régénéré ;
- le verdict de la revue graphique d'implémentation (étape 5 bis, écarts soldés ou acceptés) ;
- le résultat des smoke tests staging (M-3), du test de rollback (M-4) et de l'audit qualif
  populée (§3 bis — non-testables soldés ou listés avec leur raison) ;
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
