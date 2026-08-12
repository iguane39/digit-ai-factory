## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-12) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.3.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Fabriquer des agents spécialisés** | découper un workflow en agents outillés et vérifiés | `skill forge-agents (conversationnel) + compile-agent-def.mjs (fail-closed)` | prouvé (experimental) |
| **Ledger de run vérifiable** | journaliser tout run en JSONL auditable et vérifiable machine | `node .claude\skills\forge-agents\scripts\ledger.mjs verify <ledger.jsonl>` | prouvé (production) |
| **Atelier des skills qualité** | héberger et faire évoluer les outils transverses de qualité | `sources vivantes dans le dépôt agents ; chaîne d'admission avec fixture rouge juge` | prouvé (production) |
| **Projection OTLP GenAI du ledger** | rendre mes runs lisibles par tout backend d'observabilité | `node .claude\skills\forge-agents\scripts\otlp-project.mjs <ledger>` | prouvé (experimental) |
| **Oracle agent-evals** | détecter la régression sémantique d'un agent entre versions | `node .claude\skills\forge-agents\scripts\oracle-agent-evals.mjs` | prouvé (experimental) |
| **Gate budget G0** | plafonner les appels modèle d'un ticket avant l'appel, fail-closed | `.queue\gates\g0-budget.sh (hook PreToolUse)` | prouvé (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-forge-pilot/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-forge-pilot/blob/main/catalogues/CATALOGUES.md).
