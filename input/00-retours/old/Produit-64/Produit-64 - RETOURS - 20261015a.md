# Lot de retours — Produit-64 → pilot (geste du produit réattribué à la factory) — 2026-10-15, indice a

> **Note de réception du pilot (15/10/2026, R-49)** : RT-58 renuméroté RT-69 : RT-58 était déjà défini par le lot 20261012b, et les lots 20261015b à 20261015g du même jour portent RT-59 à RT-68.

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire la conduite de session et `gabarits/RESTITUTION.md` (bloc 3).

**Origine** : session de conversation du 15/10/2026, vers 09:17 (heure de Paris), question de l'humain sur la mise à jour du projet commun dans les produits Client-A.

Ce lot porte **1 retour** (RT-69).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-15** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (conduite de session, `gabarits/RESTITUTION.md`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-69 | mineur | générique | **Une question « peut-on le faire comme X ? » est devenue « demander à X de le faire ».** L'humain demandait si le projet commun pouvait reproduire, chez les produits Client-A, le tirage automatique que la factory fait à l'ouverture de session. La restitution de 09:17 a recommandé, en option (a) de D-2, un lot de retours à la factory, et a déclaré l'inscription directe « exclue ». Réponse de l'humain : « Je n'ai pas dit de le demander à la Factory ». Le geste était réalisable par le produit lui-même, avec un hook d'ouverture et un script dans le projet commun, sans rien changer à la factory. | Avant de recommander une remontée, vérifier que le geste ne peut pas être fait par le produit lui-même avec le même principe ; une question « comme X » se lit comme une demande d'imitation, pas comme une délégation à X. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-69** : classe `processus-du-commanditaire-reattribue` — récidive de TF-1518 : le geste est réattribué à un autre acteur que celui que l'humain avait désigné, ici la factory au lieu du produit.

## Rattachement

Registre interrogé le 15/10/2026 (`todo/TODO.jsonl`, recherche « TF-1518 ») : TF-1518 est décidé le 01/10 (option (a) de D-42). Ce retour en est une récidive, sur un autre motif (une délégation à la factory plutôt qu'à une chaîne).

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Recommandation tournée vers la factory | corrigée dans le tour suivant : mécanisme porté par le projet commun lui-même | oui | proposé au pilot en RT-69 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.
