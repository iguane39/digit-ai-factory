---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-18
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — analyse critique de la flotte d'agents de la Factory et moyens de l'améliorer — 20261018a

Ce qui change pour vous : la flotte décrite par la doctrine n'est pas celle qui tourne. Sur 30 jours, 201 sous-agents ont été lancés sur ce poste, et 191 étaient des agents génériques, capables d'écrire partout. Aucun n'a reçu l'effort de sa classe de tâche, alors que la règle existe depuis le 13/10. Haiku n'a été demandé qu'une fois sur 157 appels. Aucun ledger n'a consigné un appel d'agent depuis le 25/09. Ce qui tient, ce sont les gardes : chaque livrable passe par un oracle exécuté, les agents n'écrivent que dans un dépôt et ne poussent jamais. L'étude recommande l'option O2 : une flotte nommée, dont chaque agent porte son modèle, son effort et ses outils, plus un relevé automatique de la flotte à chaque ouverture, au lieu d'une consignation à la main que personne ne fait.

## Seuil de déclenchement

L'étude est due : les remèdes touchent le noyau (`CONTRAT-INTERFACE.md` §4 et §4 bis), créent des objets durables (définitions d'agents, script de relevé) et concernent au moins 3 forges (pilot, forge-agents pour le juge `oracle-judge`, et les produits par l'héritage).

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande citée : « construis une analyse critique de cette flotte et des moyens de l'améliorer. » Elle suit la question du même jour : « Détaille la flotte d'agents utilisés par la Factory : un agent pour le pilotage du projet, puis des agents pour la réalisation des tâches ? », à laquelle la session a répondu « oui, avec une nuance : la flotte n'est pas permanente ».

Intention reconstruite : savoir si cette organisation, un pilote et des agents d'exécution, est bien conçue et bien appliquée, ce qu'elle coûte, où elle échoue, et quoi changer, avec de quoi décider. L'analyse est donc jugée sur deux points : chaque critique repose sur une mesure exécutée, et chaque remède dit son coût et ce qu'il exclut. La réponse précédente reposait sur la doctrine ; celle-ci confronte la doctrine aux transcriptions.

## 0. Traitement des entrants

Les entrants sont la doctrine du pilot et les traces du poste ; ils se citent, ils ne s'exécutent pas. Sources : `CONTRAT-INTERFACE.md` §1, §4, §4 bis, §5 ; `gabarits\AGENT-CAMPAGNE.md` ; `references\MODELES-EN-SERVICE.json` (1.2.0 du 2026-10-15) ; `BOUCLE-AMELIORATION.md` ; registre `todo\TODO.jsonl` (TF-1009, TF-1557, TF-1559, TF-1561, TF-1802) ; dépôt `digit-ai-forge-agents` (`defs\`, `.claude\agents\`, `oracle-judge.mjs`) ; transcriptions de Claude Code du poste DESKTOP-ULTRA7 sous `~\.claude\projects\`.

**Comment les chiffres ont été produits.** Tous sont mesurés dans cette session, le 2026-10-18, en lecture seule, par un script écrit pour l'occasion (`flotte.mjs`, dossier temporaire de la session). Il lit chaque transcription de session et de sous-agent, avec les champs `message.model`, `effort`, `usage`, l'en-tête `.meta.json` des sous-agents, et les appels de l'outil Agent avec leurs paramètres `model` et `effort`. Fenêtre : depuis le 2026-09-18 (30 jours), sauf mention « depuis le 13/10 ». Population : le seul profil `~\.claude` de ce poste ; l'autre poste n'est pas mesuré. Les 201 sous-agents et les 157 appels ne se recouvrent pas tout à fait : un sous-agent dont la session mère a commencé avant la fenêtre est compté sans son appel.

## 1. Partition du problème

La flotte se découpe en 7 questions disjointes ; chaque constat et chaque option s'y rattachent.

- **P1 — Composition.** Qui sont les agents, sont-ils spécialisés, nommés, réutilisés ?
- **P2 — Modèle.** Le modèle affecté suit-il le tableau de routage, et ce tableau a-t-il été confronté aux faits ?
- **P3 — Effort.** L'effort de réflexion suit-il la table par classe de tâche ?
- **P4 — Contrat et privilèges.** Chaque délégation porte-t-elle le contrat commun, et l'agent n'a-t-il que les outils de sa tâche ?
- **P5 — Coût et contexte.** Que coûte la flotte, et où part ce coût ?
- **P6 — Traçabilité et fiabilité.** Ce que font les agents est-il consigné, et leurs rapports sont-ils sûrs ?
- **P7 — Membres hors routage.** Des appels de modèle échappent-ils au tableau ?

## Diagnostic — constats mesurés

Cette partie confronte la doctrine aux transcriptions : 5 points qui tiennent, puis 15 constats chiffrés qui ne tiennent pas, chacun avec sa mesure et la règle qu'il contredit.

### Ce qui tient

Cinq garanties de la flotte sont tenues dans les faits, et les remèdes doivent les garder.

- **L'acceptation ne dépend pas de l'agent.** Un livrable n'est accepté que sur verdict d'oracle exécuté (`CONTRAT-INTERFACE.md` §1, « Jamais de validation par confiance »), et le pilot rejoue par sondage avant clôture (`BOUCLE-AMELIORATION.md`, entrée du 20/09 : « une régression d'agent trouvée au rejeu du pilot »).
- **Le rayon d'action d'un agent d'écriture est borné.** Un seul dépôt cible, commits locaux, « JAMAIS de push » (`gabarits\AGENT-CAMPAGNE.md:13` et `:87`), un seul écrivain du registre, et des arbres de travail séparés (`.claude\worktrees\c2-lot` relevé dans une transcription du 15/10).
- **Le pilot nomme le modèle.** 58 appels sur 60 du pilot passent `model` en paramètre (45 `sonnet`, 13 `opus`).
- **Sonnet tient les tâches confiées.** Aucune escalade de modèle sur les 3 campagnes journalisées (`BOUCLE-AMELIORATION.md:500`, `:556`, `:598`), dont 10 tranches de construction en Sonnet 5.
- **La table d'effort est fondée.** Elle vient d'un rejeu figé de 38 exécutions (`output\03-etudes\20261001-etude-resultats-rejeu-opus-5-5.md`), pas d'un avis.

### Ce qui ne tient pas

Le tableau donne, pour chaque constat, la partie du problème qu'il touche, la mesure qui l'établit et l'écart à la règle écrite. Comment le lire : les lignes sont triées par partie, de P1 à P7, et non par gravité ; la colonne « Mesure » ne porte que des chiffres relevés ce jour sur ce poste, sauf mention d'un identifiant du registre (TF-) qui renvoie à une mesure passée ; les constats sans mesure ont été exclus. Les plus coûteux sont M-03, M-05 et M-12, parce qu'ils empêchent les autres d'être corrigés ou vus.

| Id | Partie | Constat | Mesure | Écart à la règle |
|---|---|---|---|---|
| M-01 | P1 | La flotte est faite d'agents génériques | 191 sous-agents `general-purpose` sur 201, 9 `Explore`, 1 `claude-code-guide` ; 0 agent compilé lancé ; outil Workflow : 0 appel | La fabrique d'agents de forge-agents n'a que 3 définitions d'essai (`defs\`), jamais utilisées hors du run d'essai |
| M-02 | P2 | Haiku n'est presque jamais employé | 1 appel sur 157 demande `haiku` ; 2 sous-agents servis par Haiku sur 201 | Le tableau §4 affecte à Haiku « extraction, reformatage, vérifications simples » ; 45 sous-agents du pilot du 02/10 étaient des vérifications d'état en lecture seule, servies par Sonnet 5 |
| M-03 | P2 | Chez les produits, le modèle est hérité | 75 appels sur 97 dans les sessions de produits ne passent pas `model` ; ils prennent Opus à l'effort de la session (33 sous-agents Opus 5.5 servis à l'effort max sur 30 jours) | Le tableau §4 vaut pour toute délégation ; les produits ne le reçoivent pas |
| M-04 | P2 | Le re-test du routage est dû et contradictoire | `MODELES-EN-SERVICE.json` : `re_test_regle_de_challenge.statut = "du"`, `clos_par = null` ; TF-1559 (le rejeu) est pourtant « corrige » au registre depuis le 13/10 | Le rejeu n'a couvert ni Sonnet 5.5 ni Haiku ; la classe « mécanique » n'a jamais été mesurée |
| M-05 | P3 | L'effort n'est jamais transmis à un agent | 0 appel sur 157 passe `effort` ; 0 sur 28 depuis le 13/10 | `AGENT-CAMPAGNE.md`, « Effort de l'agent (TF-1557) » : « Le pilot lance chaque agent Opus à l'effort de la classe de sa tâche » |
| M-06 | P3 | La correction de TF-1561 porte sur une population vide | Clos « corrige » le 13/10 : « Un agent compilé tourne à high » ; or 0 agent compilé a été lancé sur 201 | Gain constaté sur un échantillon de 3 définitions, sans effet sur la flotte réelle (règle S74) |
| M-07 | P3 | L'effort de Sonnet n'est décidé nulle part | Depuis le 13/10, 17 sous-agents Sonnet 5.5 du pilot sur 17 tournent à `medium` | La table `effort_par_classe` ne couvre que la famille `opus` |
| M-08 | P4 | Le contrat commun n'accompagne pas une délégation d'écriture sur deux | Sur 31 sous-agents d'écriture du pilot (campagne, exécution, vague), 14 citent `AGENT-CAMPAGNE`, « Écarts à la lettre » ou « G-2 » dans leur consigne | Le gabarit existe pour qu'« un oubli » ne soit pas « un incident potentiel » (`AGENT-CAMPAGNE.md`, en-tête) ; le classement « écriture » se fait sur le libellé de l'agent, c'est une heuristique |
| M-09 | P4 | La lecture seule est une consigne, pas une borne | 45 sous-agents du pilot se disent « lecture seule » dans leur consigne, et tournent avec l'agent générique, qui peut écrire ; `Explore`, en lecture seule par ses outils, sert 9 fois sur 201 | Moindre privilège non outillé ; `NIVEAUX.md` compte « un agent qui peut écrire » comme un effet |
| M-10 | P5 | Les sous-agents pèsent autant que le pilotage dans la relecture | Pilot, 30 jours : sessions 3,82 milliards de jetons relus en cache, sous-agents 3,83 milliards ; sorties 13,5 contre 6,7 millions | Chaque sous-agent part avec 52 158 jetons de contexte en médiane (minimum 29 640) et fait 41 appels d'outils en médiane |
| M-11 | P5 | Les sessions de pilotage dépassent le seuil | 14 derniers jours : 3 sessions sur 14 au-delà de 400 000 jetons, 54 % du contexte relu au-delà du seuil, jusqu'à 871 000 (`scripts\relever-contexte-sessions.mjs`) | §4 quater : une session neuve par mandat |
| M-12 | P6 | Le ledger ne voit plus les agents | 8 ledgers modifiés depuis le 25/09 : 0 entrée `invocation` datée d'après le 25/09, 0 champ `modele_version` | §1 : chaque invocation se consigne avant et après ; `ledger.mjs` sait relever la version (l.256) mais n'est pas appelé |
| M-13 | P6 | Le journal des campagnes s'est arrêté | Dernière campagne journalisée dans `BOUCLE-AMELIORATION.md` : 01/10 ; campagnes du 02/10 (plus de 50 sous-agents), du 12/10 et du 15/10 absentes ; `escalade_modele` consigné 3 fois en tout | §4 bis : « l'absence d'escalade est une donnée, pas un silence » ; le tableau §4 reste un a priori |
| M-14 | P6 | Les chiffres des rapports d'agents sont fragiles | TF-1802 : 13 087 établissements annoncés par un agent, 9 872 recomptés en base ; TF-1009 : 6 erreurs de mesure en une journée, 0 trouvée par son auteur | Règle S76 (recompte à la source), avertissante seulement |
| M-15 | P7 | Le juge externe tourne sur une ancienne génération | `oracle-judge.mjs` lance `claude -p` sans `--model` quand `QO_JUGE_MODELE` est absent (l.29 et l.149) ; la CLI npm du poste est en 2.1.107 contre 2.1.299 pour l'extension ; 12 sessions de juge depuis le 13/10 servies par `claude-opus-4-6`, sans effort | Hors tableau §4 ; relevé par MS2 à chaque ouverture, en avertissement, sans suite |

### Lecture d'ensemble

Le schéma retenu, un pilote qui décompose et des agents qui exécutent puis rendent un rapport, est le motif « orchestrateur et exécutants » que décrit Anthropic. La critique ne porte pas sur ce choix. Elle porte sur l'écart entre la doctrine et le point d'appel : chaque règle de la flotte (modèle, effort, contrat, lecture seule, consignation) dépend de ce que la session écrit dans la consigne au moment de l'appel. Aucune n'est portée par une définition d'agent ni vérifiée par un juge. La loi n° 1 du noyau, « toute affordance est câblée ou n'existe pas », n'est pas tenue pour la flotte : la table d'effort existe, son juge MS5 ne lit que le réglage du poste, et aucun appel ne l'applique.

Le coût suit la même pente. Sans effort ni modèle déclarés, l'agent prend ceux de la session, et la session de pilotage tourne à l'effort le plus haut. Sans consignation automatique, le §4 bis ne reçoit plus de mesure depuis le 01/10. Le tableau de routage ne peut donc ni descendre ni monter d'un cran, ce qui était son principe.

## 2. Non-recouvrement contre l'existant

Avant de proposer un outil neuf, chaque pièce existante qui pourrait déjà faire le travail est examinée, avec sa citation et ce qu'elle couvre ou non.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Fabrique d'agents de forge-agents | `digit-ai-forge-agents\README.md` : « produit leurs définitions au format `agent.def` et les compile en subagents Claude Code (`.claude/agents/*.md`) » ; `compile-agent-def.mjs` porte `modele` et `effort` depuis TF-1421 et TF-1561 | recouvre l'outil : O1 et O2 l'emploient pour produire la flotte, au lieu d'écrire les définitions à la main |
| Gabarit d'agent de campagne | `gabarits\AGENT-CAMPAGNE.md`, « Le prompt d'un agent devient : référence à ce gabarit + delta spécifique » | recouvre le contenu du contrat ; ne recouvre pas son application, qui reste à la main (M-08) |
| Oracle des modèles en service | `oracles\oracle-modeles-en-service.mjs`, MS2 à MS5 | recouvre la version servie et le réglage du poste ; ne recouvre pas les appels d'agents (M-05) |
| Relevé du contexte des sessions | `scripts\relever-contexte-sessions.mjs`, « sous-agents : 21, dont 0 au-delà » | recouvre le contexte relu ; ne recouvre ni le modèle, ni l'effort, ni le type d'agent |
| Ledger de run | `CONTRAT-INTERFACE.md` §1, objet `invocation` ; `ledger.mjs append` | recouvre le format ; ne recouvre pas la collecte, qui dépend d'un appel volontaire (M-12) |
| Projection OTLP du ledger | `README.md` de forge-agents, « Projection OTLP GenAI du ledger », statut expérimental | recouvre l'export vers un outil d'observabilité ; vide tant que le ledger est vide |
| Gate budget G0 | `README.md` de forge-agents, « `.queue\gates\g0-budget.sh` (hook PreToolUse) » | ne recouvre pas : absent de `~\.claude\settings.json` et de `.claude\settings.json` du pilot (0 occurrence) |
| Forge agents-security | `CONTRAT-INTERFACE.md` §5, `oracle-scan-toolcalls.mjs <journal.jsonl>` ; dette « jamais exercée sur agent réel » | ne recouvre pas aujourd'hui ; O2 lui donne une matière, les transcriptions de sous-agents |

## 3. État de l'art daté

Cinq sources datées de moins de 24 mois disent comment la pratique organise une flotte d'agents ; chacune est citée avec ce qu'elle apporte ici.

- **Anthropic, « How we built our multi-agent research system »**, 2025-06-13, `anthropic.com/engineering/multi-agent-research-system` : un système multi-agents consomme environ 15 fois les jetons d'une conversation ; l'usage de jetons explique 80 % de la variance de performance ; « Each subagent needs an objective, an output format, guidance on the tools and sources to use, and clear task boundaries » ; un pilote Opus 4 avec des sous-agents Sonnet 4 dépasse de 90,2 % un Opus 4 seul.
- **Anthropic, « Building effective agents »**, 2024-12-19, `anthropic.com/engineering/building-effective-agents` : motif « orchestrator-workers » ; « consider adding complexity only when it demonstrably improves outcomes ».
- **Cognition, « Don't Build Multi-Agents »**, 2025-06-12, `cognition.com/blog/dont-build-multi-agents` : « Share context, and share full agent traces » ; « Actions carry implicit decisions, and conflicting decisions carry bad results » ; des sous-agents en parallèle ne voient pas les hypothèses des autres.
- **Claude Code, documentation « Subagents »**, lue le 2026-10-18 (page citant la version 2.1.296), `code.claude.com/docs/en/sub-agents` : champs `tools`, `disallowedTools`, `model` et `effort` dans la définition d'un agent ; ordre de résolution du modèle : paramètre d'appel, puis définition, puis `CLAUDE_CODE_SUBAGENT_MODEL`, puis la session ; `Explore` est en lecture seule et prend le modèle de la session, sauf agent de projet nommé `Explore` avec `model: haiku` ; imbrication par défaut jusqu'à 3 niveaux, `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` pour la borner.
- **Dash0, « OpenTelemetry GenAI semantic conventions explained »**, mise à jour du 2026-09-14, `dash0.com/knowledge/opentelemetry-genai-semantic-conventions-explained` : spans `invoke_agent` et `execute_tool`, attributs `gen_ai.agent.name` et `gen_ai.agent.id` ; les conventions sont encore au statut « Development » selon des relevés du dépôt d'août 2026, d'où l'épinglage d'une version si on s'y fie.

Ce que l'état de l'art apporte ici : le schéma de la Factory est celui que la pratique recommande ; ce qui manque, la spécialisation déclarée (outils, modèle, effort par agent) et la trace complète des agents, est ce que la documentation de Claude Code outille déjà.

## 4. Options — jeu fermé O0-O4

Cinq options, de l'inaction à la refonte, chacune avec son contenu, son coût en complexité × durée et ce qu'elle exclut.

- **O0 — ne rien faire.** Réfutée. Coût du statu quo, mesuré : la règle d'effort du 13/10 n'est appliquée à aucun appel (M-05) ; les produits délèguent à Opus à l'effort de la session (M-03) ; le tableau de routage ne reçoit plus de mesure depuis le 01/10 (M-13) ; le juge externe tourne sur Opus 4.6 (M-15). Chaque nouvelle version de modèle accroît l'écart, puisque le re-test n'a pas de matière.
- **O1 — Câbler la flotte au point d'appel.** Contenu : 5 agents de projet nommés, générés par le compilateur de forge-agents, posés dans `.claude\agents\` du pilot et propagés aux produits par l'héritage : `explorateur` (outils Read, Grep, Glob, Bash ; `haiku` ; effort `low`), `verificateur` (lecture seule ; `sonnet` ; `medium`), `campagne` (écriture dans un dépôt ; `sonnet` ; `high` ; le contrat `AGENT-CAMPAGNE.md` dans sa consigne système), `constructeur` (`opus` ; `high`), `redacteur` (production de documents ; `sonnet` ; `high`). Un agent `Explore` de projet en `haiku` remplace le natif. Un hook PreToolUse sur l'outil Agent avertit quand l'appel vise l'agent générique, sans le bloquer d'abord. Le juge `oracle-judge` reçoit un modèle par famille (`QO_JUGE_MODELE`, ou la CLI de l'extension). La table d'effort reçoit une ligne pour la famille `sonnet`. Coût : moyen × court. Exclut : le choix libre du modèle à chaque appel, sauf dérogation dite.
- **O2 — O1, plus une mesure automatique de la flotte.** Contenu : O1, et le relevé de cette étude devient `scripts\relever-flotte.mjs` avec sa recette à double sens, joué à chaque ouverture par `hook-ouverture.mjs`. Il rend la part d'appels hors flotte nommée, le modèle et l'effort servis par agent, les jetons, et la part de délégations d'écriture sans contrat. Il écrit une ligne datée par campagne dans un journal de flotte, qui remplace la consignation manuelle du §4 bis et alimente le ledger et sa projection OTLP. Le re-test de routage dû se joue alors sur 2 classes jamais mesurées (vérification et extraction : Haiku contre Sonnet 5.5) au premier relevé qui en porte 2 tranches comparables. Coût : moyen × court pour le script et le hook ; le re-test, simple × court en dépense de modèle. Exclut : la consignation à la main comme source de vérité.
- **O3 — Orchestration déterministe des campagnes.** Contenu : O2, et les campagnes multi-dépôts passent par des scripts de workflow ou des pipelines `agent.def` compilés (découpage, exécution, vérification par un second agent, recompte). Coût : complexe × moyen. Exclut : la conduite conversationnelle des campagnes ; ajoute une couche que l'état de l'art demande de justifier par un gain démontré, qu'aucune mesure ne fournit encore.
- **O4 — Réduire la délégation.** Contenu : le pilot fait lui-même ce qu'il délègue, sauf les campagnes multi-dépôts. Coût : simple × court. Exclut : l'isolement du contexte ; or les sessions de pilotage dépassent déjà le seuil (M-11) et chaque agent épargne au pilot ses 41 appels d'outils médians. Réfutée sur ces mesures.

## 5. Verdict

Une seule option est retenue ; le verdict dit pourquoi, ce qu'elle coûte, quand elle sera confrontée aux faits et comment elle remonte à votre demande.

- **Option retenue** : O2.
- **Pourquoi O2 et pas O1** : O1 corrige la flotte, mais sans relevé on ne saurait pas qu'elle est appliquée ; TF-1561 a été clos sur une correction qui n'atteignait aucun agent réel (M-06). Le relevé est la preuve que les remèdes servent.
- **Coût** : moyen × court (5 définitions générées, 1 hook avertissant, 1 ligne de table, 1 variable du juge, 1 script de relevé avec recette) ; le re-test de 2 classes, simple × court. Dette : le hook passe en blocage seulement après la revue.
- **Candidature(s) émise(s)** : aucune dans ce tour, la demande étant une analyse. 4 candidatures sont prêtes à déposer sur votre accord : (1) flotte nommée et hook d'avertissement (pilot, forge-agents, héritage des produits) ; (2) relevé de flotte à l'ouverture et journal de flotte (pilot) ; (3) modèle du juge externe (forge-agents, `oracle-judge.mjs`) ; (4) rouvrir TF-1561, clos sur une population vide, et mettre `MODELES-EN-SERVICE.json` en accord avec TF-1559.
- **Plan de revue** : 2026-11-01, sur le relevé de flotte des 14 jours précédents. Critères écrits d'avance : au moins 90 % des appels d'agents visent un agent nommé ; 0 délégation Opus sans effort déclaré ; au moins 1 classe où Haiku ou Sonnet est mesuré contre le modèle supérieur ; jetons relus par les sous-agents du pilot rapportés au nombre d'agents, en baisse sur la période du 2026-09-18 au 2026-10-18 (52 158 jetons d'ouverture et 41 appels d'outils en médiane) ; 0 session de juge hors génération courante.
- **Test rétro** :
  - *Opérationnel → Tactique* : chaque élément de O2 (définitions, hook, ligne Sonnet, variable du juge, relevé) corrige au moins un constat M-01 à M-15 ; aucun n'est retenu sans constat.
  - *Tactique → Stratégie* : la stratégie est de faire porter les règles de la flotte par sa définition et de les vérifier par un relevé, plutôt que par la mémoire de la session au moment de l'appel ; c'est la loi n° 1 appliquée à la délégation.
  - *Stratégie → Intention* : la demande était une analyse critique et des moyens d'amélioration. L'analyse sépare ce qui tient (5 points) de ce qui ne tient pas (15 constats mesurés), et les moyens sont des options fermées, chiffrées en complexité × durée, avec ce qu'elles excluent.
  - *Questions du demandeur rejouées* : « une flotte avec un agent de pilotage, puis des agents de réalisation ? » — oui dans la doctrine ; dans les faits, des agents génériques dont le modèle, l'effort et les droits dépendent de la consigne du moment (M-01 à M-09). « Les moyens de l'améliorer ? » — O2, et 4 candidatures prêtes sur votre accord.
  - *Rupture constatée* : aucune. Limite dite : un seul poste et un seul profil sont mesurés.
