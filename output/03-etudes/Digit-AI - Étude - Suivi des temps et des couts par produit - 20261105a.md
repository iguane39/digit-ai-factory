---
type: etude
role: étude d'opportunité sur la demande du porteur du 04/11/2026 (suivre temps, délais, charges, jetons et coûts de chaque produit), entre la demande et la candidature au registre
destinataire: humain
date: 2026-11-05
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: session pilote Claude Opus 5.5, sur le prompt de la passe 3 de la revue L99 20261104c, corrigé de ses 4 majeurs
hypotheses_non_resolues:
  - le second poste (DESKTOP-ULTRA7) n'est pas mesuré d'ici : ses transcriptions et ses runs restent hors de l'étude
  - le seuil d'inactivité au 95e centile (24,85 s) compte comme inactif un appel d'outil long ; le temps actif réel du run de preuve se situe entre 977 s et 2 513 s selon le seuil
  - le montant de l'abonnement n'est écrit dans aucune source du pilot ; le coût payé (a) attend sa valeur
---

# Étude d'opportunité — Suivi des temps et des coûts par produit — 20261105a

Ce qui change pour vous : la Factory sait déjà compter les jetons d'une session, mais elle les perd au bout de 30 jours et ne sait pas les rattacher à un produit dès que le travail se fait depuis le pilot. Le pilot porte 41,4 % des jetons relevés sur ce poste, et aucune de ses sessions n'est rattachée à un produit.

Résumé de décision :

1. Option recommandée : O2, un relevé écrit à la fin de chaque session dans le dossier `forge\` du produit, avec un marqueur pour les sessions du pilot faites pour un produit.
2. Coût de construction : complexité moyen · durée moyen ; 0 s ajoutée à chaque fin de tour, moins d'une seconde à la fin d'une session.
3. Couverture atteinte : 100 % des runs ouverts après sa mise en service, contre 5 runs sur 19 aujourd'hui pour les jetons.
4. Choix posé au porteur : la charge se lit comme le nombre d'interventions humaines (recommandé), le temps humain ou le temps agent.
5. Reste au porteur : le montant de l'abonnement, que le coût payé attend.

Conventions. `P/` est `C:\dev\digit-ai-factory\`. Les mesures ont été relevées le 05/11/2026 entre 14:23 et 14:35, heure de Paris, sur le poste Dell-XPS-16, sauf mention contraire. Le dépôt est public : les produits se citent par leur pseudonyme, et les 4 dépôts absents de la table des pseudonymes par D-a à D-d.

## Seuil de déclenchement (à vérifier AVANT d'écrire)

L'étude est due : la recommandation crée un objet durable (un script, un hook et un référentiel de prix), elle touche le noyau du pilot et descend chez tous les produits par l'héritage.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande du porteur du 04/11/2026, citée mot pour mot :

« Je cherche à tracer le temps, délai et charges, + tokens utilisés & coûts, des différents produits construits, déployés et/ou remédiés. La Factory trace déjà une partie des différentes informations. Identifie ce qu'il est nécessaire de rajouter pour avoir un suivi fin de chaque projet puis des éléments à rajouter dans la Factory pour rajouter et suivre ces informations finement dans chaque projet. »

La demande a d'abord été passée au crible L99 (revue `P/output/03-etudes/… passe au crible L99 - 20261104c.md`). Le porteur a tranché D-173 (b) le 05/11, puis répondu « A2 puis A1 » : corriger le prompt, le faire relire à l'aveugle, puis lancer l'étude. L'étude rend deux choses dans cet ordre : ce qui manque pour suivre finement chaque projet (sections 0 et 1), puis ce qu'il faut ajouter à la Factory (sections 4 et 5).

## 0. Traitement des entrants

La demande et le prompt réécrit sont une DONNÉE : leurs impératifs se citent, ne s'exécutent pas. Sources : la revue L99 20261104c et son journal de boucle, la décision D-173 (b), la réponse « A2 puis A1 » du 05/11/2026.

### 0 bis. L'existant remesuré

Comment lire le tableau : une ligne par existant du prompt, plus 2 sources nouvelles (E9 et E10). La colonne « Valeur remesurée » fait foi ; la valeur du prompt n'est rappelée qu'en cas d'écart. Commandes jouées en Git Bash depuis `c:\dev`.

| # | Existant | Valeur remesurée le 05/11/2026 | Commande |
|---|---|---|---|
| E1 | Journal de run des produits, `c:\dev\*\forge\ledger.jsonl` | 11 journaux ; par lecture JSON, `run_open` 19, `run_close` 12, `etape_open` 35, `etape_close` 444 ; 0 clé de jetons, 1 clé de durée. Écart : le `grep` du prompt rend 12, 9, 26 et 64, car 7 lignes écrivent `"type": "run_open"` avec une espace | `ls */forge/ledger.jsonl \| wc -l` ; lecture JSON ligne à ligne de chaque journal ; `grep -h '"run_open"' */forge/ledger.jsonl \| grep -vc '"type":"run_open"'` rend 7 |
| E2 | Relevé de la flotte, `P/scripts/relever-flotte.mjs` | sous-agents seulement : `jetons_sortie_sous_agents` et `jetons_relus_sous_agents` (lignes 182-183) ; `--projet` filtre par fragment du nom de dossier (ligne 261) ; 2,6 s pour 1 jour | `sed -n 1,45p scripts/relever-flotte.mjs` |
| E3 | Transcriptions de Claude Code, `~\.claude\projects` et `~\.claude-b\projects` | 1 076 et 326 fichiers, dont 587 sessions principales ; plus anciens du 2026-10-02 et du 2026-09-25 ; `usage` en 4 catégories ; aucun montant | `find ~/.claude/projects -name '*.jsonl' \| wc -l` ; `find … -printf '%TY-%Tm-%Td\n' \| sort \| head -1` |
| E4 | Rétention, `settings.json` des 2 profils | `cleanupPeriodDays` absent des deux (code de retour 1) : le défaut de 30 s'applique (source 8) | `grep -H cleanupPeriodDays ~/.claude*/settings.json` |
| E5 | Avancement des process longs | 7 fichiers chez les produits | `ls */forge/avancement.jsonl */avancement.jsonl \| wc -l` |
| E6 | Relectures d'intention, `P/todo/relectures-intention.jsonl` | 180 lignes, 0 clé de jetons. Écart : les jetons des relectures sont calculés par E2, pas écrits dans ce fichier | `grep -c '"jetons' todo/relectures-intention.jsonl` |
| E7 | Mode de facturation | abonnement, aucun prix au pilot : `grep -ci prix references/MODELES-EN-SERVICE.json` rend 0 | idem |
| E8 | Descente chez les produits | `P/gabarits/HERITAGE.json`, `P/gabarits/hooks-factory.mjs` ; le pilot n'écrit chez un produit que sur run demandé | noyau `P/CLAUDE.md`, « Produits autonomes » |
| E9 | Cumul de `/usage`, `~\.claude\stats-cache.json` | absent des 2 profils | `ls ~/.claude/stats-cache.json ~/.claude-b/stats-cache.json` |
| E10 | Télémétrie OpenTelemetry de Claude Code | éteinte : 0 variable `OTEL_` ou `CLAUDE_CODE_ENABLE_TELEMETRY` dans les réglages et l'environnement | `grep -HcE "CLAUDE_CODE_ENABLE_TELEMETRY\|OTEL_" ~/.claude*/settings.json` |

Ce que l'étude ne voit pas : le poste DESKTOP-ULTRA7 porte ses propres transcriptions et ses propres runs. Ses chiffres manquent à toutes les mesures ci-dessous.

### 0 ter. Couverture d'aujourd'hui, mesure par source

Comment lire : une ligne par mesure ; chaque case donne la part des 19 runs des 11 journaux pour laquelle la mesure se calcule aujourd'hui. Un run est « dans la fenêtre » s'il s'ouvre après le 2026-10-02 : 5 runs sur 19, et 3 de plus ne sont couverts que par le second profil.

| Mesure | Journaux (E1) | Transcriptions (E3) | Couverture |
|---|---|---|---|
| Temps | 1 clé de durée sur 11 journaux | 5 runs sur 19 entiers, 3 partiels | 26 % |
| Délai | 12 runs clos sur 19 ; 35 ouvertures d'étape pour 444 clôtures | sans objet | 63 % pour les runs ; 35 étapes au plus |
| Charge (interventions) | 199 `question_humain` et 349 `reponse_humain`, dans 10 journaux sur 11 | sans objet | 91 % des journaux |
| Jetons | 0 clé | 5 runs sur 19 | 26 % |
| Coût équivalent au tarif public | 0 | jetons × prix ; 7 modèles servis sur 7 ont un prix vérifié | 26 % |
| Coût payé et hébergement | 0 | 0 | 0 % |

## 1. Partition du problème

Six sous-questions disjointes : les 5 définitions, puis l'unité de suivi. Chaque option de la section 4 dit comment elle répond à chacune.

### 1.1 Les 5 définitions

1. **Temps** : somme, par session et par sous-agent, des écarts entre messages consécutifs inférieurs au seuil d'inactivité. Le seuil est le 95e centile des écarts de toutes les sessions principales des 2 profils : 24,85 s sur 108 856 écarts et 587 sessions (E3). Le temps agent additionne les durées des agents : 2 agents parallèles pendant une heure font 2 heures.
2. **Délai** : durée calendaire entre 2 jalons du journal (`run_open`, `etape_open`, `etape_close`, GO de MEP, `run_close`), source E1. Il couvre l'union des périodes de travail, jamais leur somme. Une étape ouverte sans clôture prend le délai « non clos » et sa date d'ouverture ; elle n'entre pas dans les moyennes.
3. **Charge** : 3 lectures possibles. (i) Le nombre d'interventions humaines, `question_humain` et `reponse_humain` du journal (E1). (ii) Le temps humain, les écarts qui précèdent un message humain : non mesuré, car un écart mêle réflexion et absence. (iii) Le temps agent de la définition 1. Je recommande (i) : elle se lit déjà dans 10 journaux sur 11 et ne double pas la mesure du temps. Le choix vous revient ; aucun taux journalier n'est posé.
4. **Jetons** : par catégorie (entrée, création de cache, lecture de cache, sortie) et par modèle, une fois par `message.id` sur sa dernière ligne, sous-agents compris (E3, méthode de E2).
5. **Coût** : 3 parts. (a) Le payé : l'abonnement, dont le montant n'est écrit nulle part au pilot ; la part du quota ne se lit que dans les sessions `claude -p` (`rate_limit_event`). (b) L'équivalent au tarif public : jetons × prix de la table 1.4 ; un modèle sans prix vérifié serait « non calculable » et sorti du total. (c) L'hébergement du déploiement : aucune source relevée.

### 1.2 Usage, unité et granularité

Comment lire : une ligne par usage des chiffres ; la granularité est la plus grosse maille qui répond encore à la question.

| Usage | Question | Granularité suffisante |
|---|---|---|
| Piloter la Factory | quel modèle et quelle étape coûtent | étape × modèle |
| Chiffrer une mission future | combien coûte une construction, un run de version, une remédiation | run, par type de run |
| Montrer son coût à un client | combien a coûté son produit sur une période | produit × mois, coût (b) marqué « estimation au tarif public » |

La session est l'unité de relevé, jamais l'unité de restitution : elle se range ensuite dans son étape, son run et son produit.

### 1.3 Attribution

La règle proposée tient en 4 points.

- R1 : une session principale appartient au produit de son `cwd`, sous-dossiers et worktrees compris.
- R2 : un sous-agent appartient à la session qui l'a lancé (fichier sous `<session>\subagents\`).
- R3 : une session du pilot ou d'une forge appartient à la Factory, sauf marqueur déclaré qui nomme le produit servi.
- R4 : un message se range dans l'étape dont l'intervalle `etape_open` – `etape_close` le contient ; hors de tout run, il est « hors run ».

Mesure de ce que R3 laisse sans produit : le pilot porte 7,47 milliards de jetons sur 18,03 milliards relevés, soit 41,4 %, et 0 de ses 59 sessions principales n'a un `cwd` de produit. Les forges et les dossiers temporaires en portent 0,2 %.

### 1.4 Prix publics

Table lue le 05/11/2026 vers 14:25 sur https://platform.claude.com/docs/en/about-claude/pricing (page « Pricing », sans date de mise à jour). Les lignes Opus 5.5 et Sonnet 5.5 ont été relues une seconde fois à la source pendant la session. En dollars par million de jetons ; les 7 modèles servis dans les transcriptions y figurent.

| Modèle | Entrée | Écriture cache 5 min | Écriture cache 1 h | Lecture cache | Sortie |
|---|---|---|---|---|---|
| Opus 5.5 | 4 | 5 | 8 | 0,20 | 20 |
| Sonnet 5.5 | 2 | 2,50 | 4 | 0,10 | 10 |
| Haiku 5.5, jusqu'à 100 000 jetons de prompt | 0,10 | 0,125 | 0,20 | 0,01 | 0,50 |
| Opus 5 et Opus 4.8 | 5 | 6,25 | 10 | 0,50 | 25 |
| Sonnet 5 | 2 | 2,50 | 4 | 0,20 | 10 |
| Fable 5.1 | 10 | 12,50 | 20 | 0,25 | 50 |

Un prix est une donnée volatile : cette table vivra dans un référentiel daté et sourcé, jamais dans du code (loi n° 4).

### 1.5 Fenêtre de conservation

Le plus ancien relevé possible date du 2026-09-25 (second profil) et du 2026-10-02 (profil principal). Claude Code supprime les transcriptions de plus de 30 jours, sans message (source 8). 11 runs sur 19 se sont ouverts avant le 2026-09-25 : Produit-12 (5 runs), Produit-61 (2), D-a, D-b et D-c (2). 3 autres se sont ouverts entre le 25/09 et le 02/10, et seul le second profil les couvre : Produit-78 (2) et D-d. Leurs jetons sont perdus ; l'étude ne les reconstruit pas.

## 2. Non-recouvrement contre l'existant

L'existant mesure les jetons d'une session et les jalons d'un run, mais rien ne relie les deux ni ne les garde au-delà de la purge. Comment lire : une ligne par existant de la section 0 bis ; la dernière colonne dit ce qu'il fait déjà et ce qu'il laisse à l'option.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| E1 Journal de run | `ledger.jsonl` des produits, types `run_open`, `etape_close`, `question_humain` | recouvre le délai et la charge ; ne recouvre pas les jetons (0 clé) |
| E2 Relevé de flotte | `P/scripts/relever-flotte.mjs`, l'en-tête : « LA FLOTTE D'AGENTS SE RELÈVE DANS LES TRANSCRIPTIONS » | recouvre les jetons des sous-agents par campagne ; ne recouvre ni les sessions principales ni le produit |
| E3 Transcriptions | `usage` de chaque réponse, 4 catégories | recouvre les jetons et le temps ; ne recouvre pas la conservation au-delà de 30 |
| E4 Rétention | `cleanupPeriodDays`, absent des réglages | ne recouvre pas : le défaut purge |
| E5 Avancement | `P/references/CONTRAT-INTERFACE.md` §4 ter | ne recouvre pas : il suit l'avancement, pas les jetons |
| E6 Relectures d'intention | `P/todo/relectures-intention.jsonl`, 0 clé de jetons | ne recouvre pas |
| E7 Facturation | `P/references/JETON-ABONNEMENT.md` | recouvre la définition du payé ; ne donne pas son montant |
| E8 Héritage | `P/gabarits/HERITAGE.json` | recouvre la voie de descente ; l'option l'emprunte |
| E9 Cumul de `/usage` | documentation, « Aggregated token and cost counts shown by `/usage` » (source 8) | ne recouvre pas : absent du poste, et sans produit |
| E10 Télémétrie | documentation, `claude_code.active_time.total` (source 1) | ne recouvre pas : éteinte ; c'est l'option O3 |

## 3. État de l'art daté

Sept sources ouvertes le 05/11/2026 entre 14:24 et 14:27 par un agent de recherche, relues dans le texte brut des pages. Les pages de documentation ne portent pas de date de publication : la date donnée est leur dernière modification, à la source indiquée.

1. Anthropic, « Monitoring », documentation Claude Code, modifiée le 2026-11-05 (en-tête HTTP), https://code.claude.com/docs/en/monitoring-usage. Exporte `claude_code.token.usage`, `claude_code.cost.usage` et `claude_code.active_time.total` par session. Pas d'attribut projet natif : l'attribut de dépôt exige `OTEL_METRICS_INCLUDE_REPOSITORY=true`.
2. Anthropic, « Manage costs effectively », documentation Claude Code, modifiée le 2026-11-05, https://code.claude.com/docs/en/costs. `/usage` donne coût, durée API, durée murale et jetons de la session ; le coût est « an estimate » calculé au tarif public.
3. ccusage, dépôt GitHub, dernier envoi le 2026-11-05, https://github.com/ccusage/ccusage. Lit les fichiers locaux, regroupe par dossier de projet (`--instances`), recalcule le coût par un fichier de prix de LiteLLM. Soumis à la même purge.
4. OpenTelemetry, conventions sémantiques GenAI, « Inference token metrics », modifiée le 2026-11-05, https://github.com/open-telemetry/semantic-conventions-genai. Compteurs de jetons par requête, dont lecture et écriture de cache ; statut « Development ». Le projet s'attache par attribut de ressource.
5. Langfuse, « Token & Cost Tracking », modifiée le 2026-10-30, https://langfuse.com/docs/observability/features/token-and-cost-tracking. Coût par observation, prix par motif de modèle, tenus par projet.
6. LiteLLM, « Spend Tracking », modifiée le 2026-04-24, https://docs.litellm.ai/docs/proxy/cost_tracking. Dépense par requête, attribuée par clé, équipe ou étiquette.
7. Helicone, « Custom Properties », modifiée le 2025-11-12, https://docs.helicone.ai/features/advanced-usage/custom-properties. Coût groupé par propriété de requête, que l'émetteur choisit.
8. Anthropic, « Explore the .claude directory », documentation Claude Code, lue le 2026-11-05 à 14:31, https://code.claude.com/docs/en/claude-directory. « The default is 30 days and the minimum is 1 » ; les transcriptions de sous-agents partent avec leur session.

Leçon commune : les outils 1 à 3 lisent Claude Code et attribuent au mieux au dossier ; les outils 4 à 7 attribuent à l'étiquette que l'émetteur pose. Aucun ne sait qu'une session du pilot travaille pour un produit : il faut le déclarer.

## 4. Options — jeu fermé O0-O4

Chaque option dit son coût de construction, les fichiers qu'elle touche, les secondes qu'elle ajoute à chaque ouverture et à chaque fin de tour, sa couverture, et ce qu'elle fait des 4 risques : un nom réel dans un dépôt public, un double comptage, un prix périmé, un hook qui ralentit l'ouverture.

- **O0 — ne rien faire** : à réfuter. 14 runs sur 19 ont déjà perdu tout ou partie de leurs jetons, les journaux n'en portent aucun, et 41,4 % des jetons relevés restent sans produit. Chaque mois sans relevé efface un mois de plus.
- **O1 — allonger la rétention**, `cleanupPeriodDays` à 3650 dans les 2 profils et sur le second poste. Coût : complexité simple · durée court ; 2 fichiers de réglages hors dépôt ; 0 s ajoutée. Couverture : la conservation seulement ; l'attribution par dossier reste au plus à 58,4 % des jetons, et les runs restent sans jetons. Risques : aucun nom publié, aucun prix, aucun hook ; mais les transcriptions gardent en clair tout ce qui passe par un outil (source 8, « Plaintext storage »), sur une durée décuplée. Exclut : le lien entre jetons et runs.
- **O2 — relevé de fin de session écrit chez le produit**. Un script du pilot, `scripts\relever-couts.mjs`, lit la transcription d'une session. Il écrit une ligne par session dans `forge\couts.jsonl` du produit : `sessionId`, run et étape courants lus au journal, jetons par catégorie et par modèle, temps actif, bornes horaires. Un hook `SessionEnd` le lance ; l'ouverture suivante relève en tâche de fond les sessions oubliées. Les sessions du pilot faites pour un produit portent un marqueur déclaré, écrit au pilot sous pseudonyme. Les prix vivent dans `references\PRIX-API.json`, daté et sourcé. Coût : complexité moyen · durée moyen ; 6 fichiers (script, recette, référentiel de prix, entrées de `gabarits\hooks-factory.mjs` et de `gabarits\HERITAGE.json`, vue de forge-data). Secondes : 0 à chaque fin de tour ; 0,52 s mesurées pour relire la plus grosse transcription du poste (73,6 Mo) à la fin d'une session ; 0 s à l'ouverture, le rattrapage étant asynchrone. Couverture : tous les runs ouverts après la mise en service. Exclut : les runs déjà purgés.
- **O3 — télémétrie OpenTelemetry de Claude Code**, attribut `produit=<pseudonyme>` posé par les réglages de chaque produit. Coût : complexité complexe · durée moyen ; un collecteur à faire tourner en permanence sur 2 postes, plus 1 réglage par produit. Secondes : 0, l'export est asynchrone. Couverture : temps actif natif, jetons et coût estimé dès l'activation. Risques : le pseudonyme quitte le poste vers le collecteur, et les sessions du pilot restent sans produit. Exclut : le lien aux étapes du journal.
- **O4 — outil tiers ccusage**, lancé à la demande. Coût : complexité simple · durée court ; 0 fichier du dépôt ; 0 s ajoutée. Couverture : celle des transcriptions présentes, soit 5 runs sur 19, regroupés par dossier comme R1. Risques : un prix pris dans un fichier tiers, hors de notre référentiel daté. Exclut : la conservation et les sessions du pilot.

Comparaison sur les 4 risques, une ligne par option écartée.

- **O1** les traite autant qu'O2, et y ajoute un risque de secret conservé en clair ; elle ne relie rien aux runs.
- **O3** les traite moins bien : le pseudonyme sort du poste, et un collecteur permanent est une dépendance de plus.
- **O4** les traite moins bien : le prix vient d'un fichier tiers, et elle disparaît avec la purge.

## 5. Verdict

- **Option retenue** : O2, un relevé de fin de session écrit dans `forge\couts.jsonl` du produit, avec un marqueur pour les sessions du pilot et un référentiel de prix daté.

Parades d'O2 aux 4 risques.

| Risque | Parade | Source |
|---|---|---|
| Un nom réel entre dans un dépôt public | le relevé chez le produit reste dans son dépôt ; le marqueur du pilot n'écrit que le pseudonyme | `P/references/PRODUITS.md` |
| Double comptage | une fois par `message.id`, sous-agents rangés sous leur session (R2) ; décomptes A et B égaux sur le run de preuve | E2, ligne 182 ; preuve ci-dessous |
| Prix périmé | le coût (b) se calcule à la lecture, depuis `references\PRIX-API.json` daté ; jamais écrit dans le relevé | loi n° 4 du noyau |
| Hook qui ralentit l'ouverture | rien au tour ni à l'ouverture ; rattrapage en tâche de fond | 0,52 s mesurées ; mémoire « Hook SessionStart sous 60 s » |

- **Coût** : complexité moyen · durée moyen. 6 fichiers, une recette rouge et verte, une descente par l'héritage (E8). Dette : une table de prix à relire à chaque changement de génération de modèles.
- **Indicateur** : part des runs dont les jetons se lisent au journal du produit, départ 5 sur 19 ; part des jetons sans produit, départ 41,4 %.
- **Candidature(s) émise(s)** : une création au registre, au statut `candidat`, par `journaliser.mjs` ; son identifiant est dans la restitution du tour.
- **Plan de revue** : 2026-12-15. Relever la part des jetons sans produit et la part des runs couverts depuis la mise en service.
- **Preuve sur un run réel** (Produit-79, run du 2026-10-07, 2 étapes closes, 1 sous-agent ; critère manqué : 2 sessions au lieu de 3 ; c'est le seul run de la fenêtre clos avec une étape close) :
  - Seuil d'inactivité retenu : 24,85 s ; le temps actif du run passe de 977 s à 2 513 s entre le 90e et le 99e centile.
  - Écart entre les décomptes A et B : 0 % ; le contrôle par `relever-flotte` rend les mêmes jetons de sous-agent.
  - Règle d'attribution : tenue sur 2 sessions sur 3 ; la session du pilot `2071e2c2…` cite Produit-84 579 fois et reste rangée à la Factory faute de marqueur.
- **Test rétro** :
  - Opérationnel : un script de relevé, un hook de fin de session, un marqueur au pilot, un référentiel de prix.
  - Tactique : relever avant la purge, au journal du produit, et déclarer ce que le `cwd` ne dit pas.
  - Stratégie : une mesure est câblée ou n'existe pas (loi n° 1) ; une donnée volatile vit dans un référentiel (loi n° 4) ; le choix reste humain (loi n° 5).
  - Intention : « tracer le temps, délai et charges, + tokens utilisés & coûts ». Le temps et les jetons viennent du relevé, le délai et la charge du journal, le coût du référentiel. « Ce qu'il est nécessaire de rajouter » est en sections 0 ter et 1 ; « les éléments à rajouter dans la Factory » sont l'option O2.

## Interdits (l'oracle les tient)

Aucun critère subjectif sans mesure ; aucune option hors du jeu fermé ; aucune ligne de non-recouvrement sans citation ; aucune source non datée ; O0 traitée.
