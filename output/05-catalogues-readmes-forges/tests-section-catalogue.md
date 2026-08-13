## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-13) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.6.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Auditer une suite de tests** | savoir ce que mes tests couvrent vraiment et ce qui n'est pas exercé | `uv run python -m forge_tests <racine> --json [--sortie <fichier>]` | prouvé (experimental) |
| **Générer des cas de tests en proposition** | recevoir des cas de tests prêts à adopter, sans pollution de mon projet | `uv run python -m forge_tests <racine> --generer <dossier-proposition>` | prouvé (experimental) |
| **Livrables de tests dérivés** | obtenir cahiers de tests, jeu de données synthétique et dashboard | `uv run python -m forge_tests <racine> --livrables <dossier-proposition>` | prouvé (experimental) |
| **Tendance et reprise ciblée** | comparer deux audits et ne rejouer que ce qui n'était pas vert | `uv run python -m forge_tests <racine> --precedent <r.json> | --reprendre <r.json>` | prouvé (experimental) |
| **Inventaire sans exécution** | cartographier la surface de test sans rien exécuter | `env FORGE_TESTS_SANS_EXECUTION=1 + CLI` | déclaré (experimental) |
| **Impact par diff, flaky, propriétés, mutation par risque** | auditer moins mais juste : cibler par diff, isoler les flaky, proposer du property-based | `forge_tests\{impact,flaky,generateur_proprietes}.py · risque.repartir_mutants` | déclaré (experimental) |
| **Rapport exhaustif test-par-test** | obtenir le verdict et le pourquoi de CHAQUE test, pas seulement un agrégat par pan | `forge_tests
oyau.py (section essais) + forge_tests\junit.py` | prouvé (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-forge-pilot/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-forge-pilot/blob/main/catalogues/CATALOGUES.md).
