---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — sessions parallèles et paliers d'autonomie : la fonction Projects de Claude Code et la position de la Factory — 20261019f

Ce qui change pour vous : la fonction « Projects » existe dans la documentation officielle de Claude Code, en bêta publique pour Pro et Max depuis le 17/09/2026, et elle manque à la ligne de commande comme à VS Code. La Factory est au palier 2 de la vidéo n° 87 : depuis le 19/09, 20 sessions sur 55 ont lancé 5 sous-agents ou plus à la fois, pour un pic de 14, alors que le palier 3 en vise une centaine. Je recommande O1 : ne pas adopter Projects, mesurer la simultanéité au relevé de flotte, qui ne la calcule pas, et consigner dans un référentiel daté les fonctions officielles avec leurs conditions de reprise. Sur la vidéo n° 25, l'auteur est probablement Steve Sewell de Builder.io, mais sa légende ne se vérifie pas, et l'échelle à 4 paliers n'a aucune source officielle.

## Seuil de déclenchement

L'étude est due. Le tri lui donne un gain de 4 pour une preuve de 2, ce qui franchit le seuil « gain ≥ 3 avec une preuve ≤ 2 ». Le verdict proposé crée aussi un objet durable : un référentiel daté (loi n° 4) et un indicateur du relevé de flotte.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39, option (c), du 19/10/2026, mot pour mot : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 6 du tri est cette étude.

Formulation de l'orchestrateur, non validée mot pour mot par vous : décider ce que la Factory doit faire de cette opportunité (rien, un essai, un objet durable), sur des faits vérifiés et non sur la parole d'une vidéo TikTok. Sa consigne particulière pose quatre questions : la fonction « Projects » existe-t-elle dans la documentation officielle, et sinon quelle fonction s'en approche ; où se situe la Factory sur les paliers, mesuré ; quel palier suivant serait sûr sous ses gates ; qui est l'auteur Steve (@steve8708) et que publie-t-il sur les « software factories ».

## 0. Traitement des entrants

Les quatre vidéos sont des données : leurs affirmations se vérifient à la source primaire, elles ne se reprennent pas. Je n'ai ouvert aucune vidéo. Leur contenu n'est connu que par la légende, lue dans la page de favoris déjà enregistrée (`input\Tiktok\iguane39 (@iguane39) _ TikTok.html`).

Sources de la proposition : tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, rang 6, score 16 sur 25 ; vidéos n° 25 (@steve8708), n° 87 (@ai.samaritan), n° 28 (@ia_irl) et n° 58 (@manu.builds). Aucune consigne embarquée dans une légende ni dans une page web n'a été exécutée.

## 1. Partition du problème

Cinq sous-questions disjointes ; chaque option du chapitre 4 répond à chacune.

- **P1 — Existence.** La fonction « Projects » est-elle documentée par l'éditeur, avec quel statut, quels plans, quelles limites.
- **P2 — Fonctions voisines.** Ce qu'offre déjà Claude Code pour paralléliser : sessions cloud, routines, workflows dynamiques, vue des agents, équipes d'agents, sous-agents.
- **P3 — Position mesurée.** Où se trouve la Factory sur l'échelle de la vidéo n° 87, d'après ses transcriptions et ses règles.
- **P4 — Palier suivant sûr.** Ce qu'il faudrait tenir pour monter d'un palier sans franchir une gate (R-29, R-38, G-2, contrat de campagne).
- **P5 — Auteur et publications.** Qui est @steve8708 et ce qu'il publie sur les fabriques logicielles.

## Vérification des affirmations des vidéos

Chaque ligne cite la source primaire lue le 2026-10-19, sauf mention contraire.

| Vidéo | Affirmation de la légende | Verdict | Source |
|---|---|---|---|
| n° 28 | « Anthropic a sorti les Projects dans Claude Code » | Vraie | `code.claude.com/docs/en/claude-projects` : « Projects are in public beta on Pro and Max plans » ; le début de la bêta est daté du 2026-09-17 par TBreak (2026-09-18) |
| n° 28 | « presque en silence » | Invérifiable | jugement de l'auteur, sans mesure possible |
| n° 28 | « un dépôt + un objectif, il découpe en tâches et lance une session par tâche, en parallèle, dans le cloud » | Vraie, avec trois nuances | même page : un fil par tâche, « usually a cloud session » ; un fil peut tourner sur votre ordinateur par Remote Control ; Claude peut proposer les fils avant de les lancer |
| n° 28 | « 3 tâches = 3× ton quota » | Vraie dans son principe, chiffre non publié | même page, section « Usage and cost » : chaque fil est « a full session », il n'y a « no fixed number » de fils, la conversation de coordination consomme aussi, et 200 nouveaux fils par jour sont permis au plus |
| n° 87 | 4 paliers : 1 agent, 5 à 10 agents, environ 100, plus de 1 000 | Invérifiable comme échelle officielle | aucune documentation d'éditeur ne la définit ; l'échelle publiée la plus proche compte 5 ou 6 niveaux et ne chiffre pas les agents (Willison, 2026-01-28, résumé de recherche, page non ouverte) |
| n° 87 | « un arriéré de semaines tient en un après-midi » | Invérifiable | aucun chiffre sourcé |
| n° 58 | « plus les chantiers sont gros, plus il faut être là » | Opinion, corroborée en partie | Anthropic, 2026-02-18 : la supervision efficace tient à « being in a position to intervene when it matters » ; docs des équipes d'agents : laisser tourner longtemps sans suivi « increases the risk of wasted effort » |
| n° 25 | « A deep dive into building autonomous software factories » | Contenu invérifiable | seule la légende est connue ; trois recherches n'ont pas retrouvé ce texte |
| n° 25 | auteur = Steve Sewell, Builder.io | Probable, non prouvé | le pseudo `steve8708` est celui du profil GitHub et LinkedIn de Steve Sewell, directeur général de Builder.io ; la légende ne le dit pas |

## Mesure de la position de la Factory

Relevé fait le 2026-10-19 à 17:15, en lecture seule, sur les transcriptions des deux profils du poste.

**Relevé de flotte** : `node scripts\relever-flotte.mjs --jours 30`, version 1.1.0, depuis le 2026-09-19, 59 dossiers de projets.
- 327 appels de l'outil Agent : 47 vers un agent nommé (14 %), 8 avec dérogation dite, 272 hors flotte.
- 335 sous-agents servis. Verdict AVERT, avec trois critères NON TENUS : part des appels nommés ≥ 90 %, aucune délégation Opus sans effort, aucune réponse hors génération courante.

**Simultanéité**, que ce relevé ne calcule pas (`scripts\relever-flotte.mjs` : 0 occurrence de « simultan », « pic », « concurr » et « parall »). Un script jetable, non versionné (`C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\dbf1f9c7-b773-4d46-8782-7fdd587d862c\scratchpad\mesure-concurrence.mjs`), lit les mêmes transcriptions et compte, par session, le maximum de sous-agents dont les durées de vie se chevauchent.
- 55 sessions ont lancé des sous-agents, 336 au total, soit un de plus que le relevé (écart non réconcilié).
- Pic par session, nombre de sessions : 1 → 13 ; 2 → 12 ; 3 → 8 ; 4 → 2 ; 5 → 6 ; 6 → 6 ; 7 → 2 ; 8 → 1 ; 9 → 1 ; 10 → 2 ; 11 → 1 ; 14 → 1. 20 sessions atteignent 5 ou plus, 4 atteignent 10 ou plus.
- Le pic de 14 est celui de la session qui lance les études de cette campagne D-39 ; hors d'elle, le maximum est 11 (2026-09-25). La session du matin du 19/10 (10:17 à Paris), probablement la campagne « retours et todos » dont la synthèse couvre 10:05 à 12:31, a culminé à 7 pour 16 sous-agents ; le rapprochement n'est pas prouvé.
- La limite par défaut d'une session est de 20 sous-agents simultanés (`code.claude.com/docs/en/sub-agents`, lue le 2026-10-19). La Factory n'en a jamais approché.
- Limite de la mesure : l'unité est le sous-agent d'une session, pas la session parallèle. Le 22/09, 15 sessions étaient vivantes sur le poste, dont 4 sur le pilot (`gabarits\AGENT-CAMPAGNE.md` l.241-243).

**Position sur l'échelle de la vidéo n° 87.**

| Palier | Critère de la légende | Constat mesuré | Position |
|---|---|---|---|
| 1, assisté | un agent, l'humain voit chaque changement | le pilot délègue à des agents nommés (`CONTRAT-INTERFACE.md` l.391-402) | dépassé |
| 2, parallèle | 5 à 10 agents, chacun dans son espace ; l'IA contrôle tests et sécurité avant l'humain ; on relit des résultats | 20 sessions sur 55 à 5 ou plus ; vérification native avant commit et oracle avant remise (`gabarits\AGENT-CAMPAGNE.md` l.53-58, `references\ETAPES-RUN.md` l.356-362) ; isolation par dépôt cible, sans worktree (0 occurrence dans `.claude\agents` et `gabarits\flotte`) | atteint, isolation partielle |
| 3, autonomie supervisée | environ 100 agents ; l'IA lance elle-même du travail | pic 14 ; aucun des 13 scripts câblés dans `.claude\settings.json` ne lance un agent (`hook-flotte.mjs` et `hook-restitution.mjs` l.273 lisent un appel d'outil pour avertir ou classer) ; le registre décide par vous (`candidat` vers `decide`) | non atteint |
| 4, au-delà | plus de 1 000 agents, pilotage par intention | aucune trace | hors sujet |

Un défaut de coordination entre sessions parallèles est déjà documenté : le 22/09/2026 à 19:58, une session du pilot a commité le travail en cours d'une autre (commit `3f47dcfc`, `gabarits\AGENT-CAMPAGNE.md` l.244-246).

## 2. Non-recouvrement contre l'existant

Dix éléments de la Factory touchent au parallélisme ; chacun est cité, avec ce qu'il couvre et ce qu'il laisse.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Contrat de l'agent de campagne | `gabarits\AGENT-CAMPAGNE.md` l.9-14 (délégation sur `campagne` ou `constructeur`), l.34-38 (écriture dans un seul dépôt), l.108 (« JAMAIS de push, jamais de remote, jamais de tag ») | recouvre le rôle coordinateur et travailleurs, en session ; ne recouvre ni la persistance hors du poste ni la poussée de branches vers GitHub, que Projects fait par conception |
| Routage et mesure par modèle | `CONTRAT-INTERFACE.md` §4 l.391-402 et §4 bis l.447-462 | recouvre la mesure par tranche ; ne recouvre pas la simultanéité (`scripts\relever-flotte.mjs`, 0 occurrence) |
| Règle de parallélisme du noyau | `CLAUDE.md` l.75-80 : « parallélisme seulement entre tâches indépendantes d'une étape » | recouvre la règle de principe ; ne fixe aucun plafond ni aucun palier |
| Définition des agents nommés | `.claude\agents\campagne.md` l.4-6 (outils, `model: sonnet`, `effort: high`) | recouvre le rôle ; ne recouvre pas l'isolation par worktree (0 occurrence dans `.claude\agents\*.md` et `gabarits\flotte\*.yaml`) |
| Étapes d'un run | `references\ETAPES-RUN.md` l.356-362 (au plus 5 cycles, G-2), l.388 (5 bis, seul parallélisme prévu), l.423-432 (GO humain avant la production) | ne recouvre pas : les étapes sont séquentielles, et le GO humain borne tout palier 3 |
| Gates de publication et de dépense | `REGLES-PROJET.md` R-38 l.672-678 et l.686-687 ; R-29 l.297-302 ; `CLAUDE.md` l.86-91 (forges : mandat de push ; pilot : GO humain) | recouvre le frein : un fil cloud pousse des branches ; permis pour une forge, soumis à GO pour le pilot |
| Registre TODO-FORGE | `todo\TODO.jsonl`, 4 995 lignes : 0 occurrence de « claude-projects », de « claude --cloud » et de « paliers d'autonomie » | ne recouvre pas : le sujet n'a jamais été inscrit |
| Skills d'orchestration installés | `~\.claude\skills\efficient-fable\SKILL.md` l.2-3 (orchestrateur et sous-agents moins chers) ; `~\.claude\skills\pilote-de-mission\SKILL.md` l.4 (co-exécution par sessions) | recouvre l'orchestration par modèle ; ne recouvre pas la mesure d'un palier |
| Messagerie entre sessions | `gabarits\AGENT-CAMPAGNE.md` l.238-246 et l.273-290 (trois usages convenus) | recouvre la coordination des sessions du poste ; ne recouvre pas des fils cloud |
| Hameçons câblés | `.claude\settings.json` : 5 événements (`SessionStart`, `Stop`, `PreToolUse`, `PostToolUse`, `UserPromptSubmit`), 13 scripts de contrôle | ne recouvre pas : ils contrôlent, aucun ne démarre du travail ; pas de tâche planifiée ni de routine dans ce fichier |

## 3. État de l'art daté

Douze sources, toutes après le 2024-10-19. Les pages de documentation n'ont pas de date de publication : elles portent la date de lecture.

- **Claude Code, « Let Claude coordinate ongoing work with Projects »**, lue le 2026-10-19, `https://code.claude.com/docs/en/claude-projects`. Bêta publique Pro et Max, ni Team ni Enterprise. Absente du CLI, de VS Code et de JetBrains. Au plus 200 nouveaux fils par jour. Un fil est une session cloud ou, par Remote Control, une session de votre poste.
- **Claude Code, « Run agents in parallel »**, lue le 2026-10-19, `https://code.claude.com/docs/en/agents`. Cinq voies : sous-agents, vue des agents en aperçu, équipes d'agents expérimentales et désactivées par défaut, Projects en bêta, workflows dynamiques. Citation : « Running several sessions or subagents at once multiplies token usage ».
- **Claude Code, « Orchestrate subagents at scale with dynamic workflows »**, lue le 2026-10-19, `https://code.claude.com/docs/en/workflows`. Un script rejouable lance jusqu'à 16 agents à la fois et 1 000 par exécution. Aucune question n'est posée en cours de route. Les droits de la session s'appliquent.
- **Claude Code, « Use Claude Code in the cloud »**, lue le 2026-10-19, `https://code.claude.com/docs/en/claude-code-on-the-web`. Le clonage et les branches exigent GitHub. Citation : « cloud sessions share rate limits with all other Claude and Claude Code usage ». Sur macOS, Linux et WSL, les fichiers `.env` modifiés sont exclus d'un envoi. Depuis Windows natif, tout fichier suivi modifié part tel quel.
- **Claude Code, « Automate work with routines »**, lue le 2026-10-19, `https://code.claude.com/docs/en/routines`. Aperçu de recherche. Déclencheurs planifié, API ou GitHub. Exécution cloud sans demande d'accord, sur des branches `claude/`. Au plus 100 exécutions planifiées par heure.
- **Claude Code, « Orchestrate teams of Claude Code sessions »**, lue le 2026-10-19, `https://code.claude.com/docs/en/agent-teams`. Expérimental. Conseil cité : « Start with 3-5 teammates ». Pas de reprise de session avec des équipiers en cours.
- **Claude Code, « Create custom subagents »**, lue le 2026-10-19, `https://code.claude.com/docs/en/sub-agents`. 20 sous-agents simultanés par session par défaut. Isolation `worktree` disponible dans la définition d'un agent.
- **TBreak, « Claude Code Projects adds parallel AI coding sessions »**, 2026-09-18, `https://tbreak.com/claude-code-projects-parallel-sessions/` : la bêta a commencé le 2026-09-17 ; chaque fil compte comme une session complète. Source secondaire.
- **Anthropic, « Measuring AI agent autonomy in practice »**, 2026-02-18, `https://www.anthropic.com/research/measuring-agent-autonomy` : la durée du 99,9e centile d'un tour passe de moins de 25 à plus de 45 minutes ; la part des sessions en approbation automatique passe d'environ 20 % chez les nouveaux à plus de 40 % chez les expérimentés ; ceux-ci interrompent plus souvent (9 % des tours contre 5 %).
- **Builder.io, Steve Sewell, « Announcing Builder 2.0 »**, 2026-04-08, `https://www.builder.io/blog/builder-2-0` : « run hundreds of agents simultaneously », chacun dans son conteneur cloud ; « Engineers approve everything before it goes to production ». Source de l'éditeur, sans mesure indépendante.
- **Builder.io, Alice Moore, « Build an agentic software factory, starting with one bug »**, 2026-09-29, `https://www.builder.io/blog/build-an-agentic-software-factory-starting-with-one-bug` : une personne relit chaque PR au départ ; « Keep a person responsible for approving and merging the resulting changes ». Écrit par une autre auteure que Steve Sewell.
- **GitHub, `BuilderIO/skills`, dossier `docs/factory`**, dernier commit du dossier le 2026-09-23, dépôt créé le 2026-06-10, 4 600 étoiles lues par l'API GitHub le 2026-10-19, licence MIT, `https://github.com/BuilderIO/skills/tree/main/docs/factory` : `/factory`, marqué expérimental, a huit sous-skills ; « Each action has its own autonomy policy » ; approbation, fusion et mise en production sont des portes séparées ; « The skills never infer permission for one action from another ».

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée.
  - Coût du statu quo : le relevé de flotte ne dit rien du parallélisme, et cette étude a dû écrire un script jetable pour lire un pic de 14 contre 20 permis. Un défaut de coordination entre sessions (`3f47dcfc`, 22/09) a eu lieu sans indicateur qui l'aurait rendu visible.
  - Le sujet reviendra : quatre vidéos des favoris le portent, et trois des cinq voies officielles de parallélisme portent un statut provisoire (aperçu, expérimental, bêta), d'après `code.claude.com/docs/en/agents`.
- **O1 — mesurer et consigner.** Ajouter au relevé de flotte un indicateur de pic de simultanéité par session, avec fixtures rouge et verte, et un référentiel daté des fonctions officielles de parallélisme (statut, plan, limite, source, date de lecture). Y écrire « Projects : non adopté » avec ses conditions de reprise.
  - Coût : simple × court. Une fonction dans `scripts\relever-flotte.mjs`, un fichier sous `references\` ; aucun appel de modèle, la lecture des transcriptions suffit.
  - Exclut : tout essai de Projects, de workflow ou de routine.
- **O2 — O1, puis un essai de workflow dynamique.** Rejouer la campagne récurrente « retours et todos » comme workflow sauvegardé, en local, avec au plus 8 agents et les droits de la session.
  - Coût : moyen × moyen. Un script à écrire et à faire relire ; consommation de quota non mesurée.
  - Exclut : Projects. Obstacles : un workflow n'accepte aucune question en cours de route, alors que `bloque_question` suspend ; l'emploi d'un agent nommé de `.claude\agents` par un `agent()` n'est pas vérifié.
- **O3 — O1, puis un essai de Projects sur une forge.** Un projet, 3 fils au plus, sur une forge dont le mandat d'écriture et de push est permanent, comparé à la même tranche en session selon le protocole du §4 bis.
  - Coût : moyen × moyen. Installer l'application GitHub de Claude sur le dépôt, mesurer les jetons des fils et de la conversation.
  - Exclut : le pilot et les produits. Obstacles : accès au compte non vérifié (liste d'attente possible), instruction de nombre de fils qui reste « a preference rather than a cap ».
- **O4 — viser le palier 3 dès maintenant.** Faire de Projects, des workflows ou des routines cloud la voie par défaut des campagnes, avec plus de 20 agents et un lancement par l'IA.
  - Coût : très complexe × long. Rouvrir le contrat de campagne (ni push ni remote), la règle de publication R-38 et le plafond de 5 cycles.
  - Exclut : la mesure préalable. Elle contredit le contrat lui-même : « Ce qui n'est pas mesuré ne se prescrit pas » (`gabarits\AGENT-CAMPAGNE.md` l.259).

| Option | Répond à P1 (existence) | Répond à P4 (palier suivant sûr) | Gates touchées | Coût |
|---|---|---|---|---|
| O0 | non | non | aucune | nul |
| O1 | oui, par un référentiel daté | oui, par conditions écrites | aucune | simple × court |
| O2 | oui | oui, en local | permissions de session, `bloque_question` | moyen × moyen |
| O3 | oui | oui, en cloud | push, quota | moyen × moyen |
| O4 | oui | oui | R-38, contrat de campagne, 5 cycles | très complexe × long |

## 5. Verdict

- **Option retenue** : O1.
- **Pourquoi O1 et pas O2 ou O3** : la limite de la Factory n'est pas l'absence d'une fonction mais l'état de sa flotte. Le relevé donne 14 % d'appels vers un agent nommé pour une cible de 90 %, et ses trois critères sont NON TENUS. Ajouter du parallélisme avant de les tenir multiplierait ce qui n'est pas mesuré.
- **Pourquoi pas Projects en particulier** : trois obstacles se cumulent. Il manque au CLI et à VS Code, où la Factory travaille. Ses fils clonent des dépôts GitHub, alors que la Factory lit l'état du poste (transcriptions, registre, skills installés) ; un fil local par Remote Control existe, mais exige Claude Code 2.1.280 ou plus et n'a pas été essayé. Et son nombre de fils n'est pas plafonné, quand la Factory borne ses boucles à 5 cycles.
- **Palier suivant sûr** : ce n'est pas « plus d'agents » mais un palier 3 réduit, où l'IA lance elle-même un travail en lecture seule, comme un relevé planifié en local. Trois conditions d'abord : part des appels nommés ≥ 90 %, isolation par worktree des agents qui écrivent dans un même dépôt, aucun commit croisé entre sessions consigné sur la période. Les gates ne bougent pas : GO humain pour le push du pilot et la production, G-2, 5 cycles, dépenses humaines.
- **Coût** : simple × court. Une fonction de relevé avec ses fixtures, un référentiel daté ; aucun jeton de modèle à l'usage.
- **Candidature(s) émise(s)** : candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 3, preuve 4, effort 1. Intitulé proposé : « relevé de flotte : pic de simultanéité par session, et référentiel daté des fonctions de parallélisme de Claude Code (Projects non adopté) ». Je n'ai rien écrit au registre.
- **Plan de revue** : 2026-11-08, date de revue de l'essai de relecture d'intention, ou plus tôt si la documentation de Projects annonce l'arrivée aux plans Team ou au CLI. Critères écrits d'avance : l'indicateur de pic se lit au relevé ; la part des appels nommés a atteint 90 % ; aucun commit croisé n'a été consigné. Si les trois tiennent, un essai O2 se décide, et un essai O3 se décide si le compte donne accès à Projects.
- **Test rétro** :
  - *Opération → Tactique* : l'indicateur répond à P3, le référentiel à P1 et P2, les conditions de reprise à P4, la vérification des légendes à P5.
  - *Tactique → Stratégie* : décider sur des faits lus à la source, pas sur la parole d'une vidéo ; ne monter d'un palier que mesuré, comme le dit le contrat de campagne.
  - *Stratégie → Intention* : vous vouliez savoir ce que la Factory doit faire de cette opportunité. La réponse est un objet durable léger, et pas d'essai tant que la flotte n'est pas mesurée.
  - *Questions rejouées* : « Projects existe-t-il officiellement ? » Oui, en bêta publique depuis le 17/09/2026. « Quelle fonction s'en approche ? » Les sessions cloud, dont chaque fil est une, puis les routines et les workflows dynamiques. « Où est la Factory, mesuré ? » Au palier 2, pic de 14, 14 % d'appels nommés. « Quel palier suivant est sûr ? » Un palier 3 réduit, sous trois conditions. « Qui est Steve, que publie-t-il ? » Très probablement Steve Sewell, Builder.io : Builder 2.0 (2026-04-08) et les skills `/factory` de l'entreprise, où humains approuvent et fusionnent.
  - *Rupture constatée* : le texte de la vidéo n° 25 n'a pas été retrouvé, donc sa thèse n'est ni confirmée ni infirmée. Elle est déclarée, pas comblée.

## Hypothèses non résolues

- Votre compte a-t-il accès à Projects, et sur quel plan ? Non lisible depuis ce poste.
- Des routines existent-elles déjà sur votre compte claude.ai ? Non lisible depuis ce poste.
- L'identité Steve Sewell pour @steve8708 repose sur l'identité du pseudo, pas sur la légende.
- La déclaration de Steve Sewell selon laquelle plus de la moitié du développement de Builder.io est automatisée vient d'un extrait de recherche d'un message LinkedIn, non ouvert : non vérifiée.
- Le script de simultanéité compte la durée de vie d'un sous-agent, de son premier à son dernier message ; un agent en attente compte comme actif, donc le pic peut être surestimé. L'écart de 1 sous-agent avec le relevé n'est pas expliqué.
- Un `agent()` de workflow peut-il viser un agent nommé de `.claude\agents` ? Non vérifié.
