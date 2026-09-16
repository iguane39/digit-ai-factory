---
role: analyse L99 (8 couches) du prompt « anticiper, par un outil de conception spécialisé par types de documents, de contenus et de lecteurs, les formats et contenus des fichiers HTML en amont de leur construction ; l'appliquer aux gabarits sans retour ; prévoir une amélioration continue à chaque retour pour s'approcher de documents sans retour utilisateur » du 14/09/2026 — livrable principal au chapitre 8 (prompt réécrit, contrat de sortie, écarts à la lettre, protocole de tests)
sources_de_verite: [gabarits/documents/README.md (règles D1-D9, l. 94-110), gabarits/documents/catalogue.jsonl (32 familles), oracles/oracle-gabarits-documents.mjs (G1-G4, G8), references/ECRITURE.md (typologie T1-T5, l. 43-47), ~/.claude/skills/quality-oracles/scripts/oracle-conception-livrable.mjs (C1-C3), ~/.claude/skills/quality-oracles/scripts/oracle-lecture-tiers.mjs (T1-T4), todo/CLASSES.json, todo/RECIDIVES.md (état du 14/09/2026 10:02 UTC), output/03-etudes/20260914-etude-opportunite-personas-par-phase.md, oracles/banc-defauts-echappes/ (TF-1073), input/01-candidatures/qualite-sans-personas-p3-p5-20260914a.tf.jsonl (TF-1074 à TF-1079), relevé des documents du parc affichant leur gabarit (grep « Gabarit : gd- », 14/09/2026)]
verifie_le: 2026-09-14
---

# Analyse L99 — « Concevoir en amont les documents HTML par type de document, de contenu et de lecteur ; éprouver les gabarits sans retour ; boucler à chaque retour »

Prompt analysé le 14/09/2026, niveau **L99** *(analyse complète en 8 couches, chacune relisant le
prompt d'origine)*. Le message portait aussi « 4a », la décision D-4 (a) de la synthèse du même
jour, exécutée à part : elle n'est pas l'objet de cette analyse. Le mot-clé « Améliore ce prompt » est
retiré ; l'entrant est cité en entier :

> « comment anticiper, via un outil de conception, spécialisé par types de documents, types de
> contenus, types de lecteurs cibles, afin de travailler en amont de la construction des fichiers
> HTML leurs formats et contenus ? Et l'appliquer également aux gabarits qui n'ont pas encore reçus
> de retour pour les améliorer également ? Prévoir également une amélioration continue à chaque
> retour sur des documents et/ou gabarits pour optimiser/amélioration à chaque fois les nouveaux
> documents générés et s'approcher de documents générés sans retour utilisateur ? »

**Ce que le lecteur va apprendre d'abord.** Le prompt demande de construire ce que la factory
possède déjà en pièces détachées, et il ne voit pas la pièce qui manque vraiment. Les pièces
existent : la règle D8 *(règle de conception des gabarits : un livrable se conçoit avant de
s'écrire, de l'intention du lecteur à l'opérationnel)*, une typologie des textes par lecteur dans
`ECRITURE.md`, un catalogue de 32 familles de documents, un oracle de conception et un oracle de
lecture par un tiers sans contexte. Ce qui manque est mesuré : aucune de ces pièces n'est jouée
AVANT l'écriture, et leurs trois classes de défaut récidivent à 100 %. Le catalogue ne connaît ni
le lecteur ni le type de contenu. Et l'objectif final, « des documents sans retour », n'a pas de
dénominateur : 14 documents seulement, dans tout le parc, affichent le gabarit dont ils sortent.
Le prompt réécrit garde les trois intentions, part de l'existant, définit le lecteur par ce qu'il
doit décider plutôt que par un personnage, remplace « zéro retour » par un taux mesurable, et
éprouve les gabarits avant de les modifier.

---

## Chapitre 1 — OODA · Cadrage stratégique et étalon noté

Le prompt obtient 28 sur 100. Trois défauts bloquants le plafonnent : il ignore l'existant, il ne
dit pas s'il demande une étude, un outil ou un mandat, et son objectif final ne se mesure pas.

### Observe — ce que le prompt dit réellement

Trois demandes chaînées par « Et » et « également », toutes formulées en questions.

- **La conception en amont** : « comment anticiper, via un outil de conception, spécialisé par
  types de documents, types de contenus, types de lecteurs cibles ». Trois axes de spécialisation,
  un moment (« en amont de la construction des fichiers HTML »), deux objets (« leurs formats et
  contenus »).
- **Les gabarits non éprouvés** : « l'appliquer également aux gabarits qui n'ont pas encore reçus
  de retour pour les améliorer ». Un périmètre défini par une absence (pas de retour), une action
  (améliorer).
- **La boucle** : « une amélioration continue à chaque retour sur des documents et/ou gabarits ».
  Un déclencheur (chaque retour), un effet attendu (améliorer « à chaque fois les nouveaux
  documents générés »), une cible (« s'approcher de documents générés sans retour utilisateur »).
- **Ce qui est absent** : la nature du livrable (étude, outil, mandat), l'existant à relever, la
  définition des trois typologies, la mesure de départ, la métrique de la cible, les garde-fous,
  la place de l'humain, les formats autres que HTML.

### Orient — le contexte réel du prompt

L'auteur est l'opérateur de l'écosystème ; le destinataire est le pilot. Six faits relevés le
14/09/2026 changent la lecture.

1. **La conception amont est déjà une règle.** `gabarits\documents\README.md` l. 103, règle D8 :
   « Un livrable se CONÇOIT avant de s'écrire : intention → stratégie → tactique → opérationnel,
   et se vérifie en remontant. » Elle s'appuie sur Goal-Question-Metric, Minto, Rumelt, Double
   Diamond et le V-model. L. 106 : « Ces règles sont une DOCTRINE, pas un oracle. »
2. **Le lecteur a une typologie, mais une seule case pour tous les documents.** `ECRITURE.md`
   l. 43-47 classe les textes en T1 à T5 par lecteur ; T2 *(livrables documentaires)* n'a qu'un
   lecteur : « le destinataire nommé du livrable ». Un directeur qui arbitre et un exploitant qui
   dépanne y sont le même lecteur.
3. **Le catalogue connaît le document, pas le lecteur ni le contenu.** Ses familles portent
   `quand_l_employer`, `formats`, `regles`, `oracles`, `preuve` ; aucun champ ne décrit le lecteur
   cible ni le type de contenu. Statuts au 14/09 : 5 `ok`, 11 `a_extraire`, 16 `porte_ailleurs`
   *(famille tenue par une autre forge ou un skill)*.
4. **Les oracles existent et jugent après coup.** `oracle-conception-livrable` (quality-oracles,
   règles C1 à C3 : glossaire, listes autoportantes, intention de chapitre) et `oracle-lecture-tiers`
   (T1 à T4 : intention, vocabulaire, geste, lecture sans le brief) jugent un document écrit.
   `oracle-lecture-tiers` ne tourne que sur invocation explicite.
5. **La boucle existe, et elle récidive.** Retours → registre → classes → récidives
   (`BOUCLE-AMELIORATION.md`, `todo\RECIDIVES.md`). Les trois classes du sujet :
   `gabarit-famille-manquante` 13 récidives sur 13 retours, `lecture-tiers-non-jugee` 7 sur 7,
   `gabarit-conception-non-jugee` 3 sur 3 — cette dernière « non mesurable : la règle ne vit dans
   aucun artefact hérité ».
6. **L'objectif final n'a pas de dénominateur.** La règle G4 *(tout document rend visiblement son
   gabarit et sa version)* d'`oracle-gabarits-documents` permettrait de compter les documents par
   famille ; dans tout le parc, 14 fichiers HTML seulement affichent « Gabarit : gd-… » (5 rapports
   de données, 3 CV anonymisés, 2 dossiers d'exploitation, 2 dossiers d'architecture, 1 fiche
   sécurité, 1 marqueur vide). La règle D9 *(une mesure dit son dénominateur)* interdit donc
   aujourd'hui tout taux de retours par document.

L'objectif profond n'est pas « un outil », c'est **qu'un document parte juste la première fois pour
le lecteur qu'il sert**, et que chaque retour rende les suivants plus justes, y compris ceux des
familles qui n'ont pas encore été lues. L'étude du même jour ajoute une contrainte : un rôle incarné
ne fait pas trouver plus de défauts ; le lecteur se définit donc par ce qu'il doit décider, pas par
un personnage.

### Decide — trois stratégies possibles

- **S1, construire un outil de conception neuf** (un skill par type de document, de contenu et de
  lecteur). Visible, rapide à annoncer ; double D8, `ECRITURE.md`, le catalogue et deux oracles, et
  reproduit à l'échelle du pilot la classe `oracle-remplace-par-controle-maison` *(un contrôle
  maison écrit à la place de l'oracle existant)*, qui récidive à 86 %. Écartée.
- **S2, étendre et câbler l'existant, mesuré.** Ajouter au catalogue le lecteur et le type de
  contenu, faire jouer la conception et la lecture par un tiers AVANT l'écriture, éprouver les
  gabarits non lus par des défauts semés, propager chaque retour à toutes les familles de sa classe,
  et mesurer un taux à dénominateur connu. Coût moyen, objets déjà gouvernés.
- **S3, réécrire tous les gabarits sans retour maintenant.** Donne un résultat tangible ; modifie
  27 familles sans preuve de défaut, dont 16 tenues par d'autres forges où le pilot n'écrit pas.
  Écartée.

### Act — approche recommandée

S2, instruite par une étude d'opportunité, puisque tout objet durable qui en sortira relève de la
règle 31 *(un objet durable naît d'un verdict de non-recouvrement écrit)*. L'étude se mesure sur les
retours réels de documents avant de proposer quoi que ce soit.

### Étalon — à quoi ressemble le prompt idéal pour cette intention

Le prompt idéal nomme sa nature (étude puis construction sur GO), part de l'existant cité, définit
les trois typologies à partir de sources établies, définit le lecteur par ses décisions, fixe
l'ensemble « gabarits sans retour » par une mesure, remplace « zéro retour » par une métrique à
dénominateur, rend la propagation d'un retour latérale (à toute la classe), borne le coût de la
conception amont, et nomme gabarit, oracles et chemin du livrable.

**Mode de lecture du tableau suivant** : une ligne par dimension de la rubrique L99 ; la note est
comparée au maximum de la dimension, la justification cite le passage en cause. Les dimensions
sont dans l'ordre de la rubrique.

| Dimension | Note | Justification |
|---|---|---|
| Clarté de l'intention | 12 / 20 | trois intentions lisibles, mais posées en questions (« comment… ? ») : on ne sait pas si l'on attend une réponse, une étude ou un outil |
| Spécification | 4 / 20 | aucune définition des typologies, aucun format de sortie, « fichiers HTML » seul alors que le catalogue porte aussi Markdown et PowerPoint |
| Garde-fous et contraintes | 2 / 15 | rien sur le coût par document, la place de l'humain, les forges tierces, la réécriture sans preuve |
| Ancrage et contexte | 3 / 15 | ignore D8, `ECRITURE.md`, le catalogue, deux oracles, la boucle et le banc du jour |
| Vérifiabilité de la sortie | 3 / 15 | « s'approcher de documents générés sans retour » n'a ni métrique ni dénominateur |
| Robustesse | 4 / 15 | « outil » présuppose un objet neuf ; « sans retour » récompense qui cesse de demander un avis |
| **Total** | **28 / 100** | trois défauts bloquants : la note est déjà sous le plafond de 40 |

---

## Chapitre 2 — Chainlogic · Raisonnement en chaîne

Le prompt porte une vraie chaîne : concevoir en amont, donc mieux produire ; appliquer aux gabarits
non lus, donc les améliorer ; boucler à chaque retour, donc converger vers zéro retour. Deux
maillons cassent.

- **Si l'on conçoit en amont, alors les documents sont justes.** Saut non étayé : D8 existe depuis
  le 02/09 et `gabarit-conception-non-jugee` a récidivé trois fois sur trois depuis. Une conception
  écrite mais non jouée ne change rien ; le maillon manquant est le **câblage** au moment de
  l'écriture, pas la conception elle-même.
- **Si un gabarit n'a pas reçu de retour, alors il faut l'améliorer.** Ambigu : l'absence de retour
  ne dit ni qu'il est bon ni qu'il est mauvais. Le maillon juste est « l'éprouver » d'abord (défauts
  semés, lecture par un tiers sur son instance), puis ne le modifier que sur un échec mesuré.
- **Si l'on boucle à chaque retour, alors on s'approche de zéro retour.** Rupture : la boucle
  actuelle corrige le document ou la famille touchés, pas les autres familles de la même classe ; le
  même défaut de style de sommaire a frappé deux squelettes l'un après l'autre (« la DEUXIÈME fois »,
  `oracle-gabarits-documents.mjs`). Sans propagation latérale, la convergence n'a pas lieu. Et
  « zéro retour » mesure autant le silence du lecteur que la qualité du document.

---

## Chapitre 3 — Blindspots · Inventaire maître

Dix-huit défauts, dont trois bloquants. Presque tous tiennent à un même silence : le prompt décrit
une solution (« un outil ») sans relever ce qui existe ni ce qui manque vraiment.

**Mode de lecture** : une ligne par défaut, classée par sévérité puis par ordre d'apparition ; le
numéro `#N` sert de renvoi aux chapitres suivants et au changelog. Les lignes *remonté* viennent
d'une couche aval.

| # | Défaut | Sévérité |
|---|---|---|
| 1 | L'existant est ignoré : D8, typologie T1-T5, catalogue, `oracle-conception-livrable`, `oracle-lecture-tiers`, boucle d'amélioration, banc des défauts échappés ; risque d'un outil parallèle | bloquant |
| 2 | La nature du livrable n'est pas dite : réponse, étude, outil ou mandat ; un objet durable relève de la règle 31 | bloquant |
| 3 | La cible « documents sans retour » ne se mesure pas : aucun dénominateur (14 documents étiquetés dans le parc), et l'absence de retour n'est pas l'absence de défaut | bloquant |
| 4 | « Types de documents » n'est pas rattaché aux 32 familles du catalogue | majeur |
| 5 | « Types de contenus » n'est pas défini ; des typologies établies existent (information, procédure, référence) et ne sont pas citées | majeur |
| 6 | « Types de lecteurs » n'est pas défini ; risque de le traiter en personas, que l'étude du jour vient d'écarter | majeur |
| 7 | Le moment de la conception n'est pas situé dans le run (conception, design, écriture) ni dans le parcours d'un mandat documentaire | majeur |
| 8 | « Gabarits sans retour » est flou : les 5 `ok` sont tous cités dans au moins un lot, les 11 `a_extraire` n'existent pas encore, les 16 `porte_ailleurs` sont hors du pilot | majeur |
| 9 | « Améliorer » un gabarit non lu sans preuve de défaut expose à des régressions | majeur |
| 10 | La boucle n'est pas latérale : un retour ne se propage pas à toutes les familles de la même classe | majeur |
| 11 | Le coût par document de la conception amont n'est pas borné ; un geste coûteux se contourne (classe `gate-cout-invite-au-contournement`) | majeur |
| 12 | La place de l'humain n'est pas dite : qui valide une conception, et à quel prix | majeur |
| 13 | « Fichiers HTML » exclut les familles Markdown et PowerPoint du catalogue | majeur |
| 14 | L'héritage n'est pas prévu : un outil du pilot n'agit chez un produit que s'il y redescend (39 manques au relevé du 14/09) | majeur |
| 15 | *remonté du Ch4* : prémisse fausse, « la boucle d'amélioration continue reste à créer » ; elle existe, elle est réactive | majeur |
| 16 | *remonté du Ch5* : la métrique « zéro retour » est manipulable (loi de Goodhart : on obtient moins de retours en demandant moins d'avis) | majeur |
| 17 | *remonté du Ch6* : aucune mesure de départ n'est demandée (retours par famille et par classe sur une période donnée) | majeur |
| 18 | Accords (« reçus », « optimiser/amélioration ») | mineur |

---

## Chapitre 4 — Factcheck · Audit des prémisses

Le prompt n'affirme rien en toutes lettres ; il tient quatre choses pour vraies. Deux sont fausses,
deux invérifiables en l'état.

**Mode de lecture** : une ligne par prémisse implicite, son statut, la preuve, et le défaut de
l'inventaire où elle est remontée.

| Prémisse implicite | Statut | Preuve | Remontée |
|---|---|---|---|
| Aucun outil ne conçoit un document avant son écriture | faux | D8 (`gabarits\documents\README.md` l. 103) ; `oracle-conception-livrable` ; `oracle-lecture-tiers` | Ch3 #1 |
| L'amélioration continue sur retour reste à créer | faux | `BOUCLE-AMELIORATION.md` ; registre à 74 classes et 133 récidives au 14/09/2026 | Ch3 #15 |
| Un gabarit sans retour a besoin d'être amélioré | invérifiable | aucune instance réelle pour 11 familles, aucune mesure de défaut pour les autres | Ch3 #8, #9 |
| On peut s'approcher de documents sans retour et le constater | invérifiable aujourd'hui | 14 documents étiquetés dans le parc : pas de dénominateur (règle D9) | Ch3 #3 |

---

## Chapitre 5 — Premortem · Anticipation d'échec

Le prompt a été exécuté tel quel ; trois mois plus tard, les retours n'ont pas baissé. Cinq causes,
de la plus à la moins probable.

1. **Un outil parallèle.** *Scénario* : un skill « conception documentaire » naît avec sa propre
   typologie et sa propre fiche ; D8, `ECRITURE.md` et le catalogue continuent de vivre à côté.
   *Mécanisme* : sans relevé de l'existant, le plus simple est d'écrire du neuf ; c'est exactement la
   classe `oracle-remplace-par-controle-maison`. *Mitigation* : non-recouvrement cité ligne par ligne,
   extension de l'existant par défaut (escalade de #1).
2. **Des lecteurs en personnages.** *Scénario* : « le DSI pressé », « l'exploitant de nuit » ;
   chaque document reçoit un paragraphe de ton, rien ne change. *Mécanisme* : l'étude du jour mesure
   qu'un rôle incarné ne fait pas trouver plus de défauts. *Mitigation* : le lecteur se définit par
   ce qu'il doit décider, ce qu'il sait déjà, le vocabulaire qu'il n'a pas et son contexte de lecture,
   et se vérifie par `oracle-lecture-tiers` (escalade de #6).
3. **Le silence pris pour de la qualité.** *Scénario* : le taux de retours baisse parce que moins de
   documents sont lus ou commentés. *Mécanisme* : « sans retour » ne distingue pas un document juste
   d'un document ignoré. *Mitigation* : taux de retours par document étiqueté, plus une mesure
   indépendante du lecteur (défauts semés, banc) ; défaut neuf remonté en #16.
4. **Une réécriture spéculative.** *Scénario* : les 27 familles non éprouvées sont retouchées « par
   anticipation », deux régressions partent en production. *Mécanisme* : modifier sans échec mesuré.
   *Mitigation* : éprouver d'abord (défauts semés de TF-1079, lecture par un tiers sur l'instance),
   modifier sur échec seulement ; les familles d'autres forges passent par lots (escalade de #9).
5. **Une fiche que personne ne remplit.** *Scénario* : la conception amont prend vingt minutes par
   document, les sessions la sautent. *Mécanisme* : un geste plus coûteux que son gain se contourne.
   *Mitigation* : fiche remplie par l'agent, bornée à quelques champs, validée par l'humain seulement
   quand le document est à fort enjeu, coût mesuré (escalade de #11).

---

## Chapitre 6 — Wargame · Stress-test adversarial

Les trois attaques visent la direction de réécriture, et chacune la déplace d'un cran.

### L'utilisateur exigeant

Il ne veut pas un outil, il veut voir **avant** la construction une fiche d'une demi-page : à qui
s'adresse le document, ce que ce lecteur doit décider en le lisant, ce qu'il ne sait pas, le type de
contenu de chaque partie, le format retenu et pourquoi. Il la valide en deux minutes, ou la corrige
d'une ligne, et le document suit. Il veut aussi savoir, chaque mois, combien de documents sont
partis et combien sont revenus, famille par famille. Le prompt réécrit l'exige : fiche courte,
validation humaine réservée aux documents à fort enjeu, tableau de bord à dénominateur.

### L'expert du domaine

Un spécialiste de la rédaction technique relève trois points.

- Les **types de contenus** ont des typologies établies : les types d'information de l'Information
  Mapping (procédure, processus, concept, principe, structure, fait) et les types de sujet de DITA
  *(Darwin Information Typing Architecture, standard OASIS : concept, tâche, référence)*. Ce sont des
  normes anciennes, à citer comme telles et à vérifier ; elles évitent d'inventer une taxonomie
  maison.
- L'**analyse du lecteur** est une étape connue de la rédaction technique et du langage clair
  (ISO 24495-1:2023, déjà citée par la factory le 11/09) : elle part de ce que le lecteur doit faire
  avec le document. C'est la bonne base pour les « types de lecteurs », pas une liste de métiers.
- Le **format suit le contenu** : une procédure appelle des étapes numérotées, une référence un
  tableau filtrable (règle L4 du socle HTML *(filtres de colonne sur les tableaux de données)*), un
  concept de la prose. La matrice document × contenu × lecteur doit se réduire à ces règles de
  dérivation, sinon elle explose (32 familles × 6 types × N lecteurs).

### Le contradicteur

Deux conformités paresseuses menacent. La première rend une taxonomie superbe (trois axes, des
dizaines de cases) et un skill qui la récite, sans un seul document mieux reçu. La seconde écrit un
paragraphe « amélioration continue » dans un README et déclare la boucle faite. Le prompt réécrit les
ferme : tout objet naît d'une mesure de départ et d'un rétro-test sur des retours réels, et la boucle
se prouve par un retour propagé à toutes les familles de sa classe.

### Lentille robustesse

Le prompt n'est pas un prompt système, mais son résultat s'appliquera à chaque document produit. Un
point de calibrage : la conception amont ne doit pas dépendre d'un modèle ou d'un outil que la
session n'a pas ; elle se remplit en texte, se juge par des oracles déjà installés, et redescend chez
les produits par l'héritage, sans quoi elle n'agit que dans le pilot (défaut remonté en #14).

---

## Chapitre 7 — Deepthink · Implications profondes

Le mécanisme visé touche chaque document de chaque produit : ses effets d'échelle comptent. Trois se
voient d'avance.

- **Le coût se multiplie par le volume.** Une minute de conception par document se paie sur tous
  les documents ; au-delà d'un seuil, la fiche se saute. D'où une fiche bornée et une validation
  humaine réservée au fort enjeu.
- **Le catalogue devient la colonne vertébrale.** Ajouter le lecteur et le type de contenu au
  catalogue fait de lui la source unique ; la dérive entre catalogue et documents réels devient le
  premier risque, et G4 (étiquette de gabarit visible) devient la condition de toute mesure.
- **La boucle change de nature.** Aujourd'hui chaque retour produit une correction ; une propagation
  par classe transforme chaque retour en contrôle rejoué sur toutes les familles, ce qui rend
  mesurable, pour la première fois, la santé des gabarits que personne n'a encore lus.

---

## Chapitre 8 — Synthèse et prompt amélioré

Le prompt réécrit passe de 28 à 88 sur 100 (projeté). Le gain vient de quatre ajouts : partir de
l'existant cité, définir le lecteur par ses décisions, éprouver avant de modifier, et mesurer un
taux à dénominateur au lieu de viser « zéro retour ».

### Score avant → après

**Mode de lecture** : une ligne par dimension ; « après » est projeté, pas mesuré ; la dernière
colonne dit l'ajout qui fait l'écart.

| Dimension | Avant | Après (projeté) | Ce qui fait l'écart |
|---|---|---|---|
| Clarté de l'intention | 12 / 20 | 18 / 20 | intention profonde écrite, nature étude puis construction |
| Spécification | 4 / 20 | 17 / 20 | trois typologies définies, formats du catalogue, gabarit et chemin |
| Garde-fous et contraintes | 2 / 15 | 13 / 15 | coût borné, humain au fort enjeu, forges tierces par lots, pas de réécriture sans échec |
| Ancrage et contexte | 3 / 15 | 14 / 15 | existant cité, récidives mesurées, banc et candidatures du jour |
| Vérifiabilité de la sortie | 3 / 15 | 13 / 15 | taux à dénominateur, rétro-test, seuil fixé d'avance |
| Robustesse | 4 / 15 | 13 / 15 | extension par défaut, lecteur non incarné, métrique non manipulable |
| **Total** | **28 / 100** | **88 / 100** | |

### Diagnostic en trois lignes

- **Force** : la demande vise juste ; les défauts de documents se paient au retour, et les gabarits
  non lus ne sont jamais éprouvés.
- **Faiblesse** : elle ignore que la conception amont, la typologie des lecteurs et la boucle
  existent déjà, et vise une cible qui ne se mesure pas.
- **Correction** : câbler l'existant avant l'écriture, éprouver avant de modifier, propager chaque
  retour à sa classe, mesurer par document étiqueté.

### Prompt réécrit (prêt à copier)

```text
Mandat d'étude d'opportunité, joué dans le pilot. Lecture seule sur les produits et les forges ;
écriture dans output\03-etudes\ et input\01-candidatures\ du pilot, et au registre par ingestion.

INTENTION, dans mes mots : « anticiper, via un outil de conception spécialisé par types de
documents, de contenus et de lecteurs cibles, les formats et contenus des fichiers HTML en amont de
leur construction ; l'appliquer aux gabarits qui n'ont pas encore reçu de retour ; prévoir une
amélioration continue à chaque retour pour s'approcher de documents générés sans retour
utilisateur ». Ce que j'attends : qu'un document parte juste la première fois pour le lecteur qu'il
sert, et que chaque retour rende plus justes les documents suivants, y compris ceux des familles que
personne n'a encore lues. « Outil » est une hypothèse : étendre l'existant est une réponse recevable.

POINT DE DÉPART OBLIGATOIRE, à citer avant toute proposition :
- la règle D8 de gabarits\documents\README.md (un livrable se conçoit avant de s'écrire), qui se
  déclare « doctrine, pas oracle » ;
- la typologie T1-T5 de references\ECRITURE.md, où les livrables documentaires (T2) n'ont qu'un
  lecteur, « le destinataire nommé » ;
- gabarits\documents\catalogue.jsonl (32 familles : 5 ok, 11 a_extraire, 16 porte_ailleurs), qui
  ne décrit ni le lecteur ni le type de contenu ;
- oracle-conception-livrable (C1-C3) et oracle-lecture-tiers (T1-T4) de quality-oracles, qui jugent
  APRÈS l'écriture, le second sur invocation explicite seulement ;
- les récidives de todo\RECIDIVES.md : gabarit-famille-manquante 13/13, lecture-tiers-non-jugee
  7/7, gabarit-conception-non-jugee 3/3 ;
- l'étude du 14/09/2026 sur les personas (un rôle incarné n'augmente pas les défauts trouvés), le
  banc des défauts échappés (TF-1073) et les candidatures TF-1076 et TF-1079.

1. PARTITION, trois objets instruits séparément :
   A — conception amont : ce qu'on fixe avant d'écrire un document (intention au sens de D8,
       lecteur, type de contenu de chaque partie, format dérivé), qui le remplit (l'agent), qui le
       valide (l'humain, seulement pour les documents à fort enjeu, critère à écrire), où cela vit
       (catalogue, ECRITURE.md, GABARIT.md de chaque famille) et quel oracle le juge ;
   B — gabarits non éprouvés : l'ensemble se DÉFINIT PAR MESURE (statut au catalogue, lots de
       retours qui le citent, instances réelles) ; l'action est d'ÉPROUVER avant de modifier ;
   C — boucle : ce qui se passe à chaque retour, et comment il se propage à TOUTES les familles de
       sa classe, pas seulement au document ou à la famille touchés.
   Formats : ceux du catalogue (HTML d'abord, Markdown et PowerPoint quand la famille les porte).

2. TYPOLOGIES, jamais inventées :
   - types de documents = les familles du catalogue ;
   - types de contenus = une typologie établie et citée (types d'information de l'Information
     Mapping, types de sujet DITA, ou mieux si l'état de l'art le montre), avec pour chaque type le
     format qu'il appelle (étapes numérotées, tableau filtrable au sens de L4, prose) ;
   - lecteurs = définis par ce qu'ils doivent DÉCIDER avec le document, ce qu'ils savent déjà, le
     vocabulaire qu'ils n'ont pas, leur contexte de lecture (écran, impression, mobile) ; jamais un
     personnage (étude du 14/09/2026).

3. NON-RECOUVREMENT, une ligne citée par existant : D8, ECRITURE.md, catalogue et
   oracle-gabarits-documents (G1-G4, G8), oracle-conception-livrable, oracle-lecture-tiers,
   digit-ai-communication (analyse d'audience et préréglages par type de livrable), systeme-de-marque
   (voix.md), la-barre (référence de qualité avant production), forge-design (DESIGN.md, maquette),
   BOUCLE-AMELIORATION.md et le registre des classes, le banc TF-1073.

4. ÉTAT DE L'ART : au moins 5 sources datées de moins de 24 mois au 14/09/2026, lues pendant le
   mandat, sur la conception documentaire centrée lecteur, les typologies de contenu et la mesure de
   la qualité documentaire ; les normes plus anciennes (ISO 24495-1:2023, DITA, Information Mapping)
   sont citées comme références normatives, signalées comme telles.

5. MESURE, exécutée en lecture seule, AVANT toute proposition :
   - départ : sur les 30 derniers jours, les retours portant sur des documents et des gabarits, par
     famille et par classe ; le nombre de documents produits par famille qu'on peut compter (étiquette
     G4 « Gabarit : gd-… ») et ceux qu'on ne peut pas ;
   - rétro-test : pour 20 griefs de documents tirés des lots de retours (liste avec source avant les
     résultats), dire lequel une conception amont remplie AVANT l'écriture aurait évité (lecteur,
     décision, vocabulaire, type de contenu, format), lequel un oracle existant aurait évité s'il avait
     été joué, et lequel aucun des deux ;
   - seuil fixé maintenant : la conception amont est justifiée si elle aurait évité au moins 6 griefs
     sur 20 que les oracles existants, joués, n'auraient pas évités.

6. OPTIONS, jeu fermé O0-O4, chacune avec coût (complexité × durée, coût par document produit), ce
   qu'elle exclut, les griefs du rétro-test qu'elle aurait évités :
   O0 — ne rien faire ; réfutée ou retenue sur la mesure.
   O1 — étendre et câbler l'existant : champs lecteur et type de contenu au catalogue, T2 décliné
        par lecteur dans ECRITURE.md, oracle-conception-livrable et oracle-lecture-tiers joués
        d'office par le hook d'écriture des pages, étiquette G4 exigée.
   O2 — O1 plus une fiche de conception amont par document (gabarit court, remplie par l'agent,
        validée par l'humain au fort enjeu), jugée par un oracle avant l'écriture.
   O3 — O2 plus l'épreuve des gabarits non lus (défauts semés de TF-1079, lecture par un tiers sur
        leur instance) et la propagation de chaque retour à toute sa classe.
   O4 — un outil ou un skill neuf ; seulement si O1 à O3 sont réfutées par écrit, règle 31 prouvée.

GARDE-FOUS. Aucun persona. Aucune réécriture d'un gabarit sans échec mesuré sur lui. Aucune écriture
chez les produits ni dans les forges : les familles porte_ailleurs passent par lots de travaux.
Aucune cible « zéro retour » : la métrique est le taux de retours par document étiqueté, plus une
mesure indépendante du lecteur (banc, défauts semés), et zéro récidive d'une classe close. Coût de la
conception amont mesuré et borné par document. Aucun objet durable construit avant le GO humain.

LIVRABLE. output\03-etudes\<AAAAMMJJ>-etude-opportunite-conception-documentaire-amont.md, au gabarit
gabarits\ETUDE-OPPORTUNITE.md, avec en annexe la mesure de départ et le tableau du rétro-test ; une
candidature par option retenue, ingérée ; restitution au gabarit gabarits\RESTITUTION.md, le GO de
construction posé en décision.

CONTRAT DE SORTIE. L'étude est rejetée s'il manque l'un de ces points :
- node oracles\oracle-etude-opportunite.mjs PASS (E1-E10) et check_markdown.py PASS (M7, M10, M14, M18) ;
- les six points de départ cités, chacun avec son chemin ;
- A, B, C instruits séparément ; trois typologies définies avec leur source ;
- l'ensemble « gabarits non éprouvés » donné par une mesure, famille par famille ;
- la mesure de départ publiée avec son dénominateur, ou déclarée impossible avec sa trace ;
- 20 griefs listés avec leur source AVANT les résultats du rétro-test ;
- O0 tranchée par un chiffre du rétro-test ; un seul verdict ; un plan de revue daté ;
- la métrique de la boucle écrite avec sa formule ; aucune cible « zéro retour » ;
- aucun fichier écrit hors des emplacements autorisés (git status le montre).
```

### Contrat de sortie, en clair

L'étude rendue devra passer deux oracles (`oracle-etude-opportunite.mjs`, règles E1 à E10 du
gabarit d'étude ; `check_markdown.py`, règles M7 ouverture de chapitre, M10 mode de lecture des
tableaux, M14 marqueurs de travail oubliés, M18 glose des identifiants) et tenir dix décomptes : les
six points de départ cités, les trois objets instruits séparément, trois typologies sourcées,
l'ensemble des gabarits non éprouvés mesuré, une mesure de départ à dénominateur, vingt griefs
listés avant les résultats, O0 tranchée par un chiffre, un verdict unique, une métrique de boucle
avec sa formule, aucune écriture hors des emplacements autorisés.

### Écarts à la lettre

Le prompt réécrit s'écarte de votre texte en sept endroits ; chacun se valide ou se rejette.

**Mode de lecture** : une ligne par écart, dans l'ordre du prompt réécrit ; vos mots, ce que je
propose, pourquoi.

| N° | Vous avez écrit | Je propose | Pourquoi |
|---|---|---|---|
| 1 | « comment anticiper… ? » (une question) | une étude d'opportunité mesurée, la construction après votre GO | Ch3 #2 ; tout objet durable relève de la règle 31 |
| 2 | « via un outil de conception » | un mécanisme, qui peut être une extension de l'existant ; un outil neuf n'est qu'une option (O4) | Ch3 #1, Ch5 n° 1 |
| 3 | « types de lecteurs cibles » | des lecteurs définis par leurs décisions, leur savoir, leur vocabulaire et leur contexte de lecture, jamais des personnages | Ch3 #6, étude du 14/09/2026 |
| 4 | « types de contenus » | une typologie établie et citée, dont chaque type dicte un format | Ch3 #5, Ch6 expert |
| 5 | « fichiers HTML » | les formats du catalogue, HTML d'abord | Ch3 #13 |
| 6 | « gabarits qui n'ont pas encore reçu de retour… les améliorer » | un ensemble défini par mesure, ÉPROUVÉ avant d'être modifié ; les familles d'autres forges par lots | Ch3 #8, #9, Ch5 n° 4 |
| 7 | « s'approcher de documents générés sans retour utilisateur » | un taux de retours par document étiqueté, une mesure indépendante du lecteur, zéro récidive d'une classe close ; le seuil de 6 griefs sur 20 est une proposition de ma part | Ch3 #3, #16, Ch4 |

### Protocole de tests du livrable

Le livrable du prompt réécrit est une étude avec des données de mesure. Le protocole est prescrit à
l'exécutant ; L99 ne l'exécute pas.

**Mode de lecture** : une ligne par partie du livrable et l'oracle qui la juge, dans l'ordre de
production.

| Partie | Type | Oracle |
|---|---|---|
| Étude au gabarit | document texte | `node oracles\oracle-etude-opportunite.mjs`, puis `check_markdown.py` |
| Mesure de départ | données | cohérence : totaux par famille et par classe recalculés, dénominateur écrit, familles non comptables nommées |
| Rétro-test | données | 20 lignes, source de chaque grief, une colonne par voie (conception amont, oracle existant, aucun), totaux justes |
| Candidatures | données | `node todo\ingerer-lot.mjs` puis `node todo\oracle-todo.mjs`, exit 0 |
| Restitution | document texte | `node oracles\oracle-synthese.mjs` |

**Jeu d'essai minimal**, à jouer sur le rétro-test avant de conclure :

- *cas nominal* : un grief de lecteur (« on n'y comprend absolument rien », lot du 02/09) ; attendu :
  une conception amont qui nomme la décision et le vocabulaire du lecteur l'aurait évité, et
  `oracle-lecture-tiers` joué aussi ;
- *cas limite 1* : un grief de rendu (texte bridé à 57 % de la largeur, règle D1) ; attendu : un
  oracle existant l'évite, la conception amont n'y ajoute rien ;
- *cas limite 2* : un grief qui tient à un fait extérieur (une décision affirmée sans trace) ;
  attendu : ni la conception amont ni un oracle de forme ne l'évitent, seul `oracle-autorite-decision`.

**Boucle bornée** : produire, juger, corriger, trois itérations au plus ; au-delà, livrer avec les
écarts résiduels. La mesure elle-même n'est jamais rejouée pour atteindre le seuil.

### Changelog tracé

**Mode de lecture** : une ligne par modification, rattachée au défaut qu'elle corrige.

| Modification | Défaut corrigé |
|---|---|
| + point de départ obligatoire, six existants cités | Ch3 #1 (bloquant), #15, Ch5 n° 1 |
| + nature « étude puis construction sur GO » | Ch3 #2 (bloquant) |
| + métrique à dénominateur, mesure indépendante, pas de « zéro retour » | Ch3 #3 (bloquant), #16, Ch5 n° 3 |
| + typologies rattachées au catalogue et à des sources établies | Ch3 #4, #5 |
| + lecteur défini par ses décisions, sans personnage | Ch3 #6, Ch5 n° 2 |
| + partition A, B, C et moment de la conception | Ch3 #7 |
| + gabarits non éprouvés définis par mesure, éprouvés avant modification | Ch3 #8, #9, Ch5 n° 4 |
| + propagation d'un retour à toute sa classe | Ch3 #10, Ch2 |
| + coût borné, humain au fort enjeu | Ch3 #11, #12, Ch5 n° 5 |
| + formats du catalogue | Ch3 #13 |
| + héritage et lots aux forges | Ch3 #14, Ch6 lentille |
| + mesure de départ et rétro-test à seuil fixé | Ch3 #17, Ch6 contradicteur |
| accords : non corrigés dans la citation de l'intention, qui reste vos mots | Ch3 #18 (mineur) |
