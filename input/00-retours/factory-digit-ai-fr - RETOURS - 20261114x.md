# Retours forges — factory-digit-ai-fr — 20261114x

- **Contexte** : arrêt de la session `claude -p` lancée au pilot depuis ce produit (exécution du prompt de coordination des sessions, action A-2), et ouverture d'une session interactive pour le mandat de construction (A-10).
- **Références ledger** : forge/ledger.jsonl seq 182.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

La tâche d'arrière-plan qui portait la session `claude -p` a été déclarée arrêtée à 17:46. Le processus de la session, lui, tournait encore à 18:15, et sa transcription s'écrivait à 18:10. Le lot `20261114u` (RP-24) dit « arrêtée à la main à 17:46 » : ce lot le corrige, l'arrêt réel date de 18:15:38.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-31 : arrêter la tâche qui a lancé une session sans interface ne termine pas cette session.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-31 | **majeur** | générique | **L'arrêt d'une tâche d'arrière-plan laisse tourner la session `claude -p` qu'elle a lancée.** L'outil d'arrêt a déclaré la tâche arrêtée à 17:46. À 18:15, `Get-CimInstance Win32_Process` montrait encore le processus 6972 (démarré à 16:52:12), et la transcription `0e40d4f5` avait été écrite à 18:10:11. Il a fallu `Stop-Process` sur ce processus et ses 3 enfants. | Toute consigne qui lance une session `claude -p` en arrière-plan en relève le numéro de processus, et son arrêt se vérifie par la liste des processus, pas par le statut de la tâche. |

## La règle qui aurait évité le retour

RP-31 : aucune règle ne dit comment arrêter et vérifier l'arrêt d'une session enfant sous Windows. Classe à créer : `arret-de-tache-sans-arret-du-processus-enfant`, famille `hook-ou-gate`.

## Remarques restées au produit

- La mention « arrêtée à la main à 17:46 » du lot `20261114u` est fausse ; ce lot la corrige, car un lot remis ne se modifie plus. Généralisable : non.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
