---
profil: chatbot
version: 1.1.0
challenge_date: 2026-08-12
sources:
  - "Meta for Developers — fenêtre de service WhatsApp (24 h depuis le dernier message entrant), catégories de template Marketing/Utility/Authentication ; bascule tarifaire annoncée pour 2026 (Utility et messages de service facturés dans la fenêtre 24 h à partir du 01/10/2026, nouvelle catégorie « Meta Business AI Agent » facturée au jeton dès le 01/08/2026 — Blueticks, Wati, Qiscus, ActiveCampaign, convergents, 2026)"
  - "Slack Developer Docs — Events API : accusé HTTP 200 exigé sous 3 s, sinon nouvelle tentative à +1 min puis +5 min (en-tête x-slack-retry-num) — docs.slack.dev/apis/events-api"
  - "Slack Developer Docs — Verifying requests from Slack : signature HMAC-SHA256 du corps brut + secret partagé, en-tête X-Slack-Signature — docs.slack.dev/authentication/verifying-requests-from-slack"
  - "OWASP Top 10 for LLM Applications, édition 2025 — LLM01 Prompt Injection en tête pour la 2e édition consécutive ; document v4.2.0a daté 14/11/2024 — owasp.org/www-project-top-10-for-large-language-model-applications"
  - "Microsoft Learn — Rate limiting for agents (Teams) : HTTP 429 Too Many Requests, backoff exigé, valeurs non contractuelles — learn.microsoft.com/microsoftteams/platform/bots/how-to/rate-limit"
  - "Meta Graph API — garantie de disponibilité de 2 ans par version ; v19.0 dépréciée 02/2025, v20.0 dépréciée 05/2025 (sources croisées Ayrshare/Singhamandeep, 2026) ; API On-Premises WhatsApp retirée 10/2025, seule la Cloud API reste supportée"
  - "CNIL — recommandations sur le développement des systèmes d'IA, intégrant le règlement européen IA adopté été 2024 ; approche sectorielle en construction (cnil.fr, consulté 12/08/2026)"
  - "forge-agents — cat-agt-05 Oracle agent-evals, TF-0106 (12/08/2026) : fixtures double sens au self-test, juge distinct de l'exécutant — catalogues\\CATALOGUES.md"
  - "étude d'opportunité forges — output\\03-etudes\\20260812-etude-opportunite-forges.md (12/08/2026), §5"
  - "TF-0236 — qualité graphique par défaut : étude output\\03-etudes\\20260815-etude-opportunite-qualite-graphique.md (15/08/2026)"
---

# Profil produit — chatbot / agent conversationnel

Référentiel versionné (pas une forge — R-28, `REGLES-PROJET.md` §H) pour tout produit dont
l'interface principale est un agent conversationnel exposé sur un ou plusieurs canaux
(WhatsApp Business, Slack, Microsoft Teams, webchat propriétaire). Dernier candidat de la
liste d'attente des profils (étude §5, 12/08/2026), inséré sur mandat humain direct du
12/08 (nuit) — `profils\LISEZMOI.md` passe à 8 profils actifs, liste d'attente vide.

## Frontière R-28 (section obligatoire)

**L'évaluation de la qualité conversationnelle — pertinence, ton, dérive sémantique dans le
temps — est un verbe nouveau qu'aucune forge de l'écosystème n'outille aujourd'hui.** Ce
n'est ni un webhook mal câblé ni un test mécanique manquant : c'est un jugement qualitatif
sur un échange réel (canal, contexte utilisateur, historique, bruit du monde) que ni les
pans standard de `tests` ni aucune forge existante ne couvrent bout en bout.

**`oracle-agent-evals` (forge-agents, cat-agt-05) est la brique la plus proche, pas la
réponse.** Il détecte une régression sémantique d'un agent entre deux versions sur un jeu
de fixtures versionné, jugé par un LLM-juge distinct de l'exécutant (TF-0106, self-test à
fixtures double sens). Trois écarts le séparent d'une évaluation conversationnelle en
production : (1) il compare deux versions d'un agent, pas une conversation qui dérive en
continu sur un canal réel ; (2) il joue des fixtures préparées, pas le bruit d'un canal
réel (latence, retries, formats imposés par WhatsApp/Slack/Teams) ; (3) il ne mesure pas le
ton perçu par un humain ni une dérive lente sur des mois d'échanges.

**Ce profil documente les standards de canal et de sécurité, il n'outille pas le verbe
d'évaluation conversationnelle.** Un premier brief chatbot réel déclenche l'instruction
forge-vs-extension au sens R-28 : soit une extension de `forge-agents` (si
`oracle-agent-evals` peut s'étendre au canal réel sans porter de cadence ou de mandat
propres), soit une forge dédiée si les 4 critères R-28 sont réunis (≥ 2 verbes outillés non
recouverts avec verdict de non-recouvrement écrit, v0 exercée sur un produit réel, cadence
propre, intégration écosystème livrée le jour même) — jamais anticipé sans produit à
exercer, même précédent que `profils\mobile.md` et `profils\desktop.md`.

## 1. Standards vérifiables machine

| Norme / métrique | Seuil | Oracle gratuit qui juge |
|---|---|---|
| Fenêtre de service WhatsApp Business (Meta Cloud API) | 24 h depuis le dernier message entrant du client ; hors fenêtre, seul un template pré-approuvé (Marketing/Utility/Authentication) peut initier l'échange | aucun oracle gratuit packagé identifié — vérifiable par test d'intégration comparant l'horodatage du dernier message entrant à l'horodatage d'envoi |
| Accusé Slack Events API | réponse HTTP 200 sous 3 s à chaque event reçu ; au-delà Slack retente à +1 min puis +5 min (en-tête `x-slack-retry-num`, raison en `x-slack-retry-reason`) | test d'intégration mesurant la latence de l'endpoint (assertion < 3 s) — pas d'oracle CI packagé dans l'écosystème |
| Signature de webhook entrant (Slack `X-Slack-Signature`, Meta `X-Hub-Signature-256`) | HMAC-SHA256 calculé sur le corps brut avec le secret partagé, comparaison à temps constant, rejet 401/403 si invalide, corps jamais parsé avant vérification | test unitaire signature connue/attendue (`crypto.timingSafeEqual` ou équivalent) — vérifiable machine sans service tiers |
| OWASP LLM01:2025 — injection de prompt | résistance mesurée à un corpus versionné de payloads d'injection (direct et indirect via contenu récupéré/RAG) | aucun oracle gratuit générique — `oracle-agent-evals` (forge-agents) est la brique la plus proche pour rejouer un corpus versionné, insuffisante seule (cf. Frontière R-28) |
| Rate limiting Microsoft Teams Bot Framework | backoff sur HTTP 429 Too Many Requests ; conversation reference stockée plutôt que recréée à chaque envoi proactif | test d'intégration simulant un 429 et vérifiant le backoff — pas d'oracle packagé |
| Traçabilité RGPD conversationnelle | base légale déclarée par cas d'usage (contrat, obligation légale, intérêt légitime ou consentement selon le contexte), durée de conservation bornée et affichée, droits des personnes exerçables | audit manuel — aucun oracle gratuit de conformité RGPD identifié (même écart constaté dans `profils\e-commerce.md`) |
| Direction artistique dérivée (loi n° 6) | `tokens.css` + `DESIGN.md` motivés par l'expérience client visée (`systeme-de-marque`), dérivation consignée — jamais un template | revue 5 bis (`critique-le-design`) sur la consignation ; gate étape 3 d'`ETAPES-RUN.md` |
| Généricité du rendu (loi n° 6) | zéro règle dure déclenchée — l'interface ne trahit pas un rendu par défaut | `oracle-taste.mjs` (forge-design, `cat-des-09`) |
| Régression visuelle (loi n° 6) | baseline approuvée à l'étape 3, jugée à toute évolution et en 5 bis | `oracle-baseline.mjs` (forge-design, `cat-des-08`) |

## 2. Savoir périssable daté-sourcé

| Pratique | Source datée | Pourquoi ça périme |
|---|---|---|
| Tarification WhatsApp Business Cloud API | bascule annoncée pour 2026 : Utility/service facturés dans la fenêtre 24 h dès le 01/10/2026, catégorie « Meta Business AI Agent » facturée au jeton dès le 01/08/2026 | un devis ou une architecture de coûts figée sur la gratuité actuelle des messages de service casse à ces deux échéances — à revérifier avant tout premier build facturé |
| Versions Graph API (WhatsApp Cloud API) | garantie de 2 ans par version ; v19.0 dépréciée 02/2025, v20.0 dépréciée 05/2025 ; API On-Premises retirée 10/2025 (seule la Cloud API reste supportée) | un intégrateur pointant une version non maintenue bascule silencieusement vers une version antérieure puis casse à l'expiration — la version cible se revérifie à chaque challenge de ce profil |
| Retry Slack Events API | 3 tentatives sur quelques minutes (immédiat, +1 min, +5 min), option « Delayed Events » pour des retries horaires sur 24 h supplémentaires | un handler qui ignore `x-slack-retry-num` traite le même événement plusieurs fois (doublons) — pattern à corriger avant tout premier déploiement, pas après incident |
| OWASP Top 10 for LLM Applications | édition « 2025 », document daté 14/11/2024 ; LLM01 Prompt Injection en tête pour la 2e édition consécutive | une prochaine édition peut réordonner ou fusionner des catégories (comme LLM09 Misinformation, issue de l'ancienne « hallucination ») — le mapping garde-fou/catégorie est à rejouer à chaque challenge |
| Recommandations CNIL sur les systèmes d'IA | intègrent le règlement européen IA adopté été 2024 ; approche sectorielle encore en construction (consulté 12/08/2026) | les recommandations spécifiques aux agents conversationnels ne sont pas stabilisées — une durée de conservation ou une base légale documentée aujourd'hui comme pratique de place (6-12 mois pour le service client, constat de plusieurs cabinets, non un seuil CNIL opposable) reste à revérifier au cas par cas, jamais affirmée comme conforme par défaut |

## 3. Mapping de consommation par forge

| Forge | Ce que le profil active |
|---|---|
| ACCUEIL | routage de l'intention : « chatbot / agent conversationnel » → charge ce profil, affiche explicitement la Frontière R-28 |
| conception | exigences conversationnelles types (intentions couvertes, périmètre du contexte, condition de bascule vers un humain, SLA de réponse par canal) actées dans `EXIGENCES.json` |
| development | intégration webhook/queue par canal (endpoint signé, accusé sous le délai du canal, traitement asynchrone déporté vers une file — jamais de traitement long dans le handler d'accusé) |
| tests | pans standard API (contrat webhook, codes de retour, rejeu idempotent des retries) + eval sets versionnés de non-régression de prompts, rejoués par `oracle-agent-evals` (forge-agents, cat-agt-05) cité comme brique existante la plus proche — pas suffisante seule pour la conversation en canal réel (Frontière R-28) |
| websec (12/08) | exposition du webhook : signature obligatoire avant tout parsing, surface publique minimale, rate limiting propre à l'écosystème indépendant de celui du canal |
| observability | volet pertinent mais partiel : la dérive technique (latence, taux d'erreur, volumétrie de tokens) entre deux snapshots est du ressort classique de l'observabilité ; la dérive sémantique de la qualité conversationnelle perçue reste hors périmètre outillé (Frontière R-28) |
| data | traçabilité RGPD des conversations : lineage de la donnée conversationnelle, durée de conservation bornée et purge effective, base légale documentée par cas d'usage |

