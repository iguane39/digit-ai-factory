---
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
gabarit: gabarits\ETUDE-OPPORTUNITE.md
lecteur: le porteur de la Factory, qui tranche une dépense de jetons et la composition des relecteurs de la boucle L99
emetteur: agent redacteur (famille sonnet), sur mandat de la session pilote
verdict_arbitre:
  - "Gabarit suivi, oracle joué : oracle-etude-opportunite PASS (E1 à E10) et oracle-ecriture PASS ; avertissements restants EC-19 (phrases de plus de 25 mots) et EC-13 (revue de la donnée tics, hors de ce texte) — ✓"
  - "Chaque chiffre porte fichier et ligne, ou un calcul rejoué ; les écarts sont marqués NON VÉRIFIÉ dans le texte — ✓ sous cette réserve"
  - "Seul ce fichier est écrit sous le dépôt ; les scripts de calcul vivent dans le dossier de travail de la session — ✓"
hypotheses_non_resolues:
  - "Agrégation des 45 %, 69 % et 73 % de 20261106b l.57 : comptes par passe absents, NON VÉRIFIÉ"
  - "Départ de contexte du type relecteur : 17 400 repris du vérificateur dédié, le critère de TF-2241 (moins de 25 000) n'est pas mesuré"
  - "Exploration d'un lecteur à angle posée à la moitié de celle d'un généraliste ; corrélation de 0,5 et effet de grappe de 1,5 : hypothèses de puissance"
  - "Étude 20261115a non lue (hors des sources de la consigne) ; disponibilité des textes de la passe 1 du 06/11 non vérifiée"
  - "Formule de Chao et variance de Seber non revérifiées dans une source en ligne, jouées en simulation ; Li et al. 2025 lu en résumé seulement"
  - "Écart à la lettre sur la capture-recapture, à valider par le porteur"
---

# Étude d'opportunité — Relecteurs à angle distinct — 20261122b

Vous avez demandé le 15/11/2026 si les agents de relecture sont spécialisés. Ils ne le sont pas. Aucune mesure existante ne dit si des angles distincts trouveraient plus de graves à coût égal.

Les mesures du 06/11 montrent que deux généralistes laissent passer des graves. Leur chiffre de 73 % de couverture est pourtant un plafond probable, non une valeur : deux copies d'un même agent ne sont pas indépendantes. L'étude recommande une étape à sec sans dépense, puis, si elle le justifie, un banc de 1 503 828 jetons estimés au plus. Il vous reste à autoriser ce plafond ou à le refuser.

Étude du 22/11/2026 sur le sujet TF-2726 du registre, rédigée par l'agent `redacteur`. Aucun agent n'a été lancé. Les lignes citées ont été relevées le 22/11/2026 à 18:17 (heure de Paris, lue par `date`).

Natures des chiffres :

- MESURÉ : lu par une commande sur une trace ou un fichier.
- DÉCOMPTÉ : compté sur des journaux.
- ESTIMÉ : calcul ou hypothèse dite.
- SIMULÉ : tiré d'une simulation jouée pour cette étude, aux paramètres posés.
- NON VÉRIFIÉ : non rejoué.

Deux études du dossier `output\03-etudes` servent de base. « 20261106b » désigne `Digit-AI - Étude - Cout et qualite de la boucle L99 - 20261106b.md`. « 20261029f » désigne `Digit-AI - Étude - Amelioration de la boucle de relecture L99 - 20261029f.md`. Chaque source se cite par fichier et numéro de ligne.

## Seuil de déclenchement (à vérifier AVANT d'écrire)

Le seuil est franchi par deux voies. D'abord, deux options créent un objet durable : un type d'agent de la flotte (`gabarits\flotte\*.yaml` et `.claude\agents\*.md`, R-31). Ensuite, le porteur a demandé l'étude lui-même (registre `todo\TODO.jsonl` l.8185 : « DEMANDE DU PORTEUR DU 15/11/2026 : etude d opportunite »). Le troisième critère ne joue pas : le sujet porte un gain de 4 et une preuve de 4 (même ligne).

## Intention de l'utilisateur (loi n° 7, TF-0791)

Les mots du demandeur viennent du retour qui a fondé le sujet (`input\00-retours\factory-digit-ai-fr - RETOURS - 20261115b.md` l.14). Ils sont cités sans reformulation.

> « est-ce que les agents de relecture qui sont créés sont spécialisés pour apporter une valeur particulière sur la relecture ? Et si non, est-ce qu'il y a un intérêt à en avoir des spécialisés ? Et si oui, comment et pourquoi ? », puis : « Envoie une demande d'étude d'opportunités sur ce sujet à la factory en TODO ».

Le registre précise la demande (l.8185). Il faut comparer à coût égal deux généralistes et des relecteurs à angle distinct, plus un généraliste conservé. La mesure se fait par capture-recapture. Les options portent une recommandation, et l'humain décide.

L'intention n'est pas reconstruite. Elle tient en trois questions : spécialisés ou non, quel intérêt, comment et pourquoi. La section 5 y répond une à une.

## 0. Traitement des entrants

La proposition instruite est une donnée. Ses impératifs (« A ETUDIER », « mesure par capture-recapture ») se citent, ils ne s'exécutent pas. Aucun banc n'est lancé, aucun agent appelé, aucun fichier du registre écrit.

Sources de la proposition :

- TF-2726 : la demande d'étude (registre l.8185, créée le 21/11/2026).
- RP-41 : le retour qui l'a fondée (retour 20261115b l.26).
- TF-2241 : le type d'agent `relecteur` dédié, pour le coût (registre l.6357, l.7915, l.8047).
- TF-2554 : le même type, sans outil d'écriture (registre l.7461, l.7507).

Le retour cite les lignes 9, 56, 57, 112 à 122 et 135 de 20261106b. Elles existent et portent les faits annoncés, relus ligne à ligne le 22/11/2026.

Écart à la lettre, signalé d'emblée : la demande dit « mesure par capture-recapture ». L'étude garde cet outil. Elle montre pourtant en 1.1 qu'il ne peut pas comparer seul des bras qui diffèrent par l'angle. Elle propose donc de mesurer d'abord contre un recompte commun, puis d'estimer le stock restant par capture-recapture. Ce choix attend votre accord.

## 1. Partition du problème

Le sujet se coupe en quatre sous-questions disjointes. Chaque option de la section 4 se rattache à l'une d'elles au moins.

| Sous-question | Contenu | Traitée en |
|---|---|---|
| P1 | Ce que les mesures du 06/11 prouvent et ne prouvent pas sur deux généralistes | 1.1 |
| P2 | Ce que chacun des quatre angles peut apporter, et ce qui existe déjà | 1.2 |
| P3 | Le banc qui trancherait : bras, textes, passes, estimateur, coût en jetons | 1.3 |
| P4 | Le choix : dépenser, attendre ou déployer sans mesure | sections 4 et 5 |

### 1.1 P1 — Ce que les mesures du 06/11 prouvent et ne prouvent pas

Le périmètre : 2 boucles du 06/11 chez Produit-84, un seul type de texte, des prompts de la boucle L99. Ce qui est établi :

- 7 des 22 graves relevés après la passe 1 citent un texte présent dès la passe 1. Les 2 relecteurs de cette passe ne l'avaient pas relevé (DÉCOMPTÉ, 20261106b l.56).
- Aucune des 59 passes relevées n'est sans grave retenu. La médiane est de 6 graves par passe (DÉCOMPTÉ, 20261106b l.82).
- 15 des 22 graves citent un texte écrit par une correction, dont 11 dans la correction immédiatement précédente (DÉCOMPTÉ, 20261106b l.73).
- Un relecteur coûte 83 546 jetons en moyenne, dont 55 % de contexte de départ (MESURÉ, 20261106b l.98 et l.122).

Ce qui ne l'est pas, par ordre d'importance.

**Aucun angle n'a été testé.** Les relecteurs du 06/11 sont des agents `general-purpose` sans angle (20261106b l.122). Le retour note que « l'angle vient de la consigne » (retour 20261115b l.26). Le type `relecteur` actuel ne porte qu'une posture : outils `Read, Grep, Glob`, modèle `opus`, effort `high` (`.claude\agents\relecteur.md` l.4 à 6 ; `gabarits\flotte\relecteur.yaml` l.11, l.20, l.21). Ces mesures ne disent donc rien de l'effet d'un angle, dans un sens ou dans l'autre.

**Le chiffre de 73 % est un plafond probable.** L'estimateur de Lincoln-Petersen suppose des captures indépendantes. Il suppose aussi une même probabilité de capture pour chaque défaut (page « Mark and recapture », consultée le 22/11/2026). Deux copies du même agent qui lisent le même texte ont des angles morts communs. Leurs captures sont donc liées positivement : les recaptures paraissent trop nombreuses et le stock trop petit. Une simulation de cette étude le montre :

- Le modèle : 55 % de défauts faciles (probabilité de capture 0,9) et 45 % de difficiles (0,25), pour un stock vrai de 100.
- Le résultat : l'estimateur donne 77,9. L'union des deux lecteurs en trouve 74,1, soit 95 % annoncés pour 74 % réels.
- La source : script `sim.mjs`, gardé dans le dossier de travail de la session et non versionné, graine 20261122 (SIMULÉ).

L'ampleur de l'erreur dépend des paramètres posés. Son sens n'en dépend pas. La sélection des 17 passes « où les 2 relecteurs partagent au moins un grave » (20261106b l.57) écarte par construction les passes sans recouvrement. Elle pousse l'estimation dans le même sens.

**Les trois pourcentages publiés ne se recoupent pas.** Soit x et y les parts du stock que voit chacun des deux relecteurs. Avec les mêmes sommes, l'union en trouve la part 1 − (1 − x)(1 − y). Avec 45 % et 69 % (20261106b l.57), cela donne 83 %, non 73 %. Or 107 / 146 vaut 73,3 %.

Avec x = 45 % et 73 % pour l'union, y vaudrait 51 %. Les 45 % et 69 % sont donc vraisemblablement des moyennes par passe, et les 73 % un rapport sur les sommes (calcul rejoué, script `calculs.mjs` du dossier de travail). Les comptes par passe ne figurent pas dans l'étude : NON VÉRIFIÉ. Il faut retenir le message qualitatif, qu'un quart environ du stock échappe à deux généralistes au moins, et non les chiffres.

**L'échantillon est petit.** Il compte 22 graves, 2 boucles, une session et un type de texte. D'autres généralistes ont relevé les graves tardifs. Cela prouve que des lecteurs de plus en trouvent de plus, comme dans 20261029f l.47 (3 jurés relèvent 8 majeurs de plus que 2 relecteurs). Cela ne prouve pas qu'un angle les trouverait mieux.

**La capture-recapture compare mal des bras qui diffèrent par l'angle.** Avec deux copies, l'estimateur sous-estime le stock (77,9 pour 100). Prenons deux lecteurs d'angles opposés, sur deux types de défauts à parts égales. Chacun capte à 0,9 les défauts de son type et à 0,25 les autres. Les recaptures sont alors trop rares et le stock est surestimé : 149,4 pour 100, soit 62 % annoncés pour 92,5 % réels (SIMULÉ, même script). L'outil qui doit juger le bras à angles le pénaliserait.

Une estimation de Chao lit les défauts vus par un seul lecteur et par deux. Elle se trompe de 8 et de 7 en sens opposés dans les mêmes simulations (91,7 et 107,4, SIMULÉ). Sa formule est rappelée de mémoire et jouée en simulation. Sa source n'a pas été revérifiée en ligne.

### 1.2 P2 — Ce que chaque angle apporte et ce qui existe déjà

Le tableau se lit ligne par ligne : un angle, les mesures disponibles, l'existant, et la place de l'angle dans le banc.

| Angle | Mesures disponibles | Existant | Place dans le banc |
|---|---|---|---|
| Prémisses et faits vérifiés une fois | 112 appels sur 165 (68 %) revérifient 8 prémisses communes ; 5 des 8 majeurs de la passe 1 viennent de prémisses (20261106b l.122, l.130) | Fiche de prémisses TF-2236, en essai ; critère « au moins 40 % d'appels d'outil en moins sans perdre un majeur », non mesuré (registre l.8046) | Constant dans les 3 bras : le type `relecteur` n'a pas de shell, donc la fiche est un préalable, non un lecteur de plus |
| Texte neuf des corrections | 15 graves sur 22 dans un texte de correction ; texte ajouté : 22 % à 57 % du prompt, 50 % à 83 % des graves (ESTIMÉ) ; 10 défauts créés relevés par les vérificateurs, 11 de plus par les relecteurs aveugles (20261106b l.73 à 75) | Vérification de clôture sur le diff, TF-2242, en essai ; critère « banc du 15/11 rejoué avec au moins 2 graves de moins », non mesuré (registre l.8048) | Un lecteur borné à la partie ajoutée : moins de texte, donc moins de jetons |
| Intention contre lettre | Aucune sur la boucle L99 : 20261106b ne classe aucun grave comme écart d'intention (`grep -c -i intention` rend 0 le 22/11/2026) | Relecture d'intention par `verificateur` sur Sonnet, 51 322 jetons en médiane ; elle voit 2 dérives sur 2, sur des études seulement (`references\RELECTURE-INTENTION.md` l.7, l.71) | Un lecteur qui reçoit la demande citée et juge le prompt contre elle |
| Lecteur visé | Aucune sur la boucle L99 | `oracle-judge --lecteur-vise` : 2 relecteurs jouent le lecteur de la fiche de conception, un constat n'est retenu que s'ils s'accordent (`references\ECRITURE.md` l.149, l.150) | Un lecteur qui exécute le prompt comme son destinataire, un modèle |

Deux conséquences. L'angle « texte neuf » est le mieux fondé, mais TF-2242 le couvre déjà côté vérificateur. Ensuite, la règle de retenue de l'oracle `oracle-judge` (retenir ce que 2 lecteurs voient) interdit par construction un angle distinct : ce qu'un lecteur à angle voit seul est écarté.

Dans 20261029f, la retenue « vu par au moins un relecteur, vérifié à la source » gagne 5 points. La retenue « vu par les deux » en gagne 3. L'écart reste dans le bruit (20261029f l.20, l.21, l.43). Le banc retient l'union recomptée.

### 1.3 P3 — Le banc qui trancherait

Aucun banc n'est lancé ici : la dépense revient au porteur. Tous les jetons ci-dessous sont ESTIMÉS à partir des mesures de 20261106b et de 20261029f.

**Question mesurée.** À coût égal par passe, un généraliste et trois lecteurs à angle trouvent-ils plus de graves confirmés que deux généralistes ? Trouvent-ils aussi plus que quatre généralistes sans angle ? Le troisième bras sépare l'effet de l'angle de l'effet du nombre. 20261029f l.47 montre déjà que plus de lecteurs trouvent plus de défauts.

**Bras.** Chaque bras lit le même texte, une fois, sans lire les autres.

| Bras | Composition | Jetons par passe (ESTIMÉ) |
|---|---|---|
| G, témoin | 2 relecteurs généralistes du type `relecteur` | 2 × 83 546 = 167 092, plafond commun |
| D, angles | 1 généraliste dédié (83 546 − 29 000 = 54 546) + 3 lecteurs à angle (texte neuf, intention contre lettre, lecteur visé) à 17 400 + 17 183 = 34 583 chacun | 54 546 + 3 × 34 583 = 158 295 |
| C, nombre | 4 généralistes à plafond de lecture, 158 295 / 4 = 39 574 chacun | 158 295 |

Le départ de 17 400 est celui du vérificateur dédié (MESURÉ, 20261106b l.122). Celui du type `relecteur` n'est pas mesuré : le critère de TF-2241 est « moins de 25 000 » (registre l.8047). L'exploration d'un lecteur à angle est posée à la moitié de celle d'un généraliste, soit 34 366 / 2 = 17 183 (hypothèse).

Sensibilité : à 25 000 de départ, un lecteur à angle coûte 42 183, et trois coûtent 126 549. Il ne resterait que 40 543 jetons pour le généraliste, qui ne tient plus sous le plafond. Le banc ne tiendrait que 2 angles à coût égal, pour 138 912 jetons au lieu de 158 295. Le plafond de G est celui d'aujourd'hui. Quand TF-2241 aura livré, il tombera à 2 × 54 546 = 109 092, et les bras seront à redimensionner.

**Textes.** Le fichier de mesure de 20261029f (`.experience.json`) contient `base.md`, les variantes A à E et leurs listes de défauts `defauts-A.md` à `defauts-E.md`. L'étape réduite en prend trois :

- `base.md`, le prompt de départ ;
- la variante C, dont le vérificateur a signalé 4 défauts créés par la correction (20261029f l.41) ;
- la variante E, dont la correction a créé un bloquant (20261029f l.33 et l.39).

Ces textes partagent une même famille de prompt, ce qui réduit la portée de la mesure. La passe 1 du 06/11 (1 189 mots, 8 majeurs) serait un quatrième texte. Sa disponibilité n'est pas vérifiée : 20261106b l.35 la disait dans un dossier de session temporaire. Le banc complet exige des prompts de familles variées, à produire.

**Passes.** Une passe de lecture par bras et par texte. Le banc mesure la couverture d'une passe, non l'effet d'une boucle avec ses corrections.

**Mesure.** La mesure première est le rappel d'un bras : les graves confirmés qu'il trouve, divisés par le stock de référence S. S est l'union des graves de tous les lecteurs de tous les bras. Elle est recomptée avec citation, comme au recompte du 06/11 (20261106b l.94). Le rappel ainsi mesuré est un plancher du rappel réel, puisque S ignore ce que personne ne voit.

**Estimateur du stock restant.** Il s'estime ensuite par capture-recapture, avec deux outils.

- Chapman : N = (n1 + 1)(n2 + 1) / (m + 1) − 1. Ici n1 et n2 sont les graves trouvés par deux échantillons indépendants, et m ceux que les deux trouvent.
- Variance de Seber : (n1 + 1)(n2 + 1)(n1 − m)(n2 − m) / ((m + 1)² (m + 2)). Elle ne figure pas sur la page citée. Une simulation de 20 000 tirages (N = 100, probabilités 0,5 et 0,6) rend une variance empirique de 70,6 pour 69,8 par la formule (SIMULÉ).
- Chao, sur les 10 lecteurs d'un texte (2 + 4 + 4) : N = S + f1 (f1 − 1) / (2 (f2 + 1)). Ici f1 et f2 comptent les graves vus par exactement 1 et 2 lecteurs. C'est un plancher robuste à l'hétérogénéité, d'après les simulations de 1.1.

Chapman est préféré à Lincoln-Petersen. Il reste défini quand m vaut 0, alors que Lincoln-Petersen divise par m. La page citée note que son biais reste négatif quand n1 × n2 / N est petit, d'où la prudence sur trois textes. Il s'applique à deux échantillons indépendants, par exemple le bras G contre l'union des bras D et C. Les comptes se font par texte, puis se somment. Cela évite de mélanger des textes de difficulté différente.

La fiche de prémisses commune aux bras lie un peu leurs captures. Ce biais est déclaré. Il est identique dans tous les bras.

**Taille et puissance.** Le test est apparié : chaque grave du recompte est trouvé ou non par chaque bras. Le test exact de McNemar, unilatéral à 10 %, donne les puissances suivantes, où n est le nombre de graves du recompte (SIMULÉ, 2 000 tirages par case). Le rappel de G est posé à 0,73, valeur de 20261106b sous les réserves de 1.1. La corrélation entre bras sur un même défaut est posée à 0,5 (hypothèse).

| Écart du rappel de D sur G | n = 20 | n = 36 | n = 60 | n = 90 | n = 120 | n = 160 |
|---|---|---|---|---|---|---|
| +8 points | 0,13 | 0,24 | 0,39 | 0,51 | 0,62 | 0,73 |
| +12 points | 0,23 | 0,46 | 0,65 | 0,80 | 0,89 | 0,96 |
| +15 points | 0,30 | 0,59 | 0,83 | 0,93 | 0,98 | 1,00 |
| +20 points | 0,52 | 0,83 | 0,97 | 1,00 | 1,00 | 1,00 |

Le stock est d'environ 146 / 17 = 8,6 graves par texte (ESTIMÉ, 20261106b l.57, avec les réserves de 1.1). Trois textes donnent donc environ 26 graves. Seul un écart de 20 points ou plus s'y décèle, avec une puissance voisine de 0,7 (interpolée). Pour déceler +12 points avec 0,80 de puissance, il faut 90 graves, soit 11 textes. Il en faut 16 si les défauts d'un même texte se ressemblent (effet de grappe de 1,5, hypothèse).

**Coût en jetons.** Chaque bras au plafond de 167 092 donne 501 276 jetons par texte.

| Étape | Contenu | Jetons (ESTIMÉ) |
|---|---|---|
| Réduite | 3 textes × 3 bras | 1 503 828 |
| Complète | 11 textes × 3 bras (16 textes avec effet de grappe : 8 020 416) | 5 514 036 |
| Option : jury | 3 relecteurs neufs par texte, 3 × 98 530 (moyenne des 18 jurés de 20261029f, `.experience.json` l.57 à 76) | + 295 590 par texte |
| Option : semis | 1 texte à graves plantées en nombre connu, pour étalonner l'estimateur : un correcteur à 75 881 (moyenne de 5, `.experience.json` l.26, 38, 55, 169 et 188) + 3 bras | 577 157 |

Pour comparaison, 20261029f a consommé 2 360 934 jetons (l.64), et l'expérience proposée par 20261106b était plafonnée à 3 000 000 (l.186). Les graves plantées servent seulement à étalonner l'estimateur, jamais à comparer les bras : un défaut planté d'un type donné favorise le lecteur de ce type par construction.

**Règle de décision, à fixer avant tout lancement.** Elle suit la forme de 20261106b l.188 à 195.

- Critère premier : le rappel de chaque bras sur S. Critère second : le taux de fausses alarmes, soit les graves rapportés puis rejetés au recompte, divisés par les graves rapportés.
- D passe à l'étape complète à trois conditions. Son rappel dépasse celui de G d'au moins 20 points. Il dépasse celui de C d'au moins 10 points. Ses fausses alarmes dépassent celles de G de 10 points au plus.
- D est abandonné si son rappel dépasse celui de G de moins de 8 points.
- Entre les deux, le résultat est non concluant et l'étape complète se décide à part.

Ces seuils sont des choix de cette étude, appuyés sur le tableau de puissance. Vous pouvez les changer avant le lancement, pas après.

**Étape à sec, sans jeton d'agent.** Elle précède tout banc. Elle se joue sur les journaux de boucle existants : 48 journaux dédoublonnés et 143 passes d'après le rejeu de TF-2237 (registre l.8038), contre 20 journaux au 06/11. Elle comprend quatre gestes.

- Relever pour chaque passe les comptes A, B et AB. Recalculer Chapman par passe, puis sommer, pour vérifier l'incohérence entre 73 %, 45 % et 69 %.
- Étiqueter chaque grave par angle (prémisse, texte neuf, intention, lecteur visé, autre) d'après sa citation. Compter ceux qui échappent à l'un des deux relecteurs, ou aux deux.
- Mesurer le départ réel du type `relecteur` au transcript d'une boucle de test. C'est le critère de TF-2241.
- Lire l'étude du 15/11 sur les affirmations ajoutées par une correction (`Digit-AI - Étude - Preuve de chaque affirmation ajoutée par une correction - 20261115a.md`), que TF-2242 semble citer comme son « banc du 15/11 » (rapprochement non vérifié). Cette étude n'a pas été lue ici : elle n'est pas dans les sources de la consigne, et seul son titre est connu. Elle peut déjà trancher l'angle « texte neuf ».

Porte de sortie vers l'étape réduite, fixée d'avance : deux conditions réunies. La couverture de deux généralistes, estimée par Chao sur ces journaux, est inférieure à 85 %. Et une étiquette d'angle regroupe plus de la moitié des graves qui échappent à au moins un relecteur, sans être déjà couverte par TF-2236 ou TF-2242. Sinon, l'étude s'arrête là. Les 85 % et la moitié sont des choix : à 85 %, la marge restante permet d'atteindre +12 points.

**Ce que le banc ne mesure pas.** Quatre points restent hors de portée.

- L'effet d'une boucle complète.
- Les textes qui ne sont pas des prompts.
- La diversité de modèle, distincte de l'angle et traitée à part dans 20261106b l.137.
- Le coût de recompte côté orchestrateur : 146 appels au modèle et 168 894 jetons de sortie pour 2 boucles du 06/11, hors de la liste des agents (20261106b l.100). Recompter 5 rapports au lieu de 2 alourdit ce poste, sans mesure aujourd'hui.

## 2. Non-recouvrement contre l'existant

Chaque ligne cite l'existant lu le 22/11/2026. Le tableau se lit ligne par ligne : l'existant, sa citation, et la réponse à la question « l'étude fait-elle doublon ? ».

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Type d'agent `relecteur` | « Relecture aveugle en lecture seule — lire le texte et les fichiers que la consigne cite » ; `tools: Read, Grep, Glob` (`.claude\agents\relecteur.md` l.3, l.4) | ne recouvre pas : une posture, aucun angle |
| TF-2241, type dédié | « boucle.md prescrit de lancer les relecteurs aveugles avec le type d'agent dédié `relecteur` … au lieu de general-purpose » (registre l.7915) | ne recouvre pas : vise le coût de départ, pas l'angle |
| TF-2554, lecture seule | « un type d'agent relecteur sans Write ni Edit entre à la flotte (rejoint TF-2241) » (registre l.7507) | ne recouvre pas : vise l'écriture, pas l'angle |
| TF-2236, fiche de prémisses | « règle posée en essai dans boucle.md (clé fiche_premisses, B17) » (registre l.8046) | recouvre l'angle « prémisses », sous forme de fiche et non de lecteur |
| TF-2242, vérification sur le diff | « vérification de clôture sur le diff en essai (verification_diff, B19) » (registre l.8048) | recouvre en partie l'angle « texte neuf », côté vérificateur |
| Relecture d'intention | « une restriction ou un recadrage que la demande n autorisait pas est une dérive » (`references\RELECTURE-INTENTION.md` l.42) | recouvre l'angle « intention » pour les travaux et consignes, pas pour la boucle L99 |
| `oracle-judge --lecteur-vise` | « fait relire chaque unité par 2 relecteurs qui jouent le lecteur de la fiche de conception » (`references\ECRITURE.md` l.149) | recouvre l'angle « lecteur visé » pour les fiches de conception, pas pour la boucle L99 |
| Plusieurs relecteurs, étude du 29/10 | « Plus de relecteurs n'aide que si chaque correction est vérifiée » (20261029f l.53) | ne recouvre pas : mesure le nombre de relecteurs, pas leur angle |
| Retenue en union, étude du 29/10 | « vu par au moins un relecteur, vérifié à la source » (20261029f l.21) | ne recouvre pas : règle de retenue que le banc réutilise |
| Étude du 15/11 sur les affirmations ajoutées | Titre seul connu : « Preuve de chaque affirmation ajoutée par une correction » (nom du fichier 20261115a) | NON VÉRIFIÉ : non lue, recouvrement possible de l'angle « texte neuf » |

## 3. État de l'art daté

Sept sources de moins de 24 mois, relevées le 22/11/2026. Aucune ne compare des relecteurs à angle distinct à des copies d'un même modèle sur un taux de graves trouvés dans des prompts. Trois recherches de ce jour n'en ont trouvé aucune (NON VÉRIFIÉ au-delà de ces recherches).

| Source | Date | Localisateur | Apport | Limite |
|---|---|---|---|---|
| Kohli, « Nine Judges, Two Effective Votes » | 28/05/2026 | arXiv 2605.29800 | 9 juges de 7 familles valent environ 2 votes indépendants ; leurs erreurs sont corrélées | Tâches d'inférence de langage naturel, non de relecture |
| Hossain, Yousefi, Lim, « Agreement Overstates Evidence » | 18/09/2026 | arXiv 2609.22512 | Corrélation moyenne des erreurs de 0,21 entre 10 juges, soit l'information de 3,5 juges indépendants | Juges, non relecteurs de texte |
| Liu, « LLMs as a Jury » | 11/07/2026 | arXiv 2607.10139 | Des modèles entraînés indépendamment se trompent différemment ; un plancher d'erreurs communes subsiste | Diversité de modèle, non d'angle ; comparaison des familles non lue dans le résumé |
| Li, Lin, Xia, Jin, « Rethinking Mixture-of-Agents » | 2025-02 | arXiv 2502.00674 | Agréger un seul bon modèle bat souvent un mélange de modèles : la diversité coûte en qualité | Résumé de recherche, texte intégral non lu |
| Lu et al., « Towards Practical Defect-Focused Automated Code Review » | 23/05/2025 | arXiv 2505.17928 | Un cadre multi-rôles fait « 2 fois » mieux que des modèles standards et « 10 fois » mieux que les références antérieures | Chiffres du résumé, sans décomposition ; rôles non isolés |
| Li et al., « Issue-Oriented Agent-Based Framework » (RevAgent) | 01/11/2025 | arXiv 2511.00517 | 5 agents par catégorie plus un critique améliorent BLEU de 12,90 % sur des commentaires de revue | Pas d'ablation contre un agent unique de même base |
| « Mark and recapture », Wikipédia anglaise | consultée le 22/11/2026 | https://en.wikipedia.org/wiki/Mark_and_recapture | Estimateurs de Lincoln-Petersen et de Chapman ; hypothèses de population fermée et de capture égale | Ne traite ni la dépendance ni l'hétérogénéité des captures |

La littérature récente soutient l'inquiétude d'origine : des lecteurs de même famille se trompent ensemble. Elle ne dit pas qu'un angle de consigne décorrèle ces erreurs autant qu'un modèle différent. Li et al. (2025) rappelle que diversifier n'est pas gratuit. Le banc de 1.3 sert cette question.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : réfutée. Le statu quo laisse la question du 15/11 sans réponse. Il laisse aussi 0 passe sur 59 atteindre son critère d'arrêt (20261106b l.82), avec environ 27 % du stock qui échappe à 2 relecteurs, plancher d'après 1.1 (20261106b l.83). Les trois essais en cours, TF-2236, TF-2241 et TF-2242, mesurent le coût et la vérification du diff, non le recouvrement des angles morts (registre l.8046 à l.8048).
- **O1 — étape à sec seule.** Contenu : l'étape à sec de 1.3, sur 48 journaux, sans agent. Coût estimé : complexité simple, durée court, 0 jeton d'agent. Elle exclut toute mesure d'un angle sur des lectures neuves.
- **O2 — étape à sec, puis banc réduit sous porte.** Contenu : O1, puis les 3 textes de 20261029f contre 3 bras, seulement si la porte de sortie de 1.3 est franchie. Coût estimé : complexité moyen, durée moyen, 1 503 828 jetons, plafond demandé 1 600 000. Elle exclut le banc complet. Elle ne décèle qu'un écart de 20 points ou plus.
- **O3 — banc complet d'emblée.** Contenu : 11 textes de familles variées, 3 bras, jury et semis en option. Coût estimé : complexité complexe, durée long, 5 514 036 jetons au moins. Elle exclut un arrêt précoce et demande des textes à produire.
- **O4 — déployer le bras D sans banc.** Contenu : créer 3 types de lecteurs à angle, les prescrire dans `boucle.md`, passer la règle de retenue à l'union recomptée. Coût estimé : complexité moyen, durée moyen, environ 158 295 jetons par passe, sous l'hypothèse non vérifiée d'un départ à 17 400. Elle exclut toute preuve de gain et alourdit le recompte.

Rubrique de comparaison des montants de jetons de O2, O3 et O4 (D-114 (a) du 02/11/2026) :

- Compris : les jetons des lecteurs de chaque bras, au plafond de 167 092 par bras et par texte.
- Non compris : le recompte par l'orchestrateur (hors liste, 20261106b l.100), la fiche de prémisses, le jury optionnel (+ 295 590 par texte) et le semis (577 157).
- Conséquence : tous les totaux sont des planchers. Le recompte de 4 à 5 rapports par texte au lieu de 2 s'y ajoute. Il reste à mesurer à l'étape réduite.

| Option | Rattachement | Réponse aux 3 questions du demandeur |
|---|---|---|
| O0 | P4 | Aucune |
| O1 | P1, P2 | Dit si l'angle est plausible, ne le mesure pas |
| O2 | P1, P2, P3 | Mesure l'angle si l'écart est de 20 points ou plus |
| O3 | P1, P2, P3 | Mesure l'angle dès 12 points |
| O4 | P2, P4 | Répond « comment » sans répondre « pourquoi » |

## 5. Verdict

- **Option retenue** : O2, recommandation soumise à votre décision. Elle commence sans dépense. La porte de sortie fixée d'avance arrête l'étude quand l'étape à sec montre peu de marge ou aucun angle concentré. Elle réserve la dépense à un banc qui peut conclure sur un écart de 20 points ou plus. Si l'écart est plus faible, le banc complet vous revient.
- **Coût** : complexité moyen, durée moyen. L'étape à sec n'use aucun jeton d'agent. L'étape réduite consomme 1 503 828 jetons estimés, plafond demandé 1 600 000, soit moins que les 2 360 934 jetons de 20261029f. Dette : 3 textes d'une même famille, un seul passage par bras, un recompte non mesuré.
- **Candidature(s) émise(s)** : aucune par cette étude, qui n'écrit rien au registre. Après votre décision, la session pilote journalise la suite de TF-2726. La classe `relecteurs-paralleles-sans-angle-distinct` reste à créer (registre l.8185).
- **Plan de revue** : 13/12/2026. Les résultats de l'étape à sec sont attendus avant le 29/11/2026. Le verdict est confronté ce jour-là aux critères de TF-2236, TF-2241 et TF-2242.
- **Test rétro** : la remontée Opérationnel → Tactique → Stratégie → Intention s'écrit ainsi.
  - L'étape à sec (opérationnel) dit si l'angle compte avant toute dépense (tactique). Cela sert une boucle L99 qui trouve ses graves à coût égal (stratégie), donc l'intention : savoir si spécialiser les relecteurs vaut la peine, comment et pourquoi.
  - Question 1 du demandeur, rejouée : sont-ils spécialisés ? Non : `relecteur.md` l.3 à 6 ne porte qu'une posture.
  - Question 2 : un intérêt à spécialiser ? Plausible pour le texte neuf (15 graves sur 22), non mesuré pour les trois autres angles.
  - Question 3 : comment et pourquoi ? Par le bras D et le banc de 1.3 ; le pourquoi attend la mesure.
  - Une rupture est signalée : l'angle « prémisses », demandé par le registre, est retiré des lecteurs. La fiche TF-2236 le tient, faute de shell pour le type `relecteur` et parce qu'elle coûte moins qu'un lecteur de plus.
  - L'écart à la lettre sur la capture-recapture, annoncé en section 0, attend votre accord.
