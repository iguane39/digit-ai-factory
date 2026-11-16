# Retours forges — Produit-84 — 20261113c

- **Contexte** : le 13/11/2026 à 14:31, la session `4c9a6f46` lance le tir des sondes actives du lot 3 de Produit-86 sur l'API de Produit-84-dev, sur consigne du porteur, par oracle-dast 0.3.1 de forge-websec.
- **Références ledger** : `forge\ledger.jsonl` seq 324.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-13
- **Complétude** : 1 entrée `type: retour` écrite par cette session après le lot 20261113b (seq 324), relue le 13/11/2026 dans `forge\ledger.jsonl`.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Un balayage actif qui n'explore rien** est jugé PASS : l'oracle ne distingue pas « aucune alerte » de « aucune requête jugée ».

## digit-ai-forge-websec — oracle-dast

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-25 | majeur | générique | **PASS sur un rapport ZAP vide.** (1) oracle-dast 0.3.1, mode actif, forme rapide (`zap.bat -quickurl`), cible `https://yrwddyfohpmsdopqyhzm.supabase.co`, débit 0,166 requête/s, délai déduit 106 min. (2) ZAP termine en 60 s (14:31:26 à 14:32:26), code 0 ; son rapport compte 0 site et 0 alerte ; `zap.log` ne montre ni exploration ni attaque. (3) La racine de l'API rend 404 sans lien : rien à explorer. (4) Le verdict dit PASS, « aucune alerte au-delà des seuils appliqués », avec `sites: 0`. Importé chez Produit-86, il aurait clos le lot 3 en campagne réussie à 0 constat. | Refuser le PASS quand le rapport compte 0 site, ou moins de requêtes qu'un seuil : SKIP « rien exploré ». Pour une API, partir de sa définition OpenAPI (`-openapiurl`, `/rest/v1/` avec l'en-tête d'accès) plutôt que de la racine. Règle qui aurait évité le retour : aucune. Classe proposée : `pass-sur-balayage-vide`, famille `hook-ou-gate`. |

## Rattachement

Registre non interrogé dans ce tour : le rattachement se fait à l'accueil du lot, par le pilot.

## Remarques restées au produit

- Le rapport vide n'est pas importé chez Produit-86, et sa session en est prévenue. Généralisable : non, c'est un geste propre à cette campagne.

## Retours sur les documents produits

- Aucun document produit depuis un gabarit `gd-…` du pilot n'est en cause.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : le retour porte sur un oracle de forge-websec.

## Confirmations positives

- TF-2485 tient : `zap.bat` part sous Windows avec Node 24, et le délai suit le débit du mandat (TF-2486).
- La clé passe en tube et ne sort pas du verdict : `valeur` y est « (masquée) ».

## Ordre recommandé

1. RU-25 : chaque balayage d'une API dont la racine ne mène nulle part le reproduit.
