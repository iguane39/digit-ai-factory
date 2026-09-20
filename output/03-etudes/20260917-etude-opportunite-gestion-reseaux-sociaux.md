---
role: étude d'opportunité (instruction entre candidat et décidé) — gestion dans la durée de la présence de Digit-AI sur les réseaux sociaux (« forge pour la gestion de réseaux sociaux ») ; issue du prompt réécrit par l'analyse L99 du 17/09/2026 et de la réponse humaine « A1 » du même jour, lue comme D-1 (a)
sources_de_verite: [output/03-etudes/20260917-L99-gestion-reseaux-sociaux.md (prompt réécrit, chapitre 8), output/03-etudes/20260911-etude-opportunite-communication-marketing-ao.md (verdict O3, typologie, test R-28, test rétro), todo/TODO.jsonl (TF-1021 à TF-1031 relus le 17/09, recherches d'antériorité), digit-ai-forge-agents/.claude/skills/digit-ai-communication/references/presets-livrables.md l.7-13, digit-ai-forge-agents/.claude/skills/la-barre/references/registre-barres.md, catalogues/catalogue.jsonl (cat-des-01, cat-des-06, cat-dat-03, cat-obs-01, cat-obs-02, cat-seo-05, cat-sec-02, cat-asc-03, cat-agt-08, cat-agt-11), fiches/forge-observability.md l.11-30, references/RUN-AO.md, references/INTEGRATIONS-FOURNISSEURS.md, REGLES-PROJET.md l.235-248 (R-28) et l.331-335 (R-31), c:/dev/digit-ai-marketing/{README.md,CLAUDE.md,donnees/personas/README.md,donnees/bibliotheque/README.md,donnees/marque/MARQUE.md l.140-159,output/03-publications/README.md,input/02-briefs/…Specification Produit… l.105 et l.239} (lecture seule), ~/.claude/skills/synced/…/linkedin-post-generator (audit ameliore-un-skill du 17/09, lecture seule), sept sources externes datées (section 3)]
verifie_le: 2026-09-17
---

# Étude d'opportunité — gestion dans la durée de la présence de Digit-AI sur les réseaux sociaux (« forge pour la gestion de réseaux sociaux ») — 20260917a

Audience : le pilote de l'écosystème, qui décide des mandats, et les porteurs nommés au verdict
(forge-agents, forge-observability, le pilot, le produit `digit-ai-marketing`). L'étude instruit
la demande du 17/09/2026 telle que réécrite par l'analyse L99 du même jour. La réponse humaine
« A1 » a été lue comme la validation de la lecture par défaut : la capacité sert la présence de
Digit-AI elle-même, et les neuf écarts à la lettre sont acceptés.

Mesures relevées le **2026-09-17** sur les dépôts présents au poste (relevé d'ouverture : pilot en
avance de 32 enregistrements, forge-agents de 14, produit en lecture seule). **Date de
péremption : 2026-12-02**, jour où le marquage des contenus générés devient exigible pour les
systèmes existants ; les conditions d'accès aux données de LinkedIn sont à relire à la même date.

**Ce que le lecteur va apprendre.** La demande ne justifie ni une forge ni un logiciel. Huit des
dix fonctions de la gestion d'un réseau ont déjà un porteur, et les deux qui engagent la
plateforme, publier et répondre, restent des gestes humains par contrat : LinkedIn interdit toute
automatisation hors de son interface agréée, et cette interface est fermée à une petite société.
Les chiffres de performance existent pourtant sans dépense : la page et le profil s'exportent à la
main, gratuitement, jusqu'à 365 jours en arrière. Ce qui manque tient en **neuf objets** répartis
chez quatre porteurs existants, dont un type de run à cadence hebdomadaire, parce que le défaut
réel est là : depuis la naissance du produit, aucune publication n'est sortie, et personne n'est
nommé pour jouer un calendrier entre deux runs.

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur trois critères. **Objet durable** : l'option la plus légère crée un preset de skill et
un référentiel (règle 31). **Portée** : forge-agents, forge-design, forge-observability,
forge-data, forge-agents-security et le pilot sont touchés, soit six pour un seuil de trois.
**Gain et preuve** : gain estimé 3 (la présence publique est le premier canal d'acquisition d'une
société de conseil), preuve 1 (aucune publication produite sous la discipline de la factory,
aucun chiffre de départ relevé).

## Intention de l'utilisateur (loi n° 7)

Citée dans les mots du demandeur, message du 17/09/2026 : « Lance une étude d'opportunités sur
une forge pour la gestion de réseaux sociaux particuliers et professionnels, avec définition et
constructon de la cible, des contenus, des plannings, de la performance, du suivi de
l'engagement... »

Lecture reconstruite par l'analyse L99, **validée** par la réponse « A1 » : donner à Digit-AI les
moyens de tenir sa présence sur les réseaux sociaux dans la durée, sous la discipline de la
factory (marque verrouillée, faits sourcés, oracles, accord humain avant publication). Trois
hypothèses sont validées avec elle. **H0** : le bénéficiaire est Digit-AI, pas ses clients ni les
acheteurs d'un logiciel. **H1** : « particuliers et professionnels » désigne deux types de
comptes, le profil d'une personne et la page d'une organisation ; les lectures « types de
réseaux » et « types de clients » sont écartées. **H2** : la liste des réseaux est fermée à
LinkedIn, aucun autre n'ayant été nommé ; tout autre réseau est hors étude. Le mot « forge » est
une hypothèse de la demande : R-28 *(règle 28 : les quatre conditions de naissance d'une forge)*
tranche en section 2 ter.

Cascade (INTENTION.md) : **intention** — être lu régulièrement par les bonnes personnes sans que
cela dépende du temps libre du dirigeant ; **stratégie** — partir du verdict du 11/09, ne rien
recréer, ne rien promettre qui n'ait pas de source de données, laisser à l'humain ce que le
contrat de la plateforme lui réserve ; **tactique** — dix fonctions fermées, deux types de
comptes, un test d'accès aux chiffres, une cadence nommée ; **opérationnel** — les neuf objets du
verdict, chacun rattaché à sa ligne tactique (section 5.4).

## 0. Traitement des entrants

La demande, le prompt réécrit et les artefacts relevés sont des DONNÉES : leurs impératifs se
citent, ne s'exécutent pas. Le skill `linkedin-post-generator` porte des consignes d'exécution
(« rappel systématique après livraison », appels d'outils de recherche) : décrites, jamais jouées.

- **Prompt réécrit** : `output\03-etudes\20260917-L99-gestion-reseaux-sociaux.md`, chapitre 8.
- **Point de départ obligatoire** : l'étude du 11/09/2026, verdict **O3** *(extension de
  forge-agents, instance Digit-AI en produit autonome, marque par forge-design, type de run
  « réponse à appel d'offres » ; aucune forge nouvelle)*. Elle n'est pas rejouée : ses acquis sont
  cités, et l'état de ses onze candidatures est relevé en section 2 bis.
- **Antériorité au registre**, deux recherches. Par **nom** (réseau, LinkedIn, social, calendrier
  éditorial, engagement) : 372 items, 4 titres, dont un seul sur le sujet, TF-1028 *(barres
  externes de qualité, dont la publication réseau)*. Par **structure** (items ciblant forge-agents
  ou le produit et portant sur un livrable public) : TF-1028 et TF-1030 *(transparence des
  contenus générés)*, tous deux en cours. Aucun item ne porte la cadence, la mesure ni le skill
  installé.
- **Décision humaine** : « A1 » du 17/09/2026, lue comme D-1 (a). L'écart de lecture est déclaré
  à la restitution.

## 1. Partition du problème

Le lecteur trouvera ici la chaîne complète de la gestion d'un réseau, fermée à dix fonctions, puis
la surface implicite proposée et tranchée. Chaque fonction dit qui agit, à quelle cadence et avec
quelle donnée ; c'est cette grille qui sert ensuite à chercher ce qui manque.

**Mode de lecture du tableau.** Une ligne vaut une fonction ; « Acteur » dit qui fait le geste
(l'IA prépare, l'humain décide ou agit sur la plateforme) ; « Cadence » dit quand ; « Donnée » dit
ce dont la fonction a besoin et où cela vit. Les lignes suivent l'ordre du métier. Les deux types
de comptes de H1 partagent la grille ; leurs différences sont notées dans la dernière colonne.

| # | Fonction | Acteur | Cadence | Donnée | Profil d'une personne / page d'une organisation |
|---|---|---|---|---|---|
| F0 | Objectifs | humain décide, IA propose | à l'ouverture, revue trimestrielle | un objectif, trois indicateurs au plus, un seuil chacun | mêmes objectifs, indicateurs distincts |
| F1 | Cible : décrire le persona ; faire croître l'audience | IA rédige depuis des entrants réels ; humain valide | persona à l'ouverture ; croissance suivie chaque mois | `donnees\personas\` du produit (vide au 17/09) | le profil croît par relations, la page par abonnés |
| F2 | Ligne éditoriale et piliers | IA propose, humain valide | à l'ouverture, revue trimestrielle | `MARQUE.md` du produit (voix, ton) | première personne pour le profil, voix de marque pour la page |
| F3 | Contenus : texte, visuel | IA produit, oracles jugent | chaque semaine | bibliothèque de contenus validés, faits sourcés | mêmes sujets, deux écritures |
| F4 | Calendrier | IA tient, humain arbitre | chaque semaine, horizon de 4 semaines | fichier de calendrier chez le produit | un calendrier par compte |
| F5 | Publication | **humain** | selon le calendrier | accord de publication consigné (R-38) | geste identique |
| F6 | Animation : réponses, modération, messages | **humain** ; l'IA peut proposer une réponse sur texte collé | dans l'heure qui suit, puis chaque jour | aucun stockage des propos de tiers | le profil reçoit aussi des messages privés |
| F7 | Mesure de performance | humain exporte, IA lit | chaque semaine | export XLSX de la plateforme, déposé chez le produit | deux exports distincts (section 2 quater) |
| F8 | Suivi de l'engagement | IA lit l'export, humain lit les commentaires | chaque semaine | mêmes exports ; aucune donnée nominative d'abonné | identique |
| F9 | Itération | IA propose, humain décide | chaque mois | écart entre indicateurs et seuils de F0 | identique |

**Surface implicite (loi n° 3), proposée puis tranchée.** Retenus : la **veille** des sujets
(alimentation de F3, par recherche ouverte, sans compte) ; les **langues** (français d'abord,
toute autre langue sur décision) ; l'**archivage** des publications et de leurs chiffres chez le
produit. Écartés, avec motif : la **publicité payante** (dépense, donc décision humaine hors
étude) ; la **vidéo** (aucun verbe outillé, à rouvrir sur besoin constaté) ; le **relais par des
collaborateurs** (l'étude du 11/09 a laissé l'interne en question ouverte) ; la **gestion de
crise** (geste humain, hors cadence ; le type de run en porte seulement la consigne d'arrêt).

## 2. Non-recouvrement contre l'existant

Chaque ligne porte une citation vérifiable, relue le 17/09/2026 en lecture seule. Le lecteur y
verra que l'existant couvre la marque, les faits, la page HTML et la mesure restituée, que deux
candidatures ouvertes couvrent la barre et la transparence, et que cinq manques restent sans
porteur : le preset, les règles de la plateforme, la cadence, la voie des chiffres et l'état du
skill installé.

**Mode de lecture du tableau.** Une ligne vaut un élément de l'existant ; la citation est un
fichier, une ligne ou un identifiant de catalogue ; le verdict dit « recouvre » suivi des fonctions
couvertes, ou « ne recouvre pas » suivi de ce qui manque. Les lignes suivent l'ordre du prompt
réécrit.

| Existant examiné | Citation | Verdict |
|---|---|---|
| Skill `digit-ai-communication` (forge-agents, versionné depuis TF-1021) | `references\presets-livrables.md` l.7-13 : sept presets — proposition commerciale, conférence, formation, COPIL, pitch court, note ou email, négociation ; recherche « linkedin, réseau, publication, post » dans le skill : aucune occurrence | **ne recouvre pas** F3 pour une publication : l'étude du 11/09 notait ce dosage « couvert », aucun preset ne le porte ; le preset le plus proche est « pitch court » |
| Skill `la-barre` et candidature TF-1028 (forge-agents) | `registre-barres.md` : aucune entrée sur une publication (recherche du 17/09, deux lignes hors sujet) ; registre, TF-1028, 14/09 : « Non construit par la campagne du 14/09 […] test d'existence de chacune des trois barres externes (propale privée, mémoire technique, publication réseau) » | **recouvre** le besoin de barre de F3, comme candidature ouverte et non construite ; rien à réémettre |
| Contrôle de transparence, candidature TF-1030 | registre, TF-1030, 14/09 : « scripts/controler-transparence.mjs, cité 17 fois dans 9 fichiers du produit […] n'existe pas » ; `MARQUE.md` du produit l.140 : « Transparence des contenus assistés par IA (article 50 […]) » | **recouvre** la règle ; **ne recouvre pas** son contrôle : une des deux portes de `output\03-publications\` n'est pas câblée |
| `oracle-claims` (forge-agents, `quality-oracles`) | `registre-oracles.md` l.45, cité par l'étude du 11/09 : « montant sans source = bloquant » | **recouvre** les faits chiffrés de F3 |
| forge-design : système de marque et visuels | `catalogue.jsonl` cat-des-01 « Système de marque », cat-des-06 « Générer les visuels », statut « prouve » ; chez le produit : `donnees\marque\MARQUE.md`, `tokens.css`, `temoin.html` | **recouvre** F2 (voix, ton) et le visuel de F3 ; la marque est jouée depuis le 11/09 (TF-1023 en cours pour le seul skill PowerPoint) |
| forge-seo-geo | `catalogue.jsonl` cat-seo-05 « Runs de suivi récurrents », statut « declare » | **ne recouvre pas** : porte la visibilité d'un site, pas un compte de réseau ; précédent utile d'un run récurrent, non exercé |
| forge-data | `catalogue.jsonl` cat-dat-03 « Restituer (chiffres sourcés) » : « garantir que tout chiffre restitué est ancré à sa source », statut « prouve » | **recouvre** la restitution de F7 et F8 dès qu'un export existe ; ne recouvre pas l'obtention de l'export |
| forge-observability | `fiches\forge-observability.md` l.11-12 : plan « sondes commande / oracle_externe / rapport_json / manuel, cadences et seuils déclarés » ; l.30 : « cadence hebdomadaire TENUE » sur son premier plan réel ; cat-obs-02 « Détecter la dérive » | **recouvre** la cadence de F7 à F9 par une sonde de type « manuel » ; ne recouvre pas F4 à F6 : elle observe, elle ne produit pas |
| forge-agents-security | `catalogue.jsonl` cat-sec-02 « Scanner les appels d'outils (dynamique) », cat-asc-03 « Rejouer un corpus d'injection de prompt », statut « prouve » | **recouvre** le risque de F6 : un commentaire de tiers lu par un agent est un entrant hostile possible |
| Produit `digit-ai-marketing` (lecture seule) | `output\03-publications\README.md` : « État au 11/09/2026 : vide. Ce dossier ouvre au palier V2 » ; `donnees\personas\README.md` : « vide. Les personas naîtront du premier brief réel » ; spécification l.105 : « L6 Publication réseau […] V2 […] TF-1028, TF-1030 » | **recouvre** le domicile de l'instance (F1, F2, F4, archivage) ; **ne recouvre pas** l'usage : 0 publication, 0 persona, aucun calendrier, aucun chiffre de départ |
| Skill installé `linkedin-post-generator` | audit `ameliore-un-skill` du 17/09 : 21/35, un red flag de frontière, verdict « Refondre » ; 0 lien mort sur 8 ; `linkedin-best-practices-2025.md` l.169 : « Hashtags = NO IMPACT (recherche 8 mois 2024-2025) » | **recouvre** F3 en partie (structures, mise en forme, image) ; **ne recouvre pas** F0, F5 ; vit hors de toute forge (section 2 ter) |
| `references\INTEGRATIONS-FOURNISSEURS.md` (pilot) | recherche du 17/09 sur LinkedIn, Instagram, Facebook, TikTok, Buffer, Hootsuite : 0 occurrence ; spécification du produit l.239, EX-12 : « à défaut, le geste est humain (envoi, publication) » | **ne recouvre pas** : aucun connecteur déclaré ; la règle du produit tranche déjà F5 |
| Types de run du pilot | `references\RUN-AO.md` : « Cinquième voie d'exécution […] une offre à échéance » ; aucune voie à cadence récurrente parmi les cinq | **ne recouvre pas** F4 à F9 dans la durée : tous les types de run existants sont événementiels |

### 2 bis. État des onze candidatures du 11/09, relevé le 17/09

Le lecteur y lit ce que le verdict du 11/09 a déjà produit, et ce sur quoi la présente étude
s'appuie sans le redemander.

**Mode de lecture du tableau.** Une ligne vaut un groupe de candidatures au même statut ; la
dernière colonne dit ce que ce statut implique pour la gestion d'un réseau.

| Candidatures | Statut au registre | Conséquence ici |
|---|---|---|
| TF-1021 (skills versionnés), TF-1022 (charte PowerPoint), TF-1024 (produit né), TF-1025 (type de run d'appel d'offres) | « corrige » | le produit, ses données de marque et le skill de communication existent et sont versionnés |
| TF-1023 (marque unique), TF-1026 (référentiel d'exigences), TF-1027 (rendu à trame imposée), TF-1028 (barres), TF-1029 (gabarits), TF-1030 (transparence) | « en_cours » | TF-1028 et TF-1030 conditionnent toute publication ; les quatre autres sont sans effet ici |
| TF-1031 (registre des issues) | « decide » | sans effet ici |

### 2 ter. Le skill installé, audité le 17/09

Un agent distinct a audité `linkedin-post-generator` en lecture seule, sous la grille du skill
`ameliore-un-skill` (7 dimensions notées sur 5, red flags, verdict Ajuster, Renforcer ou
Refondre). Quatre faits pèsent sur le verdict de l'étude.

- **Verdict « Refondre », 21/35.** Le score seul aurait donné « Renforcer » ; un red flag de
  frontière force le verdict : un second skill de même nom est listé au poste, sans renvoi ni
  test de chevauchement.
- **Des noms réels en dur.** Deux personnes réelles sont nommées (une dans la description et
  quatre fichiers, une dans les exemples), et deux entreprises réelles y portent des chiffres
  non sourcés. Le skill n'est publiable dans aucun dépôt en l'état.
- **Des règles de plateforme datées, portées comme du code.** Le fichier de bonnes pratiques est
  daté de 2025 ; ses sources ne portent ni date ni adresse. La source externe la plus récente de
  la section 3 mesure, un an plus tard, des baisses de moitié sur les mêmes indicateurs.
- **Aucun oracle embarqué.** Pas de contrat de sortie binaire ; un auto-test partiel, qui échoue
  en console hors UTF-8 ; une dépendance non déclarée (Pillow). Les deux scripts compilent.

Couverture relevée sur la grille de la section 1 : F2 et F3 couverts ; F1, F4, F6, F7, F8, F9
partiels (descriptifs, sans outillage) ; F0 et F5 absents.

### 2 quater. Test d'accès aux données de LinkedIn, par type de compte

C'est la condition d'existence de F7 et F8. Le lecteur y verra que la voie programmatique est
fermée à une petite société, que l'automatisation hors de cette voie est interdite par contrat,
et que l'export manuel gratuit suffit aux deux types de comptes.

**Mode de lecture du tableau.** Une ligne vaut un couple type de compte × voie d'accès ; la
citation vient d'une source datée de la section 3 ; le verdict dit si la voie est ouverte à
Digit-AI sans dépense. Les lignes vont de la voie la plus automatisée à la plus manuelle.

| Compte × voie | Citation | Verdict |
|---|---|---|
| Page d'une organisation × interface programmatique de gestion de communauté | Microsoft Learn, 2026-03-31 : « Development Tier: Initial approval with limited API call volume. Standard Tier: Full access requiring upgrade » ; critères d'éligibilité du catalogue : « established business », « established use case » | **fermée** en pratique : agrément à deux paliers, réservé à un éditeur d'outil ; tarif non affiché, non vérifié |
| Profil d'une personne × interface de statistiques de publications | Microsoft Learn, version 2026-03 : « Community Management API partners can now retrieve IMPRESSION, MEMBERS_REACHED, REACTION, COMMENT, or RESHARE […] starting with the 202506 version » | **fermée** : réservée aux partenaires déjà agréés, avec consentement du membre |
| Les deux × script, robot ou extension | Conditions d'utilisation de LinkedIn, en vigueur le 2025-11-03, §8.2 : « Use bots or other unauthorized automated methods to access the Services, […] create, comment on, like, share, or re-share posts » | **interdite par contrat** : F5 et F6 restent des gestes humains, quelle que soit la doctrine de la factory |
| Page d'une organisation × export manuel | Aide LinkedIn, mise à jour vers 2025-09 : export des vues « Content, Visitors, Followers, and Competitors » au format XLS depuis la vue d'administration | **ouverte**, gratuite ; profondeur d'historique non affichée, à relever au premier export |
| Profil d'une personne × export manuel | Aide LinkedIn, mise à jour vers 2026-06 : « from the past seven days up to the past 365 days. […] Export your analytics to an .XLSX file » | **ouverte**, gratuite, 365 jours glissants |

Conséquence : F7 et F8 existent, avec un geste humain d'export par semaine et par compte. Aucune
fonction n'est écartée pour défaut de source. « Performance » se définit en F0 par un objectif,
trois indicateurs au plus et un seuil chacun ; l'étude propose, pour le premier cas réel :
impressions par publication, taux d'engagement, demandes de contact reçues. Les données
nominatives des abonnés ne sont ni collectées ni stockées : l'export agrégé suffit, et LinkedIn se
déclare responsable conjoint des statistiques de page.

### 2 quinquies. Test d'admission R-28 sur ce qui reste

**Mode de lecture du tableau.** Une ligne vaut un périmètre candidat au statut de forge ; chaque
colonne est un critère de R-28 avec le fait qui le tient ou le met en défaut ; un seul critère en
défaut suffit à refuser.

| Périmètre | 1. ≥ 2 verbes outillés absents ailleurs | 2. v0 exercée | 3. Cadence propre | 4. Surfaces le jour même | Admission |
|---|---|---|---|---|---|
| Gestion de réseaux sociaux (F0 à F9) | **non** : produire est forge-agents, la marque forge-design, restituer forge-data, observer forge-observability ; publier et répondre ne sont pas outillables (contrat de la plateforme) ; restent un preset, un référentiel et un type de run, aucun n'étant un verbe sans porteur | non : 0 publication | **oui** — hebdomadaire | non testé | **refusée** — critère 1 |

Corollaire de R-28, qui s'applique à la lettre : « un corpus de savoir sans verbe outillé est un
référentiel versionné, jamais une forge ». Les règles de visibilité d'une plateforme sont ce
corpus.

## 3. État de l'art daté

Le lecteur y trouve sept sources de moins de 24 mois, ouvertes et vérifiées le 17/09/2026 par un
agent de recherche. Elles établissent trois choses : l'accès programmatique est sous agrément,
l'automatisation est interdite, et la page d'organisation perd sa portée au profit du profil.

**Mode de lecture du tableau.** Une ligne vaut une source ; les colonnes donnent le nom, la date,
le localisateur et ce que l'étude en retient. Les lignes sont classées par question : accès,
contrat, transparence, efficacité.

| Source | Date | Localisateur | Ce que l'étude en retient |
|---|---|---|---|
| Microsoft Learn (LinkedIn), « Community Management - Overview » | 2026-03-31 | learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview | Accès à deux paliers sous agrément ; la permission de lecture des publications des membres est fermée aux nouvelles demandes. F7 par interface programmatique : fermée. |
| Microsoft Learn (LinkedIn), « Recent Changes », version 2026-03 | 2025-06 | learn.microsoft.com/en-us/linkedin/marketing/integrations/recent-changes | Les statistiques de publications d'un profil existent depuis la version de juin 2025, pour les seuls partenaires agréés et avec consentement du membre. |
| Aide LinkedIn, « Combined post analytics » | 2026-06 | linkedin.com/help/linkedin/answer/a701208 | Export XLSX gratuit des statistiques d'un profil, de 7 à 365 jours. Voie retenue pour F7 et F8. |
| LinkedIn, « User Agreement », §8.2 | 2025-11-03 | linkedin.com/legal/user-agreement | Robots, scripts et extensions interdits pour publier, commenter ou extraire. F5 et F6 restent humains ; aucun outil maison de publication n'est admissible. |
| Commission européenne, lignes directrices sur les obligations de transparence | 2026-08-06 | digital-strategy.ec.europa.eu/en/policies/guidelines-transparency-ai-generated-content | « Article 50 of the AI Act applies from 2 August 2026 » : l'information du lecteur sur un texte généré est due dès cette date. |
| Sidley, « EU Lawmakers Reach Provisional Agreement to Delay Key EU AI Act Obligations » | 2026-06-22 | datamatters.sidley.com/2026/06/22/ | Le marquage lisible par machine est reporté au 2026-12-02 pour les systèmes existants ; accord encore provisoire à cette date, adoption finale non vérifiée. |
| WrittenlyHub, reprise de l'« Algorithm Insights Report 2025 » de R. van der Blom | 2026-08-22 | writtenlyhub.com/news/linkedin-engagement-down-50-algorithm-insights-report-2025 | Portée organique d'une page tombée à environ 1,6 % des abonnés (7 % en 2021) ; un profil obtient jusqu'à 561 % de portée en plus à contenu identique. Source secondaire : le rapport d'origine, payant, n'a pas été ouvert. |

Trois points non vérifiés, déclarés : le tarif et le délai d'agrément de l'interface
programmatique ; la méthode complète du rapport cité en dernière ligne ; une position récente de
l'autorité française de protection des données sur les statistiques de page.

## 4. Options — jeu fermé O0-O4

Cinq options, celles du prompt réécrit. Chacune porte son contenu, son coût en complexité ×
durée, le temps humain hebdomadaire qu'elle induit, ce qu'elle exclut et ses frontières. La
variante « outil du marché » est chiffrée à part, à la fin. Le lecteur verra que les options se
départagent sur une seule question : qui joue le calendrier entre deux runs.

**O0 — ne rien faire.** Réfutée. Coût du statu quo, mesuré : 0 publication sortie du produit
depuis sa naissance ; un skill de publication installé hors de toute forge, à « Refondre », qui
porte deux noms de personnes et des règles d'une année révolue ; un contrôle de transparence cité
17 fois et absent, alors que l'information du lecteur est due depuis le 2026-08-02 ; aucun chiffre
de départ, donc aucun gain démontrable plus tard. Temps humain : celui d'aujourd'hui, non mesuré.

**O1 — étendre l'existant.** Ouvrir le palier V2 des publications chez le produit ; ajouter au
skill `digit-ai-communication` un preset « publication réseau » à deux écritures (profil, page) ;
reprendre dans forge-agents ce que `linkedin-post-generator` a d'utile, sans ses noms ni ses
règles en dur ; créer le référentiel daté des règles de la plateforme ; déclarer LinkedIn aux
intégrations comme « aucun connecteur, export manuel ». Coût : complexité moyen × durée court,
TF-1028 et TF-1030 étant déjà ouverts. Temps humain hebdomadaire : relire, publier, répondre,
exporter, soit un effort simple × court par compte. Exclut : la cadence. Rien ne déclenche la
semaine suivante ; l'étude du 11/09 a déjà montré ce que produit une capacité sans rendez-vous :
un dossier vide. Frontières : nettes.

**O2 — O1 plus un type de run « animation de réseau » chez le pilot, à cadence déclarée.** Tout
O1, plus `references\RUN-RESEAU.md` sur le modèle de `RUN-AO.md` : ouverture (objectifs, personas
depuis des entrants réels, ligne éditoriale, état de départ exporté) ; boucle hebdomadaire
(calendrier à 4 semaines, contenus jugés, accord de publication, geste humain de publication,
export, lecture des chiffres) ; revue mensuelle (F9) ; consigne d'arrêt en cas de crise. La cadence
de mesure est portée par un plan de forge-observability à sonde « manuel », les chiffres restitués
sous cat-dat-03. Coût : celui d'O1, plus complexité simple × durée court pour le type de run, dont
toutes les portes existent ou sont déjà candidates. Temps humain hebdomadaire : identique à O1,
mais borné et mesuré avant et après. Exclut : toute publication automatique, tout outil maison de
diffusion. Frontières : celles d'O1 ; le run vit chez le produit, comme `RUN-AO.md` le prescrit.

**O3 — un produit logiciel de gestion de réseaux sociaux.** Un run de build ordinaire. Coût :
complexité très complexe × durée long. Exclue par deux faits : H0 validée (le bénéficiaire est
Digit-AI, pas un acheteur) ; la section 2 quater (sans agrément de la plateforme, un tel logiciel
ne peut ni publier ni lire les chiffres). À rouvrir seulement si le bénéficiaire change.

**O4 — une forge « réseaux sociaux », telle que demandée.** Refusée par la section 2 quinquies :
critère 1 de R-28 en défaut, et corollaire applicable à la lettre. Coût : complexité très
complexe × durée long, pour aucune capacité de plus qu'O2.

**Variante « outil du marché pour publier et mesurer », chiffrée à part.** Un outil tiers agréé
par LinkedIn est la seule voie conforme pour programmer une publication et lire les chiffres sans
export. C'est une DÉPENSE récurrente, donc une décision humaine (R-29) ; son prix n'a pas été
relevé, faute de source ouverte datée. Elle se greffe sur O1 comme sur O2 sans en changer le
contenu : elle retire deux gestes humains par semaine (publier à l'heure, exporter). L'étude ne la
recommande pas avant la revue : le premier cas réel mesurera le temps humain que ces deux gestes
coûtent vraiment.

## 5. Verdict

- **Option retenue** : **O2** — étendre l'existant, plus un type de run « animation de réseau »
  à cadence hebdomadaire chez le pilot. Aucune forge, aucun logiciel, aucune dépense.
- **Coût** : complexité moyen × durée court pour l'ensemble ; par lot, table 5.2. Dette : un type
  de run de plus à tenir, et un référentiel périssable à relire à chaque péremption.
- **Candidature(s) émise(s)** : sept, en sidecar
  `input\01-candidatures\gestion-reseaux-sociaux-verdict-o2-20260917a.tf.jsonl` (objets R1, R4 à
  R9 de la table 5.1) ; R2 et R3 sont TF-1028 et TF-1030, repris sans duplication.
- **Plan de revue** : **2026-10-09** — même rendez-vous que la revue du verdict du 11/09 : état
  des neuf objets, et premières semaines du cas réel si le run est ouvert.
- **Test rétro** : joué en section 5.4 ; un élément retiré.
- **Premier cas réel** : le profil LinkedIn du dirigeant de Digit-AI, pendant 4 semaines, une
  publication par semaine. Motif du choix : la source du 2026-08-22 mesure la portée d'une page à
  environ 1,6 % de ses abonnés, et l'export d'un profil donne 365 jours d'état de départ. La page
  de l'organisation relaie, sans calendrier propre, jusqu'à la revue.
- **Mesure du gain** : temps humain hebdomadaire avant et après (relevé par le dirigeant, en
  minutes, à l'ouverture puis chaque semaine) ; les trois indicateurs de F0 contre leur seuil ;
  le nombre de publications sorties, qui part de 0.

### 5.1 Les neuf objets, typés et attribués

**Mode de lecture du tableau.** Une ligne vaut un manque ; les colonnes disent son type (au sens
de R-31, règle 31 : tout objet durable naît selon le test d'une forge), son porteur, la fonction
servie et la candidature qui le porte. Les lignes suivent le chemin critique.

| # | Manque | Type | Porteur | Sert | Candidature |
|---|---|---|---|---|---|
| R1 | Preset « publication réseau », deux écritures (profil, page), avec contrat de sortie binaire | extension d'un verbe outillé | forge-agents (`digit-ai-communication`) | F3 | sidecar |
| R2 | Barre externe « publication réseau » | barre (`la-barre`) | forge-agents | F3 | TF-1028 |
| R3 | Contrôle exécutable de transparence, avec fixture rouge | contrôle | forge-agents, consommé par le produit | F3, F5 | TF-1030 |
| R4 | Référentiel daté des règles de la plateforme : conditions d'utilisation, voies d'accès aux chiffres, constats de visibilité ; date de péremption | référentiel périssable (loi n° 4) | pilot (`references\`), sources de la section 3 | F2 à F8 | sidecar |
| R5 | Reprise de `linkedin-post-generator` : ce qui sert (structures, mise en forme, image) entre dans R1 ; noms réels et règles en dur en sortent ; le doublon de nom est arbitré | skill à refondre | forge-agents ; décision humaine sur le doublon | F3 | sidecar |
| R6 | Type de run « animation de réseau » (`RUN-RESEAU.md`) : ouverture, boucle hebdomadaire, revue mensuelle, consigne d'arrêt | type de run | pilot | F0, F4 à F9 | sidecar |
| R7 | Plan de mesure : sonde « manuel » hebdomadaire sur l'export, seuils de F0, dérive signalée | plan (`forge-observability/plan@1`) | forge-observability (format), produit (plan et exports) | F7, F8, F9 | sidecar |
| R8 | Données de l'instance : objectifs, personas sourcés, ligne éditoriale, calendrier, état de départ ; ouverture du palier V2 des publications | donnée de l'instance | produit `digit-ai-marketing` | F0, F1, F2, F4 | sidecar |
| R9 | Déclaration de LinkedIn aux intégrations : « aucun connecteur ; export manuel ; automatisation interdite par contrat (2025-11-03) » | ligne de référentiel | pilot (`INTEGRATIONS-FOURNISSEURS.md`) | F5, F7 | sidecar |

### 5.2 Plan de mise à jour par canal, ordonné par chemin critique

**Mode de lecture du tableau.** Une ligne vaut un lot ; les colonnes disent le canal, l'effort en
complexité × durée, la preuve de « prêt » et la conséquence de ne pas le faire. Un lot ne démarre
pas avant ceux qu'il cite.

| Lot | Contenu | Canal | Effort | Preuve de « prêt » | Si non fait |
|---|---|---|---|---|---|
| L-1 | R4 + R9 : référentiel de la plateforme, déclaration aux intégrations | écriture chez le pilot | simple × court | frontmatter daté et sourcé ; `oracle-claude-md` PASS sur l'index | les règles restent dans un skill, périmées sans le dire |
| L-2 | R2 + R3 : barre et contrôle de transparence | mandat chez forge-agents (candidatures déjà ouvertes) | moyen × court | test d'existence de la barre ; fixture : une publication sans mention → FAIL | aucune publication ne peut sortir conforme |
| L-3 | R1 + R5 : preset et reprise du skill | mandat chez forge-agents, après arbitrage humain du doublon | moyen × court | auto-test à double sens ; 0 nom de personne ; `oracle-skills` PASS | le contenu reste produit par un skill hors forge |
| L-4 | R6 : `RUN-RESEAU.md` | référence du pilot | simple × court | fixture : une semaine rejouée à blanc, portes PASS | le calendrier n'est joué par personne |
| L-5 | R8 + R7 : ouverture du run chez le produit, état de départ exporté, plan de mesure | run du produit, sur accord humain | moyen × court | export de 365 jours déposé ; plan jugé par forge-observability ; 3 indicateurs et seuils écrits | aucun gain démontrable |
| L-6 | Premier cas réel : 4 semaines, une publication par semaine | boucle hebdomadaire de L-4 | simple × moyen | 4 accords de publication consignés, 4 exports lus, temps humain relevé | la capacité reste décorative (R-28 point 2) |

### 5.3 Ce que Digit-AI fait SANS mise à jour

Le dirigeant peut publier dès aujourd'hui avec le skill installé, comme il le fait sans doute
déjà. Ce qui ne se fait pas : une publication jugée contre une barre ; une mention de transparence
contrôlée ; un fait chiffré sourcé par construction ; un état de départ ; une semaine qui
s'enchaîne sur la précédente sans que quelqu'un y pense.

### 5.4 Test rétro (Opérationnel → Tactique → Stratégie → Intention)

- **R1, R5 preset et reprise du skill** → tactique « dix fonctions fermées, F3 » → stratégie « ne
  rien recréer » → intention « des contenus ». Sans rupture.
- **R2, R3 barre et transparence** → tactique « une publication est un livrable jugé » →
  stratégie « discipline de la factory » → intention « être lu par les bonnes personnes » : un
  contenu reconnaissable comme générique dessert ce but. Sans rupture.
- **R4, R9 référentiel et déclaration** → tactique « test d'accès aux chiffres » → stratégie « ne
  rien promettre sans source de données » → intention « de la performance ». Sans rupture.
- **R6 type de run** → tactique « une cadence nommée » → stratégie « laisser à l'humain ce que le
  contrat lui réserve, et borner son temps » → intention « des plannings ». Sans rupture.
- **R7 plan de mesure** → tactique « export hebdomadaire » → stratégie « mesurer » → intention
  « de la performance, du suivi de l'engagement », mot pour mot. Sans rupture.
- **R8 données de l'instance** → tactique « F0, F1, F2, F4 » → stratégie « partir du verdict du
  11/09 : l'instance vit chez le produit » → intention « définition et construction de la
  cible ». Sans rupture.
- **Élément retiré** : un outil maison de programmation des publications, envisagé dans O1. Il ne
  remonte à aucune ligne tactique : le contrat de la plateforme l'interdit. Retiré.

Les questions du demandeur, rejouées : « une forge » → section 2 quinquies, refusée sur le
critère 1 ; « particuliers et professionnels » → deux types de comptes, traités à chaque ligne de
la section 1 et testés séparément en 2 quater ; « la cible, les contenus, les plannings » → F1 à
F4, portés par R1, R5, R6, R8 ; « la performance, le suivi de l'engagement » → F7 et F8, ouverts
par l'export manuel, portés par R7.

## Interdits (tenus)

Aucun critère subjectif ; jeu fermé O0-O4 ; chaque ligne de la section 2 citée ; chaque source
datée ; O0 réfutée sur coût cité ; aucun effort chiffré autrement qu'en complexité × durée ; aucun
nom de personne ni de client ; aucune écriture hors du pilot ; aucune publication, aucun compte
créé, aucun identifiant de compte dans un fichier ; aucune donnée d'abonné collectée.
