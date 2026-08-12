# Étude d'opportunité — forges cybersecurity, website, webapp, mobile

**Mandat humain du 12/08/2026** — analyse seulement, aucune construction. Méthode : grille
imposée (périmètre en verbes → verdict de non-recouvrement cité contre le catalogue v1.3.0
(64 services) et les skills installés → état de l'art sourcé (2 recherches dédiées, sources
datées) → options tranchées dans un jeu fermé → coût d'intégration). Standard de référence :
verdict de non-recouvrement écrit avant toute construction (précédent forge-data, TF-0083).
Décision finale : humaine, via les candidatures TODO-FORGE jointes.

---

## 0. Partition préalable — website / webapp / mobile : un axe, pas trois métiers

Les trois candidats partagent la même définition à un mot près (« bonnes pratiques et état
de l'art de la conception de X, adaptés aux contextes ») et les mêmes consommateurs (les
forges du pipeline). Leurs périmètres se chevauchent entre eux avant même de toucher
l'existant : une PWA est une webapp installable sur mobile ; un « site web mobile » est un
site web sous contrainte tactile ; la cible tactile 24×24 px (WCAG 2.2) / 48 dp (Google)
traverse les trois volets — un seul critère mesurable à trois échelles (recherche volet
mobile, 12/08). **Verdict de partition : un seul axe « type de produit » à trois valeurs**,
traité en un dossier commun (§ 2) avec sous-verdicts par valeur. L'écosystème est organisé
par étape de pipeline et discipline transverse — pas par type de produit ; cet axe est une
*qualification des entrants*, pas un métier.

---

## 1. Dossier cybersecurity — sécurité du produit web livré

### 1a. Périmètre en verbes utilisateur

1. « Je veux connaître l'exposition de mon produit web avant la MEP » (headers/TLS/CSP,
   dépendances vulnérables, secrets).
2. « Je veux un contrat de sécurité vérifiable » (niveau ASVS L1/L2 tenu, prouvé).
3. « Je veux un audit sécurité récurrent post-MEP » (re-scan différentiel, DAST léger).

### 1b. Verdict de non-recouvrement (citations catalogue v1.3.0 / dépôts)

| Surface existante | Ce qu'elle couvre | Ce qu'elle ne couvre PAS |
|---|---|---|
| forge-tests, pan `securite` (cat-tst-01 ; CLI `--pans` vérifiée le 12/08) | scan de secrets borné aux sources du produit (TF-0099) | DAST, SCA, configuration runtime (headers/TLS/CSP), contrat ASVS, récurrence |
| forge-development, gate anti-patterns IA (cat-dev-06) | statique code : secrets en dur, routes sans auth, imports fantômes | tout le runtime et les dépendances ; ponctuel build |
| forge-audit, domaine `02-identity-sec` (cat-aud-01, arborescence `core/adr-en/` vérifiée) | gouvernance déclarative (ADR, contrôles CTL) | aucun test technique exécuté sur le produit |
| forge-agents-security (cat-sec-01/02) | sécurité **de l'outillage agentique** (agent.def, tool calls) | la sécurité **du produit livré** — objet différent, délimitation à afficher dans les deux README |
| forge-ops (cat-ops-01/02) | healthcheck, rollback | rien de sécurité |

**Trou réel et net** : aucun service ne juge l'exposition runtime, les dépendances
vulnérables, ni la conformité à un contrat de sécurité — ni en gate pré-MEP, ni en
récurrence post-MEP.

### 1c. État de l'art (recherche dédiée du 12/08, 7 sources datées)

- **Contrat vérifiable** : OWASP **ASVS 5.0.0** (mai 2025) — ~350 exigences binaires en 17
  catégories, 3 niveaux L1-L3 ; le standard le plus machine-vérifiable du domaine. Grilles
  de priorisation : OWASP Top 10:2025 (nov. 2025 — « Supply Chain Failures » entre au
  classement), CWE Top 25 2025 (CISA/MITRE, 11/12/2025).
- **Oracles exécutables gratuits, verdict machine** : ZAP 2.17 (DAST, CLI+exit codes),
  osv-scanner / npm audit / pip-audit (SCA, exit codes), gitleaks (secrets), headers/TLS
  (automatisation fragile depuis la perte de l'API Mozilla Observatory 2024 — un oracle
  maison headers/CSP est simple et plus fiable).
- **Levier réglementaire daté** : le **Cyber Resilience Act** crée l'obligation la plus
  directe pour un éditeur de webapp — signalement des vulnérabilités exploitées dès le
  **11/09/2026**, obligations pleines (security by design, SBOM, mises à jour) au
  **11/12/2027**. NIS2 ne concerne que les secteurs couverts.
- **Pratique de référence** : pentest léger récurrent = scans automatisés à chaque
  déploiement + revue manuelle ciblée trimestrielle + engagement annuel ; livrable
  **différentiel** contre la baseline précédente (~40 % des organisations en cadence
  trimestrielle/continue en 2025-2026).
- **Barres candidates** (statut `todo`, test d'existence à exécuter au pas 3 de la-barre) :
  ASVS 5.0 (niveau de contrat) ; chaîne ZAP + osv-scanner + gitleaks (niveau d'outillage).

### 1d. Options tranchées

- **Extension forge-tests — écartée** : forge-tests audite des *suites de tests* au moment
  du build (grain one-shot, structure cible, G-1 lecture seule) ; la cyber exige du runtime
  (DAST sur produit servi), une récurrence sur mandat et un livrable différentiel — le grain
  de forge-seo, pas celui de forge-tests.
- **Extension forge-audit — écartée** : audit est déclaratif par construction (ADR,
  contrôles, policy-as-code en démonstrateur) ; y loger des scanners exécutables sur produit
  brouillerait sa frontière produit/engagement.
- **Profil-référentiel seul — écarté** : le domaine porte des **verbes outillables propres**
  (scanner l'exposition, tenir un contrat ASVS, re-scanner en différentiel) avec des oracles
  exécutables identifiés — c'est précisément ce qui définit une forge (critère § 4).
- **✔ FORGE DÉDIÉE, recommandée** — modèle forge-seo : sur mandat humain, pré-MEP (gate
  optionnel consommé par M-1…M-5) et post-MEP récurrente (différentiel). V0 née exercée :
  oracle-exposition (headers/TLS/CSP, maison), oracle-sca (enveloppe osv-scanner/pip-audit,
  verdict machine), référentiel ASVS-L1 versionné (challenge_date), fixtures double sens ;
  DAST ZAP en v1 (lourd). Nom à trancher par l'humain (proposition : `digit-ai-forge-websec`
  — évite la collision de sens avec agents-security) ; délimitation croisée affichée dans
  les deux README.

### 1e. Coût et séquencement

7 surfaces documentaires + catalogue (précédent du 12/08 : ~1 commit d'intégration, oracle-
ecosysteme fait respecter) ; construction v0 ≈ 1 campagne agent (précédent : 10-15 min de
construction + sondage). **Priorité 1 des quatre candidats** — le CRA lui donne une échéance
externe (09/2026).

---

## 2. Dossier axe « type de produit » — website, webapp, mobile

### 2a. Périmètre en verbes… et le problème

Les verbes candidats (« concevoir selon les bonnes pratiques du type de produit ») ne sont
pas des verbes *outillables nouveaux* : ce sont des **qualificatifs** des verbes existants
de conception, design, development et tests.

### 2b. Verdict de non-recouvrement (citations)

| Candidat | Déjà couvert par | Preuve |
|---|---|---|
| website | design : 8 oracles/48 règles dont mobile M1-M6, rendu mesuré au pixel (cat-des-05) ; socle et patterns : `references\BEST-PRACTICES-HTML.md` (pilot) + skill `digit-ai-page-html` ; SEO/CWV : cat-seo-02 et cat-seo-06 (CrUX outillé le 12/08) | catalogue v1.3.0 ; BEST-PRACTICES-HTML lu le 12/08 |
| webapp | development EST la forge webapp : run-playbook SaaS, `targets/fastapi-saas`, double gate (cat-dev-01/02), manifeste `.forge/profile.toml` (INVENTAIRE §3, l.69) ; design applicatif ; tests 12 pans (cat-tst-01) | catalogue ; INVENTAIRE |
| mobile | web mobile : règles M1-M6 de design + cible tactile WCAG (recouvre WCAG 2.5.8) ; **apps natives : rien** — mais aucun produit mobile n'est jamais entré au pipeline | catalogue ; RUN-PILOTE et missions réelles (aucun produit mobile) |

**Constat d'état de l'art** (recherche dédiée, 13 sources datées) : la part vérifiable
machine de ces trois volets est **déjà couverte par des oracles gratuits officiels** (axe-core
pour WCAG 2.2/EAA — échéance passée du 28/06/2025 —, PageSpeed/CrUX pour LCP&lt;2,5 s / INP&lt;200 ms
/ CLS&lt;0,1, Lighthouse PWA, validation automatique des stores : target API 36 au 31/08/2026,
Privacy Manifest Apple) ; la part restante est du **savoir périssable à cycle court** (HIG
« Liquid Glass » iOS 26, Material 3 Expressive mai 2025, parts de marché cross-platform —
révisés chaque année). Or la maison a déjà tranché la nature de cette matière : **loi
transverse n° 4** (une donnée volatile est une donnée) et précédent `BEST-PRACTICES-HTML.md`
(savoir capitalisé en référentiel du pilot, daté, sourcé — pas une forge).

### 2c. Options tranchées

- **Forges dédiées ×3 — écartées** : aucun verbe outillé nouveau ; les oracles existent déjà
  chez design/tests/seo ou chez Google/W3C ; créer 3 forges de corpus violerait la loi n° 4
  et ferait croître la matrice type × étape (16 forges, chacune coûtant ses 7 surfaces).
- **Extension d'une forge — écartée comme réponse principale** (des extensions ciblées
  restent possibles en aval des profils, ex. règles design par type).
- **✔ PROFILS PRODUIT EN RÉFÉRENTIELS DU PILOT, recommandé** : `profils\{website,webapp,
  mobile}.md` — frontmatter (version, `challenge_date`, sources datées), corps en trois
  sections par profil : (1) standards vérifiables machine (norme · seuil · oracle gratuit),
  (2) savoir périssable daté-sourcé, (3) **mapping de consommation** (ACCUEIL → routage ;
  conception → typologie d'entrant ; design → règles/tokens à activer ; development →
  `.forge/profile.toml` / `targets/` ; tests → pans et seuils). Fraîcheur contrôlée par
  claims (`oracle-fraicheur-doc` v2, TF-0115). Coût : zéro surface écosystème nouvelle.
- **Cas mobile natif** : seul trou réel (toolchain stores, signing, guidelines) — mais
  construire une forge sans produit réel à exercer contredirait le standard « née exercée »
  (toutes les forges du 12/08 sont nées avec self-tests exercés). **Écarté avec clause de
  réveil** : réévaluation obligatoire au premier brief produit mobile natif (le profil
  mobile documente d'ici là les exigences de soumission vérifiables).

---

## 3. Tableau de décision

| Candidat | Verdict | Pourquoi (résumé) | Coût | Priorité |
|---|---|---|---|---|
| cybersecurity | **Forge dédiée** (modèle seo, sur mandat) | verbes outillés propres + oracles exécutables identifiés + échéance CRA 09/2026 ; trou prouvé sur 5 surfaces | 7 surfaces + v0 (1 campagne) | **1** |
| website | **Profil-référentiel pilot** | part machine déjà outillée (axe, CWV, Lighthouse) ; reste = savoir périssable (loi n° 4, précédent BEST-PRACTICES-HTML) | ~0 (artefact pilot) | 2 (lot unique) |
| webapp | **Profil-référentiel pilot** | development est déjà la forge webapp ; le profil rend explicite l'implicite | ~0 | 2 (lot unique) |
| mobile | **Profil-référentiel pilot + clause de réveil** | web mobile déjà couvert (M1-M6, WCAG 2.5.8) ; natif = pas de produit à exercer → réévaluer au premier brief mobile | ~0 | 2 (lot unique) |

**Séquencement recommandé** : ① critère d'admission (R-28, trivial, verrouille la doctrine) ;
② lot « profils produit » (léger, un artefact pilot + claims) ; ③ forge cybersecurity
(campagne de construction sur décision de nom).

---

## 4. Critère d'admission d'une nouvelle forge (proposition → REGLES-PROJET)

> **R-28 (proposée).** Une forge naît si et seulement si : (1) elle porte **≥ 2 verbes
> outillés exécutables** qui n'existent dans aucune forge — prouvé par un **verdict de
> non-recouvrement écrit** citant le catalogue ; (2) sa v0 naît **exercée** (oracles propres
> à self-test double sens, fixtures synthétiques) ; (3) elle a une **cadence ou un mandat
> propres** (qui la distingue d'une extension) ; (4) son intégration des surfaces
> écosystème (bootstrap, fiche, INVENTAIRE, contrat, noyau, README, schéma, catalogue) est
> livrée le même jour — oracle-ecosysteme fait foi. **Un corpus de savoir sans verbe outillé
> est un référentiel versionné** (frontmatter daté-sourcé, fraîcheur par claims), jamais une
> forge.

Appliqué rétroactivement aux quatre candidats, ce critère donne exactement les verdicts du
tableau — c'est sa fixture de validation.

---

## Annexe — traçabilité

Recherches : 2 tranches Sonnet (cyber : 55 k tokens, 12 outils, 1,6 min, 7 sources ;
conception ×3 volets : 57 k tokens, 16 outils, 1,6 min, 13 sources) — escalade : aucune.
Citations de recouvrement : vérifiées sur `catalogues\catalogue.jsonl` v1.3.0, INVENTAIRE.md,
CLI forge-tests (`--pans`), arborescence `core/adr-en/` d'audit, `references\BEST-PRACTICES-
HTML.md`. Aucune construction : `git status` des 12 forges inchangé, aucun dépôt créé.
Candidatures issues de l'étude : voir sidecar ingéré au registre (3 candidatures).

---

## 5. Extension (mandat du 12/08 soir) — pertinence d'autres profils produit

Recherche dédiée (Sonnet, 44 k tokens, 8 sources datées, 9 candidats — dont un ajouté au
brief : chatbot/agent conversationnel). **Verdict : aucun profil supplémentaire à créer
maintenant** — même les plus probables restent des extensions vérifiables de website/webapp
sans premier client réel.

| Candidat | Probabilité d'entrée au pipeline | Verdict |
|---|---|---|
| api-headless | forte (l'API FastAPI existe déjà comme sous-produit) | **profil au premier brief** (OpenAPI 3.1 + Spectral + Schemathesis — standards machine prêts) |
| e-commerce | forte | **profil au premier brief** (PCI DSS 4.0.1 opposable depuis le 31/03/2025 — 6.4.3 scripts/SRI, 11.6.1 altération paiement — mesurable par scan ; extension du profil website) |
| chatbot / agent conversationnel | moyenne à forte | **profil au premier brief, avec vigilance** : le contrat de canal relève du profil, mais l'évaluation de qualité conversationnelle serait un **verbe nouveau** (candidat forge, critère R-28) |
| extension-navigateur | moyenne | profil au premier brief (Manifest V3 = schéma vérifiable, MV2 mort en 2026) |
| desktop (Electron/Tauri) | faible-moyenne | profil au premier brief **seulement avec** l'outillage signature/notarisation (delta forge-ops, verbes absents aujourd'hui) |
| dashboard-data/BI | forte | **rien** — couvert par le profil webapp (+ checklist accessibilité dataviz : axe-core ne couvre que 30-40 % des défauts) |
| cli-outil · jeu-web | faible | rien — hors client type, ad hoc sur mandat |
| iot-embarqué | faible | **hors périmètre** (hardware, certifications CE/FCC — hors capacité logicielle de tout l'écosystème) |

**Critère générique qui émerge** (à verser au LISEZMOI des profils) : un type de produit
mérite un profil **au premier brief** quand ses standards sont mesurables machine ET
consommables par les forges existantes sans verbe exécutable nouveau ; il bascule vers une
**forge** (R-28) quand une capacité de jugement/exécution inexistante ailleurs devient le
goulot (évaluer une conversation, signer/notariser un binaire). Le premier brief réel sert
de test de cette frontière — jamais l'anticipation.
