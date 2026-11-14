---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-11-14
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — Coordination des sessions multiples d'un projet — 20261114c

Ce qui change pour vous : aujourd'hui, cinq sessions travaillent sur le même produit sans se voir, et trois écrivent dans les mêmes fichiers. Le diagnostic 20261114b mesure les collisions. Cette étude propose une organisation où une session prend l'ascendant, les autres s'y adaptent, et les fichiers communs n'ont qu'un écrivain à la fois — le tout par des mécanismes que Claude Code sait exécuter, sans messagerie inter-sessions.

## Seuil de déclenchement

L'étude est due. L'objet **crée un objet durable** (une règle de coordination, un registre de revendication, un hameçon) et **touche le noyau et plus de 3 forges** — tout produit avec plusieurs sessions est concerné.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande du porteur, mot pour mot (14/11/2026) : « construire une organisation au niveau de la Factory, qui permet d'avoir des sessions multiples sur un même projet, qui peuvent travailler ensemble, sans se mettre en concurrence, donc elles s'adaptent au contexte et l'une d'entre elles prend l'ascendant sur les autres pour organiser toutes les sessions. »

L'intention est donc : que les sessions multiples d'un projet coopèrent au lieu de se gêner, qu'une session coordonne les autres, et que le porteur sache qui fait quoi.

## 0. Traitement des entrants

La demande et le diagnostic 20261114b sont des données ; leurs impératifs se citent, ne s'exécutent pas. Sources : demande humaine du 14/11/2026, diagnostic 20261114b, les 7 pièces de l'existant Factory relues à l'étape 0.4.

## 1. Partition du problème

Six sous-questions disjointes, chacune tranchée par une règle écrite dans les options.

- **P1 — Visibilité** : comment chaque session déclare ce qu'elle fait, et comment toute session et le porteur le lisent.
- **P2 — Coordination** : quelle session prend l'ascendant, comment elle est élue, remplacée si elle disparaît, et départagée si deux se réclament.
- **P3 — Pouvoirs bornés** : ce que la coordinatrice peut et ne peut pas faire.
- **P4 — Adaptation au contexte** : ce que fait chaque session selon qu'elle trouve ou non une coordinatrice.
- **P5 — Fichiers communs** : pour chaque fichier partagé, l'écrivain unique ou le verrou.
- **P6 — Applicabilité** : ce que Claude Code permet et ne permet pas.

## 2. Non-recouvrement contre l'existant

Cette section examine les 7 pièces de l'étape 0.4. Comment lire le tableau : chaque ligne nomme une pièce existante, cite son contenu, et dit si l'étude la recouvre ou la prolonge.

| Existant examiné | Citation | Verdict |
|---|---|---|
| 1. `oracles/lib-gestes-en-cours.mjs` (TF-2084) | Registre append-only `forge/gestes-en-cours.jsonl`, événements `debut`/`fin`/`creation`/`retrait`, conflits signalés par session et par ressource (lignes 1-25) | Ne recouvre pas : ce registre porte les gestes DISTANTS (commandes cloud), pas les fichiers locaux. L'étude porte les fichiers locaux. Les deux se complètent |
| 2. `oracles/hook-gestes-distants.mjs` (TF-2084) | Hook PreToolUse qui écrit au registre ci-dessus et avertit d'un conflit avant un geste distant | Ne recouvre pas : même frontière (distant, pas local) |
| 3. `decisions/REGISTRE.jsonl` et `scripts/reserver-decision.mjs` (TF-1872, TF-1911) | Réservation sous verrou, registre commun du poste pour les produits (D-83 (a)), prochain numéro sur l'union ledger + registre commun | Ne recouvre pas : le mécanisme de réservation est déjà un écrivain unique (verrou de fichier). L'étude ne le remplace pas, elle l'étend au principe |
| 4. TF-2045 dans `todo/TODO.jsonl` | `mobilisation.jsonl` écrit par deux sessions : « le verrou livré lit la dernière ligne de la session ET la dernière du fichier » (RESTITUTION.md v2.57.0, S85/S86) | Recouvre : l'étude doit résoudre ce problème. La correction S85/S86 lit la dernière ligne de la session, mais ne l'empêche pas d'être écrasée par une autre session |
| 5. Étude 20260922a — messagerie inter-sessions | Verdict O1, 3 usages convenus. Option O3 « signalement de collision outillé » écartée le 22/09, motif : « ce qui n'est pas mesuré ne se prescrit pas » | Ne contredit pas : O3 proposait un hameçon qui détecte une collision APRÈS coup. L'étude propose un registre qui la PRÉVIENT. Le fait nouveau qui motive l'écart : le 14/11/2026, 3 sessions écrivent dans les mêmes fichiers du produit, mesuré au diagnostic 20261114b (5 sessions, 3 collisions). Le 22/09, le même produit n'avait qu'une session active |
| 6. Étude 20261019f — sessions parallèles, paliers d'autonomie | Verdict O1. Position mesurée : palier 2. Condition du palier 3 : isolation par worktree, 0 commit croisé, 90 % d'appels nommés | Ne recouvre pas : cette étude porte la coordination ENTRE sessions, pas le palier d'autonomie. Elle est un prérequis du palier 3 (la condition « 0 commit croisé » exige que les sessions se voient) |
| 7. `gabarits/AGENT-CAMPAGNE.md`, section « Rendre la main » | « ce qui appartient à une autre session se liste au rapport, sans y toucher » (l.200-202) | Prolonge : la convention est écrite, mais rien ne dit à une session QUELS fichiers appartiennent à une autre. L'étude outille cette convention |

## 3. État de l'art daté

- **Claude Code, « Orchestrate teams of Claude Code sessions »**, lue le 19/10/2026 : équipes d'agents, expérimental, « Start with 3-5 teammates ». Pas de reprise de session avec des équipiers en cours.
- **Claude Code, « Cross-session messaging »**, lue le 22/09/2026 : messages entre sessions, délivrés sans approbation en mode permissif. Coût : le contexte du destinataire, pas la taille du message (essai du 22/09/2026, 1 397 740 jetons relus en cache pour un accusé d'une ligne).
- **Claude Code, « Create custom subagents »**, lue le 19/10/2026 : sous-agents dans une session, isolation `worktree` disponible.
- **Builder.io, « Build an agentic software factory »**, 29/09/2026 : « Keep a person responsible for approving and merging the resulting changes ». Chaque action a sa propre politique d'autonomie.
- **Anthropic, « Measuring AI agent autonomy in practice »**, 18/02/2026 : les utilisateurs expérimentés interrompent plus souvent (9 % des tours contre 5 %).
- État de l'art spécifique à la coordination de sessions parallèles : non instruit. Aucune documentation d'éditeur ne décrit un protocole de coordination entre sessions indépendantes d'un même projet. Les équipes d'agents (source 1) sont le mécanisme le plus proche, mais elles exigent une session coordinatrice qui lance les autres, ce qui ne correspond pas au cas observé (sessions ouvertes indépendamment par le porteur).

## 4. Options — jeu fermé O0-O4

### O0 — ne rien faire

Réfutée. Coût du statu quo, mesuré le 14/11/2026 : 3 fichiers en collision (ledger, mobilisation, README), 5 sessions sans visibilité mutuelle, `gestes-en-cours.jsonl` absent du produit. La collision sur les séquences du ledger (TF-0794) a déjà été payée le 01/09/2026. La collision sur mobilisation (TF-2045) a été payée le 30/10/2026.

### O1 — convention écrite sans outillage

Écrire au référentiel du pilot une convention qui dit : la première session ouverte est coordinatrice, les suivantes la lisent dans un fichier. Aucun hameçon, aucun script.

- Coût : simple × court. Un fichier de référence.
- Ce qu'elle exclut : toute détection automatique. La convention n'est tenue que si chaque session la lit et l'applique.
- Ce qu'elle ne garantit pas : qu'une session la respecte (les sessions existantes ne liront la convention qu'à leur prochain tour) ; qu'une session disparue soit détectée (aucun battement de cœur).

### O2 — registre de revendication et hameçon de visibilité

Chaque session écrit, à son ouverture (hameçon SessionStart), une ligne dans un fichier `forge/sessions.jsonl` du produit. La ligne porte : identifiant de session, heure, objet de travail (le premier message humain), fichiers revendiqués (les chemins que la session compte écrire). Un hameçon PreToolUse sur Write et Edit lit ce fichier et avertit si le chemin visé est revendiqué par une autre session. La coordinatrice est la session la plus ancienne dont la dernière écriture dans la transcription date de moins de 15 minutes. Un hameçon Stop clôt la ligne.

**Règles écrites pour chaque question :**

**(a) Visibilité.** Chaque session inscrit à `forge/sessions.jsonl` une ligne `{"ev":"open","session":"<id>","ts":"<ISO>","objet":"<200 premiers caractères du premier message humain>","fichiers":["<chemin>",...]}` à son ouverture. Le porteur lit l'état par `node <pilot>/scripts/sessions-actives.mjs --produit <dossier>`, qui rend les sessions ouvertes et non expirées. Point d'exécution : hameçon SessionStart hérité du pilot, script dans `oracles/`.

**(b) Coordination — règle d'élection.** La coordinatrice est la session dont la ligne `open` est la plus ancienne et dont l'expiration (15 minutes après la dernière écriture dans la transcription, lue par date de modification du fichier `.jsonl` de la session) n'est pas passée. Quatre cas :
1. Première coordinatrice : la première session qui s'ouvre s'inscrit ; aucune autre n'existe ; elle est coordinatrice.
2. Passation : quand la coordinatrice se clôt (hameçon Stop, ligne `close`), la session la plus ancienne restante devient coordinatrice. Elle le lit au prochain tour où elle consulte le registre (aucun message ne lui est envoyé).
3. Coordinatrice disparue : si l'expiration de la coordinatrice est passée (pas de close, pas d'écriture depuis 15 minutes), toute session qui le constate la déclare expirée (ligne `expire`) et la session la plus ancienne restante prend le relais.
4. Double revendication : si deux sessions se déclarent coordinatrices dans la même fenêtre, la plus ancienne (par `ts` de la ligne `open`) prime. L'autre se range et le déclare dans son rapport. Point d'exécution : lecture du registre au début de chaque tour (hameçon UserPromptSubmit) ; la lecture est passive et ne coûte qu'un accès fichier.

**(c) Pouvoirs bornés.** La coordinatrice répartit le travail en écrivant au registre les fichiers revendiqués par chaque session. Elle sérialise l'accès aux fichiers communs en les revendiquant pour elle-même ou pour une session nommée. Elle ne prend aucune décision qui relève du porteur : dépense, publication, geste irréversible, doctrine, arbitrage, écriture chez un produit (R-58). Elle n'arrête ni ne relance aucune session. Elle n'écrit pas dans le périmètre revendiqué d'une autre session, sauf si cette session est expirée. Point d'exécution : convention écrite, pas de mécanisme de blocage.

**(d) Adaptation au contexte.**
- Une session qui s'ouvre et trouve une coordinatrice : elle s'inscrit au registre, lit les fichiers revendiqués, et évite d'écrire dans les chemins déjà pris. Si elle a besoin d'un fichier pris, elle le note dans son rapport et attend le prochain tour.
- Une session qui s'ouvre et ne trouve pas de coordinatrice : elle devient coordinatrice (cas 1 de la règle b).
- Une session seule : elle est coordinatrice par défaut ; le registre ne lui coûte qu'une ligne.
- Le porteur parle directement à une session alors qu'une coordinatrice existe : la session exécute la demande du porteur. Le porteur prime sur la coordinatrice (R-29 : l'humain décide). La session déclare au registre les fichiers qu'elle va écrire ; si un conflit existe, elle le signale au porteur. Point d'exécution : hameçon UserPromptSubmit lit le registre et affiche les conflits potentiels.

**(e) Fichiers communs — un écrivain ou un verrou.**

Comment lire le tableau : chaque ligne nomme un fichier partagé, dit quel mécanisme lui donne un écrivain unique, et ce que ce mécanisme ne garantit pas.

| Fichier commun | Mécanisme proposé | Ce qu'il ne garantit pas |
|---|---|---|
| `forge/ledger.jsonl` | La coordinatrice est l'écrivain unique du ledger. Les autres sessions consignent leurs événements dans leur rapport ; la coordinatrice les y inscrit. Alternative : `forge/ledger.py` avec verrou de fichier (lockfile), comme `reserver-decision.mjs` | Qu'une session respecte la convention sans hameçon bloquant |
| `forge/mobilisation.jsonl` | La coordinatrice est l'écrivain unique. Les autres déclarent leur mobilisation au registre de sessions, la coordinatrice la transcrit | Idem |
| `output/README.md` | Régénéré par la session qui écrit le dernier livrable du tour. Pas de verrou : la régénération est idempotente si tous les fichiers sont présents | Qu'un README intermédiaire ne soit pas commité par une autre session |
| Indices de livrables (`output/`) | L'allocateur `allouer-indice.mjs` lit le disque ; si deux sessions l'appellent sans écrire entre les deux appels, elles obtiennent le même indice. Le registre de sessions résout le problème : chaque session réserve son indice au registre avant d'écrire | Que deux sessions sur deux postes différents ne prennent pas le même indice (inter-postes invisible) |
| Décisions D-N | Déjà résolu par `reserver-decision.mjs` (verrou de fichier, registre commun du poste, TF-1911). Pas de changement | Deux postes (collision résolue à la fusion, comme les D-24/25/26 du 18/10) |
| `forge/gestes-en-cours.jsonl` | Déjà résolu par `lib-gestes-en-cours.mjs` (append-only, expiration). Mais le fichier est ABSENT du produit : le hameçon `hook-gestes-distants.mjs` le crée à la première commande distante. Pas de changement | Qu'un produit sans geste distant ait le fichier |

**(f) Applicabilité — ce que Claude Code permet et ne permet pas.**

- Un message n'est lu qu'au tour suivant de sa destinataire : c'est pourquoi le registre est un fichier, pas un message. Un fichier est lu à chaque accès, sans attendre un tour.
- Seuls les hameçons bloquent un geste : un hameçon PreToolUse peut refuser un Write sur un chemin revendiqué. Le registre seul avertit ; l'hameçon bloque.
- Les sessions d'un autre poste sont invisibles : le registre ne couvre qu'un poste. Un produit sur deux postes a deux registres indépendants, comme le registre commun des D-N (D-83 (a)). La collision inter-postes se résout à la fusion.
- Un hameçon SessionStart s'exécute à l'ouverture de la session, une seule fois : il inscrit la session au registre. Un hameçon UserPromptSubmit s'exécute à chaque tour : il relit le registre et avertit.
- Un hameçon Stop s'exécute à la fermeture : il clôt la ligne. Si la session est tuée sans Stop, l'expiration (15 minutes) fait le ménage.
- L'hameçon n'a pas accès au contenu de la transcription d'une autre session : la preuve de vie est la date de modification du fichier `.jsonl`, pas son contenu. Ce choix est le même que celui de `lib-gestes-en-cours.mjs` (expiration plutôt que battement de cœur).

### O3 — O2, avec un hameçon bloquant sur les fichiers revendiqués

Identique à O2, sauf que le hameçon PreToolUse sur Write et Edit **refuse** (exit 2) l'écriture sur un chemin revendiqué par une autre session non expirée, au lieu d'avertir.

- Coût : moyen × court (O2 plus un exit 2 au lieu d'un avertissement).
- Ce qu'elle exclut : l'écriture concurrente, y compris légitime (deux sessions qui travaillent sur le même fichier à la demande du porteur).
- Ce qu'elle ne garantit pas : qu'un chemin non revendiqué soit protégé (une session qui oublie de revendiquer n'est pas bloquée).

### O4 — équipes d'agents Claude Code

Utiliser la fonctionnalité « agent teams » (expérimentale) pour que les sessions se voient et se coordonnent par le mécanisme natif de l'éditeur.

- Coût : très complexe × long. Fonctionnalité expérimentale, pas de reprise de session avec des équipiers en cours (source : documentation lue le 19/10/2026), pas de support CLI natif.
- Ce qu'elle exclut : les sessions ouvertes indépendamment (l'équipe doit être définie à l'avance).
- Ce qu'elle ne garantit pas : la stabilité (expérimental), ni le fonctionnement sur Windows natif.

## 5. Verdict

- **Option retenue** : O2.
- **Pourquoi O2 et pas O1** : une convention sans outillage n'a pas tenu sur des problèmes plus simples. Le contrat de campagne dit « ce qui appartient à une autre session se liste au rapport » depuis le 14/09/2026 ; le 14/11/2026, trois sessions écrivent dans les mêmes fichiers sans se voir. La convention existe, elle n'est pas tenue.
- **Pourquoi O2 et pas O3** : le blocage empêche un geste légitime quand le porteur demande à deux sessions de travailler sur le même fichier. L'avertissement suffit à rendre la collision visible ; le blocage se décide ensuite, sur la mesure de la période O2.
- **Pourquoi pas O4** : la fonctionnalité est expérimentale, ne supporte pas les sessions déjà ouvertes, et n'a pas été essayée sur ce poste.
- **Coût** : moyen × court. Un fichier de registre (`forge/sessions.jsonl`), trois hameçons (SessionStart, UserPromptSubmit, Stop) hérités par les produits, un script de lecture, une convention écrite. Aucune API tierce.
- **Candidature(s) émise(s)** : la décision D-218 est posée au porteur au format B (étape 3 du mandat).
- **Plan de revue** : 2026-12-01. Critères : le registre est peuplé par au moins 3 sessions du même produit ; 0 collision sur les fichiers communs pendant la période ; le porteur lit l'état des sessions en une commande.
- **Test rétro** :
  - Opérationnel → Tactique : le registre et les hameçons répondent aux 6 questions (P1 à P6). Le porteur lit l'état par un script.
  - Tactique → Stratégie : les sessions coopèrent par un mécanisme vérifiable, pas par une convention écrite non tenue.
  - Stratégie → Intention : le porteur voulait que les sessions travaillent ensemble sans se mettre en concurrence, qu'une prenne l'ascendant, et qu'il sache qui fait quoi. O2 donne les trois.
  - Questions rejouées : « comment chaque session déclare ce qu'elle fait ? » Par une ligne au registre, lue par un script. « Quelle session prend l'ascendant ? » La plus ancienne non expirée. « Que fait la coordinatrice ? » Elle répartit et sérialise, sans décider à la place du porteur. « Et si elle disparaît ? » L'expiration de 15 minutes, puis la plus ancienne restante.
