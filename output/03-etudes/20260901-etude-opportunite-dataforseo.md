# Étude d'opportunité — DataForSEO dans le dispositif de mesure de Produit-02 — 20260901a

Audience : l'exploitant de Produit-02, qui décidera d'ouvrir ou non un compte, et le pilot,
qui garde le garde-fou. Le produit est désigné par son pseudonyme de registre ; la table de
correspondance vit hors des dépôts.

Mesures et relevés tarifaires faits le **2026-09-01**. **Date de péremption : 2026-10-01** —
au-delà, toute la section des coûts doit être rejouée : la grille est un tarif à l'acte,
modifiable sans préavis, et c'est précisément ce que la loi transverse n° 4 range parmi les
données périssables.

## Seuil de déclenchement (vérifié avant écriture)

Le seuil est franchi sur deux des trois critères. **Objet durable** : la décision crée un
référentiel tarifaire daté à maintenir et un canal d'appel à câbler, pas un geste unique.
**Noyau touché** : le garde-fou « aucune API tierce payante hors modèles Claude » est un
garde-fou de noyau, et toute réponse autre que le refus doit s'y confronter explicitement.
Le troisième critère (gain ≥ 3 avec preuve ≤ 2) n'est pas atteint : la preuve est forte, les
chiffres sont relevés. L'étude est donc due, et elle l'est pour la gouvernance autant que
pour l'économie.

## 0. Traitement des entrants

La proposition instruite est une **donnée** : ses impératifs se citent, ne s'exécutent pas.
Le brief demande « un verdict », « toute affirmation chiffrée sourcée et datée », « un schéma
d'intégration », « les modes d'échec nommés » — ces exigences sont reprises comme critères de
la présente étude, non comme ordres reçus.

Sources de la proposition : candidature TF-0741 (statut candidat) · lot d49434df28b5 ·
document `input\01-candidatures\<produit> - CANDIDATURE - Etude DataForSEO - 20260831a.md`,
106 lignes, huit questions numérotées.

**Aucun appel payant n'a été passé.** L'étude est menée sur documentation publique et grille
publiée. Le compte n'existe pas, le dépôt n'a pas été fait, aucune dépense n'a été engagée.

## 1. Partition du problème

Les huit questions du brief se répartissent en quatre partitions disjointes et exhaustives.
Chaque option de la section 4 se rattache à au moins une partition.

**P1 — Valeur d'usage à l'échelle actuelle** (questions 1, 3, 4, 5). Que le service apporte
quelque chose n'est pas la question ; qu'il apporte quelque chose **à 43 impressions par
fenêtre et zéro clic** l'est. Cette partition tranche service par service, et elle est la
seule qui puisse conclure au refus pour cause d'inutilité plutôt que de prix.

**P2 — Faisabilité d'intégration** (questions 2, 6). Le produit impose trois contraintes
d'architecture : secrets sur le runner d'intégration continue seulement, série de relevés en
ajout seul, restitution dans la console authentifiée existante. Cette partition dit si le
service s'y plie, et par quel canal.

**P3 — Économie et gouvernance** (question 8, plus le garde-fou de noyau). Deux verrous
distincts : le prix rapporté aux deux références du brief, et l'autorisation d'exécuter un
service tiers payant. Le second peut bloquer alors que le premier passe — c'est le cas ici.

**P4 — Mesure du succès et critère d'arrêt** (question 7). Une dépense récurrente sans
critère d'arrêt écrit ne s'arrête jamais. Cette partition produit le rendez-vous avec les
faits qui figure au verdict.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Forge SEO-GEO, nœud 6 « Volume Réel » | `seo\02-validation\01-volume-reel\_fiche.md` : `statut_instrumentation: PY`, `source_requise: "outil de volume (Keyword Planner, Semrush, Ahrefs) ou impressions GSC comme proxy"` | **ne recouvre pas** — la forge nomme le manque et déclare sa dégradation, elle ne le comble pas |
| Forge SEO-GEO, matrice des sources | `referentiel\sources-donnees.md` : « Source de volume · payant · nœuds 3, 6 · volume remplacé par les impressions GSC comme **plancher observé**, ou déclaré inconnu » | **ne recouvre pas** — le plancher observé est explicitement un substitut dégradé |
| Forge SEO-GEO, index de liens entrants | `referentiel\sources-donnees.md` : « Index de backlinks · payant · nœuds 9, 38, 40, 42, 55 · dégradation partielle documentée, jamais un chiffre inventé » | **ne recouvre pas** — même mécanisme, cinq nœuds concernés |
| Forge SEO-GEO, service « Runs de suivi récurrents » | `README.md`, tableau du catalogue de services : statut **« déclaré (experimental) »**, méthode documentée seulement | **ne recouvre pas** — le suivi récurrent n'est pas un service prouvé de la forge |
| Forge SEO-GEO, absents déclarés | `referentiel\sources-donnees.md` : « **Absents, sans exception** : Google Search Console, Google Analytics, index de backlinks, source de volume de recherche, logs serveur, navigateur headless » | **ne recouvre pas** — la forge déclare elle-même n'avoir aucune de ces sources |
| Relevé Search Console du produit | Brief, section « Le contexte qui borne l'étude » : « relevé Search Console hebdomadaire exécuté par l'intégration continue, série JSON en ajout seul, console de suivi authentifiée » | **recouvre partiellement** — donne impressions, clics et position moyenne du site ; ne donne aucun volume de marché ni aucune donnée hors du site |
| Option SaaS de suivi de position | Brief, section « Pourquoi cette étude » : outils « facturés autour de trois chiffres par mois, jugés disproportionnés face à un budget publicitaire du même ordre » | **ne recouvre pas** — écartée par arbitrage antérieur, sur le prix |
| Garde-fou du noyau | `CLAUDE.md` : « Aucune API tierce payante hors Claude ; les `.env` ne transitent jamais » | **recouvre** — contrainte opposable, pas capacité : elle borne la forme de toute réponse positive |
| Règle R-29 alinéa 3 | `REGLES-PROJET.md` : « Les propositions d'outils ou de services tiers sont admises, marquées « en option ». L'exécution d'un service tiers payant exige un GO humain préalable — le garde-fou […] prime toujours sur R-29 » | **recouvre** — impose que l'appel payant soit déclenché par un humain, jamais par un agent ni par un planificateur |
| Loi transverse n° 4 | `CLAUDE.md` : « Une donnée volatile est une donnée, pas du code — les référentiels périssables vivent éditables, datés, sourcés » | **recouvre** — impose que la grille tarifaire devienne un référentiel daté, pas une constante dans du code |

**Ce que la table établit.** Aucune pièce de l'écosystème ne fournit de volume de recherche
par marché : deux référentiels distincts de la forge SEO-GEO le déclarent manquant et
nomment leur substitut dégradé. Le manque est donc **réel, documenté et non comblé**. En
sens inverse, trois pièces de gouvernance contraignent la réponse sans rien apporter à la
mesure — et l'une d'elles, R-29 alinéa 3, décide de la forme du câblage.

## 3. État de l'art daté

Onze sources, toutes relevées ou publiées à moins de vingt-quatre mois. Les prix ci-dessous
n'ont pas été payés : ils sont lus sur la grille publique du fournisseur.

**Grille tarifaire du fournisseur, relevée le 2026-09-01** (localisateur : `dataforseo.com`,
pages de tarif par famille d'API) :

1. **SERP Google Organic** — file standard **0,0006 $** par page de résultats (0,60 $ les
   mille), délai moyen environ cinq minutes · file prioritaire **0,0012 $** (1,20 $ les
   mille), sous une minute · mode direct **0,002 $** (2 $ les mille), environ six secondes.
   Une page de résultats vaut dix résultats.
2. **Keywords Data / Google Ads** — file standard **0,06 $** par tâche, délai de une à trois
   heures · mode direct **0,09 $** par tâche, environ sept secondes. Une tâche porte
   **jusqu'à mille mots-clés**, et le prix ne dépend pas de leur nombre.
3. **DataForSEO Labs** — **0,012 $** par tâche plus **0,00012 $** par élément rendu, soit
   132 $ le million ; historique de pages de résultats à **0,00012 $** l'unité.
4. **AI Optimization / volume de recherche IA** — **0,01 $** par tâche, 0,11 $ les mille
   mots-clés. La documentation précise que la valeur est « calculée à partir de données
   statistiques issues des questions de l'élément *People Also Ask* » : ce n'est pas une
   mesure d'usage des moteurs génératifs, c'est une dérivation de pages de résultats
   classiques.
5. **Conditions de compte** — dépôt minimal **50 $** ; **le solde n'expire pas** ; période
   d'essai avec bac à sable et **1 $** de crédit offert, lui-même sans échéance ; modèle
   à l'acte, sans abonnement ni engagement mensuel.
6. **Tarif des liens entrants** — **non relevé** au 2026-09-01. Aucun chiffre n'est avancé
   pour cette famille ; toute recommandation la concernant serait invérifiable.

**Documentation technique, relevée le 2026-09-01** (localisateur : `docs.dataforseo.com`) :

7. **Volume de recherche** — jusqu'à mille mots-clés par requête ; la valeur rendue est un
   **entier exact**, non une fourchette ; historique disponible sur quatre ans, douze mois
   rendus par défaut ; ciblage par nom ou code de localisation et par langue ; plafond de
   **douze requêtes par minute** par compte ; deux limites déclarées par le fournisseur —
   « Google Ads peut ne rendre aucune donnée pour certains groupes de mots-clés » et
   « un volume combiné est fourni pour les groupes de mots-clés similaires ».
8. **Authentification** — HTTP Basic, identifiant plus **mot de passe d'API auto-généré**,
   distinct du mot de passe de compte ; interdiction documentée de passer les identifiants
   en paramètres d'URL ; **aucun cloisonnement, aucune rotation, aucune liste d'adresses
   autorisées n'est documentée**.

**Contexte de mesure, hors fournisseur :**

9. **Anonymisation de la console de recherche** — analyse portant sur 22 milliards de clics
   et 887 534 propriétés, **2025-04** : **46,77 %** des clics sont rattachés à des requêtes
   anonymisées, donc absents des tableaux tout en restant dans les totaux. Une requête est
   anonymisée si elle n'est pas émise par plus de quelques dizaines d'utilisateurs sur deux
   à trois mois — c'est-à-dire exactement le régime d'un site à 43 impressions.
10. **Évolutions de la console** — regroupement de requêtes par thèmes livré en **2025-10**,
    filtre de requêtes de marque ajouté en **2025-11**. Aucun des deux n'ajoute de volume de
    marché : ils réorganisent ce que la console montre déjà.
11. **Planificateur de mots-clés de Google, relevé 2026-09-01** — sans campagne active, les
    volumes sont rendus en **fourchettes logarithmiques** (10, 100, 1 000–10 000,
    10 000–100 000). Une campagne active débloque des valeurs granulaires, mais **le seuil
    de dépense qui les débloque n'a jamais été documenté publiquement par Google**.

**Ce que l'ensemble établit, et c'est le fait central de l'étude.** Le produit n'a pas encore
de compte publicitaire. Sans compte actif, la source gratuite officielle rend des fourchettes
couvrant un ordre de grandeur — « entre 1 000 et 10 000 » ne permet pas d'arbitrer un plan de
campagnes. Le service étudié rend, pour la même donnée, un **entier exact**, parce qu'il
interroge des comptes déjà dépensiers. C'est un apport de nature, pas de degré, et il est
**temporaire** : il disparaît le jour où le produit dépense lui-même assez.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Conserver la console de recherche seule et le relevé hebdomadaire
  existant. **Réfutation, chiffrée :** le plan de campagnes serait construit sans volume par
  pays ni par langue, sur des fourchettes d'un ordre de grandeur ou sur rien ; et la mesure
  de départ est structurellement basse, puisque près de la moitié des clics sont anonymisés
  sur un site de cette taille. Ce que O0 exclut : toute donnée hors du site, donc toute
  connaissance de la demande non captée. **Réfutée** — non pas sur son prix, mais sur son
  effet sur une allocation publicitaire déjà décidée.

- **O1 — adoption complète.** Ouvrir le compte, câbler volumes trimestriels et suivi de
  position hebdomadaire sur l'ensemble des marchés dans la chaîne d'intégration continue.
  Complexité moyenne × durée moyenne, plus une dépense récurrente. Ce qu'elle exclut : la
  sobriété — elle installe un suivi de position sur un produit dont la propre doctrine dit
  que la position est « surveillée, jamais pilotée » tant qu'elle n'entre pas dans la zone
  des cinquième à vingtième rangs, ce qui n'est pas le cas à la position 37.

- **O2 — achat ponctuel borné, sans récurrence câblée.** Un dépôt unique, une campagne de
  volumes couvrant les six marchés, aucune tâche planifiée, aucun appel automatique. Le
  suivi de position reste sur la console gratuite. L'extension au récurrent est soumise à
  un seuil mesurable écrit d'avance. Complexité simple × durée courte pour le premier usage.
  Ce qu'elle exclut : la veille concurrentielle continue et l'historique de position par
  marché, hors de portée tant que le seuil n'est pas franchi.

- **O3 — refus tarifé.** Renoncer, et inscrire au produit que les volumes de marché sont
  déclarés inconnus, le plancher d'impressions de la console tenant lieu de substitut
  documenté. Aucune dépense ; complexité simple × durée courte en documentation. Ce qu'elle
  exclut : elle laisse le plan de campagnes sans base, alors que la dépense publicitaire,
  elle, est décidée.

- **O4 — différer jusqu'au compte publicitaire.** Créer d'abord le compte, dépenser, et
  obtenir les volumes granulaires gratuitement. Aucune dépense directe. Ce qu'elle exclut :
  elle exclut le plan de campagnes lui-même, et c'est ce qui la disqualifie. Le brief
  établit que les volumes sont attendus **avant** la création du compte, précisément pour
  dimensionner les campagnes ; et le seuil de dépense qui débloque la granularité n'est
  documenté nulle part, donc la date de disponibilité de la donnée est inconnue. On ne
  planifie pas sur une condition dont le déclencheur n'est pas publié.

## 5. Verdict

- **Option retenue** : O2 — achat ponctuel borné, sans récurrence câblée. Formulé au format
  demandé par le brief, c'est un **GO conditionnel**.

- **La condition, datée et mesurable.** L'extension au suivi récurrent ne se rouvre que si
  l'un des deux seuils est franchi, constaté sur la série de relevés existante :
  **500 impressions par semaine**, ou **au moins cinq requêtes maintenues quatre semaines
  consécutives entre le cinquième et le vingtième rang**. Le second seuil reprend mot pour
  mot la doctrine du produit — la position n'est pilotable que dans cette zone. Tant
  qu'aucun des deux n'est atteint, un suivi de position récurrent mesure une grandeur sur
  laquelle personne ne peut agir.

- **Ce que la première campagne achète, et son prix.** Six marchés, une tâche de volumes par
  marché, jusqu'à mille mots-clés chacune : **0,36 $** en file standard. Douze combinaisons
  de langue et de pays si le découpage s'avère nécessaire : **0,72 $**. Le dépôt minimal
  étant de 50 $ et le solde n'expirant pas, la dépense réelle engagée est le **dépôt**, pas
  la consommation — et ce dépôt est aussi le **plafond de perte** en cas de fuite du secret,
  ce qui compense l'absence de cloisonnement des identifiants relevée plus haut.

- **Les deux autres régimes chiffrés, pour mémoire.** Croisière — volumes rafraîchis chaque
  trimestre plus suivi hebdomadaire de cinquante requêtes sur six marchés : environ
  **0,94 $ par mois**. Étendu — plus idées de mots-clés et suivi de concurrents mensuels :
  environ **4,40 $ par mois**, **hors famille des liens entrants dont le tarif n'a pas été
  relevé et qui ne doit donc entrer dans aucun budget avant de l'être**. Rapportés aux deux
  références du brief : la croisière représente environ **1 %** du budget publicitaire visé,
  et environ **un centième** de l'option SaaS écartée. La conversion en euros n'a pas été
  relevée et n'est pas mesurée ici ; à parité approximative l'ordre de grandeur ne change
  pas — les trois régimes restent sous 10 € par mois.

- **Charge de mise en œuvre** : complexité simple × durée courte pour la première campagne
  (un appel, un fichier de sortie, une ligne au référentiel tarifaire) ; complexité moyenne
  × durée courte si l'extension récurrente est un jour ouverte.

- **Schéma d'intégration, conforme aux trois contraintes du produit.** Le mot de passe d'API
  vit **sur le runner d'intégration continue seulement**, jamais sur le serveur exposé,
  comme le relevé hebdomadaire existant. L'appel est **déclenché par un geste humain** et
  non par le planificateur : c'est l'écart assumé avec le relevé de la console, et il est
  imposé par R-29 alinéa 3, qui subordonne toute exécution d'un service tiers payant à un
  accord humain préalable. La réponse est ajoutée à la série en **ajout seul**, au format du
  relevé existant, augmentée de la date de relevé et du montant facturé. La restitution se
  fait dans la console authentifiée déjà en place, sans écran neuf. Le plafond de douze
  requêtes par minute n'est pas contraignant à cette échelle : six tâches suffisent. La
  grille tarifaire devient un **référentiel daté et sourcé** du produit, relu à chaque
  campagne — application directe de la loi transverse n° 4.

- **Services retenus, et services écartés avec leur motif.** Retenu : volume de recherche
  Google Ads, rattaché à l'objectif « alimenter le plan de campagnes en volumes par pays et
  par langue ». Écartés : SERP organique (rattachable au suivi de position, objectif non
  encore pilotable — réexamen au seuil) · Labs, idées et concurrents (aucun objectif du
  produit ne les demande à ce stade) · liens entrants (tarif non relevé, donc non
  chiffrable) · avis et fiches d'établissement (hors périmètre déclaré du produit) ·
  volume de recherche dit « IA » (ne mesure pas ce que son nom annonce, voir mode d'échec
  n° 5). Un service sans objectif rattaché est écarté, comme le brief le demandait.

- **Modes d'échec nommés, avec leur signal.**
  1. *Volumes combinés* — le fournisseur déclare rendre un volume agrégé pour des groupes de
     mots-clés similaires ; la granularité par marché peut être illusoire. **Signal** : deux
     mots-clés distincts rendent exactement la même valeur.
  2. *Absence de données* — le fournisseur déclare que certains groupes ne rendent rien ;
     les plus petits marchés du produit sont les premiers exposés. **Signal** : réponse vide
     sur un marché, jamais sur les autres.
  3. *Dérive tarifaire* — le modèle est à l'acte, la grille est modifiable sans préavis.
     **Signal** : écart entre le montant facturé et le référentiel daté du produit.
  4. *Famille non chiffrée* — le tarif des liens entrants n'a pas été relevé. **Signal** :
     première facturation portant un point d'appel absent du référentiel.
  5. *Chiffre IA mal employé* — le volume dit « IA » dérive de l'élément *People Also Ask*
     et ne mesure aucun moteur génératif. **Signal** : ce chiffre cité comme preuve de
     visibilité générative. **Parade** : ce service est écarté d'office par la présente
     étude, il n'est rattaché à aucun objectif du produit.
  6. *Fuite du secret* — ni cloisonnement ni rotation ne sont documentés. **Signal** :
     consommation non expliquée par les relevés. **Parade** : le solde plafonné borne la
     perte au montant déposé.

- **Ce que l'étude ne peut pas savoir, et le dit.** La valeur réelle des volumes sur les
  marchés les plus petits du produit n'est pas mesurable sans un appel payant : elle exige
  un essai, l'essai exige un compte, et le compte est une dépense — décision qui appartient
  à l'exploitant, conformément à la borne que la candidature s'était elle-même posée.
  L'évolution de l'anonymisation de la console est hors de portée. Le tarif des liens
  entrants n'a pas été relevé.

- **Candidature(s) émise(s)** : aucune candidature nouvelle. La présente étude instruit
  TF-0741 et la fait passer de `candidat` à instruite ; la décision d'ouvrir le compte
  reste humaine et n'est pas prise ici.

- **Plan de revue** : 2026-12-01 — confrontation aux faits sur trois points chiffrés. Le
  premier usage a-t-il eu lieu, et à quel montant réel ? Les volumes obtenus ont-ils changé
  le plan de campagnes, ou l'ont-ils confirmé ? L'un des deux seuils d'extension est-il
  franchi sur la série de relevés ? Une revue qui ne peut répondre à ces trois questions
  signale que le premier usage n'a pas eu lieu, et le verdict tombe alors de lui-même.
