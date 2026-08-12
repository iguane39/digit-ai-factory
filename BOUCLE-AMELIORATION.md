# Boucle d'amélioration des forges

> **Depuis le 08/08 au soir : le suivi actif vit dans `todo\` (registre TODO-FORGE).**
> Ce document est le **journal narratif** (campagnes, décisions, contexte) — il référence les
> ids `TF-xxxx` et ne duplique plus les listes d'items. Les plans A/B/C de la revue du 08/08
> et les candidats encore ouverts des sections ci-dessous sont **migrés** dans le registre
> (TF-0001…TF-0041, tous en `candidat`) ; les sections historiques restent telles quelles
> comme archive narrative.

Version 1.0.0 — 2026-08-04

Le steering améliore les cinq forges par **itérations bornées**. Jamais d'amélioration spontanée,
jamais d'application sans validation humaine.

## Canal des retours produits (règle 18, 06/08/2026)

Chaque produit prépare ses retours dans `forge\retours\` — un lot = un fichier
`RETOURS-<AAAAMMJJ><indice>.md` (gabarit : `gabarits\RETOURS-FORGES.md`), généré à chaque
clôture de run et à chaque inspection/incident. **Remise progressive** : l'humain copie le lot
dans `input\` du steering quand il veut déclencher une campagne — l'original reste chez le
produit (historique), le lot remis ne se modifie plus. Côté steering : chaque lot reçu est
traité comme campagne de ce document (généralisation, mise en œuvre, preuve, push), consigné
ci-dessous avec sa source. Les confirmations positives des lots closent les entrées « à
vérifier » du backlog.

Convention confirmée par l'usage (RS-8, lot 03) : **un fichier par remise, jamais ré-augmenté
après transmission** — un fichier cumulatif forcerait le steering à re-trier les lots déjà
traités. La forme historique `RETOURS-FORGES-<NN>.md` est acceptée au même titre que la forme
canonique datée ; un `RETOURS-FORGES.md` de tête peut servir d'**index des lots** du produit.

**Cas nominal prouvé** (RS-9, lot 03) : lot 01 remis le 05/08 au soir → RT-6/RT-7 implémentés
dans la nuit → **constatés en service par le run produit le 06/08** (pan interface 196/196 sur
16 écrans, `non_testables[]` et `--reprendre` au rapport, 4 divergences réelles attrapées puis
leur correction validée). Première itération complète de la boucle inter-forges : retour →
campagne → application → vérification en service, en moins de 24 h. RT-6/RT-7 : **soldés**.

## Le cycle (borné par construction)

```
retour consigné ──► qualification ──► PROPOSITION (diff + justification) ──► validation humaine ──► application ──► vérification
     (ledger)        (1 itération =                                          (feu vert explicite,     (par le steering,    (oracles/self-test
                      1 déclencheur,                                          scopé à ce diff)         commit dans la       de la forge
                      1 forge,                                                                         forge concernée)     concernée au vert)
                      1 proposition)
```

- **Déclencheur** : un `retour` consigné dans un ledger de run. Trois sources : la forge elle-même
  (défaut rencontré en l'invoquant), une autre forge (incompatibilité d'interface), le produit
  construit (défaut du livrable remonté à sa forge d'origine). Pas de retour consigné → pas d'itération.
- **Périmètre** : une itération = **une forge**, un ensemble cohérent de modifications répondant à
  **un** retour. Pas de refonte opportuniste, pas de drive-by.
- **Sortie** : un fichier `propositions\<AAAAMMJJ>-<forge>-<slug>.md` contenant : le retour d'origine
  (référence ledger), le diagnostic, le diff proposé, la justification, le test de vérification
  (quel oracle/self-test prouvera que c'est corrigé sans régression).
- **Validation** : le « ok » de l'humain porte sur **cette proposition précise**. Un ok sur le
  diagnostic ne vaut pas mandat d'application.
- **Vérification** : après application, exécuter le self-test/les oracles de la forge modifiée ;
  un rouge = revert et retour au diagnostic.

## État au 04/08/2026 (soir) — campagne de mise en œuvre exécutée

Sur mandat humain explicite (« mets-les en œuvre, teste-les, pousse-les »), une campagne a traité
le backlog, chaque forge vérifiée par sa recette native puis rejouée par l'orchestrateur avant push :

- **Appliqués et poussés** : forge-tests R-T1/T2*/T3/T4/T5/T6/T7/T8/T9 + dette uv.lock
  (5 commits, recette 12/12 rouge + 0 bloquant vert, e2e miniveille exit 3 sans PYTHONUTF8) ·
  conception R-C3(doc)/C5/C6 (3 commits, self-test 14 règles vert, 4 oracles PASS sur livrable réel) ·
  design R-D1/D2/D4/D5/D6 (3 commits, self-test vert, run-oracles exit 0 sur livrable réel) ·
  development R-V1/R-V5-CLI+doc (3 commits, ruff 0, mypy strict 0, 284 tests verts, 19 nouveaux) ·
  agents R-A1/A2/A3 + durcissement verrou Windows (4 commits, self-test 6/6 rejoué 5×,
  preuve de concurrence 51/51 seq sans collision).
- *R-T2 partiel assumé : le `webServer` Playwright du projet audité peut encore écrire chez lui
  (déclaré `non_juge`) ; pans visuel (goldens versionnés) et mutation (modifie-restaure) déclarés
  au README de forge-tests plutôt que corrigés.
- **Différés (exigent un arbitrage humain de fond)** : R-D3 (producteur d'images Gemini — chantier
  neuf), R-V2 (adaptateurs amont conception/design → development) + R-V4 (recouvrements BMAD et
  gates — arbitrage de périmètre), R-V3 (délégation des HITL — constitutionnel), ruff à 0 sur
  forge-tests (30 erreurs préexistantes, dont des défauts PLANTÉS du banc — les corriger
  fausserait la recette).

## 08/08/2026 (soir) — Revue stratégique de l'écosystème (audit delta, 8 périmètres)

Rapport : `output\Digit-AI - Revue Forge - Écosystème - 20260808a.md` — santé re-exécutée 8/8
(sauf self-test quality-oracles : 3 échecs repo / 6 installation), modèle de scorage durable
(GAIN×PREUVE÷EFFORT), test d'admission des nouvelles forges. **Top 10 scoré au rapport** —
têtes : trancher le statut du conductor (10,0), RT-13 (8,0), régression CRLF SKILL.md (6,0),
audit complet sur projet libre (4,0), versions_forges jamais consignés au produit réel (4,0).
**Candidats nouveaux au backlog** : sémantique du registre de dette tests (« resolue » ≠
corrigé, 0 ok/89) · conductor dormant (Q-A) · dérive repo↔installation prouvée 2.6.1/2.9.1 ·
oracle-motion complet jamais committé · MISSION.md orpheline · archive pilote hors git ·
reprise idempotente jamais exercée · CLAUDE.md ×3,4 sans plafond · auto-violation D-02 chez
organization. **Nouvelles forges** : forge-ops ADMISE candidate (trou prouvé : MEP sans forge,
déploiement artisanal, qualif sans instances outillées) · forge-contenu faible (à re-proposer
sur preuve) · securite/docs/data/migration écartées nominativement. **Décisions humaines du 08/08** : **Q-A** — le conductor RESTE (décision : « il a été utilisé
pour Produit-12, on laisse » — statut actif côté produit, l'item « trancher » sort du top
10 ; D-V1 reste au backlog pour le jour où le steering voudra l'invoquer en headless).
**Q-B** — « organization organise, steering pilote » : organization = atelier amont des
conventions, steering = décideur-encodeur-vérificateur (encodé au CLAUDE.md). **Q-C** — top 10
re-présenté à décision (voir rapport, ajusté post-Q-A).

## 08/08/2026 — forge-seo et forge-organization au référentiel

Deux forges ajoutées (inventaires exhaustifs au dossier INVENTAIRE.md §6-7) : forge-seo
(post-MEP récurrente, CLI natif, une mission client réelle livrée, validate 9/9 vérifié) et
forge-organization (doctrine transverse, mise sous git + GitHub privé par le steering le
08/08). Bootstrap étendu à 7 forges avec preuves. **Candidats consignés** : réconciliation
D-01→D-12 (organization) ↔ REGLES-PROJET.md (steering) — deux sources de gouvernance sur le
même domaine ; côté seo : D-S1→D-S4 (générateurs manquants, snapshot non validé machine,
moteurs ad hoc chez la mission à généraliser) — au fil des lots.

## 07/08/2026 — cahiers de tests vivants + dashboard d'exécution + boucle de fermeture

Campagne sur prompt humain amélioré (L99). **forge-tests** (5 commits) : cahiers fonctionnel/
technique DÉRIVÉS et scellés sha256 (exhaustivité opposable : couvert-ou-nommé, chapitres
dérivés du registre des adaptateurs), jeux de données synthétiques à garde-fou levant (6 motifs
de refus, domaines `.test`), **`actions[]` ternaire au rapport** (auto_ia / manuelle_dev /
manuelle_utilisateur × etape_cible development/tests-suite/design/mep-config/forge), dashboard
HTML autonome 6 onglets à source unique (totaux recomparés au rapport — un total faux est
détecté en recette ; check_html + render_page PASS, contrastes et débordements mobiles corrigés
par render_page), `--precedent` pour la tendance, `--reprendre` régénère les livrables.
Recette : 52 vérifications nouvelles chacune avec son rouge, S-01 tenu, rejouée par
l'orchestrateur. **steering** : boucle de fermeture bornée multi-étapes (3 cycles, G-2,
re-audit complet, défaut d'auditeur → canal lots), DOSSIER-MEP embarque dashboard + actions
utilisateur. Preuve ASD (lecture seule 169/169) : 207 éléments fonctionnels / 204 cas /
3 non couverts nommés ; 38 exigences orphelines nommées ; audit dégradé DÉCLARÉ (un agent
travaillait sur le produit — v0.3.0 ; audit complet à rejouer projet libre).

**Retour candidat né de la campagne (RT-13, majeur)** : sous `FORGE_TESTS_SANS_EXECUTION=1`,
`qualification.qualifier` attribue `FORGE_TESTS_QUALIF_URL` comme champ manquant à TOUS les
pans SKIP (data/api/migrations compris) — le mécanisme doit préférer le `CHAMPS_REQUIS` propre
au pan. Conséquence constatée : 16 actions manuelle_utilisateur d'ASD demandent une URL à tort.

## 06/08/2026 (soir) — lot 03 : couverture au-dessus des standards + précisions de perception

Source : `input/RETOURS-FORGES-03.md` + campagne pré-rédigée par le run produit
(`Produit-12/forge/PROMPT-AMELIORATION-FORGE-TESTS.md`), déroulée avec ses critères
exécutables. **forge-tests** (8 commits) : mutation à périmètre TOTAL (33/34 modules d'ASD
mutés contre 7, échantillonnage profondeur-seulement, exclusions nominatives), `modules[]`
sans module silencieux, 6 seuils opposables versionnés (`seuils.py`), **pan `qualif`** (12ᵉ)
généralisé du prototype produit (bancs servis en HTTP par la recette, rouge 5 défauts nommés /
vert 14/14), `pans_non_couverts {pour_couvrir}`, RT-9 (garde déportée résolue 1 niveau),
RT-10 (montages statiques exclus). Résultat de fond : le produit « 100 % vert » sort à
**mutation 0,505** — dix modules métier sous 0,35, deux à 0,00 : RT-12 est mesuré et opposable.
La campagne a trouvé 3 défauts non prévus au mandat, dont une **violation G-1 dormante**
(LF→CRLF sur 23 fichiers du produit — restauré 165/165 empreintes, cause corrigée, témoin en
recette) et les f-strings Python 3.12 mutées en mutants équivalents. Recette 16/16 rejouée 2×
identique + rejouée indépendamment par l'orchestrateur. **conception/design** : RC-4 (critère
onboarding = expérience dominante), RD-6 (un seul CTA visible par écran + test-garde au texte
visible), RD-7 (aide à 3 niveaux, écran 10 du socle). **RS-8/RS-9** au canal. Non-faits
déclarés : qualif non exécutée contre ASD servi (G-1 — SKIP motivé accepté par le mandat),
19 ruff préexistants, suite unitaire propre de forge-tests (dette connue).

## 06/08/2026 — socle de règles projet (17 règles décidées + oracle exécutable)

Inventaire de 11 dépôts → `REGLES-PROJET.md` (17 règles, 4 conflits arbitrés par l'humain :
Old\ hors git, commits locaux par défaut, code jamais daté, journaux d'oracles versionnés).
Encodé : socle créé à l'ouverture de run (CLAUDE.md étape 1), rattrapage en tête de run de
version, et `oracles\oracle-conformite-projet.mjs` (self-test double sens 3/3 ; preuve terrain :
8 findings nommés sur Produit-12, dont l'absence de git).

## Campagne du 11/08/2026 — création de forge-ops (TF-0040 décidé → corrigé)

Mandat humain : prompt réécrit L99 lancé (« Je décide TF-0040 »), tracé au registre. La 9ᵉ
forge comble le dernier trou prouvé du pipeline : la MEP portée à la main, déploiement
artisanal. **Preuve par le geste dès la v0** : le self-test rejoue un déploiement réel local
(v1→v2), un rollback effectif et le refus des 4 défauts types — 14 PASS (2 itérations de
boucle sur 3 : un faux positif O4 corrigé — être sur la plus ancienne release après
restauration est un état sain).

Livré : dépôt `digit-ai-forge-ops` (ops.mjs — healthcheck AVANT bascule, COURANT atomique,
journal au contrat ledger ; oracle-ops O-1…O-4 ; frontières écrites : la forge outille, le
pilot décide, l'humain donne le GO, M-1…M-5 jamais dupliqué). Les 8 documents pilot mis en
cohérence, chacun sous son oracle : bootstrap (9 forges, exit 0), CLAUDE.md dégraissé
6182→6056 octets (oracle PASS — et 4 docs de veille déménagés de `references\` vers
`veille\`, orphelins N3 résolus), CONTRAT-INTERFACE §5 (Ops **natif**, dettes D-P1 cibles
cloud / D-P2 garde-fou produit-direct), ETAPE-MEP §0 bis (articulation gestes/verdicts),
INVENTAIRE §9, fiches/forge-ops.md, README, schéma V1e « Dix forges » (nœud ops + lien
outillage MEP, check+render PASS, PNG inspecté). TF-0040 clos avec gains constatés.

## Campagne du 10/08/2026 (soir) — ouverture publique de l'écosystème (mandat humain)

Décision humaine : toutes les forges publiques sous MIT, « comme development », avec
chantiers d'assainissement en amont. Réalisé :

- **7 forges publiées telles quelles** après balayage (0 secret, 0 `.env` d'historique) :
  pilot, conception, design, development (déjà publique), tests, seo, organization —
  LICENSE MIT « Copyright (c) 2026 Digit-AI » partout.
- **forge-agents : chantier d'assainissement puis publication.** Bundle privé archivé hors
  dépôt ; artefacts d'engagement retirés de l'index mais conservés sur disque (`input/` avec
  CDC client et propales, `p4/`, `defs-p4/`, `output/`, `.queue/`, ledgers, 5 agents compilés
  d'engagement — tous ignorés par git) ; corpus/fiches experts **anonymisés** (secteur et
  techno conservés, noms clients retirés) ; règle appliquée : *nom seul toléré (déjà public
  au pilot) · nom + détail d'engagement anonymisé · document d'engagement retiré*.
  **Historique neuf** (1 commit, auteur gmail) — précédent maison auditcore (RAF-029).
  Self-tests au vert avant push : 10/10 · 133 · 28/28. → PUBLIC + MIT.
- **audit : la séparation produit/tenant fait la décision** (doctrine
  `SEPARATION-PRODUIT-TENANT`) : **auditcore** (produit marque blanche, 0 mention tenant
  vérifié, 0 secret) → **PUBLIC + MIT** ; `digit-ai-forge-audit` (espace d'engagement Client-A,
  189 fichiers client, submodules privés) → **reste privé**, par conception.

État final : **9 dépôts publics MIT** (8 forges + auditcore), 1 privé (engagement audit).

**Post-scriptum 11/08 — nommage stabilisé** (décision humaine) : le produit prend le nom
canonique — `digit-ai-forge-auditcore` → **`digit-ai-forge-audit`** (public MIT) ; l'espace
d'engagement → **`digit-ai-forge-audit_client-a`** (privé). Recâblé partout : `.gitmodules` de
l'engagement, remotes locaux, clone du produit en `c:\dev\digit-ai-forge-audit`, preuve
bootstrap = `core/invariants.json`. Le bootstrap équipe désormais les postes avec le produit
public ; les engagements restent hors bootstrap.

**Post-scriptum 11/08 bis — identité** : historiques des 10 dépôts réécrits en
`iguane39@gmail.com` uniquement (l'email d'engagement traînait en config locale du dépôt
audit et dans les commits antérieurs) ; protection de branche development levée puis remise
à l'identique ; tag auditcore migré ; pin submodule recalé.

## Campagne du 10/08/2026 — santé des transverses (C1-C5, mandat humain direct)

Source : diagnostic read-only des 3 skills transverses (question humaine « faut-il une passe
Opus 5 ? » → réponse : non aux réécritures, oui aux défauts mesurés). Baseline : forge-agents
10/10, page-html 28/28, **quality-oracles 123 ✅ / 9 ❌**. Cinq corrections mandatées « fais
les 5 », toutes vérifiées par self-test avant push :

- **C1 · portabilité Windows de la résolution Python** (8 des 9 échecs) : `which` (Unix),
  `python3` (nom Unix) et l'alias Microsoft Store combinés. Nouveau `lib/python.mjs`
  (validation fonctionnelle : seul un interpréteur qui exécute `import sys` est retenu),
  branché sur oracle-pptx, oracle-charte-pptx-semantique, oracle-programme-formation et le
  runner de fixtures du self-test. quality-oracles : **PASS (133 contrôles)**.
- **C2 · oracle-motion écrit** (le 9ᵉ échec — entrée de registre sans exécutant) : R1-R7
  dérivées de review-animations (E. Kowalski, MIT), fixtures rouge/verte, câblé au self-test
  design (**7 oracles, 45 règles**) et à `run-oracles-design`.
- **C3 · divergences installé/source résorbées** : quality-oracles (l'installé avait 16
  oracles, la source 46) et page-html resynchronisés — source forge-agents = canonique.
- **C4 · durcissement UTF-8 stdout généralisé** (crash cp1252 sur ✅/①-⑤/— constaté 4× dans
  la journée) : garde `reconfigure("utf-8")` posée sur oracle-a11y, oracle-visual-diff,
  check_html, self_test (render_page déjà fait le matin).
- **C5 · génération de modèles épinglée** au CONTRAT-INTERFACE §4 : famille Claude 5
  (Fable 5 / Opus 5 / Sonnet 5 / Haiku 4.5), datée, avec rappel que tout saut de génération
  re-teste l'a priori de routage (§4 bis) au lieu de le reconduire.

Verdict final : 4 self-tests verts (133 + 10 + 28 + 45 contrôles/règles). Leçon d'écosystème :
les défauts venaient de l'environnement (Windows) et d'une dette de registre — pas du modèle
qui a écrit le code ; les oracles restent le seul juge de correction.

## 06/08/2026 — revue graphique d'implémentation (nouvelle capacité)

Sur proposition humaine validée : forge-design intervient désormais AUSSI en aval — mode
« critique d'implémentation » de `critique-le-design` v1.1.0 (le produit implémenté jugé contre
sa promesse design : tokens, écrans/états, CTA, rendu 2 thèmes, voix ; écarts ancrés versés au
ledger comme retours vers development). Étape 5 bis du steering, en parallèle de tests
(fonction/forme, frontière écrite avec le pan `interface`). Exercé sur le run pilote : tokens
conformes, rendu PASS, 1 écart CTA réel détecté du premier coup.

## Campagne du 05/08/2026 (soir) — retours de PRODUCTION v0.1.0, généralisés

Source : `input/RETOURS-FORGES-02.md` (complément production : 12 défauts trouvés par
l'utilisateur en 10 min malgré 100 % de couverture mesurée). Mandat : généraliser — traiter les
causes racines sur un périmètre large. **Quatre lois transverses** encodées dans le CLAUDE.md du
steering et déclinées dans chaque forge :
1. *Toute affordance est câblée ou n'existe pas* — conception : exigence socle candidate ·
   design : pattern « un CTA = une cible » + contrôle C15 exécutable dans check_maquette.py ·
   development : discipline + test · tests : **nouveau pan `interface`** (contrôle statique des
   éléments inertes, tout le projet, limites déclarées) — prouvé : 5/5 câblés sur MiniVeille,
   5 inertes nommés sur la fixture rouge.
2. *Frontières d'environnement explicites* — `*_MODE_DEMO` absent par défaut (development,
   conception), **qualif populée** avant GO (ETAPE-MEP §3 bis) avec endpoint de peuplement gated.
3. *L'oubli n'existe pas* — surface implicite SaaS proposée d'office et écartée explicitement
   (enumere-la-surface, exception close et versionnée).
4. *Une donnée volatile est une donnée* — catalogues/tarifs en base, datés, sourcés
   (development, conception).
Plus : **RT-6** `non_testables[]` agrégé au-dessus des 11 adaptateurs + `--reprendre <rapport>`
(rejoue uniquement le non-exercé, provenance à l'élément — vérifié : `pans_repris_sans_rejeu`) ·
**RT-8** généralisé en module `forge_tests/sql.py` partagé (3 autres lecteurs corrigés du même
motif « parser avant filtrer », littéraux gérés, recette 13/13) · **RS-6** run de version défini
(ledger N = entrée du run N+1, delta par étape, tests toujours complets) · **fraîcheur des
forges** : pull obligatoire à l'ouverture de run + versions consignées dans `run_open`.
Différé : RT-7 volet Playwright (« effet observable » dynamique — le contrôle statique couvre le
repli) ; composants `.jsx/.tsx/.vue/.svelte` hors pan interface (déclaré `non_juge`).

## Campagne du 05/08/2026 — retours du premier produit réel (Produit-12)

Source : `input/RETOURS-FORGES.md` (compilé à la clôture du premier run bout en bout réel,
brief → production Railway). Mise en œuvre sur mandat humain, chaque forge revérifiée par
l'orchestrateur avant clôture :

- **forge-tests** : RT-1 (repli sqlite3 dans la sonde data + motifs explicites — prouvé sur
  MiniVeille : « 33 instructions SQL OBSERVÉES… schéma créé par le code applicatif »), RT-2
  (`FORGE_TESTS_APP=module:attribut` + finding `sonde-muette:api`), RT-3 (section « Contrat du
  projet audité » au README, chaque affirmation vérifiée dans le code — 2 écarts découverts et
  documentés : Alembic non mesuré, batch limité à `app/batch.py`), RT-4 (DDL jamais évincé de la
  fenêtre, contrainte résiduelle documentée). Recette 12/12 rouge + 0 bloquant vert, 2 runs
  identiques.
- **forge-conception** : RC-1 (S1 en `SANS_OBJET` nommé quand ratio ≥ seuil — le `--seuil` de S2
  devient opérant, self-test double sens conservé), RC-2 (ton par délégation documenté dans
  derive-les-vues).
- **forge-design** : RD-2 (`--rendu` sur run-oracles-design : render_page clair + sombre
  auto-généré + oracle-a11y, SKIP motivé si outillage absent). RD-1 (faux positif V4 intra-icône
  SVG < 48 px) corrigé dans `~/.claude/skills/digit-ai-page-html/scripts/render_page.py` —
  **hors git, non poussable**, prouvé dans les deux sens (icône composite ignorée, vrai
  chevauchement de layout toujours détecté).
- **forge-development** : RV-1/RV-2 (run-playbook : traçabilité `E-xxx` en docstring + gate grep
  100 %, checklist « produit auditable » vérifiée contre le code de forge-tests).
- **forge-agents** : RA-1 (`ledger.mjs append --fichier`, BOM PowerShell absorbé, self-test 8/8
  rejoué 5×), RA-3 (déclencheur « CDC de cadrage » restreint au motif `## SECTION 0` — un README
  ne matche plus, le gabarit matche ; **l'installation `~/.claude` porte encore le défaut**, à
  corriger sur décision). RA-2 (calibrage Sonnet vs Opus) : à mesurer au prochain run.
- **steering** : RS-1 (verbe 4 natif, D-C2/D-C4 soldées), RS-2 (discipline d'auditabilité à
  l'étape development), RS-3 (règle de sélection des smoke tests M-3 : impact max du
  référentiel), RS-4 (M-4 premier déploiement : N-1 = N accepté déclaré), RS-5 (ton par
  délégation au prompt canonique).
- **Vérifiés en conditions réelles** (RT-5, confirmations du run) : R-T1/T2/T3/T4/T5/T8 du
  04/08 tiennent sur un projet réel — entrées closes.

## Backlog initial (issu de l'inventaire du 2026-08-04)

Retours candidats déjà collectés, par forge, priorisés. Statut : `candidat` tant que l'humain n'a
pas demandé de proposition.

### forge-tests (les plus urgents — bloquent l'étape 4 en conditions réelles)
| id | Retour | Gravité |
|---|---|---|
| R-T1 | `subprocess.TimeoutExpired` non attrapée (`execution.py:191`) tue l'audit entier sans rapport | bloquant |
| R-T2 | Garde-fou lecture-seule G-1 violé : artefacts écrits dans le projet audité (34 Mo constatés) | bloquant |
| R-T3 | `text=True` sans `encoding=` → `UnicodeDecodeError` cp1252 sous Windows | majeur |
| R-T4 | Rapport non persistable (`--sortie` absent) ; `--generer --json` pollue stdout | majeur |
| R-T5 | Pan front vise localhost au lieu de `FORGE_TESTS_BASE_URL` | majeur |
| R-T6 | README périmé (« aucun code produit ») ; exit code 2 spécifié non implémenté | mineur |
| R-T7 | *(run pilote)* dépendance `coverage` exigée dans le venv du projet cible, déclarée nulle part — « couverture non mesurable » sans message actionnable | majeur |
| R-T8 | *(run pilote)* `UnicodeEncodeError` cp1252 à l'impression du rapport `--json` sous Windows (contournement invocation : `PYTHONUTF8=1`) | majeur |
| R-T9 | *(run pilote)* `RapportRefuse` (règle conjointe) meurt en traceback avec un JSON de 0 octet au lieu de produire un rapport de refus structuré | majeur |

Note : des correctifs pour R-T1/R-T2/R-T3/R-T5 sont déjà rédigés dans le prompt de reprise de
forge-tests, avec la mention « ne rien appliquer sans mon feu vert » — la proposition steering
consistera à les reprendre tels quels, pas à les réinventer.

### forge-conception
| id | Retour | Gravité |
|---|---|---|
| R-C1 | ~~Verbe 4 `derive-les-vues` absent~~ — **résolu côté forge** (constaté le 04/08 à la mise sous git : `skills/derive-les-vues/` existe) | résolu |
| R-C2 | ~~Lien mort `references/formulation.md`~~ — **résolu côté forge** (fichier présent au 04/08) | résolu |
| R-C3 | Pas de manifeste/README ; état « bloqué sous le seuil » sans protocole machine | majeur |
| R-C4 | `MISSION.md` sans gabarit ni fixture ; oracles non enregistrés au registre quality-oracles | mineur |
| R-C5 | *(run pilote)* prédicat binaire E3 matché par sous-chaîne exacte — les formes accordées (« sont présentes ») ne matchent pas, ce qui force des formulations artificielles | mineur |
| R-C6 | *(run pilote)* oracle-claims A1 scanne `besoins[].enonce` qui n'a aucun champ pour loger une source — un chiffre légitime dans un besoin est un FAIL non réparable | mineur |

### forge-design
| id | Retour | Gravité |
|---|---|---|
| R-D1 | Critères bloquants C1/C6/C7 sans exécutant (render_page.py, oracle-claims, oracle-nommage non résolus) | majeur |
| R-D2 | `run-oracles-design.mjs` non documenté ; skills non installés ; dist/ désynchronisé | majeur |
| R-D3 | Producteur d'images Gemini spécifié, jugé (oracle-images), jamais implémenté | majeur |
| R-D4 | Aucune convention d'emplacement des sorties, ledger de run exigé mais non spécifié | mineur |
| R-D5 | *(run pilote)* `tokens.md` n'offre aucun token sémantique erreur/succès alors que la page témoin doit démontrer un état d'erreur | mineur |
| R-D6 | *(run pilote)* l'exemple d'échelle typographique de `tokens.md` viole sa propre règle ratio ≥ 1.25 (premier pas ×1.167) | mineur |

### forge-development
| id | Retour | Gravité |
|---|---|---|
| R-V1 | Aucune sortie machine (`SprintReport` jeté, exit toujours 0) | majeur |
| R-V2 | Aucun adaptateur amont (EXIGENCES.json → `_bmad-output/` ; tokens.css/MARQUE.md → `design/DESIGN.md`) | majeur |
| R-V3 | `HumanGate` headless toujours False — pas de délégation possible des HITL à un orchestrateur | majeur |
| R-V4 | Recouvrement non arbitré : BMAD refait la conception, les gates internes recouvrent forge-tests | majeur |
| R-V5 | Paramètres clés (`saas_scope`, `brand_charter`) inaccessibles par le CLI ; dogfooding DE-1 non fait | mineur |

### forge-agents
| id | Retour | Gravité |
|---|---|---|
| R-A1 | `ledger.mjs` sans verrou d'écriture concurrente (collision seq constatée) | majeur |
| R-A2 | Chemins absolus obsolètes (`C:/dev/Forge-Agents/`) dans profil d'admission et ledger | majeur |
| R-A3 | Pas de convention de runs (defs/ vs defs-p4/), pas de README/CLAUDE.md | mineur |

## Ordre recommandé (si l'humain demande des propositions)

1. **R-T1 + R-T2 + R-T3 + R-T5** (forge-tests) — correctifs déjà rédigés côté forge, il ne manque
   que le feu vert ; débloquent l'étape 4 sur projets réels.
2. **R-C1** (verbe 4) — débloque la sortie native conception → design et supprime la dette D-C2.
3. **R-V2** (adaptateurs amont) — c'est la couture centrale de l'écosystème ; à concevoir avec
   l'arbitrage R-V4.
4. Le reste au fil des retours de runs.

## 09/08/2026 — renommage : forge-steering devient forge-pilot

Décision humaine du 09/08. Dépôt GitHub renommé (`digit-ai-forge-pilot`, l'ancien nom
redirige), dossier local renommé avec **jonction de compatibilité**
`c:\dev\digit-ai-forge-steering → digit-ai-forge-pilot` (les produits existants et leurs
chemins absolus continuent de fonctionner jusqu'à leur rattrapage en run de version).
Documents vivants mis à jour ; l'HISTOIRE n'est pas réécrite (ledgers, TODO.jsonl,
entrées passées de ce journal, livrables datés d'output\ : le mot « steering » y reste un
fait d'époque). Les événements TF futurs portent `demandeur: pilot`.

## 09/08/2026 (soir) — boucle TODO sur mandat global : 41 items construits en une campagne

**Mandat humain** : « Boucle pour construire tous les éléments de la TODO qui ne nécessitent
pas d'entrants de ma part. » Décision globale tracée au registre (`decideur` sur chaque
`decide`). Périmètre : 44 items pris (41 construits + 3 clos de fait sur preuves de la
veille), 12 laissés en `candidat` avec leur raison (entrant humain requis), 2 restés
`en_cours` (TF-0029 recommandé à l'écart, TF-0039 attend une décision D-xx).

**Dispositif** : première campagne sous `gabarits\AGENT-CAMPAGNE.md` (TF-0050, construit en
ouverture puis utilisé par les 7 prompts) — 7 agents parallèles, un par dépôt cible, le
pilot construisant ses propres items pendant ce temps (R10, R-19, noyau CLAUDE.md ≤ 6 Ko +
`references\`, oracle-claude-md, archive du run pilote, fiches d'audit, exercice de reprise,
règles §3 bis et §4 bis du contrat). Chaque rapport vérifié par sondage avant clôture
(self-tests rejoués, commits inspectés, arbres contrôlés). Détail par item : registre
TF (`gains_constates` exigés partout), commits cités dans `version_forge_corrigee`.

**Routage instrumenté** (§4 bis du contrat — première campagne mesurée) :

| Tranche | Modèle | Items | Tokens | Outils | Durée | Verdict |
|---|---|---|---|---|---|---|
| installations | Sonnet | 2/2 | 76 k | 17 | 2,5 min | vert |
| organization | Opus | 5/5 | 177 k | 59 | 18 min | vert |
| conception | Sonnet | 2/2 | 205 k | 97 | 18 min | vert |
| development | Sonnet | 3/3 | 201 k | 121 | 19 min | vert |
| seo | Opus | 5/6 | 218 k | 148 | 27 min | vert (1 item non fondé) |
| tests | Opus | 5/5 | 299 k | 193 | 39 min | vert |
| agents | Opus | 10/10 | 309 k | 202 | 47 min | vert |

`escalade_modele` : **aucune** sur 7 tranches. Donnée saillante : les 3 tranches Sonnet —
dont development, qui portait des gates exécutables et le conductor — sont toutes vertes au
premier coup à coût comparable. Le tableau §4 a désormais de quoi être challengé : la
prochaine campagne comparable devrait tenter une tranche « construction » de plus en Sonnet.

**Écritures dans les dépôts frères** : couvertes par le mandat global de ce jour, garde-fou
reformulé au noyau (« hors mandat humain explicite ») — les campagnes mandatées écrivent,
tout le reste passe par lots et propositions. Le harnais a signalé ces écritures comme
sensibles sur 3 campagnes : lecture faite, elles sont conformes au mandat (commits locaux,
jamais de push). Décision à valider séparément : la réconciliation `740ec6c` (quality-oracles
installation→dépôt) verse sous git du travail de la session du 08/08 — commit isolé,
réversible seul, vérifié strictement additif (440+/7−).

**Constats de campagne devenus candidatures** : TF-0063…TF-0078 (16 créations, dont la
dérive skill↔dashboard qui met la recette de forge-tests en rouge — TF-0063 — et la
canalisation des sidecars du hook qualité — TF-0065). L'incident structurel du jour : trois
campagnes ont dû nettoyer les journaux `.oracles*` semés par le hook de session dans leurs
dépôts cibles.

**Bilan registre** : 48 `corrige` (dont les 5 de la veille), 28 `candidat`, 2 `en_cours` ;
oracle R1-R10 PASS, self-tests TODO 18/18 et conformité 3/3, vue et page régénérées
(sceau 82c9248684ef).

## 12/08/2026 — campagne « catalogues de services & prompts d'usage » (mandat humain de session)

**Mandat** : message humain du 12/08 (prompt de campagne passé au crible L99 puis barré —
3 barres validées au registre la-barre : Backstage descriptor format pour le catalogue,
standard AGENTS.md pour la surface d'entrée agent, rustup.rs pour les prompts deux lignes).

**Livrables** : `catalogues\catalogue.jsonl` (source unique, 42 services / 10 forges, 33
prouvés / 9 déclarés, champs cycle_de_vie + challenge_date, comptages vérifiés sur pièces) ·
vues générées `catalogues\CATALOGUES.md` + section README (`generer-vues.mjs`, --check) ·
`oracles\oracle-catalogues.mjs` (K1-K7, self-test double sens 5/5) · `AGENTS.md` + en-tête
agent du README (phase 0 idempotente) · `references\ACCUEIL.md` (protocole d'accueil 7 étapes,
accord explicite avant exécution, 2 tours de correction max) · section « Prompts d'usage »
réécrite au format deux lignes (0-6, PROMPT-PRODUIT.md rétrogradé en voie optionnelle à
fichier) · coquilles README corrigées (scripts\new_mission.py, forge\retours\) · **lot D en
proposition** : `output\20260812-catalogues-readmes-forges\` (10 sections README de forge,
AUCUNE écriture dans les dépôts frères — application forge par forge sur GO humain).

**Challenge état de l'art (A3)** : 4 agents Sonnet en parallèle, ≥ 3 sources datées par forge,
constats convergents (le marché 2026 est passé du one-shot au continu ; standards gagnants
gratuits et inspectables). 13 candidatures ingérées (lot `dd28b8a70c37`, sidecar +
`ingerer-lot.mjs`) dont 2 nouvelles forges candidates (sécurité agentique, observabilité
continue) et 1 constat de dérive documentaire (INVENTAIRE vs réel : options CLI forge-tests,
5/20 oracles-règles conception, 73/169 ADR-contrôles audit).

**Routage instrumenté (§4 bis)** — 4 tranches équivalentes (challenge par forge), toutes Sonnet :

| Tranche | Modèle | Tokens | Outils | Durée | Verdict |
|---|---|---|---|---|---|
| conception+organization+audit | Sonnet | 76 k | 19 | 2,9 min | vert |
| design+development | Sonnet | 73 k | 22 | 2,5 min | vert |
| tests+seo | Sonnet | 97 k | 26 | 3,5 min | vert |
| agents+ops+data | Sonnet | 61 k | 20 | 3,1 min | vert |

`escalade_modele` : **aucune** (4/4 vertes au premier coup — l'a priori « recherche/synthèse
= Sonnet » tient). Construction (catalogue, oracle, ACCUEIL, README) : pilot en session.

**Vérifications natives** : oracle-catalogues self-test 5/5 puis réel PASS (K1-K7) ·
generer-vues --check PASS · oracle-claude-md PASS (noyau recompressé à 6 143 octets après
citation d'ACCUEIL.md) · oracle-ecosysteme PASS · oracle-todo R1-R10 PASS · self-test TODO
18/18. État préexistant du working tree : 2 événements TODO non commités de la session du
11/08 (TF-0100 + ingestion) — embarqués dans ce commit, ils appartiennent au registre ;
entrants `input\` non liés laissés intacts. Test à froid : consigné à l'entrée suivante.

**Test à froid (12/08, complément au commit 4d3b1bf)** : clone du pilot (état commité) dans
un répertoire vierge du scratchpad — AGENTS.md, references\ACCUEIL.md et
catalogues\catalogue.jsonl présents au clone — puis `node bootstrap.mjs --racine <vierge>` :
dix forges clonées, preuves vérifiées, fin **« Poste prêt »**, exit 0. Contre-épreuve
d'idempotence : la phase 0 de la même session sur poste équipé (`git pull --ff-only` +
`bootstrap --pull`) a fini « Poste prêt » sans erreur. Les deux critères décisifs du contrat
sont PASS ; la parité GitHub suivra le push (décision humaine).

## 12/08/2026 (suite) — mandat global : push, lot D appliqué, 16 items TODO exécutés

**Mandat humain** : « Pousse sur github, go par forge lot D, puis exécute les éléments de la
TODO. » Pilot poussé (`45f883a`) ; lot D appliqué et poussé sur les dix forges (GO par forge) ;
15 items construits en 10 campagnes parallèles + TF-0113 par le pilot ; TF-0073 resté
`en_cours` (la mission source est absente du poste — entrant humain requis) ; TF-0111/0112
restés `candidat` (périmètre de nouvelles forges à trancher).

**Routage instrumenté (§4 bis)** — 10 tranches, TOUTES Sonnet (a priori issu de la campagne
mesurée du 09/08), items de construction complexe compris :

| Tranche | Items | Tokens | Outils | Durée | Verdict |
|---|---|---|---|---|---|
| data | 1 (3 sous) | 105 k | 57 | 8 min | vert |
| ops | 1 (3 sous) | 141 k | 54 | 14 min | vert |
| seo | 2 | 174 k | 96 | 16 min | vert (TF-0073 non clos, motivé) |
| conception | 1 (3 sous) | 203 k | 95 | 21 min | vert |
| agents | 1 (3 sous) | 213 k | 98 | 21 min | vert |
| development | 1 (3 sous) | 195 k | 118 | 23 min | vert |
| organization | 1 (3 sous) | 212 k | 140 | 24 min | vert |
| audit | 1 (4 sous) | 249 k | 171 | 28 min | vert |
| tests | 5 | 322 k | 144 | 33 min | vert |
| design | 1 (3 sous) | 264 k | 133 | 34 min | vert |

`escalade_modele` : **aucune** sur 10 tranches — Sonnet 5 tient la construction complexe
(gates, oracles, formats) au premier coup ; le tableau §4 est confirmé dans sa version
challengée. Chaque rapport vérifié par **sondage pilot** (self-tests et suites rejoués, commits
et arbres inspectés) avant clôture — verdicts consignés aux événements `corrige`.

**Incidents du jour** : (1) le lot D avait introduit le nom d'un tenant réel dans le README
public d'audit (gate N0 rouge) — détecté par la campagne audit, corrigé à la source
(catalogue anonymisé, vues régénérées, commit `5c95d6b` chez audit, N0 revenu à 0 finding) ;
(2) une session tierce travaille forge-tests en parallèle — ses fichiers préservés, un bug
G-1 dans sa version en cours consigné en candidature ; (3) 7 constats de campagne ingérés en
candidatures (lot `b3e32cb3b6bf`) : CRLF conception, généralisation fraîcheur (3 dérives de
plus), G-1 mutation tiers, dashboard NULL, gates jq fail-open, .queue non versionné,
mutation 61,1 % à durcir.

**Bilan registre** : 15 `corrige` (TF-0097→0110, 0113), 1 `en_cours` (TF-0073), 9 `candidat`
(dont TF-0111/0112 et les 7 nouveaux) ; oracle R1-R10 PASS, vue et page régénérées (sceau
06a3a32f3c10). Push des campagnes forges : décidé par le mandat de ce jour, effectué après
vérification par sondage.

**TF-0073 clos (12/08, fin de journée)** : `livrables-gen.py` remis par l'humain en `input\`,
généralisé en `scripts\scorer_actions.py` chez forge-seo (`bc7341d`) — score recalculé,
vocabulaires contrôlés, UTF-8 sans BOM, 17/17 + bout-en-bout 8/8, zéro trace client (grep
pilot, dépôt public). Catalogue v1.2.0 (59 services, +cat-seo-07). 1 candidature nouvelle
(scoring.md « quick win » vs schéma « quick-win », lot 7c041a2cefa5). Tranche Sonnet, 173 k
tokens, 62 outils, 11 min, verte — escalade : aucune.

## 12/08/2026 (soir) — mandat « Implémente les 10 candidats » : 11 items clos, l'écosystème passe à douze forges

**Mandat humain** : « Implémente les 10 candidats », complété en session par trois décisions
de structure (forge dédiée `digit-ai-forge-agents-security`, forge unique
`digit-ai-forge-observability`, dépôts GitHub publics immédiats). TF-0122 — régression du
correctif TF-0100 constatée en cours de journée — a été inclus au mandat sur décision pilot
tracée (réparer sa propre régression relève du mandat qui l'a produite). 11 items clos.

**Deux forges nées et publiées** : agents-security (scan statique CAP-1..4 + dynamique
TC-1..5 fail-closed, 24 PASS) et observability (plans déclaratifs, snapshots append-only,
dérive — 30 PASS). Intégration écosystème complète en un commit (`bafc30a`) : bootstrap,
fiches, INVENTAIRE, CONTRAT §5, noyau (recompressé, 6 138 o), README, **schéma V12
« Treize forges »** (édition chirurgicale sur copie, rendu render_page PASS + inspection
visuelle — deux chevauchements introduits par le décalage détectés par l'oracle et corrigés),
catalogue v1.3.0 (64 services). oracle-ecosysteme PASS 12/12.

**Routage instrumenté (§4 bis)** — 8 tranches, zéro escalade :

| Tranche | Modèle | Tokens | Outils | Durée | Verdict |
|---|---|---|---|---|---|
| seo TF-0121 | **Haiku** | 85 k | 35 | 2,6 min | vert (1re tranche Haiku — l'a priori « mécanique » tient) |
| conception TF-0114 | Sonnet | 102 k | 50 | 7,5 min | vert |
| agents-security TF-0111 (construction) | Sonnet | 134 k | 59 | 9,8 min | vert |
| observability TF-0112 (construction) | Sonnet | 137 k | 46 | 9,8 min | vert |
| agents TF-0118/0119 | Sonnet | 136 k | 71 | 14,6 min | vert |
| development TF-0120 | Sonnet | 272 k | 100 | 26 min | vert |
| tests TF-0122/0117/0116 | Sonnet | 288 k | 116 | ~78 min (3 reprises — l'agent s'endormait sur sa recette d'arrière-plan, relancé 2×) | vert |
| pilot TF-0115 + intégration + schéma | Fable (session) | — | — | — | vert |

**Faits saillants** : TF-0120 mesuré et non estimé (61,1 % → 94,25 % de mutation, Docker ×2,
job CI bloquant) ; TF-0115 a détecté le jour même deux dérives documentaires nées des
campagnes du matin ; TF-0122 avait coûté ~50 min sur Produit-01 (audit entier perdu) — fermé
avec reproduction du cas réel ; la session tierce sur forge-tests a été intégralement
préservée (diff identique début/fin de campagne), le try/finally de mutation.py reste
suspendu à son commit (reste explicite de TF-0116).

**Bilan registre** : 27 corrigés au total ce 12/08, 0 en cours, 0 candidat — la TODO est
vide. Oracle R1-R10 PASS. Pushes : pilot + les 12 forges (dont les 2 créations GitHub).

## 12/08/2026 (nuit) — étude d'opportunité : 4 forges candidates → 1 forge, 3 profils, 1 règle

**Mandat humain** : analyse d'opportunité (cybersecurity, website, webapp, mobile) — analyse
seulement, prompt barré/L99 au préalable. Livrable :
`output\20260812-etude-opportunite-forges.md` (grille : partition → non-recouvrement cité
contre le catalogue v1.3.0 → état de l'art sourcé → options tranchées → coût).

**Verdicts** : cybersecurity → **forge dédiée recommandée** (modèle seo ; trou prouvé sur
5 surfaces citées ; ASVS 5.0 comme contrat ; échéance externe CRA 11/09/2026) ·
website/webapp/mobile → **un seul axe « type de produit »**, servi par des
**profils-référentiels du pilot** (loi n° 4 + précédent BEST-PRACTICES-HTML ; la part
machine est déjà outillée gratuitement — axe-core, CrUX, Lighthouse, validations stores) ;
clause de réveil mobile natif au premier brief réel · **R-28 proposée** (critère d'admission
d'une forge : verbes outillés + née exercée + cadence propre + surfaces le jour même ; un
corpus sans verbe = référentiel) — sa fixture de validation : appliquée aux 4 candidats,
elle redonne les verdicts rendus.

**Instrumentation (§4 bis)** : 2 tranches recherche Sonnet (55 k/12 outils/1,6 min ;
57 k/16 outils/1,6 min), 20 sources datées au total, escalade : aucune ; synthèse et
non-recouvrement : pilot (citations vérifiées sur pièces). Zéro construction : git status
des 12 forges inchangé, aucun dépôt créé. 3 candidatures ingérées (lot `0f1d020d1f60`) —
la décision reste humaine : nom de la forge cyber (« websec » proposé), GO des profils,
encodage R-28.

## 12/08/2026 (nuit, suite) — mandat « fais 1, 2 & 3 » : websec née, profils produit livrés, R-28 encodée

**Mandat humain** : exécution des 3 candidatures de l'étude + étude des autres profils.
TF-0123 : **forge-websec** née exercée (23 PASS, sens rouge sur CVE réelles) et publiée —
l'écosystème passe à **treize forges** (schéma V13 « Quatorze forges », oracle-ecosysteme
13/13, catalogue v1.4.0 à 67 services). TF-0124 : profils\{website,webapp,mobile} +
doctrine, routés par ACCUEIL. TF-0125 : R-28 encodée (section H) — sa fixture : les 4
candidatures du jour redonnent leurs verdicts. **Étude « autres profils »** versée au
rapport §5 : aucun de plus maintenant, 5 « au premier brief » (api-headless, e-commerce,
extension-navigateur, desktop, chatbot — vigilance verbe nouveau), dashboard couvert,
iot/jeu/cli hors périmètre ; critère générique versé au LISEZMOI des profils.

**Routage (§4 bis)** : websec construction Sonnet 200 k/83 outils/19 min · profils Sonnet
88 k/37/4,5 min · étude autres profils Sonnet 44 k/5/1,9 min · R-28 + intégration + schéma :
pilot. Escalade : aucune. Sondages : self-tests rejoués, périmètres d'écriture inspectés
(l'agent profils a similairement signalé et préservé les fichiers de session vivante).

**TF-0126 clos (12/08, nuit)** : profils produit vague 2 (api-headless, e-commerce,
extension-navigateur, desktop) sur mandat humain anticipant le « premier brief » — commit
`46b0df0`, sources rafraîchies en recherche (OpenAPI 3.2.0, MV2/Chrome 138, Authenticode
15 mois), section « Trou d'outillage » de desktop (delta forge-ops documenté, jamais
improvisé). 7 profils actifs, chatbot seul en attente (vigilance R-28). Tranche Sonnet
94 k / 47 outils / 5 min, escalade : aucune. Incident de process consigné : deux événements
registre à id null écrits par le pilot (script sans garde) puis retirés avant commit —
l'oracle R1-R10 les avait signalés ; garde ajoutée au geste (assert sur l'id).

**TF-0127 clos (12/08, nuit)** : profil chatbot livré (`4d2ec60`, 9 sources datées, section
Frontière R-28) — **8 profils actifs, liste d'attente vide**. L'agent a refusé de citer des
stats non primaires (halucination « 71-89 % ») : le doute marqué plutôt que le chiffre
affirmé. Au passage : les 2 sidecars dormants d'`input\` (r21-lockfiles du 11/08,
socle-docs-projet) enfin ingérés (lots `d00b0a9043fe`, `731c8f3e7856` — 3 candidatures,
décision humaine). Tranche Sonnet 83 k / 35 outils / 4,5 min, escalade : aucune.

**TF-0128/0129/0130 traités (12/08, nuit)** : R-21 réécrite (`b507ff6` — monorepos vus,
sources_de_verite lues, versions sans source = FAIL ; self-test 5→6 PASS, fixture rouge
reproduisant Produit-11). TF-0129 et TF-0130 **écartés en doublons** : les sidecars du 11/08
décrivaient des défauts corrigés le jour même (TF-0086/0087/0091) — l'agent l'a prouvé par
lecture directe au lieu de re-livrer, et l'ingestion du 12/08 n'avait pas détecté le
recouvrement. Leçon consignée : **vérifier le recouvrement avec l'archive avant d'ingérer
un sidecar dormant** (candidature possible : contrôle de similarité à l'ingestion).
Tranche Sonnet 136 k / 46 outils / 8 min, escalade : aucune.

**TF-0131 clos (12/08, nuit)** : R-29 « l'IA fait, l'humain décide » (loi transverse n° 5 au
noyau — 6 100 octets après compression — + §I de REGLES-PROJET + ACCUEIL §5 + gabarits) et
R-30 « thème clair + bascule sombre câblée » (§J + pattern S-G1 au BEST-PRACTICES, fixtures
témoins prouvées : verte PASS — un défaut L2 réel corrigé pendant la fabrication —, rouge
FAIL contraste 1,51:1, sombre forcé PASS AA, print clair vérifié Playwright). Grep
anti-subjectivité : 0/5. Deux candidatures aval (lot des sidecars : règle d'oracle
forge-design ; versement boilerplate + règle check_html — le toggle mort est prouvé
invisible au check_html actuel). Tranche Sonnet 170 k / 76 outils / 15 min + noyau par le
pilot ; escalade : aucune.

**TF-0133/0134 clos (12/08, nuit — aval R-30 complet)** : oracle-bascule natif chez
forge-design (`9e46ee9`, 48→52 règles, 4 rouges à écart unique — zèle conforme au gabarit)
et S-G1 versé au skill digit-ai-page-html (`6e8c891` chez forge-agents, source vivante +
copie installée synchronisées, check_html 30→33 avec règle G1 « bascule morte »). La chaîne
R-30 est fermée de bout en bout : règle → pattern → boilerplate natif → deux oracles
(design + socle) → fixtures prouvées. Tranches Sonnet 153 k/48/11,6 min et 135 k/63/8,8 min,
escalade : aucune. Rappel des sondages pilot : 52 règles et 33/33 rejoués, toggle mort FAIL,
diff source↔installé vide.

**Refonte TODO.html (12/08, mandat humain)** : `generer-page.mjs` réécrit — largeur portée à
75-100 % (`min(94vw,1680px)`), items en **cartes détaillées à puces** (constat + proposition
découpée), ajout de la **date de création**, d'une **priorité de traitement** (dérivée du
score : Haute ≥5 / Moyenne 3-4 / Basse <3) et de l'**impact sur la forge** (coût constaté) ;
colonnes « décider » (cases) et « commentaire » **supprimées** — la vue devient lecture seule,
la décision se prend en session. Premier livrable HTML conforme R-30 de bout en bout : bascule
sombre S-G1 câblée (oracle-bascule forge-design PASS), et double vérification au rendu —
check_html PASS, render_page PASS en clair ET en sombre forcé (AA tenu dans les deux thèmes,
2 défauts de contraste `--faint`/accents-sur-fill trouvés et corrigés pendant la fabrication).
Le flux d'export (appliquer-export.mjs) devient orphelin — laissé en place, non supprimé.

**TF-0132/0135 clos (12/08) — les deux derniers candidats** : forge-tests corrigée sur deux
faux verdicts de la famille des correctifs du matin. TF-0135 (`5977168`) : l'analyse des
gardes lit tous les modules du paquet (plus le seul main.py), un handler non résolu dégrade
en non_juge au lieu d'un bloquant faux — fixture Produit-01 : 2 bloquants faux → 0. TF-0132
(`4e108b2`) : `--trace on` n'est plus forcé (var FORGE_TESTS_PLAYWRIGHT_TRACE + config projet
respectée), « trace indisponible » distingué de « suite e2e rouge ». Sondage pilot : pytest
123 vert, recette divergences 18 cas, banc-vert identique à adba38c (mutant d'un timeout shell
restauré par l'agent avant tout commit — transparence). Tranche Sonnet 214 k / 89 outils /
24 min, escalade : aucune. **Défaut préexistant surfacé** en candidature (lot 6973bf33629b) :
recette section corpus rouge sur D-01 (suite e2e banc-rouge, getByTestId non visible) —
reproduit avant/après par git stash, donc antérieur ; à instruire (fixture ou env du poste).
Registre : 38+... items du jour archivés, actifs = 1 (ce nouveau candidat D-01).

**TF-0136 clos (12/08) — D-01 : ce n'était pas un bug de la forge**. Cause racine prouvée :
le port 4173 (défaut vite preview) était tenu par un `vite preview` d'Produit-01 (PID 60184),
et `reuseExistingServer:true` faisait tester SILENCIEUSEMENT la mauvaise appli — d'où le
testid `lien-connexion` introuvable. Corrigé (`91b80fc`) : reuseExistingServer→false sur les
deux bancs (échec fort + fin de la contamination croisée rouge↔vert), motif `_PORT_OCCUPE`
prioritaire dans execution.py (« port occupé par un AUTRE processus » — jamais confondu avec
« trace indisponible » TF-0132 ni « suite rouge »), 3 tests. pytest 123→126. Le vert de
surface de la recette reste conditionné à la libération du port par l'humain (process d'un
autre produit — garde-fou : non tué). Candidature déposée (lot 7768d224fe52) : migrer les
bancs vers un port moins commun. Tranche Sonnet 135 k / 86 outils / 19 min, escalade : aucune.

**TF-0137 clos (12/08) — ports dédiés + une révélation**. Bancs migrés hors du 4173 par
défaut (rouge 41733, vert 41743, `91a12be`) : classe de collision éliminée, contamination
rouge↔vert supprimée, et **D-01 résolu sur le fond** — la recette corpus voit enfin le banc
rouge servir sa propre appli (16/16 défauts, plus le blocage getByTestId d'Produit-01). MAIS
la correction a **révélé** ce que la collision masquait : `recette --section corpus` reste
ECHEC car le banc-VERT (témoin propre) sort 26 bloquants (attendu 0) — condition réelle,
sans mutant résiduel sur disque (vérifié), versée en candidature séparée (lot dcfdd2ff23a3,
à ventiler par pan et diagnostiquer). Je n'ai pas maquillé : mandat de migration rempli,
recette toujours rouge pour une cause nouvelle et nommée. Fait par le pilot en direct (change
chirurgical à 2 lignes × 4 fichiers, sous mandat explicite), vérif pytest 126 + recette réelle.
