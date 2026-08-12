## Catalogue de services

> Section proposée par la campagne « catalogues » du pilot (2026-08-12) — générée depuis
> la source unique `catalogues/catalogue.jsonl` du pilot (v1.4.0, challengée état de
> l'art le 12/08/2026). **prouvé** = preuve exécutée ; *déclaré* = méthode documentée seulement.

| Service | Intention (« je veux… ») | Point d'entrée | Statut |
|---|---|---|---|
| **Qualifier l'entrant** | qualifier mon idée, CDC ou produit existant en entrant exploitable | `skills\qualifie-l-entrant (méthode, mode degrade)` | prouvé (experimental) |
| **Énumérer la surface** | énumérer toute la surface fonctionnelle de mon produit | `skills\enumere-la-surface (méthode, mode degrade)` | prouvé (experimental) |
| **Rédiger les exigences** | obtenir un référentiel d'exigences scellé et traçable | `skills\redige-les-exigences (méthode, mode degrade)` | prouvé (experimental) |
| **Dériver les vues aval** | produire le cadrage consommable par le design et la mission | `skills\derive-les-vues (méthode, mode degrade — D-C2 soldée le 04/08)` | prouvé (experimental) |
| **Valider les exigences (oracles)** | vérifier mécaniquement mon référentiel d'exigences | `node oracles\oracle-{exigences,tracabilite,surface,claims,etat,ears,constitution,delta}.mjs <artefact>` | prouvé (production) |
| **Constitution projet** | séparer mes invariants non négociables du référentiel qui évolue | `node oracles\oracle-constitution.mjs <CONSTITUTION.md>` | prouvé (experimental) |
| **Cycle delta (évolution d'un référentiel scellé)** | faire évoluer EXIGENCES.json par deltas proposés, appliqués, archivés | `node oracles\oracle-delta.mjs <delta> --referentiel <exigences> · node scripts\delta.mjs appliquer|archiver` | prouvé (experimental) |

Le catalogue consolidé des dix forges vit chez le pilot :
[digit-ai-forge-pilot/catalogues/CATALOGUES.md](https://github.com/iguane39/digit-ai-forge-pilot/blob/main/catalogues/CATALOGUES.md).
