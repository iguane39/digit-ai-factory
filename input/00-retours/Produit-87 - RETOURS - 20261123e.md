# Retours forges — Produit-87 — 20261123e

- **Contexte** : autre — création des branches d'environnement `env/dev` et `env/uat` de Prism selon le projet commun Client-A, hors run.
- **Références ledger** : sans objet, aucun run ouvert.
- **Références hors run** : `forge/hors-run.jsonl` seq 9 (entrée `type: retour`, TF-2260).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>\input\00-retours\_arrivee\` par `node forge\retours\oracle-lot.mjs "<ce fichier>.md" --remettre`.
- **Statut** : remis le 2026-11-23

Ce lot porte **1 retour** : un geste qui protège une branche a été refusé comme un geste destructif.

## digit-ai-factory (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-8 | mineur | générique | **La création d'une politique de protection de branche est refusée comme un geste distant destructif.** Le 23/11/2026, la session a voulu protéger `env/dev` et `env/uat` de Prism par 4 validations de build bloquantes (`az repos policy build create`), comme l'exige la règle `GDE0103-R05` du projet commun Client-A. Le hook `gestes-distants` a refusé avec ce motif : « `az repos policy build create` attribue ou modifie des droits ». Le geste ne détruit rien : il ferme les poussées directes et se retire en une commande (`az repos policy delete`). Le refus a reporté une protection obligatoire à une décision du porteur (D-6). Le garde-fou a joué selon sa lettre ; c'est sa liste qui range une protection parmi les destructions. | Distinguer dans la liste fermée de `references/GESTES-DISTANTS.md` les gestes qui ajoutent une protection (création de politique de branche, verrouillage) de ceux qui la retirent (`policy delete`, `ref unlock`) ou qui attribuent des droits : les premiers passent, ou passent avec une simple trace ; les seconds restent soumis au lot approuvé. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-8** : un garde-fou contre les gestes destructifs juge l'effet du geste, pas la famille de sa commande. Ajouter une protection n'est pas une destruction.

## Rattachement

Registre interrogé le 23/11/2026 dans `todo/CLASSES.json` du pilot, par les mots « geste », « destructif », « distant », « branche » et « politique ». La plus proche, `regle-de-branche-annoncee-differente-configuree`, vise l'écart entre la règle de branche annoncée et celle qui est configurée, pas le classement d'un geste. Classe proposée : `geste-protecteur-classe-destructif`.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Protection de `env/dev` et `env/uat` non posée | décision D-6 posée au porteur, avec commandes, effets et retours arrière | oui | remonté en RT-8 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot : le geste porte sur la configuration du dépôt Azure DevOps de Prism.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le hook a donné un remède complet et applicable : une décision groupée, puis un lot de gestes approuvés valable 24 h.

## Ordre recommandé

1. **RT-8** : une ligne de plus dans la liste fermée, et les protections exigées par un référentiel ne passent plus par une décision.
