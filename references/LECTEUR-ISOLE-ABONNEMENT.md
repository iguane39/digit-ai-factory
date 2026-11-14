---
role: la recette du lecteur isolé de tout contexte sur l'abonnement (commande, question piège, témoin, garde contre la clé d'API) et sa preuve d'usage ; remplace la prescription de `--bare`
sources_de_verite: [scripts/lecteur-isole.mjs, scripts/lecteur-isole.test.mjs, references/JETON-ABONNEMENT.md (le mode --bare), TF-2553, TF-2555]
verifie_le: 2026-11-14
revue_prevue: 2026-11-19
---

# Le lecteur isolé sur l'abonnement : la recette

Ce que change ce document pour vous : un lecteur qui doit répondre d'après un texte seul, sans rien savoir du projet, se lance
par une commande qui ne demande aucune clé d'API. `--bare` est écarté, parce qu'il ne lit aucun identifiant OAuth et exige une
clé d'API payante (`references\JETON-ABONNEMENT.md`) : un amendement qui le prescrivait a fait demander une clé et un secret au
créateur du produit, à tort, le 14/11/2026 (TF-2553).

## La commande

La commande suivante isole le lecteur sur l'abonnement du poste. Chacun des cinq verrous retire une source de contexte, et la
question passe par l'entrée standard, parce que `--tools ""` avale l'argument qui le suit.

```
claude -p --setting-sources "" --system-prompt "<consigne du lecteur>" --tools "" --disable-slash-commands --strict-mcp-config
```

| Verrou | Ce qu'il retire |
|---|---|
| `--setting-sources ""` | les réglages, et avec eux le CLAUDE.md et la mémoire du dossier |
| `--system-prompt` | la consigne système par défaut de Claude Code, remplacée par la seule consigne du lecteur |
| `--tools ""` | tous les outils : le lecteur ne peut ni lire un fichier ni lancer une commande |
| `--disable-slash-commands` | les skills |
| `--strict-mcp-config` | les serveurs MCP déclarés ailleurs que dans la ligne de commande |

## La recette, trois lancements

`node scripts\lecteur-isole.mjs --recette` joue trois lancements et se lit ainsi : une ligne par lancement, puis un verdict
TENU ou DÉFAUT. Le témoin est la même question de fuite sans aucun verrou, depuis le dossier du pilot : il doit citer la première
ligne du CLAUDE.md, sinon la sonde ne voit rien et la recette ne conclut pas. La fuite est cette question posée au lecteur isolé,
qui doit répondre AUCUN. Le piège est un texte qui dit « aucune forge ne s'appelle forge-ops », que le contexte du pilot
contredit : le lecteur isolé répond NON d'après ce texte seul, un lecteur qui laisse passer le contexte répond OUI.

La recette refuse de jouer (exit 2) quand `ANTHROPIC_API_KEY` ou `ANTHROPIC_AUTH_TOKEN` est posée : la CLI les emploie à la
place de l'abonnement et la facturation passe à l'usage. Elle ne demande jamais la valeur d'une clé. Son banc,
`scripts\lecteur-isole.test.mjs`, joue sans modèle une fausse CLI dans six scénarios : le vert, la fuite, le piège raté, le témoin
muet, la clé refusée et la CLI muette.

## La preuve d'usage

Le tableau se lit ligne par ligne : une ligne est une série de lectures réelles, avec sa provenance. Le coût est celui que la
CLI rapporte ; sur l'abonnement il n'est pas facturé à l'usage.

| Série | Lectures | Fuites | Lancements | Coût rapporté | Provenance |
|---|---|---|---|---|---|
| Relevé du produit forge-digit-ai-fr (TF-2555, amendement 2 du run 20261114a) | 6 | 0 (témoin AUCUN, piège NON) | 9 | 0,442 USD | rapporté par le produit, non recompté ici |
| Recette jouée au pilot le 14/11/2026, CLI 2.1.107 du paquet npm | 1 recette | 0 (isolé AUCUN, piège NON, témoin citant le CLAUDE.md) | 3 | 0,1894 USD | mesuré ici, `node scripts\lecteur-isole.mjs --recette --json` |

## Ce qui n'est pas jugé

- Le contenu des réponses d'un lecteur réel au-delà de la question de fuite et du piège : la recette prouve l'isolement, pas la
  qualité de la lecture.
- Une autre version de la CLI : la recette se rejoue après chaque changement de version, parce qu'un verrou renommé rouvrirait
  la fuite sans bruit.
