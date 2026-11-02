# Étude — une vidéo où Claude reçoit 100 fois la consigne « fais mieux »

Vidéo : « I Told Claude to "Make it better" 100 Times (It Went Too Far) », Nate Herk (chaîne AI Automation), 13 min 50, <https://www.youtube.com/watch?v=DByAR5Su1Yw>. Étude du 02/11/2026, écrite pour le porteur de la Factory.

## La conséquence pour la Factory

La vidéo ne justifie aucun changement de méthode. Le protocole testé est l'inverse de celui de la Factory : ni objectif écrit, ni référence extérieure, ni droit de s'arrêter.

Elle révèle en revanche deux manques chez nous. Le premier, l'auteur n'en parle pas : les deux modèles remplissent le site de faits inventés, avis, rareté et chiffres de vente. Le second, il le nomme : rien dans une boucle ne récompense le retrait. Nos skills de design et notre skill de boucle n'en disent rien non plus.

Sa thèse tient comme hypothèse, pas comme preuve : 1 essai par modèle, l'auteur pour seul juge, et une publicité placée au milieu pour un skill qui répond au problème décrit.

## Le protocole

Un site de café volontairement laid, « Bean There Coffee », de 54 lignes, reçoit 100 fois de suite la même consigne, lue à l'écran à 00:27 :

> « Look at the site first. Then innovate: think about the user experience and think outside the box. Make one bold change that improves conversions or the look and feel, not a small tweak. Use any tool you have. You must ship a change every time. »

Deux essais en Claude Code : Sonnet 5.5 et Opus 5.5, tous deux en effort moyen. Chaque essai tourne sans skill, sans `CLAUDE.md`, sans plugin et sans mémoire (01:30).

La dernière phrase de la consigne n'est pas un détail. Sans elle, les modèles s'arrêtaient vers le tour 20 ou 25 en disant qu'il ne restait rien à faire (00:47). L'écran de 12:40 ajoute qu'ils refusaient, demandaient une précision ou se contentaient de polir.

## Les résultats

Les valeurs viennent de l'écran quand il les montre, parce que la transcription automatique en déforme plusieurs.

| Mesure | Sonnet 5.5 | Opus 5.5 | Où |
|---|---|---|---|
| Valeur au tarif API | 21,93 USD | 137 USD | écran 02:18 et 08:04 |
| Lignes au tour 100 | 2 724 | 20 898 | écran 05:04 et 10:40 |
| Images générées | 13 | 54 | écran 02:18 et 08:04 |
| Vidéos générées | 2 | 3 | écran 02:18 et 08:04 |
| Première vidéo | tour 24 | tour 7 | parole 12:29 |
| Durée | presque 2 h | 8,5 h, déduit | parole 12:03, voir plus bas |
| Captures de son propre site | 491 | 1 115 | écran 12:40 |
| Recherches web | 0 | 0 | parole 12:47 |
| Tours sans changement | 0 | 0 | écran 12:40 |

Calculs de cette étude : Opus coûte 6,25 fois Sonnet et produit 7,67 fois plus de lignes. Il prend 11,15 captures par tour contre 4,91.

La durée d'Opus est transcrite « 8 and 1,500 hours », ce qui n'a pas de sens. L'écran dit « about 4.5x as long » : 8,5 h correspond à ce rapport avec presque 2 h pour Sonnet (8,5 / 4,5 = 1,89). C'est une déduction, pas une lecture.

## Le déroulé tour par tour

Le tableau de bord de l'auteur marque des jalons : Sonnet aux tours 1, 2, 7, 24 et 32, Opus aux tours 1, 7, 15 et 32. Le tableau se lit par tour : chaque colonne de coût donne la valeur API de ce tour, puis le total de lignes du site à ce tour. « non montré » veut dire que l'auteur n'ouvre pas ce tour à l'écran.

| Tour | Sonnet : coût, lignes | Ce qui arrive | Opus : coût, lignes | Ce qui arrive |
|---|---|---|---|---|
| 1 | 0,14 USD, 175 | image de fond, premier JavaScript | 0,50 USD, 438 | image, animation, police serif que l'auteur dit « classique » d'Anthropic |
| 2 | 0,12 USD, 253 | barre de commande qui suit le défilement | non montré | |
| 7 | 0,22 USD, 419 | panneau « Order in one tap » | 0,62 USD, 1 086 | vidéo de fond, thème sombre |
| 15 | non montré | | 1,28 USD, 2 182 | formulaire, code QR qui prépare un SMS de commande |
| 24 | 0,16 USD, 778 | vidéo de fond, ticket de commande | non montré | |
| 32 | 0,24 USD, 1 089 | formulaire de commande à l'avance | 1,08 USD, 5 337 | curseur de choix de boisson, abonnement quotidien |
| 50 | non montré | | 1,31 USD, 8 994 | héros réécrit, son d'ambiance |
| 65 | 0,26 USD, 1 951 | menu latéral, retiré plus tard | non montré | |
| 100 | 0,27 USD, 2 724 | saisie vocale, avis, affluence, encore lisible | 1,38 USD, 20 898 | surchargé et cassé, voir plus bas |

Au tour 100, l'auteur juge le site de Sonnet meilleur, et se demande à partir de quel tour c'est trop (06:21). Il juge celui d'Opus « AI slop », et il donne 4 exemples :

- une citrouille à sculpter au couteau petit ou grand (10:59) ;
- un calculateur de caféine et de sommeil (11:21) ;
- une bascule en espagnol qui ne traduit pas la section visible (11:30) ;
- une section devenue inopérante (11:19).

 Au tour 32 d'Opus, il aurait déjà pu s'arrêter (10:29).

La rupture la plus nette ne vient pas de l'auteur. Les deux modèles divergent dans leur rythme d'ajout :

| Lignes ajoutées par tour | Début | Milieu | Fin |
|---|---|---|---|
| Sonnet | 29,5 (tours 1-32) | 26,1 (32-65) | 22,1 (65-100) |
| Opus | 158,0 (tours 1-32) | 203,2 (32-50) | 238,1 (50-100) |

Sonnet ralentit et Opus accélère, sous la même consigne. La vidéo n'explique pas cet écart. Il en découle que 74,5 % des lignes finales d'Opus arrivent après le tour 32, celui où l'auteur se serait arrêté.

## Les conclusions de l'auteur, jugées

Sur les 7 affirmations qu'il affiche, 1 reste à démontrer. Les 6 autres tiennent, avec une réserve pour 3 d'entre elles.

| Affirmation de l'auteur (écran 12:40) | Mon avis |
|---|---|
| Le modèle fixe le plafond, la consigne fixe la direction ; Sonnet raffine, Opus invente | Plausible, non démontré : 1 essai par modèle, un seul niveau d'effort |
| « Innover » sans vision revient à ajouter, et rien dans la boucle ne récompense le recul | Solide, et c'est le constat qui nous concerne |
| « Improves conversions » est pris à la lettre : presque tout devient commande, vente additionnelle ou fidélité | Confirmé par les images : combos, remises, tampons, abonnement |
| Quelques lignes de consigne changent tout | Solide, et sous-estimé : voir la section suivante |
| 100 changements sur 100 tours, aucun tour à vide | Fait, mais imposé par la consigne, donc sans valeur de résultat |
| Opus coûte 6 fois Sonnet et prend 4,5 fois plus de temps | Fait, en valeur théorique : il a payé une partie par abonnement (12:15) |
| Les modèles regardent sans cesse leur site, jamais l'extérieur | Fait, mais peu surprenant : voir la section suivante |

Il avance aussi, sans le mesurer, un plafond d'environ 80 sur 100 pour une consigne vague (01:18). Ce chiffre est une image, pas une mesure.

## Les limites de la preuve

La thèse de la vidéo repose sur 7 appuis fragiles.

- **Le titre vient en partie du protocole.** Laissés libres, les modèles s'arrêtaient vers le tour 20 ou 25. Le débordement mesure donc une boucle forcée à continuer plus qu'un défaut de jugement du modèle.
- **La surprise sur le web est mal fondée.** La consigne commence par « Look at the site first » et ne demande aucune référence. La vidéo ne montre pas non plus que la recherche web était disponible dans cet environnement.
- **La conversion n'est jamais mesurée.** C'est l'objectif de la consigne, et aucun utilisateur ne teste le site. L'auteur juge seul, à l'œil, en sachant quel modèle il regarde.
- **L'absence de jalon après le tour 32 ne dit rien de la qualité.** Les jalons visibles sont des « premières fois » : premier formulaire, premier canvas. Une liste de premières fois s'épuise d'elle-même, et les deux essais finissent au même tour. C'est mon interprétation.
- **Le repère « Broke » n'a rien signalé.** Sa légende existe sur le tableau de bord. Je ne vois aucun repère rouge sur les images lues, à leur résolution, alors que l'auteur trouve des sections cassées au tour 100. Il mesure probablement un plantage, pas une régression.
- **Le coût est incomplet.** Le générateur d'images et de vidéos n'est pas nommé, alors que l'essai se dit sans plugin. La vidéo ne dit pas si son prix entre dans la valeur API.
- **L'auteur a un intérêt.** De 07:09 à 07:34, il présente Scrollcraft, son skill gratuit de design, accessible par un formulaire d'inscription. Sa thèse, l'IA manque de goût sans aide, sert cette offre. Cela n'invalide pas l'observation, cela demande de la lire avec recul.

## Trois faits visibles que l'auteur ne commente pas

**Les modèles inventent des faits vérifiables.** La partie visible du site d'origine (00:00) dit : ouvert depuis 2009, torréfaction sur place, wifi, carte de fidélité auprès de Linda, et un menu. Les éléments suivants n'y figurent pas.

Chez Opus :

- « Read all 1,284 on Google », un nombre d'avis (11:44) ;
- six habitués nommés, avec citation, dont Marcus, Priya et Dana (09:54) ;
- « Huila, Colombia », origine et notes de dégustation du café (09:01) ;
- « 41 ordered this week », un volume de ventes (11:38) ;
- le détail des 4,75 USD d'une tasse, dont un fournisseur de lait nommé (11:49) ;
- « 115 pumpkins sent in » (10:50) ;
- des doses de caféine au coucher, avec « Most people sleep fine on that » (11:21).

Chez Sonnet :

- « only two left, baked at 11 a.m. », une rareté (parole 05:48) ;
- « 33 days left », une échéance (05:59) ;
- une attente en cours d'environ 2 minutes (07:03) ;
- « Popular combo », une popularité, et un prix barré de 8,25 USD à 7,25 USD (04:21).

Le site est fictif, donc l'essai ne trompe personne. Sur un vrai commerce, ce sont de faux avis, une fausse rareté et une allégation de santé. En droit français, cela relève des pratiques commerciales trompeuses (référence de mémoire, non relue).

**Une commande affiche une fonction qu'elle ne tient pas.** La bascule EN/ES d'Opus ne traduit pas la section visible (11:30). Le bouton vocal « Say it » de Sonnet n'est pas essayé à l'écran (06:43), donc rien n'en est établi. Notre loi n° 1 vise ce cas : une commande existe si elle fonctionne.

**Opus construit sa propre échappatoire.** Son menu latéral montre au moins 20 entrées visibles, et la liste défile (10:50). Un interrupteur « Just order » apparaît à côté. Son effet n'est pas montré, mais son nom dit le problème.

## Confrontation à la Factory

Sur 7 points, 4 sont couverts, 1 a une limite connue et écrite, et 2 manquent.

| Point mis en cause | Dispositif de la Factory | Verdict |
|---|---|---|
| Aucune vision | `EXIGENCES.json` scellé, `DESIGN.md`, jetons de `systeme-de-marque` | Couvert |
| Aucune référence extérieure | `BARRE-EXTERNE.md` de `systeme-de-marque` (5 références datées au moins, `oracle-barre-externe`), skill `la-barre` | Couvert |
| Aucun droit de s'arrêter | `la-boucle` : arbitre figé avant le premier candidat, 3 à 5 essais environ ; forge-tests : 5 cycles au plus | Couvert |
| Rendu générique | Loi n° 6, `oracle-taste` | Couvert, non rejoué ici |
| Commandes à moitié câblées | Loi n° 1 et le pan « inerte » de forge-tests, qui « attrape l'inerte flagrant » et « ne certifie pas le câblé » | Limite connue et écrite |
| Contenu commercial inventé | Règle « Aucune donnée inventée non signalée » de `ameliore-le-design`, contrôlée par la présence d'un bandeau sur la maquette | **Manque** : TF-2050 |
| Récompense du retrait | Aucune trouvée | **Manque** : TF-2051 |

Les 4 lignes « Couvert » valent dans un run de la Factory. Une session qui reçoit « améliore ce site » hors run n'y passe que si un skill se déclenche, et je n'ai pas mesuré cette fréquence.

Le premier manque est précis. Le bandeau « Données de démonstration » protège une maquette, pas la page servie. J'ai cherché « témoignage », « avis client », « preuve sociale », « dark pattern », « faux avis » et « contenu inventé ». Aucun oracle ne les porte dans forge-design, forge-tests, forge-conception et forge-seo-geo. Cette recherche porte sur des mots : elle prouve que ces mots manquent aux oracles, pas qu'aucun contrôle ne s'en approche sous un autre nom. Je n'ai pas fait de recherche par structure.

Le second manque est de même nature. J'ai cherché « retir », « supprim », « soustra », « enlev » et « moins ». Ces mots n'apparaissent à ce sens ni dans `ameliore-le-design` ni dans `critique-le-design`. `la-boucle` n'emploie « retirer » que pour le mot-clé d'appel. `critique-le-design` juge bien la densité, en D3, sur une page donnée. Personne ne juge ce qu'une passe a ajouté par rapport à la précédente. Notre loi n° 3, qui propose d'office la surface implicite, pousse d'ailleurs vers l'ajout : elle a besoin de ce contrepoids.

## La position retenue

Je ne change rien à la méthode, et je consigne les 2 manques au registre comme candidats.

1. **Je ne refais pas l'expérience.** Elle coûterait de l'ordre de 159 USD en valeur API pour un résultat toujours à 1 essai par modèle, et la Factory n'est pas exposée au protocole.
2. **Une boucle d'amélioration garde le droit de dire « rien ».** Le signal le plus utile de la vidéo est là. Le modèle libre s'arrête vers le tour 20 ou 25, et c'est le forçage qui produit le désastre.
3. **Une consigne d'amélioration s'écrit autrement.** Si vous relancez un modèle sur un site existant, cette forme tient compte de tout ce qui précède :

   > « Lis `DESIGN.md` et les exigences, puis regarde le site et la référence <nom>. Propose une seule modification, ajout ou retrait, et dis ce qu'elle retire si elle ajoute. N'affiche aucun chiffre, avis ni client absent des sources. Tu peux répondre qu'il n'y a rien à changer. »

   Cette forme est une proposition, je ne l'ai pas testée.
4. **Je ne vais pas chercher Scrollcraft.** Ce qu'en dit sa page (07:22) recoupe `systeme-de-marque` et `critique-le-design` : entretien de cadrage, guide de typographie, contrôle visuel par captures. L'ajout le plus net est l'animation au défilement, sans demande mesurée chez nous. Je ne l'ai ni installé ni lu.
5. **La vidéo ne remplace pas le re-test de routage dû depuis le 25/09.** Le relevé d'ouverture le rappelle pour Sonnet 5.5 et Opus 5.5. Un essai à une seule répétition sur un café fictif n'y répond pas.

## Méthode et limites

Cette étude repose sur la seule vidéo, lue par sa transcription et ses images.

- **Sources** : transcription locale en anglais (faster-whisper, modèle `base`, 356 segments) et 60 images lues en 1024 px, retenues sur 199, les 139 autres étant quasi identiques.
- **Corrections de transcription** :
  - « Sonic » et « OBS » sont Sonnet et Opus ;
  - « and theropic font » est lu « Anthropic font » ;
  - « Cloud Code » et « cloud at MD » sont Claude Code et `CLAUDE.md` ;
  - « bin their coffee » est Bean There Coffee ;
  - 29,93 USD et 11 images se lisent 21,93 USD et 13 images à l'écran ;
  - « 137.54 AI images », précédé d'un dollar, se lit 137 USD et 54 images.
- **Écart non résolu** : l'auteur dit aussi « about 22 dollars » pour Sonnet (12:10), ce qui confirme l'écran, pas ses « 29,93 USD » de 02:09. Le mot exact prononcé n'est pas vérifiable sans réécoute.
- **Non vérifié** : les sites et le tableau de bord tournent en local chez l'auteur, je ne les ai vus qu'à travers la vidéo. Le code n'est pas lu, les pannes sont celles que l'auteur montre. L'absence d'un fait dans le site d'origine ne vaut que pour sa partie visible.
- **Coûts calculés** : les rapports et les pentes de cette étude sont recalculés par script depuis les valeurs lues à l'écran.
- **Conditions d'utilisation** : le téléchargement d'une vidéo YouTube est contraire à leurs conditions. La copie de travail, locale, a été supprimée, et la transcription n'est pas reproduite ici.
