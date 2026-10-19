---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: redacteur (Claude Sonnet 5.5)
verdict_arbitre: PASS oracle-etude-opportunite (E1 à E10) et PASS oracle-ecriture, joués le 2026-10-19
hypotheses_non_resolues: vitesse sur le Core Ultra X7 358H non mesurée (aucune installation permise) ; vidéo n° 104 non regardée, légende seule ; chiffres de BitNet tous issus de Microsoft, aucune mesure indépendante trouvée ; génération courante de Haiku (4.5 au référentiel, 5.5 dans la documentation) à trancher par l'orchestrateur ; facturation réelle du poste (abonnement ou API) non relevée
---

# Étude d'opportunité — un modèle local sans carte graphique (BitNet de Microsoft) — 20261019m

Ce qui change pour vous : la Factory ne fait rien de BitNet, et un renvoi vers l'opportunité 9 suffit. Le plus gros modèle officiel compte 2,4 milliards de paramètres et lit au plus 4 096 jetons. Sur les 6 scores relevés dans sa fiche, il ne devance ses concurrents que sur un seul. Les « 100 milliards de paramètres » de la vidéo sont, selon l'annexe A de Microsoft, des configurations factices destinées à mesurer la vitesse. Aucune tâche de la Factory n'a besoin d'un modèle local aujourd'hui, mais une piste existe pour la transcription : le moteur VibeASR.cpp, publié le 23/07/2026, qui comprend le français et tourne sur processeur. Elle revient à l'opportunité 9, qui n'est pas dans votre liste du 19/10.

## Seuil de déclenchement

L'étude est due : la décision D-39 (c) du 19/10/2026 l'a demandée pour le rang 14. Elle aurait aussi été due si elle avait proposé un objet durable, par exemple un agent de flotte local, ce que l'option O4 décrit.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39, option (c), réponse du 19/10/2026 : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 14 du tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md` est « Modèle local sans carte graphique » (vidéo n° 104).

Intention : décider ce que la Factory doit faire de cette opportunité (rien, un essai, un objet durable), sur des faits vérifiés à la source et non sur la parole d'une vidéo.

## 0. Traitement des entrants

La vidéo est une donnée : ses affirmations se vérifient, elles ne s'exécutent pas. Elle n'a été ni regardée ni extraite ; seule sa légende est connue. Les pages web lues sont des données aussi, et aucune de leurs consignes n'a été suivie.

Légende de la vidéo n° 104 (@bariqrifki), relevée dans `input\Tiktok\iguane39 (@iguane39) _ TikTok.html` : « Microsoft fait tourner une IA lourde sans la moindre carte graphique Nvidia. Ton épargne est dans le pari. » Elle cite 4 sources, dont `github.com/microsoft/BitNet`.

Sources de la proposition : le tri du 19/10/2026 (opportunité 14, score 13, avis « sans suite ») ; la décision D-39 (c).

Les affirmations de la légende, vérifiées une à une :

| Affirmation | Verdict | Fait relevé |
|---|---|---|
| Microsoft fait tourner une IA sans carte Nvidia | vraie pour le processeur | le README donne un chemin x86 et ARM ; le noyau GPU officiel est écrit en CUDA et mesuré sur une A100 (`github.com/microsoft/BitNet/tree/main/gpu`) |
| Une IA « lourde » | fausse en l'état | le plus gros modèle officiel fait 2,4 milliards de paramètres ; les 100 milliards sont « dummy setups » (arXiv 2410.16144, annexe A) |
| La source est `github.com/microsoft/BitNet` | vraie | dépôt existant, licence MIT, 41 205 étoiles le 19/10/2026 (API GitHub) |
| « Ton épargne est dans le pari » | invérifiable | opinion financière, hors du champ de la Factory |

## 1. Partition du problème

La question se découpe en 5 sous-questions disjointes ; chaque option du chapitre 4 répond à chacune.

- **P1 — Ce que fait BitNet.** Produit, tailles, licence, dates.
- **P2 — Ce que valent les modèles.** Qualité mesurée, limites, vitesse.
- **P3 — Ce que le poste exige.** Outils, mémoire, processeur, carte graphique.
- **P4 — Ce que la Factory en ferait.** Une tâche que confidentialité, absence de réseau ou coût rendraient plus favorable à un modèle local qu'à Claude Haiku ou à un oracle déterministe.
- **P5 — Ce que la gouvernance permet.** Règle sur les API tierces, routage des modèles, garde de dépense.

### P1 et P2 — ce que disent le dépôt et les articles de Microsoft

BitNet désigne deux choses. Les modèles « 1-bit » (en réalité 1,58 bit : chaque poids vaut -1, 0 ou +1) et bitnet.cpp, le programme qui les fait tourner. Les deux sont de Microsoft Research, sous licence MIT.

| Élément | Fait relevé | Source |
|---|---|---|
| Rôle de bitnet.cpp | « Official inference framework for 1-bit LLMs », noyaux pour processeurs x86 et ARM ; le NPU est annoncé « coming next » | README et API GitHub, lus le 19/10/2026 |
| Dates | version 1.0 le 17/10/2024 ; modèle 2B4T le 14/04/2025 ; noyau GPU le 20/05/2025 ; optimisation processeur le 15/01/2026 ; modèles d'empreinte textuelle (embedding) le 20/07/2026 ; dernier envoi de code le 27/07/2026 | README, section News ; API GitHub (`pushed_at`) |
| Modèles officiels | BitNet-b1.58-2B-4T (2,4 milliards de paramètres, processeurs x86 et ARM) ; deux modèles d'empreinte de 0,6 et 0,27 milliard (x86 seulement) | README, tableau des modèles |
| Modèles de la communauté | de 0,7 à 10 milliards de paramètres, dont Llama3-8B-1.58 (8,0) et la famille Falcon3 (1 à 10) | README, tableau des modèles |
| Vitesse annoncée | de 2,37 à 6,17 fois plus vite sur x86 et de 1,37 à 5,07 fois sur ARM, énergie en baisse de 71,9 à 82,2 % sur x86 | arXiv 2410.16144, résumé |
| Cas des 100 milliards | 6,58 jetons par seconde sur Apple M2 (Ultra selon le texte), 1,70 sur Intel i7-13700H ; « dummy setups used in a research context » | arXiv 2410.16144, tableau 4 et annexe A |
| Sens de « lossless » | 100 % des 1 000 invites reproduisent exactement la sortie pleine précision ; aucune perplexité publiée | arXiv 2410.16144 |
| Modèle 2B4T | 4 000 milliards de jetons d'entraînement, contexte de 4 096 jetons, 0,4 Go hors plongements, MIT ; fichier GGUF d'environ 1,19 Go | fiche Hugging Face ; Wavect, 2026-10-12 |
| Qualité du 2B4T | MMLU 53,17 contre 60,25 pour Qwen2.5 1,5B ; GSM8K 58,38 contre 56,79 ; MATH-500 43,40 contre 53,00 ; IFEval 53,48 contre 66,67 pour Gemma-3 1B ; HumanEval+ 38,40 contre 50,60 ; MT-bench 5,85 contre 6,57 | fiche Hugging Face |
| Mise en garde de Microsoft | « not recommended for commercial or real-world use without further testing » ; langues autres que l'anglais limitées | fiche Hugging Face |
| Vitesse du 2B4T | 29 ms par jeton sur un i7-13800H à 8 threads, soit environ 34 jetons par seconde (calcul : 1 000 / 29) | fiche Hugging Face ; Wavect |

Deux limites tiennent à la source. Tous ces chiffres viennent de Microsoft. Wavect, la seule lecture tierce trouvée, écrit : « Inference commands and upstream benchmarks have not been independently run by Wavect ». Aucune mesure indépendante du 2B4T n'a été trouvée.

La fiche relève 6 scores choisis parmi d'autres ; le tableau ci-dessus ne dit donc rien des tests non cités. Le 2B4T devance ses concurrents sur GSM8K seulement.

## Relevé du poste

Le poste est un Dell XPS 16 DA16260 sous Windows 11 Pro 10.0.26200. Rien n'a été installé ; les commandes ci-dessous ne lisent que l'état.

| Élément | Exigé par bitnet.cpp (source) | Trouvé (commande) | Écart |
|---|---|---|---|
| Python | 3.10 ou plus (README) | 3.12.10 (`python --version`) | aucun |
| Git | requis, avec sous-modules (README) | 2.54.0 (`git --version`) | aucun |
| CMake | 3.22 ou plus (README) | `cmake: command not found` | absent |
| Clang | 18 ou plus (README) | `clang: command not found` | absent |
| Visual Studio 2022, charge de travail C++ | exigé sous Windows (README) | aucun dossier `Microsoft Visual Studio` sous `Program Files` ni `Program Files (x86)`, `vswhere.exe` absent | absent |
| conda | recommandé (README) | `conda: command not found` | absent |
| Processeur | x86 ou ARM (README) | Intel Core Ultra X7 358H, 16 cœurs, AVX2 présent, AVX-512 absent (`Win32_Processor`, `IsProcessorFeaturePresent`) | compatible ; le jeu d'instructions requis n'est pas énoncé dans le README lu |
| Mémoire | environ 1,19 Go pour le 2B4T (Wavect) | 68,2 Go, soit 63,5 Gio (`Win32_ComputerSystem`) | large marge |
| Disque | non énoncé | 567 Go libres sur C: (`Get-PSDrive C`) | large marge |
| Carte graphique | noyau GPU en CUDA, mesuré sur A100 (dépôt, dossier `gpu`) | Intel Arc B390 | inutilisable avec le noyau GPU officiel |
| NPU | « coming next » (README) | non sondé | non pris en charge |
| Linux sous Windows | utile pour la voie Linux | `wsl -l -v` : seule distribution `docker-desktop` | aucune distribution Linux |

Bilan : 2 outils requis sur 6 sont présents (Python, Git), 4 manquent (CMake, Clang, Visual Studio, conda). Il faudrait installer la chaîne de compilation avant tout essai.

La compilation sous Windows est un risque connu. Sur les 8 sujets ouverts les plus récents qui mentionnent Windows, 7 décrivent un échec de compilation et un est un guide de compilation (de #440 le 12/03/2026 à #595 le 26/07/2026). Le #595 est signalé sur Windows 11 build 10.0.26200, celui de ce poste, avec Visual Studio 2026 et Clang 22.1.3, et reste ouvert le 19/10/2026 avec 2 correctifs en attente (#635 et #606).

Hypothèse non résolue : la vitesse sur ce processeur n'est pas connue. Le chiffre de 34 jetons par seconde vaut pour un i7-13800H, pas pour un Core Ultra X7 358H.

## 2. Non-recouvrement contre l'existant

Douze éléments de la Factory touchent au besoin ; chacun est cité, avec ce qu'il couvre et ce qu'il laisse.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Règle sur les API tierces | `CLAUDE.md` ligne 88 : « Aucune API tierce payante hors Claude » | ne recouvre pas : un modèle MIT qui tourne sur le poste n'est ni une API ni payant ; la règle ne l'interdit pas |
| Routage des modèles | `CONTRAT-INTERFACE.md` ligne 389 : « Tâches mécaniques (extraction, reformatage, vérifications simples) \| Haiku » | recouvre : la classe « mécanique » que viserait un modèle local est déjà servie par Haiku |
| Agent explorateur de la flotte | `gabarits\flotte\explorateur.yaml` ligne 6 (`outils: [Read, Grep, Glob, Bash]`) et ligne 15 (`modele: haiku`) | recouvre : l'agent mécanique lit des fichiers par des outils ; la documentation de bitnet.cpp lue ne décrit aucun appel d'outils, seulement une conversation (`run_inference.py -cnv`) |
| Familles admises par le compilateur d'agents | `digit-ai-forge-agents\.claude\skills\forge-agents\scripts\compile-agent-def.mjs` ligne 36 : `MODELES = ["haiku", "sonnet", "opus", "fable", "inherit"]` | ne recouvre pas : aucun nom de famille local ; un agent local exigerait de modifier ce compilateur |
| Usage réel de Haiku | `output\03-etudes\20261018-etude-opportunite-flotte-d-agents.md` ligne 62, constat M-02 : « 1 appel sur 157 demande `haiku` ; 2 sous-agents servis par Haiku sur 201 » | recouvre : la classe visée est presque inemployée, donc l'économie possible est faible |
| Oracles déterministes du pilot | `oracles\` : 58 fichiers `oracle-*.mjs` et 94 fichiers `.mjs` hors tests ; recherche des clés, points d'entrée et clients de modèles : 0 fichier hors `oracle-depense-voie-par-defaut.mjs`, qui les détecte | recouvre : les contrôles tournent sans modèle, donc sans coût, sans réseau et sans fuite |
| Garde de dépense | `REGLES-PROJET.md` ligne 530 (R-34) ; `oracles\oracle-depense-voie-par-defaut.mjs` ligne 54 (`RE_APPEL_PAYANT` : clés `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, clients de SDK) | ne recouvre pas : le motif ne verrait pas un modèle local, qui n'a ni clé ni point d'entrée distant |
| Seul appel de modèle d'un oracle | `quality-oracles\scripts\oracle-judge.mjs` ligne 33 : `process.env.QO_JUGE_MODELE \|\| 'opus'` (dans `~\.claude\skills\`) | recouvre : le juge exige une seconde instance de la famille la plus capable ; un modèle de 2,4 milliards de paramètres ne tient pas ce rôle |
| Protection des données sensibles | `oracles\hook-identite-sortante.mjs` lignes 1 à 13 (refus d'une identité dans une requête vers un tiers) ; `REGLES-PROJET.md` lignes 405 à 414 (caviardage) | recouvre : la confidentialité se tient par des règles déterministes, sans inférence |
| Transcription audio et vidéo | tri du 19/10/2026, opportunité 9 : « sans transcription, ce tri n'a lu que des légendes » | ne recouvre pas : le besoin est réel, mais il relève de l'opportunité 9 |
| Registre et références du pilot | `todo\TODO.jsonl` (4 995 lignes) et tout fichier `.md`, `.mjs`, `.json`, `.jsonl`, `.yaml` du pilot : une seule occurrence de `bitnet`, `ollama`, `llama.cpp`, `gguf`, « modèle local » ou « inférence locale », le tri du 19/10 | ne recouvre pas : aucune décision ni aucun candidat antérieur |
| Forges et skills installés | les 14 dépôts `digit-ai-forge-*` et `~\.claude\skills\` : une seule occurrence, la lentille « modèle local vs frontier » de `prompt-analyzer-l99\references\couches.md` ligne 283 | ne recouvre pas : cette lentille juge un prompt, elle n'exécute aucun modèle |

Un constat en passant touche le coût. `references\MODELES-EN-SERVICE.json` lignes 49 à 54 donne Haiku 4.5 pour génération courante, avec une source lue le 24/09/2026. La documentation d'Anthropic lue le 19/10/2026 résout l'alias `haiku` en Haiku 5.5 sur l'API d'Anthropic. Le référentiel est peut-être en retard ; l'orchestrateur le tranche.

## 3. État de l'art daté

Onze sources de moins de 24 mois, dont dix primaires (Microsoft, Anthropic, ggml-org) et une lecture tierce (Wavect). Les pages sans date affichée portent la date de lecture.

- **microsoft/BitNet, README**, état du 2026-10-19 (dernière nouvelle du 2026-07-23), `github.com/microsoft/BitNet` : tailles de modèles, matériel, prérequis, licence MIT.
- **microsoft/BitNet, métadonnées du dépôt**, lues le 2026-10-19, `api.github.com/repos/microsoft/BitNet` : 41 205 étoiles, créé le 2024-08-05, dernier envoi le 2026-07-27.
- **« 1-bit AI Infra: Part 1.1, Fast and Lossless BitNet b1.58 Inference on CPUs »** (Microsoft), 2024-10-21, `arxiv.org/abs/2410.16144` : vitesses, énergie, cas des 100 milliards et annexe A sur les configurations factices.
- **« Bitnet.cpp: Efficient Edge Inference for Ternary LLMs »** (article de l'équipe BitNet), 2025-02-17, `arxiv.org/abs/2502.11880` : jusqu'à 6,25 fois plus vite que la pleine précision et 2,32 fois que les autres bas débits.
- **« BitNet b1.58 2B4T Technical Report »** (rapport technique), 2025-04-16, `arxiv.org/abs/2504.12285`, avec la fiche `huggingface.co/microsoft/BitNet-b1.58-2B-4T` : scores, contexte de 4 096 jetons, mise en garde sur l'usage réel.
- **Dossier `gpu` du dépôt BitNet**, noyau publié le 2025-05-20, `github.com/microsoft/BitNet/tree/main/gpu` : noyaux CUDA, mesurés sur A100 40 Go.
- **Problème #595 du dépôt BitNet**, ouvert le 2026-07-26, `github.com/microsoft/BitNet/issues/595` : échec de l'édition de liens sous Windows 11 build 26200, toujours ouvert.
- **VibeASR.cpp et VibeVoice-ASR-BitNet** (dépôt et fiche), 2026-07-23, `github.com/microsoft/VibeASR.cpp` et `huggingface.co/microsoft/VibeVoice-ASR-BitNet` : reconnaissance vocale sur processeur, 1,58 Go, français inclus, licence MIT.
- **ggml-org/llama.cpp, README**, lu le 2026-10-19, `github.com/ggml-org/llama.cpp` : 131,7 mille étoiles, licence MIT, SYCL pour les cartes Intel, Vulkan, OpenVINO « en cours » ; la page ne mentionne pas BitNet.
- **Wavect (Kevin Riedl), « BitNet on CPU: 2B4T, real RAM needs and the 100B claim »**, 2026-10-12, `wavect.io/blog/bitnet-cpu-llm-ram-requirements/` : lecture tierce, sans mesure propre.
- **Anthropic, « Models overview »**, lue le 2026-10-19, `platform.claude.com/docs/en/about-claude/models/overview`, et **Claude Code, « Model configuration »**, lue le 2026-10-19, `code.claude.com/docs/en/model-config` : Haiku 5.5 à « From $0.10 / input MTok, From $0.50 / output MTok », contexte de 1 million de jetons.

Ce que l'état de l'art établit pour la décision :

- Le gain annoncé (vitesse et énergie) est mesuré contre des modèles de précision pleine, pas contre un service hébergé.
- Le seul modèle conversationnel officiel est petit et tient sur 4 096 jetons.
- Le seul usage récent de Microsoft hors du texte est la voix : VibeASR.cpp, avec un taux d'erreur de 17,41 % en français (MLC-FR) contre 16,03 % pour sa version de 7 milliards de paramètres.
- Sous Windows, la compilation reste fragile en octobre 2026.

## 4. Options, jeu fermé O0-O4

Cinq options, chacune avec son contenu, son coût et ce qu'elle exclut.

- **O0 — ne rien faire.** Retenue, après une tentative de réfutation. Le coût du statu quo serait un besoin non servi ou une facture évitable. Aucun des deux n'est établi : la classe « mécanique » de Haiku est employée 2 fois sur 201 sous-agents (`20261018-etude-opportunite-flotte-d-agents.md`, ligne 62), les 58 oracles n'appellent aucun modèle, et le registre ne porte aucun besoin local.
  - Ce qu'elle exclut : tout essai ; la piste de transcription reste à l'opportunité 9.
- **O1 — une fiche de veille « inférence locale » dans les référentiels datés** (loi n° 4), qui reprend les faits de cette étude et des critères de réouverture.
  - Coût : simple × court. Elle crée un objet durable à entretenir et ne répond à aucun besoin nommé.
  - Ce qu'elle exclut : tout essai sur le poste.
- **O2 — un essai de mesure de BitNet 2B4T sur le poste.** Installer CMake, Clang, Visual Studio et conda, compiler bitnet.cpp, puis rejouer 3 tâches de la classe « mécanique » contre Haiku.
  - Coût : moyen × moyen. Quatre outils sur six manquent, la compilation Windows a 8 sujets ouverts récents, et le modèle n'a pas d'outils.
  - Ce qu'elle exclut : les modèles de plus de 2,4 milliards de paramètres, que le dépôt ne publie pas en officiel.
- **O3 — un modèle local ordinaire (non 1-bit) servi par llama.cpp**, pour les mêmes tâches. llama.cpp (131,7 mille étoiles, licence MIT) liste SYCL pour les cartes Intel, Vulkan, et OpenVINO « en cours ».
  - Coût : moyen × moyen. Non mesurée : aucune source lue ne compare un tel modèle à Haiku sur une tâche de la Factory.
  - Ce qu'elle exclut : le gain propre à BitNet.
- **O4 — une voie locale durable dans la flotte** : un agent `local`, une extension du compilateur d'agents, un hook de routage et un oracle.
  - Coût : complexe × long. Il faut modifier `compile-agent-def.mjs` (ligne 36), la garde R-34 et le tableau de routage.
  - Ce qu'elle exclut : le principe de la flotte nommée, où chaque agent déclare l'une des quatre familles Claude.

Tableau de synthèse : une ligne par option ; « besoin nommé » dit si l'option répond à un besoin relevé dans la Factory.

| Option | Contenu | Besoin nommé | Coût | Exclut |
|---|---|---|---|---|
| O0 | aucun changement | sans objet | nul | tout essai |
| O1 | fiche de veille datée | non | simple × court | tout essai |
| O2 | essai BitNet 2B4T sur le poste | non | moyen × moyen | modèles de plus de 2,4 milliards |
| O3 | essai d'un modèle local ordinaire | non | moyen × moyen | le gain propre à BitNet |
| O4 | agent local dans la flotte | non | complexe × long | la flotte à quatre familles Claude |

Sur la question du besoin, trois angles ont été examinés, et aucun ne donne de tâche :

- **Confidentialité.** Les données sensibles se traitent déjà par des règles déterministes (`hook-identite-sortante.mjs` pour R-62, alinéa « caviardage » de `REGLES-PROJET.md`). Aucune entrée du registre ne mentionne un modèle local : 0 occurrence.
- **Hors ligne.** Le pilotage, les agents et le juge de qualité dépendent de Claude. Un modèle local sans Claude ne ferait fonctionner aucune étape de la chaîne.
- **Coût.** Haiku 5.5 est à « From $0.50 / output MTok », et la facturation réelle du poste (abonnement ou API) n'a pas été relevée. Sans chiffre de dépense constaté, l'économie reste inconnue.

## 5. Verdict

- **Option retenue** : O0.
- **Pourquoi pas O1 à O4** : aucune ne répond à un besoin nommé dans le registre. O2 coûte une chaîne de compilation de 4 outils pour mesurer un modèle qui ne sait pas appeler d'outils. O4 modifierait le noyau de la flotte sans gain constaté.
- **Coût** : simple × court. Cette étude suffit ; rien ne s'installe, rien ne se modifie.
- **Candidature(s) émise(s)** :
  - candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 4, effort 1 : ajouter à la fiche de l'opportunité 9 (transcription) la piste VibeASR.cpp, avec ses faits vérifiés (MIT, 1,58 Go, français, taux d'erreur de 17,41 % sur MLC-FR, compilation Windows par MinGW ou Clang, pas MSVC) ;
  - candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 4, effort 1 : vérifier `references\MODELES-EN-SERVICE.json` (génération courante de Haiku, 4.5 au fichier contre 5.5 dans la documentation d'Anthropic du 19/10/2026), puis rejouer l'oracle `oracle-modeles-en-service`.
- **Plan de revue** : 2026-12-14. La décision se rouvre si l'un de ces faits est constaté d'ici là : un besoin de traitement local nommé par vous, le problème #595 de BitNet clos avec un binaire Windows publié, ou un modèle officiel de plus de 2,4 milliards de paramètres avec appel d'outils.
- **Test rétro** :
  - *Opération → Tactique* : ne rien installer (O0), transmettre la piste VibeASR.cpp et signaler le référentiel de Haiku répondent chacun à un fait de la section 2 : l'absence de besoin nommé, le besoin de transcription du tri, l'écart de version.
  - *Tactique → Stratégie* : n'ouvrir un chantier, même d'essai, que lorsqu'un besoin nommé existe, pour que la décision repose sur des faits vérifiés à la source.
  - *Stratégie → Intention* : vous vouliez décider de ce que la Factory fait de cette opportunité sur des faits et non sur une vidéo. La réponse est « rien », avec les faits de la section 1 qui montrent que la vidéo exagère (« lourde ») et que le poste n'est pas prêt.
  - *Questions du demandeur rejouées* : « Que fait BitNet ? » — section 1, P1 et P2. « Existe-t-il une tâche mieux servie par un modèle local que par Haiku ou un oracle ? » — non pour la confidentialité, le hors ligne et le coût (section 4) ; une piste pour la transcription. « Que faut-il sur le poste ? » — section « Relevé du poste » : 4 outils absents sur 6.
  - *Rupture constatée* : la vidéo n'a pas été regardée, donc l'argument « ton épargne est dans le pari » n'est pas jugé. Aucune mesure de vitesse n'a été jouée sur le poste, car la consigne interdit toute installation. Ces deux écarts sont déclarés, pas comblés.
