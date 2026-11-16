# Retours forges — Produit-84 — 20261113a

- **Contexte** : le 13/11/2026, la session `4c9a6f46` traite les demandes de Produit-86 20261112b et 20261112c et corrige 5 réglages de Supabase de dev, sur la consigne du porteur « Fais A1, A2, A3 : 2 heures, A4 ».
- **Références ledger** : `forge\ledger.jsonl` seq 308.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-13
- **Complétude** : 1 entrée `type: retour` écrite par cette session (seq 308), relue le 13/11/2026 dans `forge\ledger.jsonl`. Les 15 retours plus anciens sans lot (seq 198 à 300) relèvent d'autres sessions et ne sont pas repris ici.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **L'en-tête unique d'Access** proposé par Produit-86, `X-Produit-86-Access`, est refusé par l'API de Cloudflare : la chaîne de dev passe au rouge, puis repasse au vert avec `Authorization`.

## digit-ai-forge-websec — oracle-dast, en-tête d'accès

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-23 | majeur | générique | **Le jeton de service d'Access en un seul en-tête n'accepte qu'un nom : `Authorization`.** (1) `oracle-dast.mjs` 0.2.0 n'ajoute qu'un en-tête par cible (`en_tete_acces`) ; Produit-86 a donc demandé de poser `read_service_tokens_from_header` sur l'application Access de Produit-84-dev, avec le nom `X-Produit-86-Access`. (2) L'application Terraform de la chaîne `43387736198` est refusée : « access.api.error.invalid_request: read_service_tokens_from_header must be one of [Authorization] ». (3) La page de documentation de Cloudflare relue par Produit-86 le 12/11 ne le dit pas. (4) Avec `Authorization`, la chaîne `43388235024` passe ses 13 tâches. Ledger seq 308 ; commit `5d83328`. | oracle-dast documente que l'en-tête d'une application Access derrière jeton de service à un seul en-tête se nomme `Authorization`, et que sa valeur est l'objet JSON `{"cf-access-client-id", "cf-access-client-secret"}` ; son contrôle d'entrée refuse un autre nom pour une cible Access. Règle qui aurait évité le retour : aucune. Classe proposée : `contrainte-de-plateforme-non-documentee`. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Aucune : la seule friction du tour est généralisable.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : la contrainte de l'API d'Access est l'objet de RU-23, elle ne protège pas le poste.

## Confirmations positives

- Le hook `gestes-distants` a refusé un lot dont la commande ne figure pas dans sa liste fermée : la coupure des clés d'ancien format de Supabase n'était pas un geste à garder, et l'accord est resté tracé au ledger (D-184).
- `mobiliser.mjs --verifier` a refusé une déclaration d'inchangé posée sous le nom du fichier au lieu de la clé du livrable, et a nommé la clé attendue.

## Ordre recommandé

1. RU-23 : toute application Access sondée par oracle-dast le rencontrera.
