---
destinataire: humain
---

# Synthèse L99 — le prompt « relecteur critique qui garde l'intention » est analysé et réécrit en étude mesurée sur des dérives réelles (18/10/2026)

## 0. Synthèse d'ouverture

Votre idée est juste, mais votre prompt ferait produire une opinion et non une décision. Il ne dit pas ce qui rendrait le relecteur « pertinent », ni quelle « étape » il surveille, ni qui tranche quand il n'est pas d'accord. Il ignore aussi 7 mécanismes de la Factory qui couvrent déjà une partie du besoin. Et il demande au relecteur de « s'assurer » de l'intention, alors qu'il ne lui donne qu'un rôle d'avis. Le prompt réécrit garde votre question et la rend décidable. L'étude mesurera chaque placement possible sur des dérives d'intention déjà vécues : combien elle en détecte, combien de fausses alertes, et pour quel coût. Une décision vous revient, D-21 : lancer l'étude avec ce prompt.

## 1. En-tête d'identification

Analyse L99 (les 8 couches du skill `prompt-analyzer-l99`) du prompt « étudie s'il serait pertinent d'avoir un relecteur critique… », reçu le 18/10/2026. Pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 18/10/2026, de 08:47 à 08:58, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; aucun agent délégué ; escalade de modèle : aucune.

Intention de la demande : obtenir un prompt qui, une fois lancé, dise s'il faut un relecteur tiers pour garder l'intention initiale d'une demande, et où le placer.

Test rétro : le résultat sert cette intention. Le prompt réécrit pose la même question et y ajoute ce qui la rend décidable : critère mesuré, corpus de dérives réelles, options comparées et budget borné. Ses 5 écarts à votre texte sont listés pour validation.

## 2. Verdict en une ligne

Score 35 sur 100 au départ, plafonné par 1 défaut bloquant (« pertinent » sans critère) ; 86 sur 100 projeté pour le prompt réécrit, non mesuré ; 10 défauts relevés, dont 7 majeurs, tous fermés par le prompt réécrit.

## 3. Décisions attendues

1 décision neuve, au format B. Elle se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-21 — Faut-il lancer l'étude du relecteur d'intention avec le prompt réécrit et son budget de 24 relectures ?**
>
> - **De quoi s'agit-il** : l'étude qui dira s'il faut un agent distinct de l'auteur pour vérifier qu'un travail garde l'intention de votre demande, et à quel moment le placer (à la fin, aux jalons, à chaque étape, ou en renforçant un contrôle existant).
> - **Le problème** : lancée avec votre prompt d'origine, l'étude n'aurait aucun critère de réussite et approuverait probablement l'idée sans la mesurer. Avec le prompt réécrit, elle mesure sur des cas réels, ce qui dépense jusqu'à 24 relectures par des agents.
> - **Pourquoi vous** : la dépense d'appels de modèle vous revient, et les 5 écarts du prompt réécrit à votre texte demandent votre accord.
> - **Recommandation : (a)** — le prompt réécrit ferme le défaut bloquant et les 7 défauts majeurs relevés. Source consultée : `output/03-etudes/20261018-L99-relecteur-critique-d-intention.md`, chapitres 3 et 8 ; le refus du 01/09/2026 d'une étude sans mesure, décrit dans `references/INTENTION.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Lancer avec le prompt réécrit, ses 5 écarts acceptés | L'étude mesure chaque placement sur au moins 8 cas, puis rend un verdict chiffré ; rien n'est mis en service | Moyen × court, 24 relectures au plus | Possible : une étude ne change rien en service |
| (b) Lancer avec votre prompt d'origine | L'étude rend un avis argumenté, sans mesure | Simple × court | Possible |
| (c) Ne pas lancer pour l'instant | Le prompt réécrit reste prêt dans l'analyse | Nul | Sans objet |

> **Sans réponse** : (c), l'étude n'est pas lancée.

## 4. Traité

Chaque élément de l'analyse, avec ce qui le prouve.

- **Analyse en 8 couches.** Le fichier porte les 8 chapitres, du cadrage noté au prompt réécrit. Preuve : `output/03-etudes/20261018-L99-relecteur-critique-d-intention.md`, accepté par le contrôle d'écriture des documents.
- **Existant vérifié dans le dépôt.** Les 7 mécanismes que le prompt réécrit fait examiner existent : la règle S51 (le bloc 1 dit l'intention et son test rétro) dans `oracles/oracle-synthese.mjs` (ligne 109), `references/INTENTION.md`, les skills `contre-expertise` et `la-boucle`, l'étude `output/03-etudes/20261013-etude-opportunite-juge-de-comprehension.md`, `references/boucle.md` du skill L99, et la section « Écarts à la lettre » de `gabarits/AGENT-CAMPAGNE.md`. Preuve : lecture des fichiers ce jour.
- **Corpus de dérives disponible.** Le refus du 01/09/2026 est décrit dans `references/INTENTION.md`, section « Le fait fondateur ». Le cas du 13/08 (« pour chaque liste » devenu « dès 8 lignes ») est cité dans `gabarits/AGENT-CAMPAGNE.md`. Le cas du 26/09 est cité par TF-1391 dans le skill L99.
- **Écarts à la lettre.** 5 écarts, tous de la catégorie « manière d'exécuter », et aucun contenu visible ajouté. Le plus notable : « s'assurer » devient « mesurer s'il détecte », parce qu'un avis ne peut rien assurer.

## 5. Non traité

- **L'étude elle-même.** Motif : votre demande était d'améliorer le prompt ; son lancement attend D-21.
- **La mesure du score du prompt réécrit par un relecteur aveugle.** Motif : hors du niveau L99 simple ; le score de 86 reste une projection, que ce relecteur a trouvée trop haute de 6 à 12 points sur 5 prompts le 16/10/2026.

## 6. Écarts à la lettre

Les écarts du prompt réécrit à votre texte, à valider avec D-21.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « étudie s'il serait pertinent » | Une étude au gabarit de la Factory, mesurée sur un corpus | Sans mesure, « pertinent » n'a pas de réponse qu'on peut juger |
| « à chaque étape ou à la fin » | 4 placements comparés, dont « aux jalons » et « renforcer un contrôle existant » | Les 2 placements cités ne sont pas les seuls possibles |
| « donne son avis pour échanger avec les agents » | Il rend son avis au pilot, qui arbitre ; un échange direct n'est retenu que si la mesure le justifie | Le pilot est le seul arbitre, et des agents qui se répondent sans lui prennent des décisions contradictoires |
| « s'assurer qu'on conserve bien l'intention » | Mesurer s'il détecte les dérives, et dire son autorité : avis, alerte ou blocage | Un avis n'assure rien : c'est un adoucissement de votre texte, que je vous soumets |
| Aucun budget | 24 relectures au plus, puis arrêt et question | L'étude dépense des appels de modèle |

## 7. Risques

- **L'étude ne trouve pas assez de cas de dérive.**
  - Énoncé : 3 dérives sont documentées et le prompt en exige 4.
  - Signal : l'étude déclare son corpus incomplet.
  - Parade : le prompt interdit un verdict sans mesure ; une option non mesurée se dit « non mesurée ».
- **Le relecteur mesuré dans l'étude approuve tout.**
  - Énoncé : avec l'historique de la session, il adopte les reformulations de l'auteur.
  - Signal : un taux de détection proche de zéro pour la variante « avec traces ».
  - Parade : la variante aveugle est mesurée à côté.

## 8. Prochaines actions

Ordre : le geste de l'IA d'abord, votre décision ensuite, parce que ce geste attend cette décision et se lit avec elle.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Lancer l'étude avec le prompt réécrit | auto_ia | dependance_bloc_3 : attend D-21 | Le prompt est dans l'analyse, chapitre 8 ; il se lance dans une session neuve | La question du relecteur reste ouverte |
| **A-2** | `neuve` | Trancher D-21 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `21a` | L'option (c) s'applique |

## 9. Traces

- Analyse : `output/03-etudes/20261018-L99-relecteur-critique-d-intention.md`
- Skill : `prompt-analyzer-l99`, `references/couches.md`
- Rien n'est enregistré ni poussé.

## Annexe — le prompt réécrit, prêt à coller

Le prompt ci-dessous est celui du chapitre 8 de l'analyse, recopié tel quel ; il se colle dans une session neuve du pilot.

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
