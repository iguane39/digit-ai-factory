# Étude d'opportunité — entrée de DataForSEO dans le dispositif de mesure de Produit-02 — 20260902a

Audience : l'exploitant de Produit-02, qui décide d'ouvrir ou non le robinet de dépense, et
le pilot, qui garde le garde-fou de noyau. Le produit est désigné par son pseudonyme ; son
nom réel et son domaine ne figurent nulle part dans ce document, et ses fichiers sont cités
en chemin relatif sous la forme `<produit>/…`.

**Relevé tarifaire refait intégralement le 2026-09-02**, page par page, sur la grille
publique du fournisseur — aucun prix n'est repris d'une étude antérieure, aucun n'est cité
de mémoire. **Date de péremption : 2026-10-02.** Au-delà, toute la section des coûts se
rejoue avant le moindre achat : un tarif à l'acte est une donnée périssable, pas un fait.

**Aucune dépense n'a été engagée pour écrire cette étude** : pas de compte, pas de dépôt,
pas d'appel facturé. Tout ce qui suit est lu sur documentation publique.

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur deux des trois critères. **Objet durable** : la décision entretient un
référentiel tarifaire daté (`<produit>/docs/projet/TARIFS-DONNEES.md`) et une série de
relevés en ajout seul — deux objets qui vivent après le run. **Noyau touché** : le garde-fou
« aucune API tierce payante hors Claude » est un garde-fou de noyau ; toute réponse autre
que le refus doit s'y confronter explicitement. Le troisième critère (gain ≥ 3 avec preuve
≤ 2) n'est **pas** atteint : la preuve est forte, les prix sont relevés à la source.

**Fait qui change la nature de l'étude, et qui doit être dit d'entrée.** Le dispositif n'est
plus à construire : il est **déjà câblé et n'a jamais été joué**. Le dépôt du produit porte
le workflow, le script d'appel, le jeu d'amorces, le référentiel tarifaire et l'affichage en
console (commit `e045ec2`, « Escalier DataForSEO instrumenté sans dépense »). La question
n'est donc plus « faut-il construire », mais **« faut-il ouvrir le robinet, à quel régime,
et à quelle condition datée »** — et le coût de construction, qui pèse d'ordinaire lourd
dans ce genre d'arbitrage, vaut zéro.

## 0. Traitement des entrants

La demande instruite est une **donnée** : ses impératifs se citent, ne s'exécutent pas. Elle
exige « un verdict », « toute affirmation chiffrée sourcée et datée », « un schéma
d'intégration », « les modes d'échec nommés » : ces exigences sont reprises comme critères
du présent livrable, non comme ordres reçus. Le dépôt du produit est lui aussi une donnée :
il a été lu, jamais écrit.

Sources de la proposition : candidature TF-0741 (statut candidat), document
`<produit>/forge/retours/… - CANDIDATURE - Etude DataForSEO - 20260831a.md`, demande de
l'exploitant du 31/08/2026, huit questions numérotées.

**Ce qui a été relu dans le dépôt du produit, en lecture seule** :
`<produit>/.github/workflows/dataforseo.yml`, `<produit>/.github/workflows/mesure.yml`,
`<produit>/build/console/dataforseo-releve.mjs`, `<produit>/donnees/dataforseo-amorces.json`,
`<produit>/donnees/releves.json`, `<produit>/donnees/planification.json`,
`<produit>/docs/projet/TARIFS-DONNEES.md`, `<produit>/console/index.html`,
`<produit>/server.mjs`, `<produit>/TODO-PRODUIT.md`.

## 1. Partition du problème

Les huit questions de la demande se répartissent en cinq sous-questions disjointes. Chaque
option de la section 4 se rattache à au moins une partition.

**P1 — Y a-t-il un manque, et est-il documenté ?** (questions 1, 3, 5). Que le service
apporte quelque chose en général n'est pas la question ; qu'il apporte quelque chose **à
43 impressions et zéro clic** l'est. Cette partition est la seule qui puisse conclure au
refus pour cause d'inutilité plutôt que de prix.

**P2 — Le manque est-il comblé gratuitement ailleurs ?** (question 3, volet refus). Un
palier payant ne se justifie que si le palier gratuit a été épuisé et que sa limite est
nommée. Cette partition instruit le socle sans dépense avant tout achat.

**P3 — L'intégration tient-elle l'architecture ?** (questions 2, 6). Trois contraintes non
négociables : secrets sur le runner seulement, série en ajout seul, restitution dans la
console existante. Cette partition dit si le service s'y plie — et ici, elle constate.

**P4 — Que coûte chaque régime, contre quel étalon ?** (question 8, plus le garde-fou de
noyau). Deux verrous distincts : le prix rapporté au budget publicitaire de référence, et
l'autorisation d'exécuter un service tiers payant. Le second peut bloquer alors que le
premier passe.

**P5 — À quoi reconnaît-on que ça marche, et à quoi reconnaît-on qu'il faut couper ?**
(questions 4, 7). Une dépense récurrente sans critère d'arrêt écrit ne s'arrête jamais.
Cette partition produit le rendez-vous avec les faits qui figure au verdict.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Relevé Search Console du produit | `<produit>/donnees/releves.json`, relevé du 2026-08-31 : `"impressions":43, "clics":0, "position_moyenne":37.3, "requetes_distinctes":13` | **recouvre partiellement** — donne la performance du site lui-même, et rien du marché |
| Anonymisation des requêtes rares par Google | `<produit>/donnees/releves.json` : `"impressions_totales":43, "impressions_nommees":18, "impressions_masquees":25` | **ne recouvre pas** — 58 % des impressions sont masquées par la source gratuite ; ce trou est structurel, il ne se comble pas en attendant |
| Cadence du relevé gratuit | `<produit>/donnees/planification.json` : `{"cadence":"hebdomadaire","jour":1}` lue par `.github/workflows/mesure.yml` | **recouvre** — la cadence est déjà pilotée par une donnée, pas par un workflow ; rien à réinventer pour un second relevé |
| Workflow de campagne payante | `<produit>/.github/workflows/dataforseo.yml` : `on: workflow_dispatch` seul, en-tête « DÉCLENCHEMENT HUMAIN UNIQUEMENT : pas de `schedule` ici, et il ne doit jamais y en avoir » | **recouvre** — le canal d'appel existe déjà et est conforme à R-29 |
| Script d'appel et garde-fou de dépense | `<produit>/build/console/dataforseo-releve.mjs` : `if (estimation > PLAFOND_USD) quitter(2, 'REFUS…')` et refus sur `TARIF.perime_le` dépassé | **recouvre** — l'estimation hors réseau et le double refus (plafond, tarif périmé) sont câblés |
| Série de relevés payants | `<produit>/build/console/dataforseo-releve.mjs` : `await appendFile(SERIE, JSON.stringify({…}) + '\n')` vers `donnees/dataforseo-releves.jsonl` | **recouvre** — l'ajout seul est tenu par construction, aucune ligne n'est jamais réécrite |
| Restitution en console | `<produit>/console/index.html` l. 428 et 926 : `<div id="table-dataforseo">` et `var serie = (etat.donnees && etat.donnees.dataforseo) || []` ; `<produit>/server.mjs` l. 248 : `readFile(path.join(DONNEES, 'dataforseo-releves.jsonl'))` | **recouvre** — l'affichage est câblé et dégrade proprement sur série absente |
| Jeu d'amorces par marché | `<produit>/donnees/dataforseo-amorces.json` : 8 combinaisons langue-pays, 3 amorces chacune, `"_codes_localisation"` documenté | **recouvre** — la matière de la première campagne est écrite et motivée marché par marché |
| Référentiel tarifaire du produit | `<produit>/docs/projet/TARIFS-DONNEES.md` : « DataForSEO — relevé du 2026-09-01, péremption 2026-10-01 », ligne « Liens entrants (backlinks) — **non relevé** » | **recouvre partiellement** — le référentiel existe mais laisse trois familles non chiffrées ; la présente étude les relève |
| Actions humaines en attente | `<produit>/TODO-PRODUIT.md` : T-96 (créer les secrets), T-97 (dépôt minimal 50 $), T-98 (déclencher la première campagne), tous « à faire » | **recouvre** — rien n'a encore été dépensé ; le robinet est posé et fermé |
| Garde-fou du noyau | `CLAUDE.md`, section Garde-fous : « Aucune API tierce payante hors Claude ; les `.env` ne transitent jamais » | **recouvre** — contrainte opposable, pas capacité : elle borne la forme de toute réponse positive |
| Règle R-29 alinéa 3 | `REGLES-PROJET.md` l. 243-246 : « L'exécution d'un service tiers payant exige un GO humain préalable — le garde-fou "aucune API tierce payante hors modèles Claude" prime toujours sur R-29 » | **recouvre** — impose que l'appel payant soit déclenché par un humain, jamais par un agent ni par un planificateur |
| Socle gratuit non encore activé | `<produit>/TODO-PRODUIT.md`, T-103 : « Activer Bing Webmaster Tools — étape gratuite du socle de données de recherche (TF-0741, geste 2) », statut « à faire » | **ne recouvre pas** — le palier gratuit n'est pas épuisé ; c'est le principal argument contre une ouverture large aujourd'hui |

**Ce que la table établit.** Trois choses, et elles orientent tout le reste. **Un** : le
manque est réel et mesuré chez le produit — 25 impressions sur 43 sont masquées par la
source gratuite, et aucun volume de marché n'en sort. **Deux** : l'intégration n'est pas à
faire, elle est faite, conforme aux trois contraintes d'architecture, et jamais jouée. Le
coût d'entrée est donc réduit au seul dépôt. **Trois** : une marche gratuite du socle reste
ouverte (T-103), ce qui interdit de conclure à autre chose qu'à un palier minimal.

## 3. État de l'art daté

Vingt sources, toutes consultées **le 2026-09-02**, page par page, sur les sites publics du
fournisseur et de la Banque centrale européenne. Aucun prix n'a été payé, aucun n'a été
repris d'un relevé antérieur. Les localisateurs sont donnés en clair pour être rejoués.

### 3.1 Grille tarifaire du fournisseur, relevée le 2026-09-02

| # | Poste | Tarif relevé le 2026-09-02 | Localisateur |
|---|---|---|---|
| 1 | Modèle et dépôt minimal | « pay-as-you-go pricing model » ; « The minimum payment amount is $50 » | `dataforseo.com/pricing` |
| 2 | SERP Google Organic | file standard 0,0006 $ / SERP (0,60 $ le mille, ≈ 5 min) · file prioritaire 0,0012 $ (1,20 $ le mille, ≤ 1 min) · mode direct 0,002 $ (2 $ le mille, ≤ 6 s) ; « One SERP contains 10 search engine results » | `dataforseo.com/pricing/serp/google-organic-serp-api` |
| 3 | SERP Google Maps | standard 0,0006 $ · prioritaire 0,0012 $ · direct 0,002 $ ; une page = **100** résultats | `dataforseo.com/pricing/serp/google-maps-serp-api` |
| 4 | Keywords Data / Google Ads | file standard 0,06 $ par tâche (délai de 1 à 3 h) · mode direct 0,09 $ par tâche (≈ 7 s) ; maximum 1000 mots-clés par tâche, prix indépendant de leur nombre | `dataforseo.com/pricing/keywords-data/google-ads` |
| 5 | DataForSEO Labs (Google) | 0,012 $ par tâche + 0,00012 $ par élément rendu ; *Historical Rank* 0,12 $ + 0,0012 $ par élément ; *Historical SERPs* 0,00012 $ l'unité ; `include_clickstream_data` « multiplies the cost of the request by 2 » | `dataforseo.com/pricing/dataforseo-labs/dataforseo-google-api` |
| 6 | Backlinks | 0,024 $ par requête + 0,000036 $ par ligne (0,06 $ les mille lignes), jusqu'à 1000 lignes par requête | `dataforseo.com/pricing/backlinks/backlinks` |
| 7 | OnPage | 0,00015 $ par page explorée (0,15 $ les mille) ; suppléments par page : ressources 0,00045 $ · JavaScript 0,0015 $ · rendu navigateur 0,0051 $ · densité de mots-clés 0,0003 $ · pages instantanées 0,00015 $ · capture d'écran 0,0048 $ | `dataforseo.com/pricing/on-page/onpage-api` |
| 8 | OnPage, page d'aide sur les paramètres | base 0,00015 $ ; `load_resources` 0,0003 $ · `enable_javascript` 0,00135 $ · `enable_browser_rendering` 0,00495 $ · `calculate_keyword_density` 0,00015 $ | `dataforseo.com/help-center/cost-of-onpage-api-parameters` |
| 9 | Business Data / avis Google | standard 0,00075 $ les 10 avis (75 $ le million, ≤ 45 min) · prioritaire 0,0015 $ les 10 avis (150 $ le million, ≤ 1 min) ; endpoint étendu : `keyword` ajoute 0,0015 $ par tâche, `place_id` et `cid` 0,00075 $ chacun | `dataforseo.com/pricing/business-data/google-reviews-api` |
| 10 | Business Data / fiche d'établissement | standard 0,0015 $ par fiche (1,50 $ le mille, ≤ 45 min) · prioritaire 0,003 $ (3 $ le mille, ≤ 1 min) | `dataforseo.com/pricing/business-data/business-data-api` |
| 11 | Content Analysis | 0,024 $ par requête + 0,000036 $ par ligne (0,06 $ les mille lignes) | `dataforseo.com/pricing/content-analysis` |
| 12 | Domain Analytics / Whois | 0,12 $ par tâche + 0,0012 $ par élément | `dataforseo.com/pricing/domain-analytics-api/domain-analytics-whois-api` |
| 13 | AI Optimization / volume de recherche IA | 0,01 $ par tâche + 0,0001 $ par élément (110 $ le million) ; « The AI search volume values are calculated using statistical data from questions in the *People Also Ask* SERP element » | `dataforseo.com/pricing/ai-optimization/ai-keyword-search-volume` |
| 14 | Dépôt minimal, expiration du solde, essai | « Our minimum payment amount is $50 » ; « once you top up your account, the funds will remain on your balance until you spend all of them » ; « register now and get $1 for free unlimited testing of our service » | `dataforseo.com/help-center/minimum-payment` |
| 15 | Essai, limites, disponibilité | « you'll get access to the free Sandbox feature and receive the free trial $1 credit on your balance » ; « No, funds on your account won't disappear » ; « 2000 calls per minute », relevable sur demande ; « 99.95% uptime » | `dataforseo.com/faq` |

### 3.2 Documentation technique, consultée le 2026-09-02

| # | Objet | Ce qui est établi | Localisateur |
|---|---|---|---|
| 16 | Volume de recherche Google Ads | maximum 1000 mots-clés par requête ; `search_volume` mensuel plus `monthly_searches` sur 12 mois et plus ; valeur explicitement **approximative** ; « Google Ads provides combined search volume values for groups of similar keywords » ; « if there is no data then the value is `null` » ; le mois courant n'est jamais rendu | `docs.dataforseo.com/v3/keywords_data/google_ads/search_volume/live/` |
| 17 | Idées de mots-clés à partir d'amorces | « The maximum number of keywords you can specify: **20** » ; jusqu'à 20 000 suggestions rendues ; « Your account will be charged for each request, no matter what number of keywords you receive in the result » ; l'exemple de réponse porte `"cost": 0.075` | `docs.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live/` |
| 18 | Pose de tâche SERP | « Your account will be billed per each SERP containing up to 10 results » ; `depth` par défaut 10, maximum 700 ; deux niveaux de priorité, le second facturé davantage | `docs.dataforseo.com/v3/serp/google/organic/task_post/` |
| 19 | Référentiel des localisations | « Your account will not be charged for using this API », `"cost": 0` ; 94 933 localisations, codes de niveau pays disponibles ; localisations de Russie et de Biélorussie retirées du service | `docs.dataforseo.com/v3/keywords_data/google_ads/locations/` |
| 20 | Taux de change de référence | EUR/USD = **1,1590**, taux de référence de la Banque centrale européenne daté du **2026-09-01** (dernier publié à l'heure de la consultation, le 2026-09-02) — soit 1 USD = 0,8628 EUR | `www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml` |

### 3.3 Ce que le relevé du jour corrige ou ajoute par rapport au référentiel du produit

Le relevé n'a pas été recopié : il a été refait, et il ne rend pas exactement ce que le
référentiel embarqué du produit contient. Quatre écarts, tous vérifiables aux localisateurs
ci-dessus.

**A. Trois familles chiffrées pour la première fois.** `<produit>/docs/projet/TARIFS-DONNEES.md`
porte la ligne « Liens entrants (backlinks) — **non relevé** ». Elle est désormais relevée
(source 6), de même que OnPage (7), les avis et fiches d'établissement (9, 10), Content
Analysis (11), Domain Analytics (12) et le volume de recherche IA (13). Le refus motivé de
la section 3 bis s'appuie sur des prix, plus sur une absence de prix.

**B. Un crédit d'essai de 1 $, qui change l'ordre des gestes.** Deux pages du fournisseur
(14, 15) annoncent un crédit d'essai de 1 $ porté au solde à l'inscription. La campagne
« explorer large » du produit est estimée à 0,72 $ par son propre script. **Elle tient donc
sous le crédit d'essai**, et la première campagne peut être jouée **avant tout dépôt**. Ce
que la documentation ne dit pas, et qui reste à constater à l'inscription : si ce crédit est
utilisable sur les points d'entrée de production ou seulement sur le bac à sable annoncé
dans la même phrase. Cette incertitude est nommée, elle n'est pas arbitrée ici.

**C. Deux prix publiés par le fournisseur pour le même appel.** La page de tarif de la
famille Google Ads annonce 0,09 $ par tâche en mode direct (4) ; l'exemple de réponse de
l'endpoint effectivement appelé par le produit porte `"cost": 0.075` (17). Les deux
proviennent du fournisseur, le même jour. L'estimation embarquée du produit retient 0,09 $ :
elle **sur-estime**, ce qui est le bon sens de l'erreur pour un garde-fou de dépense. L'écart
se tranchera au premier appel réel, dont le montant facturé est lu dans la réponse et versé
à la série.

**D. Une limite d'amorces plus étroite que ce que le produit suppose.** L'en-tête du script
et le jeu d'amorces parlent de « jusqu'à 1000 idées rendues par tâche ». La documentation de
l'endpoint appelé dit autre chose (17) : **20 amorces au maximum en entrée**, jusqu'à 20 000
suggestions en sortie. Le plafond de 1000 est celui d'un **autre** endpoint, celui du volume
de recherche sur liste fermée (16). Le jeu d'amorces du produit en emploie 3 par marché : la
contrainte n'est pas atteinte et rien ne casse — mais le commentaire est faux, et un
commentaire faux sur un garde-fou de dépense se corrige.

## 3 bis. Les huit questions, tranchées

### (1) INTÉRÊT — ce que DataForSEO apporte que Search Console n'apporte pas

Apport par apport, à l'échelle mesurée du 2026-08-31 (43 impressions, 0 clic, 13 requêtes
nommées, position moyenne 37,3).

| Apport revendiqué | Valeur à l'échelle actuelle | Verdict |
|---|---|---|
| Volume de recherche absolu par pays et par langue | La source gratuite n'en donne aucun, par construction : elle mesure le site, pas le marché. Le plan de campagnes publicitaires en dépend, et le compte publicitaire n'existe pas encore | **retenu, immédiat** |
| Vocabulaire réel des marchés non francophones | 25 impressions sur 43 sont masquées par l'anonymisation des requêtes rares ; 7 marchés sur 8 n'ont quasiment aucune requête nommée | **retenu, immédiat** |
| Saisonnalité sur 12 mois glissants (`monthly_searches`) | Le produit est saisonnier ; la source gratuite ne porte que 6 jours actifs sur la fenêtre relevée | **retenu, immédiat** |
| Position sur un jeu de requêtes borné, y compris hors de la fenêtre Search Console | La position mesurée est de 37,3 en moyenne et va de 21,7 à 44,3 sur cinq jours consécutifs ; la doctrine du produit ne la déclare pilotable qu'entre les rangs 5 et 20 | **retenu, après seuil** |
| Veille concurrentielle locale (qui occupe le pack local) | Aucune donnée de position exploitable tant que le produit n'est pas dans la bande pilotable ; l'information serait vraie et sans conséquence | **retenu, après seuil** |
| Liens entrants, audit technique, avis, analyse de contenu | Le produit dispose déjà d'un audit technique interne et d'une capture pleine page par page auditée (commit `df6e90b`) ; aucun de ces axes n'est le facteur limitant à 0 clic | **superflu à cette échelle** |
| Volume de recherche « IA » | Le fournisseur écrit lui-même qu'il s'agit d'une statistique dérivée des questions du bloc *People Also Ask* (13), pas d'une mesure d'usage des moteurs génératifs | **superflu — la donnée ne mesure pas ce que son nom annonce** |

### (2) UTILISATION — canal, fréquence, solde, squelette du flux

Le canal existe et n'a pas à être conçu. Il est décrit au §3 bis (schéma d'intégration).
Fréquence retenue : **trimestrielle, sur mandat humain**, jamais planifiée. Gestion du
solde : dépôt unique, jamais de rechargement automatique, le solde faisant office de plafond
de perte en cas de fuite du secret ; le solde n'expire pas (14, 15), donc rien ne pousse à
consommer. Un plafond de dépense par campagne est passé en entrée du workflow (défaut 2 $)
et le script refuse au-delà.

### (3) SERVICES — ce qui sert, ce qui ne sert pas, refus motivés

**Retenus.** *Keywords Data / Google Ads*, endpoint d'idées à partir d'amorces (0,09 $ par
tâche au tarif de la page, 0,075 $ à l'exemple documenté) : c'est le seul service qui répond
au manque établi en P1. *Référentiel des localisations* (gratuit, source 19) : à appeler
avant la première campagne pour confronter les 8 codes du jeu d'amorces à la liste réelle —
une vérification à coût nul qui écarte un mode d'échec entier.

**Retenus sous seuil, non ouverts aujourd'hui.** *SERP Google Organic* en file standard
(0,0006 $ par page de 10 résultats) : le suivi de position, à ouvrir quand la position entre
dans la bande pilotable. *SERP Google Maps* (0,0006 $ la page de 100 résultats) : veille
locale, même seuil.

**Refusés, avec leur motif et leur prix.** *Backlinks* (0,024 $ + 0,000036 $ la ligne) : le
facteur limitant à 0 clic n'est pas l'autorité de domaine mais l'absence de présence sur les
requêtes de marché ; acheter la mesure d'un levier qu'on ne compte pas actionner est une
dépense sans décision au bout. *OnPage* (0,00015 $ la page, 0,0015 $ de plus avec JavaScript) :
le produit est un site statique de 203 pages avec son propre audit technique et sa capture
par page ; le service doublonnerait un outillage déjà payé une fois pour toutes. *Content
Analysis* (0,024 $ + 0,000036 $ la ligne) et *Domain Analytics* (0,12 $ + 0,0012 $) : aucun
objectif du produit ne s'y rattache — critère (4) appliqué, un service sans objectif est
écarté. *Business Data / avis et fiches* (0,00075 $ les 10 avis, 0,0015 $ la fiche) : les
avis du produit vivent chez ses plateformes de réservation et lui sont déjà accessibles sans
intermédiaire ; le service n'apporterait que les avis des **concurrents**, ce qui relève de
la veille et retombe sous le même seuil que le suivi de position. *AI Optimization* (0,01 $
+ 0,0001 $) : refusé sur la nature de la donnée, pas sur le prix — voir question (1).

### (4) OBJECTIFS — chaque service rattaché à un objectif existant

| Service | Objectif existant du produit | Décision |
|---|---|---|
| Idées de mots-clés par marché (Google Ads) | Plan de campagnes publicitaires, à écrire **avant** la création du compte publicitaire | **ouvert** |
| Référentiel des localisations (gratuit) | Fiabilité du relevé ci-dessus | **ouvert** |
| SERP Google Organic, jeu borné | Suivi de position, déclaré non pilotable hors de la bande des rangs 5 à 20 | **différé, seuil écrit en (6)** |
| SERP Google Maps | Veille concurrentielle locale | **différé, même seuil** |
| Backlinks, OnPage, Content Analysis, Domain Analytics, avis, volume IA | *aucun objectif rattaché* | **écartés** |

### (5) DONNÉES — envoyées, reçues, précision, fraîcheur, limites par marché

**Envoyé** : les amorces du marché en clair, un code de localisation, un code de langue.
Rien de personnel, rien de secret, aucune donnée du site ni de ses clients.
**Reçu** : mot-clé, volume mensuel, coût par clic, indice de concurrence, et la série
`monthly_searches` sur 12 mois et plus.

**Précision — trois limites nommées par le fournisseur lui-même** (source 16). Un : la
valeur est déclarée **approximative**. Deux : « Google Ads provides combined search volume
values for groups of similar keywords » — plusieurs requêtes proches partagent une même
valeur agrégée, ce qui interdit d'arbitrer entre deux formulations voisines sur leur seul
écart de volume. Trois : « if there is no data then the value is `null` ».

**Fraîcheur** : le mois courant n'est jamais rendu ; la donnée la plus fraîche est celle du
mois clos. Une cadence plus rapide que mensuelle n'a donc aucun sens sur cette famille — ce
qui, à soi seul, condamne toute idée de suivi hebdomadaire des volumes.

**Limite par marché, et c'est le point dur de cette étude.** Sur des marchés de la taille de
ceux du produit, la réponse attendue n'est pas un chiffre bas : c'est **`null`**, ou une
valeur agrégée de groupe. Le script du produit le prévoit déjà et consigne la réponse vide
telle quelle. **La valeur réelle des volumes sur les micro-marchés du produit est donc, à ce
jour, inconnue et non déterminable sur documentation** : elle se constate au premier appel,
pour 0,72 $ au plus, et le résultat « pas de donnée » est lui-même un résultat exploitable —
il déplace le plan de campagnes vers les requêtes larges plutôt que vers la longue traîne.
C'est cette incertitude, et non le prix, qui justifie de commencer petit.

### (6) SUIVIS — ce qui entre dans la série, à quelle cadence, et le critère de bascule

**Entre dans la série** : la campagne de volumes, en ajout seul, dans
`<produit>/donnees/dataforseo-releves.jsonl`, **cadence trimestrielle**, chaque ligne
portant sa date, son statut, le nombre de mots-clés rendus et le montant réellement facturé.

**Reste ponctuel** : tout le reste — un audit technique, un relevé de liens entrants, une
photographie concurrentielle ne se jouent que sur décision, jamais par battement.

**Le critère qui fait basculer un relevé ponctuel en suivi**, et sa réciproque :

> Un relevé devient un suivi quand **deux conditions** sont réunies : la valeur mesurée
> bouge plus vite que la décision qu'elle informe, **et** une décision a effectivement été
> prise sur sa variation au moins une fois. Un suivi redevient ponctuel dès que **deux
> relevés consécutifs n'ont changé aucune décision**.

Appliqué aux données du produit. *Volumes* : la source ne bouge qu'au mois (source 16) et la
décision de plan de campagnes se prend au trimestre — la première condition n'est pas
remplie, donc **ponctuel trimestriel**, et non suivi. *Position* : elle bouge au jour
(21,7 à 44,3 sur cinq jours consécutifs, série du 2026-08-31) mais aucune décision n'est
prise sur sa variation tant qu'elle reste hors de la bande des rangs 5 à 20 — la seconde
condition n'est pas remplie, donc **ni ponctuel ni suivi payant** aujourd'hui.

**Seuil de bascule de la position, écrit et mesurable** : la position moyenne du produit
passe sous 20 sur **trois relevés hebdomadaires consécutifs** de la série gratuite. Ce seuil
est vérifiable sans dépense, sur une série déjà câblée.

### (7) RÉSULTATS — succès à 3 et 6 mois, et critère d'arrêt symétrique

**À 3 mois — rendez-vous du 2026-12-02.** Quatre indicateurs observables : la campagne de
volumes a été jouée au moins une fois ; au moins 4 des 8 combinaisons langue-pays rendent au
moins 50 mots-clés avec un volume non nul ; un plan de campagnes publicitaires écrit cite au
moins 10 volumes avec leur source et leur date ; la dépense cumulée reste sous 3 $.

**À 6 mois — rendez-vous du 2027-03-02.** Deux campagnes jouées ; le compte publicitaire est
créé, ou son abandon est motivé par écrit ; au moins une décision d'allocation de budget
publicitaire cite un volume relevé ; la série gratuite montre des clics strictement positifs
sur au moins une semaine ; la dépense cumulée reste sous 6 $.

**Critère d'arrêt symétrique.** Si, au rendez-vous des 6 mois, **aucune décision
d'acquisition n'a cité un volume relevé**, la dépense est coupée : les secrets sont révoqués,
le solde n'est pas rechargé, le workflow reste au dépôt en l'état et son en-tête consigne la
date d'arrêt et le motif. Le même geste s'applique par anticipation si deux campagnes
consécutives rendent moins de 4 combinaisons exploitables : la donnée n'existe pas à cette
échelle, et le constater est un résultat qui vaut le prix payé pour l'obtenir.

### (8) COÛTS — trois régimes chiffrés, confrontés à la grille du 2026-09-02

Conversion : **1 EUR = 1,1590 USD**, taux de référence de la Banque centrale européenne daté
du 2026-09-01, lu le 2026-09-02 (source 20) — soit 1 USD = 0,8628 EUR. L'USD est conservé à
côté de chaque montant : c'est la devise de facturation, l'euro n'est qu'une lecture.

**Hypothèse de profondeur, qui pèse plus que tous les prix unitaires.** La facturation SERP
se fait « per each SERP containing up to 10 results » (18). Le produit se situe autour du
rang 37 et jusqu'au rang 69 sur certaines requêtes de sa série : le voir exige une profondeur
de 100, soit **10 pages facturées par requête**, non une. Un chiffrage à profondeur par
défaut serait faux d'un facteur dix. Cette hypothèse est celle des régimes croisière et
étendu ci-dessous.

**Régime minimal — volumes seuls, trimestriels.**

| Poste | Calcul | USD/mois | EUR/mois |
|---|---|---|---|
| Campagne de volumes, 8 combinaisons, mode direct | 8 × 0,09 $ = 0,72 $ par campagne, 4 par an | 0,24 | 0,21 |
| Référentiel des localisations | gratuit (source 19) | 0,00 | 0,00 |
| **Total** | | **0,24** | **0,21** |

Variante au prix documenté à l'endpoint (0,075 $) : 0,60 $ par campagne, soit 0,20 $/mois.

**Régime croisière — volumes trimestriels, position mensuelle bornée, veille locale
trimestrielle.**

| Poste | Calcul | USD/mois | EUR/mois |
|---|---|---|---|
| Campagne de volumes, trimestrielle | 0,72 $ ÷ 3 | 0,24 | 0,21 |
| Position, 20 requêtes × 6 marchés, mensuelle, profondeur 100 | 120 × 10 × 0,0006 $ | 0,72 | 0,62 |
| Veille locale, 6 requêtes trimestrielles (Maps, 100 résultats) | 6 × 0,0006 $ ÷ 3 | 0,001 | 0,001 |
| Fiches d'établissement concurrentes, 10 par trimestre | 10 × 0,0015 $ ÷ 3 | 0,005 | 0,004 |
| **Total** | | **0,97** | **0,83** |

**Régime étendu — tout ce que le catalogue offre d'utile, cadence resserrée.**

| Poste | Calcul | USD/mois | EUR/mois |
|---|---|---|---|
| Volumes, mensuels | 8 × 0,09 $ | 0,72 | 0,62 |
| Position, 120 requêtes hebdomadaires, profondeur 100 | 120 × 10 × 0,0006 $ × 4,33 | 3,12 | 2,69 |
| Labs, 6 tâches d'idées de 1000 éléments | 6 × (0,012 $ + 1000 × 0,00012 $) | 0,79 | 0,68 |
| OnPage, 203 pages avec JavaScript, mensuel | 203 × (0,00015 $ + 0,0015 $) | 0,34 | 0,29 |
| Liens entrants, 2 requêtes de 1000 lignes | 2 × 0,024 $ + 1000 × 0,000036 $ | 0,08 | 0,07 |
| Avis concurrents, 200 par mois | 20 × 0,00075 $ | 0,015 | 0,013 |
| Fiches d'établissement, 10 par mois | 10 × 0,0015 $ | 0,015 | 0,013 |
| Veille locale, 6 requêtes mensuelles | 6 × 0,0006 $ | 0,004 | 0,003 |
| **Total** | | **5,08** | **4,38** |

**Confrontation aux deux étalons.**

| Régime | EUR/mois | Part du budget publicitaire de référence (100 €/mois) | Part de l'option SaaS écartée (≈ 100 €/mois, trois chiffres) |
|---|---|---|---|
| Minimal | 0,21 | 0,2 % | ≈ 0,2 % |
| Croisière | 0,83 | 0,8 % | ≈ 0,8 % |
| Étendu | 4,38 | 4,4 % | ≈ 4,4 % |

**Le dépôt, et non l'usage, est la dépense réelle.** Le dépôt minimal est de 50 $, soit
43,14 € au taux du 2026-09-01, et le solde n'expire pas (14, 15). Rapporté aux régimes
ci-dessus, il représente environ **208 mois** de régime minimal, **52 mois** de régime
croisière, **10 mois** de régime étendu. Autrement dit : en régime minimal, le produit
paierait d'avance dix-sept ans d'usage. C'est cette disproportion — et non un prix unitaire —
qui commande de commencer par le crédit d'essai de 1 $ plutôt que par le dépôt.

**Durée de vie des crédits** : aucune. « Funds on your account won't disappear. They will
remain on your balance until you use them » (15). Le risque de péremption du solde est donc
nul ; le seul risque porté par le dépôt est celui d'une fuite du secret, borné par le solde
lui-même.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Le dispositif reste câblé et jamais joué : T-96, T-97 et T-98
  demeurent « à faire », le référentiel tarifaire du produit se périme le 2026-10-01, et le
  script refusera alors tout appel. **Réfutation, chiffrée sur ce que le statu quo coûte** :
  le plan de campagnes publicitaires reste sans aucun volume par marché, donc le compte
  publicitaire se créerait à l'aveugle et ne rendrait ses volumes qu'**après** avoir dépensé
  — soit un apprentissage payé au tarif du média (100 €/mois) au lieu de 0,72 $. Par
  ailleurs 58 % des impressions restent masquées sans substitut. Le statu quo n'est pas
  gratuit : il coûte le prix d'une décision d'acquisition prise sans donnée. **Réfutée.**

- **O1 — épuiser le socle gratuit seulement.** Activer Bing Webmaster Tools (T-103),
  ouvrir un compte publicitaire sans dépense pour l'outil de planification de mots-clés, et
  s'appuyer sur les indices de tendance. Contenu : trois sources à coût nul. **Limite
  nommée** : sans dépense publicitaire, l'outil de planification ne rend que des fourchettes
  logarithmiques (de 10 à 100, de 100 à 1000), et les indices de tendance sont relatifs de 0
  à 100, jamais des volumes absolus — ni l'un ni l'autre ne permet de comparer deux marchés.
  Ce qu'elle exclut : toute comparaison chiffrée entre marchés, qui est précisément l'objet
  de la demande. **Écartée comme réponse suffisante, retenue comme préalable** : elle est
  gratuite, elle n'a pas été jouée, et rien ne justifie de la sauter.

- **O2 — ouvrir le seul palier des volumes, campagne trimestrielle sur mandat humain.**
  Contenu : la campagne déjà instrumentée, 8 combinaisons langue-pays, plafond de dépense
  armé, premier tir sur le crédit d'essai avant tout dépôt, série en ajout seul, restitution
  en console. **Coût** : 0,24 $/mois soit 0,21 €/mois en régime, plus un dépôt de 50 $
  (43,14 €) non périssable et différable au deuxième tir ; complexité simple × durée courte,
  aucune dette technique nouvelle puisque rien n'est à écrire. Ce qu'elle exclut : le suivi
  de position, la veille concurrentielle, et toute mesure hors du champ des volumes.

- **O3 — régime croisière : volumes plus suivi de position mensuel borné.** Contenu : O2
  augmenté d'un relevé de position sur 20 requêtes par marché à profondeur 100. **Coût** :
  0,97 $/mois soit 0,83 €/mois ; complexité moyenne × durée courte, plus l'écriture d'un
  second script d'appel et d'une seconde série. **Réfutation** : la doctrine du produit ne
  déclare la position pilotable qu'entre les rangs 5 et 20 ; elle est à 37,3 et varie du
  simple au double d'un jour à l'autre. On paierait pour observer une variation dont aucune
  décision ne dépend — et la question (6) l'écarte par son propre critère de bascule, pas par
  une opinion de prix. **Écartée aujourd'hui, avec un seuil de réexamen écrit** : position
  moyenne sous 20 sur trois relevés hebdomadaires consécutifs de la série gratuite.

- **O4 — régime étendu : tout le catalogue utile, cadence resserrée.** Contenu : O3 augmenté
  des idées Labs, de l'audit technique, des liens entrants, des avis et de la veille locale.
  **Coût** : 5,08 $/mois soit 4,38 €/mois ; complexité complexe × durée moyenne, plus une
  dette de maintenance sur six familles de données dont aucune n'a d'objectif rattaché.
  **Réfutation** : le critère (4) écarte tout service sans objectif existant, et six des
  sept postes ajoutés sont dans ce cas. Le prix n'est pas l'obstacle — 4,4 % du budget
  publicitaire reste tenable ; l'obstacle est qu'aucune de ces mesures ne change une décision
  à 43 impressions et zéro clic. **Réfutée.**

## 5. Verdict

- **Option retenue** : O2 — ouverture du seul palier des volumes, campagne trimestrielle
  déclenchée à la main, plafond de dépense armé, premier tir sur le crédit d'essai.

- **Verdict, dans les termes de la demande : GO CONDITIONNEL.** Le GO ne vaut que si les
  quatre conditions ci-dessous sont tenues ; l'une d'elles manquant, le geste ne se fait pas.

  1. **Le socle gratuit est joué d'abord** (T-103, Bing Webmaster Tools), avant tout dépôt.
     Vérifiable : la source apparaît activée. Échéance : **2026-09-30**.
  2. **La première campagne part sur le crédit d'essai de 1 $, sans dépôt** (0,72 $ estimés
     contre 1 $ offert). Si le crédit s'avère limité au bac à sable à l'inscription, le
     constat est consigné et le dépôt redevient un préalable — décision de l'exploitant, pas
     de l'étude. Échéance : **2026-09-30**.
  3. **Le référentiel tarifaire du produit est mis à jour avec le relevé du 2026-09-02**
     avant tout appel, sa péremption reportée au 2026-10-02, et les trois écarts B, C, D du
     §3.3 y sont consignés. Sans quoi le script refusera de lui-même dès le 2026-10-01.
  4. **Le référentiel gratuit des localisations est appelé avant la campagne** pour
     confronter les 8 codes du jeu d'amorces à la liste réelle du fournisseur. Coût nul,
     mode d'échec entier écarté.

- **Coût de O2** : complexité simple × durée courte — rien n'est à construire,
  le câblage existe et a été relu ligne à ligne. Dépense : 0,21 €/mois en régime
  (0,24 $/mois), plus un dépôt non périssable de 43,14 € (50 $) qui peut attendre le second
  tir. Dette : nulle en code ; une seule dette de tenue, le référentiel tarifaire à rejouer
  chaque mois avant achat, déjà outillée par le refus automatique du script sur tarif périmé.

- **Schéma d'intégration** — conforme aux trois contraintes d'architecture, et **déjà en
  place** ; ce schéma décrit ce qui existe, il ne propose rien.

```
  EXPLOITANT (geste humain, R-29)
      │  Actions → « Campagne DataForSEO » → Run workflow (plafond_usd, défaut 2 $)
      ▼
  RUNNER D'INTÉGRATION CONTINUE  ── seul détenteur des secrets ──────────────┐
      │  <produit>/.github/workflows/dataforseo.yml                          │
      │  · pas de `schedule` : aucun battement ne peut déclencher de dépense │
      │  · refus si JETON_DEPOT absent          (avant tout appel facturé)   │
      │  · refus si DATAFORSEO_LOGIN/PASSWORD absents                        │
      │                                                                      │
      ├─► 1. ESTIMER, hors réseau : `dataforseo-releve.mjs --estimer`         │
      │      · refus si estimation > plafond                                 │
      │      · refus si référentiel tarifaire périmé                         │
      │      → le journal du run porte le coût AVANT la moindre dépense      │
      │                                                                      │
      ├─► 2. APPELER : POST api.dataforseo.com/v3/keywords_data/google_ads/… │
      │      auth HTTP Basic depuis les secrets d'Actions ────────────────────┘
      │      (le serveur exposé ne détient aucun identifiant, et n'en aura pas)
      │
      ├─► 3. VERSER EN AJOUT SEUL : appendFile → donnees/dataforseo-releves.jsonl
      │      une ligne par tâche : date, marché, statut, nb de mots-clés,
      │      montant RÉELLEMENT facturé (lu dans la réponse), et les volumes
      │      · aucune ligne existante n'est jamais réécrite
      │      · une combinaison en échec est CONSIGNÉE, la campagne continue
      │
      └─► 4. POUSSER avec JETON_DEPOT (et non le jeton automatique, qui ne
             déclencherait aucun contrôle en aval)
                    │
                    ▼
  DÉPÔT DÉPLOYÉ ──► SERVEUR ──► CONSOLE AUTHENTIFIÉE EXISTANTE
      <produit>/server.mjs l. 248 lit la série
      <produit>/console/index.html l. 428/926 l'affiche
      · série absente → tableau vide, jamais d'erreur
```

  **Rien n'est à construire.** Les trois contraintes sont tenues : secrets sur le runner
  seulement, série en ajout seul, restitution dans la console existante. Le seul geste
  manquant est humain : poser les secrets, puis déclencher.

- **Modes d'échec nommés, avec leur signal.**
  1. *Dérive tarifaire* — la grille change entre deux campagnes. **Signal** : le montant
     facturé (`cout_usd` de la série) dépasse l'estimation ; le script l'écrit déjà en
     avertissement. **Parade** : rejouer le relevé avant la campagne suivante.
  2. *Référentiel tarifaire périmé* — **Signal** : le script refuse et sort en code 2.
     C'est un refus voulu, pas une panne.
  3. *Absence de donnée sur micro-marché* — le marché est trop petit pour que la source
     rende un volume. **Signal** : `nb_mots_cles` à zéro, ou `search_volume` à `null`
     (source 16). **Parade** : consigner tel quel ; c'est un résultat, pas une panne.
  4. *Volume agrégé pris pour un volume propre* — la source rend une valeur commune à un
     groupe de requêtes voisines (source 16). **Signal** : plusieurs mots-clés distincts
     portant exactement le même volume. **Parade** : ne jamais arbitrer entre deux
     formulations sur leur seul écart de volume.
  5. *Code de localisation faux* — la réponse est non vide mais porte sur un autre marché.
     **Signal** : deux marchés voisins rendant des volumes sans rapport avec la série
     gratuite. **Parade** : le référentiel gratuit des localisations, condition 4 du GO.
  6. *Fuite du secret d'API* — **Signal** : le solde baisse hors campagne. **Parade** : le
     solde est le plafond de perte, jamais de rechargement automatique, secret révocable
     depuis l'espace client.
  7. *Déclenchement automatique glissé* — un `schedule` ajouté au workflow rendrait la
     dépense périodique et non humaine. **Signal** : présence de `schedule:` dans
     `<produit>/.github/workflows/dataforseo.yml`. **Parade** : contrôle au run de version ;
     l'en-tête du fichier l'interdit déjà par écrit.
  8. *Profondeur sous-estimée* — un futur suivi de position à profondeur par défaut ne
     verrait jamais un site au rang 37. **Signal** : rang absent dans la réponse alors que
     la source gratuite voit des impressions. **Parade** : profondeur 100, et le chiffrage
     du §3 bis (8) la porte déjà.
  9. *Série non versée* — la campagne est payée mais la donnée n'atteint pas la console.
     **Signal** : run vert sans commit sur `donnees/dataforseo-releves.jsonl`. **Parade** :
     le refus préalable sur JETON_DEPOT absent, déjà câblé.
  10. *Mesure qui ne décide rien* — la donnée arrive, personne ne s'en sert. **Signal** :
      deux campagnes consécutives sans décision d'acquisition écrite citant un volume relevé.
      **Parade** : le critère d'arrêt symétrique ci-dessus.

- **Ce que cette étude n'a pas pu trancher, et qui demande un essai payé.** L'existence
  réelle de volumes exploitables sur les micro-marchés du produit n'est **pas déterminable
  sur documentation** : la source rend `null` quand elle n'a rien, et seul un appel le dira.
  Le prix de cette réponse est de **0,72 $** au plus, potentiellement couvert par le crédit
  d'essai de 1 $. L'étude s'arrête là et le chiffre ; la décision d'essayer appartient à
  l'exploitant.

- **Candidature(s) émise(s)** : aucune candidature nouvelle. La présente étude instruit
  TF-0741. Deux constats sont à porter au produit, indépendamment du verdict, et relèvent
  d'un run dédié : le commentaire « jusqu'à 1000 idées rendues par tâche » du script et du
  jeu d'amorces est faux (la limite documentée est de 20 amorces en entrée, écart D du
  §3.3), et le référentiel tarifaire du produit laisse six familles non chiffrées que le
  relevé du 2026-09-02 renseigne.

- **Plan de revue** : 2026-12-02 — confrontation aux faits sur cinq points chiffrés. Le
  socle gratuit a-t-il été activé ? La première campagne a-t-elle été jouée, et sur quel
  solde ? Combien des 8 combinaisons ont rendu au moins 50 mots-clés à volume non nul ? Un
  plan de campagnes citant 10 volumes sourcés existe-t-il ? La dépense cumulée est-elle
  restée sous 3 $ ? Une revue incapable de répondre au deuxième point signale que rien n'a
  commencé, et le reste ne se juge pas. Rendez-vous suivant : **2027-03-02**, où joue le
  critère d'arrêt symétrique.
