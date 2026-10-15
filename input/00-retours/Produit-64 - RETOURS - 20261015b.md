# Lot de retours — Produit-64 → pilot (remisage git nu dans un arbre de travail lié) — 2026-10-15, indice b

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire le hook PreToolUse des produits (`forge/hooks/factory.mjs`).

**Origine** : session de conversation du 15/10/2026, vers 09:47 (heure de Paris), enregistrement d'un travail sur `main` depuis un arbre de travail lié.

Ce lot porte **1 retour** (RT-59).

- **Contexte** : une session de conversation de ce produit, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-15** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (hook PreToolUse des produits)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-59 | majeur | générique | **Un `git stash` nu a été joué dans un arbre de travail lié, alors que la pile de remisage est partagée par tous les arbres et toutes les sessions.** Glissé en fin d'une commande composée, il a remisé la ligne de registre préparée pour `main` (entrée `a75a6249…`, « WIP on main »). Récupéré dans le tour : `git stash apply <sha>`, puis `drop` de l'entrée retrouvée par son SHA ; pile revenue à 0 entrée, et aucune entrée d'autrui n'était présente. Avec une autre session active, un `pop` voisin aurait pu prendre ce travail, ou ce `stash` aurait pu mêler des remisages. Aucun hook ne l'a arrêté, alors que le harnais rappelle la consigne dès l'entrée dans l'arbre de travail. | Le hook PreToolUse refuse `git stash` nu, `git stash pop` et `git stash` sans `-m` ; il laisse passer `git stash push -u -m <étiquette>`, `apply <sha>` et `list`. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-59** : classe à créer `remisage-partage-sans-garde` (famille `hook-ou-gate`) — la consigne existe en prose (rappel du harnais, mémoire « Fusion et session concurrente »), mais aucun hook ne l'applique.

## Rattachement

Registre interrogé le 15/10/2026 (`todo/TODO.jsonl`, recherche « stash ») : TF-1008 traite le remisage comme vecteur d'une histoire réécrite, et aucun item ne garde le remisage partagé entre arbres de travail.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Remisage nu dans l'arbre de travail | réappliqué par SHA, entrée supprimée, pile vérifiée à 0 | oui | proposé au pilot en RT-59 |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.
