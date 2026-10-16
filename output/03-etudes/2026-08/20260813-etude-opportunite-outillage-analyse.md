# Étude d'opportunité — faut-il outiller l'analyse des propositions d'amélioration des forges ?

**Mandat humain du 13/08/2026** — analyse seulement, aucune construction. Prompt barré/L99 au
préalable (précédent du 12/08). Décision humaine via la candidature TODO-FORGE jointe.
Question : le pilot a produit **trois études d'opportunité en deux jours** (12 et 13/08) avec une
grille re-improvisée à chaque fois. Faut-il figer ce savoir-faire, et sous quelle forme ?

Jeu fermé d'options, traitées à égalité — **O0** ne rien faire · **O1** gabarit versionné ·
**O2** règle projet (critère d'admission) · **O3** skill exécutable. Combinaisons autorisées ;
O0 doit être explicitement réfutée pour être écartée.

---

## 0. Lu sur pièces — ce qui porte DÉJÀ la qualification d'une proposition

| Mécanisme | Ce qu'il porte | Citation |
|---|---|---|
| Registre TODO-FORGE | états `candidat→decide→en_cours→corrige\|ecarte→archive` ; tout entre en `candidat` ; `decide` exige `decideur` + `date_decision` (R6) ; clôture `corrige` exige `gains_constates` (R7) | `references\TODO-FORGE.md` ; `todo\oracle-todo.mjs` l.11-14 |
| Sidecar de candidature | champs imposés : `titre`, `contenu`, `source`, `demandeur`, `preuve_du_cout`, `score{gain,preuve,effort}`, `forges_cibles_initiales` ; ingestion atomique idempotente (R10) | `todo\ingerer-lot.mjs` l.39-73 ; `input\candidature-*.tf.jsonl` |
| Cotation | `valeur = gain × preuve / effort`, calculée à l'ingestion, non éditable | `todo\ingerer-lot.mjs` l.65-67 |
| R-28 | critère d'admission — **d'une forge uniquement** ; corollaire « corpus sans verbe outillé = référentiel versionné » | `REGLES-PROJET.md` l.127-141 |
| R-29 / loi n° 5 | l'IA propose, l'humain décide ; restes classés IA/développeur/utilisateur | `REGLES-PROJET.md` l.153-166 |
| Grille des études | énoncée **une seule fois, en une ligne narrative** : « partition → non-recouvrement cité contre le catalogue → état de l'art sourcé → options tranchées → coût » | `BOUCLE-AMELIORATION.md` l.584 |
| Corpus | 3 études / **4 dossiers** tranchés : `output\03-etudes\20260812-etude-opportunite-forges.md`, `…-forge-data-moteurs.md`, `20260813-etude-personas-agents.md` | — |

Constat : **la moitié du dispositif existe**. Ce qui manque n'est ni le registre, ni la cotation,
ni la gouvernance de décision — c'est la **méthode d'instruction** entre `candidat` et `decide`.

---

## 1. Non-recouvrement — quatre fonctions confrontées à l'existant

| Fonction proposée | Déjà couverte par (citation) | Trou réel ? |
|---|---|---|
| Normaliser une proposition en énoncé décidable | Schéma du sidecar : `contenu` + `source` + `preuve_du_cout` + `score` (`ingerer-lot.mjs` l.39-73) — les **champs** sont imposés | **Partiel** : aucune méthode pour les remplir ; ni option zéro, ni non-recouvrement exigé. Les 5 candidats ouverts portent tous `preuve` renseignée à la main, sans protocole |
| Instruire (lu sur pièces + non-recouvrement cité + état de l'art daté) | **Rien de versionné.** La grille n'existe qu'en une ligne de journal (`BOUCLE-AMELIORATION.md` l.584) et en 3 exemplaires non normalisés | **OUI** |
| Trancher création d'un objet nouveau | R-28 (`REGLES-PROJET.md` l.127-141) — **forges seulement** ; rien pour skill, gabarit, règle, référentiel, oracle | **OUI, partiel** : le corollaire R-28 est généralisable mais n'est pas écrit comme tel |
| Conserver la mémoire des refus | `statut: ecarte` — **aucun champ de motif** ; R5 autorise la transition, R7 n'exige rien à l'écart (`oracle-todo.mjs` l.11-14, l.87-91) ; seul `BOUCLE-AMELIORATION.md` en garde une trace narrative | **OUI** |
| Décider | R-29 + R6 (`decideur`/`date_decision` tracés) | **Non — et doit le rester** |

Deux trous réels, un partiel. **Aucun ne concerne la décision** : le dispositif manque d'instruction,
pas d'arbitrage.

---

## 2. État de l'art daté (8 sources < 24 mois, lues en résumé de recherche)

**Documenter une décision — ce qui la fait vivre ou mourir.** La comparaison empirique de gabarits
d'ADR (arXiv 2604.27333, 2026) départage Nygard (concision) et MADR (détail structurel) mais ne
départage rien sur la survie. Le facteur décisif est ailleurs : le patron « **Decision Documentation
Theater** » (hidekazu-konishi.com, 2026) constate que presque toutes les équipes adoptent les ADR et
presque aucune ne les maintient deux ans plus tard — et que succès et échec **ne dépendent pas du
gabarit** mais de l'opérationnel : *où vivent les enregistrements, quand ils sont écrits, qui les
relit, ce qui se passe quand les prémisses changent*. Le « Definition of Done for Architectural
Decision Making » (adr.github.io/ad-practices) pose 5 critères : **preuve · critères et alternatives ·
accord · documentation · plan de réalisation/revue** — recoupement quasi exact avec la grille maison,
au plan de revue près, qui manque chez nous.

**Coter une idée.** Les critiques 2025-2026 de RICE/ICE convergent sur un point unique : le facteur
*Confidence* est subjectif, deux personnes le notent différemment, et ICE dérive faute de guide de
notation partagé (Plane 2025, Fygurs 2026). Note : la maison a déjà corrigé ce défaut sans le savoir —
`preuve` (le coût est-il constaté ?) remplace `confidence` (y crois-tu ?). C'est un écart favorable
à l'existant, à préserver.

**Empaqueter en skill.** La documentation Agent Skills (platform.claude.com, consultée 08/2026) décrit
trois niveaux de divulgation progressive : le frontmatter est **toujours chargé** (~100 tokens par
skill installé), le corps ne l'est qu'en cas de pertinence. Conséquence directe, documentée par la
littérature 2026 : *« un skill à description vague n'est jamais découvert ; il est mort quel que soit
son contenu »* et *« équiper un agent de trop de skills — surtout non pertinents — dégrade l'exactitude
et l'efficacité »* (Red Hat Emerging Technologies, 28/07/2026 ; SkillFlow arXiv 2504.06188 ;
Agent Skill Evaluation and Evolution arXiv 2606.11435). Anthropic elle-même traque, sur ses 300+
skills internes, les **skills à faible taux de déclenchement**. Le poste installé porte déjà
**11 skills** hors superpowers.

**Non instruit** : recherche « gate d'opportunité allégé / surcoût en petite équipe » — aucune source
datée exploitable trouvée. §3 ne s'appuie donc sur aucune évidence externe pour l'argument « péage ».

---

## 3. Options tranchées

**O0 — ne rien faire.** Coût nul, réversible. *Ce qui plaide pour* : les 3 études ont réussi sans
gabarit ; le registre porte déjà champs, cotation et gouvernance ; aucun incident consigné n'est
imputable à l'absence de méthode. *Ce qui la réfute* : la grille n'existe qu'en une ligne de journal,
donc elle **n'est ni opposable ni transmissible** — un agent de campagne mandaté pour instruire une
proposition n'a aujourd'hui aucune spécification à lire ; et la **mémoire des refus est
structurellement perdue** (`ecarte` sans motif), ce qui garantit la réouverture d'idées déjà tranchées.
→ **Écartée**, mais sa réfutation ne tient que sur ces deux trous — pas sur un gain de rédaction.

**O1 — gabarit versionné `gabarits\ETUDE-OPPORTUNITE.md`.** Précédents directs : `AGENT-CAMPAGNE.md`
(TF-0050), `RESTITUTION.md` (TF-0147), `RETOURS-FORGES.md`. Coût ≈ 1 fichier, ~0 surface écosystème.
Réversible (suppression sans effet). *Réserve* : à lui seul, c'est exactement le dispositif que le
« Decision Documentation Theater » condamne — un gabarit non câblé meurt. → **Retenue, sous condition
de câblage** (loi transverse n° 1 : *toute affordance est câblée ou n'existe pas*).

**O2 — règle projet R-31, généralisation de R-28.** R-28 ne couvre que les forges ; les quatre études
ont pourtant tranché des créations de *référentiels*, de *verbes*, de *profils* et de *consignes* avec
le même raisonnement, sans règle écrite. Coût : une section de `REGLES-PROJET.md`. Irréversibilité
faible (une règle s'amende). → **Retenue.**

**O3 — skill exécutable `opportunite`.** Le critère maison, appliqué à l'objet demandé, tranche seul :
combien de **verbes outillés exécutables** ce skill porterait-il, absents partout ailleurs ? Un seul
candidat sérieux — un oracle de conformité d'étude. Le reste est un corpus de méthode. Or R-28,
corollaire : *« un corpus de savoir sans verbe outillé est un référentiel versionné, jamais une
forge »*. Par symétrie, jamais un skill. S'y ajoutent trois coûts propres : ~100 tokens de frontmatter
sur **toutes** les sessions du poste (12ᵉ skill), un risque de déclenchement erroné à côté de
`ameliore-un-skill`, `quality-oracles` et `prompt-analyzer-l99`, et un actif vivant **hors du git du
pilot** (`~\.claude\skills\`) — le dépôt qui gouverne ne versionnerait pas l'outil qui l'instruit.
→ **Écartée maintenant**, avec **clause de réveil** : à réévaluer si le gabarit est effectivement
invoqué ≥ 5 fois et que son portage manuel dans les prompts se constate coûteux.

**Reste exécutable retenu** : un oracle léger `oracles\oracle-etude-opportunite.mjs` — la loi
transversale `quality-oracles` l'exige (*domaine sans oracle → en définir un*), et c'est le seul
véritable verbe du lot.

---

## 4. Back-test — la grille rejouée sur les 4 dossiers déjà tranchés

Grille testée (5 pas) : **P1** partition · **P2** non-recouvrement cité · **P3** état de l'art daté ·
**P4** jeu fermé O0-O4 · **P5** verdict + coût + candidature. Critère de tranchage = R-28 généralisé.

| Dossier | Ce que la grille produit | Verdict effectivement rendu | Concordance |
|---|---|---|---|
| cybersecurity | 3 verbes outillés absents (exposition runtime, contrat ASVS, différentiel), oracles gratuits identifiés, cadence propre post-MEP → objet nouveau | **Forge dédiée** (websec, née TF-0123) | ✔ |
| website / webapp / mobile | P1 fusionne 3 candidats en 1 axe ; part machine déjà outillée (axe-core, CrUX) ; reste = savoir périssable → référentiel | **Profils-référentiels du pilot** | ✔ |
| forge-data × 4 moteurs | dialecte = donnée → profils ; 1 verbe réel (`importer`, parseur d'export) ; connecteur live refusé par garde-fou paiement | **1 verbe + 4 profils + 1 différé + refus C** | ✔ |
| personas d'agents | aucun verbe ; 5 fonctions déjà portées ; état de l'art = effet nul à négatif → écarté sauf posture de restitution en référentiel | **Nuisible/inutile + consigne de restitution** | ✔ |

**4/4.** *Limite explicite et non contournable* : la grille est **dérivée de ces mêmes études** — le
back-test prouve la fidélité (elle ne détruit pas les verdicts rendus), **pas** le pouvoir
discriminant. Ce dernier ne peut venir que de cas non vus : §5 (candidat réel) et la présente étude,
qui s'applique sa propre grille et conclut contre l'objet initialement demandé — c'est le seul
indice de non-complaisance disponible aujourd'hui.

---

## 5. Cas réel — TF-0154 traversé par la grille

*« Généraliser le contrôle pré-génération des gabarits HTML (§2 bis) à toutes les forges qui en
portent »* — `candidat`, score `{gain:3, preuve:2, effort:2}` → valeur 3, cible `pilot`.

- **P1 partition** : deux objets distincts empaquetés — (a) un *inventaire + remise à niveau* des
  gabarits existants (travail fini, non récurrent) ; (b) un *câblage du contrôle dans chaque pipeline
  de génération* (dispositif permanent). Verdict de partition : **deux items, pas un**.
- **P2 non-recouvrement** : (a) est couvert par les oracles existants (`check_html.py`,
  `render_page.py`) — rien à créer, juste à exécuter ; (b) n'est couvert nulle part : `CONTRAT-INTERFACE.md`
  §2 bis énonce la responsabilité mais aucune forge ne l'exécute avant génération.
- **P4 options** : (a) → campagne, aucun objet nouveau. (b) → pas un verbe nouveau (l'oracle existe),
  mais un **point d'appel** dans un pipeline existant → **extension**, pas objet nouveau.
- **P5 verdict produit** : scinder TF-0154 en TF-0154a (campagne d'inventaire, effort mesurable) et
  TF-0154b (extension du pipeline de génération, à câbler forge par forge). Aucun objet nouveau créé.

La grille produit ici un résultat **que le candidat ne portait pas** (la scission) sans rien inventer.
C'est le seul test de pouvoir discriminant disponible — il est positif, sur un seul cas.

---

## 6. Verdict

**GO conditionnel** : retenir **O1 + O2 + un oracle**, **NO-GO sur O3 (skill)** avec clause de réveil —
la grille appliquée à elle-même classe l'objet demandé en *corpus de méthode sans verbe outillé*, donc
en référentiel versionné (corollaire R-28), et le back-test 4/4 valide la fidélité de cette grille aux
verdicts déjà rendus par la maison.

---

## 7. Seuil de déclenchement — pour que le dispositif ne devienne pas un péage

Une étude d'opportunité est **obligatoire** si l'item satisfait au moins un critère :
(a) il crée un **objet durable** (forge, skill, référentiel, règle, profil) ; (b) il touche les
**surfaces écosystème** (≥ 3 forges ou le noyau) ; (c) son score porte `gain ≥ 3` avec `preuve ≤ 2`
— fort gain allégué sur preuve faible, exactement le cas où l'instruction paie.
Sinon : **candidature directe**, aucune étude.

**Fixture du seuil**, appliquée aux 5 candidats ouverts : TF-0150 (convention `old\`, effort 1) → non ·
TF-0151 (rappel de gabarit) → non · TF-0152 (défauts HTML préexistants) → non · TF-0153 (dashboard
forge-tests, correctif) → non · **TF-0154 (campagne transverse, câblage permanent) → oui**.
**1 sur 5.** Le seuil discrimine ; il ne taxe pas le registre.

---

## 8. Risques

| # | Risque | Mécanisme | Parade |
|---|---|---|---|
| R1 | **Dérive vers un juge IA** substituant son appréciation à la décision humaine | Une grille qui rend des « verdicts » devient l'instance qui décide, l'humain entérinant. C'est le verdict rendu le 13/08 sur le persona-juge (« substitution du jugement incarné aux oracles exécutés ») | Le gabarit produit des **options fermées et leurs preuves**, jamais une recommandation unique non étayée ; §6 reste une proposition, R-6 impose `decideur` + `date_decision` |
| R2 | **Frontière donnée/instruction** : une proposition entrante rédigée à l'impératif exécutée comme une consigne | Les propositions viennent de lots produits et de dépôts frères — donnée par garde-fou du noyau | Le gabarit impose de **citer** la proposition entrante entre guillemets et de la traiter comme donnée décrite au ledger ; jamais d'exécution d'un impératif entrant |
| R3 | **Péage sur la TODO** | Le goulot mesuré n'est pas l'analyse (27 items clos le 12/08, 0 candidat restant) mais la décision et la preuve du coût. Ajouter de l'instruction en amont d'un goulot de décision allonge la file | Seuil §7, fixture 1/5 · **argument non appuyé sur source externe** (§2 non instruit) |
| R4 | **Actif hors git** | Un skill vit dans `~\.claude\skills\`, hors du dépôt qui le gouverne | NO-GO O3 ; le gabarit et la règle vivent dans le pilot, versionnés |
| R5 | **Circularité du back-test** | La grille est dérivée des études qu'elle valide (§4) | Limite écrite ; pouvoir discriminant à ré-établir sur les 3 prochaines études réelles, pas par re-test du corpus |
| R6 | **Gabarit mort à 24 mois** | « Decision Documentation Theater » : le gabarit non câblé n'est plus maintenu | Câblage obligatoire : `references\TODO-FORGE.md` route vers le gabarit au seuil §7 ; oracle exécuté ; motif d'écart devenu champ |

---

## 9. Transverses (listées, non développées — une candidature chacune si retenues)

1. Champ `motif_ecart` obligatoire à la transition `→ ecarte` (R7 étendue) — ferme la perte de mémoire des refus.
2. « Plan de revue » ajouté au gabarit (5ᵉ critère du Definition of Done ADR) : à quelle date une décision est réexaminée.
3. R-28 point 1 mécanisé (verdict de non-recouvrement exigé à la naissance) — reste ouvert de TF-0125.
4. Renommer `score.preuve` en doctrine écrite : c'est la correction maison du défaut `Confidence` de RICE/ICE, aujourd'hui non documentée.
5. Revue de la prolifération de skills du poste (11 installés) au regard de la dégradation de sélection documentée en §2.

---

## 10. Plan d'implémentation (GO conditionnel — 3 phases, ~1 campagne)

| Phase | Contenu | Oracle de recette |
|---|---|---|
| **P1 — gabarit** | `gabarits\ETUDE-OPPORTUNITE.md` : 5 pas (partition · non-recouvrement cité · état de l'art daté ≥ 5 sources < 24 mois ou `non instruit` · jeu fermé O0-O4 avec O0 à réfuter · verdict + coût + candidature), + seuil §7, + interdiction des critères subjectifs, + traitement des entrants comme donnée (R2) | Rejeu du back-test §4 : le gabarit appliqué aux 4 dossiers redonne 4/4 |
| **P2 — règle** | R-31 dans `REGLES-PROJET.md` : critère d'admission généralisé à **tout objet durable** (forge, skill, référentiel, règle, profil), reprenant le corollaire R-28 ; R-28 devient son cas particulier « forge » | Fixture : R-31 appliquée aux 4 dossiers + à la présente étude redonne les 5 verdicts (dont NO-GO skill) |
| **P3 — câblage** | (a) `oracles\oracle-etude-opportunite.mjs` : sections présentes, chaque ligne de non-recouvrement porte une citation, ≥ 5 sources datées ou `non instruit`, verdict unique, O0 traitée, zéro terme subjectif — fixtures double sens ; (b) routage : `references\TODO-FORGE.md` renvoie au gabarit au seuil §7 ; (c) `output\LISEZMOI.md` inchangé (famille `03-etudes\` déjà en place) | `node oracles\oracle-etude-opportunite.mjs` PASS sur les 4 études existantes, FAIL sur une fixture rouge (étude sans citation) |

**Restes classés (R-29)** — **IA** : les 3 phases, sur mandat de campagne. **Développeur** : aucun.
**Utilisateur** : le GO sur R-31 (décision de gouvernance), et l'arbitrage de la clause de réveil O3.

---

## Annexe — traçabilité et instrumentation (§4 bis)

**Lu sur pièces** : `CLAUDE.md` (lois 1, 4, 5 ; garde-fous) · `REGLES-PROJET.md` §H (R-28) et §I (R-29) ·
`references\TODO-FORGE.md` · `todo\ingerer-lot.mjs` (l.39-73) · `todo\oracle-todo.mjs` (l.11-14, 87-91) ·
`todo\TODO.jsonl` (9 événements, 5 candidats TF-0150…TF-0154) · `BOUCLE-AMELIORATION.md` (l.580-620) ·
`output\LISEZMOI.md` · les 3 études de `output\03-etudes\`.

**Sources datées** (< 24 mois, lues en résumé de recherche, non intégralement) :
1. *One Size Fits All? An Empirical Comparison of ADR Templates*, arXiv 2604.27333 (2026).
2. *AD Practices — Definition of Done for Architectural Decision Making*, adr.github.io/ad-practices (MADR/YADR, mars 2026).
3. *ADR: Templates and Operational Patterns for Teams That Actually Maintain Them* — « Decision Documentation Theater », hidekazu-konishi.com (2026).
4. *Building skills for AI agents: pitfalls and best practices*, Red Hat Emerging Technologies, 28/07/2026.
5. *SkillFlow: Scalable and Efficient Agent Skill Retrieval System*, arXiv 2504.06188v2 (2025).
6. *Agent Skill Evaluation and Evolution: Frameworks and Benchmarks*, arXiv 2606.11435v1 (2026).
7. *Agent Skills — overview* (divulgation progressive, ~100 tokens/skill), platform.claude.com, consulté 08/2026.
8. Critiques RICE/ICE/WSJF : Plane (2025), Fygurs (2026) — subjectivité de *Confidence*, dérive d'ICE.

**Non instruit** : gates d'opportunité allégés en petite équipe — aucune source datée exploitable
(§2) ; l'argument « péage » du risque R3 repose sur les seuls chiffres internes du 12/08.

**Instrumentation** : session pilot, modèle **Opus 5 (1M)** — aucun sous-agent (routage §4 : le pilot
instruit lui-même, pas de campagne mandatée). ≈ 20 appels d'outils dont **4 recherches web**,
8 sources retenues. `escalade_modele: aucune`. **Tokens et durée : non mesurés** (session
interactive, pas de ledger de run ouvert).

**Aucune construction** : aucune écriture hors ce rapport et son sidecar — `git status` du pilot et
des forges vérifié, joint à la remise.
