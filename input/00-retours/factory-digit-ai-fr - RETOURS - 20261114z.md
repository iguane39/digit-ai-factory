# Retours forges — factory-digit-ai-fr — 20261114z

- **Contexte** : run `forge-digit-ai-fr-20261114a`, contrôle de compréhension de la page de la forge des tests, dernier tour. Un lecteur isolé ne s'est pas lancé après une mise à jour de Claude Code survenue pendant la session.
- **Références ledger** : forge/ledger.jsonl seq 190.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Sous Windows, `claude` est un `claude.CMD`, et `cmd.exe` abîme les longs arguments d'un lecteur : le texte de la page et sa consigne. Le script du produit contournait ce défaut en appelant `node …/claude-code/cli.js`. Vers 18:15, une mise à jour de Claude Code a remplacé `cli.js` par un exécutable natif, `bin/claude.exe`. Le script est alors retombé sur `claude.CMD`, et un lecteur a échoué : « Input must be provided either through stdin or as a prompt argument when using --print ».

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-33 : la recette du lecteur isolé sur abonnement doit dire comment lancer la CLI sous Windows, et vérifier que le message arrive entier.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-33 | **mineur** | générique | **La recette proposée par les lots 20261114l et 20261114n ne dit pas comment appeler la CLI sous Windows.** Le contournement du produit (`cli.js`) est tombé avec une mise à jour de Claude Code, en cours de session. Preuve : `forge/etapes/contenus/controle/forge-tests-texte-tour6-arret.json`. Le paquet `@anthropic-ai/claude-code` ne livre plus que `bin/`, `cli-wrapper.cjs` et `install.cjs`, et `claude.CMD` appelle `bin\claude.exe`. | La recette appelle `bin/claude.exe` quand il existe, `cli.js` sinon, et s'arrête au lieu de retomber sur `claude.CMD`. Un lancement à blanc vérifie que le message arrive entier avant de compter les lancements autorisés. |

## La règle qui aurait évité le retour

RP-33 : la même classe à créer que RP-12 du lot 20261114l, `lecteur-isole-sans-recette-sur-abonnement`, famille `contrat-interface-forge`. L'entrée 190 du ledger attribue l'appel à `cli.js` aux lots l et n. C'est inexact : il venait du script du produit, et les lots n'en parlent pas (`grep`, 0 occurrence). Le lot corrige cette attribution.

## Remarques restées au produit

- Le script `forge/etapes/contenus/controle_comprehension.py` appelle désormais l'exécutable natif, et s'arrête sans retomber sur `claude.CMD`. Généralisable : oui, c'est l'objet de RP-33.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
