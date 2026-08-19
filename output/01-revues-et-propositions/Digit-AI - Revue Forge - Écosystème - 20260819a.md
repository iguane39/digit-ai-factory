# Digit-AI — Revue Forge — Écosystème — 20260819a

Revue d'écosystème sur mandat humain du 19/08 (prompt L99 réécrit, « construis le plan
par vague puis lance tout »). 14 dépôts (13 forges + pilot), 4 vagues par péremption de
fiche × activité git. Méthode : fiche TF-0054 comme baseline → delta git → **preuve
rejouée** (jamais relue) → constats **nouveaux seulement** (diffés contre les 83 actifs
du registre, les dettes des fiches et les 6 études des 18-19/08). Les 14 fiches sont
rendues **annotées** ; 4 candidatures émises en sidecar. Zéro correction, zéro commit
dans les dépôts audités pendant la revue.

**Limite déclarée (auto-audit)** : le juge vit chez le jugé — cette revue est conduite
par le pilot sur lui-même et sur des dépôts que la même session a modifiés le jour même
(forge-conception : TF-0388/0389 ; forge-seo-geo : TF-0390). Les preuves sont exécutées,
mais l'indépendance n'existe pas ; une contre-revue par session vierge reste possible.

---

## 1. Verdict d'ensemble — les preuves rejouées le 19/08

| Dépôt | Preuve rejouée | Verdict | Fiche |
|---|---|---|---|
| forge-tests | recette `verifier_corpus.py` | **S-01 TENU** (exit 0) | annotée |
| forge-agents | self-test quality-oracles (repo) | **147/147 PASS** | annotée |
| forge-seo-geo | `validate.py` | **12/12** | annotée |
| forge-conception | `self-test.mjs` | **VERT — 10 oracles / 42 règles** | annotée |
| forge-design | `self-test.mjs` | **VERT — 21 oracles / 73 règles** | annotée |
| forge-organization | `self-test.mjs` | **12/12 + fraîcheur A0** | annotée |
| forge-audit | lint N0 + golden buckets | **0 finding (320 fich.) · 9/9** | annotée |
| forge-development | `ruff` + `pytest` | **All checks passed · 381 passed, 1 skipped** | annotée |
| forge-ops | `self-test.mjs` | **68 PASS** | annotée |
| forge-data | `self-test.mjs` | **54 PASS** | annotée |
| forge-agents-security | `self-test.mjs` | **48 PASS** | annotée |
| forge-websec | `self-test.mjs` | **34 PASS + 2 SKIP motivés** | annotée |
| forge-observability | `self-test.mjs` | **30 PASS** | annotée |
| pilot | agrégat 17 recettes + conformité + todo + catalogues | **tout vert, sauf oracle-skills : FAIL K2** | annotée |

Aucun self-test rouge dans l'écosystème. Le seul FAIL est un oracle du pilot qui juge
le POSTE (oracle-skills K2) — et c'est le constat n°1 ci-dessous.

## 2. Défauts de CLASSE trans-forges

**C1 — Ce qui s'exécute n'est plus ce qui est versionné (classe : propagation).**
`oracle-skills` K2 : **10 skills installés / 17 divergent** de leur source versionnée,
registre quality-oracles v2.12.0 (repo) vs v2.10.0 (installé). C'est un **reconstat** —
l'item « 9 skills sur 20 divergeaient » est clos en archive, le détecteur a été
construit, la dérive est revenue. Preuve du caractère mécanique : 2 des 10 dérives ont
été créées le jour même par la session de revue (dépôts modifiés, propagation non gatée).
→ `revue-20260819-agents` (gain 4 · preuve 4 · effort 2).

**C2 — Le travail qui ne survit pas à un clone (classe : non-committé).**
3 baselines de régression visuelle non versionnées chez forge-design (contrat TF-0102
rompu pour 3 produits réels) — même classe que le chantier « 22 fichiers » levé le 14/08.
→ `revue-20260819-design` (3 · 4 · 1).

**C3 — Le point d'entrée de preuve qui ment (classe : câblage trompeur).**
`npm test` chez forge-audit répond « no test specified » alors que la CI joue lint N0,
golden buckets et validate-config — même famille que TF-0304/TF-0337.
→ `revue-20260819-audit` (2 · 3 · 1).

**C4 — L'écrivain unique qui ne l'est qu'en apparence (classe : concurrence).**
Deux sessions pilot parallèles ont frappé les mêmes ids TF le 19/08 depuis la même base
(TF-0383/0384/0385 ×2) — détecté seulement au push, résolu par renumérotation manuelle,
un commit publié cite des ids devenus autres. Le multi-session est désormais le mode réel.
→ `revue-20260819-pilot` (3 · 4 · 2).

## 3. Fiches : l'état de fraîcheur avant/après

Avant revue : 6 fiches du 08/08 (11 jours, jusqu'à 94 commits de retard chez
forge-tests), 4 du 11/08, 3 du 12/08, 1 du 14/08. **Après revue : 14/14 au 19/08.**
Motif dominant des annotations : les fiches étaient **périmées en mieux** — la plupart
des faiblesses de l'époque sont soldées et tracées (EARS livrée, oracles conception au
registre, sémantique du registre de dette tests refondue, sélecteur de recette livré,
D-P1 ops entamée sur Railway réel, dérive schema_version seo couverte, ASVS 5.0.0).
La forge la moins exercée reste **forge-observability** (7 commits, 5 mécaniques,
« veille citation IA » toujours déclarée).

## 4. Top des décisions proposées (ordonnées par portée systémique ; valeur = gain×preuve/effort)

1. **`revue-20260819-agents`** (valeur 8) — gater la propagation versionné→installé en
   clôture de toute session qui touche un skill versionné ; K2 à l'ouverture en constat.
2. **`revue-20260819-design`** (valeur 12 brute, effort 1) — committer (après validation
   visuelle) les 3 baselines orphelines.
3. **`revue-20260819-pilot`** (valeur 6) — étude courte : réservation/préfixe/contrôle
   pre-push des ids TF en multi-session.
4. **`revue-20260819-audit`** (valeur 6) — câbler `npm test` sur la séquence CI.

Les 4 sidecars passent la normalisation à blanc (`normaliser-lot.mjs` : 4/4 OK, fichiers
`.normalise.tf.jsonl` prêts). **Aucun n'est ingéré** : l'ingestion réelle, la décision
et toute mise en œuvre restent au GO humain, item par item (R-29).

## 5. Ce que la revue n'a pas fait (déclaré)

Pas de relecture de fond du code des forges (la revue juge par preuves exécutées et
deltas, pas par re-lecture exhaustive) ; pas de mesure terrain sur produits clients ;
pas de contre-revue indépendante (limite d'auto-audit ci-dessus) ; les engagements
privés (audit_nhood) hors périmètre ; compléments de périmètre : rien de neuf à
proposer au-delà des 6 études des 18-19/08, toutes citées dans les annotations.
