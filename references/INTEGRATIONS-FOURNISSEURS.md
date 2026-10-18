---
role: les faits MESURÉS sur les interfaces de fournisseurs tiers — ceux qu'aucune documentation officielle ne dit là où on les cherche, et dont l'ignorance a coûté un aller-retour au moins une fois
sources_de_verite: [todo/TODO.jsonl (les items qui les ont mesurés, avec leur coût), gabarits/.env.example du projet concerné (les clés et leurs portées), input/00-retours/Produit-79 - RETOURS - 20261017b.md (retours RP-11 : référentiel Google, RG-1 : sources du SEO, RA-9 : connexion Google d'un produit, et garde-fou de plateforme relevé ; item TF-1848 du registre, décidé par R-58), documentation de Google lue le 2026-10-18 (adresses citées ligne à ligne dans les sections Google)]
verifie_le: 2026-10-18
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

| Fait mesuré | Coût si on l'ignore | Comment le rejouer |
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

| Fait mesuré | Coût si on l'ignore |
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

*Redaté le 18/10/2026 (TF-1848, RP-11 du lot `Produit-79 - RETOURS - 20261017b`) : la ligne « API : versions »
du premier tableau ; les autres lignes gardent leur date de mesure.*

### Ce qui coûte si on l'ignore

Quatorze faits, dont le premier a coûté un dépôt refusé en entier. Le tableau se lit ligne à
ligne : la première colonne dit le fait mesuré, la deuxième ce que son ignorance a coûté pendant
ces deux soirées, la troisième comment le rejouer. Les lignes sont classées dans l'ordre du
déploiement : l'import web, puis le logiciel de bureau Google Ads Editor, puis l'API et les
réglages d'après import.

| Fait mesuré | Coût si on l'ignore | Comment le rejouer |
|---|---|---|
| L'import en masse du web (Outils → Actions groupées → Importations) n'accepte PAS le format de Google Ads Editor, et ses en-têtes ne sont publiés nulle part en ligne | premier dépôt refusé en entier : 201 lignes d'erreurs | lien « Télécharger un exemple de modèle » de l'écran Importations, un modèle par type d'objet |
| Chaque ligne de campagne exige la colonne `EU political ads` (valeur `No` pour une location saisonnière) | `Missing value in "EU political ads"` sur chaque campagne | modèle `campaign_template.csv`, 33 colonnes |
| Les réglages de campagne vont sur la ligne de campagne elle-même — type, réseaux, budget, stratégie, langue, zone ; la ligne de continuation d'Editor est refusée | `Missing value in "Campaign type"`, `Missing value in "Budget"` | dépôt d'un fichier au format Editor |
| Un mot-clé à exclure au niveau campagne s'écrit `Row Type = Negative keyword`, `Level = Campaign`, `Type = Broad match` ; `Campaign Negative Broad` est refusé | `The value 'Campaign Negative Broad' in column 'Criterion Type' is invalid` | modèle `ad_group_negative_keyword_template.csv` |
| Une campagne refusée fait échouer tous ses enfants : 181 erreurs sur 201 étaient des cascades | on cherche 181 causes là où il y en a 5 | lire les causes distinctes, pas le compte des lignes |
| Un fichier UNIQUE mêlant 5 types de lignes (`Row Type` : Campaign, Ad group, Keyword, Negative keyword, Ad ; `Action = Add`) est accepté | aucun ; évite 5 dépôts et 5 aperçus | 191 lignes sur 191 acceptées, 22/09 |
| Le bouton de contrôle avant écriture s'appelle « Aperçu », à côté d'« Appliquer » ; il compte les modifications acceptées et les erreurs sans rien écrire | un parcours qui nomme « Prévisualiser » égare l'humain | écran Importations, après le choix du fichier |
| Aucune des 33 colonnes du modèle de campagne ne règle l'option de zone : l'import laisse « Présence ou intérêt » | des annonces montrées hors du pays visé | `campaign.geo_target_type_setting.positive_geo_target_type` en lecture : 5 campagnes sur 5 le 22/09 ; correction à la main, Paramètres → Zones → options |
| La ligne de commande d'Editor (`-importFile`) démarre l'import puis attend une validation à l'écran, même avec `-forceAcceptChanges` ; aucune de ses 70 options ne publie | Editor ne s'automatise pas : 2 essais, 0 campagne importée | `google_ads_editor.exe --help`, puis essai sur une copie de la base locale |
| Editor n'a pas résolu la colonne `Location` écrite en noms de pays anglais (`Location need resolve`, identifiant de zone à 0) ; l'import web a résolu les mêmes noms | 5 campagnes sans pays valide avant publication, dans Editor | relecture de la table des zones dans une copie de la base locale d'Editor ; relecture des zones par l'API après l'import web |
| API : versions. Mesure du 22/09 : v17 à v21 rendaient `404` en page HTML (versions retirées), v22 à v25 rendaient `403 SERVICE_DISABLED` tant que l'API n'était pas activée dans le projet Cloud. **Redaté le 18/10/2026** : la table des échéances de Google (page du 14/10/2026) liste v23 à v26 et plus v22 ; v26 est sortie le 14/10 ; v23 sera retirée en février 2027, date que Google dit indicative. Constat de Produit-79 le 17/10, non rejoué ici faute de jeton : `v22` rend `400 UNSUPPORTED_VERSION`, `v23` est en service, `listAccessibleCustomers` répond au niveau d'accès « Test ». Relevé sans jeton le 18/10 : `v21` et `v27` rendent `404` en page HTML, `v22` à `v26` rendent `401` | un 404 lu comme « accès manquant » fait prescrire des étapes inutiles ; ce référentiel donnait v22 en service jusqu'au 18/10, et une sonde sur v22 mesure un `400` qui ne dit rien de l'accès | table : `developers.google.com/google-ads/api/docs/sunset-dates`, section « Timetable » (page du 2026-10-14, lue le 18/10/2026) ; sonde : `curl -s -o /dev/null -w "%{http_code}\n" https://googleads.googleapis.com/<vN>/customers:listAccessibleCustomers` sans jeton (`404` = version absente ; `401` = chemin routé, ce qui n'établit pas que la version est en service, puisque v22 rend `401` puis `400` avec jeton), puis la même requête avec le jeton de la voie choisie (compte de service, ou voie utilisateur de la section suivante) pour lire le `400`, le `403` ou le `200` |
| Depuis le 09/09/2026, plus de jeton de développeur ni de compte administrateur : inscription dans la console Google Cloud ; le niveau « Explorer » lit un compte réel ; la bibliothèque `google-ads` 32.0.0 construit son client sans jeton | trois actions prescrites de mémoire, puis retirées | pages officielles « Developer token » et « Access levels » de la documentation de l'API ; `uv run --with google-ads` |
| Un compte de service s'ajoute comme utilisateur du compte publicitaire (Admin → Accès et sécurité → Utilisateurs), niveau « Lecture seule », et la lecture fonctionne sans étape d'acceptation | aucun, mais personne ne le savait | lecture réussie le 22/09 à 21:49 |
| Après import : annonces en cours d'examen ; les actions de conversion héritées d'une ancienne campagne intelligente restent PRINCIPALES, et l'une peut viser un événement que le site n'envoie jamais | campagnes activées avec une colonne « Conversions » à zéro quoi qu'il arrive | `conversion_action.primary_for_goal` et `ad_group_ad.policy_summary.review_status` en lecture seule |

### Les limites de l'API et d'un relevé vert

*Mesuré du 24 au 29/09/2026 pendant le run `produit-02-run-t140` (lot
`Produit-02 - RETOURS - 20261001b`, RT-111, RT-112, RT-114 ; TF-1585, TF-1586, TF-1588). Ces faits
périment avec l'écran et l'API : chaque ligne dit comment la rejouer, et une ligne qu'on ne sait
plus rejouer se retire.*

| Fait mesuré | Coût si on l'ignore | Comment le rejouer |
|---|---|---|
| **Un relevé de conformité au plan n'est pas un verdict de diffusion.** Le 24/09, 23 h après l'activation, le relevé du produit rendait « 0 écart » (exit 0) sur 5 campagnes à 0 impression, 0 clic, 0 € | un compte qui ne diffuse pas passe pour sain ; le premier relevé prévu le 15/10 aurait laissé passer trois semaines de diffusion nulle | lire les impressions depuis `campaign.start_date_time`, jour courant compris, et sortir en écart quand une campagne `ENABLED` et `SERVING` reste à 0 impression 24 h après l'activation ; recette à double sens : un compte conforme à 0 impression doit sortir rouge |
| **`LAST_30_DAYS` exclut aujourd'hui** (documentation de l'API : « not including today »), et une requête de métriques n'imprime pas les lignes à 0 impression | la seule requête de métriques du relevé ne voyait ni la journée en cours ni les campagnes muettes | `segments.date DURING LAST_30_DAYS` comparé à une borne explicite `segments.date BETWEEN … AND <aujourd'hui>` sur le même compte |
| **Des prérequis du compte ne se lisent dans aucun service de l'API.** Validation de l'annonceur (Admin → Règlement → Compte), mode de paiement, code promotionnel à saisir dans les 10 jours de la réactivation, notifications : aucun des 110 services de l'API v25 ne les lit, et `IdentityVerificationService` refuse la lecture hors facturation mensuelle | environ 24 h de diffusion nulle et 4 tours de diagnostic, pendant que l'API disait 5 campagnes sur 5 `ENABLED`, `SERVING`, `ELIGIBLE`, 17 annonces sur 17 `APPROVED`, 65 mots-clés sur 65 `ELIGIBLE` | l'écran de l'annonceur, ouvert par l'exploitant : l'écran dit « Vous devez valider votre identité pour continuer à diffuser des annonces » quand la validation manque |
| **Tant que la validation de l'annonceur n'est pas terminée, un statut `SERVING` lu par l'API ne prouve rien.** Cause probable de l'échec relevée au registre public : nom légal et nom du dirigeant non alignés au caractère près (aucune valeur citée ici) | la même diffusion nulle, diagnostiquée en vain côté campagnes | confronter les deux noms au registre public avant l'activation |
| **Un avis de messagerie est un événement daté, pas un état.** Un avis du 17/09 a été présenté comme bloquant (A-283) alors que l'écran de facturation montrait la carte visée déjà retirée | une action urgente prescrite sur un fait périmé | confronter tout avis à l'écran qui porte l'état avant de le dire urgent ; une recherche d'avis par expéditeur couvre deux adresses de paiement Google distinctes |
| **Le parcours d'un écran s'écrit d'après l'écran du jour, jamais d'après l'aide.** Le 24/09, « Administration → Règles → Compte » traduisait l'aide anglaise (Admin › Policy › Account) quand l'aide française du jour dit « Admin > Règlement > Compte » ; le 26/09, l'aide donnait « Outils » → « Règles » quand l'écran capturé le même jour montre « Outils » → « Dépannage » → « Gestionnaire de règles » | deux parcours faux transmis à l'exploitant | une capture de l'écran, quand elle existe, prime sur l'aide ; sans capture, l'aide dans la LANGUE de l'écran visé, avec sa date de lecture |

**Liste « avant la première dépense »**, jouée par l'exploitant et vérifiée par l'agent, avant
d'activer une campagne : validation de l'annonceur terminée ; noms saisis alignés au caractère près
sur le registre public ; mode de paiement valable au moins 60 jours ; codes promotionnels saisis
avant l'activation ; notifications du compte lues. Le relevé du kit, lui, porte deux verdicts :
conformité au plan et diffusion.

### Ce qui se demande, ou se relit, avant d'agir

- **Deux pièces ne se téléchargent que depuis le compte**, par l'humain qui y est connecté. Elles
  se demandent dans le tour qui prépare le dépôt, jamais après l'échec (TF-1361, TF-1363) : les
  **modèles d'import** de l'écran Importations, un par type d'objet, sur lesquels tout générateur
  se bâtit et contre lesquels il confronte ses colonnes et ses valeurs à chaque génération ; et le
  **rapport d'erreurs** d'un dépôt refusé, qui nomme les causes distinctes.
- **Une sonde d'accès cite la version d'API en service** le jour de la sonde, relue dans la
  documentation officielle (TF-1362) : une sonde sur une version retirée mesure un `404` qui ne dit
  rien de l'accès. La table des échéances est à `developers.google.com/google-ads/api/docs/sunset-dates`
  (relue le 18/10/2026).

### Limites actuelles de ce référentiel

Le kit éprouvé chez le produit compte cinq pièces (annexe C du lot) : le générateur de l'import web
confronté aux modèles (191 lignes sur 191 acceptées), le relevé en lecture seule qui compare le
compte au plan, le fichier des changements calculé depuis l'état lu du compte, le plan de campagnes
qui les alimente, et les commandes documentées. Depuis le 13/10/2026 (TF-1364, décision humaine
D-69 (a)), sa version générique vit dans `digit-ai-forge-ops/scripts/google-ads/` : recette
`node scripts/google-ads/google-ads.mjs --self-test` (51 cas sur données factices, aucun appel à
Google), règles datées dans `regles-google-ads.json`. Le kit reste en lecture seule sur le compte ;
l'acceptation réelle par l'« Aperçu » et la première lecture d'un compte réel se consignent au
ledger du run qui les exécute.

---

## Google — se connecter : voie OAuth « utilisateur » ou compte de service

*Mesuré le 17/10/2026 par le run `Produit-79` (lot `Produit-79 - RETOURS - 20261017b`, retours RP-11 et RA-9 ; item TF-1848, décision R-58 du 18/10/2026), puis confronté à la documentation de Google lue le 18/10/2026. Chaque ligne dit si son fait est relu (page, commande ou réponse d'API rejouée le 18/10/2026) ou attribué au constat de Produit-79, non rejoué ici. Aucun identifiant de compte, de projet ni de propriété n'y figure.*

La connexion de Produit-79 à Google Analytics 4, à Search Console et à Google Ads a pris une matinée, dont
la moitié à chercher ce que ce référentiel aurait pu dire (RP-11). Son déroulé consigné va de 07:55 à 08:50 :
4 gestes humains (le clic de connexion, l'écran « Branding », la création du client OAuth, la demande
d'accès « Explorer »), tout le reste exécuté par l'agent (RA-9). La demi-matinée de recherche n'est
pas ventilée par fait : une ligne dit son coût propre seulement quand il est connu.

### Quand choisir laquelle

3 lignes disent à quel moment un compte de service remplace la connexion d'une personne, et ce qui le
ferme. La première est l'arbitrage ; les deux suivantes sont les faits qui le fondent.

| Fait | Coût si on l'ignore | Comment le rejouer, et source |
|---|---|---|
| **Règle de choix.** Compte de service quand la ressource accepte son adresse comme utilisateur ; voie utilisateur sinon. Aujourd'hui : compte de service pour Google Ads (relu), voie utilisateur pour GA4 et Search Console (l'ajout d'un compte de service n'y est pas vérifié, voir la dernière section Google). *Arbitrage de rédaction tiré des 2 lignes suivantes et du constat de Produit-79, pas un fait mesuré tel quel.* | une voie utilisateur choisie par défaut met un humain et un jeton de 7 jours dans une chaîne conçue pour tourner seule ; un compte de service supposé accepté par GA4 ou Search Console envoie l'exploitant chercher un réglage non vérifié | tenter d'ajouter l'adresse d'un compte de service à une propriété GA4, puis à une propriété Search Console, et noter la réponse de l'écran ; la règle se corrige à la première réponse |
| **Un compte de service ne dépend d'aucune personne et n'exige aucun consentement humain.** La documentation Google Ads le présente comme un flux OAuth 2.0 sans autorisation humaine, dont l'accès survit au départ de la personne qui l'a configuré ; on l'ajoute comme utilisateur du compte publicitaire (Admin → Accès et sécurité → Utilisateurs), sans le niveau « Email only », et sans rôle d'administrateur par défaut | la voie utilisateur se coupe quand la personne qui a consenti part, et expire à 7 jours en mode Test (ligne « 7 jours » plus bas) | `developers.google.com/google-ads/api/docs/oauth/service-accounts` (page du 2026-10-14, lue le 18/10/2026) ; lecture réussie par `produit-02` le 22/09/2026 (section Google Ads, ligne « Un compte de service s'ajoute comme utilisateur ») |
| **L'organisation peut interdire la clé d'un compte de service.** Les contraintes de sécurité de base de Google Cloud s'appliquent à toute organisation créée à partir du 03/05/2024 (certaines créées entre février et avril 2024 peuvent l'être aussi), dont l'interdiction des clés persistantes de compte de service (`iam.managed.disableServiceAccountKeyCreation`) | le compte de service se crée, sa clé ne se télécharge pas, et la voie compte de service est fermée sans changer la politique de l'organisation, décision qui reste humaine ; il reste la voie utilisateur, ou l'emprunt d'identité d'un compte de service que le README d'`analytics-mcp` documente (`--impersonate-service-account`) | `docs.cloud.google.com/resource-manager/docs/secure-by-default-organizations` (page du 2026-10-13, lue le 18/10/2026) ; README : `github.com/googleanalytics/google-analytics-mcp` (lu le 18/10/2026) |

### La voie utilisateur : prérequis, durée du jeton, commande

5 lignes disent ce que la connexion par une personne demande avant de lire quoi que ce soit : le client
OAuth, la publication de l'application, la durée du jeton, la commande de connexion et l'isolement de la
configuration `gcloud`.

| Fait | Coût si on l'ignore | Comment le rejouer, et source |
|---|---|---|
| **Le client OAuth « Desktop app » se crée à la console seulement.** Produit-79 n'a trouvé aucune commande `gcloud` qui le crée. Relu : `gcloud iam oauth-clients create` existe, mais elle crée un client IAM (types `confidential-client` ou `public-client`, portées limitées à `cloud-platform`, `openid`, `email` et `groups`), qui n'admet aucune portée Analytics, Search Console ni Ads. Le type « Desktop app » est le choix de Produit-79 : la page de Google sur les identifiants par défaut demande un « OAuth Client ID » sans nommer le type | le 3e des 4 gestes humains ; un run qui promet de tout automatiser promet une affordance non câblée (loi n° 1) | `gcloud iam oauth-clients create --help` (SDK 580.0.0, 18/10/2026) ; `gcloud auth application-default login --help` : « You can create the client ID file at https://console.cloud.google.com/apis/credentials » ; `docs.cloud.google.com/docs/authentication/set-up-adc-local-dev-environment` (page du 2026-10-13, lue le 18/10/2026) |
| **« Publier l'application » reste grisé tant que « Branding » ne porte ni page d'accueil ni page de confidentialité.** Message de la console du 17/10 (constat de Produit-79, garde-fou de plateforme relevé dans le lot). Google confirme l'exigence pour les applications externes en production : les liens sont requis, la page d'accueil est hébergée sur un domaine vérifié que l'on possède et ne se réduit pas à une page de connexion | un produit sans identité publique reste en mode Test : c'est le contournement admis, avec un utilisateur test | console Google Auth Platform, écrans « Branding » puis « Audience » ; `support.google.com/cloud/answer/15549049` (lue le 18/10/2026, aucune date de mise à jour affichée) |
| **En mode Test, le jeton expire à 7 jours.** Pour un écran de consentement externe au statut « Testing », l'autorisation d'un utilisateur test expire 7 jours après le consentement, jeton de renouvellement compris ; 100 utilisateurs test au plus. La page ajoute qu'une vérification peut rester exigée, après publication, pour des portées sensibles ou restreintes : non éprouvé par Produit-79 | la lecture s'arrête au 8e jour ; la refaire demande un consentement humain | `developers.google.com/identity/protocols/oauth2`, section « Refresh token expiration » (page du 2026-10-16, lue le 18/10/2026) ; `support.google.com/cloud/answer/15549945` (lue le 18/10/2026, aucune date affichée) |
| **La connexion de lecture se fait par les identifiants par défaut de l'application, avec le fichier du client** : `gcloud auth application-default login --client-id-file=<client.json> --scopes <portée métier>,https://www.googleapis.com/auth/cloud-platform`. Les README des deux serveurs MCP et le démarrage rapide de l'API Analytics passent `cloud-platform` avec la portée métier, sans dire pourquoi. Produit-79 a demandé quatre portées : `analytics.readonly`, `webmasters.readonly`, `adwords`, `cloud-platform` ; sa ligne de commande exacte ne figure pas au lot, la forme ci-contre est composée des commandes des README. Le projet qui possède le client sert de projet de facturation et de quota (aide `gcloud`) ; les API s'activent donc dans ce projet, déduction non éprouvée à part | une part de la demi-matinée de recherche, non ventilée | README `github.com/googleanalytics/google-analytics-mcp` et `github.com/googleads/google-ads-mcp` (lus le 18/10/2026) ; `developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries` (page du 2026-10-13, lue le 18/10/2026) ; `gcloud auth application-default login --help` (SDK 580.0.0, 18/10/2026) |
| **Une configuration `gcloud` par produit.** `CLOUDSDK_CONFIG` désigne un répertoire de configuration propre au produit. Relu : l'aide de la commande de connexion dit que les identifiants par défaut générés auparavant sont écrasés. Produit-79 le fait pour ne pas mêler 2 produits du même exploitant | la connexion d'un second produit remplace celle du premier, sans erreur | `CLOUDSDK_CONFIG=<répertoire du produit> gcloud info --format="value(config.paths.global_config_dir)"` rend ce répertoire (rejoué le 18/10/2026) ; `docs.cloud.google.com/sdk/docs/configurations` (page du 2026-10-13, lue le 18/10/2026) |

### Serveurs MCP de lecture

3 lignes disent ce que chaque serveur expose, quelle version le portait le 18/10/2026 et ce qui
reste à vérifier avant de promettre un outil.

| Fait | Coût si on l'ignore | Comment le rejouer, et source |
|---|---|---|
| **`google-ads-mcp` 0.0.5, publié sous l'organisation GitHub de Google Ads** : 3 outils (`search`, `get_resource_metadata`, `list_accessible_customers`), aucun outil d'écriture dans le README ; portée `adwords` ; jeton développeur lu dans `GOOGLE_ADS_DEVELOPER_TOKEN`, que le README présente comme facultatif « si votre configuration l'exige », et qui doit avoir au moins le niveau « Explorer » pour lire un compte de production. Le README ne le dit pas « officiel » : cet adjectif est celui de Produit-79. Essai de Produit-79 le 17/10 : 2 serveurs sur 2 PASS par un client stdio | une part de la demi-matinée de recherche | `curl -s https://pypi.org/pypi/google-ads-mcp/json` : `info.version` = 0.0.5, mise en ligne le 2026-10-09 (rejoué le 18/10/2026) ; README `github.com/googleads/google-ads-mcp` (lu le 18/10/2026) |
| **`analytics-mcp` : 9 outils au constat de Produit-79, 7 au README.** Le README, intitulé « Experimental », liste `get_account_summaries`, `get_property_details`, `list_google_ads_links`, `run_report`, `run_funnel_report`, `get_custom_dimensions_and_metrics` et `run_realtime_report`. La version installée par Produit-79 n'est pas au lot : l'écart n'est pas expliqué. Portée `analytics.readonly` | un parcours qui promet 9 outils sur la foi d'un seul des deux chiffres | `curl -s https://pypi.org/pypi/analytics-mcp/json` : `info.version` = 0.7.0, mise en ligne le 2026-07-29 (rejoué le 18/10/2026) ; README `github.com/googleanalytics/google-analytics-mcp` (lu le 18/10/2026) ; relever `tools/list` du serveur installé |
| **Les outils d'un serveur MCP déclaré en cours de session ne se chargent qu'à la session suivante.** Un client stdio de 40 lignes (`initialize`, `tools/list`, `tools/call`) les essaie dans la session : 2 serveurs sur 2 (constat de Produit-79, RA-9, non rejoué) | des outils déclarés, introuvables jusqu'à la session suivante | déclarer le serveur, lister les outils dans la même session, puis lancer le client stdio |

---

## Google Analytics 4 — API, portées et lecture

*Relevé le 18/10/2026 sur la documentation de Google et sur les documents de découverte des API (révision 20261014), après le constat de Produit-79 du 17/10/2026 (retour RP-11 ; item TF-1848). Aucun identifiant de compte ni de propriété n'y figure.*

### Faits et coût de leur ignorance

4 faits sur Google Analytics 4 : les API à activer, la portée à demander, la version des points
d'accès et l'accès à la propriété. Le tableau se lit ligne à ligne, comme celui de Google Ads ; les deux
premières colonnes disent le fait et son coût, la troisième comment le rejouer et de quelle page il vient.

| Fait | Coût si on l'ignore | Comment le rejouer, et source |
|---|---|---|
| **2 API à activer, pas une** : `analyticsadmin.googleapis.com` (comptes et propriétés) et `analyticsdata.googleapis.com` (rapports). Produit-79 les a activées par `gcloud services enable` ; la documentation de chaque API renvoie à son propre démarrage rapide | une API activée sur deux : l'inventaire des propriétés répond, les rapports non, ou l'inverse | `gcloud services enable analyticsadmin.googleapis.com analyticsdata.googleapis.com --project=<projet>` ; noms relus dans `developers.google.com/analytics/devguides/config/admin/v1/quickstart-client-libraries` et `developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries` (pages du 2026-10-13, lues le 18/10/2026) |
| **La portée de lecture suffit.** `runReport` exige `https://www.googleapis.com/auth/analytics.readonly` ou `https://www.googleapis.com/auth/analytics` ; l'API d'administration déclare `analytics.readonly` et `analytics.edit`. Produit-79 a demandé `analytics.readonly` | demander `analytics` ou `analytics.edit` accorde l'écriture sans besoin : coût non subi par Produit-79, relevé en vérifiant la documentation | `developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport` (page du 2026-04-23, lue le 18/10/2026) ; `curl -s 'https://analyticsadmin.googleapis.com/$discovery/rest?version=v1beta'` puis lire `auth.oauth2.scopes` (révision 20261014, rejoué le 18/10/2026) |
| **Les points d'accès sont en `v1beta`, y compris sous des pages intitulées « v1 ».** Sans jeton le 18/10 : `analyticsadmin.googleapis.com/v1/accountSummaries` rend `404` et `/v1beta/` rend `401` ; `analyticsdata.googleapis.com/v1/properties/0:runReport` rend `404` et `/v1beta/` rend `401`. Dans les documents de découverte (révision 20261014), l'API d'administration ne connaît que `v1beta` et `v1alpha`, et la `v1` de l'API de données ne décrit que `operations` : `runReport` n'existe qu'en `v1beta` | un `404` sur un chemin `/v1/` lu comme « API non activée » ou « accès manquant » : coût non subi par Produit-79, relevé en rejouant | `curl -s -o /dev/null -w "%{http_code}\n" https://analyticsadmin.googleapis.com/v1/accountSummaries`, puis la même sur `/v1beta/` ; `curl -s 'https://analyticsdata.googleapis.com/$discovery/rest?version=v1'` et lire `resources` (rejoué le 18/10/2026) |
| **L'identité qui lit doit avoir accès à la propriété, et le rôle Viewer suffit à voir les données.** Produit-79 a lu GA4 (`runReport` en 200) avec un compte du client, en portées de lecture, le 17/10 (retour RG-1 du même lot) | une propriété hors de l'accès de l'identité rend une erreur d'accès, pas une liste vide : à confirmer à la première lecture | `support.google.com/analytics/answer/9305587` (rôles, lue le 18/10/2026, aucune date affichée) ; lecture : `gcloud auth application-default print-access-token` pour le jeton, puis le corps minimal de la page `developers.google.com/analytics/devguides/reporting/data/v1` (page du 2026-10-13, lue le 18/10/2026) ; non rejoué ici faute de jeton |

---

## Search Console — API, portées et lecture

*Relevé le 18/10/2026 sur la documentation de Google et sur le document de découverte de l'API (révision 20261014), après le constat de Produit-79 du 17/10/2026 (retours RP-11 et RG-1 ; item TF-1848). Aucun identifiant de compte ni de propriété n'y figure.*

### Faits et coût de leur ignorance

4 faits sur Search Console : la portée, les deux adresses de l'API, la lecture éprouvée par Produit-79
et les niveaux d'autorisation d'une propriété. Même lecture ligne à ligne que pour Google Analytics 4.

| Fait | Coût si on l'ignore | Comment le rejouer, et source |
|---|---|---|
| **Une API, deux portées : `https://www.googleapis.com/auth/webmasters.readonly` lit, `https://www.googleapis.com/auth/webmasters` lit et écrit.** Produit-79 a demandé `webmasters.readonly`. Le service à activer s'appelle `searchconsole.googleapis.com` | demander `webmasters` accorde l'écriture sans besoin : coût non subi, relevé en vérifiant la documentation | `developers.google.com/webmaster-tools/v1/how-tos/authorizing` (page du 2025-08-28, lue le 18/10/2026) ; `curl -s 'https://searchconsole.googleapis.com/$discovery/rest?version=v1'` puis lire `auth.oauth2.scopes` et `rootUrl` (révision 20261014, rejoué le 18/10/2026) |
| **Deux adresses se rencontrent.** Les pages de référence donnent `https://www.googleapis.com/webmasters/v3/sites` ; le document de découverte donne la racine `https://searchconsole.googleapis.com/`. Sans jeton le 18/10, `/webmasters/v3/sites` rend `401` sur les deux hôtes | une sonde écrite d'après une seule des deux adresses laisse croire que l'autre n'existe pas : coût non subi, relevé en rejouant | `curl -s -o /dev/null -w "%{http_code}\n" https://www.googleapis.com/webmasters/v3/sites`, puis la même sur `https://searchconsole.googleapis.com/webmasters/v3/sites` (rejoué le 18/10/2026) ; `developers.google.com/webmaster-tools/v1/sites/list` (page du 2024-07-23, lue le 18/10/2026) |
| **Produit-79 a lu Search Console en direct avec un compte du client** : `sites.list` en 200 et `searchAnalytics/query` en 200 sur une propriété de domaine, le 17/10/2026 (retour RG-1 du même lot). Le référentiel des sources du SEO les déclarait absentes, ce que RG-1 corrige de son côté | une voie « connecteur » ignorée : 16 nœuds du SEO déclarés non mesurables faute d'export | `GET https://www.googleapis.com/webmasters/v3/sites` avec le jeton de la voie utilisateur, puis `POST …/sites/<siteUrl>/searchAnalytics/query` ; page de la méthode : `developers.google.com/webmaster-tools/v1/searchanalytics/query` (page du 2026-08-11, lue le 18/10/2026) ; non rejoué ici faute de jeton |
| **Quatre niveaux d'autorisation sur une propriété** : propriétaire, utilisateur complet, utilisateur restreint, associé. L'aide ne dit ni lesquels l'API lit, ni si l'adresse d'un compte de service peut y être ajoutée. Le niveau du compte du client n'est pas au lot | choisir la voie compte de service pour Search Console sur une hypothèse | `support.google.com/webmasters/answer/7687615` (lue le 18/10/2026, aucune date affichée) |

### Faits attribués au constat de Produit-79, faute de vérification

Cette liste dit ce que le référentiel ne sait pas par lui-même. Elle vaut pour les trois sections Google ci-dessus. Aucune de ces lignes n'est présentée comme vérifiée.

- **Le 400 `UNSUPPORTED_VERSION` de `v22`, `v23` en service et `listAccessibleCustomers` au niveau « Test »** : ils exigent un jeton ; seul le relevé sans jeton est rejoué (section Google Ads).
- **L'accès « Explorer » demandé à 08:30 et lisant le compte réel à 08:37** : le délai est mesuré par Produit-79. La page des niveaux d'accès dit seulement que Google peut relever le niveau automatiquement après la demande (`developers.google.com/google-ads/api/docs/api-policy/access-levels`, page du 2026-10-14, lue le 18/10/2026), et le README de `google-ads-mcp` dit la même chose d'un jeton neuf.
- **Les 9 outils d'`analytics-mcp`** : le README en liste 7 (section « Serveurs MCP de lecture »).
- **Le type « Desktop app » du client OAuth, et l'absence de commande `gcloud` pour le créer** : l'absence est relue pour `gcloud iam oauth-clients create` seulement ; le type reste le choix de Produit-79.
- **Le message de la console sur « Publier l'application »** : l'exigence est confirmée par la page de Google sur le « Branding », pas le message lui-même.
- **L'ajout d'un compte de service à une propriété GA4 ou Search Console** : les aides lues n'en parlent pas. À tenter avant de choisir cette voie.
- **La ligne de commande exacte de la connexion de lecture, la version installée d'`analytics-mcp`, le niveau d'autorisation du compte du client sur Search Console** : absents du lot.

---

## LinkedIn — aucun connecteur, et c'est une déclaration

*Établi le 17/09/2026 par l'étude `output\03-etudes\2026-09\20260917-etude-opportunite-gestion-reseaux-sociaux.md`
(TF-1161, décision humaine D-2 (a)). L'étude du 11/09 avait retiré le connecteur de diffusion de
son verdict en laissant la question ouverte ; elle est tranchée ici.*

| Fait établi | Coût si on l'ignore | Comment le rejouer |
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

*Établi le 21/09/2026 par l'étude `output\03-etudes\2026-09\20260921-etude-opportunite-reseaux-sociaux-complement.md`
(TF-1276, décision humaine D-12 (a)). Sur LinkedIn, l'absence de connecteur est imposée par le
contrat. Ici elle est choisie : 5 de ces 8 réseaux ouvrent gratuitement leur interface de
publication, et la tentation d'un outil maison est réelle.*

| Fait établi | Coût si on l'ignore | Comment le rejouer |
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

## Limites de ce document

- **Il vieillit, et vite.** Chaque section porte la date de sa mesure, du 24/08 au 18/10/2026. Une interface de
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
