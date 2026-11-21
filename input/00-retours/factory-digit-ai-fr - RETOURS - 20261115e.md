# Retours forges — factory-digit-ai-fr — 20261115e

- **Contexte** : run `forge-digit-ai-fr-20261114a`. Deux sessions travaillent sur le même produit, et le contrôle de lot du hook de fin de tour bloque une session sur le retour de l'autre.
- **Références ledger** : forge/ledger.jsonl seq 223 ; la seq 218 est citée pour mémoire. C'est un retour de l'autre session, dont le lot revient à cette session-là : il n'est pas repris ici comme candidat.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Pendant un tour de cette session, l'autre session a écrit au ledger du produit un retour, l'entrée 218, sur son test d'anonymisation. Le contrôle LOT du hook de fin de tour l'a attribué au tour de cette session, et il en a bloqué la restitution. Compiler ce retour ici l'aurait remis 2 fois au pilot.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-44 : le contrôle de lot attribue à une session les retours d'une autre.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-44 | **majeur** | générique | **Le contrôle LOT du hook de fin de tour bloque une session sur un retour écrit par une autre session sur le même produit.** L'entrée 218 du ledger, écrite par l'autre session à 08:25, se trouve entre les entrées 217 et 219 de cette session. Le préjugé de la restitution rend : LOT FAIL bloquant, retours ['seq 218'], via transcription et ledger. | Attribuer chaque retour du ledger à sa session par un identifiant de session écrit par `ledger.py`. Ne bloquer un tour que sur ses propres retours. |

## La règle qui aurait évité le retour

RP-44 : le contrôle suppose une seule session par produit. Classe : `hook-ou-gate`.

## Remarques restées au produit

- Aucune remarque n'est restée au produit. La coordination des sessions fait l'objet de la décision D-218 de l'autre session.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
