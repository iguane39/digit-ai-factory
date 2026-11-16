# Retours forges — Produit-86 — 20261113a

- **Contexte** : run `20261112a-comptes-et-ecritures`. Produit-86 a demandé à Produit-84 un en-tête unique pour le jeton de service de Cloudflare Access (demande 20261112c), puis a préparé son export (E-158).
- **Références ledger** : `forge\ledger.jsonl`, seq 1001 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 13/11/2026 est `todo/CLASSES.json` du pilot.

- RP-72 se rattache à `interface-tierce-ecrite-de-memoire` : la valeur d'un paramètre d'une API tierce a été proposée, puis réservée dans le code, sans que sa liste de valeurs admises soit relue.

## digit-ai-factory (pilot)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-72 | majeur | générique | La demande `Produit-86 - DEMANDE - 20261112c` proposait le nom d'en-tête `X-Produit-86-Access` pour le réglage `read_service_tokens_from_header` de Cloudflare Access, et E-158 (commit d888e02) réservait `Authorization`. L'API de Cloudflare refuse tout autre nom : « read_service_tokens_from_header must be one of [Authorization] » (réponse de Produit-84 du 13/11/2026, chaîne 43387736198). Il a fallu un correctif (f1e5c38), une recette et un redéploiement de plus. La page de documentation avait été lue, mais pas le schéma de l'API. | Le gabarit de demande entre produits exige, pour tout paramètre d'une API tierce qu'il prescrit, la source de ses valeurs admises (schéma ou référence de l'API, pas seulement un guide), ou la mention « valeur à confirmer par le propriétaire ». |

## La règle qui aurait évité le retour

- `interface-tierce-ecrite-de-memoire` (RP-72) : une valeur prescrite à une API tierce cite la référence de l'API qui l'admet, ou se déclare à confirmer.

## Remarques restées au produit

| Réf. ledger | Gravité | Remarque | Motif du maintien au produit |
|---|---|---|---|
| ce lot | mineur | Au portail, la route qui fait évoluer un constat (`POST /missions/{m}/findings/{f}/transition`) n'exige pas le rôle d'approbateur : un opérateur indépendant de l'hypothèse peut valider. La commande `approbateur valider` (E-159) réserve, elle, le geste à l'approbateur. | Règle propre au produit, à trancher par son porteur. Généralisable : non. |
| ce lot | mineur | Le test de mise en production a rendu FAIL au premier passage : E-159, d'impact 5, n'y avait pas de contrôle. Le contrôle a été ajouté (85c15ec). | L'oracle a joué son rôle et a arrêté la livraison ; aucune règle de la Factory n'a manqué. Généralisable : non. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261109b, 20261112e, 20261112g et 20261112h) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : le refus de l'API de Cloudflare (« must be one of [Authorization] ») est une contrainte de la plateforme du propriétaire, que Produit-86 a suivie ; aucun refus n'a été contourné.

## Confirmations positives

- Le refus `TICKET_INVALIDE` de l'export de l'en-tête, sans ticket de sondes, a tenu : la session n'a aucune voie vers le jeton de la porte d'accès sans l'approbation d'une demande.
- oracle-dast 0.2.0 admet `Authorization` comme nom d'en-tête d'accès sans modification.
