---
role: analyse L99 (8 couches) du prompt « étude d'opportunité d'un process d'analyse hebdomadaire de l'existant de la factory et des forges, pour l'amélioration continue » du 17/09/2026 — livrable principal au chapitre 8 (prompt réécrit, contrat de sortie, écarts à la lettre, protocole de tests)
sources_de_verite: [BOUCLE-AMELIORATION.md (l. 12-13, 44-85, 109-130), todo/observabilite/plan-recidives.json (l. 4, 9, 17), oracles/hook-ouverture.mjs (l. 324-344), fiches/forge-observability.md (l. 16-18), CONTRAT-INTERFACE.md (l. 367), references/TODO-FORGE.md (l. 85-132, 258-276), todo/RECIDIVES.md (l. 7, 15), todo/registre-dette.json, scripts/relever-appelants.mjs (l. 3-18), oracles/oracle-controles-injoignables.mjs (l. 3-35), gabarits/docs-projet/COMPOSANTS-OPS.md (l. 57-58, 71-75), REGLES-PROJET.md (R-29 l. 262-274, R-38 l. 578-600), references/REGLES-DE-NON-REPETITION.md (l. 30), gabarits/ETUDE-OPPORTUNITE.md, oracles/oracle-etude-opportunite.mjs (l. 6-23), references/INTENTION.md (l. 21-50), output/03-etudes/20260903-L99-amelioration-continue.md, output/03-etudes/20260903-recidives-mesure.md, output/04-plans (synthèses 20260830j, 20260830k, 20260903a, 20260903b, 20260903c)]
verifie_le: 2026-09-17
---

# Analyse L99 — « Un process hebdomadaire d'analyse de l'existant pour l'amélioration continue de la factory et des forges »

Prompt analysé le 17/09/2026, niveau **L99** *(analyse complète en 8 couches, chacune relisant le
prompt d'origine)*. Le mot-clé d'appel « Améliore ce prompt » a été retiré ; l'entrant est le texte
qui le suit, cité ici en entier :

> « Construis une étude d'opportunité pour la mise en place d'un process d'analyse et d'étude
> hebdomadaire de l'existant de la factory et des forges afin de mettre en oeuvre un processus
> d'amélioration continue des outils par l'optimisation de l'existant, le nettoyage du code mort,
> l'analyse des retours et todos traités et la façon dont ils ont été traités et appliqués, ainsi
> que les prochaines actions à mettre en oeuvre, notamment en automatisant plus les retours depuis
> les produits, la prise en compte automatique par la Factory en limitant les interventions
> humaines, dans la conception, construction, déploiement, application aux produits, retours des
> produits et accélération systématique de ses processus d'amélioration continue. »

**Ce que le lecteur va apprendre d'abord.** La factory porte déjà une boucle d'amélioration
continue, et deux cadences y tournent : une sonde hebdomadaire des récidives et une revue des
classes de défauts par quinzaine. Le prompt l'ignore, alors qu'un prompt très proche a été analysé
le 03/09/2026 et a produit cinq livrables. Exécuté tel quel, il ferait concevoir ce qui existe.
Il touche pourtant trois questions que personne n'a mesurées : ce qui dort dans le dépôt sans
servir, ce que deviennent les items une fois clos, et quelles interventions humaines sont des
gestes mécaniques plutôt que des décisions. Le prompt réécrit garde l'intention, part de
l'existant, et remplace l'objectif « moins d'humain » par une carte des interventions qui sépare
ce que la loi du projet réserve à l'humain de ce qui peut lui être retiré.

---

## Chapitre 1 — OODA · Cadrage stratégique et étalon noté

Le prompt obtient 20 sur 100. Trois défauts bloquants le plafonnent : il ignore l'existant, il
présuppose le verdict de l'étude qu'il commande, et il demande de réduire les interventions
humaines sans dire lesquelles, alors que plusieurs sont des règles du projet.

### Observe — ce que le prompt dit réellement

Une seule phrase porte un verbe de commande, « Construis une étude d'opportunité », et cinq objets
enchaînés par des virgules :

- une revue périodique : « process d'analyse et d'étude hebdomadaire de l'existant de la factory et
  des forges » ;
- deux chantiers d'entretien : « l'optimisation de l'existant, le nettoyage du code mort » ;
- un bilan : « l'analyse des retours et todos traités et la façon dont ils ont été traités et
  appliqués » ;
- un plan : « les prochaines actions à mettre en oeuvre » ;
- une automatisation de bout en bout : « en automatisant plus les retours depuis les produits, la
  prise en compte automatique par la Factory en limitant les interventions humaines », sur six
  étapes nommées, de la conception aux retours des produits.

Le prompt ne fixe ni livrable, ni lecteur, ni critère de réussite, ni limite. Le seul chiffre
implicite est la cadence, « hebdomadaire ».

### Orient — le contexte réel du prompt

L'auteur pilote seul la factory et ses forges, et il décide de tout ce qui entre au registre
TODO-FORGE *(le registre unique des améliorations, `todo\TODO.jsonl`)*. Son objectif profond se
lit dans la fin de la phrase : il veut passer moins de temps à faire tourner la boucle, et que la
boucle tourne plus vite. Le destinataire du prompt est une session du pilot, qui dispose du dépôt.

Quatre faits du dépôt changent la lecture du prompt :

- La boucle existe et elle est événementielle. Son déclencheur est « un `retour` consigné dans un
  ledger de run », et « Pas de retour consigné → pas d'itération » (`BOUCLE-AMELIORATION.md`
  l. 119-121).
- Deux cadences tournent déjà. La sonde des récidives est hebdomadaire et tenue par le hook
  d'ouverture de session (`todo\observabilite\plan-recidives.json` l. 9 et 17,
  `oracles\hook-ouverture.mjs` l. 324-339). La revue des classes est bornée à « au plus UNE revue
  par quinzaine » (`BOUCLE-AMELIORATION.md` l. 53-54).
- Un prompt voisin a déjà été traité. Le 03/09/2026, « Conçois et construis un système
  d'amélioration continue de la factory » a été noté 28 sur 100, puis réécrit en « mesure les
  récidives, puis complète le système existant sur ses trous ». Cinq livrables en sont sortis
  (synthèses `20260903a`, `20260903b` et `20260903c` de `output\04-plans\`).
- La remontée automatique des retours a été instruite le 30/08/2026. Le verdict mesuré : le canal
  montant n'a « aucun déclencheur et aucun transport », et sur 107 appels de contrôle, 59 %
  seulement exposent un verdict extractible (synthèses `20260830j` et `20260830k`). La conclusion
  écrite alors : ce qui s'automatise est l'obligation d'émettre et le transport, pas le contenu du
  retour.

### Decide — trois stratégies possibles

1. **Exécuter à la lettre** : concevoir un process hebdomadaire neuf couvrant les cinq objets. Le
   résultat serait un sixième mécanisme posé à côté des cinq du 03/09, sans mesure de ce qu'ils
   laissent passer.
2. **Étudier le reste à couvrir** : relever ce que les cadences existantes regardent déjà, mesurer
   sur une fenêtre datée ce qu'elles ne voient pas, puis juger si une revue hebdomadaire est la
   bonne réponse à ces trous ou s'il suffit d'ajouter des sondes au plan existant.
3. **Sauter l'étude** : ajouter directement trois sondes au plan de surveillance. Le seuil du
   gabarit d'étude l'interdit : le sujet touche le noyau et plus de trois forges
   (`gabarits\ETUDE-OPPORTUNITE.md` l. 15-17).

### Act — approche recommandée

La stratégie 2. Elle tient la leçon du 03/09, où la mesure préalable a changé la forme de la
réponse. Elle garde aussi l'option de ne rien construire, que le prompt d'origine exclut.

### Étalon — à quoi ressemble le prompt idéal pour cette intention

Le prompt idéal cite l'intention de l'auteur, nomme l'existant à relire, sépare les objets à
étudier, borne ce qui reste humain par la loi du projet, fixe une mesure de base et des seuils,
et désigne le gabarit et l'oracle qui jugent l'étude.

Le tableau se lit ligne par ligne : une dimension, son barème, la note du prompt d'origine et la
raison de cette note. Les lignes suivent l'ordre de la rubrique L99, rien n'est trié.

| Dimension | Barème | Note | Justification |
|---|---|---|---|
| Clarté de l'intention | 20 | 10 | Le livrable est nommé, mais cinq objets se partagent une phrase et le verdict est déjà écrit : « pour la mise en place ». |
| Spécification | 20 | 3 | Ni lecteur, ni forme, ni longueur, ni gabarit ; « hebdomadaire » est la seule valeur posée. |
| Garde-fous et contraintes | 15 | 1 | « en limitant les interventions humaines » sans frontière, face à des règles qui réservent des gestes à l'humain. |
| Ancrage et contexte | 15 | 2 | Aucune référence à la boucle existante, aux cadences en place ni aux études du 30/08 et du 03/09. |
| Vérifiabilité de la sortie | 15 | 1 | Aucun critère ne dit à quoi se reconnaît une opportunité, ni un process qui marche. |
| Robustesse | 15 | 3 | « optimisation », « code mort », « accélération systématique » se lisent de dix façons. |
| **Total** | **100** | **20** | Trois défauts bloquants : le score resterait plafonné à 40 même avec de meilleures notes. |

---

## Chapitre 2 — Chainlogic · Raisonnement en chaîne

Le prompt contient une chaîne implicite, et elle casse à deux endroits : entre l'analyse et
l'amélioration, puis entre l'automatisation et l'accélération.

La chaîne, reconstituée depuis les connecteurs du prompt (« afin de », « par », « notamment en ») :

- Si l'on analyse l'existant chaque semaine (A), alors on obtient un processus d'amélioration
  continue (B).
- Si ce processus optimise, nettoie et fait le bilan des items traités (C), alors on en tire les
  prochaines actions (D).
- Si l'on automatise les retours et leur prise en compte (E), alors les interventions humaines
  baissent (F), donc les processus s'accélèrent (G).

**Rupture 1, entre A et B.** Une analyse périodique produit des constats, pas des améliorations.
Entre les deux se tient la gouvernance du registre : « tout entre en `candidat` ; seul un mandat
humain […] passe en `decide` » (`references\TODO-FORGE.md` l. 128). Une revue hebdomadaire ajoute
donc des candidats chaque semaine. Elle augmente la charge de décision de l'humain avant de la
réduire.

**Rupture 2, entre F et G.** Le prompt tient pour acquis que l'humain est le goulot. La seule
mesure disponible dit autre chose : la classe de défaut `boucle-retour-sans-descente` *(une
correction close au pilot qui n'arrive pas chez le produit)* compte 15 récidives sur 15 items
(`todo\RECIDIVES.md` l. 15, état au 16/09/2026). Le retard se loge dans la descente vers les produits, où
le pilot n'écrit pas, et non dans la décision.

**Collision entre instructions.** « Construis une étude d'opportunité » demande un jugement
ouvert. « pour la mise en place » et « afin de mettre en oeuvre » demandent un plan de
déploiement. Le gabarit d'étude impose de traiter l'option « ne rien faire » (règle E4 de l'oracle
d'étude, `oracles\oracle-etude-opportunite.mjs` l. 12). Les deux lectures ne tiennent pas dans le
même livrable.

---

## Chapitre 3 — Blindspots · Inventaire maître

Dix-sept défauts, dont trois bloquants. Les trois bloquants ont la même racine : le prompt écrit
la conclusion avant la mesure.

Le tableau est l'unique liste de référence des défauts de l'analyse. Une ligne vaut un défaut,
avec son numéro `#N` repris par les chapitres suivants et par le changelog. Les lignes sont
classées par sévérité décroissante, puis par ordre d'apparition dans le prompt.

| # | Défaut | Sévérité |
|---|---|---|
| 1 | **L'existant est ignoré.** La boucle, la sonde hebdomadaire, la revue par quinzaine, le tableau des récidives et les études du 30/08 et du 03/09 ne sont pas cités. L'étude les redécouvrirait ou les doublerait. | bloquant |
| 2 | **Le verdict est présupposé.** « pour la mise en place » exclut l'option de ne rien faire, et aucun critère ne dit à quoi se reconnaît une opportunité. | bloquant |
| 3 | **« en limitant les interventions humaines » n'a pas de frontière.** Les dépenses et les gates restent humains (loi transverse n° 5 du noyau), le push est un GO humain (R-38, règle 38 du projet, `REGLES-PROJET.md` l. 594-596), et la boucle s'interdit toute « application sans validation humaine » (`BOUCLE-AMELIORATION.md` l. 12-13). Une étude qui suit la lettre recommanderait de lever des règles. | bloquant |
| 4 | **Cinq objets dans un seul livrable.** Revue, entretien, bilan, plan et automatisation n'ont ni la même mesure ni le même risque. Le gabarit exige un verdict unique (règle E5). | majeur |
| 5 | **« hebdomadaire » n'a pas de porteur.** Le pilot n'a aucun ordonnanceur : « pas de scheduler interne (cadence documentaire) » (`fiches\forge-observability.md` l. 16-18). La cadence actuelle dépend de l'ouverture d'une session. Le prompt ne dit pas qui lance la revue. | majeur |
| 6 | **« hebdomadaire » n'est pas justifié.** La revue des classes est bornée à la quinzaine pour une raison écrite, et rien ne dit pourquoi la semaine conviendrait mieux ici. | majeur |
| 7 | **« code mort » n'est pas défini.** Le dépôt porte des scripts, des oracles, des règles en prose, des gabarits, des classes et des documents. Deux outils ne couvrent que les contrôles sans appelant (`scripts\relever-appelants.mjs` l. 3-8, `oracles\oracle-controles-injoignables.mjs` l. 32-35). | majeur |
| 8 | **Le nettoyage est traité comme sûr.** Le précédent mesuré dit l'inverse : sur dix composants déclarés inutilisés, cinq n'étaient pas supprimables, et « deux suppressions évidentes d'après le nom auraient tué le produit » (`gabarits\docs-projet\COMPOSANTS-OPS.md` l. 57-58 et 71-75). Supprimer est de plus un geste humain (R-29, règle 29). | majeur |
| 9 | **« optimisation de l'existant » n'a pas de grandeur.** Durée des hooks, taille du noyau, coût en tokens d'un run, nombre de règles, temps de lecture humain : le prompt n'en nomme aucune. | majeur |
| 10 | **Le bilan des items traités n'a pas de mesure.** Le dépôt en offre pourtant quatre : la descente (règle R12 du registre), la récidive comptée (R13), le délai clôture vers descente, l'adoption par produit (`references\TODO-FORGE.md` l. 85-126 et 258-270). Plus de 600 clôtures antérieures au 02/09 restent en prose (l. 93-94). | majeur |
| 11 | **Le périmètre d'écriture est muet.** « la factory et les forges » couvre le pilot et treize forges, et « application aux produits » couvre 24 dépôts suivis. Le noyau interdit d'écrire chez eux hors mandat. | majeur |
| 12 | **Le coût du process n'est pas compté.** Une revue hebdomadaire coûte des tokens, une restitution à lire et des décisions à trancher, chaque semaine. Aucune contre-mesure ne borne ce coût. | majeur |
| 13 | **La boucle sur elle-même n'est pas bornée.** « accélération systématique de ses processus d'amélioration continue » demande un process qui améliore le process. La règle de contre-lecture existe pour la revue des classes (`BOUCLE-AMELIORATION.md` l. 64-67), rien d'équivalent n'est demandé ici. | majeur |
| 14 | **Aucune mesure de base.** Sans état daté des compteurs, l'étude ne peut ni réfuter le statu quo ni fixer un seuil de gain. | majeur |
| 15 | **L'étude du 30/08 sur la remontée automatique n'est pas reprise.** Ses deux décisions sur l'émetteur et sur ce qui l'alimente n'ont pas de trace d'exécution retrouvée sur disque au 17/09. | majeur |
| 16 | **Ni lecteur, ni forme, ni gabarit, ni oracle ne sont nommés**, alors que le pilot en impose (`gabarits\ETUDE-OPPORTUNITE.md`, `references\INTENTION.md`). | majeur |
| 17 | Vocabulaire flottant : « todos » pour les items du registre, « Factory » et « factory ». | mineur |

Biais probable de l'auteur : la malédiction du savoir. Il connaît la boucle par cœur et ne la cite
plus, ce qui prive le destinataire du seul point de départ utile.

---

## Chapitre 4 — Factcheck · Audit des prémisses

Le prompt n'affirme aucun chiffre, mais il tient six choses pour vraies. Une est fausse en
partie, une est contredite par la mesure disponible, trois sont invérifiables en l'état.

Le tableau se lit ligne par ligne : la prémisse telle que le prompt la suppose, le verdict, puis
la pièce qui le fonde. Les lignes suivent l'ordre du prompt.

| Prémisse implicite | Verdict | Pièce |
|---|---|---|
| Il n'existe pas de process périodique d'analyse, puisqu'il faut le « mettre en place ». | **faux en partie** | Sonde hebdomadaire et revue par quinzaine existent ; ce qui n'existe pas est une revue de l'existant dormant. Remonté au défaut #1. |
| La semaine est la bonne cadence. | **invérifiable** | Aucune mesure ne relie une cadence à un gain. Remonté au défaut #6. |
| Le dépôt porte assez de code mort pour justifier un nettoyage récurrent. | **invérifiable** | Seule mesure connue : « sept contrôles écrits ou spécifiés qu'aucune étape n'appelle » (`scripts\relever-appelants.mjs` l. 5-6). Remonté au défaut #7. |
| La façon dont un item a été traité et appliqué est lisible au registre. | **vrai depuis le 02/09, faux avant** | R12 exige la descente depuis le 02/09/2026 ; les clôtures antérieures sont en prose. Remonté au défaut #10. |
| Les interventions humaines sont ce qui ralentit la boucle. | **contredit par la mesure disponible** | Le retard mesuré est la descente chez les produits (15 récidives sur 15). Aucun temps humain par étape n'est mesuré. Remonté au défaut #3. |
| Les retours des produits peuvent être pris en compte automatiquement. | **périmé en partie** | L'étude du 30/08 a montré que le contenu d'un retour reste un jugement ; seuls l'obligation et le transport s'automatisent. Remonté au défaut #15. |

---

## Chapitre 5 — Premortem · Anticipation d'échec

L'étude a été rendue et elle a déçu. Voici les cinq causes les plus probables, de la plus probable
à la moins probable, chacune avec son mécanisme et sa parade.

1. **L'étude décrit un sixième mécanisme.** *(escalade du défaut #1)* Elle dessine une revue
   hebdomadaire complète, avec son script et son rapport, sans lire le plan de surveillance. Deux
   dispositifs regardent ensuite les mêmes compteurs. Parade : le relevé de non-recouvrement est
   fourni dans le prompt, et l'étude doit dire pour chaque besoin s'il s'agit d'une sonde à
   ajouter ou d'un objet neuf.
2. **L'étude recommande de lever des gates.** *(escalade du défaut #3)* Pour « limiter les
   interventions humaines », elle propose la décision automatique des candidats ou l'écriture
   chez les produits. La recommandation est inapplicable et le reste du document perd son crédit.
   Parade : une carte des interventions en trois familles, dont une est déclarée intouchable.
3. **L'étude rend un catalogue d'idées.** *(escalade des défauts #2 et #14)* Sans mesure de base
   ni seuil, chaque objet reçoit un paragraphe favorable et une liste d'actions. Rien n'est
   réfutable. Parade : une mesure de base datée avant toute option, et un seuil chiffré par
   objet.
4. **Le nettoyage casse quelque chose.** *(escalade du défaut #8)* La revue liste des fichiers
   « sans appelant », une session suivante les supprime, et un produit qui les héritait tombe.
   Parade : l'étude ne supprime rien, et tout candidat au retrait passe par un relevé d'usage et
   une décision humaine.
5. **La revue s'étouffe sous son propre débit.** *(défaut neuf, remonté comme #12 au chapitre 3)*
   Chaque passage dépose dix candidats, l'humain n'en tranche que trois, le stock grossit et la
   revue n'est plus lue. C'est le défaut que le hook d'ouverture nomme déjà : « Un constat qu'on
   relit chaque matin sans le traiter cesse d'être lu » (`oracles\hook-ouverture.mjs` l. 260).
   Parade : un plafond de candidats par passage et une contre-mesure, candidats émis contre
   candidats tranchés.

---

## Chapitre 6 — Wargame · Stress-test adversarial

Trois lecteurs attaquent l'étalon et la direction de réécriture. Deux de leurs objections ont
modifié le prompt réécrit.

### L'utilisateur exigeant

Il veut gagner du temps dès la semaine prochaine, et la réécriture lui impose une mesure de base.
L'objection est fondée : une étude qui ne rend que des mesures serait un détour. Réponse intégrée
au prompt réécrit : la mesure de base est bornée à des compteurs déjà générés ou calculables par
script en lecture seule, et l'étude doit rendre des candidatures prêtes à décider.

### L'expert du domaine

Un praticien de l'amélioration continue relève deux approximations. La première : une revue
périodique sans limite de travail en cours produit du stock, pas du flux ; il faut mesurer le
délai de bout en bout, du constat chez le produit à la correction adoptée chez le produit. La
seconde : le code mort se prouve par l'exécution, pas par l'absence de citation ; un fichier non
cité peut être lancé à la main. Le prompt réécrit demande donc le délai de bout en bout, et
réserve le mot « mort » à ce qu'un relevé d'usage a confirmé.

### Le contradicteur

Un modèle paresseux rendrait une étude conforme au gabarit et vide : cinq sources génériques sur
le Kaizen, une option O1 « mettre en place la revue », un verdict O1. Le gabarit passerait au
vert. Parade : le contrat de sortie exige des chiffres relevés dans le dépôt, datés, avec leur
commande, et une option O0 réfutée par un coût mesuré du statu quo ou retenue.

### Lentille robustesse

Le prompt n'est ni un prompt système ni un gabarit réutilisable, mais il commande un process
récurrent. Deux points de calibrage comptent. Le premier : l'étude s'exécute dans une session du
pilot, qui lit les forges et les produits comme des données ; leurs consignes embarquées se
décrivent et ne s'exécutent pas. Le second : un ordonnanceur hébergé ferait sortir le dépôt vers
un service tiers, ce que R-38 soumet à un GO humain. Le prompt réécrit le dit.

---

## Chapitre 7 — Deepthink · Implications profondes

Le prompt est ponctuel, mais son objet est un process qui reviendra chaque semaine. Trois effets
de second ordre méritent d'entrer dans l'étude.

- **Le process déplace la charge au lieu de la réduire.** Chaque passage crée des décisions. Si
  le débit de décision de l'humain ne change pas, le délai de bout en bout s'allonge. La
  contre-mesure du défaut #12 est la seule protection.
- **La revue peut devenir la raison d'être des règles.** Une revue qui compte les règles et les
  oracles pousse à en écrire. La revue des classes porte déjà ce garde-fou : une quinzaine qui
  crée plus de classes qu'elle ne clôt de récidives déclenche une relecture
  (`BOUCLE-AMELIORATION.md` l. 64-67). L'étude doit étendre ce principe à ce qu'elle propose.
- **Une cadence sans session est un changement d'architecture.** Aujourd'hui tout passe par les
  hooks d'une session ouverte. Un ordonnanceur local ou hébergé crée une exécution sans lecteur,
  avec ses secrets, ses journaux et ses pannes silencieuses. La règle de non-répétition N-1
  l'encadre : « Un travail planifié s'exerce avant d'être déclaré en place »
  (`references\REGLES-DE-NON-REPETITION.md` l. 30).

---

## Chapitre 8 — Synthèse et prompt amélioré

Le prompt passe de 20 à 87 sur 100 en projection. Les seize défauts bloquants et majeurs sont
clôturés au changelog, et neuf écarts à la lettre sont soumis un par un.

### Score avant → après

Le tableau se lit ligne par ligne : la dimension, la note d'origine, la note projetée du prompt
réécrit et ce qui explique l'écart. Les lignes suivent l'ordre de la rubrique.

| Dimension | Avant | Après | Ce qui change |
|---|---|---|---|
| Clarté de l'intention | 10 | 18 | Intention citée, quatre objets séparés, verdict ouvert. |
| Spécification | 3 | 17 | Lecteur, gabarit, emplacement, forme des annexes. |
| Garde-fous et contraintes | 1 | 13 | Carte des interventions, lecture seule, rien n'est supprimé. |
| Ancrage et contexte | 2 | 14 | Existant nommé avec ses chemins, études antérieures à reprendre. |
| Vérifiabilité de la sortie | 1 | 13 | Mesure de base datée, seuils, contrat de sortie, oracle nommé. |
| Robustesse | 3 | 12 | Définitions posées, options fermées, plafond de candidats. |
| **Total** | **20** | **87** | |

### Diagnostic en trois lignes

- Force : l'intention est lisible et légitime, l'auteur veut une boucle qui tourne sans lui.
- Faiblesse : le prompt commande une construction déjà faite en partie et présuppose son verdict.
- Risque : « limiter les interventions humaines » sans frontière pousse l'étude contre les règles
  du projet.

### Prompt réécrit (prêt à copier)

```text
Tu es l'orchestrateur du pilot digit-ai-factory. Tu instruis une étude d'opportunité, en lecture
seule sur les forges et sur les produits.

INTENTION (mes mots, à citer tels quels en tête de l'étude) :
« mettre en oeuvre un processus d'amélioration continue des outils […] en limitant les
interventions humaines […] et accélération systématique de ses processus d'amélioration
continue. »
Ce que j'en attends : que la boucle d'amélioration tourne plus vite et me demande moins de
gestes, sans me retirer une seule décision que les règles du projet me réservent.

QUESTION À TRANCHER
Faut-il ajouter une revue hebdomadaire de l'existant à la boucle d'amélioration de la factory et
des forges, et sous quelle forme ? « Ne rien ajouter » est une réponse possible.

POINT DE DÉPART OBLIGATOIRE — relis avant d'écrire, et cite-les dans le tableau de
non-recouvrement :
- BOUCLE-AMELIORATION.md : le cycle (l. 109-130) et la revue des classes par quinzaine (l. 44-85) ;
- todo\observabilite\plan-recidives.json, todo\observer-recidives.mjs et oracles\hook-ouverture.mjs
  (l. 324-344) : la sonde hebdomadaire et qui la lance ;
- todo\RECIDIVES.md, todo\CLASSES.json, todo\registre-dette.json, todo\HERITAGE-RELEVES.jsonl ;
- references\TODO-FORGE.md : descente R12, récidive R13, délai et adoption (l. 85-132, 258-276) ;
- scripts\relever-appelants.mjs, oracles\oracle-controles-injoignables.mjs,
  gabarits\docs-projet\COMPOSANTS-OPS.md (section « Composants inutilisés ») ;
- output\03-etudes\20260903-L99-amelioration-continue.md, 20260903-recidives-mesure.md, et les
  synthèses 20260830j, 20260830k, 20260903a, 20260903b, 20260903c de output\04-plans\.
Dis ce que sont devenues les deux décisions du 30/08 sur l'émetteur de retours côté produit
(émetteur hérité et ses deux déclencheurs ; ce qui alimente la remontée) : exécutées, écartées,
ou sans trace.

PAS 0 — MESURE DE BASE, AVANT TOUTE OPTION
Sur la fenêtre du 20/08/2026 au 17/09/2026, par script en lecture seule, chaque chiffre avec sa
commande et sa date :
1. débit : items créés, décidés, clos par semaine ; stock de candidats en fin de semaine ;
2. délai de bout en bout : date du constat chez le produit → clôture au pilot → descente
   constatée chez le produit (médiane et maximum ; ce qui n'est pas mesurable est dit, jamais
   mis à zéro) ;
3. qualité du traitement : part des clôtures portant une descente R12, récidives par classe,
   items clos dont la classe a récidivé ensuite ;
4. existant dormant : contrôles sans appelant, règles écrites sans oracle, gabarits et scripts
   que rien ne cite ni ne lance, entrées « todo » du registre de dette ;
5. interventions humaines : chaque geste humain de la chaîne produit → pilot → forge → produit,
   compté sur la fenêtre, et classé dans UNE de ces trois familles :
   (G) gate de loi — décision candidat → decide, GO de mise en production, push, dépense, mandat
       d'écriture chez une forge ou un produit, suppression de fichier : INTOUCHABLE, l'étude ne
       propose jamais de le retirer ;
   (M) geste mécanique — copie d'un lot, lancement d'une commande, relance : candidat à
       l'automatisation ;
   (J) jugement — contenu d'un retour, choix d'une classe : reste à un agent ou à l'humain,
       l'étude dit lequel et pourquoi.

QUATRE OBJETS, INSTRUITS SÉPARÉMENT (partition de l'étude)
A. Revue de l'existant : que regarderait une revue périodique que ni la sonde hebdomadaire ni la
   revue des classes ne regardent ? Pour chaque besoin : une sonde à ajouter au plan existant, ou
   un objet neuf ?
B. Existant dormant (« code mort ») : définis-le par type d'objet (script, oracle, règle, gabarit,
   classe, document). « Sans appelant » n'est pas « mort » : un retrait ne se propose qu'après un
   relevé d'usage, chez le pilot ET chez les produits qui héritent. L'étude ne supprime rien.
C. Bilan des items traités : quelles mesures du pas 0 méritent d'être suivies dans le temps, et
   que faire des clôtures en prose antérieures au 02/09/2026 ?
D. Automatisation de la chaîne : pour chaque geste (M) du pas 0, le mécanisme qui le retire, son
   déclencheur et son porteur. Reprends les conclusions du 30/08 : l'obligation d'émettre et le
   transport s'automatisent, le contenu d'un retour reste un jugement.

CADENCE ET PORTEUR
Justifie la cadence par le débit mesuré : semaine, quinzaine ou seuil de volume, avec
l'alternative écartée. Nomme le porteur du déclenchement parmi : hook d'ouverture de session
(existant), tâche planifiée locale, agent planifié hébergé. Un service hébergé relève de R-38 et
d'un GO humain. Tout travail planifié porte un mode à la demande, exercé une fois (N-1).

OPTIONS — JEU FERMÉ
O0 ne rien ajouter ; O1 étendre le plan de sondes et la revue des classes existants, sans objet
neuf ; O2 revue périodique jouée en session, lancée par le hook, rendant un rapport daté et des
candidatures ; O3 revue lancée hors session par une tâche planifiée locale ; O4 revue lancée par
un agent planifié hébergé. Chaque option : contenu, coût en complexité × durée, coût récurrent
par passage (tokens et décisions demandées à l'humain), ce qu'elle exclut. O0 est réfutée par un
coût du statu quo mesuré au pas 0, ou retenue.

SEUILS DE VERDICT (valeurs proposées, à amender avant lancement)
Une option autre que O0 n'est retenue que si le pas 0 montre au moins l'un de ces faits :
un délai médian de bout en bout supérieur à 7 jours ; au moins 10 objets dormants confirmés ; au
moins 5 gestes (M) par semaine. Toute revue proposée porte un plafond de 5 candidatures par
passage et une contre-mesure : candidatures émises contre candidatures tranchées, avec relecture
du dispositif si le stock monte deux passages de suite.

LIVRABLE
- Étude au gabarit gabarits\ETUDE-OPPORTUNITE.md, déposée sous
  output\03-etudes\<AAAAMMJJ>-etude-opportunite-revue-hebdomadaire-de-l-existant.md, jugée par
  oracles\oracle-etude-opportunite.mjs (règles E1 à E10) ; verdict UNIQUE sur la question posée,
  les objets A à D entrant comme composantes des options.
- Annexe de mesure : les chiffres du pas 0, leurs commandes, la carte des interventions.
- État de l'art : au moins 5 sources datées de moins de 24 mois, ou « non instruit » motivé.
- Candidatures : un sidecar .tf.jsonl sous input\01-candidatures\, 5 candidatures au plus,
  chacune avec sa classe, son gain attendu mesurable et sa preuve.
- Écrit pour moi, qui décide : ce qui change pour moi d'abord, français, phrases courtes, effort
  en complexité × durée, jamais en jours.
- Restitution finale au gabarit gabarits\RESTITUTION.md.

INTERDITS
Aucune écriture hors du pilot. Aucune suppression. Aucun mécanisme construit : l'étude rend un
verdict et des candidatures. Aucune proposition de retirer un geste (G). Aucun chiffre sans
commande ni date. Si une mesure du pas 0 est impossible, dis-le avec la tentative et rends le
verdict sous réserve, jamais un chiffre estimé.

VÉRIFICATION AVANT REMISE
Joue l'oracle d'étude ; rejoue une fois chaque commande de l'annexe et compare ; vérifie que
chaque option et chaque candidature remonte à l'intention citée (test rétro de
references\INTENTION.md). Trois passes de correction au plus ; au-delà, remets avec la liste des
écarts restants.
```

### Contrat de sortie, en clair

La réponse produite par le prompt réécrit est acceptée si chacun de ces points est vrai :

- l'étude passe `oracle-etude-opportunite` *(l'oracle du gabarit d'étude)*, exit 0 ;
- le tableau de non-recouvrement cite au moins les six groupes de fichiers du point de départ ;
- l'annexe porte les cinq mesures du pas 0, chacune avec une commande et une date, ou sa
  tentative déclarée ;
- la carte des interventions classe chaque geste dans une seule famille, et aucune proposition ne
  touche un geste de la famille (G) ;
- l'option O0 est réfutée par un chiffre du pas 0, ou retenue ;
- la cadence et le porteur sont justifiés, avec l'alternative écartée ;
- toute revue proposée porte son plafond et sa contre-mesure ;
- le sidecar compte cinq candidatures au plus ;
- `git status` ne montre aucune écriture hors du pilot, et aucune suppression.

### Écarts à la lettre

Le prompt réécrit s'écarte du texte reçu à neuf endroits. Le tableau se lit ligne par ligne : ce
qui a été écrit, ce qui est proposé, et la raison. Les lignes suivent l'ordre du prompt
d'origine. Chaque ligne se valide ou s'amende par son numéro.

| N° | Vous avez écrit | Je propose | Pourquoi |
|---|---|---|---|
| 1 | « pour la mise en place d'un process » | une question ouverte, où ne rien ajouter reste possible | le gabarit d'étude impose de traiter O0 (E4) ; défaut #2 |
| 2 | « hebdomadaire » | une cadence à justifier par le débit mesuré, la semaine restant l'hypothèse de départ | la revue voisine est bornée à la quinzaine ; défaut #6 |
| 3 | « de l'existant de la factory et des forges » | lecture seule sur les forges et les produits | le noyau interdit d'y écrire hors mandat ; défaut #11 |
| 4 | « le nettoyage du code mort » | un relevé de l'existant dormant, sans aucune suppression | cinq composants « inutilisés » sur dix n'étaient pas supprimables ; défaut #8 |
| 5 | « l'optimisation de l'existant » | fondue dans les objets A et B, sans chantier propre | aucune grandeur à optimiser n'est nommée ; défaut #9. À amender si vous visez une grandeur précise. |
| 6 | « en limitant les interventions humaines » | une carte en trois familles, dont les gates de loi sont intouchables | R-29, R-38 et la loi n° 5 réservent ces gestes ; défaut #3 |
| 7 | « dans la conception, construction, déploiement, application aux produits, retours des produits » | la chaîne produit → pilot → forge → produit, c'est-à-dire la boucle d'amélioration, et non les étapes d'un run de produit | lecture retenue de « ses processus d'amélioration continue » ; à confirmer |
| 8 | « accélération systématique » | un délai de bout en bout mesuré, et une contre-mesure sur le stock | une accélération sans mesure n'est pas réfutable ; défauts #12 et #13 |
| 9 | aucun seuil | quatre chiffres proposés par moi : 7 jours, 10 objets, 5 gestes par semaine, 5 candidatures par passage | sans seuil, le verdict ne se juge pas ; défaut #14. Les quatre valeurs sont à votre main. |

### Protocole de tests du livrable

Le livrable est un document texte accompagné de données. Le protocole s'applique à l'étude
produite, jamais au prompt, et il est embarqué dans le prompt réécrit sous « Vérification avant
remise ».

- **Oracles** : `oracles\oracle-etude-opportunite.mjs` pour la forme de l'étude ;
  `check_markdown.py` *(oracle de lisibilité du socle `digit-ai-page-html`)* pour la lecture ;
  `todo\oracle-todo.mjs` après ingestion du sidecar ; `oracle-synthese` pour la restitution.
- **Jeu d'essai** : rejouer chaque commande de l'annexe et comparer au chiffre écrit ; tirer trois
  items clos au hasard et vérifier à la main leur délai de bout en bout ; cas limite : une mesure
  impossible doit apparaître comme tentative déclarée, pas comme zéro.
- **Boucle bornée** : trois passes de correction au plus, arrêt sur les critères du contrat de
  sortie, puis remise avec les écarts restants.
- **Délégation** : si le skill `la-boucle` est présent, l'itération lui revient.

### Changelog tracé

Chaque ajout du prompt réécrit se rattache à un défaut numéroté du chapitre 3. Le tableau se lit
ligne par ligne, dans l'ordre du prompt réécrit.

| Ajout | Défaut corrigé |
|---|---|
| Intention citée et attente formulée | #2, #16 |
| Question ouverte, O0 possible | #2, rupture de collision du chapitre 2 |
| Point de départ obligatoire et sort des décisions du 30/08 | #1, #15, prémisses 1 et 6 du chapitre 4 |
| Pas 0 en cinq mesures datées | #14, #10, cause d'échec 3 |
| Carte des interventions G, M, J | #3, cause d'échec 2, prémisse 5 |
| Quatre objets séparés, verdict unique | #4 |
| Définition par type et interdiction de supprimer | #7, #8, cause d'échec 4 |
| « optimisation » fondue dans A et B | #9 |
| Cadence justifiée et porteur nommé, N-1, R-38 | #5, #6, chapitre 7 |
| Options O0 à O4 avec coût récurrent | #12 |
| Seuils, plafond et contre-mesure | #12, #13, #14, cause d'échec 5 |
| Lecture seule et interdits | #11 |
| Livrable, lecteur, gabarit, oracle, vérification | #16, attaque du contradicteur |
| « items du registre » à la place de « todos » | #17 |
