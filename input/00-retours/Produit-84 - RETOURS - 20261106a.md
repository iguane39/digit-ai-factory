# Retours forges — Produit-84 — 20261106a

- **Contexte** : le 06/11/2026, le porteur demande pourquoi le rapport d'audit régénéré la veille (indice b, forme POC-to-Prod) n'est pas dans le dossier `output\` du produit.
- **Références ledger** : `forge\ledger.jsonl` seq 234.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-06
- **Complétude** : 1 entrée `type: retour` écrite depuis le lot 20261105c (seq 234), relue le 06/11/2026 à 10:21 dans `forge\ledger.jsonl` ; elle va au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le rendu** : le 05/11, forge-audit a rendu le rapport `20261104b` dans l'espace d'audit `forge\audit\20261104\output\`. Ses 3 portes ont passé.
- **La livraison** : la session n'a pas recopié le rendu dans `output\05-audits\`, qui gardait l'indice a. Le README de ce dossier prévoit la copie à l'identique, mais aucun contrôle ne la vérifie.
- **La correction** : le porteur a relevé l'écart le 06/11. La session a copié l'indice b (empreintes identiques) et rangé l'indice a sous `old\`.

## forge-audit (`digit-ai-forge-audit`) — dépôt du rapport dans le produit

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-52 | majeur | générique | **Le rapport rendu par forge-audit reste dans l'espace d'audit, hors du dossier des livrables du produit.** (1) `build-rapport.mjs` écrit sous `forge\audit\<date>\output\`. La règle R-2 range les livrables sous `output\`. (2) Le 05/11/2026 à 11:47, le rapport `20261104b` est rendu ; `output\05-audits\` garde `20261104a` jusqu'au 06/11 à 10:15. (3) forge-tests porte déjà ce dépôt (`--copie-output`, TF-1808) ; forge-audit n'a pas d'équivalent. (4) Aucune porte ne compare la copie sous `output\` au dernier rendu : le retard ne se voit que si un humain le cherche. Ledger seq 234. | `build-rapport.mjs --copie-output <dossier>` dépose le rendu, ses sidecars, et range l'indice précédent sous `old\`. Un contrôle refuse un `output\` en retard sur l'espace d'audit. Règle qui aurait évité le retour : aucune ; la copie est un geste de session sans contrôle. |

## Rattachement

Registre interrogé le 06/11/2026 au pilot, `todo/TODO.jsonl`, sur « copie-output », « espace d'audit » et « output » :

- TF-1808, clos en `corrige` : le même dépôt pour forge-tests ;
- classe `emplacement-livrable-hors-convention` du registre `todo/CLASSES.json`.

Items recoupés : TF-1808.

## Remarques restées au produit

- La copie oubliée le 05/11 est une erreur de la session, corrigée dans le tour. Généralisable : oui, par l'outil, d'où RT-52.
- Le rôle du README de `output\05-audits\` portait deux chemins abîmés : des antislashs changés en caractères de contrôle par un heredoc. C'est la leçon L-001, déjà au registre. Généralisable : non, rien de neuf.

## Retours sur les documents produits

- `gd-rapport-audit` : aucun écart sur le document ; l'écart porte sur l'endroit où il est déposé.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : l'écart est dans le dépôt du livrable.

## Confirmations positives

- Le générateur de README a désigné tout de suite le dossier `old\` neuf sans rôle rédigé.

## Ordre recommandé

1. RT-52 : seul retour du lot ; chaque audit refait peut rester hors de `output\`.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-52 : aucune ; la copie vers `output\` est un geste de session, sans outil ni contrôle.
