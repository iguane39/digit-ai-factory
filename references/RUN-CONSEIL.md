# Run de conseil — quand le livrable est une trajectoire, pas un logiciel ni un seul document

Quatrième voie d'exécution (avec `ETAPES-RUN.md`, `RUN-VERSION.md` et `RUN-MANDAT.md`),
née du GO humain du 19/08/2026 sur l'étude
`output\03-etudes\20260819-etude-opportunite-forge-consulting.md` (verdict O1 : orchestrer
l'existant, jamais une forge dédiée). Une mission de conseil reprend des besoins, des
problématiques d'exploitation (charge, performance, temps de réponse, coûts), des CDC,
des spécifications ou des architectures — et rend un diagnostic, des recommandations, un
lotissement planifié avec démarche de ROI, puis **passe la main aux forges** lot par lot.

Différence avec le run de mandat : le mandat livre UN document et s'arrête ; le conseil
livre une **trajectoire multi-lots** dont chaque lot devient l'entrant d'un run de build.

## Ce que le socle exige quand même (invariant, jamais négocié)

Identique au run de mandat (`RUN-MANDAT.md` §« Ce que le socle exige ») : socle du run
complet, ledger dès l'ouverture (`run_open`, `invocation` par service mobilisé,
`oracles_verdict`, `retour`, `run_close`), fraîcheur (`--ff-only` + `bootstrap --pull`),
routage et mesure (CONTRAT-INTERFACE §4/§4 bis). S'y ajoute : **lecture seule absolue
sur le SI étudié** — un run de conseil ne modifie jamais le système qu'il instruit.

**Deux règles de méthode, nées de deux faux négatifs payés le même jour** (TF-0596, 24/08/2026,
retour Produit-10). Elles ne sont pas des précautions de rédaction : chacune a produit une réponse
FAUSSE rendue avec l'apparence de la rigueur, et l'une des deux a fondé une demande d'évolution
de schéma qu'il a fallu suspendre.

- **Le *où* se déclare AVANT le *quoi* — étape C0.** Sur quel environnement on travaille, comment
  il s'identifie, et comment un chiffre lui sera attribuable. La méthode résolvait les noms de
  catalogue, de schéma et de table dès son premier geste, et ne demandait **jamais** sur quelle
  instance. *Mesure* : plus de 60 mesures archivées en onze jours sans leur cible, sur un poste
  portant deux profils vers deux instances exposant **toutes deux** un catalogue du même nom — deux
  archives strictement indiscernables. Le « où » ne vit pas dans la donnée, il vit dans la
  CONNEXION : il se déclare, ou il est perdu, et aucune analyse a posteriori ne le retrouve. Il
  s'écrit à deux endroits, et les deux sont contrôlés : `docs\projet\COMPOSANTS-OPS.md` section
  « Environnements de données » (R-20, `oracle-conformite-projet`) et le `namespace` de chaque
  dataset d'un lineage (T7, `oracle-tracer` de forge-data).
- **Une recherche par NOM qui ne trouve rien établit que le NOM cherché n'existe pas — jamais que
  la CHOSE cherchée n'existe pas.** *Mesure* : « aucune table de transcodification » conclu après
  dix motifs de nom de table sur trois schémas, alors que la correspondance vivait dans un schéma
  au nom sans rapport, sur des **colonnes** hors d'atteinte des dix motifs ; et « aucun
  environnement D2 » répondu après avoir cherché un **catalogue** contenant `_d2`, alors que le
  nommage d'un environnement et celui de ses catalogues sont **indépendants**. Énumérer ses dix
  motifs ne répare rien : dix motifs de la même nature partagent le même angle mort. Toute
  conclusion d'absence énumère donc ce qui a été cherché **et** déclare la recherche complémentaire
  par **STRUCTURE** — des colonnes plutôt que des tables, un motif de valeurs plutôt qu'un motif de
  nom, une contrainte de clé plutôt qu'un libellé —, ou se borne explicitement au nom. Contrôle :
  `oracle-synthese` **S24**, joué par le hook de restitution à chaque fin de tour.

**Deux règles de plus, du même jour et de la même famille** (TF-0599 et TF-0600, objection humaine
du 24/08). Les deux précédentes disent *où* on regarde ; celles-ci disent *comment on lit ce qu'on
y trouve*.

- **Une cible absente porte TROIS états, jamais deux.** « Présente / retirée » est un verdict trop
  large d'un cran, et le cran manquant est celui qu'on ne peut pas deviner — il faut regarder
  ailleurs pour le voir : (1) **présente** ; (2) **absente du modèle** — aucun déploiement connu ne
  la porte, le retrait est justifié ; (3) **absente de CE déploiement** — un autre la porte, la
  cible **reste au périmètre**, sa structure se relève là où elle existe et le mapping se prépare
  contre elle. *Mesure* : une cible retirée parce que sa table manquait au déploiement visé, alors
  qu'un déploiement voisin la portait avec 12 colonnes et 236 lignes, son référentiel amont 48
  libellés en 12 langues, et la clé étrangère qui la référence renseignée sur **1 407 lignes sur
  24 136**. La preuve de recherche exigée par la méthode avait bien été fournie — deux requêtes,
  trois motifs, résultat nul : *la méthode a été appliquée correctement, c'est la méthode qui
  manquait d'un état.* **Et une vérification avant tout retrait** : *quelque chose référence-t-il
  encore l'objet absent ?* Si oui, le retrait masque une clé étrangère orpheline — un défaut du
  modèle déployé, qui est un **constat à livrer** et non un objet à effacer. Contrôle :
  `scripts\importer.mjs` de forge-data dénonce toute clé étrangère dont la cible manque au schéma.
- **Le commentaire d'une colonne est une source de vérité de premier ordre.** La méthode demandait
  de lire les commentaires pour *classer* les colonnes en technique ou métier et peupler une colonne
  « description » ; elle ne disait nulle part qu'un commentaire peut **nommer l'amont** d'une
  valeur, la **composition** d'une clé, la **cible** d'une clé étrangère, la **règle de dérivation**
  d'un champ — ni qu'il faut le chercher pour ça. *Mesure* : ce qui a tranché le sujet du 24/08
  n'est ni une jointure ni un décompte, c'est le commentaire porté par une colonne de code, qui
  déclarait de quel système ce code était repris ; il a établi d'un coup ce que **trois tours**
  d'analyse n'avaient pas su dire. Le balayage des commentaires est donc une étape de la lecture du
  modèle cible, avec ce qu'on y cherche écrit. Et son contrôle va avec, parce qu'un commentaire faux
  se lit avec l'autorité du schéma : **tout objet nommé dans un commentaire existe-t-il ?** Sur le
  cas réel, un commentaire de clé étrangère désignait une table sous un nom que le catalogue ne
  portait pas, après trois revues. Contrôle : `scripts\importer.mjs` de forge-data, qui rattache
  désormais les commentaires au contrat au lieu de les jeter, et dénonce ce qu'ils nomment à faux.

## La séquence (cinq blocs, l'existant orchestré)

0. **Déclarer l'environnement (C0)** — avant toute mesure : les instances joignables, leur hôte,
   leur profil de connexion, et celles connues par **documents interposés** seulement. Un chiffre
   qui ne dit pas d'où il vient n'est pas une mesure, c'est une lecture non située.
1. **Reprendre (C1)** — qualifier la matière reçue par `qualifie-l-entrant`
   (forge-conception) : CDC, spécifications, architectures, produit existant. Si la
   compréhension complète d'un existant est requise : **mode rétro-modèle**
   (`RETRO-MODELE.md`, oracle RM1-RM5). Une problématique d'exploitation sans document
   s'instruit directement au bloc 2.
2. **Diagnostiquer (C2)** — objectiver avant de recommander :
   `gabarits\DIAGNOSTIC-EXPLOITATION.md` — chaque mesure exécutée et sourcée
   (forge-data `mesurer_base.py` en lecture seule pour les bases — chaque mesure y archive
   sa CIBLE depuis le 24/08 : profil, entrepôt, hôte et namespace ; forge-audit sur
   mandat pour la gouvernance ; forge-observability pour les sondes). Jugé par
   `oracles\oracle-livrable-conseil.mjs` (LC1-LC5).
3. **Recommander (C3)** — directions, solutions, corrections, optimisations : chaque
   recommandation **ancrée aux mesures** du diagnostic (id `M-xx`), alternatives
   fermées, arbitrages assumés. **Un constat juste sans sa conclusion opérationnelle ne
   produit rien** : « ce qui manque est un déploiement, pas une conception » était écrit et exact,
   et il a fallu une objection humaine pour qu'il change une décision de périmètre. Une solution existante à challenger passe par
   `contre-expertise` ; un avis sans mesure n'entre pas au livrable.
4. **Lotir et planifier (C4)** — `gabarits\DEMARCHE-ROI.md` : lots « utiles,
   utilisables, utilisés » (les trois critères par lot, binaires), trajectoire de
   construction et de migration (applications ET bases — plans forge-ops `plan <cible>`
   + oracle O-5 pour les cibles cloud), plan daté par `pilote-de-mission`, chiffrage
   commercial délégué à `digit-ai-propale` s'il y a propale. Jugé par le même oracle.
5. **Remettre aux forges (C5)** — le contrat d'interface : chaque lot GO sort comme
   **entrant de build** — `PROMPT-PRODUIT.md` rempli (nouveau produit) ou brief delta
   d'un run de version (produit existant) — déposé dans le dossier du produit, tracé au
   ledger (`invocation` vers la voie choisie). Le conseil ne construit rien lui-même :
   il alimente les runs qui construisent.

## Ce qui ne s'applique PAS (et ne se singe pas)

- Pas d'`EXIGENCES.json` scellé au niveau mission — chaque LOT qui part en build aura sa
  conception à 4 verbes dans SON run.
- Pas de MEP portée par le conseil — la MEP appartient au run de build de chaque lot,
  avec ses gates M-1…M-5 et son GO humain.
- Pas de moteur de diagnostic automatique — le diagnostic est instruit par mission,
  l'oracle juge le LIVRABLE (mesures sourcées, recommandations ancrées), pas le système.
- Aucune API tierce payante hors modèles Claude ; aucun credential exposé (plans
  forge-ops plan-first).

## Gates humains

GO humain à trois points incompressibles : acceptation du diagnostic (fin du bloc 2),
choix des lots et de la trajectoire (fin du bloc 4), lancement de chaque run de build
(bloc 5, un GO par lot). `bloque_question` entre deux, jamais de réponse inventée.

## Clôture

Livrables nommés R-4 dans `output\`, oracle-livrable-conseil PASS sur diagnostic et
démarche ROI (journaux sous `forge\oracles\`), synthèse au format
`gabarits\RESTITUTION.md`, `run_close` au ledger. Le suivi des bénéfices (section 4 de
la démarche ROI) porte ses rendez-vous datés : chaque revue est un mini-mandat qui
compare les mesures d'alors aux promesses des lots.
