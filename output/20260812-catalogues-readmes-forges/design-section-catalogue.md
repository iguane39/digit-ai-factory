## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-12) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.3.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Système de marque** | doter mon produit d'une identité et de tokens exploitables | `skills\systeme-de-marque (méthode, mode degrade)` | prouvé (experimental) |
| **Studio de direction** | explorer et trancher une direction artistique | `skills\studio-de-direction (méthode, mode degrade)` | prouvé (experimental) |
| **Améliorer le design (maquette)** | obtenir une maquette HTML autonome de mon interface | `skills\ameliore-le-design (méthode, mode degrade)` | prouvé (experimental) |
| **Critiquer le design (amont et aval)** | faire critiquer une maquette ou juger le produit rendu contre sa promesse design | `skills\critique-le-design (méthode) ; mode aval : revue graphique d'implémentation (ETAPES-RUN §5 bis)` | déclaré (experimental) |
| **Valider le design (oracles)** | vérifier mécaniquement charte, tokens, mobile, images et corpus | `node oracles\run-oracles-design.mjs <html> [--mobile] [--tokens t.css] [--json-only]` | prouvé (production) |
| **Générer les visuels** | produire les images et visuels réels de mes maquettes | `producteur d'images (Gemini) — spécifié chez design, exercé via le pilot` | prouvé (experimental) |
| **Tokens DTCG (source → dérivé)** | faire des tokens une source W3C interopérable, jamais éditée en CSS | `node scripts\generer-tokens-css.mjs · node oracles\oracle-dtcg.mjs <tokens.json> <css>` | prouvé (experimental) |
| **Baseline de régression visuelle** | détecter toute régression visuelle contre une référence approuvée versionnée | `node oracles\oracle-baseline.mjs [approuver|juger]` | prouvé (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-forge-pilot/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-forge-pilot/blob/main/catalogues/CATALOGUES.md).
