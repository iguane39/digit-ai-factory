---
destinataire: humain
---

# Revue — prompt « aide aux nouveaux utilisateurs de la Factory » passé au crible L99, 21/11/2026

Analyse en 8 couches (skill `prompt-analyzer-l99`, niveau L99, mode simple) de la demande du porteur, reçue le 21/11/2026 :

> Comment pourrait-on mettre en place une aide pour les nouveaux utilisateurs de la Factory, qui connaisse Claude Code mais qui doivent avoir à se servir de la Factory pour leurs nouveaux projets et gagner en productivité rapidement. Propose un système simple, intuitif, progressif, ludique, pertinent, apportant de la productivité rapidement, adapté à leurs contextes et leurs projets.

Ce qui a été lu pour ancrer l'analyse, en lecture seule, au pilot (commit 626b12e2) : `README.md` (section « Démarrer un produit »), `references/ACCUEIL.md`, `references/NIVEAUX.md`, `references/RUN-CONSEIL.md`, la liste de `profils/` et de `catalogues/`, le relevé d'ouverture de la session.

---

## Chapitre 1 — OODA : cadrage stratégique et étalon noté

L'intention est nette et mérite d'être servie : réduire le temps entre « je connais Claude Code » et « je produis vite avec la Factory ». Mais le prompt demande un système sans dire qu'il en existe déjà la moitié, et ses six adjectifs sont tous des qualités, aucun n'est un critère. Il vaut 30 sur 100.

**Observe.** Le prompt porte une question (« Comment pourrait-on mettre en place une aide ») et une commande (« Propose un système »). Il nomme une population : des utilisateurs « qui connaisse[nt] Claude Code » mais découvrent la Factory, pour « leurs nouveaux projets ». Il pose un objectif, « gagner en productivité rapidement », répété deux fois. Il exige six qualités : « simple, intuitif, progressif, ludique, pertinent », « adapté à leurs contextes et leurs projets ». Il ne dit ni la forme du livrable, ni sa longueur, ni ce qu'il ne faut pas faire, ni comment on saura que le système marche.

**Orient.** Le prompt est écrit par le porteur de la Factory, qui connaît la doctrine de l'intérieur ; le destinataire est une session Claude Code ouverte au pilot. L'objectif profond n'est pas « une aide » mais une **adoption** : que d'autres que le porteur obtiennent de la Factory ce qu'il en obtient, sans passer par lui. Le contexte réel compte trois faits que le prompt tait :

- l'entrée existe déjà : une phrase d'usage unique, un installateur sans question, le skill `accueil-factory` et le protocole en 7 étapes de `references/ACCUEIL.md` ;
- la matière d'adaptation existe aussi : 8 profils produit (`profils/LISEZMOI.md`), 112 entrées de catalogue (`catalogues/catalogue.jsonl`), 54 skills installés (relevé d'ouverture du 21/11/2026) ;
- la friction principale d'un nouveau venu est mesurée ailleurs : du 19 au 26/10/2026, le journal des hooks compte 85 refus au premier passage (`references/NIVEAUX.md`, section « Le fait »), et l'œil critique du 29/10 attribue 54 refus sur 67 à des réponses non préjugées (relevé d'ouverture, section « Œil critique »). Un utilisateur qui connaît Claude Code ne connaît pas ces gates.

**Decide.** Trois stratégies sont possibles :

1. *Concevoir à neuf* un système d'onboarding complet. Risque : doublonner l'accueil existant.
2. *Partir de l'existant*, mesurer où un nouveau venu décroche, et proposer la couche qui manque au-dessus de l'accueil actuel.
3. *Construire tout de suite* un skill de tutorat. Risque : sortir du verbe « propose », que la discipline de périmètre du porteur interdit de dépasser.

**Act.** La stratégie 2, menée en **run de conseil** (`references/RUN-CONSEIL.md`, livrable = trajectoire de lots dont chaque lot validé devient l'entrant d'un run de construction), est la seule qui sert l'intention sans réinventer ni dépasser le mandat.

**Étalon.** Le prompt idéal pour cette intention :

- dit la population visée et le sens de « nouveau projet » (produit neuf, produit existant, mandat transverse) ;
- impose l'inventaire de l'existant d'accueil et de ses frictions mesurées avant toute proposition ;
- traduit chaque adjectif en un critère binaire ou chiffré, figé avant la comparaison des options ;
- demande plusieurs options comparées, une recommandée, un premier lot minimal livrable en un run ;
- pose les garde-fous : ne rien construire, ne pas recopier la doctrine, ne pas contourner les gates ;
- nomme le livrable selon les règles de nommage du pilot et l'oracle qui le juge.

Le tableau qui suit note le prompt d'origine contre cet étalon. Il se lit ligne par ligne : chaque dimension a son plafond, la note obtenue et la raison en une ligne ; le total est le score de référence repris au chapitre 8.

| Dimension | Plafond | Note | Raison |
|---|---|---|---|
| Clarté de l'intention | 20 | 12 | Le but (aide à l'adoption, productivité) est clair ; la forme de « l'aide » et la question « comment » contre « propose » restent ouvertes. |
| Spécification | 20 | 4 | Aucun format, aucune longueur, aucune structure, aucune population définie au-delà de « connaît Claude Code ». |
| Garde-fous et contraintes | 15 | 2 | Rien sur ce qu'il ne faut pas faire : construire, publier, doublonner, contourner les hooks. |
| Ancrage et contexte | 15 | 4 | La Factory et Claude Code sont nommés ; aucune référence à l'accueil, aux profils ni aux catalogues existants. |
| Vérifiabilité de la sortie | 15 | 2 | Six adjectifs subjectifs, aucun critère ; « productivité » sans mesure ni point de départ. |
| Robustesse | 15 | 6 | Le verbe « propose » borne le geste, mais « ludique » et « adapté » ouvrent la porte au gadget et à la personnalisation sans fin. |
| **Total** | **100** | **30** | |

---

## Chapitre 2 — Chainlogic : dépendances et collisions entre consignes

Le prompt n'a pas de chaîne d'étapes interne : une question, puis une commande. Ce qu'il porte en revanche, ce sont trois collisions entre ses propres exigences, qu'une session tranchera en silence si le prompt ne les arbitre pas.

- **« Simple » contre « adapté à leurs contextes et leurs projets ».** Chaque dimension d'adaptation ajoute une branche au parcours. Sans règle, la session produira soit un parcours unique (simple mais non adapté), soit une arborescence de cas (adaptée mais complexe). L'arbitrage attendu : un seul parcours dont les *contenus* se dérivent du projet détecté.
- **« Progressif » contre « productivité rapidement ».** Une progression longue retarde le premier gain. L'arbitrage attendu : le premier palier doit déjà produire un livrable utile du vrai projet, pas un exercice.
- **« Ludique » contre la doctrine de la Factory.** La loi transverse 6 (« un rendu générique est un défaut ») et la loi 1 (« toute affordance est câblée ou n'existe pas ») excluent des points ou badges décoratifs. L'arbitrage attendu : le ludique se mesure à la progression visible, et chaque récompense est la trace d'un verdict d'oracle réel.
- **Ordre implicite non dit.** « Comment pourrait-on » appelle d'abord un diagnostic, « Propose » une solution ; le prompt ne dit pas que la première doit précéder la seconde.

---

## Chapitre 3 — Blindspots : inventaire maître des défauts

Ce chapitre est la liste de référence : chaque défaut y figure une fois, avec sa sévérité, et le chapitre 8 en clôture chacun. Aucun défaut n'est bloquant (le prompt produira une proposition exploitable), mais quatre majeurs font qu'elle risque d'être redondante, invérifiable ou mal ciblée.

Le tableau se lit dans l'ordre des numéros, qui sont repris au changelog du chapitre 8 sous la forme « Ch3 #n » (défaut n de cet inventaire). Sévérité : **bloquant** (le prompt échoue), **majeur** (il marche mais le résultat est fortement dégradé), **mineur** (marginal).

| # | Défaut | Sévérité |
|---|---|---|
| 1 | L'existant d'accueil n'est pas mentionné : phrase d'usage, installateur, skill `accueil-factory`, protocole de 7 étapes, 8 profils, catalogues. Une session neuve risque de proposer ce qui existe. | majeur |
| 2 | Les six qualités demandées ne sont pas mesurables ; la sortie ne peut pas être jugée, et « ludique » sera rendu par des gadgets. | majeur |
| 3 | La population est floue : quel rôle (développeur, consultant, porteur de produit), quel poste, quelle expérience de git, de node, de la ligne de commande ; et « nouveaux projets » ne distingue pas produit neuf, produit existant et mandat (audit, SEO, conseil). | majeur |
| 4 | La productivité n'a ni mesure ni point de départ : rien ne dit ce qu'on chronomètre (délai jusqu'au premier livrable jugé vert ? nombre de refus de hook en première session ?) ni d'où vient la valeur initiale. | majeur |
| 5 | Aucun garde-fou de périmètre : rien n'interdit à la session de passer de la proposition à la construction d'un skill ou d'un hook, ce que la règle de périmètre du porteur exclut pour un verbe « propose ». | majeur |
| 6 | La friction réelle d'un utilisateur de Claude Code arrivant à la Factory n'est pas nommée : les gates de fin de tour (restitution en blocs, préjugement), les hooks d'ouverture bloquants, le lexique d'appel des skills. C'est là que la productivité se perd, pas dans la découverte des commandes. | majeur |
| 7 | Le livrable n'a ni forme, ni nom, ni emplacement, ni oracle. | majeur |
| 8 | Le ludique n'est pas cadré par la doctrine (lois 1 et 6) : risque de récompenses sans preuve. | mineur |
| 9 | Aucune contrainte sur la maintenance : une aide qui recopie la doctrine se périme à chaque version (le garde-fou d'`ACCUEIL.md` dit que les spécificités vivent dans les références, jamais recopiées). | mineur |
| 10 | Grammaire : « qui connaisse » pour « qui connaissent », « doivent avoir à se servir » ; sans effet sur le sens. | mineur |
| 11 | Biais probable de l'auteur (malédiction du savoir) : le porteur ne voit plus les étapes qui lui sont devenues évidentes ; le prompt devrait faire chercher ces étapes dans les traces plutôt que dans sa mémoire. | mineur |

---

## Chapitre 4 — Factcheck : audit des prémisses

Le prompt n'affirme rien de chiffré, mais il porte deux prémisses implicites qu'on peut confronter au dépôt ; l'une est partiellement fausse et a été remontée au chapitre 3.

Le tableau se lit par prémisse : ce que le prompt tient pour vrai, le verdict contre le dépôt, et la preuve.

| Prémisse implicite | Verdict | Preuve |
|---|---|---|
| Il n'existe pas encore d'aide pour les nouveaux utilisateurs. | partiellement faux | `README.md` : « La phrase suffit à tout nouvel utilisateur » ; `references/ACCUEIL.md` : protocole en 7 étapes ; skill `accueil-factory` installé. Ce qui manque, c'est l'aide **après** l'accueil, pendant les premières sessions. Remonté en Ch3 #1, sévérité maintenue à majeur : l'existant est incomplet, pas absent. |
| Les nouveaux utilisateurs connaissent Claude Code. | invérifiable ici | Hypothèse de population à poser comme telle dans le prompt réécrit ; remontée en Ch3 #3. |

Aucune ressource distante n'est désignée par le prompt : pas de prémisse d'accès à mesurer.

---

## Chapitre 5 — Premortem : pourquoi la proposition décevrait

On se place après coup : la proposition a été rendue, et elle n'a rien changé pour les nouveaux venus. Voici les cinq causes les plus probables, de la plus à la moins probable, chacune projetée depuis l'inventaire.

1. **La proposition réinvente l'accueil** (escalade de Ch3 #1). La session conçoit une « commande de démarrage » et un « guide de bienvenue » qui existent sous un autre nom. *Mécanisme* : sans inventaire imposé, le modèle part de sa culture générale de l'onboarding. *Mitigation* : étape 0 obligatoire d'inventaire, et règle « chaque brique proposée dit si elle s'ajoute à l'existant, le remplace ou s'y raccorde ».
2. **Un système ludique décoratif** (escalade de Ch3 #2 et #8). Niveaux, badges et points qui ne correspondent à aucune preuve ; abandonnés au bout d'une semaine. *Mitigation* : chaque palier a un critère de passage lu dans une trace existante (verdict d'oracle, ledger, registre).
3. **Le parcours ignore la vraie friction** (escalade de Ch3 #6). Le nouveau venu apprend les forges mais se heurte aux refus de hook de fin de tour sans comprendre pourquoi ; la productivité ne monte pas. *Mitigation* : le prompt fait partir le diagnostic des frictions mesurées (journal des hooks, œil critique), en comptes et sans aucun nom.
4. **La proposition dérape en construction** (escalade de Ch3 #5). La session écrit un skill, un hook, l'enregistre et le publie. *Mitigation* : interdit explicite, livrable unique en document, fin sur une question de mandat.
5. **Personnalisation sans fond** (escalade de Ch3 #3). « Adapté au contexte » devient un questionnaire d'accueil de dix questions, contraire à la règle « l'installation ne pose aucune question » d'`ACCUEIL.md`. *Mitigation* : l'adaptation se *détecte* depuis le dossier du projet et les profils existants, elle ne se demande pas ; une question au plus, seulement si la réponse change le parcours.

---

## Chapitre 6 — Wargame : trois attaques contre l'étalon

Les trois attaques ci-dessous visent la direction de réécriture, pas le prompt d'origine ; deux d'entre elles l'ont amendée.

**L'utilisateur exigeant.** « Je veux savoir quoi faire dans les dix premières minutes, sur mon projet, pas lire un plan à cinq lots. » L'étalon doit donc exiger, en tête du livrable, le *premier geste* recommandé et ce qu'il rapporte, avant toute trajectoire. Amendement repris au prompt réécrit (section « Ce que le livrable contient », point 1).

**L'expert de l'onboarding.** Il relèverait trois erreurs classiques : mesurer la complétion du parcours au lieu du résultat (*time to first value*) ; confondre aide juste-à-temps et documentation ; ignorer la sortie du parcours (le moment où l'aide doit se taire). L'étalon intègre les trois : l'indicateur principal est le délai jusqu'au premier livrable jugé vert sur le vrai projet ; l'aide intervient au moment d'un blocage (un refus de hook, un oracle rouge) ; chaque palier dit quand l'aide s'efface.

**Le contradicteur.** La conformité littérale paresseuse consisterait à rendre six paragraphes, un par adjectif, chacun affirmant que le système « est simple », « est ludique ». Parade : la rubrique est figée avant la génération des options, chaque critère est binaire ou chiffré, et l'option recommandée est notée contre elle dans un tableau. Seconde ruse : proposer un système qui suppose un composant inexistant (un tableau de bord hébergé, un service tiers). Parade : la loi transverse 1 et l'interdit de publication obligent chaque brique à dire sur quoi elle se câble dans le dépôt.

Lentille robustesse non déclenchée : le prompt est une demande ponctuelle, pas un prompt système ni un gabarit réutilisable.

---

## Chapitre 7 — Deepthink

Prompt ponctuel : effets d'échelle non pertinents pour le prompt lui-même. Le *système* qu'il fera proposer, lui, sera vu par chaque nouvel utilisateur ; c'est pourquoi le prompt réécrit exige une section maintenance (Ch3 #9).

---

## Chapitre 8 — Synthèse et prompt réécrit

Le prompt passe de 30 à 82 sur 100, score **projeté (non mesuré)** : c'est l'estimation de l'auteur de l'analyse, et des réécritures relues à l'aveugle le 16/10/2026 valaient de 6 à 12 points de moins que projeté (`SKILL.md` du skill, section « Niveaux »). Le mode boucle, qui ferait mesurer ce score par des relecteurs aveugles, n'a pas été ouvert : le prompt réécrit lance un run de conseil qui n'écrit qu'un document, il ne sera pas réutilisé comme gabarit, et l'analyse n'a relevé aucun défaut bloquant. Dites « L99 boucle » pour le mesurer.

### Score

Le tableau se lit comme celui du chapitre 1 : une ligne par dimension, avant et après réécriture ; la colonne « après » est projetée.

| Dimension | Plafond | Avant | Après (projeté) |
|---|---|---|---|
| Clarté de l'intention | 20 | 12 | 18 |
| Spécification | 20 | 4 | 16 |
| Garde-fous et contraintes | 15 | 2 | 13 |
| Ancrage et contexte | 15 | 4 | 13 |
| Vérifiabilité de la sortie | 15 | 2 | 12 |
| Robustesse | 15 | 6 | 10 |
| **Total** | **100** | **30** | **82** |

### Diagnostic en 3 lignes

- Force : une intention juste et un verbe (« propose ») qui borne déjà le geste.
- Faiblesse : six qualités sans un seul critère, une population non définie, une productivité sans mesure.
- Angle mort principal : l'accueil existe déjà ; ce qui manque est l'aide des premières sessions, là où les gates de la Factory surprennent un habitué de Claude Code.

### Prompt réécrit (prêt à coller dans une session ouverte au pilot `digit-ai-factory`)

```text
Run de conseil (references/RUN-CONSEIL.md) au pilot digit-ai-factory. Livrable : une proposition, rien d'autre.

INTENTION
Qu'un utilisateur qui maîtrise déjà Claude Code (sessions, CLAUDE.md, skills, hooks, agents) mais découvre
la Factory obtienne, dès sa première session sur SON projet, un premier livrable utile jugé vert par un
oracle, puis gagne en autonomie par paliers, sans avoir à lire la doctrine d'abord.

POPULATION (hypothèse par défaut, à déclarer comme telle dans le livrable)
Développeurs ou consultants à l'aise avec git, node et la ligne de commande, sous Windows ou macOS, qui
arrivent avec l'une de trois situations : produit neuf, produit existant à faire évoluer, mandat transverse
(audit, SEO-GEO, conseil). Si une trace du dépôt contredit cette hypothèse, la corriger et dire laquelle.

ÉTAPE 0 — L'EXISTANT ET SES FRICTIONS, AVANT TOUTE PROPOSITION
1. Inventorier ce qui sert déjà l'accueil : README.md (section « Démarrer un produit »), les installateurs,
   le skill accueil-factory, references/ACCUEIL.md (7 étapes), references/NIVEAUX.md, PROMPT-PRODUIT.md,
   profils/ (profils produit), catalogues/CATALOGUES.md, le hook de lexique (appels de skill), le skill
   explique. Pour chaque pièce : ce qu'elle couvre, à quel moment du parcours, ce qu'elle laisse au
   nouveau venu.
2. Mesurer où un nouveau venu perd du temps, à partir des traces du dépôt et du poste : refus de hook au
   premier passage (journal des hooks, references/NIVEAUX.md), constats de l'œil critique, lots de retours
   des produits. Comptes et classes de friction seulement : aucun nom de personne ni de produit réel.
   Chaque chiffre porte sa source et sa date ; ce qui n'est pas mesurable se dit « non mesuré ».

RUBRIQUE, FIGÉE AVANT LES OPTIONS (chaque critère binaire ou chiffré)
- Simple : une seule phrase ou commande pour entrer ; aucune lecture de doctrine requise avant le premier livrable.
- Intuitif : à tout moment, l'aide sait dire en une phrase la prochaine action et pourquoi.
- Progressif : 5 paliers au plus, chacun avec un critère de passage lu dans une trace existante
  (verdict d'oracle, ledger, registre), jamais déclaratif.
- Ludique : la progression est visible (palier atteint, prochain palier, ce qu'il débloque) ; aucune
  récompense qui ne soit la trace d'un verdict réel (lois transverses 1 et 6 du CLAUDE.md).
- Pertinent et adapté : le parcours se dérive de l'état détecté du projet (situation, profil produit,
  forges mobilisées), sans questionnaire ; une question au plus, seulement si la réponse change le parcours.
- Productivité rapide : indicateur principal = délai entre l'ouverture de la première session et le premier
  livrable jugé vert sur le vrai projet ; indicateur secondaire = refus de hook par session sur les 5
  premières sessions. Donner la valeur de départ si elle se mesure, sinon dire comment la mesurer.

CE QUE LE LIVRABLE CONTIENT, DANS CET ORDRE
1. En tête, en 5 lignes au plus : le premier geste recommandé à un nouveau venu et ce qu'il rapporte.
2. L'existant et les frictions mesurées (étape 0).
3. La rubrique ci-dessus, recopiée telle quelle.
4. Trois options divergentes sur un axe nommé (par exemple : où vit l'aide — dans un skill que l'on
   appelle, dans les hooks au moment d'un blocage, dans un projet d'entraînement), notées contre la
   rubrique dans un tableau, et la recommandée.
5. Le système recommandé, palier par palier : ce que fait l'utilisateur, ce que fait l'aide, le critère
   de passage et sa trace, le moment où l'aide s'efface ; et pour chaque brique, si elle s'ajoute à
   l'existant, le remplace ou s'y raccorde, et sur quel fichier du dépôt elle se câble.
6. Le lot minimal constructible en un seul run, puis les lots suivants (trajectoire de RUN-CONSEIL.md).
7. La maintenance : l'aide renvoie aux références, elle ne recopie jamais la doctrine ; ce qui la périme.
8. Les risques et les décisions qui reviennent à l'humain.

GARDE-FOUS
- Ne rien construire, enregistrer, pousser ni publier : ni skill, ni hook, ni page. Le livrable est un
  document ; chaque lot ne devient un run de construction que sur décision humaine.
- Ne contourner ni n'assouplir aucune gate (restitution, préjugement, oracles) : l'aide explique les gates,
  elle ne les fait pas sauter.
- Aucune API tierce payante, aucun service hébergé.
- Ne pas doublonner accueil-factory ni ACCUEIL.md : s'y raccorder, ou dire pourquoi pas.

LIVRABLE
Un fichier Markdown sous output/03-etudes/, nommé selon R-4 (le projet ouvre le nom) et R-25 (le type,
pris au registre des types, est le premier mot du 2e segment) :
« Digit-AI - Étude - Parcours d accueil des nouveaux utilisateurs - 20261121<indice>.md »,
indice alloué par node scripts/allouer-indice.mjs (portée dossier).
Avant remise : oracle-livrable-conseil.mjs (LC1-LC6) et check_markdown.py (règles M7, M10, M14, M18 du
socle digit-ai-page-html) à exit 0, corrections bornées à 3 passes, écarts résiduels listés au-delà.

FIN DU TOUR
Restitution selon gabarits/RESTITUTION.md, puis une seule question : « Je lance le lot minimal en run de
construction ? (oui / corriger) ». Ne rien enchaîner avant la réponse.
```

### Contrat de sortie

La proposition produite par ce prompt est acceptable si, et seulement si :

- elle ouvre par le premier geste recommandé, en 5 lignes au plus ;
- elle inventorie au moins les 8 pièces d'accueil nommées à l'étape 0, chacune avec ce qu'elle couvre et laisse ;
- chaque chiffre de friction porte sa source et sa date, et aucun nom de personne ni de produit réel n'y figure ;
- la rubrique précède les options et chacun de ses six critères est binaire ou chiffré ;
- trois options sont notées dans un tableau, une seule est recommandée ;
- le système recommandé a 5 paliers au plus, chacun avec un critère de passage lu dans une trace existante ;
- chaque brique dit si elle s'ajoute, remplace ou se raccorde, et sur quel fichier elle se câble ;
- un lot minimal constructible en un run est isolé ;
- aucun fichier n'est écrit hors du livrable, et le tour finit sur la question de mandat ;
- le nom suit R-4 et R-25 ; `oracle-livrable-conseil.mjs` et `check_markdown.py` rendent exit 0.

### Protocole de tests du livrable

Livrable de type document texte : contrôle par le contrat chiffré ci-dessus et par deux oracles exécutés.

- **Oracles** : `oracles/oracle-livrable-conseil.mjs` (LC1 à LC6, critères du livrable de conseil) ; `check_markdown.py` du socle `digit-ai-page-html` pour la forme. Aucun format de repli n'est prévu : le livrable est Markdown seul.
- **Jeu d'essai minimal** : relire la proposition contre trois cas, (a) un produit neuf de profil `webapp`, (b) un produit existant sans socle, (c) un mandat d'audit — cas limite, sans conception ni design ; chaque palier doit avoir un sens pour les trois, ou dire qu'il ne s'applique pas.
- **Boucle bornée** : générer, juger contre le contrat, corriger ; 3 passes au plus, puis remise avec les écarts résiduels.

### Changelog

Chaque ligne relie une modification du prompt réécrit au défaut qu'elle clôt. Les lignes suivent l'ordre de l'inventaire du chapitre 3 ; la colonne de droite renvoie à la source du défaut : « Ch3 #n » est le défaut n de l'inventaire, « Ch5 #n » la cause d'échec n du premortem, « Ch6 » l'une des trois attaques du wargame. Les mineurs #10 et #11 n'appellent pas de modification et sont exclus.

| Modification | Défaut clos |
|---|---|
| Étape 0 d'inventaire de l'existant, règle « s'ajoute, remplace ou se raccorde » | Ch3 #1, Ch5 #1, Ch4 prémisse 1 |
| Rubrique figée de six critères binaires ou chiffrés | Ch3 #2, Ch6 contradicteur |
| Population par défaut déclarée, trois situations nommées | Ch3 #3, Ch5 #5 |
| Indicateur principal et secondaire, valeur de départ ou méthode de mesure | Ch3 #4, Ch6 expert |
| Interdit de construire, fin sur question de mandat | Ch3 #5, Ch5 #4 |
| Frictions mesurées par les refus de hook et l'œil critique ; gates expliquées, jamais contournées | Ch3 #6, Ch5 #3 |
| Livrable nommé R-4 et R-25, emplacement, oracles | Ch3 #7 |
| Ludique adossé aux verdicts réels, lois 1 et 6 | Ch3 #8, Ch5 #2 |
| Section maintenance, renvoi aux références | Ch3 #9 |
| Premier geste en tête du livrable | Ch6 utilisateur exigeant |
| Adaptation détectée, une question au plus | Ch5 #5 |

### Écarts à la lettre

Le tableau se lit ligne par ligne : ce que la demande disait, ce que le prompt réécrit en fait, et pourquoi. Tous relèvent de la **manière d'exécuter** : aucun n'ajoute au livrable un contenu que la demande n'appelait pas, chaque section répondant à l'une de ses qualités.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « Comment pourrait-on… Propose un système » | Une proposition seule, aucune construction, fin sur une question | Le verbe « propose » borne le geste (règle de périmètre du porteur). |
| « simple, intuitif, progressif, ludique, pertinent » | Six critères binaires ou chiffrés, dont « 5 paliers au plus » | Sans critère, la proposition ne peut pas être jugée ; la borne de 5 est un choix de l'analyse, à corriger si elle ne vous convient pas. |
| « nouveaux utilisateurs… qui connaisse[nt] Claude Code » | Une population par défaut déclarée et trois situations | La demande ne précisait pas le rôle ni la situation. |
| « gagner en productivité rapidement » | Délai jusqu'au premier livrable vert, refus de hook sur 5 sessions | La productivité devient mesurable ; les deux indicateurs sont un choix de l'analyse. |
| « adapté à leurs contextes et leurs projets » | Adaptation détectée depuis le projet, une question au plus | Cohérent avec la règle d'`ACCUEIL.md` : l'installation ne pose aucune question. |
