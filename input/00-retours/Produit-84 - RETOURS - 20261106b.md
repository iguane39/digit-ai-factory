# Retours forges — Produit-84 — 20261106b

- **Contexte** : le 06/11/2026, le porteur demande pourquoi l'en-tête du rapport d'audit, en forme POC-to-Prod, porte autant de cartes, alors que le rapport modèle de cette forme n'en porte pas autant.
- **Références ledger** : `forge\ledger.jsonl` seq 235.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-06
- **Complétude** : 1 entrée `type: retour` écrite depuis le lot 20261106a (seq 235), relue le 06/11/2026 à 10:46 dans `forge\ledger.jsonl` ; elle va au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le rendu b** : 17 cartes de synthèse sous le bandeau du verdict. Le rapport modèle en porte 6, sur 2 rangées. Les 3 portes de forge-audit ont rendu conforme.
- **La cause côté données** : les données avaient été écrites pour la forme « vues », où la synthèse se lit comme un tableau à deux colonnes. 17 lignes y passent ; en forme POC-to-Prod, elles font 17 cartes.
- **La correction** : l'indice c replie les 17 cartes en 6, aux intitulés du modèle. Les 17 textes se retrouvent mot pour mot dans les 6 cartes ou dans le résumé de D00. Les 3 portes de forge-audit passent toujours.

## forge-audit (`digit-ai-forge-audit`) — cartes de synthèse de la forme POC-to-Prod

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-53 | majeur | générique | **La forme POC-to-Prod rend autant de cartes de synthèse que les données en portent, et sa porte n'en juge pas la structure.** (1) `rapport-poc-to-prod.mjs` rend une carte par entrée de `syntheses`, sans borne ni liste (TF-2145). (2) Le 05/11/2026 à 11:47, `verifier-forme-rapport` rend « forme POC-to-Prod conforme — 18 contrôles (F0–F17) » sur 17 cartes. (3) Des données écrites pour la forme « vues » passent telles quelles dans la forme POC-to-Prod, devenue la forme par défaut. (4) La porte de données impose les clés `fonctionnelle`, `technique` et `audit` : l'étiquette ne peut pas dire « Synthèse Fonctionnelle » comme le modèle. Ledger seq 235. | La forme déclare ses 6 cartes et leurs étiquettes. La porte de forme refuse une carte hors de cette liste et une carte du modèle absente. Le moteur affiche l'étiquette du modèle pour les 3 clés imposées. Règle qui aurait évité le retour : aucune ; la forme ne fixe pas ses cartes. |

## Rattachement

Registre interrogé le 06/11/2026 au pilot, `todo/TODO.jsonl`, sur « cartes de synthèse » et « syntheses » :

- TF-2145 : le moteur reprend le texte des cartes sans le réécrire, une carte par entrée ;
- TF-2138 : les portes rendaient diffusable un rapport qui ne remplissait pas son gabarit.

Items recoupés : TF-2145, TF-2138.

## Remarques restées au produit

- Les données de l'audit portaient 14 cartes de trop : écrites pour l'ancienne forme, elles n'ont pas été reprises au passage à la nouvelle. Corrigé dans le tour, indice c. Généralisable : oui, par la forme, d'où RT-53.

## Retours sur les documents produits

- `gd-rapport-audit` : la forme POC-to-Prod ne déclare pas ses cartes de synthèse ; voir RT-53.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : l'écart est dans la forme du rapport.

## Confirmations positives

- Le moteur a rendu les 6 cartes du modèle sans retouche, dès que les données les portaient : la grille passe seule à 2 rangées de 3.

## Ordre recommandé

1. RT-53 : seul retour du lot ; chaque audit rendu en forme POC-to-Prod peut reprendre l'écart.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-53 : aucune ; la forme POC-to-Prod ne fixe ni le nombre ni les intitulés de ses cartes.
