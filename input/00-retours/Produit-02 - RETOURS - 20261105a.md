# Retours forges — Produit-02 — 20261105a

- **Contexte** : mise en ligne hors run des vidéos de la piscine et du sauna et des notices A3 à QR vidéo
  (D-903 (a), 05/11/2026 ; `forge\ledger.jsonl` seq 692, entrée `type: etape_close`).
- **Références ledger** : `forge\ledger.jsonl` seq 693 (entrée `type: retour`, `destinataire: digit-ai-forge-ops`),
  qui devient RT-148. Aucun run n'est ouvert (dernier `run_close` : seq 470) : le lot est remis dans le tour.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-11-05

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT de ce produit (dernier défini : RT-147, lot 20261103a). Correspondance avec le ledger :
RT-148 = seq 693.

---

## Forge ops (`digit-ai-forge-ops`)

Un échec passager des contrôles fait sauter le déploiement, et la relance des contrôles ne le rattrape pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-148 | mineur | générique | **Un déploiement Railway marqué SKIPPED par « Wait for CI » n'est pas rattrapé quand les contrôles relancés passent au vert.** Fait (ledger seq 693, `type: retour`, 05/11/2026) : la poussée `d8d46d3..237dc8d` de 21:33 a fait échouer le workflow « Contrôles » (run 42104435284) sur `build/ci/oracle-consent.mjs` : « TimeoutError: Timed out after 30000 ms while waiting for the WS endpoint URL to appear in stdout! », Chrome n'ayant pas démarré sur le runner, sans lien avec le commit. Le job relancé est vert à 21:46:06, mais l'API Railway liste toujours le déploiement de `237dc8d` en `SKIPPED`, et la production sert l'ancien manifeste `caff79673e959ae8` à 21:48:57. Il a fallu un déploiement neuf du commit (GraphQL `serviceInstanceDeployV2`, 21:49:45) : manifeste `bebe50d1a270bd09` servi à 21:52, « PRODUCTION CONFORME » (run 42107402758) à 21:53:31. `docs\projet\COMMANDES.md` et `docs\projet\COMPOSANTS-OPS.md` décrivent la chaîne push → Contrôles → Railway, mais pas ce rattrapage. | Règle qui aurait évité le retour : aucune connue ; la chaîne documentée suppose que le vert des contrôles déclenche le déploiement. Pistes : documenter dans la chaîne de mise en production « contrôles relancés au vert après un échec → déploiement neuf du commit » ; l'automatiser (workflow sur `check_suite` réussi d'un commit dont le dernier déploiement est `SKIPPED`) ; borner l'instabilité du lancement de Chrome dans l'oracle du consentement (une relance, ou un délai de lancement plus long). |

## Rattachement

Registre interrogé le 05/11/2026 (depuis la racine du pilot) :
`grep -c -i -E 'railway[^"]{0,200}(skipped|wait for ci)' todo/TODO.jsonl` → 0 ligne(s) trouvée(s) ;
`grep -c -i -E 'oracle-consent' todo/TODO.jsonl` → 0 ligne(s) trouvée(s) ;
`grep -c -i -E 'serviceInstanceDeploy' todo/TODO.jsonl` → 0 ligne(s) trouvée(s).

Items voisins, qui ne le couvrent pas : TF-0845 (`railway up -p` contre `railway link`), TF-1706 (contraintes
Railway à inscrire au registre), TF-1707 (suppression de fichiers de volume refusée aux agents). Classe
retenue au référentiel du pilot : `garde-fou-plateforme-decouvert-au-deploiement`.

## Garde-fou de plateforme relevé

Nouveau garde-fou (absent du registre : GFP-003, seul garde-fou Railway, porte sur les jetons et l'API) :

- **plateforme** : railway ;
- **mécanisme** : option « Wait for CI » du service, qui attend les vérifications GitHub du commit poussé ;
- **effet** : process bloquant, le déploiement passe en `SKIPPED` et n'est jamais rejoué ;
- **portée** : tout service Railway déployé depuis GitHub avec « Wait for CI » activé ;
- **vise** : ne pas déployer un commit dont les contrôles ont échoué ;
- **refuse** : de rattraper le déploiement quand les mêmes contrôles, relancés, repassent au vert ; seul un
  déploiement neuf du commit (GraphQL `serviceInstanceDeployV2`) le met en ligne ;
- **heurté le** : 05/11/2026, commit `237dc8d` (RT-148, ledger seq 693).

## Documents mûrs

- **« Notice Piscine A3 »** (8 versions) : reste au produit, parce que c'est l'affiche d'un équipement
  propre à ce domaine (dôme, clés, molettes) et que ses versions successives sont des corrections de
  contenu demandées par l'exploitant (ledger seq 414 à 433 et 604), pas une forme qui manque à la bibliothèque.
- **« Notice Sauna A3 »** (7 versions) : reste au produit, pour la même raison (poêle, minuterie, réservation
  du domaine) ; versions issues des retours de l'exploitant des 13 et 14/10/2026.
- **« Dossier Plan de campagnes Google Ads »** (5 versions) : reste au produit, parce que chaque version
  reprend des chiffres et des arbitrages propres aux campagnes de ce domaine. Versions comptées par l'oracle,
  non relues une à une dans ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : les notices A3 sont des pages
propres au produit, sans gabarit de `gabarits\documents\`.

## Remarques restées au produit

Rien à dire : aucune remarque n'est restée au produit sur ce lot (généralisable : sans objet).
