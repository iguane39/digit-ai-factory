# Étude d'opportunité — fermeture de la voie « proposition de tests » (TF-0349) — 20260817j

<!-- Gabarit du pilot : gabarits\ETUDE-OPPORTUNITE.md (TF-0155). Jugée par
     oracles\oracle-etude-opportunite.mjs (E1-E7). Entrant : TF-0349, mandat humain du
     17/08/2026 (prompt réécrit L99, écarts validés poste par poste, « vas y »). La décision
     humaine est acquise SUR LE PRINCIPE ; cette étude cadre le COMMENT et le OÙ. Lecture
     seule sur tous les dépôts frères et sur les produits. -->

## Seuil de déclenchement (vérifié AVANT d'écrire)

TF-0349 franchit le seuil TF-0155 sur trois critères indépendants, chacun vérifiable :

1. **Crée un objet durable** — une règle transverse opposable *et son contrôle appelé*
   (R-31 al. 1 exige « ≥ 1 verbe outillé exécutable absent partout ailleurs, prouvé par un
   verdict … écrit et cité », `REGLES-PROJET.md` l.239-245).
2. **Touche ≥ 3 forges ou le noyau** — périmètre déclaré au registre :
   `["pilot", "digit-ai-forge-tests", "digit-ai-forge-ops"]` (`todo\TODO.jsonl`, TF-0349).
3. **Gain ≥ 3 avec preuve ≤ 2** — non : le score porte `gain 4, preuve 3`. Ce critère seul
   ne déclencherait pas ; les deux premiers suffisent.

L'item est explicite : « Crée une règle transverse touchant tests + ops + doctrine : étude
TF-0155 préalable ». Étude obligatoire avant `decide`.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.
Sources : **TF-0349** (`todo\TODO.jsonl` l.97, statut `candidat`, créé 2026-08-17T13:47:55Z) ;
mandat humain du 17/08 (prompt analysé L99, 5 postes) ; **TF-0340/0341** (cycle de vie de
l'instance servie, lot `Produit-11 - RETOURS - 20260817b`, ledger seq 130) ;
**TF-0342 · TF-0343 · TF-0344 · TF-0345** (campagne recette multi-profils Produit-01 du 17/08,
ledger Produit-01 seq 37-40) ; **TF-0347/0348** déjà encodés en R-39 le même jour ; le plan
`output\04-plans\20260813-plan-strategie-tests-e2e.md` (mandat humain du 13/08).

**Factcheck préalable exigé par l'analyse L99 — le référent existe et il est nommé.** La
demande ne nomme pas le livrable qu'elle ferme ; la recherche l'a trouvé. Il ne s'appelle
jamais littéralement « Proposition Tests » : le livrable canonique de l'écosystème s'appelle
**« Cahier de tests fonctionnels / techniques »**, produit par
`forge-tests --livrables <dossier-proposition>`, et il se déclare lui-même proposition
(`forge_tests\livrables\cahiers.py` l.20 : « Séparation juge et partie. Ces cahiers sont des
PROPOSITIONS déposées dans un dossier … »). Exemplaires réels, mesurés le 17/08 :

| Exemplaire (chemin réel) | Date | Ce qu'il porte |
|---|---|---|
| `C:\dev\_Client-A\BourseAuxVacants2\proposition-tests\livrables\Produit-11 - Cahier de tests fonctionnels - 20260817b.md` | 2026-08-17 | 160 éléments inventoriés · **971 cas dérivés · 0 cas adoptés** · 4 non couverts |
| `…\Produit-11 - Cahier de tests techniques - 20260817b.md` | 2026-08-17 | 102 inventoriés · **94 cas · 0 adoptés** · 8 non couverts |
| `C:\dev\_Client-A\Produit-01-livrables\Produit-01 - Cahier de tests fonctionnels - 20260812a.md` | 2026-08-12 | 120 inventoriés · **176 cas dérivés** |
| `C:\dev\_Client-A\COMPTA---Ventillation-de-facture-Fournisseur-A\forge\etapes\tests\livrables\COMPTA … Cahier de tests fonctionnels - 20260814b.md` | 2026-08-14 | 389 inventoriés · **680 cas · 0 adoptés** |
| `C:\dev\_Client-A\Cockpit IA\client-a-cockpit-ia\forge\etapes\tests\client-a-cockpit-ia - Cahier de tests fonctionnels - 20260814a.md` | 2026-08-14 | proposition, noyée parmi ~20 rapports d'exécution du même dossier |
| `C:\dev\digit-ai-forge-pilot\output\04-plans\20260813-plan-strategie-tests-e2e.md` | 2026-08-13 | « **Livrable = ce plan** (document), pas l'implémentation » — feuille de route = candidatures |
| `C:\dev\CoproPulse\docs\TEST_STRATEGY.md` | 2026-05-22 | en-tête « Statut Proposition » (produit hors écosystème forgé) |
| `C:\dev\digit-ai-forge-tests\docs\cartographie-familles-de-tests.md` | 2026-08-02 | familles de tests à couvrir, non couvertes |

**Contre-épreuve (le même titre peut cacher l'inverse)** :
`C:\dev\_Client-A\BourseAuxVacants2\Produit-11\forge\etapes\tests\STRATEGIE-E2E.md`
s'intitule « Stratégie de tests de bout en bout » et est un **rapport d'exécution réel**
(69 tests verts, 399 pytest, mutation 0,90 sur 45/50 mutants tués, 13 défauts trouvés,
3 gates passantes, `verifie_le: 2026-08-17`). La règle demandée n'a donc rien à inventer :
la forme cible **existe déjà sur pièces**, sur le produit même qui porte le pire solde.

**Ce que le factcheck établit aussi, et qui réduit le périmètre** : aucune famille `NN-tests`
n'existe dans aucun `output\` de `C:\dev` ni de `C:\dev\_Client-A` — mais le NOM `XX-tests` est
**déjà conventionné et déjà encodé le 17/08**, avant cette étude (voir §2, lignes 12 et 13).
Le volet RANGEMENT de TF-0349 est clos ; seul le volet DOCTRINE reste ouvert.

## 1. Partition du problème

Découpage exhaustif et disjoint. Chaque option de la §4 se rattache à une partition nommée.

- **P-a — Où vit le texte opposable.** Trois emplacements possibles et un seul légitime :
  `REGLES-PROJET.md` du pilot (règle numérotée, opposable à tous les runs), le playbook de
  forge-development (discipline de construction), le `README.md` de forge-tests (contrat de
  l'auditeur). La doctrine porte sur ce que le PILOT accepte de livrer : elle ne peut pas
  vivre chez un exécutant.
- **P-b — Qui l'appelle (R-35).** Une règle sans appelant nommé est une décoration. Candidats
  réels : le pas de l'étape 5 du run, le contrat « prêt client », un contrôle exécutable
  agrégé par `oracles\self-tests.mjs`.
- **P-c — Ce que « bout en bout » énumère, et ce qui le borne.** Chaîne : cas de tests → jeux
  de données → exécution réelle → rapport → corrections sous gates → e2e avec cycle de vie
  d'instance déclaré. Bornes non négociables, inchangées par construction.
- **P-d — Où atterrit le livrable.** Famille `XX-tests` d'`output\`, numéro local stable, et
  surtout : *quoi* y atterrit (un rapport d'exécution, pas un cahier de propositions).
- **P-e — La frontière du légitimement non exécutable.** Un cas qu'aucune exécution ne peut
  atteindre ici doit sortir motivé, jamais silencieux.
- **P-f — Ce qui ne change pas.** Boucle ≤ 5 cycles (extensible 7), G-2 absolue, G-1 (l'auditeur
  n'écrit pas chez l'audité), dépenses et GO humains (R-29). Toute option qui touche à ces
  quatre points est hors mandat.

## 2. Non-recouvrement contre l'existant

Chaque ligne porte une citation vérifiable. Les lignes 12 et 13 sont les plus importantes :
elles retirent du périmètre un volet entier de l'item.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Verbes de catalogue `cat-tst-02` / `cat-tst-03` | `digit-ai-forge-tests\README.md` l.27-28 « Générer des cas de tests **en proposition** … prêts à adopter » ; répliqué `catalogues\CATALOGUES.md` l.49-50 | Recouvre — c'est la SOURCE de la voie fermée ; à requalifier, pas à supprimer (le verbe reste utile, sa sortie cesse d'être un livrable) |
| « Loi du générateur » | `digit-ai-forge-tests\forge_tests\generateur.py` l.73 « Un cas généré est une PROPOSITION : il porte le comportement que la source DÉCLARE » | Recouvre le statut d'origine ; ne dit rien de son sort — c'est exactement le trou |
| Statut littéral par défaut | `digit-ai-forge-tests\forge_tests\adoption.py` l.96 `return {"statut": "proposition", "test": "", "motif": ""}` | Recouvre — l'état `proposition` est le DÉFAUT du code ; la règle en fait un état transitoire obligatoirement soldé |
| Contrat d'adoption (RT-13) | `adoption.py` l.4-7 « après avoir écrit 11 tests couvrant exactement les axes proposés, le cahier suivant régénérait les mêmes cent cas en « non joué » » ; contrat `<projet>\forge\cas-adoptes.jsonl` l.15-16 | **Ne recouvre pas, mais outille** : le solde dérivés − adoptés est DÉJÀ calculable ; il n'est opposé par personne |
| Routage `tests-suite` de l'étape 5 | `references\ETAPES-RUN.md` l.192-193 « cas générés à adopter, assertions, jeux de données — exécuté sous les gates de development, **sur propositions de la forge** » | Recouvre le geste d'adoption et son gate ; ne le rend pas OBLIGATOIRE — l'adoption reste facultative |
| Boucle de fermeture bornée + G-2 | `references\ETAPES-RUN.md` l.197-204 « Au plus 5 cycles toutes étapes confondues, extensibles à 7 … Garde G-2 absolue : jamais d'assertion assouplie ni de seuil requalifié » | Recouvre intégralement les bornes (P-f) — à citer, jamais à redéfinir |
| Garde G-1 et son code de sortie | `digit-ai-forge-tests\README.md` l.92 « `4` Refus G-1 — le dossier passé à `--livrables` tombe dans le projet audité » ; cicatrice `ETAPES-RUN.md` l.185-189 (TF-0271, « deux exécutions perdues le 15/08 ») | Recouvre — interdit toute option où forge-tests écrirait les tests dans le produit ; borne O2 |
| Idiome `non_testable` / `champs_requis` | `digit-ai-forge-tests\forge_tests\noyau.py` l.57-71 (RT-6) « il se répare **en saisissant `champs_requis`, pas en écrivant un test** » ; `README.md` l.290-294 « section toujours présente au rapport, **même vide** » | Recouvre EXACTEMENT la frontière P-e — rien à créer, seulement à rendre obligatoire comme unique alternative à l'adoption |
| Reprise du même idiome par le pilot | `ETAPE-MEP.md` l.71-72 « ils sortent dans la section `non_testables[]` du rapport {élément, champs_requis}, présentée à l'humain EN FIN d'audit » ; l.90 « § 3 bis — non-testables soldés ou listés avec leur raison » | Recouvre — la doctrine du solde motivé est déjà celle du gate MEP ; l'étape 5 est la seule à ne pas l'appliquer aux cas dérivés |
| Seuils opposables | `digit-ai-forge-tests\forge_tests\seuils.py` l.48-70 : `mutation_globale = 0.70` bloquant, `mutation_module_metier = 0.50`, `branches_module_exerce = 0.60` ; l.11-13 « un PLANCHER de recevabilité, pas une cible » | Recouvre — la règle n'introduit aucun seuil neuf, elle interdit un état, pas un chiffre |
| Contrat « prêt client » | `references\ETAPES-RUN.md` l.263-268 « forge-tests exit 0 ou 3 avec seuils … tenus · traçabilité exigences MVP → tests 100 % » | Recouvre partiellement : un rapport à 971 cas dérivés et 0 adopté peut sortir en exit 3 « PARTIEL acceptable » et satisfaire ce contrat |
| **R-39 al. 1 (famille `XX-tests`)** | `REGLES-PROJET.md` l.494-508 : « les documents de stratégie et d'exécution de tests dans `XX-tests` — le NOM vient du registre D-16, le NUMÉRO est local au dépôt » | **Recouvre TOTALEMENT le volet rangement de TF-0349** — déjà encodé le 17/08 au titre de TF-0347/0348 |
| **D-16 chez organization** | `digit-ai-forge-organization\decisions\D-16.md` l.33 : « `XX-tests` \| stratégie de tests et rapports d'exécution de bout en bout \| **TF-0349, 17/08** » | **Recouvre** — le nom canonique est au registre et cite déjà TF-0349 ; aucun mandat d'écriture neuf à demander |
| Discipline de numérotation D-15 | `REGLES-PROJET.md` l.132 (D-15) et `output\LISEZMOI.md` (mapping des anciens chemins) | Recouvre la mécanique du numéro et du `LISEZMOI.md` ; sa mécanisation reste la dette déclarée par D-15 elle-même |
| Patron « proposition puis exécution » de forge-development | `digit-ai-forge-development\docs\run-playbook.md` l.95 « Phase A — Diagnostic + PROPOSITION (n'exécute rien encore) » puis l.107 « ATTENDS ma validation » et l.109 « Phase B — Exécution (après ma validation) » | Ne recouvre pas (c'est un plan de run, pas des tests) mais **fournit le patron** : une proposition est un état transitoire adossé à une validation nommée, jamais un livrable terminal |
| Gate de traçabilité de development | `run-playbook.md` l.234-235 « Gate de complétude : par grep — 100 % des exigences MVP doivent avoir au moins un test qui les cite. Un identifiant sans test citant fait échouer le gate » | Recouvre la forme du contrôle recherché (un solde à zéro, mesuré par différence) — modèle à copier, pas à réécrire |
| Recette S-01 de forge-tests | `digit-ai-forge-tests\recette\verifier_corpus.py` l.1 « critère de sortie S-01, vérifié PAR EXÉCUTION » ; l.1659-1665 « PRÉALABLE D'ENVIRONNEMENT ABSENT … S-01 non prononcé, code 3 — un verdict rendu sur une mesure impossible n'est pas un verdict » | Recouvre la doctrine du verdict non prononcé ; porte sur la forge, pas sur les cas dérivés d'un produit |
| `outillage-tests-e2e\orchestrer-boucle.mjs` (pilot) | `outillage-tests-e2e\README.md` l.5 « l'intégration réelle avec forge-tests/forge-development est un jalon ultérieur, pas cette livraison » ; l.50-52 « ce fichier ne câble aucun appel réel » ; grep : **zéro citation hors `BOUCLE-AMELIORATION.md` l.778** | **Ne recouvre pas** — outil livré le 13/08, aucun appelant nommé : dette R-35 en l'état, et précédent direct de ce que O1 reproduirait |
| Écart de borne entre les deux textes | `outillage-tests-e2e\README.md` l.38-39 « Borné ≤ N cycles (défaut 3, G-2 absolue) » contre `ETAPES-RUN.md` l.198 « Au plus 5 cycles … extensibles à 7 » | Ne recouvre pas : divergence réelle à solder par l'option que retient la §5, sinon deux bornes coexistent |
| TF-0340 / TF-0341 (cycle de vie d'instance) | `todo\TODO.jsonl` TF-0340 « 3 conteneurs et un réseau laissés en service 2 h 25 après la fin de l'audit » ; TF-0341 « l'instance servait un code ANTÉRIEUR au correctif D-14, et rien ne l'aurait signalé » — statut `candidat` | Recouvre le volet e2e du critère de fin ; **restent candidats** : la règle les cite comme dépendance déclarée, elle ne les exécute pas |
| TF-0342..0345 (lot Produit-01 du jour) | `todo\TODO.jsonl` : TF-0342 recette multi-profils (« audit 12 pans déclaré vert le 12/08 sur le seul cas dégénéré »), TF-0343 matrice exécutable cellule par cellule en `xfail(strict=True)`, TF-0344 trois pièges à faux vert, TF-0345 donnée de test référencée | Ne recouvrent pas la règle de fermeture — **convergence** : quatre candidats du même jour poussent dans la même direction (un test qui n'est pas joué, ou joué sur le cas dégénéré, ne protège pas) |
| `oracle-conformite-projet` et `oracles\self-tests.mjs` | `oracles\self-tests.mjs` l.16 « INVARIANT (I1) : tout `oracle-*.mjs` doit être couvert » ; l.36 le glob ne prend que `oracles\oracle-*.mjs` | Ne recouvre pas : un contrôle neuf devra vivre sous `oracles\oracle-*.mjs` pour être agrégé — sinon il naît hors I1, comme les tests de `outillage-tests-e2e\` |
| Codes de sortie publiés par le pilot | `digit-ai-forge-tests\forge_tests\__main__.py` l.21-23 « le contrat publié du pilot ne documente que 0/1/3 » alors que `SORTIE_REFUS_G1 = 4` existe depuis le 15/08 | Ne recouvre pas — dette de répercussion à solder au passage, le critère de fin de TF-0349 exige « un rapport d'exécution … avec exit codes » |

## 3. État de l'art daté

Sept sources, dont cinq de moins de 24 mois. La fraîcheur relève de la revue ; les
localisateurs sont donnés pour être rejoués.

1. **Google Cloud, « Announcing the 2025 DORA Report » — 2025-09** (`cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report`, consulté 2026-08-17). Thèse retenue : l'IA amplifie la qualité du système d'ingénierie dans lequel elle opère ; là où les maillons aval (tests, revue) sont faibles, elle expose la faiblesse au lieu de la combler. Transposition directe : générer 971 cas ne renforce rien tant que l'aval ne les exécute pas.
2. **InfoQ, « AI Is Amplifying Software Engineering Performance, Says the 2025 DORA Report » — 2026-03** (`infoq.com/news/2026/03/ai-dora-report/`). Chiffres repris : l'adoption de l'IA corrèle avec plus d'instabilité, de reprise et de temps de résolution quand les garde-fous manquent. Argument pour garder les bornes de P-f intactes.
3. **Bajaj D., Khetan D., « Governance Controls for AI-Generated Test Artifacts in Autonomous Software Testing », arXiv:2606.08806v1 — 2026-06-09.** Titre, auteurs et date vérifiés par récupération du PDF ; **réserve déclarée** : seules les métadonnées et la structure ont été lues, le corps n'a pas été extrait — la thèse citée (des artefacts de test générés exigent un contrôle de validation avant d'être opposés) est donc reprise au niveau du cadrage, pas d'une citation de page.
4. **ISO/IEC/IEEE 29119-5:2024, « Keyword-driven testing » — publiée 2024-12** (`iso.org`). Dans la fenêtre de 24 mois. Retenu : la normalisation continue de porter sur des artefacts *exécutables* et non sur la documentation d'intention.
5. **ISO/IEC TR 29119-6:2021, usage de 29119 en projets agiles — 2021-08** (`iso.org/standard/81293.html`). **Hors fenêtre de 24 mois, cité comme antériorité normative** : la série sépare depuis longtemps *stratégie* (durable, inter-projets) et *plan* (daté, projet) — la règle instruite ici ne supprime ni l'un ni l'autre, elle interdit qu'un document tienne lieu d'exécution.
6. **Mergify, « Top 8 Test Environment Management Best Practices » — millésime 2025** (`articles.mergify.com/test-environment-management-best-practices/`, consulté 2026-08-17). Retenu : le teardown automatisé après tests est une pratique de place, et les ressources orphelines sont le défaut nommé — c'est mot pour mot le constat de TF-0340 (2 h 25 de conteneurs en service).
7. **Global App Testing, « How to Write a Test Strategy Document » (millésime 2026) et TestCollab, « Software Testing Strategies: A Practical Guide for QA Teams in 2026 »** (consultés 2026-08-17). Retenu, y compris ce qui affaiblit la règle : le document de stratégie n'est pas déclaré obsolète par la place ; l'inflexion porte sur son poids et sur son couplage à l'exécution. La règle instruite ici ne bannit donc pas le document — elle bannit le document **sans** exécution.

**Ce que l'état de l'art ne fournit pas** : aucune source ne publie de seuil pour « part
acceptable de cas dérivés non adoptés ». Le seuil retenu (zéro non motivé) est un choix de
l'écosystème, assumé comme tel, et il n'est tenable que parce que l'alternative motivée
(`non_testable` + `champs_requis`) existe déjà.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire.** **Réfutée**, coût du statu quo cité et chiffré sur pièces du jour :
  **971 + 94 cas dérivés pour 0 adopté** sur Produit-11 (20260817b), **680 pour 0** sur
  COMPTA (20260814b), **176** sur Produit-01 (20260812a) — et sur ce dernier, un audit
  « 12 pans, pan qualif 8/8 ratio 1,00 ZÉRO finding, e2e 10/10 verte » déclaré le 12/08 dont le
  trou nominal n'a été trouvé « ni par l'outillage mais par une question humaine cinq jours plus
  tard » (TF-0342). S'y ajoute le coût déjà payé et documenté dans le code :
  « après avoir écrit 11 tests couvrant exactement les axes proposés, le cahier suivant
  régénérait les mêmes cent cas en « non joué ». Un indicateur qui ne bouge pas quand le travail
  est fait cesse d'être lu » (`adoption.py` l.4-7). O0 laisse donc un cahier de 971 cas partir
  chez un client comme s'il attestait une couverture : c'est la définition d'un contrôle jamais
  joué (R-35, `REGLES-PROJET.md` l.374-376). Partition visée : aucune.
- **O1 — la règle seule, texte opposable sans appelant.** Une section neuve de
  `REGLES-PROJET.md` (P-a) et rien d'autre. Coût : ~2 h. Ce qu'elle exclut : toute détection —
  aucun run ne saurait dire qu'il l'a violée. **Réfutée par un précédent du même dépôt** :
  `outillage-tests-e2e\orchestrer-boucle.mjs`, livré le 13/08 pour cette exacte finalité, n'est
  cité par aucune étape de run (grep : zéro occurrence hors journal) et ses tests ne sont pas
  agrégés par `oracles\self-tests.mjs` (glob restreint à `oracles\oracle-*.mjs`). O1 fabriquerait
  une seconde décoration au même endroit. Partitions visées : P-a seule.
- **O2 — l'appelant chez forge-tests, qui adopte elle-même.** forge-tests écrirait les cas
  retenus dans le produit et les exécuterait. Coût : ~2-3 j sur forge-tests. **Réfutée sans
  arbitrage** : elle viole G-1, dont le refus est déjà outillé et bruyant (code de sortie 4,
  `README.md` l.92), et dont la violation par prescription a déjà coûté « deux exécutions
  perdues le 15/08 » (TF-0271, `ETAPES-RUN.md` l.185-189). Elle confondrait aussi juge et partie
  (`cahiers.py` l.20). Partitions visées : P-b, P-c — au prix de P-f.
- **O3 — la règle au pilot, l'appelant à l'étape 5, l'atterrissage déjà conventionné.**
  Trois pièces, aucune forge tierce à modifier dans le même geste :
  1. **Texte** (P-a) — une section neuve de `REGLES-PROJET.md` (numéro libre : **R-40**, R-39
     étant occupée depuis le 17/08) : un cas dérivé n'est pas un livrable ; il finit **adopté**
     (écrit, exécuté, verdict au rapport), **`non_testable` motivé avec ses `champs_requis`**, ou
     **écarté par une décision humaine nommée**. Aucun quatrième état, et le silence n'en est pas
     un.
  2. **Appelants nommés** (P-b, R-35) — (a) le pas de l'étape 5 de `references\ETAPES-RUN.md` :
     la boucle de fermeture ne se clôt pas tant que le solde `dérivés − adoptés − non_testables −
     écartés` est non nul, sous les bornes inchangées de P-f ; (b) le contrat « prêt client »
     (l.263-268), qui gagne un critère mesurable de plus : solde nul ou motivé ; (c) un contrôle
     exécutable né exercé, déposé sous `oracles\oracle-*.mjs` pour être agrégé par I1, avec
     fixtures à double sens (R-31 al. 2). Le solde est déjà calculable : le contrat d'adoption
     `<projet>\forge\cas-adoptes.jsonl` existe (`adoption.py` l.15-16).
  3. **Atterrissage** (P-d) — la famille `XX-tests` **n'est pas à créer** (R-39 al. 1 + D-16
     l.33, qui cite déjà TF-0349). Ce qui est à trancher est son contenu : y atterrit le
     **rapport d'exécution** daté (code de sortie, triplet couverture/passage/mutation,
     `non_testables[]`, et ce que l'e2e laisse debout) ; les cahiers dérivés restent des
     artefacts de travail hors `output\`, comme ils le sont déjà côté forge-tests
     (`.gitignore` l.11 ignore `propositions/`).
  Coût : **~1 à 1,5 j sur le pilot seul**. Surfaces livrées le jour même (R-31 al. 4) :
  `REGLES-PROJET.md` §T, `references\ETAPES-RUN.md` §5 et contrat « prêt client »,
  requalification du libellé des verbes `cat-tst-02`/`cat-tst-03` dans `catalogues\CATALOGUES.md`
  (le verbe reste, sa sortie cesse d'être un livrable), répercussion du code de sortie 4 dans le
  contrat publié. Ce qu'elle exclut : le câblage réel de l'orchestrateur, le harnais
  d'environnement et le cycle de vie d'instance — laissés à O4 et à TF-0340/0341.
  Partitions visées : P-a, P-b, P-d, P-e, P-f (respectée), P-c (énumérée, partiellement
  outillée).
- **O4 — la chaîne outillée complète en un seul lot.** O3 plus : câblage de
  `orchestrer-boucle.mjs` en appelant réel de forge-tests et forge-development, harnais de
  préparation d'environnement, contrat de cycle de vie d'instance (monter/démonter) et
  confrontation servi ↔ versionné. Coût : **3 à 5 j sur trois dépôts**, dont deux hors du pilot,
  et deux dépendances **non décidées** (TF-0340 et TF-0341 sont au statut `candidat`, cibles
  `digit-ai-forge-tests` et `digit-ai-forge-ops`). Ce qu'elle exclut : le rendez-vous rapide avec
  les faits — la règle n'entrerait en vigueur qu'au bout du lot, et le prochain cahier de 971 cas
  partirait avant. À retenir comme **suite** de O3, jamais comme entrée. Partitions visées :
  toutes, au prix du délai.

## 5. Verdict

- **Option retenue** : **O3**.
- **Motif du choix, en une phrase mesurable** : O3 est la seule option qui rend le défaut
  DÉTECTABLE (solde nul ou motivé, calculable dès aujourd'hui depuis
  `<projet>\forge\cas-adoptes.jsonl` et la section `non_testables[]`) sans toucher aux quatre
  bornes de P-f ni écrire une ligne chez une forge tierce, là où O1 reproduirait la décoration
  déjà constatée sur `orchestrer-boucle.mjs` et O2 se heurterait au refus outillé G-1.
- **Coût** : ~1 à 1,5 j sur le pilot. Dette assumée et déclarée : (a) le contrôle mesure un
  **solde**, pas la QUALITÉ des tests adoptés — un test adopté et faible passe le solde et se
  fait prendre ailleurs, par les seuils de mutation de `seuils.py` ; (b) l'écart de borne entre
  `outillage-tests-e2e\README.md` (défaut 3) et `ETAPES-RUN.md` (≤ 5, extensible 7) doit être
  soldé dans le même geste, sinon la règle citera deux bornes ; (c) le volet e2e reste
  **déclaratif** tant que TF-0340/0341 sont `candidat` : la règle cite la dépendance et ne la
  simule pas ; (d) les 8 exemplaires listés en §0 ne sont pas rattrapés en masse — chacun au
  prochain run de son produit.
- **Candidature(s) émise(s)** : aucune candidature nouvelle — TF-0349 porte déjà l'objet, la
  décision humaine du 17/08 est acquise sur le principe et cette étude entre au dossier comme
  cadrage du COMMENT. **Deux points à trancher explicitement, car aucun ne relève du pilot
  seul** : (1) mandat d'écriture chez `digit-ai-forge-tests` pour requalifier le libellé des
  verbes `--generer` / `--livrables` (aujourd'hui « en proposition … prêts à adopter ») — sans ce
  mandat, le catalogue continuera de vendre la voie fermée, et l'écart se déclare comme dette ;
  (2) sort de `outillage-tests-e2e\orchestrer-boucle.mjs` — câblé comme appelant (bascule vers
  O4) ou déclaré en dette R-35 nommément, jamais laissé en silence. Aucune écriture chez
  `digit-ai-forge-organization` n'est requise : D-16 cite déjà TF-0349.
- **Plan de revue** : **2026-09-17** (un mois). Quatre mesures, toutes chiffrables sur pièces :
  (1) nombre de cahiers dérivés déposés depuis le 17/08 dont le solde de cas non adoptés et non
  motivés est non nul — toute valeur non nulle rouvre le sujet ; (2) nombre de familles
  `XX-tests` réellement créées, et nature de ce qu'elles contiennent (rapport d'exécution avec
  code de sortie, ou cahier de propositions déguisé) ; (3) nombre de fois où le nouveau contrôle
  a FAIL, séparé en vrais et faux positifs — un seul faux positif rouvre la frontière P-e ;
  (4) le contrôle a-t-il été JOUÉ au moins une fois sur un run réel : s'il ne l'a pas été, il est
  une décoration au sens de R-35 et se requalifie, exactement comme cette étude le reproche à
  O0 et O1.

## Non jugé par cette étude

- **La qualité des tests adoptés.** Le solde mesure qu'un cas a cessé d'être une proposition,
  jamais qu'il protège. Cela reste le domaine des seuils de mutation (`seuils.py` l.48-70) et des
  pièges à faux vert de TF-0344.
- **Le contenu du rapport d'exécution.** Sa forme lisible relève de R-36 et de
  `gabarits\RESTITUTION.md`, jugés par `oracles\oracle-synthese.mjs` ; cette étude fixe ce qui y
  atterrit, pas comment il se lit.
- **Le rattrapage des 8 exemplaires antérieurs** listés en §0, ni le cas des produits hors
  écosystème forgé (`C:\dev\CoproPulse\docs\TEST_STRATEGY.md`) : R-37 al. 3 pose déjà le principe
  du rattrapage au premier contact.
- **Les dépenses.** Aucun chiffre de consommation n'est avancé : l'exécution réelle de cas
  adoptés se fait sous les gates existants, et tout pan qui appelle un modèle payant reste sous
  R-34 et sous GO humain.
