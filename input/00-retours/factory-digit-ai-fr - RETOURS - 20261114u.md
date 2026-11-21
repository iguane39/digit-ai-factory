# Retours forges — factory-digit-ai-fr — 20261114u

- **Contexte** : exécution au pilot, par une session `claude -p` lancée depuis ce produit, du prompt de coordination des sessions multiples (revue L99 20261114i, action A-2 choisie par le porteur).
- **Références ledger** : forge/ledger.jsonl seq 158, 159, 160.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le 14/11/2026 à 16:52, une session sans interface a été lancée au pilot pour exécuter le prompt. Elle a livré le diagnostic et l'étude, commité à 17:06, réservé D-218 et rendu sa restitution à 17:11. Trois défauts sont apparus en route :

- elle n'a jamais pu se terminer ;
- elle a signé sa décision du nom de la session qui l'a lancée ;
- l'outil qui liste les sessions lui manquait.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte 3 retours, RP-24 à RP-26, tous nés de l'exécution d'une session sans interface lancée depuis une autre.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition. Les lignes sont classées par gravité.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-24 | **majeur** | générique | **La veille des agents relance sans fin une session sans interface.** Après la restitution de 17:11, `hook-suivi-agents.mjs --veille` relance la session toutes les 15 minutes (17:24, 17:39) pour un explorateur « présumé arrêté » depuis 25 puis 40 minutes. La session ne se termine jamais ; elle a été arrêtée à la main à 17:46. Preuve : transcription `0e40d4f5-b7ef-43c9-948f-f1476026adb4.jsonl` du projet `c--dev-digit-ai-factory`, entrées de 16:24:56Z et 16:39:59Z. | Ne plus relancer pour un agent présumé arrêté après un premier point de suivi. En session `claude -p`, n'émettre la veille qu'une fois. |
| RP-25 | **majeur** | générique | **Une session enfant signe ses écritures du nom de sa mère.** D-218, réservée par la session du pilot `0e40d4f5`, porte au registre `session: 74dc7ecb`, l'identifiant de la session qui l'a lancée. Cause : `oracles/lib-decisions.mjs` ligne 111 lit `process.env.CLAUDE_CODE_SESSION_ID`, que le processus enfant hérite. C'est le défaut d'identité que l'étude de coordination veut corriger. | Ne pas se fier à la variable héritée seule : la croiser avec l'identifiant que le harnais passe aux hameçons, ou la vider au lancement d'une session enfant. |
| RP-26 | **mineur** | générique | **`ListAgents` est absent d'une session `claude -p`.** Le diagnostic `20261114b` du pilot déclare l'erreur « No matching deferred tools found » et compte les sessions par inférence. Le même outil répondait à 16:27 dans la session de l'éditeur. | Tout prompt ou hameçon qui s'appuie sur `ListAgents` prévoit le repli par transcriptions, comme le prompt l'a fait. |

## La règle qui aurait évité le retour

- **RP-24** : aucune règle ne borne le nombre de relances de la veille pour un agent présumé arrêté. Classe à créer : `veille-agents-sans-fin-en-session-headless`, famille `hook-ou-gate`.
- **RP-25** : aucune règle ne dit d'où vient l'identité d'une session qui écrit au registre. Classe à créer : `identite-de-session-heritee-par-session-enfant`, famille `tracabilite-ledger`.
- **RP-26** : la disponibilité des outils selon le mode de lancement n'est écrite nulle part. Classe à créer : `listagents-absent-en-session-headless`, famille `contrat-interface-forge`.

## Remarques restées au produit

- Le commit `bb58765b` du pilot a aussi embarqué `output/README.md` et `output/LISEZMOI.md`, que le prompt ne nommait pas. Il a laissé `decisions/REGISTRE.jsonl` hors du commit. Généralisable : non, c'est l'écart d'une exécution au contrat de son prompt ; il est relevé à la revue de cette exécution.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
