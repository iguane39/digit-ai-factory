# Hyperframes Composition Brief: digit-ai-factory

## Objective
Créer une courte vidéo de lancement « brag » pour digit-ai-factory.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 25 seconds

## Source Material
- Project root: dépôt `digit-ai-factory` (public, github.com/iguane39/digit-ai-factory)
- Primary files read: `README.md`, `CLAUDE.md`, socle `digit-ai-page-html/assets/boilerplate.html` (tokens de la charte)
- Product name: digit-ai-factory
- Tagline / strongest claim: « Chaque étape est validée par des oracles exécutés — jamais par confiance. »
- Key UI or visual moment to recreate: le schéma des cinq étapes du README, et la ligne de prompt d'usage
- Copy that must appear verbatim:
  - `Utilise https://github.com/iguane39/digit-ai-factory pour créer un site de réservation.`
  - « L'IA fait. L'humain décide. » (forme courte de la loi transverse n° 5)
  - Chiffres du run pilote du 04/08/2026 : zéro intervention humaine · traçabilité 11/11 · score de mutation 0,714 au seuil 0,70 · ledger de 23 entrées vérifié

## Creative Direction
- Tone preset: polished
- Creative direction: film produit sobre — la preuve plutôt que la promesse
- Interpretation: entrées rapides puis tenues longues ; densité par les détails produits
- Angle: opposer « proclamer » à « mesurer » ; ne montrer que du prouvé
- Hook: « La qualité ne se proclame pas. » → « Elle se mesure. » à 1,60 s
- Outro / punchline: « Jamais par confiance. »
- Avoid: langage SaaS générique, remplissage abstrait, chiffres non publiés dans le README

## Visual Identity
- Background: #0B1220 · Surface: #121B2E · Filet: #263248
- Text: #EEF2F8 · Secondaire: #A9B4C4
- Accent: #7DA2F5 (aplats #2563EB) · Verdict: #7BE0A0 · Gate humain: #FBBF6D
- Display font: Roboto 800/900 (fichiers locaux) · Body: DM Sans · Code: JetBrains Mono
- Visual references from the project: schéma cinq étapes, bloc de prompt du README, badges de verdict

## Storyboard
Contrat créatif : `brag-output/brag-plan.md`.
1. Accroche — 3,70 s — la phrase, le mot barré, la réponse en bleu
2. Révélation et entrée — 5,26 s — nom, promesse, frappe du prompt réel
3. Le flux jugé — 8,95 s — cinq cartes, cinq verdicts, « L'IA fait. L'humain décide. »
4. La preuve — 4,74 s — trois chiffres du run pilote
5. Signature — 2,35 s — nom, « Jamais par confiance. », adresse du dépôt

## Audio
- Audio role: nappe chaleureuse + accents clairsemés
- Music: `assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3`, niveau 0,78, fondu de sortie 23,6 → 25 s
- Music cue guidance: préréglage vol-11 ; verrous 1,60 · 3,70 · 17,91 · 22,65 s ; grille 9,50 → 13,70 s un temps sur deux
- Audio-reactive treatment: subtile — RMS et basses pré-extraits (`assets/audio-data.js`, script `extract-audio-data.py` de hyperframes-creative) modulent le halo de fond
- Audio-coupled moments: frappe clavier (scène 2) · pose des cartes (scène 3) · bascule du gate (14,76 s) · cloche (22,65 s)
- Exact SFX choice: fichiers à faible risque hautes fréquences d'après `sfx-analysis.md`

## Hyperframes Instructions
Composition autonome (racine sans `<template>`), une seule timeline GSAP en pause, aucun accès
réseau au rendu (GSAP, polices, audio en local), `npx hyperframes check` comme unique gate avant rendu.
