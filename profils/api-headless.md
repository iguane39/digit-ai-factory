---
profil: api-headless
version: 1.0.0
challenge_date: 2026-08-12
sources:
  - "OpenAPI Specification 3.2.0 — publiée 19/09/2025 (même socle JSON Schema 2020-12 que 3.1 ; additionalOperations, mediaTypes réutilisables)"
  - "RFC 9457 « Problem Details for HTTP APIs » — IETF, 07/2023, obsolète RFC 7807 ; media type application/problem+json"
  - "Spectral (Stoplight) — linter OpenAPI open source, ruleset intégré spectral:oas, gate CI via --fail-severity"
  - "Schemathesis 4.x — tests de contrat par génération de propriétés (moteur Hypothesis, cœur Rust), 2026"
  - "oasdiff — détection de breaking changes OpenAPI open source, action GitHub gratuite"
  - "étude d'opportunité forges — output\\20260812-etude-opportunite-forges.md (12/08/2026), §5"
---

# Profil produit — api-headless

Référentiel versionné (pas une forge — R-28, `REGLES-PROJET.md` §H) pour tout produit dont le
contrat premier est une **API exposée sans interface propre** (backend consommé par un tiers,
une app mobile, ou un autre service). Probabilité d'entrée forte : l'API FastAPI existe déjà
comme sous-produit de `development` (target SaaS) — ce profil documente le contrat OpenAPI
qu'elle génère déjà, sans construction nouvelle.

## 1. Standards vérifiables machine

| Norme / métrique | Seuil | Oracle gratuit qui juge |
|---|---|---|
| OpenAPI | 3.1 minimum (3.2, publiée 19/09/2025, recommandée) — contrat unique, source de vérité | validation de schéma (Redocly CLI / Swagger CLI, gratuits) |
| Lint du contrat | zéro erreur sur le ruleset `spectral:oas` (warn configurable en échec CI via `--fail-severity`) | Spectral (OSS, Stoplight) |
| Tests de contrat | zéro crash serveur, zéro violation du schéma de réponse déclaré | Schemathesis 4.x (OSS, génération par propriétés) |
| Erreurs API | corps conforme RFC 9457 (`application/problem+json` : type/title/status/detail/instance) | validation de schéma JSON (pan tests existant) |
| Breaking changes | zéro changement cassant non annoncé entre deux versions du contrat | oasdiff (OSS, CLI + action CI gratuite) |
| Versionnage | SemVer sur le contrat public ; changement cassant = version majeure | oasdiff signale le changement ; la décision de version reste humaine (aucun oracle gratuit ne classe SemVer automatiquement) |

## 2. Savoir périssable daté-sourcé

| Pratique | Source datée | Pourquoi ça périme |
|---|---|---|
| OpenAPI 3.2 (additionalOperations, mediaTypes réutilisables) | publiée 19/09/2025, encore récente | l'outillage (générateurs, linters) suit avec retard une version mineure fraîche — vérifier le support 3.2 de chaque oracle avant de l'exiger en CI |
| RFC 9457 remplace RFC 7807 | IETF, 07/2023 | des exemples et générateurs plus anciens documentent encore le média type `application/problem+json` de la RFC 7807 obsolète — à réaligner si copiés tels quels |
| Authentification API (OAuth2 / clés) | pas de norme unique, dépend du consommateur (machine-to-machine vs tiers public) | le choix se fait au cas par cas selon le client de l'API — ce profil ne fige pas un mécanisme, il exige que le contrat OpenAPI le documente (`securitySchemes`) |

## 3. Mapping de consommation par forge

| Forge | Ce que le profil active |
|---|---|
| ACCUEIL | routage de l'intention : « API sans interface propre » → charge ce profil |
| conception | typologie d'entrant « contrat d'API » ; exigences types pagination, erreurs RFC 9457, versionnage dès `EXIGENCES.json` |
| development | l'API FastAPI existe déjà (target SaaS) — documenter et versionner l'`openapi.json` généré comme livrable de contrat, pas seulement un artefact technique |
| tests | pan API déjà au catalogue (seuil 1.0) + lint Spectral et tests de contrat Schemathesis en sus |
| websec (12/08) | exposition et SCA s'appliquent à l'API comme à tout service exposé — forge en construction |
| seo | hors périmètre (pas de surface indexable propre à une API headless) |

