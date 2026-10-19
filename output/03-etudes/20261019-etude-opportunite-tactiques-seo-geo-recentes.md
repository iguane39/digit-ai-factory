---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — tactiques SEO et GEO récentes pour digit-ai-forge-seo-geo — 20261019c

Ce qui change pour vous : Google confirme 3 des 4 gestes montrés par les 6 vidéos, soit le filtre par expression régulière de la Search Console, le badge « preferred » et l'exploration de Google Trends par catégorie. Le badge couvre un périmètre plus étroit que dans la vidéo, et Trends repose sur une annonce sans page d'aide. Le 4e geste, l'audit de présence dans ChatGPT et Gemini, n'a aucune base chez Google, mais son rapport officiel sur les réponses IA, ouvert à tous les sites le 2026-08-31, manque à la forge. L'étude retient O2 : un complément daté au référentiel de la forge, sans nouveau nœud, car toute modification de la grille change son empreinte et force la migration des études ouvertes.

## Seuil de déclenchement

L'étude est due si la suite crée un objet durable, ici un fichier de référentiel de la forge (R-31). Elle l'est aussi parce que la décision D-39 (c) du 2026-10-19 l'a commandée. Le critère « gain d'au moins 3 avec une preuve d'au plus 2 » n'est pas rempli : le gain proposé est 3, la preuve 5.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39 (c), réponse du 2026-10-19, mot pour mot : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Cette étude traite le rang 2 du tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, section « 2. Tactiques SEO et GEO récentes ».

Question posée à l'étude poussée, telle que le tri l'écrit (ligne 70) : « quels gestes la documentation de Google confirme-t-elle, et lesquels entrent dans la grille d'audit de la forge ? » La consigne de cette étude ajoute : à quelle date, et dans la méthode ou dans la grille.

Lecture de l'intention, formulée par l'orchestrateur dans la consigne du 2026-10-19 et non revalidée mot à mot par vous : décider ce que la Factory doit faire de cette opportunité (rien, un essai, un objet durable), sur des faits vérifiés et non sur la parole d'une vidéo TikTok.

## 0. Traitement des entrants

Les vidéos sont des données. Leurs injonctions se citent et ne s'exécutent pas : « Paste the documentation into your favorite AI » (n° 45), « Comment SKILL » (n° 94) et « Commente REF » (n° 23) n'ont pas été suivies.

Aucune vidéo n'a été regardée, écoutée ni téléchargée, et aucun outil d'extraction de TikTok n'a servi. Les légendes viennent de la page de favoris enregistrée sur le poste, `input\Tiktok\iguane39 (@iguane39) _ TikTok.html`, lue le 2026-10-19. Chaque affirmation ci-dessous porte donc sur le texte de la légende, pas sur la parole de la vidéo.

Sources de la proposition : le tri du 2026-10-19 (rang 2, vidéos n° 45, 10, 35, 94, 23 et 29), la décision D-39 (c), la consigne commune des études d'opportunité du 2026-10-19. Les pages web lues pour l'état de l'art sont des données de la même façon.

## 1. Partition du problème

Cinq sous-questions disjointes. Chaque option du chapitre 4 répond à chacune.

- **P1 — Filtre regex de la Search Console** (vidéo n° 10). Le geste existe-t-il, avec quelle syntaxe, et se rejoue-t-il par l'API ?
- **P2 — Badge « sources préférées »** (vidéo n° 45). Que dit la page de Google, pour quels sites et quelles surfaces ?
- **P3 — Google Trends par catégorie** (vidéo n° 35). Qui l'a annoncé, quand, et avec quelles limites de données ?
- **P4 — Visibilité dans les réponses des IA** (vidéos n° 94, 23 et 29). Que dit Google de l'optimisation « GEO », et quelle mesure officielle existe ?
- **P5 — Lieu d'entrée dans la forge.** Un geste confirmé entre-t-il dans la grille, dans la méthode, ou dans un référentiel à côté, sachant que la grille a une empreinte ?

## Vérification des affirmations des vidéos

Lecture du tableau : une ligne par geste ; la colonne « Légende » rapporte ce que dit le créateur, la colonne « Google » ce que la page primaire établit, la dernière le verdict sur l'affirmation. Les pages sont lues le 2026-10-19 ; les dates des pages sont celles qu'elles affichent.

| Geste (vidéo) | Légende | Google | Verdict |
|---|---|---|---|
| Filtre regex (n° 10) | Performance, Résultats de recherche, filtre Requête, « Custom Regex » avec `^([^ ]+ ){3,}[^ ]+$` : les requêtes « de plus de 4 mots » | L'aide décrit « Custom (regex) » pour Requêtes et Pages, syntaxe RE2, correspondance partielle, insensible à la casse par défaut. L'API accepte `includingRegex` et `excludingRegex` (page mise à jour le 2026-08-11) | Geste vrai. Seuil inexact : l'expression retient 4 mots ou plus (test sur « a b c » : non, « a b c d » : oui, moteur `re` de Python, construction identique en RE2). « Moins concurrentiel » et « requêtes faites par l'IA » : invérifiables |
| Badge (n° 45) | Le badge fait apparaître le site davantage dans AI Overviews, AI Mode, Top Stories et Discover ; avec assez de clics, il devient un signal de classement global | « Preferred » mis en avant dans Top Stories ; dans AI Mode et AI Overviews, pour les utilisateurs qui ont choisi le site. Domaine ou sous-domaine seulement. Bouton en 2 lignes de HTML, lien profond sinon. Facultatif (page mise à jour le 2026-09-18) | Vrai pour Top Stories, AI Mode, AI Overviews et la facilité. Discover absent de la page, signal de classement global jamais énoncé : invérifiables. Périmètre plus étroit que dit |
| Trends par catégorie (n° 35) | Nouvelle façon d'explorer par catégorie sans mot-clé ; requêtes en hausse | Annonce de Google Search Central : filtres de catégorie sur la nouvelle page Explore, avec ou sans requête (relayée le 2026-09-02). Ni l'aide Trends ni le blog Google du 2026-01-14 n'en parlent | Vrai, mais attesté par une annonce seulement, sans page d'aide à citer |
| Skill de visibilité IA (n° 94) | « Most AI SEO advice is already outdated » ; un skill gratuit pour Claude Code appuyé sur « les dernières recherches » | Aucun skill nommé. Le guide Google du 2026-07-10 écarte llms.txt, le découpage en morceaux, la réécriture pour l'IA et les mentions artificielles | Invérifiable : l'outil n'est pas nommé dans la légende |
| Audit ChatGPT et Gemini (n° 23) | Un restaurant cité par Perplexity mais absent de ChatGPT et de Gemini ; audit gratuit sur commentaire | Aucune page Google ne décrit un tel audit. OpenAI recommande d'autoriser OAI-SearchBot ; sans lui, le site n'apparaît pas dans les réponses de recherche de ChatGPT, avec un délai d'environ 24 heures | Le cas du restaurant : invérifiable. Le mécanisme côté ChatGPT : vrai. Gemini : aucune page lue |
| Visites via ChatGPT (n° 29) | Une phrase de titre, sans méthode | Sans objet | Invérifiable : rien à vérifier |

## 2. Non-recouvrement contre l'existant

Dix existants touchent ce sujet ; chacun est cité avec sa ligne et ce qu'il couvre ou laisse.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Famille F1 « Performance propriétaire » du pilot | `references\SEO-RECHERCHE.md` l.18-21 : « Search Console, Bing Webmaster Tools […] Gratuite, réelle, aveugle au potentiel » ; 0 occurrence de « regex » ni de « generative » (grep du 2026-10-19) | recouvre la source, ne recouvre pas le filtre regex ni le rapport IA |
| Google Trends dans le pilot | `references\SEO-RECHERCHE.md` l.73-75 : « Complément gratuit : Google Trends — courbes relatives […] indice, pas volume » ; 0 occurrence de « catégorie » | recouvre l'usage général, ne recouvre pas l'exploration par catégorie ni l'exclusion des recherches d'IA |
| Même complément dans la forge | `C:\dev\digit-ai-forge-seo-geo\referentiel\recherche-multilingue.md` l.49-51 : « Complément [T3] : Google Trends […] jamais pour chiffrer un volume » | recouvre l'avertissement sur l'indice, ne recouvre pas la catégorie |
| Garde-fou de vérification datée | `referentiel\methode.md` (forge) l.33 : « Vérification web obligatoire, avec date de consultation » pour AI Overviews, AI Mode, GEO | recouvre l'obligation que cette étude exécute ; ne recouvre pas son résultat |
| Nœuds Longue Traîne et Requêtes Sous Exploitées | `referentiel\grille-noeuds.md` l.133 (nœud 17) et l.135 (nœud 19) : distribution des clics, filtre « impressions élevées et CTR bas » | recouvre le but, ne recouvre pas le geste regex |
| Nœud Présence Dans Les Réponses IA | `referentiel\grille-noeuds.md` l.237 (nœud 58) : « protocole à établir au run […] résultat non reproductible » | recouvre le test manuel, ne recouvre pas le rapport officiel de la Search Console |
| Nœud Accès & Directives IA | `referentiel\grille-noeuds.md` l.238 (nœud 59) : llms.txt « ADOPTÉ par décision du 11/08/2026 » ; `referentiel\agents-ia.json` l.4, l.14, l.21 : vérifié le 2026-08-12, OAI-SearchBot et Google-Extended listés | recouvre les agents d'OpenAI ; ne recouvre pas l'avis de Google sur llms.txt |
| Nœud Contenu Pensé Pour Les LLM et branche Discover | `referentiel\grille-noeuds.md` l.152 (nœud 27) et l.219-223 (nœuds 49-53) ; 0 occurrence de « preferred » dans la forge ni dans `references\` (grep du 2026-10-19) | ne recouvre pas le badge ; recouvre le thème du nœud 27 sous un angle que Google déconseille en partie |
| Voie connecteur Search Console | `referentiel\sources-donnees.md` l.28 et l.67-68 : connecteur GSC en lecture seule, 17 nœuds concernés | recouvre l'accès aux données, ne recouvre pas le rapport IA générative |
| Skills installés | `C:\Users\iguan\.claude\skills\` : 34 dossiers listés le 2026-10-19, aucun consacré au SEO, au GEO ou à Trends ; registre `todo\TODO.jsonl` : TF-0792 (l.34) ingère SEO-RECHERCHE.md, 0 ligne pour « preferred », 0 pour un regex de la Search Console (les 12 lignes « regex » concernent des oracles) | ne recouvre pas |

Un constat en passant : la forge se décrit tantôt à 87 nœuds (`referentiel\methode.md` l.48 et l.90), tantôt à 88 (`README.md` l.10, l.30, l.164), tantôt à 89 (`referentiel\grille-noeuds.md` l.3, `referentiel\sources-donnees.md` l.11). La grille compte 89 lignes. Ce n'est pas l'objet de l'étude ; une candidature séparée est proposée au chapitre 5.

## 3. État de l'art daté

11 sources, dont 10 primaires de Google ou d'OpenAI. Chacune est lue le 2026-10-19 ; quand la page ne porte pas de date, elle est dite non datée.

- **Google Search Central, « Help your readers find your site through preferred sources in Google Search »**, mise à jour 2026-09-18, `https://developers.google.com/search/docs/appearance/preferred-sources`. Établit le badge, les surfaces, l'éligibilité domaine et sous-domaine, et le caractère facultatif des méthodes.
- **Google Search Central, « AI features and your website »**, mise à jour 2025-12-10, `https://developers.google.com/search/docs/appearance/ai-features`. Aucune exigence supplémentaire pour apparaître dans AI Overviews et AI Mode ; « You don't need to create new machine readable files, AI text files, or markup ».
- **Google Search Central, « Optimizing your website for generative AI features on Google Search »**, mise à jour 2026-07-10, `https://developers.google.com/search/docs/fundamentals/ai-optimization-guide`. Pour Google, optimiser pour la recherche générative reste du SEO. Les fichiers llms.txt, le « chunking », la réécriture pour l'IA et les mentions artificielles sont à ignorer. La mesure passe par le rapport « Generative AI performance ».
- **Google Search Central Blog, « Introducing Search Generative AI performance reports in Search Console »**, 2026-06-03, avec la note « As of August 31, 2026, we've rolled out these insights to all websites worldwide », `https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports`. Le rapport donne impressions, pages, pays, appareils et dates, sans clics ni positions.
- **Google, API Search Analytics « query »**, mise à jour 2026-08-11, `https://developers.google.com/webmaster-tools/v1/searchanalytics/query`. Opérateurs `includingRegex` et `excludingRegex`, syntaxe RE2.
- **Aide Search Console, « Performance report (Search results): Advanced filtering and comparison »**, page non datée, `https://support.google.com/webmasters/answer/17011165`. Pas à pas du filtre « Custom (regex) », partiel et insensible à la casse par défaut, `(?-i)` pour la casse.
- **Google, « Google Trends: explore with AI »** (Nir Kalush), 2026-01-14, `https://blog.google/products-and-platforms/products/search/google-trends-explore-with-ai/`. Panneau Gemini, plus de termes comparables, 2 fois plus de requêtes en hausse, déploiement d'abord sur ordinateur. Aucune mention des catégories.
- **Search Engine Roundtable, « Google Trends Explore Page Adds Category Filtering »**, 2026-09-02, `https://seroundtable.com/google-trends-filter-category-42007.html`, qui cite la publication de Google Search Central sur LinkedIn (`https://www.linkedin.com/posts/were-excited-to-introduce-trends-category-share-7500895949397934080-l7EZ/`, affichée « 1mo » le 2026-10-19, sans date exacte).
- **Aide Trends, « FAQ about Google Trends data »**, page non datée, `https://support.google.com/trends/answer/4365533`. Données normalisées de 0 à 100, popularité relative ; les recherches internes d'AI Mode et d'AI Overviews sont exclues.
- **Google Search Central Blog, « Introducing the Google Trends API (alpha) »**, 2025-07-24, `https://developers.google.com/search/blog/2025/07/trends-api`. API réservée à un nombre très limité de testeurs ; donc non utilisable par la forge.
- **OpenAI, « Overview of OpenAI crawlers »**, page non datée, `https://developers.openai.com/api/docs/bots`. OAI-SearchBot sert la recherche de ChatGPT, GPTBot l'entraînement ; autoriser OAI-SearchBot est recommandé, avec un délai d'environ 24 heures.

Deux limites. La page du 2025-12-10 dit « no additional technical requirements » alors que celles du 2026-07-10 et du 2026-09-18 exigent d'être « included in Search generative AI features in Search Console » : la condition est récente et son mécanisme n'est pas décrit. Et un article tiers de 2021 sur le regex (Search Engine Land) disait la casse sensible par défaut, ce que l'aide actuelle contredit : seule la page de Google fait foi.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée. Le nœud 58 reste un test manuel « non reproductible » (`referentiel\grille-noeuds.md` l.237) alors que Google publie une mesure officielle. La forge compte 0 occurrence de « regex », « generative AI » et « preferred » (grep du 2026-10-19). Le nœud 59 garde llms.txt « adopté » sans que l'avis de Google, daté 2026-07-10, soit consigné. Chaque audit refait la vérification datée du garde-fou 4 (`referentiel\methode.md` l.33).
- **O1 — noter les constats dans le pilot seulement**, en ajoutant une section datée à `references\SEO-RECHERCHE.md`.
  - Coût : simple × court.
  - Exclut : la forge. Elle charge son propre corpus (`referentiel\methode.md` l.43-54), copié depuis le pilot en 7cb87fe ; une note du pilot n'atteint aucun audit.
- **O2 — compléter le référentiel de la forge sans toucher à la grille.** Nouveau fichier `referentiel\gestes-google-verifies.md`, daté et sourcé (loi n° 4) : regex et API (nœuds 17 et 19), rapport IA générative (nœuds 58 et 70, source GSC en export ou connecteur), avis de Google sur llms.txt (nœud 59), Trends par catégorie (nœud 51 et complément de `recherche-multilingue.md`), badge conditionnel. Une ligne dans le tableau des références de `methode.md` et une ligne dans la matrice de `sources-donnees.md`.
  - Coût : simple × court. Aucun script ne cite `recherche-multilingue.md` (grep des scripts, du README et des JSON du référentiel : 0 résultat), donc un fichier voisin n'exige aucun câblage.
  - Précédent : `sources-donnees.md` l.56 laisse la légende de la grille intacte « pour ne pas changer l'empreinte de la grille » et corrige par un renvoi.
  - Exclut : la méthode visible dans la ligne même du nœud, que seul un lecteur du complément trouve.
- **O3 — modifier les lignes de la grille** pour les nœuds 17, 19, 27, 51, 58, 59 et 70.
  - Coût : moyen × moyen. L'empreinte de la grille, mesurée le 2026-10-19 à `27e2527398eb`, est celle de `referentiel\correspondances-grille.json` l.10 ; la changer exige une évolution déclarée (l.5, README l.366-374), fait échouer le contrôle 12 de `validate.py` tant qu'elle manque, et impose `migrer_mission.py` aux études ouvertes (README l.383-390).
  - Exclut : la comparabilité sans migration des études déjà produites.
- **O4 — O3 plus 2 nœuds neufs**, « Sources préférées » et « Rapport IA générative », et un script de lecture du rapport.
  - Coût : complexe × long. La grille passe à 91 nœuds, les 3 tables de comptage (l.328-377) et le manifeste sont à refaire, et chaque étude ouverte perd 2 points de couverture (README l.388-390).
  - Exclut : un périmètre stable. Ces 2 nœuds ne posent pas de question d'audit neuve : la présence dans les réponses IA est déjà la question du nœud 58, et le badge ne vaut que pour un site éditorial.

## 5. Verdict

- **Option retenue** : O2.
- **Pourquoi O2** : les 3 gestes confirmés sont des méthodes et des sources pour des nœuds existants, pas des questions d'audit neuves. O2 les rend disponibles aux audits sans payer la migration de la grille. O3 devient justifié si au moins 2 études ouvertes réclament la même ligne dans la grille ; la revue le mesure.
- **Ce qui entre, et où** :
  - Entrent dans la méthode (complément) : le filtre regex et son équivalent API pour les nœuds 17 et 19, avec la correction « 4 mots ou plus » ; le rapport « Generative AI performance » pour les nœuds 58 et 70, étiqueté `[T1 observé]` par connecteur ou `[T2 déclaré]` par export, avec ses limites (impressions seulement, déploiement général au 2026-08-31, condition d'inclusion à vérifier chez le client) ; Trends par catégorie comme idée de mots-clés `[T3]`, avec l'exclusion des recherches internes d'AI Mode et d'AI Overviews.
  - Entre en note datée : l'avis de Google sur llms.txt (ignoré par Google Search, sans effet sur le classement, au 2026-07-10). La posture « adopté » du nœud 59 est une décision du 11/08/2026 ; la forge propose, le pilot décide, elle n'est pas modifiée ici.
  - Entre sous condition : le badge, à vérifier pour un site éditorial dont le domaine ou le sous-domaine figure dans l'outil de préférences ; rattachement au nœud 55 (Marque) proposé, à trancher par la forge.
  - N'entre pas : le skill de la vidéo n° 94 et les audits des vidéos n° 23 et n° 29, faute de base vérifiable. Le test manuel du nœud 58 reste, avec la déclaration de non-reproductibilité.
  - Tension à instruire, non tranchée : le nœud 27 demande « réponse directe en tête, structure explicite » alors que Google (2026-07-10) écarte le « chunking » et la réécriture pour l'IA. La forge peut garder ces critères comme qualité de lecture, sans les présenter comme une tactique GEO.
- **Coût** : complexité simple · durée court. Un fichier de référentiel, 2 lignes de tableau dans des fichiers qu'aucun script ne hache, aucune migration. Tokens : une relecture des 5 pages de Google nommées au plan de revue. Dette : le fichier périme avec les pages ; il porte sa date de lecture.
- **Candidature(s) émise(s)** :
  - Candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 3, preuve 5, effort 1. Titre proposé : « Fichier de gestes Google vérifiés pour digit-ai-forge-seo-geo (regex GSC, rapport IA générative, Trends par catégorie, avis llms.txt) ». Le gain est 3 et non 4 comme au tri : aucun service neuf, une méthode mieux sourcée. La preuve est 5 : 9 pages primaires de Google lues le 2026-10-19.
  - Candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 5, effort 1. Constat : le décompte des nœuds est incohérent entre `methode.md` (87), `README.md` (88) et la grille (89).
  - Aucune écriture au registre dans ce tour.
- **Plan de revue** : 2026-11-19. Relire les pages `preferred-sources`, `ai-optimization-guide`, `gen-ai-performance-reports`, `searchanalytics/query` et l'aide du filtre regex, et comparer leurs dates à celles de cette étude (2026-09-18, 2026-07-10, 2026-06-03, 2026-08-11). Critères écrits d'avance : une page a changé de date, ou une première étude de la forge a exécuté le regex ou lu le rapport IA chez un client, ou 2 études ont réclamé la même ligne dans la grille, auquel cas O3 se rouvre.
- **Test rétro** :
  - *Opération → Tactique* : le fichier de gestes répond à P1 à P4, car chaque geste y porte sa source et sa date ; les 2 lignes de tableau répondent à P5, car elles évitent de toucher la grille.
  - *Tactique → Stratégie* : donner à la forge des gestes dont Google atteste l'existence et la date, et laisser hors de sa méthode ce qui ne repose que sur une légende. La grille reste stable tant qu'aucune étude ne prouve le besoin d'y écrire.
  - *Stratégie → Intention* : vous vouliez décider « rien, un essai, un objet durable » sur des faits vérifiés. Réponse : un objet durable léger, le fichier de référentiel ; un essai suffit pour le rapport IA, qui se rejoue chez un premier client ; rien pour le skill n° 94 et les audits des vidéos n° 23 et n° 29.
  - *Questions rejouées* : « quels gestes la documentation de Google confirme-t-elle ? » — le regex (aide et API), le badge (page du 2026-09-18) et Trends par catégorie (annonce relayée le 2026-09-02). « À quelle date ? » — dates par geste au chapitre 3. « Lesquels entrent dans la méthode ou la grille ? » — 4 dans la méthode par complément, aucun dans la grille, un sous condition.
  - *Rupture constatée* : le tri notait la catégorie de Trends comme geste Google confirmé ; seule une annonce le soutient, sans page d'aide. L'écart est déclaré. Restent non résolus : le sens exact de la condition « included in Search generative AI features », la date exacte du message LinkedIn, et la disponibilité du rapport IA par l'API.
