---
lecteur: le porteur de la Factory, administrateur du poste, qui décide quel travail confier à Claude, à Codex et aux modèles Gemini
---

# Étude — Plan de répartition du travail entre Claude, Codex et Antigravity

Étude du 21/11/2026, poste Dell-XPS-16, au pilot `digit-ai-factory`. Elle exécute le prompt réécrit de la revue `Digit-AI - Revue - Prompt plan multi-agents passe au crible L99 - 20261121p.md`, sous D-230 (a). Les mesures datent du 21/11 entre 17:10 et 17:36.

## Ce qui change pour vous

Les 3 agents réussissent du code borné par des tests, et Antigravity réussit aussi les retouches en série. Les déléguer libère de 43 000 à 62 000 jetons Claude par tâche.

Claude reste le plus rapide, de 29 à 38 s par tâche, et le seul sans défaut grave sur les 3 tâches. Codex a échoué au premier essai sur des fichiers accentués, puis réussi quand la consigne a précisé l'encodage. La recommandation se pose en décision D-231, parce qu'un essai par case donne une indication, pas une capacité.

## Méthode

Chaque agent a reçu les 3 mêmes tâches, avec un énoncé commun et un préambule propre à son outil. Les oracles ont été écrits et prouvés avant tout appel : une solution juste rend le code 0, une solution fausse le code 1.

- **T1, code** : une fonction de conversion en identifiant d'adresse et ses tests ; oracle, 10 cas cachés lancés par `node --test`.
- **T2, retouche en série** : 20 fiches texte converties en JSON, avec accents, milliers et dates ; oracle, comparaison à une vérité écrite d'avance.
- **T3, rédaction** : une note de 150 mots pour un propriétaire de gîtes ; oracle, la forme imposée et `oracle-ecriture.mjs`.

Les 3 agents ont tourné au même effort, `high`, chacun dans un dépôt jetable sans distant. Claude est passé par un agent `campagne` (Sonnet), Codex par `codex exec` (gpt-5.6-sol), Antigravity par `agy -p` (`gemini-4-neon-high`).

Un fichier témoin hors des dossiers est resté intact. Un agent `relecteur` a ensuite jugé les 9 livrables sans savoir qui les avait produits.

## Résultats du banc

Le tableau se lit par tâche : pour chaque agent, l'oracle, la durée, la note du relecteur aveugle sur 10 et ses défauts graves. Les jetons sont détaillés dans le journal du banc, à côté de l'étude.

| Tâche | Agent | Oracle | Durée | Note | Défauts graves |
|---|---|---|---|---|---|
| T1 code | Claude | réussi, 10 sur 10 | 29 s | 9 | aucun |
| T1 code | Codex | réussi, 10 sur 10 | 36 s | 9 | aucun |
| T1 code | Antigravity | réussi, 10 sur 10 | 63 s | 9 | aucun |
| T2 série | Claude | réussi, 20 sur 20 | 35 s | 10 | aucun |
| T2 série | Codex | échoué, 16 sur 20 | 99 s | 5 | 4 noms accentués corrompus |
| T2 série | Codex, reprise | réussi, 20 sur 20 | 121 s | non relu | non relu |
| T2 série | Antigravity | réussi, 20 sur 20 | 135 s | 10 | aucun |
| T3 note | Claude | réussi, 155 mots | 38 s | 8 | aucun |
| T3 note | Codex | réussi, 150 mots | 43 s | 7 | aucun |
| T3 note | Antigravity | réussi, 151 mots | 124 s | 7 | 1 majeur : un raisonnement faux sur le prix |

La reprise de Codex sur T2 a reçu un préambule qui précise l'encodage des fichiers, UTF-8 sans marque d'ordre d'octets. Elle prouve que l'échec tenait à la consigne d'outil, pas à la tâche.

Pendant les 6 premiers appels de Codex et d'Antigravity, la session Claude a fait 8 requêtes pour 5 566 jetons de sortie. Un appel externe ne coûte donc à Claude que son lancement et la lecture de son résultat.

## Fiche par agent

Chaque fiche dit ce que l'agent apporte et ce qu'il coûte. La colonne « Preuve » porte B pour le banc, N pour une note du 21/11, P pour l'historique de Produit-79.

### Claude

Claude a tout réussi, vite et sans défaut grave ; son coût est le quota qu'il prend à l'abonnement commun.

| Rubrique | Constat | Preuve |
|---|---|---|
| Outil et modèles | Claude Code 2.1.318 ; familles `opus`, `sonnet`, `haiku` | étape 0 ; `MODELES-EN-SERVICE.json` |
| Coût | abonnement Claude ; 43 609 à 61 687 jetons par tâche du banc, lecture du contrat d'agent comprise | B |
| Forces | 3 sur 3 au premier essai, le plus rapide (29 à 38 s), aucun défaut grave | B |
| Forces | seul à faire tourner les hooks, les oracles et la restitution de la Factory | `CONTRAT-INTERFACE.md` §4 |
| Limites | 2 écarts de consigne : un `git status` interdit, un script écrit hors de son dossier | B |
| Risques | le quota de l'abonnement est partagé par l'orchestrateur et tous ses agents | non mesuré : quota restant non lu |

### Codex

Codex est rapide sur le code et la rédaction, mais il demande une consigne d'outil précise et un orchestrateur pour ses commits.

| Rubrique | Constat | Preuve |
|---|---|---|
| Outil et modèle | Codex CLI 0.171.0, `gpt-5.6-sol`, effort `low` dans `config.toml`, `high` passé à l'appel | étape 0 |
| Coût | abonnement ChatGPT ; 76 000 à 172 000 jetons d'entrée par tâche, dont 89 à 94 % lus en cache | B |
| Forces | code borné et rédaction réussis en 36 et 43 s ; 5 tickets livrés sans écart les 12 et 13/11 | B ; P |
| Limites | sous bac à sable, aucune écriture dans `.git` : l'orchestrateur fait ses commits | N 20261121q |
| Limites | lecture et écriture en Windows-1252 et avec marque d'ordre d'octets si la consigne ne dit rien | B, T2 |
| Limites | `%TEMP%` à retirer des racines d'écriture à chaque appel ; PowerShell restreint ; lancement depuis Bash | N 20261121q |
| Risques | supprime un fichier de garde (`.gitkeep`) qu'aucune consigne ne nommait | B, T2 et reprise |

### Antigravity et les modèles Gemini

Antigravity a tout réussi au premier essai, au prix de la durée la plus longue et d'une autorisation de commande générale.

| Rubrique | Constat | Preuve |
|---|---|---|
| Outil et modèle | Antigravity CLI 1.5.14, `gemini-4-neon-high` ; il sert aussi Claude Opus, Claude Sonnet et GPT-OSS | étape 0 |
| Coût | compte Google ; 22 872 à 41 945 jetons par tâche | B ; prix non mesuré |
| Forces | 3 sur 3 au premier essai, retouche en série comprise | B |
| Forces | tient le protocole de ticket entier, commits compris | N 20261121f et 20261121o |
| Limites | le plus lent : 63 à 135 s par tâche | B |
| Limites | ses commandes ne s'ouvrent qu'avec `command(*)`, donc sous `--sandbox` et dans un dépôt dédié | N 20261121f |
| Risques | un raisonnement faux dans une note destinée à un client | B, T3 |

Gemini CLI n'est pas utilisable : Google le refuse pour un compte personnel (note 20261121e).

## Matrice de répartition

La matrice se lit ligne à ligne : un type de travail, l'agent recommandé, sa preuve et la condition de retour à Claude. Les 4 premières lignes viennent du §4 du contrat d'interface, les suivantes de `routage.md` de Produit-79.

La règle appliquée est celle du prompt. Un travail ne quitte Claude que si l'agent y réussit aussi bien que lui. Il doit aussi gagner 30 % de quota Claude ou de durée, ou rendre moins de défauts. Le gain de quota est acquis pour toute délégation, la durée jamais.

| Type de travail | Agent | Modèle et effort | Preuve | Retour à Claude |
|---|---|---|---|---|
| Pilotage, arbitrage, synthèse | Claude | `opus`, `high` | §4, hooks de la Factory | sans objet |
| Construction complexe | Claude | `opus`, `max` (agent `constructeur`) | non mesuré | sans objet |
| Production standard (documents, exigences) | Claude | `sonnet`, `high` | B, T3 : meilleure note, 8 contre 7 | sans objet |
| Tâches mécaniques | Claude | `haiku`, sans effort réglé (agent `explorateur`) | non mesuré | sans objet |
| Code borné par des tests | Codex | `gpt-5.6-sol`, `high` | B, T1 : réussi en 36 s, note 9 | oracle de tests rouge |
| Retouches en série sur des fichiers | Antigravity | `gemini-4-neon-high` | B, T2 : 20 sur 20 au premier essai | oracle de contrôle rouge |
| Retouches en série, en second | Codex | `gpt-5.6-sol`, `high`, encodage imposé | B, T2 reprise ; P | oracle de contrôle rouge |
| Lots de campagnes réseaux sociaux | Codex | `gpt-5.6-sol`, `high` | P : lot du 12/11 livré | relecture par Claude, comme aujourd'hui |
| Relecture d'un lot livré | Claude | `sonnet`, `high` | `routage.md` de Produit-79 | sans objet |
| Tout ce qui passe par la forge | Claude | `opus` ou `sonnet`, `high` | hooks de la Factory | sans objet |
| Revue croisée d'un livrable | l'agent qui ne l'a pas produit | son modèle, `high` | `routage.md` ; B : la relecture aveugle a vu les 4 noms corrompus | sans objet |
| Publication, push, envoi à un tiers | humain | sans objet | `routage.md`, `AGENTS.md` | sans objet |

La rédaction reste à Claude malgré le gain de quota : Codex et Antigravity réussissent l'oracle, mais leurs notes sont plus basses (7 contre 8). Antigravity y a aussi glissé 1 raisonnement faux.

## Protocole de délégation

Une délégation suit la file de tickets de Produit-79, avec 3 ajouts tirés du banc.

1. Claude écrit le ticket : un résultat vérifiable, ses limites, et l'oracle qui le jugera, écrit avant l'appel.
2. Claude lance l'agent avec l'appel de sa fiche, depuis Bash, et un préambule d'outil fixe. Pour Codex, ce préambule impose l'encodage UTF-8 sans marque d'ordre d'octets.
3. Pour Codex, Claude fait la prise et la clôture du ticket par git ; Antigravity les fait lui-même.
4. Claude joue l'oracle sur le reçu. Un oracle rouge renvoie le ticket à Claude, et le retour se consigne dans le reçu, au champ `ecarts`.

## Efforts et quotas

L'effort reste `high` pour tout agent délégué : c'est celui qu'a mesuré le banc. Le réglage de Codex dans `~/.codex/config.toml` vaut `low`, donc l'effort se passe à chaque appel.

Côté quota, une tâche du banc coûte à Claude de 43 000 à 62 000 jetons quand un agent Claude la fait. Déléguée, elle ne coûte que l'orchestration et charge l'abonnement de l'autre outil. Le quota restant de chaque abonnement n'a pas été lu.

## Limites

- 1 essai par case : chaque ligne de la matrice est une indication, à confirmer par les premiers tickets réels.
- 1 seul poste mesuré, Dell-XPS-16 ; DESKTOP-ULTRA7 n'a ni Codex ni Antigravity.
- La durée de Claude ne compte pas son temps de lancement ; celle des 2 autres compte le démarrage de leur outil.
- Un seul modèle Gemini essayé, `gemini-4-neon-high`, sur les 16 servis.
- Le prix du compte Google et les quotas restants n'ont pas été lus.
- La construction complexe, la production standard hors note courte et les tâches mécaniques n'ont pas été mesurées.

## Sources

- Le journal du banc, à côté de cette étude : consignes, codes d'oracle, durées, jetons, relecture aveugle.
- Les notes du 21/11/2026 : 20261121d, 20261121e, 20261121f et 20261121q, qui corrige 20261121o.
- `CONTRAT-INTERFACE.md` §4 et §4 bis ; `references/MODELES-EN-SERVICE.json`.
- Chez Produit-79, en lecture seule : `queue/local/routage.md`, `queue/local/config.env`, `AGENTS.md`, et les 6 tickets assignés à `codex`.
- `c:\dev\digit-ai-queue\local\INSTANCES.md`, section « Ce que l'instance ne fait pas ».
