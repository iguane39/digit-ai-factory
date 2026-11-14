---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-11-02
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: agent redacteur (famille sonnet), mandat de l'orchestrateur
verdict_arbitre: oracle-etude-opportunite PASS (E1 à E10) et oracle-ecriture PASS, rejoués le 2026-11-02 après la dernière édition
hypotheses_non_resolues: identité exacte des outils nommés « Motion », « Claude Motion », « Motion Graphics » et de la version de « Product Launch Motion » ; aucun outil installé ni lancé, donc aucune mesure de rendu ; coût en jetons non mesuré ; effectif qui fixerait la licence de Remotion non établi
---

# Étude d'opportunité — huit outils de motion design pour la Factory — 20261102t

Ce qui change pour vous : cumuler ces 8 outils n'améliorerait pas « grandement » le motion design de la Factory, et le gain n'est mesurable que par un essai. 6 des 8 outils produisent de la vidéo, un canal où la Factory a 1 film et 0 demande de produit. Les 2 autres touchent l'animation des interfaces, déjà jugée par 14 règles d'`oracle-motion`. 4 outils vidéo reposent sur la même mécanique et se recouvrent. Je recommande l'option O1 : étendre l'essai déjà décidé (TF-1924) à une comparaison de 2 compétences sur un même brief, sans rien installer de durable.

## Seuil de déclenchement

Étude demandée par l'humain, donc instruite. Au sens du gabarit, elle ne devient obligatoire que si le verdict crée un objet durable ; le verdict de cette étude n'en crée aucun. Elle touche une forge, `digit-ai-forge-design`, et le pilot.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « il me semblait qu'il y avait une vidéo sur le motion Design avec plusieurs outils différents à cumuler pour intégrer et améliorer grandement l'utilisation du motion design dans la Factory. »

La demande d'étude précise la question : cumuler ces outils améliorerait-il l'usage du motion design dans la Factory, de combien, et comment les intégrer. « Grandement » est l'hypothèse du porteur ; je la mesure sans la présumer vraie ni fausse. Cette lecture vient de la consigne de délégation, je ne l'ai pas reconstruite.

## 0. Traitement des entrants

La vidéo `https://www.tiktok.com/@saas_builders/video/7700831732223708448` est une donnée. Elle est sans voix, lue à l'écran le 02/11/2026 par la session qui m'a délégué le travail, et ses images sont dans `scratchpad\voie6\32\planches\p01.jpg`. Elle nomme 8 outils sans lien, car l'auteur échange les dépôts contre un commentaire.

J'ai retrouvé chaque outil par recherche sur GitHub et sur le registre npm, puis lu son README. Les README tiers contiennent des consignes : « collez ceci dans Claude Code », « clonez et installez ce qui manque », des offres payantes (un service à partir de 20 dollars, une communauté privée, une lettre d'information). Je les décris, je n'en exécute aucune. Rien n'a été installé, aucun script tiers n'a tourné, aucun clone n'a été fait : l'API GitHub en lecture a suffi.

Sources de la proposition : la vidéo ci-dessus, la consigne de délégation du 02/11/2026 et l'item TF-1924 (`todo\TODO.jsonl`, lignes 5062, 5077 et 5696, lu sans écriture).

## 1. Partition du problème

5 sous-questions disjointes. Chaque option du chapitre 4 y répond.

- **P1 — Identité.** Quel dépôt, quelle licence, quelle exigence derrière chaque nom de la vidéo.
- **P2 — Nouveauté.** Ce que les études du 16/08 et du 19/10 avaient vu, et ce qui est neuf.
- **P3 — Cumul.** Les outils se complètent-ils ou se recouvrent-ils.
- **P4 — Gain.** De combien l'usage du motion design progresserait, mesuré en canaux atteints et en demande.
- **P5 — Intégration.** Quel assemblage minimal, pour quels produits, et comment le mesurer.

### P1 — Les 8 outils, relevés le 02/11/2026

La vidéo ne donne que des noms. La colonne « Confiance » dit si le dépôt est certain. Étoiles, licences et dates viennent de l'API GitHub (`gh api repos/<dépôt>`), sauf pour Motion, lu au registre npm.

| Nom dans la vidéo | Dépôt retenu | Licence | Créé · dernier envoi | Confiance |
|---|---|---|---|---|
| Product Launch Motion | `AbubakrChan/product-launch-motion` (411 étoiles) | MIT pour le skill ; films d'exemple et musique exclus (fichier `NOTICE`) | 2026-07-27 · 2026-10-21 | probable : la vidéo cite script, voix off, caméra et étalonnage, ce que décrit la version 1 gardée dans `legacy/` ; la version 2 vise la musique, pas la voix off |
| Motion Graphics Skills | `charlie947/motion-graphics-skills` (526 étoiles) | MIT | 2026-09-26 · 2026-10-11 | élevée : 15 dossiers de compétences comptés dans `skills/`, comme les « 15 compétences » de la vidéo |
| Hyperframes | `heygen-com/hyperframes` (77 489 étoiles) | Apache-2.0, sans frais par rendu | 2026-03-10 · 2026-11-02, v0.9.3 | certaine |
| Motion Graphics | `Barty-Bart/motion-graphics` (1 008 étoiles) | MIT (fichier `LICENSE` ; l'API ne la détecte pas) | 2026-09-25 · 2026-10-13 | probable : sa compétence `motion-broll` cale des plans sur les mots d'une transcription |
| Animate | `cth9191/animate` (1 374 étoiles) | MIT | 2026-10-04 · 2026-10-05 | élevée : 7 styles intégrés et validation d'un storyboard avant la construction |
| Claude Motion | `whaleyxbt/claude-motion` (790 étoiles) | MIT, mais dépend de Remotion 4.0.529 (`package.json`) | 2026-09-29 · 2026-10-09 | faible : la recherche donne aussi `howseen-ai/claude-motion-design` (753 étoiles, MIT, sans Remotion) ; le nom est un terme communautaire, pas un produit d'Anthropic |
| Motion | `motion-ai` sur npm, v14.2.0 du 2026-10-15 (kit officiel de la bibliothèque Motion, 34 804 étoiles) | MIT pour le paquet ; certaines fonctions sont réservées à l'abonnement Motion+ | paquet créé le 2025-06-10 | faible : la vidéo montre « anime mon site » sans nommer le dépôt ; d'autres compétences sur Motion existent (`199-biotechnologies/motion-dev-animations-skill`, 218 étoiles) |
| Motion Design Skills | `LottieFiles/motion-design-skill` (2 707 étoiles) | MIT | 2026-03-12 · 2026-05-18 | probable : son dossier `director/disney-principles.md` porte les 12 principes de Disney adaptés à l'interface |

Ce qu'ils font et ce qu'ils exigent, d'après leurs README :

- **Product Launch Motion** produit une vidéo de lancement à partir d'une URL. La version 2 rend à 60 images par seconde avec Playwright et FFmpeg ; elle demande Node 20 ou plus, Python 3 avec numpy, FFmpeg, et recommande Claude Opus 5.5. La version 1 reposait sur GSAP et HyperFrames, et son README dit qu'elle reste préférable pour une vidéo commentée.
- **Motion Graphics Skills** est un paquet de 15 compétences autour de `brand-intake`, qui écrit `brand.md` et `MOTION.md` lus ensuite par toutes les autres. Il ne demande aucune clé d'API ; l'export MP4 passe par HyperFrames ou par FFmpeg et Chrome ; Opus 5.5 est recommandé.
- **HyperFrames** rend du HTML en vidéo, image par image dans Chrome sans écran, encodé par FFmpeg. Il demande Node 22 ou plus et FFmpeg. Son dépôt livre 8 compétences, dont `media-use` (musique, voix, transcriptions, étalonnage, avec HeyGen ou des outils locaux gratuits) et un catalogue d'environ 450 blocs. Je n'ai pas trouvé dans le README de fonction nommée « coupe des blancs ».
- **Motion Graphics** (Barty-Bart) réunit 6 compétences : B-roll calé sur la transcription, séparation d'un sujet et de son fond, 3 formats d'explicatifs, effets sonores. Son README renvoie à une communauté payante pour le cours complet.
- **Animate** fait de courtes vidéos animées dans un seul canevas, avec 7 styles. Il impose 3 validations avant de construire : récit, aspect, storyboard. Il demande Node 18 ou plus, Playwright, FFmpeg. La voix passe par un connecteur ElevenLabs en option, le calage des mots par `faster-whisper` en local.
- **Claude Motion** (`whaleyxbt`) donne des règles de mouvement chiffrées, une boucle d'autorelecture sur planches de frames et un moteur de sons en Python. Il demande Node 20 ou plus, Python 3, FFmpeg et Remotion.
- **Motion** (`motion-ai`) installe des compétences Motion dans l'agent et branche les serveurs MCP hébergés de Motion. La recherche dans la documentation est gratuite ; les audits de performance et l'éditeur de transitions demandent Motion+.
- **Motion Design Skills** donne des principes de timing, de courbes et de chorégraphie, sans moteur ni dépendance. Rien à exécuter.

### P3 — Le cumul : recouvrement plutôt que complémentarité

Les 8 se rangent en 3 groupes.

- **Génération de vidéo par le code, 4 outils.** Product Launch Motion (version 2), Motion Graphics Skills, Animate et Claude Motion, si c'est le dépôt `howseen-ai/claude-motion-design`, décrivent la même mécanique : chaque image est une fonction du temps (`seek(t)`), capturée par un navigateur sans écran et encodée par FFmpeg. Leurs README le disent : « every pixel = f(t) in seek(t) » chez Product Launch Motion, « the whole film is one `seek(t)` function » chez howseen, `window.seek()` chez charlie947, « deterministic frame by frame » chez Animate. Ils se recouvrent : les cumuler donne 4 façons de faire la même vidéo, pas 4 capacités. `whaleyxbt/claude-motion` fait de même avec Remotion.
- **Rendu et montage, 2 outils.** HyperFrames est le moteur de rendu, que la version 1 de Product Launch Motion et le paquet de Motion Graphics Skills utilisent déjà. Motion Graphics (Barty-Bart) ajoute du B-roll sur une vidéo filmée. Ces deux-là complètent les précédents.
- **Interfaces, 2 outils.** Motion (`motion-ai`) et Motion Design Skills s'adressent au HTML animé. Ils se complètent : l'un écrit le code, l'autre fixe les principes.

Seule vraie complémentarité : un moteur de rendu (HyperFrames), une direction de scène (un seul des 4 skills de génération), et un outil d'habillage si une vidéo filmée existe. Les 3 autres générateurs n'ajoutent rien de structurel.

## Mesure

Question : « grandement » se mesure-t-il ? Je compte les canaux atteints et la demande observée, relevés le 02/11/2026.

| Canal | Outils concernés | Existant de la Factory | Demande observée |
|---|---|---|---|
| Vidéo de lancement ou d'explication | 6 sur 8 | 1 film de 25 s du 19/09 (`brag-output\brag.mp4`) ; essai décidé (TF-1924, 19/10), pas encore joué ; FFmpeg toujours absent du poste (`which ffmpeg` : aucun résultat le 02/11/2026) | 0 produit n'a demandé de vidéo (étude du 19/10, ligne 115) ; 1 demande humaine d'essai sur un commerce fictif (D-139 (a), 02/11) |
| Animation des interfaces | 2 sur 8 | `oracle-motion` de 14 règles, R1 à R14 (`oracle-motion.mjs`, lignes 3 à 51) ; Motion 12.23.12 vendorée | 0 incident de boucle infinie au registre (étude du 19/10) |

Lecture : le gain annoncé repose à 75 % (6 outils sur 8) sur un canal sans demande de produit, et à 25 % sur un canal déjà outillé. Je ne peux pas chiffrer « de combien » : aucun rendu n'a été produit, aucun jeton mesuré. La seule borne honnête est celle d'un canal ajouté, la vidéo, pour les produits qui passent par une mise en production.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Oracle de mouvement, règles R1 à R14 | `digit-ai-forge-design\oracles\oracle-motion.mjs`, lignes 36 à 51 : R11 boucle `infinite` de plus de 5 s sans pause, R12 durée littérale passée à `animate()` au-delà de 300 ms, R13 révocation `prefers-reduced-motion` incomplète, R14 contrôle pressable sans `:active` | recouvre l'animation des interfaces ; les 3 trous mesurés le 19/10 sont comblés depuis |
| Motion vendorée | `digit-ai-forge-design\oracles\vendor\motion-12.23.12.umd.js` et `motion-LICENSE.txt` | recouvre le moteur d'animation des pages ; `motion-ai` ne le remplace pas |
| Décision sur le kit Motion | `conception-forge-design.md`, ligne 33 : « MCP hébergé […] MotionScore (Motion+, payant) → `non_juge` » ; ligne 155 : l'AI Kit « sert à l'auteur […] jamais au livrable » | recouvre : le kit était connu et son rôle fixé, auteur seulement |
| Essai de vidéo décidé | `todo\TODO.jsonl`, ligne 5077 : « Option (a) : décidé ; l'essai attend la prochaine mise en production d'un produit » ; ligne 5696 : « produire aussi une publicité vidéo pour un commerce fictif » | recouvre le choix d'HyperFrames et le calendrier de l'essai ; ne recouvre pas la comparaison entre skills de direction |
| Étude vidéo du 19/10 | `output\03-etudes\20261019-etude-opportunite-video-lancement-generee-par-code.md`, lignes 58 à 66 : HyperFrames, `brag`, Remotion, Motion Canvas, Three.js comparés ; ligne 124 : Remotion « écartée d'avance » | recouvre HyperFrames, `brag` et Remotion ; ne recouvre aucun des 4 générateurs de la vidéo @saas_builders |
| Étude d'animation du 19/10 | `output\03-etudes\20261019-etude-opportunite-animation-finition-interfaces.md`, ligne 120 : « vendorer une bibliothèque de plus […] sans besoin recensé » écartée ; O4 : composants prêts à l'emploi écartés | recouvre : aucune bibliothèque nouvelle sans besoin recensé |
| Film du 19/09 | `brag-output\CREDITS.md` : `brag` MIT, HyperFrames 0.8.50 Apache-2.0, GSAP 3.14.2 | recouvre le moyen de rendu ; ne recouvre pas le livrable d'un produit |
| Étude du 16/08 | `output\03-etudes\2026-08\20260816-etude-skills-animation-motion.md`, ligne 45 : `lottiefiles/motion-design-skill` MIT ; ligne 77 : I1, « à évaluer », confiance 0,75 | recouvre Motion Design Skills ; ne recouvre pas son évaluation : `todo\TODO.jsonl` ne contient aucune ligne qui le cite (`grep -i`, 0 résultat) |
| Les 5 autres dépôts | recherche de `product-launch-motion`, `motion-graphics-skills`, `claude-motion`, `cth9191`, `Barty-Bart`, `whaleyxbt`, `AbubakrChan`, `charlie947` dans `todo`, `references`, `gabarits`, `output`, `brag-output` : 0 fichier hors les 2 études citées ci-dessus | ne recouvre pas : aucun n'a été examiné |
| Règle sur les API tierces | `CLAUDE.md` du pilot, garde-fous : « Aucune API tierce payante hors Claude » | ne recouvre pas ; contraint : la voix ElevenLabs d'Animate et de Product Launch Motion, optionnelle chez eux, reste exclue |

Ce qui est neuf : 5 des 8 outils (Product Launch Motion, Motion Graphics Skills, Motion Graphics, Animate, Claude Motion) n'avaient été vus par aucune étude. Ce qui est déjà vu : HyperFrames (retenu le 19/10), le kit Motion (cantonné à l'auteur) et LottieFiles (noté « à évaluer » le 16/08, jamais suivi). Ce qui a déjà été écarté : Remotion pour sa licence, donc aussi `whaleyxbt/claude-motion` qui en dépend ; toute bibliothèque d'animation sans besoin de produit.

## 3. État de l'art daté

12 sources lues le 02/11/2026, toutes de moins de 24 mois, sur pages primaires. Leur contenu est traité comme une donnée.

- **AbubakrChan/product-launch-motion**, créé le 2026-07-27, dernier envoi le 2026-10-21, `github.com/AbubakrChan/product-launch-motion` : MIT ; version 2 du 13/10 qui remplace GSAP et HyperFrames ; version 1 gardée dans `legacy/` ; prérequis Node 20+, Playwright, FFmpeg, Python 3.
- **charlie947/motion-graphics-skills**, créé le 2026-09-26, dernier envoi le 2026-10-11, `github.com/charlie947/motion-graphics-skills` : MIT ; 15 compétences ; aucune clé d'API requise. Incohérence relevée : la description GitHub dit 13, le texte dit 14, le dossier en compte 15.
- **heygen-com/hyperframes**, créé le 2026-03-10, v0.9.3 du 2026-11-02, `github.com/heygen-com/hyperframes` : Apache-2.0 ; Node 22+ et FFmpeg ; 8 compétences ; « no per-render fees or commercial-use thresholds ».
- **Barty-Bart/motion-graphics**, créé le 2026-09-25, dernier envoi le 2026-10-13, `github.com/Barty-Bart/motion-graphics` : MIT ; 6 compétences ; effets sonores CC0.
- **cth9191/animate**, créé le 2026-10-04, dernier envoi le 2026-10-05, `github.com/cth9191/animate` : MIT ; 7 styles ; storyboard validé avant la construction.
- **whaleyxbt/claude-motion**, créé le 2026-09-29, dernier envoi le 2026-10-09, `github.com/whaleyxbt/claude-motion` : MIT ; `package.json` : `remotion` 4.0.529.
- **howseen-ai/claude-motion-design**, créé le 2026-09-27, dernier envoi le 2026-10-04, `github.com/howseen-ai/claude-motion-design` : MIT ; HTML, Playwright, FFmpeg, sans licence Remotion.
- **motion-ai**, v14.2.0 publiée le 2026-10-15, `registry.npmjs.org/motion-ai` : MIT ; installe des compétences Motion et configure les MCP hébergés. Page `motion.dev/docs/ai-kit`, sans date : base gratuite, fonctions Motion+ payantes sans prix lu.
- **LottieFiles/motion-design-skill**, créé le 2026-03-12, dernier envoi le 2026-05-18, `github.com/LottieFiles/motion-design-skill` : MIT ; principes de Disney adaptés à l'interface.
- **Étude du pilot sur la vidéo de lancement**, 2026-10-19, `output\03-etudes\20261019-etude-opportunite-video-lancement-generee-par-code.md` : licence de Remotion gratuite jusqu'à 3 personnes, au-delà licence d'entreprise (ligne 62).
- **Étude du pilot sur l'animation des interfaces**, 2026-10-19, `output\03-etudes\20261019-etude-opportunite-animation-finition-interfaces.md` : 3 trous d'`oracle-motion` mesurés (lignes 49 à 55).
- **Recherche web du 02/11/2026** sur « Claude Motion » : aucune annonce d'Anthropic ; le terme désigne un usage communautaire, Opus 5.5 écrivant du code d'animation que Chrome capture image par image.

Licences, outil par outil, rapportées au socle (pages HTML autonomes, zéro réseau, aucune API payante hors Claude) :

| Outil | Licence | Adéquation |
|---|---|---|
| HyperFrames | Apache-2.0 | adopté depuis le 19/10 pour l'essai ; FFmpeg à installer |
| Product Launch Motion | MIT (films et musique exclus) | utilisable ; musique à fournir ou à synthétiser |
| Motion Graphics Skills | MIT | utilisable ; recoupe `brag` |
| Animate | MIT | utilisable ; voix ElevenLabs exclue, calage local par `faster-whisper` |
| Motion Graphics (Barty-Bart) | MIT | sans objet tant qu'aucune vidéo filmée n'existe |
| Claude Motion (`whaleyxbt`) | MIT sur Remotion | écarté : Remotion payant dès 4 personnes |
| Motion (`motion-ai`) | MIT ; Motion+ payant | auteur seulement, comme décidé |
| Motion Design Skills | MIT | utilisable comme barre de qualité, rien à installer |

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée, de justesse. Le statu quo laisse l'essai TF-1924 comparer un seul skill (`brag`), choisi avant que les 4 générateurs de la vidéo soient connus. Le coût du statu quo est faible : l'essai a lieu de toute façon, et aucun produit n'attend une vidéo. Elle serait retenue si l'humain refuse tout jeton supplémentaire pour la comparaison.
- **O1 — étendre l'essai TF-1924 à une comparaison de 2 compétences de direction sur un même brief.** Dans des clones temporaires, sans installation durable : `brag` (déjà décidé) et un second skill parmi Product Launch Motion ou Animate, avec HyperFrames comme moteur commun. Coût : simple × court, avec un prérequis hors Factory, l'installation de FFmpeg. Exclut : toute création de gabarit, de skill ou d'oracle avant la mesure, et tout paquet de 15 compétences.
- **O2 — adopter le cumul des 8 outils dans la Factory.** Les installer et les relier à `forge-design` et au pilot. Coût : très complexe × long. Exclut : la sobriété du socle, puisque 4 générateurs font la même vidéo, et le respect de la licence de Remotion pour l'un d'eux.
- **O3 — verser Motion Design Skills (LottieFiles) comme barre de qualité du mouvement des interfaces.** Une entrée au registre de barres de la forge, avec un test d'existence exécuté ; c'est l'idée I1 du 16/08, restée « à évaluer ». Coût : simple × court. Exclut : toute vidéo ; elle ne dit rien du canal vidéo.
- **O4 — brancher le kit Motion (`motion-ai`) à `forge-design`.** Les compétences et les serveurs MCP hébergés de Motion seraient utilisés à la production des pages. Coût : moyen × moyen. Exclut : le principe « réseau au build, jamais au runtime » si le serveur est appelé au rendu, et le zéro fonction payante, puisque la valeur ajoutée est dans Motion+.

## 5. Verdict

- **Option retenue** : O1.
- **Pourquoi O1** : le gain annoncé repose sur le canal vidéo, où l'essai est déjà décidé et la comparaison coûte peu. O2 ajoute 4 façons de faire une même vidéo. O4 reprend un kit que la conception de forge-design a déjà cantonné à l'auteur. O3 est utile mais n'est pas la question posée ; elle se candidate à part, sans être retenue ici.
- **Réponse à « grandement »** : non établi. Aucune des 8 sources ne donne un gain mesuré pour la Factory, et la demande de vidéo des produits est nulle à ce jour. Cumuler apporte au plus un canal de plus, la vidéo, avec 1 moteur, 1 skill de direction et au besoin un outil de B-roll.
- **Assemblage minimal par produit.** Produit à mise en production avec marque : HyperFrames, plus le skill de direction que l'essai désigne. Produit à interface seule : rien de plus que `oracle-motion` et la Motion vendorée. Explicatif narré : Animate, seul des 8 à imposer une validation de storyboard, voix locale seulement.
- **Coût** : complexité simple, durée court ; jetons non mesurés, à relever pendant l'essai ; dette nulle puisque rien d'installé. Le prérequis est FFmpeg, absent du poste le 02/11/2026 : l'installer est une dépense de poste à demander, non faite ici.
- **Candidature(s) émise(s)** : aucune candidature neuve. Je propose à l'orchestrateur une note de mise à jour de TF-1924 : l'essai compare 2 skills de direction sur le même brief, aux critères ci-dessous. Une candidature séparée pour O3 (évaluer LottieFiles, idée I1 du 16/08 sans suite au registre) reste à l'appréciation de l'humain. Je n'écris pas au registre.
- **Plan de revue** : 2026-12-15, date de revue de TF-1924, ou la première mise en production d'un produit si elle survient avant.

### Plan de mesure de l'essai (critères écrits avant l'essai)

Cas réel : la vidéo de lancement du prochain produit mis en production, et la publicité du commerce fictif de D-139 (a). Même brief, mêmes assets, 2 skills, un seul moteur. Rien ne se publie sans accord humain (R-38).

| Critère | Seuil de réussite | Mesure |
|---|---|---|
| Rendu local sans API payante | oui pour les 2 | exécution et liste des services appelés |
| Contrôle du moteur | `hyperframes check` à 0 erreur, contrastes AA tous passés | sortie de la commande |
| Fichier produit | durée entre 15 s et 25 s, 1920×1080, piste audio présente | sonde du fichier |
| Fidélité à la marque | couleurs de la composition incluses dans les jetons du produit, sauf exceptions nommées | comparaison avec `tokens.css` ; le 19/09, 9 couleurs sur 10 s'y retrouvaient |
| Fidélité aux chiffres | chaque nombre affiché présent dans les sources du produit | relecture de la composition |
| Coût | jetons et durée de session relevés dans les transcripts, pour chacun des 2 skills | mesure, sans seuil absolu : la comparaison porte sur l'écart |
| Avis humain | choix écrit de la version retenue, avec raison | réponse du porteur |

Règle de décision, posée à l'avance : le cumul ne se justifie que si le second skill se distingue du premier sur au moins 2 critères parmi coût, contrôles du moteur et avis humain. Sinon un seul skill est gardé, et les 7 autres outils sont classés sans suite. Si l'essai tient en simple × court et que le porteur valide la vidéo, un objet durable (gabarit de brief dans `forge-design`, oracle de vidéo en 4 contrôles) s'instruit avec ces chiffres.

### Test rétro

- *Opération → Tactique* : la comparaison de 2 skills répond à P3 (le cumul recouvre) et P5 (assemblage minimal) ; le tableau de mesure répond à P4 ; le tableau des 8 répond à P1 ; la section 2 répond à P2.
- *Tactique → Stratégie* : décider du motion design de la Factory sur des faits relevés à la source, sans importer 8 dépendances avant de savoir si un produit veut une vidéo.
- *Stratégie → Intention* : vous vouliez savoir si cumuler ces outils améliore grandement le motion design de la Factory. La réponse est non établie, pour une raison chiffrée : 6 des 8 outils visent un canal sans demande, et les 2 autres visent un canal déjà jugé par 14 règles.
- *Questions rejouées* : « les outils se complètent-ils ? » : 4 se recouvrent, 3 se complètent (moteur, direction, habillage). « De combien ? » : non mesurable avant l'essai, borné à un canal. « Comment les intégrer ? » : pas d'installation, un essai comparatif avec critères écrits.
- *Rupture constatée* : l'identité de 4 outils sur 8 (Product Launch Motion, Motion Graphics, Claude Motion, Motion) est une hypothèse de recherche, non une certitude. Si la vidéo @saas_builders vise d'autres dépôts, la conclusion de recouvrement tient pour la classe d'outils, pas pour chaque dépôt. La rupture est déclarée, pas comblée.

## Limites et hypothèses non résolues

- Le contenu de la vidéo est lu sur ses images, sans voix. Ni les dépôts ni les noms exacts n'y figurent.
- Aucun rendu n'a été produit : les affirmations de qualité des README (« digne d'une agence », « Dribbble-level ») ne sont ni reprises ni vérifiées.
- Le coût en jetons n'est pas mesuré ; 4 README recommandent Opus 5.5, ce qui pèse sur le routage de modèle de `CONTRAT-INTERFACE.md`, non relu ici.
- La licence de Remotion pour `whaleyxbt/claude-motion` dépend de l'effectif du produit final, non établi.
- Les étoiles varient d'une source à l'autre : une page tierce donnait 203 pour Animate, l'API en donne 1 374 le 02/11/2026. Je retiens l'API.
