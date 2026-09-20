---
role: référentiel périssable des règles de la plateforme LinkedIn qui conditionnent une présence tenue sous la discipline de la factory — ce que le contrat interdit, par où viennent les chiffres, ce que la loi exige d'un contenu généré, ce que la mesure dit de la portée
sources_de_verite: [output/03-etudes/20260917-etude-opportunite-gestion-reseaux-sociaux.md §2 quater et §3 (sept sources ouvertes et vérifiées le 17/09/2026), linkedin.com/legal/user-agreement (en vigueur le 2025-11-03), learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview (2026-03-31), learn.microsoft.com/en-us/linkedin/marketing/integrations/recent-changes (version 2026-03), linkedin.com/help/linkedin/answer/a701208 et a551206, digital-strategy.ec.europa.eu/en/policies/guidelines-transparency-ai-generated-content (2026-08-06), datamatters.sidley.com/2026/06/22/, writtenlyhub.com/news/linkedin-engagement-down-50-algorithm-insights-report-2025 (2026-08-22)]
verifie_le: 2026-09-17
perime_le: 2026-12-02
---

# Plateforme LinkedIn — règles datées, à relire avant de s'y fier

**Ce que le lecteur apprend ici.** Quatre faits décident de tout ce qu'un run peut faire sur
LinkedIn : publier et répondre sont des gestes humains par contrat ; l'accès programmatique aux
chiffres est fermé à une petite société ; l'export manuel gratuit donne ces chiffres quand même ;
un contenu généré doit le dire. Chaque fait porte sa date, sa source et la façon de le rejouer.

**Pourquoi ce document existe** (TF-1156, décision humaine D-2 (a) du 17/09/2026). Les règles
d'une plateforme changent sans préavis. Un skill installé au poste en portait une version datée de
2025, sans source, comme si c'était du code ; la mesure du 2026-08-22 contredit déjà plusieurs de
ses chiffres. Une donnée volatile est une donnée (loi transverse n° 4) : elle vit ici, datée,
sourcée, avec une date de péremption, et aucun skill ne la recopie.

**Péremption : 2026-12-02**, jour où le marquage lisible par machine devient exigible pour les
systèmes déjà sur le marché. Passé cette date, chaque ligne se rejoue ou se retire. Une ligne qu'on
ne sait plus rejouer se retire, elle ne se conserve pas par prudence.

## 1. Ce que le contrat interdit

**Mode de lecture du tableau.** Une ligne vaut une règle ; la citation est mot pour mot ; la
dernière colonne dit ce qu'un run en déduit.

| Règle | Citation et date | Conséquence pour un run |
|---|---|---|
| Aucune automatisation hors interface agréée | Conditions d'utilisation, en vigueur le 2025-11-03, §8.2 : « Use bots or other unauthorized automated methods to access the Services, add or download contacts, send or redirect messages, create, comment on, like, share, or re-share posts, or otherwise drive inauthentic engagement. » | Publier, commenter, réagir, envoyer un message : **gestes humains**. Aucun script, robot ni extension, quel que soit l'outil. |
| Aucune extraction | même section : « Develop, support or use software, devices, scripts, robots or any other means or processes […] to scrape or copy the Services » | Aucune collecte de profils, d'abonnés ni de publications de tiers. Les chiffres viennent de l'export officiel, section 2. |

Comment rejouer : ouvrir `linkedin.com/legal/user-agreement`, relever la date « Effective on », et
relire la section 8.2.

## 2. Par où viennent les chiffres

**Mode de lecture du tableau.** Une ligne vaut un couple type de compte × voie d'accès, de la plus
automatisée à la plus manuelle ; le verdict dit si la voie est ouverte à une petite société sans
dépense.

| Compte × voie | Fait daté | Verdict |
|---|---|---|
| Page d'une organisation × interface programmatique de gestion de communauté | Microsoft Learn, 2026-03-31 : agrément à deux paliers (« Development Tier », puis « Standard Tier » sur revue) ; critères du catalogue : « established business », « established use case » | **fermée** en pratique ; tarif et délai non affichés, non vérifiés |
| Profil d'une personne × interface de statistiques de publications | Microsoft Learn, version 2026-03 : point d'accès ouvert depuis la version de juin 2025 aux seuls partenaires de gestion de communauté, avec consentement du membre | **fermée** |
| Page d'une organisation × export manuel | Aide LinkedIn (mise à jour vers 2025-09) : export XLS des vues « Content, Visitors, Followers, and Competitors » depuis la vue d'administration | **ouverte**, gratuite ; profondeur d'historique à relever au premier export |
| Profil d'une personne × export manuel | Aide LinkedIn (mise à jour vers 2026-06) : « from the past seven days up to the past 365 days. […] Export your analytics to an .XLSX file » | **ouverte**, gratuite, 365 jours glissants |

Un outil tiers agréé par LinkedIn est la seule voie conforme pour programmer une publication ou
lire les chiffres sans export. C'est une **dépense** récurrente : décision humaine (R-29), jamais
un choix de run.

**Données personnelles.** L'export est agrégé : aucune donnée nominative d'abonné n'est collectée
ni stockée. LinkedIn se déclare responsable conjoint des statistiques de page (addendum « Page
Insights Joint Controller », non daté avec précision : à relire).

## 3. Ce qu'un contenu généré doit dire

- **Information du lecteur** : due depuis le **2026-08-02** (règlement européen sur l'IA,
  article 50 ; lignes directrices de la Commission mises à jour le 2026-08-06). La règle de marque
  de l'émetteur porte la formule ; le contrôle exécutable est la candidature TF-1030.
- **Marquage lisible par machine** : reporté au **2026-12-02** pour les systèmes déjà sur le
  marché, sous un accord qualifié de provisoire le 2026-06-22. Adoption finale non vérifiée : à
  relire à la péremption.

## 4. Ce que la mesure dit de la portée

Source secondaire du 2026-08-22, reprenant un rapport annuel payant qui n'a pas été ouvert : la
portée organique d'une page est tombée à environ 1,6 % de ses abonnés (7 % en 2021) ; un profil
obtient jusqu'à 561 % de portée en plus à contenu identique. Conséquence retenue par l'étude du
17/09 : le premier cas réel porte sur un profil, la page relaie.

**Ce document ne porte aucune « règle d'algorithme »** (heure idéale, nombre de hashtags, place
des liens). Aucune n'a de source primaire datée ; elles se mesurent sur les exports du run, compte
par compte, et nulle part ailleurs.

## Ce que ce document ne garantit pas

- Il vieillit vite, et il le dit : `perime_le` fait foi.
- Il ne couvre que LinkedIn. Un autre réseau s'ajoute par une section de même forme, après
  vérification de ses propres conditions, jamais par analogie.
- Il ne dit rien des tarifs : ce sont des données commerciales, et aucune dépense ne se décide
  sans l'humain (R-29).
