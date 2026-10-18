# Retours forges — Produit-79 — 20261017b

- **Contexte** : autre — connexion du produit à Google Analytics, Search Console et Google Ads (17/10/2026), et retours restés hors lot depuis le 15/10/2026 ; décision humaine D-61 (a) du 17/10/2026
- **Références ledger** : `forge\ledger.jsonl` seq 187, 188, 195, 208, 231 (entrées `type: retour`), 240 à 250 (connexion Google)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

La connexion du 17/10 a pris une matinée, dont la moitié à chercher ce que le référentiel des intégrations aurait pu dire. Trois retours plus anciens touchent la forme des restitutions et l'allocation des indices.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-11 — référentiel Google | majeur | générique | `references\INTEGRATIONS-FOURNISSEURS.md` n'a de section que pour Google Ads (TF-1364) ; Google Analytics 4 et Search Console n'y figurent pas, ni la voie OAuth « utilisateur ». Mesuré le 17/10/2026 : (1) portées `analytics.readonly`, `webmasters.readonly`, `adwords`, `cloud-platform` ; API `analyticsadmin`, `analyticsdata`, `searchconsole`, `googleads` activées par `gcloud services enable` ; (2) client OAuth « Desktop app » créé à la console seulement, aucune commande gcloud ; (3) « Publier l'application » reste grisé tant que « Branding » ne porte ni page d'accueil ni page de confidentialité (message de la console du 17/10) ; en mode Test, le jeton expire à 7 jours ; (4) `gcloud auth application-default login --client-id-file` sous une configuration `CLOUDSDK_CONFIG` propre au produit, pour ne pas mêler deux produits du même exploitant ; (5) serveurs officiels `analytics-mcp` (9 outils) et `google-ads-mcp` 0.0.5 (3 outils de lecture, aucun `mutate`, jeton développeur passé seulement s'il est posé) ; essai : 2/2 PASS. Mise à jour de la section Google Ads : `v22` rend désormais 400 `UNSUPPORTED_VERSION` (le référentiel la donne en service) ; `v23` en service ; `listAccessibleCustomers` répond au niveau Test ; le niveau Explorer demandé à 08:30 lisait le compte réel à 08:37. | Règle qui aurait évité le retour : TF-1364, lue dans la documentation du jour plutôt que de mémoire, mais limitée à Ads. Proposition : sections « Google Analytics 4 » et « Search Console » au référentiel, une ligne « voie OAuth utilisateur ou compte de service : quand choisir laquelle », et la ligne des versions Ads redatée avec la commande qui la rejoue. |
| RP-12 — numéros de décision | majeur | générique | Deux sessions ouvertes sur le même produit ont posé chacune une D-37, à 8 minutes d'intervalle, le 15/10/2026 : la synthèse 20261015r affichait D-37 à D-40 sans entrée `question_humain` au registre ; l'autre session a lu le registre et a pris D-37 (ledger, entrée 183). Renumérotation D-37 → D-41 après la réponse humaine (entrées 185, 186). | Règle qui aurait évité le retour : aucune ne réserve un numéro de décision avant l'affichage. Proposition : une décision affichée au bloc 3 se réserve au registre (`question_humain`) avant l'affichage ; le préjugement vérifie que chaque D-N affichée y figure sous ce sujet. **RP-12 : clé proposée `designateur-de-decision-sans-reservation`.** |
| RP-13 — indices après z | majeur | générique | Le 15/10/2026, ce produit a pris les indices a à z sous `output\`, en deux sessions. `allouerIndice({porte: 'dossier'})` rend alors « Z » ou « z » déjà pris ; l'oracle « Nommage / convention de livraison » refuse « 20261015Z » et « 20261015za », et R-4 n'admet qu'une lettre (`- \d{8}[a-z]?\.`), alors que 17 lettres du jour restaient libres dans `06-rapports`. Les livrables suivants ont pris des lettres libres du dossier, et la version corrigée d'un prompt porte « d » quand celle qu'elle remplace porte « y ». | Règle qui aurait évité le retour : la portée par dossier de R-4, déjà admise pour les collisions. Proposition : l'allocateur rend la première lettre libre du jour dans le dossier quand la suivante dépasse z, ou R-4 et l'oracle de nommage admettent deux lettres (aa, ab…), les trois outils alignés. |
| RP-14 — demande de détail | majeur | générique | L'humain a écrit « 51 détaille » le 16/10/2026 ; la restitution a rappelé D-51 en une ligne au bloc 3, comme S4 le prescrit pour une décision inchangée, et a reporté le détail au bloc 4 en puces, sans texte exact, options ni recommandation. L'humain : « je demande de détailler 51 et ce n'est pas fait, pourquoi ? » (ledger, entrée 231). | Règle qui aurait évité le retour : aucune ; S4 ne prévoit pas la demande de détail. Proposition : une demande humaine de détail sur une D-N la repose en entier ou la remplace par des décisions détaillées, une par point, jamais par un rappel d'une ligne. **RP-14 : clé proposée `regle-de-forme-primant-sur-la-demande`.** |

## digit-ai-forge-agents (`digit-ai-forge-agents`)

La connexion Google s'est faite en suivant une procédure que rien ne porte dans les forges, et le skill d'analyse de prompt a reproduit une forme qui cache le contenu d'une option.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-9 — connexion Google | majeur | générique | Connexion d'un produit à Google Analytics, Search Console et Google Ads le 17/10/2026, de 07:55 à 08:50 : 4 gestes humains (clic de connexion, écran « Branding », création du client OAuth, demande d'accès Explorer), tout le reste exécuté par l'agent (projet Cloud, 4 API, connexion de lecture, 2 serveurs MCP, mesure des accès sur 5 appels). Les outils d'un serveur MCP déclaré en cours de session ne se chargent qu'à la session suivante ; un client stdio de 40 lignes (`initialize`, `tools/list`, `tools/call`) les a essayés dans la session, 2 serveurs sur 2. Cette capacité ne vit que dans le ledger et les synthèses du produit. | Règle qui aurait évité le retour : aucune capacité de forge ne couvre la connexion d'un produit à ses sources de mesure. Proposition : un skill « connecter les sources Google d'un produit » (procédure, guide des 4 gestes, sonde d'accès datée, essai MCP par client stdio), et le client d'essai MCP comme outil du socle. |
| RA-10 — libellés L99 | mineur | générique | Les libellés d'option prescrits par `prompt-analyzer-l99` (`references/couches.md`, § Écarts à la lettre, TF-1391) pour un contenu visible ajouté — « l'ajouter tel quel », « l'ajouter reformulé », « ne pas l'ajouter » —, recopiés tels quels, cachent le contenu : la question D-39 nommait trois scénarios, l'option (a) disait « L'ajouter tel quel : onglet Scénarios », et l'humain a demandé « pourquoi cette option 3 scénarios n'est pas affichée dans les choix ? » (ledger, entrée 187). | Règle qui aurait évité le retour : TF-1391, forme des sorties L99. Proposition : chaque libellé d'option nomme le contenu qu'il ajoute (« (a) Ajouter les trois scénarios bas, central, haut »), la catégorie restant en tête de cellule. |

## digit-ai-forge-seo-geo (`digit-ai-forge-seo-geo`)

Le référentiel des sources de la forge déclare Search Console et Google Analytics absents par principe, alors qu'un produit vient de les joindre en direct.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RG-1 — sources du SEO | majeur | générique | `referentiel/sources-donnees.md`, ligne 21 : « Absents, sans exception : Google Search Console, Google Analytics » ; ligne 30 : l'export Search Console « à demander » laisse 16 nœuds non mesurables. Le 17/10/2026, ce produit a lu en direct la Search Console d'une propriété de domaine (`sites.list` 200, `searchAnalytics/query` 200, 181 clics et 3 213 impressions sur 28 jours) et GA4 (`runReport` 200) avec un compte du client, en portées de lecture. | Règle qui aurait évité le retour : TF-1364 et la règle de lecture de la documentation du jour, non appliquées aux sources de la forge. Proposition : une voie « connecteur » à côté de la voie « export » dans `sources-donnees.md`, avec le niveau de preuve `[T1 observé]` pour une lecture par API datée, et le renvoi à la procédure de RA-9. |

## Rattachement

Registre interrogé le 17/10/2026 : `node -e "…"` sur `todo\TODO.jsonl`, filtre des entrées `creation` dont le titre ou le contenu répond à `/(Search Console|Google Analytics|GA4|analytics-mcp|google-ads-mcp|CLOUDSDK_CONFIG|application-default|Explorer access|niveau .?Explorer|allouer-indice[^.]{0,80}\bz\b|au-del. de z|deux sessions[^.]{0,60}D-|S4[^.]{0,80}d.tail)/i`, sans borne → 4 ligne(s) trouvée(s).
Items recoupés : TF-1364 (corrigé, Google Ads au référentiel des intégrations ; RP-11 le complète et le redate), TF-1596 (corrigé, deux valeurs GA4 du même indicateur selon le niveau de détail ; confirmé le 17/10, voir « Confirmations positives »). TF-1036 et TF-1592 répondent au filtre sans recouper ces retours.

## Remarques restées au produit

Ce chapitre dit ce que le produit a corrigé ou constaté chez lui, et pourquoi cela ne remonte pas.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 28 082 conversions Google Ads sur 28 195 sont des événements de navigation GA4 importés en conversions principales ; 100 % des sessions Display « engagées » | non corrigée ; note A-2 proposée à l'exploitant, aucune modification du compte | non | réglage du compte du client ; la classe voisine est déjà au référentiel (conversions héritées restées principales, TF-1364) |
| Chemin Windows écrit dans `.env` par `sed`, barres obliques inverses interprétées | réécrit par un script `node`, fichier vérifié présent | non | erreur de manipulation de l'agent, corrigée dans le tour |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Nouveau garde-fou : plateforme Google Cloud, Google Auth Platform ; mécanisme : publication d'une application OAuth externe ; effet : bouton « Publier l'application » désactivé ; portée : tout projet Cloud qui crée un client OAuth pour un compte grand public ; vise : les applications sans identité publique ; refuse : la publication tant que « Branding » ne porte ni l'adresse de la page d'accueil ni celle de la politique de confidentialité ; heurté le 17/10/2026 ; contournement admis : mode Test avec utilisateur test, jeton valable 7 jours.

## Confirmations positives

- TF-1364 a tenu : plus de jeton développeur ni de compte administrateur ; la lecture marche au niveau Explorer.
- TF-1596 confirmé : GA4 a rendu 7 606 sessions au total et 7 704 par canal sur la même fenêtre de 28 jours, à 15 minutes d'écart.
- RP-10 du lot 20261017a : la consigne de listes en puces a tenu sur les 6 restitutions suivantes du jour.

## Ordre recommandé

1. RP-11 et RG-1 ensemble : ils ouvrent Search Console et GA4 à toutes les missions de référencement, et les faits sont datés du jour.
2. RA-9 : le skill rend la connexion reproductible chez le produit suivant.
3. RP-13, RP-12, RP-14 : frictions de forme, moins coûteuses.
4. RA-10.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Chaque ligne nomme sa règle dans « Proposition esquissée ». Deux retours n'en trouvent aucune et proposent une classe : RP-12, clé `designateur-de-decision-sans-reservation`, famille `restitution-forme`, libellé « Un numéro de décision affiché à l'humain n'est réservé nulle part : deux sessions du même produit le prennent toutes deux » ; RP-14, clé `regle-de-forme-primant-sur-la-demande`, famille `restitution-forme`, libellé « Une règle de forme de la restitution l'emporte sur ce que l'humain vient de demander ».
