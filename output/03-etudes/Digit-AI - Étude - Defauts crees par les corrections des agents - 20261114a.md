# Défauts créés par les corrections des agents : où ils naissent et ce qui les préviendrait

Étude du 14/11/2026, pilot `digit-ai-factory`, session pilote Claude Opus 4.6. Elle prolonge l'étude du coût et de la qualité du 06/11/2026 (TF-2236 à TF-2242, optimisations O1 à O7) et l'étude d'amélioration du 29/10/2026 (variantes A à E). Elle ne modifie ni le skill `prompt-analyzer-l99`, ni les contrats d'agents, ni le registre : l'essai D-111 (a) court jusqu'au 16/11/2026.

Natures des chiffres : MESURÉ (lu par une commande sur une trace), DÉCOMPTÉ (compté par une commande sur des journaux), ESTIMÉ (calcul ou jugement, hypothèse dite).

## Ce qui change pour le lecteur

Dans les 12 journaux de boucle du pilot, 54 défauts ont été créés par des corrections pour 90 défauts fermés (ratio 0,60). Trente-huit sont classables : 17 sont des contradictions avec du texte resté en place, 13 des commandes écrites sans avoir été exécutées, 7 des termes introduits sans définition, 1 un autre cas. Seize ne sont pas classables (le journal ne les décrit pas un par un). Tous les défauts classables ont été écrits par la session orchestratrice. 13 défauts supplémentaires, sur les 2 journaux qui portent le texte des passes, sont des défauts graves dont la citation porte sur du texte ajouté par la correction précédente. Trois propositions de prévention sont classées pour la revue du 16/11/2026.

## Q1. Où naissent les défauts créés

### Corpus

12 journaux : 11 fichiers `*.boucle.json` et 1 fichier `*.boucle-cdc.json` sous `output`, total 35 passes dont 20 avec un vérificateur de clôture.

### Compte A : défauts créés relevés par les vérificateurs

Source : somme des `passes[].verification_cloture.defauts_crees` du corpus.

Total : 54 (DÉCOMPTÉ).

Détail par journal et par passe, voir l'annexe B.

### Compte B : défauts graves sur texte ajouté par la correction

Source : les 2 journaux qui portent le champ `texte` dans leurs passes (amelioration-boucle-20261029b, 4 passes ; strategie-lancement-20261029a, 5 passes). Les 10 autres journaux sont **non mesurables** pour le compte B (pas de champ `texte`).

Méthode : pour chaque défaut grave retenu à la passe N, ses fragments de citation (coupés sur `[...]` et `...`) sont cherchés dans le texte normalisé de la passe N et de la passe N-1. Un défaut est créé par la correction si tous ses fragments sont présents en passe N et au moins un est absent en passe N-1.

Total : 13 (DÉCOMPTÉ, script `analyse-b.mjs`). Aucun n'est déjà compté en A (les 2 journaux sont antérieurs à D-111 (a) et n'ont pas de vérificateur de clôture).

Détail : 5 en passe 2 du journal amelioration-boucle, 1 en passe 3, 1 en passe 4 ; 4 en passe 2 du journal strategie-lancement, 1 en passe 3, 1 en passe 4.

3 défauts sont introuvables dans le texte de leur propre passe (citations élidées ou reformulées). Ils ne sont comptés ni en B ni en A.

### Tableau de Q1

Le tableau croise les classes de défauts (lignes) avec leurs comptes et les acteurs qui les ont écrits (colonnes). Le total A vaut 54 (DÉCOMPTÉ), le total B vaut 13 (DÉCOMPTÉ), et leur somme 67.

| Classe | Compte A | Compte B | A + B | Session orchestratrice | Note de relecteur reprise | Proposition du vérificateur | Non établi |
|---|---|---|---|---|---|---|---|
| Contradiction avec un texte resté en place | 17 | 7 | 24 | 24 | 0 | 0 | 0 |
| Commande ou outil écrit sans avoir été exécuté | 13 | 4 | 17 | 17 | 0 | 0 | 0 |
| Terme, colonne ou compte introduit sans définition | 7 | 2 | 9 | 9 | 0 | 0 | 0 |
| Dégât de l'outil d'édition | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Autre | 1 | 0 | 1 | 1 | 0 | 0 | 0 |
| **Non classable** | **16** | **0** | **16** | **0** | **0** | **0** | **16** |
| **Total** | **54** | **13** | **67** | **51** | **0** | **0** | **16** |

Les 16 non classables viennent de 3 passes dont le champ `suite` dit seulement que les signalements ont été corrigés, sans décrire les défauts créés : make-it-better passe 2 (5 défauts), make-it-better passe 3 (6), tri-tiktok passe 2 (5).

## Q2. Gestes de prévention par classe

### Contradiction avec un texte resté en place (24 défauts, soit 24/67 = 36 % du total A+B)

La première classe regroupe les cas où la correction ajoute ou modifie du texte qui contredit un passage non touché du prompt.

**Geste proposé : après chaque correction, rechercher chaque terme et chiffre touché dans tout le prompt.**

Épreuve sur les données : 17 des 24 sont des contradictions où le texte modifié contredit un passage non modifié qui utilise le même terme ou le même chiffre. Sur le journal pentest-20261102j passe 2, les 3 défauts sont des contradictions entre la Phase 7, le partage et la dimension (C), toutes sur le mot « preuves ». Une recherche de « preuves » dans tout le prompt après la correction aurait surfacé les 3 passages contradictoires. ESTIMÉ : ce geste préviendrait 14 des 17 contradictions de texte (les 3 restantes portent sur des implications logiques, pas sur un terme commun). Position face à O1-O9 : **extension de O7** (O7 fait vérifier chaque phrase ajoutée par sa prémisse ; ce geste ajoute la recherche des termes touchés dans tout le prompt).

### Commande ou outil écrit sans avoir été exécuté (17 défauts, soit 17/67 = 25 % du total A+B)

La deuxième classe regroupe les commandes, options ou scripts écrits dans le prompt sans avoir été exécutés au préalable.

**Geste proposé : n'écrire une commande qu'après l'avoir jouée, sortie citée.**

Épreuve sur les données : 13 des 17 sont des commandes, des options de commande ou des scripts référencés sans exécution préalable. Sur le journal suivi-temps-couts passe 2, les 2 défauts sont `--projet` et la méthode B, tous deux écrits sans test. Sur le journal animations passe 2, `npx playwright` et `allouer-indice` ont été écrits sans être joués. ESTIMÉ : ce geste préviendrait 13 des 17 (les 4 restants sont des formats de sortie non testés, pas des commandes). Position face à O1-O9 : **extension de O7** (O7 fait vérifier les prémisses des phrases ajoutées ; ce geste étend la vérification à toute commande écrite).

### Terme, colonne ou compte introduit sans définition (9 défauts, soit 9/67 = 13 % du total A+B)

La troisième classe regroupe les colonnes, métriques ou paramètres ajoutés par la correction sans être définis ni rattachés à une commande de vérification.

**Geste proposé : fixer un budget de mots par défaut fermé.**

Épreuve sur les données : 6 des 9 sont des ajouts de texte neuf (colonnes, métriques, paramètres) qui alourdissent le prompt sans définir ce qu'ils introduisent. La garde de longueur B4 ne les rejette pas (la correction ferme un majeur). Un budget de mots fermé, avec remplacement plutôt qu'ajout, forcerait à définir chaque terme dans l'espace disponible ou à retirer le terme superflu. ESTIMÉ : ce geste préviendrait 4 des 9 (les 5 restants sont des comptes faux, pas des ajouts). Position face à O1-O9 : **extension de O4** (O4 pose une garde cumulée de longueur ; ce geste ajoute la contrainte de remplacement).

### Dégât de l'outil d'édition (0 défauts)

Aucun dans le corpus. Deux dégâts de `sed` sont mentionnés dans le journal apprentissage-erreurs passe 2 mais ne sont pas comptés dans `defauts_crees` (réparés séparément).

### Autre (1 défaut)

Un cas d'ÉTAPE 0 non isolée (pentest-cdc passe 2). Aucun geste générique ne le couvre.

## Q3. Capacité d'analyse des relecteurs

### Taux de détection

Le champ `vu_par` est présent dans 9 journaux sur 12. Les 3 journaux sans `vu_par` sont : supabase-20261016b (passe 1 et 2), et les 2 passes du journal supabase qui ne portent pas de `vu_par` nommé (la clé existe mais sans identifiant de relecteur).

Calcul sur les 9 journaux avec `vu_par` exploitable (24 passes, 148 défauts graves portant `vu_par`) :

- Les relecteurs sont identifiés par lettres (A, B, C...) ou par numéros (1, 2). Pour chaque passe, le taux de détection d'un relecteur = défauts graves qu'il voit / total des défauts graves de la passe qui portent `vu_par`.
- Taux médian du relecteur qui voit le moins : 0,57 (DÉCOMPTÉ, 24 passes). Taux médian du relecteur qui voit le plus : 0,86.
- Le taux global (union des 2 relecteurs) est 1,00 par construction de `vu_par` : seuls les défauts vus par au moins un relecteur sont au journal.

### Écart de score entre relecteurs

Le champ de notes est présent dans 11 journaux sur 12 (le journal supabase-20261016b ne porte qu'un score par passe, pas de scores séparés). Selon la version du journal : `scores_relecteurs` (objet A/B ou tableau), `scores` (objet A/B), ou `relecteurs[].score`.

Sur 28 passes notées par 2 relecteurs (DÉCOMPTÉ) :
- Écart médian : 4 points.
- Écart minimal : 0 point (3 passes).
- Écart maximal : 42 points (suivi-avancement passe 3, 82 contre 40, un bloquant vu par un seul relecteur).
- 16 passes sur 28 ont un écart de 4 points ou plus.

### Démentis

Défauts portant `dementi: true` : **5** (DÉCOMPTÉ). Journaux : tri-tiktok passe 1 (1, D-120 au registre), tri-tiktok passe 2 (1, portée du run), suivi-avancement passe 1 (1, outil Workflow), animations passe 4 (1, oracle table vide), strategie-lancement passe 3 (1, 2 lignes TF-2022).

Défauts de statut `ecarte` sans `dementi: true` : **24** (DÉCOMPTÉ). Tous portent un motif « vu par un seul relecteur » sauf 1 (strategie-lancement passe 3, démenti par le recompte mais sans `dementi: true`).

### Quels changements augmenteraient le taux de détection sans augmenter l'écart

Un relecteur plus fin (consigne à charge plus détaillée, ou modèle plus puissant) trouvera plus de défauts, y compris des défauts que l'autre relecteur ne voit pas. Cela **fera BAISSER le score mesuré** si le score est le minimum des deux notes : le relecteur fin donnera une note plus basse quand il trouve plus de majeurs, et le minimum baissera. ESTIMÉ : le score mesuré d'un prompt inchangé peut baisser de 3 à 5 points sous un relecteur plus fin, sur la base des écarts de 4 à 7 points mesurés le 29/10/2026.

Pistes compatibles avec la stabilité de l'écart :
1. **Relecteur dédié en lecture seule** (O6, TF-2241) : réduit le bruit de la consigne sans changer la capacité de détection. L'écart ne change pas.
2. **Jugement apparié** (O5, TF-2240) : chaque relecteur note les deux versions, gardée et corrigée, sans étiquette. L'écart intra-relecteur est plus petit que l'écart inter-relecteurs, et la décision de garder se prend sur le delta, pas sur le score absolu. L'écart de score absolu reste le même mais n'affecte plus la décision.

## Q4. Le plafond tient-il à la qualité du prompt ou à la mesure

Le tableau ci-dessous rapproche, journal par journal, le score d'arrêt et le nombre de défauts graves restants à la passe d'arrêt, pour dire si le plafond vers 80 vient de la qualité du prompt ou du bruit de la mesure. Colonnes : le score affiché au Ch8 (minimum des 2 relecteurs), le nombre de bloquants et majeurs retenus après recompte à la passe d'arrêt, et la raison d'arrêt posée par l'oracle. Trié par date de journal. Un score élevé avec beaucoup de graves signale un problème de mesure ; un score bas avec peu de graves, un problème de qualité.

| Journal | Score d'arrêt | Défauts graves à l'arrêt | Raison d'arrêt |
|---|---|---|---|
| supabase-20261016b | 84 | 2 | gain_insuffisant |
| amelioration-boucle-20261029b | 75 | 4 | gain_insuffisant |
| strategie-lancement-20261029a | 78 | 3 | gain_insuffisant |
| tri-tiktok-20261102a | 74 | 6 | gain_insuffisant |
| make-it-better-20261102d | 84 | 6 | regression |
| pentest-20261102j | 87 | 3 | gain_insuffisant |
| openai-gemini-20261103c | 86 | 7 | gain_insuffisant |
| apprentissage-erreurs-20261104a | 84 | 5 | gain_insuffisant |
| suivi-temps-couts-20261104c | 86 | 5 | regression |
| animations-20261109b | 84 | 5 | regression |
| suivi-avancement-20261112a | 69 | 9 | regression |
| pentest-cdc-20261102j | 88 | 2 | borne |

Médiane du score d'arrêt : 84 (DÉCOMPTÉ). Médiane des défauts graves à l'arrêt : 5 (DÉCOMPTÉ).

**Verdict : les deux.** Le plafond tient à la qualité du prompt (5 défauts graves restent en médiane) ET à la mesure (le score ne descend pas avec les défauts : openai-gemini est noté 86 avec 7 graves, suivi-avancement 69 avec 9 graves). Le score dépend du relecteur autant que du prompt.

**Pour dépasser 90** sous la rubrique actuelle, il faudrait (ESTIMÉ) :
1. 0 bloquant et au plus 2 majeurs à l'arrêt (aucune passe du corpus n'y arrive ; la médiane est 5).
2. Un ratio défauts créés / fermés sous 0,30 (aujourd'hui 0,60), ce qui exige les gestes de Q2.
3. Un score stable à ±2 points entre relecteurs (aujourd'hui l'écart médian est 4), ce qui exige le jugement apparié (O5).

## Q5. Application aux types d'agents du pilot

Le corpus ne contient aucune correction écrite par un agent `campagne`, `constructeur` ou `redacteur` : ces lignes portent la mention TRANSPOSÉ (ESTIMÉ).

| Type d'agent | Classe de Q1 | Défauts (A+B) | Ligne du contrat | Mention |
|---|---|---|---|---|
| campagne | Contradiction avec un texte resté en place | 24 | `gabarits/AGENT-CAMPAGNE.md:78` (Chirurgie : modifications chirurgicales, le diff minimal) | TRANSPOSÉ (ESTIMÉ). Test : rejouer les 17 contradictions de texte du corpus sur un livrable d'agent campagne et vérifier si le diff minimal les aurait évitées. |
| campagne | Commande ou outil écrit sans avoir été exécuté | 17 | `gabarits/AGENT-CAMPAGNE.md:83` (Vérification native avant commit) | TRANSPOSÉ (ESTIMÉ). Test : mesurer le nombre de commandes non testées dans les rapports de 10 campagnes. |
| campagne | Terme, colonne ou compte introduit sans définition | 9 | `gabarits/AGENT-CAMPAGNE.md:78` (Chirurgie) | TRANSPOSÉ (ESTIMÉ). Test : compter les termes nouveaux dans les diffs de 10 campagnes. |
| constructeur | Contradiction avec un texte resté en place | 24 | `gabarits/AGENT-CAMPAGNE.md:78` (même contrat que campagne, partagé) | TRANSPOSÉ (ESTIMÉ). Même contrat que campagne, même ligne, même test. |
| constructeur | Commande ou outil écrit sans avoir été exécuté | 17 | `gabarits/AGENT-CAMPAGNE.md:83` (même contrat que campagne, partagé) | TRANSPOSÉ (ESTIMÉ). Même test. |
| constructeur | Terme, colonne ou compte introduit sans définition | 9 | `gabarits/AGENT-CAMPAGNE.md:78` (même contrat que campagne, partagé) | TRANSPOSÉ (ESTIMÉ). Même test. |
| redacteur | Contradiction avec un texte resté en place | 24 | `.claude/agents/redacteur.md:19` (Chaque fait avancé porte sa source) | TRANSPOSÉ (ESTIMÉ). Test : rejouer les contradictions sur un document produit par un rédacteur. |
| redacteur | Commande ou outil écrit sans avoir été exécuté | 17 | `.claude/agents/redacteur.md:19` (Chaque fait avancé porte sa source) | TRANSPOSÉ (ESTIMÉ). Test : vérifier les commandes citées dans 5 études produites par un rédacteur. |
| redacteur | Terme, colonne ou compte introduit sans définition | 9 | `.claude/agents/redacteur.md:19` (Chaque fait avancé porte sa source) | TRANSPOSÉ (ESTIMÉ). Test : compter les termes non définis dans 5 études. |
| verificateur | Contradiction avec un texte resté en place | 0 | sans objet | Le vérificateur ne corrige rien (`.claude/agents/verificateur.md:3`, mandat : « ne corrige rien »). Aucun défaut de la colonne « proposition du vérificateur » dans le tableau de Q1 (0 sur 54). |
| verificateur | Commande ou outil écrit sans avoir été exécuté | 0 | sans objet | Sans objet : même motif. |
| verificateur | Terme, colonne ou compte introduit sans définition | 0 | sans objet | Sans objet : même motif. |
| explorateur | — | — | sans objet | Sans objet : l'explorateur ne corrige rien et n'écrit rien (`.claude/agents/explorateur.md:3`, mandat : « n'écrit rien et n'arbitre rien »). |

L'agent des journaux du corpus, qui joue le rôle de vérificateur de clôture, est un agent `verificateur` lancé par la session orchestratrice (identifié par « verificateur neuf avec contexte » ou « verificateur-avec-contexte » dans le champ `verification_cloture.agent`). C'est bien le type `.claude/agents/verificateur.md` : modèle Sonnet, lecture seule, verdict par item sans correction.

## Propositions

Trois propositions de prévention, une par combinaison de classes visées, chacune positionnée face aux optimisations O1 à O9 de l'étude du 06/11/2026 et chiffrée sur le corpus de 54 défauts créés pour 90 fermés (ratio 0,60).

| # | Classe(s) visée(s) et nombre | Mécanisme | Position face à O1-O9 | Effet estimé (ratio avant → après, gain) | Coût en jetons par boucle | Risque | Test |
|---|---|---|---|---|---|---|---|
| P1 | Contradiction (24) + Commande (17) = 41 | Après chaque correction, un script recherche chaque terme et chiffre touché dans tout le prompt ; chaque commande écrite est exécutée avec sa sortie citée avant d'entrer dans le prompt | Extension de O7 (ajoute la recherche de termes et l'exécution de commandes au vérificateur sur le diff) | 0,60 → 0,29, gain 0,31 (ESTIMÉ : prévient 27 des 41 défauts des 2 classes, soit 27/90 fermés en moins au dénominateur constant) | 5 000 (un grep par terme touché + exécution des commandes, sans agent supplémentaire) | Faible : le script ne modifie rien, il signale | Sans agent : rejouer les 38 défauts classés du corpus sur leurs journaux et vérifier combien le script aurait signalés. Budget : 0 jeton (script seul). Seuil : le script signale au moins 20 des 27 estimés. |
| P2 | Contradiction (24) | Corriger en remplaçant le passage fautif plutôt qu'en ajoutant du texte ; la garde de longueur cumulée (O4) rejette un ajout net au-delà de +30 % depuis la passe 1 | Extension de O4 (ajoute la contrainte de remplacement au budget de mots) | 0,60 → 0,44, gain 0,16 (ESTIMÉ : prévient 14 des 24 contradictions, celles où le texte contradictoire est un ajout net) | 0 (modification de la consigne de correction, pas d'agent) | Moyen : un remplacement forcé peut supprimer un passage utile | Avec agents : une boucle sur un prompt de départ, 2 passes, avec et sans la contrainte de remplacement, mêmes relecteurs. Budget : 400 000 jetons. Seuil : la variante avec remplacement a au plus 2 contradictions de plus que le témoin. |
| P3 | Terme (9) + Commande (17) = 26 | Après chaque correction, le vérificateur vérifie chaque terme et chiffre nouveau par une commande ; un terme sans commande de vérification est signalé | Extension de O7 (ajoute la vérification des termes nouveaux au vérificateur sur le diff) | 0,60 → 0,41, gain 0,19 (ESTIMÉ : prévient 17 des 26, ceux où le terme ou la commande aurait été trouvé faux par exécution) | 8 000 (le vérificateur exécute des commandes en plus de ses vérifications habituelles) | Faible : les commandes sont en lecture seule | Sans agent : rejouer les 26 défauts des 2 classes sur leurs journaux et vérifier combien une commande de vérification aurait trouvés. Budget : 0 jeton. Seuil : la commande trouve au moins 12 des 17 estimés. |

## Classement pour la revue du 16/11

Critère : effet estimé par jeton = gain du ratio / coût en jetons.

| Rang | Proposition | Effet (gain) | Coût (jetons) | Effet par jeton |
|---|---|---|---|---|
| 1 | P2 | 0,16 | 0 | infini (coût nul) |
| 2 | P1 | 0,31 | 5 000 | 0,0000620 |
| 3 | P3 | 0,19 | 8 000 | 0,0000238 |

P2 est première parce que son coût est nul (modification de consigne). P1 est deuxième parce que son gain est le plus élevé pour un coût faible. P3 est troisième.

## Annexe A — Relevés de l'étape 0

### Relevé 0.1 — releve-boucles.mjs

Commande : `node <SKILL>/scripts/releve-boucles.mjs C:/dev/digit-ai-factory/output --json`
Heure : 2026-11-14 16:31:06

11 journaux `*.boucle.json`, 0 illisible, gain médian 7 points, graves clos médian 1. Règle de revue : « gain médian < 3 points → le mode redevient optionnel ». Arrêts : 6 gains insuffisants, 4 régressions, 1 borne, 0 zéro majeur.

Le champ `regle_de_revue` rappelle une règle, sans dire si elle est déclenchée : le gain médian de 7 est au-dessus du seuil de 3.

### Relevé 0.2 — dernières lignes TF-2026 et TF-2236 à TF-2242

Commande : `grep` sur `todo/TODO.jsonl`
Heure : 2026-11-14 16:31:06

- TF-2026 : dernière ligne = constat du 12/11/2026 sur le journal suivi-avancement, règle B8 et le dénominateur faux. Statut `en_cours`, revue le 16/11/2026.
- TF-2236 à TF-2242 : tous en statut `candidat`, tous créés le 06/11/2026 par l'étude du coût et de la qualité.

La revue de l'essai D-111 (a), prévue le 16/11/2026, n'a pas encore eu lieu.

### Relevé 0.3 — état du skill

Commande : `git -C digit-ai-forge-agents status --porcelain -- .claude/skills/prompt-analyzer-l99`
Heure : 2026-11-14 16:31:06

Aucune modification locale. HEAD : `d4e19947`.

### Relevé 0.4 — études et boucle.md

Lecture de l'étude du 29/10/2026, de l'étude du 06/11/2026 et de `<SKILL>/references/boucle.md`.

### Relevé 0.5 — types d'agents

Lecture de `.claude/agents/campagne.md`, `.claude/agents/constructeur.md`, `.claude/agents/redacteur.md`, `.claude/agents/verificateur.md`, `.claude/agents/explorateur.md` et `gabarits/AGENT-CAMPAGNE.md`.

### Relevé 0.6 — empreintes « avant »

- `todo/TODO.jsonl` : sha256 `568da2f3395d7816666bed6e63c9aa86eda0b20c76a8941423424b0d0d803a29`, 7493 lignes.
- Fichiers de `<SKILL>` (13 fichiers) : empreintes relevées à 16:31, détail dans le dossier temporaire de la session.

## Annexe B — Défauts classés un par un

### Compte A (54 défauts)

#### Journal apprentissage-erreurs-20261104a, passe 2 (defauts_crees: 4)

1. « mesure O0 sur 90 jours impossible avec la colonne Dernière » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
2. « contradiction O0 réfutée contre réfutée ou retenue » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
3. « verdict global de l'oracle de conformité inutilisable » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
4. « trois comptes de classes non expliqués » — classe : terme, colonne ou compte introduit sans définition — acteur : session orchestratrice.

#### Journal apprentissage-erreurs-20261104a, passe 3 (defauts_crees: 4)

5. « champs R4 d'oracle-todo manquants » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
6. « phrase d'ouverture contraire à l'exception d'écriture » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
7. « voie journaliser contre sidecar non tranchée » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
8. « aucune commande pour le plus haut TF » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.

#### Journal competences-openai-gemini-20261103c, passe 2 (defauts_crees: 3)

9. « colonne niveau absente » — classe : terme, colonne ou compte introduit sans définition — acteur : session orchestratrice.
10. « verdict inapplicable à la question 2 » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
11. « rangs pour n < 3 » — classe : terme, colonne ou compte introduit sans définition — acteur : session orchestratrice.

#### Journal competences-openai-gemini-20261103c, passe 3 (defauts_crees: 3)

12. « n à deux sens » — classe : terme, colonne ou compte introduit sans définition — acteur : session orchestratrice.
13. « script non nommé » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
14. « colonnes et bibliothèques » — classe : terme, colonne ou compte introduit sans définition — acteur : session orchestratrice.

#### Journal pentest-20261102j, passe 2 (defauts_crees: 3)

15. « Phase 7 preuves vs partage sans preuves brutes » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
16. « Phase 2/4 : Claude parse/score les sorties brutes (identifiantes) » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
17. « (C) restée absolue » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.

#### Journal make-it-better-20261102d, passe 2 (defauts_crees: 5)

18-22. Non classable (5 défauts). Source : champ `suite` = « les 5 signalements ont été corrigés avant la relecture aveugle ». Le champ ne les décrit pas un par un. Acteur : non établi.

#### Journal make-it-better-20261102d, passe 3 (defauts_crees: 6)

23-28. Non classable (6 défauts). Source : champ `suite` = « le 8e point et les 6 signalements ont été corrigés avant la relecture aveugle ; le confinement a été mesuré par 2 appels réels ». Acteur : non établi.

#### Journal suivi-avancement-20261112a, passe 2 (defauts_crees: 5)

29. « banc arrêté : tué à 20 min, l'état à 30 min est silencieux, pas présumé arrêté » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
30. « point d'étape contre rien de plus » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
31. « les 4 items pour 5 références » — classe : terme, colonne ou compte introduit sans définition — acteur : session orchestratrice.
32. « agents factices contre vrai sous-agent » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
33. « définition du point contre relevé de secours en fichier » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.

#### Journal suivi-temps-couts-20261104c, passe 2 (defauts_crees: 2)

34. « la méthode B ne rendait pas les 4 catégories » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
35. « --projet filtre sur un nom réel de dossier » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.

#### Journal suivi-temps-couts-20261104c, passe 3 (defauts_crees: 1)

36. « --projet pseudonyme exécuté tel quel filtre 0 dossier » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.

#### Journal animations-20261109b, passe 2 (defauts_crees: 3)

37. « npx playwright absent du dépôt alors que le Playwright Python répond pw ok » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
38. « allouer-indice ne réserve rien (deux appels rendent a, a) » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
39. « ordre après la dernière écriture sans comparaison de date » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.

#### Journal animations-20261109b, passe 3 (defauts_crees: 3)

40. « chemins en ~\\ illisibles en Git Bash » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
41. « comparaison date +%s contre stat toujours vraie » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
42. « source chemin:ligne ambiguë avec un chemin Windows absolu » — classe : terme, colonne ou compte introduit sans définition — acteur : session orchestratrice.

#### Journal tri-tiktok-20261102a, passe 2 (defauts_crees: 5)

43-47. Non classable (5 défauts). Source : champ `suite` = « les 5 signalements et le 9e point ont été corrigés avant la relecture aveugle ». Acteur : non établi.

#### Journal pentest-cdc-20261102j, passe 2 (defauts_crees: 4)

48. « coût indexé sur l'exécution » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
49. « trou d'agrégation » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
50. « ÉTAPE 0 isolation » — classe : autre — acteur : session orchestratrice.
51. « chemin go inatteignable » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.

#### Journal pentest-cdc-20261102j, passe 3 (defauts_crees: 3)

52. « coût encore indexé sur baseline mesurée » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
53. « trou d'agrégation » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
54. « ÉTAPE 0 test d'isolation » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.

### Compte B (13 défauts, sur les 2 journaux avec champ texte)

#### Journal amelioration-boucle-20261029b

55. Passe 2 : « Toute variante est notée par un même jury, fixé avant l'expérience : 3 relecteurs neufs et aveugles » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
56. Passe 2 : « Si le devis dépasse le plafond, pose le choix à l'humain » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
57. Passe 2 : « avec consigne_relecteur et rubrique_relecteur telles quelles » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
58. Passe 2 : « un relecteur qui reçoit le prompt de la passe 5 avec les défauts que le relecteur n1 de la passe 5 avait rendus » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
59. Passe 3 : « Consigne du jury : consigne_relecteur avec deux substitutions et aucune autre » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
60. Passe 4 : « plus 4 correcteurs et 1 vérificateur, soit environ 1,7 million de jetons » — classe : terme, colonne ou compte introduit sans définition — acteur : session orchestratrice.

#### Journal strategie-lancement-20261029a

61. Passe 2 : « Durées : pour chaque sous-agent, premier et dernier horodatage de son transcript dans ...subagents » — classe : commande ou outil écrit sans avoir été exécuté — acteur : session orchestratrice.
62. Passe 2 : « en équilibrant la charge estimée [...] une durée estimée inférieure à la référence » — classe : terme, colonne ou compte introduit sans définition — acteur : session orchestratrice.
63. Passe 2 : « Si elle n'est pas finie, mesure la partie close et dis-le. » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
64. Passe 2 : « aucune baisse du taux de sujets clos [...] la référence est chiffrée » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
65. Passe 3 : « durée d'un agent = coût fixe + somme des durées de ses sujets, les deux paramètres tirés des 6 lots » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
66. Passe 4 : « dis-le avec les chiffres, sans retoucher le modèle, et n'écris pas la règle de l'étape 4 » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.
67. Passe 5 : « Un sujet dont la durée marginale b est inférieure à a, l'ordonnée à l'origine du modèle de durée » — classe : contradiction avec un texte resté en place — acteur : session orchestratrice.

Nombre de lignes de l'annexe B : 67 (= compte A 54 + compte B 13).

---

Motifs de noms interdits : 106 motifs, sha256 `d340c234392c5cb38316cb8813aa23e5c07684bb770e5d692d5566dab09b2ba6`, fichier hors dépôt.
