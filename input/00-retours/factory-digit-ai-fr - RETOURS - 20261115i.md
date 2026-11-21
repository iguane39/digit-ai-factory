# Retours forges — factory-digit-ai-fr — 20261115i

- **Contexte** : construction du registre des sessions décidée par D-218 (b), faite au pilot par un agent `constructeur` lancé depuis ce produit le 15/11/2026 (commits locaux `61d19cca` à `f9944545`). Ce lot recopie les écarts et les restes que l'agent a rapportés, comme le gabarit de campagne le demande à la session qui l'a lancé.
- **Références ledger** : forge/ledger.jsonl seq 253, 254, 255, 256.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

L'agent a livré les items I1 à I6 du mandat, en 6 commits locaux. La recette entière du pilot rend 7 défauts sur 279, tous étrangers au chantier. En route, il a relevé 2 écarts de socle, une liste de restes et une fuite d'hygiène.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte 4 retours, RP-48 à RP-51, issus du rapport de l'agent de construction.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition. Les lignes sont classées par gravité.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-48 | **majeur** | générique | **`FORGE_ROOT` hérité pointe un dossier sans pilot.** Sa valeur est `C:\dev\digit-ai-factory\.claude\worktrees`. `oracle-lot-retours.test` y rend 89 PASS et 6 FAIL, contre 95/0 avec `FORGE_ROOT=C:\dev`. Le relevé d'ouverture de session du 14/11 conseillait lui-même d'exporter cette valeur. Preuve : `avancement.jsonl` de l'agent, ligne 6. | Corriger la valeur conseillée par le relevé d'ouverture, et faire refuser par les recettes un `FORGE_ROOT` sous lequel le pilot est introuvable. |
| RP-49 | **majeur** | générique | **La session de l'agent a affiché un jeton dans sa transcription.** Un relevé non filtré de l'environnement a affiché `CLAUDE_CODE_MESSAGING_TOKEN`. Il n'a été écrit nulle part ailleurs. Preuve : rapport de l'agent, « Observation d'hygiène ». | Interdire au contrat de campagne le relevé non filtré de l'environnement, et filtrer les variables de jeton dans tout relevé. |
| RP-50 | **majeur** | générique | **Restes de la construction.** `ledger.mjs` de forge-agents n'écrit pas encore `session` ni `session_source`. La règle PC2 d'`oracle-parite-configuration` ne voit pas `FORGE_SESSION_ID`. Il reste 8 hausses du cliquet à inscrire dans l'arbre principal. `gabarits/CLAUDE-PRODUIT.md` n'a pas de section sur les sessions. Certaines recettes ne retirent que `CLAUDE_CODE_SESSION_ID` pour se rendre hermétiques. Aucun TF n'est attribué. Preuve : rapport de l'agent, section « Restes ». | Ingérer chaque reste en candidature, et attribuer les TF du chantier D-218 (b). |
| RP-51 | **mineur** | générique | **Deux recettes du pilot sont rouges à la base.** `oracle-skills --self-test` rend 96/100 (4 cas K11) et `hook-ecriture --self-test` 1 défaut (RANGEMENT), à l'identique à `0679a6fe`. Preuve : `avancement.jsonl`, ligne 8. | Les réparer, pour qu'un rouge de recette redevienne un signal. |

## La règle qui aurait évité le retour

- **RP-48** : aucune recette ne vérifie que `FORGE_ROOT` mène au pilot. Classe à créer : `forge-root-herite-sans-pilot`, famille `heritage-produit`.
- **RP-49** : le contrat de campagne n'interdit pas le relevé non filtré de l'environnement. Classe à créer : `jeton-affiche-par-releve-d-environnement`, famille `anonymisation`.
- **RP-50** : ce sont les suites de RP-25 (lot `20261114u`). Classe à créer, déjà proposée par ce lot : `identite-de-session-heritee-par-session-enfant`, famille `tracabilite-ledger`.
- **RP-51** : une recette rouge connue et laissée telle quelle n'apprend plus rien. Classe à créer : `recette-pilot-rouge-preexistante`, famille `regle-morte`.

## Remarques restées au produit

Aucune remarque n'est restée au produit : tout ce que l'agent a rapporté concerne le pilot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
