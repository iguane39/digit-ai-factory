# Étude d'opportunité — Données de recherche pour le SEO multilingue de Produit-02 — 20260901c

Audience : l'exploitant de Produit-02, qui décidera des paliers de dépense, et le pilot, qui
garde les garde-fous. Le produit est désigné par son pseudonyme de registre ; la table de
correspondance vit hors des dépôts. Cette étude **remplace** l'étude 20260901a (DataForSEO),
déclassée en annexe opérationnelle par le cadrage v2 — elle en reprend les faits tarifaires
datés et en élargit le périmètre à tout outil pertinent.

Relevés faits le **2026-09-01**. **Péremption : 2026-10-01** pour toute la couche tarifaire
(loi transverse n° 4 : une grille de prix est une donnée périssable). Aucun appel payant n'a
été passé ; aucun compte créé ; documentation publique seulement.

## Intention de l'utilisateur — validée le 01/09/2026 (loi n° 7)

Dans ses mots, verbatim (source : message de l'exploitant du 01/09/2026, réponse à D-1) :

> « Comment obtenir des données sur les recherches Google (ou autres moteurs de recherche)
> des utilisateurs des différentes langues du site, afin d'optimiser le SEO du site dans
> toutes les langues, améliorer le classement des résultats du site dans les moteurs de
> recherche pour être visible, faire en sorte que les utilisateurs cliquent sur le lien du
> site, et idéalement à terme, que les utilisateurs réservent leurs hébergements sur le
> site. »
> « Si la performance est réellement au rendez-vous, le budget peut être conséquent (1000 €/mois), mais si la performance est limitée, ciblons dans un premier temps 10 € à 20 €/mois. Tout dépend donc des résultats qu'on peut en obtenir. » *(source : même message du 01/09/2026)*

Lecture structurante : l'intention est un **entonnoir à trois marches** — être **visible**
(apparaître dans les résultats), être **cliqué** (transformer l'apparition en visite),
être **réservé** (transformer la visite en séjour) — décliné sur **toutes les langues du
site**, avec un **budget en escalier conditionné aux résultats mesurés**. Le verdict de
cette étude est donc un escalier de paliers avec critères de passage, pas un choix unique.
DataForSEO n'est plus le sujet : c'est un candidat parmi d'autres (« si d'autres outils ont
leurs pertinences, pour des budgets raisonnables, ils sont les bienvenus », même message).

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur deux critères : **objet durable** (un référentiel tarifaire multi-outils daté et
un escalier de paliers à maintenir), **noyau touché** (le garde-fou « aucune API tierce
payante hors modèles Claude » doit être confronté à chaque palier payant). L'étude est due.

## 0. Traitement des entrants

La demande instruite est une **donnée** : ses impératifs se citent, ne s'exécutent pas.
Sources : décision D-1 du 01/09 (intention validée, périmètre élargi) · cadrage v2
(`20260901-etude-dataforseo-cadrage-v2.md`) · étude 20260901a (annexe opérationnelle, faits
tarifaires DataForSEO du 01/09) · candidature TF-0741 · relevés Search Console du produit
(43 impressions, 0 clic, 13 requêtes, position moyenne 37, au 31/08/2026, source : candidature).

## 1. Partition du problème

Quatre partitions disjointes et exhaustives ; chaque option de la section 4 s'y rattache.

**P1 — La chaîne de l'entonnoir** : quelle donnée sert quelle marche. La marche « visible »
se travaille en amont (choisir les bonnes requêtes, par marché) ; la marche « cliqué » se
mesure sur données propriétaires (la Search Console est la seule source qui voie les clics
réels du site) ; la marche « réservé » échappe **par construction** aux outils de données de
recherche — elle se mesure dans le site lui-même (suivi de conversion), et l'étude le déclare
plutôt que de le laisser croire.

**P2 — Les familles de données** : ce que chaque type de donnée est, permet, et vaut à
l'échelle réelle du produit. C'est la couche pédagogique exigée par le cadrage — elle vit en
section 3, où chaque famille porte ses sources datées.

**P3 — Les canaux d'obtention** : gratuit propriétaire (consoles des moteurs), gratuit
tiers, à l'acte (API facturée à la requête), abonnement (suite SaaS). Le canal conditionne
le coût, l'intégration (secrets sur le runner seulement) et la gouvernance (R-29 : toute
dépense est un geste humain).

**P4 — L'économie en escalier** : la cible immédiate 10-20 €/mois et le plafond conditionnel
1000 €/mois (source : intention validée du 01/09) imposent des **critères de passage
mesurables** entre paliers — sans eux, une dépense récurrente ne s'arrête ni ne grandit
jamais pour de bonnes raisons.

## 2. Non-recouvrement contre l'existant

Ce chapitre vérifie que l'étude n'instruit rien qui existe déjà : chaque dispositif en place
est examiné, cité, et jugé recouvrant ou non.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Relevé Search Console hebdomadaire du produit | candidature TF-0741 : « relevé Search Console hebdomadaire exécuté par l'intégration continue, série JSON en ajout seul » | ne recouvre pas — il mesure la performance propre du site (marche « cliqué »), pas les volumes ni la concurrence en amont |
| Étude 20260901a (DataForSEO) | `20260901-etude-opportunite-dataforseo.md` §5 : « O2 — achat ponctuel borné » | recouvre la seule tarification DataForSEO — reprise ici comme annexe opérationnelle datée, non refaite |
| Étude d'outils SaaS du 30/08 | candidature TF-0741 : « les outils SaaS de suivi de position, facturés autour de trois chiffres par mois, ont été jugés disproportionnés » | recouvre partiellement — elle jugeait le prix face au budget, pas la valeur d'usage face à l'intention ; les paliers hauts sont rejugés ici contre le critère de performance du 01/09 |

## 3. État de l'art daté — les familles de données, expliquées, puis les outils et leurs prix

### 3.1 Les six familles — ce que c'est, ce qu'on envoie, ce qu'on reçoit, ce que ça permet

**F1 · Performance propriétaire** (Search Console de Google, Webmaster Tools de Bing).
Le moteur dit au site ce qu'il a vu de lui : pour chaque requête tapée par un internaute,
combien de fois le site est apparu (**impressions**), a été cliqué (**clics**), son taux de
clic (**CTR**, clics ÷ impressions) et son rang moyen (**position**). Donnée gratuite,
réelle, limitée au site lui-même. *Exemple réel* : les 13 requêtes nommées du produit, dont
ses 43 impressions de la fenêtre du 31/08. *Usage* : c'est la seule famille qui mesure les
marches « visible » et « cliqué » en vrai ; c'est elle qui rendra le verdict des paliers.
*Limite* : elle ne dit rien des requêtes sur lesquelles le site n'apparaît pas — donc rien
du potentiel.

**F2 · Volumes de recherche** (Keyword Planner de Google Ads, DataForSEO, suites SaaS).
Pour un mot-clé + un pays + une langue, combien de recherches par mois, la saisonnalité, et
ce que les annonceurs paient au clic (**CPC**). *Ce qu'on envoie* : une liste de mots-clés
et des couples pays-langue ; *ce qu'on reçoit* : un volume mensuel moyen et son historique.
*Exemple réel* : « location gîte mont saint michel » (FR) contre son équivalent allemand
« ferienhaus mont saint michel » (DE) — c'est exactement la donnée qui manque au plan de
campagnes (candidature : la Search Console « ne fournit pas » les volumes par pays et
langue). *Usage* : choisir les requêtes à travailler par marché AVANT d'écrire ou
d'acheter ; dimensionner les campagnes. *Limites* : sur les petits marchés, volumes
arrondis ou vides ; Keyword Planner sans dépense publicitaire ne rend que des **fourchettes
logarithmiques** (10-100, 100-1 000…), source : rankdots.com et blog.theseoengine.com,
consultés le 2026-09-01.

**F3 · SERP et positions** (page de résultats — *Search Engine Results Page* — relevée par
API ou par suite). Pour une requête + un pays, la liste ordonnée des résultats. *Usage
double* : suivre son propre rang dans le temps, et voir **qui occupe les places** — la
concurrence réelle, marché par marché (les plateformes de réservation ? des offices de
tourisme ? des gîtes voisins ?). *Valeur à l'échelle du produit* : le suivi récurrent du
rang est prématuré (position 37, hors de la zone pilotable des rangs 5-20 — doctrine de
l'étude 20260901a, reprise), mais la **photo ponctuelle** de qui est devant, par marché, a
une valeur d'apprentissage immédiate : elle dit contre quoi on joue et quel type de contenu
gagne.

**F4 · Idées de mots-clés et longue traîne** (suggestions dérivées d'un mot-clé de départ ;
la **longue traîne** = les requêtes rares mais nombreuses et précises, « gîte 8 personnes
proche mont saint michel avec cheminée »). *Usage* : nourrir le contenu des 203 pages en
7 langues avec les requêtes que le site ne couvre pas encore — à ce stade du produit, le
contenu est le levier principal, et c'est la famille la plus directement actionnable.
*Limite* : des suggestions sans volume fiable sur les petits marchés se trient à la main.

**F5 · Liens entrants** (« backlinks » : qui pointe vers le site ; les moteurs y lisent une
mesure de crédibilité). *Usage* : diagnostiquer pourquoi un concurrent est devant, repérer
les annuaires et offices de tourisme qui lient les concurrents et pas le produit. *Valeur
ici* : un diagnostic ponctuel oui ; un suivi récurrent non — le levier (obtenir des liens)
est un travail humain de relation, pas de mesure.

**F6 · Audit technique** (crawl du site : erreurs, vitesse, et surtout **hreflang** — le
balisage qui dit aux moteurs quelle page servir pour quelle langue). *Valeur ici* :
directement rattachée à « toutes les langues » de l'intention — un hreflang défaillant sur
203 pages × 7 langues ferait servir la mauvaise langue au mauvais marché. Un audit
ponctuel gratuit suffit (outils F1, ou offre gratuite pour son propre site — à vérifier le
jour de l'activation).

### 3.2 Les outils et leurs prix — relevés du 2026-09-01, sources secondaires datées 2026

La grille officielle de chaque éditeur devra être confrontée **le jour de l'achat** — qui
est un geste humain (R-29). Lignes en tableau ; conversions €/$ non faites (parité
approximative, l'ordre de grandeur tient).

| Outil | Canal | Familles couvertes | Prix relevé le 2026-09-01 | Source datée |
|---|---|---|---|---|
| Search Console (Google) | gratuit propriétaire | F1 | 0 € — déjà câblé au produit | candidature TF-0741 |
| Bing Webmaster Tools | gratuit propriétaire | F1, F2 partielle, F6 | 0 € — à vérifier à l'activation | doc publique Microsoft |
| Google Keyword Planner | gratuit (compte Ads) | F2 en fourchettes sans dépense | 0 € | rankdots.com, theseoengine.com, 2026 |
| DataForSEO | API à l'acte | F2, F3, F4, F5 | volumes 6 marchés ≈ 0,36 $/campagne ; 12 combinaisons ≈ 0,72 $ ; croisière ≈ 0,94 $/mois ; étendu ≈ 4,40 $/mois ; dépôt minimal 50 $ | étude 20260901a, relevé 2026-09-01 |
| SerpApi | API à l'acte | F3 | offre gratuite ≈ 250 recherches/mois (variable selon sources) | costbench.com, 2026-04 |
| Mangools (KWFinder) | abonnement | F2, F3, F4, F5 | Basic ≈ 29,90 $/mois (annuel), ≈ 49 $ (mensuel) | getspike.ai, capterra.com, 2026 |
| SE Ranking | abonnement | F2, F3, F4, F5, F6 | Core ≈ 129 $/mois (≈ 103 $ en annuel) — refonte des plans 2026-07 | propicked.com, gizmodo.com, 2026-07 |
| Ahrefs | abonnement | F2, F3, F4, F5, F6 | Starter ≈ 29 $/mois ; Lite ≈ 129 $/mois | clarorank.com, rankable.ai, 2026 |
| Semrush | abonnement | F2, F3, F4, F5, F6 | Pro ≈ 139,95 $/mois | demandsage.com, 2026 |

Ce que la grille dit d'elle-même (cf. tableau ci-dessus ; la cible 10-20 €/mois est celle
de l'intention du 01/09) : sous ce plafond, il n'existe que **trois voies** — le
gratuit propriétaire (F1), les fourchettes gratuites (F2 dégradée), et l'à-l'acte
(DataForSEO, régimes chiffrés sous 5 $/mois, cf. tableau ci-dessus, source : étude 20260901a).
Les suites démarrent à ≈ 30 $/mois et les complètes à ≈ 129-140 $/mois (cf. tableau ci-dessus)
— dans le plafond conditionnel de l'intention, hors de sa cible immédiate.

### 3.3 Les questions de périmètre, tranchées (exigence du cadrage v2)

- **Pourquoi 6 marchés et pas 7 ?** L'étude 20260901a comptait 6 marchés parce que la
  candidature en nommait 6, l'anglais étant « transverse » — sans trancher. Tranché ici :
  **l'anglais est un périmètre de mesure à part entière**, ancré sur **deux pays sources**
  (Royaume-Uni, États-Unis), car l'intention dit « toutes les langues du site » et une
  langue sans pays de mesure n'a ni volume ni position mesurables. Soit **8 combinaisons
  langue-pays** de mesure pour 7 langues. Surcoût à l'acte : marginal (la campagne
  12 combinaisons de l'étude 20260901a coûtait ≈ 0,72 $, source : relevé 2026-09-01).
  Alternative écartée : « monde anglophone » agrégé — volumes non localisables, inutilisables
  pour un plan de campagnes par pays.
- **Quelle profondeur de SERP ?** Le **top 20** pour le suivi futur (la zone pilotable est
  5-20 ; en dessous du rang 20, un mouvement ne se pilote pas) ; le **top 100 une seule
  fois** par marché pour la photo concurrentielle initiale (savoir qui occupe le terrain,
  même loin). Alternative écartée : top 10 — aveugle pour un site en position 37.
- **Quelle granularité géographique ?** Le **pays** d'abord : c'est la maille des volumes et
  du plan de campagnes. La maille locale (région, ville) ne se teste que sur la France, seul
  marché où le produit a des requêtes nommées. Alternative écartée : maille locale partout —
  volumes vides sur les petits marchés, coût sans donnée.
- **Quelle taille de jeu de mots-clés ?** Dérivée, pas plafonnée : les 13 requêtes nommées de
  la Search Console + les suggestions F4 triées → un jeu borné estimé à **50-150 mots-clés
  par langue**. « Jusqu'à 1 000 » (cf. étude 20260901a) est un plafond de facturation, pas un
  besoin. Alternative écartée : jeu massif — du volume de données sans capacité d'action
  éditoriale sur 203 pages.
- **Quelle cadence ?** **Par saison touristique** (4 campagnes de volumes par an, avant
  chaque fenêtre de réservation), pas par mois calendaire : le produit vit au rythme des
  vacances. Le suivi hebdomadaire des positions n'a de sens qu'au palier 2 (critères en
  section 5). Alternative écartée : mensualité uniforme — elle mesure plus souvent que le
  produit ne peut agir.

## 4. Options — jeu fermé O0-O4

Les options sont des **paliers cumulatifs** : chaque palier contient les précédents.

- **O0 — ne rien faire** (Search Console seule). Réfutée : la marche « visible » de
  l'intention reste aveugle en amont — la candidature le dit, « le plan de campagnes
  publicitaires attend des volumes de recherche par pays et par langue que la Search Console
  ne fournit pas ». Le statu quo coûte l'incapacité de choisir ses requêtes par marché.
- **O1 — palier 0 € : socle gratuit étendu** (cf. §3.2). Activer Bing Webmaster Tools
  (second moteur, données F1-F2 propres), un compte Google Ads sans dépense pour Keyword
  Planner (F2 en fourchettes), et un audit hreflang ponctuel (F6). Coût : 0 € (calculé —
  aucun abonnement), complexité simple × durée courte. Exclut : volumes précis par marché,
  photo concurrentielle outillée.
- **O2 — palier ≈ 1-5 $/mois amorti, dans la cible 10-20 €/mois : l'à-l'acte** (cf. étude
  20260901a ; cible : intention du 01/09). DataForSEO
  sur mandat humain par campagne : volumes sur 8 combinaisons langue-pays × 4 saisons
  (≈ 0,72 $ la campagne, source : étude 20260901a) ; photo SERP top 100 unique par marché ;
  idées F4 ponctuelles. Dépôt 50 $ = plafond de perte. Schéma d'intégration inchangé de
  l'étude 20260901a : secret sur le runner seulement, déclenchement humain (R-29), série en
  ajout seul, restitution dans la console existante. Exclut : suivi récurrent des positions,
  interface d'exploration.
- **O3 — palier ≈ 30-50 $/mois : première suite** (cf. §3.2). Mangools (ou équivalent) quand
  le suivi régulier des positions devient pilotable et qu'un humain explore les données
  chaque semaine. Exclut : audit technique continu, gros quotas.
- **O4 — palier ≈ 130-1000 €/mois : suite complète + budget d'acquisition** (cf. §3.2 ;
  plafond : intention du 01/09). Semrush, Ahrefs
  Lite ou SE Ranking Core, plus contenu et liens, quand les **réservations attribuées au
  canal organique** justifient l'investissement en euros réservés — le plafond de
  l'intention (source : message du 01/09) est conditionné à cette preuve. Exclut : rien
  fonctionnellement ; expose au coût récurrent le plus élevé, d'où son critère d'entrée.

## 5. Verdict

- **Option retenue** : O2 — l'escalier s'engage au palier à l'acte, socle gratuit O1 compris
  par construction, et ne monte que sur critères mesurés.
- **Critères de passage, datés et mesurables** (relevés sur la série Search Console
  existante) : **O2 → O3** quand 500 impressions/semaine OU ≥ 5 requêtes tenues 4 semaines
  consécutives entre les rangs 5 et 20 (seuils repris de l'étude 20260901a, rattachés ici à
  la marche « visible ») ; **O3 → O4** quand des réservations attribuées au canal organique
  sont mesurées sur deux saisons consécutives — un critère en séjours réservés, pas en
  rangs, conformément à la marche finale de l'intention.
- **Coût** : O1 complexité simple × durée courte ; O2 complexité simple × durée courte par
  campagne (un appel, un fichier, une ligne au référentiel tarifaire) ; O3-O4 complexité
  moyenne × durée moyenne (choix d'outil à re-confronter aux grilles du jour, péremption
  2026-10-01 dépassée d'ici là).
- **Candidature(s) émise(s)** : aucune — mandat direct de l'exploitant du 01/09 (D-1).
- **Plan de revue : 2026-10-01** (péremption tarifaire — rejouer la section 3.2 avant tout
  achat) puis **2026-12-01** (première revue de performance : les critères O2 → O3 sur la
  série réelle).
- **Test rétro** : joué en section 6 — chaque élément opérationnel remonte à l'intention.

## 6. Test rétro (RT1-RT6 du cadrage v2)

- **RT1 — intention citée et validée** : verbatim en tête, validée le 01/09 (D-1). PASS.
- **RT2 — remontée sans rupture** : volumes 8 combinaisons (opérationnel) → choisir les
  requêtes par marché (tactique F2) → marche « visible » sur toutes les langues (stratégie)
  → intention. Photo SERP top 100 → connaître la concurrence (F3) → « améliorer le
  classement » → intention. Audit hreflang → servir la bonne langue (F6) → « toutes les
  langues » → intention. Critère O3 → O4 en réservations → marche « réservé » → intention.
  Suivi récurrent des positions : NE remonte PAS aujourd'hui (position 37 hors zone
  pilotable) → différé au palier 2, avec critère. Backlinks en suivi récurrent : ne remonte
  pas → écarté, diagnostic ponctuel seulement. PASS — deux éléments retirés par la remontée.
- **RT3 — chaque nombre justifié avec alternative écartée** : section 3.3 (8 combinaisons,
  top 20/top 100, maille pays, 50-150 mots-clés, 4 campagnes/an). PASS.
- **RT4 — les sept questions du retour du 01/09, rejouées** : « ce qu'on peut faire avec ces
  outils » → §3.1 usages par famille · « les datas qu'ils permettent de récolter » → §3.1
  envoyé/reçu par famille · « pour quels usages » → §3.1 et P1 · « avec quels intérêts » →
  §3.1 valeur à l'échelle réelle, intérêt ET non-intérêt · « pourquoi 6 marchés et pas 7 » →
  §3.3 (tranché : 8 combinaisons) · « quelles profondeurs » → §3.3 (top 20 / top 100
  unique) · « quels périmètres » → §3.3 (maille pays, jeu 50-150, cadence saisonnière).
  PASS — sept sur sept.
- **RT5 — glose au premier emploi** : CTR, CPC, SERP, longue traîne, backlinks, hreflang
  glosés à leur première apparition. PASS.
- **RT6 — verdict libre** : le GO conditionnel unique de l'étude 20260901a est **amendé** en
  escalier de paliers avec deux critères de passage — la v1 ne préjugeait pas, et le
  périmètre élargi a changé la forme du verdict. PASS.

## Modes d'échec nommés (exigence de la candidature, maintenue)

Ce que l'étude ne peut pas savoir : la fiabilité réelle des volumes sur les petits marchés
(signal : deux campagnes successives incohérentes du simple au triple) ; la dérive des
grilles tarifaires (signal : plan de revue du 2026-10-01) ; l'attribution des réservations
au canal organique sans suivi de conversion câblé (signal : critère O3 → O4 inapplicable —
la parade est un suivi de conversion côté produit, hors du périmètre des outils étudiés et
à traiter comme exigence produit).
