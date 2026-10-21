---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: redacteur
verdict_arbitre: oracle-etude-opportunite PASS (E1-E10) · oracle-ecriture PASS, jugés le 2026-10-19 avant remise
hypotheses_non_resolues: H1 intention non validée mot à mot · H2 activation de Computer Use et statut Dispatch du poste non lus · H3 conditions de la console Google Cloud et de Google Ads non lues · H4 date de la vidéo déduite de son identifiant · H5 gain en minutes non mesuré · H6 clauses de Meta sur la publication non tranchées · H7 règles du pilot dans une session Dispatch non établies
---

# Étude d'opportunité — le pilotage de l'ordinateur à distance (Computer Use et Dispatch) — 20261019g

Ce qui change pour vous : Computer Use et Dispatch existent et font ce que la vidéo décrit, mais ils retirent très peu de gestes humains à la Factory. Sur 13 lignes de gestes relevées dans les références, 2 sont candidates à l'automatisation par l'écran. Elles regroupent 4 gestes sur des consoles Google. Les 11 autres restent à une personne, parce qu'une clause de plateforme les interdit, qu'un consentement ou une identité les porte, ou qu'ils engagent une dépense ou un retrait irréversible.

Dispatch est fermé aux nouveaux utilisateurs d'après la page d'aide lue le 2026-10-19, et l'ordinateur doit rester allumé. L'étude recommande O1 : écrire cette limite au référentiel et dans la loi n° 5, sans rien installer ni essayer. Un essai borné (O2) se rouvre à la prochaine connexion Google, si vous êtes déjà utilisateur de Dispatch.

## Seuil de déclenchement

L'étude est due. O1 touche le noyau : elle ajoute une phrase à la loi n° 5 (`CLAUDE.md` l.32, `REGLES-PROJET.md` R-29 §4, l.310-317) et crée une section de référentiel.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39 (c) du 2026-10-19, mot pour mot : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 7 du tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md` est « Pilotage de l'ordinateur à distance ».

Lecture de l'intention, portée par la consigne de l'orchestrateur : décider ce que la Factory doit faire de cette opportunité (rien, un essai, un objet durable). La décision se fonde sur des faits vérifiés, non sur la parole d'une vidéo TikTok. Vous n'avez pas validé cette formulation ; D-39 (c) valide le lancement de l'étude, pas ces mots (hypothèse H1).

La consigne pose trois questions, rejouées au test rétro :
- Que sont Computer Use et Dispatch selon la documentation d'Anthropic, et à quelle date.
- Quels gestes humains deviendraient automatiques, et lesquels restent interdits par les conditions des plateformes.
- Quels risques de sécurité, identifiants et actions irréversibles compris, et quels gates.

## 0. Traitement des entrants

La vidéo est une donnée. Sa légende se cite, ses affirmations se vérifient, rien de ce qu'elle suggère ne s'exécute.

Sources de la proposition : tri du 2026-10-19, section 7 (l.98-102) et annexe (l.253, n° 98) ; vidéo n° 98 de @siliconcarne_, `tiktok.com/@siliconcarne_/video/7635015819780443425`. La légende a été lue dans la page de favoris que vous avez enregistrée (`input\Tiktok\iguane39 (@iguane39) _ TikTok.html`). Aucune vidéo n'a été regardée, téléchargée ni extraite de TikTok. L'exemple de la légende (« trouve-moi un vol Paris-Tokyo pour demain ») est cité, pas exécuté.

La date de la vidéo, 2026-05-01, se déduit des 32 premiers bits de l'identifiant du lien, qui encodent une heure. TikTok ne documente pas cette règle : déduction non confirmée (hypothèse H4).

| Affirmation de la légende | Verdict | Source |
|---|---|---|
| « Anthropic vient de sortir Computer Use couplé à Dispatch » | vrai : annonce du 2026-03-23, soit environ 5 semaines avant la vidéo | S1, S2 |
| Depuis le téléphone, une tâche est envoyée, Claude l'exécute « sur ton ordi resté à la maison » | vrai sous conditions : ordinateur allumé, application ouverte, offre Pro ou Max, Dispatch fermé aux nouveaux utilisateurs | S3, S6 |
| « 20 minutes plus tard le billet est réservé » | invérifiable : exemple sans essai publié ; en tension avec la documentation, qui demande une confirmation humaine pour une transaction financière et classe un achat parmi les gestes difficiles à défaire | S7, S5 |
| « Un assistant invisible qui clique, qui réserve, qui répond » | faux sur « invisible » : Claude demande l'accord avant chaque application, notifie le téléphone quand il a besoin d'un feu vert, et Anthropic conseille de le surveiller | S1, S3, S5 |
| Anthropic, OpenAI et Google poussent dans la même direction | invérifiable ici : seules les pages d'Anthropic ont été lues | aucune |

## 1. Partition du problème

Cinq sous-questions disjointes. Chaque option du chapitre 4 répond à chacune.

- **P1 — Définition et date.** Ce que sont Computer Use et Dispatch, depuis quand, pour qui.
- **P2 — Gestes qui deviennent automatiques.** Ceux que les références laissent à l'humain et que l'écran pourrait faire.
- **P3 — Gestes qui restent interdits.** Ceux qu'une condition de plateforme ou une règle de la Factory ferme.
- **P4 — Risques de sécurité.** Identifiants, actions irréversibles, consignes cachées.
- **P5 — Gates et place dans la doctrine.** Ce qui reste humain, et où l'écrire.

### P1 — Ce que sont les 2 produits

Computer Use, version produit. Dans l'application Claude Desktop, Claude prend des captures de l'écran et agit à la souris et au clavier (S6). Anthropic l'a annoncé le 2026-03-23 pour Cowork et Claude Code, en aperçu de recherche, pour les abonnés Pro et Max sur macOS et Windows (S1, S2). Claude essaie d'abord un connecteur, puis le navigateur, puis l'écran. Il demande l'accord de la personne avant chaque nouvelle application (S1).

La fonction est désactivée par défaut (S6). 2 pages d'Anthropic donnent un chemin de réglage différent : « Settings > This computer > System » (S6) et « Settings > General » (S4). Les applications sont rangées par catégorie, sans réglage possible (S6) : navigateurs et plateformes de trading en lecture seule, terminaux et éditeurs de code au clic seul, le reste en contrôle complet.

Computer Use, version API. L'outil s'appelle `computer_toolset_20260801`. Le programme de l'appelant exécute chaque action dans un environnement qu'il contrôle, et la page recommande une machine virtuelle dédiée (S7). Cette voie passe par une clé d'API, que `oracles\oracle-depense-voie-par-defaut.mjs` détecte (motif `ANTHROPIC_API_KEY`, ligne 54). Elle sort donc de la voie par défaut (R-34, `REGLES-PROJET.md` l.530) et demande un GO de dépense (R-29 §3).

Dispatch. C'est un fil de conversation unique entre le téléphone et l'ordinateur, dans l'onglet Cowork (S3, S6). Le téléphone confie et suit le travail ; l'exécution a lieu sur l'ordinateur, qui doit rester allumé avec l'application ouverte (S3). Claude choisit le type de session : développement dans Claude Code, travail documentaire dans Cowork (S6). Une notification poussée demande l'accord quand il le faut (S3).

Les dates. Le fil persistant est annoncé le 2026-03-17, sans que la note de version nomme Dispatch (S2). Le couplage avec Computer Use date du 2026-03-23 (S1, S2). Le 2026-07-07, Cowork s'ouvre au web et au mobile, avec des sessions distantes en bêta qui continuent ordinateur éteint (S2, S3).

Les conditions au 2026-10-19. La page d'aide de Dispatch dit : « Dispatch isn't available to new users. If you already use Dispatch, you can keep using it for now » (S3). Elle le range en bêta limitée pour Pro et Max. Les sessions lancées par Dispatch peuvent employer Computer Use, avec des accords d'application qui expirent après 30 minutes (S6). Dispatch n'est pas ouvert aux offres Team et Enterprise (S6). Sur Linux, Computer Use est absent (S3).

Les libellés varient d'une page à l'autre : « research preview » (S1, S6), « beta » (S4). Les pages d'aide portent « Updated this week » sans date, et S3 signale que « Claude Cowork is now just Claude ». Le vocabulaire du produit bouge : chaque ligne de cette étude se relit à la revue.

Ce que cette étude n'a pas pu lire : si Computer Use est activé sur votre poste, et si votre compte compte comme utilisateur existant de Dispatch. Ces réglages vivent dans l'application, pas dans une session (hypothèse H2).

### P2 et P3 — Les gestes humains, un par un

Les 13 lignes viennent des références nommées par la consigne : `PLATEFORMES-RESEAUX.md`, `PLATEFORME-LINKEDIN.md`, `INTEGRATIONS-FOURNISSEURS.md`, `REGLES-PROJET.md`. Elles ne couvrent pas tous les gestes humains de la Factory. Une ligne « reste humain » porte le motif ; une ligne « candidat » ne dit rien du gain en minutes, que personne n'a mesuré (`INTEGRATIONS-FOURNISSEURS.md` l.410, hypothèse H5).

| N° | Geste | Où il est relevé | Avec l'écran | Motif |
|---|---|---|---|---|
| 1 | Publier, commenter, réagir, écrire sur LinkedIn | `PLATEFORME-LINKEDIN.md` l.32 | reste humain | clause §8.2 : « Use bots or other unauthorized automated methods to access the Services […] create, comment on, like, share » (S10, en vigueur le 2025-11-03) |
| 2 | Exporter les chiffres d'une page ou d'un profil LinkedIn | `PLATEFORME-LINKEDIN.md` l.48-49 | reste humain | même clause ; elle ne distingue pas l'export (déduction) |
| 3 | Enregistrer la page des favoris TikTok | tri du 2026-10-19, l.12 ; `PLATEFORMES-RESEAUX.md` l.100 | reste humain | §3.4 : « scrape, crawl, export or otherwise extract any data […] using any automated system or software, including automated "bots" » (S10, mise à jour le 2026-07-15) |
| 4 | Programmer ou publier sur YouTube, Instagram, Facebook, Threads | `INTEGRATIONS-FOURNISSEURS.md` l.529 ; `PLATEFORMES-RESEAUX.md` l.70, 80, 90, 113 | reste humain | YouTube : « access the Service using any automated means ». Les clauses de Meta visent l'accès et la collecte automatisés, pas la publication : non tranché (H6), donc on s'abstient sans autorisation écrite |
| 5 | Répondre aux avis de la fiche d'établissement Google | `PLATEFORMES-RESEAUX.md` l.151 | reste humain | « You must not automate or trigger review replies […] without the user's prior specific and express consent » |
| 6 | Cliquer le consentement de la fenêtre Google (étape 3) | `INTEGRATIONS-FOURNISSEURS.md` l.345-349 | reste humain | consentement personnel ; la documentation d'API demande une confirmation humaine pour tout ce qui exige un consentement (S7) |
| 7 | Demander l'accès « Explorer » de Google Ads (étape 7) | `INTEGRATIONS-FOURNISSEURS.md` l.367-371 | reste humain | l'écran n'est pas relevé (l.369) : un geste non décrit ne se confie pas |
| 8 | Obtenir l'autorisation d'un administrateur Entra, écran « Approbation requise » | `INTEGRATIONS-FOURNISSEURS.md` l.479, 487-488 | reste humain | décision du client ; une session « n'emprunte jamais l'identifiant d'une autre application Microsoft pour passer outre » |
| 9 | Ajouter le connecteur Microsoft 365 et lancer `/login` | `INTEGRATIONS-FOURNISSEURS.md` l.485-486 | reste humain | identifiants de la personne : motif « secret à fournir » de R-29 §1 |
| 10 | Valider l'identité de l'annonceur et le mode de paiement Google Ads | `INTEGRATIONS-FOURNISSEURS.md` l.170, 178 | reste humain | identité légale et paiement : dépense (R-29 §3, R-58 §1) |
| 11 | Retirer une publication fautive d'un service hébergé | `REGLES-PROJET.md` l.679-682 (R-38 §2) | reste humain | suppression : motif `irreversible` de R-58 §1 ; S5 promet un accord avant toute suppression définitive de fichier, et rien d'équivalent dans les passages lus pour un autre geste d'écran |
| 12 | Écran « Branding » et client OAuth « Desktop app » de la console Google Cloud (étapes 4 et 5) | `INTEGRATIONS-FOURNISSEURS.md` l.350-361 | candidat, 2 gestes | aucune clause lue ne l'interdit (S11, H3) ; le fichier JSON du client est un identifiant (l.359) |
| 13 | Télécharger les modèles d'import et le rapport d'erreurs de Google Ads, lire l'écran de l'annonceur | `INTEGRATIONS-FOURNISSEURS.md` l.170, 183-187 | candidat en lecture, 2 gestes | aucune clause lue ne l'interdit (S11, H3) ; le bouton « Appliquer » est exclu : il écrit dans un compte qui dépense |

2 remarques sur les lignes candidates. D'abord, Computer Use plafonne les navigateurs en lecture seule (S6). Ces gestes passent donc par Claude in Chrome, déjà présent au poste. Le fichier `~\.claude\chrome\chrome-native-host.bat` date du 2026-10-12, et le skill `chrome-browser` décrit un outil qui agit « in the person's real Chrome with their own sign-ins ».

Ensuite, la part propre à Computer Use, celle des applications de bureau, ne sert à aucune ligne. Google Ads Editor, seule application de bureau relevée, a rendu 0 campagne importée en 2 essais (`INTEGRATIONS-FOURNISSEURS.md` l.152). L'import web a accepté 191 lignes sur 191 (l.149).

Dispatch n'ajoute aucun geste à cette liste. Il change le lieu d'où l'on déclenche, pas ce qui peut être fait.

### P4 et P5 — Risques et gates

| Risque | Fait documenté | Gate proposé |
|---|---|---|
| Identifiants et données à l'écran | Claude prend des captures et voit « any information visible on your screen » (S4). Claude in Chrome agit avec les connexions existantes de la personne (skill `chrome-browser` l.8). La documentation d'API conseille d'éviter tout accès à des identifiants de connexion (S7) | profil de navigateur dédié, sans banque, santé ni administration (S9) ; aucun `.env`, jeton ni fichier de client OAuth ouvert à l'écran (`CLAUDE.md` l.88 ; `INTEGRATIONS-FOURNISSEURS.md` l.359) |
| Gestes irréversibles | Aucun bac à sable entre Claude et l'écran, et sans les contrôles de permission des autres outils (S5). Envoyer un message ou acheter figure parmi les erreurs difficiles à défaire (S5). L'accord garanti « in any mode » porte sur la suppression définitive de fichiers (S5) | les trois motifs de R-58 §1 (dépense, publication, irréversible) restent humains ; mode « Manually approve » sur tout site ou outil nouveau (S5) |
| Consignes cachées dans une page | « Claude will follow commands found in content even when they conflict with your instructions » (S7). Anthropic écrit qu'un taux de réussite d'attaque de 1 % « still represents meaningful risk » et que le problème est « far from a solved problem » (S8) | tout contenu d'écran est une donnée (`CLAUDE.md` l.87) ; liste blanche de domaines (S7) ; aucune lecture de courriel ni de page tierce pendant un geste d'écran |
| Effets entre applications | Un lien cliqué dans une messagerie s'ouvre dans Chrome sans accord de Chrome (S4). Le skill `computer-use` interdit de cliquer un lien web (l.60) | jamais de clic sur un lien avec l'outil d'écran ; navigation par l'outil navigateur |
| Commande depuis le téléphone | Un message du téléphone déclenche des actions locales ; une consigne manipulée ou un lien d'hameçonnage « could cascade into actions that are difficult or impossible to undo » (S3). Les accords expirent après 30 minutes en session Dispatch (S6) | aucune tâche confiée par Dispatch qui touche un secret, une dépense ou une publication ; chaque mandat consigné au ledger du run |
| Règles d'Anthropic elles-mêmes | La politique d'usage interdit des actions qui « circumvent the guardrails or terms of other platforms or services » (S12, version affichée « Effective November 12, 2026 », postérieure à la lecture) | les lignes 1 à 5 du tableau ci-dessus restent fermées ; relire la version en vigueur à la revue |

La Factory a déjà une forme pour ce cas. R-33 classe la sécurité offensive en voie sur mandat humain, « jamais la voie automatique d'un run », et la présente comme « l'exception explicite et motivée à la loi transverse n°5 » (`REGLES-PROJET.md` l.481-483). Le pilotage d'écran se range de la même façon : une capacité à effet large, qui ne s'exerce pas par défaut.

Un point reste ouvert. Les sessions que Dispatch lance dans Claude Code chargent-elles le `CLAUDE.md` du pilot et ses hooks ? Aucune page lue ne le dit. Tant que ce n'est pas mesuré, aucun run de la Factory ne passe par Dispatch (hypothèse H7).

## 2. Non-recouvrement contre l'existant

Treize existants examinés. Chacun est cité, avec ce qu'il couvre et ce qu'il laisse.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Loi n° 5 du noyau | `CLAUDE.md` l.32 : « L'IA fait, l'humain décide — la voie automatisée (étape de chaîne rejouable) est le défaut » | recouvre le principe ; ne recouvre pas l'écran, que le texte ne nomme pas |
| Loi « voie automatique d'abord », profil utilisateur | `C:\Users\iguan\.claude\CLAUDE.md` l.43-47 : 4 voies, « (1) l'identité de la session […] (4) l'API de la plateforme » | ne recouvre pas : aucune des 4 voies ne pilote un écran |
| Règle R-29 §4 | `REGLES-PROJET.md` l.310-317 : « Ne reste à l'humain que ce qui est refusé sur toutes les voies » | recouvre la règle de fond ; ne recouvre pas la voie écran |
| Régime d'automatisation des 9 réseaux | `references\PLATEFORMES-RESEAUX.md` l.14 : « Partout, un robot ou un script hors interface officielle est interdit ou encadré » | recouvre l'interdit des lignes 1 à 5 : l'écran ne le change pas |
| Contrat LinkedIn | `references\PLATEFORME-LINKEDIN.md` l.32 : « Publier, commenter, réagir, envoyer un message : gestes humains. Aucun script, robot ni extension, quel que soit l'outil » | recouvre : « quel que soit l'outil » ferme aussi le pilotage d'écran |
| Procédure de connexion à Google | `references\INTEGRATIONS-FOURNISSEURS.md` l.350-361 : étapes 4 et 5, « à la console seulement » | recouvre l'inventaire des gestes ; ne recouvre pas leur automatisation par l'écran |
| Mesure de Google Ads Editor | `references\INTEGRATIONS-FOURNISSEURS.md` l.152 : « Editor ne s'automatise pas : 2 essais, 0 campagne importée » | ne recouvre pas : mesure la ligne de commande, jamais un pilotage d'écran |
| Consentement d'administrateur Microsoft | `references\INTEGRATIONS-FOURNISSEURS.md` l.479 : « une session n'emprunte jamais l'identifiant d'une autre application Microsoft pour passer outre » | recouvre : le geste 8 est fermé |
| Retrait d'une publication | `REGLES-PROJET.md` l.679-682 (R-38 §2) : « se retire à la main dans l'interface du service » | recouvre : le retrait reste un geste humain consigné |
| Précédent de voie sur mandat | `REGLES-PROJET.md` l.481-483 (R-33) : « voie sur mandat humain, jamais la voie automatique d'un run » | recouvre la forme du gate proposé ; la matière (sécurité offensive) est autre |
| Skill `computer-use` | `~\.claude\skills\synced\43c87242-3a52-4c70-9975-2862c2cc2848_08d81279-f396-431e-823f-4fb533b87824\computer-use\SKILL.md` l.46-54 (niveaux), l.60 (« Never click web links »), l.67 (finance) | recouvre le mode d'emploi de l'outil ; ne recouvre pas la doctrine de la Factory |
| Skill `chrome-browser` et pont installé | même dossier `…\chrome-browser\SKILL.md` l.8-10, l.32-34 ; `~\.claude\chrome\chrome-native-host.bat` (2026-10-12) | recouvre la capacité d'agir dans Chrome ; ne recouvre pas la règle d'emploi par la Factory |
| Registre, forges, skills du pilot | `grep -rIl -i -E "claude-in-chrome\|computer[- ]use\|mcp__computer"` sur les 13 forges `digit-ai-forge-*` : 0 fichier ; sur le pilot, une seule occurrence, la bibliographie de `output\03-etudes\2026-08\20260814-etude-opportunite-pans-tests-prompts.md` l.67 | ne recouvre pas : aucune doctrine, aucun oracle, aucune candidature n'existe sur la voie écran |

## 3. État de l'art daté

Douze sources primaires, lues le 2026-10-19. Les citations ont été relues au texte brut des pages (téléchargées puis nettoyées), sauf mention contraire, comme l'exige R-59.

- **S1 — Anthropic, billet « Put Claude to work on your computer »**, 2026-03-23, `claude.com/blog/dispatch-and-computer-use` : Computer Use en aperçu de recherche pour Pro et Max, macOS et Windows ; Dispatch confie des tâches depuis le téléphone.
- **S2 — Anthropic, notes de version du centre d'aide**, entrées du 2026-03-17, du 2026-03-23 et du 2026-07-07, `support.claude.com/en/articles/12138966-release-notes` : fil persistant, Computer Use dans Cowork et Claude Code, Cowork sur le web et le mobile.
- **S3 — Anthropic, aide « Assign tasks from anywhere in Claude Cowork »**, page marquée « Updated this week », sans date, `support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork` : « Dispatch isn't available to new users » ; ordinateur éveillé et application ouverte ; mise en garde sur les liens d'hameçonnage.
- **S4 — Anthropic, aide « Let Claude use your computer in Cowork »**, page « Updated this week », `support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork` : bêta Pro et Max, liste de blocage, effets entre applications.
- **S5 — Anthropic, aide « Use Claude Cowork safely »**, page « Updated this week », `support.claude.com/en/articles/13364135-use-claude-cowork-safely` : « computer use has no sandbox between Claude and what's on your screen » ; achats et messages difficiles à défaire.
- **S6 — Claude Code, documentation « Desktop application »**, sections « Computer use » et « Dispatch », sans date, `code.claude.com/docs/en/desktop` : désactivé par défaut, trois niveaux par catégorie d'application, accords de 30 minutes sous Dispatch. Page lue au texte brut, 134 000 caractères de texte nettoyé.
- **S7 — Anthropic, documentation de l'API « Computer use tool »**, sans date, `platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool` : outil `computer_toolset_20260801`, précautions de sécurité, confirmation humaine des transactions financières.
- **S8 — Anthropic, recherche sur l'injection de consignes dans l'usage du navigateur**, 2025-11-24, `anthropic.com/research/prompt-injection-defenses` : 1 % de réussite d'attaque avec protections, « far from a solved problem ».
- **S9 — Anthropic, aide « Use Claude in Chrome safely »**, « Updated over 2 weeks ago », sans date, `support.claude.com/en/articles/12902428-use-claude-in-chrome-safely` : profil de navigateur séparé, aucun filtrage du contenu sensible à l'écran. Lue par l'outil de lecture web résumée, citations non relues au texte brut.
- **S10 — Conditions de LinkedIn et de TikTok**, 2025-11-03 et 2026-07-15, `linkedin.com/legal/user-agreement` §8.2 et `tiktok.com/legal/page/us/terms-of-service/en` §3.4 : interdiction des méthodes automatisées et des « bots ».
- **S11 — Conditions de Google**, en vigueur le 2026-07-30, `policies.google.com/terms` : l'accès par moyens automatisés est interdit « in violation of the machine-readable instructions on our web pages ». La clause vise les robots d'exploration ; elle ne dit rien d'un pilotage d'écran par le titulaire du compte.
- **S12 — Anthropic, politique d'usage**, page affichant « Effective November 12, 2026 », soit 2026-11-12, `anthropic.com/legal/aup` : interdit des actions qui contournent « the guardrails or terms of other platforms or services ». La date est postérieure à la lecture : la version en vigueur aujourd'hui n'a pas été relue.

## 4. Options — jeu fermé O0-O4

Chaque option dit son contenu, son coût et ce qu'elle exclut. Aucune n'est mesurée en minutes gagnées : la mesure n'existe pas.

- **O0 — ne rien faire.** Réfutée, faiblement. Le statu quo n'a coûté aucun incident : le registre et les forges ne contiennent aucune occurrence de la voie écran. Mais la loi n° 5 dit que « tout ce qui peut être fait automatiquement est fait par la session ». La session dispose déjà des outils d'écran : skills `computer-use` et `chrome-browser`, pont Chrome installé le 2026-10-12. Un texte qui pousse à tout automatiser et un contrat LinkedIn qui l'interdit se contredisent tant que la voie n'est pas nommée. Coût du statu quo : un risque de clause violée, non mesuré.
- **O1 — écrire la limite, sans rien activer.** Contenu : une section « Pilotage d'écran » dans `references\INTEGRATIONS-FOURNISSEURS.md`. Elle reprend le tableau des 13 gestes avec sa date et son mode de rejeu (loi n° 4). S'y ajoute une phrase en R-29 §4, qui range le pilotage d'écran en voie sur mandat humain, sur le modèle de R-33. Coût : simple × court. Exclut : tout essai, toute installation, tout gain de geste. Rattachée à P2, P3 et P5.
- **O2 — un essai borné en lecture seule.** Contenu : une session, sur mandat, avec Claude in Chrome dans un profil dédié, sur le geste 13 (lecture de l'écran de l'annonceur) ou le geste 12. La mesure compte les gestes retirés sur 4, les minutes, les reprises humaines et les incidents. Coût : moyen × court. Exclut : les réseaux, Entra, Dispatch. Rattachée à P2 et P4. Elle demande que vous soyez connecté à Google dans le profil, donc un secret dans le navigateur.
- **O3 — un objet durable.** Contenu : un skill ou un gabarit « voie écran », un oracle de portée qui refuse les 9 réseaux et Entra, un hook de mandat. Coût : complexe × moyen. Exclut : la sobriété. Rattachée à P4 et P5. Prématurée : aucun usage n'est mesuré, et la procédure de connexion Google a déjà écarté son skill faute de connexion à suivre (`INTEGRATIONS-FOURNISSEURS.md` l.431).
- **O4 — adopter Dispatch comme canal de commande des runs.** Contenu : confier des tâches de la Factory depuis le téléphone, et recevoir les GO par notification. Coût : complexe × moyen. Exclut : la prudence de O1. Rattachée à P1, P4 et P5. Bloquée : Dispatch est fermé aux nouveaux utilisateurs (S3), sans Team ni Enterprise (S6), et le chargement des règles du pilot dans une session lancée par Dispatch n'est pas établi (H7).

## 5. Verdict

- **Option retenue** : O1.
- **Pourquoi O1** : la seule chose établie par les faits lus est une limite, pas un gain. 11 gestes sur 13 sont fermés par une clause, un consentement, une dépense ou un irréversible. Les 2 lignes ouvertes regroupent 4 gestes rares : la connexion Google s'est faite une fois, et aucune n'a encore suivi la procédure (`INTEGRATIONS-FOURNISSEURS.md` l.438). Écrire la limite coûte une section et empêche qu'une session applique la loi n° 5 contre le contrat d'un réseau.
- **Pourquoi pas O2 maintenant** : l'essai demande un secret dans un navigateur et aucune connexion n'est prévue. Il se rouvre à la prochaine, si vous êtes utilisateur existant de Dispatch ou si le geste se fait sans lui.
- **Coût** : simple × court. Une section de référentiel périssable et une phrase de doctrine, quelques milliers de jetons. Dette : les pages d'Anthropic changent de libellé d'une semaine à l'autre, la section se relit avec le référentiel des plateformes.
- **Candidature(s) émise(s)** : candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 4, effort 1. Objet : section « Pilotage d'écran » au référentiel des fournisseurs et phrase de R-29 §4 (voie sur mandat). Le tri notait un gain de 3 ; l'étude le ramène à 2, car aucun gain de geste n'est établi. La décision de doctrine reste la vôtre (motif `doctrine`, R-58 §1).
- **Plan de revue** : 2026-12-02, date de péremption de `references\PLATEFORMES-RESEAUX.md`. Critères écrits d'avance : les clauses des lignes 1 à 5 sont inchangées ; Dispatch est ou non rouvert aux nouveaux utilisateurs ; la politique d'usage d'Anthropic en vigueur est relue. Si une connexion Google a eu lieu avant cette date, O2 se joue à ce moment.
- **Test rétro** :
  - *Opération → Tactique* : la section de référentiel répond à P2 et P3 par ses 13 lignes ; la phrase de R-29 répond à P4 et P5 par le gate sur mandat.
  - *Tactique → Stratégie* : la loi n° 5 veut que la session fasse tout ce qui peut l'être et laisse à l'humain la décision, la dépense et l'irréversible. Nommer la voie écran et ses interdits applique cette loi à une voie qu'elle ne listait pas.
  - *Stratégie → Intention* : vous vouliez décider entre rien, un essai et un objet durable, sur des faits. La réponse est un objet léger (un texte), pas d'essai maintenant, un essai conditionnel daté.
  - *Questions rejouées* : « Que sont Computer Use et Dispatch, à quelle date ? » — P1, avec les dates 2026-03-17, 2026-03-23 et 2026-07-07. « Quels gestes deviennent automatiques, lesquels restent interdits ? » — le tableau de P2 et P3 : 2 lignes candidates, 11 fermées. « Quels risques et quels gates ? » — le tableau de P4 et P5, plus la voie sur mandat.
  - *Rupture constatée* : le gain en minutes n'est pas mesuré, et l'état de votre poste (H2) n'a pas pu être lu. Les deux sont déclarés, pas comblés.

Hypothèses non résolues :
- H1 : lecture de l'intention non validée mot à mot.
- H2 : activation de Computer Use et statut d'utilisateur de Dispatch au poste.
- H3 : conditions propres à la console Google Cloud et à Google Ads non lues.
- H4 : date de la vidéo déduite de son identifiant.
- H5 : gain en minutes non mesuré.
- H6 : clauses de Meta non tranchées pour la publication.
- H7 : règles du pilot dans une session lancée par Dispatch.
