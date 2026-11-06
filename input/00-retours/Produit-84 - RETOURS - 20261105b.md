# Retours forges — Produit-84 — 20261105b

- **Contexte** : actions A-1 et A-2 du porteur, le 05/11/2026 : l'audit du 04/11 est régénéré dans la forme POC-to-Prod (forge-audit `cbe658e`), et les contradictions de la porte du client sont remontées à son projet commun.
- **Références ledger** : `forge\ledger.jsonl` seq 207.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-05
- **Complétude** : 1 entrée `type: retour` écrite depuis le lot 20261105a (seq 207), relue le 05/11/2026 à 11:53 dans `forge\ledger.jsonl` ; elle va au sidecar.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Le rapport** : les données de l'audit sont corrigées, et le rapport est rendu en version `20261104b`. Les 3 portes de forge-audit passent : données, forme, et rendu avec les oracles de design.
- **Le contrôle des livrables** : `mobiliser --verifier` rend MANQUE pour la forge audit. Il a jugé le `rapport-data.json` du 30/10, pas celui écrit ce jour.
- **Une erreur de la session** : la trace de mobilisation a été écrite en fin de tour (10:51Z), après le livrable (10:47Z). Ce livrable aurait donc été jugé périmé de toute façon. Cette erreur est de la session, pas de la Factory, et n'est pas remontée.

## Factory (`digit-ai-factory`) — contrôle des livrables de la mobilisation

1 retour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-47 | majeur | générique | **`mobiliser --verifier` juge la fraîcheur du premier fichier qui répond au motif, pas du plus récent.** (1) `trouver()` (`oracles/lib-mobilisation.mjs`, ligne 343) rend la première entrée du listage. (2) Pour `forge/audit/*/rapport-data.json`, c'est `forge/audit/20261030/rapport-data.json`, écrit le 30/10. Or `forge/audit/20261104/rapport-data.json` a été écrit le 05/11 à 10:47Z. (3) Mesure du 05/11/2026 à 10:51Z : verdict MANQUE, `trouve` sur le fichier du 30/10, `perime: true`. (4) Tout produit qui a deux dossiers datés pour un même livrable reçoit MANQUE pour toujours. Le défaut vient de la correction TF-2136 (`52f7c937` du 04/11). Ledger seq 207. | Parmi les fichiers qui répondent au motif, retenir celui dont l'heure d'écriture est la plus récente. Éprouver le contrôle sur deux dossiers datés, le plus ancien périmé et le plus récent frais. Règle qui aurait évité le retour : aucune ; la correction TF-2136 n'a pas été éprouvée sur deux dossiers. |

## Rattachement

Registre interrogé le 05/11/2026 au pilot, `todo/TODO.jsonl`, sur « lib-mobilisation », « mobiliser --verifier », « plus récent » et « premier fichier » :

- TF-2136, clos le 04/11 en `corrige` : sa correction a introduit ce défaut ;
- TF-2080 et TF-2045 : autres corrections du même contrôle, sans rapport avec le choix du fichier.

Items recoupés : TF-2136.

## Remarques restées au produit

- La trace de mobilisation a été écrite après le travail. C'est une erreur de la session, et le contrôle la refuse à juste titre. Généralisable : non.
- La porte du client contredit forge-audit sur 4 points. Ces contradictions relèvent du projet commun du client, et lui ont été remontées par son propre canal (lot `CDC_ControlDeCostes - RETOURS - 20261105a`, branche de retours du dépôt du projet commun). Généralisable : non pour la Factory.

## Retours sur les documents produits

- `gd-rapport-audit` : aucun écart nouveau ; la forme POC-to-Prod a rendu un audit réel sans retouche du moteur.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : le défaut est dans un contrôle de la Factory.

## Confirmations positives

- La porte de données de forge-audit a désigné les 5 défauts de la donnée, chacun avec le champ à remplir. Une passe de correction a suffi, plus un rapprochement de deux actions demandé par la porte de forme.

## Ordre recommandé

1. RT-47 : seul retour du lot ; il fausse le contrôle « livré » de tout audit refait.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-47 : aucune ; la correction TF-2136 n'a pas été éprouvée sur deux dossiers datés.
