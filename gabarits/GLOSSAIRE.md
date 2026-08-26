---
role: la terminologie OPPOSABLE d'un projet multilingue — un terme par section, une ligne par locale
sources_de_verite: [le catalogue de langue du projet (ce qui est réellement servi), les sondes de visibilité citées dans la colonne « preuve »]
authentification: aucune
verifie_le: 2026-08-26
---

# Glossaire — `<projet>`

## Pourquoi ce fichier existe, et ce qu'il a coûté de ne pas l'avoir

**Le fait, mesuré sur un produit du parc (TF-0639 à TF-0643, lots des 25 et 26/08/2026).** La
connaissance terminologique d'un projet multilingue ne vivait **nulle part** : elle naissait dans une
conversation et mourait avec elle. Aucun fichier ne portait, par langue, le terme retenu, les termes
proscrits et le motif. Conséquence directe et mesurée : la session suivante réécrivait le mot, et
**aucun contrôle ne pouvait le refuser** — un contrôle ne peut pas juger un choix qui n'est écrit
nulle part.

**Quatre défauts trouvés en une heure de balayage systématique**, là où un glossaire constitué *par
accident* n'en portait qu'un seul :

- un `title` et un `H1` allemands disant « Pool » quand le catalogue dit « Hallenbad » **29 fois** ;
- l'anglais employant « deposit » pour la **caution** ET pour l'**acompte** — deux obligations
  contractuelles différentes sous un seul mot ;
- « gite » traité comme le mot français dans les six langues étrangères, alors qu'en italien c'est
  un **homographe au sens opposé** (pluriel de *gita*, une excursion) ;
- « 8 gîtes » annoncé dans les sept langues quand la donnée en déclare **5**.

**Et le glossaire lui-même a fait autorité à tort.** Le lendemain de sa livraison, **3 entrées sur 7**
portaient un terme retenu faux, plus une proscription fausse. Elles portaient TOUTES les marques de
la fiabilité : une date, un motif rédigé, deux sources citées. *Un glossaire non vérifié est plus
dangereux qu'une absence de glossaire, parce qu'il fait autorité et qu'on cesse de chercher.*

## La forme, et ce que chaque champ empêche

Un terme = une section `##`. Sous elle, **deux champs de tête** puis **un tableau, une ligne par
locale**. Le juge est `oracles\oracle-glossaire.mjs` (G1–G6) : il tient la FORME opposable, jamais la
justesse — *un oracle peut dire que le champ manque, jamais qu'il est juste.*

- **`categorie`** — jeu fermé : `visibilite` ou `contractuel`. Les deux n'ont pas la même **exigence
  de preuve**. Un terme de *visibilité* se prouve par une source externe — ce que les gens tapent
  réellement — et une erreur y coûte du trafic non qualifié. Un terme *contractuel* se prouve par
  l'exactitude lexicale et la cohérence interlangue, et une erreur y coûte un litige sur ce qui est
  dû. Les confondre fait **sur-chercher les évidences et sous-chercher les termes à trafic**.
- **`pivot`** — le concept dans la langue de travail du projet. Sans lui, deux sections peuvent
  décrire le même concept sans que rien ne le dise.
- **`retenu`** — le mot qui est servi dans cette locale. Jamais vide.
- **`proscrits`** — ce qui ne doit PAS être écrit, et pourquoi. **Le mot proscrit s'écrit entre
  accents graves**, sa glose non : c'est ce qui permet de le distinguer de l'explication, laquelle
  nomme légitimement le terme retenu (« `Pool` — employé dans un `title` quand le catalogue dit
  Hallenbad 29 fois »). **Déclarer `aucun` est gratuit et
  suffit** : l'omission ne vaut pas décision, mais l'aveu se date et s'oppose.
- **`portee`** — *un mot peut être juste ICI et ambigu LÀ.* « deposit » est l'usage anglais correct
  pour la caution, et ambigu dès que la page parle aussi de l'acompte. **`partout` est gratuit et
  suffit.**
- **`preuve`** — les sources, séparées par ` · `. Pour un terme de **visibilité**, au moins une
  doit être **rejouable** : la commande s'écrit entre accents graves. *Une preuve nommée et datée
  qu'aucun script ne reproduit vieillit en silence* — mesuré, une sonde réécrite à la main a révélé
  que sa requête témoin était polluée par un homonyme, le mécanisme même qui avait produit une
  proscription fausse. Même doctrine que R-49 du socle. Pour un terme de visibilité, il en faut **au
  moins deux, de nature différente** : une sonde unique porte un biais que la donnée ne montre pas.
  Mesuré : une complétion de recherche interrogée langue par langue a désigné « gite » comme le
  terme le plus suggéré dans six langues — le paramètre de langue fixait l'**interface**, pas le
  pays du chercheur, et le score le plus élevé du test mesurait l'**inverse** de ce qu'on cherchait.
- **`verifie_le`** — la date de la dernière vérification de CETTE ligne, `AAAA-MM-JJ`. C'est le seul
  champ qui distingue une entrée éprouvée d'une entrée plausible.
- **`genre`** *(colonne OPTIONNELLE, TF-0660)* — le genre grammatical du terme retenu dans CETTE
  langue : `m`, `f`, `n`, ou `invariable`. Une ligne sans cette colonne reste parfaitement valide ;
  ce qui est refusé, c'est une valeur écrite au hasard. **Ce champ n'est pas décoratif : il est le
  seul point fixe qui rende une classe de fautes mesurable.**

  *Le fait qui l'exige.* Onze fautes d'accord — cinq en espagnol, cinq en portugais, un calque —
  sont parties EN PRODUCTION derrière une CI verte et six contrôleurs au vert. Le run avait
  substitué le terme d'hébergement : `gîte` (m.) devient `casa rural` (f.) en espagnol,
  `casa de férias` (f.) en portugais. Chaque article, adjectif et participe s'y rapportant devait
  suivre. Les accords **adjacents** au nom ont été traités par la passe de substitution ; ceux qui
  en étaient **séparés de plusieurs mots** ont survécu : « confortables y PRÁCTICOS », « NINGÚN
  casa rural disponible », « 1 OTRO casa rural … ya está RESERVADO ».

  *Pourquoi aucun contrôleur ne pouvait le voir.* Ils comparent des arborescences de clés,
  cherchent la présence d'un terme, mesurent l'écart au français, comptent des caractères. **Aucun
  ne lit une phrase.** Une langue peut être structurellement conforme, terminologiquement exacte,
  dimensionnée pour la SERP — et fautive.

## Exemple — trois termes, six lignes, tous venus de défauts réellement mesurés

## logement de vacances

- **categorie** : visibilite
- **pivot** : gîte

| locale | retenu | proscrits | portee | preuve | verifie_le | genre |
|---|---|---|---|---|---|---|
| fr | gîte | aucun | partout | catalogue de langue servi · complétions, `curl -s 'https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=FR&q=gite'` | 2026-08-26 | m |
| en | gîte | aucun | partout | article dédié en anglais dans une encyclopédie interlangue · `curl -s 'https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=GB&q=gite'` | 2026-08-26 | invariable |
| it | casa vacanze | `gite` — HOMOGRAPHE au sens opposé : pluriel de *gita*, une excursion | partout | `curl -s 'https://suggestqueries.google.com/complete/search?client=firefox&hl=it&gl=IT&q=gite'` (rend « gite organizzate », « gite in giornata », « gite in barca ») · absence d'article interlangue équivalent | 2026-08-26 | f |

## caution

- **categorie** : contractuel
- **pivot** : caution

| locale | retenu | proscrits | portee | preuve | verifie_le | genre |
|---|---|---|---|---|---|---|
| fr | caution | `acompte` — désigne une autre obligation | partout | catalogue de langue servi | 2026-08-26 | f |
| en | security deposit | `deposit` seul — AMBIGU dès que la page parle aussi de l'acompte | ambigu sur toute page portant les deux notions | catalogue de langue servi · relevé des pages où les deux notions coexistent | 2026-08-26 | invariable |

## piscine couverte

- **categorie** : contractuel
- **pivot** : piscine couverte

| locale | retenu | proscrits | portee | preuve | verifie_le | genre |
|---|---|---|---|---|---|---|
| de | Hallenbad | `Pool` — employé dans un `title` et un `H1` quand le catalogue dit Hallenbad 29 fois | partout | comptage sur le catalogue de langue servi (29 occurrences) | 2026-08-26 | n |

## CE FORMAT EST UN CONTRAT, et il est lu par DEUX analyseurs

Depuis le 26/08/2026, ce fichier n'est plus seulement un modele : sa STRUCTURE est lue par deux
programmes, dans deux langages.

- `oracles\oracle-glossaire.mjs` (pilot, JavaScript) — juge la forme d'un glossaire de projet ;
- `forge_tests\glossaire.py` (forge-tests, Python) — y lit le terme retenu par locale pour
  confronter les nombres servis a la donnee du produit (TF-0644, decision humaine voie (b)).

**Deux analyseurs d'un meme format, c'est la classe de defaut qui a coute dix listes d'exclusion
divergentes.** Le risque a ete assume en connaissance de cause, et la contrepartie est **cablee** :
`tests\test_tf_0644_glossaire.py` chez forge-tests fait lire CE FICHIER par l'analyseur Python et
verifie qu'il y retrouve ce que l'autre y compte — **3 termes, 6 lignes**.

*Consequence pratique, et elle vaut avertissement :* **modifier la structure de ce gabarit fait
rougir une recette de forge-tests.** C'est voulu. Mesure faite le 26/08 : un quatrieme terme
ajoute ici rend « 4 terme(s) lus au lieu de 3 — le format a derive d'un cote », et sa suppression
rend la recette verte. Ajouter un TERME au glossaire d'un PROJET ne change rien ; c'est ce
gabarit-ci, fichier de reference, qui est compte.

## Le genre : ce qui est MESURABLE, et ce qui a ete refuse apres mesure

La colonne `genre` ne sert pas a decorer une ligne : elle donne a un controle le point fixe qui
lui manquait. Mais **tout ce qu'on aurait voulu en tirer n'est pas tirable**, et la frontiere a
ete etablie par la mesure, pas par l'intuition. Corpus : les catalogues espagnol et portugais
d'un produit du parc, 740 chaines par langue, dont 48 (es) et 76 (pt) portent le terme feminin.

**LA REGLE LARGE A ETE REFUSEE.** « Dans une chaine portant un terme feminin, tout mot termine
en `-o`/`-os` est suspect » accuse **268 tokens**, et se trompe a peu pres partout : `minutos`,
`seminarios`, `descuentos`, `invierno`, `carro`, `amigos` sont des noms masculins parfaitement
legitimes. Un suffixe ne distingue pas `adaptados` — participe, faux — de `descuentos` — nom,
juste. **Meme verdict que N-35 et N-37 : un controle qui accuse a cote ne se publie pas.**

**CE QUI EST RETENU — le DETERMINANT, parce qu'il forme une classe FERMEE.** Determinants et
quantifiants sont quelques dizaines de mots enumerables. Un determinant a la forme masculine
**colle** devant un nom feminin est faux sans ambiguite : « NINGUN casa rural », « 1 OTRO casa
rural ». Mesure sur le corpus relu : **0 accusation** — le controle se tait quand il n'y a rien.

**CE QUI EST ECARTE — le PARTICIPE APRES COPULE, et le motif merite d'etre lu.** « estan
especialmente ADAPTADOS », « ya esta RESERVADO » se cherchent bien avec une copule suivie d'un
mot en `-o`/`-os`, et la copule est elle aussi une classe fermee. **Mais la copule ne nomme pas
son sujet.** Le corpus a exhibe le contre-exemple tout seul : « A Irene e o Samuel **sao**
verdadeiramente acolhedores e **simpaticos** » — masculin pluriel JUSTE, dans une chaine qui
parle par ailleurs du logement. Un controle qui ne sait pas de QUI on parle accuserait cette
phrase. Il n'est donc pas ecrit.

*Et la mesure elle-meme a failli mentir.* Une premiere passe rendait 4 accusations en portugais,
toutes fausses : la normalisation des accents avait ecrase `e` (copule) sur `e` (conjonction
« et »). **La sonde etait fausse sur le point exact qu'elle mesurait.** Accents retablis, le
compte tombe a 0. C'est la meme lecon qu'une fixture doit etre fausse sur le point qu'elle teste
et JUSTE sur tout le reste.

**LA RELECTURE HUMAINE N'EST PAS REMPLACEE, et le gabarit ne pretend pas l'inverse.** Le controle
attrape la classe qui est passee ici ; il ne lit pas une phrase. Une substitution qui change le
genre reste une operation qui merite une relecture declaree.

## Ce que ce gabarit n'apporte PAS, et qui se traite ailleurs

- **Le remplissage.** Un glossaire se remplit par **balayage systématique du vocabulaire servi**,
  jamais au fil des défauts rencontrés : un glossaire constitué par accident porte un terme là où
  une passe d'une heure en a fait entrer huit.
- **Le moment.** *Toute production de traduction part du glossaire* — un terme métier ne se traduit
  pas au fil de l'eau. Un contrôle qui n'attrape le mot qu'après coup fait corriger 99 occurrences
  là où ouvrir le glossaire au départ n'en aurait coûté aucune.
- **La justesse des entrées.** Aucun oracle ne peut la dire. C'est `verifie_le` qui la date, et une
  relecture humaine qui la tranche.
