---
role: restitution de fin de tour, mandat transverse du 22/09/2026, cinquième tour
sources_de_verite: todo/TODO.jsonl · todo/CLASSES.json · REGLES-PROJET.md · oracles/oracle-regle-sans-juge.mjs
verifie_le: 2026-09-22
---

# Digit-AI — Synthèse de mandat — 4 décisions exécutées et 5 dossiers instruits — 22/09/2026

## 0. Synthèse d'ouverture

Les 4 décisions que vous avez tranchées sont exécutées. Le corpus de règles du pilotage n'a plus
une seule règle écrite que rien ne joue : les 2 dernières ont reçu leur contrôle, et la troisième
a reçu une exemption écrite dont le motif tient au fait qui l'a fondée — son objet est la qualité
d'un raisonnement, et un contrôle rendrait vert sur le cas même qui l'a fait naître. Le registre
sait désormais distinguer ce qui est un défaut de ce qui n'en est pas : trois dossiers venus
d'études d'opportunité ne portent plus de classe de défaut mais une nature propre, et la porte
d'écriture l'impose. Pour les cinq dossiers sur lesquels vous avez demandé de quoi juger,
vous aviez raison de ne pas trancher : en allant chercher les définitions complètes plutôt que
leurs noms, une de mes recommandations s'est révélée fausse, et deux des 3 classes que je vous
proposais ailleurs n'ont elles-mêmes aucun juge. Votre question sur la création d'une classe neuve
reçoit deux réponses différentes, et c'est la règle du cliquet qui les sépare : dans un cas la
classe peut naître aujourd'hui parce qu'un contrôle existant la joue, dans l'autre elle ne le peut
pas sans qu'un contrôle soit écrit d'abord. Ce qui est attendu de vous : 5 arbitrages, chacun avec
les éléments sous les yeux.

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-16 à D-19, et instruction documentée des dossiers D-11 à D-15.
- **sur quoi** — le corpus opposable du pilotage, son référentiel de classes et sa porte d'écriture.
- **quand** — fin le 22/09/2026 à 16:11 (UTC+02:00), durée 5 h 54 depuis l'ouverture de la session.
- **qui** — session du pilotage, `v1.17.30-697-g830f698`.
- **intention** — vous avez tranché 4 décisions et demandé, pour 5 autres, soit des éléments
  concrets, soit un avis sur la création d'une classe neuve. **Test rétro** : servie — les 4
  tranchées ont leur preuve exécutée au bloc 4, et les 5 autres reviennent avec la DÉFINITION
  complète de chaque classe candidate plutôt que son nom. Un écart est au bloc 6 : une de mes
  recommandations était fausse, et c'est votre refus de trancher sans éléments qui l'a mise au jour.

## 2. Verdict en une ligne

Le juge des règles passe de FAIL à PASS — 56 règles déclarées, 55 nommées par un exécutable, 1
exemptée et nommée au verdict —, 2 contrôles neufs portent 28 cas d'épreuve à double sens, la
porte d'écriture du registre passe de 25 à 29 cas, 3 dossiers reçoivent une nature distincte de la
classe de défaut, 5 calibrations sont mesurées sur les oracles eux-mêmes, 1 recommandation
fausse est retirée, et le harnais passe de 146 à 150 contrôles dont 149 verts.

## 3. Décisions attendues de l'humain

Ce bloc porte 5 décisions, qui reprennent les numéros D-11 à D-15 : ce ne sont pas des décisions
neuves, ce sont les mêmes, instruites. Chacune porte désormais le FAIT MESURÉ du dossier, puis la
définition complète de chaque classe candidate — son libellé, la règle où elle vit et le contrôle
qui la joue — parce que c'est cela qui manquait. Une classe dont le contrôle est « à créer » est
signalée comme telle : l'y rattacher déplacerait le dossier dans une autre attente. Pour répondre,
un sélecteur suffit, par exemple « D-11 d ».

Les 5 bloquants qui restent, chacun énoncé sur place :

- **Cinq dossiers du registre restent sans classe, et la porte posée hier ne peut rien pour eux.**
  Elle refuse les créations à venir ; elle ne réécrit pas ce qui est déjà écrit. Pour les lever, il
  faut trancher chacun, éléments sous les yeux. Si rien n'est fourni, ils restent invisibles au
  compteur que la porte existe pour rendre lisible.
- **Le circuit d'intégration hébergé du pilotage ne peut toujours pas s'activer.** Sa simulation
  rend rouge et ses 2 causes sont connues, l'une nommée à la ligne par un contrôle du parc. Pour le
  lever, il faut autoriser ces 2 corrections puis relancer la simulation. Si rien n'est fourni,
  l'activation reste fermée, et c'est le bon comportement.
- **Le contrôle des empreintes rend rouge sur le parc réel, et c'est le seul rouge du harnais.**
  Un site de scellement est apparu dans une forge sans être déclaré à la table. Pour le lever, il
  faut dire si ce site se déclare ou se retire. Si rien n'est fourni, le harnais garde un rouge
  permanent, qui finit par ne plus être lu.
- **La garde de recette d'un module du pilotage lit les arguments du processus à son chargement.**
  Un banc qui importe ce module part jouer le banc de l'importé et affiche un vert qui n'est pas le
  sien. Pour le lever, il faut autoriser l'ancrage de cette garde sur son point d'entrée. Si rien
  n'est fourni, un banc neuf peut continuer de rendre le vert d'un autre.
- **Les 10 candidatures de plus haute valeur du registre attendent votre arbitrage.** Faire passer
  une candidature en décidé est un geste humain, et ces 10 dossiers portent des contrôles qui
  rendent aujourd'hui un verdict faux. Pour le lever, il faut que je vous les déroule un par un.
  Si rien n'est fourni, le registre recomptera les mêmes récidives.

> **D-11 — Faut-il créer une classe pour le produit à moitié instancié qu'aucun dépôt ne suit ?**
>
> LE FAIT. Le rejeu de la règle d'héritage, le 24 août, a trouvé sur ce poste un troisième produit
> qui porte un dossier `forge\retours\` — donc quelqu'un a commencé à l'instancier — et à qui il
> manque les 4 artefacts hérités : le gabarit de retours, le lanceur de hameçons, le câblage de
> configuration et son propre fichier de noyau. Surtout, `git rev-parse` n'y rend rien : il n'a pas
> de dépôt. Rien de ce qui s'y fait n'est suivi, ni versionné, ni remontable.
> LES CANDIDATES, avec ce que j'avais omis de vous donner. « Une correction close au pilot ne
> redescend pas sous une forme que le producteur rencontre » — c'est la règle de la DESCENTE d'une
> correction, écrite dans `references/TODO-FORGE.md` et jouée par le contrôle du registre ; elle parle d'une CORRECTION qui ne redescend pas, pas d'un produit
> jamais instancié. « L'avertissement d'héritage arrive à l'ingestion du lot au lieu de l'ouverture »
> — jouée par `scripts/relever-heritage.mjs` ; elle parle du MOMENT de l'avertissement, et ici
> l'avertissement a bien eu lieu, à sa date.
>
> **Recommandation : (d).** Source consultée : les 2 entrées de `todo/CLASSES.json` ci-dessus, lues
> en entier — et je retire la recommandation que je vous avais donnée, qui était fausse. Aucune
> des 2 ne décrit ce cas. La règle du cliquet du 16/09 autorise une classe neuve qui nomme un contrôle
> EXISTANT : le contrôle de conformité du projet, dans sa règle qui juge l'héritage d'un produit,
> est joué par `oracles/self-test.mjs` et c'est lui qui a produit la mesure ci-dessus.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la classe de la boucle de retour sans descente | nul | répondre « D-11 a » | exclut la fidélité du compteur : la classe parle d'une correction qui ne redescend pas, pas d'un produit jamais instancié |
| (b) la classe de l'avertissement d'héritage tardif | nul | répondre « D-11 b » | exclut la cause réelle : l'avertissement a bien eu lieu à sa date, c'est l'instanciation qui n'a jamais été faite |
| (d) créer la classe du produit instancié à moitié et hors de tout dépôt, qui nomme le contrôle d'héritage existant | effort simple × court | répondre « D-11 d » | exclut le rattachement immédiat à une classe déjà comptée ; le référentiel gagne une entrée |

> **Si rien n'est décidé** : aucune option ne s'applique d'office — le dossier reste sans classe, et
> un produit sans dépôt continue de travailler sans que rien ne le suive.

> **D-12 — Quelle classe donnez-vous à la porte de fraîcheur qui empreinte un échantillon ?**
>
> LE FAIT. Le contrôle de fraîcheur de déploiement de `references/ETAPE-MEP.md` exige qu'une valeur
> de fraîcheur soit une fonction de l'ENSEMBLE déployé — empreinte du manifeste de l'arbre de
> sortie, ou identifiant d'enregistrement injecté à la génération. La porte d'un produit empreinte
> UNE page et conclut sur les 203. Mesure du 26 août à 11:47 : 70 pages modifiées, la page
> échantillonnée inchangée, « déploiement en ligne au bout d'un essai », dix contrôles au vert,
> « production conforme » — pendant que 2 pages servaient encore l'ancien contenu.
> LES CANDIDATES. « Un contrôle mesure une grandeur CORRÉLÉE à ce qu'il protège au lieu de
> l'invariant lui-même » — jouée depuis ce matin par `oracles/oracle-invariant-mesure.mjs`. « Un
> oracle rend son verdict sans publier ce qu'il ne mesure PAS » — jouée par le contrôle de socle
> `check_html.py`. « Le rendu d'une page est jugé sur le fichier, jamais sur une instance servie » —
> son contrôle est **à créer**, et l'y rattacher déplacerait le dossier dans une autre attente.
>
> **Recommandation : (a).** Source consultée : `todo/CLASSES.json`, dont l'entrée de l'invariant
> donne pour exemple « un compte de fichiers pour une couverture » — une page pour un ensemble
> déployé en est la forme exacte, et la mesure du 26 août montre les 2 aggravations que la classe
> décrit : le verdict est faux avec un calcul juste, donc incontestable.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la classe du contrôle vrai sur le mauvais invariant | nul | répondre « D-12 a » | exclut de lire le cas comme un défaut de publication du périmètre, alors que le calcul lui-même est en cause |
| (b) la classe du périmètre de non-mesure non publié | nul | répondre « D-12 b » | exclut de nommer la substitution de grandeur, qui est la cause ; le périmètre réduit n'est qu'un symptôme |
| (c) la classe du contrôle joué sur le fichier et non sur l'instance servie | nul | répondre « D-12 c » | exclut un rattachement à une classe JUGÉE : le contrôle de celle-ci est encore à créer |

> **Si rien n'est décidé** : aucune option ne s'applique d'office — le dossier reste sans classe, et
> la famille qu'il illustre perd son cas le mieux documenté.

> **D-13 — Quelle classe donnez-vous aux captures d'un produit qui cadrent par fenêtre ?**
>
> LE FAIT. La règle de la doctrine visuelle, entrée le 26 août, exige qu'un verdict visuel s'appuie
> sur au moins une capture PLEINE PAGE. Les scripts de capture d'un produit cadrent par FENÊTRE : 3
> pages sur 203 ont eu une capture pleine, et la vérification du lot fondateur a dû être faite à la
> main. Le point décisif est écrit dans le dossier : `render_page.py` du socle capture DÉJÀ en pleine
> page par défaut, et cela a été vérifié AVANT d'écrire la règle. Le produit avait donc réécrit dans
> son coin un outil qui existait et fonctionnait. La précédence est réglée par `REGLES-PROJET.md` :
> quand la factory est impliquée, ses règles priment, et on les renforce sans les réécrire.
> LES CANDIDATES. « Un producteur écrit son propre contrôle de conformité faute d'avoir trouvé
> l'oracle du socle » — règle du registre des oracles, jouée par ce registre et par le hameçon de
> socle chez le produit. « Une preuve est produite et citée mais ne peut pas être lue » — son
> contrôle est **à créer**. « Le rendu jugé sur le fichier et non sur une instance servie » — son
> contrôle est **à créer** lui aussi.
>
> **Recommandation : (a).** Source consultée : `todo/CLASSES.json`, entrée
> `oracle-remplace-par-controle-maison`, dont le fait fondateur est le même geste reproduit deux
> fois — et c'est la seule des 3 candidates dont le contrôle existe.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) la classe de l'oracle remplacé par un contrôle maison | nul | répondre « D-13 a » | exclut de traiter le cas comme un défaut de rendu, alors que l'outil juste existait et était vérifié |
| (b) la classe de la preuve produite mais illisible | nul | répondre « D-13 b » | exclut un rattachement à une classe JUGÉE : le contrôle de celle-ci est encore à créer |
| (c) la classe du contrôle joué sur le fichier et non sur l'instance servie | nul | répondre « D-13 c » | exclut un rattachement à une classe JUGÉE, et manque la réécriture, qui est la cause |

> **Si rien n'est décidé** : aucune option ne s'applique d'office — le dossier reste sans classe, et
> rien n'empêche le prochain produit de réécrire le même outil.

> **D-14 — Créez-vous la classe du produit dont aucune recette n'exerce les contrôles ?**
>
> VOTRE QUESTION APPELLE OUI, et elle peut être suivie tout de suite. LE FAIT : sur un produit, 15
> fichiers se présentent comme des contrôles — contraste, glossaire, liens, référencement,
> traductions, audit de navigateur, vérification de pages — et AUCUN n'est exercé par une recette.
> Le même relevé sur le pilotage rend 39 sur 39 exercés et zéro accusation. LA NUANCE QUI JUSTIFIE
> UNE CLASSE NEUVE : la classe que je vous proposais dit « un contrôle en service n'a aucun banc de
> fixtures dans les deux sens, et rien ne le dit — pire, son en-tête affirme parfois en avoir » ;
> elle vise UN contrôle et l'écart entre ce qu'il promet et ce qu'il tient. Ici il ne s'agit pas
> d'un contrôle mais d'un DÉPÔT ENTIER sans harnais, et aucun en-tête ne promet rien. Le mot
> « classe » est régi par `references/TODO-FORGE.md`, qui pose qu'une classe est un défaut généralisé
> avec la règle où il vit et l'oracle qui la joue. La règle du
> cliquet du 16 septembre exige qu'une classe neuve nomme un contrôle existant : la règle qui exige qu'un contrôle soit exercé par une
> recette, portée par `oracles/oracle-controles-injoignables.mjs`, mesure exactement cela, et c'est
> elle qui a produit le relevé des 15.
>
> **Recommandation : (a).** Source consultée : `todo/CLASSES.json`, entrée
> `controle-sans-fixture-double-sens` lue en entier, et la règle de l'exercice par une recette,
> portée par le contrôle des injoignables, qui existe, s'exécute et a fourni la mesure. Les 2 conditions d'une classe neuve sont réunies : un
> cas que les classes existantes ne décrivent pas, et un juge qui la joue.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) créer la classe du dépôt sans harnais, qui nomme la règle de l'exercice par une recette | effort simple × court | répondre « D-14 a » | exclut le rattachement à une classe déjà comptée ; le référentiel gagne une entrée |
| (b) la classe du contrôle sans fixture à double sens | nul | répondre « D-14 b » | exclut la distinction entre un contrôle qui promet un banc et un dépôt qui n'a pas de harnais |
| (c) la classe du contrôle écrit et non câblé à son étape | nul | répondre « D-14 c » | exclut la cause : les contrôles sont bien appelés, ils ne sont simplement éprouvés par rien |

> **Si rien n'est décidé** : aucune option ne s'applique d'office — le dossier reste sans classe,
> et 15 contrôles continuent de vieillir sans que rien ne les exerce.

> **D-15 — Créez-vous la classe du livrable sans repère externe, sachant qu'elle n'aura pas de juge ?**
>
> LE FAIT : le registre des repères de qualité externes,
> `la-barre/references/registre-barres.md`, ne porte aucune entrée pour un livrable de
> communication — les mots « propale », « communication » et « marketing » y rendent zéro. Votre
> question appelle OUI SUR LE FOND et NON SUR LA FORME, et c'est le cliquet qui les sépare. Les contrôles d'une proposition commerciale jugent sa forme et sa
> traçabilité, jamais son NIVEAU, et le précédent est mesuré — une direction artistique verte à tous
> ses contrôles a été rejetée en bloc faute de repère extérieur. La classe que je vous proposais dit
> « aucun oracle ne juge si un lecteur sans contexte comprend le livrable » : c'est la COMPRÉHENSION,
> pas le niveau. Vous avez raison, ce n'est pas le même défaut. MAIS le cliquet du 16 septembre
> refuse une classe neuve qui ne nomme pas un contrôle existant, et il n'y en a pas : le seul
> exécutable du registre des repères, `test_existence.py`, vérifie qu'une référence candidate est
> atteignable — il ne dit rien de l'absence de repère pour une famille de livrables.
>
> **Recommandation : (a).** Source consultée : `todo/CLASSES.json`, entrée `lecture-tiers-non-jugee`,
> et l'en-tête de `test_existence.py` du registre des repères, qui déclare lui-même ne juger ni la
> légitimité ni la pertinence d'une référence. Écrire le contrôle d'abord coûte peu et fait naître
> la classe avec son juge, ce que le cliquet exige depuis qu'une classe sans juge a servi de façade.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) écrire d'abord le contrôle du repère manquant, puis créer la classe qui le nomme | effort moyen × court | répondre « D-15 a » | exclut un rattachement immédiat ; le dossier reste sans classe le temps d'écrire le contrôle |
| (b) porter une classe PROPOSÉE et non créée, en attendant qu'un juge existe | nul | répondre « D-15 b » | exclut la création tout de suite ; le dossier sort du compte des sans-classe sans entrer dans celui des classes |
| (c) la classe de la lecture par un tiers non jugée | nul | répondre « D-15 c » | exclut la distinction entre comprendre un livrable et le situer par rapport à un repère de niveau |

> **Si rien n'est décidé** : aucune option ne s'applique d'office — le dossier reste sans classe, et
> les livrables de communication continuent d'être jugés sur leur forme seule.

## 4. Traité — chaque point avec sa preuve exécutée

- **Le corpus de règles n'a plus une seule règle écrite que rien ne joue.** Preuve rouge puis
  verte : le juge des règles rendait FAIL sur 4 règles hier soir ; il rend PASS — 56 règles
  déclarées, 55 nommées par un exécutable, 1 exemptée et NOMMÉE au verdict. Une exemptée qui
  disparaîtrait du compte serait un oubli ; nommée, c'est une limite déclarée.
- **La règle de la dépense a son contrôle, et il sait échouer.** Preuve : 13 cas d'épreuve à
  double sens, tous verts, dont 2 rouges qui reproduisent le défaut — un appel payant au niveau
  module, qui part au chargement, et un appel qu'aucune option ne garde. Sur le parc il rend PASS,
  147 fichiers lus, 0 porteur d'un appel payant : c'est un cliquet, et son vert ne prouve rien que
  ses fixtures rouges ne prouvent mieux.
- **La règle du verrou unique a son contrôle.** Preuve : 15 cas d'épreuve à double sens, tous
  verts ; PASS sur le dépôt, 139 unités de code lues, avec 13 verrous de gestionnaire de paquets
  exemptés NOMMÉMENT parce qu'ils figent des versions et non du travail.
- **La règle de l'écart déclaré porte son exemption écrite, et le motif tient au cas fondateur.**
  Preuve : le juge la reconnaît et la NOMME au verdict au lieu de l'accuser. Le motif est que son
  objet est la qualité d'un raisonnement : un contrôle ne lirait que la trace, et rendrait vert sur
  un écart mal déclaré dès lors que la trace est bien formée — c'est-à-dire exactement sur le cas
  du 1ᵉʳ septembre, où la justification chiffrée était écrite, structurée et fausse.
- **2 défauts du juge des règles ont été trouvés en l'exécutant, et corrigés.** Preuve rouge
  puis verte : sa recette passe de 15 à 17 cas. Il ne lisait que 12 lignes après la déclaration
  d'une règle, si bien qu'une exemption écrite à sa place naturelle — en fin de section — n'était
  pas vue : il punissait le remède qu'il recommande. Et son motif d'exemption reconnaissait
  « décision humaine » et « geste humain », des mots qui disent QUI TRANCHE et jamais si une règle
  est mécanisable ; presque toute section de ce corpus les porte en citant son origine, donc
  presque toute règle pouvait s'exempter d'un mot.
- **Le registre distingue ce qui est un défaut de ce qui n'en est pas.** Preuve rouge puis verte :
  la porte d'écriture passe de 25 à 29 cas ; elle admet une création sans classe si et seulement si
  elle porte la nature d'opportunité, refuse celle qui porte les deux, et refuse une nature
  inconnue. Les 3 dossiers concernés portent cette nature par ajout au registre, et le contrôle du
  registre rend PASS.
- **Les 5 dossiers que vous n'avez pas voulu trancher sont instruits.** Preuve :
  chaque classe candidate est citée avec son libellé, la règle où elle vit et le contrôle qui la
  joue ; 3 des candidates que je proposais portent un contrôle « à créer », ce que le bloc 3 signale
  désormais parce que s'y rattacher déplacerait le dossier dans une autre attente.

## 5. Non traité — chaque point avec son motif

- Les 5 dossiers sans classe : motif `decision` — déclarer la classe d'un dossier vous revient, et
  2 d'entre eux demandent en plus de créer une entrée au référentiel.
- L'activation du circuit d'intégration hébergé : motif `dependance_bloc_3` — ses 2 causes
  attendent l'arbitrage, et le geste d'activation lui-même reste humain.
- Les 2 corrections que ce rouge commande : motif `dependance_bloc_3` — elles attendent leur
  autorisation comme travail.
- Le contrôle des empreintes sur le parc réel : motif `dependance_bloc_3` — il attend une décision
  humaine déjà posée au registre.
- La garde de recette du module du lexique : motif `dependance_bloc_3` — elle attend l'arbitrage.
- Les 10 candidatures de plus haute valeur : motif `gate_gouvernance` — faire passer une
  candidature en décidé est un geste humain.
- Les 30 livrables modifiés après avoir été scellés : motif `decision` — les re-sceller en bloc
  effacerait la seule trace de la divergence.
- Le palier de publication du produit de communication : motif `acces` — il attend 3 valeurs que
  seul l'humain détient.

## 6. Écarts à la lettre

- Vous avez demandé des éléments concrets sur 3 dossiers. J'ai fourni les éléments, et j'ai dû
  RETIRER une recommandation. Pourquoi : en allant chercher la définition complète des classes
  plutôt que leur nom, celle que je vous recommandais pour le premier dossier s'est révélée décrire
  autre chose — une correction qui ne redescend pas chez son producteur, quand le dossier parle d'un
  produit jamais instancié. Votre refus de trancher sans éléments a mis au jour une recommandation
  fausse, et c'est la raison pour laquelle ce refus était juste.
- Vous avez demandé si 2 dossiers ne devraient pas recevoir une classe neuve. J'ai répondu OUI pour
  l'un et OUI SUR LE FOND, NON SUR LA FORME pour l'autre. Pourquoi : la règle du cliquet exige
  qu'une classe neuve nomme un contrôle EXISTANT. Le premier en a un, qui a même produit la mesure ;
  le second n'en a pas, et créer la classe sans juge serait la façade verte que le cliquet refuse
  depuis le 16 septembre.
- Le livrable ne contient rien d'autre que ce périmètre : aucune classe attribuée à votre place,
  aucune entrée créée au référentiel avant votre arbitrage, aucun contrôle désactivé.

## 7. Risques

- **Une recommandation peut être fausse sans que rien ne le signale.** Celle du premier dossier
  l'était, et elle serait passée si vous aviez suivi l'avis.
  - signal : une recommandation qui cite le NOM d'une classe sans son libellé ni son contrôle.
  - parade : le bloc 3 cite désormais, pour chaque candidate, son libellé, sa règle et son juge —
    et signale celles dont le contrôle est à créer.
- **Un cliquet peut être contourné par une classe créée avec un juge de complaisance.** La règle
  exige un contrôle existant, pas un contrôle qui mesure vraiment la classe.
  - signal : une classe neuve dont le contrôle nommé ne cite jamais la classe en retour.
  - parade : pour le dossier concerné, le contrôle nommé est celui qui a PRODUIT la mesure du
    dossier, ce qui est le lien le plus fort possible.
- **Deux cliquets verts au jour de leur naissance peuvent n'être jamais rouges.** Les 2 contrôles
  nés ce tour ne constatent aucun défaut présent.
  - signal : un contrôle vert depuis des mois que personne ne relit.
  - parade : leurs fixtures rouges sont jouées à chaque passage du harnais, et le cliquet des
    recettes interdit qu'un banc perde des cas sans que personne le voie.
- **Une nature neuve peut devenir un fourre-tout.** Le champ d'opportunité sort un item du compteur
  des classes, et c'est exactement ce qui le rend tentant.
  - signal : un item de défaut consigné en opportunité pour éviter le compteur.
  - parade : la porte refuse une nature inconnue et refuse un item portant les deux champs ; la
    doctrine écrit qu'une opportunité se décide et se clôt comme toute autre candidature.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-41** | Créer au référentiel les classes que vous aurez tranchées, chacune nommant son contrôle existant, puis rattacher les dossiers | `auto_ia` | TF-1301 | `dependance_bloc_3` — attend D-11 à D-15 | 5 dossiers restent invisibles au compteur des classes |
| **A-42** | Écrire le contrôle du repère externe manquant, puis créer la classe qui le nomme | `auto_ia` | TF-1301 | `dependance_bloc_3` — attend D-15 (a) | une famille de livrables continue d'être jugée sur sa forme seule |
| **A-21** | Résoudre le registre des oracles PARESSEUSEMENT dans `oracles/oracle-controle-maison.mjs`, et poser au banc un cas qui le joue sans répertoire personnel | `auto_ia` | TF-1297 | `dependance_bloc_3` — attend l'arbitrage des candidatures | un oracle continue de planter sans rendre de verdict sur tout serveur d'intégration |
| **A-22** | Faire que `todo/self-test.mjs` régénère la vue avant de la juger | `auto_ia` | TF-1298 | `dependance_bloc_3` — attend l'arbitrage des candidatures | le circuit hébergé resterait rouge à sa première exécution |
| **A-26** | Rejouer la simulation du circuit hébergé après ces 2 corrections : `node scripts/simuler-recette-hebergee.mjs` | `auto_ia` | TF-1018 | `dependance_bloc_3` — attend A-21 et A-22 | l'activation resterait fermée sans qu'on sache si les 2 causes étaient les seules |
| **A-30** | Donner au vérificateur de sceaux une simulation `--essai`, et lui faire refuser d'écrire en masse sans cible nommée | `auto_ia` | TF-1303 | `dependance_bloc_3` — attend l'arbitrage des candidatures | la forme qui mesure reste à un mot de celle qui efface 30 constats |
| **A-31** | Câbler le vérificateur de sceaux à une étape qui le joue sur le dépôt du pilot, en non bloquant | `auto_ia` | TF-1304 | `dependance_bloc_3` — attend l'arbitrage des candidatures | l'écart entre les livrables et leurs sceaux continue de grandir |
| **A-25** | Déclarer ses codes de sortie dans l'en-tête du contrôle des caractères | `auto_ia` | TF-1299 | `dependance_bloc_3` — attend l'arbitrage des candidatures | un rouge antérieur continue de vivre sans être lu |
| **A-14** | Ancrer la garde de recette de `oracles/hook-lexique.mjs` sur son point d'entrée | `auto_ia` | TF-1291 | `dependance_bloc_3` — attend l'arbitrage des candidatures | un banc neuf peut rendre le vert d'un autre |
| **A-43** | Trancher les 5 dossiers instruits — répondre « D-11 d », « D-12 a », « D-13 a », « D-14 a », « D-15 a », ou une autre lettre | `manuelle_utilisateur` | TF-1301 | `decision` — la classe d'un dossier se DÉCLARE, et l'ouverture d'une entrée au référentiel se tranche ; l'écriture, elle, me revient | 5 dossiers restent hors du compteur, dont 2 dont la classe n'existe pas encore |
| **A-40** | Valider la demande de fusion n° 2 sur le site, ou la refuser en disant pourquoi | `manuelle_utilisateur` | `neuve` | `decision` — fusionner dans la branche principale engage l'historique du dépôt | le travail des 2 derniers jours reste à côté de la branche principale |
| **A-32** | Trancher les 30 livrables en écart, par lot d'origine | `manuelle_utilisateur` | TF-1304 | `decision` — re-sceller est la déclaration « réputé bon », et elle vous revient | 30 noms continuent de désigner 2 contenus |
| **A-18** | Me donner les 3 valeurs du palier : gouvernance des comptes, état de départ exporté depuis l'écran de statistiques du réseau, temps humain hebdomadaire en minutes | `manuelle_utilisateur` | TF-1160 | `acces` — trace mesurée : le contrôle du palier rend 3 règles rouges, message « valeur humaine absente : gouvernance, etat_de_depart, temps_humain » | le palier reste ouvert sans pouvoir publier |
| **A-20** | Arbitrer les 10 candidatures de valeur 15 ou plus, que je vous déroule une par une | `manuelle_utilisateur` | TF-1288 | `decision` — faire passer une candidature en décidé vous revient | les contrôles rendant un verdict faux continuent |

L'ordre suit l'effet de levier : `A-41` et `A-42` ferment ce que les 5 arbitrages débloquent,
`A-21` et `A-22` rouvrent l'activation du circuit hébergé pour 2 corrections d'une ligne chacune,
et `A-20` vient en dernier parce qu'il traite des cas quand les précédents traitent ce qui les
produit.

## 9. Traces

- Corpus opposable : [REGLES-PROJET.md](REGLES-PROJET.md) — l'exemption de la règle de l'écart
  déclaré est écrite en fin de sa section, avec son motif tiré du fait fondateur.
- Juge des règles : [oracle-regle-sans-juge.mjs](oracles/oracle-regle-sans-juge.mjs) — PASS ;
  sa lecture porte désormais sur la SECTION d'une règle, et son motif d'exemption sur le CONTRÔLE.
- Contrôles nés ce tour : [oracle-depense-voie-par-defaut.mjs](oracles/oracle-depense-voie-par-defaut.mjs)
  et [oracle-verrou-unique.mjs](oracles/oracle-verrou-unique.mjs), avec leurs 2 recettes, inscrits
  à [lib-recettes-dediees.mjs](oracles/lib-recettes-dediees.mjs).
- Porte d'écriture du registre : [journaliser.mjs](todo/journaliser.mjs) — 29 cas, exit 0 ; la
  nature d'opportunité est posée en doctrine dans [TODO-FORGE.md](references/TODO-FORGE.md).
- Registre : [TODO.jsonl](todo/TODO.jsonl) — contrôle du registre PASS.
- Harnais complet : 150 contrôles, 149 verts ; seul rouge, le contrôle des empreintes sur le parc
  réel, qui attend une décision humaine depuis le 17/09. Le cliquet des recettes enregistre les
  28 cas neufs des 2 contrôles nés ce tour.
- Enregistrements du tour : `91abed2`, `25f3ce3`, celui des 2 contrôles neufs et celui de cette
  synthèse.
- Remontée à la factory : sans objet — ce tour s'est joué au pilotage seul.
