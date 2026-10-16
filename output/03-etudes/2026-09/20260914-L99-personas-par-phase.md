---
role: analyse L99 (8 couches) du prompt « étudier l'opportunité de concevoir, construire et exécuter des personas qui apportent des points de vue ou des façons d'opérer différents à chaque phase d'un projet » du 14/09/2026 — livrable principal au chapitre 8 (prompt réécrit, contrat de sortie, écarts à la lettre, protocole de tests)
sources_de_verite: [output/03-etudes/20260813-etude-personas-agents.md (verdict du 13/08, sources datées en annexe), gabarits/RESTITUTION.md (l. 132-134 et 534-536, « un persona ne remplace pas un oracle exécuté »), gabarits/ETUDE-OPPORTUNITE.md, oracles/oracle-etude-opportunite.mjs (E1-E10), REGLES-PROJET.md (R-31 l. 319-331), CLAUDE.md du pilot (§ Lancement d'un run), ~/.claude/skills/experts-forge/SKILL.md (l. 17-20) et references/registre-experts.md (17 fiches en statut ok), ~/.claude/skills/contre-expertise/SKILL.md (l. 34-51, angles A1-A3), ~/.claude/skills/forge-agents/SKILL.md (description), references/RUN-CONSEIL.md, todo/CLASSES.json (74 classes), input/00-retours/old/ (150 fichiers)]
verifie_le: 2026-09-14
---

# Analyse L99 — « Des personas pour apporter des points de vue différents à chaque phase d'un projet »

Prompt analysé le 14/09/2026, niveau **L99** *(analyse complète en 8 couches, chacune relisant le
prompt d'origine)*. Le mot-clé d'appel « Améliore ce prompt » a été retiré ; l'entrant est le texte
qui le suit, cité ici en entier :

> « Etudie l'opportunité de concevoir, construire et exécuter des personas permettant de fournir
> des points de vue ou une façon d'opérer différentes sur chaque phase d'un projet : Conception,
> développement, design, recette, déploiement... »

**Ce que le lecteur va apprendre d'abord.** La factory a déjà répondu à une partie de cette
question le 13/08/2026 : une étude d'opportunité a jugé les personas nuisibles comme juges et
inutiles pour les agents d'étape, et la consigne de restitution interdit depuis d'« inventer une
posture pour juger ». Le prompt l'ignore, et c'est son défaut principal : exécuté tel quel, il
refait cette étude ou la contredit sans preuve neuve. Il touche pourtant une question que l'étude
du 13/08 n'a pas mesurée. Elle portait sur l'exactitude, alors que ce prompt parle de **points de
vue**, c'est-à-dire de couverture : un regard d'exploitant, d'utilisateur ou de support
trouve-t-il des défauts que les oracles laissent passer ? La factory détient la base de mesure
pour y répondre : 150 lots de retours archivés, où l'humain a trouvé ce que les oracles avaient
rendu vert. Le prompt réécrit garde l'intention, part du verdict du 13/08, sépare les trois sens
du mot « persona » et remplace l'opinion par un rétro-test sur ces défauts échappés.

---

## Chapitre 1 — OODA · Cadrage stratégique et étalon noté

Le prompt obtient 20 sur 100. Trois défauts bloquants le plafonnent : il ignore l'existant qui
répond déjà en partie, il ne dit pas ce qu'est un persona, et il ne dit pas à quoi se reconnaît
une opportunité.

### Observe — ce que le prompt dit réellement

Une phrase, un verbe de commande et trois verbes d'objet.

- **La commande** : « Etudie l'opportunité ». Le livrable est donc une étude, pas un
  développement.
- **L'objet** : « concevoir, construire et exécuter des personas ». Les trois verbes décrivent un
  cycle complet, ce qui laisse ouverte la question de savoir si l'étude elle-même doit construire
  et exécuter.
- **La finalité** : « fournir des points de vue ou une façon d'opérer différentes ». Le « ou »
  désigne deux choses distinctes : un regard porté sur un livrable, et une manière de le produire.
- **Le périmètre** : « sur chaque phase d'un projet : Conception, développement, design, recette,
  déploiement... ». Cinq phases nommées dans un ordre qui n'est pas celui de la factory, et des
  points de suspension qui ouvrent la liste sans la borner.
- **Ce qui est absent** : la définition du mot persona, l'existant à relever, le critère qui dirait
  « opportun », la forme du livrable, la mesure, le coût acceptable, les garde-fous.

### Orient — le contexte réel du prompt

L'auteur est l'opérateur de l'écosystème forge Digit-AI ; le destinataire est le pilot. Cinq faits
relevés le 14/09 changent la lecture de la demande.

1. **L'étude du 13/08 existe et a tranché.** `output\03-etudes\20260813-etude-personas-agents.md`
   conclut : personas « nuisibles » pour le pilot en juge, « inutiles » pour les sous-agents de
   campagne et les agents d'étape, « utiles à petite dose et hors jugement » pour la seule
   restitution à l'humain (§3). Sa base : Zheng et al. (EMNLP 2024, 162 personas, aucun gain
   d'exactitude) et PRISM (arXiv, mars 2026, le persona expert dégrade MMLU sur 5 modèles).
   `REGLES-PROJET.md` l. 330 compte « personas écartés » parmi les verdicts de référence de R-31.
2. **La doctrine l'a gravé.** `gabarits\RESTITUTION.md` l. 133 : « un persona ne remplace pas un
   oracle exécuté » ; l. 534-536 : ne jamais « inventer une posture […] pour juger le livrable ».
3. **Le mécanisme du point de vue par domaine existe déjà.** `experts-forge` porte 17 fiches en
   statut `ok` (`registre-experts.md`), chacune admise par une épreuve A/B *(même question jouée
   sans puis avec l'expert, jugée par un juge tiers)* : « Un expert qui ne change pas
   matériellement une réponse n'est pas un expert » (`SKILL.md` l. 17). `contre-expertise` joue un
   angle de contradiction fixe (A3, l. 47-51). `forge-agents` ne dérive un agent que s'il a des
   outils, un arbitre ou un parallélisme distincts.
4. **Aucun de ces mécanismes n'est organisé par partie prenante ni par phase.** Les 17 fiches sont
   des domaines de contenu (data, SEO, accessibilité, ops cloud). Aucune ne porte le regard de
   l'exploitant, du support ou de l'utilisateur novice, et aucune n'est rattachée à une phase du
   run. C'est le trou réel que le prompt vise.
5. **La base de mesure existe.** `input\00-retours\old\` contient 150 fichiers de lots de retours
   et `todo\CLASSES.json` 74 classes de défauts. Ces défauts ont été trouvés par l'humain après que
   les oracles ont rendu vert : c'est exactement ce qu'un point de vue supplémentaire devrait
   attraper.

L'objectif profond n'est donc pas « des personas », c'est **moins de défauts échappés par phase**.
Le persona est une solution proposée à ce problème, et l'étude doit pouvoir conclure qu'une autre
forme le résout mieux.

### Decide — trois stratégies possibles

- **S1, refaire l'étude du 13/08 en l'élargissant aux phases.** Rapide à écrire, mais elle redira
  le verdict connu ou le contredira sur la même littérature. Écartée.
- **S2, instruire le seul delta, mesuré.** Partir du verdict du 13/08, ne traiter que la couverture
  des défauts, et la mesurer par rétro-test sur des défauts réels échappés. Coût moyen, verdict
  opposable.
- **S3, construire un prototype et l'essayer sur le prochain run.** Donne un résultat concret, mais
  fait naître un objet durable sans étude ni décision, contre R-31 *(règle 31 : tout objet durable
  naît d'un verdict de non-recouvrement écrit)*. Écartée.

### Act — approche recommandée

S2. L'étude part de l'acquis, sépare les sens du mot, se mesure sur les défauts que la factory a
déjà payés, et s'arrête au verdict et aux candidatures. La construction suit un GO humain.

### Étalon — à quoi ressemble le prompt idéal pour cette intention

Le prompt idéal cite l'étude du 13/08 comme point de départ et borne l'étude au delta. Il définit
le mot persona en séparant ses sens, prend les phases de la factory dans leur ordre, et impose le
relevé de l'existant avec citation. Il fixe le critère d'opportunité avant la mesure et prévoit un
rétro-test exécuté en lecture seule. Il nomme le gabarit, l'oracle et le chemin du livrable, et
pose les garde-fous : un persona ne juge jamais, aucune construction avant GO.

**Mode de lecture du tableau suivant** : une ligne par dimension de la rubrique L99 ; la note du
prompt d'origine est comparée au maximum de la dimension, et la justification cite le passage en
cause. Les dimensions sont dans l'ordre de la rubrique, pas par gravité.

| Dimension | Note | Justification |
|---|---|---|
| Clarté de l'intention | 9 / 20 | « étudie l'opportunité » est net ; « persona » et « points de vue ou façon d'opérer » ouvrent trois objets différents |
| Spécification | 3 / 20 | aucun livrable, aucun format, aucun chemin, liste de phases non bornée (« ... ») |
| Garde-fous et contraintes | 1 / 15 | rien sur le jugement, la construction, le coût ou l'écriture chez les produits |
| Ancrage et contexte | 2 / 15 | ignore l'étude du 13/08, `experts-forge`, `contre-expertise` et les lots de retours |
| Vérifiabilité de la sortie | 2 / 15 | aucun critère qui dirait « opportun » ; le verdict sera une opinion |
| Robustesse | 3 / 15 | la présupposition (« permettant de fournir ») pousse le modèle vers le oui |
| **Total** | **20 / 100** | trois défauts bloquants : le plafond de 40 ne joue pas, la note est déjà sous lui |

---

## Chapitre 2 — Chainlogic · Raisonnement en chaîne

Le prompt ne porte pas de chaîne logique interne : une seule instruction. Ce chapitre examine donc
les collisions entre ses termes, et il en trouve trois.

- **« Étudie l'opportunité » contre « construire et exécuter ».** Le verbe de commande demande une
  étude ; les verbes d'objet décrivent un cycle de construction. Un exécutant zélé construira. Or
  R-31 interdit de faire naître un objet durable (skill, référentiel, gabarit) avant son verdict.
  La lecture sûre : l'étude peut **exécuter une expérience** en lecture seule, elle ne construit
  rien de durable.
- **« Points de vue » contre « façon d'opérer ».** Un point de vue relit un livrable produit par
  un autre ; une façon d'opérer change la production elle-même. Les deux n'ont ni le même point
  d'insertion ni la même mesure. Le « ou » les fusionne.
- **L'ordre des phases.** Le prompt écrit « Conception, développement, design, recette,
  déploiement » ; la factory enchaîne conception → design → development → tests → MEP (`CLAUDE.md`,
  § Lancement d'un run). Un persona de design posé après le développement n'aurait plus rien à
  influencer.

---

## Chapitre 3 — Blindspots · Inventaire maître

Dix-sept défauts, dont trois bloquants. Ils tiennent presque tous à un même silence : le prompt
traite la question comme neuve alors que la factory en détient la moitié de la réponse et tout
l'outillage de mesure.

**Mode de lecture** : une ligne par défaut, classée par sévérité puis par ordre d'apparition ; le
numéro `#N` sert de renvoi dans les chapitres suivants et au changelog. Les défauts marqués
*remonté* viennent d'une couche aval (Ch4, Ch5 ou Ch6), selon la boucle de correction ascendante.

| # | Défaut | Sévérité |
|---|---|---|
| 1 | L'étude du 13/08 et la doctrine qui en découle (`RESTITUTION.md` l. 534-536) sont ignorées : risque de doublon ou de contradiction sans preuve neuve | bloquant |
| 2 | « Persona » n'est pas défini : rôle incarné d'agent, profil d'utilisateur du produit, ou mode opératoire, trois objets aux mesures différentes | bloquant |
| 3 | Aucun critère d'opportunité ni aucune mesure : le verdict sera une opinion | bloquant |
| 4 | Le non-recouvrement n'est pas demandé : `experts-forge` (17 fiches), `contre-expertise` A3, `forge-agents`, revue graphique aval de forge-design, personas par lot de `digit-ai-propale` | majeur |
| 5 | Phases hors de l'ordre et du vocabulaire de la factory ; « déploiement » n'est pas la MEP *(mise en production, avec GO humain)* ; liste ouverte par « ... » | majeur |
| 6 | Les forges transverses (ops, data, websec, SEO) ne sont pas situées | majeur |
| 7 | « Construire et exécuter » laisse ouverte une construction sans GO, contre R-31 et la loi n° 5 | majeur |
| 8 | Aucun garde-fou : un persona ne doit jamais rendre de verdict ni remplacer un oracle | majeur |
| 9 | La forme du livrable n'est pas nommée : gabarit `ETUDE-OPPORTUNITE.md` et son oracle E1-E10 | majeur |
| 10 | Le coût n'est pas cadré : personas × phases × runs, en tokens et en faux constats | majeur |
| 11 | Aucune base de mesure désignée alors que 150 lots de retours et 74 classes de défauts existent | majeur |
| 12 | La présupposition « permettant de fournir » tient le bénéfice pour acquis (biais de confirmation) | majeur |
| 13 | L'option « ne rien faire » n'est pas posée ; le gabarit l'exige (O0) | majeur |
| 14 | *remonté du Ch4* : l'état de l'art du 13/08 vieillit, 3 de ses 5 sources sortent de la fenêtre de 24 mois du gabarit | majeur |
| 15 | *remonté du Ch5* : la baseline sans persona n'est pas exigée, ni son gel avant l'écriture des personas | majeur |
| 16 | *remonté du Ch6* : les biais connus des utilisateurs simulés par un modèle de langage ne sont pas à instruire | majeur |
| 17 | Accord fautif (« une façon d'opérer différentes ») et accent manquant (« Etudie ») | mineur |

---

## Chapitre 4 — Factcheck · Audit des prémisses

Le prompt n'affirme rien explicitement, mais il tient trois choses pour vraies. Une est fausse au
regard de la factory, une est vraie à moitié, une est invérifiable sans mesure.

**Mode de lecture** : une ligne par prémisse implicite, avec son statut (vrai, faux, périmé,
invérifiable) et le défaut de l'inventaire où elle est remontée.

| Prémisse implicite | Statut | Preuve | Remontée |
|---|---|---|---|
| « Rien n'existe encore » : la question est neuve | faux | étude du 13/08 ; 17 fiches `experts-forge` ; angle A3 de `contre-expertise` | Ch3 #1, #4 |
| « Des personas fournissent des points de vue utiles » | vrai pour le ton et la posture, faux pour l'exactitude, invérifiable pour la couverture de défauts dans ce contexte | étude du 13/08 §1 (Zheng 2024, PRISM 2026) ; aucune mesure de couverture faite | Ch3 #3, #12 |
| Les phases d'un projet sont « Conception, développement, design, recette, déploiement » | faux au regard du référentiel de la factory (ordre et terme de MEP) | `CLAUDE.md` du pilot, § Lancement d'un run | Ch3 #5 |

Une quatrième prémisse vient de l'étude du 13/08 elle-même, que le prompt réécrit va citer : ses
sources restent-elles valables ? Au 14/09/2026, la fenêtre de 24 mois du gabarit d'étude
commence au 14/09/2024. Zheng et al. (novembre 2024) et PRISM (mars 2026) y restent ; Hu & Collier
(ACL, août 2024), MetaGPT (ICLR, mai 2024) et la page Anthropic « consultée 08/2026 » sans date de
publication n'y sont plus ou n'ont pas de date vérifiable. Statut : **périmé pour 3 sources sur
5**, remonté en #14.

---

## Chapitre 5 — Premortem · Anticipation d'échec

On se place trois semaines après l'exécution du prompt d'origine : l'étude est rendue et elle ne
sert à rien. Voici les cinq causes les plus probables, de la plus à la moins probable.

1. **L'étude refait celle du 13/08.** *Scénario* : l'agent cherche « personas LLM », retrouve Zheng
   et PRISM, conclut « inutile », et l'humain lit deux fois la même étude. *Mécanisme* : sans point
   de départ imposé, l'agent reconstruit l'état de l'art au lieu de lire l'étude existante. *Mitigation* :
   le prompt réécrit cite l'étude et borne l'objet au delta non instruit (escalade de #1).
2. **Les personas sont des costumes.** *Scénario* : l'étude propose « Tu es un exploitant exigeant »
   par phase, vingt-cinq cases d'un tableau phase × persona remplies de prose générique.
   *Mécanisme* : le mot persona appelle le jeu de rôle, dont l'effet sur l'exactitude est nul ou
   négatif. *Mitigation* : un persona est une fiche déclarative (point de vue, questions, corpus,
   sortie, frontière), sur le modèle des fiches `experts-forge` ; il pose des questions, il ne
   juge pas (escalade de #2 et #8).
3. **Le verdict est « prometteur ».** *Scénario* : la conclusion recommande un pilote sans rien
   chiffrer. *Mécanisme* : aucune mesure n'est demandée, et le gabarit sanctionne ce terme (E6).
   *Mitigation* : rétro-test sur des défauts réels échappés, seuil de rétention fixé avant la mesure
   (escalade de #3 et #11).
4. **Le mécanisme noie les runs.** *Scénario* : retenu, il ajoute cinq regards à cinq phases, les
   candidats au registre doublent, la moitié sont faux, et l'équipe apprend à les ignorer.
   *Mécanisme* : on mesure le rappel sans la précision ni le coût. *Mitigation* : compter les faux
   constats et les tokens dans la même mesure, et refuser un persona qui double les faux constats
   (escalade de #10).
5. **La baseline est contaminée.** *Scénario* : la passe « sans persona » est jouée après l'écriture
   des personas, dans la même session, et bénéficie des mêmes questions ; le delta mesuré est nul
   ou gonflé au hasard. *Mécanisme* : l'auteur des personas connaît déjà les défauts cherchés.
   *Mitigation* : baseline figée avant l'écriture des personas, passes en sessions séparées, comme
   l'admission `experts-forge` (défaut neuf, remonté en #15).

---

## Chapitre 6 — Wargame · Stress-test adversarial

Les trois attaques ne visent pas les trous déjà listés : elles visent l'étalon et la direction de
réécriture. Chacune la déplace d'un cran.

### L'utilisateur exigeant

Il ne veut pas une matrice, il veut savoir **ce qu'un persona aurait trouvé sur ses propres runs**.
Il demande donc des exemples tirés des lots de retours réels : tel défaut d'une recette, trouvé
par l'humain, aurait-il été vu par le regard d'un exploitant à la phase de conception ? Sans cas
réels, il ne peut pas arbitrer. La réécriture en tient compte : la mesure porte sur un échantillon
nommé de défauts, et chaque option cite les défauts qu'elle aurait attrapés.

### L'expert du domaine

Un spécialiste de la qualité logicielle relève trois points.

- Le mot persona désigne en conception UX un artefact **dérivé d'une recherche utilisateur**, pas
  un rôle inventé ; `digit-ai-propale` le dit déjà (« dérivés des entrants, jamais inventés »).
  L'étude doit donc séparer le persona utilisateur du rôle d'agent.
- L'inspection logicielle connaît depuis longtemps la lecture par perspectives *(Perspective-Based
  Reading, Basili et al., Empirical Software Engineering, 1996)* : des relecteurs humains lisant une
  spécification comme concepteur, testeur ou utilisateur y trouvaient plus de défauts. C'est
  l'analogue le plus proche de la demande, mais il est ancien et porte sur des humains : il fonde
  une hypothèse, pas un verdict. Le prompt réécrit le cite comme analogue signalé, hors des sources
  datées exigées.
- Les utilisateurs simulés par un modèle de langage ont des biais documentés (réponses homogènes,
  profils stéréotypés) ; l'étude doit les instruire avant de recommander une simulation en recette
  (défaut neuf, remonté en #16).

### Le contradicteur

Deux conformités paresseuses menacent. La première rend un tableau phase × persona de vingt-cinq
cases, bien écrit, qui passe toutes les règles de forme et ne change aucun run. La seconde recopie
le verdict du 13/08 (« inutile ») et s'arrête, conforme à la doctrine et aveugle au delta. La
réécriture ferme les deux : le tableau n'est recevable qu'appuyé sur la mesure, et le verdict du
13/08 ne peut être reconduit ou contredit que sur le rétro-test.

### Lentille robustesse

Le prompt n'est ni un prompt système ni un gabarit réutilisable ; la lentille n'est pas
obligatoire. Deux points de calibrage restent utiles pour l'exécution. La mesure demande des
passes en sessions séparées : sous Claude Code, des sous-agents ou `claude -p` le permettent, et
le mode dégradé doit être consigné s'il sert. Le prompt réécrit entre aussi en collision possible
avec la doctrine de restitution : un persona qui « juge » serait refusé par la règle des l. 534-536,
d'où la clause qui interdit tout verdict de persona.

---

## Chapitre 7 — Deepthink · Implications profondes

Prompt ponctuel : ses effets d'échelle ne se jugent pas ici. Ceux de son **résultat**, s'il est
retenu (cinq phases, chaque run, chaque produit), sont couverts par la cause d'échec n° 4 du Ch5 et
par la mesure de précision et de coût du contrat de sortie.

---

## Chapitre 8 — Synthèse et prompt amélioré

Le prompt réécrit passe de 20 à 88 sur 100 (projeté). Le gain vient de trois ajouts : le point de
départ imposé (l'étude du 13/08), la partition du mot persona, et une mesure exécutée sur les
défauts réels.

### Score avant → après

**Mode de lecture** : une ligne par dimension ; la colonne « après » est projetée, pas mesurée, et
la dernière colonne dit quel ajout produit l'écart.

| Dimension | Avant | Après (projeté) | Ce qui fait l'écart |
|---|---|---|---|
| Clarté de l'intention | 9 / 20 | 18 / 20 | objectif profond explicite (moins de défauts échappés), trois sens séparés |
| Spécification | 3 / 20 | 17 / 20 | gabarit, chemin, phases de la factory, annexe de mesure |
| Garde-fous et contraintes | 1 / 15 | 14 / 15 | aucun verdict de persona, aucune construction, lecture seule |
| Ancrage et contexte | 2 / 15 | 14 / 15 | étude du 13/08, non-recouvrement cité, base de retours |
| Vérifiabilité de la sortie | 2 / 15 | 13 / 15 | seuil fixé avant la mesure, oracles nommés |
| Robustesse | 3 / 15 | 12 / 15 | baseline figée, O0 obligatoire, présupposition retirée |
| **Total** | **20 / 100** | **88 / 100** | |

### Diagnostic en trois lignes

- **Force** : l'intuition est juste ; la factory ne relit aucun livrable depuis le regard d'une
  partie prenante, et ses retours prouvent que des défauts échappent aux oracles.
- **Faiblesse** : le prompt ignore que la question des personas a déjà été tranchée pour le
  jugement, et il ne dit ni ce qu'est un persona ni ce qui prouverait son utilité.
- **Correction** : partir de l'acquis, séparer trois objets, et mesurer sur les défauts déjà payés.

### Prompt réécrit (prêt à copier)

```text
Mandat d'étude d'opportunité, joué dans le pilot. Lecture seule sur les produits et les forges ;
écriture seulement dans output\03-etudes\ et input\01-candidatures\ du pilot.

INTENTION, dans mes mots : « Etudie l'opportunité de concevoir, construire et exécuter des personas
permettant de fournir des points de vue ou une façon d'opérer différentes sur chaque phase d'un
projet ». Ce que j'attends : savoir si des personas apporteraient, à chaque phase d'un run, des
constats que les oracles, les experts et les méthodes des forges ne produisent pas déjà ; si oui,
lesquels, sous quelle forme, à quel coût. L'objectif est de réduire les défauts qui échappent aux
oracles. Le persona est une solution candidate, pas un acquis : conclure qu'une autre forme fait
mieux est une réponse recevable.

POINT DE DÉPART OBLIGATOIRE. L'étude du 13/08/2026
(output\03-etudes\20260813-etude-personas-agents.md) a déjà jugé les personas nuisibles comme juges
et inutiles pour les agents d'étape, sur la base de leur effet nul ou négatif sur l'exactitude.
gabarits\RESTITUTION.md en a tiré une règle : ne jamais inventer une posture pour juger. Ne refais
pas cette étude. Pars de son verdict et instruis ce qu'elle n'a pas mesuré : l'apport d'un point de
vue différent à la COUVERTURE des défauts. Tu ne la reconduis ou ne la contredis que sur la mesure
ci-dessous.

1. PARTITION. Trois objets, instruits séparément, chacun défini par ce qu'il est, ce qu'il n'est
   pas et son point d'insertion :
   P1 — persona-lentille : une grille de relecture d'un livrable depuis le point de vue d'une partie
        prenante (utilisateur final, exploitant, support, sécurité, accessibilité, commanditaire).
        Il pose des questions ; il ne rend jamais de verdict.
   P2 — persona-utilisateur simulé : un profil d'utilisateur du produit, dérivé des entrants du
        produit et jamais inventé, qui parcourt le produit en tests.
   P3 — mode opératoire : une manière de produire (exploratoire ou contractuelle, divergente ou
        convergente) appliquée par l'agent d'une phase.
   Phases : celles de la factory, dans leur ordre (CLAUDE.md, § Lancement d'un run) : conception,
   design, development, tests (dont la revue graphique 5 bis), MEP. Situe aussi les forges
   transverses mobilisées (ops, data, websec, seo-geo). Déploiement se lit MEP : forge-ops outille,
   le GO reste humain.

2. NON-RECOUVREMENT. Une ligne par existant, avec une citation (fichier, ligne ou section). Au
   minimum : experts-forge (17 fiches en statut ok, règle d'admission A/B « un expert qui ne change
   pas matériellement une réponse n'est pas un expert ») ; contre-expertise (angle A3,
   contradiction) ; forge-agents (un agent n'est dérivé que s'il a des outils, un arbitre ou un
   parallélisme distincts) ; revue graphique aval de forge-design ; personas par lot de
   digit-ai-propale ; quality-oracles ; l'étude du 13/08.

3. ÉTAT DE L'ART. Au moins 5 sources datées de moins de 24 mois au 14/09/2026 (nom, date,
   localisateur), lues pendant le mandat et jamais citées de mémoire, sur trois axes : personas et
   exactitude (mise à jour du 13/08, dont 3 sources sur 5 sortent de la fenêtre) ; diversité de
   points de vue et couverture des défauts ; utilisateurs simulés par un modèle de langage et leurs
   biais. La lecture par perspectives en inspection logicielle (Basili et al., 1996) peut être
   citée comme analogue ancien, signalé comme tel, hors du compte des 5. Toute source non vérifiée
   est marquée « non vérifié ».

4. MESURE, exécutée en lecture seule : le cœur de l'étude.
   - Échantillon : 10 défauts trouvés par l'humain après un vert des oracles, pris dans
     input\00-retours\old\ et rattachés à todo\CLASSES.json, répartis sur au moins trois phases.
     Liste-les avec leur source avant toute autre étape.
   - Pour chacun, reconstitue le livrable de la phase tel qu'il était avant le retour (historique
     git du produit, lecture seule).
   - Au plus 3 personas candidats, écrits en fiches déclaratives (point de vue, questions, corpus,
     sortie attendue, frontière) sur le modèle des fiches experts-forge.
   - Baseline : une passe sans persona par livrable, même consigne de relecture et même modèle,
     jouée et figée AVANT l'écriture des fiches. Puis une passe avec chaque persona, en session
     séparée.
   - Compte par passe : défauts de l'échantillon retrouvés, constats faux ou hors sujet, tokens.
   - Seuil fixé maintenant : un persona est retenu s'il retrouve au moins 2 défauts de plus que la
     baseline sur les 10, sans doubler le nombre de constats faux.
   - Borne : 3 personas × 10 livrables × 2 passes, une seule campagne, pas de relance.

5. OPTIONS, jeu fermé O0-O4, chacune avec son coût (complexité × durée, tokens), ce qu'elle
   exclut, la phase où elle s'insère et les défauts de l'échantillon qu'elle aurait attrapés :
   O0 — ne rien faire, le verdict du 13/08 tient ; réfutée ou retenue sur la mesure.
   O1 — fiches de point de vue de partie prenante dans experts-forge, admises par la même A/B.
   O2 — grille de lentilles par phase en référentiel versionné (donnée datée, loi n° 4), branchée
        dans contre-expertise ou dans la boucle de fermeture de forge-tests.
   O3 — persona-utilisateur simulé en tests chez forge-tests, dérivé des entrants du produit.
   O4 — objet neuf (skill), seulement si O1 à O3 sont réfutés par écrit, et R-31 prouvée.

GARDE-FOUS. Un persona ne rend jamais de verdict et ne remplace aucun oracle. Aucun persona ne se
réduit à « Tu es un… ». Aucun objet durable (skill, oracle, gabarit, référentiel) n'est construit
dans ce mandat : la construction suit le GO humain. Aucune écriture chez les produits ni dans les
forges. Aucune API payante hors Claude. Si la mesure ne peut pas être jouée (livrable
irrécupérable, échantillon insuffisant), dis-le avec la trace de la tentative et rends un verdict
sous réserve, jamais un verdict inventé.

LIVRABLE. output\03-etudes\20260914-etude-opportunite-personas-par-phase.md, au gabarit
gabarits\ETUDE-OPPORTUNITE.md, avec en annexe le tableau brut de la mesure (défaut, phase, source,
trouvé par la baseline, trouvé par chaque persona, constats faux, tokens). Une candidature par
option retenue, en sidecar dans input\01-candidatures\, ingérée en candidat. Restitution au gabarit
gabarits\RESTITUTION.md, le GO de construction posé en décision.

CONTRAT DE SORTIE. L'étude est rejetée s'il manque l'un de ces points :
- node oracles\oracle-etude-opportunite.mjs rend PASS (E1-E10) ;
- check_markdown.py (socle digit-ai-page-html) rend PASS sur M7, M10, M14, M18 ;
- l'étude du 13/08 est citée en section 0 et le delta instruit est nommé ;
- P1, P2 et P3 sont définis et instruits séparément ;
- chaque ligne de non-recouvrement porte une citation ;
- au moins 5 sources de moins de 24 mois, datées, avec localisateur ;
- l'échantillon de 10 défauts est listé avec sa source AVANT les résultats ;
- la baseline porte un horodatage antérieur à celui des fiches de persona ;
- le tableau de mesure est complet : 10 lignes, une colonne par passe, totaux justes ;
- O0 est réfutée ou retenue par un chiffre de la mesure ;
- un seul verdict, un plan de revue daté, aucun effort en jours ;
- aucun fichier écrit hors output\03-etudes\ et input\01-candidatures\ (git status le montre).
```

### Contrat de sortie, en clair

L'étude rendue doit satisfaire douze critères, tous vérifiables par un oracle, une commande ou un
décompte. Deux oracles : `oracle-etude-opportunite.mjs` (règles E1 à E10 du gabarit d'étude) et
`check_markdown.py` (M7 ouverture de chapitre, M10 mode de lecture des tableaux, M14 marqueurs de
travail oubliés, M18 glose des identifiants). Des décomptes : l'étude du 13/08 citée, P1 à P3
séparés, une citation par ligne de non-recouvrement, cinq sources datées de moins de 24 mois. Pour
la mesure : l'échantillon listé avant les résultats, la baseline horodatée avant les fiches, un
tableau de 10 lignes aux totaux justes. Pour le verdict : O0 tranchée par un chiffre, un seul
verdict, un plan de revue daté. Enfin, aucune écriture hors des deux dossiers autorisés.

### Écarts à la lettre

Le prompt réécrit s'écarte de votre texte en sept endroits. Chacun se valide ou se rejette
séparément ; aucun ne doit passer par une validation en bloc.

**Mode de lecture** : une ligne par écart ; la première colonne cite votre texte, la deuxième dit ce
que le prompt réécrit en fait, la troisième dit pourquoi. Les lignes suivent l'ordre du prompt
réécrit.

| N° | Vous avez écrit | Je propose | Pourquoi |
|---|---|---|---|
| 1 | « concevoir, construire et exécuter » | l'étude exécute une expérience en lecture seule et ne construit rien de durable ; la construction suit votre GO | R-31 et loi n° 5 ; Ch2, Ch3 #7 |
| 2 | « des personas » | trois objets séparés : lentille, utilisateur simulé, mode opératoire | Ch3 #2 ; les trois n'ont ni la même insertion ni la même mesure |
| 3 | « points de vue ou une façon d'opérer » | le point de vue est instruit en premier (P1, P2) ; la façon d'opérer devient P3, à part | Ch2 ; l'étude du 13/08 couvre déjà une partie de P3 (agents d'étape) |
| 4 | « Conception, développement, design, recette, déploiement... » | les phases de la factory dans leur ordre, plus les forges transverses ; déploiement lu comme MEP | Ch4, Ch3 #5 et #6 |
| 5 | aucune mesure demandée | rétro-test sur 10 défauts échappés, seuil de 2 défauts de plus que la baseline, 3 personas au plus | Ch3 #3, #11 ; les chiffres 10, 2 et 3 sont une proposition de ma part, à valider ou à changer |
| 6 | la question posée comme neuve | départ imposé à l'étude du 13/08, delta seul instruit | Ch3 #1, Ch4 |
| 7 | « permettant de fournir » (bénéfice présupposé) | le persona devient une solution candidate ; O0 et une autre forme sont des réponses recevables | Ch3 #12, #13 |

### Protocole de tests du livrable

Le livrable produit par le prompt réécrit est un document d'étude accompagné de données de mesure.
Le protocole ci-dessous est prescrit à l'exécutant ; L99 ne l'exécute pas.

**Mode de lecture** : une ligne par partie du livrable, avec l'oracle qui la juge ; les parties
sont dans l'ordre où l'exécutant les produit.

| Partie du livrable | Type | Oracle |
|---|---|---|
| Étude au gabarit | document texte | `node oracles\oracle-etude-opportunite.mjs <étude>` (E1-E10), puis `check_markdown.py` (M7, M10, M14, M18) |
| Tableau de mesure en annexe | données | contrôle de cohérence : 10 lignes, une colonne par passe, totaux recalculés, horodatage de la baseline antérieur à celui des fiches |
| Sources de l'état de l'art | information | chaque source porte une date de moins de 24 mois et un localisateur ouvert pendant le mandat ; les autres sont marquées « non vérifié » |
| Candidatures | données | `node todo\ingerer-lot.mjs` puis `node todo\oracle-todo.mjs`, exit 0 |
| Restitution | document texte | `node oracles\oracle-synthese.mjs <synthèse>` |

**Jeu d'essai minimal**, à jouer sur l'échantillon avant de conclure :

- *cas nominal* : un défaut d'accessibilité découvert par l'humain en recette ; la lentille
  « utilisateur à besoins d'accessibilité » doit le retrouver, et la baseline peut le manquer ;
- *cas limite 1* : un défaut qui dépend d'un fait extérieur au livrable (un droit d'accès, une
  donnée de production) ; attendu : ni la baseline ni un persona ne le trouvent, et l'étude le dit ;
- *cas limite 2* : un défaut que la baseline trouve déjà ; attendu : aucun delta crédité au persona.

**Boucle bornée** : produire, juger par les oracles ci-dessus, corriger ; trois itérations au plus.
Après trois échecs, l'étude est livrée avec la liste des écarts résiduels. La mesure elle-même
n'est jamais rejouée pour atteindre le seuil.

### Changelog tracé

**Mode de lecture** : une ligne par modification du prompt, rattachée au défaut qu'elle corrige ;
aucune modification ne sort sans rattachement.

| Modification | Défaut corrigé |
|---|---|
| + point de départ imposé à l'étude du 13/08 et à la règle de `RESTITUTION.md` | Ch3 #1 (bloquant), Ch5 n° 1 |
| + partition P1, P2, P3 | Ch3 #2 (bloquant), Ch2 |
| + mesure par rétro-test et seuil fixé d'avance | Ch3 #3 (bloquant), #11, Ch5 n° 3 |
| + section de non-recouvrement avec sept existants nommés | Ch3 #4 |
| + phases de la factory, forges transverses, MEP | Ch3 #5, #6, Ch4 |
| + « aucun objet durable construit », GO humain | Ch3 #7, Ch2 |
| + garde-fou « un persona ne rend jamais de verdict » | Ch3 #8, Ch5 n° 2, Ch6 lentille |
| + gabarit, chemin, oracles, candidatures | Ch3 #9 |
| + comptage des constats faux et des tokens | Ch3 #10, Ch5 n° 4 |
| + intention sans présupposé, O0 obligatoire | Ch3 #12, #13, Ch6 contradicteur |
| + état de l'art mis à jour, fenêtre de 24 mois | Ch3 #14, Ch4 |
| + baseline figée avant les fiches, sessions séparées | Ch3 #15, Ch5 n° 5 |
| + axe « biais des utilisateurs simulés » | Ch3 #16, Ch6 expert |
| + exemples tirés des défauts réels dans chaque option | Ch6 utilisateur exigeant |
| accord et accent : non corrigés dans la citation de l'intention, qui reste vos mots | Ch3 #17 (mineur) |
