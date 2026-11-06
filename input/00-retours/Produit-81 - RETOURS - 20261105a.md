# Retours forges — Produit-81 — 20261105a

- **Contexte** : remédiation de l'audit POC-to-Prod 20261029a, hors run (aucun run ouvert au ledger du produit), lot « A1, A2, A3, A4 » du porteur le 05/11/2026 ; campagne forge_tests jouée pour la première fois sur ce produit.
- **Références ledger** : aucune, `forge\ledger.jsonl` absent du produit (aucun run ouvert) ; ce lot est remis hors run, comme le demande S48.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 05/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 05/11/2026 : `todo/CLASSES.json` du pilot, 241 classes, filtré sur `pile|stack|frontend|ledger absent|hors run|sans run`. Aucune classe ne décrit une forge qui déduit la pile d'un nom de dossier : RP-1 propose la sienne. RP-2 se rattache à `retour-de-ledger-jamais-compile` (famille `tracabilite-ledger`), dont il est le cas amont : le retour ne peut même pas être consigné.

## forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-1 | majeur | générique | Sur un produit React dans `FRONT/` et .NET 10 dans `BACK/`, `python -m forge_tests` rend PARTIEL (sortie 3) : « dépendances front non installées — C:\dev\_Client-A\Produit-81\frontend\node_modules absent » alors que `FRONT/node_modules` existe, et « aucun environnement Python » pour le pan api. 46 constats bloquants « destination … absente de l'arborescence » viennent de routes React (`/forgot`, `/register`…) non inventoriées. Les suites réelles du produit passent : BACK 480/480 par `dotnet test`, FRONT 216/216 par `npm run test:ci`. Preuve : `forge\etapes\tests\rapport-20261105.json`, champs `motifs_non_couverture` et `findings`. | Détecter le front par son `package.json` (et non par le nom `frontend/`), ajouter un adaptateur `dotnet test` (résultats TRX, couverture coverlet), et ne pas émettre de constat « destination absente » quand l'inventaire des routes est vide. |

## pilot (restitution, ledger)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-2 | mineur | générique | Hors run, un produit ne peut ni réserver une décision (`reserver-decision.mjs` échoue : `forge/ledger.jsonl` absent) ni consigner un retour (`forge/ledger.py` exige une première entrée `run_open`). La restitution doit alors numéroter « Décision 1 » à la main et remettre un lot comme celui-ci pour une seule friction. Preuve : restitutions du 05/11/2026, session de remédiation Produit-81. | Un journal de session hors run (sans `run_open`), ou une réservation et un retour admis sans run, compilés au prochain lot. |

## La règle qui aurait évité le retour

- `pile-deduite-d-un-nom-de-dossier` (RP-1) : une forge reconnaît la pile d'un produit par ses manifestes (`package.json`, `*.csproj`, `pyproject.toml`), jamais par un nom de dossier conventionnel.
- `retour-de-ledger-jamais-compile` (RP-2, classe existante) : un retour doit pouvoir être consigné même hors run.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Réglage `WEBSITE_HEALTHCHECK_MAXPINGFAILURES` échangé à chaque swap de slot (dérive Terraform un déploiement sur deux) | ajouté à `sticky_settings` dans `infra/terraform/appservice.tf` | oui pour les produits App Service à slot, mais c'est une correction de code produit | reste au produit, parce que la classe (« réglage écrit d'un seul côté d'un swap ») vit dans le code du produit et dans le gabarit Terraform commun Client-A, pas dans la factory |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le refus de restitution sans pré-jugement a fait trouver, dans le même tour, la vraie cause d'une dérive que la première correction ne traitait qu'au symptôme.

## Ordre recommandé

RP-1 d'abord, parce qu'il rend chaque campagne forge_tests PARTIELLE sur ce produit, puis RP-2.
