---
lecteur: Sébastien, porteur de la Digit-AI Factory
objet: analyse L99 du prompt « Retravaille la cible avec tes remontées et propositions, plus mes remarques »
date: 2026-10-26
cible analysée: output/04-plans/Digit-AI - Synthese Mandat - Oeil critique T1 a T4 detaillees et catalogue - 20261026b.md, et le diagnostic 20261021a qu'elle amende
---

# Analyse L99 — retravailler la cible d'œil critique avec vos remarques (26/10/2026)

Le prompt analysé est votre message du 26/10/2026, après la synthèse 20261026b. Il accepte T2, accepte T1, T3, T4 et le catalogue A5 avec des amendements, et demande une cible retravaillée. Les deux amendements qui pèsent le plus sont ceux de T4 et A5 : vous voulez un contrôle de chaque forge et de chaque capacité à chaque demande, et vous rappelez qu'une capacité rarement utile reste due quand le produit la concerne. Ce second point contredit une règle de la cible actuelle, qui faisait redescendre une capacité restée silencieuse 30 jours.

## Chapitre 1 — OODA et étalon noté

Ce chapitre montre que l'intention est nette point par point, mais que le prompt ne dit ni quel document produire, ni comment tenir des contrôles exhaustifs sans rallonger chaque réponse. Le score de départ est 49 sur 100.

**Observe.** Cinq points, tous rattachés aux sections de la synthèse 20261026b :

- T1 (préférences et conventions client en un seul endroit, tri des retours en 3 voies) : « OK », avec 2 ajouts. Un contrôle qui dit si une remarque est générique et doit remonter à la Factory ; et le « forcing » : si vous demandez la remontée, elle se fait, au format des remontées, avec une question s'il manque une information.
- T2 (compte rendu allégé, blocage sur 2 motifs) : « OK ».
- T3 (cadrage en 3 lignes au tour 1) : « OK + le script de relecture », avec l'objectif « que les réponses construites et générées correspondent bien aux demandes initiales sans que j'aie à intervenir à nouveau, sauf sur des éléments supplémentaires ».
- T4 (carte type de demande → forges → livrables, verrou « livré ») : « OK, mais sans figer les forges attendues », des forges privilégiées et un contrôle argumenté de chaque forge à chaque demande, pour « ne jamais oublier une forge qui pourrait être pertinente ».
- A5 (catalogue de capacités à 3 états) : « même principe que T4 », un contrôle de chaque capacité, et la règle de fond : une capacité rare, comme celles de seo-geo, s'applique dès que le produit la concerne.

**Orient.** L'objectif profond est double : ne plus avoir à vous répéter, et ne jamais perdre une capacité de la Factory parce que la session ne l'a pas appelée. C'est le diagnostic D2 du 21/10 (les forges servent quand on les appelle, rien ne garantit qu'on les appelle), porté jusqu'aux capacités. Le destinataire est la session de ce pilot, qui a le contexte des synthèses 20261026a et 20261026b.

**Decide.** Trois stratégies possibles :

1. réécrire les sections touchées de la synthèse 20261026b et reposer ses décisions ;
2. produire une nouvelle version du diagnostic, 20261026a, qui remplace la version 20261021a pour les sections d, e, f et i, et y intègre le catalogue ;
3. consigner D-68 à D-70 comme tranchées avec amendements, puis lancer les campagnes.

**Act.** La stratégie 2 est recommandée. Le diagnostic est le document de référence de la chaîne b → c → 20261021a, et votre « OK » porte sur des amendements que vous n'avez pas encore lus rédigés. La stratégie 3 exécuterait des contrôles exhaustifs que personne n'a encore dimensionnés.

**Étalon.** Le prompt idéal nomme le document à produire et sa version, dit ce que deviennent D-68 à D-70, définit ce qu'est une remarque générique, dit où s'écrit l'argumentation par forge et par capacité, exige un mécanisme de contrôle qui ne dépend pas de la mémoire de la session, borne le coût de la relecture, et donne une mesure de « aucune forge oubliée ».

Comment lire le tableau : une ligne par dimension de la rubrique, la note obtenue sur le maximum, la raison en une phrase.

| Dimension | Note | Raison |
|---|---|---|
| Clarté de l'intention | 14/20 | chaque point est clair ; « la cible » ne nomme ni le document ni sa version |
| Spécification | 7/20 | ni format, ni livrable, ni sort des décisions D-68 à D-70 |
| Garde-fous et contraintes | 6/15 | aucun plafond de coût pour la relecture ni pour les contrôles exhaustifs |
| Ancrage et contexte | 11/15 | le contexte vient de la conversation ; la règle de rétrogradation contredite n'est pas citée |
| Vérifiabilité de la sortie | 5/15 | « ne jamais oublier une forge » n'a pas de mesure |
| Robustesse | 6/15 | les contrôles exhaustifs, lus à la lettre, rallongent chaque réponse |
| **Total** | **49/100** | aucun défaut bloquant |

## Chapitre 2 — Chainlogic

Le prompt enchaîne des amendements indépendants ; la chaîne logique utile est celle qui relie T3, T4 et A5. Si la session écrit au tour 1 ce qu'elle mobilise (T3), alors la carte de T4 peut lui proposer les forges privilégiées. Si chaque forge et chaque capacité porte une condition d'applicabilité (A5), alors le contrôle « aucune oubliée » devient une comparaison entre ce qui s'applique et ce qui a été appliqué. Donc la relecture peut juger la réponse contre les 3 lignes du tour 1 et contre cette liste.

Deux ruptures :

- « sans que j'aie à intervenir à nouveau » et « demander si besoin de plus d'infos » (T1) tirent en sens contraires ; il faut une règle qui dit quand une question est permise ;
- « même principe que T4 » transpose un contrôle sur 13 forges à environ 215 oracles et 36 skills, sans dire comment.

## Chapitre 3 — Blindspots, inventaire maître

Cet inventaire montre 10 défauts majeurs, presque tous liés au même silence : le prompt dit ce qu'il faut contrôler, pas comment le contrôle reste court et tenu. Comment lire : une ligne par défaut, numérotée pour le changelog du chapitre 8, avec sa sévérité ; les lignes suivent l'ordre de votre message.

| N° | Défaut | Sévérité |
|---|---|---|
| 1 | « La cible » ne nomme ni le document à produire, ni sa version, ni son nom | majeur |
| 2 | Le sort de D-68, D-69 et D-70 n'est pas dit : tranchées avec amendements, ou à reposer sur le texte revu | majeur |
| 3 | T1 : « générique » n'est pas défini ; aucun critère ne sépare une remarque de produit d'une remarque pour la Factory | majeur |
| 4 | T1 : « demander si besoin de plus d'infos » rouvre la récidive des questions évitables (signalée le 22/09 et 2 fois le 14/10) | majeur |
| 5 | T3 : garder la relecture contredit le retrait 2 du 21/10 (relecture non prolongée après le 01/11) ; il faut une décision de prolongation et un budget, l'essai coûtant 4 782 751 jetons en 9 jours | majeur |
| 6 | T3 : la relecture vous a posé 34 écarts pour 0 alerte confirmée ; telle quelle, elle vous fait intervenir, à l'opposé de l'objectif | majeur |
| 7 | T4 : un contrôle argumenté de 13 forges à chaque demande, affiché, rallonge chaque réponse (récidive « textes trop longs » des 01/10 et 20/10) | majeur |
| 8 | A5 : environ 215 oracles et 36 skills ne se contrôlent pas un à un par lecture à chaque demande ; il faut une condition d'applicabilité lisible par un script | majeur |
| 9 | A5 : la règle « redescend après 30 jours sans rien arrêter » de la synthèse 20261026b déclasserait seo-geo entre deux sites web, ce que votre remarque interdit | majeur |
| 10 | T4 et A5 : l'applicabilité dépend du profil du produit (site public, données, agents), qui n'est déclaré nulle part et change avec le produit | majeur |
| 11 | « Fonctionnalité » désigne ici les capacités de la Factory, pas les fonctionnalités des produits ; le mot prête à confusion | mineur |
| 12 | T2 et T4 : le verrou de T4 ajoute un 3e motif bloquant aux 2 de T2 | mineur |
| 13 | Coquilles : « checl », « nfos », « construires » | mineur |

## Chapitre 4 — Factcheck

Les prémisses du prompt tiennent toutes ; une seule, implicite, est invérifiable telle quelle. Comment lire : une affirmation par ligne, son verdict, la preuve.

| Affirmation | Verdict | Preuve |
|---|---|---|
| Un script de relecture existe | vrai | `scripts/relecture-intention.mjs` 2.1.0, relevé joué le 26/10 à 10:35 |
| Des règles et un format de remontée existent | vrai | `gabarits/CLAUDE-PRODUIT.md`, « Routage forge » et « Remontée automatique vers le pilot » ; `gabarits/oracle-lot-retours.mjs` |
| seo-geo est une forge de la Factory | vrai | `C:\dev\digit-ai-forge-seo-geo`, 2 oracles suivis par git |
| Des forges privilégiées existent par type | vrai | carte de la synthèse 20261026b, annexe A4 |
| Une forge pertinente ne doit « jamais » être oubliée | invérifiable en absolu | aucune mesure n'existe ; remonté au Ch3 n° 7 et 10, mesure proposée au Ch8 |

## Chapitre 5 — Premortem

Ce chapitre projette les défauts du Ch3 en échecs concrets ; la cause la plus probable est une réponse alourdie par des contrôles affichés, qui ramène le reproche de verbosité.

1. **Le tour 1 devient un inventaire.** La session écrit 13 lignes de forges et une liste de capacités avant chaque réponse ; vous signalez à nouveau la longueur. Mécanisme : le prompt exige l'argumentation sans dire où elle vit. Mitigation : l'argumentation complète s'écrit dans un fichier de trace ; l'écran montre une ligne. (Ch3 n° 7.)
2. **Le contrôle exhaustif est déclaré, pas fait.** La session écrit « 215 capacités vérifiées » sans les avoir lues. Mécanisme : un contrôle par lecture n'est pas vérifiable. Mitigation : une condition d'applicabilité par capacité, évaluée par script, et un relevé de ce qui a été appliqué. (Ch3 n° 8.)
3. **seo-geo disparaît.** Après 30 jours sans site web, ses capacités redescendent ; le site suivant ne les reçoit pas. Mécanisme : la preuve d'utilité comptée au calendrier. Mitigation : la compter sur les seules demandes où la capacité s'appliquait. (Ch3 n° 9.)
4. **La relecture vous redemande.** Elle continue de poser ses écarts à vous, avec 0 confirmation à ce jour. Mécanisme : elle alerte au lieu de corriger. Mitigation : sa boucle de correction de 2 passes par défaut, une question seulement pour un écart qui relève de votre choix. (Ch3 n° 6.)
5. **Le forçage devient un interrogatoire.** « Remonte à la Factory » déclenche 4 questions sur les champs du lot. Mécanisme : aucune règle ne dit quelles informations manquantes justifient une question. Mitigation : remplir le lot depuis les traces, et ne demander que le champ obligatoire qu'aucune trace ne donne. (Ch3 n° 4.)

## Chapitre 6 — Wargame

Ce chapitre attaque la direction de réécriture ; l'attaque la plus forte vient du contradicteur, qui peut satisfaire « aucune forge oubliée » en mobilisant tout.

- **L'utilisateur exigeant** demande où lire, après coup, pourquoi une forge a été écartée. Sans fichier de trace par demande, l'argumentation disparaît avec la session.
- **L'expert du domaine** relève que l'applicabilité ne se décide pas une fois : un produit qui ajoute une page publique devient concerné par seo-geo et websec. Le profil du produit doit se revoir quand un signal change (un domaine public, un `sitemap.xml`, un formulaire).
- **Le contradicteur** coche toutes les forges pour ne jamais en oublier une. Le verrou de T4 exige alors des livrables inutiles, et le coût explose. La parade est symétrique : chaque forge mobilisée a aussi son motif, et l'œil critique compte les mobilisations sans livrable utile.
- **Lentille robustesse.** La cible devient une instruction de toutes les sessions, chez tous les produits. Un contrôle qui repose sur la mémoire du modèle ne tient pas à l'échelle ; un contrôle qui repose sur un script et un fichier de profil tient. Le contexte injecté à l'ouverture reste plafonné à 9,6 Ko : le catalogue ne s'y charge pas, seul son résultat filtré pour le profil.

## Chapitre 7 — Deepthink

Ce chapitre s'ouvre parce que la cible s'appliquera à chaque demande. Trois effets de second ordre :

- **Coût cumulé.** La relecture gardée coûte environ 0,53 million de jetons par jour au rythme de l'essai (4 782 751 jetons en 9 jours) ; le contrôle de mobilisation par script ne coûte presque rien. Le budget doit porter sur la relecture, pas sur le contrôle.
- **Effet d'habitude.** Une ligne « Je mobilise » écrite à chaque demande devient un réflexe ; si elle se recopie d'une demande à l'autre, elle cesse de contrôler. La relecture doit comparer cette ligne au profil et à la demande, pas seulement vérifier qu'elle existe.
- **Effet sur la règle anti-inflation.** Le catalogue rend la croissance du stock gratuite pour le contexte. Le risque se déplace vers l'état 2 (actif pour un type) : c'est là que le plafond doit tenir.

## Chapitre 8 — Synthèse et prompt réécrit

**Score : 49 → 86 sur 100, projeté (non mesuré).** Le gain vient de la spécification (document, version, sort des décisions) et de la vérifiabilité (mécanisme de contrôle et mesure).

**Diagnostic en 3 lignes.**

1. L'intention est nette et vos amendements renforcent la cible au bon endroit : rien d'applicable ne doit être oublié.
2. Le prompt ne dit pas comment un contrôle exhaustif reste court, ni où vit l'argumentation, ni comment le vérifier.
3. Votre remarque sur seo-geo invalide la rétrogradation au calendrier de la cible : la preuve d'utilité doit se compter sur les demandes concernées.

### Prompt réécrit

```text
Retravaille la cible d'œil critique : produis la version révisée du diagnostic,
« Digit-AI - Diagnostic Factory - Oeil critique - 20261026a.md » dans output\03-etudes\
(R-4 : le projet en tête ; R-25 : le type « Diagnostic » en premier mot du 2e segment),
qui remplace la version 20261021a pour les sections d, e, f, g et i, et intègre le
catalogue de l'annexe A5 de la synthèse 20261026b. Ne modifie aucun autre fichier de
doctrine : c'est une proposition.

Sources : le diagnostic 20261021a, les synthèses 20261026a et 20261026b, et mes
remarques ci-dessous.

1. T1, retenue, avec 2 ajouts.
   a. Contrôle de portée : une remarque remonte à la Factory si au moins un de ces
      critères est vrai, et la trace dit lequel : elle vise un artefact du pilot ou d'une
      forge (gabarit, oracle, skill, hook, règle) ; elle se reproduirait chez un autre
      produit du même profil ; c'est une préférence de ma part ou une convention d'un
      client, qui vaut pour tous ses produits. Sinon elle reste au produit.
   b. Forçage : si je demande de remonter à la Factory, la remontée se fait même si le
      contrôle dit « produit ». Elle suit le format existant : ledger (type: retour),
      lot « <projet> - RETOURS - … » et sidecar .tf.jsonl déposés au sas _arrivee\,
      oracle-lot-retours vert. Les champs se remplissent depuis les traces ; une
      question ne se pose que pour un champ obligatoire qu'aucune trace ne permet de
      remplir, en une seule question groupée.

2. T2, retenue telle quelle.

3. T3, retenue, et la relecture d'intention gardée avec elle. Objectif : que la
   réponse corresponde à ma demande sans que j'intervienne, sauf sur un élément
   nouveau. Décris :
   - les 3 lignes du tour 1 (je livre, je suppose, je mobilise) deviennent le contrat
     contre lequel la relecture juge la réponse ;
   - la relecture corrige d'abord, par sa boucle de 2 passes, et ne me pose une
     question que pour un écart qui relève de mon choix ;
   - la prolongation au-delà du 01/11 annule le retrait 2 du 21/10 : pose-la en
     décision, avec un budget en jetons par jour mesuré sur l'essai.

4. T4, retenue, sans figer les forges. La carte donne des forges privilégiées par type.
   À chaque demande, chacune des 13 forges reçoit un verdict « mobilisée » ou
   « écartée » avec son motif, au regard de la demande et du profil du produit ;
   une forge mobilisée a aussi son motif. L'argumentation complète s'écrit dans un
   fichier de trace de la demande ; l'écran n'en montre qu'une ligne : les forges
   mobilisées, puis celles qui sortent de la carte, ajoutées ou écartées, avec leur
   motif. Le verrou « livré » vérifie les livrables des forges mobilisées.

5. A5, retenu, avec le même principe.
   - Chaque capacité du catalogue (skill, oracle, règle) porte une condition
     d'applicabilité lisible par un script : profil de produit, type de demande,
     présence d'un fichier ou d'un signal.
   - Le profil du produit est déclaré une fois et revu quand un signal change
     (domaine public, page indexable, données personnelles, agents).
   - À chaque demande, un script liste les capacités applicables ; à la fin, la trace
     dit, pour chacune, appliquée ou écartée avec motif. Une capacité applicable sans
     trace est un oubli, signalé avant « livré ».
   - Une capacité rare reste due : sa preuve d'utilité se compte sur les seules
     demandes où elle était applicable, jamais au calendrier. Remplace la règle de
     rétrogradation après 30 jours de silence de la synthèse 20261026b.

6. Mesure de « rien d'oublié » : la mission 5 du skill oeil-critique compare, pour
   chaque demande analysée, les forges et capacités applicables à celles appliquées ;
   donne la valeur de départ si elle se mesure, sinon dis-le.

7. Chiffre chaque ajout : fichiers, octets chargés à l'ouverture (plafond 9,6 Ko),
   jetons par jour. Chaque ajout dit ce qu'il retire, ou pourquoi il n'entre pas
   dans la couche plafonnée.

8. Repose D-68, D-69 et D-70 en entier, au format B, sur le texte révisé, option (a)
   = la version amendée ; ajoute la décision de prolonger la relecture (point 3).
   Réserve chaque nouvelle décision par scripts\reserver-decision.mjs. D-71 reste
   inchangée.

Contrat de sortie, à vérifier avant de rendre :
- le fichier existe au nom ci-dessus, avec un en-tête « remplace » et « ce qui change
  depuis 20261021a » ;
- les 5 points (T1, T2, T3, T4, A5) ont chacun : ce qui change, avantages,
  inconvénients, coût chiffré ;
- le critère de portée de T1 tient en 3 conditions, chacune vérifiable dans une trace ;
- aucune règle de la version ne rétrograde une capacité au calendrier ;
- le tour 1 affiché tient en 3 lignes, quelle que soit la demande ;
- chaque chiffre porte sa source ou « à vérifier » ;
- oracle-ecriture PASS sur le diagnostic ; la synthèse passe
  hook-restitution --prejuger avant affichage.
```

### Contrat de sortie, en clair

- Un fichier : `output/03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261026a.md`, qui remplace la version 20261021a pour les sections d, e, f, g, i.
- Cinq points traités, chacun avec ce qui change, avantages, inconvénients et coût chiffré.
- Le critère de portée de T1 en 3 conditions vérifiables.
- Aucune rétrogradation au calendrier ; preuve d'utilité comptée sur les demandes concernées.
- Le tour 1 tient en 3 lignes ; l'argumentation par forge et par capacité vit dans une trace.
- D-68 à D-70 reposées au format B ; une décision de prolongation de la relecture, réservée.
- `oracle-ecriture` PASS sur le diagnostic, `hook-restitution --prejuger` affichable sur la synthèse.

### Protocole de tests du livrable

Le livrable est un document texte de doctrine. Oracles : `oracle-ecriture` pour l'écriture, `check_markdown.py` du socle de page pour la lisibilité, `reserver-decision.mjs --verifier` pour les décisions, `hook-restitution --prejuger` pour la synthèse. Jeu d'essai, à dérouler sur le papier dans le document :

1. une demande de déploiement d'une application existante sans page publique : seo-geo écartée avec motif, aucun oubli signalé ;
2. le même produit qui ajoute une page publique : le profil change, seo-geo et websec deviennent applicables, leur absence est signalée avant « livré » (cas limite) ;
3. « remonte ça à la Factory » sur une remarque que le contrôle classe « produit » : lot produit au format, aucune question si les traces suffisent.

Boucle bornée à 3 passes ; au-delà, livrer avec les écarts restants nommés.

### Changelog

Comment lire : une modification par ligne, rattachée au défaut du Ch3 qu'elle corrige.

| Modification | Défaut corrigé |
|---|---|
| Document, version et nom nommés (R-4, R-25) | Ch3 n° 1 |
| D-68 à D-70 reposées sur le texte révisé, prolongation réservée | Ch3 n° 2, n° 5 |
| Critère de portée en 3 conditions | Ch3 n° 3 |
| Question unique, seulement pour un champ sans trace | Ch3 n° 4, Ch5 cause 5 |
| Relecture qui corrige d'abord, contre les 3 lignes du tour 1 | Ch3 n° 6, Ch5 cause 4 |
| Argumentation dans la trace, une ligne à l'écran | Ch3 n° 7, Ch5 cause 1 |
| Condition d'applicabilité lisible par script, relevé appliqué ou écarté | Ch3 n° 8, Ch5 cause 2 |
| Preuve d'utilité comptée sur les demandes concernées | Ch3 n° 9, Ch5 cause 3 |
| Profil du produit déclaré et revu sur signal | Ch3 n° 10, Ch6 expert |
| Forge mobilisée motivée elle aussi | Ch6 contradicteur |
| « Capacité » à la place de « fonctionnalité » | Ch3 n° 11 |
| Mesure par la mission 5 du skill d'œil critique | Ch4, invérifiable en absolu |

### Écarts à la lettre

Comment lire : une ligne par endroit où le prompt réécrit s'écarte de votre texte ; la catégorie dit comment la valider. Les 5 écarts sont des manières d'exécuter : ils se valident avec le prompt. Aucun contenu visible n'est ajouté au livrable sans votre demande.

| Vous avez écrit | Je propose | Pourquoi | Catégorie |
|---|---|---|---|
| « check … avec argumentation » à chaque demande (T4) | argumentation complète dans une trace, une ligne à l'écran | ne pas ramener la récidive de longueur | manière d'exécuter |
| « check de chaque fonctionnalité » (A5) | contrôle par script sur des conditions d'applicabilité, motif écrit pour chaque capacité applicable | 215 oracles et 36 skills ne se lisent pas à chaque demande | manière d'exécuter |
| « demander si besoin de plus d'infos » (T1) | une seule question groupée, pour un champ obligatoire sans trace | ne pas rouvrir la récidive des questions évitables | manière d'exécuter |
| « OK + le script de relecture » (T3) | relecture qui corrige d'abord, et prolongation posée en décision avec budget | elle vous a posé 34 écarts ; sa prolongation annule un retrait du 21/10 | manière d'exécuter |
| « OK » sur T1, T3, T4, A5 | D-68 à D-70 reposées sur le texte révisé | vous n'avez pas encore lu les amendements rédigés | manière d'exécuter |

## Note d'adaptation du 26/10/2026, 13:51

Le prompt réécrit ci-dessus est remplacé par sa version adaptée au skill oeil-critique 1.1.0 (décision D-72 (b), note `20261026-comparaison-task-observer-oeil-critique.md`) : contrôle de portée de T1 renvoyé au test de généralité du skill, barrière dès la 2e fois et son accord avec T2, refus de hook lus par la mesure, format B ordinaire pour D-68 à D-70. Version adaptée : `output/04-plans/Digit-AI - Synthese Mandat - Prompt cible oeil critique adapte a oeil-critique 1.1.0 - 20261026d.md`, annexe.
