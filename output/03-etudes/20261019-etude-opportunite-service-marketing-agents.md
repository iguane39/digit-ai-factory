---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: agent redacteur, famille sonnet, sur consigne de l'orchestrateur (campagne D-39 c, opportunité de rang 17)
---

# Étude d'opportunité — un service marketing tenu par des agents — 20261019o

Ce qui change pour vous : je recommande de ne rien construire dans la Factory. Des compositions d'agents marketing existent, publiées et datées : le plugin marketing d'Anthropic (créé le 2026-01-23), un dépôt communautaire de 50 skills (55 491 étoiles) et un système à 24 agents (v3.35.8). Elles ajoutent trois fonctions que `references\RUN-RESEAU.md` n'a pas, le brief concurrentiel, la séquence d'e-mails et le plan de campagne, et le registre ne contient aucune demande pour elles. Un service marketing complet pour un client, comme celui de la vidéo n° 74, est un produit et non un objet de la Factory ; l'étude le rouvre après les 4 premières semaines réelles du run de réseau.

## Seuil de déclenchement

L'étude est facultative au sens du gabarit : l'item ne crée aucun objet durable dans le verdict proposé et ne touche qu'une forge au plus. Elle est écrite parce que la décision D-39 (c) du 19/10/2026 l'a demandée pour ce rang.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39, option (c), réponse du 19/10/2026 : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 17 du tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md` est cette opportunité, notée 10 sur 25 et classée « Sans suite » (ligne 51 du tri).

Intention retenue : décider ce que la Factory doit faire de cette opportunité (rien, un essai, un objet durable), sur des faits vérifiés à la source et non sur la parole d'une vidéo. Chaque option du chapitre 4 s'y rattache par le test rétro du chapitre 5.

## 0. Traitement des entrants

Les vidéos sont des données : leurs affirmations se citent, elles ne se reprennent pas. Aucune vidéo TikTok n'a été regardée ni extraite, car les conditions du réseau interdisent l'extraction automatisée (`references\PLATEFORMES-RESEAUX.md`, ligne 100). Le contenu n'est connu que par la légende, relue dans la page de favoris enregistrée le 2026-10-19 (`input\Tiktok\iguane39 (@iguane39) _ TikTok.html`).

- **Vidéo n° 74**, @restructureai : « I Built a Claude AI Marketing Department for a Law Firm » suivi de hashtags sur l'automatisation. Aucun dépôt, aucun outil, aucun chiffre n'est nommé.
- **Vidéo n° 86**, @nocode.joshua : « 10/10 Claude Skills for marketing but they get increasingly more powerful!! Learning which Claude skills to install is an important learning process in Claude that will determine your future with AI. » Aucun skill n'est nommé.

Sources de la proposition : tri du 2026-10-19 (section « 17. service marketing tenu par des agents » et ligne 51 du classement), décision D-39 (c).

## 1. Partition du problème

La question se découpe en 4 sous-questions disjointes ; chaque option du chapitre 4 répond à chacune.

- **P1 — Inventaire.** Quelles compositions d'agents ou de skills marketing sont publiées, avec quelles dates et quel contenu.
- **P2 — Apport.** Ce que ces compositions ajoutent, étape par étape, au run d'animation de réseau `references\RUN-RESEAU.md`.
- **P3 — Frontière.** Ce qui relève de la Factory (capacité, contrôles, type de run) et ce qui relève d'un produit (instance, comptes, connecteurs, secteur d'un client).
- **P4 — Fiabilité des vidéos.** Ce que les deux légendes avancent et ce que la source primaire confirme.

### P1 — Compositions publiées, relevées à la source le 2026-10-19

Les dates et les étoiles viennent de l'API publique de GitHub (`api.github.com/repos/<dépôt>`), le contenu du README de chaque dépôt. Les étoiles mesurent la popularité, pas la qualité. Les pages ont été lues par résumé automatique, pas mot à mot.

| Composition | Créée / dernier push | Contenu relevé | Agents ? |
|---|---|---|---|
| `anthropics/knowledge-work-plugins`, plugin `marketing` (Apache-2.0, 30 412 étoiles pour le dépôt) | 2026-01-23 / 2026-10-19 | 7 commandes (`/draft-content`, `/campaign-plan`, `/brand-review`, `/competitive-brief`, `/performance-report`, `/seo-audit`, `/email-sequence`), 5 skills, 10 connecteurs (Slack, Canva, Figma, HubSpot, Amplitude, Notion, Ahrefs, Similarweb, Klaviyo, Supermetrics) | aucun sous-agent défini dans le README du plugin |
| `coreyhaines31/marketingskills` (MIT, 55 491 étoiles) | 2026-01-15 / 2026-10-15 | 50 skills ; `product-marketing` sert de socle, chaque autre skill le lit d'abord ; `marketing-council` joue 12 conseillers célèbres | non : un seul agent joue plusieurs personnages en séquence |
| `zubair-trabzada/ai-marketing-claude` (MIT, 2 770 étoiles) | 2026-03-02 / 2026-03-02 | 15 skills selon la description du dépôt, 14 fichiers selon son README ; 5 sous-agents lancés en parallèle pour un audit noté sur 100 ; rapports Markdown et PDF | oui : 5 sous-agents ; le README ne parle d'aucune relecture humaine |
| `indranilbanerjee/digital-marketing-pro` (MIT, 895 étoiles) | 2026-02-11 / 2026-10-11 | README : v3.35.8 du 2026-10-12, 164 skills, 24 agents (Marketing Strategist, Brand Guardian, Content Creator, Social Media Manager, SEO Specialist, Quality Assurance, Media Buyer…), 95 scripts Python, 700 tests | oui : 24 rôles ; envoi, publication et dépense exigent un « yes » tapé |
| `brainbytes-dev/everything-claude-marketing` (MIT, 7 étoiles) | 2026-03-14 / 2026-03-14 | description : 18 agents, 72 skills, 22 commandes | oui, mais un seul jour d'activité et 7 étoiles : preuve faible |

Anthropic a annoncé les plugins de Cowork le 2026-01-30 (« Customize Cowork with plugins »). Un plugin y regroupe « skills, connectors, slash commands, and sub-agents ». Le plugin marketing y figure parmi 11 plugins ouverts.

### P2 — Apport par étape de RUN-RESEAU

| Étape du run (`references\RUN-RESEAU.md`) | Offre des compositions | Apport net |
|---|---|---|
| N0 ouvrir : fiche émetteur, objectifs, personas, ligne éditoriale | skill `product-marketing` de marketingskills ; réglage de la voix de l'Anthropic plugin | nul : `emetteur.json` et `voix.json` existent, avec gate humain |
| N1 planifier | `/campaign-plan` : objectifs, canaux, calendrier, budget | faible : le calendrier à 4 semaines existe (RR1) ; le budget publicitaire est exclu (R-29) |
| N2 produire et juger | `/draft-content` : billet de blog, newsletter, page d'atterrissage, communiqué, étude de cas ; `/brand-review` | partiel : 4 formats hors réseaux manquent aux 5 modèles de publication ; la voix est déjà jugée par calcul (RR8) |
| N3 accorder et programmer | le README de l'Anthropic plugin ne dit rien d'un accord humain ; digital-marketing-pro exige un « yes » | nul, voire négatif : les packs qui publient eux-mêmes contredisent R-38 et le contrat de LinkedIn |
| N4 animer : réponses et avis | `Social Media Manager` de digital-marketing-pro | nul : réponses et avis restent des gestes humains |
| N5 mesurer | `/performance-report` par connecteurs Amplitude, Supermetrics, HubSpot | nul : LinkedIn et TikTok n'ont pas d'interface gratuite de chiffres, l'humain exporte |
| N6 revoir | aucune fonction équivalente relevée | nul |
| Hors du run | `/competitive-brief`, `/email-sequence`, `/seo-audit` | brief concurrentiel et e-mails : nouveaux, sans demande au registre ; audit SEO : déjà couvert par `digit-ai-forge-seo-geo` |

### P3 — Qui porte quoi

`references\RUN-RESEAU.md` (lignes 44 à 47) pose déjà la frontière : le run vit chez le produit qui porte l'instance de l'émetteur, et la capacité (skills, barres, oracles) vient des forges. Appliquée aux compositions :

- Relèvent de la Factory : les modèles de sortie et leurs contrôles exécutés, le critère « mérite un agent », la règle d'accord par lot.
- Relèvent d'un produit : les connecteurs vers des comptes (HubSpot, Klaviyo, Ahrefs), les rapports remis à un client, le ton et le secteur d'un client précis, la règle d'un barreau ou d'un autre ordre professionnel, les comptes et leurs rôles.

### P4 — Affirmations des légendes, vérifiées

| Affirmation de la légende | Verdict | Source |
|---|---|---|
| n° 74 : un service marketing tenu par des agents Claude existe pour un cabinet d'avocats | **invérifiable** : la légende ne nomme ni outil ni dépôt, et l'étude ne regarde pas la vidéo | légende, page de favoris du 2026-10-19 |
| n° 74 : un « département » marketing se compose avec Claude | **vraie en principe** : un plugin regroupe skills, connecteurs, commandes et sous-agents, et `digital-marketing-pro` en publie 24 | claude.com/blog/cowork-plugins, 2026-01-30 ; README du dépôt, v3.35.8 |
| n° 86 : il existe 10 skills Claude pour le marketing, de plus en plus puissants | **invérifiable** : aucun nom, et « puissant » n'a pas de mesure ; des centaines de skills marketing existent en revanche (50 dans un seul dépôt) | légende ; `github.com/coreyhaines31/marketingskills`, consulté le 2026-10-19 |
| n° 86 : savoir quels skills installer « déterminera votre avenir avec l'IA » | **invérifiable** : opinion, sans fait à confronter | légende |

### Limites et hypothèses non résolues

- Hypothèse 1 : le fonctionnement réel des 5 compositions n'a pas été exécuté ; aucune installation n'est permise à cette étude. Les contenus viennent des README et des descriptions de dépôt.
- Hypothèse 2 : aucun des dépôts lus ne publie une mesure de résultat marketing (leads, trafic, coût). La lecture par résumé n'exclut pas qu'une page de détail en contienne une.
- Hypothèse 3 : le secteur d'un cabinet d'avocats impose des règles de publicité propres à son ordre professionnel. Elles n'ont pas été instruites, faute de demande.
- Hypothèse 4 : le dernier push de `digital-marketing-pro` relevé par l'API (2026-10-11) précède de un jour la date de version que son README affiche (2026-10-12) ; l'écart n'est pas expliqué.

## 2. Non-recouvrement contre l'existant

Lecture seule de `C:\dev\digit-ai-factory`, de ses forges et des skills installés sous `C:\Users\iguan\.claude\skills\`. Chaque ligne porte sa citation.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Boucle hebdomadaire d'animation de réseau (planifier, produire, accorder, animer, mesurer, revoir) | `references\RUN-RESEAU.md`, « La séquence », lignes 49 à 108, étapes N0 à N6 | recouvre : les fonctions de `/campaign-plan`, `/draft-content` et `/performance-report` y ont leur équivalent |
| Accord humain par lot hebdomadaire, programmation dans l'outil de la plateforme | `references\RUN-RESEAU.md`, lignes 26 à 36 ; `references\PLATEFORMES-RESEAUX.md`, tableau « Vue d'ensemble », lignes 40 à 50 | recouvre, et s'oppose aux packs qui publient eux-mêmes (`/execute-action` de digital-marketing-pro) |
| Contrôles exécutés avant remise | `oracles\oracle-run-reseau.mjs`, lignes 31 à 44, règles RR1 à RR8 ; `references\RUN-RESEAU.md`, lignes 137 à 151 | recouvre : faits sourcés, transparence, accord, mesure, voix |
| Modèles de publication et contrats de sortie | `~\.claude\skills\digit-ai-communication\references\presets-livrables.md`, lignes 24 à 68 ; `contrats-publication.json` (5 modèles) | recouvre pour les réseaux ; ne recouvre pas le billet de blog, la newsletter, le communiqué ni l'étude de cas de `/draft-content` |
| Règles de voix de l'émetteur | `gabarits\VOIX-EMETTEUR.json`, ligne 6 ; `oracles\oracle-run-reseau.mjs`, ligne 44 (RR8) | recouvre `/brand-review` et le skill `brand-voice`, avec un calcul là où le plugin lit |
| Skill de rédaction de posts LinkedIn | `~\.claude\skills\synced\43c87242-3a52-4c70-9975-2862c2cc2848_08d81279-f396-431e-823f-4fb533b87824\linkedin-post-generator\SKILL.md`, lignes 2 à 9 | recouvre la rédaction de posts ; constat en passant : `references\algorithme-best-practices.md` ligne 9 écrit « 70% de la portée totale » en une heure sans source, quand `references\RUN-RESEAU.md` lignes 37 à 39 refuse toute règle d'algorithme sans source primaire datée |
| Audit SEO et GEO d'un site | `C:\dev\digit-ai-forge-seo-geo\README.md`, ligne 10 (grille de 88 nœuds) et ligne 30 (« mandat humain requis ») | recouvre `/seo-audit` et les skills SEO de marketingskills |
| Critère « mérite un agent » | `~\.claude\skills\forge-agents\SKILL.md`, lignes 52 à 60 | ne recouvre pas les rôles des packs : un rôle sans outils distincts, sans arbitre distinct et sans parallélisme ne devient pas un agent |
| Flotte d'agents du pilot | `.claude\agents\` : `campagne.md`, `constructeur.md`, `explorateur.md`, `redacteur.md`, `verificateur.md` ; `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, ligne 76 (12 % d'appels vers un agent nommé, cible 90 %) | ne recouvre aucun rôle marketing ; la flotte actuelle est sous-employée, ce qui va contre l'ajout de rôles |
| Prospection par e-mail | `C:\dev\digit-ai-prospection\CLAUDE.md`, section « Finalité », lignes 5 à 9 | recouvre `/email-sequence` : l'e-mail de prospection a déjà un produit |
| Demande de marketing au registre | `todo\TODO.jsonl` : recherche des mots marketing, newsletter, e-mail et concurrent dans les titres de création, 6 résultats (TF-0794, TF-1108, TF-1367, TF-1575, TF-1837, TF-1878), aucun sur le marketing | ne recouvre pas : aucune demande de brief concurrentiel, de séquence d'e-mails ni de plan de campagne |
| Premier cas réel du run de réseau | `todo\TODO.jsonl`, ligne 4661 (TF-1160, décision du 2026-10-17, attente d'un geste humain) ; `output\03-publications\README.md` du produit de communication, « dossier vide » au 2026-10-19 | recouvre le besoin d'un essai réel avant tout ajout : le run a été prouvé à blanc seulement (`references\RUN-RESEAU.md`, lignes 153 à 162) |

## 3. État de l'art daté

Neuf sources, toutes consultées le 2026-10-19 ; les quatre premières sont celles d'Anthropic, les quatre suivantes les dépôts eux-mêmes, la dernière le référentiel du pilot.

- **« Customize Cowork with plugins », Anthropic**, 2026-01-30, `https://claude.com/blog/cowork-plugins` : un plugin regroupe « skills, connectors, slash commands, and sub-agents » ; le plugin marketing figure parmi 11 plugins ouverts.
- **Dépôt `anthropics/knowledge-work-plugins`**, créé le 2026-01-23, dernier push le 2026-10-19, `https://github.com/anthropics/knowledge-work-plugins` et `.../tree/main/marketing` : 7 commandes, 5 skills, 10 connecteurs, aucun sous-agent défini, licence Apache-2.0.
- **« Introducing Agent Skills », Anthropic**, 2025-10-16 (mise à jour du 2025-12-18), `https://claude.com/blog/skills` : un skill est un dossier d'instructions, de scripts et de ressources que Claude charge au besoin ; le format est publié comme standard ouvert.
- **Anthropic, documentation Claude Code « Subagents »**, page sans date affichée, consultée le 2026-10-19, `https://code.claude.com/docs/en/sub-agents` : chaque sous-agent a sa fenêtre de contexte, ses outils et ses permissions ; la conversation principale reste préférable quand les phases partagent beaucoup de contexte.
- **Corey Haines, `coreyhaines31/marketingskills`**, créé le 2026-01-15, dernier push le 2026-10-15, `https://github.com/coreyhaines31/marketingskills` : 50 skills, MIT, 55 491 étoiles.
- **Z. Trabzada, `zubair-trabzada/ai-marketing-claude`**, 2026-03-02, `https://github.com/zubair-trabzada/ai-marketing-claude` : 5 sous-agents parallèles pour un audit noté sur 100.
- **I. Banerjee, `indranilbanerjee/digital-marketing-pro`**, créé le 2026-02-11, version 3.35.8 du 2026-10-12, `https://github.com/indranilbanerjee/digital-marketing-pro` : 24 agents, accord « yes » avant envoi, publication ou dépense, limite avouée par l'auteur (« cannot prove who typed yes »).
- **brainbytes-dev, `everything-claude-marketing`**, 2026-03-14, `https://github.com/brainbytes-dev/everything-claude-marketing` : 18 agents annoncés, 7 étoiles.
- **Référentiel interne des plateformes**, vérifié le 2026-09-21, périmé le 2026-12-02, `references\PLATEFORMES-RESEAUX.md` : la publication hors interface officielle est interdite ou encadrée sur les 9 réseaux.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Retenue.
  - Coût du statu quo : 3 fonctions absentes du run de réseau (brief concurrentiel, séquence d'e-mails, plan de campagne), sans demande au registre ; le brief et l'e-mail ne sont pas bloquants pour un run qui n'a pas encore eu son premier cas réel (TF-1160).
  - Ce qu'elle exclut : rien. Elle garde la place d'un essai réel avant tout ajout.
- **O1 — installer un pack tiers dans la session du produit de communication** (plugin marketing d'Anthropic ou `digital-marketing-pro`).
  - Coût : moyen × court.
  - Exclut : l'accord par lot de la règle 38 (le pack d'un auteur tiers peut publier), les contrôles RR3 à RR8, et la règle R-29 ; ses connecteurs (HubSpot, Klaviyo, Ahrefs) sont des outils tiers payants. L'installation est aussi interdite à cette étude.
- **O2 — extraire les seuls modèles manquants** (brief concurrentiel, séquence d'e-mails, billet de blog) dans `digit-ai-communication`, par la voie du précédent taste-skill du 14/08 : règles compatibles seulement, contrat de sortie binaire, contrôle par RR2.
  - Coût : moyen × moyen. Objet durable (3 modèles et leur contrat).
  - Exclut : les connecteurs et les agents. Elle ne se justifie qu'une fois une demande inscrite.
- **O3 — composer une équipe d'agents marketing dans la flotte de la Factory** (stratège, rédacteur de contenu, gardien de marque, analyste SEO).
  - Coût : complexe × long. Objet durable : 4 définitions d'agents et leur arbitre.
  - Exclut : le critère « mérite un agent » (aucun rôle n'a des outils distincts de `redacteur`), et la flotte actuelle est employée à 12 % de la cible.
- **O4 — traiter le service marketing comme un produit pour un client**, par exemple un cabinet : un dépôt produit, un run de réseau paramétré par son secteur, ses comptes, ses connecteurs.
  - Coût : très complexe × très long. Décision humaine : dépense, secteur réglementé, client.
  - Exclut : la Factory comme hôte. Elle n'apporte que sa capacité (`references\RUN-RESEAU.md`, lignes 44 à 47).

## 5. Verdict

- **Option retenue** : O0.
- **Pourquoi pas O1 à O4** : O1 contredit l'accord humain par lot et la règle de dépense. O2 répond à une demande qui n'existe pas au registre. O3 viole le critère « mérite un agent ». O4 est une décision commerciale qui ne vient pas de cette vidéo.
- **Ce qui relève d'un produit plutôt que de la Factory** : tout ce qui a des comptes, des connecteurs payants, un client nommé ou un secteur réglementé, soit les cas de la vidéo n° 74 et les connecteurs du plugin d'Anthropic. Ce qui reste à la Factory est déjà en place : modèles de sortie, contrôles exécutés, accord par lot.
- **Coût** : simple × court. Aucune production ; un relevé de 2 lignes à la revue. Tokens : nul.
- **Candidature(s) émise(s)** :
  - Candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 3, effort 1. Objet : « Rouvrir l'étude du service marketing par agents après la clôture des 4 semaines réelles du run de réseau (TF-1160), sur trois critères : minutes humaines passées en brief concurrentiel, en e-mails et en billets ; demande d'un client nommé ; mesure de résultat publiée par au moins une composition ».
  - Candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 4, effort 1. Objet : constat en passant, hypothèse à confirmer par le porteur : le skill installé `linkedin-post-generator` porte des règles d'algorithme sans source (`references\algorithme-best-practices.md`) que `references\RUN-RESEAU.md` refuse dans un skill ; à aligner ou à cadrer comme hors Factory.
- **Plan de revue** : 2026-11-30, ou à la clôture des 4 semaines réelles de TF-1160 si elle est plus tardive. Critères écrits d'avance : minutes humaines hebdomadaires par fonction ; au moins une demande de client inscrite au registre ; au moins une composition qui publie une mesure de résultat. Si aucun des trois n'est atteint, O0 est reconduite. Le référentiel des plateformes se relit aussi à cette date (péremption 2026-12-02).
- **Test rétro** :
  - *Opération → Tactique* : ne rien installer ni construire répond à P2 (apport net nul ou faible sur 6 étapes sur 8) et à P3 (la frontière de RUN-RESEAU place l'instance chez le produit).
  - *Tactique → Stratégie* : décider sur des faits relevés à la source, pas sur une légende ; garder l'accord humain par lot et la règle de dépense intacts.
  - *Stratégie → Intention* : vous vouliez savoir ce que la Factory doit faire de cette opportunité. La réponse est rien pour l'instant, avec trois critères de réouverture datés.
  - *Questions du demandeur rejouées* : « pertinente pour la Factory ? » — peu, 10 sur 25 au tri, confirmé par le non-recouvrement. « Notée et triée ? » — le rang 17 reste justifié. « Quelle étude poussée lancer ? » — aucune, sauf réouverture sur les trois critères.
  - *Rupture constatée* : le contenu des vidéos n'a pas été vu, donc les deux affirmations des légendes restent invérifiables ; elle est déclarée, pas comblée.
