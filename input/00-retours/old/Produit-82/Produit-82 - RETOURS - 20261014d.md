# Retours forges — Produit-82 — 20261014d

- **Contexte** : fin de la phase P4 du brief `Digit-AI - Brief Gateway LLM - Fiche produit et socle agentgateway - 20261014b` (exploitation sur Railway), run `Produit-82-20261014-ouverture`.
- **Références ledger** : `forge\ledger.jsonl` seq 38 à 42
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-14

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le retour porte sur le registre des garde-fous de plateforme du pilot, que la section dédiée ci-dessous alimente.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-7 | majeur | générique | Le 14/10/2026, le premier déploiement Railway d'un produit a demandé 7 essais. La CLI Railway 5.68.0 refuse `init`, `list`, `link`, `add` et `scale` sous un jeton de workspace comme sous un jeton de projet (« Unauthorized »). L'API publique rend 403 au client HTTP de Python sans `User-Agent` explicite. Le collecteur de journaux perd et réordonne des lignes émises en rafale. Ledger seq 38 à 42 ; contournements dans `Produit-82/deploy/railway/deployer.py`. | Inscrire ces contraintes au registre des garde-fous de plateforme, pour qu'un produit suivant parte de la voie qui marche : projet, services, région, volume et domaine par l'API, puis variables, `up` et journaux par la CLI sous jeton de projet. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le service de rétention plantait au premier démarrage, la table `request_logs` n'existant pas encore | purge reportée en mode boucle, rouge puis vert sur une base vide | non | défaut du produit, corrigé et consigné au ledger seq 41 |
| Un `\r` de fin de ligne Windows collait au jeton dans `.env` | lecture nettoyée par `strip()` dans le déployeur | non | défaut de poste, sans portée générale |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Nouveau garde-fou, heurté le 14/10/2026 pendant le premier déploiement :

- plateforme : Railway, CLI 5.68.0 et API publique GraphQL ;
- mécanisme : portée des jetons de la CLI, filtrage du client HTTP par l'API, collecteur de journaux ;
- effet : process bloquant ; « Unauthorized » sur `init`, `list`, `link`, `add` et `scale` sous jeton de workspace comme sous jeton de projet, HTTP 403 sans `User-Agent`, lignes de journal perdues ou réordonnées ;
- portée : tout déploiement scripté sur Railway ;
- ce qu'il vise : les gestes de niveau compte personnel (`me`), et les clients HTTP sans identification ;
- ce qu'il refuse : la création et le pilotage d'un projet par la CLI seule, sous un jeton partageable ;
- date du relevé : 14/10/2026, ledger seq 38 à 42.

## Confirmations positives

- `railway api` accepte le jeton de workspace pour toutes les mutations utiles : `projectCreate`, `projectTokenCreate`, `serviceCreate`, `serviceInstanceUpdate`, `volumeCreate` et `serviceDomainCreate`.
- `oracle-sast.mjs` a vu juste sur `urllib.urlopen` et `HTTPSConnection` : passer par la CLI a supprimé la catégorie de risque.

## Ordre recommandé

1. RT-7 : il évite à chaque produit suivant les 7 essais de ce déploiement.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain. RT-7 relève d'une classe proposée : **RT-7** : `garde-fou-plateforme-decouvert-au-deploiement`, famille `heritage-produit`, libellé « Une contrainte de plateforme connue d'aucun registre se découvre par essais au premier déploiement d'un produit ».
