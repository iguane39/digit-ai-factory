---
role: note de comparaison décidée par la réponse humaine D-140 (a), lire le code de /refine de Prime Agent et le comparer au skill oeil-critique
destinataire: humain
agent: redacteur
verdict_arbitre: voir le rapport de remise
hypotheses_non_resolues: le chiffre ARC-AGI-3 n'est ni dans le dépôt ni mesuré par un tiers ; le nom du modèle derrière ce chiffre vient d'un résumé de presse, non relu à la source
---

# Refine de Prime Agent contre oeil-critique — 20261102r

Ne changez rien pour l'instant : `/refine` fait, dans une session de Prime Agent, ce que fait `oeil-critique` après coup, et ses garde-fous ne servent pas un outil qui édite des règles et des scripts. Deux idées de son code valent pourtant d'être reprises dans `oeil-critique`, car elles comblent un manque réel : vérifier qu'un fichier n'a pas bougé avant de le modifier, et dire à l'avance l'effet attendu de chaque modification automatique.

Lu le 02/11/2026 : dépôt `PrimeIntellect-ai/prime-agent`, commit `c6d4da94` du 30/10/2026, licence MIT, copyright Prime Intellect Ltd (`LICENSE`, lignes 1 à 3). Le fichier signale aussi un portage d'un produit TypeScript antérieur, lui aussi sous MIT (lignes 24 et 25). Rien n'a été installé ni lancé. Comparé à `digit-ai-forge-agents/.claude/skills/oeil-critique/SKILL.md`, version 1.3.3.

## Lecture, écriture et retour arrière de `/refine`

Le dossier `skills/refine/` ne contient que 50 lignes de Python (`src/refine/__init__.py`) : il demande au programme hôte de lancer la commande, et rien d'autre. Le travail est dans le code Rust de `crates/pa-core/src/`.

**Ce qu'il lit.** La conversation de la session en cours, coupée à ses 80 000 derniers caractères (`refinement/executor.rs`, ligne 220), l'état courant du harnais et l'historique des refinements précédents (même fichier, lignes 226 à 238). Le harnais (harness) est l'ensemble des notes d'invite, mémoires, descriptions de skills et fiches de sous-agents que l'agent garde d'une session à l'autre.

**Ce qu'il peut changer.** Cinq sortes d'entrées seulement : invite complémentaire, mémoire, skill, sous-agent et chaîne de travail (`refinement/mod.rs`, ligne 10). L'invite de base est protégée (`planner.rs`, lignes 210 à 215) et la commande n'écrit aucun fichier source (`planner.rs`, ligne 10). Un skill créé n'est qu'une fiche qui désigne une fonction Python : le README précise qu'il ne remplace pas l'empaquetage et la relecture d'un skill exécutable (ligne 128). La modification passe par un modèle de la session, au maximum 32 000 jetons de sortie (`planner.rs`, ligne 15).

**Comment il revient en arrière.** Chaque modification appliquée garde l'entrée avant et après (`AppliedRefinementEdit`, `refinement/mod.rs`, lignes 353 à 380). `/refine rollback <id>` rejoue les états « avant » en sens inverse (`planner.rs`, lignes 505 à 547). Avant d'écrire, il refuse toute entrée modifiée pendant la planification : « entry changed during refinement planning » (`planner.rs`, lignes 357 à 372). Un interrupteur général coupe tout (`refinement_gate.rs`, lignes 6 à 8), relu au moment d'appliquer, pas seulement au départ (`session_engine/refine.rs`, lignes 414 à 421).

À ma lecture, le retour arrière ne vérifie pas que l'entrée est encore dans l'état « après » : annuler un refinement ancien peut écraser un refinement plus récent sur la même entrée. Je n'ai pas rejoué ce cas.

## Les deux côte à côte

| Point | `/refine` | `oeil-critique` 1.3.3 |
|---|---|---|
| Matière lue | une session, 80 000 caractères de fin | toutes les sessions de la période, des deux postes, refus de hook compris, plus l'état des dépôts (`SKILL.md`, étapes 2 et 2 bis) |
| Ce qui est écrit | le harnais, un fichier d'état JSON | rien : une liste, puis la session qui la reçoit exécute (`SKILL.md`, lignes 38 à 41) |
| Portée d'une modification | cinq sortes d'entrées bornées | tout fichier de la Factory, dont règles, hooks et scripts, avec la catégorie « majeure » au-delà |
| Décision humaine | aucune pour une entrée locale ; relecture a posteriori | aucune pour les automatiques, une décision scellée pour les majeures (`SKILL.md`, lignes 101 à 132) |
| Déclenchement | à la main, par l'agent lui-même, ou à la compaction | à la main seulement (décision D-65 (a)) |
| Retour arrière | commande dédiée, entrées avant et après | aucun mécanisme propre : le commit de chaque « fait » permet un `git revert` |
| Effet attendu | champ `expectedOutcome` relu au refinement suivant | seulement pour les majeures ; les indicateurs globaux se comparent d'une exécution à l'autre |

Le déclenchement automatique est actif par défaut dans le code : `enabled: true`, tous les 25 tours, 20 minutes d'intervalle (`session_engine/refine.rs`, lignes 39 à 47). Un premier appel de contrôle, limité à 4 096 jetons de sortie, décide s'il vaut la peine de lancer le refinement (`planner.rs`, ligne 12 et ligne 16). Le champ qui l'autorise en amont (`auto_refine_allowed`) est posé ailleurs et je ne l'ai pas lu.

## Ce qui vaut d'être repris

**1. Vérifier que le fichier n'a pas bougé avant de le modifier.** `/refine` compare l'entrée courante à celle lue avant le long appel au modèle et refuse si elles diffèrent. L'analyse d'`oeil-critique` peut durer jusqu'à un million de jetons (`SKILL.md`, ligne 148) et ses automatiques s'exécutent « ensuite », après la liste. Rien dans le skill ne vérifie que le fichier visé est resté le même entre les deux. Je n'ai relevé aucun incident, c'est un risque non mesuré. Reprise proposée : la liste note l'empreinte du fichier visé, et l'exécution refuse, et remonte, toute automatique dont le fichier a changé. Coût faible, un champ et un test.

**2. Annoncer l'effet attendu de chaque automatique.** `/refine` stocke pour chaque passage ce qui doit s'améliorer et comment le valider (`planner.rs`, ligne 10), puis relit l'historique au passage suivant avec l'ordre de défaire ou de remplacer ce qui a mal tourné. Dans `oeil-critique`, seules les majeures portent « l'indicateur visé, sa valeur actuelle et sa valeur cible » (`SKILL.md`, lignes 119 à 123). Une automatique faite n'est ensuite jugée que par l'évolution globale des indicateurs, trop grossière pour désigner celle qui n'a rien donné. Reprise proposée : une ligne « effet attendu » par automatique, relue à l'exécution suivante, qui range en candidat à retirer celle dont l'effet manque.

## Ce qui ne vaut pas d'être repris

- **Adopter Prime Agent.** Il exécute du Python généré avec vos droits et ses processus ne forment pas un bac à sable, le README le dit en toutes lettres (`README.md`, ligne 111). Il suppose de quitter Claude Code, sur lequel repose la Factory. D-140 a écarté cette voie.
- **Le déclenchement par l'agent lui-même** (`refine.run()`, `prompts/layers/core.md`, lignes 85 et 91). L'agent y réécrit ses propres consignes en cours de travail. La Factory tient que l'humain décide ce qui touche la doctrine, et `oeil-critique` classe ces cas en majeures.
- **Le déclenchement automatique tous les 25 tours.** La décision D-65 (a) n'ajoute un passage planifié que si des périodes restent non analysées.
- **Un second magasin d'entrées injecté dans l'invite.** Il doublerait `CLAUDE.md`, les skills et le registre `todo/TODO.jsonl`, qui doit rester la source unique. C'est l'argument déjà retenu contre task-observer (note du 26/10/2026).
- **Le retour arrière par rejeu d'instantanés.** Git le fait mieux sur des fichiers : un `git revert` échoue en cas de conflit au lieu d'écraser en silence.
- **La lecture limitée à une session.** Elle convient à un agent qui se corrige en cours de tâche, pas à une revue des récidives sur une période et deux postes.

## Le chiffre ARC-AGI-3

Le dépôt ne contient ni « ARC-AGI-3 » ni « 95,5 » (recherche sur tout le dépôt hors verrous et historique). Le chiffre vient d'un résumé de presse (aiweekly.co, page datée du 26/08/2026) : Prime Intellect, l'éditeur, annonce que son harnais fait passer le score ARC-AGI-3 « RHAE Best@1 » de 30 à 95,5 %. La page ne rapporte aucune vérification indépendante, ne décrit pas ce qui a produit les 30 % de départ, et attribue le score à un modèle nommé par l'éditeur sur son blog, que je n'ai pas lu. L'article de recherche cité par le README (arXiv 2605.09998, déposé le 11/05/2026) rapporte des résultats sur des jeux Pokémon et, dans son résumé, ne mentionne pas ARC-AGI-3. Le chiffre mesure un harnais complet avec un modèle donné : rien ne l'attribue à `/refine` seul. Il n'entre pas dans la comparaison.

## Limites

J'ai lu `refinement/mod.rs`, `planner.rs` (lignes 1 à 50, 190 à 550), `executor.rs` (lignes 14 à 335), `session_engine/refine.rs` (lignes 28 à 110, 300 à 470), `auto_refine_trigger.rs`, `refinement_gate.rs` et le début de `harness_digest.rs`. Je n'ai pas lu le côté Python du noyau (`prime-agent-runtime`), la partie qui classe les entrées par pertinence (`ranking.rs`, au-delà de son début), ni les tests. Le résumé d'arXiv a été lu par un outil de lecture de page, sans l'article complet. Rien n'a été exécuté, y compris le cas de retour arrière écrasant décrit plus haut.
