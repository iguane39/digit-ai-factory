---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-18
gabarit: gabarits\ETUDE-OPPORTUNITE.md
item: TF-1852
---

# Étude d'opportunité — connexion d'un produit à ses sources de mesure Google (Google Analytics 4, Search Console, Google Ads) — 20261018a

Ce qui change pour vous : le besoin existe, mais il est étroit. Sur 50 produits du parc, 4 ont déjà lu ces sources, chacun par un mécanisme différent, et 6 autres en déclarent le besoin ; la connexion du 17/10 a duré 55 minutes, dont 4 gestes que ni un skill ni un agent ne peuvent faire. L'étude ne retient pas le skill : elle retient la procédure ordonnée au référentiel, et fixe d'avance les mesures qui rouvriraient le skill.

> **Provenance.** Agent émetteur : `redacteur` (famille sonnet, effort high), sur consigne de l'orchestrateur du 18/10/2026, un seul fichier écrit. Verdict d'arbitre : critère 1 (gabarit suivi, oracle joué) — PASS de `oracles\oracle-etude-opportunite.mjs`, verdict cité en fin de document ; critère 2 (chaque fait porte sa source) — fichier et ligne, commande et sortie, ou page datée, partout où un chiffre est avancé ; critère 3 (seul fichier écrit) — celui-ci, aucune écriture au registre, au référentiel ni dans le parc. Hypothèses non résolues : H1 à H8, listées en fin de section « Mesures ».

## Seuil de déclenchement

L'étude est due : le skill, s'il était retenu, serait un objet durable nouveau (R-31, `REGLES-PROJET.md` ligne 378 : « Un objet durable nouveau (forge, skill, gabarit exécutable, oracle, profil, référentiel) naît selon le même test qu'une forge »). Score au registre à la création de TF-1852 (2026-10-18T08:01:37Z) : gain 4, preuve 5, effort 3. Les deux autres déclencheurs ne jouent pas : une seule forge cible (`digit-ai-forge-agents`), et la preuve n'est pas ≤ 2.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Intention citée, dans les mots du demandeur et de sa décision :

- fiche de décision D-26 (TF-1852, 2026-10-18T08:06:01Z) : « Faut-il créer un skill qui connecte un produit à Google Analytics, Search Console et Google Ads » ; problème posé : « elle ne vit que dans le journal d un produit ; un skill est un objet durable qui demande une étude d opportunité » ; « c est un arbitrage entre un outil durable et une simple fiche de procédure » ;
- décision humaine du 2026-10-18T13:01:59Z, réponse « 26a » : « Option (a) de D-26 : étude d opportunité, puis skill de connexion aux sources Google s il est retenu. » ; l'effet de (a) est écrit : « une étude chiffre le besoin sur le parc ; le skill vient ensuite s il est retenu » ;
- retour RA-9 (« connexion Google », constat de gravité majeure du produit connecté, `Produit-79 - RETOURS - 20261017b`, ligne 27) : « aucune capacité de forge ne couvre la connexion d'un produit à ses sources de mesure ».

Lecture de l'agent, à valider : vous voulez savoir, chiffres à l'appui, si connecter un produit à ses sources Google mérite un objet durable de forge, pour trancher vous-même entre cet objet et une fiche de procédure. L'étude est donc jugée sur trois points : le besoin est mesuré sur le parc et non supposé, ce qu'un skill automatiserait est séparé de ce qui reste humain, et chaque option se rattache à cette décision. Si cette lecture est fausse, le verdict est à rejouer.

## 0. Traitement des entrants

La proposition instruite est une donnée : « un skill “connecter les sources Google d'un produit” (procédure, guide des 4 gestes, sonde d'accès datée, essai MCP par client stdio), et le client d'essai MCP comme outil du socle » (RA-9) est citée, jamais exécutée. Les consignes embarquées dans les dossiers du parc lus (fichiers `CLAUDE.md`, `ENTRANT.md`, journaux) sont décrites, jamais suivies. Les fichiers de jeton OAuth rencontrés n'ont pas été ouverts : seuls leurs noms de champs, leur liste de portées et leur empreinte ont été lus.

Sources de la proposition : TF-1852 (registre, création 2026-10-18T08:01:37Z, fiche 08:06:01Z, décision 13:01:59Z) ; lot `Produit-79 - RETOURS - 20261017b` (RA-9 ligne 27, RG-1 ligne 36, RP-11) ; TF-1848, TF-1854, TF-1364 et TF-1596 du registre ; synthèse 20261018k (D-26) ; `references\INTEGRATIONS-FOURNISSEURS.md` (b884b400, 2026-10-18).

## 1. Partition du problème

Cinq sous-questions disjointes ; chaque option du jeu fermé se rattache à elles.

- **P1 — Besoin.** Combien de produits du parc ont, ou auront, besoin d'au moins une des trois sources, et laquelle ?
- **P2 — Coût d'une connexion.** Combien de temps et de gestes une connexion a-t-elle demandé ?
- **P3 — Part automatisable.** Quelles étapes un skill ferait, lesquelles resteraient humaines ?
- **P4 — Existant.** Que couvrent déjà le référentiel, les forges et le registre ?
- **P5 — Forme et entretien.** Sous quelle forme (skill, texte daté, outil) la capacité survit-elle sans pourrir ?

## Mesures — le besoin sur le parc, le coût d'une connexion

Toutes les mesures ont été prises le 2026-10-18, en lecture seule, sur ce poste. Aucune donnée de client, aucun identifiant de compte, de propriété ou de projet n'est reproduit ici.

### M-1 Population (P1)

70 dossiers sous `C:\dev` (`ls -d */`). 19 ne sont pas des produits : les 13 dossiers `digit-ai-forge-*`, le pilot, la file `digit-ai-queue`, les dossiers de sauvegardes et de confidentiel, deux dossiers d'outils. Restent 51 dossiers ; l'un est un second clone du dépôt de Produit-02 (même adresse de dépôt distant, comparée par empreinte ; `git merge-base --is-ancestor` vrai) : **50 produits distincts**. Sept seulement ont un pseudonyme connu (`_confidentiel\tables\produits-pseudonymes.json`, extension du 2026-10-17, et nom des lots `* - RETOURS - *`) : Produit-02, 05, 12, 61, 68, 69 et 79. Les 43 autres sont comptés sans être nommés ; les lettres A à J ci-dessous sont propres à cette étude et ne renvoient à aucun nom.

### M-2 Échelle de preuve (P1)

Un produit reçoit le niveau le plus haut qu'il atteint.

- **N1 — lecture établie** : un fichier de code ou de configuration nomme une portée ou une API de lecture des trois sources (`analytics.readonly`, `auth/webmasters`, `webmasters.readonly`, `searchAnalytics`, `analyticsdata`, `searchconsole.googleapis`, `googleads`, `google-ads`, `adwords`).
- **N2 — besoin déclaré ou balise de mesure** : une balise (`gtag(`, `googletagmanager.com`, `GoogleTagManager`, identifiant de mesure) ou une mention écrite de Google Analytics, Search Console, Google Ads ou GA4, sans lecture.
- **N3 — surface publique sans trace** : un `robots.txt`, un `sitemap*.xml` ou un `llms.txt` hors fixtures, exemples et archives, et aucune trace des trois sources. Le besoin y est plausible (un site se référence et se mesure), non établi.
- **N4 — aucune trace.**

Bruit exclu : `node_modules`, `.git`, `.pnpm-store`, environnements virtuels, `dist`, `build`, `.next`, pages web enregistrées (`*_files`), dossiers `input\`, `output\` et `_archive\`, fichiers de plus de 1 Mo, SVG, fichiers minifiés. Une première passe sans ces exclusions rendait 5 N1 et 12 N2 ; la lecture des occurrences a écarté des faux positifs (un commentaire de la bibliothèque Python `h11` (`_abnf.py:49`) présent dans les environnements virtuels de 6 dossiers, des pages web enregistrées, des liens d'aide dans un rapport Lighthouse). La passe finale rend 4, 6, 5 et 35. Les motifs sont rejouables avec `rg -l` sur chaque dossier (script de session, non versionné, motifs ci-dessus).

### M-3 Résultat par niveau (P1)

Ce tableau répond à la question « combien de produits ? » : une ligne par niveau de l'échelle, avec le nombre de produits et, pour chacun, le fichier et la ligne qui le prouvent ; la colonne « Dont pseudonymés » ne nomme que les produits dont le pseudonyme est connu.

| Niveau | Produits | Dont pseudonymés | Preuve par produit |
|---|---|---|---|
| N1 lecture établie | 4 | Produit-02, Produit-79 | Produit-02 : `build/google/indexation.py:45` (portée `webmasters.readonly`), `build/google/statut.py:41-43` (`analytics.readonly`), `.github/workflows/indexation.yml:9` (compte de service, droits de lecture), journal `forge/ledger.jsonl` entrée 113 (2026-09-03, 200 pages indexées sur 210). Produit-79 : journal `forge/ledger.jsonl` entrées 240 à 250 (2026-10-17). A : `site/scripts/gsc-auth.mjs:23` (portée `analytics.readonly`) et `site/gsc-token.json`. B : `scripts/google-api-inspect.js:3-6` (lecture Search Console et GA4 par compte de service) et `sites/gsc-token.json`, d'empreinte identique à celui de A |
| N2 besoin déclaré ou balise | 6 | aucun | C : `CLAUDE.md:24` (balise Google Analytics en tête de chaque page). D : `apps/web/app/layout.tsx:179-180` (Tag Manager conditionnel à une variable). E : `forge/etapes/conception/ENTRANT.md:68` (statistiques de fréquentation, Search Console et historique SEO du site actuel, pièces demandées). F : `SPECIFICATIONS_*_V2.md:169-170` (deux indicateurs mesurés par Google Analytics). G et H : `frontend/confidentialite.html:214` (cookies Google Analytics déclarés, aucune balise trouvée dans le code) |
| N3 surface publique sans trace | 5 | Produit-61, Produit-68, Produit-69 | `robots.txt` et `llms.txt` à la racine de chacun ; I et J : de même, I portant en plus un module `app/seo.py` |
| N4 aucune trace | 35 | Produit-05, Produit-12 | 0 occurrence après exclusions |

**Besoin établi (N1 + N2) : 10 produits sur 50, soit 20 %. Besoin plausible, borne haute (N1 + N2 + N3) : 15 sur 50, soit 30 %.** Parmi les 13 produits à surface publique (N1 : 4, N2 : 4, N3 : 5), 4 ont déjà une lecture.

### M-4 Par source (P1)

Ce tableau dit pour laquelle des trois sources le besoin est le plus large : il compte les produits qui la lisent déjà, puis ceux qui la déclarent ou la balisent sans la lire.

| Source | Lecture établie | Balise ou besoin déclaré, sans lecture |
|---|---|---|
| Google Analytics 4 | 4 (Produit-02, Produit-79, A, B) | 5 (C, D, F, G, H) |
| Search Console | 4 (Produit-02, Produit-79, A, B) | 1 (E) |
| Google Ads | 2 (Produit-02, Produit-79) | 0 |

Google Ads est la source la plus étroite : 2 produits sur 50. Produit-02 y a déployé 5 campagnes et en tient le relevé (kit `build/google/ads-releve.py`) ; Produit-79 y a lu un compte le 17/10 (entrées 246 à 249).

### M-5 Le registre dit la même chose (P1)

Le registre et son archive portent 1 867 créations d'items. 24 produits y sont suivis (27 pseudonymes distincts de demandeurs, moins 3 indices retirés : Produit-60, 66 et 76). 25 items dont le titre ou le contenu nomme Search Console, Google Analytics, GA4, Google Ads ou l'une de leurs API : 20 viennent de Produit-02 (dont 15 sous le pseudonyme exact), 3 de Produit-79 (TF-1848, TF-1852, TF-1854), 2 d'un demandeur humain ou du pilot (TF-0251, TF-1569). **Seuls 2 produits sur 24 ont remonté ces sources.** Garde : 7 seulement des 24 produits suivis ont un dossier retrouvé sur ce poste (H1).

### M-6 Rythme et diversité des connexions (P1, P5)

4 produits ont connecté ces sources entre le 2026-03-31 et le 2026-10-17, soit six mois et demi, par **4 mécanismes différents** :

| Produit | Mécanisme | Date | Source |
|---|---|---|---|
| A | client OAuth « installé », fichier de jeton, 4 portées dont 3 qui accordent l'écriture (`webmasters`, `indexing`, `analytics.edit`) | script du 2026-03-31, jeton du 2026-04-08 | `site/scripts/gsc-auth.mjs:20-25`, date du fichier |
| B | le même fichier de jeton copié (empreinte identique), plus un script par compte de service | script commité le 2026-04-18 | `git log --diff-filter=A` sur `scripts/google-api-inspect.js` |
| Produit-02 | compte de service en lecture, clé posée en secret de dépôt, relevés hebdomadaires en CI | premier récit au journal 2026-08-30 (entrée 41), secret posé le 2026-09-01 (entrée 63) | `forge/ledger.jsonl` ; `.github/workflows/mesure.yml`, `indexation.yml` |
| Produit-79 | identifiants par défaut de l'application (voie utilisateur), 2 serveurs MCP | 2026-10-17 | `forge/ledger.jsonl` entrées 241 à 250 |

Aucun de ces quatre n'a réutilisé la procédure d'un autre. Au journal de Produit-02, 85 entrées sur 450 nomment Google Ads, 41 Google Analytics et 21 Search Console, du 2026-08-30 au 2026-10-18 : une fois connecté, l'usage est récurrent.

### M-7 Ce que la connexion du 17/10 a coûté en temps (P2)

- **55 minutes**, de 07:55 à 08:50, 4 gestes humains (RA-9, ligne 27 du lot). Recoupement au journal de Produit-79, heure de Paris (UTC + 2 le 17/10) : demande à 08:02 (entrée 240) ; projet créé et 4 API activées par l'agent à 08:02 (entrée 241) ; client OAuth rangé et connexion de lecture à 08:34, 32 minutes après la demande (entrée 245) ; Google Analytics 4 et Search Console lus en 200 (entrée 246, écrite avec la 245) ; accès Explorer demandé et serveur Google Ads déclaré à 08:39 (entrée 248) ; essai des deux serveurs MCP, PASS, à 08:48, 46 minutes après la demande (entrée 250). L'horodatage est celui de l'écriture au journal, non celui du geste.
- **Explorer : 7 minutes d'attente** (demandé 08:30, lecture réelle 08:37, constat de Produit-79 repris à `references\INTEGRATIONS-FOURNISSEURS.md` ligne 295), soit 13 % des 55 minutes (7 sur 55).
- Le référentiel écrit que la connexion « a pris une matinée, dont la moitié à chercher » (ligne 211). Cette durée n'est pas celle du déroulé consigné (55 minutes) ; la part de recherche n'est pas ventilée : **non mesuré**.
- Durée de connexion de Produit-02, de A et de B : **non mesuré** (le journal de Produit-02 ne raconte le compte de service qu'à partir du 2026-08-30 ; les dossiers A et B n'ont pas de journal).

### M-8 Ce qu'un skill automatiserait, ce qui resterait humain (P3)

Étapes de la voie utilisateur telle que Produit-79 l'a jouée (entrées 240 à 250), plus l'étape propre à la voie compte de service. Lecture du tableau : les lignes suivent l'ordre du déroulé ; la colonne « Qui l'a faite le 17/10 » dit l'acteur réel ; « Un skill la ferait ? » dit si un script pourrait la jouer ; « Reste humain » dit si une personne doit la faire. Les lignes 3, 4, 5 et 7 sont les 4 gestes de RA-9.

| # | Étape | Qui l'a faite le 17/10 | Un skill la ferait ? | Reste humain |
|---|---|---|---|---|
| 1 | Choisir la voie (utilisateur ou compte de service) | agent | oui, arbre de décision | non |
| 2 | Créer le projet Cloud, activer les 4 API, isoler `CLOUDSDK_CONFIG` | agent (entrée 241) | oui, provisionnement scripté | non |
| 3 | Clic de connexion : consentement dans le navigateur | humain, geste 1 | non, consentement personnel | oui |
| 4 | Écran « Branding » | humain, geste 2 | non, console seulement | oui |
| 5 | Client OAuth « Desktop app » | humain, geste 3 | non : `gcloud iam oauth-clients create` crée un client IAM aux portées limitées (ligne 236 du référentiel) | oui |
| 6 | Connexion de lecture (identifiants par défaut, fichier du client) | agent (entrée 245) | oui | non |
| 7 | Demande d'accès Explorer (Google Ads seulement) | humain, geste 4 | non : bouton de la console, page Google Ads du 2026-10-14 | oui |
| 8 | Déclarer les 2 serveurs MCP | agent (entrées 245, 248) | oui | non |
| 9 | Les essayer dans la session par un client stdio | agent (entrée 250) | oui, par un outil | non |
| 10 | Sonde d'accès datée, 5 appels | agent (entrée 246) | oui | non |
| 11 | Consigner variables et journal | agent (entrée 242) | oui | non |
| 12 | Voie compte de service : ajouter son adresse à chaque propriété et au compte publicitaire | humain | non | oui (déduit de la page Google Ads et de l'usage de Produit-02, non rejoué) |

Sur les 11 étapes de la voie utilisateur, 4 sont humaines et 7 sont faites par l'agent. **Un skill rendrait reproductibles les 7 étapes de l'agent ; il ne retire aucun des 4 gestes.** Sans compte Google Ads, il n'y en a que 3. Le temps que l'agent a passé sur ses 7 étapes n'est pas séparable des attentes de l'humain dans le journal : **non mesuré**, donc le temps qu'un skill ferait gagner l'est aussi.

### M-9 Ce qui périme vite (P5)

Ce tableau montre quels faits de la connexion changent assez vite pour qu'un code ou un skill qui les porterait devienne faux ; chaque ligne donne la mesure et sa source.

| Fait | Mesure | Source |
|---|---|---|
| Version d'API Google Ads en service | le référentiel donnait v22 en service jusqu'au 18/10 ; elle rend `400 UNSUPPORTED_VERSION` le 17/10 ; mesure d'origine du 22/09, soit 25 jours plus tôt | `references\INTEGRATIONS-FOURNISSEURS.md` ligne 154 |
| Serveurs MCP de Google | `google-ads-mcp` : 5 versions du 2025-10-22 au 2026-10-09 ; `analytics-mcp` : 8 versions du 2025-08-22 au 2026-07-29 ; 9 outils constatés contre 7 au README | API JSON de PyPI rejouée le 2026-10-18 ; référentiel ligne 250 |
| Jeton en mode Test | expire 7 jours après le consentement | référentiel ligne 238 |
| Parcours d'écran | « Branding », client OAuth, centre d'API : écrits d'après l'écran du jour, jamais d'après l'aide | référentiel lignes 236-237 ; classe `interface-tierce-ecrite-de-memoire` |

Ces faits changent à l'échelle de la semaine ou du mois. Ils relèvent de la loi n° 4 (donnée volatile = donnée datée et sourcée), pas du code : un skill ne peut qu'y renvoyer.

### M-10 Constats en passant

- **C1 — le référentiel contredit la pratique de deux produits.** Les lignes 224 et 299 de `references\INTEGRATIONS-FOURNISSEURS.md` donnent la voie utilisateur pour GA4 et Search Console et disent « non vérifié » l'ajout d'un compte de service. Produit-02 lit les deux par compte de service en CI (`indexation.py:45`, `statut.py:41-43`, entrée 113 du 2026-09-03) et B le fait par script. La lecture réussit, donc l'ajout de l'adresse est accepté ; la voie utilisateur, elle, impose un renouvellement du jeton toutes les 7 jours en mode Test, incompatible avec un relevé hebdomadaire sans humain.
- **C2 — jetons à portée d'écriture.** Le fichier de jeton partagé par A et B porte `webmasters`, `indexing` et `analytics.edit`, trois portées qui accordent l'écriture ; `digit-ai-forge-seo-geo\referentiel\sources-donnees.md` (règle 1 de la voie connecteur, commit a567350) exige des portées de lecture seule. Chez B le fichier est ignoré par git ; le dossier racine de A n'est pas un dépôt git.
- **C3 — l'outil d'essai MCP n'a servi qu'une fois sur quatre connexions** (celle de Produit-79) ; son code vit dans le dossier temporaire de cette session (`mcp_client.mjs`, entrée 250).

### M-11 Non mesuré et hypothèses non résolues

- H1 — Le parc est celui de ce poste : 7 des 24 produits suivis au registre y ont un dossier retrouvé ; les autres postes ne sont pas mesurés.
- H2 — Un produit classé N4 peut avoir un besoin non écrit : la mesure lit des traces, pas des intentions.
- H3 — « Auront besoin » n'est pas mesurable : la borne haute de 15 sur 50 est un plafond, non une prévision.
- H4 — Durées de connexion de Produit-02, A et B ; part de recherche de Produit-79 ; temps de l'agent contre temps de l'humain par geste : non mesurés.
- H5 — Temps qu'un skill ferait gagner : non mesuré, aucune connexion n'a été rejouée avec une procédure.
- H6 — Le délai Explorer (7 minutes), la ligne de commande exacte de la connexion et la version installée d'`analytics-mcp` sont des constats de Produit-79, non rejoués ici (le référentiel le dit aussi, lignes 292-300).
- H7 — Le journal horodate l'écriture, pas le geste ; l'heure de Paris suppose UTC + 2 le 17/10/2026.
- H8 — L'option O4 est ajoutée par l'agent aux quatre options nommées par la consigne.

## 2. Non-recouvrement contre l'existant

Ce non-recouvrement se lit ligne à ligne : chaque existant examiné porte la citation qui permet de le vérifier.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `references\INTEGRATIONS-FOURNISSEURS.md`, sections Google (lignes 207 à 300), commit b884b400 du 2026-10-18 | ligne 207 « ## Google — se connecter : voie OAuth « utilisateur » ou compte de service » ; ligne 251 « Un client stdio de 40 lignes (`initialize`, `tools/list`, `tools/call`) les essaie dans la session » (en prose, sans le code) | recouvre en partie : les faits datés y sont ; l'ordre exécutable, la sonde, le code du client et l'arbitrage corrigé par C1 n'y sont pas |
| Kit Google Ads de forge-ops, `digit-ai-forge-ops\scripts\google-ads\README.md` ; catalogue `catalogues\CATALOGUES.md` ligne 87 | « ## Paramétrage de l'accès en lecture par l'API » (ligne 104) ; cat-ops-07 « Préparer et relever des campagnes Google Ads » | recouvre en partie : 1 source sur 3, voie compte de service seulement ; ne couvre ni GA4 ni Search Console ni la voie utilisateur |
| Forge de référencement, `digit-ai-forge-seo-geo\referentiel\sources-donnees.md` v1.1.0 du 2026-10-18 | ligne 32 « ## Deux voies pour Search Console et Google Analytics 4 » ; règle 8 « La procédure de connexion n'est pas recopiée ici » | ne recouvre pas : elle consomme la connexion et la renvoie au référentiel du pilot |
| Skills versionnés de forge-agents, `digit-ai-forge-agents\.claude\skills\` | 26 dossiers, de `accueil-factory` à `write-an-oracle` ; aucun nom ne porte Google, connexion, analytics ou MCP | ne recouvre pas |
| Skill de session `google-workspace` | description : « Read this before the first Google Drive, Docs, Sheets or Slides connector call whenever the task creates or changes a Google file » | ne recouvre pas : fichiers Drive, Docs, Sheets, Slides, ni GA4 ni Search Console ni Google Ads |
| Lot et journal de Produit-79 | RA-9 : « Cette capacité ne vit que dans le ledger et les synthèses du produit » ; `forge/ledger.jsonl` entrées 240 à 250 | ne recouvre pas comme capacité de forge : le contenu existe, hors de portée des autres produits |
| Code de Produit-02, `build/google/` (12 fichiers) et `.github/workflows/` | `provisionner.py:17-22` : constantes de propriété et de conteneur propres au produit en tête de fichier | ne recouvre pas : capacité du produit, non générique |
| Registre : TF-1364, TF-1848, TF-1854, TF-1596 | TF-1364 corrigé le 2026-10-13 (kit forge-ops) ; TF-1848 corrigé le 2026-10-18 (« Complète TF-1364 ») ; TF-1854 décidé le 2026-10-18 (D-27 (a), voie connecteur) ; TF-1596 corrigé (règle I1) | ne recouvre pas TF-1852 : TF-1848 a versé les faits au référentiel, TF-1854 a ouvert la voie côté référencement, aucun ne porte la procédure ni l'essai MCP |

## 3. État de l'art daté

Huit sources datées de moins de 24 mois disent où en sont les outils de connexion et ce que Google exige. Les quatre premières ont été rejouées le 2026-10-18 pour cette étude ; les quatre dernières sont des pages de Google, dont deux relues le même jour (nommées) et deux reprises du référentiel sans relecture.

- **PyPI, `google-ads-mcp` 0.0.5**, mise en ligne le 2026-10-09, première version le 2025-10-22, 5 versions, `pypi.org/pypi/google-ads-mcp/json` : 3 outils de lecture au README, portée `adwords`.
- **PyPI, `analytics-mcp` 0.7.0**, mise en ligne le 2026-07-29, première version le 2025-08-22, 8 versions, `pypi.org/pypi/analytics-mcp/json` : portée `analytics.readonly`, README intitulé « Experimental ».
- **GitHub, `googleads/google-ads-mcp`**, créé le 2025-10-03, dernier envoi le 2026-10-09, 1 047 étoiles, `api.github.com/repos/googleads/google-ads-mcp`.
- **GitHub, `googleanalytics/google-analytics-mcp`**, créé le 2025-07-16, dernier envoi le 2026-10-02, 3 496 étoiles, `api.github.com/repos/googleanalytics/google-analytics-mcp`.
- **Google Ads, « Access levels »**, mise à jour du 2026-10-14, lue le 2026-10-18, `developers.google.com/google-ads/api/docs/api-policy/access-levels` : le niveau Explorer lit les comptes de production, plafonné à 2 880 opérations par jour ; la demande de relèvement se fait par un bouton de la console, et Google peut relever le niveau automatiquement.
- **Google Ads, « Service accounts »**, mise à jour du 2026-10-14, lue le 2026-10-18, `developers.google.com/google-ads/api/docs/oauth/service-accounts` : accès sans consentement humain, adresse ajoutée dans Admin > Accès et sécurité > Utilisateurs, pas de rôle d'administrateur par défaut.
- **Google Identity, « OAuth 2.0 », section « Refresh token expiration »**, page du 2026-10-16, reprise du référentiel (ligne 238), non relue : un écran de consentement externe au statut « Testing » expire à 7 jours.
- **Google Cloud, « Secure by default organizations »**, page du 2026-10-13, reprise du référentiel (ligne 224), non relue : l'interdiction des clés de compte de service s'applique aux organisations créées depuis le 03/05/2024.

Ce que l'état de l'art apporte ici : les deux serveurs MCP sont publiés par Google, jeunes (premières versions du 2025-08-22 et du 2025-10-22) et changent vite (5 versions en 11 mois et demi pour l'un, 8 en 11 mois pour l'autre) ; Explorer suffit à lire un compte réel ; la voie compte de service est documentée côté Google Ads et l'est par l'usage côté GA4 et Search Console. Une recherche web du 2026-10-18 ne remonte, pour Search Console, que des serveurs communautaires et des guides tiers sans date de page : aucun n'est compté ici.

## 4. Options — jeu fermé O0-O4

Cinq options, de l'inaction au skill complet ; chacune porte son contenu, son coût en complexité × durée et ce qu'elle exclut. Les quatre premières sont celles de la consigne ; O4 est ajoutée par l'agent (H8).

- **O0 — ne rien faire** (de plus que TF-1848, déjà corrigé). **Réfutée.** Coût du statu quo, mesuré : 4 mécanismes distincts pour 4 produits en six mois et demi, sans procédure commune (M-6) ; l'ordre des gestes et l'essai MCP ne vivent qu'au journal de Produit-79 (RA-9 ; entrées 240 à 250) ; le référentiel dit « non vérifié » ce que deux produits pratiquent (C1), ce qui oriente le prochain produit vers un jeton qui expire chaque semaine en mode Test, pour un relevé lui-même hebdomadaire. Rattachée à P2 et P4.
- **O1 — skill complet « connecter les sources Google d'un produit » dans forge-agents.** Contenu : choix de voie, provisionnement scripté (projet, API, `CLOUDSDK_CONFIG`), guide des 4 gestes avec écrans datés, connexion de lecture, sonde d'accès datée, déclaration et essai des serveurs MCP par client stdio, consignation ; scripts exercés à double sens contre un serveur MCP factice et des réponses enregistrées (R-31, test 2) ; lecture des faits périssables au référentiel. Coût : complexe × long (3 sources, 2 voies, plusieurs environnements ; la recette ne rejoue pas Google ; maintenance à la cadence de Google, M-9). Exclut : rien sur le fond, mais dépend du référentiel (O2 en est un préalable) et n'économise aucun des 4 gestes. Rattachée à P3 et P5.
- **O2 — procédure ordonnée au référentiel, sans skill** (fiche (b) de D-26). Contenu : dans `references\INTEGRATIONS-FOURNISSEURS.md`, une section « Connexion pas à pas » : l'arbre de choix de voie corrigé par C1 ; les 11 étapes de M-8 avec la mention agent ou humain ; les gestes humains avec chemin d'écran daté et sourcé ; la sonde d'accès de 5 appels ; le client stdio de 40 lignes en annexe de texte, rejoué une fois avant d'être écrit. Coût : simple × court. Exclut : toute automatisation versionnée (l'agent relit et exécute à chaque connexion) et tout outil exercé. Rattachée à P2, P4, P5.
- **O3 — outil d'essai MCP seul.** Contenu : un script de forge-agents (`initialize`, `tools/list`, `tools/call`) avec self-test à double sens contre un serveur MCP factice, sans procédure. Coût : simple × court. Exclut : la procédure, donc la recherche reste à chaque connexion ; et 3 connexions sur 4 qui n'ont pas eu recours à MCP (M-10, C3). Rattachée à P3.
- **O4 — O2 plus O3.** Contenu : la procédure au référentiel, plus le client d'essai rangé comme script exercé de forge-agents ; skill différé. Coût : moyen × court (deux livraisons dans deux dépôts). Exclut : le skill ; ajoute un objet durable pour un besoin vu une fois, sans cadence ni mandat propres (R-31, test 3). Rattachée à P3 et P5.

## 5. Verdict

Une seule option est retenue ; le verdict dit pourquoi, ce qu'elle coûte, quand elle sera confrontée aux faits, et comment elle remonte à votre décision.

- **Option retenue** : O2.
- **Pourquoi O2** : (1) le besoin est mesuré et étroit : 4 produits sur 50 ont lu ces sources, 2 sur 50 Google Ads (M-3, M-4) ; (2) la connexion mesurée dure 55 minutes, et ses 4 gestes humains sont hors de portée d'un skill (M-7, M-8) ; (3) ce qui coûte est périssable et vit déjà, depuis TF-1848, au référentiel daté (M-9, loi n° 4) ; (4) R-31 (`REGLES-PROJET.md` lignes 378-389) : un skill naît d'un verbe outillé exécutable absent ailleurs, exercé dès la v0, avec une cadence ou un mandat propres ; seul l'essai d'un serveur MCP est un tel verbe, il n'a servi qu'à une connexion sur quatre et la sonde de 5 appels n'est consignée que chez Produit-79 ; le reste est de la procédure, que le corollaire de R-31 range au « référentiel versionné — jamais une forge NI un skill » ; (5) loi n° 1 : un skill nommé « connecter » promettrait une automatisation que 4 gestes démentent.
- **Pourquoi pas les autres** : O1 coûte une maintenance à la cadence de Google pour rendre reproductibles 7 étapes dont le gain en temps n'est pas mesuré ; O3 et O4 créent un objet durable pour un usage vu une fois ; O0 laisse C1 et l'ordre des gestes là où personne ne les lit.
- **Coût** : simple × court (une section au référentiel du pilot, l'arbre de choix corrigé, le client d'essai rejoué une fois, la sonde écrite). Dette : le client stdio est du texte, non exercé tant que O3 n'est pas ouverte ; la section se périme comme le reste du référentiel et se redate à chaque lecture.
- **Candidature(s) émise(s)** : aucune dans ce tour, le mandat étant l'étude seule. Prêtes à déposer sur votre accord : (1) TF-1852 : section « Connexion pas à pas » au référentiel (O2) ; (2) correction des lignes 224 et 299 du référentiel selon C1 ; (3) un candidat de constat pour C2, les jetons à portée d'écriture des dossiers A et B.
- **Plan de revue** : 2026-12-18, sur les connexions faites depuis le 2026-10-18. Critères écrits d'avance : K1 — au moins 2 nouvelles connexions de produit à ces sources dans la période → rouvrir O1 ; K2 — la durée mesurée de chaque connexion suivie avec la procédure dépasse les 55 minutes de Produit-79 → la procédure n'a rien gagné, la réviser ; K3 — au moins un écart entre la procédure et la réalité relevé → le corriger au référentiel dans la semaine ; K4 — le client d'essai MCP recopié au moins 2 fois → ouvrir O3. Sans nouvelle connexion, le skill n'avait pas d'usage et O2 se confirme.
- **Test rétro** :
  - *Opération → Tactique* : chaque élément de O2 (arbre de choix, 11 étapes, gestes datés, sonde, client en annexe) répond à un constat mesuré : M-8 pour les étapes, C1 pour l'arbre, M-6 pour l'unification des 4 mécanismes ; aucun n'est retenu sans constat.
  - *Tactique → Stratégie* : la stratégie est de ne créer un objet durable qu'une fois sa demande mesurée, et de garder au référentiel daté ce qui périme (loi n° 4, R-31) ; les alternatives écartées (O1, O3, O4) sont chacune rattachée à un chiffre.
  - *Stratégie → Intention* : vous vouliez chiffrer le besoin sur le parc avant de décider d'un skill ; le besoin est mesuré (10 produits sur 50 établis, 15 en borne haute), le coût d'une connexion est daté (55 minutes, 4 gestes), et le skill est rouvert par des critères écrits plutôt que par une impression.
  - *Questions du demandeur rejouées* : « combien de produits du parc en ont besoin ? » — 4 l'ont déjà fait, 6 le déclarent, 5 sont plausibles (M-3). « Combien de temps la connexion a-t-elle coûté ? » — 55 minutes pour Produit-79, non mesuré pour les trois autres (M-7). « Que ferait un skill, que resterait humain ? » — 7 étapes sur 11, aucun des 4 gestes (M-8). « Quelles options, à quel coût ? » — O0 à O4, en complexité × durée. « Quel verdict ? » — O2.
  - *Rupture constatée* : aucune. Limite dite : un seul poste, des traces écrites et non des intentions (H1, H2, H3).

Décision attendue de votre part : confirmer O2, ou rouvrir O1 dès maintenant malgré ces mesures. Rien n'est appliqué tant que vous n'avez pas répondu.

Contrôle exécuté le 2026-10-18 depuis la racine du pilot : `node oracles\oracle-etude-opportunite.mjs output\03-etudes\20261018-etude-opportunite-connexion-sources-google.md` — verdict PASS, E1 à E10 tous PASS, sortie 0 (E3 : 19 dates comptées ; E2 : 8 lignes toutes citées). Lisibilité (`check_markdown.py`, règles M7, M10, M14, M18) : PASS.
