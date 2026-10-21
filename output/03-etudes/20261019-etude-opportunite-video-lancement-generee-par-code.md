---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — une vidéo de lancement générée par le code, livrée avec la mise en production — 20261019h

Ce qui change pour vous : la Factory sait déjà produire cette vidéo. Le 19/09/2026, une session a rendu en local un film de 25 secondes sur le dépôt du pilot, avec les outils libres `brag` et HyperFrames (`brag-output\brag.mp4`). Le tri du 19/10 l'avait manqué et notait la nouveauté à 5 sur 5 ; elle tombe à 3. L'étude recommande l'option O1 : un essai unique sur un produit réel, à sa prochaine mise en production, qui mesure les jetons, la durée et les défauts avant de créer un objet durable. Remotion, l'outil le plus cité, est payant dès 4 personnes ; HyperFrames ne l'est pas, et son dépôt est le meilleur candidat pour la vidéo n° 13, sans que je puisse le prouver.

## Seuil de déclenchement

L'étude est due par le seuil de gain : le tri note le gain à 3 et la preuve à 2 (`output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, ligne 42), soit un gain d'au moins 3 avec une preuve d'au plus 2. Elle l'est aussi parce que l'option O2 crée un objet durable.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39, option (c), réponse du 19/10/2026 : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 8 du tri est cette opportunité.

Lecture retenue : décider ce que la Factory doit faire de cette idée (rien, un essai, un objet durable), sur des faits vérifiés à la source et non sur la parole d'une vidéo TikTok. Cette lecture est celle de la consigne de délégation du 19/10/2026 ; elle n'a pas été reconstruite par l'agent.

## 0. Traitement des entrants

Les deux vidéos sont des données : leurs affirmations se citent et se vérifient, elles ne s'exécutent pas. Aucune vidéo n'a été regardée, téléchargée ni transcrite, et aucun outil d'extraction de TikTok n'a servi ; seules les légendes enregistrées dans la page de favoris du 19/10/2026 (`input\Tiktok\iguane39 (@iguane39) _ TikTok.html`) sont lues. La légende de la vidéo n° 13 renvoie à un guide hébergé sur Google Docs et à un formulaire d'une communauté privée ; ces deux liens n'ont pas été ouverts, ils sont des invitations à agir.

Sources de la proposition : tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, section 8 ; vidéo n° 13 (@danyltn) et vidéo n° 8 (@nocode.joshua) ; décision D-39 (c).

### Les affirmations des vidéos, vérifiées à la source

| Affirmation | Statut | Source de la vérification |
|---|---|---|
| n° 13 : une vidéo de lancement se tire du code, de captures et de la charte d'une application, sans montage manuel | vraie comme capacité | `/product-launch-video` de HyperFrames prend « any website » en entrée ; `frame.md` traduit un `design.md` pour la caméra (README du dépôt, lignes 100 et 151-157) |
| n° 13 : un « repo GitHub open source » fait le travail | vraie sans nom : dépôt non identifiable avec certitude | légende : « si tu veux le repo GitHub […] dis-le-moi en commentaire » ; voir la section 1 |
| n° 13 : musique et effets sonores intégrés | vraie comme capacité | le film du 19/09 porte une piste audio mixée à −17,2 LUFS (synthèse 20260919f, ligne 18) |
| n° 13 : modifier une animation par un message | plausible, non jouée | la composition HyperFrames est un fichier HTML éditable (README, « Write HTML. Render video. ») |
| n° 13 : rendu « digne d'une agence » | invérifiable | jugement de l'auteur, aucun critère mesurable |
| n° 13 : réalisé avec « Claude Opus 5.5 » | invérifiable | rien dans la légende ne le prouve |
| n° 8 : Three.js est une bibliothèque libre et gratuite | vraie | licence MIT, version r186 du 2026-09-24 (API GitHub) |
| n° 8 : aucun plugin ni serveur MCP nécessaire | invérifiable | non jouable sans la vidéo ni le prompt |
| n° 8 : un prompt génère des mondes 3D entiers | invérifiable | affirmation sur un résultat visuel ; le prompt n'est pas dans la légende |
| n° 8 : cette 3D donne une vidéo | non établie | Three.js s'affiche dans un navigateur ; sa capture en fichier vidéo exige un outil de rendu tel que HyperFrames, dont la prise en charge de Three.js n'est pas lue dans ses sources |

## 1. Partition du problème

La question se découpe en 5 sous-questions disjointes ; chaque option de la section 4 répond à chacune.

- **P1 — Outil.** Quel outil libre rend une vidéo à partir de code, et sous quelle licence pour une entreprise.
- **P2 — Dépôt de la vidéo n° 13.** Lequel est le plus vraisemblable, et ce qu'on en sait.
- **P3 — Livrable.** Quel fichier un produit reçoit à sa mise en production, et ce qui le distingue du film du 19/09.
- **P4 — Porteur.** Quelle forge ou quelle étape le tient.
- **P5 — Contrôle et coût.** Quel oracle juge le livrable, et ce qu'il coûte.

### P1 — Les outils, mesurés au 19/10/2026

| Outil | Principe | Licence | Dernière version | Étoiles |
|---|---|---|---|---|
| HyperFrames (HeyGen) | HTML, CSS et animations cherchables, rendus image par image dans Chrome sans écran, encodés par FFmpeg | Apache-2.0, « no per-render fees or commercial-use thresholds » | v0.8.175, 2026-10-19 | 67 352 |
| `brag` (latent-spaces) | compétence d'agent qui prépare le récit et confie le rendu à HyperFrames | MIT | dernier envoi 2026-10-13 | 16 890 |
| Remotion | composants React rendus dans Chrome sans écran | Remotion License : gratuite jusqu'à 3 personnes, licence d'entreprise au-delà | v4.0.536, 2026-10-16 | 65 233 |
| Motion Canvas | bibliothèque TypeScript d'animations vectorielles et éditeur ; conçu pour synchroniser une voix off | MIT | v3.17.2, 2024-12-14 ; dernier envoi 2026-07-02 | 19 392 |
| Three.js | bibliothèque 3D pour le navigateur ; ne rend pas de fichier vidéo à elle seule | MIT | r186, 2026-09-24 | 116 624 |

Les étoiles, licences et dates viennent de l'API GitHub interrogée le 2026-10-19 (`gh api repos/<dépôt>`), sauf la licence de Remotion, lue dans son fichier `LICENSE.md`.

La licence de Remotion, lue à la source : gratuite pour « an individual », « a for-profit organization with up to 3 employees », une association à but non lucratif, ou une évaluation sans usage commercial. Au-delà, « a Company License is required ». La page de prix (`remotion.pro/license`) affiche 25 dollars par mois et par siège pour l'offre « Creators », et 0,01 dollar par rendu avec un minimum de 100 dollars par mois pour l'offre « Automators ». Elle ne porte pas de date d'application. La FAQ précise que les sous-traitants et un studio extérieur comptent dans l'effectif. Un projet de licence pour Remotion 5.0 (demande de fusion n° 3750) est ouvert, non fusionné au 19/10/2026 ; il compterait explicitement les sous-traitants. L'effectif qui s'appliquerait à un produit de la Factory dépend du client final et n'est établi dans aucune source lue : c'est une hypothèse non résolue.

### P2 — Le dépôt de la vidéo n° 13

Le dépôt n'est pas nommé : la légende l'offre contre un commentaire. Aucun outil n'a ouvert le guide ni la vidéo, et une réponse certaine n'est pas vérifiable. Trois candidats correspondent à la description « tu fournis code, captures, identité visuelle ou URL, l'IA orchestre direction artistique, motion design et son » :

- HyperFrames, parce que son README décrit `/product-launch-video` à partir d'un site, `frame.md` pour la charte, la musique et le rendu local ;
- `brag`, parce qu'il enchaîne récit, musique et rendu en une commande, ce que la légende décrit en 4 volets (direction artistique, mouvement, son, assemblage) ;
- Remotion avec ses compétences d'agent (`npx remotion skills add`, page `remotion.dev/docs/ai/claude-code`), le plus connu mais non gratuit en entreprise.

Le plus vraisemblable est HyperFrames ou `brag` qui s'appuie dessus, parce que les deux couvrent les 4 volets et sont libres et gratuits, ce que la légende souligne (« open source »). Cette estimation repose sur la légende seule et reste une hypothèse.

## 2. Non-recouvrement contre l'existant

Cinq éléments de l'existant touchent à l'objet ; chacun est cité, avec ce qu'il couvre et ce qu'il laisse.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Forges `digit-ai-forge-*` (13 dépôts) | recherche de `hyperframes`, `remotion` dans les `.md`, `.mjs`, `.json`, `.jsonl`, `.html` des 13 forges : 0 fichier ; les 4 fichiers du pilot qui répondent sont `brag-output\composition-brief.md`, `brag-output\CREDITS.md`, `output\03-etudes\2026-08\20260816-etude-skills-animation-motion.md` et la synthèse 20260919f | ne recouvre pas : aucune forge ne livre de vidéo, ce que dit le tri |
| Film du pilot du 19/09/2026 | `output\04-plans\2026-09\Digit-AI - Synthese Video - Film de 25 secondes sur depot factory rendu local - 20260919f.md`, ligne 18 : « 1 vidéo rendue : 25,000 s, 1920×1080 […] gate `hyperframes check` passé (0 erreur […] 52/52 contrôles de contraste AA) » ; `brag-output\CREDITS.md` : `brag` MIT, HyperFrames 0.8.50 Apache-2.0 | recouvre le moyen (outil, gate technique, rendu local) ; ne recouvre pas le livrable de produit : le film présente le pilot, hors run, hors forge, hors MEP (ligne 11 : « aucune forge mobilisée, aucun ledger ouvert ») |
| Étape MEP et dossier de GO | `ETAPE-MEP.md`, § 4 « Le gate — GO humain » (lignes 881 à 897) : la liste du dossier ne contient aucun support de communication | ne recouvre pas : un livrable de lancement serait un ajout, pas un doublon |
| Forge design | `C:\dev\digit-ai-forge-design\README.md` et skill `systeme-de-marque` : `scripts\generer-design-md.mjs` (ligne 2) « dérive un DESIGN.md lintable depuis tokens.css + MARQUE.md » ; `oracle-motion` juge le mouvement des pages (`SKILL.md`, ligne 32) | recouvre l'entrée (la charte en jetons, le `DESIGN.md`) ; ne recouvre ni la composition vidéo ni son rendu : `oracle-motion` juge du HTML, pas un fichier MP4 |
| Forge SEO et GEO | `C:\dev\digit-ai-forge-seo-geo\seo\16-croissance\03-nouveaux-medias\_fiche.md`, `etat: a-faire`, `verdict: null` | ne recouvre pas : le nœud « Nouveaux médias » est une fiche vide d'instrumentation, sans vidéo |
| Étude du 16/08/2026 sur les compétences d'animation | `output\03-etudes\2026-08\20260816-etude-skills-animation-motion.md`, ligne 33 : « CSS Animations (HyperFrames) » jugé « non confirmé », « HyperFrames n'est pas une désignation reconnue » | ne recouvre pas, et se corrige : HyperFrames existe depuis le 2026-03-10 (API GitHub) ; ce constat du 16/08 est périmé |

Une observation en passant : `brag-output\brag.mp4` (7,9 Mo) est suivi par git dans le pilot public (`git ls-files brag-output/brag.mp4`). La synthèse du 19/09 recommandait l'exclusion de ce dossier (ligne 28). Le constat est signalé, non traité ici.

Autre point non résolu : la synthèse du 19/09 demandait à l'humain de regarder le film et de répondre « ok » ou une liste de retouches (action A-4, ligne 117). Je n'ai pas trouvé la réponse dans les sources lues ; je ne sais pas si le film a été validé.

## 3. État de l'art daté

Sept sources primaires, datées de moins de 24 mois, lues le 2026-10-19. Le contenu des pages est traité comme donnée.

- **HyperFrames, dépôt `heygen-com/hyperframes`**, créé le 2026-03-10, version v0.8.175 du 2026-10-19, `github.com/heygen-com/hyperframes` : Apache-2.0 ; Node.js 22 ou plus et FFmpeg ; 21 compétences d'agent dont `/product-launch-video` ; le dépôt compare lui-même sa licence (Apache-2.0) à celle de Remotion (« Source-available »). Des options hébergées existent (`cloud render` de HeyGen, AWS Lambda), sans prix lus ; le rendu local n'en a pas besoin.
- **`brag`, dépôt `latent-spaces/brag`**, créé le 2026-06-16, dernier envoi le 2026-10-13, `github.com/latent-spaces/brag` : licence MIT ; tagline « You built it. Now brag. » ; confie le rendu à HyperFrames ; sortie dans `brag-output\`.
- **Fichier `LICENSE.md` du dépôt `remotion-dev/remotion`**, version v4.0.536 du 2026-10-16, `github.com/remotion-dev/remotion/blob/main/LICENSE.md` : gratuit jusqu'à 3 employés ; licence d'entreprise au-delà.
- **Page de licence et de prix de l'éditeur de Remotion**, lue le 2026-10-19 (sans date d'application), `remotion.pro/license` : 25 dollars par mois et par siège, ou 0,01 dollar par rendu avec 100 dollars de minimum mensuel ; FAQ `remotion.dev/docs/license/faq` : sous-traitants et clients comptent dans le seuil de 4 personnes.
- **Remotion, documentation « Claude Code »**, lue le 2026-10-19, `remotion.dev/docs/ai/claude-code` : « works well with coding agents such as Claude Code » ; installation par `npx remotion skills add`.
- **Motion Canvas, dépôt `motion-canvas/motion-canvas`**, v3.17.2 du 2024-12-14, dernier envoi le 2026-07-02, `github.com/motion-canvas/motion-canvas` : MIT ; « informative vector animations » synchronisées avec une voix off ; dernière version publiée il y a 22 mois.
- **Three.js, dépôt `mrdoob/three.js`**, r186 du 2026-09-24, `github.com/mrdoob/three.js` : MIT ; bibliothèque 3D, sans export vidéo propre.

Source interne pour la mesure de coût : synthèse 20260919f (2026-09-19), `output\04-plans\2026-09\`, lignes 13, 18 et 54-61 : durée de la session mesurée à 20 minutes au moins, rendu en 30 secondes selon la ligne 83, aucun envoi externe.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée, de justesse.
  - Le statu quo laisse un film unique, tourné par un agent sur le dépôt qu'il connaissait, sans trace de sa validation et sans mesure en jetons. Il laisse aussi un défaut de la connaissance : le tri l'a jugé neuf à tort.
  - Coût du statu quo : l'outil de rendu reste à reconstruire à chaque demande, FFmpeg ayant été posé dans un dossier temporaire « qui disparaîtra » (synthèse 20260919f, ligne 104). Ce coût est faible, et c'est la raison pour laquelle O0 n'est pas écartée à la légère : aucun produit n'a demandé de vidéo.
- **O1 — un essai unique sur un produit réel, sans objet durable.** À la prochaine mise en production, après l'accord de l'humain, une session produit la vidéo du produit avec `brag` et HyperFrames depuis un clone temporaire, à partir de son `DESIGN.md` et de son URL de staging.
  - Elle mesure les jetons, la durée de session, le nombre de défauts relevés par `hyperframes check`, et l'écart entre la composition et les sources du produit.
  - Coût : simple × court. Exclut : toute création de gabarit, de skill ou d'oracle avant la mesure.
- **O2 — un livrable « vidéo de lancement » dans forge-design.** Un gabarit de brief dérivé du `DESIGN.md`, une procédure `brag` ou HyperFrames, et un oracle de vidéo (section 5).
  - Coût : moyen × moyen. Exclut : la mesure préalable ; le gabarit serait écrit avant d'avoir un second film.
- **O3 — une ligne optionnelle dans `ETAPE-MEP.md` et dans `DOSSIER-MEP.md`.** La vidéo devient un support de lancement proposé à chaque MEP, en plus des portes M-1 à M-18.
  - Coût : moyen × moyen, et il touche le noyau du pilot. Exclut : l'indépendance de la MEP vis-à-vis de la communication. Le dossier de GO juge un déploiement ; une vidéo ne conditionne aucun GO.
- **O4 — adopter Remotion comme moteur.** Écartée d'avance.
  - Coût : moyen × moyen, plus une licence d'entreprise dès 4 personnes, comptées avec les sous-traitants et le client selon la FAQ. Exclut : le gratuit pour tout produit dont l'effectif dépasse 3 ; HyperFrames fait le même rendu (Chrome sans écran et FFmpeg, comparaison du README) sans seuil.

## 5. Verdict

Une seule option est retenue, celle qui ne crée rien avant d'avoir un second film à comparer au premier.

- **Option retenue** : O1.
- **Pourquoi O1 et pas O2** : le seul film existant a été produit par la session qui connaissait le dépôt, sans mesure de jetons ni validation connue. Un gabarit écrit sur un cas unique fige ses hypothèses. **Pourquoi pas O3** : la vidéo n'est pas une porte ; l'ajouter au noyau coûte plus qu'elle ne rapporte avant la preuve. **Pourquoi pas O4** : la licence.
- **Coût** : simple × court pour l'essai, avec un prérequis hors Factory : FFmpeg est absent du chemin du poste (`where ffmpeg` sans résultat le 2026-10-19) alors que Node v24.16.0 convient ; son installation est une dépense de poste à demander, non faite ici. Jetons : non mesurés au 19/09, à relever pendant l'essai.
- **Candidature(s) émise(s)** : candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 3, preuve 4, effort 1. Libellé proposé : « essai unique de vidéo de lancement d'un produit à sa prochaine MEP, avec `brag` et HyperFrames, mesuré en jetons, durée et défauts ; aucun objet durable avant la mesure ». Je n'écris pas au registre.
- **Plan de revue** : 2026-12-15, ou à la première mise en production d'un produit si elle survient avant. Critères écrits d'avance : jetons et durée de l'essai ; nombre de défauts levés par les contrôles ; avis de l'humain sur le film. Si l'essai tient en simple × court et que l'humain valide le film, O2 s'instruit avec ses chiffres.
- **Livrable, porteur, oracle si O2 est décidé plus tard** :
  - Livrable : un fichier MP4 de 15 à 25 secondes, son brief de composition et sa fiche de crédits, rangés chez le produit, jamais publiés sans GO humain (R-38).
  - Porteur : forge-design, qui tient déjà `DESIGN.md`, les jetons et l'oracle de mouvement. La publication reste un geste humain, et le post-MEP revient à forge-seo-geo sur mandat.
  - Oracle, en 4 contrôles exécutables : `hyperframes check` (gabarit, exécution, mise en page, contraste AA) ; une sonde du fichier produit (durée, taille d'image, codec, présence de la piste audio, niveau sonore) ; l'inclusion des couleurs de la composition dans les jetons du produit ; l'inclusion de chaque nombre affiché dans les sources du produit. Le troisième contrôle est réalisable : la composition du 19/09 porte 10 couleurs distinctes (`brag-output\composition\index.html`, lignes 21-24) dont 9 se retrouvent dans le socle de pages ou les skills de forge-design (relevé du 19/10) ; la dixième est un rouge d'alerte non retrouvé dans ces fichiers. Ce que l'oracle ne juge pas : le rythme, le propos et l'effet sur un spectateur ; c'est le GO de l'humain.
- **Test rétro** :
  - *Opération → Tactique* : l'essai, la mesure en jetons, durée et défauts, et l'absence d'objet durable répondent à P3 et P5 ; le choix d'outil répond à P1 (licence), et le dépôt probable à P2, déclaré hypothèse.
  - *Tactique → Stratégie* : savoir si une vidéo de lancement est un livrable de produit en s'appuyant sur un second cas, sans engager le noyau ni une licence.
  - *Stratégie → Intention* : vous vouliez décider ce que la Factory fait de cette idée, sur des faits. La réponse est un essai : un film existe déjà, la licence de l'outil libre est lue, la valeur pour un produit n'est pas mesurée.
  - *Questions rejouées* : « quels outils libres produisent une vidéo depuis du code ? » — HyperFrames, `brag`, Motion Canvas, Three.js (sans export vidéo seul), Remotion (payant dès 4 personnes) ; « lequel est le dépôt de la vidéo n° 13 ? » — vraisemblablement HyperFrames ou `brag`, non vérifiable ; « quel livrable, dans quelle forge, à quel coût, quel oracle ? » — MP4 chez le produit, forge-design, simple × court l'essai et moyen × moyen l'objet, 4 contrôles listés.
  - *Rupture constatée* : le tri du 19/10 jugeait la nouveauté à 5 ; l'existant du 19/09 la ramène à 3. Corrigée ici : gain 3, nouveauté 3, preuve 4, coût inverse 3, soit 16 sur 25 comme au tri, avec une preuve plus forte et une nouveauté plus faible.
