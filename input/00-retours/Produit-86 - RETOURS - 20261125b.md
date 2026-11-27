# Retours forges — Produit-86 — 20261125b

- **Contexte** : run `20261125b-definition-openapi-api-cdc`, définition OpenAPI de l'API de Produit-84 pour le lot 3, jugée par oracle-dast 0.5.0 avec un ZAP simulé.
- **Références ledger** : `forge\ledger.jsonl` seq 1045 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Aucun retour de ce lot ne vise une forge : le registre `todo/CLASSES.json` du pilot n'est pas sollicité.

## La règle qui aurait évité le retour

Aucune : le garde-fou a joué son rôle, et son message donnait le remède.

## Remarques restées au produit

| Réf. ledger | Gravité | Remarque | Motif du maintien au produit |
|---|---|---|---|
| seq 1045 | mineur | Le 25/11/2026 vers 16:29, le hook garde-rm-variable a refusé avant exécution `rm -f` d'un fichier de trace du ZAP simulé, dont la cible passait par une variable (dossier du scratchpad). La commande a été relancée sans suppression, la trace se créant à neuf ; aucun effet perdu. | Garde-fou conforme : 1 refus, 0 relance après réécriture, aucune proposition à la Factory. Généralisable : non. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261109b, 20261112e, 20261112f et 20261125a) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : le refus vient d'un hook du poste, qui a fonctionné.

## Confirmations positives

- Le hook garde-rm-variable a arrêté une suppression à cible variable et a donné, dans son message, la réécriture qui a suffi.
- oracle-dast 0.5.0 a refusé, avant tout lancement, une copie de la définition qui visait une fonction exclue du mandat (`DAST-OPENAPI-HORS-PERIMETRE`) : le garde-fou de TF-2853 tient sur une cible réelle de mandat.
