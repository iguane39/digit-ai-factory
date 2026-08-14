# Étude d'opportunité — pans de tests « Prompts » (prompts, modèles, Q/R, stabilité, déclencheurs) — 20260814c

<!-- Gabarit : gabarits\ETUDE-OPPORTUNITE.md (TF-0155). Jugée par
     oracles\oracle-etude-opportunite.mjs (E1-E7). Mandat humain du 14/08/2026 :
     « travailler les opportunités d'intégration ». Voie references\RUN-MANDAT.md. -->

## Seuil de déclenchement (vérifié AVANT d'écrire)

Franchi deux fois : un pan d'audit est un **objet durable** (règle 31, `REGLES-PROJET.md` §K —
adaptateur, seuils opposables, chapitres de cahier), et le sujet touche **5 forges** —
forge-tests (le pan), forge-agents (le juge et le gate budget), forge-observability (les
déclencheurs), forge-agents-security (les corpus adverses), le pilot (la règle de dépense).

## 0. Traitement des entrants

Mandat humain du 2026-08-14 : « Les pans de tests Prompts (pour les prompts IA, les modèles
utilisés, les questions, les réponses et leurs stabilités/régressions dans le temps. Et les
triggers) ». Sources instruites et citées, jamais exécutées comme instructions :
`profils\chatbot.md` (Frontière R-28), `catalogues\CATALOGUES.md`, README et code de
forge-tests, forge-agents et forge-observability, plus les sources externes réunies au §3.

## 1. Partition du problème

La demande nomme six objets distincts. Ils ne se testent ni au même endroit, ni au même coût,
ni à la même cadence — les confondre produirait un pan fourre-tout impossible à seuiller.

| Partition | Objet | Nature de la mesure |
|---|---|---|
| **P1** | **Les prompts** — où vivent-ils, sont-ils adressables et versionnés ? | inventaire de surface, statique, gratuit |
| **P2** | **Les modèles utilisés** — épinglés ou désignés par un alias mouvant ? | inventaire statique + confrontation à un calendrier de dépréciation |
| **P3** | **Les questions / réponses attendues** — le corpus d'évaluation | référentiel versionné, statique |
| **P4** | **La stabilité** — la même question rendue N fois donne-t-elle la même réponse ? | exécution répétée, coûteuse, non déterministe par nature |
| **P5** | **La régression dans le temps** — le prompt, le modèle ou le corpus ont changé | comparaison appariée entre deux mesures |
| **P6** | **Les déclencheurs** — quand rejouer, et qui paie | règle de cadence + gate de dépense |

Disjonction tenue : P1-P3 se mesurent **sans appeler un modèle** (donc gratuitement et à chaque
audit) ; P4-P5 **exigent des appels** (donc un coût, un gate et une cadence) ; P6 n'est pas une
mesure mais une décision.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| forge-agents — oracle agent-evals | `catalogues\CATALOGUES.md` cat-agt-05 « détecter la régression sémantique d'un agent entre versions », TF-0106, fixtures double sens, juge distinct de l'exécutant | **recouvre le cœur de P5** : critères mécaniques EXISTS/CONTAINS/REGEX + juge sémantique, fail-closed (SKIP motivé si le juge est indisponible, jamais un PASS de complaisance) |
| oracle agent-evals — ses propres limites | en-tête du script : « Coût/latence réels de l'agent jugé (hors périmètre) » et « Sémantique hors des critères déclarés — le juge n'évalue jamais librement » | **ne recouvre pas P4 ni P6** : ni la stabilité par rejeu, ni le coût, ne sont dans son périmètre — il le déclare lui-même |
| profil chatbot — Frontière R-28 | `profils\chatbot.md` l.27-40 : « l'évaluation de la qualité conversationnelle… est un verbe nouveau qu'aucune forge n'outille aujourd'hui » + les 3 écarts nommés de agent-evals | **confirme le trou** et interdit d'anticiper : « jamais anticipé sans produit à exercer » |
| profil chatbot — mapping tests | `profils\chatbot.md` l.79 : « eval sets versionnés de non-régression de prompts, rejoués par `oracle-agent-evals` … pas suffisante seule » | **le besoin est DÉJÀ écrit** au profil, sans pan pour le porter |
| forge-tests — 12 pans et leur socle | `forge_tests\livrables\surface.py` : inventaire, états `exerce/non_exerce/non_testable/defaut/exclu`, seuils opposables, chapitres dérivés du registre | **ne recouvre pas** P1-P3 (aucun pan n'inventorie un prompt) mais **fournit toute la mécanique** : un pan neuf hérite de l'inventaire, des seuils, des cahiers et du dashboard |
| forge-tests — détection d'instabilité | `forge_tests\flaky.py` : « rejoue une commande plusieurs fois et relève les tests dont le VERDICT a varié à code source IDENTIQUE » ; NON_JUGE : « deux rejeux identiques ne prouvent pas l'ABSENCE de non-déterminisme » | **recouvre le MÉCANISME de P4** : le rejeu N fois et la comparaison de verdicts existent déjà, appliqués aux tests et non aux réponses |
| forge-tests — tendance multi-runs | `--precedent` répétable (TF-0159) : « plusieurs rapports, du plus ancien au plus récent, donnent l'historique multi-runs », rendu au dashboard | **recouvre le TRANSPORT de P5** : comparer des mesures dans le temps est déjà outillé et rendu |
| forge-observability — dérive entre runs | cat-obs-01 « Observer (plans → snapshots) » · cat-obs-02 « Détecter la dérive », TF-0112, self-test 30 PASS ; sonde `rapport_json` citée sur « ex. rapport forge-tests » | **recouvre P5 dans le temps long** : les snapshots et la détection de dérive existent, et savent déjà lire un rapport forge-tests |
| forge-observability — cadence | `README.md` : « **`cadence`** est une annotation **documentaire** en v0 : `observer.mjs` exécute une passe » | **ne recouvre PAS P6** : aucun planificateur — le déclencheur est le trou réel |
| forge-agents — gate budget | cat-agt-06 « Gate budget G0 — plafonner les appels modèle d'un ticket avant l'appel, fail-closed », TF-0106 ; réserve notée au catalogue : `.queue` non versionné | **recouvre la moitié de P6** (le plafond existe), pas la règle de cadence |
| forge-agents-security — corpus adverses | TF-0188 (candidat créé le 14/08) : corpus d'injection versionné + mapping LLM Top 10 | **ne recouvre pas** ce pan : l'un mesure la RÉSISTANCE à l'adversaire, l'autre la STABILITÉ du service nominal — deux verbes, deux forges |
| règle 29 — l'humain décide des dépenses | `REGLES-PROJET.md` §I (TF-0131) : « dépenses et gates restent humains » | **contraint P4/P6** : un pan qui appelle un modèle à chaque audit dépenserait sans mandat — il ne peut pas être dans la voie par défaut |
| garde-fou d'écosystème | noyau `CLAUDE.md` : « aucune API tierce payante hors Claude » | **contraint O4** : un outil tiers n'est admissible que s'il est gratuit ET pilote un modèle déjà payé |

## 3. État de l'art daté

Sources vérifiées à la source (registres PyPI/npm, API GitHub, pages fournisseurs) le
2026-08-14. Les incertitudes sont déclarées en fin de section, jamais lissées.

| Source | Date | Ce qu'elle établit |
|---|---|---|
| Thinking Machines Lab — « Defeating Nondeterminism in LLM Inference » | 2025-09-10 | à température 0, **1 000 complétions produisent 80 sorties distinctes**, divergence au token 103 ; la cause est la non-invariance au batch, pas le flottant. Des noyaux batch-invariants rendent les 1 000 sorties identiques, au prix de 26 s → 42-55 s |
| Miller — « Adding Error Bars to Evals » (arXiv:2411.00640) | 2024-11-01 | cadre statistique de référence : erreurs standard, **comparaison appariée** entre deux mesures, dimensionnement préalable de l'expérience |
| Gonzalez-Pumariega et al. — « On the Reliability of Computer Use Agents » (arXiv:2604.17849) | 2026-04-20 | recommande l'évaluation sur **runs répétés avec tests appariés** et distingue stochasticité d'exécution, ambiguïté de spécification et variabilité d'agent |
| Anthropic — Model deprecations | dernière entrée 2026-06-05 | préavis ≥ 60 jours, cycle Active/Legacy/Deprecated/Retired ; `claude-opus-4-1-20250805` déprécié 2026-06-05, **retiré 2026-08-05** — neuf jours avant cette étude |
| OpenAI — Deprecations | dernière entrée 2026-07-20 | préavis ≥ 6 mois (GA), 3 mois (variantes), ~2 semaines (preview) ; la plateforme Evals est dépréciée depuis 2026-06-03 pour arrêt le **2026-11-30** |
| Google — Gemini API changelog | entrées 2026-01 à 2026-08 | les alias `-latest` sont **remappés à dates fixes** (`gemini-flash-latest` → `gemini-3.5-flash` le 2026-05-19) : l'alias change le système sous test sans qu'aucun commit ne bouge |
| promptfoo | dernier push 2026-08-14, release 0.122.0 le 2026-08-04 | MIT, maintenu ; `--fail-on-error` et action CI donnant un **verdict par code de sortie** ; déclencheur d'exemple = PR touchant les fichiers de prompt |
| DeepEval | v4.1.8 le 2026-08-12 | Apache-2.0, maintenu ; `deepeval test run` s'appuie sur pytest et transforme des seuils par métrique en verdict |
| Inspect AI (UK AI Security Institute) | v0.3.258 le 2026-08-12 | MIT, cadence quasi quotidienne, CLI `inspect eval` |
| Ragas | v0.4.3 le 2026-01-13, dernier push 2026-02-24 | Apache-2.0 mais **~7 mois sans release** — bibliothèque, sans CLI de verdict |
| Langfuse | SDK 4.14.4 le 2026-08-11 | documente datasets/experiments, juge LLM, gating CI « block deploys on regressions », évaluation en ligne sur traces échantillonnées |
| Shi et al. — « Judging the Judges » (arXiv:2406.07791) | v9 2025-11-11 | sur >150 000 instances, le **biais de position du juge est systématique**, non aléatoire, corrélé à l'écart de qualité entre candidats |
| Xu et al. — « Am I More Pointwise or Pairwise? » (arXiv:2602.02219) | 2026-02-02 | la notation **par rubrique n'échappe pas** au biais de position ; permuter l'ordre des options l'atténue |
| Han et al. — « Judge's Verdict » (arXiv:2510.09738) | 2025-10-10 | sur 54 juges : la corrélation masque un biais de sévérité — mesurer l'**accord** (kappa) contre un échantillon humain annoté |

**Convergences.** (1) Le verdict machine est acquis côté outillage libre : la question n'est
plus « peut-on automatiser » mais « qui fixe le seuil ». (2) Le vocabulaire est stabilisé
(eval set, golden set, scorer, juge LLM, pairwise, rubrique) mais **aucun chiffre normatif**
n'est publié en source primaire — ni taille de corpus, ni nombre de rejeux, ni variance
tolérée. (3) Le déterminisme à température 0 est démenti expérimentalement : mesurer sur un
run unique est invalide. (4) Les trois fournisseurs publient des calendriers de retrait bornés
— l'épinglage est un prérequis de reproductibilité et la date de retrait un déclencheur
planifiable. (5) Le juge est utilisable mais biaisé de façon reproductible.

**Incertitudes déclarées** (elles pèsent sur le verdict) : aucune source primaire ne chiffre la
taille d'un corpus ni le nombre de rejeux — tout seuil que ce pan poserait serait un **choix
de l'écosystème, à déclarer comme tel, jamais présenté comme une norme**. Les licences de
`openai/evals` et de Langfuse sont contradictoires entre README et API GitHub. Le coût comme
critère de déclenchement n'est étayé par aucune source primaire. Enfin, point relevé en
passant et non recoupé : Anthropic marque `temperature`, `top_p` et `top_k` **dépréciés** à
partir de Claude Opus 4.7 — un protocole de stabilité fondé sur le pilotage de la température
perdrait ce levier.

## 4. Options — jeu fermé O0-O4

### O0 — ne rien faire

**Réfutée.** Coût du statu quo, cité : le profil chatbot ÉCRIT le besoin (« eval sets
versionnés de non-régression de prompts », l.79) et constate dans la même page qu'aucune brique
ne le tient seule ; l'écosystème lui-même fait tourner des dizaines de prompts (skills,
gabarits, prompts d'usage) dont **aucun n'est inventorié, aucun modèle n'est épinglé, aucune
réponse n'a de référence** — un remap d'alias fournisseur changerait leur comportement sans
qu'un seul commit ne bouge, et personne ne le verrait. Le retrait de `claude-opus-4-1` neuf
jours avant cette étude montre que le risque n'est pas théorique.

### O1 — forge dédiée « forge-prompts »

Contenu : 15e dépôt, verbes propres, cadence propre. **Réfutée par la règle 28** telle que le
profil chatbot l'applique : les 4 critères exigent au minimum une v0 **exercée sur un produit
réel** et une cadence propre ; aucun produit conversationnel n'est en run aujourd'hui. Le profil
écrit lui-même « jamais anticipé sans produit à exercer, même précédent que `profils\mobile.md`
et `profils\desktop.md` ». Créer la forge maintenant serait exactement l'anticipation interdite.

### O2 — un pan `prompts` dans forge-tests, v0 bornée au GRATUIT, le coûteux délégué

Contenu, partition par partition :

- **P1-P3, dans le pan (gratuit, à chaque audit)** : inventorier les prompts adressables du
  produit (fichiers de prompt, skills, gabarits), les **modèles nommés** et leur forme
  (épinglé `nom-AAAAMMJJ` vs alias mouvant), et le corpus de questions/réponses attendues.
  États repris tels quels du socle : un prompt sans corpus est `non_exerce`, un modèle
  désigné par alias est un **finding** (`modele-non-epingle`), un corpus absent est
  `non_testable`. Seuils opposables déclarés : part des prompts couverts par au moins un cas,
  part des modèles épinglés. Zéro appel modèle : ce volet tourne dans tous les audits.
- **P4, opt-in et gaté** : la stabilité par **rejeu N fois** réutilise le mécanisme de
  `flaky.py` (verdicts qui varient à source identique), appliqué aux réponses. Jamais dans la
  voie par défaut : `--pans prompts` explicite, plafond de dépense par le gate G0 de
  forge-agents (cat-agt-06), et le nombre de rejeux **déclaré au rapport** puisque aucune
  source primaire ne le normalise.
- **P5, par composition** : le jugement sémantique reste chez `oracle-agent-evals` (cat-agt-05,
  juge distinct de l'exécutant, fail-closed) — le pan l'invoque, il ne le réimplémente pas ; la
  tendance entre audits passe par `--precedent` (déjà rendu au dashboard) et le temps long par
  les snapshots de forge-observability.
- **P6, deux gestes distincts** : la cadence par une sonde forge-observability (le type
  `oracle_externe` accepte déjà un oracle à contrat JSON), et une **règle projet** disant que
  tout pan qui dépense est sur mandat, jamais dans la voie automatique — R-29 rendue exécutable.

Coût : un adaptateur neuf + trois branchements + une règle. Ce qu'elle exclut : une identité
propre au sujet, et l'évaluation conversationnelle en canal réel, qui reste derrière la
Frontière R-28. **Premier corpus exerçable, disponible aujourd'hui** : les skills et gabarits
de l'écosystème lui-même — de quoi tenir le critère « v0 exercée » sans attendre un client.

### O3 — tout étendre dans forge-agents, sans pan

Contenu : élargir `oracle-agent-evals` (rejeu N fois, épinglage, corpus) et s'en tenir là.
Coût : faible à court terme. **Réfutée** : le sujet perdrait l'inventaire de surface, les
seuils opposables, les cahiers dérivés et le dashboard — c'est-à-dire tout ce qui fait qu'un
constat est **rattaché à un élément nommé** et qu'un trou de couverture se voit. La forge des
agents juge des sorties d'agents ; elle n'inventorie pas la surface d'un produit.

### O4 — envelopper un outil tiers (promptfoo, DeepEval ou Inspect) en oracle

Contenu : un oracle enveloppe qui traduit le code de sortie de l'outil en verdict, sur le
modèle exact d'`oracle-sca.mjs` chez websec. Coût : une dépendance externe de plus, à suivre.
**Réserve tranchante** : les trois outils sont libres et gatables, donc l'option est réelle et
**reste ouverte comme accélérateur du volet P4**. Elle ne se substitue pas à O2 : aucun d'eux
n'inventorie la surface de prompts d'un produit ni ne produit de cahier — ils exécutent un
corpus qu'on leur donne. La leçon de fraîcheur est au dossier : la plateforme Evals d'OpenAI
est arrêtée le 2026-11-30 et Ragas n'a pas publié depuis 2026-01-13 ; enveloppe-t-on un outil,
il faut l'enveloppe **paramétrable**, pas un outil codé en dur.

## 5. Verdict

- **Option retenue** : O2 — un pan `prompts` dans forge-tests, v0 bornée à ce qui se mesure
  sans appeler un modèle, le coûteux et le sémantique délégués aux briques existantes.
- **Coût** : un adaptateur (inventaire, états, seuils, `POUR_COUVRIR`, `CHAMPS_REQUIS`,
  `NON_JUGE`), trois branchements (agent-evals en juge, flaky pour le rejeu, observability pour
  la cadence) et une règle projet de dépense. Dette assumée et déclarée : **tout seuil chiffré
  posé par ce pan sera un choix de l'écosystème, pas une norme** — aucune source primaire n'en
  publie ; et l'évaluation conversationnelle en canal réel reste derrière la Frontière R-28.
- **Candidature(s) émise(s)** : trois candidats en statut `candidat`, décision humaine —
  (1) forge-tests : pan `prompts` v0 gratuite (inventaire des prompts, épinglage des modèles,
  corpus Q/R, seuils) ; (2) forge-tests + forge-agents : volet stabilité par rejeu, opt-in,
  sous gate budget, jugement délégué à `oracle-agent-evals` ; (3) pilot + forge-observability :
  règle « un pan qui dépense est sur mandat » et sonde de cadence sur les dates de dépréciation
  fournisseur, aujourd'hui documentaires en v0.
- **Décisions réservées à l'humain** (`bloque_question`, non tranchées ici) : le nombre de
  rejeux et le seuil de stabilité, qu'aucune source ne normalise ; l'ouverture ou non de O4
  (enveloppe d'un outil tiers libre) ; et le budget alloué au volet coûteux, qui est une
  dépense au sens de la règle 29.
- **Plan de revue** : 2026-11-14 — quatre mesures : le pan v0 est-il exercé sur le corpus de
  skills de l'écosystème ; combien de modèles non épinglés a-t-il trouvés ; la sonde de cadence
  a-t-elle levé une dépréciation avant sa date ; l'arrêt de la plateforme Evals d'OpenAI
  (2026-11-30) a-t-il déplacé le paysage d'outillage.

## Ce que cette étude ne juge pas

- **La qualité d'un prompt** : ce pan mesurerait la stabilité et la non-régression, jamais si un
  prompt est bon. Cela relève de `prompt-analyzer-l99` (cat-agt-07), qui analyse, et de la revue
  humaine.
- **La fiabilité du juge sur NOTRE corpus** : les biais sont établis en général (§3), pas
  mesurés ici. Une calibration contre un échantillon annoté par un humain est un prérequis à
  documenter avant d'opposer un verdict sémantique.
- **Le coût réel** : aucun chiffre de dépense n'est avancé — il dépend du corpus, du nombre de
  rejeux et du modèle, tous non tranchés. Le gate reste humain par construction.
