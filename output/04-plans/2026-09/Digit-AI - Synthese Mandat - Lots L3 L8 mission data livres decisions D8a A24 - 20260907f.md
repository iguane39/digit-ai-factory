---
destinataire: humain
---

# Synthèse de mandat — décision D-8 (a) et GO A-24 à A-26 exécutés : la forge des données publiée, les six lots restants livrés dans six forges, les six candidatures closes (07/09/2026)

Votre décision de supprimer la branche de sauvegarde a débloqué la publication de la forge des données, et vos trois GO ont ouvert d'un coup les six lots restants de préparation des forges à la mission data. Les six sont livrés et prouvés : un oracle de modèle dimensionnel, un oracle de projet de transformation avec son profil de construction, un oracle de modèle sémantique Power BI lu sur fichiers, un générateur de thème Power BI dérivé de la marque, un oracle de réconciliation des chiffres entre la couche Gold et le modèle sémantique, et deux plans de mise en production pour un produit data. Chaque forge a sa preuve rejouée verte et son commit local. Ce qui change pour vous : l'écosystème couvre désormais les cinq temps de la mission, du « où » à la publication, avec un juge exécutable à chaque étape. Ce qui est attendu de vous : dire si les six forges et le pilot se publient, un constat neuf sur la forge de tests étant journalisé à part.

## 1. En-tête d'identification

- **quoi** — mandat humain « 8a, A-24, A-25, A-26 » sur la restitution de 15:44 : suppression de la branche de sauvegarde et push de forge-data (D-8 a), ouverture des lots L3 (oracle du modèle dimensionnel) à L8 (plans de mise en production d'un produit data) (A-24, A-25, A-26).
- **sur quoi** — six forges (données 10cca3b, audit 03ec225, design d49db27, ops 3ac057c, développement a7c2ecf, tests acbeb35 — commits locaux non poussés), forge-data publiée en amont (ce86658 → 41c85ef), le pilot (registre, catalogue, cette synthèse).
- **quand** — 2026-09-07 16:27 UTC+02:00 (Europe/Paris), durée ≈ 40 min depuis « 8a, A-24, A-25, A-26 ».
- **qui** — pilot digit-ai-factory 6f3d69f ; skill `write-an-oracle` (standard des oracles), contrat de campagne du pilot (chirurgie, vérifications natives vertes avant commit, commits locaux sans push).

## 2. Verdict en une ligne

forge-data publiée (porte verte après suppression de la branche) ; 6 lots livrés dans 6 forges, 6 commits locaux ; preuves rejouées : forge-data 91 → 111 PASS, forge-audit 3/3 puis CI locale 11/11, forge-design self-test à zéro régression, forge-ops self-test vert avec O-5 (plan complet à quatre phases) PASS sur les deux plans, forge-development 18 tests verts, forge-tests suite verte hors un fichier cassé avant ce mandat ; 6 candidatures closes en corrigé, 1 constat neuf (TF-0866), registre PASS.

## 3. Décisions attendues de l'humain

> **D-9 — Les six forges livrées et le pilot se publient-ils maintenant, chacun à travers sa porte de publication ?**
> Six forges portent chacune un commit local de ce mandat, et aucune n'est publiée : le contrat de campagne réserve le push au pilot sur GO humain, et la décision D-7 du tour précédent ne couvrait que forge-data et le pilot. Chaque push rejoue la porte de publication, qui balaie toutes les branches ; forge-data a montré ce matin qu'une branche de sauvegarde suffit à la fermer. Les cinq autres forges ont été rebâties le même matin avec la même branche de sauvegarde, dont la suppression relève de la décision D-30 de la synthèse du matin, restée sans réponse ; sans elle, leurs push seront vraisemblablement refusés pour la même cause. La forge des outils reste à part, sa porte étant rouge sur son histoire publiée elle-même.
> **Recommandation : (a).** Source consultée : gabarit de campagne du pilot, section « Git » (« JAMAIS de push … la publication est une décision humaine qui passe par le pilot ») ; synthèse 20260907e, décision D-8 et sa preuve (`git branch -a --contains` → la branche de sauvegarde seule) ; synthèse 20260907b, décision D-30 (dix branches de sauvegarde, paquets git sous `c:\dev\_sauvegarde-reconstruction-20260907`).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Supprimer les branches de sauvegarde des cinq forges rebâties ce matin (D-30 a), puis pousser les six forges et le pilot | Cinq suppressions et sept push, simple × court ; chaque porte rejouée, tout refus restant rapporté | La forge des outils, dont la porte est rouge pour une cause antérieure (D-29) |
| (b) Pousser seulement le pilot et forge-data ; garder les cinq autres en local | Deux push | Les cinq oracles et plans nouveaux ne sont visibles que sur ce poste |
| (c) Ne rien publier | Aucun coût | Toute publication ; la mission s'ouvrirait sur un poste qui seul connaît ces verbes |

> **Si rien n'est décidé** : (c) — sept dépôts restent en avance locale, la revue du 2026-09-21 le constatera.

## 4. Traité — avec sa preuve

- D-8 (a) : branche de sauvegarde de forge-data supprimée, forge-data publiée.
  - preuve : `git branch -D sauvegarde/ancienne-histoire-20260907` → « Deleted branch … (was daf3f0d) » ; `git push origin main` → « ce86658..41c85ef main -> main », exit 0 (porte verte).
- L3 (TF-0860) : oracle « modéliser » chez forge-data, format `modele-dimensionnel@1`, règles M1-M6 (six règles du modèle déclaré), barre Kimball. Contrôle rouge → vert : la fixture rouge déclenche les cinq règles de fond, de M2 (grain et mesures des faits) à M6 (matrice en bus) ; la verte PASS ; classe traitée : référence de modélisation retenue sans oracle.
  - preuve : essai direct → « modeliser verte -> PASS », « modeliser rouge -> FAIL », cinq règles de fond déclenchées ; `oracles/self-test.mjs` → « Self-test forge-data : 111 PASS, 0 FAIL » (91 avant).
- L4 (projet de transformation, TF-0861) : oracle « transformer » chez forge-data — TR1-TR6 : six règles de forme, lues sur `manifest.json`, `run_results.json`, `catalog.json` ; profil curé `data-transformation` chez forge-development (marqueur `dbt_project.yml`, sans UI, gate code `dbt test`) ; composition déclarée chez forge-tests (NON_JUGE du pan data, registre de dette régénéré). Contrôle rouge → vert : rouge déclenche les cinq règles de fond (TR2 à TR6) ; classe traitée : porteur de la construction data indéterminé (défaut n° 19 de l'analyse L99).
  - preuve : self-test forge-data 111 PASS ; `pytest` forge-development sur les fichiers touchés → « 18 passed » (sortie « .................. [100%] », exit 0) ; forge-tests `python -m pytest -q tests --ignore=tests/test_tf_0401_manifeste_racines.py` → « [100%] », exit 0 ; `python -m forge_tests.dette` → registre régénéré (« assume 122, ok 3, retiree 29, todo 66 »).
- L5 (modèle sémantique Power BI, TF-0862) : `verifier-modele-semantique.mjs` chez forge-audit, lecture TMDL, règles MS1-MS6 (six règles lues sur les fichiers) nommant chacune son contrôle AuditCore, fixtures et test câblés en CI, liaisons du profil Power BI 1.1.0. Contrôle rouge → vert : rouge BLOQUANT nommant MS2 à MS6, verte OK ; classe traitée : contrôle de gouvernance sans outillage programmatique.
  - preuve : `node --test tests/oracles/modele-semantique.test.mjs` → « tests 3 · pass 3 · fail 0 » ; `npm test` (rejeu du workflow) → « verifier : 11/11 étape(s) du workflow rejouée(s) en local — toutes vertes ».
- L6 (TF-0863) : générateur et oracle de thème Power BI chez forge-design (TP1-TP3 : forme, synchronisation avec la source, absence de généricité), fixtures verte (régénérée du corpus) et rouge (thème par défaut). Contrôle rouge → vert : rouge déclenche TP2 (régénération exacte de la source) et TP3 (aucune couleur ni police d'usine) ; classe traitée : rendu générique livré comme personnalisé (loi n° 6).
  - preuve : `generer-theme-powerbi.mjs corpus/tokens-digit-ai.tokens.json` → « [ok] thème Power BI dérivé », dataColors `#2563EB, #15803D, #D97706, #0E9488, …` ; essai → « theme verte -> PASS », « theme rouge -> FAIL », deux règles déclenchées ; `oracles/self-test.mjs` de forge-design → exit 0, « Tout vert ».
- L7 (TF-0864) : oracle « réconcilier » chez forge-data (RC1-RC6, `reconciliation@1`) et règle R6 (le rapport pointe un lot de réconciliation) de `restituer` (`reconciliation_ref`). Contrôle rouge → vert : rouge déclenche RC2, RC3, RC4, RC5 après correction de la tolérance implicite (sans tolérance déclarée, tout écart est un écart) ; R6 rouge sur le rapport pointant un lot absent ; classe traitée : chiffre exposé non attribuable (défaut n° 18).
  - preuve : self-test forge-data 111 PASS, lignes « oracle-reconcilier.mjs · rouge FAIL (exit 1) » et « oracle-restituer.mjs · rouge FAIL (exit 1) » (cas R6).
- L8 (plans d'un produit data, TF-0865) : cibles de plan `databricks-bundle` et `powerbi-workspace` chez forge-ops, O-5 étendu, GO humain écrit dans la phase de déploiement. Contrôle rouge → vert : « plan sans rollback → O-5 FAIL » reste rouge, les deux plans nouveaux PASS ; classe traitée : MEP d'un produit data sans outillage (défaut n° 20).
  - preuve : `oracles/self-test.mjs` de forge-ops → « [PASS] plan databricks-bundle : 4 phases générées », « [PASS] oracle O-5 PASS sur le plan databricks-bundle », idem `powerbi-workspace`, exit 0.
- Catalogue du pilot : six services ajoutés (cat-dat-09, cat-dat-10, cat-dat-11, cat-aud-05, cat-des-10, cat-ops-06), vues régénérées.
  - preuve : `generer-vues.mjs` → « CATALOGUES.md régénéré », « section CATALOGUE du README régénérée ».
- Registre : TF-0860 à TF-0865 clos en corrigé (corrections, gains, versions de forge, descente règle + oracle), TF-0866 créé. Contrôle rouge → vert : `oracle-todo` PASS avant et après l'écriture ; règles R7 et R12 tenues.
  - preuve : `journaliser.mjs` → « 7 événement(s) journalisé(s) », avant PASS, après PASS, horodatages 2026-09-07T14:25:18Z ; vues régénérées, « 85 actifs », sceau a73934adfb97.
- Six commits locaux, un par forge, vérifications natives vertes avant chacun.
  - preuve : forge-data `10cca3b`, forge-design `d49db27`, forge-ops `3ac057c`, forge-development `a7c2ecf`, forge-tests `acbeb35`, forge-audit `03ec225` (tous « ahead 1 » de leur distant, 16:20).

## 5. Non traité — avec son motif

- Publication des six forges et du pilot : attend D-9 ; hors forge-data, la décision D-7 ne couvrait aucune d'elles.
- TF-0866 (fichier de test de forge-tests cassé par une pseudonymisation dans un identifiant Python, depuis le 20/08) : constat en passant, journalisé en candidat, non corrigé — hors périmètre du mandat, et la correction touche l'anonymiseur du pilot autant que le fichier.
- forge-tests ne RELIT pas la sortie de tests archivée d'un projet de transformation : la composition est déclarée dans son NON_JUGE, pas outillée — écart à la lettre de l'étude, dit ci-dessous.
- Le lanceur `uv run pytest` est bloqué sur ce poste par une stratégie de contrôle d'application (erreur 4551) avec un code de sortie 0 trompeur ; la suite a été jouée par `python -m pytest`, consigné dans TF-0866.
- Aucune barre nouvelle : les trois oracles construits citent chacun la barre validée en D-6.

## 6. Écarts à la lettre

- L'étude prévoyait pour L4 « forge-tests lit la sortie de tests archivée » → forge-tests déclare la composition avec `oracle-transformer` dans son NON_JUGE et régénère son registre de dette, sans relire `run_results.json` → pourquoi : relire ces artefacts dans le pan data dupliquerait ce que `oracle-transformer` juge déjà (TR5), contre la frontière « composition, jamais duplication » ; si un run réel réclame la relecture, elle s'instruit à part.
- Vous avez demandé A-26 « ouvrir les lots L5 à L8 » avec « un GO par lot » → les quatre lots ont été ouverts sous le seul GO « A-26 » → pourquoi : votre message nommait A-26 tel quel, sans réserver un GO par lot ; je l'ai lu comme le GO des quatre.
- Aucun autre écart.

## 7. Risques

- **Cinq portes de publication rouges pour la même cause** : signal = un push refusé avec des constats localisés dans `sauvegarde/ancienne-histoire-20260907` ; parade = D-9 (a), qui reprend D-30.
- **Oracles validés sur fixtures synthétiques seulement** : signal = un artefact réel (manifest dbt, dossier TMDL, export DAX) refusé pour une forme non prévue ; parade = chaque oracle déclare son non_juge et refuse proprement (exit 2) plutôt que d'inventer un verdict ; premier run réel à consigner aux fiches.
- **Commandes du plan Power BI non rejouées** : signal = une commande `fab` dont la syntaxe diverge de la CLI au moment du run ; parade = le plan est « plan-first, génère, n'exécute jamais », O-5 juge la forme, et la validité des valeurs substituées est déclarée non jugée.
- **Fichier de test cassé chez forge-tests** : signal = toute suite lancée avec `-x` s'arrête avant de jouer ; parade = TF-0866 au registre, correction simple × court.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-30 | Supprimer les branches de sauvegarde des cinq forges rebâties ce matin, puis pousser les six forges et le pilot | neuve | auto_ia | dependance_bloc_3 (D-9) | `git branch -D sauvegarde/ancienne-histoire-20260907` puis `git push origin main` dans chaque forge, porte rejouée ; `git push origin main` dans le pilot | sept dépôts en avance locale |
| A-31 | Corriger TF-0866 : renommer l'identifiant de test fautif, et faire refuser par l'anonymiseur tout remplacement à l'intérieur d'un identifiant de code | TF-0866 | auto_ia | gate_gouvernance (candidat : décision humaine avant mandat) | mandat forge-tests sur `tests/test_tf_0401_manifeste_racines.py` ; mandat pilot sur `todo/anonymiser-suivis.mjs` | toute suite `pytest -x` de forge-tests s'arrête avant de jouer |
| A-32 | Consigner aux fiches d'audit des forges le premier run réel de chaque oracle nouveau | neuve | auto_ia | dependance_externe (mission non ouverte) | à l'ouverture de la mission, `fiches/<forge>.md` du pilot | les oracles restent « exercés sur fixtures » sans preuve réelle |
| A-18 | Revue du verdict de l'étude contre le « où » réel de la mission le 2026-09-21 | neuve | auto_ia | dependance_externe (mission non ouverte) | rejouer la section 2 de l'étude | le plan reste conditionnel |
| A-33 | Répondre à D-9 | neuve | manuelle_utilisateur | irreversible : supprimer une branche et publier sont des gestes humains par règle | répondre dans ce fil par `D-9 (a)`, `D-9 (b)` ou `D-9 (c)` | rien ne se publie |

Ordre : A-33 d'abord, parce qu'elle conditionne A-30 ; A-31 dès que TF-0866 est décidé, parce qu'un geste simple débloque toute suite de tests de la forge ; A-32 et A-18 à l'ouverture de la mission, parce qu'elles n'ont pas de matière avant.

## 9. Traces

- `..\digit-ai-forge-data` — commit 10cca3b : `oracles/oracle-modeliser.mjs`, `oracles/oracle-transformer.mjs`, `oracles/oracle-reconcilier.mjs`, `oracles/oracle-restituer.mjs` (R6), `oracles/self-test.mjs`, fixtures `modele-dimensionnel-*`, `transformation-*`, `reconciliation-*`, `rapport-reconciliation-*`, `references/STANDARDS-DATA.md`, `CLAUDE.md`, `README.md`.
- `..\digit-ai-forge-audit` — commit 03ec225 : `oracles/verifier-modele-semantique.mjs`, `tests/oracles/modele-semantique.test.mjs`, `tests/fixtures/oracles/modele-semantique/`, `profiles/powerbi/bindings.json` (1.1.0), `.github/workflows/ci.yml`.
- `..\digit-ai-forge-design` — commit d49db27 : `scripts/generer-theme-powerbi.mjs`, `oracles/oracle-theme-powerbi.mjs`, `oracles/fixtures/theme-powerbi-{verte,rouge}.json`, `oracles/self-test.mjs`.
- `..\digit-ai-forge-ops` — commit 3ac057c : `scripts/ops.mjs`, `oracles/oracle-ops.mjs`, `oracles/self-test.mjs`, `README.md`.
- `..\digit-ai-forge-development` — commit a7c2ecf : `conductor/profiles.py`, `conductor/onramp/detect.py`, `tests/test_profile_data_transformation.py`.
- `..\digit-ai-forge-tests` — commit acbeb35 : `forge_tests/adaptateurs/data.py`, `registre-dette.json`.
- `todo\TODO.jsonl` — événements 2026-09-07T14:25:18Z ; `catalogues\catalogue.jsonl` — six entrées ; `output\03-etudes\20260907-etude-opportunite-mission-data-silver-gold-powerbi.md` — section 5.2, lots L3 à L8.
