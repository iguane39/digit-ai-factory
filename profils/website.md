---
profil: website
version: 1.1.0
challenge_date: 2026-08-12
sources:
  - "WCAG 2.2 — W3C Recommandation ; échéance EAA (European Accessibility Act) passée le 28/06/2025"
  - "Core Web Vitals — web.dev / CrUX ; seuils LCP<2,5s / INP<200ms / CLS<0,1 au 75e percentile terrain"
  - "RGESN v2 — référentiel général d'écoconception de services numériques, 05/2024"
  - "étude d'opportunité forges — output\\03-etudes\\20260812-etude-opportunite-forges.md (12/08/2026), §2, 13 sources datées"
  - "TF-0236 — qualité graphique par défaut : étude output\\03-etudes\\20260815-etude-opportunite-qualite-graphique.md (15/08/2026)"
---

# Profil produit — website

Référentiel versionné (pas une forge — R-28, `REGLES-PROJET.md` §H) pour tout produit dont le
contrat premier est un **site web public** (vitrine, contenu, formulaire, e-commerce simple).
Périmètre : la part vérifiable machine est déjà outillée gratuitement par des oracles
officiels ; le reste est du savoir périssable capitalisé ici (loi transverse n° 4).

## 1. Standards vérifiables machine

| Norme / métrique | Seuil | Oracle gratuit qui juge |
|---|---|---|
| WCAG 2.2 AA (+ EAA) | conformité niveau AA ; cible tactile 2.5.8 ≥ 24×24 px | axe-core (couverture automatisable ~30-50 % du référentiel — le reste reste à l'audit manuel) |
| Core Web Vitals | LCP < 2,5 s · INP < 200 ms · CLS < 0,1, mesurés au 75e percentile CrUX (terrain) | PageSpeed Insights / Lighthouse |
| RGESN v2 (05/2024) | grille d'écoconception (poids de page, requêtes, DOM) | EcoIndex (score A→G) |
| SEO technique | indexabilité, balisage, Core Web Vitals terrain | Search Console (données réelles) + Lighthouse (audit ponctuel) |
| Direction artistique dérivée (loi n° 6) | `tokens.css` + `DESIGN.md` motivés par l'expérience client visée (`systeme-de-marque`), dérivation consignée — jamais un template | revue 5 bis (`critique-le-design`) sur la consignation ; gate étape 3 d'`ETAPES-RUN.md` |
| Généricité du rendu (loi n° 6) | zéro règle dure déclenchée — l'interface ne trahit pas un rendu par défaut | `oracle-taste.mjs` (forge-design, `cat-des-09`) |
| Régression visuelle (loi n° 6) | baseline approuvée à l'étape 3, jugée à toute évolution et en 5 bis | `oracle-baseline.mjs` (forge-design, `cat-des-08`) |

## 2. Savoir périssable daté-sourcé

| Pratique | Source datée | Pourquoi ça périme |
|---|---|---|
| EN 301 549 (norme d'accessibilité UE référencée par l'EAA), v3.2.1 en vigueur | v4.1.1 attendue courant 2026 | le référentiel réglementaire change de version sous le produit — une conformité AA jugée aujourd'hui peut être requalifiée à la sortie de la v4.1.1 |
| Responsive / écrans pliables (foldables) | familles d'écrans pliables en croissance, pas de norme de breakpoint figée | les breakpoints « standards » (mobile/tablette/desktop) ne couvrent plus la diversité réelle des form factors — à réévaluer par génération de terminaux |

## 3. Mapping de consommation par forge

| Forge | Ce que le profil active |
|---|---|
| ACCUEIL | routage de l'intention : « site web public » → charge ce profil pour qualifier l'entrant (`references\ACCUEIL.md`) |
| conception | typologie d'entrant « produit web public » ; exigences types intégrées dès `EXIGENCES.json` (a11y AA, CWV, SEO technique) |
| design | règles mobile M1-M6 + oracles design (`cat-des-05`, `run-oracles-design.mjs --mobile`) activées systématiquement |
| development | `.forge\profile.toml` déclare le profil « website » ; `targets\` sans logique applicative (pas de SaaS) |
| tests | pans accessibilité et performance en sus des pans standard (`cat-tst-01`) |
| seo | mission post-MEP (`cat-seo-02` audit 87 nœuds, `cat-seo-06` CWV terrain CrUX) — mandat humain requis |
| websec (12/08) | contrat sécurité pré/post-MEP (headers/TLS/CSP, dépendances) dès sa naissance — forge en construction |
