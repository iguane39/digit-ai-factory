# Veille outillage Claude Code — dossier d'étude (entrants TikTok v1 & v3)

Dossier de **veille**, pas d'adoption. Issu des entrants `input\Tiktok vidéos` (T13, T14 de
[AMELIORATIONS-TIKTOK.md](AMELIORATIONS-TIKTOK.md), statut « à évaluer »). Chaque affirmation des
vidéos est **confrontée à une vérification web** ; les contenus sont **AI-générés / affiliés**,
donc traités comme pistes à qualifier, jamais comme faits établis. Vérifié le 2026-08-10.

> **Garde-fou doctrine.** Rien ici n'est branché sur les forges. Deux règles pilotent l'évaluation :
> « aucune API tierce payante hors modèles Claude » et « les `.env` ne transitent jamais ». Tout
> outil qui **route les prompts/le code par un tiers** est, par défaut, hors-cadre pour un usage
> forge — même s'il est intéressant à étudier.

---

## 1. Les 5 « plugins » de la vidéo v1 (@milesreevesai)

Vidéo au format « ne code plus sans ces 5 plugins », **avec lien affilié** (« link in
description »). Verdict global : **1 réel et documenté, 1 qui est en fait un sous-module, 3 non
confirmés**. Prudence : plusieurs de ces outils s'installent via des scripts tiers.

| Plugin annoncé | Ce que la vidéo prétend | Vérification | Verdict |
|---|---|---|---|
| **OmniRoute** | Connecte 200+ providers d'API IA, bascule automatique, « 1,6 milliard de tokens gratuits/mois » | **Réel** : passerelle IA open-source (MIT), « one endpoint, 290+ providers, 500+ modèles », compression RTK/Caveman 15-95 %. Mais **plusieurs forks** (`brwarashidpour/omniroute`, `diegosouzapw/OmniRoute`) et discours très promotionnel. | à évaluer — **hors-cadre forge** (route les prompts par des tiers → collision doctrine) ; intéressant surtout pour la **techno de compression de contexte** |
| **Headroom** | « S'intercale et ne laisse passer que l'utile, compresse le contexte » | **Sous-module d'OmniRoute** (« Headroom tabular compaction »), pas un plugin autonome. | à évaluer (composant d'OmniRoute) |
| **ClaudeMem** | Mémoire persistante inter-sessions | **Non confirmé** par la recherche. Des outils de « mémoire » Claude Code existent, mais aucun ne ressort sous ce nom exact. | non confirmé — à ne pas installer sur la foi de la vidéo |
| **Claude Code Setup** | « Plugin officiel Anthropic : scanne le repo → recommande hooks/skills/subagents/MCP » | **Non confirmé sous ce nom.** Anthropic fournit bien un système de plugins/marketplace `/plugin` officiel — possible confusion. | non confirmé — vérifier côté doc Anthropic officielle |
| **Task Observer** | « Observe ton style et améliore tes skills en tâche de fond » | **Non confirmé.** | non confirmé |

**Lecture critique.** Le format « 5 plugins, lien en description » est un patron d'affiliation. Le
seul solidement réel (OmniRoute) a une **premisse incompatible avec la doctrine forge** : son
intérêt est d'utiliser des providers tiers gratuits/à quota, ce que le pilot s'interdit (modèles
Claude uniquement, `.env` jamais partagés). À retenir pour étude : **les techniques de compression
de contexte** (RTK, Caveman, LLMLingua-2, Headroom) — un sujet légitime, indépendamment de l'outil.

---

## 2. Repo « Everything Claude Code » (vidéo v3, @kira.nex.tech)

| Élément | Détail |
|---|---|
| **Réel ?** | **Oui.** `github.com/affaan-m/everything-claude-code`. Auteur : **Affaan Mustafa**, vainqueur du hackathon **Anthropic × Forum Ventures** (2025). Licence **MIT**. |
| **Popularité** | Très forte (dizaines à ~185 k étoiles selon les sources et la date). |
| **Contenu** | Collection de configs Claude Code : **agents/subagents, skills, slash commands, rules, hooks, MCP servers**. Compatible Claude Code, Codex, Cursor, Gemini, OpenCode. |
| **Chiffres** | **Incohérents selon les sources** : la vidéo dit 28 subagents / 119 skills / 60 commandes ; d'autres annoncent 13 agents / 40+ skills, ou 48 subagents / 183 skills. Le repo évolue vite et le marketing gonfle — **ne pas citer un chiffre sans vérifier la version**. |
| **Claims à vérifier** | « 1282 tests / 98 % coverage », « research-first development », « battle-tested » : plausibles mais **non vérifiés ici** — à contrôler dans le repo. |

**Pourquoi c'est pertinent pour nos forges.** C'est une **architecture de référence** pour
`forge-agents` et `forge-development` : comment structurer subagents + skills + hooks + commandes +
rules dans un même dépôt. Bon matériel d'étude comparative avec notre propre découpage de forges.

**Réserves.** Volumineux et opinionated ; licence MIT (réutilisation OK avec attribution). À
**miner pour des patterns**, pas à adopter en bloc. La philosophie « research-first development »
recoupe des principes déjà présents chez nous.

---

## 3. Recommandation d'étude (priorisée)

1. **Everything Claude Code** — cloner en lecture seule, lire l'organisation `agents/ skills/
   hooks/ commands/ rules/`, en tirer 2-3 patterns d'architecture pour `forge-agents`. **Ne rien
   exécuter aveuglément** (hooks = code qui tourne).
2. **Techniques de compression de contexte** (concept, pas l'outil) — RTK, Caveman, LLMLingua-2 :
   sujet propre, utile pour l'efficience tokens, indépendant d'OmniRoute.
3. **OmniRoute / plugins v1** — **ne pas installer** dans le cadre forge (providers tiers, doctrine).
   À regarder seulement comme objets d'étude techno.
4. **ClaudeMem / Task Observer / Claude Code Setup** — non confirmés : d'abord **retrouver la
   source primaire** (pas la vidéo) avant toute considération.

---

## Sources

- Everything Claude Code — dépôt : https://github.com/affaan-m/everything-claude-code
- Everything Claude Code — analyse : https://www.augmentcode.com/learn/everything-claude-code-github
- Everything Claude Code — évaluation tierce : https://github.com/FlorianBruniaux/claude-code-ultimate-guide/blob/main/docs/resource-evaluations/015-everything-claude-code-github-repo.md
- OmniRoute — dépôt (un des forks) : https://github.com/diegosouzapw/OmniRoute
- OmniRoute — guide tiers : https://explainx.ai/blog/omniroute-ai-gateway-free-llm-proxy-claude-code-2026

*Liens externes non audités ; à ouvrir avec prudence (installeurs tiers).*
