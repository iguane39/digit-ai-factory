# Retours forges — factory-digit-ai-fr — 20261114f

- **Contexte** : run `forge-digit-ai-fr-20261114a`, étape design ouverte, 14/11/2026. Le créateur a demandé pourquoi le run n'emploie pas plusieurs agents, puis a accepté qu'un plan de délégation soit ajouté au prompt de run.
- **Références ledger** : forge/ledger.jsonl seq 79.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le prompt de run du refresh couvre quatre lots, 15 clips, 15 animations et un studio de trois directions, mais il ne dit pas quel agent prend quelle activité. La conception a donc été tenue par la session principale seule. Seuls les relecteurs de la revue L99 ont été délégués : 16 appels d'agents dans la session précédente. Le plan de délégation a été ajouté au produit par une version e du prompt et par un amendement daté du brief du run (ledger seq 78).

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-5 : un prompt de run peut naître sans plan de délégation aux agents, et rien ne signale qu'une racine en minuscule interdit les agents isolés.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-5 | **majeur** | générique | **Le prompt de run 20261114d ne nomme aucun agent par activité. Le gabarit de prompt de run n'impose pas cette section, et `references\PARALLELISME-CLAUDE-CODE.md` ne dit pas à un run quand déléguer. Le studio de design prévoit des agents générateurs que le brief ne nomme pas. Enfin, la racine `c:\dev\forge-digit-ai-fr`, en minuscule, interdit l'isolation `worktree` (TF-2443), et aucune ouverture de run ne le signale.** Preuve : brief du run avant l'amendement du 14/11/2026, entrées 69 à 74 du ledger sans aucune `invocation`, `forge/etapes/design-v2/RUBRIQUE.md` ligne 3. | Le gabarit de prompt de run porte une section obligatoire « Délégation aux agents » : ce que l'orchestrateur garde, la condition d'écriture parallèle, un agent par activité. L'ouverture de run avertit quand la racine de session est en minuscule alors que le brief prévoit des agents qui écrivent en parallèle. |

## La règle qui aurait évité le retour

RP-5 : aucune règle n'exige qu'un brief de run répartisse son travail entre orchestrateur et agents. La définition des agents nommés existe (`gabarits\flotte\`), mais aucun gabarit de run ne l'invoque. Classe proposée, à créer au pilot : clé `brief-de-run-sans-plan-de-delegation`, famille `gabarit-prompt`, libellé « Un prompt de run ne dit pas quel agent prend quelle activité ».

## Remarques restées au produit

Aucune remarque n'est restée au produit : le constat est remonté ci-dessus, et sa correction locale (version e du prompt, amendement du brief) est faite.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : le refus de `isolation: "worktree"` depuis une racine en minuscule est déjà documenté au pilot (TF-2443), et il n'est cité ici que comme facteur aggravant de RP-5.
