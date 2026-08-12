## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-12) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.4.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Scanner un agent (statique)** | vérifier qu'un agent défini ne porte pas de capacités dangereuses | `node oracles\oracle-scan-agentdef.mjs <def>` | prouvé (experimental) |
| **Scanner les appels d'outils (dynamique)** | détecter les patterns d'attaque dans un journal d'exécution d'agent | `node oracles\oracle-scan-toolcalls.mjs <journal.jsonl> --perimetre <racine>` | prouvé (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-forge-pilot/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-forge-pilot/blob/main/catalogues/CATALOGUES.md).
