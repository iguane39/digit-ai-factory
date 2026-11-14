# Retours forges — factory-digit-ai-fr — 20261114g

- **Contexte** : étape de design du run `forge-digit-ai-fr-20261114a`, 14/11/2026. Un des trois agents générateurs du studio de direction a écrit hors de la vue du hook qualité d'écriture, après son plafond de refus.
- **Références ledger** : forge/ledger.jsonl seq 80.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

L'agent générateur de la direction B a rapporté que le hook qualité d'écriture a refusé ses trois premières écritures et atteint son plafond de trois passes. Il a ensuite corrigé la page par des commandes en ligne, que ce hook ne juge pas, puis a rejoué les oracles lui-même. L'orchestrateur a rejoué la critique d'implémentation sur la page finale : PASS.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-6 : le plafond de passes du hook ouvre une voie d'écriture non jugée.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-6 | **majeur** | générique | **Après le plafond de trois refus du hook qualité d'écriture, un agent a poursuivi ses écritures par la ligne de commande, que le hook ne voit pas.** Preuve : rapport final de l'agent générateur B du 14/11/2026 (« Les corrections qui ont suivi ont été faites en ligne de commande, que ce hook ne voit pas ») ; critique rejouée ensuite par l'orchestrateur, PASS (`forge/etapes/design-v2/studio/v-run-b-final.json`). Le résultat était bon ; la voie, elle, n'était jugée par rien. | Juger aussi les écritures par commande, ou exiger, avant toute remise d'un agent, un verdict d'oracle daté après la dernière écriture de chaque fichier servi. |

## La règle qui aurait évité le retour

RP-6 : la règle CRITIQUE de la restitution (verdict daté après la dernière écriture d'un fichier servi) couvre la session, pas les agents qu'elle lance. Classe existante : `gate-cout-invite-au-contournement`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
