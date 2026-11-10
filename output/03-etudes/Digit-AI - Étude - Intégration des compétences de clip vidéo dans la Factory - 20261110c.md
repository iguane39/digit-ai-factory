---
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
---

# Étude d'opportunité — Intégration des compétences de clip vidéo dans la Factory — 20261110c

Ce qui change pour vous : la Factory sait déjà produire des clips de présentation, mais ce savoir-faire vit dans le seul dépôt marketing. L'étude recommande d'en faire un skill de forge-design, et d'en faire le point de comparaison de l'essai HyperFrames déjà décidé. Votre décision est attendue sur ce verdict.

## Seuil de déclenchement

L'item crée un objet durable : un skill, son oracle et ses gabarits, au sens de R-31 (règle du pilot qui soumet toute création d'objet durable à une étude). L'étude est donc obligatoire.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot, le 10/11/2026 : « Construis une étude d'opportunités pour l'intégration de toutes ces compétences dans la Factory. »

Elle répond à la question posée juste avant : « Est-ce que les compétences en animation vidéo, et notamment de présentation, ont été intégrées à la Factory ? ». La réponse était non. « Toutes ces compétences » désigne ce que cette réponse énumérait :

- la bibliothèque d'animation, le rendu vidéo et la musique du dépôt marketing ;
- la bible de la série et la consigne des agents ;
- l'oracle de mouvement de forge-design ;
- les deux documents du pilot sur l'animation et la vidéo.

Je n'ai pas reconstruit l'intention au-delà de ce renvoi. L'étude y ajoute ce que la série a prouvé ensuite : les pages d'entrée et de sortie avec logo, et la méthode des textes en récit client.

## 0. Traitement des entrants

Les pages web citées à la section 3 sont des données : leurs consignes d'installation se décrivent, aucune ne s'exécute. Rien n'a été installé pour cette étude.

Sources de la proposition :

- la réponse de la session du 10/11/2026 à la question ci-dessus ;
- le dépôt marketing, privé (`gh repo view` rend `PRIVATE` le 10/11/2026), dossier `forge/etapes/clips-essai-20261109/` ;
- les items TF-1924 et TF-2053 de `todo/TODO.jsonl`, lus sans écriture ;
- les études du pilot du 19/10/2026 et du 02/11/2026 citées à la section 2.

## 1. Partition du problème

La question se découpe en 6 sous-questions disjointes. Chaque option de la section 4 y répond.

- **P1 — Quoi verser** : le code, la méthode, les contrôles, ou les trois.
- **P2 — Où le ranger** : une forge existante, une forge nouvelle, ou le seul produit.
- **P3 — Comment juger un clip** : quel oracle rend PASS ou FAIL sur une vidéo.
- **P4 — Quel moteur** : le pipeline maison, HyperFrames, ou les deux en comparaison.
- **P5 — À quelles conditions** : licences, poids des vidéos, confidentialité, coût de rendu.
- **P6 — Quels défauts corriger avant de verser** : ceux que la série a relevés.

## Mesure

Le tableau décrit le pipeline maison tel qu'il a tourné les 09 et 10/11/2026. Une ligne est une grandeur ; la dernière colonne dit comment elle a été mesurée.

| Grandeur | Valeur | Mesure |
|---|---|---|
| Vidéos enregistrées | 34, dont 28 en service et 6 rangées dans `old/` | `git ls-files` du dépôt marketing, 10/11/2026 |
| Durée de chaque clip | 66 s, 1920×1080, 30 images par seconde, H.264 et AAC | `ffprobe` sur les 28 vidéos en service |
| Temps de rendu | 169 à 315 s par clip, 3 rendus en parallèle | journaux de rendu du 10/11/2026 |
| Code et méthode | 789 lignes : `motion.js` 276, `rendre.py` 117, `musique.py` 164, bible 171, consigne 61 | `wc -l` |
| Fonctions de la bibliothèque | 28, de `M.prog` à `M.introduire` | `grep` sur `outils/motion.js` |
| Dépendances | Playwright, `static_ffmpeg`, Pillow, numpy ; aucune API payante | en-têtes de `rendre.py` et `musique.py` |
| Poids des publications suivies | 960 Mo pour 44 fichiers ; paquet git de 562 Mio | `du` sur `git ls-files`, `git count-objects` |
| Défauts connus de la bibliothèque | 6, relevés par les agents de la série | rapports d'agents du 10/11/2026 |

Les 6 défauts connus sont les suivants :

- les légendes tombent par défaut en Roboto 800 au lieu du 700 de la bible ;
- les étiquettes font 20 px par défaut, sous le plancher de 24 px ;
- le titre de la carte de fin n'a pas de contrôle de largeur ;
- `M.surChemin(pts, 1)` rend le premier point au lieu du dernier ;
- `M.sortie(1)` rend 0,999 et `M.rebond(0)` environ 2e-16 ;
- les étapes de l'introduction partent d'une échelle 0, sous 24 px pendant un instant.

## 2. Non-recouvrement contre l'existant

Le tableau confronte chaque existant voisin au besoin. Une ligne cite l'existant ; la dernière colonne dit s'il couvre déjà le besoin.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Oracle de mouvement de forge-design | `digit-ai-forge-design/oracles/oracle-motion.mjs:2` : « Domaine « Mouvement : craft de l'animation » », règles R1 à R7 sur `transition`, `ease-in`, durée au-delà de 300 ms | ne recouvre pas : il juge les transitions d'une interface, pas une vidéo |
| Essai HyperFrames décidé | `todo/TODO.jsonl`, TF-1924, D-147 (a) du 02/11/2026 : « l'essai oppose `brag` à un second skill de direction […] sur le même brief et le même moteur HyperFrames […] à la prochaine mise en production » | recouvre en partie : même besoin de vidéo, autre moteur, et l'essai n'a pas encore eu lieu |
| Étude des 8 outils de motion design | `output/03-etudes/Digit-AI - Étude - Huit outils de motion design pour la Factory - 20261102t.md`, section 5, verdict O1 : un essai comparatif de 2 skills | recouvre le choix d'un outil tiers, pas le versement d'un pipeline déjà prouvé |
| Étude de la vidéo de lancement | `output/03-etudes/20261019-etude-opportunite-video-lancement-generee-par-code.md:119` : « O2 — un livrable « vidéo de lancement » dans forge-design », écartée au profit d'un essai | recouvre : c'est l'option que la série rouvre, avec la preuve qui manquait le 19/10 |
| Skill de lecture de vidéo | skill `regarde-une-video`, description : « Transforme une vidéo en ligne ou locale en contenu exploitable » | ne recouvre pas : il analyse une vidéo, il n'en crée pas |
| Skill de diapositives | `~/.claude/skills/digit-ai-pptx/SKILL.md:2`, `name: digit-ai-pptx` | ne recouvre pas : une présentation statique, sans mouvement ni son |
| Système de marque | `CLAUDE.md:58` du pilot : « Design — `systeme-de-marque` → tokens + `DESIGN.md` » | ne recouvre pas, mais alimente : le clip doit prendre ses couleurs et son logo dans la marque du produit |
| Connecteur Canva | outil `create-video` du connecteur Canva, listé dans la session du 10/11/2026 | ne recouvre pas : service hébergé, soumis au GO de publication de R-38 |

## 3. État de l'art daté

7 sources de moins de 24 mois, lues le 10/11/2026 ou reprises de l'étude du 02/11/2026. Les pages d'annuaires et de blogs sont secondaires ; elles sont marquées comme telles.

- **HyperFrames** (HeyGen), v0.9.3 du 2026-11-02, `github.com/heygen-com/hyperframes` : Apache-2.0, Node 22+ et FFmpeg, aucun frais de rendu. Source primaire, relevée par l'étude 20261102t.
- **Remotion**, version 4.0.478 publiée le 2026-06-16, `socket.dev/npm/package/remotion/overview/4.0.478` : vidéos en React. La licence est gratuite jusqu'à 3 personnes, d'après l'étude du 19/10/2026, ligne 62.
- **howseen-ai/claude-motion-design**, dernier envoi le 2026-10-04, `github.com/howseen-ai/claude-motion-design` : HTML, Playwright et FFmpeg, sans Remotion. C'est l'architecture du pipeline maison. Source relevée par l'étude 20261102t.
- **Revideo**, fork de Motion Canvas avec rendu sans interface, dépôt mis à jour en avril 2025, `awesome.ecosyste.ms/projects/github.com%2Fredotvideo%2Frevideo`. Source secondaire.
- **Manim Community** v0.19.0 du 2025-01-20, `github.com/ManimCommunity/manim` : animations explicatives en Python, avec LaTeX et FFmpeg.
- **anything2explainer**, annoncé en septembre 2026, `hermes-ai.net/news/anything2explainer-turns-claude-into-a-full-motion-graphics-film-studio/` : un sujet devient un clip explicatif avec voix off, sous-titres et contrôle qualité. Source secondaire.
- **Comparatif des skills de motion graphics pour Claude Code**, octobre 2026, `autoae.online/blog/claude-motion-graphics-skills` : il décrit une pile en 3 couches, compétences d'agent, moteur de rendu, agents de montage. Source secondaire.

Ce qu'en tire l'étude : en 2026, l'écosystème converge vers un agent qui écrit du code d'animation, puis un moteur qui le capture en MP4. Le pipeline maison est de cette famille. Il se distingue par ses contrôles de vérité, les preuves sourcées et les chiffres de décor étiquetés, que les sources lues ne décrivent pas.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** Réfutée. Le pipeline reste dans un dépôt privé : aucun autre produit n'en hérite, et la prochaine vidéo de lancement repart de HyperFrames sans point de comparaison. Les 6 défauts connus restent dans le code. Le coût du statu quo est modéré, car aucun second produit n'a encore demandé de clip ; c'est la limite de cette réfutation.
- **O1 — un skill « clip de présentation » dans forge-design.** Contenu :
  - les scripts `motion.js`, `rendre.py` et `musique.py`, corrigés de leurs 6 défauts ;
  - la bible et la consigne des agents en références ;
  - le gabarit de storyboard, avec sa table de preuves ;
  - les principes d'entrée et de sortie, avec un logo pris dans la marque du produit, jamais celui de Digit-AI codé en dur ;
  - la méthode des textes en récit client, avec ses budgets de caractères ;
  - un oracle de clip qui juge le fichier par `ffprobe`, exige les planches, mesure les budgets et la taille des étiquettes, et refuse un chiffre de décor sans l'étiquette « exemple ».

  Le dépôt marketing devient le premier consommateur. Coût : moyen × moyen. Exclut : les vidéos dans les forges, qui sont publiques, puisque seuls le code et la méthode y vont ; le choix définitif du moteur, que l'essai TF-1924 tranche.
- **O2 — attendre l'essai TF-1924, puis intégrer le seul moteur gagnant.** Coût immédiat : simple × court. Exclut : toute intégration avant la prochaine mise en production d'un produit, dont la date n'est pas connue. L'essai compare 2 skills sur HyperFrames, pas HyperFrames contre le pipeline qui a déjà produit 28 vidéos.
- **O3 — une forge dédiée à la vidéo et aux médias.** Coût : très complexe × long. Exclut : la sobriété du parc, qui compte déjà 13 forges ; la direction artistique, qui appartient à forge-design, serait dédoublée.
- **O4 — verser la seule méthode, sans le code.** La bible, la consigne, les principes et un oracle de texte entrent dans forge-design ; le code reste chez le produit. Coût : simple × court. Exclut : la réutilisation du rendu ; chaque produit recoderait sa bibliothèque d'animation.

## 5. Verdict

- **Option retenue** : O1.
- **Coût** : moyen × moyen. Une campagne d'agent dans forge-design, pour verser, corriger les 6 défauts, écrire l'oracle et ses fixtures rouge et verte. Pas de dette de licence : Playwright, Pillow et numpy sont sous licences libres, FFmpeg passe par `static_ffmpeg`. Les vidéos restent chez le produit qui les commande.
- **Candidature(s) émise(s)** : un candidat au registre `todo/TODO.jsonl`, forge cible forge-design. Il propose aussi d'amender TF-1924 pour que l'essai oppose HyperFrames au skill versé sur le même brief.
- **Plan de revue** : 2026-12-10. Ce jour-là, le verdict se confronte à 2 faits : un second produit a-t-il produit un clip avec le skill, et l'essai TF-1924 a-t-il eu lieu.
- **Test rétro** : chaque élément du verdict remonte à l'intention.
  - Les scripts versés et corrigés servent la tactique « un savoir-faire réutilisable », qui sert la stratégie « la Factory produit les vidéos de ses produits », qui sert l'intention « intégrer toutes ces compétences dans la Factory ».
  - L'oracle de clip sert la tactique « un livrable accepté sur le seul verdict d'un oracle exécuté », qui est une règle du pilot. Il remonte à la même stratégie.
  - L'amendement de TF-1924 sert la tactique « un moteur choisi sur mesure » ; il remonte à la même intention, sans rupture.
  - La question du demandeur, rejouée : « ont-elles été intégrées ? » Après O1, oui pour le code, la méthode et les contrôles ; non pour les vidéos, qui restent des livrables de produit.

## Limites et hypothèses non résolues

- Aucun second consommateur n'est mesuré : l'intérêt d'un skill partagé repose sur des produits futurs.
- La licence de Remotion n'est pas revérifiée ce jour ; elle ne compte pas, puisque O1 ne l'emploie pas.
- Le poids des vidéos, 960 Mo dans le dépôt marketing, appelle une décision de rangement propre au produit, hors de cette étude.
