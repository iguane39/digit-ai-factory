---
type: analyse-L99
destinataire: humain
date: 2026-10-18
skill: prompt-analyzer-l99 (niveau L99, 8 couches)
---

# Analyse L99 — « un relecteur critique qui garde l'intention initiale » — 20261018

L'idée est juste et la Factory a déjà de quoi l'appuyer, mais le prompt tel qu'il est écrit ferait produire un avis et non une décision. Il ne dit pas ce qui rendrait ce relecteur « pertinent », il ne dit pas quelle « étape » il surveille, et il ignore 6 mécanismes existants qui couvrent déjà une partie du besoin. Il demande aussi au relecteur de « s'assurer » de l'intention alors qu'il ne lui donne qu'un rôle d'avis. Score de départ : 35 sur 100 ; le prompt réécrit en fait une étude d'opportunité mesurée sur des cas réels de perte d'intention.

**Prompt analysé**, cité tel quel : « étudie s'il serait pertinent d'avoir un relecteur critique, à chaque étape ou à la fin, qui suit l'avancement des sujets, donne son avis pour échanger avec les agents, et s'assurer qu'au fur et à mesure de l'avancement, on conserve bien l'intention initiale du prompt. »

**Contexte d'exécution** : le pilot `digit-ai-factory`, où un verbe « étudie » produit une étude d'opportunité au gabarit `gabarits\ETUDE-OPPORTUNITE.md`, jugée par `oracles\oracle-etude-opportunite.mjs`.

---

## Chapitre 1 — OODA · Cadrage stratégique et étalon noté

Le prompt porte une vraie intention, garder le cap de la demande jusqu'au bout, mais il la formule comme une solution déjà choisie, un relecteur, au lieu d'un problème à résoudre. L'étalon ci-dessous montre qu'il perd l'essentiel de ses points sur la vérifiabilité et l'ancrage.

**Observe.** Quatre fonctions sont demandées au relecteur : « suit l'avancement des sujets », « donne son avis », « pour échanger avec les agents », et « s'assurer […] qu'on conserve bien l'intention initiale ». Deux placements sont proposés sans être tranchés : « à chaque étape ou à la fin ». Le verbe de tête est « étudie », et l'objet de l'étude est la pertinence (« s'il serait pertinent »). Aucun critère, aucun format, aucun périmètre, aucun coût.

**Orient.** La demande arrive le jour où la session a montré que le juge externe donne un avis et ne valide rien, et où une erreur de mesure de la session n'a été trouvée qu'en construisant un outil de contrôle. Elle prolonge un fait fondateur de la Factory : le refus du 01/09/2026 d'une étude « conforme à sa lettre » qui « n'explique rien » (`references\INTENTION.md`, « Le fait fondateur »). L'objectif profond n'est donc pas d'ajouter un agent ; c'est que la perte d'intention soit détectée par quelqu'un d'autre que l'auteur, avant que l'humain la découvre à la remise.

**Decide.** Trois façons de répondre :
- donner un avis argumenté sur l'idée : rapide, mais c'est exactement le défaut que la Factory reproche à ses études sans mesure ;
- concevoir directement le relecteur : saute la question posée (« s'il serait pertinent ») ;
- mener une étude d'opportunité au gabarit, mesurée sur des cas réels de dérive d'intention déjà vécus, avec des options de placement comparées.

**Act.** La troisième. La Factory a un corpus de dérives documentées et des relecteurs déjà mesurés : l'étude peut répondre par des chiffres et non par une opinion.

**Étalon.** Le prompt idéal, pour cette intention :
- nomme le livrable (étude d'opportunité au gabarit, son oracle, son emplacement) ;
- définit « étape » parmi les découpages réels de la Factory ;
- pose le critère de « pertinent » : détection des dérives sur un corpus, fausses alarmes, coût ;
- cite l'existant à ne pas refaire ;
- fixe l'autorité du relecteur (avis ou blocage) et à qui il parle ;
- borne la dépense de l'étude et interdit toute mise en service dans le même tour.

La note suit la rubrique L99 en 6 dimensions. Comment lire le tableau : une ligne par dimension, dans l'ordre de la rubrique, avec les points obtenus sur le maximum et la raison principale.

| Dimension | Points | Raison |
|---|---|---|
| Clarté de l'intention | 12 / 20 | Le but (garder l'intention) est lisible ; le livrable (« étudie ») et le choix « à chaque étape ou à la fin » restent ouverts |
| Spécification | 5 / 20 | Ni format, ni périmètre, ni définition d'« étape » ou de « sujet » |
| Garde-fous et contraintes | 3 / 15 | Aucune borne de coût, d'autorité ou de mise en service |
| Ancrage et contexte | 5 / 15 | Aucun des mécanismes existants n'est cité (voir Ch3, défaut n° 3) |
| Vérifiabilité de la sortie | 3 / 15 | « Pertinent » sans critère : aucune réponse ne peut être jugée juste ou fausse |
| Robustesse | 7 / 15 | Peu de surface d'injection ; forte tentation de réponse littérale (« oui, à chaque étape ») |

**Total : 35 / 100.** Le défaut n° 1 du Ch3 est bloquant, ce qui plafonnerait de toute façon la note à 40.

---

## Chapitre 2 — Chainlogic · Raisonnement en chaîne

Le prompt enchaîne quatre fonctions dans une seule phrase, et la dernière contredit la deuxième : on ne peut pas à la fois « donner son avis » et « s'assurer » d'un résultat.

La chaîne implicite est : *si* un relecteur suit l'avancement, *alors* il voit les écarts ; *s'il* donne son avis aux agents, *alors* ils corrigent ; *donc* l'intention est conservée. Trois ruptures :
1. **Avis → assurance.** Un avis n'assure rien : il faut que quelqu'un l'arbitre. Dans la Factory, l'arbitrage appartient au pilot et la décision à l'humain (loi n° 5, « l'IA fait, l'humain décide »). Le prompt ne dit pas qui tranche quand le relecteur et l'agent divergent.
2. **Suivre → voir l'écart.** Suivre l'avancement ne suffit pas à voir une dérive : il faut une **référence écrite** de l'intention à laquelle comparer. Sans elle, le relecteur compare l'étape n à l'étape n−1 et dérive avec elle.
3. **Échanger avec les agents → corriger.** Un échange direct relecteur–agent contourne le pilot, seul écrivain du registre et seul arbitre. Il crée aussi ce que Cognition décrit comme des décisions implicites contradictoires entre agents qui ne partagent pas le même contexte (« Don't Build Multi-Agents », 2025-06-12).

---

## Chapitre 3 — Blindspots · Inventaire maître

Le prompt laisse 10 trous, dont 1 bloquant et 7 majeurs ; ce sont eux que le prompt réécrit doit fermer un à un. Comment lire le tableau : une ligne par défaut, numérotée pour le changelog du Ch8, classée par sévérité puis par ordre d'apparition ; la colonne « Sévérité » dit si le prompt échoue (bloquant), se dégrade (majeur) ou s'il s'agit d'un détail (mineur).

| N° | Défaut | Sévérité |
|---|---|---|
| 1 | « Pertinent » n'a aucun critère : l'étude rendra une opinion, que ni l'oracle ni l'humain ne peuvent juger. C'est la forme exacte du refus du 01/09/2026 | bloquant |
| 2 | « Étape » n'est pas définie. La Factory en a au moins trois sens : les 7 étapes d'un run (`references\ETAPES-RUN.md`), les tranches d'une campagne d'agents, les tours d'une session | majeur |
| 3 | L'existant n'est pas cité : test rétro écrit au bloc 1 de chaque restitution et contrôlé par S51 *(règle 51 du juge des restitutions : le bloc 1 dit l'intention et son test rétro)* ; doctrine ISTO (`references\INTENTION.md`) ; skill `contre-expertise` ; étude du relecteur « lecteur visé » (`output\03-etudes\20261013-etude-opportunite-juge-de-comprehension.md`) ; relecteur aveugle du mode boucle L99 (`references\boucle.md` du skill) ; arbitre de `la-boucle`. Risque : refaire l'un d'eux | majeur |
| 4 | L'autorité du relecteur n'est pas fixée (avis, alerte, blocage), ni qui arbitre un désaccord | majeur |
| 5 | L'indépendance n'est pas posée. Un relecteur qui partage le contexte de l'auteur partage ses angles morts : le 16/10/2026, 5 prompts réécrits relus à l'aveugle valaient 6 à 12 points de moins que la note de leur auteur (skill `prompt-analyzer-l99`, section « Niveaux »). Or « suit l'avancement » demande du contexte : la tension n'est pas nommée | majeur |
| 6 | « L'intention initiale du prompt » est ambiguë : le premier message humain, la consigne passée à un agent, ou l'intention validée et ses changements décidés en cours de route (une décision D-N change légitimement l'intention). Sans cette distinction, le relecteur bloque une évolution voulue ou laisse passer une dérive | majeur |
| 7 | Aucun coût ni budget. Un relecteur « à chaque étape » ajoute un agent par étape ; le relevé de flotte du 18/10 montre que les sous-agents du pilot relisent déjà plus de jetons que les sessions de pilotage. L'étude elle-même dépensera des appels de modèle pour mesurer | majeur |
| 8 | Aucun corpus de mesure, alors que la Factory a des dérives documentées : 01/09/2026 (étude refusée, `INTENTION.md`), 13/08 (« pour chaque liste » devenu « dès 8 lignes », `gabarits\AGENT-CAMPAGNE.md`, TF-0176), 26/09 (une source ajoutée que l'humain n'avait pas demandée, TF-1391) | majeur |
| 9 | « Échanger avec les agents » : le mode d'échange n'est pas dit. Un sous-agent rend un rapport final ; un échange en cours de tâche suppose de le relancer, et contourne le pilot | mineur |
| 10 | Le livrable n'est pas nommé (format, emplacement, oracle) ; la convention du pilot le fixe si on la cite | mineur |

---

## Chapitre 4 — Factcheck · Audit des prémisses

Aucune affirmation factuelle vérifiable dans le prompt, couche non déclenchée. Le prompt ne désigne aucune ressource distante.

---

## Chapitre 5 — Premortem · Anticipation d'échec

Projeté dans trois semaines, le relecteur a été mis en service et la perte d'intention continue ; voici les 5 raisons les plus probables, de la plus à la moins probable. Chacune transforme un défaut du Ch3 en scénario.

1. **L'étude dit « oui, pertinent » sans mesure** (Ch3 n° 1 et 8). Mécanisme : sans critère, la réponse la plus naturelle d'un modèle est d'approuver l'idée de l'humain et de décrire un relecteur. L'humain reçoit un plaidoyer et le refuse comme le 01/09. Mitigation : critère chiffré et corpus imposés, verdict sur mesure.
2. **Le relecteur approuve tout** (Ch3 n° 5). Mécanisme : il reçoit l'historique de la session, adopte ses reformulations successives de l'intention, et juge l'étape conforme à la reformulation, pas à la demande. Mitigation : le relecteur reçoit l'intention citée mot pour mot et le livrable, et seulement eux ; l'option « il voit les traces » se mesure contre l'option aveugle.
3. **Le relecteur fait doublon avec S51 et la contre-expertise** (Ch3 n° 3). Mécanisme : un nouvel agent refait ce que le bloc 1 et son contrôle font déjà, en moins bien outillé ; deux signaux contradictoires sur le même point. Mitigation : section de non-recouvrement obligatoire, et option « renforcer l'existant » dans le jeu fermé.
4. **Le relecteur à chaque étape coûte trop et lasse** (Ch3 n° 4 et 7). Mécanisme : un avis à chaque tranche, dont une part de fausses alertes (l'étude du 13/10 mesurait 3 à 8 faux refus sur 18 textes pour un seul relecteur), et le pilot finit par ne plus les lire. Mitigation : mesurer les fausses alertes et le coût par placement ; comparer « à la fin » et « aux jalons » à « à chaque étape ».
5. **Le relecteur bloque une évolution décidée** (Ch3 n° 6). Mécanisme : l'humain a changé l'intention par une décision D-N ; le relecteur, ancré sur le premier message, signale une dérive. Mitigation : l'intention de référence est la dernière intention **validée**, avec la liste des décisions qui l'ont modifiée.

---

## Chapitre 6 — Wargame · Stress-test adversarial

Les trois attaques convergent : ce que l'étude doit trancher n'est pas « un relecteur ou non », mais **où il se place, ce qu'il voit et qui l'écoute**.

**L'utilisateur exigeant.** « Je veux une décision que je peux prendre en lisant une page : faut-il le faire, où, combien ça coûte, et qu'est-ce que je perds si je ne le fais pas. » Le prompt d'origine ne garantit rien de cela. Il manque un verdict unique et un plan de revue daté, que le gabarit d'étude impose s'il est nommé.

**L'expert du domaine.** Le motif connu est l'« évaluateur-optimiseur » (Anthropic, « Building effective agents », 2024-12-19) : un générateur et un évaluateur en boucle, efficace « when we have clear evaluation criteria ». Sans critère écrit, l'évaluateur n'évalue rien. L'expert ajoute la tension centrale du Ch3 n° 5 : Cognition demande de partager les traces complètes entre agents, alors que la mesure L99 du 16/10 montre qu'un relecteur sans contexte note plus juste. L'étude doit mesurer les deux, pas en choisir un par principe.

**Le contradicteur.** Un modèle peut répondre à la lettre de trois façons inutiles : un « oui, à chaque étape » appuyé sur des généralités ; un document de conception d'agent qui saute la question ; ou une liste d'avantages et d'inconvénients sans verdict. Le prompt réécrit ferme les trois : options fermées, mesure obligatoire, verdict unique.

La lentille de robustesse ne s'applique pas : le prompt n'est ni une consigne d'agent ni un gabarit réutilisable. En revanche, le relecteur que l'étude recommandera en sera un ; c'est pourquoi le prompt réécrit demande à l'étude de dire ce qu'il recevrait en entrée et ce qu'il ne doit jamais faire.

---

## Chapitre 7 — Deepthink · Implications profondes

Prompt one-shot, effets d'échelle non pertinents pour le prompt lui-même ; ceux du relecteur qu'il pourrait faire naître sont confiés à l'étude (coût par session, accoutumance aux alertes), au Ch8.

---

## Chapitre 8 — Synthèse et prompt réécrit

Le prompt réécrit garde la question posée, faut-il un relecteur et où, et la rend décidable par une mesure sur des cas réels. Chaque ajout se rattache à un défaut du Ch3.

**Score : 35 → 86 sur 100, projeté (non mesuré).** Le score d'arrivée est une estimation de l'auteur de l'analyse ; un relecteur aveugle l'a mesuré 6 à 12 points plus bas sur 5 prompts le 16/10/2026.

**Diagnostic en 3 lignes.**
- Force : une intention juste, alignée sur la loi n° 7, et un vrai besoin de regard tiers.
- Faiblesse : aucun critère de pertinence, ni définition d'étape, ni autorité, ni coût.
- Risque : une étude qui approuve l'idée sans la mesurer, et un relecteur qui refait l'existant.

### Prompt réécrit (prêt à coller)

```
Étude d'opportunité, dans le pilot digit-ai-factory : faut-il un relecteur critique qui garde
l'intention initiale d'une demande pendant son exécution, et si oui, où le placer ?

INTENTION (mot pour mot, la demande d'origine) : « étudie s'il serait pertinent d'avoir un
relecteur critique, à chaque étape ou à la fin, qui suit l'avancement des sujets, donne son avis
pour échanger avec les agents, et s'assurer qu'au fur et à mesure de l'avancement, on conserve
bien l'intention initiale du prompt. »
Ce que j'attends : pouvoir décider en lisant l'étude, sur des chiffres, et pas sur une opinion.

LIVRABLE
- Une étude au gabarit gabarits\ETUDE-OPPORTUNITE.md, déposée sous
  output\03-etudes\<AAAAMMJJ>-etude-opportunite-relecteur-d-intention.md (emplacement fixé par
  le gabarit), jugée par node oracles\oracle-etude-opportunite.mjs avant remise.
- Puis la restitution habituelle (gabarits\RESTITUTION.md). Rien n'est mis en service dans ce
  tour : ni hook, ni agent, ni oracle. L'étude recommande, je décide.

DÉFINITIONS À TENIR
- « Étape » : traiter séparément les 3 découpages réels — les étapes d'un run
  (references\ETAPES-RUN.md), les tranches d'une campagne d'agents, et la fin de tour d'une
  session. Dire pour chacun si un relecteur y a sa place.
- « Intention de référence » : la dernière intention VALIDÉE (citée mot pour mot), plus la liste
  des décisions humaines qui l'ont modifiée depuis. Une évolution décidée n'est pas une dérive.
- « Relecteur » : un agent distinct de l'auteur. Pour chaque option, dire ce qu'il reçoit
  (l'intention et le livrable seuls, ou aussi l'historique), ce qu'il rend (avis, alerte,
  blocage), et à qui (au pilot, qui arbitre ; jamais un échange direct avec un agent sans que
  le pilot le voie, sauf si l'étude mesure que ce canal est meilleur).

NON-RECOUVREMENT (section 2 du gabarit) — examiner au minimum, avec citation :
- le test rétro du bloc 1 des restitutions et son contrôle S51 (oracles\oracle-synthese.mjs) ;
- la doctrine ISTO (references\INTENTION.md) ;
- le skill contre-expertise ;
- l'étude du relecteur « lecteur visé » (output\03-etudes\20261013-etude-opportunite-juge-de-comprehension.md) ;
- le relecteur aveugle du mode boucle L99 (references\boucle.md du skill prompt-analyzer-l99) ;
- l'arbitre du skill la-boucle ;
- la section « Écarts à la lettre » du contrat d'agent de campagne (gabarits\AGENT-CAMPAGNE.md).
Une option qui renforce l'un d'eux est une option à part entière.

MESURE (le critère de « pertinent »)
- Corpus : au moins 4 dérives d'intention documentées dans la Factory (dont le refus du
  01/09/2026 décrit dans references\INTENTION.md, le cas du 13/08 « pour chaque liste » devenu
  « dès 8 lignes » cité dans gabarits\AGENT-CAMPAGNE.md, et le cas du 26/09 cité par TF-1391),
  et au moins autant de livrables acceptés sans reprise, pour mesurer les fausses alertes.
- Pour chaque option de placement : part des dérives détectées, part de fausses alertes, et coût
  en jetons par relecture, relevé par node scripts\relever-flotte.mjs.
- Comparer au moins 2 variantes du relecteur : aveugle (intention + livrable) et avec traces.
- Relecteurs lancés avec les agents nommés de la flotte (verificateur ou redacteur), jamais par
  l'agent générique.
- BUDGET : 24 relectures au plus. Au-delà, s'arrêter et me demander avant de dépenser.

OPTIONS (jeu fermé du gabarit : O0 (l'option qui ne change rien), puis O1 à O4 (les options réelles)) — au minimum :
- O0 ne rien faire (coût du statu quo chiffré sur le corpus) ;
- un relecteur à la fin seulement, avant la restitution ;
- un relecteur aux jalons (fin de conception, de design, avant mise en production ;
  fin de campagne) ;
- un relecteur à chaque étape ou tranche ;
- le renforcement d'un mécanisme existant (par exemple : le test rétro du bloc 1 jugé par un
  tiers au lieu de l'auteur).

INTERDITS
- Aucune écriture hors de output\03-etudes\, output\04-plans\ (restitution) et du dossier
  temporaire de la session.
- Aucun chiffre rapporté par un agent sans recompte à la source.
- Aucun verdict sans mesure : une option non mesurée se dit « non mesurée ».

CONTRAT DE SORTIE (je refuse l'étude si un point manque)
1. node oracles\oracle-etude-opportunite.mjs rend PASS (E1 à E10).
2. L'intention ci-dessus est citée mot pour mot.
3. Le non-recouvrement porte les 7 existants listés, chacun avec sa citation.
4. Chaque option porte : moment, entrées du relecteur, autorité, destinataire, taux de détection,
   taux de fausses alertes, coût par relecture, et ce qu'elle exclut.
5. Les 3 sens d'« étape » sont traités séparément.
6. Un verdict unique, un plan de revue daté, et le test rétro écrit jusqu'à l'intention.
7. 24 relectures au plus, leur compte et leurs jetons cités.

PROTOCOLE DE VÉRIFICATION DU LIVRABLE
- Oracle : oracle-etude-opportunite (forme et sections), puis relecture des 7 points du contrat.
- Cas d'essai : la dérive du 01/09 doit être détectée par l'option retenue ; un livrable accepté
  sans reprise ne doit pas l'être (cas limite des fausses alertes).
- Boucle bornée : produire, juger, corriger, 3 passes au plus ; au-delà, remettre avec la liste
  des écarts restants.
```

### Contrat de sortie, en clair

Le prompt réécrit l'embarque déjà ; voici ses 7 critères résumés : oracle de l'étude au vert ; intention citée mot pour mot ; 7 existants examinés avec citation ; chaque option chiffrée (détection, fausses alertes, coût) avec ses entrées, son autorité et son destinataire ; 3 sens d'« étape » traités ; verdict unique et revue datée ; 24 relectures au plus, comptées.

### Protocole de tests du livrable

Le livrable est un document : l'oracle `oracle-etude-opportunite` juge sa forme, le contrat chiffré juge son fond, et deux cas d'essai tirés du corpus jugent la mesure (une vraie dérive détectée, un livrable sain non signalé). La boucle de correction est bornée à 3 passes.

### Changelog tracé

Chaque modification se rattache à un défaut du Ch3 ou à une cause du Ch5. Comment lire le tableau : une ligne par ajout du prompt réécrit, avec le défaut qu'il ferme.

| Ajout | Défaut fermé |
|---|---|
| Section MESURE, corpus et 3 taux | Ch3 n° 1 (bloquant) et n° 8 ; Ch5 n° 1 |
| Définition des 3 sens d'« étape » | Ch3 n° 2 |
| Section NON-RECOUVREMENT et option « renforcer l'existant » | Ch3 n° 3 ; Ch5 n° 3 |
| Pour chaque option : autorité et destinataire | Ch3 n° 4 et n° 9 ; Ch2, ruptures 1 et 3 |
| Variantes aveugle et avec traces | Ch3 n° 5 ; Ch5 n° 2 ; Ch6, l'expert |
| « Intention de référence » validée et décisions qui la modifient | Ch3 n° 6 ; Ch5 n° 5 ; Ch2, rupture 2 |
| Budget de 24 relectures et coût par relecture | Ch3 n° 7 ; Ch5 n° 4 |
| Livrable, emplacement et oracle nommés | Ch3 n° 10 |
| Rien en service dans ce tour | Loi n° 5 ; Ch6, l'utilisateur exigeant |

### Écarts à la lettre

Chaque endroit où le prompt réécrit s'écarte de votre texte, à valider poste par poste. Comment lire le tableau : une ligne par écart, avec ce que vous avez écrit, ce que je propose, pourquoi, et sa catégorie. « Manière d'exécuter » change la façon de faire l'étude ; « contenu visible ajouté » changerait ce que vous lirez sans l'avoir demandé.

| Vous avez écrit | Je propose | Pourquoi | Catégorie |
|---|---|---|---|
| « étudie s'il serait pertinent » | Une étude d'opportunité au gabarit, mesurée sur un corpus | Sans mesure, « pertinent » n'a pas de réponse jugeable | Manière d'exécuter |
| « à chaque étape ou à la fin » | 4 placements comparés, dont « aux jalons » et « renforcer l'existant » | Les deux placements cités ne sont pas les seuls possibles | Manière d'exécuter |
| « donne son avis pour échanger avec les agents » | Il rend son avis au pilot, qui arbitre ; l'échange direct n'est retenu que si la mesure le justifie | Le pilot est le seul arbitre ; un échange direct crée des décisions contradictoires | Manière d'exécuter |
| « s'assurer qu'[…] on conserve bien l'intention » | Mesurer s'il détecte les dérives, et dire son autorité (avis, alerte ou blocage) | Un avis n'assure rien ; c'est un adoucissement de « s'assurer », que je vous soumets | Manière d'exécuter |
| (non écrit) | Un budget de 24 relectures | L'étude dépense des appels de modèle ; la dépense vous revient | Manière d'exécuter |

Aucun contenu visible ajouté : les sections que l'étude montrera sont celles du gabarit que la Factory impose à toute étude.
