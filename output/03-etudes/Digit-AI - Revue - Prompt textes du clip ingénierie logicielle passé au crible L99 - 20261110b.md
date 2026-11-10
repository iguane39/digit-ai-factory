# Revue L99 du prompt « textes du clip ingénierie logicielle »

Analyse en 8 couches du prompt reçu le 10/11/2026 à 14:21 dans la session pilot, au niveau L99.

Le prompt analysé, mot pour mot :

> Extrais les textes du clip ingénierie logicielle dans un tableau, puis propose une autre version des textes racontant une histoire pour un client qui découvre le produit. L'objectif est de lui faire comprendre le produit, ses avantages, son périmètre, ses objectifs et en quoi celui-ci peut être bénéfique pour ses équipes d'ingénierie.

Ce qui change pour vous : le prompt réécrit du chapitre 8 est prêt à lancer. Trois contenus que vous n'avez pas demandés attendent votre choix avant d'y entrer : des colonnes de plus dans les tableaux, le signalement des textes à préciser, une voix off.

## Chapitre 1 — OODA et étalon noté

Le prompt fixe bien la cible, un client qui découvre la Factory, et quatre choses à lui faire comprendre. Il ne dit rien de la place dont le récit dispose. Or le clip ne laisse qu'une soixantaine de mots de récit à l'écran, et l'objectif en demande quatre fois plus.

### Observe

Le prompt enchaîne deux tâches. La première, « Extrais les textes du clip ingénierie logicielle dans un tableau », est une extraction fidèle. La seconde, « propose une autre version des textes racontant une histoire », est une réécriture.

Le lecteur visé est « un client qui découvre le produit ». Le prompt lui assigne cinq choses à comprendre : le produit, ses avantages, son périmètre, ses objectifs, et « en quoi celui-ci peut être bénéfique pour ses équipes d'ingénierie ».

Il ne fixe ni le format du tableau, ni la longueur des textes, ni la règle de vérité des affirmations. Le fichier de sortie n'est pas désigné.

### Orient

Le clip est le premier des 14 clips de la série « La Factory en action », rendu le 10/11/2026 (`output/03-publications/Digit-AI - Présentation - Clip ingénierie logicielle - 20261110a.mp4` du dépôt marketing). Ses textes actuels décrivent le mécanisme : « Chaque exigence porte son critère. », « Une suite rouge bloque la livraison. ». Ils parlent à quelqu'un qui connaît déjà la chaîne.

L'intention profonde est commerciale. Il faut passer d'un clip qui montre comment la Factory fonctionne à un clip qui dit à un responsable d'ingénierie ce qu'il y gagne. Le mot « histoire » demande un fil narratif, avec un personnage et une tension, pas une liste de qualités.

Le destinataire est un modèle qui a accès au dépôt, donc au code du clip, mais pas forcément à la bible de la série ni aux relevés de preuves des agents.

### Decide

Trois façons de répondre :

1. **Réécrire dans les mêmes emplacements.** Le récit tient dans les textes que le clip affiche déjà : l'introduction, les 6 légendes et la carte de fin. Avantage : la version se remet dans le clip sans toucher à l'animation. Limite : environ 60 mots pour 5 objectifs.
2. **Écrire un récit libre de voix off.** Un texte de 140 à 160 mots, lu sur les 60 s. Avantage : la place de dire le périmètre et les objectifs. Limite : le clip n'a pas de voix aujourd'hui, seulement de la musique.
3. **Faire les deux.** Des textes à l'écran resserrés et une voix off qui les porte.

### Act

La voie 1 est recommandée, et c'est la lecture littérale : « une autre version des textes » du clip désigne les textes du clip. La voix off est un contenu de plus, posé en décision au chapitre 8. Pour que les 5 objectifs tiennent dans 60 mots, chaque emplacement porte un objectif nommé, et le tableau le dit.

### Étalon

Le prompt idéal pour cette intention :

- ouvre par l'accès vérifié au code du clip, seule source exacte des textes ;
- dit quels textes extraire : légendes seules, ou tout ce qui s'affiche ;
- pose le lecteur nommément, un responsable d'ingénierie, et ce qu'il doit retenir dans un ordre de priorité ;
- donne le budget de chaque emplacement, en caractères ;
- interdit les gains non mesurés, les superlatifs, les noms de clients et les capacités que la Factory ne tient pas ;
- nomme le fichier de sortie et l'oracle qui le juge ;
- dit à quoi on reconnaît une bonne version : chaque objectif placé dans au moins un emplacement.

Le tableau qui suit note le prompt d'origine sur la rubrique de 100 points. Chaque ligne est une dimension, dans l'ordre de la rubrique ; la justification dit ce qui coûte les points.

| Dimension | Points | Note | Justification |
|---|---|---|---|
| Clarté de l'intention | 20 | 14 | Deux tâches nettes et un but nommé, mais « une autre version des textes » ne dit pas si le récit garde les emplacements du clip. |
| Spécification | 20 | 8 | Ni colonnes du tableau, ni longueur, ni ton ; le lecteur reste générique (« un client »). |
| Garde-fous et contraintes | 15 | 3 | Aucune règle de vérité, alors qu'un récit commercial appelle des gains chiffrés inventés. |
| Ancrage et contexte | 15 | 9 | Le clip est désigné et trouvable ; la bible, ses statuts de preuve et les textes déjà contestés ne sont pas cités. |
| Vérifiabilité de la sortie | 15 | 4 | « lui faire comprendre » ne se juge pas ; aucun critère binaire. |
| Robustesse | 15 | 6 | Ouvert aux deux dérives : 6 lignes extraites seulement, ou un récit de 500 mots qui ne rentre pas dans le clip. |
| **Total** | **100** | **44** | Aucun défaut bloquant : le plafond de 40 ne s'applique pas. |

## Chapitre 2 — Chainlogic

La chaîne est courte et juste dans son ordre, mais sa deuxième étape hérite sans contrôle de tout ce que la première a extrait, erreurs comprises.

Elle se formalise ainsi :

- **A** : extraire les textes du clip dans un tableau ;
- **alors B** : réécrire ces textes en récit pour un client ;
- **donc C** : le client comprend le produit, ses avantages, son périmètre, ses objectifs, son bénéfice.

La première rupture est entre A et B. Le prompt suppose que les textes extraits sont vrais, puisqu'il les réécrit sans les vérifier. Or deux étiquettes du clip, « lint » et « typage » (`clip.html:570`), décrivent une capacité que la forge des tests exige sans l'exécuter elle-même (chapitre 4). Un récit construit sur l'extraction la répéterait en argument commercial.

La seconde rupture est entre B et C. « Comprendre le périmètre » suppose qu'on dise aussi ce que la Factory ne fait pas : le GO de mise en production et les dépenses restent humains. Les textes actuels n'en disent qu'une partie (« La production attend votre GO. », `clip.html:751`). Le prompt ne demande pas de combler ce manque, et un récit d'avantages l'oubliera.

## Chapitre 3 — Blindspots, inventaire maître

Le prompt laisse ouverts trois défauts majeurs qui se cumulent : la place du récit, la vérité des affirmations et le lecteur réel. Aucun n'empêche d'obtenir un texte, chacun en dégrade l'usage.

Le tableau ci-dessous est la liste unique des défauts. Les lignes vont du plus grave au plus léger. Chaque défaut majeur trouve sa correction au chapitre 8, sous le même numéro.

| N° | Défaut | Sévérité |
|---|---|---|
| B1 | Le budget de texte n'est pas posé. Le clip affiche 6 légendes de 26 à 36 caractères (`clip.html:746-751`), une phrase d'introduction de 13 mots et un titre de fin de 34 caractères, soit environ 60 mots de récit. Un modèle libre écrira un récit qu'on ne peut pas remettre dans le clip. | majeur |
| B2 | Aucune règle de vérité. Un récit « d'avantages » pour un client appelle des gains chiffrés (« deux fois plus vite ») que rien ne mesure, et des superlatifs que la bible de la série interdit (« Texte et vérité »). | majeur |
| B3 | Les textes extraits sont tenus pour vrais. « lint » et « typage » sont partiels (chapitre 4) et la bascule de 1 à 100 % n'est que « simulée en local » (`clip.html:725`). | majeur |
| B4 | Le lecteur reste « un client ». La fin du prompt, « ses équipes d'ingénierie », désigne un responsable d'ingénierie : directeur technique, DSI ou chef d'une équipe de développement. Sans ce nom, le ton hésite entre le dirigeant et le développeur. | majeur |
| B5 | Le périmètre de l'extraction est flou : les 6 légendes seules, ou les quelque 60 textes affichés, étiquettes de décor comprises (bulles du besoin flou, exigences d'exemple, stations, suites de tests). | majeur |
| B6 | Aucun critère pour juger que le récit « fait comprendre ». Il faut un critère binaire : chaque objectif nommé est porté par au moins un emplacement. | majeur |
| B7 | Le livrable n'a ni chemin ni nom. La consigne du porteur du 16/10/2026 veut tout livrable dans `output\`, nommé et enregistré. | majeur |
| B8 | Les cinq objectifs se recouvrent : « avantages » et « bénéfique pour ses équipes » disent presque la même chose. Sans ordre de priorité, le récit les traite à parts égales et n'en fait vivre aucun. | mineur |
| B9 | Le temps des textes : le code compte depuis le début du clip, le MP4 depuis l'introduction, qui ajoute 6 s. Un tableau qui mélange les deux décale tout. | mineur |
| B10 | Biais de l'auteur, la malédiction du savoir : « le produit » est évident pour vous, pas pour un modèle qui pourrait lire « le produit du client ». | mineur |

## Chapitre 4 — Factcheck, audit des prémisses

Le prompt présuppose deux choses vraies et une qui ne l'est qu'en partie : les textes qu'il fait réécrire contiennent une affirmation à nuancer.

Le tableau classe chaque prémisse. Une ligne est une affirmation que le prompt pose ou suppose ; la dernière colonne dit où elle remonte au chapitre 3.

| Prémisse | Verdict | Preuve | Suite |
|---|---|---|---|
| Le clip ingénierie logicielle existe et ses textes sont lisibles | vrai, accès mesuré | voir la mesure ci-dessous | prérequis de l'étape 0 |
| « le produit » est la Factory | vrai dans ce contexte | le clip présente la Factory : marque « DIGIT-AI FACTORY » (`outils/motion.js:189`) | B10 |
| Les textes du clip sont exacts | partiel | « lint » et « typage » (`clip.html:570`) : la boucle de fermeture de la forge des tests les exige en exit 0 dans son journal (`digit-ai-forge-tests/README.md:1153` et `:1167`), mais aucun adaptateur de la forge ne les exécute. C'est le relevé P-34 du storyboard des tests, relevé de preuve n° 34 du 10/11/2026 (`tests/STORYBOARD.md:67-69`). | B3, majeur |

La prémisse d'accès a été mesurée avant d'être classée :

- appel : lecture de `C:\dev\digit-ai-marketing\forge\etapes\clips-essai-20261109\ingenierie\clip.html` par `grep` et `sed`, 815 lignes rendues, sortie sans erreur ;
- horodatage et identité : 10/11/2026 vers 14:21, session locale du poste, compte `iguan` ;
- contrôle positif : le dossier voisin `outils/` se lit avec la même identité, et `motion.js` rend les textes de l'introduction et du lien (`:189`, `:240`) ;
- familles d'accès : le code source (lu), le MP4 rendu (présent dans `output/03-publications/`), le storyboard du clip dans `BIBLE.md` (présent, non relu ici).

## Chapitre 5 — Premortem

Imaginons la version livrée et refusée. Les cinq causes ci-dessous, de la plus probable à la moins probable, transforment chacune un défaut du chapitre 3 en scénario d'échec.

1. **Le récit ne rentre pas dans le clip** (escalade de B1). Le modèle écrit 300 mots d'histoire, belle et inutilisable : rien ne se remet dans les 6 légendes. Mécanisme : « racontant une histoire » tire vers la prose, et rien ne borne la longueur. Mitigation : un budget par emplacement, en caractères, contrôlé par script.
2. **Un gain inventé part chez un client** (escalade de B2). « Vos équipes livrent deux fois plus vite » paraît dans une démonstration commerciale ; un directeur technique demande la mesure et il n'y en a pas. Mécanisme : le registre « avantages » d'un modèle produit des chiffres plausibles. Mitigation : aucun chiffre de gain sans source mesurée, et une recherche par motif des chiffres avant remise.
3. **« Lint et typage » devient un argument** (escalade de B3). Le récit dit « la Factory vérifie le style et les types de votre code » ; un expert de la forge le dément. Mécanisme : l'extraction transmet le texte sans son statut. Mitigation : nommer la limite dans le prompt et interdire de la reprendre telle quelle.
4. **Le périmètre disparaît** (escalade de la seconde rupture du chapitre 2). Le récit ne parle que de ce que la Factory fait, et le client croit à une chaîne sans humain. Mécanisme : un récit d'avantages omet les limites. Mitigation : un emplacement au moins dit ce que l'humain garde, le GO de production et les dépenses.
5. **L'extraction est partielle** (escalade de B5). Seules les 6 légendes sont relevées, et la version oublie l'introduction et la carte de fin, qui portent pourtant la phrase la plus lue. Mitigation : énumérer les zones à extraire et compter les appels de texte du code pour vérifier.

## Chapitre 6 — Wargame

Les trois attaques ci-dessous visent la direction de réécriture. Elles confirment la voie des emplacements et y ajoutent deux exigences : un ordre de priorité des objectifs, et un texte qui parle de la semaine des équipes plutôt que de la chaîne.

**L'utilisateur exigeant.** Il veut une version qu'il pourra remettre dans le clip sans retoucher l'animation. Il lui faut donc, en face de chaque texte actuel, le texte proposé et sa longueur. Sans le moment d'apparition, il ne sait pas quelle image le texte accompagne. Le moment et l'emplacement sont donc utiles, mais ce sont des colonnes que vous n'avez pas demandées : elles passent par une décision.

**L'expert du domaine**, ici un rédacteur de contenu B2B pour décideurs techniques. Il relève que les textes actuels décrivent la machine (« Le design jugé avant le code. »). Un directeur technique achète un effet sur ses équipes : moins de retours en recette, des exigences testables dès le départ, une mise en production qu'il garde sous sa main. L'histoire doit suivre un besoin d'une équipe, anonyme, du flou à la production, et dire à chaque étape ce que l'équipe ne fait plus ou fait mieux. Il relève aussi que « GO » et « ATDD » *(développement piloté par les tests d'acceptation)* sont du vocabulaire maison, à traduire pour un lecteur qui découvre.

**Le contradicteur.** Un modèle peut obéir à la lettre et rendre une version sans valeur. Il peut paraphraser chaque légende (« Au départ, un besoin vague. ») : c'est « une autre version », pas une histoire. Il peut aussi écrire un récit hors du clip, puis le découper n'importe comment. Parade : exiger un arc narratif nommé (situation, tension, résolution) et vérifier que chaque objectif du prompt est porté par un emplacement.

La lentille robustesse ne s'ouvre pas : le prompt n'est ni un system prompt, ni une consigne d'agent, ni un modèle réutilisable.

## Chapitre 7 — Deepthink

Prompt à usage unique : les effets d'échelle ne sont pas pertinents. Une remarque seulement : si la version est retenue, les 13 autres clips de la série demanderont le même passage, et ce prompt en deviendra le modèle. Il faudra alors le repasser en mode boucle.

## Chapitre 8 — Synthèse et prompt réécrit

Le prompt passe de 44 à 88 points, score projeté et non mesuré. Le gain tient à trois ajouts : la place du récit, la règle de vérité et le lecteur nommé. Le mode boucle n'a pas été ouvert : le prompt sert une fois, ne lance aucun agent qui écrit, et l'analyse ne relève aucun défaut bloquant.

### Score

Le tableau compare les deux versions, dimension par dimension, dans l'ordre de la rubrique du chapitre 1. La colonne « après » est une projection de l'auteur de l'analyse.

| Dimension | Avant | Après (projeté, non mesuré) |
|---|---|---|
| Clarté de l'intention | 14 | 18 |
| Spécification | 8 | 18 |
| Garde-fous et contraintes | 3 | 13 |
| Ancrage et contexte | 9 | 14 |
| Vérifiabilité de la sortie | 4 | 13 |
| Robustesse | 6 | 12 |
| **Total** | **44** | **88** |

### Diagnostic

- Force : l'intention est juste et le but est nommé, avec un lecteur, un produit et cinq choses à faire comprendre.
- Faiblesse : rien ne borne le récit, ni en longueur pour tenir dans le clip, ni en vérité pour tenir devant un client.
- Faiblesse : l'extraction est traitée comme une copie, alors qu'elle transmet au récit une affirmation à nuancer.

### Prompt réécrit

Le prompt ci-dessous s'écrit avec les choix par défaut des trois décisions ouvertes : pas de colonne ajoutée, pas de signalement, pas de voix off. Chaque décision tranchée ajoute un paragraphe, donné après le prompt.

```text
ÉTAPE 0 — Prérequis d'accès
Ouvre C:\dev\digit-ai-marketing\forge\etapes\clips-essai-20261109\ingenierie\clip.html,
seule source exacte des textes du clip, puis outils\motion.js du même dossier parent
(textes de l'introduction et du lien), puis BIBLE.md, section « Texte et vérité ».
Contrôle positif : le MP4 « Digit-AI - Présentation - Clip ingénierie logicielle -
20261110a.mp4 » existe dans C:\dev\digit-ai-marketing\output\03-publications\.
Si clip.html est absent ou illisible, arrête-toi et dis-le avec le chemin et l'erreur
exacte. N'extrais jamais les textes de mémoire ni d'une image du clip.

CONTEXTE
Le clip présente la plateforme d'ingénierie logicielle de la Digit-AI Factory, en 66 s
(6 s d'introduction, puis 60 s) : des agents construisent un produit de l'exigence à la
mise en service, et chaque étape est jugée avant la suivante. L'humain garde le GO de
mise en production et les dépenses. Ses textes sont dessinés par le code de clip.html.

TÂCHE 1 — EXTRACTION
Relève tous les textes que le spectateur lit à l'écran, dans l'ordre d'apparition, sans
en corriger un seul : la marque et le titre, la phrase et les étapes de l'introduction ;
les noms des 5 blocs ; les étiquettes de décor ; les 6 légendes ; la carte de fin et le
lien factory.digit-ai.fr. Un tableau : N° | Texte exact. Les textes qui se répètent
(les 5 pourcentages de la bascule, par exemple) tiennent en une ligne.
Pour vérifier, compte les appels de texte du code (fillText, M.texte, M.puce,
M.legende, M.introduire, M.lienFactory) : chaque appel affiché a sa ligne.

TÂCHE 2 — VERSION RÉCIT
Lecteur : un responsable d'ingénierie (directeur technique, DSI, chef d'une équipe de
développement) qui découvre la Factory et n'a jamais vu ce clip.
Récit : une histoire qui suit le besoin d'une équipe, anonyme, du flou à la production.
Arc nommé : une situation (un besoin flou, une échéance), une tension (ce qui casse
d'habitude : exigences floues, retours en recette, mise en production risquée), une
résolution (ce que la Factory change pour l'équipe, étape par étape).
Ce que le lecteur retient, dans cet ordre de priorité :
  1. ce qu'est le produit ;
  2. ce qu'il change pour ses équipes d'ingénierie ;
  3. son périmètre, y compris ce que l'humain garde ;
  4. ses objectifs ;
  5. ses avantages.
Format : la version garde les emplacements du clip, pour s'y remettre sans toucher à
l'animation. Budgets, en caractères espaces comprises :
  - titre de l'introduction : 30 au plus ;
  - phrase de l'introduction : 90 au plus ;
  - chaque étape de l'introduction : 16 au plus ;
  - chaque légende : 40 au plus (6 légendes, une par plan, dans l'ordre du clip) ;
  - titre de la carte de fin : 40 au plus ; sous-titre : 45 au plus.
Les étiquettes de décor et les noms des blocs ne changent pas.
Un tableau : N° (le numéro de la ligne extraite) | Texte proposé.
Sous le tableau, trois lignes au plus qui disent l'arc : situation, tension, résolution.

VÉRITÉ
Chaque affirmation s'appuie sur une capacité que le clip montre déjà ou que BIBLE.md
marque « attestée ». Interdits : un chiffre de gain (temps, coût, productivité) sans
mesure sourcée ; un superlatif ; un nom de client, de prospect ou de personne.
« lint » et « typage » : la forge des tests les exige comme portes de sa boucle de
fermeture, mais ne les exécute pas elle-même ; n'écris pas que la Factory les joue.
La bascule progressive de 1 à 100 % est simulée en local : ne la présente pas comme
vécue en production. Les sigles maison (GO, ATDD, e2e) se traduisent ou s'expliquent.

LIVRABLE
Un fichier Markdown, nommé selon R-4 (le projet ouvre le nom) et R-25 (le type, pris
au registre des types, est le premier mot du deuxième segment) :
C:\dev\digit-ai-marketing\output\03-publications\Digit-AI - Proposition - Textes du clip
ingénierie logicielle en récit client - AAAAMMJJ<indice>.md
La date est celle du jour, relevée par `date` ; l'indice est la première lettre libre
du jour dans output\. Enregistre-le par `git commit --only -- <chemin>` dans le dépôt
marketing, sans envoi au dépôt distant.

CONTRÔLES AVANT REMISE (3 passes au plus)
1. `python C:\Users\iguan\.claude\skills\digit-ai-page-html\scripts\check_markdown.py
   <fichier>` rend exit 0.
2. Le compte des appels de texte du code égale le nombre de lignes de l'extraction,
   répétitions groupées comprises ; sinon, la ligne manquante est nommée.
3. Un script mesure chaque texte proposé contre son budget : 0 dépassement.
4. Les 5 objectifs de lecture sont chacun portés par au moins un texte proposé ; dis
   lequel dans ta réponse, pas dans le fichier.
5. Une recherche des chiffres et des superlatifs (plus, meilleur, unique, révolutionnaire,
   tous, jamais) dans les textes proposés : chaque occurrence est sourcée ou retirée.
Après 3 passes en échec, remets le fichier avec la liste des écarts restants.
```

Chaque décision tranchée en faveur de l'ajout modifie le prompt ainsi :

- D-199 (a), les colonnes : l'extraction devient « N° | Moment (s, depuis le début du MP4 : temps du code + 6 s) | Emplacement (introduction, bloc, étiquette, légende, carte de fin) | Texte exact | Source (`clip.html:ligne`) » ;
- D-200 (a), le signalement : l'extraction prend une colonne « À préciser », qui porte la limite des textes « lint », « typage » et « paliers simulés en local » ;
- D-201 (a), la voix off : la tâche 2 ajoute « un texte de voix off de 140 à 160 mots, lu sur les 60 s du clip, qui suit le même arc ; il est jugé par les mêmes règles de vérité ».

### Contrat de sortie

La version livrée est acceptée si chacun de ces critères est vrai :

- un seul fichier Markdown au chemin et au nom du prompt, selon R-4 et R-25 ;
- `check_markdown.py` rend exit 0 (règles M7, ouverture de section ; M10, mode de lecture des tableaux ; M14, aucune plomberie interne dans le texte ; M18, glose des identifiants) ;
- l'extraction compte autant de lignes que d'appels de texte affichés du code ;
- chaque texte proposé tient dans son budget, mesuré par script ;
- chaque objectif de lecture est porté par au moins un texte proposé ;
- aucun chiffre de gain sans source, aucun superlatif, aucun nom de client ;
- aucun texte proposé n'affirme que la Factory exécute le lint ou le typage, ni qu'une bascule a eu lieu en production ;
- l'arc tient en 3 lignes au plus : situation, tension, résolution.

Un seul format est produit, le Markdown ; aucune voie de repli n'en produit un autre.

### Protocole de tests du livrable

Le livrable est un document texte court, et sa vérification se fait par contrat chiffré. Le jeu d'essai minimal comprend trois cas. Le cas nominal porte sur les 6 légendes. Le cas limite est la plus longue, « Le test d'acceptation avant le code. », 36 caractères pour un budget de 40. Le cas de vérité porte sur les étiquettes « lint » et « typage ». Le prompt réécrit embarque la boucle, 3 passes au plus, avec ses critères d'arrêt repris du contrat.

### Changelog

Chaque modification du prompt se rattache à un défaut nommé ; la liste suit l'ordre du prompt réécrit.

- Étape 0 et chemin du clip : prémisse d'accès du chapitre 4, B5.
- Contexte avec le GO humain : seconde rupture du chapitre 2, cause d'échec n° 4.
- Zones à extraire et compte des appels de texte : B5, cause n° 5.
- Lecteur nommé : B4, attaque de l'expert.
- Arc nommé et ordre de priorité des objectifs : B6, B8, attaque du contradicteur.
- Budgets par emplacement : B1, cause n° 1.
- Règle de vérité, limites « lint », « typage » et bascule simulée : B2, B3, causes n° 2 et n° 3.
- Sigles traduits : attaque de l'expert.
- Chemin, nom et commit : B7.
- Contrôles avant remise : B6, contrat de sortie.
- Temps des textes : B9, renvoyé à D-199.

### Écarts à la lettre

Le tableau liste chaque endroit où le prompt réécrit s'écarte de votre texte. La première colonne est votre texte, la deuxième la proposition, la troisième sa raison. La dernière colonne dit la catégorie : une manière d'exécuter se valide avec le prompt ; un contenu visible ajouté passe par une décision à part.

| Vous avez écrit | Je propose | Pourquoi | Catégorie |
|---|---|---|---|
| « un client qui découvre le produit » | un responsable d'ingénierie : directeur technique, DSI, chef d'une équipe de développement | votre fin de phrase, « ses équipes d'ingénierie », désigne ce lecteur | manière d'exécuter |
| « le produit » | la Digit-AI Factory, plateforme d'ingénierie logicielle | le clip présente la Factory, pas le produit du client | manière d'exécuter |
| « une autre version des textes » | les mêmes emplacements, avec un budget en caractères | pour que la version se remette dans le clip sans toucher à l'animation | manière d'exécuter |
| cinq objectifs sans ordre | un ordre de priorité, le produit d'abord | 60 mots ne portent pas 5 objectifs à parts égales | manière d'exécuter |
| « dans un tableau » | N° et texte exact | le minimum d'un tableau | manière d'exécuter |
| (rien) | moment, emplacement et ligne source dans l'extraction | utile pour remettre les textes en place et les vérifier | contenu visible ajouté, D-199 |
| (rien) | une colonne « À préciser » pour lint, typage et bascule simulée | évite qu'un texte à nuancer devienne un argument | contenu visible ajouté, D-200 |
| (rien) | un texte de voix off de 140 à 160 mots | la place de dire le périmètre et les objectifs | contenu visible ajouté, D-201 |
