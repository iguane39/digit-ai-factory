---
destinataire: humain
---

# Digit-AI — Note de migration : les chemins du pilot renommé — 20260818b

**TF-0367**, émise le 2026-08-18 par le pilot sur mandat humain. Réponse à l'option (a) du
retour RA-15 (lot `Produit-10 - RETOURS - 20260818a`) : « une note de migration dans le dépôt
renommé, listant les chemins que les projets consommateurs écrivent en dur ».

## Le fait

Le dépôt s'appelait `digit-ai-forge-pilot`. Il s'appelle `digit-ai-factory` depuis le
17/08/2026. **Aucune jonction de compatibilité n'a été créée** — c'était une décision assumée
de l'étude de séquencement, dont la revue du 24/08 devait mesurer le coût (son critère n°5 :
« la jonction absente a-t-elle produit une casse observée, et laquelle »).

**Réponse : oui.** Le 18/08, un projet consommateur dont le `CLAUDE.md` portait
`node <FORGE_ROOT>\digit-ai-forge-pilot\oracles\oracle-conformite-projet.mjs .` a vu la
commande échouer en « fichier introuvable ». Il a fallu lister `c:\dev` et reconnaître le dépôt
à son contenu — en écartant à la main `digit-ai-forge-pilot_old` et `digit-ai-forge-pilot_vide`,
qui subsistent tous deux et portent un `oracles\oracle-conformite-projet.mjs`
**d'apparence valide**. Celui de `_old` date du 17/08 : il aurait rendu un verdict **plausible
sous un jeu de règles périmé**, ce qui est pire qu'une erreur franche.

Précédent : à la génération précédente (`steering` → `pilot`), TF-0062 avait traité le même
problème **en s'appuyant sur une jonction** — « NE PAS la supprimer avant ce rattrapage ».

## Les chemins encore écrits en dur, relevés le 2026-08-18

| Consommateur | Occurrences | Nature |
|---|---|---|
| `digit-ai-forge-organization\CLAUDE.md` | 2 | référence au dépôt du pilot |
| `_Client-A\Produit-10\PROMPT-PRODUIT.md` | 4 | dont `digit-ai-forge-pilot/bootstrap.mjs` |
| `_Client-A\Produit-10\CLAUDE.md` | 1 | référence au dépôt du pilot |
| `_Client-A\Cockpit IA\client-a-cockpit-ia\PROMPT-PRODUIT.md` | 1 | référence au dépôt du pilot |

**Ces fichiers ne sont PAS corrigés par cette note**, et c'est volontaire : le garde-fou du
noyau interdit au pilot d'intervenir dans un produit hors d'un run demandé. Chacun se rattrape
**à son prochain run**, comme TF-0062 l'avait posé pour la génération précédente. La note
existe pour que ce rattrapage ne soit pas une redécouverte.

## Ce qui change pour l'avenir — le nom cesse d'être une information à connaître

C'est la réponse de classe, pas d'instance (option (b) du retour) :

1. **`gabarits\CLAUDE-PRODUIT.md`** prescrit désormais `<PILOT_ROOT>`, jamais le nom du dépôt,
   et donne la commande de résolution **jouable sans connaître le chemin** (elle scanne
   `$FORGE_ROOT` et reconnaît le pilot à sa signature).
2. **`oracles\resoudre-pilot.mjs`** est l'implémentation de référence, avec son `non_juge` et
   son test à 8 cas (joué par la recette du dépôt). La signature est délibérément **large** —
   `oracle-conformite-projet.mjs` **et** `todo\TODO.jsonl` **et** `todo\oracle-todo.mjs` **et**
   `REGLES-PROJET.md` **et** `CONTRAT-INTERFACE.md` — parce qu'un seul fichier aurait élu la
   copie périmée : c'est exactement ce que `_old` porte.
3. **Deux dépôts indiscernables ne se tranchent jamais en silence** : sortie en échec (exit 2)
   avec le remède nommé. Un résolveur qui choisirait au hasard entre le pilot et sa copie
   périmée serait plus dangereux que pas de résolveur — il aurait l'air de marcher.
4. **`PERIME.md`** est posé à la racine de `digit-ai-forge-pilot_old` et de
   `digit-ai-forge-pilot_vide` (option (c) du retour). Tout dépôt qui le porte s'exclut de la
   résolution, quoi qu'il porte par ailleurs. Ces fichiers sont **non committés** : ces dépôts
   sont des archives, on n'y écrit pas d'histoire.

## Pour la revue du 24/08

Son critère n°5 se joue désormais sur un **fait**, pas sur une absence de fait : la casse est
observée, datée, et son coût est nommé (une inspection manuelle, plus un risque de verdict
plausible-mais-périmé). Ce que la revue a encore à trancher n'est pas « fallait-il une
jonction ? » mais **« la réponse de classe suffit-elle, ou faut-il aussi une jonction pour les
consommateurs non encore rattrapés ? »** — quatre fichiers, listés ci-dessus.
