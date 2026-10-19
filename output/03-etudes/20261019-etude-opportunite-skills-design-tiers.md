---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-19
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: agent redacteur (famille sonnet), mandat de l'orchestrateur, D-39 (c), rang 4 du tri
verdict_arbitre: oracle-etude-opportunite PASS (E1 à E10) et oracle-ecriture PASS, rejoués le 2026-10-19 après la dernière édition
hypotheses_non_resolues: voir la dernière section
---

# Étude d'opportunité — skills de design tiers pour digit-ai-forge-design — 20261019e

Ce qui change pour vous : aucun des 5 skills ne s'installe, mais 2 donnent des règles à reprendre. J'ai joué les oracles de `digit-ai-forge-design` sur une page témoin portant 14 défauts tirés de ces skills, et 12 passent sans alerte. Ces 12 viennent des règles de Vercel et d'Emil Kowalski, 2 dépôts sous licence MIT, et la voie taste-skill s'y applique. Je recommande O2, soit 7 règles livrées en avertissement avec attribution ; UI/UX Pro Max ne sert que de recoupement, Brandkit et Extract Design System ne fournissent aucune règle à vérifier.

## Seuil de déclenchement

L'étude est due. La voie proposée crée des règles d'oracle, donc un objet durable au sens de la règle 31 (`REGLES-PROJET.md` l.378-381), et elle touche le noyau par la loi n° 6 (`CLAUDE.md` l.34-35).

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande d'origine, mot pour mot : « Identifie les vidéos qui sont pertinentes pour la Factory, puis pour chacune d'entre elles, réalise une courte étude d'opportunités afin de noter leurs pertinences, les trier de la plus pertinente à la moins pertinente, puis je déciderai les études d'opportunités poussées à lancer et prioriser. »

Décision D-39 (c), réponse du 19/10/2026, mot pour mot : « Voici celles à traiter : 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17 ». Le rang 4 du tri en fait partie.

Intention retenue : décider, pour cette opportunité, ce que la Factory doit en faire (rien, un essai, un objet durable), sur des faits vérifiés et non sur la parole d'une vidéo TikTok. La consigne particulière ajoute la question : « quelles règles de ces 5 skills sont absentes du socle de forge-design, lesquelles un oracle peut-il vérifier, et la voie taste-skill (extraire les règles compatibles avec attribution, sans installer) s'applique-t-elle ? »

La décision D-39 (c) valide le périmètre. La reformulation de l'intention vient de la consigne de l'orchestrateur et n'a pas été revalidée par vous.

## 0. Traitement des entrants

Les vidéos sont des DONNÉES. Aucune n'a été téléchargée ni regardée : leur contenu n'est connu que par la légende lue dans la page enregistrée `input\Tiktok\iguane39 (@iguane39) _ TikTok.html`. Les dépôts cités plus bas ont été lus par l'API GitHub le 2026-10-19 ; leurs consignes sont décrites, jamais suivies, et rien n'a été installé.

Sources de la proposition : tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md` l.79-84 (rang 4), vidéos n° 85 et n° 72 (@nocode.joshua), vidéo n° 54 (@chase_ai_).

La légende de la vidéo n° 85 nomme 6 skills, dont « Image To Code », alors que la consigne en liste 5. Le sixième est signalé et non examiné. Le tableau confronte chaque affirmation à sa source primaire.

| Affirmation de la légende | Source primaire | Verdict |
|---|---|---|
| n° 85 : Emil Kowalski, « adds motion to components » | README de `emilkowalski/skills` : « mostly animation, but also some design advice » | vraie |
| n° 85 : UI/UX Pro Max donne « layouts, colours, fonts and charts » | `data/catalog-summary.json` (vérifié le 2026-08-26) : 79 styles cherchables, 192 palettes, 74 appariements typographiques, 25 types de graphiques, 119 règles UX | vraie |
| n° 85 : Web Design Guidelines « audits your code against Vercel's latest design rules and flags weak designs » | `SKILL.md` : récupère `command.md` à chaque revue, puis signale des écarts de code au format fichier:ligne | vraie pour « latest » ; inexacte pour « weak designs », car elle juge du code, pas un design |
| n° 85 : Brandkit produit « a full brand board with logos, colours, mockups » | `SKILL.md` : « Create a complete brand world in one image » | vraie, par génération d'image |
| n° 85 : Extract Design System tire couleurs, typographie, espacements et ombres « from any public website » | README : « Public websites only » ; `SKILL.md` : résultat « useful for initialization, not pixel-perfect », sites dynamiques ou partiels signalés comme limite | vraie avec réserve |
| n° 85 : « Image To Code » | non examiné, hors des 5 de la consigne | invérifiée ici |
| n° 72 : « 10/10 Claude skills for design », sans nom de skill | la légende ne nomme rien | invérifiable |
| n° 54 : « turn claude into a design genius in 3 steps » | les 3 étapes ne figurent pas dans la légende | invérifiable |

## 1. Partition du problème

6 sous-questions disjointes ; chaque option du chapitre 4 répond à chacune.

- **P1 — Source.** Dépôt, licence et date de chaque skill, vérifiés à la source.
- **P2 — Absence.** Quelles règles manquent au socle de `digit-ai-forge-design`, mesuré par exécution.
- **P3 — Vérifiabilité.** Parmi elles, lesquelles un oracle statique tranche, lesquelles exigent un rendu ou un jugement.
- **P4 — Compatibilité.** Accord avec l'autonomie réseau A1, la neutralité de pile, le français et la loi n° 6.
- **P5 — Voie.** Installer, extraire avec attribution comme pour taste-skill, inscrire comme barre, ou outiller un geste neuf.
- **P6 — Recouvrement.** Frontière avec l'étude du rang 10 « Animation et finition des interfaces », traitée en parallèle, et avec `impeccable`.

## Vérification à la source

Chaque skill est lu dans son dépôt primaire. Les dates sont celles de l'API GitHub, relevées le 2026-10-19.

| Skill | Dépôt | Licence | Créé, dernier mouvement | À retenir |
|---|---|---|---|---|
| Emil Kowalski | `github.com/emilkowalski/skills` (l'ancien nom `skill` y redirige) | MIT, © 2026 Emil Kowalski | 2026-03-16, push du 2026-10-11 | 15 skills. `review-animations` et `apple-design` ont changé le 2026-09-15, après l'import du 2026-08-16 |
| UI/UX Pro Max | `github.com/nextlevelbuilder/ui-ux-pro-max-skill` | MIT, © 2024 Next Level Builder | 2025-11-30, push du 2026-10-15, v2.15.0 du 2026-08-13 | 119 règles UX sans colonne de source ; 17 presets de mouvement avec extrait GSAP ; 74 appariements avec URL Google Fonts |
| Web Design Guidelines | skill : `vercel-labs/agent-skills`, règles : `vercel-labs/web-interface-guidelines` | règles : MIT, © 2025 Vercel Labs ; dépôt du skill : aucun fichier de licence à la racine | skill : dernier commit 2026-01-16 ; règles : 2026-10-05 | le skill ne contient aucune règle, il pointe vers `command.md` (104 lignes de règles) |
| Brandkit | `github.com/Leonxlnx/imagegen-skills` | MIT, © 2026 Leonxlnx | créé le 2026-10-18, push du 2026-10-19 | dépôt d'un jour ; le `SKILL.md` de `taste-skill` n'en garde qu'un renvoi |
| Extract Design System | `github.com/arvindrk/extract-design-system` | MIT, © 2026 Arvind | 2026-03-22, push du 2026-09-05, v0.1.11 du 2026-05-05 | dépend de `dembrandt` ^0.13.0 et de Playwright |

Le cas du dépôt de Vercel rappelle celui de taste-skill (`oracles\regles-importees-taste-skill.md` l.15) : le texte qui porte les règles est sous MIT, le `SKILL.md` qui l'appelle n'a pas de licence déclarée.

## Mesure

La question « quelles règles manquent » se tranche par exécution, pas par lecture. J'ai écrit une page HTML témoin qui plante 14 défauts, chacun tiré d'une règle écrite dans l'un des skills, puis je l'ai jouée contre les oracles. La page est jetable et n'est pas versée au dépôt, la consigne n'autorisant qu'un fichier ; le tableau suffit à la refaire.

Commandes jouées depuis `C:\dev\digit-ai-forge-design` : `node oracles\run-oracles-design.mjs <page> --json-only` (9 oracles, exit 1), `node oracles\oracle-mobile.mjs <page>`, `python check_html.py <page>` du socle et `python oracle-a11y.py <page>` de `quality-oracles`. La page échoue au lanceur pour d'autres raisons (police en dur, image sans manifeste, sur-couche nue). Le tableau ne regarde que les 14 défauts plantés.

| # | Défaut planté | Règle source | Signalé par |
|---|---|---|---|
| 1 | `<div>` avec `onclick` au lieu d'un `<button>` | Vercel l.19 | aucun : `oracle-declencheurs` PASS, il le range comme « texte » |
| 2 | bouton-icône sans nom accessible | Vercel, Accessibility | `oracle-a11y.py` FAIL, mais le lanceur ne le joue qu'avec `--rendu` |
| 3 | `outline: none` sans remplacement | Vercel, Focus States | partiel : T8 avertit qu'aucun style de focus n'est posé, sans viser le `outline: none` |
| 4 | champ sans `autocomplete` ni `inputmode` | Vercel l.39-40 ; mobile-native §4 ; UI/UX Pro Max n° 58 et n° 63 | aucun : SA1 ne signale que le `type` |
| 5 | `<img>` sans `width` ni `height` | Vercel l.80 ; UI/UX Pro Max n° 19 | aucun |
| 6 | « ... » écrit en 3 points | Vercel l.64 | aucun |
| 7 | colonne de nombres sans `tabular-nums` | Vercel l.68 | aucun |
| 8 | modale sans `overscroll-behavior` | Vercel l.106 ; mobile-native §6 | aucun |
| 9 | bouton sans retour d'appui `:active` | STANDARDS l.59 ; mobile-native §5 ; UI/UX Pro Max n° 30 | aucun |
| 10 | étagement de 250 et 500 ms entre éléments | STANDARDS l.151 | aucun |
| 11 | `filter: blur(40px)` | STANDARDS l.147 | aucun |
| 12 | date composée à la main, sans `Intl` | Vercel l.126 | aucun |
| 13 | `theme-color` absent | Vercel l.121 ; mobile-native, tableau des symptômes | aucun |
| 14 | `touch-action` absent | Vercel l.104 ; mobile-native §5 ; UI/UX Pro Max n° 25 | aucun : `oracle-mobile` ne rend que M4 et M5 |

« STANDARDS » désigne `skills/review-animations/STANDARDS.md` d'Emil Kowalski, « mobile-native » son `skills/mobile-native/SKILL.md` (créé le 2026-09-15). Un 15e défaut, `will-change: transform` posé sur `*`, vient de l'audit d'`impeccable` et n'est pas signalé non plus.

**Ce que la mesure établit.** 12 défauts sur 14 passent tous les oracles du lanceur. 1 est tenu hors du lanceur (n° 2) et 1 partiellement (n° 3). 6 défauts ont 2 dépôts source ou plus (n° 4, 5, 8, 9, 13, 14) ; un 7e, le n° 1, s'appuie sur un texte normatif (WCAG 2.1.1).

**Limites, dites.** Une seule page et un seul passage. Les défauts sont de mon choix, tirés des sources : la mesure dit que l'oracle ne les voit pas, pas qu'ils arrivent dans les livrables. Sur 8 mots cherchés au registre (`inputmode`, `overscroll`, `touch-action`, `theme-color`, `tap-highlight`, `text-wrap`, `onclick`, `outline`), `todo\TODO.jsonl` et `todo\TODO-ARCHIVE.jsonl` ne donnent aucune ligne. `render_page.py` n'a pas été joué : ses règles V1 à V7 jugent débordement, contraste et chevauchement (`oracles\registre-entrees.md` l.114-117), pas ces défauts.

## 2. Non-recouvrement contre l'existant

13 éléments touchent déjà au sujet ; chacun est cité, avec ce qu'il couvre et ce qu'il laisse.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Oracle de mouvement, dérivé d'Emil Kowalski | `digit-ai-forge-design\oracles\oracle-motion.mjs` l.3 : les règles R1 à R7 sont dites « dérivées de review-animations d'Emil Kowalski (MIT) » ; `registre-entrees.md` l.152 (R1 à R10) | recouvre les règles d'animation de la source n° 1 ; ne recouvre pas les n° 9, 10 et 11 de la mesure |
| Arbitrage d'autorité sur le mouvement | `registre-entrees.md` l.192 : « Aucun oracle de mouvement ne se crée ailleurs sans retirer celui-ci d'abord » | contraint : toute règle de mouvement se range dans `oracle-motion`, pas dans un oracle neuf |
| Versement annoncé d'`apple-design` et de `review-animations` | `README.md` de la forge l.279 et l.303-304 ; `skills\systeme-de-marque\references\tokens.md` l.81 : « corpus GL49 (apple-design) » ; `corpus\guidelines.csv` s'arrête à GL45 et GL36 porte « Échappement des données injectées » | ne recouvre pas : le versement n'est pas retrouvé (`git log -S"GL49"` sur le corpus : aucun commit ; aucun des 2 skills dans `~\.claude\skills\`) |
| Corpus indexé inspiré d'UI/UX Pro Max | `conception-forge-design.md` l.32 : « à filtrer, pas à copier » ; `corpus\*.csv` : 24 styles, 18 palettes, 20 appariements, 37 patterns, 45 guidelines, avec `recherche.py` en BM25 hors ligne | recouvre l'architecture ; le volume est voulu, et le README (l.277-278 : 31 patterns, 51 guidelines) ne correspond pas aux fichiers |
| Marqueurs de slop et conseils d'animation d'`impeccable` | `oracles\oracle-slop.mjs` l.1-5 ; `registre-entrees.md` l.101-112 (détecteur amont refusé comme oracle) ; skill installé `impeccable` v4.0.4, `reference\animate.md` l.50-77 et `reference\craft-floor.md` | recouvre le slop et le conseil de mouvement ; ne recouvre pas les 12 défauts. Le skill amont est en v4.6.0 (`.claude/skills/impeccable/SKILL.md`, 2026-10-19) |
| Accessibilité structurelle | `~\.claude\skills\quality-oracles\scripts\oracle-a11y.py` l.1-9 : lang, alt, noms accessibles, ordre des titres, zoom ; `run-oracles-design.mjs` l.22 : joué avec `--rendu` seulement | recouvre le n° 2 et les règles Vercel d'accessibilité de base ; ne recouvre ni le n° 1 ni les formulaires |
| Contrat tactile | `oracles\oracle-mobile.mjs` l.1-14 : M1 à M9 (viewport, cibles 44 px, safe-area, reflow, paysage) | recouvre la moitié de `mobile-native` ; ne recouvre pas les n° 13 et 14 |
| Champs de saisie et déclencheurs | `oracles\oracle-saisie.mjs` SA1 à SA7 ; `oracles\oracle-declencheurs.mjs` DE1 à DE3 (`registre-entrees.md` l.225 et l.373) | recouvre le type natif et la nature lien ou bouton ; ne recouvre pas les n° 1 et 4 |
| Brandkit contre l'identité de marque et les images | `20260814-etude-opportunite-taste-skill.md` l.53 : « recouvre la partie « brandkit » du dépôt » ; `oracles\oracle-images.mjs` I1 à I7 | recouvre : tokens, `MARQUE.md` et visuels générés existent déjà |
| Extract Design System contre l'extraction d'identité | `systeme-de-marque\references\extraction.md` l.8 : « Site en ligne : tokens CSS effectifs » ; `ameliore-le-design\references\ingestion.md` l.7 : « fetch + rendu Playwright » ; `systeme-de-marque\scripts` ne contient que `generer-design-md.mjs` et `self-test.mjs` | recouvre le protocole ; ne recouvre pas l'outil : aucun script ne lit les valeurs calculées d'un site |
| Précédent de la voie taste-skill | `oracles\regles-importees-taste-skill.md` l.8-17 (attribution), l.99-137 (règles écartées nommément) ; `registre-entrees.md` l.80-95 (TA1 à TA4) | recouvre la procédure : attribution, avertissement, écarts nommés, revue datée |
| Incidents de ces classes | `todo\TODO.jsonl` et `todo\TODO-ARCHIVE.jsonl`, recherche sans casse : 0 ligne sur 8 mots ; TF-1598 (l.3406) est un faux positif de SA1 sur `autocomplete` | ne recouvre pas : aucun défaut manqué n'est enregistré. TF-1598 montre le risque d'une règle trop dure |
| Étude du rang 10 en parallèle | `20261019-etude-opportunite-animation-finition-interfaces.md` l.119 et l.125 : R11, R12 et R13 pour `oracle-motion` | recouvre le mouvement : cette étude porte ces 3 règles, et la règle d'appui du lot (n° 9) est à dédupliquer avec elle |

## 3. État de l'art daté

7 sources primaires, toutes lues le 2026-10-19 à la source, et toutes de moins de 24 mois. Elles établissent que les 5 skills sont des dépôts récents et actifs, tous sous MIT sauf le dépôt du skill de Vercel, et que leurs règles divergent par endroits.

- **Emil Kowalski, `emilkowalski/skills`**, dernier push 2026-10-11, `github.com/emilkowalski/skills` : 15 skills sous MIT, dont `review-animations` (premier commit 2026-06-18, dernier 2026-09-15) et `mobile-native` (2026-09-15). Le README dit que les règles viennent de ses années chez Vercel et Linear.
- **UI/UX Pro Max, `nextlevelbuilder/ui-ux-pro-max-skill`**, v2.15.0 du 2026-08-13, `github.com/nextlevelbuilder/ui-ux-pro-max-skill` : `data-provenance.json` (généré le 2026-08-13) porte 51 enregistrements, dont 62 références « derived » (ses propres CSV) et 52 « official ». La liste des 119 règles UX n'a aucune colonne de source.
- **Vercel, `vercel-labs/web-interface-guidelines`**, `command.md` modifié le 2026-10-05, `github.com/vercel-labs/web-interface-guidelines` : 104 lignes de règles sous MIT, dont 14 « anti-patterns » qui répètent les précédentes. Le commit du 2026-10-05 ajoute une règle sur le rebond de page au bureau.
- **Vercel, `vercel-labs/agent-skills`**, `skills/web-design-guidelines/SKILL.md` du 2026-01-16, `github.com/vercel-labs/agent-skills` : le skill demande de récupérer les règles à jour avant chaque revue. Une règle distante qui change sans préavis est une donnée mouvante au sens de la loi n° 4 : l'extraction la fige à sa date.
- **Arvind, `arvindrk/extract-design-system`**, v0.1.11 du 2026-05-05, push 2026-09-05, `github.com/arvindrk/extract-design-system` : outil et skill, sous MIT, qui lance Playwright et le paquet npm `dembrandt`, et écrit `tokens.json` et `tokens.css`.
- **Leonxlnx, `imagegen-skills`**, créé le 2026-10-18, `github.com/Leonxlnx/imagegen-skills` : `brandkit` est un prompt de génération d'image, ses critères sont « premium », « minimal », « visually expensive ». Son ancien emplacement dans `taste-skill` est un renvoi (push du dépôt : 2026-10-19).
- **`pbakaus/impeccable`**, release `cli-v4.6.0` du 2026-10-15, `github.com/pbakaus/impeccable` : licence Apache-2.0, skill amont en v4.6.0 ; la copie installée est en v4.0.4.

Un article d'Emil Kowalski, « Agents with Taste » (`emilkowal.ski/ui/agents-with-taste`), a été lu mais n'affiche aucune date : il n'est pas compté. Les critères WCAG 2.2 cités par les oracles datent d'octobre 2023, hors de la fenêtre de 24 mois.

## 4. Options — jeu fermé O0-O4

5 options, chacune avec son contenu, son coût et ce qu'elle exclut.

- **O0 — ne rien faire.** Réfutée, de justesse.
  - Coût du statu quo : 12 défauts sur 14 passent sans alerte, et 3 affirmations de la forge ne se retrouvent pas sur disque (README l.279, l.303-304 ; `tokens.md` l.81).
  - Contre-poids : aucun incident n'est enregistré sur ces classes. Mais `README.md` de la forge l.192-250 documente 4 retours humains (TF-0707, TF-0736, TF-0796, TF-0797) nés d'écarts que tous les oracles laissaient passer, chacun soldé après coup.
- **O1 — installer les skills tels quels** (`npx skills add`).
  - Coût : simple × court pour l'acte, complexe × long en dette. 3 obstacles. Le skill de Vercel lit une page distante à chaque revue, donc des règles qui peuvent changer sans préavis. Les 17 presets de mouvement d'UI/UX Pro Max sont écrits en GSAP. Ses 74 appariements portent une URL Google Fonts, soit une requête réseau au chargement. S'y ajoute le risque de chaîne d'approvisionnement mesuré par l'étude du 14/08 (`20260814-etude-opportunite-taste-skill.md` l.71 : 534 skills sur 3 984 avec un défaut critique, chiffre repris et non revérifié).
  - Exclut : la maîtrise de ce que les agents lisent.
- **O2 — voie taste-skill, ciblée.** Extraire 7 règles statiques, avec attribution, en avertissement, sans rien installer.
  - Critère de sélection : règle citée par 2 dépôts distincts au moins, ou par un texte normatif, vérifiable sur le fichier seul, sans pile imposée.
  - Chaque règle entre dans un oracle existant, avec une fixture rouge et une verte. Une page `regles-importees-vercel-emil.md` porte l'attribution, la table de disposition et les règles écartées, sur le modèle de `regles-importees-taste-skill.md`.
  - Coût : moyen × court. Précédent : 4 règles pour taste-skill (TF-0199).
  - Exclut : les règles à source unique, les règles de rendu, et tout ce qui impose une pile ou le réseau.
- **O3 — inscrire les skills comme barres externes** (`la-barre`), sans règle extraite, comme pour TF-0198.
  - Coût : simple × court.
  - Exclut : toute vérification exécutée. Les 12 défauts de la mesure resteraient invisibles, la barre fixant un niveau sans le contrôler.
- **O4 — O2 plus un extracteur de système de design** : un script Playwright de la forge qui lit les valeurs calculées d'un site et écrit des tokens, sans `dembrandt`.
  - Coût : complexe × moyen. Un verbe neuf demande, selon la règle 31, un self-test à double sens, une cadence et ses surfaces d'intégration.
  - Exclut : rien, mais sans cas d'usage au registre : la recherche sans casse de `dembrandt`, `extract-design` et « valeurs calculées » dans `todo\TODO.jsonl` et `todo\TODO-ARCHIVE.jsonl` ne donne aucune ligne.

**Les 7 règles du lot O2**, rangées là où leur oracle existe déjà. Toutes en avertissement jusqu'à la revue, comme TA1 et TA2.

| Règle | Sources | Oracle d'accueil |
|---|---|---|
| Élément non interactif cliquable (`div` ou `span` avec `onclick`, sans rôle ni `tabindex`) | Vercel l.19 et l.159 ; WCAG 2.1.1 | `oracle-declencheurs` |
| Champ de saisie sans `autocomplete` ni `inputmode` | Vercel l.39-40 ; mobile-native §4 ; UI/UX Pro Max n° 58 et n° 63 | `oracle-saisie` |
| Contrôles sans `touch-action: manipulation` ni `-webkit-tap-highlight-color` posé | Vercel l.104-105 ; mobile-native §2 et §5 ; UI/UX Pro Max n° 25 | `oracle-mobile` |
| `<meta name="theme-color">` absent | Vercel l.121 ; mobile-native, tableau des symptômes | `oracle-mobile` |
| Modale ou tiroir sans `overscroll-behavior: contain` | Vercel l.106 ; mobile-native §6 | `oracle-surcouche` |
| `<img>` sans `width` ni `height` | Vercel l.80 ; UI/UX Pro Max n° 19 | `oracle-images` |
| Contrôle pressable sans retour d'appui `:active` | STANDARDS l.59 ; mobile-native §5 ; UI/UX Pro Max n° 30 | `oracle-motion`, après les règles du rang 10 |

Sur la racine de la page, les 2 sources divergent : Vercel limite `overscroll-behavior: none` aux pointeurs précis (l.107), mobile-native le pose sur `html, body` (§6). Le lot ne retient que `contain` sur la sur-couche, où elles s'accordent.

**Règles écartées nommément, sur le modèle de taste-skill.**
- Pile : classes Tailwind, `<Link>`, `onKeyDown`, hydratation React, virtualisation de listes, raccourcis Framer Motion.
- Réseau : `preconnect` vers un CDN, préchargement de police distante, URL Google Fonts et extraits GSAP d'UI/UX Pro Max. Ils contredisent la règle A1 du socle.
- Langue : Title Case, `&` pour « et », guillemets anglais, qui contredisent `references\ECRITURE.md` et l'usage français.
- Provenance : les 119 règles UX d'UI/UX Pro Max, sans colonne de source, que `oracle-corpus` C2 refuserait. Ses 192 règles de raisonnement par secteur fixent un style par type de produit, là où la loi n° 6 dérive la DA de l'expérience client.
- Subjectivité : le « Style DNA » de Brandkit (« premium », « visually expensive »), qu'aucun oracle ne mesure.
- Source unique, en attente d'une seconde : champ de saisie à 16 px minimum (mobile-native §4), étagement de 30 à 80 ms (STANDARDS l.151), flou sous 20 px (STANDARDS l.147), `tabular-nums` (Vercel l.68), formats `Intl` (Vercel l.126), points de suspension `…` (Vercel l.64). `text-wrap` est déjà tenu à la relecture par `critique-le-design\references\liste-de-controle-demande.md`.

## 5. Verdict

Une seule option est retenue, celle qui ferme l'écart mesuré sans installer ni copier en bloc.

- **Option retenue** : O2.
- **Pourquoi O2 et pas O1, O3, O4** : O1 installe des dépendances au réseau et à la pile que le socle refuse. O3 fixe une barre sans la contrôler. O4 ouvre un verbe neuf sans cas d'usage au registre.
- **Coût** : moyen × court. 7 règles dans 5 oracles existants, 14 fixtures, une page d'attribution, une ligne de registre. Dette : suivre l'amont, qui a bougé les 2026-09-15, 2026-10-02 et 2026-10-11 pour Emil Kowalski.
- **Disposition par skill** :

| Skill | Disposition |
|---|---|
| Emil Kowalski | extraire 5 règles du lot (appui, saisie, tactile, `theme-color`, `overscroll-behavior`), toutes recoupées par une autre source ; le reste du mouvement relève de l'étude du rang 10 |
| Web Design Guidelines | extraire 6 règles du lot, figées à la date de consultation |
| UI/UX Pro Max | recoupement seulement ; aucun import, ni de règles ni de corpus |
| Brandkit | rien ; `systeme-de-marque` et `oracle-images` couvrent le besoin |
| Extract Design System | rien pour l'instant ; la question de l'outil se rouvre si un run de marque part d'un site |

- **Candidature(s) émise(s)** :
  - candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 3, preuve 4, effort 2. Objet : ajouter les 7 règles du lot O2 en avertissement, aux oracles d'accueil du tableau, avec 14 fixtures et la page `regles-importees-vercel-emil.md` ; reporter les 7 défauts correspondants de la mesure (n° 1, 4, 5, 8, 9, 13, 14) comme fixtures rouges.
  - candidature à inscrire au registre TODO-FORGE par l'orchestrateur, score proposé : gain 2, preuve 5, effort 1. Objet : corriger les 3 affirmations sans trace (README de la forge l.276-279 et l.303-304, `tokens.md` l.81) ou retrouver le versement d'`apple-design`, puis relire le delta amont de `review-animations` et d'`apple-design` du 2026-09-15.
- **Plan de revue** : 2026-11-16. Critères écrits d'avance. Les 14 fixtures tiennent au self-test. Rejouées sur au moins 5 pages produites par la forge, les règles voient la moitié au moins de leurs avertissements confirmés à la lecture, sinon la règle est retirée. L'étude du rang 10 est décidée et ne porte pas la même règle d'appui. Le delta amont de Vercel et d'Emil Kowalski est relu.
- **Test rétro** :
  - *Opération → Tactique* : chaque règle du lot répond à un défaut de la mesure (n° 1, 4, 5, 8, 9, 13, 14) ; la page d'attribution répond à P1 et P4 ; l'avertissement répond au risque TF-1598.
  - *Tactique → Stratégie* : reprendre des règles écrites par d'autres seulement quand un oracle exécuté les tient, et les figer à leur date, comme le veut la loi n° 4.
  - *Stratégie → Intention* : vous vouliez décider sur des faits ce que la Factory fait de ces 5 skills. Réponse : un objet durable restreint (7 règles) pour 2 d'entre eux, rien pour les 3 autres, aucune installation.
  - *Questions de la consigne rejouées* : « quelles règles sont absentes du socle ? » — 12 défauts sur 14, dont 7 retenus pour le lot (section Mesure). « Lesquelles un oracle peut-il vérifier ? » — ces 7 sur fichier statique ; mouvement perçu, fréquence d'usage et rendu restent à la relecture. « La voie taste-skill s'applique-t-elle ? » — oui pour Vercel et Emil Kowalski, non pour UI/UX Pro Max (pas de source par règle), Brandkit (images) et Extract Design System (un outil, pas des règles).
  - *Rupture constatée* : les vidéos n° 72 et n° 54 ne nomment aucun skill ; leur apport à la décision est nul, et c'est dit.

## Hypothèses non résolues

- Le contenu des vidéos n° 72 et n° 54 n'est connu que par une légende sans nom de skill ; « Image To Code », sixième skill de la n° 85, n'est pas examiné.
- Le delta amont de `review-animations` et d'`apple-design` du 2026-09-15 n'est pas relu ; les valeurs de STANDARDS citées sont celles du 2026-10-19.
- Les 119 règles UX d'UI/UX Pro Max ont été comparées par leurs titres et par 8 lignes lues, pas une à une. Pourquoi `data-provenance.json` ne liste que 51 enregistrements pour 192 règles de raisonnement reste inexpliqué.
- L'incidence réelle des 12 défauts dans les livrables n'est pas mesurée.
- La page témoin n'est pas versée au dépôt ; la mesure se rejoue depuis son tableau.
- `render_page.py` n'a pas été joué.
- Les skills `review-animations` et `apple-design` que le README de la forge dit « installés » sont introuvables sous `~\.claude\skills\` et `~\.claude-b\skills\` ; une autre installation, hors de ces 2 dossiers, n'est pas exclue.
- La lecture de l'intention vient de la consigne de l'orchestrateur ; seule la décision D-39 (c) est de vous.
