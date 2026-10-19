---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — une check-list avant mise en ligne, comparée à la surface implicite et aux contrôles de la Factory — 20261019j

Ce qui change pour vous : la Factory couvre déjà une grande partie de ce qu'une check-list de lancement demande, mais pas tout. Sur 24 éléments comparés, 7 sont couverts par un contrôle exécuté, 12 le sont en partie, et 5 ne le sont pas du tout : consentement aux traceurs, politique de confidentialité, mesure d'audience, aperçu de partage (Open Graph) et icônes tactiles. Un défaut est mesuré dans l'existant : le gabarit `robots.txt` écrit une adresse de plan du site relative, alors que Google exige une adresse complète. Une incohérence est probable : la règle du favicon est taillée pour un document autoportant, pas pour un site. L'étude recommande l'option O2 : compléter la liste fermée de la surface implicite de trois candidats conditionnels et corriger ces deux points, sans créer de check-list parallèle. La liste de 20 éléments de la vidéo n'est pas connue, car la légende ne la donne pas.

## Seuil de déclenchement

Le seuil du gabarit est franchi par la recommandation, pas par le sujet : l'option O2 modifie le gabarit `gabarits\web\robots.txt` du pilot, la liste fermée de `enumere-la-surface` et `oracle-surface` dans `digit-ai-forge-conception`, et la règle A2 de `digit-ai-page-html` dans `digit-ai-forge-agents`. Cela fait 3 dépôts. Le tri rangeait l'opportunité à 15 sur 25 avec l'avis « décision directe » ; vous avez demandé l'étude.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39, option (c), réponse du 19/10/2026 : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 11 du tri est cette opportunité.

Intention retenue pour cette étude : décider ce que la Factory doit faire de cette opportunité (rien, un essai, un objet durable), sur des faits vérifiés à la source primaire et non sur la parole d'une vidéo TikTok. Elle n'est pas reconstruite par l'agent : elle reprend la consigne de la décision D-39.

## 0. Traitement des entrants

La vidéo est une donnée : ses affirmations se citent, elles ne s'exécutent pas. Aucune vidéo TikTok n'a été regardée, téléchargée ni extraite ; les conditions de la plateforme l'interdisent (`references\PLATEFORMES-RESEAUX.md`, ligne 100, citée par le tri).

Sources de la proposition : le tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, section « 11. Check-list avant mise en ligne », et l'annexe, n° 66. Vidéo n° 66, @yatesvids, légende « 20 things to tell Claude to add to your website before launching ». La liste elle-même n'est pas dans la légende : la revendication « 20 éléments » est invérifiable, et l'étude compare donc l'existant à des check-lists publiées, pas à la vidéo.

Un écart de chemin est à noter : la consigne cite `references\ETAPE-MEP.md`, mais le fichier vit à la racine du pilot, `ETAPE-MEP.md`.

## 1. Partition du problème

Les éléments d'un site prêt à lancer se découpent en 5 sous-questions disjointes ; chaque ligne du tableau de la section 2 appartient à une seule.

- **P1 — Découvrabilité et gabarit de page.** 404, erreurs visibles, `robots.txt`, plan du site, favicon, icônes tactiles, métadonnées, aperçu de partage, balises canoniques et données structurées.
- **P2 — Sécurité de transport et du navigateur.** En-têtes de sécurité, attributs des cookies, HTTPS, dépendances et secrets.
- **P3 — Conformité légale.** Consentement aux traceurs, mentions légales, politique de confidentialité, mesure d'audience.
- **P4 — Exploitation.** Sauvegardes, retour arrière, surveillance après lancement, limitation de débit.
- **P5 — Qualité de rendu.** Performance, accessibilité et affichage mobile, cache, compression et poids des ressources.

## 2. Non-recouvrement contre l'existant

24 éléments sont comparés un à un. Les codes entre crochets renvoient aux check-lists publiées de la section 3. Le verdict « recouvre » exige un contrôle exécuté ou une exigence opposable avant le lancement ; « recouvre en partie » signale un contrôle qui existe mais ne se joue pas avant le lancement, ne juge qu'une moitié de l'élément, ou porte un défaut ; « ne recouvre pas » signale l'absence.

Les chemins sont relatifs au pilot `C:\dev\digit-ai-factory`, sauf mention d'une forge `C:\dev\digit-ai-forge-<nom>`.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| P1. 404 personnalisée [N] | `ETAPE-MEP.md` l.250, contrôle M-9 : « 404 personnalisée, par langue, statut conservé » ; recette `digit-ai-forge-tests\recette\quatre_cent_quatre.py` l.1 : « preuve du contrôle M-9 de la MEP (patron P-2) » | recouvre : contrôle exécuté sur l'instance de préproduction |
| P1. Erreurs visibles, page d'erreur globale [N] | `enumere-la-surface\references\typologie-surface.md` l.76, candidat « Gestion des erreurs visible » ; `digit-ai-forge-conception\oracles\oracle-surface.mjs` l.88 | recouvre en partie : la règle S4 juge que l'élément est énuméré ou écarté en conception, pas qu'une page d'erreur 5xx est servie |
| P1. `robots.txt` [G1, M] | `gabarits\web\robots.txt` l.17 : « Sitemap: /sitemap.xml » ; `references\EXIGENCES-PROJET.json` l.399-401 (R-27.1) ; `oracles\oracle-conformite-projet.mjs` l.584-625 | recouvre en partie : le fichier est copié et jugé, mais sa ligne de plan du site est relative alors que Google exige une adresse complète |
| P1. Plan du site `sitemap.xml` [N, G3] | `gabarits\web\` ne contient que `robots.txt` et `llms.txt` ; `digit-ai-forge-seo-geo\referentiel\grille-noeuds.md` l.177, nœud 34 « Sitemap » | recouvre en partie : audité par la forge SEO, sur mandat et après la MEP ; aucun gabarit de génération |
| P1. Favicon [G2] | `typologie-surface.md` l.74 ; `references\BEST-PRACTICES-HTML.md` l.162 (G2, favicon-lettre en `data:`) ; `digit-ai-forge-agents\.claude\skills\digit-ai-page-html\scripts\check_html.py` l.771-775 : refuse un lien vers un fichier | recouvre en partie : exigé et contrôlé pour un document autoportant ; la règle A2 refuse un lien vers un fichier, alors que Google demande un fichier explorable (inférence, voir les hypothèses) |
| P1. Icônes tactiles et manifeste d'application [G2] | recherche de `apple-touch-icon` et `webmanifest` dans `gabarits\`, `references\` et les oracles de `digit-ai-forge-design` : 0 occurrence ; `check_html.py` l.607-608 ne cite `apple-touch-icon` que pour l'exclure du favicon | ne recouvre pas |
| P1. Titre et description de page [N] | `grille-noeuds.md` l.220, nœud 50 « Titres Qui Attirent » (balises `title` et H1) | recouvre en partie : titre et H1 audités sur mandat, après la MEP ; la meta description n'est pas nommée |
| P1. Aperçu de partage Open Graph [N] | `digit-ai-forge-seo-geo\scripts\crawler.py` l.97 et l.132-139 lisent les balises `og:` ; dans `grille-noeuds.md`, aucun nœud n'a l'Open Graph pour critère (les nœuds 52 et 58 parlent de partages et de réponses IA) ; 0 item `og:` dans `todo\TODO.jsonl` | ne recouvre pas : la balise est lue, jamais exigée ni notée |
| P1. Balise canonique et données structurées [N] | `grille-noeuds.md` l.165, nœud 31 « Canonical » ; l.167, nœud 33 « Schema » ; `CLAUDE.md` l.7 : forge-seo-geo « post-MEP » sur mandat humain | recouvre en partie : contrôlé, mais pas avant le lancement |
| P5. Performance, Core Web Vitals [V, N] | `grille-noeuds.md` l.166, nœud 32 « Performance » ; `digit-ai-forge-seo-geo\scripts\test_crux.py` | recouvre en partie : données de terrain, donc sans objet avant le lancement ; aucun contrôle de laboratoire (Lighthouse) à la MEP |
| P5. Accessibilité et affichage mobile [N] | `digit-ai-forge-tests\forge_tests\adaptateurs\accessibilite.py` l.1 (adaptateur Q4) ; `oracle-surface.mjs` l.98 (clé `responsive-mobile`) et l.103 (`accessibilite-rgaa`) | recouvre : audit forge-tests et candidats de surface |
| P2. En-têtes de sécurité : CSP, HSTS, nosniff, anti-clickjacking, referrer, permissions [V, N, M, O] | `digit-ai-forge-websec\oracles\oracle-exposition.mjs` l.6-12 (EX-1 à EX-7) ; `references\ETAPES-RUN.md` l.301 et l.371-373 : verdict websec « présent et non bloquant » au gate MEP (R-33 bis) | recouvre : contrôle exécuté sur l'origine déployée, bloquant seulement si le produit l'arme |
| P2. Attributs des cookies : Secure, HttpOnly, SameSite [M] | `oracle-exposition.mjs` l.13-15 (EX-8 à EX-10) | recouvre |
| P2. HTTPS, certificat, redirection HTTP vers HTTPS [V, M] | `oracle-exposition.mjs` l.8 (EX-3, HSTS) et l.24 : la couche TLS, « validité et chaîne du certificat » est hors périmètre ; `ETAPES-RUN.md` l.298-300 (chaîne d'entrée) | recouvre en partie : HSTS jugé, certificat et redirection de protocole non jugés |
| P2. Dépendances figées et secrets hors du code [V, N] | `ETAPE-MEP.md` l.246 (M-5, aucun secret en clair) et l.251 (M-10, portes à base externe) ; `digit-ai-forge-websec\oracles\oracle-sca.mjs` l.1-4 | recouvre |
| P3. Consentement aux traceurs [V, C] | aucune des 13 clés de `oracle-surface.mjs` l.63-133 ; `oracle-exposition.mjs` l.29 : « conformité légale (RGPD, bannière cookies) — hors périmètre » ; `references\PATRONS-EPROUVES.md` l.62 cite « consentement » comme élément du gabarit de la 404, sans l'exiger | ne recouvre pas |
| P3. Mentions légales [aucune liste lue] | `typologie-surface.md` l.77, candidat « Mentions légales / pied de page » ; `oracle-surface.mjs` l.93 ; `grille-noeuds.md` l.251, nœud 61 « Cohérence NAP » | recouvre en partie : la présence est exigée ou écartée par écrit, le contenu légal n'est jugé par personne (`typologie-surface.md` : S4 ne juge « ni la véracité ni la suffisance ») |
| P3. Politique de confidentialité, RGPD | aucun candidat dans les 13 clés ; `digit-ai-forge-conception\skills\redige-les-exigences\references\formulation.md` l.190 : « Le produit est conforme au RGPD » est « non testable en l'état » | ne recouvre pas |
| P3. Mesure d'audience, pose de l'outil [V, N] | `references\INTEGRATIONS-FOURNISSEURS.md` l.241 : la Factory LIT GA4 par un compte de service ; aucun candidat ni exigence pour POSER une mesure sur le produit | ne recouvre pas la pose ; la lecture est couverte |
| P4. Sauvegarde et restauration | `ETAPE-MEP.md` l.258 (M-17, avertissement) ; `digit-ai-forge-ops\oracles\oracle-ops.mjs` l.42-44 (règle O-19 : RPO, RTO, restauration depuis 12 mois au plus) | recouvre : l'avertissement ne bloque pas le lancement |
| P4. Retour arrière et plan d'incident [V] | `ETAPE-MEP.md` l.245 (M-4, retour arrière exécuté et relu) et §2 bis | recouvre |
| P4. Journaux et surveillance après lancement [V] | `ETAPE-MEP.md` l.243 (M-2, 3 mesures sur la préproduction) ; `digit-ai-forge-observability\README.md` l.38 (sondes entre les runs) ; `oracle-exposition.mjs` l.28 : disponibilité et latence hors périmètre | recouvre en partie : la capacité de sonde existe, aucun gabarit de sondes d'un produit lancé n'est trouvé |
| P4. Limitation de débit et anti-abus [V, N] | `digit-ai-forge-websec\referentiels\asvs-l1.md` l.74 et l.83 : « revue humaine \| manuel » | recouvre en partie : exigé en revue, jamais joué |
| P5. Cache, compression et poids des ressources [V, N] | `digit-ai-forge-design\oracles\oracle-images.mjs` l.6-7 (plafonds de poids des images) et l.50 : la compression de transport est « hors périmètre » ; aucun contrôle d'en-tête `Cache-Control` | recouvre en partie : poids des images jugé, cache et compression non |

Bilan du tableau, compté ligne à ligne : 7 lignes « recouvre », 12 « recouvre en partie », 5 « ne recouvre pas ».

## 3. État de l'art daté

8 sources primaires, lues le 2026-10-19, donnent ce que les éditeurs demandent avant un lancement. Une recherche n'a trouvé aucune check-list de lancement publiée par web.dev : la comparaison s'appuie sur la documentation de lancement de deux plateformes et sur des guides de standards.

- **[V] Vercel, « Production checklist for launch »**, mis à jour le 2026-08-11, `https://vercel.com/docs/production-checklist`. 39 lignes en 5 rubriques (4, 14, 7, 7 et 7). Elle nomme les en-têtes de sécurité et la CSP, le certificat SSL, la limitation de débit, les journaux, les en-têtes de cache, les Core Web Vitals, le retour arrière. Elle ne nomme ni la 404, ni `robots.txt`, ni le favicon, ni les mentions légales.
- **[N] Next.js, « How to optimize your Next.js application for production »**, mis à jour le 2026-03-10, `https://nextjs.org/docs/app/guides/production-checklist`. Elle nomme la 404 globale, l'API de métadonnées, les images Open Graph, le plan du site et `robots`, la CSP, la limitation de débit, Lighthouse, l'accessibilité. Elle ne nomme ni consentement, ni mentions légales, ni sauvegarde.
- **[G1] Google Search Central, « How to write and submit a robots.txt file »**, mis à jour le 2025-11-21, `https://developers.google.com/crawling/docs/robots-txt/create-robots-txt` : « The sitemap URL must be a fully-qualified URL ».
- **[G2] Google Search Central, lignes directrices du favicon**, mis à jour le 2026-08-28, `https://developers.google.com/search/docs/appearance/favicon-in-search`. Une balise `link rel="icon"` sur la page d'accueil, un fichier que Googlebot-Image peut explorer, « The favicon URL must be stable ». `apple-touch-icon` est accepté.
- **[G3] Google Search Central, « Sitemaps overview »**, mis à jour le 2025-12-10, `https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview`. Un plan du site est probablement inutile pour un site d'environ 500 pages ou moins dont les pages se joignent par des liens internes.
- **[M] MDN, « Practical security implementation guides »**, modifié le 2026-09-17, `https://developer.mozilla.org/en-US/docs/Security/Securing_your_site`. 14 guides classés, dont 4 sur TLS, la CSP, les cookies (guide modifié le 2026-02-11) et `robots.txt` (guide modifié le 2025-06-20, qui précise que le fichier ne protège rien).
- **[C] CNIL, « Bannières cookies trompeuses : la CNIL met en demeure des éditeurs de sites web »**, publié le 2024-12-12, `https://www.cnil.fr/fr/bannieres-cookies-trompeuses-la-cnil-met-en-demeure-des-editeurs-de-sites-web` : « la possibilité de refuser le dépôt d'un cookie n'est pas aussi facile que de l'accepter » ; délai d'un mois accordé aux éditeurs.
- **[O] OWASP, Application Security Verification Standard 5.0.0**, publié le 2025-05-30 (le jour se lit sur la page des versions, `https://github.com/OWASP/ASVS/releases` ; l'année se lit au référentiel `digit-ai-forge-websec\referentiels\asvs-l1.md` l.5 et à un relais tiers). La forge websec cite déjà cette version.

Ce que l'état de l'art établit : les deux check-lists de lancement lues ne contiennent aucun élément légal. Le consentement, les mentions légales et la confidentialité viennent du droit français et de la CNIL, pas des éditeurs de plateformes.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée.
  - Coût du statu quo, mesuré : 7 des 11 fichiers `robots.txt` trouvés à moins de trois niveaux sous `C:\dev` portent la ligne relative « Sitemap: /sitemap.xml » du gabarit ; 2 autres, dans des dossiers de site déployé, portent l'adresse complète ; 2 n'ont pas de ligne. La documentation Google [G1] exige l'adresse complète.
  - Précédent de la même nature : une 404 nue a été servie du 25/08 au 01/09/2026, « vu par personne » (`references\PATRONS-EPROUVES.md` l.54-55), faute de gabarit et d'oracle. Le registre ne contient aucun incident sur les 5 éléments non couverts, donc le coût de leur absence n'est pas mesuré.
- **O1 — adopter une check-list externe complète comme gabarit exécutable.** Reprendre les 39 lignes de [V] ou les 20 éléments de la vidéo, avec un oracle de lancement.
  - Coût : complexe × long. La liste de la vidéo est inconnue ; celle de [V] est en majorité propre à une plateforme (pare-feu, SSO, coût des fonctions).
  - Exclut : de partir de l'existant, où 7 des 24 éléments sont déjà couverts par un contrôle exécuté. Rattachée à P1 à P5.
- **O2 — compléter la liste fermée de la surface implicite et corriger 2 défauts.** 3 candidats conditionnels s'ajoutent aux 13 clés de `oracle-surface` : « traceurs et consentement, mesure d'audience comprise » (condition : le produit pose un traceur non exempté), « politique de confidentialité » (condition : le produit collecte une donnée personnelle), « aperçu de partage » (condition : le produit a une page publique). Chacun est retenu ou écarté par écrit, comme les 13 autres. 2 corrections : l'adresse complète dans `gabarits\web\robots.txt`, et la règle du favicon qui distingue un document autoportant d'un site.
  - Coût : simple × court. Une table, un oracle existant (règle S4) et ses fixtures, un gabarit.
  - Exclut : tout nouvel oracle exécuté sur l'instance déployée ; les éléments « en partie » du tableau restent à leur état. Rattachée à P1 et P3.
- **O3 — un contrôle unique « prêt à lancer » joué à la MEP.** Un script qui joue sur la préproduction `robots.txt`, le plan du site, le favicon en fichier, les balises `og:`, les en-têtes et la 404, ajouté comme contrôle M-19 de `ETAPE-MEP.md`.
  - Coût : moyen × moyen. Un script, ses fixtures rouge et verte, une ligne à l'oracle MEP, et la doctrine de l'étape à modifier.
  - Exclut : les éléments légaux, qu'un script ne juge pas ; sur les 5 absences, il n'atteint que l'aperçu de partage. Rattachée à P1, P2 et P5.
- **O4 — avancer les audits existants avant la MEP.** Armer `websec_bloquant` par défaut et jouer avant le lancement les nœuds 31, 32, 33, 34 et 50 de forge-seo-geo, aujourd'hui sur mandat et après la MEP.
  - Coût : moyen × moyen. Aucun contrôle neuf, mais deux décisions de doctrine (R-33 bis et le périmètre de forge-seo-geo, `CLAUDE.md` l.7) qui reviennent à l'humain.
  - Exclut : les 5 éléments absents, car ces audits ne les portent pas : elle n'en atteint aucun. Rattachée à P1, P2 et P5.

## 5. Verdict

- **Option retenue** : O2.
- **Pourquoi O2** : c'est la seule option qui traite 4 des 5 absences, dont 3 relèvent du droit, par le mécanisme que la loi n° 3 prévoit déjà (`CLAUDE.md` l.28-29) et que la règle S4 juge. Elle corrige un défaut mesuré sur disque et une incohérence probable. **Pourquoi pas O1** : elle ignore l'existant et s'appuie sur une liste inconnue. **Pourquoi pas O3 et O4** : elles renforcent des éléments déjà « en partie » couverts, mais l'une n'atteint qu'une absence et l'autre aucune ; elles peuvent se décider plus tard, sur un incident.
- **Coût** : simple × court. Tokens : modeste, une table et un jeu de fixtures. Dette : la liste close passe de 13 à 16 clés, versionnée avec la table de `typologie-surface.md` et celle de `oracle-surface.mjs`, qui doivent rester jumelles.
- **Candidature(s) émise(s)** : candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 3, preuve 3, effort 2. Gain 3 : 3 exigences légales ou de partage deviennent opposables à chaque produit web. Preuve 3 : sources primaires datées, 1 défaut mesuré et 1 incohérence probable, mais aucun incident au registre sur les 5 absences. Effort 2 : 3 dépôts touchés.
- **Plan de revue** : 2026-11-30, ou au premier produit à surface web ouvert avec la nouvelle liste si c'est plus tôt. Critères écrits d'avance : nombre de candidats retenus par rapport aux écartés sur ce produit ; nombre d'écarts rédigés qui tiennent (motif de 20 caractères au moins, règle S4) ; présence de l'adresse complète dans le `robots.txt` copié. Si les 3 candidats sont tous écartés sur 3 produits, ils sortent de la liste.
- **Test rétro** :
  - *Opérationnel vers tactique* : les 3 candidats répondent aux 4 lignes « ne recouvre pas » du consentement, de la confidentialité, de la mesure d'audience et de l'aperçu de partage ; la correction du `robots.txt` répond à la ligne de P1 mesurée (7 fichiers sur 11) ; la règle du favicon répond à la ligne de P1 sur [G2]. Les icônes tactiles ne sont pas reprises : [G2] les accepte comme balise de favicon, mais l'effet n'est pas mesuré ; la rupture est justifiée par ce retrait.
  - *Tactique vers stratégie* : faire de la liste fermée de la loi n° 3 l'unique porte de l'oubli, plutôt que de lui ajouter une seconde check-list qui se périmerait seule.
  - *Stratégie vers intention* : vous vouliez décider de ce que la Factory fait de cette opportunité, sur des faits. La réponse est un objet durable modeste, ni un essai ni rien : 24 éléments comparés, 5 absents, 1 défaut mesuré et 1 incohérence probable.
  - *Questions du demandeur rejouées* : « cette vidéo est-elle pertinente pour la Factory ? » — oui en partie, 7 éléments sur 24 sont déjà couverts et la liste de la vidéo reste inconnue. « Quelle suite proposer ? » — O2. « Sur quels faits ? » — sections 2 et 3, chaque ligne citée.
- **Hypothèses non résolues** :
  - La liste des 20 éléments de la vidéo est inconnue ; aucune vidéo n'a été visionnée.
  - Que Google refuse un favicon en `data:` est une inférence : [G2] exige un fichier explorable et ne cite pas ce cas.
  - Les bases légales (mentions légales, confidentialité) n'ont pas été lues à Légifrance : la page demandée a répondu 404, et les relais secondaires se contredisent sur les numéros d'article. Seul le consentement est sourcé, par la CNIL.
  - La fiche OWASP « HTTP Headers Cheat Sheet » ne porte aucune date et n'est pas comptée parmi les sources.
  - `CLAUDE.md` place forge-websec « sur mandat humain », alors que `ETAPES-RUN.md` l.371-373 la joue au gate MEP en mode non bloquant ; cette étude suit `ETAPES-RUN.md`.
