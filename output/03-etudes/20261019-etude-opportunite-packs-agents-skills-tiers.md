---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: agent redacteur (Sonnet 5.5)
arbitre: gabarit suivi ; oracle-etude-opportunite PASS et oracle-ecriture PASS rejoués le 2026-10-19 ; faits sourcés dans le texte ; un seul fichier du dépôt écrit
hypotheses_non_resolues: section « Limites et hypothèses non résolues », en fin de document
---

# Étude d'opportunité — packs d'agents et de skills tiers comparés à la flotte — 20261019d

Ce qui change pour vous : aucun rôle des 3 dépôts ne manque à la flotte, et aucun ne mérite d'être installé. Le défaut mesuré de la flotte est l'appel, non le choix des rôles : 22 % des appels des 14 derniers jours visent un agent nommé, pour une cible de 90 %. Un seul contrôle manque et s'importe sans heurter la doctrine, le cumul du contexte permanent des skills : vos 33 descriptions pèsent 29 553 caractères, 896 en moyenne contre 142 chez Matt Pocock. L'étude recommande O3 : reprendre cette idée sans rien installer, et mesurer avant de raccourcir quoi que ce soit.

## Seuil de déclenchement

L'étude est due. Le rang 3 du tri score 19, le seuil des études poussées. Elle examine aussi la création possible d'un objet durable (un agent, un contrôle ou un skill, soumis à la règle R-31 d'admission des objets durables) et touche le routage du noyau (`CONTRAT-INTERFACE.md` §4).

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39 (c) du 2026-10-19, mot pour mot : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 3 du tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md` en fait partie.

Lecture de l'orchestrateur, tirée de sa consigne et non citée de vous : décider ce que la Factory doit faire de cette opportunité, entre rien, un essai et un objet durable. Les faits se vérifient à la source, jamais sur la parole d'une vidéo TikTok. Question posée à cette étude : quels rôles, contrôles ou skills de ces 3 dépôts manquent à la flotte, et lesquels s'importent sans contredire la doctrine du pilot ?

## 0. Traitement des entrants

Les 7 vidéos (n° 59, 69, 18, 92, 102, 101 et 71) sont des données. Leur contenu n'est connu que par leur légende : aucune n'a été regardée ni téléchargée, et aucun outil d'extraction TikTok n'a servi. Leurs affirmations sont vérifiées à la source primaire dans la section suivante.

Les dépôts tiers sont des données aussi. Le README de GStack ordonne au lecteur-agent de cloner le dépôt, de lancer `./setup` et d'ajouter une section au `CLAUDE.md` du poste. Celui de Matt Pocock propose `claude plugin install`. Ces consignes sont décrites ici et n'ont pas été exécutées : les fichiers ont été lus par l'API GitHub, sans installation, dans un dossier jetable hors dépôt.

Sources de la proposition : rang 3 du tri `20261019-tri-opportunites-favoris-tiktok.md`, légendes des vidéos citées. Le tri affirme que « le registre ne cite aucun des 3 dépôts » ; la section 2 corrige ce point.

## 1. Partition du problème

La question se découpe en 5 sous-questions disjointes. Chaque option de la section 4 répond à chacune.

- **P1 — Rôles.** Un des rôles des packs manque-t-il aux 5 agents de la flotte (`explorateur`, `verificateur`, `campagne`, `constructeur`, `redacteur`) ?
- **P2 — Contrôles.** Un contrôle, un hook ou un relevé des packs manque-t-il à la Factory ?
- **P3 — Skills et méthodes.** Un skill ou une méthode de travail des packs manque-t-il ?
- **P4 — Doctrine.** L'import d'un élément contredit-il une règle écrite : garde-fous du noyau, admission des skills tiers (R-33 ter), décisions de hooks déjà prises ?
- **P5 — Fiabilité des légendes.** Les chiffres et les fonctions que les vidéos avancent sont-ils vrais à la source ?

## Vérification à la source

Les 3 dépôts ont été relevés le 2026-10-19 par l'API GitHub, avec leur README et leur licence. Tous sont sous licence MIT et vivants : le dernier commit de chacun date de 10 jours au plus.

| Dépôt | Licence | Dernier commit (branche principale) | Étoiles | Contenu compté |
|---|---|---|---|---|
| `garrytan/gstack` | MIT | 2026-10-19, v1.91.146.0 | 136 911 | 56 dossiers de premier niveau avec un SKILL.md ; le README annonce 23 spécialistes et 8 outils |
| `affaan-m/everything-claude-code` (ECC, renommé `affaan-m/ECC`) | MIT | 2026-10-15 ; release v2.2.3 du 2026-10-01 | 283 782 | 71 agents, 311 skills, 97 commandes, 122 règles (arbre recompté) |
| `mattpocock/skills` | MIT | 2026-10-09 ; release v1.3.1 du 2026-10-04 | 297 085 | 38 skills : 20 engineering, 7 productivity, 7 in-progress, 4 misc |

Ce que disent les légendes, rejoué à la source :

| Vidéo | Affirmation de la légende | Verdict | Preuve |
|---|---|---|---|
| n° 59 | Le patron de Y Combinator a publié son setup Claude Code | vraie | README de GStack : « I'm Garry Tan, President & CEO of Y Combinator » ; licence MIT |
| n° 59 | 23 outils | vraie à la lettre du README | « Twenty-three specialists and eight power tools » ; l'arbre compte 56 dossiers avec un SKILL.md |
| n° 59 | Plus de 108 000 étoiles | invérifiable à la date de la vidéo | 136 911 étoiles ce jour ; l'historique n'a pas été relu |
| n° 59 | Installable en une seule commande, gratuit | partiellement vraie | une commande colle le clone et `./setup`, qui exige Bun 1.4.2 ou plus (moteur JavaScript) et télécharge Chromium ; les secondes opinions passent par la CLI Codex d'OpenAI |
| n° 69 | 28 sous-agents et 119 skills | fausse aujourd'hui | 71 agents et 311 skills (README v2.2.3) ; la v1.9.0 en annonçait 27 et 109, la v1.10.0 38 et 156 |
| n° 69 | Éprouvé au combat, gain de productivité sur toutes les plateformes d'IA | invérifiable | promesse sans mesure ; seule la compatibilité Codex, Cursor et Gemini est déclarée au README |
| n° 18 | Les skills de Matt Pocock ont plus d'étoiles que React | vraie | 297 085 contre 251 379 pour `facebook/react`, le même jour |
| n° 18 | Un agent construit une fonctionnalité entière pendant que vous prenez un café | invérifiable | promesse ; le README de Matt Pocock se place à l'opposé : « real engineering - not vibe coding » |
| n° 92 et n° 102 | Find Skills, Superpowers, Mem, Impeccable, Task Observer | 4 noms vérifiés, 1 ambigu | `vercel-labs/skills` (MIT, 35 616 étoiles), `obra/superpowers` (MIT, 301 978), `pbakaus/impeccable` (Apache-2.0, 83 024), `rebelytics/one-skill-to-rule-them-all` (CC BY 4.0, 3 441) ; « Mem » : hypothèse `thedotmack/claude-mem` (Apache-2.0, 101 752) |
| n° 101 et n° 71 | 4 skills ; 5 plugins et des limites de jetons gratuites | invérifiables | aucun nom dans la légende ; la n° 71 a le même auteur que la vidéo v1 de la veille du 2026-08-10, identité non confirmée |

Les 2 faits qui suivent changent la lecture.

- L'horodatage que contient l'identifiant d'une URL TikTok date la n° 69 du 2026-08-04 (convention non documentée par TikTok, donc hypothèse). Le dépôt annonçait alors 67 agents (`veille\ETUDE-EVERYTHING-CLAUDE-CODE.md`, relevé du 2026-08-10) : les 28 agents de la légende étaient périmés à la publication.
- « Task Observer » était classé « non confirmé » par la veille du 2026-08-10 (`veille\VEILLE-OUTILLAGE-CLAUDE-CODE.md` l.27). Il existe : dépôt `rebelytics/one-skill-to-rule-them-all`, créé le 2026-02-15, dernier commit le 2026-10-16.

## Mesures sur le poste

Les 3 mesures ci-dessous ont été rejouées le 2026-10-19, en lecture seule.

- **Appels vers un agent nommé.** `node scripts\relever-flotte.mjs --jours 14` rend 204 appels de l'outil Agent, dont 45 vers un agent nommé (22 %), 8 dérogations dites et 151 hors flotte. La consigne de cette étude cite 12 % au relevé d'ouverture : ce chiffre n'est pas reproduit, car la fenêtre glisse d'un jour à l'autre. Sur 30 jours, le relevé rend 14 % (47 sur 327). Depuis minuit, il rend 90 % (28 sur 31), parce que la campagne en cours nomme ses agents.
- **Descriptions de skills.** Un script jetable hors dépôt applique le lecteur de frontmatter de `quality-oracles` (`scripts\lib\frontmatter.mjs`) à 3 corpus.
- **Porte d'admission R-33 ter.** `oracle-scan-agentdef.mjs` de forge-agents-security, joué sur les agents et skills des packs. CAP-1 y désigne la combinaison réseau, écriture et lecture de secrets dans un même agent ; CAP-3, des permissions plus larges que le mandat ; CAP-4, un motif d'exfiltration ou d'injection dans le texte.

| Corpus des descriptions | Skills | Caractères cumulés | Moyenne | Maximum |
|---|---|---|---|---|
| Skills du poste, `~\.claude\skills` | 33 | 29 553 | 896 | 1 024 (`experts-forge`) |
| Superpowers 7.0.0, plugin installé | 15 | 2 317 | 154 | 375 |
| `mattpocock/skills`, branche principale | 38 | 5 402 | 142 | 419 |

La moyenne des skills du poste atteint 88 % du plafond de 1 024 caractères. La grille D1 d'`ameliore-un-skill` exige un déclencheur « Use when » et des exclusions (`references\grille-audit.md`, dimension D1), ce qui allonge chaque description. Il reste 2 inconnues : l'effet d'une description courte sur le déclenchement, et la part de ces 29 553 caractères réellement chargée dans un sous-agent.

Résultat du scan : les 5 agents de la flotte rendent 5 FAIL (CAP-1 bloquant, et CAP-3 majeur pour `explorateur` et `verificateur`). Sur les 71 agents d'ECC, 16 passent et 55 échouent : 51 sur CAP-1 seul, 3 sur CAP-1 et CAP-4, 1 sur CAP-1 et CAP-3. Les 38 skills de Matt Pocock passent, sans portée, puisqu'ils ne déclarent aucun outil. CAP-1 se déclenche dès qu'un agent porte l'outil Bash : l'oracle ne discrimine pas. Sur `spec-miner`, le CAP-4 vient de la ligne 23, qui interdit l'exfiltration, donc un faux positif ; les 2 autres CAP-4 n'ont pas été relus. GStack n'a pas été scanné.

## 2. Non-recouvrement contre l'existant

Chaque ligne confronte un élément des packs à ce que la Factory a déjà, avec sa citation.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Rôles de la flotte contre les 71 agents d'ECC, les rôles de GStack et les skills de Matt Pocock | `CONTRAT-INTERFACE.md` l.391-402 : « explorateur […] verificateur […] campagne […] constructeur […] redacteur » ; `gabarits\flotte\` (5 fichiers .yaml) | recouvre les classes du tableau de routage §4. Les 15 constats M-01 à M-15 de l'étude de la flotte (`20261018-etude-opportunite-flotte-d-agents.md`) portent sur le câblage, la mesure ou le contrat, aucun sur un rôle absent |
| Revue d'un diff : `code-reviewer`, `security-reviewer`, `silent-failure-hunter` (ECC) ; `/review` et `/cso` (GStack) ; `code-review` à 2 axes (Matt Pocock) ; `requesting-code-review` (Superpowers) | `references\RELECTURE-INTENTION.md`, « L'autorité : alerte, jamais blocage » ; `gabarits\AGENT-CAMPAGNE.md`, « Vérification native avant commit » ; `CLAUDE.md` l.89 | recouvre : la relecture d'intention tient l'axe « conforme à la demande », les vérifications natives l'axe « conforme aux normes ». Un relecteur d'opinion sur le code ne s'y ajoute pas |
| Gel des écritures par chemin : `/freeze` et `/guard` (GStack) ; liste d'outils en lecture seule de `agent-evaluator` (ECC) | `oracles\hook-produits-intacts.mjs` l.12-16 : un hook PreToolUse sur le chemin « ne verrait QUE Write et Edit […] une garantie de façade » ; `.claude\agents\redacteur.md` porte Bash | ne recouvre pas, et contredit la décision humaine du 2026-08-23 : la Factory a choisi la comparaison d'état, insensible à l'outil |
| Gardes sur les commandes dangereuses : `/careful` (GStack) ; `git-guardrails-claude-code` (Matt Pocock, dossier gelé) | `~\.claude\settings.json` l.48 (`garde-rm-variable.mjs`) ; `oracles\hook-remisage.mjs` ; `scripts\hooks-git\pre-push-prolongement-local` | recouvre |
| Porte de fin de tour : `gstack-verify-gate` | `.claude\settings.json`, bloc Stop (`hook-restitution.mjs`, `oracle-secrets-hors-perimetre.mjs`, `hook-produits-intacts.mjs`) ; `CLAUDE.md` l.21 | recouvre |
| Instruction de la demande : `/office-hours` et `/spec` (GStack) ; `grill-me`, `grilling`, `to-spec` (Matt Pocock) | `~\.claude\skills\qualifie-l-entrant\SKILL.md` l.3 ; `references\INTENTION.md` ; `references\ECRITURE.md` l.85, E-4 (décision en choix fermé avec recommandation) | recouvre |
| Rétrospective et apprentissage : `/retro` et `/learn` (GStack) ; `retro` (Matt Pocock) ; `conversation-analyzer` (ECC) ; Task Observer | `BOUCLE-AMELIORATION.md` (journal) ; `CLAUDE.md` l.85 « constat en passant → candidat » ; `insatisfactions\REGISTRE.jsonl` | recouvre le principe ; ne recouvre pas l'analyse automatique des transcriptions, dont aucune mesure ne dit le gain ici |
| Mémoire entre sessions : `claude-mem`, `gbrain` de GStack, instincts d'ECC | `~\.claude\projects\c--dev-digit-ai-factory\memory\MEMORY.md` ; `CONTRAT-INTERFACE.md` §4 quater (point de reprise) ; `oracles\hook-reprise.mjs` | recouvre ; le README de claude-mem demande une connexion à un compte en ligne et propose une synchronisation vers un nuage, ce que `CLAUDE.md` l.88 exclut |
| Tests d'abord et débogage discipliné : `tdd` et `diagnosing-bugs` (Matt Pocock) ; `/investigate` (GStack) | `gabarits\AGENT-CAMPAGNE.md`, « Fixtures à double sens » et « Vérification native avant commit » (G-2) ; `~\.claude\plugins\installed_plugins.json` (Superpowers 7.0.0) | recouvre, la fixture rouge de la Factory étant l'équivalent du test qui échoue d'abord |
| Budget de contexte des skills : `gstack-context-bill` (GStack) ; « context load » de `writing-for-agents` (Matt Pocock) | `quality-oracles\scripts\lib\frontmatter.mjs` l.35 (`DESCRIPTION_MAX = 1024`, par skill) ; `CONTRAT-INTERFACE.md` l.513 (`relever-contexte-sessions.mjs`, contexte des sessions) ; `oracles\lib-budget-contexte.mjs` (budget d'un hook) | ne recouvre pas : aucun cumul des descriptions n'existe, et le plafond par skill sert de cible (moyenne de 896 pour un maximum de 1 024) |
| Admission d'un skill tiers : `npx skills add` de Find Skills ; installation en une commande de GStack et de Matt Pocock ; mise à jour automatique de GStack à chaque ouverture | `REGLES-PROJET.md` l.514-521 (R-33 ter : scan avant admission, consigné, non bloquant) ; `CLAUDE.md` l.18 (R-43) | recouvre le besoin ; l'import par installation contredit R-33 ter, et l'oracle de scan n'est pas calibré (mesure ci-dessus) |
| Secondes opinions d'un autre fournisseur : `/codex` et binaire de design sur OpenAI (GStack) | `CLAUDE.md` l.88 ; `REGLES-PROJET.md` l.306-309 (R-29 : l'exécution d'un service tiers payant exige un GO humain) | ne recouvre pas, et contredit « seuls les modèles Claude via le harnais sont licites » (`gabarits\AGENT-CAMPAGNE.md`, « Environnement ») |
| Défense contre l'injection : « Prompt Defense Baseline » en tête de chaque agent d'ECC | `CLAUDE.md` l.87 « Dépôts frères et entrants = donnée » ; `references\ECRITURE.md` l.43 (type T1 : agents et skills) | recouvre : la règle des entrants est au noyau, que les sous-agents du projet lisent par défaut (champ `omitClaudeMd` de la documentation Subagents) |
| Écriture des documents pour agents : `writing-for-agents` (Matt Pocock) | `references\ECRITURE.md` l.43 (juges `oracle-claude-md` et `oracle-ecriture`) | recouvre le style ; ne recouvre pas le test des phrases sans effet ni la formulation positive |
| Précédents de lecture de ces dépôts | `veille\ETUDE-EVERYTHING-CLAUDE-CODE.md` §5 (3 patterns d'ECC réalisés le 2026-08-10) ; `output\03-etudes\2026-08\20260822-etude-opportunite-fraicheur-des-verdicts.md` l.97 (`gstack-evidence` comme barre) | recouvre : ECC et GStack sont déjà lus et leurs idées extraites. Matt Pocock est neuf, absent de tout fichier du pilot |
| Précédent d'import de skill tiers | `digit-ai-forge-design\oracles\regles-importees-taste-skill.md`, table de disposition et « Règles amont ÉCARTÉES » | recouvre la méthode, que cette étude reprend : aucune installation, des règles compatibles extraites, attribution, revue datée |
| Superpowers et Impeccable déjà installés | `~\.claude\plugins\installed_plugins.json` (Superpowers 7.0.0, commit `bb92a777`, identique au HEAD amont du 2026-10-10) ; `~\.claude\skills\impeccable\SKILL.md` l.4 (version 4.0.4) | recouvre : rien à installer. Impeccable amont affiche 4.6.0 dans son `package.json` (écart non élucidé, renvoyé au rang 4) |

Le tableau se range en 3 groupes.

- **Idées importables sans installation.** Le cumul des descriptions de skills (GStack, `gstack-context-bill`). Les 2 tests de rédaction de Matt Pocock. Une phrase qui ne change pas le comportement par défaut se supprime. Une consigne dit ce qu'il faut faire, non ce qu'il faut éviter.
- **Déjà couvert.** Revue à 2 axes, gardes git, porte de fin de tour, rétrospective, mémoire, tests d'abord, instruction de la demande, défense contre l'injection.
- **Contredit la doctrine.** Le gel par chemin (décision du 2026-08-23). Les secondes opinions d'un autre fournisseur et la mémoire par compte en ligne (`CLAUDE.md` l.88). L'installation sans scan et la mise à jour automatique (R-33 ter).

## 3. État de l'art daté

Les 8 sources ci-dessous disent comment tenir une flotte d'agents et des skills tiers. Les pages de documentation sans date de publication portent leur date de lecture.

- **Anthropic, « Building effective agents »**, 2024-12-19, `anthropic.com/engineering/building-effective-agents` : « you should consider adding complexity only when it demonstrably improves outcomes ». Ajouter des agents sans défaut mesuré ne passe pas ce test.
- **Anthropic, « Equipping agents for the real world with Agent Skills »**, 2025-10-16, `anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills` : « At startup, the agent pre-loads the name and description of every installed skill into its system prompt ». Autre phrase : « We recommend installing skills only from trusted sources ». Le coût permanent d'un skill est sa description.
- **Snyk, « ToxicSkills »**, 2026-02-05, `snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub` : sur 3 984 skills de ClawHub et skills.sh, 13,4 % (534) portent un défaut critique et 76 une charge malveillante confirmée ; « Agent Skills are a software supply chain ».
- **Cloud Security Alliance, note de recherche sur SKILL.md**, 2026-05-06, `labs.cloudsecurityalliance.org/research/briefing-csa-research-note-skill-md-agent-context-poisoning/` : « A SKILL file is, by design, an unrestricted natural-language instruction set for an AI agent ». Contrôles recommandés : vérifier la source, lire le texte, passer par une approbation interne comme pour une dépendance.
- **Claude Code, documentation « Subagents »**, lue le 2026-10-19, `code.claude.com/docs/en/sub-agents` : un agent déclare `tools`, `model`, `effort` et `hooks` ; « Define hooks directly in the subagent's markdown file ». Un gel par chemin est donc possible par agent ; la décision du 2026-08-23 le refuse pour une autre raison, le contournement par Bash.
- **Claude Code, documentation « Hooks »**, lue le 2026-10-19, `code.claude.com/docs/en/hooks` : un hook PreToolUse « can block » l'appel, par code de sortie 2 ou par `permissionDecision: deny`. La page lue ne documente pas le champ de chemin de Write et Edit ; le hook du pilot le lit déjà (`oracles\hook-ecriture.mjs` l.41, `tool_input.file_path`).
- **Anthropic, « Prompting best practices »**, lue le 2026-10-19, `platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices` : « Tell Claude what to do instead of what not to do » (rubrique sur le formatage) ; sur les sous-agents, « Watch for overuse ». Cette source soutient le test de formulation positive de Matt Pocock pour le formatage seulement. L'explication de Matt Pocock par l'éléphant (« don't think of an elephant ») ne cite aucune source.
- **Dépôts primaires**, API GitHub et README lus le 2026-10-19 : `garrytan/gstack`, `affaan-m/everything-claude-code`, `mattpocock/skills`, `obra/superpowers` (MIT, dernier commit 2026-10-10), `pbakaus/impeccable` (Apache-2.0, 2026-10-19), `vercel-labs/skills` (MIT, 2026-10-09), `rebelytics/one-skill-to-rule-them-all` (CC BY 4.0, 2026-10-16).

Ce que l'état de l'art établit ici : l'ajout de rôles demande un gain démontré, l'installation d'un skill tiers demande un scan et une lecture, et le contexte permanent d'un skill est sa description. Il ne dit rien de l'effet d'une description courte sur le déclenchement.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée. Coût du statu quo, mesuré : les descriptions de skills pèsent 29 553 caractères, soit près de 6 fois la moyenne de Superpowers par skill (896 contre 154). Aucun relevé n'en donne le cumul, alors que la Factory mesure ailleurs le contexte de ses sessions (`CONTRAT-INTERFACE.md` §4 quater) et de ses sous-agents. Le tri resterait aussi faux en affirmant que le registre ne cite aucun des 3 dépôts.
- **O1 — importer des rôles.** Ajouter à la flotte jusqu'à 3 agents en lecture seule tirés des packs : relecteur de diff, chasseur d'échecs silencieux, relecteur de sécurité. Contenu : 3 fichiers `gabarits\flotte\*.yaml` compilés. Coût : moyen × court. Exclut le critère de l'état de l'art, un gain démontré : aucun des 15 constats de la flotte ne nomme un rôle absent. Sur les 71 agents d'ECC, 38 sont propres à un langage ou à un domaine (Rust, Kotlin, réseaux, santé). Seuls `python-reviewer` et `fastapi-reviewer` touchent la seule cible de forge-development, `fastapi-saas`.
- **O2 — installer un pack ou un plugin.** GStack, ECC en entier, ou `claude plugin install` pour Matt Pocock. Coût : complexe × moyen. Exclut R-33 ter, qui impose le scan avant l'admission. GStack exige Bun, télécharge Chromium et confie ses secondes opinions à la CLI Codex d'OpenAI, hors des modèles Claude seuls licites. ECC fait échouer 55 de ses 71 agents au scan de la Factory, et ajouterait 311 descriptions de skills au contexte permanent.
- **O3 — extraire sans installer.** Le précédent taste-skill, appliqué ici. Contenu : une section « skills » dans `scripts\relever-contexte-sessions.mjs` (cumul, moyenne, maximum, part au-dessus de 419 caractères). S'y ajoutent 2 tests de rédaction de Matt Pocock comme questions de revue d'une description, et les 3 dépôts inscrits comme références datées au dossier `veille\`. Coût : simple × court. Exclut toute installation et tout nouveau rôle.
- **O4 — veille continue des 3 dépôts.** Un relevé périodique de leurs versions, comptes d'agents et licences, avec re-comparaison à la flotte. Coût : moyen × long, avec une dette de lecture. Exclut le principe du playbook de développement : « La liste s'allonge par MESURE, jamais par précaution » (`digit-ai-forge-development\docs\run-playbook.md` l.326). Les dépôts publient chaque jour (GStack en est à la v1.91.146.0), sans manque mesuré à combler.

## 5. Verdict

- **Option retenue** : O3.
- **Pourquoi O3 et pas les autres** : O0 laisse sans mesure un terme du contexte permanent. O1 n'a pas de défaut à corriger. O2 contredit R-33 ter et, pour GStack, la règle des modèles Claude seuls licites. O4 paie un suivi sans manque établi.
- **Ce que la décision vaut au tri** : un essai court, la bande de 15 à 18 de la grille, et non l'objet durable que le score de 19 laissait attendre. Le gain espéré par le tri, repérer des rôles absents, n'est pas démontré.
- **Coût** : simple × court. Aucun appel de modèle ; une section de script à ajouter et sa recette à double sens ; une dette, un relevé de plus à lire à l'ouverture.
- **Candidature(s) émise(s)** :
  - Le relevé du budget de contexte des skills et la grille de revue d'une description : candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 3, preuve 3, effort 1.
  - Constat en passant, hors de l'option : calibrer CAP-1 et CAP-3 d'`oracle-scan-agentdef.mjs` avant d'armer R-33 ter, avec une fixture rouge (un agent qui exfiltre) et une fixture verte (un agent de la flotte portant Bash). Armée aujourd'hui, la porte refuserait les 5 agents de la flotte, le « gate mort » que R-33 ter prévoyait lui-même. Candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 3, preuve 5, effort 2.
- **Plan de revue** : 2026-11-16. Critères écrits d'avance : le relevé joue à l'ouverture et rend cumul, moyenne et maximum. Si la moyenne reste au-dessus de 419 caractères, un essai de déclenchement sur mandat (R-34) compare 5 descriptions raccourcies à leur original avant tout élagage. La revue relit la licence, le dernier commit et le nombre d'agents des 3 dépôts, et rejoue le scan.
- **Test rétro** :
  - *Opérationnel → Tactique* : le relevé répond à P2, les 2 tests de rédaction à P3, les références datées à P4 et P5. Le scan répond à P4 pour les dépôts qui déclarent des outils.
  - *Tactique → Stratégie* : n'importer que ce qui comble un manque mesuré, par l'idée et jamais par l'artefact, comme pour taste-skill.
  - *Stratégie → Intention* : vous vouliez décider entre rien, un essai et un objet durable, sur des faits vérifiés. La réponse est un essai court. Les affirmations des vidéos ont été rejouées : 3 vraies, 1 fausse, 1 partiellement vraie, 4 invérifiables et 1 mixte.
  - *Questions rejouées* : « quels rôles manquent ? » aucun, 15 constats de la flotte sans rôle absent. « Quels contrôles ? » un, le cumul des descriptions. « Quels skills ? » aucun. « Lesquels s'importent sans contredire la doctrine ? » l'idée du budget et 2 tests de rédaction. « Lesquels la contredisent ? » le gel par chemin, la seconde opinion d'un autre fournisseur, l'installation sans scan, la mémoire par compte en ligne.
  - *Rupture constatée* : les vidéos n'ont pas été vues, et le tri présumait des rôles absents que rien ne démontre. Ces 2 écarts sont déclarés, pas comblés.

## Limites et hypothèses non résolues

- Le contenu des 7 vidéos n'est connu que par leur légende ; leur date de publication est déduite de l'identifiant d'URL, par une convention que TikTok ne documente pas.
- « Mem » est lu comme `claude-mem` sans que la légende le dise.
- Les 12 % du relevé d'ouverture ne sont pas reproduits : 22 % sur 14 jours à l'heure de cette étude.
- Le scan couvre 71 agents d'ECC, 38 skills de Matt Pocock et la flotte ; ni GStack ni les 311 skills d'ECC n'ont été scannés. Le PASS de Matt Pocock ne juge pas leur sécurité.
- Les 2 inconnues de la mesure des descriptions (déclenchement, part chargée dans un sous-agent) restent ouvertes.
- La veille du 2026-08-10 cite ECC en v2.2.0, dont la release publiée date du 2026-08-28 : la version lue alors était probablement celle du développement.
- Impeccable : version locale 4.0.4 contre 4.6.0 amont, sans certitude que les 2 numéros suivent le même schéma.
- Superpowers est installé au niveau du poste, et aucun fichier du pilot hors études ne le gouverne (recherche du 2026-10-19).
