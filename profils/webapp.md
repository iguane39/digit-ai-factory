---
profil: webapp
version: 1.0.0
challenge_date: 2026-08-12
sources:
  - "Core Web Vitals — web.dev / CrUX ; INP<200ms au 75e percentile (remplace FID depuis 03/2024)"
  - "WAI-ARIA 1.2/1.3 — W3C ; les patterns APG (design patterns) ne sont PAS machine-testables"
  - "Lighthouse PWA — audit installabilité (manifest + service worker + HTTPS)"
  - "DTCG (Design Tokens Community Group) — spécification 2025.10, schéma vérifiable, hors standards-track W3C"
  - "étude d'opportunité forges — output\\20260812-etude-opportunite-forges.md (12/08/2026), §2, 13 sources datées"
---

# Profil produit — webapp

Référentiel versionné (pas une forge — R-28, `REGLES-PROJET.md` §H) pour tout produit dont le
contrat premier est une **application web** (compte, session, logique métier). `development`
EST déjà la forge webapp (run-playbook SaaS, double gate) — ce profil rend l'implicite explicite
et pointe l'oracle déjà outillé côté design (`oracle-dtcg`), pas une nouvelle construction.

## 1. Standards vérifiables machine

| Norme / métrique | Seuil | Oracle gratuit qui juge |
|---|---|---|
| Core Web Vitals — INP | INP < 200 ms au 75e percentile (terrain CrUX ou lab) | PageSpeed Insights / Lighthouse |
| WAI-ARIA 1.2/1.3 | rôles, états, propriétés valides (les patterns APG restent hors portée machine) | axe-core (couverture partielle, même contrat que website) |
| PWA — installabilité | manifest + service worker + HTTPS présents et valides | Lighthouse (audit PWA) |
| Tokens DTCG 2025.10 | schéma valide, `tokens.css` synchronisé avec la source `.tokens.json` | `oracle-dtcg.mjs` (forge-design, règles D1-D3, `cat-des-07` — déjà outillé, zéro construction) |

## 2. Savoir périssable daté-sourcé

| Pratique | Source datée | Pourquoi ça périme |
|---|---|---|
| App shell / offline-first (cache applicatif) | pattern PWA dépendant du support navigateur (Baseline évolutif) | les API de cache et le support navigateur évoluent chaque année — un pattern « à jour » se périme sans changement de code |
| Statut DTCG hors standards-track | DTCG reste un community group W3C (pas encore Recommandation) à la version 2025.10 | le schéma peut encore bouger avant standardisation formelle — toute règle d'oracle bâtie dessus hérite de cette instabilité |

## 3. Mapping de consommation par forge

| Forge | Ce que le profil active |
|---|---|
| ACCUEIL | routage de l'intention : « application avec compte / logique métier » → charge ce profil |
| conception | typologie d'entrant « produit applicatif » ; exigences types interaction/état/session |
| design | `oracle-dtcg.mjs` (`cat-des-07`) sur les tokens ; règles mobile M1-M6 seulement si usage tactile avéré |
| development | development EST la forge webapp — `.forge\profile.toml` + `targets\fastapi-saas` ; double gate `cat-dev-01`/`cat-dev-02` |
| tests | 12 pans intégral (`cat-tst-01`), dont front/batch à seuil 0,90 et mutation à 0,70 |
| seo | hors périmètre principal, sauf pages publiques de l'application (marketing/landing) — alors `cat-seo-02`/`06` |
| websec (12/08) | contrat sécurité applicatif (auth, session, ASVS) prioritaire — forge en construction |
