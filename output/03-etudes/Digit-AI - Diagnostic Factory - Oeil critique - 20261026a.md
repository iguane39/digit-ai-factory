---
lecteur: Sébastien, porteur de la Digit-AI Factory, qui décide des transformations
phase: 1 — diagnostic, proposition révisée, lecture seule
date: 2026-10-26
remplace: Digit-AI - Diagnostic Factory - Oeil critique - 20261021a.md, pour les sections d, e, f, g et i
---

# Diagnostic de la Factory — œil critique, cible retravaillée (26/10/2026)

**Ce qui change depuis la version 20261021a.** Le diagnostic (sections a, b, c, h) et le dispositif continu (section j) sont inchangés : ils restent lisibles dans la version 20261021a. Cette version réécrit les options (d), le cadrage du tour 1 (e), la règle anti-inflation (f), les indicateurs (g) et les décisions (i), sur vos remarques du 26/10 :

- T1 (préférences et conventions client) gagne un contrôle de portée, le forçage d'une remontée et une barrière dès la 2e récidive ;
- T2 (compte rendu allégé) est retenue telle quelle ;
- T3 (cadrage au tour 1) garde la relecture d'intention, qui corrige au lieu de vous interroger ;
- T4 (carte des forges) ne fige plus les forges : chacune des 13 reçoit un verdict motivé à chaque demande ;
- A5 (catalogue des capacités) applique le même principe à chaque capacité, et la preuve d'utilité se compte sur les seules demandes où la capacité s'appliquait.

Les idées reprises du skill `oeil-critique` 1.1.0 (décision D-72 (b), note `20261026-comparaison-task-observer-oeil-critique.md`) y renvoient au skill, sans seconde définition.

Étiquettes : **[constat]** sourcé ou recalculé, **[estimé]** chiffré par l'auteur sans mesure, **[recommandation]** à décider. « À vérifier » signale une valeur que je n'ai pas pu rejouer.

## d. Options retenues, amendées

Chaque transformation dit ce qui change, ses avantages, ses inconvénients et son coût. Le coût se compte en fichiers, en octets chargés à l'ouverture d'une session de produit (plafond 9,6 Ko, §f) et en jetons par jour.

### T1 — préférences et conventions en un seul endroit, retours triés

**Ce qui change.**

- Un fichier de vos préférences (longueur, puces, format, questions à ne pas poser) se charge dans toute session, au pilot et chez les produits.
- Un fichier par client porte ses conventions (inscription Entra, groupe de ressources `_TFSTATE`, environnements, interlocuteurs). Il vit dans un dépôt privé, le canal confidentiel ou le projet commun du client, jamais dans le pilot public.
- **Contrôle de portée.** C'est le test de généralité du skill `oeil-critique` 1.1.0, étape 4, appliqué à chaque retour. Une majorité de « oui » fait remonter le constat à la Factory ; une majorité de « non » le laisse au produit. Une préférence de votre part ou une convention d'un client remonte toujours, vers le fichier ci-dessus. La trace du retour (`type: retour` au ledger du produit) porte les 4 réponses.
- **Forçage.** Quand vous demandez de remonter à la Factory, la remontée se fait même si le test dit « produit ». Elle suit le format existant de `gabarits/CLAUDE-PRODUIT.md` : ledger, lot `<projet> - RETOURS - …` et sidecar `.tf.jsonl` au sas `_arrivee\`, `oracle-lot-retours` vert. Les champs se remplissent depuis les traces ; une seule question groupée se pose, et seulement pour un champ obligatoire qu'aucune trace ne permet de remplir.
- **Trois voies.** Une préférence ou une convention va au fichier ; un défaut de livrable se corrige chez le produit, sans lot ; un défaut systémique devient un contrôle au pilot, admis s'il rejoue le cas qui l'a fait naître, rouge avant, vert après.
- **Barrière dès la 2e fois.** Un défaut qui revient une 2e fois, sur la période ou au registre, appelle une barrière : un hook qui refuse, un contrôle d'oracle qui échoue, un défaut qui rend le mauvais chemin indisponible, un script qui fait le geste. Reformuler la règle n'est pas recevable. La barrière passe la preuve de rejeu.
- **Accord avec T2.** Les règles de forme du compte rendu restent non bloquantes (T2). La barrière dès la 2e fois vise un défaut de fond, ou une règle de forme dont la récidive vous a fait intervenir, mesurée par vos messages et non par les refus du hook. Ainsi T2 ne rouvre pas ses 82 règles bloquantes, et une récidive que vous subissez reçoit quand même sa barrière.

**Avantages.** Une récidive de goût se traite là où elle naît. La connaissance d'un client ne dépend plus de votre mémoire. Le pilot ne grossit que de défauts systémiques ou récidivants, chacun prouvé par rejeu. Vous n'avez plus à aiguiller vous-même les remontées : 42 de vos messages en 30 jours demandaient de « remonter à la Factory » **[constat, diagnostic 20261021a, §c-D1]**.

**Inconvénients.** Le test de généralité peut se tromper ; le forçage le corrige, à votre initiative. Le fichier de préférences grossit à son tour, d'où son plafond (§f). Le fichier client peut doubler le projet commun du client ; il le prolonge au lieu de le copier.

**Coût [estimé].** 1 fichier de préférences au pilot, chargé à l'ouverture, plafonné à 2 Ko ; 1 fichier par client, chargé seulement chez ses produits, plafonné à 2 Ko ; aucun jeton par jour au-delà de leur lecture. Le test de généralité existe déjà dans le skill : aucun fichier de plus.

### T2 — compte rendu complet allégé

Retenue telle quelle, comme décrite dans la version 20261021a, §d-D3 : 9 blocs, blocs 2, 6 et 7 seulement s'ils ont un contenu, blocage sur 2 motifs (bloc toujours présent absent, décision sans options), historique et justifications sortis du gabarit.

**Coût [constat pour la taille actuelle].** `gabarits/RESTITUTION.md` passe de 182 665 octets à environ 130 Ko, puis à 54 Ko au plus à la revue suivante si refus et reprises ne montent pas. C'est un retrait.

### T3 — cadrage au tour 1 et relecture d'intention gardée

**Ce qui change.**

- Au tour 1, la session écrit 3 lignes, sans attendre de réponse :
  - « Je livre : … » (quoi, pour qui, où, format, taille) ;
  - « Je suppose : … » (1 à 3 hypothèses qui changeraient le livrable ; les exemples de la demande illustrent, ils ne bornent pas) ;
  - « Je mobilise : … » (les forges retenues, §T4).
- Ces 3 lignes deviennent le contrat contre lequel la relecture d'intention juge la réponse, en plus de votre demande citée mot pour mot.
- La relecture corrige d'abord, par sa boucle de 2 passes (`node scripts/relecture-intention.mjs --boucle`). Elle ne vous pose une question que pour un écart qui relève de votre choix ; tout autre écart se corrige ou s'inscrit au bloc 5 comme non traité.
- La relecture vérifie aussi que la ligne « Je mobilise » répond au profil du produit et à la demande, et non à la demande précédente.
- La prolongation de la relecture au-delà du 01/11 annule le retrait 2 du 21/10 (« relecture par tour non prolongée après le 01/11 »). Elle est posée en D-73.

**Avantages.** Une hypothèse fausse se voit avant la dépense, au lieu d'après. La relecture gagne un contrat précis, au lieu de la seule demande. Elle cesse de vous faire intervenir : 34 écarts vous ont été posés pendant l'essai, pour 0 alerte confirmée et 1 infirmée **[constat, `relecture-intention.mjs --releve`, 26/10 à 10:35]**.

**Inconvénients.** La relecture garde un coût réel. Une correction automatique peut corriger dans le mauvais sens ; la borne des 2 passes et l'interdiction de corriger contre une décision consignée la limitent. Les 3 lignes peuvent se recopier d'une demande à l'autre ; la relecture les compare au profil.

**Coût.** 52 relectures pour 4 979 423 jetons du 18 au 26/10, soit environ 553 000 jetons par jour en moyenne et 1 998 160 le 20/10 **[constat, `relever-flotte.mjs`, 26/10 à 13:58]**. Budget proposé : 1 million de jetons par jour, au-delà duquel la relecture s'arrête pour la journée et le relevé d'ouverture le dit **[recommandation]**. Les 3 lignes du tour 1 ne coûtent qu'une ligne de doctrine dans le noyau des produits.

### T4 — carte des forges privilégiées, verdict motivé pour chacune des 13

**Ce qui change.**

- La carte donne, par type de demande, les forges **privilégiées** ; elle ne les fige plus. Carte de départ :

Comment lire : un type de demande par ligne ; les forges privilégiées sont celles que la session mobilise sauf motif contraire ; les livrables sont exigés avant « livré » pour chaque forge mobilisée.

| Type de demande | Forges privilégiées | Livrables exigés si la forge est mobilisée |
|---|---|---|
| Produit neuf | conception, design, development, tests, ops | `EXIGENCES.json`, `DESIGN.md` et jetons, rapport forge-tests, `DOSSIER-MEP.md` |
| Évolution d'une application existante | development, tests, ops | rapport forge-tests sur le périmètre touché ; `DOSSIER-MEP.md` si mise en production |
| Audit complet | audit | rapport forge-audit |
| Site ou contenu web | design, seo-geo, websec | `DESIGN.md`, rapport seo-geo, verdict websec |
| Données ou reporting | data | lineage et rapport de qualité forge-data |
| Agent ou automatisation | agents, agents-security | définitions d'agents et recette, verdict agents-security |
| Document, présentation, propale | design (marque) | verdict de l'oracle du format |

- À chaque demande, chacune des 13 forges reçoit un verdict « mobilisée » ou « écartée », avec son motif, au regard de la demande **et du profil du produit** (§A5). Une forge mobilisée a aussi son motif, ce qui empêche de tout cocher pour ne rien oublier.
- L'argumentation complète s'écrit dans un fichier de trace de la demande, au dossier `forge\` du produit. L'écran n'en montre qu'une ligne, celle de « Je mobilise » : les forges mobilisées, puis celles qui sortent de la carte, ajoutées ou écartées, avec leur motif.
- Le verrou « livré » vérifie la présence des livrables des forges mobilisées. Il est non rétroactif : il s'applique à la prochaine livraison de chaque produit. C'est le 3e motif bloquant du hook de fin de tour, à côté des 2 de T2 ; il remplace la règle S72 (« N exigences sur M tenues », jugée sur le texte).
- L'héritage d'un produit (`gabarits/CLAUDE-PRODUIT.md`) se réduit au noyau commun et aux lignes de la carte qui répondent à son profil. Sa table « Routage forge » est remplacée par la carte.

**Avantages.** Plus de produit « complet » sans exigences ni tests : 2 produits sur 10 clos ou publiés portaient leurs 4 livrables **[constat, 20261021a, §c-D2]**. Une forge rare n'est plus oubliée faute d'être privilégiée, puisqu'elle reçoit son verdict à chaque demande. Le contexte d'ouverture d'un produit s'allège.

**Inconvénients.** 13 verdicts motivés par demande ajoutent un travail d'écriture à la session, même si l'écran n'en montre qu'une ligne. Une carte mal calibrée privilégie une forge inutile ; le motif de chaque mobilisation et la mesure du §g la font apparaître. Un produit à plusieurs types cumule les exigences de chacun.

**Coût [estimé, à mesurer à la mise en service].** 1 fichier de carte au pilot, environ 2 Ko, non chargé à l'ouverture ; 1 fichier de trace par demande chez le produit, environ 1 Ko ; environ 1 500 jetons de sortie par demande pour les 13 verdicts. Retrait : `CLAUDE-PRODUIT.md` passe de 25 851 octets à 6 Ko au plus **[constat pour la taille actuelle]**, la règle S72 sort de `oracles/oracle-synthese.mjs`.

### A5 — catalogue des capacités, contrôle de chacune

**Ce qui change.**

- Chaque capacité de la Factory (skill, oracle, règle) porte une **condition d'applicabilité** lisible par un script : profil de produit, type de demande, présence d'un fichier ou d'un signal. Le stock compte environ 215 oracles (90 au pilot, 125 dans les forges) et 36 skills installés **[constat, `git ls-files` et relevé d'ouverture, 26/10]**.
- Le **profil du produit** se déclare une fois, dans un fichier du dossier `forge\` du produit, et se revoit quand un signal change : domaine public, page indexable, données personnelles, agents, mise en production. Un produit qui ajoute une page publique devient concerné par seo-geo et websec à cette demande-là.
- À chaque demande, un script lit le profil et le type, et liste les capacités applicables. À la fin, la trace de la demande dit, pour chacune, appliquée ou écartée avec motif. Une capacité applicable sans trace est un **oubli**, signalé par le verrou avant « livré ».
- Le catalogue garde 3 états : au catalogue (n'est chargée que si la demande l'appelle), active pour un profil, bloquante (sur preuve de rejeu). L'état 1 n'a pas de plafond ; les états 2 et 3 sont plafonnés (§f).
- **Une capacité rare reste due.** Sa preuve d'utilité se compte sur les seules demandes où elle était applicable, jamais au calendrier. Une capacité seo-geo restée silencieuse pendant des mois parce qu'aucun site web n'a été construit garde son état ; elle s'applique au site suivant. Cette règle remplace la rétrogradation après 30 jours de silence de la synthèse 20261026b.
- Le catalogue est généré depuis les fichiers, jamais saisi à la main ; il se range par classe de défaut, et la revue mensuelle (mission 4 du skill) fusionne 2 capacités d'une même classe.

**Avantages.** La liste des capacités n'est pas réduite : elle grandit par incréments, se range et se compacte. Le contrôle « aucune oubliée » devient une comparaison mécanique entre applicables et appliquées, au lieu d'une affirmation de la session. Les capacités d'un domaine rare sont appliquées dès que le produit les concerne.

**Inconvénients.** Écrire la condition d'applicabilité de 215 oracles et 36 skills est un chantier ; il se fait forge par forge, en commençant par les capacités bloquantes. Une condition mal écrite rend une capacité invisible ; la mission 5 du skill d'œil critique le relève. Le catalogue n'a de valeur que si les skills restent courts : leurs descriptions se chargent déjà toutes à l'ouverture, 30 522 caractères pour 34 skills **[constat, `relever-contexte-sessions.mjs`, 26/10]**, d'où le choix d'un catalogue en fichier de données et non d'un skill par capacité.

**Coût [estimé].** 1 catalogue généré au pilot, non chargé ; 1 script d'applicabilité ; 1 fichier de profil par produit, environ 1 Ko ; le résultat filtré, injecté à l'ouverture, entre dans le plafond de 9,6 Ko. Aucun jeton de modèle pour le contrôle lui-même, qui est un script.

## e. Cadrage d'intention au tour 1

La méthode est celle de T3 : 3 lignes, sans attendre de réponse. La ligne « Je mobilise » porte le verrou de départ de T4 et le résultat du script d'applicabilité d'A5, en une ligne. Une question ne se pose que si une hypothèse change le livrable et ne se déduit ni de vos préférences ni des conventions du client (T1). Sur Produit-82, cette ligne aurait annoncé conception, design et tests dès le 14/10 à 11:40 **[constat du 20261021a, §c-D2 ; effet : hypothèse]**.

## f. Règle anti-inflation, sur la couche chargée et la couche bloquante

S'applique au pilot, aux forges, à l'héritage des produits et au dispositif de critique. Ne s'applique ni au code des produits, ni à leurs fonctionnalités, ni à leurs corrections.

1. **Le stock est libre, la charge est bornée.** Une capacité nouvelle entre au catalogue sans rien retirer. Ce qui se charge à chaque demande et ce qui bloque un tour obéissent à « une entrée, une sortie » dans leur famille.
2. **Plafonds**, dérivés de ce qui a tenu (le `CLAUDE.md` du pilot, plafonné à 6 Ko, est resté stable) :
   - contexte injecté à l'ouverture d'un produit ≤ 9,6 Ko, la moitié de la médiane mesurée (19 144 caractères, 20261021a §c-D1) ;
   - fichier hérité par un produit ≤ 6 Ko (25 851 octets aujourd'hui) ;
   - gabarit de compte rendu ≤ 130 Ko, puis ≤ 54 Ko ;
   - fichier de préférences et fichier client ≤ 2 Ko chacun ;
   - motifs bloquants du hook de fin de tour : 3 (2 de T2, le verrou de T4).
3. **Preuve d'utilité, comptée sur les demandes concernées.** Une capacité active ou bloquante qui n'a rien arrêté sur 30 demandes où elle était applicable redescend d'un état, sans être supprimée. Une capacité sans demande applicable garde son état. Les gardes de sécurité ne redescendent jamais sur leur seul silence.
4. **Barrière dès la 2e fois** (T1) : une récidive justifie une entrée dans la couche bloquante, toujours avec sa preuve de rejeu et le retrait d'une règle de même famille.
5. **Le dispositif de critique suit la même règle**, comme dans la version 20261021a, §f point 4.

## g. Indicateurs de pilotage

Comment lire : un indicateur par ligne, sa valeur de départ et sa source de recalcul. Les 3 premiers viennent de la version 20261021a ; le 4e mesure « rien d'oublié ».

| Indicateur | Objet mesuré | Valeur de départ | Recalcul |
|---|---|---|---|
| Demandes reprises | adéquation au premier passage | 17,5 % (45 demandes sur 257, 20/09 au 20/10) | extraction des messages humains (20261021a, §g) |
| Consignes répétées | capacité à apprendre | 35 corrections par mois | même extraction |
| Messages humains par demande | vos interventions | 2,0 | même extraction |
| Oublis | forges et capacités applicables non appliquées | forges : 8 produits sur 10 clos ou publiés sans leurs 4 livrables (20261021a, §c-D2) ; capacités : non mesurable avant les conditions d'applicabilité | mission 5 du skill `oeil-critique` : applicables contre appliquées, refus de hook sur un livrable de forge manquant comptés comme oublis |

## i. Décisions attendues

Défaut sans réponse : rien n'est transformé. Comment lire : chaque tableau suit sa question ; une option par ligne, la recommandée en tête.

> **D-68 — Faut-il engager les transformations T1, T2 et T3 du diagnostic d'œil critique, dans cet ordre ?**
>
> - **De quoi s'agit-il** : T1 avec son contrôle de portée par le test de généralité, le forçage et la barrière dès la 2e fois ; T2 telle quelle ; T3 avec la relecture d'intention gardée en boucle de correction (§d).
> - **Le problème** : 35 de vos 105 corrections en 30 jours répètent une consigne déjà donnée, et la relecture vous a posé 34 écarts pour 0 alerte confirmée.
> - **Pourquoi vous** : T2 et T3 changent la doctrine de restitution.
> - **Recommandation : (a)** — c'est la version qui intègre vos remarques du 26/10. Source consultée : §d de ce document.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* T1, T2 et T3 amendées, dans cet ordre | Trois campagnes successives, chacune mesurée par le §g avant la suivante | moyen × moyen | chaque transformation se défait seule |
| **(b)** T1 et T2 seules | Pas de cadrage au tour 1 ; la relecture suit D-73 | moyen × court | retirer les fichiers de T1 |
| **(c)** Rien | La cible reste écrite, sans effet | nul | sans objet |

> **Sans réponse** : (c), rien n'est transformé.

> **D-69 — Faut-il modifier l'architecture des produits selon T4 : carte type de demande → forges → livrables, verrou « livré » sur les fichiers, héritage réduit à la ligne du type ?**
>
> - **De quoi s'agit-il** : la carte de forges privilégiées, un verdict motivé pour chacune des 13 forges à chaque demande, le verrou non rétroactif et l'héritage réduit (§d, T4).
> - **Le problème** : 2 produits sur 10 clos ou publiés portaient leurs 4 livrables de forge.
> - **Pourquoi vous** : le changement touche tous les produits, et la carte de départ est à valider.
> - **Recommandation : (a)** — elle ne fige plus les forges et garde l'argumentation hors de l'écran. Source consultée : §d de ce document.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Carte privilégiée, 13 verdicts motivés en trace, verrou non rétroactif, héritage réduit | Aucune forge n'est écartée sans motif ; « livré » exige les livrables des forges mobilisées | moyen × moyen | rétablir l'héritage complet |
| **(b)** Carte et verrou sans verdict par forge | Seules les forges privilégiées sont contrôlées ; une forge rare peut être oubliée | moyen × court | retirer le verrou |
| **(c)** Rien | Un produit peut encore se dire livré sans ses forges | nul | sans objet |

> **Sans réponse** : (c), l'architecture reste inchangée.

> **D-70 — Faut-il adopter la règle anti-inflation et ses plafonds, avec les 3 indicateurs de pilotage, pour le pilot et les forges ?**
>
> - **De quoi s'agit-il** : le catalogue à 3 états, le contrôle de chaque capacité par sa condition d'applicabilité, la preuve d'utilité comptée sur les demandes concernées, les plafonds sur la couche chargée et la couche bloquante, et les indicateurs du §g, oublis compris.
> - **Le problème** : le stock de capacités doit pouvoir grandir, alors que la charge de chaque demande doit baisser.
> - **Pourquoi vous** : c'est une règle de doctrine qui s'applique à tout ajout futur.
> - **Recommandation : (a)** — aucune capacité n'est retirée pour en ajouter une, et une capacité rare n'est jamais déclassée faute d'usage. Source consultée : §d (A5) et §f de ce document.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Catalogue, contrôle par applicabilité, plafonds sur les couches chargée et bloquante, 4 indicateurs | Le stock grandit librement ; chaque demande ne charge que ce qui la concerne et signale ses oublis | moyen × long, condition à écrire forge par forge | revenir à la règle d'origine |
| **(b)** Plafonds et indicateurs, sans catalogue | La charge est bornée, mais un oubli ne se détecte pas | faible × court | lever la règle |
| **(c)** Rien | Chaque reproche continue de devenir un contrôle chargé partout | nul | sans objet |

> **Sans réponse** : (c), aucune règle n'est adoptée.

> **D-73 — Faut-il prolonger la relecture d'intention au-delà du 01/11/2026, en boucle de correction, avec un budget de 1 million de jetons par jour ?**
>
> - **De quoi s'agit-il** : la relecture d'intention par un agent neuf, gardée avec T3, qui corrige en 2 passes au plus et ne vous interroge que sur un choix qui vous revient.
> - **Le problème** : son essai finit le 01/11, et le retrait 2 du 21/10 prévoyait de ne pas la prolonger ; elle coûte environ 553 000 jetons par jour, 1 998 160 le jour le plus chargé.
> - **Pourquoi vous** : prolonger annule une décision du 21/10 et engage une consommation de quota.
> - **Recommandation : (a)** — vous l'avez demandée avec T3, et le budget de 1 million couvre le rythme moyen mesuré avec une marge du simple au double. Source consultée : `node scripts/relever-flotte.mjs`, 26/10 à 13:58.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Prolonger, boucle de correction par défaut, budget de 1 million de jetons par jour | Au-delà du budget, la relecture s'arrête pour la journée et le relevé d'ouverture le dit | environ 0,55 million de jetons par jour, quota de l'abonnement | arrêter la relecture |
| **(b)** Prolonger avec le seuil de l'essai, 4 millions par jour | Les jours chargés passent sans arrêt | jusqu'à 4 millions de jetons par jour | revenir à (a) |
| **(c)** Ne pas prolonger | La relecture s'arrête le 01/11 ; T3 reste seul | nul | relancer l'essai |

> **Sans réponse** : (c), la relecture s'arrête le 01/11.

Rappel : D-71, publication du pilot après rebase, posée le 26/10 à 10:22, inchangée.
