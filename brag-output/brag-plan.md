# Brag Plan: digit-ai-factory

Invocation : `/brag --duration 25` sur https://github.com/iguane39/digit-ai-factory (dépôt public).
Options : format `landscape`, musique et effets sonores actifs, pas de voix, ton inféré.

## Rubrique des 9 questions (étape 1)

1. **Qu'est-ce que c'est ?** Le projet de pilotage de l'écosystème forge Digit-AI : un seul point
   de démarrage qui mobilise treize forges pour construire un produit bout en bout —
   conception, design, development, tests, MEP.
2. **L'affirmation la plus forte ?** « Chaque étape est validée par des oracles exécutés — jamais
   par confiance. » (README) et son pendant : « La qualité est mesurée, pas proclamée ».
3. **L'accroche visuelle ?** Le pipeline en cinq étapes du README, chaque étape recevant son
   verdict d'oracle ; la dernière s'arrête sur un gate humain.
4. **Que montrer du réel ?** Le prompt d'usage à une ligne (l'entrée réelle), le schéma des cinq
   étapes avec leurs artefacts (`EXIGENCES.json`, `tokens.css`, `ruff + pytest`, `forge_tests`,
   staging autonome), et les chiffres du run pilote du 04/08/2026.
5. **La plus courte vidéo satisfaisante ?** 25 s, durée demandée : accroche, révélation, flux,
   preuve, signature.
6. **Le ton ?** Préréglage `polished` ; direction : « film produit sobre — la preuve plutôt que
   la promesse ». Aucune blague : le projet n'en est pas une.
7. **L'audio ?** Nappe d'entreprise chaleureuse, peu d'effets, tous calés sur un mouvement réel
   (frappe clavier, cartes qui se posent, bascule du gate, cloche finale).
8. **La légende de partage ?** « La qualité ne se proclame pas, elle se mesure. »
9. **Le flux utilisateur ?** Coller une ligne de prompt dans le dossier du produit → les cinq
   étapes s'enchaînent, chacune jugée par un oracle exécuté → mise en production sur GO humain.

## What is this app?
digit-ai-factory est l'orchestrateur de l'écosystème forge Digit-AI : une ligne de prompt, treize
forges, cinq étapes, et un verdict d'oracle exécuté à chaque étape.

## The angle
La plupart des outils d'IA promettent. Celui-ci prouve. La vidéo oppose « proclamer » à
« mesurer » : elle montre l'entrée réelle (une ligne), le flux réel (cinq étapes jugées), la
frontière réelle (l'IA fait, l'humain décide) et la preuve réelle (le run pilote, chiffres du
README). Règle d'affichage reprise du README : ne rien promettre que le ledger d'un run ne puisse
prouver — la vidéo ne cite donc que des chiffres déjà publiés dans « Ce qui est prouvé aujourd'hui ».

## Hook (first 2-3 seconds)
Plein cadre, ancré à gauche : « La qualité ne se proclame pas. » Au temps fort de 1,60 s, le mot
« proclame » est barré et « Elle se mesure. » arrive en bleu.

## Key moments (the middle)
- Le nom du projet, sa promesse en trois segments, puis le terminal où se tape la ligne d'usage
  réelle : `Utilise https://github.com/iguane39/digit-ai-factory pour créer un site de réservation.`
- Les cinq étapes se posent une à une ; chacune reçoit son verdict vert `PASS` ; la MEP reçoit un
  badge ambre « GO humain ».
- « L'IA fait. L'humain décide. » (loi transverse n° 5 du projet).
- Trois chiffres du run pilote : 0 intervention humaine · 11/11 exigences tracées jusqu'aux
  tests · 0,714 de score de mutation (seuil 0,70).

## Outro / punchline
« Jamais par confiance. » sous le nom du projet, avec l'adresse du dépôt.

## User flow worth showing
Entrée : la ligne de prompt collée dans le dossier du produit. Action clé : les cinq étapes
jugées une à une. Résultat : le gate humain avant la production, puis les chiffres du run pilote.

## Tone
- Preset: polished
- Creative direction: film produit sobre — la preuve plutôt que la promesse
- Interpretation: peu de scènes, tenues longues, entrées rapides puis arrêt ; la densité vient
  des détails produits (barre de métadonnées, grille, filets), pas de l'agitation.

## Format: landscape — 1920x1080
## Duration: 25 s

## Visual identity (from the project)
Source : charte Digit-AI, thème sombre du socle `digit-ai-page-html` (`boilerplate.html`).
- Background: #0B1220
- Accent: #7DA2F5 (bleu du thème sombre ; bleu de marque #2563EB pour les aplats)
- Text: #EEF2F8
- Sémantique : vert #7BE0A0 (verdict), ambre #FBBF6D (gate humain)
- Display font: Roboto (800/900)
- Body font: DM Sans ; code et métadonnées : JetBrains Mono
- Strongest visual element: le schéma en cinq étapes du README et ses verdicts d'oracle

## Share copy (draft)
La qualité ne se proclame pas, elle se mesure. digit-ai-factory : une ligne de prompt, treize
forges, cinq étapes — chacune jugée par un oracle exécuté, la production sur GO humain.

## Audio direction
- Role: nappe chaleureuse + accents professionnels clairsemés
- Music: `happy-beats-business-moves-vol-11-by-ende-dot-app.mp3` (114,84 BPM) — licence vérifiée le
  19/09/2026 sur ende.app : CC BY 4.0, usage commercial permis (voir `CREDITS.md`)
- Music treatment: départ à 0 s, fondu d'entrée 0,3 s, niveau 0,78 (0,55 sous la cloche), fondu de sortie 23,6 → 25 s ; mix mesuré à −17,2 LUFS
- Music cue guidance: préréglage `assets/music/cues/…vol-11….music-cues.json` lu. Temps forts
  visés : 1,60 s (accroche), 3,70 s (nom), 17,91 s (preuve), 22,65 s (signature). Grille pour les
  cinq étapes : un temps sur deux — 9,50 · 10,54 · 11,60 · 12,65 · 13,70 s.
- Audio-reactive treatment: subtile ; l'énergie RMS et les basses font respirer le halo bleu de
  fond. Ni forme d'onde ni égaliseur.
- SFX posture: clairsemée, calée sur le mouvement
- Audio-coupled moments: frappe clavier du prompt ; pose des cinq cartes ; bascule du gate ;
  cloche sur la signature
- Restraint rule: aucun son sans mouvement à l'écran ; la cloche ne sonne qu'une fois.

## Storyboard

### Scene 1 — Accroche — 3,70 s (0 → 3,70)
« La qualité ne se proclame pas. » entre mot à mot ; à 1,60 s « proclame » est barré et
« Elle se mesure. » arrive en bleu.
Sequential/interaction: none
Audio intent: poser le propos ; un impact doux sur la bascule
Audio-coupled idea: impact à 1,60 s (temps fort)
Transition mood: clean → Scene 2

### Scene 2 — Révélation et entrée — 5,26 s (3,70 → 8,96)
Nom `digit-ai-factory` à 3,70 s, sous-titre « Un seul point de démarrage. Treize forges. Bout en
bout. », puis carte terminal où se tape la ligne d'usage réelle (5,45 → 7,15 s, tenue jusqu'à 8,6 s).
Sequential/interaction: yes — frappe simulée du prompt, caractère par caractère
Audio intent: l'outil entre en scène, puis le geste de l'utilisateur
Audio-coupled idea: touches de clavier pendant la frappe
Transition mood: clean → Scene 3

### Scene 3 — Le flux jugé — 8,95 s (8,96 → 17,91)
Titre « Cinq étapes. Chacune jugée par un oracle exécuté. » Cinq cartes une à une (conception,
design, development, tests, MEP) avec leur artefact ; verdict `PASS` sur les quatre premières un
temps plus tard ; badge ambre « GO humain » sur la MEP à 14,76 s ; puis « L'IA fait. L'humain
décide. » à 15,28 s, tenu 2,2 s.
Sequential/interaction: yes — cinq cartes puis cinq verdicts, un temps sur deux (texte lisible)
Audio intent: la cadence d'une chaîne qui avance
Audio-coupled idea: glissement de carte à chaque pose ; bascule sur le gate humain
Transition mood: clean → Scene 4

### Scene 4 — La preuve — 4,74 s (17,91 → 22,65)
« Ce qui est prouvé. » — Run pilote · 04/08/2026 · produit-test MiniVeille. Trois chiffres :
0 intervention humaine · 11/11 exigences tracées jusqu'aux tests · 0,714 score de mutation
(seuil 0,70). Compteurs sur les deux derniers. Pied : « ledger de 23 entrées vérifié ».
Sequential/interaction: yes — trois cartes à 17,91 · 18,96 · 20,02 s, ensemble tenu jusqu'à 22,3 s
Audio intent: affirmation calme
Audio-coupled idea: impact doux sur la première carte, clics discrets sur les suivantes
Transition mood: clean → Scene 5

### Scene 5 — Signature — 2,35 s (22,65 → 25,00)
`digit-ai-factory` · « Jamais par confiance. » · `github.com/iguane39/digit-ai-factory`.
Sequential/interaction: none
Audio intent: résolution
Audio-coupled idea: cloche à 22,65 s (temps fort), la musique s'efface dessous
Music: fondu de sortie

**Music mood for this video:** upbeat, contenu
**Audio summary:** une nappe d'entreprise régulière, cinq accents posés sur les gestes du flux, une cloche pour signer.

Somme des durées : 3,70 + 5,26 + 8,95 + 4,74 + 2,35 = 25,00 s.
