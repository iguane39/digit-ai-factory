---
role: les faits MESURÉS sur les interfaces de fournisseurs tiers — ceux qu'aucune documentation officielle ne dit là où on les cherche, et dont l'ignorance a coûté un aller-retour au moins une fois
sources_de_verite: [todo/TODO.jsonl (les items qui les ont mesurés, avec leur coût), gabarits/.env.example du projet concerné (les clés et leurs portées)]
verifie_le: 2026-09-21
---

# Faits mesurés sur les interfaces de fournisseurs

**Ce document existe parce qu'une donnée périssable est une donnée, pas du code** (loi transverse
n° 4). Chaque fait ci-dessous a été **mesuré**, il porte sa **date**, et il dit **comment le
rejouer** — parce qu'un fait sur une interface tierce se périme sans avertir, et qu'un fait
invérifiable ne vaut pas mieux qu'une intuition.

**Ce n'est pas une documentation de fournisseur.** On n'y trouve que ce qui **n'est pas écrit là
où on le cherche**, et dont l'ignorance a coûté un aller-retour au moins une fois. Un fait
disponible dans la documentation officielle n'a rien à faire ici : il y vieillirait mal et
personne ne l'y chercherait.

**Précaution de lecture.** Aucun secret ne figure ici, jamais — ni jeton, ni identifiant de compte,
ni clé. Les **noms** de variables et les **portées** à demander, oui : c'est précisément ce que la
prose d'une conversation perd (TF-0588).

---

## OVH — API et zones DNS

*Mesuré les 24 et 25/08/2026 par le run `produit-02` (TF-0587, TF-0608, TF-0610).*

### Ce qui coûte si on l'ignore

Sept faits sur l'API et les zones d'OVH, dont deux ont coûté un jeton perdu chacun. Une ligne vaut
un fait mesuré, avec ce que son ignorance coûte et la commande qui le rejoue.

| Fait mesuré | Ce que ça coûte | Comment le rejouer |
|---|---|---|
| La page de création de jeton répond **200 en GET** et **404 en HEAD** | une sonde `curl -I` déclare la page morte **à tort**, et on cherche ailleurs | `curl -s -o /dev/null -w "%{http_code}" https://www.ovh.com/auth/api/createToken` puis la même avec `-I` |
| Dans le formulaire de jeton, chaque droit doit être **ajouté par le bouton `+`** | valider sans cliquer enregistre les méthodes avec un **chemin VIDE** : le jeton ne donne accès à rien, et tout appel rend `403 This call has not been granted`. **Deux jetons perdus ainsi** | lire la portée réellement accordée, voir la ligne suivante |
| La portée réellement accordée se lit par **`GET /auth/currentCredential`** | c'est le **seul appel toujours autorisé**, donc la seule vérification fiable — et elle prend 2 secondes | `GET /1.0/auth/currentCredential` sur l'endpoint EU |
| Le `*` d'un droit **traverse les barres obliques** | `/domain/zone/x/*` couvre bien `/domain/zone/x/record/123` — vérifié empiriquement | comparer la portée accordée à un appel réel sur un sous-chemin |
| Mais `/domain/zone/*/*` **ne couvre PAS** `/domain/zone` | énumérer les zones du compte exige **ce droit à part**, et on le découvre au moment où on en a besoin | demander `GET /domain/zone` explicitement dans la portée |
| Un jeton scopé aux zones **ne couvre pas** `/domain/<nom>/nameServer` | changer les serveurs de noms exige `/domain/*` — découvert au moment précis où il le fallait | `GET /1.0/domain/<nom>/nameServer` avec un jeton scopé aux zones seules |
| La redirection DNS d'OVH **n'écoute pas le port 443** | toute redirection posée par `POST /domain/zone/<zone>/redirection` est **HTTP SEULEMENT**, et l'objet rendu par l'API ne porte **aucun champ SSL** — rien n'y signale la limite | mesure directe : port 443 **FERMÉ** sur `213.186.33.5`, port 80 ouvert (25/08/2026) |

### Points techniques qui font perdre une heure

- **Endpoint EU** : `https://eu.api.ovh.com/1.0`.
- **Signature v1** : SHA1 de `AS + CK + MÉTHODE + URL + CORPS + TS`. Elle est **sensible au temps** :
  appeler `GET /auth/time` d'abord pour calculer le décalage d'horloge.
- **Sous Git Bash**, MSYS convertit les chemins d'API en chemins Windows. `MSYS_NO_PATHCONV=1` est
  **obligatoire**, sans quoi l'URL appelée n'est pas celle qu'on croit.
- **Types de redirection valides** : `visible`, `invisible`, `visiblePermanent`.

### Les marqueurs de parking, qui ressemblent à des enregistrements légitimes

Une zone **parquée** chez OVH porte des artefacts internes au parking, sans aucun sens ailleurs :

- des `TXT` de la forme `"<chiffre>|<valeur>"` — par exemple `1|www.exemple.com`, `3|welcome`,
  `4|https://…` ;
- des `A` pointant vers **`213.186.33.5`**.

**Migrés tels quels vers un autre fournisseur** — ce que fait toute copie aveugle — ils deviennent
des `TXT` parasites **à la racine du domaine**, précisément là où vivent le SPF, le DMARC et les
jetons de vérification de propriété des services tiers. Le `A` est pire : il pointe vers
l'infrastructure de redirection **HTTP seule** d'OVH, donc il **réintroduit le défaut même** qu'on
migre pour corriger.

**À écarter par motif, jamais à l'œil** : un `TXT` commençant par `<chiffre>|`, et un `A` vers
`213.186.33.5`. Même famille que les artefacts de fournisseur pris pour de la matière de projet.

---

## Cloudflare — jetons, zones et redirections

*Mesuré le 25/08/2026 par le run `produit-02` (TF-0611, TF-0612, TF-0613).*

### Le modèle de permissions ne dit pas ce qu'on croit

Quatre faits sur les jetons de Cloudflare, dont un nom de permission inventé de mémoire qui a
envoyé l'exploitant chercher un menu inexistant. Une ligne vaut un fait mesuré et son coût.

| Fait mesuré | Ce que ça coûte si on l'ignore |
|---|---|
| Il n'existe **PAS** de permission « Account → Zone → Create » | ce nom a été **inventé de mémoire** et l'exploitant a été envoyé la chercher dans un menu où elle n'est pas. La création de zone fonctionne avec **`Zone:Zone:Edit`** plus le compte listé dans *Account Resources* — vérifié, quatre zones créées |
| La section *Account Resources* n'apparaît **que si** une permission de niveau compte existe | sans besoin réel, la bonne réponse est de **supprimer la ligne** : `Zone Resources > All zones from an account` scope déjà le jeton |
| `GET /user/tokens/verify` donne la validité et le statut du jeton ; `GET /accounts` donne l'identifiant de compte | inutile de faire recopier l'identifiant depuis l'URL du tableau de bord |
| Une **paire de serveurs de noms identifie le compte** | `dale`/`magnolia` contre `autumn`/`hal` a suffi à établir qu'un domaine appartenait à un **autre compte** que les quatre migrés — un fait qu'aucune interface ne dit |

> **La leçon dépasse Cloudflare, et c'est la plus utile du lot** : *ne jamais dicter de mémoire un
> nom d'option d'interface.* Soit on l'a vérifié, soit on décrit le **résultat cherché** et on laisse
> l'humain trouver l'intitulé — il a l'écran sous les yeux, nous non.

### Le scan DNS automatique peut n'importer strictement rien, en silence

**Mesure sur quatre zones ajoutées par API : ZÉRO enregistrement importé, QUARANTE-SEPT manquants**
— dont les 12 `MX`, les 4 `SPF`, les 2 clés `DKIM` et les 3 `SRV`. **Aucune erreur, aucun
avertissement** : les zones s'affichent simplement comme prêtes à basculer.

Changer les serveurs de noms dans cet état **coupe la messagerie des quatre domaines
instantanément**, et les courriels perdus pendant la coupure sont irrécupérables. Le mode de
défaillance est **silencieux**, l'effet **immédiat**, la perte **définitive** : c'est ce qui classe
ce fait au plus haut.

**La procédure de migration DNS et son ORDRE — qui EST le correctif — vit chez forge-ops**
(`docs/migration-dns.md`), avec le contrôle de différence qui en est l'étape 3.

### Redirections : ce qui les fait fonctionner, et ce qui les casse

- Cloudflare ne termine le **TLS** que pour les hôtes portant un enregistrement **proxifié**. Sans
  lui, le 443 reste fermé et la redirection ne se déclenche **jamais**.
- Le motif employé est un `A` **proxifié** vers **`192.0.2.1`** — TEST-NET-1 (RFC 5737), **non
  routable à dessein** : Cloudflare intercepte à sa périphérie avant toute tentative de joindre une
  origine.
- Les **Single Redirects** (phase `http_request_dynamic_redirect`) ont été **refusés** avec
  `10000 Authentication error` sous un jeton portant pourtant `Zone:Page Rules:Edit` — ils relèvent
  d'une **autre permission**. Les **Page Rules** fonctionnent avec ce droit, et **`$1`** dans l'URL
  cible **préserve le chemin** : un lien vers `/gites` atterrit sur `/gites` et non sur l'accueil,
  ce qui change tout pour le référencement. *Réserve à noter : Cloudflare considère les Page Rules
  comme héritées.*
- **Garde-fou indispensable** : **aucun** `MX`, `SRV`, `CNAME` de messagerie ni clé `DKIM` ne doit
  être proxifié — les proxifier **casse le courrier aussi sûrement que les oublier**. Le contrôle
  automatisable qui le vérifie après migration vit chez forge-ops.

---

## Google Ads — import web, accès en lecture par l'API, et ce que l'import ne règle pas

*Mesuré les 21 et 22/09/2026 par le run `produit-02`, pendant la mise en ligne de cinq campagnes
(lot `Produit-02 - RETOURS - 20260922a`, annexe B ; TF-1364). Aucun identifiant de compte, de
projet ni de propriété n'y figure.*

### Ce qui coûte si on l'ignore

Quatorze faits, dont le premier a coûté un dépôt refusé en entier. Le tableau se lit ligne à
ligne : la première colonne dit le fait mesuré, la deuxième ce que son ignorance a coûté pendant
ces deux soirées, la troisième comment le rejouer. Les lignes sont classées dans l'ordre du
déploiement : l'import web, puis le logiciel de bureau Google Ads Editor, puis l'API et les
réglages d'après import.

| Fait mesuré | Ce que ça coûte | Comment le rejouer |
|---|---|---|
| L'import en masse du web (Outils → Actions groupées → Importations) n'accepte PAS le format de Google Ads Editor, et ses en-têtes ne sont publiés nulle part en ligne | premier dépôt refusé en entier : 201 lignes d'erreurs | lien « Télécharger un exemple de modèle » de l'écran Importations, un modèle par type d'objet |
| Chaque ligne de campagne exige la colonne `EU political ads` (valeur `No` pour une location saisonnière) | `Missing value in "EU political ads"` sur chaque campagne | modèle `campaign_template.csv`, 33 colonnes |
| Les réglages de campagne vont sur la ligne de campagne elle-même — type, réseaux, budget, stratégie, langue, zone ; la ligne de continuation d'Editor est refusée | `Missing value in "Campaign type"`, `Missing value in "Budget"` | dépôt d'un fichier au format Editor |
| Un mot-clé à exclure au niveau campagne s'écrit `Row Type = Negative keyword`, `Level = Campaign`, `Type = Broad match` ; `Campaign Negative Broad` est refusé | `The value 'Campaign Negative Broad' in column 'Criterion Type' is invalid` | modèle `ad_group_negative_keyword_template.csv` |
| Une campagne refusée fait échouer tous ses enfants : 181 erreurs sur 201 étaient des cascades | on cherche 181 causes là où il y en a 5 | lire les causes distinctes, pas le compte des lignes |
| Un fichier UNIQUE mêlant 5 types de lignes (`Row Type` : Campaign, Ad group, Keyword, Negative keyword, Ad ; `Action = Add`) est accepté | aucun ; évite cinq dépôts et cinq aperçus | 191 lignes sur 191 acceptées, 22/09 |
| Le bouton de contrôle avant écriture s'appelle « Aperçu », à côté d'« Appliquer » ; il compte les modifications acceptées et les erreurs sans rien écrire | un parcours qui nomme « Prévisualiser » égare l'humain | écran Importations, après le choix du fichier |
| Aucune des 33 colonnes du modèle de campagne ne règle l'option de zone : l'import laisse « Présence ou intérêt » | des annonces montrées hors du pays visé | `campaign.geo_target_type_setting.positive_geo_target_type` en lecture : 5 campagnes sur 5 le 22/09 ; correction à la main, Paramètres → Zones → options |
| La ligne de commande d'Editor (`-importFile`) démarre l'import puis attend une validation à l'écran, même avec `-forceAcceptChanges` ; aucune de ses 70 options ne publie | Editor ne s'automatise pas : 2 essais, 0 campagne importée | `google_ads_editor.exe --help`, puis essai sur une copie de la base locale |
| Editor n'a pas résolu la colonne `Location` écrite en noms de pays anglais (`Location need resolve`, identifiant de zone à 0) ; l'import web a résolu les mêmes noms | 5 campagnes sans pays valide avant publication, dans Editor | relecture de la table des zones dans une copie de la base locale d'Editor ; relecture des zones par l'API après l'import web |
| API : v17 à v21 rendent `404` en page HTML (versions retirées) ; v22 à v25 rendent `403 SERVICE_DISABLED` tant que l'API n'est pas activée dans le projet Cloud | un 404 lu comme « accès manquant » fait prescrire des étapes inutiles | `googleads.googleapis.com/v25/customers:listAccessibleCustomers` avec le jeton d'un compte de service |
| Depuis le 09/09/2026, plus de jeton de développeur ni de compte administrateur : inscription dans la console Google Cloud ; le niveau « Explorer » lit un compte réel ; la bibliothèque `google-ads` 32.0.0 construit son client sans jeton | trois actions prescrites de mémoire, puis retirées | pages officielles « Developer token » et « Access levels » de la documentation de l'API ; `uv run --with google-ads` |
| Un compte de service s'ajoute comme utilisateur du compte publicitaire (Admin → Accès et sécurité → Utilisateurs), niveau « Lecture seule », et la lecture fonctionne sans étape d'acceptation | aucun, mais personne ne le savait | lecture réussie le 22/09 à 21:49 |
| Après import : annonces en cours d'examen ; les actions de conversion héritées d'une ancienne campagne intelligente restent PRINCIPALES, et l'une peut viser un événement que le site n'envoie jamais | campagnes activées avec une colonne « Conversions » à zéro quoi qu'il arrive | `conversion_action.primary_for_goal` et `ad_group_ad.policy_summary.review_status` en lecture seule |

### Ce qui se demande, ou se relit, avant d'agir

- **Deux pièces ne se téléchargent que depuis le compte**, par l'humain qui y est connecté. Elles
  se demandent dans le tour qui prépare le dépôt, jamais après l'échec (TF-1361, TF-1363) : les
  **modèles d'import** de l'écran Importations, un par type d'objet, sur lesquels tout générateur
  se bâtit et contre lesquels il confronte ses colonnes et ses valeurs à chaque génération ; et le
  **rapport d'erreurs** d'un dépôt refusé, qui nomme les causes distinctes.
- **Une sonde d'accès cite la version d'API en service** le jour de la sonde, relue dans la
  documentation officielle (TF-1362) : une sonde sur une version retirée mesure un `404` qui ne dit
  rien de l'accès.

### Ce que ce référentiel ne porte pas encore

Le kit éprouvé chez le produit compte cinq pièces (annexe C du lot) : le générateur de l'import web
confronté aux modèles (191 lignes sur 191 acceptées), le relevé en lecture seule qui compare le
compte au plan, le fichier des changements calculé depuis l'état lu du compte, le plan de campagnes
qui les alimente, et les commandes documentées. Il reste chez le produit à ce jour. En faire un kit
de la factory, rangé et recetté hors de tout produit, est une construction à part, déclarée
restante sous TF-1364.

---

## LinkedIn — aucun connecteur, et c'est une déclaration

*Établi le 17/09/2026 par l'étude `output\03-etudes\20260917-etude-opportunite-gestion-reseaux-sociaux.md`
(TF-1161, décision humaine D-2 (a)). L'étude du 11/09 avait retiré le connecteur de diffusion de
son verdict en laissant la question ouverte ; elle est tranchée ici.*

| Fait établi | Ce que ça coûte si on l'ignore | Comment le rejouer |
|---|---|---|
| **Aucun connecteur n'est déclaré, et aucun ne peut l'être sans agrément** : l'interface programmatique de gestion de communauté s'obtient en deux paliers, sur revue, pour un éditeur au cas d'usage établi | un run qui « branche LinkedIn » construit une affordance non câblée (loi n° 1) | `learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview` (page datée du 2026-03-31) |
| **Toute automatisation hors de cette interface est interdite par contrat** — publier, commenter, réagir, envoyer un message, extraire | le compte de l'émetteur s'expose à une restriction ; publier et répondre sont des gestes humains | `linkedin.com/legal/user-agreement`, date « Effective on » (2025-11-03 au relevé), §8.2 |
| **Les chiffres viennent de l'export manuel**, gratuit : page en XLS, profil en XLSX sur 365 jours glissants | sans export hebdomadaire, ni performance ni engagement ne se mesurent | aide LinkedIn, réponses a551206 (page) et a701208 (profil) |
| **Un outil tiers agréé est une dépense récurrente** | décision humaine (R-29), jamais un choix de run ; prix non relevé | — |

Le détail daté, avec sa péremption, vit dans `references\PLATEFORME-LINKEDIN.md` ; le type de run
qui en dépend est `references\RUN-RESEAU.md`. **Corrigé le 21/09/2026 (TF-1274)** : un outil
tiers n'est pas nécessaire pour programmer une publication, LinkedIn le fait gratuitement de 10
minutes à 3 mois ; il ne reste une dépense que pour lire les chiffres sans export.

## Les 8 autres réseaux — aucun connecteur non plus, et c'est un choix

*Établi le 21/09/2026 par l'étude `output\03-etudes\20260921-etude-opportunite-reseaux-sociaux-complement.md`
(TF-1276, décision humaine D-12 (a)). Sur LinkedIn, l'absence de connecteur est imposée par le
contrat. Ici elle est choisie : 5 de ces 8 réseaux ouvrent gratuitement leur interface de
publication, et la tentation d'un outil maison est réelle.*

| Fait établi | Ce que ça coûte si on l'ignore | Comment le rejouer |
|---|---|---|
| **Aucun connecteur n'est construit, sur aucun des 9 réseaux.** Instagram, Facebook, Threads, YouTube et Bluesky ouvrent leur interface de publication à un compte propre, sans dépense | un run qui « branche un réseau » construit un outil de diffusion que personne n'a décidé, et contourne l'accord humain par lot de la règle 38 | `references\PLATEFORMES-RESEAUX.md`, ligne « Publier par interface officielle » de chaque réseau |
| **La programmation se fait dans l'outil gratuit de la plateforme, par l'humain** : LinkedIn, Instagram, Facebook, Threads, TikTok, YouTube et la fiche d'établissement Google l'offrent, relevé sur source officielle le 21/09/2026 | construire ce que la plateforme offre déjà ; le seul gain d'un outil maison serait un geste hebdomadaire que personne n'a mesuré | même référentiel, ligne « Programmer » |
| **X est payant à l'usage** : 0,015 $ par publication créée, aucun palier gratuit sur la page de tarification | une dépense récurrente engagée sans décision humaine (R-29) | `docs.x.com/x-api/getting-started/pricing`, relu le 21/09/2026 |
| **TikTok exige un audit, la fiche Google une liste blanche** : sans audit, toute publication par interface reste privée ; sans fiche vérifiée depuis 60 jours, le quota est nul | une semaine perdue à attendre une publication qui ne sortira jamais | même référentiel, sections TikTok et fiche d'établissement |
| **Répondre à un avis de façon automatisée exige le consentement exprès et préalable du gérant** | une réponse publiée sans lui engage le commerce et enfreint la politique de l'interface | `developers.google.com/my-business/content/policies`, page du 2026-08-28 |
| **Les chiffres viennent de l'export manuel**, là où il existe ; il n'a été trouvé ni sur Threads, ni sur Bluesky | promettre une mesure sur un réseau qui n'exporte rien | même référentiel, ligne « Exporter ses chiffres » |

Le détail daté, avec sa solidité ligne à ligne et sa péremption, vit dans
`references\PLATEFORMES-RESEAUX.md` ; le type de run qui en dépend est `references\RUN-RESEAU.md`.

---

## Ce que ce document ne garantit pas

- **Il vieillit, et vite.** Chaque section porte la date de sa mesure, du 24/08 au 22/09/2026. Une interface de
  fournisseur change sans avertir : chaque ligne porte donc **comment la rejouer**, et une ligne
  qu'on ne sait plus rejouer doit être **retirée** plutôt que conservée par prudence.
- **Il ne couvre que ce qui a été payé.** Aucun fait n'y figure « au cas où » : un fait sans coût
  mesuré n'a ni preuve ni raison d'être retenu, et il diluerait ceux qui en ont une.
- **Il ne remplace pas le réceptacle.** Les clés et leurs portées vivent dans le
  `.env.example` du projet concerné, jugé par `oracles\oracle-parite-configuration.mjs` (TF-0588,
  TF-0589) : *un secret attendu se prépare, il ne se décrit pas en prose.* Ce document explique le
  **pourquoi** d'une portée ; le gabarit porte le **quoi**.
- **Il ne dit rien des tarifs ni des quotas** : ce sont des données commerciales, elles se périment
  plus vite encore, et aucune décision de dépense ne se prend sans l'humain (R-29).
