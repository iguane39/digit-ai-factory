# Retours forges — factory-digit-ai-fr — 20261115h

- **Contexte** : run `forge-digit-ai-fr-20261114a`. Le créateur a lu deux actions en cours chez un agent comme des tâches en attente de son accord, et demande un statut dans le tableau des actions.
- **Références ledger** : forge/ledger.jsonl seq 252.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Une restitution confiait la construction d'une page à un agent `constructeur`, déjà lancé. Son tableau « Prochaines actions » listait les deux étapes suivantes avec le motif « dependance_externe : le constructeur n'a pas rendu son travail ». Le créateur a répondu : « A1 puis A2. Pourquoi ça n'a pas été lancé automatiquement ? ». Puis : « Dans le tableau des actions, ajoute un statut à lancer ou en cours. Et remonte ce point à la Factory. »

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-47 : le tableau des actions ne dit pas ce qui tourne déjà.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-47 | **majeur** | générique | **Le tableau « Prochaines actions » du gabarit de restitution ne distingue pas une action en cours d'une action à lancer.** Le motif « dependance_externe » est lu par le créateur comme une attente de son accord. Preuve : la restitution du 15/11/2026, 09:40, au bloc 8 ; la question du créateur citée plus haut ; une restitution d'essai portant la colonne « Statut » passe le préjugé (affichable, 0 avertissement). | Ajouter au bloc 8 du gabarit une colonne « Statut » obligatoire, juste après « Action », aux valeurs fermées « à lancer », « en cours », « terminé ». L'oracle de synthèse la contrôle, et une action « en cours » nomme l'agent ou la commande qui la porte. |

## La règle qui aurait évité le retour

RP-47 : le gabarit nomme qui fait l'action et pourquoi elle n'est pas faite, mais pas si elle est déjà partie. Classe : `restitution-forme`.

## Remarques restées au produit

- Ce produit ajoute dès maintenant la colonne « Statut » à ses restitutions. Généralisable : oui, c'est l'objet de RP-47.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
