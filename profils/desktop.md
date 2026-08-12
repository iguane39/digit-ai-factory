---
profil: desktop
version: 1.0.0
challenge_date: 2026-08-12
sources:
  - "CA/Browser Forum — validité maximale des certificats de signature de code Windows réduite de 39 à 15 mois (460 jours) à partir du 01/03/2026"
  - "Apple — notarisation obligatoire pour toute distribution hors Mac App Store depuis macOS 10.15 Catalina ; tout binaire signé Developer ID construit après le 01/06/2019 doit être notarisé"
  - "Doyensec — bâtir un auto-updater Electron sûr : vérification de signature atomique, séparation des clés dev/prod (02/2026)"
  - "Tauri v2 — plugin updater : paire de clés de signature dédiée, clé privée jamais versionnée (documentation officielle, 2025)"
  - "étude d'opportunité forges — output\\20260812-etude-opportunite-forges.md (12/08/2026), §5"
---

# Profil produit — desktop

Référentiel versionné (pas une forge — R-28, `REGLES-PROJET.md` §H) pour tout produit
packagé en application de bureau (Electron/Tauri, Windows/macOS). Probabilité d'entrée
faible-moyenne (étude §5) : ce profil documente les exigences vérifiables par avance, sous
le constat explicite qu'aucune forge de l'écosystème ne les outille aujourd'hui.

## Trou d'outillage (section obligatoire)

**Les verbes signature de code, notarisation et distribution multi-OS n'existent dans
aucune forge de l'écosystème** — ni `development` (build), ni `forge-ops` (exploitation), ni
`tests` (vérification). L'étude d'opportunité (§5, 12/08/2026) consigne ce delta côté
forge-ops sans construction : aucun produit desktop réel n'est jamais entré au pipeline, et
construire l'outillage sans produit à exercer contredirait le standard « née exercée »
(R-28 point 2, précédent posé par `profils\mobile.md`).

**Ce profil documente les exigences, il ne les outille pas.** Un brief desktop réel doit
déclencher une candidature d'outillage explicite (signature Authenticode/notarization dans
`forge-ops`, ou un target `development` dédié) avant toute mise en production — pas une
improvisation en session.

## 1. Standards vérifiables machine

| Norme / métrique | Seuil | Oracle gratuit qui juge |
|---|---|---|
| Signature de code Windows (Authenticode) | certificat SHA-2, EKU code signing, horodatage RFC 3161 ; validité max 15 mois (460 j) pour tout certificat émis/renouvelé après le 28/02/2026 | `signtool verify` (SDK Windows, gratuit) — pas d'oracle CI packagé dans l'écosystème aujourd'hui |
| Notarisation macOS | obligatoire pour toute distribution hors Mac App Store ; binaire signé Developer ID + ticket de notarisation valide | `spctl --assess` / `stapler validate` (outils Apple, gratuits) — idem, aucun oracle CI packagé |
| CSP de webview (Electron/Tauri) | pas de `nodeIntegration` exposé au contenu distant, CSP restrictive sur la fenêtre applicative | revue de code (aucun oracle gratuit automatisé identifié pour ce périmètre précis) |
| Auto-update sécurisé | vérification de signature atomique avant application de la mise à jour, clés dev/prod séparées | revue de code contre les pratiques documentées (Doyensec 02/2026, plugin updater Tauri) — pas d'oracle automatisé |

## 2. Savoir périssable daté-sourcé

| Pratique | Source datée | Pourquoi ça périme |
|---|---|---|
| Durée de validité des certificats Authenticode | 39 → 15 mois (460 j) au 01/03/2026 (CA/Browser Forum) | tout certificat acheté avant cette date suit l'ancien cycle, après il faut renouveler deux fois plus souvent — un processus de signature figé casse au premier renouvellement post-bascule |
| Stockage des clés de signature Windows | depuis 06/2023 les CA n'émettent plus de certificats OV exportables — HSM obligatoire (ex. Azure Trusted Signing) | un pipeline de build qui suppose un fichier `.pfx` exportable est déjà non conforme ; Azure Trusted Signing lui-même restreint la validation d'identité à certains pays (04/2025) |
| Sécurité de l'auto-updater Electron | recherche Doyensec 02/2026 : vérification de signature et application de la mise à jour doivent être atomiques sur le même descripteur de fichier | un pattern d'auto-update « propre » aujourd'hui peut être requalifié vulnérable dès qu'une nouvelle classe de TOCTOU est documentée — à revérifier avant tout premier build |

## 3. Mapping de consommation par forge

| Forge | Ce que le profil active |
|---|---|
| ACCUEIL | routage de l'intention : « application de bureau » → charge ce profil, affiche explicitement le trou d'outillage |
| conception | typologie d'entrant desktop ; exigences de signature/notarisation/distribution actées comme risques projet, pas comme acquis outillés |
| development | aucun target desktop aujourd'hui — un brief réel déclenche la candidature d'un target Electron/Tauri |
| forge-ops | verbes signature/notarisation/distribution absents — delta consigné par l'étude, candidature à ouvrir au premier brief, jamais anticipée sans produit |
| tests | aucun pan signature/notarisation outillé aujourd'hui ; pans standard (front, sécurité des sources) applicables si le code applicatif est web-based (Electron) |
| websec (12/08) | hors périmètre direct (surface exécutable locale, pas un service exposé réseau) sauf API distante consommée par l'app |

