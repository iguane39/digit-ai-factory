---
role: étude d'opportunité (gabarit gabarits\ETUDE-OPPORTUNITE.md, TF-0155) — proportionner la réponse de la Factory à la question reçue, niveaux Simple, Moyen et Complexe ; exécution du prompt réécrit de l'analyse L99 du 25/09/2026, lancée par l'humain le 25/09/2026 (« exécute le prompt »)
sources_de_verite: [transcripts des sessions du pilot (%USERPROFILE%\.claude\projects\c--dev-digit-ai-factory\*.jsonl) mesurés le 25/09/2026, .claude/hooks-journal.jsonl, banc d'essai de 9 sous-agents du 25/09/2026, gabarits/RESTITUTION.md v2.27.0 (§Portée), oracles/hook-restitution.mjs (fonction jugeable), oracles/hook-lexique.mjs, CONTRAT-INTERFACE.md (§4, §4 bis), references/INTENTION.md, documentation Claude Code et plateforme Anthropic consultée le 2026-09-25, output/03-etudes/20260925-L99-niveaux-d-intervention.md]
verifie_le: 2026-09-25
---

# Étude d'opportunité — proportionner la réponse à la question : niveaux Simple, Moyen, Complexe — 20260925a

**La réponse.** Oui, 3 niveaux, mais pas un modèle par niveau. Une question courte attend aujourd'hui
6,3 minutes en médiane et reçoit 1 813 mots : elle enchaîne 14,5 requêtes du modèle et finit presque
toujours en restitution complète. Au banc d'essai, Haiku n'a pas répondu plus vite que Sonnet et s'est
trompé de source 2 fois sur 3. Le verdict retient O3, où les actes du tour fixent le niveau. Simple :
des lectures, 3 commandes au plus, aucune écriture, 150 mots au plus, soit l'exemption qui existe
déjà. Moyen : une recherche sans effet, rendue en 4 pièces et 400 mots au plus, soit la forme à créer.
Complexe : dès le premier effet, la restitution complète, inchangée. Premier geste : le niveau Simple,
essayé une semaine sans toucher au juge.

L'étude suit le gabarit de la Factory. La mesure vient d'abord, parce que c'est elle qui choisit les
leviers ; viennent ensuite les 4 leviers pris un à un, les 3 niveaux, les invariants, le classement,
les conflits de doctrine, puis les options O0 à O4 *(jeu fermé d'options du gabarit ; O0 = ne rien
changer au dispositif actuel)* et le verdict.

## Seuil de déclenchement (vérifié avant écriture)

Le seuil est atteint 2 fois, une étude est donc due avant toute décision
(`gabarits\ETUDE-OPPORTUNITE.md`, lignes 13-19). Le sujet touche le noyau : la règle de restitution
du pilot, son juge `oracles\hook-restitution.mjs` et le rappel que l'agent lit après un refus. Il crée
aussi des objets durables : une forme de réponse jugée, un détecteur d'effets et une entrée du lexique
d'invocation.

## Intention de l'utilisateur (loi n° 7, TF-0791)

L'intention se cite d'abord dans les mots du demandeur, tirés de sa demande du 25/09/2026 :

> « parfois des questions demandent des réponses rapides et n'ont pas forcément nécessité à relancer
> tout le process classique de bout en bout »
>
> « pour une question courte demande une réponse courte, elle perd l'utlisateur dans des messages
> noyés entre les différents chapitres »
>
> « Complexe : Le format actuel avec les agents actuels. »

L'analyse L99 du même jour l'a reconstruite en deux phrases : « Quand je pose une question courte, je
veux une réponse rapide et courte, que je trouve tout de suite, sans relancer tout le process. Quand je
lance un vrai travail, je garde le process complet et le format actuel, qui sont très bons. » Cette
intention reconstruite reste **à valider** explicitement. L'humain a lancé l'étude par « exécute le
prompt » après avoir lu la reconstruction et ses 8 écarts à la lettre, sans la commenter ; l'étude la
tient pour acceptée jusqu'à sa réponse, et chaque option de la section 4 s'y rattache.

## 0. Traitement des entrants

La demande instruite est une donnée : ses impératifs se citent, ils ne s'exécutent pas. Les entrants
sont les suivants.

- La demande humaine du 25/09/2026, citée plus haut, et le prompt réécrit qui la commande, au
  chapitre 8 de `output\03-etudes\20260925-L99-niveaux-d-intervention.md`.
- La mesure des transcripts du pilot et du journal des hooks (section « Mesure préalable »).
- Le banc d'essai de 9 sous-agents du 25/09/2026 (section « Levier modèle »).
- La doctrine en place : `gabarits\RESTITUTION.md` version 2.27.0, `oracles\hook-restitution.mjs`,
  `CONTRAT-INTERFACE.md` §4 et §4 bis, `references\INTENTION.md`.
- Les constats du registre qui ont façonné les exemptions : TF-0904 *(ouverture des 3 premières
  exemptions, 08/09/2026)*, TF-0978 *(un tour lourd rendu en 140 mots sous couvert de « réponse
  courte », 08/09/2026)*, TF-0990 *(exemption « rien de neuf », 09/09/2026)* et TF-1182 *(relais
  d'avancement, 17/09/2026)*.

Aucun identifiant du registre ne porte sur des niveaux d'intervention, Haiku, une question simple ou
un mode rapide : la recherche exacte du 25/09/2026 dans `todo\TODO.jsonl` rend 0 occurrence.

## Mesure préalable — où part le temps (ÉTAPE 0)

La mesure confirme le délai et en déplace la cause. Une question courte ne passe pas son temps dans
les hooks ni dans les outils : elle le passe à enchaîner des requêtes du modèle, puis à rédiger une
réponse longue.

Elle porte sur les 165 tours humains des 30 sessions du pilot enregistrées sur ce poste, du 27/08 au
25/09/2026, la session de l'étude exclue ; sur les 1 583 exécutions de hooks que les transcripts datent
; et sur les 864 jugements du journal des hooks. Un sous-agent l'a conduite par scripts, et 2 tours ont
été revérifiés à la main. Elle refait la mesure du matin du 25/09, qui figure dans l'analyse L99. Les
écarts viennent de 2 corrections de méthode (un marqueur d'interruption compté à tort comme message
humain, des horodatages désordonnés) : ils ne dépassent pas 1,1 % sur les durées de l'ensemble et sont
nuls sur les questions courtes.

### Durées

Le tableau se lit ligne par ligne : une population de tours, son effectif mesurable, la médiane et le
p90 *(90e centile : 9 tours sur 10 finissent avant)* de la durée, du message humain au dernier message
de l'assistant.

| Population | Tours mesurables | Médiane | p90 |
|---|---|---|---|
| Tous les tours | 155 | 21,3 min | 91,4 min |
| Questions courtes (40 mots au plus, forme interrogative) | 24 | 6,3 min | 42,8 min |
| Questions courtes, 14 derniers jours | 10 | 11,3 min | 72,5 min |

### Décomposition d'une question courte

Le tableau se lit poste par poste : la valeur médiane de chacun pour une question courte, puis la
façon dont elle est obtenue.

| Poste | Valeur médiane | Obtenue par |
|---|---|---|
| Requêtes du modèle par tour | 14,5 | identifiants de message distincts dans les transcripts |
| Génération pure par requête | 19,4 s | durée du tour moins outils et hooks, divisée par les requêtes |
| Appels d'outils par tour | 16,5 | blocs d'appel d'outil |
| Part des outils dans la durée | 24,3 % | intervalles entre un appel et son résultat, fusionnés |
| Part des hooks datés dans la durée | 1,1 % | champ `durationMs` des transcripts |
| Mots de la réponse finale | 1 813 | dernier texte de l'assistant |
| Réponses de 150 mots ou plus | 87,5 %, et 100 % sur 14 jours | idem |
| Tours réécrits après un refus | 12,5 %, et 20 % sur 14 jours | transcripts, recoupés au journal des hooks |

14,5 requêtes à 19,4 secondes donnent un ordre de grandeur de 4,7 minutes de génération sur 6,3 :
c'est le nombre de requêtes qui fait le délai. Le produit de 2 médianes n'est qu'un ordre de grandeur,
pas une mesure de tour.

### Hooks

Le tableau se lit ligne par ligne : un moment du tour, le hook qui s'y déclenche, son nombre
d'exécutions datées et sa durée médiane.

| Moment | Hook | Exécutions datées | Médiane |
|---|---|---|---|
| chaque message humain | `hook-lexique.mjs` | 11 | 95 ms |
| chaque écriture | `hook-ecriture.mjs` | 389 | 356 ms |
| chaque fin de tour | `hook-produits-intacts.mjs` | 334 | 2,9 s |
| chaque fin de tour | `oracle-secrets-hors-perimetre.mjs` | 367 | 1,8 s |
| chaque fin de tour | `hook-restitution.mjs` | 168 | 0,8 s |
| ouverture de session | `hook-ouverture.mjs` (relevé de fraîcheur des dépôts) | 33 | 35,5 s |
| ouverture de session, tous hooks | somme par session | 30 sessions | 40,2 s |

Les hooks ne sont pas le goulot d'un tour : 1,1 % de sa durée. Les 2 hooks d'index qui suivent chaque
commande ne laissent pas de trace datée ; chronométrés à la main le 25/09/2026, ils coûtent 1,5 à 2
secondes par commande. L'ouverture de session, elle, coûte 40,2 secondes en médiane : une session neuve
ouverte pour une question rapide les paie avant de répondre.

### Modèle et effort, par requête

Le tableau se lit ligne par ligne : un couple modèle et effort, son nombre de tours, puis la génération
pure médiane de chaque requête.

| Modèle et effort | Tours | Génération par requête |
|---|---|---|
| Opus 5, `high` | 79 | 15,5 s |
| Fable 5.1, `high` | 62 | 21,6 s |
| Opus 5.5, `max` | 6 | 12,8 s |
| Fable 5.1, `max` | 4 | 28,6 s |

Par requête, Opus 5.5 à `max` génère plus vite qu'Opus 5 à `high` ; seul Fable 5.1 ralentit nettement
en montant d'effort. La piste de l'effort maximal, ouverte par l'analyse L99 du matin, ne tient donc pas
par requête : les 127 minutes médianes des tours joués en Opus 5.5 à `max` viennent du nombre de
requêtes de tâches lourdes. Les effectifs de 6 et 4 tours restent faibles.

### Refus

33 des 165 tours, soit 20,0 %, ont subi au moins un refus bloquant du hook de restitution. Le message
accepté arrive 295 secondes après le refus en médiane, et le message réécrit fait 2 633 mots en médiane.

### Limites déclarées

- Les sessions ouvertes chez les produits ne sont pas mesurées.
- 210 exécutions de hooks n'ont pas de durée dans les transcripts, surtout des messages de hook.
- L'indicateur automatique de commit compte toute commande dont le texte contient « commit » ou
  « push ». Sur les 10 tours rejoués plus bas, il en signale 6 ; la relecture des commandes en confirme
  1, en infirme 2, et en laisse 3 douteux. Le rejeu s'appuie donc sur les écritures et les commandes,
  que l'on compte sans ambiguïté.
- Le filtre des questions courtes retient aussi un sélecteur de décision suivi d'une question
  (« 4a, mais pourquoi… ») : au moins 3 des 26 questions sont de cette nature.

## 1. Partition du problème

Le sujet se découpe en 5 sous-questions disjointes. Le tableau se lit ligne par ligne : une
sous-question, puis les leviers qui y répondent ; chaque option de la section 4 dit lesquelles elle
traite.

| Sous-question | Énoncé | Leviers |
|---|---|---|
| P-A | Attente : où part le temps d'un tour, et lequel de ses postes peut baisser ? | modèle, effort, process |
| P-B | Lecture : combien de mots l'humain lit-il avant de trouver la réponse ? | format |
| P-C | Classement : qui fixe le niveau, quand, sur quels signes, et que coûte une erreur ? | process |
| P-D | Garde-fous : quelles règles aucun niveau ne lève, et quelle doctrine faut-il changer ? | process, format |
| P-E | Portée et essai : le pilot seul ou le parc entier, et comment prouver le gain ? | les 4 |

## 2. Non-recouvrement contre l'existant

La Factory porte déjà 3 pièces de proportionnalité, mais aucune ne règle un niveau à partir de la
question. Le tableau se lit ligne par ligne : une pièce existante, la citation qui la décrit, et ce
qu'elle couvre du sujet.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Exemption « réponse courte » | `gabarits\RESTITUTION.md`, ligne 944 : « réponse courte \| une information rendue sans jugement \| idem » (moins de 150 mots et aucun mot de verdict) | recouvre en partie : c'est le niveau Simple, mais seulement hors tour de travail |
| Règle « aucune exemption pour un tour de travail » | `gabarits\RESTITUTION.md`, ligne 923 : « AUCUNE EXEMPTION NE S'APPLIQUE À UN TOUR DE TRAVAIL » | ne recouvre pas : c'est la contrainte que le niveau Moyen doit traiter |
| Point d'étape | `gabarits\RESTITUTION.md`, lignes 676-704 : forme jugée d'un tour dont le résultat n'est pas encore mesurable | ne recouvre pas : il allège un tour de travail inachevé, pas une question |
| Relais d'avancement | `gabarits\RESTITUTION.md`, ligne 947 : relais d'un agent de campagne, sans écriture depuis le dernier affichage | ne recouvre pas : il concerne un agent, pas une question humaine |
| Tableau de routage des modèles | `CONTRAT-INTERFACE.md`, lignes 347-352 et 361 : Sonnet par défaut, Haiku pour le mécanique, « le modèle le moins cher plausible » | recouvre pour les sous-tâches déléguées ; ne dit rien de la réponse faite à l'humain |
| Proportionnalité de l'intention | `references\INTENTION.md`, lignes 55-56 : « La profondeur s'adapte — une correction triviale ne rédige pas quatre niveaux » | recouvre le principe, sans mécanisme ni seuil |
| Lexique d'invocation | `oracles\hook-lexique.mjs`, lu à chaque message : un début de message appelle un skill | recouvre le mécanisme du mot-clé en tête de message ; aucun mot ne fixe un niveau |
| Sévérités proportionnées du hook | `oracles\hook-restitution.mjs`, ligne 582 : bloquantes S1, S3, S4 et S6, le reste avertit | ne recouvre pas : proportionne les refus, pas la forme demandée |
| Registre des candidatures | `todo\TODO.jsonl`, recherche du 25/09/2026 : 0 entrée sur les niveaux, Haiku ou une question simple | ne recouvre pas |

## 3. État de l'art daté

Les sources sont la documentation d'Anthropic, relevée le jour de l'étude, et une étude de vitesse de
lecture pour convertir des mots en minutes. La liste se lit source par source : l'éditeur, la date, le
localisateur, puis le fait retenu.

- Anthropic, référence de la ligne de commande de Claude Code, consultée le 2026-09-25,
  https://code.claude.com/docs/en/cli-reference.md : `claude --effort <niveau>` « Overrides the
  modelSettings and effortLevel settings for this session and does not persist ».
- Anthropic, réglages de Claude Code, consultée le 2026-09-25,
  https://code.claude.com/docs/en/settings.md : clé `effortLevel`, et `/effort` pour changer l'effort
  en cours de session.
- Anthropic, sous-agents de Claude Code, consultée le 2026-09-25,
  https://code.claude.com/docs/en/sub-agents.md : champ `model` (sonnet, opus, haiku, fable, inherit).
- Anthropic, skills de Claude Code, consultée le 2026-09-25, https://code.claude.com/docs/en/skills.md :
  les champs du frontmatter ne comptent pas de `model` ; `context: fork` et `agent` exécutent un skill
  dans un sous-agent.
- Anthropic, guide des hooks de Claude Code, consulté le 2026-09-25,
  https://code.claude.com/docs/en/hooks-guide.md : un hook de message ajoute du contexte ou bloque ; un
  hook de fin de tour qui refuse laisse la réponse à l'écran et fait continuer.
- Anthropic, styles de sortie, consultée le 2026-09-25, https://code.claude.com/docs/en/output-styles.md :
  un style modifie le prompt système ; il se change par `/output-style` ou par les réglages.
- Anthropic, vue d'ensemble et choix des modèles, consultées le 2026-09-25,
  https://platform.claude.com/docs/en/about-claude/models/overview.md et
  https://platform.claude.com/docs/en/about-claude/models/choosing-a-model.md : Haiku 4.5 « Fastest »,
  Sonnet 5 « Fast », Opus 5.5 « Moderate », Fable 5.1 « Slower ».
- Anthropic, effort, consultée le 2026-09-25, https://platform.claude.com/docs/en/build-with-claude/effort.md :
  « At lower effort levels, Claude still thinks on sufficiently difficult problems, but thinks less ».
- Anthropic, référence de l'API intégrée à Claude Code, tableau des modèles du 2026-06-24 : un effort
  bas donne « fewer and more-consolidated tool calls, less preamble, and terser confirmations » ; le
  cache est propre à chaque modèle ; mesurer le modèle le plus capable à effort réduit avant toute
  cascade de modèles.
- Trauzettel-Klosinski et Dietz, IReST, Investigative Ophthalmology & Visual Science, volume 53,
  numéro 9, 2012, https://iovs.arvojournals.org/article.aspx?articleid=2166061, chiffre relevé sur la
  fiche de l'Institut Nazareth et Louis-Braille,
  https://extranet.inlb.qc.ca/recherche-et-innovation/orvis/irest-fiche-orvis/ : 195 mots par minute
  en français, à plus ou moins 26. Source de plus de 24 mois, gardée pour un ordre de grandeur stable.

## Levier modèle (P-A)

Le modèle est le levier que la demande nommait en premier, et c'est celui qui rapporte le moins. La
conversation principale garde le modèle choisi par l'humain : aucun hook ni skill ne le change, et le
cache de prompt est propre à chaque modèle. Seul un sous-agent peut répondre sur un autre modèle. Il
démarre sans le fil de la conversation, et la session principale paie 2 requêtes de plus, l'une pour
déléguer, l'autre pour relayer la réponse.

Le banc d'essai du 25/09/2026 mesure ce chemin. 3 questions de recherche dans le dépôt ont été posées à
l'identique à Haiku 4.5, Sonnet 5 et Opus 5.5, chacun en sous-agent de lecture seule. Les sous-agents
Sonnet et Opus ont hérité de l'effort `max` de la session (champ `effort` de leurs transcripts) ; Haiku
n'accepte pas de réglage d'effort. Le tableau se lit ligne par ligne : une question, puis pour chaque
modèle la durée relevée par Claude Code, le nombre d'appels d'outils et la justesse de la réponse,
vérifiée contre la source.

| Question | Haiku 4.5 | Sonnet 5 | Opus 5.5 |
|---|---|---|---|
| « Quel modèle le tableau de routage du pilot prescrit-il pour chaque type de tâche ? » | 28,7 s · 5 outils · fausse : cite le tableau d'un run de test (`RUN-PILOTE.md`, lignes 8-13) | 57,2 s · 7 outils · juste | 56,3 s · 3 outils · juste |
| « Quelles règles de l'oracle de restitution sont bloquantes ? » | 61,4 s · 6 outils · juste | 49,9 s · 6 outils · juste | 118,3 s · 10 outils · juste, et nomme en plus les 2 contrôles bloquants non numérotés |
| « Combien d'exemptions au format de restitution existent, et lesquelles ? » | 77,4 s · 3 outils · fausse : décrit une exemption levée d'un référentiel d'écriture | 61,8 s · 5 outils · juste | 99,9 s · 8 outils · juste, et relève que l'en-tête du hook n'en cite que 3 |
| **Médiane, et réponses justes** | **61,4 s · 1 sur 3** | **57,2 s · 3 sur 3** | **99,9 s · 3 sur 3** |

Trois constats en sortent. Haiku n'est pas plus rapide sur une recherche dans le dépôt, parce que le
temps part dans les allers-retours d'outils. Il se trompe de source 2 fois sur 3, sans le signaler :
c'est le risque exact d'un niveau léger mal armé. Sonnet donne le meilleur couple, juste 3 fois sur 3
en 57 secondes de médiane.

- **Gain** : nul pour Haiku en réponse directe. Pour une recherche large, un sous-agent Sonnet répond
  en 1 minute environ, au prix de 2 requêtes de la session principale (19,4 secondes de génération
  chacune en médiane pour une question courte).
- **Coût** : aucune mise en place, le routage des sous-agents existe déjà (`CONTRAT-INTERFACE.md`, §4).
- **Limite** : un sous-agent ne connaît pas la conversation, donc une question qui en dépend
  (« alors ? ») ne se délègue pas. 3 questions par modèle donnent un ordre de grandeur, pas une preuve
  : l'essai le confirmera ou non.

## Levier effort (P-A)

L'effort règle la profondeur de réflexion de chaque requête. Il vaut pour toute la session : `/effort
<niveau>` le change en cours de session, `claude --effort <niveau>` le fixe pour une session sans le
garder, et la clé `effortLevel` des réglages le rend durable. Aucun hook ni skill ne le change question
par question.

Le corpus ne le désigne pas comme cause. Par requête, Opus 5.5 à `max` génère en 12,8 secondes, contre
15,5 pour Opus 5 à `high` ; seul Fable 5.1 ralentit nettement en montant, de 21,6 à 28,6 secondes.

- **Gain** : non mesurable sur le corpus, faute de tâches comparables. La référence Anthropic en attend
  moins d'appels d'outils et des réponses plus brèves, donc un effet sur le nombre de requêtes, que
  seul un essai à tâche égale peut isoler.
- **Coût** : un geste humain, sans code, réversible à tout moment.
- **Limite** : un réglage de session touche aussi les vrais travaux. L'essai de l'étape 1 garde donc
  l'effort constant, pour que son gain ne se confonde pas avec celui du niveau Simple ; une variation
  d'effort se teste à part, ensuite.

## Levier process (P-A, P-C)

Le process est le levier qui pèse le plus sur l'attente. Une question courte déclenche 14,5 requêtes du
modèle en médiane, à 19,4 secondes de génération chacune, soit un ordre de grandeur de 4,7 minutes sur
6,3. Ces requêtes suivent les appels d'outils, 16,5 en médiane : lectures de doctrine, vérifications
d'état, fichier de synthèse, oracle de restitution. Les hooks datés ne pèsent que 1,1 % de la durée d'un
tour ; les 2 hooks d'index y ajoutent 1,5 à 2 secondes par commande.

- **Gain** : non mesurable avant l'essai, faute de tours déjà servis au niveau Simple en nombre
  suffisant. Projection : une réponse Simple tient en 2 à 4 requêtes, soit 40 à 80 secondes de
  génération au lieu de 4,7 minutes ; la question réelle du 28/08 sur le `.gitignore` a été servie
  ainsi en 35 secondes.
- **Coût** : une consigne (le niveau et ses bornes) et un mot-clé au lexique ; le juge ne change pas
  pour le niveau Simple.
- **Limite** : une question qui exige une vraie recherche garde ses requêtes. Pour elle, le gain vient
  du format (niveau Moyen), pas du process.

## Levier format (P-B)

Le format est le levier de la lecture, le seul qui réponde au second constat de la demande. Une question
courte reçoit 1 813 mots en médiane : à 195 mots par minute, c'est 9,3 minutes de lecture, plus que les
6,3 minutes d'attente. 87,5 % de ces réponses dépassent 150 mots et passent donc par la restitution
complète. Enfin, 12,5 % des tours de questions courtes subissent un refus du hook : le message accepté
arrive 295 secondes plus tard en médiane, réécrit en 2 633 mots.

- **Gain** : mesurable par construction. 150 mots se lisent en 46 secondes, 400 mots en 2 minutes ;
  l'exemple Moyen plus bas dit en 124 mots ce qu'une restitution disait en 1 683.
- **Coût** : nul pour le niveau Simple, qui reprend l'exemption existante ; complexe × moyen pour le
  niveau Moyen, qui demande une forme jugée neuve.
- **Limite** : une réponse courte perd des preuves et des nuances. La forme Moyen garde une ligne de
  preuves et une ligne « non vérifié », pour que la brièveté ne cache pas l'incertitude.

## Les 3 niveaux (P-B, P-C)

Un niveau est une combinaison des 4 leviers, et il se fixe par les actes du tour, pas par la forme de
la question. Chaque niveau porte 6 éléments : les signes à la réception, les signes qui le font monter
pendant le tour, le modèle et l'effort, le process, le format avec un exemple rédigé, et une cible.

### Simple — la réponse directe

1. **À la réception** : une question de 40 mots au plus, de forme interrogative, sans verbe d'action
   (faire, corriger, lancer, publier, pousser, commiter, créer, écrire, supprimer, ingérer,
   synchroniser, appliquer), sans sélecteur de décision, sans demande de run ni de livrable.
2. **Ce qui fait monter en cours de tour** : la 1re écriture, la 4e commande, un mot de verdict ou une
   décision à poser. Le tour passe alors en Moyen s'il reste sans effet, en Complexe sinon.
3. **Modèle et effort** : ceux de la session. Un sous-agent Sonnet n'est appelé que s'il évite plus
   de 3 lectures.
4. **Process** : lectures libres (Read, Grep, Glob), 3 commandes au plus, aucune écriture. Ni les
   lectures d'ouverture de run, ni fichier de synthèse, ni oracle de restitution.
5. **Format** : « Niveau : Simple » en première ligne, la réponse en 150 mots au plus, une ligne de
   source, une ligne « Non vérifié » s'il le faut. Aucun bloc, aucune `D-N`, aucune `A-N`, aucun mot
   de verdict : c'est l'exemption « réponse courte » telle qu'elle existe.
6. **Cible** : une médiane sous 1,5 minute, 100 % des réponses sous 150 mots, aucun refus par
   construction. Base : une réponse Simple coûte 2 à 4 requêtes, à 19,4 secondes de génération chacune
   en médiane.

**Exemple réel, déjà servi à ce niveau.** Le 28/08/2026, « Est-ce que 00-retours est en gitignore ? »
a reçu cette réponse en 35 secondes, après 1 commande :

> Oui — vérifié à l'instant, pas de mémoire. La règle existe : `.gitignore` ligne 28,
> `input/00-retours/`. Git l'applique : `git check-ignore -v` sur un lot réel rend
> `.gitignore:28:input/00-retours/`. Plus rien n'est suivi : `git ls-files input/00-retours` rend 0,
> alors que les 60 fichiers sont toujours sur le disque.

Le niveau Simple fait de ce cas l'ordinaire. Le 27/08, « Où est la liste des éléments ? » a reçu
2 273 mots en 5,5 minutes, après 20 commandes. La réponse Simple tenait en 2 phrases : la liste
n'existait pas, le relevé précédent ne donnait que des comptes. La produire était un travail de niveau
Complexe, que le tour réel a d'ailleurs fait.

### Moyen — la réponse outillée

1. **À la réception** : une question de diagnostic ou d'état (« pourquoi… », « où en est… », « le parc
   est-il à jour ? ») ou une demande d'explication, sans verbe d'action de modification.
2. **Ce qui fait monter en cours de tour** : le 1er effet au sens du détecteur (écriture hors du
   dossier de travail temporaire, commit, push, verbe d'effet, outil d'écriture d'un service
   connecté), ou un livrable. Le tour passe alors en Complexe.
3. **Modèle et effort** : ceux de la session. Une recherche large part à un sous-agent Sonnet, comme le
   tableau de routage le prévoit.
4. **Process** : lectures et commandes de lecture sans limite ; écriture seulement dans le dossier de
   travail temporaire ; ni fichier de synthèse, ni restitution en 8 blocs.
5. **Format** : « Niveau : Moyen », puis 4 pièces dans cet ordre : la réponse en 150 mots au plus ; les
   preuves, de 3 à 6 lignes (une commande et sa sortie, ou un chemin et sa ligne) ; ce qui n'a pas été
   vérifié ; la décision attendue, « aucune » ou une `D-N` complète. 400 mots au plus.
6. **Cible** : une médiane sous 4 minutes, 100 % des réponses sous 400 mots, soit 2 minutes de lecture
   au plus, et moins de refus qu'aujourd'hui (12,5 % des tours de questions courtes). Base : la
   recherche garde ses requêtes, mais le texte final passe de 1 683 à 124 mots dans l'exemple
   ci-dessous, et la réécriture après refus, qui coûte 295 secondes en médiane, se raréfie.

**Exemple sur une question réelle.** Le 21/09/2026, « Des travaux sur la communication ont été
réalisés sur la Factory, est-ce qu'ils ont été appliqués et/ou est-ce qu'ils sont quelque part, restant
à intégrer ? » a reçu une restitution complète de 1 683 mots en 3,5 minutes, après 8 lectures et 11
commandes, sans aucune écriture. Les mêmes faits, au format Moyen :

> Niveau : Moyen
>
> **La réponse.** Oui pour l'essentiel. Sur 25 travaux de communication relevés au registre, 16 sont
> appliqués et publiés, et aucun ne dort sur une branche. Il en reste 9 ouverts : 3 livrés en partie,
> 3 qui attendent une session chez le produit de marketing (Produit-66), 3 candidats non tranchés.
> Seul risque daté : le référentiel LinkedIn périme le 02/12/2026 sans avoir servi.
>
> **Preuves.** Le registre `todo\TODO.jsonl` porte 25 travaux, dont 16 corrigés. Les 11
> enregistrements cités sont sur `origin/main` de leur forge. Les 5 skills installés sont identiques à
> la forge. `git branch -a --no-merged main` ne rend rien.
>
> **Non vérifié.** Le verdict des oracles sur les travaux corrigés : leur présence est vérifiée, pas
> leur résultat.
>
> **Décision attendue.** Aucune.

### Complexe — la restitution complète, inchangée

1. **À la réception** : un verbe d'action, un run, un mandat, un livrable, un sélecteur de décision.
2. **Ce qui fait monter** : sans objet, c'est le niveau le plus haut ; tout tour à effet y arrive.
3. **Modèle et effort** : ceux de la session ; le routage des sous-agents du tableau de routage.
4. **Process** : le process complet actuel, oracles compris.
5. **Format** : la restitution de `gabarits\RESTITUTION.md`, synthèse d'ouverture et 8 blocs.
   Exemple : la restitution qui rend cette étude à l'humain, déposée sous `output\04-plans\`.
6. **Cible** : aucune nouvelle. L'essai mesure ce niveau pour vérifier qu'il ne se dégrade pas.

**Vocabulaire.** Les restitutions cotent déjà l'effort des actions en « simple | moyen | complexe |
très complexe » × durée. Pour ne pas confondre, un niveau s'écrit toujours avec son mot, « Niveau :
Simple » en première ligne de la réponse ; la cotation d'effort garde sa forme « simple × court ».

## Invariants, valables à tous les niveaux (P-D)

Aucun niveau ne lève les règles suivantes ; elles viennent du noyau du pilot et de ses garde-fous.

- La confirmation avant une action irréversible ou destructive.
- Le feu vert humain avant une publication ou un push.
- L'interdiction d'écrire chez un produit sans mandat.
- « Non vérifié » plutôt qu'une réponse inventée.
- La source de tout fait avancé : un chemin et une ligne, ou une commande et sa sortie.
- La loi de qualité dès qu'un livrable sort : un livrable fait monter le tour en Complexe.
- Le modèle de pilotage pour une question de pilotage (`CONTRAT-INTERFACE.md`, ligne 349 : « jamais
  délégué »).
- Un mot de décision (« 11a », « D-3 b ») attend la preuve d'un geste : il ne se traite jamais en
  Simple.

Un tour qui écrit un fichier suivi, commite, publie, décide ou livre quitte les niveaux légers, quelle
que soit la longueur de la question.

## Triage et erreur de classement (P-C)

Aucun classeur ne suffit seul, parce que le niveau juste se voit souvent en cours de tour. Le verdict
les combine : le modèle déclare, l'humain peut forcer, et les effets du tour tranchent.

Le tableau se lit ligne par ligne : un classeur, le délai qu'il ajoute, son erreur sur les 10 questions
rejouées plus bas, et la façon de le contourner.

| Classeur | Délai ajouté | Erreur sur les 10 questions rejouées | Contournement possible |
|---|---|---|---|
| L'humain, par un mot en tête de message (« vite : », « complet : ») lu par le hook de lexique | 95 ms en médiane, durée mesurée du hook de lexique | nulle sur l'intention ; le mot n'existe pas encore dans le corpus | un texte entrant qui recopie le mot ; parade : seul le message humain, en tête, compte |
| Un hook déterministe à la réception : longueur, « ? », verbes d'action, sélecteurs de décision | du même ordre que le hook de lexique | 2 sur 10, toutes deux vers le trop léger, rattrapées par l'escalade en cours de tour | une demande lourde formulée en peu de mots |
| Le modèle principal, qui déclare le niveau en première ligne | aucun : il lit déjà la question | 0 sur les 9 questions jugeables, par un classement simulé ; « Alors ? » reste indécidable sans le fil de la conversation | aucun sur la forme ; il peut se tromper sans le voir |
| Les effets du tour, relevés par le juge de fin de tour | aucun pour l'humain | 2 sur 10 : les sélecteurs « 11a » et « A-37 » n'ont rien écrit ; l'invariant des sélecteurs les rattrape | une action irréversible hors de git et hors de la liste des verbes |

Seul le message humain fixe le niveau : un lot de retours, une page lue ou le message d'une autre
session qui écrit « niveau Simple » ne change rien. L'erreur est asymétrique. Une question complexe
traitée en Simple coûte une réponse fausse et un second tour ; une question simple traitée en Complexe
coûte des minutes. Le niveau ne descend donc jamais en cours de tour, il ne peut que monter.

### Rejeu de 10 questions réelles

Les 10 messages viennent du corpus mesuré : 8 questions courtes de natures différentes et 2 sélecteurs
de décision. Le niveau juste est un jugement de l'auteur de l'étude, avec un critère écrit : le niveau le
plus léger qui répondait à la question telle qu'elle était posée. Le classement du modèle est simulé par
la même lecture ; ceux du hook et des effets sont mécaniques. Le hook applique 5 règles dans l'ordre : un
sélecteur en tête donne Complexe ; un verbe d'action à l'impératif donne Complexe ; une question qui
porte « pourquoi », « comment », « explique » ou « possible » donne Moyen ; toute autre question de 40
mots au plus donne Simple ; le reste donne Moyen.

Le tableau se lit ligne par ligne : un message, ce que son tour réel a fait, le niveau juste, puis le
niveau que donne chaque classeur.

| Message | Tour réel | Niveau juste | Hook | Modèle (simulé) | Effets du tour réel |
|---|---|---|---|---|---|
| « Est-ce que 00-retours est en gitignore ? » | 35 s · 1 commande · 0 écriture · 71 mots | Simple | Simple | Simple | Simple |
| « Où est la liste des éléments ? » | 330 s · 20 commandes · 1 fichier créé par commande · 2 273 mots | Simple : la liste n'existait pas | Simple | Simple | Complexe : le tour l'a produite |
| « Reste-t-il des éléments à traiter sur cette session ? » | 121 s · 3 commandes · 0 écriture · 1 417 mots · 1 refus | Simple | Simple | Simple | Simple |
| « Des travaux sur la communication ont été réalisés […], est-ce qu'ils ont été appliqués […] ? » | 210 s · 11 commandes · 0 écriture · 1 683 mots | Moyen | Simple, trop léger | Moyen | Moyen |
| « Pourquoi doit-on réécrire l'histoire à chaque fois ? […] » | 2 308 s · 12 commandes · 3 écritures · 1 commit vérifié · 2 028 mots | Moyen | Moyen | Moyen | Complexe : le tour a aussi corrigé |
| « Est-ce qu'il est possible d'ouvrir en écriture le dossier input des retours sur github […] ? » | 639 s · 18 commandes · 5 écritures · 1 721 mots | Moyen | Moyen | Moyen | Complexe : écritures du tour |
| « Donne les détails des 2 premières lignes et explique ce principe de purge du cache » | 397 s · 20 commandes · 1 écriture · 2 383 mots | Moyen | Moyen | Moyen | Complexe : 1 écriture |
| « 11a » | 150 s · 3 commandes · 0 écriture · 3 156 mots | Complexe : un geste attendu | Complexe | Complexe | Simple, trop léger : l'invariant des sélecteurs le rattrape |
| « A-37 » | 37 s · 1 commande · 0 écriture · 631 mots | Complexe : une action à exécuter | Complexe | Complexe | Simple, trop léger : l'invariant le rattrape |
| « Alors ? » | 1 095 s · 37 commandes · 9 écritures · 3 944 mots | indécidable sans contexte : Moyen s'il demande un état, Complexe s'il relance un travail | Simple, trop léger | selon le contexte | Complexe |

Trois enseignements en sortent. Chaque classeur se trompe seul : le hook sous-classe 2 questions sur 10,
les effets sous-classent les 2 sélecteurs. Les erreurs vont toutes vers le trop léger, le sens
dangereux, et chacune est rattrapée par un autre mécanisme : l'escalade sur les actes pour le hook,
l'invariant des sélecteurs pour les effets. Enfin, sur les 5 tours réels qui ont écrit ou créé un
fichier, 4 répondaient à une question de niveau Simple ou Moyen : le format complet y est venu du
process, fichier de synthèse ou correction ajoutée, pas de la question.

## Conflits de doctrine (P-D, P-E)

Le niveau Simple ne demande presque rien à la doctrine ; le niveau Moyen, lui, heurte une règle écrite
après un abus réel, et il ne passe qu'avec le mécanisme qui a manqué ce jour-là.

### Ce qui change, porteur par porteur

Le texte, le juge et le rappel lu après un refus changent ensemble, ou la doctrine ne s'applique pas :
« Les trois porteurs de la forme […] se mettent à jour ENSEMBLE, ou la doctrine ne s'applique pas »
(`gabarits\RESTITUTION.md`, version 2.15.0). Le tableau se lit ligne par ligne : un niveau, puis ce qui
change dans chacun des 3 porteurs.

| Niveau | Texte : `gabarits\RESTITUTION.md` | Juge : `oracles\hook-restitution.mjs` et `oracle-synthese` | Rappel lu après un refus |
|---|---|---|---|
| Simple | une phrase au §Portée : une réponse qui déclare « Niveau : Simple » est une réponse courte, sous les bornes actuelles | rien : la fonction `jugeable` tient déjà l'exemption | rien |
| Moyen | une forme jugée neuve, la « réponse outillée », avec ses 4 pièces et ses bornes d'effets | une branche de `jugeable` pour le tour sans effet, et 4 règles courtes : réponse en tête, preuves, ligne « non vérifié », décision complète si elle est posée | un paragraphe qui décrit la forme Moyen |
| Complexe | rien | rien | rien |

### Le mécanisme qui empêche le raccourci

Le 08/09/2026, un tour de 3 commits et d'une action irréversible a été rendu en 140 mots sous couvert
de l'exemption « réponse courte » (TF-0978). La doctrine en a tiré « aucune exemption ne s'applique à
un tour de travail », et un tour de travail s'y compte en outils : 1 écriture ou 4 commandes. Le niveau
Moyen remplace ce compte par un relevé d'effets. Un tour est **sans effet** quand, entre le message
humain et le message final, 4 conditions tiennent :

1. aucun outil d'écriture ne vise un chemin hors du dossier de travail temporaire de la session ;
2. le commit courant et l'empreinte de l'arbre de travail du dépôt ouvert sont inchangés, relevés par
   le hook de message et comparés par le hook de fin de tour, comme `oracles\hook-produits-intacts.mjs`
   le fait déjà pour les produits ;
3. aucune commande ne porte un verbe d'effet d'une liste fermée : commit, push, apply, deploy,
   publish, rm, Remove-Item, del, mv, Move-Item, Set-Content, Out-File, redirection vers un fichier,
   `curl` en POST, PUT, PATCH ou DELETE, `gh pr create`, `gh release` ;
4. aucun outil d'écriture d'un service connecté n'est appelé (verbes send, create, update, delete,
   trash, share, publish).

Un tour sans effet est jugé au niveau que son message déclare. Le moindre effet le fait juger
Complexe, quelle que soit la déclaration, et le refus impose la restitution complète : l'escalade se
fait toujours vers le haut, jamais en silence vers le bas. La fixture rouge rejoue le cas du 08/09
(commits et action irréversible, message déclaré « Niveau : Moyen » : jugé Complexe) ; la fixture
verte, une recherche de 12 commandes de lecture rendue en 380 mots (jugée Moyen, PASS).

La limite est dite plutôt que promise : une action irréversible faite par un programme tiers, hors de
git et hors de la liste des verbes, échappe au relevé. Les invariants la couvrent, pas le détecteur.
À l'inverse, une autre session qui écrit dans le même dépôt pendant le tour le fait juger Complexe à
tort : l'erreur tombe alors du côté sûr, et elle coûte une restitution, pas une faute.

### La trajectoire du seuil de 150 mots

La doctrine prévoit de baisser ce seuil : « Le seuil se baissera quand le corpus sera propre »
(`gabarits\RESTITUTION.md`, ligne 980). L'étude le garde à 150 mots pendant l'essai. Le baisser ferait
tomber plus de réponses dans le format complet, à rebours de l'intention ; la question se rouvre à la
revue du 2026-10-09.

### La portée

La douleur n'est pas propre au pilot : sur les 864 jugements du journal des hooks, du 21/08 au
25/09/2026, 540 viennent de sessions ouvertes chez les produits et 324 du pilot. La doctrine de
restitution arrive chez chaque
produit instancié par copie, à l'ouverture de sa session (`oracles\hook-ouverture.mjs`). Le choix se
pose donc ainsi. Le pilot seul coûte simple × court, mais laisse les produits au format complet.
Le parc entier d'emblée coûte le même effort de rédaction, plus le risque qu'un défaut du juge neuf
atteigne tous les produits à la fois. L'étude retient le pilot d'abord, puis le parc par l'héritage
après la revue de l'étape 2 : la propagation est automatique une fois les pièces validées.

### Le protocole de mesure du routage

Tout changement durable du routage des sous-agents passe par le protocole de mesure de
`CONTRAT-INTERFACE.md`, §4 bis : des tranches comparables, les escalades consignées au ledger. Le banc
d'essai de cette étude en est une première tranche, pas un verdict.

## 4. Options — jeu fermé O0-O4

Les 5 options couvrent le jeu fermé, de l'inaction à l'automatisation complète. Chacune dit ce qu'elle
contient, les sous-questions qu'elle traite, son gain et la façon de le mesurer, son coût en
complexité × durée, ses risques et ce qu'elle exclut.

- **O0 — ne rien changer.** Réfutée par le coût constaté du statu quo. Une question courte coûte 6,3
  minutes d'attente en médiane, 11,3 sur les 14 derniers jours, et 1 813 mots, soit 9,3 minutes de
  lecture. 87,5 % de ces réponses passent par la restitution complète, et 12,5 % des tours subissent
  une réécriture après refus, 295 secondes de plus en médiane. L'exemption « réponse courte » n'a servi
  qu'1 question courte sur 24 mesurables.
- **O1 — régler modèle et effort par session, sans rien changer d'autre** (P-A). L'humain baisse
  l'effort de la session de travail par `/effort xhigh`, ou ouvre une seconde session légère pour les
  questions par `claude --model sonnet --effort medium`. Gain : non établi. Le corpus ne montre pas
  l'effort comme cause, et une session neuve paie 40,2 secondes de hooks d'ouverture avant sa première
  réponse. Coût : simple × court, un geste humain, réversible à tout moment. Risque : les vrais
  travaux changent aussi d'effort. Exclut tout gain de lecture : une réponse de plus de 150 mots reste
  une restitution complète.
- **O2 — O1, plus le niveau Simple sur l'exemption existante** (P-A, P-B, P-C). Une référence
  `references\NIVEAUX.md` décrit la réponse directe, un renvoi la signale depuis le noyau, qui est
  plein, et un mot-clé entre au lexique d'invocation ; le juge ne change pas. Gain : les questions de pure consultation sortent du format
  complet. Coût : simple × court. Risque : faible, l'exemption et son juge existent. Exclut les
  questions de recherche, qui dépassent 3 commandes ou 150 mots : dans le rejeu, 4 des 8 questions hors
  sélecteurs relèvent du niveau Moyen et une 5e est indécidable, si bien qu'O2 seule laisserait la
  moitié des questions au format complet.
- **O3 — O2, plus le niveau Moyen jugé, le niveau fixé par les effets du tour, en 3 étapes** (P-A à
  P-E). Étape 1 : O2. Étape 2 : la réponse outillée dans les 3 porteurs de la forme, le détecteur
  d'effets et ses 2 fixtures, au pilot seul. Étape 3 : la propagation aux produits par l'héritage.
  Gain : les questions de recherche sortent aussi du format complet, sans rouvrir la faille du 08/09.
  Coût : complexe × moyen, dont l'étape 2 porte l'essentiel. Risques : un défaut du détecteur ; une
  forme de plus à tenir dans 3 porteurs. Exclut le changement de modèle en réponse directe.
- **O4 — O3, plus un classeur automatique et un routage systématique vers des sous-agents Haiku ou
  Sonnet** (P-A à P-E). Coût : très complexe × long. Réfutée par le banc d'essai : Haiku n'y est pas
  plus rapide et se trompe 2 fois sur 3 ; un sous-agent perd le fil de la conversation ; chaque
  délégation coûte 2 requêtes de la session principale ; le cache est propre à chaque modèle. Exclut
  les questions qui dépendent de la conversation.

## 5. Verdict

- **Option retenue** : O3 — 3 niveaux fixés par les effets du tour, déployés en 3 étapes sous essai
  borné.
- **Coût** : complexité complexe · durée moyenne au total. Étape 1 : simple × court ; étape 2 :
  complexe × moyen ; étape 3 : simple × court. Jetons : l'essai n'ajoute aucun appel, et le banc
  d'essai a consommé 9 sous-agents. Dette : une forme de plus à tenir dans les 3 porteurs de la
  restitution.
- **Étape 1, dès la décision.** L'IA écrit `references\NIVEAUX.md`, y renvoie depuis la ligne
  « Restitution » du noyau et range le mot-clé de niveau dans le lexique d'invocation. Le noyau est
  plein, 6 144 octets pour un plafond de 6 144 (règle N1 de `oracles\oracle-claude-md.mjs`, mesure du
  25/09/2026) : le renvoi doit tenir dans la place qu'il libère ailleurs. Le juge ne change pas, et
  l'effort reste celui de la session, pour que le gain mesuré soit celui du seul niveau Simple. Essai
  du 2026-09-26 au 2026-10-02 inclus. Mesure : les scripts de l'étape 0, rejoués le 2026-10-02 sur les
  tours de l'essai. Critère de réussite : la médiane des questions Simple sous 1,5 minute et 100 % de
  leurs réponses sous 150 mots ; pour le niveau Complexe, une médiane et un taux de refus à 10 % près
  de leurs valeurs de l'étape 0, 21,3 minutes et 20,0 % des tours. Critère d'arrêt anticipé : une
  réponse déclarée Simple dans un tour qui a écrit, commité ou publié. Retour arrière : retirer le
  renvoi du noyau et l'entrée du lexique.
- **Étape 2, si l'étape 1 tient.** La réponse outillée entre dans les 3 porteurs, avec le détecteur
  d'effets et ses fixtures rouge et verte, au pilot seul. Essai du 2026-10-03 au 2026-10-09 inclus,
  même mesure. Critère de réussite : la médiane des questions Moyen sous 4 minutes et 100 % de leurs
  réponses sous 400 mots, sans dégradation du niveau Complexe. Retour arrière : retirer la branche
  neuve du juge, le texte de la forme et son paragraphe du rappel, ensemble.
- **Étape 3, après la revue de l'étape 2.** Propagation aux produits par `gabarits\HERITAGE.json`.
- **Candidature(s) émise(s)** : 1 candidature proposée plus bas, non inscrite. L'étude n'écrit rien hors
  de son fichier ; l'inscription attend la décision humaine.
- **Plan de revue** : 2026-10-02 pour l'étape 1, puis 2026-10-09 pour l'étape 2.

### Test rétro (Opérationnel → Tactique → Stratégie → Intention)

Chaque élément opérationnel du verdict remonte à l'intention citée plus haut ; une rupture se dit.

- « Niveau : X » en première ligne → l'humain sait d'emblée quelle forme il lit → baisser le temps de
  lecture → « une réponse que je trouve tout de suite ». Aucune rupture.
- Réponse Simple en 150 mots au plus, sans synthèse ni oracle → moins de requêtes et moins de texte →
  baisser l'attente → « une réponse rapide et courte ». Aucune rupture.
- Niveau fixé par les effets du tour → aucun tour lourd ne se rend en quelques lignes → garder la
  qualité là où elle compte → « le process complet et le format actuel, qui sont très bons ». Aucune
  rupture.
- Effort inchangé pendant l'essai → le gain mesuré revient au seul niveau Simple → prouver avant de
  généraliser → « optimiser les temps », mesurés et non supposés. Aucune rupture ; l'effort se teste à
  part, ensuite.
- Modèle de la session gardé en réponse directe → écart avec la lettre « petit modèle rapide type
  Haïku » → justifié par le banc d'essai, où Haiku n'est pas plus rapide et répond juste 1 fois sur 3 →
  sert l'intention, qui veut une réponse rapide et juste.

### Questions du demandeur, rejouées une à une

- « adapter le modèle à utiliser pour le traitement de la question » : pas en réponse directe ; un
  sous-agent Sonnet pour une recherche large (Levier modèle).
- « le process interne pour répondre à cette question » : lectures libres et 3 commandes au plus en
  Simple, aucune synthèse en Moyen (Les 3 niveaux).
- « le format de restitution » : 150 mots en Simple, 4 pièces et 400 mots en Moyen, restitution
  complète en Complexe (Levier format).
- « optimiser les temps de traitement et temps de réponse » : cibles de l'étape 1, mesurées le
  2026-10-02.
- « 3 niveaux d'intervention : Simple, Moyen, Complexe, à évaluer à la réception de la question » :
  niveaux gardés, déclarés à la réception, fixés par les effets.
- « Complexe : Le format actuel avec les agents actuels » : inchangé.
- « Etudie et fournis une proposition argumentée » : options O0 à O4, verdict O3, essai borné.

## Candidature proposée et question à l'humain

La candidature ci-dessous est prête à inscrire par `todo\journaliser.mjs` ; elle n'est pas inscrite.

- **Titre** : niveaux d'intervention (réponse directe, réponse outillée, restitution complète), fixés
  par les effets du tour.
- **Contenu** : étape 1 (référence `references\NIVEAUX.md`, renvoi depuis le noyau, mot-clé au
  lexique, juge inchangé), étape 2 (forme Moyen dans les 3 porteurs, détecteur d'effets, fixtures),
  étape 3 (héritage), avec la mesure de l'étape 0 rejouée à chaque revue.
- **Demandeur** : l'humain, demande du 25/09/2026.
- **Score** : gain 4 (attente et lecture des questions courtes), preuve 4 (165 tours mesurés et 9
  sous-agents au banc), effort 3, valeur 4 × 4 ÷ 3 = 5,3.

**Question à l'humain** : validez-vous O3 et son étape 1, essayée du 2026-09-26 au 2026-10-02, et
faut-il inscrire cette candidature au registre ?
