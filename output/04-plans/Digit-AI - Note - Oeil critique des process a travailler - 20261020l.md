---
lecteur: le porteur de la Digit-AI Factory, qui travaillera le sujet hors de la session, seul ou avec un autre assistant
---

# Note — un œil critique sur les process de la Factory : le sujet, ce qui est mesuré, ce qui reste à trancher (20/10/2026)

Cette note se lit seule, sans accès au dépôt. Elle rassemble le travail du 20/10/2026 sur l'idée d'un « œil critique » des process de la Factory : l'intention, les mesures, les propositions et les questions ouvertes. Chaque chiffre a une source citée en fin de note ; les identifiants internes sont expliqués à leur premier emploi.

## 1. Le sujet

Vous voulez un regard critique et permanent sur les solutions construites dans la Factory, dans ses forges et chez les produits qui les emploient. Ce regard doit juger si ces process sont les mieux à même de répondre à vos demandes. Il doit identifier, de lui-même, quoi ajouter, modifier, optimiser ou supprimer, et pourquoi. Le but est d'améliorer, par itérations, la qualité des process et celle des livrables.

Ce n'est pas un contrôle de plus qui vérifie qu'une correction a été faite. C'est un jugement d'ensemble sur l'adéquation du système à ce qu'on lui demande.

## 2. Le contexte minimal

La Factory est un système de production assisté par IA, piloté par des sessions de Claude Code. Il compte 3 étages :

- **le pilot**, qui orchestre, tient les règles et décide ;
- **13 forges**, des dépôts spécialisés : conception, design, développement, tests, mise en production, et des forges transverses (agents, données, observabilité, sécurité…) ;
- **environ 39 produits**, les projets réels qui emploient les forges et héritent de leurs règles.

Le travail y est encadré par 5 familles de process :

- **des règles** : 49 règles de projet, et 83 règles sur la forme des comptes rendus de fin de tour ;
- **des oracles** : des scripts qui jugent un livrable et rendent un verdict, 90 au pilot ;
- **des hooks** : des contrôles automatiques déclenchés à l'ouverture d'une session, avant un outil, après une écriture, à la fin d'un tour ou avant une publication ;
- **un registre d'améliorations** : chaque défaut constaté y devient un item, puis il est décidé et corrigé ;
- **des agents** : des sous-sessions spécialisées qui relèvent, rédigent ou vérifient.

## 3. Comment le sujet est né, et la première erreur

Le 20/10/2026, une publication a attendu environ 19 minutes la « garde des noms », un contrôle qui empêche un nom réel de client de partir sur un dépôt public. La mesure a montré que l'attente n'était pas constante : 26 minutes sur un envoi, 33 secondes sur un autre.

La cause a été trouvée. Le 12/10 au soir, une correction qui allégeait ce contrôle a été annulée 5 minutes plus tard par une autre modification du même script. Pendant 8 jours, 25 envois ont attendu, avec au moins 141 minutes perdues, jusqu'à ce que vous le signaliez. Le défaut est corrigé depuis le 20/10 au matin ; la garde prend aujourd'hui de 35 à 47 secondes.

La première étude a pris cet exemple pour le cadre. Elle proposait 3 sondes : durées des envois, avertissements qui survivent à leur correction, contrôles qui ne trouvent rien. Vous l'avez rejetée : « Le diagnostic n'est pas le bon. » Le contrôle qui relit chaque travail contre votre demande l'avait pourtant jugée conforme. C'est en soi un constat : un exemple cité dans une demande a été lu comme son périmètre, et rien ne l'a arrêté.

## 4. Ce qui est mesuré

Comment lire : une ligne par constat, avec le chiffre, la période et ce qu'il dit du système.

| Constat | Mesure | Lecture |
|---|---|---|
| La Factory corrige vite | 681 items créés au registre en 30 jours, 605 corrigés, délai médian de 6 heures | La boucle d'amélioration tourne |
| Elle corrige surtout elle-même | 303 items sur 681 (44 %) portent sur ses propres contrôles : règles qui se trompent (166, dont 82 faux positifs d'oracle), contrôles non appelés (91), hooks (46) | Une grande part du travail sert l'appareil, pas les livrables |
| Elle ajoute bien plus qu'elle ne retire | Du 20/09 au 20/10 : 95 112 lignes ajoutées contre 6 762 retirées, 963 fichiers ajoutés contre 195 supprimés | Rapport de 14 pour 1 |
| Elle grossit vite | Du 01/09 au 20/10 : gabarit de compte rendu de 52 à 182 Ko, règles de forme de 34 à 83, oracles de 37 à 90, scripts de 18 à 62 | Seul le fichier d'instructions principal, plafonné à 6 Ko par un contrôle, n'a pas grossi |
| Le contrôle de fin de tour sanctionne la forme | 250 refus en 30 jours ; environ 2 sur 3 pour un compte rendu absent ou incomplet ; 77 des 83 règles de forme n'apparaissent dans aucun refus | Le coût se concentre sur le format, pas sur le fond |
| Vous reprenez souvent | 787 messages de votre part en 30 jours ; sur un échantillon de 60, 12 corrigent ou rejettent ce qui a été rendu (environ 20 %, entre 12 et 32 %) | Une demande sur 5 environ revient |
| Vous décidez beaucoup | 47 décisions posées du 17 au 20/10, soit environ 12 par jour | La charge de décision est lourde |
| Le mécontentement n'est plus recueilli | Aucune insatisfaction inscrite depuis le 14/09 ; le gabarit qui sert à les recueillir n'a été lu par aucune session en 30 jours | Les reprises se perdent dans la conversation |
| Rien n'est abandonné | Sur 606 process relevés, aucun process versionné n'est resté sans usage en 30 jours | Le coût vient de la taille, pas de restes à balayer |
| Chaque session paie un coût d'entrée | Environ 22 900 caractères injectés à l'ouverture d'une session du pilot ; 21 familles d'avertissements récurrents, dont 7 qui reviennent après avoir été déclarées corrigées | L'ouverture devient un bruit de fond |
| Une forge est à l'arrêt | La forge chargée de l'observation continue n'a aucun commit en 30 jours ; 52 % des commits des forges citent un item du pilot | Les forges avancent au rythme du pilot |

## 5. Ce que l'étude propose

### Juger un process par ce qu'il rend aux demandes

7 critères d'adéquation, dont 5 sont mesurés aujourd'hui :

1. acceptation d'un livrable au premier passage (non mesurée) ;
2. reprises demandées par vous (environ 20 % des messages) ;
3. attente que vous subissez ;
4. décisions qui vous arrivent ;
5. coût en jetons et en minutes ;
6. défauts échappés aux contrôles ;
7. process qu'aucune demande n'appelle, et demandes qu'aucun process ne sert (mesuré en partie).

### 10 périmètres où intervenir

Noyau et gouvernance ; comptes rendus et décisions ; qualité et oracles ; hooks et gardes ; registre et boucle d'amélioration ; publication et postes de travail ; agents ; forges de chaîne ; forges transverses ; produits.

### 7 façons d'intervenir, chacune avec sa preuve préalable

| Levier | Preuve exigée avant d'agir |
|---|---|
| Ajouter | Une demande récurrente qu'aucun process ne sert, et l'existant le plus proche |
| Modifier | Le défaut mesuré, et un cas qui échoue avant et passe après |
| Optimiser | Le coût mesuré, avant et après, en usage réel |
| Fusionner | Les 2 process rejoués sur les mêmes cas : le résultat trouve au moins autant |
| Supprimer | Un rejeu sur l'historique montre qu'aucun défaut ne passerait ; une garde de sécurité ne se retire jamais sur son seul silence |
| Automatiser | Les voies automatiques essayées et leur résultat |
| Rendre à l'humain | Le taux d'erreur du contrôle automatique |

### Les impacts à peser pour chaque intervention

Les process qui en dépendent ; les tests à rejouer ; les produits qui en héritent ; votre charge ; le coût ; la possibilité de revenir en arrière.

### L'effet attendu sur la qualité

L'effet n'existe que si la boucle se ferme : observer, proposer, décider, puis mesurer l'effet en usage réel. Les indicateurs proposés, avec leur valeur de départ :

- reprises par message : environ 20 % ;
- refus de fin de tour pour format absent : environ 165 sur 250 en 30 jours ;
- lignes ajoutées par ligne retirée : 14 ;
- taille du gabarit de compte rendu : 182 Ko ;
- part des items qui portent sur les contrôles eux-mêmes : 44 % ;
- faux positifs d'oracle : 82 en 30 jours.

### Le mécanisme de l'œil critique

- **Mesurer** : des scripts déterministes, rejoués chaque semaine, sans coût en jetons. Ce sont eux qui ont produit les mesures les plus fortes de l'étude.
- **Juger** : un agent, chaque mois ou quand un indicateur franchit un seuil, lit ces mesures contre vos demandes. Il propose au plus 5 améliorations, dont au moins une suppression ou fusion si l'une passe la preuve.
- **Décider** : vous, ou le pilot selon la nature de la décision.
- **Se juger lui-même** : la part de ses propositions acceptées, et leur gain mesuré un mois plus tard. Il est revu ou retiré s'il ne fait rien accepter en 2 cycles.

## 6. Les 12 scénarios

Classés par gain attendu. Comment lire : une ligne par scénario, avec son déclencheur mesuré, le levier et la mesure de succès.

| N° | Scénario | Déclencheur mesuré | Levier | Succès si |
|---|---|---|---|---|
| 1 | Plafonner la taille du gabarit de compte rendu | 52 à 182 Ko en 7 semaines | Optimiser, fusionner | Il reste sous le plafond et les refus baissent |
| 2 | Retirer les règles de forme qui ne refusent rien | 77 règles sur 83 absentes des refus | Supprimer après rejeu | Aucun défaut nouveau sur les comptes rendus déjà jugés |
| 3 | Ne plus traiter une réponse courte comme un compte rendu manqué | 2 refus sur 3 pour format absent | Modifier | Ces refus sont divisés par 2 en un mois |
| 4 | Mesurer le bruit d'une règle avant de la rendre bloquante | 82 faux positifs d'oracle en 30 jours | Modifier | Moins de 30 par mois |
| 5 | Lancer un contrôle seulement quand il peut trouver quelque chose | 4 domaines de contrôle sans échec sur 662 passages ; 2 023 jugements impossibles | Optimiser | Écritures plus rapides, sans défaut échappé nouveau |
| 6 | N'afficher à l'ouverture que ce qui a changé et ce qui demande un geste | 22 900 caractères par ouverture ; 21 familles d'avertissements récurrents | Supprimer, modifier | Contexte d'entrée divisé par 3 |
| 7 | Vérifier un gain en usage réel, une semaine après la correction | La régression de 8 jours sur la publication | Modifier | Aucune régression trouvée par vous sur un item clos depuis moins d'un mois |
| 8 | Un seul distributeur de numéros pour les 2 postes de travail | Numéros pris des 2 côtés, puis renumérotés | Modifier | Aucune collision en un mois |
| 9 | Un seul relecteur d'intention, qui vérifie qu'un exemple n'est pas devenu le périmètre | 5 mécanismes de relecture ; la première étude du jour jugée conforme à tort | Fusionner, modifier | La dérive du 20/10 est détectée au rejeu |
| 10 | Prioriser le travail des forges selon les demandes des produits | 52 % des commits tirés par le pilot ; une forge à l'arrêt | Modifier, mettre en sommeil | Part du travail d'origine produit suivie chaque mois (hypothèse à confirmer) |
| 11 | Ne plus imposer aux produits ce qu'ils n'emploient pas | Leur fichier d'instructions hérité pèse 25,8 Ko, contre 6 Ko au pilot | Supprimer dans l'héritage | Sessions de produits plus légères (hypothèse à confirmer) |
| 12 | Transformer vos reprises en insatisfactions suivies | Environ 20 % de reprises ; aucune insatisfaction inscrite depuis le 14/09 | Automatiser, ajouter | Chaque reprise trouve son process responsable dans la semaine |

## 7. Ce qui reste ouvert

- **La décision en attente.** Mettre l'œil critique en service et lancer d'abord les scénarios 3, 1 et 12 (recommandé) ; ou le mettre en service sans scénario ; ou ne rien mettre en service.
- **Ce qui n'est pas mesuré.**
  - L'acceptation au premier passage, livrable par livrable.
  - Le lien entre chaque reprise et le process qui l'a causée.
  - Ce que chaque produit emploie vraiment de son héritage.
  - L'effet des 77 règles de forme avant l'affichage d'un compte rendu.
- **Les tensions à arbitrer.**
  - Alléger fait gagner du temps, mais peut laisser passer des défauts. Jusqu'où retirer ?
  - Un œil critique est un process de plus. Comment l'empêcher de grossir comme les autres ?
  - Qui doit trancher ses propositions : vous, ou le pilot pour celles qui sont réversibles et peu coûteuses ?

## 8. Pistes pour le travailler à l'extérieur

Questions qui méritent un regard neuf :

1. Quels 3 indicateurs, et pas plus, diraient chaque semaine si la Factory sert mieux vos demandes ?
2. Quelle règle simple empêcherait le système de grossir : un budget de taille, « une règle entre, une règle sort », une date d'expiration par règle ?
3. Le fait qu'un message sur 5 soit une reprise est-il normal pour ce type de travail, ou le signe d'un défaut de compréhension en amont ?
4. Faut-il juger les process par famille (règles, oracles, hooks, agents), ou partir de chaque demande pour remonter les process qu'elle a traversés ?
5. Quelles améliorations l'IA peut-elle décider seule, et lesquelles doivent vous revenir ?

Pour un autre assistant, un point de départ possible :

```
Je pilote un système de production assisté par IA : un dépôt central qui orchestre, 13 dépôts
spécialisés et environ 39 projets clients. Il s'est accru vite : en 7 semaines, son gabarit de
compte rendu est passé de 52 à 182 Ko et ses règles de forme de 34 à 83 ; il ajoute 14 lignes
pour 1 retirée ; 44 % de ses corrections portent sur ses propres contrôles ; environ 1 de mes
messages sur 5 corrige ce qui m'a été rendu. Je veux un « œil critique » permanent qui juge si
mes process répondent bien à mes demandes, et qui propose quoi ajouter, modifier, optimiser
ou supprimer. Aide-moi à choisir 3 indicateurs, une règle anti-accroissement, et à classer
les 12 scénarios ci-joints par rapport gain/risque.
```

## 9. Sources

Documents du pilot, dans le dépôt `digit-ai-factory` :

- l'étude complète : `output/03-etudes/Digit-AI - Étude - Oeil critique global des process - 20261020a.md` ;
- l'analyse du prompt qui l'a lancée : `output/03-etudes/20261020-L99-oeil-critique-global-des-process.md` ;
- la première étude, rejetée : `output/03-etudes/20261020-etude-opportunite-oeil-critique-des-process.md` ;
- le registre d'améliorations : `todo/TODO.jsonl`, items du 20/09 au 20/10/2026 ;
- les transcripts des sessions des 2 profils Claude Code du poste, du 20/09 au 20/10/2026.

Références externes, citées par l'étude :

- Google, rapport DORA « State of AI-assisted Software Development », 23/09/2025 : l'IA amplifie les forces et les dysfonctions d'une organisation ;
- Anthropic, « Effective context engineering for AI agents », 29/09/2025 : le plus petit ensemble d'informations à fort signal ;
- Anthropic, « Building effective agents », 12/2024 : partir du système le plus simple qui marche ;
- Adams et al., « People systematically overlook subtractive changes », Nature, 04/2021 : on pense à ajouter avant de retirer.
