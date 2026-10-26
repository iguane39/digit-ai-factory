---
destinataire: humain
---

# Synthèse Mandat — transformations T1 à T4 détaillées, et un catalogue à la place du plafond de stock (26/10/2026)

## 0. Synthèse d'ouverture

Votre crainte sur D-70 est fondée, et elle change ma recommandation. La règle « une entrée, une sortie » ne touche ni le code ni les corrections des produits ; elle bornait pourtant le stock de capacités des forges, ce qui freine leur croissance. Le défaut mesuré n'est pas la taille du stock : c'est ce qui se charge et ce qui bloque à chaque demande. Je propose donc un catalogue des capacités, chargé à la demande, où le plafond ne porte que sur la couche chargée et bloquante. Le stock peut croître par incréments ; il se recompacte par fusion des capacités d'une même classe de défaut. Le détail de T1 à T4 est en annexe. D-68 et D-69 sont reposées en entier, et D-70 porte la nouvelle option.

## 1. En-tête d'identification

Détail demandé · sur le pilot digit-ai-factory · le 26/10/2026 à 10:42 (heure de Paris, UTC+1) · Claude Opus 5.5, lecture seule hors cette synthèse.

Intention : vous donner de quoi trancher T1 à T4 en connaissant leurs effets, et éviter que la règle anti-inflation bride les capacités de la Factory. Test rétro : la synthèse sert l'intention, car elle chiffre avantages et inconvénients depuis les registres et propose une règle qui laisse croître les capacités.

## 2. Verdict en une ligne

4 transformations sur 4 restent recommandées ; la règle anti-inflation plafonne 2 couches, ce qui se charge et ce qui bloque, et laisse le catalogue à la demande sans plafond.

## 3. Décisions attendues

> **D-68 — Faut-il engager les transformations T1, T2 et T3 du diagnostic d'œil critique, dans cet ordre ?**
>
> - **De quoi s'agit-il** : T1 (préférences et conventions client en un seul endroit, tri des retours en 3 voies), T2 (compte rendu allégé, blocage sur 2 motifs), T3 (cadrage en 3 lignes au tour 1, à la place de la relecture d'intention) ; le détail est en annexe, sections A1 à A3.
> - **Le problème** : 35 de vos 105 corrections en 30 jours répètent une consigne déjà donnée ; la relecture d'intention a levé 22 alertes, dont 0 confirmée par vous, pour 4 782 751 jetons.
> - **Pourquoi vous** : T2 et T3 changent la doctrine de restitution et retirent un dispositif en essai.
> - **Recommandation : (a)** — T1 traite la cause la plus fréquente des récidives, T3 coûte presque rien et agit avant le travail au lieu d'après. Source consultée : `node scripts/relecture-intention.mjs --releve`, joué à 10:35, et le diagnostic 20261021a, sections d et e.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* T1, puis T2, puis T3 au 01/11 | Trois campagnes successives, chacune mesurée par les indicateurs avant la suivante | moyen × moyen | chaque transformation se défait seule |
| **(b)** T1 et T2, relecture d'intention prolongée | Le cadrage au tour 1 n'existe pas ; la relecture continue à environ 0,6 million de jetons par jour | moyen × court | arrêter la relecture |
| **(c)** Rien | La relecture d'intention finit son essai le 01/11 sans remplaçant | nul | sans objet |

> **Sans réponse** : (c), rien n'est transformé.

> **D-69 — Faut-il modifier l'architecture des produits selon T4 : carte type de demande → forges → livrables, verrou « livré » sur les fichiers, héritage réduit à la ligne du type ?**
>
> - **De quoi s'agit-il** : une carte en 7 types qui dit quelles forges une demande mobilise et quels fichiers doivent exister avant « livré » ; l'héritage des produits réduit au noyau et à la ligne de leur type ; le détail et les impacts sont en annexe, section A4.
> - **Le problème** : 2 produits sur 10 clos ou publiés portent leurs 4 livrables de forge ; Produit-82 s'est déclaré complet le 14/10 sans exigences, design ni audit de tests.
> - **Pourquoi vous** : le changement touche les 26 produits relevés, et la carte de départ est à valider ou corriger.
> - **Recommandation : (a)** — le verrou est non rétroactif et la carte sert aussi de clé au catalogue de D-70. Source consultée : diagnostic 20261021a, §c-D2 et §d-D2 ; `gabarits/CLAUDE-PRODUIT.md`, 25 851 octets.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Carte validée, verrou non rétroactif, héritage réduit | Chaque produit déclare son type ; « livré » exige les fichiers de ce type à partir de la prochaine livraison | moyen × moyen | rétablir l'héritage complet |
| **(b)** Carte et verrou, héritage inchangé | Le verrou tient ; l'ouverture d'un produit reste à 19 144 caractères injectés en médiane | moyen × court | retirer le verrou |
| **(c)** Rien | Un produit peut encore se dire livré sans ses forges | nul | sans objet |

> **Sans réponse** : (c), l'architecture reste inchangée.

> **D-70 — Faut-il adopter la règle anti-inflation et ses plafonds, avec les 3 indicateurs de pilotage, pour le pilot et les forges ?**
>
> - **De quoi s'agit-il** : la règle du diagnostic, reformulée après votre remarque ; le plafond porte sur ce qui se charge à chaque demande et sur ce qui bloque, et toute capacité peut entrer au catalogue à la demande ; détail en annexe, section A5.
> - **Le problème** : la règle d'origine, « tout ajout retire autant », bridait les capacités des forges ; or le coût mesuré vient de ce qui se charge (19 144 caractères à l'ouverture d'un produit) et de ce qui bloque (231 refus du hook de fin de tour en un mois).
> - **Pourquoi vous** : c'est une règle de doctrine qui s'applique à tout ajout futur.
> - **Recommandation : (a)** — elle garde les plafonds qui ont tenu et laisse croître le stock par incréments. Source consultée : diagnostic 20261021a, §f ; relevé des skills, 22 skills dans digit-ai-forge-agents chargés par leur seule description.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Catalogue à 3 états, plafond sur les couches chargée et bloquante, 3 indicateurs | Une capacité nouvelle entre librement au catalogue ; elle ne se charge ou ne bloque qu'avec sa preuve de rejeu | moyen × moyen | revenir à la règle d'origine ou à rien |
| **(b)** Règle d'origine, une entrée pour une sortie sur le stock | La croissance du stock s'arrête ; une forge doit retirer pour ajouter | faible × court | lever la règle |
| **(c)** Rien | Chaque reproche continue de devenir un contrôle chargé partout | nul | sans objet |

> **Sans réponse** : (c), aucune règle n'est adoptée.

Rappel : D-71, publication du pilot après rebase, posée à 10:22, inchangée.

## 4. Traité

- Relecture d'intention relevée par `node scripts/relecture-intention.mjs --releve` : 66 relectures, 22 alertes, 0 confirmée, 1 infirmée, 12 sans réponse, 34 écarts posés à vous.
- Coût de la relecture : 4 782 751 jetons au relevé d'ouverture de 10:21, sur 9 jours d'essai depuis le 18/10.
- Tailles mesurées par `wc -c` : `gabarits/CLAUDE-PRODUIT.md` 25 851 octets, `gabarits/RESTITUTION.md` 182 665, `gabarits/HERITAGE.json` 64 200, `references/ETAPES-RUN.md` 42 753.
- Stock du pilot compté par `ls` : 90 oracles hors tests, 107 fichiers de référence, 98 gabarits.
- Détail de T1 à T4 et proposition de catalogue rédigés en annexe, depuis le diagnostic 20261021a, sections d, e et f.
- D-70 reformulée sur votre remarque ; D-68 et D-69 reposées en entier, le texte de leur question inchangé.
- Relecture d'intention : sans objet, synthèse sans livrable de code.

## 5. Non traité

- Chiffrage du catalogue en fichiers et en octets : non fait, parce qu'il dépend de votre réponse à D-70 ; il viendra avec la campagne.
- Actions A-1 à A-3 de la synthèse 20261026a : non jouées, parce que vous avez demandé un détail et non leur exécution.

## 6. Écarts à la lettre

Aucun écart : vous avez demandé le détail de T1 à T4 et une alternative au plafond de stock, et c'est ce qui est rendu.

## 7. Risques

- Énoncé : le catalogue devient lui-même un objet de plus à tenir. Signal : un index écrit à la main qui diverge des fichiers. Parade : un index généré depuis les fichiers, jamais saisi.
- Énoncé : une capacité utile reste au catalogue faute d'être appelée. Signal : un défaut que la capacité aurait arrêté, relevé par le skill d'œil critique. Parade : la mission 5 du skill compare chaque demande à la carte de T4.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 à A-3 de la synthèse 20261026a restent valables, A-1 ci-dessous suit vos réponses.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | aucun | Ouvrir une campagne par transformation retenue, catalogue compris | auto_ia | gate_gouvernance | `node todo/journaliser.mjs`, un item par transformation | le diagnostic reste sans effet |
| **A-2** | TF-1942 | Lancer la première analyse d'œil critique sur chaque poste | manuelle_utilisateur | decision : D-65 (a) laisse le lancement à votre geste | taper « œil critique » dans une session du pilot | aucune liste de modifications n'est produite |

## 9. Traces

- `output/03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261021a.md`, sections d, e, f.
- `references/RELECTURE-INTENTION.md`, section « Dates, seuil, revue ».
- `todo/relectures-intention.jsonl`, 66 lignes jugées.
- `output/04-plans/Digit-AI - Synthese Mandat - Oeil critique et architecture etat au 26-10 - 20261026a.md`.

## Annexe — détail des transformations

### A1. T1 : un seul endroit pour vos préférences et les conventions de chaque client

Ce qui change. Un fichier de vos préférences (longueur, puces, format, questions à ne pas poser) se charge dans toute session, pilot et produits. Un fichier par client porte ses conventions : inscription Entra, groupe de ressources `_TFSTATE`, environnements, interlocuteurs. Ce fichier vit dans un dépôt privé, le canal confidentiel ou le projet commun du client, jamais dans le pilot public. Chaque retour prend une voie sur 3 :

1. une préférence ou une convention va dans l'un de ces fichiers, en une ligne ;
2. un défaut de livrable se corrige chez le produit, sans lot de retours ;
3. un défaut systémique devient un contrôle au pilot, admis seulement s'il rejoue le cas qui l'a fait naître, rouge avant, vert après.

Avantages : la récidive de goût est traitée là où elle naît, au lieu d'une règle de plus au pilot ; la connaissance d'un client cesse de vivre dans votre seule mémoire ; le pilot ne grossit plus que des défauts systémiques.

Inconvénients : un retour mal trié reste chez un produit alors qu'il était général ; le fichier de préférences peut grossir à son tour, d'où un plafond ; le fichier client double peut-être le projet commun existant, à fusionner plutôt qu'à juxtaposer.

### A2. T2 : le compte rendu garde ses 9 blocs et ne bloque plus que sur 2 motifs

Ce qui change. Les blocs 0, 1, 3, 4, 5, 8 et 9 restent toujours présents ; les blocs 2, 6 et 7 n'apparaissent que s'ils ont un contenu. Le hook de fin de tour ne refuse plus que 2 cas : un bloc toujours présent qui manque, une décision sans ses options. Les 82 règles de forme deviennent des consignes non bloquantes. Le gabarit sort son historique de versions, 45,6 Ko, et ses 152 justifications dans un fichier non chargé, ce qui le ramène vers 130 Ko.

Avantages : les refus de fin de tour baissent (231 en un mois, 70 % pour un compte rendu absent), et avec eux les doubles affichages ; la reprise de vos sessions parallèles garde les mêmes informations à l'écran.

Inconvénients : la forme varie davantage d'un tour à l'autre ; une règle de fond portée par le texte, comme « N exigences sur M tenues » avant « livré » (règle S72), perd son blocage, que T4 reprend sur les fichiers.

### A3. T3 contre la relecture d'intention

Ce que fait chacun. La relecture d'intention fait relire, après le travail, la demande et le livrable par un agent Sonnet sans contexte ; 51 322 jetons par relecture en médiane, 3 relectures au plus par travail. T3 fait écrire à la session, au tour 1, 3 lignes sans attendre de réponse : « Je livre », « Je suppose », « Je mobilise ».

| Critère | Relecture d'intention, après le travail | T3, avant le travail |
|---|---|---|
| Moment | après la production : l'écart est payé avant d'être vu | avant : vous corrigez une hypothèse avant qu'elle coûte |
| Indépendance | un lecteur sans le contexte de la session | la session se relit elle-même ; vous êtes le lecteur |
| Coût | 4 782 751 jetons en 9 jours | 3 lignes par demande |
| Résultat mesuré | 22 alertes, 0 confirmée par vous, 1 infirmée | non mesuré ; 7 reprises de l'échantillon auraient été évitées selon les traces |
| Charge pour vous | 34 écarts posés à vous | 3 lignes à lire, aucune réponse attendue |
| Angle mort | a jugé conforme l'étude que vous avez rejetée le 20/10 | une hypothèse que la session ne voit pas ne s'écrit pas |

Pourquoi remplacer plutôt qu'ajouter. La relecture n'a, à ce jour, fait confirmer aucune de ses alertes : son propre critère de revue, au moins 1 alerte confirmée sur 2, n'est pas atteint. Elle agit après la dépense, alors que les reprises mesurées venaient d'une hypothèse silencieuse dès le départ (dépôt tiers en lecture seule, exemples pris pour un périmètre). Garder les deux ajouterait un dispositif sans retirer l'autre. Je propose de garder le script de relecture comme commande à la demande, pour une étude longue, sans relecture automatique à chaque tour.

### A4. T4 : la carte, le verrou et l'héritage réduit

La carte de départ :

| Type de demande | Forges attendues | Livrables exigés avant « livré » |
|---|---|---|
| Produit neuf | conception, design, development, tests, ops | `EXIGENCES.json`, `DESIGN.md` et jetons, rapport forge-tests, `DOSSIER-MEP.md` |
| Évolution d'une application existante | development, tests, ops | rapport forge-tests sur le périmètre touché ; `DOSSIER-MEP.md` si mise en production |
| Audit complet | audit | rapport forge-audit |
| Site ou contenu web | design, seo-geo, websec | `DESIGN.md`, rapport seo-geo, verdict websec |
| Données ou reporting | data | lineage et rapport de qualité forge-data |
| Agent ou automatisation | agents, agents-security | définitions d'agents et recette, verdict agents-security |
| Document, présentation, propale | design (marque) | verdict de l'oracle du format |

Ce qui change. Chaque produit déclare son type, un ou plusieurs ; au tour 1, la ligne « Je mobilise » de T3 cite les forges de la carte. Le hook de fin de tour refuse « livré » si un fichier exigé manque, au lieu de juger le texte du compte rendu. Le fichier hérité ne garde que le noyau commun et la ligne du type.

Avantages : plus de produit « complet » sans exigences ni tests ; le contrat « prêt client » de `references/ETAPES-RUN.md` devient vérifié par fichiers ; le contexte d'ouverture d'un produit s'allège, ce qui rend la doctrine restante mieux appliquée.

Inconvénients : une carte mal calibrée exige un livrable inutile ; un produit qui change de type garde une carte périmée ; un produit à plusieurs types cumule les exigences.

Impacts mesurés :

- `gabarits/CLAUDE-PRODUIT.md` passe de 25 851 octets à 6 Ko au plus ;
- `gabarits/HERITAGE.json` (64 200 octets) gagne la sélection par type ;
- l'injection du hook d'ouverture d'un produit vise 9,6 Ko, la moitié de la médiane actuelle ;
- le verrou s'ajoute au hook de fin de tour, la règle S72 sort de l'oracle de synthèse ;
- les 26 produits relevés reçoivent l'héritage réduit à leur prochaine ouverture, sauf les 2 produits sans lanceur de hooks, à équiper par vous ;
- non rétroactif : les 8 produits livrés sans leurs 4 livrables ne sont pas rouverts ; le verrou joue à leur prochaine livraison.

### A5. Un catalogue de capacités à la place du plafond de stock

Ce que la règle couvre, et ne couvre pas. Le code des produits, leurs fonctionnalités et leurs corrections ne sont pas concernés : la règle porte sur le pilot, les forges et l'héritage. Votre remarque vaut pour les capacités des forges, skills, oracles et règles : une entrée pour une sortie les aurait figées.

Le principe. Une capacité coûte surtout quand elle se charge à chaque demande ou bloque chaque tour. Le catalogue sépare 3 états :

1. **au catalogue** : la capacité existe, avec sa classe de défaut et les types de demande qu'elle sert ; elle n'est chargée que si la demande l'appelle, comme un skill dont seule la description est lue ;
2. **active pour un type** : la carte de T4 la charge pour les seules demandes de ce type ;
3. **bloquante** : elle refuse un tour ; elle n'y entre qu'avec sa preuve de rejeu, rouge avant et vert après.

Le plafond porte sur les états 2 et 3 : 9,6 Ko injectés à l'ouverture d'un produit, 6 Ko d'héritage, un nombre borné de règles bloquantes. L'état 1 n'a pas de plafond.

L'incrément. Une capacité nouvelle entre au catalogue sans rien retirer. Elle monte d'un état sur preuve : appelée et utile pour l'état 2, rejeu rouge puis vert pour l'état 3. Elle redescend d'un état, sans être supprimée, si elle n'a rien arrêté en 30 jours ; les gardes de sécurité ne redescendent jamais sur leur seul silence.

Le recompactage. Le catalogue se range par classe de défaut, le référentiel de classes du registre existant. Deux capacités d'une même classe se fusionnent en une à la revue mensuelle, qui devient la mission 4 du skill d'œil critique. Le catalogue est généré depuis les fichiers, skills, oracles et règles, jamais saisi à la main, pour ne pas devenir un document de plus à tenir.

Ce que vous y gagnez. La liste des capacités n'est pas réduite ; elle grandit, se range et se compacte. Ce qui reste borné, c'est la part que chaque demande paie.
