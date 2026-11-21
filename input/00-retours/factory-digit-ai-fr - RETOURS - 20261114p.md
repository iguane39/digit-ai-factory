# Retours forges — factory-digit-ai-fr — 20261114p

- **Contexte** : revue L99 du prompt du porteur sur la coordination des sessions multiples d'un même projet, hors étape du run `forge-digit-ai-fr-20261114a`.
- **Références ledger** : forge/ledger.jsonl seq 142.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le porteur a vu plusieurs sessions écrire dans les mêmes fichiers du produit sans savoir qui faisait quoi. Le relevé de 16:27 le 14/11/2026 le confirme :

- 5 sessions étaient ouvertes sur la racine du produit, dont 2 actives : le run v2 du produit, et un chantier d'amélioration de la Factory mené depuis la racine du produit ;
- aucune des 141 lignes du ledger ne porte d'identifiant de session ;
- deux livrables de radical distinct portent le même indice `20261114g` dans `output/`, écrits à 14:17 et 15:38 ;
- le registre `forge/gestes-en-cours.jsonl` est absent du produit.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-16 : rien ne dit quelle session a écrit quoi dans un produit, ni ne coordonne les sessions d'une même racine.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-16 | **majeur** | générique | **Les sessions d'un même produit écrivent ses fichiers communs sans identité ni annonce de prise.** Preuve : `ListAgents` à 16:27 (5 sessions sur la racine, 2 actives) ; `grep -c '"session"' forge/ledger.jsonl` rend 0 sur 141 lignes ; `ls -l output/*20261114g*` montre deux livrables à indice commun (R-4 enfreinte). Le porteur ne peut pas dire qui travaille sur quoi, ni pourquoi les sessions se recoupent. | Faire exécuter au pilot le prompt réécrit de la revue `output/forge-digit-ai-fr - Revue - Prompt coordination des sessions multiples passé au crible L99 - 20261114i.md` : diagnostic des sessions, étude d'opportunité sur une coordination avec élection d'une session coordinatrice aux pouvoirs bornés, puis décision humaine. |

## La règle qui aurait évité le retour

RP-16 : aucune règle n'impose qu'une ligne du ledger ou un livrable porte la session qui l'écrit, ni qu'un chantier de la Factory s'ouvre au pilot plutôt qu'à la racine d'un produit. Classe à créer : `sessions-concurrentes-meme-produit-sans-identite`, famille `tracabilite-ledger`. L'entrée 142 du ledger proposait la famille `coordination-sessions`, absente du registre du pilot : le lot la corrige. Classes voisines, qui ne recouvrent pas ce retour : `trace-de-mobilisation-partagee-entre-sessions` (TF-2045, mobilisation seule) et `perimetre-de-session-confondu` (TF-2103, juge de fin de tour).

## Remarques restées au produit

- La collision d'indice `20261114g` dans `output/` reste à résoudre au produit, par réindexation du plus récent. Généralisable : oui, par RP-16.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
