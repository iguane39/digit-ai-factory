## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-13) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.6.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Juger l'exposition runtime** | savoir si mon produit servi expose une configuration dangereuse | `node scripts\capturer.mjs <url> <capture.json> puis node oracles\oracle-exposition.mjs <capture.json>` | prouvé (experimental) |
| **Scanner les dépendances vulnérables (SCA)** | savoir si mes dépendances portent des CVE connues, avec seuils | `node oracles\oracle-sca.mjs <racine-produit> [--seuils f.json]` | prouvé (experimental) |
| **Tenir un contrat de sécurité ASVS L1** | m'engager sur un niveau de sécurité vérifiable et daté | `referentiels\asvs-l1.md (frontmatter challenge_date)` | déclaré (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-forge-pilot/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-forge-pilot/blob/main/catalogues/CATALOGUES.md).
