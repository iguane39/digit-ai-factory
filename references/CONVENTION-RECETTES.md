# Convention de nommage des recettes de contrôle

Référence du pilot, 14/09/2026 (TF-1084, reste de TF-0650). Elle s'adresse à qui écrit ou relit un
contrôle du pilot (`oracle-*`, `verifier-*`, `check-*`, `hook-*`) et doit savoir, sans chercher,
où vit la recette qui le prouve dans les deux sens.

## La règle

Un contrôle a sa recette à double sens sous UNE de deux formes, et sous aucune autre :

1. **un fichier sœur** `<nom du contrôle>.test.mjs`, dans le même dossier ;
2. **un autotest interne**, joué par `node <contrôle>.mjs --self-test`.

Toute autre forme est une **exception déclarée** : son couple contrôle → recette est inscrit dans la
table `DEDIES` de `oracles\self-tests.mjs`, avec le motif qui empêche la forme ordinaire. Une
exception non déclarée se lit comme une recette absente.

## Pourquoi une convention unique

N-37 (`references\REGLES-DE-NON-REPETITION.md`) a mesuré qu'un contrôle indirect — « la recette de
l'oracle prouve-t-elle une borne ? » — classait `oracle-conformite-projet` sans borne alors que sa
recette en porte une : ce fichier ne suivait pas la convention des autres. Une sonde bâtie sur des
noms divergents mesure l'écart à son auteur, pas la conformité. La convention rend ce contrôle
mécanisable.

## État mesuré le 14/09/2026

Mesure sur les 46 contrôles `oracle-*`, `verifier-*` et `check-*` des dossiers `oracles\`,
`scripts\`, `gabarits\` et `todo\` :

| Forme | Contrôles |
|---|---|
| fichier sœur `.test.mjs` | 9 |
| autotest interne `--self-test` | 33 |
| exception déclarée dans `DEDIES` | 2 : `oracle-conformite-projet` → `oracles\self-test.mjs` ; `oracle-ecosysteme` → `oracles\self-test-ecosysteme.mjs` |
| hors convention, non déclarée | 2 : `todo\oracle-todo.mjs` (recette `todo\self-test.mjs`, historique) ; `scripts\verifier-rendu-instances.mjs` (appelé par `oracle-gabarits-documents`, sans recette à double sens identifiable) |

Les deux derniers sont des restes : le premier se déclare ou se renomme, le second reçoit sa recette.
