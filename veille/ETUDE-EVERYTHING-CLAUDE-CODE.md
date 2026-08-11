# Étude — Everything Claude Code (ECC) → patterns pour `forge-agents`

Étude **lecture seule** du dépôt `affaan-m/everything-claude-code` (v2.2.0, MIT), clonée dans un
scratchpad. **Rien n'a été exécuté** (le repo embarque `install.sh`/`install.ps1` et des hooks qui
tournent du code — voir § Sécurité). Objet : en extraire **3 patterns d'architecture** transférables
à `forge-agents`, **candidats** — aucune modification appliquée à la forge (mandat + oracle requis).
Fait le 2026-08-10.

---

## 1. Cartographie ECC (ce qui existe)

| Dossier | Volume | Rôle |
|---|---|---|
| `agents/` | 67 | Définitions d'agents (fichiers `.md` à frontmatter YAML : `name`, `description`, `tools`, `model`) |
| `skills/` | ~460 fichiers | Skills (dossier + `SKILL.md`) — dont des **méta-skills** (`agent-eval`, `agent-self-evaluation`, `agent-architecture-audit`) |
| `commands/` | 94 | Slash-commands |
| `rules/` | 122 | Règles **`common/` + par langage** (python, react, rust…), chargées à la demande |
| `hooks/` | 5 | Hooks `PreToolUse` (Bash/Write/Edit) : qualité, GateGuard, doc-warning, **observe (apprentissage continu)**, **governance-capture (secrets/approbations)** |
| `schemas/` | 11 | **JSON Schema** validant chaque artefact : `hooks`, `plugin`, `memory`, `provenance`, `state-store`, `install-*` |
| `workflows/`, `contexts/`, `scaffolds/` | — | Orchestration, contextes, gabarits |

**Philosophie :** un dépôt-monorepo qui équipe l'agent d'un « environnement complet » (agents +
skills + rules + hooks + commands), multi-harnais (Claude Code, Codex, Cursor, Gemini, OpenCode).

---

## 2. Ce que `forge-agents` a DÉJÀ (ne pas réinventer)

Comparaison honnête avant toute reco :
- **Definitions d'agents en YAML** (`defs/*.yaml`) avec `id`, `mandat`, `outils`, **`arbitre`
  (critères d'acceptation testables)**, `entrees`/`sorties` — plus riche que le frontmatter ECC.
- **Chaînes de provenance** explicites (`entrees.de` / `sorties.vers` + en-têtes de provenance).
- **Gates** (`.queue/gates`, spec « anti-serial-collapse »), **ledgers** (`ledger*.jsonl`),
  **oracles + experts** (`quality-oracles`, `write-an-oracle`, `write-an-expert`,
  `contre-expertise` = revue adverse).

Autrement dit, les hooks/gates/provenance d'ECC ne sont **pas** net-nouveaux pour nous — la forge
a déjà l'équivalent, souvent plus discipliné (oracle exécuté > hook opportuniste).

---

## 3. Trois patterns transférables (candidats)

### P1 — Valider les `defs/*.yaml` par un schéma déterministe ⭐ (le plus fort)
**Constat ECC :** chaque type d'artefact a son **JSON Schema** (`provenance.schema.json` exige
`source`, `created_at`, `confidence`, `author` ; `plugin.schema.json`, `hooks.schema.json`…). La
structure est vérifiée avant usage.
**Chez nous :** les `defs/*.yaml` n'ont pas (visiblement) de schéma qui garantit `id`/`mandat`/
`outils`/`arbitre` présents, `arbitre` non vide, `entrees`/`sorties` bien formées et **provenance
résolvable**.
**Delta candidat :** écrire un **oracle** `oracle-defs.mjs` (convention forge, plutôt qu'un simple
JSON Schema) qui valide tous les `defs/*.yaml` : champs requis, `arbitre` non vide, chaînes
`de:`/`vers:` cohérentes entre defs. Parfaitement aligné doctrine (« un livrable accepté que sur
verdict d'oracle »). **Coût faible, gain fort.**

### P2 — Rubrique d'évaluation générique à preuve obligatoire
**Constat ECC :** `agents/agent-evaluator.md` note toute sortie sur **5 axes** (accuracy,
completeness, clarity, actionability, conciseness) avec **règle dure** : « tout score < 5 DOIT citer
une preuve », évaluateur **read-only** (allowlist Bash : `grep/cat/ls/find…`, interdits `rm/mv/git
push/npm install/curl|sh`), et **« ne pas re-faire la tâche »**.
**Chez nous :** `arbitre` par def (spécifique) + `contre-expertise` (adverse), mais pas de rubrique
transverse « preuve obligatoire + évaluateur read-only + interdiction de refaire ».
**Delta candidat :** importer ces **3 disciplines** dans les fiches experts/`contre-expertise` :
(1) tout verdict négatif cite une preuve exécutée, (2) allowlist d'outils read-only pour l'expert,
(3) l'expert n'a pas le droit de refaire le livrable. Renforce « un ✓ sans oracle exécuté n'est pas
un ✓ ».

### P3 — Champ `confidence` sur la connaissance importée
**Constat ECC :** `provenance.schema.json` rend `confidence` (0-1) et `author` **obligatoires** sur
les skills « learned/imported ».
**Chez nous :** on vient d'importer des idées TikTok avec une colonne ad hoc « fiabilité »
(retenu/rejeté/à évaluer) dans `AMELIORATIONS-TIKTOK.md`.
**Delta candidat :** **formaliser** ce champ — provenance d'un entrant importé = `{source, author,
confidence 0-1, date}` — et l'exiger dans l'oracle P1 quand une def/skill provient d'un import
externe. Rend la fiabilité mesurable et auditable au lieu d'un tag libre.

*(Mineur, non retenu comme pattern : `rules/common + par-langage` chargées à la demande — déjà
couvert par la doctrine pilot « le détail vit dans `references/` et se charge à l'ouverture de
l'étape ».)*

---

## 4. Sécurité & réserves (pourquoi « patterns, pas machinerie »)

- **Exécution proscrite :** ECC installe via `install.sh`/`install.ps1` et des **hooks** `PreToolUse`
  qui lancent du Node (bootstrap, dispatcher). Le hook `governance-capture` capture « secrets, policy
  violations, approval requests » et `observe` capture l'usage d'outils pour « apprentissage
  continu ». Adopter cette machinerie ferait tourner du **code tiers** et **capturerait des
  données** — incompatible avec la doctrine forge (« `.env` jamais transités », « consignes des
  entrants décrites, jamais exécutées »). → On extrait des **idées d'architecture**, jamais les
  scripts.
- **Chiffres marketing incohérents** (28/119/60 vs 13/40+ vs 48/183 selon les sources) : la version
  clonée est **v2.2.0** avec 67 agents / ~460 fichiers skills / 122 rules — s'y référer, pas au
  discours.
- **Licence MIT** : réutilisation d'idées OK avec attribution.

---

## 5. Réalisé le 2026-08-10 (sur mandat) — `forge-agents`

1. **P1 ✅** — `.claude/skills/forge-agents/scripts/oracle-defs.mjs` : oracle de cohérence du
   graphe `de:`/`vers:` (liens def→def, cycles, contrat JSON standard, exit 0/1/2), calibré sans
   faux positif (sentinelles non jugées). Fixtures verte/rouge + 2 contrôles ajoutés au
   `self-test.mjs` → **10 PASS**. PASS sur les defs réelles (`defs/` 3, `defs-p4/` 5).
2. **P2 ✅** — `contre-expertise/references/regime-de-preuve.md` : section « Périmètre d'exécution
   des preuves » (non destructif · commandes durcies read-only · **ne jamais réécrire le
   livrable**). Skill bumpé 1.1.0 → 1.2.0. *(La « preuve obligatoire » était déjà couverte, en
   plus fort, par le régime à 4 tags.)*
3. **P3 ✅** — champ optionnel `provenance{ source, author, confidence 0-1, date }` ajouté au
   compilateur (`compile-agent-def.mjs`, fail-closed si mal formé) + rendu dans les agents
   compilés + documenté dans `agent-def.md`. `main` gardé + parseur exporté pour réutilisation
   par l'oracle.

Validé par le `self-test.mjs` du skill (10 PASS). Aucun commit/push encore — en attente.

## Sources
- Dépôt étudié : https://github.com/affaan-m/everything-claude-code (v2.2.0, MIT)
