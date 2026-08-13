# Digit-AI — Revue stratégique de l'écosystème forge — 2026-08-08

Méthode : audit **delta** sur baseline nommée (INVENTAIRE.md 04-08/08, BOUCLE-AMELIORATION.md,
3 lots du pilote), santé **re-exécutée** sur les 8 périmètres (7 forges + steering), forces avec
preuve, faiblesses avec coût. 8 agents d'audit + synthèse orchestrateur. **Rien n'est mis en
œuvre** — les améliorations retenues deviendront des campagnes sur mandat humain.

---

## SYNTHÈSE À DÉCISION (1 page)

**Santé générale (re-exécutée le 08/08)** : 8/8 périmètres au vert sur leurs recettes natives
(tests S-01 tenu 90 vérifications · development ruff+mypy strict+285 tests · conception 14
règles · design 46 règles · agents 8/8 ×2 · seo 9/9+5/5 · organization oracle 2 sens ·
steering 3/3 + bootstrap 7/7 + ledgers PASS). **Une exception** : le self-test quality-oracles
est à 3 échecs côté repo (régression CRLF nouvelle) et 6 côté installation.

**Le fait dominant de la revue** : la chaîne s'améliore vite (boucle < 24 h re-prouvée, ~2 h sur
le lot 03) mais **trois actifs dorment ou dérivent** — le conductor de development (aucun
appelant, entretenu à vide), le skill méta de forge-agents (15 jours sans run), et la
synchronisation repo↔installation (2.6.1 vs 2.9.1 : le repo n'est plus la source de ce qui
s'exécute).

### Top 10 des améliorations (modèle : GAIN 1-5 × PREUVE (×2 payé en run réel) ÷ EFFORT 1-5)

| # | Amélioration | Forge | Score | Payé ? |
|---|---|---|---|---|
| 1 | **Trancher le statut du conductor** (moteur à réveiller vs référence d'architecture assumée) | development | 10,0 | OUI (D-V1 payé à chaque étape 4) |
| 2 | **RT-13** : champs manquants dérivés du pan, plus jamais empruntés au domaine `acces` | tests | 8,0 | OUI (16 actions utilisateur fausses, ASD 07/08) |
| 3 | **Régression CRLF** `digit-ai-page-html/SKILL.md` (repo + installation) — 2 échecs self-test réels | agents | 6,0 | OUI (constatée à l'audit) |
| 4 | **Audit complet sur projet libre et figé** — rendre opposables cahiers/dashboard/actions[] hors banc | tests | 4,0 | OUI (audit ASD 07/08 déclaré dégradé) |
| 5 | **`versions_forges`/`run_precedent` réellement consignés** + contrôle d'oracle — la doctrine run de version n'a jamais été appliquée au seul produit réel (0/76 entrées du ledger ASD) | steering | 4,0 | OUI (constaté sur ledger réel) |
| 6 | **Arbitrer D-V3** : l'amont de development (EXIGENCES.json/verbe 4 vs BMAD) — deux amonts concurrents sans règle | development | 4,0 | OUI (tranché à la main à chaque run) |
| 7 | **Committer le chantier oracle-motion** — un clone livre 6 oracles, le poste en exécute 7 : deux santés divergentes | design | 4,0 | NON |
| 8 | **`validate.py --mission` contrôle `schema_version`** — dérive 1.0.0/1.1.0 observée sur la mission réelle, invisible machine | seo | 3,0 | OUI |
| 9 | **Intégrité de l'archive pilote** : `runs\miniveille` est hors git — la preuve-drapeau du README n'est qu'un dossier disque | steering | 3,0 | NON |
| 10 | **CLAUDE.md d'organization + trancher Q3-bis** — débloque la Phase 3 (vérificateur machine des conventions) | organization | 3,0 | NON |

Mentions (score 2-2,7) : script de sync repo↔installation (agents — gain fort, effort 3) ·
gates de livrable exécutables RV-1/3/4 (development) · sémantique du registre de dette (tests —
« resolue » ≠ corrigé, 0 « ok » sur 89, +36 todo en 4 jours sans aucune fermeture) · reprise
idempotente jamais exercée (steering) · plafond de taille CLAUDE.md (steering — ×3,4 en 4 jours).

### Nouvelles forges — verdict du test d'admission

- **forge-ops (exploitation)** : **ADMISE comme candidate.** Trou prouvé : la MEP est portée
  par le steering faute de forge (« aucune forge ne déploie » — ETAPE-MEP.md), le déploiement
  Railway d'ASD fut artisanal, la qualif exige des instances servies-peuplées que rien
  n'outille, le canal `retour source production` n'a aucun instrument. Verbes propres :
  déployer, exploiter (surveiller, sauvegarder), restaurer. Oracles possibles : healthcheck,
  rollback prouvé, sauvegarde RESTAURÉE, dérive de config. Réutilisable : tout produit.
  Frontière : la MEP steering garde l'orchestration et le GO ; ops exécute et outille.
- **forge-contenu (éditorial)** : **candidate FAIBLE — à re-proposer sur preuve.** Le trou est
  plausible (la stratégie SEO produit une roadmap de contenus que rien ne produit ; la voix
  MARQUE.md existe ; l'aide 3 niveaux est de la production éditoriale) mais aucun run ne l'a
  encore payé. Verbes : rédiger, décliner, optimiser. Oracles : voix vs MARQUE.md, claims
  sourcés (existants), on-page SEO. À réexaminer quand un lot le réclamera.
- **Écartées nominativement** : forge-securite (couverte : pan securite + oracles
  SAST/secrets/SCA) · forge-docs (couverte : aide 3 niveaux = surface produit, conception/
  design) · forge-data/BI (aucun trou prouvé par les runs) · forge-migration (idem).

### Questions de mandat

- **Q-A** : conductor de development — (a) le réveiller (`HumanGate` déléguable + dogfooding,
  effort 4) ou (b) le déclasser en référence et assumer playbook + gates comme produit ?
  *Recommandation : (b) — deux produits réels construits sans lui, sa doctrine circule déjà.*
- **Q-B** : réconciliation REGLES-PROJET.md (steering) ↔ D-01→D-12 (organization) — qui est
  source ? *Recommandation : organization = atelier amont qui propose, steering = décideur qui
  encode ; la Phase 3 (vérificateur) s'écrit alors UNE fois, chez organization, branchée sur
  l'oracle conformité du steering.*
- **Q-C** : quelles campagnes du top 10 lancer, et dans quel ordre ?

---

## Modèle de scorage (durable — réutilisable pour tout futur retour)

`SCORE = GAIN × PREUVE ÷ EFFORT` · GAIN : 5 débloque une étape du pipeline · 4 évite un défaut
produit constaté · 3 évite un aller-retour ou une dérive d'intégrité · 2 confort/hygiène ·
PREUVE : ×2 si le coût a été payé en run réel (citer), ×1 si théorique · EFFORT : 1 (heures) à
5 (semaines).

## Test d'admission d'une nouvelle forge (durable)

(a) trou PROUVÉ par les runs/lots, évidence citée ; (b) verbes propres sans recouvrement
(contre-exemple canonique : BMAD/conception) ; (c) oracles possibles — une forge injugeable
n'est pas une forge ; (d) réutilisable sur plusieurs produits. Quatre conditions nécessaires ;
les écartées sont nommées avec leur raison.

---

## Fiches par forge (détail : santé datée, delta, forces prouvées, faiblesses coûtées)

### forge-tests — santé S-01 TENU (08/08, 90 vérifications, 2 runs identiques)
Delta : 27 commits (04→07/08) — robustesse, pans interface+qualif (12 adaptateurs), mutation
totale, seuils opposables, actions[] ternaire, livrables dérivés. Forces : recette falsifiante
90/90 · G-1 prouvé 2 sens · livrables scellés · dashboard testé contre le mensonge · usage réel
(interface 196/196 en service, mutation 0,505 sur produit « 100 % vert »). Faiblesses :
**registre de dette à sémantique trompeuse** (« resolue » = énoncé disparu, pas corrigé ; 0
« ok »/89 ; +36 todo en 4 j sans fermeture — l'inventaire steering a publié « 27 résolues » sur
cette base) · RT-13 vivant (payé) · recette monolithique 3 min 22 s sans sélecteur · aucune
mesure terrain valide en cours (dernier audit réel dégradé).

### forge-development — santé ruff 0 + mypy strict 98 fichiers + 285 tests (08/08)
Delta : 6 commits (04-05/08), rien depuis 3 jours. Forces : contrat machine (run-report, exit
codes, horloge injectable) · playbook devenu le produit réellement exporté · boucle < 24 h sur
son maillon · seul lieu où deux forges se citent par contrat. Faiblesses : **le maillon
décroche du flux d'apprentissage** (lot 03 : zéro item pour lui) · disciplines RV-1..4
inexécutables dans son propre moteur (payé en prod v0.1.0) · loi de livrable en double copie
sans source unique · D-V1 payée à chaque run · **conductor = actif dormant sur pièces** (aucun
appelant, 2 produits réels construits sans lui).

### forge-conception — santé SELF-TEST VERT (08/08, 14 règles)
Delta : 7 commits (verbe 4 livré, E3/A1 assouplis, surface implicite, critères de perception).
Forces : étape la plus fluide des DEUX runs réels (4 oracles PASS première passe, 2×) · 6
retours absorbés en 2 jours · scellés sha vérifiés. Faiblesses : oracles absents du registre
quality-oracles (R-C4) · skills non installés · **MISSION.md orpheline** (zéro usage réel) ·
E7-E9 (EARS) restés à l'état d'étude.

### forge-design — santé 46 règles VERTES sur le working tree ; l'état COMMITTÉ n'en a que 39 (6 oracles)
Delta : 5 commits (--rendu, CTA=cible, critique d'implémentation, lot 03, DESIGN.md).
Forces : boucle < 24 h · critique d'implémentation exercée (1 écart réel au 1er run) ·
DESIGN.md refuse l'inaccessible · render_page enfin installé. Faiblesses : **chantier
oracle-motion complet, testé, jamais committé** (22 fichiers — un clone et le poste ont deux
santés différentes) · dist\ périmé de 4 évolutions · R-D3 (images Gemini) tenant, bloqué sur
feu vert coût API · une entrée de boucle manquante (DESIGN.md du 07/08) — corrigée par cette
revue.

### forge-agents — santé 8/8 ×2 ; quality-oracles : 3 échecs repo / 6 installation
Delta : 7 commits (04-05/08). Forces : verrou ledger re-prouvé · atelier oracles/experts vivant
(usage réel du jour, non committé) · propagation partielle vérifiée octet à octet. Faiblesses :
**skill méta dormant depuis le 24/07** (les campagnes utilisent l'Agent tool du harnais) ·
**dérive repo↔installation prouvée** (registre 2.6.1 vs 2.9.1 — le repo n'est plus la source de
ce qui s'exécute) · régression CRLF nouvelle (2 échecs réels) · installation à 6 échecs (dont
un skill déclaré ok mais absent) · travail du jour non committé.

### forge-seo — santé 9/9 + 5/5 mission réelle (08/08)
Delta : quasi nul (travail non committé sur gabarit_html.py, à trancher). Forces : mission
réelle à jour (6ᵉ itération HTML) · refus de rapport partiel codé · séparation forge/mission
tenue. Faiblesses : baseline D-S1→D-S4 confirmée — la dérive `schema_version` est OBSERVÉE sur
la mission réelle et invisible machine (le contrôle 4 vérifie autre chose).

### forge-organization — santé oracle 2 sens (08/08)
Delta : version c des Décisions non committée (registre des types ajouté), **auto-violation
fraîche** : le doc qui édicte D-02 (indices vérifiés) n'a pas documenté son propre passage b→c.
Forces : doctrine sourcée sur 52 dossiers · oracle discriminant. Faiblesses : baseline tenante
(pas de point d'entrée, D-05/D-06 violées chez soi, Phase 3 absente, Q3/Q3-bis/Q4 ouvertes).

### steering (auto-audit) — santé 3/3 + bootstrap 7/7 + ledgers PASS (y compris ASD, 76 entrées)
Delta : 22 commits en 4 jours. Forces : 2 produits réels bout en bout · boucle ~2 h sur le lot
03 · 18 règles + oracle · transparence sur ses propres dettes. Faiblesses : CLAUDE.md ×3,4 en
4 jours sans plafond · **`versions_forges`/`run_precedent` jamais appliqués au produit réel**
(0/76 entrées malgré ≥ 2 versions livrées) · archive pilote hors git (preuve non versionnée) ·
reprise idempotente jamais exercée · recouvrement de gouvernance non tranché (Q-B).
