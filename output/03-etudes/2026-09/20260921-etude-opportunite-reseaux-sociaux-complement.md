---
role: étude d'opportunité complémentaire (delta de l'étude 20260917a) — gestion des réseaux sociaux au-delà de LinkedIn et de Digit-AI ; instruit le candidat TF-1178, décidé par l'humain le 21/09/2026 (« 8a », D-8 (a) de la synthèse 20260921f)
destinataire: humain
sources_de_verite: [output/03-etudes/20260917-etude-opportunite-gestion-reseaux-sociaux.md (verdict O2, fonctions F0 à F9, hypothèses H0 à H2), output/03-etudes/20260917-releve-autres-reseaux-sociaux.md (8 réseaux, 9 étapes, 10 lignes à rejouer), todo/TODO.jsonl (TF-1178, TF-1155 à TF-1161), references/PLATEFORME-LINKEDIN.md l.49-53, references/RUN-RESEAU.md, oracles/oracle-run-reseau.mjs (RR1 à RR6), REGLES-PROJET.md (R-28, R-29, R-38), catalogues/catalogue.jsonl (cat-des-06, cat-seo-05, cat-dat-03, cat-obs-02, cat-obs-03), digit-ai-forge-agents/.claude/skills/digit-ai-communication/references/presets-livrables.md l.23-50, recherche du 21/09 dans digit-ai-forge-seo-geo (0 occurrence de « Google Business » ni de « fiche d'établissement »), 3 rapports d'agents de recherche du 21/09/2026 (202 appels d'outils, pages officielles ouvertes), 13 adresses testées et 4 citations relues par le pilot le 21/09/2026]
verifie_le: 2026-09-21
perime_le: 2026-12-02
---

# Étude d'opportunité — réseaux sociaux au-delà de LinkedIn : réseaux, étapes et types d'émetteur — 20260921a

Audience : le pilote de l'écosystème, qui a objecté le 17/09 « pourquoi que LinkedIn ? », et les
porteurs nommés au verdict : forge-agents, le pilot, le produit de communication.

**Ce que le lecteur va apprendre.** L'objection était fondée, et le rejeu sur pages officielles
change 2 choses. D'abord une erreur du référentiel LinkedIn : il écrit qu'un outil tiers est la
seule voie pour programmer une publication, or LinkedIn offre une programmation gratuite, de 10
minutes à 3 mois. Ensuite la question de l'outil maison : 5 réseaux sur 8 ouvrent gratuitement
leur interface de publication, mais 6 réseaux sur 9 offrent déjà une programmation gratuite dans
leur propre outil. Construire un outil de diffusion ne retirerait donc qu'un geste humain par
semaine, que personne n'a encore mesuré. Le verdict retient un type de run paramétré par réseau et
par type d'émetteur, 3 modèles de publication de plus, et un référentiel de plateformes à 9
réseaux. Pour un commerce de proximité, le premier levier est la fiche d'établissement et ses
avis : aucune forge ne la porte aujourd'hui.

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur 2 critères. **Objet durable** : le verdict crée un référentiel et 3 modèles de
publication (règle 31). **Gain et preuve** : le candidat porte un gain de 3 pour une preuve de 2,
10 lignes du relevé du 17/09 reposant sur des sources secondaires.

## Intention de l'utilisateur (loi n° 7)

Citée dans les mots du demandeur, message du 17/09/2026 : « pourquoi que LinkedIn ? Est-ce qu'il
n'y a pas d'autres éléments à traiter sur d'autres réseaux sociaux et/ou d'autres étapes du
process de gestion des réseaux sociaux ? ». La demande d'origine, le même jour : « une forge pour
la gestion de réseaux sociaux particuliers et professionnels, avec définition et constructon de
la cible, des contenus, des plannings, de la performance, du suivi de l'engagement... ».

Le périmètre est lu au plus large, sans resserrement validé en bloc : tous les réseaux relevés,
toutes les étapes relevées, et 2 types d'émetteur. **H0 est rouverte** : le bénéficiaire n'est
plus Digit-AI seule, il inclut les clients que Digit-AI accompagne. **H1 est rouverte** :
« particuliers et professionnels » se lit aussi comme réseaux grand public et réseaux
professionnels. **H2 est levée** : la liste des réseaux n'est plus fermée.

Cascade (INTENTION.md) : **intention** — qu'un émetteur, société de conseil ou commerce de
proximité, tienne sa présence là où ses lecteurs sont, sans que cela dépende du temps libre de
son dirigeant ; **stratégie** — garder le verdict du 17/09 et l'ouvrir, ne rien construire que la
plateforme offre déjà, ne rien affirmer sans page officielle datée ; **tactique** — 9 réseaux, 19
étapes, 2 types d'émetteur, 5 faits rejoués par réseau ; **opérationnel** — les 6 objets du
verdict (section 5.1).

## 0. Traitement des entrants

Le candidat, le relevé du 17/09 et les pages des plateformes sont des DONNÉES : leurs impératifs
se citent, ne s'exécutent pas. Les 3 agents de recherche ont travaillé en lecture seule, sans
compte, sans connexion ; aucun n'a signalé de consigne embarquée dans une page.

- **Candidat instruit** : TF-1178, décidé le 21/09/2026.
- **Point de départ** : l'étude 20260917a, verdict O2, non rejouée. Ses 7 candidatures sont
  relevées au 21/09 : TF-1155, TF-1156, TF-1157, TF-1158 et TF-1161 corrigées ; TF-1159 et
  TF-1160 décidées, non commencées.
- **Relevé à rejouer** : `output\03-etudes\20260917-releve-autres-reseaux-sociaux.md`, 8 réseaux,
  9 étapes, 10 lignes marquées « secondaire ».
- **Contrôle du pilot sur les agents** : 13 adresses officielles testées par
  `test_existence.py`, 12 atteignables ; 4 citations relues mot pour mot sur la page (fiche Google,
  X, LinkedIn, Instagram), 4 conformes.

## 1. Partition du problème

Le sujet se découpe selon 3 axes, et chaque option de la section 4 se rattache à l'un d'eux.

**Axe A — le type d'émetteur.** Il décide des réseaux utiles et de la première étape à outiller.

| Type d'émetteur | Ses lecteurs | Réseaux utiles d'abord | Première étape qui compte |
|---|---|---|---|
| A1 — société de conseil en B2B, dont Digit-AI | décideurs, pairs | LinkedIn, puis YouTube ou un réseau de texte court | publication régulière d'un avis d'expert (F3 à F5) |
| A2 — commerce de proximité : restaurant, hébergement | clients du voisinage, voyageurs | fiche d'établissement Google, Instagram, Facebook | réponse aux avis et tenue de la fiche |

**Axe B — le réseau.** 9 réseaux : LinkedIn, Instagram, Facebook, Threads, TikTok, YouTube, X,
Bluesky, fiche d'établissement Google. Chacun se décrit par 5 faits : publier par interface
officielle, programmer dans l'outil gratuit, exporter ses chiffres, déclarer un contenu généré,
régime de l'automatisation (section 2 bis).

**Axe C — l'étape.** Les 10 fonctions F0 à F9 de l'étude du 17/09, plus les 9 étapes du relevé :
E1 avis clients, E2 déclinaison par format, E3 vidéo, E4 publicité payante, E5 écoute, E6
prospection et partenariats, E7 gouvernance des comptes, E8 mesure jusqu'au résultat, E9 crise
(section 2 ter).

## 2. Non-recouvrement contre l'existant

Chaque ligne porte une citation relue le 21/09/2026.

| Existant examiné | Citation | Verdict |
|---|---|---|
| Référentiel `references\PLATEFORME-LINKEDIN.md` (pilot, TF-1156) | l.51 : « Un outil tiers agréé par LinkedIn est la seule voie conforme pour programmer une publication ou lire les chiffres sans export » ; titre et contenu : LinkedIn seul | **ne recouvre pas** les 8 autres réseaux ; et la phrase citée est **fausse pour la programmation** (section 2 bis, ligne LinkedIn) |
| Type de run `references\RUN-RESEAU.md` et `oracles\oracle-run-reseau.mjs` (pilot, TF-1158) | RR2 : « contrat de sortie du modèle « publication réseau » […] 150 à 300 mots » ; RUN-RESEAU l.23 : « interface est fermée à une petite société » | **recouvre** la séquence (ouverture, boucle hebdomadaire, revue, arrêt) pour tout réseau ; **ne recouvre pas** un autre format que le texte de 150 à 300 mots |
| Modèle « publication réseau » de `digit-ai-communication` (forge-agents, TF-1155) | `presets-livrables.md` l.23-24 : « Le profil d'une personne écrit à la première personne […] La page d'une organisation écrit en voix de marque » ; l.34 : « Longueur : 150 à 300 mots » | **recouvre** A1 sur LinkedIn ; **ne recouvre pas** une réponse à un avis, une légende d'image, un texte court |
| Contrôle de transparence `oracle-transparence` (forge-agents, TF-1030) | règles TR1 à TR3, formules fournies par `--mentions`, aucune formule de marque en dur | **recouvre** tous les réseaux : le contrôle ne dépend pas de la plateforme |
| forge-design, visuels | `catalogue.jsonl` cat-des-06 : « produire les images et visuels réels de mes maquettes », statut « prouve » | **recouvre** l'image d'une publication ; **ne recouvre pas** E3, la vidéo : aucun verbe outillé |
| forge-seo-geo | recherche du 21/09 dans le dépôt : 0 occurrence de « Google Business » ni de « fiche d'établissement » ; cat-seo-05 « Runs de suivi récurrents », statut « declare » | **ne recouvre pas** E1 ni la fiche d'établissement : la grille juge un site, pas une fiche |
| forge-data | `catalogue.jsonl` cat-dat-03 : « garantir que tout chiffre restitué est ancré à sa source » | **recouvre** la restitution des chiffres de tout réseau dès qu'un export existe |
| forge-observability | cat-obs-02 « Détecter la dérive », statut « prouve » ; cat-obs-03 « Veille citation IA », statut « declare », « méthode documentée seule » | **recouvre** la cadence de mesure ; **ne recouvre pas** E5, l'écoute des mentions |
| Gabarits de documents de partenariat (pilot, TF-1029) | `gabarits\documents\kit-partenaire\` et `charte-partenariat\`, présents sur `origin/main` | **recouvre** les pièces de E6 côté partenariats ; la prospection par messages reste hors outillage |
| Déclaration des intégrations (pilot, TF-1161) | `INTEGRATIONS-FOURNISSEURS.md`, section « LinkedIn — aucun connecteur, et c'est une déclaration » | **ne recouvre pas** les 8 autres réseaux : aucun n'y est déclaré |
| Produit de communication de Digit-AI (lecture seule) | `output\03-publications\README.md` : dossier sans aucune publication au 21/09 | **ne recouvre pas** l'usage : le premier cas réel sur LinkedIn n'est pas commencé |

### 2 bis. Les 5 faits par réseau, rejoués sur page officielle le 21/09/2026

**Mode de lecture du tableau.** Une ligne vaut un réseau. « Officiel » : la page de la plateforme
a été ouverte et la citation lue. « Secondaire » : le fait vient de sources tierces concordantes,
à confirmer avant de s'y fier. Les adresses et les dates des pages sont en section 3.

| Réseau | Publier par interface officielle, compte propre | Programmation gratuite dans l'outil de la plateforme | Export manuel des chiffres | Déclaration d'un contenu généré | Automatisation hors interface |
|---|---|---|---|---|---|
| LinkedIn | fermée : agrément à 2 paliers (rappel du 17/09) | **oui, officiel** : profil, de 10 minutes à 3 mois ; page, de 1 heure à 3 mois | oui, officiel (rappel) | aucune règle propre relevée | interdite par contrat, §8.2 (rappel) |
| Instagram | **ouverte**, officiel : compte professionnel, 100 publications par 24 h, sans revue d'application pour son propre compte | oui, officiel ; horizon non lu pour Instagram | existe ; format et profondeur : secondaire | officiel : obligatoire pour vidéo et son réalistes, facultative pour l'image, texte non visé | interdite sans autorisation, officiel |
| Facebook (pages) | **ouverte**, officiel : un rôle sur la page suffit ; quota dynamique, aucun chiffre publié | oui, officiel : de 20 minutes à 29 jours | oui, officiel ; format non lu | même règle que ci-dessus | interdite sans autorisation, officiel |
| Threads | **ouverte**, officiel : 250 publications par 24 h | annoncée par Meta le 15/08/2024 ; disponibilité actuelle : secondaire | aucun export de chiffres trouvé ; vues sur 90 jours | règle Meta ; corps de la page non lu | robots et collecteurs interdits, officiel |
| TikTok | sous audit, officiel du 04/08/2026 : sans audit, toute publication reste privée | oui, officiel : 10 jours, comptes professionnels, sur le web | non trouvé sur page lisible | officiel : obligatoire pour image, son et vidéo réalistes | interdite sans accord écrit, officiel du 15/07/2026 |
| YouTube | **ouverte**, officiel du 14/09/2026 : 10 000 unités par jour, 100 envois de vidéo | oui, officiel ; horizon non chiffré | oui, officiel : 500 lignes par export | officiel : obligatoire pour un contenu réaliste altéré | interdite sauf permission écrite, officiel |
| X | **payante à l'usage**, officiel relu par le pilot : 0,015 $ par publication créée, aucun palier gratuit sur la page | secondaire : 18 mois | secondaire : tableau de bord réservé aux abonnés payants | secondaire : étiquette facultative | encadrée, officiel : étiquette de compte automatisé, rattachement à un humain |
| Bluesky | **ouverte**, officiel : sans revue, 5 000 points par heure | absente, secondaire | absent, secondaire | aucune obligation, officiel du 19/09/2025 | non traitée par les conditions ; le titulaire répond de son compte, officiel du 14/08/2025 |
| Fiche d'établissement Google | sur liste blanche, officiel du 28/08/2026 relu par le pilot : fiche vérifiée et active depuis 60 jours, quota nul avant approbation | oui, officiel ; horizon non chiffré | oui, officiel ; profondeur non chiffrée | aucune déclaration ; usage de l'IA restreint sur les photos | officiel du 28/08/2026 : toute réponse automatisée à un avis exige le consentement exprès et préalable du gérant |

**3 comptes.** Publication par interface officielle, gratuite et ouverte à une petite structure
pour son propre compte : 5 réseaux sur 8 hors LinkedIn, tous confirmés sur page officielle —
Instagram, Facebook, Threads, YouTube, Bluesky. Programmation gratuite dans l'outil de la
plateforme : 6 réseaux sur 9 confirmés sur page officielle — LinkedIn, Instagram, Facebook,
TikTok, YouTube, fiche Google — 2 en source secondaire, 1 absente. Lignes du relevé du 17/09
passées de « secondaire » à « officiel » : 7 sur 10 ; 3 restent secondaires, toutes sur X, dont
le centre d'aide a rendu HTTP 403 aux agents et HTTP 404 au pilot, quand `docs.x.com` rend HTTP
200.

**3 écarts avec le relevé du 17/09.** L'étiquette de Meta n'oblige pas pour l'image, et vise
aussi le son. Le quota de Facebook n'est pas celui d'Instagram : il est dynamique. La
programmation de LinkedIn, « non vérifiée » le 17/09, existe et elle est gratuite.

### 2 ter. Les 9 étapes du relevé : porteur, outillage possible, sort

| Étape | Porteur existant | Régime de la plateforme | Sort proposé |
|---|---|---|---|
| E1 avis clients | aucun | répondre à la main sur une fiche vérifiée ; toute réponse automatisée exige un consentement exprès | **retenue** : l'IA propose une réponse sur le texte de l'avis collé, l'humain la publie — même règle que F6 |
| E2 déclinaison par format | modèle « publication réseau », texte long seulement | un contrat de sortie par famille de réseaux | **retenue** : 3 modèles de plus |
| E3 vidéo | aucun verbe outillé (cat-des-06 produit des images) | TikTok et YouTube en font la norme | **écartée**, avec sa conséquence écrite : TikTok et YouTube sortent du premier périmètre |
| E4 publicité payante | aucun | dépense | **écartée** : décision humaine (R-29) |
| E5 écoute des mentions | cat-obs-03, déclarée, méthode manuelle | aucune voie gratuite officielle relevée | **écartée** jusqu'à la revue |
| E6 prospection et partenariats | gabarits de partenariat (TF-1029) | messages automatisés interdits sur LinkedIn | **couverte** pour les pièces ; rien à construire |
| E7 gouvernance des comptes | aucun | rôles natifs des plateformes | **retenue** : une liste de contrôle à l'ouverture du run, sans aucun identifiant écrit |
| E8 mesure jusqu'au résultat | cat-dat-03 pour la restitution | liens balisés vers le site | **retenue** au minimum : 1 indicateur de contact parmi les 3 de F0 ; le balisage des liens attend la revue |
| E9 crise | consigne d'arrêt de RUN-RESEAU | sans objet | **inchangée** |

### 2 quater. Test d'admission R-28, rejoué sur le périmètre élargi

| Périmètre | 1. ≥ 2 verbes outillés absents ailleurs | 2. v0 exercée | 3. Cadence propre | 4. Surfaces le jour même | Admission |
|---|---|---|---|---|---|
| Gestion de réseaux sociaux, 9 réseaux, 19 étapes | **non** : publier par interface officielle serait 1 verbe neuf, et seulement sur 5 réseaux ; répondre aux avis n'est pas outillable sans consentement exprès ; le reste est porté par forge-agents, forge-design, forge-data, forge-observability | non : 0 publication | oui, hebdomadaire | non testé | **refusée** — critère 1 |

### 2 quinquies. Position sur la règle 38, là où la plateforme permet de programmer

R-38 point 3 le dit déjà : une page dont la publication est la finalité décidée du produit suit
« sa voie normale (gates MEP, GO humain) ». Une publication sur un réseau en est une. La position
proposée tient en 3 phrases. L'accord humain reste dû, et il se donne **par lot hebdomadaire** :
le calendrier de la semaine, relu en une fois, consigné comme RR5 l'exige. Le geste de
programmation reste humain et se fait **dans l'outil gratuit de la plateforme**, qui existe sur 6
réseaux sur 9 : il remplace « publier à l'heure », il ne demande aucun outil. Aucun outil maison
de diffusion n'est construit tant que le premier cas réel n'a pas mesuré le temps humain de ce
geste.

## 3. État de l'art daté

12 sources, toutes ouvertes le 21/09/2026 ; la date est celle que la page affiche, sinon celle de
la consultation.

| Source | Date | Localisateur | Fait retenu |
|---|---|---|---|
| Google, « Prerequisites », interface de la fiche d'établissement | 2026-08-28 | developers.google.com/my-business/content/prereqs | fiche vérifiée et active depuis 60 jours ; quota nul avant approbation |
| Google, « Policies », interface de la fiche d'établissement | 2026-08-28 | developers.google.com/my-business/content/policies | réponse automatisée à un avis : consentement exprès et préalable |
| YouTube, « Getting started », interface de données | 2026-09-14 | developers.google.com/youtube/v3/getting-started | 10 000 unités par jour par défaut, 100 envois de vidéo |
| TikTok, « Content Posting API — Get Started » | 2026-08-04 | developers.tiktok.com/docs/en/content-posting-api-get-started | sans audit, tout contenu reste en visibilité privée |
| TikTok, conditions d'utilisation | 2026-07-15 | tiktok.com/legal/page/us/terms-of-service/en | extraction automatisée interdite |
| Meta, « Content Publishing », plateforme Instagram | 2026-09-21 (consultation) | developers.facebook.com/docs/instagram-platform/content-publishing/ | compte professionnel ; 100 publications par 24 h |
| Meta, vue d'ensemble de l'interface de Threads | 2026-09-21 (consultation) | developers.facebook.com/documentation/threads/overview | 250 publications par 24 h |
| Meta, aide aux entreprises, programmation d'une publication de page | 2026-09-21 (consultation) | facebook.com/business/help/1252240869631062 | de 20 minutes à 29 jours |
| Meta, centre de transparence, étiquetage des contenus générés | 2025-02-19 | transparency.meta.com/governance/tracking-impact/labeling-ai-content/ | étiquette sur vidéo, son et image ; obligation sur vidéo et son réalistes |
| X, « Pricing », documentation de l'interface | 2026-09-21 (consultation) | docs.x.com/x-api/getting-started/pricing | paiement à l'usage, 0,015 $ par publication créée |
| Bluesky, conditions d'utilisation | 2025-08-14 | bsky.social/about/support/tos | le titulaire répond de tout usage de son compte |
| Aide LinkedIn, programmation d'une publication | 2026-09-21 (consultation) | linkedin.com/help/linkedin/answer/a1347212 | de 10 minutes à 3 mois, sans mention d'abonnement |

Points non vérifiés, déclarés : l'horizon de programmation d'Instagram, de YouTube et de la fiche
Google ; le format et la profondeur des exports d'Instagram, de TikTok et de la fiche Google ; les
3 lignes de X hors publication et automatisation ; la gratuité des interfaces de Meta, qu'aucune
page n'affirme en toutes lettres ; la disponibilité actuelle de la programmation sur Threads.

## 4. Options — jeu fermé O0-O4

**O0 — ne rien faire.** Réfutée. Coût du statu quo, mesuré : le référentiel du pilot porte une
phrase fausse sur la programmation de LinkedIn ; le type de run et son contrôle RR2 n'admettent
qu'un texte de 150 à 300 mots ; 0 des 8 autres réseaux est déclaré aux intégrations ; la fiche
d'établissement, premier levier d'un commerce de proximité, n'a aucun porteur ; l'objection du
17/09 reste sans réponse.

**O1 — le référentiel seul.** Corriger la phrase fausse ; étendre le référentiel LinkedIn en un
référentiel de plateformes à 9 réseaux, daté, avec sa péremption ; déclarer les 8 réseaux aux
intégrations. Coût : complexité simple × durée court. Exclut : tout usage hors LinkedIn, le run
et les modèles restant écrits pour un seul réseau. Se rattache à l'axe B.

**O2 — O1, plus un type de run paramétré par réseau et par type d'émetteur.** Tout O1, plus :
3 modèles de publication dans `digit-ai-communication` (réponse à un avis et nouvelle de la fiche
d'établissement ; légende d'image pour Instagram et Facebook ; texte court pour Threads, X et
Bluesky), chacun avec son contrat de sortie binaire ; RR2 lit le contrat du modèle déclaré par la
semaine au lieu d'un seul en dur ; l'ouverture du run reçoit une fiche « émetteur et réseaux » et
la liste de contrôle de E7 ; la position de la section 2 quinquies s'écrit dans RUN-RESEAU. Coût :
complexité moyen × durée moyen. Exclut : la vidéo, donc TikTok et YouTube ; la publicité ;
l'écoute ; tout outil de diffusion. Se rattache aux axes A, B et C.

**O3 — O2, plus un outil de diffusion par interface officielle sur les 5 réseaux ouverts.** Un
produit logiciel, par un run de build ordinaire. Coût : complexité complexe × durée long, plus
une dette de suivi des 5 interfaces. Ce qu'il apporterait : la programmation sur Bluesky, seul
des 5 à n'en offrir aucune, et le retrait d'un geste humain hebdomadaire de copie dans l'outil de
la plateforme. Exclue aujourd'hui : ce geste n'a jamais été mesuré, et l'accord humain par lot
reste dû dans tous les cas. À rouvrir à la revue si le temps humain relevé le justifie.

**O4 — une forge « réseaux sociaux ».** Refusée par la section 2 quater : critère 1 de R-28 en
défaut, même sur le périmètre élargi. Coût : complexité très complexe × durée long, sans capacité
de plus qu'O3.

## 5. Verdict

- **Option retenue** : **O2** — le référentiel de plateformes à 9 réseaux, plus un type de run
  paramétré par réseau et par type d'émetteur, avec 3 modèles de publication de plus. Aucune
  forge, aucun logiciel, aucune dépense.
- **Coût** : complexité moyen × durée moyen pour l'ensemble. Dette : un référentiel à 9 réseaux à
  relire à chaque péremption, contre 1 aujourd'hui.
- **Candidature(s) émise(s)** : 6, en sidecar
  `input\01-candidatures\reseaux-sociaux-complement-verdict-o2-20260921a.tf.jsonl`.
- **Plan de revue** : **2026-10-09**, même rendez-vous que la revue du verdict du 17/09 : état
  des 6 objets, temps humain relevé sur le premier cas réel, réouverture ou non d'O3.
- **Test rétro** : joué en section 5.2 ; 1 élément retiré.
- **Ordre conseillé** : le premier cas réel reste LinkedIn, comme décidé le 17/09. Le deuxième
  est une fiche d'établissement avec ses avis, pour un client de type A2, dans une session
  ouverte chez son produit.

### 5.1 Les 6 objets, typés et attribués

| # | Objet | Type | Porteur | Sert |
|---|---|---|---|---|
| C1 | Corriger la phrase fausse du référentiel LinkedIn sur la programmation, et citer la page d'aide | ligne de référentiel | pilot | F4, F5 |
| C2 | Référentiel de plateformes à 9 réseaux : les 5 faits par réseau, page officielle, date, solidité, péremption | référentiel périssable (loi n° 4) | pilot (`references\`) | axe B |
| C3 | Déclaration des 8 réseaux aux intégrations : connecteur absent, programmation dans l'outil de la plateforme, export manuel | lignes de référentiel | pilot (`INTEGRATIONS-FOURNISSEURS.md`) | F5, F7 |
| C4 | 3 modèles de publication avec contrat de sortie binaire : avis et fiche d'établissement, légende d'image, texte court | extension d'un verbe outillé | forge-agents (`digit-ai-communication`) | E1, E2 |
| C5 | Type de run paramétré : fiche « émetteur et réseaux », liste de contrôle de gouvernance des comptes, RR2 lisant le contrat du modèle déclaré, accord par lot et programmation dans l'outil de la plateforme | type de run et son contrôle | pilot (`RUN-RESEAU.md`, `oracle-run-reseau.mjs`) | F0, F4, F5, E7 |
| C6 | Rejouer les 5 points non vérifiés et les 3 lignes secondaires de X avant la péremption du référentiel | relevé | pilot | axe B |

### 5.2 Test rétro (Opérationnel → Tactique → Stratégie → Intention)

- **C1, C2, C3** → tactique « 5 faits rejoués par réseau » → stratégie « ne rien affirmer sans
  page officielle datée » → intention « là où ses lecteurs sont ». Sans rupture.
- **C4** → tactique « 19 étapes, dont E1 et E2 » → stratégie « ouvrir le verdict du 17/09 » →
  intention « d'autres étapes du process », mot pour mot. Sans rupture.
- **C5** → tactique « 2 types d'émetteur » → stratégie « ne rien construire que la plateforme
  offre déjà » → intention « sans dépendre du temps libre du dirigeant » : l'accord par lot borne
  ce temps. Sans rupture.
- **C6** → tactique « solidité par ligne » → stratégie « page officielle datée » → intention.
  Sans rupture.
- **Élément retiré** : l'outil de diffusion d'O3. Il remonte à « ne rien construire que la
  plateforme offre déjà » et s'y heurte : 6 réseaux sur 9 programment gratuitement. Retiré
  jusqu'à la revue.

Les questions du demandeur, rejouées. « Pourquoi que LinkedIn ? » : parce que 3 hypothèses
empilées avaient fermé la liste ; elles sont rouvertes ou levées. « D'autres réseaux ? » : 8,
décrits par 5 faits chacun, 7 lignes sur 10 passées en source officielle. « D'autres étapes ? » :
9, dont 4 retenues, 1 couverte, 1 inchangée et 3 écartées avec leur motif.

## Interdits (tenus)

Aucun critère subjectif ; jeu fermé O0-O4 ; chaque ligne de la section 2 citée ; chaque source
datée ; O0 réfutée sur coût cité ; aucun effort chiffré autrement qu'en complexité × durée ; aucun
nom de personne ni de client ; aucune écriture hors du pilot ; aucun compte créé, aucune
connexion, aucun identifiant de compte dans un fichier.
