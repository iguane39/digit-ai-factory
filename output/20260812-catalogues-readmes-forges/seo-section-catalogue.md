## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-12) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.1.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Créer une mission d'audit SEO** | ouvrir une étude SEO outillée chez mon produit | `python scripts\new_mission.py (CLI stdlib)` | prouvé (production) |
| **Dérouler l'audit 87 nœuds** | auditer mon site en ligne sur toute la grille, preuves à l'appui | `seo\METHODE.md déroulée en session (mandat humain requis — jamais de déclenchement automatique)` | prouvé (production) |
| **Valider forge et mission** | vérifier mécaniquement l'intégrité de la forge et d'une mission | `python scripts\validate.py [--mission <chemin>]` | prouvé (production) |
| **Rapport HTML vérifié** | recevoir un rapport d'audit autonome et contrôlé avant remise | `python scripts\rapport_html.py --verifier` | prouvé (production) |
| **Runs de suivi récurrents** | suivre l'évolution SEO d'un site entre deux audits | `méthode documentée (récurrence post-MEP)` | déclaré (experimental) |
| **Instrumentation de crawl avancée** | mesurer aussi les sites JS, le balisage, les CWV terrain et les crawlers IA | `python scripts\{crawler.py --rendu-js, crux.py, agents_ia.py}` | prouvé (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-forge-pilot/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-forge-pilot/blob/main/catalogues/CATALOGUES.md).
