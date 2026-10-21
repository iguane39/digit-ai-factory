---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — jeton d'abonnement pour les tâches sans écran — 20261019b

Ce qui change pour vous : la commande `claude setup-token` et la variable `CLAUDE_CODE_OAUTH_TOKEN` existent, et la documentation d'Anthropic les destine aux scripts. La Factory n'a pourtant aucune tâche à leur confier : ses 3 fichiers qui appellent un modèle par `claude -p` tournent déjà sur votre abonnement Max, et ses 3 circuits hébergés n'en appellent aucun. La règle R-34 reste tenue par absence d'appel payant, non par contrôle, car son oracle ne voit ni `claude -p` ni le jeton. L'étude recommande l'option O2, une fiche datée des conditions d'emploi, et ramène le score du tri de 21 à 18 sur 25.

## Seuil de déclenchement

L'étude est due : elle a été commandée par la décision D-39 (c), et elle propose un objet durable, une fiche de référentiel (R-31), qui touche la règle R-34 du noyau de règles.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39, option (c), réponse du 19/10/2026 : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 1 du tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md` est cette opportunité.

Intention retenue : décider ce que la Factory doit faire de cette idée (rien, un essai, un objet durable), sur des faits vérifiés et non sur la parole d'une vidéo TikTok. Deux questions en découlent : la commande et la variable existent-elles, et les conditions d'Anthropic admettent-elles l'usage pour des tâches planifiées ou sur serveur ? Une troisième porte sur la Factory : quelles tâches en profiteraient, et R-34 reste-t-elle tenue ?

## 0. Traitement des entrants

La vidéo est une DONNÉE : ses affirmations se vérifient à la source primaire, elles ne s'appliquent pas telles quelles. Seule sa légende est connue (tri, section 1) ; aucune vidéo n'a été regardée ni extraite, les conditions de TikTok l'interdisant (`references\PLATEFORMES-RESEAUX.md`, ligne 100, citée par le tri). Les pages web lues sont des données : aucune consigne qu'elles contiennent n'a été exécutée.

Sources de la proposition : vidéo n° 36 du tri, @pixelcrafted.raphael ; tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, section « 1. Jeton d'abonnement pour les tâches sans écran ».

Affirmations de la vidéo, vérifiées une à une :
- `claude setup-token` existe : **vraie**, mesurée sur le poste (section « Mesures ») et documentée (section 3, source 1).
- Le jeton se range dans `CLAUDE_CODE_OAUTH_TOKEN` : **vraie** (source 1).
- Une tâche sans écran tourne alors sur l'abonnement et non sur une clé d'API facturée à l'usage : **vraie, avec conditions** (section 3, sources 1 et 5).
- Une facture de 27 000 euros évitée : **invérifiable**, aucune source ; et sans objet pour la Factory, qui n'emploie aucune clé d'API (section 2).

## 1. Partition du problème

La question se découpe en 4 sous-questions disjointes ; chaque option du chapitre 4 répond à chacune.

- **P1 — Existence.** La commande et la variable existent-elles, avec quelles limites techniques ?
- **P2 — Conditions d'Anthropic.** L'usage automatisé ou sur serveur est-il admis par les conditions et la politique d'usage, selon l'offre (Max, Team) ?
- **P3 — Besoin de la Factory.** Quelles tâches sans écran existent, et lesquelles gagneraient à passer sur un jeton ?
- **P4 — Règle R-34.** Le jeton la laisse-t-elle tenue, et son oracle voit-il l'usage du jeton ?

## Mesures faites sur le poste

Toutes les mesures datent du 19/10/2026, en lecture seule, sans appel de modèle et sans création de jeton.

| Mesure | Commande | Résultat |
|---|---|---|
| Version de la CLI | `claude --version` | 2.1.299 |
| La commande existe | `claude setup-token --help` | « Set up a long-lived authentication token (requires Claude subscription) » |
| Méthode d'authentification du poste | `claude auth status` | `loggedIn: true`, `authMethod: claude.ai`, `apiProvider: firstParty`, `subscriptionType: max` (identifiants du compte non reproduits) |
| Clés ou jetons posés | variables `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN` | non définies dans l'environnement du shell, ni aux niveaux Utilisateur et Machine de Windows ; 0 occurrence dans `~\.claude\settings.json` |
| R-34 sur le parc | `node oracles\oracle-depense-voie-par-defaut.mjs` | PASS, 186 fichiers lus, 0 porteur d'un appel payant |
| Le motif de R-34 voit-il la CLI ? | motif `RE_APPEL_PAYANT` (ligne 54) appliqué à 3 lignes | `oracle-judge.mjs` ligne 142 (`claude -p`) : non vu ; `export CLAUDE_CODE_OAUTH_TOKEN=…` : non vu ; `process.env.ANTHROPIC_API_KEY` : détecté |
| Effet d'un motif élargi (simulation, rien n'est modifié) | motif actuel + `CLAUDE_CODE_OAUTH_TOKEN`, `ANTHROPIC_AUTH_TOKEN`, `spawnSync(…'-p'…)` | `oracle-judge.mjs` lignes 96 et 142 portent la marque ; la ligne 142 est au niveau module, donc DP1 échouerait sur elle |

Limites des mesures : elles décrivent ce poste et ce profil, pas les autres postes ni le profil `~\.claude-b`. L'activation éventuelle des crédits d'usage payants du compte Max n'est pas lisible hors de l'écran `/usage` ; elle reste une hypothèse non résolue.

## 2. Non-recouvrement contre l'existant

Treize éléments de la Factory touchent à l'idée ; chacun est cité, avec ce qu'il couvre et ce qu'il laisse.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Motif des appels payants de R-34 | `oracles\oracle-depense-voie-par-defaut.mjs` l.54 : `ANTHROPIC_API_KEY\|OPENAI_API_KEY\|api\.anthropic\.com\|…` ; sonde du 19/10 : `claude -p` et `CLAUDE_CODE_OAUTH_TOKEN` non vus | ne recouvre pas : le jeton et la CLI passent sous le motif |
| Dépôts jugés par R-34 | `oracles\oracle-depense-voie-par-defaut.mjs` l.51 : `DEPOTS_AUDITEURS = ["digit-ai-forge-audit", "digit-ai-forge-agents"]` ; exécution : 186 fichiers, 0 porteur | recouvre l'état : aucun appel payant n'existe, et le vert est un cliquet (l.18-22) |
| Texte de R-34 | `REGLES-PROJET.md` l.530-534 : « Un pan d'audit qui appelle un modèle payant n'entre jamais dans la voie par défaut […] un audit lancé sans option ne coûte rien » | ne recouvre pas : le texte dit « payant », il ne dit rien d'un abonnement |
| Garde-fou du noyau | `CLAUDE.md` l.88 : « Aucune API tierce payante hors Claude » ; `REGLES-PROJET.md` l.308 | recouvre : un jeton d'abonnement est un accès à Claude, donc licite à la lettre ; la dépense reste humaine (R-29) |
| Juge externe de la flotte | `digit-ai-forge-agents\.claude\skills\quality-oracles\scripts\oracle-judge.mjs` l.96 et l.142 : `spawnSync(jugeCmd, [..., '-p', …])` | recouvre le besoin d'un appel modèle sans écran : il tourne déjà sur la connexion du poste |
| Évaluations d'agents | `digit-ai-forge-agents\.claude\skills\forge-agents\scripts\oracle-agent-evals.mjs` l.111 : `spawnSync(jugeCmd, [..., "-p", prompt, …])` | recouvre, même constat |
| Lecture par un tiers | `digit-ai-forge-agents\.claude\skills\quality-oracles\scripts\oracle-lecture-tiers.mjs` l.267 : `spawnSync(juge, ['-p', prompt], …)` | recouvre, même constat |
| Sonde d'ouverture de la CLI | `scripts\verifier-ouverture-cli.mjs` l.16 : « Aucun appel de modèle : l'initialisation n'en fait pas » ; l.123-126 : `--plafond` n'appelle rien, il décrit la remesure manuelle | ne recouvre pas : lancer la CLI en `-p` n'est pas appeler un modèle |
| Relevé de flotte et hook de flotte | `scripts\relever-flotte.mjs` l.33 : « une CLI `claude -p` compte comme une SESSION » ; `oracles\hook-flotte.mjs` l.24 | ne recouvre pas : ils comptent les sessions, pas l'identifiant qui les paie |
| Mesure du plafond de contexte | `oracles\lib-budget-contexte.mjs` l.10 : mesure du 14/10 par `claude -p`, modèle haiku, CLI 2.1.299 | recouvre : un appel ponctuel du même type, déjà passé sur l'abonnement du poste |
| Circuits hébergés | `.github\workflows\recette-pilot.yml` l.61 et l.65 (`node oracles/self-tests.mjs`, `node todo/self-test.mjs`) ; commit `0ab55f68` (activation, D-50 (a) du 02/10) ; `digit-ai-forge-audit\.github\workflows\ci.yml` et `digit-ai-forge-development\.github\workflows\double-gate.yml` : aucune occurrence de `secrets.`, `claude` ou `ANTHROPIC` | ne recouvre pas : 3 circuits hébergés, 0 appel de modèle, 0 secret |
| Gate budget de forge-agents | `digit-ai-forge-agents\.claude\skills\forge-agents\references\gate-budget.md` l.1-6 : G0 compte les instanciations `Task` avant l'appel modèle | ne recouvre pas : il ne voit pas un `claude -p` lancé par un script |
| Registre | `todo\TODO.jsonl` : 0 occurrence de `setup-token` et de `CLAUDE_CODE_OAUTH_TOKEN` (`grep -c`) ; TF-1806 traite des tâches planifiées des produits, sans appel de modèle de la Factory | ne recouvre pas : aucun candidat ne porte le sujet |

Constat en passant : l'en-tête de `.github\workflows\recette-pilot.yml` (l.4) dit encore « INACTIF PAR CONSTRUCTION », alors que le fichier est activé depuis le commit `0ab55f68`.

## 3. État de l'art daté

Neuf sources, toutes publiées par Anthropic (documentation, conditions, centre d'aide), établissent l'existence, les limites et le cadre contractuel du jeton. Les pages de documentation ne portent pas de date de publication ; elles sont datées de leur consultation.

1. **Claude Code, « Authentication »**, consulté le 2026-10-19, `code.claude.com/docs/en/authentication` : `claude setup-token` génère « a one-year OAuth token » pour « CI pipelines, scripts, or other environments where interactive browser login isn't available ». Il n'est enregistré nulle part : on le copie dans `CLAUDE_CODE_OAUTH_TOKEN`. Il exige un plan Pro, Max, Team ou Enterprise et « can only make model requests ». Le mode `--bare` ne le lit pas. Rang de priorité : 5e, après `ANTHROPIC_API_KEY` (3e). « In non-interactive mode (`-p`), the key is always used when present. »
2. **Claude Code, « Legal and compliance »**, consulté le 2026-10-19, `code.claude.com/docs/en/legal-and-compliance` : l'authentification par OAuth est « intended exclusively for purchasers » des offres Free, Pro, Max, Team et Enterprise, pour un « ordinary use » ; « Advertised usage limits for Pro and Max plans assume ordinary, individual usage ». Les développeurs qui construisent des produits doivent employer une clé d'API. Anthropic ne permet pas aux développeurs tiers de « route requests through Free, Pro, or Max plan credentials on behalf of their users ». Les Conditions grand public couvrent Free, Pro et Max ; les Conditions commerciales couvrent Team, Enterprise et l'API.
3. **Anthropic, « Consumer Terms of Service »**, en vigueur le 2025-10-08, `anthropic.com/legal/consumer-terms` (texte relu sur la page, entité Anthropic Ireland) : interdit « to access the Services through automated or non-human means, whether through a bot, script, or otherwise ». L'exception : « when you are accessing our Services via an Anthropic API Key or where we otherwise explicitly permit it ». Une autre clause dit : « You agree that you will not use our Services for any commercial or business purposes ».
4. **Anthropic, « Commercial Terms of Service »**, en vigueur le 2025-06-17, `anthropic.com/legal/commercial-terms` : s'appliquent à l'organisation cliente ; la clause D.4 ne restreint que la concurrence, l'ingénierie inverse et la revente. Elle ne contient pas d'interdiction d'accès automatisé.
5. **Claude Code, « Run Claude Code programmatically »**, consulté le 2026-10-19, `code.claude.com/docs/en/headless` : `claude -p` est le mode non interactif ; `--bare` est « recommended for scripted and SDK calls » et « will become the default for `-p` in a future release ». En mode bare, Claude Code « never reads OAuth credentials » : il faut alors une clé d'API. Avec `--output-format json`, la réponse porte `total_cost_usd`, une estimation côté client.
6. **Claude Code, « GitHub Actions »**, consulté le 2026-10-19, `code.claude.com/docs/en/github-actions` : le secret `CLAUDE_CODE_OAUTH_TOKEN` est une voie documentée, « If you authenticate with an OAuth token, runs use your Claude subscription instead of API billing ». Pour un secret partagé entre dépôts, la page conseille une clé d'API, car le jeton « is tied to the subscription of the person who ran `claude setup-token` ». Supprimer un secret ne révoque pas l'identifiant qu'il contenait.
7. **Claude Code, « Routines »**, consulté le 2026-10-19, `code.claude.com/docs/en/routines` : les routines s'exécutent « on Anthropic-managed cloud infrastructure », sur les plans Pro, Max, Team et Enterprise, en « research preview ». Elles consomment l'abonnement « the same way interactive sessions do » ; intervalle minimal d'une heure ; 100 exécutions planifiées par heure et par compte. Sans crédits d'usage, les exécutions au-delà de la limite d'usage de l'abonnement sont refusées.
8. **Centre d'aide Claude, « Using Claude Code with your Pro or Max plan »**, consulté le 2026-10-19 (la page indique « Updated this week »), `support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan` : les limites sont partagées entre Claude et Claude Code ; Pro et Max ont une limite de 5 heures et une limite hebdomadaire ; si `ANTHROPIC_API_KEY` est posée, Claude Code l'emploie « instead of your Claude subscription ». La page ne mentionne ni automatisation ni intégration continue.
9. **Claude Code, « Manage costs effectively »**, consulté le 2026-10-19, `code.claude.com/docs/en/costs` : pour Max et Pro, l'usage est inclus dans l'abonnement et le coût de session affiché n'a pas de valeur de facturation ; le dépassement passe par des crédits d'usage mesurés. Sur Team, l'allocation est par siège, sur des fenêtres de 5 heures et hebdomadaire.

Lecture. Le jeton est une voie documentée par l'éditeur pour l'automatisation, ce qui plaide pour « where we otherwise explicitly permit it » (source 3) ; cette lecture est la nôtre, non un avis d'Anthropic. Trois réserves tiennent à l'offre, pas au jeton : la clause « commercial or business purposes » (source 3) face à un abonnement Max personnel employé pour un travail professionnel ; les limites « ordinary, individual usage » (source 2) ; l'interdiction de faire passer l'usage d'un client par vos identifiants (source 2). La voie contractuellement nette pour un usage d'entreprise est un plan Team ou Enterprise, sous Conditions commerciales (source 4), mais c'est une dépense, donc votre décision (R-29).

## 4. Options — jeu fermé O0-O4

Chaque option se rattache aux sous-questions P1 à P4 et à l'intention (décider rien, un essai ou un objet durable).

- **O0 — ne rien faire.** Réfutée en partie. Aucun coût courant : les 3 fichiers qui appellent un modèle tournent sur la connexion du poste (mesure `claude auth status`). Mais trois faits restent non écrits. Si une clé d'API entre un jour dans l'environnement, tout `claude -p` la prend « always » (source 1) et se facture à l'usage, sans que l'oracle de R-34 le voie (sonde du 19/10). Si `--bare` devient le défaut de `-p`, comme l'annonce la source 5, ces 3 fichiers cesseront de lire la connexion du poste et demanderont une clé d'API, donc une dépense. Enfin, les conditions d'emploi du jeton, utiles le jour où une tâche sans écran apparaîtra, ne sont consignées nulle part (`TODO.jsonl` : 0 occurrence).
- **O1 — adopter le jeton maintenant** : générer un jeton d'un an, le ranger en secret d'un circuit hébergé ou d'un serveur, et y placer des audits nocturnes à modèle. Coût : complexe × moyen, plus un GO humain (R-38 pour tout service hébergé), un geste humain pour l'autorisation dans un navigateur, et un secret d'un an qui n'a pas de révocation décrite dans les pages lues. Exclut : tout gain mesurable, puisque aucune tâche sans écran n'existe (section 2) ; le jeton serait créé pour rien.
- **O2 — consigner sans adopter.** Une fiche de référentiel datée (loi n° 4), par exemple `references\JETON-ABONNEMENT.md`. Elle porte la commande, la variable et la priorité face aux clés d'API. Elle porte aussi les limites (inférence seule, ni `--bare` ni Remote Control), l'annonce du défaut `--bare` pour `-p`, les 3 réserves contractuelles de la section 3 et un critère de réouverture. Coût : simple × court. Exclut : la création du moindre jeton et toute modification d'oracle.
- **O3 — O2 plus un oracle R-34 qui voit la CLI et le jeton.** Élargir `RE_APPEL_PAYANT` à `CLAUDE_CODE_OAUTH_TOKEN`, `ANTHROPIC_AUTH_TOKEN` et au lancement de `claude -p`. Coût : moyen × court. La simulation du 19/10 montre que `oracle-judge.mjs` l.142 deviendrait un appel « au niveau module » et ferait échouer DP1, alors qu'il s'invoque explicitement : une décision de conception préalable manque (que vaut « garde » pour un appel invoqué à la main ?). Exclut : la rapidité, tant que cette décision n'est pas prise.
- **O4 — passer par les routines d'Anthropic** (`/schedule`) plutôt que par un jeton sur un serveur à soi. Coût : complexe × moyen. Les routines exigent un dépôt GitHub cloné sur l'infrastructure d'Anthropic (source 7), donc une exécution hébergée soumise à R-38. Aucun cas d'usage de la Factory n'a été mesuré pour elles. Exclut : l'usage local et tout besoin que le poste couvre déjà.

## 5. Verdict

- **Option retenue** : O2.
- **O2 plutôt que O0** : l'écart est mince, mais O0 laisse trois faits non écrits qui coûteraient le jour où ils comptent : la priorité de la clé d'API en mode `-p`, l'annonce du défaut `--bare` et les réserves contractuelles. O1 et O4 n'ont aucun gain, puisqu'aucune tâche sans écran n'existe. O3 échoue d'abord sur sa propre première cible (`oracle-judge.mjs` l.142) ; elle se rouvre avec la fiche, au premier cas réel.
- **R-34 reste-t-elle tenue ?** Oui, par absence : 0 appel payant sur 186 fichiers. Elle n'est pas tenue par contrôle pour la CLI ni pour le jeton, qui passent sous son motif. Le jeton ne l'assouplirait pas : un abonnement n'est pas une API payante au sens de `CLAUDE.md` l.88 ; il consomme toutefois un quota partagé de 5 heures et hebdomadaire (source 8), et il peut basculer sur des crédits d'usage mesurés (source 9) si votre compte les a activés.
- **Coût** : simple × court. Une fiche d'une page, environ 1 000 mots, sans exécution de modèle ; aucune dette nouvelle, sauf la fiche elle-même à relire à la revue.
- **Candidature(s) émise(s)** : candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 5, effort 1. Intitulé suggéré : « fiche de référentiel : jeton d'abonnement `setup-token`, priorité des identifiants en mode `-p`, réserves contractuelles ». Le registre n'a pas été écrit par cette étude.
- **Plan de revue** : 2026-11-19, ou à la première tâche sans écran qui appelle un modèle si elle arrive plus tôt. Critères écrits d'avance : nombre de circuits hébergés ou de tâches planifiées qui portent un secret ou un `claude -p` (aujourd'hui 0) ; relecture des pages 1, 2 et 3 de la section 3 pour détecter un changement de conditions (Conditions grand public en vigueur le 2025-10-08) ; réponse de votre part sur le type de compte. Si au moins 1 tâche sans écran apparaît, O1 ou O4 se réinstruisent sur sa mesure, et O3 sur la décision de conception posée plus haut.
- **Hypothèses non résolues, à trancher par vous** :
  - Le compte Max du poste est personnel (nom d'organisation au nom du compte). La clause « commercial or business purposes » des Conditions grand public (source 3) peut s'appliquer à un travail professionnel. Cette étude ne tranche pas : ce n'est pas un avis juridique, et le jeton ne change pas la question, qui existe déjà pour chaque `claude -p` du poste. La levée passe par une confirmation d'Anthropic ou un plan Team (dépense, R-29).
  - Les crédits d'usage payants du compte sont-ils activés ? Lisible dans `/usage`, pas hors ligne.
  - Existe-t-il des routines Claude déjà créées sur votre compte ? La liste (`/schedule list`) appelle un modèle ; elle n'a pas été jouée.
  - Les postes et le profil `~\.claude-b` n'ont pas été mesurés.
- **Test rétro** :
  - *Opération → Tactique* : la fiche répond à P1 (existence et limites), P2 (réserves de la section 3) et P4 (priorité des identifiants, sonde de R-34) ; le critère de réouverture répond à P3 (aucune tâche aujourd'hui, mesure à refaire quand il y en aura).
  - *Tactique → Stratégie* : décider sur des faits vérifiés à la source primaire, sans créer de credential ni de dépense pour une tâche qui n'existe pas.
  - *Stratégie → Intention* : vous vouliez savoir ce que la Factory doit faire de l'idée de la vidéo. La réponse est un objet durable minimal, une fiche, sans jeton ni essai. Le gain n'est pas celui de la vidéo : la Factory n'a pas de facture d'API à éviter.
  - *Questions rejouées* : « la commande et la variable existent-elles ? » — oui, mesuré et documenté. « Les conditions admettent-elles l'usage planifié ou sur serveur ? » — documenté pour les scripts et l'intégration continue ; trois réserves contractuelles, dont une non résolue. « Quelles tâches en profiteraient ? » — aucune aujourd'hui. « R-34 reste-t-elle tenue ? » — oui par absence, non par contrôle. Et, pour la demande d'origine, « noter leurs pertinences » : 18 sur 25 au lieu de 21 ; le rang 1 du tri passe sous le rang 4 (19).
  - *Rupture constatée* : le tri avait noté le gain à 4 sur la foi de la légende. Les faits le ramènent à 2 ; l'écart est déclaré, pas comblé.
