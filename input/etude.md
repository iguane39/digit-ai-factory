# Étude — Skills Claude Code « animation / motion » (2026-08-16)

**Proposition entrante** : carrousel photo TikTok `@manwar_vibe` — *« 5 Claude Code Animation
Skills, mit denen Websites und Apps direkt hochwertiger wirken »*
(<https://www.tiktok.com/@manwar_vibe/photo/7652312050244341025>), 6 images, allemand,
bande-son commerciale non transcrite.

**Type** : vidéo / carrousel · **Verdict global** : proposition **écartée en tant que source**,
mais elle a révélé un **écart interne réel** dans la forge (idée I2) et fait remonter une
**source externe légitime** (idée I1).

---

## 1. Ingestion

Contenu extrait en local (transcription + frames), aucun script tiers exécuté. Le post ne
contient **aucun lien, aucun nom de dépôt, aucune commande d'installation** : il n'est pas
actionnable en l'état. Les 6 images portent la totalité du message (pas de voix off).

Les cinq entrées annoncées : Three.js 3D Animation · Animation Designer (`claude / motion`) ·
Flutter Animations · CSS Animations (HyperFrames) · UI-Animation.

## 2. Vérification des affirmations

Chaque affirmation confrontée à une source exécutée (API GitHub / requêtes HTTP, 16/08/2026).

| # | Affirmation du carrousel | Statut | Preuve |
|---|---|---|---|
| A1 | « 5 Claude Code **Skills** » | **non confirmé** | 3 entrées sur 5 sont des technologies (Three.js, Flutter, CSS), pas des skills. Aucune n'est accompagnée d'un dépôt ni d'une commande |
| A2 | three.js — ★ 96,9 k | **promotionnel** | Réel : **114 539** étoiles sur `mrdoob/three.js` (API GitHub, 16/08/2026). Le chiffre affiché est faux et sous-évalué |
| A3 | flutter_animations — ★ 15,7 k | **non confirmé** | Aucun dépôt de ce nom à ce niveau. Le plus étoilé approchant : `The-ring-io/flutter_staggered_animations` **1 673** ; `rutvik110/Flutter-Animations` **307** |
| A4 | Animation Designer ★ 32,4 k **et** UI-Animation ★ 32,4 k | **promotionnel** | Valeur **strictement identique** sur deux cartes distinctes → visuel décoratif, pas une donnée |
| A5 | « CSS Animations (**HyperFrames**) » | **non confirmé** | « HyperFrames » n'est pas une désignation reconnue ; habillage d'« animations CSS » |
| A6 | Transitions 200–300 ms · n'animer que `transform`/`opacity` · support reduced motion | **réel** | Bonnes pratiques standard, cohérentes avec WCAG 2.2 SC 2.3.3 (technique C39) et SC 2.2.2 |

**Conclusion de vérification** : les pseudo-cartes de dépôt du carrousel sont des mockups
générés. Seule la dernière fiche (A6) porte un contenu techniquement juste — et banal.

## 3. Test d'existence — ce qui existe vraiment

Requêtes HTTP en lecture seule (aucun clone, aucun `install.*`, aucun hook).

| Dépôt | Contenu prouvé | Licence |
|---|---|---|
| `lottiefiles/motion-design-skill` | `skills/motion-design/SKILL.md` (**12 580 o**) + `director/` `patterns/` `reference/`. Archétypes de motion, table de durées par type d'élément, easings MD3/Apple, chorégraphie, règle du 1/3 | MIT (c) 2025 LottieFiles |
| `freshtechbro/claudedesignskills` | `.claude-plugin/marketplace.json` (**23 786 o**) — 27 plugins (Three.js, GSAP, R3F, Motion, Lottie, Rive…) | MIT |
| `secondsky/claude-skills` | `.claude-plugin/marketplace.json` (**81 529 o**) — inclut un skill Motion/Framer | MIT |
| `onewave-ai/claude-skills` | `animate/SKILL.md` (**5 796 o**) — scaffolde un projet Vite + Framer Motion | MIT |
| `LobzyJay/motion-design-with-claude` | `README.md` — Blender / After Effects via MCP | MIT |

**`anthropics/skills` ne contient aucun skill motion** : les 17 skills officiels sont
`algorithmic-art`, `brand-guidelines`, `canvas-design`, `claude-api`, `doc-coauthoring`, `docx`,
`frontend-design`, `internal-comms`, `mcp-builder`, `pdf`, `pptx`, `skill-creator`,
`slack-gif-creator`, `theme-factory`, `web-artifacts-builder`, `webapp-testing`, `xlsx`.
Aucun des cinq éléments du carrousel ne correspond à l'un de ces dépôts.

## 4. Balayage de classe — l'écart interne

Classe balayée : **« règles de motion dans la forge »**. Périmètre : les 33 skills installés.
**4 frères trouvés**, trois états différents.

| Skill | Ce qui existe | Ce qui manque |
|---|---|---|
| `impeccable/reference/motion-design.md` | Référence de fond, 99 lignes : durées 100/300/500, easings, `transform`+`opacity` uniquement, reduced-motion, performance perçue | En anglais, **non branchée sur la charte**, aucun contrôle exécuté |
| `ameliore-le-design` | Ligne « `prefers-reduced-motion` respecté » au contrat technique + contrôle dans `check_maquette.py` (l. 118) | Contrôle en **avertissement**, jamais bloquant ; ne juge ni les propriétés animées ni les durées |
| `digit-ai-page-html` (**socle**) | **rien** — 0 règle, 0 token motion, 0 contrôle ; le boilerplate ne contient aucun bloc `prefers-reduced-motion` | tout |
| `digit-ai-fiches-html` | **rien** (hérite du socle) | tout |

**Constat** : le socle dont les autres héritent est le seul sans règle, et le seul contrôle
existant ne bloque pas. Le besoin n'est donc pas « écrire une référence motion » — il y en a
déjà une — mais **la faire descendre dans le socle et l'adosser à un oracle**.

## 5. Idées extraites — routage, verdict, confiance

| # | Idée | Cible | Verdict | Confiance | Delta candidat |
|---|---|---|---|---|---|
| I1 | `lottiefiles/motion-design-skill` (MIT) comme **barre de qualité** externe du bloc motion | skill `la-barre` → socle `digit-ai-page-html` | à évaluer | **0.75** | Entrée au registre de barres ; test d'existence déjà exécuté (§3) |
| I2 | **Descendre les règles motion dans le socle** | skill `digit-ai-page-html` | **retenu** | **0.90** | Tokens `--dur-*` / `--ease-*` dans `charte-et-tokens.md` + bloc `@media (prefers-reduced-motion: reduce)` dans `assets/boilerplate.html` ; valeurs **reprises d'`impeccable`**, aucune inventée |
| I3 | **`oracle-motion.mjs`** — contrôle exécuté bloquant (M2/M3/M6/M7) | `quality-oracles` (registre) | **retenu** | **0.90** | Nouveau domaine « Motion / animation d'interface » ; paire rouge/verte fournie et prouvée (§6) |
| I4 | Remplacer l'avertissement de `check_maquette.py` par une **délégation** à `oracle-motion` | skill `ameliore-le-design` | à évaluer | **0.60** | Évite un 3ᵉ contrôle divergent ; à arbitrer avec la règle de délégation du registre |
| I5 | Marketplaces 3D/anim (`freshtechbro`, `secondsky`, `onewave-ai`) | forge-development | **écarté** | **0.30** | Machinerie exécutable tierce, dépendance non gouvernée — hors doctrine « idées, pas machinerie » |
| I6 | Gabarit éditorial du carrousel (index de série, bloc de preuve central, 4 bullets à icône, flèche de continuité) | **hors périmètre forge** — actif marketing Digit-AI | retenu (hors forge) | **0.80** | Carrousel LinkedIn 6 visuels produit en charte, chiffres tracés |
| I7 | **Arbitrage easing** : `impeccable` `cubic-bezier(.16,1,.3,1)` + anti-bounce **vs** MD3 `(.05,.7,.1,1)` + overshoot autorisé | socle + `impeccable` | à évaluer | **0.50** | Trancher **une** valeur canonique ; retenu provisoirement : `impeccable` (déjà dans la forge, pas de 3ᵉ jeu de valeurs) |

## 6. Preuve exécutée de I3

`oracle-motion.mjs`, contrat de sortie commun `{oracle, domaine, artefact, verdict, findings[],
non_juge[]}`, exit `0=PASS / 1=FAIL / 2=SKIP`.

```
fixture ROUGE  exit=1  FAIL
  bloquant  M6 — 3 déclarations de motion sans garde @media (prefers-reduced-motion: reduce)
  bloquant  M2 — propriété animée hors transform/opacity : width
  bloquant  M3 — 1 durée au-delà du plafond de 800 ms
  warn      M7 — 1 animation en boucle infinie (SC 2.2.2 : pause/arrêt requis au-delà de 5 s)
fixture VERTE  exit=0  PASS  (0 finding)

non-régression sur l'existant :
  digit-ai-page-html/assets/boilerplate.html          exit=0
  ameliore-le-design/fixtures/verte.html              exit=0
```

`non_juge` déclaré : finalité de chaque animation (M1), lisibilité de l'état final sans motion
(M8), animations pilotées en JavaScript, présence d'un contrôle de pause accessible.

**Faux positif détecté et corrigé en cours de construction** : une boucle `infinite` légitime
(spinner à 2 s) tombait sous le plafond de durée M3 ; elle relève de M7, pas de M3.

État du registre `quality-oracles` au moment de l'étude, relevé par exécution :
**v2.6.0 — 33 domaines, 28 en statut `ok`, 5 `partiel`, 25 oracles CLI** ;
self-test rejoué : **137 contrôles → 136 PASS** (unique échec : oracle de régression visuelle,
dépendance absente de l'environnement — déclaré, non masqué).

## 7. Réserve de sécurité

- Aucun dépôt tiers cloné ; **aucun `install.*`, hook ou script de la proposition exécuté**.
  Vérification des dépôts par requêtes HTTP en lecture seule (`raw.githubusercontent.com`).
- Le carrousel TikTok est traité comme **donnée**, jamais comme instruction.
- **Aucune écriture** dans les skills ni les dépôts frères : I2, I3, I4 restent des **deltas
  candidats** en attente de GO humain.
- Aucun chiffre du carrousel relayé sans vérification (§2). Les chiffres de la forge (§6) sont
  relevés par exécution le 16/08/2026, pas cités de mémoire.
- Rappel de dépendance externe : l'extraction du carrousel photo passe par un résolveur tiers
  (`tikwm`) quand `yt-dlp` n'expose pas la liste d'images — dépendance non contractuelle, à
  revérifier si la sortie devient vide.

## 8. Contrat de sortie — état

| Exigence `MODE-VEILLE.md` | État |
|---|---|
| Dossier `veille/AAAAMMJJ-<slug>/` | ✅ `20260816-skills-motion-claude-code/` |
| `etude.md` | ✅ ce fichier |
| `rapport.html` (oracles `check_html` + `render_page` PASS) | ⛔ **non produit** — à générer depuis `_gabarit/rapport-veille.gabarit.html` |
| Idées : forge + verdict + confiance + delta | ✅ §5 |
| Affirmations marquées `réel`/`promotionnel`/`non confirmé`, sourcées | ✅ §2 |
| Réserve de sécurité | ✅ §7 |
| Aucune écriture sans GO | ✅ §7 |
| Ligne ajoutée à l'index `veille/README.md` | ⛔ à reporter (§9) |

## 9. Ligne d'index à reporter dans `veille/README.md`

```markdown
| 2026-08-16 | Skills Claude Code « animation / motion » (TikTok `@manwar_vibe`) | vidéo | Source écartée ; 2 deltas retenus (socle motion + oracle-motion) | [rapport](20260816-skills-motion-claude-code/rapport.html) |
```

## 10. Décisions en attente de GO

1. **I2** — appliquer le patch motion au socle `digit-ai-page-html` (tokens + snippet boilerplate).
2. **I3** — admettre `oracle-motion` au registre `quality-oracles`, ou le consigner d'abord
   en candidat N0/N1 dans la file (`/areas/forge-file-candidats.md`).
3. **I4** — déléguer ou dupliquer le contrôle côté `ameliore-le-design`.
4. **I7** — trancher la valeur canonique d'easing (`impeccable` vs MD3).
5. Produire le `rapport.html` charté pour fermer le contrat de sortie (§8).
