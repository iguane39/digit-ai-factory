---
profil: mobile
version: 1.1.0
challenge_date: 2026-08-12
sources:
  - "Android — target API level 36 obligatoire en Play Console au 31/08/2026 (rejet automatique au-delà)"
  - "Apple — Privacy Manifest obligatoire à la soumission App Store (rejet automatique si absent/incomplet)"
  - "WCAG 2.5.8 (cible tactile ≥24×24 px) / Material Design (cible ≥48dp) — mêmes seuils, deux échelles"
  - "Apple HIG — refonte visuelle « Liquid Glass », iOS 26 (2025-2026)"
  - "Google Material 3 Expressive — 05/2025"
  - "Parts de marché cross-platform mobile — Flutter ~46 %, React Native ~35-42 %, Kotlin Multiplatform en croissance (mesure 02/2026, volatile)"
  - "étude d'opportunité forges — output\\03-etudes\\20260812-etude-opportunite-forges.md (12/08/2026), §2, 13 sources datées"
  - "TF-0236 — qualité graphique par défaut : étude output\\03-etudes\\20260815-etude-opportunite-qualite-graphique.md (15/08/2026)"
---

# Profil produit — mobile

Référentiel versionné (pas une forge — R-28, `REGLES-PROJET.md` §H) pour tout produit à
composante mobile. **Le web mobile est déjà couvert** (règles M1-M6 de design, cible tactile
WCAG 2.5.8) ; **le natif (app Android/iOS packagée) est le seul trou réel** de l'écosystème —
mais aucun produit mobile natif n'est jamais entré au pipeline (RUN-PILOTE et missions
réelles). Construire une forge sans produit à exercer contredirait le standard « née exercée »
(R-28 point 2) : ce profil documente d'ici là les exigences vérifiables, sous **clause de
réveil**.

> **Clause de réveil** : réévaluation OBLIGATOIRE du périmètre mobile natif (toolchain stores,
> signing, guidelines packagées) au premier brief produit mobile natif reçu — pas avant, faute
> de matière réelle à exercer.

## 1. Standards vérifiables machine

| Norme / métrique | Seuil | Oracle gratuit qui juge |
|---|---|---|
| Android — target API level | API 36 obligatoire | Play Console (rejet automatique à la soumission, au-delà du 31/08/2026) |
| Apple — Privacy Manifest | présence + déclarations exactes des API sensibles utilisées | App Store Connect (rejet automatique à la soumission) |
| Cible tactile | 24×24 px (WCAG 2.5.8, web mobile) / 48 dp (Material, natif) — un seul critère, deux échelles | axe-core (web mobile) ; contrôle manuel côté natif (aucun oracle gratuit identifié) |
| Viewport mobile | meta viewport correct, aucun contenu hors écran | Lighthouse (audit mobile) |
| Direction artistique dérivée (loi n° 6) | `tokens.css` + `DESIGN.md` motivés par l'expérience client visée (`systeme-de-marque`), dérivation consignée — jamais un template | revue 5 bis (`critique-le-design`) sur la consignation ; gate étape 3 d'`ETAPES-RUN.md` |
| Généricité du rendu (loi n° 6) | zéro règle dure déclenchée — l'interface ne trahit pas un rendu par défaut | `oracle-taste.mjs` (forge-design, `cat-des-09`) |
| Régression visuelle (loi n° 6) | baseline approuvée à l'étape 3, jugée à toute évolution et en 5 bis | `oracle-baseline.mjs` (forge-design, `cat-des-08`) |

## 2. Savoir périssable daté-sourcé

| Pratique | Source datée | Pourquoi ça périme |
|---|---|---|
| Apple HIG « Liquid Glass » | iOS 26, refonte visuelle 2025-2026 | révisée à chaque itération majeure d'iOS — les recommandations visuelles d'aujourd'hui ne survivent pas à la prochaine version majeure |
| Material 3 Expressive | Google, 05/2025 | succession rapide des révisions Material — un système de composants daté périme au rythme des releases Android |
| Paysage cross-platform (choix de stack) | Flutter ~46 %, React Native ~35-42 %, Kotlin Multiplatform en croissance (mesure 02/2026) | parts de marché volatiles d'une année sur l'autre — un choix de stack fondé sur ce chiffre doit être revérifié avant tout engagement |

## 3. Mapping de consommation par forge

| Forge | Ce que le profil active |
|---|---|
| ACCUEIL | routage de l'intention : « app mobile » → charge ce profil, applique la clause de réveil si le besoin est natif |
| conception | typologie d'entrant mobile ; distingue explicitement web mobile (couvert) de natif (trou réel documenté) |
| design | règles mobile M1-M6 (`cat-des-05`) suffisantes pour le web mobile ; natif hors périmètre design actuel |
| development | aucun target natif aujourd'hui — la clause de réveil déclenche la réévaluation au premier brief |
| tests | pans standard + cible tactile ; aucun pan store/signing outillé aujourd'hui |
| seo | hors périmètre (l'ASO — App Store Optimization — n'est pas du SEO web, non couvert par `cat-seo-*`) |
| websec (12/08) | applicable si backend partagé avec une webapp existante — forge en construction |
