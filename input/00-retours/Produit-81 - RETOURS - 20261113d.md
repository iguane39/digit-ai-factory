# Retours forges — Produit-81 — 20261113d

- **Contexte** : montée React 18 sous la décision D-201 (a), avec un agent de campagne en arrière-plan, hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 40 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-21 (majeur) — La veille des agents redemande le même point de suivi à chaque fin de tour

**Le fait.** Le 13/11/2026, entre 14:20 et 14:30 environ, un agent de campagne tournait depuis plus de 15 minutes. Le hook Stop `suivi-agents` a exigé un point de suivi, et la session l'a rendu tel quel, première ligne « Suivi agents » comprise. La fin de tour suivante a déclenché la même exigence, mot pour mot : 6 fois de suite, avec une preuve de vie de l'agent à 0, 1 ou 2 minutes. Le hook dit que « la veille se réarme seule à la fin du tour » : elle se réarme dès cette fin de tour, sans délai.

**Le coût, prouvé.** 6 tours consécutifs sans travail utile, chacun relu par le hook, et un écran rempli de 6 points identiques pour le lecteur.

**La règle qui aurait évité le retour.** Le point de suivi est dû au plus une fois par intervalle de 15 minutes, compté depuis le dernier point rendu, et non à chaque fin de tour tant que l'agent tourne. **Clé proposée** : `veille-rearmee-sans-intervalle`, famille `hook-ou-gate`, libellé « Une veille périodique se réarme à chaque fin de tour au lieu d'attendre son intervalle : la même exigence revient en boucle ».

**Juge proposé.** Cas rouge dans le test du hook `suivi-agents` : deux fins de tour à moins de 15 minutes d'intervalle, avec un agent actif, n'exigent qu'un seul point ; la seconde passe.

## Rattachement

Registre interrogé le 13/11/2026 : `todo/CLASSES.json` du pilot. Aucune clé ne vise une veille ou un intervalle de réarmement ; la seule clé proche par le mot, `boucle-retour-sans-descente`, vise un retour qui ne descend pas, pas une exigence de hook répétée. D'où une clé neuve en `classe-a-creer`.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
