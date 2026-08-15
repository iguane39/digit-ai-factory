---
profil: e-commerce
version: 1.1.0
challenge_date: 2026-08-12
sources:
  - "PCI DSS v4.0.1 — publiée 11/06/2024 (révision limitée de v4.0, aucune exigence ajoutée/retirée)"
  - "PCI DSS 6.4.3 et 11.6.1 — opposables (plus de simple bonne pratique) depuis le 31/03/2025"
  - "PCI Security Standards Council — retrait de 6.4.3/11.6.1 du SAQ A au 31/03/2025 (nouveau critère d'éligibilité anti-script)"
  - "schema.org Product — vocabulaire stable, validé par le Rich Results Test de Google"
  - "profil website — profils\\website.md (WCAG 2.2, Core Web Vitals, RGESN v2) — ce profil l'étend, ne le remplace pas"
  - "étude d'opportunité forges — output\\03-etudes\\20260812-etude-opportunite-forges.md (12/08/2026), §5"
  - "TF-0236 — qualité graphique par défaut : étude output\\03-etudes\\20260815-etude-opportunite-qualite-graphique.md (15/08/2026)"
---

# Profil produit — e-commerce

**Extension du profil `profils\website.md`** (pas un profil indépendant) — tout ce qui s'applique
à `website` s'applique ici (WCAG 2.2 AA, Core Web Vitals, RGESN v2, SEO technique) ; ce profil
n'ajoute que la part spécifique transaction/paiement. Référentiel versionné (pas une forge —
R-28, `REGLES-PROJET.md` §H).

**Paiement toujours DÉLÉGUÉ à un PSP** (Stripe, PayPal, ou équivalent) : aucune donnée de
carte ne transite ni ne se stocke côté produit — c'est la condition qui garde le périmètre
PCI DSS du produit proche de SAQ A / A-EP plutôt qu'un audit complet niveau marchand traitant
des données carte.

## 1. Standards vérifiables machine

| Norme / métrique | Seuil | Oracle gratuit qui juge |
|---|---|---|
| PCI DSS 4.0.1 — 6.4.3 | inventaire exhaustif des scripts chargés sur la page de paiement, chacun autorisé et intégrité vérifiée | CSP stricte + SRI (Subresource Integrity) sur chaque script tiers — `oracle-exposition` (websec) |
| PCI DSS 4.0.1 — 11.6.1 | détection de toute altération des en-têtes HTTP ou du contenu de la page de paiement entre serveur et navigateur | mécanisme de détection de changement/altération (CSP report-only + monitoring, ou service de tamper-detection dédié) |
| Paiement délégué PSP | aucune donnée de carte (PAN) dans les logs, le DOM persistant ou le stockage du produit | scan de secrets/PII du pan sécurité (forge-tests) + revue manuelle du flux |
| schema.org/Product | balisage structuré valide (nom, prix, disponibilité) | Rich Results Test (Google, gratuit) |
| Consentement RGPD | bandeau de consentement avant tout traceur non essentiel, opt-in explicite | audit manuel (aucun oracle gratuit de conformité RGPD identifié — écart noté) |
| CWV commerce | hérité du profil website : LCP < 2,5 s · INP < 200 ms · CLS < 0,1 (terrain, 75e percentile) — vigilance accrue sur les pages produit/panier, plus lourdes | PageSpeed Insights / Lighthouse |
| Direction artistique dérivée (loi n° 6) | `tokens.css` + `DESIGN.md` motivés par l'expérience client visée (`systeme-de-marque`), dérivation consignée — jamais un template | revue 5 bis (`critique-le-design`) sur la consignation ; gate étape 3 d'`ETAPES-RUN.md` |
| Généricité du rendu (loi n° 6) | zéro règle dure déclenchée — l'interface ne trahit pas un rendu par défaut | `oracle-taste.mjs` (forge-design, `cat-des-09`) |
| Régression visuelle (loi n° 6) | baseline approuvée à l'étape 3, jugée à toute évolution et en 5 bis | `oracle-baseline.mjs` (forge-design, `cat-des-08`) |

## 2. Savoir périssable daté-sourcé

| Pratique | Source datée | Pourquoi ça périme |
|---|---|---|
| PCI DSS 6.4.3 / 11.6.1 opposables | 31/03/2025 (PCI SSC) | date d'entrée en vigueur déjà passée à la rédaction (12/08/2026) — tout produit e-commerce livré aujourd'hui est directement soumis, sans période de tolérance |
| Éligibilité SAQ A | le PCI SSC a retiré 6.4.3/11.6.1 du SAQ A au 31/03/2025 et introduit un nouveau critère (site non susceptible d'attaque par script) | le formulaire d'auto-évaluation applicable au produit peut changer de catégorie sans changement de code — à revérifier auprès du PSP/acquéreur à chaque revue |
| PCI DSS 4.0.1 | révision limitée du 11/06/2024, sans nouvelle exigence | une v4.0.2 ou une v4.1 pourrait introduire de nouvelles exigences futures-datées — le calendrier d'opposabilité est à resurveiller à chaque challenge de ce profil |

## 3. Mapping de consommation par forge

| Forge | Ce que le profil active |
|---|---|
| ACCUEIL | routage de l'intention : « site marchand / paiement » → charge ce profil EN SUS de `website.md` |
| conception | exigences types transactionnelles (panier, commande, statut de paiement délégué au PSP) dès `EXIGENCES.json`, en plus des exigences website |
| design | hérité de website (règles mobile M1-M6) ; composants panier/paiement soumis aux mêmes oracles design |
| development | intégration PSP côté serveur (jamais de champ carte dans le formulaire du produit — iframe/redirect PSP) ; `.forge\profile.toml` porte `e-commerce` en extension de `website` |
| tests | pans standard website + vérification CSP/SRI sur la page de paiement (pan sécurité) |
| websec (12/08) | priorité haute : oracle-exposition (CSP/SRI = 6.4.3) et détection d'altération (11.6.1) sont la matière propre de ce profil — forge en construction |
| seo | hérité de website (`cat-seo-02`/`06`) + schema.org/Product sur les pages fiche produit |

