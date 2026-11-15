---
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — Preuve de chaque affirmation ajoutée par une correction — 20261115a

Étude du 15/11/2026, rédigée par la session du produit `forge-digit-ai-fr` (Claude Opus 5.5), sur la demande du porteur. Elle propose une nouvelle voie pour réduire les défauts que les corrections de prompts introduisent. Les trois propositions de l'étude du 14/11 ont été testées le matin même, et aucune n'a fait mieux que la correction actuelle.

Natures des chiffres : MESURÉ (lu par une commande), DÉCOMPTÉ (compté sur des journaux ou des fichiers), ESTIMÉ (jugement, hypothèse dite).

## Seuil de déclenchement

L'item crée un objet durable : une règle du protocole de la boucle de relecture (`references/boucle.md` du skill `prompt-analyzer-l99`) et un champ de journal. L'étude est donc due.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Le porteur a écrit, le 14/11/2026 : « Les agents de relecture et réécriture du skill améliore le prompt fournissent des propositions pertinentes, mais en corrigeant les erreurs, elles en créent souvent d'autres […] Trouve des moyens d'améliorer la qualité des réponses de ces agents, et des agents de manière générale, pour que le nombre d'erreurs insérées diminue ». Le 15/11/2026, après les tests, il a écrit : « si P1, P2 & P3 ne font pas mieux, travaille une nouvelle proposition d'amélioration ».

L'intention est donc qu'une correction crée moins de défauts. Le succès se mesure au nombre de défauts créés par défaut fermé, pas au score.

## 0. Traitement des entrants

Sources de la proposition, citées comme données :
- l'étude `Digit-AI - Étude - Defauts crees par les corrections des agents - 20261114a.md` et ses propositions P1, P2, P3 (TF-2564, TF-2565, TF-2566) ;
- les tests du 15/11/2026, journalisés sur ces trois candidatures : P1 signale 2 défauts créés sur 11 (18 %, MESURÉ), P3 3 sur 11 (27 %, MESURÉ), et P2 ne crée pas plus de contradictions mais fait perdre 7 à 13 points (MESURÉ, 2 relecteurs appariés) ;
- les 2 boucles L99 de la session produit du 14/11/2026, dont les textes de passe sont intacts : 14 défauts créés pour 14 fermés, relevés par les vérificateurs de clôture (DÉCOMPTÉ, journal de boucle) ;
- l'étude `Digit-AI - Étude - Cout et qualite de la boucle L99 - 20261106b.md` et son optimisation du vérificateur sur le diff (TF-2242).

## 1. Partition du problème

Le problème se découpe en trois sous-questions disjointes.

### Q1. Pourquoi les scripts de P1 et P3 échouent

Les 11 défauts créés dont le texte est intact ont été relus un par un. Ce sont des erreurs de sens, pas de forme. Le tableau les range selon ce qu'il aurait fallu prouver pour les éviter ; il se lit défaut par défaut, dans l'ordre des boucles (ESTIMÉ : classement fait par l'auteur de ces corrections, à confirmer par le test de la section 5).

| Défaut créé (citation abrégée) | Affirmation portée | Preuve qui l'aurait démenti |
|---|---|---|
| dénominateur du taux de détection | une définition de calcul | aucune : c'est un choix de conception |
| champs de l'événement de candidature | les champs qu'accepte le registre | lecture des champs exigés par `oracle-todo.mjs` |
| « différence des valeurs de scores_relecteurs » | les notes sont dans un seul champ | recherche des champs de notes dans les 12 journaux |
| « 7 n'ont aucun scores_relecteurs » | un compte d'absences | la même recherche, sur tous les champs de notes |
| « (sous Bash) : node scripts\allouer-indice.mjs » | la commande tourne sous Bash | exécution de la commande telle qu'écrite |
| « repris du tableau de Q1 » | un renvoi interne | citation du passage visé : il n'existait pas |
| « s'appuie sur la mesure de Q3 » | un renvoi interne | citation de Q3 : aucun indicateur du vérificateur |
| « toutes les lignes … TRANSPOSÉ » | un statut pour chaque ligne | rapprochement avec la colonne d'acteurs de Q1 |
| « la seule durée disponible » | une absence dans le code | recherche des durées dans les scripts cités |
| « publié dans le résultat de oracle-suivi-agents » | une publication | lecture de la condition de publication (SEUIL_MIN) |
| « la seule durée publiée » | une exclusivité | la même lecture, rapprochée du relevé 1 |

10 des 11 défauts sont des **affirmations ajoutées sans leur preuve** : un fait d'environnement, un renvoi interne ou un compte, écrit sans la commande ou la citation qui l'établit (ESTIMÉ). Un script lexical ne voit pas qu'une affirmation manque de preuve ; il voit des mots.

### Q2. Ce qui les a rattrapés quand ils l'ont été

Dans les 2 boucles, les vérificateurs de clôture ont rattrapé 14 défauts créés avant la relecture aveugle (DÉCOMPTÉ). Chaque fois, ils l'ont fait en exécutant une commande ou en citant le passage du prompt qui contredisait la phrase ajoutée. Les 11 défauts du tableau sont ceux qui leur ont échappé : le vérificateur cherche les défauts créés, mais rien ne lui dit quelles phrases du diff affirment quelque chose.

### Q3. Où placer la preuve

Trois places sont possibles : chez celui qui écrit la correction, chez le vérificateur, ou chez les deux. L'étude du 06/11 a déjà placé la vérification chez le vérificateur (TF-2242). La place qui manque est celle de l'écriture : la correction ne produit aujourd'hui que du texte, sans la liste de ce qu'elle affirme.

## 2. Non-recouvrement contre l'existant

Deux mécanismes existants recouvrent en partie la proposition, trois ne la recouvrent pas. Le tableau se lit ligne par ligne : l'existant, la citation qui le décrit, et son recouvrement.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Vérificateur sur le diff (TF-2242) | étude 20261106b : « chaque phrase ajoutée a sa prémisse vérifiée » | recouvre en partie : il vérifie après coup, sans liste des affirmations ; la proposition ajoute la liste, écrite par le correcteur |
| Vérification de clôture de l'essai D-111 (a) | `references/boucle.md`, point 1 bis : le vérificateur « relève les défauts que la correction a créés » | ne recouvre pas : il cherche des défauts, il ne reçoit aucune preuve à contrôler |
| P1 (TF-2564) et P3 (TF-2566) | tests du 15/11/2026 : 18 % et 27 % des défauts signalés | ne recouvre pas : écartées, lexicales |
| P2 (TF-2565) | test du 15/11/2026 : notes 66 et 70 contre 79 et 77 | ne recouvre pas : porte sur la forme de la correction, pas sur sa preuve |
| Recompte des notes reprises (B11, TF-2202) | `references/boucle.md` : « toute NOTE du relecteur […] se recompte aussi avant d'y entrer » | recouvre en partie : il vaut pour les notes du relecteur, pas pour les phrases que le correcteur écrit de lui-même |

## 3. État de l'art daté

État de l'art : non instruit. Motif : la proposition se fonde sur les mesures internes de la Factory du 14 et du 15/11/2026, et le test de la section 5 la juge sur ces mêmes données ; une revue externe n'en changerait pas le seuil.

## 4. Options — jeu fermé O0-O4

### O0 — Ne rien faire

La correction actuelle crée 1 défaut par défaut fermé dans les 2 boucles du 14/11 (MESURÉ), et 0,60 sur les 12 journaux du pilot (DÉCOMPTÉ). Le statu quo garde ce ratio. O0 est réfutée : les 11 défauts du tableau de Q1 sont passés à travers la vérification actuelle.

### O1 — Registre des affirmations écrit par le correcteur

Chaque correction rend, avec son texte, un registre des affirmations qu'elle ajoute ou modifie. Une ligne par affirmation : la phrase, son genre (fait d'environnement, renvoi interne, compte), et sa preuve (la commande et sa sortie, ou la citation du passage visé, ou le calcul). Une phrase sans preuve ne s'écrit pas, ou s'écrit marquée « non prouvée ».

- **Coût** : complexité simple × durée court ; environ 5 000 à 10 000 jetons par correction (ESTIMÉ).
- **Ce qu'elle exclut** : le contrôle des preuves, laissé au correcteur.
- **Risque** : un correcteur peut citer une preuve incomplète, comme pour les durées des 14/11.

### O2 — Registre des affirmations contrôlé par le vérificateur (option recommandée)

O1, plus : le vérificateur de clôture reçoit le registre, contrôle chaque preuve en la rejouant, et cherche dans le diff les phrases qui affirment sans figurer au registre.

- **Coût** : complexité moyen × durée court ; environ 15 000 à 25 000 jetons par correction (ESTIMÉ).
- **Compris** : l'écriture de la preuve, son contrôle, la recherche des omissions. **Non compris** : la recherche des défauts anciens, qui reste aux relecteurs aveugles. **Conséquence** : le ratio de défauts créés baisse si les affirmations sans preuve en sont la cause, comme le tableau de Q1 l'estime.
- **Risque** : le vérificateur valide une preuve fausse. Parade : il rejoue la preuve, il ne la lit pas seulement.

### O3 — O2, plus un relecteur aveugle centré sur le texte ajouté

O2, plus un troisième relecteur aveugle qui ne lit que les passages ajoutés.

- **Coût** : complexité moyen × durée moyen ; environ 100 000 jetons de plus par passe (ESTIMÉ, d'après le coût mesuré d'un relecteur).
- **Ce qu'elle exclut** : rien de plus qu'O2.
- **Risque** : la dépense double pour un gain que rien ne mesure encore.

### O4 — O2 étendue à tous les agents qui écrivent

O2, appliquée aussi aux agents campagne, constructeur et rédacteur : leur rapport final porte le registre des affirmations de ce qu'ils ont écrit, et la relecture à la réception le contrôle.

- **Coût** : complexité complexe × durée moyen ; un champ du contrat de campagne et un point de la relecture d'intention.
- **Ce qu'elle exclut** : rien.
- **Risque** : étendre avant d'avoir mesuré sur la boucle.

## 5. Verdict

- **Option retenue** : O2 — registre des affirmations écrit par le correcteur et contrôlé par le vérificateur.
- **Coût** : complexité moyen × durée court ; environ 15 000 à 25 000 jetons par correction (ESTIMÉ).
- **Test, avant toute application** : le même banc que le test de P2 du 15/11/2026. Même prompt de départ et mêmes 7 défauts ; un rédacteur neuf écrit la correction avec son registre, un vérificateur la contrôle, puis 2 relecteurs appariés et aveugles la jugent face au témoin, lui aussi passé par le vérificateur actuel. Budget : environ 450 000 jetons (ESTIMÉ). Seuil fixé avant : le bras O2 porte au moins 2 défauts graves de moins que le témoin, à l'union recomptée, et sa note n'est pas inférieure de plus de 2 points.
- **Candidature(s) émise(s)** : une création au registre, au statut `candidat`, par `todo/journaliser.mjs`.
- **Plan de revue** : 2026-12-14, avec la revue du mandat D-219 (e). Critère : le test est joué, et son résultat est au registre.
- **Test rétro** :
  - **Opérationnel → Tactique** : le registre des affirmations et son contrôle (opérationnel) servent à empêcher qu'une affirmation sans preuve entre dans un prompt (tactique, Q1 et Q3).
  - **Tactique → Stratégie** : moins d'affirmations sans preuve, donc moins de défauts créés par correction (stratégie).
  - **Stratégie → Intention** : « que le nombre d'erreurs insérées diminue ».
  - **Questions du demandeur rejouées** : « améliorer la qualité des réponses de ces agents » est servi par le registre du correcteur ; « et des agents de manière générale » par l'option O4, gardée pour après la mesure ; « travaille une nouvelle proposition » par cette étude, qui part de l'échec mesuré de P1, P2 et P3.

## Interdits (l'oracle les tient)

Aucun critère subjectif sans mesure ; aucune option hors du jeu fermé ; aucune ligne de non-recouvrement sans citation ; état de l'art déclaré non instruit avec son motif ; O0 traitée.
