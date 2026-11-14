# Retours forges — Produit-86 — 20261106c

- **Contexte** : clôture du run `20261106b-evolution-chemins-d-execution`. Sur la lettre « 480a », le porteur a demandé pourquoi la décision D-480 lui revenait : couvrir de bout en bout les chemins d'exécution manquants et corriger une dérive de l'infrastructure locale relevaient de sa demande du 05/11. Le run a ajouté ces tests, qui ont trouvé un défaut réel du produit (job d'agent externe en 500, conteneur hors contrôle), corrigé.
- **Références ledger** : `forge\ledger.jsonl` seq 619 et 634 (entrées `type: retour`) ; seq 618 pour la lettre du porteur.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 06/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 06/11/2026 : `todo/CLASSES.json` du pilot, 254 classes, filtré sur `decision|sautable|skip|exclu`. RP-46 se rattache à `decision-posee-hors-du-ressort-humain`, qui existe déjà : la règle est écrite et n'a pas tenu, ce qui est le fait remonté. Aucune classe ne décrit une condition de saut lue hors du contexte où le pan joue (RP-47) : il propose la sienne.

## pilot (doctrine des décisions)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-46 | majeur | générique | La session a posé en décision (D-480) un travail qui prolongeait une demande déjà donnée : couvrir de bout en bout 2 chemins d'exécution jamais joués (le lab WebGoat, le job lancé par un agent externe) et corriger une dérive de l'infrastructure locale. Le porteur avait demandé le 05/11 que les tests nécessaires soient ajoutés d'office, et le redéploiement local sans GO. Il a répondu : « pourquoi ce n'est pas intégré directement par défaut ? ». Rien n'était une dépense, un geste irréversible ou distant. Cause amont : l'étude de couverture du 05/11 énumérait les parcours par écran et par profil, jamais par chemin d'exécution. Le travail fait d'office a trouvé un défaut réel : le job d'agent externe rendait 500 et laissait un conteneur hors contrôle. Ledger seq 619. | Avant de poser une décision, vérifier qu'elle porte un motif qui revient à l'humain (dépense, irréversible, distant, ses données réelles) ; un travail qui prolonge une demande donnée s'exécute. L'étude de couverture énumère aussi les chemins d'exécution (cible × mode de lancement). |

## digit-ai-forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-47 | mineur | générique | La règle TF-2197 (volet c), livrée le 06/11 à 10:35 pendant ce run, écarte du pan `parcours-personas` les fichiers « dont chaque test peut être sauté ». Les tests de bout en bout de ce produit se sautent sans instance désignée (`PENTEST_E2E_URL`) ; le pan les écarte donc même quand l'instance lui est fournie. Il ne rejoue plus que 3 adresses par profil au lieu de 5 : `test_parcours_profils.py`, qui porte `/missions/nouvelle` et `/aide`, n'est plus joué. Le rapport ne dit pas quels fichiers il écarte. Le run avait relevé forge-tests `e9824ba` à son ouverture, et le jeu s'est fait sur `f924b20`. Ledger seq 634. | Ne tenir pour sautable qu'un fichier qui se saute aussi quand l'instance déclarée au pan est fournie, ou lire la condition du saut ; nommer au rapport les fichiers écartés comme sautables. |

## La règle qui aurait évité le retour

- `decision-posee-hors-du-ressort-humain` (RP-46) : une décision n'est posée que si elle porte un motif qui revient à l'humain.
- `condition-de-saut-lue-hors-contexte` (RP-47, classe proposée) : un pan juge une condition de saut dans le contexte où il joue, pas dans l'absolu.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le job lancé par un agent externe rendait 500 : le portail abandonnait l'appel au lanceur à 10 s (démarrage de 6,8 s sur le démon du poste) et le conteneur tournait sans être inscrit | job inscrit avant le lancement, délai de 30 s, refus nommé, conteneur retiré, y compris s'il est arrêté pendant son lancement (commits `5e15245`, `422c0ff`) ; 3 tests unitaires et 2 tests de bout en bout | non : propre à l'exécuteur de ce produit | reste au produit, parce que c'est son code ; la leçon générique est RP-43 (lot 20261106a) |
| La chaîne de déploiement rendait PASS sans convergence ; la sonde de WebGoat n'atteignait pas le conteneur | `deployer.sh` échoue si le plan suivant l'apply n'est pas vide ; sonde sur le port 80, remplacement du conteneur à tout changement de sonde (commits `5e15245`, `7927cb2`) | oui | déjà remonté (RP-44, lot 20261106a) |
| Ma vérification d'arrêt d'un serveur local cherchait « LISTENING » ; `netstat` écrit « ÉCOUTE » sur ce poste, et le serveur du run précédent tournait encore | arrêt vérifié par `Get-NetTCPConnection`, indépendant de la langue | non : geste de session | reste au produit, parce que c'est une erreur de session, corrigée dans le tour |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261106b) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Les tests de bout en bout jugés contre une vérité relevée hors du produit ont trouvé, dès leur premier jeu, un défaut que 616 tests unitaires laissaient passer.
- Le contrôle de convergence ajouté à la chaîne a refusé le premier déploiement qui ne convergeait pas, au lieu de rendre PASS.
- Le hook de remisage a refusé un `git stash` sans étiquette : la preuve du rouge s'est faite sur une copie des fichiers de `HEAD`.

## Ordre recommandé

RP-46 d'abord (c'est un aller-retour du porteur), puis RP-47.
