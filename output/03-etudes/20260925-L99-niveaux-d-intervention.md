---
role: analyse L99 (8 couches) du prompt « étude d'opportunité pour adapter le modèle, le process interne et le format de restitution à la complexité de la question (niveaux Simple, Moyen, Complexe) » du 25/09/2026 — livrable principal au chapitre 8 (prompt réécrit, contrat de sortie, écarts à la lettre, protocole de tests)
sources_de_verite: [gabarits/RESTITUTION.md v2.27.0 (§Portée, lignes 910-981), oracles/hook-restitution.mjs (fonction jugeable, RAPPEL), .claude/settings.json (hooks), CONTRAT-INTERFACE.md (§4 routage, §4 bis mesure), references/INTENTION.md, gabarits/ETUDE-OPPORTUNITE.md, oracles/oracle-etude-opportunite.mjs, documentation Claude Code relevée le 25/09/2026 (modèles, sous-agents, skills, hooks, styles de sortie), référence claude-api du 24/06/2026 (modèles, effort, cache), mesure des transcripts du pilot du 25/09/2026, chronométrage des hooks du 25/09/2026]
verifie_le: 2026-09-25
---

# Analyse L99 — « Adapter le modèle, le process et le format de réponse à la complexité de la question »

Prompt analysé le 25/09/2026, niveau **L99** *(analyse complète en 8 couches, chacune relisant le
prompt d'origine)*. Le mot-clé d'appel « Améliore le prompt » a été retiré ; l'entrant est le texte
qui le suit, cité en entier :

> « Plusieurs prompts envoyés ont un délai de réponse important car la Factory est sur un process
> récurrent qu'elle répète systématiquement. Ce process est très bon dans la majorité des cas, car
> il permet d'assurer une qualité à un niveau important avec une vision globale, mais parfois des
> questions demandent des réponses rapides et n'ont pas forcément nécessité à relancer tout le
> process classique de bout en bout. Idem pour le format de réponse qui est très bon dans
> l'ensemble, mais qui pour une question courte demande une réponse courte, elle perd l'utlisateur
> dans des messages noyés entre les différents chapitres. Travaille une étude d'opportunité
> permettant d'adapter le modèle à utiliser pour le traitement de la question, le process interne
> pour répondre à cette question, et le format de restitution pour optimiser les temps de
> traitement et temps de réponse. On pourrait envisager 3 niveaux d'intervention : Simple, Moyen,
> Complexe, à évaluer à la réception de la question :
>
> - Simple : Question courte pouvant n'utiliser que des moyens simples pour répondre (petit modèle
>   rapide type Haïku, process court, message formaté mais court,
> - Moyen : Question moyenne, demandant des recherches mais assez rapide, utilisant des moyens
>   médium, type Sonnet et une réponse un peu plus longue.
> - Complexe : Le format actuel avec les agents actuels.
>
> Etudie et fournis une proposition argumentée. »

**Ce que le lecteur va apprendre d'abord.** Le prompt vise juste : proportionner l'appareil de la
Factory à la question posée. Son mécanisme central repose pourtant sur une prémisse fausse. Il fait
choisir Haiku ou Sonnet « à la réception de la question », alors que le modèle d'une session Claude
Code ne change pas seul et qu'aucun hook ne peut le changer. Seul un sous-agent peut être envoyé vers
Haiku, et il démarre sans le contexte de la conversation. Deuxième constat, mesuré sur 171 tours du
pilot : une question courte attend 6,3 minutes en médiane, et sa réponse fait 1 813 mots. Les outils
ne pèsent que 24 % de ce temps ; le reste est surtout de la rédaction et de la réflexion. Les leviers
qui pèsent le plus, l'effort de réflexion et la longueur produite, ne sont pas nommés par le prompt ;
la session qui a produit cette analyse tourne d'ailleurs à l'effort maximal. Troisième constat : le
niveau « Simple » existe déjà sur le papier, sous la forme de l'exemption « réponse courte », mais
87,5 % des réponses aux questions courtes dépassent son seuil de 150 mots. C'est le niveau « Moyen »
qui heurte la doctrine, car une règle du 08/09 interdit toute exemption à un tour de travail. Le prompt
réécrit fait mesurer avant de proposer, instruit quatre leviers séparément, fixe ce qu'aucun niveau ne
lève et fait traiter ce conflit de front.

---

## Chapitre 1 — OODA · Cadrage stratégique et étalon noté

Le prompt porte une intention nette et une douleur réelle, mais il fixe la solution (un modèle par
niveau) avant d'avoir établi la cause. Il obtient **32/100**, sous le plafond de 40 qu'impose un
défaut bloquant.

**Observe.** Six éléments explicites :

- un constat et sa cause : « un délai de réponse important », attribué à « un process récurrent
  qu'elle répète systématiquement » ;
- deux appréciations à préserver : le process est « très bon dans la majorité des cas », le format
  « très bon dans l'ensemble » ;
- un second constat, qui porte sur la lecture : pour une question courte, la réponse « perd
  l'utlisateur dans des messages noyés entre les différents chapitres » ;
- une demande : « une étude d'opportunité » qui adapte « le modèle », « le process interne » et « le
  format de restitution », pour « optimiser les temps de traitement et temps de réponse » ;
- une piste : trois niveaux « à évaluer à la réception de la question », chacun défini par un modèle
  (« type Haïku », « type Sonnet », « les agents actuels »), un process et une longueur de réponse ;
- un livrable : « une proposition argumentée ».

**Orient.** L'auteur est le seul destinataire des restitutions de la Factory. Depuis le 13/08, ses
retours ont fait passer la doctrine de restitution de 6 règles à plus de 50, et son texte à 15 898
mots (`gabarits\RESTITUTION.md`, version 2.27.0 du 19/09/2026, mots comptés par découpage aux
espaces). Presque tous ces retours ajoutaient une exigence. Quelques-uns ont allégé, chacun sur un cas
étroit : l'affichage en double du 22/08, l'accusé « rien de neuf » du 09/09, le relais d'avancement
du 17/09. Ce prompt est le premier qui demande un allègement général, proportionné à la question.
L'objectif profond est double : réduire l'attente, et réduire le temps passé à chercher la réponse
dans le message. Le destinataire du prompt est une session du pilot, qui connaît la doctrine mais pas
la mesure ; sur la foi de la piste proposée, elle risque de concevoir un routage de modèles.

**Decide.** Trois stratégies possibles :

1. **Le modèle d'abord** : un triage à la réception envoie la question vers Haiku, Sonnet ou le modèle
   en place. Facile à expliquer, il bute sur les limites de la plateforme (Ch4).
2. **Le process et le format d'abord** : garder le modèle de la session, régler l'effort, les étapes
   et le format par niveau ; ne router vers Sonnet ou Haiku que des sous-tâches, comme le fait déjà le
   tableau de routage des modèles (`CONTRAT-INTERFACE.md`, §4).
3. **La mesure d'abord** : établir où part le temps (génération, commandes, hooks, réécritures) et
   quelles questions en souffrent, puis choisir les leviers à leur poids mesuré.

**Act.** La stratégie 3, qui débouche sur la 2 : mesurer, puis proportionner le process et le format.
Du routage de modèles, ne garder que ce que la plateforme permet, les sous-agents, après l'avoir
comparé à une simple baisse de l'effort de réflexion.

**Étalon — le prompt idéal pour cette intention.** Il (a) fait mesurer les délais et leur composition
avant toute proposition ; (b) sépare quatre leviers (modèle, effort, process, format) et donne les
faits de plateforme qui les bornent ; (c) définit chaque niveau par des critères observables à la
réception et pendant le tour, avec une règle d'escalade ; (d) fixe les invariants qu'aucun niveau ne
lève ; (e) fait traiter le conflit avec la doctrine de restitution et la portée (pilot, forges,
produits) ; (f) impose le gabarit d'étude, son oracle, l'emplacement et le lecteur ; (g) exige des
cibles tirées de la mesure et un essai borné ; (h) interdit toute mise en œuvre pendant l'étude.

**Accès.** Le prompt d'origine ne désigne aucune ressource à ouvrir. Le prompt réécrit en désigne
deux, locales : les transcripts des sessions du pilot et le journal des hooks. Elles ont été lues sans
erreur le 25/09/2026 par la mesure du Ch4 : l'accès est un prérequis vérifié, sans plafond
supplémentaire.

**Notation.** Le tableau se lit ligne par ligne : une dimension de la rubrique, les points obtenus sur
les points possibles, et la cause principale de la perte.

| Dimension | Score | Justification |
|---|---|---|
| Clarté de l'intention | 13/20 | Intention nette (proportionner) ; la cause est affirmée sans mesure, et deux objectifs (attente, lecture) sont fondus en un |
| Spécification | 6/20 | Niveaux esquissés par l'exemple ; « court », « un peu plus longue », « rapide » non chiffrés ; ni gabarit, ni emplacement, ni lecteur |
| Garde-fous & contraintes | 2/15 | Rien sur ce qu'un niveau léger ne doit jamais lever, ni sur ce que l'étude ne doit pas toucher |
| Ancrage / contexte | 5/15 | « process », « format », « chapitres » renvoient à la doctrine sans la nommer ; aucune mesure |
| Vérifiabilité de la sortie | 2/15 | « proposition argumentée » sans critère ; aucune cible, aucune base de comparaison |
| Robustesse | 4/15 | La piste « type Haïku » mène à une architecture impossible (Ch4) ; un niveau léger sans invariant rouvre une faille déjà payée |
| **Total** | **32/100** | Sous le plafond de 40 imposé par le bloquant Ch3 #1 *(défaut n° 1 de l'inventaire du chapitre 3)* |

---

## Chapitre 2 — Chainlogic · Raisonnement en chaîne

Le prompt enchaîne un constat, une cause, un remède et un mécanisme. Deux maillons ne tiennent pas, et
une hypothèse traverse les trois niveaux sans être dite.

La chaîne, telle qu'elle est écrite : **A** « délai de réponse important » → **B** « car » un process
« répété systématiquement » → **C** certaines questions n'en ont pas besoin → **D** « idem » pour le
format → **E** adapter modèle, process et format → **F** trois niveaux évalués « à la réception de la
question ».

- **R1** *(première rupture de la chaîne)*, de A à B : la cause est affirmée, pas établie. Le délai
  peut venir de l'effort de réflexion, de la vitesse du modèle, du nombre de commandes, des hooks ou
  d'une réécriture imposée par le hook de fin de tour. Sans mesure, l'étude choisira son levier au
  jugé (Ch3 #2). La mesure du Ch4 tranche en partie : pour une question courte, 76 % du temps se
  passe hors des outils.
- **R2**, de D à E : le constat sur le format porte sur la lecture (« perd l'utlisateur »), le remède
  vise le temps machine (« temps de traitement et temps de réponse »). Le temps de lecture sort de
  l'objectif (Ch3 #7).
- **R3**, de E à F : un niveau unique suppose que les leviers varient ensemble — question courte,
  petit modèle, process court, réponse courte. Or une question courte peut exiger un process long :
  « le parc est-il à jour ? » oblige à relever 27 dépôts produits. Une question longue peut appeler
  une réponse d'une ligne (Ch3 #5).
- **R4**, sur F : « à la réception » suppose que la complexité se voit avant de commencer. Elle se
  découvre souvent en cours de tour, et le prompt ne dit pas ce qui se passe quand le premier
  classement se révèle faux (Ch3 #4).

**Collision.** « Complexe : les agents actuels » et « Simple : type Haïku » se recouvrent : les agents
actuels emploient déjà Sonnet par défaut et Haiku pour les tâches mécaniques (`CONTRAT-INTERFACE.md`,
§4, lignes 351-352). La nouveauté réelle serait de répondre à l'humain avec Haiku, donc de changer le
modèle de la conversation principale. C'est précisément ce que le Ch4 réfute.

---

## Chapitre 3 — Blindspots · Inventaire maître

Vingt et un trous : un bloquant, quinze majeurs, cinq mineurs. Le bloquant vient du Ch4 : la piste d'un modèle
choisi à la réception ne peut pas être câblée telle quelle. Les majeurs forment trois familles : ce
que le prompt ne fait pas mesurer, ce qu'il ne protège pas, et la doctrine qu'il ne nomme pas.

Le tableau se lit ligne par ligne : un défaut, sa sévérité, et la couche qui l'a trouvé ou remonté.
Les lignes sont classées par sévérité, puis dans l'ordre où le prompt les rencontre. Chaque bloquant
et chaque majeur est fermé au chapitre 8, dans le changelog.

| # | Défaut | Sévérité | Origine |
|---|---|---|---|
| 1 | Prémisse implicite fausse : le modèle se choisirait « à la réception de la question ». Aucun mécanisme ne change le modèle de la conversation principale sans geste humain ; seul un sous-agent se route vers Haiku | bloquant | Ch4 P4 |
| 2 | Cause affirmée sans mesure : le « process récurrent » n'est ni nommé ni chiffré, et aucune base de comparaison des délais n'est demandée | majeur | Ch2 R1 |
| 3 | Levier absent : l'effort de réflexion, qui décide de la profondeur de réflexion et du nombre d'appels d'outils, n'est pas nommé | majeur | Ch4, Ch6 |
| 4 | Classement « à la réception » sans classeur désigné, sans critères observables, sans escalade en cours de tour, sans traitement de l'erreur de classement | majeur | Ch2 R4 |
| 5 | Quatre leviers indépendants fondus en un niveau unique | majeur | Ch2 R3 |
| 6 | Aucun invariant : rien ne dit ce qu'un niveau léger ne lève jamais (confirmation avant une action irréversible, feu vert avant publication ou push, écriture chez un produit, « non vérifié » plutôt qu'inventé, loi de qualité sur un livrable) | majeur | Ch1 étalon |
| 7 | Le temps de lecture sort de l'objectif, alors que le constat sur le format porte sur lui | majeur | Ch2 R2 |
| 8 | Conflit de doctrine non nommé : la restitution complète est due dès une écriture, quatre commandes, 150 mots ou un mot de verdict, et « aucune exemption ne s'applique à un tour de travail » | majeur | Ch4 P7 |
| 9 | Leçon ignorée : le 08/09, un tour de 3 commits et d'une action irréversible a été rendu en 140 mots sous couvert de l'exemption « réponse courte » (TF-0978, *le constat du 08/09/2026, corrigé au registre le 16/09*) | majeur | Ch5 #2 |
| 10 | Ni gabarit, ni oracle, ni emplacement pour l'étude, alors que la Factory a les siens | majeur | Ch1 étalon |
| 11 | Ni métrique de succès, ni cible, ni essai borné, ni retour arrière | majeur | Ch1 étalon |
| 12 | Portée non tranchée : le pilot seul, ou aussi les forges et les produits qui reçoivent la doctrine de restitution par copie à l'ouverture de leurs sessions | majeur | Ch7 |
| 13 | « court », « un peu plus longue », « message formaté mais court » non définis : ni seuil de mots, ni place de la réponse dans le message | majeur | Ch1 |
| 14 | Un sélecteur de décision (« 11a ») est un message de 3 caractères qui commande un geste et sa preuve ; un classement par longueur le rangerait en Simple | majeur | Ch7 |
| 15 | Rôle ignoré : une question courte adressée au pilot est souvent une question de pilotage, que le tableau de routage réserve au modèle de pilotage, « jamais délégué » | majeur | Ch6 expert |
| 16 | Injection : si le niveau se déclare par un mot, un texte entrant (lot de retours, page lue, autre session) pourrait abaisser le process | majeur | Ch6 lentille |
| 17 | Aucun interdit d'action : la session d'étude pourrait modifier le hook de restitution « pour essayer » | mineur | Ch6 contradicteur |
| 18 | Dépense ignorée : changer de modèle ou activer le mode rapide change la facture ; une dépense reste une décision humaine | mineur | Ch6 expert |
| 19 | Paradoxe de forme : l'étude sera rendue au format lourd qu'elle critique ; rien ne lui demande de donner sa réponse en tête | mineur | Ch5 #5 |
| 20 | Collision de vocabulaire : « simple », « moyen », « complexe » cotent déjà l'effort des actions dans les restitutions (« simple × court ») | mineur | Ch7 |
| 21 | Confidentialité non cadrée : une étude qui cite des questions réelles peut faire entrer un nom de produit ou de client dans un fichier suivi du pilot | mineur | Ch6 lentille |

Deux biais probables de l'auteur complètent la liste. L'ancrage sur la solution : le modèle est nommé
avant la cause. La malédiction du savoir : « le process » et « les chapitres » supposent un lecteur qui
sait lesquels.

---

## Chapitre 4 — Factcheck · Audit des prémisses

Le prompt affirme peu de faits, mais il en suppose un qui est faux pour la conversation principale de
Claude Code, et il en affirme un autre, causal, que la mesure nuance. Chaque prémisse a été vérifiée
le 25/09/2026 sur quatre sources : la documentation de Claude Code, la référence Anthropic des
modèles, les transcripts des sessions du pilot et un chronométrage des hooks.

Le tableau se lit ligne par ligne : une prémisse (citée, ou implicite quand le prompt la suppose sans
l'écrire), son verdict, et la preuve qui le fonde. P1 à P7 *(les sept prémisses auditées, numérotées
pour les renvois)* suivent l'ordre du prompt. Une prémisse fausse remonte au Ch3 en bloquant.

| # | Prémisse | Verdict | Preuve |
|---|---|---|---|
| P1 | « Plusieurs prompts envoyés ont un délai de réponse important » | vrai, mesuré | Sur 157 tours mesurables du pilot, médiane 21,2 min et p90 90,4 min ; pour 24 questions courtes, médiane 6,3 min et p90 42,8 min, et 11,3 min en médiane sur les 14 derniers jours (mesure ci-dessous) |
| P2 | « un process récurrent qu'elle répète systématiquement » | partiellement vrai | 3 hooks tournent à chaque fin de tour, 2 après chaque commande ou écriture, 1 à chaque message (chronométrage ci-dessous). Mais les outils ne pèsent que 22,8 % du temps des tours, et la restitution complète est conditionnelle : tour de travail, mot de verdict ou 150 mots (`oracles\hook-restitution.mjs`, fonction `jugeable`). Ce qui est systématique en pratique, c'est la réponse longue : 91,1 % des messages finaux dépassent 150 mots |
| P3 | « petit modèle rapide type Haïku » | vrai, avec deux limites | Haiku 4.5 est classé « Fastest », à 1 $ et 5 $ par million de jetons d'entrée et de sortie ; sa fenêtre est de 200 000 jetons contre 1 million pour les trois autres, et il n'accepte pas le réglage d'effort |
| P4 | implicite : le modèle se choisit « à la réception de la question » | **faux** pour la conversation principale | Aucun moyen documenté de changer le modèle sans geste humain : `/model`, `--model`, `ANTHROPIC_MODEL` ou `settings.json`. Les hooks de bascule de modèle réagissent à une bascule, ils ne la déclenchent pas. Seul un sous-agent se route vers Haiku (outil Agent, champ `model`). Le cache de prompt est propre à chaque modèle |
| P5 | « type Sonnet » pour des moyens médium | vrai | Sonnet 5 « Fast », 2 $ et 10 $ ; Opus 5.5 « Moderate », 4 $ et 20 $ ; Fable 5.1 « Slower », 10 $ et 50 $ |
| P6 | « Complexe : Le format actuel avec les agents actuels » | vrai, et incomplet | Les agents actuels emploient déjà Sonnet par défaut et Haiku pour le mécanique (`CONTRAT-INTERFACE.md`, lignes 351-352) ; la nouveauté serait de répondre à l'humain avec eux |
| P7 | implicite : une question courte reçoit aujourd'hui tout le process et tout le format | vrai en pratique, faux dans la règle | L'exemption « réponse courte » existe depuis le 08/09/2026 : moins de 150 mots, aucun mot de verdict, aucune écriture, moins de 4 commandes. Mais les questions courtes reçoivent 1 813 mots et 16,5 appels d'outils en médiane, et 87,5 % de leurs réponses dépassent 150 mots : presque aucune n'atteint l'exemption |

P4 est remontée au Ch3 #1 en bloquant : une étude qui la prendrait pour acquise concevrait un
mécanisme qu'aucun réglage ne permet de câbler.

### Limites de la plateforme

Ces faits bornent ce que l'étude peut proposer ; ils viennent de la documentation de Claude Code et de
la référence Anthropic des modèles, relevées le 25/09/2026.

- **Modèle** : la session principale garde le modèle choisi par l'humain. Un sous-agent peut tourner
  sur un autre modèle, par le champ `model` de sa définition ou de l'outil Agent ; il démarre avec un
  contexte vierge. Un skill peut s'exécuter dans un sous-agent (`context: fork` et `agent`) ; la
  documentation ne lui connaît pas de champ `model` propre.
- **Effort** : cinq niveaux, de `low` à `max`. La session qui a produit cette analyse tourne à `max`
  (champ `effort` de son transcript). La documentation ne connaît aucun moyen, pour un hook ou un
  skill, de le changer d'une question à l'autre. La référence Anthropic conseille de mesurer le
  modèle le plus capable à effort réduit avant de construire une cascade de modèles.
- **Cache** : il est propre à chaque modèle ; changer de modèle en cours de session relit tout le
  contexte au prix plein, et le premier message après la bascule en paie le délai.
- **Hooks** : un hook de message (`UserPromptSubmit`) peut ajouter du contexte ou bloquer ; il ne
  change ni le modèle ni la question. Un hook de fin de tour qui refuse laisse la réponse refusée à
  l'écran et fait réécrire.
- **Styles de sortie** : ils modifient le prompt système de la session ; ils se changent par
  `/output-style` ou par le champ `outputStyle` des réglages, et la documentation ne connaît aucun
  moyen, pour un hook ou un skill, d'en imposer un.
- **Mode rapide** : `/fast` accélère la sortie d'Opus, jusqu'à 2,5 fois, pour un prix doublé sur
  Opus 5.5. C'est une dépense, donc une décision humaine *(R-29 : dépenses et gates restent
  humaines)*.

### Coût des hooks (chronométrage du 25/09/2026)

Mesure par `Measure-Command`, 3 essais par hook, le 25/09/2026 à 10:20 (heure de Paris), sur le poste
qui héberge le pilot. Le tableau se lit ligne par ligne : le moment où le hook se déclenche, le hook,
et ses 3 durées.

| Moment | Hook | Durées mesurées |
|---|---|---|
| chaque message humain | `hook-lexique.mjs` | 0,15 · 0,11 · 0,11 s |
| après chaque écriture ou commande | `readme-dossiers.mjs` puis `generer-lisezmoi-output.mjs` | 1,45 · 1,99 · 1,46 s (somme des deux) |
| après chaque écriture, en plus | `hook-ecriture.mjs` | non mesuré |
| chaque fin de tour | `oracle-secrets-hors-perimetre.mjs` | 3,38 · 4,34 · 3,59 s |
| chaque fin de tour | `hook-produits-intacts.mjs`, `hook-restitution.mjs` | non mesuré |
| ouverture ou reprise de session | `hook-ouverture.mjs`, `hook-produits-intacts.mjs --empreinte` | non mesuré |

Le hook d'écriture n'a pas été mesuré parce qu'il juge l'appel d'outil que Claude Code lui passe, et
qu'un appel fabriqué à la main n'aurait rien mesuré de réel. Les hooks de fin de tour et d'ouverture
restants ne l'ont pas été parce que les lancer à la main aurait modifié l'état qu'ils surveillent :
le relevé des produits, le journal des restitutions, les dépôts du parc. Par
simple multiplication, un tour de 40 commandes paierait de 58 à 80 secondes de hooks, hors
génération ; c'est une projection, pas une mesure de tour. Un refus du hook de
restitution, lui, injecte un rappel de 1 914 mots (`oracles\hook-restitution.mjs`, constante
`RAPPEL`) et fait réécrire le message entier.

### Mesure des délais (transcripts du pilot, 25/09/2026)

La mesure porte sur les 171 tours humains des 30 sessions du pilot enregistrées sur ce poste, du
27/08 au 25/09/2026, et sur les 864 jugements consignés au journal des hooks. Un sous-agent l'a
conduite par scripts et a revérifié 2 tours à la main ; les sessions des produits n'ont pas été
mesurées, et la session en cours est exclue.

Le tableau se lit ligne par ligne : une population de tours, son effectif mesurable, puis la médiane
et le p90 *(90e centile : 9 tours sur 10 finissent avant)* de leur durée, du message humain au dernier
message de l'assistant.

| Population | Tours mesurables | Médiane | p90 |
|---|---|---|---|
| Tous les tours | 157 | 21,2 min | 90,4 min |
| Messages humains de 15 mots au plus | 108 | 19,6 min | 84,3 min |
| Questions courtes (40 mots au plus, forme interrogative) | 24 | 6,3 min | 42,8 min |
| Questions courtes, 14 derniers jours | 10 | 11,3 min | 72,5 min |

Quatre constats en sortent.

- **La réponse à une question courte est longue.** Sa médiane est de 1 813 mots ; 87,5 % dépassent
  150 mots, et 100 % sur les 14 derniers jours. Elle demande 16,5 appels d'outils en médiane.
  L'exemption « réponse courte » existe, mais presque aucune réponse ne l'atteint.
- **Le temps part surtout hors des outils.** Pour les questions courtes, l'exécution des outils pèse
  24,3 % du temps du tour, et 22,8 % sur l'ensemble des tours. Le reste mêle la génération du modèle
  et les hooks, que les transcripts ne séparent pas. À 1,5 à 2 secondes par commande, les hooks ne
  peuvent expliquer qu'une faible part des 6,3 minutes.
- **Un refus coûte un second message.** 33 tours sur 171 (19,3 %) ont subi au moins un refus
  bloquant du hook de restitution, donc une réécriture complète ; 12,5 % des questions courtes, et
  20 % sur les 14 derniers jours. Le décompte concorde entre transcripts et journal : 42 refus de
  part et d'autre.
- **L'effort maximal est une piste, pas une preuve.** Les 6 tours joués en Opus 5.5 à l'effort `max`
  ont une médiane de 127 minutes, contre 20,5 minutes pour les 80 tours joués en Opus 5 à l'effort
  `high`. Les tâches ne sont pas comparables et l'effectif est faible : c'est la première mesure que
  l'étude doit refaire à tâche égale.

Trois exemples tirés du corpus, sans nom de produit, donnent l'ordre de grandeur. « alors ? » a reçu
2 515 mots après 44,6 minutes. « Pourquoi doit-on réécrire l'histoire à chaque fois ? » a reçu 2 028
mots après 38,5 minutes. Une question sur l'adaptation des agents aux nouvelles versions de modèles a
pris 101,7 minutes et 100 appels d'outils. Un quatrième message, « 1b, 2 explique mieux les impacts
des décisions… », mêle un sélecteur de décision et une demande : le filtre par longueur l'a compté
comme question courte, exactement l'erreur que le Ch3 #14 prévoit.

Limites déclarées : 5 tours dont la dernière entrée est un marqueur interne tardif sont exclus des
durées ; la génération et les hooks ne se séparent pas dans les transcripts ; le journal des hooks
n'enregistre ni durée d'exécution ni message exempté, car `hook-restitution.mjs` sort avant d'écrire
quand un message n'est pas jugé.

---

## Chapitre 5 — Premortem · Anticipation d'échec

Projeté six semaines plus tard, l'échec le plus probable n'est pas une étude mal écrite. C'est une
étude juste sur le papier, impossible à câbler ou contournée dès sa mise en service. Les cinq causes
sont classées par probabilité décroissante ; chacune projette un défaut de l'inventaire en scénario.

1. **Un triage vers Haiku que la plateforme ne permet pas.** L'étude prend la piste « type Haïku » pour
   une contrainte. Le seul chemin câblable, le sous-agent, ajoute un démarrage et repart sans le
   contexte de la conversation : la question simple devient plus lente, ou reçoit une réponse hors
   contexte. *Mitigation* : les faits de plateforme dans le prompt ; comparer, sur les mêmes
   questions, un sous-agent Haiku, le modèle principal à effort réduit et une session dédiée aux
   questions rapides. Escalade de Ch3 #1 et #3.
2. **Le niveau Simple devient le raccourci que le 08/09 a déjà payé.** Un classement fondé sur la
   forme de la question laisse un tour qui écrit, commite ou publie se rendre en 3 lignes. La
   faute ne se voit qu'au tour suivant, quand l'humain cherche la trace. *Mitigation* : le niveau
   suit les actes du tour (première écriture, quatrième commande, action irréversible, livrable),
   jamais la longueur de la question ; invariants écrits. Escalade de Ch3 #6 et #9.
3. **Le gain n'apparaît pas, parce que le levier choisi n'était pas celui qui pesait.** Sans mesure,
   l'étude règle le modèle alors que le temps part dans la rédaction de réponses longues, la
   réflexion et la réécriture après refus. *Mitigation* : ÉTAPE 0 de mesure, décomposition du temps,
   cibles fixées depuis la mesure. Escalade de Ch3 #2.
4. **Le mauvais classement coûte deux tours.** « Pourquoi le hook a-t-il refusé ma synthèse ? » est
   classé Simple et reçoit une réponse sûre d'elle et fausse ; l'humain repose la question, et le
   délai total double. *Mitigation* : niveau affiché en première ligne et forçable ; escalade en cours
   de tour ; dix questions réelles rejouées avant la mise en service. Escalade de Ch3 #4 et #14.
5. **La proposition se perd dans son propre format.** Une étude de 5 000 mots, rendue en 8
   blocs, pose sa décision au milieu, sans candidature au registre ni essai borné : rien n'est mis en
   œuvre. *Mitigation* : la réponse dans les 150 premiers mots de l'étude, options fermées et
   verdict, protocole d'essai, candidature proposée en fin d'étude. Escalade de Ch3 #11 ; défaut
   neuf remonté au Ch3 #19.

---

## Chapitre 6 — Wargame · Stress-test adversarial

Les trois attaques convergent : le prompt commande un mécanisme, et ce mécanisme a des contraintes de
plateforme et de doctrine que le prompt ne transmet pas à l'étude.

**L'utilisateur exigeant.** Avant de décider, il veut : le délai avant et après par niveau, en
chiffres ; un exemple rédigé de réponse Simple et Moyen sur une question qu'il a vraiment posée ; le
moyen de forcer un niveau ; le moyen de savoir quel niveau a été appliqué ; un essai d'une semaine
avec retour arrière. Le prompt n'en demande aucun. Ils sont fermés par C3, C5 et C8 *(critères du
contrat de sortie, chapitre 8)*.

**L'expert du domaine (exploitation de modèles).** Il relève cinq points, tous absents du prompt :

- le cache de prompt est propre à chaque modèle : une cascade de modèles perd la réutilisation du
  cache, et changer de modèle en cours de session relit tout le contexte au prix plein ;
- la référence Anthropic conseille, avant toute cascade, de mesurer le modèle le plus capable à effort
  réduit ; un effort bas donne « fewer and more-consolidated tool calls, less preamble, and terser
  confirmations », soit l'inverse exact du symptôme que le prompt décrit ;
- le coût se juge par tâche achevée, pas par requête : une réponse rapide qu'il faut redemander n'est
  pas rapide ;
- un classeur qui appelle un modèle avant de répondre ajoute un aller-retour au délai qu'il prétend
  réduire ;
- une question de pilotage reste au modèle de pilotage : le tableau de routage la dit « jamais
  délégué » (`CONTRAT-INTERFACE.md`, ligne 349). Remonté au Ch3 #15.

**Le contradicteur.** La conformité littérale paresseuse est facile : trois niveaux, un tableau
« modèle / process / format », et « proposition argumentée » est satisfaite, sans rien de mesuré ni de
câblable. Autre détournement : une session du pilot, qui a mandat permanent d'écrire dans les forges,
modifie le hook de restitution « pour essayer » le niveau Moyen. Remonté au Ch3 #17.

**Lentille robustesse.** Le prompt n'est pas un prompt système, mais il commande un mécanisme appliqué
à chaque message de chaque session : la lentille s'applique.

- *Injection* : si un mot fixe le niveau, un lot de retours, une page lue ou le message d'une autre
  session peut l'écrire. Seul le message humain, en tête, doit compter, comme pour le lexique
  d'invocation *(RV-6 : certains débuts de message appellent un skill, lus par `hook-lexique.mjs`)*.
  Remonté au Ch3 #16.
- *Collision d'instructions* : le hook de lexique lit déjà le début de chaque message ; un second
  mécanisme sur la même zone doit s'y ranger, sinon 2 règles se disputent les premiers mots.
- *Calibrage* : Haiku 4.5 a une fenêtre de 200 000 jetons et n'accepte pas de réglage d'effort. Une
  session du pilot charge dès l'ouverture la doctrine, la mémoire et un relevé de 23 Ko ; le
  transcript de la session qui a produit cette analyse pesait 1,12 Mo après 9 minutes de travail.
- *Hiérarchie* : un niveau léger assouplit une règle de la factory ; seule la factory peut le faire,
  sur décision humaine. La précédence *(R-43 : la factory impliquée, ses règles priment ; renforcer
  oui, assouplir jamais)* interdit qu'une session ou un produit le décide seul.
- *Confidentialité* : une étude qui mesure sur les transcripts citera des questions réelles, et
  ces questions nomment des produits et des clients. Le pilot n'en fait entrer aucun nom dans un
  fichier suivi ; le prompt doit l'exiger des exemples. Remonté au Ch3 #21.

---

## Chapitre 7 — Deepthink · Implications profondes

Le prompt est ponctuel, mais le mécanisme qu'il commande s'appliquera à chaque message de chaque
session : la couche s'ouvre. Ses effets de second ordre pèsent plus que son gain direct.

- **Apprentissage de l'humain.** Si la brièveté de la question décide de la légèreté du process,
  l'humain apprendra à formuler court pour aller vite, y compris pour un vrai travail. La mesure
  devient la cible. Parade : le niveau suit les actes du tour, pas la forme de la question.
- **Mémoire de la Factory.** Les restitutions sont sa mémoire : 149 synthèses dans `output\04-plans\`
  au 19/09/2026 (`gabarits\RESTITUTION.md`, version 2.27.0). Des réponses légères laissent moins de
  traces, donc moins de leçons remontées. Parade : une ligne de trace par réponse légère. Elle
  n'existe pas aujourd'hui : le journal des hooks ne consigne que les messages jugés, et
  `hook-restitution.mjs` sort sans rien écrire quand un message est exempté.
- **Héritage.** La doctrine de restitution est recopiée chez chaque produit instancié à l'ouverture de
  sa session (`oracles\hook-ouverture.mjs`, copie identique). Un niveau créé au pilot se multiplie
  donc par autant de produits. Il se versionne *(loi n° 4 : une donnée volatile est datée, sourcée,
  éditable)* et se propage par `gabarits\HERITAGE.json`, ou reste au pilot par décision. Remonté au
  Ch3 #12.
- **Sélecteurs de décision.** « 11a » fait 3 caractères et attend la preuve d'un geste : c'est la
  règle S-GESTE *(après un sélecteur de décision, la restitution porte la preuve du geste, jamais la
  décision reposée)*, née de l'incident du 11/09. Un classement par longueur rejouerait cet incident.
  Remonté au Ch3 #14.
- **Trajectoire de la doctrine.** Le seuil de 150 mots est écrit pour baisser : « Le seuil se baissera
  quand le corpus sera propre » (`gabarits\RESTITUTION.md`, ligne 980). Le prompt demande l'inverse
  pour une partie des messages ; l'étude doit dire laquelle des deux trajectoires elle retient.
- **Vocabulaire.** Les restitutions cotent l'effort des actions en « simple | moyen | complexe | très
  complexe » × durée. Des niveaux nommés pareil créeront des lignes ambiguës (« niveau moyen, effort
  simple »). Remonté au Ch3 #20.
- **Le levier le moins cher est une habitude.** Le délai d'une question simple dépend d'abord du
  modèle et de l'effort de la session ouverte. Une session légère pour les questions, une session de
  travail pour les runs : cette option ne change ni hook ni doctrine, et c'est la première à essayer.

---

## Chapitre 8 — Synthèse et prompt amélioré

Le prompt passe de **32 à 88/100** (projeté). Le gain vient de trois apports : une mesure avant toute
proposition, quatre leviers instruits séparément sous les limites réelles de la plateforme, et des
invariants qui empêchent un niveau léger de servir de raccourci.

### 8.1 Score avant → après

Une ligne par dimension ; la colonne « Levier » renvoie aux défauts du Ch3 qui expliquent le gain.

| Dimension | Avant | Après | Levier |
|---|---|---|---|
| Clarté de l'intention | 13 | 18 | intention double, attente et lecture ; cause à mesurer (#2, #7) |
| Spécification | 6 | 17 | six éléments par niveau, gabarit, emplacement, lecteur (#5, #10, #13) |
| Garde-fous & contraintes | 2 | 14 | invariants, interdits d'action, dépense marquée (#6, #9, #17, #18) |
| Ancrage / contexte | 5 | 14 | ÉTAPE 0 de mesure, faits de plateforme, doctrine nommée (#1, #2, #3, #8) |
| Vérifiabilité de la sortie | 2 | 13 | oracle E1-E10, contrat C1-C9, dix questions rejouées (#11) |
| Robustesse | 4 | 12 | escalade sur les actes, sélecteurs, niveau fixé par le seul message humain (#4, #14, #16) |
| **Total** | **32** | **88** | |

### 8.2 Diagnostic en 3 lignes

- Force : l'intention (proportionner l'appareil à la question) et la frontière (le niveau Complexe
  reste tel quel) sont claires.
- Faiblesse bloquante : le modèle ne se choisit pas à la réception de la question dans Claude Code ;
  la piste « type Haïku » mène à une architecture impossible.
- Faiblesse majeure : la cause n'est pas mesurée, l'effort n'est pas nommé, et le conflit avec la
  doctrine de restitution est passé sous silence.

### 8.3 Prompt réécrit (prêt à coller)

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

### 8.4 Contrat de sortie (rappel)

Les neuf critères **C1-C9** *(critères d'acceptation du livrable, numérotés dans le prompt réécrit)*
sont embarqués dans le prompt. Tous sont binaires : un oracle exécuté (C1), une présence vérifiable
par lecture (C2 à C8), un état du dépôt vérifiable par `git status` (C9).

### 8.5 Changelog tracé

Chaque ligne relie un ajout du prompt réécrit au défaut qu'il ferme ; la lecture se fait de l'ajout
vers sa justification.

| Ajout | Défaut fermé |
|---|---|
| Faits de plateforme ; le modèle de chaque niveau devient un résultat de l'étude | Ch3 #1 (bloquant) · Ch4 P4 · Ch5 #1 |
| ÉTAPE 0 de mesure et décomposition du temps | Ch3 #2 · Ch2 R1 · Ch5 #3 |
| Levier effort ; quatre leviers instruits séparément | Ch3 #3, #5 · Ch2 R3 · Ch6 expert |
| Triage : trois classeurs, critères à la réception et pendant le tour, escalade, niveau affiché | Ch3 #4 · Ch2 R4 · Ch5 #4 |
| Invariants, dont le modèle de pilotage | Ch3 #6, #15 · Ch5 #2 |
| Temps de lecture ; réponse dans les 150 premiers mots | Ch3 #7, #13 · Ch2 R2 |
| Conflits de doctrine (texte, juge, rappel), trajectoire du seuil, garde contre le raccourci | Ch3 #8, #9 · Ch5 #2 · Ch7 |
| Gabarit, oracle, emplacement, lecteur | Ch3 #10 |
| Cibles tirées de la mesure, essai borné, retour arrière | Ch3 #11 · Ch5 #5 · Ch6 utilisateur |
| Portée à trancher, héritage | Ch3 #12 · Ch7 |
| Deux sélecteurs de décision parmi les questions rejouées | Ch3 #14 · Ch7 |
| Niveau fixé par le seul message humain | Ch3 #16 · Ch6 lentille |
| Interdits d'action | Ch3 #17 · Ch6 contradicteur |
| Dépense marquée « décision humaine » | Ch3 #18 |
| L'étude applique ce qu'elle propose | Ch3 #19 · Ch5 #5 |
| Distinction avec la cotation d'effort | Ch3 #20 |
| Pseudonyme dans toute question citée en exemple | Ch3 #21 · Ch6 lentille |

### 8.6 Écarts à la lettre

Vous avez écrit une demande ; le prompt réécrit s'en écarte aux endroits ci-dessous. Chaque ligne est
à valider séparément : un écart non validé ne doit pas passer avec le reste.

| N° | Vous avez écrit | Je propose | Pourquoi |
|---|---|---|---|
| 1 | « adapter le modèle à utiliser pour le traitement de la question » | quatre leviers instruits séparément : modèle, effort, process, format | l'effort n'était pas nommé et c'est le réglage le plus direct ; le modèle principal ne se change pas seul (Ch3 #1, #3) |
| 2 | « petit modèle rapide type Haïku » pour le niveau Simple | le modèle du niveau Simple devient un résultat de l'étude : sous-agent Haiku, modèle principal à effort réduit et session légère, comparés | Haiku n'est joignable qu'en sous-agent, sans le contexte de la conversation ; le cache est propre à chaque modèle (Ch4 P4) |
| 3 | « type Sonnet » pour le niveau Moyen | même traitement ; Sonnet reste le défaut des sous-agents de recherche, comme aujourd'hui | le routage des sous-agents existe déjà (`CONTRAT-INTERFACE.md`, §4) |
| 4 | « à évaluer à la réception de la question » | à la réception et pendant le tour, avec escalade sur les actes | la complexité se découvre souvent en cours de tour (Ch2 R4) |
| 5 | « optimiser les temps de traitement et temps de réponse » | le temps de lecture s'ajoute : la réponse tient dans les 150 premiers mots | votre constat sur le format porte sur la lecture (Ch2 R2) |
| 6 | « Etudie et fournis une proposition argumentée » | étude au gabarit de la Factory, options O0-O4, verdict, essai borné ; aucune mise en œuvre | c'est la forme que l'oracle sait juger ; une étude s'arrête avant la décision |
| 7 | rien sur la mesure, les invariants, la doctrine, la portée | ÉTAPE 0 de mesure, invariants, conflits de doctrine, dix questions rejouées, portée à trancher | ajouts purs : aucun ne restreint votre demande |
| 8 | « Complexe : Le format actuel avec les agents actuels » | inchangé | aucun écart |

Les options O0-O4 *(jeu fermé d'options du gabarit d'étude ; O0 = ne rien changer)* sont celles de
`gabarits\ETUDE-OPPORTUNITE.md`.

### 8.7 Protocole de tests du livrable

Le livrable est un document texte jugé par un oracle existant ; le protocole est donc court.

- **Oracles** : `oracle-etude-opportunite.mjs` (E1-E10 *(les 10 règles de l'oracle des études,
  dont E9 intention citée et E10 test rétro joué)*) ; `check_markdown.py` du socle
  `digit-ai-page-html` pour la lisibilité (M7 *(ouverture de section)*, M10 *(mode de lecture des
  tableaux)*, M14 *(marqueurs de travail)*, M18 *(identifiant glosé)*) ; `git status` pour C9.
- **Jeu d'essai minimal** : (1) cas nominal, transcripts lisibles et journal présent ; (2) cas limite,
  la mesure montre que les questions courtes sont déjà rapides et courtes : l'étude retient alors O0
  ou une option « format seul », pas un routage de modèles ; (3) cas limite, le champ d'effort
  manque dans les transcripts anciens : la mesure se restreint à la période où il existe, et le dit.
- **Boucle** : générer, vérifier C1-C9, corriger ; 3 itérations au plus, puis remise avec les écarts
  restants.
