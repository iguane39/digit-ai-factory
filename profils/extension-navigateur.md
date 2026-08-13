---
profil: extension-navigateur
version: 1.0.0
challenge_date: 2026-08-12
sources:
  - "Chrome — Manifest V2 désactivé par défaut depuis Chrome 138 (07/2025) ; retrait définitif du Chrome Web Store le 31/08/2026"
  - "Chrome for Developers — calendrier de dépréciation Manifest V2 (drapeaux développeur fermés le 28/07/2026)"
  - "web-ext (Mozilla) — outil CLI officiel de lint/build/run des WebExtensions, dépendance addons-linter maintenue en 2026"
  - "étude d'opportunité forges — output\\03-etudes\\20260812-etude-opportunite-forges.md (12/08/2026), §5"
---

# Profil produit — extension-navigateur

Référentiel versionné (pas une forge — R-28, `REGLES-PROJET.md` §H) pour tout produit dont le
contrat premier est une **extension de navigateur** (Chrome/Edge/Firefox). Manifest V3 est la
seule cible viable aujourd'hui : Manifest V2 est déjà mort en exécution (Chrome 138, 07/2025)
et disparaît du Chrome Web Store le 31/08/2026 — aucun produit ne doit être conçu sur V2.

**Soumission = revue non maîtrisée** : la publication sur un store (Chrome Web Store, Add-ons
Mozilla) passe par une revue humaine/automatisée du store, hors contrôle du produit — les
oracles ci-dessous garantissent la conformité au schéma et aux règles connues, pas l'acceptation
finale par le store.

## 1. Standards vérifiables machine

| Norme / métrique | Seuil | Oracle gratuit qui juge |
|---|---|---|
| Manifest | V3 obligatoire (V2 mort en exécution depuis Chrome 138, retiré du Store le 31/08/2026) | validation de schéma du manifeste (`web-ext lint`, addons-linter) |
| Permissions | déclaration minimale (principe du moindre privilège), chaque permission justifiée | `web-ext lint` signale les permissions larges/inutilisées |
| CSP de l'extension | pas de code distant (`remote code` interdit en MV3), CSP restrictive déclarée dans le manifeste | `web-ext lint` + revue du champ `content_security_policy` |
| Service workers | non persistants (remplacent les background pages de MV2), pas d'état supposé permanent en mémoire | revue de code + `web-ext lint` (détecte les patterns MV2 résiduels) |
| Réseau | `declarativeNetRequest` à la place du `webRequest` bloquant (retiré en MV3) | revue de code (aucun oracle automatique de détection d'usage résiduel identifié — écart noté) |

## 2. Savoir périssable daté-sourcé

| Pratique | Source datée | Pourquoi ça périme |
|---|---|---|
| Calendrier de retrait Manifest V2 | drapeaux développeur fermés le 28/07/2026, retrait du Chrome Web Store le 31/08/2026 | dates fermes annoncées par Google — un produit encore en développement MV2 après ces échéances est non publiable, à vérifier à chaque challenge de ce profil |
| `web-ext lint` / `addons-linter` | version courante alignée sur les schémas Firefox récents (mise à jour continue en 2026) | le linter suit les évolutions du schéma manifeste — une version figée du linter peut ne pas détecter un champ nouvellement invalide |
| Politiques du Chrome Web Store | revues humaines/automatiques évolutives, non documentées ici en détail | les motifs de rejet en revue store changent sans préavis versionné — ce profil ne peut pas les garantir, seulement réduire le risque en amont |

## 3. Mapping de consommation par forge

| Forge | Ce que le profil active |
|---|---|
| ACCUEIL | routage de l'intention : « extension de navigateur » → charge ce profil |
| conception | typologie d'entrant « extension » ; exigences types permissions minimales, CSP sans code distant dès `EXIGENCES.json` |
| development | cible MV3 uniquement ; `.forge\profile.toml` déclare le profil « extension-navigateur » |
| tests | pan lint manifeste (`web-ext lint` / addons-linter) en sus des pans standard applicables (pas de logique serveur à tester si l'extension est autonome) |
| websec (12/08) | partiel : CSP et absence de code distant relèvent de la même famille de contrôle que l'exposition web — forge en construction |
| seo | hors périmètre (pas de surface indexable) |

