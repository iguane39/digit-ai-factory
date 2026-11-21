# Retours forges — factory-digit-ai-fr — 20261114v

- **Contexte** : exécution au pilot du prompt sur l'amélioration continue des agents (D-77 (a)), le 14/11/2026, par une session Claude Code non interactive.
- **Références ledger** : forge/ledger.jsonl seq 168.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

La session du pilot, ouverte par son invite, a voulu faire la relecture d'intention de fin de tour. `relecture-intention.mjs` a rendu exit 1, faute de message humain dans la transcription. L'exécutant l'a déclarée « sans objet ». Une session non interactive n'a donc aucune relecture d'intention.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-27 : la relecture d'intention est impossible dans une session ouverte par son invite.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-27 | **mineur** | générique | **La préparation de la relecture d'intention de fin de tour échoue (exit 1) dans une session `claude -p`, faute de message humain dans la transcription.** Preuve : restitution de la session du pilot du 14/11/2026, 17:34 à 17:50, bloc 4. | `relecture-intention.mjs --preparer fin-de-tour` lit l'invite d'ouverture comme demande humaine quand la session est non interactive, dans l'esprit de TF-2235 cité dans son en-tête. |

## La règle qui aurait évité le retour

RP-27 : la relecture d'intention suppose un message humain que les sessions non interactives n'ont pas. Classe à créer : `relecture-intention-impossible-en-session-non-interactive`, famille `hook-ou-gate`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
