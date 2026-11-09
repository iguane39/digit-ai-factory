# Retours forges — Produit-84 — 20261109b

- **Contexte** : le 09/11/2026, la session `3c08d011` exécute la décision D-181 (b) : poussée de la remédiation de l'audit sur `env/dev`, jetons séparés, secrets de sauvegarde, première sauvegarde de `Produit-84-dev`.
- **Références ledger** : `forge\ledger.jsonl` seq 264, 265 et 267.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-09
- **Complétude** : 3 entrées `type: retour` écrites depuis le lot 20261109a (seq 264, 265 et 267), relues le 09/11/2026 à 21:14 dans `forge\ledger.jsonl`. Elles vont toutes les 3 au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le Terraform de dev** a échoué une fois après la pose des limites d'Auth : le fournisseur attend que tous les services du projet redeviennent sains, et le service realtime ne l'était pas encore.
- **Le banc d'accessibilité** a échoué sur la chaîne alors qu'il passait sur le poste : axe a mesuré un toast au milieu de son fondu.
- **La remise de ce lot** : sa première copie au sas est partie alors que son contrôle rendait FAIL.

## digit-ai-forge-ops — fournisseur Terraform Supabase

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-13 | majeur | générique | **`supabase_settings` échoue tant qu'un service inutilisé n'est pas sain.** (1) Après chaque modification, la ressource attend que tous les services du projet soient sains, realtime compris. (2) Chaîne de dev 42685313136 du 09/11/2026 : « Project Services Unhealthy … unhealthy service realtime » ; 5 minutes plus tard, l'API de santé rend les 5 services sains et la relance passe. (3) Sur le projet de qualification, realtime est UNHEALTHY de façon durable (`GET /v1/projects/{ref}/health`, 09/11/2026) : sa chaîne échouera au même endroit. Ledger seq 264. | Dans les gabarits de chaîne, relancer l'application Terraform une fois sur cette erreur et sonder la santé des services avant d'appliquer ; désactiver realtime quand le produit ne l'utilise pas. Règle qui aurait évité le retour : aucune ; le gabarit ne connaît pas cette attente du fournisseur. Classe proposée : `attente-fournisseur-sur-service-inutilise`. |

## digit-ai-forge-tests et digit-ai-forge-agents — passage d'axe-core

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-14 | majeur | générique | **axe-core juge une image prise au milieu d'une transition CSS.** (1) Chaîne de dev 42686921354 du 09/11/2026, onglet dashboard : contraste de 1,53 sur un toast de 12 px, dont le fondu dure 0,25 s. (2) Affiché, le toast tient 7,16:1 (blanc sur #006628, calculé). (3) Le même banc passait sur le poste : le résultat dépend de la vitesse de la machine. (4) Attendre la fin des animations finies (`document.getAnimations()`, en ignorant celles dont `iterations` vaut `Infinity`) rend 24 écrans sur 24 sur le poste et sur la chaîne 42688833213. Ledger seq 265. | Attendre la stabilité des animations finies avant `axe.run`, 5 s au plus, dans le pan accessibilité de forge-tests et dans `oracle-a11y`. Règle qui aurait évité le retour : aucune ; les bancs axe ne prévoient pas l'attente. |

## Factory (pilot) — remise d'un lot au sas

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-58 | majeur | générique | **Un lot part au sas alors que son contrôle rend FAIL, pour la 2e fois sur ce produit.** (1) Le 09/11/2026 à 21:14, la copie du lot 20261109b au sas a été jouée dans la même commande que `oracle-lot.mjs`, qui rendait FAIL (R-45, GFP-LOT, LOT-SIDECAR). (2) Le même enchaînement avait laissé partir un lot en échec le 04/11/2026 (ledger seq 175). (3) Aucun geste outillé ne lie la copie au verdict : la remise est un `cp` écrit à la main. Ledger seq 267. | Une barrière : un script de remise qui joue `oracle-lot` et ne copie qu'à l'exit 0, ou un hook qui refuse une copie vers `_arrivee` d'un lot dont le dernier verdict est FAIL. Règle qui aurait évité le retour : aucune barrière n'existe, seule la consigne écrite. Classe proposée : `remise-sans-verdict`. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Le clonage superficiel de la tâche de page, qui privait le test de version de ses étiquettes, est un raccord manqué entre 2 lots de ce produit : corrigé au produit (`5fa5d16`). Généralisable : non, la consigne des lots ne nommait pas ce raccord.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause : les écarts sont dans une chaîne et dans un banc de tests.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : l'attente du fournisseur Supabase est décrite par RU-13, sans identifiant GFP confirmé au registre.

## Confirmations positives

- Les jetons de compte Cloudflare se créent par l'API (`POST /accounts/{id}/tokens`) avec un jeton utilisateur qui lit les groupes de permissions : la séparation des jetons n'a demandé aucun geste humain.
- `ranger-secret.mjs` a rangé la clé privée de sauvegarde et le mot de passe de la qualification sans les afficher, et a consigné leur empreinte.

## Ordre recommandé

1. RT-58 : 2e occurrence, il demande une barrière.
2. RU-13 : il bloquera la prochaine qualification de ce produit.
3. RU-14 : il fait échouer au hasard tout banc axe sur une page animée.
