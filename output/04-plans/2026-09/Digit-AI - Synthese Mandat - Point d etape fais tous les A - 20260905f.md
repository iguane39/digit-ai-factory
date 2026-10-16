---
destinataire: humain
---

# Synthèse de mandat — point d'étape du second « fais tous les A » : le pilot a fini sa part, les quatre forges travaillent (05/09/2026)

Votre second mandat portait sur les actions restantes de la synthèse précédente. Côté pilot, c'est fait : la candidature sur les gardes lexicales est décidée, instruite et publiée, avec la preuve avant et après. Côté forges, quatre agents ont été lancés en parallèle, un par forge, chacun avec le lot déposé ce matin comme cahier des charges, l'obligation de jouer les oracles de sa forge et de remettre son compte rendu dans la boîte d'entrée du pilot ; le premier, celui de la forge de développement, a rendu son compte rendu : son travail est jugé conforme, ingéré et l'item est clos ; les trois autres travaillent encore au moment où ce point d'étape est rendu. Un défaut du pilot a été vu en passant : l'ingestion a caché le nom de la forge derrière un pseudonyme de produit, ce qu'une forge, publique, n'appelle pas — consigné en candidat. Côté produit 02, rien n'a été écrit : sa session est vivante (son journal a bougé il y a dix minutes, cent six fichiers y sont en cours), et écrire dans un journal où quelqu'un écrit est exactement ce qui a produit la collision de ce matin. Ce qui change pour vous : le pilot n'a plus de reste propre. Ce qui est attendu de vous : rien maintenant ; le tour suivant, déclenché par l'arrivée des comptes rendus, clôturera les items des forges et vous dira ce qu'elles ont fait.

## 1. En-tête d'identification

- **quoi** — mandat humain « fais tous les A » (second, 05/09 après-midi) sur la synthèse 20260905e : A-24 fait ; A-20 à A-23 lancés en parallèle chez les forges (en cours) ; A-25 et A-19 différés (session vivante chez le produit) ; A-6 et A-17 inchangés.
- **sur quoi** — le pilot `digit-ai-factory` (oracle de restitution, registre, vues) ; quatre dépôts frères par agents mandatés, en cours ; le produit 02 lu seulement.
- **quand** — point d'étape le **05/09/2026 à 14:05 (UTC+02:00)**, ≈ 15 minutes après votre mandat ; les agents continuent au-delà.
- **qui** — Claude Fable 5.1 (extension VS Code) et quatre agents subordonnés ; pilot en version `6e92bd8` après publication, base `0d043a3` avant.

## 2. Verdict en une ligne

TF-0805 **corrigé** et publié (self-test de l'oracle de restitution 13 → 14, preuve avant/après sur fixture réelle) ; TF-0798 **corrigé** chez forge-development (tests 385 → 400, gate double sens, lot de retours PASS et ingéré, 1 récidive TF-0806 et 1 candidat TF-0807) ; 3 agents en cours chez forge-design, forge-conception, forge-tests ; produit 02 **non touché** (session vivante mesurée) ; banc 92/93 (défaut restant : les compétences installées divergent de sources que les forges sont en train de modifier).

## 3. Décisions attendues

Rien n'attend de décision à ce point d'étape ; D-7 reste ouverte avec son option par défaut en place.

## 4. Traité — avec sa preuve

- **A-24 — TF-0805 décidé sur votre mandat, puis instruit et clos** — classe : une garde lexicale à frontière de mot ASCII sur du texte français ; contrôle rouge → vert : sur la fixture réelle, la trace « accès tenté … refusé » était invisible (faux) et devient lue (vrai), self-test 13 → 14 cas. Une aide réécrit toute frontière ASCII d'un motif en frontière Unicode équivalente et pose le drapeau `u` ; onze motifs de l'oracle de restitution passent par elle (S8, S21, S26, S27, S28, S34, S35, S37) ; fixture double sens ajoutée.
  - preuve : `oracles\oracle-synthese.mjs --self-test` : 14/14 PASS ; script de preuve lu en UTF-8 : « avant : false | après : true » sur la ligne de fixture, « mesuré » idem ; non-régression : la synthèse 20260905e rend PASS avant et après ; événements `decide` puis `corrige` journalisés (PASS) ; commit `6e92bd8` poussé.
- **Quatre agents lancés en parallèle**, un par forge, avec le lot déposé ce matin comme cahier des charges et des règles fermées : écrire seulement dans leur forge et dans la boîte d'entrée du pilot, jouer tous les oracles de la forge, recette double sens par règle nouvelle, commit local sans publication, compte rendu au gabarit des lots de retours jugé par l'oracle du pilot.
  - preuve : quatre agents actifs (identifiants internes au harnais) ; une garde attend les quatre fichiers `<forge> - RETOURS - 20260905a.md` dans `input\00-retours\` du pilot (0 arrivé à 14:05).
- **A-21 — TF-0798 clos chez forge-development** — classe : un statique servi nu que le gabarit de projet propage à chaque instanciation ; contrôle rouge → vert : tests de la forge 385 → 400, double sens joué sur un projet instancié (statiques nus → exit 1 avec quatre constats nommés ; versionnés avec `Cache-Control` → exit 0). L'agent a ajouté la huitième discipline de production au manuel de run, un gate « static-cache » à trois classes de constat avec 15 cas, et un quatrième contrôle après déploiement ; il a choisi `?v=<version>` par défaut, empreinte acceptée à égalité, et dit pourquoi. Non fait, déclaré : pas de question dans le gabarit externe non forké, gate non câblé en intégration continue (vert décoratif), `curl` sur instance neuve (aucune servie).
  - preuve : commit local `00097b6` de la forge (non publié) ; lot `digit-ai-forge-development - RETOURS - 20260905a.md` jugé PASS par `gabarits\oracle-lot-retours.mjs`, ingéré (1 candidature TF-0806, récidive de la classe close par TF-0732 chez forge-agents) ; événement `corrige` TF-0798 journalisé (PASS).
- **Un défaut du pilot vu en passant et consigné** : l'ingestion d'un lot remis par une forge la pseudonymise comme un produit client et l'inscrit à la table hors dépôt ; une forge est publique.
  - preuve : sortie de l'ingestion « produit du lot → Produit-60, 1 nom substitué » ; candidature TF-0807 (candidat, score complet) ; la table hors dépôt porte l'entrée parasite, laissée en place jusqu'à décision pour ne pas rendre le registre illisible.
- **La session vivante du produit 02 mesurée avant de ne pas y écrire**.
  - preuve : journal du produit modifié à 13:50:59 (seq 119 non commise), 106 fichiers en cours à 14:00 ; dernier commit du produit à 10:05.

## 5. Non traité — avec son motif

- **A-25 et A-19 (journal et contrôles du produit 02)** : *garde-fou* — une session y écrit ; le pilot n'écrit pas dans un journal où quelqu'un écrit (collision de ce matin, TF-0794) ; à rejouer quand le produit est au repos, ou par sa propre session.
- **A-20, A-22, A-23** : *en cours* — trois agents n'ont pas encore remis leur compte rendu ; leurs commits locaux et leurs lots seront lus, jugés et clos au tour suivant.
- **TF-0806 (récidive chez forge-agents) et TF-0807 (ingestion d'un lot de forge)** : *tout entre en candidat* — décision humaine.
- **A-6 (l'autre poste)** : *impossible à prouver ici* — inchangé.
- **A-17 (nom du dépôt de file)** : *dépendance à une décision humaine* — D-7 non tranchée.
- **Les compétences installées** (oracle des skills rouge au banc) : *en cours* — les forges modifient leurs sources ; le remède d'application se rejoue quand elles ont fini.

## 6. Écarts à la lettre

- Vous avez demandé « tous les A » → deux actions chez le produit 02 sont différées → parce que sa session est vivante, mesurée à la minute, et que le mandat ne peut pas lever une contrainte physique sans recréer le défaut qu'il corrige.
- A-20 à A-23 disaient « ouvrir une session chez chaque forge » → quatre agents mandatés font ce travail en parallèle → parce qu'un mandat humain les autorise et qu'un seul fil aurait mis les quatre forges en file.
- Ce point d'étape est rendu avant la fin → parce qu'un compte rendu de fin de tour se doit à chaque tour, et que les agents rendront le leur au tour suivant.

## 7. Risques

- **Un agent qui déborde de son périmètre** (écriture hors de sa forge, publication).
  - signal : un fichier inattendu dans un autre dépôt, ou un `git push` dans le rapport d'un agent.
  - parade : les règles sont fermées dans le brief ; le rapport final de chaque agent liste les fichiers écrits hors de sa forge et est relu avant clôture.
- **Un compte rendu de forge refusé par l'oracle du lot**.
  - signal : verdict FAIL de `oracle-lot-retours` sur un lot arrivé.
  - parade : renvoyer l'agent sur le lot avec le constat, avant ingestion.
- **Le produit 02 reste avec deux seq 118** tant que la rectification n'est pas écrite.
  - signal : R-42 (l'intégrité du journal de run) FAIL persistant sur le produit.
  - parade : l'action A-25 reste écrite, à jouer par la session du produit ou au repos.

## 8. Prochaines actions

Ordre de traitement : d'abord la lecture des quatre comptes rendus, parce qu'ils conditionnent la clôture des sept items de forges ; puis le remède des compétences installées, parce qu'il dépend de la fin des forges ; puis le produit au repos ; les restes humains ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-26 | TF-0796, TF-0797, TF-0800, TF-0799, TF-0804, TF-0803 | Lire les trois comptes rendus restants dès leur arrivée, juger chaque lot (`gabarits\oracle-lot-retours.mjs`), ingérer les constats nouveaux, clore au registre les items faits avec leurs gains, renvoyer un agent sur ce qui ne l'est pas. | `auto_ia` | `dependance_externe` — les agents n'ont pas fini (garde armée sur la boîte d'entrée). | Sept items décidés restent ouverts alors que le travail est fait chez les forges. |
| A-27 | `neuve` | Rejouer `node oracles\oracle-skills.mjs --racine "C:\dev"` puis `--appliquer` si les seules divergences sont des sources modifiées par les forges ce jour, et relire K2. | `auto_ia` | `dependance_externe` — les sources bougent tant que les agents travaillent. | Les compétences installées jugent avec des règles d'avant les chantiers du jour. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : relire sa queue, ajouter l'entrée de rectification de la seq 118 en un seul append, rejouer R-42 jusqu'à PASS. | `auto_ia` | `garde_fou` — une session vit chez le produit (journal modifié à 13:50:59, 106 fichiers en cours à 14:00) ; écrire pendant qu'elle écrit reproduit la collision du matin. | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur ; trace mesurée : quatre fichiers modifiés parmi les 106 en cours. | Un nettoyage efface les chemins d'échec prouvés. |
| A-6 | `neuve` (reprise) | Sur l'autre poste : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot. | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée ou forcée. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7 (synthèse 20260905c), non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Pilot : commits `6e92bd8` (TF-0805, `oracles\oracle-synthese.mjs`, `oracles\baseline-recettes.json`) et `5a57f21` (TF-0798 clos, lot de forge-development ingéré, TF-0806, TF-0807), poussés ; ce point d'étape part dans le commit suivant.
- Forge-development : commit local `00097b6` (`docs\run-playbook.md`, `conductor\gates\static_cache_gate.py`, `tests\test_static_cache_gate.py`, `contracts.py`), non publié ; lot de travaux marqué traité.
- Preuve : `scratchpad\preuve-tf0805.mjs` (fixture `accent-final.md` du self-test, lue en UTF-8).
- Registre : `todo\TODO.jsonl` — TF-0805 décidé puis corrigé ; vues `todo\TODO.md`, `todo\AVANCEMENT.md` (15 ouverts, 9 fermés).
- Forges : lots déposés ce matin (`input\00-travaux\pilot - TRAVAUX - 20260905a.md` chez trois forges, `input\00-retours\digit-ai-factory - RETOURS - 20260905a.md` chez forge-tests) ; comptes rendus attendus dans `input\00-retours\` du pilot.
- Oracles rejoués : `oracles\oracle-synthese.mjs --self-test` (14/14) · `oracles\self-tests.mjs` (92/93) · `todo\oracle-todo.mjs` (PASS).
