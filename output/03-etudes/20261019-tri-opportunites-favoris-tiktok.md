---
role: tri des favoris TikTok de l'humain en opportunités pour la Factory, avant le choix des études poussées
destinataire: humain
---

# Tri des favoris TikTok — opportunités pour la Factory — 20261019a

Sur vos 109 favoris, 51 vidéos touchent la Factory. Elles se regroupent en 18 opportunités, car plusieurs vidéos montrent le même outil ou la même idée. Les 4 premières dépassent le seuil de 19 sur 25 et méritent une étude poussée au gabarit `gabarits\ETUDE-OPPORTUNITE.md`. Je recommande d'écarter la 18e, parce qu'elle contourne une protection de site ; le choix final vous revient.

## Source et limites

La source est la page de vos favoris enregistrée le 19/10/2026 à 16:33, `input\Tiktok\iguane39 (@iguane39) _ TikTok.html`. Un script a relevé chaque lien de vidéo et sa légende, c'est-à-dire le texte que l'auteur affiche sous la vidéo.

Aucune vidéo n'a été regardée ni écoutée. Le poste n'a ni `yt-dlp` ni `ffmpeg` ni modèle de transcription, et les conditions de TikTok interdisent l'extraction automatisée (`references\PLATEFORMES-RESEAUX.md`, ligne 100). Chaque note repose donc sur la légende seule. Une légende courte donne une preuve faible, et la note le dit.

Les chiffres que les vidéos avancent, étoiles GitHub ou gains de jetons, sont ceux de leurs auteurs. Aucun n'a été vérifié.

## Grille de notation

Chaque opportunité reçoit 4 notes de 1 à 5. Le gain compte double, parce qu'il dit ce que la Factory y gagne ; le score va donc de 5 à 25.

| Critère | Mesure |
|---|---|
| Gain (× 2) | L'effet attendu sur la qualité, le coût ou la vitesse des runs, ou sur une offre d'une forge |
| Nouveauté | 5 si rien d'équivalent n'existe dans la Factory, 1 si l'équivalent est déjà en service ; l'existant est cité |
| Preuve | 5 si la vidéo nomme un outil ou une documentation vérifiable, 1 si la légende ne dit presque rien |
| Coût inverse | 5 pour une instruction simple et courte, 1 pour un chantier long et complexe |

Un score de 19 ou plus recommande une étude poussée. De 15 à 18, l'opportunité se tranche par une décision directe ou un essai court. Sous 15, elle reste au tri, sans suite proposée.

## Classement

| Rang | Opportunité | Vidéos | Gain | Nouv. | Preuve | Coût inv. | Score | Avis |
|---|---|---|---|---|---|---|---|---|
| 1 | Jeton d'abonnement pour les tâches sans écran | 1 | 4 | 4 | 4 | 5 | 21 | Étude poussée |
| 2 | Tactiques SEO et GEO récentes pour `digit-ai-forge-seo-geo` | 6 | 4 | 3 | 4 | 5 | 20 | Étude poussée |
| 3 | Packs d'agents et de skills tiers comparés à la flotte | 7 | 4 | 4 | 4 | 3 | 19 | Étude poussée |
| 4 | Skills de design tiers pour `digit-ai-forge-design` | 3 | 4 | 3 | 4 | 4 | 19 | Étude poussée |
| 5 | Économie de jetons : mettre graphify en service | 3 | 4 | 3 | 2 | 4 | 17 | Essai court |
| 6 | Sessions parallèles et paliers d'autonomie | 4 | 4 | 3 | 2 | 3 | 16 | Décision directe |
| 7 | Pilotage de l'ordinateur à distance | 1 | 3 | 4 | 3 | 3 | 16 | Décision directe |
| 8 | Vidéo de lancement générée par le code | 2 | 3 | 5 | 2 | 3 | 16 | Décision directe |
| 9 | Transcription des vidéos et des sons | 1 | 3 | 4 | 2 | 4 | 16 | Essai court |
| 10 | Animation et finition des interfaces | 11 | 3 | 3 | 3 | 3 | 15 | Décision directe |
| 11 | Check-list avant mise en ligne | 1 | 3 | 2 | 2 | 5 | 15 | Décision directe |
| 12 | Base de connaissance en wiki | 2 | 3 | 2 | 2 | 3 | 13 | Sans suite |
| 13 | Rétro-ingénierie par agents | 1 | 3 | 2 | 2 | 3 | 13 | Sans suite |
| 14 | Modèle local sans carte graphique | 1 | 1 | 5 | 4 | 2 | 13 | Sans suite |
| 15 | Diagramme d'un dépôt de code | 2 | 2 | 2 | 2 | 4 | 12 | Sans suite |
| 16 | Style d'écriture poli ou « humanisé » | 2 | 2 | 1 | 1 | 4 | 10 | Sans suite |
| 17 | Service marketing tenu par des agents | 2 | 2 | 2 | 1 | 3 | 10 | Sans suite |
| 18 | Extraction de sites qui contourne leurs protections | 1 | — | — | — | — | — | À écarter |

Les ex æquo se départagent par le gain, puis par la preuve.

## Études courtes

### 1. Jeton d'abonnement pour les tâches sans écran — 21

- **Vidéo** : n° 36, @pixelcrafted.raphael. Elle montre `claude setup-token`, qui crée un jeton rangé dans `CLAUDE_CODE_OAUTH_TOKEN`. Une tâche sans écran tourne alors sur l'abonnement Claude, sans clé d'API facturée à l'usage. L'auteur cite une facture de 27 000 euros évitée.
- **Existant** : `oracles\oracle-depense-voie-par-defaut.mjs` applique R-34, la règle qui exclut de la voie par défaut tout audit appelant un modèle payant. Son motif détecte `ANTHROPIC_API_KEY` (ligne 54). Le registre `todo\TODO.jsonl` ne cite ni `setup-token` ni `CLAUDE_CODE_OAUTH_TOKEN`.
- **Gain** : un audit ou une routine nocturne à modèle pourrait passer sans dépense nouvelle, donc sans arbitrage humain. La règle R-34 serait tenue, pas assouplie.
- **Question de l'étude poussée** : les conditions d'Anthropic admettent-elles cet usage pour des tâches planifiées, et quelles tâches de la Factory en profiteraient ?

### 2. Tactiques SEO et GEO récentes — 20

- **Vidéos** : n° 45 (badge « sources préférées » de Google, @build_in_public) ; n° 10 (filtre par expression régulière des requêtes de plus de 4 mots dans la Search Console) ; n° 35 (exploration de Google Trends par catégorie, @darrenshawseo) ; n° 94 (un skill de visibilité dans les réponses des IA, @louisbuildss) ; n° 23 et n° 29 (audits de présence dans ChatGPT et Gemini pour des commerces).
- **Existant** : `references\SEO-RECHERCHE.md` cite déjà la Search Console (ligne 18) et Google Trends (ligne 73). Le référentiel de `digit-ai-forge-seo-geo` ne contient pas le mot « preferred ».
- **Gain** : 3 gestes concrets et gratuits à ajouter à la méthode de la forge, dont le badge, qui touche AI Overviews et Discover selon la vidéo.
- **Question de l'étude poussée** : quels gestes la documentation de Google confirme-t-elle, et lesquels entrent dans la grille d'audit de la forge ?

### 3. Packs d'agents et de skills tiers — 19

- **Vidéos** : n° 59 (GStack, 23 outils publiés par le patron de Y Combinator) ; n° 69 (Everything Claude Code, 28 sous-agents et 119 skills) ; n° 18 (le déroulé de Matt Pocock et son dépôt `mattpocock/skills`) ; n° 92, n° 102, n° 101 et n° 71 (listes de skills et d'extensions).
- **Existant** : la Factory a sa propre flotte, dont `campagne`, `constructeur`, `redacteur` et `verificateur`, et les extensions superpowers et impeccable sont installées. Le registre ne cite aucun des 3 dépôts. Un précédent existe : l'étude du skill tiers taste-skill du 14/08 a extrait ses seules règles compatibles (`digit-ai-forge-design\oracles\regles-importees-taste-skill.md`).
- **Gain** : repérer les rôles ou les contrôles que ces packs ont et que la flotte n'a pas. Le relevé d'ouverture du 19/10 mesure 12 % d'appels vers un agent nommé, pour une cible de 90 %.
- **Question de l'étude poussée** : quels éléments de ces 3 dépôts manquent à la flotte, et lesquels s'importent sans contredire la doctrine ?

### 4. Skills de design tiers — 19

- **Vidéos** : n° 85 et n° 72 (@nocode.joshua : le skill d'animation d'Emil Kowalski, UI/UX Pro Max, les règles de design de Vercel, Brandkit, l'extraction d'un système de design depuis un site) ; n° 54 (3 étapes pour Claude en designer).
- **Existant** : les skills `impeccable`, `critique-le-design`, `ameliore-le-design` et `systeme-de-marque` sont installés. La loi n° 6 tient un rendu générique pour un défaut. Le précédent taste-skill s'applique ici aussi.
- **Gain** : des règles d'animation et d'audit à importer au socle de `digit-ai-forge-design`, selon la même voie que taste-skill.
- **Question de l'étude poussée** : quelles règles de ces 5 skills sont absentes du socle, et lesquelles un oracle peut-il vérifier ?

### 5. Économie de jetons : mettre graphify en service — 17

- **Vidéos** : n° 107 (graphify, qui dirait diviser la consommation par 70) ; n° 100 (un projet de réduction de jetons, non nommé) ; n° 93 (Fable qui planifie et délègue à Sonnet et Haiku).
- **Existant** : graphify est installé au poste (`~\.claude\skills\graphify`), mais aucun dépôt `digit-ai-*` ne porte de dossier `graphify-out`. Le skill `efficient-fable` couvre déjà la délégation de la n° 93.
- **Avis** : un essai court suffit. Construire le graphe du pilot, puis comparer les jetons d'une même question avec et sans lui.

### 6. Sessions parallèles et paliers d'autonomie — 16

- **Vidéos** : n° 25 (@steve8708, sur les fabriques logicielles autonomes) ; n° 87 (4 paliers, de l'agent assisté à une centaine d'agents) ; n° 28 (une fonction « Projects » de Claude Code qui découpe un objectif en sessions parallèles dans le cloud) ; n° 58 (plus le chantier est gros, plus la présence humaine compte).
- **Existant** : `gabarits\AGENT-CAMPAGNE.md` encadre déjà les campagnes à agents parallèles.
- **Avis** : la n° 25 parle directement de la Factory, mais sa légende tient en une phrase. Il faut la regarder avant toute étude. La fonction « Projects » est à vérifier dans la documentation de Claude Code.

### 7. Pilotage de l'ordinateur à distance — 16

- **Vidéo** : n° 98 (@siliconcarne_). Depuis le téléphone, une tâche est confiée à Claude, qui l'exécute sur l'ordinateur resté au bureau.
- **Existant** : la loi n° 5 veut la voie automatique d'abord. Les plateformes sans interface de programmation restent pourtant des gestes humains, comme la récupération de ces favoris.
- **Avis** : le gain existe pour les gestes d'écran, mais les conditions des plateformes interdisent souvent l'automatisation. Une décision directe suffit pour savoir s'il vaut d'aller plus loin.

### 8. Vidéo de lancement générée par le code — 16

- **Vidéos** : n° 13 (@danyltn : une vidéo promotionnelle animée, tirée du code, des captures et de la charte d'une application) ; n° 8 (des scènes en 3D Three.js produites dans une conversation).
- **Existant** : aucune forge ne livre de vidéo, et le registre ne cite ni Three.js ni Remotion.
- **Avis** : ce serait un livrable neuf de mise en production. La n° 13 ne nomme pas son dépôt, il faut donc la regarder d'abord.

### 9. Transcription des vidéos et des sons — 16

- **Vidéo** : n° 30 (@code_simple), un outil libre de transcription audio, non nommé dans la légende.
- **Existant** : sans transcription, ce tri n'a lu que des légendes. Le connecteur Plaud transcrit déjà les enregistrements de réunion.
- **Avis** : un essai court suffit. Un outil local permettrait de regarder une vidéo dont vous fournissez le fichier, pour les opportunités 6 et 8.

### 10. Animation et finition des interfaces — 15

- **Vidéos** : n° 70 (Lenis, GSAP, Vanta, React Bits) ; n° 38 (Motion Primitives, Haikei, Watermelon UI) ; n° 109 (Aceternity UI, Godly, Mobbin) ; n° 19, n° 106, n° 34, n° 68, n° 50, n° 57, n° 32 et n° 41.
- **Existant** : `digit-ai-forge-design` traite déjà l'animation (`conception-forge-design.md`).
- **Avis** : ces vidéos recoupent l'opportunité 4. Elles peuvent alimenter sa liste de sources plutôt qu'une étude à part.

### 11. Check-list avant mise en ligne — 15

- **Vidéo** : n° 66 (@yatesvids), 20 éléments à demander à Claude avant de lancer un site.
- **Existant** : la loi n° 3 propose d'office la surface implicite, dont l'aide, le favicon et les états vides, et `enumere-la-surface` l'outille.
- **Avis** : il suffit de comparer ses 20 éléments à la surface implicite. Une décision directe suffit.

### 12 à 17. Opportunités sans suite proposée

- **12, base de connaissance en wiki** (n° 60 sur Obsidian et le wiki de Karpathy, n° 63) : `references\INDEX.md`, la mémoire de session et graphify couvrent déjà ce besoin.
- **13, rétro-ingénierie par agents** (n° 14, le dépôt REA) : le mode rétro-modèle de `qualifie-l-entrant` existe depuis le 19/08. L'usage sur un logiciel tiers pose aussi une question de droit.
- **14, modèle local sans carte graphique** (n° 104, BitNet de Microsoft) : la Factory n'emploie que Claude, et aucun besoin d'inférence locale n'est relevé.
- **15, diagramme d'un dépôt** (n° 27 sur gitdiagram, n° 56) : `digit-ai-schemas` couvre déjà les schémas d'architecture.
- **16, style d'écriture** (n° 24, n° 37) : les règles d'écriture du pilot et `oracle-ecriture` tiennent déjà ce terrain.
- **17, service marketing tenu par des agents** (n° 74, n° 86) : utile à un produit de communication, pas à la Factory.

### 18. Opportunité à écarter

- **Extraction de sites qui contourne leurs protections** (n° 53, Scrapling) : la vidéo vante le contournement de Cloudflare. Contourner la protection d'un site viole ses conditions, quel que soit le gain.

## Vidéos hors du tri

Les 58 autres vidéos ne touchent pas la Factory, ou ne se laissent pas qualifier.

- **37 hors champ** : politique, humour, couple, famille, santé, finance personnelle, culture.
- **10 sur l'IA, mais à la légende trop vague** : par exemple « Fact or Hype? » ou « FABLE 5 USE CASES ». Seul leur contenu permettrait de les ranger.
- **7 sans légende** : les 7 premières de la page, publiées sous un identifiant numérique.
- **4 de contexte sans geste à en tirer** : la retraite du créateur de Ruby on Rails, 2 vidéos d'humour sur le SEO, un conseil général sur la documentation.

## Annexe — rangement des 109 vidéos

Le script de rangement vérifie que chaque vidéo de la page a reçu exactement un rangement.

| N° | Auteur | Lien | Rangement |
|---|---|---|---|
| 1 | (identifiant numérique) | [vidéo](https://www.tiktok.com/@6603678889687285766/video/7692481345418743073) | sans légende |
| 2 | (identifiant numérique) | [vidéo](https://www.tiktok.com/@6958878145954153478/video/7328784435585895713) | sans légende |
| 3 | (identifiant numérique) | [vidéo](https://www.tiktok.com/@7328813371557479457/video/7677199613920660768) | sans légende |
| 4 | (identifiant numérique) | [vidéo](https://www.tiktok.com/@28553134/video/7651674300792966433) | sans légende |
| 5 | (identifiant numérique) | [vidéo](https://www.tiktok.com/@7406074090656187424/video/7661338541124832544) | sans légende |
| 6 | (identifiant numérique) | [vidéo](https://www.tiktok.com/@7406074090656187424/video/7632375041962937622) | sans légende |
| 7 | (identifiant numérique) | [vidéo](https://www.tiktok.com/@7556122396627158038/video/7633096445540846870) | sans légende |
| 8 | @nocode.joshua | [vidéo](https://www.tiktok.com/@nocode.joshua/video/7697743014395006224) | opportunité 8 |
| 9 | @harissa.studio | [vidéo](https://www.tiktok.com/@harissa.studio/video/7696963960544808224) | hors champ |
| 10 | @build_in_public | [vidéo](https://www.tiktok.com/@build_in_public/video/7696325149036989729) | opportunité 2 |
| 11 | @afueriste | [vidéo](https://www.tiktok.com/@afueriste/video/7680973509622811937) | hors champ |
| 12 | @bvoltaire | [vidéo](https://www.tiktok.com/@bvoltaire/video/7696448541064957206) | hors champ |
| 13 | @danyltn | [vidéo](https://www.tiktok.com/@danyltn/video/7696911795797216545) | opportunité 8 |
| 14 | @laforet.dev | [vidéo](https://www.tiktok.com/@laforet.dev/video/7696085748390448417) | opportunité 13 |
| 15 | @thesaasdaddy | [vidéo](https://www.tiktok.com/@thesaasdaddy/video/7692005218602519840) | contexte sans geste |
| 16 | @ninon.ia | [vidéo](https://www.tiktok.com/@ninon.ia/video/7695104710990236961) | légende trop vague |
| 17 | @fabien.faro | [vidéo](https://www.tiktok.com/@fabien.faro/video/7694714361285233952) | hors champ |
| 18 | @thehypekevin | [vidéo](https://www.tiktok.com/@thehypekevin/video/7694702701220793620) | opportunité 3 |
| 19 | @ia_irl | [vidéo](https://www.tiktok.com/@ia_irl/video/7695076079089847575) | opportunité 10 |
| 20 | @odieuxconnard | [vidéo](https://www.tiktok.com/@odieuxconnard/video/7691349688653565206) | hors champ |
| 21 | @sieur_lothar | [vidéo](https://www.tiktok.com/@sieur_lothar/video/7690587898869009697) | hors champ |
| 22 | @sieur_lothar | [vidéo](https://www.tiktok.com/@sieur_lothar/video/7689756337982459168) | hors champ |
| 23 | @gotheref | [vidéo](https://www.tiktok.com/@gotheref/video/7684403049812561154) | opportunité 2 |
| 24 | @bengusberg | [vidéo](https://www.tiktok.com/@bengusberg/video/7689297926992039199) | opportunité 16 |
| 25 | @steve8708 | [vidéo](https://www.tiktok.com/@steve8708/video/7688793433128848653) | opportunité 6 |
| 26 | @henriexploria | [vidéo](https://www.tiktok.com/@henriexploria/video/7687624271534804256) | légende trop vague |
| 27 | @unefille.ia | [vidéo](https://www.tiktok.com/@unefille.ia/video/7687304298543303968) | opportunité 15 |
| 28 | @ia_irl | [vidéo](https://www.tiktok.com/@ia_irl/video/7687570462238444822) | opportunité 6 |
| 29 | @christopher.ferr.studio | [vidéo](https://www.tiktok.com/@christopher.ferr.studio/video/7687553519804534049) | opportunité 2 |
| 30 | @code_simple | [vidéo](https://www.tiktok.com/@code_simple/video/7668021966699318560) | opportunité 9 |
| 31 | @itstundealao | [vidéo](https://www.tiktok.com/@itstundealao/video/7686156516189080854) | légende trop vague |
| 32 | @digidop.fr | [vidéo](https://www.tiktok.com/@digidop.fr/video/7685786692338339105) | opportunité 10 |
| 33 | @lincompris427 | [vidéo](https://www.tiktok.com/@lincompris427/video/7685836890108480801) | hors champ |
| 34 | @9jabestwebdev | [vidéo](https://www.tiktok.com/@9jabestwebdev/video/7683417320932396309) | opportunité 10 |
| 35 | @darrenshawseo | [vidéo](https://www.tiktok.com/@darrenshawseo/video/7683548612860579080) | opportunité 2 |
| 36 | @pixelcrafted.raphael | [vidéo](https://www.tiktok.com/@pixelcrafted.raphael/video/7683582778037832982) | opportunité 1 |
| 37 | @ia_irl | [vidéo](https://www.tiktok.com/@ia_irl/video/7683483984457698582) | opportunité 16 |
| 38 | @danyltn | [vidéo](https://www.tiktok.com/@danyltn/video/7682818781088927008) | opportunité 10 |
| 39 | @coffee.break.geek | [vidéo](https://www.tiktok.com/@coffee.break.geek/video/7681750734399966496) | hors champ |
| 40 | @philo_sophia_ | [vidéo](https://www.tiktok.com/@philo_sophia_/video/7681341926334795041) | hors champ |
| 41 | @henriexploria | [vidéo](https://www.tiktok.com/@henriexploria/video/7679822381791153440) | opportunité 10 |
| 42 | @victorferrynews | [vidéo](https://www.tiktok.com/@victorferrynews/video/7679122267036454166) | hors champ |
| 43 | @heytonyagency | [vidéo](https://www.tiktok.com/@heytonyagency/video/7677995760121793810) | contexte sans geste |
| 44 | @heytonyagency | [vidéo](https://www.tiktok.com/@heytonyagency/video/7678411567997799688) | contexte sans geste |
| 45 | @build_in_public | [vidéo](https://www.tiktok.com/@build_in_public/video/7678073908217548065) | opportunité 2 |
| 46 | @philo_sophia_ | [vidéo](https://www.tiktok.com/@philo_sophia_/video/7650089160698645793) | hors champ |
| 47 | @philo_sophia_ | [vidéo](https://www.tiktok.com/@philo_sophia_/video/7661583718850563361) | hors champ |
| 48 | @themarketinginternss | [vidéo](https://www.tiktok.com/@themarketinginternss/video/7677281325094571278) | légende trop vague |
| 49 | @soldat2.0france | [vidéo](https://www.tiktok.com/@soldat2.0france/video/7677186794454027553) | hors champ |
| 50 | @designmotionhq | [vidéo](https://www.tiktok.com/@designmotionhq/video/7663970279152012576) | opportunité 10 |
| 51 | @38steffssa | [vidéo](https://www.tiktok.com/@38steffssa/video/7675837654633647367) | hors champ |
| 52 | @jb.merov | [vidéo](https://www.tiktok.com/@jb.merov/video/7676925886167305494) | hors champ |
| 53 | @andrew.aibuilder | [vidéo](https://www.tiktok.com/@andrew.aibuilder/video/7676851823864450337) | opportunité 18 |
| 54 | @chase_ai_ | [vidéo](https://www.tiktok.com/@chase_ai_/video/7677056314572279054) | opportunité 4 |
| 55 | @code_simple | [vidéo](https://www.tiktok.com/@code_simple/video/7673978323009080609) | légende trop vague |
| 56 | @code_simple | [vidéo](https://www.tiktok.com/@code_simple/video/7674647531631955232) | opportunité 15 |
| 57 | @designmotionhq | [vidéo](https://www.tiktok.com/@designmotionhq/video/7676818554737528096) | opportunité 10 |
| 58 | @manu.builds | [vidéo](https://www.tiktok.com/@manu.builds/video/7676423549204073750) | opportunité 6 |
| 59 | @henriexploria | [vidéo](https://www.tiktok.com/@henriexploria/video/7656399260304379158) | opportunité 3 |
| 60 | @ia_irl | [vidéo](https://www.tiktok.com/@ia_irl/video/7676156598607219990) | opportunité 12 |
| 61 | @practicalyai | [vidéo](https://www.tiktok.com/@practicalyai/video/7673608737231310100) | légende trop vague |
| 62 | @calmlings | [vidéo](https://www.tiktok.com/@calmlings/video/7673180299584490766) | hors champ |
| 63 | @nate.b.jones | [vidéo](https://www.tiktok.com/@nate.b.jones/video/7673300886474607902) | opportunité 12 |
| 64 | @interiorwithlove_ | [vidéo](https://www.tiktok.com/@interiorwithlove_/video/7672134574863846689) | hors champ |
| 65 | @maxwellcopy | [vidéo](https://www.tiktok.com/@maxwellcopy/video/7672412934127013134) | hors champ |
| 66 | @yatesvids | [vidéo](https://www.tiktok.com/@yatesvids/video/7672218589990112520) | opportunité 11 |
| 67 | @emxllouise2 | [vidéo](https://www.tiktok.com/@emxllouise2/video/7671535340208885013) | hors champ |
| 68 | @haydenschmitty | [vidéo](https://www.tiktok.com/@haydenschmitty/video/7671140138939960590) | opportunité 10 |
| 69 | @alex.nex.tech | [vidéo](https://www.tiktok.com/@alex.nex.tech/video/7670323861266795799) | opportunité 3 |
| 70 | @henriexploria | [vidéo](https://www.tiktok.com/@henriexploria/video/7664569163343498518) | opportunité 10 |
| 71 | @milesreevesai | [vidéo](https://www.tiktok.com/@milesreevesai/video/7671053862857477408) | opportunité 3 |
| 72 | @nocode.joshua | [vidéo](https://www.tiktok.com/@nocode.joshua/video/7669765035329146120) | opportunité 4 |
| 73 | @philo_sophia_ | [vidéo](https://www.tiktok.com/@philo_sophia_/video/7669467573758463264) | hors champ |
| 74 | @restructureai | [vidéo](https://www.tiktok.com/@restructureai/video/7668702726770986261) | opportunité 17 |
| 75 | @byarnieverma | [vidéo](https://www.tiktok.com/@byarnieverma/video/7664369626804915476) | contexte sans geste |
| 76 | @amouroscopie | [vidéo](https://www.tiktok.com/@amouroscopie/video/7661306185483570454) | hors champ |
| 77 | @jorisetsophie_igrec | [vidéo](https://www.tiktok.com/@jorisetsophie_igrec/video/7667650360667901192) | hors champ |
| 78 | @sophia_shalev | [vidéo](https://www.tiktok.com/@sophia_shalev/video/7646904244703890721) | hors champ |
| 79 | @chrishewitt559 | [vidéo](https://www.tiktok.com/@chrishewitt559/video/7669002973556608278) | hors champ |
| 80 | @zerodollarcoaching | [vidéo](https://www.tiktok.com/@zerodollarcoaching/video/7667652752025079071) | hors champ |
| 81 | @omg.fit | [vidéo](https://www.tiktok.com/@omg.fit/video/7663221207088614689) | hors champ |
| 82 | @kelly.cruz.67 | [vidéo](https://www.tiktok.com/@kelly.cruz.67/video/7657933846029012256) | hors champ |
| 83 | @nate.b.jones | [vidéo](https://www.tiktok.com/@nate.b.jones/video/7651792274459872543) | légende trop vague |
| 84 | @geeknfit | [vidéo](https://www.tiktok.com/@geeknfit/video/7664139960001301793) | hors champ |
| 85 | @nocode.joshua | [vidéo](https://www.tiktok.com/@nocode.joshua/video/7654197612857298184) | opportunité 4 |
| 86 | @nocode.joshua | [vidéo](https://www.tiktok.com/@nocode.joshua/video/7663973344026397960) | opportunité 17 |
| 87 | @ai.samaritan | [vidéo](https://www.tiktok.com/@ai.samaritan/video/7663952738338245895) | opportunité 6 |
| 88 | @jeromebreunin | [vidéo](https://www.tiktok.com/@jeromebreunin/video/7662763427592523041) | légende trop vague |
| 89 | @shanecoleofficial | [vidéo](https://www.tiktok.com/@shanecoleofficial/video/7659889142498659606) | hors champ |
| 90 | @omasro_ | [vidéo](https://www.tiktok.com/@omasro_/video/7648718045367520545) | hors champ |
| 91 | @henyboumaaza | [vidéo](https://www.tiktok.com/@henyboumaaza/video/7650525089884032289) | hors champ |
| 92 | @theo.vance.ai | [vidéo](https://www.tiktok.com/@theo.vance.ai/video/7660573328012266774) | opportunité 3 |
| 93 | @henriexploria | [vidéo](https://www.tiktok.com/@henriexploria/video/7658635348200705302) | opportunité 5 |
| 94 | @louisbuildss | [vidéo](https://www.tiktok.com/@louisbuildss/video/7660528800530271510) | opportunité 2 |
| 95 | @siliconcarne_ | [vidéo](https://www.tiktok.com/@siliconcarne_/video/7660574218341453088) | hors champ |
| 96 | @chase_ai_ | [vidéo](https://www.tiktok.com/@chase_ai_/video/7658454534166957325) | légende trop vague |
| 97 | @ravelkel | [vidéo](https://www.tiktok.com/@ravelkel/video/7659809622596848928) | hors champ |
| 98 | @siliconcarne_ | [vidéo](https://www.tiktok.com/@siliconcarne_/video/7635015819780443425) | opportunité 7 |
| 99 | @mademoiselletech | [vidéo](https://www.tiktok.com/@mademoiselletech/video/7659423008792104225) | hors champ |
| 100 | @codingbiceps | [vidéo](https://www.tiktok.com/@codingbiceps/video/7658353967839137057) | opportunité 5 |
| 101 | @cyberbro10 | [vidéo](https://www.tiktok.com/@cyberbro10/video/7640787250522967328) | opportunité 3 |
| 102 | @tech.markk | [vidéo](https://www.tiktok.com/@tech.markk/video/7657608365861817632) | opportunité 3 |
| 103 | @magenta.agence | [vidéo](https://www.tiktok.com/@magenta.agence/video/7658339821521358112) | légende trop vague |
| 104 | @bariqrifki | [vidéo](https://www.tiktok.com/@bariqrifki/video/7657313143630171399) | opportunité 14 |
| 105 | @meatmehoney | [vidéo](https://www.tiktok.com/@meatmehoney/video/7657150475149528352) | hors champ |
| 106 | @unefille.ia | [vidéo](https://www.tiktok.com/@unefille.ia/video/7656938932474481953) | opportunité 10 |
| 107 | @le_raphine | [vidéo](https://www.tiktok.com/@le_raphine/video/7654260384454561057) | opportunité 5 |
| 108 | @frenchstartupper | [vidéo](https://www.tiktok.com/@frenchstartupper/video/7653855574311980321) | hors champ |
| 109 | @henriexploria | [vidéo](https://www.tiktok.com/@henriexploria/video/7653793373190393110) | opportunité 10 |
