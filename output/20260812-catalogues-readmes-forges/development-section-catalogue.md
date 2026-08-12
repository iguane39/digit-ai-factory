## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-12) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.1.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Construire le produit sous gates** | transformer mes exigences et mon design en produit qui fonctionne | `méthode du run-playbook appliquée par agent (mode degrade) ; gates rejoués : ruff check + pytest` | prouvé (experimental) |
| **Double gate code + design** | garantir que rien ne passe sans vérification code ET design | `.github\workflows\double-gate.yml + conductor\gates\design_gate.py` | prouvé (production) |
| **Gate spec (under/over-build)** | détecter ce que le code sous-livre ou sur-livre par rapport à la spec | `conductor (gate spec), remédiation bornée à 3` | déclaré (experimental) |
| **Conductor bout en bout (CLI)** | lancer « idée → SaaS » en une commande | `uv run --project <forge> python -m conductor run "<idée>"` | déclaré (experimental) |
| **Générer DESIGN.md linté** | produire le document design du produit accepté par le gate | `generer-design-md.mjs (D-V2 soldée le 07/08)` | prouvé (experimental) |
| **Gate anti-patterns IA** | bloquer imports fantômes, secrets en dur et routes sans auth avant merge | `conductor\gates\ai_antipatterns_gate.py` | prouvé (experimental) |
| **Gate de mutation (3e métrique)** | mesurer la force réelle de mes tests, pas seulement leur couverture | `conductor\gates\mutation_gate.py + job CI mutation` | prouvé (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-forge-pilot/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-forge-pilot/blob/main/catalogues/CATALOGUES.md).
