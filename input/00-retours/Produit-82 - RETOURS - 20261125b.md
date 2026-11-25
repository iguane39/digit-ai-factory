# Retours forges — Produit-82 — 20261125b

- **Contexte** : deux directions visuelles du portail sont demandées à Codex et à Gemini par le skill `delegue-a-codex-et-gemini`. Une autre session du produit travaille en même temps sur la page Conversation. Le travail est hors étape de run.
- **Références ledger** : `forge\ledger.jsonl` seq 322, 323
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-25

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Pilot, hook de fin de tour

Le retour porte sur l'attribution des retours du ledger quand deux sessions vivantes partagent le même produit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-49 | mineur | générique | Le 25/11/2026, le hook `restitution` a refusé la fin de tour de la session `0217f622`, au motif « le tour a écrit 1 retour (seq 315) ». Ce retour porte pourtant `"session": "bd73a5f6"`, l'autre session vivante du produit (`forge/sessions.jsonl`). Compiler le lot depuis la session refusée l'aurait remis en double (ledger seq 322). | Le hook ne compte qu'un retour dont le champ `session` est celui du tour jugé. |

## Forge agents, skill delegue-a-codex-et-gemini

Le retour porte sur le verdict du lanceur quand l'agent tiers dépasse son délai après avoir écrit ses livrables.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-50 | mineur | générique | Le 25/11/2026, Antigravity a écrit `maquette.html` (168 796 octets) et `DIRECTION.md` à 09:24. Sa propre vérification Playwright a ensuite dépassé le délai de 20 minutes (`print_timeout`). Le lanceur `concevoir` a rendu FAIL avec le code 1, alors que `fichiers_ecrits` listait les 2 livrables complets (ledger seq 323). | Si le délai est atteint et que les livrables demandés existent, le lanceur rend un verdict distinct (`PARTIEL`) qui nomme les fichiers. La consigne du geste `concevoir` borne aussi la vérification que l'agent se donne. |

## Remarques restées au produit

Aucune remarque n'est restée au produit : les 2 retours de ce lot visent le pilot et la forge agents.

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Les 2 agents tiers ont rendu chacun une maquette des 6 écrans demandés sans aucune ressource réseau. Aucune n'a de débordement horizontal à 1920 ni à 390 px.

## Ordre recommandé

1. RT-50 : un FAIL sur un livrable complet pousse à refaire un geste de 20 minutes.
2. RT-49 : le faux refus ne coûte qu'un tour, mais il invite à remettre un lot en double.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. Pour RT-50, la règle est qu'un verdict de lanceur juge les livrables écrits avant l'état du processus. Pour RT-49, la règle est qu'un contrôle de fin de tour ne juge que les écritures du tour.
