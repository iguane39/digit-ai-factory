# Analyse L99 — « construire un skill et/ou une forge pour l'état de l'art du marché »

Analyse en 8 couches du prompt soumis le 30/08/2026. Ancre fixe : le texte d'origine, relu à
chaque chapitre.

> **Prompt d'origine.** « Il pourrait être pertinent de construire un skill intégré à la factory,
> et/ou une forge spécifique pour l'état de l'art du marché sur une activité, un service, une
> spécialisation, une étude... adaptée au contexte et à la stratégie que l'on souhaite mettre en
> oeuvre sur un projet. En reprenant par exemple le cas du projet Produit-02.com sur la
> mesure des performances des recherches et mots-clés Google dans les différentes langues. »

---

## Chapitre 1 — OODA · Cadrage stratégique et étalon noté

### Observe

Le texte ne contient **aucun verbe à l'impératif**. Sa proposition principale est modalisée :
« il **pourrait être** pertinent de construire ». Ce n'est pas une commande, c'est une hypothèse
soumise. Quatre éléments explicites :

1. **Deux artefacts candidats, non tranchés** : « un skill intégré à la factory, **et/ou** une
   forge spécifique ». La conjonction laisse ouvertes trois lectures — l'un, l'autre, les deux.
2. **Un objet** : « l'état de l'art du marché ».
3. **Un périmètre ouvert par points de suspension** : « sur une activité, un service, une
   spécialisation, une étude**...** ». L'ellipse signale que la liste n'est pas close.
4. **Une clause de conditionnement** : « adaptée au contexte et à la stratégie que l'on souhaite
   mettre en œuvre sur un projet ».
5. **Un cas d'illustration** : « le cas du projet Produit-02.com sur la mesure des
   performances des recherches et mots-clés Google dans les différentes langues ».

Ce qui n'y est pas : aucun livrable nommé, aucune audience, aucun format, aucune source de
données, aucune cadence, aucun critère de réussite.

### Orient

L'auteur pilote un écosystème où « skill » et « forge » ne sont pas deux mots pour la même chose :
un skill est un mode opératoire chargé dans une session ; une forge est un dépôt entier, avec ses
oracles, sa recette, sa fiche d'audit et sa place au ledger. L'écart de coût entre les deux est
d'au moins un ordre de grandeur. Le destinataire est une session qui, faute d'instruction
contraire, **construira** — c'est son biais par défaut.

L'objectif profond n'est pas de posséder un outil. C'est de pouvoir répondre, à la demande et de
façon défendable, à une question de marché qui conditionne une stratégie produit — et de ne pas
refaire l'enquête à zéro au projet suivant. Le cas cité le montre : ce qui est visé n'est pas
« un état de l'art » en général, mais « quels mots-clés portent quelle performance, dans quelle
langue, pour ce site-là ».

### Decide — trois stratégies

- **(S1) Traiter comme une demande de construction.** Rapide, et c'est ce que fera une session
  laissée à elle-même. Risque : construire à côté de ce qui existe.
- **(S2) Traiter comme une idée à clarifier** avant toute construction. Coûte un tour, produit un
  cadrage. C'est ce que le skill `clarifie-une-idee` fait, et le prompt en porte tous les signes
  (« il pourrait être pertinent »).
- **(S3) Traiter comme une question de ROUTAGE** : qu'est-ce qui, dans l'écosystème, couvre déjà
  tout ou partie de ce besoin, et que reste-t-il à construire ? Coûte un relevé, et c'est le seul
  qui protège des deux erreurs symétriques — construire un doublon, ou renoncer à tort.

### Act

**S3 puis S2.** Le Chapitre 4 montre pourquoi : trois pièces de l'écosystème recouvrent déjà une
partie de la demande, et l'une d'elles a déjà tourné sur l'exemple cité. Commencer par
construire reviendrait à créer une seconde vérité sur le même objet.

### Étalon — à quoi ressemblerait le prompt idéal

Il nommerait : **le livrable** (une étude d'opportunité, pas un outil) · **la décision qu'il
sert** · **le critère de choix** entre skill et forge, plutôt que le choix lui-même ·
**l'inventaire de l'existant** comme première étape obligatoire · **les sources de données
autorisées**, en tenant compte de l'interdiction des interfaces tierces payantes ·
**la cadence de péremption** d'un état de l'art · **les critères d'acceptation** du livrable.

### Rubrique notée — prompt d'origine

Le tableau ci-dessous chiffre l'écart entre le prompt soumis et l'étalon qui vient d'être posé, dimension par dimension. C'est ce chiffre, et non un adjectif, qui sert de référence au Chapitre 8 pour mesurer le gain de la réécriture.

| Dimension | Pts | Note | Justification |
|---|---|---|---|
| Clarté de l'intention | 20 | **9** | Le besoin est lisible ; l'action demandée ne l'est pas — construire, étudier, ou décider sont trois exécutions incompatibles |
| Spécification | 20 | **3** | Aucun format, aucune longueur, aucune audience, aucun livrable nommé |
| Garde-fous & contraintes | 15 | **1** | Aucun. Et la contrainte de gouvernance la plus contraignante de l'écosystème — pas d'interface tierce payante — est frontalement concernée |
| Ancrage / contexte | 15 | **6** | Un cas concret est donné, ce qui est précieux ; mais aucun renvoi vers l'existant, alors que trois pièces le recouvrent |
| Vérifiabilité de la sortie | 15 | **0** | Rien ne permet de dire si le résultat est bon |
| Robustesse | 15 | **4** | « et/ou » plus points de suspension : le périmètre est laissé à l'interprétation |
| **Total** | **100** | **23** | Un bloquant est présent — le plafond de 40 s'applique, mais le score le respecte déjà |

---

## Chapitre 2 — Chainlogic · Collisions entre instructions

Pas de chaîne logique interne : le prompt est une proposition unique assortie d'un exemple. À la
place, **trois collisions** entre ses propres termes.

- **« état de l'art du marché » contre « adaptée au contexte et à la stratégie »**. Un état de
  l'art est par nature générique et réutilisable ; une adaptation au contexte est par nature
  spécifique et jetable. Les deux ne vivent pas dans le même artefact. Non tranché, cela produit
  soit un document générique que personne n'utilise, soit une étude sur mesure non réutilisable
  — c'est-à-dire l'échec dans les deux sens.
- **« skill » contre « forge »**. Un skill se charge dans une session et ne possède rien ; une
  forge possède un dépôt, des oracles et une recette. Le « et/ou » ne dit pas seulement « je n'ai
  pas choisi » : il dit que le critère de choix n'a pas été formulé.
- **« une activité, un service, une spécialisation, une étude... »**. Les trois premiers sont des
  OBJETS d'analyse ; le quatrième est un LIVRABLE. Ranger « une étude » dans la même liste que
  « une activité » confond ce qu'on analyse et ce qu'on produit.

---

## Chapitre 3 — Blindspots · Inventaire maître

Ce chapitre est la liste de référence unique des trous du prompt : tout défaut trouvé ici, ou remonté depuis une couche aval, y figure avec sa sévérité. Trois défauts y sont bloquants, c'est-à-dire qu'ils rendent le résultat inexploitable et non seulement dégradé ; ils sont suivis jusqu'à leur clôture au Chapitre 8.

| # | Défaut | Sévérité |
|---|---|---|
| 1 | **Aucun verbe d'action.** Le prompt ne dit pas s'il faut construire, instruire l'opportunité, ou décider. Une session tranchera à sa place, et construira | **bloquant** |
| 2 | **Une forge de ce domaine existe déjà** et le prompt l'ignore (remonté du Ch4) | **bloquant** |
| 3 | **La contrainte « aucune interface tierce payante » est frontalement concernée** et jamais nommée (remonté du Ch4) | **bloquant** |
| 4 | **Le critère de choix skill/forge n'est pas formulé** — ni le coût, ni la fréquence d'usage, ni la possession de données ne sont invoqués | majeur |
| 5 | **Périmètre ouvert par points de suspension** : rien ne borne ce que l'artefact devra couvrir | majeur |
| 6 | **Aucun critère de réussite** : ni pour l'artefact, ni pour l'état de l'art qu'il produirait | majeur |
| 7 | **Aucune cadence de péremption.** Un état de l'art est une donnée volatile ; la loi n° 4 de l'écosystème exige qu'une telle donnée vive datée, sourcée et éditable | majeur |
| 8 | **L'exemple est traité comme illustration, jamais comme recette.** Il est pourtant le seul cas réel disponible pour éprouver l'artefact | majeur |
| 9 | **Deux sources de données distinctes sont confondues** sous « performances des recherches et mots-clés » (remonté du Ch6) | majeur |
| 10 | **Le nom du produit est écrit en clair** alors que la chaîne d'ingestion de l'écosystème substitue les noms de produits avant écriture au registre | mineur |
| 11 | **Aucune audience nommée** pour le livrable — dirigeant, exploitant, ou agent aval ne lisent pas la même chose | mineur |

---

## Chapitre 4 — Factcheck · Audit des prémisses

Couche déclenchée : le prompt nomme des entités, propose des constructions et implique un état du
monde vérifiable.

| Affirmation du prompt | Verdict | Mesure |
|---|---|---|
| « construire un skill intégré à la factory » est possible | **vrai** | Le mécanisme existe : `write-a-skill` pour la construction, `ameliore-un-skill` pour l'audit, et 21 fiches de skill sont recensées au parc |
| « une forge spécifique pour l'état de l'art du marché » serait à créer | **faux** | `digit-ai-forge-seo-geo` **existe**, à jour, et porte un référentiel complet : `grille-noeuds.md`, `methode.md`, `scoring.md`, `sources-donnees.md`, `snapshot.schema.json`, plus des prompts de phase A et B. Le noyau la déclare : « **forge-seo-geo** (post-MEP, SEO+GEO) », mobilisable sur mandat humain. Sa fiche d'audit porte 12/12 contrôles et une mission réelle en 6ᵉ itération |
| un dispositif d'« état de l'art » resterait à inventer | **faux** | `veille\MODE-VEILLE.md` est un mode opératoire complet et réutilisable : ingestion honnête, **vérification de chaque affirmation par recherche web réelle**, marquage `réel / promotionnel / non confirmé`, fiabilité chiffrée de 0 à 1, routage par forge, historisation datée et rapport charté. Et `forge-observability` est déclarée au noyau comme la forge de « veille entre runs » |
| le cas cité serait un terrain neuf | **faux** | Le skill `last30days` a **déjà été exécuté sur ce sujet** : dernière exécution enregistrée « Produit-02 Vessey », il y a 27 jours, 25 résultats, sur 8 sources actives |
| « la mesure des performances des recherches et mots-clés Google » est réalisable | **invérifiable ici** | Elle suppose une source de données. Deux voies, de statuts opposés : la console de recherche du moteur, **gratuite et propriété du site**, donne impressions, clics, taux de clic et position moyenne par requête et par pays ; un fournisseur de positions tiers, **payant**, est interdit par les garde-fous du noyau (« aucune API tierce payante hors Claude »). Vérification à exiger avant tout engagement : le site dispose-t-il d'un accès à sa console de recherche, et l'export est-il autorisé ? |

**Remontées au Chapitre 3** : les trois « faux » deviennent le bloquant #2 ; l'invérifiable
devient le bloquant #3, avec sa vérification à exiger.

---

## Chapitre 5 — Premortem · Cinq causes d'échec, par probabilité décroissante

1. **On construit un doublon de la forge existante.** *Mécanisme* : le prompt dit « construire »,
   la session obéit, personne ne relève l'existant. *Conséquence* : deux référentiels sur le même
   objet, donc deux vérités — le défaut que l'écosystème a déjà nommé à propos des empreintes.
   *Mitigation* : rendre l'inventaire de l'existant **obligatoire et premier**, avec verdict écrit
   avant toute décision de construire. Escalade du bloquant #2.
2. **Le livrable est un état de l'art figé, périmé en trois semaines.** *Mécanisme* : rien n'exige
   de date, de source par affirmation, ni de cadence de rafraîchissement. *Conséquence* : un
   document qu'on cite six mois plus tard comme s'il était vrai. *Mitigation* : imposer date de
   mesure, source par affirmation, et date de péremption déclarée. Escalade du majeur #7.
3. **L'exécution bute sur la source de données.** *Mécanisme* : la mesure de positions exige un
   accès qu'on découvre absent au moment de mesurer. *Conséquence* : un livrable qui décrit une
   méthode sans jamais produire un chiffre. *Mitigation* : faire de l'accès aux données une
   **précondition vérifiée**, pas une hypothèse. Escalade du bloquant #3.
4. **L'artefact produit est trop générique pour servir un projet.** *Mécanisme* : le périmètre
   ouvert par points de suspension pousse à couvrir tous les cas, donc aucun. *Conséquence* : un
   gabarit que personne n'instancie. *Mitigation* : borner le premier périmètre au cas cité, et
   n'élargir qu'après une seconde instance réussie. Escalade du majeur #5.
5. **Le skill est construit mais ne se déclenche jamais.** *Mécanisme* : un skill sans déclencheur
   nommé, ou avec un réglage qui l'empêche, reste inerte. *Conséquence* : l'outil existe et personne
   ne l'appelle. *Mitigation* : nommer les déclencheurs et **vérifier l'invocation réelle** avant
   de considérer l'artefact livré. **Défaut neuf, remonté au Ch3 en majeur** — et ce n'est pas
   théorique : trois skills du lexique de ce même écosystème étaient inertes depuis sept jours,
   constat mesuré le jour même de cette analyse.

---

## Chapitre 6 — Wargame · Stress-test adversarial

### L'utilisateur exigeant

« Vous me rendez un état de l'art : où est la date de chaque mesure ? Quelle source pour chaque
affirmation ? Qu'est-ce qui est mesuré et qu'est-ce qui est estimé ? » Le prompt ne demande rien
de tout cela, donc rien de tout cela n'arrivera. Un état de l'art sans source par affirmation
n'est pas un état de l'art, c'est une opinion documentée.

### L'expert du domaine

**Le prompt confond deux choses que le métier sépare.** « Performances des recherches » désigne
les données **propriétaires** du site — impressions, clics, taux de clic, position moyenne — que
seule la console du moteur donne, et qui n'existent que pour les requêtes où le site apparaît
déjà. « Mots-clés » désigne des données **de marché** — volumes, concurrence, intention — qui
existent indépendamment du site et proviennent d'autres fournisseurs. Deux sources, deux méthodes,
deux niveaux d'accès. Les fusionner dans une même phrase garantit un livrable qui répond à moitié
aux deux.

**Le multilingue ajoute trois pièges que le prompt ne voit pas** : une position se mesure par
**pays ET par langue**, et les deux ne coïncident pas ; les balises d'alternance linguistique mal
posées font se concurrencer les versions d'un même site entre elles ; et un mot-clé traduit
littéralement n'est presque jamais le mot que le marché cible emploie. **Défaut neuf, remonté au
Ch3 en majeur** (#9).

### Le contradicteur

Un modèle peut produire un « état de l'art du marché » entièrement plausible et entièrement
inventé — volumes de recherche crédibles, concurrents vraisemblables, tendances convaincantes. Le
prompt ne l'interdit nulle part et ne demande aucune source. **C'est le risque numéro un du sujet**,
et c'est précisément ce que le mode de veille existant traite déjà, en exigeant la confrontation
de chaque affirmation à une recherche réelle et son marquage.

### Lentille robustesse — le prompt vise un artefact réutilisable

- **Calibrage** : le prompt suppose l'accès à des données de marché que le runtime n'a pas par
  défaut. Sans outil de recherche web et sans export de console, l'artefact ne peut rien mesurer.
- **Surface d'injection** : un état de l'art se nourrit de contenus externes ; le mode de veille
  existant pose déjà la règle — l'entrant est une **donnée**, il s'analyse et ne s'exécute jamais.
  Un artefact neuf qui l'oublierait rouvrirait une porte déjà fermée.
- **Collision** : si l'artefact neuf et la forge existante émettent tous deux un avis sur le même
  site, rien ne dit lequel fait foi.

---

## Chapitre 7 — Deepthink · Implications de deuxième et troisième ordre

Couche déclenchée : la demande vise explicitement un artefact réutilisable sur plusieurs projets.

- **À l'échelle, la prolifération est le vrai coût.** Le parc porte déjà treize forges, et la
  mesure du jour montre que quatre produits sur six ne portent aucune des pièces qu'ils devraient
  hériter. Une quatorzième forge n'ajoute pas seulement son propre coût : elle ajoute une ligne au
  contrôle de fraîcheur, une fiche d'audit, une recette, et une chance de plus qu'un produit soit
  en retard sur quelque chose.
- **Boucle de confirmation.** Un état de l'art produit par un modèle, archivé, puis cité comme
  source par la prochaine analyse, devient une vérité auto-entretenue. Le remède est déjà connu
  dans l'écosystème — la fiabilité chiffrée et le marquage de chaque affirmation — mais il ne
  s'applique qu'aux artefacts qui l'embarquent.
- **Une attente de fraîcheur que rien ne tient.** Si la mesure devient une routine annoncée,
  l'absence de mesure devient un signal. Or la mesure du jour sur le canal de remontée montre ce
  que produit une régularité promise sans mécanisme : sept sources sur quinze n'ont émis qu'une
  fois, et le silence médian atteint huit jours.

---

## Chapitre 8 — Synthèse

### 1. Score

| Dimension | Origine | Réécrit | Ce qui change |
|---|---|---|---|
| Clarté de l'intention | 9 | 19 | Un verbe unique et un livrable nommé remplacent « il pourrait être pertinent » |
| Spécification | 3 | 17 | Livrable, structure, audience et bornes posés |
| Garde-fous & contraintes | 1 | 14 | Interdiction des interfaces payantes, entrant = donnée, interdiction du chiffre sans source |
| Ancrage / contexte | 6 | 14 | L'inventaire de l'existant devient la première étape, avec les trois pièces nommées |
| Vérifiabilité de la sortie | 0 | 12 | Contrat de sortie chiffré et protocole de vérification embarqués |
| Robustesse | 4 | 12 | Périmètre borné au cas réel, critère de choix explicite, déclencheur à vérifier |
| **Total** | **23** | **88** | |

### 2. Diagnostic en trois lignes

L'intuition est juste et le cas d'illustration est excellent — c'est ce qui sauve ce prompt. Mais
il demande de **construire** avant d'avoir regardé ce qui existe, alors que trois pièces de
l'écosystème recouvrent déjà une partie du besoin et que l'une d'elles a tourné sur l'exemple
cité il y a vingt-sept jours. Et il ne dit rien de la seule contrainte qui peut tuer le projet à
l'exécution : la source de données.

### 3. Prompt réécrit

> **Instruis l'opportunité d'un dispositif d'état de l'art de marché pour l'écosystème, et rends
> une étude qui tranche. N'écris aucun code et ne crée aucun artefact dans ce tour.**
>
> **Étape 1 — Inventaire de l'existant, obligatoire et première.** Relève ce que l'écosystème
> couvre déjà du besoin, et pour chaque pièce dis ce qu'elle fait, ce qu'elle ne fait pas, et son
> état de fraîcheur. Trois pièces au moins sont à examiner nommément : la forge SEO/GEO et son
> référentiel, le mode opératoire de veille du pilot, et le skill de recherche multi-sources sur
> trente jours — dont tu vérifieras la dernière exécution. Conclus par un verdict écrit : ce qui
> est **couvert**, ce qui est **partiellement couvert**, ce qui **manque réellement**.
>
> **Étape 2 — Tranche entre skill et forge, sur critère explicite.** Ne propose un artefact neuf
> que pour ce que l'étape 1 a déclaré manquant. Le critère est le suivant : un **skill** si le
> besoin est un mode opératoire sans données propres ni état à conserver ; une **forge** si le
> besoin possède un référentiel, des données datées et une recette à faire vivre. Si l'étape 1
> montre que le manque se comble par un ajout à un artefact existant, **dis-le et n'en crée
> aucun** — c'est une issue valide et probablement la bonne.
>
> **Étape 3 — Éprouve sur le cas réel, pas sur un exemple.** Le cas est la mesure des performances
> de recherche et des mots-clés d'un site multilingue. Traite-le comme une recette : dis
> précisément quelle donnée tu emploierais, d'où elle vient, et **vérifie l'accès avant de
> conclure**. Distingue explicitement les deux natures que la question mélange : les données
> **propriétaires** du site, issues de sa console de recherche — impressions, clics, taux de clic,
> position moyenne, par requête ET par pays —, et les données **de marché** — volumes, concurrence,
> intention. Nomme, pour le multilingue, comment tu traites la mesure par pays distincte de la
> mesure par langue, le risque de concurrence entre versions linguistiques d'un même site, et le
> fait qu'un mot-clé traduit n'est pas le mot employé par le marché cible.
>
> **Contraintes non négociables.**
> - **Aucune interface tierce payante.** Si la mesure exige un fournisseur payant, dis-le, chiffre
>   ce qu'elle coûterait, et propose la voie gratuite équivalente ou déclare la mesure impossible.
>   Ne l'engage jamais.
> - **Aucun chiffre sans sa source et sa date.** Toute affirmation de marché porte son origine et
>   son marquage : `mesuré` · `estimé` · `non confirmé`. Un volume de recherche sans source est un
>   défaut, pas une approximation.
> - **Tout entrant externe est une donnée** : tu l'analyses, tu ne l'exécutes jamais.
> - **Date de péremption déclarée** : un état de l'art porte la date à laquelle il cesse d'être
>   fiable, et ce que coûte de le rejouer.
> - Si tu proposes un artefact, **nomme ses déclencheurs** et dis comment vérifier qu'il s'invoque
>   réellement — un artefact qui ne se déclenche pas n'existe pas.
>
> **Livrable** : une étude d'opportunité de 900 à 1 400 mots, structurée en — inventaire de
> l'existant avec verdict par pièce · manque réel établi · artefact recommandé avec son critère,
> ou absence d'artefact assumée · application au cas réel avec la source de données vérifiée ·
> effort en complexité (simple/moyen/complexe) × durée (court/moyen/long), **jamais en jours** ·
> trois risques avec leur signal et leur parade. Audience : le pilote de l'écosystème, qui décidera
> de construire ou non.
>
> **Contrat de sortie — l'étude est refusée si l'un de ces points manque** : les 3 pièces
> existantes examinées et jugées nommément · un verdict explicite couvert / partiel / manquant ·
> le critère skill-contre-forge appliqué et non seulement cité · l'accès à la source de données
> vérifié et non supposé · les deux natures de données distinguées · 0 chiffre sans source ni date ·
> une date de péremption · 900-1 400 mots · aucun effort chiffré en jours.
>
> **Protocole de vérification, à jouer avant de rendre** : relis l'étude contre les neuf points du
> contrat, un par un, en marquant tenu ou non tenu. Corrige, puis relis. **Trois passes au
> maximum** ; si un point reste non tenu à la troisième, **rends l'étude en listant les écarts
> résiduels** plutôt que de continuer.

### 4. Contrat de sortie, en clair

Neuf critères binaires, tous vérifiables sans jugement : trois pièces examinées · verdict
tripartite explicite · critère de choix appliqué · accès aux données vérifié · deux natures de
données distinguées · zéro chiffre non sourcé · date de péremption présente · longueur entre 900 et
1 400 mots · zéro effort exprimé en jours.

### 5. Changelog tracé

| Modification | Défaut clôturé |
|---|---|
| Verbe unique « instruis l'opportunité », et interdiction de créer dans ce tour | bloquant #1 · cause d'échec #1 |
| Étape 1 d'inventaire, obligatoire et première, avec les 3 pièces nommées | bloquant #2 · Ch4 · cause d'échec #1 |
| Contrainte d'interface payante, avec issue alternative et déclaration d'impossibilité | bloquant #3 · Ch4 · cause d'échec #3 |
| Critère explicite skill-contre-forge, et issue « aucun artefact » rendue valide | majeur #4 · Ch2 |
| Périmètre borné au cas réel | majeur #5 · cause d'échec #4 |
| Contrat de sortie en 9 critères binaires | majeur #6 |
| Date de péremption déclarée | majeur #7 · cause d'échec #2 · Ch7 |
| Le cas devient une recette, pas une illustration | majeur #8 |
| Distinction des deux natures de données, et trois pièges du multilingue nommés | majeur #9 · Ch6 |
| Obligation de nommer les déclencheurs et de vérifier l'invocation | majeur remonté du Ch5 #5 |
| Audience nommée, longueur bornée, structure imposée | mineur #11 |
| Aucun chiffre sans source ni date | Ch6 contradicteur |

### 5 bis. Écarts à la lettre

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « construire un skill … et/ou une forge » | **instruire l'opportunité** avant de construire, et rendre valide l'issue « on ne construit rien » | Trois pièces existantes recouvrent une partie du besoin, dont une forge dédiée au domaine. Construire d'abord garantissait le doublon. **C'est l'écart le plus important : il change le verbe de votre demande, et il est soumis à votre validation** |
| « une activité, un service, une spécialisation, une étude... » | périmètre **borné au cas cité** pour la première instance, élargissement après une seconde réussie | Le périmètre ouvert produit un gabarit générique que personne n'instancie. L'ellipse de votre phrase est restreinte, et c'est une restriction assumée |
| « la mesure des performances des recherches et mots-clés Google » | deux natures de données **explicitement séparées** | Votre formulation les fusionne ; le métier les sépare, et elles n'ont ni la même source ni le même niveau d'accès |
| « Produit-02.com » | le site désigné sans être nommé dans le prompt réécrit | La chaîne d'ingestion de l'écosystème substitue les noms de produits avant écriture au registre ; conserver le nom en clair dans un prompt réutilisable le ferait ressortir ailleurs. Écart mineur, signalé plutôt que tu |

### 6. Protocole de tests du livrable

**Type détecté** : document texte. **Oracle** : contrat chiffré — longueur, structure, présence et
absence d'éléments nommés, tous vérifiables sans jugement.

**Jeu d'essai minimal, trois cas dont deux limites** :
1. *Cas nominal* — le site multilingue cité, accès à la console de recherche disponible.
2. *Cas limite, données inaccessibles* — aucun accès à la console. L'étude doit **conclure quand
   même**, en déclarant la mesure impossible et en chiffrant ce que coûterait la voie payante,
   sans jamais l'engager.
3. *Cas limite, besoin déjà couvert* — l'inventaire montre que la forge existante fait tout. L'étude
   doit **recommander de ne rien construire**, et cette issue doit être aussi développée que
   l'autre. C'est le cas qui distingue une étude honnête d'une justification.

**Boucle bornée** : générer, tester contre les neuf critères, corriger. **Trois passes au
maximum**, arrêt sur critères binaires. Après trois passes en échec, livrer avec la liste des
écarts résiduels. Si le skill `la-boucle` est disponible à l'exécution, lui déléguer l'itération
plutôt que de la réimplémenter.
