# Run pilote — preuve d'autonomie

Run : `runs\20260804-miniveille\` — produit-test **MiniVeille** (mini-outil de veille : liens + tags,
filtre, marquer lu ; FastAPI + page unique). Brief : `runs\20260804-miniveille\PRODUIT-TEST.md`.

## Verdict : RÉUSSI (1 tentative)

| Étape | Mode | Modèle | Oracles exécutés | Verdict |
|---|---|---|---|---|
| Conception | dégradé (3 verbes + verbe 4 dérivé) | Sonnet + Haiku | oracle-exigences, -tracabilite (+ vue sha256), -surface, -claims | **4/4 PASS** (1 passe) |
| Design | dégradé (systeme-de-marque), oracles natifs | Sonnet | run-oracles-design (slop, tokens ; mobile/images SANS_OBJET motivés) | **PASS** (1 passe) |
| Development | dégradé (conductor headless impossible), gates rejoués | Sonnet | ruff check, pytest (12 tests), traçabilité exigences→tests | **PASS** (2 passes), 11/11 MVP tracées |
| Tests | **natif** (`forge_tests --json`) | — (CLI) | couverture surface api 8/8 (seuil 1.0), mutation 0.714 (seuil 0.70) | **PARTIEL exit 3** — acceptable documenté, seuils tenus |

- **Ledger** : 23 entrées, vérifié `[PASS]` par `ledger.mjs verify` (outil natif forge-agents).
- **Interventions humaines** : 0 (aucun `bloque_question` — ton et contraintes fournis au brief).
- **Escalades de modèle** : 0 — le routage « départ au moins cher plausible » a tenu
  (Sonnet a tout produit en 1-2 passes, Haiku a dérivé la vue avec sha exact, Opus non requis).
- **Allers-retours development↔tests** : 1 (dépendance `coverage` manquante dans le venv produit).

## Retours collectés (8, consignés au ledger, repris au backlog de BOUCLE-AMELIORATION.md)

- **forge-tests** (3 nouveaux, en plus de R-T1…R-T6) : dépendance `coverage` du venv cible non
  déclarée ; `UnicodeEncodeError` cp1252 à l'impression du rapport JSON (contourné par
  `PYTHONUTF8=1` à l'invocation) ; `RapportRefuse` meurt en traceback sans rapport structuré.
- **forge-design** (2) : pas de token sémantique erreur/succès dans le contrat `tokens.md` ;
  l'exemple d'échelle typo de `tokens.md` viole sa propre règle ratio ≥ 1.25.
- **forge-conception** (2) : prédicat binaire E3 matché par sous-chaîne exacte (formes accordées
  non reconnues) ; oracle-claims A1 scanne les besoins qui n'ont pas de champ pour loger une source.
- **produit** (1) : 422 non déclaré + 2 mutants survivants — améliorations candidates du produit.

## Limites assumées du pilote

Trois étapes sur quatre en mode dégradé (points d'entrée natifs inexistants — dettes D-C*, D-D*,
D-V* du contrat d'interface) ; maquette complète Design (9 écrans) hors périmètre — seul le
système de marque a été produit et jugé ; 7 pans forge-tests sans contenu sur un produit
backend-only. Le mode dégradé est consigné à chaque invocation dans le ledger — rien n'est
présenté comme natif qui ne l'est pas.
