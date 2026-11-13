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

## Une recette qui consomme un état borné dans le temps se rejoue (TF-2438, 12/11/2026)

**Le fait.** Le 10/11/2026 à 22:28 UTC, la recette d'un produit sur sa base de recette a rendu deux contrôles
en échec (429 `budget_exceeded`). La recette de 15:47 UTC avait consommé le budget d'un client de test, 90 jetons
sur 24 heures glissantes, et cette base garde son état d'un passage à l'autre. La commande `make test` repart
d'une base vide : elle rendait PASS. Il a fallu lire une recette rouge et la disculper, et le rejeu a été reporté au lendemain.

**La règle.** Une recette qui consomme un état borné dans le temps (budget, quota, limite de débit, plafond sur
une fenêtre) prend l'un des deux partis, écrit dans son propre fichier :

1. elle crée son état à chaque passage, un client, un compte ou un jeton neuf nommé du passage :
   `Rejeu : état créé à chaque passage` ;
2. ou elle déclare sa période de rejeu, le temps avant lequel un second passage sur la même base n'est pas jugé :
   `Rejeu : période 24 h` (nombre et unité s, min, h ou j).

**Le contrôle.** `node oracles\oracle-recette-rejouable.mjs <fichier ou dossier de recette>` refuse un fichier de
recette qui nomme un état borné sans l'une de ces 2 lignes (RJ1) et une ligne qui ne dit rien (RJ2). Sa recette est
`--self-test`, 18 cas : la recette fautive rend FAIL avec les 2 remèdes, chaque remède joué rend PASS. Il lit, il ne
joue rien. Appelant du pilot (TF-2466, 13/11/2026) : l'étape 5 de `references\ETAPES-RUN.md` prescrit la commande sur la
racine du produit, et 5 cas du `--self-test` la lisent dans ce document puis la jouent telle qu'écrite (exit 1, 0 et 2).
Appelant de forge-tests : l'audit de recette d'un produit, toujours ouvert au registre (TF-2438).

**Non jugé.** Que la déclaration soit vraie : « état créé à chaque passage » se prouve par un second passage sur la
même base, que seule la recette de forge-tests peut jouer. Une recette qui consomme un état borné sans le vocabulaire
du contrôle n'est pas vue. Le code du produit n'est pas une recette et n'est pas jugé.
