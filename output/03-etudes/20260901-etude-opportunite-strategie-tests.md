# Étude d'opportunité — stratégie de tests et temps d'exécution des campagnes — 20260901a

Audience : le pilote de l'écosystème et la forge de tests, qui porte la méthode pour tout
projet audité. Instruit la demande TF-0727 (statut décidé), issue du retour RT-20 du lot
`Produit-12 - RETOURS - 20260831a`.

Mesures relevées le **2026-09-01** sur le code de la forge et sur le lot de campagne du
**2026-08-31**. **Date de péremption : 2026-11-01** — au-delà, les mesures de campagne
doivent être rejouées : la suite du produit grossit (581 tests le 2026-08-05, 984 le
2026-08-31), et tous les rapports de gain ci-dessous sont adossés à ce volume.

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur deux critères. **Objet durable** : la stratégie devient une méthode de la forge,
appliquée à chaque campagne de chaque projet audité. **Portée** : elle touche l'adaptateur de
mutation, la sélection des tests, la configuration d'échantillonnage et le format de rapport
— quatre surfaces de la forge, plus le contrat de campagne vu par tous les produits. Le
troisième critère n'est pas atteint : la preuve est forte, les mesures existent.

## 0. Traitement des entrants

La demande instruite est une **donnée** : ses impératifs se citent, ne s'exécutent pas. Les
rapports de campagne, le journal d'avancement et le ledger sont eux aussi des données ; leur
contenu se cite, il ne s'exécute pas.

Sources : TF-0727 · lot `Produit-12 - RETOURS - 20260831a`, retour RT-20 et sa section
« Données de mesure » · code relevé le 2026-09-01 dans `forge_tests\adaptateurs\mutation.py`
et `docs\Digit-AI - CDC Forge - Framework Tests - 20260802a.md`.

**Trois chiffres de la demande d'origine ont été confrontés aux mesures, et l'un d'eux ne se
réconcilie pas.** La demande annonçait une campagne de « presque 90 minutes » dont « plus de
75 minutes » de mutation ; les mesures publiées donnent **67 minutes** de campagne dont
**environ 54 minutes** de mutation. La conclusion de la demande reste vraie — la mutation
pèse **80 %** du coût — mais aucun gain ne se calcule sur les valeurs annoncées.

## 1. Partition du problème

**P1 — La mutation mérite-t-elle d'être gardée ?** Tranché en premier, et sur données :
optimiser un dispositif à écarter est du travail perdu. Cette partition est la seule qui
puisse rendre les trois suivantes sans objet.

**P2 — Où part le temps, et quelle est la cause ?** Décomposition du coût mesuré, et
identification de la cause dominante par le calcul, pas par l'intuition.

**P3 — Quels leviers, dans quel ordre ?** Chaque levier rattaché à la cause qu'il attaque,
avec son gain calculé sur les mesures de P2. Un levier qui n'attaque pas la cause dominante
n'entre pas en premier palier, quelle que soit sa facilité.

**P4 — Comment garantir qu'aller plus vite ne signifie pas mesurer moins ?** Partition
transverse : elle produit la condition d'acceptation opposable à tous les paliers de P3, et
c'est elle qui distingue une optimisation d'une amputation.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Adaptateur de mutation, exécution par mutant | `forge_tests\adaptateurs\mutation.py` : `subprocess.run([python, "-m", "pytest", SUITE, "-q", "--no-header", "-p", "no:cacheprovider", "-p", "no:warnings", "-x"], … timeout=600)` avec `SUITE = "tests"` | **ne recouvre pas** — c'est la cause, pas la parade : la suite ENTIÈRE est lancée à chaque mutant, aucune sélection par ligne mutée n'existe |
| Adaptateur de mutation, ordonnancement | `forge_tests\adaptateurs\mutation.py` : `for mutant in mutants:` et `for fichier, mutant in plan:`, avec `subprocess.run` bloquant | **ne recouvre pas** — l'exécution est séquentielle par construction, aucune parallélisation n'est présente |
| Doctrine de budget de la forge | `forge_tests\adaptateurs\mutation.py`, en-tête : « Le coût d'une mutation est une exécution de suite par mutant. La couverture de PÉRIMÈTRE est totale par défaut ; c'est la PROFONDEUR qui est échantillonnée » | **recouvre partiellement** — la forge a déjà tranché que le périmètre est intangible et que seule la profondeur s'échantillonne ; c'est un acquis à ne pas défaire |
| Réglage d'échantillonnage | `forge_tests\adaptateurs\mutation.py` : `_MUTANTS_PAR_MODULE_DEFAUT = 3`, variable `FORGE_TESTS_MUTANTS_PAR_MODULE`, présente aux deux bancs `fixtures\banc-rouge\.env.forge-tests.exemple` et `fixtures\banc-vert\.env.forge-tests.exemple` | **recouvre** — le levier existe, mais l'actionner à la baisse est exactement ce que P4 interdit |
| Principe A-1, périmètre total | `forge_tests\adaptateurs\mutation.py` : « Le périmètre est désormais l'arborescence ENTIÈRE des sources, et toute exclusion est nominative, motivée, publiée » | **recouvre** — garde-fou déjà en place contre l'amputation par exclusion silencieuse |
| Principe A-2, aucun module silencieux | `forge_tests\adaptateurs\mutation.py` : « L'adaptateur publie `modules[]` : chaque module source avec son état — exercé, muté, ou jamais exercé et nommé » | **recouvre** — fournit gratuitement la matière du corpus de comparaison exigé par P4 |
| Seuils de couverture de la forge | `docs\Digit-AI - CDC Forge - Framework Tests - 20260802a.md`, critère S-07 : « ≥ 90 % des branches de traitement ; 100 % des formats déclarés » | **recouvre partiellement** — la forge raisonne déjà en branches, pas seulement en lignes ; l'axe « profondeur de couverture » est donc à trancher, pas à ouvrir |
| Points non tranchés du cahier des charges | `docs\Digit-AI - CDC Forge - Framework Tests - 20260802a.md` : « environnements d'exécution (local, intégration continue, conteneur, base éphémère…) » listés comme **non tranchés** | **ne recouvre pas** — la distribution multi-postes n'a jamais été instruite ; elle est déclarée ouverte depuis le 2026-08-02 |
| Journal d'avancement de campagne | Lot RT-20 : « cadence mesurée au journal `forge\avancement.jsonl` : 0,57–0,60 module/min », entrée par module | **recouvre** — l'instrumentation nécessaire pour mesurer un gain existe déjà, aucun outillage neuf n'est requis pour constater |
| File de tâches du parc | `digit-ai-queue`, dépôt du parc, cité par RT-20 comme support possible d'une file de mutants | **ne recouvre pas** — existe, mais n'a jamais été raccordée à une campagne de tests |

**Ce que la table établit.** La cause du coût est lisible **dans le code**, pas déduite : une
exécution de suite complète par mutant, en séquence. Les garde-fous contre l'amputation
(périmètre total, exclusions nominatives, modules nommés) sont déjà en place et n'ont pas à
être inventés. Ce qui manque est exactement ce que la demande nomme : la sélection des tests
par ligne mutée, le cache entre campagnes, et l'ordonnancement parallèle.

## 3. État de l'art daté

**A. Mesures internes, relevées ou publiées à moins de vingt-quatre mois.**

1. **Campagne v0.4.0, 2026-08-31** — 984 tests, suite complète **~52 s** ; **115 mutants**,
   39/40 modules, **92 tués (80 %)**, **23 survivants** nommés dont 10 dans le code neuf ;
   mutation **~54 min** ; campagne **67 min** ; pans hors mutation **13 min** (api 483/483,
   interface 233/235, data 194/197, migrations 27/27, qualif 79/79, prompts 0/15) ;
   94 constats dont 26 critiques. Rapport `rapport-20260831.json`, 247 Ko.
2. **Campagne v0.1.0, 2026-08-05** — 581 tests, ~17 s ; 37 mutants, 7 modules, **37/37 tués**.
   Durée non tracée finement. Point de comparaison : le périmètre de mutation est passé de
   7 à 39 modules entre les deux campagnes.
3. **Coût unitaire des tests, 2026-08-31** — « test le plus lent : 0,38 s — **aucun test n'est
   individuellement coûteux, c'est le nombre de rejeux qui fait le coût** ». Moyenne :
   984 tests en 52 s, soit 0,053 s par test.
4. **Cadence de mutation, 2026-08-31** — 0,57 à 0,60 module par minute, horodatée par module
   au journal `forge\avancement.jsonl`.
5. **Code de l'adaptateur, relevé 2026-09-01** — suite entière par mutant, drapeau d'arrêt au
   premier échec, délai de garde de 600 s par mutant, boucles séquentielles.
6. **Cahier des charges de la forge, 2026-08-02** — critère S-07 en branches ; environnements
   d'exécution déclarés non tranchés.

**B. Réconciliation arithmétique — une des trois valeurs publiées ne tient pas.**

115 mutants à ~37 s donnent 71 min, soit **plus que les 67 min de campagne entière**. La
valeur « ~37 s par mutant » est donc incompatible avec les deux autres. La paire cohérente
est **(115 mutants, ~54 min, moyenne 28,2 s)**, et le drapeau d'arrêt au premier échec
l'explique entièrement :

- un mutant **survivant** ne fait échouer aucun test, donc la suite va à son terme : ~52 s.
  Les 23 survivants coûtent à eux seuls **~20 min, soit 37 % du pan mutation** ;
- un mutant **tué** s'arrête au premier échec : les 92 restants absorbent ~34 min, soit une
  moyenne de **~22 s**, environ 43 % de la suite.

Cette décomposition n'était publiée nulle part et elle est le résultat le plus actionnable de
l'étude : **le coût se concentre sur les mutants qui survivent**, c'est-à-dire précisément
ceux qui portent l'information utile. La valeur de 28,2 s est retenue pour tous les calculs
ci-dessous, et la valeur de 37 s est à corriger à la source.

**C. Littérature externe.** Fenêtre assumée : la recherche sur le coût de la mutation est
antérieure à vingt-quatre mois pour l'essentiel ; ces sources sont citées **pour la classe de
technique, jamais pour un chiffre transposé à ce produit**.

7. *Mutation Testing in Evolving Systems: Studying the Relevance of Mutants to Code
   Evolution*, ACM TOSEM, **2022** — établit que la pertinence d'un mutant dépend de sa
   relation au changement, ce qui fonde l'analyse incrémentale.
8. *Comparing Mutation Coverage Against Branch Coverage in an Industrial Setting*, **2021**,
   arXiv 2104.11767 — compare directement les deux mesures en contexte industriel ; c'est la
   référence adossée à la partition P1.
9. *Mutation Testing Cost Reduction Techniques: A Survey*, **2010** — taxonomie « faire
   moins » (réduire le nombre de mutants) contre « faire plus vite » (réduire le coût
   d'exécution). Cadre de lecture des paliers ci-dessous.
10. *Fast and accurate incremental feedback using selective mutation analysis*, Journal of
    Systems and Software, **2021** — mutation sélective et incrémentale, réductions
    rapportées de l'ordre de 70 à 77 % du nombre de mutants selon les techniques.

**Ce que la littérature ajoute, et ce qu'elle ne tranche pas.** Elle confirme que les deux
familles de gain sont connues et éprouvées, et que « faire moins » et « faire plus vite » ne
s'opposent pas. Elle ne dit rien du coût fixe par mutant dans cette implémentation-ci —
démarrage d'interpréteur, purge de bytecode, montage de base — qui est **non mesuré** et qui
devient le poste dominant dès que la sélection par ligne est en place. La mesure manquante
est nommée au palier 1.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** **Réfutation chiffrée :** la campagne reste à 67 min, dont 54 de
  mutation ; l'échantillonnage à 3 mutants par module reste **subi** et non choisi, la forge
  le déclare elle-même comme une concession de budget ; et le plafond de 400 mutants prévu
  par la configuration est injouable, puisqu'il porterait la mutation seule à environ 3 h.
  Ce que O0 exclut : toute augmentation de la profondeur de mesure, donc tout renforcement du
  pouvoir de détection, aussi longtemps que le coût unitaire reste celui-là. **Réfutée.**

- **O1 — abaisser l'échantillonnage ou exclure des modules.** Atteint n'importe quelle cible
  de durée immédiatement. Ce qu'elle exclut : elle exclut la mesure elle-même. C'est
  l'option que la partition P4 existe pour interdire, et elle est nommée ici pour être
  refusée explicitement plutôt que d'être atteinte par glissement. **Écartée.**

- **O2 — paralléliser d'abord.** Diviser les 54 min par le nombre de processus : environ
  7 min sur huit cœurs, sans rien changer d'autre. Ce qu'elle exclut : elle exclut la
  correction de la cause — on achète du parallélisme pour exécuter du travail inutile, et le
  coût en énergie et en matériel croît avec le périmètre au lieu de décroître. **Écartée
  comme premier palier**, retenue comme palier tardif à l'intérieur de O3.

- **O3 — plan par paliers ordonnés, ciblage d'abord, sous condition de non-perte.**
  Attaquer la cause lue dans le code — une suite entière par mutant — avant tout autre
  levier, chaque palier n'étant accepté que s'il rend le même verdict que la campagne
  pleine. Complexité moyenne × durée moyenne pour les deux premiers paliers, complexe ×
  moyenne pour l'ensemble. Ce qu'elle exclut : le gain immédiat sans instrumentation — elle
  demande une mesure du coût fixe par mutant avant de promettre un chiffre.

- **O4 — retirer la mutation du périmètre.** Supprime 80 % du coût d'un seul geste.
  **Réfutation sur données :** la campagne a produit 23 survivants nommés, dont **10 dans le
  code écrit pendant le run** ; ce sont des faiblesses d'assertion, que ni la couverture de
  lignes ni la couverture de branches ne peuvent voir par construction, puisque le code est
  exécuté et que seule l'assertion manque. Le pan data l'illustre en sens inverse : trois
  contraintes uniques jamais violées par un test ont été trouvées par la **couverture**, pas
  par la mutation — les deux mesures voient des choses différentes, et se retirer de l'une
  n'est pas compensé par l'autre. **Réfutée.**

## 5. Verdict

- **Option retenue** : O3 — plan par paliers ordonnés, ciblage par ligne mutée d'abord, sous
  condition de non-perte opposable à chaque palier.

- **P1 — la mutation reste au périmètre, sous condition.** Elle a produit une détection
  qu'aucune autre mesure de la campagne n'a produite : 23 survivants nommés dont 10 dans du
  code neuf, à un moment où la couverture était déjà tenue. **La condition** : au prochain
  run, les 23 survivants sont **classés en deux catégories** — faiblesse d'assertion réelle,
  ou mutant équivalent non tuable. Si la part des équivalents dépasse **50 %**, la stratégie
  d'échantillonnage produit du bruit et se réexamine. Cette classification n'existe pas
  aujourd'hui : c'est la mesure manquante qui empêche de calculer un coût par défaut
  réellement trouvé, et elle est déclarée comme telle plutôt que remplacée par une opinion.

- **P2 — la cause, établie par le calcul et lue dans le code.** Aucun test n'est coûteux
  individuellement (0,38 s au maximum, 0,053 s en moyenne) : c'est le **nombre de rejeux**
  qui fait le coût. Chaque mutant relance la suite entière ; les survivants la mènent à son
  terme et absorbent 37 % du pan à eux seuls. Une poignée de tests couvre la ligne mutée ;
  la forge en exécute 984.

- **Le plan, par paliers ordonnés selon le gain calculé.**

  **Palier 1 — sélection des tests par ligne mutée.** Ne rejouer, pour un mutant donné, que
  les tests couvrant la ligne mutée, la carte de couverture étant déjà produite par
  l'adaptateur au titre du principe A-2. *Gain* : le coût par mutant tombe des 28,2 s
  actuels au surcoût fixe plus quelques tests à 0,38 s au plus. *Le surcoût fixe est non
  mesuré* — mesure nommée : chronométrer un mutant avec un seul test sélectionné, trois
  répétitions. À une borne haute prudente de 3 s, la mutation passe de 54 min à environ
  6 min, soit une division par neuf ; au plafond de 400 mutants, de 3 h à 20 min, ce qui
  rend le plafond jouable pour la première fois. *Touche* : `mutation.py`, argument passé à
  `pytest` en remplacement de `SUITE`. *Critère de sortie* : sur le corpus de référence, même
  liste de survivants, à l'identité près. *Critère d'abandon* : si le surcoût fixe mesuré
  dépasse 10 s, le gain tombe sous un facteur trois et le palier 4 devient prioritaire.

  **Palier 2 — cache de verdicts entre campagnes.** Ne pas rejouer un mutant dont le module
  et sa suite n'ont pas changé. *Gain* : sur un run touchant 10 modules sur 40 — le cas du
  lot d'origine — environ 75 % des mutants sont sautés ; combiné au palier 1, la mutation
  passe sous 2 min. *Touche* : un fichier d'empreintes à côté du rapport. *Critère de
  sortie* : après invalidation forcée, le cache rend exactement le même verdict que le
  calcul complet. *Critère d'abandon* : toute divergence non expliquée invalide le palier
  entier — un faux vert coûte davantage qu'une campagne lente, parce qu'il ne se signale
  pas. **L'empreinte doit couvrir le module, sa suite ET la configuration d'exécution** ;
  une empreinte incomplète est le mode d'échec principal de tout le plan.

  **Palier 3 — sélection d'impact sur les pans hors mutation.** Les 13 min résiduelles
  deviennent le poste dominant une fois les paliers 1 et 2 en place. *Gain* : plafonné à
  13 min, soit 19 % du coût actuel — d'où sa place en troisième position et non en première,
  contrairement à ce que l'intuition suggère. *Garde obligatoire* : rejeu complet
  périodique, non désactivable, sans quoi les régressions à distance cessent d'être vues.

  **Palier 4 — parallélisation locale.** Mutants en N processus, la suite en exécution
  répartie. Chaque test du produit monte déjà sa propre base isolée, la contrainte
  d'isolement est donc déjà levée. *Gain* : division par N. Appliqué avant le palier 1, il
  ramène 54 min à 7 min sur huit cœurs ; appliqué après, il ramène 2 min à quelques
  secondes. Le gain **absolu** est donc bien plus grand si on le joue en premier — et c'est
  précisément le piège : il fige la cause au lieu de la corriger, et le coût matériel croît
  ensuite proportionnellement au périmètre.

  **Palier 5 — distribution multi-postes.** Différé. Après les paliers 1, 2 et 4, la
  campagne tient sous quelques minutes et le coût d'orchestration dépasserait le gain. La
  file du parc existe et n'a jamais été raccordée à une campagne ; le raccordement se
  réexamine si le volume de mutants d'un projet dépasse le plafond de 400, ou si le nombre
  de projets audités en parallèle rend le poste unique limitant.

  **Axe profondeur de couverture — tranché.** Le mot « couverture » recouvre quatre mesures
  de coûts très différents. La forge raisonne déjà en **branches** au critère S-07 ; ce choix
  est confirmé et devient la porte bon marché de la boucle de développement. La couverture de
  lignes est déclarée insuffisante — les trois contraintes uniques jamais violées le
  démontrent. La couverture de chemins est écartée : hors budget, et sans gain démontré face
  à la mutation, qui explore la même surface par un autre chemin. La mutation reste la mesure
  profonde, périodique, jamais la porte de chaque changement.

- **Deux boucles, dimensionnées séparément.**
  **Boucle de développement**, jouée à chaque changement : tests couvrant le diff, plus
  mutation sur les seules lignes modifiées. **Cible ≤ 2 min.** Tenable dès le palier 1 —
  la suite complète tient déjà en 52 s.
  **Campagne d'intégration**, jouée à chaque remise : suite complète plus mutation ciblée
  avec cache, plus les pans. **Cible ≤ 15 min.** Calcul : 52 s de suite, moins de 2 min de
  mutation après paliers 1 et 2, 13 min de pans avant palier 3 — la cible est tenue dès le
  palier 2, avec marge après le palier 3.
  **Garde complète**, sans plafond de durée, **périodicité : à chaque run de version** :
  mutation au plafond de 400, aucun cache, aucune sélection, rejeu intégral. C'est elle qui
  sert de corpus de référence à la condition de non-perte.

- **P4 — la condition de non-perte, opposable à chaque palier.** Sur le corpus de référence
  produit par la garde complète, la campagne optimisée rend **le même verdict** : même liste
  de mutants survivants, mêmes constats, mêmes modules nommés. Toute divergence est un défaut
  de l'optimisation, jamais un arrondi acceptable. **Interdit absolu** : atteindre une cible
  de durée en réduisant ce qui est mesuré — moins de mutants par module, modules exclus, pans
  retirés. Un palier qui ne tient sa cible qu'à ce prix est déclaré infaisable et non proposé.
  La comparaison est déjà outillée : le principe A-2 publie `modules[]` avec l'état de chaque
  module, et le rapport nomme les survivants un par un.

- **Ce qui est gravé et ce qui est paramétrable par projet.** Gravé : le périmètre total, les
  exclusions nominatives et motivées, la condition de non-perte, la garde complète
  périodique, la publication des modules jamais exercés. Paramétrable : le nombre de mutants
  par module, les cibles de durée des deux boucles, la périodicité de la garde, le nombre de
  processus. **Règle de dimensionnement** : les cibles de durée se posent en multiples de la
  suite complète du projet — boucle de développement ≤ 3 fois la suite, campagne
  d'intégration ≤ 20 fois la suite — et non en valeurs absolues, sans quoi un projet de
  50 tests hériterait d'un budget calibré sur un projet de mille. Un projet sans suite
  existante n'entre pas dans ce cadre : la mutation y est déclarée non mesurable et le
  message le dit, plutôt que de rendre un score de zéro.

- **Modes d'échec nommés, avec leur signal.**
  1. *Faux vert par empreinte incomplète* — le cache saute un mutant qu'un changement de
     configuration aurait fait survivre. **Signal** : la garde complète rend un survivant que
     la campagne optimisée n'avait pas listé.
  2. *Régression à distance masquée* — la sélection d'impact ne rejoue pas un test éloigné du
     changement. **Signal** : un échec apparaît au rejeu périodique sans changement récent
     dans le module concerné.
  3. *Seuil devenu cible* — les projets qui dépassent la durée réduisent ce qu'ils mesurent.
     **Signal** : une baisse du nombre de mutants par module, ou une exclusion neuve, sans
     motif publié.
  4. *Score de mutation optimisé pour lui-même* — des assertions écrites pour tuer des
     mutants plutôt que pour décrire un comportement. **Signal** : le score monte pendant que
     le nombre de constats fonctionnels stagne. **Parade** : ne jamais publier le score de
     mutation comme objectif individuel.
  5. *Mutant en boucle infinie* — le délai de garde de 600 s par mutant fait qu'un seul
     mutant pathologique peut coûter davantage que dix minutes de campagne optimisée.
     **Signal** : un mutant dont la durée atteint le délai de garde. **Parade** : après
     ciblage, abaisser ce délai à un multiple du temps des tests sélectionnés.
  6. *Mutants équivalents non classés* — la part d'équivalents parmi les survivants est
     inconnue, donc le coût par défaut réellement trouvé n'est pas calculable. **Signal** :
     les mêmes survivants reviennent campagne après campagne sans jamais être tués.
     **Parade** : la condition posée en P1.

- **Candidature(s) émise(s)** : aucune candidature nouvelle. La présente étude instruit
  TF-0727 ; la mise en œuvre des paliers relève d'un mandat distinct et n'est pas engagée ici.
  Un constat est toutefois à porter à la forge indépendamment des paliers : la valeur
  « ~37 s par mutant » publiée au rapport ne se réconcilie ni avec la durée de mutation ni
  avec la durée de campagne, et doit être corrigée à la source.

- **Plan de revue** : 2026-10-15 — confrontation aux faits sur quatre points chiffrés. Le
  surcoût fixe par mutant a-t-il été mesuré, et à quelle valeur ? Le palier 1 est-il posé, et
  la mutation est-elle passée sous la barre calculée ? La condition de non-perte a-t-elle été
  jouée au moins une fois, avec quel écart ? Les 23 survivants ont-ils été classés, et quelle
  est la part des équivalents ? Une revue incapable de répondre au premier point signale que
  le plan n'a pas commencé, et le reste ne se juge pas.
