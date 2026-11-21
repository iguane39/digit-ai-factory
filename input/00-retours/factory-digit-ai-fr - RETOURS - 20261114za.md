# Retours forges — factory-digit-ai-fr — 20261114za

- **Contexte** : run `forge-digit-ai-fr-20261114a`, page de la forge des tests. Après 6 tours du contrôle de compréhension, le créateur rejette le texte, et demande qui l'a relu.
- **Références ledger** : forge/ledger.jsonl seq 191.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le créateur, le 14/11/2026 : « Pas de qui et pas de preuve, ça n'a rien à faire dans les chapitres de la solution de tests en étapes. Mais qui a relu ça sans voir les problèmes. Est-ce qu'un persona d'un tech ou d'un décideur a relu ces phrases et s'est dit que c'était une bonne idée ? Non, je ne crois pas. »

Le texte avait passé 6 tours d'un contrôle de compréhension par lecteurs isolés. Ce contrôle cherche, dans les réponses des lecteurs, des éléments attendus. Il ne juge ni l'utilité d'une phrase, ni sa logique, ni sa place dans la suite. Ses propres références demandaient « qui la fait » à chaque étape.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-34 : un texte publié est jugé sur le rappel de faits attendus, jamais sur le sens de ses phrases pour ses lecteurs.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-34 | **majeur** | générique | **Aucune relecture ne juge le sens des phrases d'un texte publié.** Une phrase écrite par l'orchestrateur, « vos tests doivent détecter 70 % des erreurs introduites volontairement », a passé le contrôle. Or la mutation n'est jouée qu'à la demande, selon le README de la forge des tests (« La mutation est une campagne À LA DEMANDE »). Les lignes « Qui » et « Preuve » de chaque étape venaient du prompt du run et des références du contrôle. Preuve : `forge/etapes/contenus/controle/forge-tests-texte-tour6.json` ; `forge/BRIEF-forge-digit-ai-fr-20261114a.md`, lignes 242, 258 et 329 ; ledger seq 184. | Avant tout contrôle de compréhension, une relecture par personas (décideur, technique, et le métier du sujet, ici un testeur) note chaque phrase : utile, comprise, logique à sa place ; elle juge aussi le fil d'ensemble. Une phrase notée inutile ou illogique se reprend. L'auteur d'un texte ne le réécrit pas après avoir lu les références du contrôle. |

## La règle qui aurait évité le retour

RP-34 : aucune règle de la Factory n'impose une relecture de sens par personas avant la remise d'un texte publié. Classe à créer : `texte-publie-sans-relecture-de-sens-par-persona`, famille `skill-ou-oracle-non-invoque`.

## Remarques restées au produit

- Le prompt de reprise de la page, en cours de revue L99, introduit cette relecture par 3 personas pour la page de la forge des tests. Généralisable : oui, c'est l'objet de RP-34.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
