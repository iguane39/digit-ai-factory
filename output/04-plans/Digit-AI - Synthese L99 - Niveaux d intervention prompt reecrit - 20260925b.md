---
destinataire: humain
---

# Synthèse L99 — le prompt « 3 niveaux d'intervention : Simple, Moyen, Complexe » est analysé et réécrit en étude d'opportunité mesurée ; il vous reste à valider la lecture de votre intention et 8 écarts, puis à dire si l'étude se mène (25/09/2026)

Votre demande d'amélioration du prompt est traitée : l'analyse en 8 couches est déposée, elle passe le contrôle de lisibilité, et le prompt réécrit est prêt, en annexe de ce message. Ce qu'elle change pour vous : votre prompt faisait choisir un petit modèle rapide dès la réception de la question, or l'outil ne change pas de modèle tout seul d'une question à l'autre. Seul un agent secondaire peut tourner sur un autre modèle, et il repart sans le fil de la conversation. La mesure de vos sessions confirme le délai et en déplace la cause : une question courte attend 6,3 minutes en médiane et reçoit 1 813 mots, et 76 % de ce temps se passe hors des outils, surtout à rédiger. Le prompt réécrit fait donc mesurer où part le temps avant de proposer, puis étudie séparément le modèle, le niveau de réflexion, les étapes du traitement et la forme de la réponse, avec des garde-fous qu'aucun niveau léger ne lève. Ce message suit lui-même le format complet, que la règle en vigueur impose à ce type de travail : c'est l'un des points que l'étude devra trancher. Rien n'est enregistré ni publié. Ce qui est attendu de vous : valider la lecture de votre intention et les 8 écarts, puis dire si l'étude se mène.

## 1. En-tête d'identification

- **quoi** — appel du skill `prompt-analyzer-l99` par le lexique d'invocation du noyau (la règle qui fait de « Améliore le prompt » un appel de skill, jouée par le hook de lexique) ; analyse complète en 8 couches, prompt réécrit, contrat de sortie, écarts à la lettre, protocole de tests.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit (2 fichiers) ; lectures seules : la doctrine de restitution et son juge, les réglages des hooks, le tableau de routage des modèles, le gabarit d'étude, les transcripts des sessions du pilot, le journal des hooks, la documentation de Claude Code et la référence Anthropic des modèles.
- **quand** — 2026-09-25 10:50 UTC+02:00 (Europe/Paris) ; début du tour à 10:12:02, horodatage du message reçu lu au transcript ; durée mesurée 38 min.
- **qui** — session Opus 5.5 à l'effort « max » (champ lu au transcript de la session) sur le pilot local `71649f4` ; 3 sous-agents : mesure des transcripts (Sonnet 5), recensement de la doctrine (Sonnet 5), faits de plateforme (agent guide de Claude Code) ; escalade de modèle : aucune ; oracles joués : `check_markdown.py` (4 règles de lisibilité du Markdown : ouverture de chapitre, mode de lecture des tableaux, marqueurs de travail, glose des identifiants) et `oracle-synthese` sur ce document.
- **intention** — obtenir un prompt qui fasse produire une étude utilisable pour décider comment répondre vite et court aux questions simples, sans affaiblir le process des vrais travaux. Test rétro : le prompt réécrit sert cette intention par sa mesure préalable, ses 4 leviers séparés, ses invariants et son essai borné ; ce qui ne la sert pas encore : l'intention est reconstruite et attend votre validation, et le score de 88 reste une projection tant que l'étude n'a pas été menée.

## 2. Verdict en une ligne

**Prompt d'origine 32/100 → prompt réécrit 88/100 (projeté) ; 21 défauts inventoriés dont 1 bloquant, tous rattachés au changelog ; 8 écarts à la lettre soumis un à un ; questions courtes du pilot : 6,3 min et 1 813 mots en médiane sur 24 tours mesurables, 87,5 % au-dessus de 150 mots ; `check_markdown.py` PASS, exit 0 ; 2 fichiers écrits dans le pilot, 0 enregistrement git, 0 push.**

## 3. Décisions attendues de l'humain

Les 2 bloquants qui retiennent la suite de ce travail :

- l'étude elle-même est à l'arrêt ; il faut valider la lecture de votre intention et les 8 écarts à la lettre ; si rien n'est fourni, aucune étude n'est produite et le prompt d'origine reste noté 32 sur 100.
- l'enregistrement local des 2 fichiers du tour est à l'arrêt ; il faut votre accord ; si rien n'est fourni, les fichiers restent sur disque, hors de l'historique du dépôt.

> **D-1 — La lecture de votre intention et les 8 écarts à la lettre sont-ils validés, et l'étude se mène-t-elle avec le prompt réécrit de `output\03-etudes\20260925-L99-niveaux-d-intervention.md` ?**
>
> Votre prompt demandait une étude pour répondre plus vite et plus court aux questions simples, en choisissant un modèle par niveau dès la réception de la question. Le prompt réécrit garde vos 3 niveaux et votre niveau Complexe tel quel, mais s'écarte de vos mots à 8 endroits, listés au bloc 6 : le modèle de chaque niveau devient un résultat de l'étude, le niveau de réflexion s'ajoute aux leviers, le classement se refait pendant le traitement, et le temps de lecture entre dans l'objectif. L'intention que j'ai reconstruite, « une réponse rapide et courte aux questions simples, le process complet pour les vrais travaux », est à valider par vous.
>
> **Recommandation : (a).** Source consultée : `references\INTENTION.md` (« En cas de doute sur l'intention, on demande ») et `gabarits\ETUDE-OPPORTUNITE.md` (options fermées, oracle des études). Les 8 écarts ferment chacun un défaut nommé de l'analyse ; aucun ne retire un de vos niveaux.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** valider la lecture et les 8 écarts ; l'IA mène l'étude dans cette session avec le prompt réécrit tel quel | effort complexe × moyen pour l'étude ; rien de plus pour le prompt | exclut un routage de modèles non mesuré et toute modification des hooks pendant l'étude |
| **(b)** valider avec amendements, en répondant « D-1 b sauf écart n° X » | effort simple × court : le prompt est réédité sur les écarts refusés et rejugé, puis l'étude est menée | exclut une étude immédiate |
| **(c)** ne pas retenir le prompt réécrit | effort nul | exclut le bénéfice de l'analyse : le prompt d'origine reste à 32 sur 100, avec sa prémisse fausse sur le choix du modèle |

> **Si rien n'est décidé** : l'option (c) s'applique ; le prompt réécrit reste déposé dans l'analyse et aucune étude n'est menée.

> **D-2 — Les 2 fichiers de ce tour s'enregistrent-ils localement dans le dépôt `digit-ai-factory` ?**
>
> Ce tour a écrit 2 fichiers dans le pilot : l'analyse `20260925-L99-niveaux-d-intervention.md` et cette synthèse. Le noyau du pilot demande un historique local dès la naissance d'un travail ; l'enregistrement dans git reste pourtant un geste que je ne fais pas sans votre accord. L'arbre de travail porte aussi des modifications d'autres sessions, que l'enregistrement laisserait de côté en ne prenant que les chemins de ce tour.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fous (« git local dès la naissance, push sur GO humain »). Un enregistrement local est réversible et ne publie rien.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** enregistrer localement les seuls chemins de ce tour, sans push | effort simple × court | exclut toute publication : le push reste un feu vert distinct |
| **(b)** ne rien enregistrer | effort nul | exclut la traçabilité : les 2 fichiers restent non suivis et absents de l'index de leur dossier |

> **Si rien n'est décidé** : l'option (b) s'applique ; les fichiers restent sur disque, non enregistrés.

## 4. Traité — avec sa preuve

Le tour a produit l'analyse et ce document ; chaque élément ci-dessous porte la sortie qui l'établit.

- **L'analyse en 8 couches est déposée et jugée** : étalon noté, chaîne logique (4 ruptures et une collision), inventaire de 21 défauts (1 bloquant, 15 majeurs, 5 mineurs), audit de 7 prémisses, 5 causes d'échec, 3 attaques et la lentille de robustesse, implications d'échelle, prompt réécrit, contrat de 9 critères, 8 écarts à la lettre, protocole de tests, changelog.
  - preuve : `output\03-etudes\20260925-L99-niveaux-d-intervention.md` ; `check_markdown.py` → « Règles : M7, M10, M14, M18 — Verdict : PASS », exit 0.
- **La prémisse d'un modèle choisi à la réception de la question est réfutée sur pièce** : aucun moyen documenté ne change le modèle de la session principale sans geste humain ; seul un sous-agent se route vers Haiku ; le cache de prompt est propre à chaque modèle.
  - preuve : documentation de Claude Code relevée le 25/09/2026 par un sous-agent (pages modèles, sous-agents, skills, hooks, styles de sortie) ; référence Anthropic des modèles du 24/06/2026 (effort, cache).
- **Les délais sont mesurés sur les transcripts du pilot** : 171 tours humains de 30 sessions, du 27/08 au 25/09/2026 ; médiane de 21,2 min sur l'ensemble ; pour les 24 questions courtes mesurables, 6,3 min, 16,5 appels d'outils et 1 813 mots en médiane ; 91,1 % des messages finaux au-dessus de 150 mots ; 33 tours réécrits après un refus bloquant, avec 42 refus concordants entre transcripts et journal des hooks.
  - preuve : scripts de mesure lancés par node dans le dossier de travail de la session, hors dépôt ; 2 tours revérifiés à la main.
- **Le coût des hooks est chronométré** : 1,45 à 1,99 s après chaque commande ou écriture ; 3,38 à 4,34 s pour le seul contrôle des secrets à chaque fin de tour ; 0,11 à 0,15 s par message pour le lexique.
  - preuve : `Measure-Command`, 3 essais par hook, le 25/09/2026 à 10:20 (heure de Paris).
- **Aucun nom de produit n'entre dans les 2 fichiers du tour** : les exemples de questions citées dans l'analyse sont génériques.
  - preuve : recherche insensible à la casse, dans les 2 fichiers, de 31 noms de dépôts et de dossiers clients, forges exclues, relevés parmi les 41 dépôts git trouvés sous la racine du parc → 0 occurrence.

## 5. Non traité — avec son motif

- L'étude elle-même — motif : dépendance à une décision humaine (D-1) ; vous avez demandé d'améliorer un prompt, et la loi n° 7 (le résultat sert l'intention, pas la lettre) interdit de mener un travail sur une intention reconstruite non validée.
- L'enregistrement local des fichiers du tour — motif : dépendance à une décision humaine (D-2).
- La mesure du hook d'écriture, de 2 hooks de fin de tour et des 2 hooks d'ouverture de session — motif : écarté, car le premier juge un appel d'outil réel qu'on ne fabrique pas à la main, et lancer les autres aurait modifié l'état qu'ils surveillent ; critère de réouverture : l'étape de mesure de l'étude les chronomètre depuis le journal ou les transcripts.
- L'inscription au registre du coût des hooks par commande — motif : hors mandat ; l'étude le mesurera et proposera sa candidature.

## 6. Écarts à la lettre

- **Vous avez écrit** « Améliore le prompt : … » → **j'ai fait** l'analyse complète en 8 couches avec prompt réécrit, et non l'étude elle-même → **pourquoi** : le lexique d'invocation du noyau fait de ces mots un appel du skill `prompt-analyzer-l99`, dont c'est le livrable.
- **Vous n'avez rien demandé** sur la mesure → **j'ai mesuré** les délais dans les transcripts et chronométré les hooks, en lecture seule → **pourquoi** : la cause avancée par le prompt devait être vérifiée avant d'être classée.
- **Les 8 écarts entre votre prompt et le prompt réécrit**, à valider un par un par D-1 ; le numéro est celui du tableau du chapitre 8 de l'analyse :

| N° | Vous avez écrit | Je propose | Pourquoi |
|---|---|---|---|
| 1 | « adapter le modèle à utiliser pour le traitement de la question » | 4 leviers instruits séparément : modèle, niveau de réflexion, process, format | le niveau de réflexion n'était pas nommé et c'est le réglage le plus direct ; le modèle principal ne se change pas seul |
| 2 | « petit modèle rapide type Haïku » pour le niveau Simple | le modèle du niveau Simple devient un résultat de l'étude : sous-agent Haiku, modèle principal à réflexion réduite et session légère, comparés | Haiku n'est joignable qu'en sous-agent, sans le fil de la conversation, et le cache est propre à chaque modèle |
| 3 | « type Sonnet » pour le niveau Moyen | même traitement ; Sonnet reste le défaut des sous-agents de recherche, comme aujourd'hui | le routage des sous-agents existe déjà dans le tableau de routage du pilot |
| 4 | « à évaluer à la réception de la question » | à la réception et pendant le traitement, avec escalade sur les actes | la complexité se découvre souvent en cours de tour |
| 5 | « optimiser les temps de traitement et temps de réponse » | le temps de lecture s'ajoute : la réponse tient dans les 150 premiers mots | votre constat sur le format porte sur la lecture |
| 6 | « Etudie et fournis une proposition argumentée » | étude au gabarit de la Factory, options fermées, verdict, essai borné ; aucune mise en œuvre | c'est la forme que l'oracle des études sait juger ; une étude s'arrête avant la décision |
| 7 | rien sur la mesure, les invariants, la doctrine, la portée, la confidentialité | étape de mesure, invariants, conflits de doctrine, 10 questions rejouées, portée à trancher, pseudonyme dans les exemples | ajouts purs : aucun ne restreint votre demande |
| 8 | « Complexe : Le format actuel avec les agents actuels » | inchangé | aucun écart |

## 7. Risques

- L'étude conclut quand même à un routage vers Haiku pour la conversation principale ;
  - signal : une option qui « envoie la question à Haiku » sans passer par un sous-agent ni par un geste humain ;
  - parade : les faits de plateforme sont dans le prompt, et le contrat exige un gain mesuré ou motivé pour chacun des 4 leviers.
- Un niveau léger mis en service sert de raccourci à un tour lourd ;
  - signal : une réponse de niveau Simple dans un tour qui a écrit, commité ou publié ;
  - parade : l'escalade sur les actes et les invariants du prompt, puis l'essai borné avec retour arrière.
- L'étude menée dans cette session hérite d'un contexte déjà chargé ;
  - signal : des réponses plus lentes, ou une compaction du contexte en cours d'étude ;
  - parade : le prompt est autonome ; il se colle tel quel dans une session neuve si vous le préférez.
- Un nom de produit entre dans un fichier du pilot par une question citée en exemple ;
  - signal : la porte de publication rend un constat bloquant avant un push ;
  - parade : le prompt réécrit impose le pseudonyme dans tout exemple.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), celle qui attend D-1 avant celle qui attend D-2 ; puis les décisions humaines, dans le même ordre.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | Mener l'étude dans cette session avec le prompt réécrit ; sur « D-1 b », rééditer d'abord le prompt sur les écarts refusés et rejouer `check_markdown.py` (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 | complexe × moyen | aucune étude n'est produite ; le prompt reste déposé dans l'analyse |
| A-2 | Enregistrer localement les seuls chemins de ce tour, sans push, par `git commit --only` sur l'analyse et cette synthèse (neuve) | auto_ia | `dependance_bloc_3` — attend D-2 | simple × court | les 2 fichiers restent non suivis |
| A-3 | Trancher D-1 en répondant « D-1 a », « D-1 b sauf écart n° X » ou « D-1 c » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — une intention reconstruite se valide par son auteur (loi n° 7) | simple × court | aucune étude n'est menée ; le prompt d'origine reste à 32 sur 100 |
| A-4 | Trancher D-2 en répondant « D-2 a » ou « D-2 b » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — l'enregistrement dans git attend votre accord | simple × court | rien n'est enregistré |

## 9. Traces

- Analyse : `output\03-etudes\20260925-L99-niveaux-d-intervention.md` (prompt réécrit au chapitre 8, repris en annexe ci-dessous).
- Cette synthèse : `output\04-plans\Digit-AI - Synthese L99 - Niveaux d intervention prompt reecrit - 20260925b.md`.
- Mesure des délais : scripts et sorties dans le dossier de travail temporaire de la session, hors dépôt.
- Oracles : `check_markdown.py` (PASS) ; `oracle-synthese` sur ce fichier (verdict au journal d'oracles homonyme).
- Git : aucun enregistrement dans ce tour ; pilot local `71649f4`.
- Aucune page HTML livrée dans ce tour.

## Annexe — le prompt réécrit, prêt à coller

```text
Produis une étude d'opportunité : proportionner la réponse de la Factory à la question reçue.
3 niveaux d'intervention (Simple, Moyen, Complexe) règlent ensemble le modèle, l'effort de
réflexion, le process interne et le format du message final. But : réduire l'attente et le
temps de lecture quand la question ne demande pas le process complet, sans rien perdre là où
la qualité compte.

INTENTION (à citer en section « Intention de l'utilisateur », marquée « reconstruite, à valider ») :
« Quand je pose une question courte, je veux une réponse rapide et courte, que je trouve tout
de suite, sans relancer tout le process. Quand je lance un vrai travail, je garde le process
complet et le format actuel, qui sont très bons. »

LECTEUR : l'humain qui pilote la Factory et tranchera. Il n'a pas relu les hooks ni la doctrine
de restitution ; il lit d'abord les 150 premiers mots.

ÉTAPE 0 — MESURER AVANT D'ÉCRIRE (lecture seule)
1. Délais : sur les transcripts du pilot
   (%USERPROFILE%\.claude\projects\c--dev-digit-ai-factory\*.jsonl, session en cours exclue),
   mesurer par tour : durée, mots du message humain, appels d'outils par famille, mots du
   message final, refus du hook de fin de tour, modèle, effort. Classer en « question courte »
   (40 mots au plus, forme interrogative) et autres ; médiane et p90 par classe ; les 14
   derniers jours à part. 2 tours revérifiés à la main.
2. Process : chronométrer les hooks de .claude\settings.json par moment (chaque message, chaque
   commande, chaque fin de tour) ; relever dans .claude\hooks-journal.jsonl les messages finaux
   jugés, par motif, et les refus. Le journal n'enregistre ni durée ni message exempté.
3. Décomposer le temps d'un tour : outils, génération, réécriture après refus. Les transcripts
   ne séparent pas les hooks de la génération : les chronométrer à part.
4. Comparer les durées par couple modèle × effort, à tâche comparable.
5. Une première mesure du 25/09/2026 figure au chapitre 4 de
   output\03-etudes\20260925-L99-niveaux-d-intervention.md : la refaire et comparer, ne pas la
   recopier. Scripts écrits avec l'outil Write et lancés par node, jamais par heredoc ni node -e.
   Une mesure impossible se déclare datée, avec ce qu'elle empêche de conclure ; aucun chiffre
   estimé.

FAITS DE PLATEFORME (relevés le 25/09/2026, à revérifier sur la documentation Claude Code)
- Le modèle de la session principale ne change pas seul : /model, --model, ANTHROPIC_MODEL ou
  settings.json, par un geste humain. Aucun hook ne le change. Une question ne va vers Haiku que
  par un sous-agent (outil Agent, champ model ; skill en context: fork avec agent), qui démarre
  sans le contexte de la conversation.
- Le cache de prompt est propre à chaque modèle : changer de modèle en cours de session relit
  tout le contexte sans cache.
- Haiku 4.5 : fenêtre de 200 000 jetons, pas de réglage d'effort. Vitesses publiées : Haiku 4.5
  « Fastest », Sonnet 5 « Fast », Opus 5.5 « Moderate », Fable 5.1 « Slower ».
- L'effort (low à max) est un réglage de session. La référence Anthropic conseille de mesurer
  le modèle le plus capable à effort réduit avant de construire une cascade de modèles.
- Un hook UserPromptSubmit peut ajouter du contexte (additionalContext) ou bloquer ; la
  documentation ne lui connaît aucun moyen de changer le modèle ni de réécrire la question.
- Le mode rapide (/fast) accélère la sortie d'Opus pour un prix doublé : c'est une dépense,
  donc une décision humaine.

4 LEVIERS, INSTRUITS SÉPARÉMENT
Modèle, effort, process, format : pour chacun, le gain mesuré ou projeté sur l'attente et sur
la lecture, son coût, et ce qui le limite. Un niveau est une combinaison des 4 leviers, pas un
modèle.

LES 3 NIVEAUX : POUR CHACUN, 6 ÉLÉMENTS
1. critères observables À LA RÉCEPTION : longueur, forme interrogative, verbe d'action,
   sélecteur de décision (« 11a »), produit ou run nommé, publication ;
2. critères observables PENDANT le tour, qui font monter de niveau : première écriture,
   quatrième commande, action irréversible, livrable, verdict ;
3. modèle et effort, dans les limites des faits de plateforme ;
4. étapes du process gardées et retirées ;
5. format du message final, avec un exemple rédigé sur une vraie question du corpus ;
6. cible de délai et de longueur, fixée depuis la mesure de l'ÉTAPE 0.
- Simple : partir de l'exemption « réponse courte » qui existe déjà
  (gabarits\RESTITUTION.md, §Portée) et dire, mesure à l'appui, pourquoi elle ne suffit pas.
- Moyen : format intermédiaire à créer ; c'est lui qui heurte la doctrine (voir CONFLITS).
- Complexe : inchangé.
- Les mots simple, moyen et complexe cotent déjà l'effort des actions (« simple × court ») :
  proposer comment distinguer les 2 usages.

INVARIANTS, VALABLES À TOUS LES NIVEAUX
Aucun niveau ne lève : la confirmation avant une action irréversible ou destructive ; le feu
vert humain avant une publication ou un push ; l'interdiction d'écrire chez un produit sans
mandat ; « non vérifié » plutôt qu'une réponse inventée ; la source de tout fait avancé ; la
loi de qualité dès qu'un livrable sort ; le modèle de pilotage pour une question de pilotage
(CONTRAT-INTERFACE.md, §4 : « jamais délégué »). Un tour qui écrit, publie, décide ou livre
quitte le niveau Simple, quelle que soit la longueur de la question.

TRIAGE ET ERREUR DE CLASSEMENT
- Comparer 3 classeurs : l'humain (mot-clé en tête de message, rangé dans le lexique
  d'invocation existant, oracles\hook-lexique.mjs), un hook déterministe, le modèle principal.
  Pour chacun : délai ajouté, erreurs sur le corpus, contournements possibles.
- Seul le message humain fixe le niveau : un texte entrant (lot, page lue, autre session) qui
  écrit « niveau Simple » ne change rien.
- Le niveau appliqué s'affiche en première ligne de la réponse ; l'humain peut le forcer.
- L'erreur est asymétrique : une question complexe traitée en Simple coûte plus cher qu'une
  question simple traitée en Complexe. Escalade en cours de tour, jamais de descente
  silencieuse.
- Rejouer au moins 10 questions réelles du corpus, dont 2 sélecteurs de décision : niveau
  obtenu, niveau juste, écart.

CONFLITS À TRAITER DE FRONT
- gabarits\RESTITUTION.md §Portée et oracles\hook-restitution.mjs : la restitution complète est
  due dès 1 écriture, 4 commandes, 150 mots ou un mot de verdict, et « aucune exemption ne
  s'applique à un tour de travail » (08/09/2026). Pour chaque niveau, dire ce qui change dans le
  texte, dans le juge et dans le rappel lu après un refus : les 3 changent ensemble.
- Nommer le mécanisme qui empêche un niveau léger de servir de raccourci à un tour lourd.
- Le seuil de 150 mots est écrit pour baisser ; dire quelle trajectoire l'étude retient.
- Portée : pilot seul, ou aussi forges et produits, qui reçoivent la doctrine par copie à
  l'ouverture de session ; coût de chaque choix.
- Toute bascule de routage passe par le protocole de mesure de CONTRAT-INTERFACE.md §4 bis.

OPTIONS, VERDICT, ESSAI
- Gabarit gabarits\ETUDE-OPPORTUNITE.md, section par section ; options fermées O0 à O4, où
  O0 (ne rien changer au dispositif actuel) est réfutée par un coût constaté ou retenue.
- Chaque option : gain et sa mesure, coût en complexité × durée, risques, dépense marquée
  « décision humaine ».
- Au moins une option sans changement de doctrine : régler modèle et effort par session (une
  session légère pour les questions, une session de travail pour les runs).
- Verdict : une option ; un essai borné (durée, mesure avant et après, critère d'arrêt,
  retour arrière).

PÉRIMÈTRE D'ACTION
- Livrable : output\03-etudes\AAAAMMJJ-etude-opportunite-niveaux-d-intervention.md, où
  AAAAMMJJ est la date d'exécution. Remise conditionnée à :
  node oracles\oracle-etude-opportunite.mjs <livrable> → PASS.
- Interdits : modifier un hook, un gabarit, une règle, un CLAUDE.md ou un réglage ; committer.
  L'étude se termine par la candidature au registre qu'elle propose et une question à l'humain.

FORME : L'ÉTUDE APPLIQUE CE QU'ELLE PROPOSE
- La réponse (« faut-il des niveaux, et lesquels ? ») tient dans les 150 premiers mots.
- Chaque section ouvre par ce que le lecteur va apprendre ; chaque tableau dit comment le lire ;
  chaque identifiant est glosé à son premier emploi ; chaque chiffre est sourcé ; les coûts
  s'écrivent en complexité × durée, jamais en jours.
- Toute question citée en exemple remplace les noms de produit et de client par leur pseudonyme
  du registre, ou par « [produit] ».

CONTRAT DE SORTIE (à vérifier avant remise, point par point)
C1 oracle-etude-opportunite.mjs rend PASS (E1-E10) ; check_markdown.py
   (%USERPROFILE%\.claude\skills\digit-ai-page-html\scripts\) rend PASS.
C2 L'intention est citée et marquée à valider ; les 150 premiers mots donnent la réponse.
C3 La mesure de l'ÉTAPE 0 est datée : médiane et p90 par classe, décomposition du temps,
   écart avec la mesure du 25/09/2026.
C4 Les 4 leviers sont instruits séparément, chacun avec son gain mesuré ou déclaré
   « non mesurable » avec son motif.
C5 Chaque niveau porte ses 6 éléments, dont un exemple de réponse rédigé.
C6 Les invariants sont repris ; les conflits de doctrine sont traités (texte, juge, rappel) ;
   la portée est tranchée.
C7 10 questions réelles sont rejouées, dont 2 sélecteurs, avec l'écart de classement ;
   aucun nom de produit ni de client n'y figure en clair.
C8 Une option est retenue, O0 est traitée par un coût constaté, l'essai est borné.
C9 Aucun fichier n'est modifié hors du livrable ; aucun commit.
Si un point échoue après 3 passes de correction, remettre avec la liste des écarts restants.
```
