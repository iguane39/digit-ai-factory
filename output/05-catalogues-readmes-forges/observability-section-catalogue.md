## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-12) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.5.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Observer (plans → snapshots)** | surveiller entre les runs ce que l'écosystème ne vérifie qu'en one-shot | `node scripts\observer.mjs <plan.json>` | prouvé (experimental) |
| **Détecter la dérive** | être alerté quand quelque chose a changé depuis le dernier passage | `node scripts\derive.mjs <snapshots.jsonl>` | prouvé (experimental) |
| **Veille citation IA** | suivre la présence d'un domaine dans les réponses génératives | `veille-ia\METHODE.md (méthode manuelle documentée)` | déclaré (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-forge-pilot/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-forge-pilot/blob/main/catalogues/CATALOGUES.md).
