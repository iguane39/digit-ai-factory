# Retours forges — Produit-82 — 20261125f

- **Contexte** : déploiement de la recette du 25/11/2026 au commit `fdefb2d`, qui admet l'adresse électronique comme identifiant (EF-72, décision D-33 (b)). Le rapport de recette rend le code 1 : la campagne laisse une identité de plus qu'elle n'en a trouvé.
- **Références ledger** : `forge\ledger.jsonl` seq 356
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-25

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Remarques restées au produit

Le défaut porte sur le code du produit, corrigé dans le même tour ; aucune forge n'est visée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Suite donnée |
|---|---|---|---|---|
| RT-54 | majeur | produit | Le 25/11/2026, le décompte ENF-38 du rapport de recette au commit `fdefb2d` porte 29 identités avant la campagne et 30 après. L'identité restée, `prenom.bdf5ea@exemple.fr`, vient du nouveau test `test_ef72_connexion_par_adresse_electronique`. Le motif des objets de test (`MOTIF_OBJET_DE_TEST` de `Produit-82/scripts/comptes.py`) excluait toute adresse, pour protéger les personnes réelles : le nettoyage de campagne ne l'effaçait donc pas. La suite locale ne l'a pas vu, car elle efface tout ce qui apparaît, sans filtre de nom. Preuve : `reports/rapport-tests-railway-recette.md` de la worktree au commit `fdefb2d`. | Corrigé au commit `f249051` : une adresse n'est un objet de test que sous le domaine réservé `.test` (RFC 2606), et le test crée `prenom.<hex>@Produit-82.test`. L'identité restée est supprimée de la recette, et le décompte est revenu à 29. |

- RT-54, généralisable : oui. Un test qui crée des objets sur une instance partagée doit leur donner un nom que le nettoyage de campagne reconnaît, et ce nom se vérifie contre le motif du nettoyage dans le test lui-même ; la suite locale, qui efface sans filtre, ne le révèle pas.

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le décompte ENF-38 du rapport de recette a trahi l'identité restée dès le premier déploiement, alors que les 169 tests de la suite locale passaient.

## Ordre recommandé

1. RT-54 : chaque déploiement aurait laissé une identité de test de plus sur la recette.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle est qu'un test qui crée un objet nommé le fait sous un nom que le motif du nettoyage de campagne reconnaît, et l'affirme dans le test. Classe : `campagne-residus-instance`.
