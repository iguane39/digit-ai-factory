# Retours forges — factory-digit-ai-fr — 20261114h

- **Contexte** : revue L99 en boucle d'un amendement du run `forge-digit-ai-fr-20261114a`, 14/11/2026. Un agent `verificateur`, lancé pour une vérification en lecture seule, a écrit une entrée au ledger du run.
- **Références ledger** : forge/ledger.jsonl seq 84 (l'entrée parasite) et seq 85 (le retour).
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le vérificateur devait dire si une correction de prompt fermait 8 défauts, sans rien modifier. Pour tester l'usage de l'écrivain du ledger, il a lancé `python forge/ledger.py oracles_verdict --etape x`. L'entrée 84 est entrée au ledger. L'agent l'a déclaré lui-même dans son rapport. L'orchestrateur l'a neutralisée par le retour 85, faute d'un type de rectification qui annule une entrée.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-7 : un agent en lecture seule peut écrire au ledger en testant son écrivain.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-7 | **majeur** | générique | **Un agent `verificateur`, censé ne rien modifier, a écrit l'entrée 84 au ledger du run en testant `ledger.py`.** Preuve : `forge/ledger.jsonl` seq 84 (`{"type": "oracles_verdict", "etape": "x"}`, 2026-11-14T11:50:18Z) ; rapport final de l'agent (« Je n'ai pas respecté la lecture seule »). L'écrivain n'a pas de mode d'essai. Aucun des 4 types de rectification admis ne neutralise une entrée. | Ajouter à `ledger.py` et `ledger.mjs` un mode d'essai qui affiche l'entrée sans l'écrire. Interdire au `verificateur` l'exécution des écrivains (ledger, réservation des décisions). Créer un type `rectification_entree_parasite`, qui neutralise une entrée sans la supprimer. |

## La règle qui aurait évité le retour

RP-7 : aucune règle ne protège le ledger des agents lancés par la session. Le principe « écrivain unique : l'orchestrateur de session » est écrit en tête de `ledger.py`, mais rien ne le fait respecter. Classe à créer : `agent-lecture-seule-ecrit-au-ledger`, famille `tracabilite-ledger`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
