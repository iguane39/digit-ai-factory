# Étude d'opportunité — personas des agents de l'écosystème forge (dont pilot « chief of staff »)

**Mandat humain du 13/08/2026** — analyse seulement, aucune écriture hors `output\` et `todo\`,
aucun gabarit ni prompt système modifié. Décision humaine via candidatures TODO-FORGE.
Question : est-il pertinent d'attribuer des personas (rôles incarnés dans les prompts
d'invocation) aux agents de l'écosystème — sous-agents de campagne, agents d'étape
(conception, design, development, tests, data…) et le pilot lui-même en « chief of staff »
(analyser les livrables, échanger avec les agents, relancer/réorienter si insatisfaisant,
proposer les prochaines actions à l'humain) ? Rappel de périmètre : une forge est un dépôt,
pas un agent — le périmètre réel est l'ensemble des **prompts d'invocation d'agents**.

## 0. Lu sur pièces — le cadrage que chaque agent reçoit DÉJÀ

Vérifié dans les fichiers, pas de mémoire :

- **Pilot** : un seul rôle incarné existe dans tout l'écosystème — « Tu es l'orchestrateur »
  (`CLAUDE.md`, unique occurrence de « Tu es » sur tous les .md du dépôt). Ce rôle est défini
  par **responsabilités et garde-fous** (routage, gates, synthèse, TODO-FORGE, R-29), pas par
  traits de caractère.
- **Sous-agents de campagne** : `gabarits\AGENT-CAMPAGNE.md` (TF-0050) — un **contrat pur** :
  langue, périmètre d'écriture, chirurgie, vérification native verte avant commit (G-2),
  fixtures double sens, avancement TF-0094, git local sans push, rapport final structuré
  (statut/preuve/gains_constates/restes). Zéro persona ; le prompt = gabarit + delta.
- **Agents d'étape** : `CONTRAT-INTERFACE.md` §1 — invocation par objet ledger (forge, verbe,
  mode natif/degrade, entrées, sorties attendues, modèle, substrat) + méthode documentée de
  la forge lue comme spécification. Acceptation : « un artefact d'étape n'est accepté que si
  les oracles de la forge ont été exécutés et sont au vert — jamais de validation par
  confiance ».
- **Choix du modèle** : §4 routage par rôle **fonctionnel** (pilotage Fable, construction
  complexe Opus, défaut Sonnet, mécanique Haiku) + règle de challenge mesurée (§4 bis) —
  l'affectation se juge au ledger, pas à l'a priori.

Le style maison est donc établi : **cadrage contractuel et vérifiable, jamais incarné**.
La question devient : qu'est-ce qu'un persona ajouterait que ce cadrage ne porte pas ?

## 1. État de l'art daté — effet mesuré des personas

Recherche dédiée (1 tranche Sonnet, sources datées en annexe). Constats convergents :

- **Exactitude factuelle/technique : effet nul à négatif.** Zheng et al. (ACL Findings
  EMNLP 2024) : 162 personas × 4 familles de LLM × 2 410 questions — aucune amélioration
  vs contrôle sans persona, dégradation légère pour certains rôles ; choisir le « meilleur »
  persona par question ne bat pas l'aléatoire. PRISM (arXiv, mars 2026) réplique sur la
  génération suivante : le persona expert **dégrade systématiquement** MMLU sur 5 modèles
  (ex. 71,6 % → 68,0 % Qwen2.5-7B). Deux études à ~2,5 ans d'écart, même verdict — la
  réplication la plus solide du corpus.
- **Style, ton, alignement : effet réel.** PRISM mesure +17,7 pts de refus corrects
  (JailbreakBench) avec un persona « Safety Monitor » et un gain sélectif de préférence
  humaine (MT-Bench). Hu & Collier (ACL 2024) : l'effet persona n'aide que si les variables
  du persona expliquent déjà la tâche (< 10 % de variance sinon).
- **Multi-agents à rôles (MetaGPT, ChatDev, AutoGen, CrewAI) : le gain vient de
  l'outillage, pas de l'incarnation.** L'ablation MetaGPT (ICLR 2024) montre que l'ajout de
  rôles améliore l'exécutabilité (1,0 → 4,0), mais **confond** persona et communication
  structurée ; le feedback d'exécution de code, isolé, apporte à lui seul +4,2 %/+5,4 %
  Pass@1. Aucune ablation publiée n'isole « persona seul » des SOP/artefacts structurés —
  et MetaGPT est précisément conçu pour réduire le dialogue de rôle libre au profit
  d'artefacts. Non vérifié que le persona y contribue quoi que ce soit.
- **Fournisseur (Anthropic, doc consultée 08/2026, génération Claude 5)** : le rôle système
  est présenté comme levier de « behavior and tone » — aucune promesse d'exactitude.

Lecture pour notre cas : le pari maison (contrat vérifiable + méthode outillée + oracles,
zéro incarnation) est **exactement ce que la littérature crédite** ; ce qu'un persona
pourrait apporter se limite au registre style/posture — et peut coûter en exactitude.

## 2. Non-recouvrement — les 5 fonctions du « chief of staff » face à l'existant

| Fonction proposée | Mécanisme existant qui la porte | Delta qu'un persona apporterait |
|---|---|---|
| Analyser les livrables de chaque agent | **Oracles exécutés** par étape (contrat §1 : jamais par confiance) + vérification par sondage des rapports de campagne (`AGENT-CAMPAGNE.md` §« Ce que le pilot fait de ton rapport ») | **Négatif** : un jugement incarné (« pas satisfaisant ») réintroduirait l'appréciation subjective que la gouvernance a bannie |
| Échanger avec les agents sur les travaux | Prompt = gabarit + delta ; `bloque_question` (suspension propre, questions a/b/c à l'humain) ; rapport final = interface de sortie unique | **Nul** : les agents de campagne sont one-shot avec contrat de rapport — il n'y a pas de « dialogue » à incarner, et c'est voulu (traçabilité) |
| Relancer si le résultat ne tient pas | Boucle de fermeture **bornée ≤ 3 cycles** (G-2 absolue) ; escalade de modèle **uniquement sur échec d'oracle**, consignée au ledger (§4) | **Négatif** : une initiative de relance « au jugé » casse la borne et le critère mesurable de relance |
| Orienter les directions | Routage §4 + mesure §4 bis ; décisions encodées dans `REGLES-PROJET.md` ; gates humains (R-29, loi n° 5) | **Nul à négatif** : « orienter » sans humain violerait R-29 ; avec humain, c'est la synthèse existante |
| Proposer les prochaines actions à l'humain | Synthèse de clôture du run ; candidatures TODO-FORGE (tout entre en candidat, décision humaine) ; restes classés IA/développeur/utilisateur (format actions[] R-29) | **Faible mais réel** : la seule part non mécanisée est la **posture de restitution** (concision, priorisation, ton) — c'est un enjeu d'interface humaine, pas de jugement |

Conclusion du tableau : les cinq fonctions sont déjà portées par des mécanismes exécutables ;
le « chief of staff » existe — il s'appelle le pilot, et il juge par oracles, pas par
appréciation. Le seul delta positif possible est **stylistique** (restitution à l'humain),
le principal delta négatif est **la substitution du persona à l'oracle**.

## 3. Verdict par catégorie d'agent

| Catégorie | Verdict | Justification mesurable |
|---|---|---|
| **Pilot « chief of staff »** | **Nuisible** (en tant que juge) / **sans objet** (en tant qu'orchestrateur : le rôle existe déjà) | Toute fonction proposée est mécanisée (§2) ; un persona de juge réintroduit le critère subjectif interdit ; « relancer au jugé » casse la borne ≤ 3 cycles ; « orienter » seul viole R-29. Gain attendu : aucun mesurable. Risque : dérive de critère + tension avec le garde-fou « le pilot n'intervient jamais hors run » |
| **Sous-agents de campagne** | **Inutile** | Le gabarit contractuel produit déjà la constance recherchée (périmètre, chirurgie, preuve) avec des critères binaires ; l'état de l'art (§1) ne montre pas de gain d'exactitude attribuable au persona ; coût : tokens à chaque invocation × ~25 campagnes/semaine + un texte de plus à maintenir |
| **Agents d'étape (conception, design, development, tests, data)** | **Inutile** | L'expertise vient de la **méthode documentée de la forge** (skills, playbooks, oracles), pas d'une incarnation ; « Tu es un expert tests » n'ajoute rien à « exécute forge_tests et tiens les seuils » — et peut dégrader (verbosité, sur-confiance) |
| **Restitution à l'humain (synthèses, propositions de clôture)** | **Utile, à petite dose et hors jugement** | Une consigne de **posture de restitution** (concision, priorisation des décisions à prendre, options a/b/c) améliore l'interface humaine sans toucher aux verdicts ; c'est une consigne de style, pas un persona-juge — et elle se vérifie (format, longueur, présence des options) |

## 4. Si retenu : spécification en référentiel versionné (loi n° 4)

La seule adoption recommandable est une **consigne de restitution** (pas un persona) :

- vivre comme référentiel versionné, daté, éditable (`gabarits\` ou `references\`),
  jamais du texte figé dupliqué dans les prompts ;
- ne JAMAIS énoncer de critère de jugement (« exigeant », « satisfait ») — uniquement des
  règles de forme de la restitution, chacune vérifiable (longueur max, ordre décisions
  d'abord, options fermées a/b/c, restes classés R-29) ;
- mesurée avant généralisation : A/B sur 2 synthèses de clôture (avec/sans consigne),
  jugées sur critères binaires — conformément à la doctrine §4 bis (a priori confronté,
  jamais reconduit par habitude).

**Garde-fous réaffirmés** : un persona ne remplace jamais un verdict d'oracle exécuté ;
« pas satisfaisant » n'est recevable que comme écart à un critère mesurable ; toute relance
reste bornée ; gates et dépenses restent humains (R-29, loi n° 5) ; le pilot n'acquiert
aucune initiative hors run.

## Annexe — sources datées et traçabilité

Sources principales (datées) :

1. Zheng, Pei, Logeswaran, Lee, Jurgens — *When "A Helpful Assistant" Is Not Really
   Helpful: Personas in System Prompts Do Not Improve Performances of Large Language
   Models*, ACL Findings EMNLP, nov. 2024 — aclanthology.org/2024.findings-emnlp.888 ·
   arxiv.org/abs/2311.10054.
2. Hu, Rostami, Thomason (USC) — *Expert Personas Improve LLM Alignment but Damage
   Accuracy: Bootstrapping Intent-Based Persona Routing with PRISM*, arXiv 2603.18507,
   19 mars 2026.
3. Hu & Collier — *Quantifying the Persona Effect in LLM Simulations*, ACL 2024
   (pp. 10289-10307) — aclanthology.org/2024.acl-long.554.
4. Hong et al. — *MetaGPT: Meta Programming for a Multi-Agent Collaborative Framework*,
   arXiv 2308.00352, ICLR 2024 (ablation Table 3).
5. Anthropic — *Prompting best practices*, § « Give Claude a role », platform.claude.com,
   consulté 08/2026 (contenu génération Claude 5) : « focuses Claude's behavior and tone » —
   sans allégation d'exactitude.

Limites marquées : l'ablation MetaGPT ne sépare pas persona et outillage (non isolable dans
la littérature trouvée) ; arXiv 2512.06867 (personas × raisonnement stratégique, déc. 2025)
repéré mais non exploité (contenu non lu) ; l'ancienne page Anthropic réputée promettre un
gain de performance domaine-spécifique n'a pas été retrouvée telle quelle (non vérifié).

Traçabilité : recherche = 1 tranche Sonnet (75,6 k tokens, 14 outils, ~2 min), affectation
§4 conforme (défaut Sonnet), `escalade_modele: aucune`. Lu sur pièces : `CLAUDE.md`,
`CONTRAT-INTERFACE.md` §1/§4/§4 bis, `gabarits\AGENT-CAMPAGNE.md`,
`references\TODO-FORGE.md` ; « Tu es » vérifié par recherche exhaustive sur les .md du
dépôt (1 occurrence). Aucune construction : aucune écriture hors `output\` et `todo\`.
Candidature issue de l'étude : consigne de restitution versionnée (sidecar ingéré).
