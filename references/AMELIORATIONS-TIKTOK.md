# Améliorations issues des entrants TikTok — inventaire gouverné

**Source de vérité unique** des idées extraites du dossier `input\Tiktok vidéos`, routées vers les
forges impactées. Les deltas ci-dessous sont des **candidats à décision humaine** : rien n'est
écrit dans les dépôts frères ni dans les skills sans GO explicite (doctrine `CLAUDE.md` — entrant
= donnée, écriture gouvernée).

---

## Méthode & périmètre

**Contrainte d'ingestion levée.** Les `.mp4` ne sont pas lisibles nativement. Pipeline **100 % local,
hors API payante** :
- 9 slides `.png` (`Design\`) lues comme images — carrousel « Web Design Genius » de *AI Slacker*.
- 5 vidéos : audio extrait (ffmpeg via `imageio-ffmpeg`) puis **transcrit hors ligne**
  (`faster-whisper`, modèle `base`, EN + FR auto) ; frames extraites (1/2 s) pour les visuels.

**Ce qui a été traité :** 9 slides (01→09 ; la slide 10/10 = CTA, **non capturée**, absente du lot) +
**5 vidéos sur 5** (v1 @milesreevesai, v2 @henriexploria, v3 @kira.nex.tech, v4 @haydenschmitty,
v5 @jasondavisseo).

**Non-redondance vérifiée :** les 5 vidéos et le carrousel sont des contenus **distincts** (créateurs
et sujets différents) — pas de double comptage à ce niveau ; la dédup joue à l'intérieur (idées
répétées entre slides).

**Fiabilité de la source — cadre.** Contenu **AI-généré** (mention explicite du créateur) et souvent
**promotionnel** (affiliation, « link in description »). Chaque idée est donc une **hypothèse à
valider par l'oracle de la forge cible**, jamais une vérité. Verdict par entrée : `retenu` /
`rejeté` / `à évaluer`. Whisper transcrit « Claude » en « Cloud » et déforme certains noms d'outils
— corrigés ici.

---

## Inventaire (idée · provenance · fiabilité · forge · fichier cible · delta proposé)

### A — Design : philosophie & workflow → `digit-ai-forge-design`

| id | idée | provenance | fiabilité | fichier cible | delta proposé |
|---|---|---|---|---|---|
| T01 | **Bibliothèque de goût** : curer des captures de sites, groupées par **famille** nommée, avec vocabulaire → réutilisable en prompt | slides 03, 04 | retenu | `corpus/` (concept) | Déjà incarné par le corpus. Guideline explicite « curer une bibliothèque de références groupée par famille nommée, le vocabulaire avant le prompt ». |
| T02 | **Cast wide, never one-shot** : générer 5 variantes de style côte à côte → 1 gagnante → 3 variantes de corps → tweaks. « Wide beats deep » | slides 02, 07 | retenu | `guidelines.csv` | +1 guideline (domaine `process`) : explorer en largeur avant de creuser, comparer à l'écran plutôt que deviner. |
| T03 | **Itérer visuellement, jamais deviner dans le terminal** ; se donner une barre de réglages (fonts/tailles/accents) en direct | slide 09 | retenu | `guidelines.csv` | +1 guideline (`process`) : juger sur rendu, pas sur code — converge avec `render_page.py` du skill HTML. |
| T04 | **Prompt en 4 parties** : Aesthetic · Reference · Intent · Guardrails (listes always/never) | slide 08 | retenu | `patterns.csv` | +1 pattern : structure de brief design à 4 entrées, guardrails always/never intégrés. |
| T05 | **Référence : « match the feel, never copy »** (s'inspirer sans plagier) | slide 08 | retenu | `guidelines.csv` | +1 guideline (`contenu`/éthique) : s'inspirer d'une référence sans la copier. |
| T06 | **Tells de l'AI-slop** : dégradés bleu-violet, Inter partout, même layout, blobs 3D SaaS, rounded-everything, photo stock, palettes « colorées équiréparties » | slides 02, 08 | à évaluer | `oracles/oracle-slop.mjs` / `styles.csv#anti_pattern` | Confronter à `oracle-slop` existant : ajouter seulement les tells **non déjà couverts** (ex. « palette colorée équirépartie », « layout identique répété »). |
| T07 | Familles esthétiques nommées observées (Print-Tech, Dither Mono, Vast Quiet, Classical, Data-Texture, Illustrated Storybook, Classical Remix) | slides 03, 04, 07 | à évaluer | `styles.csv` | Vocabulaire de familles : n'ajouter que celles absentes et pertinentes pour Digit-AI, sans importer la mode. |
| T08 | Libs design branchées via Claude Code : **Lenis** (smooth scroll), **GSAP** (animations), **React Bits**, **21st.dev** (prompts composants) | v2, slide 06 | à évaluer | `corpus/` (référence) | Ressources externes : à consigner comme pistes, pas comme règles ; vérifier licence/pertinence avant tout usage. |

### B — UI patterns → `digit-ai-forge-design` + skill `digit-ai-page-html`

| id | idée | provenance | fiabilité | fichier cible | delta proposé |
|---|---|---|---|---|---|
| T09 | **Skeleton loaders** : barres grises qui décrivent le layout pendant le chargement (réduit la latence perçue) | v4 | retenu | `patterns.csv` | +1 pattern (surface `app`) : squelette de chargement pour réduire la latence perçue. |
| T10 | **Anti-clutter** : supprimer les sous-titres explicatifs redondants sous les titres — « si ce n'est pas tangiblement utile, supprime » | v4 | retenu | skill `references/anti-patterns.md` | +1 contre-exemple : sous-titre paraphrasant le titre (« my day » + phrase qui explique « my day »). |
| T11 | **Couleurs sémantiques** (rampe de marque + accents) | v4 | rejeté (doublon) | — | Déjà couvert (charte accents sémantiques + `GL21` + `GL37` ajoutée). Aucune action. |
| T12 | **Conformité accessibilité** (risque légal si absente) | v4 | rejeté (doublon) | — | Déjà couvert (charte WCAG 2.2 AA, `GL01`–`GL13`). Renforce la justification « risque légal ». |

### C — Agents / développement / skills → `forge-agents` · `forge-development`

| id | idée | provenance | fiabilité | fichier cible | delta proposé |
|---|---|---|---|---|---|
| T13 | Plugins Claude Code : **OmniRoute** (routage multi-providers), **ClaudeMem** (mémoire inter-sessions), **Headroom** (compression de contexte/tokens), **Claude Code Setup** (plugin Anthropic : scanne le repo → recommande hooks/skills/subagents/MCP), **Task Observer** (apprend le style) | v1 | à évaluer | forge-agents (référence) | Paysage d'outillage : à évaluer un par un ; contenu **affilié** → ne rien adopter sur la foi de la vidéo. |
| T14 | Repo « Everything Claude Code » (hackathon Anthropic) : 28 subagents, 119 skills, 60 commandes, 34 rules, 20 hooks, 14 MCP ; research-first development ; 1282 tests / 98 % coverage | v3 | à évaluer | forge-agents / development (référence) | Chiffres marketing à vérifier ; l'idée « research-first development » et la couverture de tests sont des principes déjà alignés avec la doctrine. |
| T15 | **impeccable** : skill de design (7 dimensions, slop audit 46 patterns, `/bolder`) ; « flexible beats prescriptive », « one-trick skills = étroit, même sortie » | slide 05, slide 06 | retenu (déjà fait) | — | **Déjà installé** ce jour + déjà source du corpus `forge-design`. Garder « flexible beats prescriptive » comme principe d'écriture des skills forge. |

### D — SEO / GEO → `forge-seo`

| id | idée | provenance | fiabilité | fichier cible | delta proposé |
|---|---|---|---|---|---|
| T16 | **Backlink gratuit** via sous-domaine `chatgpt.site` (DA≈72) | v5 | rejeté | — | Growth-hack dépendant d'un tiers, volatil et sensible aux CGU ; incompatible avec « donnée volatile ≠ code » et le mandat SEO strict. Non retenu. |
| T17 | **Checklist « GEO readiness »** (Generative Engine Optimization) | v5 | à évaluer | forge-seo (référence) | Concept pertinent (optimisation pour moteurs génératifs) ; à qualifier par la forge-seo sur mandat, pas ici. |

---

## Convergences notables (signal de confiance)

Plusieurs idées TikTok **valident indépendamment** des choix déjà faits ce jour, ce qui renforce leur
crédibilité (deux sources, une conclusion) :
- T11 (couleurs sémantiques) ↔ `GL37` / charte accents.
- T12 (a11y) ↔ charte WCAG + `GL01`–`GL13`.
- T10 (anti-clutter) ↔ esprit « si ce n'est pas utile, supprime ».
- T03 (itérer visuellement) ↔ oracle `render_page.py` « ne jamais juger un rendu depuis le code ».
- T15 (impeccable) ↔ skill installé + sources `skill:impeccable#…` du corpus.
- T06 (anti-slop) ↔ `oracle-slop.mjs` (bans absolus, polices réflexes).

---

## Deltas candidats — synthèse par forge (à appliquer seulement après GO)

- **forge-design** : +3 guidelines (T02 cast-wide, T03 iterate-visually, T05 match-not-copy) · +2 patterns
  (T04 prompt-4-parties, T09 skeleton loaders) · confronter T06 à `oracle-slop` · évaluer T07/T08.
  Contrôle : `node oracles/oracle-corpus.mjs corpus` + `self-test.mjs` verts.
- **skill digit-ai-page-html** : +1 contre-exemple (T10 sous-titre redondant). Contrôle : boilerplate
  toujours `check_html.py` + `render_page.py` PASS.
- **forge-agents / development** : dossier de veille outillage (T13, T14) — évaluation, pas adoption.
- **forge-seo** : T17 à qualifier sur mandat ; T16 rejeté.

**Rien n'est appliqué.** Prochaine étape sur ton GO : ouvrir les deltas retenus, forge par forge,
chacun validé par l'oracle de sa forge (boucle bornée ≤ 3 itérations).

---

## Changelog

| Date | Version | Changement |
|---|---|---|
| 2026-08-10 | a | Création. 9 slides + 5 vidéos transcrites (pipeline local imageio-ffmpeg + faster-whisper). 17 idées inventoriées (T01–T17), routées vers 4 forges, taguées retenu/rejeté/à évaluer. Deltas candidats non appliqués. |
| 2026-08-10 | b | **Deltas « retenu » appliqués (sur GO humain).** forge-design : +GL41 (T01), +GL42 (T02), +GL43 (T03), +GL44 (T05), +PT36 (T04), +PT37 (T09) — sources `skill:impeccable#…`, `oracle-corpus` PASS 143 entrées + self-test vert. Skill `digit-ai-page-html` : +1 contre-exemple `anti-patterns.md` (T10). T15 déjà fait. T06/T07/T08/T13/T14/T17 restent « à évaluer » ; T11/T12/T16 non retenus. |
